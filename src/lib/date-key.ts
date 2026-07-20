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

const MS_PER_DAY = 86_400_000;

/**
 * Whole-day signed offset from `today` to `key` (negative = past, 0 = today, positive = future).
 * Rounds the millisecond difference so DST transitions never yield a 23/25h drift.
 */
export function dayOffset(key: string, today: string = todayKey()): number {
  const ms = parseDateKey(key).getTime() - parseDateKey(today).getTime();
  return Math.round(ms / MS_PER_DAY);
}

export type DayRelation = "today" | "past" | "future";

/** Whether `key` falls on `today`, before it, or after it. */
export function dayRelation(key: string, today: string = todayKey()): DayRelation {
  const offset = dayOffset(key, today);
  if (offset === 0) return "today";
  return offset < 0 ? "past" : "future";
}
