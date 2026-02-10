interface StorageEntry<T> {
  value: T;
  expiresAt?: number;
}

export interface StorageOptions {
  ttl?: number;
}

export class TypedStorage {
  private readonly adapter: globalThis.Storage;

  constructor(adapter: globalThis.Storage) {
    this.adapter = adapter;
  }

  get<T>(key: string): T | null {
    const raw = this.adapter.getItem(key);

    if (raw === null) {
      return null;
    }

    try {
      const entry: StorageEntry<T> = JSON.parse(raw);

      if (entry.expiresAt !== undefined && Date.now() > entry.expiresAt) {
        this.remove(key);

        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, options?: StorageOptions): void {
    const entry: StorageEntry<T> = { value };

    if (options?.ttl !== undefined) {
      entry.expiresAt = Date.now() + options.ttl;
    }

    this.adapter.setItem(key, JSON.stringify(entry));
  }

  remove(key: string): void {
    this.adapter.removeItem(key);
  }

  clear(): void {
    this.adapter.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  keys(): string[] {
    const result: string[] = [];

    for (let i = 0; i < this.adapter.length; i++) {
      const key = this.adapter.key(i);

      if (key !== null) {
        result.push(key);
      }
    }

    return result;
  }
}
