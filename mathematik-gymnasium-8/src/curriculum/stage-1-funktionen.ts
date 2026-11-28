import { fmt, MINUS } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, signed, task } from "./builders";
import { choiceField, intField } from "./helpers";
import {
  labDomainRangeMapper,
  labFuncRepresentations,
  labPointProbeAxes,
  labValueChangeExplorer,
  labVerticalLineTest,
} from "./labs-1-3";
import { makeLessons } from "./make";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 1 ────────────────────────────────────────────────────────

const exTableToTerm: ExerciseGenerator = {
  id: "ft-tabelle-term",
  make(rng, level) {
    const base = rng.int(6, 15);
    const rate = rng.pick([2, 3, 4, 5]);
    const x = level === 1 ? rng.int(4, 9) : rng.int(12, 24);
    const ans = base + rate * x;
    const wrongAdd = base * x + rate;
    const wrongMul = (base + rate) * x;

    return task(
      level,
      `Ein Tarif startet bei einer festen Grundgebühr von ${fmt(base, 0)} € und kostet pro Einheit ${fmt(rate, 0)} €. Berechne den Funktionswert K(${fmt(x, 0)}) zum Term K(x) = ${fmt(base, 0)} + ${fmt(rate, 0)}x.`,
      `Ein Streaming-Anbieter führt eine monatliche Pauschale von ${fmt(base, 0)} € plus ${fmt(rate, 0)} € je geliehenem Film x ein. Stelle den passenden Term K(x) auf und bestimme die Monatskosten für ${fmt(x, 0)} Filme.`,
      level === 1
        ? [
            intField(`K(${fmt(x, 0)})`, ans, [
              { value: wrongMul, hint: `Die Grundgebühr von ${fmt(base, 0)} € fällt nur einmal an, nicht pro Einheit.` },
              { value: wrongAdd, hint: `Der Faktor ${fmt(rate, 0)} gehört zu x, die Grundgebühr ${fmt(base, 0)} steht allein.` },
            ], "€"),
          ]
        : [
            intField(`Gesamtkosten`, ans, [
              { value: wrongMul, hint: `Addiere die einmalige Pauschale ${fmt(base, 0)} € nur einmal zu ${fmt(rate, 0)} · x.` },
              { value: wrongAdd, hint: `Verwechsle Grundgebühr (${fmt(base, 0)}) und Filmpreis (${fmt(rate, 0)}) nicht.` },
            ], "€"),
            choiceField(
              "Passender Term K(x)",
              [`${fmt(base, 0)} + ${fmt(rate, 0)}x`, `${fmt(base + rate, 0)}x`, `${fmt(base, 0)}x + ${fmt(rate, 0)}`],
              0,
            ),
          ],
      `K(x) = ${fmt(base, 0)} + ${fmt(rate, 0)} · x`,
      `Grundgebühr = ${fmt(base, 0)} €, variabler Anteil = ${fmt(rate, 0)} · ${fmt(x, 0)} = ${fmt(rate * x, 0)} €.`,
      `Gesamt: K(${fmt(x, 0)}) = ${fmt(base, 0)} + ${fmt(rate * x, 0)} = <strong>${fmt(ans, 0)} €</strong>.`,
      { base, rate, x, ans },
    );
  },
};

const exSpreadsheetValue: ExerciseGenerator = {
  id: "ft-tabelle-kalk",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(-6, 8);
    const xStart = rng.int(1, 5);
    const row = level === 1 ? 3 : rng.int(4, 6);
    const xRow = xStart + (row - 2);
    const ans = a * xRow + b;
    const wrongFirst = a * xStart + b;

    return task(
      level,
      `In einer Tabelle steht in A2 der Startwert ${fmt(xStart, 0)} (jede Zeile steigt um 1: A3 = ${fmt(xStart + 1, 0)}, …). In B2 steht die Formel <code>=${fmt(a, 0)}*A2${b >= 0 ? `+${fmt(b, 0)}` : `-${fmt(-b, 0)}`}</code>, heruntergezogen bis B${fmt(row, 0)}. Welcher Wert steht in B${fmt(row, 0)}?`,
      `Für eine Temperaturmessung berechnet eine Tabellenkalkulation aus der Zeit in Spalte A (A2 = ${fmt(xStart, 0)} h, Schrittweite +1 h pro Zeile) den Messwert mit <code>=${fmt(a, 0)}*A2${b >= 0 ? `+${fmt(b, 0)}` : `-${fmt(-b, 0)}`}</code> in B2. Welcher Wert erscheint nach dem Herunterziehen in Zelle B${fmt(row, 0)}?`,
      [
        intField(`Wert in B${fmt(row, 0)}`, ans, [
          { value: wrongFirst, hint: `Beim Herunterziehen passt sich der relative Bezug A2 auf A${fmt(row, 0)} an.` },
          { value: ans + a, hint: `Zähle genau ab: A2 ist ${fmt(xStart, 0)}, also ist A${fmt(row, 0)} = ${fmt(xRow, 0)}.` },
        ]),
      ],
      `Bestimme zuerst A${fmt(row, 0)} = ${fmt(xStart, 0)} + ${fmt(row - 2, 0)} = ${fmt(xRow, 0)}, setze dann in ${fmt(a, 0)} · A${fmt(row, 0)}${signed(b, 0)} ein.`,
      `Zelle A${fmt(row, 0)} enthält den Wert ${fmt(xStart, 0)} + ${fmt(row - 2, 0)} = ${fmt(xRow, 0)}.`,
      `Einsetzen in die heruntergezogene Formel: ${fmt(a, 0)} · ${fmt(xRow, 0)}${signed(b, 0)} = <strong>${fmt(ans, 0)}</strong>.`,
      { a, b, xStart, row, xRow, ans },
    );
  },
};

