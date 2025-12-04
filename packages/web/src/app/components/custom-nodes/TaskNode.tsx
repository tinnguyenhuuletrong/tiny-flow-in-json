import { type NodeProps } from "reactflow";
import { type ParsedStep, type Handle as EditorHandle, computeDefaultHandler } from "@tiny-json-workflow/core";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useFlowStore } from "@/app/store/flowStore";
import { NodeHandles } from "@/app/components/shared/NodeHandles";

export function TaskNode({ data }: NodeProps<ParsedStep>) {
  const { setEditingStepId, flow } = useFlowStore();
  if (data.type !== "task") return null;

  let handles: EditorHandle[] = (data.metadata?.handles as EditorHandle[]) ?? [];

  if ((!handles || handles.length === 0) && flow) {
    handles = computeDefaultHandler(flow, data.id);
  }

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-64 h-16 border border-gray-400 rounded-lg flex items-center justify-center bg-white font-medium p-2 text-center shadow-sm"
    >
      {data.name}
      {data.paramsZodSchema && (
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
      <NodeHandles handles={handles} nodeId={data.id} />
    </div>
  );
}
