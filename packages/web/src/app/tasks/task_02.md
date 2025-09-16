# Task 2: Web Playground Setup and Initial Layout

## Goal

Set up the initial structure for the web playground in `packages/web`, including installing necessary libraries, creating the folder structure, and implementing a basic UI layout with placeholder data.

## UI Layout

This is the target UI layout:

```
+--------------------------------------------------------------------------------------------------+
| Header (tiny-json-workflow)                                                                      |
+--------------------------------------------------------------------------------------------------+
| Toolbar (Import, Export, Save)                                                                   |
+--------------------------------------------------------------------------------------------------+
|                               |                                                                  |
|                               |                                                                  |
|                               |                                                                  |
|  +-------------------------+  |  +------------------------------------------------------------+  |
|  | Left Panel              |  |  | Main View (Switchable)                                     |  |
|  |-------------------------|  |  |                                                            |  |
|  |                         |  |  |  +------------------------------------------------------+  |  |
|  | +---------------------+ |  |  |  | [ReactFlow View]                                     |  |  |
|  | | Steps               | |  |  |  |                                                      |  |  |
|  | +---------------------+ |  |  |  |                                                      |  |  |
|  | | - step 1            | |  |  |  +------------------------------------------------------+  |  |
|  | | - step 2            | |  |  |                                                            |  |
|  | | - ...               | |  |  |  +------------------------------------------------------+  |  |
|  | +---------------------+ |  |  |  | [JSON Editor View]                                   |  |  |
|  |                         |  |  |  |                                                      |  |  |
|  | +---------------------+ |  |  |  |                                                      |  |  |
|  | | Global State        | |  |  |  +------------------------------------------------------+  |  |
|  | +---------------------+ |  |  |                                                            |  |
|  | | - userId: "..."     | |  |  +------------------------------------------------------------+  |
|  | | - profileIs...: ... | |  |                                                                  |
|  | +---------------------+ |  |                                                                  |
|  |                         |  |                                                                  |
|  +-------------------------+  |                                                                  |
|                               |                                                                  |
|                               |                                                                  |
+--------------------------------------------------------------------------------------------------+
```

## Implementation Plan

### 1. Install Dependencies

The following libraries need to be installed in the `packages/web` workspace:

- `reactflow`: For the flow chart visualization.
- `zustand`: For state management as a simpler alternative to `useReducer` with context, which will be easier to manage for global state.
- `monaco-editor` and `@monaco-editor/react`: For the JSON editor.
- `lucide-react`: For icons.
- `dagre` and `@types/dagre`: For graph layout.

### 2. Folder Structure

Create the following folder structure inside `packages/web/src`:

```
src/
|-- app/
|   |-- components/
|   |   |-- layout/
|   |   |   |-- Header.tsx
|   |   |   |-- Toolbar.tsx
|   |   |   |-- LeftPanel.tsx
|   |   |   `-- MainView.tsx
|   |   |-- custom-nodes/
|   |   |   |-- BeginNode.tsx
|   |   |   |-- EndNode.tsx
|   |   |   |-- DecisionNode.tsx
|   |   |   `-- TaskNode.tsx
|   |   `-- icons/
|   |       `-- index.ts
|   |-- hooks/
|   |   `-- useFlow.ts
|   `-- store/
|       `-- flowStore.ts
|-- components/
|   `-- ui/
|       |-- button.tsx
|       `-- tabs.tsx (shadcn/ui)
|-- lib/
|   |-- utils.ts
|   `-- layout.ts
|-- data/
|   `-- placeholder.ts
|-- App.tsx
|-- main.tsx
`-- index.css
```

### 3. State Management (`zustand`)

- Create a store at `src/app/store/flowStore.ts`.
- This store will hold the nodes, edges, and global state for the flow.
- It will have actions to update the flow data.

### 4. Placeholder Data

- Create a file at `src/data/placeholder.ts`.
- This file will contain a sample `FlowJSON` object based on the example from `requirement.md`. This data will be used to populate the initial state of the playground.

### 5. Component Implementation

- **`Header.tsx`**: A simple component displaying the application title.
- **`Toolbar.tsx`**: Buttons for "Import," "Export," and "Save." Initially, these will be placeholders without functionality.
- **`LeftPanel.tsx`**: This will be a container for displaying the list of steps and the global state from the `flowStore`. Implemented scrolling for overflow content.
- **`MainView.tsx`**: This component will contain the logic to switch between the `ReactFlow` view and the `JSON editor` view. Uses `shadcn/ui` tabs and flexbox for layout.
- **`App.tsx`**: This will assemble the main layout components: `Header`, `Toolbar`, `LeftPanel`, and `MainView`.
- **`FlowView.tsx`**: Displays the workflow using ReactFlow.
    - Uses `dagre` for automatic layout of nodes.
    - Custom nodes (`BeginNode`, `EndNode`, `DecisionNode`, `TaskNode`) are used for different step types.
    - `DecisionNode` dynamically renders source handles based on outgoing connections.
    - Edges are `smoothstep` type with labels and background styling for readability.
- **`JsonEditorView.tsx`**: Displays and allows editing of the raw FlowJSON using Monaco Editor.

## Iteration 2: UI Polish and Layout

This iteration focused on improving the visual presentation and layout of the web playground.

-   **Dependencies:** Added `dagre` and `@types/dagre` for graph layout.
-   **Left Panel Scrolling:** Ensured the left panel (`LeftPanel.tsx`) correctly handles overflow with `h-full` and `overflow-y-auto`.
-   **Tabs Component:** Replaced the custom tabs implementation with the official `shadcn/ui` tabs component in `MainView.tsx`.
-   **Main View Layout:** Refactored `MainView.tsx` to use flexbox for better sizing and responsiveness of the tab content areas.
-   **Custom Nodes Refinement:**
    -   Created dedicated components for `BeginNode`, `EndNode`, `DecisionNode`, and `TaskNode` in `src/app/components/custom-nodes/`.
    -   Adjusted the sizes and styling of these nodes (`BeginNode.tsx`, `EndNode.tsx`, `TaskNode.tsx`, `DecisionNode.tsx`) to improve visual balance and ensure labels fit.
    -   Enhanced `DecisionNode.tsx` to dynamically render source handles based on the number of outgoing connections, improving accuracy for branching logic.
-   **Flow Layout Integration:** Integrated the `dagre` library via `lib/layout.ts` into `FlowView.tsx` to automatically calculate and apply optimal positions for nodes, preventing overlaps.
-   **Edge Styling and Readability:**
    -   Configured `ReactFlow` to use `smoothstep` edge types for cleaner routing.
    -   Added labels to edges in `FlowView.tsx` to display connection conditions.
    -   Applied styling to edge labels, including a white background, padding, and border-radius, to significantly improve their visibility and readability, addressing issues where text was hidden by shapes.
-   **Spacing Adjustment:** Increased `nodesep` and `ranksep` values in `lib/layout.ts` to provide more generous spacing between nodes, further reducing visual clutter and ensuring edge labels are clearly visible.
