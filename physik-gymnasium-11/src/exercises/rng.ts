/**
 * Deterministic random numbers (mulberry32), so a task can be reproduced
 * from its seed and tests can sweep many seeds.
 */
export interface Rng {
  /** Integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
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
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
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
