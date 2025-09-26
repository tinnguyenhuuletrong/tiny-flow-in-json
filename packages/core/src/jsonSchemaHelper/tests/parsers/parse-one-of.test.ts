import { z } from "zod";

import { expect, test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";
import { parseOneOf } from "../../parsers/parse-one-of";

describe("parseOneOf", () => {
  test("should create a union from two or more schemas", () => {
    toMatchZod(
      parseOneOf(
        {
          oneOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { path: [], seen: new Map() }
      ),
      z.any().superRefine((x, ctx) => {
        const schemas = [z.string(), z.number()];
        const errors = schemas.reduce<z.ZodIssue[]>(
          (errors, schema) =>
            ((result) =>
              result.error ? [...errors, ...result.error.issues] : errors)(
              schema.safeParse(x)
            ),
          []
        );
        if (schemas.length - errors.length !== 1) {
          ctx.addIssue({
            code: "invalid_union",
            errors: [errors],
            message: "Invalid input: Should pass single schema",
          });
        }
      })
    );
  });

  test("should extract a single schema", () => {
    toMatchZod(
      parseOneOf(
        { oneOf: [{ type: "string" }] },
        { path: [], seen: new Map() }
      ),
      z.string()
    );
  });

  test("should return z.any() if array is empty", () => {
    toMatchZod(
      parseOneOf({ oneOf: [] }, { path: [], seen: new Map() }),
      z.any()
    );
  });
});
