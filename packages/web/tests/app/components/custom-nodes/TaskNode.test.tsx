import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { TaskNode } from "@/app/components/custom-nodes/TaskNode";
import { Position } from "reactflow";
import { type Step } from "@tiny-json-workflow/core";

const mockStep: Step = {
  id: "step-1",
  name: "Test Task",
  type: "task",
};

describe("TaskNode", () => {
  it("should render the node with name, target handle, and source handle", () => {
    render(
      <TaskNode
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

    expect(screen.getByText("Test Task")).toBeDefined();

    const targetHandle = screen.getByTestId("target-handle");
    expect(targetHandle).toBeDefined();
    expect(targetHandle.getAttribute("data-handlepos")).toBe(Position.Left);
    expect(targetHandle.className).toContain("target");

    const sourceHandle = screen.getByTestId("source-handle");
    expect(sourceHandle).toBeDefined();
    expect(sourceHandle.getAttribute("data-handlepos")).toBe(Position.Right);
    expect(sourceHandle.className).toContain("source");
  });
});
