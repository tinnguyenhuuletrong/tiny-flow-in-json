export const CONSTRUCTOR_TEMPLATE = `
constructor(private tasks: Tasks) {
  super(EStep.{{startStep}}, {
    withAuditLog: true,
  });

  if (defaultState) this.setState(defaultState);

  Object.values(EStep).map((step) =>
    this.stepHandler.set(step, this[step].bind(this))
  );
}
` as const;

export const ENUM_TEMPLATE = `
enum EStep {
  {{steps}}
}
` as const;

export const IMPLEMENTATION_TEMPLATE = `
// --- IMPLEMENTATION ---

{{functions}}

export function createWorkflow() {
  return new {{workflowClassName}}({
    {{tasks}}
  });
}
` as const;

export const MAIN_TEMPLATE = `
// -----------------
// --- GENERATED ---
// -----------------
// This section is automatically generated and will be overwritten.

import { DurableState, type StepIt } from "@tiny-json-workflow/runtime-durable-state";

export {{eStepEnum}}

export {{tStateShape}}

{{tParamsShapes}}

export {{tasksType}}

{{workflowClass}}
` as const;

export const BEGIN_HANDLER_TEMPLATE = `
private async *{{stepName}}(): StepIt<EStep, {{nextStepName}}> {
  return { nextStep: {{nextStepName}} };
}
` as const;

export const DECISION_HANDLER_TEMPLATE = `
private async *{{stepName}}(): StepIt<EStep, any> {
  {{conditions}}
 
  {{unConditions}}
  // Default case if no condition is met
  return { nextStep: null };
}
` as const;

export const END_HANDLER_TEMPLATE = `
private async *{{stepName}}(): StepIt<EStep, null> {
  return { nextStep: null };
}
` as const;

export const TASK_HANDLER_TEMPLATE = `
private async *{{stepName}}(): StepIt<EStep, {{nextStepName}}> {
  const res = await this.withAction<TStateShape>("{{stepName}}", async () => { 
    return this.tasks.{{stepName}}(this.state, {{params}}); 
  }); 

  if (res.it) yield res.it;
  if (res.value) this.state = res.value;
  return { nextStep: {{nextStepName}} };
}
` as const;

export const TASKS_TEMPLATE = `
type Tasks = {
  {{taskSignatures}}
}
` as const;

export const WORKFLOW_CLASS_TEMPLATE = `
export class {{workflowClassName}} extends DurableState<EStep, TStateShape, any> {
  {{constructor}}

  {{stepHandlers}}
}
` as const;
