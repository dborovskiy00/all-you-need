import { describe, it, expect } from "vitest";

import { template } from "./template";

describe("template", () => {
  it("replaces a single placeholder", () => {
    expect(template("Hello, {name}!", { name: "World" })).toBe(
      "Hello, World!",
    );
  });

  it("replaces multiple placeholders", () => {
    expect(
      template("{greeting}, {name}!", { greeting: "Hi", name: "Alice" }),
    ).toBe("Hi, Alice!");
  });

  it("replaces numeric values", () => {
    expect(template("Count: {count}", { count: 42 })).toBe("Count: 42");
  });

  it("leaves unmatched placeholders as-is", () => {
    expect(template("{a} and {b}", { a: "yes" })).toBe("yes and {b}");
  });

  it("handles no placeholders in the string", () => {
    expect(template("no placeholders", { key: "value" })).toBe(
      "no placeholders",
    );
  });

  it("handles empty data object", () => {
    expect(template("{key}", {})).toBe("{key}");
  });

  it("handles empty string", () => {
    expect(template("", { key: "value" })).toBe("");
  });

  it("replaces the same placeholder multiple times", () => {
    expect(template("{x} + {x} = {y}", { x: "1", y: "2" })).toBe(
      "1 + 1 = 2",
    );
  });
});
