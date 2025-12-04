import { type NodeProps } from "reactflow";
import { type ParsedStep, type Handle as EditorHandle, computeDefaultHandler } from "@tiny-json-workflow/core";
import { TimerIcon } from "lucide-react";
import { useFlowStore } from "@/app/store/flowStore";
import { NodeHandles } from "@/app/components/shared/NodeHandles";

export function ResumeAfterNode({ data }: NodeProps<ParsedStep>) {
  const { flow } = useFlowStore();
  if (data.type !== "resumeAfter") return null;

  let handles: EditorHandle[] = (data.metadata?.handles as EditorHandle[]) ?? [];

  if ((!handles || handles.length === 0) && flow) {
    handles = computeDefaultHandler(flow, data.id);
  }

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-64 h-16 border border-gray-400 rounded-lg flex items-center justify-center bg-blue-50 font-medium p-2 text-center shadow-sm gap-2"
    >
      <TimerIcon className="h-5 w-5 text-gray-600" />
      <div className="flex flex-col">
        <span>{data.name}</span>
        <span className="text-xs text-gray-500">{data.duration}</span>
      </div>
      <NodeHandles handles={handles} nodeId={data.id} />
    </div>
  );
}
