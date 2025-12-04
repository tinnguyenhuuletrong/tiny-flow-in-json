import { Handle, Position } from "reactflow";
import { type Handle as EditorHandle } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { cn } from "@/lib/utils";

interface NodeHandlesProps {
  handles: EditorHandle[];
  nodeId: string;
}

export function NodeHandles({ handles }: NodeHandlesProps) {
  const { draggingHandleId } = useFlowStore();

  const handlesByPosition = {
    Top: handles.filter((h) => h.position === "Top"),
    Bottom: handles.filter((h) => h.position === "Bottom"),
    Left: handles.filter((h) => h.position === "Left"),
    Right: handles.filter((h) => h.position === "Right"),
  };

  return (
    <>
      {Object.entries(handlesByPosition).map(([position, handlesOnSide]) => {
        if (handlesOnSide.length === 0) return null;

        return handlesOnSide.map((handle, index) => {
          const isVertical = position === "Left" || position === "Right";
          const style = isVertical
            ? { top: `${((index + 1) * 100) / (handlesOnSide.length + 1)}%` }
            : { left: `${((index + 1) * 100) / (handlesOnSide.length + 1)}%` };

          return (
            <Handle
              key={handle.id}
              type={handle.type}
              position={Position[position as keyof typeof Position]}
              id={handle.id}
              style={style}
              data-testid={`handle-${handle.id}`} // Changed from node-${nodeId} to handle-${handle.id} for generality
              className={cn(
                draggingHandleId === handle.id &&
                  "ring-4 ring-offset-2 ring-orange-500"
              )}
            />
          );
        });
      })}
    </>
  );
}
