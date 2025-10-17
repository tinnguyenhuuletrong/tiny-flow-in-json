export enum Position {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
}

interface GetSmoothStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number;
}

export const getSmoothStepPath = ({
  sourceX,
  sourceY,
  sourcePosition = Position.Right,
  targetX,
  targetY,
  targetPosition = Position.Left,
  borderRadius = 10,
}: GetSmoothStepPathParams): [string, number, number] => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // If the y-coordinates are very close, draw a straight horizontal line.
  if (Math.abs(sourceY - targetY) < 0.1) {
    return [`M ${sourceX},${sourceY} L ${targetX},${targetY}`, midX, midY];
  }

  const yDir = targetY > sourceY ? 1 : -1;
  const xDir = targetX > sourceX ? 1 : -1;

  // The radius for the corners is adjusted if the vertical distance is small.
  const r = Math.min(borderRadius, Math.abs(targetY - sourceY) / 2);

  let path = "";
  let labelX = midX;
  let labelY = midY;

  if (sourcePosition === Position.Right && targetPosition === Position.Left) {
    const corner1 = { x: midX, y: sourceY };
    const corner2 = { x: midX, y: targetY };

    path = `M ${sourceX},${sourceY} L ${corner1.x - r * xDir},${corner1.y}`;
    path += ` Q ${corner1.x},${corner1.y} ${corner1.x},${corner1.y + r * yDir}`;
    path += ` L ${corner2.x},${corner2.y - r * yDir}`;
    path += ` Q ${corner2.x},${corner2.y} ${corner2.x + r * xDir},${corner2.y}`;
    path += ` L ${targetX},${targetY}`;
    labelX = midX;
  } else {
    // Fallback to a straight line for other connection types.
    path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  }

  return [path, labelX, labelY];
};
