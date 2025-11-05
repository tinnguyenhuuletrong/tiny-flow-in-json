
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
