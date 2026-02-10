import { describe, it, expect } from "vitest";

import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("capitalizes a normal string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("returns an already capitalized string unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("capitalizes a single character", () => {
    expect(capitalize("a")).toBe("A");
  });
});
