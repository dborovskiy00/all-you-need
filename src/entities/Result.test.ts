import { describe, it, expect } from "vitest";

import { Result } from "./Result";

describe("Result", () => {
  describe("creation", () => {
    it("should create an Ok result", () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });

    it("should create an Err result", () => {
      const result = Result.err("something went wrong");
      expect(result.isErr()).toBe(true);
      expect(result.isOk()).toBe(false);
    });
  });

  describe("isOk / isErr", () => {
    it("should return true for isOk on Ok result", () => {
      expect(Result.ok(1).isOk()).toBe(true);
    });

    it("should return false for isErr on Ok result", () => {
      expect(Result.ok(1).isErr()).toBe(false);
    });

    it("should return true for isErr on Err result", () => {
      expect(Result.err("e").isErr()).toBe(true);
    });

    it("should return false for isOk on Err result", () => {
      expect(Result.err("e").isOk()).toBe(false);
    });
  });

  describe("value getter", () => {
    it("should return value for Ok result", () => {
      expect(Result.ok(42).value).toBe(42);
    });

    it("should throw when accessing value on Err result", () => {
      expect(() => Result.err("fail").value).toThrow(
        "Cannot get value of an Err result",
      );
    });
  });

  describe("error getter", () => {
    it("should return error for Err result", () => {
      expect(Result.err("fail").error).toBe("fail");
    });

    it("should throw when accessing error on Ok result", () => {
      expect(() => Result.ok(42).error).toThrow(
        "Cannot get error of an Ok result",
      );
    });
  });

  describe("unwrap", () => {
    it("should return value for Ok result", () => {
      expect(Result.ok(42).unwrap()).toBe(42);
    });

    it("should throw the error value for Err result", () => {
      const error = new Error("boom");
      expect(() => Result.err(error).unwrap()).toThrow("boom");
    });
  });

  describe("unwrapOr", () => {
    it("should return value for Ok result", () => {
      expect(Result.ok(42).unwrapOr(0)).toBe(42);
    });

    it("should return default value for Err result", () => {
      expect(Result.err<string>("fail").unwrapOr(0 as never)).toBe(0);
    });
  });

  describe("unwrapErr", () => {
    it("should return error for Err result", () => {
      expect(Result.err("fail").unwrapErr()).toBe("fail");
    });

    it("should throw for Ok result", () => {
      expect(() => Result.ok(42).unwrapErr()).toThrow(
        "Called unwrapErr on an Ok result",
      );
    });
  });

  describe("map", () => {
    it("should transform Ok value", () => {
      const result = Result.ok(2).map((v) => v * 10);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(20);
    });

    it("should pass through Err without calling fn", () => {
      const result = Result.err<string>("fail").map((v: number) => v * 10);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("fail");
    });
  });

  describe("mapErr", () => {
    it("should transform Err value", () => {
      const result = Result.err("fail").mapErr((e) => e.toUpperCase());
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("FAIL");
    });

    it("should pass through Ok without calling fn", () => {
      const result = Result.ok(42).mapErr((e: string) => e.toUpperCase());
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(42);
    });
  });

  describe("flatMap", () => {
    it("should chain Ok results", () => {
      const result = Result.ok(2).flatMap((v) => Result.ok(v * 10));
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(20);
    });

    it("should short-circuit on Err", () => {
      const result = Result.err<string>("fail").flatMap((v: number) =>
        Result.ok(v * 10),
      );
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("fail");
    });

    it("should allow flatMap to return Err", () => {
      const ok = Result.ok(2) as Result<number, string>;
      const result = ok.flatMap(() => Result.err("nope"));
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("nope");
    });
  });

  describe("edge cases", () => {
    it("should handle ok(null)", () => {
      const result = Result.ok(null);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBeNull();
    });

    it("should handle ok(undefined)", () => {
      const result = Result.ok(undefined);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it("should handle err(0)", () => {
      const result = Result.err(0);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe(0);
    });

    it("should handle ok(false)", () => {
      const result = Result.ok(false);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(false);
    });

    it("should handle err(null)", () => {
      const result = Result.err(null);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
