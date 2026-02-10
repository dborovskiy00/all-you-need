import { describe, it, expect } from "vitest";

import { randomInt } from "./randomInt";

describe("randomInt", () => {
  it("returns a value within the given range (run multiple times)", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  it("returns the only possible value when min equals max", () => {
    expect(randomInt(7, 7)).toBe(7);
  });

  it("always returns an integer", () => {
    for (let i = 0; i < 50; i++) {
      const result = randomInt(1, 100);
      expect(Number.isInteger(result)).toBe(true);
    }
  });
});
