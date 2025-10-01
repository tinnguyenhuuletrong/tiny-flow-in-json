# Task 7: Left Panel UI/UX Revamp and Step Selection Sync

This task focuses on improving the usability of the web playground by redesigning the `LeftPanel`, implementing synchronized selection, and using a modal for editing step parameters.

## 1. Revised ASCII Draft Design

The `LeftPanel` will be simplified for navigation, and an "Edit" icon will trigger a modal for focused editing.

**Left Panel:**

```
+--------------------------------------+
| [<-] Left Panel                      |  <-- Collapse Button
+--------------------------------------+
| v Global State                       |  <-- Collapsible Section
| +----------------------------------+ |
| | [Auto-generated form for         | |
| |  globalStateSchema]              | |
| +----------------------------------+ |
+--------------------------------------+
| v Steps List                         |  <-- Collapsible Section
| +----------------------------------+ |
| | Step 1 Name               [Edit] | |  <-- Edit icon opens modal
| |----------------------------------| |
| | Step 2 Name (Selected)    [Edit] | |  <-- Highlighted on click
| |----------------------------------| |
| | Step 3 Name               [Edit] | |
| +----------------------------------+ |
+--------------------------------------+
```

**Step Parameters Modal:**

```
+----------------------------------+
| Modal for "Step 2 Name"          |
+----------------------------------+
| v Parameters                     |
| +------------------------------+ |
| | [Auto-generated form for     | |
| |  paramsSchema of Step 2]     | |
| +------------------------------+ |
|                                  |
|                      [Save] [Close] |
+----------------------------------+
```

## 2. Revised Implementation Plan

### Sub-task 2.1: Enhance `flowStore`

- **Goal:** Add state management for selection and modal control.
- **File:** `packages/web/src/app/store/flowStore.ts`
- **Changes:**
  - Add `selectedStepId: string | null` to `FlowState` for highlighting.
  - Add a `setSelectedStepId(stepId: string | null): FlowRevision` action.
  - Add `editingStepId: string | null` to `FlowState` to manage the modal.
  - Add a `setEditingStepId(stepId: string | null): FlowRevision` action.
  - Add a `updateStepParams(stepId: string, params: Record<string, any>): FlowRevision` action.

### Sub-task 2.2: Redesign `LeftPanel`

- **Goal:** Implement the new collapsible panel design.
- **File:** `packages/web/src/app/components/layout/LeftPanel.tsx`
- **Changes:**
  - Implement the main collapsible functionality for the panel.
  - Use `Accordion` from `shadcn/ui` for the "Global State" and "Steps List" sections.
  - For each item in the "Steps List":
    - The item itself will have an `onClick` handler to call `setSelectedStepId(step.id)`.
    - Apply a visual highlight if `step.id === selectedStepId`.
    - Add an "Edit" icon-button with an `onClick` handler that calls `setEditingStepId(step.id)`.

### Sub-task 2.3: Create `StepEditModal.tsx` Component

- **Goal:** Create a modal for editing step parameters.
- **File:** `packages/web/src/app/components/shared/StepEditModal.tsx` (new file)
- **Changes:**
  - The component will read `editingStepId` from the `flowStore`.
  - When `editingStepId` is not null, it will render a `Dialog` component from `shadcn/ui`.
  - The `Dialog` will display the step's name as the title.
  - It will contain a `JsonAutoForm` bound to the `paramsSchema` of the step being edited.
  - A "Save" button will call the `updateStepParams` action in the store.
  - A "Close" or "Cancel" button will call `setEditingStepId(null)`.

### Sub-task 2.4: Implement Selection Sync in `FlowView`

- **Goal:** Synchronize node selection between the graph and the `LeftPanel`.
- **File:** `packages/web/src/app/components/layout/FlowView.tsx`
- **Changes:**
  - **Highlighting:** Read `selectedStepId` from the store and apply the `selected` property to the corresponding React Flow node.
  - **Selection:** Use the `onNodesChange` handler to detect when a user clicks a node in the graph and call `setSelectedStepId` with the node's ID.
