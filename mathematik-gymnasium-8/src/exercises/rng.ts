/**
 * Deterministic random numbers (mulberry32), so a task can be reproduced
 * from its seed, a simulation from its stored seed, and tests can sweep many
 * seeds.
 */
export interface Rng {
  /** Uniform in [0, 1). */
  next(): number;
  /** Integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
  /** A value min, min + step, … ≤ max, rounded to the step's decimals. */
  stepped(min: number, max: number, step: number): number;
  pick<T>(items: readonly T[]): T;
  /** A copy in random order. */
  shuffle<T>(items: readonly T[]): T[];
  /** -1 or 1. */
  sign(): number;
  /** The state to continue from later, as an unsigned 32-bit number. */
  state(): number;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0 || 0x9e3779b9;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    stepped(min, max, step) {
      const steps = Math.floor((max - min) / step + 1e-9);
      const value = min + step * Math.floor(next() * (steps + 1));
      const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
      return Number(value.toFixed(decimals));
    },
    pick(items) {
      return items[Math.floor(next() * items.length)];
    },
    shuffle(items) {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    sign() {
      return next() < 0.5 ? -1 : 1;
    },
    state() {
      return state;
    },
  };
}

/** A stable seed from a string, for lesson ids and attempt counters. */
export function seedFrom(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
