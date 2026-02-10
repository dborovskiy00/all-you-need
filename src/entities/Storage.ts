interface StorageEntry<T> {
  value: T;
  expiresAt?: number;
}

export interface StorageOptions {
  ttl?: number;
}

export interface TypedStorageConfig {
  adapter: globalThis.Storage;
  prefix?: string;
}

export class TypedStorage {
  private readonly adapter: globalThis.Storage;
  private readonly prefix: string;

  constructor(config: TypedStorageConfig) {
    this.adapter = config.adapter;
    this.prefix = config.prefix ?? "";
  }

  private prefixKey(key: string): string {
    return this.prefix + key;
  }

  get<T>(key: string): T | null {
    const raw = this.adapter.getItem(this.prefixKey(key));

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

    this.adapter.setItem(this.prefixKey(key), JSON.stringify(entry));
  }

  remove(key: string): void {
    this.adapter.removeItem(this.prefixKey(key));
  }

  clear(): void {
    if (this.prefix === "") {
      this.adapter.clear();

      return;
    }

    for (let i = this.adapter.length - 1; i >= 0; i--) {
      const key = this.adapter.key(i);

      if (key !== null && key.startsWith(this.prefix)) {
        this.adapter.removeItem(key);
      }
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  keys(): string[] {
    const result: string[] = [];

    for (let i = 0; i < this.adapter.length; i++) {
      const key = this.adapter.key(i);

      if (key !== null && key.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length));
      }
    }

    return result;
  }
}
