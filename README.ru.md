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
| `JwtAuthTarget` | Один JWT auth target — хранение, жизненный цикл токена, формат заголовков, подписки |
| `JwtAuthManager` | Управляет несколькими экземплярами `JwtAuthTarget` — setToken, getAuthHeaders, subscribe и т.д. |
| `ApiClient` | Абстрактный HTTP-клиент; используйте `FetchApiClient` для transport на fetch |
| `ApiManager` | Управляет несколькими экземплярами ApiClient по типизированным идентификаторам |
| `AuthManager` | Связывает JwtAuthManager и ApiManager для login, logout, refresh — id targets должны совпадать с id clients |

Также экспортирует: `FetchApiClient`, `AuthApiClient`, `decodeJwtPayload`, `isJwtExpired`. Типы: `StorageOptions`, `TypedStorageConfig`, `LogLevel`, `LoggerOptions`, `JwtAuthTargetConfig`, `JwtAuthEvent`, `JwtPayload`, `TargetPayload`, `TargetHeaders`, `ApiClientConfig`, `ApiRequestConfig`, `ApiResponse`, `CancellableRequest`, `PreparedRequest`, `RequestInterceptor`, `RequestInterceptorConfig`, `ResponseInterceptor`, `ApiManagerConfig`, `AuthManagerConfig`, `AuthTokens`. 
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

### `JwtAuthTarget`

Один JWT auth target. Хранение токена, проверка истечения, формирование заголовков, подписки. Создавайте экземпляры и передавайте в `JwtAuthManager`.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config: JwtAuthTargetConfig<THeaders>) => JwtAuthTarget<TPayload, THeaders>` | Создать target с `storage` и опциональным `headersFormat` |
| `setToken` | `(token: string) => void` | Сохранить токен, событие `login` |
| `getToken` | `() => string \| null` | Получить токен |
| `setRefreshToken` | `(token: string) => void` | Сохранить refresh token |
| `getRefreshToken` | `() => string \| null` | Получить refresh token |
| `removeRefreshToken` | `() => void` | Удалить refresh token |
| `removeToken` | `() => void` | Удалить токен и refresh token, событие `logout` |
| `isAuthenticated` | `(leewaySeconds?: number) => boolean` | Проверить наличие валидного неистёкшего токена |
| `isExpired` | `(leewaySeconds?: number) => boolean` | Проверить истечение токена |
| `getAuthHeaders` | `() => THeaders \| null` | Получить заголовки (по умолчанию: `Authorization: Bearer <token>`) |
| `getPayload` | `() => TPayload \| null` | Получить декодированный JWT payload |
| `subscribe` | `(callback: (event: JwtAuthEvent) => void) => () => void` | Подписаться на изменения; возвращает отписку |
| `refreshToken` | `(token: string) => void` | Обновить токен, событие `refresh` |
| `markExpired` | `() => void` | Событие `expired` (например, при 401) |

`JwtAuthTargetConfig<THeaders>`: `{ storage: TypedStorage, headersFormat?: (token: string) => THeaders }`

### `JwtAuthManager`

Управляет несколькими экземплярами `JwtAuthTarget`. Принимает `Record` targets; id типизированы.

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config: { targets: Record<T, JwtAuthTarget> }) => JwtAuthManager<T>` | Создать менеджер с экземплярами targets |
| `getTargetIds` | `() => (keyof T)[]` | Получить все id targets |
| `hasTarget` | `(targetId: T) => boolean` | Проверить наличие target |
| `getTarget` | `(targetId: T) => JwtAuthTarget \| undefined` | Получить target по id |
| `getTargetOrThrow` | `(targetId: T) => JwtAuthTarget` | Получить target или выбросить |
| `registerTarget` | `(id: T, target: JwtAuthTarget) => void` | Добавить или заменить target |
| `setToken` | `(targetId: T, token: string) => void` | Сохранить токен для target |
| `getToken` | `(targetId: T) => string \| null` | Получить токен |
| `setRefreshToken` | `(targetId: T, token: string) => void` | Сохранить refresh token |
| `getRefreshToken` | `(targetId: T) => string \| null` | Получить refresh token |
| `removeRefreshToken` | `(targetId: T) => void` | Удалить refresh token |
| `removeToken` | `(targetId: T) => void` | Удалить токен |
| `isAuthenticated` | `(targetId: T, leewaySeconds?: number) => boolean` | Проверить валидность токена |
| `isExpired` | `(targetId: T, leewaySeconds?: number) => boolean` | Проверить истечение |
| `getAuthHeaders` | `(targetId: T) => Record<string, string> \| undefined` | Получить заголовки |
| `getPayload` | `(targetId: T) => JwtPayload \| undefined` | Получить payload |
| `subscribe` | `(targetId: T, callback: (event) => void) => () => void` | Подписаться на изменения |
| `refreshToken` | `(targetId: T, token: string) => void` | Обновить токен |
| `markExpired` | `(targetId: T) => void` | Пометить токен истёкшим |

