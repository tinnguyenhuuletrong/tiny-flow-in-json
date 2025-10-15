# Task 11: Add Testing to `packages/web`

## Goal

Create a comprehensive testing strategy for the `packages/web` package to ensure its reliability and maintainability. This includes setting up the testing environment, and implementing unit and integration tests.

## Test Strategy

We will use `bun:test` for running tests and `@testing-library/react` for rendering and interacting with React components. We'll use `@happy-dom/global-registrator` for a fast DOM environment. ( guide https://bun.com/guides/test/testing-library )

### 1. Test Setup

- **Install dev dependencies:**
  Run the following command in the `packages/web` directory:
  ```bash
  bun add -d @testing-library/react @testing-library/jest-dom @happy-dom/global-registrator
  ```

- **Create a test setup file:**
  Create a `tests/setup.ts` file in `packages/web` to set up the DOM environment. This file will be preloaded by Bun's test runner.

  ```typescript
  // packages/web/tests/setup.ts
  import { GlobalRegistrator } from '@happy-dom/global-registrator'

  GlobalRegistrator.register()
  ```

- **Configure Bun:**
  Create a `bunfig.toml` file in `packages/web` to tell Bun to preload the setup script before running tests.

  ```toml
  # packages/web/bunfig.toml
  [test]
  preload = "./tests/setup.ts"
  ```

- **Add a test script:**
  Update the `test` script in `packages/web/package.json` to execute `bun test`.

  ```json
  "scripts": {
    "test": "bun test"
  }
  ```

- **Update `tsconfig.json`:**
  Update `packages/web/tsconfig.json` to include the `tests` directory in the compilation.

  ```json
  {
    "include": ["src", "tests"]
  }
  ```

### 2. Unit Tests

We will start by unit testing the core logic and individual components.

- **`lib` utilities:**
  - [x] Test all utility functions in `packages/web/src/lib`.
- **`store/flowStore.ts`:**
  - [x] Test the initial state of the store.
  - [x] Test each action and ensure the state is updated correctly.
  - [x] Test selectors for deriving data from the state.
- **`hooks/useFlow.ts`:**
  - [x] Test the hook's logic, possibly by mocking the store or using a real store instance.
- **`components/shared`:**
  - [x] Test `JsonAutoForm.tsx` to ensure it renders a form correctly based on a given schema.
  - [x] Test `StepEditModal.tsx` to ensure it opens and closes correctly and that form submission works.
- **`components/custom-nodes`:**
  - [x] Test each node component (`BeginNode`, `DecisionNode`, `EndNode`, `TaskNode`) to ensure it renders correctly based on its props.

## Implementation Plan

1.  [x] **Setup the test environment:** Install dependencies, create preload scripts, configure `bunfig.toml` and `tsconfig.json`, and create the test script.
2.  [x] **Write unit tests for `lib` folder.**
3.  [x] **Write unit tests for `store/flowStore.ts`**
4.  [x] **Write unit tests for `hooks/useFlow.ts`**
5.  [x] **Write unit tests for `components/shared`**
6.  [x] **Write unit tests for `components/custom-nodes`**