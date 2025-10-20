
import { expect, test } from "bun:test";
import { generate } from "../src/index";
import { promises as fs } from "fs";
import path from "path";

test("generator", async () => {
  const jsonPath = path.join(__dirname, "workflow.json");
  const tsPath = path.join(__dirname, "generated.ts");

  await generate(jsonPath, tsPath);

  const generatedContent = await fs.readFile(tsPath, "utf-8");

  expect(generatedContent).toMatchSnapshot();

  // a bug in bun:test will cause snapshot to fail if we delete the file
  // await fs.unlink(tsPath);
});
