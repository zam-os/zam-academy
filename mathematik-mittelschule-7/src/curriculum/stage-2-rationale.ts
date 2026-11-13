import { fmt, frac } from "../exercises/format";
import { near, numberField } from "./helpers";
import {
  BOTH,
  choice,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";

const LB = [2, 2] as [number, number];

export const STAGE_RATIONALE = makeStage(
  2,
  "Rationale Zahlen – Rechenregeln",
  "Rechnen mit positiven und negativen Zahlen in ℚ an Zahlengerade und Sachsituationen",
  "#0d9488",
  "±",
  LB,
  [
    makeLesson(2, 1, LB, {
      id: "rz-1-zahlengerade-modelle",
      title: "Situationen an der Zahlengeraden darstellen",
      subtitle: "Pfeilmodelle zu Addition, Subtraktion, Multiplikation und Division in ℚ",
      tracks: BOTH,
      whyItMatters:
        "Kontoauszug, Thermometer und Höhenmeter arbeiten mit Plus und Minus. Mit Pfeilen auf der Zahlengeraden erkennst du sofort, in welche Richtung es geht.",
      explanationHtml: `
        <p>Jede rationale Zahl hat einen Betrag und ein Vorzeichen. Auf der <strong>Zahlengeraden</strong> zeigt ein Pfeil nach rechts eine Zunahme (+) und ein Pfeil nach links eine Abnahme (−).</p>
        <div class="example">
          <strong>Beispiel (Temperatur &amp; Konto):</strong><br>
          Am Morgen zeigt das Thermometer −3 °C (Pfeil von 0 nach −3). Bis mittags steigt die Temperatur um +7 °C → Pfeil um 7 nach rechts:<br>
          −3 + 7 = <strong>+4 °C</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Positiver Pfeil (+) → nach rechts; negativer Pfeil (−) → nach links. Subtrahieren einer Zahl heißt, die Gegenzahl zu addieren.
        </div>
      `,
      formulas: [
        {
          name: "Gegenzahl & Pfeilrichtung",
          html: `a − b = a + (−b)`,
          quantities: "a, b ∈ ℚ; subtrahieren dreht den Pfeil um",
        },
      ],
      quiz: {
        question:
          "Auf der Zahlengeraden startet ein Pfeil bei −4 und geht um 6 Einheiten nach rechts. Welche Rechnung passt dazu?",
        options: ["−4 + 6 = 2", "−4 − 6 = −10", "6 − 4 = 2 (Start bei +6)"],
        correctIndex: 0,
        explanation:
          "Start bei −4 und 6 Schritte nach rechts entspricht der Addition −4 + 6 = 2.",
      },
      lab: lab(
        "number-line-op",
        "Zahlengerade mit zwei Pfeilen",
        "Ziehe Startwert a und zweiten Schritt b direkt an der Zahlengeraden.",
        [
          range("a", "Startwert a", -8, 8, -3, 1),
          range("b", "Zweiter Wert b", -8, 8, 5, 1),
          choice("op", "Rechenart", ["Addition (+)", "Subtraktion (−)"], 0),
        ],
        [
          output(
            "res",
            "Ergebnis",
            (v) => (v.op === 0 ? v.a + v.b : v.a - v.b),
            "",
            0,
            true,
          ),
        ],
        [
          {
            id: "reach-pos-from-neg",
            text: "Starte bei a = −5 und lande durch Addition genau bei +3.",
            check: (v, r) => v.op === 0 && v.a === -5 && near(Number(r.res), 3, 0.01),
          },
          {
            id: "reach-zero-sub",
            text: "Erreiche bei Subtraktion von a = −4 genau das Ergebnis 0 (Gegenzahl!).",
            check: (v, r) => v.op === 1 && v.a === -4 && near(Number(r.res), 0, 0.01),
          },
          {
            id: "minus-minus",
            text: "Zeige mit Subtraktion: −2 − (−6) = +4.",
            check: (v, r) => v.op === 1 && v.a === -2 && v.b === -6 && near(Number(r.res), 4, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "arrow-add-sub",
          make(rng, level) {
            const a = rng.int(-9, -1);
            const delta = rng.int(2, 14);
            const ans = a + delta;
            return task(
              level,
              `Lies die Zahlengerade: Start bei ${fmt(a)}, Pfeil um ${delta} nach rechts. Berechne das Ziel.`,
              `Das Konto steht bei ${fmt(a)} € im Minus. Du zahlst ${delta} € bar ein. Wie ist der neue Kontostand?`,
              [numberField("Stand =", ans, level === 1 ? "" : "€", 0)],
              "Nach rechts auf der Zahlengeraden heißt addieren.",
              [
                `Rechnung: ${fmt(a)} + ${delta}`,
                `<strong>${fmt(ans)} €</strong>`,
              ],
              { a, delta, ans },
            );
          },
        },
        {
          id: "temp-drop",
          make(rng, level) {
            const start = rng.int(-6, 5);
            const drop = rng.int(3, 10);
            const ans = start - drop;
            return task(
              level,
              `Startwert ${fmt(start)}, Pfeil um ${drop} nach links. Berechne ${fmt(start)} − ${drop}.`,
              `Um 16 Uhr misst das Thermometer ${fmt(start)} °C. Bis Mitternacht fällt die Temperatur um ${drop} °C. Wie kalt ist es um Mitternacht?`,
              [numberField("Temperatur =", ans, "°C", 0)],
              "Temperaturabnahme entspricht einem Pfeil nach links (subtrahieren).",
              [
                `${fmt(start)} − ${drop}`,
                `<strong>${fmt(ans)} °C</strong>`,
              ],
              { start, drop, ans },
            );
          },
        },
      ],
    }),

    makeLesson(2, 2, LB, {
      id: "rz-2-addition-subtraktion",
      title: "Addition und Subtraktion in ℚ",
      subtitle: "Vorzeichen- und Rechenzeichenregeln sicher anwenden (Guthaben & Schulden)",
      tracks: BOTH,
      whyItMatters:
        "Schulden wegnehmen macht reicher! Genau das steckt hinter der Regel „minus mal minus gibt plus“ beim Subtrahieren negativer Zahlen.",
      explanationHtml: `
        <p>Stehen zwei Zeichen nebeneinander, fasst du sie erst zu einem <strong>einzigen Rechenzeichen</strong> zusammen:</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          • 4,5 + (−7,2) = 4,5 − 7,2 = <strong>−2,7</strong> (unterschiedliche Vorzeichen: kleineren Betrag abziehen, Vorzeichen der größeren Zahl)<br>
          • −3,5 − (−5,0) = −3,5 + 5,0 = <strong>+1,5</strong> (Schulden wegnehmen = Guthaben wächst!)
        </div>
        <div class="merke">
          <strong>Merke:</strong> Gleiche Zeichen (+(+) oder −(−)) ergeben <strong>+</strong>. Verschiedene Zeichen (+(−) oder −(+)) ergeben <strong>−</strong>.
        </div>
      `,
      formulas: [
        {
          name: "Klammern auflösen",
          html: `a + (−b) = a − b  &nbsp;·&nbsp;  a − (−b) = a + b`,
          quantities: "a, b ∈ ℚ",
        },
      ],
      quiz: {
        question: "Was ergibt −6,5 − (−2,5)?",
        options: ["−4", "−9", "+4"],
        correctIndex: 0,
        explanation:
          "−(−2,5) wird zu +2,5. Also −6,5 + 2,5 = −4.",
      },
      lab: lab(
        "number-line-op",
        "Guthaben-Schulden-Labor",
        "Vergleiche + (−b) und − (−b) durch Umschalten der Rechenart.",
        [
          range("a", "Startwert a", -8, 8, -4, 1),
          range("b", "Wert b", -8, 8, -3, 1),
          choice("op", "Operation", ["+ (addieren)", "− (subtrahieren)"], 1),
        ],
        [
          output("res", "Ergebnis", (v) => (v.op === 0 ? v.a + v.b : v.a - v.b), "", 0, true),
        ],
        [
          {
            id: "sub-debt",
            text: "Starte bei a = −6 und ziehe b = −6 ab (Ergebnis 0).",
            check: (v, r) => v.op === 1 && v.a === -6 && v.b === -6 && near(Number(r.res), 0, 0.01),
          },
          {
            id: "add-debt",
            text: "Addiere zu a = +3 Schulden von b = −7.",
            check: (v, r) => v.op === 0 && v.a === 3 && v.b === -7 && near(Number(r.res), -4, 0.01),
          },
          {
            id: "deep-minus",
            text: "Erreiche mit b = +4 das Ergebnis −11.",
            check: (v, r) => v.b === 4 && near(Number(r.res), -11, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "rational-add-dec",
          make(rng, level) {
            const a = rng.stepped(-9.5, -1.5, 0.5);
            const b = rng.stepped(-8.5, -1.0, 0.5);
            const ans = Number((a - b).toFixed(1));
            return task(
              level,
              `Berechne den Termwert rationaler Zahlen: ${fmt(a, 1)} − (${fmt(b, 1)}).`,
              `Ein Taucher befindet sich in ${fmt(a, 1)} m Tiefe, ein U-Boot in ${fmt(b, 1)} m Tiefe. Wie groß ist der Höhenunterschied (${fmt(a, 1)} − (${fmt(b, 1)}))?`,
              [numberField("Ergebnis =", ans, "", 1, {
                slips: [{ value: Number((a + b).toFixed(1)), hint: "Minus vor negativer Zahl (−(−)) wird zu Plus!" }],
              })],
              "Löse zuerst die Klammer auf: − (−b) = + b.",
              [
                `${fmt(a, 1)} − (${fmt(b, 1)}) = ${fmt(a, 1)} + ${fmt(Math.abs(b), 1)}`,
                `<strong>${fmt(ans, 1)}</strong>`,
              ],
              { a, b, ans },
            );
          },
        },
        {
          id: "height-difference",
          make(rng, level) {
            const low = rng.int(-45, -5);
            const high = rng.int(15, 180);
            const diff = high - low;
            return task(
              level,
              `Berechne die Differenz ${high} − (${fmt(low)}).`,
              `Das Tote Meer liegt auf ${fmt(low)} m Höhe (unter Null), eine Stadt daneben auf +${high} m Höhe. Wie viele Höhenmeter liegen dazwischen?`,
              [numberField("Höhenunterschied =", diff, "m", 0)],
              "Höhenunterschied = oberer Wert − unterer Wert.",
              [
                `${high} − (${fmt(low)}) = ${high} + ${Math.abs(low)}`,
                `<strong>${diff} m</strong>`,
              ],
              { low, high, diff },
            );
          },
        },
      ],
    }),

    makeLesson(2, 3, LB, {
      id: "rz-3-multiplikation-division",
      title: "Multiplikation & Division in ℚ",
      subtitle: "Vorzeichenregeln über Aufgabenreihen und Umkehraufgaben begründen",
      tracks: BOTH,
      whyItMatters:
        "Wenn ein Konto vier Monate hintereinander um −25 € sinkt oder eine Temperatur gleichmäßig fällt, rechnest du sicher mit Produkten und Quotienten in ℚ.",
      explanationHtml: `
        <p>Mit Aufgabenreihen siehst du sofort, warum die Vorzeichenregeln gelten:</p>
        <div class="example">
          <strong>Beispiel (Aufgabenreihe):</strong><br>
          2 · (−3) = −6 &nbsp;→&nbsp; 1 · (−3) = −3 &nbsp;→&nbsp; 0 · (−3) = 0 &nbsp;→&nbsp; <strong>(−1) · (−3) = +3</strong><br>
          Das Produkt zweier Zahlen mit gleichem Vorzeichen ist immer positiv!<br>
          Weil Division die Umkehrung ist, gilt genauso: (−12) : (−3) = <strong>+4</strong> und (−12) : (+3) = <strong>−4</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong><br>
          (+) · (+) = (+) &nbsp;|&nbsp; (−) · (−) = (+) &nbsp;→&nbsp; <strong>Gleiche Vorzeichen: Plus</strong><br>
          (+) · (−) = (−) &nbsp;|&nbsp; (−) · (+) = (−) &nbsp;→&nbsp; <strong>Verschiedene Vorzeichen: Minus</strong>
        </div>
      `,
      formulas: [
        {
          name: "Vorzeichenregel (· und :)",
          html: `(−a) · (−b) = +(a · b)  &nbsp;·&nbsp;  (−a) : b = −(a : b)`,
          quantities: "a, b > 0; gleiche Vorzeichen → +, ungleiche → −",
        },
      ],
      quiz: {
        question: "Was ergibt (−2,4) : (−0,6)?",
        options: ["+4", "−4", "−0,4"],
        correctIndex: 0,
        explanation:
          "Gleiche Vorzeichen (− durch −) ergeben Plus (+). 2,4 : 0,6 = 24 : 6 = 4.",
      },
      lab: lab(
        "sign-rules-grid",
        "Vorzeichen-Labor (· und :)",
        "Teste verschiedene Vorzeichenkombinationen für Multiplikation und Division.",
        [
          range("a", "1. Zahl a", -6, 6, -4, 1),
          range("bMag", "Betrag 2. Zahl", 1, 5, 2, 1),
          choice("bSign", "Vorzeichen b", ["positiv (+)", "negativ (−)"], 1),
          choice("op", "Rechenart", ["Multiplikation (·)", "Division (:)"], 0),
        ],
        [
          output(
            "res",
            "Ergebnis",
            (v) => {
              const b = v.bSign === 0 ? v.bMag : -v.bMag;
              return v.op === 0 ? v.a * b : v.a / b;
            },
            "",
            2,
            true,
          ),
        ],
        [
          {
            id: "neg-times-neg",
            text: "Zeige mit (−) · (−) genau das Ergebnis +15.",
            check: (v, r) => v.op === 0 && v.a < 0 && v.bSign === 1 && near(Number(r.res), 15, 0.01),
          },
          {
            id: "div-neg",
            text: "Berechne durch Division ein Ergebnis von genau −3.",
            check: (v, r) => v.op === 1 && near(Number(r.res), -3, 0.01),
          },
          {
            id: "zero-prod",
            text: "Erzeuge bei Division durch eine negative Zahl das Ergebnis 0.",
            check: (v, r) => v.op === 1 && v.bSign === 1 && near(Number(r.res), 0, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "mul-div-signs",
          make(rng, level) {
            const a = rng.pick([-8, -6, -4, -3, -2, 3, 4, 6]) * 0.5;
            const b = rng.pick([-5, -4, -2, -1.5, 1.5, 2, 4]);
            const prod = Number((a * b).toFixed(2));
            const timeText =
              b >= 0
                ? `Welcher Temperaturunterschied zu jetzt entsteht in ${fmt(b, 1)} Stunden (+${fmt(b, 1)} h)? Rechnung: (${fmt(a, 1)}) · (${fmt(b, 1)}).`
                : `Wie groß war der Temperaturunterschied vor ${fmt(Math.abs(b), 1)} Stunden gegenüber jetzt (Rückschritt ${fmt(b, 1)} h)? Rechnung: (${fmt(a, 1)}) · (${fmt(b, 1)}).`;
            return task(
              level,
              `Berechne das Produkt mit Vorzeichen: (${fmt(a, 1)}) · (${fmt(b, 1)}).`,
              `In einem Kühlhaus ändert sich die Temperatur pro Stunde um ${fmt(a, 1)} °C. ${timeText}`,
              [numberField("Produkt =", prod, "", 2, {
                slips: [{ value: -prod, hint: "Prüfe das Vorzeichen: gleiche Vorzeichen ergeben +, ungleiche ergeben −!" }],
              })],
              "Multipliziere erst die Beträge und bestimme danach das Vorzeichen.",
              [
                `Betrag: ${fmt(Math.abs(a), 1)} · ${fmt(Math.abs(b), 1)} = ${fmt(Math.abs(prod), 2)}`,
                `${(a < 0) === (b < 0) ? "Gleiche Vorzeichen → +" : "Ungleiche Vorzeichen → −"}: <strong>${fmt(prod, 2)}</strong>`,
              ],
              { a, b, prod },
            );
          },
        },
        {
          id: "div-q-dec",
          make(rng, level) {
            const q = rng.pick([-4, -3, -2.5, -1.5, 2.5, 3, 4]);
            const divisor = rng.pick([-2, -0.5, 0.5, 2]);
            const dividend = Number((q * divisor).toFixed(2));
            return task(
              level,
              `Berechne den Quotienten rationaler Zahlen: (${fmt(dividend, 2)}) : (${fmt(divisor, 1)}).`,
              `Eine Wasserstandsänderung von insgesamt ${fmt(dividend, 2)} cm verteilt sich auf Teilabschnitte. Berechne (${fmt(dividend, 2)}) : (${fmt(divisor, 1)}).`,
              [numberField("Quotient =", q, "", 2)],
              "Teile Betrag durch Betrag (Komma bei beiden um gleich viele Stellen verschieben) und prüfe das Vorzeichen.",
              [
                `Betrag: ${fmt(Math.abs(dividend), 2)} : ${fmt(Math.abs(divisor), 1)} = ${fmt(Math.abs(q), 2)}`,
                `<strong>${fmt(q, 2)}</strong>`,
              ],
              { dividend, divisor, q },
            );
          },
        },
      ],
    }),

    makeLesson(2, 4, LB, {
      id: "rz-4-rechenregeln-vorteilhaft",
      title: "Vorteilhaft rechnen & Überschlag in ℚ",
      subtitle: "Rechengesetze (Punkt-vor-Strich, Klammern) mit Dezimalzahlen und im M-Zug Brüchen",
      tracks: BOTH,
      whyItMatters:
        "Geschicktes Vertauschen oder Ausklammern spart Zeit und verhindert Vorzeichenfehler — und ein Überschlag zeigt sofort, ob das Ergebnis stimmen kann.",
      explanationHtml: `
        <p>Alle bekannten Rechengesetze gelten auch für rationale Zahlen: <strong>Klammer vor Punkt vor Strich</strong> sowie Kommutativ- und Assoziativgesetz zum geschickten Gruppieren.</p>
        <div class="example">
          <strong>Beispiel (vorteilhaft rechnen):</strong><br>
          (−4) · 3,7 · (−2,5) = (−4) · (−2,5) · 3,7 = 10 · 3,7 = <strong>37</strong><br>
          <em>Division (M-Zug auch mit Bruch-Divisor):</em> (−3) : (${frac(1, 2)}) = (−3) · 2 = <strong>−6</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Suche Paare, die runde Zahlen ergeben (wie 4 · 2,5 = 10 oder −1,5 − 2,5 = −4). Bei Brüchen teilst du, indem du mit dem Kehrwert malnimmst!
        </div>
      `,
      formulas: [
        {
          name: "Division durch einen Bruch (M7)",
          html: `a : ${frac("z", "n")} = a · ${frac("n", "z")}`,
          quantities: "a ∈ ℚ, z/n ∈ ℚ \\ {0}",
        },
      ],
      quiz: {
        question: "Was ergibt (−2) · 4,8 · (−5)?",
        options: ["+48", "−48", "+4,8"],
        correctIndex: 0,
        explanation:
          "Vorteilhaft umordnen: (−2) · (−5) = +10, dann 10 · 4,8 = +48.",
      },
      lab: lab(
        "sign-rules-grid",
        "Rechenproben-Labor",
        "Prüfe Multiplikationen und Divisionen durch kleine Dezimal- oder Bruchzahlen.",
        [
          range("a", "Dividend / Faktor a", -6, 6, -3, 1),
          range("bMag", "Betrag b", 1, 4, 2, 1),
          choice("bSign", "Vorzeichen b", ["positiv (+)", "negativ (−)"], 1),
          choice("op", "Rechenart", ["Multiplikation (·)", "Division (:)"], 1),
        ],
        [
          output(
            "res",
            "Ergebnis",
            (v) => {
              const b = v.bSign === 0 ? v.bMag : -v.bMag;
              return v.op === 0 ? v.a * b : v.a / b;
            },
            "",
            2,
            true,
          ),
        ],
        [
          {
            id: "half-neg",
            text: "Teile a = −6 durch −4 und lies +1,5 ab.",
            check: (v, r) => v.op === 1 && v.a === -6 && v.bMag === 4 && v.bSign === 1 && near(Number(r.res), 1.5, 0.01),
          },
          {
            id: "prod-24",
            text: "Erreiche genau +24 durch zwei negative Faktoren.",
            check: (v, r) => v.op === 0 && v.a < 0 && v.bSign === 1 && near(Number(r.res), 24, 0.01),
          },
          {
            id: "div-neg-1",
            text: "Finde ein Zahlenpaar, bei dem der Quotient genau −1 ist.",
            check: (v, r) => v.op === 1 && near(Number(r.res), -1, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "order-of-ops-q",
          make(rng, level) {
            const a = rng.int(-6, -2);
            const b = rng.int(2, 6);
            const c = rng.pick([-3, -2, 2, 3]);
            const ans = a + b * c;
            return task(
              level,
              `Berechne nach Punkt-vor-Strich: (${fmt(a)}) + ${b} · (${fmt(c)}).`,
              `Auf einer Gebirgswanderung startet man bei ${fmt(a)} °C und steigt ${b} Höhenstufen hinab/hinauf, wobei sich pro Stufe die Temperatur um ${fmt(c)} °C ändert. Wie viel Grad zeigt das Thermometer?`,
              [numberField("Ergebnis =", ans, "", 0, {
                slips: [{ value: (a + b) * c, hint: "Punkt-vor-Strich beachten! Zuerst multiplizieren, danach addieren." }],
              })],
              "Punkt-vor-Strich: erst b · c berechnen, dann zu a addieren.",
              [
                `Produkt zuerst: ${b} · (${fmt(c)}) = ${fmt(b * c)}`,
                `${fmt(a)} + (${fmt(b * c)}) = <strong>${fmt(ans)}</strong>`,
              ],
              { a, b, c, ans },
            );
          },
        },
        {
          id: "smart-pair-q",
          make(rng, level) {
            const pair = rng.pick([
              [-4, -2.5, 10],
              [-2, -0.5, 1],
              [-5, 0.2, -1],
              [-8, -1.25, 10],
            ]);
            const mid = rng.stepped(-9.5, 9.5, 0.5) || 3.5;
            const ans = Number((pair[2] * mid).toFixed(2));
            return task(
              level,
              `Rechne vorteilhaft: (${fmt(pair[0], 2)}) · (${fmt(mid, 1)}) · (${fmt(pair[1], 2)}).`,
              `Ein Werkstück wird mit dem Korrekturfaktor (${fmt(pair[0], 2)}) · (${fmt(mid, 1)}) · (${fmt(pair[1], 2)}) verrechnet. Nutze das Vertauschungsgesetz geschickt!`,
              [numberField("Produkt =", ans, "", 2)],
              `Multipliziere zuerst (${fmt(pair[0], 2)}) · (${fmt(pair[1], 2)}) = ${fmt(pair[2])}.`,
              [
                `Umordnen: (${fmt(pair[0], 2)}) · (${fmt(pair[1], 2)}) · (${fmt(mid, 1)})`,
                `= ${fmt(pair[2])} · (${fmt(mid, 1)}) = <strong>${fmt(ans, 2)}</strong>`,
              ],
              { ans },
            );
          },
        },
      ],
    }),
  ],
);
