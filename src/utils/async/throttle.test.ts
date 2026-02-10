import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should execute the first call immediately", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should defer subsequent calls within the throttle window", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should execute the next call after the window expires", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);

    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should pass arguments to the immediate call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled("first");
    expect(fn).toHaveBeenCalledWith("first");
  });

  it("should schedule a deferred call with its arguments", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled("first");
    expect(fn).toHaveBeenCalledWith("first");

    throttled("second");

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenLastCalledWith("second");
  });

  it("should not queue multiple deferred calls", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled();
    throttled();
    throttled();
    throttled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
