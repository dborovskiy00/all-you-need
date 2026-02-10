import { describe, it, expect } from "vitest";

import { uuid } from "./uuid";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("uuid", () => {
  it("should match UUID v4 format", () => {
    const id = uuid();
    expect(id).toMatch(UUID_V4_REGEX);
  });

  it("should have version digit 4", () => {
    const id = uuid();
    expect(id[14]).toBe("4");
  });

  it("should have correct variant bits", () => {
    const id = uuid();
    const variantChar = id[19];
    expect(["8", "9", "a", "b"]).toContain(variantChar);
  });

  it("should generate unique UUIDs", () => {
    const id1 = uuid();
    const id2 = uuid();
    expect(id1).not.toBe(id2);
  });

  it("should have correct length of 36 characters", () => {
    const id = uuid();
    expect(id).toHaveLength(36);
  });

  it("should have hyphens at correct positions", () => {
    const id = uuid();
    expect(id[8]).toBe("-");
    expect(id[13]).toBe("-");
    expect(id[18]).toBe("-");
    expect(id[23]).toBe("-");
  });
});
