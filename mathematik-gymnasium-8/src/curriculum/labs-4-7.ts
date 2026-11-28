import { fmt } from "../exercises/format";
import type { LabDefinition } from "../model/types";
import { choice, range, stateParam } from "./labs-1-3";
import {
  annulusArea,
  circleArea,
  circleCircumference,
  countingTotal,
  cylinderLateral,
  cylinderSurface,
  cylinderVolume,
  intPower,
  intersectLines,
  prismSurface,
  prismVolume,
  regularPolygonArea,
  sectorArc,
  sectorArea,
  seededSampleSim,
  solve2x2,
  solveSimpleFracEq,
} from "./math";
import { sampleEventNumbers } from "../lab/views-laplace";

// ─── Etappe 4: Bruchterme und Bruchgleichungen ───────────────────────────────

export const labRationalSimplify: LabDefinition = {
  kind: "rational-simplify",
  title: "Labor: Faktorisieren und Kürzen",
  intro:
    "Verändere k, a und die Teststelle x. Achte darauf, dass man die Definitionsmenge immer VOR dem Kürzen festlegt!",
  params: [
    range("k", "Faktor k", 2, 5, 2, 1),
    range("a", "Parameter a", 1, 4, 2, 1),
    range("x", "Stelle x", 1, 6, 3, 1),
  ],
  readouts: [
    { key: "dom", label: "Definitionsmenge", compute: (v) => `ℚ \\ {−${fmt(v.a, 0)}; ${fmt(v.a, 0)}}` },
    {
      key: "val",
      label: "Termwert",
      emphasis: true,
      compute: (v) => (Math.abs(v.x) === v.a ? "Lücke (nicht def.)" : fmt(v.k / (v.x - v.a), 2)),
    },
  ],
  goals: [
    { id: "luecke", text: "Bringe die Teststelle x genau auf die positive Definitionslücke x = a.", check: (v) => v.x === v.a },
    { id: "vierdrei", text: "Stelle k = 4 und a = 3 ein (mit x ∈ D).", check: (v) => v.k === 4 && v.a === 3 && Math.abs(v.x) !== 3 },
    { id: "wert25", text: "Erreiche bei x ∈ D genau den gekürzten Termwert 2,5.", check: (v) => Math.abs(v.x) !== v.a && Math.abs(v.k / (v.x - v.a) - 2.5) < 1e-6 },
  ],
};

export const labRationalAddSub: LabDefinition = {
  kind: "rational-add-sub",
  title: "Labor: Hauptnenner beim Addieren und Subtrahieren",
  intro:
    "Schalte zwischen Addition und Subtraktion um und beobachte, wie sich Zählerterme auf dem Hauptnenner (x − a)(x + a) verbinden.",
  params: [
    range("c1", "Zähler links c₁", 1, 4, 1, 1),
    choice("op", "Rechenart", 0, [
      { value: 0, label: "+ (Addition)" },
      { value: 1, label: "− (Subtraktion)" },
    ]),
    range("c2", "Zähler rechts c₂", 1, 4, 1, 1),
    range("a", "Parameter a", 1, 3, 1, 1),
    range("x", "Testwert x", 4, 6, 4, 1),
  ],
  readouts: [
    {
      key: "val",
      label: "Wert bei x",
      emphasis: true,
      digits: 3,
      compute: (v) => v.c1 / (v.x - v.a) + (v.op === 0 ? 1 : -1) * (v.c2 / (v.x + v.a)),
    },
  ],
  goals: [
    { id: "wegX", text: "Subtrahiere mit c₁ = c₂, sodass im neuen Zähler das x verschwindet.", check: (v) => v.op === 1 && v.c1 === v.c2 },
    { id: "fuenfx", text: "Erzeuge beim Addieren den Zähler 5x + 2 (c₁ = 3, c₂ = 2, a = 2).", check: (v) => v.op === 0 && v.c1 === 3 && v.c2 === 2 && v.a === 2 },
    { id: "sub31", text: "Berechne bei Subtraktion mit c₁ = 3, c₂ = 1 und a = 2.", check: (v) => v.op === 1 && v.c1 === 3 && v.c2 === 1 && v.a === 2 },
  ],
};

export const labRationalMulDiv: LabDefinition = {
  kind: "rational-mul-div",
  title: "Labor: Multiplizieren und Dividieren",
  intro:
    "Vergleiche Produkt und Quotient: Beim Dividieren nimmt man den Kehrwert — dann lassen sich Faktoren NICHT wegkürzen, sondern quadrieren sich!",
  params: [
    choice("mode", "Operation", 0, [
      { value: 0, label: "· (Multiplizieren)" },
      { value: 1, label: ": (Dividieren)" },
    ]),
    range("p", "Faktor p", 2, 6, 2, 1),
    range("q", "Nenner q", 2, 6, 3, 1),
    range("x", "Testwert x", 1, 4, 2, 1),
  ],
  readouts: [
    {
      key: "val",
      label: "Termwert",
      emphasis: true,
      digits: 3,
      compute: (v) => (v.mode === 0 ? (v.p * v.x) / v.q : (v.p * v.q * v.x) / ((v.x + 1) * (v.x + 1))),
    },
  ],
  goals: [
    { id: "div24", text: "Schalte auf Dividieren mit p = 4, q = 2 und x = 1 (Wert = 2).", check: (v) => v.mode === 1 && v.p === 4 && v.q === 2 && v.x === 1 },
    { id: "mul3x", text: "Kürze beim Multiplizieren mit p = 6, q = 2 zum Ergebnis 3x.", check: (v) => v.mode === 0 && v.p === 6 && v.q === 2 },
    { id: "divGleich", text: "Wähle beim Dividieren p = 3, q = 3 und x = 2.", check: (v) => v.mode === 1 && v.p === 3 && v.q === 3 && v.x === 2 },
  ],
};

