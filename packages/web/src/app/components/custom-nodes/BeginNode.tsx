import { Handle, Position, type NodeProps } from "reactflow";
import type { ParsedStep } from "@tiny-json-workflow/core";

export function BeginNode({ data }: NodeProps<ParsedStep>) {
  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-8 h-8 bg-white rounded-full border-2 border-black"
    >
      <Handle
        type="source"
        position={Position.Right}
        data-testid="source-handle"
      />
    </div>
  );
}
