import { fmt, frac } from "../exercises/format";
import { choiceField, near, numberField } from "./helpers";
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

const LB = [8, 8] as [number, number];

export const STAGE_PROPORTIONAL = makeStage(
  8,
  "Proportionalität",
  "Alltagszuordnungen beschreiben, lineare von nicht linearen unterscheiden, Dreisatz und Graph vergleichen",
  "#b45309",
  "📈",
  LB,
  [
    makeLesson(8, 1, LB, {
      id: "pp-1-zuordnungen-linear",
      title: "Zuordnungen & lineare Zusammenhänge",
      subtitle: "Je-desto-Aussagen, Tabellen und Graphen vergleichen — proportional vs. linear vs. nicht linear",
      tracks: BOTH,
      whyItMatters:
        "Nicht alles wächst gleichmäßig: Handytarife mit Grundgebühr starten über null, Bremswege wachsen sogar immer steiler.",
      explanationHtml: `
        <p>Eine <strong>Zuordnung</strong> verbindet zwei Größen (z. B. Menge → Preis oder Zeit → Weg). An Tabelle und Graph erkennst du drei Typen:</p>
        <ul>
          <li><strong>Proportional:</strong> Gerade durch den Ursprung <strong>(0|0)</strong> — doppeltes x bedeutet doppeltes y.</li>
          <li><strong>Linear (mit Grundgebühr):</strong> Gerade, schneidet die y-Achse aber oberhalb/unterhalb von 0.</li>
          <li><strong>Nicht linear:</strong> Gekrümmte Kurve (z. B. Quadratfläche A = a²).</li>
        </ul>
        <div class="example">
          <strong>Beispiel:</strong> Ein Schwimmbad kostet 4 € Eintritt (Grundgebühr) plus 2 € pro Stunde → <strong>linear</strong> (0 h → 4 €, 1 h → 6 €, 2 h → 8 €), aber <em>nicht proportional</em>!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Jede proportionale Zuordnung ist eine Gerade durch (0|0). Startet die Gerade woanders, ist sie zwar linear, aber nicht proportional.
        </div>
      `,
      formulas: [
        {
          name: "Erkennungsmerkmal proportional",
          html: `${frac("y", "x")} = konstant &nbsp;und&nbsp; (0 | 0) gehört dazu`,
          quantities: "Quotientengleichheit für alle Wertepaare x ≠ 0",
        },
      ],
      quiz: {
        question: "Eine Taxi-Fahrt kostet 3,50 € Grundgebühr plus 2,00 € pro Kilometer. Warum ist sie NICHT proportional?",
        options: [
          "Weil man bei 0 km bereits 3,50 € zahlt — doppelte Kilometerzahl kostet nicht doppelt so viel.",
          "Weil der Graph im Koordinatensystem eine gekrümmte Kurve wird.",
          "Weil Kilometer und Euro verschiedene Einheiten sind.",
        ],
        correctIndex: 0,
        explanation:
          "Der Graph ist zwar eine Gerade (linear), geht aber nicht durch (0|0): 1 km kostet 5,50 €, 2 km kosten 7,50 € (nicht 11,00 €).",
      },
      lab: lab(
        "linear-vs-nonlinear",
        "Zuordnungstypen vergleichen",
        "Schalte zwischen proportional, linear (mit Startwert t) und nicht linear um.",
        [
          choice("kind", "Zuordnungstyp", ["Proportional", "Linear (mit t)", "Nicht linear"], 0),
          range("m", "Steigung pro x", 1, 3, 2, 0.5),
          range("t", "Startwert bei x = 0", 0, 4, 2, 1),
        ],
        [
          output("y0", "Wert bei x = 0", (v) => (v.kind === 1 ? v.t : 0), "", 1),
          output("y4", "Wert bei x = 4", (v) => (v.kind === 0 ? v.m * 4 : v.kind === 1 ? v.m * 4 + v.t : 0.5 * 16), "", 1, true),
        ],
        [
          {
            id: "linear-with-t",
            text: "Wähle ‚Linear (mit t)‘ und stelle Startwert t = 4 sowie m = 2 ein (bei x = 4 gilt y = 12).",
            check: (v, r) => v.kind === 1 && v.t === 4 && v.m === 2 && near(Number(r.y4), 12, 0.01),
          },
          {
            id: "nonlinear-curve",
            text: "Schalte auf ‚Nicht linear‘ und vergleiche die gekrümmte Kurve mit der Geraden.",
            check: (v) => v.kind === 2,
          },
          {
            id: "prop-m25",
            text: "Stelle eine proportionale Zuordnung mit y = 10 bei x = 4 ein.",
            check: (v, r) => v.kind === 0 && near(Number(r.y4), 10, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "classify-relation",
          make(rng, level) {
            const scenarios = [
              ["0 kg → 0 €; 2 kg → 5 €; 4 kg → 10 €", "Äpfel kosten pro Kilogramm gleich viel (ohne Grundgebühr).", 0],
              ["0 min → 3 €; 2 min → 5 €; 4 min → 7 €", "E-Scooter: 3 € Freischaltung + 1 € pro Minute.", 1],
              ["Seitenlänge 1 cm → 1 cm²; 2 cm → 4 cm²; 3 cm → 9 cm²", "Seitenlänge eines Quadrats → Flächeninhalt.", 2],
            ] as const;
            const s = rng.pick(scenarios);
            return task(
              level,
              `Prüfe die gegebene Wertetabelle: ${s[0]}. Welche Zuordnung liegt vor?`,
              `${s[1]} (${s[0]}). Um welche Art von Zuordnung handelt es sich?`,
              [choiceField("Zuordnungstyp", ["proportional", "linear (nicht proportional)", "nicht linear"], s[2])],
              "Prüfe: geht durch (0|0) + gleichmäßiger Schritt → proportional; gleichmäßig ohne (0|0) → linear; ungleiche Schritte → nicht linear.",
              [
                `Werte prüfen: ${s[0]}`,
                `<strong>${["proportional", "linear (nicht proportional)", "nicht linear"][s[2]]}</strong>`,
              ],
              { idx: s[2] },
            );
          },
        },
        {
          id: "linear-table-missing",
          make(rng, level) {
            const t = rng.int(2, 6);
            const m = rng.int(2, 5);
            const y3 = m * 3 + t;
            return task(
              level,
              `Lineare Zuordnung: x = 0 → ${t}; x = 1 → ${t + m}; x = 2 → ${t + 2 * m}. Welcher Wert gehört zu x = 3?`,
              `Eine Kerze ist beim Anzünden noch umgedreht gedacht oder ein Wassertank hat beim Start ${t} Liter und füllt sich jede Stunde um weitere ${m} Liter (1 h → ${t + m} l; 2 h → ${t + 2 * m} l). Wie viel zeigt x = 3?`,
              [numberField("Wert für x = 3:", y3, "", 0)],
              `Jeder Schritt +1 bei x erhöht y gleichmäßig um +${m}.`,
              [
                `${t + 2 * m} + ${m}`,
                `<strong>${y3}</strong>`,
              ],
              { y3 },
            );
          },
        },
      ],
    }),

    makeLesson(8, 2, LB, {
      id: "pp-2-dreisatz-sachaufgaben",
      title: "Proportionale Zuordnungen & Dreisatz",
      subtitle: "Wertepaare mit Dreisatz berechnen, am Graphen kontrollieren und Sachsituationen prüfen",
      tracks: BOTH,
      whyItMatters:
        "Vom Rezept umrechnen bis zum Stundenlohn oder Benzinverbrauch: Der Dreisatz ist eines der meistgenutzten Werkzeuge im Alltag.",
      explanationHtml: `
        <p>Bei einer <strong>proportionalen Zuordnung</strong> führt der <strong>Dreisatz</strong> in drei sicheren Schritten über die Einheit <strong>1</strong> (oder einen gemeinsamen Teiler) zum Ziel:</p>
        <div class="example">
          <strong>Beispiel:</strong> 4 kg Orangen kosten 9,00 €. Wie viel kosten 6 kg?<br>
          1. Gegeben: 4 kg → 9,00 €<br>
          2. Auf 1 (Teilen durch 4): 1 kg → 9,00 € : 4 = 2,25 €<br>
          3. Auf das Ziel (Mal 6): 6 kg → 2,25 € · 6 = <strong>13,50 €</strong>.<br>
          <em>Kontrolle am Graphen:</em> Der Punkt (6 | 13,5) liegt genau auf der Ursprungsgeraden durch (4 | 9).
        </div>
        <div class="merke">
          <strong>Merke:</strong> Quotientengleichheit hilft als Blitzkontrolle: ${frac("9,00", 4)} = 2,25 €/kg und ${frac("13,50", 6)} = 2,25 €/kg!
        </div>
      `,
      formulas: [
        {
          name: "Dreisatz (proportional)",
          html: `a Einheiten ≙ W &nbsp;⇒&nbsp; 1 Einheit ≙ ${frac("W", "a")} &nbsp;⇒&nbsp; b Einheiten ≙ ${frac("W", "a")} · b`,
          quantities: "gleicher Faktor/Quotient auf beiden Seiten",
        },
      ],
      quiz: {
        question: "5 Hefte kosten 6,00 €. Wie viel kosten 8 gleiche Hefte?",
        options: ["9,60 €", "9,00 €", "10,40 €"],
        correctIndex: 0,
        explanation:
          "1 Heft kostet 6,00 € : 5 = 1,20 €. Dann kosten 8 Hefte 8 · 1,20 € = 9,60 €.",
      },
      lab: lab(
        "proportion-dreisatz",
        "Ursprungsgerade & Dreisatz",
        "Ziehe Punkt P entlang der Geraden und lies Einzelpreis und Gesamtpreis ab.",
        [
          range("unitPrice", "Einzelpreis (€/Stück)", 1.5, 4.5, 2.5, 0.5, "€"),
          range("qty", "Stückzahl x", 1, 8, 4, 1),
        ],
        [
          output("cost", "Gesamtpreis y", (v) => v.unitPrice * v.qty, "€", 2, true),
          output("quot", "Quotient y : x", (v) => v.unitPrice, "€", 2),
        ],
        [
          {
            id: "reach-qty-6",
            text: "Berechne beim Einzelpreis 2,50 € den Preis für 6 Stück am Graphen (15,00 €).",
            check: (v, r) => v.unitPrice === 2.5 && v.qty === 6 && near(Number(r.cost), 15, 0.01),
          },
          {
            id: "reach-cost-28",
            text: "Erreiche genau 28,00 € (bei passender Stückzahl und Einzelpreis 3,50 €).",
            check: (v, r) => v.unitPrice === 3.5 && near(Number(r.cost), 28, 0.01),
          },
          {
            id: "unit-check",
            text: "Prüfe an x = 1: dort liegt der y-Wert immer exakt beim Einzelpreis!",
            check: (v) => v.qty === 1,
          },
        ],
      ),
      exercises: [
        {
          id: "dreisatz-price",
          make(rng, level) {
            const unit = rng.stepped(1.2, 4.5, 0.3);
            const a = rng.pick([3, 4, 5, 6]);
            const b = rng.pick([2, 5, 7, 8, 9].filter((n) => n !== a));
            const givenCost = Number((a * unit).toFixed(2));
            const ansCost = Number((b * unit).toFixed(2));
            return task(
              level,
              `Proportionale Zuordnung: ${a} Einheiten → ${fmt(givenCost, 2)} €. Berechne den Wert für ${b} Einheiten.`,
              `An der Marktwaage kosten ${a} kg Trauben ${fmt(givenCost, 2)} €. Wie viel bezahlst du für ${b} kg derselben Sorte?`,
              [numberField("Preis =", ansCost, "€", 2, {
                slips: [{ value: unit, hint: "Das ist erst der Preis für 1 kg — noch mit der Zielmenge multiplizieren!" }],
              })],
              `Erst durch ${a} auf 1 Einheit herunterrechnen, dann mit ${b} malnehmen.`,
              [
                `1 kg → ${fmt(givenCost, 2)} : ${a} = ${fmt(unit, 2)} €`,
                `${b} kg → ${fmt(unit, 2)} € · ${b} = <strong>${fmt(ansCost, 2)} €</strong>`,
              ],
              { a, b, givenCost, ansCost },
            );
          },
        },
        {
          id: "dreisatz-reverse-qty",
          make(rng, level) {
            const unit = rng.stepped(1.5, 4.0, 0.5);
            const a = rng.pick([2, 4, 5]);
            const targetQty = rng.int(6, 12);
            const givenCost = Number((a * unit).toFixed(2));
            const budget = Number((targetQty * unit).toFixed(2));
            return task(
              level,
              `${a} Stück kosten ${fmt(givenCost, 2)} €. Wie viele Stück erhält man für ${fmt(budget, 2)} €?`,
              `Für eine Klassenfeier kosten ${a} Packungen Brezen ${fmt(givenCost, 2)} €. In der Klassenkasse sind ${fmt(budget, 2)} €. Wie viele Packungen lassen sich damit genau kaufen?`,
              [numberField("Anzahl =", targetQty, "Stück", 0)],
              "Berechne zuerst den Preis für 1 Stück, teile dann den Gesamtbetrag durch diesen Einzelpreis.",
              [
                `Einzelpreis = ${fmt(givenCost, 2)} : ${a} = ${fmt(unit, 2)} €`,
                `${fmt(budget, 2)} : ${fmt(unit, 2)} = <strong>${targetQty} Stück</strong>`,
              ],
              { a, targetQty, givenCost, budget },
            );
          },
        },
      ],
    }),
  ],
);
