import { fmt } from "../exercises/format";
import type { LabDefinition, LabParam } from "../model/types";
import {
  hyperbolaDomainGap,
  hyperbolaEval,
  hyperbolaYIntercept,
  hyperbolaZero,
  intersectLines,
  lineThroughPoints,
  lineZero,
  solveLinearInequality,
  type InequalityOp,
} from "./math";

export const range = (
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

export const choice = (
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

export const stateParam = (
  key: string,
  value: number,
  resetOnChange = true,
): LabParam => ({
  type: "state",
  key,
  value,
  resetOnChange,
});

// ─── Etappe 1: Funktion und Term ────────────────────────────────────────────

export const labFuncRepresentations: LabDefinition = {
  kind: "func-representations",
  title: "Labor: Tabelle, Term und Graph verbinden",
  intro:
    "Stelle Grundgebühr, Preis pro Einheit und Menge x ein und beobachte, wie Wertetabelle, Term K(x) und Graph zusammenwirken.",
  params: [
    range("base", "Grundgebühr", 0, 20, 6, 2, "€"),
    range("rate", "Preis pro Einheit", 0, 1.5, 0.5, 0.5, "€", 1),
    range("x", "Menge x", 0, 40, 10, 5),
  ],
  readouts: [
    { key: "term", label: "Term K(x)", compute: (v) => `${fmt(v.base, 0)} + ${fmt(v.rate, 1)}·x` },
    { key: "y", label: "K(x) aktuell", emphasis: true, unit: "€", digits: 1, compute: (v) => v.base + v.rate * v.x },
  ],
  goals: [
    { id: "zwanzig", text: "Stelle Grundgebühr 10 €, Preis 0,5 € und x = 20 so ein, dass K(20) = 20 € ist.", check: (v) => v.base === 10 && v.rate === 0.5 && v.x === 20 },
    { id: "konstant", text: "Wähle eine Flatrate (Preis pro Einheit = 0 €) mit 16 € Kosten.", check: (v) => v.rate === 0 && v.base === 16 },
    { id: "hoch", text: "Erreiche bei x = 40 mindestens 45 € Gesamtkosten.", check: (v) => v.x === 40 && v.base + v.rate * v.x >= 45 },
  ],
};

function vltHits(mode: number, x: number): number {
  if (mode < 2) return 1;
  if (mode === 2) {
    const d = 9 - x * x;
    return d > 1e-6 ? 2 : Math.abs(d) <= 1e-6 ? 1 : 0;
  }
  return x > -1 + 1e-6 ? 2 : Math.abs(x + 1) <= 1e-6 ? 1 : 0;
}

export const labVerticalLineTest: LabDefinition = {
  kind: "vertical-line-test",
  title: "Labor: Eindeutigkeit mit dem Senkrechtentest",
  intro:
    "Wähle einen Graphen und verschiebe die senkrechte Prüfgerade x. Bei einer Funktion gibt es zu jedem x höchstens einen y-Wert.",
  params: [
    choice("mode", "Zuordnung", 2, [
      { value: 0, label: "Gerade y = 0,5x + 1" },
      { value: 1, label: "Parabel y = 0,4x² − 1" },
      { value: 2, label: "Kreis x² + y² = 9" },
      { value: 3, label: "Liegender Pfeil ±√(x + 1)" },
    ]),
    range("x", "Prüfstelle x", -4, 4, 1, 0.5, "", 1),
  ],
  readouts: [
    { key: "hits", label: "Schnittpunkte", emphasis: true, digits: 0, compute: (v) => vltHits(v.mode, v.x) },
    { key: "verdict", label: "Einordnung", compute: (v) => (v.mode < 2 ? "Eindeutig → Funktion" : "Nicht eindeutig → keine Funktion") },
  ],
  goals: [
    { id: "funktion", text: "Prüfe eine echte Funktion genau an der Stelle x = 2.", check: (v) => v.mode < 2 && v.x === 2 },
    { id: "kreisleer", text: "Finde beim Kreis eine Stelle x ohne jeden Schnittpunkt.", check: (v) => v.mode === 2 && vltHits(2, v.x) === 0 },
    { id: "scheitel", text: "Finde beim liegenden Pfeil die einzige Stelle x mit genau 1 Schnittpunkt.", check: (v) => v.mode === 3 && vltHits(3, v.x) === 1 },
  ],
};

function domainRangeStats(a: number, minX: number, maxX: number) {
  const hiX = Math.max(minX + 1, maxX);
  const y0 = a * minX * minX;
  const y1 = a * hiX * hiX;
  const crossesZero = minX <= 0 && hiX >= 0;
  return {
    yMin: crossesZero ? 0 : Math.min(y0, y1),
    yMax: Math.max(y0, y1),
  };
}

export const labDomainRangeMapper: LabDefinition = {
  kind: "domain-range-mapper",
  title: "Labor: Definitionsmenge D und Wertemenge W",
  intro:
    "Schränke das Intervall D = [min; max] ein und beobachte, wie sich die Wertemenge W auf der y-Achse verändert.",
  params: [
    range("a", "Faktor a", 0.5, 1, 1, 0.5, "", 1),
    range("minX", "Linke Grenze", -4, 2, -2, 1),
    range("maxX", "Rechte Grenze", -1, 4, 2, 1),
  ],
  readouts: [
    { key: "ymin", label: "Kleinster Wert", digits: 1, compute: (v) => domainRangeStats(v.a, v.minX, v.maxX).yMin },
    { key: "ymax", label: "Größter Wert", emphasis: true, digits: 1, compute: (v) => domainRangeStats(v.a, v.minX, v.maxX).yMax },
  ],
  goals: [
    {
      id: "positiv",
      text: "Wähle a = 1 und D = [1; 3], sodass die kleinste Zahl in W gleich 1 ist.",
      check: (v) => v.a === 1 && v.minX === 1 && v.maxX === 3,
    },
    {
      id: "sechzehn",
      text: "Erreiche bei a = 1 exakt W = [0; 16].",
      check: (v) => {
        const s = domainRangeStats(v.a, v.minX, v.maxX);
        return v.a === 1 && s.yMin === 0 && s.yMax === 16;
      },
    },
    {
      id: "halb",
      text: "Stelle a = 0,5 auf ganz D = [−4; 4] ein (W = [0; 8]).",
      check: (v) => v.a === 0.5 && v.minX === -4 && v.maxX === 4,
    },
  ],
};

export const labPointProbeAxes: LabDefinition = {
  kind: "point-probe-axes",
  title: "Labor: Punktprobe und Achsenschnittpunkte",
  intro:
    "Ziehe den Testpunkt P(x | y) im Koordinatensystem und verändere den Graphen f(x) = m·x + t.",
  params: [
    range("m", "Steigung m", 1, 2, 2, 0.5, "", 1),
    range("t", "y-Achsenabschnitt t", -4, 3, -2, 1),
    range("px", "Punkt x", -4, 4, 0, 1),
    range("py", "Punkt y", -4, 4, 3, 1),
  ],
  readouts: [
    { key: "fx", label: "f(x) am Ort von P", digits: 1, compute: (v) => v.m * v.px + v.t },
    { key: "pos", label: "Lage von P", emphasis: true, compute: (v) => { const d = v.py - (v.m * v.px + v.t); return Math.abs(d) < 1e-6 ? "auf dem Graphen" : d > 0 ? "oberhalb" : "unterhalb"; } },
  ],
  goals: [
    { id: "auf", text: "Ziehe P mit x ≠ 0 genau auf den Graphen.", check: (v) => v.px !== 0 && Math.abs(v.py - (v.m * v.px + v.t)) < 1e-6 },
    { id: "ursprung", text: "Lege die Gerade durch den Ursprung (t = 0) und platziere P bei (2 | 4) auf ihr.", check: (v) => v.t === 0 && v.m === 2 && v.px === 2 && v.py === 4 },
    { id: "nullstelle", text: "Setze P genau auf eine Nullstelle bei x = 3 (y = 0 und f(3) = 0).", check: (v) => v.px === 3 && v.py === 0 && Math.abs(v.m * 3 + v.t) < 1e-6 },
  ],
};

function valueDelta(mode: number, x1: number, dx: number): number {
  const f = (x: number) => (mode === 0 ? 1.5 * x - 1 : mode === 1 ? -x + 4 : 0.4 * x * x);
  return f(x1 + dx) - f(x1);
}

export const labValueChangeExplorer: LabDefinition = {
  kind: "value-change-explorer",
  title: "Labor: Wie ändert sich der Funktionswert?",
  intro:
    "Vergleiche das Wachstum von f(x), wenn x um den Schritt Δx größer wird.",
  params: [
    choice("mode", "Funktion", 0, [
      { value: 0, label: "f(x) = 1,5x − 1 (wachsend)" },
      { value: 1, label: "f(x) = −x + 4 (fallend)" },
      { value: 2, label: "f(x) = 0,4x² (gekrümmt)" },
    ]),
    range("x1", "Startwert x₁", -2, 3, 0, 1),
    range("dx", "Schrittweite Δx", 1, 4, 2, 1),
  ],
  readouts: [
    { key: "dy", label: "Änderung Δy", emphasis: true, digits: 1, compute: (v) => valueDelta(v.mode, v.x1, v.dx) },
  ],
  goals: [
    { id: "abnahme", text: "Zeige bei der fallenden Geraden genau eine Abnahme Δy = −4.", check: (v) => v.mode === 1 && Math.abs(valueDelta(1, v.x1, v.dx) + 4) < 1e-6 },
    { id: "parabel", text: "Untersuche bei 0,4x² den Schritt von x₁ = 1 um Δx = 2.", check: (v) => v.mode === 2 && v.x1 === 1 && v.dx === 2 },
    { id: "gleich", text: "Finde bei 0,4x² zwei verschiedene x-Werte (Δx > 0) mit Δy = 0.", check: (v) => v.mode === 2 && v.dx > 0 && Math.abs(valueDelta(2, v.x1, v.dx)) < 1e-6 },
  ],
};

// ─── Etappe 2: Lineare Funktionen ───────────────────────────────────────────

export const labLineMT: LabDefinition = {
  kind: "line-m-t",
  title: "Labor: Steigung m und y-Achsenabschnitt t",
  intro:
    "Ziehe am Punkt auf der y-Achse (t) oder am Steigungspunkt rechts (m) und beobachte die Funktionsgleichung y = m·x + t.",
  params: [
    range("m", "Steigung m", -2.5, 2.5, 1, 0.5, "", 1),
    range("t", "Abschnitt t", -4, 4, 0, 0.5, "", 1),
  ],
  readouts: [
    { key: "sy", label: "Schnitt y-Achse", compute: (v) => `(0 | ${fmt(v.t, 1)})` },
    { key: "x0", label: "Nullstelle", emphasis: true, compute: (v) => { const z = lineZero(v.m, v.t); return z === null ? "keine" : fmt(z, 2); } },
  ],
  goals: [
    { id: "steil", text: "Stelle m = 2 und t = −2 ein.", check: (v) => v.m === 2 && v.t === -2 },
    { id: "waagrecht", text: "Erzeuge eine waagrechte Gerade in Höhe y = 3.", check: (v) => v.m === 0 && v.t === 3 },
    { id: "fallend", text: "Stelle m = −1,5 und t = 2 ein.", check: (v) => v.m === -1.5 && v.t === 2 },
  ],
};

export const labLineReadGraph: LabDefinition = {
  kind: "line-read-graph",
  title: "Labor: Steigungsdreieck und Gleichung ablesen",
  intro:
    "Verändere das Steigungsdreieck Δx und erkenne, dass der Quotient Δy / Δx immer dieselbe Steigung m liefert.",
  params: [
    range("m", "Steigung m", -1.5, 2, 1, 0.5, "", 1),
    range("t", "Abschnitt t", -3, 4, 1, 1),
    range("dx", "Breite Δx", 1, 4, 2, 1),
  ],
  readouts: [
    { key: "dy", label: "Höhendifferenz Δy", digits: 1, compute: (v) => v.m * v.dx },
    { key: "ratio", label: "Δy / Δx", emphasis: true, digits: 1, compute: (v) => v.m },
  ],
  goals: [
    { id: "flach", text: "Stelle genau die Gerade y = −0,5x + 3 ein.", check: (v) => v.m === -0.5 && v.t === 3 },
    { id: "grosses", text: "Zeichne bei m = 1,5 ein Steigungsdreieck mit Δx = 4 (Δy = 6).", check: (v) => v.m === 1.5 && v.dx === 4 },
    { id: "tief", text: "Wähle t = −2, m = 2 und Δx = 3.", check: (v) => v.t === -2 && v.m === 2 && v.dx === 3 },
  ],
};

export const labLineTwoPoints: LabDefinition = {
  kind: "line-two-points",
  title: "Labor: Geradengleichung aus zwei Punkten",
  intro:
    "Ziehe P und Q im Koordinatensystem. Der Rechner bestimmt daraus Steigung m = (y₂ − y₁)/(x₂ − x₁) und t.",
  params: [
    range("px", "P: x₁", -4, 4, 0, 1),
    range("py", "P: y₁", -4, 4, 1, 1),
    range("qx", "Q: x₂", -4, 4, 2, 1),
    range("qy", "Q: y₂", -4, 4, 3, 1),
  ],
  readouts: [
    { key: "m", label: "Steigung m", emphasis: true, compute: (v) => { const r = lineThroughPoints({ x: v.px, y: v.py }, { x: v.qx, y: v.qy }); return r ? fmt(r.m, 2) : "nicht def."; } },
    { key: "t", label: "Abschnitt t", compute: (v) => { const r = lineThroughPoints({ x: v.px, y: v.py }, { x: v.qx, y: v.qy }); return r ? fmt(r.t, 2) : "nicht def."; } },
  ],
  goals: [
    {
      id: "ursprung2",
      text: "Lege P und Q so, dass die Ursprungsgerade y = 2x entsteht (x₁ ≠ x₂).",
      check: (v) => {
        const r = lineThroughPoints({ x: v.px, y: v.py }, { x: v.qx, y: v.qy });
        return r !== null && Math.abs(r.m - 2) < 1e-6 && Math.abs(r.t) < 1e-6;
      },
    },
    {
      id: "fallend2",
      text: "Erzeuge die fallende Gerade y = −x + 2.",
      check: (v) => {
        const r = lineThroughPoints({ x: v.px, y: v.py }, { x: v.qx, y: v.qy });
        return r !== null && Math.abs(r.m + 1) < 1e-6 && Math.abs(r.t - 2) < 1e-6;
      },
    },
    {
      id: "senkrecht",
      text: "Lege P und Q senkrecht übereinander (x₁ = x₂, y₁ ≠ y₂).",
      check: (v) => v.px === v.qx && v.py !== v.qy,
    },
  ],
};

export const labLineZeroPoint: LabDefinition = {
  kind: "line-zero-point",
  title: "Labor: Nullstellen linearer Funktionen",
  intro:
    "Untersuche, wo der Graph f(x) = m·x + t die x-Achse schneidet: x₀ = −t / m.",
  params: [
    range("m", "Steigung m", -2, 2, 1, 0.5, "", 1),
    range("t", "Abschnitt t", -6, 6, -2, 1),
  ],
  readouts: [
    { key: "x0", label: "Nullstelle x₀", emphasis: true, compute: (v) => { const z = lineZero(v.m, v.t); return z === null ? "keine (m = 0)" : fmt(z, 2); } },
  ],
  goals: [
    { id: "drei", text: "Stelle bei t ≠ 0 eine Nullstelle genau bei x₀ = 3 ein.", check: (v) => { const z = lineZero(v.m, v.t); return v.t !== 0 && z !== null && Math.abs(z - 3) < 1e-6; } },
    { id: "negativ", text: "Erzeuge mit fallender Gerade (m < 0) die Nullstelle x₀ = −2.", check: (v) => { const z = lineZero(v.m, v.t); return v.m < 0 && z !== null && Math.abs(z + 2) < 1e-6; } },
    { id: "keine", text: "Stelle eine Gerade ohne jede Nullstelle ein.", check: (v) => v.m === 0 && v.t !== 0 },
  ],
};

export const labLineIntersection: LabDefinition = {
  kind: "line-intersection",
  title: "Labor: Schnittpunkt zweier Geraden",
  intro:
    "Ziehe an den Schnittpunkten t₁ und t₂ auf der y-Achse oder ändere die Steigungen, um Schnitt, Parallelität oder Identität zu erkunden.",
  params: [
    range("m1", "Gerade g: m₁", -2, 2, 1, 0.5, "", 1),
    range("t1", "Gerade g: t₁", -4, 4, 0, 1),
    range("m2", "Gerade h: m₂", -2, 2, 1, 0.5, "", 1),
    range("t2", "Gerade h: t₂", -4, 4, 2, 1),
  ],
  readouts: [
    {
      key: "state",
      label: "Schnittpunkt S",
      emphasis: true,
      compute: (v) => {
        const r = intersectLines(v.m1, v.t1, v.m2, v.t2);
        return r.kind === "one" ? `(${fmt(r.point.x, 2)} | ${fmt(r.point.y, 2)})` : r.kind === "parallel" ? "keiner (echt parallel)" : "identisch (∞ viele)";
      },
    },
  ],
  goals: [
    {
      id: "s23",
      text: "Bringe beide Geraden zum Schnitt im Punkt S(2 | 3).",
      check: (v) => {
        const r = intersectLines(v.m1, v.t1, v.m2, v.t2);
        return r.kind === "one" && Math.abs(r.point.x - 2) < 1e-6 && Math.abs(r.point.y - 3) < 1e-6;
      },
    },
    {
      id: "xachse",
      text: "Lass g und h sich genau auf der x-Achse (y = 0) schneiden.",
      check: (v) => {
        const r = intersectLines(v.m1, v.t1, v.m2, v.t2);
        return r.kind === "one" && Math.abs(r.point.y) < 1e-6;
      },
    },
    {
      id: "ident",
      text: "Bringe beide Geraden zur vollständigen Deckung (mit t₁ ≠ 0).",
      check: (v) => v.m1 === v.m2 && v.t1 === v.t2 && v.t1 !== 0,
    },
  ],
};

export const labLinearTariffs: LabDefinition = {
  kind: "linear-tariffs",
  title: "Labor: Tarife im Sachzusammenhang",
  intro:
    "Vergleiche zwei Mobilfunk- oder Stromtarife mit Grundgebühr und Arbeitspreis pro Einheit.",
  params: [
    range("baseA", "Tarif A: Grundgebühr", 0, 30, 10, 5, "€"),
    range("rateA", "Tarif A: pro Einheit", 0.25, 1, 0.5, 0.25, "€", 2),
    range("baseB", "Tarif B: Grundgebühr", 0, 30, 10, 5, "€"),
    range("rateB", "Tarif B: pro Einheit", 0.25, 1, 0.5, 0.25, "€", 2),
  ],
  readouts: [
    {
      key: "eq",
      label: "Gleichstand",
      emphasis: true,
      compute: (v) => {
        const r = intersectLines(v.rateA, v.baseA, v.rateB, v.baseB);
        return r.kind === "one" && r.point.x >= 0 ? `x = ${fmt(r.point.x, 1)} (${fmt(r.point.y, 1)} €)` : r.kind === "identical" ? "immer gleich" : "kein Gleichstand (x ≥ 0)";
      },
    },
  ],
  goals: [
    {
      id: "gleich40",
      text: "Stelle zwei verschiedene Tarife ein, die bei exakt x = 40 Einheiten gleich teuer sind.",
      check: (v) => {
        const r = intersectLines(v.rateA, v.baseA, v.rateB, v.baseB);
        return r.kind === "one" && Math.abs(r.point.x - 40) < 1e-6;
      },
    },
    {
      id: "immerA",
      text: "Wähle gleiche Arbeitspreise so, dass Tarif A immer günstiger als Tarif B ist.",
      check: (v) => v.rateA === v.rateB && v.baseA < v.baseB,
    },
    {
      id: "x20y25",
      text: "Erreiche Gleichstand genau bei x = 20 Einheiten und 25 € Gesamtkosten.",
      check: (v) => {
        const r = intersectLines(v.rateA, v.baseA, v.rateB, v.baseB);
        return r.kind === "one" && Math.abs(r.point.x - 20) < 1e-6 && Math.abs(r.point.y - 25) < 1e-6;
      },
    },
  ],
};

const INEQ_OPS: InequalityOp[] = ["<", "<=", ">", ">="];

export const labLinearInequality: LabDefinition = {
  kind: "linear-inequality",
  title: "Labor: Lineare Ungleichungen & Intervalle",
  intro:
    "Vergleiche a·x + b mit der Schranke c. Achte auf das Umdrehen des Ungleichungszeichens bei negativem Faktor a < 0!",
  params: [
    range("a", "Faktor a", -2, 2, 1, 1),
    range("b", "Summand b", -4, 4, 0, 2),
    choice("op", "Zeichen", 0, [
      { value: 0, label: "< (kleiner)" },
      { value: 1, label: "≤ (kleiner gleich)" },
      { value: 2, label: "> (größer)" },
      { value: 3, label: "≥ (größer gleich)" },
    ]),
    range("c", "Schranke c", -4, 10, 2, 2),
  ],
  readouts: [
    { key: "interval", label: "Lösungsmenge L", emphasis: true, compute: (v) => solveLinearInequality(v.a, v.b, INEQ_OPS[v.op] ?? "<", 0, v.c).interval },
  ],
  goals: [
    {
      id: "invers",
      text: "Stelle bei negativem a = −2 die Lösungsmenge ]−3; ∞[ her.",
      check: (v) => v.a === -2 && solveLinearInequality(v.a, v.b, INEQ_OPS[v.op] ?? "<", 0, v.c).interval === "]−3; ∞[",
    },
    {
      id: "geschlossen",
      text: "Erzeuge ein nach rechts offenes abgeschlossenes Intervall [2; ∞[.",
      check: (v) => solveLinearInequality(v.a, v.b, INEQ_OPS[v.op] ?? "<", 0, v.c).interval === "[2; ∞[",
    },
    {
      id: "leer",
      text: "Finde eine Einstellung mit leerer Lösungsmenge ∅.",
      check: (v) => solveLinearInequality(v.a, v.b, INEQ_OPS[v.op] ?? "<", 0, v.c).kind === "none",
    },
  ],
};

export const labDirectProportion: LabDefinition = {
  kind: "direct-proportion",
  title: "Labor: Direkte Proportionalität",
  intro:
    "Prüfe, wann y = a·x + t direkt proportional ist: Der Quotient y / x bleibt nur bei Ursprungsgeraden (t = 0) konstant.",
  params: [
    range("a", "Faktor a", 1, 3, 2, 0.5, "", 1),
    range("t", "Verschiebung t", 0, 3, 2, 1),
    range("x", "Stelle x", 1, 6, 2, 1),
  ],
  readouts: [
    { key: "y", label: "Wert y", digits: 1, compute: (v) => v.a * v.x + v.t },
    { key: "q", label: "Quotient y / x", emphasis: true, digits: 2, compute: (v) => (v.a * v.x + v.t) / v.x },
  ],
  goals: [
    { id: "prop25", text: "Stelle direkte Proportionalität mit Faktor a = 2,5 und x = 4 (y = 10) ein.", check: (v) => v.t === 0 && v.a === 2.5 && v.x === 4 },
    { id: "prop15", text: "Zeige bei direkter Proportionalität das Paar (6 | 9).", check: (v) => v.t === 0 && v.a === 1.5 && v.x === 6 },
    { id: "prop3", text: "Erzeuge eine Ursprungsgerade mit konstantem Quotienten y / x = 3.", check: (v) => v.t === 0 && v.a === 3 },
  ],
};

// ─── Etappe 3: Elementare gebrochen-rationale Funktionen ─────────────────────

export const labHyperbolaDomain: LabDefinition = {
  kind: "hyperbola-domain",
  title: "Labor: Definitionsmenge und Polstelle",
  intro:
    "Bewege die Stelle x auf die Definitionslücke zu und beobachte den Nenner x + b.",
  params: [
    range("a", "Zähler a", 2, 6, 4, 2),
    range("b", "Verschiebung b", -3, 3, 1, 1),
    range("x", "Stelle x", -5, 5, 1, 1),
  ],
  readouts: [
    { key: "gap", label: "Definitionslücke", compute: (v) => `x = ${fmt(hyperbolaDomainGap(v.b), 0)}` },
    {
      key: "fx",
      label: "Funktionswert f(x)",
      emphasis: true,
      compute: (v) => {
        const y = hyperbolaEval(v.x, v.a, v.b, 0);
        return Number.isFinite(y) ? fmt(y, 2) : "nicht definiert (Nenner 0)";
      },
    },
  ],
  goals: [
    { id: "luecke2", text: "Lege die Definitionslücke auf x = 2 und berechne f(4).", check: (v) => v.b === -2 && v.x === 4 },
    { id: "treffer", text: "Führe x genau auf die Definitionslücke (−b).", check: (v) => v.x === -v.b },
    { id: "drei", text: "Stelle b = −3 und a = 6 ein und ermittle f(5) = 3.", check: (v) => v.b === -3 && v.a === 6 && v.x === 5 },
  ],
};

export const labHyperbolaShift: LabDefinition = {
  kind: "hyperbola-shift",
  title: "Labor: Asymptoten und Parameter b, c",
  intro:
    "Ziehe am Asymptotenkreuz und erkenne, wie b nach links/rechts und c nach oben/unten verschiebt.",
  params: [
    range("a", "Zähler a", -4, 4, 2, 2),
    range("b", "Parameter b", -3, 3, 0, 1),
    range("c", "Parameter c", -3, 3, 0, 1),
  ],
  readouts: [
    { key: "va", label: "senkr. Asymptote", compute: (v) => `x = ${fmt(hyperbolaDomainGap(v.b), 0)}` },
    { key: "ha", label: "waagr. Asymptote", emphasis: true, compute: (v) => `y = ${fmt(v.c, 0)}` },
  ],
  goals: [
    { id: "rechtsHoch", text: "Verschiebe auf die Asymptoten x = 2 und y = 1.", check: (v) => v.b === -2 && v.c === 1 },
    { id: "linksTief", text: "Lege das Asymptotenkreuz nach (−3 | −2).", check: (v) => v.b === 3 && v.c === -2 },
    { id: "gespiegelt", text: "Stelle a < 0 sowie die Asymptoten x = 1 und y = 2 ein.", check: (v) => v.a < 0 && v.b === -1 && v.c === 2 },
  ],
};

export const labHyperbolaAxes: LabDefinition = {
  kind: "hyperbola-axes",
  title: "Labor: Achsenschnittpunkte der Hyperbel",
  intro:
    "Untersuche, wann eine Hyperbel f(x) = a/(x + b) + c eine Nullstelle oder einen y-Achsenschnittpunkt besitzt.",
  params: [
    range("a", "Zähler a", 2, 6, 4, 2),
    range("b", "Parameter b", -2, 2, 0, 1),
    range("c", "Parameter c", -2, 2, 0, 1),
  ],
  readouts: [
    {
      key: "sy",
      label: "y-Achse Sy",
      compute: (v) => {
        const y = hyperbolaYIntercept(v.a, v.b, v.c);
        return y === null ? "keiner (x = 0 Lücke)" : `(0 | ${fmt(y, 2)})`;
      },
    },
    {
      key: "x0",
      label: "Nullstelle N",
      emphasis: true,
      compute: (v) => {
        const x = hyperbolaZero(v.a, v.b, v.c);
        return x === null ? "keine (c = 0)" : `(${fmt(x, 2)} | 0)`;
      },
    },
  ],
  goals: [
    {
      id: "beide",
      text: "Erzeuge Sy(0 | 2) und die Nullstelle N(4 | 0).",
      check: (v) => hyperbolaYIntercept(v.a, v.b, v.c) === 2 && hyperbolaZero(v.a, v.b, v.c) === 4,
    },
    {
      id: "ursprung3",
      text: "Lass die Hyperbel genau durch den Ursprung (0 | 0) verlaufen.",
      check: (v) => hyperbolaYIntercept(v.a, v.b, v.c) === 0,
    },
    {
      id: "ohneN",
      text: "Stelle Sy(0 | 3) ohne jede Nullstelle ein.",
      check: (v) => hyperbolaYIntercept(v.a, v.b, v.c) === 3 && hyperbolaZero(v.a, v.b, v.c) === null,
    },
  ],
};

export const labHyperbolaFit: LabDefinition = {
  kind: "hyperbola-fit",
  title: "Labor: Term aus dem Graphen ablesen",
  intro:
    "Bringe deine Hyperbel genau zur Deckung mit der gestrichelten Zielkurve, indem du zuerst die Asymptoten und dann a über P(4 | 3) einstellst.",
  params: [
    range("a", "Zähler a", -4, 6, 2, 2),
    range("b", "Parameter b", -3, 2, 0, 1),
    range("c", "Parameter c", -2, 3, 0, 1),
  ],
  readouts: [
    { key: "p4", label: "f(4)", emphasis: true, compute: (v) => { const y = hyperbolaEval(4, v.a, v.b, v.c); return Number.isFinite(y) ? fmt(y, 2) : "nicht def."; } },
  ],
  goals: [
    { id: "asympt", text: "Lege die Asymptoten richtig auf x = 2 und y = 1.", check: (v) => v.b === -2 && v.c === 1 },
    { id: "deckung", text: "Bringe deine Hyperbel vollständig zur Deckung mit der Zielkurve.", check: (v) => v.a === 4 && v.b === -2 && v.c === 1 },
    { id: "gegen", text: "Spiegle die gefundene Hyperbel mit a = −4 an ihrer waagrechten Asymptote.", check: (v) => v.a === -4 && v.b === -2 && v.c === 1 },
  ],
};

export const labInverseProportion: LabDefinition = {
  kind: "inverse-proportion",
  title: "Labor: Indirekte Proportionalität",
  intro:
    "Ziehe den Punkt entlang der Hyperbel y = a / x. Die Fläche des Rechtecks x · y bleibt stets gleich groß.",
  params: [
    range("k", "Produkt a = x·y", 12, 24, 12, 4),
    range("x", "Größe x", 1.5, 8, 2, 0.5, "", 1),
  ],
  readouts: [
    { key: "y", label: "Größe y = a/x", digits: 2, compute: (v) => v.k / v.x },
    { key: "prod", label: "Produkt x · y", emphasis: true, digits: 0, compute: (v) => v.k },
  ],
  goals: [
    { id: "halb12", text: "Verdopple x bei a = 12 von 2 auf 4 (y halbiert sich auf 3).", check: (v) => v.k === 12 && v.x === 4 },
    { id: "a24", text: "Wähle Produkt a = 24 und x = 6 (y = 4).", check: (v) => v.k === 24 && v.x === 6 },
    { id: "quad", text: "Finde bei a = 16 den Punkt mit gleichen Koordinaten x = y.", check: (v) => v.k === 16 && v.x === 4 },
  ],
};
