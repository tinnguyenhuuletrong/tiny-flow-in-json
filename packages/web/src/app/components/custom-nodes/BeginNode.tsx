import { Handle, Position } from 'reactflow';

export function BeginNode({ data }: { data: { label: string } }) {
  return (
    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white font-bold p-2 text-center">
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
