export function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);

  return a.filter((item) => set.has(item));
}
