import { describe, it, expect } from "vitest";

import { addDays } from "./addDays";

describe("addDays", () => {
  it("adds positive days", () => {
    const date = new Date(2024, 0, 1);
    const result = addDays(date, 10);
    expect(result.getDate()).toBe(11);
    expect(result.getMonth()).toBe(0);
  });

  it("adds negative days", () => {
    const date = new Date(2024, 0, 15);
    const result = addDays(date, -5);
    expect(result.getDate()).toBe(10);
  });

  it("does not mutate the original date", () => {
    const date = new Date(2024, 0, 1);
    addDays(date, 5);
    expect(date.getDate()).toBe(1);
  });
});
