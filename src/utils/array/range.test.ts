import { describe, it, expect } from "vitest";

import { range } from "./range";

describe("range", () => {
  it("generates a basic range", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("generates a range with a custom step", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it("generates a range with a negative step", () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
  });

  it("throws when step is 0", () => {
    expect(() => range(0, 5, 0)).toThrow(RangeError);
  });
});