const exCheckRelation: ExerciseGenerator = {
  id: "ft-zuordnung-pruefen",
  make(rng, level) {
    const x1 = rng.int(1, 4);
    const y1 = rng.int(2, 6);
    const y2 = y1 + rng.int(1, 3);
    const mode = level === 1 ? rng.int(0, 1) : rng.int(0, 2);

    if (mode === 0) {
      return task(
        level,
        `Gegeben ist die Zuordnung mit den Wertepaaren (${fmt(x1, 0)} | ${fmt(y1, 0)}), (${fmt(x1 + 1, 0)} | ${fmt(y2, 0)}) und (${fmt(x1, 0)} | ${fmt(y2 + 1, 0)}). Entscheide, ob es sich um eine Funktion handelt.`,
        `Bei einer Messung wurden zum selben Zeitpunkt t = ${fmt(x1, 0)} min zwei verschiedene Temperaturen ${fmt(y1, 0)} °C und ${fmt(y2 + 1, 0)} °C notiert, außerdem (${fmt(x1 + 1, 0)} | ${fmt(y2, 0)}). Ist diese Zuordnung Zeit → Temperatur eine Funktion?`,
        [
          choiceField("Liegt eine Funktion vor?", ["Nein, nicht eindeutig", "Ja, eindeutig"], 0),
        ],
        `Prüfe, ob zu demselben x-Wert mehr als ein y-Wert gehört.`,
        `Dem x-Wert ${fmt(x1, 0)} werden zwei verschiedene y-Werte (${fmt(y1, 0)} und ${fmt(y2 + 1, 0)}) zugeordnet.`,
        `<strong>Nein, nicht eindeutig</strong> — daher liegt keine Funktion vor.`,
        { x1, y1, y2, mode },
      );
    }

    return task(
      level,
      `Eine Wertetabelle enthält (${fmt(x1, 0)} | ${fmt(y1, 0)}), (${fmt(x1 + 1, 0)} | ${fmt(y1, 0)}) und (${fmt(x1 + 2, 0)} | ${fmt(y2, 0)}). Entscheide, ob eine Funktion vorliegt.`,
      `Zwei verschiedene Produkte mit den Nummern ${fmt(x1, 0)} und ${fmt(x1 + 1, 0)} kosten beide ${fmt(y1, 0)} €, Nummer ${fmt(x1 + 2, 0)} kostet ${fmt(y2, 0)} €. Ist die Zuordnung Produktnummer → Preis eine Funktion?`,
      [
        choiceField("Liegt eine Funktion vor?", ["Ja, eindeutig", "Nein, da zwei x denselben y-Wert haben"], 0),
      ],
      `Verschiedene x-Werte dürfen durchaus denselben y-Wert besitzen — entscheidend ist, dass jedes x höchstens einen y-Wert hat.`,
      `Jeder x-Wert (${fmt(x1, 0)}, ${fmt(x1 + 1, 0)}, ${fmt(x1 + 2, 0)}) besitzt genau einen zugeordneten y-Wert.`,
      `<strong>Ja, eindeutig</strong> — es handelt sich um eine Funktion.`,
      { x1, y1, y2, mode },
    );
  },
};

