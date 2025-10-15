import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { BeginNode } from "@/app/components/custom-nodes/BeginNode";
import { Position } from "reactflow";
import type { Step } from "@tiny-json-workflow/core";

const mockStep: Step = {
  id: "step-1",
  name: "Test Begin",
  type: "begin",
};

describe("BeginNode", () => {
  it("should render a circle with a source handle on the right", () => {
    render(
      <BeginNode
        data={mockStep}
        id="step-1"
        type="begin"
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />
    );

    const handle = screen.getByTestId("source-handle");
    expect(handle).toBeDefined();
    expect(handle.getAttribute("data-handlepos")).toBe(Position.Right);
    expect(handle.className).toContain("source");
  });
});
