# all-you-need

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

| Type | Description |
|------|-------------|
| `DeepPartial<T>` | Makes all properties optional recursively |
| `DeepReadonly<T>` | Makes all properties readonly recursively |
| `Merge<T, S>` | Merge two object types, second overrides first |
| `MutableKeys<T>` | Extract mutable keys from a type |
| `Prettify<T>` | Simplify complex intersection types for readability |
| `ReadonlyKeys<T>` | Extract readonly keys from a type |
| `RequiredDeep<T>` | Makes all properties required recursively |
| `SetNonNullable<T, K>` | Make specified keys non-nullable |
| `SetOptional<T, K>` | Make specified keys optional |
| `SetRequired<T, K>` | Make specified keys required |
| `Writable<T>` | Remove readonly from all properties |
| `WritableDeep<T>` | Remove readonly recursively |

### Keys

| Type | Description |
|------|-------------|
| `ConditionalKeys<T, Condition>` | Extract keys whose values match condition |
| `ConditionalPick<T, Condition>` | Pick properties whose values match condition |
| `ConditionalExcept<T, Condition>` | Omit properties whose values match condition |
| `Entries<T>` | Type-safe `Object.entries()` return type |
| `OmitByValue<T, V>` | Omit properties by value type |
| `PickByValue<T, V>` | Pick properties by value type |
| `StringKeyOf<T>` | Extract string keys from a type |
| `ValueOf<T>` | Extract value types from an object type |

### String

| Type | Description |
|------|-------------|
| `CamelCase<S>` | Convert string literal to camelCase |
| `KebabCase<S>` | Convert string literal to kebab-case |
| `Join<T, D>` | Join tuple of strings with a delimiter |
| `Split<S, D>` | Split string literal by a delimiter |

### Union

| Type | Description |
|------|-------------|
| `LiteralUnion<L, Base>` | Union with autocomplete for literals |
| `TupleToUnion<T>` | Convert tuple type to union |
| `UnionToIntersection<U>` | Convert union type to intersection |

### Async

| Type | Description |
|------|-------------|
| `AsyncReturnType<T>` | Unwrap return type of an async function |
| `Promisable<T>` | `T | PromiseLike<T>` |

### Common

| Type | Description |
|------|-------------|
| `Branded<T, Brand>` | Nominal/branded type |
| `EmptyObject` | `Record<string, never>` |
| `IsEqual<A, B>` | Check if two types are equal |
| `Nullable<T>` | `T | null` |
| `Optional<T>` | `T | undefined` |

### JSON

| Type | Description |
|------|-------------|
| `JsonValue` | Any valid JSON value |
| `JsonObject` | JSON object type |
| `JsonArray` | JSON array type |
| `JsonPrimitive` | JSON primitive type |

## Entities

### `Result<T, E>`

Monadic error handling — explicit `Ok`/`Err` without exceptions.

```typescript
import { Result } from "all-you-need/entities";

const ok = Result.ok(42);
const err = Result.err("not found");

ok.isOk();       // true
ok.unwrap();     // 42
err.unwrapOr(0); // 0

ok.map(x => x * 2).unwrap(); // 84
```

### `Queue<T>`

FIFO queue with `enqueue`, `dequeue`, `peek`, `size`, `isEmpty`, `clear`, `toArray`.

```typescript
import { Queue } from "all-you-need/entities";

const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
q.dequeue(); // 1
```

### `Stack<T>`

LIFO stack with `push`, `pop`, `peek`, `size`, `isEmpty`, `clear`, `toArray`.

```typescript
import { Stack } from "all-you-need/entities";

const s = new Stack<number>();
s.push(1);
s.push(2);
s.pop(); // 2
```

### `TypedStorage`

Universal typed wrapper for `localStorage` / `sessionStorage` / custom storage with prefix, TTL, and serialization.

```typescript
import { TypedStorage } from "all-you-need/entities";

const storage = new TypedStorage({ prefix: "app_" });
storage.set("user", { name: "Dan" });
storage.get("user"); // { name: "Dan" }
```

### `Logger`

Leveled logger (`debug`, `info`, `warn`, `error`) with customizable output and log levels.

```typescript
import { Logger } from "all-you-need/entities";

const logger = new Logger({ level: "info" });
logger.info("Server started");
logger.debug("This will be hidden");
```

## Utils

### String

| Function | Signature |
|----------|-----------|
| `capitalize` | `(str: string) => string` |
| `truncate` | `(str: string, maxLength: number, suffix?: string) => string` |
| `slugify` | `(str: string) => string` |
| `toCamelCase` | `(str: string) => string` |
| `toKebabCase` | `(str: string) => string` |
| `toPascalCase` | `(str: string) => string` |
| `toSnakeCase` | `(str: string) => string` |
| `escapeHtml` | `(str: string) => string` |
| `unescapeHtml` | `(str: string) => string` |
| `escapeRegExp` | `(str: string) => string` |
| `template` | `(str: string, data: Record<string, string \| number>) => string` |
| `maskString` | `(str: string, visibleStart?: number, visibleEnd?: number, maskChar?: string) => string` |
| `pluralize` | `(count: number, one: string, few: string, many: string) => string` |

### Array

