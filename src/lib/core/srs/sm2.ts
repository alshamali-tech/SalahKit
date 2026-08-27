/**
 * SM-2 spaced-repetition scheduler (lib/core/srs/sm2.ts).
 * Pure and deterministic — no side effects, no dates other than the
 * instants passed in. Drives the Hifz review queue.
 */

/** A self-assessed grade after reviewing an item. */
export type Sm2Grade = 0 | 1 | 2 | 3 | 4 | 5;

/** The persisted state of one memorized item. */
export interface Sm2Card {
  /** Ease factor, starts at 2.5, floor 1.3. */
  ease: number;
  /** Current interval in days. */
  intervalDays: number;
  /** Successful review count. */
  reps: number;
  /** Times the card lapsed (grade < 3). */
  lapses: number;
  /** Epoch ms when next due. */
  dueAt: number;
}

const DAY_MS = 86_400_000;

/**
 * Creates a fresh card.
 * @param now - Epoch ms of creation.
 * @returns A card due immediately.
 */
export function newCard(now: number): Sm2Card {
  return { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0, dueAt: now };
}

/**
 * Clamps an ease factor to the SM-2 floor of 1.3.
 * @param ease - Candidate ease.
 * @returns Ease >= 1.3.
 */
export function clampEase(ease: number): number {
  return Math.max(1.3, ease);
}

/**
 * Computes the next interval in days from the current one and ease.
 * @param intervalDays - Current interval.
 * @param reps - Successful reviews so far (before this one).
 * @param ease - Ease factor.
 * @returns Next interval in days.
 */
export function nextInterval(intervalDays: number, reps: number, ease: number): number {
  if (reps === 0) return 1;
  if (reps === 1) return 6;
  return Math.max(intervalDays + 1, Math.round(intervalDays * ease));
}

/**
 * Applies one review to a card, returning the new state.
 * Grades 0-2 lapse the card (back to day 1, ease drops); 3-5 succeed.
 * @param card - Current card state.
 * @param grade - Self-assessed grade 0-5.
 * @param now - Epoch ms of the review.
 * @returns The updated card.
 */
export function review(card: Sm2Card, grade: Sm2Grade, now: number): Sm2Card {
  if (grade < 3) {
    return {
      ease: clampEase(card.ease - 0.2),
      intervalDays: 0,
      reps: 0,
      lapses: card.lapses + 1,
      dueAt: now + DAY_MS,
    };
  }
  const ease = clampEase(card.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  const intervalDays = nextInterval(card.intervalDays, card.reps, ease);
  return {
    ease,
    intervalDays,
    reps: card.reps + 1,
    lapses: card.lapses,
    dueAt: now + intervalDays * DAY_MS,
  };
}

/**
 * True when a card is due at the given instant.
 * @param card - Card to test.
 * @param now - Epoch ms.
 * @returns Whether dueAt <= now.
 */
export function isDue(card: Sm2Card, now: number): boolean {
  return card.dueAt <= now;
}

/**
 * Sorts cards by overdue-first, then earliest due.
 * @param cards - Cards to sort (not mutated).
 * @param now - Epoch ms.
 * @returns A new array ordered most-overdue first.
 */
export function queueOrder(cards: readonly Sm2Card[]): Sm2Card[] {
  return [...cards].sort((a, b) => a.dueAt - b.dueAt);
}
