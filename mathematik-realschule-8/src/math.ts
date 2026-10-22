export interface Point {
  x: number;
  y: number;
}

export function triangleExists(a: number, b: number, c: number): boolean {
  return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
}

/** A=(0,0), B=(c,0); the upper SSS intersection. */
export function triangleVertex(a: number, b: number, c: number): Point | null {
  if (!triangleExists(a, b, c)) return null;
  const x = (b * b + c * c - a * a) / (2 * c);
  return { x, y: Math.sqrt(Math.max(0, b * b - x * x)) };
}

export function rotate(p: Point, degrees: number, center: Point = { x: 0, y: 0 }): Point {
  const phi = (degrees * Math.PI) / 180;
  const x = p.x - center.x,
    y = p.y - center.y;
  const clean = (v: number) => (Math.abs(v) < 1e-10 ? 0 : v);
  return {
    x: clean(center.x + x * Math.cos(phi) - y * Math.sin(phi)),
    y: clean(center.y + x * Math.sin(phi) + y * Math.cos(phi)),
  };
}

export function determinant(u: Point, v: Point): number {
  return u.x * v.y - u.y * v.x;
}
export const triangleArea = (u: Point, v: Point): number => Math.abs(determinant(u, v)) / 2;

export function lineFromPoints(a: Point, b: Point): { m: number; t: number } | null {
  if (a.x === b.x) return null;
  const m = (b.y - a.y) / (b.x - a.x);
  return { m, t: a.y - m * a.x };
}

export type LinearSolution = { kind: "one"; x: number } | { kind: "none" | "all" };
export function solveLinear(a: number, b: number, c: number, d: number): LinearSolution {
  if (Math.abs(a - c) < 1e-10) return { kind: Math.abs(b - d) < 1e-10 ? "all" : "none" };
  return { kind: "one", x: (d - b) / (a - c) };
}

/** a/(x-p) = b/(x-q), always keeping both original exclusions. */
export function solveRatio(a: number, p: number, b: number, q: number): LinearSolution {
  const candidate = solveLinear(a, -a * q, b, -b * p);
  if (
    candidate.kind === "one" &&
    (Math.abs(candidate.x - p) < 1e-10 || Math.abs(candidate.x - q) < 1e-10)
  )
    return { kind: "none" };
  return candidate;
}

export const quadraticVertex = (a: number, b: number, c: number): { x: number; value: number } => ({
  x: -b / (2 * a),
  value: c - (b * b) / (4 * a),
});

export const QUADS = [
  "Trapez",
  "Drachenviereck",
  "Parallelogramm",
  "Raute",
  "Rechteck",
  "Quadrat",
] as const;
export const QUAD_FACTS = [
  "Mindestens ein Paar gegenüberliegender Seiten ist parallel; Sonderfälle sind eingeschlossen.",
  "Zwei Paare benachbarter Seiten sind gleich lang. Eine Diagonale ist Symmetrieachse und halbiert die andere senkrecht.",
  "Gegenüberliegende Seiten sind parallel und gleich lang. Die Diagonalen halbieren sich; ihr Schnittpunkt ist Symmetriezentrum.",
  "Vier Seiten sind gleich lang. Die Diagonalen halbieren sich senkrecht; beide sind Symmetrieachsen.",
  "Vier rechte Winkel. Die Diagonalen sind gleich lang und halbieren sich. Die Mittellinien sind Symmetrieachsen.",
  "Vier gleich lange Seiten und vier rechte Winkel: zugleich Rechteck, Raute, Parallelogramm, Drachenviereck und Trapez.",
] as const;
