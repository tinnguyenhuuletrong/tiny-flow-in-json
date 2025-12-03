import { Handle, Position, type NodeProps } from "reactflow";
import type { ParsedStep } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { cn } from "@/lib/utils";

export function BeginNode({ data }: NodeProps<ParsedStep>) {
  const { draggingHandleId } = useFlowStore();
  const sourceHandleId = data.metadata?.sourceHandles?.[0];

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-8 h-8 bg-white rounded-full border-2 border-black"
    >
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
