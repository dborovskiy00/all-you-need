import { describe, it, expect } from "vitest";

import { isEmpty } from "./isEmpty";

describe("isEmpty", () => {
  it("returns true for null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("returns true for undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it("returns true for an empty string", () => {
    expect(isEmpty("")).toBe(true);
  });

  it("returns true for a whitespace-only string", () => {
    expect(isEmpty("   ")).toBe(true);
  });

  it("returns true for an empty array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("returns true for an empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("returns false for a non-empty string", () => {
    expect(isEmpty("hello")).toBe(false);
  });

  it("returns false for a non-empty array", () => {
    expect(isEmpty([1])).toBe(false);
  });

  it("returns false for a non-empty object", () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it("returns false for the number 0", () => {
    expect(isEmpty(0)).toBe(false);
  });
});
