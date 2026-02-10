import { describe, it, expect } from "vitest";

import { first } from "./first";

describe("first", () => {
  it("returns the first element of an array", () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  it("returns undefined for an empty array", () => {
    expect(first([])).toBeUndefined();
  });
});
