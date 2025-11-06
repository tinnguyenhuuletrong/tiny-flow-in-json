import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { ResumeAfterNode } from "@/app/components/custom-nodes/ResumeAfterNode";
import { Position } from "reactflow";
import type { Step } from "@tiny-json-workflow/core";

const mockStep: Step = {
  id: "step-1",
  name: "Test Resume After",
  type: "resumeAfter",
  duration: "1 day",
};

describe("ResumeAfterNode", () => {
  it("should render the node with name, duration, and handles", () => {
    render(
      <ResumeAfterNode
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

    expect(screen.getByText("Test Resume After")).toBeDefined();
    expect(screen.getByText("1 day")).toBeDefined();

    const targetHandle = screen.getByTestId("target-handle");
    expect(targetHandle).toBeDefined();
    expect(targetHandle.getAttribute("data-handlepos")).toBe(Position.Left);

    const sourceHandle = screen.getByTestId("source-handle");
    expect(sourceHandle).toBeDefined();
    expect(sourceHandle.getAttribute("data-handlepos")).toBe(Position.Right);
  });
});