export const labIntPowersLab: LabDefinition = {
  kind: "int-powers-lab",
  title: "Labor: Potenzen mit ganzzahligen Exponenten",
  intro:
    "Kombiniere positive und negative Exponenten bei gleicher Basis a und prüfe das Ergebnis von Multiplikation und Division.",
  params: [
    range("base", "Basis a", 2, 5, 2, 1),
    range("m", "Exponent m", -3, 3, 1, 1),
    range("n", "Exponent n", -3, 3, 2, 1),
  ],
  readouts: [
    { key: "prodExp", label: "Exponent m + n", digits: 0, compute: (v) => v.m + v.n },
    { key: "prodVal", label: "a^(m+n)", emphasis: true, digits: 4, compute: (v) => intPower(v.base, v.m + v.n) },
  ],
  goals: [
    { id: "neg4", text: "Erzeuge mit zwei negativen Exponenten das Produkt 2⁻⁴ = 0,0625.", check: (v) => v.base === 2 && v.m < 0 && v.n < 0 && v.m + v.n === -4 },
    { id: "hochNull", text: "Kombiniere m ≠ 0 und n so, dass a^(m+n) = a⁰ = 1 entsteht.", check: (v) => v.m !== 0 && v.m + v.n === 0 },
    { id: "neuntel", text: "Stelle bei Basis 3 die Division 3^(m−n) = 3⁻² = 1/9 ein.", check: (v) => v.base === 3 && v.m - v.n === -2 },
  ],
};

export const labFracEqSolver: LabDefinition = {
  kind: "frac-eq-solver",
  title: "Labor: Bruchgleichungen & Scheinlösungen",
  intro:
    "Stelle a/(x + b) = c/(x + d) ein und prüfe am Ende stets, ob die berechnete Zahl wirklich in der Definitionsmenge liegt!",
  params: [
    range("a", "Zähler links a", 2, 6, 2, 1),
    range("b", "Nenner links b", -2, 2, 1, 1),
    range("c", "Zähler rechts c", 2, 6, 4, 1),
    range("d", "Nenner rechts d", -2, 2, -1, 1),
  ],
  readouts: [
    {
      key: "sol",
      label: "Lösungsmenge L",
      emphasis: true,
      compute: (v) => {
        const r = solveSimpleFracEq(v.a, v.b, v.c, v.d);
        return r.kind === "one" ? `{${fmt(r.x, 2)}}` : r.kind === "all" ? "D" : "∅";
      },
    },
  ],
  goals: [
    { id: "schein", text: "Erzeuge durch gleiche Nenner (b = d) und a ≠ c eine Scheinlösung / L = ∅.", check: (v) => v.b === v.d && v.a !== v.c },
    { id: "x5", text: "Stelle die Gleichung so ein, dass L = {5} herauskommt.", check: (v) => { const r = solveSimpleFracEq(v.a, v.b, v.c, v.d); return r.kind === "one" && Math.abs(r.x - 5) < 1e-6; } },
    { id: "ident", text: "Mache die Bruchgleichung für alle Zahlen aus D gültig (L = D).", check: (v) => solveSimpleFracEq(v.a, v.b, v.c, v.d).kind === "all" },
  ],
};

function fracGraphRoots(a: number, b: number, m: number, t: number): number[] {
  const roots: number[] = [];
  if (Math.abs(m) < 1e-9) {
    if (Math.abs(t) > 1e-9) {
      const xr = a / t - b;
      if (Math.abs(xr + b) > 1e-6) roots.push(xr);
    }
  } else {
    const qb = m * b + t;
    const qc = b * t - a;
    const disc = qb * qb - 4 * m * qc;
    if (disc >= -1e-9) {
      const sd = Math.sqrt(Math.max(0, disc));
      const r1 = (-qb - sd) / (2 * m);
      const r2 = (-qb + sd) / (2 * m);
      if (Math.abs(r1 + b) > 1e-6) roots.push(r1);
      if (Math.abs(r2 - r1) > 1e-6 && Math.abs(r2 + b) > 1e-6) roots.push(r2);
    }
  }
  return roots;
}

