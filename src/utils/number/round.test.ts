import { describe, it, expect } from "vitest";

import { round } from "./round";

describe("round", () => {
  it("rounds to 0 decimal places by default", () => {
    expect(round(3.7)).toBe(4);
    expect(round(3.2)).toBe(3);
  });

  it("rounds to 2 decimal places", () => {
    expect(round(3.456, 2)).toBe(3.46);
    expect(round(1.001, 2)).toBe(1);
  });

  it("rounds negative numbers correctly", () => {
    expect(round(-2.5)).toBe(-2);
    expect(round(-2.55, 1)).toBe(-2.5);
  });
});
