import {
  DurableState,
  type StepIt,
  SimpleContext,
  WorkflowRuntime,
} from "@tiny-json-workflow/runtime-durable-state";
import { setTimeout } from "timers/promises";

// -----------------
// --- GENERATED ---
// -----------------

export enum EStep {
  Start = "start",
  ActivateTrial = "activate_trial",
  InitiateWatch = "initiate_watch",
  WaitForConversion = "wait_for_conversion",
  DeactivateTrial = "deactivate_trial",
  End = "end",
}

export type TStateShape = {
  userId: string;
  planType: "free" | "paid";
  remindersSent: number;
};

export type Tasks = {
  activate_trial: (context: TStateShape) => Promise<TStateShape>;
  initiate_watch: (context: TStateShape) => Promise<TStateShape>;
  send_1st_reminder: (context: TStateShape) => Promise<TStateShape>;
  send_2nd_reminder: (context: TStateShape) => Promise<TStateShape>;
  deactivate_trial: (context: TStateShape) => Promise<TStateShape>;
};

const defaultTasks: Tasks = {
  async activate_trial(context) {
    console.log(`[Task] Activating 7-day trial for user ${context.userId}`);
    await setTimeout(100);
    return context;
  },
  async initiate_watch(context) {
    console.log(
      `[Task] Initiating subscription watch for user ${context.userId}`
    );
    await setTimeout(100);
    return context;
  },
  async send_1st_reminder(context) {
    console.log(`[Task] Sending 1st reminder to user ${context.userId}`);
    await setTimeout(100);
    return { ...context, remindersSent: 1 };
  },
  async send_2nd_reminder(context) {
    console.log(`[Task] Sending 2nd reminder to user ${context.userId}`);
    await setTimeout(100);
    return { ...context, remindersSent: 2 };
  },
  async deactivate_trial(context) {
    console.log(`[Task] Deactivating trial for user ${context.userId}`);
    await setTimeout(100);
    return context;
  },
};

export class TrialConversionFlow extends DurableState<EStep, TStateShape, any> {
  constructor(private tasks: Tasks = defaultTasks) {
    super(EStep.Start);
    this.stepHandler.set(EStep.Start, this.start.bind(this));
    this.stepHandler.set(EStep.ActivateTrial, this.activate_trial.bind(this));
    this.stepHandler.set(EStep.InitiateWatch, this.initiate_watch.bind(this));
    this.stepHandler.set(
      EStep.WaitForConversion,
      this.wait_for_conversion.bind(this)
    );
    this.stepHandler.set(
      EStep.DeactivateTrial,
      this.deactivate_trial.bind(this)
    );
    this.stepHandler.set(EStep.End, this.end.bind(this));
  }

  private async *start(): StepIt<EStep, EStep.ActivateTrial> {
    return { nextStep: EStep.ActivateTrial };
  }

  private async *activate_trial(): StepIt<EStep, EStep.InitiateWatch> {
    const res = await this.withAction<TStateShape>("activate_trial", () =>
      this.tasks.activate_trial(this.state)
    );
    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.InitiateWatch };
  }

  private async *initiate_watch(): StepIt<EStep, EStep.WaitForConversion> {
    const res = await this.withAction<TStateShape>("initiate_watch", () =>
      this.tasks.initiate_watch(this.state)
    );
    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.WaitForConversion };
  }

  private async *wait_for_conversion(): StepIt<
    EStep,
    EStep.DeactivateTrial | EStep.End
  > {
    const planActivationEvent = this.waitForEvent<{ planType: "paid" }>(
      "wait_for_plan_activation",
      { userId: this.state.userId }
    );

    const checkPaymentAndEnd = (): { nextStep: EStep.End } | null => {
      if (planActivationEvent.value()?.planType === "paid") {
        this.state.planType = "paid";
        return { nextStep: EStep.End };
      }
      return null;
    };

    let endTransition = checkPaymentAndEnd();
    if (endTransition) return endTransition;

    const reminderSchedule = [
      {
        delayKey: "delay_3_days",
        delayMs: 300,
        taskKey: "send_1st_reminder",
        task: this.tasks.send_1st_reminder,
      },
      {
        delayKey: "delay_2_days",
        delayMs: 200,
        taskKey: "send_2nd_reminder",
        task: this.tasks.send_2nd_reminder,
      },
      { delayKey: "delay_1_day", delayMs: 100, taskKey: null, task: null },
    ];

    for (const step of reminderSchedule) {
      const delay = this.waitForMs(step.delayKey, step.delayMs);
      if (delay.it) yield delay.it;

      endTransition = checkPaymentAndEnd();
      if (endTransition) return endTransition;

      if (step.task) {
        const res = await this.withAction<TStateShape>(step.taskKey!, () =>
          step.task!(this.state)
        );
        if (res.it) yield res.it;
        if (res.value) this.state = res.value;

        endTransition = checkPaymentAndEnd();
        if (endTransition) return endTransition;
      }
    }

    return { nextStep: EStep.DeactivateTrial };
  }

  private async *deactivate_trial(): StepIt<EStep, EStep.End> {
    const res = await this.withAction<TStateShape>("deactivate_trial", () =>
      this.tasks.deactivate_trial(this.state)
    );
    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.End };
  }

  private async *end(): StepIt<EStep, null> {
    console.log("[Workflow] Ending Conversion Flow");
    return { nextStep: null };
  }
}

