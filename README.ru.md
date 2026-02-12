# all-you-need

[English](./README.md) | **Русский**

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

| Название | Описание |
|----------|----------|
| `DeepPartial<T>` | Делает все свойства опциональными рекурсивно |
| `DeepReadonly<T>` | Делает все свойства readonly рекурсивно |
| `Merge<T, S>` | Объединение двух типов, второй перезаписывает первый |
| `MutableKeys<T>` | Извлечь мутабельные (не readonly) ключи типа |
| `Prettify<T>` | Упростить сложные пересечения типов для читаемости в подсказках IDE |
| `ReadonlyKeys<T>` | Извлечь readonly ключи типа |
| `RequiredDeep<T>` | Делает все свойства обязательными рекурсивно |
| `SetNonNullable<T, K>` | Сделать указанные ключи non-nullable |
| `SetOptional<T, K>` | Сделать указанные ключи опциональными |
| `SetRequired<T, K>` | Сделать указанные ключи обязательными |
| `Writable<T>` | Убрать readonly со всех свойств (поверхностно) |
| `WritableDeep<T>` | Убрать readonly со всех свойств рекурсивно |

### Ключи

| Название | Описание |
|----------|----------|
| `ConditionalKeys<T, Condition>` | Извлечь ключи, значения которых расширяют указанный тип-условие |
| `ConditionalPick<T, Condition>` | Выбрать свойства, значения которых расширяют тип-условие |
| `ConditionalExcept<T, Condition>` | Исключить свойства, значения которых расширяют тип-условие |
| `Entries<T>` | Типобезопасный тип возврата `Object.entries()` |
| `OmitByValue<T, V>` | Исключить свойства по типу значения |
| `PickByValue<T, V>` | Выбрать свойства по типу значения |
| `StringKeyOf<T>` | Извлечь только строковые ключи типа (без `number` и `symbol`) |
| `ValueOf<T>` | Union всех типов значений объекта |

### Строковые типы

| Название | Описание |
|----------|----------|
| `CamelCase<S>` | Преобразовать строковый литерал в camelCase |
| `KebabCase<S>` | Преобразовать строковый литерал в kebab-case |
| `Join<T, D>` | Соединить кортеж строковых литералов через разделитель |
| `Split<S, D>` | Разделить строковый литерал по разделителю в кортеж |

### Union-типы

| Название | Описание |
|----------|----------|
| `LiteralUnion<L, Base>` | Union с сохранением автодополнения для литеральных типов в IDE |
| `TupleToUnion<T>` | Преобразовать кортеж/массив в union его элементов |
| `UnionToIntersection<U>` | Преобразовать union в intersection |

### Асинхронные типы

| Название | Описание |
|----------|----------|
| `AsyncReturnType<T>` | Извлечь развёрнутый тип возврата асинхронной функции |
| `Promisable<T>` | Значение, которое может быть `T` или `PromiseLike<T>` |

### Общие типы

| Название | Описание |
|----------|----------|
| `Branded<T, Brand>` | Номинальный/брендированный тип для различения структурно идентичных типов |
| `EmptyObject` | Тип объекта без свойств (`Record<string, never>`) |
| `IsEqual<A, B>` | Проверка на уровне типов, что два типа точно равны |
| `Nullable<T>` | `T \| null` |
| `Optional<T>` | `T \| undefined` |

### JSON-типы

| Название | Описание |
|----------|----------|
| `JsonValue` | Любое допустимое JSON-значение (примитив, объект или массив) |
| `JsonObject` | JSON-совместимый объект (`Record<string, JsonValue>`) |
| `JsonArray` | JSON-совместимый массив (`JsonValue[]`) |
| `JsonPrimitive` | JSON-примитив: `string \| number \| boolean \| null` |

## Сущности

| Название | Описание |
|----------|----------|
| `Result<T, E>` | Монадическая обработка ошибок с явными `Ok`/`Err` — без исключений |
| `Queue<T>` | FIFO-очередь |
| `Stack<T>` | LIFO-стек |
| `TypedStorage` | Универсальная типизированная обёртка для хранилищ с префиксом и TTL |
| `Logger` | Логгер с уровнями, префиксом и таймстампом |
| `JwtAuthManager` | Менеджер JWT-авторизации для нескольких бэкендов — хранение, истечение, заголовки, подписки |

