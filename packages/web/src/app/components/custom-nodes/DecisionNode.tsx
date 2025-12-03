import { Handle, Position, type NodeProps } from "reactflow";
import {
  type ParsedStep,
  type Handle as EditorHandle,
  computeDefaultHandler,
} from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { cn } from "@/lib/utils";

export function DecisionNode({ data }: NodeProps<ParsedStep>) {
  const { flow, draggingHandleId } = useFlowStore();
  let handles: EditorHandle[] = (data.metadata?.handles as EditorHandle[]) ?? [];

  if ((!handles || handles.length === 0) && flow) {
    handles = computeDefaultHandler(flow, data.id);
  }

  const handlesByPosition = {
    Top: handles.filter((h) => h.position === "Top"),
    Bottom: handles.filter((h) => h.position === "Bottom"),
    Left: handles.filter((h) => h.position === "Left"),
    Right: handles.filter((h) => h.position === "Right"),
  };

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-48 h-24 border border-gray-400 rounded-lg flex items-center justify-center bg-yellow-100 font-medium p-2 text-center shadow-sm relative"
    >
      {data.name}
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
              data-testid={`${handle.type}-handle-${handle.id}`}
              className={cn(
                draggingHandleId === handle.id &&
                  "ring-4 ring-offset-2 ring-orange-500"
              )}
            />
          );
        });
      })}
    </div>
  );
}