// --- Main Execution Logic ---

async function scenario_reminders_flow(
  runtime: WorkflowRuntime<TrialConversionFlow>,
  ctx: SimpleContext<TrialConversionFlow>
) {
  console.log("--- SCENARIO 1: Full Reminder Flow ---");
  const trialFlow = new TrialConversionFlow();
  trialFlow.setState({
    userId: "user-test-123",
    planType: "free",
    remindersSent: 0,
  });

  let result = await runtime.run(trialFlow);

  while (result.status === "need_resume") {
    console.log(`Workflow paused. Resume info:`, result.resumeEntry);

    if (result.resumeEntry.type === "timer") {
      const waitTime = result.resumeEntry.resumeAfter - Date.now();
      console.log(`...simulating wait for ${waitTime > 0 ? waitTime : 0}ms...`);
      await setTimeout(waitTime > 0 ? waitTime : 0);
      result = await runtime.resume(result.runId, {
        resumeId: result.resumeEntry.resumeId,
      });
    } else if (result.resumeEntry.type === "event") {
      console.log(
        "...workflow waiting for payment event, simulation will let timers complete..."
      );
      break;
    }
  }

  if (result.status === "error") {
    console.error("Workflow failed:", result.error);
  } else if (result.status === "finished") {
    console.log("Workflow finished successfully.");
  }

  await ctx.runner.idle();
  const runData = await ctx.load(result.runId);
  console.log("Final state:", runData?.state);
}

async function scenario_user_converts(
  runtime: WorkflowRuntime<TrialConversionFlow>,
  ctx: SimpleContext<TrialConversionFlow>
) {
  console.log("\n--- SCENARIO 2: User Converts Early ---");
  const trialFlow = new TrialConversionFlow();
  const runId = `trial-conversion-early-converter-${Date.now()}`;
  trialFlow.setState({
    userId: "user-test-456",
    planType: "free",
    remindersSent: 0,
  });

  let result = await runtime.run(trialFlow, runId);

  if (result.status === "need_resume") {
    console.log(`Workflow paused. Simulating user converting.`);
    const snapshot = await ctx.load(runId);
    if (snapshot) {
      const instance = TrialConversionFlow.fromJSON(
        TrialConversionFlow,
        snapshot
      );
      const eventResume = instance
        .listPendingResume()
        .find((r) => r.type === "event");

      if (eventResume) {
        console.log("Found payment event to resume, resuming now...");
        result = await runtime.resume(runId, {
          resumeId: eventResume.resumeId,
          resumePayload: { planType: "paid" },
        });
      } else {
        console.log("Could not find event to resume.");
      }
    }
  }

  if (result.status === "error") {
    console.error("Workflow failed:", result.error);
  } else if (result.status === "finished") {
    console.log("Workflow finished successfully after user conversion.");
  }

  await ctx.runner.idle();
  const runData = await ctx.load(result.runId);
  console.log("Final state:", runData?.state);
  if (runData?.state.planType !== "paid") {
    console.error("ERROR: Final state for converting user should be 'paid'!");
  }
}

async function main() {
  const ctx = new SimpleContext<TrialConversionFlow>();
  const runtime = new WorkflowRuntime({
    ctx,
    genRunId: async () => `trial-conversion-${Date.now()}`,
    InstanceClass: TrialConversionFlow,
  });

  await scenario_reminders_flow(runtime, ctx);
  await scenario_user_converts(runtime, ctx);
}

main();
