import { Handle, Position } from 'reactflow';

export function DecisionNode({ data }: { data: { label: string, sourceHandles: string[] } }) {
  return (
    <div style={{ width: 200, height: 150, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#fde047',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          padding: '1rem',
          textAlign: 'center'
        }}
      >
        {data.label}
      </div>
      <Handle type="target" position={Position.Left} id="a" />
      {data.sourceHandles.map((handleId, index) => (
        <Handle
          key={handleId}
          type="source"
          position={Position.Right}
          id={handleId}
          style={{ top: `${(index + 1) * 100 / (data.sourceHandles.length + 1)}%` }}
        />
      ))}
    </div>
  );
}
