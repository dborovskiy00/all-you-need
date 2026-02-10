export function difference<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);

  return a.filter((item) => !set.has(item));
}
