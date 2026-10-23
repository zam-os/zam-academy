export interface Point {
  x: number;
  y: number;
}
export const det = (u: Point, v: Point): number => u.x * v.y - u.y * v.x;
export const distance = (a: Point, b: Point): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
export const validTriangle = (a: number, b: number, c: number): boolean =>
  Math.min(a, b, c) > 0 && a + b > c && a + c > b && b + c > a;

/** Internal drawing arithmetic; the pupil constructs with compass and ruler, without Pythagoras. */
export function triangle(a: number, b: number, c: number): Point | null {
  if (!validTriangle(a, b, c)) return null;
  const x = (b * b + c * c - a * a) / (2 * c);
  return { x, y: Math.sqrt(Math.max(0, b * b - x * x)) };
}
export function angle(a: Point, vertex: Point, b: Point): number {
  const u = { x: a.x - vertex.x, y: a.y - vertex.y },
    v = { x: b.x - vertex.x, y: b.y - vertex.y };
  const length = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  if (length < 1e-9) return 0;
  return (
    (Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / length))) *
      180) /
    Math.PI
  );
}
export function statistics(values: number[]) {
  const ordered = [...values].sort((a, b) => a - b),
    n = ordered.length;
  const mean = values.reduce((sum, x) => sum + x, 0) / n;
  const median =
    n % 2 ? ordered[(n - 1) / 2] : (ordered[n / 2 - 1] + ordered[n / 2]) / 2;
  const counts = new Map<number, number>();
  for (const x of values) counts.set(x, (counts.get(x) ?? 0) + 1);
  const highest = Math.max(...counts.values());
  const modes = [...counts]
    .filter(([, count]) => count === highest)
    .map(([x]) => x)
    .sort((a, b) => a - b);
  return { mean, median, range: ordered[n - 1] - ordered[0], modes, ordered };
}
export function linearSolution(
  a: number,
  b: number,
  c: number,
  d = 0,
): number | "alle" | "keine" {
  return a === d ? (b === c ? "alle" : "keine") : (c - b) / (a - d);
}
export const flipRelation = (relation: string): string =>
  ({ "<": ">", ">": "<", "≤": "≥", "≥": "≤" })[relation] ?? relation;

/** Convex triangle/quadrilateral with prescribed interior angles.
 * Lengths are free; choose a feasible side before normalising the drawing.
 */
export function polygonFromAngles(angles: number[]): Point[] | null {
  const n = angles.length;
  if (
    ![3, 4].includes(n) ||
    angles.some((a) => a <= 0 || a >= 180) ||
    Math.abs(angles.reduce((a, b) => a + b, 0) - (n - 2) * 180) > 1e-8
  )
    return null;
  const rad = (a: number) => (a * Math.PI) / 180;
  const direction = (a: number): Point => ({
    x: Math.cos(rad(a)),
    y: Math.sin(rad(a)),
  });
  const A = { x: 0, y: 0 },
    B = { x: 1, y: 0 };
  if (n === 3) {
    const b = Math.sin(rad(angles[1])) / Math.sin(rad(angles[2]));
    return [
      A,
      B,
      { x: b * Math.cos(rad(angles[0])), y: b * Math.sin(rad(angles[0])) },
    ];
  }
  const u = direction(180 - angles[1]),
    v = direction(360 - angles[1] - angles[2]),
    w = direction(angles[0]);
  const denominator = det(w, v);
  if (Math.abs(denominator) < 1e-10) return null;
  // C = B + s*u; D = C + t*v = k*w, with s, t and k all positive.
  const k0 = det(B, v) / denominator,
    k1 = det(u, v) / denominator;
  const t0 = det(w, B) / -denominator,
    t1 = det(w, u) / -denominator;
  let low = 0,
    high = Number.POSITIVE_INFINITY;
  for (const [intercept, slope] of [
    [k0, k1],
    [t0, t1],
  ]) {
    if (Math.abs(slope) < 1e-10) {
      if (intercept <= 0) return null;
    } else if (slope > 0) low = Math.max(low, -intercept / slope);
    else high = Math.min(high, -intercept / slope);
  }
  if (high <= low) return null;
  const s = Number.isFinite(high) ? (low + high) / 2 : low + 1;
  const k = k0 + k1 * s;
  return [A, B, { x: 1 + s * u.x, y: s * u.y }, { x: k * w.x, y: k * w.y }];
}
