import { describe, it, expect } from "vitest";

import { isINN } from "./isINN";

describe("isINN", () => {
  it("should return true for a valid 10-digit INN (Sberbank)", () => {
    expect(isINN("7707083893")).toBe(true);
  });

  it("should return true for a valid 12-digit INN", () => {
    expect(isINN("500100732259")).toBe(true);
  });

  it("should return false for a 10-digit INN with wrong checksum", () => {
    expect(isINN("7707083890")).toBe(false);
    expect(isINN("1234567890")).toBe(false);
  });

  it("should return false for a 12-digit INN with wrong checksum", () => {
    expect(isINN("500100732250")).toBe(false);
    expect(isINN("123456789012")).toBe(false);
  });

  it("should return false for wrong length", () => {
    expect(isINN("12345")).toBe(false);
    expect(isINN("123456789")).toBe(false);
    expect(isINN("12345678901")).toBe(false);
    expect(isINN("1234567890123")).toBe(false);
  });

  it("should return false for non-digit strings", () => {
    expect(isINN("abcdefghij")).toBe(false);
    expect(isINN("770708389a")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isINN("")).toBe(false);
  });
});
