import { describe, it, expect } from "vitest";

import { Queue } from "./Queue";

describe("Queue", () => {
  it("starts empty", () => {
    const q = new Queue<number>();
    expect(q.size).toBe(0);
    expect(q.isEmpty).toBe(true);
  });

  describe("enqueue", () => {
    it("adds items to the queue", () => {
      const q = new Queue<number>();
      q.enqueue(1);
      q.enqueue(2);
      expect(q.size).toBe(2);
      expect(q.isEmpty).toBe(false);
    });
  });

  describe("dequeue", () => {
    it("removes and returns items in FIFO order", () => {
      const q = new Queue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);

      expect(q.dequeue()).toBe(1);
      expect(q.dequeue()).toBe(2);
      expect(q.dequeue()).toBe(3);
    });

    it("returns undefined when empty", () => {
      const q = new Queue<number>();
      expect(q.dequeue()).toBeUndefined();
    });

    it("returns undefined after all items are dequeued", () => {
      const q = new Queue<number>();
      q.enqueue(1);
      q.dequeue();
      expect(q.dequeue()).toBeUndefined();
    });
  });

  describe("peek", () => {
    it("returns the front item without removing it", () => {
      const q = new Queue<string>();
      q.enqueue("a");
      q.enqueue("b");

      expect(q.peek()).toBe("a");
      expect(q.size).toBe(2);
    });

    it("returns undefined when empty", () => {
      const q = new Queue<string>();
      expect(q.peek()).toBeUndefined();
    });
  });

  describe("size", () => {
    it("reflects the current number of items", () => {
      const q = new Queue<number>();
      expect(q.size).toBe(0);

      q.enqueue(1);
      expect(q.size).toBe(1);

      q.enqueue(2);
      expect(q.size).toBe(2);

      q.dequeue();
      expect(q.size).toBe(1);
    });
  });

  describe("isEmpty", () => {
    it("returns true when empty and false when not", () => {
      const q = new Queue<number>();
      expect(q.isEmpty).toBe(true);

      q.enqueue(1);
      expect(q.isEmpty).toBe(false);

      q.dequeue();
      expect(q.isEmpty).toBe(true);
    });
  });

  describe("clear", () => {
    it("removes all items", () => {
      const q = new Queue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);

      q.clear();

      expect(q.size).toBe(0);
      expect(q.isEmpty).toBe(true);
      expect(q.dequeue()).toBeUndefined();
    });
  });

  describe("toArray", () => {
    it("returns a shallow copy of items in FIFO order", () => {
      const q = new Queue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);

      expect(q.toArray()).toEqual([1, 2, 3]);
    });

    it("returns an empty array when the queue is empty", () => {
      const q = new Queue<number>();
      expect(q.toArray()).toEqual([]);
    });

    it("does not expose internal state", () => {
      const q = new Queue<number>();
      q.enqueue(1);

      const arr = q.toArray();
      arr.push(999);

      expect(q.size).toBe(1);
      expect(q.toArray()).toEqual([1]);
    });
  });

  it("works with object items", () => {
    const q = new Queue<{ id: number }>();
    const obj = { id: 1 };
    q.enqueue(obj);
    expect(q.dequeue()).toBe(obj);
  });
});
