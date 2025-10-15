import { Handle, Position, type NodeProps } from "reactflow";
import { type ParsedStep } from "@tiny-json-workflow/core";

export function DecisionNode({ data }: NodeProps<ParsedStep>) {
  // Get the number of source handles from the connections
  const sourceHandles = data.metadata?.sourceHandles || [];

  return (
    <div
      data-testid={`node-${data.id}`}
      className="w-48 h-24 border border-gray-400 rounded-lg flex items-center justify-center bg-yellow-100 font-medium p-2 text-center shadow-sm relative"
    >
      {data.name}
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        data-testid="target-handle"
      />
      {sourceHandles.map((handleId: string, index: number) => (
        <Handle
          key={handleId}
          type="source"
          position={Position.Right}
          id={handleId}
          style={{
            top: `${((index + 1) * 100) / (sourceHandles.length + 1)}%`,
          }}
          data-testid={`source-handle-${handleId}`}
        />
      ))}
    </div>
  );
}
