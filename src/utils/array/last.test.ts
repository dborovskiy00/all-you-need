import { describe, it, expect } from "vitest";

import { last } from "./last";

describe("last", () => {
  it("returns the last element of an array", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it("returns undefined for an empty array", () => {
    expect(last([])).toBeUndefined();
  });
});
