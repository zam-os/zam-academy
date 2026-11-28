import { fmt, linear, MINUS } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, signed, task } from "./builders";
import { choiceField, intField } from "./helpers";
import {
  labLgsCases,
  labLgsElimination,
  labLgsGraphical,
  labLgsModeling,
  labLgsSubstitution,
} from "./labs-4-7";
import { makeLessons } from "./make";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 6 ────────────────────────────────────────────────────────

const exSystemModel: ExerciseGenerator = {
  id: "lg-system-aufstellen",
  make(rng, level) {
    const x = rng.int(4, 9);
    const y = rng.int(2, x - 1);
    const s1 = 2 * x + 3 * y;
    const s2 = x + 2 * y;

    if (level === 1) {
      return task(
        level,
        `Familie A kauft 2 Erwachsenen- und 3 Kinderkarten für ${fmt(s1, 0)} €. Familie B zahlt für 1 Erwachsenen- und 2 Kinderkarten ${fmt(s2, 0)} €. Bestimme den Erwachsenenpreis x und Kinderpreis y.`,
        "",
        [
          intField("Erwachsenenpreis x =", x, undefined, "€"),
          intField("Kinderpreis y =", y, undefined, "€"),
        ],
        `Gleichungen: I: 2x + 3y = ${fmt(s1, 0)} und II: x + 2y = ${fmt(s2, 0)}. Stelle II nach x um.`,
        `x = ${fmt(s2, 0)} ${MINUS} 2y in I einsetzen: 2(${fmt(s2, 0)} ${MINUS} 2y) + 3y = ${fmt(s1, 0)} ⇒ ${fmt(2 * s2, 0)} ${MINUS} y = ${fmt(s1, 0)}.`,
        `y = ${fmt(2 * s2 - s1, 0)} = ${fmt(y, 0)} €, x = ${fmt(s2, 0)} ${MINUS} 2·${fmt(y, 0)} = <strong>${fmt(x, 0)} €</strong> und <strong>y = ${fmt(y, 0)} €</strong>.`,
        { x, y, s1, s2 },
      );
    }

    const total = x + y;
    const diff = x - y;
    return task(
      level,
      "",
      `Zwei Zahlen haben die Summe ${fmt(total, 0)} und die Differenz ${fmt(diff, 0)} (x > y). Stelle ein Gleichungssystem auf und bestimme beide Zahlen.`,
      [
        choiceField(
          "Passendes System",
          [
            `I: x + y = ${fmt(total, 0)} und II: x − y = ${fmt(diff, 0)}`,
            `I: x · y = ${fmt(total, 0)} und II: x + y = ${fmt(diff, 0)}`,
            `I: 2x + y = ${fmt(total, 0)} und II: x − 2y = ${fmt(diff, 0)}`,
          ],
          0,
        ),
        intField("Größere Zahl x =", x),
        intField("Kleinere Zahl y =", y),
      ],
      "",
      `Summe von I + II: 2x = ${fmt(total + diff, 0)} ⇒ x = ${fmt(x, 0)}.`,
      `Einsetzen in I: y = ${fmt(total, 0)} ${MINUS} ${fmt(x, 0)} = <strong>${fmt(y, 0)}</strong> (und <strong>x = ${fmt(x, 0)}</strong>).`,
      { x, y, total, diff },
    );
  },
};

