import z from "zod";
import { expect } from "bun:test";

export function toMatchZod(actual: z.ZodTypeAny, expected: z.ZodTypeAny) {
  const actualSerialized = JSON.stringify(actual._zod.def, null, 2);
  const expectedSerialized = JSON.stringify(expected._zod.def, null, 2);
  expect(actualSerialized).toEqual(expectedSerialized);
}
