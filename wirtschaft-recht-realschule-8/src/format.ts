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
