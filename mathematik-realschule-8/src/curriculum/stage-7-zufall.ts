import { fmt } from "../exercises/format";
import { createRng } from "../exercises/rng";
import type { LabValues } from "../model/types";
import {
  choice,
  choiceField,
  defineLesson,
  numberField,
  range,
  stage,
  task,
  yesNo,
} from "./helpers";

export const COIN_OUTCOMES = ["KK", "KZ", "ZK", "ZZ"];
export const COIN_EVENTS = [[1, 2], [0, 1, 2], [3]];
export const hitFor = (die: number, event: number): boolean =>
  event === 0 ? die === 6 : event === 1 ? die % 2 === 0 : die >= 5;
export function simulate(v: LabValues, count: number): LabValues {
  const next = { ...v },
    rng = createRng(v.seed);
  for (let i = 0; i < count; i++) {
    const draw = rng.int(1, v.model === 0 ? 6 : 7),
      die = draw === 7 ? 6 : draw;
    next.throws++;
    next.last = die;
    if (hitFor(die, v.event)) next.hits++;
  }
  next.seed = rng.state();
  return next;
}

const outcomes = defineLesson("dz-1-ergebnis-ereignis", {
  subtitle: "Ein Ergebnis ist ein möglicher Ausgang; ein Ereignis eine Menge davon",
  whyItMatters: "Bevor du Häufigkeiten zählst, musst du genau sagen, was gezählt wird.",
  explanationHtml: `<p>Beim zweimaligen Münzwurf mit K = Kopf und Z = Zahl ist Ω = {KK, KZ, ZK, ZZ}. Die Reihenfolge gehört zum Ergebnis: KZ und ZK sind verschiedene Ausgänge.</p><p>Ein <strong>Ereignis</strong> ist eine Teilmenge von Ω. „Genau einmal Kopf“ ist E = {KZ, ZK}; „mindestens einmal Kopf“ ist {KK, KZ, ZK}. Ein einzelnes Ergebnis kann zu mehreren Ereignissen gehören.</p><p>Beschreibe das Experiment so genau, dass die Ergebnismenge klar ist. Beim einmaligen Würfeln ist Ω = {1, 2, 3, 4, 5, 6}; „gerade Augenzahl“ enthält 2, 4 und 6.</p>`,
  formulas: [
    {
      name: "Ereignis",
      html: "E ⊆ Ω",
      quantities: "Ω: alle möglichen Ergebnisse; E: die passenden Ergebnisse",
    },
  ],
  quiz: {
    question: "Welches Ereignis heißt beim zweimaligen Münzwurf genau einmal Kopf?",
    options: ["{KK}", "{KZ, ZK}", "{KK, KZ, ZK}"],
    correctIndex: 1,
    explanation: "In KZ und ZK steht jeweils genau ein K; in KK stehen zwei.",
  },
  lab: {
    kind: "outcomes",
    title: "Gehört der Ausgang zum Ereignis?",
    intro: "Wähle einen Ausgang und ein Ereignis. Beide Münzwürfe bleiben geordnet.",
    params: [
      choice("event", "Ereignis", ["genau einmal Kopf", "mindestens einmal Kopf", "zweimal Zahl"]),
      choice("result", "Ergebnis", COIN_OUTCOMES),
    ],
    readouts: [
      {
        key: "event",
        label: "E",
        compute: (v) => `{${COIN_EVENTS[v.event].map((i) => COIN_OUTCOMES[i]).join(", ")}}`,
      },
      {
        key: "contains",
        label: "Gewähltes Ergebnis gehört zu E?",
        compute: (v) => (COIN_EVENTS[v.event].includes(v.result) ? "ja" : "nein"),
      },
    ],
    goals: [
      {
        id: "reihenfolge",
        text: "Zeige, dass ZK zum Ereignis genau einmal Kopf gehört.",
        check: (v) => v.event === 0 && v.result === 2,
      },
      {
        id: "mindestens",
        text: "Zeige, dass KK zu mindestens einmal Kopf gehört.",
        check: (v) => v.event === 1 && v.result === 0,
      },
    ],
  },
  exercises: [
    {
      id: "ereignisse",
      make: (rng, level) => {
        const event = rng.int(0, 2),
          result = rng.int(0, 3),
          names = ["genau einmal Kopf", "mindestens einmal Kopf", "zweimal Zahl"];
        if (level === 1)
          return task(
            `Zwei Münzwürfe: Ereignis E = „${names[event]}“. Prüfe den Ausgang ${COIN_OUTCOMES[result]}. Wie viele Ergebnisse enthält E?`,
            [
              yesNo("Ergebnis gehört zu E?", COIN_EVENTS[event].includes(result)),
              numberField("Anzahl Ergebnisse in E:", COIN_EVENTS[event].length, "", 0),
            ],
            [
              `E = {${COIN_EVENTS[event].map((i) => COIN_OUTCOMES[i]).join(", ")}}.`,
              `<strong>${COIN_EVENTS[event].includes(result) ? "Gehört dazu" : "Gehört nicht dazu"}; ${COIN_EVENTS[event].length} Ergebnisse.</strong>`,
            ],
            "E enthält alle Ausgänge, die die Bedingung erfüllen.",
            { event, result },
          );
        const threshold = rng.int(2, 6);
        return task(
          `Ein gewöhnlicher Würfel wird einmal geworfen. E bedeutet „Augenzahl mindestens ${threshold}“. Wie viele Ergebnisse hat Ω, wie viele E? Ist „die Zahl ${threshold}“ ein einzelnes Ergebnis oder das ganze Ereignis E?`,
          [
            numberField("Anzahl in Ω:", 6, "", 0),
            numberField("Anzahl in E:", 7 - threshold, "", 0),
            choiceField(
              `Die Zahl ${threshold} bezeichnet`,
              ["ein einzelnes Ergebnis", "immer das ganze Ereignis E"],
              0,
            ),
          ],
          [
            `Ω = {1, 2, 3, 4, 5, 6}; E enthält ${threshold} bis 6.`,
            `<strong>E hat ${7 - threshold} Ergebnisse.</strong> Ein einzelner Ausgang und eine Menge von Ausgängen sind zu unterscheiden; bei E = {6} enthält das Ereignis genau ein Ergebnis.`,
          ],
          undefined,
          { threshold },
        );
      },
    },
  ],
});

