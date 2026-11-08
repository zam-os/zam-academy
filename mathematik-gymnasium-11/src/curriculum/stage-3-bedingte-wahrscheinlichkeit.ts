import { fmt, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { rel } from "../lab/shared";
import { betterInBoth, diagnose, fieldsOf, independent, overallRate, pAgivenB, prob } from "../lab/views-wahrscheinlichkeit";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-3-bedingte-wahrscheinlichkeit";
const LEHRPLAN = "M11 LB 3: Bedingte Wahrscheinlichkeit und stochastische Unabhängigkeit";

/** "P<sub>B</sub>(A)" in HTML. */
function P(condition: string, event: string): string {
  return `P<sub>${condition}</sub>(${event})`;
}

/** A Vierfeldertafel of counts as HTML lines. */
function tableLines(rowA: string, colB: string, n: [number, number, number, number]): string[] {
  const [ab, anb, nab, nanb] = n;
  return [
    `${rowA} und ${colB}: ${ab}`,
    `${rowA}, nicht ${colB}: ${anb}`,
    `nicht ${rowA}, ${colB}: ${nab}`,
    `weder noch: ${nanb}`,
  ];
}

const CONTEXTS = [
  { total: "Schülerinnen und Schüler", A: "trägt eine Brille", B: "kommt mit dem Bus" },
  { total: "Befragte", A: "treibt regelmäßig Sport", B: "ist jünger als 30 Jahre" },
  { total: "Bauteile", A: "stammt von Maschine 1", B: "ist fehlerhaft" },
  { total: "Haushalte", A: "hat ein E-Auto", B: "hat eine Solaranlage" },
];

// 3.1 Bedingte Wahrscheinlichkeit ────────────────────────────────────────────

function vierfeldertafel(rng: Rng, level: 1 | 2): ExerciseTask {
  const ctx = rng.pick(CONTEXTS);
  const ab = rng.int(2, 9) * 10;
  const anb = rng.int(2, 12) * 10;
  const nab = rng.int(2, 12) * 10;
  const nanb = rng.int(5, 20) * 10;
  const total = ab + anb + nab + nanb;
  const b = ab + nab;
  const a = ab + anb;
  if (level === 1) {
    return {
      prompt: `Von ${total} ${ctx.total} gilt: Die Vierfeldertafel zählt, wer „${ctx.A}“ (A) und wer „${ctx.B}“ (B). Bestimme ${P("B", "A")} und ${P("A", "B")}.`,
      given: tableLines("A", "B", [ab, anb, nab, nanb]),
      formulaHint: `${P("B", "A")} = |A ∩ B| : |B|; ${P("A", "B")} = |A ∩ B| : |A|`,
      fields: [
        numberField(`${P("B", "A")} ≈`, ab / b, "", 3, { slips: [{ value: ab / total, hint: "Das ist P(A ∩ B). Bei P_B(A) zählen nur die Fälle in B." }] }),
        numberField(`${P("A", "B")} ≈`, ab / a, "", 3, { slips: [{ value: ab / b, hint: "Das ist P_B(A). Bei P_A(B) ist A die Bedingung: teile durch |A|." }] }),
      ],
      steps: [
        `|B| = ${ab} + ${nab} = ${b}, |A| = ${ab} + ${anb} = ${a}`,
        `${P("B", "A")} = ${ab} : ${b} ${rel(ab / b, 3)} ${fmt(ab / b, 3)}; ${P("A", "B")} = ${ab} : ${a} ${rel(ab / a, 3)} ${fmt(ab / a, 3)}`,
        `<strong>${P("B", "A")} ${rel(ab / b, 3)} ${fmt(ab / b, 3)}; ${P("A", "B")} ${rel(ab / a, 3)} ${fmt(ab / a, 3)}</strong>`,
      ],
    };
  }
  return {
    prompt: `In einer Erhebung mit ${total} ${ctx.total} gilt für ${a} „${ctx.A}“ (A) und für ${b} „${ctx.B}“ (B); auf ${ab} trifft beides zu. Ergänze die Vierfeldertafel im Kopf oder auf Papier und bestimme den Anteil von A unter denen, die nicht B sind, sowie ${P("A", "B")}.`,
    given: [`Gesamt ${total}`, `|A| = ${a}`, `|B| = ${b}`, `|A ∩ B| = ${ab}`],
    fields: [
      numberField(`${P("B̄", "A")} ≈`, anb / (anb + nanb), "", 3, { slips: [{ value: anb / total, hint: "Das ist P(A ∩ B̄). Die Bedingung B̄ verlangt: teile durch |B̄| = Gesamt − |B|." }] }),
      numberField(`${P("A", "B")} ≈`, ab / a, "", 3),
    ],
    steps: [
      `|A ∩ B̄| = ${a} − ${ab} = ${anb}; |B̄| = ${total} − ${b} = ${anb + nanb}`,
      `${P("B̄", "A")} = ${anb} : ${anb + nanb} ${rel(anb / (anb + nanb), 3)} ${fmt(anb / (anb + nanb), 3)}`,
      `${P("A", "B")} = ${ab} : ${a} ${rel(ab / a, 3)} ${fmt(ab / a, 3)}`,
      `<strong>${P("B̄", "A")} ≈ ${fmt(anb / (anb + nanb), 3)}; ${P("A", "B")} ≈ ${fmt(ab / a, 3)}</strong>`,
    ],
  };
}

function baumdiagramm(rng: Rng, level: 1 | 2): ExerciseTask {
  const pA = rng.pick([0.2, 0.25, 0.3, 0.4, 0.6, 0.75]);
  const pBA = rng.pick([0.1, 0.2, 0.5, 0.6, 0.8, 0.9]);
  const pBnA = rng.pick([0.05, 0.1, 0.3, 0.4, 0.7]);
  const ab = pA * pBA;
  const b = ab + (1 - pA) * pBnA;
  if (level === 1) {
    return {
      prompt: `Im Baumdiagramm gilt P(A) = ${fmt(pA)}, ${P("A", "B")} = ${fmt(pBA)} und ${P("Ā", "B")} = ${fmt(pBnA)}. Berechne P(A ∩ B) und P(B).`,
      given: [`P(A) = ${fmt(pA)}`, `${P("A", "B")} = ${fmt(pBA)}`, `${P("Ā", "B")} = ${fmt(pBnA)}`],
      formulaHint: `Pfadregel: P(A ∩ B) = P(A) · ${P("A", "B")}; Summenregel: P(B) = P(A ∩ B) + P(Ā ∩ B)`,
      fields: [numberField("P(A ∩ B) =", ab, "", 4), numberField("P(B) =", b, "", 4, { slips: [{ value: pBA + pBnA, hint: "Die bedingten Wahrscheinlichkeiten dürfen nicht einfach addiert werden: gewichte sie mit P(A) und P(Ā)." }] })],
      steps: [`P(A ∩ B) = ${fmt(pA)} · ${fmt(pBA)} = ${fmt(ab, 4)}`, `P(Ā ∩ B) = ${fmt(1 - pA)} · ${fmt(pBnA)} = ${fmt((1 - pA) * pBnA, 4)}`, `<strong>P(A ∩ B) = ${fmt(ab, 4)}; P(B) = ${fmt(b, 4)}</strong>`],
    };
  }
  return {
    prompt: `Von zwei Ereignissen ist bekannt: P(A) = ${fmt(pA)}, P(B) = ${fmt(b, 4)} und P(A ∩ B) = ${fmt(ab, 4)}. Bestimme die beiden bedingten Wahrscheinlichkeiten ${P("A", "B")} und ${P("B", "A")}. Zeichne dazu einen Baum mit der Bedingung zuerst.`,
    given: [`P(A) = ${fmt(pA)}`, `P(B) = ${fmt(b, 4)}`, `P(A ∩ B) = ${fmt(ab, 4)}`],
    fields: [numberField(`${P("A", "B")} =`, pBA, "", 3), numberField(`${P("B", "A")} ≈`, ab / b, "", 3, { slips: [{ value: pBA, hint: "P_B(A) und P_A(B) sind verschieden: Bei P_B(A) teilst du durch P(B)." }] })],
    steps: [`${P("A", "B")} = P(A ∩ B) : P(A) = ${fmt(ab, 4)} : ${fmt(pA)} = ${fmt(pBA)}`, `${P("B", "A")} = P(A ∩ B) : P(B) = ${fmt(ab, 4)} : ${fmt(b, 4)} ${rel(ab / b, 3)} ${fmt(ab / b, 3)}`, `<strong>${P("A", "B")} = ${fmt(pBA)}; ${P("B", "A")} ≈ ${fmt(ab / b, 3)}</strong>`],
  };
}

const AREA_PARAMS = [
  { type: "range" as const, key: "pA", label: "P(A)", unit: "", min: 0.05, max: 0.95, step: 0.05, value: 0.5, digits: 2 },
  { type: "range" as const, key: "pBA", label: "P_A(B)", unit: "", min: 0, max: 1, step: 0.05, value: 0.7, digits: 2 },
  { type: "range" as const, key: "pBnA", label: "P_Ā(B)", unit: "", min: 0, max: 1, step: 0.05, value: 0.3, digits: 2 },
];

const bedingt: Lesson = {
  id: "bw-1-bedingte-wahrscheinlichkeit",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Bedingte Wahrscheinlichkeit",
  subtitle: "Baumdiagramm, Vierfeldertafel und Einheitsquadrat",
  lehrplan: `${LEHRPLAN}, bedingte Wahrscheinlichkeiten mit Baumdiagrammen und Vierfeldertafeln`,
  whyItMatters:
    "Viele Aussagen gelten nur für eine Teilgruppe: „70 % der Busfahrer tragen eine Brille“ ist etwas anderes als „70 % der Brillenträger fahren Bus“. Bedingte Wahrscheinlichkeiten machen diesen Unterschied rechenbar.",
  explanationHtml: `
    <p>Weiß man schon, dass ein Ereignis B eingetreten ist, betrachtet man nur noch die Ergebnisse in B. Die Wahrscheinlichkeit von A <strong>unter der Bedingung B</strong> ist</p>
    <p class="formula-line">P<sub>B</sub>(A) = P(A ∩ B) : P(B) (mit P(B) &gt; 0)</p>
    <p>In der <strong>Vierfeldertafel</strong> teilst du den Eintrag im Feld A ∩ B durch die Summe der Spalte B. Mit absoluten Häufigkeiten gilt ebenso P<sub>B</sub>(A) = |A ∩ B| : |B|.</p>
    <p>Im <strong>Baumdiagramm</strong> stehen bedingte Wahrscheinlichkeiten auf den Ästen der zweiten Stufe (Wiederholung der Pfadregeln aus M10): P(A ∩ B) = P(A) · P<sub>A</sub>(B). Die Bedingung steht immer auf der ersten Stufe. Im <strong>Einheitsquadrat</strong> ist jede Wahrscheinlichkeit eine Fläche; P<sub>A</sub>(B) ist die Höhe des B-Teils über A.</p>
    <div class="example">120 Jugendliche: 40 tragen eine Brille (A), 50 kommen mit dem Bus (B), 20 beides. P<sub>B</sub>(A) = 20 : 50 = 0,4: 40 % der Busfahrenden tragen eine Brille. P<sub>A</sub>(B) = 20 : 40 = 0,5: Die Hälfte der Brillenträger fährt Bus. P(A ∩ B) = 20 : 120 ≈ 0,167.</div>
    <div class="merke"><strong>Merke:</strong> P<sub>B</sub>(A) = P(A ∩ B) : P(B). Die Bedingung B ist die neue Grundmenge. Im Baum: Pfadregel P(A ∩ B) = P(A) · P<sub>A</sub>(B).</div>
  `,
  formulas: [
    { name: "Bedingte Wahrscheinlichkeit", html: "P<sub>B</sub>(A) = P(A ∩ B) : P(B)", quantities: "P(B) > 0; B ist die Bedingung" },
    { name: "Pfadregel mit Bedingung", html: "P(A ∩ B) = P(A) · P<sub>A</sub>(B)", quantities: "erste Stufe A, zweite Stufe B" },
    { name: "Satz von der totalen Wahrscheinlichkeit", html: "P(B) = P(A) · P<sub>A</sub>(B) + P(Ā) · P<sub>Ā</sub>(B)", quantities: "Summe der Pfade, die in B enden" },
  ],
  quiz: {
    question: "Von 200 Schülerinnen und Schülern spielen 60 ein Instrument (I), 40 davon singen auch im Chor (C). Was ist P_I(C)?",
    options: ["40 : 60 ≈ 0,67", "40 : 200 = 0,2", "60 : 200 = 0,3"],
    correctIndex: 0,
    explanation: "Die Bedingung I ist die neue Grundmenge: Unter den 60 mit Instrument singen 40 im Chor. 40 : 200 wäre P(I ∩ C).",
  },
  lab: {
    kind: "area-diagram",
    title: "Labor: Einheitsquadrat und Vierfeldertafel",
    intro:
      "Ziehe die Trennlinie unten für P(A) und die beiden orangen Punkte für die Höhen der B-Teile. Die Vierfeldertafel rechnet mit. Die Flächen sind die Wahrscheinlichkeiten der vier Felder.",
    params: AREA_PARAMS,
    readouts: [
      { key: "ab", label: "P(A ∩ B)", emphasis: true, compute: (v) => prob(fieldsOf(v).ab) },
      { key: "b", label: "P(B)", compute: (v) => prob(fieldsOf(v).b) },
      { key: "pBA", label: "P_A(B)", compute: (v) => prob(v.pBA) },
      { key: "pAB", label: "P_B(A)", compute: (v) => (fieldsOf(v).b === 0 ? "P(B) = 0: nicht definiert" : prob(pAgivenB(v))) },
    ],
    goals: [
      { id: "schnitt", text: "Stelle P(A) = 0,5 ein und erreiche P(A ∩ B) = 0,2.", check: (v) => v.pA === 0.5 && Math.abs(fieldsOf(v).ab - 0.2) < 1e-9 },
      { id: "umgekehrt", text: "Mit P(A) = 0,2: Erreiche, dass die Hälfte von B in A liegt, also P_B(A) = 0,5.", check: (v) => v.pA === 0.2 && Math.abs(pAgivenB(v) - 0.5) < 1e-9 },
      { id: "richtungen", text: "Erreiche P_A(B) = 0,8, aber P_B(A) = 0,4: Die beiden Richtungen der Bedingung sind verschieden.", check: (v) => v.pBA === 0.8 && Math.abs(pAgivenB(v) - 0.4) < 1e-9 },
    ],
  },
  exercises: [
    { id: "vierfeldertafel", make: vierfeldertafel },
    { id: "baumdiagramm", make: baumdiagramm },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst bedingte Wahrscheinlichkeiten in Vierfeldertafel, Baum und Einheitsquadrat.",
};

// 3.2 Bedingte Wahrscheinlichkeiten umkehren ─────────────────────────────────

function diagnose10000(rng: Rng, level: 1 | 2): ExerciseTask {
  const prev = rng.pick([0.001, 0.005, 0.01, 0.02, 0.05]);
  const sens = rng.pick([0.9, 0.95, 0.98, 0.99]);
  const spec = rng.pick([0.9, 0.95, 0.97, 0.99]);
  const d = diagnose({ prev, sens, spec }, 100000);
  if (level === 1) {
    return {
      prompt: `Eine Krankheit K tritt bei ${fmt(prev * 100, 1)} % der Bevölkerung auf. Ein Test erkennt ${fmt(sens * 100)} % der Kranken (Sensitivität) und fällt bei ${fmt(spec * 100)} % der Gesunden negativ aus (Spezifität). Wie viele von 100 000 Getesteten sind krank und positiv getestet? Wie groß ist ${P("T", "K")}, die Wahrscheinlichkeit, bei positivem Test wirklich krank zu sein?`,
      given: [`P(K) = ${fmt(prev, 3)}`, `${P("K", "T")} = ${fmt(sens)}`, `${P("K̄", "T̄")} = ${fmt(spec)}`],
      formulaHint: `Natürliche Häufigkeiten: krank und positiv = 100 000 · P(K) · ${P("K", "T")}; ${P("T", "K")} = (krank und positiv) : (alle positiv)`,
      fields: [
        numberField("krank und positiv:", d.truePos, "", 0),
        numberField(`${P("T", "K")} ≈`, d.ppv, "", 3, { slips: [{ value: sens, hint: "Das ist die Sensitivität P_K(T). Gesucht ist P_T(K): Unter allen Positiven, wie viele sind krank?" }] }),
      ],
      steps: [
        `krank: ${fmt(d.sick)}, davon positiv: ${fmt(d.truePos)}; gesund: ${fmt(d.healthy)}, davon positiv: ${fmt(d.falsePos)}`,
        `${P("T", "K")} = ${fmt(d.truePos)} : ${fmt(d.truePos + d.falsePos)} ${rel(d.ppv, 3)} ${fmt(d.ppv, 3)}`,
        `<strong>${fmt(d.truePos)} Personen; ${P("T", "K")} ≈ ${fmt(d.ppv, 3)}</strong>`,
      ],
    };
  }
  const spam = rng.pick([0.2, 0.3, 0.4, 0.5]);
  const hit = rng.pick([0.95, 0.98, 0.9]);
  const false1 = rng.pick([0.02, 0.05, 0.1]);
  const flagged = spam * hit + (1 - spam) * false1;
  const ppv = (spam * hit) / flagged;
  const statements = [
    `${fmt(hit * 100)} % der Spam-Mails werden markiert.`,
    `${fmt(hit * 100)} % der markierten Mails sind Spam.`,
    `${fmt(hit * 100)} % aller Mails sind Spam und werden markiert.`,
  ];
  return {
    prompt: `Ein Spamfilter: ${fmt(spam * 100)} % der eingehenden Mails sind Spam (S). Er markiert ${fmt(hit * 100)} % der Spam-Mails und irrtümlich ${fmt(false1 * 100)} % der erwünschten Mails (M = markiert). Welche Aussage gibt die Herstellerangabe „${fmt(hit * 100)} %“ richtig wieder? Wie groß ist der Anteil von Spam unter den markierten Mails?`,
    given: [`P(S) = ${fmt(spam)}`, `${P("S", "M")} = ${fmt(hit)}`, `${P("S̄", "M")} = ${fmt(false1)}`],
    fields: [choiceField(`Bedeutung von ${fmt(hit * 100)} %`, statements, 0), numberField(`${P("M", "S")} ≈`, ppv, "", 3)],
    steps: [
      `„${fmt(hit * 100)} % der Spam-Mails“: Die Bedingung ist S, also ${P("S", "M")}.`,
      `P(M) = ${fmt(spam)} · ${fmt(hit)} + ${fmt(1 - spam)} · ${fmt(false1)} = ${fmt(flagged, 4)}`,
      `${P("M", "S")} = ${fmt(spam * hit, 4)} : ${fmt(flagged, 4)} ${rel(ppv, 3)} ${fmt(ppv, 3)}`,
      `<strong>Aussage 1; ${P("M", "S")} ≈ ${fmt(ppv, 3)}</strong>`,
    ],
  };
}

function unterscheiden(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const pK = rng.pick([0.1, 0.2, 0.05]);
    const pTK = rng.pick([0.8, 0.9, 0.95]);
    const kinds = [
      { text: `${fmt(pTK * 100)} % der Kranken haben einen positiven Test.`, idx: 0 },
      { text: `${fmt(pTK * 100)} % der positiv Getesteten sind krank.`, idx: 1 },
      { text: `${fmt(pTK * 100)} % aller Personen sind krank und positiv getestet.`, idx: 2 },
    ];
    const chosen = rng.pick(kinds);
    return {
      prompt: `Welche Wahrscheinlichkeit beschreibt die Aussage „${chosen.text}“? Berechne außerdem P(K ∩ T), wenn P(K) = ${fmt(pK)} und ${P("K", "T")} = ${fmt(pTK)} ist.`,
      given: [`P(K) = ${fmt(pK)}`, `${P("K", "T")} = ${fmt(pTK)}`],
      formulaHint: "„… der Kranken“: Bedingung K. „… der positiv Getesteten“: Bedingung T. „… aller“: Schnitt K ∩ T.",
      fields: [choiceField("gemeint ist", [`${P("K", "T")}`, `${P("T", "K")}`, "P(K ∩ T)"], chosen.idx), numberField("P(K ∩ T) =", pK * pTK, "", 4)],
      steps: [[`Bezugsgruppe sind die Kranken: Bedingung K.`, `Bezugsgruppe sind die positiv Getesteten: Bedingung T.`, `Bezugsgruppe sind alle Personen: kein Bedingen, sondern der Schnitt.`][chosen.idx], `P(K ∩ T) = ${fmt(pK)} · ${fmt(pTK)} = ${fmt(pK * pTK, 4)}`, `<strong>${[P("K", "T"), P("T", "K"), "P(K ∩ T)"][chosen.idx]}; P(K ∩ T) = ${fmt(pK * pTK, 4)}</strong>`],
    };
  }
  const pos = rng.pick([400, 500, 800]);
  const sickPos = Math.round(rng.pick([0.25, 0.4, 0.6]) * pos);
  const sick = sickPos + rng.pick([10, 20, 40]);
  return {
    prompt: `Ein Screening liefert: Von ${pos} positiv getesteten Personen sind ${sickPos} tatsächlich krank. Insgesamt wurden ${sick} Kranke untersucht. Bestimme ${P("T", "K")} und die Sensitivität ${P("K", "T")} aus diesen absoluten Häufigkeiten.`,
    given: [`positiv: ${pos}`, `krank und positiv: ${sickPos}`, `krank: ${sick}`],
    fields: [numberField(`${P("T", "K")} =`, sickPos / pos, "", 3), numberField(`${P("K", "T")} ≈`, sickPos / sick, "", 3, { slips: [{ value: sickPos / pos, hint: "Bei der Sensitivität sind die Kranken die Bezugsgruppe." }] })],
    steps: [`${P("T", "K")} = ${sickPos} : ${pos} = ${fmt(sickPos / pos, 3)}`, `${P("K", "T")} = ${sickPos} : ${sick} ${rel(sickPos / sick, 3)} ${fmt(sickPos / sick, 3)}`, `<strong>${P("T", "K")} = ${fmt(sickPos / pos, 3)}; ${P("K", "T")} ≈ ${fmt(sickPos / sick, 3)}</strong>`],
  };
}

const diagnostik: Lesson = {
  id: "bw-2-diagnostik",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Bedingte Wahrscheinlichkeiten umkehren",
  subtitle: "P_B(A), P_A(B) und P(A ∩ B) in der Diagnostik",
  lehrplan: `${LEHRPLAN}, Unterscheidung von P_B(A), P_A(B) und P(A ∩ B), Schluss auf die umgekehrte bedingte Wahrscheinlichkeit`,
  whyItMatters:
    "Ein Test mit 99 % Treffsicherheit klingt sicher. Ob ein positives Ergebnis aber wirklich krank bedeutet, hängt stark davon ab, wie selten die Krankheit ist. Wer die beiden Richtungen der Bedingung verwechselt, zieht in Medizin, Justiz und Medien falsche Schlüsse.",
  explanationHtml: `
    <p>In der medizinischen Diagnostik musst du drei Wahrscheinlichkeiten klar unterscheiden (K: krank, T: Test positiv):</p>
    <ul>
      <li><strong>P<sub>K</sub>(T)</strong>, die <strong>Sensitivität</strong>: Anteil der Kranken mit positivem Test.</li>
      <li><strong>P<sub>T</sub>(K)</strong>, der positive Vorhersagewert: Anteil der Kranken unter den positiv Getesteten. Das will die getestete Person wissen.</li>
      <li><strong>P(K ∩ T)</strong>: Anteil aller Getesteten, die krank <em>und</em> positiv sind.</li>
    </ul>
    <p>Den Schluss von P<sub>K</sub>(T) auf P<sub>T</sub>(K) machst du am sichersten mit <strong>natürlichen Häufigkeiten</strong>: Stell dir 10 000 Personen vor, verteile sie im Baum auf krank/gesund und dann auf positiv/negativ und lies ab:</p>
    <p class="formula-line">P<sub>T</sub>(K) = (krank und positiv) : (alle positiv)</p>
    <p>Ein „umgekehrter“ Baum oder eine Vierfeldertafel mit absoluten Zahlen leisten dasselbe. Die Spezifität P<sub>K̄</sub>(T̄) ist der Anteil der Gesunden mit negativem Test.</p>
    <div class="example">Prävalenz 1 %, Sensitivität 99 %, Spezifität 99 %. Von 10 000 Personen sind 100 krank, davon 99 positiv; von 9 900 Gesunden sind 1 % = 99 positiv. P<sub>T</sub>(K) = 99 : (99 + 99) = 0,5. Trotz guter Testwerte ist nur jede zweite positiv getestete Person krank.</div>
    <div class="merke"><strong>Merke:</strong> P<sub>K</sub>(T) und P<sub>T</sub>(K) beziehen sich auf verschiedene Gruppen (die Kranken bzw. die positiv Getesteten) und sind im Allgemeinen verschieden; gleich sind sie nur zufällig. Den Schluss von der einen auf die andere bedingte Wahrscheinlichkeit machst du mit natürlichen Häufigkeiten: P<sub>T</sub>(K) = |K ∩ T| : |T|.</div>
  `,
  formulas: [
    { name: "Positiver Vorhersagewert", html: "P<sub>T</sub>(K) = P(K ∩ T) : P(T)", quantities: "T positiver Test, K krank" },
    { name: "Wahrscheinlichkeit eines positiven Tests", html: "P(T) = P(K) · P<sub>K</sub>(T) + P(K̄) · P<sub>K̄</sub>(T)", quantities: "P_K(T) Sensitivität, 1 − P_K̄(T) Spezifität" },
  ],
  quiz: {
    question: "Ein Test hat 95 % Sensitivität. Was bedeutet das?",
    options: ["95 % der Kranken werden positiv getestet.", "95 % der positiv Getesteten sind krank.", "95 % aller Getesteten erhalten ein richtiges Ergebnis."],
    correctIndex: 0,
    explanation: "Die Sensitivität ist P_K(T): Bezugsgruppe sind die Kranken. Der Anteil Kranker unter den Positiven, P_T(K), hängt zusätzlich von der Häufigkeit der Krankheit und der Spezifität ab.",
  },
  lab: {
    kind: "diagnostic-test",
    title: "Labor: Was ein positiver Test bedeutet",
    intro: "Stelle Prävalenz, Sensitivität und Spezifität ein. Der Baum verteilt 10 000 Personen; oben steht, welcher Anteil der positiv Getesteten wirklich krank ist.",
    params: [
      { type: "range", key: "prev", label: "Prävalenz P(K)", unit: "", min: 0.005, max: 0.2, step: 0.005, value: 0.05, digits: 3 },
      { type: "range", key: "sens", label: "Sensitivität P_K(T)", unit: "", min: 0.5, max: 1, step: 0.01, value: 0.8, digits: 2 },
      { type: "range", key: "spec", label: "Spezifität P_K̄(T̄)", unit: "", min: 0.5, max: 1, step: 0.01, value: 0.8, digits: 2 },
    ],
    readouts: [
      { key: "ppv", label: "P_T(K): krank bei positivem Test", emphasis: true, compute: (v) => diagnose(v).ppv, digits: 3 },
      { key: "npv", label: "P_T̄(K̄): gesund bei negativem Test", compute: (v) => diagnose(v).npv, digits: 4 },
      { key: "pos", label: "positiv von 10 000", compute: (v) => { const d = diagnose(v); return `${fmt(d.truePos + d.falsePos, 1)}, davon krank ${fmt(d.truePos, 1)}`; } },
    ],
    goals: [
      { id: "trotzdem-gesund", text: "Stelle Sensitivität und Spezifität auf mindestens 95 % und zeige: Trotzdem ist weniger als die Hälfte der positiv Getesteten krank.", check: (v) => v.sens >= 0.95 && v.spec >= 0.95 && diagnose(v).ppv < 0.5 },
      { id: "faustregel", text: "Prävalenz 1 %, Sensitivität und Spezifität 99 %: Wie groß ist P_T(K)?", check: (v) => v.prev === 0.01 && v.sens === 0.99 && v.spec === 0.99 && Math.abs(diagnose(v).ppv - 0.5) < 1e-9 },
      { id: "praevalenz", text: "Bei 90 % Sensitivität und 90 % Spezifität: Suche die kleinste Prävalenz, bei der mindestens die Hälfte der positiv Getesteten krank ist.", check: (v) => v.sens === 0.9 && v.spec === 0.9 && diagnose(v).ppv >= 0.5 - 1e-9 && v.prev <= 0.1 + 1e-9 },
    ],
  },
  exercises: [
    { id: "diagnose", make: diagnose10000 },
    { id: "unterscheiden", make: unterscheiden },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest P_K(T), P_T(K) und P(K ∩ T) und kehrst Bedingungen mit natürlichen Häufigkeiten um.",
};

// 3.3 Stochastische Unabhängigkeit ───────────────────────────────────────────

function pruefen(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.2, 0.3, 0.4, 0.5, 0.6]);
    const b = rng.pick([0.1, 0.25, 0.5, 0.7]);
    const indep = rng.next() < 0.5;
    const ab = indep ? a * b : round(a * b + rng.pick([-0.05, 0.05, 0.1]), 4);
    // P(A ∩ B) must fit: at most min(P(A), P(B)) and at least P(A) + P(B) − 1.
    const safeAb = ab <= 0 || ab > Math.min(a, b) || ab < a + b - 1 ? a * b : ab;
    const isIndep = Math.abs(safeAb - a * b) < 1e-9;
    return {
      prompt: `Für zwei Ereignisse gilt P(A) = ${fmt(a)}, P(B) = ${fmt(b)} und P(A ∩ B) = ${fmt(safeAb, 4)}. Sind A und B stochastisch unabhängig?`,
      given: [`P(A) = ${fmt(a)}`, `P(B) = ${fmt(b)}`, `P(A ∩ B) = ${fmt(safeAb, 4)}`],
      formulaHint: "A und B sind stochastisch unabhängig ⇔ P(A ∩ B) = P(A) · P(B)",
      fields: [numberField("P(A) · P(B) =", a * b, "", 4), yesNo("unabhängig?", isIndep)],
      steps: [`P(A) · P(B) = ${fmt(a)} · ${fmt(b)} = ${fmt(a * b, 4)}`, `Vergleich mit P(A ∩ B) = ${fmt(safeAb, 4)}`, `<strong>${isIndep ? "gleich: unabhängig" : "verschieden: abhängig"}</strong>`],
    };
  }
  const indep = rng.next() < 0.5;
  const nA = rng.pick([200, 300, 400]);
  const nNA = rng.pick([300, 500, 600]);
  const q = rng.pick([0.2, 0.3, 0.4, 0.5]);
  const ab = Math.round(nA * q);
  const nab = Math.round(nNA * (indep ? q : q + rng.pick([0.1, -0.1, 0.2])));
  const qN = nab / nNA;
  return {
    prompt: `Eine Umfrage unter ${nA + nNA} Personen: ${nA} leben in der Stadt (A), davon nutzen ${ab} täglich den ÖPNV (B). Von den ${nNA} Personen auf dem Land nutzen ${nab} täglich den ÖPNV. Bestimme ${P("A", "B")} und ${P("Ā", "B")}. Sind Wohnort und ÖPNV-Nutzung in dieser Umfrage stochastisch unabhängig?`,
    given: [`|A| = ${nA}, |A ∩ B| = ${ab}`, `|Ā| = ${nNA}, |Ā ∩ B| = ${nab}`],
    fields: [numberField(`${P("A", "B")} =`, q, "", 3), numberField(`${P("Ā", "B")} =`, qN, "", 3), yesNo("unabhängig?", indep)],
    steps: [`${P("A", "B")} = ${ab} : ${nA} = ${fmt(q, 3)}`, `${P("Ā", "B")} = ${nab} : ${nNA} = ${fmt(qN, 3)}`, `<strong>${indep ? "gleich: unabhängig" : "verschieden: abhängig"}</strong>`],
  };
}

