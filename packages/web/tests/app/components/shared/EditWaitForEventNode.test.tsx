import { render, screen, fireEvent, waitFor } from "../../../test-utils";
import { describe, expect, it, mock, vi, beforeEach } from "bun:test";
import { EditWaitForEventNode } from "@/app/components/shared/EditWaitForEventNode";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  type Flow,
  parseFromJson,
  type ParsedStep,
} from "@tiny-json-workflow/core";
import type { FlowState } from "@/app/store/flowStore";

const mockUseStore = vi.fn<(...args: any[]) => Partial<FlowState>>();

// Mock the useFlowStore
mock.module("@/app/store/flowStore", () => ({
  useFlowStore: mockUseStore,
}));

const mockSetEditingStepId = vi.fn();
const mockUpdateStepEventValue = vi.fn();

const mockFlow = parseFromJson(
  JSON.stringify({
    id: "test-flow",
    name: "Test Flow",
    version: "1.0.0",
    globalStateSchema: { type: "object", properties: {} },
    steps: [
      {
        id: "step-1",
        name: "Wait for Event",
        type: "waitForEvent",
        eventInput: {
          value: { message: "Hello" },
          eventInputSchema: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
        eventOutput: {
          value: { success: true },
          eventOutputSchema: {
            type: "object",
            properties: {
              success: { type: "boolean" },
            },
          },
        },
      },
      {
        id: "step-2",
        name: "Wait for Event without Schema",
        type: "waitForEvent",
      },
    ],
    connections: [],
  } satisfies Flow)
);

const stepWithSchema = mockFlow.steps.find(
  (s) => s.id === "step-1"
) as ParsedStep;
const stepWithoutSchema = mockFlow.steps.find(
  (s) => s.id === "step-2"
) as ParsedStep;

describe("EditWaitForEventNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStore.mockReturnValue({
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepEventValue: mockUpdateStepEventValue,
      revision: 0,
    });
  });

  it("should render tabs for eventInput and eventOutput", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditWaitForEventNode editingStep={stepWithSchema} />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText("Event Input")).toBeDefined();
    expect(screen.getByText("Event Output")).toBeDefined();
  });

  it("should render JsonAutoForm for eventInput", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditWaitForEventNode editingStep={stepWithSchema} />
        </DialogContent>
      </Dialog>
    );
    fireEvent.click(screen.getByText("Event Input"));
    expect(screen.getByLabelText(/message/i)).toBeDefined();
    expect((screen.getByLabelText(/message/i) as HTMLInputElement).value).toBe(
      "Hello"
    );
  });

  it("should call updateStepEventValue when eventInput form is saved", async () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditWaitForEventNode editingStep={stepWithSchema} />)
        </DialogContent>
      </Dialog>
    );
    fireEvent.click(screen.getByText("Event Input"));
    const input = screen.getByLabelText(/message/i);
    fireEvent.change(input, { target: { value: "New Message" } });

    await waitFor(() => {
      expect(
        (screen.getByLabelText(/message/i) as HTMLInputElement).value
      ).toBe("New Message");
    });

    // There are two save buttons, one for each tab. We need to get the one in the active tab.
    const saveButtons = screen.getAllByText("Save");
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(mockUpdateStepEventValue).toHaveBeenCalledWith(
        "step-1",
        "eventInput",
        {
          message: "New Message",
        }
      );
      expect(mockSetEditingStepId).toHaveBeenCalledWith(null);
    });
  });

  it("should show a message for a step without any event schema", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditWaitForEventNode editingStep={stepWithoutSchema} />
        </DialogContent>
      </Dialog>
    );
    expect(
      screen.getByText("This step has no parameters to configure.")
    ).toBeDefined();
  });
});
