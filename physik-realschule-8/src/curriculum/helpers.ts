/** True when `value` is within `tolerance` (relative) of `target`. */
export function near(value: number, target: number, tolerance = 0.02): boolean {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  if (target === 0) return Math.abs(value) <= tolerance;
  return Math.abs(value - target) <= Math.abs(target) * tolerance;
}

/** True when `value` is within `delta` (absolute) of `target`. */
export function within(value: number, target: number, delta: number): boolean {
  return Number.isFinite(value) && Math.abs(value - target) <= delta;
}

/** A fraction as a percentage number, e.g. pct(0.25) → 25. */
export function pct(fraction: number): number {
  return fraction * 100;
}
