import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { timeout } from "./timeout";

describe("timeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should resolve if the promise settles in time", async () => {
    const promise = new Promise<string>((resolve) =>
      setTimeout(() => resolve("done"), 100),
    );

    const result = timeout(promise, 500);

    await vi.advanceTimersByTimeAsync(100);
    await expect(result).resolves.toBe("done");
  });

  it("should reject with a timeout error if too slow", async () => {
    let resolveFn: (v: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolveFn = resolve;
    });

    const result = timeout(promise, 200);
    const assertion = expect(result).rejects.toThrow("Timed out after 200ms");

    await vi.advanceTimersByTimeAsync(200);
    await assertion;

    resolveFn!("late");
  });

  it("should propagate the original rejection if it occurs before timeout", async () => {
    const promise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("original error")), 100),
    );

    const result = timeout(promise, 500);
    const assertion = expect(result).rejects.toThrow("original error");

    await vi.advanceTimersByTimeAsync(100);
    await assertion;
  });

  it("should clear the timer when the promise resolves", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const promise = new Promise<string>((resolve) =>
      setTimeout(() => resolve("done"), 50),
    );

    const result = timeout(promise, 500);

    await vi.advanceTimersByTimeAsync(50);
    await result;

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
