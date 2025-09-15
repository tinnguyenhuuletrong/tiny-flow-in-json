import { expect, test } from "bun:test";
import { hello } from "../src";

test("dummy", () => {
  expect(hello()).toBe("hello");
});
