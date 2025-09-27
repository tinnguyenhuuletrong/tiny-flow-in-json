import { test, describe, expect } from "bun:test";
import { jsonSchemaToZod } from "../src";
import { toJSONSchema } from "zod";

test("dev", () => {
  const schema: any = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    additionalProperties: false,
    type: "object",
    properties: {
      userId: {
        type: "string",
      },
      profileIsComplete: {
        type: "boolean",
      },
    },
    required: ["userId"],
  };

  const res = jsonSchemaToZod(schema);
  // console.log(JSON.stringify(res._zod.def, null, 2));

  const out = toJSONSchema(res);
  // console.log(out);

  expect(out).toEqual(schema);
});
