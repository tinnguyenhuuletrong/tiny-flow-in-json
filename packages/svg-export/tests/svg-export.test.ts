import { describe, it, expect } from "bun:test";
import { flowToSvg } from "../src";
import type { ParsedFlow } from "@tiny-json-workflow/core";

describe("flowToSvg", () => {
  it("should return a string", () => {
    const flow: ParsedFlow = {
      id: "test-flow",
      name: "Test Flow",
      version: "1.0.0",
      steps: [],
      connections: [],
      globalStateZodSchema: {} as any,
      _internal: {
        originalJsonSchema: new Map(),
      },
    };
    expect(typeof flowToSvg(flow)).toBe("string");
  });

  it("should generate correct SVG elements for each step type", () => {
    const flow: ParsedFlow = {
      id: "test-flow",
      name: "Test Flow",
      version: "1.0.0",
      steps: [
        { id: "begin", name: "Begin", type: "begin" },
        { id: "task", name: "Task", type: "task" },
        { id: "end", name: "End", type: "end" },
      ],
      connections: [],
      globalStateZodSchema: {} as any,
      _internal: {
        originalJsonSchema: new Map(),
      },
    };

    const svg = flowToSvg(flow);

    // Check for begin and end nodes (circles)
    expect(svg).toContain("<circle");

    // Check for task node (rect)
    expect(svg).toContain("<rect");
  });

  it("should generate correct SVG elements for connections", () => {
    const flow: ParsedFlow = {
      id: "test-flow",
      name: "Test Flow",
      version: "1.0.0",
      steps: [
        { id: "begin", name: "Begin", type: "begin" },
        { id: "task", name: "Task", type: "task" },
      ],
      connections: [
        {
          id: "conn1",
          sourceStepId: "begin",
          targetStepId: "task",
          condition: "IsReady",
        },
      ],
      globalStateZodSchema: {} as any,
      _internal: {
        originalJsonSchema: new Map(),
      },
    };

    const svg = flowToSvg(flow);

    // Check for connection line (path)
    expect(svg).toContain("<path");

    // Check for connection condition text
    expect(svg).toContain(">IsReady</text>");
  });

  it("should use metadata for layout", () => {
    const flow: ParsedFlow = {
      id: "test-flow",
      name: "Test Flow",
      version: "1.0.0",
      steps: [
        {
          id: "begin",
          name: "Begin",
          type: "begin",
          metadata: { x: 100, y: 200 },
        },
        {
          id: "task",
          name: "Task",
          type: "task",
          metadata: { x: 400, y: 200 },
        },
      ],
      connections: [],
      globalStateZodSchema: {} as any,
      _internal: {
        originalJsonSchema: new Map(),
      },
    };

    const svg = flowToSvg(flow);

    // Check that the viewBox is calculated correctly based on metadata
    expect(svg).toContain('viewBox="50 150 550 140"');
  });
});
