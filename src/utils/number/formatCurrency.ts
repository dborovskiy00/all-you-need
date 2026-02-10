export function formatCurrency(
  value: number,
  currency: string = "RUB",
  locale: string = "ru-RU",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