Также экспортирует типы: `StorageOptions`, `TypedStorageConfig`, `LogLevel`, `LoggerOptions`, `JwtAuthTargetConfig`, `JwtAuthEvent`, `JwtPayload`, `JwtStorageAdapter`.

### `Result<T, E>`

Монадическая обработка ошибок — явные `Ok`/`Err` без исключений.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `Result.ok` | `<T>(value: T) => Result<T, never>` | Создать успешный результат |
| `Result.err` | `<E>(error: E) => Result<never, E>` | Создать результат с ошибкой |
| `isOk` | `() => this is Result<T, never>` | Тайп-гард — проверить, что результат Ok |
| `isErr` | `() => this is Result<never, E>` | Тайп-гард — проверить, что результат Err |
| `value` | `get value(): T` | Получить Ok-значение (бросает ошибку, если Err) |
| `error` | `get error(): E` | Получить Err-значение (бросает ошибку, если Ok) |
| `unwrap` | `() => T` | Получить значение или выбросить ошибку, если Err |
| `unwrapOr` | `(defaultValue: T) => T` | Получить значение или вернуть значение по умолчанию |
| `unwrapErr` | `() => E` | Получить ошибку или выбросить, если Ok |
| `map` | `<U>(fn: (value: T) => U) => Result<U, E>` | Преобразовать значение Ok |
| `mapErr` | `<F>(fn: (error: E) => F) => Result<T, F>` | Преобразовать значение Err |
| `flatMap` | `<U>(fn: (value: T) => Result<U, E>) => Result<U, E>` | Цепочка операций, возвращающих Result |

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

FIFO-очередь.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `enqueue` | `(item: T) => void` | Добавить элемент в конец очереди |
| `dequeue` | `() => T \| undefined` | Извлечь элемент из начала очереди |
| `peek` | `() => T \| undefined` | Посмотреть первый элемент без извлечения |
| `size` | `get size(): number` | Количество элементов в очереди |
| `isEmpty` | `get isEmpty(): boolean` | Пуста ли очередь |
| `clear` | `() => void` | Удалить все элементы |
| `toArray` | `() => T[]` | Преобразовать в массив |

```typescript
import { Queue } from "all-you-need/entities";

const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
q.dequeue(); // 1
```

### `Stack<T>`

LIFO-стек.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `push` | `(item: T) => void` | Добавить элемент на вершину |
| `pop` | `() => T \| undefined` | Извлечь элемент с вершины |
| `peek` | `() => T \| undefined` | Посмотреть верхний элемент без извлечения |
| `size` | `get size(): number` | Количество элементов в стеке |
| `isEmpty` | `get isEmpty(): boolean` | Пуст ли стек |
| `clear` | `() => void` | Удалить все элементы |
| `toArray` | `() => T[]` | Преобразовать в массив |

```typescript
import { Stack } from "all-you-need/entities";

const s = new Stack<number>();
s.push(1);
s.push(2);
s.pop(); // 2
```

### `TypedStorage`

Универсальная типизированная обёртка для `localStorage` / `sessionStorage` / кастомного хранилища с префиксом, TTL и JSON-сериализацией.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config: TypedStorageConfig) => TypedStorage` | Создать хранилище с `adapter` и опциональным `prefix` |
| `get` | `<T>(key: string) => T \| null` | Получить типизированное значение (null, если нет или истёк TTL) |
| `set` | `<T>(key: string, value: T, options?: StorageOptions) => void` | Сохранить значение с опциональным TTL (в мс) |
| `remove` | `(key: string) => void` | Удалить ключ |
| `has` | `(key: string) => boolean` | Проверить наличие ключа (с учётом TTL) |
| `clear` | `() => void` | Удалить все ключи (только с префиксом, если задан) |
| `keys` | `() => string[]` | Получить все ключи (возвращаются без префикса) |

```typescript
import { TypedStorage } from "all-you-need/entities";

const storage = new TypedStorage({
  adapter: localStorage,
  prefix: "app_",
});

storage.set("user", { name: "Dan" });
storage.get("user"); // { name: "Dan" }
storage.set("token", "abc", { ttl: 60000 }); // истекает через 60с
```

### `Logger`

Логгер с уровнями, опциональным префиксом и таймстампом.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(options?: LoggerOptions) => Logger` | Создать логгер с опциональным `level`, `prefix`, `timestamp` |
| `debug` | `(...args: unknown[]) => void` | Лог на уровне debug |
| `info` | `(...args: unknown[]) => void` | Лог на уровне info |
| `warn` | `(...args: unknown[]) => void` | Лог на уровне warn |
| `error` | `(...args: unknown[]) => void` | Лог на уровне error |

