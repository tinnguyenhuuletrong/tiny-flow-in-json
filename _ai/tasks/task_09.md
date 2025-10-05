### Task 08: Create CI Github Action

**Goal:** Create a Github Action workflow to automate building, testing, and deploying the project.

**Requirements:**

1.  The workflow should run on every push to the `main` branch.
2.  It must install dependencies, run tests, and perform a type check.
3.  Build the `@tiny-json-workflow/web` package for deployment.
4.  Publish the web app build to Github Pages.
5.  Generate a JSON schema from the `@tiny-json-workflow/core` package.
6.  Publish the JSON schema to Github Pages, with versioning.

**Planning:**

**Part 1: Setup Basic CI Workflow**

1.  Create a new workflow file at `.github/workflows/ci.yml`.
2.  Define the trigger condition (push to `main`).
3.  Create a `build_and_test` job:
    *   Checkout the repository.
    *   Set up the Bun environment.
    *   Install dependencies using `bun install`.
    *   Run tests using `make test`.
    *   Run type check using `make check`.

**Part 2: JSON Schema Generation**

1.  Create a new script `packages/core/scripts/generate-schema.ts` that imports the `JSON_SCHEMA` constant from `@tiny-json-workflow/core` and writes it to a `schema.json` file.
2.  Add a `build:schema` script to `packages/core/package.json` that executes the `generate-schema.ts` script.
3.  Update the `ci.yml` workflow to run the `build:schema` script and store the generated `schema.json` as an artifact.

**Part 3: Build Web App**

1.  Identify the build script in `packages/web/package.json`.
2.  Update the `ci.yml` workflow to build the web app.
3.  Store the build output directory (`dist`) as an artifact.

**Part 4: Deployment to Github Pages**

1.  Create a new `deploy` job that depends on the `build_and_test` job.
2.  Configure Github Pages for the repository.
3.  Use an action like `actions/upload-pages-artifact` and `actions/deploy-pages` to deploy the web app and the JSON schema.
4.  The web app should be deployed to the root of the Github Pages site.
5.  The JSON schema should be deployed to a versioned path, e.g., `/schema/v1.0.0/flow.json`, and also as `/schema/latest/flow.json`. The version number will be read from `packages/core/package.json`.
