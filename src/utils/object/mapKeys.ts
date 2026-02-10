export function mapKeys<T extends Record<string, unknown>>(
  obj: T,
  fn: (key: string) => string,
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};

  for (const key of Object.keys(obj)) {
    result[fn(key)] = obj[key] as T[keyof T];
  }

  return result;
}
