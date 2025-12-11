import {
  DurableState,
  type StepIt,
  SimpleContext,
  WorkflowRuntime,
} from "@tiny-json-workflow/runtime-durable-state";

// -----------------
// --- GENERATED ---
// -----------------

export enum EStep {
  StartFlow = "start-flow",
  SendWelcome = "send-welcome",
  CheckProfile = "check-profile",
  SendReminder = "send-reminder",
  EndFlow = "end-flow",
}

export type TStateShape = {
  userId: string;
  profileIsComplete?: boolean;
};

export type Tasks = {
  SendWelcome: (
    state: TStateShape,
    params: { template?: string }
  ) => Promise<TStateShape>;
  SendReminder: (state: TStateShape) => Promise<TStateShape>;
};

export class UserOnboardingFlow extends DurableState<EStep, TStateShape, any> {
  constructor(private tasks: Tasks) {
    super(EStep.StartFlow);
    this.stepHandler.set(EStep.StartFlow, this.StartFlow.bind(this));
    this.stepHandler.set(EStep.SendWelcome, this.SendWelcome.bind(this));
    this.stepHandler.set(EStep.CheckProfile, this.CheckProfile.bind(this));
    this.stepHandler.set(EStep.SendReminder, this.SendReminder.bind(this));
    this.stepHandler.set(EStep.EndFlow, this.EndFlow.bind(this));
  }

  private async *StartFlow(): StepIt<EStep, EStep.SendWelcome> {
    console.log("[Workflow] Starting Onboarding Flow");
    return { nextStep: EStep.SendWelcome };
  }

  private async *SendWelcome(): StepIt<EStep, EStep.CheckProfile> {
    const params = { template: "welcome-email-v2" };
    const res = await this.withAction<TStateShape>("SendWelcome", async () => {
      return this.tasks.SendWelcome(this.state, params);
    });
    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.CheckProfile };
  }

  private async *CheckProfile(): StepIt<
    EStep,
    EStep.EndFlow | EStep.SendReminder
  > {
    console.log(
      `[Workflow] Checking profile for user ${this.state.userId}. Profile Complete: ${this.state.profileIsComplete}`
    );
    if (this.state.profileIsComplete === true) {
      return { nextStep: EStep.EndFlow };
    } else {
      return { nextStep: EStep.SendReminder };
    }
  }

  private async *SendReminder(): StepIt<EStep, EStep.EndFlow> {
    const res = await this.withAction<TStateShape>("SendReminder", async () => {
      return this.tasks.SendReminder(this.state);
    });
    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.EndFlow };
  }

  private async *EndFlow(): StepIt<EStep, null> {
    console.log("[Workflow] Ending Onboarding Flow");
    return { nextStep: null };
  }
}

// --- IMPLEMENTATION ---

async function SendWelcome(
  state: TStateShape,
  params: { template?: string }
): Promise<TStateShape> {
  console.log(
    `[Task] Sending welcome email with template: ${params.template} to user ${state.userId}...`
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { ...state };
}

async function SendReminder(state: TStateShape): Promise<TStateShape> {
  console.log(`[Task] Sending profile reminder to user ${state.userId}...`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { ...state };
}

export function createWorkflow() {
  return new UserOnboardingFlow({
    SendWelcome,
    SendReminder,
  });
}

// --- Main Execution Logic ---

async function main() {
  const ctx = new SimpleContext();
  const runtime = new WorkflowRuntime({
    ctx,
    genRunId: async () => `user-onboarding-${Date.now()}`,
    InstanceClass: UserOnboardingFlow,
  });

  // Scenario 1: Profile is complete
  const onboardingFlowComplete = createWorkflow();
  onboardingFlowComplete.setState({
    userId: "001",
    profileIsComplete: true,
  });

  console.log("--- Starting Workflow (Profile Complete) ---");
  let resultComplete = await runtime.run(onboardingFlowComplete);

  switch (resultComplete.status) {
    case "need_resume":
      console.log(`Workflow paused. Resume info:`, resultComplete.resumeEntry);
      break;
    case "error":
      console.error("Workflow failed:", resultComplete.error);
      break;
    case "finished":
      console.log("Workflow finished successfully.");
      break;
  }
  await ctx.runner.idle();
  let runDataComplete = await ctx.load(resultComplete.runId);
  console.log("Final state (Profile Complete):", runDataComplete?.state);

  // Scenario 2: Profile is incomplete
  const onboardingFlowIncomplete = createWorkflow();
  onboardingFlowIncomplete.setState({
    userId: "002",
    profileIsComplete: false,
  });

  console.log("\n--- Starting Workflow (Profile Incomplete) ---");
  let resultIncomplete = await runtime.run(onboardingFlowIncomplete);

  switch (resultIncomplete.status) {
    case "need_resume":
      console.log(
        `Workflow paused. Resume info:`,
        resultIncomplete.resumeEntry
      );
      break;
    case "error":
      console.error("Workflow failed:", resultIncomplete.error);
      break;
    case "finished":
      console.log("Workflow finished successfully.");
      break;
  }
  await ctx.runner.idle();
  let runDataIncomplete = await ctx.load(resultIncomplete.runId);
  console.log("Final state (Profile Incomplete):", runDataIncomplete?.state);
}

main();