const treeTable = defineLesson("dz-2-baum-tafel", {
  subtitle: "Vier geordnete Ausgänge übersichtlich darstellen",
  whyItMatters:
    "Baumdiagramm und Vierfeldertafel ordnen dieselben Daten auf zwei verschiedene Arten.",
  explanationHtml: `<p>Beim zweimaligen Münzwurf hat das Baumdiagramm nach dem ersten Wurf die Äste K und Z. Von jedem gehen wieder K und Z ab. Jeder vollständige Pfad ist genau ein Ergebnis.</p><p>In der Vierfeldertafel beschriften die Zeilen den ersten und die Spalten den zweiten Wurf. Jede Zelle gehört zu einem Pfad. Die Randzahlen sind Summen: „erster Wurf K“ zählt KK und KZ; „zweiter Wurf K“ zählt KK und ZK.</p><p>Die Tafel im Labor enthält beobachtete <strong>Anzahlen</strong>, keine automatisch gleichen Wahrscheinlichkeiten. Auch bei einer fairen Münze müssen die vier Zellen nach wenigen Versuchen nicht gleich groß sein.</p>`,
  formulas: [
    {
      name: "Gesamtzahl",
      html: "n = n<sub>KK</sub> + n<sub>KZ</sub> + n<sub>ZK</sub> + n<sub>ZZ</sub>",
      quantities: "Ein vollständiger Durchlauf umfasst hier zwei Würfe.",
    },
  ],
  quiz: {
    question: "Welche zwei Zellen gehören zum Ereignis erster Wurf Kopf?",
    options: ["KK und ZK", "KK und KZ", "KZ und ZZ"],
    correctIndex: 1,
    explanation: "Das erste Zeichen muss K sein; das zweite darf K oder Z sein.",
  },
  lab: {
    kind: "tree-table",
    title: "Vom Pfad in die Zelle",
    intro: "Trage Anzahlen für die vier Ergebnisse ein. Beobachte die Zeilen- und Spaltensummen.",
    params: [
      range("kk", "Anzahl KK", 0, 20, 1),
      range("kz", "Anzahl KZ", 0, 20, 1),
      range("zk", "Anzahl ZK", 0, 20, 1),
      range("zz", "Anzahl ZZ", 0, 20, 1),
    ],
    readouts: [
      { key: "total", label: "Durchläufe insgesamt", compute: (v) => v.kk + v.kz + v.zk + v.zz },
      { key: "firstK", label: "erster Wurf K", compute: (v) => v.kk + v.kz },
      { key: "secondK", label: "zweiter Wurf K", compute: (v) => v.kk + v.zk },
    ],
    goals: [
      {
        id: "zeile",
        text: "Trage KK = 4, KZ = 3, ZK = 2, ZZ = 1 ein. Erster Wurf K kommt siebenmal vor.",
        check: (v) => v.kk === 4 && v.kz === 3 && v.zk === 2 && v.zz === 1,
      },
      {
        id: "spalte",
        text: "Trage KK = 2, KZ = 6, ZK = 1, ZZ = 1 ein. Zweiter Wurf K kommt dreimal vor.",
        check: (v) => v.kk === 2 && v.kz === 6 && v.zk === 1 && v.zz === 1,
      },
    ],
  },
  exercises: [
    {
      id: "vierfeldertafel",
      make: (rng, level) => {
        const kk = rng.int(1, 20),
          kz = rng.int(1, 20),
          zk = rng.int(1, 20),
          zz = rng.int(1, 20),
          total = kk + kz + zk + zz;
        if (level === 1)
          return task(
            `Eine Strichliste zweier Münzwürfe enthält KK: ${kk}, KZ: ${kz}, ZK: ${zk}, ZZ: ${zz}. Berechne die Randzahlen.`,
            [
              numberField("insgesamt:", total, "", 0),
              numberField("erster Wurf K:", kk + kz, "", 0),
              numberField("zweiter Wurf K:", kk + zk, "", 0),
            ],
            [
              `Erster K: KK + KZ; zweiter K: KK + ZK.`,
              `<strong>Insgesamt ${total}; erster K ${kk + kz}; zweiter K ${kk + zk}.</strong>`,
            ],
            "Zeilen und Spalten addieren.",
            { kk, kz, zk, zz },
          );
        return task(
          `Von ${total} Durchläufen hatten ${kk + kz} im ersten Wurf Kopf. Davon endeten ${kk} mit KK. Außerdem gab es ${zk} Ausgänge ZK. Ergänze die fehlenden Anzahlen KZ und ZZ und die Randzahl „zweiter Wurf Kopf“.`,
          [
            numberField("KZ:", kz, "", 0),
            numberField("ZZ:", zz, "", 0),
            numberField("zweiter Wurf K:", kk + zk, "", 0),
          ],
          [
            `KZ = ${kk + kz} − ${kk} = ${kz}.`,
            `ZZ = ${total} − ${kk} − ${kz} − ${zk} = ${zz}.`,
            `<strong>KZ ${kz}, ZZ ${zz}, zweiter K ${kk + zk}.</strong>`,
          ],
          undefined,
          { kk, kz, zk, zz },
        );
      },
    },
  ],
});