export const labFracEqGraph: LabDefinition = {
  kind: "frac-eq-graph",
  title: "Labor: Bruchgleichung als Schnittproblem",
  intro:
    "Sieh dir jede Bruchgleichung a/(x + b) = m·x + t als Schnitt zweier Graphen an — genau wie im Koordinatensystem!",
  params: [
    range("a", "Zähler a", 2, 6, 2, 2),
    range("b", "Verschiebung b", -2, 2, 0, 1),
    range("m", "Gerade m", -1, 1, 1, 0.5, "", 1),
    range("t", "Gerade t", -2, 2, 1, 1),
  ],
  readouts: [
    { key: "count", label: "Schnittpunkte", emphasis: true, digits: 0, compute: (v) => fracGraphRoots(v.a, v.b, v.m, v.t).length },
  ],
  goals: [
    { id: "einsdrei", text: "Stelle 4/(x − 1) = x − 1 ein (Schnittpunkte bei x = −1 und x = 3).", check: (v) => v.a === 4 && v.b === -1 && v.m === 1 && v.t === -1 },
    { id: "zweieins", text: "Finde die Schnittpunkte bei x = −2 und x = 2 für 2/x = 0,5x.", check: (v) => v.a === 2 && v.b === 0 && v.m === 0.5 && v.t === 0 },
    { id: "keinschnitt", text: "Wähle eine fallende Gerade (m < 0), die die Hyperbel mit a > 0 nicht schneidet.", check: (v) => fracGraphRoots(v.a, v.b, v.m, v.t).length === 0 },
  ],
};

export const labFormulaRearranger: LabDefinition = {
  kind: "formula-rearranger",
  title: "Labor: Naturwissenschaftliche Formeln umstellen",
  intro:
    "Wähle die gesuchte Größe am Ohmschen Gesetz R = U / I und überprüfe die zugehörigen Zahlenwerte.",
  params: [
    choice("target", "Auflösen nach", 0, [
      { value: 0, label: "R = U / I (Widerstand)" },
      { value: 1, label: "I = U / R (Stromstärke)" },
      { value: 2, label: "U = R · I (Spannung)" },
    ]),
    range("R", "Widerstand R", 2, 12, 4, 2, "Ω"),
    range("I", "Stromstärke I", 1, 4, 2, 1, "A"),
  ],
  readouts: [
    { key: "U", label: "Spannung U", unit: "V", digits: 0, compute: (v) => v.R * v.I },
    { key: "res", label: "Gesuchter Wert", emphasis: true, compute: (v) => (v.target === 0 ? `${fmt(v.R, 0)} Ω` : v.target === 1 ? `${fmt(v.I, 0)} A` : `${fmt(v.R * v.I, 0)} V`) },
  ],
  goals: [
    { id: "strom", text: "Stelle nach I um und berechne I = 3 A bei R = 6 Ω (U = 18 V).", check: (v) => v.target === 1 && v.R === 6 && v.I === 3 },
    { id: "spannung", text: "Stelle nach U um und erhalte U = 40 V.", check: (v) => v.target === 2 && v.R * v.I === 40 },
    { id: "widerstand", text: "Löse nach R auf mit R = 12 Ω und I = 2 A (U = 24 V).", check: (v) => v.target === 0 && v.R === 12 && v.I === 2 },
  ],
};

// ─── Etappe 5: Laplace-Experimente ──────────────────────────────────────────

export const labSampleSpaceSet: LabDefinition = {
  kind: "sample-space-set",
  title: "Labor: Ergebnismenge, Ereignis und Gegenereignis",
  intro:
    "Wähle einen Würfel und ein Ereignis E. Beobachte, wie sich Ω in E und Ē aufteilt.",
  params: [
    choice("die", "Zufallsgerät", 0, [
      { value: 0, label: "6-seitiger Würfel" },
      { value: 1, label: "8-seitiger Würfel" },
    ]),
    choice("rule", "Ereignis E", 0, [
      { value: 0, label: "gerade Augenzahl" },
      { value: 1, label: "Augenzahl größer als 4" },
      { value: 2, label: "durch 3 teilbar" },
    ]),
  ],
  readouts: [
    { key: "eCount", label: "|E| (günstig)", emphasis: true, digits: 0, compute: (v) => sampleEventNumbers(v.die, v.rule).event.length },
    { key: "cCount", label: "|Ē| (Gegenereignis)", digits: 0, compute: (v) => sampleEventNumbers(v.die, v.rule).comp.length },
  ],
  goals: [
    { id: "gt4w6", text: "Stelle beim 6er-Würfel „größer als 4“ ein (|E| = 2, |Ē| = 4).", check: (v) => v.die === 0 && v.rule === 1 },
    { id: "div3w8", text: "Prüfe beim 8er-Würfel „durch 3 teilbar“ (|E| = 2, |Ē| = 6).", check: (v) => v.die === 1 && v.rule === 2 },
    { id: "gt4w8", text: "Finde beim 8er-Würfel ein Ereignis mit genau 4 günstigen Ergebnissen.", check: (v) => v.die === 1 && sampleEventNumbers(1, v.rule).event.length === 4 && v.rule === 1 },
  ],
};

