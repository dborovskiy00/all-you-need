import { describe, it, expect } from "vitest";

import { groupBy } from "./groupBy";

describe("groupBy", () => {
  it("groups objects by a property", () => {
    const items = [
      { type: "fruit", name: "apple" },
      { type: "veggie", name: "carrot" },
      { type: "fruit", name: "banana" },
    ];
    expect(groupBy(items, (item) => item.type)).toEqual({
      fruit: [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
      ],
      veggie: [{ type: "veggie", name: "carrot" }],
    });
  });

  it("returns an empty object for empty input", () => {
    expect(groupBy([], (item) => item)).toEqual({});
  });
});
