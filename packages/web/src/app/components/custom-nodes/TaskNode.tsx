import { Handle, Position } from 'reactflow';

export function TaskNode({ data }: { data: { label: string } }) {
  return (
    <div className="w-48 h-16 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-white font-bold p-2 text-center">
      {data.label}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
