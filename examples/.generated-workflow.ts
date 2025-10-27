// -----------------
// --- GENERATED ---
// -----------------
// This section is automatically generated and will be overwritten.

import {
  DurableState,
  type StepIt,
} from "@tiny-json-workflow/runtime-durable-state";

export enum EStep {
  Begin = "Begin",
  SendWelcomeEmail = "SendWelcomeEmail",
  IsUserActivated = "IsUserActivated",
  SendActivationReminder = "SendActivationReminder",
  End = "End",
}

export type TStateShape = {
  userId: string;
  email: string;
  onboarded?: boolean;
  activated?: boolean;
};

export type Tasks = {
  SendWelcomeEmail: (context: TStateShape) => Promise<TStateShape>;
  SendActivationReminder: (context: TStateShape) => Promise<TStateShape>;
};

export class UserOnboarding extends DurableState<EStep, TStateShape, any> {
  constructor(private tasks: Tasks) {
    super(EStep.Begin, {
      withAuditLog: true,
    });

    Object.values(EStep).map((step) =>
      this.stepHandler.set(step, this[step].bind(this))
    );
  }

  private async *Begin(): StepIt<EStep, EStep.SendWelcomeEmail> {
    return { nextStep: EStep.SendWelcomeEmail };
  }

  private async *SendWelcomeEmail(): StepIt<EStep, EStep.IsUserActivated> {
    const res = await this.withAction<TStateShape>(
      "SendWelcomeEmail",
      async () => {
        return this.tasks.SendWelcomeEmail(this.state);
      }
    );

    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.IsUserActivated };
  }

  private async *IsUserActivated(): StepIt<EStep, any> {
    if (this.state.activated === true) {
      return { nextStep: EStep.End };
    }

    return { nextStep: EStep.SendActivationReminder };

    // Default case if no condition is met
    return { nextStep: null };
  }

  private async *SendActivationReminder(): StepIt<EStep, EStep.End> {
    const res = await this.withAction<TStateShape>(
      "SendActivationReminder",
      async () => {
        return this.tasks.SendActivationReminder(this.state);
      }
    );

    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.End };
  }

  private async *End(): StepIt<EStep, null> {
    return { nextStep: null };
  }
}
// --- IMPLEMENTATION ---

async function SendWelcomeEmail(context: TStateShape): Promise<TStateShape> {
  // TODO: Implement task 'Send Welcome Email'
  return context;
}

async function SendActivationReminder(
  context: TStateShape
): Promise<TStateShape> {
  // TODO: Implement task 'Send Activation Reminder'
  return context;
}

export function createWorkflow() {
  return new UserOnboarding({
    SendWelcomeEmail,
    SendActivationReminder,
  });
}
