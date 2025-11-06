
# Task 18: Enhance `packages/core` with new step types

## Goal

Enhance `packages/core` by adding two new step types: `resumeAfter` and `waitForEvent`.

## Requirements

### 1. Add `resumeAfter` step type

-   This step should pause the workflow and resume it after a specified duration.
-   It should have a `duration` parameter, which is a human-readable date-time string (e.g., "2 hours", "1 day").
-   The `StepResumeAfterSchema` should be defined in `packages/core/src/types.ts`.
-   Update the `Step` type to include `StepResumeAfter`.

### 2. Add `waitForEvent` step type

-   This step should pause the workflow until a specific event is received.
-   It should have two parameters: `eventInput` and `eventOutput`.
-   `eventInput` should contain a `value` and `eventInputSchema` which defines the JSON schema for the expected event payload.
-   `eventOutput` should contain a `value` and `eventOutputSchema` which defines the JSON schema for the data that will be passed to the next step.
-   The `StepWaitForEventSchema` should be defined in `packages/core/src/types.ts`.
-   Update the `Step` type to include `StepWaitForEvent`.

### 3. Update descriptions and variable names

-   Ensure that all new types and schemas have clear and concise descriptions.
-   Use consistent naming conventions that align with the existing codebase.
-   Avoid confusion between different step types.

## Files to modify

-   `packages/core/src/types.ts`
-   `packages/core/tests/validation.test.ts` (to add tests for the new step types)

## Plan

1.  **Define `StepResumeAfterSchema`**:
    -   In `packages/core/src/types.ts`, create a new Zod schema for the `resumeAfter` step.
    -   It should include `id`, `name`, `type` (literal `resumeAfter`), `duration` (string), and optional `metadata`.

2.  **Define `StepWaitForEventSchema`**:
    -   In `packages/core/src/types.ts`, create a new Zod schema for the `waitForEvent` step.
    -   It should include `id`, `name`, `type` (literal `waitForEvent`),
        `eventInput`: an object containing `value` (any) and `eventInputSchema` (JsonSchema),
        `eventOutput`: an object containing `value` (any) and `eventOutputSchema` (JsonSchema), and optional `metadata`.

3.  **Update `Step` and related types**:
    -   Add `StepResumeAfterSchema` and `StepWaitForEventSchema` to the `z.union` in `FlowSchema.steps`.
    -   Add `StepResumeAfter` and `StepWaitForEvent` to the `Step` and `ParsedStep` types.

4.  **Add tests**:
    -   In `packages/core/tests/validation.test.ts`, add new test cases to validate workflows that use the `resumeAfter` and `waitForEvent` steps.
    -   Ensure that both valid and invalid schemas are tested.

### Phase 2: Update Web UI (`@tiny-json-workflow/web`)

This phase focuses on making the web-based playground aware of the new `resumeAfter` and `waitForEvent` step types, with a focus on good developer experience for inspecting and editing event payloads.

1.  **Create `ResumeAfterNode.tsx` Component:**
    -   Create a new file at `packages/web/src/app/components/custom-nodes/ResumeAfterNode.tsx`.
    -   This component will render the `resumeAfter` step, displaying the step name and the `duration`. It will include a timer icon from `lucide-react` for better visual identification.

2.  **Create `WaitForEventNode.tsx` Component:**
    -   Create a new file at `packages/web/src/app/components/custom-nodes/WaitForEventNode.tsx`.
    -   This component will render the `waitForEvent` step, displaying the step name and an event-related icon.
    -   It will include an "Edit" button, similar to `TaskNode`, which becomes visible if the step has an `eventInputSchema` or `eventOutputSchema`. Clicking this button will set the `editingStepId` in the `flowStore`.

3.  **Update `FlowView.tsx`:**
    -   Import the new `ResumeAfterNode` and `WaitForEventNode` components.
    -   Add the new step types to the `nodeTypes` mapping to instruct React Flow on how to render them.

4.  **Enhance Sidebar (`LeftPanel.tsx`):**
    -   Modify the component to render details for a selected `waitForEvent` step.
    -   When a `waitForEvent` step is selected, display a new accordion item titled "Event Payloads".
    -   Inside, if `eventInputZodSchema` exists, show a sub-section for "Event Input" containing a `JsonAutoForm` to view/edit the `eventInput.value`.
    -   Similarly, if `eventOutputZodSchema` exists, show a sub-section for "Event Output" with a `JsonAutoForm` for `eventOutput.value`.

5.  **Enhance Step Editing Modal (`StepEditModal.tsx`):**
    -   Modify the modal to handle the `waitForEvent` step type.
    -   When the `editingStep` is a `waitForEvent` step, the modal should display tabs for "Event Input" and "Event Output".
    -   Each tab will contain the corresponding `JsonAutoForm` for editing the event's `value`.

6.  **Update State Management (`flowStore.ts`):**
    -   Add a new action, `updateStepEventValue(stepId: string, part: 'eventInput' | 'eventOutput', value: any)`, to the store.
    -   This action will be responsible for updating the `eventInput.value` or `eventOutput.value` for the specified `waitForEvent` step and incrementing the store's revision.
