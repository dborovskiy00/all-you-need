import { describe, it, expect } from "vitest";

import { escapeRegExp } from "./escapeRegExp";

describe("escapeRegExp", () => {
  it("escapes backslash", () => {
    expect(escapeRegExp("a\\b")).toBe("a\\\\b");
  });

  it("escapes caret and dollar", () => {
    expect(escapeRegExp("^start$")).toBe("\\^start\\$");
  });

  it("escapes dot and asterisk", () => {
    expect(escapeRegExp("file.*")).toBe("file\\.\\*");
  });

  it("escapes plus and question mark", () => {
    expect(escapeRegExp("a+b?")).toBe("a\\+b\\?");
  });

  it("escapes parentheses", () => {
    expect(escapeRegExp("(group)")).toBe("\\(group\\)");
  });

  it("escapes square brackets", () => {
    expect(escapeRegExp("[abc]")).toBe("\\[abc\\]");
  });

  it("escapes curly braces", () => {
    expect(escapeRegExp("{1,3}")).toBe("\\{1,3\\}");
  });

  it("escapes pipe", () => {
    expect(escapeRegExp("a|b")).toBe("a\\|b");
  });

  it("escapes all special characters together", () => {
    expect(escapeRegExp("\\^$.*+?()[]{}|")).toBe(
      "\\\\\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|",
    );
  });

  it("returns an empty string unchanged", () => {
    expect(escapeRegExp("")).toBe("");
  });

  it("returns a normal string unchanged", () => {
    expect(escapeRegExp("hello")).toBe("hello");
  });

  it("produces a valid regex that matches literally", () => {
    const input = "price: $10.00 (USD)";
    const regex = new RegExp(escapeRegExp(input));
    expect(regex.test(input)).toBe(true);
  });
});