const exStorySolve: ExerciseGenerator = {
  id: "lg-text-loesen",
  make(rng, level) {
    // Animals with 2 vs 4 legs (chickens + rabbits) or 2 vs 3 wheels
    const x = rng.int(4, 12); // chickens (2 legs)
    const y = rng.int(3, 10); // rabbits (4 legs)
    const heads = x + y;
    const legs = 2 * x + 4 * y;

    return task(
      level,
      `Auf einem Bauernhof zählen Hühner (x, je 2 Beine) und Kaninchen (y, je 4 Beine) zusammen ${fmt(heads, 0)} Köpfe und ${fmt(legs, 0)} Beine. Bestimme die Anzahl y der Kaninchen.`,
      `Ein Fahrrad- und Kettcar-Verleih besitzt zusammen ${fmt(heads, 0)} Fahrzeuge mit insgesamt ${fmt(legs, 0)} Rädern (Fahrräder x haben 2 Räder, Kettcars y haben 4 Räder). Wie viele Fahrräder x und Kettcars y gibt es?`,
      [
        ...(level === 2 ? [intField("Anzahl x =", x)] : []),
        intField("Anzahl y =", y, [
          { value: heads, hint: `Das ist die Gesamtzahl x + y; nutze I: x + y = ${fmt(heads, 0)} und II: 2x + 4y = ${fmt(legs, 0)}.` },
        ]),
      ],
      `I: x + y = ${fmt(heads, 0)} ⇒ x = ${fmt(heads, 0)} ${MINUS} y; setze in II: 2x + 4y = ${fmt(legs, 0)} ein.`,
      `2(${fmt(heads, 0)} ${MINUS} y) + 4y = ${fmt(legs, 0)} ⇒ ${fmt(2 * heads, 0)} + 2y = ${fmt(legs, 0)} ⇒ 2y = ${fmt(legs - 2 * heads, 0)}.`,
      `y = <strong>${fmt(y, 0)}</strong> (und x = ${fmt(heads, 0)} ${MINUS} ${fmt(y, 0)} = <strong>${fmt(x, 0)}</strong>).`,
      { x, y, heads, legs },
    );
  },
};

const exGraphSolution: ExerciseGenerator = {
  id: "lg-graph-schnitt",
  make(rng, level) {
    const x = rng.int(-2, 4);
    const y = rng.int(-2, 4);
    const m1 = rng.pick([1, 2]);
    const m2 = rng.pick([-1, -2]);
    const t1 = y - m1 * x;
    const t2 = y - m2 * x;

    return task(
      level,
      `Löse das Gleichungssystem graphisch bzw. durch Ablesen des Schnittpunkts von I: y = ${linear(m1, t1, 0)} und II: y = ${linear(m2, t2, 0)}.`,
      `Bringe I: ${fmt(m1, 0)}x ${MINUS} y = ${fmt(-t1, 0)} und II: ${fmt(-m2, 0)}x + y = ${fmt(t2, 0)} zuerst auf Geradenform y = m·x + t und bestimme ihren Schnittpunkt S(x | y).`,
      [
        intField("x =", x),
        intField("y =", y),
      ],
      `Setze ${linear(m1, t1, 0)} = ${linear(m2, t2, 0)}.`,
      `${fmt(m1 - m2, 0)}x = ${fmt(t2 - t1, 0)} ⇒ x = ${fmt(x, 0)}.`,
      `y = ${fmt(m1, 0)} · (${fmt(x, 0)})${signed(t1, 0)} = ${fmt(y, 0)} → <strong>S(${fmt(x, 0)} | ${fmt(y, 0)})</strong>.`,
      { x, y, m1, t1, m2, t2 },
    );
  },
};

const exCheckSystemPair: ExerciseGenerator = {
  id: "lg-probe-system",
  make(rng, level) {
    const x = rng.int(1, 5);
    const y = rng.int(1, 5);
    const c1 = 2 * x + y;
    const solvesBoth = level === 1 ? rng.int(0, 1) === 1 : rng.int(0, 1) === 1;
    const c2 = solvesBoth ? 3 * x - y : 3 * x - y + rng.pick([-2, 2, 3]);

    return task(
      level,
      `Prüfe durch Einsetzen, ob das Zahlenpaar (${fmt(x, 0)} | ${fmt(y, 0)}) eine Lösung von I: 2x + y = ${fmt(c1, 0)} und II: 3x − y = ${fmt(c2, 0)} ist.`,
      `Ein Kandidaten-Paar (${fmt(x, 0)} | ${fmt(y, 0)}) erfüllt Gleichung I: 2x + y = ${fmt(c1, 0)}. Prüfe durch Einsetzen in II: 3x − y = ${fmt(c2, 0)}, ob es das gesamte System löst.`,
      [
        intField("Wert von 3x − y", 3 * x - y),
        choiceField(
          "Lösung des Systems?",
          solvesBoth
            ? ["Ja, es erfüllt beide Gleichungen", "Nein, es erfüllt nur I, nicht II"]
            : ["Nein, es erfüllt nur I, nicht II", "Ja, es erfüllt beide Gleichungen"],
          0,
        ),
      ],
      `Ein Zahlenpaar löst das System nur dann, wenn BEIDE Gleichungen wahr werden.`,
      `Probe in I: 2·${fmt(x, 0)} + ${fmt(y, 0)} = ${fmt(c1, 0)} ✓. Probe in II: 3·${fmt(x, 0)} − ${fmt(y, 0)} = ${fmt(3 * x - y, 0)}.`,
      solvesBoth
        ? `Da ${fmt(3 * x - y, 0)} = ${fmt(c2, 0)}: <strong>Ja, Lösung des Systems</strong>.`
        : `Da ${fmt(3 * x - y, 0)} ≠ ${fmt(c2, 0)}: <strong>Nein, erfüllt nur I</strong>.`,
      { x, y, c1, c2 },
    );
  },
};

