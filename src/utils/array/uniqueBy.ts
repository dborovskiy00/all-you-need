export function uniqueBy<T>(arr: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();

  return arr.filter((item) => {
    const key = keyFn(item);

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);

    return true;
  });
}
