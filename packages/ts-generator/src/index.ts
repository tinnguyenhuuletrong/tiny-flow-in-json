import { promises as fs } from "fs";
import type { Flow } from "@tiny-json-workflow/core";
import { generateTStateShape } from "./utils/schema-to-ts";
import { pascalCase } from "./utils/string";
import { generateStepHandlers } from "./utils/step-handlers";
import { loadTemplate } from "./utils/template";

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

  const eStepEnum = await loadTemplate("enum.ts.tpl", {
    steps: flowJson.steps
      .map((step) => `  ${pascalCase(step.id)} = '${pascalCase(step.id)}'`)
      .join(",\n"),
  });

  const tStateShape = generateTStateShape(flowJson.globalStateSchema);

  const taskSignatures = flowJson.steps
    .filter((step) => step.type === "task")
    .map(
      (step) =>
        `${pascalCase(step.id)}: (context: TStateShape) => Promise<TStateShape>`
    );

  const tasksType = await loadTemplate("tasks.ts.tpl", {
    taskSignatures: taskSignatures.map((sig) => `  ${sig}`).join(",\n"),
  });

  const constructor = await loadTemplate("constructor.ts.tpl", {
    startStep: pascalCase(
      flowJson.steps.find((s) => s.type === "begin")?.id || "Begin"
    ),
  });

  const stepHandlers = await generateStepHandlers(flowJson, 1);

  const workflowClass = await loadTemplate("workflow-class.ts.tpl", {
    workflowClassName,
    constructor,
    stepHandlers,
  });

  const implementationSection =
    implementationContent ||
    (await loadTemplate("implementation.ts.tpl", {
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
    }));

  const generatedCode = await loadTemplate("main.ts.tpl", {
    eStepEnum,
    tStateShape,
    tasksType,
    workflowClass,
  });

  const finalContent = `${generatedCode.trim()}\n${implementationSection.trim()}`;

  await fs.writeFile(outputTsPath, finalContent);
}
