/**
 * Lernbereich 3: Einseitiger Signifikanztest (bei als binomialverteilt angenommenen Merkmalen) (8 Std.)
 * 4 Lektionen zu Hypothesenwahl, Fehlerarten (Alpha/Beta), Ablehnungsbereich und Interpretation.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range } from "./builders";
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
          const pPercent = rng.pick([15, 20, 25, 30, 40, 50, 60]);
          const pVal = pPercent / 100;
          if (level === 1) {
            return {
              prompt: `Ein Marketingteam vermutet, dass die Klickrate einer Webseite durch ein Redesign über den bisherigen Wert von ${pPercent} % gestiegen ist. Welche Nullhypothese H₀ muss formuliert werden?`,
              given: [`Bisherige Klickrate: ${pPercent} %`, `Vermutung: Klickrate ist gestiegen`],
              fields: [
                choiceField(
                  "H₀ lautet:",
                  [`p ≤ ${fmt(pVal, 2)}`, `p > ${fmt(pVal, 2)}`, `p = 0,50`],
                  0,
                ),
              ],
              formulaHint: "Die zu belegende Neuerung 'gestiegen' gehört in H₁: p > p₀. Folglich ist H₀: p ≤ p₀.",
              feedbackHint: "H₀ sichert den Status quo ab: p ≤ p₀.",
              steps: [
                `Gegenhypothese H₁ (Vermutung): p > ${fmt(pVal, 2)}.`,
                `Nullhypothese H₀ (Status quo): p ≤ ${fmt(pVal, 2)}.`,
                `<strong>H₀: p ≤ ${fmt(pVal, 2)}</strong>`,
              ],
              meta: { pPercent, pVal },
            };
          }
          const scenario = rng.pick([
            {
              text: `Ein Hersteller garantiert, dass höchstens ${pPercent} % der Batterien fehlerhaft sind. Ein Verbraucherschutzverein vermutet, dass die Ausfallquote in Wahrheit höher ist.`,
              h0: `p ≤ ${fmt(pVal, 2)}`,
              h1: `p > ${fmt(pVal, 2)}`,
            },
            {
              text: `Ein Automobilzulieferer will belegen, dass ein neues Verfahren die Ausschussquote unter das bisherige Niveau von ${pPercent} % gesenkt hat.`,
              h0: `p ≥ ${fmt(pVal, 2)}`,
              h1: `p < ${fmt(pVal, 2)}`,
            },
          ]);
          return {
            prompt: `${scenario.text} Welche Nullhypothese H₀ ist für den statistischen Test anzusetzen?`,
            given: [scenario.text],
            fields: [
              choiceField(
                "H₀ lautet:",
                [scenario.h0, scenario.h1, `p = ${fmt(pVal, 2)}`],
                0,
              ),
            ],
            feedbackHint: "Formuliere zuerst die Behauptung als H₁. Die Gegenbehauptung ist dann H₀.",
            steps: [
              `Zu belegende Behauptung H₁: ${scenario.h1}.`,
              `Nullhypothese H₀: ${scenario.h0}.`,
              `<strong>H₀: ${scenario.h0}</strong>`,
            ],
            meta: { pPercent },
          };
        },
      },
      {
        id: "testrichtung-bestimmen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const item = rng.pick([
              {
                text: "Ein Softwareentwickler will nachweisen, dass die Absturzquote einer App durch ein Update gesunken ist.",
                direction: "Linksseitiger Test",
                idx: 0,
                reason: "Da eine Verringerung (p < p₀) nachgewiesen werden soll, führen kleine Trefferzahlen zur Ablehnung von H₀.",
              },
              {
                text: "Ein Schokoladenhersteller möchte werben, dass die Kundenzufriedenheit durch eine Rezepturänderung über 80 % gestiegen ist.",
                direction: "Rechtsseitiger Test",
                idx: 1,
                reason: "Da eine Steigerung (p > p₀) belegt werden soll, führen große Trefferzahlen zur Ablehnung von H₀.",
              },
            ]);
            return {
              prompt: `${item.text} Welcher Testtyp (Testrichtung) liegt vor?`,
              given: [item.text],
              fields: [
                choiceField(
                  "Testrichtung:",
                  ["Linksseitiger Test", "Rechtsseitiger Test", "Zweiseitiger Test"],
                  item.idx,
                ),
              ],
              formulaHint: "Prüfe, ob eine Verringerung (links) oder Erhöhung (rechts) nachgewiesen werden soll.",
              feedbackHint: item.reason,
              steps: [
                item.reason,
                `<strong>${item.direction}</strong>`,
              ],
              meta: { idx: item.idx },
            };
          }
          const item = rng.pick([
            {
              text: "Eine Umweltbehörde prüft stichprobenartig, ob die Feinstaubüberschreitungen durch einen neuen Filter unter den Grenzwert gedrückt wurden.",
              direction: "Linksseitiger Test",
              idx: 0,
              reason: "Senkung unter Grenzwert erfordert Ablehnung bei besonders wenigen Überschreitungen (linksseitiger Test).",
            },
            {
              text: "Ein Pharmahersteller will im Zulassungsverfahren statistisch absichern, dass die Heilungsquote über dem bisherigen Standard liegt.",
              direction: "Rechtsseitiger Test",
              idx: 1,
              reason: "Übertreffen des Standards erfordert Ablehnung bei vielen geheilten Patienten (rechtsseitiger Test).",
            },
          ]);
          return {
            prompt: `Praxisproblem: ${item.text} Bestimme die notwendige Testrichtung für die statistische Entscheidungsfindung.`,
            given: [item.text],
            fields: [
              choiceField(
                "Testrichtung:",
                ["Linksseitiger Test", "Rechtsseitiger Test", "Zweiseitiger Test"],
                item.idx,
              ),
            ],
            feedbackHint: item.reason,
            steps: [
              item.reason,
              `<strong>${item.direction}</strong>`,
            ],
            meta: { idx: item.idx },
          };
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
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([14, 15, 16]);
          const n = 20;
          const p = 0.5;
          const alpha = 1 - binomCdf(n, p, c - 1);
          if (level === 1) {
            return {
              prompt: `Bei einem rechtsseitigen Test mit n = ${n} und H₀: p ≤ 0,5 lautet der Ablehnungsbereich A = {${c}, ..., ${n}}. Berechne die tatsächliche Wahrscheinlichkeit für den Fehler 1. Art (auf drei Dezimalen gerundet).`,
              given: [`n = ${n}`, `p₀ = 0,5`, `Ablehnungsbereich A = {${c}, ..., ${n}}`],
              fields: [numberField("α =", alpha, "", 3)],
              formulaHint: `α = P(X ≥ ${c}) = 1 − P(X ≤ ${c - 1}).`,
              feedbackHint: `Nutze die kumulierte Wahrscheinlichkeit: α = 1 − F(${c - 1}).`,
              steps: [
                `α = P_{0,5}(X ≥ ${c}) = 1 − P_{0,5}(X ≤ ${c - 1}) = 1 − ${fmt(binomCdf(n, p, c - 1), 4)} &approx; ${fmt(alpha, 3)}.`,
                `<strong>α = ${fmt(alpha, 3)}</strong>`,
              ],
              meta: { c, n, p, alpha },
            };
          }
          const pAlt = 0.75;
          const beta = binomCdf(n, pAlt, c - 1);
          return {
            prompt: `Gegeben ist der gleiche rechtsseitige Test (n = ${n}, A = {${c}, ..., ${n}}). Gilt in Wahrheit die Trefferquote p₁ = 0,75, so wird H₀ fälschlicherweise beibehalten (Fehler 2. Art). Berechne β auf drei Dezimalen gerundet.`,
            given: [`n = ${n}`, `p₁ = 0,75`, `Annahmebereich Ā = {0, ..., ${c - 1}}`],
            fields: [numberField("β =", beta, "", 3)],
            feedbackHint: `Fehler 2. Art: β = P_{p₁}(X ∉ A) = P_{0,75}(X ≤ ${c - 1}).`,
            steps: [
              `β = P_{0,75}(X ≤ ${c - 1}) &approx; ${fmt(beta, 3)}.`,
              `<strong>β = ${fmt(beta, 3)}</strong>`,
            ],
            meta: { c, n, pAlt, beta },
          };
        },
      },
      {
        id: "fehler-tradeoff",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const q = rng.pick([
              {
                question: "Wie verändert sich die Wahrscheinlichkeit für den Fehler 2. Art (β), wenn man das Signifikanzniveau α von 5 % auf 1 % verschärft (bei unverändertem Stichprobenumfang n)?",
                ans: "wird größer.",
                idx: 0,
                options: ["wird größer.", "wird kleiner.", "bleibt unverändert."],
                reason: "Ein kleineres α verkleinert den Ablehnungsbereich A. Dadurch wird der Annahmebereich größer und der Beta-Fehler steigt.",
              },
              {
                question: "Welche Auswirkung hat eine Erhöhung der Stichprobengröße n bei festem Signifikanzniveau α auf den Fehler 2. Art (β)?",
                ans: "Der Beta-Fehler wird kleiner.",
                idx: 0,
                options: ["Der Beta-Fehler wird kleiner.", "Der Beta-Fehler wird größer.", "Der Beta-Fehler bleibt unverändert."],
                reason: "Mit wachsendem Stichprobenumfang sinkt die Streuung der Teststatistik, wodurch Abweichungen zuverlässiger erkannt werden (β sinkt).",
              },
            ]);
            return {
              prompt: q.question,
              given: [q.question],
              fields: [choiceField("Antwort:", q.options, q.idx)],
              formulaHint: "Überlege, wie sich die Schwellenwerte für A und Ā verschieben.",
              feedbackHint: q.reason,
              steps: [
                q.reason,
                `<strong>${q.ans}</strong>`,
              ],
              meta: { idx: q.idx },
            };
          }
          const q = rng.pick([
            {
              question: "In der medizinischen Diagnostik (H₀: 'Patient ist gesund') wird ein Test so justiert, dass Fehlalarme (Fehler 1. Art) nahezu ausgeschlossen sind. Welche Konsequenz hat das für unerkannte Erkrankungen (Fehler 2. Art)?",
              ans: "Das Risiko für unerkannte Erkrankungen (Beta-Fehler) steigt deutlich an.",
              idx: 0,
              options: [
                "Das Risiko für unerkannte Erkrankungen (Beta-Fehler) steigt deutlich an.",
                "Das Risiko für unerkannte Erkrankungen sinkt ebenfalls.",
                "Die Diagnosesicherheit bei Kranken bleibt unberührt.",
              ],
              reason: "Wird der Schwellenwert für Alarm sehr hoch gelegt (α klein), verbleiben mehr Kranke im Annahmebereich von H₀ (β steigt).",
            },
            {
              question: "Eine Qualitätskontrolle (H₀: 'Bauteil fehlerfrei') soll so gestaltet werden, dass defekte Teile fast nie übersehen werden (β minimal). Welche betriebliche Folge entsteht bei unverändertem n?",
              ans: "Es werden vermehrt intakte Teile irrtümlich aussortiert (Alpha-Fehler steigt).",
              idx: 0,
              options: [
                "Es werden vermehrt intakte Teile irrtümlich aussortiert (Alpha-Fehler steigt).",
                "Es werden überhaupt keine Fehlentscheidungen mehr getroffen.",
                "Der Alpha-Fehler sinkt gleichzeitig.",
              ],
              reason: "Ein vergrößerter Ablehnungsbereich senkt β, vergrößert aber zwangsläufig die Quote falscher Alarme (α).",
            },
          ]);
          return {
            prompt: `Praxistransfer: ${q.question}`,
            given: [q.question],
            fields: [choiceField("Folge:", q.options, q.idx)],
            feedbackHint: q.reason,
            steps: [
              q.reason,
              `<strong>${q.ans}</strong>`,
            ],
            meta: { idx: q.idx },
          };
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
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const alphaPercent = rng.pick([5, 1]);
          const alphaVal = alphaPercent / 100;
          const crit = rightSidedCriticalValue(20, 0.5, alphaVal);
          const c = crit.c;
          if (level === 1) {
            return {
              prompt: `Gegeben ist ein rechtsseitiger Test mit n = 20, p₀ = 0,5 und α = ${alphaPercent} %. Die Tabelle kumulierter Wahrscheinlichkeiten liefert P(X ≤ ${c - 2}) = ${fmt(binomCdf(20, 0.5, c - 2), 3)} und P(X ≤ ${c - 1}) = ${fmt(binomCdf(20, 0.5, c - 1), 3)}. Bestimme den kritischen Wert c des Ablehnungsbereichs A = {c, ..., 20}.`,
              given: [`n = 20`, `p₀ = 0,5`, `α = ${alphaPercent} %`],
              fields: [numberField("c =", c, "", 0)],
              formulaHint: `Bedingung: P(X ≥ c) ≤ ${alphaVal} ⇔ P(X ≤ c−1) ≥ ${fmt(1 - alphaVal, 2)}.`,
              feedbackHint: `Suche den kleinsten Wert, für den P(X ≤ c−1) ≥ ${fmt(1 - alphaVal, 2)} erfüllt ist.`,
              steps: [
                `P(X ≤ ${c - 1}) = ${fmt(binomCdf(20, 0.5, c - 1), 3)} ≥ ${fmt(1 - alphaVal, 2)} &rArr; c − 1 = ${c - 1} &rArr; c = ${c}.`,
                `Ablehnungsbereich A = {${c}, ..., 20}.`,
                `<strong>c = ${c}</strong>`,
              ],
              meta: { alphaPercent, c },
            };
          }
          return {
            prompt: `Ein Online-Shop möchte prüfen, ob eine Werbekampagne die Conversion-Rate über 50 % hebt (n = 20, α = ${alphaPercent} %). Ab welcher Mindestanzahl c von Käufen gilt der Effekt als signifikant?`,
            given: [`n = 20`, `H₀: p ≤ 0,50`, `Signifikanzniveau α = ${alphaPercent} %`],
            fields: [numberField("c =", c, "", 0)],
            feedbackHint: `Finde c so, dass unter H₀ höchstens mit Wahrscheinlichkeit ${alphaPercent} % mindestens c Treffer erzielt werden.`,
            steps: [
              `P_{0,5}(X ≥ c) ≤ ${alphaVal} liefert c = ${c}.`,
              `<strong>Mindestens ${c} Käufe erforderlich</strong>`,
            ],
            meta: { alphaPercent, c },
          };
        },
      },
      {
        id: "entscheidungsregel-anwenden",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = 15;
          const kTreffer = rng.pick([13, 14, 15, 16, 17]);
          const inRejection = kTreffer >= c;
          const decision = inRejection ? 0 : 1;
          if (level === 1) {
            return {
              prompt: `Der Ablehnungsbereich eines rechtsseitigen Signifikanztests lautet A = {${c}, ..., 20}. In der Stichprobe werden k = ${kTreffer} Treffer beobachtet. Wie lautet die statistische Testentscheidung?`,
              given: [`A = {${c}, ..., 20}`, `Beobachtet: k = ${kTreffer}`],
              fields: [
                choiceField(
                  "Entscheidung:",
                  ["H₀ ablehnen (signifikant)", "H₀ beibehalten (nicht signifikant)"],
                  decision,
                ),
              ],
              formulaHint: `Prüfe, ob ${kTreffer} im Ablehnungsbereich A liegt.`,
              feedbackHint: inRejection ? `Da ${kTreffer} ≥ ${c}, liegt das Ergebnis im Ablehnungsbereich.` : `Da ${kTreffer} < ${c}, liegt das Ergebnis im Annahmebereich.`,
              steps: [
                inRejection
                  ? `Da k = ${kTreffer} &isin; A = {${c}, ..., 20}, wird H₀ auf dem gewählten Niveau abgelehnt (signifikant).`
                  : `Da k = ${kTreffer} &notin; A, wird H₀ beibehalten (nicht signifikant).`,
                `<strong>${decision === 0 ? "H₀ ablehnen" : "H₀ beibehalten"}</strong>`,
              ],
              meta: { kTreffer, c, decision },
            };
          }
          return {
            prompt: `Ein Qualitätsprüfer testet bei n = 20 Bauteilen mit H₀: p ≤ 0,5 auf dem 5 %-Niveau (A = {${c}, ..., 20}). Bei k = ${kTreffer} Treffern soll der Kunde informiert werden, ob eine statistisch gesicherte Qualitätssteigerung vorliegt.`,
            given: [`n = 20`, `k = ${kTreffer}`, `A = {${c}, ..., 20}`],
            fields: [
              choiceField(
                "Mitteilung an Kunden:",
                [
                  "Qualitätssteigerung ist statistisch signifikant belegt (H₀ ablehnen)",
                  "Kein statistisch signifikanter Nachweis für Steigerung (H₀ beibehalten)",
                ],
                decision,
              ),
            ],
            feedbackHint: inRejection ? "Trefferzahl liegt im kritischen Bereich." : "Trefferzahl reicht nicht aus für Signifikanz.",
            steps: [
              inRejection
                ? `Mit k = ${kTreffer} ≥ ${c} ist die Steigerung signifikant nachgewiesen.`
                : `Mit k = ${kTreffer} < ${c} reicht die Evidenz nicht aus.`,
              `<strong>${decision === 0 ? "Qualitätssteigerung signifikant belegt" : "Kein signifikanter Nachweis"}</strong>`,
            ],
            meta: { kTreffer, c, decision },
          };
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
          <li><strong>Wahlumfragen:</strong> Die Schwankungsbreite (Fehlermarge) hängt von <i>n</i> ab. Bei <i>n = 1000</i> beträgt die typische Fehlerspanne rund &plusmn;3,2 Prozentpunkte (Faustformel <i>1/&radic;n &approx; 3,2 %</i>).</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Bei einer Wahlumfrage vor einer Landtagswahl mit <i>n = 1000</i> erreicht Partei A 34 %. Die Fehlermarge bei 95 % Konfidenzniveau beträgt rund <i>&plusmn;3,2 %</i>.<br>
        Der tatsächliche Wähleranteil liegt mit hoher Sicherheit im Intervall <i>[30,8 %; 37,2 %]</i>. Ein Vorsprung von 1 Prozentpunkt vor einer anderen Partei ist daher <strong>nicht signifikant</strong>!
      </div>
    `,
    formulas: [
      {
        name: "Statistische Fehlermarge (Faustformel bei n=1000)",
        html: "Fehlermarge &approx; <sup>1</sup>/<sub>&radic;n</sub> &approx; &plusmn;3,2 %",
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
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const item = rng.pick([
              {
                statement: "Eine Zeitung titelt nach einer Umfrage: 'Die Wahrscheinlichkeit, dass die Behauptung des Ministers stimmt, liegt bei nur noch 3 %.'",
                flaw: "Ein Hypothesentest berechnet keine Wahrscheinlichkeit für die Gültigkeit von Hypothesen.",
                idx: 0,
                options: [
                  "Ein Hypothesentest berechnet keine Wahrscheinlichkeit für die Gültigkeit von Hypothesen.",
                  "Das Signifikanzniveau hätte 1 % betragen müssen.",
                  "Der Beta-Fehler wurde nicht angegeben.",
                ],
                explanation: "Hypothesen sind fixe Sachverhalte und besitzen in der klassischen Inferenzstatistik keine Wahrscheinlichkeitsverteilung.",
              },
              {
                statement: "Nach einem Test mit Beibehaltung von H₀ verkündet der Studienleiter: 'Damit ist endgültig bewiesen, dass H₀ die absolute Wahrheit ist.'",
                flaw: "Das Beibehalten von H₀ beweist nicht deren Richtigkeit, sondern bedeutet nur fehlende Signifikanz.",
                idx: 0,
                options: [
                  "Das Beibehalten von H₀ beweist nicht deren Richtigkeit, sondern bedeutet nur fehlende Signifikanz.",
                  "H₀ kann niemals beibehalten werden.",
                  "Es wurde vergessen, α mit β zu multiplizieren.",
                ],
                explanation: "Beibehalten von H₀ bedeutet 'Freispruch aus Mangel an Beweisen', kein Beweis für die Richtigkeit.",
              },
            ]);
            return {
              prompt: `${item.statement} Warum ist diese Schlussfolgerung mathematisch bzw. methodisch fehlerhaft?`,
              given: [item.statement],
              fields: [choiceField("Kritik:", item.options, item.idx)],
              formulaHint: "Denke an den Unterschied zwischen Daten-Wahrscheinlichkeit und Hypothesen-Wahrscheinlichkeit.",
              feedbackHint: item.explanation,
              steps: [
                item.explanation,
                `<strong>${item.flaw}</strong>`,
              ],
              meta: { idx: item.idx },
            };
          }
          const item = rng.pick([
            {
              statement: "Ein Hersteller wirbt nach einer Großstudie: 'Unser Produkt führt zu einer statistisch hochsignifikanten Verbesserung (p < 0,001), daher ist der praktische Nutzen riesig.'",
              flaw: "Statistische Signifikanz darf nicht mit praktischer Relevanz verwechselt werden.",
              idx: 0,
              options: [
                "Statistische Signifikanz darf nicht mit praktischer Relevanz verwechselt werden.",
                "Ein p-Wert unter 0,001 ist rechnerisch unmöglich.",
                "Bei p < 0,001 ist der Fehler 1. Art zu groß.",
              ],
              explanation: "Bei sehr großen Stichproben werden selbst winzige, praktisch unbedeutende Effekte statistisch signifikant.",
            },
            {
              statement: "Ein Forscher behauptet: 'Weil unser Signifikanzniveau α = 0,05 betrug, beträgt die Wahrscheinlichkeit, dass unsere Forschungshypothese H₁ zutrifft, genau 95 %.'",
              flaw: "1 − α ist nicht die Wahrscheinlichkeit für das Eintreffen der Hypothese H₁.",
              idx: 0,
              options: [
                "1 − α ist nicht die Wahrscheinlichkeit für das Eintreffen der Hypothese H₁.",
                "H₁ muss immer mit α = 0,01 abgesichert werden.",
                "Die Stichprobe war zwingend unvollständig.",
              ],
              explanation: "Das Signifikanzniveau ist eine bedingte Wahrscheinlichkeit für Daten unter H₀ und darf nicht als Wahrscheinlichkeit von Hypothesen invertiert werden.",
            },
          ]);
          return {
            prompt: `Wissenschaftliche Kritik: ${item.statement} Welche methodische Fehleinschätzung liegt hier vor?`,
            given: [item.statement],
            fields: [choiceField("Kritikpunkt:", item.options, item.idx)],
            feedbackHint: item.explanation,
            steps: [
              item.explanation,
              `<strong>${item.flaw}</strong>`,
            ],
            meta: { idx: item.idx },
          };
        },
      },
      {
        id: "fehlermarge-umfrage",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const n = rng.pick([400, 625, 1000, 1600, 2500]);
            const marge = 1 / Math.sqrt(n);
            const margePct = marge * 100;
            return {
              prompt: `Berechne die statistische Fehlermarge 1 / &radic;n für eine repräsentative Stichprobe von n = ${n} Personen (in Prozent, gerundet auf eine Dezimale).`,
              given: [`Stichprobenumfang n = ${n}`, `Faustformel: Fehlermarge = 1 / &radic;n`],
              fields: [numberField("Fehlermarge =", margePct, "%", 1)],
              formulaHint: `Fehlermarge in % = (1 / √${n}) · 100 %.`,
              feedbackHint: `Berechne zuerst die Wurzel aus ${n} und teile 100 durch dieses Ergebnis.`,
              steps: [
                `&radic;${n} = ${fmt(Math.sqrt(n), 1)}.`,
                `Fehlermarge = 1 / &radic;${n} = 1 / ${fmt(Math.sqrt(n), 1)} &approx; ${fmt(marge, 4)} = ${fmt(margePct, 1)} %.`,
                `<strong>Fehlermarge = ${fmt(margePct, 1)} %</strong>`,
              ],
              meta: { n, margePct },
            };
          }
          const targetPct = rng.pick([2, 4, 5]);
          const targetFrac = targetPct / 100;
          const requiredN = Math.round(1 / (targetFrac * targetFrac));
          return {
            prompt: `Ein Meinungsforschungsinstitut plant eine repräsentative Wählerbefragung. Die Fehlerspanne (Fehlermarge) soll nach der Faustformel 1 / &radic;n höchstens &plusmn;${targetPct} % betragen. Wie viele Personen müssen dafür mindestens befragt werden?`,
            given: [`Maximale Fehlermarge = ${targetPct} % = ${fmt(targetFrac, 2)}`, `Faustformel: 1 / &radic;n ≤ ${fmt(targetFrac, 2)}`],
            fields: [numberField("Mindestanzahl n =", requiredN, "", 0)],
            feedbackHint: `Löse die Ungleichung 1 / √n ≤ ${targetPct}/100 nach n auf: √n ≥ 100/${targetPct} ⇒ n ≥ (100/${targetPct})².`,
            steps: [
              `1 / &radic;n &le; ${fmt(targetFrac, 2)} &hArr; &radic;n &ge; 1 / ${fmt(targetFrac, 2)} = ${100 / targetPct}.`,
              `n &ge; (${100 / targetPct})² = ${requiredN}.`,
              `<strong>Mindestens n = ${requiredN} Personen</strong>`,
            ],
            meta: { targetPct, requiredN },
          };
        },
      },
    ],
  }),
];
