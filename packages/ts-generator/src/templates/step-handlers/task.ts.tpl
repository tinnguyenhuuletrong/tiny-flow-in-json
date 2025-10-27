private async *{{stepName}}(): StepIt<EStep, {{nextStepName}}> {
  const res = await this.withAction<TStateShape>("{{stepName}}", async () => { 
    return this.tasks.{{stepName}}(this.state); 
  }); 

  if (res.it) yield res.it;
  if (res.value) this.state = res.value;
  return { nextStep: {{nextStepName}} };
}
