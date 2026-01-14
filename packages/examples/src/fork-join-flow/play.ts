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

// 2. Add 'failed' status and error capture
export type TaskStatus = "pending" | "running" | "completed" | "failed";

export type TaskInfo = {
  id: string;
  type: "search-index" | "email-notification";
  status: TaskStatus;
  result?: any;
  error?: any; // To capture error details
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

// 3. A 'Tasks' type defining the business logic functions
export type Tasks = {
  // Combined Step: Init and Start
  InitiateAndStartTasks: (state: TStateShape) => Promise<TStateShape>;

  // Polling only
  PollUpdateSearchIndex: (
    state: TStateShape
  ) => Promise<{ status: TaskStatus; result?: any; error?: any }>;

  PollSendEmailNotification: (
    state: TStateShape
  ) => Promise<{ status: TaskStatus; result?: any; error?: any }>;

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
      this.InitiateAndStartTasks.bind(this)
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

  private async *InitiateAndStartTasks(): StepIt<
    EStep,
    EStep.SynchronizeAndFinalize
  > {
    // 1. Combine Initialize and Start into 1 step
    const res = await this.withAction<TStateShape>(
      EStep.InitiateParallelTasks,
      async () => {
        return this.tasks.InitiateAndStartTasks(this.state);
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
    // 2. Monitoring result only

    let allDone = true;
    const tasks = this.state.parallelTasks || [];

    for (const task of tasks) {
      if (task.status === "completed" || task.status === "failed") continue;

      allDone = false;

      // POLL logic
      if (task.status === "running") {
        // We do NOT use withAction for polling because we want to check fresh status every time we visit
        let pollResult;
        if (task.type === "search-index") {
          pollResult = await this.tasks.PollUpdateSearchIndex(this.state);
        } else if (task.type === "email-notification") {
          pollResult = await this.tasks.PollSendEmailNotification(this.state);
        }

        if (pollResult) {
          if (pollResult.status === "completed") {
            task.status = "completed";
            task.result = pollResult.result;
            console.log(`[Workflow] Task ${task.type} completed.`);
          } else if (pollResult.status === "failed") {
             task.status = "failed";
             task.error = pollResult.error;
             console.error(`[Workflow] Task ${task.type} failed:`, pollResult.error);
          }
        }
      }
    }

    // Update state to persist task status changes
    this.state.parallelTasks = tasks;

    if (!allDone) {
      // If not all tasks are done, wait for a bit and then re-execute this step
      const waitCycle = this.state.waitCycle ?? 1;
      const wait = this.waitForMs(`poll_wait_${waitCycle}`, 500); // Poll every 500ms
      if (wait.it) yield wait.it;

      this.state.waitCycle = waitCycle + 1;

      return { nextStep: EStep.SynchronizeAndFinalize }; // Continue looping
    }

    // All done, finalize
    console.log("[Workflow] All parallel tasks completed (or failed). Finalizing...");
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
    { status: TaskStatus; result?: any; error?: any; startTime: number; duration: number }
  >(),

  // 3. Idempotency (avoid duplicate call)
  startJob(id: string, duration: number, shouldFail: boolean = false) {
    if (this.jobs.has(id)) {
        console.log(`   >> [ExternalSystem] Job '${id}' already started. Skipping duplicate start.`);
        return;
    }

    console.log(
      `   >> [ExternalSystem] Job '${id}' started (duration: ${duration}ms)${shouldFail ? ' [WILL FAIL]' : ''}`
    );
    // Store extra metadata to simulate failure later if needed
    this.jobs.set(id, { 
        status: "running", 
        startTime: Date.now(), 
        duration,
        // @ts-ignore: storing internal flag
        _shouldFail: shouldFail 
    });
  },

  getJobStatus(id: string): { status: TaskStatus; result?: any; error?: any } {
    const job = this.jobs.get(id);
    if (!job) return { status: "pending" }; 

    if (job.status === "completed" || job.status === "failed")
      return { status: job.status, result: job.result, error: job.error };

    if (Date.now() - job.startTime >= job.duration) {
      // @ts-ignore
      if (job._shouldFail) {
          job.status = "failed";
          job.error = "Simulated external system failure";
          return { status: "failed", error: job.error };
      }

      job.status = "completed";
      job.result = { timestamp: Date.now() };
      return { status: "completed", result: job.result };
    }

    return { status: "running" };
  },
};

// Combined Init and Start
async function InitiateAndStartTasks(state: TStateShape): Promise<TStateShape> {
  console.log(`[Task] Initializing and Starting parallel tasks...`);
  
  // Define tasks
  const tasks: TaskInfo[] = [
      { id: "job-search-idx", type: "search-index", status: "running" }, // Start as running
      { id: "job-email-notif", type: "email-notification", status: "running" },
  ];

  // Trigger External System for each task immediately
  // Idempotency: If this step is re-executed (e.g. after crash before saving state),
  // startJob will handle duplicate calls safely.
  ExternalJobSystem.startJob("job-search-idx", 1500, true); // Simulate failure for search index
  ExternalJobSystem.startJob("job-email-notif", 800); 

  return {
    ...state,
    parallelTasks: tasks,
  };
}


async function PollUpdateSearchIndex(
  state: TStateShape
): Promise<{ status: TaskStatus; result?: any; error?: any }> {
  const res = ExternalJobSystem.getJobStatus("job-search-idx");
  if (res.status === "running")
    console.log(`   [Poll] Search Index: running...`);
  return res;
}


async function PollSendEmailNotification(
  state: TStateShape
): Promise<{ status: TaskStatus; result?: any; error?: any }> {
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
  InitiateAndStartTasks,
  PollUpdateSearchIndex,
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