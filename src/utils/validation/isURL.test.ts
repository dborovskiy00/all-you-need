import { describe, it, expect } from "vitest";

import { isURL } from "./isURL";

describe("isURL", () => {
  it("should return true for valid http URLs", () => {
    expect(isURL("http://example.com")).toBe(true);
    expect(isURL("http://www.example.com")).toBe(true);
    expect(isURL("http://example.com/path?query=value")).toBe(true);
  });

  it("should return true for valid https URLs", () => {
    expect(isURL("https://example.com")).toBe(true);
    expect(isURL("https://sub.domain.example.com")).toBe(true);
    expect(isURL("https://example.com:8080/path")).toBe(true);
  });

  it("should return true for other valid URL schemes", () => {
    expect(isURL("ftp://files.example.com")).toBe(true);
    expect(isURL("file:///home/user/file.txt")).toBe(true);
  });

  it("should return false for invalid strings", () => {
    expect(isURL("not a url")).toBe(false);
    expect(isURL("example.com")).toBe(false);
    expect(isURL("")).toBe(false);
    expect(isURL("://missing-scheme.com")).toBe(false);
  });

  it("should return false for plain words", () => {
    expect(isURL("hello")).toBe(false);
    expect(isURL("foo bar")).toBe(false);
  });
});
