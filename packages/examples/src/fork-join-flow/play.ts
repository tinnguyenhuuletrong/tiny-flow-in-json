import {
  DurableState,
  type StepIt,
  SimpleContext,
  WorkflowRuntime,
} from "@tiny-json-workflow/runtime-durable-state";
import { setTimeout as waitMs } from "node:timers/promises";

// -----------------
// --- GENERATED ---
// -----------------

// 1. Enums and Types for Steps and State
export enum EStep {
  BeginProfileUpdate = "begin-update",
  InitiateParallelTasks = "fork-tasks",
  SynchronizeAndFinalize = "join-tasks",
  EndProfileUpdate = "end-update",
}

export type TaskStatus = "pending" | "running" | "completed";

export type TaskInfo = {
  id: string;
  type: "search-index" | "email-notification";
  status: TaskStatus;
  result?: any;
};

export type TStateShape = {
  userId: string;
  updatedFields: string[];

  // Track parallel tasks here
  parallelTasks: TaskInfo[];

  // Final results
  searchIndexStatus?: string;
  emailNotificationStatus?: string;

  waitCycle?: number;
};

// 2. A 'Tasks' type defining the business logic functions
// We split "Tasks" into Start and Poll operations to support the "Start and Poll" pattern
export type Tasks = {
  InitiateParallelTasks: (state: TStateShape) => Promise<TStateShape>;

  // Task A: Search Index
  StartUpdateSearchIndex: (state: TStateShape) => Promise<void>;
  PollUpdateSearchIndex: (
    state: TStateShape
  ) => Promise<{ status: TaskStatus; result?: any }>;

  // Task B: Email Notification
  StartSendEmailNotification: (state: TStateShape) => Promise<void>;
  PollSendEmailNotification: (
    state: TStateShape
  ) => Promise<{ status: TaskStatus; result?: any }>;

  FinalizeUpdate: (state: TStateShape) => Promise<TStateShape>;
};

// ----------------------
// --- IMPLEMENTATION ---
// ----------------------

// 3. The DurableState class defining the control flow
export class UserProfileUpdateFlow extends DurableState<
  EStep,
  TStateShape,
  any
> {
  constructor(private tasks: Tasks = defaultTasks) {
    super(EStep.BeginProfileUpdate);

    this.stepHandler.set(
      EStep.BeginProfileUpdate,
      this.BeginProfileUpdate.bind(this)
    );
    this.stepHandler.set(
      EStep.InitiateParallelTasks,
      this.InitiateParallelTasks.bind(this)
    );
    this.stepHandler.set(
      EStep.SynchronizeAndFinalize,
      this.SynchronizeAndFinalize.bind(this)
    );
    this.stepHandler.set(
      EStep.EndProfileUpdate,
      this.EndProfileUpdate.bind(this)
    );
  }

  private async *BeginProfileUpdate(): StepIt<
    EStep,
    EStep.InitiateParallelTasks
  > {
    console.log("[Workflow] Begin Profile Update");
    return { nextStep: EStep.InitiateParallelTasks };
  }

  private async *InitiateParallelTasks(): StepIt<
    EStep,
    EStep.SynchronizeAndFinalize
  > {
    const res = await this.withAction<TStateShape>(
      EStep.InitiateParallelTasks,
      async () => {
        return this.tasks.InitiateParallelTasks(this.state);
      }
    );

    if (res.it) yield res.it;
    if (res.value) this.state = res.value;

    return { nextStep: EStep.SynchronizeAndFinalize };
  }

  private async *SynchronizeAndFinalize(): StepIt<
    EStep,
    EStep.EndProfileUpdate | EStep.SynchronizeAndFinalize
  > {
    // This step implements the "Start and Poll" pattern for parallel execution

    let allDone = true;
    const tasks = this.state.parallelTasks || [];

    for (const task of tasks) {
      if (task.status === "completed") continue;

      allDone = false;

      // START logic
      if (task.status === "pending") {
        // We use withAction to ensure we only trigger the external job ONCE
        await this.withAction(`start_${task.id}`, async () => {
          if (task.type === "search-index") {
            await this.tasks.StartUpdateSearchIndex(this.state);
          } else if (task.type === "email-notification") {
            await this.tasks.StartSendEmailNotification(this.state);
          }
        });

        // Optimistically set to running after successful start (or if we recovered from cache)
        task.status = "running";
      }

      // POLL logic
      if (task.status === "running") {
        // We do NOT use withAction for polling because we want to check fresh status every time we visit
        let pollResult;
        if (task.type === "search-index") {
          pollResult = await this.tasks.PollUpdateSearchIndex(this.state);
        } else if (task.type === "email-notification") {
          pollResult = await this.tasks.PollSendEmailNotification(this.state);
        }

        if (pollResult && pollResult.status === "completed") {
          task.status = "completed";
          task.result = pollResult.result;
          console.log(`[Workflow] Task ${task.type} completed.`);
        }
      }
    }

    // Update state to persist task status changes
    this.state.parallelTasks = tasks;

    if (!allDone) {
      // If not all tasks are done, wait for a bit and then re-execute this step
      // 'activeStep' keeps us in the same step (SynchronizeAndFinalize)
      // yield this.waitForMs(...) returns an iterator that pauses execution
      const waitCycle = this.state.waitCycle ?? 1;
      const wait = this.waitForMs(`poll_wait_${waitCycle}`, 500); // Poll every 500ms
      if (wait.it) yield wait.it;

      this.state.waitCycle = waitCycle + 1;

      return { nextStep: EStep.SynchronizeAndFinalize }; // Continue looping
    }

    // All done, finalize
    console.log("[Workflow] All parallel tasks completed. Finalizing...");
    const resFinal = await this.withAction(
      EStep.SynchronizeAndFinalize,
      async () => {
        return this.tasks.FinalizeUpdate(this.state);
      }
    );
    if (resFinal.it) yield resFinal.it;
    if (resFinal.value) this.state = resFinal.value;

    return { nextStep: EStep.EndProfileUpdate };
  }

  private async *EndProfileUpdate(): StepIt<EStep, null> {
    console.log("[Workflow] End Profile Update");
    return { nextStep: null };
  }
}

