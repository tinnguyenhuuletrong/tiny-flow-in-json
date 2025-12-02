import ReactFlow, {
  Controls,
  Background,
  type Edge,
  type Node,
  type NodeDragHandler,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type OnNodesChange,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import { useFlowStore } from "@/app/store/flowStore";
import { useCallback, useEffect, useMemo } from "react";
import { BeginNode } from "../custom-nodes/BeginNode";
import { EndNode } from "../custom-nodes/EndNode";
import { DecisionNode } from "../custom-nodes/DecisionNode";
import { TaskNode } from "../custom-nodes/TaskNode";
import { ResumeAfterNode } from "../custom-nodes/ResumeAfterNode";
import { WaitForEventNode } from "../custom-nodes/WaitForEventNode";

export function FlowView() {
  const {
    flow,
    updateNodePosition,
    updateFlowViewport,
    selectedStepId,
    setSelectedStepId,
  } = useFlowStore();
  const initViewPort = useFlowStore(
    (state) => state.getFlowMetadata()?.reactflowViewport
  );

  const { getViewport } = useReactFlow();

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(
    () => ({
      begin: BeginNode,
      end: EndNode,
      decision: DecisionNode,
      task: TaskNode,
      resumeAfter: ResumeAfterNode,
      waitForEvent: WaitForEventNode,
    }),
    []
  );

  useEffect(() => {
    if (!flow) return;
    if (flow.steps.length === 0) return;

    const newNodes: Node[] = flow.steps.map((step) => {
      const sourceConnections = flow.connections.filter(
        (c) => c.sourceStepId === step.id
      );
      const stepWithSourceHandles = {
        ...step,
        metadata: {
          ...step.metadata,
          sourceHandles: sourceConnections.map((c) => c.id),
        },
      };

      const isSelected = step.id === selectedStepId;

      return {
        id: step.id,
        type: step.type,
        data: stepWithSourceHandles,
        position: { x: step.metadata?.x || 0, y: step.metadata?.y || 0 },
        selected: isSelected,
        className: isSelected ? "rounded-lg ring-4 ring-blue-500" : "",
      };
    });
    setNodes(newNodes);

    const newEdges: Edge[] = flow.connections.map((connection) => {
      const isSourceNodeSelected = connection.sourceStepId === selectedStepId;
      return {
        id: connection.id,
        source: connection.sourceStepId,
        target: connection.targetStepId,
        label: connection.condition,
        sourceHandle: connection.id,
        type: "smoothstep",
        animated: isSourceNodeSelected ? true : false,
        labelStyle: {
          fill: "#777",
          fontWeight: 500,
          stroke: isSourceNodeSelected ? "var(--color-blue-500)" : "",
        },
        style: {
          stroke: isSourceNodeSelected ? "var(--color-blue-500)" : "",
        },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: "#fff", fillOpacity: 0.6 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "black",
        },
        selected: isSourceNodeSelected,
      };
    });
    setEdges(newEdges);
  }, [flow, setNodes, setEdges, selectedStepId]);

  const onNodeDragStop: NodeDragHandler = (_, node) => {
    updateNodePosition(node.id, node.position);
  };
  const onFitView = useCallback(() => {
    const vp = getViewport();
    updateFlowViewport(vp);
  }, [getViewport, updateFlowViewport]);

  const onNodesChange: OnNodesChange = (changes) => {
    onNodesChangeInternal(changes);
    changes.forEach((change) => {
      if (change.type === "select" && change.selected) {
        setSelectedStepId(change.id);
      }
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeDragStop={onNodeDragStop}
      defaultViewport={initViewPort}
      onPaneClick={() => setSelectedStepId(null)}
    >
      <Controls onFitView={onFitView} />
      <Background />
    </ReactFlow>
  );
}
