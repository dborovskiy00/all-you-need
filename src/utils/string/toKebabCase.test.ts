import { describe, it, expect } from "vitest";

import { toKebabCase } from "./toKebabCase";

describe("toKebabCase", () => {
  it("converts camelCase", () => {
    expect(toKebabCase("myVariableName")).toBe("my-variable-name");
  });

  it("converts PascalCase", () => {
    expect(toKebabCase("MyVariableName")).toBe("my-variable-name");
  });

  it("converts snake_case", () => {
    expect(toKebabCase("my_variable_name")).toBe("my-variable-name");
  });

  it("converts space-separated words", () => {
    expect(toKebabCase("my variable name")).toBe("my-variable-name");
  });
});