function fehlenderWert(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.2, 0.4, 0.5, 0.6, 0.8]);
    const b = rng.pick([0.1, 0.3, 0.5, 0.7]);
    return {
      prompt: `A und B sind stochastisch unabhängig mit P(A) = ${fmt(a)} und P(B) = ${fmt(b)}. Berechne P(A ∩ B) und P(Ā ∩ B̄).`,
      given: [`P(A) = ${fmt(a)}`, `P(B) = ${fmt(b)}`],
      formulaHint: "Bei Unabhängigkeit: P(A ∩ B) = P(A) · P(B), und auch Ā und B̄ sind unabhängig.",
      fields: [numberField("P(A ∩ B) =", a * b, "", 4), numberField("P(Ā ∩ B̄) =", (1 - a) * (1 - b), "", 4, { slips: [{ value: 1 - a * b, hint: "1 − P(A ∩ B) ist P(nicht beide), nicht P(keines von beiden)." }] })],
      steps: [`P(A ∩ B) = ${fmt(a)} · ${fmt(b)} = ${fmt(a * b, 4)}`, `P(Ā ∩ B̄) = ${fmt(1 - a)} · ${fmt(1 - b)} = ${fmt((1 - a) * (1 - b), 4)}`, `<strong>${fmt(a * b, 4)} und ${fmt((1 - a) * (1 - b), 4)}</strong>`],
    };
  }
  const ab = rng.pick([20, 30, 40, 60]);
  const anb = rng.pick([30, 60, 90]);
  const k = rng.pick([2, 3, 4]);
  const nab = ab * k;
  const x = anb * k;
  return {
    prompt: `In einer Vierfeldertafel mit absoluten Häufigkeiten stehen |A ∩ B| = ${ab}, |A ∩ B̄| = ${anb} und |Ā ∩ B| = ${nab}. Welche Zahl muss im Feld Ā ∩ B̄ stehen, damit A und B stochastisch unabhängig sind? Wie groß ist dann P(B)?`,
    given: [`|A ∩ B| = ${ab}`, `|A ∩ B̄| = ${anb}`, `|Ā ∩ B| = ${nab}`],
    fields: [numberField("|Ā ∩ B̄| =", x, "", 0), numberField("P(B) =", (ab + nab) / (ab + anb + nab + x), "", 4)],
    steps: [
      `Unabhängig ⇔ ${P("A", "B")} = ${P("Ā", "B")}: ${ab} : ${ab + anb} = ${nab} : (${nab} + x)`,
      `Das gilt, wenn die Zeile Ā das ${k}-Fache der Zeile A ist: x = ${k} · ${anb} = ${x}`,
      `P(B) = ${ab + nab} : ${ab + anb + nab + x} = ${fmt((ab + nab) / (ab + anb + nab + x), 4)}`,
      `<strong>|Ā ∩ B̄| = ${x}; P(B) = ${fmt((ab + nab) / (ab + anb + nab + x), 4)}</strong>`,
    ],
  };
}

