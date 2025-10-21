import type { Flow } from "@tiny-json-workflow/core";
import { pascalCase } from "./string";

export function generateStepHandlers(
  flowJson: Flow,
  baseIndentLevel: number = 1
): string {
  const baseIndent = "  ".repeat(baseIndentLevel);
  const bodyIndent = "  ".repeat(baseIndentLevel + 1);

  return flowJson.steps
    .map((step) => {
      const stepName = pascalCase(step.id);
      const nextStep = flowJson.connections.find(
        (c) => c.sourceStepId === step.id
      )?.targetStepId;
      const nextStepName = nextStep ? `EStep.${pascalCase(nextStep)}` : "null";

      switch (step.type) {
        case "begin":
          return `
${baseIndent}private async *${stepName}(): StepIt<EStep, ${nextStepName}> {
${bodyIndent}return { nextStep: ${nextStepName} };
${baseIndent}}
`;
        case "end":
          return `
${baseIndent}private async *${stepName}(): StepIt<EStep, null> {
${bodyIndent}return { nextStep: null };
${baseIndent}}
`;
        case "task":
          return `
${baseIndent}private async *${stepName}(): StepIt<EStep, ${nextStepName}> {
${bodyIndent}const res = await this.withAction<TStateShape>("${stepName}", async () => { 
${bodyIndent}  return this.tasks.${stepName}(this.state); 
${bodyIndent}}); 

${bodyIndent}if (res.it) yield res.it;
${bodyIndent}if (res.value) this.state = res.value;
${bodyIndent}return { nextStep: ${nextStepName} };
${baseIndent}}
`;
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
${bodyIndent}{
${conditionIndent}return { nextStep: EStep.${pascalCase(c.targetStepId)} };
${bodyIndent}}
`
            )
            .join("\n");

          return `
${baseIndent}private async *${stepName}(): StepIt<EStep, any> {
${conditions}
 
${unConditions}
${bodyIndent}// Default case if no condition is met
${bodyIndent}return { nextStep: null };
${baseIndent}}
`;
        default:
          return "";
      }
    })
    .join("\n\n");
}
