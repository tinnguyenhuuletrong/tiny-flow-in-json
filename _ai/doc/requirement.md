# PRD: FlowJSON - A Declarative Workflow Standard

- [PRD: FlowJSON - A Declarative Workflow Standard](#prd-flowjson---a-declarative-workflow-standard)
  - [1. Overview 📝](#1-overview-)
  - [2. Problem Statement 🤔](#2-problem-statement-)
  - [3. Goals and Objectives 🎯](#3-goals-and-objectives-)
  - [4. Core Concepts \& Data Structure 🏗️](#4-core-concepts--data-structure-️)
    - [4.1. The `Flow` Object](#41-the-flow-object)
    - [4.2. The Step (Node) Object](#42-the-step-node-object)
    - [4.3. The Connection (Edge) Object](#43-the-connection-edge-object)
  - [5. Feature Requirements 🛠️](#5-feature-requirements-️)
    - [5.1. FlowJSON Specification](#51-flowjson-specification)
    - [5.2. Web Playground (UI)](#52-web-playground-ui)
  - [6. Tech Stack 💻](#6-tech-stack-)
  - [7. Out of Scope / Future Considerations 🚀](#7-out-of-scope--future-considerations-)
  - [8. Example FlowJSON](#8-example-flowjson)
    - [8.1 Simple User Onboarding Flow](#81-simple-user-onboarding-flow)
    - [8.2 Routing](#82-routing)
    - [8.3 Fork Join](#83-fork-join)

## 1. Overview 📝

This document outlines the requirements for **FlowJSON**, a project to create a standardized, self-declarative JSON format for defining and executing workflows. The primary focus is on establishing a robust and flexible data structure that can represent complex logic, including sequential steps, branching, and state management.

The core output will be a formal specification for the FlowJSON format, a core library for validating it, and a web-based playground for visually creating, editing, and testing these flows. This project explicitly **defers the implementation of a specific execution engine**, concentrating instead on the "blueprint" of the flow itself.

---

## 2. Problem Statement 🤔

Developers frequently need to implement multi-step processes, such as user onboarding, data processing pipelines, or business logic fulfillment. These workflows are often hard-coded, making them difficult to visualize, modify, and reuse. Existing solutions can be overly complex, proprietary, or lack a clear, human-readable definition.

There is a need for a **generalized, portable, and declarative format** to define workflows that can be easily understood, version-controlled, and used as a foundation for various execution engines.

---

## 3. Goals and Objectives 🎯

- **Primary Goal:** Define a comprehensive and intuitive **FlowJSON specification** that can model complex workflows.
- **Secondary Goal:** Develop a **web-based playground** using React and React Flow to serve as a reference implementation for creating and visualizing FlowJSON structures. Support Import and Export FlowJSON
- **Technical Goal:** Create a lightweight, dependency-free **core module** in the monorepo for parsing and validating the FlowJSON format.

---

## 4. Core Concepts & Data Structure 🏗️

FlowJSON is designed as a directed acyclic graph (DAG) represented in a single JSON object. The schemas for state and parameters will be defined using **Zod** within the TypeScript codebase, which will be serialized to a JSON Schema format for maximum portability within the FlowJSON file.

### 4.1. The `Flow` Object

The root of the document. It contains the global configuration, the steps (nodes), and the connections (edges).

```json
{
  "id": "flow_unique_id_123",
  "name": "User Onboarding Flow",
  "version": "1.0.0",
  "globalStateSchema": {
      "type": "object",
      "properties": {
        "userId": { "type": "string" },
        "onboardingStage": { "type": "string", "default": "start" },
        "hasCompletedProfile": { "type": "boolean", "default": false }
      },
      "required": ["userId"]
  },
  "steps": [ ... ],
  "connections": [ ... ],
}
```

- globalStateSchema: A JSON Schema defining the structure and validation rules for the global key-value state that is accessible to all steps.

### 4.2. The Step (Node) Object

A Step represents a single unit of work or logic in the flow. It is an element in the steps array.

```json
{
  "id": "step_welcome_email",
  "name": "Send Welcome Email",
  "type": "task",
  "paramsSchema": {
    "type": "object",
    "properties": {
      "templateId": { "type": "string", "default": "welcome-v1" },
      "sendDelaySeconds": { "type": "integer", "minimum": 0 }
    }
  },
  "metadata": {
    "owner": "marketing-team",
    "retries": 3
  }
}
```

- id: A unique identifier for the step within the flow.
- name: A human-readable label.
- type: A string indicating the step's nature. Special types begin and end are mandatory (exactly one of each per flow). Other examples include
  - task
  - decision
- paramsSchema: A JSON Schema defining the specific input parameters this step requires.
- metadata: An open object for storing any custom attributes.

### 4.3. The Connection (Edge) Object

A Connection defines the directional link between two steps and contains the logic for branching.

```json
{
  "id": "conn_check_profile_to_end",
  "sourceStepId": "step_check_profile_complete",
  "targetStepId": "step_end",
  "condition": "state.hasCompletedProfile == true"
}
```

- sourceStepId: The id of the origin step.
- targetStepId: The id of the destination step.
- condition: An optional string containing a boolean expression evaluated against the globalState

## 5. Feature Requirements 🛠️

### 5.1. FlowJSON Specification

- A flow must contain exactly one begin step and one end step.
- The globalStateSchema and paramsSchema must be valid JSON Schema objects.
- All id fields must be unique within their respective scopes.
- All sourceStepId and targetStepId in connections must point to valid step ids.

### 5.2. Web Playground (UI)

- Visual Editor: Use reactflow.dev to render the FlowJSON as a graph. Users can drag, drop, and connect nodes visually.
- Properties Panel: When a node or edge is selected, a panel will display its properties for editing using shadcn/ui components.
- Schema-Driven UI: For a selected step, its paramsSchema will be used by AutoForm to auto-generate a validated input form, providing a seamless editing experience.
- JSON Editor: A side-by-side view showing the raw FlowJSON, with bi-directional updates between the visual editor and the text editor.
- Save/Load: Users can save the current flow as a .json file and load a valid FlowJSON file into the playground.

## 6. Tech Stack 💻

- Monorepo: Bun for fast installation, scripting, and package management.
- Core Logic: A pure TypeScript module for parsing, validation, and schema management (Zod).
- Web Interface: React (Vite) with TypeScript.
- UI Framework: shadcn/ui for a modern, accessible, and customizable component library.
- Flow Visualization: reactflow.dev.

Schema Form Generation: AutoForm ([vantezzen/autoform](https://github.com/vantezzen/autoform)) to automatically generate input forms and handle validation based on Zod schemas.

## 7. Out of Scope / Future Considerations 🚀

- Execution Engine: This PRD does not cover the creation of an engine that runs the flow.
- Real-time Collaboration: A collaborative version of the playground is not in scope for V1.
- Pre-built Step Library: A library of common, reusable steps is a potential future addition.
- Advanced Expression Language: The condition will initially support simple expressions. A more complex engine could be integrated later.

## 8. Example FlowJSON

### 8.1 Simple User Onboarding Flow

```json
{
  "id": "onboarding-flow-v1",
  "name": "User Onboarding Flow",
  "version": "1.0.0",
  "globalStateSchema": {
    "type": "object",
    "properties": {
      "userId": { "type": "string" },
      "profileIsComplete": { "type": "boolean", "default": false }
    },
    "required": ["userId"]
  },
  "steps": [
    { "id": "start-flow", "name": "Begin Onboarding", "type": "begin" },
    {
      "id": "send-welcome",
      "name": "Send Welcome Email",
      "type": "task",
      "paramsSchema": {
        "type": "object",
        "properties": {
          "template": { "type": "string", "default": "welcome-email-v2" }
        }
      },
      "metadata": { "owner": "engagement-team" }
    },
    {
      "id": "check-profile",
      "name": "Is Profile Complete?",
      "type": "decision"
    },
    { "id": "send-reminder", "name": "Send Profile Reminder", "type": "task" },
    { "id": "end-flow", "name": "End Onboarding", "type": "end" }
  ],
  "connections": [
    {
      "id": "c1",
      "sourceStepId": "start-flow",
      "targetStepId": "send-welcome"
    },
    {
      "id": "c2",
      "sourceStepId": "send-welcome",
      "targetStepId": "check-profile"
    },
    {
      "id": "c3",
      "sourceStepId": "check-profile",
      "targetStepId": "end-flow",
      "condition": "state.profileIsComplete == true"
    },
    {
      "id": "c4",
      "sourceStepId": "check-profile",
      "targetStepId": "send-reminder",
      "condition": "state.profileIsComplete == false"
    },
    { "id": "c5", "sourceStepId": "send-reminder", "targetStepId": "end-flow" }
  ]
}
```

### 8.2 Routing

- Here is a more complex FlowJSON example demonstrating a single "decision" step that routes to multiple subsequent steps based on different conditions. This scenario models a customer support ticket routing system

```json
{
  "id": "support-ticket-router-v2",
  "name": "Customer Support Ticket Routing Flow",
  "version": "2.0.0",
  "globalStateSchema": {
    "type": "object",
    "properties": {
      "ticket": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "priority": {
            "type": "string",
            "enum": ["low", "medium", "high", "urgent"]
          },
          "category": {
            "type": "string",
            "enum": ["technical", "billing", "general"]
          },
          "isVip": { "type": "boolean", "default": false }
        },
        "required": ["id", "priority", "category"]
      },
      "assignedAgentId": {
        "type": "string"
      }
    },
    "required": ["ticket"]
  },
  "steps": [
    {
      "id": "start-routing",
      "name": "Begin Ticket Routing",
      "type": "begin"
    },
    {
      "id": "evaluate-ticket",
      "name": "Evaluate Ticket Priority & Category",
      "type": "decision",
      "metadata": {
        "description": "This is the main routing hub. It checks the ticket's properties to determine the correct path.",
        "ui.nodeColor": "#8E44AD"
      }
    },
    {
      "id": "escalate-urgent",
      "name": "Escalate to L2 Tech Support",
      "type": "task",
      "paramsSchema": {
        "type": "object",
        "properties": {
          "slaMinutes": { "type": "integer", "default": 15 },
          "pageOnCallEngineer": { "type": "boolean", "default": true }
        }
      }
    },
    {
      "id": "route-to-billing",
      "name": "Route to Billing Team",
      "type": "task",
      "paramsSchema": {
        "type": "object",
        "properties": {
          "queueId": { "type": "string", "default": "billing-queue-main" }
        }
      }
    },
    {
      "id": "assign-general",
      "name": "Assign to General Support Queue",
      "type": "task",
      "paramsSchema": {
        "type": "object",
        "properties": {
          "queueId": { "type": "string", "default": "general-queue" }
        }
      }
    },
    {
      "id": "add-vip-tag",
      "name": "Tag as VIP Customer",
      "type": "task",
      "metadata": {
        "description": "This step runs in parallel for VIP customers regardless of routing."
      }
    },
    {
      "id": "send-confirmation",
      "name": "Send Confirmation to Customer",
      "type": "task",
      "paramsSchema": {
        "type": "object",
        "properties": {
          "template": { "type": "string", "default": "ticket-received-confirm" }
        }
      }
    },
    {
      "id": "end-routing",
      "name": "End Routing Process",
      "type": "end"
    }
  ],
  "connections": [
    {
      "id": "c1",
      "sourceStepId": "start-routing",
      "targetStepId": "evaluate-ticket"
    },

    // --- One-to-Many Routing from 'evaluate-ticket' ---
    {
      "id": "c2-urgent",
      "sourceStepId": "evaluate-ticket",
      "targetStepId": "escalate-urgent",
      "condition": "state.ticket.priority == 'urgent' && state.ticket.category == 'technical'"
    },
    {
      "id": "c3-billing",
      "sourceStepId": "evaluate-ticket",
      "targetStepId": "route-to-billing",
      "condition": "state.ticket.category == 'billing'"
    },
    {
      "id": "c4-default",
      "sourceStepId": "evaluate-ticket",
      "targetStepId": "assign-general"
    },

    // --- Parallel Path for VIP Customers ---
    {
      "id": "c5-vip",
      "sourceStepId": "evaluate-ticket",
      "targetStepId": "add-vip-tag",
      "condition": "state.ticket.isVip == true"
    },

    // --- Convergence of Paths ---
    {
      "id": "c6",
      "sourceStepId": "escalate-urgent",
      "targetStepId": "send-confirmation"
    },
    {
      "id": "c7",
      "sourceStepId": "route-to-billing",
      "targetStepId": "send-confirmation"
    },
    {
      "id": "c8",
      "sourceStepId": "assign-general",
      "targetStepId": "send-confirmation"
    },
    {
      "id": "c9",
      "sourceStepId": "add-vip-tag",
      "targetStepId": "end-routing"
    },
    {
      "id": "c10",
      "sourceStepId": "send-confirmation",
      "targetStepId": "end-routing"
    }
  ]
}
```

### 8.3 Fork Join

- Here is an example of a FlowJSON structure that models a "fork-join" pattern, where one step initiates two parallel tasks that later converge at a single "join" step. This scenario describes updating a user's profile, where updating a search index and sending an email notification happen in parallel.

```json
{
  "id": "user-profile-update-v3",
  "name": "User Profile Update with Parallel Tasks",
  "version": "3.0.0",
  "globalStateSchema": {
    "type": "object",
    "properties": {
      "userId": { "type": "string" },
      "updatedFields": { "type": "array", "items": { "type": "string" } },
      "searchIndexStatus": { "type": "string" },
      "emailNotificationStatus": { "type": "string" }
    },
    "required": ["userId", "updatedFields"]
  },
  "steps": [
    {
      "id": "begin-update",
      "name": "Begin Profile Update",
      "type": "begin"
    },
    {
      "id": "fork-tasks",
      "name": "Initiate Parallel Tasks",
      "type": "task",
      "metadata": {
        "description": "This step acts as the 'fork', initiating parallel execution paths. An execution engine would interpret its multiple outgoing, unconditional connections as a trigger for parallelism."
      }
    },
    {
      "id": "update-search-index",
      "name": "Update Search Index",
      "type": "task",
      "metadata": {
        "owner": "search-team"
      },
      "paramsSchema": {
        "type": "object",
        "properties": {
          "indexName": { "type": "string", "default": "users" }
        }
      }
    },
    {
      "id": "send-email-notification",
      "name": "Send 'Profile Updated' Email",
      "type": "task",
      "metadata": {
        "owner": "comms-team"
      },
      "paramsSchema": {
        "type": "object",
        "properties": {
          "templateId": {
            "type": "string",
            "default": "profile-update-success-v3"
          }
        }
      }
    },
    {
      "id": "join-tasks",
      "name": "Synchronize and Finalize",
      "type": "task",
      "metadata": {
        "description": "This step acts as the 'join'. An execution engine should wait for all incoming paths (from search index and email) to complete before executing this step."
      }
    },
    {
      "id": "end-update",
      "name": "End Profile Update",
      "type": "end"
    }
  ],
  "connections": [
    {
      "id": "c1",
      "sourceStepId": "begin-update",
      "targetStepId": "fork-tasks"
    },

    // --- The Fork: One step to two parallel sub-steps ---
    // The absence of a 'condition' on these connections from the same source implies parallelism.
    {
      "id": "c2-path-A",
      "sourceStepId": "fork-tasks",
      "targetStepId": "update-search-index"
    },
    {
      "id": "c3-path-B",
      "sourceStepId": "fork-tasks",
      "targetStepId": "send-email-notification"
    },

    // --- The Join: Two parallel steps converging on one ---
    {
      "id": "c4-join-A",
      "sourceStepId": "update-search-index",
      "targetStepId": "join-tasks"
    },
    {
      "id": "c5-join-B",
      "sourceStepId": "send-email-notification",
      "targetStepId": "join-tasks"
    },

    // --- Continue after join ---
    { "id": "c6", "sourceStepId": "join-tasks", "targetStepId": "end-update" }
  ]
}
```
