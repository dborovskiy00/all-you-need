import { describe, it, expect } from "vitest";

import { mapValues } from "./mapValues";

describe("mapValues", () => {
  it("transforms values using the provided function", () => {
    const result = mapValues({ a: 1, b: 2 }, (value) => (value as number) * 2);
    expect(result).toEqual({ a: 2, b: 4 });
  });

  it("handles an empty object", () => {
    const result = mapValues({}, (value) => value);
    expect(result).toEqual({});
  });

  it("provides key as second argument", () => {
    const result = mapValues({ x: 1, y: 2 }, (value, key) => `${key}=${value}`);
    expect(result).toEqual({ x: "x=1", y: "y=2" });
  });

  it("can change value types", () => {
    const result = mapValues({ a: 1, b: 2 }, (value) => String(value));
    expect(result).toEqual({ a: "1", b: "2" });
  });

  it("does not mutate the original object", () => {
    const original = { a: 1, b: 2 };
    mapValues(original, (value) => (value as number) * 10);
    expect(original).toEqual({ a: 1, b: 2 });
  });
});
