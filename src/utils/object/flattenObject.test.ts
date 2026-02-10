import { describe, it, expect } from "vitest";

import { flattenObject } from "./flattenObject";

describe("flattenObject", () => {
  it("flattens a simple nested object", () => {
    expect(flattenObject({ a: { b: 1 } })).toEqual({ "a.b": 1 });
  });

  it("flattens deeply nested objects", () => {
    expect(flattenObject({ a: { b: { c: { d: 42 } } } })).toEqual({
      "a.b.c.d": 42,
    });
  });

  it("handles multiple keys at each level", () => {
    expect(flattenObject({ a: { b: 1, c: 2 }, d: 3 })).toEqual({
      "a.b": 1,
      "a.c": 2,
      d: 3,
    });
  });

  it("does not flatten arrays", () => {
    expect(flattenObject({ a: { b: [1, 2, 3] } })).toEqual({
      "a.b": [1, 2, 3],
    });
  });

  it("handles an empty object", () => {
    expect(flattenObject({})).toEqual({});
  });

  it("handles flat objects without nesting", () => {
    expect(flattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("uses a custom separator", () => {
    expect(flattenObject({ a: { b: 1 } }, "", "/")).toEqual({ "a/b": 1 });
  });

  it("uses a custom prefix", () => {
    expect(flattenObject({ a: 1 }, "root")).toEqual({ "root.a": 1 });
  });

  it("handles null values", () => {
    expect(flattenObject({ a: { b: null } })).toEqual({ "a.b": null });
  });

  it("does not flatten Date objects", () => {
    const date = new Date("2024-01-01");
    expect(flattenObject({ a: { b: date } })).toEqual({ "a.b": date });
  });
});
