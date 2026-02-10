import { describe, it, expect } from "vitest";

import { average } from "./average";

describe("average", () => {
  it("returns the arithmetic mean", () => {
    expect(average([2, 4, 6])).toBe(4);
  });

  it("returns 0 for an empty array", () => {
    expect(average([])).toBe(0);
  });

  it("handles a single element", () => {
    expect(average([7])).toBe(7);
  });

  it("handles decimal results", () => {
    expect(average([1, 2])).toBe(1.5);
  });

  it("handles negative numbers", () => {
    expect(average([-4, -2, 0, 2, 4])).toBe(0);
  });
});
