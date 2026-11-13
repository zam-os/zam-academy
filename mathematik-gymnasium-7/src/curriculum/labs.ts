import { fmt } from "../exercises/format";
import type { LabDefinition, LabParam } from "../model/types";
import { BALANCE_STEPS, eqSideText } from "../lab/views-gleichungen";
import { PROBE_CLAIMS, probeStats } from "../lab/views-terme";
import { QUADS } from "../lab/views-symmetrie";
import {
  angleDeg,
  circumcenter,
  dist2D,
  fiveNumbers,
  inradius,
  mean,
  median,
  percentAfter,
  percentChainPercent,
  polygonAngleSum,
  sswSolutions,
  triangleValid,
} from "./math";

const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
  unit = "",
  digits = step < 1 ? 1 : 0,
): LabParam => ({
  type: "range",
  key,
  label,
  min,
  max,
  value,
  step,
  unit,
  digits,
});

const choice = (
  key: string,
  label: string,
  value: number,
  options: Array<{ value: number; label: string }>,
): LabParam => ({
  type: "choice",
  key,
  label,
  value,
  options,
});


// ─── Etappe 1: Terme mit Variablen ─────────────────────────────────────────

export const labPatternTerms: LabDefinition = {
  kind: "pattern-terms",
  title: "Labor: Streichholzmuster als Term",
  intro:
    "Stelle Startanzahl a, Zuwachs pro Schritt b und Schrittzahl n ein und beobachte den Termwert a + b · n.",
  params: [
    range("a", "Startanzahl a", 1, 5, 1),
    range("b", "Zuwachs b", 2, 5, 3),
    range("n", "Schritte n", 1, 8, 3),
  ],
  readouts: [
    { key: "term", label: "Term", compute: (v) => `${fmt(v.a, 0)} + ${fmt(v.b, 0)} · n` },
    { key: "total", label: "Gesamtanzahl", emphasis: true, digits: 0, compute: (v) => v.a + v.b * v.n },
  ],
  goals: [
    { id: "acht", text: "Erreiche bei Start a = 1 und Zuwachs b = 3 genau 25 Hölzer.", check: (v) => v.a === 1 && v.b === 3 && v.n === 8 },
    { id: "quadrate", text: "Stelle eine Kette mit Zuwachs b = 4 und genau 30 Hölzern ein.", check: (v) => v.b === 4 && v.a + v.b * v.n === 30 },
    { id: "doppelt", text: "Finde eine Einstellung mit b = 2·a und Gesamtanzahl genau 18.", check: (v) => v.b === 2 * v.a && v.a + v.b * v.n === 18 },
  ],
};

export const labTermInterpret: LabDefinition = {
  kind: "term-interpret",
  title: "Labor: Term als ausgeschnittenes Rechteck",
  intro:
    "Ziehe an der Ecke (x | y) des Rechtecks. Die Fläche x · y − c² stimmt mit zerlegten Teilflächen immer überein.",
  params: [
    range("x", "Breite x", 3, 9, 5),
    range("y", "Höhe y", 2, 6, 3),
    range("c", "Ausschnitt c", 1, 2, 1),
  ],
  readouts: [
    { key: "area", label: "Restfläche x·y − c²", emphasis: true, digits: 0, compute: (v) => v.x * v.y - v.c * v.c },
    { key: "alt", label: "Zerlegung (x−c)·y + c·(y−c)", digits: 0, compute: (v) => (v.x - v.c) * v.y + v.c * (v.y - v.c) },
  ],
  goals: [
    { id: "fl20", text: "Stelle ein Rechteck mit Restfläche genau 20 ein.", check: (v) => v.x * v.y - v.c * v.c === 20 },
    { id: "c2", text: "Wähle Ausschnitt c = 2 und eine Restfläche von 32.", check: (v) => v.c === 2 && v.x * v.y - 4 === 32 },
    { id: "quadrat", text: "Mache die Außenmaße gleich groß (x = y) bei c = 1 und Restfläche 24.", check: (v) => v.x === v.y && v.c === 1 && v.x * v.y - 1 === 24 },
  ],
};

export const labValueTable: LabDefinition = {
  kind: "value-table",
  title: "Labor: Wertetabelle mit ganzzahligen Exponenten",
  intro:
    "Erkunde Termwerte von aⁿ + k auch für negative Exponenten (Kehrwertregel aus M6).",
  params: [
    range("a", "Basis a", 2, 5, 2),
    range("n", "Exponent n", -2, 3, 1),
    range("k", "Summand k", -3, 3, 0),
  ],
  readouts: [
    { key: "pow", label: "Potenz aⁿ", digits: 3, compute: (v) => v.a ** v.n },
    { key: "val", label: "Termwert T(n)", emphasis: true, digits: 3, compute: (v) => v.a ** v.n + v.k },
  ],
  goals: [
    { id: "bruch", text: "Stelle bei k = 0 einen Potenzwert von genau 0,25 ein.", check: (v) => v.k === 0 && Math.abs(v.a ** v.n - 0.25) < 1e-6 },
    { id: "nullwert", text: "Bringe den Termwert T(n) genau auf 0.", check: (v) => Math.abs(v.a ** v.n + v.k) < 1e-6 },
    { id: "fuenf", text: "Erzeuge T(n) = 1,04 (mit Basis 5).", check: (v) => v.a === 5 && Math.abs(v.a ** v.n + v.k - 1.04) < 1e-6 },
  ],
};

export const labSpreadsheetSim: LabDefinition = {
  kind: "spreadsheet-sim",
  title: "Labor: Tabellenkalkulation",
  intro:
    "Verändere den festen Parameter in $E$1 und den Startwert A2. Beobachte, wie alle Zellen in Spalte B und C automatisch aktualisiert werden.",
  params: [
    range("m", "Parameter $E$1", 1, 5, 2),
    range("t", "Konstante t", -4, 4, 1),
    range("x0", "Startwert A2", -3, 3, 0),
  ],
  readouts: [
    { key: "b2", label: "Zelle B2", digits: 0, compute: (v) => v.m * v.x0 + v.t },
    { key: "b5", label: "Zelle B5 (x = A2 + 3)", emphasis: true, digits: 0, compute: (v) => v.m * (v.x0 + 3) + v.t },
  ],
  goals: [
    { id: "nullstelle", text: "Stelle m = 2 und t = −4 so ein, dass B4 = 0 wird.", check: (v) => v.m === 2 && v.t === -4 && v.m * (v.x0 + 2) + v.t === 0 },
    { id: "negzero", text: "Erreiche genau B2 = 0 mit negativem Startwert A2 < 0.", check: (v) => v.x0 < 0 && v.m * v.x0 + v.t === 0 },
    { id: "b5zwanzig", text: "Bringe B5 auf mindestens 20.", check: (v) => v.m * (v.x0 + 3) + v.t >= 20 },
  ],
};

export const labTermTree: LabDefinition = {
  kind: "term-tree",
  title: "Labor: Termstruktur und Rechenbaum",
  intro:
    "Vergleiche Produkt, Summe, Potenz und Quotient: Die oberste (zuletzt ausgeführte) Rechenart gibt dem Term seinen Namen.",
  params: [
    choice("mode", "Term", 0, [
      { value: 0, label: "2 · (x + y) — Produkt" },
      { value: 1, label: "2 · x + y — Summe" },
      { value: 2, label: "(x − y)² — Potenz" },
      { value: 3, label: "(x + y) : 2 — Quotient" },
    ]),
    range("x", "x", 1, 6, 3),
    range("y", "y", 1, 4, 2),
  ],
  readouts: [
    {
      key: "name",
      label: "Hauptoperation",
      compute: (v) => ["Produkt", "Summe", "Potenz", "Quotient"][v.mode] ?? "Produkt",
    },
    {
      key: "val",
      label: "Termwert",
      emphasis: true,
      digits: 1,
      compute: (v) => [2 * (v.x + v.y), 2 * v.x + v.y, (v.x - v.y) ** 2, (v.x + v.y) / 2][v.mode] ?? 0,
    },
  ],
  goals: [
    { id: "summe", text: "Wähle eine Summe und erreiche den Termwert 14.", check: (v) => v.mode === 1 && 2 * v.x + v.y === 14 },
    { id: "potenz", text: "Erzeuge beim Term „Potenz“ den Wert 16.", check: (v) => v.mode === 2 && (v.x - v.y) ** 2 === 16 },
    { id: "quotient", text: "Stelle beim Quotienten genau den Wert 3,5 ein.", check: (v) => v.mode === 3 && Math.abs((v.x + v.y) / 2 - 3.5) < 1e-6 },
  ],
};

