import { describe, it, expect } from "vitest";

import { isBoolean } from "./isBoolean";

describe("isBoolean", () => {
  it("should return true for true", () => {
    expect(isBoolean(true)).toBe(true);
  });

  it("should return true for false", () => {
    expect(isBoolean(false)).toBe(true);
  });

  it("should return false for 0 and 1", () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
  });

  it('should return false for "true" and "false" strings', () => {
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean("false")).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
  });

  it("should return false for objects", () => {
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
  });
});
