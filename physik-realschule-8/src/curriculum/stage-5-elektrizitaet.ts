import { fmt, fmtUnit } from "../exercises/format";
import { E_CHARGE } from "../lab/engine";
import {
  alignment,
  ammeterState,
  bodyCurrentEffect,
  clipsAttracted,
  compassWord,
  fieldAt,
  filterEfficiency,
  INFLUENCE_MAX_NC,
  influenceShare,
  magnetPoles,
  rubbedCharges,
  TRIBO_SERIES,
} from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-5-elektrizitaet";

// 5.1 Magnete ──────────────────────────────────────────────────────────────

const magnete: Lesson = {
  id: "el-1-magnete",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "5.1 Magnete und Elementarmagnete",
  subtitle: "Pole, Influenz und das Modell der Elementarmagnete",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 3 (II/III): Magnete und magnetische Grunderscheinungen, magnetische Influenz, temporärer und permanenter Magnetismus, Elementarmagnete",
  whyItMatters:
    "Kühlschrankmagnete, Kompass, Lautsprecher: Magnetismus steckt überall. Mit einem einfachen Modell aus winzigen Elementarmagneten lässt sich erklären, warum man Magnete nicht in Nord und Süd trennen kann.",
  explanationHtml: `
    <p><strong>Magnete</strong> ziehen Körper aus Eisen, Nickel und Kobalt an (<strong>ferromagnetische</strong> Stoffe). Jeder Magnet hat zwei <strong>Pole</strong>: den Nordpol (rot) und den Südpol (grün). <strong>Gleichnamige Pole stoßen sich ab, ungleichnamige ziehen sich an.</strong></p>
    <ul>
      <li><strong>Pole gibt es nur paarweise.</strong> Bricht man einen Magneten, entstehen zwei kleinere vollständige Magnete, jeder mit Nord- und Südpol.</li>
      <li><strong>Magnetische Influenz:</strong> Ein Eisenstück in der Nähe eines Magneten wird selbst zum Magneten und wird angezogen (ein Magnet hängt einen Nagel an, der Nagel eine Büroklammer).</li>
      <li><strong>Temporärer Magnetismus:</strong> weiches Eisen verliert die Magnetisierung, wenn der Magnet entfernt wird. <strong>Permanenter Magnetismus:</strong> hartes Material (Stahl) behält sie.</li>
      <li><strong>Modell der Elementarmagnete:</strong> Ferromagnetische Stoffe bestehen aus winzigen Elementarmagneten. Im unmagnetisierten Stück liegen sie durcheinander und heben sich auf, im magnetisierten sind sie überwiegend ausgerichtet. Bei weichem Eisen fallen sie nach Wegnahme des Magneten in die Unordnung zurück, bei Stahl bleiben sie großteils ausgerichtet.</li>
      <li>Erschüttern oder starkes Erhitzen bringt die Ordnung durcheinander: Der Magnet verliert seine Wirkung.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Gleichnamige Pole stoßen ab, ungleichnamige ziehen an. Ein Magnet hat immer beide Pole.</div>
  `,
  formulas: [
    { name: "Polgesetz", html: "gleichnamig: Abstoßung, ungleichnamig: Anziehung", quantities: "Nordpol (rot), Südpol (grün)" },
    { name: "Teilen eines Magneten", html: "n − 1 Brüche geben n Magnete mit je 2 Polen", quantities: "" },
  ],
  quiz: {
    question: "Du brichst einen Stabmagneten in der Mitte durch. Was entsteht?",
    options: [
      "Zwei unmagnetische Eisenstücke",
      "Ein reines Nordpol-Stück und ein reines Südpol-Stück",
      "Zwei kleinere Magnete, jeder mit Nord- und Südpol",
    ],
    correctIndex: 2,
    explanation: "Die Elementarmagnete im Stab sind ausgerichtet. An jeder Bruchstelle entstehen wieder ein Nord- und ein Südende, also zwei vollständige Magnete.",
  },
  lab: {
    kind: "elementary-magnets",
    title: "Labor: Eisen und Stahl am Magneten",
    intro: "Beobachte die Elementarmagnete in einem Stab aus weichem Eisen oder aus Stahl: vor dem Magneten, am Magneten und nachdem der Magnet entfernt wurde.",
    params: [
      { type: "choice", key: "material", label: "Material", options: [{ value: 0, label: "weiches Eisen" }, { value: 1, label: "Stahl" }], value: 0 },
      {
        type: "choice",
        key: "phase",
        label: "Phase",
        options: [{ value: 0, label: "vorher (kein Magnet in der Nähe)" }, { value: 1, label: "am Magneten" }, { value: 2, label: "Magnet wieder entfernt" }],
        value: 0,
      },
    ],
    readouts: [
      { key: "align", label: "Ausgerichtete Elementarmagnete", unit: "%", digits: 0, emphasis: true, compute: (v) => alignment(v.material, v.phase) },
      { key: "clips", label: "Zieht Büroklammern an", emphasis: true, compute: (v) => clipsAttracted(alignment(v.material, v.phase)) },
    ],
    goals: [
      { id: "influenz", text: "Weiches Eisen am Magneten: Es wird selbst magnetisch (Influenz) und zieht Büroklammern an.", check: (v) => v.material === 0 && v.phase === 1 },
      { id: "temporaer", text: "Weiches Eisen verliert die Magnetisierung, sobald der Magnet entfernt wird (temporär).", check: (v, r) => v.material === 0 && v.phase === 2 && Number(r.align) < 10 },
      { id: "permanent", text: "Stahl bleibt auch nach dem Entfernen des Magneten stark magnetisch (permanent).", check: (v, r) => v.material === 1 && v.phase === 2 && Number(r.align) >= 40 },
    ],
  },
  exercises: [
    {
      id: "bruchstuecke",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(2, 6);
          return {
            prompt: `Ein Stabmagnet wird in ${n} Stücke zerbrochen. Wie viele Pole haben alle Stücke zusammen? (Zähle Nord- und Südpole.)`,
            given: [`${n} Stücke`],
            formulaHint: "jedes Stück ist ein Magnet mit 2 Polen",
            answer: 2 * n,
            unit: "Pole",
            digits: 0,
            solutionHtml: `Jedes der ${n} Stücke hat einen Nord- und einen Südpol: ${n} · 2 = <strong>${2 * n} Pole</strong> (${n} Nord- und ${n} Südpole).`,
          };
        }
        const n = rng.pick([8, 10, 12, 15, 20]);
        return {
          prompt: `Aus einem langen Stabmagneten sollen ${n} kleine Magnete entstehen. Wie oft muss er durchgebrochen werden? Jedes Stück muss wieder ein vollständiger Magnet sein.`,
          given: [`${n} Magnete gewünscht`],
          answer: n - 1,
          unit: "Brüche",
          digits: 0,
          solutionHtml: `Aus 1 Stab wird mit jedem Bruch ein Stück mehr: für ${n} Stücke sind es ${n} − 1 = <strong>${n - 1} Brüche</strong>.`,
        };
      },
    },
    {
      id: "elementarmagnete",
      make: (rng, level) => {
        if (level === 1) {
          const N = rng.pick([1000, 2000, 5000]);
          const p = rng.pick([10, 25, 35, 60, 80]);
          return {
            prompt: `Ein Eisenstab besteht im Modell aus ${fmtUnit(N, "", 0).trim()} Elementarmagneten. Er wird magnetisiert, und ${p} % davon sind ausgerichtet. Wie viele Elementarmagnete sind ausgerichtet?`,
            given: [`N = ${fmt(N, 0)}`, `Anteil ${p} %`],
            formulaHint: "ausgerichtet = N · Anteil",
            answer: (N * p) / 100,
            unit: "Elementarmagnete",
            digits: 0,
            solutionHtml: `${fmt(N, 0)} · ${p} / 100 = <strong>${fmtUnit((N * p) / 100, "Elementarmagnete", 0)}</strong>`,
          };
        }
        const N = rng.pick([400, 800, 1000]);
        const k = rng.pick([40, 100, 120, 200]);
        const p = (k / N) * 100;
        return {
          prompt: `Ein Stahlstab hat im Modell ${fmt(N, 0)} Elementarmagnete, von denen nach einer Erschütterung nur noch ${k} ausgerichtet sind. Wie viel Prozent sind das? Was bedeutet das für die Stärke des Magneten?`,
          given: [`N = ${fmt(N, 0)}`, `ausgerichtet: ${k}`],
          answer: p,
          unit: "%",
          digits: 1,
          solutionHtml: `${k} / ${fmt(N, 0)} = ${fmt(p / 100, 3)} = <strong>${fmtUnit(p, "%", 1)}</strong>. Je weniger ausgerichtet sind, desto schwächer ist der Magnet.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst Pole, Influenz und die Magnetisierung von Eisen und Stahl mit Elementarmagneten.",
};

// 5.2 Magnetfeld ───────────────────────────────────────────────────────────

const magnetfeld: Lesson = {
  id: "el-2-magnetfeld",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "5.2 Magnetfelder und das Magnetfeld der Erde",
  subtitle: "Feldlinien, Kompass und warum der Nordpol im Süden liegt",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 3 (II/III): Magnetfelder (Stabmagnet, Hufeisenmagnet), Magnetfeld der Erde",
  whyItMatters:
    "Der Kompass zeigt dir den Weg, obwohl nichts den Magneten berührt. Das Feldmodell macht die unsichtbare Wirkung zeichenbar.",
  explanationHtml: `
    <p>Um einen Magneten ist ein <strong>Magnetfeld</strong>: ein Raum, in dem auf magnetische Körper Kräfte wirken. Sichtbar wird es mit Eisenfeilspänen oder mit vielen kleinen Kompassnadeln.</p>
    <ul>
      <li><strong>Feldlinien</strong> sind gedachte Linien, die die Richtung des Feldes zeigen: Sie verlaufen <strong>außerhalb des Magneten vom Nordpol zum Südpol</strong>. Wo sie dichter liegen, ist das Feld stärker (an den Polen).</li>
      <li>Die Nordspitze einer <strong>Magnetnadel</strong> zeigt in Feldrichtung, also an der Feldlinie entlang.</li>
      <li><strong>Feldbilder:</strong> Stabmagnet (Linien laufen von Pol zu Pol), Hufeisenmagnet (zwischen den Schenkeln fast <em>homogenes</em> Feld mit parallelen Linien), zwei gleichnamige Pole (Linien weichen einander aus, in der Mitte ist das Feld null), zwei ungleichnamige Pole (Linien laufen geradlinig vom Nord- zum Südpol).</li>
      <li><strong>Magnetfeld der Erde:</strong> Die Erde wirkt wie ein riesiger Stabmagnet. Die Nordspitze der Kompassnadel zeigt nach Norden, also liegt dort der magnetische <strong>Südpol</strong> der Erde (nahe dem geografischen Nordpol). Die Feldlinien neigen sich gegen den Erdboden (in Deutschland etwa 66°).</li>
      <li>Das Erdfeld schützt vor dem Sonnenwind (Polarlicht) und hilft Zugvögeln bei der Orientierung. Die Nadel weicht vom geografischen Norden etwas ab (<strong>Missweisung</strong>, in Bayern etwa 3° nach Osten).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Feldlinien laufen außen von Nord nach Süd. Der Kompass-Nordpol zeigt zum magnetischen Südpol der Erde im geografischen Norden.</div>
  `,
  formulas: [
    { name: "Feldrichtung", html: "Feldlinien: Nordpol → Südpol (außerhalb)", quantities: "Nordspitze der Nadel zeigt in Feldrichtung" },
    { name: "Kompasskurs", html: "Kompasskurs = Kartenkurs − Missweisung", quantities: "Missweisung östlich positiv, in Bayern etwa +3°" },
  ],
  quiz: {
    question: "Die Nordspitze einer Kompassnadel zeigt zum geografischen Norden. Welcher Pol des Erdmagneten liegt dort?",
    options: [
      "Ein magnetischer Nordpol",
      "Ein magnetischer Südpol",
      "Dort liegt kein Pol",
    ],
    correctIndex: 1,
    explanation: "Gegenpole ziehen sich an: Die Nordspitze der Nadel wird zum magnetischen Südpol der Erde gezogen, der im geografischen Norden liegt.",
  },
  lab: {
    kind: "field-lines",
    title: "Labor: Feldlinien und Kompassnadel",
    intro: "Wähle einen Magneten und lege die Kompassnadel an einen Punkt. Die roten Linien zeigen das Feld, die rote Nadelspitze zeigt in Feldrichtung. (Rot: Nordpol, grün: Südpol.)",
    params: [
      {
        type: "choice",
        key: "kind",
        label: "Magnet",
        options: [
          { value: 0, label: "Stabmagnet" },
          { value: 1, label: "Hufeisenmagnet" },
          { value: 2, label: "zwei Nordpole gegenüber" },
          { value: 3, label: "Nordpol gegenüber Südpol" },
          { value: 4, label: "Erde (Schnitt)" },
        ],
        value: 0,
      },
      { type: "range", key: "cx", label: "Kompass: waagerecht", unit: "cm", min: -4, max: 4, step: 1, value: 2 },
      { type: "range", key: "cy", label: "Kompass: senkrecht", unit: "cm", min: -2, max: 2, step: 1, value: 1 },
    ],
    readouts: [
      { key: "dir", label: "Nadel zeigt", emphasis: true, compute: (v) => { const b = fieldAt(magnetPoles(v.kind), v.cx, v.cy); return compassWord(b.bx, b.by); } },
      { key: "B", label: "Feldstärke an der Nadel (relativ)", digits: 2, compute: (v) => { const b = fieldAt(magnetPoles(v.kind), v.cx, v.cy); return Math.hypot(b.bx, b.by); } },
    ],
    goals: [
      { id: "nord-sued-mitte", text: "Nordpol gegenüber Südpol: Zwischen den Polen zeigt die Nadel von Nord nach Süd, hier nach rechts. Lege sie in die Mitte (0 | 0).", check: (v, r) => v.kind === 3 && v.cx === 0 && v.cy === 0 && r.dir === "nach rechts" },
      { id: "gleichnamig-null", text: "Zwei Nordpole gegenüber: In der Mitte heben sich die Felder auf, die Feldstärke ist fast null.", check: (v, r) => v.kind === 2 && v.cx === 0 && v.cy === 0 && Number(r.B) < 0.05 },
      { id: "erde-norden", text: "Erde: Lege die Nadel an den Äquator (waagerecht 2 cm, senkrecht 0 cm): Sie zeigt nach oben, also nach geografisch Norden.", check: (v, r) => v.kind === 4 && v.cx === 2 && v.cy === 0 && r.dir === "nach oben" },
    ],
  },
  exercises: [
    {
      id: "kompass-drehung",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([20, 30, 45, 60, 90, 120]);
          return {
            prompt: `Du hältst einen Kompass und drehst dich mit ihm um ${fmtUnit(a, "°", 0)} im Uhrzeigersinn. Die Nadel zeigt weiter nach Norden. Um wie viel Grad dreht sich die Nadel relativ zum Gehäuse (in die Gegenrichtung)?`,
            given: [`Drehung des Gehäuses: ${fmtUnit(a, "°", 0)}`],
            formulaHint: "Die Nadel bleibt im Raum, das Gehäuse dreht sich unter ihr",
            answer: a,
            unit: "°",
            digits: 0,
            solutionHtml: `Die Nadel behält ihre Richtung im Raum, das Gehäuse dreht sich um ${fmt(a, 0)}° weiter. Relativ zum Gehäuse dreht sie sich um <strong>${fmtUnit(a, "°", 0)}</strong> gegen den Uhrzeigersinn.`,
          };
        }
        const a = rng.pick([70, 90, 110]);
        const b = rng.pick([20, 25, 30]);
        return {
          prompt: `Ein Kompassgehäuse wird erst um ${fmtUnit(a, "°", 0)} im Uhrzeigersinn und dann um ${fmtUnit(b, "°", 0)} gegen den Uhrzeigersinn gedreht. Um wie viel Grad (Betrag) hat sich die Nadel insgesamt relativ zum Gehäuse gedreht?`,
          given: [`${fmtUnit(a, "°", 0)} im Uhrzeigersinn`, `${fmtUnit(b, "°", 0)} dagegen`],
          answer: a - b,
          unit: "°",
          digits: 0,
          solutionHtml: `Gesamtdrehung des Gehäuses: ${fmt(a, 0)}° − ${fmt(b, 0)}° = <strong>${fmtUnit(a - b, "°", 0)}</strong>. Um so viel dreht sich die Nadel relativ zum Gehäuse in die andere Richtung.`,
        };
      },
    },
    {
      id: "kompass-kurs",
      make: (rng, level) => {
        if (level === 1) {
          const course = rng.pick([45, 90, 135, 180, 270]);
          const md = rng.pick([2, 3, 4]);
          return {
            prompt: `Auf der Karte liegt dein Ziel in Richtung ${fmtUnit(course, "°", 0)} (vom geografischen Norden im Uhrzeigersinn). Die Nadel zeigt am Wanderort ${md}° östlich vom geografischen Norden (Missweisung +${md}°). Welchen Kompasskurs musst du einstellen?`,
            given: [`Kartenkurs ${fmtUnit(course, "°", 0)}`, `Missweisung +${md}°`],
            formulaHint: "Kompasskurs = Kartenkurs − Missweisung",
            answer: course - md,
            unit: "°",
            digits: 0,
            solutionHtml: `Kompasskurs = ${fmt(course, 0)}° − ${md}° = <strong>${fmtUnit(course - md, "°", 0)}</strong>`,
          };
        }
        const course = rng.pick([60, 120, 200, 300]);
        const md = rng.pick([4, 5, 6]);
        return {
          prompt: `An einem anderen Ort zeigt die Nadel ${md}° westlich vom geografischen Norden (Missweisung −${md}°). Das Ziel liegt auf der Karte bei ${fmtUnit(course, "°", 0)}. Welchen Kompasskurs stellst du ein?`,
          given: [`Kartenkurs ${fmtUnit(course, "°", 0)}`, `Missweisung −${md}°`],
          answer: course + md,
          unit: "°",
          digits: 0,
          solutionHtml: `Kompasskurs = Kartenkurs − Missweisung = ${fmt(course, 0)}° − (−${md}°) = <strong>${fmtUnit(course + md, "°", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest Feldlinien und weißt, warum die Kompassnadel nach Norden zeigt.",
};

// 5.3 Ladung ───────────────────────────────────────────────────────────────

const ladung: Lesson = {
  id: "el-3-ladung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "5.3 Elektrische Ladung und Ladungstrennung",
  subtitle: "Reibungselektrizität, Kern-Hülle-Modell und Elementarladung",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (I und II/III): Elektrostatik: Ladungsarten, Kontaktelektrizität, Ladungstrennung als Voraussetzung für eine Elektrizitätsquelle, Ladung und Elementarladung, Kern-Hülle-Modell",
  whyItMatters:
    "Der Funke an der Türklinke und die knisternden Haare nach dem Pullover-Ausziehen zeigen: Alles ist aus Ladungen aufgebaut. Das Kern-Hülle-Modell erklärt, warum ein Körper meist neutral ist und wie er geladen wird.",
  explanationHtml: `
    <p>Es gibt zwei <strong>Ladungsarten</strong>: positive (+) und negative (−). <strong>Gleichnamige Ladungen stoßen sich ab, ungleichnamige ziehen sich an.</strong> Je kleiner der Abstand, desto größer die Kraft.</p>
    <p><strong>Kern-Hülle-Modell:</strong> Ein Atom hat einen positiv geladenen Kern (Protonen, dazu ungeladene Neutronen) und eine Hülle aus negativ geladenen Elektronen. Ein neutrales Atom hat gleich viele Protonen wie Elektronen. Nur Elektronen können leicht verschoben werden.</p>
    <ul>
      <li><strong>Ladungstrennung durch Reiben (Kontaktelektrizität):</strong> Beim Aneinanderreiben zweier verschiedener Stoffe gehen Elektronen vom einen auf den anderen über. Der Stoff mit <em>Elektronenüberschuss</em> ist negativ, der mit <em>Elektronenmangel</em> positiv. Die Gesamtladung bleibt 0.</li>
      <li><strong>Elementarladung:</strong> Die kleinste frei vorkommende Ladung ist <strong>e = 1,6 · 10<sup>−19</sup> C</strong> (Coulomb). Jede Ladung ist ein ganzzahliges Vielfaches: <strong>Q = N · e</strong>.</li>
      <li><strong>Ladungsverteilung:</strong> Auf einem leitenden Körper sitzt die Ladung an der Oberfläche, an Spitzen besonders dicht. Berühren sich zwei gleich große Kugeln, teilen sie sich die Gesamtladung zur Hälfte.</li>
      <li>Jede <strong>Elektrizitätsquelle</strong> (Batterie, Generator) trennt Ladungen: Am Pluspol herrscht Elektronenmangel, am Minuspol Überschuss.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Geladen wird nicht Ladung erzeugt, sondern getrennt: Elektronen wandern, die Summe bleibt null.</div>
  `,
  formulas: [
    { name: "Ladung und Elementarladung", html: "Q = N · e", quantities: "e = 1,6 · 10<sup>−19</sup> C, N Zahl der überschüssigen oder fehlenden Elektronen" },
    { name: "Zahl der Elektronen", html: "N = Q / e", quantities: "z. B. 1 nC = 6,25 · 10<sup>9</sup> Elementarladungen" },
    { name: "Ladungsausgleich zweier gleicher Kugeln", html: "Q = (Q<sub>1</sub> + Q<sub>2</sub>) / 2", quantities: "jede Kugel trägt danach die Hälfte" },
  ],
  quiz: {
    question: "Eine Kunststofffolie wird mit einem Tuch gerieben und ist danach negativ geladen. Was ist passiert?",
    options: [
      "Elektronen sind vom Tuch auf die Folie übergegangen",
      "Protonen sind vom Tuch auf die Folie übergegangen",
      "Die Folie hat Ladung erzeugt, ohne dass sich das Tuch verändert",
    ],
    correctIndex: 0,
    explanation: "Nur Elektronen sind beweglich. Die Folie hat einen Elektronenüberschuss, das Tuch einen gleich großen Mangel und ist positiv.",
  },
  lab: {
    kind: "charge-transfer",
    title: "Labor: Reibungselektrizität",
    intro: "Reibe zwei Stoffe aneinander. Die Reihenfolge der Liste (Fell … PVC) bestimmt, wer positiv und wer negativ wird. Jeder Reibevorgang trennt etwa 0,5 nC.",
    params: [
      { type: "choice", key: "A", label: "Stoff A", options: TRIBO_SERIES.map((name, i) => ({ value: i, label: name })), value: 0 },
      { type: "choice", key: "B", label: "Stoff B", options: TRIBO_SERIES.map((name, i) => ({ value: i, label: name })), value: 2 },
      { type: "range", key: "n", label: "Reibevorgänge", unit: "", min: 1, max: 10, step: 1, value: 5 },
    ],
    readouts: [
      { key: "qA", label: "Ladung von A", unit: "nC", digits: 1, emphasis: true, compute: (v) => rubbedCharges(v.A, v.B, v.n).qA },
      { key: "qB", label: "Ladung von B", unit: "nC", digits: 1, emphasis: true, compute: (v) => rubbedCharges(v.A, v.B, v.n).qB },
      { key: "N", label: "Verschobene Elektronen", unit: "Milliarden", digits: 1, compute: (v) => (Math.abs(rubbedCharges(v.A, v.B, v.n).qA) * 1e-9) / E_CHARGE / 1e9 },
    ],
    goals: [
      { id: "glas-seide", text: "Reibe Glas an Seide: Das Glas wird positiv.", check: (v, r) => v.A === 1 && v.B === 3 && Number(r.qA) > 0 },
      { id: "pvc-fell", text: "Reibe PVC an Fell: der größte Unterschied in der Reihe, PVC wird negativ.", check: (v) => (v.A === 0 && v.B === 5) || (v.A === 5 && v.B === 0) },
      { id: "drei-nc", text: "Trenne genau 3 nC Ladung (A und B müssen verschieden sein).", check: (v, r) => v.A !== v.B && near(Math.abs(Number(r.qA)), 3, 0.001) },
    ],
  },
  exercises: [
    {
      id: "elektronenzahl",
      make: (rng, level) => {
        if (level === 1) {
          const Q = rng.pick([1.6, 3.2, 4.8, 6.4, 8, 12.8]);
          const N = (Q * 1e-9) / E_CHARGE / 1e9;
          return {
            prompt: `Beim Reiben trennt ein Tuch von einer Folie die Ladung ${fmtUnit(Q, "nC", 1)}. Wie viele Elektronen sind übergegangen? Gib die Zahl in Milliarden (10⁹) an.`,
            given: [`Q = ${fmtUnit(Q, "nC", 1)} = ${fmt(Q, 1)} · 10⁻⁹ C`, "e = 1,6 · 10⁻¹⁹ C"],
            formulaHint: "N = Q / e",
            answer: N,
            unit: "Milliarden Elektronen",
            digits: 1,
            solutionHtml: `N = Q / e = ${fmt(Q, 1)} · 10⁻⁹ C / (1,6 · 10⁻¹⁹ C) = ${fmt(N, 1)} · 10⁹ = <strong>${fmtUnit(N, "Milliarden", 1)}</strong>`,
          };
        }
        const N10 = rng.pick([2, 5, 7.5, 10, 15]);
        const Q = N10 * 1e10 * E_CHARGE * 1e9;
        return {
          prompt: `Ein Luftballon trägt nach dem Reiben einen Überschuss von ${fmt(N10, 1)} · 10¹⁰ Elektronen. Wie groß ist seine Ladung in Nanocoulomb?`,
          given: [`N = ${fmt(N10, 1)} · 10¹⁰`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: Q,
          unit: "nC",
          digits: 1,
          solutionHtml: `Q = N · e = ${fmt(N10, 1)} · 10¹⁰ · 1,6 · 10⁻¹⁹ C = ${fmt(Q, 1)} · 10⁻⁹ C = <strong>${fmtUnit(Q, "nC", 1)}</strong> (negativ)`,
        };
      },
    },
    {
      id: "atomladung",
      make: (rng, level) => {
        if (level === 1) {
          const Z = rng.pick([3, 8, 11, 13, 17, 26]);
          const k = rng.int(1, 3);
          return {
            prompt: `Ein Atom hat ${Z} Protonen, aber nur ${Z - k} Elektronen. Wie groß ist seine Gesamtladung in Elementarladungen e (Betrag)? Ist es positiv oder negativ geladen?`,
            given: [`Protonen: ${Z}`, `Elektronen: ${Z - k}`],
            formulaHint: "Ladung = (Protonen − Elektronen) · e",
            answer: k,
            unit: "e",
            digits: 0,
            solutionHtml: `(${Z} − ${Z - k}) · e = <strong>${k} e</strong>, und zwar <strong>positiv</strong>, denn es fehlen Elektronen.`,
          };
        }
        const k = rng.int(1, 3);
        const q = k * 1.6;
        return {
          prompt: `Aus einem neutralen Atom werden ${k} Elektronen herausgelöst. Wie groß ist die Ladung des entstandenen Ions in Einheiten von 10⁻¹⁹ C?`,
          given: [`${k} Elektronen fehlen`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: q,
          unit: "· 10⁻¹⁹ C",
          digits: 1,
          solutionHtml: `Q = ${k} · e = ${k} · 1,6 · 10⁻¹⁹ C = <strong>${fmtUnit(q, "· 10⁻¹⁹ C", 1)}</strong> (positiv)`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst Aufladen mit Elektronenüberschuss und -mangel und rechnest mit der Elementarladung.",
};

// 5.4 Elektrisches Feld und Influenz ───────────────────────────────────────

const feld: Lesson = {
  id: "el-4-elektrisches-feld",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "5.4 Elektrisches Feld und Influenz",
  subtitle: "Feldlinien zwischen Ladungen und Ladungstrennung im Leiter",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (I und II/III): elektrisches Feld, elektrische Influenz, Ladungsverteilung auf geladenen Körpern",
  whyItMatters:
    "Ein geladener Luftballon zieht kleine Papierstücke an, ohne sie zu berühren. Das Feld ist die Vorstellung, mit der man diese Fernwirkung zeichnen und vorhersagen kann.",
  explanationHtml: `
    <p>Um jeden geladenen Körper ist ein <strong>elektrisches Feld</strong>: Auf andere Ladungen wirken dort Kräfte. Man zeichnet es mit <strong>Feldlinien</strong>:</p>
    <ul>
      <li>Feldlinien beginnen an positiven Ladungen und enden an negativen. Die Richtung ist die Richtung der Kraft auf eine <em>positive</em> Probeladung.</li>
      <li>Je dichter die Feldlinien, desto stärker das Feld (nahe der Ladung, an Spitzen).</li>
      <li>Bei einer einzelnen Ladung laufen die Feldlinien strahlenförmig auseinander. Zwischen zwei parallelen, entgegengesetzt geladenen Platten sind sie <strong>parallel</strong>: ein <strong>homogenes</strong> Feld.</li>
    </ul>
    <p><strong>Influenz:</strong> Bringt man einen geladenen Stab nahe an einen neutralen <em>Leiter</em>, so verschiebt das Feld die frei beweglichen Elektronen im Leiter. Die dem Stab zugewandte Seite erhält die <strong>entgegengesetzte</strong> Ladung, die abgewandte die <strong>gleichnamige</strong>. Der Leiter bleibt insgesamt neutral. Trennt man ihn in zwei Teile, solange der Stab da ist, bleiben die Teile entgegengesetzt geladen. Deshalb werden auch ungeladene Körper angezogen (der Ballon klebt an der Wand).</p>
    <p>Im Inneren eines geschlossenen Metallkäfigs ist das Feld null (<strong>Faradayscher Käfig</strong>): Ein Auto schützt bei Gewitter.</p>
    <div class="merke"><strong>Merke:</strong> Influenz trennt Ladungen im Leiter, ohne dass Ladung hinzukommt. Zugewandt: entgegengesetzt, abgewandt: gleichnamig.</div>
  `,
  formulas: [
    { name: "Feldrichtung", html: "Feldlinien: + → −", quantities: "Richtung der Kraft auf eine positive Probeladung" },
    { name: "Influenz", html: "zugewandt: entgegengesetzt, abgewandt: gleichnamig", quantities: "Gesamtladung des Leiters bleibt 0" },
    { name: "Ladungsausgleich", html: "Q = (Q<sub>1</sub> + Q<sub>2</sub>) / 2", quantities: "gleich große Kugeln nach Berührung" },
  ],
  quiz: {
    question: "Ein negativ geladener Stab wird an eine neutrale Metallkugel gehalten. Was geschieht in der Kugel?",
    options: [
      "Die Kugel wird insgesamt negativ geladen",
      "Die Kugel bleibt unverändert",
      "Die Elektronen weichen aus: Die dem Stab zugewandte Seite wird positiv, die abgewandte negativ",
    ],
    correctIndex: 2,
    explanation: "Das Feld des Stabes drängt Elektronen zur abgewandten Seite. Zugewandt bleibt Elektronenmangel (positiv). Insgesamt bleibt die Kugel neutral.",
  },
  lab: {
    kind: "influence",
    title: "Labor: Influenz an zwei Kugeln",
    intro: "Ein geladener Stab nähert sich zwei sich berührenden Metallkugeln. Ändere Vorzeichen und Abstand und trenne danach die Kugeln im Feld.",
    params: [
      { type: "choice", key: "sign", label: "Ladung des Stabes", options: [{ value: 0, label: "negativ (−)" }, { value: 1, label: "positiv (+)" }], value: 0 },
      { type: "range", key: "d", label: "Abstand des Stabes", unit: "cm", min: 2, max: 20, step: 2, value: 10 },
      { type: "choice", key: "split", label: "Kugeln", options: [{ value: 0, label: "berühren sich" }, { value: 1, label: "im Feld getrennt" }], value: 0 },
    ],
    readouts: [
      { key: "Qi", label: "Verschobene Ladung", unit: "nC", digits: 1, emphasis: true, compute: (v) => INFLUENCE_MAX_NC * influenceShare(v.d) },
      { key: "near", label: "Dem Stab zugewandte Seite", emphasis: true, compute: (v) => (v.sign === 0 ? "positiv (+)" : "negativ (−)") },
      { key: "far", label: "Abgewandte Seite", compute: (v) => (v.sign === 0 ? "negativ (−)" : "positiv (+)") },
    ],
    goals: [
      { id: "influenz-nah", text: "Bringe den negativen Stab auf höchstens 4 cm heran: Mehr als 4 nC werden verschoben.", check: (v, r) => v.sign === 0 && v.d <= 4 && Number(r.Qi) > 4 },
      { id: "trennen-negativ", text: "Trenne die Kugeln im Feld eines negativen Stabes (Abstand höchstens 6 cm): Die nahe Kugel bleibt positiv.", check: (v) => v.sign === 0 && v.split === 1 && v.d <= 6 },
      { id: "trennen-positiv", text: "Trenne die Kugeln im Feld eines positiven Stabes (Abstand höchstens 6 cm): Die nahe Kugel bleibt negativ.", check: (v) => v.sign === 1 && v.split === 1 && v.d <= 6 },
    ],
  },
  exercises: [
    {
      id: "ladungsausgleich",
      make: (rng, level) => {
        if (level === 1) {
          const Q1 = rng.pick([6, 8, 10, 12]);
          const Q2 = rng.pick([0, 2, -2, 4, -4]);
          const Q = (Q1 + Q2) / 2;
          return {
            prompt: `Zwei gleich große Metallkugeln tragen ${fmtUnit(Q1, "nC", 0)} und ${fmtUnit(Q2, "nC", 0)}. Sie werden kurz berührt und wieder getrennt. Welche Ladung hat danach jede Kugel?`,
            given: [`Q₁ = ${fmtUnit(Q1, "nC", 0)}`, `Q₂ = ${fmtUnit(Q2, "nC", 0)}`],
            formulaHint: "Q = (Q₁ + Q₂) / 2",
            answer: Q,
            unit: "nC",
            digits: 1,
            solutionHtml: `Q = (Q₁ + Q₂) / 2 = (${fmt(Q1, 0)} + (${fmt(Q2, 0)})) nC / 2 = <strong>${fmtUnit(Q, "nC", 1)}</strong>`,
          };
        }
        const QA = rng.pick([8, 12, 16, 20]);
        const QC = QA / 4;
        return {
          prompt: `Kugel A trägt ${fmtUnit(QA, "nC", 0)}, die gleich großen Kugeln B und C sind neutral. Zuerst berühren sich A und B und werden getrennt, danach berühren sich B und C und werden getrennt. Welche Ladung hat Kugel C zum Schluss?`,
          given: [`Q(A) = ${fmtUnit(QA, "nC", 0)}`, "B und C neutral"],
          answer: QC,
          unit: "nC",
          digits: 2,
          solutionHtml: `A und B teilen: je ${fmt(QA / 2, 1)} nC. Dann teilen B und C: je ${fmt(QA / 4, 2)} nC. Kugel C hat <strong>${fmtUnit(QC, "nC", 2)}</strong>.`,
        };
      },
    },
    {
      id: "influenz-bilanz",
      make: (rng, level) => {
        if (level === 1) {
          const Q = rng.pick([2, 3, 4, 5, 6]);
          return {
            prompt: `Ein positiv geladener Stab nähert sich zwei sich berührenden neutralen Metallkugeln. Auf der abgewandten Kugel sitzen durch Influenz +${Q} nC. Trennt man die Kugeln im Feld, welchen Betrag hat die Ladung der dem Stab zugewandten Kugel?`,
            given: [`abgewandte Kugel: +${fmtUnit(Q, "nC", 0)}`, "insgesamt neutral"],
            formulaHint: "Die Summe beider Ladungen bleibt 0",
            answer: Q,
            unit: "nC",
            digits: 0,
            solutionHtml: `Die Gesamtladung bleibt 0, also trägt die zugewandte Kugel −${fmt(Q, 0)} nC: Betrag <strong>${fmtUnit(Q, "nC", 0)}</strong>.`,
          };
        }
        const Q = rng.pick([1.6, 3.2, 4.8, 8]);
        const N = (Q * 1e-9) / E_CHARGE / 1e9;
        return {
          prompt: `Bei der Influenz werden im Metall ${fmtUnit(Q, "nC", 1)} Ladung verschoben. Wie viele Elektronen wandern dabei zur Seite? Gib die Zahl in Milliarden (10⁹) an.`,
          given: [`Q = ${fmtUnit(Q, "nC", 1)}`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: N,
          unit: "Milliarden Elektronen",
          digits: 1,
          solutionHtml: `N = Q / e = ${fmt(Q, 1)} · 10⁻⁹ C / (1,6 · 10⁻¹⁹ C) = <strong>${fmtUnit(N, "· 10⁹", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest elektrische Felder und erklärst Influenz mit verschobenen Elektronen.",
};

// 5.5 Anwendungen der Elektrostatik ────────────────────────────────────────

const anwendung: Lesson = {
  id: "el-5-elektrostatik-anwendung",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "5.5 Anwendungen der Elektrostatik",
  subtitle: "Elektrofilter, Fotokopierer und Blitzableiter",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (I und II/III): Anwendungen der Elektrostatik (zum Beispiel Fotokopierer, Entstaubungsanlagen von Rauchgasen)",
  whyItMatters:
    "Kraftwerke, Kopierer und Lackieranlagen nutzen das elektrische Feld gezielt. Ohne Elektrofilter wäre die Luft in der Nähe von Kohlekraftwerken und Zementwerken viel staubiger.",
  explanationHtml: `
    <p><strong>Elektrofilter (Rauchgasentstaubung):</strong> Im Filter laufen Drähte mit hoher Spannung zwischen geerdeten Platten. An den Drähten (Spitzenwirkung!) wird die Luft ionisiert, und die Staubteilchen laden sich auf. Das elektrische Feld zieht die geladenen Teilchen zu den Platten, wo sie haften. Von Zeit zu Zeit werden die Platten abgeklopft. Je stärker das Feld und je langsamer das Gas strömt, desto mehr Staub wird abgeschieden.</p>
    <p><strong>Fotokopierer:</strong> Eine Trommel wird gleichmäßig aufgeladen. Beim Belichten werden die hellen Stellen entladen, nur die dunklen (Schrift) bleiben geladen. Der entgegengesetzt geladene Toner haftet an diesen Stellen, wird auf das Papier übertragen und festgeschmolzen.</p>
    <ul>
      <li><strong>Blitzableiter:</strong> Eine geerdete Spitze zieht den Blitz an und führt die Ladung ab (Spitzenwirkung).</li>
      <li><strong>Lackieren:</strong> Geladene Lacktröpfchen werden vom geerdeten Werkstück angezogen und umhüllen es gleichmäßig.</li>
      <li><strong>Gefahren:</strong> Entladungsfunken können Gase entzünden (Tanken, Staubexplosionen). Antistatik-Maßnahmen: Erdung, leitfähige Bänder.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Geladene Teilchen folgen dem elektrischen Feld. Das nutzt man zum Filtern, Kopieren und Lackieren.</div>
  `,
  formulas: [
    { name: "Abscheidegrad", html: "η = 1 − Austrag / Eintrag", quantities: "z. B. 99 % = 0,99" },
    { name: "Staubmasse", html: "m = Konzentration · Gasvolumen · η", quantities: "abgeschiedene Masse" },
  ],
  quiz: {
    question: "Warum werden die Staubteilchen im Elektrofilter an den Platten abgeschieden?",
    options: [
      "Sie sind elektrisch geladen und werden vom elektrischen Feld zu den Platten gezogen",
      "Sie sind schwerer als das Gas und fallen von selbst herunter",
      "Die Platten sind heiß und verdampfen den Staub",
    ],
    correctIndex: 0,
    explanation: "Zuerst werden die Staubteilchen aufgeladen. Im elektrischen Feld wirkt dann eine Kraft auf sie in Richtung der Platten.",
  },
  lab: {
    kind: "electro-filter",
    title: "Labor: Elektrofilter",
    intro: "Rauchgas mit Staub strömt durch einen 10 m langen Filter mit 30 cm Plattenabstand. Verändere die Spannung und die Gasgeschwindigkeit.",
    params: [
      { type: "range", key: "U", label: "Spannung", unit: "kV", min: 10, max: 60, step: 10, value: 30 },
      { type: "range", key: "v", label: "Gasgeschwindigkeit", unit: "m/s", min: 1, max: 5, step: 1, value: 2 },
    ],
    readouts: [
      { key: "eta", label: "Abscheidegrad", unit: "%", digits: 1, emphasis: true, compute: (v) => filterEfficiency(v.U, v.v) },
      { key: "rest", label: "Staub im Reingas (Rohgas: 1000 mg/m³)", unit: "mg/m³", digits: 0, compute: (v) => 1000 * (1 - filterEfficiency(v.U, v.v) / 100) },
    ],
    goals: [
      { id: "neunundneunzig", text: "Erreiche einen Abscheidegrad von mindestens 99 %.", check: (_v, r) => Number(r.eta) >= 99 },
      { id: "schnell-schwach", text: "Bei 10 kV und 5 m/s scheidet der Filter weniger als 25 % ab.", check: (v, r) => v.U === 10 && v.v === 5 && Number(r.eta) < 25 },
      { id: "langsamer", text: "Halbiere bei 30 kV die Gasgeschwindigkeit von 2 auf 1 m/s: Der Abscheidegrad steigt über 90 %.", check: (v, r) => v.U === 30 && v.v === 1 && Number(r.eta) > 90 },
    ],
  },
  exercises: [
    {
      id: "reststaub",
      make: (rng, level) => {
        if (level === 1) {
          const c = rng.pick([20, 25, 40, 50]);
          const eta = rng.pick([90, 95, 98, 99]);
          const rest = c * (1 - eta / 100);
          return {
            prompt: `Ein Elektrofilter hat den Abscheidegrad ${eta} %. Das Rohgas enthält ${fmtUnit(c, "g/m³", 0)} Staub. Wie viel Staub enthält ein Kubikmeter Reingas?`,
            given: [`Eintrag ${fmtUnit(c, "g/m³", 0)}`, `η = ${eta} %`],
            formulaHint: "Austrag = Eintrag · (1 − η)",
            answer: rest,
            unit: "g/m³",
            digits: 2,
            solutionHtml: `Austrag = ${fmt(c, 0)} g/m³ · (1 − ${fmt(eta / 100, 2)}) = <strong>${fmtUnit(rest, "g/m³", 2)}</strong>`,
          };
        }
        const c = rng.pick([20, 25, 30]);
        const rest = rng.pick([0.05, 0.1, 0.15]);
        const eta = (1 - rest / c) * 100;
        return {
          prompt: `Das Rohgas eines Kraftwerks enthält ${fmtUnit(c, "g/m³", 0)} Staub. Im Reingas dürfen höchstens ${fmtUnit(rest, "g/m³", 2)} bleiben. Welchen Abscheidegrad muss der Filter mindestens haben (in Prozent)?`,
          given: [`Eintrag ${fmtUnit(c, "g/m³", 0)}`, `Austrag höchstens ${fmtUnit(rest, "g/m³", 2)}`],
          answer: eta,
          unit: "%",
          digits: 2,
          tolerance: 0.005,
          solutionHtml: `η = 1 − Austrag / Eintrag = 1 − ${fmt(rest, 2)} / ${fmt(c, 0)} = ${fmt(eta / 100, 4)} = <strong>${fmtUnit(eta, "%", 2)}</strong>`,
        };
      },
    },
    {
      id: "staubmasse",
      make: (rng, level) => {
        if (level === 1) {
          const V = rng.pick([1000, 5000, 20000]);
          const c = rng.pick([10, 20, 30]);
          const eta = rng.pick([0.9, 0.95, 0.99]);
          const m = (V * c * eta) / 1000;
          return {
            prompt: `Durch einen Filter strömen ${fmtUnit(V, "m³", 0)} Rauchgas mit ${fmtUnit(c, "g/m³", 0)} Staub. Der Filter scheidet ${fmt(eta * 100, 0)} % ab. Wie viel Kilogramm Staub werden abgeschieden?`,
            given: [`V = ${fmtUnit(V, "m³", 0)}`, `c = ${fmtUnit(c, "g/m³", 0)}`, `η = ${fmt(eta * 100, 0)} %`],
            formulaHint: "m = c · V · η (1000 g = 1 kg)",
            answer: m,
            unit: "kg",
            digits: 1,
            solutionHtml: `m = ${fmt(c, 0)} g/m³ · ${fmt(V, 0)} m³ · ${fmt(eta, 2)} = ${fmt(c * V * eta, 0)} g = <strong>${fmtUnit(m, "kg", 1)}</strong>`,
          };
        }
        const V = rng.pick([0.5, 1, 2]);
        const c = rng.pick([15, 20]);
        const eta = rng.pick([0.99, 0.995]);
        const t = (V * 1e6 * c * eta) / 1e6;
        return {
          prompt: `Ein Kraftwerk leitet ${fmt(V, 1)} · 10⁶ m³ Rauchgas pro Stunde durch seinen Elektrofilter. Das Rohgas hat ${fmtUnit(c, "g/m³", 0)} Staub, der Abscheidegrad beträgt ${fmt(eta * 100, 1)} %. Wie viele Tonnen Staub werden pro Stunde abgeschieden?`,
          given: [`${fmt(V, 1)} · 10⁶ m³ pro Stunde`, `c = ${fmtUnit(c, "g/m³", 0)}`, `η = ${fmt(eta * 100, 1)} %`],
          answer: t,
          unit: "t",
          digits: 2,
          solutionHtml: `m = ${fmt(V * 1e6, 0)} m³ · ${fmt(c, 0)} g/m³ · ${fmt(eta, 3)} = ${fmt(V * 1e6 * c * eta, 0)} g = <strong>${fmtUnit(t, "t", 2)}</strong> (1 t = 1 000 000 g)`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst Elektrofilter und Fotokopierer mit geladenen Teilchen im elektrischen Feld.",
};

// 5.6 Elektrischer Strom und Stromstärke ───────────────────────────────────

const strom: Lesson = {
  id: "el-6-strom",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "5.6 Elektrischer Strom und Stromstärke",
  subtitle: "Gerichtete Bewegung von Ladungen und die Einheit Ampere",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (I und II/III): Modellvorstellung des elektrischen Stroms als gerichtete Bewegung geladener Teilchen im elektrischen Feld; Stromstärke als abgeleitete Größe; Elementarladung",
  whyItMatters:
    "Wenn du eine Lampe einschaltest, fließt „Strom“. Aber was bewegt sich dabei, und wie misst man, wie viel? Das Teilchenmodell macht aus dem Wort „Strom“ eine messbare Größe.",
  explanationHtml: `
    <p>In einem <strong>Metall</strong> sind die Atomrümpfe (positiv) fest im Gitter, die <strong>Leitungselektronen</strong> (negativ) sind frei beweglich und bewegen sich ungeordnet. Schließt man eine Quelle an, entsteht im Leiter ein <strong>elektrisches Feld</strong>. Es treibt alle Leitungselektronen in <em>eine</em> Richtung: Das ist der <strong>elektrische Strom</strong>, die gerichtete Bewegung geladener Teilchen.</p>
    <ul>
      <li>Die Elektronen wandern vom Minuspol zum Pluspol. Aus historischen Gründen legte man die <strong>technische Stromrichtung</strong> vom Plus- zum Minuspol fest.</li>
      <li>Die <strong>Stromstärke I</strong> sagt, wie viel Ladung Q in welcher Zeit t durch den Querschnitt des Leiters fließt: <strong>I = Q / t</strong>. Einheit: <strong>1 Ampere (A) = 1 C/s</strong>. Außerdem 1 mA = 0,001 A.</li>
      <li>Die Ladung besteht aus Elementarladungen: Q = N · e mit e = 1,6 · 10<sup>−19</sup> C. Bei 1 A fließen pro Sekunde 6,25 · 10<sup>18</sup> Elektronen durch den Querschnitt.</li>
      <li>Die einzelnen Elektronen bewegen sich dabei nur mit wenigen Millimetern pro Sekunde, das elektrische Feld breitet sich aber fast mit Lichtgeschwindigkeit aus. Deshalb leuchtet die Lampe sofort.</li>
    </ul>
    <p>Typische Stromstärken: Taschenlampe etwa 0,3 A, Handy-Ladegerät 1 bis 2 A, Blitz bis über 30 000 A.</p>
    <div class="merke"><strong>Merke:</strong> Stromstärke = Ladung pro Zeit. Ein Ampere sind 1 Coulomb pro Sekunde.</div>
  `,
  formulas: [
    { name: "Stromstärke", html: "I = Q / t", quantities: "I in A (1 A = 1 C/s), Q in C, t in s" },
    { name: "Ladung", html: "Q = I · t", quantities: "" },
    { name: "Zahl der Elektronen", html: "N = Q / e", quantities: "e = 1,6 · 10<sup>−19</sup> C; 1 A entspricht 6,25 · 10<sup>18</sup> Elektronen pro Sekunde" },
  ],
  quiz: {
    question: "Durch einen Draht fließt 2 s lang ein Strom von 5 A. Wie viel Ladung ist durch den Querschnitt geflossen?",
    options: ["2,5 C", "7 C", "10 C"],
    correctIndex: 2,
    explanation: "Q = I · t = 5 A · 2 s = 10 C. Ein Ampere heißt: ein Coulomb pro Sekunde.",
  },
  lab: {
    kind: "current-flow",
    title: "Labor: Ladung im Draht",
    intro: "Stelle Stromstärke und Zeit ein. Der Zähler zeigt die Ladung und die Zahl der Elektronen, die durch den Querschnitt des Drahtes gewandert sind.",
    params: [
      { type: "range", key: "I", label: "Stromstärke I", unit: "A", min: 0.1, max: 5, step: 0.1, value: 0.5, digits: 1 },
      { type: "range", key: "t", label: "Zeit t", unit: "s", min: 1, max: 20, step: 1, value: 5 },
    ],
    readouts: [
      { key: "Q", label: "Ladung Q = I · t", unit: "C", digits: 1, emphasis: true, compute: (v) => v.I * v.t },
      { key: "rate", label: "Elektronen pro Sekunde", unit: "· 10¹⁸", digits: 2, compute: (v) => v.I / E_CHARGE / 1e18 },
      { key: "N", label: "Elektronen in der Zeit t", unit: "· 10¹⁸", digits: 1, emphasis: true, compute: (v) => (v.I * v.t) / E_CHARGE / 1e18 },
    ],
    goals: [
      { id: "zehn-coulomb", text: "Lass genau 10 C durch den Querschnitt fließen.", check: (_v, r) => near(Number(r.Q), 10, 0.001) },
      { id: "ein-ampere", text: "Stelle 1 A ein: Pro Sekunde fließen 6,25 · 10¹⁸ Elektronen.", check: (v) => near(v.I, 1, 0.001) },
      { id: "viele", text: "Lass mehr als 100 · 10¹⁸ Elektronen durch den Draht wandern.", check: (_v, r) => Number(r.N) > 100 },
    ],
  },
  exercises: [
    {
      id: "ladungsmenge",
      make: (rng, level) => {
        if (level === 1) {
          const I = rng.pick([0.2, 0.5, 1, 1.5, 2, 4]);
          const t = rng.pick([5, 10, 20, 30, 60]);
          return {
            prompt: `Durch einen Leiter fließt ${fmtUnit(t, "s", 0)} lang ein Strom von ${fmtUnit(I, "A", 1)}. Wie viel Ladung fließt durch den Querschnitt?`,
            given: [`I = ${fmtUnit(I, "A", 1)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "Q = I · t",
            answer: I * t,
            unit: "C",
            digits: 1,
            solutionHtml: `Q = I · t = ${fmt(I, 1)} A · ${fmt(t, 0)} s = <strong>${fmtUnit(I * t, "C", 1)}</strong>`,
          };
        }
        const kA = rng.pick([20, 30, 40]);
        const ms = rng.pick([0.1, 0.2, 0.5]);
        const Q = kA * 1000 * (ms / 1000);
        return {
          prompt: `Ein Blitz hat eine Stromstärke von ${fmtUnit(kA, "kA", 0)} und dauert ${fmtUnit(ms, "ms", 1)}. Wie viel Ladung wird dabei transportiert?`,
          given: [`I = ${fmtUnit(kA, "kA", 0)} = ${fmtUnit(kA * 1000, "A", 0)}`, `t = ${fmtUnit(ms, "ms", 1)} = ${fmt(ms / 1000, 4)} s`],
          answer: Q,
          unit: "C",
          digits: 1,
          solutionHtml: `Q = I · t = ${fmt(kA * 1000, 0)} A · ${fmt(ms / 1000, 4)} s = <strong>${fmtUnit(Q, "C", 1)}</strong>`,
        };
      },
    },
    {
      id: "elektronenstrom",
      make: (rng, level) => {
        if (level === 1) {
          const I = rng.pick([0.2, 0.4, 0.8, 1, 2]);
          const N = I / E_CHARGE / 1e18;
          return {
            prompt: `Wie viele Elektronen fließen bei ${fmtUnit(I, "A", 1)} pro Sekunde durch den Querschnitt? Gib die Zahl in Einheiten von 10¹⁸ an.`,
            given: [`I = ${fmtUnit(I, "A", 1)}`, "e = 1,6 · 10⁻¹⁹ C"],
            formulaHint: "N = I · t / e mit t = 1 s",
            answer: N,
            unit: "· 10¹⁸ pro Sekunde",
            digits: 2,
            solutionHtml: `N = Q / e = ${fmt(I, 1)} C / (1,6 · 10⁻¹⁹ C) = <strong>${fmtUnit(N, "· 10¹⁸", 2)}</strong>`,
          };
        }
        const I = rng.pick([0.2, 0.4, 0.8]);
        const t = rng.pick([5, 10, 20]);
        const N = (I * t) / E_CHARGE / 1e18;
        return {
          prompt: `Eine Taschenlampe führt ${fmtUnit(t, "s", 0)} lang einen Strom von ${fmtUnit(I, "A", 1)}. Wie viele Elektronen passieren dabei den Querschnitt des Drahtes? Gib die Zahl in Einheiten von 10¹⁸ an.`,
          given: [`I = ${fmtUnit(I, "A", 1)}`, `t = ${fmtUnit(t, "s", 0)}`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: N,
          unit: "· 10¹⁸",
          digits: 2,
          solutionHtml: `Q = I · t = ${fmt(I * t, 1)} C<br>N = Q / e = ${fmt(I * t, 1)} / (1,6 · 10⁻¹⁹) = <strong>${fmtUnit(N, "· 10¹⁸", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du verstehst Strom als gerichtete Ladungsbewegung und rechnest I = Q / t.",
};

// 5.7 Stromkreis, Schaltsymbole, Leiter und Isolatoren ─────────────────────

interface CircuitPart {
  name: string;
  kind: "strong" | "weak" | "insulator";
}

const CIRCUIT_PARTS: CircuitPart[] = [
  { name: "Kupferdraht", kind: "strong" },
  { name: "Eisennagel", kind: "strong" },
  { name: "Graphitmine", kind: "strong" },
  { name: "Salzwasser", kind: "weak" },
  { name: "Radiergummi", kind: "insulator" },
  { name: "Kunststofflineal", kind: "insulator" },
  { name: "Glasstab", kind: "insulator" },
  { name: "destilliertes Wasser", kind: "insulator" },
];

function lampState(v: { switch: number; part: number }): string {
  if (v.switch === 0) return "Lampe dunkel (Schalter offen)";
  const kind = CIRCUIT_PARTS[v.part].kind;
  if (kind === "strong") return "Lampe leuchtet";
  if (kind === "weak") return "Lampe leuchtet schwach";
  return "Lampe dunkel (Isolator unterbricht)";
}

const stromkreis: Lesson = {
  id: "el-7-stromkreis",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "5.7 Stromkreis, Schaltsymbole, Leiter und Isolatoren",
  subtitle: "Wann eine Lampe leuchtet und wie man Schaltungen zeichnet",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (II/III; Zweig I: einfache Stromkreise): elektrische Stromkreise, Schaltsymbole, einfache Schaltungen aus dem Alltag, Leiter und Isolatoren",
  whyItMatters:
    "Jede Taschenlampe, jedes Licht im Flur und jede Fahrradbeleuchtung folgt denselben Regeln. Wer einen Schaltplan lesen kann, kann Schaltungen nachbauen und Fehler suchen.",
  explanationHtml: `
    <p>Ein <strong>einfacher Stromkreis</strong> besteht aus <strong>Quelle</strong> (Batterie), <strong>Leitungen</strong>, <strong>Verbraucher</strong> (Lampe, Motor) und meist einem <strong>Schalter</strong>. Strom fließt nur, wenn der Kreis <strong>geschlossen</strong> ist. Ein offener Schalter, ein Kabelbruch oder ein Isolator im Kreis unterbricht ihn.</p>
    <p>Im <strong>Schaltplan</strong> zeichnet man Bauteile mit <strong>Schaltsymbolen</strong>: Quelle (zwei verschieden lange Striche), Lampe (Kreis mit Kreuz), Schalter (offen oder geschlossen), Motor (Kreis mit M), Leitung (gerade Linie), Sicherung. Man baut Schaltungen nach Plan auf und achtet darauf, dass jede Verbindung fest ist.</p>
    <ul>
      <li><strong>Leiter</strong> haben frei bewegliche Ladungsträger: Metalle (Elektronen), Graphit, Salzlösungen (Ionen). <strong>Isolatoren</strong> haben keine: Kunststoff, Glas, Gummi, Holz, trockene Luft, destilliertes Wasser.</li>
      <li><strong>Reihenschaltung</strong> (alle Bauteile hintereinander, ein einziger Kreis): Fällt eines aus, ist der Kreis unterbrochen und alle sind aus (frühere Lichterketten). Zwei Schalter in Reihe: Die Lampe leuchtet nur, wenn <em>beide</em> geschlossen sind (UND).</li>
      <li><strong>Parallelschaltung</strong> (Verzweigung, jedes Bauteil an der Quelle): Jedes Bauteil arbeitet unabhängig (Haushalt). Zwei Schalter parallel: Die Lampe leuchtet, wenn <em>mindestens einer</em> geschlossen ist (ODER).</li>
      <li><strong>Wechselschaltung</strong> (Treppenhaus): Zwei Wechselschalter schalten dieselbe Lampe von beiden Enden aus.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Strom braucht einen geschlossenen Kreis aus Leitern. Schalter in Reihe: UND, parallel: ODER.</div>
  `,
  formulas: [
    { name: "Reihe, zwei Schalter", html: "Lampe leuchtet, wenn S₁ und S₂ geschlossen", quantities: "UND-Schaltung: 1 von 4 Stellungen" },
    { name: "Parallel, zwei Schalter", html: "Lampe leuchtet, wenn S₁ oder S₂ geschlossen", quantities: "ODER-Schaltung: 3 von 4 Stellungen" },
    { name: "n Schalter", html: "Stellungen: 2<sup>n</sup>", quantities: "Reihe: 1 leuchtet, parallel: 2ⁿ − 1 leuchten" },
  ],
  quiz: {
    question: "Eine alte Lichterkette geht komplett aus, wenn eine Lampe durchbrennt. Warum?",
    options: [
      "Die Lampen sind parallel geschaltet",
      "Die Lampen sind in Reihe geschaltet, der Stromkreis ist unterbrochen",
      "Die Steckdose liefert keinen Strom mehr",
    ],
    correctIndex: 1,
    explanation: "In der Reihenschaltung gibt es nur einen Weg für den Strom. Fällt eine Lampe aus, ist der Kreis überall unterbrochen.",
  },
  lab: {
    kind: "circuit",
    title: "Labor: Prüfstrecke",
    intro: "Klemme einen Gegenstand in den Kreis und schließe den Schalter. Leuchtet die Lampe? So testet man Leiter und Isolatoren.",
    params: [
      { type: "choice", key: "switch", label: "Schalter", options: [{ value: 0, label: "offen" }, { value: 1, label: "geschlossen" }], value: 0 },
      { type: "choice", key: "part", label: "Gegenstand in der Prüfstrecke", options: CIRCUIT_PARTS.map((p, i) => ({ value: i, label: p.name })), value: 0 },
    ],
    readouts: [
      { key: "lamp", label: "Lampe", emphasis: true, compute: (v) => lampState({ switch: v.switch, part: v.part }) },
      { key: "type", label: "Der Gegenstand ist ein", compute: (v) => (CIRCUIT_PARTS[v.part].kind === "insulator" ? "Isolator" : CIRCUIT_PARTS[v.part].kind === "weak" ? "Leiter (leitet schwächer)" : "guter Leiter") },
    ],
    goals: [
      { id: "leuchtet", text: "Bringe die Lampe zum Leuchten: Schließe den Schalter und klemme einen guten Leiter ein.", check: (_v, r) => r.lamp === "Lampe leuchtet" },
      { id: "isolator", text: "Schließe den Schalter mit dem Kunststofflineal in der Prüfstrecke: Die Lampe bleibt dunkel.", check: (v, r) => v.switch === 1 && v.part === 5 && r.lamp === "Lampe dunkel (Isolator unterbricht)" },
      { id: "salzwasser", text: "Schließe den Schalter mit Salzwasser in der Prüfstrecke: Die Lampe leuchtet nur schwach.", check: (_v, r) => r.lamp === "Lampe leuchtet schwach" },
    ],
  },
  exercises: [
    {
      id: "schalter-kombi",
      make: (rng, level) => {
        if (level === 1) {
          const series = rng.int(0, 1) === 0;
          const n = rng.int(2, 3);
          const total = 2 ** n;
          return {
            prompt: `Eine Lampe hängt an ${n} Schaltern, die ${series ? "in Reihe" : "parallel"} geschaltet sind. Jeder Schalter kann offen oder geschlossen sein, es gibt also ${total} Schalterstellungen. In wie vielen davon leuchtet die Lampe?`,
            given: [`${n} Schalter ${series ? "in Reihe" : "parallel"}`, `${total} Stellungen`],
            formulaHint: series ? "Reihe: nur wenn alle geschlossen sind" : "parallel: wenn mindestens einer geschlossen ist",
            answer: series ? 1 : total - 1,
            unit: "Stellungen",
            digits: 0,
            tolerance: 0.001,
            solutionHtml: series
              ? `In der Reihenschaltung müssen alle ${n} Schalter geschlossen sein: <strong>1 Stellung</strong>.`
              : `Parallel genügt ein geschlossener Schalter. Nur die Stellung „alle offen“ ist dunkel: ${total} − 1 = <strong>${total - 1} Stellungen</strong>.`,
          };
        }
        const kind = rng.int(0, 1);
        if (kind === 0) {
          const n = rng.pick([4, 5]);
          return {
            prompt: `Eine Lampe ist mit ${n} parallel geschalteten Schaltern verbunden. In wie vielen der ${2 ** n} Schalterstellungen leuchtet sie?`,
            given: [`${n} Schalter parallel`, `${2 ** n} Stellungen`],
            answer: 2 ** n - 1,
            unit: "Stellungen",
            digits: 0,
            tolerance: 0.001,
            solutionHtml: `Nur wenn alle offen sind, ist sie dunkel: ${2 ** n} − 1 = <strong>${2 ** n - 1} Stellungen</strong>.`,
          };
        }
        return {
          prompt: "Im Treppenhaus schalten zwei Wechselschalter eine Lampe von oben und von unten (Wechselschaltung). Von den 4 Stellungen der beiden Schalter leuchtet die Lampe in genau der Hälfte, nämlich wenn beide gleich oder beide verschieden stehen, je nach Verdrahtung. In wie vielen Stellungen leuchtet sie?",
          given: ["2 Wechselschalter", "4 Stellungen"],
          answer: 2,
          unit: "Stellungen",
          digits: 0,
          tolerance: 0.001,
          solutionHtml: "Jedes Umlegen eines Schalters wechselt Licht an/aus. Die Lampe leuchtet in <strong>2 von 4</strong> Stellungen.",
        };
      },
    },
    {
      id: "ausfall",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick([10, 12, 20, 24]);
          const k = rng.int(1, 3);
          return {
            prompt: `Eine Lichterkette besteht aus ${n} parallel geschalteten Lampen. ${k} ${k === 1 ? "Lampe brennt" : "Lampen brennen"} durch. Wie viele leuchten noch?`,
            given: [`${n} Lampen parallel`, `${k} defekt`],
            formulaHint: "Parallel arbeitet jede Lampe unabhängig",
            answer: n - k,
            unit: "Lampen",
            digits: 0,
            tolerance: 0.001,
            solutionHtml: `Jede Lampe hat ihren eigenen Kreis: ${n} − ${k} = <strong>${n - k} Lampen</strong> leuchten.`,
          };
        }
        const n = rng.pick([10, 16, 20, 50]);
        return {
          prompt: `Eine alte Lichterkette hat ${n} Lampen in Reihenschaltung. Eine einzige brennt durch. Wie viele Lampen sind jetzt dunkel?`,
          given: [`${n} Lampen in Reihe`, "1 defekt"],
          answer: n,
          unit: "Lampen",
          digits: 0,
          tolerance: 0.001,
          solutionHtml: `Der einzige Stromkreis ist unterbrochen: Alle <strong>${n} Lampen</strong> sind dunkel.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst geschlossene Stromkreise, Leiter und Isolatoren und unterscheidest Reihe und Parallel.",
};

// 5.8 Stromstärke messen ───────────────────────────────────────────────────

const amperemeter: Lesson = {
  id: "el-8-stromstaerke-messen",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "5.8 Stromstärke messen",
  subtitle: "Das Amperemeter gehört in den Stromkreis, nicht daneben",
  tracks: ["I"],
  lehrplan: "Ph8 LB 3 (I): Stromstärkenmessung; Experimente mit Stromstärkemessgeräten in einfachen Stromkreisen, Protokollieren mit fachspezifischen Schreibweisen",
  whyItMatters:
    "Eine falsch angeschlossene Messung kann das Messgerät zerstören. Wer richtig misst, protokolliert Ergebnisse mit Größe, Einheit und Messbereich, so wie Physiker es tun.",
  explanationHtml: `
    <p>Die Stromstärke misst man mit einem <strong>Amperemeter</strong> (Stromstärkemessgerät).</p>
    <ul>
      <li>Das Gerät wird <strong>in Reihe</strong> in den Stromkreis eingebaut: Man trennt den Kreis an einer Stelle auf und schließt das Gerät dort ein, sodass der gesamte Strom hindurchfließt.</li>
      <li>Ein Amperemeter hat einen sehr kleinen Innenwiderstand. <strong>Nie parallel</strong> zu einem Verbraucher oder direkt an die Quelle anschließen: Es entstünde ein <strong>Kurzschluss</strong>, ein sehr großer Strom, der das Gerät zerstören und die Leitungen überhitzen kann.</li>
      <li><strong>Messbereich:</strong> Beginne immer mit dem <em>größten</em> Messbereich und schalte herunter, bis der Zeiger deutlich ausschlägt (mindestens etwa ein Drittel der Skala). Wird der Messbereich überschritten, kann das Gerät beschädigt werden.</li>
      <li><strong>Ablesen:</strong> I = Zeigerstellung · Messbereich / Zahl der Teilstriche. Das Ergebnis wird mit Größe und Einheit protokolliert, zum Beispiel I = 0,35 A. 1 A = 1000 mA.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Amperemeter in Reihe, groß anfangen, Einheit angeben.</div>
  `,
  formulas: [
    { name: "Ablesen", html: "I = k · Messbereich / n", quantities: "k Zeigerstellung in Teilstrichen, n Gesamtzahl der Teilstriche" },
    { name: "Umrechnung", html: "1 A = 1000 mA", quantities: "" },
  ],
  quiz: {
    question: "Wie schließt man ein Amperemeter an, um den Strom durch eine Lampe zu messen?",
    options: [
      "Parallel zur Lampe",
      "Direkt an die beiden Pole der Batterie",
      "In Reihe zur Lampe: Der Stromkreis wird an einer Stelle aufgetrennt",
    ],
    correctIndex: 2,
    explanation: "Der Strom muss durch das Messgerät hindurchfließen. Parallel oder direkt an der Batterie wäre ein Kurzschluss.",
  },
  lab: {
    kind: "ammeter",
    title: "Labor: Amperemeter anschließen",
    intro: "Schließe das Amperemeter an und wähle den Messbereich. Der Strom im Kreis ist eingestellt. Beobachte den Zeiger.",
    params: [
      { type: "choice", key: "conn", label: "Anschluss", options: [{ value: 0, label: "in Reihe zur Lampe" }, { value: 1, label: "parallel zur Lampe" }], value: 0 },
      { type: "choice", key: "range", label: "Messbereich", options: [{ value: 0.03, label: "30 mA" }, { value: 0.3, label: "300 mA" }, { value: 3, label: "3 A" }], value: 3 },
      { type: "range", key: "I", label: "Strom im Kreis I", unit: "A", min: 0.05, max: 2, step: 0.05, value: 0.3, digits: 2 },
    ],
    readouts: [
      { key: "state", label: "Zeigerausschlag", emphasis: true, compute: (v) => ammeterState(v.conn, v.range, v.I) },
      { key: "frac", label: "Ausschlag in Teilen der Skala", digits: 2, compute: (v) => (v.conn === 0 ? Math.min(1.1, v.I / v.range) : 0) },
    ],
    goals: [
      { id: "gut-abgelesen", text: "Schließe das Amperemeter richtig an und wähle einen Messbereich, in dem der Zeiger gut ablesbar ist (mindestens ein Drittel, nicht über Skalenende).", check: (_v, r) => r.state === "gut ablesbar" },
      { id: "ueberlast", text: "Wähle einen zu kleinen Messbereich: Der Zeiger schlägt voll aus.", check: (v, r) => v.conn === 0 && r.state === "Messbereich zu klein: Zeiger am Anschlag" },
      { id: "kurzschluss", text: "Schließe das Amperemeter falsch parallel zur Lampe an und erkenne den Kurzschluss.", check: (v) => v.conn === 1 },
    ],
  },
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        if (level === 1) {
          const range = rng.pick([0.6, 1, 3]);
          const ticks = rng.pick([30, 50, 60]);
          const k = rng.int(Math.ceil(ticks * 0.2), Math.floor(ticks * 0.9));
          const I = (k * range) / ticks;
          return {
            prompt: `Ein Amperemeter hat ${ticks} Teilstriche und ist auf den Messbereich ${fmtUnit(range, "A", 1)} eingestellt. Der Zeiger steht beim ${k}. Teilstrich. Welche Stromstärke wird gemessen?`,
            given: [`Messbereich ${fmtUnit(range, "A", 1)}`, `${ticks} Teilstriche`, `Zeiger bei ${k}`],
            formulaHint: "I = k · Messbereich / n",
            answer: I,
            unit: "A",
            digits: 3,
            solutionHtml: `I = ${k} · ${fmt(range, 1)} A / ${ticks} = <strong>${fmtUnit(I, "A", 3)}</strong>`,
          };
        }
        const range = rng.pick([30, 100, 300]);
        const ticks = rng.pick([30, 50, 60]);
        const k = rng.int(Math.ceil(ticks * 0.3), Math.floor(ticks * 0.9));
        const I = (k * range) / ticks;
        return {
          prompt: `Ein Messgerät (${ticks} Teilstriche) steht auf dem Bereich ${fmtUnit(range, "mA", 0)}. Der Zeiger zeigt auf den ${k}. Teilstrich. Wie groß ist die Stromstärke in Milliampere?`,
          given: [`Messbereich ${fmtUnit(range, "mA", 0)}`, `${ticks} Teilstriche`, `Zeiger bei ${k}`],
          answer: I,
          unit: "mA",
          digits: 1,
          solutionHtml: `I = ${k} · ${fmt(range, 0)} mA / ${ticks} = <strong>${fmtUnit(I, "mA", 1)}</strong> = ${fmt(I / 1000, 4)} A`,
        };
      },
    },
    {
      id: "messbereich",
      make: (rng, level) => {
        if (level === 1) {
          const ranges = [0.1, 0.5, 1, 5];
          const I = rng.pick([0.05, 0.08, 0.3, 0.45, 0.8, 1.2, 3.5]);
          const best = ranges.find((r) => r >= I) as number;
          return {
            prompt: `Du erwartest eine Stromstärke von etwa ${fmtUnit(I, "A", 2)}. Das Amperemeter hat die Messbereiche 0,1 A, 0,5 A, 1 A und 5 A. Welchen kleinsten Messbereich kannst du wählen, ohne ihn zu überschreiten? Gib den Messbereich in A an.`,
            given: [`erwartet: ${fmtUnit(I, "A", 2)}`, "Bereiche: 0,1 A / 0,5 A / 1 A / 5 A"],
            formulaHint: "kleinster Bereich, der mindestens so groß ist wie der erwartete Strom",
            answer: best,
            unit: "A",
            digits: 1,
            tolerance: 0.001,
            solutionHtml: `Der kleinste Bereich ≥ ${fmt(I, 2)} A ist <strong>${fmtUnit(best, "A", 1)}</strong>. Bei Unsicherheit beginnst du mit dem größten.`,
          };
        }
        const ranges = [0.03, 0.3, 3, 10];
        const I = rng.pick([0.012, 0.2, 1.4, 2.2, 6]);
        const best = ranges.find((r) => r >= I) as number;
        return {
          prompt: `In einem Experiment fließen etwa ${fmtUnit(I, "A", 3)}. Das Gerät hat die Bereiche 30 mA, 300 mA, 3 A und 10 A. Welchen Bereich wählst du, damit der Zeiger möglichst weit, aber nicht über das Skalenende ausschlägt? Gib den Bereich in A an.`,
          given: [`erwartet: ${fmtUnit(I, "A", 3)}`, "Bereiche: 0,03 A / 0,3 A / 3 A / 10 A"],
          answer: best,
          unit: "A",
          digits: 2,
          tolerance: 0.001,
          solutionHtml: `${fmt(I, 3)} A passen in den Bereich <strong>${fmtUnit(best, "A", 2)}</strong> (der kleinste, der nicht überschritten wird).`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du schließt das Amperemeter richtig an, wählst den Messbereich und liest den Strom ab.",
};

// 5.9 Stromfluss in Flüssigkeiten und Gasen ────────────────────────────────

const ionen: Lesson = {
  id: "el-9-stromfluss-fluessigkeit-gas",
  stageId: STAGE_ID,
  stepNumber: 9,
  title: "5.9 Strom in Flüssigkeiten und Gasen",
  subtitle: "Ionen, Elektrolyse und Gasentladung",
  tracks: ["I"],
  lehrplan: "Ph8 LB 3 (I): elektrischer Stromfluss in Metallen, Flüssigkeiten und Gasen als gerichtete Bewegung geladener Teilchen im elektrischen Feld",
  whyItMatters:
    "Auch Salzwasser leitet den Strom, und in Blitz und Leuchtstoffröhre fließt er durch Luft und Gas. Überall bewegen sich geladene Teilchen im elektrischen Feld, aber nicht immer sind es Elektronen.",
  explanationHtml: `
    <p>Strom ist immer die gerichtete Bewegung geladener Teilchen im elektrischen Feld. Welche Teilchen das sind, hängt vom Stoff ab:</p>
    <ul>
      <li><strong>Metalle:</strong> frei bewegliche <strong>Elektronen</strong>.</li>
      <li><strong>Flüssigkeiten</strong> (Salzlösung, Säure, Lauge): Im Wasser zerfällt das Salz in <strong>Ionen</strong>, zum Beispiel Na⁺ und Cl⁻. Im elektrischen Feld wandern die <strong>positiven Ionen zum Minuspol</strong> und die <strong>negativen Ionen zum Pluspol</strong>. An den Elektroden werden Stoffe umgewandelt (<strong>Elektrolyse</strong>). Reines (destilliertes) Wasser hat kaum Ionen und isoliert.</li>
      <li><strong>Gase:</strong> Normale Luft ist ein Isolator, weil kaum geladene Teilchen vorhanden sind. Bei sehr starkem elektrischem Feld (hohe Spannung) werden Gasteilchen <strong>ionisiert</strong>: Es entstehen freie Elektronen und positive Ionen, die im Feld wandern. Diese <strong>Gasentladung</strong> leuchtet (Blitz, Leuchtstoffröhre, Neonlicht, Funke).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Strom ist bewegte Ladung: Elektronen in Metallen, Ionen in Flüssigkeiten, Elektronen und Ionen in ionisierten Gasen.</div>
  `,
  formulas: [
    { name: "Ladung", html: "Q = I · t", quantities: "gilt für jede Art von Ladungsträgern" },
    { name: "Zahl einfach geladener Ionen", html: "N = Q / e", quantities: "e = 1,6 · 10<sup>−19</sup> C" },
  ],
  quiz: {
    question: "Wie leitet eine Kochsalzlösung den elektrischen Strom?",
    options: [
      "Durch frei bewegliche Elektronen wie im Metall",
      "Durch wandernde positive und negative Ionen",
      "Gar nicht: Salzwasser ist ein Isolator",
    ],
    correctIndex: 1,
    explanation: "Im Wasser liegen Natrium- und Chlorid-Ionen frei vor. Im Feld wandern die positiven Na⁺-Ionen zum Minuspol und die negativen Cl⁻-Ionen zum Pluspol.",
  },
  lab: {
    kind: "ions-field",
    title: "Labor: Wer trägt den Strom?",
    intro: "Wähle Metall, Salzlösung oder Gas und verändere die Spannung. Die Teilchen bewegen sich im Feld zwischen Pluspol (links) und Minuspol (rechts).",
    params: [
      { type: "choice", key: "medium", label: "Stoff zwischen den Polen", options: [{ value: 0, label: "Metalldraht" }, { value: 1, label: "Salzlösung" }, { value: 2, label: "Gas in einer Röhre" }], value: 0 },
      { type: "range", key: "U", label: "Spannung (relativ)", unit: "%", min: 0, max: 100, step: 10, value: 50 },
    ],
    readouts: [
      { key: "carrier", label: "Ladungsträger", compute: (v) => (v.medium === 0 ? "Elektronen" : v.medium === 1 ? "positive und negative Ionen" : v.U >= 60 ? "Elektronen und positive Ionen" : "keine (nicht ionisiert)") },
      { key: "current", label: "Strom", emphasis: true, compute: (v) => (v.medium === 2 && v.U < 60 ? "kein Strom: Das Gas isoliert" : v.U === 0 ? "kein Strom: kein Feld" : "Strom fließt") },
    ],
    goals: [
      { id: "ionen", text: "Salzlösung mit Spannung: Positive Ionen wandern zum Minuspol, negative zum Pluspol.", check: (v) => v.medium === 1 && v.U >= 10 },
      { id: "gas-isoliert", text: "Gas bei niedriger Spannung (höchstens 50 %): Es bleibt ein Isolator.", check: (v, r) => v.medium === 2 && v.U <= 50 && String(r.current).startsWith("kein Strom") },
      { id: "gas-leuchtet", text: "Erhöhe die Spannung am Gas auf mindestens 70 %: Es wird ionisiert, leuchtet und leitet.", check: (v, r) => v.medium === 2 && v.U >= 70 && r.current === "Strom fließt" },
    ],
  },
  exercises: [
    {
      id: "elektrolyse",
      make: (rng, level) => {
        if (level === 1) {
          const I = rng.pick([0.2, 0.5, 1, 2]);
          const t = rng.pick([10, 20, 30, 60]);
          return {
            prompt: `Durch eine Salzlösung fließt ${fmtUnit(t, "s", 0)} lang ein Strom von ${fmtUnit(I, "A", 1)}. Wie viel Ladung wird insgesamt von den Ionen transportiert?`,
            given: [`I = ${fmtUnit(I, "A", 1)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "Q = I · t",
            answer: I * t,
            unit: "C",
            digits: 1,
            solutionHtml: `Q = I · t = ${fmt(I, 1)} A · ${fmt(t, 0)} s = <strong>${fmtUnit(I * t, "C", 1)}</strong>`,
          };
        }
        const I = rng.pick([0.2, 0.4, 0.5]);
        const t = rng.pick([10, 20, 40]);
        const Q = I * t;
        const N = Q / 2 / E_CHARGE / 1e18;
        return {
          prompt: `Durch eine Kochsalzlösung fließt ${fmtUnit(I, "A", 1)} für ${fmtUnit(t, "s", 0)}. Die Hälfte der Ladung transportieren einfach positive Na⁺-Ionen. Wie viele Na⁺-Ionen wandern dabei zum Minuspol? Gib die Zahl in Einheiten von 10¹⁸ an.`,
          given: [`I = ${fmtUnit(I, "A", 1)}`, `t = ${fmtUnit(t, "s", 0)}`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: N,
          unit: "· 10¹⁸",
          digits: 2,
          solutionHtml: `Q = I · t = ${fmt(Q, 1)} C, davon die Hälfte: ${fmt(Q / 2, 2)} C<br>N = Q / e = ${fmt(Q / 2, 2)} / (1,6 · 10⁻¹⁹) = <strong>${fmtUnit(N, "· 10¹⁸", 2)}</strong>`,
        };
      },
    },
    {
      id: "gasentladung",
      make: (rng, level) => {
        if (level === 1) {
          const kA = rng.pick([10, 20, 30]);
          const ms = rng.pick([0.1, 0.2, 0.3]);
          const Q = kA * 1000 * (ms / 1000);
          return {
            prompt: `Ein Blitz ist eine Gasentladung. Der Strom beträgt ${fmtUnit(kA, "kA", 0)} und fließt ${fmtUnit(ms, "ms", 1)}. Wie viel Ladung wird transportiert?`,
            given: [`I = ${fmtUnit(kA * 1000, "A", 0)}`, `t = ${fmt(ms / 1000, 4)} s`],
            formulaHint: "Q = I · t",
            answer: Q,
            unit: "C",
            digits: 1,
            solutionHtml: `Q = I · t = ${fmt(kA * 1000, 0)} A · ${fmt(ms / 1000, 4)} s = <strong>${fmtUnit(Q, "C", 1)}</strong>`,
          };
        }
        const I = rng.pick([0.25, 0.3, 0.35]);
        const h = rng.pick([4, 6, 8]);
        const Q = (I * h * 3600) / 1000;
        return {
          prompt: `Eine Leuchtstofflampe führt ${fmtUnit(I, "A", 2)} und brennt ${fmtUnit(h, "h", 0)} am Tag. Wie viele Kilocoulomb (kC) Ladung strömen durch das Gas der Röhre?`,
          given: [`I = ${fmtUnit(I, "A", 2)}`, `t = ${fmtUnit(h, "h", 0)} = ${fmtUnit(h * 3600, "s", 0)}`],
          answer: Q,
          unit: "kC",
          digits: 2,
          solutionHtml: `Q = I · t = ${fmt(I, 2)} A · ${fmt(h * 3600, 0)} s = ${fmt(I * h * 3600, 0)} C = <strong>${fmtUnit(Q, "kC", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du nennst die Ladungsträger in Metall, Salzlösung und Gas und erklärst die Gasentladung.",
};

// 5.10 Gefahren und Schutz ─────────────────────────────────────────────────

const CURRENTS = [0.5, 1, 10, 30, 50, 100, 200];
const DURATIONS = [0.1, 1, 10];

const gefahren: Lesson = {
  id: "el-10-gefahren-schutz",
  stageId: STAGE_ID,
  stepNumber: 10,
  title: "5.10 Wirkungen und Gefahren des Stroms, Schutzvorrichtungen",
  subtitle: "Warum nicht die Spannung, sondern der Strom durch den Körper gefährlich ist",
  tracks: ["I", "II_III"],
  lehrplan: "Ph8 LB 3 (I und II/III): Wirkungen des elektrischen Stroms und deren Gefahren (auch für den menschlichen Körper), Schutzvorrichtungen",
  whyItMatters:
    "Elektrischer Strom kann töten. Wer die Wirkungen kennt und weiß, wie Sicherung, Schutzleiter und FI-Schalter arbeiten, kann sich und andere schützen.",
  explanationHtml: `
    <p>Der Strom hat <strong>Wirkungen</strong>, an denen man ihn erkennt: <strong>Wärmewirkung</strong> (Heizdraht, Sicherung), <strong>Lichtwirkung</strong> (Lampe), <strong>magnetische Wirkung</strong> (Elektromagnet), <strong>chemische Wirkung</strong> (Elektrolyse, Akku laden) und die <strong>Wirkung auf Lebewesen</strong>.</p>
    <p><strong>Gefahren für den Körper:</strong> Entscheidend sind die Stärke des Stromes durch den Körper, die Dauer und der Weg (über das Herz ist es am gefährlichsten). Richtwerte (Wechselstrom, Netz):</p>
    <ul>
      <li>ab etwa 0,5 mA: gerade spürbar; bis etwa 10 mA: deutliches Kribbeln,</li>
      <li>ab etwa 10 bis 15 mA: Muskelkrampf, man kann nicht mehr loslassen,</li>
      <li>ab etwa 30 mA: bei längerer Dauer Atemlähmung,</li>
      <li>ab etwa 50 bis 100 mA: Herzkammerflimmern, <strong>lebensgefährlich</strong>.</li>
    </ul>
    <p><strong>Schutzvorrichtungen:</strong></p>
    <ul>
      <li><strong>Sicherung / Leitungsschutzschalter</strong> (zum Beispiel 16 A): unterbricht bei Überlast oder Kurzschluss, damit sich Leitungen nicht gefährlich erhitzen.</li>
      <li><strong>Schutzleiter (Schutzkontakt):</strong> verbindet das Metallgehäuse mit der Erde. Bei einem Defekt fließt der Strom über den Schutzleiter ab, die Sicherung löst aus.</li>
      <li><strong>Schutzisolierung:</strong> Gehäuse aus Kunststoff (Doppelquadrat-Zeichen), kein Schutzleiter nötig.</li>
      <li><strong>FI-Schutzschalter (Fehlerstrom-Schutzschalter):</strong> vergleicht den Strom im Hin- und Rückleiter. Weicht er um mehr als etwa 30 mA ab (Strom fließt durch einen Körper oder die Erde), schaltet er in weniger als 0,03 s ab.</li>
    </ul>
    <p><strong>Verhalten:</strong> Nasse Hände und Wasser meiden, defekte Kabel nicht benutzen, nach einem Unfall zuerst den Strom abschalten (Sicherung, Stecker), dann Hilfe rufen (112).</p>
    <div class="merke"><strong>Merke:</strong> Gefährlich ist der Strom durch den Körper: Ab etwa 30 mA wird es ernst. Der FI-Schalter schaltet bei etwa 30 mA Fehlerstrom blitzschnell ab.</div>
  `,
  formulas: [
    { name: "Fehlerstrom", html: "I<sub>F</sub> = I<sub>hin</sub> − I<sub>rück</sub>", quantities: "FI schaltet ab, wenn I_F ≥ 30 mA" },
    { name: "Ladung durch den Körper", html: "Q = I · t", quantities: "z. B. 50 mA · 2 s = 100 mC" },
  ],
  quiz: {
    question: "Wann schaltet ein FI-Schutzschalter (30 mA) ab?",
    options: [
      "Wenn der Strom im Hin- und im Rückleiter um etwa 30 mA verschieden ist",
      "Erst bei 16 A Überlast",
      "Nie, er schützt nur vor Blitzen",
    ],
    correctIndex: 0,
    explanation: "Fließt ein Teil des Stroms nicht im Rückleiter zurück, sondern über einen Körper zur Erde, entsteht ein Unterschied. Der FI schaltet dann innerhalb von Millisekunden ab.",
  },
  lab: {
    kind: "body-current",
    title: "Labor: Strom durch den Körper",
    intro: "Wähle die Stärke des Körperstroms, die Dauer und ob ein FI-Schutzschalter (30 mA) eingebaut ist. Beobachte die Wirkung.",
    params: [
      { type: "choice", key: "I", label: "Körperstrom", options: CURRENTS.map((c) => ({ value: c, label: `${fmt(c, 1)} mA` })), value: 0.5 },
      { type: "choice", key: "t", label: "Dauer", options: DURATIONS.map((d) => ({ value: d, label: `${fmt(d, 1)} s` })), value: 1 },
      { type: "choice", key: "fi", label: "FI-Schutzschalter (30 mA)", options: [{ value: 0, label: "nicht vorhanden" }, { value: 1, label: "eingebaut" }], value: 0 },
    ],
    readouts: [
      { key: "effect", label: "Wirkung", emphasis: true, compute: (v) => bodyCurrentEffect(v.I, v.t, v.fi).effect },
      { key: "teff", label: "Tatsächliche Einwirkdauer", unit: "s", digits: 2, compute: (v) => bodyCurrentEffect(v.I, v.t, v.fi).effectiveTime },
    ],
    goals: [
      { id: "fi-rettet", text: "Mit FI-Schalter und 100 mA schaltet er sofort ab: nur ein kurzer Schlag.", check: (v, r) => v.fi === 1 && v.I === 100 && String(r.effect).startsWith("kurzer Schlag") },
      { id: "ohne-fi", text: "Ohne FI-Schalter sind 100 mA über 1 s oder länger lebensgefährlich.", check: (v, r) => v.fi === 0 && v.I === 100 && v.t >= 1 && String(r.effect).startsWith("lebensgefährlich") },
      { id: "harmlos", text: "Stelle 1 mA ein: Das ist gerade spürbar und noch ungefährlich.", check: (v) => v.I === 1 },
    ],
  },
  exercises: [
    {
      id: "fehlerstrom",
      make: (rng, level) => {
        if (level === 1) {
          const hin = rng.int(2000, 8000) / 1000;
          const faultMa = rng.pick([10, 20, 30, 45, 60, 100]);
          const rueck = hin - faultMa / 1000;
          return {
            prompt: `Ein FI-Schutzschalter misst im Hinleiter ${fmtUnit(hin, "A", 3)} und im Rückleiter ${fmtUnit(rueck, "A", 3)}. Wie groß ist der Fehlerstrom in Milliampere?`,
            given: [`I(hin) = ${fmtUnit(hin, "A", 3)}`, `I(rück) = ${fmtUnit(rueck, "A", 3)}`],
            formulaHint: "I_F = I_hin − I_rück (in mA umrechnen: 1 A = 1000 mA)",
            answer: faultMa,
            unit: "mA",
            digits: 0,
            solutionHtml: `I<sub>F</sub> = ${fmt(hin, 3)} A − ${fmt(rueck, 3)} A = ${fmt(hin - rueck, 3)} A = <strong>${fmtUnit(faultMa, "mA", 0)}</strong>${faultMa >= 30 ? ". Der FI schaltet ab (mindestens 30 mA)." : ". Das ist unter 30 mA: Der FI schaltet nicht ab."}`,
          };
        }
        const faultMa = rng.pick([40, 45, 60, 80]);
        const over = faultMa - 30;
        return {
          prompt: `Durch einen Defekt fließen ${fmtUnit(faultMa, "mA", 0)} Fehlerstrom über das Gehäuse zur Erde. Der FI-Schutzschalter löst bei 30 mA aus. Um wie viele Milliampere liegt der Fehlerstrom über dem Auslösewert?`,
          given: [`Fehlerstrom ${fmtUnit(faultMa, "mA", 0)}`, "Auslösewert 30 mA"],
          answer: over,
          unit: "mA",
          digits: 0,
          solutionHtml: `${fmt(faultMa, 0)} mA − 30 mA = <strong>${fmtUnit(over, "mA", 0)}</strong>. Der FI schaltet ab.`,
        };
      },
    },
    {
      id: "koerperstrom-ladung",
      make: (rng, level) => {
        if (level === 1) {
          const I = rng.pick([30, 50, 80, 100]);
          const t = rng.pick([1, 2, 5]);
          return {
            prompt: `Ein Strom von ${fmtUnit(I, "mA", 0)} fließt ${fmtUnit(t, "s", 0)} lang durch einen Körper. Welche Ladung fließt in Millicoulomb?`,
            given: [`I = ${fmtUnit(I, "mA", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "Q = I · t (mA · s gibt mC)",
            answer: I * t,
            unit: "mC",
            digits: 0,
            solutionHtml: `Q = I · t = ${fmt(I, 0)} mA · ${fmt(t, 0)} s = <strong>${fmtUnit(I * t, "mC", 0)}</strong>`,
          };
        }
        const I = rng.pick([30, 50]);
        const t = rng.pick([0.03, 0.02]);
        const N = ((I / 1000) * t) / E_CHARGE / 1e15;
        return {
          prompt: `Der FI-Schalter beendet einen Strom von ${fmtUnit(I, "mA", 0)} nach ${fmtUnit(t, "s", 2)}. Wie viele Elektronen sind in dieser Zeit durch den Körper geflossen? Gib die Zahl in Einheiten von 10¹⁵ an.`,
          given: [`I = ${fmtUnit(I, "mA", 0)} = ${fmt(I / 1000, 3)} A`, `t = ${fmtUnit(t, "s", 2)}`, "e = 1,6 · 10⁻¹⁹ C"],
          answer: N,
          unit: "· 10¹⁵",
          digits: 2,
          solutionHtml: `Q = I · t = ${fmt(I / 1000, 3)} A · ${fmt(t, 2)} s = ${fmt((I / 1000) * t, 6)} C<br>N = Q / e = <strong>${fmtUnit(N, "· 10¹⁵", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst die Gefahren des Stroms für den Körper und erklärst Sicherung, Schutzleiter und FI-Schalter.",
};

export const STAGE_ELEKTRIZITAET: Stage = {
  id: STAGE_ID,
  stageNumber: 5,
  title: "Magnetismus und Elektrizitätslehre",
  subtitle: "Magnete, Ladungen, elektrischer Strom und Sicherheit",
  icon: "⚡",
  accent: "#7c3aed",
  badgeTitle: "Strom-Experte",
  lehrplanLabel: "Ph8 LB 3 (II/III: Magnetismus und Elektrizitätslehre, I: Elektrizitätslehre)",
  lessons: [magnete, magnetfeld, ladung, feld, anwendung, strom, stromkreis, amperemeter, ionen, gefahren],
};
