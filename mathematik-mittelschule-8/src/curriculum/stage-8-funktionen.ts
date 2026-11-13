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
import { fmt, frac } from "../exercises/format";

const LB: [number | null, number] = [8, 8];

export const STAGE_FUNKTIONEN = makeStage(
  8,
  "Funktionale Zusammenhänge & Lineare Funktionen",
  "Proportionale, lineare und nicht lineare Zuordnungen sicher wechseln, Maßstäbe kritisch bewerten und lineare Funktionen y = m·x + t im M-Zug aufstellen",
  "#0d9488",
  "📈",
  LB,
  [
    // 8.1 Zuordnungen vergleichen, Darstellungswechsel & Maßstab (R + M)
    makeLesson(8, 1, LB, {
      id: "fk-1-zuordnungen-massstab",
      title: "Zuordnungen, Darstellungswechsel & Maßstab",
      subtitle: "Proportional, linear und nicht linear unterscheiden sowie Achseneinteilungen prüfen",
      tracks: BOTH,
      whyItMatters:
        "Tarife, Bremswege und Wachstumskurven stehen mal als Tabelle, mal als Graph oder Text vor dir — nur ein angemessener Maßstab verhindert optische Fehldeutungen.",
      explanationHtml: `
        <p>Eine Abhängigkeit kannst du als <strong>Text</strong>, <strong>Wertetabelle</strong> oder <strong>Graph im Koordinatensystem</strong> darstellen. Dabei helfen drei Merkmale bei der Einordnung:</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          • <em>Proportional:</em> Gerade durch den Ursprung (0 | 0) — z. B. 2 kg → 6 €, 4 kg → 12 €.<br>
          • <em>Linear (mit Startwert):</em> Gerade <em>ober- oder unterhalb</em> von (0 | 0) — z. B. 5 € Grundgebühr + 2 € je kg.<br>
          • <em>Nicht linear:</em> gekrümmte Kurve — z. B. Quadratfläche A = a² oder freier Fall.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Verändert man die <strong>Achseneinteilung (Maßstab)</strong>, wirkt ein und dieselbe Gerade plötzlich extrem steil oder sehr flach! Wähle den Maßstab so, dass alle wichtigen Punkte gut ablesbar ins Koordinatensystem passen.
        </div>
      `,
      formulas: [
        {
          name: "Kennzeichen der Zuordnung",
          html: "Proportional: Gerade + (0 | 0) · Linear: Gerade · Nicht linear: Kurve",
          quantities: "Prüfe stets Punkt (0 | 0) und gleiche Schrittzuwächse",
        },
      ],
      quiz: {
        question: "Zwei Graphen stellen exakt dieselbe Wertetabelle dar, aber Graph A wirkt viel steiler. Woran kann das liegen?",
        options: [
          "An unterschiedlichen Maßstäben / Schrittweiten an den Achsen",
          "Die Werte müssen bei Graph A doppelt so groß sein",
          "Eine Gerade kann je nach Stiftdicke unterschiedliche Steigungen haben",
        ],
        correctIndex: 0,
        explanation:
          "Staucht man die y-Achse oder streckt man die x-Achse, verändert sich der optische Anstieg ohne dass sich ein einziges Zahlenpaar ändert!",
      },
      lab: lab(
        "func-compare",
        "Zuordnungstypen & Maßstäbe testen",
        "Schalte zwischen proportional, linear und nicht linear um und prüfe die Wirkung einer veränderten y-Achsenskala.",
        [
          choice("kind", "Zuordnung", ["Proportional", "Linear (mit t)", "Nicht linear"], 0),
          range("m", "Schrittzuwachs m", 1, 3, 2, 0.5),
          range("t", "Startwert t", 0, 4, 2, 1),
          choice("scaleZoom", "y-Achse bis", ["20 (normal)", "10 (gestreckt)"], 0),
        ],
        [
          output(
            "y3",
            "Wert y(3)",
            (v) => (v.kind === 2 ? 0.5 * 9 : v.kind === 0 ? v.m * 3 : v.m * 3 + v.t),
            "",
            1,
            true,
          ),
        ],
        [
          {
            id: "linear-t3",
            text: "Stelle eine lineare Zuordnung mit m = 2 und Startwert t = 3 ein (y(3) = 9).",
            check: (v, r) => v.kind === 1 && v.m === 2 && v.t === 3 && near(Number(r.y3), 9, 0.01),
          },
          {
            id: "zoom-axis",
            text: "Verändere den Maßstab auf ‚10 (gestreckt)‘ bei der proportionalen Zuordnung.",
            check: (v) => v.kind === 0 && v.scaleZoom === 1,
          },
          {
            id: "curve-show",
            text: "Wechsle zur gekrümmten nicht linearen Zuordnung.",
            check: (v) => v.kind === 2,
          },
        ],
      ),
      exercises: [
        {
          id: "table-classify-calc",
          make(rng, level) {
            const scenarios = [
              {
                table: "x = 0 → 0; x = 2 → 7; x = 4 → 14",
                text: "3 kg Äpfel kosten 10,50 €, 0 kg kosten 0 €",
                kindIdx: 0,
                nextX: 6,
                nextY: 21,
              },
              {
                table: "x = 0 → 5; x = 2 → 11; x = 4 → 17",
                text: "5 € Lieferpauschale plus 3 € je Kiste",
                kindIdx: 1,
                nextX: 6,
                nextY: 23,
              },
              {
                table: "x = 1 → 2; x = 2 → 8; x = 3 → 18",
                text: "Quadratische Fläche 2 · x² bei Verdopplung von x",
                kindIdx: 2,
                nextX: 4,
                nextY: 32,
              },
            ];
            const s = rng.pick(scenarios);
            return task(
              level,
              `Ordne die Tabelle (${s.table}) zu und bestimme den Wert für x = ${s.nextX}.`,
              `Aus dem Alltag liegt folgende Situation vor: ${s.text} (${s.table}). Welche Zuordnung liegt vor und welchen Wert erhält man bei x = ${s.nextX}?`,
              [
                choiceField("Zuordnungstyp", ["proportional", "linear (nicht proportional)", "nicht linear"], s.kindIdx),
                numberField(`y für x = ${s.nextX}:`, s.nextY, "", 0),
              ],
              "Gleiche Schrittzuwächse + Ursprung (0|0) → proportional; ohne (0|0) → linear; ungleiche Zuwächse → nicht linear.",
              [
                `Typ: ${["proportional", "linear (nicht proportional)", "nicht linear"][s.kindIdx]}`,
                `Bei x = ${s.nextX}: <strong>${s.nextY}</strong>`,
              ],
              { kindIdx: s.kindIdx, nextX: s.nextX, nextY: s.nextY },
            );
          },
        },
        {
          id: "appropriate-scale-check",
          make(rng, level) {
            const maxVal = rng.pick([45, 90, 180, 450]);
            const ticks = 10;
            const step = maxVal === 45 ? 5 : maxVal === 90 ? 10 : maxVal === 180 ? 20 : 50;
            return task(
              level,
              `Eine Wertetabelle erreicht als höchsten y-Wert genau ${maxVal}. Die y-Achse bietet ${ticks} gleich große Kästchenschritte. Welche sinnvolle Schrittweite pro Kästchen wählst du?`,
              `Für ein Diagramm stehen dir nach oben genau ${ticks} cm Platz zur Verfügung, der größte Messwert beträgt ${maxVal}. Welche runde Schrittweite pro cm nutzt das Blatt am besten aus?`,
              [numberField("Schrittweite je Einheit =", step, "", 0)],
              "Teile den Höchstwert durch die Anzahl Schritte und runde auf eine glatte Zahl (5, 10, 20, 50) auf.",
              [
                `${maxVal} : ${ticks} = ${fmt(maxVal / ticks, 1)} → nächste glatte Schrittweite nach oben`,
                `<strong>${step} pro Schritt</strong>`,
              ],
              { maxVal, step },
            );
          },
        },
      ],
    }),

    // 8.2 Lineare Funktionen y = m*x + t (M-only)
    makeLesson(8, 2, LB, {
      id: "fk-2-lineare-funktionen-mxt",
      title: "Lineare Funktionen y = m · x + t",
      subtitle: "Funktionsgleichung, y-Achsenabschnitt t und Steigungsdreieck m am Graphen (M8)",
      tracks: ["M"],
      whyItMatters:
        "Im M-Zug ist y = m · x + t das zentrale Werkzeug der Algebra — jede Gerade lässt sich eindeutig durch ihre Steigung m und ihren Startwert t beschreiben.",
      explanationHtml: `
        <p>Jede nicht senkrechte Gerade im Koordinatensystem hat die Funktionsgleichung <strong>y = m · x + t</strong>:</p>
        <div class="example">
          <strong>Beispiel:</strong> Eine Gerade schneidet die y-Achse bei <strong>t = 2</strong> (Punkt (0 | 2)). Geht man im <strong>Steigungsdreieck</strong> Δx = 2 nach rechts und Δy = 3 nach oben, gilt:<br>
          Steigung m = ${frac("Δy", "Δx")} = ${frac(3, 2)} = <strong>1,5</strong>.<br>
          Funktionsgleichung: <strong>y = 1,5 · x + 2</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>t</strong> liest man direkt auf der y-Achse bei x = 0 ab. <strong>m = Δy : Δx</strong> gibt an, um wie viel y steigt (+) oder fällt (−), wenn x um 1 zunimmt!
        </div>
      `,
      formulas: [
        {
          name: "Normalform der linearen Funktion",
          html: "y = m · x + t",
          quantities: "m Steigung, t y-Achsenabschnitt beim Schnittpunkt (0 | t)",
        },
        {
          name: "Steigung am Steigungsdreieck",
          html: `m = ${frac("Δy", "Δx")} = ${frac("y₂ − y₁", "x₂ − x₁")}`,
          quantities: "Höhendifferenz durch Waagrecht-Schritt",
        },
      ],
      quiz: {
        question: "Eine Gerade fällt von (0 | 4) zu (2 | 0) gleichmäßig ab. Wie lautet ihre Funktionsgleichung?",
        options: ["y = −2·x + 4", "y = 2·x + 4", "y = −4·x + 2"],
        correctIndex: 0,
        explanation:
          "y-Achsenabschnitt ist t = 4. Von x = 0 bis x = 2 fällt y um Δy = −4 → m = −4 : 2 = −2.",
      },
      lab: lab(
        "linear-slope-triangle",
        "Steigung m & Achsenabschnitt t ziehen",
        "Ziehe den Punkt t auf der y-Achse oder die Spitze des Steigungsdreiecks und beobachte die Funktionsgleichung y = m·x + t.",
        [
          range("m", "Steigung m", -2, 3, 1.5, 0.5),
          range("t", "Achsenabschnitt t", -2, 6, 2, 0.5),
        ],
        [
          output("y4", "Funktionswert y(4)", (v) => 4 * v.m + v.t, "", 1, true),
        ],
        [
          {
            id: "reach-fall",
            text: "Ziehe eine fallende Gerade mit m = −1,5 und Startwert t = 4 (Null bei ~2,67).",
            check: (v) => v.m === -1.5 && v.t === 4,
          },
          {
            id: "origin-prop",
            text: "Lege die Gerade durch den Ursprung (t = 0) mit Steigung m = 2 (y(4) = 8).",
            check: (v, r) => v.t === 0 && v.m === 2 && near(Number(r.y4), 8, 0.01),
          },
          {
            id: "flat-line",
            text: "Erzeuge eine waagrechte Gerade (m = 0) bei t = 3.",
            check: (v) => v.m === 0 && v.t === 3,
          },
        ],
      ),
      exercises: [
        {
          id: "read-m-and-t",
          make(rng, level) {
            const dx = rng.pick([1, 2, 4, 5]);
            const dy = rng.pick([-4, -3, -2, 2, 3, 4, 6]);
            const m = Number((dy / dx).toFixed(2));
            const t = rng.int(-3, 5);
            const y2 = Number((m * dx + t).toFixed(2));
            return task(
              level,
              `Eine lineare Funktion schneidet die y-Achse bei (0 | ${fmt(t)}) und läuft durch (${dx} | ${fmt(y2, 2)}). Bestimme Steigung m und t.`,
              `Im Koordinatensystem geht eine Gerade durch P(0 | ${fmt(t)}) und Q(${dx} | ${fmt(y2, 2)}). Bestimme mithilfe des Steigungsdreiecks die Steigung m und den Achsenabschnitt t der Gleichung y = m·x + t.`,
              [
                numberField("Steigung m =", m, "", 2),
                numberField("Abschnitt t =", t, "", 0),
              ],
              "m = Δy : Δx = (y₂ − t) : dx",
              [
                `Δy = ${fmt(y2, 2)} − (${fmt(t)}) = ${fmt(dy)}, Δx = ${dx} → m = <strong>${fmt(m, 2)}</strong>`,
                `Achsenabschnitt: t = <strong>${fmt(t)}</strong>`,
              ],
              { m, t },
            );
          },
        },
        {
          id: "func-value-and-root",
          make(rng, level) {
            const m = rng.pick([1.5, 2, 2.5, -2, -1.5]);
            const xRoot = rng.pick([-4, -2, 2, 4, 6]);
            const t = Number((-m * xRoot).toFixed(1));
            const xEval = rng.int(2, 5);
            const yEval = Number((m * xEval + t).toFixed(1));
            const tText = t >= 0 ? `+ ${fmt(t, 1)}` : `− ${fmt(Math.abs(t), 1)}`;
            return task(
              level,
              level === 1
                ? `Gegeben ist y = ${fmt(m, 1)}·x ${tText}. Berechne den Funktionswert an der Stelle x = ${xEval}.`
                : `Ein Wassertank folgt y = ${fmt(m, 1)}·x ${tText}. Berechne den Wert bei x = ${xEval} sowie die Stelle x, bei der y = 0 wird (Nullstelle).`,
              level === 1
                ? `Berechne für die Gerade y = ${fmt(m, 1)}·x ${tText} die fehlende y-Koordinate bei x = ${xEval}.`
                : `Eine lineare Funktion hat die Gleichung y = ${fmt(m, 1)}·x ${tText}. Berechne sowohl y(${xEval}) als auch die Nullstelle x₀ (y = 0).`,
              level === 1
                ? [numberField(`y(${xEval}) =`, yEval, "", 1)]
                : [
                    numberField(`y(${xEval}) =`, yEval, "", 1),
                    numberField("Nullstelle x₀ =", xRoot, "", 1),
                  ],
              level === 1 ? "x in y = m·x + t einsetzen." : "Für die Nullstelle 0 = m·x + t nach x auflösen.",
              level === 1
                ? [`y = ${fmt(m, 1)} · ${xEval} ${tText}`, `<strong>${fmt(yEval, 1)}</strong>`]
                : [
                    `y(${xEval}) = ${fmt(yEval, 1)}`,
                    `0 = ${fmt(m, 1)}·x ${tText} → x₀ = <strong>${fmt(xRoot, 1)}</strong>`,
                  ],
              { m, t, xEval, yEval, xRoot },
            );
          },
        },
      ],
    }),
  ],
);
