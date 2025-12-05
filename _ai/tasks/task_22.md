
# Task 22: Refactor Connection Editing UX to an Overlay

## Goal

Enhance the user experience of the `packages/web` application by replacing the static "Connections" panel with a more interactive overlay-based UI. This will make the process of editing node connections more intuitive and visually integrated.

## Requirements

1.  **Trigger:** When a user clicks on a node in the workflow canvas, a contextual "wheel" menu should appear.
2.  **Wheel Menu:** This menu will contain several options, including an icon to "Edit Connections."
3.  **Overlay:** Clicking the "Edit Connections" icon will open an overlay panel. This panel will house the interface for managing the node's connections (e.g., dragging, dropping, re-ordering).
4.  **Interaction:** The overlay should allow the user to see the effects of their changes on the main canvas in real-time.
5.  **Dismissal:** The wheel menu and the overlay should be easily dismissible (e.g., via a "close" button or clicking outside the area).

## ASCII-Driven Design

Below is a conceptual ASCII mockup of the proposed user flow.

### 1. Initial State: User Clicks a Node

The user clicks on "Step 2".

```
+-----------------------------------------------------+
|                                                     |
|      +--------+      +--------+      +--------+     |
|      | Step 1 |----->| Step 2 |----->| Step 3 |     |
|      +--------+      +--------+      +--------+     |
|                        / \                          |
|                         |                           |
|                  (User clicks here)                 |
|                                                     |
+-----------------------------------------------------+
```

### 2. Wheel Panel Appears

A wheel menu appears around the selected node.

```
+-----------------------------------------------------+
|                                                     |
|      +--------+      +--------+      +--------+     |
|      | Step 1 |----->| Step 2 |----->| Step 3 |     |
|      +--------+      +---/ \--+      +--------+     |
|                        /  |  \                      |
|           (Edit Connections) O -- O (Delete)        |
|                         \  |  /                      |
|                          \O/ (Close)                |
|                           |                         |
+-----------------------------------------------------+
```

### 3. Connection Edit Overlay is Triggered

User clicks the "Edit Connections" icon (`O`).

```
+-----------------------------------------------------+
|                                                     |
|      +--------+      +--------+      +--------+     |
|      | Step 1 |----->| Step 2 |----->| Step 3 |     |
|      +--------+      +--------+      +--------+     |
|                                                     |
|  +-----------------------------------------------+  |
|  |             Connection Editor [X]             |  |
|  |-----------------------------------------------|  |
|  |                                               |  |
|  |  Source: Step 2                               |  |
|  |                                               |  |
|  |  Targets:                                     |  |
|  |    - Drag/Drop target here                    |  |
|  |    - [ Step 3 ]                               |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
```

## Implementation Plan

### Step 1: Create the Wheel Menu Component
-   **File:** `packages/web/src/components/WheelMenu.tsx`
-   **Logic:**
    -   Component should accept `isOpen`, `onClose`, and menu items as props.
    -   Position itself based on the coordinates of the clicked node.
    -   Render icons for actions like "Edit Connections," "Delete," and "Close."
    -   Callbacks for each action should be passed in.

### Step 2: Create the Connection Editor Overlay
-   **File:** `packages/web/src/components/ConnectionOverlay.tsx`
-   **Logic:**
    -   Component will be a modal or an overlay that appears when triggered.
    -   It will receive the `nodeId` of the selected node.
    -   Fetch and display the current connections for that node.
    -   Implement the UI for adding, removing, or changing connection targets (drag-and-drop or a selection list).
    -   Include a close button (`[X]`) to dismiss the overlay.

### Step 3: Integrate into the Main Canvas
-   **File:** `packages/web/src/app/pages/HomePage.tsx` (or the relevant canvas component)
-   **Logic:**
    -   Manage the state for which node is selected and whether the wheel menu/overlay is open.
    -   On node click, update the state to show the `WheelMenu` at the node's position.
    -   Pass a callback to the `WheelMenu` to handle the "Edit Connections" click, which will in turn open the `ConnectionOverlay`.
    -   Ensure that the main canvas is still visible (perhaps dimmed) behind the overlay.

### Step 4: Add Tests
-   **Location:** `packages/web/tests/`
-   **Requirements:**
    -   Write a test to verify that clicking a node opens the `WheelMenu`.
    -   Write a test to verify that clicking the "Edit Connections" icon in the `WheelMenu` opens the `ConnectionOverlay`.
    -   Write a test to verify that the `ConnectionOverlay` displays the correct connection information for the selected node.
    -   Write a test to ensure the overlay can be closed.

This detailed plan provides a clear path for a developer to implement the required UX enhancement.