export const labLawLargeNumbers: LabDefinition = {
  kind: "law-large-numbers",
  title: "Labor: Gesetz der großen Zahlen",
  intro:
    "Simuliere immer größere Versuchsreihen (mit Schieber oder Tasten) und beobachte, wie sich die relative Häufigkeit h_n nahe der theoretischen Wahrscheinlichkeit p einpendelt.",
  params: [
    range("n", "Versuche n", 10, 500, 20, 10),
    range("p", "Wahrscheinlichkeit p", 0.2, 0.8, 0.5, 0.1, "", 1),
    stateParam("seed", 1, false),
  ],
  actions: [
    { id: "add20", label: "+20 Versuche", apply: (v) => ({ ...v, n: Math.min(500, v.n + 20) }) },
    { id: "add100", label: "+100 Versuche", apply: (v) => ({ ...v, n: Math.min(500, v.n + 100) }) },
    { id: "reroll", label: "Neue Serie", apply: (v) => ({ ...v, seed: (v.seed % 5) + 1 }) },
  ],
  readouts: [
    { key: "hits", label: "Treffer k", digits: 0, compute: (v) => seededSampleSim(v.n, v.p, v.seed).hits },
    { key: "freq", label: "Relative Häufigkeit h_n", emphasis: true, digits: 3, compute: (v) => seededSampleSim(v.n, v.p, v.seed).freq },
  ],
  goals: [
    { id: "n200", text: "Erhöhe bei p = 0,5 die Anzahl n auf mindestens 200 Versuche.", check: (v) => v.p === 0.5 && v.n >= 200 },
    { id: "n500", text: "Simuliere die maximale Reihe n = 500 mit p = 0,2.", check: (v) => v.p === 0.2 && v.n === 500 },
    { id: "nah07", text: "Untersuche p = 0,7 bei mindestens n = 300 Versuchen.", check: (v) => v.p === 0.7 && v.n >= 300 },
  ],
};

export const labSpreadsheetRefs: LabDefinition = {
  kind: "spreadsheet-refs",
  title: "Labor: Absoluter und relativer Zellbezug",
  intro:
    "Schalte zwischen relativem B5 und absolutem $B$5 um und erkenne, warum das $-Zeichen beim Auswerten von Zufallsreihen nötig ist.",
  params: [
    choice("mode", "Bezug in C2", 1, [
      { value: 0, label: "=B2/$B$5 (absolut, korrekt)" },
      { value: 1, label: "=B2/B5 (relativ, verrutscht)" },
    ]),
    range("hits", "Treffer in B2", 10, 80, 25, 5),
    range("total", "Gesamtzahl in B5", 100, 200, 100, 50),
  ],
  readouts: [
    { key: "rel", label: "Relative Häufigkeit", emphasis: true, digits: 3, compute: (v) => v.hits / v.total },
    { key: "status", label: "Formel in C3", compute: (v) => (v.mode === 0 ? "=B3/$B$5 (gültig)" : "=B3/B6 (#DIV/0!)") },
  ],
  goals: [
    { id: "fix45", text: "Korrigiere die Formel ($B$5) und stelle 45 von 100 Treffern (0,45) ein.", check: (v) => v.mode === 0 && v.hits === 45 && v.total === 100 },
    { id: "fix150", text: "Stelle mit $B$5 exakt 60 Treffer bei 150 Versuchen (0,400) ein.", check: (v) => v.mode === 0 && v.hits === 60 && v.total === 150 },
    { id: "fix200", text: "Erreiche mit $B$5 bei 200 Versuchen die relative Häufigkeit 0,250.", check: (v) => v.mode === 0 && v.total === 200 && v.hits === 50 },
  ],
};

export const labLaplaceSymmetryCheck: LabDefinition = {
  kind: "laplace-symmetry-check",
  title: "Labor: Laplace oder nicht?",
  intro:
    "Verändere die Winkel von Sektor 1 und Sektor 2 am Glücksrad (Sektor 3 ergänzt zu 360°). Wann liegt ein Laplace-Experiment vor?",
  params: [
    range("s1", "Winkel Sektor 1", 60, 180, 150, 30, "°"),
    range("s2", "Winkel Sektor 2", 60, 120, 90, 30, "°"),
  ],
  readouts: [
    { key: "s3", label: "Winkel Sektor 3", unit: "°", digits: 0, compute: (v) => 360 - v.s1 - v.s2 },
    { key: "laplace", label: "Laplace-Modell?", emphasis: true, compute: (v) => (v.s1 === v.s2 && v.s2 === 360 - v.s1 - v.s2 ? "Ja (alle 120°)" : "Nein (ungleich)") },
  ],
  goals: [
    { id: "gleich", text: "Mache das Glücksrad zu einem echten Laplace-Experiment (3 · 120°).", check: (v) => v.s1 === 120 && v.s2 === 120 },
    { id: "halb", text: "Stelle ein Nicht-Laplace-Rad mit P(Sektor 1) = 0,50 (180°) ein.", check: (v) => v.s1 === 180 },
    { id: "asym", text: "Erzeuge drei verschieden große Sektoren: 60°, 120° und 180°.", check: (v) => v.s1 === 60 && v.s2 === 120 },
  ],
};

export const labLaplaceUrnGrid: LabDefinition = {
  kind: "laplace-urn-grid",
  title: "Labor: Laplace-Wahrscheinlichkeit & Gegenereignis",
  intro:
    "Lege Kugeln in die Urne und vergleiche P(rot) = |E|/|Ω| mit dem Gegenereignis P(nicht rot) = 1 − P(rot).",
  params: [
    range("red", "Rote Kugeln", 1, 6, 2, 1),
    range("blue", "Blaue Kugeln", 1, 6, 3, 1),
    range("green", "Grüne Kugeln", 1, 5, 5, 1),
  ],
  readouts: [
    { key: "pRed", label: "P(rot)", emphasis: true, digits: 2, compute: (v) => v.red / (v.red + v.blue + v.green) },
    { key: "pNotRed", label: "P(nicht rot)", digits: 2, compute: (v) => 1 - v.red / (v.red + v.blue + v.green) },
  ],
  goals: [
    { id: "vierzig", text: "Stelle eine Urne mit 10 Kugeln und P(rot) = 0,40 ein.", check: (v) => v.red === 4 && v.red + v.blue + v.green === 10 },
    { id: "gleichFarben", text: "Mache alle drei Farben gleich wahrscheinlich (P = 1/3 je Farbe).", check: (v) => v.red === v.blue && v.blue === v.green },
    { id: "gegen75", text: "Erreiche genau P(nicht rot) = 0,75 mit insgesamt 12 Kugeln.", check: (v) => v.red === 3 && v.red + v.blue + v.green === 12 },
  ],
};

