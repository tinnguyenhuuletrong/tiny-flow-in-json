import { Handle, Position } from "reactflow";

export function BeginNode() {
  return (
    <div className="w-8 h-8 bg-white rounded-full border-2 border-black">
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
