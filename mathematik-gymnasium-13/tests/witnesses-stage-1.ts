import type { LabValues } from "../src/model/types";

/**
 * Stage 1: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_1: Record<string, Record<string, LabValues>> = {
  "int-1-flaechenbilanz": {
    // Bilanz = −8 FE: die Gerade liegt über [0 | 4] unter der Achse.
    negativ: { m: 1, t: -4, a: 0, b: 4 },
    // Bilanz = 0 mit A⁺ = A⁻ = 2 FE (Nullstelle bei x = 2).
    ausgleich: { m: 1, t: -2, a: 0, b: 4 },
    // Ganz über der Achse: A⁺ = 16 FE, A⁻ = 0.
    "nur-ueber": { m: 1, t: 2, a: 0, b: 4 },
  },
  "int-2-integralfunktion": {
    // f = −x + 2 wechselt bei x = 2 von + nach −: F hat dort ein Maximum.
    maximum: { m: -1, t: 2, x: 2 },
    // F(4) = 4² : 2 − 2 · 4 = 0 mit x = 4 ungleich 0.
    nullstelle: { m: 1, t: -2, x: 4 },
    // ΔF über [1,5 | 2,5] ist 2 · 1 = 2 (bei f = x, also m = 1, t = 0).
    wachstum: { m: 1, t: 0, x: 2.5 },
  },
  "int-3-hauptsatz": {
    // f(x) = x ist ungerade: über [−3 | 3] heben sich die Flächen auf.
    "bilanz-null": { a: 0, b: 1, c: 0, u: -3, v: 3 },
    // f(x) = 3 über [0 | 4]: Bilanz = 3 · 4 = 12.
    "bilanz-zwoelf": { a: 0, b: 0, c: 3, u: 0, v: 4 },
    // f(x) = x² − 4 über [0 | 3]: A⁻ = 16 : 3 größer als 0.
    "unter-der-achse": { a: 1, b: 0, c: -4, u: 0, v: 3 },
  },
  "int-4-graphen": {
    // f = −(x)² + 4 wechselt bei x = 2 von + nach −: Maximum von F.
    maximum: { a: -1, s: 0, k: 4, x: 2 },
    // F(3) = ((2)³ + 1) : 3 − 3 = 0.
    nullstelle: { a: 1, s: 1, k: -1, x: 3 },
    // Nullstellen bei 4 und 6: nur 4 liegt im Fenster, F(5) = −125 : 3 + 5 < 0.
    "eine-extremstelle": { a: -1, s: 5, k: 1, x: 5 },
  },
  "int-5-stammfunktionen": {
    // f′/f-Typ: F(x) = ln|1x| + C enthält ln.
    "ln-typ": { fam: 2, n: 3, a: 1, b: 0, p: 1, q: 0, x: 2 },
    // f(x) = x, F(x) = x² : 2: die Probe ergibt 0,005.
    probe: { fam: 0, n: 1, a: 1, b: 0, p: 1, q: 0, x: 1 },
    // F(2) = 2² : 2 = 2.
    zwei: { fam: 0, n: 1, a: 1, b: 0, p: 1, q: 0, x: 2 },
  },
  "int-6-flaechen": {
    // x² − x hat die Nullstellen 0 und 1: zwei Schnittpunkte, Fläche 1 : 6.
    "zwei-schnittpunkte": { a: 1, b: 0, m: 1, t: 0, x: 0.5, grenzen: 0 },
    // f = 0, g = 2x + 2 über [0 | 2]: Fläche = ∫ (2x + 2) = 8.
    "flaeche-acht": { a: 0, b: 0, m: 2, t: 2, x: 1, grenzen: 1 },
    // x² + 2 hat keine Nullstelle; über [0 | 2] ist die Fläche 20 : 3.
    "ohne-schnitt": { a: 1, b: 2, m: 0, t: 0, x: 1, grenzen: 1 },
  },
  "int-7-uneigentlich": {
    // p = 2: ∫₁^50 = 1 − 1 : 50 = 0,98 < 1,2.
    klein: { p: 2, b: 50 },
    // p = 1: ∫₁^25 = ln 25 ≈ 3,22 > 3.
    logarithmus: { p: 1, b: 25 },
    // p = 0,5: ∫₁^50 − ∫₁^10 = 2(√50 − √10) ≈ 7,82 ≥ 2.
    schwanz: { p: 0.5, b: 10 },
  },
  "int-8-gesamtaenderung": {
    // Hin- und Rückweg mit je 3 m/s über je 3 s: Verschiebung 0, Strecke 18 m.
    "hin-rueck": { vmax: 3, t1: 3, vback: 3, T: 6 },
    // 3 m/s · 2 s + 2 m/s · 2 s = 10 m.
    "strecke-zehn": { vmax: 3, t1: 2, vback: 2, T: 4 },
    // 5 m/s · 2 s − 1 m/s · 2 s = 8 m Verschiebung.
    acht: { vmax: 5, t1: 2, vback: 1, T: 4 },
  },
  "int-9-rotationskoerper": {
    // Zylinder r = 3, h = 3: V = π · 27.
    zylinder: { k: 0, d: 3, a: 0, b: 3 },
    // Kegel f(x) = 6x über [0 | 1]: V = π · 36 : 3 = π · 12.
    kegel: { k: 6, d: 0, a: 0, b: 1 },
    // f(x) = 3x + 3 über [0 | 2]: V = π · 78 > 50.
    gross: { k: 3, d: 3, a: 0, b: 2 },
  },
};
