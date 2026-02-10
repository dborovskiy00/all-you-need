import { describe, it, expect } from "vitest";

import { daysBetween } from "./daysBetween";

describe("daysBetween", () => {
  it("returns 0 for the same day", () => {
    const date = new Date(2024, 0, 15);
    expect(daysBetween(date, date)).toBe(0);
  });

  it("returns 1 for adjacent days", () => {
    const a = new Date(2024, 0, 15);
    const b = new Date(2024, 0, 16);
    expect(daysBetween(a, b)).toBe(1);
  });

  it("returns the same result regardless of argument order", () => {
    const a = new Date(2024, 0, 1);
    const b = new Date(2024, 0, 31);
    expect(daysBetween(a, b)).toBe(30);
    expect(daysBetween(b, a)).toBe(30);
  });
});
