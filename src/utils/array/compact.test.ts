import { describe, it, expect } from "vitest";

import { compact } from "./compact";

describe("compact", () => {
  it("removes null values", () => {
    expect(compact([1, null, 2, null, 3])).toEqual([1, 2, 3]);
  });

  it("removes undefined values", () => {
    expect(compact([1, undefined, 2, undefined])).toEqual([1, 2]);
  });

  it("removes false values", () => {
    expect(compact([1, false, 2, false])).toEqual([1, 2]);
  });

  it("removes 0 values", () => {
    expect(compact([1, 0, 2, 0])).toEqual([1, 2]);
  });

  it("removes empty string values", () => {
    expect(compact(["a", "", "b", ""])).toEqual(["a", "b"]);
  });

  it("removes all falsy values at once", () => {
    expect(compact([1, null, undefined, false, 0, "", 2])).toEqual([1, 2]);
  });

  it("returns an empty array when given an empty array", () => {
    expect(compact([])).toEqual([]);
  });

  it("returns an empty array when all values are falsy", () => {
    expect(compact([null, undefined, false, 0, ""])).toEqual([]);
  });

  it("returns the same elements when no falsy values exist", () => {
    expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
