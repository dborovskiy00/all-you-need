import { describe, it, expect } from "vitest";

import { uniqueBy } from "./uniqueBy";

describe("uniqueBy", () => {
  it("removes objects with duplicate keys", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    expect(uniqueBy(items, (item) => item.id)).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
  });

  it("returns all items when all keys are unique", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ];
    expect(uniqueBy(items, (item) => item.id)).toEqual(items);
  });

  it("returns an empty array for empty input", () => {
    expect(uniqueBy([], (item) => item)).toEqual([]);
  });
});
