import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { DecisionNode } from "@/app/components/custom-nodes/DecisionNode";
import { Position } from "reactflow";
import { type Step } from "@tiny-json-workflow/core";

const mockStep: Step = {
  id: "step-1",
  name: "Test Decision",
  type: "decision",
  metadata: {
    sourceHandles: ["a", "b"],
  },
};

describe("DecisionNode", () => {
  it("should render the node with name, target handle, and source handles", () => {
    render(
      <DecisionNode
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

    expect(screen.getByText("Test Decision")).toBeDefined();

    const targetHandle = screen.getByTestId("target-handle");
    expect(targetHandle).toBeDefined();
    expect(targetHandle.getAttribute("data-handlepos")).toBe(Position.Left);

    const sourceHandles = screen.getAllByTestId(/source-handle-/);
    expect(sourceHandles.length).toBe(2);
    expect(sourceHandles[0].getAttribute("data-handlepos")).toBe(
      Position.Right
    );
    expect(sourceHandles[1].getAttribute("data-handlepos")).toBe(
      Position.Right
    );
  });
});
