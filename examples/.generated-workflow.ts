// -----------------
// --- GENERATED ---
// -----------------
// This section is automatically generated and will be overwritten.

import { DurableState, type StepIt } from "@tiny-json-workflow/runtime-durable-state";

export 
enum EStep {
  StartFlow = 'StartFlow',
  SendWelcome = 'SendWelcome',
  CheckProfile = 'CheckProfile',
  SendReminder = 'SendReminder',
  EndFlow = 'EndFlow'
}


export type TStateShape = {
  userId: string;
  profileIsComplete?: boolean;
};

export const defaultState: TStateShape = {
  "userId": "001",
  "profileIsComplete": true
};

export type TSendWelcomeParams = {
  template?: string;
} | undefined;

export 
type Tasks = {
  SendWelcome: (context: TStateShape, params: TSendWelcomeParams) => Promise<TStateShape>;
  SendReminder: (context: TStateShape) => Promise<TStateShape>;
}



export class UserOnboardingFlow extends DurableState<EStep, TStateShape, any> {
  
constructor(private tasks: Tasks) {
  super(EStep.StartFlow, {
    withAuditLog: true,
  });

  if (defaultState) this.setState(defaultState);

  Object.values(EStep).map((step) =>
    this.stepHandler.set(step, this[step].bind(this))
  );
}


  
private async *StartFlow(): StepIt<EStep, EStep.SendWelcome> {
  return { nextStep: EStep.SendWelcome };
}



private async *SendWelcome(): StepIt<EStep, EStep.CheckProfile> {
  const res = await this.withAction<TStateShape>("SendWelcome", async () => { 
    return this.tasks.SendWelcome(this.state, undefined); 
  }); 

  if (res.it) yield res.it;
  if (res.value) this.state = res.value;
  return { nextStep: EStep.CheckProfile };
}



private async *CheckProfile(): StepIt<EStep, any> {
  
    if (this.state.profileIsComplete == true) {
      return { nextStep: EStep.EndFlow };
    }


    if (this.state.profileIsComplete == false) {
      return { nextStep: EStep.SendReminder };
    }

 
  
  // Default case if no condition is met
  return { nextStep: null };
}



private async *SendReminder(): StepIt<EStep, EStep.EndFlow> {
  const res = await this.withAction<TStateShape>("SendReminder", async () => { 
    return this.tasks.SendReminder(this.state, ); 
  }); 

  if (res.it) yield res.it;
  if (res.value) this.state = res.value;
  return { nextStep: EStep.EndFlow };
}



private async *EndFlow(): StepIt<EStep, null> {
  return { nextStep: null };
}

}

// --- IMPLEMENTATION ---

async function SendWelcome(context: TStateShape, params: TSendWelcomeParams): Promise<TStateShape> {
  // TODO: Implement task 'Send Welcome Email'
  return context;
}

async function SendReminder(context: TStateShape): Promise<TStateShape> {
  // TODO: Implement task 'Send Profile Reminder'
  return context;
}

export function createWorkflow() {
  return new UserOnboardingFlow({
    SendWelcome,
    SendReminder
  });
}