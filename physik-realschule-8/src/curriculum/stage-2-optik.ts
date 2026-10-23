import { fmt, fmtUnit } from "../exercises/format";
import { C_LIGHT } from "../lab/engine";
import {
  criticalAngle,
  eclipseKind,
  exitAngle,
  eyeFocusShift,
  eyeState,
  lensImage,
  moonAngle,
  moonLit,
  moonPhaseName,
  refractionAngle,
  shadowSizes,
} from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-2-optik";

// 2.1 Licht breitet sich aus ───────────────────────────────────────────────

const lichtausbreitung: Lesson = {
  id: "op-1-lichtausbreitung",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Licht breitet sich aus: Sender, Empfänger, Strahl",
  subtitle: "Wie das Licht ins Auge kommt und wie schnell es ist",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Ausbreitung des Lichts: Sender, Empfänger, Lichtgeschwindigkeit, Lichtstrahl als Modell",
  whyItMatters:
    "Früher glaubten viele, das Auge sende Sehstrahlen aus. Das Sender-Empfänger-Modell erklärt, warum du nachts ohne Lampe nichts siehst und warum du den Mond siehst, obwohl er nicht selbst leuchtet.",
  explanationHtml: `
    <p><strong>Lichtquellen</strong> (Sender) leuchten selbst: Sonne, Lampe, Kerze. <strong>Beleuchtete Körper</strong> (Mond, Buch, Wand) leuchten nicht selbst; sie werfen das Licht einer Lichtquelle in alle Richtungen zurück.</p>
    <p><strong>Sender-Empfänger-Modell:</strong> Vom Sender geht Licht aus, ein Empfänger (Auge, Kamera, Solarzelle) nimmt es auf. Wir <strong>sehen</strong> einen Gegenstand, wenn Licht von ihm in unser Auge gelangt. Das Auge sendet nichts aus.</p>
    <ul>
      <li>In einem Stoff mit überall gleichen Eigenschaften (Luft, Wasser, Glas) breitet sich Licht <strong>geradlinig</strong> aus.</li>
      <li>Als Modell zeichnet man <strong>Lichtstrahlen</strong>: gerade Linien mit Pfeil in Ausbreitungsrichtung. Ein Lichtbündel besteht aus vielen Strahlen.</li>
      <li><strong>Lichtgeschwindigkeit</strong> im Vakuum: c ≈ 300 000 km/s. Das Licht der Sonne braucht rund 8 min 20 s zur Erde, das des Mondes etwa 1,3 s.</li>
      <li>Ein <strong>Lichtjahr</strong> ist die Strecke, die Licht in einem Jahr zurücklegt: etwa 9,5 Billionen km.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Ohne Licht von einer Quelle sieht man nichts. Jeder nicht selbstleuchtende Körper ist nur sichtbar, wenn er beleuchtet wird.</div>
  `,
  formulas: [
    { name: "Lichtweg", html: "s = c · t", quantities: "c ≈ 300 000 km/s ≈ 3 · 10<sup>8</sup> m/s" },
    { name: "Laufzeit", html: "t = s / c", quantities: "s in km, t in s" },
    { name: "Lichtjahr", html: "1 Lichtjahr ≈ 9,5 · 10<sup>12</sup> km", quantities: "c · 1 Jahr" },
  ],
  quiz: {
    question: "Du siehst im Zimmer ein Buch auf dem Tisch. Warum?",
    options: [
      "Dein Auge sendet Sehstrahlen aus, die das Buch abtasten",
      "Das Buch leuchtet selbst, nur schwach",
      "Licht einer Lichtquelle wird vom Buch in dein Auge gestreut",
    ],
    correctIndex: 2,
    explanation: "Das Buch ist nicht selbstleuchtend. Es streut Licht der Lampe oder des Fensters, und ein Teil davon gelangt in dein Auge, den Empfänger.",
  },
  lab: {
    kind: "seeing",
    title: "Labor: Wann siehst du etwas?",
    intro: "Schalte die Lampe an oder aus und stelle ein Buch auf. Verfolge, wohin das Licht läuft, damit es in dein Auge kommt.",
    params: [
      { type: "choice", key: "lamp", label: "Lampe", options: [{ value: 0, label: "aus" }, { value: 1, label: "an" }], value: 0 },
      { type: "choice", key: "book", label: "Buch", options: [{ value: 0, label: "kein Buch" }, { value: 1, label: "Buch steht da" }], value: 0 },
    ],
    readouts: [
      { key: "lampSeen", label: "Die Lampe (Sender)", compute: (v) => (v.lamp === 1 ? "leuchtet, Licht kommt ins Auge" : "dunkel, kein Licht") },
      { key: "bookSeen", label: "Das Buch (nicht selbstleuchtend)", compute: (v) => (v.book === 0 ? "nicht vorhanden" : v.lamp === 1 ? "sichtbar, es streut Licht der Lampe ins Auge" : "unsichtbar, es leuchtet nicht selbst") },
    ],
    goals: [
      { id: "lampe-direkt", text: "Schalte die Lampe an: Du siehst sie direkt, denn sie ist selbst Sender.", check: (v) => v.lamp === 1 },
      { id: "buch-sichtbar", text: "Lampe an und Buch aufgestellt: Du siehst das Buch, weil es Licht der Lampe ins Auge streut.", check: (v) => v.lamp === 1 && v.book === 1 },
      { id: "buch-dunkel", text: "Lampe aus, Buch aufgestellt: Das Buch bleibt unsichtbar.", check: (v) => v.lamp === 0 && v.book === 1 },
    ],
  },
  exercises: [
    {
      id: "lichtlaufzeit",
      make: (rng, level) => {
        if (level === 1) {
          const target = rng.pick([
            { name: "dem Mond", km: 384_400, unit: "s", div: 1 },
            { name: "einem Satelliten in 36 000 km Höhe", km: 36_000, unit: "s", div: 1 },
            { name: "der Sonne", km: 149_600_000, unit: "min", div: 60 },
            { name: "dem Mars (kleinster Abstand)", km: 78_000_000, unit: "min", div: 60 },
          ]);
          const t = target.km / C_LIGHT / target.div;
          return {
            prompt: `Wie lange braucht Licht von der Erde zu ${target.name}? Die Entfernung beträgt ${fmtUnit(target.km, "km", 0)}.`,
            given: [`s = ${fmtUnit(target.km, "km", 0)}`, "c = 300 000 km/s"],
            formulaHint: `t = s / c${target.unit === "min" ? " (dann durch 60 für Minuten)" : ""}`,
            answer: t,
            unit: target.unit,
            digits: target.unit === "s" ? 2 : 1,
            solutionHtml: `t = s / c = ${fmt(target.km, 0)} km / 300 000 km/s = ${fmt(target.km / C_LIGHT, 2)} s${target.unit === "min" ? ` = <strong>${fmtUnit(t, "min", 1)}</strong>` : `, also <strong>${fmtUnit(t, "s", 2)}</strong>`}`,
          };
        }
        const tS = rng.pick([2.5, 2.55, 2.6, 2.65]);
        const d = (C_LIGHT * tS) / 2;
        return {
          prompt: `Ein Laserpuls läuft von der Erde zu einem Reflektor auf dem Mond und zurück. Die Laufzeit beträgt ${fmtUnit(tS, "s", 2)}. Wie weit ist der Reflektor entfernt?`,
          given: [`Hin- und Rückweg: t = ${fmtUnit(tS, "s", 2)}`, "c = 300 000 km/s"],
          answer: d,
          unit: "km",
          digits: 0,
          solutionHtml: `Gesamtweg = c · t = 300 000 km/s · ${fmt(tS, 2)} s = ${fmt(C_LIGHT * tS, 0)} km<br>Das Licht läuft die Strecke zweimal: s = ${fmt(C_LIGHT * tS, 0)} km / 2 = <strong>${fmtUnit(d, "km", 0)}</strong>`,
        };
      },
    },
    {
      id: "lichtjahr",
      make: (rng, level) => {
        const perYear = (C_LIGHT * 365.25 * 86_400) / 1e12;
        if (level === 1) {
          const years = rng.int(1, 5);
          return {
            prompt: `Licht legt in einem Jahr etwa ${fmt(perYear, 2)} Billionen Kilometer (10¹² km) zurück. Welche Strecke legt es in ${years} ${years === 1 ? "Jahr" : "Jahren"} zurück?`,
            given: [`Strecke in einem Jahr: ${fmtUnit(perYear, "· 10¹² km", 2)}`, `Zeit: ${years} ${years === 1 ? "Jahr" : "Jahre"}`],
            formulaHint: "s = Strecke pro Jahr · Anzahl der Jahre",
            answer: perYear * years,
            unit: "· 10¹² km",
            digits: 2,
            solutionHtml: `s = ${fmt(perYear, 2)} · 10¹² km · ${years} = <strong>${fmtUnit(perYear * years, "· 10¹² km", 2)}</strong>`,
          };
        }
        const d = rng.pick([4.2, 8.6, 11.9, 25]);
        return {
          prompt: `Ein Stern ist ${fmtUnit(d, "Lichtjahre", 1)} von uns entfernt. Ein Funksignal breitet sich wie Licht aus. Wie viele Jahre dauert es, bis auf eine Frage von uns die Antwort (hin und zurück) eintrifft?`,
          given: [`Entfernung: ${fmtUnit(d, "Lichtjahre", 1)}`],
          answer: 2 * d,
          unit: "Jahre",
          digits: 1,
          solutionHtml: `Das Signal braucht ${fmt(d, 1)} Jahre hin und ebenso zurück: <strong>${fmtUnit(2 * d, "Jahre", 1)}</strong>.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst das Sehen mit Sender und Empfänger und rechnest mit der Lichtgeschwindigkeit.",
};

// 2.2 Schatten ─────────────────────────────────────────────────────────────

const OBJECT_DIAMETER = 10; // cm, in the shadow lab

const schatten: Lesson = {
  id: "op-2-schatten",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Schatten",
  subtitle: "Kernschatten, Halbschatten und die Lochkamera",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Schatten, Modell der Lichtausbreitung",
  whyItMatters:
    "Der Schatten verrät, dass sich Licht geradlinig ausbreitet. Schatten sind scharf oder verschwommen, je nachdem, wie groß die Lichtquelle ist, und mit einer Dose kann man eine Kamera bauen.",
  explanationHtml: `
    <p>Ein undurchsichtiger Körper hält Licht auf. Hinter ihm entsteht ein <strong>Schatten</strong>, weil sich Licht <strong>geradlinig</strong> ausbreitet.</p>
    <ul>
      <li><strong>Punktförmige Lichtquelle:</strong> ein scharf begrenzter Schatten. Seine Größe folgt aus der Strahlenzeichnung: <strong>S = D · (a + b) / a</strong> (D Durchmesser des Körpers, a Abstand Lichtquelle–Körper, b Abstand Körper–Schirm).</li>
      <li><strong>Ausgedehnte Lichtquelle</strong> (Sonne, Leuchtstoffröhre): Es entsteht ein <strong>Kernschatten</strong> (hier erreicht das Licht der Quelle den Schirm gar nicht) und ein <strong>Halbschatten</strong> (hier sieht man noch einen Teil der Lichtquelle).</li>
      <li>Je näher der Körper am Schirm, desto kleiner und schärfer der Schatten.</li>
      <li><strong>Lochkamera:</strong> Durch ein kleines Loch entsteht ein umgekehrtes Bild. Die Größen verhalten sich wie die Abstände: <strong>B / G = b / g</strong>.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Schatten entstehen, weil sich Licht geradlinig ausbreitet. Eine große Lichtquelle macht einen unscharfen Schatten mit Halbschatten.</div>
  `,
  formulas: [
    { name: "Schattengröße (Punktlicht)", html: "S = D · (a + b) / a", quantities: "D Körperdurchmesser, a Lichtquelle–Körper, b Körper–Schirm" },
    { name: "Lochkamera", html: "B / G = b / g", quantities: "B Bildgröße, G Gegenstandsgröße, b Lochtiefe, g Abstand Gegenstand–Loch" },
  ],
  quiz: {
    question: "Der Schatten deiner Hand im Sonnenlicht hat einen unscharfen Rand. Was ist die Ursache?",
    options: [
      "Die Sonne ist keine punktförmige Lichtquelle, es entsteht ein Halbschatten",
      "Licht breitet sich nicht geradlinig aus",
      "Die Hand ist am Rand durchsichtig",
    ],
    correctIndex: 0,
    explanation: "Von verschiedenen Punkten der Sonnenscheibe fällt Licht aus verschiedenen Richtungen an der Hand vorbei. Dadurch entsteht neben dem Kernschatten ein Halbschatten.",
  },
  lab: {
    kind: "shadow",
    title: "Labor: Schatten einer Scheibe",
    intro: "Eine Scheibe (Durchmesser 10 cm) steht zwischen Lampe und Schirm. Ändere die Größe der Lampe und die Abstände und beobachte Kern- und Halbschatten.",
    params: [
      {
        type: "choice",
        key: "src",
        label: "Lampe",
        options: [
          { value: 0, label: "punktförmig" },
          { value: 4, label: "klein (4 cm)" },
          { value: 10, label: "groß (10 cm)" },
          { value: 20, label: "Flächenlampe (20 cm)" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "Abstand Lampe–Scheibe a", unit: "cm", min: 20, max: 80, step: 10, value: 40 },
      { type: "range", key: "b", label: "Abstand Scheibe–Schirm b", unit: "cm", min: 10, max: 80, step: 10, value: 30 },
    ],
    readouts: [
      { key: "umbra", label: "Kernschatten auf dem Schirm", unit: "cm", digits: 1, emphasis: true, compute: (v) => shadowSizes(v.src, OBJECT_DIAMETER, v.a, v.b).umbra },
      { key: "penumbra", label: "Schatten insgesamt, mit Halbschatten", unit: "cm", digits: 1, compute: (v) => shadowSizes(v.src, OBJECT_DIAMETER, v.a, v.b).penumbra },
      { key: "ratio", label: "Kernschatten : Scheibe", digits: 2, compute: (v) => shadowSizes(v.src, OBJECT_DIAMETER, v.a, v.b).umbra / OBJECT_DIAMETER },
    ],
    goals: [
      { id: "doppelt", text: "Mit punktförmiger Lampe wird der Schatten genau doppelt so groß wie die Scheibe (20 cm).", check: (v, r) => v.src === 0 && near(Number(r.umbra), 20, 0.01) },
      { id: "halbschatten", text: "Mit der großen Lampe (10 cm) ist der Halbschatten zusammen mindestens 20 cm breiter als der Kernschatten.", check: (v, r) => v.src >= 10 && Number(r.penumbra) - Number(r.umbra) >= 20 },
      { id: "kein-kern", text: "Mit der Flächenlampe (20 cm) gibt es gar keinen Kernschatten mehr auf dem Schirm.", check: (v, r) => v.src === 20 && Number(r.umbra) === 0 },
    ],
  },
  exercises: [
    {
      id: "schattengroesse",
      make: (rng, level) => {
        if (level === 1) {
          const D = rng.pick([5, 6, 8, 10, 12]);
          const a = rng.pick([20, 25, 40, 50]);
          const b = rng.pick([20, 25, 30, 50, 75, 100]);
          const S = (D * (a + b)) / a;
          return {
            prompt: `Eine punktförmige Lichtquelle steht ${fmtUnit(a, "cm", 0)} vor einer Scheibe mit ${fmtUnit(D, "cm", 0)} Durchmesser. Der Schirm ist ${fmtUnit(b, "cm", 0)} hinter der Scheibe. Wie groß ist der Schatten?`,
            given: [`D = ${fmtUnit(D, "cm", 0)}`, `a = ${fmtUnit(a, "cm", 0)}`, `b = ${fmtUnit(b, "cm", 0)}`],
            formulaHint: "S = D · (a + b) / a",
            answer: S,
            unit: "cm",
            digits: 1,
            solutionHtml: `S = D · (a + b) / a = ${fmt(D, 0)} cm · ${fmt(a + b, 0)} / ${fmt(a, 0)} = <strong>${fmtUnit(S, "cm", 1)}</strong>`,
          };
        }
        const D = rng.pick([2.4, 3, 4]);
        const aM = rng.pick([0.4, 0.5, 0.6]);
        const bM = rng.pick([1.2, 1.5, 2.4]);
        const S = (D * (aM + bM)) / aM;
        return {
          prompt: `Eine Taschenlampe (als Punktquelle) leuchtet aus ${fmtUnit(aM, "m", 1)} Entfernung auf eine Münze (Durchmesser ${fmtUnit(D, "cm", 1)}). Die Wand ist ${fmtUnit(bM, "m", 1)} hinter der Münze. Wie groß ist der Schatten auf der Wand?`,
          given: [`D = ${fmtUnit(D, "cm", 1)}`, `a = ${fmtUnit(aM, "m", 1)}`, `b = ${fmtUnit(bM, "m", 1)}`],
          answer: S,
          unit: "cm",
          digits: 1,
          solutionHtml: `Gleiche Einheit für a und b genügt: (a + b) / a = ${fmt(aM + bM, 1)} / ${fmt(aM, 1)} = ${fmt((aM + bM) / aM, 2)}<br>S = ${fmt(D, 1)} cm · ${fmt((aM + bM) / aM, 2)} = <strong>${fmtUnit(S, "cm", 1)}</strong>`,
        };
      },
    },
    {
      id: "lochkamera",
      make: (rng, level) => {
        if (level === 1) {
          const G = rng.pick([10, 12, 20, 30]);
          const g = rng.pick([50, 60, 100, 120]);
          const b = rng.pick([10, 12, 15, 20]);
          const B = (G * b) / g;
          return {
            prompt: `Eine Kerze (${fmtUnit(G, "cm", 0)} hoch) steht ${fmtUnit(g, "cm", 0)} vor dem Loch einer Lochkamera. Die Kamera ist ${fmtUnit(b, "cm", 0)} tief. Wie hoch ist das Bild der Kerze?`,
            given: [`G = ${fmtUnit(G, "cm", 0)}`, `g = ${fmtUnit(g, "cm", 0)}`, `b = ${fmtUnit(b, "cm", 0)}`],
            formulaHint: "B / G = b / g, also B = G · b / g",
            answer: B,
            unit: "cm",
            digits: 2,
            solutionHtml: `B = G · b / g = ${fmt(G, 0)} cm · ${fmt(b, 0)} / ${fmt(g, 0)} = <strong>${fmtUnit(B, "cm", 2)}</strong> (umgekehrt)`,
          };
        }
        const G = rng.pick([8, 10, 12, 15]);
        const g = rng.pick([20, 30, 40]);
        const b = rng.pick([10, 12, 15, 20]);
        const B = (G * b) / g;
        return {
          prompt: `Ein Baum ist ${fmtUnit(G, "m", 0)} hoch und steht ${fmtUnit(g, "m", 0)} vor einer Lochkamera, die ${fmtUnit(b, "cm", 0)} tief ist. Wie hoch ist das (umgekehrte) Bild des Baumes in Zentimetern?`,
          given: [`G = ${fmtUnit(G, "m", 0)}`, `g = ${fmtUnit(g, "m", 0)}`, `b = ${fmtUnit(b, "cm", 0)}`],
          answer: B,
          unit: "cm",
          digits: 1,
          solutionHtml: `B = G · b / g = ${fmt(G, 0)} m · ${fmt(b, 0)} cm / ${fmt(g, 0)} m = <strong>${fmtUnit(B, "cm", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest aus der Strahlenzeichnung ab, wie groß Schatten und Bild werden.",
};

// 2.3 Finsternisse und Mondphasen ──────────────────────────────────────────

const finsternisse: Lesson = {
  id: "op-3-finsternisse",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Finsternisse und Mondphasen",
  subtitle: "Sonne, Erde und Mond im Schattenspiel",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Schatten und Finsternisse modellieren; Sender-Empfänger-Modell",
  whyItMatters:
    "Eine Sonnenfinsternis lässt mitten am Tag die Sterne erscheinen. Lange galt sie als Zeichen von Unheil. Mit dem Lichtmodell lässt sie sich voraussagen, Jahrhunderte im Voraus.",
  explanationHtml: `
    <p>Der <strong>Mond</strong> ist keine Lichtquelle. Immer die der Sonne zugewandte Hälfte ist beleuchtet. Je nach Stellung sehen wir von der Erde davon mehr oder weniger: die <strong>Mondphasen</strong> (Neumond, zunehmender Mond, Vollmond, abnehmender Mond). Von Neumond zu Neumond vergehen etwa <strong>29,5 Tage</strong>.</p>
    <ul>
      <li><strong>Sonnenfinsternis:</strong> Bei <strong>Neumond</strong> steht der Mond zwischen Sonne und Erde. Sein Schatten fällt auf die Erde: im Kernschatten total, im Halbschatten partiell.</li>
      <li><strong>Mondfinsternis:</strong> Bei <strong>Vollmond</strong> steht die Erde zwischen Sonne und Mond. Der Mond läuft durch den Erdschatten.</li>
      <li>Es gibt nicht bei jedem Neu- oder Vollmond eine Finsternis, denn die Mondbahn ist gegen die Erdbahn um etwa <strong>5°</strong> geneigt: Meist zieht der Mond über oder unter dem Schatten vorbei.</li>
      <li>Die Sonne ist etwa 400-mal größer als der Mond und etwa 400-mal weiter entfernt. Beide erscheinen fast gleich groß, deshalb sind totale Sonnenfinsternisse möglich.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Sonnenfinsternis: Neumond, Mond im Weg. Mondfinsternis: Vollmond, Mond im Erdschatten.</div>
  `,
  formulas: [
    { name: "Mondphasen-Periode", html: "T ≈ 29,5 d", quantities: "von Neumond zu Neumond" },
    { name: "Neumond → Vollmond", html: "t ≈ T / 2 ≈ 14,8 d", quantities: "Viertelphase ≈ T / 4 ≈ 7,4 d" },
  ],
  quiz: {
    question: "Bei einer Sonnenfinsternis steht …",
    options: [
      "die Erde zwischen Sonne und Mond",
      "der Mond zwischen Sonne und Erde",
      "die Sonne zwischen Erde und Mond",
    ],
    correctIndex: 1,
    explanation: "Der Mond schiebt sich vor die Sonne und wirft seinen Schatten auf die Erde. Das geht nur bei Neumond.",
  },
  lab: {
    kind: "eclipse",
    title: "Labor: Mondbahn und Finsternisse",
    intro: "Lass den Mond um die Erde laufen. Das Sonnenlicht kommt von links. Rechts unten siehst du den Mond, wie er von der Erde aus erscheint.",
    params: [
      { type: "range", key: "day", label: "Tage seit Neumond", unit: "d", min: 0, max: 29.5, step: 0.5, value: 7.5, digits: 1 },
      {
        type: "choice",
        key: "orbit",
        label: "Mondbahn",
        options: [
          { value: 0, label: "in der Ebene der Erdbahn (Modell)" },
          { value: 1, label: "5° geneigt (Wirklichkeit, Mond über oder unter dem Schatten)" },
          { value: 2, label: "5° geneigt, aber genau am Knoten" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "phase", label: "Mondphase", emphasis: true, compute: (v) => moonPhaseName(moonAngle(v.day)) },
      { key: "lit", label: "Von der Erde aus beleuchtet", unit: "%", digits: 0, compute: (v) => moonLit(moonAngle(v.day)) },
      { key: "eclipse", label: "Finsternis", emphasis: true, compute: (v) => eclipseKind(moonAngle(v.day), v.orbit) },
    ],
    goals: [
      { id: "sonnenfinsternis", text: "Erzeuge eine Sonnenfinsternis: Neumond bei Mondbahn in der Ebene.", check: (_v, r) => r.eclipse === "Sonnenfinsternis" },
      { id: "mondfinsternis", text: "Erzeuge eine Mondfinsternis: Vollmond und Mondbahn in der Ebene oder am Knoten.", check: (_v, r) => r.eclipse === "Mondfinsternis" },
      { id: "ohne-finsternis", text: "Stelle Vollmond bei geneigter Mondbahn ein: Der Mond zieht am Erdschatten vorbei, es gibt keine Finsternis.", check: (v, r) => v.orbit === 1 && r.phase === "Vollmond" },
    ],
  },
  exercises: [
    {
      id: "phasen-tage",
      make: (rng, level) => {
        const T = 29.5;
        if (level === 1) {
          const part = rng.pick([
            { name: "erstes Viertel (Halbmond)", f: 1 / 4 },
            { name: "Vollmond", f: 1 / 2 },
            { name: "letztes Viertel (Halbmond)", f: 3 / 4 },
          ]);
          return {
            prompt: `Von Neumond zu Neumond vergehen ${fmtUnit(T, "d", 1)}. Nach wie vielen Tagen nach Neumond ist ${part.name}?`,
            given: [`T = ${fmtUnit(T, "d", 1)}`, `Anteil der Periode: ${part.f === 1 / 4 ? "1/4" : part.f === 1 / 2 ? "1/2" : "3/4"}`],
            formulaHint: "t = Anteil · T",
            answer: part.f * T,
            unit: "d",
            digits: 1,
            solutionHtml: `t = ${part.f === 1 / 4 ? "1/4" : part.f === 1 / 2 ? "1/2" : "3/4"} · ${fmt(T, 1)} d = <strong>${fmtUnit(part.f * T, "d", 1)}</strong>`,
          };
        }
        const since = rng.int(2, 12);
        const next = T / 2 - since;
        return {
          prompt: `Vor ${since} Tagen war Vollmond. In wie vielen Tagen ist das nächste Mal Neumond? (Von Vollmond zu Neumond vergeht eine halbe Periode von ${fmtUnit(T, "d", 1)}.)`,
          given: [`T = ${fmtUnit(T, "d", 1)}`, `Vollmond vor ${since} Tagen`],
          answer: next,
          unit: "d",
          digits: 2,
          solutionHtml: `Halbe Periode: ${fmt(T / 2, 2)} d. Davon sind ${since} Tage vorbei: ${fmt(T / 2, 2)} d − ${since} d = <strong>${fmtUnit(next, "d", 2)}</strong>`,
        };
      },
    },
    {
      id: "scheinbare-groesse",
      make: (_rng, level) => {
        const moon = { D: 3476, d: 384_400 };
        const sun = { D: 1_392_000, d: 149_600_000 };
        const body = level === 1 ? moon : sun;
        const ratio = (body.D / body.d) * 1000;
        return {
          prompt: `Wie groß ein Himmelskörper am Himmel erscheint, hängt vom Verhältnis Durchmesser : Entfernung ab. Berechne es für ${level === 1 ? "den Mond" : "die Sonne"} (Durchmesser ${fmtUnit(body.D, "km", 0)}, Entfernung ${fmtUnit(body.d, "km", 0)}) in Promille (‰), also D : d · 1000.`,
          given: [`D = ${fmtUnit(body.D, "km", 0)}`, `d = ${fmtUnit(body.d, "km", 0)}`],
          formulaHint: level === 1 ? "D : d · 1000" : undefined,
          answer: ratio,
          unit: "‰",
          digits: 2,
          tolerance: 0.03,
          solutionHtml: `D : d = ${fmt(body.D, 0)} / ${fmt(body.d, 0)} = ${fmt(body.D / body.d, 5)}, das sind <strong>${fmtUnit(ratio, "‰", 2)}</strong>. Mond (9,04 ‰) und Sonne (9,30 ‰) erscheinen fast gleich groß, deshalb sind totale Sonnenfinsternisse möglich.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du ordnest Mondphasen und Finsternisse den Stellungen von Sonne, Erde und Mond zu.",
};

// 2.4 Reflexion und Spiegelbild ────────────────────────────────────────────

const reflexion: Lesson = {
  id: "op-4-reflexion",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "2.4 Reflexion und Spiegelbild",
  subtitle: "Einfallswinkel gleich Reflexionswinkel",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Reflexion des Lichts: gerichtete und diffuse Reflexion, Spiegelbild",
  whyItMatters:
    "Nur weil Licht von Gegenständen zurückgeworfen wird, siehst du sie. Spiegel, Straßenschilder und Rückstrahler nutzen das gezielt, und eine einzige Regel genügt, um alle Strahlenwege zu zeichnen.",
  explanationHtml: `
    <p>Trifft Licht auf eine Fläche, wird ein Teil zurückgeworfen: <strong>Reflexion</strong>.</p>
    <p><strong>Reflexionsgesetz:</strong> Der <strong>Einfallswinkel α</strong> ist gleich dem <strong>Reflexionswinkel β</strong>. Beide misst man zwischen Strahl und <strong>Lot</strong> (der Senkrechten auf der Fläche). Einfallender Strahl, Lot und reflektierter Strahl liegen in einer Ebene.</p>
    <p class="formula-line">α = β</p>
    <ul>
      <li><strong>Gerichtete Reflexion</strong> an glatten Flächen (Spiegel, ruhiges Wasser): Parallele Strahlen bleiben parallel.</li>
      <li><strong>Diffuse Reflexion</strong> an rauen Flächen (Papier, Wand): Jeder Strahl folgt dem Reflexionsgesetz, aber die Lote zeigen in alle Richtungen, das Licht wird gestreut. Nur so sehen wir nicht selbstleuchtende Körper aus jeder Richtung.</li>
      <li><strong>Spiegelbild:</strong> virtuell (Licht scheint nur von dort zu kommen), gleich groß, aufrecht, seitenvertauscht. Das Bild liegt so weit hinter dem Spiegel, wie der Gegenstand davor steht.</li>
      <li>Dreht man einen Spiegel um den Winkel δ, dreht sich der reflektierte Strahl um <strong>2 · δ</strong>.</li>
      <li>Anwendung: Straßenschilder und Rückstrahler (Katzenaugen) werfen Scheinwerferlicht zurück zum Fahrer.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Winkel werden immer zum Lot gemessen, nicht zur Fläche.</div>
  `,
  formulas: [
    { name: "Reflexionsgesetz", html: "α = β", quantities: "beide zum Lot gemessen" },
    { name: "Winkel zur Fläche", html: "α = 90° − γ", quantities: "γ Winkel zwischen Strahl und Spiegelfläche" },
    { name: "Spiegeldrehung", html: "Strahldrehung = 2 · δ", quantities: "δ Drehwinkel des Spiegels" },
    { name: "Spiegelbild", html: "Bildweite = Gegenstandsweite", quantities: "Abstand zum Spiegel" },
  ],
  quiz: {
    question: "Du stehst 2 m vor einem Spiegel. Wo scheint dein Spiegelbild zu sein?",
    options: [
      "Genau auf der Spiegelfläche",
      "Doppelt so weit hinter dem Spiegel, 4 m",
      "2 m hinter dem Spiegel, so weit wie du davor stehst",
    ],
    correctIndex: 2,
    explanation: "Das Spiegelbild liegt symmetrisch zum Spiegel: gleiche Entfernung dahinter. Der Abstand zwischen dir und deinem Bild beträgt 4 m.",
  },
  lab: {
    kind: "reflection",
    title: "Labor: Spiegel und raue Fläche",
    intro: "Ein Lichtstrahl trifft auf eine Fläche. Stelle Einfallswinkel, Spiegeldrehung und Oberfläche ein und vergleiche α mit β.",
    params: [
      { type: "range", key: "alpha", label: "Einfallswinkel α (Spiegel nicht gedreht)", unit: "°", min: 0, max: 60, step: 5, value: 30 },
      { type: "range", key: "delta", label: "Spiegel gedreht um δ", unit: "°", min: -20, max: 20, step: 5, value: 0 },
      { type: "choice", key: "surface", label: "Oberfläche", options: [{ value: 0, label: "glatter Spiegel" }, { value: 1, label: "raue Fläche (Papier)" }], value: 0 },
    ],
    readouts: [
      { key: "alphaE", label: "Einfallswinkel zum Lot", unit: "°", digits: 0, emphasis: true, compute: (v) => Math.abs(v.alpha + v.delta) },
      { key: "beta", label: "Reflexionswinkel zum Lot", unit: "°", digits: 0, emphasis: true, compute: (v) => Math.abs(v.alpha + v.delta) },
      { key: "turn", label: "Der reflektierte Strahl dreht sich um", unit: "°", digits: 0, compute: (v) => Math.abs(2 * v.delta) },
      { key: "kind", label: "Art der Reflexion", compute: (v) => (v.surface === 0 ? "gerichtete Reflexion" : "diffuse Reflexion (Streuung)") },
    ],
    goals: [
      { id: "vierzig", text: "Am glatten Spiegel soll der Einfallswinkel zum Lot 40° betragen: Dann ist auch der Reflexionswinkel 40°.", check: (v, r) => v.surface === 0 && Number(r.alphaE) === 40 },
      { id: "zehn-grad", text: "Drehe den glatten Spiegel um 10°: Der reflektierte Strahl dreht sich um 20°.", check: (v, r) => v.surface === 0 && v.delta === 10 && Number(r.turn) === 20 },
      { id: "diffus", text: "Wähle die raue Fläche: Das Licht wird diffus in viele Richtungen reflektiert.", check: (v) => v.surface === 1 },
    ],
  },
  exercises: [
    {
      id: "reflexionswinkel",
      make: (rng, level) => {
        if (level === 1) {
          if (rng.int(0, 1) === 0) {
            const alpha = rng.int(2, 17) * 5;
            return {
              prompt: `Ein Lichtstrahl trifft unter dem Einfallswinkel ${fmtUnit(alpha, "°", 0)} (zum Lot) auf einen ebenen Spiegel. Unter welchem Winkel zum Lot wird er reflektiert?`,
              given: [`α = ${fmtUnit(alpha, "°", 0)}`],
              formulaHint: "Reflexionsgesetz: β = α",
              answer: alpha,
              unit: "°",
              digits: 0,
              solutionHtml: `β = α = <strong>${fmtUnit(alpha, "°", 0)}</strong>`,
            };
          }
          const gamma = rng.int(2, 16) * 5;
          return {
            prompt: `Ein Lichtstrahl trifft so auf einen Spiegel, dass er mit der Spiegelfläche den Winkel ${fmtUnit(gamma, "°", 0)} bildet. Wie groß ist der Einfallswinkel zum Lot?`,
            given: [`Winkel zur Fläche γ = ${fmtUnit(gamma, "°", 0)}`],
            formulaHint: "α = 90° − γ",
            answer: 90 - gamma,
            unit: "°",
            digits: 0,
            solutionHtml: `Das Lot steht senkrecht auf der Fläche: α = 90° − ${fmt(gamma, 0)}° = <strong>${fmtUnit(90 - gamma, "°", 0)}</strong>`,
          };
        }
        const alpha = rng.int(3, 15) * 5;
        return {
          prompt: `Ein Lichtstrahl trifft mit einem Einfallswinkel von ${fmtUnit(alpha, "°", 0)} auf einen Spiegel. Wie groß ist der Winkel zwischen dem einfallenden und dem reflektierten Strahl?`,
          given: [`α = ${fmtUnit(alpha, "°", 0)}`],
          answer: 2 * alpha,
          unit: "°",
          digits: 0,
          solutionHtml: `β = α = ${fmt(alpha, 0)}°. Beide Winkel liegen auf verschiedenen Seiten des Lotes: ${fmt(alpha, 0)}° + ${fmt(alpha, 0)}° = <strong>${fmtUnit(2 * alpha, "°", 0)}</strong>`,
        };
      },
    },
    {
      id: "spiegel-abstand",
      make: (rng, level) => {
        if (level === 1) {
          const d = rng.pick([0.5, 0.8, 1, 1.5, 2, 2.5, 3]);
          return {
            prompt: `Du stehst ${fmtUnit(d, "m", 1)} vor einem Spiegel. Wie weit bist du von deinem Spiegelbild entfernt?`,
            given: [`Abstand zum Spiegel: ${fmtUnit(d, "m", 1)}`],
            formulaHint: "Bildweite = Gegenstandsweite, Abstand zum Bild = 2 · d",
            answer: 2 * d,
            unit: "m",
            digits: 1,
            solutionHtml: `Das Bild liegt ${fmt(d, 1)} m hinter dem Spiegel: Abstand zum Bild = <strong>${fmtUnit(2 * d, "m", 1)}</strong>`,
          };
        }
        const d = rng.pick([2.5, 3, 3.5, 4]);
        const x = rng.pick([0.5, 0.8, 1, 1.2]);
        return {
          prompt: `Du stehst ${fmtUnit(d, "m", 1)} vor einem Spiegel und gehst ${fmtUnit(x, "m", 1)} auf ihn zu. Wie weit bist du jetzt von deinem Spiegelbild entfernt?`,
          given: [`Start: ${fmtUnit(d, "m", 1)} vor dem Spiegel`, `Schritt: ${fmtUnit(x, "m", 1)} auf den Spiegel zu`],
          answer: 2 * (d - x),
          unit: "m",
          digits: 1,
          solutionHtml: `Neuer Abstand zum Spiegel: ${fmt(d, 1)} m − ${fmt(x, 1)} m = ${fmt(d - x, 1)} m<br>Abstand zum Bild: 2 · ${fmt(d - x, 1)} m = <strong>${fmtUnit(2 * (d - x), "m", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wendest das Reflexionsgesetz an und weißt, wo das Spiegelbild liegt.",
};

// 2.5 Brechung ─────────────────────────────────────────────────────────────

const brechung: Lesson = {
  id: "op-5-brechung",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "2.5 Brechung an Grenzflächen",
  subtitle: "Warum der Löffel im Wasser geknickt aussieht",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Brechung, optisch verschieden dichte Medien, Lichtgeschwindigkeit in Stoffen, optische Hebung",
  whyItMatters:
    "Der Strohhalm im Glas sieht geknickt aus, das Schwimmbecken wirkt flacher als es ist. Die Ursache: Licht ist in Wasser und Glas langsamer als in Luft.",
  explanationHtml: `
    <p>Beim Übergang von einem durchsichtigen Stoff in einen anderen ändert ein schräg einfallender Lichtstrahl seine Richtung: <strong>Brechung</strong>. Ursache: Die <strong>Lichtgeschwindigkeit</strong> ist in den Stoffen verschieden.</p>
    <ul>
      <li>Luft: etwa 300 000 km/s, Wasser: etwa 225 000 km/s, Glas: etwa 200 000 km/s, Diamant: etwa 124 000 km/s.</li>
      <li>Ein Stoff mit kleinerer Lichtgeschwindigkeit heißt <strong>optisch dichter</strong>.</li>
      <li>Von <strong>Luft in Wasser oder Glas</strong> wird der Strahl <strong>zum Lot hin</strong> gebrochen (β &lt; α). Von Glas oder Wasser in Luft wird er <strong>vom Lot weg</strong> gebrochen.</li>
      <li>Bei <strong>senkrechtem Einfall</strong> (α = 0°) knickt der Strahl nicht ab. Je stärker die Geschwindigkeiten sich unterscheiden, desto größer der Knick.</li>
      <li>Das Auge verlängert die gebrochenen Strahlen gerade nach hinten. Deshalb wirkt ein Gegenstand unter Wasser <strong>angehoben</strong> (<strong>optische Hebung</strong>): Das Becken scheint nur etwa ¾ so tief zu sein.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Brechung entsteht, weil sich die Lichtgeschwindigkeit beim Stoffwechsel ändert. Zum Lot hin, wenn das Licht langsamer wird.</div>
  `,
  formulas: [
    { name: "Lichtgeschwindigkeit im Stoff", html: "v = c / n", quantities: "n Brechzahl: Wasser 1,33, Glas 1,5, Diamant 2,42" },
    { name: "Scheinbare Tiefe", html: "d' ≈ d / n", quantities: "Wasser: d' ≈ ¾ · d" },
  ],
  quiz: {
    question: "Ein Lichtstrahl geht schräg von Luft in Wasser. Was geschieht?",
    options: [
      "Er wird zum Lot hin gebrochen, weil das Licht im Wasser langsamer ist",
      "Er wird vom Lot weg gebrochen",
      "Er geht ungebrochen weiter",
    ],
    correctIndex: 0,
    explanation: "Im optisch dichteren Wasser ist die Lichtgeschwindigkeit kleiner. Dadurch knickt der Strahl zum Lot hin.",
  },
  lab: {
    kind: "refraction",
    title: "Labor: Von Luft in einen durchsichtigen Stoff",
    intro: "Ein Lichtstrahl trifft schräg auf Wasser, Glas oder Diamant. Ändere den Einfallswinkel und beobachte den Knick und die Lichtgeschwindigkeit im Stoff.",
    params: [
      { type: "range", key: "alpha", label: "Einfallswinkel α zum Lot", unit: "°", min: 0, max: 80, step: 5, value: 30 },
      {
        type: "choice",
        key: "n",
        label: "Stoff (Brechzahl n)",
        options: [
          { value: 1.33, label: "Wasser, n = 1,33" },
          { value: 1.5, label: "Glas, n = 1,5" },
          { value: 2.42, label: "Diamant, n = 2,42" },
        ],
        value: 1.33,
      },
    ],
    readouts: [
      { key: "beta", label: "Brechungswinkel β zum Lot", unit: "°", digits: 1, emphasis: true, compute: (v) => refractionAngle(v.alpha, v.n) },
      { key: "turn", label: "Knick α − β", unit: "°", digits: 1, compute: (v) => v.alpha - refractionAngle(v.alpha, v.n) },
      { key: "v2", label: "Lichtgeschwindigkeit im Stoff", unit: "km/s", digits: 0, compute: (v) => C_LIGHT / v.n },
    ],
    goals: [
      { id: "wasser-vierzig", text: "Strahl unter 40° von Luft in Wasser: Der Brechungswinkel beträgt etwa 29°.", check: (v, r) => v.n === 1.33 && v.alpha === 40 && near(Number(r.beta), 28.9, 0.02) },
      { id: "diamant-stark", text: "Diamant bricht am stärksten: Bei α = 60° knickt der Strahl um mindestens 35° ab.", check: (v, r) => v.n === 2.42 && v.alpha === 60 && Number(r.turn) >= 35 },
      { id: "senkrecht", text: "Bei senkrechtem Einfall (α = 0°) knickt der Strahl nicht ab.", check: (v) => v.alpha === 0 },
    ],
  },
  exercises: [
    {
      id: "lichtgeschwindigkeit-stoff",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([
            { name: "Wasser", n: 1.33 },
            { name: "Glas", n: 1.5 },
            { name: "Diamant", n: 2.42 },
            { name: "Eis", n: 1.31 },
          ]);
          const v = C_LIGHT / m.n;
          return {
            prompt: `Berechne die Lichtgeschwindigkeit in ${m.name} mit der Brechzahl n = ${fmt(m.n, 2)}. Rechne mit c = 300 000 km/s.`,
            given: [`n = ${fmt(m.n, 2)}`, "c = 300 000 km/s"],
            formulaHint: "v = c / n",
            answer: v,
            unit: "km/s",
            digits: 0,
            solutionHtml: `v = c / n = 300 000 km/s / ${fmt(m.n, 2)} = <strong>${fmtUnit(v, "km/s", 0)}</strong>`,
          };
        }
        const n = rng.pick([1.33, 1.46, 1.5, 1.63, 2.42]);
        const v = C_LIGHT / n;
        return {
          prompt: `In einem Kunststoff läuft Licht mit ${fmtUnit(Math.round(v), "km/s", 0)}. Wie oft ist die Lichtgeschwindigkeit in Luft (300 000 km/s) größer? Das ist die Brechzahl n.`,
          given: [`v = ${fmtUnit(Math.round(v), "km/s", 0)}`, "c = 300 000 km/s"],
          answer: C_LIGHT / Math.round(v),
          unit: "(Zahl ohne Einheit)",
          digits: 2,
          tolerance: 0.02,
          solutionHtml: `n = c / v = 300 000 km/s / ${fmt(Math.round(v), 0)} km/s = <strong>${fmt(C_LIGHT / Math.round(v), 2)}</strong>`,
        };
      },
    },
    {
      id: "scheinbare-tiefe",
      make: (rng, level) => {
        const n = 1.33;
        if (level === 1) {
          const d = rng.pick([1.2, 1.6, 2, 2.4, 3, 4]);
          return {
            prompt: `Ein Schwimmbecken ist wirklich ${fmtUnit(d, "m", 1)} tief. Wie tief erscheint es von oben, wenn man senkrecht hineinschaut (Wasser: n = 1,33)?`,
            given: [`wirkliche Tiefe d = ${fmtUnit(d, "m", 1)}`, "n = 1,33"],
            formulaHint: "d' ≈ d / n",
            answer: d / n,
            unit: "m",
            digits: 2,
            solutionHtml: `d' = d / n = ${fmt(d, 1)} m / 1,33 = <strong>${fmtUnit(d / n, "m", 2)}</strong>`,
          };
        }
        const dApp = rng.pick([0.6, 0.9, 1.2, 1.5, 1.8]);
        return {
          prompt: `Ein Stein am Grund eines klaren Sees erscheint ${fmtUnit(dApp, "m", 1)} tief. Wie tief liegt er wirklich (Wasser: n = 1,33)?`,
          given: [`scheinbare Tiefe d' = ${fmtUnit(dApp, "m", 1)}`, "n = 1,33"],
          answer: dApp * n,
          unit: "m",
          digits: 2,
          solutionHtml: `d = d' · n = ${fmt(dApp, 1)} m · 1,33 = <strong>${fmtUnit(dApp * n, "m", 2)}</strong> (tiefer als gedacht!)`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst Knick und optische Hebung mit der Lichtgeschwindigkeit in den Stoffen.",
};

// 2.6 Totalreflexion ───────────────────────────────────────────────────────

const totalreflexion: Lesson = {
  id: "op-6-totalreflexion",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "2.6 Totalreflexion",
  subtitle: "Wenn das Licht den Stoff nicht mehr verlassen kann",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Brechung, Totalreflexion, Grenzwinkel; Anwendungen",
  whyItMatters:
    "Internet, Endoskopie und Diamantschliff beruhen darauf: Licht bleibt in einer Glasfaser gefangen und läuft um jede Kurve, weil es an der Wand komplett zurückgeworfen wird.",
  explanationHtml: `
    <p>Geht Licht vom <strong>optisch dichteren</strong> Stoff (Wasser, Glas) in den dünneren (Luft), wird es <strong>vom Lot weg</strong> gebrochen. Je größer der Einfallswinkel, desto flacher verläuft der austretende Strahl.</p>
    <ul>
      <li>Beim <strong>Grenzwinkel α<sub>g</sub></strong> streift der austretende Strahl die Grenzfläche (β = 90°). Wasser: 48,8°, Glas: etwa 42°, Diamant: 24,4°.</li>
      <li>Ist α <strong>größer als α<sub>g</sub></strong>, tritt kein Licht mehr aus: <strong>Totalreflexion</strong>. Das gesamte Licht wird nach dem Reflexionsgesetz zurückgeworfen.</li>
      <li><strong>Bedingungen:</strong> Das Licht läuft vom optisch dichteren in den dünneren Stoff <em>und</em> α &gt; α<sub>g</sub>.</li>
      <li><strong>Anwendungen:</strong> Umlenk- und Umkehrprismen in Fernglas und Fotoapparat (verlustärmer als Spiegel), Glasfaserkabel für Daten und Endoskope, Katzenaugen, das Funkeln von Diamanten.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Totalreflexion gibt es nur von dicht nach dünn und nur oberhalb des Grenzwinkels. Von Luft in Wasser gibt es sie nie.</div>
  `,
  formulas: [
    { name: "Bedingung", html: "α &gt; α<sub>g</sub> und dicht → dünn", quantities: "α Einfallswinkel zum Lot" },
    { name: "Grenzwinkel", html: "Wasser 48,8°, Glas 41,8°, Diamant 24,4°", quantities: "gegen Luft" },
    { name: "Laufzeit in der Faser", html: "t = L · n / c", quantities: "L Länge, n Brechzahl, c Lichtgeschwindigkeit in Luft" },
  ],
  quiz: {
    question: "Wann kann Totalreflexion auftreten?",
    options: [
      "Beim Übergang von Luft in Wasser unter flachem Winkel",
      "Beim Übergang von Glas in Luft, wenn der Einfallswinkel größer als der Grenzwinkel ist",
      "Immer, wenn Licht auf eine Grenzfläche trifft",
    ],
    correctIndex: 1,
    explanation: "Totalreflexion braucht den Weg von dichtem zu dünnem Stoff und einen Einfallswinkel über dem Grenzwinkel.",
  },
  lab: {
    kind: "total-reflection",
    title: "Labor: Licht im Glas oder Wasser trifft die Oberfläche von innen",
    intro: "Der Strahl läuft im Stoff nach oben auf die Grenzfläche zur Luft. Vergrößere den Einfallswinkel und finde den Grenzwinkel.",
    params: [
      { type: "range", key: "alpha", label: "Einfallswinkel α zum Lot", unit: "°", min: 0, max: 80, step: 5, value: 30 },
      {
        type: "choice",
        key: "n",
        label: "Stoff (Brechzahl n)",
        options: [
          { value: 1.33, label: "Wasser, n = 1,33" },
          { value: 1.5, label: "Glas, n = 1,5" },
          { value: 2.42, label: "Diamant, n = 2,42" },
        ],
        value: 1.5,
      },
    ],
    readouts: [
      { key: "alphaG", label: "Grenzwinkel α_g", unit: "°", digits: 1, emphasis: true, compute: (v) => criticalAngle(v.n) },
      { key: "state", label: "Was passiert", emphasis: true, compute: (v) => (v.alpha < criticalAngle(v.n) ? "Strahl tritt aus (Brechung)" : "Totalreflexion") },
      { key: "exit", label: "Austrittswinkel zum Lot", compute: (v) => { const e = exitAngle(v.alpha, v.n); return Number.isNaN(e) ? "kein Austritt" : `${fmt(e, 1)}°`; } },
    ],
    goals: [
      { id: "wasser-tr", text: "Erzeuge Totalreflexion in Wasser.", check: (v, r) => v.n === 1.33 && r.state === "Totalreflexion" },
      { id: "diamant-schnell", text: "In Diamant gibt es schon bei 25° Totalreflexion, weil der Grenzwinkel so klein ist.", check: (v, r) => v.n === 2.42 && v.alpha === 25 && r.state === "Totalreflexion" },
      { id: "glas-austritt", text: "Bei 40° in Glas liegt der Strahl noch unter dem Grenzwinkel und tritt aus.", check: (v, r) => v.n === 1.5 && v.alpha === 40 && r.state === "Strahl tritt aus (Brechung)" },
    ],
  },
  exercises: [
    {
      id: "glasfaser-laufzeit",
      make: (rng, level) => {
        const n = 1.5;
        if (level === 1) {
          const L = rng.pick([1, 2, 3, 5, 10]);
          const t = ((L * n) / C_LIGHT) * 1e6;
          return {
            prompt: `Ein Datensignal läuft durch ein ${fmtUnit(L, "km", 0)} langes Glasfaserkabel. Das Licht breitet sich in Glas mit v = c / n aus (n = 1,5, c = 300 000 km/s). Wie lange braucht es?`,
            given: [`L = ${fmtUnit(L, "km", 0)}`, "n = 1,5", "c = 300 000 km/s"],
            formulaHint: "t = L · n / c (Ergebnis in Mikrosekunden: 1 s = 1 000 000 µs)",
            answer: t,
            unit: "µs",
            digits: 1,
            solutionHtml: `v = c / n = 200 000 km/s<br>t = L / v = ${fmt(L, 0)} km / 200 000 km/s = ${fmt(L / 200_000, 6)} s = <strong>${fmtUnit(t, "µs", 1)}</strong>`,
          };
        }
        const L = rng.pick([600, 1200, 3000, 6000]);
        const t = ((L * n) / C_LIGHT) * 1000;
        return {
          prompt: `Ein Seekabel aus Glasfaser ist ${fmtUnit(L, "km", 0)} lang. Wie viele Millisekunden braucht ein Lichtsignal darin (n = 1,5; c = 300 000 km/s)?`,
          given: [`L = ${fmtUnit(L, "km", 0)}`, "n = 1,5"],
          answer: t,
          unit: "ms",
          digits: 1,
          solutionHtml: `v = 300 000 km/s / 1,5 = 200 000 km/s<br>t = ${fmt(L, 0)} km / 200 000 km/s = ${fmt(L / 200_000, 4)} s = <strong>${fmtUnit(t, "ms", 1)}</strong>`,
        };
      },
    },
    {
      id: "prisma",
      make: (rng, level) => {
        if (level === 1) {
          const glass = rng.pick([
            { name: "Kronglas", limit: 41.1 },
            { name: "Quarzglas", limit: 43.2 },
            { name: "Flintglas", limit: 38.7 },
          ]);
          return {
            prompt: `Ein Strahl fällt senkrecht auf die Kathetenfläche eines rechtwinklig-gleichschenkligen ${glass.name}prismas. An der Hypotenusenfläche trifft er unter 45° auf. Der Grenzwinkel gegen Luft beträgt ${fmtUnit(glass.limit, "°", 1)}. Um wie viel Grad wird der Strahl durch Totalreflexion abgelenkt?`,
            given: [`Einfallswinkel an der Hypotenusenfläche: 45°`, `Grenzwinkel: ${fmtUnit(glass.limit, "°", 1)}`],
            formulaHint: "45° > Grenzwinkel: Totalreflexion, die Ablenkung ist 90°",
            answer: 90,
            unit: "°",
            digits: 0,
            solutionHtml: `45° ist größer als ${fmt(glass.limit, 1)}°: Totalreflexion. Der Strahl wird nach dem Reflexionsgesetz um 2 · 45° = <strong>${fmtUnit(90, "°", 0)}</strong> abgelenkt.`,
          };
        }
        const n = rng.int(2, 4);
        return {
          prompt: `In einem Fernglas lenkt ein Prismensatz den Strahl durch ${n} aufeinanderfolgende Totalreflexionen um jeweils 90° in derselben Drehrichtung um. Um wie viel Grad wird er insgesamt umgelenkt?`,
          given: [`${n} Totalreflexionen zu je 90°`],
          answer: n * 90,
          unit: "°",
          digits: 0,
          solutionHtml: `${n} · 90° = <strong>${fmtUnit(n * 90, "°", 0)}</strong>. Bei zwei Reflexionen (Porro-Prisma) kehrt der Strahl um, bei vier ist er wieder in Ausgangsrichtung.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, wann Licht im Stoff gefangen bleibt, und nennst Anwendungen von Prisma bis Glasfaser.",
};

// 2.7 Sammellinse und Strahlengang ─────────────────────────────────────────

const sammellinse: Lesson = {
  id: "op-7-sammellinse",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "2.7 Sammellinse und Strahlengang",
  subtitle: "Brennpunkt, Brennweite und Brechkraft",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): optische Linsen: Arten und Wirkung; Lichtstrahlmodell zur Konstruktion von Strahlengängen",
  whyItMatters:
    "Ob Brille, Lupe, Kamera oder Fernrohr: Linsen lenken Licht gezielt ab. Mit drei Strahlen, die man leicht zeichnen kann, lässt sich vorhersagen, was eine Linse macht.",
  explanationHtml: `
    <p>Eine <strong>Sammellinse</strong> ist in der Mitte dicker als am Rand. Sie bricht parallel einfallendes Licht so, dass sich die Strahlen im <strong>Brennpunkt F</strong> treffen. Der Abstand Linse–Brennpunkt ist die <strong>Brennweite f</strong>.</p>
    <p>Eine <strong>Zerstreuungslinse</strong> ist in der Mitte dünner. Sie lässt parallele Strahlen auseinanderlaufen, als kämen sie aus einem <em>virtuellen</em> Brennpunkt vor der Linse.</p>
    <p><strong>Drei Strahlen</strong> genügen zur Konstruktion bei der Sammellinse:</p>
    <ul>
      <li><strong>Parallelstrahl:</strong> kommt parallel zur optischen Achse, geht danach durch den hinteren Brennpunkt.</li>
      <li><strong>Mittelpunktstrahl:</strong> geht durch die Linsenmitte und wird nicht abgelenkt.</li>
      <li><strong>Brennpunktstrahl:</strong> kommt durch den vorderen Brennpunkt, läuft danach parallel zur Achse.</li>
    </ul>
    <p>Die <strong>Brechkraft D = 1 / f</strong> misst, wie stark eine Linse bricht. Einheit: <strong>Dioptrie (dpt)</strong>, 1 dpt = 1/m. Kurze Brennweite bedeutet große Brechkraft. Sammellinsen haben positives, Zerstreuungslinsen negatives D. Stärker gekrümmte (dickere) Linsen haben die kürzere Brennweite.</p>
    <div class="merke"><strong>Merke:</strong> f = 50 cm = 0,5 m entspricht D = 2 dpt. Rechne die Brennweite immer in Meter um.</div>
  `,
  formulas: [
    { name: "Brechkraft", html: "D = 1 / f", quantities: "D in dpt (1 dpt = 1/m), f in m" },
    { name: "Brennweite", html: "f = 1 / D", quantities: "f = 100 cm / D, wenn D in dpt gegeben ist" },
    { name: "Zwei dünne Linsen dicht hintereinander", html: "D<sub>ges</sub> = D<sub>1</sub> + D<sub>2</sub>", quantities: "Brechkräfte addieren sich" },
  ],
  quiz: {
    question: "Welche Aussage über eine Sammellinse stimmt?",
    options: [
      "Sie lässt parallele Strahlen auseinanderlaufen",
      "Sie lenkt keinen Strahl ab",
      "Sie bündelt parallel einfallendes Licht im Brennpunkt",
    ],
    correctIndex: 2,
    explanation: "Die Sammellinse sammelt parallele Strahlen im Brennpunkt. Auseinanderlaufen lässt sie eine Zerstreuungslinse.",
  },
  lab: {
    kind: "lens-rays",
    title: "Labor: Parallele Strahlen durch eine Linse",
    intro: "Ein paralleles Lichtbündel trifft eine Linse. Wähle die Art und die Brennweite und beobachte, wohin die Strahlen laufen.",
    params: [
      { type: "choice", key: "type", label: "Art der Linse", options: [{ value: 0, label: "Sammellinse" }, { value: 1, label: "Zerstreuungslinse" }], value: 0 },
      { type: "range", key: "f", label: "Brennweite f", unit: "cm", min: 3, max: 10, step: 1, value: 6 },
    ],
    readouts: [
      { key: "D", label: "Brechkraft D = 1 / f", unit: "dpt", digits: 1, emphasis: true, compute: (v) => (v.type === 0 ? 1 : -1) * (100 / v.f) },
      { key: "focus", label: "Brennpunkt", compute: (v) => (v.type === 0 ? "reell, hinter der Linse" : "virtuell, vor der Linse") },
    ],
    goals: [
      { id: "zwanzig-dpt", text: "Stelle eine Sammellinse mit der Brechkraft 20 dpt ein (f = 5 cm).", check: (v) => v.type === 0 && v.f === 5 },
      { id: "zerstreuung", text: "Wähle die Zerstreuungslinse: Die Strahlen laufen auseinander und die Brechkraft ist negativ.", check: (v, r) => v.type === 1 && Number(r.D) < 0 },
      { id: "stark", text: "Stelle die stärkste Sammellinse ein: Brechkraft über 30 dpt.", check: (v, r) => v.type === 0 && Number(r.D) > 30 },
    ],
  },
  exercises: [
    {
      id: "brechkraft",
      make: (rng, level) => {
        if (level === 1) {
          const f = rng.pick([5, 8, 10, 12.5, 20, 25, 40, 50]);
          return {
            prompt: `Eine Sammellinse hat die Brennweite ${fmtUnit(f, "cm", 1)}. Wie groß ist ihre Brechkraft?`,
            given: [`f = ${fmtUnit(f, "cm", 1)} = ${fmtUnit(f / 100, "m", 3)}`],
            formulaHint: "D = 1 / f (f in m)",
            answer: 100 / f,
            unit: "dpt",
            digits: 2,
            solutionHtml: `D = 1 / f = 1 / ${fmt(f / 100, 3)} m = <strong>${fmtUnit(100 / f, "dpt", 2)}</strong>`,
          };
        }
        const D = rng.pick([2, 2.5, 4, 5, 8, 10]);
        return {
          prompt: `Eine Lesebrille hat die Brechkraft ${fmtUnit(D, "dpt", 1)}. Welche Brennweite haben ihre Gläser in Zentimetern?`,
          given: [`D = ${fmtUnit(D, "dpt", 1)}`],
          answer: 100 / D,
          unit: "cm",
          digits: 1,
          solutionHtml: `f = 1 / D = 1 / ${fmt(D, 1)} dpt = ${fmt(1 / D, 3)} m = <strong>${fmtUnit(100 / D, "cm", 1)}</strong>`,
        };
      },
    },
    {
      id: "linsen-kombination",
      make: (rng, level) => {
        if (level === 1) {
          const D1 = rng.pick([2, 3, 4, 5]);
          const D2 = rng.pick([1, 1.5, 2.5, 3]);
          return {
            prompt: `Zwei dünne Sammellinsen mit ${fmtUnit(D1, "dpt", 1)} und ${fmtUnit(D2, "dpt", 1)} liegen dicht hintereinander. Welche Brechkraft hat die Kombination?`,
            given: [`D₁ = ${fmtUnit(D1, "dpt", 1)}`, `D₂ = ${fmtUnit(D2, "dpt", 1)}`],
            formulaHint: "D_ges = D₁ + D₂",
            answer: D1 + D2,
            unit: "dpt",
            digits: 2,
            solutionHtml: `D<sub>ges</sub> = ${fmt(D1, 1)} dpt + ${fmt(D2, 1)} dpt = <strong>${fmtUnit(D1 + D2, "dpt", 2)}</strong>`,
          };
        }
        const D1 = rng.pick([2, 2.5, 3]);
        const D2 = rng.pick([1, 1.5, 2]);
        return {
          prompt: `Eine Lupe mit ${fmtUnit(D1, "dpt", 1)} wird mit einem Vorsatzglas von ${fmtUnit(D2, "dpt", 1)} dicht kombiniert. Welche Brennweite hat die Kombination in Zentimetern?`,
          given: [`D₁ = ${fmtUnit(D1, "dpt", 1)}`, `D₂ = ${fmtUnit(D2, "dpt", 1)}`],
          answer: 100 / (D1 + D2),
          unit: "cm",
          digits: 1,
          solutionHtml: `D<sub>ges</sub> = ${fmt(D1, 1)} + ${fmt(D2, 1)} = ${fmt(D1 + D2, 2)} dpt<br>f = 1 / D<sub>ges</sub> = ${fmt(100 / (D1 + D2), 1)} cm → <strong>${fmtUnit(100 / (D1 + D2), "cm", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest Parallel-, Mittelpunkt- und Brennpunktstrahl und rechnest mit der Brechkraft.",
};

// 2.8 Abbildung ────────────────────────────────────────────────────────────

const abbildung: Lesson = {
  id: "op-8-abbildung",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "2.8 Abbildung: reelle und virtuelle Bilder",
  subtitle: "Wo das Bild entsteht, hängt davon ab, wie weit der Gegenstand entfernt ist",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): optische Abbildung, reelle und virtuelle Bilder, Konstruktion von Strahlengängen",
  whyItMatters:
    "Dieselbe Linse kann ein winziges Bild auf den Kamerasensor werfen, ein riesiges auf die Kinoleinwand oder als Lupe ein virtuelles Bild vergrößern. Der Abstand des Gegenstands entscheidet.",
  explanationHtml: `
    <p>Eine Sammellinse bildet einen Gegenstand (Größe G, Abstand <strong>g</strong> von der Linse) in das Bild (Größe B, Abstand <strong>b</strong>) ab. Man konstruiert die Spitze des Bildes als Schnittpunkt zweier der drei ausgezeichneten Strahlen.</p>
    <ul>
      <li><strong>g &gt; 2f:</strong> reelles, umgekehrtes, <strong>verkleinertes</strong> Bild (Fotoapparat, Auge).</li>
      <li><strong>g = 2f:</strong> reelles, umgekehrtes Bild in gleicher Größe.</li>
      <li><strong>f &lt; g &lt; 2f:</strong> reelles, umgekehrtes, <strong>vergrößertes</strong> Bild (Diaprojektor, Beamer).</li>
      <li><strong>g = f:</strong> Die Strahlen laufen parallel, es entsteht kein Bild.</li>
      <li><strong>g &lt; f:</strong> <strong>virtuelles</strong>, aufrechtes, vergrößertes Bild (Lupe).</li>
    </ul>
    <p>Ein <strong>reelles</strong> Bild entsteht dort, wo sich die Lichtstrahlen wirklich schneiden. Man kann es mit einem Schirm auffangen. Ein <strong>virtuelles</strong> Bild liegt dort, wo die Strahlen nur scheinbar herkommen (rückwärts verlängert). Es lässt sich nicht auffangen, aber ansehen.</p>
    <p>Bildgröße und Gegenstandsgröße verhalten sich wie die Abstände: <strong>B / G = b / g</strong>.</p>
    <div class="merke"><strong>Merke:</strong> Reell heißt: Licht kommt dort an. Virtuell heißt: Es sieht nur so aus.</div>
  `,
  formulas: [
    { name: "Abbildungsmaßstab", html: "B / G = b / g", quantities: "B Bildgröße, G Gegenstandsgröße, b Bildweite, g Gegenstandsweite" },
    { name: "Bildgröße", html: "B = G · b / g", quantities: "" },
    { name: "Fälle", html: "g &gt; 2f verkleinert, f &lt; g &lt; 2f vergrößert, g &lt; f Lupe", quantities: "Sammellinse mit Brennweite f" },
  ],
  quiz: {
    question: "Du hältst eine Lupe dicht über einen Text (der Text ist näher als die Brennweite, g < f). Was für ein Bild siehst du?",
    options: [
      "Ein virtuelles, aufrechtes, vergrößertes Bild",
      "Ein reelles, umgekehrtes, verkleinertes Bild",
      "Ein reelles, umgekehrtes, vergrößertes Bild",
    ],
    correctIndex: 0,
    explanation: "Für g < f schneiden sich die Strahlen hinter der Linse nicht. Nur ihre Verlängerung nach hinten trifft sich: ein virtuelles, aufrechtes, vergrößertes Bild.",
  },
  lab: {
    kind: "lens-image",
    title: "Labor: Gegenstand vor der Sammellinse",
    intro: "Verschiebe den Gegenstand und wähle die Brennweite. Beobachte die drei Strahlen und die Eigenschaften des Bildes. (Die Zahlen berechnet das Labor mit der Linsengleichung, du musst sie nicht kennen.)",
    params: [
      { type: "choice", key: "f", label: "Brennweite f", options: [{ value: 4, label: "4 cm" }, { value: 5, label: "5 cm" }, { value: 6, label: "6 cm" }], value: 6 },
      { type: "range", key: "g", label: "Gegenstandsweite g", unit: "cm", min: 2, max: 24, step: 1, value: 12 },
    ],
    readouts: [
      { key: "kind", label: "Bild", emphasis: true, compute: (v) => lensImage(v.f, v.g).kind },
      { key: "b", label: "Bildweite b (negativ: virtuell)", unit: "cm", digits: 1, compute: (v) => lensImage(v.f, v.g).b },
      { key: "scale", label: "Bildgröße : Gegenstandsgröße", digits: 2, compute: (v) => lensImage(v.f, v.g).scale },
    ],
    goals: [
      { id: "vergroessert", text: "Erzeuge ein reelles, umgekehrtes, vergrößertes Bild (Projektor).", check: (_v, r) => r.kind === "reell, umgekehrt, vergrößert" },
      { id: "verkleinert", text: "Erzeuge ein reelles, umgekehrtes, verkleinertes Bild (Fotoapparat).", check: (_v, r) => r.kind === "reell, umgekehrt, verkleinert" },
      { id: "lupe", text: "Erzeuge ein virtuelles, aufrechtes, vergrößertes Bild (Lupe).", check: (_v, r) => r.kind === "virtuell, aufrecht, vergrößert" },
    ],
  },
  exercises: [
    {
      id: "bildgroesse",
      make: (rng, level) => {
        if (level === 1) {
          const G = rng.pick([2, 3, 4, 5]);
          const g = rng.pick([6, 8, 10, 12]);
          const b = rng.pick([15, 20, 24, 30]);
          const B = (G * b) / g;
          return {
            prompt: `Eine Sammellinse bildet einen ${fmtUnit(G, "cm", 0)} hohen Gegenstand ab. Der Gegenstand ist ${fmtUnit(g, "cm", 0)} von der Linse entfernt, das Bild ${fmtUnit(b, "cm", 0)}. Wie hoch ist das Bild?`,
            given: [`G = ${fmtUnit(G, "cm", 0)}`, `g = ${fmtUnit(g, "cm", 0)}`, `b = ${fmtUnit(b, "cm", 0)}`],
            formulaHint: "B / G = b / g, also B = G · b / g",
            answer: B,
            unit: "cm",
            digits: 2,
            solutionHtml: `B = G · b / g = ${fmt(G, 0)} cm · ${fmt(b, 0)} / ${fmt(g, 0)} = <strong>${fmtUnit(B, "cm", 2)}</strong>`,
          };
        }
        const G = rng.pick([20, 24, 30, 36]);
        const g = rng.pick([40, 50, 60]);
        const b = rng.pick([5, 6, 7.5]);
        const B = (G * b) / g;
        return {
          prompt: `Eine Kamera bildet eine ${fmtUnit(G, "cm", 0)} große Blume aus ${fmtUnit(g, "cm", 0)} Entfernung auf den Sensor ab, der ${fmtUnit(b, "cm", 1)} hinter der Linse liegt. Wie groß ist das Bild auf dem Sensor in Zentimetern?`,
          given: [`G = ${fmtUnit(G, "cm", 0)}`, `g = ${fmtUnit(g, "cm", 0)}`, `b = ${fmtUnit(b, "cm", 1)}`],
          answer: B,
          unit: "cm",
          digits: 2,
          solutionHtml: `B = G · b / g = ${fmt(G, 0)} cm · ${fmt(b, 1)} / ${fmt(g, 0)} = <strong>${fmtUnit(B, "cm", 2)}</strong> (umgekehrt und verkleinert)`,
        };
      },
    },
    {
      id: "projektor",
      make: (rng, level) => {
        if (level === 1) {
          const G = rng.pick([24, 30, 36]);
          const factor = rng.pick([20, 30, 40, 50]);
          return {
            prompt: `Ein Dia ist ${fmtUnit(G, "mm", 0)} breit und wird auf der Leinwand ${factor}-mal so groß abgebildet. Wie breit ist das Bild?`,
            given: [`G = ${fmtUnit(G, "mm", 0)}`, `Abbildungsmaßstab B / G = ${factor}`],
            formulaHint: "B = G · (B / G)",
            answer: (G * factor) / 1000,
            unit: "m",
            digits: 2,
            solutionHtml: `B = ${fmt(G, 0)} mm · ${factor} = ${fmt(G * factor, 0)} mm = <strong>${fmtUnit((G * factor) / 1000, "m", 2)}</strong>`,
          };
        }
        const G = 24;
        const factor = rng.pick([40, 50, 60]);
        const bM = rng.pick([3, 4, 5]);
        const gCm = ((bM * 100) / factor);
        return {
          prompt: `Ein Dia (${fmtUnit(G, "mm", 0)} breit) wird auf einer Leinwand ${fmtUnit(bM, "m", 0)} hinter der Linse ${factor}-fach vergrößert abgebildet. Wie weit steht das Dia vor der Linse (in Zentimetern)?`,
          given: [`b = ${fmtUnit(bM, "m", 0)} = ${fmtUnit(bM * 100, "cm", 0)}`, `B / G = ${factor}`],
          answer: gCm,
          unit: "cm",
          digits: 2,
          solutionHtml: `B / G = b / g ⇒ g = b / (B / G) = ${fmt(bM * 100, 0)} cm / ${factor} = <strong>${fmtUnit(gCm, "cm", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du sagst aus dem Gegenstandsabstand voraus, ob das Bild reell oder virtuell, größer oder kleiner ist.",
};

// 2.9 Auge, Brille und optische Geräte ─────────────────────────────────────

const geraete: Lesson = {
  id: "op-9-geraete",
  stageId: STAGE_ID,
  stepNumber: 9,
  title: "2.9 Auge, Brille und optische Geräte",
  subtitle: "Kurzsichtigkeit, Fotoapparat und Fernrohr",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 2 (II/III): Korrektur der Kurz- und Weitsichtigkeit; Bau und Funktionsweise optischer Geräte (Fotoapparat, Fernrohr); Recherche",
  whyItMatters:
    "Jeder zweite Erwachsene trägt eine Brille. Die Optik erklärt, warum eine Zerstreuungslinse gegen Kurzsichtigkeit hilft, wie eine Kamera scharf stellt und warum Fernrohre den Himmel näherbringen.",
  explanationHtml: `
    <p><strong>Das Auge</strong> arbeitet wie eine Kamera: Hornhaut und <strong>Augenlinse</strong> wirken als Sammellinse, die Iris mit der Pupille ist die Blende, die <strong>Netzhaut</strong> der Empfänger. Auf der Netzhaut entsteht ein reelles, umgekehrtes, verkleinertes Bild. Zum Scharfstellen ändert der Ziliarmuskel die Krümmung der Linse.</p>
    <ul>
      <li><strong>Kurzsichtigkeit:</strong> Der Augapfel ist zu lang oder die Brechkraft zu groß. Fernes wird <em>vor</em> der Netzhaut scharf. Korrektur: <strong>Zerstreuungslinse</strong> (negative Dioptrien).</li>
      <li><strong>Weitsichtigkeit:</strong> Der Augapfel ist zu kurz oder die Brechkraft zu klein. Das scharfe Bild läge <em>hinter</em> der Netzhaut. Korrektur: <strong>Sammellinse</strong> (positive Dioptrien).</li>
      <li><strong>Fotoapparat:</strong> Das Objektiv (Sammellinse) erzeugt ein reelles, umgekehrtes, verkleinertes Bild auf dem Sensor. Scharf stellt man, indem man das Objektiv verschiebt. Die Blende regelt die Lichtmenge.</li>
      <li><strong>Fernrohr (Kepler):</strong> Das Objektiv mit langer Brennweite erzeugt ein reelles Zwischenbild, das Okular betrachtet es wie eine Lupe. Vergrößerung V = f<sub>Objektiv</sub> / f<sub>Okular</sub>.</li>
      <li><strong>Lupe:</strong> Vergrößerung etwa V = 25 cm / f.</li>
    </ul>
    <p><strong>Recherche-Auftrag:</strong> Suche in verlässlichen Quellen, wann das Fernrohr erfunden wurde, wer es für den Himmel nutzte und wofür optische Geräte heute wichtig sind. Gib das in eigenen Worten mit Fachbegriffen wieder.</p>
    <div class="merke"><strong>Merke:</strong> Kurzsichtig: Zerstreuungslinse. Weitsichtig: Sammellinse. Fernrohr: Objektiv lang, Okular kurz.</div>
  `,
  formulas: [
    { name: "Brillenstärke", html: "D = 1 / f", quantities: "kurzsichtig: f = −Fernpunktabstand" },
    { name: "Fernrohr", html: "V = f<sub>Objektiv</sub> / f<sub>Okular</sub>", quantities: "beide Brennweiten in derselben Einheit" },
    { name: "Lupe", html: "V ≈ 25 cm / f", quantities: "f in cm; 25 cm: deutliche Sehweite" },
  ],
  quiz: {
    question: "Ein kurzsichtiger Mensch sieht Fernes unscharf. Warum, und was hilft?",
    options: [
      "Das scharfe Bild entsteht hinter der Netzhaut, er braucht eine Sammellinse",
      "Das scharfe Bild entsteht vor der Netzhaut, er braucht eine Zerstreuungslinse",
      "Die Pupille ist zu klein, er braucht ein Sonnenschutzglas",
    ],
    correctIndex: 1,
    explanation: "Beim kurzsichtigen Auge bricht die Linse zu stark, das scharfe Bild liegt vor der Netzhaut. Eine Zerstreuungslinse schwächt die Brechkraft und schiebt das Bild zurück auf die Netzhaut.",
  },
  lab: {
    kind: "eye-glasses",
    title: "Labor: Auge mit Brille",
    intro: "Wähle ein Auge und die Stärke der Brille. Paralleles Licht von fernen Gegenständen soll sich genau auf der Netzhaut treffen. (Die Zahlen gehören zu einem vereinfachten Augenmodell.)",
    params: [
      { type: "choice", key: "eye", label: "Auge", options: [{ value: 0, label: "normalsichtig" }, { value: 1, label: "kurzsichtig" }, { value: 2, label: "weitsichtig" }], value: 1 },
      { type: "range", key: "D", label: "Brillenstärke D", unit: "dpt", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "dx", label: "Lage des scharfen Bildes zur Netzhaut (positiv: dahinter)", unit: "mm", digits: 1, compute: (v) => eyeFocusShift(v.eye, v.D) },
      { key: "state", label: "Sehen", emphasis: true, compute: (v) => eyeState(eyeFocusShift(v.eye, v.D)) },
    ],
    goals: [
      { id: "kurz-korrigiert", text: "Korrigiere die Kurzsichtigkeit mit einer Zerstreuungslinse, bis das Bild scharf auf der Netzhaut liegt.", check: (v, r) => v.eye === 1 && r.state === "scharf auf der Netzhaut" },
      { id: "weit-korrigiert", text: "Korrigiere die Weitsichtigkeit mit einer Sammellinse, bis das Bild scharf auf der Netzhaut liegt.", check: (v, r) => v.eye === 2 && r.state === "scharf auf der Netzhaut" },
      { id: "normal-mit-brille", text: "Setze einem normalsichtigen Auge eine Sammellinse mit 2 dpt auf: Das Bild rutscht vor die Netzhaut.", check: (v, r) => v.eye === 0 && v.D === 2 && Number(r.dx) < -0.5 },
    ],
  },
  exercises: [
    {
      id: "brille-fernpunkt",
      make: (rng, level) => {
        if (level === 1) {
          const far = rng.pick([25, 40, 50, 100, 200]);
          return {
            prompt: `Ein kurzsichtiger Mensch sieht nur bis ${fmtUnit(far, "cm", 0)} Entfernung scharf. Seine Brille soll parallele Strahlen so aufspreizen, als kämen sie aus diesem Fernpunkt. Welche Brechkraft (Betrag in dpt) muss die Zerstreuungslinse haben?`,
            given: [`Fernpunkt: ${fmtUnit(far, "cm", 0)} = ${fmtUnit(far / 100, "m", 2)}`],
            formulaHint: "D = 1 / f mit f = Fernpunktabstand in m (Zerstreuungslinse: negativ)",
            answer: 100 / far,
            unit: "dpt",
            digits: 2,
            solutionHtml: `f = ${fmt(far / 100, 2)} m, also |D| = 1 / f = <strong>${fmtUnit(100 / far, "dpt", 2)}</strong>. Die Brille hat ${fmt(-100 / far, 2)} dpt (Zerstreuungslinse).`,
          };
        }
        const D = rng.pick([1, 1.5, 2, 2.5, 3, 4]);
        return {
          prompt: `Die Brille eines Kurzsichtigen hat ${fmtUnit(-D, "dpt", 1)}. In welcher Entfernung (Fernpunkt) in Zentimetern liegt dann der scharf gesehene Punkt ohne Brille?`,
          given: [`D = ${fmtUnit(-D, "dpt", 1)}`],
          answer: 100 / D,
          unit: "cm",
          digits: 1,
          solutionHtml: `|f| = 1 / |D| = 1 / ${fmt(D, 1)} dpt = ${fmt(1 / D, 3)} m = <strong>${fmtUnit(100 / D, "cm", 1)}</strong>`,
        };
      },
    },
    {
      id: "fernrohr",
      make: (rng, level) => {
        if (level === 1) {
          const f1 = rng.pick([600, 800, 1000, 1200]);
          const f2 = rng.pick([10, 20, 25, 40]);
          return {
            prompt: `Ein Fernrohr hat ein Objektiv mit ${fmtUnit(f1, "mm", 0)} Brennweite und ein Okular mit ${fmtUnit(f2, "mm", 0)}. Wie stark vergrößert es?`,
            given: [`f(Objektiv) = ${fmtUnit(f1, "mm", 0)}`, `f(Okular) = ${fmtUnit(f2, "mm", 0)}`],
            formulaHint: "V = f(Objektiv) / f(Okular)",
            answer: f1 / f2,
            unit: "-fach",
            digits: 1,
            solutionHtml: `V = ${fmt(f1, 0)} mm / ${fmt(f2, 0)} mm = <strong>${fmt(f1 / f2, 1)}-fach</strong>`,
          };
        }
        const f1 = rng.pick([700, 900, 1000]);
        const V = rng.pick([20, 35, 50, 70]);
        const f2 = f1 / V;
        return {
          prompt: `Ein Fernrohr mit ${fmtUnit(f1, "mm", 0)} Objektivbrennweite soll ${V}-fach vergrößern. Welche Brennweite braucht das Okular in Millimetern?`,
          given: [`f(Objektiv) = ${fmtUnit(f1, "mm", 0)}`, `V = ${V}`],
          answer: f2,
          unit: "mm",
          digits: 1,
          solutionHtml: `V = f<sub>Obj</sub> / f<sub>Ok</sub> ⇒ f<sub>Ok</sub> = ${fmt(f1, 0)} mm / ${V} = <strong>${fmtUnit(f2, "mm", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du korrigierst Fehlsichtigkeit mit der richtigen Linse und rechnest mit Brillenstärke und Fernrohrvergrößerung.",
};

export const STAGE_OPTIK: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Optik",
  subtitle: "Licht, Schatten, Spiegel, Brechung, Linsen und optische Geräte",
  icon: "🔦",
  accent: "#d97706",
  badgeTitle: "Lichtforscher",
  lehrplanLabel: "Ph8 LB 2 (II/III)",
  lessons: [lichtausbreitung, schatten, finsternisse, reflexion, brechung, totalreflexion, sammellinse, abbildung, geraete],
};
