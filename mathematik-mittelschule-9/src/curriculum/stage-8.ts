import { fmt, fmtUnit, linear, MINUS, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { relationKind, SITUATIONS } from "../lab/views-funktionen";
import { BOTH, choice, lab, M_ONLY, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(8, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");
const euro = (value: number) => fmtUnit(value, "€", 2);
const KINDS = ["proportional", "umgekehrt proportional", "linear, nicht proportional", "nicht linear"];

/** A table of five pairs as HTML. */
function tableHtml(xs: number[], ys: number[], xName = "x", yName = "y"): string {
  return `<table class="mini"><tr><th>${xName}</th>${xs.map((x) => `<td>${fmt(x, 2)}</td>`).join("")}</tr><tr><th>${yName}</th>${ys.map((y) => `<td>${fmt(y, 2)}</td>`).join("")}</tr></table>`;
}

/** A table of a random relation of the given kind. */
function relationTable(rng: Rng, kind: number) {
  const step = rng.pick([1, 2]);
  const xs = [1, 2, 3, 4, 5].map((x) => x * step);
  if (kind === 0) {
    const k = rng.pick([1.5, 2, 2.5, 3, 4]);
    return { xs, ys: xs.map((x) => k * x), detail: `y : x = ${fmt(k)} bleibt gleich` };
  }
  if (kind === 1) {
    const k = rng.pick([24, 60, 120]);
    return { xs, ys: xs.map((x) => k / x), detail: `x · y = ${k} bleibt gleich` };
  }
  if (kind === 2) {
    const m = rng.pick([2, 3, 5]);
    const t = rng.pick([1, 4, 6]);
    return { xs, ys: xs.map((x) => m * x + t), detail: `gleiche Zunahme, aber y : x nicht gleich (y = ${m}x + ${t})` };
  }
  return { xs, ys: xs.map((x) => x * x), detail: "die Zunahme wird immer größer (y = x²)" };
}

// 8.1 Zuordnungen unterscheiden ────────────────────────────────────────────

const zuordnungen = L({
  id: "fu-1-zuordnungen",
  title: "Zuordnungen unterscheiden",
  subtitle: "Proportional, umgekehrt proportional, linear, nicht linear",
  tracks: BOTH,
  whyItMatters:
    "Kostet die doppelte Menge doppelt so viel? Dauert die Fahrt bei doppeltem Tempo halb so lang? Wer die Art einer Zuordnung erkennt, weiß sofort, wie er rechnen darf, und fällt nicht auf falsche Dreisätze herein.",
  explanationHtml: `
    <p>Eine Zuordnung ordnet jedem x-Wert genau einen y-Wert zu. In Tabelle und Graph erkennst du ihre Art:</p>
    <table class="mini">
      <tr><th>Art</th><th>Tabelle</th><th>Graph</th></tr>
      <tr><td><strong>proportional</strong></td><td>Quotient y : x immer gleich; doppeltes x, doppeltes y</td><td>Gerade durch den Ursprung</td></tr>
      <tr><td><strong>umgekehrt proportional</strong></td><td>Produkt x · y immer gleich; doppeltes x, halbes y</td><td>Hyperbel, fällt, berührt die Achsen nie</td></tr>
      <tr><td><strong>linear</strong></td><td>gleiche Zunahme bei gleichen Schritten</td><td>Gerade, meist nicht durch den Ursprung</td></tr>
      <tr><td><strong>nicht linear</strong></td><td>ungleiche Zunahme</td><td>gekrümmte Linie</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> Äpfel zu 2,50 € pro kg: 2 kg kosten 5 €, 4 kg 10 €. Proportional.<br>
    Ein Taxi kostet 3 € Grundgebühr und 2 € pro km: 1 km 5 €, 2 km 7 €, 4 km 11 €. Gleiche Zunahme, aber 4 km kosten nicht doppelt so viel wie 2 km: linear, nicht proportional.<br>
    12 € werden gerecht geteilt: 2 Personen 6 €, 4 Personen 3 €. Umgekehrt proportional.<br>
    Quadrat: Seite 2 cm, Fläche 4 cm²; Seite 4 cm, Fläche 16 cm². Nicht linear.</div>
    <div class="merke"><strong>Merke:</strong> Prüfe in der Tabelle Quotient, Produkt und Zunahme. Proportional heißt Quotient gleich, umgekehrt proportional heißt Produkt gleich. Jede proportionale Zuordnung ist auch linear, aber nicht umgekehrt.</div>
  `,
  formulas: [
    { name: "Proportional", html: "y = k · x", quantities: "y : x = k bleibt gleich" },
    { name: "Umgekehrt proportional", html: "y = k : x", quantities: "x · y = k bleibt gleich" },
    { name: "Linear", html: "y = m · x + t", quantities: "gleiche Zunahme m pro Schritt 1" },
  ],
  quiz: {
    question: "Ein Handytarif kostet 5 € im Monat und 9 Cent pro Minute. Welche Art von Zuordnung ist Minuten → Kosten?",
    options: ["linear, aber nicht proportional", "proportional", "umgekehrt proportional", "nicht linear"],
    correctIndex: 0,
    explanation: "Jede Minute kostet gleich viel mehr: linear. Wegen der Grundgebühr kosten doppelt so viele Minuten nicht doppelt so viel, also nicht proportional.",
  },
  lab: lab(
    "relation-types",
    "Tabelle und Graph",
    "Wähle eine Situation. Die Tabelle zeigt Quotient oder Produkt und die Zunahme, der Graph die Form. Beim Taxi kannst du Kilometerpreis m und Grundgebühr t verändern.",
    [choice("sit", "Situation", SITUATIONS.map((s) => s.name), 0), r("m", "Preis je km bzw. kg", 0.5, 3, 1.5, 0.5, "€"), r("t", "Grundgebühr (nur Taxi)", 0, 6, 3, 1, "€")],
    [
      o("art", "Art der Zuordnung", (v) => relationKind(v.sit, v.t), "", 0, true),
      o("y4", "y bei x = 4", (v) => SITUATIONS[v.sit].rule(4, v.m, v.t), "", 2),
    ],
    [
      { id: "taxi-proportional", text: "Mache den Taxitarif proportional.", check: (v) => v.sit === 0 && v.t === 0 },
      { id: "produkt", text: "Finde die Situation, in der das Produkt x · y gleich bleibt.", check: (v) => v.sit === 1 },
      { id: "zunahme", text: "Finde die Situation, deren Zunahme von Zeile zu Zeile immer größer wird.", check: (v) => v.sit === 2 },
    ],
  ),
  exercises: [
    {
      id: "erkennen",
      make: (rng, level) => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          const { xs, ys, detail } = relationTable(rng, kind);
          return task(
            level,
            `Welche Art von Zuordnung zeigt die Tabelle? Berechne dazu auch den y-Wert für x = ${xs[4] * 2}.`,
            [choiceField("Art:", KINDS, kind), num(`y für x = ${xs[4] * 2}:`, kind === 0 ? (ys[0] / xs[0]) * xs[4] * 2 : kind === 1 ? (xs[0] * ys[0]) / (xs[4] * 2) : kind === 2 ? ((ys[1] - ys[0]) / (xs[1] - xs[0])) * xs[4] * 2 + (ys[0] - ((ys[1] - ys[0]) / (xs[1] - xs[0])) * xs[0]) : (xs[4] * 2) ** 2, "", 2)],
            "Prüfe Quotient y : x, Produkt x · y und die Zunahme von Spalte zu Spalte.",
            [detail],
            `${KINDS[kind]}`,
            { kind },
            [tableHtml(xs, ys)],
          );
        }
        const cases = [
          { text: "Ein Kino verkauft Karten zu je 9 €. Anzahl der Karten → Preis.", kind: 0 },
          { text: "Eine Strecke von 240 km wird mit verschiedenem Tempo gefahren. Tempo → Fahrzeit.", kind: 1 },
          { text: "Ein Fitnessstudio kostet 20 € Aufnahmegebühr und 25 € pro Monat. Monate → Gesamtkosten.", kind: 2 },
          { text: "Ein Würfel wird größer. Kantenlänge → Volumen.", kind: 3 },
          { text: "Ein Futtervorrat reicht für eine bestimmte Zeit. Anzahl der Tiere → Anzahl der Tage.", kind: 1 },
          { text: "Eine Kerze ist 20 cm hoch und brennt pro Stunde 2 cm ab. Brenndauer → Höhe.", kind: 2 },
          { text: "Ein Kapital wird mit Zinseszins angelegt. Jahre → Kontostand.", kind: 3 },
          { text: "Stoff kostet 7,50 € pro Meter. Länge → Preis.", kind: 0 },
        ];
        const c = rng.pick(cases);
        const factor = rng.pick([2, 3]);
        return task(
          level,
          `${c.text} Welche Art von Zuordnung liegt vor? Was passiert mit dem zweiten Wert, wenn der erste ${factor === 2 ? "verdoppelt" : "verdreifacht"} wird?`,
          [
            choiceField("Art:", KINDS, c.kind),
            choiceField("Der zweite Wert …", [`wird ${factor === 2 ? "verdoppelt" : "verdreifacht"}`, `wird ${factor === 2 ? "halbiert" : "gedrittelt"}`, `ändert sich anders`], c.kind === 0 ? 0 : c.kind === 1 ? 1 : 2),
          ],
          "Proportional: mal k → mal k. Umgekehrt proportional: mal k → durch k. Bei linearen Zuordnungen mit Startwert und bei nicht linearen geht beides nicht.",
          [`Die Zuordnung ist ${KINDS[c.kind]}.`],
          KINDS[c.kind],
          { kind: c.kind },
        );
      },
    },
    {
      id: "darstellen",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([1.5, 2, 2.5, 3]);
          const t = rng.pick([2, 3, 4, 5]);
          const x1 = rng.int(3, 8);
          const x2 = x1 + rng.int(2, 6);
          return task(
            level,
            `Ein Taxi kostet ${euro(t)} Grundgebühr und ${euro(m)} pro km. Ergänze die Wertetabelle: Was kosten ${x1} km und ${x2} km? Ist die Zuordnung proportional?`,
            [num(`${x1} km:`, m * x1 + t, "€", 2, { slips: [{ value: m * x1, hint: "Die Grundgebühr kommt noch dazu." }] }), num(`${x2} km:`, m * x2 + t, "€", 2), choiceField("proportional?", ["nein", "ja"], 0)],
            "Preis = Grundgebühr + Kilometerpreis · Strecke.",
            [`${fmt(t)} + ${fmt(m)} · ${x1} = ${fmt(m * x1 + t)}`, `${fmt(t)} + ${fmt(m)} · ${x2} = ${fmt(m * x2 + t)}`, "Wegen der Grundgebühr ist der Quotient nicht gleich: linear, nicht proportional."],
            `${euro(m * x1 + t)} und ${euro(m * x2 + t)}; nicht proportional`,
            { m, t },
          );
        }
        const pieces = rng.pick([8, 12, 24, 36]);
        const people = rng.pick([2, 3, 4, 6].filter((n) => pieces % n === 0));
        const more = rng.pick([2, 3]) * people;
        return task(
          level,
          `Eine Packung mit ${pieces} Müsliriegeln wird gerecht aufgeteilt. Bei ${people} Kindern bekommt jedes ${pieces / people} Riegel. Wie viele bekommt jedes bei ${more} Kindern? Welcher Graph passt: eine fallende Gerade, eine Hyperbel oder eine Ursprungsgerade?`,
          [num("Riegel je Kind:", pieces / more, "", 2, { slips: [{ value: (pieces / people) * (more / people), hint: "Mehr Kinder heißt weniger Riegel für jedes: umgekehrt proportional." }] }), choiceField("Graph:", ["Hyperbel", "fallende Gerade", "Ursprungsgerade"], 0)],
          "Das Produkt Kinder · Riegel je Kind bleibt gleich: umgekehrt proportional.",
          [`Produkt: ${people} · ${pieces / people} = ${pieces}`, `${pieces} : ${more} = ${fmt(pieces / more, 2)}`],
          `${fmt(pieces / more, 2)} Riegel je Kind; Hyperbel`,
          { pieces, people },
        );
      },
    },
  ],
});

