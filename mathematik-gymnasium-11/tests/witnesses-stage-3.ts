import type { LabValues } from "../src/model/types";

/** Stage 3: one setting per lab goal that reaches it. */
export const GOAL_WITNESSES_STAGE_3: Record<string, Record<string, LabValues>> = {
  "bw-1-bedingte-wahrscheinlichkeit": {
    // 0,5 · 0,4 = 0,2
    schnitt: { pA: 0.5, pBA: 0.4, pBnA: 0.3 },
    // 0,2 · 0,8 = 0,16 und 0,8 · 0,2 = 0,16: P_B(A) = 0,5
    umgekehrt: { pA: 0.2, pBA: 0.8, pBnA: 0.2 },
    // P(A ∩ B) = 0,2, P(Ā ∩ B) = 0,75 · 0,4 = 0,3: P_B(A) = 0,2 : 0,5
    richtungen: { pA: 0.25, pBA: 0.8, pBnA: 0.4 },
  },
  "bw-2-diagnostik": {
    // 0,005 · 0,95 gegen 0,995 · 0,05
    "trotzdem-gesund": { prev: 0.005, sens: 0.95, spec: 0.95 },
    // 99 : (99 + 99)
    faustregel: { prev: 0.01, sens: 0.99, spec: 0.99 },
    // 0,1 · 0,9 = 0,09 = 0,9 · 0,1
    praevalenz: { prev: 0.1, sens: 0.9, spec: 0.9 },
  },
  "bw-3-unabhaengigkeit": {
    unabhaengig: { pA: 0.3, pBA: 0.6, pBnA: 0.6 },
    schnitt: { pA: 0.5, pBA: 0.4, pBnA: 0.4 },
    // 0,25 · 0,8 + 0,75 · 0,4 = 0,5
    doppelt: { pA: 0.25, pBA: 0.8, pBnA: 0.4 },
  },
  "bw-4-daten-hinterfragen": {
    // Klinik 1: 0,2 · 0,95 + 0,8 · 0,6 = 0,67; Klinik 2: 0,8 · 0,9 + 0,2 · 0,55 = 0,83
    paradox: { s1: 0.8, r1s: 0.6, r1l: 0.95, s2: 0.2, r2s: 0.55, r2l: 0.9 },
    // 0,66 gegen 0,84
    "gleich-gut": { s1: 0.8, r1s: 0.6, r1l: 0.9, s2: 0.2, r2s: 0.6, r2l: 0.9 },
    "gleiche-mischung": { s1: 0.5, r1s: 0.7, r1l: 0.95, s2: 0.5, r2s: 0.6, r2l: 0.9 },
  },
};
