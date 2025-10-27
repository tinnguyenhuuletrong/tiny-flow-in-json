private async *{{stepName}}(): StepIt<EStep, {{nextStepName}}> {
  return { nextStep: {{nextStepName}} };
}
