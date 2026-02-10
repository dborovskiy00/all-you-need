export function daysBetween(a: Date, b: Date): number {
  const MS_PER_DAY = 86_400_000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.abs(Math.floor((utcB - utcA) / MS_PER_DAY));
}
