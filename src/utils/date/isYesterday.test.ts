import { describe, it, expect } from "vitest";

import { isYesterday } from "./isYesterday";

describe("isYesterday", () => {
  it("returns true for yesterday's date", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isYesterday(yesterday)).toBe(true);
  });

  it("returns false for today", () => {
    expect(isYesterday(new Date())).toBe(false);
  });
});