**Утилиты:** `decodeJwtPayload(token): JwtPayload | null`, `isJwtExpired(token, leewaySeconds?): boolean`

`JwtAuthEvent`: `{ type: 'login' | 'logout' | 'expired' | 'refresh'; token?: string; payload?: JwtPayload }`

```typescript
import { JwtAuthManager, JwtAuthTarget, TypedStorage } from "all-you-need/entities";

const manager = new JwtAuthManager({
  targets: {
    api: new JwtAuthTarget({
      storage: new TypedStorage({ adapter: localStorage, prefix: "jwt:api:" }),
    }),
    auth: new JwtAuthTarget({
      storage: new TypedStorage({ adapter: localStorage, prefix: "jwt:auth:" }),
      headersFormat: (token) => ({ "X-Auth-Token": token }),
    }),
  },
});

manager.subscribe("api", (event) => {
  if (event.type === "logout") {
    // редирект на логин
  }
});

manager.setToken("api", response.access_token);
const headers = manager.getAuthHeaders("api"); // { Authorization: "Bearer ..." }
```

### `ApiClient` / `FetchApiClient`

Абстрактный базовый `ApiClient` определяет HTTP-интерфейс; подклассы реализуют transport через `doFetch`. Используйте `FetchApiClient` для экземпляров на fetch (по умолчанию при передаче конфига в ApiManager).

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config?: ApiClientConfig) => FetchApiClient` | Создать клиент с baseURL, headers, timeout, credentials, validateStatus |
| `get` | `<T>(url: string, config?: ApiRequestConfig) => Promise<ApiResponse<T>>` | GET-запрос; для `CancellableRequest<T>` используйте `config: { cancelable: true }` |
| `post` | `<T>(url: string, body?: BodyInit \| object, config?: ApiRequestConfig) => Promise<ApiResponse<T>>` | POST-запрос; для `CancellableRequest<T>` — `config: { cancelable: true }` |
| `put` | `<T>(url: string, body?: BodyInit \| object, config?: ApiRequestConfig) => Promise<ApiResponse<T>>` | PUT-запрос; для `CancellableRequest<T>` — `config: { cancelable: true }` |
| `patch` | `<T>(url: string, body?: BodyInit \| object, config?: ApiRequestConfig) => Promise<ApiResponse<T>>` | PATCH-запрос; для `CancellableRequest<T>` — `config: { cancelable: true }` |
| `delete` | `<T>(url: string, config?: ApiRequestConfig) => Promise<ApiResponse<T>>` | DELETE-запрос; для `CancellableRequest<T>` — `config: { cancelable: true }` |

`ApiClientConfig`: `{ baseURL?, headers?, timeout?, credentials?, validateStatus?, requestInterceptors?, responseInterceptors? }`

`ApiRequestConfig`: `{ headers?, timeout?, params?, signal?, cancelable? }` — при `cancelable: true` возвращает `CancellableRequest<T>` (не передавайте `signal`)

`CancellableRequest<T>`: `{ promise, abort, signal }` — для отменяемых запросов; вызовите `abort()` для отмены.

`ApiResponse<T>`: `{ data: T, status, statusText, headers }`

**Интерцепторы:** Добавляются через config или `useRequestInterceptor(fn)` / `useResponseInterceptor(fn)`. Request-интерцептор получает `RequestInterceptorConfig` (url, method, headers, body, signal, credentials) и возвращает изменённый конфиг. Response-интерцептор получает `ApiResponse<T>` и возвращает изменённый ответ. Поддерживают sync и async. `use*Interceptor` возвращает функцию отписки.

При статусе не 2xx (или по кастомному `validateStatus`) выбрасывает `ApiError` с полями `status`, `statusText`, `headers`, `responseBody`.

```typescript
import { FetchApiClient } from "all-you-need/entities";

const client = new FetchApiClient({
  baseURL: "https://api.example.com",
  headers: { "X-Custom": "value" },
  timeout: 5000,
});

const { data } = await client.get<User[]>("/users");
await client.post("/users", { name: "John" });