export const labPowerRulesN: LabDefinition = {
  kind: "power-rules-n",
  title: "Labor: Potenzgesetze mit natürlichen Exponenten",
  intro:
    "Schalte zwischen den drei Gesetzen um und beobachte an den ausgeschriebenen Faktoren, wie sich die Exponenten verhalten.",
  params: [
    choice("mode", "Gesetz", 0, [
      { value: 0, label: "aᵐ · aⁿ (gleiche Basis)" },
      { value: 1, label: "aⁿ · bⁿ (gleicher Exponent)" },
      { value: 2, label: "(aᵐ)ⁿ (Potenz einer Potenz)" },
    ]),
    range("a", "Basis a", 2, 4, 2),
    range("m", "Exponent m", 1, 4, 2),
    range("n", "Exponent n", 1, 4, 3),
  ],
  readouts: [
    {
      key: "resExp",
      label: "Ergebnisexponent",
      digits: 0,
      compute: (v) => (v.mode === 0 ? v.m + v.n : v.mode === 1 ? v.n : v.m * v.n),
    },
    {
      key: "val",
      label: "Wert",
      emphasis: true,
      digits: 0,
      compute: (v) =>
        v.mode === 0
          ? v.a ** (v.m + v.n)
          : v.mode === 1
            ? (v.a * 3) ** v.n
            : v.a ** (v.m * v.n),
    },
  ],
  goals: [
    { id: "glBasis", text: "Erzeuge mit gleicher Basis genau 2⁶ = 64 (mit m ≠ n).", check: (v) => v.mode === 0 && v.a === 2 && v.m + v.n === 6 && v.m !== v.n },
    { id: "glExp", text: "Zeige beim Gesetz gleicher Exponenten den Wert 1296 (= 6⁴).", check: (v) => v.mode === 1 && v.a === 2 && v.n === 4 },
    { id: "potPot", text: "Stelle (aᵐ)ⁿ = 3⁸ = 6561 ein (mit m ≥ 2).", check: (v) => v.mode === 2 && v.a === 3 && v.m >= 2 && v.m * v.n === 8 },
  ],
};

export const labLikeTermsProbe: LabDefinition = {
  kind: "like-terms-probe",
  title: "Labor: Die Einsetzprobe",
  intro:
    "Setze Zahlen für x und y in vier falsche und zwei echte Umformungen ein. Verschiedene Werte widerlegen sofort, gleiche Werte beweisen noch nichts!",
  params: [range("x", "x", -2, 4, 0), range("y", "y", -2, 4, 0)],
  readouts: [
    { key: "exposed", label: "widerlegte Fehler", emphasis: true, compute: (v) => `${probeStats(v.x, v.y).exposed} von ${PROBE_CLAIMS.filter((c) => !c.valid).length}` },
    { key: "slipped", label: "noch unentdeckt", digits: 0, compute: (v) => probeStats(v.x, v.y).slipped },
  ],
  goals: [
    { id: "eine", text: "Finde eine Einsetzung, bei der genau 1 falsche Umformung unentdeckt bleibt.", check: (v) => probeStats(v.x, v.y).slipped === 1 },
    { id: "zwei", text: "Wähle x ≠ 0, sodass mindestens 2 falsche Umformungen trotzdem stimmen.", check: (v) => v.x !== 0 && probeStats(v.x, v.y).slipped >= 2 },
    { id: "alle", text: "Finde eine Einsetzung, die alle 4 falschen Umformungen auf einmal entlarvt.", check: (v) => probeStats(v.x, v.y).exposed === 4 },
  ],
};

export const labDistributiveArea: LabDefinition = {
  kind: "distributive-area",
  title: "Labor: Distributivgesetz k · (a + b)",
  intro:
    "Stelle Faktor k und Summanden a, b ein (auch negativ für die Minusklammer!). Vergleiche k · (a + b) mit k·a + k·b.",
  params: [
    range("k", "Faktor k", 1, 5, 2),
    range("a", "Summand a", 2, 6, 4),
    range("b", "Summand b", -2, 4, 2),
  ],
  readouts: [
    { key: "left", label: "k·a", digits: 0, compute: (v) => v.k * v.a },
    { key: "right", label: "k·b", digits: 0, compute: (v) => v.k * v.b },
    { key: "total", label: "Gesamtprodukt", emphasis: true, digits: 0, compute: (v) => v.k * (v.a + v.b) },
  ],
  goals: [
    { id: "null", text: "Mache das Gesamtprodukt mit b < 0 genau 0 (a = 2, k = 3).", check: (v) => v.k === 3 && v.a === 2 && v.b === -2 },
    { id: "sub", text: "Stelle k = 4, a = 5 und negatives b so ein, dass k·(a + b) = 12.", check: (v) => v.k === 4 && v.a === 5 && v.b === -2 },
    { id: "drei6", text: "Erreiche das Gesamtprodukt 36 mit k ≥ 3 und b ≥ 1.", check: (v) => v.k >= 3 && v.b >= 1 && v.k * (v.a + v.b) === 36 },
  ],
};

export const labFactorRect: LabDefinition = {
  kind: "factor-rect",
  title: "Labor: Ausklammern = gemeinsamer Faktor",
  intro:
    "Suche einen gemeinsamen Faktor f beider Glieder: Erst wenn f beide Koeffizienten teilt, verschmelzen die Rechtecke zu einem Produkt.",
  params: [
    choice("preset", "Summe", 0, [
      { value: 0, label: "12x + 18y" },
      { value: 1, label: "15a + 10b" },
      { value: 2, label: "8x² + 12x" },
    ]),
    range("f", "Faktor f", 1, 6, 4),
  ],
  readouts: [
    {
      key: "rest",
      label: "Status",
      emphasis: true,
      compute: (v) => {
        const pairs = [[12, 18], [15, 10], [8, 12]][v.preset] ?? [12, 18];
        return pairs[0] % v.f === 0 && pairs[1] % v.f === 0
          ? `Teilbar durch ${fmt(v.f, 0)} ✓`
          : `${fmt(v.f, 0)} teilt nicht beide`;
      },
    },
  ],
  goals: [
    { id: "zwei", text: "Finde für 12x + 18y einen gemeinsamen Faktor f ≥ 2.", check: (v) => v.preset === 0 && v.f >= 2 && 12 % v.f === 0 && 18 % v.f === 0 },
    { id: "max0", text: "Klammere bei 12x + 18y den größtmöglichen Faktor aus.", check: (v) => v.preset === 0 && v.f === 6 },
    { id: "max1", text: "Wähle 15a + 10b und klammere den größtmöglichen Faktor aus.", check: (v) => v.preset === 1 && v.f === 5 },
  ],
};

export const labSumProductGrid: LabDefinition = {
  kind: "sum-product-grid",
  title: "Labor: Summen multiplizieren (4 Felder)",
  intro:
    "Verändere die Abschnitte a, b, c und d. Jedes Glied der ersten Klammer wird mit jedem Glied der zweiten Klammer multipliziert.",
  params: [
    range("a", "a", 1, 6, 3),
    range("b", "b", 1, 4, 2),
    range("c", "c", 1, 5, 2),
    range("d", "d", 1, 4, 1),
  ],
  readouts: [
    { key: "terms", label: "Vier Teilprodukte", compute: (v) => `${fmt(v.a * v.c, 0)} + ${fmt(v.a * v.d, 0)} + ${fmt(v.b * v.c, 0)} + ${fmt(v.b * v.d, 0)}` },
    { key: "prod", label: "(a+b)·(c+d)", emphasis: true, digits: 0, compute: (v) => (v.a + v.b) * (v.c + v.d) },
  ],
  goals: [
    { id: "gleich", text: "Finde eine Rechteckfläche von genau 35 mit a > b.", check: (v) => v.a > v.b && (v.a + v.b) * (v.c + v.d) === 35 },
    { id: "misch", text: "Stelle a·d = b·c (gleich große Nebendiagonal-Felder) bei a ≠ b ein.", check: (v) => v.a !== v.b && v.a * v.d === v.b * v.c },
    { id: "gross", text: "Erreiche (a + b)·(c + d) ≥ 72.", check: (v) => (v.a + v.b) * (v.c + v.d) >= 72 },
  ],
};

