import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseSchema } from "../../src/parsers/parse-schema";

describe("parseNullable", () => {
  test("parseSchema should not add default twice", () => {
    toMatchZod(
      parseSchema(
        {
          type: "string",
          nullable: true,
          default: null,
        },
        { path: [], seen: new Map() }
      ),
      z.string().nullable().default(null)
    );
  });
});
