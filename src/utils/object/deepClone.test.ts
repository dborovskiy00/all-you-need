import { describe, it, expect } from "vitest";

import { deepClone } from "./deepClone";

describe("deepClone", () => {
  it("deeply clones a nested object so mutations do not affect the original", () => {
    const original = { a: 1, nested: { b: 2 } };
    const clone = deepClone(original);
    clone.nested.b = 99;
    expect(original.nested.b).toBe(2);
  });

  it("deeply clones arrays inside objects", () => {
    const original = { items: [1, 2, 3] };
    const clone = deepClone(original);
    clone.items.push(4);
    expect(original.items).toEqual([1, 2, 3]);
  });
});
