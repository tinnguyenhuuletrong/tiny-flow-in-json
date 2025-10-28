import { expect, test, describe } from "bun:test";
import { promises as fs } from "fs";
import { generate } from "../src";
import type { Flow } from "@tiny-json-workflow/core";
import { beforeAll, afterAll, it } from "bun:test";

describe("Generator with Params and Global State", () => {
  const WORKFLOW_NAME = "paramsAndGlobalStateWorkflow";
  const workflowJson: Flow = {
    id: WORKFLOW_NAME,
    name: WORKFLOW_NAME,
    version: "1.0.0",
    globalStateSchema: {
      type: "object",
      properties: {
        userId: { type: "string" },
        foo: { type: "string" },
      },
      required: ["userId"],
    },
    globalState: {
      userId: "test-user",
      foo: "bar",
    },
    steps: [
      {
        id: "start",
        name: "Start",
        type: "begin",
      },
      {
        id: "task1",
        name: "Task 1",
        type: "task",
        paramsSchema: {
          type: "object",
          properties: {
            param1: { type: "string" },
          },
          required: ["param1"],
        },
        params: {
          param1: "test-param",
        },
      },
      {
        id: "end",
        name: "End",
        type: "end",
      },
    ],
    connections: [
      {
        id: "c1",
        sourceStepId: "start",
        targetStepId: "task1",
      },
      {
        id: "c2",
        sourceStepId: "task1",
        targetStepId: "end",
      },
    ],
  };

  const workflowJsonPath = `./${WORKFLOW_NAME}.json`;
  const outputTsPath = `./${WORKFLOW_NAME}.ts`;

  beforeAll(async () => {
    await fs.writeFile(workflowJsonPath, JSON.stringify(workflowJson, null, 2));
    await generate(workflowJsonPath, outputTsPath);
  });

  afterAll(async () => {
    await fs.unlink(workflowJsonPath);
    await fs.unlink(outputTsPath);
  });

  it("should generate TStateShape with default values", async () => {
    const content = await fs.readFile(outputTsPath, "utf-8");
    expect(content).toContain("type TStateShape");
    expect(content).toContain("export const defaultState: TStateShape");
    expect(content).toContain('"userId": "test-user"');
  });

  it("should generate parameter types for steps", async () => {
    const content = await fs.readFile(outputTsPath, "utf-8");
    expect(content).toContain("export type TTask1Params");
    expect(content).toContain("param1: string;");
  });

  it("should generate updated task signatures in TTasks", async () => {
    const content = await fs.readFile(outputTsPath, "utf-8");
    expect(content).toContain("type Tasks");
    expect(content).toContain(
      "Task1: (context: TStateShape, params: TTask1Params) => Promise<TStateShape>;"
    );
  });

  it("should generate correct function signatures in implementation stubs", async () => {
    const content = await fs.readFile(outputTsPath, "utf-8");
    expect(content).toContain(
      "async function Task1(context: TStateShape, params: TTask1Params): Promise<TStateShape>"
    );
  });

  it("should generate correct task handler with params", async () => {
    const content = await fs.readFile(outputTsPath, "utf-8");
    expect(content).toContain(
      'return this.tasks.Task1(this.state, {"param1":"test-param"});'
    );
  });
});
