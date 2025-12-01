# Task 19: Enhance DecisionNode with UI-based Handle Configuration

## Goal

To enhance the `DecisionNode` in `packages/web` to allow users to dynamically configure its connection handles (edges) through the UI. This includes specifying the side (Top, Bottom, Left, Right) and order of each handle.

## Requirements

-   **Dynamic Handle Configuration:** Users must be able to add, remove, and modify the properties of handles on a `DecisionNode`.
-   **Side and Order:** For each handle, users must be able to define its side (`position`) and its order on that side.
-   **UI for Editing:** An intuitive UI should be presented to the user, preferably when the `DecisionNode` is selected.
-   **Real-time Preview:** Changes made in the editor should be reflected immediately in a preview.
-   **Persistence:** The handle configuration must be stored in the `metadata` (the `data` property) of the `DecisionNode`.
-   **Save/Cancel:** The user must be able to explicitly save or cancel their changes.

## Metadata Structure

To align with the project's conventions while providing a clear structure, the handle configuration will be stored directly in the step's `metadata` object.

A `decision` step in the `workflow.json` will be structured as follows:

```json
{
  "id": "my-decision-step",
  "name": "My Decision",
  "type": "decision",
  "metadata": {
    "x": 812,
    "y": 37,
    "handles": [
      { "id": "in1", "type": "target", "position": "Top" },
      { "id": "out-yes", "type": "source", "position": "Bottom" },
      { "id": "out-no", "type": "source", "position": "Right" }
    ]
  }
}
```

-   The `DecisionNode.tsx` component in the web application will read and write to `props.data.handles`.
-   This structure is consistent with the existing use of the `metadata` field for storing both UI coordinates (`x`, `y`) and other custom properties.

## Proposed UX (Revised)

The editor will be a **Properties Panel** that appears on the right side of the screen when a `DecisionNode` is selected. This panel will allow users to re-assign and re-order existing handles.

```
+--------------------------------+
|       PROPERTIES PANEL         |
|--------------------------------|
| Node: [Selected Node Name]     |
|--------------------------------|
| Handles Configuration          |
| (Drag to reorder or move)      |
|                                |
| === TOP ====================== |
| | [DRAG] Handle-ID-1 (Source)  | |
| | [DRAG] Handle-ID-2 (Target)  | |
| +----------------------------+ |
|                                |
| === BOTTOM =================== |
| | [DRAG] Handle-ID-3 (Source)  | |
| +----------------------------+ |
|                                |
| (Left and Right zones follow)  |
|                                |
| [Save] [Cancel]                |
+--------------------------------+
```

-   The panel is divided into four sections for "Top", "Bottom", "Left", and "Right", each acting as a drop zone.
-   Users can drag handles to reorder them within a zone or move them to a different zone.
-   The ability to add or delete handles is removed from the scope of this task.

## Dependencies

The following packages will be added to `packages/web`:
-   `@dnd-kit/core`
-   `@dnd-kit/sortable`

## Implementation Plan (Revised)

1.  **Install Dependencies:** Add `@dnd-kit/core` and `@dnd-kit/sortable` to the `dependencies` in `packages/web/package.json`.

2.  **Create a `PropertiesPanel` Component:**
    -   Develop a new, general-purpose `PropertiesPanel` component that appears as a sidebar.
    -   Its visibility will be controlled by the application's global state (e.g., Zustand store), depending on whether a node is selected.

3.  **Create the `HandleEditor` Component:**
    -   Build the `HandleEditor` to be displayed inside the `PropertiesPanel`.
    -   It will receive the `handles` array from the selected node.
    -   It will use `dnd-kit` to implement the four drag-and-drop zones.

4.  **Implement Drag-and-Drop Logic:**
    -   Configure `DndContext`, `SortableContext`, and the necessary sensors.
    -   Implement the `onDragEnd` handler to update the local state of the `handles` array when a user finishes dragging an item. This includes changing the `position` (side) and order.

5.  **Integrate with Application State:**
    -   Connect the `PropertiesPanel` to the main application state management (Zustand).
    -   The `[Save]` button in the `HandleEditor` will trigger an action to update the global state, persisting the changes to the correct node in the React Flow instance.
    -   The `[Cancel]` button will reset the editor's state and/or close the panel.

6.  **Testing:**
    -   Add tests for the `HandleEditor` to verify the drag-and-drop logic.
    -   Update tests for the main application to ensure the `PropertiesPanel` appears and disappears correctly and that node data is updated on save.
