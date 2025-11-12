# Task 19: Enhance Edge Handle Control for DecisionNode

## Goal

Enhance the `DecisionNode` in the FlowView to allow dragging and dropping of edge handles along the node's border. The handle positions should be persisted in the node's metadata.

## Current Limitations

- Edge handles on the `DecisionNode` are fixed at evenly distributed positions.
- There is no mechanism to interactively change the position of a handle.

## Requirements

1.  **Draggable Handles**: Users should be able to drag and drop the source handles of a `DecisionNode`.
2.  **Constrained to Border**: The dragging should be constrained to the perimeter of the node.
3.  **Persistence**: The position of each handle should be stored in the node's metadata.
4.  **Minimum Distance**: A minimum distance between handles should be maintained. When a handle is dropped, its position should be adjusted to respect this minimum distance from other handles.
5.  **Visual Feedback**: The handle being dragged should have a distinct visual state.

## Implementation Plan

### Part 1: Store and State Management

1.  **Extend `FlowState` in `flowStore.ts`**:
    -   Add a new function to the `FlowState` type:
        ```typescript
        updateNodeHandlePosition: (nodeId: string, handleId: string, position: { x: number, y: number }) => FlowRevision;
        ```
2.  **Implement `updateNodeHandlePosition` in `useFlowStore`**:
    -   This function will find the specified step (`nodeId`).
    -   It will update the `metadata` of that step to store the new handle position. The positions could be stored in an object like `handlePositions: { [handleId]: { x, y } }`.
    -   It should handle cases where `handlePositions` doesn't exist yet.
    -   Increment the `revision` number and set the new state.

### Part 2: Update `DecisionNode.tsx`

1.  **Read Handle Positions**:
    -   In `DecisionNode.tsx`, read the handle positions from `data.metadata.handlePositions`.
    -   If positions are present, use them to style the `Handle` components.
    -   If not present, fall back to the current default behavior of distributing them evenly.

2.  **Make Handles Draggable**:
    -   We will use native HTML drag and drop to avoid adding new dependencies.
    -   Wrap each source `Handle` in a draggable `div`.
    -   Add `onDragStart`, `onDrag`, and `onDragEnd` event handlers to this wrapper.

3.  **Implement Drag Logic**:
    -   **`onDragStart`**:
        -   Set the drag data (e.g., `handleId`).
        -   Maybe add a class to the handle for visual feedback.
    -   **`onDrag`**:
        -   This event is not as straightforward for getting continuous position updates with the native DnD API. A workaround is to use `onDragOver` on the node itself.
    -   **`onDragEnd`**:
        -   Calculate the final position of the handle relative to the node.
        -   The position should be clamped to the node's border. Create a helper function `getClosestPointOnBorder(x, y, nodeWidth, nodeHeight)` for this.
        -   Implement the logic to ensure minimum distance between handles. This might involve adjusting the final position.
        -   Call the `updateNodeHandlePosition` function from the `flowStore` to persist the new position.

### Part 3: Refinement and Testing

1.  **Visuals**:
    -   Ensure the visual feedback during dragging is clear.
    -   The node should re-render correctly when the handle positions are updated in the store.
2.  **Testing**:
    -   If possible, add a component test for `DecisionNode` to verify that handles are rendered at the correct positions based on `data`.
    -   Manually test the drag-and-drop functionality thoroughly.

## File to be modified:

-   `packages/web/src/app/store/flowStore.ts`
-   `packages/web/src/app/components/custom-nodes/DecisionNode.tsx`
