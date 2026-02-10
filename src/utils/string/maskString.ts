export function maskString(
  str: string,
  visibleStart: number = 0,
  visibleEnd: number = 0,
  maskChar: string = "*",
): string {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }

  const start = str.slice(0, visibleStart);
  const end = visibleEnd > 0 ? str.slice(-visibleEnd) : "";
  const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);

  return start + masked + end;
}
