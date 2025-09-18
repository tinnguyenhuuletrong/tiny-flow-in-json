import { Handle, Position } from "reactflow";
import { type Step } from "@tiny-json-workflow/core";

export function DecisionNode({ data }: { data: Step }) {
  // Get the number of source handles from the connections
  const sourceHandles = data.metadata?.sourceHandles || [];

  return (
    <div className="w-48 h-24 border border-gray-400 rounded-lg flex items-center justify-center bg-yellow-100 font-medium p-2 text-center shadow-sm relative">
      {data.name}
      <Handle type="target" position={Position.Left} id="a" />
      {sourceHandles.map((handleId: string, index: number) => (
        <Handle
          key={handleId}
          type="source"
          position={Position.Right}
          id={handleId}
          style={{
            top: `${(index + 1) * 100 / (sourceHandles.length + 1)}%`,
          }}
        />
      ))}
    </div>
  );
}
