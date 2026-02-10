export function relativeTime(date: Date, locale: string = "ru-RU"): string {
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absDiffMs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const SECOND = 1_000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  if (absDiffMs < MINUTE) {
    return rtf.format(Math.round(diffMs / SECOND), "second");
  }

  if (absDiffMs < HOUR) {
    return rtf.format(Math.round(diffMs / MINUTE), "minute");
  }

  if (absDiffMs < DAY) {
    return rtf.format(Math.round(diffMs / HOUR), "hour");
  }

  if (absDiffMs < MONTH) {
    return rtf.format(Math.round(diffMs / DAY), "day");
  }

  if (absDiffMs < YEAR) {
    return rtf.format(Math.round(diffMs / MONTH), "month");
  }

  return rtf.format(Math.round(diffMs / YEAR), "year");
}
