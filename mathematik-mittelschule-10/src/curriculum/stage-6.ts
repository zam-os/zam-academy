import { fmt } from "../exercises/format";
import {
  chosenPath,
  COLOUR_WORD,
  type Colour,
  eventFraction,
  eventPaths,
  factorial,
  pathFraction,
  pathKey,
  pathProbability,
  PEOPLE,
  probText,
  simulateUrn,
  testTable,
  treePaths,
  TREE_EVENTS,
} from "../lab/views-zufall";
import { numberField as num, yesNo } from "./helpers";
import { choice, lab, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(6, content);
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (same(value, Math.round(value * 10 ** digits) / 10 ** digits) ? "=" : "≈");
const pct = (p: number) => p * 100;
const words = (path: readonly Colour[]) => path.map((c) => COLOUR_WORD[c]).join(", ");
const percentField = (label: string, p: number, extra: Parameters<typeof num>[4] = {}) => num(label, pct(p), "%", 2, extra);

/** The seed of the urn simulation; the test checks that 500 draws reach the goal. */
export const URN_SEED = 20261112;

// 6.1 Baumdiagramme ────────────────────────────────────────────────────────

const baum = L({
  id: "st-1-baumdiagramm",
  title: "Mehrstufige Zufallsexperimente im Baumdiagramm",
  subtitle: "Mit und ohne Zurücklegen",
  whyItMatters:
    "Zweimal ziehen, dreimal würfeln, mehrere Lose kaufen: Werden Zufallsexperimente hintereinander ausgeführt, behält ein Baumdiagramm den Überblick über alle Möglichkeiten und ihre Wahrscheinlichkeiten.",
  explanationHtml: `
    <p>Ein <strong>mehrstufiges Zufallsexperiment</strong> besteht aus mehreren Zufallsexperimenten nacheinander, zum Beispiel zweimal aus einer Urne ziehen. Im <strong>Baumdiagramm</strong> ist jede Stufe eine Verzweigung; an jeden Ast schreibst du seine Wahrscheinlichkeit. Ein Weg vom Anfang bis zum Ende heißt <strong>Pfad</strong>.</p>
    <ul>
      <li><strong>Mit Zurücklegen:</strong> Die Urne ist vor jedem Zug gleich, die Wahrscheinlichkeiten an den Ästen bleiben gleich.</li>
      <li><strong>Ohne Zurücklegen:</strong> Nach jedem Zug ist eine Kugel weniger in der Urne. Der Nenner wird um 1 kleiner, und bei der gezogenen Farbe auch der Zähler.</li>
    </ul>
    <p>An jeder Verzweigung ergeben die Wahrscheinlichkeiten der Äste zusammen 1.</p>
    <div class="example"><strong>Beispiel:</strong> In einer Urne liegen 4 rote und 2 blaue Kugeln. Du ziehst zweimal ohne Zurücklegen.<br>
    1. Zug: rot 4/6, blau 2/6.<br>
    2. Zug nach rot: rot 3/5, blau 2/5. Nach blau: rot 4/5, blau 1/5.<br>
    Mit Zurücklegen stünde im 2. Zug wieder rot 4/6, blau 2/6.</div>
    <div class="merke"><strong>Merke:</strong> Jede Stufe eine Verzweigung, an jedem Ast die Wahrscheinlichkeit, Summe an jeder Verzweigung 1. Ohne Zurücklegen ändern sich Zähler und Nenner von Stufe zu Stufe.</div>
  `,
  formulas: [{ name: "Baumdiagramm", html: "Summe der Äste an jeder Verzweigung = 1", quantities: "ohne Zurücklegen: Nenner je Stufe um 1 kleiner" }],
  quiz: {
    question: "In einer Urne liegen 3 rote und 2 blaue Kugeln. Du ziehst ohne Zurücklegen, die erste Kugel ist rot. Wie wahrscheinlich ist es, dass die zweite auch rot ist?",
    options: ["2/4", "3/5", "2/5", "3/4"],
    correctIndex: 0,
    explanation: "Nach dem ersten Zug liegen noch 2 rote und 2 blaue Kugeln in der Urne, also 4 Kugeln: 2/4. 3/5 wäre richtig mit Zurücklegen.",
  },
  lab: lab(
    "tree-urn",
    "Urne und Baum",
    "Stelle die Urne ein (Regler oder Griffe über den Kugeln) und wähle einen Pfad. Er leuchtet lila; oben steht seine Wahrscheinlichkeit. Mit den Knöpfen ziehst du zur Probe.",
    [
      r("rot", "rote Kugeln", 2, 8, 4, 1),
      r("blau", "blaue Kugeln", 2, 8, 2, 1),
      { type: "choice", key: "draws", label: "Züge", options: [{ value: 2, label: "zwei Züge" }, { value: 3, label: "drei Züge" }], value: 3 },
      choice("mode", "Ziehen", ["mit Zurücklegen", "ohne Zurücklegen"], 1),
      choice("z1", "Pfad: 1. Kugel", ["rot", "blau"], 0),
      choice("z2", "Pfad: 2. Kugel", ["rot", "blau"], 0),
      { ...choice("z3", "Pfad: 3. Kugel", ["rot", "blau"], 1), showIf: (v) => v.draws === 3 },
      { type: "state", key: "n", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "last", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: URN_SEED },
    ],
    [
      o("P", "P(gewählter Pfad)", (v) => {
        const path = chosenPath(v);
        return `${pathKey(path)}: ${probText(...pathFraction(v.rot, v.blau, v.mode === 1, path))}`;
      }, "", 0, true),
      o("vergleich", "mit / ohne Zurücklegen", (v) => `${fmt(pct(pathProbability(v.rot, v.blau, false, chosenPath(v))), 2)} % / ${fmt(pct(pathProbability(v.rot, v.blau, true, chosenPath(v))), 2)} %`, "", 0),
      o("freq", "relative Häufigkeit", (v) => (v.n > 0 ? `${fmt((v.hits / v.n) * 100, 1)} % bei ${v.n} Versuchen` : "noch nicht gezogen"), "", 0),
      o("zuletzt", "zuletzt gezogen", (v) => (v.last > 0 ? words(treePaths(v.draws)[v.last - 1]) : "noch nichts"), "", 0),
    ],
    [
      {
        id: "achtel",
        text: "Mit Zurücklegen, drei Züge: Stelle Urne und Pfad so ein, dass dein Pfad genau die Wahrscheinlichkeit 1/8 hat. Was fällt dir an der Urne auf?",
        check: (v) => v.draws === 3 && v.mode === 0 && same(pathProbability(v.rot, v.blau, false, chosenPath(v)), 1 / 8),
      },
      {
        id: "unmoeglich",
        text: "Ohne Zurücklegen, drei Züge: Mache deinen Pfad unmöglich (P = 0). Welche Kugeln dürfen dafür nur zweimal in der Urne liegen?",
        check: (v) => v.draws === 3 && v.mode === 1 && pathFraction(v.rot, v.blau, true, chosenPath(v))[0] === 0,
      },
      {
        id: "simulation",
        text: "Ziehe mindestens 500-mal (Knopf „100× ziehen“): Die relative Häufigkeit deines Pfades liegt dann höchstens 3 Prozentpunkte neben seiner Wahrscheinlichkeit.",
        check: (v) => v.n >= 500 && Math.abs(v.hits / v.n - pathProbability(v.rot, v.blau, v.mode === 1, chosenPath(v))) <= 0.03,
      },
    ],
    [
      { id: "eins", label: "1× ziehen", apply: (v) => simulateUrn(v, 1) },
      { id: "hundert", label: "100× ziehen", apply: (v) => simulateUrn(v, 100) },
      { id: "neu", label: "Zählung neu starten", apply: (v) => ({ ...v, n: 0, hits: 0, last: 0 }) },
    ],
  ),
  exercises: [
    {
      id: "pfad",
      make: (rng, level) => {
        if (level === 1) {
          const red = rng.int(3, 7);
          const blue = rng.int(2, 6);
          const first: Colour = rng.int(0, 1) as Colour;
          const second: Colour = rng.int(0, 1) as Colour;
          const path = [first, second];
          const [a1, n1] = [first === 0 ? red : blue, red + blue];
          const a2 = (second === 0 ? red : blue) - (first === second ? 1 : 0);
          const n2 = red + blue - 1;
          const P = (a1 / n1) * (a2 / n2);
          return task(
            level,
            `In einer Urne liegen ${red} rote und ${blue} blaue Kugeln. Du ziehst zweimal ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit am zweiten Ast für „${COLOUR_WORD[second]}“, nachdem „${COLOUR_WORD[first]}“ gezogen wurde? Wie groß ist die Wahrscheinlichkeit des Pfades ${words(path)}?`,
            [
              percentField("2. Ast:", a2 / n2, { slips: [{ value: pct((second === 0 ? red : blue) / (red + blue)), hint: "Ohne Zurücklegen ist eine Kugel weniger in der Urne." }] }),
              percentField("Pfad:", P, { slips: [{ value: pct(a1 / n1 + a2 / n2), hint: "Entlang eines Pfades wird multipliziert, nicht addiert." }] }),
            ],
            "Nach dem ersten Zug: eine Kugel weniger, bei gleicher Farbe auch eine dieser Farbe weniger. Pfad: Äste multiplizieren.",
            [`1. Ast: ${a1}/${n1}`, `2. Ast: ${a2}/${n2}`, `Pfad: ${a1}/${n1} · ${a2}/${n2} = ${a1 * a2}/${n1 * n2}`],
            `2. Ast ${a2}/${n2} ${eq(pct(a2 / n2))} ${fmt(pct(a2 / n2), 2)} %, Pfad ${eq(pct(P))} ${fmt(pct(P), 2)} %`,
            { red, blue, first, second },
            [`${red} rot, ${blue} blau, ohne Zurücklegen`],
          );
        }
        const black = rng.int(4, 8);
        const white = rng.int(2, 5);
        const n = black + white;
        const without = (black / n) * ((black - 1) / (n - 1));
        const withR = (black / n) ** 2;
        return task(
          level,
          `In einer Schublade liegen ${black} schwarze und ${white} weiße Socken. Im Dunkeln nimmst du nacheinander zwei Socken heraus. Wie wahrscheinlich sind beide schwarz? Wie wahrscheinlich wäre das, wenn du die erste Socke zurücklegen würdest?`,
          [percentField("ohne Zurücklegen:", without), percentField("mit Zurücklegen:", withR)],
          "Zeichne den Baum für zwei Züge. Ohne Zurücklegen ändert sich im zweiten Zug Zähler und Nenner.",
          [`ohne: ${black}/${n} · ${black - 1}/${n - 1} = ${black * (black - 1)}/${n * (n - 1)}`, `mit: ${black}/${n} · ${black}/${n} = ${black * black}/${n * n}`],
          `ohne Zurücklegen ${eq(pct(without))} ${fmt(pct(without), 2)} %, mit Zurücklegen ${eq(pct(withR))} ${fmt(pct(withR), 2)} %`,
          { black, white },
        );
      },
    },
    {
      id: "stufen",
      make: (rng, level) => {
        if (level === 1) {
          const fields = rng.pick([4, 5, 6, 8]);
          const red = rng.int(1, fields - 1);
          const p = red / fields;
          return task(
            level,
            `Ein Glücksrad hat ${fields} gleich große Felder, ${red} davon sind rot. Es wird zweimal gedreht. Berechne die Wahrscheinlichkeit für „zweimal rot“ und für „erst rot, dann nicht rot“.`,
            [percentField("zweimal rot:", p * p), percentField("erst rot, dann nicht rot:", p * (1 - p))],
            "Beim Glücksrad bleibt alles gleich (wie mit Zurücklegen). Entlang des Pfades multiplizieren.",
            [`P(rot) = ${red}/${fields}, P(nicht rot) = ${fields - red}/${fields}`, `zweimal rot: ${red}/${fields} · ${red}/${fields}`, `rot, dann nicht rot: ${red}/${fields} · ${fields - red}/${fields}`],
            `${fmt(pct(p * p), 2)} % und ${fmt(pct(p * (1 - p)), 2)} %`,
            { fields, red },
            [`${fields} Felder, ${red} rot`],
          );
        }
        const total = rng.pick([10, 12, 15, 20]);
        const wins = rng.int(2, 5);
        const both = (wins / total) * ((wins - 1) / (total - 1));
        const none = ((total - wins) / total) * ((total - wins - 1) / (total - 1));
        const name = rng.pick(NAMES);
        return task(
          level,
          `In einer Lostrommel sind ${total} Lose, davon ${wins} Gewinne. ${name} zieht zwei Lose. Wie groß ist die Wahrscheinlichkeit für zwei Gewinne? Wie groß ist sie für keinen Gewinn?`,
          [percentField("zwei Gewinne:", both, { slips: [{ value: pct((wins / total) ** 2), hint: "Ein gezogenes Los kommt nicht zurück in die Trommel." }] }), percentField("kein Gewinn:", none)],
          "Lose werden ohne Zurücklegen gezogen. Pfade im Baum für zwei Züge.",
          [`zwei Gewinne: ${wins}/${total} · ${wins - 1}/${total - 1}`, `kein Gewinn: ${total - wins}/${total} · ${total - wins - 1}/${total - 1}`],
          `zwei Gewinne ${eq(pct(both))} ${fmt(pct(both), 2)} %, kein Gewinn ${eq(pct(none))} ${fmt(pct(none), 2)} %`,
          { total, wins },
        );
      },
    },
  ],
});

// 6.2 Pfadregeln ───────────────────────────────────────────────────────────

const pfadregeln = L({
  id: "st-2-pfadregeln",
  title: "Pfadregeln",
  subtitle: "Entlang multiplizieren, Pfade addieren",
  whyItMatters:
    "Mit zwei einfachen Regeln berechnest du jede Wahrscheinlichkeit aus dem Baumdiagramm: für ein Spiel, eine Qualitätskontrolle oder einen Elfmeter. Das Gegenereignis spart dabei oft viel Rechenarbeit.",
  explanationHtml: `
    <p><strong>1. Pfadregel (Multiplikationsregel):</strong> Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades.</p>
    <p><strong>2. Pfadregel (Additionsregel):</strong> Gehören zu einem Ereignis mehrere Pfade, addiert man ihre Wahrscheinlichkeiten.</p>
    <p><strong>Gegenereignis:</strong> P(Ereignis) = 1 − P(Gegenereignis). Das hilft bei „mindestens einmal“: Gegenereignis ist „keinmal“, und das ist nur ein Pfad.</p>
    <div class="example"><strong>Beispiel:</strong> Urne mit 4 roten und 2 blauen Kugeln, zweimal ohne Zurücklegen.<br>
    P(rot, rot) = 4/6 · 3/5 = 12/30 = 2/5.<br>
    P(verschiedene Farben) = P(rot, blau) + P(blau, rot) = 4/6 · 2/5 + 2/6 · 4/5 = 8/30 + 8/30 = 16/30 = 8/15 ≈ 53,33 %.<br>
    P(mindestens eine rote) = 1 − P(blau, blau) = 1 − 2/6 · 1/5 = 1 − 2/30 = 28/30 ≈ 93,33 %.</div>
    <div class="merke"><strong>Merke:</strong> Entlang eines Pfades multiplizieren, verschiedene Pfade addieren. Für „mindestens einmal“ das Gegenereignis „keinmal“ nehmen.</div>
  `,
  formulas: [
    { name: "1. Pfadregel", html: "P(Pfad) = Produkt der Astwahrscheinlichkeiten", quantities: "Multiplikationsregel" },
    { name: "2. Pfadregel", html: "P(Ereignis) = Summe seiner Pfade", quantities: "Additionsregel" },
    { name: "Gegenereignis", html: "P(E) = 1 − P(Ē)", quantities: "z. B. mindestens einmal = 1 − keinmal" },
  ],
  quiz: {
    question: "Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens einmal Kopf?",
    options: ["7/8", "3/8", "1/2", "1/8"],
    correctIndex: 0,
    explanation: "Gegenereignis: dreimal Zahl, P = 1/2 · 1/2 · 1/2 = 1/8. Also P(mindestens einmal Kopf) = 1 − 1/8 = 7/8.",
  },
  lab: lab(
    "path-rules",
    "Ein Ereignis sammelt Pfade",
    "Wähle ein Ereignis für dreimaliges Ziehen: Seine Pfade leuchten lila, oben steht ihre Summe. Schalte auf den verkürzten Baum oder markiere das Gegenereignis (orange).",
    [
      r("rot", "rote Kugeln", 2, 8, 4, 1),
      r("blau", "blaue Kugeln", 2, 8, 2, 1),
      choice("mode", "Ziehen", ["mit Zurücklegen", "ohne Zurücklegen"], 1),
      choice("event", "Ereignis (drei Züge)", TREE_EVENTS.map((event) => event.label), 1),
      choice("sicht", "Ansicht", ["ganzer Baum", "verkürzter Baum", "Gegenereignis markieren"], 0),
    ],
    [
      o("P", "P(Ereignis)", (v) => probText(...eventFraction(v.rot, v.blau, v.mode === 1, v.event)), "", 0, true),
      o("pfade", "Pfade des Ereignisses", (v) => `${eventPaths(v.event).length} von 8: ${eventPaths(v.event).map(pathKey).join(", ")}`, "", 0),
      o("gegen", "P(Gegenereignis)", (v) => {
        const [n, d] = eventFraction(v.rot, v.blau, v.mode === 1, v.event);
        return probText(d - n, d);
      }, "", 0),
    ],
    [
      {
        id: "fuenfzig",
        text: "Ohne Zurücklegen: Finde eine Urne, bei der „genau zwei rote“ genau 50 % hat. Tipp: Die drei Pfade sind gleich wahrscheinlich, jeder braucht also 1/6.",
        check: (v) => v.mode === 1 && v.event === 1 && same(eventFraction(v.rot, v.blau, true, 1)[0] / eventFraction(v.rot, v.blau, true, 1)[1], 0.5),
      },
      {
        id: "gegen",
        text: "Markiere für „mindestens eine rote“ das Gegenereignis und stelle mit Zurücklegen eine Urne ein, bei der P(mindestens eine rote) mindestens 99 % ist.",
        check: (v) => v.mode === 0 && v.event === 4 && v.sicht === 2 && eventFraction(v.rot, v.blau, false, 4)[0] / eventFraction(v.rot, v.blau, false, 4)[1] >= 0.99,
      },
      {
        id: "verkuerzt",
        text: "Zeige den verkürzten Baum für „höchstens eine rote“ und finde eine Urne, bei der dieses Ereignis genauso wahrscheinlich ist wie sein Gegenereignis.",
        check: (v) => v.event === 5 && v.sicht === 1 && same(eventFraction(v.rot, v.blau, v.mode === 1, 5)[0] / eventFraction(v.rot, v.blau, v.mode === 1, 5)[1], 0.5),
      },
    ],
  ),
  exercises: [
    {
      id: "pfadregeln",
      make: (rng, level) => {
        if (level === 1) {
          const red = rng.int(3, 7);
          const blue = rng.int(2, 6);
          const n = red + blue;
          const sameColour = rng.next() < 0.5;
          const rr = (red / n) * ((red - 1) / (n - 1));
          const bb = (blue / n) * ((blue - 1) / (n - 1));
          const rb = (red / n) * (blue / (n - 1));
          const P = sameColour ? rr + bb : 2 * rb;
          return task(
            level,
            `In einer Urne liegen ${red} rote und ${blue} blaue Kugeln. Du ziehst zweimal ohne Zurücklegen. Berechne die Wahrscheinlichkeit für „${sameColour ? "beide Kugeln haben dieselbe Farbe" : "die Kugeln haben verschiedene Farben"}“.`,
            [percentField("P =", P, { slips: [{ value: pct(sameColour ? rr : rb), hint: "Zu dem Ereignis gehören zwei Pfade. Addiere beide." }] })],
            "Zwei Pfade gehören zum Ereignis: jeden Pfad multiplizieren, dann beide addieren.",
            sameColour
              ? [`P(rot, rot) = ${red}/${n} · ${red - 1}/${n - 1}`, `P(blau, blau) = ${blue}/${n} · ${blue - 1}/${n - 1}`, "addieren"]
              : [`P(rot, blau) = ${red}/${n} · ${blue}/${n - 1}`, `P(blau, rot) = ${blue}/${n} · ${red}/${n - 1}`, "addieren"],
            `P ${eq(pct(P))} ${fmt(pct(P), 2)} %`,
            { red, blue, sameColour: sameColour ? 1 : 0 },
            [`${red} rot, ${blue} blau, zwei Züge ohne Zurücklegen`],
          );
        }
        const hit = rng.pick([0.6, 0.7, 0.75, 0.8, 0.9]);
        const two = 3 * hit * hit * (1 - hit);
        const atLeastOne = 1 - (1 - hit) ** 3;
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} trifft beim Elfmeter mit einer Wahrscheinlichkeit von ${fmt(pct(hit))} %. ${name} schießt dreimal. Wie wahrscheinlich sind genau zwei Treffer? Wie wahrscheinlich ist mindestens ein Treffer?`,
          [percentField("genau zwei:", two, { slips: [{ value: pct(hit * hit * (1 - hit)), hint: "Genau zwei Treffer gibt es auf drei Pfaden: TTN, TNT, NTT." }] }), percentField("mindestens einer:", atLeastOne)],
          "Genau zwei: drei Pfade mit je zwei Treffern. Mindestens einer: 1 − P(kein Treffer).",
          [`ein Pfad mit zwei Treffern: ${fmt(hit, 2)} · ${fmt(hit, 2)} · ${fmt(1 - hit, 2)}`, "mal 3 Pfade", `1 − ${fmt(1 - hit, 2)}³`],
          `genau zwei ${eq(pct(two))} ${fmt(pct(two), 2)} %, mindestens einer ${eq(pct(atLeastOne))} ${fmt(pct(atLeastOne), 2)} %`,
          { hit },
        );
      },
    },
    {
      id: "gegenereignis",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(2, 4);
          const none = (5 / 6) ** n;
          return task(
            level,
            `Ein Würfel wird ${n}-mal geworfen. Berechne die Wahrscheinlichkeit für „keine Sechs“ und für „mindestens eine Sechs“.`,
            [percentField("keine Sechs:", none), percentField("mindestens eine:", 1 - none, { slips: [{ value: pct(n / 6), hint: "Wahrscheinlichkeiten der Würfe nicht einfach addieren: 1 − P(keine Sechs)." }] })],
            "Keine Sechs: (5/6) hoch Anzahl der Würfe. Mindestens eine: Gegenereignis.",
            [`P(keine Sechs) = (5/6)${n === 2 ? "²" : n === 3 ? "³" : "⁴"}`, "P(mindestens eine) = 1 − P(keine Sechs)"],
            `keine Sechs ${eq(pct(none))} ${fmt(pct(none), 2)} %, mindestens eine ${eq(pct(1 - none))} ${fmt(pct(1 - none), 2)} %`,
            { n },
          );
        }
        const total = rng.pick([10, 12, 15, 20]);
        const bad = rng.int(2, 4);
        const take = 3;
        let none = 1;
        for (let k = 0; k < take; k++) none *= (total - bad - k) / (total - k);
        return task(
          level,
          `Eine Lieferung enthält ${total} Glühbirnen, davon sind ${bad} defekt. Bei der Kontrolle werden ${take} Birnen zufällig herausgenommen. Wie wahrscheinlich ist keine defekt? Wie wahrscheinlich wird mindestens eine defekte Birne entdeckt?`,
          [percentField("keine defekt:", none), percentField("mindestens eine:", 1 - none)],
          "Ohne Zurücklegen. Mindestens eine defekte: 1 − P(keine defekt).",
          [`P(keine) = ${total - bad}/${total} · ${total - bad - 1}/${total - 1} · ${total - bad - 2}/${total - 2}`, "P(mindestens eine) = 1 − P(keine)"],
          `keine defekt ${eq(pct(none))} ${fmt(pct(none), 2)} %, mindestens eine ${eq(pct(1 - none))} ${fmt(pct(1 - none), 2)} %`,
          { total, bad },
        );
      },
    },
  ],
});

// 6.3 Permutationen ────────────────────────────────────────────────────────

const permutationen = L({
  id: "st-3-permutationen",
  title: "Permutationen",
  subtitle: "Wie viele Reihenfolgen gibt es?",
  whyItMatters:
    "Wie viele Sitzordnungen gibt es für vier Freunde, wie viele Startreihenfolgen bei einem Staffellauf? Zählen wird schnell unübersichtlich. Mit dem Zählprinzip berechnest du die Anzahl, ohne alle aufzuschreiben.",
  explanationHtml: `
    <p>Eine <strong>Permutation</strong> ist eine Anordnung (Reihenfolge) von n verschiedenen Dingen. Für den ersten Platz gibt es n Möglichkeiten, für den zweiten noch n − 1, für den dritten n − 2, und so weiter bis 1.</p>
    <p class="formula-line">Anzahl = n · (n − 1) · … · 2 · 1 = n! (lies: „n Fakultät“)</p>
    <p>Dieses <strong>Zählprinzip</strong> (Wahlmöglichkeiten multiplizieren) entspricht einem Baumdiagramm, bei dem jede Stufe eine Verzweigung weniger hat. Ist ein Platz schon fest vergeben, ordnest du nur die übrigen an.</p>
    <div class="example"><strong>Beispiel:</strong> Anna, Ben, Cem und Dila stellen sich für ein Foto in eine Reihe: 4 · 3 · 2 · 1 = 4! = 24 Reihenfolgen.<br>
    Will Anna immer ganz links stehen, bleiben 3 · 2 · 1 = 3! = 6 Reihenfolgen.<br>
    Bei 8 Läufern gibt es für die ersten drei Plätze 8 · 7 · 6 = 336 Möglichkeiten.</div>
    <div class="merke"><strong>Merke:</strong> n verschiedene Dinge lassen sich auf n! = n · (n − 1) · … · 1 Arten anordnen. Allgemein: Wahlmöglichkeiten der Plätze multiplizieren.</div>
  `,
  formulas: [{ name: "Permutationen", html: "n! = n · (n − 1) · … · 2 · 1", quantities: "Anordnungen von n verschiedenen Dingen" }],
  quiz: {
    question: "Auf wie viele Arten können sich 5 Freunde für ein Foto in einer Reihe aufstellen?",
    options: ["120", "25", "15", "5"],
    correctIndex: 0,
    explanation: "5 · 4 · 3 · 2 · 1 = 5! = 120. 25 wäre 5 · 5: Dann dürfte dieselbe Person mehrmals in der Reihe stehen.",
  },
  lab: lab(
    "permutations",
    "Reihenfolgen zählen",
    "Ziehe den Griff, um Personen dazuzunehmen. Unter jedem Platz steht, wie viele Personen dort noch zur Wahl sind. Bis 24 Reihenfolgen siehst du die ganze Liste.",
    [r("n", "Anzahl Personen", 2, 7, 3, 1), choice("fixed", "Platz 1", ["frei", `${PEOPLE[0]} sitzt immer vorn`], 0)],
    [
      o("count", "Reihenfolgen", (v) => (v.fixed === 1 ? factorial(v.n - 1) : factorial(v.n)), "", 0, true),
      o("product", "Rechnung", (v) => (v.fixed === 1 ? `1 · ${v.n - 1}!` : `${v.n}!`), "", 0),
    ],
    [
      { id: "vier", text: "Wie viele Reihenfolgen gibt es für vier Personen? Stelle sie ein und lies die Liste.", check: (v) => v.n === 4 && v.fixed === 0 },
      { id: "fest", text: "Fünf Personen, aber Anna sitzt immer vorn: Stelle das ein. Warum sind es genauso viele wie bei vier Personen?", check: (v) => v.n === 5 && v.fixed === 1 },
      { id: "hundert", text: "Finde die kleinste Anzahl Personen, für die es mehr als 100 Reihenfolgen gibt (Platz 1 frei).", check: (v) => v.n === 5 && v.fixed === 0 },
    ],
  ),
  exercises: [
    {
      id: "anordnen",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(3, 7);
          const thing = rng.pick(["Bücher in ein Regal", "Läufer auf die Startbahnen", "Fotos an eine Wand", "Kinder in eine Reihe"]);
          return task(
            level,
            `Auf wie viele Arten kann man ${n} verschiedene ${thing} anordnen?`,
            [num("Anzahl:", factorial(n), "", 0, { slips: [{ value: n * n, hint: "Jedes Ding kommt nur einmal vor: Die Möglichkeiten werden von Platz zu Platz weniger." }] })],
            `n! = ${Array.from({ length: n }, (_, i) => n - i).join(" · ")}`,
            [`${Array.from({ length: n }, (_, i) => n - i).join(" · ")} = ${fmt(factorial(n))}`],
            `${n}! = ${fmt(factorial(n))}`,
            { n },
          );
        }
        const n = rng.int(4, 7);
        const variant = rng.int(0, 1);
        const name = rng.pick(PEOPLE.slice(0, n));
        const count = variant === 0 ? factorial(n - 1) : 2 * factorial(n - 1);
        return task(
          level,
          variant === 0
            ? `${n} Freunde gehen ins Kino und setzen sich nebeneinander. ${name} möchte unbedingt ganz außen links sitzen. Wie viele Sitzordnungen gibt es?`
            : `${n} Freunde gehen ins Kino und setzen sich nebeneinander. Zwei von ihnen wollen unbedingt nebeneinander sitzen. Wie viele Sitzordnungen gibt es?`,
          [num("Anzahl:", count, "", 0, { slips: [{ value: factorial(n), hint: "Die Bedingung schränkt die Anordnungen ein." }] })],
          variant === 0 ? "Ein Platz ist fest. Ordne nur die übrigen an." : "Fasse die beiden zu einem Block zusammen; der Block selbst hat zwei Reihenfolgen.",
          variant === 0 ? [`Platz 1: ${name}`, `die anderen ${n - 1}: ${n - 1}! = ${fmt(factorial(n - 1))}`] : [`Block + ${n - 2} Einzelne = ${n - 1} Teile: ${n - 1}! = ${fmt(factorial(n - 1))}`, `im Block 2 Reihenfolgen: · 2`],
          `${fmt(count)} Sitzordnungen`,
          { n, variant },
        );
      },
    },
    {
      id: "plaetze",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(5, 10);
          const podium = n * (n - 1) * (n - 2);
          return task(
            level,
            `Bei einem Lauf starten ${n} Kinder. Wie viele Möglichkeiten gibt es für die Plätze 1, 2 und 3 auf dem Siegerpodest?`,
            [num("Möglichkeiten:", podium, "", 0, { slips: [{ value: factorial(n), hint: "Nur die ersten drei Plätze zählen: drei Faktoren." }] })],
            "Platz 1: n Möglichkeiten, Platz 2: n − 1, Platz 3: n − 2. Multiplizieren.",
            [`${n} · ${n - 1} · ${n - 2}`],
            `${fmt(podium)} Möglichkeiten`,
            { n },
          );
        }
        const word = rng.pick(["MATHE", "PLANET", "BRUCH", "ZAHLEN", "WINKEL"]);
        const n = word.length;
        return task(
          level,
          `Aus den Buchstaben des Wortes ${word} sollen „Wörter“ gebildet werden, in denen jeder Buchstabe genau einmal vorkommt (auch sinnlose). Wie viele gibt es? Wie viele davon beginnen mit ${word[0]}?`,
          [num("alle:", factorial(n), "", 0), num(`mit ${word[0]} vorn:`, factorial(n - 1), "", 0)],
          "Alle Buchstaben sind verschieden: n!. Ist der erste Buchstabe fest, bleiben (n − 1)!.",
          [`${n} verschiedene Buchstaben: ${n}! = ${fmt(factorial(n))}`, `${word[0]} fest: ${n - 1}! = ${fmt(factorial(n - 1))}`],
          `${fmt(factorial(n))} Wörter, ${fmt(factorial(n - 1))} davon mit ${word[0]} vorn`,
          { n },
        );
      },
    },
  ],
});

// 6.4 Fehldeutungen vermeiden ──────────────────────────────────────────────

const fehldeutungen = L({
  id: "st-4-fehldeutungen",
  title: "Statistische Aussagen prüfen",
  subtitle: "Fehldeutungen erkennen und vermeiden",
  whyItMatters:
    "„Der Test ist zu 90 % sicher.“ „Nach fünfmal Rot kommt jetzt bestimmt Schwarz.“ Solche Sätze klingen überzeugend und sind oft falsch. Mit Baumdiagramm und Zählprinzip prüfst du Aussagen in Zeitungen, Werbung und Diagrammen selbst.",
  explanationHtml: `
    <p>Drei häufige Fehldeutungen:</p>
    <ol>
      <li><strong>Der Zufall hat kein Gedächtnis:</strong> Bei einer Münze oder einem Roulette mit Zurücklegen bleiben die Wahrscheinlichkeiten bei jedem Versuch gleich. Nach fünfmal Rot ist Schwarz nicht „fällig“.</li>
      <li><strong>Bedingungen verwechseln:</strong> „Der Test erkennt 90 % der Kranken“ heißt nicht „90 % der positiv Getesteten sind krank“. Rechne mit 1.000 Personen im Baum oder in einer Vierfeldertafel.</li>
      <li><strong>Irreführende Darstellungen:</strong> Eine abgeschnittene Achse lässt kleine Unterschiede riesig wirken. Achte auf den Beginn der Achse und auf absolute und relative Zahlen.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> 1 % von 1.000 Personen sind krank, also 10 Personen. Der Test erkennt 90 % der Kranken: 9 richtig positive. Von den 990 Gesunden meldet er 10 % fälschlich positiv: 99 falsch positive.<br>
    Von 9 + 99 = 108 positiven Tests sind nur 9 krank: 9 : 108 ≈ 8,33 %.</div>
    <div class="merke"><strong>Merke:</strong> Unabhängige Versuche haben kein Gedächtnis. Bei Tests mit 1.000 Personen rechnen und fragen: Anteil wovon? Bei Diagrammen die Achsen prüfen.</div>
  `,
  formulas: [{ name: "Anteil unter den Positiven", html: "richtig positiv : (richtig positiv + falsch positiv)", quantities: "mit 1.000 Personen rechnen" }],
  quiz: {
    question: "Beim Roulette kam fünfmal nacheinander Rot. Was gilt für das nächste Spiel (Rot und Schwarz gleich wahrscheinlich, die Null nicht betrachtet)?",
    options: ["Rot und Schwarz sind gleich wahrscheinlich.", "Schwarz ist jetzt wahrscheinlicher.", "Rot ist jetzt wahrscheinlicher.", "Nach fünfmal Rot kann kein Rot mehr kommen."],
    correctIndex: 0,
    explanation: "Die Kugel hat kein Gedächtnis. Jedes Spiel ist ein neues Zufallsexperiment mit denselben Wahrscheinlichkeiten. Unwahrscheinlich war nur die ganze Serie von vorher.",
  },
  lab: lab(
    "test-table",
    "1.000 Personen und ein Schnelltest",
    "Stelle ein, wie viele Personen krank sind und wie gut der Test Kranke und Gesunde erkennt. Die Punkte zeigen 1.000 Personen; die Tafel zählt sie.",
    [
      r("prev", "Anteil Kranke", 1, 50, 10, 1, "%"),
      r("sens", "Test erkennt Kranke", 50, 100, 80, 0.5, "%"),
      r("spec", "Test erkennt Gesunde", 50, 100, 90, 0.1, "%"),
    ],
    [
      o("pos", "positive Tests", (v) => testTable(v).truePositive + testTable(v).falsePositive, "", 1),
      o("ppv", "davon krank", (v) => testTable(v).ppv * 100, "%", 1, true),
    ],
    [
      { id: "ueberraschung", text: "Stelle 1 % Kranke ein; der Test erkennt 90 % der Kranken und 90 % der Gesunden. Wie oft stimmt ein positiver Test?", check: (v) => v.prev === 1 && v.sens === 90 && v.spec === 90 },
      { id: "fuenfzig", text: "Bei 1 % Kranken und 90 % erkannten Kranken: Wie gut muss der Test Gesunde erkennen, damit ein positiver Test zu mindestens 50 % stimmt?", check: (v) => v.prev === 1 && v.sens === 90 && testTable(v).ppv >= 0.5 },
      { id: "nutzlos", text: "Mache den Test nutzlos: Unter den Positiven ist der Anteil Kranker genauso groß wie in der ganzen Gruppe.", check: (v) => Math.abs(testTable(v).ppv - v.prev / 100) < 1e-9 },
    ],
  ),
  exercises: [
    {
      id: "test",
      make: (rng, level) => {
        const prev = rng.pick([1, 2, 5, 10]);
        const sens = rng.pick([80, 90, 95, 98]);
        const falsePos = rng.pick([2, 5, 10]);
        const sick = 10 * prev;
        const tp = (sick * sens) / 100;
        const fp = ((1000 - sick) * falsePos) / 100;
        const share = tp / (tp + fp);
        if (level === 1) {
          return task(
            level,
            `Von 1.000 Personen sind ${prev} % krank. Ein Test erkennt ${sens} % der Kranken. Bei ${falsePos} % der Gesunden zeigt er fälschlich „positiv“. Berechne die richtig positiven und die falsch positiven Tests und den Anteil Kranker unter allen Positiven.`,
            [num("richtig positiv:", tp, "", 1), num("falsch positiv:", fp, "", 1), num("Anteil krank:", pct(share), "%", 2, { slips: [{ value: sens, hint: "Gefragt ist der Anteil unter den Positiven: richtig positiv : alle Positiven." }] })],
            "Kranke = 1.000 · Anteil; richtig positiv = Kranke · Erkennungsrate; falsch positiv = Gesunde · Fehlerrate.",
            [`Kranke: ${sick}, Gesunde: ${1000 - sick}`, `richtig positiv: ${sick} · ${sens} % = ${fmt(tp, 1)}`, `falsch positiv: ${1000 - sick} · ${falsePos} % = ${fmt(fp, 1)}`, `${fmt(tp, 1)} : ${fmt(tp + fp, 1)}`],
            `${fmt(tp, 1)} richtig und ${fmt(fp, 1)} falsch positiv, Anteil krank ${eq(pct(share))} ${fmt(pct(share), 2)} %`,
            { prev, sens, falsePos },
            [`1.000 Personen, ${prev} % krank`, `erkennt ${sens} % der Kranken, ${falsePos} % falsch positiv`],
          );
        }
        return task(
          level,
          `Eine Zeitung schreibt: „Der Test erkennt ${sens} % der Erkrankten. Wer positiv getestet wird, ist also zu ${sens} % krank.“ In der Bevölkerung sind ${prev} % erkrankt, und bei ${falsePos} % der Gesunden ist der Test fälschlich positiv. Stimmt die Aussage? Berechne den tatsächlichen Anteil Kranker unter den Positiven.`,
          [yesNo("Aussage stimmt?", same(pct(share), sens)), num("tatsächlich:", pct(share), "%", 2, { slips: [{ value: sens, hint: "Rechne mit 1.000 Personen: Unter den Positiven sind auch viele Gesunde." }] })],
          "Mit 1.000 Personen rechnen: richtig positive und falsch positive zählen.",
          [`Kranke ${sick}: richtig positiv ${fmt(tp, 1)}`, `Gesunde ${1000 - sick}: falsch positiv ${fmt(fp, 1)}`, `Anteil: ${fmt(tp, 1)} : ${fmt(tp + fp, 1)}`],
          `Die Aussage stimmt nicht: nur ${eq(pct(share))} ${fmt(pct(share), 2)} % der Positiven sind krank`,
          { prev, sens, falsePos },
        );
      },
    },
    {
      id: "darstellung",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(3, 6);
          const coin = rng.next() < 0.5;
          const p = coin ? 0.5 : 1 / 6;
          const thing = coin ? "Eine Münze zeigte" : "Ein Würfel zeigte";
          const result = coin ? "Kopf" : "eine Sechs";
          return task(
            level,
            `${thing} ${n}-mal nacheinander ${result}. Wie wahrscheinlich ist beim nächsten Wurf wieder ${result}? Wie wahrscheinlich war es vorher, ${n + 1}-mal nacheinander ${result} zu werfen?`,
            [
              percentField("nächster Wurf:", p, { slips: [{ value: pct(p ** (n + 1)), hint: "Für den nächsten Wurf zählt nur dieser eine Wurf: Der Zufall hat kein Gedächtnis." }] }),
              percentField(`${n + 1}-mal:`, p ** (n + 1)),
            ],
            "Jeder Wurf ist unabhängig. Die ganze Serie: Wahrscheinlichkeiten entlang des Pfades multiplizieren.",
            [`nächster Wurf: ${coin ? "1/2" : "1/6"}`, `Serie: (${coin ? "1/2" : "1/6"}) hoch ${n + 1}`],
            `nächster Wurf ${fmt(pct(p), 2)} %, ganze Serie ${eq(pct(p ** (n + 1)))} ${fmt(pct(p ** (n + 1)), 2)} %`,
            { n, coin: coin ? 1 : 0 },
          );
        }
        const before = rng.pick([20, 24, 30, 40]);
        const after = before + rng.pick([1, 2, 3, 4]);
        const start = before - rng.pick([1, 2]);
        const real = ((after - before) / before) * 100;
        const looks = (after - start) / (before - start);
        return task(
          level,
          `Ein Säulendiagramm zeigt, dass der Anteil der Radfahrer an einer Schule von ${before} % auf ${after} % gestiegen ist. Die senkrechte Achse beginnt bei ${start} %. Um wie viel Prozent ist der Anteil tatsächlich gestiegen? Wie viel Mal so hoch wirkt die zweite Säule?`,
          [num("tatsächlich:", real, "%", 2, { slips: [{ value: after - before, hint: "Das sind Prozentpunkte. Gefragt ist die Zunahme bezogen auf den alten Wert." }] }), num("wirkt:", looks, "mal so hoch", 2)],
          "Tatsächliche Zunahme: (neu − alt) : alt · 100 %. Sichtbare Höhen: ab dem Beginn der Achse.",
          [`(${after} − ${before}) : ${before} · 100 %`, `sichtbare Höhen: ${after} − ${start} = ${after - start} und ${before} − ${start} = ${before - start}`, `${after - start} : ${before - start}`],
          `tatsächlich ${eq(real)} ${fmt(real, 2)} % mehr, die Säule wirkt ${eq(looks)} ${fmt(looks, 2)}-mal so hoch`,
          { before, after, start },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  6,
  "Baumdiagramme, Pfadregeln, Permutationen und statistische Aussagen",
  "#15803d",
  "🎲",
  [baum, pfadregeln, permutationen, fehldeutungen],
);
