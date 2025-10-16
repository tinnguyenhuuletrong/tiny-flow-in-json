# tiny-json-workflow

[![CI/CD](https://github.com/tinnguyenhuuletrong/tiny-flow-in-json/actions/workflows/ci.yml/badge.svg)](https://github.com/tinnguyenhuuletrong/tiny-flow-in-json/actions/workflows/ci.yml)

A tiny, self-descriptive, JSON-based workflow engine.

## Introduction

`tiny-json-workflow` is a lightweight and powerful engine for defining and executing workflows. At its core is **FlowJSON**, a simple, self-descriptive JSON format that allows you to define complex logic in a human-readable way.

The main philosophy behind this project is that workflows should be easy to create, understand, and modify, for both developers and business users.

## The `FlowJSON` Format

`FlowJSON` is the heart of `tiny-json-workflow`. It's a simple yet flexible JSON structure that allows you to define workflows with steps, connections, and state management.

A `FlowJSON` object has three main components:

*   **`Flow` Object:** The root object of the workflow.
    *   `id`, `name`, `version`: Basic information about the workflow.
    *   `globalStateSchema`, `globalState`: Defines the structure and initial values of the global state.
    *   `steps`: An array of all the steps in the workflow.
    *   `connections`: An array of all the connections between the steps.
    *   `metadata`: An object for storing any additional information.
*   **`Step` Object:** A single node in the workflow.
    *   `id`, `name`: A unique identifier and a human-readable name for the step.
    *   `type`: The type of the step. It can be `begin`, `end`, `task`, or `decision`.
    *   `paramsSchema`, `params`: Defines the structure and values of the step's parameters.
    *   `metadata`: An object for storing any additional information about the step.
*   **`Connection` Object:** An edge between two steps.
    *   `id`, `sourceStepId`, `targetStepId`: Defines the connection between two steps.
    *   `condition`: A JavaScript expression that must evaluate to `true` for this connection to be taken. This allows for branching logic.

For a detailed specification of the `FlowJSON` format, please refer to the [JSON Schema](packages/core/schema.json).

## Schema-Driven Development

`FlowJSON` is designed to be self-descriptive, and this is reinforced by the provided JSON schema. By adding the `$schema` property to your JSON file, you can unlock several benefits:

```json
{
  "$schema": "https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/schema/latest/flow.json",
  ...
}
```

*   **IDE Validation and Auto-completion:** IDEs like Visual Studio Code can use the schema to validate your `FlowJSON` in real-time and provide auto-completion for properties and values. This helps you to avoid typos and structural errors.
*   **AI-Powered Development:** The schema provides a clear and structured definition of the `FlowJSON` format, which allows AI models like Gemini to understand the data structure and assist you in generating and modifying workflows.

## Getting Started

It's easy to get started with `tiny-json-workflow`.

### 1. Installation

```bash
bun install @tiny-json-workflow/core
```

### 2. Create Your First Workflow

Create a new file called `my-workflow.json` and add the following content:

```json
{
  "$schema": "https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/schema/latest/flow.json",
  "id": "hello-world-v1",
  "name": "Hello World Workflow",
  "version": "1.0.0",
  "steps": [
    {
      "id": "start",
      "type": "begin",
      "name": "Start"
    },
    {
      "id": "hello",
      "type": "task",
      "name": "Say Hello"
    },
    {
      "id": "end",
      "type": "end",
      "name": "End"
    }
  ],
  "connections": [
    {
      "id": "c1",
      "sourceStepId": "start",
      "targetStepId": "hello"
    },
    {
      "id": "c2",
      "sourceStepId": "hello",
      "targetStepId": "end"
    }
  ]
}
```

### 3. Parse and Use the Workflow

Now, you can use the `@tiny-json-workflow/core` library to parse and interact with your workflow.

```typescript
import { parseFromJson } from "@tiny-json-workflow/core";
import { readFileSync } from "fs";

const jsonString = readFileSync("my-workflow.json", "utf-8");
const parsedFlow = parseFromJson(jsonString);

console.log(parsedFlow.name); // "Hello World Workflow"
```

## Features

*   **Declarative JSON Format:** Define workflows with a simple and intuitive JSON structure.
*   **State Management:** Manage global and step-local state.
*   **Conditional Logic:** Implement branching with decision nodes.
*   **Extensible:** Use metadata to store custom information.

## Visualizing Your Workflow (The Playground)

While `FlowJSON` is designed to be human-readable, it can be helpful to visualize your workflows. The project includes a web-based playground that allows you to create, edit, and debug your `FlowJSON` in a graphical interface.

You can access it here: [https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/](https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/)

## Examples

We have created a few examples to showcase the capabilities of `tiny-json-workflow`. You can find them in the `packages/examples/src` directory.

*   [User Onboarding](packages/examples/src/user-onboarding/README.md)
*   [Support Ticket Routing](packages/examples/src/support-ticket-routing/README.md)
*   [E-commerce Order Fulfillment](packages/examples/src/e-commerce-order-fulfillment/README.md)
*   [Dynamic Multi-Step Form](packages/examples/src/dynamic-multi-step-form/README.md)
*   [Fork-Join Flow (Simulated)](packages/examples/src/fork-join-flow/README.md)
