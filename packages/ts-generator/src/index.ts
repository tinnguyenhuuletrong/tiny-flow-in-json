import { promises as fs } from "fs";
import type { Flow, Step } from "@tiny-json-workflow/core";
import { generateTStateShape } from "./utils/schema-to-ts";
import { pascalCase } from "./utils/string";
import { generateStepHandlers } from "./utils/step-handlers";

const GENERATED_SECTION_START = "// --- GENERATED ---";
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

  const eStepEnum = `enum EStep {\n${flowJson.steps
    .map((step) => `  ${pascalCase(step.id)} = '${pascalCase(step.id)}'`)
    .join(",\n")}\n}`;

  const tStateShape = generateTStateShape(flowJson.globalStateSchema);

  const taskSignatures = flowJson.steps
    .filter((step) => step.type === "task")
    .map(
      (step) =>
        `${pascalCase(step.id)}: (context: TStateShape) => Promise<TStateShape>`
    );

  const tasksType = `type Tasks = {\n${taskSignatures
    .map((sig) => `  ${sig}`)
    .join(",\n")}\n}`;

  const constructor = `  constructor(private tasks: Tasks) {\n    super(EStep.${pascalCase(
    flowJson.steps.find((s) => s.type === "begin")?.id || "Begin"
  )}, {\n      withAuditLog: true,\n    });\n\n    Object.values(EStep).map((step) =>
      this.stepHandler.set(step, this[step].bind(this))
    );
  }`;

  const stepHandlers = generateStepHandlers(flowJson, 1);

  const generatedCode = `
// -----------------
${GENERATED_SECTION_START}
// -----------------
// This section is automatically generated and will be overwritten.

import { DurableState, type StepIt } from "@tiny-json-workflow/runtime-durable-state";

export ${eStepEnum}

export ${tStateShape}

export ${tasksType}

export class ${workflowClassName} extends DurableState<EStep, TStateShape, any> {\n${constructor}\n\n${stepHandlers}\n\n}
`;

  const implementationSection =
    implementationContent ||
    `
${IMPLEMENTATION_SECTION_START}

${flowJson.steps
  .filter((step) => step.type === "task")
  .map(
    (step) =>
      `async function ${pascalCase(
        step.id
      )}(context: TStateShape): Promise<TStateShape> {\n  // TODO: Implement task '${
        step.name
      }'\n  return context;\n}`
  )
  .join(
    "\n\n"
  )}\n\nexport function createWorkflow() {\n  return new ${workflowClassName}({\n    ${flowJson.steps
      .filter((step) => step.type === "task")
      .map((step) => pascalCase(step.id))
      .join(",\n    ")}
  });\n}
`;

  const finalContent = `${generatedCode.trim()}\n${implementationSection.trim()}`;

  await fs.writeFile(outputTsPath, finalContent);
}
