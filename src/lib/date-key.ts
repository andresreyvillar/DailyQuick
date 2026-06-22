/** Convert a Date to the canonical day key `YYYY-MM-DD` (local time). */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Day key for today (local time). */
export function todayKey(): string {
  return toDateKey(new Date());
}

/** Parse a `YYYY-MM-DD` key to a local-midnight Date (avoids the UTC pitfall of `new Date(str)`). */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Day key `days` away from `key` (handles month/year rollover). */
export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}
