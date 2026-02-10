import { describe, it, expect } from "vitest";

import { maskString } from "./maskString";

describe("maskString", () => {
  it("masks a card number with 4 visible start and 4 visible end", () => {
    expect(maskString("4111111111111111", 4, 4)).toBe("4111********1111");
  });

  it("fully masks a string when no visible parts specified", () => {
    expect(maskString("secret")).toBe("******");
  });

  it("returns original string when it is shorter than visible parts", () => {
    expect(maskString("hi", 4, 4)).toBe("hi");
  });

  it("uses a custom mask character", () => {
    expect(maskString("4111111111111111", 4, 4, "#")).toBe("4111########1111");
  });
});
