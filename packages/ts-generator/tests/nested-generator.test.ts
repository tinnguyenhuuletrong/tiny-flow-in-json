import { expect, test, describe } from "bun:test";
import { generateTStateShape } from "../src/utils/schema-to-ts";

describe("generateTStateShape", () => {
  test("should generate type for a simple flat object with enum", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        isStudent: { type: "boolean" },
        status: { type: "string", enum: ["active", "inactive"] },
      },
      required: ["name", "age", "status"],
    };

    const expected = `type TStateShape = {
      name: string;
      age: number;
      isStudent?: boolean;
      status: "active" | "inactive";
    };
    export const defaultState: TStateShape | undefined = undefined;
    `;

    const result = generateTStateShape(schema);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate type for an object with arrays of primitive types", () => {
    const schema = {
      type: "object",
      properties: {
        tags: { type: "array", items: { type: "string" } },
        flags: { type: "array", items: { type: "boolean" } },
      },
    };

    const expected = `type TStateShape = {
      tags?: string[];
      flags?: boolean[];
    };
    export const defaultState: TStateShape | undefined = undefined;
    `;

    const result = generateTStateShape(schema);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate type for an object with a nested object", () => {
    const schema = {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            profile: {
              type: "object",
              properties: {
                email: { type: "string" },
              },
              required: ["email"],
            },
          },
          required: ["profile"],
        },
      },
      required: ["user"],
    };

    const expected = `type TStateShape = {
      user: {
        id?: string;
        profile: {
          email: string;
        };
      };
    };
    export const defaultState: TStateShape | undefined = undefined;
    `;
    const result = generateTStateShape(schema);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });

  test("should generate type for an object with an array of objects", () => {
    const schema = {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
            },
            required: ["id", "name"],
          },
        },
      },
    };

    const expected = `type TStateShape = {
      users?: {
        id: number;
        name: string;
      }[];
    };
    export const defaultState: TStateShape | undefined = undefined;
    `;
    const result = generateTStateShape(schema);
    expect(result.replace(/\s/g, "")).toBe(expected.replace(/\s/g, ""));
  });
});
