import { describe, it, expect } from "vitest";

import { pluralize } from "./pluralize";

describe("pluralize", () => {
  it("returns one-form for 1", () => {
    expect(pluralize(1, "файл", "файла", "файлов")).toBe("1 файл");
  });

  it("returns few-form for 2", () => {
    expect(pluralize(2, "файл", "файла", "файлов")).toBe("2 файла");
  });

  it("returns many-form for 5", () => {
    expect(pluralize(5, "файл", "файла", "файлов")).toBe("5 файлов");
  });

  it("returns many-form for 11", () => {
    expect(pluralize(11, "файл", "файла", "файлов")).toBe("11 файлов");
  });

  it("returns one-form for 21", () => {
    expect(pluralize(21, "файл", "файла", "файлов")).toBe("21 файл");
  });

  it("returns few-form for 22", () => {
    expect(pluralize(22, "файл", "файла", "файлов")).toBe("22 файла");
  });

  it("returns many-form for 25", () => {
    expect(pluralize(25, "файл", "файла", "файлов")).toBe("25 файлов");
  });

  it("returns many-form for 111", () => {
    expect(pluralize(111, "файл", "файла", "файлов")).toBe("111 файлов");
  });

  it("returns one-form for 121", () => {
    expect(pluralize(121, "файл", "файла", "файлов")).toBe("121 файл");
  });

  it("returns many-form for 0", () => {
    expect(pluralize(0, "файл", "файла", "файлов")).toBe("0 файлов");
  });

  it("returns many-form for 12", () => {
    expect(pluralize(12, "файл", "файла", "файлов")).toBe("12 файлов");
  });

  it("returns many-form for 14", () => {
    expect(pluralize(14, "файл", "файла", "файлов")).toBe("14 файлов");
  });

  it("returns few-form for 3", () => {
    expect(pluralize(3, "файл", "файла", "файлов")).toBe("3 файла");
  });

  it("returns few-form for 4", () => {
    expect(pluralize(4, "файл", "файла", "файлов")).toBe("4 файла");
  });
});
