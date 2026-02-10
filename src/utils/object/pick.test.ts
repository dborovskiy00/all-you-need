import { describe, it, expect } from "vitest";

import { pick } from "./pick";

describe("pick", () => {
  it("picks a subset of keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("ignores keys that do not exist on the object", () => {
    const obj = { a: 1, b: 2 } as Record<string, unknown>;
    expect(pick(obj, ["a", "z"])).toEqual({ a: 1 });
  });

  it("returns an empty object when keys array is empty", () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, [])).toEqual({});
  });
});
