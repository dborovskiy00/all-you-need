import { describe, it, expect } from "vitest";

import { isSSR } from "./isSSR";

describe("isSSR", () => {
  it("should return true in Node.js environment without browser globals", () => {
    expect(isSSR()).toBe(true);
  });

  it("should return a boolean", () => {
    expect(typeof isSSR()).toBe("boolean");
  });
});
