import {
  DurableState,
  type StepIt,
  SimpleContext,
  WorkflowRuntime,
  type DurableStateSystemEntry,
} from "@tiny-json-workflow/runtime-durable-state";

// -----------------
// --- GENERATED ---
// -----------------

export enum EStep {
  StartRouting = "start-routing",
  EvaluateTicket = "evaluate-ticket",
  EscalateUrgent = "escalate-urgent",
  RouteToBilling = "route-to-billing",
  AssignGeneral = "assign-general",
  AddVipTag = "add-vip-tag",
  SendConfirmation = "send-confirmation",
  EndRouting = "end-routing",
}

export type Ticket = {
  id: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "general";
  isVip: boolean;
  assignedAgentId?: string;
};

export type TStateShape = {
  ticket: Ticket;
  // State for polling loops
  _jobId?: string;
  _pollCycle?: number;
};

export type Tasks = {
  // Complex task with polling pattern
  startEscalation: (ticket: Ticket) => Promise<string>;
  checkEscalationStatus: (
    jobId: string
  ) => Promise<"pending" | "completed" | "failed">;

  // Simple tasks
  routeToBilling: (ticket: Ticket) => Promise<Ticket>;
  assignGeneral: (ticket: Ticket) => Promise<Ticket>;
  addVipTag: (ticket: Ticket) => Promise<Ticket>;
  sendConfirmation: (ticket: Ticket) => Promise<Ticket>;
};

export class SupportTicketRoutingFlow extends DurableState<
  EStep,
  TStateShape,
  any
> {
  constructor(private tasks: Tasks = defaultTasks) {
    super(EStep.StartRouting);
    this.stepHandler.set(EStep.StartRouting, this.StartRouting.bind(this));
    this.stepHandler.set(EStep.EvaluateTicket, this.EvaluateTicket.bind(this));
    this.stepHandler.set(EStep.EscalateUrgent, this.EscalateUrgent.bind(this));
    this.stepHandler.set(EStep.RouteToBilling, this.RouteToBilling.bind(this));
    this.stepHandler.set(EStep.AssignGeneral, this.AssignGeneral.bind(this));
    this.stepHandler.set(EStep.AddVipTag, this.AddVipTag.bind(this));
    this.stepHandler.set(
      EStep.SendConfirmation,
      this.SendConfirmation.bind(this)
    );
    this.stepHandler.set(EStep.EndRouting, this.EndRouting.bind(this));
  }

  private async *StartRouting(): StepIt<EStep, EStep.EvaluateTicket> {
    // Combine Init and Start logic
    return { nextStep: EStep.EvaluateTicket };
  }

  private async *EvaluateTicket(): StepIt<EStep, EStep> {
    const { priority, category, isVip } = this.state.ticket;

    // Conditions based on workflow.json
    if (priority === "urgent" && category === "technical") {
      return { nextStep: EStep.EscalateUrgent };
    }
    if (category === "billing") {
      return { nextStep: EStep.RouteToBilling };
    }
    if (isVip === true) {
      return { nextStep: EStep.AddVipTag };
    }
    // Default path
    return { nextStep: EStep.AssignGeneral };
  }

  private async *EscalateUrgent(): StepIt<
    EStep,
    EStep.SendConfirmation | EStep.EscalateUrgent
  > {
    // 1. Start the external job if not started
    if (!this.state._jobId) {
      const res = await this.withAction<string>(
        "start_escalation_job",
        async () => {
          return this.tasks.startEscalation(this.state.ticket);
        }
      );
      if (res.it) yield res.it;
      if (res.value) this.state._jobId = res.value;
    }

        const jobId = this.state._jobId!;
        const cycle = this.state._pollCycle || 0;
    
        // 2. Check status
        // We do NOT use withAction for polling because we want to check fresh status every time we visit
        const status = await this.tasks.checkEscalationStatus(jobId);
    
        if (status === "completed") {      // Cleanup and move on
      this.state.ticket.assignedAgentId = "L2-SUPPORT-TEAM"; // Assume job updated this
      this.state._jobId = undefined;
      this.state._pollCycle = undefined;
      return { nextStep: EStep.SendConfirmation };
    } else if (status === "failed") {
      throw new Error(`Escalation job ${jobId} failed.`);
    } else {
      // 3. Wait and poll again
      const wait = this.waitForMs(`poll_wait_${cycle}`, 200); // 200ms for demo speed
      if (wait.it) yield wait.it;

      this.state._pollCycle = cycle + 1;
      return { nextStep: EStep.EscalateUrgent };
    }
  }

  private async *RouteToBilling(): StepIt<EStep, EStep.SendConfirmation> {
    const res = await this.withAction<Ticket>("route_billing", async () => {
      return this.tasks.routeToBilling(this.state.ticket);
    });
    if (res.it) yield res.it;
    if (res.value) this.state.ticket = res.value;
    return { nextStep: EStep.SendConfirmation };
  }

  private async *AssignGeneral(): StepIt<EStep, EStep.SendConfirmation> {
    const res = await this.withAction<Ticket>("assign_general", async () => {
      return this.tasks.assignGeneral(this.state.ticket);
    });
    if (res.it) yield res.it;
    if (res.value) this.state.ticket = res.value;
    return { nextStep: EStep.SendConfirmation };
  }

  private async *AddVipTag(): StepIt<EStep, EStep.EndRouting> {
    const res = await this.withAction<Ticket>("add_vip_tag", async () => {
      return this.tasks.addVipTag(this.state.ticket);
    });
    if (res.it) yield res.it;
    if (res.value) this.state.ticket = res.value;
    // According to JSON, AddVipTag goes straight to EndRouting
    return { nextStep: EStep.EndRouting };
  }

  private async *SendConfirmation(): StepIt<EStep, EStep.EndRouting> {
    const res = await this.withAction<Ticket>("send_confirmation", async () => {
      return this.tasks.sendConfirmation(this.state.ticket);
    });
    if (res.it) yield res.it;
    if (res.value) this.state.ticket = res.value;
    return { nextStep: EStep.EndRouting };
  }

  private async *EndRouting(): StepIt<EStep, null> {
    return { nextStep: null };
  }
}

