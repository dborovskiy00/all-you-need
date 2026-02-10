import { describe, it, expect } from "vitest";

import { unique } from "./unique";

describe("unique", () => {
  it("removes duplicate values", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it("returns an already unique array unchanged", () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("returns an empty array for empty input", () => {
    expect(unique([])).toEqual([]);
  });
});