export const labCountingTree: LabDefinition = {
  kind: "counting-tree",
  title: "Labor: Zählprinzip und Baumdiagramm",
  intro:
    "Stelle die Möglichkeiten in Stufe 1 und Stufe 2 ein und wähle die Zahl günstiger Pfade. Das Zählprinzip liefert |Ω| = n₁ · n₂.",
  params: [
    range("n1", "Stufe 1 (n₁)", 2, 4, 2, 1),
    range("n2", "Stufe 2 (n₂)", 2, 4, 2, 1),
    range("fav", "Günstige Pfade", 1, 6, 1, 1),
  ],
  readouts: [
    { key: "omega", label: "Gesamtpfade |Ω|", digits: 0, compute: (v) => countingTotal([v.n1, v.n2]) },
    { key: "prob", label: "P(E)", emphasis: true, digits: 3, compute: (v) => Math.min(v.fav, countingTotal([v.n1, v.n2])) / countingTotal([v.n1, v.n2]) },
  ],
  goals: [
    { id: "sechs", text: "Baue 2 × 3 = 6 Pfade und markiere 2 günstige (P = 1/3).", check: (v) => v.n1 === 2 && v.n2 === 3 && v.fav === 2 },
    { id: "zwoelf", text: "Erzeuge 3 × 4 = 12 Pfade und P(E) = 0,25.", check: (v) => v.n1 === 3 && v.n2 === 4 && v.fav === 3 },
    { id: "sechzehn", text: "Stelle maximal 16 Pfade mit 4 günstigen Ergebnissen ein.", check: (v) => v.n1 === 4 && v.n2 === 4 && v.fav === 4 },
  ],
};

// ─── Etappe 6: Lineare Gleichungssysteme ────────────────────────────────────

export const labLgsModeling: LabDefinition = {
  kind: "lgs-modeling",
  title: "Labor: Sachzusammenhang als Gleichungssystem",
  intro:
    "Teste Zahlenpaare (x | y) in den beiden Sachbedingungen I: 2x + 3y und II: x + 2y, um das passende Paar zu finden.",
  params: [
    range("x", "Erwachsenenpreis x", 2, 9, 3, 1, "€"),
    range("y", "Kinderpreis y", 1, 6, 2, 1, "€"),
  ],
  readouts: [
    { key: "i", label: "Gleichung I (2x + 3y)", unit: "€", digits: 0, compute: (v) => 2 * v.x + 3 * v.y },
    { key: "ii", label: "Gleichung II (x + 2y)", emphasis: true, unit: "€", digits: 0, compute: (v) => v.x + 2 * v.y },
  ],
  goals: [
    { id: "beide", text: "Löse I: 2x + 3y = 29 und II: x + 2y = 17 durch passendes x und y.", check: (v) => 2 * v.x + 3 * v.y === 29 && v.x + 2 * v.y === 17 },
    { id: "nurI", text: "Finde ein anderes Paar (x | y) mit I = 23 €, bei dem II ≠ 13 € ist.", check: (v) => 2 * v.x + 3 * v.y === 23 && v.x + 2 * v.y !== 13 },
    { id: "gleich22", text: "Stelle x = 6 € und y = 4 € ein (I = 24 €, II = 14 €).", check: (v) => v.x === 6 && v.y === 4 },
  ],
};

export const labLgsGraphical: LabDefinition = {
  kind: "lgs-graphical",
  title: "Labor: Gleichungssystem graphisch lösen",
  intro:
    "Ziehe an den Schnittpunkten t₁ und t₂ oder ändere die Steigungen, bis beide Geraden sich im gewünschten Lösungspunkt treffen.",
  params: [
    range("m1", "Gerade I: m₁", -2, 2, 1, 1),
    range("t1", "Gerade I: t₁", -3, 4, 0, 1),
    range("m2", "Gerade II: m₂", -2, 2, 1, 1),
    range("t2", "Gerade II: t₂", -3, 4, 2, 1),
  ],
  readouts: [
    {
      key: "sol",
      label: "Lösung (x | y)",
      emphasis: true,
      compute: (v) => {
        const r = intersectLines(v.m1, v.t1, v.m2, v.t2);
        return r.kind === "one" ? `(${fmt(r.point.x, 2)} | ${fmt(r.point.y, 2)})` : r.kind === "parallel" ? "keine (parallel)" : "∞ viele";
      },
    },
  ],
  goals: [
    { id: "s23", text: "Bringe die Geraden im Punkt (2 | 3) zum Schnitt.", check: (v) => { const r = intersectLines(v.m1, v.t1, v.m2, v.t2); return r.kind === "one" && Math.abs(r.point.x - 2) < 1e-6 && Math.abs(r.point.y - 3) < 1e-6; } },
    { id: "sm11", text: "Erzeuge die eindeutige Lösung S(−1 | 1).", check: (v) => { const r = intersectLines(v.m1, v.t1, v.m2, v.t2); return r.kind === "one" && Math.abs(r.point.x + 1) < 1e-6 && Math.abs(r.point.y - 1) < 1e-6; } },
    { id: "yAchse", text: "Lass sich zwei verschiedene Geraden auf der y-Achse bei (0 | 2) schneiden.", check: (v) => { const r = intersectLines(v.m1, v.t1, v.m2, v.t2); return r.kind === "one" && Math.abs(r.point.x) < 1e-6 && Math.abs(r.point.y - 2) < 1e-6; } },
  ],
};

