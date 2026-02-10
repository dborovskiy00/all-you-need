import { describe, it, expect } from "vitest";

import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;");
  });

  it("escapes greater-than", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("escapes all special characters in one string", () => {
    expect(escapeHtml(`<a href="url">&'`)).toBe(
      "&lt;a href=&quot;url&quot;&gt;&amp;&#39;",
    );
  });

  it("returns an empty string unchanged", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("returns a string with no special characters unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});
