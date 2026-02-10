import { describe, it, expect } from "vitest";

import { truncate } from "./truncate";

describe("truncate", () => {
  it("does not truncate a string shorter than maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("does not truncate a string of exact maxLength", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates a longer string with default suffix", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  it("truncates with a custom suffix", () => {
    expect(truncate("hello world", 7, "…")).toBe("hello …");
  });
});
