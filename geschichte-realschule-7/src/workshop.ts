import type { Workshop } from "./model/types";

export const esc = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export function shuffle<T>(items: readonly T[], key: string): T[] {
  let seed = 2166136261;
  for (const char of key) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function initialOrder(workshop: Workshop, key: string): number[] {
  const order = shuffle(
    workshop.entries.map((_, index) => index),
    key,
  );
  // A timeline never starts already solved, including a two-entry workshop.
  if (workshop.kind === "timeline" && order.every((entry, index) => entry === index))
    order.reverse();
  return order;
}

export function moveEntry(order: number[], index: number, delta: -1 | 1): number[] {
  const next = [...order];
  if (index < 0 || index >= next.length || index + delta < 0 || index + delta >= next.length)
    return next;
  [next[index], next[index + delta]] = [next[index + delta], next[index]];
  return next;
}

/** Reject incomplete answers, duplicates and out-of-range entries, not just wrong values. */
export function checkWorkshop(workshop: Workshop, answer: number[]): boolean[] {
  if (answer.length !== workshop.entries.length) return workshop.entries.map(() => false);
  if (workshop.kind === "timeline") {
    if (new Set(answer).size !== answer.length) return workshop.entries.map(() => false);
    return workshop.entries.map(
      (_, position) => workshop.entries[answer[position]]?.target === position,
    );
  }
  return workshop.entries.map((entry, index) => answer[index] === entry.target);
}

export function canReviewDraft(text: string): boolean {
  return text.trim().length >= 20;
}

export function canAcceptSelfAssessment(text: string, criteria: boolean[]): boolean {
  return canReviewDraft(text) && criteria.length === 3 && criteria.every(Boolean);
}

/**
 * The first year named in a text such as "962: …", "um 1200: …",
 * "1618–1648: …" or "500 v. Chr.: …"; years v. Chr. are negative.
 */
export function yearOf(text: string): number | null {
  const bcAd = text.match(/(\d{1,5})(?:\/\d{1,5})?\s+(v|n)\.\s?Chr\./);
  if (bcAd) {
    const year = Number(bcAd[1]);
    return bcAd[2] === "v" ? -year : year;
  }
  const plain = text.match(/(?:^|\bum\s+)(\d{3,4})(?:\/\d{2,4})?(?=\s*[:–—]|(?:\s+n\.\s?Chr\.)|\b)/);
  return plain ? Number(plain[1]) : null;
}

/** "450 v. Chr.", "962 n. Chr."; there is no year 0. */
export function yearLabel(year: number): string {
  return year < 0 ? `${-year} v. Chr.` : `${year} n. Chr.`;
}

/**
 * Position on the time strip in percent. The scale runs from 500 n. Chr. to
 * 1800 n. Chr. between 12 % and 88 %; earlier years fall into the
 * "Antike" zone on the left, later ones into the "bis heute" zone on the right.
 */
export const STRIP = { from: 500, to: 1800, left: 12, right: 88 } as const;
export function stripPosition(year: number): number {
  if (year < STRIP.from) return STRIP.left / 2;
  if (year > STRIP.to) return (STRIP.right + 100) / 2;
  return STRIP.left + ((year - STRIP.from) / (STRIP.to - STRIP.from)) * (STRIP.right - STRIP.left);
}

/** The highlighted part of the strip for a span, at least one percent wide. */
export function stripRange(span: [number, number]): { left: number; width: number } {
  const start =
    span[0] < STRIP.from ? 0 : span[0] > STRIP.to ? STRIP.right : stripPosition(span[0]);
  const end =
    span[1] > STRIP.to ? 100 : span[1] < STRIP.from ? STRIP.left : stripPosition(span[1]);
  const left = Math.min(start, end);
  return { left, width: Math.max(1, Math.abs(end - start)) };
}

/**
 * Lanes for the bars of one Geschichtsfries row: each bar takes the first lane
 * whose last bar ends at least `gap` percent before it starts, so no two bars
 * of a lane overlap and every bar stays clickable. Returns one lane per range,
 * in the given order.
 */
export function assignLanes(ranges: Array<{ left: number; width: number }>, gap = 0.8): number[] {
  const lanes = new Array<number>(ranges.length);
  const laneEnds: number[] = [];
  ranges
    .map((range, index) => ({ ...range, index }))
    .sort((a, b) => a.left - b.left || b.width - a.width)
    .forEach((range) => {
      let lane = laneEnds.findIndex((end) => end + gap <= range.left);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = range.left + range.width;
      lanes[range.index] = lane;
    });
  return lanes;
}

/**
 * Pin positions on the solved time strip. Pins for close years (the Perserkriege
 * span 38 years, a fraction of a percent of the strip) are pushed apart to at
 * least `gap` percent, keeping their order and staying near their true place.
 */
export function spreadPins(positions: number[], gap = 4): number[] {
  const order = positions.map((_, index) => index).sort((a, b) => positions[a] - positions[b]);
  const sorted = order.map((index) => positions[index]);
  const spread = [...sorted];
  for (let pass = 0; pass < 200; pass++) {
    let moved = false;
    for (let i = 1; i < spread.length; i++) {
      const overlap = gap - (spread[i] - spread[i - 1]);
      if (overlap > 1e-9) {
        spread[i - 1] -= overlap / 2;
        spread[i] += overlap / 2;
        moved = true;
      }
    }
    for (let i = 0; i < spread.length; i++) spread[i] = Math.min(98, Math.max(2, spread[i]));
    if (!moved) break;
  }
  const result = new Array<number>(positions.length);
  order.forEach((index, rank) => (result[index] = spread[rank]));
  return result;
}
