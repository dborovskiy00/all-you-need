import { describe, it, expect } from "vitest";

import { difference } from "./difference";

describe("difference", () => {
  it("returns elements in first array not in second", () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
  });

  it("returns all elements when second array is empty", () => {
    expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
  });

  it("returns an empty array when first array is empty", () => {
    expect(difference([], [1, 2, 3])).toEqual([]);
  });

  it("returns an empty array when both arrays are empty", () => {
    expect(difference([], [])).toEqual([]);
  });

  it("returns an empty array when all elements are in second array", () => {
    expect(difference([1, 2], [1, 2, 3])).toEqual([]);
  });

  it("handles duplicate elements in first array", () => {
    expect(difference([1, 1, 2, 3], [1])).toEqual([2, 3]);
  });

  it("works with string arrays", () => {
    expect(difference(["a", "b", "c"], ["b"])).toEqual(["a", "c"]);
  });
});
