import { Handle, Position, type NodeProps } from "reactflow";
import { type ParsedStep } from "@tiny-json-workflow/core";
import { TimerIcon } from "lucide-react";
import { useFlowStore } from "@/app/store/flowStore";
import { cn } from "@/lib/utils";

export function ResumeAfterNode({ data }: NodeProps<ParsedStep>) {
  const { draggingHandleId } = useFlowStore();
  if (data.type !== "resumeAfter") return null;

  const sourceHandleId = data.metadata?.sourceHandles?.[0];

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
        id={sourceHandleId}
        data-testid="source-handle"
        className={cn(
          draggingHandleId === sourceHandleId &&
            "ring-4 ring-offset-2 ring-orange-500"
        )}
      />
    </div>
  );
}
