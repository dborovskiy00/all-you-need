import { describe, it, expect } from "vitest";

import { isNode } from "./isNode";

describe("isNode", () => {
  it("should return true in Node.js environment", () => {
    expect(isNode()).toBe(true);
  });

  it("should return a boolean", () => {
    expect(typeof isNode()).toBe("boolean");
  });
});