// --- IMPLEMENTATION ---

// Simulated external services
const defaultTasks: Tasks = {
  startEscalation: async (ticket) => {
    console.log(`[Task] Starting L2 escalation for Ticket #${ticket.id}...`);
    return `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  },
  checkEscalationStatus: async (jobId) => {
    // Simulate async processing
    const isDone = Math.random() > 0.6; // 40% chance to finish per poll
    console.log(
      `[Task] Checking L2 escalation status for ${jobId}: ${
        isDone ? "completed" : "pending"
      }`
    );
    return isDone ? "completed" : "pending";
  },
  routeToBilling: async (ticket) => {
    console.log(`[Task] Routing Ticket #${ticket.id} to Billing Department...`);
    return { ...ticket, assignedAgentId: "BILLING-BOT-01" };
  },
  assignGeneral: async (ticket) => {
    console.log(`[Task] Assigning Ticket #${ticket.id} to General Queue...`);
    return { ...ticket, assignedAgentId: "GENERAL-POOL" };
  },
  addVipTag: async (ticket) => {
    console.log(`[Task] Tagging Ticket #${ticket.id} as VIP...`);
    return { ...ticket, isVip: true };
  },
  sendConfirmation: async (ticket) => {
    console.log(
      `[Task] Sending email confirmation for Ticket #${ticket.id}. Assigned to: ${ticket.assignedAgentId}`
    );
    return ticket;
  },
};

export function createWorkflow() {
  return new SupportTicketRoutingFlow();
}

// --- Main Execution Logic ---

async function main() {
  const ctx = new SimpleContext();
  const runtime = new WorkflowRuntime({
    ctx,
    genRunId: async () => `ticket-flow-${Date.now()}`,
    InstanceClass: SupportTicketRoutingFlow,
  });

  console.log(
    "=== Scenario 1: Urgent Technical Issue (Expect Escalation Polling) ==="
  );
  const flow1 = createWorkflow();
  flow1.setState({
    ticket: {
      id: "TICK-001",
      priority: "urgent",
      category: "technical",
      isVip: false,
    },
  });

  let result1 = await runtime.run(flow1);
  while (result1.status === "need_resume") {
    // console.log("Workflow paused, resuming...");
    if (result1.resumeEntry.type === "timer") {
      await ctx.scheduleNextRun(result1.runId, result1);
    }
    // Wait for background tasks (timers)
    await ctx.runner.idle();

    // In a real app, this would be triggered by the timer system.
    // Here we manually check if it's time to resume for simulation
    const nextSnapshot = await ctx.load(result1.runId);
    if (!nextSnapshot) break;

    // Check if we can resume (timer expired)
    // For this simulation, we just assume the runner processed the timer and we can load/run again?
    // Actually, scheduleNextRun adds a task to the runner. `ctx.runner.idle()` waits for it.
    // The runner executes `runtime.resume`.

    // We just need to wait for the runner to finish executing the resume call.
    // However, `runtime.run` returns the result of the *initial* run.
    // Subsequent runs happen in the background via `scheduleNextRun`.
    // So we need to poll the DB or state to see if it's finished.

    // Let's just break here and inspect the final state after idle()
    break;
  }

  await ctx.runner.idle();
  const finalState1 = await ctx.load(result1.runId);
  console.log("Final State 1:", finalState1?.state);

  console.log("\n=== Scenario 2: Billing Inquiry ===");
  const flow2 = createWorkflow();
  flow2.setState({
    ticket: {
      id: "TICK-002",
      priority: "medium",
      category: "billing",
      isVip: false,
    },
  });

  const result2 = await runtime.run(flow2);
  await ctx.runner.idle();
  const finalState2 = await ctx.load(result2.runId);
  console.log("Final State 2:", finalState2?.state);

  console.log("\n=== Scenario 3: VIP Customer ===");
  const flow3 = createWorkflow();
  flow3.setState({
    ticket: {
      id: "TICK-003",
      priority: "low",
      category: "general",
      isVip: true,
    },
  });

  const result3 = await runtime.run(flow3);
  await ctx.runner.idle();
  const finalState3 = await ctx.load(result3.runId);
  console.log("Final State 3:", finalState3?.state);
}

// Execute main
main();
