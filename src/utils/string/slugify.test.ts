import { describe, it, expect } from "vitest";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("hello! @world#")).toBe("hello-world");
  });

  it("handles unicode and accented characters", () => {
    expect(slugify("café résumé")).toBe("cafe-resume");
  });

  it("converts uppercase to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses multiple hyphens into one", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify(" -hello- ")).toBe("hello");
  });
});