export const labBinomialSquare: LabDefinition = {
  kind: "binomial-square",
  title: "Labor: Binomische Formeln geometrisch",
  intro:
    "Wähle 1., 2. oder 3. binomische Formel und verstelle a und b. Achte auf den doppelten Mischterm 2ab.",
  params: [
    choice("kind", "Formel", 0, [
      { value: 0, label: "1. Formel: (a + b)²" },
      { value: 1, label: "2. Formel: (a − b)²" },
      { value: 2, label: "3. Formel: (a + b)(a − b)" },
    ]),
    range("a", "a", 4, 7, 5),
    range("b", "b", 1, 3, 1),
  ],
  readouts: [
    { key: "ab2", label: "2·a·b", digits: 0, compute: (v) => 2 * v.a * v.b },
    {
      key: "val",
      label: "Ergebnis",
      emphasis: true,
      digits: 0,
      compute: (v) => (v.kind === 0 ? (v.a + v.b) ** 2 : v.kind === 1 ? (v.a - v.b) ** 2 : v.a * v.a - v.b * v.b),
    },
  ],
  goals: [
    { id: "erste", text: "Zeige bei der 1. Formel (a + b)² = 64 mit b = 3.", check: (v) => v.kind === 0 && v.b === 3 && (v.a + v.b) ** 2 === 64 },
    { id: "zweite", text: "Stelle bei der 2. Formel a = 6 und b = 2 ein und lies (a−b)² = 16 ab.", check: (v) => v.kind === 1 && v.a === 6 && v.b === 2 },
    { id: "dritte", text: "Finde bei der 3. Formel genau a² − b² = 40.", check: (v) => v.kind === 2 && v.a * v.a - v.b * v.b === 40 },
  ],
};

export const labAreaScaling: LabDefinition = {
  kind: "area-scaling",
  title: "Labor: Flächenänderung beim Skalieren",
  intro:
    "Skaliere Breite und Höhe eines Rechtecks mit kx und ky und vergleiche, mit welchem Faktor die Gesamtfläche wächst.",
  params: [
    range("a", "Ausgangsbreite a", 2, 5, 3),
    range("b", "Ausgangshöhe b", 2, 4, 2),
    range("kx", "Breitenfaktor kx", 1, 3, 1),
    range("ky", "Höhenfaktor ky", 1, 3, 1),
  ],
  readouts: [
    { key: "fac", label: "Flächenfaktor", emphasis: true, digits: 0, compute: (v) => v.kx * v.ky },
    { key: "area", label: "Neue Fläche", digits: 0, compute: (v) => v.a * v.b * v.kx * v.ky },
  ],
  goals: [
    { id: "vier", text: "Verdopple beide Seiten (kx = 2, ky = 2) und bestätige den Flächenfaktor 4.", check: (v) => v.kx === 2 && v.ky === 2 },
    { id: "sechs", text: "Erreiche genau Faktor 6 zwischen neuer und alter Fläche.", check: (v) => v.kx * v.ky === 6 },
    { id: "neun", text: "Erhöhe den Faktor auf das 9-Fache bei Ausgangsfläche a·b = 8.", check: (v) => v.a * v.b === 8 && v.kx * v.ky === 9 },
  ],
};

// ─── Etappe 2: Symmetrie und Winkel ────────────────────────────────────────

export const labAxisSym: LabDefinition = {
  kind: "axis-sym",
  title: "Labor: Achsenspiegelung",
  intro:
    "Ziehe Punkt Q in den Spiegelpunkt P' von P(−3|2) an der Achse x = ax. Achte auf gleiche Abstände zur Achse und den rechten Winkel.",
  params: [
    range("ax", "Achse x =", -1, 1, 0),
    range("qx", "Q x", -1, 5, 2, 0.5),
    range("qy", "Q y", -3, 4, 0, 0.5),
  ],
  readouts: [
    { key: "distDiff", label: "Abstandsunterschied zu a", digits: 1, compute: (v) => Math.abs(Math.abs(-3 - v.ax) - Math.abs(v.qx - v.ax)) },
    { key: "mirror", label: "Gesuchtes P'", emphasis: true, compute: (v) => `(${fmt(2 * v.ax + 3, 0)}|2)` },
  ],
  goals: [
    { id: "ach0", text: "Triff für Achse x = 0 den exakten Spiegelpunkt P' = (3|2).", check: (v) => v.ax === 0 && v.qx === 3 && v.qy === 2 },
    { id: "ach1", text: "Verschiebe die Achse auf x = 1 und finde den neuen Spiegelpunkt P'.", check: (v) => v.ax === 1 && v.qx === 5 && v.qy === 2 },
    { id: "achM1", text: "Stelle die Achse auf x = −1 und spiegle P dorthin.", check: (v) => v.ax === -1 && v.qx === 1 && v.qy === 2 },
  ],
};

export const labPointSym: LabDefinition = {
  kind: "point-sym",
  title: "Labor: Punktspiegelung am Zentrum Z",
  intro:
    "Ziehe Q so, dass das Symmetriezentrum Z genau in der Mitte zwischen P(−3|2) und Q liegt.",
  params: [
    range("zx", "Zentrum Z x", -1, 1, 0),
    range("qx", "Q x", -2, 5, 1, 0.5),
    range("qy", "Q y", -4, 4, 1, 0.5),
  ],
  readouts: [
    { key: "mx", label: "Mittelpunkt x", digits: 2, compute: (v) => (-3 + v.qx) / 2 },
    { key: "target", label: "Gesuchtes P'", emphasis: true, compute: (v) => `(${fmt(2 * v.zx + 3, 0)}|−2)` },
  ],
  goals: [
    { id: "z0", text: "Finde für Z(0|0) den Spiegelpunkt P'(3|−2).", check: (v) => v.zx === 0 && v.qx === 3 && v.qy === -2 },
    { id: "z1", text: "Stelle Z(1|0) ein und bringe M genau auf Z.", check: (v) => v.zx === 1 && v.qx === 5 && v.qy === -2 },
    { id: "zm1", text: "Spiegle P an Z(−1|0) auf seinen Spiegelpunkt.", check: (v) => v.zx === -1 && v.qx === 1 && v.qy === -2 },
  ],
};

export const labLociModel: LabDefinition = {
  kind: "loci-model",
  title: "Labor: Mittelsenkrechte und Kreis",
  intro:
    "A(−3|0) und B(3|0) sind zwei Orte. Ziehe Standort P und stelle Radius r ein.",
  params: [
    range("px", "P x", -4, 4, -1, 0.5),
    range("py", "P y", -4, 4, 2, 0.5),
    range("r", "Kreisradius r", 2, 5, 4, 0.5),
  ],
  readouts: [
    { key: "dA", label: "d(P, A)", digits: 2, compute: (v) => dist2D({ x: v.px, y: v.py }, { x: -3, y: 0 }) },
    { key: "dB", label: "d(P, B)", digits: 2, compute: (v) => dist2D({ x: v.px, y: v.py }, { x: 3, y: 0 }) },
  ],
  goals: [
    { id: "mitte", text: "Bringe P auf die Mittelsenkrechte (d(P,A) = d(P,B) und py ≠ 0).", check: (v) => v.px === 0 && v.py !== 0 },
    { id: "kreis5", text: "Wähle Radius r = 5 und finde oben (py > 0) den Schnittpunkt von Mittelsenkrechte und Kreis.", check: (v) => v.r === 5 && v.px === 0 && v.py === 4 },
    { id: "unten", text: "Finde auch unten (py < 0) einen Punkt mit d(P,A) = d(P,B) = 5.", check: (v) => v.px === 0 && Math.abs(dist2D({ x: v.px, y: v.py }, { x: -3, y: 0 }) - 5) < 0.05 && v.py < 0 },
  ],
};

export const labPerpBisectAngle: LabDefinition = {
  kind: "perp-bisect-angle",
  title: "Labor: Lot und Winkelhalbierende",
  intro:
    "Fälle erst das Lot von P(4|3,5) auf g (y = 0). Wechsle danach zur Winkelhalbierenden des 60°-Winkels.",
  params: [
    choice("mode", "Konstruktion", 0, [
      { value: 0, label: "Lot von P auf g fällen" },
      { value: 1, label: "Winkelhalbierende (α = 60°)" },
    ]),
    range("fx", "F x", 1, 7, 2, 0.5),
    range("fy", "F y", 0, 4, 1, 0.5),
  ],
  readouts: [
    { key: "pos", label: "Punkt F", emphasis: true, compute: (v) => `(${fmt(v.fx, 1)}|${fmt(v.fy, 1)})` },
  ],
  goals: [
    { id: "lot", text: "Fälle im Modus „Lot fällen“ exakt auf den Lotfußpunkt F(4|0).", check: (v) => v.mode === 0 && v.fx === 4 && v.fy === 0 },
    { id: "kurz", text: "Prüfe, dass kein Punkt auf g näher an P(4|3,5) liegt als F(4|0): stelle (4|0) und Modus 0 ein.", check: (v) => v.mode === 0 && Math.abs(v.fy) < 0.05 && dist2D({ x: 4, y: 3.5 }, { x: v.fx, y: v.fy }) <= 3.51 },
    { id: "wh", text: "Wechsle zur Winkelhalbierenden und triff exakt den 30°-Strahl (Abweichung < 1,5°).", check: (v) => v.mode === 1 && v.fx > 1.3 && v.fy > 0.1 && Math.abs(angleDeg({ x: 1, y: 0 }, { x: 7.5, y: 0 }, { x: v.fx, y: v.fy }) - 30) < 1.5 },
  ],
};

