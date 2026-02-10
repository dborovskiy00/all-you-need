import { describe, it, expect } from "vitest";

import { deepEqual } from "./deepEqual";

describe("deepEqual", () => {
  it("compares equal primitives", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it("compares unequal primitives", () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "b")).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
  });

  it("handles null and undefined", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(null, 0)).toBe(false);
    expect(deepEqual(undefined, "")).toBe(false);
  });

  it("compares simple objects", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  it("compares deeply nested objects", () => {
    const a = { x: { y: { z: 1 } } };
    const b = { x: { y: { z: 1 } } };
    const c = { x: { y: { z: 2 } } };
    expect(deepEqual(a, b)).toBe(true);
    expect(deepEqual(a, c)).toBe(false);
  });

  it("compares objects with different keys", () => {
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("compares arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("respects array order", () => {
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
  });

  it("compares nested arrays", () => {
    expect(deepEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
    expect(deepEqual([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
  });

  it("compares Date objects", () => {
    const d1 = new Date("2024-01-01");
    const d2 = new Date("2024-01-01");
    const d3 = new Date("2024-06-01");
    expect(deepEqual(d1, d2)).toBe(true);
    expect(deepEqual(d1, d3)).toBe(false);
  });

  it("compares RegExp objects", () => {
    expect(deepEqual(/abc/gi, /abc/gi)).toBe(true);
    expect(deepEqual(/abc/g, /abc/i)).toBe(false);
    expect(deepEqual(/abc/, /def/)).toBe(false);
  });

  it("handles mixed types", () => {
    expect(deepEqual(1, "1")).toBe(false);
    expect(deepEqual([], {})).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
  });

  it("compares complex nested structures", () => {
    const a = {
      users: [
        { name: "Alice", tags: ["admin"], meta: { joined: new Date("2024-01-01") } },
      ],
      count: 1,
    };
    const b = {
      users: [
        { name: "Alice", tags: ["admin"], meta: { joined: new Date("2024-01-01") } },
      ],
      count: 1,
    };
    const c = {
      users: [
        { name: "Alice", tags: ["user"], meta: { joined: new Date("2024-01-01") } },
      ],
      count: 1,
    };
    expect(deepEqual(a, b)).toBe(true);
    expect(deepEqual(a, c)).toBe(false);
  });

  it("handles empty objects and arrays", () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual({}, [])).toBe(false);
  });
});