export const labLgsSubstitution: LabDefinition = {
  kind: "lgs-substitution",
  title: "Labor: Einsetzungsverfahren",
  intro:
    "Beobachte, wie beim Einsetzen von x = c₁ − y in Gleichung II Schritt für Schritt dieselbe Lösungsmenge erhalten bleibt.",
  params: [
    range("c1", "I: Summe c₁", 3, 9, 5, 1),
    range("a2", "II: Faktor a₂", 1, 3, 1, 1),
    range("c2", "II: Differenz c₂", -2, 8, 1, 1),
  ],
  readouts: [
    { key: "x", label: "Lösung x", digits: 2, compute: (v) => (v.c1 + v.c2) / (v.a2 + 1) },
    { key: "y", label: "Lösung y", emphasis: true, digits: 2, compute: (v) => v.c1 - (v.c1 + v.c2) / (v.a2 + 1) },
  ],
  goals: [
    { id: "l34", text: "Stelle das System auf die Lösung L = {(3 | 4)} ein.", check: (v) => { const x = (v.c1 + v.c2) / (v.a2 + 1); const y = v.c1 - x; return Math.abs(x - 3) < 1e-6 && Math.abs(y - 4) < 1e-6; } },
    { id: "l51", text: "Erreiche mit a₂ = 1 die Lösung (5 | 1).", check: (v) => v.a2 === 1 && v.c1 === 6 && v.c2 === 4 },
    { id: "gleich", text: "Finde ein System mit gleichen Werten x = y = 2.", check: (v) => { const x = (v.c1 + v.c2) / (v.a2 + 1); const y = v.c1 - x; return Math.abs(x - 2) < 1e-6 && Math.abs(y - 2) < 1e-6; } },
  ],
};

export const labLgsElimination: LabDefinition = {
  kind: "lgs-elimination",
  title: "Labor: Additionsverfahren & Effektivität",
  intro:
    "Erweitere Gleichung II mit m so, dass sich +m·y und −m·y beim Addieren sofort aufheben.",
  params: [
    range("m", "Koeffizient m", 1, 3, 1, 1),
    range("c1", "I: rechte Seite c₁", 4, 12, 6, 1),
    range("c2", "II: rechte Seite c₂", 1, 6, 2, 1),
  ],
  readouts: [
    { key: "x", label: "x", emphasis: true, digits: 2, compute: (v) => (v.c1 + v.m * v.c2) / (2 + v.m) },
    { key: "y", label: "y", digits: 2, compute: (v) => (v.c1 + v.m * v.c2) / (2 + v.m) - v.c2 },
  ],
  goals: [
    { id: "g41", text: "Wähle m = 2 und erhalte exakt x = 4, y = 1.", check: (v) => v.m === 2 && v.c1 === 10 && v.c2 === 3 },
    { id: "g32", text: "Wähle m = 3 und erreiche x = 3, y = 2.", check: (v) => v.m === 3 && v.c1 === 12 && v.c2 === 1 },
    { id: "g20", text: "Stelle eine Lösung auf der x-Achse mit x = 2, y = 0 ein.", check: (v) => { const x = (v.c1 + v.m * v.c2) / (2 + v.m); const y = x - v.c2; return Math.abs(x - 2) < 1e-6 && Math.abs(y) < 1e-6; } },
  ],
};

export const labLgsCases: LabDefinition = {
  kind: "lgs-cases",
  title: "Labor: Lösbarkeit und Lösungsvielfalt",
  intro:
    "Vergleiche I: 2x − y = 4 mit Gleichung II und erzeuge alle drei möglichen Lösungsfälle.",
  params: [
    range("a2", "II: Faktor a₂", 1, 4, 1, 1),
    choice("b2", "II: Faktor b₂", 1, [
      { value: -2, label: "−2" },
      { value: -1, label: "−1" },
      { value: 1, label: "+1" },
    ]),
    range("c2", "II: rechte Seite c₂", 2, 10, 5, 1),
  ],
  readouts: [
    {
      key: "kind",
      label: "Lösungsfall",
      emphasis: true,
      compute: (v) => {
        const s = solve2x2(2, -1, 4, v.a2, v.b2, v.c2);
        return s.kind === "unique" ? `Eindeutig: (${fmt(s.x, 2)} | ${fmt(s.y, 2)})` : s.kind === "none" ? "Keine Lösung (L = ∅)" : "Unendlich viele Lösungen";
      },
    },
  ],
  goals: [
    { id: "s20", text: "Finde eine eindeutige Lösung genau bei S(2 | 0).", check: (v) => { const s = solve2x2(2, -1, 4, v.a2, v.b2, v.c2); return s.kind === "unique" && Math.abs(s.x - 2) < 1e-6 && Math.abs(s.y) < 1e-6; } },
    { id: "leer", text: "Stelle echt parallele Geraden ein (L = ∅).", check: (v) => solve2x2(2, -1, 4, v.a2, v.b2, v.c2).kind === "none" },
    { id: "unendlich", text: "Mache beide Gleichungen gleichwertig (∞ viele Lösungen).", check: (v) => solve2x2(2, -1, 4, v.a2, v.b2, v.c2).kind === "infinite" },
  ],
};

