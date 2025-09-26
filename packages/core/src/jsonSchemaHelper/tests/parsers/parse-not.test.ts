import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseNot } from "../../parsers/parse-not";

describe("parseNot", () => {
  test("parseNot", () => {
    toMatchZod(
      parseNot(
        {
          not: {
            type: "string",
          },
        },
        { path: [], seen: new Map() }
      ),
      z
        .any()
        .refine(
          (value) => !z.string().safeParse(value).success,
          "Invalid input: Should NOT be valid against schema"
        )
    );
  });
});
