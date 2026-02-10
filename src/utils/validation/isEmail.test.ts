import { describe, it, expect } from "vitest";

import { isEmail } from "./isEmail";

describe("isEmail", () => {
  it("should return true for valid emails", () => {
    expect(isEmail("user@example.com")).toBe(true);
    expect(isEmail("test.name@domain.org")).toBe(true);
    expect(isEmail("user+tag@example.co.uk")).toBe(true);
    expect(isEmail("firstname.lastname@company.com")).toBe(true);
    expect(isEmail("email@subdomain.domain.com")).toBe(true);
    expect(isEmail("1234567890@example.com")).toBe(true);
  });

  it("should return false for emails without @", () => {
    expect(isEmail("userexample.com")).toBe(false);
    expect(isEmail("plaintext")).toBe(false);
  });

  it("should return false for emails without domain", () => {
    expect(isEmail("user@")).toBe(false);
    expect(isEmail("@domain.com")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isEmail("")).toBe(false);
  });

  it("should return false for emails with spaces", () => {
    expect(isEmail("user @example.com")).toBe(false);
    expect(isEmail("user@ example.com")).toBe(false);
  });

  it("should return false for emails with multiple @", () => {
    expect(isEmail("user@@example.com")).toBe(false);
    expect(isEmail("user@name@example.com")).toBe(false);
  });
});
