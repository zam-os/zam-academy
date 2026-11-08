/**
 * Lernbereich 2: Zufallsgrößen und Binomialverteilung (22 Std.)
 * 5 Lektionen zu Axiomatik, Zufallsgrößen, Urnenmodellen, Bernoulli-Ketten und Verteilungskenngrößen.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range } from "./builders";
import { numberField } from "./helpers";
import type { Rng } from "../exercises/rng";
import { fmt } from "../exercises/format";
import { binom, bernoulliProb, binomCdf } from "../math/stochastics";

export const STAGE_2_LESSONS: Lesson[] = [
  // 2.1 Axiomatische Definition von Wahrscheinlichkeit (Kolmogorow)
  makeLesson(2, 1, null, {
    id: "g12-stoch-axiomatik",
    title: "Axiomatische Definition der Wahrscheinlichkeit",
    subtitle: "Axiome von Kolmogorow und Vergleich verschiedener Wahrscheinlichkeitsbegriffe",
    whyItMatters:
      "Axiome bilden das logische Fundament moderner Mathematik und ermöglichen fehlerfreie Berechnungen in Risikomanagement und Versicherungsmathematik.",
    explanationHtml: `
      <p>Andrej Kolmogorow begründete 1933 die moderne Wahrscheinlichkeitsrechnung durch drei grundlegende <strong>Axiome</strong> für einen Ereignisraum <i>&Omega;</i>:</p>
      <div class="merke">
        <strong>Die drei Kolmogorow-Axiome:</strong>
        <ol>
          <li><strong>Nichtnegativität:</strong> Für jedes Ereignis <i>A</i> gilt: <i>P(A) &ge; 0</i>.</li>
          <li><strong>Normiertheit:</strong> Für das sichere Ereignis <i>&Omega;</i> gilt: <i>P(&Omega;) = 1</i>.</li>
          <li><strong>Additivität:</strong> Sind <i>A</i> und <i>B</i> unvereinbar (disjunkt, <i>A &cap; B = &empty;</i>), so gilt: <i>P(A &cup; B) = P(A) + P(B)</i>.</li>
        </ol>
        Daraus folgt der allgemeine <strong>Additionssatz</strong>: <i>P(A &cup; B) = P(A) + P(B) − P(A &cap; B)</i> sowie für das Gegenereignis: <i>P(Ā) = 1 − P(A)</i>.
      </div>
      <div class="example">
        <strong>Vergleich der Wahrscheinlichkeitsbegriffe:</strong>
        <ul>
          <li><strong>Klassisch (Laplace):</strong> Symmetrieannahme: <i>P(A) = |A| / |&Omega;|</i> (nur bei gleichwahrscheinlichen Ergebnissen!).</li>
          <li><strong>Frequentistisch:</strong> Grenzwert der relativen Häufigkeit bei langen Versuchsreihen (Gesetz der großen Zahlen).</li>
          <li><strong>Subjektiv:</strong> Grad der persönlichen Überzeugung / Wetteinschätzung.</li>
        </ul>
      </div>
    `,
    formulas: [
      {
        name: "Allgemeiner Additionssatz",
        html: "P(A &cup; B) = P(A) + P(B) − P(A &cap; B)",
        quantities: "A, B beliebige Ereignisse",
      },
      {
        name: "Gegenereignis",
        html: "P(Ā) = 1 − P(A)",
        quantities: "Ā Gegenereignis zu A",
      },
    ],
    quiz: {
      question: "Gegeben sind P(A) = 0,6 und P(B) = 0,5. Können die Ereignisse A und B unvereinbar (disjunkt) sein?",
      options: [
        "Nein, da sonst P(A ∪ B) = 0,6 + 0,5 = 1,1 > 1 wäre, was dem Normierungsaxiom widerspricht.",
        "Ja, beliebige Ereignisse können disjunkt sein.",
        "Das hängt von der Anzahl der Elemente in Ω ab.",
      ],
      correctIndex: 0,
      explanation:
        "Wären A und B disjunkt, müsste P(A ∪ B) = P(A) + P(B) = 1,1 sein. Wahrscheinlichkeiten können jedoch niemals größer als 1 sein (Axiom 2).",
    },
    lab: lab(
      "kolmogorov-axioms",
      "Kolmogorow-Axiome und Venn-Diagramm",
      "Stelle die Wahrscheinlichkeiten P(A), P(B) und den Schnitt P(A ∩ B) ein.",
      [
        range("pA", "P(A) in %", 10, 80, 50, 5),
        range("pB", "P(B) in %", 10, 80, 40, 5),
        range("pSchnitt", "P(A ∩ B) in %", 0, 40, 20, 5),
      ],
      [
        output("vereinigung", "P(A ∪ B)", (v) => {
          const maxSchnitt = Math.min(v.pA, v.pB);
          const actSchnitt = Math.min(v.pSchnitt, maxSchnitt);
          return Math.min(1, Math.max(0, (v.pA + v.pB - actSchnitt) / 100));
        }, "", 2),
      ],
      [
        {
          id: "disjunkt",
          text: "Mache A und B disjunkt (P(A ∩ B) = 0 % bei P(A) + P(B) ≤ 100 %).",
          check: (v) => v.pSchnitt === 0 && (v.pA + v.pB) <= 100,
        },
        {
          id: "vollstaendig",
          text: "Stelle die Parameter so ein, dass P(A ∪ B) = 1,00 ergibt.",
          check: (v) => (v.pA + v.pB - v.pSchnitt) === 100,
        },
        {
          id: "symmetrisch",
          text: "Wähle P(A) = 50 %, P(B) = 50 % und Schnitt 20 %.",
          check: (v) => v.pA === 50 && v.pB === 50 && v.pSchnitt === 20,
        },
      ],
    ),
    exercises: [
      {
        id: "additionssatz-rechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const pA = rng.pick([0.35, 0.4, 0.45, 0.5, 0.55, 0.6]);
          const pB = rng.pick([0.25, 0.3, 0.35, 0.4]);
          const pSchnitt = rng.pick([0.1, 0.15, 0.2]);
          const pUnion = pA + pB - pSchnitt;
          if (level === 1) {
            return {
              prompt: `Gegeben sind P(A) = ${fmt(pA, 2)}, P(B) = ${fmt(pB, 2)} und P(A &cap; B) = ${fmt(pSchnitt, 2)}. Berechne P(A &cup; B).`,
              given: [`P(A) = ${fmt(pA, 2)}`, `P(B) = ${fmt(pB, 2)}`, `P(A ∩ B) = ${fmt(pSchnitt, 2)}`],
              fields: [numberField("P(A ∪ B) =", pUnion, "", 2)],
              formulaHint: "Nutze den allgemeinen Additionssatz: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
              feedbackHint: "Addiere P(A) und P(B) und ziehe die Schnittwahrscheinlichkeit ab.",
              steps: [
                `P(A &cup; B) = ${fmt(pA, 2)} + ${fmt(pB, 2)} − ${fmt(pSchnitt, 2)} = ${fmt(pUnion, 2)}.`,
                `<strong>P(A ∪ B) = ${fmt(pUnion, 2)}</strong>`,
              ],
              meta: { pA, pB, pSchnitt },
            };
          }
          return {
            prompt: `Zwei Alarmsysteme sichern ein Firmengebäude: System A schlägt mit Wahrscheinlichkeit ${fmt(pA, 2)} an, System B mit ${fmt(pB, 2)}, beide gemeinsam mit ${fmt(pSchnitt, 2)}. Wie groß ist die Wahrscheinlichkeit, dass mindestens ein System anschlägt?`,
            given: [`P(A) = ${fmt(pA, 2)}`, `P(B) = ${fmt(pB, 2)}`, `P(A ∩ B) = ${fmt(pSchnitt, 2)}`],
            fields: [numberField("P(mindestens eins) =", pUnion, "", 2)],
            feedbackHint: "Das Ereignis 'mindestens ein System schlägt an' entspricht der Vereinigungsmenge A ∪ B.",
            steps: [
              `P(A &cup; B) = ${fmt(pA, 2)} + ${fmt(pB, 2)} − ${fmt(pSchnitt, 2)} = ${fmt(pUnion, 2)}.`,
              `<strong>P(mindestens ein Alarm) = ${fmt(pUnion, 2)}</strong>`,
            ],
            meta: { pA, pB, pSchnitt },
          };
        },
      },
      {
        id: "gegenereignis-rechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const p = rng.pick([0.05, 0.08, 0.12, 0.15, 0.2, 0.25, 0.35, 0.4]);
          const pGegen = 1 - p;
          if (level === 1) {
            return {
              prompt: `Die Wahrscheinlichkeit für das Eintreten eines Ereignisses E beträgt P(E) = ${fmt(p, 2)}. Bestimme die Wahrscheinlichkeit des Gegenereignisses P(Ē).`,
              given: [`P(E) = ${fmt(p, 2)}`],
              fields: [numberField("P(Ē) =", pGegen, "", 2)],
              formulaHint: "Nutze die Gegenereignis-Regel: P(Ē) = 1 − P(E).",
              feedbackHint: "Subtrahiere die gegebene Wahrscheinlichkeit von 1.",
              steps: [
                `P(Ē) = 1 − ${fmt(p, 2)} = ${fmt(pGegen, 2)}.`,
                `<strong>P(Ē) = ${fmt(pGegen, 2)}</strong>`,
              ],
              meta: { p, pGegen },
            };
          }
          return {
            prompt: `Die Ausfallwahrscheinlichkeit einer Komponente im ersten Betriebsjahr liegt bei ${fmt(p, 2)}. Wie groß ist die Wahrscheinlichkeit, dass sie das Jahr ohne Ausfall übersteht?`,
            given: [`P(Ausfall) = ${fmt(p, 2)}`],
            fields: [numberField("P(kein Ausfall) =", pGegen, "", 2)],
            feedbackHint: "Das fehlerfreie Überstehen ist das Gegenereignis zum Ausfall: P(kein Ausfall) = 1 − P(Ausfall).",
            steps: [
              `P(kein Ausfall) = 1 − ${fmt(p, 2)} = ${fmt(pGegen, 2)}.`,
              `<strong>P(Überstehen) = ${fmt(pGegen, 2)}</strong>`,
            ],
            meta: { p, pGegen },
          };
        },
      },
    ],
  }),

  // 2.2 Zufallsgrößen, Verteilung, Erwartungswert und Varianz
  makeLesson(2, 2, null, {
    id: "g12-stoch-zufallsgroesse-parameter",
    title: "Zufallsgrößen und ihre Kenngrößen",
    subtitle: "Wahrscheinlichkeitsverteilung, Erwartungswert E(X) und Varianz Var(X)",
    whyItMatters:
      "Erwartungswert und Varianz bestimmen, ob ein Glücksspiel fair ist, und quantifizieren das Risiko bei Finanzanlagen.",
    explanationHtml: `
      <p>Eine <strong>Zufallsgröße</strong> <i>X</i> ordnet jedem Ergebnis eines Zufallsexperiments eine reelle Zahl zu. Die Zuordnung <i>x<sub>i</sub> &mapsto; P(X = x<sub>i</sub>)</i> heißt <strong>Wahrscheinlichkeitsverteilung</strong>.</p>
      <div class="merke">
        <strong>Kenngrößen einer diskreten Zufallsgröße:</strong>
        <ul>
          <li><strong>Erwartungswert:</strong> <i>&mu; = E(X) = &sum; x<sub>i</sub> · P(X = x<sub>i</sub>)</i> (gewichteter Durchschnitt). Ein Spiel ist <em>fair</em>, wenn <i>E(Gewinn) = 0</i>.</li>
          <li><strong>Varianz:</strong> <i>Var(X) = &sum; (x<sub>i</sub> − &mu;)² · P(X = x<sub>i</sub>) = E(X²) − (E(X))²</i> (Verschiebungssatz).</li>
          <li><strong>Standardabweichung:</strong> <i>&sigma; = &radic;Var(X)</i> (Streuung um den Erwartungswert).</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Ein Würfelspiel zahlt bei einer 6 genau 6 € aus, sonst nichts. Der Einsatz beträgt 1 €.<br>
        Zufallsgröße Nettogewinn <i>X</i>:<br>
        <i>P(X = 5) = 1/6</i> und <i>P(X = −1) = 5/6</i>.<br>
        <i>E(X) = 5 · (1/6) + (−1) · (5/6) = 5/6 − 5/6 = 0 €</i>. Das Spiel ist fair!
      </div>
    `,
    formulas: [
      {
        name: "Erwartungswert",
        html: "E(X) = &sum; x<sub>i</sub> &middot; P(X = x<sub>i</sub>)",
        quantities: "x_i Werte der Zufallsgröße",
      },
      {
        name: "Varianz",
        html: "Var(X) = E(X²) − [E(X)]²",
        quantities: "Verschiebungssatz der Varianz",
      },
    ],
    quiz: {
      question: "Was bedeutet es, wenn ein Glücksspiel mit Einsatz als 'fair' bezeichnet wird?",
      options: [
        "Der Erwartungswert des Reingewinns (Auszahlung minus Einsatz) ist genau null.",
        "Die Gewinnchance beträgt genau 50 %.",
        "Der Einsatz ist genauso hoch wie der Hauptgewinn.",
      ],
      correctIndex: 0,
      explanation:
        "Ein Spiel ist nach mathematischer Definition fair, wenn der erwartete Reingewinn E(Gewinn − Einsatz) = 0 beträgt.",
    },
    lab: lab(
      "random-variable",
      "Wahrscheinlichkeitsverteilung & Erwartungswert",
      "Verändere die Wahrscheinlichkeiten p_1 und p_2 der Werte x = 1, 2, 3.",
      [
        range("p1", "P(X = 1) in %", 10, 60, 30, 5),
        range("p2", "P(X = 2) in %", 10, 60, 50, 5),
      ],
      [
        output("erwartungswert", "E(X)", (v) => 1 * (v.p1 / 100) + 2 * (v.p2 / 100) + 3 * (Math.max(0, 100 - v.p1 - v.p2) / 100), "", 2),
      ],
      [
        {
          id: "gleichverteilt",
          text: "Wähle P(X=1) = 35 % und P(X=2) = 35 % (annähernde Gleichverteilung).",
          check: (v) => v.p1 === 35 && v.p2 === 35,
        },
        {
          id: "mittelwert-zwei",
          text: "Stelle die Wahrscheinlichkeiten so ein, dass E(X) genau 2,00 beträgt.",
          check: (v) => v.p1 === 30 && v.p2 === 40,
        },
        {
          id: "hoher-erwartungswert",
          text: "Erhöhe P(X=3) durch Wahl von p1 = 10 % und p2 = 20 %.",
          check: (v) => v.p1 === 10 && v.p2 === 20,
        },
      ],
    ),
    exercises: [
      {
        id: "erwartungswert-berechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const g1 = rng.pick([5, 10, 15, 20, 25]);
            const einsatz = rng.pick([2, 3]);
            const p1 = 0.1;
            const eAuszahlung = g1 * p1;
            const eReingewinn = eAuszahlung - einsatz;
            return {
              prompt: `Ein Los kostet ${einsatz} €. Mit 10 % Wahrscheinlichkeit gewinnt man ${g1} €, sonst 0 €. Berechne den erwarteten Reingewinn E(X).`,
              given: [`Einsatz = ${einsatz} €`, `Gewinn = ${g1} € bei p = 0,10`],
              fields: [numberField("E(X) =", eReingewinn, "€", 2)],
              formulaHint: "Erwarteter Reingewinn: E(X) = Auszahlung · P(Gewinn) − Einsatz.",
              feedbackHint: "Ziehe vom Erwartungswert der Auszahlung den Einsatz ab.",
              steps: [
                `E(X) = ${g1} · 0,10 − ${einsatz} = ${fmt(eAuszahlung, 2)} − ${einsatz} = ${fmt(eReingewinn, 2)} €.`,
                `<strong>E(X) = ${fmt(eReingewinn, 2)} €</strong>`,
              ],
              meta: { g1, einsatz, eReingewinn },
            };
          }
          const praemie = rng.pick([2, 3, 4]);
          const schaden = rng.pick([5, 8, 10, 12, 15]);
          const pSchaden = 0.1;
          const deckungsbeitrag = praemie - pSchaden * schaden;
          return {
            prompt: `Eine Versicherung verlangt für eine Police ${praemie} k€ Jahresprämie (Einnahme). Ein Schadensfall von ${schaden} k€ tritt mit Wahrscheinlichkeit 10 % ein (Ausgabe). Berechne den erwarteten Deckungsbeitrag der Versicherung pro Vertrag in k€.`,
            given: [`Prämie = ${praemie} k€`, `Schaden = ${schaden} k€ bei p = 0,10`],
            fields: [numberField("Deckungsbeitrag =", deckungsbeitrag, "k€", 2)],
            feedbackHint: "Aus Sicht der Versicherung: Deckungsbeitrag = Prämie − P(Schaden) · Schadenshöhe.",
            steps: [
              `Erwarteter Deckungsbeitrag = ${praemie} − 0,10 · ${schaden} = ${praemie} − ${fmt(pSchaden * schaden, 2)} = ${fmt(deckungsbeitrag, 2)} k€.`,
              `<strong>Deckungsbeitrag = ${fmt(deckungsbeitrag, 2)} k€</strong>`,
            ],
            meta: { praemie, schaden, deckungsbeitrag },
          };
        },
      },
      {
        id: "varianz-berechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const w = rng.pick([4, 6, 8, 10, 12]);
            const variance = (w * w) / 4;
            return {
              prompt: `Die Zufallsgröße X nimmt die Werte 0 und ${w} jeweils mit Wahrscheinlichkeit 0,5 an. Berechne die Varianz Var(X).`,
              given: [`P(X=0) = 0,5`, `P(X=${w}) = 0,5`],
              fields: [numberField("Var(X) =", variance, "", 2)],
              formulaHint: "Bestimme zuerst den Erwartungswert μ = E(X) und berechne dann Var(X) = ∑ (x_i − μ)² · P(X = x_i).",
              feedbackHint: "Wegen Symmetrie ist μ = w/2. Var(X) = 0,5 · (0 − μ)² + 0,5 · (w − μ)².",
              steps: [
                `μ = 0,5 · 0 + 0,5 · ${w} = ${w / 2}. Var(X) = 0,5 · (−${w / 2})² + 0,5 · (${w / 2})² = ${variance}.`,
                `<strong>Var(X) = ${fmt(variance, 2)}</strong>`,
              ],
              meta: { w, variance },
            };
          }
          const d = rng.pick([2, 4, 6, 8]);
          const variance = 0.5 * d * d;
          return {
            prompt: `Eine symmetrische Zufallsvariable Y nimmt die drei Werte −${d}, 0 und +${d} mit den Wahrscheinlichkeiten 0,25, 0,50 und 0,25 an. Berechne die Varianz Var(Y).`,
            given: [`Werte: −${d} (25 %), 0 (50 %), +${d} (25 %)`],
            fields: [numberField("Var(Y) =", variance, "", 2)],
            feedbackHint: "Da die Verteilung symmetrisch um 0 liegt, ist E(Y) = 0. Dann ist Var(Y) = E(Y²).",
            steps: [
              `E(Y) = 0 &rArr; Var(Y) = 0,25 · (−${d})² + 0,50 · 0² + 0,25 · ${d}² = 0,5 · ${d * d} = ${variance}.`,
              `<strong>Var(Y) = ${fmt(variance, 2)}</strong>`,
            ],
            meta: { d, variance },
          };
        },
      },
    ],
  }),

  // 2.3 Urnenmodelle und Kombinatorik mit Binomialkoeffizienten
  makeLesson(2, 3, null, {
    id: "g12-stoch-urnenmodelle",
    title: "Urnenmodelle und Kombinatorik",
    subtitle: "Ziehen mit und ohne Zurücklegen, Pfadregeln und Binomialkoeffizienten",
    whyItMatters:
      "Stichprobenprüfungen in der Qualitätskontrolle (z. B. TÜV, Chargenprüfung in der Pharmazie) beruhen direkt auf Urnenmodellen.",
    explanationHtml: `
      <p>Viele reale Auswahlprozesse lassen sich auf das Ziehen aus einer Urne mit <i>N</i> Kugeln zurückführen, von denen <i>M</i> markiert (Treffer) sind:</p>
      <div class="merke">
        <strong>Die beiden Grundmodelle bei Stichprobenumfang n:</strong>
        <ul>
          <li><strong>Mit Zurücklegen (Reihenfolge irrelevant &rarr; Binomialverteilung):</strong> Die Trefferwahrscheinlichkeit <i>p = M/N</i> bleibt konstant. Anzahl Möglichkeiten: <i>(<sup>n</sup><sub>k</sub>)</i> Pfade mit je <i>p<sup>k</sup>(1−p)<sup>n−k</sup></i>.</li>
          <li><strong>Ohne Zurücklegen (Hypergeometrische Verteilung):</strong> Die Wahrscheinlichkeit ändert sich mit jedem Zug:
            <br><i>P(X = k) = [(<sup>M</sup><sub>k</sub>) · (<sup>N−M</sup><sub>n−k</sub>)] / (<sup>N</sup><sub>n</sub>)</i>.
          </li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Eine Urne enthält 10 Kugeln, davon 3 rote. Es werden 2 Kugeln ohne Zurücklegen gezogen.<br>
        <i>P(genau 1 rote) = [(<sup>3</sup><sub>1</sub>) · (<sup>7</sup><sub>1</sub>)] / (<sup>10</sup><sub>2</sub>) = (3 · 7) / 45 = 21 / 45 &approx; 0,467</i>.
      </div>
    `,
    formulas: [
      {
        name: "Binomialkoeffizient",
        html: "(<sup>n</sup><sub>k</sub>) = <sup>n!</sup>/<sub>k!(n−k)!</sub>",
        quantities: "Anzahl k-elementiger Teilmengen aus n Elementen",
      },
    ],
    quiz: {
      question: "Wann darf ein Zufallsexperiment als Bernoulli-Kette (Ziehen mit Zurücklegen) angenähert werden, obwohl ohne Zurücklegen gezogen wird?",
      options: [
        "Wenn der Stichprobenumfang n im Vergleich zur Gesamtheit N sehr klein ist (Faustregel: n/N ≤ 0,05).",
        "Nur wenn genau zwei Kugeln gezogen werden.",
        "Niemals, die Formeln sind grundlegend verschieden.",
      ],
      correctIndex: 0,
      explanation:
        "Ist der Auswahlsatz n/N ≤ 5 %, ändern sich die Wahrscheinlichkeiten durch das Entnehmen kaum. Die Binomialverteilung ist dann eine hervorragende Näherung.",
    },
    lab: lab(
      "urn-models",
      "Urnenmodelle: Ziehen mit / ohne Zurücklegen",
      "Wähle Gesamtanzahl n und Stichprobengröße k.",
      [
        range("n", "Kugeln gesamt n", 5, 12, 8, 1),
        range("k", "Gezogene Kugeln k", 1, 4, 2, 1),
        range("withRep", "Modus: 0=Ohne, 1=Mit", 0, 1, 0, 1),
      ],
      [
        output("kombinationen", "Möglichkeiten", (v) => (v.withRep === 1 ? Math.pow(v.n, v.k) : binom(v.n, v.k)), "", 0),
      ],
      [
        {
          id: "ohne-fuenf-zwei",
          text: "Wähle n = 5 und k = 2 ohne Zurücklegen ((5 über 2) = 10).",
          check: (v) => v.n === 5 && v.k === 2 && v.withRep === 0,
        },
        {
          id: "mit-zuruecklegen",
          text: "Schalte auf Ziehen mit Zurücklegen (withRep = 1) bei n = 10 und k = 2.",
          check: (v) => v.n === 10 && v.k === 2 && v.withRep === 1,
        },
        {
          id: "lotto-auswahl",
          text: "Wähle k = 3 aus n = 10 ohne Zurücklegen ((10 über 3) = 120).",
          check: (v) => v.n === 10 && v.k === 3 && v.withRep === 0,
        },
      ],
    ),
    exercises: [
      {
        id: "lotto-kombinationen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([6, 7, 8, 9, 10]);
            const k = rng.pick([2, 3]);
            const res = binom(n, k);
            return {
              prompt: `Berechne den Binomialkoeffizienten (${n} über ${k}).`,
              given: [`n = ${n}`, `k = ${k}`],
              fields: [numberField("Ergebnis =", res, "", 0)],
              formulaHint: `Berechne (${n} über ${k}) = ${n}! / (${k}! · (${n} − ${k})!).`,
              feedbackHint: `Kürze ${n}! gegen (${n - k})!: (${n} über ${k}) = (${Array.from({ length: k }, (_, i) => n - i).join(" · ")}) / (${Array.from({ length: k }, (_, i) => k - i).join(" · ")}).`,
              steps: [
                `(${n} über ${k}) = ${n}! / (${k}! · ${n - k}!) = ${res}.`,
                `<strong>(${n} über ${k}) = ${res}</strong>`,
              ],
              meta: { n, k, res },
            };
          }
          const n = rng.pick([8, 10, 12, 15]);
          const res = binom(n, 2);
          return {
            prompt: `In einer Seminargruppe von n = ${n} Abiturienten begrüßt jeder jeden genau einmal mit einem Händedruck. Wie viele Händedrücke werden insgesamt ausgetauscht?`,
            given: [`n = ${n} Personen`, `Jedes Paar (k = 2) schüttelt sich einmal die Hand`],
            fields: [numberField("Händedrücke =", res, "", 0)],
            feedbackHint: "Jeder Händedruck entspricht der Auswahl einer 2-elementigen Teilmenge aus n Personen: (n über 2) = n · (n − 1) / 2.",
            steps: [
              `Anzahl Händedrücke = (${n} über 2) = (${n} · ${n - 1}) / 2 = ${n * (n - 1)} / 2 = ${res}.`,
              `<strong>Insgesamt ${res} Händedrücke</strong>`,
            ],
            meta: { n, res },
          };
        },
      },
      {
        id: "urne-ohne-zuruecklegen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const total = rng.pick([10, 12, 15]);
          const rot = rng.pick([4, 5, 6]);
          const res = (rot / total) * ((rot - 1) / (total - 1));
          if (level === 1) {
            return {
              prompt: `In einer Urne liegen ${rot} rote und ${total - rot} weiße Kugeln (${total} Kugeln gesamt). Es werden 2 Kugeln ohne Zurücklegen gezogen. Berechne P(beide rot) gerundet auf drei Dezimalen.`,
              given: [`${rot} rote von ${total} Kugeln`, `2 Züge ohne Zurücklegen`],
              fields: [numberField("P =", res, "", 3)],
              formulaHint: `1. Pfadregel: P(rot, rot) = (${rot}/${total}) · (${rot - 1}/${total - 1}).`,
              feedbackHint: `Nach dem ersten roten Zug bleiben nur noch ${rot - 1} rote Kugeln unter den ${total - 1} verbleibenden Kugeln.`,
              steps: [
                `P(beide rot) = (${rot}/${total}) · (${rot - 1}/${total - 1}) = ${rot * (rot - 1)} / ${total * (total - 1)} &approx; ${fmt(res, 3)}.`,
                `<strong>P = ${fmt(res, 3)}</strong>`,
              ],
              meta: { total, rot, res },
            };
          }
          return {
            prompt: `Ein Prüfer entnimmt einer Lieferung von ${total} Sensoren, von denen erfahrungsgemäß genau ${rot} defekt sind, eine Stichprobe von 2 Stück ohne Zurücklegen. Mit welcher Wahrscheinlichkeit sind beide geprüften Sensoren defekt (auf 3 Dezimalen)?`,
            given: [`Gesamtmenge N = ${total}`, `Defekte M = ${rot}`, `Stichprobe n = 2`],
            fields: [numberField("P(beide defekt) =", res, "", 3)],
            feedbackHint: "Hypergeometrische Verteilung bzw. Pfadregel ohne Zurücklegen: P = (M/N) · ((M−1)/(N−1)).",
            steps: [
              `P = (${rot}/${total}) · (${rot - 1}/${total - 1}) = ${rot * (rot - 1)} / ${total * (total - 1)} &approx; ${fmt(res, 3)}.`,
              `<strong>P = ${fmt(res, 3)}</strong>`,
            ],
            meta: { total, rot, res },
          };
        },
      },
    ],
  }),

  // 2.4 Bernoulli-Ketten und Binomialverteilung mit Summenschreibweise
  makeLesson(2, 4, null, {
    id: "g12-stoch-bernoulli-binomial",
    title: "Bernoulli-Ketten und Binomialverteilung",
    subtitle: "Bernoulli-Formel, Histogramme und Summenschreibweise ∑",
    whyItMatters:
      "Bernoulli-Ketten bilden das Standardmodell für wiederholte Ja/Nein-Experimente, von Trefferquoten im Sport bis zu klinischen Medikamententests.",
    explanationHtml: `
      <p>Ein Zufallsexperiment mit genau zwei Ausgängen (Treffer mit Wahrscheinlichkeit <i>p</i>, Niete mit <i>1−p</i>) heißt <strong>Bernoulli-Experiment</strong>. Wird es <i>n</i> Mal unabhängig wiederholt, spricht man von einer <strong>Bernoulli-Kette der Länge n</strong>.</p>
      <div class="merke">
        <strong>Bernoulli-Formel:</strong>
        <p>Die Wahrscheinlichkeit für genau <i>k</i> Treffer bei <i>n</i> Versuchen beträgt:</p>
        <p style="text-align:center;"><i>P(X = k) = B(n; p; k) = (<sup>n</sup><sub>k</sub>) · p<sup>k</sup> · (1 − p)<sup>n−k</sup></i></p>
        <strong>Summenschreibweise für kumulierte Wahrscheinlichkeiten:</strong>
        <ul>
          <li>„Höchstens <i>k</i> Treffer“: <i>P(X &le; k) = &sum;<sub>i=0</sub><sup>k</sup> B(n; p; i)</i></li>
          <li>„Mindestens <i>k</i> Treffer“: <i>P(X &ge; k) = 1 − P(X &le; k−1) = &sum;<sub>i=k</sub><sup>n</sup> B(n; p; i)</i></li>
          <li>„Von <i>a</i> bis <i>b</i> Treffer“: <i>P(a &le; X &le; b) = P(X &le; b) − P(X &le; a−1)</i></li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Ein Basketballer trifft mit <i>p = 0,8</i>. Er wirft <i>n = 5</i> mal.<br>
        <i>P(genau 4 Treffer) = (<sup>5</sup><sub>4</sub>) · 0,8⁴ · 0,2¹ = 5 · 0,4096 · 0,2 = 0,4096 &approx; 41,0 %</i>.
      </div>
    `,
    formulas: [
      {
        name: "Formel von Bernoulli",
        html: "B(n; p; k) = (<sup>n</sup><sub>k</sub>) &middot; p<sup>k</sup> &middot; (1−p)<sup>n−k</sup>",
        quantities: "n Kettenlänge, p Trefferwahrscheinlichkeit, k Trefferanzahl",
      },
      {
        name: "Kumulierte Binomialverteilung",
        html: "P(X &le; k) = &sum;<sub>i=0</sub><sup>k</sup> (<sup>n</sup><sub>i</sub>) p<sup>i</sup> (1−p)<sup>n−i</sup>",
        quantities: "∑ Summenzeichen",
      },
    ],
    quiz: {
      question: "Wie drückt man 'mindestens 3 Treffer' bei n = 10 Versuchen mit dem Gegenereignis aus?",
      options: [
        "P(X ≥ 3) = 1 − P(X ≤ 2)",
        "P(X ≥ 3) = 1 − P(X ≤ 3)",
        "P(X ≥ 3) = P(X ≤ 7)",
      ],
      correctIndex: 0,
      explanation:
        "Das logische Gegenteil von 'mindestens 3' ({3, 4, ..., 10}) ist 'höchstens 2' ({0, 1, 2}). Daher gilt P(X ≥ 3) = 1 − P(X ≤ 2).",
    },
    lab: lab(
      "bernoulli-chain",
      "Binomialverteilung B(n, p, k)",
      "Verändere n, p und die Summationsgrenze k_max.",
      [
        range("n", "Kettenlänge n", 5, 20, 12, 1),
        range("p", "Trefferwahrscheinlichkeit p in %", 10, 90, 30, 5),
        range("kMax", "Summationsgrenze k_max", 0, 10, 3, 1),
      ],
      [
        output("kumuliert", "P(X ≤ k_max)", (v) => binomCdf(v.n, v.p / 100, v.kMax), "", 3),
        output("einzelwert", "P(X = k_max)", (v) => bernoulliProb(v.n, v.p / 100, v.kMax), "", 3),
      ],
      [
        {
          id: "halbe-treffer",
          text: "Wähle n = 10, p = 50 % und k_max = 5 (kumulierte Wahrscheinlichkeit ca. 0,623).",
          check: (v) => v.n === 10 && v.p === 50 && v.kMax === 5,
        },
        {
          id: "hohe-trefferquote",
          text: "Stelle n = 10, p = 80 % und k_max = 8 ein.",
          check: (v) => v.n === 10 && v.p === 80 && v.kMax === 8,
        },
        {
          id: "standard-kette",
          text: "Setze n = 10, p = 40 % und k_max = 4 zurück.",
          check: (v) => v.n === 10 && v.p === 40 && v.kMax === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "bernoulli-einzel",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([4, 5, 6]);
            const k = rng.pick([1, 2]);
            const p = rng.pick([0.2, 0.4, 0.5]);
            const prob = bernoulliProb(n, p, k);
            return {
              prompt: `Ein Bernoulli-Experiment mit Trefferwahrscheinlichkeit p = ${fmt(p, 1)} wird n = ${n} Mal wiederholt. Berechne die Wahrscheinlichkeit für genau k = ${k} Treffer gerundet auf drei Dezimalen.`,
              given: [`n = ${n}`, `p = ${fmt(p, 1)}`, `k = ${k}`],
              fields: [numberField(`P(X = ${k}) =`, prob, "", 3)],
              formulaHint: `Bernoulli-Formel: P(X = ${k}) = (${n} über ${k}) · ${fmt(p, 1)}^${k} · ${fmt(1 - p, 1)}^${n - k}.`,
              feedbackHint: `Berechne den Binomialkoeffizienten (${n} über ${k}) und multipliziere mit ${fmt(p, 1)}^${k} · ${fmt(1 - p, 1)}^${n - k}.`,
              steps: [
                `P(X = ${k}) = (${n} über ${k}) · (${fmt(p, 1)})^${k} · (${fmt(1 - p, 1)})^${n - k} = ${binom(n, k)} · ${fmt(Math.pow(p, k), 4)} · ${fmt(Math.pow(1 - p, n - k), 4)} &approx; ${fmt(prob, 3)}.`,
                `<strong>P(X = ${k}) = ${fmt(prob, 3)}</strong>`,
              ],
              meta: { n, k, p, prob },
            };
          }
          const n = rng.pick([4, 5, 6]);
          const k = rng.pick([2, 3]);
          const p = 0.25;
          const prob = bernoulliProb(n, p, k);
          return {
            prompt: `Ein Prüfling rät bei einem Multiple-Choice-Test mit ${n} Fragen (jeweils 4 Antwortoptionen, genau eine ist richtig, also p = 0,25) völlig zufällig. Wie groß ist die Wahrscheinlichkeit für genau ${k} richtige Antworten (auf drei Dezimalen gerundet)?`,
            given: [`n = ${n} Fragen`, `p = 0,25 (Raten bei 4 Optionen)`, `k = ${k} Treffer`],
            fields: [numberField(`P(X = ${k}) =`, prob, "", 3)],
            feedbackHint: `Modelliere als Bernoulli-Kette B(${n}; 0,25): P(X = ${k}) = (${n} über ${k}) · 0,25^${k} · 0,75^${n - k}.`,
            steps: [
              `P(X = ${k}) = (${n} über ${k}) · 0,25^${k} · 0,75^${n - k} = ${binom(n, k)} · ${fmt(Math.pow(0.25, k), 5)} · ${fmt(Math.pow(0.75, n - k), 5)} &approx; ${fmt(prob, 3)}.`,
              `<strong>P(X = ${k}) = ${fmt(prob, 3)}</strong>`,
            ],
            meta: { n, k, p, prob },
          };
        },
      },
      {
        id: "bernoulli-gegenereignis",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([3, 4, 5]);
            const p = rng.pick([0.1, 0.2, 0.3]);
            const q = 1 - p;
            const res = 1 - Math.pow(q, n);
            return {
              prompt: `Die Trefferwahrscheinlichkeit beträgt p = ${fmt(p, 1)}. Berechne bei n = ${n} unabhängigen Versuchen die Wahrscheinlichkeit P(mindestens 1 Treffer) gerundet auf drei Dezimalen.`,
              given: [`n = ${n}`, `p = ${fmt(p, 1)}`],
              fields: [numberField("P(X ≥ 1) =", res, "", 3)],
              formulaHint: `Gegenereignis: P(X ≥ 1) = 1 − P(X = 0) = 1 − (1 − p)^n.`,
              feedbackHint: `Berechne zuerst P(kein Treffer) = (1 − ${fmt(p, 1)})^${n} = ${fmt(q, 1)}^${n} und ziehe dies von 1 ab.`,
              steps: [
                `P(X ≥ 1) = 1 − (${fmt(q, 1)})^${n} = 1 − ${fmt(Math.pow(q, n), 4)} &approx; ${fmt(res, 3)}.`,
                `<strong>P(X ≥ 1) = ${fmt(res, 3)}</strong>`,
              ],
              meta: { n, p, res },
            };
          }
          const n = rng.pick([3, 4, 5]);
          const p = rng.pick([0.2, 0.3, 0.4]);
          const q = 1 - p;
          const res = 1 - Math.pow(q, n);
          return {
            prompt: `Ein Frühwarnsystem überwacht eine Anlage mit n = ${n} unabhängig voneinander arbeitenden Detektoren. Jeder Sensor erkennt eine Anomalie mit Wahrscheinlichkeit p = ${fmt(p, 1)}. Mit welcher Wahrscheinlichkeit schlägt bei einer Anomalie mindestens ein Sensor Alarm (auf 3 Dezimalen)?`,
            given: [`n = ${n} Sensoren`, `Zuverlässigkeit p = ${fmt(p, 1)} pro Sensor`],
            fields: [numberField("P(Alarm) =", res, "", 3)],
            feedbackHint: "Das Ereignis 'mindestens ein Sensor schlägt Alarm' ist das Gegenereignis zu 'alle Sensoren versagen': P = 1 − (1 − p)^n.",
            steps: [
              `P(Alarm) = 1 − P(alle versagen) = 1 − (${fmt(q, 1)})^${n} = 1 − ${fmt(Math.pow(q, n), 4)} &approx; ${fmt(res, 3)}.`,
              `<strong>P(Alarm) = ${fmt(res, 3)}</strong>`,
            ],
            meta: { n, p, res },
          };
        },
      },
    ],
  }),

  // 2.5 Kenngrößen binomialverteilter Zufallsgrößen (μ und σ)
  makeLesson(2, 5, null, {
    id: "g12-stoch-binomial-parameter",
    title: "Kenngrößen und Form der Binomialverteilung",
    subtitle: "Erwartungswert μ = n·p, Standardabweichung σ = √(n·p·(1−p)) und Glockenform",
    whyItMatters:
      "Bei großen Stichproben nähert sich die diskrete Binomialverteilung einer glockenförmigen Kurve an (Satz von Moivre-Laplace). Die Sigma-Regeln ermöglichen schnelle Konfidenzintervalle.",
    explanationHtml: `
      <p>Für eine binomialverteilte Zufallsgröße <i>X &sim; B(n; p)</i> lassen sich Erwartungswert und Streuung direkt aus den Parametern <i>n</i> und <i>p</i> berechnen:</p>
      <div class="merke">
        <strong>Formeln für B(n; p):</strong>
        <ul>
          <li><strong>Erwartungswert:</strong> <i>&mu; = n · p</i></li>
          <li><strong>Varianz:</strong> <i>Var(X) = n · p · (1 − p)</i></li>
          <li><strong>Standardabweichung:</strong> <i>&sigma; = &radic;[n · p · (1 − p)]</i></li>
        </ul>
        <strong>Einfluss der Parameter auf das Histogramm:</strong>
        <ul>
          <li>Mit wachsendem <i>n</i> wird das Histogramm symmetrischer und glockenförmig.</li>
          <li>Für <i>p = 0,5</i> ist das Histogramm immer exakt symmetrisch um <i>&mu;</i>.</li>
          <li>Für <i>p &lt; 0,5</i> ist es rechtsschief, für <i>p &gt; 0,5</i> linksschief.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Bei <i>n = 100</i> Münzwürfen (<i>p = 0,5</i>):<br>
        <i>&mu; = 100 · 0,5 = 50</i> Treffer.<br>
        <i>&sigma; = &radic;(100 · 0,5 · 0,5) = &radic;25 = 5</i>.<br>
        Im 1-Sigma-Intervall <i>[&mu; − &sigma;; &mu; + &sigma;] = [45; 55]</i> liegen rund 68 % aller Versuchsergebnisse (exakte diskrete Binomialsumme ca. 72,9 %; die 68,3 % stammen aus der Normalverteilungs-Näherung).
      </div>
    `,
    formulas: [
      {
        name: "Erwartungswert der Binomialverteilung",
        html: "&mu; = n &middot; p",
        quantities: "n Kettenlänge, p Trefferwahrscheinlichkeit",
      },
      {
        name: "Standardabweichung der Binomialverteilung",
        html: "&sigma; = &radic;(n &middot; p &middot; (1−p))",
        quantities: "1−p Gegenwahrscheinlichkeit",
      },
    ],
    quiz: {
      question: "Wie verändern sich Erwartungswert μ und Standardabweichung σ, wenn die Kettenlänge n vervierfacht wird (bei gleichem p)?",
      options: [
        "μ vervierfacht sich, σ verdoppelt sich (da √4 = 2).",
        "Beide vervierfachen sich.",
        "μ verdoppelt sich, σ bleibt gleich.",
      ],
      correctIndex: 0,
      explanation:
        "Da μ proportional zu n ist, vervierfacht sich μ. Die Standardabweichung enthält die Wurzel aus n: √(4n) = 2√n, sie verdoppelt sich.",
    },
    lab: lab(
      "binomial-params",
      "Parameter μ und σ der Binomialverteilung",
      "Verändere n und p und beobachte Lage und Breite der Verteilung.",
      [
        range("n", "Kettenlänge n", 10, 50, 25, 5),
        range("p", "Wahrscheinlichkeit p in %", 10, 90, 40, 5),
      ],
      [
        output("mu", "Erwartungswert μ", (v) => v.n * (v.p / 100), "", 1),
        output("sigma", "Standardabweichung σ", (v) => Math.sqrt(v.n * (v.p / 100) * (1 - v.p / 100)), "", 2),
      ],
      [
        {
          id: "mu-zehn",
          text: "Wähle n = 20 und p = 50 % (μ = 10).",
          check: (v) => v.n === 20 && v.p === 50,
        },
        {
          id: "grosse-kette",
          text: "Erhöhe auf n = 40 bei p = 50 % (μ = 20, σ ≈ 3,16).",
          check: (v) => v.n === 40 && v.p === 50,
        },
        {
          id: "asymmetrisch",
          text: "Stelle eine schiefe Verteilung mit p = 20 % und n = 30 ein.",
          check: (v) => v.n === 30 && v.p === 20,
        },
      ],
    ),
    exercises: [
      {
        id: "mu-sigma-ausrechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([64, 100, 400]);
            const p = 0.5;
            const mu = n * p;
            const sigma = Math.sqrt(n * p * (1 - p));
            return {
              prompt: `Berechne den Erwartungswert μ und die Standardabweichung σ für eine binomialverteilte Zufallsgröße X ~ B(${n}; 0,5).`,
              given: [`n = ${n}`, `p = 0,5`],
              fields: [
                numberField("μ =", mu, "", 0),
                numberField("σ =", sigma, "", 1),
              ],
              formulaHint: "Erwartungswert μ = n · p, Standardabweichung σ = √(n · p · (1 − p)).",
              feedbackHint: `Multipliziere ${n} mit 0,5 für μ. Für σ ziehe die Wurzel aus ${n} · 0,5 · 0,5 = ${n / 4}.`,
              steps: [
                `μ = ${n} · 0,5 = ${mu}.`,
                `σ = &radic;(${n} · 0,5 · 0,5) = &radic;${n / 4} = ${sigma}.`,
                `<strong>μ = ${mu}, σ = ${fmt(sigma, 1)}</strong>`,
              ],
              meta: { n, p, mu, sigma },
            };
          }
          const n = rng.pick([36, 144, 225, 400]);
          const p = rng.pick([0.2, 0.25]);
          const mu = n * p;
          const sigma = Math.sqrt(n * p * (1 - p));
          return {
            prompt: `Ein Pharmahersteller testet ein neues Prüfverfahren an n = ${n} Proben. Die Fehlerquote beträgt p = ${fmt(p, 2)}. Bestimme den Erwartungswert μ und die Standardabweichung σ für die Anzahl der fehlerhaften Proben (gerundet auf 2 Dezimalen).`,
            given: [`Stichprobenumfang n = ${n}`, `Fehlerquote p = ${fmt(p, 2)}`],
            fields: [
              numberField("μ =", mu, "", 1),
              numberField("σ =", sigma, "", 2),
            ],
            feedbackHint: "Setze in die Kenngrößen-Formeln der Binomialverteilung ein: μ = n · p und σ = √(n · p · (1 − p)).",
            steps: [
              `μ = ${n} · ${fmt(p, 2)} = ${fmt(mu, 1)}.`,
              `σ = &radic;(${n} · ${fmt(p, 2)} · ${fmt(1 - p, 2)}) = &radic;${fmt(n * p * (1 - p), 2)} &approx; ${fmt(sigma, 2)}.`,
              `<strong>μ = ${fmt(mu, 1)}, σ = ${fmt(sigma, 2)}</strong>`,
            ],
            meta: { n, p, mu, sigma },
          };
        },
      },
      {
        id: "sigma-intervall",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([100, 400]);
            const p = 0.2;
            const mu = n * p;
            const sigma = Math.sqrt(n * p * 0.8);
            const lower = mu - 2 * sigma;
            const upper = mu + 2 * sigma;
            return {
              prompt: `Für eine Zufallsgröße X ~ B(${n}; 0,2) gilt μ = ${mu} und σ = ${fmt(sigma, 1)}. Berechne die Grenzen des 2-Sigma-Intervalls [μ − 2σ; μ + 2σ].`,
              given: [`μ = ${mu}`, `σ = ${fmt(sigma, 1)}`],
              fields: [
                numberField("untere Grenze =", lower, "", 1),
                numberField("obere Grenze =", upper, "", 1),
              ],
              formulaHint: "2-Sigma-Intervall: Untere Grenze = μ − 2σ, Obere Grenze = μ + 2σ.",
              feedbackHint: `Ziehe 2 · ${fmt(sigma, 1)} von ${mu} ab und addiere 2 · ${fmt(sigma, 1)} zu ${mu}.`,
              steps: [
                `Untere Grenze: ${mu} − 2 · ${fmt(sigma, 1)} = ${mu} − ${fmt(2 * sigma, 1)} = ${fmt(lower, 1)}.`,
                `Obere Grenze: ${mu} + 2 · ${fmt(sigma, 1)} = ${mu} + ${fmt(2 * sigma, 1)} = ${fmt(upper, 1)}.`,
                `<strong>[${fmt(lower, 1)}; ${fmt(upper, 1)}]</strong>`,
              ],
              meta: { n, p, mu, sigma, lower, upper },
            };
          }
          const n = rng.pick([100, 400]);
          const p = 0.25;
          const mu = n * p;
          const sigma = Math.sqrt(n * p * 0.75);
          const kSigma = rng.pick([1, 2]);
          const lower = mu - kSigma * sigma;
          const upper = mu + kSigma * sigma;
          return {
            prompt: `In einer Fertigungshalle werden n = ${n} Werkstücke produziert mit einer Ausschussquote von p = 0,25 (μ = ${mu}, σ &approx; ${fmt(sigma, 2)}). Gib das ${kSigma}-Sigma-Intervall [μ − ${kSigma}σ; μ + ${kSigma}σ] an (auf zwei Dezimalen gerundet).`,
            given: [`n = ${n}`, `p = 0,25`, `μ = ${mu}`, `σ = ${fmt(sigma, 2)}`],
            fields: [
              numberField("untere Grenze =", lower, "", 2),
              numberField("obere Grenze =", upper, "", 2),
            ],
            feedbackHint: `Berechne ${mu} − ${kSigma} · ${fmt(sigma, 2)} und ${mu} + ${kSigma} · ${fmt(sigma, 2)}.`,
            steps: [
              `Untere Grenze: ${mu} − ${kSigma} · ${fmt(sigma, 2)} &approx; ${fmt(lower, 2)}.`,
              `Obere Grenze: ${mu} + ${kSigma} · ${fmt(sigma, 2)} &approx; ${fmt(upper, 2)}.`,
              `<strong>[${fmt(lower, 2)}; ${fmt(upper, 2)}]</strong>`,
            ],
            meta: { n, p, mu, sigma, kSigma, lower, upper },
          };
        },
      },
    ],
  }),
];
