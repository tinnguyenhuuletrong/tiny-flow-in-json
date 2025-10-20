import { generate } from "@tiny-json-workflow/ts-generator";
import path from "path";

const jsonPath = path.join(
  __dirname,
  "../packages/ts-generator/tests/workflow.json"
);
const tsPath = path.join(__dirname, "./.generated-workflow.ts");

generate(jsonPath, tsPath);
