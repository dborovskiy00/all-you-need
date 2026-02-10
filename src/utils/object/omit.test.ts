import { describe, it, expect } from "vitest";

import { omit } from "./omit";

describe("omit", () => {
  it("omits the specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
  });

  it("ignores keys that do not exist on the object", () => {
    const obj = { a: 1, b: 2 } as Record<string, unknown>;
    expect(omit(obj, ["z" as keyof typeof obj])).toEqual({ a: 1, b: 2 });
  });

  it("returns an empty object when all keys are omitted", () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, ["a", "b"])).toEqual({});
  });
});