// ─── Etappe 7: Kreis und Zylinder ───────────────────────────────────────────

export const labCirclePiUnroll: LabDefinition = {
  kind: "circle-pi-unroll",
  title: "Labor: Kreiszahl π und Umfang",
  intro:
    "Stelle den Durchmesser d ein und rolle den Kreis an der Achse entlang ab.",
  params: [
    range("d", "Durchmesser d", 2, 8, 4, 1, "cm"),
    range("roll", "Abrollen", 0, 100, 0, 10, "%"),
  ],
  readouts: [
    { key: "rolled", label: "Abgerollte Strecke", digits: 2, unit: "cm", compute: (v) => (v.roll / 100) * Math.PI * v.d },
    { key: "U", label: "Kreisumfang U", emphasis: true, digits: 2, unit: "cm", compute: (v) => Math.PI * v.d },
  ],
  goals: [
    { id: "d2", text: "Rolle den Kreis d = 2 cm vollständig ab (U ≈ 6,28 cm).", check: (v) => v.d === 2 && v.roll === 100 },
    { id: "d6", text: "Bestimme vollständig abgerollt den Umfang für d = 6 cm (U ≈ 18,85 cm).", check: (v) => v.d === 6 && v.roll === 100 },
    { id: "halb", text: "Rolle einen Kreis mit d = 4 cm genau zur Hälfte (50 %) ab.", check: (v) => v.d === 4 && v.roll === 50 },
  ],
};

export const labCircleAreaSectors: LabDefinition = {
  kind: "circle-area-sectors",
  title: "Labor: Kreisfläche als nicht lineare Zuordnung",
  intro:
    "Verändere den Radius r und die Sektorenzahl. Beobachte, wie sich A = π · r² beim Verdoppeln von r vervierfacht!",
  params: [
    range("r", "Radius r", 1, 5, 2, 0.5, "cm", 1),
    range("slices", "Sektoren", 4, 32, 8, 4),
  ],
  readouts: [
    { key: "rect", label: "Halber Umfang π·r", digits: 2, unit: "cm", compute: (v) => Math.PI * v.r },
    { key: "A", label: "Kreisfläche A", emphasis: true, digits: 2, unit: "cm²", compute: (v) => circleArea(v.r) },
  ],
  goals: [
    { id: "doppelR", text: "Verdopple r von 2 cm auf 4 cm und sieh die Vervierfachung der Fläche (≈ 50,27 cm²).", check: (v) => v.r === 4 },
    { id: "fein", text: "Zerlege einen Kreis mit r = 3 cm sehr fein in 32 Sektoren.", check: (v) => v.r === 3 && v.slices === 32 },
    { id: "r5", text: "Erreiche bei r = 5 cm den Flächeninhalt 25π ≈ 78,54 cm².", check: (v) => v.r === 5 },
  ],
};

export const labCircleParts: LabDefinition = {
  kind: "circle-parts",
  title: "Labor: Kreissektor und Kreisring",
  intro:
    "Wechsle zwischen Kreissektor (Bogenlänge b, Sektorfläche) und Kreisring (Fläche aus Außen- und Innenkreis).",
  params: [
    choice("mode", "Figur", 0, [
      { value: 0, label: "Kreissektor (Winkel α)" },
      { value: 1, label: "Kreisring (Außen R, Innen r)" },
    ]),
    range("r", "Radius r bzw. R", 2, 6, 4, 1, "cm"),
    range("alpha", "Winkel α", 30, 270, 60, 30, "°"),
    range("ri", "Innenradius r", 1, 4, 2, 1, "cm"),
  ],
  readouts: [
    {
      key: "arc",
      label: "Bogen / Umfang",
      digits: 2,
      unit: "cm",
      compute: (v) => (v.mode === 0 ? sectorArc(v.r, v.alpha) : circleCircumference(v.r)),
    },
    {
      key: "area",
      label: "Flächeninhalt A",
      emphasis: true,
      digits: 2,
      unit: "cm²",
      compute: (v) => (v.mode === 0 ? sectorArea(v.r, v.alpha) : annulusArea(v.r, Math.min(v.ri, v.r - 1))),
    },
  ],
  goals: [
    { id: "viertel", text: "Stelle einen Viertelkreis (α = 90°) mit Radius r = 6 cm ein.", check: (v) => v.mode === 0 && v.r === 6 && v.alpha === 90 },
    { id: "halbk", text: "Bilde einen Halbkreis (α = 180°) bei r = 4 cm.", check: (v) => v.mode === 0 && v.r === 4 && v.alpha === 180 },
    { id: "ring", text: "Berechne einen Kreisring mit Außenradius R = 5 cm und Innenradius r = 3 cm.", check: (v) => v.mode === 1 && v.r === 5 && v.ri === 3 },
  ],
};

