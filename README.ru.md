# all-you-need

[![npm version](https://img.shields.io/npm/v/all-you-need)](https://www.npmjs.com/package/all-you-need)
[![bundle size](https://img.shields.io/bundlephobia/minzip/all-you-need)](https://bundlephobia.com/package/all-you-need)
[![license](https://img.shields.io/npm/l/all-you-need)](./LICENSE)

Универсальная TypeScript-библиотека утилит. Без зависимостей, поддерживает tree-shaking, работает в браузере и Node.js.

## Установка

```bash
npm install all-you-need
```

## Импорт

```typescript
// Всё сразу
import { chunk, Result, deepClone } from "all-you-need";

// По доменам
import { Result, Queue, Stack } from "all-you-need/entities";
import { chunk, debounce, isEmail } from "all-you-need/utils";

// Только типы
import type { DeepPartial, Nullable, Merge } from "all-you-need/types";
```

## Типы

### Объектные типы

| Тип | Описание |
|-----|----------|
| `DeepPartial<T>` | Делает все свойства опциональными рекурсивно |
| `DeepReadonly<T>` | Делает все свойства readonly рекурсивно |
| `Merge<T, S>` | Объединение двух типов, второй перезаписывает первый |
| `MutableKeys<T>` | Извлечь мутабельные ключи |
| `Prettify<T>` | Упростить сложные пересечения типов |
| `ReadonlyKeys<T>` | Извлечь readonly ключи |
| `RequiredDeep<T>` | Делает все свойства обязательными рекурсивно |
| `SetNonNullable<T, K>` | Сделать указанные ключи non-nullable |
| `SetOptional<T, K>` | Сделать указанные ключи опциональными |
| `SetRequired<T, K>` | Сделать указанные ключи обязательными |
| `Writable<T>` | Убрать readonly со всех свойств |
| `WritableDeep<T>` | Убрать readonly рекурсивно |

### Ключи

| Тип | Описание |
|-----|----------|
| `ConditionalKeys<T, Condition>` | Извлечь ключи, значения которых совпадают с условием |
| `ConditionalPick<T, Condition>` | Выбрать свойства по условию значения |
| `ConditionalExcept<T, Condition>` | Исключить свойства по условию значения |
| `Entries<T>` | Типобезопасный тип возврата `Object.entries()` |
| `OmitByValue<T, V>` | Исключить свойства по типу значения |
| `PickByValue<T, V>` | Выбрать свойства по типу значения |
| `StringKeyOf<T>` | Извлечь строковые ключи |
| `ValueOf<T>` | Извлечь типы значений объекта |

### Строковые типы

| Тип | Описание |
|-----|----------|
| `CamelCase<S>` | Преобразовать строковый литерал в camelCase |
| `KebabCase<S>` | Преобразовать строковый литерал в kebab-case |
| `Join<T, D>` | Соединить кортеж строк через разделитель |
| `Split<S, D>` | Разделить строковый литерал по разделителю |

### Union-типы

| Тип | Описание |
|-----|----------|
| `LiteralUnion<L, Base>` | Union с автодополнением для литералов |
| `TupleToUnion<T>` | Преобразовать кортеж в union |
| `UnionToIntersection<U>` | Преобразовать union в intersection |

### Асинхронные типы

| Тип | Описание |
|-----|----------|
| `AsyncReturnType<T>` | Развернуть тип возврата асинхронной функции |
| `Promisable<T>` | `T | PromiseLike<T>` |

### Общие типы

| Тип | Описание |
|-----|----------|
| `Branded<T, Brand>` | Номинальный/брендированный тип |
| `EmptyObject` | `Record<string, never>` |
| `IsEqual<A, B>` | Проверить равенство двух типов |
| `Nullable<T>` | `T | null` |
| `Optional<T>` | `T | undefined` |

### JSON-типы

| Тип | Описание |
|-----|----------|
| `JsonValue` | Любое допустимое JSON-значение |
| `JsonObject` | Тип JSON-объекта |
| `JsonArray` | Тип JSON-массива |
| `JsonPrimitive` | Тип JSON-примитива |

## Сущности

### `Result<T, E>`

Монадическая обработка ошибок — явные `Ok`/`Err` без исключений.

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

FIFO-очередь с методами `enqueue`, `dequeue`, `peek`, `size`, `isEmpty`, `clear`, `toArray`.

```typescript
import { Queue } from "all-you-need/entities";

const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
q.dequeue(); // 1
```

### `Stack<T>`

LIFO-стек с методами `push`, `pop`, `peek`, `size`, `isEmpty`, `clear`, `toArray`.

```typescript
import { Stack } from "all-you-need/entities";

const s = new Stack<number>();
s.push(1);
s.push(2);
s.pop(); // 2
```

### `TypedStorage`

Универсальная типизированная обёртка для `localStorage` / `sessionStorage` / кастомного хранилища с префиксом, TTL и сериализацией.

```typescript
import { TypedStorage } from "all-you-need/entities";

const storage = new TypedStorage({ prefix: "app_" });
storage.set("user", { name: "Dan" });
storage.get("user"); // { name: "Dan" }
```

### `Logger`

Логгер с уровнями (`debug`, `info`, `warn`, `error`), настраиваемым выводом и уровнями логирования.

```typescript
import { Logger } from "all-you-need/entities";

const logger = new Logger({ level: "info" });
logger.info("Server started");
logger.debug("This will be hidden");
```

## Утилиты

### Строки

| Функция | Сигнатура |
|---------|-----------|
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

### Массивы

| Функция | Сигнатура |
|---------|-----------|
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

### Объекты

| Функция | Сигнатура |
|---------|-----------|
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

### Числа

| Функция | Сигнатура |
|---------|-----------|
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

### Даты

| Функция | Сигнатура |
|---------|-----------|
| `formatDate` | `(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string` |
| `relativeTime` | `(date: Date, locale?: string) => string` |
| `isToday` | `(date: Date) => boolean` |
| `isYesterday` | `(date: Date) => boolean` |
| `addDays` | `(date: Date, days: number) => Date` |
| `addMonths` | `(date: Date, months: number) => Date` |
| `daysBetween` | `(a: Date, b: Date) => number` |

### Асинхронные

| Функция | Сигнатура |
|---------|-----------|
| `sleep` | `(ms: number) => Promise<void>` |
| `debounce` | `<T>(fn: T, ms: number) => (...args) => void` |
| `throttle` | `<T>(fn: T, ms: number) => (...args) => void` |
| `retry` | `<T>(fn: () => Promise<T>, options?: RetryOptions) => Promise<T>` |
| `timeout` | `<T>(promise: Promise<T>, ms: number) => Promise<T>` |
| `pLimit` | `(concurrency: number) => <T>(fn: () => Promise<T>) => Promise<T>` |
| `pSettle` | `<T>(promises: Promise<T>[]) => Promise<SettledResult<T>[]>` |
| `tryCatch` | `<T>(fn: () => Promise<T>) => Promise<[null, T] \| [Error, null]>` |

### Валидация

| Функция | Сигнатура |
|---------|-----------|
| `isEmail` | `(str: string) => boolean` |
| `isURL` | `(str: string) => boolean` |
| `isPhone` | `(str: string) => boolean` |
| `isStrongPassword` | `(str: string, options?: PasswordOptions) => boolean` |
| `isINN` | `(str: string) => boolean` |

### Тайп-гарды

| Функция | Сигнатура |
|---------|-----------|
| `isString` | `(value: unknown) => value is string` |
| `isNumber` | `(value: unknown) => value is number` |
| `isBoolean` | `(value: unknown) => value is boolean` |
| `isArray` | `(value: unknown) => value is unknown[]` |
| `isObject` | `(value: unknown) => value is Record<string, unknown>` |
| `isFunction` | `(value: unknown) => value is (...args: unknown[]) => unknown` |
| `isDefined` | `<T>(value: T \| undefined) => value is T` |
| `isNonNullable` | `<T>(value: T) => value is NonNullable<T>` |
| `hasProperty` | `<K>(obj: unknown, key: K) => obj is Record<K, unknown>` |

### Окружение

| Функция | Сигнатура |
|---------|-----------|
| `isBrowser` | `() => boolean` |
| `isNode` | `() => boolean` |
| `isSSR` | `() => boolean` |

### Генерация ID

| Функция | Сигнатура |
|---------|-----------|
| `uuid` | `() => string` |
| `nanoid` | `(size?: number) => string` |

## Скрипты

```bash
npm run build        # Сборка через tsup
npm run test         # Запуск тестов через Vitest
npm run lint         # Линтинг через ESLint
npm run lint:fix     # Линтинг с авто-исправлением
npm run typecheck    # Проверка типов TypeScript
npm run publint      # Валидация package.json и exports
npm run size         # Проверка размера бандла через size-limit
```

## Лицензия

[MIT](./LICENSE)
