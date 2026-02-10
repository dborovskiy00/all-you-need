import { describe, it, expect } from "vitest";

import { clamp } from "./clamp";

describe("clamp", () => {
  it("clamps a value below min to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps a value above max to max", () => {
    expect(clamp(20, 0, 10)).toBe(10);
  });

  it("returns the value when it is within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns the value when it equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns the value when it equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
