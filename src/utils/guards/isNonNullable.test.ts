import { describe, it, expect } from "vitest";

import { isNonNullable } from "./isNonNullable";

describe("isNonNullable", () => {
  it("should return false for null", () => {
    expect(isNonNullable(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isNonNullable(undefined)).toBe(false);
  });

  it("should return true for 0", () => {
    expect(isNonNullable(0)).toBe(true);
  });

  it("should return true for empty string", () => {
    expect(isNonNullable("")).toBe(true);
  });

  it("should return true for false", () => {
    expect(isNonNullable(false)).toBe(true);
  });

  it("should return true for objects", () => {
    expect(isNonNullable({})).toBe(true);
    expect(isNonNullable([])).toBe(true);
  });

  it("should return true for numbers and strings", () => {
    expect(isNonNullable(42)).toBe(true);
    expect(isNonNullable("hello")).toBe(true);
  });
});
