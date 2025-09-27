import { z } from "zod";

import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseEnum } from "../../src/parsers/parse-enum";

describe("parseEnum", () => {
  test("should create never with empty enum", () => {
    toMatchZod(
      parseEnum({
        enum: [],
      }),
      z.never()
    );
  });

  test("should create literal with single item enum", () => {
    toMatchZod(
      parseEnum({
        enum: ["someValue"],
      }),
      z.literal("someValue")
    );
  });

  test("should create enum array with string enums", () => {
    toMatchZod(
      parseEnum({
        enum: ["someValue", "anotherValue"],
      }),
      z.enum(["someValue", "anotherValue"])
    );
  });
  test("should create union with mixed enums", () => {
    toMatchZod(
      parseEnum({
        enum: ["someValue", 57],
      }),
      z.union([z.literal("someValue"), z.literal(57)])
    );
  });
});
