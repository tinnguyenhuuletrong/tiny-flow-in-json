import { Handle, Position } from "reactflow";
import { type Step } from "@tiny-json-workflow/core";

export function TaskNode({ data }: { data: Step }) {
  return (
    <div className="w-64 h-16 border border-gray-400 rounded-lg flex items-center justify-center bg-white font-medium p-2 text-center shadow-sm">
      {data.name}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
