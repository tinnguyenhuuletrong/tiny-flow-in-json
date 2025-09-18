import { create } from "zustand";
import type { Flow, Step } from "@tiny-json-workflow/core";
import { placeholderFlow } from "../../data/placeholder";
import { getLayoutedElements } from "../../lib/layout";
import { type Node, type Edge, type XYPosition } from "reactflow";

type FlowState = {
  flow: Flow;
  layoutCounter: number;
  setFlow: (flow: Flow) => Promise<void>;
  importFlow: (flow: Flow) => void;
  doAutoLayout: () => Promise<void>;
  updateNodePosition: (nodeId: string, position: XYPosition) => void;
};

const layoutFlow = async (flow: Flow): Promise<Flow> => {
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

  return { ...flow, steps: newSteps as Step[] };
};

export const useFlowStore = create<FlowState>((set, get) => ({
  flow: placeholderFlow,
  layoutCounter: 0,
  setFlow: async (flow) => {
    const layoutedFlow = await layoutFlow(flow);
    set((state) => ({
      flow: layoutedFlow,
      layoutCounter: state.layoutCounter + 1,
    }));
  },
  importFlow: (flow) => {
    set((state) => ({
      flow,
      layoutCounter: state.layoutCounter + 1,
    }));
  },
  doAutoLayout: async () => {
    const { flow } = get();
    const layoutedFlow = await layoutFlow(get().flow);
    set((state) => ({
      flow: layoutedFlow,
      layoutCounter: state.layoutCounter + 1,
    }));
  },
  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      flow: {
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
      },
    }));
  },
}));

