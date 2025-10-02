# Task 08: UI/UX Enhancements (Revised)

**Goal:** To refine the UI/UX of the web-based playground, making it more intuitive for developers, and to establish a clear brand identity. This revision focuses on creating a robust, portable SVG export feature.

---

## 1. Branding Proposal

The name "tiny-json-workflow" is descriptive, but the visual editor needs a more memorable brand name.

**Proposed Name:** **FlowCraft**

**Reasoning:**

- **Flow:** Directly relates to the core concept of the project.
- **Craft:** Implies skill and creation, resonating with the developer audience.
- It's short, memorable, and has a professional feel.

---

## 2. UI/UX Enhancement Plan (Revised v5)

This version refines the SVG export feature to be more robust and user-friendly. The export will be triggered from a modal and the SVG itself will be generated programmatically to ensure portability.

### 2.1. SVG Export via Modal

To provide a portable export option, an "Export SVG" button will be available within the main `FlowView`. Clicking this button will open a modal containing the generated SVG. This approach is less disruptive than a dedicated tab and provides a better user experience.

The modal will display the raw SVG markup in a text area, along with a "Copy to Clipboard" button, as confirmed in the design discussion.

---

## 3. High-Level Development Plan (Revised v6)

This plan incorporates the feedback to build the SVG generator as a separate, tested package within the monorepo for better modularity and robustness.

1.  **Create `@tiny-json-workflow/svg-export` Package (Priority 1):**

    - Scaffold a new, independent package in the `packages/` directory.
    - Create its `package.json`, `tsconfig.json`, and the necessary directory structure (`src/`, `tests/`).
    - Ensure the new package is correctly integrated into the Bun monorepo workspace.

2.  **Implement SVG Generator with Tests:**

    - Inside the new `@tiny-json-workflow/svg-export` package, develop the function to programmatically generate a self-contained SVG from the flow data object `@tiny-json-workflow/core` - `ParsedFlow`.
    - Adopt a Test-Driven Development (TDD) approach, creating tests for node rendering, connection rendering, and overall SVG structure using `bun:test`.
    - The generator will inline all styles (colors, fonts, etc.) to ensure the exported SVG is fully portable, referencing the styles from the existing custom nodes for visual consistency.

3.  **Integrate SVG Package into Web App:**

    - Add the new `@tiny-json-workflow/svg-export` package as a dependency to the `@tiny-json-workflow/web` package.
    - Update `FlowView.tsx` to import the generation function from the new package and use it to power the "Export SVG" modal.

4.  **Update Branding (Priority 2):**

    - Update `Header.tsx` to replace "tiny-json-workflow" with "FlowCraft".

5.  **Future Work (Postponed):**
    - **Full Layout Refactor:** A more significant layout overhaul (e.g., a three-column, resizable IDE-like view) will be considered in a future iteration.
    - **Advanced UI Panels:** The implementation of a dedicated `AssetPanel` (for drag-and-drop nodes) and a `BottomPanel` (for an integrated inspector) is also postponed.
