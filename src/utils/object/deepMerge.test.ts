import { describe, it, expect } from "vitest";

import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it("performs a shallow merge", () => {
    const result = deepMerge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("performs a deep nested merge", () => {
    const target = { nested: { a: 1, b: 2 } };
    const source = { nested: { b: 99, c: 3 } };
    const result = deepMerge(target, source);
    expect(result).toEqual({ nested: { a: 1, b: 99, c: 3 } });
  });

  it("overwrites arrays instead of merging them", () => {
    const target = { items: [1, 2, 3] };
    const source = { items: [4, 5] };
    const result = deepMerge(target, source);
    expect(result).toEqual({ items: [4, 5] });
  });

  it("source values override target values", () => {
    const result = deepMerge({ a: 1 }, { a: 42 });
    expect(result.a).toBe(42);
  });
});
