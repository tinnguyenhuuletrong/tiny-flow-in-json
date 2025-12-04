import { type NodeProps } from "reactflow";
import {
  type ParsedStep,
  type Handle as EditorHandle,
  computeDefaultHandler,
} from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { NodeHandles } from "@/app/components/shared/NodeHandles";

export function DecisionNode({ data }: NodeProps<ParsedStep>) {
  const { flow } = useFlowStore();
  let handles: EditorHandle[] =
    (data.metadata?.handles as EditorHandle[]) ?? [];

  if ((!handles || handles.length === 0) && flow) {
    handles = computeDefaultHandler(flow, data.id);
  }

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-48 h-24 border border-gray-400 rounded-lg flex items-center justify-center bg-yellow-100 font-medium p-2 text-center shadow-sm relative"
    >
      {data.name}
      <NodeHandles handles={handles} nodeId={data.id} />
    </div>
  );
}
