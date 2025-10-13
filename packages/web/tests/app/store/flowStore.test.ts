import { describe, it, expect, beforeEach, mock } from "bun:test";
import { useFlowStore } from "../../../src/app/store/flowStore";
import {
  parseFromJson,
  type Flow,
  type ParsedFlow,
} from "@tiny-json-workflow/core";

// Mock the layout function
mock.module("../../../src/lib/layout", () => ({
  getLayoutedElements: async (nodes: any[], edges: any[]) => {
    const layoutedNodes = nodes.map((n) => ({
      ...n,
      position: { x: 10, y: 20 },
    }));
    return { nodes: layoutedNodes, edges };
  },
}));

const rawFlowJson = {
  id: "test-flow",
  name: "Test Flow",
  version: "1.0.0",
  globalStateSchema: { type: "object", properties: {} },
  steps: [
    { id: "step1", type: "begin", name: "Start", params: {} },
    { id: "step2", type: "task", name: "Task 1", params: {} },
  ],
  connections: [{ id: "conn1", sourceStepId: "step1", targetStepId: "step2" }],
} satisfies Flow;

describe("useFlowStore", () => {
  let mockFlow: ParsedFlow;

  beforeEach(() => {
    // Create a valid ParsedFlow object before each test
    mockFlow = parseFromJson(JSON.stringify(rawFlowJson));
    useFlowStore.getState().reset();
  });

  it("should have the correct initial state", () => {
    const { flow, revision, selectedStepId, editingStepId } =
      useFlowStore.getState();
    expect(flow).toBeUndefined();
    expect(revision).toBe(0);
    expect(selectedStepId).toBeNull();
    expect(editingStepId).toBeNull();
  });

  it("setFlow should update the flow and increment revision", () => {
    const initialRevision = useFlowStore.getState().revision;
    const newRevision = useFlowStore.getState().setFlow(mockFlow);

    const { flow, revision } = useFlowStore.getState();
    expect(flow?.id).toBe(mockFlow.id);
    expect(flow?.steps.length).toBe(mockFlow.steps.length);
    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });
});