const exSubstitutionMethod: ExerciseGenerator = {
  id: "lg-einsetzen",
  make(rng, level) {
    const x = rng.int(2, 6);
    const y = rng.int(1, 5);
    const k = rng.pick([2, 3]);
    const c1 = x - k * y; // I: x = k*y + c1
    const a2 = rng.pick([2, 3]);
    const c2 = a2 * x + y; // II: a2*x + y = c2

    return task(
      level,
      `Löse mit dem Einsetzungsverfahren: I: x = ${fmt(k, 0)}y${c1 === 0 ? "" : signed(c1, 0)} und II: ${fmt(a2, 0)}x + y = ${fmt(c2, 0)}.`,
      `Gegeben ist das System I: x − ${fmt(k, 0)}y = ${fmt(c1, 0)} und II: ${fmt(a2, 0)}x + y = ${fmt(c2, 0)}. Löse I nach x auf, setze in II ein und bestimme (x | y).`,
      [
        intField("x =", x),
        intField("y =", y),
      ],
      `Ersetze x in II durch (${fmt(k, 0)}y${c1 === 0 ? "" : signed(c1, 0)}).`,
      `${fmt(a2, 0)}(${fmt(k, 0)}y${c1 === 0 ? "" : signed(c1, 0)}) + y = ${fmt(c2, 0)} ⇒ ${fmt(a2 * k + 1, 0)}y = ${fmt(c2 - a2 * c1, 0)} ⇒ y = ${fmt(y, 0)}.`,
      `Einsetzen in I liefert x = <strong>${fmt(x, 0)}</strong> (und <strong>y = ${fmt(y, 0)}</strong>).`,
      { x, y, k, c1, a2, c2 },
    );
  },
};

const exEqualMethod: ExerciseGenerator = {
  id: "lg-gleichsetzen",
  make(rng, level) {
    const x = rng.int(-3, 5);
    const y = rng.int(-2, 6);
    const m1 = rng.pick([2, 3]);
    const m2 = rng.pick([-1, -2]);
    const t1 = y - m1 * x;
    const t2 = y - m2 * x;

    return task(
      level,
      `Löse mit dem Gleichsetzungsverfahren: I: y = ${linear(m1, t1, 0)} und II: y = ${linear(m2, t2, 0)}.`,
      `Beide Gleichungen beschreiben dieselbe Zielgröße y = ${linear(m1, t1, 0)} und y = ${linear(m2, t2, 0)}. Berechne die eindeutige Lösung (x | y).`,
      [
        intField("x =", x),
        intField("y =", y),
      ],
      `Beide rechten Seiten gleichsetzen: ${linear(m1, t1, 0)} = ${linear(m2, t2, 0)}.`,
      `${fmt(m1 - m2, 0)}x = ${fmt(t2 - t1, 0)} ⇒ x = ${fmt(x, 0)}.`,
      `y = ${fmt(m1, 0)}·(${fmt(x, 0)})${t1 === 0 ? "" : signed(t1, 0)} = <strong>${fmt(y, 0)}</strong> (und <strong>x = ${fmt(x, 0)}</strong>).`,
      { x, y, m1, t1, m2, t2 },
    );
  },
};

