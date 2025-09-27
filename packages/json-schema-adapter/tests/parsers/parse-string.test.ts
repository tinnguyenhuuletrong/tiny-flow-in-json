import { z } from "zod";
import { expect, test, describe } from "bun:test";
import { toMatchZod } from "../utils/testHelper";

import { parseString } from "../../src/parsers/parse-string";

describe("parseString", () => {
  const run = (schema: z.ZodString, data: unknown) => schema.safeParse(data);

  test("DateTime format", () => {
    const datetime = "2018-11-13T20:20:39Z";

    const code = parseString({
      type: "string",
      format: "date-time",
      errorMessage: { format: "hello" },
    });

    toMatchZod(code, z.string().datetime({ offset: true, message: "hello" }));

    expect(run(code, datetime)).toEqual({ success: true, data: datetime });
  });

  test("email", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "email",
      }),
      z.string().email()
    );
  });

  test("ip", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "ip",
      }),
      z.string()
    );

    toMatchZod(
      parseString({
        type: "string",
        format: "ipv6",
      }),
      z.string()
    );
  });

  test("uri", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "uri",
      }),
      z.string().url()
    );
  });

  test("uuid", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "uuid",
      }),
      z.string().uuid()
    );
  });

  test("time", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "time",
      }),
      z.string().time()
    );
  });

  test("date", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "date",
      }),
      z.string().date()
    );
  });

  test("duration", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "duration",
      }),
      z.string().duration()
    );
  });

  test("base64", () => {
    toMatchZod(
      parseString({
        type: "string",
        contentEncoding: "base64",
      }),
      z.string().base64()
    );

    toMatchZod(
      parseString({
        type: "string",
        contentEncoding: "base64",
        errorMessage: {
          contentEncoding: "x",
        },
      }),
      z.string().base64("x")
    );

    toMatchZod(
      parseString({
        type: "string",
        format: "binary",
      }),
      z.string().base64()
    );

    toMatchZod(
      parseString({
        type: "string",
        format: "binary",
        errorMessage: {
          format: "x",
        },
      }),
      z.string().base64("x")
    );
  });

  test("should accept errorMessage", () => {
    toMatchZod(
      parseString({
        type: "string",
        format: "ipv4",
        pattern: "x",
        minLength: 1,
        maxLength: 2,
        errorMessage: {
          format: "ayy",
          pattern: "lmao",
          minLength: "deez",
          maxLength: "nuts",
        },
      }),
      z.string().regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")
    );
  });
});
