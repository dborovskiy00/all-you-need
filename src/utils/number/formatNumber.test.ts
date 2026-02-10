import { describe, it, expect } from "vitest";

import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("formats a number with en-US locale separators", () => {
    expect(formatNumber(1234567.89, "en-US")).toBe("1,234,567.89");
  });

  it("formats zero", () => {
    expect(formatNumber(0, "en-US")).toBe("0");
  });

  it("formats a negative number", () => {
    expect(formatNumber(-9999, "en-US")).toBe("-9,999");
  });
});
