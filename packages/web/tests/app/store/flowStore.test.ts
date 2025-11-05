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
    { id: "step1", type: "begin", name: "Start" },
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

  it("setSelectedStepId should update the selectedStepId", () => {
    useFlowStore.getState().setSelectedStepId("step1");
    expect(useFlowStore.getState().selectedStepId).toBe("step1");
  });

  it("setEditingStepId should update the editingStepId", () => {
    useFlowStore.getState().setEditingStepId("step2");
    expect(useFlowStore.getState().editingStepId).toBe("step2");
  });

  it("updateStepParams should update the params of a specific step and increment revision", () => {
    useFlowStore.getState().setFlow(mockFlow);
    const initialRevision = useFlowStore.getState().revision;
    const newParams = { newParam: "newValue" };
    const newRevision = useFlowStore
      .getState()
      .updateStepParams("step2", newParams);

    const { flow, revision } = useFlowStore.getState();
    const updatedStep = flow?.steps.find((s) => s.id === "step2");

    expect(updatedStep?.type === "task" && updatedStep?.params).toEqual(
      newParams
    );
    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });

  it("updateNodePosition should update a node position and increment revision", () => {
    useFlowStore.getState().setFlow(mockFlow);
    const initialRevision = useFlowStore.getState().revision;
    const newPosition = { x: 200, y: 300 };
    const newRevision = useFlowStore
      .getState()
      .updateNodePosition("step1", newPosition);

    const { flow, revision } = useFlowStore.getState();
    const updatedStep = flow?.steps.find((s) => s.id === "step1");

    expect(updatedStep?.metadata?.x).toBe(200);
    expect(updatedStep?.metadata?.y).toBe(300);
    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });

  it("updateFlowState should update the globalState and increment revision", () => {
    useFlowStore.getState().setFlow(mockFlow);
    const initialRevision = useFlowStore.getState().revision;
    const newGlobalState = { global: "state" };
    const newRevision = useFlowStore.getState().updateFlowState(newGlobalState);

    const { flow, revision } = useFlowStore.getState();
    expect(flow?.globalState).toEqual(newGlobalState);
    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });

  it("updateFlowViewport should update the viewport in metadata and increment revision", () => {
    useFlowStore.getState().setFlow(mockFlow);
    const initialRevision = useFlowStore.getState().revision;
    const newViewport = { x: 100, y: 200, zoom: 2 };
    const newRevision = useFlowStore.getState().updateFlowViewport(newViewport);

    const { flow, revision } = useFlowStore.getState();
    expect(flow?.metadata?.reactflowViewport).toEqual(newViewport);
    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });

  it("doAutoLayout should update node positions and increment revision", async () => {
    useFlowStore.getState().setFlow(mockFlow);
    const initialRevision = useFlowStore.getState().revision;
    const newRevision = await useFlowStore.getState().doAutoLayout();

    const { flow, revision } = useFlowStore.getState();
    const step1 = flow?.steps.find((s) => s.id === "step1");
    const step2 = flow?.steps.find((s) => s.id === "step2");

    // Check against the mocked layout values
    expect(step1?.metadata?.x).toBe(10);
    expect(step1?.metadata?.y).toBe(20);
    expect(step2?.metadata?.x).toBe(10);
    expect(step2?.metadata?.y).toBe(20);

    expect(revision).toBe(initialRevision + 1);
    expect(newRevision).toBe(initialRevision + 1);
  });

  it("getFlowMetadata should return the flow metadata", () => {
    const metadata = { reactflowViewport: { x: 1, y: 1, zoom: 0.5 } };
    const flowWithMeta = {
      ...mockFlow,
      metadata,
      _internal: mockFlow._internal,
    };
    useFlowStore.getState().setFlow(flowWithMeta);

    const result = useFlowStore.getState().getFlowMetadata();
    expect(result).toEqual(metadata);
  });

  it("getFlowMetadata should return undefined if flow is not set", () => {
    const result = useFlowStore.getState().getFlowMetadata();
    expect(result).toBeUndefined();
  });
});
