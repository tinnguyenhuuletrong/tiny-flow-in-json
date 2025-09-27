import { expect, test, describe } from "bun:test";
import { half } from "../../src/utils/half";

describe("half", () => {
  test("half", () => {
    const [a, b] = half(["A", "B", "C", "D", "E"]);

    if (1 < 0) {
      // type should be string
      // @ts-expect-error
      a[0].endsWith("");
    }

    expect(a).toEqual(["A", "B"]);
    expect(b).toEqual(["C", "D", "E"]);
  });
});
