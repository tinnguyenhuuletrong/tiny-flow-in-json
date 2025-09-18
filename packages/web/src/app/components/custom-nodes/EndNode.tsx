import { Handle, Position } from "reactflow";

export function EndNode() {
  return (
    <div className="w-8 h-8 bg-black rounded-full">
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
