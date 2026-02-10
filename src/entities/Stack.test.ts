import { describe, it, expect } from "vitest";

import { Stack } from "./Stack";

describe("Stack", () => {
  it("starts empty", () => {
    const s = new Stack<number>();
    expect(s.size).toBe(0);
    expect(s.isEmpty).toBe(true);
  });

  describe("push", () => {
    it("adds items to the stack", () => {
      const s = new Stack<number>();
      s.push(1);
      s.push(2);
      expect(s.size).toBe(2);
      expect(s.isEmpty).toBe(false);
    });
  });

  describe("pop", () => {
    it("removes and returns items in LIFO order", () => {
      const s = new Stack<number>();
      s.push(1);
      s.push(2);
      s.push(3);

      expect(s.pop()).toBe(3);
      expect(s.pop()).toBe(2);
      expect(s.pop()).toBe(1);
    });

    it("returns undefined when empty", () => {
      const s = new Stack<number>();
      expect(s.pop()).toBeUndefined();
    });

    it("returns undefined after all items are popped", () => {
      const s = new Stack<number>();
      s.push(1);
      s.pop();
      expect(s.pop()).toBeUndefined();
    });
  });

  describe("peek", () => {
    it("returns the top item without removing it", () => {
      const s = new Stack<string>();
      s.push("a");
      s.push("b");

      expect(s.peek()).toBe("b");
      expect(s.size).toBe(2);
    });

    it("returns undefined when empty", () => {
      const s = new Stack<string>();
      expect(s.peek()).toBeUndefined();
    });
  });

  describe("size", () => {
    it("reflects the current number of items", () => {
      const s = new Stack<number>();
      expect(s.size).toBe(0);

      s.push(1);
      expect(s.size).toBe(1);

      s.push(2);
      expect(s.size).toBe(2);

      s.pop();
      expect(s.size).toBe(1);
    });
  });

  describe("isEmpty", () => {
    it("returns true when empty and false when not", () => {
      const s = new Stack<number>();
      expect(s.isEmpty).toBe(true);

      s.push(1);
      expect(s.isEmpty).toBe(false);

      s.pop();
      expect(s.isEmpty).toBe(true);
    });
  });

  describe("clear", () => {
    it("removes all items", () => {
      const s = new Stack<number>();
      s.push(1);
      s.push(2);
      s.push(3);

      s.clear();

      expect(s.size).toBe(0);
      expect(s.isEmpty).toBe(true);
      expect(s.pop()).toBeUndefined();
    });
  });

  describe("toArray", () => {
    it("returns a shallow copy in bottom-to-top order", () => {
      const s = new Stack<number>();
      s.push(1);
      s.push(2);
      s.push(3);

      expect(s.toArray()).toEqual([1, 2, 3]);
    });

    it("returns an empty array when the stack is empty", () => {
      const s = new Stack<number>();
      expect(s.toArray()).toEqual([]);
    });

    it("does not expose internal state", () => {
      const s = new Stack<number>();
      s.push(1);

      const arr = s.toArray();
      arr.push(999);

      expect(s.size).toBe(1);
      expect(s.toArray()).toEqual([1]);
    });
  });

  it("works with object items", () => {
    const s = new Stack<{ id: number }>();
    const obj = { id: 1 };
    s.push(obj);
    expect(s.pop()).toBe(obj);
  });
});
