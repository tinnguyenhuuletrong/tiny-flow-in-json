# Task 10: Add Testing to `packages/web`

## Goal

Create a comprehensive testing strategy for the `packages/web` package to ensure its reliability and maintainability. This includes setting up the testing environment, and implementing unit and integration tests.

## Test Strategy

We will use `bun:test` for running tests and `@testing-library/react` for rendering and interacting with React components. We'll use `@happy-dom/global-registrator` for a fast DOM environment.

### 1. Test Setup

- **Install Dependencies:** Add `bun-types`, `@testing-library/react`, `@testing-library/jest-dom`, and `@happy-dom/global-registrator` to `devDependencies`.

- **Create Preload Scripts:** Create a `tests` directory in `packages/web` and add the following files:
    - `tests/happydom.ts`:
        ```typescript
        import { GlobalRegistrator } from '@happy-dom/global-registrator';
        GlobalRegistrator.register();
        ```
    - `tests/setup.ts`:
        ```typescript
        import { afterEach } from 'bun:test';
        import { cleanup } from '@testing-library/react';
        import '@testing-library/jest-dom';

        afterEach(() => {
          cleanup();
        });
        ```

- **Configure `bunfig.toml`:** Create a `bunfig.toml` file in the `packages/web` directory with the following content to automatically preload the setup scripts:
    ```toml
    [test]
    preload = ["./tests/happydom.ts", "./tests/setup.ts"]
    ```

- **Configure `tsconfig.json`:**
  - Add `"dom"` to `compilerOptions.lib`.
  - Create a `tests/tsconfig.json` to include the test files.

- **Create Test Script:** Update the `test` script in `packages/web/package.json` to run `bun test`.

### 2. Unit Tests

We will start by unit testing the core logic and individual components.

- **`lib` utilities:**
  - Test all utility functions in `packages/web/src/lib`.
- **`store/flowStore.ts`:**
  - Test the initial state of the store.
  - Test each action and ensure the state is updated correctly.
  - Test selectors for deriving data from the state.
- **`hooks/useFlow.ts`:**
  - Test the hook's logic, possibly by mocking the store or using a real store instance.
- **`components/shared`:**
  - Test `JsonAutoForm.tsx` to ensure it renders a form correctly based on a given schema.
  - Test `StepEditModal.tsx` to ensure it opens and closes correctly and that form submission works.
- **`components/custom-nodes`:**
  - Test each node component (`BeginNode`, `DecisionNode`, `EndNode`, `TaskNode`) to ensure it renders correctly based on its props.

### 3. Integration Tests

After unit tests are in place, we will write integration tests to ensure different parts of the application work together correctly.

- **`JsonEditorView` and `FlowView`:**
  - Test that updating the JSON in `JsonEditorView` correctly updates the nodes and edges in `FlowView`.
- **`FlowView` and `StepEditModal`:**
  - Test that double-clicking a node in `FlowView` opens the `StepEditModal` with the correct data.
  - Test that saving changes in the modal updates the node in the `FlowView`.

## Implementation Plan

1.  **Setup the test environment:** Install dependencies, create preload scripts, configure `bunfig.toml` and `tsconfig.json`, and create the test script.
2.  **Write unit tests for `lib` folder.**
3.  **Write unit tests for `store/flowStore.ts`**
4.  **Write unit tests for `hooks/useFlow.ts`**
5.  **Write unit tests for `components/shared`**
6.  **Write unit tests for `components/custom-nodes`**
7.  **Write integration tests for `JsonEditorView` and `FlowView`**
8.  **Write integration tests for `FlowView` and `StepEditModal`**