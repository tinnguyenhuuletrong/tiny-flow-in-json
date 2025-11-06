import { render, screen, fireEvent, waitFor } from "../../../test-utils";
import { describe, expect, it, mock, vi, beforeEach } from "bun:test";
import { EditTaskNode } from "@/app/components/shared/EditTaskNode";
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
const mockUpdateStepParams = vi.fn();

const mockFlow = parseFromJson(
  JSON.stringify({
    id: "test-flow",
    name: "Test Flow",
    version: "1.0.0",
    globalStateSchema: { type: "object", properties: {} },
    steps: [
      {
        id: "step-1",
        name: "Step with Params",
        type: "task",
        paramsSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
        },
        params: { message: "Hello" },
      },
      {
        id: "step-2",
        name: "Step without Params",
        type: "task",
      },
    ],
    connections: [],
  } satisfies Flow)
);

const stepWithParams = mockFlow.steps.find(
  (s) => s.id === "step-1"
) as ParsedStep;
const stepWithoutParams = mockFlow.steps.find(
  (s) => s.id === "step-2"
) as ParsedStep;

describe("EditTaskNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStore.mockReturnValue({
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });
  });

  it("should render JsonAutoForm for a step with paramsZodSchema", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditTaskNode editingStep={stepWithParams} />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByLabelText(/message/i)).toBeDefined();
    expect((screen.getByLabelText(/message/i) as HTMLInputElement).value).toBe(
      "Hello"
    );
  });

  it("should show a message for a step without paramsZodSchema", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditTaskNode editingStep={stepWithoutParams} />
        </DialogContent>
      </Dialog>
    );
    expect(
      screen.getByText("This step has no parameters to configure.")
    ).toBeDefined();
  });

  it("should call updateStepParams and setEditingStepId with null when Save button is clicked", async () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <EditTaskNode editingStep={stepWithParams} />
        </DialogContent>
      </Dialog>
    );
    const input = screen.getByLabelText(/message/i);
    fireEvent.change(input, { target: { value: "New Message" } });

    await waitFor(() => {
      expect(
        (screen.getByLabelText(/message/i) as HTMLInputElement).value
      ).toBe("New Message");
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockUpdateStepParams).toHaveBeenCalledWith("step-1", {
        message: "New Message",
      });
      expect(mockSetEditingStepId).toHaveBeenCalledWith(null);
    });
  });
});
