import { describe, it, expect } from "vitest";

import { unescapeHtml } from "./unescapeHtml";

describe("unescapeHtml", () => {
  it("unescapes &amp;", () => {
    expect(unescapeHtml("a &amp; b")).toBe("a & b");
  });

  it("unescapes &lt; and &gt;", () => {
    expect(unescapeHtml("&lt;div&gt;")).toBe("<div>");
  });

  it("unescapes &quot;", () => {
    expect(unescapeHtml("say &quot;hello&quot;")).toBe('say "hello"');
  });

  it("unescapes &#39;", () => {
    expect(unescapeHtml("it&#39;s")).toBe("it's");
  });

  it("unescapes all entities in one string", () => {
    expect(
      unescapeHtml("&lt;a href=&quot;url&quot;&gt;&amp;&#39;"),
    ).toBe(`<a href="url">&'`);
  });

  it("returns an empty string unchanged", () => {
    expect(unescapeHtml("")).toBe("");
  });

  it("returns a string with no entities unchanged", () => {
    expect(unescapeHtml("hello world")).toBe("hello world");
  });
});
