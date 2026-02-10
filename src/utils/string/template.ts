export function template(
  str: string,
  data: Record<string, string | number>,
): string {
  return str.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in data) {
      return String(data[key]);
    }

    return match;
  });
}
