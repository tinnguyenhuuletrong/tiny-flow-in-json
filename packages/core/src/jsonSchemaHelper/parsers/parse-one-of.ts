import { z } from "zod";

import { parseSchema } from "./parse-schema";
import type { JsonSchemaObject, JsonSchema, Refs } from "../types";

export const parseOneOf = (
  jsonSchema: JsonSchemaObject & { oneOf: JsonSchema[] },
  refs: Refs
) => {
  if (!jsonSchema) throw new Error("jsonSchema is null");

  if (!jsonSchema.oneOf.length) {
    return z.any();
  }

  if (jsonSchema.oneOf.length === 1) {
    return parseSchema(jsonSchema.oneOf[0] as any, {
      ...refs,
      path: [...refs.path, "oneOf", 0],
    });
  }

  return z.any().superRefine((x, ctx: any) => {
    const schemas = jsonSchema.oneOf.map((schema, i) =>
      parseSchema(schema, {
        ...refs,
        path: [...refs.path, "oneOf", i],
      })
    );

    const unionErrors = schemas.reduce<z.ZodIssue[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, ...result.error.issues] : errors)(
          schema.safeParse(x)
        ),
      []
    );

    if (schemas.length - unionErrors.length !== 1) {
      ctx.addIssue({
        code: "invalid_union",
        errors: [unionErrors],
        message: "Invalid input: Should pass single schema",
      });
    }
  });
};
