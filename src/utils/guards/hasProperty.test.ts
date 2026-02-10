import { describe, it, expect } from "vitest";

import { hasProperty } from "./hasProperty";

describe("hasProperty", () => {
  it("should return true when the object has the property", () => {
    expect(hasProperty({ name: "Alice" }, "name")).toBe(true);
    expect(hasProperty({ age: 30 }, "age")).toBe(true);
    expect(hasProperty({ key: undefined }, "key")).toBe(true);
  });

  it("should return false when the object does not have the property", () => {
    expect(hasProperty({ name: "Alice" }, "age")).toBe(false);
    expect(hasProperty({}, "key")).toBe(false);
  });

  it("should return false for null input", () => {
    expect(hasProperty(null, "key")).toBe(false);
  });

  it("should return false for undefined input", () => {
    expect(hasProperty(undefined, "key")).toBe(false);
  });

  it("should return false for primitive inputs", () => {
    expect(hasProperty(42, "key")).toBe(false);
    expect(hasProperty("string", "key")).toBe(false);
    expect(hasProperty(true, "key")).toBe(false);
  });

  it("should detect inherited properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    expect(hasProperty(child, "inherited")).toBe(true);
  });
});
