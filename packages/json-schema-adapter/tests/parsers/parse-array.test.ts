import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseArray } from "../../src/parsers/parse-array";

describe("parseArray", () => {
  test("should create tuple with items array", () => {
    toMatchZod(
      parseArray(
        {
          type: "array",
          items: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        { path: [], seen: new Map() }
      ),
      z.tuple([z.string(), z.number()])
    );
  });

  test("should create array with items object", () => {
    toMatchZod(
      parseArray(
        {
          type: "array",
          items: {
            type: "string",
          },
        },
        { path: [], seen: new Map() }
      ),
      z.array(z.string())
    );
  });

  test("should create min for minItems", () => {
    toMatchZod(
      parseArray(
        {
          type: "array",
          minItems: 2,
          items: {
            type: "string",
          },
        },
        { path: [], seen: new Map() }
      ),
      z.array(z.string()).min(2)
    );
  });

  test("should create max for maxItems", () => {
    toMatchZod(
      parseArray(
        {
          type: "array",
          maxItems: 2,
          items: {
            type: "string",
          },
        },
        { path: [], seen: new Map() }
      ),
      z.array(z.string()).max(2)
    );
  });
});
