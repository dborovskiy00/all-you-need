import { describe, it, expect } from "vitest";

import { percentage } from "./percentage";

describe("percentage", () => {
  it("calculates a basic percentage", () => {
    expect(percentage(25, 100)).toBe(25);
  });

  it("returns 100 when value equals total", () => {
    expect(percentage(50, 50)).toBe(100);
  });

  it("returns 0 when value is 0", () => {
    expect(percentage(0, 100)).toBe(0);
  });

  it("returns 0 when total is 0", () => {
    expect(percentage(50, 0)).toBe(0);
  });

  it("handles percentages greater than 100", () => {
    expect(percentage(200, 100)).toBe(200);
  });

  it("handles decimal results", () => {
    expect(percentage(1, 3)).toBeCloseTo(33.3333);
  });

  it("handles negative values", () => {
    expect(percentage(-25, 100)).toBe(-25);
  });
});
