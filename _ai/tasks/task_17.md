
# Task 17: Enhance packages/web with a new layout system

## Goal

Enhance `packages/web` to provide a more flexible layout system, allowing users to choose between different view modes for the JSON and Flow views.

## Requirements

1.  **Add a layout system with a view menu.**
    - The view menu should allow users to select from the following modes:
        - **Compact Mode:** The current view, where JSON and Flow views are toggled using tabs.
        - **Dual Mode (Horizontal):** JSON and Flow views are displayed side-by-side horizontally.
        - **Dual Mode (Vertical):** JSON and Flow views are displayed side-by-side vertically.
2.  **Persist the selected view mode.**
    - The selected view mode should be saved to `localStorage` to be restored on subsequent visits. A new key should be used to keep it separate from the flow store.

## Plan

### 1. Create a Layout Store

- Create a new Zustand store named `layoutStore` in `packages/web/src/app/store/layoutStore.ts`.
- The store will manage the current layout mode (`'compact'`, `'dual-horizontal'`, or `'dual-vertical'`) and the collapsed state of the `LeftPanel`.
- The store will use a `localStorage` middleware to persist the layout mode and the collapsed state under a new key (e.g., `'layout-settings'`).

### 2. Create a View Menu Component

- Create a new component `ViewMenu.tsx` in `packages/web/src/app/components/layout/`.
- This component will be a dropdown menu, likely integrated into the `Header.tsx` or `Toolbar.tsx`.
- The menu will display the available layout modes and allow the user to switch between them.
- The `ViewMenu` will use the `layoutStore` to get and set the current layout mode.

### 3. Update the Main Layout (`App.tsx`)

- Modify `App.tsx` to read the layout mode from the `layoutStore`.
- Based on the layout mode, conditionally render the main view components.
- For the dual modes, use a resizable panel library like `react-resizable-panels` to create adjustable horizontal and vertical splits.

### 4. Refactor `MainView.tsx` and related components

- **Compact Mode:** In this mode, the existing `MainView.tsx` with tabs will be used.
- **Dual Modes:**
    - The `Tabs` component in `MainView.tsx` will be conditionally rendered only in compact mode.
    - In dual modes, `FlowView.tsx` and `JsonEditorView.tsx` will be rendered directly within the resizable panels.
    - The `LeftPanel` will remain, but its integration might need adjustment based on the new layout structure.

### 5. Testing

- Create a new test file `packages/web/tests/app/layout.test.tsx`.
- Add tests for the `ViewMenu` component to ensure it correctly switches the layout mode.
- Add tests for the `App` component to ensure the correct layout is rendered based on the layout mode.
- Add tests to verify that the layout mode is persisted to `localStorage`.

### 6. Implementation Steps

1.  **Install `react-resizable-panels`:**
    ```bash
    bun add react-resizable-panels
    ```
2.  **Create `layoutStore.ts`:**
    - Define the store with the layout mode state and actions.
3.  **Create `ViewMenu.tsx`:**
    - Implement the dropdown menu with layout mode options.
4.  **Integrate `ViewMenu` into `Header.tsx` or `Toolbar.tsx`.**
5.  **Modify `App.tsx` to handle the different layout modes:**
    - Import `Panel`, `PanelGroup`, and `PanelResizeHandle` from `react-resizable-panels`.
    - Use a `switch` statement or conditional rendering to render the appropriate layout based on the `layoutMode` from the store.
6.  **Adjust `MainView.tsx`, `FlowView.tsx`, and `JsonEditorView.tsx` to work within the new layout system.**
    - This might involve removing some of the container divs and letting the `Panel` components from `react-resizable-panels` manage the layout.
