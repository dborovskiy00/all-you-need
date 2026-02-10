import { describe, it, expect } from "vitest";

import { addMonths } from "./addMonths";

describe("addMonths", () => {
  it("adds positive months", () => {
    const date = new Date(2024, 0, 15);
    const result = addMonths(date, 3);
    expect(result.getMonth()).toBe(3);
    expect(result.getFullYear()).toBe(2024);
  });

  it("adds negative months", () => {
    const date = new Date(2024, 5, 15);
    const result = addMonths(date, -2);
    expect(result.getMonth()).toBe(3);
  });

  it("does not mutate the original date", () => {
    const date = new Date(2024, 0, 15);
    addMonths(date, 6);
    expect(date.getMonth()).toBe(0);
  });
});
