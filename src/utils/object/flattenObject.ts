export function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
  separator = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}${separator}${key}` : key;
    const value = obj[key];

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof RegExp)
    ) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, fullKey, separator),
      );
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}
