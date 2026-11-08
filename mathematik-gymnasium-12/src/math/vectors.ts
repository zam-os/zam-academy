/**
 * Vektorgeometrie im Raum R^3 für Mathematik 12 Gymnasium.
 */

export type Vec3 = [number, number, number];

export function add3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scale3(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

/** Skalarprodukt a · b */
export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Vektorlänge |v| */
export function len3(v: Vec3): number {
  return Math.sqrt(dot3(v, v));
}

/** Schnittwinkel zwischen zwei Vektoren in Grad [0°, 180°]. */
export function angleDeg3(a: Vec3, b: Vec3): number {
  const lA = len3(a);
  const lB = len3(b);
  if (lA < 1e-9 || lB < 1e-9) return 0;
  const cos = Math.max(-1, Math.min(1, dot3(a, b) / (lA * lB)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Vektorprodukt (Kreuzprodukt) a × b */
export function cross3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/** Flächeninhalt des Parallelogramms aufgespannt von a und b: |a × b| */
export function areaParallelogram3(a: Vec3, b: Vec3): number {
  return len3(cross3(a, b));
}

/** Flächeninhalt des Dreiecks aufgespannt von a und b: 0,5 · |a × b| */
export function areaTriangle3(a: Vec3, b: Vec3): number {
  return 0.5 * len3(cross3(a, b));
}

/** Spatvolumen (Spatprodukt) |(a × b) · c| */
export function volumeSpat3(a: Vec3, b: Vec3, c: Vec3): number {
  return Math.abs(dot3(cross3(a, b), c));
}

/** Pyramidenvolumen: 1/6 · |(a × b) · c| */
export function volumePyramid3(a: Vec3, b: Vec3, c: Vec3): number {
  return (1 / 6) * volumeSpat3(a, b, c);
}

/**
 * Schrägbild-Projektion (Kavalier-/Kabinettprojektion nach DIN):
 * x1 (nach vorne links/unten): Verkürzung 1/2, Winkel 45°
 * x2 (nach rechts): horizontal
 * x3 (nach oben): vertikal
 *
 * Im SVG-Koordinatensystem (Ursprung (cx, cy)):
 * X_svg = cx - x1 · scale · 0.5 · cos(45°) + x2 · scale
 * Y_svg = cy + x1 · scale · 0.5 · sin(45°) - x3 · scale
 */
export function project3D(
  v: Vec3,
  cx = 240,
  cy = 160,
  scale = 20,
): { x: number; y: number } {
  const [x1, x2, x3] = v;
  const k = 0.5 * Math.SQRT1_2; // 0.5 * cos(45°) = 0.5 * sin(45°) ≈ 0.3535
  const xSvg = cx - x1 * scale * k + x2 * scale;
  const ySvg = cy + x1 * scale * k - x3 * scale;
  return { x: Math.round(xSvg * 10) / 10, y: Math.round(ySvg * 10) / 10 };
}
