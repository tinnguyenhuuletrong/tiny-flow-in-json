import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseNumber } from "../../src/parsers/parse-number";

describe("parseNumber", () => {
  test("should handle integer", () => {
    toMatchZod(
      parseNumber({
        type: "integer",
      }),
      z.coerce.number().int()
    );

    toMatchZod(
      parseNumber({
        type: "integer",
        multipleOf: 1,
      }),
      z.coerce.number().int()
    );

    toMatchZod(
      parseNumber({
        type: "number",
        multipleOf: 1,
      }),
      z.coerce.number().int()
    );
  });

  test("should handle maximum with exclusiveMinimum", () => {
    toMatchZod(
      parseNumber({
        type: "number",
        exclusiveMinimum: true,
        minimum: 2,
      }),
      z.coerce.number().gt(2)
    );
  });

  test("should handle maximum with exclusiveMinimum", () => {
    toMatchZod(
      parseNumber({
        type: "number",
        minimum: 2,
      }),
      z.coerce.number().gte(2)
    );
  });

  test("should handle maximum with exclusiveMaximum", () => {
    toMatchZod(
      parseNumber({
        type: "number",
        exclusiveMaximum: true,
        maximum: 2,
      }),
      z.coerce.number().lt(2)
    );
  });

  test("should handle numeric exclusiveMaximum", () => {
    toMatchZod(
      parseNumber({
        type: "number",
        exclusiveMaximum: 2,
      }),
      z.coerce.number().lt(2)
    );
  });

  test("should accept errorMessage", () => {
    toMatchZod(
      parseNumber({
        type: "number",
        format: "int64",
        exclusiveMinimum: 0,
        maximum: 2,
        multipleOf: 2,
        errorMessage: {
          format: "ayy",
          multipleOf: "lmao",
          exclusiveMinimum: "deez",
          maximum: "nuts",
        },
      }),
      z.coerce
        .number()
        .int("ayy")
        .multipleOf(2, "lmao")
        .gt(0, "deez")
        .lte(2, "nuts")
    );
  });
});
