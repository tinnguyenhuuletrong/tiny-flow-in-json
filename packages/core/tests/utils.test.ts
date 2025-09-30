import { describe, it, expect } from "bun:test";
import { orderedJsonStringify } from "../src/utils/helper";

describe("orderedJsonStringify", () => {
  it("orders keys as specified in keyOrder", () => {
    const obj = { b: 2, a: 1, c: 3 };
    const keyOrder = ["a", "b"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe('{"a":1,"b":2,"c":3}');
  });

  it("includes all keys, even if not in keyOrder", () => {
    const obj = { x: 10, y: 20, z: 30 };
    const keyOrder = ["y"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe('{"y":20,"x":10,"z":30}');
  });

  it("ignores keys in keyOrder not present in object", () => {
    const obj = { foo: 1 };
    const keyOrder = ["bar", "foo"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe('{"foo":1}');
  });

  it("works with empty keyOrder", () => {
    const obj = { a: 1, b: 2 };
    const keyOrder: string[] = [];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    // Order is not guaranteed, so parse and compare objects
    expect(JSON.parse(result)).toEqual(obj);
  });

  it("works with empty object", () => {
    const obj = {};
    const keyOrder = ["a", "b"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe("{}");
  });

  it("respects space argument for pretty printing", () => {
    const obj = { b: 2, a: 1 };
    const keyOrder = ["a", "b"];
    const result = orderedJsonStringify(obj, keyOrder, 4);
    expect(result).toBe('{\n    "a": 1,\n    "b": 2\n}');
  });

  it("handles nested objects (order only applies to top-level)", () => {
    const obj = { b: { y: 2, x: 1 }, a: 1 };
    const keyOrder = ["b", "a"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe('{"b":{"y":2,"x":1},"a":1}');
  });

  it("outputs undefined for missing keys in object", () => {
    const obj = { foo: 1 };
    const keyOrder = ["bar"];
    const result = orderedJsonStringify(obj, keyOrder, 0);
    expect(result).toBe('{"foo":1}');
  });
});
