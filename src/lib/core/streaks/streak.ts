/**
 * Prayer streak computation (lib/core/streaks/streak.ts).
 * Pure and deterministic. Operates on a map of dateISO -> completion.
 */

/** Completion of one day: how many of the tracked prayers were prayed. */
export interface DayCompletion {
  /** Number of prayers marked as prayed. */
  done: number;
  /** Number of prayers tracked that day. */
  total: number;
}

/** A full streak report. */
export interface StreakReport {
  /** Consecutive complete days ending today or yesterday. */
  current: number;
  /** Longest run of consecutive complete days ever. */
  best: number;
  /** Fraction of prayers prayed over the window, 0-100. */
  percent: number;
}

const DAY_MS = 86_400_000;

/** Local calendar date YYYY-MM-DD for an instant. */
function iso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** True when a day counts as "complete" (at least the required prayers). */
function isComplete(day: DayCompletion | undefined, minPrayers: number): boolean {
  return day !== undefined && day.done >= minPrayers;
}

/**
 * Computes the current streak: consecutive complete days ending today
 * (or yesterday, so a streak survives until tonight's prayers).
 * @param days - Map of dateISO to completion.
 * @param today - Today's date.
 * @param minPrayers - Prayers required for a day to count (default 5).
 * @returns Current streak length.
 */
export function currentStreak(
  days: ReadonlyMap<string, DayCompletion>,
  today: Date,
  minPrayers = 5
): number {
  let streak = 0;
  let cursor = today.getTime();
  // Allow today to be incomplete without breaking the streak yet.
  if (!isComplete(days.get(iso(new Date(cursor))), minPrayers)) cursor -= DAY_MS;
  while (isComplete(days.get(iso(new Date(cursor))), minPrayers)) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

/**
 * Computes the best (longest) streak across all provided days.
 * @param days - Map of dateISO to completion.
 * @param minPrayers - Prayers required for a day to count.
 * @returns Longest consecutive run.
 */
export function bestStreak(days: ReadonlyMap<string, DayCompletion>, minPrayers = 5): number {
  const sorted = [...days.keys()].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const complete = isComplete(days.get(key), minPrayers);
    if (!complete) {
      run = 0;
      prev = null;
      continue;
    }
    const d = new Date(`${key}T12:00:00`);
    const contiguous = prev !== null && d.getTime() - prev.getTime() === DAY_MS;
    run = contiguous ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}

/**
 * Overall prayer completion percent over the provided days.
 * @param days - Map of dateISO to completion.
 * @returns Rounded percent 0-100.
 */
export function completionPercent(days: ReadonlyMap<string, DayCompletion>): number {
  let done = 0;
  let total = 0;
  days.forEach((d) => {
    done += d.done;
    total += d.total;
  });
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/**
 * Full streak report for a set of days.
 * @param days - Map of dateISO to completion.
 * @param today - Today's date.
 * @param minPrayers - Prayers required per day.
 * @returns Current, best and percent.
 */
export function streakReport(
  days: ReadonlyMap<string, DayCompletion>,
  today: Date,
  minPrayers = 5
): StreakReport {
  return {
    current: currentStreak(days, today, minPrayers),
    best: bestStreak(days, minPrayers),
    percent: completionPercent(days),
  };
}
