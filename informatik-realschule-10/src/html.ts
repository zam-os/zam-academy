export const esc = (value: unknown): string =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

export function shuffled<T>(values: readonly T[], key: string): T[] {
  let seed = 2166136261;
  for (const char of key)
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function parseLink(
  hash: string,
  search = "",
): { lesson?: string; view?: string; lab?: string; level?: 1 | 2 } {
  // A fragment route replaces a query deep link as a whole, including its level.
  const fragment = hash.replace(/^#/, "");
  const params = new URLSearchParams(fragment || search.replace(/^\?/, ""));
  const result: {
    lesson?: string;
    view?: string;
    lab?: string;
    level?: 1 | 2;
  } = {};
  for (const key of ["lesson", "view", "lab"] as const) {
    const value = params.get(key);
    if (value && /^[a-z0-9-]{1,64}$/.test(value)) result[key] = value;
  }
  if (params.get("level") === "1" || params.get("level") === "2")
    result.level = Number(params.get("level")) as 1 | 2;
  return result;
}

export const fmt = (value: number): string =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 })
    .format(value)
    .replace(/-/g, "−");
