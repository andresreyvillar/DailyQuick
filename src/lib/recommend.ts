import type { NoteSummary } from "./notes-api";

/**
 * Projects seen across recent days (each inner array is one day, most-recent first) that are NOT
 * already in today's forecast and NOT already on the board. De-duplicated by title (case-insensitive),
 * preserving most-recent-first order.
 */
export function recommendedFromRecent(
  recentByDay: NoteSummary[][],
  forecastNames: string[],
  boardTitles: string[],
): NoteSummary[] {
  const exclude = new Set([...forecastNames, ...boardTitles].map((name) => name.toLowerCase()));
  const seen = new Set<string>();
  const out: NoteSummary[] = [];
  for (const day of recentByDay) {
    for (const summary of day) {
      const key = summary.title.toLowerCase();
      if (exclude.has(key) || seen.has(key)) continue;
      seen.add(key);
      out.push(summary);
    }
  }
  return out;
}