const exFunctionCounterexample: ExerciseGenerator = {
  id: "ft-funktion-gegenbeispiel",
  make(rng, level) {
    const r = rng.pick([3, 4, 5]);
    const xTest = rng.int(1, r - 1);
    const ySq = r * r - xTest * xTest;
    const isCircle = level === 1 ? rng.int(0, 1) : rng.int(0, 1);

    if (isCircle === 0) {
      return task(
        level,
        `Eine Kreislinie hat die Gleichung x² + y² = ${fmt(r * r, 0)}. Wie viele y-Werte gehören zum Argument x = ${fmt(xTest, 0)}?`,
        `Im Koordinatensystem beschreibt x² + y² = ${fmt(r * r, 0)} einen Kreis mit Radius ${fmt(r, 0)}. Begründe über die Stelle x = ${fmt(xTest, 0)}, wie viele Schnittpunkte eine Senkrechte dort trifft.`,
        [
          intField("Anzahl der y-Werte", 2, [
            { value: 1, hint: `Sowohl y = +√${fmt(ySq, 0)} als auch y = ${MINUS}√${fmt(ySq, 0)} erfüllen x² + y² = ${fmt(r * r, 0)}.` },
            { value: 0, hint: `Da ${fmt(xTest, 0)}² = ${fmt(xTest * xTest, 0)} < ${fmt(r * r, 0)}, bleibt y² = ${fmt(ySq, 0)} > 0.` },
          ]),
        ],
        `Setze x = ${fmt(xTest, 0)} in x² + y² = ${fmt(r * r, 0)} ein und beachte positive und negative Lösungen für y.`,
        `y² = ${fmt(r * r, 0)} ${MINUS} ${fmt(xTest * xTest, 0)} = ${fmt(ySq, 0)} > 0.`,
        `Es gibt zwei Lösungen (+√${fmt(ySq, 0)} und ${MINUS}√${fmt(ySq, 0)}), also <strong>2</strong> y-Werte → der Kreis ist kein Funktionsgraph.`,
        { r, xTest, ySq },
      );
    }

    const rSquared = r * r;
    return task(
      level,
      `Ein waagrechter Graph erfüllt x = y². Wie viele y-Werte gehören zur Stelle x = ${fmt(rSquared, 0)}?`,
      `Prüfe beim Graphen zu x = y² an der Stelle x = ${fmt(rSquared, 0)}, ob die Zuordnung x ↦ y eindeutig ist, indem du die Zahl der y-Werte angibst.`,
      [
        intField("Anzahl der y-Werte", 2, [
          { value: 1, hint: `Vergiss die negative Zahl ${MINUS}${fmt(r, 0)} nicht: (${MINUS}${fmt(r, 0)})² ist ebenfalls ${fmt(rSquared, 0)}.` },
        ]),
      ],
      `Welche Zahlen ergeben quadriert ${fmt(rSquared, 0)}?`,
      `Sowohl y₁ = ${fmt(r, 0)} als auch y₂ = ${MINUS}${fmt(r, 0)} erfüllen y² = ${fmt(rSquared, 0)}.`,
      `Zu x = ${fmt(rSquared, 0)} gehören <strong>2</strong> y-Werte → keine Funktion.`,
      { r, rSquared },
    );
  },
};

const exTermRoles: ExerciseGenerator = {
  id: "ft-begriffe-zuordnen",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(1, 6);
    const dMin = rng.int(1, 3);
    const dMax = dMin + rng.int(2, 4);
    const wMin = a * dMin + b;
    const wMax = a * dMax + b;

    if (level === 1) {
      return task(
        level,
        `Gegeben ist die Funktion f mit dem Funktionsterm f(x) = ${fmt(a, 0)}x + ${fmt(b, 0)} auf der Definitionsmenge D = [${fmt(dMin, 0)}; ${fmt(dMax, 0)}]. Bestimme den kleinsten Wert der Wertemenge W.`,
        "",
        [
          intField("Kleinster Funktionswert", wMin, [
            { value: dMin, hint: `${fmt(dMin, 0)} ist der kleinste x-Wert (in D), gesucht ist f(${fmt(dMin, 0)}) in W.` },
            { value: wMax, hint: `${fmt(wMax, 0)} ist der größte Wert in W, gesucht ist der kleinste.` },
          ]),
        ],
        `Setze den kleinsten x-Wert aus D = [${fmt(dMin, 0)}; ${fmt(dMax, 0)}] in f(x) ein.`,
        `Da f mit wachsendem x zunimmt, liegt das Minimum bei x = ${fmt(dMin, 0)}.`,
        `f(${fmt(dMin, 0)}) = ${fmt(a, 0)} · ${fmt(dMin, 0)} + ${fmt(b, 0)} = <strong>${fmt(wMin, 0)}</strong>.`,
        { a, b, dMin, wMin },
      );
    }

    return task(
      level,
      "",
      `Ein Quader hat feste Grundfläche ${fmt(a, 0)} cm² und variabler Wasserhöhe x ∈ [${fmt(dMin, 0)}; ${fmt(dMax, 0)}] cm plus ${fmt(b, 0)} cm³ Bodensatz: V(x) = ${fmt(a, 0)}x + ${fmt(b, 0)}. Berechne das größte Volumen in der Wertemenge W und benenne den Fachbegriff für das Intervall [${fmt(dMin, 0)}; ${fmt(dMax, 0)}].`,
      [
        intField("Größtes Volumen", wMax, [
          { value: dMax, hint: `${fmt(dMax, 0)} ist die maximale Höhe (x), berechne V(${fmt(dMax, 0)}).` },
          { value: wMin, hint: `${fmt(wMin, 0)} ist das kleinste Volumen, gesucht ist das größte.` },
        ], "cm³"),
        choiceField(
          `Fachbegriff für [${fmt(dMin, 0)}; ${fmt(dMax, 0)}]`,
          ["Definitionsmenge D", "Wertemenge W", "Funktionsterm"],
          0,
        ),
      ],
      "",
      `Die erlaubten Eingaben x bilden die Definitionsmenge D = [${fmt(dMin, 0)}; ${fmt(dMax, 0)}].`,
      `Maximaler Wert: V(${fmt(dMax, 0)}) = ${fmt(a, 0)} · ${fmt(dMax, 0)} + ${fmt(b, 0)} = <strong>${fmt(wMax, 0)} cm³</strong>.`,
      { a, b, dMax, wMax },
    );
  },
};

