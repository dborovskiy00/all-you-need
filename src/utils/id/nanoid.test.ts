import { describe, it, expect } from "vitest";

import { nanoid } from "./nanoid";

const VALID_CHARS = /^[A-Za-z0-9_-]+$/;

describe("nanoid", () => {
  it("should generate an ID with default length of 21", () => {
    const id = nanoid();
    expect(id).toHaveLength(21);
  });

  it("should generate an ID with custom length", () => {
    const id = nanoid(10);
    expect(id).toHaveLength(10);
  });

  it("should only contain URL-safe characters", () => {
    const id = nanoid(100);
    expect(id).toMatch(VALID_CHARS);
  });

  it("should generate different IDs on subsequent calls", () => {
    const id1 = nanoid();
    const id2 = nanoid();
    expect(id1).not.toBe(id2);
  });

  it("should handle size of 1", () => {
    const id = nanoid(1);
    expect(id).toHaveLength(1);
    expect(id).toMatch(VALID_CHARS);
  });

  it("should handle large sizes", () => {
    const id = nanoid(256);
    expect(id).toHaveLength(256);
    expect(id).toMatch(VALID_CHARS);
  });
});
