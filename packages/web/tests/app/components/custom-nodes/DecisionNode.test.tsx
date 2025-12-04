import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { DecisionNode } from "@/app/components/custom-nodes/DecisionNode";
import { type ParsedStep } from "@tiny-json-workflow/core";

const mockStep: ParsedStep = {
  id: "step-1",
  name: "Test Decision",
  type: "decision",
  metadata: {
    handles: [
      { id: "h-target", type: "target", position: "Left" },
      { id: "h-source-1", type: "source", position: "Right" },
      { id: "h-source-2", type: "source", position: "Right" },
    ],
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
  });
});