const exRangeValues: ExerciseGenerator = {
  id: "ft-wertemenge-bestimmen",
  make(rng, level) {
    const c = rng.int(1, 3);
    const minX = level === 1 ? 0 : rng.int(-3, -1);
    const maxX = rng.int(2, 4);
    const yLeft = c * minX * minX;
    const yRight = c * maxX * maxX;
    const wMax = Math.max(yLeft, yRight);
    const wMin = minX <= 0 && maxX >= 0 ? 0 : Math.min(yLeft, yRight);

    return task(
      level,
      `Betrachte f(x) = ${fmt(c, 0)}x² auf der Definitionsmenge D = [${fmt(minX, 0)}; ${fmt(maxX, 0)}]. Bestimme die untere und obere Grenze der Wertemenge W = [y_min; y_max].`,
      `Die Bremsweg-Näherung f(x) = ${fmt(c, 0)}x² wird für x ∈ [${fmt(minX, 0)}; ${fmt(maxX, 0)}] ausgewertet. Bestimme die Grenzen y_min und y_max der Wertemenge W (beachte, ob 0 in D liegt!).`,
      [
        intField("y_min", wMin, [
          level === 1
            ? { value: wMax, hint: `${fmt(wMax, 0)} ist der größte Wert (y_max); gesucht ist das Minimum y_min bei x = 0.` }
            : { value: yLeft, hint: `Bei negativem und positivem Rand liegt das Minimum von x² bei x = 0 (also y_min = 0).` },
        ]),
        intField("y_max", wMax, [
          { value: c * maxX, hint: `Vergiss das Quadrieren von x nicht: x², nicht nur x.` },
        ]),
      ],
      `Bei Quadratfunktionen mit 0 ∈ D ist das Minimum 0; das Maximum liefert der betragsgrößte Rand.`,
      `Werte an den Rändern und bei 0: f(${fmt(minX, 0)}) = ${fmt(yLeft, 0)}, f(0) = 0, f(${fmt(maxX, 0)}) = ${fmt(yRight, 0)}.`,
      `Damit gilt W = [<strong>${fmt(wMin, 0)}</strong>; <strong>${fmt(wMax, 0)}</strong>].`,
      { c, minX, maxX, wMin, wMax },
    );
  },
};

const exPointProbe: ExerciseGenerator = {
  id: "ft-punktprobe",
  make(rng, level) {
    const m = rng.pick([-3, -2, 2, 3, 4]);
    const t = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const px = rng.int(1, 4);
    const fx = m * px + t;
    const onGraph = level === 1 ? rng.int(0, 1) : rng.int(0, 1);
    const offset = onGraph ? 0 : rng.pick([-2, -1, 1, 2]);
    const py = fx + offset;

    return task(
      level,
      `Gegeben ist die Funktion f(x) = ${fmt(m, 0)}x${signed(t, 0)}. Berechne f(${fmt(px, 0)}) und entscheide per Punktprobe, ob P(${fmt(px, 0)} | ${fmt(py, 0)}) auf dem Graphen liegt.`,
      `Für die Kontrollmessung soll geprüft werden, ob der Messpunkt P(${fmt(px, 0)} | ${fmt(py, 0)}) exakt auf dem Graphen von f(x) = ${fmt(m, 0)}x${signed(t, 0)} liegt (oder darüber bzw. darunter).`,
      [
        intField(`f(${fmt(px, 0)})`, fx, [
          { value: m * px - t, hint: `Achte auf das Vorzeichen beim konstanten Glied${signed(t, 0)}.` },
        ]),
        choiceField(
          "Lage von P",
          onGraph
            ? ["auf dem Graphen", "oberhalb des Graphen", "unterhalb des Graphen"]
            : offset > 0
              ? ["oberhalb des Graphen", "auf dem Graphen", "unterhalb des Graphen"]
              : ["unterhalb des Graphen", "auf dem Graphen", "oberhalb des Graphen"],
          0,
        ),
      ],
      `Setze x = ${fmt(px, 0)} in f(x) ein und vergleiche f(${fmt(px, 0)}) mit y_P = ${fmt(py, 0)}.`,
      `f(${fmt(px, 0)}) = ${fmt(m, 0)} · ${fmt(px, 0)}${signed(t, 0)} = ${fmt(fx, 0)}.`,
      `Vergleich mit y_P = ${fmt(py, 0)}: <strong>f(${fmt(px, 0)}) = ${fmt(fx, 0)}</strong> → P liegt <strong>${onGraph ? "auf dem Graphen" : offset > 0 ? "oberhalb" : "unterhalb"}</strong>.`,
      { m, t, px, py, fx },
    );
  },
};

