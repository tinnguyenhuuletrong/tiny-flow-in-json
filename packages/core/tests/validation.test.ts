import { expect, test, describe } from "bun:test";
import { parseFromJson, validate } from "../src";
import { z } from "zod";

describe("FlowJSON Validation", () => {
  const validFlowJson = `{
    "id": "valid-flow",
    "name": "Valid Flow",
    "version": "1.0.0",
    "globalStateSchema": {
      "type": "object",
      "properties": {
        "count": { "type": "number" }
      }
    },
    "state": { "count": 10 },
    "steps": [
      { "id": "start", "name": "Start", "type": "begin" },
      { "id": "task1", "name": "Task One", "type": "task",
        "paramsSchema": { "type": "object", "properties": { "value": { "type": "string" } } },
        "params": { "value": "hello" }
      },
      { "id": "end", "name": "End", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start", "targetStepId": "task1" },
      { "id": "c2", "sourceStepId": "task1", "targetStepId": "end" }
    ]
  }`;

  test("should return an empty array for a valid flow", () => {
    const flow = parseFromJson(validFlowJson);
    const errors = validate(flow);
    expect(errors).toEqual([]);
  });

  test("should detect missing source step in connections", () => {
    const invalidConnectionFlowJson = `{
    "id": "invalid-conn-flow",
    "name": "Invalid Connection Flow",
    "version": "1.0.0",
    "globalStateSchema": {},
    "steps": [
      { "id": "start", "name": "Start", "type": "begin" },
      { "id": "end", "name": "End", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "non-existent-step", "targetStepId": "end" }
    ]
  }`;
    const flow = parseFromJson(invalidConnectionFlowJson);
    const errors = validate(flow);
    expect(errors.length).toBe(1);
    expect(errors[0]?.code).toBe("CONNECTION_ERROR");
    expect(errors[0]?.message).toContain(
      "Source step with ID 'non-existent-step' not found."
    );
  });

  test("should detect missing target step in connections", () => {
    const invalidConnectionFlowJson = `{
    "id": "invalid-conn-flow",
    "name": "Invalid Connection Flow",
    "version": "1.0.0",
    "globalStateSchema": {},
    "steps": [
      { "id": "start", "name": "Start", "type": "begin" },
      { "id": "end", "name": "End", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start", "targetStepId": "non-existent-step" }
    ]
  }`;
    const flow = parseFromJson(invalidConnectionFlowJson);
    const errors = validate(flow);
    expect(errors.length).toBe(1);
    expect(errors[0]?.code).toBe("CONNECTION_ERROR");
    expect(errors[0]?.message).toContain(
      "Target step with ID 'non-existent-step' not found."
    );
  });

  test("should detect invalid global state", () => {
    const invalidGlobalStateFlowJson = `{
    "id": "invalid-state-flow",
    "name": "Invalid State Flow",
    "version": "1.0.0",
    "globalStateSchema": {
      "type": "object",
      "properties": {
        "count": { "type": "number" }
      },
      "required": ["count"]
    },
    "state": { "count": "not-a-number" },
    "steps": [
      { "id": "start", "name": "Start", "type": "begin" },
      { "id": "end", "name": "End", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start", "targetStepId": "end" }
    ]
  }`;
    const flow = parseFromJson(invalidGlobalStateFlowJson);
    const errors = validate(flow);
    expect(errors.length).toBe(1);
    expect(errors[0]?.code).toBe("GLOBAL_STATE_VALIDATION_ERROR");
    expect(errors[0]?.message).toContain("expected number, received NaN");
  });

  test("should detect invalid step parameters", () => {
    const invalidStepParamsFlowJson = `{
    "id": "invalid-params-flow",
    "name": "Invalid Params Flow",
    "version": "1.0.0",
    "globalStateSchema": {},
    "steps": [
      { "id": "start", "name": "Start", "type": "begin" },
      { "id": "task1", "name": "Task One", "type": "task",
        "paramsSchema": { "type": "object", "properties": { "value": { "type": "string" } } },
        "params": { "value": 123 }
      },
      { "id": "end", "name": "End", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start", "targetStepId": "task1" },
      { "id": "c2", "sourceStepId": "task1", "targetStepId": "end" }
    ]
  }`;
    const flow = parseFromJson(invalidStepParamsFlowJson);
    const errors = validate(flow);
    expect(errors.length).toBe(1);
    expect(errors[0]?.code).toBe("STEP_PARAMS_VALIDATION_ERROR");
    expect(errors[0]?.message).toContain("expected string, received number");
  });
});
