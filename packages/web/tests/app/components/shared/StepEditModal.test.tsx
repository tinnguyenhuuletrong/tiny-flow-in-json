import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, mock, vi, beforeEach } from "bun:test";
import { StepEditModal } from "@/app/components/shared/StepEditModal";
import { type Flow, parseFromJson } from "@tiny-json-workflow/core";
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

describe("StepEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not be visible when editingStepId is null", () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: null,
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("should be visible with the correct title when editingStepId is set", () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Edit: Step with Params")).toBeDefined();
  });

  it("should render JsonAutoForm for a step with paramsZodSchema", () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
    expect(screen.getByLabelText(/message/i)).toBeDefined();
    expect((screen.getByLabelText(/message/i) as HTMLInputElement).value).toBe(
      "Hello"
    );
  });

  it("should show a message for a step without paramsZodSchema", () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: "step-2",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
    expect(
      screen.getByText("This step has no parameters to configure.")
    ).toBeDefined();
  });

  it("should call setEditingStepId with null when Cancel button is clicked", () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetEditingStepId).toHaveBeenCalledWith(null);
  });

  it("should call updateStepParams and setEditingStepId with null when Save button is clicked", async () => {
    mockUseStore.mockReturnValue({
      flow: mockFlow,
      editingStepId: "step-1",
      setEditingStepId: mockSetEditingStepId,
      updateStepParams: mockUpdateStepParams,
      revision: 0,
    });

    render(<StepEditModal />);
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
