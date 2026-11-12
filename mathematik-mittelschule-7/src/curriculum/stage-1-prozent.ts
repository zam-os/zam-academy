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

const LB = [1, 1] as [number, number];
const DENOMS = [10, 20, 25, 50];

export const STAGE_PROZENT = makeStage(
  1,
  "Prozentrechnung",
  "Anteile als Hundertstelbrüche deuten, vergleichen, Grundbegriffe berechnen, Mischungen lösen und Diagramme lesen",
  "#2563eb",
  "💯",
  LB,
  [
    makeLesson(1, 1, LB, {
      id: "pr-1-anteile-hundertstel",
      title: "Prozentsätze als Hundertstelbrüche",
      subtitle: "Anteile im Hunderterfeld sichtbar machen und Brüche umwandeln",
      tracks: BOTH,
      whyItMatters:
        "Rabatte, Akkuanzeigen und Inhaltsstoffe stehen fast immer in Prozent — hinter jedem Prozentsatz steckt ein Bruch mit Nenner 100.",
      explanationHtml: `
        <p><strong>Prozent (%)</strong> bedeutet „von Hundert“. Ein Prozentsatz beschreibt denselben Anteil wie ein <strong>Hundertstelbruch</strong> oder eine Dezimalzahl.</p>
        <div class="example">
          <strong>Beispiel:</strong> In einer Umfrage stimmen ${frac(7, 20)} der Klasse für den Ausflug.<br>
          Erweitere auf den Nenner 100 (mal 5): ${frac(7, 20)} = ${frac(35, 100)} = <strong>35 %</strong> = 0,35.
        </div>
        <div class="merke">
          <strong>Merke:</strong> p % = ${frac("p", 100)}. Brüche mit Nenner 2, 4, 5, 10, 20, 25 oder 50 erweiterst du direkt auf 100.
        </div>
      `,
      formulas: [
        {
          name: "Prozentsatz als Bruch",
          html: `p % = ${frac("p", 100)}`,
          quantities: "p Prozentsatz (Hundertstelanteil)",
        },
        {
          name: "Erweitern auf 100",
          html: `${frac("z", "n")} = ${frac("z · k", 100)} = (z · k) %`,
          quantities: "z Zähler, n Nenner (Teiler von 100), k = 100 : n",
        },
      ],
      quiz: {
        question: "Welcher Prozentsatz gehört zum Bruch 9/25?",
        options: ["36 %", "9 %", "25 %"],
        correctIndex: 0,
        explanation:
          "9/25 erweitert mit 4 ergibt 36/100, also genau 36 %.",
      },
      lab: lab(
        "percent-grid",
        "Hunderterfeld & Hundertstelbruch",
        "Stelle Zähler und Nenner ein und beobachte, wie viele Felder von 100 gefärbt sind.",
        [
          range("zaehler", "Zähler", 1, 10, 3, 1),
          choice("nennerIdx", "Nenner", ["10", "20", "25", "50"], 1),
        ],
        [
          output(
            "pct",
            "Prozentsatz",
            (v) => (v.zaehler / DENOMS[v.nennerIdx]) * 100,
            "%",
            0,
            true,
          ),
          output(
            "dec",
            "Dezimalzahl",
            (v) => v.zaehler / DENOMS[v.nennerIdx],
            "",
            2,
          ),
        ],
        [
          {
            id: "quarter",
            text: "Färbe genau ein Viertel (25 %) des Feldes mit Nenner 20.",
            check: (v, r) => DENOMS[v.nennerIdx] === 20 && near(Number(r.pct), 25, 0.01),
          },
          {
            id: "half-25",
            text: "Stelle Nenner 25 ein und erreiche 36 %.",
            check: (v, r) => DENOMS[v.nennerIdx] === 25 && near(Number(r.pct), 36, 0.01),
          },
          {
            id: "low-50",
            text: "Zeige mit Nenner 50 einen Anteil von genau 14 %.",
            check: (v, r) => DENOMS[v.nennerIdx] === 50 && near(Number(r.pct), 14, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "frac-to-percent",
          make(rng, level) {
            const den = rng.pick([4, 5, 10, 20, 25, 50]);
            const factor = 100 / den;
            const num = rng.int(1, den - 1);
            const ans = num * factor;
            return task(
              level,
              `Wandle den Bruch ${num}/${den} in Prozent um.`,
              `Bei einer Schülersprecherwahl erhält eine Kandidatin ${num} von ${den} Stimmen. Wie viel Prozent sind das?`,
              [numberField("p =", ans, "%", 0, {
                slips: [{ value: num, hint: "Der Zähler allein ist noch kein Prozentsatz — erst auf Hundertstel erweitern!" }],
              })],
              `Erweitere ${num}/${den} mit ${factor} auf den Nenner 100.`,
              [
                `${num}/${den} mit ${factor} erweitern: (${num} · ${factor}) / (${den} · ${factor}) = ${ans}/100`,
                `<strong>${ans} %</strong>`,
              ],
              { num, den, ans },
            );
          },
        },
        {
          id: "percent-to-decimal",
          make(rng, level) {
            const pct = rng.int(2, 95);
            const dec = pct / 100;
            return task(
              level,
              `Wandle den Prozentsatz ${pct} % in eine Dezimalzahl um.`,
              `Auf einer Saftflasche steht „${pct} % Fruchtgehalt“. Gib diesen Anteil als Dezimalzahl (von 1 Liter = 1,00) an.`,
              [numberField("Dezimalzahl =", dec, "", 2, {
                slips: [{ value: pct, hint: "Teile durch 100 (Komma um zwei Stellen nach links verschieben)." }],
              })],
              "p % = p : 100 (Komma um zwei Stellen nach links).",
              [
                `${pct} % = ${pct}/100 = ${pct} : 100`,
                `<strong>${fmt(dec, 2)}</strong>`,
              ],
              { pct, dec },
            );
          },
        },
      ],
    }),

    makeLesson(1, 2, LB, {
      id: "pr-2-anteile-vergleichen",
      title: "Anteile mit Prozentsätzen vergleichen",
      subtitle: "Unterschiedliche Gesamtzahlen durch Prozentangaben fair gegenüberstellen",
      tracks: BOTH,
      whyItMatters:
        "Ob 15 Treffer besser sind als 18 Treffer, weißt du erst, wenn du die Gesamtzahl kennst und in Prozent umrechnest.",
      explanationHtml: `
        <p>Absolute Zahlen täuschen oft, wenn zwei Gruppen verschieden groß sind. Erst der <strong>Prozentsatz</strong> (Anteil bezogen auf 100) macht Ergebnisse direkt vergleichbar.</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          Klasse 7a: 12 von 20 Kindern fahren Rad → ${frac(12, 20)} = ${frac(60, 100)} = <strong>60 %</strong><br>
          Klasse 7b: 14 von 25 Kindern fahren Rad → ${frac(14, 25)} = ${frac(56, 100)} = <strong>56 %</strong><br>
          Obwohl in der 7b absolut mehr Kinder Rad fahren (14 &gt; 12), ist der Anteil in der 7a höher!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Vergleiche Anteile bei verschiedenen Grundwerten immer über ihren Prozentsatz, niemals nur über die bloße Trefferzahl.
        </div>
      `,
      formulas: [
        {
          name: "Anteil vergleichen",
          html: `p = ${frac("Teil", "Gesamt")} · 100 %`,
          quantities: "Teil (Prozentwert), Gesamt (Grundwert)",
        },
      ],
      quiz: {
        question:
          "Wer hat die bessere Trefferquote: Jonas mit 9 von 20 Würfen oder Mia mit 11 von 25 Würfen?",
        options: [
          "Jonas (45 % gegenüber 44 %)",
          "Mia, weil 11 mehr als 9 ist",
          "Beide haben genau 50 %",
        ],
        correctIndex: 0,
        explanation:
          "9/20 = 45/100 = 45 %, während 11/25 = 44/100 = 44 %. Jonas liegt knapp vorn.",
      },
      lab: lab(
        "percent-compare",
        "Zwei Anteile im Vergleich",
        "Ziehe die Treffer von Gruppe A oder verstelle die Gruppengrößen und vergleiche beide Quoten.",
        [
          range("aHit", "Treffer A", 1, 20, 12, 1),
          range("aTotal", "Gesamt A", 20, 50, 25, 5),
          range("bHit", "Treffer B", 1, 40, 14, 1),
          range("bTotal", "Gesamt B", 20, 50, 25, 5),
        ],
        [
          output("pA", "Anteil A", (v) => (Math.min(v.aHit, v.aTotal) / v.aTotal) * 100, "%", 1, true),
          output("pB", "Anteil B", (v) => (Math.min(v.bHit, v.bTotal) / v.bTotal) * 100, "%", 1),
        ],
        [
          {
            id: "a-wins-60",
            text: "Bringe Gruppe A auf genau 60 % (bei Gesamt A = 25).",
            check: (v, r) => v.aTotal === 25 && near(Number(r.pA), 60, 0.01),
          },
          {
            id: "equal-diff-totals",
            text: "Erreiche genau denselben Prozentsatz für A und B bei verschiedenen Gesamtzahlen.",
            check: (v, r) => v.aTotal !== v.bTotal && near(Number(r.pA), Number(r.pB), 0.01),
          },
          {
            id: "b-over-70",
            text: "Stelle Gruppe B auf über 70 % bei Gesamt B = 40.",
            check: (v, r) => v.bTotal === 40 && Number(r.pB) > 70,
          },
        ],
      ),
      exercises: [
        {
          id: "compare-two-groups",
          make(rng, level) {
            const gA = rng.pick([20, 25, 40]);
            const gB = rng.pick([25, 50].filter((x) => x !== gA));
            const pA = rng.int(4, 16) * 5;
            const pB = rng.int(4, 16) * 5;
            const pBAdj = pA === pB ? pB + 5 : pB;
            const hA = Math.round((gA * pA) / 100);
            const hB = Math.round((gB * pBAdj) / 100);
            const realPA = (hA / gA) * 100;
            const realPB = (hB / gB) * 100;
            const idx = realPA > realPB ? 0 : 1;
            return task(
              level,
              `Berechne beide Prozentsätze und wähle den größeren Anteil: A hat ${hA} von ${gA}, B hat ${hB} von ${gB}.`,
              `Beim Sportfest trifft Team A ${hA}-mal bei ${gA} Versuchen. Team B trifft ${hB}-mal bei ${gB} Versuchen. Welches Team hat die höhere Trefferquote?`,
              [
                numberField("Quote A =", realPA, "%", 1),
                numberField("Quote B =", realPB, "%", 1),
                choiceField("Höherer Anteil", ["Gruppe / Team A", "Gruppe / Team B"], idx),
              ],
              "Rechne für beide Gruppen Teil : Gesamt · 100 %.",
              [
                `Quote A: ${hA} : ${gA} · 100 % = ${fmt(realPA, 1)} %`,
                `Quote B: ${hB} : ${gB} · 100 % = ${fmt(realPB, 1)} %`,
                `<strong>${idx === 0 ? "Gruppe A" : "Gruppe B"} hat den größeren Anteil.</strong>`,
              ],
              { realPA, realPB },
            );
          },
        },
        {
          id: "compare-price-share",
          make(rng, level) {
            const tot = rng.pick([20, 25, 50]);
            const part = rng.int(2, tot - 2);
            const pct = (part / tot) * 100;
            return task(
              level,
              `Berechne den Prozentsatz von ${part} aus ${tot}.`,
              `Von ${tot} überprüften Fahrrädern der 7. Klasse sind ${part} verkehrssicher ausgestattet. Wie viel Prozent sind das?`,
              [numberField("p =", pct, "%", 1)],
              "Teile den Teil durch das Ganze und multipliziere mit 100.",
              [
                `${part} : ${tot} · 100 % = ${fmt(pct, 1)} %`,
                `<strong>${fmt(pct, 1)} %</strong>`,
              ],
              { tot, part, pct },
            );
          },
        },
      ],
    }),

    makeLesson(1, 3, LB, {
      id: "pr-3-grundbegriffe-berechnen",
      title: "Grundwert, Prozentwert und Prozentsatz",
      subtitle: "Die drei Grundgrößen zuordnen, überschlagen und gezielt berechnen",
      tracks: BOTH,
      whyItMatters:
        "Jede Prozentaufgabe fragt genau nach einer von drei Größen: dem Ganzen (G), dem Anteil (P) oder der Prozentzahl (p).",
      explanationHtml: `
        <p>In der Prozentrechnung unterscheidest du immer drei Begriffe:</p>
        <ul>
          <li><strong>Grundwert G:</strong> das Ganze (entspricht 100 %)</li>
          <li><strong>Prozentwert P:</strong> der gegebene Teilwert in derselben Einheit wie G</li>
          <li><strong>Prozentsatz p %:</strong> der Anteil in Prozent</li>
        </ul>
        <div class="example">
          <strong>Beispiel (alle drei Richtungen):</strong><br>
          1) <em>P gesucht:</em> 15 % von 240 € → 240 · 0,15 = <strong>36 €</strong> (Überschlag: 10 % = 24 €, 5 % = 12 €).<br>
          2) <em>p gesucht (M7-Formel):</em> 36 € von 240 € → p = ${frac("P", "G")} = ${frac(36, 240)} = 0,15 = <strong>15 %</strong>.<br>
          3) <em>G gesucht:</em> 15 % sind 36 € → 1 % = 36 : 15 = 2,40 € → 100 % = <strong>240 €</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Im M-Zug rechnest du schnell mit dem Faktor q = ${frac("p", 100)} (P = G · q) und der Formel p = ${frac("P", "G")}. Mit dem Dreisatz klappt es immer!
        </div>
      `,
      formulas: [
        {
          name: "Prozentwert P",
          html: `P = G · ${frac("p", 100)}`,
          quantities: "G Grundwert, p % Prozentsatz",
        },
        {
          name: "Prozentsatz p (Faktorform)",
          html: `p = ${frac("P", "G")} = ${frac("P", "G")} · 100 %`,
          quantities: "P Prozentwert, G Grundwert",
        },
        {
          name: "Grundwert G",
          html: `G = ${frac("P · 100", "p")}`,
          quantities: "P Prozentwert, p Prozentsatz",
        },
      ],
      quiz: {
        question:
          "„Im Kino sind 45 der 150 Plätze belegt.“ Welche Größe wird gesucht, wenn du den Anteil in % berechnen sollst?",
        options: [
          "Der Prozentsatz p (G = 150, P = 45)",
          "Der Grundwert G (P = 150, p = 45 %)",
          "Der Prozentwert P (G = 45, p = 150 %)",
        ],
        correctIndex: 0,
        explanation:
          "150 Plätze sind alle Plätze (Grundwert G = 150), 45 der Teil (Prozentwert P = 45). Gesucht ist p = 45 : 150 = 0,30 = 30 %.",
      },
      lab: lab(
        "percent-bar",
        "Prozentstreifen: G, P und p",
        "Ziehe am Balken oder verändere G und beobachte Prozentwert P und Faktor.",
        [
          range("g", "Grundwert G", 40, 400, 200, 20, "€"),
          range("p", "Prozentsatz p", 5, 100, 25, 5, "%"),
        ],
        [
          output("P", "Prozentwert P", (v) => (v.g * v.p) / 100, "€", 2, true),
          output("faktor", "Faktor p/100", (v) => v.p / 100, "", 2),
        ],
        [
          {
            id: "p60-g240",
            text: "Berechne am Balken: Wie groß ist P für G = 240 € und p = 35 %? Stelle genau so ein.",
            check: (v) => v.g === 240 && v.p === 35,
          },
          {
            id: "find-100",
            text: "Erreiche einen Prozentwert P = 90 € (bei p ≠ 50 %).",
            check: (v, r) => v.p !== 50 && near(Number(r.P), 90, 0.01),
          },
          {
            id: "factor-085",
            text: "Stelle Faktor 0,85 und Grundwert G = 300 € ein.",
            check: (v) => v.p === 85 && v.g === 300,
          },
        ],
      ),
      exercises: [
        {
          id: "find-P",
          make(rng, level) {
            const g = rng.int(4, 30) * 20;
            const p = rng.pick([10, 15, 20, 25, 30, 35, 40, 60, 75]);
            const ans = (g * p) / 100;
            return task(
              level,
              `Berechne den Prozentwert P: Grundwert G = ${fmt(g)} €, Prozentsatz p = ${p} %.`,
              `Eine Jacke kostet regulär ${fmt(g)} €. Beim Saisonende gibt es ${p} % Preisnachlass. Wie viel Euro sparst du?`,
              [numberField("P =", ans, "€", 2, {
                slips: [{ value: g - ans, hint: "Gefragt ist nur der Nachlass (Prozentwert P), nicht der Restpreis!" }],
              })],
              "Prozentwert P = Grundwert G · (p : 100).",
              [
                `P = ${fmt(g)} € · ${fmt(p / 100, 2)}`,
                `<strong>${fmt(ans, 2)} €</strong>`,
              ],
              { g, p, ans },
            );
          },
        },
        {
          id: "find-G",
          make(rng, level) {
            const p = rng.pick([10, 20, 25, 40, 50, 75]);
            const g = rng.int(4, 25) * 20;
            const P = (g * p) / 100;
            return task(
              level,
              `Berechne den Grundwert G: Prozentwert P = ${fmt(P)} €, Prozentsatz p = ${p} %.`,
              `Beim Verkauf eines Rads spart Lukas genau ${fmt(P)} €. Das entspricht einem Rabatt von ${p} %. Wie hoch war der ursprüngliche Preis?`,
              [numberField("G =", g, "€", 2)],
              "Rechne über 1 %: (P : p) · 100 = Grundwert G.",
              [
                `1 % entspricht ${fmt(P)} : ${p} = ${fmt(P / p, 2)} €`,
                `100 % = ${fmt(P / p, 2)} € · 100 = <strong>${fmt(g, 2)} €</strong>`,
              ],
              { p, P, g },
            );
          },
        },
      ],
    }),

    makeLesson(1, 4, LB, {
      id: "pr-4-funktionale-zusammenhaenge",
      title: "Wie sich Grundgrößen verändern",
      subtitle: "Funktionale Zusammenhänge zwischen G, P und p zum Argumentieren nutzen",
      tracks: BOTH,
      whyItMatters:
        "Im Alltag sollst du oft blitzschnell abschätzen: ‚Wie verändert sich mein Anteil, wenn der Preis sich verdoppelt oder der Prozentsatz halbiert?‘",
      explanationHtml: `
        <p>Die Formel <strong>P = G · ${frac("p", 100)}</strong> zeigt eine klare Struktur: Verdoppelt man bei gleichem Prozentsatz den Grundwert G, verdoppelt sich auch der Prozentwert P!</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          Bei G = 200 € und p = 20 % ist P = 40 €.<br>
          • G verdoppeln (400 €), p bleibt 20 % → P verdoppelt sich auf <strong>80 €</strong>.<br>
          • G bleibt 200 €, p verdoppeln (40 %) → P verdoppelt sich auf <strong>80 €</strong>.<br>
          • G verdoppeln (400 €) und P gleich lassen (40 €) → p halbiert sich auf <strong>10 %</strong>!
        </div>
        <div class="merke">
          <strong>Merke:</strong> P wächst im gleichen Verhältnis wie G (bei festem p) und wie p (bei festem G). Bleibt P gleich, wird p bei doppeltem G halb so groß.
        </div>
      `,
      formulas: [
        {
          name: "Lineare Struktur",
          html: `P(2 · G) = 2 · P(G)`,
          quantities: "bei gleichbleibendem Prozentsatz p %",
        },
      ],
      quiz: {
        question:
          "Der Grundwert G wird verdreifacht, der Prozentsatz p % bleibt gleich. Was passiert mit dem Prozentwert P?",
        options: [
          "P wird dreimal so groß.",
          "P bleibt unverändert.",
          "P wird auf ein Drittel verkleinert.",
        ],
        correctIndex: 0,
        explanation:
          "Da P = G · (p/100), wächst P proportional zu G. Dreifacher Grundwert ergibt dreifachen Prozentwert.",
      },
      lab: lab(
        "percent-bar",
        "Veränderungen prüfen",
        "Verdopple oder halbiere G und p am Balken und prüfe, wie P reagiert.",
        [
          range("g", "Grundwert G", 40, 400, 100, 20, "€"),
          range("p", "Prozentsatz p", 5, 100, 30, 5, "%"),
        ],
        [
          output("P", "Prozentwert P", (v) => (v.g * v.p) / 100, "€", 2, true),
        ],
        [
          {
            id: "double-G",
            text: "Starte gedanklich bei G = 100 €, p = 30 % (P = 30 €). Verdopple G und lies P = 60 € ab.",
            check: (v, r) => v.g === 200 && v.p === 30 && near(Number(r.P), 60, 0.01),
          },
          {
            id: "same-P-half-p",
            text: "Halte P = 30 €, aber erhöhe G auf 300 € — auf welches p sinkt der Satz?",
            check: (v, r) => v.g === 300 && near(Number(r.P), 30, 0.01),
          },
          {
            id: "same-P-double-p",
            text: "Erreiche P = 60 € mit halbem G = 120 € und passendem p = 50 %.",
            check: (v, r) => v.g === 120 && v.p === 50 && near(Number(r.P), 60, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "scaling-P",
          make(rng, level) {
            const g = rng.pick([80, 120, 160, 200]);
            const p = rng.pick([15, 20, 25]);
            const k = rng.pick([2, 3]);
            const oldP = (g * p) / 100;
            const newP = oldP * k;
            return task(
              level,
              `Für G = ${g} € und p = ${p} % gilt P = ${fmt(oldP)} €. Wie groß ist P, wenn G ${k}-mal so groß wird (p bleibt gleich)?`,
              `Eine Spendenaktion sammelt normalerweise ${p} % einer Summe von ${g} € für die Schulbücherei ein. Nun wird das Spendenziel ver-${k}-facht, der Anteil von ${p} % bleibt gleich. Wie viel Euro erhält die Bücherei dann?`,
              [numberField("P neu =", newP, "€", 2)],
              `Wird G mit ${k} multipliziert, wird auch P mit ${k} multipliziert.`,
              [
                `Alter Prozentwert: ${fmt(oldP)} €`,
                `G · ${k} → P · ${k} = ${fmt(oldP)} € · ${k} = <strong>${fmt(newP, 2)} €</strong>`,
              ],
              { oldP, newP, k },
            );
          },
        },
        {
          id: "compensate-p",
          make(rng, level) {
            const pStart = rng.pick([20, 30, 40, 60]);
            const pNew = pStart / 2;
            return task(
              level,
              `G verdoppelt sich, P soll aber genau gleich bleiben. Der alte Prozentsatz war ${pStart} %. Wie groß ist der neue Prozentsatz?`,
              `In einem Dorf hat sich die Einwohnerzahl in 20 Jahren verdoppelt. Die Mitgliederzahl der Feuerwehr blieb jedoch genau gleich. Früher waren ${pStart} % der Einwohner bei der Feuerwehr — wie viel Prozent sind es heute?`,
              [numberField("p neu =", pNew, "%", 1, {
                slips: [{ value: pStart * 2, hint: "Der Grundwert im Nenner wird doppelt so groß → der Prozentsatz wird kleiner, nicht größer!" }],
              })],
              "Doppelter Grundwert bei gleichem Prozentwert bedeutet halber Prozentsatz.",
              [
                `G doppelt, P gleich → p wird durch 2 geteilt`,
                `${pStart} % : 2 = <strong>${fmt(pNew, 1)} %</strong>`,
              ],
              { pStart, pNew },
            );
          },
        },
      ],
    }),

    makeLesson(1, 5, LB, {
      id: "pr-5-mischungen-beruf",
      title: "Mischungsverhältnisse & berufsbezogene Aufgaben",
      subtitle: "Gesamtmenge aus Teilmengen bilden und Prozentanteile in Alltag & Beruf berechnen",
      tracks: BOTH,
      whyItMatters:
        "Ob Saftschorle, Betonmischung auf der Baustelle oder Haarfarbe im Friseursalon: Überall werden Bestandteile nach Anteilen gemischt.",
      explanationHtml: `
        <p>Bei einer <strong>Mischung</strong> gehören immer zwei oder mehr Teile zusammen. Achtung: Der <strong>Grundwert G</strong> ist die <em>Summe aller Teile</em> (die Gesamtmenge), nicht nur der andere Bestandteil!</p>
        <div class="example">
          <strong>Beispiel (Werkstatt/Küche):</strong> 150 ml Apfelsaft werden mit 350 ml Wasser gemischt.<br>
          • Gesamtmenge G = 150 ml + 350 ml = <strong>500 ml</strong><br>
          • Anteil Saft P = 150 ml<br>
          • Prozentsatz p = ${frac(150, 500)} · 100 % = <strong>30 %</strong>
        </div>
        <div class="merke">
          <strong>Merke:</strong> Addiere bei Mischungsverhältnissen immer zuerst alle Einzelteile zum Grundwert G (100 %).
        </div>
      `,
      formulas: [
        {
          name: "Prozentsatz in einer Mischung",
          html: `G = Teil₁ + Teil₂ ,  p₁ = ${frac("Teil₁", "G")} · 100 %`,
          quantities: "Teil₁ betrachteter Anteil, G gesamte Mischungsmenge",
        },
      ],
      quiz: {
        question:
          "Du rührst 1 Teil Sirup mit 3 Teilen Wasser an. Wie viel Prozent Sirup enthält das fertige Getränk?",
        options: ["25 % (1 von 4 Teilen)", "33,3 % (1 durch 3)", "75 % (3 von 4 Teilen)"],
        correctIndex: 0,
        explanation:
          "Insgesamt hast du 1 + 3 = 4 Teile. 1/4 = 25/100 = 25 %.",
      },
      lab: lab(
        "mixture-ratio",
        "Mischungs-Labor",
        "Mische Anteil A und Anteil B und lies die Gesamtmenge sowie beide Prozentanteile ab.",
        [
          range("partA", "Anteil A", 20, 200, 40, 10, "g"),
          range("partB", "Anteil B", 20, 200, 160, 10, "g"),
        ],
        [
          output("sum", "Gesamtmenge G", (v) => v.partA + v.partB, "g", 0),
          output("pctA", "Anteil A in %", (v) => (v.partA / (v.partA + v.partB)) * 100, "%", 1, true),
        ],
        [
          {
            id: "mix-25",
            text: "Stelle eine genau 25-%-Mischung (Anteil A = 25 %) her.",
            check: (_v, r) => near(Number(r.pctA), 25, 0.01),
          },
          {
            id: "mix-300",
            text: "Erzeuge 300 g Gesamtmenge mit genau 40 % Anteil A.",
            check: (_v, r) => near(Number(r.sum), 300, 0.01) && near(Number(r.pctA), 40, 0.01),
          },
          {
            id: "mix-50",
            text: "Finde ein Mischungsverhältnis 1 : 1 (50 %).",
            check: (v, r) => v.partA === v.partB && near(Number(r.pctA), 50, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "mix-two-parts",
          make(rng, level) {
            const pA = rng.pick([10, 20, 25, 30, 40]);
            const factor = rng.int(2, 6);
            const tot = factor * 100;
            const partA = (tot * pA) / 100;
            const partB = tot - partA;
            return task(
              level,
              `Mische ${partA} g Teil A mit ${partB} g Teil B. Berechne den Prozentanteil von Teil A an der Gesamtmischung.`,
              `Auf einer Baustelle werden ${partA} kg Zement und ${partB} kg Sand/Kies trocken vermischt. Wie viel Prozent Zement enthält die Mischung?`,
              [numberField("p =", pA, "%", 1, {
                slips: [{ value: (partA / partB) * 100, hint: "Nicht durch Teil B teilen! Der Grundwert ist die Gesamtmenge (Teil A + Teil B)." }],
              })],
              "Addiere beide Teile zu G = Teil A + Teil B, berechne dann Teil A : G · 100 %.",
              [
                `Gesamtmenge G = ${partA} + ${partB} = ${tot}`,
                `p = ${partA} : ${tot} · 100 % = <strong>${pA} %</strong>`,
              ],
              { partA, partB, tot, pA },
            );
          },
        },
        {
          id: "work-percent-material",
          make(rng, level) {
            const raw = rng.int(4, 20) * 50;
            const lossPct = rng.pick([8, 10, 12, 15, 20]);
            const usable = raw * (1 - lossPct / 100);
            return task(
              level,
              `Von ${raw} g Ausgangsmaterial fallen ${lossPct} % Verschnitt weg. Wie viel Gramm bleiben übrig?`,
              `In der Schreinerei werden ${raw} cm Holzlatten zugesägt. Durch Sägeschnitte und Verschnitt gehen ${lossPct} % verloren. Wie viel Zentimeter nutzbare Leiste bleiben?`,
              [numberField("Rest =", usable, level === 1 ? "g" : "cm", 1)],
              "Berechne zuerst den Verschnitt (P) und ziehe ihn vom Ausgangswert (G) ab.",
              [
                `Verschnitt: ${raw} · ${fmt(lossPct / 100, 2)} = ${fmt((raw * lossPct) / 100, 1)}`,
                `Rest: ${raw} − ${fmt((raw * lossPct) / 100, 1)} = <strong>${fmt(usable, 1)}</strong>`,
              ],
              { raw, lossPct, usable },
            );
          },
        },
      ],
    }),

    makeLesson(1, 6, LB, {
      id: "pr-6-prozentdiagramme",
      title: "Prozentsätze in Diagrammen lesen & prüfen",
      subtitle: "Säulen-, Balken-, Streifen- und Kreisdiagramme auswerten und bewerten",
      tracks: BOTH,
      whyItMatters:
        "In Nachrichten und Werbung stecken Zahlen in Diagrammen. Wer nachrechnet, erkennt sofort fehlende Anteile oder verzerrte Darstellungen.",
      explanationHtml: `
        <p>Prozentverteilungen kannst du unterschiedlich darstellen: als <strong>Säulen-, Balken-, Streifen- oder Kreisdiagramm</strong>. Bei Streifen- und Kreisdiagrammen müssen alle Stücke zusammen immer <strong>100 %</strong> ergeben (beim Kreis entspricht 1 % genau <strong>3,6°</strong>).</p>
        <div class="example">
          <strong>Beispiel (Kreisdiagramm):</strong> Verkehrsmittel zur Schule: 50 % Bus, 30 % Rad, Rest zu Fuß.<br>
          • Zu Fuß: 100 % − (50 % + 30 %) = <strong>20 %</strong><br>
          • Winkel für „zu Fuß“: 20 · 3,6° = <strong>72°</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Im Kreisdiagramm gilt: 100 % ≙ 360°, also <strong>1 % ≙ 3,6°</strong>. Prüfe bei jedem Diagramm, ob die Summe 100 % ergibt und die Achse bei 0 beginnt.
        </div>
      `,
      formulas: [
        {
          name: "Winkel im Kreisdiagramm",
          html: `α = p · 3,6°`,
          quantities: "p Prozentsatz, α Mittelpunktswinkel",
        },
        {
          name: "Prozentsatz aus Winkel",
          html: `p = ${frac("α", "3,6°")} %`,
          quantities: "α gemessener Winkel im Kreisdiagramm",
        },
      ],
      quiz: {
        question:
          "Ein Sektor im Kreisdiagramm ist 90° groß. Wie viel Prozent stellt dieser Sektor dar?",
        options: ["25 %", "90 %", "10 %"],
        correctIndex: 0,
        explanation:
          "90° sind ein Viertel von 360°, und 90° : 3,6° = 25 %.",
      },
      lab: lab(
        "percent-chart",
        "Diagrammtypen vergleichen",
        "Schalte zwischen Kreis-, Streifen- und Säulendiagramm um und beobachte Winkel und Prozente.",
        [
          range("a", "Wert A", 10, 60, 40, 5),
          range("b", "Wert B", 10, 60, 35, 5),
          range("c", "Wert C", 10, 60, 25, 5),
          choice("mode", "Diagramm", ["Kreis", "Streifen", "Säulen"], 0),
        ],
        [
          output("pA", "Anteil A", (v) => (v.a / (v.a + v.b + v.c)) * 100, "%", 1, true),
          output("degA", "Winkel A", (v) => (v.a / (v.a + v.b + v.c)) * 360, "°", 0),
        ],
        [
          {
            id: "circle-90",
            text: "Stelle das Kreisdiagramm ein und mache Sektor A genau 90° (25 %) groß.",
            check: (v, r) => v.mode === 0 && near(Number(r.degA), 90, 0.02),
          },
          {
            id: "strip-50",
            text: "Wechsle ins Streifendiagramm und bringe A genau auf 50 %.",
            check: (v, r) => v.mode === 1 && near(Number(r.pA), 50, 0.01),
          },
          {
            id: "bar-equal",
            text: "Zeige im Säulendiagramm drei exakt gleich hohe Säulen (je 33,3 %).",
            check: (v) => v.mode === 2 && v.a === v.b && v.b === v.c,
          },
        ],
      ),
      exercises: [
        {
          id: "circle-angle-calc",
          make(rng, level) {
            const p = rng.pick([15, 20, 25, 30, 35, 40, 45]);
            const deg = p * 3.6;
            return task(
              level,
              `Berechne den Winkel α im Kreisdiagramm für p = ${p} %.`,
              `In einer Klassenumfrage bevorzugen ${p} % der Schülerinnen und Schüler Fußball. Welchen Mittelpunktswinkel musst du dafür ins Kreisdiagramm zeichnen?`,
              [numberField("α =", deg, "°", 1)],
              "1 % entspricht 3,6° (denn 360° : 100 = 3,6°).",
              [
                `α = ${p} · 3,6°`,
                `<strong>${fmt(deg, 1)}°</strong>`,
              ],
              { p, deg },
            );
          },
        },
        {
          id: "missing-sector",
          make(rng, level) {
            const p1 = rng.pick([20, 25, 30, 35, 40]);
            const p2 = rng.pick([15, 20, 25, 30]);
            const rest = 100 - p1 - p2;
            return task(
              level,
              `Ein Streifendiagramm hat drei Felder: ${p1} %, ${p2} % und ein Restfeld. Wie viel Prozent fehlen bis 100 %?`,
              `In einem Kreisdiagramm über Freizeitaktivitäten stehen bei „Sport“ ${p1} % und bei „Musik“ ${p2} %. Der restliche Sektor heißt „Sonstiges“. Wie viel Prozent entfallen auf „Sonstiges“?`,
              [numberField("Rest =", rest, "%", 0)],
              "Alle Anteile eines vollständigen Streifen- oder Kreisdiagramms ergeben zusammen 100 %.",
              [
                `100 % − (${p1} % + ${p2} %) = 100 % − ${p1 + p2} %`,
                `<strong>${rest} %</strong>`,
              ],
              { p1, p2, rest },
            );
          },
        },
      ],
    }),
  ],
);
