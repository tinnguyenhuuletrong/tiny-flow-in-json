
# Task 15: Refactor ts-generator to use template files

**Goal:** Refactor the `packages/ts-generator` to use a templating system instead of inline strings for generating TypeScript code. This will improve maintainability and readability.

**Requirements:**

-   Create a `templates` directory inside `packages/ts-generator/src`.
-   Move all inline TypeScript code generation logic into separate template files within the `templates` directory.
-   Use a simple placeholder system (e.g., `{{variable}}`) in the template files.
-   Implement a simple template rendering function to read template files and replace placeholders with dynamic values.
-   The generated code should remain identical to the current output.
-   Ensure all tests pass after the refactoring.

**Plan:**

1.  **Create `templates` directory:**
    -   Create a new directory `packages/ts-generator/src/templates`.

2.  **Create a template loader utility:**
    -   Create a file `packages/ts-generator/src/utils/template.ts` that exports a function `loadTemplate(templateName: string, data: Record<string, string>): string`.
    -   This function will read a template file from the `templates` directory, replace all `{{key}}` placeholders with the corresponding values from the `data` object, and return the resulting string.

3.  **Refactor `step-handlers.ts`:**
    -   Create template files for each step type in `packages/ts-generator/src/templates/step-handlers/`:
        -   `begin.ts.tpl`
        -   `end.ts.tpl`
        -   `task.ts.tpl`
        -   `decision.ts.tpl`
    -   Update `packages/ts-generator/src/utils/step-handlers.ts` to use the `loadTemplate` function to generate the step handler code.

4.  **Refactor `schema-to-ts.ts`:**
    -   Create a template file `packages/ts-generator/src/templates/type.ts.tpl` for the `TStateShape` type.
    -   Update `packages/ts-generator/src/utils/schema-to-ts.ts` to use the `loadTemplate` function.

5.  **Refactor `index.ts`:**
    -   Create a main template file `packages/ts-generator/src/templates/main.ts.tpl` that will contain the overall structure of the generated file.
    -   Create templates for the other generated parts like `eStepEnum`, `tasksType`, `constructor`, and `implementationSection`.
    -   Update `packages/ts-generator/src/index.ts` to use the `loadTemplate` function and assemble the final code from the templates.

6.  **Verify:**
    -   Run the tests to ensure that the generated code is still correct and all tests pass.
