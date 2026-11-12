import { near, numberField } from "./helpers";
import {
  BOTH,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";
import { fmt } from "../exercises/format";

const LB: [number | null, number] = [7, 7];

export const STAGE_GLEICHUNGEN = makeStage(
  7,
  "Terme & Gleichungen in ℚ",
  "Terme mit Rechengesetzen (auch mehrere Variable) vereinfachen, Klammergleichungen mit x auf beiden Seiten lösen, rückwärts schließen und Sachaufgaben modellieren",
  "#4f46e5",
  "⚖️",
  LB,
  [
    // 7.1 Alltagssituationen & Terme vereinfachen (K/A/D-Gesetze, M8 auch mehrere Variable) (R + M)
    makeLesson(7, 1, LB, {
      id: "gl-1-terme-k-a-d-gesetz",
      title: "Terme aufstellen & vereinfachen in ℚ",
      subtitle: "Kommutativ-, Assoziativ- und Distributivgesetz (M8 auch mit mehreren Variablen)",
      tracks: BOTH,
      whyItMatters:
        "Lange Rechenausdrücke aus dem Alltag — etwa Rabatte, Umfänge oder Bestellungen — werden durch Ausmultiplizieren und Sortieren erst übersichtlich.",
      explanationHtml: `
        <p>Beim Vereinfachen in ℚ nutzt du die drei Rechengesetze: Vertauschungsgesetz (<strong>Kommutativgesetz</strong>), Verbindungsgesetz (<strong>Assoziativgesetz</strong>) und Verteilungsgesetz (<strong>Distributivgesetz</strong>).</p>
        <div class="example">
          <strong>Beispiel:</strong> Vereinfache −2 · (3x − 4y) + 5x − 2y:<br>
          1. Klammer ausmultiplizieren (Minus vor der Klammer dreht alle Zeichen!): −6x + 8y + 5x − 2y<br>
          2. Gleichartige Variablen sortieren: (−6x + 5x) + (8y − 2y) = <strong>−x + 6y</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Steht ein <strong>Minuszeichen vor einer Klammer</strong>, kehren sich beim Auflösen alle Vor- und Rechenzeichen darin um! Gleichnamige Variablen (wie x mit x, y mit y) darfst du zusammenfassen — verschiedene Buchstaben niemals!
        </div>
      `,
      formulas: [
        {
          name: "Distributivgesetz",
          html: "a · (b + c) = a · b + a · c",
          quantities: "Jedes Glied innen mit a (inkl. Vorzeichen!) multiplizieren",
        },
        {
          name: "Minusklammer auflösen",
          html: "−(a − b) = −a + b",
          quantities: "Alle Zeichen in der Klammer umkehren",
        },
      ],
      quiz: {
        question: "Was entsteht beim korrekten Auflösen von 4x − 2 · (x − 3)?",
        options: ["2x + 6", "2x − 6", "2x − 3"],
        correctIndex: 0,
        explanation:
          "−2 · x = −2x und −2 · (−3) = +6 (Minus mal Minus gibt Plus!). Also 4x − 2x + 6 = 2x + 6.",
      },
      lab: lab(
        "term-distributive",
        "Distributivgesetz sichtbar machen",
        "Verändere Faktor a und die Glieder (bx + c) und sieh, dass a·(bx + c) immer denselben Flächenwert hat wie ab·x + ac.",
        [
          range("a", "Faktor a", 2, 5, 3, 1),
          range("b", "x-Faktor b", 1, 4, 2, 1),
          range("c", "Zahlglied c", 1, 7, 5, 1),
          range("x", "Testwert x", 1, 4, 2, 1),
        ],
        [
          output("leftVal", "a·(b·x + c)", (v) => v.a * (v.b * v.x + v.c), "", 0, true),
          output("rightVal", "ab·x + ac", (v) => v.a * v.b * v.x + v.a * v.c, "", 0),
        ],
        [
          {
            id: "reach-60",
            text: "Erreiche einen Termwert von genau 60 bei a = 4 und b = 2.",
            check: (v, r) => v.a === 4 && v.b === 2 && near(Number(r.leftVal), 60, 0.01),
          },
          {
            id: "set-5-3-1",
            text: "Stelle 5 · (3x + 1) bei x = 2 ein (Wert = 35).",
            check: (v, r) => v.a === 5 && v.b === 3 && v.c === 1 && v.x === 2 && near(Number(r.leftVal), 35, 0.01),
          },
          {
            id: "equal-parts",
            text: "Bilde zwei gleich große Rechtecksflächen (b · x = c) mit a = 3.",
            check: (v) => v.a === 3 && v.b * v.x === v.c,
          },
        ],
      ),
      exercises: [
        {
          id: "expand-minus-bracket",
          make(rng, level) {
            const xTerm = rng.int(4, 9);
            const k = rng.pick([2, 3, 4]);
            const inside = rng.int(1, 5);
            const coeff = xTerm - k;
            const constTerm = k * inside;
            const xVal = rng.int(1, 4);
            const val = coeff * xVal + constTerm;
            return task(
              level,
              `Löse die Klammer auf und fasse zusammen: ${xTerm}x − ${k} · (x − ${inside}). Gib den Faktor vor x und den Wert für x = ${xVal} an.`,
              `Ein Preisvergleich liefert den Ausdruck ${xTerm}x − ${k} · (x − ${inside}). Vereinfache den Term vollständig und berechne anschließend seinen Wert für x = ${xVal}.`,
              [
                numberField("Faktor vor x =", coeff, "", 0),
                numberField("Zahlglied =", constTerm, "", 0, {
                  slips: [
                    {
                      value: -constTerm,
                      hint: "Minus mal Minus (−k · (−c)) ergibt Plus! Vorzeichen beim Ausmultiplizieren prüfen.",
                    },
                  ],
                }),
                numberField(`Termwert für x = ${xVal}:`, val, "", 0),
              ],
              "−k · (x − c) = −kx + k·c",
              [
                `${xTerm}x − ${k}x + ${constTerm} = ${coeff}x + ${constTerm}`,
                `Für x = ${xVal}: ${coeff} · ${xVal} + ${constTerm} = <strong>${val}</strong>`,
              ],
              { coeff, constTerm, val },
            );
          },
        },
        {
          id: "multi-variable-simplify",
          make(rng, level) {
            const a = rng.int(2, 6);
            const b = rng.int(2, 5);
            const c = rng.int(1, 4);
            const d = rng.int(1, 4);
            const factorX = a + c;
            const factorY = b - d;
            const x = rng.int(2, 4);
            const y = rng.int(-2, 3) || 2;
            const res = factorX * x + factorY * y;
            return task(
              level,
              `Vereinfache den Term (${a}x + ${b}y) + (${c}x − ${d}y) und bestimme den Wert für x = ${x} und y = ${fmt(y)}.`,
              `Eine Einkaufsbestellung enthält ${a} Pakete zu x € und ${b} Rollen zu y €, später kommen ${c}x hinzu und ${d}y werden storniert. Berechne die Gesamtfaktoren für x, für y sowie den Wert bei x = ${x} €, y = ${fmt(y)} €.`,
              [
                numberField("Faktor vor x =", factorX, "", 0),
                numberField("Faktor vor y =", factorY, "", 0),
                numberField("Gesamtwert =", res, level === 1 ? "" : "€", 0),
              ],
              "x-Glieder und y-Glieder getrennt zusammenfassen, danach einsetzen.",
              [
                `x-Teil: (${a} + ${c})x = ${factorX}x · y-Teil: (${b} − ${d})y = ${fmt(factorY)}y`,
                `Einsetzen: ${factorX}·${x} + (${fmt(factorY)})·(${fmt(y)}) = <strong>${fmt(res)}</strong>`,
              ],
              { factorX, factorY, res },
            );
          },
        },
      ],
    }),

    // 7.2 Gleichungen mit Klammern, mehrmals x, Fehler & Rückschluss (R + M)
    makeLesson(7, 2, LB, {
      id: "gl-2-gleichungen-klammern",
      title: "Gleichungen mit Klammern & Rückschluss",
      subtitle: "Mehrmals x, Wechsel Bruch/Dezimal, Fehler berichtigen und Ausgangsgleichung rekonstruieren",
      tracks: BOTH,
      whyItMatters:
        "Wenn die Unbekannte x auf beiden Seiten oder in einer Klammer steht, führst du die Gleichung Schritt für Schritt auf ax = b zurück — und kontrollierst jeden Rechenfehler mit der Probe.",
      explanationHtml: `
        <p>Bei komplexeren Gleichungen arbeitest du immer in derselben klaren Reihenfolge:</p>
        <div class="example">
          <strong>Beispiel:</strong> 3 · (x − 2) = 2x + 4<br>
          1. Klammern auflösen: 3x − 6 = 2x + 4<br>
          2. x-Glieder auf eine Seite (| − 2x): x − 6 = 4<br>
          3. Zahlen auf die andere Seite (| + 6): <strong>x = 10</strong>.<br>
          <em>Rückschluss-Trick:</em> Wenn am Ende x = 5 steht und der letzte Schritt „| : 3“ war, hieß die Zeile davor <strong>3x = 15</strong>!
        </div>
        <div class="merke">
          <strong>Merke:</strong> 1) Klammern auflösen → 2) Zusammenfassen → 3) x auf eine Seite, Zahlen auf die andere → 4) Teilen → 5) Probe! Bei Brüchen wie 0,5x = ¼x + 2 wähle geschickt eine einheitliche Form (z. B. alles als Dezimalzahl oder Hauptnenner).
        </div>
      `,
      formulas: [
        {
          name: "Lösungsplan für Gleichungen in ℚ",
          html: "Klammern → Zusammenfassen → Sortieren → Teilen → Probe",
          quantities: "Auf beiden Seiten stets dieselbe Äquivalenzumformung ausführen",
        },
      ],
      quiz: {
        question: "Du kennst das Ergebnis x = 4. Der letzte Schritt war „| : (−2)“, davor „| − 5“. Wie hieß die ursprüngliche Gleichung?",
        options: ["−2x + 5 = −3", "−2x − 5 = 3", "2x + 5 = −8"],
        correctIndex: 0,
        explanation:
          "Rückwärts rechnen: x = 4 | ·(−2) → −2x = −8 | +5 → −2x + 5 = −3! Probe mit x = 4: −8 + 5 = −3.",
      },
      lab: lab(
        "balance-scale-q",
        "Balkenwaage mit x links & rechts",
        "Stelle eine Gleichung ax + b = cx + d ein und suche mit dem Regler Probe-x das exakte Gleichgewicht.",
        [
          range("a", "Links vor x (a)", 2, 6, 4, 1),
          range("b", "Links Zahl (b)", -6, 6, -4, 1),
          range("c", "Rechts vor x (c)", 1, 3, 2, 1),
          range("d", "Rechts Zahl (d)", -4, 8, 2, 1),
          range("guessX", "Dein Probe-x", -4, 8, 1, 0.5),
        ],
        [
          output("leftVal", "Linke Seite", (v) => v.a * v.guessX + v.b, "", 1),
          output("rightVal", "Rechte Seite", (v) => v.c * v.guessX + v.d, "", 1),
          output("diff", "Unterschied", (v) => v.a * v.guessX + v.b - (v.c * v.guessX + v.d), "", 1, true),
        ],
        [
          {
            id: "balance-start",
            text: "Bringe die Startgleichung 4x − 4 = 2x + 2 ins Gleichgewicht (finde Probe-x = 3).",
            check: (v, r) => v.a === 4 && v.b === -4 && v.c === 2 && v.d === 2 && near(Number(r.diff), 0, 0.01),
          },
          {
            id: "solve-half-step",
            text: "Löse 5x − 3 = 3x + 4 mit deinem Probe-x (halbe Zahl x = 3,5!).",
            check: (v, r) => v.a === 5 && v.b === -3 && v.c === 3 && v.d === 4 && near(Number(r.diff), 0, 0.01),
          },
          {
            id: "solve-neg",
            text: "Finde eine Lösung x < 0 für 3x + 6 = x − 2 (Gleichgewicht bei x = −4).",
            check: (v, r) => v.a === 3 && v.b === 6 && v.c === 1 && v.d === -2 && near(Number(r.diff), 0, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "bracket-both-sides",
          make(rng, level) {
            const x = rng.pick([-3, -2, -1.5, 1.5, 2, 3, 4, 5]);
            const k = rng.pick([2, 3, 4]);
            const p = rng.pick([-2, -1, 1, 2, 3]);
            const rightC = rng.int(1, k - 1);
            const leftVal = k * (x + p);
            const rightD = Number((leftVal - rightC * x).toFixed(2));
            const pTxt = p >= 0 ? `+ ${fmt(p)}` : `− ${fmt(Math.abs(p))}`;
            const dTxt = rightD >= 0 ? `+ ${fmt(rightD, 1)}` : `− ${fmt(Math.abs(rightD), 1)}`;
            return task(
              level,
              `Löse die Gleichung ${k} · (x ${pTxt}) = ${rightC === 1 ? "" : `${rightC}`}x ${dTxt} nach x auf.`,
              `Ein Schüler vergleicht zwei Handytarif-Terme: ${k} · (x ${pTxt}) = ${rightC === 1 ? "" : `${rightC}`}x ${dTxt}. Bestimme den gesuchten Wert x und führe im Kopf die Probe durch.`,
              [
                numberField("Lösung x =", x, "", 1, {
                  slips: [{ value: -x, hint: "Vorzeichen prüfen! Mache unbedingt die Probe in der Ausgangsgleichung." }],
                }),
              ],
              "Erst Klammer auflösen, dann x-Glieder sortieren.",
              [
                `${k}x ${k * p >= 0 ? `+ ${fmt(k * p)}` : `− ${fmt(Math.abs(k * p))}`} = ${rightC}x ${dTxt} | − ${rightC}x`,
                `x = <strong>${fmt(x, 1)}</strong>`,
              ],
              { k, p, rightC, rightD, x },
            );
          },
        },
        {
          id: "reverse-equation-step",
          make(rng, level) {
            const xSol = rng.pick([2, 3, 4, 5, -2]);
            const a = rng.pick([2, 3, 4]);
            const b = rng.pick([3, 5, 6, 7]);
            const rhs = a * xSol + b;
            return task(
              level,
              level === 1
                ? `Rückschluss: Am Ende steht x = ${fmt(xSol)}. Davor wurde durch ${a} geteilt und davor ${b} abgezogen (Startform ${a}x + ${b} = ?). Wie lautet die Zahl rechts?`
                : `Eine Umformung endet bei x = ${fmt(xSol)}. Die Schritte dorthin waren zuerst „| − ${b}“, danach „| : ${a}“. Berechne die fehlende rechte Seite der Startgleichung ${a}x + ${b} = ?`,
              `Ausgehend von der fertigen Lösung x = ${fmt(xSol)} sollen die Umformungsschritte „erst | − ${b}, dann | : ${a}“ rückgängig gemacht werden. Welche Zahl stand anfangs rechts in ${a}x + ${b} = ?`,
              [numberField("Rechte Zahl =", rhs, "", 0)],
              "Arbeite genau in umgekehrter Reihenfolge zurück: erst malnehmen, dann addieren.",
              [
                `Schritt 1 umkehren (· ${a}): ${a}x = ${fmt(a * xSol)}`,
                `Schritt 2 umkehren (+ ${b}): ${a}x + ${b} = <strong>${fmt(rhs)}</strong>`,
              ],
              { xSol, a, b, rhs },
            );
          },
        },
      ],
    }),

    // 7.3 Text-, Mischungs- und Knobelaufgaben (R + M)
    makeLesson(7, 3, LB, {
      id: "gl-3-sachaufgaben-mischungen",
      title: "Text-, Mischungs- & Knobelaufgaben",
      subtitle: "Realsituationen mathematisieren, Mischungen berechnen und Ergebnisse am Text prüfen",
      tracks: BOTH,
      whyItMatters:
        "Im Abschluss und im Beruf steht keine fertige Gleichung da — die eigentliche Kunst ist es, aus einem Text den passenden Ansatz aufzustellen und am Sinn zu prüfen.",
      explanationHtml: `
        <p>Bei <strong>Text-, Zahlenrätsel- und Mischungsaufgaben</strong> legst du zuerst klar fest, wofür x steht (z. B. „x = gesuchte Menge in Litern“).</p>
        <div class="example">
          <strong>Beispiel (Mischung):</strong> Wie viel Liter 30-%-Apfelsaft (x) müssen mit 10 Litern 60-%-Saft gemischt werden, um eine 40-%-Mischung zu erhalten?<br>
          Reiner Saft-Ansatz: <strong>0,30 · x + 0,60 · 10 = 0,40 · (x + 10)</strong><br>
          0,30x + 6 = 0,40x + 4 → 2 = 0,10x → <strong>x = 20 Liter</strong>!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Bei einer <strong>Mischungsaufgabe</strong> bleibt immer die Gesamtmenge der reinen Zutat (Menge · Konzentration) vor und nach dem Mischen gleich! Am Schluss prüfst du: Ist die Lösung sinnvoll (keine negative Kilozahl)?
        </div>
      `,
      formulas: [
        {
          name: "Mischungsgleichung (Sorten / Konzentrationen)",
          html: "m₁ · p₁ + m₂ · p₂ = (m₁ + m₂) · p<sub>Misch</sub>",
          quantities: "Einheitswerte (z. B. € pro kg oder Prozentanteil) · Menge",
        },
      ],
      quiz: {
        question: "Du willst ein 52 cm langes Seil in zwei Stücke teilen, wobei das zweite 6 cm länger ist als das erste. Welche Gleichung passt?",
        options: ["x + (x + 6) = 52", "x + 6 = 52", "2x − 6 = 52"],
        correctIndex: 0,
        explanation:
          "Erstes Stück x plus zweites Stück (x + 6) ergeben zusammen die gesamte Seillänge 52 cm: 2x + 6 = 52 → x = 23 cm.",
      },
      lab: lab(
        "balance-scale-q",
        "Textaufgabe als Gleichgewicht testen",
        "Übersetze das Knobelbeispiel ‚x + (x + d) = Ziel‘ oder zwei Tarife auf der Balkenwaage und finde den Treffpunkt x.",
        [
          range("a", "Links Faktor a", 1, 5, 2, 1),
          range("b", "Links Startwert b", -4, 12, 6, 1),
          range("c", "Rechts Faktor c", 0, 4, 0, 1),
          range("d", "Rechts Wert d", 8, 30, 22, 2),
          range("guessX", "Probe-x", 0, 14, 4, 0.5),
        ],
        [
          output("leftVal", "Links", (v) => v.a * v.guessX + v.b, "", 1),
          output("rightVal", "Rechts", (v) => v.c * v.guessX + v.d, "", 1),
          output("diff", "Abweichung", (v) => v.a * v.guessX + v.b - (v.c * v.guessX + v.d), "", 1, true),
        ],
        [
          {
            id: "rope-22",
            text: "Löse das Seilrätsel 2x + 6 = 22 (Stelle c = 0, d = 22 und finde Probe-x = 8).",
            check: (v, r) => v.a === 2 && v.b === 6 && v.c === 0 && v.d === 22 && near(Number(r.diff), 0, 0.01),
          },
          {
            id: "tariff-meet",
            text: "Wann sind Tarif A (4·x + 0) und Tarif B (2·x + 12) gleich teuer?",
            check: (v, r) => v.a === 4 && v.b === 0 && v.c === 2 && v.d === 12 && near(Number(r.diff), 0, 0.01),
          },
          {
            id: "age-riddle",
            text: "Finde Probe-x = 6 für 3x − 4 = x + 8.",
            check: (v, r) => v.a === 3 && v.b === -4 && v.c === 1 && v.d === 8 && near(Number(r.diff), 0, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "word-perimeter-eq",
          make(rng, level) {
            const w = rng.int(5, 14);
            const diff = rng.int(3, 8);
            const len = w + diff;
            const U = 2 * (w + len);
            return task(
              level,
              `Ein Rechteck mit Umfang U = ${U} cm ist ${diff} cm länger als breit. Berechne die Breite x in cm.`,
              `Ein Gärtner zäunt ein rechteckiges Beet mit insgesamt ${U} m Maschendraht ein. Die Länge beträgt genau ${diff} m mehr als die Breite. Wie breit und wie lang ist das Beet?`,
              level === 1
                ? [numberField("Breite x =", w, "cm", 0)]
                : [
                    numberField("Breite x =", w, "m", 0),
                    numberField("Länge =", len, "m", 0),
                  ],
              "2 · x + 2 · (x + diff) = U → 4x + 2 · diff = U",
              [
                `4x + ${2 * diff} = ${U} → 4x = ${U - 2 * diff}`,
                level === 1 ? `x = <strong>${w} cm</strong>` : `Breite = ${w} m, Länge = <strong>${len} m</strong>`,
              ],
              { w, len, diff, U },
            );
          },
        },
        {
          id: "coffee-mix-problem",
          make(rng, level) {
            // x kg Sorte A zu 8 EUR + m2 kg Sorte B zu 14 EUR = Mischung zu 10 EUR (clean integers!)
            // 8x + 14*m2 = 10*(x + m2) => 4*m2 = 2x => x = 2*m2!
            const m2 = rng.pick([4, 6, 8, 10]);
            const x = 2 * m2;
            const p1 = 8;
            const p2 = 14;
            const pMix = 10;
            return task(
              level,
              `Mische x kg Nusssorte A (${p1} €/kg) mit ${m2} kg Sorte B (${p2} €/kg), sodass der Kilopreis der Mischung ${pMix} € beträgt. Berechne x.`,
              `Eine Rösterei mischt eine preiswerte Bohnensorte (${p1} €/kg) mit ${m2} kg einer Edelsorte (${p2} €/kg). Wie viele Kilogramm der günstigeren Sorte müssen dazu, damit die fertige Mischung exakt ${pMix} €/kg wert ist?`,
              [numberField("Menge Sorte A (x) =", x, "kg", 0)],
              `${p1}·x + ${p2}·${m2} = ${pMix}·(x + ${m2})`,
              [
                `${p1}x + ${p2 * m2} = ${pMix}x + ${pMix * m2}`,
                `${p2 * m2 - pMix * m2} = ${pMix - p1}x → x = <strong>${x} kg</strong>`,
              ],
              { m2, x },
            );
          },
        },
      ],
    }),
  ],
);
