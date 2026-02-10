import { describe, it, expect } from "vitest";

import { isStrongPassword } from "./isStrongPassword";

describe("isStrongPassword", () => {
  it("should return true for a strong password", () => {
    expect(isStrongPassword("Abcdef1!")).toBe(true);
    expect(isStrongPassword("MyP@ssw0rd")).toBe(true);
    expect(isStrongPassword("Str0ng!Pass")).toBe(true);
  });

  it("should return false for a password that is too short", () => {
    expect(isStrongPassword("Ab1!")).toBe(false);
    expect(isStrongPassword("A1!abcd")).toBe(false);
  });

  it("should return false for a password without uppercase", () => {
    expect(isStrongPassword("abcdef1!")).toBe(false);
  });

  it("should return false for a password without lowercase", () => {
    expect(isStrongPassword("ABCDEF1!")).toBe(false);
  });

  it("should return false for a password without digits", () => {
    expect(isStrongPassword("Abcdefg!")).toBe(false);
  });

  it("should return false for a password without special characters", () => {
    expect(isStrongPassword("Abcdefg1")).toBe(false);
  });

  it("should respect custom minLength option", () => {
    expect(isStrongPassword("Ab1!", { minLength: 4 })).toBe(true);
    expect(isStrongPassword("Ab1!", { minLength: 5 })).toBe(false);
  });

  it("should allow disabling specific requirements", () => {
    expect(isStrongPassword("abcdefgh", { uppercase: false, digits: false, special: false })).toBe(true);
    expect(isStrongPassword("ABCDEFGH", { lowercase: false, digits: false, special: false })).toBe(true);
    expect(isStrongPassword("12345678", { lowercase: false, uppercase: false, special: false })).toBe(true);
    expect(isStrongPassword("!@#$%^&*", { lowercase: false, uppercase: false, digits: false })).toBe(true);
  });
});
