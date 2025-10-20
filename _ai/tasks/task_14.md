
# Task 14: Create a TypeScript generator from FlowJSON

## Goal

Create a new package `@tiny-json-workflow/ts-generator` that can convert a FlowJSON string into a single, portable, and runnable TypeScript file. The file will be structured into two distinct sections: a `GENERATED` section and an `IMPLEMENTATION` section, to ensure that user-written code is preserved during regeneration.

This generator will use the forked runtime package `@tiny-json-workflow/runtime-durable-state`.

## Requirements

- Input: A valid JSON string that conforms to the `packages/core/schema.json`.
- Output: A single TypeScript file (e.g., `MyWorkflow.ts`) with two clearly marked sections.

## Plan

### 1. Create the package structure

Create a new directory `packages/ts-generator`.

- `packages/ts-generator/`
  - `package.json`
  - `tsconfig.json`
  - `src/`
    - `index.ts`
    - `types.ts`
  - `tests/`
    - `generator.test.ts`

### 2. `package.json`

Create `packages/ts-generator/package.json`:

```json
{
  "name": "@tiny-json-workflow/ts-generator",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "test": "bun test"
  },
  "dependencies": {
    "@tiny-json-workflow/runtime-durable-state": "workspace:*"
  },
  "devDependencies": {
    "bun-types": "latest"
  }
}
```

### 3. `tsconfig.json`

Create `packages/ts-generator/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### 4. Core generator logic in `src/index.ts`

The main file `src/index.ts` will export a `generate` function that takes the FlowJSON object and an output file path as input.

#### Two-Section File Structure

The generated file will have two sections delineated by clear markers.

```typescript
// -----------------
// --- GENERATED ---
// -----------------
// This section is automatically generated and will be overwritten.

// ... Generated code ...

// ---------------------
// --- IMPLEMENTATION ---
// ---------------------
// This section is for your custom implementation and will be preserved.

// ... User-written code ...
```

#### Regeneration Process

1.  When the generator is run, it will look for the `// --- GENERATED ---` and `// --- IMPLEMENTATION ---` markers in the existing file.
2.  It will replace the content of the `GENERATED` section entirely.
3.  The `IMPLEMENTATION` section will be left untouched.
4.  If the file doesn't exist, both sections will be created. The `IMPLEMENTATION` section will contain placeholder functions for the user to fill in.

#### Connecting the Sections

The `GENERATED` section will define the main workflow class. The constructor of this class will accept an object containing the task implementations.

The `IMPLEMENTATION` section will contain the actual task functions and a factory function to create an instance of the workflow, passing the task functions to the constructor.

**Example:**
```typescript
// -----------------
// --- GENERATED ---
// -----------------
import { DurableState, type StepIt } from "@tiny-json-workflow/runtime-durable-state";

export class MyWorkflow extends DurableState<any, any, any> {
    constructor(private tasks: { process_payment: (context: any) => Promise<any> }) {
        super(/* ... */);
    }

    private async *step_process_payment(): StepIt<any, any> {
        await this.tasks.process_payment({});
        return { nextStep: '...' };
    }
}

// ---------------------
// --- IMPLEMENTATION ---
// ---------------------

async function process_payment(context: any): Promise<any> {
    // Your code here
}

export function createWorkflow() {
    return new MyWorkflow({
        process_payment,
    });
}
```

### 5. Types in `src/types.ts`

This file will contain necessary types for the generator.

### 6. Unit tests in `tests/generator.test.ts`

- Test the initial generation of the file with both sections.
- Test the regeneration process, ensuring the `GENERATED` section is updated and the `IMPLEMENTATION` section is preserved.

### 7. Manual Verification

1.  Generate a file from a sample `workflow.json`.
2.  Implement the tasks in the `IMPLEMENTATION` section.
3.  Run the file.
4.  Modify the `workflow.json` and regenerate.
5.  Verify that the workflow logic is updated and the custom implementation is preserved and still works.
