import { describe, it, expect } from "vitest";

import { isArray } from "./isArray";

describe("isArray", () => {
  it("should return true for arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(["a", "b"])).toBe(true);
    expect(isArray(new Array(5))).toBe(true);
  });

  it("should return false for objects", () => {
    expect(isArray({})).toBe(false);
    expect(isArray({ length: 3 })).toBe(false);
  });

  it("should return false for strings", () => {
    expect(isArray("hello")).toBe(false);
    expect(isArray("")).toBe(false);
  });

  it("should return false for null", () => {
    expect(isArray(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isArray(undefined)).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isArray(42)).toBe(false);
  });
});