export const labQuadHouse: LabDefinition = {
  kind: "quad-house",
  title: "Labor: Haus der symmetrischen Vierecke",
  intro:
    "Wähle einen Vierecktyp und vergleiche Symmetrieachsen (grün) sowie Symmetriezentrum Z.",
  params: [
    range("shape", "Vierecktyp (0..5)", 0, 5, 0),
    range("scale", "Größe", 2, 4, 3, 0.5),
  ],
  readouts: [
    { key: "name", label: "Figur", emphasis: true, compute: (v) => QUADS[v.shape]?.name ?? "" },
    { key: "axes", label: "Symmetrieachsen", digits: 0, compute: (v) => QUADS[v.shape]?.axes ?? 0 },
  ],
  goals: [
    { id: "punkt", text: "Finde ein punktsymmetrisches Viereck ganz ohne Symmetrieachse.", check: (v) => v.shape === 2 },
    { id: "zwei", text: "Stelle eine Raute ein (2 Diagonalachsen und punktsymmetrisch).", check: (v) => v.shape === 3 },
    { id: "vier", text: "Öffne das Quadrat (alle 4 Symmetrieachsen).", check: (v) => v.shape === 5 },
  ],
};

export const labLineCross: LabDefinition = {
  kind: "line-cross",
  title: "Labor: Scheitel- und Nebenwinkel",
  intro:
    "Ziehe Winkel α auf der Skala. Scheitelwinkel bleiben immer gleich groß, Nebenwinkel ergänzen sich zu 180°.",
  params: [range("alpha", "Winkel α", 25, 155, 50, 5, "°")],
  readouts: [
    { key: "alpha", label: "Scheitelwinkel α'", digits: 0, compute: (v) => v.alpha },
    { key: "beta", label: "Nebenwinkel β", emphasis: true, digits: 0, compute: (v) => 180 - v.alpha },
  ],
  goals: [
    { id: "gleich", text: "Wann werden α und sein Nebenwinkel β exakt gleich groß?", check: (v) => v.alpha === 90 },
    { id: "doppelt", text: "Stelle einen stumpfen Winkel α ein, der genau doppelt so groß ist wie β.", check: (v) => v.alpha === 120 },
    { id: "spitz", text: "Wähle β = 145°.", check: (v) => 180 - v.alpha === 145 },
  ],
};

export const labParallelTransversal: LabDefinition = {
  kind: "parallel-transversal",
  title: "Labor: Stufen- und Wechselwinkel",
  intro:
    "Drehe die Neigung Δ von Gerade h auf 0°, bis beide Geraden parallel sind und Stufenwinkel exakt gleich werden.",
  params: [
    range("alpha", "Winkel α₁", 45, 130, 60, 5, "°"),
    range("tilt", "Neigung Δ", -15, 15, 10, 5, "°"),
  ],
  readouts: [
    { key: "a2", label: "Stufenwinkel α₂", digits: 0, compute: (v) => v.alpha - v.tilt },
    { key: "par", label: "Lage", emphasis: true, compute: (v) => (v.tilt === 0 ? "g ∥ h (parallel)" : "Geraden schneiden sich") },
  ],
  goals: [
    { id: "par70", text: "Stelle Parallelität (g ∥ h) mit α₁ = α₂ = 70° ein.", check: (v) => v.tilt === 0 && v.alpha === 70 },
    { id: "diff", text: "Erzeuge α₂ = 95° bei parallelen Geraden.", check: (v) => v.tilt === 0 && v.alpha === 95 },
    { id: "schräg", text: "Wähle eine nicht parallele Lage mit genau 15° Abweichung bei α₁ = 80°.", check: (v) => v.alpha === 80 && Math.abs(v.tilt) === 15 },
  ],
};

export const labTriangleProof: LabDefinition = {
  kind: "triangle-proof",
  title: "Labor: Beweis der Innenwinkelsumme",
  intro:
    "Blende die Hilfsparallele durch C ein und ziehe Spitze C: α' und β' (Wechselwinkel) legen sich mit γ genau zu 180° zusammen.",
  params: [
    range("cx", "C x", 150, 370, 290, 10),
    range("cy", "C y", 70, 170, 100, 10),
    choice("showAux", "Hilfsparallele durch C", 0, [
      { value: 0, label: "ausblenden" },
      { value: 1, label: "Hilfslinie h ∥ AB zeigen" },
    ]),
  ],
  readouts: [
    {
      key: "sum",
      label: "α + β + γ",
      emphasis: true,
      compute: (v) => {
        const A = { x: 105, y: 235 };
        const B = { x: 415, y: 235 };
        const C = { x: v.cx, y: v.cy };
        const a = Math.round(angleDeg(A, B, C));
        const b = Math.round(angleDeg(B, A, C));
        const g = 180 - a - b;
        return `${fmt(a, 0)}° + ${fmt(b, 0)}° + ${fmt(g, 0)}° = 180°`;
      },
    },
  ],
  goals: [
    { id: "hilf", text: "Blende die Hilfsparallele h ∥ AB ein.", check: (v) => v.showAux === 1 },
    { id: "sym", text: "Bringe C genau über die Mitte (cx = 260) mit Hilfslinie (gleichschenklig!).", check: (v) => v.showAux === 1 && v.cx === 260 },
    { id: "flach", text: "Ziehe C weit nach links (cx ≤ 170) und prüfe die Summe mit Hilfslinie.", check: (v) => v.showAux === 1 && v.cx <= 170 },
  ],
};

export const labPolygonTriangulation: LabDefinition = {
  kind: "polygon-triangulation",
  title: "Labor: Vieleck in Dreiecke zerlegen",
  intro:
    "Wähle Eckenzahl n und blende die Diagonalen von einer Ecke aus ein. Jedes neue Eck fügt genau ein Dreieck (180°) hinzu.",
  params: [
    range("n", "Eckenzahl n", 3, 9, 4),
    choice("showDiag", "Zerlegung", 0, [
      { value: 0, label: "Diagonalen ausblenden" },
      { value: 1, label: "Diagonalen von einer Ecke" },
    ]),
  ],
  readouts: [
    { key: "tri", label: "Teildreiecke", digits: 0, compute: (v) => v.n - 2 },
    { key: "sum", label: "Innenwinkelsumme", emphasis: true, digits: 0, compute: (v) => polygonAngleSum(v.n) },
  ],
  goals: [
    { id: "sechs", text: "Zerlege ein Sechseck sichtbar in 4 Dreiecke (720°).", check: (v) => v.n === 6 && v.showDiag === 1 },
    { id: "acht", text: "Bestimme die Winkelsumme eines Achtecks mit sichtbaren Diagonalen.", check: (v) => v.n === 8 && v.showDiag === 1 },
    { id: "eins35", text: "Finde ein regelmäßiges n-Eck mit Einzelwinkel 135°.", check: (v) => Math.abs(polygonAngleSum(v.n) / v.n - 135) < 1e-6 },
  ],
};

export const labMultiCrossing: LabDefinition = {
  kind: "multi-crossing",
  title: "Labor: Parallelitätsprüfung durch Winkel",
  intro:
    "Stelle den Stufenwinkel ε bei D ein. Nur wenn ε genauso groß ist wie α = 65°, verläuft DE parallel zu AB.",
  params: [range("eps", "Winkel ε bei D", 45, 95, 55, 5, "°")],
  readouts: [
    { key: "par", label: "Ergebnis", emphasis: true, compute: (v) => (v.eps === 65 ? "DE ∥ AB (parallel)" : "nicht parallel") },
    { key: "sup", label: "Nebenwinkel von ε", digits: 0, compute: (v) => 180 - v.eps },
  ],
  goals: [
    { id: "parallel", text: "Stelle ε so ein, dass DE ∥ AB gilt.", check: (v) => v.eps === 65 },
    { id: "winkel90", text: "Stelle genau ε = 90° ein (rechter Winkel an D).", check: (v) => v.eps === 90 },
    { id: "klein", text: "Wähle einen Winkel mit Nebenwinkel 130°.", check: (v) => 180 - v.eps === 130 },
  ],
};

