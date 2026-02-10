import { describe, it, expect } from "vitest";

import { isString } from "./isString";

describe("isString", () => {
  it("should return true for strings", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString(String("test"))).toBe(true);
  });

  it("should return false for numbers", () => {
    expect(isString(42)).toBe(false);
    expect(isString(0)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isString(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isString(undefined)).toBe(false);
  });

  it("should return false for objects", () => {
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
  });

  it("should return false for booleans", () => {
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
  });
});
