export function flatten<T>(arr: unknown[]): T[] {
  return arr.flat(Infinity) as T[];
}
