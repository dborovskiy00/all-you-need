import { describe, it, expect } from "vitest";

import { sortBy } from "./sortBy";

describe("sortBy", () => {
  it("sorts objects by a numeric key", () => {
    const items = [{ age: 30 }, { age: 10 }, { age: 20 }];

    expect(sortBy(items, (i) => i.age)).toEqual([
      { age: 10 },
      { age: 20 },
      { age: 30 },
    ]);
  });

  it("sorts objects by a string key", () => {
    const items = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];

    expect(sortBy(items, (i) => i.name)).toEqual([
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ]);
  });

  it("does not mutate the original array", () => {
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
    const original = [...items];

    sortBy(items, (i) => i.v);

    expect(items).toEqual(original);
  });

  it("returns an empty array when given an empty array", () => {
    expect(sortBy([], () => 0)).toEqual([]);
  });

  it("handles a single-element array", () => {
    const items = [{ v: 1 }];

    expect(sortBy(items, (i) => i.v)).toEqual([{ v: 1 }]);
  });

  it("handles equal keys by preserving relative order", () => {
    const items = [
      { id: 1, group: "a" },
      { id: 2, group: "a" },
      { id: 3, group: "a" },
    ];
    const result = sortBy(items, (i) => i.group);

    expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it("sorts numbers in ascending order", () => {
    expect(sortBy([5, 3, 1, 4, 2], (n) => n)).toEqual([1, 2, 3, 4, 5]);
  });
});
