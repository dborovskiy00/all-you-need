import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { sleep } from "./sleep";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a promise", () => {
    const result = sleep(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve after the specified time", async () => {
    let resolved = false;
    sleep(1000).then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(500);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(500);
    expect(resolved).toBe(true);
  });

  it("should resolve immediately for 0ms", async () => {
    let resolved = false;
    sleep(0).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });
});
