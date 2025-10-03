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

  it("should escape special characters in labels", () => {
    const flow: ParsedFlow = {
      id: "test-flow",
      name: "Test Flow with 'special' \"characters\" & stuff",
      version: "1.0.0",
      steps: [
        { id: "begin", name: "Begin", type: "begin" },
        { id: "task", name: "Task with < > & ' \"", type: "task" },
      ],
      connections: [
        {
          id: "conn1",
          sourceStepId: "begin",
          targetStepId: "task",
          condition: "state.value > 10 && state.value < 20",
        },
      ],
      globalStateZodSchema: {} as any,
      _internal: {
        originalJsonSchema: new Map(),
      },
    };

    const svg = flowToSvg(flow);

    expect(svg).toContain("state.value &gt; 10 &amp;&amp; state.value &lt; 20");
    expect(svg).toContain(">Task with &lt; &gt; &amp; &apos; &quot;</text>");
  });
});
