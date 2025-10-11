# Task 10: Refactor Toolbar, Create Empty State, and Add Persistence

## Goal

Refactor the UI to use a `menubar`, create an "empty state" view for new sessions, and implement local storage persistence to save and restore the user's workflow automatically.

## Requirements

1.  **Local Storage Persistence**:
    *   The current workflow state must be automatically saved to the browser's local storage whenever it changes.
    *   On application load, the workflow must be restored from local storage if it exists.
    *   The `EmptyState` view should only be shown if no session is found in local storage.

2.  **Empty State View**:
    *   Create a new component, `EmptyState.tsx`, that is displayed only when no workflow is loaded from local storage.
    *   This view should be inspired by `https://ui.shadcn.com/docs/components/empty`.
    *   It should offer two primary actions:
        *   **New File**: To start a new, blank workflow.
        *   **Load Examples**: A list of pre-defined example workflows.

3.  **Replace Toolbar Buttons with Menubar**:
    *   Use `https://ui.shadcn.com/docs/components/menubar`.
    *   Organize all actions into logical sub-menus.

4.  **Organize Menus**:
    *   **File Menu**: `New`, `Import`, `Export`.
    *   **View Menu**: `Auto Layout`.
    *   **Examples Menu**: Sub-menu for each example.

5.  **Load Examples Feature**:
    *   Create a new shared package (`@tiny-json-workflow/examples`) to store and share example JSON files.

## Implementation Steps

### 1. Implement Persistence in `flowStore`

1.  Modify `packages/web/src/app/store/flowStore.ts` to use the `persist` middleware from `zustand/middleware`.
2.  Configure the middleware to save the `flow` state to local storage.
3.  Use the name `tiny-json-workflow-session` for the local storage item.
4.  Ensure that the store rehydrates automatically on application startup.

### 2. Create a Shared Examples Package

1.  Create a new package `examples` in the `packages` directory.
2.  Move `examples/data/*.json` to `packages/examples/src`.
3.  Create a `package.json` for the new package and update the root `package.json` to include the new workspace.
4.  Add `@tiny-json-workflow/examples` as a dependency in `packages/web/package.json`.
5.  Run `bun install`.

### 3. Install and Set Up `menubar`

1.  In `packages/web`, run `bunx shadcn-ui@latest add menubar`.

### 4. Create `EmptyState.tsx` Component

1.  Create `packages/web/src/app/components/layout/EmptyState.tsx`.
2.  Build the UI with `Card`, `Button`, etc.
3.  Implement the `New File` button to call `setFlow` with a minimal workflow.
4.  Implement the `Load Examples` section to load the selected example using `parseFromJson` and `setFlow`.

### 5. Update Main View for Conditional Rendering

1.  In the main view component (e.g., `MainView.tsx`), use `useFlowStore` to get the `flow`.
2.  The `zustand` persistence middleware will handle rehydration. Add a check to see if the store has been rehydrated and if the flow is empty.
3.  Render `EmptyState` if the store is rehydrated and the flow has no nodes; otherwise, render `FlowView`.

### 6. Refactor `Toolbar.tsx`

1.  Replace the current buttons with the `Menubar` component.
2.  Create "File", "View", and "Examples" menus.
3.  Implement all menu items (`New`, `Import`, `Export`, `Auto Layout`, and example loaders).

### 7. Verification

1.  Run the development server.
2.  **First Visit**: Verify the `EmptyState` view is shown.
3.  **Create a Flow**: Create a new file or load an example. Make some changes.
4.  **Reload**: Refresh the page. Verify that your workflow is restored and you do **not** see the `EmptyState` view.
5.  **Clear Storage**: Manually clear the `tiny-json-workflow-session` from your browser's local storage and refresh. Verify the `EmptyState` view appears again.
6.  **Test All Actions**: Test all `EmptyState` and `Menubar` actions to ensure they work correctly with the persisted state.
7.  Run `make check` and `make test` to ensure no regressions were introduced.