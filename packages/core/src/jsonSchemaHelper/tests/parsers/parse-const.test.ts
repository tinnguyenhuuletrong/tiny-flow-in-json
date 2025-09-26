import { z } from "zod";
import { test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseConst } from "../../parsers/parse-const";

describe("parseConst", () => {
  test("should handle falsy constants", () => {
    toMatchZod(
      parseConst({
        const: false,
      }),
      z.literal(false)
    );
  });
});
