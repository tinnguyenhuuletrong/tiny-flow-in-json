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
|   |   `-- icons/
|   |       `-- index.ts
|   |-- hooks/
|   |   `-- useFlow.ts
|   `-- store/
|       `-- flowStore.ts
|-- components/
|   `-- ui/
|       `-- button.tsx
|-- lib/
|   `-- utils.ts
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
- **`LeftPanel.tsx`**: This will be a container for displaying the list of steps and the global state from the `flowStore`.
- **`MainView.tsx`**: This component will contain the logic to switch between the `ReactFlow` view and the `JSON editor` view.
- **`App.tsx`**: This will assemble the main layout components: `Header`, `Toolbar`, `LeftPanel`, and `MainView`.

This plan provides a clear path to setting up the web playground. I will wait for confirmation before proceeding with the implementation.
