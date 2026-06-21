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
