import { promises as fs } from "fs";
import type { Flow } from "@tiny-json-workflow/core";
import { generateTStateShape } from "./utils/schema-to-ts";
import { pascalCase } from "./utils/string";
import { generateStepHandlers } from "./utils/step-handlers";
import { renderTemplate } from "./utils/template";
import {
  CONSTRUCTOR_TEMPLATE,
  ENUM_TEMPLATE,
  IMPLEMENTATION_TEMPLATE,
  MAIN_TEMPLATE,
  TASKS_TEMPLATE,
  WORKFLOW_CLASS_TEMPLATE,
} from "./templates";

const IMPLEMENTATION_SECTION_START = "// --- IMPLEMENTATION ---";

async function parseExistingFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const implementationIndex = content.indexOf(IMPLEMENTATION_SECTION_START);

    if (implementationIndex === -1) {
      return "";
    }

    return content.substring(implementationIndex);
  } catch (error) {
    return "";
  }
}

export async function generate(
  flowJsonPath: string,
  outputTsPath: string
): Promise<void> {
  const implementationContent = await parseExistingFile(outputTsPath);

  const flowJsonContent = await fs.readFile(flowJsonPath, "utf-8");
  const flowJson = JSON.parse(flowJsonContent) as Flow;

  const workflowClassName = pascalCase(flowJson.name);

  const eStepEnum = renderTemplate(ENUM_TEMPLATE, {
    steps: flowJson.steps
      .map((step) => `${pascalCase(step.id)} = '${pascalCase(step.id)}'`)
      .join(",\n  "),
  });

  const tStateShape = generateTStateShape(flowJson.globalStateSchema);

  const taskSignatures = flowJson.steps
    .filter((step) => step.type === "task")
    .map(
      (step) =>
        `${pascalCase(step.id)}: (context: TStateShape) => Promise<TStateShape>`
    );

  const tasksType = renderTemplate(TASKS_TEMPLATE, {
    taskSignatures: taskSignatures.map((sig) => `${sig}`).join(",\n  "),
  });

  const constructor = renderTemplate(CONSTRUCTOR_TEMPLATE, {
    startStep: pascalCase(
      flowJson.steps.find((s) => s.type === "begin")?.id || "Begin"
    ),
  });

  const stepHandlers = generateStepHandlers(flowJson, 1);

  const workflowClass = renderTemplate(WORKFLOW_CLASS_TEMPLATE, {
    workflowClassName,
    constructor,
    stepHandlers,
  });

  const implementationSection =
    implementationContent ||
    renderTemplate(IMPLEMENTATION_TEMPLATE, {
      functions: flowJson.steps
        .filter((step) => step.type === "task")
        .map(
          (step) =>
            `async function ${pascalCase(
              step.id
            )}(context: TStateShape): Promise<TStateShape> {\n  // TODO: Implement task '${
              step.name
            }'\n  return context;\n}`
        )
        .join("\n\n"),
      workflowClassName,
      tasks: flowJson.steps
        .filter((step) => step.type === "task")
        .map((step) => pascalCase(step.id))
        .join(",\n    "),
    });

  const generatedCode = renderTemplate(MAIN_TEMPLATE, {
    eStepEnum,
    tStateShape,
    tasksType,
    workflowClass,
  });

  const finalContent = `${generatedCode.trim()}\n${implementationSection.trim()}`;

  await fs.writeFile(outputTsPath, finalContent);
}
