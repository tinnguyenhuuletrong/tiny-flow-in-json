import { Handle, Position } from 'reactflow';

export function EndNode({ data }: { data: { label: string } }) {
  return (
    <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white font-bold p-2 text-center">
      {data.label}
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
