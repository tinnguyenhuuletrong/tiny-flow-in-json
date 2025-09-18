# Task 3: Polish Flow View

This task focuses on polishing the flow view to match the design specifications.

## 1. Refactor Layouting with elkjs

- **File to modify**: `packages/web/src/lib/layout.ts`
- **Goal**: Replace `dagre` with `elkjs` to achieve a better horizontal layout.
- **Actions**:
  - Add `elkjs` as a new dependency.
  - Move logic into store function `doAutoLayout` which override node metadata position
  - Function call after load data from json
  - Create a button to trigger `doAutoLayout`

## 2. Update Node Styles

- **Files to modify**:
  - `packages/web/src/app/components/custom-nodes/BeginNode.tsx`
  - `packages/web/src/app/components/custom-nodes/EndNode.tsx`
  - `packages/web/src/app/components/custom-nodes/TaskNode.tsx`
  - `packages/web/src/app/components/custom-nodes/DecisionNode.tsx`
- **Goal**: Update the node styles to match the design specifications.
- **Actions**:
  - **`BeginNode`**:
    - Change the shape to a small white circle.
    - Remove the label.
  - **`EndNode`**:
    - Change the shape to a small black circle.
    - Remove the label.
  - **`TaskNode`**:
    - Ensure it's a horizontal rectangle.
    - The current implementation is already a rectangle, so we just need to adjust the styling.
  - **`DecisionNode`**:
    - Change the shape to a vertical rectangle.
    - Ensure the pins are distributed evenly on the right side.
    - The condition label should be displayed clearly and be readable.

## 3. Implement Drag and Drop and Position Saving

- **Files to modify**:
  - `packages/web/src/app/components/layout/FlowView.tsx`
  - `packages/web/src/app/store/flowStore.ts`
- **Goal**: Allow users to drag and drop nodes and save their positions.
- **Actions**:
  - In `FlowView.tsx`, listen for the `onNodeDragStop` event from React Flow.
  - When a node is dragged, update its position in the `flowStore`.
  - The position should be saved in the `metadata` of the step, as requested.

## 4. Improve Edge Labeling

- **File to modify**: `packages/web/src/app/components/layout/FlowView.tsx`
- **Goal**: Make the condition labels on the edges more readable.
- **Actions**:
  - Adjust the `labelStyle` and `labelBgStyle` for the edges to improve readability.
  - Consider using a different `type` of edge if `smoothstep` is not suitable for the new layout.

After completing these steps, the flow view should be much more polished and closer to the desired design.
