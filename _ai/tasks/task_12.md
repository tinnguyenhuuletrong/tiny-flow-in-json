# Task 12: Enhance Project Documentation

## Goal

To create comprehensive and user-friendly documentation that helps developers understand and use the `tiny-json-workflow` project. The main focus should be on the **self-descriptive and simple `FlowJSON` structure**. The web-based UI should be presented as a helpful tool for visualization and editing, but not the core feature.

## Plan

### 1. Update `README.md`

The `README.md` will be the central entry point for the documentation. It should be restructured to prioritize the `FlowJSON` format:

*   **Introduction:** A brief overview of `tiny-json-workflow` and its core philosophy: a simple, self-descriptive JSON format for defining workflows.
*   **The `FlowJSON` Format:** A detailed explanation of the JSON structure, referencing `packages/core/schema.json`. This should be the main section of the `README.md`.
*   **Getting Started:** A step-by-step guide on how to create and use a workflow by writing the JSON manually.
*   **Features:**
    *   Declarative JSON Format: Define workflows with a simple and intuitive JSON structure.
    *   State Management: Manage global and step-local state.
    *   Conditional Logic: Implement branching with decision nodes.
    *   Extensible: Use metadata to store custom information.
*   **Visualizing Your Workflow (The Playground):** Introduce the web-based UI as a tool to visualize, edit, and debug your `FlowJSON`.
*   **Examples:** Links to the examples and a brief description of each.
*   **API Reference:** A link to the API documentation (or a placeholder for it).
*   **Contributing:** Guidelines for contributing to the project.

### 2. Document the `FlowJSON` Structure (Core Focus)

This will be the most important part of the documentation. It needs to be clear and comprehensive.

*   **`Flow` Object:** The root object of the workflow.
    *   `id`, `name`, `version`
    *   `globalStateSchema`, `globalState`
    *   `steps`
    *   `connections`
    *   `metadata`
*   **`Step` Object:** A single node in the workflow.
    *   `id`, `name`, `type` (`begin`, `end`, `task`, `decision`)
    *   `paramsSchema`, `params`
    *   `metadata`
*   **`Connection` Object:** An edge between two steps.
    *   `id`, `sourceStepId`, `targetStepId`
    *   `condition`

### 3. Create "Getting Started" Guide (JSON-first)

This guide will walk the user through creating a workflow by writing the JSON from scratch.

**Proposed Structure:**

1.  **Installation:** How to install the package.
2.  **Creating Your First Workflow (JSON):**
    *   Start with an empty JSON file.
    *   Define the `Flow` object.
    *   Add `steps` ("Hello", "World").
    *   Add `connections` to link the steps.
3.  **Parsing and Using the Workflow:** Show the TypeScript code to parse the JSON and interact with the workflow object.
4.  **Visualizing with the Playground:** Briefly mention that the user can copy-paste their JSON into the web UI to see a visual representation.

### 4. Explain Use Cases with Examples

This section will remain the same, but the focus should be on the JSON structure of the examples. The UI can be used for illustrations.

### 5. Reorganize and Enhance Examples

To better showcase the capabilities of `tiny-json-workflow`, the examples will be reorganized and enhanced.

**New Examples:**

*   **E-commerce Order Fulfillment:** A comprehensive example demonstrating a real-world business process with sequential and parallel tasks, and decision points.
*   **Dynamic Multi-Step Form:** A creative example showing how the workflow can be used to drive a user interface, with `paramsSchema` defining the form fields for each step.

**Fixing Existing Examples:**

*   The `forkJoinFlow.json` will be updated to correctly implement a fork-join pattern, making it a more accurate and useful example.

**New Directory Structure:**

The `packages/examples/src` directory will be reorganized to be more scalable and easier to navigate. Each example will be in its own directory with a `README.md` file explaining the use case.

```
packages/examples/src/
├───e-commerce-order-fulfillment/
│   ├───README.md
│   └───workflow.json
├───dynamic-multi-step-form/
│   ├───README.md
│   └───workflow.json
├───user-onboarding/
│   └───workflow.json
├───support-ticket-routing/
│   └───workflow.json
└───index.ts
```

## Progress

- [x] Reorganize and Enhance Examples
  - [x] Reorganize directory structure
  - [x] Create new examples (E-commerce, Dynamic Form)
  - [x] Create READMEs for all examples
- [ ] Update `README.md`
- [ ] Document the `FlowJSON` Structure (Core Focus)
- [ ] Create "Getting Started" Guide (JSON-first)
- [ ] Fix `forkJoinFlow.json`
