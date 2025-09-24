# Task 4: Polish the Code View with JSON Schema

**Objective:** Enhance the JSON editor in the web playground by integrating JSON Schema for real-time validation and autocompletion, improving the user experience and data integrity.

## Background

The current JSON editor is a simple text area without any validation or autocompletion. This task will leverage the existing Zod schemas in the `@tiny-json-workflow/core` package to generate a JSON Schema. This schema will then be used to configure the Monaco Editor, providing a much richer editing experience.

## Plan

### 1. Generate JSON Schema from Zod Schemas

- **Action:** Create a utility to convert the Zod `FlowSchema` into a standard JSON Schema object.
- **Tool:** Use the `zod-to-json-schema` library.
- **Implementation:**
  - Add `zod-to-json-schema` as a dependency to the `web` package.
  - Create a new file, e.g., `packages/web/src/lib/schema.ts`, to house the schema generation logic.
  - This utility will import `FlowSchema` from `@tiny-json-workflow/core` and export the generated JSON Schema.

### 2. Integrate JSON Schema with Monaco Editor

- **Action:** Configure the Monaco Editor in `JsonEditorView.tsx` to use the generated JSON Schema.
- **Implementation:**
  - In `JsonEditorView.tsx`, import the generated schema.
  - Use the `monaco.languages.json.jsonDefaults.setDiagnosticsOptions` API to provide the schema to the editor.
  - This will enable autocompletion for properties and values, as well as real-time validation markers (squiggles) for errors.

### 3. Add Pre-Save Validation

- **Action:** Before applying changes from the editor to the global state, validate the JSON against the `FlowSchema`.
- **Implementation:**
  - In `JsonEditorView.tsx`, within the `handleEditorChange` function, parse the editor content and validate it using `FlowSchema.safeParse()`.
  - Only call `setFlow` if the validation is successful.

### 4. Display Validation Errors

- **Action:** If the pre-save validation fails, provide clear feedback to the user.
- **Implementation:**
  - The primary error feedback will be the inline diagnostics provided by the Monaco Editor (from step 2).
  - As a secondary measure, we can add a small status indicator or toast notification to show a generic "Invalid JSON" error if the content is not parsable or fails validation. This will be implemented outside the editor, likely in the `JsonEditorView` component.

## Acceptance Criteria

- The JSON editor should provide autocompletion for all fields in the `FlowJSON` structure.
- The editor should show validation errors for incorrect types, missing required fields, etc.
- The application state should not be updated if the JSON in the editor is invalid.
- The user should be clearly informed of any validation errors.
