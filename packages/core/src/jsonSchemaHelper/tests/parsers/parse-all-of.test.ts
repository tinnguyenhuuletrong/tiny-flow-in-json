import { test, describe } from "bun:test";
import { z } from "zod";

import { parseAllOf } from "../../parsers/parse-all-of";
import { toMatchZod } from "../utils/testHelper";

describe("parseAllOf", () => {
  test("should create never if empty", () => {
    toMatchZod(
      parseAllOf(
        {
          allOf: [],
        },
        { path: [], seen: new Map() }
      ),
      z.never()
    );
  });

  test("should handle true values", () => {
    toMatchZod(
      parseAllOf(
        {
          allOf: [{ type: "string" }, true],
        },
        { path: [], seen: new Map() }
      ),
      z.intersection(z.string(), z.any())
    );
  });

  test("should handle false values", () => {
    toMatchZod(
      parseAllOf(
        {
          allOf: [{ type: "string" }, false],
        },
        { path: [], seen: new Map() }
      ),
      z.intersection(
        z.string(),
        z
          .any()
          .refine(
            (value) => !z.any().safeParse(value).success,
            "Invalid input: Should NOT be valid against schema"
          )
      )
    );
  });
});
