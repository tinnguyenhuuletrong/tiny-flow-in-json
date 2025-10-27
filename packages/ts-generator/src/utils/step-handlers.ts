import type { Flow } from "@tiny-json-workflow/core";
import { pascalCase } from "./string";
import { loadTemplate } from "./template";

export async function generateStepHandlers(
  flowJson: Flow,
  baseIndentLevel: number = 1
): Promise<string> {
  const baseIndent = "  ".repeat(baseIndentLevel);
  const bodyIndent = "  ".repeat(baseIndentLevel + 1);

  const handlers = await Promise.all(
    flowJson.steps.map(async (step) => {
      const stepName = pascalCase(step.id);
      const nextStep = flowJson.connections.find(
        (c) => c.sourceStepId === step.id
      )?.targetStepId;
      const nextStepName = nextStep ? `EStep.${pascalCase(nextStep)}` : "null";

      switch (step.type) {
        case "begin":
          return await loadTemplate("step-handlers/begin.ts.tpl", {
            stepName,
            nextStepName,
          });
        case "end":
          return await loadTemplate("step-handlers/end.ts.tpl", {
            stepName,
          });
        case "task":
          return await loadTemplate("step-handlers/task.ts.tpl", {
            stepName,
            nextStepName,
          });
        case "decision":
          const decisionConnections = flowJson.connections.filter(
            (c) => c.sourceStepId === step.id
          );
          const conditionIndent = "  ".repeat(baseIndentLevel + 2); // 6 spaces
          const conditions = decisionConnections
            .filter((c) => c.condition)
            .map(
              (c) =>
                `
${bodyIndent}if (this.state.${c.condition}) {
${conditionIndent}return { nextStep: EStep.${pascalCase(c.targetStepId)} };
${bodyIndent}}
`
            )
            .join("\n");

          const unConditions = decisionConnections
            .filter((c) => !c.condition)
            .map(
              (c) =>
                `
${bodyIndent}return { nextStep: EStep.${pascalCase(c.targetStepId)} };
`
            )
            .join("\n");

          return await loadTemplate("step-handlers/decision.ts.tpl", {
            stepName,
            conditions,
            unConditions,
          });
        default:
          return "";
      }
    })
  );

  return handlers.join("\n\n");
}
