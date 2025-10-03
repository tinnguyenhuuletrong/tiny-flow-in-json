import type {
  ParsedFlow,
  ParsedStep,
  Connection,
} from "@tiny-json-workflow/core";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 40;
const NODE_RADIUS = 20;
const HORIZONTAL_SPACING = 100;

const renderStep = (step: ParsedStep, x: number, y: number) => {
  let nodeShape;
  switch (step.type) {
    case "begin":
      nodeShape = `<circle cx="${x + NODE_RADIUS}" cy="${
        y + NODE_RADIUS
      }" r="${NODE_RADIUS}" fill="#fff" stroke="#000" stroke-width="2" data-testid="begin-node" />`;
      break;
    case "end":
      nodeShape = `<circle cx="${x + NODE_RADIUS}" cy="${
        y + NODE_RADIUS
      }" r="${NODE_RADIUS}" fill="#000" data-testid="end-node" />`;
      break;
    case "task":
    case "decision":
      nodeShape = `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" rx="10" ry="10" fill="#fff" stroke="#000" stroke-width="2" data-testid="${step.type}-node" />`;
      break;
  }

  // no label for begin and end node
  if (step.type === "begin" || step.type === "end")
    return `<g>${nodeShape}</g>`;

  const nodeText = `<text x="${x + NODE_WIDTH / 2}" y="${
    y + NODE_HEIGHT / 2
  }" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">${
    step.name
  }</text>`;

  return `<g>${nodeShape}${nodeText}</g>`;
};

const renderConnection = (
  connection: Connection,
  steps: ParsedStep[],
  stepPositions: Map<string, { x: number; y: number }>
) => {
  const sourceStep = steps.find((s) => s.id === connection.sourceStepId);
  const targetStep = steps.find((s) => s.id === connection.targetStepId);

  if (!sourceStep || !targetStep) return "";

  const sourcePos = stepPositions.get(sourceStep.id)!;
  const targetPos = stepPositions.get(targetStep.id)!;

  const startX =
    sourcePos.x +
    (sourceStep.type === "begin" || sourceStep.type === "end"
      ? NODE_RADIUS * 2
      : NODE_WIDTH);
  const startY = sourcePos.y + NODE_HEIGHT / 2;
  const endX = targetPos.x;
  const endY = targetPos.y + NODE_HEIGHT / 2;

  const path = `<path d="M${startX},${startY} L${endX},${endY}" stroke="#000" stroke-width="2" fill="none" />`;

  if (connection.condition) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const conditionText = `<text x="${midX}" y="${
      midY - 5
    }" dominant-baseline="auto" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#000">${
      connection.condition
    }</text>`;
    return `<g>${path}${conditionText}</g>`;
  }

  return path;
};

export const flowToSvg = (flow: ParsedFlow): string => {
  const stepPositions = new Map<string, { x: number; y: number }>();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  flow.steps.forEach((step, index) => {
    const x = step.metadata?.x ?? index * (NODE_WIDTH + HORIZONTAL_SPACING);
    const y = step.metadata?.y ?? 50;
    stepPositions.set(step.id, { x, y });

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + NODE_WIDTH);
    maxY = Math.max(maxY, y + NODE_HEIGHT);
  });

  const connectionsSvg = flow.connections
    .map((conn) => renderConnection(conn, flow.steps, stepPositions))
    .join("\n");

  const stepsSvg = flow.steps
    .map((step) => {
      const pos = stepPositions.get(step.id)!;
      return renderStep(step, pos.x, pos.y);
    })
    .join("\n");

  const padding = 50;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${connectionsSvg}\n${stepsSvg}</svg>`;
};
