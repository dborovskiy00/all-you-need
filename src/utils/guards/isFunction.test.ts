import { describe, it, expect } from "vitest";

import { isFunction } from "./isFunction";

describe("isFunction", () => {
  it("should return true for regular functions", () => {
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(function named() {})).toBe(true);
  });

  it("should return true for arrow functions", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction((x: number) => x * 2)).toBe(true);
  });

  it("should return true for built-in functions", () => {
    expect(isFunction(Math.round)).toBe(true);
    expect(isFunction(parseInt)).toBe(true);
  });

  it("should return false for objects", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });

  it("should return false for strings", () => {
    expect(isFunction("function")).toBe(false);
    expect(isFunction("")).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
  });

  it("should return false for numbers", () => {
    expect(isFunction(42)).toBe(false);
  });
});
