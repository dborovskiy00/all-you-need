import { describe, it, expect } from "vitest";

import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("returns '0 B' for 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1 MB");
  });

  it("formats gigabytes", () => {
    expect(formatBytes(1073741824)).toBe("1 GB");
  });

  it("formats terabytes", () => {
    expect(formatBytes(1099511627776)).toBe("1 TB");
  });

  it("formats petabytes", () => {
    expect(formatBytes(1125899906842624)).toBe("1 PB");
  });

  it("uses 2 decimal places by default", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("respects custom decimal places", () => {
    expect(formatBytes(1536, 0)).toBe("2 KB");
    expect(formatBytes(1536, 3)).toBe("1.5 KB");
  });

  it("handles large values with decimals", () => {
    expect(formatBytes(5368709120)).toBe("5 GB");
  });
});
