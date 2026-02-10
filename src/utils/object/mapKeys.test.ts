import { describe, it, expect } from "vitest";

import { mapKeys } from "./mapKeys";

describe("mapKeys", () => {
  it("transforms keys using the provided function", () => {
    const result = mapKeys({ a: 1, b: 2 }, (key) => key.toUpperCase());
    expect(result).toEqual({ A: 1, B: 2 });
  });

  it("handles an empty object", () => {
    const result = mapKeys({}, (key) => key);
    expect(result).toEqual({});
  });

  it("can add a prefix to keys", () => {
    const result = mapKeys({ name: "Alice", age: 30 }, (key) => `user_${key}`);
    expect(result).toEqual({ user_name: "Alice", user_age: 30 });
  });

  it("handles key collisions by using the last value", () => {
    const result = mapKeys({ a: 1, b: 2 }, () => "same");
    expect(result).toEqual({ same: 2 });
  });

  it("does not mutate the original object", () => {
    const original = { a: 1, b: 2 };
    mapKeys(original, (key) => key.toUpperCase());
    expect(original).toEqual({ a: 1, b: 2 });
  });
});
