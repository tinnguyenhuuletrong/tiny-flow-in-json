import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "bun:test";
import { useFlow } from "@/app/hooks/useFlow";
import { useFlowStore } from "@/app/store/flowStore";
import {
  parseFromJson,
  type Flow,
  type ParsedFlow,
} from "@tiny-json-workflow/core";

const testFlowJson = {
  id: "test-flow",
  name: "Test Flow",
  version: "1.0.0",
  globalStateSchema: { type: "object", properties: {} },
  steps: [],
  connections: [],
} as Flow;

const testFlow: ParsedFlow = parseFromJson(JSON.stringify(testFlowJson));

describe("useFlow", () => {
  it("should return the flow and setFlow from the store", () => {
    const { result } = renderHook(() => useFlow());

    expect(result.current.flow).toBeUndefined();

    act(() => {
      useFlowStore.getState().setFlow(testFlow);
    });

    const { result: result2 } = renderHook(() => useFlow());

    expect(result2.current.flow).toEqual(testFlow);
  });
});
