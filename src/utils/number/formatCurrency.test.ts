import { describe, it, expect } from "vitest";

import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats a number as USD currency with en-US locale", () => {
    const result = formatCurrency(1234.5, "USD", "en-US");
    expect(result).toBe("$1,234.50");
  });

  it("formats zero as currency", () => {
    const result = formatCurrency(0, "USD", "en-US");
    expect(result).toBe("$0.00");
  });

  it("formats a negative number as currency", () => {
    const result = formatCurrency(-50, "USD", "en-US");
    expect(result).toBe("-$50.00");
  });
});