// ─── Etappe 3: Lineare Gleichungen & Prozentrechnung ───────────────────────

export const labEquationModel: LabDefinition = {
  kind: "equation-model",
  title: "Labor: Balkenmodell für lineare Gleichungen",
  intro:
    "Vergleiche die Gesamtlänge von a x-Blöcken + b mit dem Zielbalken. Stelle x so ein, dass beide gleich lang sind.",
  params: [
    range("a", "Anzahl x-Blöcke (a)", 2, 4, 3),
    range("b", "Summand b", 1, 8, 4),
    range("x", "Unbekannte x", 1, 10, 3),
    range("target", "Zielwert", 10, 28, 19),
  ],
  readouts: [
    { key: "left", label: "Linke Seite", digits: 0, compute: (v) => v.a * v.x + v.b },
    { key: "diff", label: "Abweichung", emphasis: true, digits: 0, compute: (v) => v.a * v.x + v.b - v.target },
  ],
  goals: [
    { id: "loes5", text: "Löse 3x + 4 = 19 am Balkenmodell.", check: (v) => v.a === 3 && v.b === 4 && v.target === 19 && v.x === 5 },
    { id: "neu", text: "Stelle 4x + 2 = 26 ein und löse die Gleichung.", check: (v) => v.a === 4 && v.b === 2 && v.target === 26 && v.x === 6 },
    { id: "x8", text: "Finde eine beliebige Gleichung mit a = 2 und Lösung x = 8.", check: (v) => v.a === 2 && v.x === 8 && v.a * v.x + v.b === v.target },
  ],
};

export const labBalanceScale: LabDefinition = {
  kind: "balance-scale",
  title: "Labor: Balkenwaage und Äquivalenzumformungen",
  intro:
    "Führe schrittweise Äquivalenzumformungen durch und prüfe mit testX: Die Lösung x = 4 hält die Waage bei JEDEM Schritt im Gleichgewicht.",
  params: [
    choice("step", "Umformungsstand", 0, [
      { value: 0, label: "Start: 5x + 3 = 2x + 15" },
      { value: 1, label: "Nach | − 2x: 3x + 3 = 15" },
      { value: 2, label: "Nach | − 3: 3x = 12" },
      { value: 3, label: "Nach | : 3: x = 4" },
    ]),
    range("testX", "Testwert für x", 1, 9, 2),
  ],
  actions: [
    { id: "next", label: "Nächste Umformung", apply: (v) => ({ step: Math.min(3, v.step + 1) }) },
    { id: "reset", label: "Zurück zum Start", apply: () => ({ step: 0 }) },
  ],
  readouts: [
    {
      key: "eq",
      label: "Aktuelle Gleichung",
      emphasis: true,
      compute: (v) => {
        const s = BALANCE_STEPS[v.step] ?? BALANCE_STEPS[0];
        return `${eqSideText(s.lx, s.lc)} = ${eqSideText(s.rx, s.rc)}`;
      },
    },
    {
      key: "bal",
      label: "Waage bei testX",
      compute: (v) => {
        const s = BALANCE_STEPS[v.step] ?? BALANCE_STEPS[0];
        const d = s.lx * v.testX + s.lc - (s.rx * v.testX + s.rc);
        return d === 0 ? "im Gleichgewicht ✓" : `Differenz ${fmt(d, 0)}`;
      },
    },
  ],
  goals: [
    { id: "probe0", text: "Bringe die Startgleichung mit testX ins Gleichgewicht.", check: (v) => v.step === 0 && v.testX === 4 },
    { id: "isoX", text: "Bringe alle x auf eine Seite (3x = 12) und prüfe das Gleichgewicht.", check: (v) => v.step === 2 && v.testX === 4 },
    { id: "fertig", text: "Isoliere x vollständig zu x = 4 bei ausgeglichener Waage.", check: (v) => v.step === 3 && v.testX === 4 },
  ],
};

export const labEqVsTrial: LabDefinition = {
  kind: "eq-vs-trial",
  title: "Labor: Klammergleichung und Dezimal-Lösung",
  intro:
    "Untersuche 3 · (x − 1) = x + b. Verstelle b und beobachte, warum grobes Ganzzahl-Probieren Dezimallösungen wie 3,5 überspringt.",
  params: [
    range("x", "Probierwert x", -1, 6, 0, 0.5),
    range("b", "b", 3, 7, 4),
  ],
  readouts: [
    { key: "sol", label: "Exakte Lösung", emphasis: true, digits: 2, compute: (v) => (v.b + 3) / 2 },
    { key: "gap", label: "Restfehler", digits: 1, compute: (v) => Math.abs(3 * (v.x - 1) - (v.x + v.b)) },
  ],
  goals: [
    { id: "halb", text: "Finde die gebrochene Lösung x = 3,5 für b = 4.", check: (v) => v.b === 4 && v.x === 3.5 },
    { id: "ganz", text: "Stelle b = 5 ein und finde die ganzzahlige Lösung.", check: (v) => v.b === 5 && v.x === 4 },
    { id: "vier5", text: "Erzeuge die Lösung x = 4,5 durch passendes b.", check: (v) => v.b === 6 && v.x === 4.5 },
  ],
};

export const labEqCases: LabDefinition = {
  kind: "eq-cases",
  title: "Labor: Die drei Lösungsfälle",
  intro:
    "Verändere Koeffizient a und Konstante b in a·x + 2 = 3·x + b und beobachte, wann die Geraden sich schneiden, parallel laufen oder zusammenfallen.",
  params: [
    range("a", "Koeffizient a", 1, 5, 2),
    range("b", "Konstante b", 0, 6, 4),
  ],
  readouts: [
    {
      key: "caseLabel",
      label: "Lösungsmenge",
      emphasis: true,
      compute: (v) => (v.a !== 3 ? "genau 1 Lösung" : v.b === 2 ? "𝕃 = ℚ (allgemeingültig)" : "𝕃 = {} (unlösbar)"),
    },
  ],
  goals: [
    { id: "leer", text: "Erzeuge eine unlösbare Gleichung (parallele Geraden, 𝕃 = {}).", check: (v) => v.a === 3 && v.b !== 2 },
    { id: "alle", text: "Erzeuge eine allgemeingültige Gleichung (𝕃 = ℚ).", check: (v) => v.a === 3 && v.b === 2 },
    { id: "pos2", text: "Stelle genau eine Lösung bei x = 2 ein (Schnittpunkt der Geraden).", check: (v) => v.a !== 3 && Math.abs((v.b - 2) / (v.a - 3) - 2) < 1e-6 },
  ],
};

export const labPercentEquation: LabDefinition = {
  kind: "percent-equation",
  title: "Labor: Prozentgleichung und Rückrechnen",
  intro:
    "Vergleiche das echte Rückrechnen mit (1 + p/100) gegen den typischen Fehler, einfach dieselbe Prozentzahl wieder abzuziehen.",
  params: [
    range("net", "Grundwert G (€)", 50, 200, 100, 10),
    range("p", "Prozentänderung p (%)", -30, 30, 15, 5),
  ],
  readouts: [
    { key: "end", label: "Neuer Wert W", emphasis: true, digits: 2, compute: (v) => percentAfter(v.net, v.p) },
    { key: "trap", label: "Falscher Rückweg", digits: 2, compute: (v) => percentAfter(percentAfter(v.net, v.p), -v.p) },
  ],
  goals: [
    { id: "mwst", text: "Erzeuge mit G = 100 € einen um 20 % erhöhten Endwert von 120 €.", check: (v) => v.net === 100 && v.p === 20 },
    { id: "rabatt", text: "Stelle 25 % Rabatt auf 160 € ein (Endwert 120 €).", check: (v) => v.net === 160 && v.p === -25 },
    { id: "diff9", text: "Finde eine Einstellung mit Endwert 144 € und p = 20 % (Grundwert?).", check: (v) => v.p === 20 && Math.abs(percentAfter(v.net, v.p) - 144) < 1e-6 },
  ],
};

