import { describe, it, expect } from "vitest";

import { isPhone } from "./isPhone";

describe("isPhone", () => {
  it("should return true for valid phone numbers", () => {
    expect(isPhone("+79991234567")).toBe(true);
    expect(isPhone("+7 (999) 123-45-67")).toBe(true);
    expect(isPhone("+1 555 123 4567")).toBe(true);
    expect(isPhone("8 (800) 555-35-35")).toBe(true);
    expect(isPhone("+44 20 7946 0958")).toBe(true);
  });

  it("should return false for numbers that are too short", () => {
    expect(isPhone("+123")).toBe(false);
    expect(isPhone("12345")).toBe(false);
  });

  it("should return false for strings with letters", () => {
    expect(isPhone("+7abc1234567")).toBe(false);
    expect(isPhone("phone123")).toBe(false);
    expect(isPhone("not-a-phone")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isPhone("")).toBe(false);
  });

  it("should return false for numbers that are too long", () => {
    expect(isPhone("+12345678901234567890")).toBe(false);
  });
});
