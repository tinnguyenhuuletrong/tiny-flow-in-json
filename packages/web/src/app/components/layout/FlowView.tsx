import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { useFlowStore } from "@/app/store/flowStore";
import { useMemo } from "react";
import { BeginNode } from "../custom-nodes/BeginNode";
import { EndNode } from "../custom-nodes/EndNode";
import { DecisionNode } from "../custom-nodes/DecisionNode";
import { TaskNode } from "../custom-nodes/TaskNode";
import { getLayoutedElements } from "@/lib/layout";

const nodeTypes = {
  begin: BeginNode,
  end: EndNode,
  decision: DecisionNode,
  task: TaskNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

export function FlowView() {
  const { flow } = useFlowStore();

  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = flow.steps.map((step) => {
      const sourceConnections = flow.connections.filter(
        (c) => c.sourceStepId === step.id
      );
      return {
        id: step.id,
        type: step.type,
        data: {
          label: step.name,
          sourceHandles: sourceConnections.map((c) => c.id),
        },
        position: { x: 0, y: 0 }, // position is set by dagre
      };
    });

    const initialEdges: Edge[] = flow.connections.map((connection) => ({
      id: connection.id,
      source: connection.sourceStepId,
      target: connection.targetStepId,
      label: connection.condition,
      sourceHandle: connection.id,
      labelStyle: { fill: "#f00", fontWeight: 700 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "#fff", color: "#fff", fillOpacity: 0.7 },
    }));

    return getLayoutedElements(initialNodes, initialEdges);
  }, [flow]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
