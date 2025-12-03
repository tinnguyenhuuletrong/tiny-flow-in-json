# Task 20: Improve Node Connection UI

The current UI for managing node connections needs to be improved for better usability and clarity. This task involves updating the layout, styling, and interaction of the connection handles in the node editor's side panel.

## Requirements:

### 1. Handle Layout

The connection handles (Top, Right, Bottom, Left) in the side panel should be arranged in a grid that corresponds to their position on the node. The center of the grid should be empty, representing the node itself.

**ASCII Representation:**

```
+------------------+------------------+------------------+
|                  |       Top        |                  |
|      (empty)     |    [source]      |      (empty)     |
|                  |                  |                  |
+------------------+------------------+------------------+
|       Left       |                  |      Right       |
|     [target]     |      (empty)     |     [source]     |
|                  |                  |                  |
+------------------+------------------+------------------+
|                  |      Bottom      |                  |
|      (empty)     |     [source]     |      (empty)     |
|                  |                  |                  |
+------------------+------------------+------------------+
```

### 2. Edge and Handle Visualization

- Clearly distinguish between `source` and `target` handles.
- Use arrows (`->` for source, `<-` for target) or icons to indicate the direction.
- Include the connected node's ID next to the handle (e.g., `c2 (target)`).
- Use distinct colors to differentiate between source and target handles/connections to improve visual scanning. For example, `source` could be blue and `target` could be green.

### 3. Interaction Feedback

- When a user clicks and drags a connection handle from the side panel, the corresponding handle point on the node in the main canvas should be visually highlighted (e.g., with a glowing effect, increased size, or a color change). This provides immediate feedback about which connection is being manipulated.

### Implementation Details:

This section provides guidance on which files to modify to implement the UI improvements.

#### 1. `packages/web/src/app/components/properties-panel/HandleEditor.tsx`

This is the most critical file. It controls the UI and logic for arranging the connection handles.

*   **Current State:** It uses `@dnd-kit` and lays out handles in four separate vertical lists for `Top`, `Bottom`, `Left`, and `Right`.
*   **Required Changes:**
    *   **Layout:** Refactor the JSX and use Tailwind CSS to create the 3x3 grid layout specified in the ASCII diagram. The center cell should be empty.
    *   **Styling:** Add visual indicators (`->` for source, `<-` for target) and apply different background colors (e.g., blue for source, green for target) to distinguish handle types.
    *   **Interaction:** On drag start (`onDragStart`), call a new action in `useFlowStore` to set the ID of the handle being dragged. Clear this ID on drag end (`onDragEnd`).

#### 2. `packages/web/src/app/store/flowStore.ts`

This Zustand store manages the workflow state and needs a small addition for the highlighting feature.

*   **Required Changes:**
    *   Add a new state property: `draggingHandleId: string | null`.
    *   Add a new action: `setDraggingHandleId(id: string | null)` to modify the new state.

#### 3. `packages/web/src/app/components/custom-nodes/DecisionNode.tsx` (and other custom nodes)

This file is a template for how nodes appear on the canvas. The changes here will enable the handle-highlighting feature.

*   **Current State:** It renders React Flow `Handle` components.
*   **Required Changes:**
    *   Read `draggingHandleId` from the `useFlowStore`.
    *   When rendering each `Handle`, check if its `id` matches `draggingHandleId`.
    *   If there is a match, apply a conditional CSS class or style to highlight the handle (e.g., a colored ring `ring-4 ring-orange-500`).

#### 4. `packages/web/src/app/components/layout/PropertiesPanel.tsx` & `FlowView.tsx`

*   `PropertiesPanel.tsx`: This is the parent of `HandleEditor`. No changes are expected here, but it's the component that decides when to render the editor.
*   `FlowView.tsx`: This component renders the graph. No direct changes are needed here either. It will automatically re-render nodes when the store is updated, which will apply the highlighting effect from the changes in the custom node components.
