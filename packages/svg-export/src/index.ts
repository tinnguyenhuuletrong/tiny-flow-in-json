import type {
  ParsedFlow,
  ParsedStep,
  Connection,
} from "@tiny-json-workflow/core";
import { getSmoothStepPath, Position } from "./edge-paths";

const NODE_HEIGHT = 40;
const NODE_RADIUS = 20;
const HORIZONTAL_SPACING = 100;
const FONT_SIZE = 14;
const AVG_CHAR_WIDTH = 8; // This is an approximation
const PADDING = 40;

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
};

const calculateNodeWidth = (step: ParsedStep): number => {
  if (step.type === "task" || step.type === "decision") {
    if (step.name) {
      const labelWidth = step.name.length * AVG_CHAR_WIDTH;
      return labelWidth + PADDING;
    }
    return 150; // default width if no name
  }
  if (step.type === "begin" || step.type === "end") {
    return NODE_RADIUS * 2;
  }
  return 150; // default
};

const renderStep = (step: ParsedStep, x: number, y: number, width: number) => {
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
      nodeShape = `<rect x="${x}" y="${y}" width="${width}" height="${NODE_HEIGHT}" rx="10" ry="10" fill="#fff" stroke="#000" stroke-width="2" data-testid="${step.type}-node" />`;
      break;
  }

  // no label for begin and end node
  if (step.type === "begin" || step.type === "end" || !step.name) {
    return `<g>${nodeShape}</g>`;
  }

  const nodeText = `<text x="${x + width / 2}" y="${
    y + NODE_HEIGHT / 2
  }" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${FONT_SIZE}">${escapeXml(
    step.name
  )}</text>`;

  return `<g>${nodeShape}${nodeText}</g>`;
};

const renderConnection = (
  connection: Connection,
  steps: ParsedStep[],
  stepLayouts: Map<string, { x: number; y: number; width: number }>
) => {
  const sourceStep = steps.find((s) => s.id === connection.sourceStepId);
  const targetStep = steps.find((s) => s.id === connection.targetStepId);

  if (!sourceStep || !targetStep) return "";

  const sourceLayout = stepLayouts.get(sourceStep.id)!;
  const targetLayout = stepLayouts.get(targetStep.id)!;

  const sourceX = sourceLayout.x + sourceLayout.width;
  const sourceY = sourceLayout.y + NODE_HEIGHT / 2;
  const targetX = targetLayout.x;
  const targetY = targetLayout.y + NODE_HEIGHT / 2;

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    borderRadius: 10,
  });

  const pathEl = `<path d="${path}" stroke="#000" stroke-width="2" fill="none" />`;

  if (connection.condition) {
    const conditionText = `<text x="${labelX}" y="${
      labelY - 5
    }" dominant-baseline="auto" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#000">${escapeXml(
      connection.condition
    )}</text>`;
    return `<g>${pathEl}${conditionText}</g>`;
  }

  return pathEl;
};

export const flowToSvg = (flow: ParsedFlow): string => {
  const stepLayouts = new Map<string, { x: number; y: number; width: number }>();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  let currentX = 0;
  flow.steps.forEach((step) => {
    const width = calculateNodeWidth(step);
    let x, y;

    if (step.metadata?.x !== undefined && step.metadata?.y !== undefined) {
      x = step.metadata.x - width / 2;
      y = step.metadata.y - NODE_HEIGHT / 2;
    } else {
      x = currentX;
      y = 50;
      currentX += width + HORIZONTAL_SPACING;
    }

    stepLayouts.set(step.id, { x, y, width });

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + NODE_HEIGHT);
  });

  const connectionsSvg = flow.connections
    .map((conn) => renderConnection(conn, flow.steps, stepLayouts))
    .join("\n");

  const stepsSvg = flow.steps
    .map((step) => {
      const layout = stepLayouts.get(step.id)!;
      return renderStep(step, layout.x, layout.y, layout.width);
    })
    .join("\n");

  const padding = 50;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${connectionsSvg}\n${stepsSvg}</svg>`;
};