// 6. Factory
export function createWorkflow() {
  return new UserProfileUpdateFlow();
}

// ----------------------------
// --- Simulating an external job system ---
// ----------------------------

const ExternalJobSystem = {
  jobs: new Map<
    string,
    { status: TaskStatus; result?: any; startTime: number; duration: number }
  >(),

  startJob(id: string, duration: number) {
    console.log(
      `   >> [ExternalSystem] Job '${id}' started (duration: ${duration}ms)`
    );
    this.jobs.set(id, { status: "running", startTime: Date.now(), duration });
  },

  getJobStatus(id: string): { status: TaskStatus; result?: any } {
    const job = this.jobs.get(id);
    if (!job) return { status: "pending" }; // Or error

    if (job.status === "completed")
      return { status: "completed", result: job.result };

    if (Date.now() - job.startTime >= job.duration) {
      job.status = "completed";
      job.result = { timestamp: Date.now() };
      return { status: "completed", result: job.result };
    }

    return { status: "running" };
  },
};

async function InitiateParallelTasks(state: TStateShape): Promise<TStateShape> {
  console.log(`[Task] Initializing parallel tasks...`);
  return {
    ...state,
    parallelTasks: [
      { id: "job-search-idx", type: "search-index", status: "pending" },
      { id: "job-email-notif", type: "email-notification", status: "pending" },
    ],
  };
}

// Task A Implementation
async function StartUpdateSearchIndex(state: TStateShape): Promise<void> {
  ExternalJobSystem.startJob("job-search-idx", 1500); // Takes 1.5s
}

async function PollUpdateSearchIndex(
  state: TStateShape
): Promise<{ status: TaskStatus; result?: any }> {
  const res = ExternalJobSystem.getJobStatus("job-search-idx");
  if (res.status === "running")
    console.log(`   [Poll] Search Index: running...`);
  return res;
}

// Task B Implementation
async function StartSendEmailNotification(state: TStateShape): Promise<void> {
  ExternalJobSystem.startJob("job-email-notif", 800); // Takes 0.8s
}

async function PollSendEmailNotification(
  state: TStateShape
): Promise<{ status: TaskStatus; result?: any }> {
  const res = ExternalJobSystem.getJobStatus("job-email-notif");
  if (res.status === "running")
    console.log(`   [Poll] Email Notification: running...`);
  return res;
}

async function FinalizeUpdate(state: TStateShape): Promise<TStateShape> {
  const searchTask = state.parallelTasks.find((t) => t.type === "search-index");
  const emailTask = state.parallelTasks.find(
    (t) => t.type === "email-notification"
  );

  return {
    ...state,
    searchIndexStatus: searchTask?.status,
    emailNotificationStatus: emailTask?.status,
  };
}

const defaultTasks: Tasks = {
  InitiateParallelTasks,
  StartUpdateSearchIndex,
  PollUpdateSearchIndex,
  StartSendEmailNotification,
  PollSendEmailNotification,
  FinalizeUpdate,
};

// ----------------------------
// --- Main Execution Logic ---
// ----------------------------

async function main() {
  const ctx = new SimpleContext();
  const runtime = new WorkflowRuntime({
    ctx,
    genRunId: async () => `profile-update-${Date.now()}`,
    InstanceClass: UserProfileUpdateFlow,
  });

  const flow = new UserProfileUpdateFlow(defaultTasks);
  flow.setState({
    userId: "user-888",
    updatedFields: ["email"],
    parallelTasks: [],
  });

  console.log("--- Starting Durable Fork-Join Workflow ---");
  // We'll run until completion, but the internal loop will yield multiple times
  let result = await runtime.run(flow);

  while (result.status === "need_resume") {
    // If it's a timer (polling wait), schedule the resume
    if (result.resumeEntry.type === "timer") {
      console.log(
        `[Runner] Workflow paused for polling. Waiting ${
          result.resumeEntry.resumeAfter - Date.now()
        }ms...`
      );

      await waitMs(result.resumeEntry.resumeAfter - Date.now());
      result = await runtime.resume(result.runId, {
        resumeId: result.resumeEntry.resumeId,
        resumePayload: undefined,
      });
    }
  }

  await ctx.runner.idle();

  // Load final state
  const runData = await ctx.load(result.runId);
  console.log("Final State:", runData?.state);
}

// Run directly
main();