const unabhaengigkeit: Lesson = {
  id: "bw-3-unabhaengigkeit",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Stochastische Unabhängigkeit",
  subtitle: "Wenn die Bedingung nichts ändert",
  lehrplan: `${LEHRPLAN}, stochastische Unabhängigkeit an Baumdiagrammen und Vierfeldertafeln erkennen und rechnerisch prüfen`,
  whyItMatters:
    "Ob zwei Merkmale zusammenhängen, ist eine Grundfrage jeder Statistik: Hängt das Kaufverhalten vom Alter ab, die Fehlerquote von der Maschine? Stochastische Unabhängigkeit ist der Maßstab, an dem man das prüft.",
  explanationHtml: `
    <p>Zwei Ereignisse A und B heißen <strong>stochastisch unabhängig</strong>, wenn das Eintreten des einen die Wahrscheinlichkeit des anderen nicht ändert: P<sub>A</sub>(B) = P<sub>Ā</sub>(B) = P(B). Gleichwertig und am einfachsten zu prüfen ist</p>
    <p class="formula-line">P(A ∩ B) = P(A) · P(B).</p>
    <p>So erkennst du Unabhängigkeit:</p>
    <ul>
      <li><strong>im Baumdiagramm:</strong> Auf der zweiten Stufe stehen hinter A und hinter Ā dieselben Wahrscheinlichkeiten.</li>
      <li><strong>in der Vierfeldertafel:</strong> Jeder Eintrag ist das Produkt seiner Randwahrscheinlichkeiten; bei absoluten Häufigkeiten sind die Zeilen zueinander proportional.</li>
      <li><strong>im Einheitsquadrat:</strong> Die B-Flächen über A und über Ā sind gleich hoch.</li>
    </ul>
    <p>Sind A und B unabhängig, so auch A und B̄, Ā und B sowie Ā und B̄. Stochastische Unabhängigkeit ist eine Eigenschaft der Wahrscheinlichkeiten, keine Aussage über Ursachen.</p>
    <div class="example">Würfeln: A = „gerade Zahl“ (P = 0,5), B = „höchstens 4“ (P = 4/6). A ∩ B = {2; 4}, P(A ∩ B) = 2/6 = 1/3, und P(A) · P(B) = 0,5 · 4/6 = 1/3: unabhängig. Mit B' = „höchstens 3“ wäre P(A ∩ B') = 1/6, aber P(A) · P(B') = 1/4: abhängig.</div>
    <div class="merke"><strong>Merke:</strong> A und B stochastisch unabhängig ⇔ P(A ∩ B) = P(A) · P(B) ⇔ P<sub>A</sub>(B) = P<sub>Ā</sub>(B).</div>
  `,
  formulas: [
    { name: "Stochastische Unabhängigkeit", html: "P(A ∩ B) = P(A) · P(B)", quantities: "gleichwertig: P_A(B) = P_Ā(B) = P(B)" },
  ],
  quiz: {
    question: "P(A) = 0,4, P(B) = 0,5 und P(A ∩ B) = 0,2. Was gilt?",
    options: ["A und B sind stochastisch unabhängig.", "A und B sind abhängig, weil P(A ∩ B) ≠ 0 ist.", "A und B sind abhängig, weil P(A) ≠ P(B) ist."],
    correctIndex: 0,
    explanation: "0,4 · 0,5 = 0,2 = P(A ∩ B). Dass A und B gemeinsam eintreten können oder verschieden wahrscheinlich sind, spricht nicht gegen Unabhängigkeit.",
  },
  lab: {
    kind: "independence",
    title: "Labor: Gleich hohe B-Flächen",
    intro: "Ziehe die Trennlinie für P(A) und die Höhen P_A(B) und P_Ā(B). Rechts vergleichst du P(A ∩ B) mit P(A) · P(B).",
    params: AREA_PARAMS,
    readouts: [
      { key: "verdict", label: "A und B", emphasis: true, compute: (v) => (independent(v) ? "stochastisch unabhängig" : "abhängig") },
      { key: "prod", label: "P(A) · P(B)", compute: (v) => prob(fieldsOf(v).a * fieldsOf(v).b) },
      { key: "ab", label: "P(A ∩ B)", compute: (v) => prob(fieldsOf(v).ab) },
      { key: "b", label: "P(B)", compute: (v) => prob(fieldsOf(v).b) },
    ],
    goals: [
      { id: "unabhaengig", text: "Mache A und B unabhängig mit P(A) = 0,3 und P(B) = 0,6.", check: (v) => v.pA === 0.3 && independent(v) && Math.abs(fieldsOf(v).b - 0.6) < 1e-9 },
      { id: "schnitt", text: "Unabhängig mit P(A) = 0,5 und P(A ∩ B) = 0,2.", check: (v) => v.pA === 0.5 && independent(v) && Math.abs(fieldsOf(v).ab - 0.2) < 1e-9 },
      { id: "doppelt", text: "Abhängig: P_A(B) ist doppelt so groß wie P_Ā(B), und P(B) = 0,5.", check: (v) => v.pBnA > 0 && Math.abs(v.pBA - 2 * v.pBnA) < 1e-9 && Math.abs(fieldsOf(v).b - 0.5) < 1e-9 },
    ],
  },
  exercises: [
    { id: "pruefen", make: pruefen },
    { id: "fehlender-wert", make: fehlenderWert },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du prüfst stochastische Unabhängigkeit rechnerisch und erkennst sie in Baum, Tafel und Quadrat.",
};

// 3.4 Daten kritisch hinterfragen ────────────────────────────────────────────

function gesamtquote(rng: Rng, level: 1 | 2): ExerciseTask {
  // Clinic 1 treats mostly severe cases and is better in both groups.
  const n1s = rng.pick([160, 240]);
  const n1l = rng.pick([20, 40]);
  const n2s = rng.pick([20, 40]);
  const n2l = rng.pick([160, 240]);
  const r1s = rng.pick([0.5, 0.6]);
  const r1l = rng.pick([0.95, 0.9]);
  const r2s = round(r1s - 0.1, 2);
  const r2l = round(r1l - 0.05, 2);
  const h1s = Math.round(n1s * r1s);
  const h1l = Math.round(n1l * r1l);
  const h2s = Math.round(n2s * r2s);
  const h2l = Math.round(n2l * r2l);
  const o1 = (h1s + h1l) / (n1s + n1l);
  const o2 = (h2s + h2l) / (n2s + n2l);
  const better = o1 > o2 ? 0 : 1;
  const given = [
    `Klinik 1: ${n1s} schwere Fälle, davon ${h1s} geheilt; ${n1l} leichte Fälle, davon ${h1l} geheilt`,
    `Klinik 2: ${n2s} schwere Fälle, davon ${h2s} geheilt; ${n2l} leichte Fälle, davon ${h2l} geheilt`,
  ];
  if (level === 1) {
    return {
      prompt: "Berechne die Gesamtheilungsquoten der beiden Kliniken. Welche Klinik schneidet insgesamt besser ab?",
      given,
      formulaHint: "Gesamtquote = (alle Geheilten) : (alle Fälle), nicht der Mittelwert der Gruppenquoten",
      fields: [numberField("Quote Klinik 1 ≈", o1, "", 3, { slips: [{ value: (r1s + r1l) / 2, hint: "Die Gruppen sind verschieden groß: Rechne mit den Anzahlen, nicht mit dem Mittelwert der Quoten." }] }), numberField("Quote Klinik 2 ≈", o2, "", 3), choiceField("insgesamt besser", ["Klinik 1", "Klinik 2"], better)],
      steps: [`Klinik 1: ${h1s + h1l} : ${n1s + n1l} ${rel(o1, 3)} ${fmt(o1, 3)}`, `Klinik 2: ${h2s + h2l} : ${n2s + n2l} ${rel(o2, 3)} ${fmt(o2, 3)}`, `<strong>Klinik ${better + 1} ist insgesamt besser</strong>`],
    };
  }
  return {
    prompt: "Eine Zeitung titelt: „Klinik 2 heilt besser als Klinik 1.“ Prüfe die Schlagzeile mit den Daten: Berechne die Heilungsquote der Klinik 1 bei schweren Fällen und die Gesamtquote der Klinik 2. Ist Klinik 2 in jeder Gruppe besser?",
    given,
    fields: [numberField("Klinik 1, schwer:", r1s, "", 3), numberField("Klinik 2, gesamt ≈", o2, "", 3), yesNo("Klinik 2 in jeder Gruppe besser?", false)],
    steps: [
      `Klinik 1 ist in beiden Gruppen besser: schwer ${fmt(r1s)} gegen ${fmt(r2s)}, leicht ${fmt(r1l)} gegen ${fmt(r2l)}.`,
      `Gesamt: Klinik 1 ${fmt(o1, 3)}, Klinik 2 ${fmt(o2, 3)}. Klinik 1 behandelt viel mehr schwere Fälle.`,
      `<strong>Nein: Die Gesamtquote täuscht, weil die Zusammensetzung verschieden ist (Simpson-Paradoxon).</strong>`,
    ],
  };
}

function korrelation(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const cases = [
      { text: "In Städten mit vielen Störchen werden mehr Kinder geboren.", right: 1 },
      { text: "Wer mehr Eis isst, bekommt häufiger einen Sonnenbrand.", right: 1 },
      { text: "Schülerinnen und Schüler mit mehr Nachhilfestunden haben im Schnitt schlechtere Noten.", right: 2 },
    ];
    const c = rng.pick(cases);
    const options = ["Die Daten beweisen eine Ursache-Wirkungs-Beziehung.", "Eine dritte Größe (z. B. Land statt Stadt, Sonnenwetter) kann beides beeinflussen: Korrelation, keine nachgewiesene Kausalität.", "Die Richtung kann umgekehrt sein: Wer schlechte Noten hat, nimmt eher Nachhilfe."];
    const n = rng.pick([200, 400, 500]);
    const count = Math.round(rng.pick([0.15, 0.3, 0.45]) * n);
    const share = count / n;
    return {
      prompt: `Eine Untersuchung findet: „${c.text}“ Welche Deutung ist berechtigt? In der Stichprobe mit ${n} Fällen trifft das Merkmal auf ${count} zu. Wie groß ist der Anteil?`,
      given: [`Stichprobe: ${n}`, `mit Merkmal: ${count}`],
      formulaHint: "Korrelation: Zwei Größen treten gemeinsam auf. Kausalität: Die eine bewirkt die andere. Prüfe Drittvariable und Richtung.",
      fields: [choiceField("Deutung", options, c.right), numberField("Anteil:", share, "", 3)],
      steps: [c.right === 1 ? "Eine gemeinsame Ursache erklärt den Zusammenhang." : "Die Ursache kann in der umgekehrten Richtung liegen.", `<strong>Deutung ${c.right + 1}; Anteil ${fmt(share, 3)}</strong>`],
    };
  }
  const online = rng.pick([1200, 2000, 3000]);
  const yes = rng.pick([0.7, 0.8, 0.85]);
  return {
    prompt: `Eine Online-Umfrage auf einer Gaming-Webseite mit ${online} Teilnehmenden ergibt: ${fmt(yes * 100)} % finden, dass Jugendliche zu wenig Zeit mit Videospielen verbringen dürfen. Eine Partei folgert daraus: „Die große Mehrheit der Bevölkerung will mehr Spielzeit für Jugendliche.“ Wie viele Teilnehmende haben zugestimmt, und was ist das Hauptproblem der Schlussfolgerung?`,
    given: [`Teilnehmende: ${online}`, `Zustimmung: ${fmt(yes * 100)} %`],
    fields: [
      numberField("zustimmend:", online * yes, "", 0),
      choiceField("Hauptproblem", ["Die Stichprobe ist nicht repräsentativ: Wer auf einer Gaming-Seite abstimmt, ist selbst interessiert.", "Die Stichprobe ist zu klein; mit 100 000 Teilnehmenden wäre der Schluss richtig.", "Prozentangaben dürfen nie verallgemeinert werden."], 0),
    ],
    steps: [`${online} · ${fmt(yes)} = ${fmt(online * yes)}`, "Wer teilnimmt, entscheidet selbst (Selbstauswahl) und ist kein Abbild der Bevölkerung; auch eine größere, gleich verzerrte Stichprobe hilft nicht.", `<strong>${fmt(online * yes)}; die Stichprobe ist verzerrt</strong>`],
  };
}

