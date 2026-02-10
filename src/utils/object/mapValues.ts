export function mapValues<T extends Record<string, unknown>, U>(
  obj: T,
  fn: (value: T[keyof T], key: string) => U,
): Record<string, U> {
  const result: Record<string, U> = {};

  for (const key of Object.keys(obj)) {
    result[key] = fn(obj[key] as T[keyof T], key);
  }

  return result;
}