export const labCylinderPrismNet: LabDefinition = {
  kind: "cylinder-prism-net",
  title: "Labor: Schrägbild, Netz & Oberfläche",
  intro:
    "Vergleiche das Netz eines geraden Kreiszylinders mit dem eines geraden Prismas: O = 2·G + M.",
  params: [
    choice("body", "Körper", 0, [
      { value: 0, label: "Gerader Kreiszylinder" },
      { value: 1, label: "Quadratisches Prisma" },
    ]),
    range("r", "Radius r bzw. Seite a", 1, 4, 2, 1, "cm"),
    range("h", "Körperhöhe h", 2, 6, 3, 1, "cm"),
  ],
  readouts: [
    { key: "M", label: "Mantelfläche M", digits: 2, unit: "cm²", compute: (v) => (v.body === 0 ? cylinderLateral(v.r, v.h) : 4 * v.r * v.h) },
    { key: "O", label: "Oberfläche O", emphasis: true, digits: 2, unit: "cm²", compute: (v) => (v.body === 0 ? cylinderSurface(v.r, v.h) : prismSurface(v.r * v.r, 4 * v.r, v.h)) },
  ],
  goals: [
    { id: "zyl35", text: "Erkunde den Zylinder mit r = 3 cm und h = 5 cm (O = 48π ≈ 150,80 cm²).", check: (v) => v.body === 0 && v.r === 3 && v.h === 5 },
    { id: "prisma", text: "Wechsle zum Prisma mit Grundseite a = 3 cm und Höhe h = 4 cm (O = 66 cm²).", check: (v) => v.body === 1 && v.r === 3 && v.h === 4 },
    { id: "gleichMG", text: "Mache beim Zylinder die Mantelfläche M genau so groß wie 2·G (h = r = 3 cm).", check: (v) => v.body === 0 && v.r === 3 && v.h === 3 },
  ],
};

export const labPrismToCylinder: LabDefinition = {
  kind: "prism-to-cylinder",
  title: "Labor: Zylindervolumen als Prismen-Grenzfall",
  intro:
    "Steigere die Eckenzahl n des einbeschriebenen regelmäßigen Prismas und vergleiche sein Volumen V = G_n · h mit V_Zylinder = π·r²·h.",
  params: [
    range("n", "Eckenzahl n", 4, 32, 4, 4),
    range("r", "Radius r", 2, 5, 3, 1, "cm"),
    range("h", "Höhe h", 2, 6, 4, 1, "cm"),
  ],
  readouts: [
    { key: "vp", label: "Prisma V = G_n·h", digits: 2, unit: "cm³", compute: (v) => prismVolume(regularPolygonArea(v.n, v.r), v.h) },
    { key: "vc", label: "Zylinder V = πr²·h", emphasis: true, digits: 2, unit: "cm³", compute: (v) => cylinderVolume(v.r, v.h) },
  ],
  goals: [
    { id: "grenz32", text: "Erhöhe bei r = 3 cm, h = 4 cm auf n = 32 Ecken.", check: (v) => v.n === 32 && v.r === 3 && v.h === 4 },
    { id: "v80pi", text: "Stelle bei mindestens n = 16 das Zylindervolumen 80π ≈ 251,33 cm³ ein.", check: (v) => v.n >= 16 && v.r === 4 && v.h === 5 },
    { id: "acht", text: "Vergleiche ein 8-Eck-Prisma bei r = 2 cm und h = 6 cm.", check: (v) => v.n === 8 && v.r === 2 && v.h === 6 },
  ],
};

export const labBodyModeling: LabDefinition = {
  kind: "body-modeling",
  title: "Labor: Zusammengesetzte Körper modellieren",
  intro:
    "Verändere Sockelhöhe und Zylinderaufsatz. Bei zusammengesetzten Körpern addieren sich die Volumina — die Klebefläche zählt aber bei der Oberfläche nicht doppelt!",
  params: [
    range("hBox", "Sockelhöhe", 2, 6, 3, 1, "cm"),
    range("rTop", "Aufsatz r", 1, 3, 2, 1, "cm"),
    range("hTop", "Aufsatz h", 2, 5, 2, 1, "cm"),
  ],
  readouts: [
    { key: "V", label: "Gesamtvolumen", emphasis: true, digits: 2, unit: "cm³", compute: (v) => 36 * v.hBox + cylinderVolume(v.rTop, v.hTop) },
    { key: "O", label: "Außenfläche O", digits: 2, unit: "cm²", compute: (v) => 72 + 24 * v.hBox + cylinderLateral(v.rTop, v.hTop) },
  ],
  goals: [
    { id: "sockel4", text: "Stelle Sockelhöhe 4 cm, r = 2 cm und Aufsatzhöhe 3 cm ein.", check: (v) => v.hBox === 4 && v.rTop === 2 && v.hTop === 3 },
    { id: "grossTop", text: "Wähle Aufsatz r = 3 cm, h = 4 cm bei Sockelhöhe 2 cm.", check: (v) => v.rTop === 3 && v.hTop === 4 && v.hBox === 2 },
    { id: "turm", text: "Baue einen schlanken Turm: Sockelhöhe 5 cm, r = 1 cm, Aufsatzhöhe 5 cm.", check: (v) => v.hBox === 5 && v.rTop === 1 && v.hTop === 5 },
  ],
};