const datenHinterfragen: Lesson = {
  id: "bw-4-daten-hinterfragen",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Daten kritisch hinterfragen",
  subtitle: "Stichproben, Teilgruppen, Korrelation und Kausalität",
  lehrplan: `${LEHRPLAN}, aus Daten abgeleitete Aussagen kritisch hinterfragen, Korrelation und Kausalität`,
  whyItMatters:
    "Zahlen in Nachrichten und Wahlkämpfen wirken objektiv, sind aber immer gedeutet. Wer weiß, wie Stichproben verzerren und wie sich bedingte Wahrscheinlichkeiten in Teilgruppen umdrehen können, lässt sich nicht so leicht täuschen.",
  explanationHtml: `
    <p>Bevor du einer Aussage glaubst, die aus Daten abgeleitet ist, prüfst du:</p>
    <ul>
      <li><strong>Umfang und Zusammensetzung der Stichprobe:</strong> Wer wurde befragt? Eine Online-Umfrage mit Selbstauswahl oder eine Befragung nur in einer Gruppe ist nicht repräsentativ, auch wenn sie groß ist.</li>
      <li><strong>Art der Erhebung und Fragestellung:</strong> Suggestive Fragen, unklare Begriffe und fehlende Antwortmöglichkeiten verändern das Ergebnis.</li>
      <li><strong>Teilgruppen:</strong> Bedingte Wahrscheinlichkeiten können sich ändern, je nachdem, welche Teilmenge der Daten man betrachtet. Beim <strong>Simpson-Paradoxon</strong> ist eine Gruppe in jeder Teilgruppe besser, insgesamt aber schlechter, weil die Teilgruppen verschieden zusammengesetzt sind.</li>
      <li><strong>Korrelation und Kausalität:</strong> Treten zwei Merkmale gemeinsam auf (Korrelation), bewirkt das eine nicht unbedingt das andere (Kausalität). Oft steckt eine dritte Größe dahinter, oder die Wirkung läuft in die andere Richtung.</li>
    </ul>
    <p>Auch die Darstellung ist eine Interpretation: abgeschnittene Achsen, ausgewählte Zeiträume oder nur relative Zahlen können zu falschen Schlussfolgerungen führen.</p>
    <div class="example">Klinik 1 heilt 60 % der 160 schweren und 95 % der 40 leichten Fälle, insgesamt 134 von 200 = 67 %. Klinik 2 heilt 50 % der 40 schweren und 90 % der 160 leichten Fälle, insgesamt 164 von 200 = 82 %. Klinik 1 ist in beiden Gruppen besser, behandelt aber viel mehr schwere Fälle. Die Gesamtquote allein führt in die Irre.</div>
    <div class="merke"><strong>Merke:</strong> Frage immer: Wer wurde wie befragt? Gilt die Aussage auch in den Teilgruppen? Ist ein Zusammenhang eine Ursache oder nur eine Korrelation?</div>
  `,
  formulas: [
    { name: "Gesamtquote", html: "Quote = (Treffer in allen Gruppen) : (alle Fälle)", quantities: "gewichtet mit den Gruppengrößen, nicht der Mittelwert der Gruppenquoten" },
  ],
  quiz: {
    question: "In Gemeinden mit mehr Feuerwehrleuten im Einsatz entstehen größere Brandschäden. Was folgt daraus?",
    options: ["Nichts über Ursachen: Große Brände bringen mehr Feuerwehrleute und mehr Schaden mit sich.", "Feuerwehrleute verursachen Schäden.", "Weniger Feuerwehrleute würden die Schäden verringern."],
    correctIndex: 0,
    explanation: "Die Größe des Brandes beeinflusst beide Merkmale. Die Korrelation ist echt, eine Kausalität von Feuerwehr zu Schaden folgt daraus nicht.",
  },
  lab: {
    kind: "simpson",
    title: "Labor: Das Simpson-Paradoxon",
    intro: "Jede Klinik behandelt schwere (orange, links) und leichte Fälle. Ziehe die Höhen (Heilungsquoten) und unten die Trennpunkte (Anteil schwerer Fälle). Die Linie zeigt die Gesamtquote.",
    params: [
      { type: "range", key: "s1", label: "Klinik 1: Anteil schwerer Fälle", unit: "", min: 0.1, max: 0.9, step: 0.1, value: 0.5, digits: 1 },
      { type: "range", key: "r1s", label: "Klinik 1: Heilungsquote schwer", unit: "", min: 0.3, max: 1, step: 0.05, value: 0.6, digits: 2 },
      { type: "range", key: "r1l", label: "Klinik 1: Heilungsquote leicht", unit: "", min: 0.3, max: 1, step: 0.05, value: 0.8, digits: 2 },
      { type: "range", key: "s2", label: "Klinik 2: Anteil schwerer Fälle", unit: "", min: 0.1, max: 0.9, step: 0.1, value: 0.5, digits: 1 },
      { type: "range", key: "r2s", label: "Klinik 2: Heilungsquote schwer", unit: "", min: 0.3, max: 1, step: 0.05, value: 0.7, digits: 2 },
      { type: "range", key: "r2l", label: "Klinik 2: Heilungsquote leicht", unit: "", min: 0.3, max: 1, step: 0.05, value: 0.9, digits: 2 },
    ],
    readouts: [
      { key: "o1", label: "Gesamtquote Klinik 1", emphasis: true, compute: (v) => overallRate(v, 1), digits: 3 },
      { key: "o2", label: "Gesamtquote Klinik 2", emphasis: true, compute: (v) => overallRate(v, 2), digits: 3 },
      { key: "groups", label: "in den Gruppen", compute: (v) => (betterInBoth(v) ? "Klinik 1 ist in beiden Gruppen besser" : v.r2l > v.r1l && v.r2s > v.r1s ? "Klinik 2 ist in beiden Gruppen besser" : "keine Klinik ist in beiden Gruppen besser") },
    ],
    goals: [
      { id: "paradox", text: "Erzeuge das Paradoxon: Klinik 1 ist in beiden Gruppen besser, insgesamt aber schlechter als Klinik 2.", check: (v) => betterInBoth(v) && overallRate(v, 1) < overallRate(v, 2) },
      { id: "gleich-gut", text: "Mache beide Kliniken in jeder Gruppe gleich gut, aber ihre Gesamtquoten um mindestens 0,1 verschieden.", check: (v) => Math.abs(v.r1l - v.r2l) < 1e-9 && Math.abs(v.r1s - v.r2s) < 1e-9 && Math.abs(overallRate(v, 1) - overallRate(v, 2)) >= 0.1 - 1e-9 },
      { id: "gleiche-mischung", text: "Gib beiden Kliniken dieselbe Mischung und mache Klinik 1 in beiden Gruppen besser: Jetzt ist sie auch insgesamt besser.", check: (v) => v.s1 === v.s2 && betterInBoth(v) },
    ],
  },
  exercises: [
    { id: "gesamtquote", make: gesamtquote },
    { id: "korrelation", make: korrelation },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du hinterfragst Daten: Stichprobe, Teilgruppen, Korrelation und Kausalität.",
};

export const STAGE_BEDINGTE_WAHRSCHEINLICHKEIT: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Bedingte Wahrscheinlichkeit und Unabhängigkeit",
  subtitle: "Vierfeldertafeln, Diagnostik, Unabhängigkeit und kritischer Umgang mit Daten",
  icon: "🎲",
  accent: "#c2410c",
  badgeTitle: "Daten-Check bestanden",
  lehrplanLabel: "M11 LB 3 · ca. 15 Std.",
  lessons: [bedingt, diagnostik, unabhaengigkeit, datenHinterfragen],
};
