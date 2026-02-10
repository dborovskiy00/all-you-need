import { describe, it, expect } from "vitest";

import { flatten } from "./flatten";

describe("flatten", () => {
  it("flattens a nested array one level deep", () => {
    expect(flatten<number>([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
  });

  it("flattens deeply nested arrays", () => {
    expect(flatten<number>([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns the same elements for a flat array", () => {
    expect(flatten<number>([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("returns an empty array for an empty input", () => {
    expect(flatten([])).toEqual([]);
  });

  it("handles mixed nested and flat elements", () => {
    expect(flatten<number>([1, [2, 3], 4, [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it("works with string arrays", () => {
    expect(flatten<string>([["a", "b"], ["c"]])).toEqual(["a", "b", "c"]);
  });

  it("handles arrays with empty sub-arrays", () => {
    expect(flatten<number>([[], [1], [], [2], []])).toEqual([1, 2]);
  });
});
