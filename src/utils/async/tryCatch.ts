export async function tryCatch<T>(
  fn: () => Promise<T>,
): Promise<[null, T] | [Error, null]> {
  try {
    const value = await fn();

    return [null, value];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error, null];
    }

    return [new Error(String(error)), null];
  }
}

export function tryCatchSync<T>(fn: () => T): [null, T] | [Error, null] {
  try {
    const value = fn();

    return [null, value];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error, null];
    }

    return [new Error(String(error)), null];
  }
}
