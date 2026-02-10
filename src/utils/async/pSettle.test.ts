import { describe, it, expect } from "vitest";

import { pSettle } from "./pSettle";

describe("pSettle", () => {
  it("should settle all resolved promises", async () => {
    const results = await pSettle([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);

    expect(results).toEqual([
      { status: "fulfilled", value: 1 },
      { status: "fulfilled", value: 2 },
      { status: "fulfilled", value: 3 },
    ]);
  });

  it("should settle all rejected promises", async () => {
    const results = await pSettle([
      Promise.reject("error1"),
      Promise.reject("error2"),
    ]);

    expect(results).toEqual([
      { status: "rejected", reason: "error1" },
      { status: "rejected", reason: "error2" },
    ]);
  });

  it("should handle a mix of resolved and rejected promises", async () => {
    const results = await pSettle([
      Promise.resolve("ok"),
      Promise.reject("fail"),
      Promise.resolve("also ok"),
    ]);

    expect(results[0]).toEqual({ status: "fulfilled", value: "ok" });
    expect(results[1]).toEqual({ status: "rejected", reason: "fail" });
    expect(results[2]).toEqual({ status: "fulfilled", value: "also ok" });
  });

  it("should return an empty array for empty input", async () => {
    const results = await pSettle([]);
    expect(results).toEqual([]);
  });

  it("should preserve the order of results", async () => {
    const results = await pSettle([
      new Promise<number>((resolve) => setTimeout(() => resolve(1), 30)),
      new Promise<number>((resolve) => setTimeout(() => resolve(2), 10)),
      new Promise<number>((resolve) => setTimeout(() => resolve(3), 20)),
    ]);

    expect(results).toEqual([
      { status: "fulfilled", value: 1 },
      { status: "fulfilled", value: 2 },
      { status: "fulfilled", value: 3 },
    ]);
  });
});
