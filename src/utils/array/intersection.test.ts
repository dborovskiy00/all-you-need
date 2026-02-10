import { describe, it, expect } from "vitest";

import { intersection } from "./intersection";

describe("intersection", () => {
  it("returns common elements from both arrays", () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });

  it("returns an empty array when there are no common elements", () => {
    expect(intersection([1, 2], [3, 4])).toEqual([]);
  });

  it("returns an empty array when the first array is empty", () => {
    expect(intersection([], [1, 2, 3])).toEqual([]);
  });

  it("returns an empty array when the second array is empty", () => {
    expect(intersection([1, 2, 3], [])).toEqual([]);
  });

  it("returns an empty array when both arrays are empty", () => {
    expect(intersection([], [])).toEqual([]);
  });

  it("handles duplicate elements in the first array", () => {
    expect(intersection([1, 1, 2, 2], [1, 2])).toEqual([1, 1, 2, 2]);
  });

  it("works with string arrays", () => {
    expect(intersection(["a", "b", "c"], ["b", "c", "d"])).toEqual(["b", "c"]);
  });

  it("returns all elements when arrays are identical", () => {
    expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
  });
});