const frequencies = defineLesson("dz-3-haeufigkeiten", {
  subtitle: "Anzahl zählen, Anteil berechnen, Schwankungen einordnen",
  whyItMatters:
    "Große Anzahlen und große Anteile sind verschieden. Nur mit dem Bezugswert kannst du Versuche vergleichen.",
  explanationHtml: `<p>Die absolute Häufigkeit H(E) zählt, wie oft ein Ereignis auftrat. Die relative Häufigkeit h(E) ist der Anteil H(E)/n, sofern n &gt; 0. Als Prozentwert multiplizierst du mit 100.</p><div class="example">18 Sechsen in 120 Würfen: h = 18/120 = 0,15 = 15 %. 18 ist die absolute Häufigkeit, 15 % die relative.</div><p>Relative Häufigkeiten schwanken. Mehr Versuche erzwingen weder genau gleiche Anzahlen noch eine streng monotone Annäherung. Ein beobachteter Anteil ist eine Schätzung im gewählten Modell und keine Garantie für den nächsten Wurf.</p><p>Das Labor simuliert entweder sechs gleich vertretene Ergebnisse oder sieben gleich vertretene Lose, von denen zwei eine Sechs anzeigen. Es zieht mit Zurücklegen. Ändern des Modells oder Ereignisses startet die Zählung neu, damit keine unterschiedlichen Experimente vermischt werden.</p><div class="merke">Würfle selbst 30-mal, notiere die Sechsen und berechne deinen Anteil. Vergleiche eure Ergebnisse in der Klasse und beschreibe die Unterschiede. Eine Simulation ersetzt diese eigene Erhebung nicht.</div>`,
  formulas: [
    {
      name: "Relative Häufigkeit",
      html: "h(E) = H(E)/n",
      quantities: "n > 0; Prozentwert = 100 · h(E)",
    },
  ],
  quiz: {
    question:
      "Ein Ereignis tritt 12-mal in 80 Versuchen auf. Wie groß ist die relative Häufigkeit?",
    options: ["12 %", "15 %", "80 %"],
    correctIndex: 1,
    explanation: "12/80 = 0,15 = 15 %.",
  },
  lab: {
    kind: "frequencies",
    title: "Würfelversuche sammeln",
    intro:
      "Starte kleine oder große Serien und beobachte den Anteil. Der verzerrte Modus hat zwei Sechserlose unter sieben Losen.",
    params: [
      choice("model", "Modell", ["fairer Würfel", "Sechs doppelt im Lostopf"]),
      choice("event", "Ereignis", ["Sechs", "gerade Augenzahl", "mindestens fünf"]),
      { type: "state", key: "throws", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "last", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: 20261022, resetOnChange: true },
    ],
    readouts: [
      { key: "throws", label: "Versuche n", compute: (v) => v.throws },
      { key: "hits", label: "Absolute Häufigkeit H", compute: (v) => v.hits },
      {
        key: "relative",
        label: "Relative Häufigkeit",
        compute: (v) =>
          v.throws ? `${fmt((100 * v.hits) / v.throws, 2)} %` : "noch keine Versuche",
      },
      { key: "last", label: "Letzter Wurf", compute: (v) => v.last || "noch keiner" },
    ],
    actions: [
      { id: "ten", label: "+10 Versuche", apply: (v) => simulate(v, 10) },
      { id: "hundred", label: "+100 Versuche", apply: (v) => simulate(v, 100) },
      {
        id: "reset",
        label: "Serie neu beginnen",
        apply: (v) => ({ ...v, throws: 0, hits: 0, last: 0, seed: 20261022 }),
      },
    ],
    goals: [
      {
        id: "fair",
        text: "Sammle mindestens 100 Versuche zum Ereignis Sechs beim fairen Würfel.",
        check: (v) => v.model === 0 && v.event === 0 && v.throws >= 100,
      },
      {
        id: "verzerrt",
        text: "Sammle mindestens 1000 Versuche zum Ereignis Sechs im verzerrten Modell und vergleiche den Anteil.",
        check: (v) => v.model === 1 && v.event === 0 && v.throws >= 1000,
      },
    ],
  },
  exercises: [
    {
      id: "haeufigkeit",
      make: (rng, level) => {
        const n = 20 * rng.int(2, 15),
          h = rng.int(0, n),
          percent = (100 * h) / n;
        if (level === 1)
          return task(
            `In ${n} Versuchen trat E genau ${h}-mal auf. Gib die absolute und die relative Häufigkeit in Prozent an.`,
            [numberField("H(E) =", h, "", 0), numberField("h(E) =", percent, "%", 2)],
            [
              `Absolute Häufigkeit H = ${h}; relative Häufigkeit = ${h}/${n}.`,
              `<strong>${fmt(percent, 2)} %.</strong>`,
            ],
            "h = H/n; Prozentwert = 100h",
            { n, h },
          );
        const totalA = rng.pick([50, 100, 200]),
          rateA = rng.pick([0.1, 0.2, 0.3]),
          totalB = 2 * totalA,
          hitsA = totalA * rateA,
          hitsB = hitsA + rng.int(1, Math.max(1, hitsA - 1));
        return task(
          `Team A beobachtet ${hitsA} Treffer in ${totalA} Versuchen, Team B ${hitsB} in ${totalB}. Welches Team hat mehr Treffer, welches den größeren Trefferanteil? Berechne beide Prozentwerte.`,
          [
            choiceField("Mehr Treffer", ["Team A", "Team B"], 1),
            choiceField("Größerer Anteil", ["Team A", "Team B"], 0),
            numberField("Team A:", (100 * hitsA) / totalA, "%", 2),
            numberField("Team B:", (100 * hitsB) / totalB, "%", 2),
          ],
          [
            `B hat mehr Treffer, aber auch doppelt so viele Versuche.`,
            `<strong>A: ${fmt((100 * hitsA) / totalA, 2)} %; B: ${fmt((100 * hitsB) / totalB, 2)} %.</strong> A hat den größeren Anteil. Das ist keine Garantie für den nächsten Versuch.`,
          ],
          undefined,
          { totalA, totalB, hitsA, hitsB },
        );
      },
    },
  ],
});

export const STAGE_ZUFALL = stage("daten-zufall", [outcomes, treeTable, frequencies]);
