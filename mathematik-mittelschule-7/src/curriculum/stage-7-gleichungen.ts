import { fmt, frac } from "../exercises/format";
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

const LB = [7, 7] as [number, number];

export const STAGE_GLEICHUNGEN = makeStage(
  7,
  "Gleichungen",
  "Terme in ℤ aufstellen, vereinfachen und einsetzen; Balkenwaage und Gleichungen ax + b = c lösen",
  "#16a34a",
  "⚖️",
  LB,
  [
    makeLesson(7, 1, LB, {
      id: "gl-1-terme-vereinfachen",
      title: "Terme aufstellen, vereinfachen & einsetzen",
      subtitle: "Rechengesetze (Kommutativ-, Assoziativ-, Distributivgesetz) und Variablenwerte in ℤ",
      tracks: BOTH,
      whyItMatters:
        "Einen Rechenausdruck mit x als Platzhalter kannst du immer wieder für neue Zahlen nutzen — und wer ihn vorher vereinfacht, spart sich halbe Seiten Arbeit.",
      explanationHtml: `
        <p>Ein <strong>Term</strong> beschreibt eine Rechenvorschrift mit Zahlen und Variablen (z. B. <strong>x</strong>). Durch Einsetzen einer ganzen Zahl x ∈ ℤ erhält der Term seinen Zahlenwert.</p>
        <div class="example">
          <strong>Beispiel (Vereinfachen &amp; Einsetzen):</strong><br>
          Term: 3 · (x + 2) + 2x − 1<br>
          1) Distributivgesetz (Ausmultiplizieren): 3x + 6 + 2x − 1<br>
          2) Gleichartige Glieder zusammenfassen: <strong>5x + 5</strong><br>
          3) Einsetzen von x = −3: 5 · (−3) + 5 = −15 + 5 = <strong>−10</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Addiere und subtrahiere immer nur <strong>gleichartige Glieder</strong> (x-Glieder mit x-Gliedern, reine Zahlen mit reinen Zahlen).
        </div>
      `,
      formulas: [
        {
          name: "Distributivgesetz (Ausmultiplizieren)",
          html: `a · (b + c) = a · b + a · c`,
          quantities: "a, b, c ∈ ℤ; Faktor vor der Klammer trifft jedes Glied darin",
        },
      ],
      quiz: {
        question: "Welcher Term ist zu 4 · (x − 2) + 3x gleichwertig?",
        options: ["7x − 8", "7x − 2", "12x − 8"],
        correctIndex: 0,
        explanation:
          "4 · (x − 2) = 4x − 8. Dazu + 3x ergibt 7x − 8.",
      },
      lab: lab(
        "term-eval",
        "Termmaschine T(x) = a · x + b",
        "Ziehe die Variable x ∈ ℤ und beobachte, wie sich der Termwert bei jedem Schritt um a verändert.",
        [
          range("a", "Faktor a", -4, 4, 3, 1),
          range("b", "Zahlglied b", -6, 6, -2, 1),
          range("x", "Variable x", -4, 5, 2, 1),
        ],
        [
          output("val", "Termwert T(x)", (v) => v.a * v.x + v.b, "", 0, true),
        ],
        [
          {
            id: "neg-input",
            text: "Setze in T(x) = 3x − 2 den Wert x = −4 ein und lies −14 ab.",
            check: (v, r) => v.a === 3 && v.b === -2 && v.x === -4 && near(Number(r.val), -14, 0.01),
          },
          {
            id: "zero-out",
            text: "Finde ein x für a = 2, b = −6, bei dem der Termwert genau 0 wird.",
            check: (v, r) => v.a === 2 && v.b === -6 && near(Number(r.val), 0, 0.01),
          },
          {
            id: "neg-coeff",
            text: "Teste einen negativen Faktor a = −2 mit x = −3 und b = +1 (Ergebnis +7).",
            check: (v, r) => v.a === -2 && v.x === -3 && v.b === 1 && near(Number(r.val), 7, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "eval-integer-term",
          make(rng, level) {
            const a = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
            const b = rng.int(-7, 7) || 3;
            const x = rng.int(-5, 5) || -2;
            const val = a * x + b;
            const bText = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
            return task(
              level,
              `Berechne den Termwert von ${fmt(a)} · x ${bText} für x = ${fmt(x)}.`,
              `Die Kosten einer Werkstattformel betragen in einem Modell T(x) = ${fmt(a)} · x ${bText} Punkte. Welchen Wert ergibt x = ${fmt(x)}?`,
              [numberField("T(x) =", val, "", 0)],
              `Setze ${fmt(x)} statt x ein und beachte Punkt-vor-Strich sowie das Vorzeichen.`,
              [
                `${fmt(a)} · (${fmt(x)}) ${bText} = ${fmt(a * x)} ${bText}`,
                `<strong>${fmt(val)}</strong>`,
              ],
              { a, b, x, val },
            );
          },
        },
        {
          id: "simplify-collect",
          make(rng, level) {
            const a = rng.int(2, 6);
            const c = rng.int(2, 5);
            const b = rng.int(1, 5);
            const d = rng.int(1, 6);
            const coeff = a + c;
            const constTerm = a * b - d;
            const xTest = rng.int(1, 4);
            const totalVal = coeff * xTest + constTerm;
            return task(
              level,
              `Vereinfache ${a} · (x + ${b}) + ${c}x − ${d} und gib die Zahl vor x sowie das Zahlglied an.`,
              `Ein Paketdienst verlangt für jede von x Kisten nach Rabatt den Term ${a} · (x + ${b}) + ${c}x − ${d}. Fasse den Term so weit wie möglich zusammen (Form: ?·x + ?) und berechne den Wert für x = ${xTest}.`,
              [
                numberField("Faktor vor x =", coeff, "", 0),
                numberField("Zahlglied =", constTerm, "", 0),
                numberField(`Wert für x = ${xTest}:`, totalVal, "", 0),
              ],
              "Erst Klammer ausmultiplizieren (a·x + a·b), dann x-Teile und Zahlen getrennt zusammenfassen.",
              [
                `${a}x + ${a * b} + ${c}x − ${d} = ${coeff}x ${constTerm >= 0 ? `+ ${constTerm}` : `− ${Math.abs(constTerm)}`}`,
                `Für x = ${xTest}: ${coeff} · ${xTest} ${constTerm >= 0 ? `+ ${fmt(constTerm)}` : `− ${fmt(Math.abs(constTerm))}`} = <strong>${fmt(totalVal)}</strong>`,
              ],
              { coeff, constTerm, totalVal },
            );
          },
        },
      ],
    }),

    makeLesson(7, 2, LB, {
      id: "gl-2-waage-aequivalenz",
      title: "Gleichungen & Balkenwaage",
      subtitle: "Sachsituationen als Gleichung notieren, systematisch probieren und Umformungen verstehen",
      tracks: BOTH,
      whyItMatters:
        "Eine Gleichung verhält sich genau wie eine Waage: Was du links wegnimmst oder verdoppelst, musst du exakt genauso rechts tun!",
      explanationHtml: `
        <p>Eine <strong>Gleichung</strong> setzt zwei Terme mit dem Gleichheitszeichen „=“ gleich. Das Bild einer <strong>Balkenwaage</strong> zeigt die goldene Regel der <strong>Äquivalenzumformung</strong>:</p>
        <div class="example">
          <strong>Beispiel:</strong> 2x + 3 = 11<br>
          • Nimm auf <em>beiden Seiten</em> 3 Kugeln weg (| − 3): 2x = 8<br>
          • Teile <em>beide Seiten</em> durch 2 (| : 2): <strong>x = 4</strong>.<br>
          <em>Probe:</em> 2 · 4 + 3 = 8 + 3 = 11 ✓.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Eine Umformung heißt <strong>Äquivalenzumformung</strong>, wenn auf beiden Seiten genau dasselbe (Strich- bzw. Punktrechnung ≠ 0) gemacht wird. Die Lösungsmenge bleibt dann gleich!
        </div>
      `,
      formulas: [
        {
          name: "Waageprinzip",
          html: `A = B &nbsp;⇔&nbsp; A − c = B − c &nbsp;⇔&nbsp; A : k = B : k (k ≠ 0)`,
          quantities: "auf beiden Seiten genau dieselbe Rechenoperation",
        },
      ],
      quiz: {
        question: "Welche Umformung verändert die Waage NICHT aus dem Gleichgewicht (ist also korrekt)?",
        options: [
          "Auf beiden Seiten derselben Zahl abziehen (| − 5).",
          "Nur auf der linken Seite 5 abziehen.",
          "Links durch 3 teilen und rechts 3 abziehen.",
        ],
        correctIndex: 0,
        explanation:
          "Nur wenn auf BEIDEN Waagschalen dieselbe Operation geschieht, bleibt das Gleichgewicht erhalten.",
      },
      lab: lab(
        "balance-scale",
        "Balkenwaage ausbalancieren",
        "Stelle Parameter für a·x + b = c ein und bewege den Probe-Schieber x bis die Waage waagrecht steht.",
        [
          range("a", "Gewichte a vor x", 1, 4, 2, 1),
          range("b", "Kugeln b links", 0, 8, 3, 1),
          range("xTrue", "Gesuchte Lösung (verdecktes Ziel)", -4, 6, 4, 1),
          range("guessX", "Dein Probe-x", -4, 6, 1, 1),
        ],
        [
          output("lhs", "Linke Schale", (v) => v.a * v.guessX + v.b, "", 0),
          output("rhs", "Rechte Schale c", (v) => v.a * v.xTrue + v.b, "", 0),
          output("status", "Waage", (v) => (v.a * v.guessX === v.a * v.xTrue ? "im Gleichgewicht!" : "schief"), "", 0, true),
        ],
        [
          {
            id: "balance-init",
            text: "Bringe die Startgleichung 2x + 3 = 11 ins Gleichgewicht!",
            check: (v) => v.guessX === v.xTrue && v.a === 2 && v.b === 3 && v.xTrue === 4,
          },
          {
            id: "balance-neg-x",
            text: "Löse eine Gleichung mit negativer Lösung x = −2 auf der Waage.",
            check: (v) => v.xTrue === -2 && v.guessX === -2,
          },
          {
            id: "balance-coeff3",
            text: "Stelle a = 3, b = 4, Ziel = 5 ein und finde die Balance.",
            check: (v) => v.a === 3 && v.b === 4 && v.xTrue === 5 && v.guessX === 5,
          },
        ],
      ),
      exercises: [
        {
          id: "context-to-equation",
          make(rng, level) {
            const per = rng.int(3, 9);
            const fee = rng.int(4, 12);
            const x = rng.int(4, 10);
            const total = per * x + fee;
            return task(
              level,
              `Für x Tickets zu je ${per} € plus ${fee} € Versand zahlt man ${total} €. Bestimme x.`,
              `Mia kauft im Internet x Kinokarten zu je ${per} € und zahlt einmalig ${fee} € Servicegebühr. Die Gesamtrechnung beträgt ${total} €. Wie viele Karten hat sie bestellt?`,
              [numberField("x =", x, "Karten", 0)],
              `Stelle ${per} · x + ${fee} = ${total} auf, ziehe ${fee} ab und teile durch ${per}.`,
              [
                `Gleichung: ${per}x + ${fee} = ${total}  | − ${fee}`,
                `${per}x = ${total - fee}  | : ${per} → <strong>x = ${x}</strong>`,
              ],
              { per, fee, x, total },
            );
          },
        },
        {
          id: "spot-scale-mistake",
          make(rng, level) {
            const x = rng.int(2, 7);
            const a = rng.int(2, 5);
            const b = rng.int(2, 9);
            const c = a * x + b;
            return task(
              level,
              `In der Umformung „${a}x + ${b} = ${c}“ rechnet jemand im ersten Schritt falsch: „${a}x = ${c + b}“. Was wäre richtig gewesen?`,
              `Jonas soll ${a}x + ${b} = ${c} lösen und schreibt in die nächste Zeile ${a}x = ${c + b}. Berechne den korrekten Wert von ${a}x nach dem ersten richtigen Schritt.`,
              [numberField(`${a}x =`, c - b, "", 0)],
              `Um + ${b} links wegzubekommen, musst du auf beiden Seiten ${b} abziehen (| − ${b}), nicht addieren!`,
              [
                `${a}x + ${b} = ${c}  | − ${b}`,
                `${a}x = ${c} − ${b} = <strong>${c - b}</strong>`,
              ],
              { a, b, c, right: c - b },
            );
          },
        },
      ],
    }),

    makeLesson(7, 3, LB, {
      id: "gl-3-gleichungen-loesen",
      title: "Gleichungen ax + b = c in ℤ lösen & Probe",
      subtitle: "Zweischritt-Äquivalenzumformungen, Probe durchführen und Fehler verbessern",
      tracks: BOTH,
      whyItMatters:
        "Das Schema für ax + b = c funktioniert bis in die 10. Klasse: zuerst das Zahlglied mit + oder − auf die andere Seite bringen, dann durch den Faktor vor x teilen!",
      explanationHtml: `
        <p>Bei jeder linearen Gleichung der Form <strong>ax + b = c</strong> (mit x, a, b, c ∈ ℤ) hilft dieselbe Zwei-Schritt-Reihenfolge:</p>
        <div class="example">
          <strong>Beispiel:</strong> −3x + 5 = −13<br>
          1. Zahlglied wegschaffen (| − 5): −3x = −18<br>
          2. Durch Faktor vor x teilen (| : (−3)): <strong>x = 6</strong><br>
          3. <strong>Probe:</strong> Links = −3 · 6 + 5 = −18 + 5 = −13 = Rechts ✓.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Immer zuerst mit + oder − isolieren, dann durch den Faktor vor x (mit seinem Vorzeichen!) teilen. Zum Schluss mit der <strong>Probe</strong> kontrollieren!
        </div>
      `,
      formulas: [
        {
          name: "Lösungsweg ax + b = c",
          html: `ax + b = c &nbsp;⇒&nbsp; ax = c − b &nbsp;⇒&nbsp; x = ${frac("c − b", "a")}`,
          quantities: "x, a, b, c ∈ ℤ (a ≠ 0)",
        },
      ],
      quiz: {
        question: "Welche Lösung hat die Gleichung −2x + 7 = 15?",
        options: ["x = −4", "x = +4", "x = −11"],
        correctIndex: 0,
        explanation:
          "−2x + 7 = 15 | −7 → −2x = 8 | :(−2) → x = −4. Probe: −2·(−4) + 7 = 8 + 7 = 15 ✓.",
      },
      lab: lab(
        "balance-scale",
        "Gleichungslöser & Probe",
        "Stelle c rechts ein und prüfe dein x durch die Waagen-Probe.",
        [
          range("a", "Faktor a", -4, 4, -2, 1),
          range("b", "Zahl b", -6, 8, 5, 1),
          range("xTrue", "Gesuchtes x", -4, 6, -3, 1),
          range("guessX", "Probe-x", -4, 6, 1, 1),
        ],
        [
          output("lhs", "Linke Seite (Probe)", (v) => v.a * v.guessX + v.b, "", 0),
          output("rhs", "Rechte Seite c", (v) => v.a * v.xTrue + v.b, "", 0),
          output("ok", "Probe", (v) => ((v.a === 0 ? true : v.a * v.guessX + v.b === v.a * v.xTrue + v.b) ? "stimmt ✓" : "stimmt nicht"), "", 0, true),
        ],
        [
          {
            id: "solve-neg-a",
            text: "Löse −2x + 5 = 11 am Probe-Regler (x = −3).",
            check: (v) => v.a === -2 && v.b === 5 && v.xTrue === -3 && v.guessX === -3,
          },
          {
            id: "solve-4x-zero",
            text: "Stelle a = 4, b = −4, xTrue = 1 ein und bestätige mit Probe-x = 1 (rechts = 0).",
            check: (v) => v.a === 4 && v.b === -4 && v.xTrue === 1 && v.guessX === 1,
          },
          {
            id: "solve-pos",
            text: "Finde eine beliebige Gleichung mit negativem xTrue = −4, bei der die Probe stimmt.",
            check: (v) => v.a !== 0 && v.xTrue === -4 && v.guessX === -4,
          },
        ],
      ),
      exercises: [
        {
          id: "solve-ax-plus-b-c",
          make(rng, level) {
            const a = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
            const x = rng.int(-7, 7) || -3;
            const b = rng.int(-9, 9) || 4;
            const c = a * x + b;
            const bPart = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
            return task(
              level,
              `Löse die Gleichung ${fmt(a)}x ${bPart} = ${fmt(c)} in ℤ.`,
              `Das ${Math.abs(a)}-Fache ${a < 0 ? "(mit Minuszeichen)" : ""} einer gedachten ganzen Zahl x, zusammen mit ${fmt(b)}, ergibt ${fmt(c)} (${fmt(a)}x ${bPart} = ${fmt(c)}). Wie heißt die Zahl?`,
              [numberField("x =", x, "", 0, {
                slips: [{ value: -x, hint: "Achte beim letzten Schritt auf das Vorzeichen des Divisors!" }],
              })],
              `Erst b durch ${b >= 0 ? `− ${b}` : `+ ${Math.abs(b)}`} wegschaffen, dann durch ${fmt(a)} teilen.`,
              [
                `${fmt(a)}x = ${fmt(c)} ${b >= 0 ? `− ${b}` : `+ ${Math.abs(b)}`} = ${fmt(c - b)}`,
                `x = ${fmt(c - b)} : (${fmt(a)}) = <strong>${fmt(x)}</strong>`,
              ],
              { a, b, c, x },
            );
          },
        },
        {
          id: "fix-equation-error",
          make(rng, level) {
            const a = rng.pick([2, 3, 4]);
            const b = rng.int(3, 9);
            const x = rng.int(-5, 6) || 3;
            const c = a * x - b;
            return task(
              level,
              `Finde die richtige Lösung für ${a}x − ${b} = ${fmt(c)} (Achtung: in der Rechnung eines Mitschülers stand falsch ${a}x = ${fmt(c - b)}).`,
              `Beim Lösen von ${a}x − ${b} = ${fmt(c)} hat Lukas gerechnet: „− ${b} wird mit | − ${b} rübergeholt“ und erhielt falsch ${a}x = ${fmt(c - b)}. Berechne die echte Lösung x!`,
              [numberField("x =", x, "", 0)],
              `Gegenteil von „− ${b}“ ist „+ ${b}“ (| + ${b})!`,
              [
                `${a}x − ${b} = ${fmt(c)}  | + ${b} → ${a}x = ${fmt(c + b)}`,
                `x = ${fmt(c + b)} : ${a} = <strong>${fmt(x)}</strong>`,
              ],
              { a, b, c, x },
            );
          },
        },
      ],
    }),
  ],
);
