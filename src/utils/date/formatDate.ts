export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  locale: string = "ru-RU",
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}