`LoggerOptions`: `{ level?: LogLevel, prefix?: string, timestamp?: boolean }`

```typescript
import { Logger } from "all-you-need/entities";

const logger = new Logger({ level: "info", prefix: "[App]", timestamp: true });
logger.info("Server started");
logger.debug("This will be hidden"); // уровень ниже "info"
```

### `JwtAuthManager`

Управляет JWT-авторизацией для нескольких целей (например, разных бэкендов). Хранение токенов, проверка истечения, формирование заголовков запросов, подписка на изменения авторизации.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config: { storage: JwtStorageAdapter; targets?: JwtAuthTargetConfig[] }) => JwtAuthManager` | Создать менеджер с хранилищем и опциональными целями |
| `registerTarget` | `(config: JwtAuthTargetConfig) => void` | Зарегистрировать новую цель авторизации |
| `setToken` | `(targetId: string, token: string) => void` | Сохранить токен для цели |
| `getToken` | `(targetId: string) => string \| null` | Получить токен для цели |
| `removeToken` | `(targetId: string) => void` | Удалить токен для цели |
| `isAuthenticated` | `(targetId: string, leewaySeconds?: number) => boolean` | Проверить наличие валидного неистёкшего токена |
| `isExpired` | `(targetId: string, leewaySeconds?: number) => boolean` | Проверить истечение токена |
| `getAuthHeaders` | `(targetId: string) => Record<string, string> \| null` | Получить заголовки для HTTP-запроса |
| `getPayload` | `(targetId: string) => JwtPayload \| null` | Получить декодированный JWT payload |
| `subscribe` | `(targetId: string, callback: (event: JwtAuthEvent) => void) => () => void` | Подписаться на изменения авторизации; возвращает функцию отписки |
| `refreshToken` | `(targetId: string, token: string) => void` | Обновить токен (событие `refresh`) |
| `markExpired` | `(targetId: string) => void` | Пометить токен как истёкший (например, при 401) |

**Утилиты:** `decodeJwtPayload(token)`, `isJwtExpired(token, leewaySeconds?)`

`JwtAuthEvent`: `{ type: 'login' \| 'logout' \| 'expired' \| 'refresh'; token?: string; payload?: JwtPayload }`

```typescript
import { JwtAuthManager } from "all-you-need/entities";

const manager = new JwtAuthManager({
  storage: localStorage,
  targets: [
    { id: "api", storageKey: "jwt:api" },
    {
      id: "auth",
      storageKey: "jwt:auth",
      headerName: "X-Auth-Token",
      headerFormat: (t) => t,
    },
  ],
});

manager.subscribe("api", (event) => {
  if (event.type === "logout") {
    // редирект на логин
  }
});

