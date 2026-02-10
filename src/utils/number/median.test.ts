import { describe, it, expect } from "vitest";

import { median } from "./median";

describe("median", () => {
  it("returns the middle value for an odd-length array", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("returns the average of two middle values for an even-length array", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it("returns 0 for an empty array", () => {
    expect(median([])).toBe(0);
  });

  it("returns the single element for a one-element array", () => {
    expect(median([42])).toBe(42);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 1, 2];
    const original = [...arr];

    median(arr);

    expect(arr).toEqual(original);
  });

  it("handles already sorted arrays", () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
  });

  it("handles negative numbers", () => {
    expect(median([-5, -1, -3])).toBe(-3);
  });

  it("handles two elements", () => {
    expect(median([10, 20])).toBe(15);
  });
});
