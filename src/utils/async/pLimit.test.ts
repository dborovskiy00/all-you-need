import { describe, it, expect } from "vitest";

import { pLimit } from "./pLimit";

describe("pLimit", () => {
  it("should limit concurrency to the specified value", async () => {
    const limit = pLimit(2);
    let activeCount = 0;
    let maxActive = 0;

    const createTask = (delay: number): (() => Promise<number>) => {
      return () =>
        new Promise<number>((resolve) => {
          activeCount++;

          if (activeCount > maxActive) {
            maxActive = activeCount;
          }

          setTimeout(() => {
            activeCount--;
            resolve(delay);
          }, delay);
        });
    };

    const results = await Promise.all([
      limit(createTask(50)),
      limit(createTask(50)),
      limit(createTask(50)),
      limit(createTask(50)),
    ]);

    expect(maxActive).toBe(2);
    expect(results).toEqual([50, 50, 50, 50]);
  });

  it("should run all tasks when concurrency is higher than task count", async () => {
    const limit = pLimit(10);
    let activeCount = 0;
    let maxActive = 0;

    const createTask = (value: number): (() => Promise<number>) => {
      return () =>
        new Promise<number>((resolve) => {
          activeCount++;

          if (activeCount > maxActive) {
            maxActive = activeCount;
          }

          setTimeout(() => {
            activeCount--;
            resolve(value);
          }, 10);
        });
    };

    const results = await Promise.all([
      limit(createTask(1)),
      limit(createTask(2)),
      limit(createTask(3)),
    ]);

    expect(maxActive).toBe(3);
    expect(results).toEqual([1, 2, 3]);
  });

  it("should propagate errors", async () => {
    const limit = pLimit(1);

    await expect(
      limit(() => Promise.reject(new Error("test error"))),
    ).rejects.toThrow("test error");
  });

  it("should continue processing queue after errors", async () => {
    const limit = pLimit(1);

    const errorPromise = limit(() => Promise.reject(new Error("fail")));
    const successPromise = limit(() => Promise.resolve(42));

    await expect(errorPromise).rejects.toThrow("fail");
    await expect(successPromise).resolves.toBe(42);
  });

  it("should handle concurrency of 1", async () => {
    const limit = pLimit(1);
    const order: number[] = [];

    const createTask = (id: number): (() => Promise<void>) => {
      return () =>
        new Promise<void>((resolve) => {
          order.push(id);
          setTimeout(resolve, 10);
        });
    };

    await Promise.all([
      limit(createTask(1)),
      limit(createTask(2)),
      limit(createTask(3)),
    ]);

    expect(order).toEqual([1, 2, 3]);
  });
});
