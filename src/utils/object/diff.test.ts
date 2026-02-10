import { describe, it, expect } from "vitest";

import { diff } from "./diff";

describe("diff", () => {
  it("returns changed values", () => {
    expect(diff({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual({ b: 3 });
  });

  it("returns an empty object when nothing changed", () => {
    expect(diff({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual({});
  });

  it("includes keys present in changed but not in original", () => {
    expect(diff({ a: 1 } as Record<string, unknown>, { a: 1, b: 2 })).toEqual({
      b: 2,
    });
  });

  it("does not include keys only in original", () => {
    expect(diff({ a: 1, b: 2 }, { a: 1 } as Record<string, unknown>)).toEqual(
      {},
    );
  });

  it("detects multiple changes", () => {
    expect(diff({ a: 1, b: 2, c: 3 }, { a: 10, b: 2, c: 30 })).toEqual({
      a: 10,
      c: 30,
    });
  });

  it("uses shallow comparison for objects", () => {
    const obj = { x: 1 };
    expect(diff({ a: obj }, { a: obj })).toEqual({});
    expect(diff({ a: { x: 1 } }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
  });

  it("handles empty objects", () => {
    expect(diff({}, {})).toEqual({});
  });

  it("handles all new keys", () => {
    expect(
      diff({} as Record<string, unknown>, { a: 1, b: 2 }),
    ).toEqual({ a: 1, b: 2 });
  });
});
