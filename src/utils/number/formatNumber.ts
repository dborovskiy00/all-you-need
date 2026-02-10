export function formatNumber(value: number, locale: string = "ru-RU"): string {
  return new Intl.NumberFormat(locale).format(value);
}
