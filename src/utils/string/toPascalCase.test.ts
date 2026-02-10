import { describe, it, expect } from "vitest";

import { toPascalCase } from "./toPascalCase";

describe("toPascalCase", () => {
  it("converts kebab-case", () => {
    expect(toPascalCase("hello-world")).toBe("HelloWorld");
  });

  it("converts snake_case", () => {
    expect(toPascalCase("hello_world")).toBe("HelloWorld");
  });

  it("converts space-separated words", () => {
    expect(toPascalCase("hello world")).toBe("HelloWorld");
  });

  it("converts mixed delimiters", () => {
    expect(toPascalCase("hello-world_foo bar")).toBe("HelloWorldFooBar");
  });

  it("handles a single word", () => {
    expect(toPascalCase("hello")).toBe("Hello");
  });

  it("handles an already PascalCase string with no delimiters", () => {
    expect(toPascalCase("Hello")).toBe("Hello");
  });

  it("handles an empty string", () => {
    expect(toPascalCase("")).toBe("");
  });

  it("handles multiple consecutive delimiters", () => {
    expect(toPascalCase("hello--world")).toBe("HelloWorld");
  });

  it("handles uppercase input", () => {
    expect(toPascalCase("HELLO-WORLD")).toBe("HelloWorld");
  });

  it("handles strings with numbers", () => {
    expect(toPascalCase("get-2nd-item")).toBe("Get2ndItem");
  });
});
