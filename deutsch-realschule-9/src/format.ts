const nf = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

export const fmt = (value: number): string => nf.format(value);

export const money = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export const esc = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );

/** Escapes first, then allows **bold** only, so lesson text stays inert HTML. */
export const rich = (text: string): string => esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

/**
 * A 32-bit hash of a key in which every character reaches every bit, so keys
 * that differ in one character (`lesson:case:1`, `lesson:case:2`) give
 * unrelated numbers.
 */
export function hashKey(key: string): number {
  let h = 2166136261;
  for (const char of key) h = Math.imul(h ^ char.charCodeAt(0), 16777619) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/** A small seeded generator (mulberry32): the same key always gives the same numbers. */
function seeded(key: string): () => number {
  let a = hashKey(key);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], key: string): T[] {
  const next = seeded(key);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Puts the right option among the others so that its place moves with the
 * step: it starts at a place that depends on the key and then advances by one
 * for every step, so the right answer is not at the same place in every step
 * of a lesson. The wrong options keep a shuffled order.
 */
export function placeAnswer<T>(
  correct: T,
  wrong: readonly T[],
  key: string,
  step: number,
): { items: T[]; answer: number } {
  const items = shuffle(wrong, `${key}:wrong:${step}`);
  const answer = (hashKey(key) + step) % (wrong.length + 1);
  items.splice(answer, 0, correct);
  return { items, answer };
}
