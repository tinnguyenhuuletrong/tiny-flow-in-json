import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { EndNode } from "@/app/components/custom-nodes/EndNode";
import { Position } from "reactflow";
import type { Step } from "@tiny-json-workflow/core";

const mockStep: Step = {
  id: "step-1",
  name: "Test End",
  type: "end",
};

describe("EndNode", () => {
  it("should render a circle with a target handle on the left", () => {
    render(
      <EndNode
        data={mockStep}
        id={mockStep.id}
        type={mockStep.type}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />
    );

    const handle = screen.getByTestId("target-handle");
    expect(handle).toBeDefined();
    expect(handle.getAttribute("data-handlepos")).toBe(Position.Left);
    expect(handle.className).toContain("target");
  });
});