| Function | Signature |
|----------|-----------|
| `chunk` | `<T>(arr: T[], size: number) => T[][]` |
| `compact` | `<T>(arr: (T \| null \| undefined \| false \| 0 \| "")[]) => T[]` |
| `difference` | `<T>(a: T[], b: T[]) => T[]` |
| `first` | `<T>(arr: T[]) => T \| undefined` |
| `last` | `<T>(arr: T[]) => T \| undefined` |
| `flatten` | `<T>(arr: unknown[]) => T[]` |
| `groupBy` | `<T, K>(arr: T[], keyFn: (item: T) => K) => Record<K, T[]>` |
| `intersection` | `<T>(a: T[], b: T[]) => T[]` |
| `range` | `(start: number, end: number, step?: number) => number[]` |
| `shuffle` | `<T>(arr: T[]) => T[]` |
| `sortBy` | `<T>(arr: T[], keyFn: (item: T) => string \| number) => T[]` |
| `unique` | `<T>(arr: T[]) => T[]` |
| `uniqueBy` | `<T>(arr: T[], keyFn: (item: T) => unknown) => T[]` |
| `zip` | `<T, U>(a: T[], b: U[]) => [T, U][]` |

### Object

| Function | Signature |
|----------|-----------|
| `pick` | `<T, K>(obj: T, keys: K[]) => Pick<T, K>` |
| `omit` | `<T, K>(obj: T, keys: K[]) => Omit<T, K>` |
| `deepClone` | `<T>(value: T) => T` |
| `deepEqual` | `(a: unknown, b: unknown) => boolean` |
| `deepMerge` | `<T, S>(target: T, source: S) => T & S` |
| `diff` | `<T>(original: T, changed: T) => Partial<T>` |
| `flattenObject` | `(obj: Record<string, unknown>, prefix?: string, separator?: string) => Record<string, unknown>` |
| `isEmpty` | `(value: unknown) => boolean` |
| `mapKeys` | `<T>(obj: T, fn: (key: string) => string) => Record<string, T[keyof T]>` |
| `mapValues` | `<T, U>(obj: T, fn: (value: T[keyof T], key: string) => U) => Record<string, U>` |

### Number

| Function | Signature |
|----------|-----------|
| `clamp` | `(value: number, min: number, max: number) => number` |
| `round` | `(value: number, decimals?: number) => number` |
| `randomInt` | `(min: number, max: number) => number` |
| `sum` | `(arr: number[]) => number` |
| `average` | `(arr: number[]) => number` |
| `median` | `(arr: number[]) => number` |
| `percentage` | `(value: number, total: number) => number` |
| `formatNumber` | `(value: number, locale?: string) => string` |
| `formatCurrency` | `(value: number, currency?: string, locale?: string) => string` |
| `formatBytes` | `(bytes: number, decimals?: number) => string` |

### Date

| Function | Signature |
|----------|-----------|
| `formatDate` | `(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string` |
| `relativeTime` | `(date: Date, locale?: string) => string` |
| `isToday` | `(date: Date) => boolean` |
| `isYesterday` | `(date: Date) => boolean` |
| `addDays` | `(date: Date, days: number) => Date` |
| `addMonths` | `(date: Date, months: number) => Date` |
| `daysBetween` | `(a: Date, b: Date) => number` |

### Async

| Function | Signature |
|----------|-----------|
| `sleep` | `(ms: number) => Promise<void>` |
| `debounce` | `<T>(fn: T, ms: number) => (...args) => void` |
| `throttle` | `<T>(fn: T, ms: number) => (...args) => void` |
| `retry` | `<T>(fn: () => Promise<T>, options?: RetryOptions) => Promise<T>` |
| `timeout` | `<T>(promise: Promise<T>, ms: number) => Promise<T>` |
| `pLimit` | `(concurrency: number) => <T>(fn: () => Promise<T>) => Promise<T>` |
| `pSettle` | `<T>(promises: Promise<T>[]) => Promise<SettledResult<T>[]>` |
| `tryCatch` | `<T>(fn: () => Promise<T>) => Promise<[null, T] \| [Error, null]>` |

### Validation

| Function | Signature |
|----------|-----------|
| `isEmail` | `(str: string) => boolean` |
| `isURL` | `(str: string) => boolean` |
| `isPhone` | `(str: string) => boolean` |
| `isStrongPassword` | `(str: string, options?: PasswordOptions) => boolean` |
| `isINN` | `(str: string) => boolean` |

### Type Guards

| Function | Signature |
|----------|-----------|
| `isString` | `(value: unknown) => value is string` |
| `isNumber` | `(value: unknown) => value is number` |
| `isBoolean` | `(value: unknown) => value is boolean` |
| `isArray` | `(value: unknown) => value is unknown[]` |
| `isObject` | `(value: unknown) => value is Record<string, unknown>` |
| `isFunction` | `(value: unknown) => value is (...args: unknown[]) => unknown` |
| `isDefined` | `<T>(value: T \| undefined) => value is T` |
| `isNonNullable` | `<T>(value: T) => value is NonNullable<T>` |
| `hasProperty` | `<K>(obj: unknown, key: K) => obj is Record<K, unknown>` |

### Environment

| Function | Signature |
|----------|-----------|
| `isBrowser` | `() => boolean` |
| `isNode` | `() => boolean` |
| `isSSR` | `() => boolean` |

### ID

| Function | Signature |
|----------|-----------|
| `uuid` | `() => string` |
| `nanoid` | `(size?: number) => string` |

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