const exEliminationMethod: ExerciseGenerator = {
  id: "lg-additionsverfahren",
  make(rng, level) {
    const x = rng.int(1, 5);
    const y = rng.int(1, 5);
    const a1 = rng.pick([2, 3, 4]);
    const a2 = level === 1 ? rng.pick([1, 2]) : rng.pick([2, 3]);
    const b = rng.pick([2, 3]);
    const c1 = a1 * x + b * y;
    const c2 = a2 * x - b * y;

    return task(
      level,
      `Löse geschickt durch Addieren von I und II: I: ${fmt(a1, 0)}x + ${fmt(b, 0)}y = ${fmt(c1, 0)} und II: ${fmt(a2, 0)}x − ${fmt(b, 0)}y = ${fmt(c2, 0)}.`,
      `Bestimme die Lösungsmenge des Systems I: ${fmt(a1, 0)}x + ${fmt(b, 0)}y = ${fmt(c1, 0)} und II: ${fmt(a2, 0)}x − ${fmt(b, 0)}y = ${fmt(c2, 0)} mit dem schnellsten Verfahren.`,
      [
        intField("x =", x),
        intField("y =", y),
      ],
      `Addiere I + II gliedweise, sodass +${fmt(b, 0)}y und −${fmt(b, 0)}y sich aufheben.`,
      `I + II: (${fmt(a1 + a2, 0)})x = ${fmt(c1 + c2, 0)} ⇒ x = ${fmt(x, 0)}.`,
      `Einsetzen in I: ${fmt(a1 * x, 0)} + ${fmt(b, 0)}y = ${fmt(c1, 0)} ⇒ y = <strong>${fmt(y, 0)}</strong> (<strong>x = ${fmt(x, 0)}</strong>).`,
      { x, y, a1, a2, b, c1, c2 },
    );
  },
};

const exChooseMethod: ExerciseGenerator = {
  id: "lg-verfahren-waehlen",
  make(rng, level) {
    const choiceIdx = level === 1 ? rng.int(0, 2) : rng.int(0, 2);
    const prompts = [
      {
        sys: "I: y = 3x − 2  und  II: y = −x + 6",
        best: "Gleichsetzungsverfahren (beide Gleichungen sind schon nach y aufgelöst)",
        w1: "Additionsverfahren",
        w2: "Einsetzungsverfahren nach x",
      },
      {
        sys: "I: x = 4y + 1  und  II: 3x − 5y = 17",
        best: "Einsetzungsverfahren (x steht in I bereits isoliert)",
        w1: "Gleichsetzungsverfahren nach y",
        w2: "Graphisches Schätzen",
      },
      {
        sys: "I: 5x + 3y = 19  und  II: 2x − 3y = 2",
        best: "Additionsverfahren (+3y und −3y heben sich direkt auf)",
        w1: "Gleichsetzungsverfahren nach x",
        w2: "Einsetzungsverfahren nach y",
      },
    ];
    const p = prompts[choiceIdx];

    return task(
      level,
      `Welches Lösungsverfahren ist für das System ${p.sys} besonders effektiv?`,
      `Vergleiche die drei algebraischen Verfahren am System ${p.sys} und begründe die effektivste Wahl.`,
      [choiceField("Effektivstes Verfahren", [p.best, p.w1, p.w2], 0)],
      `Achte darauf, ob Variablen bereits isoliert sind oder entgegengesetzte Koeffizienten vorliegen.`,
      `Das gewählte Verfahren spart Umformungsschritte und vermeidet unnötige Brüche.`,
      `Am effektivsten: <strong>${p.best}</strong>.`,
      { choiceIdx },
    );
  },
};

