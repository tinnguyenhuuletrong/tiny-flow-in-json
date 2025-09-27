import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseAnyOf } from "../../src/parsers/parse-any-of";

describe("parseAnyOf", () => {
  test("should create a union from two or more schemas", () => {
    toMatchZod(
      parseAnyOf(
        {
          anyOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { path: [], seen: new Map() }
      ),
      z.union([z.string(), z.number()])
    );
  });

  test("should extract a single schema", () => {
    toMatchZod(
      parseAnyOf(
        { anyOf: [{ type: "string" }] },
        { path: [], seen: new Map() }
      ),
      z.string()
    );
  });

  test("should return z.any() if array is empty", () => {
    toMatchZod(
      parseAnyOf({ anyOf: [] }, { path: [], seen: new Map() }),
      z.any()
    );
  });
});