const exAxisIntercepts: ExerciseGenerator = {
  id: "ft-achsenschnitt",
  make(rng, level) {
    const m = rng.pick([2, 3, -2, -3]);
    const x0 = rng.pick([-4, -3, -2, 2, 3, 4]);
    const t = -m * x0;

    return task(
      level,
      `Bestimme für f(x) = ${fmt(m, 0)}x${signed(t, 0)} die Schnittpunkte Sy(0 | y_s) mit der y-Achse und Sx(x_0 | 0) mit der x-Achse.`,
      `Ein lineares Gefälle wird durch h(x) = ${fmt(m, 0)}x${signed(t, 0)} beschrieben. Berechne die Achsenschnittpunkte: Starthöhe bei x = 0 sowie die Stelle x_0, an der h(x_0) = 0 erreicht wird.`,
      [
        intField("y_s (bei x = 0)", t, [
          { value: x0, hint: `${fmt(x0, 0)} ist die Nullstelle auf der x-Achse, nicht der y-Achsenabschnitt.` },
        ]),
        intField("x_0 (bei y = 0)", x0, [
          { value: -x0, hint: `Prüfe das Vorzeichen beim Umformen von ${fmt(m, 0)}x${signed(t, 0)} = 0.` },
          { value: t, hint: `Teile noch durch die Steigung ${fmt(m, 0)}, um x_0 zu erhalten.` },
        ]),
      ],
      `y-Achse: x = 0 einsetzen; x-Achse: f(x) = 0 nach x auflösen.`,
      `Für x = 0 gilt f(0) = ${fmt(t, 0)} → Sy(0 | ${fmt(t, 0)}).`,
      `Für f(x) = 0 gilt ${fmt(m, 0)}x = ${fmt(-t, 0)}, also x_0 = <strong>${fmt(x0, 0)}</strong>.`,
      { m, t, x0 },
    );
  },
};

const exValueChangeLinear: ExerciseGenerator = {
  id: "ft-aenderung-linear",
  make(rng, level) {
    const m = rng.pick([-4, -3, -2, 2, 3, 5]);
    const t = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
    const dx = level === 1 ? rng.int(2, 4) : rng.int(3, 7);
    const dy = m * dx;

    return task(
      level,
      `Bei der Funktion f(x) = ${fmt(m, 0)}x${signed(t, 0)} wird das Argument x um ${fmt(dx, 0)} vergrößert. Um welchen Betrag Δy verändert sich der Funktionswert?`,
      `In einer Auswertung steigt das Argument x eines Zusammenhangs f(x) = ${fmt(m, 0)}x${signed(t, 0)} von x = 4 auf x = ${fmt(4 + dx, 0)}. Gib die Veränderung Δy des Funktionswerts (mit Vorzeichen) an.`,
      [
        intField("Δy", dy, [
          { value: m, hint: `Der Zuwachs ${fmt(m, 0)} gilt pro +1 Schritt; multipliziere mit Δx = ${fmt(dx, 0)}.` },
          { value: dy + t, hint: `Der feste Startwert ${fmt(t, 0)} fällt bei der Differenz f(x + Δx) ${MINUS} f(x) weg.` },
        ]),
      ],
      `Δy = f(x + ${fmt(dx, 0)}) ${MINUS} f(x) = ${fmt(m, 0)} · ${fmt(dx, 0)}.`,
      `Jeder Schritt um +1 in x ändert den Funktionswert um ${fmt(m, 0)}.`,
      `Bei Δx = +${fmt(dx, 0)} ändert sich der Wert um ${fmt(m, 0)} · ${fmt(dx, 0)} = <strong>${fmt(dy, 0)}</strong>.`,
      { m, t, dx, dy },
    );
  },
};

const exGrowthInterpret: ExerciseGenerator = {
  id: "ft-wachstum-deuten",
  make(rng, level) {
    const start = rng.int(2, 5);
    const dx = rng.int(2, 3);
    const f = (x: number) => 2 * x * x;
    const x1 = start;
    const x2 = start + dx;
    const y1 = f(x1);
    const y2 = f(x2);
    const dy = y2 - y1;
    const nextDy = f(x2 + dx) - y2;

    return task(
      level,
      `Für die Funktion f(x) = 2x² wächst x von ${fmt(x1, 0)} auf ${fmt(x2, 0)}. Berechne den Zuwachs Δy = f(${fmt(x2, 0)}) ${MINUS} f(${fmt(x1, 0)}).`,
      `Beim Bremsen wächst der Bremsweg mit s(v) = 2v² (in vereinfachten Einheiten). Vergleiche den Zuwachs Δs von v = ${fmt(x1, 0)} auf ${fmt(x2, 0)} mit dem folgenden gleich großen Schritt von ${fmt(x2, 0)} auf ${fmt(x2 + dx, 0)}.`,
      level === 1
        ? [
            intField("Zuwachs Δy", dy, [
              { value: y2, hint: `${fmt(y2, 0)} ist f(${fmt(x2, 0)}); ziehe noch f(${fmt(x1, 0)}) = ${fmt(y1, 0)} ab.` },
              { value: 2 * dx * dx, hint: `Berechne f(${fmt(x2, 0)}) ${MINUS} f(${fmt(x1, 0)}), nicht f(${fmt(dx, 0)}).` },
            ]),
          ]
        : [
            intField("Δs im 1. Schritt", dy, [
              { value: y2, hint: `Subtrahiere s(${fmt(x1, 0)}) = ${fmt(y1, 0)} von s(${fmt(x2, 0)}) = ${fmt(y2, 0)}.` },
            ]),
            choiceField(
              "Wie verhält sich der nächste Schritt?",
              [`Er wird größer (${fmt(nextDy, 0)})`, `Er bleibt gleich (${fmt(dy, 0)})`, "Er wird kleiner"],
              0,
            ),
          ],
      `Berechne f(${fmt(x2, 0)}) = 2 · ${fmt(x2, 0)}² und f(${fmt(x1, 0)}) = 2 · ${fmt(x1, 0)}² und subtrahiere.`,
      `f(${fmt(x1, 0)}) = ${fmt(y1, 0)}, f(${fmt(x2, 0)}) = ${fmt(y2, 0)}.`,
      `Δy = ${fmt(y2, 0)} ${MINUS} ${fmt(y1, 0)} = <strong>${fmt(dy, 0)}</strong> (im nächsten Schritt sogar ${fmt(nextDy, 0)}, da x² immer stärker wächst).`,
      { x1, x2, y1, y2, dy, nextDy },
    );
  },
};

