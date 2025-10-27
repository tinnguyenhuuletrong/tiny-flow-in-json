import type { Flow } from "@tiny-json-workflow/core";
import { pascalCase } from "./string";
import { renderTemplate } from "./template";
import {
  BEGIN_HANDLER_TEMPLATE,
  DECISION_HANDLER_TEMPLATE,
  END_HANDLER_TEMPLATE,
  TASK_HANDLER_TEMPLATE,
} from "../templates";

export function generateStepHandlers(
  flowJson: Flow,
  baseIndentLevel: number = 1
): string {
  const baseIndent = "  ".repeat(baseIndentLevel);
  const bodyIndent = "  ".repeat(baseIndentLevel + 1);

  const handlers = flowJson.steps.map((step) => {
    const stepName = pascalCase(step.id);
    const nextStep = flowJson.connections.find(
      (c) => c.sourceStepId === step.id
    )?.targetStepId;
    const nextStepName = nextStep ? `EStep.${pascalCase(nextStep)}` : "null";

    switch (step.type) {
      case "begin":
        return renderTemplate(BEGIN_HANDLER_TEMPLATE, {
          stepName,
          nextStepName,
        });
      case "end":
        return renderTemplate(END_HANDLER_TEMPLATE, {
          stepName,
        });
      case "task":
        return renderTemplate(TASK_HANDLER_TEMPLATE, {
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

        return renderTemplate(DECISION_HANDLER_TEMPLATE, {
          stepName,
          conditions,
          unConditions,
        });
      default:
        return "";
    }
  });

  return handlers.join("\n\n");
}
