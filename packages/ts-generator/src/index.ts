import { promises as fs } from "fs";
import type { Flow, Step } from "@tiny-json-workflow/core";

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

function pascalCase(str: string): string {
  const camelCase = str.replace(/[-_\s]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : ""
  );
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

function generateTStateShape(globalStateSchema: any): string {
  if (!globalStateSchema || !globalStateSchema.properties) {
    return `type TStateShape = Record<string, any>;`;
  }

  const properties = Object.entries(globalStateSchema.properties)
    .map(([key, value]: [string, any]) => {
      let type = "any";
      switch (value.type) {
        case "string":
          type = "string";
          break;
        case "number":
        case "integer":
          type = "number";
          break;
        case "boolean":
          type = "boolean";
          break;
        case "object":
          type = "Record<string, any>";
          break;
        case "array":
          type = "any[]";
          break;
      }
      const isRequired = globalStateSchema.required?.includes(key);
      return `  ${key}${isRequired ? "" : "?"}: ${type};`;
    })
    .join("\n");

  return `type TStateShape = {\n${properties}\n};`;
}

function generateStepHandlers(flowJson: Flow): string {
  return flowJson.steps
    .map((step) => {
      const stepName = pascalCase(step.id);
      const nextStep = flowJson.connections.find(
        (c) => c.sourceStepId === step.id
      )?.targetStepId;
      const nextStepName = nextStep ? `EStep.${pascalCase(nextStep)}` : "null";

      switch (step.type) {
        case "begin":
          return `  private async *${stepName}(): StepIt<EStep, ${nextStepName}> {\n    return { nextStep: ${nextStepName} };\n  }`;
        case "end":
          return `  private async *${stepName}(): StepIt<EStep, null> {\n    return { nextStep: null };\n  }`;
        case "task":
          return `  private async *${stepName}(): StepIt<EStep, ${nextStepName}> {\n    await this.tasks.${stepName}(this.state);
    return { nextStep: ${nextStepName} };\n  }`;
        case "decision":
          const decisionConnections = flowJson.connections.filter(
            (c) => c.sourceStepId === step.id
          );
          const conditions = decisionConnections
            .filter((c) => c.condition)
            .map(
              (c) =>
                `    if (this.state.${
                  c.condition
                }) {\n      return { nextStep: EStep.${pascalCase(
                  c.targetStepId
                )} };\n    }`
            )
            .join("\n");

          const unConditions = decisionConnections
            .filter((c) => !c.condition)
            .map(
              (c) =>
                `    {\n      return { nextStep: EStep.${pascalCase(
                  c.targetStepId
                )} };\n    }`
            )
            .join("\n");

          return `  private async *${stepName}(): StepIt<EStep, any> {\n${conditions}\n \n${unConditions}\n   // Default case if no condition is met\n    return { nextStep: null };\n  }`;
        default:
          return "";
      }
    })
    .join("\n\n");
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
    .map((step) => `${pascalCase(step.id)}: (context: any) => Promise<any>`);

  const tasksType = `type Tasks = {\n${taskSignatures
    .map((sig) => `  ${sig}`)
    .join(",\n")}\n}`;

  const constructor = `  constructor(private tasks: Tasks) {\n    super(EStep.${pascalCase(
    flowJson.steps.find((s) => s.type === "begin")?.id || "Begin"
  )}, {\n      withAuditLog: true,\n    });\n\n    Object.values(EStep).map((step) =>
      this.stepHandler.set(step, this[step].bind(this))
    );
  }`;

  const stepHandlers = generateStepHandlers(flowJson);

  const generatedCode = `
// -----------------
${GENERATED_SECTION_START}
// -----------------
// This section is automatically generated and will be overwritten.

import { DurableState, type StepIt } from "@tiny-json-workflow/runtime-durable-state";

${eStepEnum}

${tStateShape}

${tasksType}

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
      )}(context: any): Promise<any> {\n  // TODO: Implement task '${
        step.name
      }'\n  return {};\n}`
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