export const labChainPercent: LabDefinition = {
  kind: "chain-percent",
  title: "Labor: Hintereinanderausführung von Prozenten",
  intro:
    "Start ist immer 100 €. Wende nacheinander p₁ und p₂ an und prüfe die Abweichung vom naiven Addieren.",
  params: [
    range("p1", "1. Änderung p₁ (%)", -30, 30, 10, 5),
    range("p2", "2. Änderung p₂ (%)", -30, 30, 10, 5),
  ],
  readouts: [
    { key: "end", label: "Endwert (€)", emphasis: true, digits: 2, compute: (v) => 100 * (1 + v.p1 / 100) * (1 + v.p2 / 100) },
    { key: "pct", label: "Gesamtänderung (%)", digits: 2, compute: (v) => percentChainPercent(v.p1, v.p2) },
  ],
  goals: [
    { id: "plusminus", text: "Zeige mit +20 % und −20 %, dass der Endwert unter 100 € sinkt (96 €).", check: (v) => v.p1 === 20 && v.p2 === -20 },
    { id: "doppel", text: "Erreiche genau 144 € nach zwei gleich großen Erhöhungen.", check: (v) => v.p1 === v.p2 && Math.abs(100 * (1 + v.p1 / 100) ** 2 - 144) < 1e-6 },
    { id: "neutral", text: "Finde zwei entgegengesetzte Änderungen mit Gesamtänderung genau −9 %.", check: (v) => v.p1 === -v.p2 && Math.abs(percentChainPercent(v.p1, v.p2) + 9) < 1e-6 },
  ],
};

export const labClaimAudit: LabDefinition = {
  kind: "claim-audit",
  title: "Labor: Prozentpunkte vs. relative Veränderung",
  intro:
    "Vergleiche Prozentpunkte (Unterschied zweier Prozentwerte) mit der relativen Steigerung zum Ausgangsanteil.",
  params: [
    range("v0", "Vorher (%)", 10, 80, 50, 5),
    range("v1", "Nachher (%)", 10, 90, 60, 5),
  ],
  readouts: [
    { key: "pp", label: "Prozentpunkte", digits: 0, compute: (v) => v.v1 - v.v0 },
    { key: "rel", label: "Relativ (%)", emphasis: true, digits: 1, compute: (v) => ((v.v1 - v.v0) / v.v0) * 100 },
  ],
  goals: [
    { id: "verdopp", text: "Stelle einen Sprung um +10 Prozentpunkte ein, der relativ +100 % entspricht!", check: (v) => v.v1 - v.v0 === 10 && Math.abs(((v.v1 - v.v0) / v.v0) * 100 - 100) < 1e-6 },
    { id: "halb", text: "Zeige +25 % relative Steigerung bei Ausgangsanteil 40 %.", check: (v) => v.v0 === 40 && v.v1 === 50 },
    { id: "rueck", text: "Stelle einen Rückgang um −20 Prozentpunkte und relativ −50 % ein.", check: (v) => v.v1 - v.v0 === -20 && v.v0 === 40 },
  ],
};

// ─── Etappe 4: Kenngrößen von Daten ────────────────────────────────────────

export const labMedianOrder: LabDefinition = {
  kind: "median-order",
  title: "Labor: Median und Mittelwert",
  intro:
    "Wähle Anzahl n und bewege einen Wert entlang der Liste. Beobachte, wie die geordnete Mitte den Median bestimmt.",
  params: [
    range("n", "Anzahl Werte n", 5, 8, 5),
    range("xVal", "Beweglicher Wert", 2, 16, 10),
  ],
  readouts: [
    {
      key: "med",
      label: "Median",
      emphasis: true,
      digits: 1,
      compute: (v) => median([...[4, 7, 9, 13, 15, 6, 11].slice(0, v.n - 1), v.xVal]),
    },
    {
      key: "avg",
      label: "Mittelwert",
      digits: 2,
      compute: (v) => mean([...[4, 7, 9, 13, 15, 6, 11].slice(0, v.n - 1), v.xVal]),
    },
  ],
  goals: [
    { id: "ungerade", text: "Bringe bei n = 5 den Median genau auf 7.", check: (v) => v.n === 5 && median([...[4, 7, 9, 13], v.xVal]) === 7 },
    { id: "gerade", text: "Wähle n = 6 und stelle genau den Median 8,5 ein.", check: (v) => v.n === 6 && median([...[4, 7, 9, 13, 15], v.xVal]) === 8.5 },
    { id: "hoch", text: "Wähle n = 7 und schiebe den beweglichen Wert auf 12, sodass der Median 9 wird.", check: (v) => v.n === 7 && median([...[4, 7, 9, 13, 15, 6], v.xVal]) === 9 },
  ],
};

export const labOutlierShift: LabDefinition = {
  kind: "outlier-shift",
  title: "Labor: Ausreißer verschieben",
  intro:
    "Ziehe am 7. Gehalt und beobachte, ob der Median oder das arithmetische Mittel davon beeinflusst wird.",
  params: [range("v7", "7. Wert (€)", 1500, 14000, 3000, 500)],
  readouts: [
    { key: "med", label: "Median", emphasis: true, digits: 0, compute: (v) => median([2200, 2400, 2500, 2600, 2800, 3000, v.v7]) },
    { key: "avg", label: "Mittelwert", digits: 0, compute: (v) => mean([2200, 2400, 2500, 2600, 2800, 3000, v.v7]) },
  ],
  goals: [
    { id: "ausr", text: "Ziehe den 7. Wert auf mindestens 12 000 €: Der Median bleibt bei 2 600 €, der Mittelwert steigt über 3 900 €.", check: (v) => v.v7 >= 12000 },
    { id: "exakt", text: "Finde den 7. Wert, bei dem der Mittelwert exakt 3 500 € beträgt.", check: (v) => Math.abs(mean([2200, 2400, 2500, 2600, 2800, 3000, v.v7]) - 3500) < 1e-6 },
    { id: "unten", text: "Verschiebe den 7. Wert ganz nach links (< 2 200 €) und prüfe den neuen Median.", check: (v) => v.v7 < 2200 },
  ],
};

export const labQuartilesSplit: LabDefinition = {
  kind: "quartiles-split",
  title: "Labor: Spannweite und Quartile",
  intro:
    "Verstelle Min und Max einer 7er-Liste. Der Median spaltet die Liste in untere Hälfte (q₁) und obere Hälfte (q₃).",
  params: [
    range("low", "Kleinster Wert", 2, 8, 6),
    range("high", "Größter Wert", 18, 30, 20, 2),
  ],
  readouts: [
    { key: "span", label: "Spannweite R", emphasis: true, digits: 0, compute: (v) => fiveNumbers([v.low, 8, 10, 14, 16, 18, v.high]).span },
    { key: "iqr", label: "Quartilsabstand", digits: 0, compute: (v) => fiveNumbers([v.low, 8, 10, 14, 16, 18, v.high]).iqr },
  ],
  goals: [
    { id: "r24", text: "Stelle eine Spannweite von genau R = 24 ein.", check: (v) => v.high - v.low === 24 },
    { id: "r28", text: "Erreiche die größtmögliche Spannweite R = 28.", check: (v) => v.high - v.low === 28 },
    { id: "iqr10", text: "Stelle low = 8 und high = 18 ein und prüfe, dass der Quartilsabstand q₃ − q₁ unverändert 10 bleibt.", check: (v) => v.low === 8 && v.high === 18 },
  ],
};

export const labBoxplotBuilder: LabDefinition = {
  kind: "boxplot-builder",
  title: "Labor: Boxplot aus fünf Kennwerten",
  intro:
    "Verstelle q₁, Median, q₃ und Maximum. Jeder der vier Abschnitte des Boxplots enthält etwa 25 % aller Daten.",
  params: [
    range("q1", "Unteres Quartil q₁", 4, 9, 7),
    range("med", "Median q₂", 10, 15, 12),
    range("q3", "Oberes Quartil q₃", 16, 21, 18),
    range("max", "Maximum", 22, 28, 24),
  ],
  readouts: [
    { key: "iqr", label: "Boxbreite (IQR)", emphasis: true, digits: 0, compute: (v) => v.q3 - v.q1 },
    { key: "span", label: "Spannweite", digits: 0, compute: (v) => v.max - 2 },
  ],
  goals: [
    { id: "sym", text: "Baue einen symmetrischen Boxplot um Median 15 mit q₁ = 9 und q₃ = 21.", check: (v) => v.med === 15 && v.q1 === 9 && v.q3 === 21 && v.max === 28 },
    { id: "eng", text: "Mache die Box möglichst schmal (IQR = 7).", check: (v) => v.q3 - v.q1 === 7 },
    { id: "schief", text: "Erzeuge einen Boxplot mit langem oberem Antennen-Stück (max = 28, q₃ = 16).", check: (v) => v.max === 28 && v.q3 === 16 },
  ],
};

