import { Handle, Position, type NodeProps } from "reactflow";
import { type ParsedStep } from "@tiny-json-workflow/core";
import { TimerIcon } from "lucide-react";

export function ResumeAfterNode({ data }: NodeProps<ParsedStep>) {
  if (data.type !== "resumeAfter") return null;

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
      <Handle
        type="target"
        position={Position.Left}
        data-testid="target-handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        data-testid="source-handle"
      />
    </div>
  );
}
