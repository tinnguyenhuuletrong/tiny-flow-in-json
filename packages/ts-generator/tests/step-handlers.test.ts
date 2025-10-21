import { expect, test, describe } from "bun:test";
import { generateStepHandlers } from "../src/utils/step-handlers";
import type { Flow } from "@tiny-json-workflow/core";

describe("generateStepHandlers", () => {
  test("should generate handler for a 'begin' step", () => {
    const flowJson = {
      steps: [{ id: "begin", type: "begin" }],
      connections: [{ sourceStepId: "begin", targetStepId: "firstTask" }],
    } as Flow;

    const expected = `  private async *Begin(): StepIt<EStep, EStep.FirstTask> {
    return { nextStep: EStep.FirstTask };
  }`;
    const result = generateStepHandlers(flowJson, 1);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate handler for an 'end' step", () => {
    const flowJson = {
      steps: [{ id: "end", type: "end" }],
      connections: [] as any,
    } as Flow;

    const expected = `  private async *End(): StepIt<EStep, null> {
    return { nextStep: null };
  }`;
    const result = generateStepHandlers(flowJson, 1);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate handler for a 'task' step", () => {
    const flowJson = {
      steps: [{ id: "process-data", name: "Process Data", type: "task" }],
      connections: [{ sourceStepId: "process-data", targetStepId: "nextStep" }],
    } as Flow;

    const expected = `  private async *ProcessData(): StepIt<EStep, EStep.NextStep> {
    const res = await this.withAction<TStateShape>("ProcessData", async () => { 
      return this.tasks.ProcessData(this.state); 
    });

    if (res.it) yield res.it;
    if (res.value) this.state = res.value;
    return { nextStep: EStep.NextStep };
  }`;
    const result = generateStepHandlers(flowJson, 1);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate handler for a 'decision' step with conditions", () => {
    const flowJson = {
      steps: [{ id: "check-user-role", type: "decision" }],
      connections: [
        {
          sourceStepId: "check-user-role",
          targetStepId: "adminFlow",
          condition: "user.role === 'admin'",
        },
        {
          sourceStepId: "check-user-role",
          targetStepId: "userFlow",
          condition: "user.role === 'user'",
        },
        { sourceStepId: "check-user-role", targetStepId: "defaultFlow" },
      ],
    } as Flow;

    const expected = `  private async *CheckUserRole(): StepIt<EStep, any> {
    if (this.state.user.role === 'admin') {
      return { nextStep: EStep.AdminFlow };
    }
    if (this.state.user.role === 'user') {
      return { nextStep: EStep.UserFlow };
    }
 
    {
      return { nextStep: EStep.DefaultFlow };
    }
   // Default case if no condition is met
    return { nextStep: null };
  }`;
    const result = generateStepHandlers(flowJson, 1);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should handle different baseIndentLevel", () => {
    const flowJson = {
      steps: [{ id: "begin", type: "begin" }],
      connections: [{ sourceStepId: "begin", targetStepId: "firstTask" }],
    } as Flow;

    const expected = `    private async *Begin(): StepIt<EStep, EStep.FirstTask> {
      return { nextStep: EStep.FirstTask };
    }`;
    const result = generateStepHandlers(flowJson, 2);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });
});
