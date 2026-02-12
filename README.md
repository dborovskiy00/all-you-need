# all-you-need

**English** | [Русский](./README.ru.md)

[![npm version](https://img.shields.io/npm/v/all-you-need)](https://www.npmjs.com/package/all-you-need)
[![bundle size](https://img.shields.io/bundlephobia/minzip/all-you-need)](https://bundlephobia.com/package/all-you-need)
[![license](https://img.shields.io/npm/l/all-you-need)](./LICENSE)

Universal TypeScript utility library. Zero dependencies, tree-shakeable, works in browser and Node.js.

## Install

```bash
npm install all-you-need
```

## Import

```typescript
// Everything
import { chunk, Result, deepClone } from "all-you-need";

// By domain
import { Result, Queue, Stack } from "all-you-need/entities";
import { chunk, debounce, isEmail } from "all-you-need/utils";

// Types only
import type { DeepPartial, Nullable, Merge } from "all-you-need/types";
```

## Types

### Object

| Name | Description |
|------|-------------|
| `DeepPartial<T>` | Makes all properties optional recursively |
| `DeepReadonly<T>` | Makes all properties readonly recursively |
| `Merge<T, S>` | Merge two object types, second overrides first |
| `MutableKeys<T>` | Extract mutable (non-readonly) keys from a type |
| `Prettify<T>` | Flatten complex intersection types for better readability in IDE hints |
| `ReadonlyKeys<T>` | Extract readonly keys from a type |
| `RequiredDeep<T>` | Makes all properties required recursively |
| `SetNonNullable<T, K>` | Make specified keys non-nullable |
| `SetOptional<T, K>` | Make specified keys optional |
| `SetRequired<T, K>` | Make specified keys required |
| `Writable<T>` | Remove readonly from all properties (shallow) |
| `WritableDeep<T>` | Remove readonly from all properties recursively |

### Keys

| Name | Description |
|------|-------------|
| `ConditionalKeys<T, Condition>` | Extract keys whose values extend the given condition type |
| `ConditionalPick<T, Condition>` | Pick properties whose values extend the given condition type |
| `ConditionalExcept<T, Condition>` | Omit properties whose values extend the given condition type |
| `Entries<T>` | Type-safe return type for `Object.entries()` |
| `OmitByValue<T, V>` | Omit properties whose values extend `V` |
| `PickByValue<T, V>` | Pick properties whose values extend `V` |
| `StringKeyOf<T>` | Extract only string keys from a type (excludes `number` and `symbol`) |
| `ValueOf<T>` | Union of all value types from an object type |

### String

| Name | Description |
|------|-------------|
| `CamelCase<S>` | Convert string literal type to camelCase |
| `KebabCase<S>` | Convert string literal type to kebab-case |
| `Join<T, D>` | Join a tuple of string literals with a delimiter |
| `Split<S, D>` | Split a string literal type by a delimiter into a tuple |

### Union

| Name | Description |
|------|-------------|
| `LiteralUnion<L, Base>` | Create a union that preserves IDE autocomplete for literal types |
| `TupleToUnion<T>` | Convert a tuple/array type to a union of its elements |
| `UnionToIntersection<U>` | Convert a union type to an intersection type |

### Async

| Name | Description |
|------|-------------|
| `AsyncReturnType<T>` | Extract the unwrapped return type of an async function |
| `Promisable<T>` | A value that can be either `T` or `PromiseLike<T>` |

### Common

| Name | Description |
|------|-------------|
| `Branded<T, Brand>` | Create a nominal/branded type to distinguish structurally identical types |
| `EmptyObject` | An object type with no properties (`Record<string, never>`) |
| `IsEqual<A, B>` | Check at the type level if two types are exactly equal |
| `Nullable<T>` | `T \| null` |
| `Optional<T>` | `T \| undefined` |

### JSON

| Name | Description |
|------|-------------|
| `JsonValue` | Any valid JSON value (primitive, object, or array) |
| `JsonObject` | A JSON-compatible object (`Record<string, JsonValue>`) |
| `JsonArray` | A JSON-compatible array (`JsonValue[]`) |
| `JsonPrimitive` | JSON primitive: `string \| number \| boolean \| null` |

## Entities

| Name | Description |
|------|-------------|
| `Result<T, E>` | Monadic error handling with explicit `Ok`/`Err` — no exceptions |
| `Queue<T>` | FIFO queue data structure |
| `Stack<T>` | LIFO stack data structure |
| `TypedStorage` | Universal typed wrapper for `localStorage`/`sessionStorage` with prefix and TTL |
| `Logger` | Leveled logger with prefix, timestamp, and configurable log levels |
| `JwtAuthManager` | JWT auth manager for multiple backends — storage, expiration, headers, subscriptions |

Also exports types: `StorageOptions`, `TypedStorageConfig`, `LogLevel`, `LoggerOptions`, `JwtAuthTargetConfig`, `JwtAuthEvent`, `JwtPayload`.

### `Result<T, E>`

Monadic error handling — explicit `Ok`/`Err` without exceptions.

| Method | Signature | Description |
|--------|-----------|-------------|
| `Result.ok` | `<T>(value: T) => Result<T, never>` | Create a successful result |
| `Result.err` | `<E>(error: E) => Result<never, E>` | Create an error result |
| `isOk` | `() => this is Result<T, never>` | Type guard — check if result is Ok |
| `isErr` | `() => this is Result<never, E>` | Type guard — check if result is Err |
| `value` | `get value(): T` | Get Ok value (throws if Err) |
| `error` | `get error(): E` | Get Err value (throws if Ok) |
| `unwrap` | `() => T` | Get value or throw if Err |
| `unwrapOr` | `(defaultValue: T) => T` | Get value or return default |
| `unwrapErr` | `() => E` | Get error or throw if Ok |
| `map` | `<U>(fn: (value: T) => U) => Result<U, E>` | Transform Ok value |
| `mapErr` | `<F>(fn: (error: E) => F) => Result<T, F>` | Transform Err value |
| `flatMap` | `<U>(fn: (value: T) => Result<U, E>) => Result<U, E>` | Chain Result-returning operations |

```typescript
import { Result } from "all-you-need/entities";

const ok = Result.ok(42);
const err = Result.err("not found");

ok.isOk();       // true
ok.value;        // 42
ok.unwrap();     // 42
err.unwrapOr(0); // 0

ok.map(x => x * 2).unwrap(); // 84
```

### `Queue<T>`

FIFO queue data structure.

| Method | Signature | Description |
|--------|-----------|-------------|
| `enqueue` | `(item: T) => void` | Add item to the back of the queue |
| `dequeue` | `() => T \| undefined` | Remove and return the front item |
| `peek` | `() => T \| undefined` | View the front item without removing |
| `size` | `get size(): number` | Number of items in the queue |
| `isEmpty` | `get isEmpty(): boolean` | Whether the queue is empty |
| `clear` | `() => void` | Remove all items |
| `toArray` | `() => T[]` | Convert queue to array |

```typescript
import { Queue } from "all-you-need/entities";

const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
q.dequeue(); // 1
```

### `Stack<T>`

LIFO stack data structure.

| Method | Signature | Description |
|--------|-----------|-------------|
| `push` | `(item: T) => void` | Push item onto the top |
| `pop` | `() => T \| undefined` | Remove and return the top item |
| `peek` | `() => T \| undefined` | View the top item without removing |
| `size` | `get size(): number` | Number of items in the stack |
| `isEmpty` | `get isEmpty(): boolean` | Whether the stack is empty |
| `clear` | `() => void` | Remove all items |
| `toArray` | `() => T[]` | Convert stack to array |

```typescript
import { Stack } from "all-you-need/entities";

const s = new Stack<number>();
s.push(1);
s.push(2);
s.pop(); // 2
```

### `TypedStorage`

Universal typed wrapper for `localStorage` / `sessionStorage` / custom storage with prefix, TTL, and JSON serialization.

| Method | Signature | Description |
|--------|-----------|-------------|
| `constructor` | `(config: TypedStorageConfig) => TypedStorage` | Create storage with `adapter` and optional `prefix` |
| `get` | `<T>(key: string) => T \| null` | Retrieve a typed value by key (returns null if missing or expired) |
| `set` | `<T>(key: string, value: T, options?: StorageOptions) => void` | Store a value with optional TTL (in ms) |
| `remove` | `(key: string) => void` | Remove a key |
| `has` | `(key: string) => boolean` | Check if key exists and is not expired |
| `clear` | `() => void` | Remove all keys (only prefixed keys if prefix is set) |
| `keys` | `() => string[]` | Get all keys (returned without prefix) |

```typescript
import { TypedStorage } from "all-you-need/entities";

const storage = new TypedStorage({
  adapter: localStorage,
  prefix: "app_",
});

storage.set("user", { name: "Dan" });
storage.get("user"); // { name: "Dan" }
storage.set("token", "abc", { ttl: 60000 }); // expires in 60s
```

### `Logger`

Leveled logger with optional prefix and timestamp.

| Method | Signature | Description |
|--------|-----------|-------------|
| `constructor` | `(options?: LoggerOptions) => Logger` | Create logger with optional `level`, `prefix`, `timestamp` |
| `debug` | `(...args: unknown[]) => void` | Log at debug level |
| `info` | `(...args: unknown[]) => void` | Log at info level |
| `warn` | `(...args: unknown[]) => void` | Log at warn level |
| `error` | `(...args: unknown[]) => void` | Log at error level |

`LoggerOptions`: `{ level?: LogLevel, prefix?: string, timestamp?: boolean }`

```typescript
import { Logger } from "all-you-need/entities";

const logger = new Logger({ level: "info", prefix: "[App]", timestamp: true });
logger.info("Server started");
logger.debug("This will be hidden"); // level is below "info"
```

### `JwtAuthManager`

Manages JWT authentication for multiple targets (e.g. multiple backends). Handles storage, expiration check, auth header injection, and subscriptions to auth changes.

| Method | Signature | Description |
|--------|-----------|-------------|
| `constructor` | `(config: { targets: Record<T, JwtAuthTargetConfig> }) => JwtAuthManager<T>` | Create manager with targets object; T inferred from keys, setToken/getToken etc. use typed target ids |
| `registerTarget` | `(id: T, config: JwtAuthTargetConfig) => void` | Register a new auth target |
| `setToken` | `(targetId: T, token: string) => void` | Store token for a target |
| `getToken` | `(targetId: T) => string \| null` | Get token for a target |
| `removeToken` | `(targetId: T) => void` | Remove token for a target |
| `isAuthenticated` | `(targetId: T, leewaySeconds?: number) => boolean` | Check if target has valid non-expired token |
| `isExpired` | `(targetId: T, leewaySeconds?: number) => boolean` | Check if target's token is expired |
| `getAuthHeaders` | `(targetId: T) => Record<string, string> \| null` | Get headers for HTTP request |
| `getPayload` | `(targetId: T) => JwtPayload \| null` | Get decoded JWT payload |
| `subscribe` | `(targetId: T, callback: (event: JwtAuthEvent) => void) => () => void` | Subscribe to auth changes; returns unsubscribe function |
| `refreshToken` | `(targetId: T, token: string) => void` | Update token (emits `refresh` event) |
| `markExpired` | `(targetId: T) => void` | Mark token as expired (e.g. on 401 response) |

**Utilities:** `decodeJwtPayload(token)`, `isJwtExpired(token, leewaySeconds?)`

`JwtAuthEvent`: `{ type: 'login' \| 'logout' \| 'expired' \| 'refresh'; token?: string; payload?: JwtPayload }`

```typescript
import { JwtAuthManager, TypedStorage } from "all-you-need/entities";

const manager = new JwtAuthManager({
  targets: {
    api: {
      storage: new TypedStorage({ adapter: localStorage, prefix: "jwt:api:" }),
    },
    auth: {
      storage: new TypedStorage({ adapter: localStorage, prefix: "jwt:auth:" }),
      headerName: "X-Auth-Token",
      headerFormat: (t) => t,
    },
  },
});

manager.subscribe("api", (event) => {
  if (event.type === "logout") {
    // redirect to login
  }
});

manager.setToken("api", response.access_token); // targetId typed as "api" | "auth"
const headers = manager.getAuthHeaders("api"); // { Authorization: "Bearer ..." }
```

## Utils

### String

| Name | Description | Signature |
|------|-------------|-----------|
| `capitalize` | Capitalize first letter of a string | `(str: string) => string` |
| `truncate` | Truncate string to max length with suffix (default `"..."`) | `(str: string, maxLength: number, suffix?: string) => string` |
| `slugify` | Convert string to URL-friendly slug | `(str: string) => string` |
| `toCamelCase` | Convert string to camelCase | `(str: string) => string` |
| `toKebabCase` | Convert string to kebab-case | `(str: string) => string` |
| `toPascalCase` | Convert string to PascalCase | `(str: string) => string` |
| `toSnakeCase` | Convert string to snake_case | `(str: string) => string` |
| `escapeHtml` | Escape HTML special characters to prevent XSS | `(str: string) => string` |
| `unescapeHtml` | Unescape HTML entities back to characters | `(str: string) => string` |
| `escapeRegExp` | Escape special regex characters in a string | `(str: string) => string` |
| `template` | Replace `{{key}}` placeholders with values from data object | `(str: string, data: Record<string, string \| number>) => string` |
| `maskString` | Mask middle characters (e.g. for credit cards, emails) | `(str: string, visibleStart?: number, visibleEnd?: number, maskChar?: string) => string` |
| `pluralize` | Russian pluralization — select correct word form by count | `(count: number, one: string, few: string, many: string) => string` |

### Array

| Name | Description | Signature |
|------|-------------|-----------|
| `chunk` | Split array into chunks of given size | `<T>(arr: T[], size: number) => T[][]` |
| `compact` | Remove falsy values (null, undefined, false, 0, "") from array | `<T>(arr: (T \| null \| undefined \| false \| 0 \| "")[]) => T[]` |
| `difference` | Elements in first array that are not in second | `<T>(a: T[], b: T[]) => T[]` |
| `first` | Get the first element of an array | `<T>(arr: T[]) => T \| undefined` |
| `last` | Get the last element of an array | `<T>(arr: T[]) => T \| undefined` |
| `flatten` | Recursively flatten a nested array | `<T>(arr: unknown[]) => T[]` |
| `groupBy` | Group array items by a key function | `<T, K>(arr: T[], keyFn: (item: T) => K) => Record<K, T[]>` |
| `intersection` | Elements present in both arrays | `<T>(a: T[], b: T[]) => T[]` |
| `range` | Generate an array of numbers from start to end | `(start: number, end: number, step?: number) => number[]` |
| `shuffle` | Randomly shuffle array elements (Fisher-Yates) | `<T>(arr: T[]) => T[]` |
| `sortBy` | Sort array by a key function (returns new array) | `<T>(arr: T[], keyFn: (item: T) => string \| number) => T[]` |
| `unique` | Remove duplicate values from an array | `<T>(arr: T[]) => T[]` |
| `uniqueBy` | Remove duplicates by a key function | `<T>(arr: T[], keyFn: (item: T) => unknown) => T[]` |
| `zip` | Combine two arrays into pairs | `<T, U>(a: T[], b: U[]) => [T, U][]` |

### Object

| Name | Description | Signature |
|------|-------------|-----------|
| `pick` | Create object with only specified keys | `<T, K>(obj: T, keys: K[]) => Pick<T, K>` |
| `omit` | Create object without specified keys | `<T, K>(obj: T, keys: K[]) => Omit<T, K>` |
| `deepClone` | Deep clone any value using structuredClone | `<T>(value: T) => T` |
| `deepEqual` | Recursively compare two values for equality | `(a: unknown, b: unknown) => boolean` |
| `deepMerge` | Recursively merge two objects | `<T, S>(target: T, source: S) => T & S` |
| `diff` | Get changed properties between two objects | `<T>(original: T, changed: T) => Partial<T>` |
| `flattenObject` | Flatten nested object to dot-notation keys | `(obj: Record<string, unknown>, prefix?: string, separator?: string) => Record<string, unknown>` |
| `isEmpty` | Check if value is empty (null, undefined, empty string/array/object) | `(value: unknown) => boolean` |
| `mapKeys` | Transform object keys using a mapping function | `<T>(obj: T, fn: (key: string) => string) => Record<string, T[keyof T]>` |
| `mapValues` | Transform object values using a mapping function | `<T, U>(obj: T, fn: (value: T[keyof T], key: string) => U) => Record<string, U>` |

### Number

| Name | Description | Signature |
|------|-------------|-----------|
| `clamp` | Restrict a number to a min/max range | `(value: number, min: number, max: number) => number` |
| `round` | Round number to specified decimal places (default 0) | `(value: number, decimals?: number) => number` |
| `randomInt` | Generate random integer in inclusive range | `(min: number, max: number) => number` |
| `sum` | Sum all numbers in an array | `(arr: number[]) => number` |
| `average` | Calculate arithmetic mean of an array | `(arr: number[]) => number` |
| `median` | Calculate median value of an array | `(arr: number[]) => number` |
| `percentage` | Calculate what percent value is of total | `(value: number, total: number) => number` |
| `formatNumber` | Format number with locale-aware separators (default `"ru-RU"`) | `(value: number, locale?: string) => string` |
| `formatCurrency` | Format number as currency (default `"RUB"`, `"ru-RU"`) | `(value: number, currency?: string, locale?: string) => string` |
| `formatBytes` | Format bytes into human-readable string (KB, MB, GB...) | `(bytes: number, decimals?: number) => string` |

### Date

| Name | Description | Signature |
|------|-------------|-----------|
| `formatDate` | Format date using `Intl.DateTimeFormat` (default `"ru-RU"`) | `(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string` |
| `relativeTime` | Get human-readable relative time (default `"ru-RU"`) | `(date: Date, locale?: string) => string` |
| `isToday` | Check if a date is today | `(date: Date) => boolean` |
| `isYesterday` | Check if a date is yesterday | `(date: Date) => boolean` |
| `addDays` | Add or subtract days from a date | `(date: Date, days: number) => Date` |
| `addMonths` | Add or subtract months from a date | `(date: Date, months: number) => Date` |
| `daysBetween` | Calculate absolute number of days between two dates | `(a: Date, b: Date) => number` |

### Async

| Name | Description | Signature |
|------|-------------|-----------|
| `sleep` | Pause execution for specified milliseconds | `(ms: number) => Promise<void>` |
| `debounce` | Delay function call until after a period of inactivity | `<T>(fn: T, ms: number) => (...args: Parameters<T>) => void` |
| `throttle` | Limit function to execute at most once per interval | `<T>(fn: T, ms: number) => (...args: Parameters<T>) => void` |
| `retry` | Retry an async function with configurable attempts, delay, and backoff factor | `<T>(fn: () => Promise<T>, options?: RetryOptions) => Promise<T>` |
| `timeout` | Reject a promise if it doesn't resolve within specified time | `<T>(promise: Promise<T>, ms: number) => Promise<T>` |
| `pLimit` | Limit number of concurrent async operations | `(concurrency: number) => <T>(fn: () => Promise<T>) => Promise<T>` |
| `pSettle` | Settle all promises and return results with status | `<T>(promises: Promise<T>[]) => Promise<SettledResult<T>[]>` |
| `tryCatch` | Go-style async error handling — returns `[error, result]` tuple | `<T>(fn: () => Promise<T>) => Promise<[null, T] \| [Error, null]>` |
| `tryCatchSync` | Go-style sync error handling — returns `[error, result]` tuple | `<T>(fn: () => T) => [null, T] \| [Error, null]` |

Also exports types: `RetryOptions`, `SettledOk<T>`, `SettledErr`, `SettledResult<T>`.

### Validation

| Name | Description | Signature |
|------|-------------|-----------|
| `isEmail` | Validate email address format | `(str: string) => boolean` |
| `isURL` | Validate URL format | `(str: string) => boolean` |
| `isPhone` | Validate phone number format | `(str: string) => boolean` |
| `isStrongPassword` | Check password strength (length, cases, digits, symbols) | `(str: string, options?: PasswordOptions) => boolean` |
| `isINN` | Validate Russian INN (taxpayer identification number) | `(str: string) => boolean` |

Also exports type: `PasswordOptions`.

### Type Guards

| Name | Description | Signature |
|------|-------------|-----------|
| `isString` | Check if value is a string | `(value: unknown) => value is string` |
| `isNumber` | Check if value is a finite number (excludes NaN) | `(value: unknown) => value is number` |
| `isBoolean` | Check if value is a boolean | `(value: unknown) => value is boolean` |
| `isArray` | Check if value is an array | `(value: unknown) => value is unknown[]` |
| `isObject` | Check if value is a plain object (not null, not array) | `(value: unknown) => value is Record<string, unknown>` |
| `isFunction` | Check if value is a function | `(value: unknown) => value is (...args: unknown[]) => unknown` |
| `isDefined` | Check if value is not undefined | `<T>(value: T \| undefined) => value is T` |
| `isNonNullable` | Check if value is not null and not undefined | `<T>(value: T) => value is NonNullable<T>` |
| `hasProperty` | Check if object has a specific property | `<K>(obj: unknown, key: K) => obj is Record<K, unknown>` |

### Environment

| Name | Description | Signature |
|------|-------------|-----------|
| `isBrowser` | Check if running in a browser environment | `() => boolean` |
| `isNode` | Check if running in Node.js | `() => boolean` |
| `isSSR` | Check if running in SSR (Node.js without DOM) | `() => boolean` |

### ID

| Name | Description | Signature |
|------|-------------|-----------|
| `uuid` | Generate a random UUID v4 | `() => string` |
| `nanoid` | Generate a compact URL-safe unique ID (default 21 chars) | `(size?: number) => string` |

## Scripts

```bash
npm run build        # Build with tsup
npm run test         # Run tests with Vitest
npm run lint         # Lint with ESLint
npm run lint:fix     # Lint and auto-fix
npm run typecheck    # TypeScript type checking
npm run publint      # Validate package.json and exports
npm run size         # Check bundle size with size-limit
```

## License

[MIT](./LICENSE)
