import { describe, it, expect } from "vitest";

import { zip } from "./zip";

describe("zip", () => {
  it("pairs elements from two equal-length arrays", () => {
    expect(zip([1, 2, 3], ["a", "b", "c"])).toEqual([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  });

  it("truncates to the shorter array length when first is longer", () => {
    expect(zip([1, 2, 3, 4], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("truncates to the shorter array length when second is longer", () => {
    expect(zip([1, 2], ["a", "b", "c", "d"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("returns an empty array when the first array is empty", () => {
    expect(zip([], ["a", "b"])).toEqual([]);
  });

  it("returns an empty array when the second array is empty", () => {
    expect(zip([1, 2], [])).toEqual([]);
  });

  it("returns an empty array when both arrays are empty", () => {
    expect(zip([], [])).toEqual([]);
  });

  it("handles single-element arrays", () => {
    expect(zip([1], ["a"])).toEqual([[1, "a"]]);
  });
});