export const labBoxplotCompare: LabDefinition = {
  kind: "boxplot-compare",
  title: "Labor: Zwei Boxplots vergleichen",
  intro:
    "Vergleiche Gruppe B direkt mit der festen Gruppe A (Median 18, IQR 8). Ziehe Median und Boxbreite von B.",
  params: [
    range("shiftB", "Verschiebung Median B", -4, 6, 0, 2),
    range("spreadB", "Halbe Boxbreite B", 2, 6, 4, 2),
  ],
  readouts: [
    { key: "medB", label: "Median B", emphasis: true, digits: 0, compute: (v) => 18 + v.shiftB },
    { key: "iqrB", label: "IQR B", digits: 0, compute: (v) => 2 * v.spreadB },
  ],
  goals: [
    { id: "besser", text: "Mache Gruppe B im Median um 4 Einheiten größer als Gruppe A.", check: (v) => v.shiftB === 4 },
    { id: "kleiner", text: "Schiebe die gesamte Box von B nach links (Median B = 14) bei schmaler Streuung (IQR = 4).", check: (v) => v.shiftB === -4 && v.spreadB === 2 },
    { id: "breit", text: "Lasse die Mediane genau gleich (18), aber vergrößere die halbe Boxbreite von 4 auf 6 (IQR = 12).", check: (v) => v.shiftB === 0 && v.spreadB === 6 },
  ],
};

// ─── Etappe 5: Kongruenz und Dreieckskonstruktionen ────────────────────────

export const labCongruenceMotion: LabDefinition = {
  kind: "congruence-motion",
  title: "Labor: Kongruenz durch Bewegung",
  intro:
    "Verschiebe und drehe Δ₂ exakt auf Urfigur Δ₁. Wenn alle Seiten und Winkel zur Deckung kommen, sind die Figuren kongruent.",
  params: [
    range("dx", "Verschiebung dx", 0, 180, 120, 20),
    range("rot", "Drehwinkel", 0, 180, 60, 30, "°"),
  ],
  readouts: [
    { key: "cong", label: "Deckung", emphasis: true, compute: (v) => (v.dx === 0 && v.rot === 0 ? "deckungsgleich ✓" : "noch verschoben / gedreht") },
  ],
  goals: [
    { id: "parallel", text: "Richte beide Dreiecke parallel aus (Drehwinkel 0°).", check: (v) => v.rot === 0 && v.dx > 0 },
    { id: "halb", text: "Drehe Δ₂ genau um eine halbe Drehung (180°).", check: (v) => v.rot === 180 },
    { id: "deck", text: "Bringe Δ₁ und Δ₂ exakt zur Deckung.", check: (v) => v.dx === 0 && v.rot === 0 },
  ],
};

export const labSssSws: LabDefinition = {
  kind: "sss-sws",
  title: "Labor: Kongruenzsätze SSS und SWS",
  intro:
    "Untersuche beim SSS-Modus die Dreiecksungleichung (a + b > c bei b = 4, c = 6). Schalte dann zu SWS.",
  params: [
    choice("mode", "Kongruenzsatz", 0, [
      { value: 0, label: "SSS (a, b=4, c=6)" },
      { value: 1, label: "SWS (c=6, b=4, α)" },
    ]),
    range("a", "Seite a (SSS)", 1.5, 8, 1.5, 0.5),
    range("alpha", "Winkel α (SWS)", 30, 135, 60, 15, "°"),
  ],
  readouts: [
    {
      key: "ok",
      label: "Konstruierbarkeit",
      emphasis: true,
      compute: (v) =>
        v.mode === 1
          ? "SWS eindeutig ✓"
          : triangleValid(v.a, 4, 6)
            ? "SSS eindeutig ✓"
            : "Kein Dreieck (a + b ≤ c)",
    },
  ],
  goals: [
    { id: "grenze", text: "Prüfe den Grenzfall a = 2 (2 + 4 = 6): Die Bögen treffen auf einer Gerade.", check: (v) => v.mode === 0 && v.a === 2 },
    { id: "sssOk", text: "Finde eine Seite a, mit der im SSS-Modus ein eindeutiges Dreieck entsteht.", check: (v) => v.mode === 0 && triangleValid(v.a, 4, 6) },
    { id: "sws90", text: "Konstruiere per SWS ein rechtwinkliges Dreieck (α = 90°).", check: (v) => v.mode === 1 && v.alpha === 90 },
  ],
};

export const labWswSsw: LabDefinition = {
  kind: "wsw-ssw",
  title: "Labor: Eindeutiges SsW vs. zweideutiges sSW",
  intro:
    "Gegeben sind b = 5, Winkel α und Gegenseite a. Beobachte am Kreis um C mit Radius a, wann 0, 2 oder genau 1 Dreieck entsteht.",
  params: [
    range("a", "Gegenseite a", 2, 7, 3, 0.5),
    range("alpha", "Winkel α", 30, 60, 30, 15, "°"),
  ],
  readouts: [
    { key: "cnt", label: "Anzahl Dreiecke", emphasis: true, digits: 0, compute: (v) => sswSolutions(5, v.a, v.alpha).count },
  ],
  goals: [
    { id: "nullL", text: "Mache Seite a bei α = 30° so klein, dass gar kein Dreieck entsteht.", check: (v) => v.alpha === 30 && sswSolutions(5, v.a, v.alpha).count === 0 },
    { id: "beruehr", text: "Triff bei α = 30° exakt die Höhe h_c = 2,5 (1 Berührpunkt!).", check: (v) => v.alpha === 30 && v.a === 2.5 },
    { id: "eindeutig", text: "Erfülle den Kongruenzsatz SsW (a > b = 5), sodass eindeutig 1 Dreieck entsteht.", check: (v) => v.a > 5 && sswSolutions(5, v.a, v.alpha).count === 1 },
  ],
};

export const labIsosceles: LabDefinition = {
  kind: "isosceles-lab",
  title: "Labor: Gleichschenklige & gleichseitige Dreiecke",
  intro:
    "Verändere Basis c und Schenkel a = b. Beobachte die Basiswinkel α = β und den Sonderfall a = c.",
  params: [
    range("c", "Basis c", 3, 8, 6),
    range("a", "Schenkel a", 2.5, 7, 4, 0.5),
  ],
  readouts: [
    {
      key: "alpha",
      label: "Basiswinkel α",
      emphasis: true,
      digits: 1,
      compute: (v) => (2 * v.a > v.c ? (Math.acos(v.c / (2 * v.a)) * 180) / Math.PI : 0),
    },
  ],
  goals: [
    { id: "ungleich", text: "Verletze die Dreiecksungleichung (2·a ≤ c): Die Schenkel erreichen sich nicht.", check: (v) => 2 * v.a <= v.c },
    { id: "equi", text: "Erzeuge ein gleichseitiges Dreieck (alle Winkel 60°).", check: (v) => v.a === v.c },
    { id: "steil", text: "Finde ein gleichschenkliges Dreieck mit spitzem Winkel γ < 40° an der Spitze C.", check: (v) => 2 * v.a > v.c && 180 - 2 * ((Math.acos(v.c / (2 * v.a)) * 180) / Math.PI) < 40 },
  ],
};

export const labConverseChecker: LabDefinition = {
  kind: "converse-checker",
  title: "Labor: Satz und Kehrsatz prüfen",
  intro:
    "Wähle einen mathematischen Satz und verstelle w, um ein Gegenbeispiel für seinen Kehrsatz zu bauen.",
  params: [
    choice("stmt", "Satz", 0, [
      { value: 0, label: "Quadrat ⇒ Rechteck" },
      { value: 1, label: "Gleichseitig ⇒ Gleichschenklig" },
      { value: 2, label: "Thaleskreis ⇒ Winkel 90°" },
    ]),
    range("w", "Seitenmaß w", 2, 6, 4),
  ],
  readouts: [
    {
      key: "status",
      label: "Kehrsatz",
      emphasis: true,
      compute: (v) =>
        v.stmt === 2
          ? "wahr (Äquivalenz)"
          : v.w === 4
            ? "Spezialfall (noch kein Gegenbeispiel)"
            : "Gegenbeispiel gefunden!",
    },
  ],
  goals: [
    { id: "recht", text: "Widerlege beim Quadrat-Satz den Kehrsatz (Rechteck ≠ Quadrat).", check: (v) => v.stmt === 0 && v.w !== 4 },
    { id: "schenk", text: "Zeige beim Dreieck ein gleichschenkliges, aber nicht gleichseitiges Gegenbeispiel.", check: (v) => v.stmt === 1 && v.w !== 4 },
    { id: "thales", text: "Öffne den Satz des Thales, dessen Kehrsatz immer wahr bleibt.", check: (v) => v.stmt === 2 },
  ],
};

