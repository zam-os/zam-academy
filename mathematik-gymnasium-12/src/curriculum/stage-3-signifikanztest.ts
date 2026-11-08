/**
 * Lernbereich 3: Einseitiger Signifikanztest (bei als binomialverteilt angenommenen Merkmalen) (8 Std.)
 * 4 Lektionen zu Hypothesenwahl, Fehlerarten (Alpha/Beta), Ablehnungsbereich und Interpretation.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range, task } from "./builders";
import { numberField, choiceField } from "./helpers";
import type { Rng } from "../exercises/rng";
import { fmt } from "../exercises/format";
import { binomCdf, rightSidedCriticalValue } from "../math/stochastics";

export const STAGE_3_LESSONS: Lesson[] = [
  // 3.1 Grundsätzliches Vorgehen und Wahl der Nullhypothese
  makeLesson(3, 1, null, {
    id: "g12-hypo-grundprinzip",
    title: "Grundsätzliches Vorgehen beim Signifikanztest",
    subtitle: "Zielsetzung des Tests, Wahl der Nullhypothese und Testrichtung",
    whyItMatters:
      "Statistische Tests schützen vor teuren Fehlentscheidungen, etwa bei der Zulassung neuer Medikamente oder der Qualitätsabnahme von Industriechargen.",
    explanationHtml: `
      <p>Ein <strong>statistischer Hypothesentest</strong> schließt von einer beobachteten Stichprobe auf die unbekannte Grundgesamtheit. Während die Wahrscheinlichkeitsrechnung aus bekannten Parametern Ereignisse berechnet, geht die <strong>beurteilende Statistik</strong> den umgekehrten Weg.</p>
      <div class="merke">
        <strong>Wahl der Nullhypothese H<sub>0</sub>:</strong>
        <ul>
          <li>Die <strong>Nullhypothese H<sub>0</sub></strong> ist diejenige Aussage, die man mit dem Test widerlegen möchte, um eine Innovation oder Vermutung statistisch abzusichern (<strong>Gegenhypothese H<sub>1</sub></strong>).</li>
          <li>Man wählt <i>H<sub>0</sub></i> so, dass ein irrtümliches Ablehnen (Fehler 1. Art) der gravierendere Fehler ist, der durch ein vorgegebenes <strong>Signifikanzniveau &alpha;</strong> strikt kontrolliert wird.</li>
          <li><strong>Rechtsseitiger Test:</strong> Behauptung „Trefferquote ist gestiegen“ &rArr; <i>H<sub>0</sub>: p &le; p<sub>0</sub></i> vs. <i>H<sub>1</sub>: p &gt; p<sub>0</sub></i>.</li>
          <li><strong>Linksseitiger Test:</strong> Behauptung „Ausschussquote ist gesunken“ &rArr; <i>H<sub>0</sub>: p &ge; p<sub>0</sub></i> vs. <i>H<sub>1</sub>: p &lt; p<sub>0</sub></i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Ein Hersteller behauptet, dass sein neuer Akku zu mindestens 90 % die volle Kapazität hält.<br>
        Ein Verbrauchermagazin will diese Werbeaussage überprüfen. Der Verdacht lautet: Die Quote ist in Wahrheit geringer als 90 %.<br>
        &rArr; Gegenhypothese: <i>H<sub>1</sub>: p &lt; 0,90</i>.<br>
        &rArr; Nullhypothese: <i>H<sub>0</sub>: p &ge; 0,90</i> (Linksseitiger Test).
      </div>
    `,
    formulas: [
      {
        name: "Hypothesenpaar rechtsseitig",
        html: "H<sub>0</sub>: p &le; p<sub>0</sub> &emsp; vs. &emsp; H<sub>1</sub>: p &gt; p<sub>0</sub>",
        quantities: "p_0 Basistrefferquote",
      },
      {
        name: "Hypothesenpaar linksseitig",
        html: "H<sub>0</sub>: p &ge; p<sub>0</sub> &emsp; vs. &emsp; H<sub>1</sub>: p &lt; p<sub>0</sub>",
        quantities: "Ablehnung von H_0 bei zu wenigen Treffern",
      },
    ],
    quiz: {
      question: "Ein Pharmaunternehmen will nachweisen, dass ein neues Medikament wirksamer ist als das bisherige Standardpräparat (Wirksamkeit 70 %). Wie lautet die Nullhypothese H_0?",
      options: [
        "H_0: p ≤ 0,70 (das neue Medikament ist höchstens so wirksam wie das alte).",
        "H_0: p > 0,70 (das neue Medikament ist wirksamer).",
        "H_0: p = 0,50 (reiner Zufall).",
      ],
      correctIndex: 0,
      explanation:
        "Die zu beweisende Neuerung kommt in die Gegenhypothese H_1: p > 0,70. Die Nullhypothese H_0: p ≤ 0,70 steht für den konservativen Status quo, der geschützt werden soll.",
    },
    lab: lab(
      "hypothesis-setup",
      "Entscheidungsraum des Tests",
      "Wähle Testrichtung (rechts- oder linksseitig) und Basiseigenschaft p_0.",
      [
        range("p0", "Basiswahrscheinlichkeit p_0 in %", 20, 95, 60, 5),
        range("isRight", "Richtung: 0=links, 1=rechts", 0, 1, 1, 1),
      ],
      [
        output("testtyp", "Testtyp", (v) => (v.isRight === 1 ? "Rechtsseitig" : "Linksseitig")),
      ],
      [
        {
          id: "rechtsseitig",
          text: "Wähle einen rechtsseitigen Test (isRight = 1) mit p_0 = 50 %.",
          check: (v) => v.isRight === 1 && v.p0 === 50,
        },
        {
          id: "linksseitig",
          text: "Schalte auf linksseitigen Test um (isRight = 0) mit p_0 = 80 %.",
          check: (v) => v.isRight === 0 && v.p0 === 80,
        },
        {
          id: "qualitaetskontrolle",
          text: "Stelle einen linksseitigen Test mit p_0 = 90 % ein.",
          check: (v) => v.isRight === 0 && v.p0 === 90,
        },
      ],
    ),
    exercises: [
      {
        id: "nullhypothese-aufstellen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const pPercent = rng.pick([20, 30, 40]);
          return task(
            level,
            `Ein Werbemanager vermutet, dass die Klickrate durch ein neues Design von bisher ${pPercent} % gestiegen ist. Welche Nullhypothese H<sub>0</sub> muss getestet werden?`,
            `Eine Fluggesellschaft möchte belegen, dass die Pünktlichkeitsquote durch neue Abläufe über den bisherigen Wert von ${pPercent} % gestiegen ist. Formuliere H<sub>0</sub>.`,
            [
              choiceField(
                "H_0 lautet:",
                [`p ≤ ${pPercent / 100}`, `p > ${pPercent / 100}`, `p = 0,5`],
                0,
              ),
            ],
            "Die Vermutung 'gestiegen' ist H_1: p > p_0. Folglich ist H_0: p ≤ p_0.",
            `H_0: p &le; ${pPercent / 100} (Gegenhypothese H_1: p &gt; ${pPercent / 100}, rechtsseitiger Test).`,
            `H_0: p ≤ ${pPercent / 100}`,
            { pPercent },
          );
        },
      },
      {
        id: "testrichtung-bestimmen",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          return task(
            level,
            "Eine Maschinenfabrik will prüfen, ob die Fehlerquote (bisher 5 %) durch eine Justierung gesunken ist. Welcher Testtyp liegt vor?",
            "In einer stichprobenartigen Umweltmessung soll nachgewiesen werden, dass der Schadstoffgrenzwert unterschritten wird. Welcher Testtyp ist zu wählen?",
            [
              choiceField(
                "Testrichtung:",
                ["Linksseitiger Test", "Rechtsseitiger Test", "Zweiseitiger Test"],
                0,
              ),
            ],
            "Da eine Senkung (p < p_0) nachgewiesen werden soll, führt eine zu kleine Trefferzahl zur Ablehnung von H_0.",
            "Da eine Verringerung (p < 0,05) belegt werden soll, liegt ein linksseitiger Test vor.",
            "Linksseitiger Test",
          );
        },
      },
    ],
  }),

  // 3.2 Fehler 1. Art (Alpha) und Fehler 2. Art (Beta)
  makeLesson(3, 2, null, {
    id: "g12-hypo-fehlerarten",
    title: "Fehler 1. Art und Fehler 2. Art",
    subtitle: "Irrtumswahrscheinlichkeiten α und β und ihre graphische Bedeutung",
    whyItMatters:
      "Bei jedem Test können zwei Arten von Fehlern auftreten. Die Balance zwischen falschem Alarm (Alpha) und übersehener Wirkung (Beta) steuert klinische Studien.",
    explanationHtml: `
      <p>Da eine Entscheidung auf einer Zufallsstichprobe beruht, ist absolute Sicherheit unmöglich. Es gibt genau zwei Fehlentscheidungen:</p>
      <div class="merke">
        <strong>Die beiden Fehlerarten:</strong>
        <table class="lab-table" style="margin:10px auto; border-collapse:collapse;">
          <tr><th></th><th>H<sub>0</sub> ist wahr</th><th>H<sub>0</sub> ist falsch (H<sub>1</sub> wahr)</th></tr>
          <tr><td><strong>H<sub>0</sub> ablehnen (X &isin; A)</strong></td><td style="color:var(--accent);"><strong>Fehler 1. Art (&alpha;)</strong><br>„Falscher Alarm“</td><td>Richtige Entscheidung</td></tr>
          <tr><td><strong>H<sub>0</sub> annehmen (X &notin; A)</strong></td><td>Richtige Entscheidung</td><td style="color:#2563eb;"><strong>Fehler 2. Art (&beta;)</strong><br>„Entdeckung verpasst“</td></tr>
        </table>
        <ul>
          <li><strong>Fehler 1. Art:</strong> <i>H<sub>0</sub></i> wird irrtümlich abgelehnt, obwohl sie wahr ist: <i>P<sub>H0</sub>(X &isin; A) &le; &alpha;</i>.</li>
          <li><strong>Fehler 2. Art:</strong> <i>H<sub>0</sub></i> wird beibehalten, obwohl eine alternative Wahrscheinlichkeit <i>p<sub>1</sub></i> gilt: <i>P<sub>p1</sub>(X &notin; A) = &beta;</i>.</li>
          <li>Wird die Hürde für <i>&alpha;</i> strenger gewählt (kleineres <i>&alpha;</i>), so vergrößert sich zwangsläufig das Risiko <i>&beta;</i> (bei gleichem Stichprobenumfang <i>n</i>)!</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Ein rechtsseitiger Test mit <i>n = 20</i>, <i>p<sub>0</sub> = 0,5</i> hat den Ablehnungsbereich <i>A = {15, ..., 20}</i>.<br>
        <i>P(Fehler 1. Art) = P<sub>0,5</sub>(X &ge; 15) = 1 − P(X &le; 14) &approx; 0,0207 = 2,07 %</i>.<br>
        Gilt in Wirklichkeit <i>p<sub>1</sub> = 0,75</i>:<br>
        <i>P(Fehler 2. Art) = P<sub>0,75</sub>(X &le; 14) &approx; 0,3828 = 38,3 %</i>.
      </div>
    `,
    formulas: [
      {
        name: "Fehler 1. Art (Alpha-Fehler)",
        html: "&alpha;<sub>tatsächlich</sub> = P<sub>p0</sub>(X &isin; A) &le; &alpha;",
        quantities: "A Ablehnungsbereich, p_0 Grenzwert der Nullhypothese",
      },
      {
        name: "Fehler 2. Art (Beta-Fehler)",
        html: "&beta; = P<sub>p1</sub>(X &notin; A)",
        quantities: "p_1 konkrete Gegenwahrscheinlichkeit",
      },
    ],
    quiz: {
      question: "Was versteht man unter dem Fehler 1. Art bei einem Hypothesentest?",
      options: [
        "Die Nullhypothese H_0 wird fälschlicherweise abgelehnt, obwohl sie in Wahrheit zutrifft.",
        "Die Gegenhypothese H_1 wird fälschlicherweise abgelehnt.",
        "Die Stichprobengröße n wurde falsch berechnet.",
      ],
      correctIndex: 0,
      explanation:
        "Der Fehler 1. Art (auch Alpha-Fehler oder Irrtumswahrscheinlichkeit genannt) bezeichnet die Ablehnung einer in Wirklichkeit wahren Nullhypothese H_0.",
    },
    lab: lab(
      "error-visualizer",
      "Fehler 1. und 2. Art bei n = 20",
      "Verschiebe den kritischen Schwellenwert c für den Ablehnungsbereich A = {c, ..., 20}.",
      [range("c", "Kritischer Wert c", 11, 18, 13, 1)],
      [
        output("alpha", "Fehler 1. Art (α)", (v) => 1 - binomCdf(20, 0.5, v.c - 1), "", 3),
        output("beta", "Fehler 2. Art (β bei p=0,75)", (v) => binomCdf(20, 0.75, v.c - 1), "", 3),
      ],
      [
        {
          id: "alpha-streng",
          text: "Wähle c = 15, um den Alpha-Fehler unter 3 % zu drücken.",
          check: (v) => v.c === 15,
        },
        {
          id: "alpha-fuenf",
          text: "Stelle c = 14 ein (Alpha ≈ 5,8 %).",
          check: (v) => v.c === 14,
        },
        {
          id: "beta-klein",
          text: "Wähle c = 12 für einen kleinen Beta-Fehler (auf Kosten eines größeren Alpha-Fehlers).",
          check: (v) => v.c === 12,
        },
      ],
    ),
    exercises: [
      {
        id: "alpha-fehler-rechnen",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // n=20, p=0.5, c=15 -> P(X>=15) = 1 - binomCdf(20, 0.5, 14) approx 0.021
          const alpha = 1 - binomCdf(20, 0.5, 14);
          return task(
            level,
            "Bei einem rechtsseitigen Test mit n = 20 und H_0: p ≤ 0,5 lautet der Ablehnungsbereich A = {15, ..., 20}. Berechne die tatsächliche Wahrscheinlichkeit für den Fehler 1. Art (auf drei Dezimalen gerundet).",
            "Ein Münzprüfer schlägt Alarm bei mindestens 15 Zahl-Würfen aus 20. Wie groß ist die Wahrscheinlichkeit für einen Fehlalarm bei einer fairen Münze (p = 0,5)?",
            [numberField("α =", alpha, "", 3)],
            "α = P_0,5(X ≥ 15) = 1 − P_0,5(X ≤ 14).",
            `P(X &ge; 15) = 1 − binomCdf(20; 0,5; 14) &approx; ${fmt(alpha, 3)}.`,
            `α = ${fmt(alpha, 3)}`,
          );
        },
      },
      {
        id: "fehler-tradeoff",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          return task(
            level,
            "Wie verändert sich die Wahrscheinlichkeit für den Fehler 2. Art (β), wenn man das Signifikanzniveau α von 5 % auf 1 % verschärft (bei unverändertem Stichprobenumfang n)?",
            "In einer medizinischen Diagnostik wird die Alarmschwelle angehoben, um Fehlalarme (Alpha) zu reduzieren. Welche Auswirkung hat das auf das Übersehen echter Erkrankungen (Beta)?",
            [
              choiceField(
                "Der Beta-Fehler ...",
                ["wird größer.", "wird kleiner.", "bleibt unverändert."],
                0,
              ),
            ],
            "Ein strengeres Alpha verkleinert den Ablehnungsbereich A und vergrößert den Annahmebereich, wodurch Beta steigt.",
            "Wird der Ablehnungsbereich verkleinert, steigt die Wahrscheinlichkeit, eine Abweichung nicht zu entdecken: β wird größer.",
            "wird größer.",
          );
        },
      },
    ],
  }),

  // 3.3 Bestimmung des Ablehnungsbereichs
  makeLesson(3, 3, null, {
    id: "g12-hypo-ablehnungsbereich",
    title: "Bestimmung des Ablehnungsbereichs",
    subtitle: "Kritische Werte bei gegebenem Signifikanzniveau α",
    whyItMatters:
      "Die präzise Festlegung der Entscheidungsgrenzen verhindert Willkür bei der Auswertung empirischer Studien.",
    explanationHtml: `
      <p>Um bei einem vorgegebenen Signifikanzniveau <i>&alpha;</i> (typischerweise 5 % oder 1 %) den <strong>Ablehnungsbereich A</strong> zu bestimmen, sucht man den kritischen Wert <i>c</i>:</p>
      <div class="merke">
        <strong>Berechnung des kritischen Wertes c:</strong>
        <ul>
          <li><strong>Rechtsseitiger Test (<i>H<sub>0</sub>: p &le; p<sub>0</sub></i>):</strong>
            <br><i>A = {c, c+1, ..., n}</i>
            <br>Bedingung: <i>P<sub>p0</sub>(X &ge; c) &le; &alpha; &hArr; 1 − P<sub>p0</sub>(X &le; c−1) &le; &alpha; &hArr; P<sub>p0</sub>(X &le; c−1) &ge; 1 − &alpha;</i>.
            <br><i>c</i> ist der <strong>kleinste</strong> Wert, der diese Bedingung erfüllt.
          </li>
          <li><strong>Linksseitiger Test (<i>H<sub>0</sub>: p &ge; p<sub>0</sub></i>):</strong>
            <br><i>A = {0, 1, ..., c}</i>
            <br>Bedingung: <i>P<sub>p0</sub>(X &le; c) &le; &alpha;</i>.
            <br><i>c</i> ist der <strong>größte</strong> Wert, der diese Bedingung erfüllt.
          </li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Rechtsseitiger Test mit <i>n = 20</i>, <i>p<sub>0</sub> = 0,5</i>, <i>&alpha; = 0,05</i>.<br>
        Tabelle kumulierter Wahrscheinlichkeiten:<br>
        <i>P(X &le; 13) &approx; 0,9423 &lt; 0,95</i><br>
        <i>P(X &le; 14) &approx; 0,9793 &ge; 0,95</i> &rArr; <i>c − 1 = 14 &rArr; c = 15</i>.<br>
        Ablehnungsbereich: <i>A = {15, 16, ..., 20}</i>.
      </div>
    `,
    formulas: [
      {
        name: "Entscheidungsregel rechtsseitig",
        html: "P<sub>p0</sub>(X &ge; c) &le; &alpha; &emsp;&rArr;&emsp; A = {c, ..., n}",
        quantities: "c kleinster ganzzahliger Wert",
      },
    ],
    quiz: {
      question: "Für n = 20 und p_0 = 0,5 gilt P(X ≤ 13) = 0,942 und P(X ≤ 14) = 0,979. Welcher Ablehnungsbereich ergibt sich bei α = 0,05 für einen rechtsseitigen Test?",
      options: [
        "A = {15, ..., 20}",
        "A = {14, ..., 20}",
        "A = {0, ..., 14}",
      ],
      correctIndex: 0,
      explanation:
        "Damit P(X ≥ c) = 1 − P(X ≤ c−1) ≤ 0,05 ist, muss P(X ≤ c−1) ≥ 0,95 gelten. Das ist erstmals für c−1 = 14 erfüllt, also c = 15.",
    },
    lab: lab(
      "rejection-region",
      "Ablehnungsbereich bei Niveau α",
      "Wähle das vorgegebene Signifikanzniveau α.",
      [range("alpha", "Niveau α in %", 1, 10, 4, 1)],
      [
        output("kritisch_c", "Kritischer Wert c (A = {c, ..., 20})", (v) => rightSidedCriticalValue(20, 0.5, v.alpha / 100).c, "", 0),
        output("alpha_real", "Tatsächliches α", (v) => rightSidedCriticalValue(20, 0.5, v.alpha / 100).alphaReal, "", 3),
      ],
      [
        {
          id: "standard-fuenf",
          text: "Wähle das Standard-Signifikanzniveau α = 5 %.",
          check: (v) => v.alpha === 5,
        },
        {
          id: "streng-ein-prozent",
          text: "Verschärfe auf das strenge Niveau α = 1 %.",
          check: (v) => v.alpha === 1,
        },
        {
          id: "zehn-prozent",
          text: "Wähle das tolerantere Niveau α = 10 %.",
          check: (v) => v.alpha === 10,
        },
      ],
    ),
    exercises: [
      {
        id: "ablehnungsbereich-rechts",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // n=20, p0=0.5, alpha=0.05 -> c=15
          return task(
            level,
            "Gegeben ist ein rechtsseitiger Test mit n = 20, p_0 = 0,5 und α = 0,05. Die Tabelle liefert P(X ≤ 13) = 0,942 und P(X ≤ 14) = 0,979. Bestimme den kleinsten Wert c des Ablehnungsbereichs A = {c, ..., 20}.",
            "Ein Onlinehändler testet, ob ein neues Empfehlungssystem die Kaufrate über 50 % hebt (n = 20, α = 5 %). Ab welcher Trefferzahl c gilt die Steigerung als signifikant?",
            [numberField("c =", 15, "", 0)],
            "Bedingung 1 − P(X ≤ c−1) ≤ 0,05 &rArr; P(X ≤ c−1) ≥ 0,95. Mit P(X ≤ 14) = 0,979 ist c−1 = 14 &rArr; c = 15.",
            "c = 15 &rArr; A = {15, ..., 20}.",
            "c = 15",
          );
        },
      },
      {
        id: "entscheidungsregel-anwenden",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const kTreffer = rng.pick([14, 16]);
          const decision = kTreffer >= 15 ? 0 : 1;
          return task(
            level,
            `Der Ablehnungsbereich eines rechtsseitigen Tests lautet A = {15, ..., 20}. Die Stichprobe ergibt k = ${kTreffer} Treffer. Wie lautet die Testentscheidung?`,
            `In einer Stichprobe von 20 Kunden kaufen k = ${kTreffer} das Produkt. Entscheide bei A = {15, ..., 20}, ob H_0 verworfen wird.`,
            [
              choiceField(
                "Entscheidung:",
                ["H_0 ablehnen (signifikant)", "H_0 beibehalten (nicht signifikant)"],
                decision,
              ),
            ],
            `Prüfe, ob k = ${kTreffer} im Ablehnungsbereich A = {15, ..., 20} liegt.`,
            kTreffer >= 15
              ? `Da ${kTreffer} &isin; A, wird H_0 abgelehnt.`
              : `Da ${kTreffer} &notin; A, wird H_0 beibehalten.`,
            decision === 0 ? "H_0 ablehnen" : "H_0 beibehalten",
            { kTreffer },
          );
        },
      },
    ],
  }),

  // 3.4 Interpretation und Signifikanz im Sachzusammenhang
  makeLesson(3, 4, null, {
    id: "g12-hypo-interpretation",
    title: "Interpretation und Fehlinterpretationen von Signifikanztests",
    subtitle: "Bedeutung von 'signifikant', Wahlumfragen und Grenzen statistischer Tests",
    whyItMatters:
      "Statistische Irrtümer sind in den Medien weit verbreitet. Mündige Bürger müssen verstehen, was eine Wahlumfrage aussagt und was nicht.",
    explanationHtml: `
      <p>Ein <strong>signifikantes Ergebnis</strong> bedeutet nicht, dass ein Effekt groß oder praktisch bedeutend ist. Es besagt lediglich, dass die beobachtete Abweichung unwahrscheinlich durch reinen Zufall entstanden ist.</p>
      <div class="merke">
        <strong>Häufige Fehlinterpretationen widerlegen:</strong>
        <ul>
          <li><strong>Irrtum 1:</strong> <em>„P(H<sub>0</sub> ist wahr) = 5 %“</em> &ndash; Falsch! Ein Hypothesentest trifft <strong>keine</strong> Wahrscheinlichkeitsaussage über die Nullhypothese. <i>H<sub>0</sub></i> ist wahr oder falsch, nicht zufällig!</li>
          <li><strong>Irrtum 2:</strong> <em>„Das Beibehalten von H<sub>0</sub> beweist, dass H<sub>0</sub> wahr ist.“</em> &ndash; Falsch! Man hat lediglich keine ausreichenden statistischen Belege gefunden, um sie abzulehnen (Freispruch aus Mangel an Beweisen).</li>
          <li><strong>Wahlumfragen:</strong> Die Schwankungsbreite (Fehlermarge) hängt von <i>n</i> ab. Bei <i>n = 1000</i> beträgt die typische Fehlerspanne rund &plusmn;3 Prozentpunkte.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Bei einer Wahlumfrage vor einer Landtagswahl mit <i>n = 1000</i> erreicht Partei A 34 %. Die Fehlermarge bei 95 % Konfidenzniveau beträgt rund <i>&plusmn;3 %</i>.<br>
        Der tatsächliche Wähleranteil liegt mit hoher Sicherheit im Intervall <i>[31 %; 37 %]</i>. Ein Vorsprung von 1 Prozentpunkt vor einer anderen Partei ist daher <strong>nicht signifikant</strong>!
      </div>
    `,
    formulas: [
      {
        name: "Statistische Fehlermarge (Faustformel bei n=1000)",
        html: "Fehlermarge &approx; <sup>1</sup>/<sub>&radic;n</sub> &approx; &plusmn;3,1 %",
        quantities: "n Stichprobenumfang",
      },
    ],
    quiz: {
      question: "Ein Test liefert auf dem Signifikanzniveau α = 0,05 ein signifikantes Ergebnis. Welche Aussage ist mathematisch korrekt?",
      options: [
        "Unter der Annahme, dass H_0 wahr ist, war ein solches oder noch extremeres Ergebnis höchstens 5 % wahrscheinlich.",
        "Die Nullhypothese H_0 ist zu 95 % falsch.",
        "Die Gegenhypothese H_1 ist mit 95 % Wahrscheinlichkeit wahr.",
      ],
      correctIndex: 0,
      explanation:
        "Das Signifikanzniveau ist die bedingte Wahrscheinlichkeit P(X ∈ A | H_0 ist wahr) ≤ 0,05. Es erlaubt keine Umkehrung auf die Wahrscheinlichkeit der Hypothese selbst.",
    },
    lab: lab(
      "test-interpretation",
      "Interpretation von Testergebnissen",
      "Stelle das Stichprobenergebnis k ein und überprüfe die Signifikanz bei c = 14.",
      [range("k", "Beobachtete Treffer k", 10, 18, 15, 1)],
      [
        output("status", "Bewertung", (v) => (v.k >= 14 ? "Signifikant (H_0 abgelehnt)" : "Nicht signifikant (H_0 beibehalten)")),
      ],
      [
        {
          id: "nicht-signifikant",
          text: "Wähle k = 12 (Ergebnis liegt im Annahmebereich, kein statistischer Nachweis).",
          check: (v) => v.k === 12,
        },
        {
          id: "grenzwertig-signifikant",
          text: "Wähle k = 14 (knapp signifikant).",
          check: (v) => v.k === 14,
        },
        {
          id: "hochsignifikant",
          text: "Stelle k = 17 für ein hochsignifikantes Ergebnis ein.",
          check: (v) => v.k === 17,
        },
      ],
    ),
    exercises: [
      {
        id: "fehlinterpretation-erkennen",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          return task(
            level,
            "Eine Zeitung titelt nach einer Befragung: 'Die Wahrscheinlichkeit, dass die Behauptung des Ministers stimmt, liegt bei nur noch 3 %.' Warum ist diese Formulierung mathematisch fehlerhaft?",
            "Nach einem Signifikanztest (α = 5 %) behauptet ein Gutachter: 'Die Nullhypothese ist mit 95 % Wahrscheinlichkeit widerlegt.' Beurteile diese Aussage.",
            [
              choiceField(
                "Kritik:",
                [
                  "Ein Hypothesentest berechnet keine Wahrscheinlichkeit für die Gültigkeit von Hypothesen.",
                  "Das Niveau hätte 1 % betragen müssen.",
                  "Der Fehler 2. Art wurde vergessen.",
                ],
                0,
              ),
            ],
            "Die Nullhypothese ist eine feste Tatsache (wahr oder falsch) und keine Zufallsvariable mit einer Wahrscheinlichkeitsverteilung.",
            "Ein Test trifft keine Aussage über die Wahrscheinlichkeit von Hypothesen, sondern bewertet die Wahrscheinlichkeit von Daten unter einer Hypothese.",
            "Ein Hypothesentest berechnet keine Wahrscheinlichkeit für die Gültigkeit von Hypothesen.",
          );
        },
      },
      {
        id: "fehlermarge-umfrage",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // n=1000 -> 1/sqrt(1000) approx 0.0316 = 3.2%
          const n = 1000;
          const marge = 1 / Math.sqrt(n);
          return task(
            level,
            `Berechne die statistische Fehlermarge 1 / &radic;n für eine repräsentative Stichprobe von n = ${n} Personen (in Prozent, auf eine Dezimale).`,
            `Vor einer Wahl werden ${n} wahlberechtigte Personen befragt. Gib die maximale Schwankungsbreite (Fehlermarge) in Prozent an.`,
            [numberField("Marge =", marge * 100, "%", 1)],
            "Fehlermarge = 1 / √(1000) ≈ 0,0316 = 3,2 %.",
            `1 / &radic;1000 &approx; 0,0316 = ${fmt(marge * 100, 1)} %.`,
            `Marge = ${fmt(marge * 100, 1)} %`,
          );
        },
      },
    ],
  }),
];
