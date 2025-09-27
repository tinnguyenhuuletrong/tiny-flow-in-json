import { z } from "zod";

import { expect, test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";
import { parseSchema } from "../../src/parsers/parse-schema";

describe("parseSchema", () => {
  test("should be usable without providing refs", () => {
    toMatchZod(parseSchema({ type: "string" }), z.string());
  });

  test("should return a seen and processed ref", () => {
    const seen = new Map();
    const schema = {
      type: "object",
      properties: {
        prop: {
          type: "string",
        },
      },
    };
    expect(parseSchema(schema, { seen, path: [] }));
    expect(parseSchema(schema, { seen, path: [] }));
  });

  test("should be possible to describe a readonly schema", () => {
    toMatchZod(
      parseSchema({ type: "string", readOnly: true }),
      z.string().readonly()
    );
  });

  test("should handle nullable", () => {
    toMatchZod(
      parseSchema(
        {
          type: "string",
          nullable: true,
        },
        { path: [], seen: new Map() }
      ),
      z.string().nullable()
    );
  });

  test("should handle enum", () => {
    toMatchZod(
      parseSchema({ enum: ["someValue", 57] }),
      z.union([z.literal("someValue"), z.literal(57)])
    );
  });

  test("should handle multiple type", () => {
    toMatchZod(
      parseSchema({ type: ["string", "number"] }),
      z.union([z.string(), z.number()])
    );
  });

  test("should handle if-then-else type", () => {
    toMatchZod(
      parseSchema({
        if: { type: "string" },
        then: { type: "number" },
        else: { type: "boolean" },
      }),
      z.union([z.number(), z.boolean()]).superRefine((value, ctx) => {
        const result = z.string().safeParse(value).success
          ? z.number().safeParse(value)
          : z.boolean().safeParse(value);
        if (!result.success) {
          ctx.issues.push(...(result.error.issues as any));
        }
      })
    );
  });

  test("should handle anyOf", () => {
    toMatchZod(
      parseSchema({
        anyOf: [
          {
            type: "string",
          },
          { type: "number" },
        ],
      }),
      z.union([z.string(), z.number()])
    );
  });

  test("should handle oneOf", () => {
    toMatchZod(
      parseSchema({
        oneOf: [
          {
            type: "string",
          },
          { type: "number" },
        ],
      }),
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
});