// С интерцепторами (например, добавление заголовка авторизации)
client.useRequestInterceptor((config) => {
  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// Отменяемый запрос (например, при размонтировании компонента)
const req = client.get<User[]>("/users", { cancelable: true });
req.promise.then(({ data }) => console.log(data)).catch(() => {});
// позже: req.abort()
```

### `ApiManager`

Управляет несколькими экземплярами `ApiClient` по типизированным строковым идентификаторам (аналогично `JwtAuthManager`).

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config?: ApiManagerConfig<T>) => ApiManager<T>` | Создать менеджер; `clients` принимает готовые экземпляры ApiClient |
| `createClient` | `(id: T, config: ApiClientConfig) => ApiClient` | Создать и зарегистрировать клиент (ошибка, если id уже есть) |
| `getClient` | `(id: T) => ApiClient \| undefined` | Получить клиент по id |
| `getClientOrThrow` | `(id: T) => ApiClient` | Получить клиент или выбросить, если не найден |
| `hasClient` | `(id: T) => boolean` | Проверить наличие клиента |
| `clearClient` | `(id: T) => void` | Удалить клиент |
| `clearAll` | `() => void` | Удалить все клиенты |
| `getClientIds` | `() => T[]` | Получить все зарегистрированные id |

```typescript
import { ApiManager, FetchApiClient } from "all-you-need/entities";

type ApiId = "main" | "auth" | "custom";

const customClient = new FetchApiClient({ baseURL: "https://custom.example.com" });

const manager = new ApiManager<Record<ApiId, FetchApiClient>>({
  clients: {
    main: new FetchApiClient({ baseURL: "https://api.example.com", timeout: 5000 }),
    auth: new FetchApiClient({ baseURL: "https://auth.example.com" }),
    custom: customClient,
  },
});

const main = manager.getClientOrThrow("main");
const users = await main.get<User[]>("/users");

manager.clearClient("auth");
manager.createClient("auth", { baseURL: "https://auth-v2.example.com" });
```

### `AuthManager`

Связывает `JwtAuthManager` (хранение токенов, истечение) и `ApiManager` (клиенты auth API). Id targets в `jwtAuthManager` должны совпадать с id clients в `authApiManager`. Клиенты должны наследовать `AuthApiClient` (реализовать `login`, `logout`, `refresh`).

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `constructor` | `(config: AuthManagerConfig) => AuthManager` | Создать менеджер; выбрасывает, если targets и clients не совпадают |
| `login` | `(targetId: T, ...credentials) => Promise<AuthTokens>` | Вызов client.login, сохранение токенов в JwtAuthManager |
| `logout` | `(targetId: T) => Promise<void>` | Вызов client.logout, удаление токенов |
| `refresh` | `(targetId: T) => Promise<AuthTokens>` | Получить refresh token из JwtAuthManager, вызов client.refresh, сохранение новых токенов |
| `getAuthData` | `(targetId: T) => JwtPayload \| undefined` | Получить JWT payload для target |
| `isAuthenticated` | `(targetId: T, leewaySeconds?: number) => boolean` | Проверить валидность токена |
| `subscribe` | `(targetId: T, callback: (event) => void) => () => void` | Подписаться на события auth для target |

Для token/headers используйте `jwtAuthManager` напрямую (храните ссылку).

`AuthManagerConfig`: `{ jwtAuthManager: JwtAuthManager<TTargets>, authApiManager: ApiManager<TClients> }` — id clients и targets должны совпадать.

```typescript
import {
  ApiManager,
  AuthApiClient,
  AuthManager,
  JwtAuthManager,
  JwtAuthTarget,
  TypedStorage,
} from "all-you-need/entities";
import type { AuthTokens, LoginCredentials } from "all-you-need/entities";

type AuthTarget = "main";

class AuthApiService extends AuthApiClient {
  override async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const { data } = await this.post<{ access_token: string; refresh_token?: string }>(
      "/login",
      credentials,
    );
    return { access_token: data.access_token, refresh_token: data.refresh_token };
  }

  override async logout(): Promise<void> {
    await this.post("/logout");
  }

  override async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await this.post<{ access_token: string; refresh_token?: string }>(
      "/refresh",
      { refresh_token: refreshToken },
    );
    return { access_token: data.access_token, refresh_token: data.refresh_token };
  }
}

const storage = new TypedStorage({ adapter: localStorage, prefix: "auth:" });
const jwtAuthManager = new JwtAuthManager({
  targets: { main: new JwtAuthTarget({ storage }) },
});

const authApiManager = new ApiManager({
  clients: { main: new AuthApiService({ baseURL: "https://auth.example.com" }) },
});

const authManager = new AuthManager({
  jwtAuthManager,
  authApiManager,
});

await authManager.login("main", { email: "u@ex.com", password: "***" });
const headers = jwtAuthManager.getAuthHeaders("main"); // { Authorization: "Bearer ..." }
await authManager.logout("main");
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
