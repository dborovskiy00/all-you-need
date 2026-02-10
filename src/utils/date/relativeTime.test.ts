import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { relativeTime } from "./relativeTime";

describe("relativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns seconds ago", () => {
    const date = new Date(2024, 5, 15, 11, 59, 30);
    const result = relativeTime(date, "en");
    expect(result).toContain("30 seconds ago");
  });

  it("returns minutes ago", () => {
    const date = new Date(2024, 5, 15, 11, 55, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("5 minutes ago");
  });

  it("returns hours ago", () => {
    const date = new Date(2024, 5, 15, 9, 0, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("3 hours ago");
  });

  it("returns days ago", () => {
    const date = new Date(2024, 5, 13, 12, 0, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("2 days ago");
  });

  it("returns months ago", () => {
    const date = new Date(2024, 2, 15, 12, 0, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("3 months ago");
  });

  it("returns years ago", () => {
    const date = new Date(2022, 5, 15, 12, 0, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("2 years ago");
  });

  it("returns future relative time", () => {
    const date = new Date(2024, 5, 15, 15, 0, 0);
    const result = relativeTime(date, "en");
    expect(result).toContain("in 3 hours");
  });
});
