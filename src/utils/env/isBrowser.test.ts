import { describe, it, expect } from "vitest";

import { isBrowser } from "./isBrowser";

describe("isBrowser", () => {
  it("should return false in Node.js environment", () => {
    expect(isBrowser()).toBe(false);
  });

  it("should return a boolean", () => {
    expect(typeof isBrowser()).toBe("boolean");
  });
});