export const STAGE_1_LESSONS = makeLessons([
  {
    id: "ft-1-zusammenhaenge",
    section: "1",
    title: "Funktionale Zusammenhänge darstellen",
    subtitle: "Tabelle, Graph und Term beschreiben dieselbe Abhängigkeit",
    whyItMatters: "Ob Stromtarif, Handyvertrag oder Temperaturverlauf: Wer zwischen Tabelle, Graph und Term wechseln kann, durchschaut Verträge und Messdaten sofort.",
    explanationHtml: `<p>In Alltag, Wirtschaft und Naturwissenschaften hängen zwei Größen oft voneinander ab – zum Beispiel der Strompreis von den verbrauchten Kilowattstunden oder die Temperatur von der Uhrzeit.</p>
<ul><li><strong>Wertetabelle:</strong> zeigt einzelne Wertepaare (x | y) übersichtlich.</li><li><strong>Graph im Koordinatensystem:</strong> macht den Verlauf auf einen Blick sichtbar.</li><li><strong>Term / Funktionsgleichung:</strong> erlaubt das schnelle Berechnen beliebiger Werte (auch in einer Tabellenkalkulation).</li></ul>
${CONCEPT_DIAGRAMS.ft1}
<div class="example"><strong>Beispiel Stromtarif:</strong> Grundgebühr 8 €, dazu 0,30 € pro kWh.<br>Als Term: K(x) = 8 + 0,30 · x.<br>Für x = 10 kWh: K(10) = 8 + 3 = 11 €.<br>Für x = 20 kWh: K(20) = 8 + 6 = 14 €.<br>Für x = 30 kWh: K(30) = 8 + 9 = 17 €.</div>
<div class="merke"><strong>Merke:</strong> Wertetabelle, Graph und Term stellen denselben funktionalen Zusammenhang dar. In einer Tabellenkalkulation stehen Eingaben in Spalte A und die Berechnungsformel in Spalte B.</div>`,
    formulas: [
      { name: "Funktionsgleichung", html: "y = Term in x &nbsp;bzw.&nbsp; f(x) = …", quantities: "x Eingabegröße, y = f(x) zugeordneter Wert" },
      { name: "Tabellenkalkulation", html: "= 8 + 0,3 * A2", quantities: "relativer Zellbezug A2 wandert beim Herunterziehen mit" },
    ],
    quiz: Q(
      "Welcher Vorteil zeichnet den Term gegenüber einer kurzen Wertetabelle aus?",
      "Man kann für jede beliebige Eingabe x den exakten Funktionswert direkt berechnen.",
      "Der Term zeigt keine Zahlen, sondern nur Farben.",
      "Eine Wertetabelle kann niemals Zahlen enthalten.",
      "Ein Term beschreibt das allgemeine Rechengesetz für alle gültigen x-Werte, während eine Tabelle immer nur eine Auswahl an Paaren zeigt.",
    ),
    lab: labFuncRepresentations,
    exercises: [exTableToTerm, exSpreadsheetValue],
    celebrationMessage: "Du verbindest Tabelle, Term und Graph sicher miteinander.",
  },
  {
    id: "ft-2-eindeutigkeit",
    section: "1",
    title: "Funktion als eindeutige Zuordnung",
    subtitle: "Wann ist eine Zuordnung eine Funktion — und wann nicht?",
    whyItMatters: "Ein Rechner oder Sensor braucht eindeutige Antworten: Zu jeder Eingabe darf höchstens ein eindeutiges Ergebnis gehören.",
    explanationHtml: `<p>Eine <strong>Funktion</strong> ist eine eindeutige Zuordnung: Jedem zulässigen x-Wert (Argument) wird <strong>genau ein</strong> y-Wert (Funktionswert) zugeordnet.</p>
<p>Im Graphen prüfst du das mit dem <strong>Senkrechtentest</strong>: Schneidet jede senkrechte Parallele zur y-Achse den Graphen <em>höchstens einmal</em>, liegt eine Funktion vor. Gibt es auch nur ein x mit zwei oder mehr y-Werten, ist die Zuordnung <em>keine</em> Funktion.</p>
${CONCEPT_DIAGRAMS.ft2}
<div class="example"><strong>Beispiel:</strong><br>• Zuordnung <em>Schüler → Körpergröße zu einem Zeitpunkt</em>: eindeutig → <strong>Funktion</strong>.<br>• Kreisgleichung x² + y² = 9: Zu x = 0 gehören y = 3 und y = −3 (zwei Schnittpunkte) → <strong>keine Funktion</strong>.<br>• Zwei verschiedene x dürfen denselben y-Wert haben (z. B. f(−2) = 4 und f(2) = 4 bei f(x) = x²).</div>
<div class="merke"><strong>Merke:</strong> Eindeutig bedeutet: Jedes x besitzt genau einen y-Wert. Umgekehrt darf ein y-Wert ruhig mehrfach getroffen werden.</div>`,
    formulas: [
      { name: "Eindeutigkeit (Funktion)", html: "x ↦ genau ein y = f(x)", quantities: "Senkrechte schneidet den Graphen höchstens 1-mal" },
      { name: "Gegenbeispiel", html: "x ↦ y₁ und y₂ (y₁ ≠ y₂)", quantities: "mindestens 2 Schnittpunkte → keine Funktion" },
    ],
    quiz: Q(
      "Woran erkennst du am Graphen sofort, dass eine Zuordnung KEINE Funktion ist?",
      "Mindestens eine senkrechte Parallele zur y-Achse schneidet den Graphen in zwei oder mehr Punkten.",
      "Mindestens eine waagrechte Parallele zur x-Achse schneidet den Graphen zweimal.",
      "Der Graph berührt die y-Achse nicht.",
      "Mehrere Punkte auf einer Senkrechten haben denselben x-Wert, aber verschiedene y-Werte — das verletzt die Eindeutigkeit.",
    ),
    lab: labVerticalLineTest,
    exercises: [exCheckRelation, exFunctionCounterexample],
    celebrationMessage: "Du erkennst Funktionen und Gegenbeispiele mit dem Senkrechtentest sofort.",
  },
  {
    id: "ft-3-fachbegriffe",
    section: "1",
    title: "Fachbegriffe: Term, Graph, Definitions- und Wertemenge",
    subtitle: "Die Sprache der Funktionen sauber auseinanderhalten",
    whyItMatters: "Definitionslücken, Intervalle und Funktionswerte tauchen ab Klasse 8 in jeder Aufgabe auf – klare Begriffe verhindern Verwechslungen.",
    explanationHtml: `<p>Rund um eine Funktion f unterscheidet man fünf präzise Begriffe:</p>
<ul><li><strong>Funktionsgleichung / Funktionsterm:</strong> Die Rechenvorschrift, z. B. f(x) = x².</li><li><strong>Definitionsmenge D:</strong> Alle zulässigen Eingaben x (z. B. D = ℚ oder D = [1; 4]).</li><li><strong>Wertemenge W:</strong> Die Menge aller Werte y = f(x), die dabei tatsächlich herauskommen.</li><li><strong>Graph G<sub>f</sub>:</strong> Die Menge aller Punkte (x | f(x)) im Koordinatensystem.</li></ul>
${CONCEPT_DIAGRAMS.ft3}
<div class="example"><strong>Beispiel:</strong> f(x) = x² mit eingeschränkter Definitionsmenge D = {1; 2; 3; 4}.<br>Rechnet man alle vier Werte aus, erhält man 1² = 1, 2² = 4, 3² = 9 und 4² = 16.<br>Also ist die Wertemenge W = {1; 4; 9; 16}.<br>Wählt man das Intervall D = [−2; 3], liefert 0 den kleinsten Wert 0 und 3 den größten Wert 9 → W = [0; 9].</div>
<div class="merke"><strong>Merke:</strong> In D stehen die erlaubten x-Werte (Eingaben auf der x-Achse), in W stehen alle tatsächlich angenommenen y-Werte (Ausgaben auf der y-Achse).</div>`,
    formulas: [
      { name: "Definitionsmenge D", html: "Menge aller zulässigen x-Werte", quantities: "ablesbar auf der waagrechten x-Achse" },
      { name: "Wertemenge W", html: "W = {f(x) | x ∈ D}", quantities: "Menge aller erreichten y-Werte auf der y-Achse" },
    ],
    quiz: Q(
      "Gegeben ist f(x) = x² auf D = [−3; 2]. Welche Wertemenge W entsteht?",
      "W = [0; 9]",
      "W = [4; 9]",
      "W = [−3; 2]",
      "Da 0 in D liegt, ist der kleinste Wert f(0) = 0; der größte entsteht bei x = −3 mit (−3)² = 9.",
    ),
    lab: labDomainRangeMapper,
    exercises: [exTermRoles, exRangeValues],
    celebrationMessage: "Du trennst Term, Graph, Definitions- und Wertemenge glasklar.",
  },
  {
    id: "ft-4-achsen-punkte",
    section: "1",
    title: "Achsenschnittpunkte und Punktprobe",
    subtitle: "Liegt ein Punkt auf dem Graphen? Wo schneidet der Graph die Achsen?",
    whyItMatters: "Die Punktprobe entscheidet rechnerisch ohne Zeichnung, ob Messwerte oder Modellpunkte exakt zusammenpassen.",
    explanationHtml: `<p><strong>Punktprobe:</strong> Um zu prüfen, ob P(x<sub>P</sub> | y<sub>P</sub>) auf dem Graphen von f liegt, setzt du x<sub>P</sub> in f(x) ein. Ergibt sich f(x<sub>P</sub>) = y<sub>P</sub>, liegt P auf G<sub>f</sub>. Ist y<sub>P</sub> &gt; f(x<sub>P</sub>), liegt P darüber; ist y<sub>P</sub> &lt; f(x<sub>P</sub>), liegt P darunter.</p>
<p><strong>Achsenschnittpunkte:</strong></p>
<ul><li><strong>y-Achse S<sub>y</sub>:</strong> Alle Punkte auf der y-Achse haben x = 0. Also berechnet man y = f(0) → S<sub>y</sub>(0 | f(0)).</li><li><strong>x-Achse S<sub>x</sub> (Nullstelle):</strong> Alle Punkte auf der x-Achse haben y = 0. Man löst f(x) = 0 nach x auf → S<sub>x</sub>(x₀ | 0).</li></ul>
${CONCEPT_DIAGRAMS.ft4}
<div class="example"><strong>Beispiel:</strong> f(x) = 2x − 4.<br>• S<sub>y</sub>: f(0) = 2 · 0 − 4 = −4 → S<sub>y</sub>(0 | −4).<br>• S<sub>x</sub>: 2x − 4 = 0 ⇒ 2x = 4 ⇒ x = 2 → S<sub>x</sub>(2 | 0).<br>• Punktprobe P(3 | 2): f(3) = 2 · 3 − 4 = 2 = y<sub>P</sub> ✓ (auf G<sub>f</sub>).<br>• Punktprobe Q(1 | 1): f(1) = 2 · 1 − 4 = −2 &lt; 1 (Q liegt oberhalb).</div>
<div class="merke"><strong>Merke:</strong> Schnitt mit der y-Achse: x = 0 einsetzen. Schnitt mit der x-Achse: f(x) = 0 setzen und nach x auflösen.</div>`,
    formulas: [
      { name: "Schnitt mit der y-Achse", html: "S<sub>y</sub>(0 | f(0))", quantities: "x = 0 in den Term einsetzen" },
      { name: "Schnitt mit der x-Achse", html: "f(x₀) = 0 ⇒ N(x₀ | 0)", quantities: "x₀ heißt Nullstelle der Funktion" },
    ],
    quiz: Q(
      "Welche Koordinaten hat der Schnittpunkt des Graphen zu f(x) = 3x − 6 mit der x-Achse?",
      "Sx(2 | 0)",
      "Sx(0 | −6)",
      "Sx(−2 | 0)",
      "Auf der x-Achse gilt y = 0: 3x − 6 = 0 liefert 3x = 6, also x = 2.",
    ),
    lab: labPointProbeAxes,
    exercises: [exPointProbe, exAxisIntercepts],
    celebrationMessage: "Du beherrschst Punktprobe und Achsenschnittpunkte graphisch und rechnerisch.",
  },
  {
    id: "ft-5-aenderung",
    section: "1",
    title: "Änderung von Funktionswerten beschreiben",
    subtitle: "Was passiert mit f(x), wenn das Argument x größer wird?",
    whyItMatters: "Zu verstehen, ob Größen gleichmäßig wachsen, fallen oder sich beschleunigen, ist der Einstieg in alle Funktionsklassen der Oberstufe.",
    explanationHtml: `<p>Verändert man das Argument x um eine Schrittweite Δx auf x + Δx, ändert sich der Funktionswert um Δy = f(x + Δx) − f(x).</p>
<ul><li><strong>Gleichmäßiges Wachstum:</strong> Bei f(x) = 2x wächst y bei jedem Schritt Δx = +2 stets um Δy = +4.</li><li><strong>Gleichmäßige Abnahme:</strong> Bei g(x) = −2x + 7 sinkt y bei jedem Schritt Δx = +2 stets um Δy = −4.</li><li><strong>Nicht lineares Wachstum:</strong> Bei h(x) = x² werden die Zuwächse von Schritt zu Schritt größer.</li></ul>
${CONCEPT_DIAGRAMS.ft5}
<div class="example"><strong>Beispiel:</strong> Von x = 1 auf x = 3 (Δx = +2):<br>• Bei f(x) = 2x: f(1) = 2, f(3) = 6 → Δy = 6 − 2 = +4.<br>• Bei g(x) = −2x + 7: g(1) = 5, g(3) = 1 → Δy = 1 − 5 = −4.</div>
<div class="merke"><strong>Merke:</strong> Δy &gt; 0 heißt, der Funktionswert nimmt zu; Δy &lt; 0 heißt, er nimmt ab. Nur bei Geraden bleibt Δy für feste Schritte Δx überall gleich.</div>`,
    formulas: [
      { name: "Änderung von f", html: "Δy = f(x + Δx) − f(x)", quantities: "Δx Schrittweite des Arguments" },
    ],
    quiz: Q(
      "Bei welcher Funktion bleibt die Änderung Δy bei jedem Schritt Δx = +1 unabhängig von x immer gleich?",
      "f(x) = 3x − 2",
      "g(x) = x²",
      "h(x) = 12 / x",
      "Bei f(x) = 3x − 2 wächst der Wert bei jedem +1-Schritt um exakt +3; bei x² und 12/x hängen die Differenzen von x ab.",
    ),
    lab: labValueChangeExplorer,
    exercises: [exValueChangeLinear, exGrowthInterpret],
    celebrationMessage: "Etappe 1 geschafft: Du liest und beschreibst Funktionen sicher!",
  },
]);