// 8.2 Fehlende Werte berechnen und ablesen ─────────────────────────────────

const fehlend = L({
  id: "fu-2-fehlende-werte",
  title: "Fehlende Werte berechnen und ablesen",
  subtitle: "Dreisatz, Graph und Tabellenkalkulation",
  tracks: BOTH,
  whyItMatters:
    "Wie teuer werden 7 kg, wenn 4 kg 6 € kosten? Wie lange brauchen 4 Bagger, wenn 3 Bagger 12 Tage brauchen? Mit dem passenden Dreisatz, am Graphen oder mit einer Formel in der Tabellenkalkulation findest du fehlende Werte.",
  explanationHtml: `
    <p>Erst die Art der Zuordnung bestimmen, dann rechnen:</p>
    <ul>
      <li><strong>Proportional:</strong> Dreisatz über 1: 4 kg → 6 €, 1 kg → 1,50 €, 7 kg → 10,50 €.</li>
      <li><strong>Umgekehrt proportional:</strong> 3 Bagger → 12 Tage, 1 Bagger → 36 Tage (mal 3), 4 Bagger → 9 Tage (durch 4).</li>
      <li><strong>Linear:</strong> Startwert plus gleiche Zunahme: Grundgebühr 5 € und 0,09 € pro Minute, also 120 Minuten: 5 + 0,09 · 120 = 15,80 €.</li>
    </ul>
    <p><strong>Zeichnerisch:</strong> Am Graphen beim gegebenen x senkrecht hoch bis zum Graphen und waagrecht zur y-Achse ablesen. Ablesen ist schnell, aber nur so genau wie die Zeichnung.</p>
    <p><strong>Tabellenkalkulation:</strong> In Spalte A stehen die x-Werte, in B eine Formel, zum Beispiel <code>=5+0,09*A2</code>. Die Formel wird nach unten kopiert und rechnet jeden Wert aus.</p>
    <div class="example"><strong>Beispiel:</strong> 6 Arbeiter streichen ein Haus in 10 Tagen. Wie lange brauchen 4? Umgekehrt proportional: 6 · 10 = 60 Arbeitstage, 60 : 4 = 15 Tage.</div>
    <div class="merke"><strong>Merke:</strong> Proportional: Quotient bleibt gleich, also y₂ = y₁ : x₁ · x₂. Umgekehrt proportional: Produkt bleibt gleich, also y₂ = x₁ · y₁ : x₂. Prüfe immer, ob das Ergebnis zur Situation passt.</div>
  `,
  formulas: [
    { name: "Proportional", html: "y₂ = y₁ : x₁ · x₂", quantities: "Dreisatz über die Einheit 1" },
    { name: "Umgekehrt proportional", html: "y₂ = x₁ · y₁ : x₂", quantities: "das Produkt bleibt gleich" },
  ],
  quiz: {
    question: "5 Pumpen leeren ein Becken in 8 Stunden. Wie lange brauchen 2 Pumpen?",
    options: ["20 Stunden", "3,2 Stunden", "16 Stunden", "5 Stunden"],
    correctIndex: 0,
    explanation: "Umgekehrt proportional: 5 · 8 = 40 Pumpenstunden, 40 : 2 = 20 Stunden. 3,2 Stunden wäre der falsche, proportionale Dreisatz.",
  },
  lab: lab(
    "missing-values",
    "Dreisatz am Graphen",
    "Ein Wertepaar ist bekannt (blauer Punkt). Ziehe den Punkt auf dem Graphen zum gesuchten x-Wert. Rechts siehst du dieselbe Rechnung in einer Tabellenkalkulation.",
    [choice("kind", "Zuordnung", ["proportional", "umgekehrt proportional"], 0), r("x1", "bekanntes x₁", 1, 10, 4, 1), r("y1", "bekanntes y₁", 1, 24, 6, 1), r("x2", "gesuchtes x₂", 0.5, 10, 2, 0.5)],
    [o("y2", "gesuchtes y₂", (v) => (v.kind === 0 ? (v.y1 / v.x1) * v.x2 : (v.x1 * v.y1) / v.x2), "", 2, true)],
    [
      { id: "aepfel", text: "4 kg Äpfel kosten 6 €. Stelle den Preis für 7 kg ein.", check: (v) => v.kind === 0 && v.x1 === 4 && v.y1 === 6 && v.x2 === 7 },
      { id: "bagger", text: "3 Bagger brauchen 12 Tage. Stelle ein, wie lange 4 Bagger brauchen.", check: (v) => v.kind === 1 && v.x1 === 3 && v.y1 === 12 && v.x2 === 4 },
      { id: "doppelt", text: "Zeige bei einer umgekehrt proportionalen Zuordnung: doppeltes x, halbes y.", check: (v) => v.kind === 1 && near(v.x2, 2 * v.x1) },
    ],
  ),
  exercises: [
    {
      id: "dreisatz",
      make: (rng, level) => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const unit = rng.pick([1.2, 1.5, 2.5, 3.2, 4]);
            const x1 = rng.int(2, 8);
            const x2 = rng.int(2, 12);
            return task(
              level,
              `${x1} kg Tomaten kosten ${euro(unit * x1)}. Was kosten ${x2} kg? Die Zuordnung ist proportional.`,
              [num("Preis:", unit * x2, "€", 2, { slips: [{ value: (unit * x1 * x1) / x2, hint: "Proportional: mehr kg, mehr Geld. Rechne über 1 kg." }] })],
              "Dreisatz: erst 1 kg, dann die gesuchte Menge.",
              [`1 kg: ${euro(unit * x1)} : ${x1} = ${euro(unit)}`, `${x2} kg: ${x2} · ${euro(unit)}`],
              `${euro(unit * x2)}`,
              { unit, x1, x2 },
            );
          }
          const days = rng.pick([6, 8, 10, 12, 15]);
          const workers = rng.pick([2, 3, 4, 5, 6]);
          const total = days * workers;
          const others = rng.pick([2, 3, 4, 5, 6, 8, 10, 12].filter((n) => n !== workers && total % n === 0));
          return task(
            level,
            `${workers} Arbeiter brauchen für einen Auftrag ${days} Tage. Wie lange brauchen ${others} Arbeiter? Die Zuordnung ist umgekehrt proportional.`,
            [num("Tage:", total / others, "", 2, { slips: [{ value: (days / workers) * others, hint: "Mehr Arbeiter brauchen weniger Tage: umgekehrt proportional, das Produkt bleibt gleich." }] })],
            "Produkt bleibt gleich: Arbeiter · Tage = konstant.",
            [`${workers} · ${days} = ${total} Arbeitstage`, `${total} : ${others}`],
            `${fmt(total / others, 2)} Tage`,
            { days, workers, others },
          );
        }
        const base = rng.pick([4.99, 7.5, 9.99, 12]);
        const per = rng.pick([0.05, 0.08, 0.09, 0.12]);
        const minutes = 10 * rng.int(6, 30);
        return task(
          level,
          `Ein Handytarif kostet ${euro(base)} Grundgebühr im Monat und ${fmt(per * 100)} Cent pro Minute. In einer Tabellenkalkulation stehen die Minuten in Spalte A. Welche Formel gehört in B2? Was berechnet sie für ${minutes} Minuten?`,
          [choiceField("Formel in B2:", [`=${fmt(base)}+${fmt(per)}*A2`, `=${fmt(per)}*A2`, `=(${fmt(base)}+${fmt(per)})*A2`], 0), num("Kosten:", base + per * minutes, "€", 2, { slips: [{ value: per * minutes, hint: "Die Grundgebühr kommt noch dazu." }] })],
          "Linear: Grundgebühr + Preis pro Minute · Minuten.",
          [`B2: =${fmt(base)}+${fmt(per)}*A2`, `${euro(base)} + ${fmt(per)} € · ${minutes} = ${euro(base + per * minutes)}`],
          `${euro(base + per * minutes)}`,
          { base, per, minutes },
        );
      },
    },
    {
      id: "ablesen",
      make: (rng, level) => {
        const m = rng.pick([0.5, 1, 1.5, 2]);
        const t = rng.pick([1, 2, 3, 4]);
        const svg = () => {
          const W = 300;
          const H = 180;
          const X = (x: number) => 30 + (x / 10) * 260;
          const Y = (y: number) => 160 - (y / 25) * 150;
          let out = `<svg class="task-chart" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Gerade y = ${linear(m, t)}">`;
          for (let x = 0; x <= 10; x++) out += `<line x1="${X(x)}" y1="10" x2="${X(x)}" y2="160" class="lab-grid"/><text x="${X(x)}" y="174" class="lab-text-tick" text-anchor="middle">${x}</text>`;
          for (let y = 0; y <= 25; y += 5) out += `<line x1="30" y1="${Y(y)}" x2="290" y2="${Y(y)}" class="lab-grid"/><text x="24" y="${Y(y) + 4}" class="lab-text-tick" text-anchor="end">${y}</text>`;
          out += `<line x1="${X(0)}" y1="${Y(t)}" x2="${X(10)}" y2="${Y(m * 10 + t)}" class="lab-curve"/>`;
          return `${out}</svg>`;
        };
        const x = rng.int(2, 9);
        if (level === 1)
          return task(
            level,
            `Lies am Graphen ab: Welcher y-Wert gehört zu x = ${x}? Welcher x-Wert gehört zu y = ${fmt(m * 8 + t)}?${svg()}`,
            [num("y =", m * x + t, "", 2), num("x =", 8, "", 2)],
            "Senkrecht von der x-Achse zum Graphen, dann waagrecht zur y-Achse; für x umgekehrt.",
            [`bei x = ${x}: y ${eq(m * x + t)} ${fmt(m * x + t)}`, `bei y = ${fmt(m * 8 + t)}: x = 8`],
            `y ≈ ${fmt(m * x + t)}, x ≈ 8`,
            { m, t, x },
          );
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} spart: Am Anfang hat ${name} ${t} · 10 €, jede Woche kommen ${fmt(m)} · 10 € dazu. Der Graph zeigt den Kontostand in 10 € (y) nach x Wochen. Wie viel Euro hat ${name} nach ${x} Wochen? Nach wie vielen Wochen sind es ${fmt((m * 8 + t) * 10)} €?${svg()}`,
          [num("Betrag:", (m * x + t) * 10, "€", 2, { slips: [{ value: m * x + t, hint: "Der Graph zeigt Zehner: mal 10 nehmen." }] }), num("Wochen:", 8, "", 0)],
          "Ablesen und die Einheit 10 € beachten. Zur Kontrolle rechnen: Startwert + Zunahme · Wochen.",
          [`y bei x = ${x}: ${fmt(m * x + t)}, also ${fmt((m * x + t) * 10)} €`, `y = ${fmt(m * 8 + t)} bei x = 8`],
          `${euro((m * x + t) * 10)}; nach 8 Wochen`,
          { m, t, x },
        );
      },
    },
  ],
});

// 8.3 Lineare Funktionen (M9) ──────────────────────────────────────────────

const lineare = L({
  id: "fu-3-lineare-funktion",
  title: "Lineare Funktionen y = mx + t",
  subtitle: "Steigung, y-Achsenabschnitt, Graph und Maßstab",
  tracks: M_ONLY,
  whyItMatters:
    "Tarife, Füllstände und Kosten mit Grundgebühr folgen linearen Funktionen. Wer m und t abliest und den Graphen mit einem passenden Maßstab zeichnet, kann Werte schnell vergleichen und vorhersagen.",
  explanationHtml: `
    <p>Eine <strong>lineare Funktion</strong> hat die Gleichung y = mx + t (Wiederholung aus Klasse 8). Ihr Graph ist eine Gerade.</p>
    <ul>
      <li><strong>t</strong> ist der <strong>y-Achsenabschnitt</strong>: Die Gerade schneidet die y-Achse im Punkt (0 | t).</li>
      <li><strong>m</strong> ist die <strong>Steigung</strong>: Gehst du 1 nach rechts, geht die Gerade um m nach oben (bei m &lt; 0 nach unten). Aus zwei Punkten: m = (y₂ − y₁) : (x₂ − x₁).</li>
    </ul>
    <p><strong>Zeichnen:</strong> Punkt (0 | t) eintragen, mit dem Steigungsdreieck einen zweiten Punkt finden, Gerade durchziehen. Wähle den <strong>Maßstab</strong> so, dass alle wichtigen Werte aufs Blatt passen, etwa 1 cm für 10 € bei Preisen bis 100 €.</p>
    <div class="example"><strong>Beispiel:</strong> y = 2x − 3: Start bei (0 | −3), 1 nach rechts, 2 nach oben: (1 | −1). Bei x = 4 ist y = 5.<br>
    Zwei Punkte P(2 | 5) und Q(4 | 9): m = (9 − 5) : (4 − 2) = 2. Einsetzen: 5 = 2 · 2 + t, also t = 1 und y = 2x + 1.</div>
    <div class="merke"><strong>Merke:</strong> y = mx + t: t ablesen am Schnitt mit der y-Achse, m mit dem Steigungsdreieck. m &gt; 0 steigt, m &lt; 0 fällt, m = 0 ist waagrecht.</div>
  `,
  formulas: [
    { name: "Lineare Funktion", html: "y = m · x + t", quantities: "m Steigung, t y-Achsenabschnitt" },
    { name: "Steigung aus zwei Punkten", html: "m = (y₂ − y₁) : (x₂ − x₁)", quantities: "P(x₁ | y₁), Q(x₂ | y₂)" },
  ],
  quiz: {
    question: "Welche Gerade geht durch (0 | 4) und fällt, wenn man nach rechts geht?",
    options: ["y = −0,5x + 4", "y = 0,5x + 4", "y = 4x − 0,5", "y = −4x"],
    correctIndex: 0,
    explanation: "Der y-Achsenabschnitt ist 4, und fallend heißt m < 0. Nur y = −0,5x + 4 erfüllt beides.",
  },
  lab: lab(
    "line-mx-t",
    "Steigung und Achsenabschnitt",
    "Verändere m und t oder ziehe den Punkt auf der y-Achse. Das Steigungsdreieck zeigt: 1 nach rechts, m nach oben.",
    [r("m", "Steigung m", -3, 3, 1, 0.5), r("t", "y-Achsenabschnitt t", -5, 5, 0, 1)],
    [o("gleichung", "Gleichung", (v) => `y = ${linear(v.m, v.t)}`, "", 0, true), o("nullstelle", "Schnitt mit der x-Achse", (v) => (v.m === 0 ? (v.t === 0 ? "überall" : "keiner") : `x = ${fmt(-v.t / v.m, 2)}`))],
    [
      { id: "punkte", text: "Stelle die Gerade durch P(2 | 5) und Q(4 | 9) ein.", check: (v) => v.m === 2 && v.t === 1 },
      { id: "nullstelle", text: "Stelle eine fallende Gerade ein, die die y-Achse bei 4 und die x-Achse bei 2 schneidet.", check: (v) => v.m === -2 && v.t === 4 },
      { id: "waagrecht", text: "Stelle eine waagrechte Gerade durch (0 | −3) ein.", check: (v) => v.m === 0 && v.t === -3 },
    ],
  ),
  exercises: [
    {
      id: "werte",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([-3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3]);
          const t = rng.int(-5, 5);
          const x = rng.int(-4, 6);
          const y = rng.int(-6, 8);
          const xForY = (y - t) / m;
          return task(
            level,
            `Gegeben ist y = ${linear(m, t)}. Berechne y für x = ${fmt(x)} und x für y = ${fmt(y)}.`,
            [num("y =", m * x + t, "", 2), num("x =", xForY, "", 2, { slips: [{ value: m * y + t, hint: "Hier ist y gegeben: Setze ein und löse nach x auf." }] })],
            "Einsetzen. Für x: y = mx + t nach x auflösen, x = (y − t) : m.",
            [`y = ${fmt(m)} · ${x < 0 ? `(${fmt(x)})` : fmt(x)} ${t < 0 ? MINUS : "+"} ${fmt(Math.abs(t))} = ${fmt(m * x + t)}`, `${fmt(y)} = ${linear(m, t)} ⇒ x = (${fmt(y)} ${t < 0 ? "+" : MINUS} ${fmt(Math.abs(t))}) : ${m < 0 ? `(${fmt(m)})` : fmt(m)}`],
            `y = ${fmt(m * x + t)}, x ${eq(xForY)} ${fmt(xForY, 2)}`,
            { m, t },
          );
        }
        const base = rng.pick([3, 3.5, 4, 4.5]);
        const perKm = rng.pick([1.8, 2, 2.2, 2.4]);
        const km = rng.int(4, 20);
        const total = base + perKm * rng.int(5, 25);
        return task(
          level,
          `Eine Taxifahrt kostet ${euro(base)} Grundgebühr und ${euro(perKm)} pro km. Gib die Funktionsgleichung an (x in km, y in €). Was kostet eine Fahrt von ${km} km? Wie weit kommt man für ${euro(total)}?`,
          [num("m =", perKm, "", 2), num("t =", base, "", 2), num(`Preis für ${km} km:`, base + perKm * km, "€", 2), num("Strecke:", (total - base) / perKm, "km", 2, { slips: [{ value: total / perKm, hint: "Ziehe zuerst die Grundgebühr ab." }] })],
          "Grundgebühr = t, Preis pro km = m. Für die Strecke: (y − t) : m.",
          [`y = ${fmt(perKm)}x + ${fmt(base)}`, `${fmt(perKm)} · ${km} + ${fmt(base)} = ${fmt(base + perKm * km)}`, `(${fmt(total)} − ${fmt(base)}) : ${fmt(perKm)} = ${fmt((total - base) / perKm, 2)}`],
          `y = ${fmt(perKm)}x + ${fmt(base)}; ${euro(base + perKm * km)}; ${fmt((total - base) / perKm, 2)} km`,
          { base, perKm },
        );
      },
    },
    {
      id: "zwei-punkte",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]);
          const t = rng.int(-6, 6);
          const x1 = rng.int(-4, 2);
          const x2 = x1 + rng.pick([2, 4]);
          return task(
            level,
            `Eine Gerade geht durch P(${fmt(x1)} | ${fmt(m * x1 + t)}) und Q(${fmt(x2)} | ${fmt(m * x2 + t)}). Bestimme m und t.`,
            [num("m =", m, "", 2, { slips: [{ value: 1 / m, hint: "m = Unterschied der y-Werte : Unterschied der x-Werte, nicht umgekehrt." }] }), num("t =", t, "", 2)],
            "m = (y₂ − y₁) : (x₂ − x₁); dann einen Punkt einsetzen und t ausrechnen.",
            [`m = (${fmt(m * x2 + t)} − ${m * x1 + t < 0 ? `(${fmt(m * x1 + t)})` : fmt(m * x1 + t)}) : (${fmt(x2)} − ${x1 < 0 ? `(${fmt(x1)})` : fmt(x1)}) = ${fmt(m)}`, `${fmt(m * x1 + t)} = ${fmt(m)} · ${x1 < 0 ? `(${fmt(x1)})` : fmt(x1)} + t ⇒ t = ${fmt(t)}`],
            `y = ${linear(m, t)}`,
            { m, t },
          );
        }
        const start = rng.pick([20, 24, 30]);
        const rate = rng.pick([1.5, 2, 2.5, 3]);
        const h1 = rng.int(1, 3);
        const h2 = h1 + rng.int(2, 4);
        return task(
          level,
          `Eine Kerze ist nach ${h1} Stunden noch ${fmtUnit(start - rate * h1, "cm")} hoch, nach ${h2} Stunden noch ${fmtUnit(start - rate * h2, "cm")}. Sie brennt gleichmäßig ab. Wie hoch war sie am Anfang, und nach wie vielen Stunden ist sie abgebrannt?`,
          [num("Anfang:", start, "cm", 2), num("abgebrannt nach:", start / rate, "h", 2, { slips: [{ value: start, hint: "Teile die Anfangshöhe durch die Abnahme pro Stunde." }] })],
          "Steigung = Änderung der Höhe pro Stunde (negativ). t ist die Höhe bei 0 Stunden. Abgebrannt bei y = 0.",
          [`m = (${fmt(start - rate * h2)} − ${fmt(start - rate * h1)}) : (${h2} − ${h1}) = ${fmt(-rate)}`, `t = ${fmt(start - rate * h1)} + ${fmt(rate)} · ${h1} = ${fmt(start)}`, `0 = ${fmt(-rate)}x + ${fmt(start)} ⇒ x = ${fmt(start / rate, 2)}`],
          `Anfangs ${fmtUnit(start, "cm")}, abgebrannt nach ${fmtUnit(start / rate, "h")}`,
          { start, rate },
        );
      },
    },
  ],
});

// 8.4 Umgekehrt proportionale Funktionen (M9) ──────────────────────────────

const umgekehrt = L({
  id: "fu-4-umgekehrt-proportional",
  title: "Umgekehrt proportionale Funktionen y = k : x",
  subtitle: "Produkt gleich, Graph eine Hyperbel",
  tracks: M_ONLY,
  whyItMatters:
    "Fahrzeit und Tempo, Arbeitskräfte und Dauer, Länge und Breite bei gleicher Fläche: Wenn das Produkt gleich bleibt, beschreibt y = k : x die Abhängigkeit. Mit der Gleichung rechnest du jeden Wert aus.",
  explanationHtml: `
    <p>Bei einer umgekehrt proportionalen Zuordnung ist das Produkt x · y immer gleich, nennen wir es k. Dann gilt die Funktionsgleichung</p>
    <p class="formula-line">y = k : x (x ≠ 0)</p>
    <p>Ihr Graph ist eine <strong>Hyperbel</strong>: Sie fällt, kommt den Achsen immer näher, berührt sie aber nie. Doppeltes x heißt halbes y.</p>
    <p>k bestimmst du aus einem bekannten Wertepaar: k = x · y. Anschaulich ist k der Flächeninhalt aller Rechtecke mit den Seiten x und y.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Strecke von 120 km: Bei 60 km/h dauert die Fahrt 2 h. k = 60 · 2 = 120, also y = 120 : x. Bei 80 km/h: y = 120 : 80 = 1,5 h.<br>
    Der Graph von y = 24 : x geht durch (2 | 12), (3 | 8), (4 | 6) und (6 | 4).</div>
    <div class="merke"><strong>Merke:</strong> Umgekehrt proportional: y = k : x mit k = x · y. Der Graph ist eine Hyperbel. Vergleiche: proportional y = k · x ist eine Gerade durch den Ursprung, linear y = mx + t eine Gerade.</div>
  `,
  formulas: [
    { name: "Umgekehrt proportionale Funktion", html: "y = k : x", quantities: "k = x · y, x ≠ 0" },
  ],
  quiz: {
    question: "Der Graph von y = k : x geht durch (4 | 5). Welchen Wert hat y bei x = 10?",
    options: ["2", "12,5", "11", "50"],
    correctIndex: 0,
    explanation: "k = 4 · 5 = 20, also y = 20 : 10 = 2. 12,5 wäre die proportionale Rechnung.",
  },
  lab: lab(
    "hyperbola-rect",
    "Rechtecke mit gleichem Flächeninhalt",
    "Alle Rechtecke haben den Flächeninhalt k. Ziehe die Ecke: Die Ecke läuft auf der Hyperbel y = k : x.",
    [r("k", "Flächeninhalt k", 2, 48, 12, 2), r("x", "Breite x", 0.5, 12, 2, 0.5)],
    [o("y", "Höhe y = k : x", (v) => v.k / v.x, "", 2, true), o("produkt", "x · y", (v) => v.k, "", 2)],
    [
      { id: "quadrat", text: "Mache das Rechteck zum Quadrat.", check: (v) => near(v.x * v.x, v.k) },
      { id: "punkt", text: "Stelle k so ein, dass die Hyperbel durch (3 | 8) geht, und lege die Ecke dorthin.", check: (v) => v.k === 24 && v.x === 3 },
      { id: "halb", text: "Bei k = 12: Verdopple die Breite vom Start (x = 2). Die Höhe halbiert sich.", check: (v) => v.k === 12 && v.x === 4 },
    ],
  ),
  exercises: [
    {
      id: "gleichung",
      make: (rng, level) => {
        if (level === 1) {
          const x1 = rng.int(2, 8);
          const y1 = rng.int(2, 9);
          const k = x1 * y1;
          const x2 = rng.pick([1, 2, 3, 4, 5, 6, 8, 10, 12].filter((x) => x !== x1));
          return task(
            level,
            `Der Graph einer umgekehrt proportionalen Funktion geht durch P(${x1} | ${y1}). Bestimme k und berechne y für x = ${x2}.`,
            [num("k =", k, "", 2, { slips: [{ value: y1 / x1, hint: "Bei umgekehrter Proportionalität ist das Produkt x · y gleich, nicht der Quotient." }] }), num("y =", k / x2, "", 2, { slips: [{ value: (y1 / x1) * x2, hint: "Das wäre proportional. Hier gilt y = k : x." }] })],
            "k = x · y, dann y = k : x.",
            [`k = ${x1} · ${y1} = ${k}`, `y = ${k} : ${x2}`],
            `k = ${k}, y ${eq(k / x2)} ${fmt(k / x2, 2)}`,
            { k, x2 },
          );
        }
        const distance = rng.pick([120, 180, 240, 300]);
        const v1 = rng.pick([40, 50, 60, 80]);
        const v2 = rng.pick([60, 75, 90, 100, 120].filter((x) => x !== v1));
        return task(
          level,
          `Eine Strecke von ${distance} km wird mit verschiedenen Geschwindigkeiten gefahren. Gib die Funktionsgleichung Zeit in Abhängigkeit vom Tempo an (y = k : x). Wie lange dauert die Fahrt mit ${v1} km/h und mit ${v2} km/h?`,
          [num("k =", distance, "", 0), num(`Zeit bei ${v1} km/h:`, distance / v1, "h", 2), num(`Zeit bei ${v2} km/h:`, distance / v2, "h", 2)],
          "Zeit · Tempo = Strecke, also k = Strecke und y = k : x.",
          [`y = ${distance} : x`, `${distance} : ${v1} ${eq(distance / v1)} ${fmt(distance / v1, 2)}`, `${distance} : ${v2} ${eq(distance / v2)} ${fmt(distance / v2, 2)}`],
          `y = ${distance} : x; ${fmtUnit(distance / v1, "h")} und ${fmtUnit(distance / v2, "h")}`,
          { distance },
        );
      },
    },
    {
      id: "tabelle",
      make: (rng, level) => {
        const k = rng.pick([12, 18, 24, 36, 48, 60]);
        if (level === 1) {
          const xs = [1, 2, 3, 4, 6].filter((x) => k % x === 0).slice(0, 4);
          const [a, b] = rng.shuffle(xs).slice(0, 2);
          return task(
            level,
            `Ergänze die Wertetabelle von y = ${k} : x für x = ${a} und x = ${b}. Welche Form hat der Graph?`,
            [num(`x = ${a}:`, k / a, "", 2), num(`x = ${b}:`, k / b, "", 2), choiceField("Graph:", ["Hyperbel", "Gerade durch den Ursprung", "Parabel"], 0)],
            "y = k : x einsetzen. Umgekehrt proportional heißt Hyperbel.",
            [`${k} : ${a} = ${fmt(k / a, 2)}`, `${k} : ${b} = ${fmt(k / b, 2)}`],
            `${fmt(k / a, 2)} und ${fmt(k / b, 2)}; Hyperbel`,
            { k },
          );
        }
        const area = rng.pick([24, 36, 48, 60, 72]);
        const width = rng.pick([3, 4, 6, 8].filter((w) => area % w === 0));
        return task(
          level,
          `Ein rechteckiges Beet soll ${area} m² groß werden. Wie lang muss es bei ${width} m Breite sein? Wie breit ist es bei doppelter Länge?`,
          [num("Länge:", area / width, "m", 2, { slips: [{ value: area * width, hint: "Länge = Fläche : Breite." }] }), num("Breite:", width / 2, "m", 2, { slips: [{ value: width * 2, hint: "Bei gleicher Fläche halbiert die doppelte Länge die Breite." }] })],
          "Länge · Breite = Fläche bleibt gleich: y = Fläche : x.",
          [`Länge = ${area} : ${width} = ${fmt(area / width)} m`, `doppelte Länge ${fmt((2 * area) / width)} m: Breite = ${area} : ${fmt((2 * area) / width)} = ${fmt(width / 2)} m`],
          `${fmtUnit(area / width, "m")} lang; ${fmtUnit(width / 2, "m")} breit`,
          { area, width },
        );
      },
    },
  ],
});

// 8.5 Schnittpunkte von Geraden (M9) ───────────────────────────────────────

const schnitt = L({
  id: "fu-5-schnittpunkt",
  title: "Schnittpunkte von Geraden",
  subtitle: "Zeichnen oder gleichsetzen, und deuten",
  tracks: M_ONLY,
  whyItMatters:
    "Ab welcher Nutzung lohnt sich die Flatrate? Wann holt der schnellere Radfahrer den anderen ein? Der Schnittpunkt zweier Geraden beantwortet solche Fragen; du findest ihn mit einer Zeichnung oder durch Rechnung.",
  explanationHtml: `
    <p>Zwei Geraden y = m₁x + t₁ und y = m₂x + t₂ schneiden sich, wenn ihre Steigungen verschieden sind. Im Schnittpunkt S haben beide denselben y-Wert.</p>
    <ul>
      <li><strong>Zeichnerisch:</strong> Beide Geraden zeichnen und S ablesen. Schnell und anschaulich, aber nur ungefähr.</li>
      <li><strong>Rechnerisch:</strong> Gleichsetzen m₁x + t₁ = m₂x + t₂, x ausrechnen, in eine Gleichung einsetzen. Genau.</li>
    </ul>
    <p>Gleiche Steigung und verschiedener y-Achsenabschnitt: parallel, kein Schnittpunkt.</p>
    <div class="example"><strong>Beispiel:</strong> Tarif A kostet 10 € Grundgebühr und 2 € pro Stunde, Tarif B 20 € und 1 € pro Stunde. 2x + 10 = x + 20 ergibt x = 10 und y = 30: S(10 | 30). Bei 10 Stunden kosten beide 30 €. Unter 10 Stunden ist A billiger, darüber B.</div>
    <div class="merke"><strong>Merke:</strong> Schnittpunkt: rechte Seiten gleichsetzen, x berechnen, y durch Einsetzen. Deute S in der Sache: Bis zum Schnittpunkt ist der eine Tarif günstiger, danach der andere.</div>
  `,
  formulas: [
    { name: "Schnittpunkt", html: "m₁x + t₁ = m₂x + t₂ ⇒ x = (t₂ − t₁) : (m₁ − m₂)", quantities: "m₁ ≠ m₂; y durch Einsetzen" },
  ],
  quiz: {
    question: "Wo schneiden sich y = 3x − 2 und y = x + 4?",
    options: ["S(3 | 7)", "S(1 | 5)", "S(−3 | 1)", "Sie sind parallel."],
    correctIndex: 0,
    explanation: "3x − 2 = x + 4 ergibt 2x = 6, x = 3 und y = 3 + 4 = 7.",
  },
  lab: lab(
    "tariffs",
    "Zwei Tarife",
    "Tarif A und B haben Grundgebühr und Preis pro Stunde. Wo die Geraden sich schneiden, kosten beide gleich viel.",
    [r("ta", "Grundgebühr A", 0, 30, 10, 1, "€"), r("ma", "A: € pro Stunde", 0, 5, 2, 0.5, "€"), r("tb", "Grundgebühr B", 0, 30, 20, 1, "€"), r("mb", "B: € pro Stunde", 0, 5, 1, 0.5, "€")],
    [o("S", "Schnittpunkt", (v) => (v.ma === v.mb ? "keiner" : `(${fmt((v.tb - v.ta) / (v.ma - v.mb), 2)} | ${fmt(v.ta + (v.ma * (v.tb - v.ta)) / (v.ma - v.mb), 2)})`), "", 0, true)],
    [
      { id: "acht", text: "Stelle die Tarife so ein, dass sie bei genau 8 Stunden gleich viel kosten.", check: (v) => v.ma !== v.mb && near((v.tb - v.ta) / (v.ma - v.mb), 8) },
      { id: "parallel", text: "Stelle zwei Tarife ein, die nie gleich viel kosten.", check: (v) => v.ma === v.mb && v.ta !== v.tb },
      { id: "immer-a", text: "Mache Tarif A von 0 bis 20 Stunden immer günstiger als Tarif B.", check: (v) => v.ta < v.tb && v.ta + 20 * v.ma < v.tb + 20 * v.mb },
    ],
  ),
  exercises: [
    {
      id: "rechnung",
      make: (rng, level) => {
        const x0 = rng.int(-4, 6);
        const y0 = rng.int(-5, 8);
        const m1 = rng.pick([-2, -1, -0.5, 0.5, 1, 2, 3]);
        let m2 = rng.pick([-2, -1, -0.5, 0.5, 1, 2, 3]);
        if (m2 === m1) m2 = m1 === 3 ? -2 : 3;
        const t1 = y0 - m1 * x0;
        const t2 = y0 - m2 * x0;
        if (level === 1)
          return task(
            level,
            `Berechne den Schnittpunkt der Geraden y = ${linear(m1, t1)} und y = ${linear(m2, t2)}.`,
            [num("x =", x0, "", 2), num("y =", y0, "", 2)],
            "Rechte Seiten gleichsetzen, x ausrechnen, in eine Gleichung einsetzen.",
            [`${linear(m1, t1)} = ${linear(m2, t2)}`, `${linear(m1 - m2, 0)} = ${fmt(t2 - t1)} ⇒ x = ${fmt(x0)}`, `y = ${fmt(y0)}`],
            `S(${fmt(x0)} | ${fmt(y0)})`,
            { x0, y0 },
          );
        const ta = rng.pick([0, 5, 10, 15]);
        const ma = rng.pick([3, 4, 5]);
        const mb = ma - rng.pick([1, 2]);
        const hours = rng.pick([5, 8, 10, 12]);
        const tb = ta + (ma - mb) * hours;
        const use = hours + rng.pick([-3, 4]);
        const cheaper = use < hours ? 0 : 1;
        return task(
          level,
          `Ein Fahrradverleih bietet Tarif A: ${euro(ta)} Grundgebühr und ${euro(ma)} pro Stunde, Tarif B: ${euro(tb)} Grundgebühr und ${euro(mb)} pro Stunde. Ab wie vielen Stunden kosten beide gleich viel? Welcher Tarif ist bei ${use} Stunden günstiger?`,
          [num("Stunden:", hours, "h", 2), num("Kosten dann:", ta + ma * hours, "€", 2), choiceField(`bei ${use} h günstiger:`, ["Tarif A", "Tarif B"], cheaper)],
          "Gleichsetzen: Grundgebühr A + Preis A · x = Grundgebühr B + Preis B · x.",
          [`${linear(ma, ta)} = ${linear(mb, tb)}`, `${fmt(ma - mb)}x = ${fmt(tb - ta)} ⇒ x = ${hours}`, `bei ${use} h: A ${euro(ta + ma * use)}, B ${euro(tb + mb * use)}`],
          `bei ${hours} h je ${euro(ta + ma * hours)}; bei ${use} h ist Tarif ${cheaper === 0 ? "A" : "B"} günstiger`,
          { ta, ma, hours },
        );
      },
    },
    {
      id: "zeichnung",
      make: (rng, level) => {
        const x0 = rng.int(1, 6);
        const y0 = rng.int(1, 6);
        const m1 = rng.pick([1, 2, 0.5]);
        const m2 = rng.pick([-1, -2, -0.5]);
        const t1 = y0 - m1 * x0;
        const t2 = y0 - m2 * x0;
        const W = 300;
        const X = (x: number) => 30 + ((x + 1) / 9) * 260;
        const Y = (y: number) => 150 - ((y + 2) / 12) * 140;
        let svg = `<svg class="task-chart" viewBox="0 0 ${W} 170" width="${W}" role="img" aria-label="Zwei Geraden">`;
        for (let x = -1; x <= 8; x++) svg += `<line x1="${X(x)}" y1="10" x2="${X(x)}" y2="150" class="lab-grid"/><text x="${X(x)}" y="164" class="lab-text-tick" text-anchor="middle">${x < 0 ? MINUS + -x : x}</text>`;
        for (let y = -2; y <= 10; y += 2) svg += `<line x1="30" y1="${Y(y)}" x2="290" y2="${Y(y)}" class="lab-grid"/><text x="24" y="${Y(y) + 4}" class="lab-text-tick" text-anchor="end">${y < 0 ? MINUS + -y : y}</text>`;
        // Each line only inside −1 ≤ x ≤ 8 and −2 ≤ y ≤ 10.
        const segment = (m: number, t: number, cls: string) => {
          const lo = Math.max(-1, (m > 0 ? -2 - t : 10 - t) / m);
          const hi = Math.min(8, (m > 0 ? 10 - t : -2 - t) / m);
          return `<line x1="${X(lo).toFixed(1)}" y1="${Y(m * lo + t).toFixed(1)}" x2="${X(hi).toFixed(1)}" y2="${Y(m * hi + t).toFixed(1)}" class="${cls}"/>`;
        };
        svg += segment(m1, t1, "lab-side-a") + segment(m2, t2, "lab-side-b") + "</svg>";
        const clipped = svg;
        if (level === 1)
          return task(
            level,
            `Lies den Schnittpunkt der blauen Geraden y = ${linear(m1, t1)} und der orangen Geraden y = ${linear(m2, t2)} ab und prüfe ihn durch Rechnung.${clipped}`,
            [num("x =", x0, "", 2), num("y =", y0, "", 2)],
            "Ablesen, dann in beide Gleichungen einsetzen: Beide müssen denselben y-Wert liefern.",
            [`abgelesen: S(${x0} | ${y0})`, `Probe: ${fmt(m1)} · ${x0} ${t1 < 0 ? MINUS : "+"} ${fmt(Math.abs(t1))} = ${y0} und ${fmt(m2)} · ${x0} ${t2 < 0 ? MINUS : "+"} ${fmt(Math.abs(t2))} = ${y0}`],
            `S(${x0} | ${y0})`,
            { x0, y0 },
          );
        return task(
          level,
          `Die blaue Gerade y = ${linear(m1, t1)} und die orange y = ${linear(m2, t2)} sind gezeichnet. Bestimme den Schnittpunkt zeichnerisch und rechnerisch. Welcher Weg ist genauer?${clipped}`,
          [num("x =", x0, "", 2), num("y =", y0, "", 2), choiceField("genauer:", ["die Rechnung", "die Zeichnung", "beide gleich"], 0)],
          "Gleichsetzen liefert den genauen Wert; die Zeichnung nur einen ungefähren.",
          [`${linear(m1, t1)} = ${linear(m2, t2)}`, `${linear(m1 - m2, 0)} = ${fmt(t2 - t1)} ⇒ x = ${x0}, y = ${y0}`],
          `S(${x0} | ${y0}); die Rechnung ist genauer`,
          { x0, y0 },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  8,
  "Zuordnungen, lineare und umgekehrt proportionale Funktionen",
  "#9333ea",
  "📈",
  [zuordnungen, fehlend, lineare, umgekehrt, schnitt],
);
