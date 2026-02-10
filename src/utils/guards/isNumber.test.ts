import { describe, it, expect } from "vitest";

import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it("should return true for finite numbers", () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-3.14)).toBe(true);
    expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("should return false for NaN", () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it("should return false for Infinity", () => {
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(-Infinity)).toBe(false);
  });

  it("should return false for strings", () => {
    expect(isNumber("42")).toBe(false);
    expect(isNumber("")).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });

  it("should return false for booleans", () => {
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
  });
});
