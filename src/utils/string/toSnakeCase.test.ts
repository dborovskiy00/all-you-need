import { describe, it, expect } from "vitest";

import { toSnakeCase } from "./toSnakeCase";

describe("toSnakeCase", () => {
  it("converts camelCase", () => {
    expect(toSnakeCase("myVariableName")).toBe("my_variable_name");
  });

  it("converts PascalCase", () => {
    expect(toSnakeCase("MyVariableName")).toBe("my_variable_name");
  });

  it("converts kebab-case", () => {
    expect(toSnakeCase("my-variable-name")).toBe("my_variable_name");
  });

  it("converts space-separated words", () => {
    expect(toSnakeCase("my variable name")).toBe("my_variable_name");
  });
});
