export class Result<T, E> {
  private constructor(
    private readonly _ok: boolean,
    private readonly _value: T | E,
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  static err<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, error);
  }

  isOk(): this is Result<T, never> {
    return this._ok;
  }

  isErr(): this is Result<never, E> {
    return !this._ok;
  }

  get value(): T {
    if (!this._ok) {
      throw new Error("Cannot get value of an Err result");
    }

    return this._value as T;
  }

  get error(): E {
    if (this._ok) {
      throw new Error("Cannot get error of an Ok result");
    }

    return this._value as E;
  }

  unwrap(): T {
    if (!this._ok) {
      throw this._value;
    }

    return this._value as T;
  }

  unwrapOr(defaultValue: T): T {
    if (this._ok) {
      return this._value as T;
    }

    return defaultValue;
  }

  unwrapErr(): E {
    if (this._ok) {
      throw new Error("Called unwrapErr on an Ok result");
    }

    return this._value as E;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._ok) {
      return Result.ok(fn(this._value as T));
    }

    return Result.err(this._value as E);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this._ok) {
      return Result.ok(this._value as T);
    }

    return Result.err(fn(this._value as E));
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._ok) {
      return fn(this._value as T);
    }

    return Result.err(this._value as E);
  }
}
