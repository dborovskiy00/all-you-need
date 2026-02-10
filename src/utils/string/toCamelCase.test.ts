import { describe, it, expect } from "vitest";

import { toCamelCase } from "./toCamelCase";

describe("toCamelCase", () => {
  it("converts kebab-case", () => {
    expect(toCamelCase("my-variable-name")).toBe("myVariableName");
  });

  it("converts snake_case", () => {
    expect(toCamelCase("my_variable_name")).toBe("myVariableName");
  });

  it("converts space-separated words", () => {
    expect(toCamelCase("my variable name")).toBe("myVariableName");
  });

  it("converts PascalCase", () => {
    expect(toCamelCase("MyVariableName")).toBe("myVariableName");
  });

  it("keeps already camelCase unchanged", () => {
    expect(toCamelCase("myVariableName")).toBe("myVariableName");
  });
});
