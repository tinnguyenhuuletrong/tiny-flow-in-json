import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { WaitForEventNode } from "@/app/components/custom-nodes/WaitForEventNode";
import {
  type ParsedStepWaitForEvent,
  parseFromJson,
} from "@tiny-json-workflow/core";

const mockStep: ParsedStepWaitForEvent = {
  id: "step-1",
  name: "Test Wait For Event",
  type: "waitForEvent",
};

const mockStepWithSchema = parseFromJson(
  JSON.stringify({
    id: "test-flow",
    name: "Test Flow",
    version: "1.0.0",
    globalStateSchema: { type: "object", properties: {} },
    steps: [
      {
        id: "step-1",
        name: "Test Wait For Event",
        type: "waitForEvent",
        eventInput: {
          eventInputSchema: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    ],
    connections: [],
  })
).steps[0] as ParsedStepWaitForEvent;

describe("WaitForEventNode", () => {
  it("should render the node with name and handles", () => {
    render(
      <WaitForEventNode
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

    expect(screen.getByText("Test Wait For Event")).toBeDefined();
  });

  it("should not render the edit button if no schema is present", () => {
    render(
      <WaitForEventNode
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

    expect(screen.queryByTestId("node-step-1-edit-params")).toBeNull();
  });

  it("should render the edit button if a schema is present", () => {
    render(
      <WaitForEventNode
        data={mockStepWithSchema}
        id={mockStepWithSchema.id}
        type={mockStepWithSchema.type}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />
    );

    expect(screen.getByTestId("node-step-1-edit-params")).toBeDefined();
  });
});
