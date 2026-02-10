export function diff<T extends Record<string, unknown>>(
  original: T,
  changed: T,
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(changed) as Array<keyof T>) {
    if (changed[key] !== original[key]) {
      result[key] = changed[key];
    }
  }

  return result;
}
