
# Task 16: Enhance ts-generator to Support globalState and params

## Goal

The primary goal of this task is to enhance the `@tiny-json-workflow/ts-generator` package to fully support `globalState` (as default values) and step-specific `params` and `paramsSchema`. This will enable the generation of more complete and type-safe TypeScript code that accurately reflects the entire workflow definition.

## Requirements

1.  **Integrate `globalState` as Default Values:**
    - The generator should use the `globalState` object from the `workflow.json` as the source of default values for the generated `TStateShape` type.
    - The generated state shape should reflect these defaults, potentially by generating a default state object.

2.  **Process `paramsSchema` and `params` for Each Step:**
    - For each step that has a `paramsSchema`, the generator should create a corresponding TypeScript type for that step's parameters.
    - The generated task signatures within the `TTasks` interface must be updated to include these newly generated param types.
    - The implementation stubs for task functions should be generated with the correct function signature, including the typed `params` argument.
    - The `params` object from the workflow definition should be passed to the task handlers during runtime.

## Plan

### Step 1: Read and Analyze Existing Code

- Review the current implementation of the `ts-generator`, focusing on:
  - `packages/ts-generator/src/index.ts`: The main generation logic.
  - `packages/ts-generator/src/utils/schema-to-ts.ts`: The utility for converting JSON schema to TypeScript types.
  - `packages/ts-generator/src/templates.ts`: The templates used for code generation.
- Examine `packages/core/src/types.ts` to ensure a clear understanding of the `Flow`, `Step`, `globalState`, `params`, and `paramsSchema` types.
- Use `packages/examples/src/user-onboarding/workflow.json` as a test case to validate the changes.

### Step 2: Enhance `TStateShape` with `globalState`

- Modify `packages/ts-generator/src/utils/schema-to-ts.ts` to accept an optional `globalState` object.
- Update the `generateTStateShape` function to incorporate the values from `globalState` as default values in the generated TypeScript type. This might involve generating a `defaultGlobalState` constant. Just in case globalState exists

### Step 3: Generate Types for Step Parameters

- In `packages/ts-generator/src/index.ts`, iterate through the steps and for each step with a `paramsSchema`, generate a TypeScript type for its parameters.
- A new utility function, similar to `generateTStateShape`, might be needed to generate types for step parameters. Let's call it `generateTParamsShape`.
- The generated type should be named based on the step's ID, e.g., `T${pascalCase(step.id)}Params`. This is optinal. should omit if flow don't contain paramsSchema

### Step 4: Update Task Signatures and Implementation Stubs

- Modify the `tasksType` generation to include the new parameter types in the task signatures.
  - The signature for a task should change from `(context: TStateShape) => Promise<TStateShape>` to `(context: TStateShape, params: T${pascalCase(step.id)}Params) => Promise<TStateShape>`. Just in case task contain a param
- Update the `IMPLEMENTATION_TEMPLATE` to generate the correct function signatures for the task implementation stubs.

### Step 5: Update Step Handlers

- The `generateStepHandlers` function in `packages/ts-generator/src/utils/step-handlers.ts` needs to be updated.
- For task steps, the generated handler should now pass the `params` from the step definition to the corresponding task function.

### Step 6: Testing

- Create a new test file in `packages/ts-generator/tests` to verify the new functionality.
- The test should:
  - Use a sample `workflow.json` that includes `globalState` and steps with `params` and `paramsSchema`.
  - Generate the TypeScript code.
  - Assert that the generated code includes:
    - The `TStateShape` with default values.
    - The generated parameter types for steps.
    - The updated task signatures in `TTasks`.
    - The correct function signatures in the implementation stubs.
- Run `make test` to ensure all existing and new tests pass.

By following this plan, the `ts-generator` will be able to produce more robust and developer-friendly TypeScript code, making it easier to work with workflows that have complex state and parameter requirements.
