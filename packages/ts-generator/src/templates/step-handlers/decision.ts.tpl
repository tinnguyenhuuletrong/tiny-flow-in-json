private async *{{stepName}}(): StepIt<EStep, any> {
  {{conditions}}
 
  {{unConditions}}
  // Default case if no condition is met
  return { nextStep: null };
}
