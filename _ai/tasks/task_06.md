# Task 06: Implement Validation and Auto-Form for Global State (Revised)

## 1. Refactor State Management to use `ParsedFlow`

-   **Goal:** Update the `flowStore` to use the `ParsedFlow` type instead of `Flow`. This will make the Zod schemas readily available in the application state.
-   **Files to modify:**
    -   `packages/web/src/app/store/flowStore.ts`
    -   `packages/web/src/app/components/layout/JsonEditorView.tsx`
    -   Other components that use the store, like `FlowView.tsx`.
-   **Functions to use:** `parseFromJson` from `@tiny-json-workflow/core`.

### Implementation Steps:

1.  **Update `flowStore.ts`:**
    -   Change the type of the `flow` state from `Flow` to `ParsedFlow`.
    -   The `setFlow` function will now accept a `Flow` object, call `parseFromJson` to convert it into a `ParsedFlow` object, and then set the state.
    -   The initial `placeholderFlow` will be parsed using `parseFromJson` to initialize the store's state.
    -   I will add a new function `updateFlowState(newState)` to the store to update the `state` property of the `ParsedFlow` object.

2.  **Update components using the store:**
    -   I will review all components that use `useFlowStore` (e.g., `JsonEditorView.tsx`, `FlowView.tsx`) and ensure they are compatible with the `ParsedFlow` type.

## 2. Enhance JSON Editor Validation

-   **Goal:** Improve the validation in `JsonEditorView` to show human-friendly error messages and include the additional checks from the `validate` function.
-   **File to modify:** `packages/web/src/app/components/layout/JsonEditorView.tsx`
-   **Functions to use:** `validate` from `@tiny-json-workflow/core`.
-   **Library to use:** `zod-validation-error` for human-readable Zod errors.

### Implementation Steps:

1.  **Add `zod-validation-error` dependency:** I will add the `zod-validation-error` package to the `packages/web` project.
2.  **Update `handleEditorChange` in `JsonEditorView.tsx`:**
    -   After a successful `FlowSchema.safeParse`, I will have a `Flow` object.
    -   I will then call `parseFromJson` to get a `ParsedFlow` object.
    -   Next, I will call the `validate` function with the `ParsedFlow` object.
    -   The `validate` function returns an array of `FlowError`. I will format these errors and display them in the `Alert` component.
    -   I will also use `fromZodError` from `zod-validation-error` to make any Zod-related errors from `validate` more user-friendly.
    -   If there are no errors, I will call `setFlow` to update the store.

## 3. Implement Auto-Form for Global State in Left Panel

-   **Goal:** Use `@autoform/zod` to render a form in the `LeftPanel` for editing the `flow.state` based on the `flow.globalStateZodSchema`.
-   **File to modify:** `packages/web/src/app/components/layout/LeftPanel.tsx`
-   **Components and hooks to use:**
    -   `AutoForm` from `packages/web/src/components/ui/autoform/AutoForm.tsx`.
    -   `ZodProvider` from `@autoform/zod`.
    -   `useFlowStore` to access and update the flow state.

### Implementation Steps:

1.  **Modify `LeftPanel.tsx`:**
    -   Import the necessary components (`AutoForm`, `ZodProvider`).
    -   Get the `flow` (which is now a `ParsedFlow`) and `updateFlowState` from `useFlowStore`.
    -   The `flow.globalStateZodSchema` is now directly available.
    -   Instantiate `ZodProvider` with `flow.globalStateZodSchema`.
    -   Render the `AutoForm` component, passing the `schema` (the ZodProvider instance) and an `onSubmit` handler.
    -   The `onSubmit` handler will receive the validated form data. I will call `updateFlowState` with this data.
    -   The `AutoForm` will be initialized with the values from `flow.state`.
    -   The `AutoForm` will automatically handle and display validation errors.

## 4. Review and Verify

- After implementing the changes, I will run the application and test the new features to ensure everything works as expected.