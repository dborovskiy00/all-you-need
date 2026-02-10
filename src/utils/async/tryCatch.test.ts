import { describe, it, expect } from "vitest";

import { tryCatch, tryCatchSync } from "./tryCatch";

describe("tryCatch", () => {
  it("should return [null, value] on success", async () => {
    const result = await tryCatch(() => Promise.resolve(42));
    expect(result).toEqual([null, 42]);
  });

  it("should return [Error, null] on failure", async () => {
    const result = await tryCatch(() => Promise.reject(new Error("fail")));
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]!.message).toBe("fail");
    expect(result[1]).toBeNull();
  });

  it("should wrap non-Error throws in Error", async () => {
    const result = await tryCatch(() => Promise.reject("string error"));
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]!.message).toBe("string error");
    expect(result[1]).toBeNull();
  });

  it("should handle async functions that throw", async () => {
    const result = await tryCatch(async () => {
      throw new Error("async throw");
    });
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]!.message).toBe("async throw");
    expect(result[1]).toBeNull();
  });
});

describe("tryCatchSync", () => {
  it("should return [null, value] on success", () => {
    const result = tryCatchSync(() => 42);
    expect(result).toEqual([null, 42]);
  });

  it("should return [Error, null] on failure", () => {
    const result = tryCatchSync(() => {
      throw new Error("sync fail");
    });
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]!.message).toBe("sync fail");
    expect(result[1]).toBeNull();
  });

  it("should wrap non-Error throws in Error", () => {
    const result = tryCatchSync(() => {
      throw "string error";
    });
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]!.message).toBe("string error");
    expect(result[1]).toBeNull();
  });

  it("should handle returning null", () => {
    const result = tryCatchSync(() => null);
    expect(result).toEqual([null, null]);
  });

  it("should handle returning undefined", () => {
    const result = tryCatchSync(() => undefined);
    expect(result).toEqual([null, undefined]);
  });
});