const exCasesClassify: ExerciseGenerator = {
  id: "lg-fall-erkennen",
  make(rng, level) {
    const kind = level === 1 ? rng.int(0, 2) : rng.int(0, 2);
    const a1 = 2;
    const b1 = -3;
    const c1 = 6;
    const a2 = kind === 2 ? 3 : 4;
    const b2 = kind === 2 ? 1 : -6;
    const c2 = kind === 0 ? 12 : kind === 1 ? 10 : 7;

    const right =
      kind === 0
        ? "unendlich viele Lösungen (identische Geraden)"
        : kind === 1
          ? "keine Lösung L = ∅ (echt parallele Geraden)"
          : "genau eine eindeutige Lösung (schneidende Geraden)";

    const all = [
      "unendlich viele Lösungen (identische Geraden)",
      "keine Lösung L = ∅ (echt parallele Geraden)",
      "genau eine eindeutige Lösung (schneidende Geraden)",
    ];

    return task(
      level,
      `Untersuche die Lösbarkeit des Systems I: ${fmt(a1, 0)}x − ${fmt(-b1, 0)}y = ${fmt(c1, 0)} und II: ${fmt(a2, 0)}x${b2 < 0 ? ` − ${fmt(-b2, 0)}y` : ` + ${fmt(b2, 0)}y`} = ${fmt(c2, 0)}.`,
      `Wie viele Lösungen besitzt das lineare Gleichungssystem I: ${fmt(a1, 0)}x − ${fmt(-b1, 0)}y = ${fmt(c1, 0)} und II: ${fmt(a2, 0)}x${b2 < 0 ? ` − ${fmt(-b2, 0)}y` : ` + ${fmt(b2, 0)}y`} = ${fmt(c2, 0)}?`,
      [choiceField("Lösungsvielfalt", [right, ...all.filter((x) => x !== right)], 0)],
      `Multipliziere I mit 2 (4x − 6y = 12) und vergleiche beide Seiten mit II.`,
      kind === 0
        ? `2 · I ergibt exakt II (0 = 0, identische Geraden).`
        : kind === 1
          ? `2 · I liefert 4x − 6y = 12, aber II sagt 4x − 6y = 10 → Widerspruch 12 = 10.`
          : `Die Koeffizienten links sind nicht proportional → zwei verschiedene Steigungen.`,
      `Ergebnis: <strong>${right}</strong>.`,
      { kind, a1, b1, c1, a2, b2, c2 },
    );
  },
};

const exParamCases: ExerciseGenerator = {
  id: "lg-parameter-fall",
  make(rng, level) {
    const m = rng.pick([2, 3, 4]);
    const wantInfinite = level === 2 && rng.int(0, 1) === 1;
    const c1 = rng.int(3, 7);
    const c2 = wantInfinite ? m * c1 : m * c1 + rng.pick([-2, 2]);
    // System: I: 2x - y = c1; II: 2*m*x - m*y = c2 (wait: want a to be the factor of x in II!)
    const b2 = -m;
    const ansA = 2 * m;

    return task(
      level,
      `Gegeben ist I: 2x − y = ${fmt(c1, 0)} und II: a·x − ${fmt(m, 0)}y = ${fmt(c2, 0)}. Für welchen Wert von a hat das System ${wantInfinite ? "unendlich viele Lösungen" : "keine Lösung"}?`,
      `Für welchen Parameterwert a verlaufen die Geraden zu I: 2x − y = ${fmt(c1, 0)} und II: a·x − ${fmt(m, 0)}y = ${fmt(c2, 0)} parallel (${wantInfinite ? "sogar identisch → ∞ viele Lösungen" : "echt parallel → L = ∅"})?`,
      [
        intField("a =", ansA, [
          { value: m, hint: `Vergleiche die y-Koeffizienten: II entsteht aus I durch Malnehmen mit ${fmt(m, 0)}, also a = ${fmt(m, 0)} · 2.` },
        ]),
      ],
      `Damit beide Geraden dieselbe Steigung haben, muss II aus I durch Vervielfachen der linken Seite mit ${fmt(m, 0)} entstehen.`,
      `${fmt(m, 0)} · (2x − y) = ${fmt(2 * m, 0)}x − ${fmt(m, 0)}y (rechte Seite: ${fmt(m * c1, 0)} ${wantInfinite ? "=" : "≠"} ${fmt(c2, 0)}).`,
      `Daher muss <strong>a = ${fmt(ansA, 0)}</strong> sein.`,
      { m, c1, c2, ansA, b2 },
    );
  },
};

