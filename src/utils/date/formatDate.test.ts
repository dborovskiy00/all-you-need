import { describe, it, expect } from "vitest";

import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a known date with en-US locale", () => {
    const date = new Date(2024, 0, 15);
    const result = formatDate(
      date,
      { day: "2-digit", month: "2-digit", year: "numeric" },
      "en-US",
    );
    expect(result).toBe("01/15/2024");
  });

  it("formats with custom options", () => {
    const date = new Date(2024, 11, 25);
    const result = formatDate(
      date,
      { month: "long", year: "numeric" },
      "en-US",
    );
    expect(result).toBe("December 2024");
  });
});
