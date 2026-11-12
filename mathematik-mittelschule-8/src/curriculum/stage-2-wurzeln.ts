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
import { fmt, sqrtHtml } from "../exercises/format";

const LB: [number | null, number] = [2, 2];

export const STAGE_WURZELN = makeStage(
  2,
  "Quadratzahlen & Quadratwurzeln",
  "Seitenlänge und Flächeninhalt von Quadraten umkehren, Wurzelwerte mit TR bestimmen und im M-Zug überschlagen",
  "#7c3aed",
  "√",
  LB,
  [
    // 2.1 Quadrieren & Radizieren (R + M)
    makeLesson(2, 1, LB, {
      id: "wz-1-quadrieren-radizieren",
      title: "Quadrieren & Radizieren als Umkehrung",
      subtitle: "Von der Seitenlänge a zum Flächeninhalt A = a² und zurück zu a = √A",
      tracks: BOTH,
      whyItMatters:
        "Wenn du später die Größe eines runden oder quadratischen Grundstücks kennst und seinen Radius bzw. seine Seitenlänge brauchst, kehrt genau das Wurzelziehen das Quadrieren um.",
      explanationHtml: `
        <p><strong>Quadrieren</strong> (a²) berechnet den Flächeninhalt A eines Quadrats aus der Seitenlänge a. <strong>Radizieren</strong> (Wurzelziehen, ${sqrtHtml("A")}) ist die Umkehrung: Es findet zu einer gegebenen Quadratfläche A ≥ 0 wieder die positive Seitenlänge a.</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Quadrat hat den Flächeninhalt A = 64 cm².<br>
          Gesucht ist die positive Zahl a mit a² = 64 → a = ${sqrtHtml(64)} = <strong>8 cm</strong>.<br>
          Für A = 52 cm² liefert der Taschenrechner ${sqrtHtml(52)} ≈ <strong>7,21 cm</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> ${sqrtHtml("a²")} = a (für a ≥ 0). Quadrieren und Radizieren heben einander auf. Unter dem Wurzelzeichen (Radikand) darf bei Seitenlängen keine negative Zahl stehen.
        </div>
      `,
      formulas: [
        {
          name: "Quadratfläche & Quadratwurzel",
          html: `A = a² &nbsp;⟺&nbsp; a = ${sqrtHtml("A")} &nbsp;(a ≥ 0)`,
          quantities: "a Seitenlänge, A Flächeninhalt des Quadrats",
        },
        {
          name: "Wichtige Quadratzahlen bis 15²",
          html: "11² = 121 · 12² = 144 · 13² = 169 · 14² = 196 · 15² = 225",
          quantities: "Erleichtern das Kopfrechnen und Prüfen von TR-Ergebnissen",
        },
      ],
      quiz: {
        question: "Welche Seitenlänge gehört zu einem quadratischen Zimmer mit A = 49 m²?",
        options: ["7 m", "24,5 m", "12,25 m"],
        correctIndex: 0,
        explanation:
          "Man sucht die Zahl, die mit sich selbst malgenommen 49 ergibt: 7 · 7 = 49, also √49 = 7 m (nicht durch 2 oder 4 teilen!).",
      },
      lab: lab(
        "square-root-area",
        "Quadratfläche A ↔ Seitenlänge a = √A",
        "Ziehe die rechte obere Ecke des Quadrats oder stelle A ein und lies die Seitenlänge ab.",
        [range("area", "Quadratfläche A", 4, 169, 30, 1)],
        [
          output("side", "Seitenlänge a = √A", (v) => Math.sqrt(v.area), "", 2, true),
          output("sqCheck", "Probe a²", (v) => v.area, "", 0),
        ],
        [
          {
            id: "square-64",
            text: "Finde ein ganzzahliges Quadrat mit Fläche A = 64 (Seitenlänge 8).",
            check: (v, r) => v.area === 64 && near(Number(r.side), 8, 0.01),
          },
          {
            id: "square-144",
            text: "Vergrößere das Quadrat auf A = 144 (Seitenlänge 12).",
            check: (v, r) => v.area === 144 && near(Number(r.side), 12, 0.01),
          },
          {
            id: "approx-50",
            text: "Stelle eine Nicht-Quadratzahl ein: A = 50 (√50 ≈ 7,07).",
            check: (v, r) => v.area === 50 && near(Number(r.side), Math.sqrt(50), 0.02),
          },
        ],
      ),
      exercises: [
        {
          id: "perfect-roots",
          make(rng, level) {
            const side = rng.int(4, 15);
            const area = side * side;
            return task(
              level,
              `Berechne die Seitenlänge eines Quadrats mit dem Flächeninhalt A = ${area} cm².`,
              `Eine quadratische Werkplatte besitzt genau ${area} cm² Fläche. Wie lang ist eine Seite (und welcher Umfang ergibt sich daraus in Level 2)?`,
              level === 1
                ? [
                    numberField("Seitenlänge a =", side, "cm", 0, {
                      slips: [{ value: area / 4, hint: "Nicht durch 4 teilen — welche Zahl mal sich selbst ergibt A?" }],
                    }),
                  ]
                : [
                    numberField("Seitenlänge a =", side, "cm", 0),
                    numberField("Umfang u =", 4 * side, "cm", 0),
                  ],
              "a = √A (mit a · a = A)",
              [
                `${side} · ${side} = ${area} → a = √${area} = <strong>${side} cm</strong>`,
                level === 1 ? `Seitenlänge: <strong>${side} cm</strong>` : `Umfang u = 4 · ${side} = <strong>${4 * side} cm</strong>`,
              ],
              { side, area },
            );
          },
        },
        {
          id: "approx-tr-root",
          make(rng, level) {
            const area = rng.pick([20, 32, 45, 58, 75, 92, 110]);
            const root = Math.sqrt(area);
            return task(
              level,
              `Bestimme mit dem Taschenrechner näherungsweise ${sqrtHtml(area)} auf zwei Dezimalstellen.`,
              `Ein quadratischer Gartenteich fasst genau ${area} m² Wasserfläche. Wie lang ist eine Umrandungskante (auf 2 Dezimalstellen gerundet)?`,
              [numberField("a =", Number(root.toFixed(2)), level === 1 ? "" : "m", 2)],
              "Taschenrechner-Taste √ nutzen und auf die zweite Nachkommastelle runden.",
              [
                `√${area} = ${root.toFixed(4)}…`,
                `Auf zwei Stellen gerundet: <strong>${fmt(root, 2)}</strong>`,
              ],
              { area, root },
            );
          },
        },
      ],
    }),

    // 2.2 Überschlagen von Quadratzahlen & Wurzeln (M-only)
    makeLesson(2, 2, LB, {
      id: "wz-2-quadratwurzeln-ueberschlag",
      title: "Quadratzahlen & Wurzeln überschlagen",
      subtitle: "Wurzelwerte durch benachbarte Quadratzahlen sicher eingrenzen (M8)",
      tracks: ["M"],
      whyItMatters:
        "Beim Rechnen mit dem Taschenrechner passiert leicht ein Tippfehler — durch schnelles Eingrenzen erkennst du sofort, ob das Ergebnis plausibel ist.",
      explanationHtml: `
        <p>Auch ohne Taschenrechner kannst du den Wert einer Quadratwurzel genau zwischen zwei benachbarte ganze Zahlen eingrenzen:</p>
        <div class="example">
          <strong>Beispiel:</strong> Wo liegt ${sqrtHtml(58)}?<br>
          Suche die nächstkleinere und nächstgrößere Quadratzahl: <strong>49</strong> &lt; 58 &lt; <strong>64</strong>.<br>
          Also gilt: ${sqrtHtml(49)} &lt; ${sqrtHtml(58)} &lt; ${sqrtHtml(64)} → <strong>7 &lt; ${sqrtHtml(58)} &lt; 8</strong> (näher an 8, etwa 7,6).
        </div>
        <div class="merke">
          <strong>Merke:</strong> Zum Überschlagen von a² rundest du auf Zehner oder halbe Werte; bei ${sqrtHtml("A")} suchst du die beiden benachbarten Quadratzahlen n² und (n + 1)².
        </div>
      `,
      formulas: [
        {
          name: "Einschachteln von Quadratwurzeln",
          html: `n² &lt; A &lt; (n + 1)² &nbsp;⟹&nbsp; n &lt; ${sqrtHtml("A")} &lt; n + 1`,
          quantities: "n ganze Zahl direkt unterhalb von √A",
        },
      ],
      quiz: {
        question: "Zwischen welchen zwei benachbarten ganzen Zahlen liegt √90?",
        options: ["Zwischen 9 und 10", "Zwischen 8 und 9", "Zwischen 10 und 11"],
        correctIndex: 0,
        explanation: "9² = 81 und 10² = 100. Da 81 < 90 < 100 gilt, liegt √90 zwischen 9 und 10.",
      },
      lab: lab(
        "square-root-area",
        "Wurzeln zwischen Quadratzahlen eingrenzen",
        "Beobachte auf der rechten Zahlenskala, zwischen welchen beiden Quadratzahlen n² und (n+1)² dein A liegt.",
        [range("area", "Radikand A", 5, 160, 42, 1)],
        [
          output("side", "Wurzel √A", (v) => Math.sqrt(v.area), "", 2, true),
          output("lo", "Untere ganze Zahl", (v) => Math.floor(Math.sqrt(v.area)), "", 0),
        ],
        [
          {
            id: "between-7-8",
            text: "Wähle ein A zwischen 7² und 8², sodass √A näher an 8 als an 7 liegt (A = 60).",
            check: (v, r) => v.area === 60 && Number(r.lo) === 7,
          },
          {
            id: "between-10-11",
            text: "Grenze √115 zwischen 10 und 11 ein.",
            check: (v, r) => v.area === 115 && Number(r.lo) === 10,
          },
          {
            id: "between-4-5",
            text: "Stelle eine Fläche zwischen 16 und 25 ein (z. B. A = 20).",
            check: (v, r) => v.area > 16 && v.area < 25 && Number(r.lo) === 4,
          },
        ],
      ),
      exercises: [
        {
          id: "bracket-root",
          make(rng, level) {
            const n = rng.int(4, 13);
            const a = n * n + rng.int(2, 2 * n - 1);
            return task(
              level,
              `Zwischen welchen zwei aufeinanderfolgenden ganzen Zahlen liegt ${sqrtHtml(a)}? Gib die kleinere Zahl n an.`,
              `Ein Schüler berechnet ${sqrtHtml(a)} ohne Kontrolle. Finde als Überschlag die größte ganze Zahl n unterhalb von ${sqrtHtml(a)} sowie (n + 1).`,
              level === 1
                ? [numberField("Kleinere Zahl n =", n, "", 0)]
                : [
                    numberField("Untere Grenze n =", n, "", 0),
                    numberField("Obere Grenze n + 1 =", n + 1, "", 0),
                  ],
              "Finde die Nachbarquadrate n² < A < (n + 1)².",
              [
                `${n}² = ${n * n} < ${a} < ${(n + 1) * (n + 1)} = ${n + 1}²`,
                `${n} < √${a} < ${n + 1} → untere Zahl <strong>${n}</strong>`,
              ],
              { n, a },
            );
          },
        },
        {
          id: "estimate-square",
          make(rng, level) {
            const choices = [
              { x: 4.9, rounded: 5, sq: 25, exact: 24.01 },
              { x: 9.8, rounded: 10, sq: 100, exact: 96.04 },
              { x: 19.7, rounded: 20, sq: 400, exact: 388.09 },
              { x: 6.1, rounded: 6, sq: 36, exact: 37.21 },
            ];
            const item = rng.pick(choices);
            return task(
              level,
              `Überschlage im Kopf das Quadrat von ${fmt(item.x, 1)} durch sinnvolles Runden.`,
              `Für einen Kostenvoranschlag wird ein Quadrat mit Seitenlänge ${fmt(item.x, 1)} m überschlagen. Welcher überschlagene Flächeninhalt (ganze m²) ergibt sich?`,
              [numberField("Überschlag =", item.sq, level === 1 ? "" : "m²", 0)],
              `Runde ${fmt(item.x, 1)} auf die nächste volle Einer-/Zehnerzahl und quadriere.`,
              [
                `Runden: ${fmt(item.x, 1)} ≈ ${item.rounded} (exakt wäre ${fmt(item.exact, 2)})`,
                `${item.rounded}² = <strong>${item.sq}</strong>`,
              ],
              item,
            );
          },
        },
      ],
    }),
  ],
);
