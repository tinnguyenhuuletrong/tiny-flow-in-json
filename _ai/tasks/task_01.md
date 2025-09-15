# Task 01: Implement Core Data Structures and Parsers

## Target

Implement the core data structures for FlowJSON as defined in `_ai/doc/requirement.md` (section 4). This includes creating TypeScript types, JSON parsing, and serialization functions for the `Flow`, `Step`, and `Connection` objects.

**Key deliverables:**

- A `types.ts` file in `packages/core/src` containing all Zod schemas and inferred TypeScript types.
- `parseFromJson` and `saveToJson` functions in `packages/core/src/index.ts`.
- Unit tests to validate the parsing and serialization logic.

---

## Iter 01

### Plan

1.  **Add Zod Dependency:** The requirement mentions using Zod for schema validation. Add it as a dependency to the `packages/core` workspace.

    ```bash
    bun add zod
    ```

2.  **Create `packages/core/src/types.ts`:**

    - Define a Zod schema for `JsonSchema` itself. This is a recursive structure that will be handled using `z.lazy()` to correctly model properties like `type`, `properties`, and `items`, avoiding `z.any()`.
    - Define the `Step` schema (`StepSchema`) using `z.object({...})`. Ensure it includes `id`, `name`, `type`, and optional fields for `paramsSchema` and `metadata` to match the examples.
    - Define the `Connection` schema (`ConnectionSchema`) with `id`, `sourceStepId`, `targetStepId`, and an optional `condition`.
    - Define the main `Flow` schema (`FlowSchema`) that includes `id`, `name`, `version`, `globalStateSchema`, and arrays of the `StepSchema` and `ConnectionSchema`.
    - Infer the TypeScript types from the Zod schemas (e.g., `export type Flow = z.infer<typeof FlowSchema>;`).

3.  **Update `packages/core/src/index.ts`:**

    - Remove the placeholder `hello` function.
    - Import the `Flow` type and `FlowSchema` from `./types.ts`.
    - Implement `parseFromJson(jsonString: string): Flow`. This function will use `JSON.parse()` and then `FlowSchema.parse()` to validate the data.
    - Implement `saveToJson(flow: Flow): string`. This function will take a `Flow` object and use `JSON.stringify()` to convert it to a formatted string.

4.  **Create `packages/core/tests/core.test.ts`:**

    - Create a new test file or rename the existing `simple.test.ts`.
    - Import `parseFromJson` and `saveToJson` from `../src`.
    - Add a `describe` block for "FlowJSON Parsing and Serialization".
    - **Test 1: Successful Parsing of All Examples:** Create separate tests for each of the three examples in `requirement.md` ("Simple User Onboarding", "Routing", and "Fork Join"). For each, parse the example JSON and assert that the resulting object is structured correctly.
    - **Test 2: Parsing Failure:** Create an invalid JSON string (e.g., missing a required `id` in a step). Call `parseFromJson` inside a `try...catch` block or use `expect(...).toThrow()` to assert that it throws a Zod validation error.
    - **Test 3: Successful Serialization:** Create a `Flow` object in TypeScript based on one of the examples. Call `saveToJson` and assert that the output is a valid, formatted JSON string.
    - **Test 4: Round-trip Integrity:** Take the `Flow` object from Test 3, serialize it, and then parse it back. Assert that the final object is deeply equal to the original object.

5.  **Run Tests:** Execute `make test` to ensure all new tests pass and no existing functionality is broken.
