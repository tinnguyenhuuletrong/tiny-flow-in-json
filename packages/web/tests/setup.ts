import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

import { afterEach, expect } from "bun:test";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

console.log("ddddd", "preload testing-library");
expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup();
});

declare module "bun:test" {
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends AsymmetricMatchersBuiltin {}
}
