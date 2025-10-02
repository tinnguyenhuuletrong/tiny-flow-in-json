# Task 08: UI/UX Enhancements (Revised)

**Goal:** To refine the UI/UX of the web-based playground, making it more intuitive for developers, and to establish a clear brand identity. This revision focuses on incremental enhancements to the existing UI.

---

## 1. Branding Proposal

The name "tiny-json-workflow" is descriptive, but the visual editor needs a more memorable brand name.

**Proposed Name:** **FlowCraft**

**Reasoning:**

- **Flow:** Directly relates to the core concept of the project.
- **Craft:** Implies skill and creation, resonating with the developer audience.
- It's short, memorable, and has a professional feel.

---

## 2. UI/UX Enhancement Plan (Revised v4)

This version focuses on enhancing the existing tabbed interface by adding a portable SVG export feature. The major layout overhaul is postponed.

### 2.1. Enhanced Tabbed View

The primary interface will remain the tabbed view. A new "SVG" tab will be added to provide developers with an easy way to export and embed their workflows.

**ASCII Mock-up (Enhanced Tabs):**

```
+---------------------------------------------------------------------------------+
| [FlowCraft Logo] FlowCraft | My Workflow (flow.name)                          |
+---------------------------------------------------------------------------------+
| [ Toolbar Buttons... ]                                                          |
+---------------------------------------------------------------------------------+
|                |                                                                |
| [ Left Panel ] | [ [1] Flow | [2] JSON | [3] SVG ] <-- Tabs                     |
|                |                                                                |
|                | The selected tab's content is displayed here.                  |
|                |                                                                |
|                | The new SVG tab will show a static SVG of the flow             |
|                | with a 'Copy' button.                                          |
|                |                                                                |
|                |                                                                |
|----------------+----------------------------------------------------------------|
```

---

## 3. High-Level Development Plan (Revised v4)

This plan is focused on immediate, incremental improvements.

1.  **Add SVG Export Tab (Priority 1):**
    -   Modify `MainView.tsx` to add a third "SVG" tab to the existing `Tabs` component.
    -   Create a new component to house the SVG rendering logic.
    -   Investigate and implement a method to convert the React Flow graph to an SVG (e.g., using a library or built-in utilities).
    -   Add a "Copy to Clipboard" button within the new tab.

2.  **Update Branding (Priority 2):**
    -   Update `Header.tsx` to replace "tiny-json-workflow" with "FlowCraft".

3.  **Future Work (Postponed):**
    -   **Full Layout Refactor:** A more significant layout overhaul (e.g., a three-column, resizable IDE-like view) will be considered in a future iteration.
    -   **Advanced UI Panels:** The implementation of a dedicated `AssetPanel` (for drag-and-drop nodes) and a `BottomPanel` (for an integrated inspector) is also postponed.
