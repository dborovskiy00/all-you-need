import { describe, it, expect } from "vitest";

import { sum } from "./sum";

describe("sum", () => {
  it("returns the sum of all elements", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("returns 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });

  it("handles a single element", () => {
    expect(sum([5])).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(sum([-1, -2, -3])).toBe(-6);
  });

  it("handles mixed positive and negative numbers", () => {
    expect(sum([10, -5, 3, -2])).toBe(6);
  });

  it("handles decimal numbers", () => {
    expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
  });
});
