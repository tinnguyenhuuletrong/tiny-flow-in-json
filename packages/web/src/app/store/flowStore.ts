import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import {
  parseFromJson,
  saveToJson,
  type ParsedFlow,
} from "@tiny-json-workflow/core";
import { getLayoutedElements } from "../../lib/layout";
import {
  type Node,
  type Edge,
  type XYPosition,
  type Viewport,
} from "reactflow";

const PersistStorageVersion = 1;

type FlowMetadataState =
  | Partial<{
      reactflowViewport: Viewport;
    }>
  | undefined;

type FlowRevision = number;

type FlowState = {
  flow: ParsedFlow | undefined;
  selectedStepId: string | null;
  editingStepId: string | null;

  // revision inc everytime partial update made
  // use for optimistic component internal state control espcially in JSON Editor view (uncontrolled component)
  revision: FlowRevision;

  setFlow: (flow: ParsedFlow) => FlowRevision;
  getFlowMetadata: () => FlowMetadataState;
  doAutoLayout: () => Promise<FlowRevision>;
  updateNodePosition: (nodeId: string, position: XYPosition) => FlowRevision;
  updateFlowViewport: (value: Viewport) => FlowRevision;
  updateFlowState: (newState: Record<string, any>) => FlowRevision;
  setSelectedStepId: (stepId: string | null) => FlowRevision;
  setEditingStepId: (stepId: string | null) => FlowRevision;
  updateStepParams: (
    stepId: string,
    params: Record<string, any>
  ) => FlowRevision;
  reset: () => void;
};

const layoutFlow = async (flow: ParsedFlow): Promise<ParsedFlow> => {
  if (flow.steps.length === 0) {
    return flow;
  }

  const nodes: Node[] = flow.steps.map((step) => ({
    id: step.id,
    data: step,
    position: {
      x: (step.metadata?.x as number) || 0,
      y: (step.metadata?.y as number) || 0,
    },
    type: step.type,
  }));

  const edges: Edge[] = flow.connections.map((conn) => ({
    id: conn.id,
    source: conn.sourceStepId,
    target: conn.targetStepId,
  }));

  const { nodes: layoutedNodes } = await getLayoutedElements(nodes, edges);

  const newSteps = flow.steps.map((step) => {
    const layoutedNode = layoutedNodes.find((n) => n.id === step.id);
    if (layoutedNode) {
      return {
        ...step,
        metadata: {
          ...step.metadata,
          x: layoutedNode.position.x,
          y: layoutedNode.position.y,
        },
      };
    }
    return step;
  });

  return { ...flow, steps: newSteps };
};

const storage: PersistStorage<FlowState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    const { state, version } = JSON.parse(str);

    return {
      state: {
        ...state,
        flow: state.flow ? parseFromJson(state.flow) : undefined,
      },
      version,
    };
  },
  setItem: (name, newValue) => {
    const str = JSON.stringify({
      state: {
        ...newValue.state,
        flow: newValue.state.flow ? saveToJson(newValue.state.flow) : undefined,
      },
      version: PersistStorageVersion,
    });
    localStorage.setItem(name, str);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      flow: undefined,
      revision: 0,
      selectedStepId: null,
      editingStepId: null,

      getFlowMetadata: () => get().flow?.metadata as FlowMetadataState,
      setFlow: (flow) => {
        const revision = get().revision;
        set({ flow: flow, revision: revision + 1 });
        return revision + 1;
      },
      doAutoLayout: async () => {
        const { flow, revision } = get();
        if (!flow) return revision;
        const layoutedFlow = await layoutFlow(flow);
        set({ flow: layoutedFlow, revision: revision + 1 });
        return revision + 1;
      },
      updateNodePosition: (nodeId, position) => {
        const { revision } = get();
        set((state) => ({
          revision: state.revision + 1,
          flow: state.flow
            ? {
                ...state.flow,
                steps: state.flow.steps.map((step) => {
                  if (step.id === nodeId) {
                    return {
                      ...step,
                      metadata: { ...step.metadata, ...position },
                    };
                  }
                  return step;
                }),
              }
            : undefined,
        }));
        return revision + 1;
      },
      updateFlowViewport: (value: Viewport) => {
        const metadata = get().flow?.metadata ?? {};
        const { revision } = get();
        metadata.reactflowViewport = value;

        set((state) => ({
          revision: state.revision + 1,
          flow: state.flow
            ? {
                ...state.flow,
                metadata,
              }
            : undefined,
        }));
        return revision + 1;
      },
      updateFlowState: (newState) => {
        const { revision } = get();
        set((state) => ({
          revision: state.revision + 1,
          flow: state.flow
            ? {
                ...state.flow,
                globalState: newState,
              }
            : undefined,
        }));
        return revision + 1;
      },
      setSelectedStepId: (stepId) => {
        const { revision } = get();
        set({ selectedStepId: stepId });
        return revision;
      },
      setEditingStepId: (stepId) => {
        const { revision } = get();
        set({ editingStepId: stepId });
        return revision;
      },
      updateStepParams: (stepId, params) => {
        const { revision } = get();
        set((state) => ({
          revision: state.revision + 1,
          flow: state.flow
            ? {
                ...state.flow,
                steps: state.flow.steps.map((step) => {
                  if (step.id === stepId) {
                    return {
                      ...step,
                      params: params,
                    };
                  }
                  return step;
                }),
              }
            : undefined,
        }));
        return revision + 1;
      },
      reset: () => {
        useFlowStore.persist.clearStorage();
        set({
          flow: undefined,
          revision: 0,
          selectedStepId: null,
          editingStepId: null,
        });
      },
    }),
    {
      name: "tiny-json-workflow-session",
      storage: storage,
      version: PersistStorageVersion,
    }
  )
);
