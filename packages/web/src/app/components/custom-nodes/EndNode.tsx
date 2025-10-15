import { Handle, Position, type NodeProps } from "reactflow";
import type { ParsedStep } from "@tiny-json-workflow/core";

export function EndNode({ data }: NodeProps<ParsedStep>) {
  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-8 h-8 bg-black rounded-full"
    >
      <Handle
        type="target"
        position={Position.Left}
        data-testid="target-handle"
      />
    </div>
  );
}