export const STAGE_6_LESSONS = makeLessons([
  {
    id: "lg-1-aufstellen",
    section: "6",
    title: "Sachzusammenhänge als lineares Gleichungssystem",
    subtitle: "Zwei Unbekannte, zwei Bedingungen und sinnvolle Variablennamen",
    whyItMatters: "Immer wenn zwei Größen gleichzeitig unbekannt sind (Preise, Mischungen, Strecken), führen zwei Aussagen sofort zur Lösung.",
    explanationHtml: `<p>Viele Sachaufgaben enthalten <strong>zwei unbekannte Größen</strong> (z. B. x und y) und genau <strong>zwei voneinander unabhängige Bedingungen</strong>. Übersetzt man jede Bedingung in eine lineare Gleichung, entsteht ein <strong>lineares Gleichungssystem (LGS)</strong> aus zwei Gleichungen (I und II).</p>
${CONCEPT_DIAGRAMS.lg1}
<div class="example"><strong>Beispiel Eintrittskarten:</strong> x = Erwachsenenpreis, y = Kinderpreis.<br>• 2 Erwachsene + 3 Kinder zahlen 29 € → <strong>I: 2x + 3y = 29</strong>.<br>• 1 Erwachsener + 2 Kinder zahlen 17 € → <strong>II: x + 2y = 17</strong>.<br>Lösung: x = 7 €, y = 5 € (Probe: 2·7 + 3·5 = 29 ✓ und 7 + 2·5 = 17 ✓).</div>
<div class="merke"><strong>Merke:</strong> Lege immer zuerst fest, wofür x und y mit ihrer Einheit stehen, und formuliere dann zu jedem Satz im Text eine eigene Gleichung.</div>`,
    formulas: [
      { name: "2×2-System", html: "I: a₁x + b₁y = c₁ &nbsp;|&nbsp; II: a₂x + b₂y = c₂", quantities: "gesucht sind Paare (x | y), die beide Gleichungen erfüllen" },
    ],
    quiz: Q(
      "Auf einem Parkplatz stehen x Autos (4 Räder) und y Motorräder (2 Räder), zusammen 25 Fahrzeuge mit 84 Rädern. Wie lautet Gleichung II?",
      "4x + 2y = 84",
      "x + y = 84",
      "2x + 4y = 25",
      "x Autos bringen 4x Räder und y Motorräder bringen 2y Räder; zusammen sind das 84 Räder.",
    ),
    lab: labLgsModeling,
    exercises: [exSystemModel, exStorySolve],
    celebrationMessage: "Du übersetzt Sachsituationen sauber in Gleichungssysteme.",
  },
  {
    id: "lg-2-graphisch",
    section: "6",
    title: "Lineare Gleichungssysteme graphisch lösen",
    subtitle: "Gleichungen nach y umstellen und den Schnittpunkt ablesen",
    whyItMatters: "Das Koordinatensystem macht auf einen Blick sichtbar, warum ein Paar (x | y) gleichzeitig beide Gleichungen erfüllt.",
    explanationHtml: `<p>Jede lineare Gleichung mit zwei Variablen lässt sich (falls der Faktor vor y ≠ 0) nach <strong>y = m · x + t</strong> auflösen und als Gerade im Koordinatensystem zeichnen.</p>
<p>Jeder Punkt auf Gerade I erfüllt Gleichung I, jeder Punkt auf Gerade II erfüllt Gleichung II. Der <strong>Schnittpunkt S(x | y)</strong> liegt auf beiden Geraden zugleich — seine Koordinaten bilden die Lösung!</p>
${CONCEPT_DIAGRAMS.lg2}
<div class="example"><strong>Beispiel:</strong> I: y = x + 1 und II: y = −2x + 7.<br>Zeichnet man beide Geraden, schneiden sie sich genau bei S(2 | 3).<br>Probe: 3 = 2 + 1 ✓ und 3 = −2·2 + 7 = 3 ✓ → L = {(2 | 3)}.</div>
<div class="merke"><strong>Merke:</strong> Graphisches Lösen ist ideal zum Veranschaulichen, liefert bei krummen Lösungen aber nur Näherungswerte — überprüfe dein Ergebnis immer rechnerisch!</div>`,
    formulas: [
      { name: "Graphische Deutung", html: "Lösung (x₀ | y₀) = Schnittpunkt S der Geraden", quantities: "beide Gleichungen nach y = mx + t auflösen und zeichnen" },
    ],
    quiz: Q(
      "Woran erkennt man an zwei gezeichneten Geraden die gemeinsame Lösung des Gleichungssystems?",
      "An den Koordinaten (x | y) ihres Schnittpunkts.",
      "An ihren beiden y-Achsenabschnitten.",
      "An der Summe ihrer beiden Steigungen.",
      "Nur der Schnittpunkt liegt zugleich auf Gerade I und auf Gerade II und erfüllt damit beide Gleichungen.",
    ),
    lab: labLgsGraphical,
    exercises: [exGraphSolution, exCheckSystemPair],
    celebrationMessage: "Du löst Gleichungssysteme graphisch und überprüfst Lösungen per Probe.",
  },
  {
    id: "lg-3-einsetzung",
    section: "6",
    title: "Einsetzungs- und Gleichsetzungsverfahren",
    subtitle: "Algebraische Lösungsalgorithmen und Erhalt der Lösungsmenge",
    whyItMatters: "Rechnerische Verfahren liefern beliebige Bruch- oder Kommalösungen exakt und Schritt für Schritt wie ein Algorithmus.",
    explanationHtml: `<p>Beim <strong>Einsetzungsverfahren</strong> löst man eine Gleichung nach einer Variablen auf (z. B. x = …) und setzt diesen Term in die andere Gleichung ein. Dadurch verschwindet eine Variable, und es bleibt eine lineare Gleichung mit nur noch einer Unbekannten übrig.</p>
<p>Sind beide Gleichungen nach derselben Variablen aufgelöst (z. B. y = …), entsteht der Sonderfall des <strong>Gleichsetzungsverfahrens</strong>. Alle zulässigen Umformungen sind Äquivalenzumformungen — die Lösungsmenge bleibt bei jedem Schritt unverändert!</p>
${CONCEPT_DIAGRAMS.lg3}
<div class="example"><strong>Beispiel:</strong> I: x = 5 − y und II: 2x − y = 4.<br>1. Term für x in II einsetzen: 2·(5 − y) − y = 4 ⇒ 10 − 3y = 4 ⇒ −3y = −6 ⇒ y = 2.<br>2. Rückwärts einsetzen in I: x = 5 − 2 = 3.<br>Lösungsmenge: L = {(3 | 2)}.</div>
<div class="merke"><strong>Merke:</strong> Setze einen gewonnenen Term in der anderen Gleichung immer in Klammern ein, damit Faktoren und Vorzeichen richtig verteilt werden!</div>`,
    formulas: [
      { name: "Einsetzungsalgorithmus", html: "1. Isolieren → 2. Einsetzen → 3. Rückwärts einsetzen", quantities: "erhält die Lösungsmenge in jedem Schritt" },
    ],
    quiz: Q(
      "Du setzt x = 3y − 1 in II: 2x + y = 12 ein. Wie sieht der korrekte nächste Schritt aus?",
      "2·(3y − 1) + y = 12",
      "2·3y − 1 + y = 12",
      "3y − 1 = 12",
      "Der gesamte Ausdruck (3y − 1) ersetzt x und muss deshalb in Klammern mit 2 multipliziert werden.",
    ),
    lab: labLgsSubstitution,
    exercises: [exSubstitutionMethod, exEqualMethod],
    celebrationMessage: "Du wendest Einsetzungs- und Gleichsetzungsverfahren sicher an.",
  },
  {
    id: "lg-4-addition-vergleich",
    section: "6",
    title: "Additionsverfahren und Verfahrensvergleich",
    subtitle: "Das effektivste Verfahren je nach Gleichungsform auswählen",
    whyItMatters: "Die geschickte Verfahrenswahl spart oft die Hälfte der Rechenzeit und verhindert Flüchtigkeitsfehler mit Brüchen.",
    explanationHtml: `<p>Beim <strong>Additionsverfahren</strong> multiplizierst du eine oder beide Gleichungen so mit passenden Zahlen (≠ 0), dass die Koeffizienten einer Variablen entgegengesetzt gleich sind (z. B. +3y und −3y). Durch gliedweises Addieren fällt diese Variable sofort weg.</p>
<p><strong>Verfahrensvergleich:</strong></p>
<ul><li>Beide nach y (oder x) aufgelöst → <strong>Gleichsetzen</strong>.</li><li>Eine Variable hat Koeffizient 1 oder −1 → <strong>Einsetzen</strong>.</li><li>Entgegengesetzte Koeffizienten oder alle Variablen links geordnet → <strong>Addieren</strong>.</li></ul>
${CONCEPT_DIAGRAMS.lg4}
<div class="example"><strong>Beispiel:</strong> I: 2x + y = 7 und II: x − y = 2.<br>I + II addieren (+y − y = 0): 3x = 9 ⇒ x = 3.<br>Einsetzen in II: 3 − y = 2 ⇒ y = 1 → L = {(3 | 1)}.</div>
<div class="merke"><strong>Merke:</strong> Alle drei Verfahren liefern stets exakt dieselbe Lösungsmenge — prüfe das System vor dem Start und wähle das bequemste!</div>`,
    formulas: [
      { name: "Additionsprinzip", html: "(a₁x + b y) + (a₂x − b y) = c₁ + c₂ ⇒ (a₁ + a₂)x = c₁ + c₂", quantities: "b y und −b y heben sich gliedweise auf" },
    ],
    quiz: Q(
      "Welche Strategie löst I: 4x − 5y = 11 und II: 2x + 5y = 1 am schnellsten?",
      "Beide Gleichungen direkt addieren, weil sich −5y und +5y sofort aufheben.",
      "Beide Gleichungen erst mühsam nach x umstellen und gleichsetzen.",
      "Eine halbe Seite lang Wertepaare durchprobieren.",
      "Die gliedweise Addition I + II ergibt direkt 6x = 12 ⇒ x = 2.",
    ),
    lab: labLgsElimination,
    exercises: [exEliminationMethod, exChooseMethod],
    celebrationMessage: "Du wählst und beherrschst das jeweils effektivste Lösungsverfahren.",
  },
  {
    id: "lg-5-loesbarkeit",
    section: "6",
    title: "Lösbarkeit und Lösungsvielfalt",
    subtitle: "Genau eine Lösung, keine Lösung oder unendlich viele Lösungen",
    whyItMatters: "Nicht jedes Gleichungssystem liefert genau einen Schnittpunkt — man muss Widersprüche und identische Geraden sauber deuten.",
    explanationHtml: `<p>Ein lineares 2×2-Gleichungssystem besitzt immer genau einen von drei möglichen Lösungsfällen:</p>
<ul><li><strong>Genau eine eindeutige Lösung:</strong> Die beiden zugehörigen Geraden haben unterschiedliche Steigungen und schneiden sich in genau einem Schnittpunkt S(x | y), also L = {(x | y)}.</li><li><strong>Keine Lösung (L = ∅):</strong> Die Geraden sind echt parallel; rechnerisch entsteht ein Widerspruch (z. B. 0 = 5).</li><li><strong>Unendlich viele Lösungen:</strong> Beide Gleichungen beschreiben dieselbe Gerade (identisch); rechnerisch entsteht eine immer wahre Aussage (z. B. 0 = 0).</li></ul>
${CONCEPT_DIAGRAMS.lg5}
<div class="example"><strong>Beispiel:</strong><br>• I: 2x − y = 4, II: 4x − 2y = 10 → 2·I ergibt 4x − 2y = 8 ≠ 10 → Widerspruch → <strong>L = ∅</strong>.<br>• I: 2x − y = 4, II: 4x − 2y = 8 → II = 2·I → <strong>unendlich viele Lösungen</strong>.</div>
<div class="merke"><strong>Merke:</strong> Ein Widerspruch (0 = 5) bedeutet niemals einen Rechenfehler, sondern echte Parallelität (L = ∅).</div>`,
    formulas: [
      { name: "Drei Lösungsfälle", html: "1 Lösung: Schnitt S &nbsp;|&nbsp; 0 Lösungen: L = ∅ &nbsp;|&nbsp; ∞ viele: identisch", quantities: "geometrische Lage der beiden Geraden" },
    ],
    quiz: Q(
      "Wie interpretiert man es geometrisch, wenn ein lineares 2×2-Gleichungssystem genau eine eindeutige Lösung (x | y) besitzt?",
      "Die beiden zugehörigen Geraden schneiden sich in genau einem Schnittpunkt S(x | y).",
      "Die beiden Geraden sind echt parallel.",
      "Die beiden Geraden fallen vollständig zusammen.",
      "Ein einziges gemeinsames Zahlenpaar bedeutet genau einen gemeinsamen Punkt der beiden Geraden.",
    ),
    lab: labLgsCases,
    exercises: [exCasesClassify, exParamCases],
    celebrationMessage: "Etappe 6 geschafft: Du analysierst und löst lineare Gleichungssysteme komplett!",
  },
]);