export const labCircumInCircle: LabDefinition = {
  kind: "circum-in-circle",
  title: "Labor: Umkreis und Inkreis (DGS)",
  intro:
    "Ziehe Eckpunkt C(cx|cy) und wechsle zwischen Umkreis (Mittelsenkrechten) und Inkreis (Winkelhalbierende).",
  params: [
    choice("mode", "Kreis", 0, [
      { value: 0, label: "Umkreis (Mittelsenkrechten)" },
      { value: 1, label: "Inkreis (Winkelhalbierende)" },
    ]),
    range("cx", "C x", 1, 9, 4, 0.5),
    range("cy", "C y", 3, 6.5, 5, 0.5),
  ],
  readouts: [
    {
      key: "gamma",
      label: "Winkel γ bei C",
      emphasis: true,
      digits: 1,
      compute: (v) => angleDeg({ x: v.cx, y: v.cy }, { x: 2.5, y: 2 }, { x: 7.5, y: 2 }),
    },
    {
      key: "rOut",
      label: "Radius",
      digits: 2,
      compute: (v) => {
        const A = { x: 2.5, y: 2 };
        const B = { x: 7.5, y: 2 };
        const C = { x: v.cx, y: v.cy };
        if (v.mode === 0) {
          const U = circumcenter(A, B, C);
          return U ? dist2D(U, A) : 0;
        }
        return inradius(A, B, C);
      },
    },
  ],
  goals: [
    {
      id: "stumpf",
      text: "Mache γ > 95° (stumpfwinklig), sodass der Umkreismittelpunkt U unter [AB] herauswandert.",
      check: (v) => v.mode === 0 && angleDeg({ x: v.cx, y: v.cy }, { x: 2.5, y: 2 }, { x: 7.5, y: 2 }) > 95,
    },
    {
      id: "thalesPunkt",
      text: "Bringe U genau auf die Mitte von [AB] (γ = 90°, cx = 5, cy = 4,5).",
      check: (v) => v.mode === 0 && v.cx === 5 && v.cy === 4.5,
    },
    {
      id: "inkreis",
      text: "Schalte zum Inkreis um und wähle ρ ≥ 1,2.",
      check: (v) => v.mode === 1 && inradius({ x: 2.5, y: 2 }, { x: 7.5, y: 2 }, { x: v.cx, y: v.cy }) >= 1.2,
    },
  ],
};

export const labThales: LabDefinition = {
  kind: "thales-lab",
  title: "Labor: Beweis zum Satz des Thales",
  intro:
    "Der Thaleskreis über [AB] hat den Radius r = 105. Verstelle Abstand |MC| und Winkel φ und prüfe, wann γ = 90° gilt.",
  params: [
    range("r", "Abstand |MC|", 70, 140, 70, 5),
    range("phi", "Winkel φ", 25, 155, 60, 5, "°"),
  ],
  readouts: [
    {
      key: "gamma",
      label: "Winkel γ bei C",
      emphasis: true,
      digits: 1,
      compute: (v) => {
        const A = { x: -105, y: 0 };
        const B = { x: 105, y: 0 };
        const rad = (v.phi * Math.PI) / 180;
        const C = { x: v.r * Math.cos(rad), y: v.r * Math.sin(rad) };
        return angleDeg(C, A, B);
      },
    },
  ],
  goals: [
    { id: "auf", text: "Setze C auf den Thaleskreis (|MC| = 105): γ wird exakt 90°!", check: (v) => v.r === 105 },
    { id: "wander", text: "Bewege C auf dem Thaleskreis weit nach links (φ ≥ 125°) und bestätige γ = 90°.", check: (v) => v.r === 105 && v.phi >= 125 },
    { id: "aussen", text: "Lege C außerhalb des Kreises (|MC| = 135): γ wird spitz (< 90°).", check: (v) => v.r === 135 },
  ],
};

export const labTangentThales: LabDefinition = {
  kind: "tangent-thales",
  title: "Labor: Tangentenkonstruktion mit Thaleskreis",
  intro:
    "Finde den Winkel φ des Berührpunkts B, bei dem der Radius [MB] senkrecht auf [PB] steht. Der Thaleskreis über [MP] hilft!",
  params: [
    range("phi", "Winkel φ", 20, 85, 30, 5, "°"),
    choice("showThales", "Hilfskreis", 0, [
      { value: 0, label: "ohne Thaleskreis" },
      { value: 1, label: "Thaleskreis über [MP] zeigen" },
    ]),
  ],
  readouts: [
    {
      key: "mbp",
      label: "Winkel ∠MBP",
      emphasis: true,
      digits: 1,
      compute: (v) => {
        const M = { x: 0, y: 0 };
        const P = { x: 2, y: 0 };
        const rad = (v.phi * Math.PI) / 180;
        const B = { x: Math.cos(rad), y: Math.sin(rad) };
        return angleDeg(B, M, P);
      },
    },
  ],
  goals: [
    { id: "hilf", text: "Blende den Thaleskreis über [MP] ein.", check: (v) => v.showThales === 1 },
    { id: "tangent", text: "Triff den Berührpunkt genau auf dem Schnittpunkt (φ = 60°, ∠MBP = 90°).", check: (v) => v.phi === 60 },
    { id: "beides", text: "Zeige mit Thaleskreis eine Sekante jenseits der Tangente (φ = 80°).", check: (v) => v.showThales === 1 && v.phi === 80 },
  ],
};

export const labHeightConstruction: LabDefinition = {
  kind: "height-construction",
  title: "Labor: Dreieck aus c, h_c und α",
  intro:
    "Die Höhe h_c legt die Spitze C auf eine Parallele zu AB im Abstand h_c. Das Teildreieck ΔADC ist rechtwinklig!",
  params: [
    range("hc", "Höhe h_c", 2, 4.5, 3, 0.5, "cm"),
    range("alpha", "Winkel α", 30, 120, 60, 15, "°"),
  ],
  readouts: [
    { key: "b", label: "Seite b = h_c / sin α", emphasis: true, digits: 2, compute: (v) => v.hc / Math.sin((v.alpha * Math.PI) / 180) },
  ],
  goals: [
    { id: "senkr", text: "Stelle α = 90° ein: Dann fällt Seite b mit der Höhe h_c zusammen.", check: (v) => v.alpha === 90 },
    { id: "stumpf", text: "Mache α stumpf (105°), sodass die Höhe h_c außerhalb der Grundseite c fällt.", check: (v) => v.alpha === 105 },
    { id: "dopp", text: "Erreiche bei h_c = 4 cm eine Höhe auf dem Maximalstreifen mit α = 45°.", check: (v) => v.hc === 4 && v.alpha === 45 },
  ],
};

export const labSurveyModeling: LabDefinition = {
  kind: "survey-modeling",
  title: "Labor: Flussbreite peilen (WSW)",
  intro:
    "Standlinie c = 60 m am Ufer. Verstelle die Peilwinkel α und β zum Baum C am anderen Ufer und bestimme die Flussbreite.",
  params: [
    range("alpha", "Peilwinkel α", 35, 75, 45, 5, "°"),
    range("beta", "Peilwinkel β", 40, 75, 55, 5, "°"),
  ],
  readouts: [
    {
      key: "width",
      label: "Flussbreite (m)",
      emphasis: true,
      digits: 1,
      compute: (v) => {
        const ra = (v.alpha * Math.PI) / 180;
        const rb = (v.beta * Math.PI) / 180;
        return (60 * Math.sin(ra) * Math.sin(rb)) / Math.sin(ra + rb);
      },
    },
  ],
  goals: [
    { id: "gleich", text: "Peile symmetrisch mit α = β = 45°: Welche exakte Breite entsteht bei einem halben Quadrat?", check: (v) => v.alpha === 45 && v.beta === 45 },
    { id: "rechtw", text: "Mache das Peildreieck am Baum C rechtwinklig (α + β = 90°, z. B. 35° + 55°).", check: (v) => v.alpha + v.beta === 90 },
    { id: "breit50", text: "Finde Winkel mit mindestens 55 m gemessener Flussbreite.", check: (v) => { const ra = (v.alpha * Math.PI) / 180; const rb = (v.beta * Math.PI) / 180; return (60 * Math.sin(ra) * Math.sin(rb)) / Math.sin(ra + rb) >= 55; } },
  ],
};
