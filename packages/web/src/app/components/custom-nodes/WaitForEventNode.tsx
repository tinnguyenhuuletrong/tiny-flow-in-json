import { Handle, Position, type NodeProps } from "reactflow";
import { type ParsedStep } from "@tiny-json-workflow/core";
import { Button } from "@/components/ui/button";
import { Edit, MailQuestionIcon } from "lucide-react";
import { useFlowStore } from "@/app/store/flowStore";
import { cn } from "@/lib/utils";

export function WaitForEventNode({ data }: NodeProps<ParsedStep>) {
  const { setEditingStepId, draggingHandleId } = useFlowStore();
  if (data.type !== "waitForEvent") return null;

  const hasSchema =
    data.eventInput?.eventInputZodSchema ||
    data.eventOutput?.eventOutputZodSchema;

  const sourceHandleId = data.metadata?.sourceHandles?.[0];

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-64 h-16 border border-gray-400 rounded-lg flex items-center justify-center bg-orange-50 font-medium p-2 text-center shadow-sm gap-2"
    >
      <MailQuestionIcon className="h-5 w-5 text-gray-600" />
      <span>{data.name}</span>
      {hasSchema && (
        <Button
          data-testid={`node-${data.id}-edit-params`}
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setEditingStepId(data.id);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
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
