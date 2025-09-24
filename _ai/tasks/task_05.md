# Task 5: Enhance FlowJSON with State and Parameter Validation

This task focuses on enriching the FlowJSON data model, implementing a comprehensive validation function, and establishing a robust serialization/deserialization process for schemas within the `@tiny-json-workflow/core` package.

## Goals

1.  **Extend FlowJSON Data Model:**

    - The in-memory representation of a `Flow` will use Zod schemas for `globalStateSchema` and `paramsSchema`.
    - Add a optional `state` attribute to the root `Flow` object to hold global workflow data.
    - Add a optional `params` attribute to each `Step` object to hold step-specific parameters.

2.  **Update Serialization/Deserialization:**

    - `parseFromJson`: When loading a JSON string, convert the JSON Schema objects for `globalStateSchema` and `paramsSchema` into live Zod schemas using `@n8n/json-schema-to-zod`.
    - `saveToJson`: When saving to a JSON string, convert the Zod schemas for `globalStateSchema` and `paramsSchema` back into JSON Schema objects using package `zod-to-json-schema`.

3.  **Implement Validation Function:**
    - Create a `validate(flow: Flow): FlowError[]` function that uses the live Zod schemas to validate the `state` and `params` objects.
    - The validation will also check for connection integrity.

## Plan

### Part 1: Add Dependencies

1.  In `packages/core/package.json`, add:
    - `@n8n/json-schema-to-zod`
    - `zod-to-json-schema`

### Part 2: Update Data Structures (`types.ts`)

1.  **Update `FlowSchema`:**
    - Add `state: z.record(z.any()).optional()`.
    - The `globalStateSchema` will remain of type `JsonSchema` (validating a JSON schema object), as the transformation to a Zod schema will be handled in the `parseFromJson` function.
2.  **Update `StepSchema`:**
    - Add `params: z.record(z.any()).optional()`.
    - The `paramsSchema` will also remain of type `JsonSchema`.
3.  **Define In-Memory Types:**
    - Create `type ParsedFlow` and `type ParsedStep` which will have `globalStateSchema: z.ZodSchema<any>` and `paramsSchema: z.ZodSchema<any>.optional()` respectively. These types will represent the object after it has been parsed and transformed.

### Part 3: Update Serialization/Deserialization (`index.ts`)

1.  **Update `parseFromJson(jsonString: string): ParsedFlow`:**
    - Parse the JSON string.
    - Validate it against the existing `FlowSchema` from `types.ts`.
    - Create a new transformed object where you use `@n8n/json-schema-to-zod` to convert `globalStateSchema` and `paramsSchema` from JSON schema objects into Zod schemas.
    - Return this new `ParsedFlow` object.
2.  **Update `saveToJson(flow: ParsedFlow): string`:**
    - Take the in-memory `ParsedFlow` object.
    - Create a new "raw" flow object by using the native `.toJSONSchema()` method to convert `globalStateSchema` and `paramsSchema` from Zod schemas back to JSON schema objects.
    - Stringify the resulting raw flow object.

### Part 4: Implement Validation Logic (`index.ts`)

1.  **Create `FlowError` Type:**
    - `type FlowError = { code: enum(string); message: string; };`
    - `enum(string)` enum of error code name as string
2.  **Create `validate(flow: ParsedFlow): FlowError[]` Function:**
    - **Connection Validation:** Verify `sourceStepId` and `targetStepId` exist in `flow.steps`.
    - **State/Parameter Validation:**
      - Use `flow.globalStateSchema.safeParse(flow.state)` to validate the global state.
      - Iterate through steps and use `step.paramsSchema.safeParse(step.params)` to validate step parameters.
      - Collect and format any errors from `safeParse` into `FlowError` objects.

### Part 5: Add Tests (`core.test.ts`)

1.  **Test `parseFromJson`:** Ensure it correctly converts JSON schemas to Zod schemas.
2.  **Test `saveToJson`:** Ensure it correctly converts Zod schemas back to JSON schemas.
3.  **Test Round Trip:** `parseFromJson(saveToJson(flow))` should result in an equivalent object.
4.  **Add `validate` tests:**
    - Test connection integrity failures.
    - Test state and parameter validation failures.
    - Test a valid flow.
