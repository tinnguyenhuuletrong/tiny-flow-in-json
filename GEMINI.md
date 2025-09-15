# GEMINI.md: Project Context for `tiny-json-workflow`

This document provides a comprehensive overview of the `tiny-json-workflow` project for AI-driven development.

## 1. Project Overview

`tiny-json-workflow` is a TypeScript monorepo project aimed at creating **FlowJSON**, a standardized, self-declarative JSON format for defining and executing workflows. The project's main goal is to provide a robust and flexible data structure that can represent complex logic, including sequential steps, branching, and state management.

The project is structured as a monorepo managed by **Bun**. The core logic is being developed in the `@tiny-json-workflow/core` package, which is intended to be a lightweight, dependency-free TypeScript module for parsing and validating the FlowJSON format.

The project also envisions a web-based playground for visually creating and editing these workflows, though the immediate focus is on the core library and specification.

**Key Technologies:**

- **Runtime/Bundler/Package Manager:** Bun
- **Language:** TypeScript
- **Architecture:** Monorepo (`packages/*`)

## 2. Building and Running

### Installation

Install all dependencies for the monorepo using Bun:

```bash
bun install
```

### Testing

Run the test suite for all packages in the workspace:

```bash
make test
```

Alternatively, you can run tests for all workspaces directly:

```bash
bun run --workspaces test
```

### Running Examples

The project includes an example of how to use the core library. To run it:

```bash
bun run examples/play.ts
```

## 3. Development Conventions

### Project Structure

- The project is a monorepo. All packages are located in the `/packages` directory.
- The main library is `@tiny-json-workflow/core`.
- The `_ai` directory contains project requirements and workflow guidelines for AI agent collaboration.

### Code Style

- The project uses **TypeScript** with a **strict** configuration, as defined in `tsconfig.json`.
- Code should adhere to modern ECMAScript standards (`ESNext`).
- Modules are resolved using the `bundler` strategy.

### Testing

- Tests are written using `bun:test`.
- Test files are located in the `tests` directory within each package (e.g., `packages/core/tests`).
- All new contributions should be accompanied by corresponding tests.

### AI-Driven Workflow

The `_ai/doc/working_flow.md` file outlines a specific process for development:

1.  Project requirements are defined in `_ai/doc/requirement.md`.
2.  Work is broken down into tasks stored in `_ai/tasks/`.
3.  Each task is implemented in small, complete iterations that include tests.
4.  Before completing an iteration, ensure the code compiles and all tests pass.