manager.setToken("api", response.access_token);
const headers = manager.getAuthHeaders("api"); // { Authorization: "Bearer ..." }
```

## Утилиты

### Строки

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `capitalize` | Сделать первую букву заглавной | `(str: string) => string` |
| `truncate` | Обрезать строку до максимальной длины с суффиксом (по умолчанию `"..."`) | `(str: string, maxLength: number, suffix?: string) => string` |
| `slugify` | Преобразовать строку в URL-friendly slug | `(str: string) => string` |
| `toCamelCase` | Преобразовать строку в camelCase | `(str: string) => string` |
| `toKebabCase` | Преобразовать строку в kebab-case | `(str: string) => string` |
| `toPascalCase` | Преобразовать строку в PascalCase | `(str: string) => string` |
| `toSnakeCase` | Преобразовать строку в snake_case | `(str: string) => string` |
| `escapeHtml` | Экранировать HTML-спецсимволы для защиты от XSS | `(str: string) => string` |
| `unescapeHtml` | Декодировать HTML-сущности обратно в символы | `(str: string) => string` |
| `escapeRegExp` | Экранировать спецсимволы регулярных выражений | `(str: string) => string` |
| `template` | Заменить `{{key}}` плейсхолдеры значениями из объекта | `(str: string, data: Record<string, string \| number>) => string` |
| `maskString` | Замаскировать символы строки (для карт, email и т.д.) | `(str: string, visibleStart?: number, visibleEnd?: number, maskChar?: string) => string` |
| `pluralize` | Русская плюрализация — выбрать правильную форму слова по числу | `(count: number, one: string, few: string, many: string) => string` |

### Массивы

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `chunk` | Разбить массив на части указанного размера | `<T>(arr: T[], size: number) => T[][]` |
| `compact` | Удалить falsy-значения (null, undefined, false, 0, "") | `<T>(arr: (T \| null \| undefined \| false \| 0 \| "")[]) => T[]` |
| `difference` | Элементы первого массива, отсутствующие во втором | `<T>(a: T[], b: T[]) => T[]` |
| `first` | Получить первый элемент массива | `<T>(arr: T[]) => T \| undefined` |
| `last` | Получить последний элемент массива | `<T>(arr: T[]) => T \| undefined` |
| `flatten` | Рекурсивно «расплющить» вложенный массив | `<T>(arr: unknown[]) => T[]` |
| `groupBy` | Сгруппировать элементы по ключевой функции | `<T, K>(arr: T[], keyFn: (item: T) => K) => Record<K, T[]>` |
| `intersection` | Элементы, присутствующие в обоих массивах | `<T>(a: T[], b: T[]) => T[]` |
| `range` | Сгенерировать массив чисел от start до end | `(start: number, end: number, step?: number) => number[]` |
| `shuffle` | Случайно перемешать элементы (Fisher-Yates) | `<T>(arr: T[]) => T[]` |
| `sortBy` | Отсортировать по ключевой функции (возвращает новый массив) | `<T>(arr: T[], keyFn: (item: T) => string \| number) => T[]` |
| `unique` | Удалить дубликаты из массива | `<T>(arr: T[]) => T[]` |
| `uniqueBy` | Удалить дубликаты по ключевой функции | `<T>(arr: T[], keyFn: (item: T) => unknown) => T[]` |
| `zip` | Объединить два массива в пары | `<T, U>(a: T[], b: U[]) => [T, U][]` |

### Объекты

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `pick` | Создать объект только с указанными ключами | `<T, K>(obj: T, keys: K[]) => Pick<T, K>` |
| `omit` | Создать объект без указанных ключей | `<T, K>(obj: T, keys: K[]) => Omit<T, K>` |
| `deepClone` | Глубокое клонирование через structuredClone | `<T>(value: T) => T` |
| `deepEqual` | Рекурсивное сравнение двух значений | `(a: unknown, b: unknown) => boolean` |
| `deepMerge` | Рекурсивное слияние двух объектов | `<T, S>(target: T, source: S) => T & S` |
| `diff` | Получить изменённые свойства между двумя объектами | `<T>(original: T, changed: T) => Partial<T>` |
| `flattenObject` | Развернуть вложенный объект в плоский с dot-нотацией ключей | `(obj: Record<string, unknown>, prefix?: string, separator?: string) => Record<string, unknown>` |
| `isEmpty` | Проверить пустоту (null, undefined, пустая строка/массив/объект) | `(value: unknown) => boolean` |
| `mapKeys` | Преобразовать ключи объекта через функцию | `<T>(obj: T, fn: (key: string) => string) => Record<string, T[keyof T]>` |
| `mapValues` | Преобразовать значения объекта через функцию | `<T, U>(obj: T, fn: (value: T[keyof T], key: string) => U) => Record<string, U>` |

### Числа

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `clamp` | Ограничить число в диапазоне min/max | `(value: number, min: number, max: number) => number` |
| `round` | Округлить до указанного количества знаков (по умолчанию 0) | `(value: number, decimals?: number) => number` |
| `randomInt` | Случайное целое число в указанном диапазоне (включительно) | `(min: number, max: number) => number` |
| `sum` | Сумма всех чисел в массиве | `(arr: number[]) => number` |
| `average` | Среднее арифметическое массива | `(arr: number[]) => number` |
| `median` | Медиана массива | `(arr: number[]) => number` |
| `percentage` | Вычислить процент value от total | `(value: number, total: number) => number` |
| `formatNumber` | Форматировать число с разделителями по локали (по умолчанию `"ru-RU"`) | `(value: number, locale?: string) => string` |
| `formatCurrency` | Форматировать число как валюту (по умолчанию `"RUB"`, `"ru-RU"`) | `(value: number, currency?: string, locale?: string) => string` |
| `formatBytes` | Форматировать байты в человекочитаемый вид (KB, MB, GB...) | `(bytes: number, decimals?: number) => string` |

### Даты

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `formatDate` | Форматировать дату через `Intl.DateTimeFormat` (по умолчанию `"ru-RU"`) | `(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string` |
| `relativeTime` | Относительное время (по умолчанию `"ru-RU"`) | `(date: Date, locale?: string) => string` |
| `isToday` | Проверить, что дата — сегодня | `(date: Date) => boolean` |
| `isYesterday` | Проверить, что дата — вчера | `(date: Date) => boolean` |
| `addDays` | Добавить или вычесть дни | `(date: Date, days: number) => Date` |
| `addMonths` | Добавить или вычесть месяцы | `(date: Date, months: number) => Date` |
| `daysBetween` | Абсолютное количество дней между двумя датами | `(a: Date, b: Date) => number` |

### Асинхронные

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `sleep` | Пауза на указанное количество миллисекунд | `(ms: number) => Promise<void>` |
| `debounce` | Отложить вызов до окончания периода бездействия | `<T>(fn: T, ms: number) => (...args: Parameters<T>) => void` |
| `throttle` | Ограничить вызов функции не чаще одного раза за интервал | `<T>(fn: T, ms: number) => (...args: Parameters<T>) => void` |
| `retry` | Повторять асинхронную функцию с настраиваемыми попытками, задержкой и множителем | `<T>(fn: () => Promise<T>, options?: RetryOptions) => Promise<T>` |
| `timeout` | Отклонить промис, если не выполнится за указанное время | `<T>(promise: Promise<T>, ms: number) => Promise<T>` |
| `pLimit` | Ограничить количество одновременных асинхронных операций | `(concurrency: number) => <T>(fn: () => Promise<T>) => Promise<T>` |
| `pSettle` | Дождаться всех промисов и вернуть результаты со статусом | `<T>(promises: Promise<T>[]) => Promise<SettledResult<T>[]>` |
| `tryCatch` | Асинхронная обработка ошибок в стиле Go — кортеж `[error, result]` | `<T>(fn: () => Promise<T>) => Promise<[null, T] \| [Error, null]>` |
| `tryCatchSync` | Синхронная обработка ошибок в стиле Go — кортеж `[error, result]` | `<T>(fn: () => T) => [null, T] \| [Error, null]` |

Также экспортирует типы: `RetryOptions`, `SettledOk<T>`, `SettledErr`, `SettledResult<T>`.

### Валидация

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `isEmail` | Проверить формат email-адреса | `(str: string) => boolean` |
| `isURL` | Проверить формат URL | `(str: string) => boolean` |
| `isPhone` | Проверить формат номера телефона | `(str: string) => boolean` |
| `isStrongPassword` | Проверить надёжность пароля (длина, регистр, цифры, символы) | `(str: string, options?: PasswordOptions) => boolean` |
| `isINN` | Проверить ИНН (идентификационный номер налогоплательщика) | `(str: string) => boolean` |

Также экспортирует тип: `PasswordOptions`.

### Тайп-гарды

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `isString` | Проверить, что значение — строка | `(value: unknown) => value is string` |
| `isNumber` | Проверить, что значение — конечное число (исключает NaN) | `(value: unknown) => value is number` |
| `isBoolean` | Проверить, что значение — boolean | `(value: unknown) => value is boolean` |
| `isArray` | Проверить, что значение — массив | `(value: unknown) => value is unknown[]` |
| `isObject` | Проверить, что значение — объект (не null, не массив) | `(value: unknown) => value is Record<string, unknown>` |
| `isFunction` | Проверить, что значение — функция | `(value: unknown) => value is (...args: unknown[]) => unknown` |
| `isDefined` | Проверить, что значение не undefined | `<T>(value: T \| undefined) => value is T` |
| `isNonNullable` | Проверить, что значение не null и не undefined | `<T>(value: T) => value is NonNullable<T>` |
| `hasProperty` | Проверить наличие свойства у объекта | `<K>(obj: unknown, key: K) => obj is Record<K, unknown>` |

### Окружение

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `isBrowser` | Проверить, что код выполняется в браузере | `() => boolean` |
| `isNode` | Проверить, что код выполняется в Node.js | `() => boolean` |
| `isSSR` | Проверить, что код выполняется в SSR (Node.js без DOM) | `() => boolean` |

### Генерация ID

| Название | Описание | Сигнатура |
|----------|----------|-----------|
| `uuid` | Сгенерировать случайный UUID v4 | `() => string` |
| `nanoid` | Сгенерировать компактный URL-safe уникальный ID (по умолчанию 21 символ) | `(size?: number) => string` |

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
