import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { TypedStorage } from "./Storage";

class MockStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = [...this.store.keys()];

    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("TypedStorage", () => {
  let adapter: MockStorage;
  let storage: TypedStorage;

  beforeEach(() => {
    adapter = new MockStorage();
    storage = new TypedStorage({ adapter });
  });

  describe("set and get", () => {
    it("stores and retrieves a string value", () => {
      storage.set("name", "Alice");
      expect(storage.get<string>("name")).toBe("Alice");
    });

    it("stores and retrieves a number value", () => {
      storage.set("count", 42);
      expect(storage.get<number>("count")).toBe(42);
    });

    it("stores and retrieves an object value", () => {
      const obj = { a: 1, b: "two" };
      storage.set("data", obj);
      expect(storage.get<typeof obj>("data")).toEqual(obj);
    });

    it("stores and retrieves an array value", () => {
      storage.set("items", [1, 2, 3]);
      expect(storage.get<number[]>("items")).toEqual([1, 2, 3]);
    });

    it("stores and retrieves a boolean value", () => {
      storage.set("flag", true);
      expect(storage.get<boolean>("flag")).toBe(true);
    });

    it("stores and retrieves null as a value", () => {
      storage.set("empty", null);
      expect(storage.get<null>("empty")).toBeNull();
    });

    it("overwrites existing values", () => {
      storage.set("key", "old");
      storage.set("key", "new");
      expect(storage.get<string>("key")).toBe("new");
    });
  });

  describe("get edge cases", () => {
    it("returns null for a missing key", () => {
      expect(storage.get("nonexistent")).toBeNull();
    });

    it("returns null for corrupted JSON", () => {
      adapter.setItem("bad", "not-valid-json{{{");
      expect(storage.get("bad")).toBeNull();
    });
  });

  describe("remove", () => {
    it("removes an existing key", () => {
      storage.set("key", "value");
      storage.remove("key");
      expect(storage.get("key")).toBeNull();
    });

    it("does not throw when removing a non-existent key", () => {
      expect(() => storage.remove("nope")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes all keys", () => {
      storage.set("a", 1);
      storage.set("b", 2);
      storage.set("c", 3);

      storage.clear();

      expect(storage.get("a")).toBeNull();
      expect(storage.get("b")).toBeNull();
      expect(storage.get("c")).toBeNull();
      expect(storage.keys()).toEqual([]);
    });
  });

  describe("has", () => {
    it("returns true for an existing key", () => {
      storage.set("key", "value");
      expect(storage.has("key")).toBe(true);
    });

    it("returns false for a missing key", () => {
      expect(storage.has("nonexistent")).toBe(false);
    });

    it("returns false for an expired key", () => {
      vi.useFakeTimers();

      storage.set("temp", "data", { ttl: 1000 });
      vi.advanceTimersByTime(1001);

      expect(storage.has("temp")).toBe(false);

      vi.useRealTimers();
    });
  });

  describe("keys", () => {
    it("returns all stored keys", () => {
      storage.set("x", 1);
      storage.set("y", 2);
      storage.set("z", 3);

      const keys = storage.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain("x");
      expect(keys).toContain("y");
      expect(keys).toContain("z");
    });

    it("returns an empty array when storage is empty", () => {
      expect(storage.keys()).toEqual([]);
    });
  });

  describe("TTL expiration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns the value before TTL expires", () => {
      storage.set("temp", "data", { ttl: 5000 });

      vi.advanceTimersByTime(4999);
      expect(storage.get<string>("temp")).toBe("data");
    });

    it("returns null after TTL expires", () => {
      storage.set("temp", "data", { ttl: 5000 });

      vi.advanceTimersByTime(5001);
      expect(storage.get<string>("temp")).toBeNull();
    });

    it("removes the key from storage after TTL expires", () => {
      storage.set("temp", "data", { ttl: 1000 });

      vi.advanceTimersByTime(1001);
      storage.get("temp");

      expect(adapter.getItem("temp")).toBeNull();
    });

    it("does not expire entries without TTL", () => {
      storage.set("permanent", "forever");

      vi.advanceTimersByTime(999_999_999);
      expect(storage.get<string>("permanent")).toBe("forever");
    });

    it("supports different TTLs for different keys", () => {
      storage.set("short", "a", { ttl: 1000 });
      storage.set("long", "b", { ttl: 10000 });

      vi.advanceTimersByTime(1001);

      expect(storage.get<string>("short")).toBeNull();
      expect(storage.get<string>("long")).toBe("b");
    });
  });

  describe("prefix", () => {
    let prefixedStorage: TypedStorage;

    beforeEach(() => {
      prefixedStorage = new TypedStorage({ adapter, prefix: "app_" });
    });

    it("stores values with prefix in the adapter", () => {
      prefixedStorage.set("user", { name: "Dan" });
      expect(adapter.getItem("app_user")).not.toBeNull();
      expect(adapter.getItem("user")).toBeNull();
    });

    it("retrieves values by unprefixed key", () => {
      prefixedStorage.set("user", { name: "Dan" });
      expect(prefixedStorage.get<{ name: string }>("user")).toEqual({ name: "Dan" });
    });

    it("removes values with prefix", () => {
      prefixedStorage.set("key", "value");
      prefixedStorage.remove("key");
      expect(adapter.getItem("app_key")).toBeNull();
    });

    it("returns keys without prefix", () => {
      prefixedStorage.set("a", 1);
      prefixedStorage.set("b", 2);

      const keys = prefixedStorage.keys();
      expect(keys).toEqual(["a", "b"]);
    });

    it("clear only removes prefixed keys", () => {
      adapter.setItem("other", "data");
      prefixedStorage.set("a", 1);
      prefixedStorage.set("b", 2);

      prefixedStorage.clear();

      expect(adapter.getItem("other")).toBe("data");
      expect(adapter.getItem("app_a")).toBeNull();
      expect(adapter.getItem("app_b")).toBeNull();
    });

    it("has checks with prefix", () => {
      prefixedStorage.set("exists", true);
      expect(prefixedStorage.has("exists")).toBe(true);
      expect(prefixedStorage.has("nope")).toBe(false);
    });
  });
});
