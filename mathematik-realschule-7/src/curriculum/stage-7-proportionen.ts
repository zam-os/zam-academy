import { fmt } from "../exercises/format";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson as lesson,
  makeStage,
  task,
} from "./builders";
const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(7, step, [7, 5], content);

const prozent = L(1, {
  id: "pr-1-veraenderter-grundwert",
  title: "7.1 Preise erhöhen und vermindern",
  subtitle: "Mit dem passenden Prozentfaktor rechnen",
  whyItMatters:
    "Rabatt und Aufschlag beziehen sich auf einen Grundwert. Bei mehreren Änderungen kann sich dieser Grundwert von Schritt zu Schritt ändern.",
  explanationHtml: `<p>Bei einer Erhöhung um p % ist der neue Wert G · (1 + p : 100). Bei einer Verminderung um p % ist er G · (1 − p : 100). Der neue Wert umfasst also 100 % plus oder minus p % des ursprünglichen Grundwerts.</p><div class="example">80 € mit 15 % Rabatt: 80 · 0,85 = 68 €. Ein anschließender Aufschlag von 15 % bezieht sich auf 68 €, nicht auf 80 €: 68 · 1,15 = 78,20 €. Die Änderungen heben sich nicht auf.</div><p>Für einen Nettopreis von 50 € und einen angegebenen Mehrwertsteuersatz von 19 % beträgt der Bruttopreis 50 · 1,19 = 59,50 €. Der Steuersatz wird in der Aufgabe vorgegeben.</p><div class="merke"><strong>Merke:</strong> Erhöhung: Faktor 1 + p/100. Verminderung: Faktor 1 − p/100. Vor jedem Schritt prüfen: Was ist jetzt der Grundwert?</div>`,
  formulas: [
    {
      name: "Veränderter Grundwert",
      html: "G<sub>neu</sub> = G · (1 ± p : 100)",
      quantities: "+ bei Erhöhung, − bei Verminderung",
    },
  ],
  quiz: {
    question: "Welcher Faktor gehört zu 20 % Rabatt?",
    options: ["0,8", "1,2", "0,2"],
    correctIndex: 0,
    explanation:
      "Nach 20 % Rabatt bleiben 80 % des Grundwerts, also der Faktor 0,8.",
  },
  lab: lab(
    "percent",
    "Preisänderung sehen",
    "Ziehe den neuen Preis über den Prozentsatz. Die Balken trennen ursprünglichen Preis und Änderung.",
    [
      r("base", "Ausgangspreis", 20, 200, 80, 10, "€"),
      r("p", "Prozentsatz", 5, 50, 10, 5, "%"),
      c("mode", "Änderung", ["Rabatt", "Aufschlag"], 0),
    ],
    [
      o("factor", "Faktor", (v) => 1 + ((v.mode === 0 ? -1 : 1) * v.p) / 100),
      o("change", "Änderungsbetrag", (v) => (v.base * v.p) / 100, "€"),
      o(
        "new",
        "Neuer Preis",
        (v) => v.base * (1 + ((v.mode === 0 ? -1 : 1) * v.p) / 100),
        "€",
      ),
    ],
    [
      {
        id: "rabatt",
        text: "Vermindere 80 € um 15 % auf 68 €.",
        check: (v) => v.base === 80 && v.p === 15 && v.mode === 0,
      },
      {
        id: "aufschlag",
        text: "Erhöhe 100 € um 20 % auf 120 €.",
        check: (v) => v.base === 100 && v.p === 20 && v.mode === 1,
      },
      {
        id: "halb",
        text: "Halbiere einen Ausgangspreis von 200 €.",
        check: (v) => v.base === 200 && v.p === 50 && v.mode === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "ein-schritt",
      make: (rng, level) => {
        const base = rng.int(4, 30) * 10,
          p = rng.pick([5, 10, 15, 20, 25]),
          up = rng.pick([true, false]),
          factor = 1 + ((up ? 1 : -1) * p) / 100,
          value = base * factor;
        return task(
          level,
          `Ein Preis von ${base} € wird um ${p} % ${up ? "erhöht" : "gesenkt"}. Berechne den neuen Preis.`,
          `Ein Preis von ${base} € wird zuerst um ${p} % ${up ? "erhöht" : "gesenkt"}, dann auf den neuen Preis um ${p} % ${up ? "gesenkt" : "erhöht"}. Berechne den Endpreis und entscheide, ob wieder der Ausgangspreis erreicht wird.`,
          [
            num(
              "Endpreis =",
              level === 1 ? value : value * (1 + ((up ? -1 : 1) * p) / 100),
              "€",
              2,
            ),
            ...(level === 2
              ? [pick("Wieder Ausgangspreis?", ["nein", "ja"], 0)]
              : []),
          ],
          "100 % plus oder minus p % als Faktor schreiben.",
          `Erster Faktor ${fmt(factor)}.${level === 2 ? ` Der zweite Schritt verwendet den geänderten Grundwert und Faktor ${fmt(1 + ((up ? -1 : 1) * p) / 100)}.` : ""}`,
          `${fmt(level === 1 ? value : value * (1 + ((up ? -1 : 1) * p) / 100), 2)} €.`,
          { base, p, up: Number(up) },
        );
      },
    },
    {
      id: "mehrwertsteuer-rabatt",
      make: (rng, level) => {
        const net = rng.int(5, 20) * 10,
          tax = rng.pick([7, 19]),
          p = rng.pick([10, 20, 25]),
          gross = net * (1 + tax / 100);
        return task(
          level,
          `Ein Nettopreis beträgt ${net} €. In dieser Aufgabe gilt ${tax} % Mehrwertsteuer. Berechne den Bruttopreis.`,
          `Ein Nettopreis von ${net} € erhält zuerst ${p} % Rabatt. Auf den verminderten Nettopreis werden ${tax} % Mehrwertsteuer aufgeschlagen. Berechne den Bruttopreis.`,
          [
            num(
              "Bruttopreis =",
              gross * (level === 1 ? 1 : 1 - p / 100),
              "€",
              2,
            ),
          ],
          "Brutto = Netto · (1 + Steuersatz : 100).",
          level === 1
            ? `Mit ${fmt(1 + tax / 100)} multiplizieren.`
            : `Zuerst mit ${fmt(1 - p / 100)}, anschließend mit ${fmt(1 + tax / 100)} multiplizieren.`,
          `${fmt(gross * (level === 1 ? 1 : 1 - p / 100), 2)} €.`,
          { net, tax, p },
        );
      },
    },
  ],
});

const rueckwaerts = L(2, {
  id: "pr-2-grundwert-zurueck",
  title: "7.2 Vom neuen Wert zurück zum Grundwert",
  subtitle: "Durch den Änderungsfaktor teilen",
  whyItMatters:
    "Aus einem Bruttopreis oder einem Angebotspreis lässt sich der ursprüngliche Preis bestimmen. Den Prozentsatz einfach abzuziehen führt zum falschen Grundwert.",
  explanationHtml: `<p>Ist G<sub>neu</sub> nach einer prozentualen Änderung gegeben, teilst du durch den Änderungsfaktor. Nach 20 % Rabatt entspricht der neue Wert 80 % des alten, also gilt G = G<sub>neu</sub> : 0,8.</p><div class="example">Ein Angebot kostet nach 20 % Rabatt 72 €. Der alte Preis beträgt 72 : 0,8 = 90 €. Probe: 90 · 0,8 = 72. „72 € plus 20 %“ wäre 86,40 € und trifft nicht den ursprünglichen Preis.</div><p>Bei einem Bruttopreis von 119 € mit vorgegebenen 19 % Mehrwertsteuer ist der Nettopreis 119 : 1,19 = 100 €. Die Steuer beträgt 19 €, nicht 19 % vom Brutto.</p><div class="merke"><strong>Merke:</strong> Zurück zum Grundwert: durch 1 ± p/100 teilen. Nicht den Prozentsatz des neuen Werts addieren oder abziehen.</div>`,
  formulas: [
    {
      name: "Ursprünglicher Grundwert",
      html: "G = G<sub>neu</sub> : (1 ± p : 100)",
      quantities: "Faktor zur ursprünglichen Änderung wählen",
    },
  ],
  quiz: {
    question:
      "Nach 25 % Rabatt kostet etwas 60 €. Wie erhältst du den alten Preis?",
    options: ["60 : 0,75", "60 · 1,25", "60 : 0,25"],
    correctIndex: 0,
    explanation: "60 € entsprechen 75 %; zurück zu 100 % teilst du durch 0,75.",
  },
  lab: lab(
    "reverse-percent",
    "Rückwärts prüfen",
    "Stelle neuen Preis, Prozentsatz und Änderung ein. Die Grafik zeigt den gesuchten alten Wert und die Probe vorwärts.",
    [
      r("new", "Neuer Preis", 40, 160, 72, 4, "€"),
      r("p", "Prozentsatz", 5, 50, 20, 5, "%"),
      c("mode", "Vorherige Änderung", ["Rabatt", "Aufschlag"], 0),
    ],
    [
      o(
        "old",
        "Alter Grundwert",
        (v) => v.new / (1 + ((v.mode === 0 ? -1 : 1) * v.p) / 100),
        "€",
      ),
      o(
        "factor",
        "Änderungsfaktor",
        (v) => 1 + ((v.mode === 0 ? -1 : 1) * v.p) / 100,
      ),
    ],
    [
      {
        id: "rabatt",
        text: "Finde den alten Preis zu 60 € nach 25 % Rabatt.",
        check: (v) => v.new === 60 && v.p === 25 && v.mode === 0,
      },
      {
        id: "aufschlag",
        text: "Finde den alten Preis zu 120 € nach 20 % Aufschlag.",
        check: (v) => v.new === 120 && v.p === 20 && v.mode === 1,
      },
      {
        id: "haelfte",
        text: "Finde den alten Preis zu 80 € nach 50 % Rabatt.",
        check: (v) => v.new === 80 && v.p === 50 && v.mode === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "alter-preis",
      make: (rng, level) => {
        const old = rng.int(5, 20) * 20,
          p = rng.pick([10, 20, 25]),
          value = old * (1 - p / 100);
        return task(
          level,
          `Nach ${p} % Rabatt kostet ein Artikel ${fmt(value, 2)} €. Berechne den ursprünglichen Preis.`,
          `Ein Angebot kostet nach ${p} % Rabatt ${fmt(value, 2)} €. Bestimme den alten Preis und den in Euro eingesparten Betrag.`,
          [
            num("Alter Preis =", old, "€", 2, {
              slips: [
                {
                  value: value * (1 + p / 100),
                  hint: "Der Rabatt bezieht sich auf den alten Preis. Ein Aufschlag auf den neuen Preis führt nicht zurück; teile durch den verbleibenden Prozentfaktor.",
                },
              ],
            }),
            ...(level === 2 ? [num("Ersparnis =", old - value, "€", 2)] : []),
          ],
          "Der neue Preis entspricht (100 − p) % des alten.",
          `${fmt(value, 2)} : ${fmt(1 - p / 100)} = ${old}. Die Differenz ergibt die Ersparnis.`,
          `Alter Preis ${old} €; Ersparnis ${fmt(old - value, 2)} €.`,
          { old, p, value },
        );
      },
    },
    {
      id: "netto-aenderung",
      make: (rng, level) => {
        const net = rng.int(5, 25) * 10,
          tax = rng.pick([7, 19]),
          gross = net * (1 + tax / 100),
          p = rng.pick([10, 20]);
        return task(
          level,
          `Der Bruttopreis beträgt ${fmt(gross, 2)} €. Der vorgegebene Mehrwertsteuersatz ist ${tax} %. Berechne den Nettopreis.`,
          `Ein Bruttopreis von ${fmt(gross, 2)} € enthält laut Aufgabe ${tax} % Mehrwertsteuer. Bestimme Netto und den neuen Bruttopreis, wenn der Nettopreis um ${p} % steigt und der Steuersatz gleich bleibt.`,
          [
            num("Netto =", net, "€", 2),
            ...(level === 2
              ? [num("Neues Brutto =", gross * (1 + p / 100), "€", 2)]
              : []),
          ],
          "Netto = Brutto : (1 + Steuersatz : 100).",
          `Zuerst ${fmt(gross, 2)} : ${fmt(1 + tax / 100)}. ${level === 2 ? `Die Erhöhung um ${p} % bezieht sich auf den Nettopreis.` : ""}`,
          `Netto ${net} €${level === 2 ? `; neues Brutto ${fmt(gross * (1 + p / 100), 2)} €` : ""}.`,
          { net, tax, gross, p },
        );
      },
    },
  ],
});

const zinsen = L(3, {
  id: "pr-3-zinsrechnung",
  title: "7.3 Kapital, Zinssatz und Zinsen",
  subtitle: "Prozentrechnung für ein Jahr übertragen",
  whyItMatters:
    "Bei der Zinsrechnung sind die Rollen der Größen entscheidend. Kapital ist der Grundwert, Zinsen sind der Prozentwert.",
  explanationHtml: `<p>Das angelegte <strong>Kapital K</strong> entspricht dem Grundwert, der jährliche <strong>Zinssatz p %</strong> dem Prozentsatz und die <strong>Jahreszinsen Z</strong> dem Prozentwert. Für eine einfache Anlage über genau ein Jahr gilt Z = K · p : 100.</p><div class="example">K = 800 €, p = 2,5 % pro Jahr: Z = 800 · 2,5 : 100 = 20 €. Nach einem Jahr sind es 820 €, wenn die Zinsen gutgeschrieben werden und keine weiteren Zahlungen anfallen. Bei Z = 30 € und p = 3 % wäre K = 30 · 100 : 3 = 1000 €.</div><p>Umgekehrt berechnest du p = Z : K · 100 oder K = Z · 100 : p. Die Aufgaben dieser Lektion betrachten ein Jahr ohne Gebühren, Steuern oder Zinseszins.</p><div class="merke"><strong>Merke:</strong> K ↔ Grundwert, p % ↔ Prozentsatz, Z ↔ Prozentwert. Kapital und Endbetrag sind nicht dieselbe Größe.</div>`,
  formulas: [
    {
      name: "Jahreszinsen",
      html: "Z = K · p : 100",
      quantities: "K Kapital; p Zinssatz in Prozent; Dauer genau ein Jahr",
    },
    {
      name: "Umkehrungen",
      html: "p = 100Z : K; K = 100Z : p",
      quantities: "jeweils Nenner ungleich 0",
    },
  ],
  quiz: {
    question: "Welche Größe ist bei der Zinsrechnung der Grundwert?",
    options: ["Das Kapital K.", "Die Zinsen Z.", "Der Zinssatz p %."],
    correctIndex: 0,
    explanation:
      "Die Zinsen werden als Prozentanteil des angelegten Kapitals berechnet.",
  },
  lab: lab(
    "interest",
    "Ein Anlagejahr",
    "Ziehe Kapital oder Zinssatz. Vergleiche den Zinsbetrag und den Endbetrag nach genau einem Jahr.",
    [
      r("capital", "Kapital", 200, 2000, 800, 100, "€"),
      r("p", "Jahreszinssatz", 0.5, 5, 2, 0.5, "%"),
    ],
    [
      o("interest", "Jahreszinsen", (v) => (v.capital * v.p) / 100, "€"),
      o("end", "Endbetrag", (v) => v.capital * (1 + v.p / 100), "€"),
    ],
    [
      {
        id: "zwanzig",
        text: "Erzeuge 20 € Zinsen aus 800 € Kapital.",
        check: (v) => v.capital === 800 && v.p === 2.5,
      },
      {
        id: "dreissig",
        text: "Lege 1000 € zu 3 % für ein Jahr an.",
        check: (v) => v.capital === 1000 && v.p === 3,
      },
      {
        id: "verdoppeln",
        text: "Verdopple gegenüber 800 € zu 2 % das Kapital bei gleichem Zinssatz.",
        check: (v) => v.capital === 1600 && v.p === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "zinsen-endbetrag",
      make: (rng, level) => {
        const capital = rng.int(4, 30) * 100,
          p = rng.pick([1, 1.5, 2, 2.5, 3, 4]),
          z = (capital * p) / 100;
        return task(
          level,
          `${capital} € werden ein Jahr lang zu ${fmt(p)} % angelegt. Berechne die Jahreszinsen.`,
          `${capital} € werden ein Jahr zu ${fmt(p)} % angelegt. Berechne Zinsen und Endbetrag; es gibt keine Gebühren oder weiteren Zahlungen.`,
          [
            num("Zinsen =", z, "€", 2),
            ...(level === 2 ? [num("Endbetrag =", capital + z, "€", 2)] : []),
          ],
          "Z = K · p : 100 für genau ein Jahr.",
          `${capital} · ${fmt(p)} : 100 = ${fmt(z, 2)}. Der Endbetrag ist K + Z.`,
          `Z = ${fmt(z, 2)} €, Endbetrag ${fmt(capital + z, 2)} €.`,
          { capital, p, z },
        );
      },
    },
    {
      id: "kapital-zinssatz",
      make: (rng, level) => {
        const capital = rng.int(5, 20) * 100,
          p = rng.pick([1.5, 2, 2.5, 3, 4]),
          z = (capital * p) / 100;
        return task(
          level,
          `Ein Kapital bringt in einem Jahr ${fmt(z, 2)} € Zinsen bei ${fmt(p)} %. Bestimme das Kapital.`,
          `Eine Anlage von ${capital} € bringt nach einem Jahr ${fmt(z, 2)} € Zinsen. Bestimme den Zinssatz und entscheide, ob ${fmt(z, 2)} € das Kapital oder der Ertrag sind.`,
          [
            num(
              level === 1 ? "Kapital =" : "Zinssatz =",
              level === 1 ? capital : p,
              level === 1 ? "€" : "%",
              2,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Z ist …",
                    [
                      "der Ertrag des Jahres",
                      "das angelegte Kapital",
                      "der Endbetrag",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "K = Z · 100 : p.",
          level === 1
            ? `${fmt(z, 2)} · 100 : ${fmt(p)} = ${capital}.`
            : `${fmt(z, 2)} : ${capital} · 100 = ${fmt(p)}.`,
          `K = ${capital} €, p = ${fmt(p)} %, Z = ${fmt(z, 2)} €.`,
          { capital, p, z },
        );
      },
    },
  ],
});

const indirekt = L(4, {
  id: "pr-4-indirekt-proportional",
  title: "7.4 Indirekte Proportionalität",
  subtitle: "Produktgleichheit, Dreisatz und Hyperbelast",
  whyItMatters:
    "Mehr gleich leistungsfähige Helfer brauchen für dieselbe Arbeit weniger Zeit. Das ist ein anderer Zusammenhang als „doppelt so viel kostet doppelt so viel“.",
  explanationHtml: `<p>Bei einer indirekt proportionalen Zuordnung sind die Wertepaare <strong>produktgleich</strong>: x · y = k. Bei doppeltem x halbiert sich y, bei dreifachem x wird y gedrittelt. Für positive Größen gilt y = k : x; der Graph ist ein Hyperbelast, keine Gerade. x = 0 ist ausgeschlossen.</p><div class="example">4 gleich schnelle Pumpen brauchen für denselben Tank 6 h. Das Produkt ist 24 Pumpenstunden. Für 3 Pumpen: erst eine Pumpe → 24 h, dann 3 Pumpen → 24 : 3 = 8 h. Tabelle: (1|24), (2|12), (3|8), (4|6), (6|4).</div><p>Die Modellannahme ist wichtig: Alle Pumpen arbeiten gleich schnell und gleichzeitig; Tankgröße und Arbeitsmenge bleiben gleich. Bei Behinderungen oder unterschiedlicher Leistung ist das Modell nicht automatisch gültig.</p><div class="merke"><strong>Merke:</strong> Indirekt proportional: x · y konstant. Direkter Dreisatz vervielfacht gleichsinnig, indirekter Dreisatz gegensinnig.</div>`,
  formulas: [
    {
      name: "Produktgleichheit",
      html: "x · y = k; y = k : x",
      quantities: "x, y > 0; Hyperbelast",
    },
  ],
  quiz: {
    question:
      "x verdreifacht sich bei indirekter Proportionalität. Was passiert mit y?",
    options: [
      "y wird gedrittelt.",
      "y verdreifacht sich.",
      "y bleibt unverändert.",
    ],
    correctIndex: 0,
    explanation:
      "Das Produkt x · y bleibt konstant; dreimal so viel x erfordert ein Drittel von y.",
  },
  lab: lab(
    "inverse",
    "Produktgleichheit im Graphen",
    "Ziehe den Punkt auf dem Hyperbelast. Das Rechteck unter ihm hat immer denselben Flächeninhalt k; ändere anschließend k.",
    [
      r("k", "Konstantes Produkt", 12, 48, 24, 6),
      r("x", "Anzahl / x", 1, 12, 4),
    ],
    [
      o("y", "Zeit / y", (v) => v.k / v.x, "h"),
      o("product", "Produkt x · y", (v) => v.x * (v.k / v.x)),
    ],
    [
      {
        id: "drei",
        text: "Stelle bei k = 24 drei Pumpen und 8 Stunden ein.",
        check: (v) => v.k === 24 && v.x === 3,
      },
      {
        id: "sechs",
        text: "Verdopple von 3 auf 6 Pumpen bei k = 24 und beobachte die halbe Zeit.",
        check: (v) => v.k === 24 && v.x === 6,
      },
      {
        id: "anderes",
        text: "Stelle k = 36 und x = 9 ein: y = 4.",
        check: (v) => v.k === 36 && v.x === 9,
      },
    ],
  ),
  exercises: [
    {
      id: "produkt-tabelle",
      make: (rng, level) => {
        const k = rng.pick([24, 36, 48, 60, 72]),
          x = rng.pick([2, 3, 4, 6]),
          next = rng.pick([3, 4, 6, 8]);
        return task(
          level,
          `Bei einer indirekten Proportionalität gehört zu x = ${x} der Wert y = ${fmt(k / x)}. Bestimme das konstante Produkt und y für x = ${next}.`,
          `${x} gleich leistungsfähige Pumpen füllen einen Tank in ${fmt(k / x)} h. Wie lange brauchen ${next} Pumpen für denselben Tank? Gib auch die benötigte Zeit einer einzigen Pumpe an.`,
          level === 1
            ? [num("k =", k, "", 0), num("neues y =", k / next, "", 2)]
            : [num("Zeit =", k / next, "h", 2), num("eine Pumpe =", k, "h", 0)],
          "Zuerst x · y bilden, dann k durch den neuen x-Wert teilen.",
          `${x} · ${fmt(k / x)} = ${k}; ${k} : ${next} = ${fmt(k / next)}.`,
          `Produkt ${k}; neuer Wert ${fmt(k / next, 2)}.`,
          { k, x, next },
        );
      },
    },
    {
      id: "darstellungen",
      make: (rng, level) => {
        const k = rng.pick([12, 24, 36]),
          x = rng.pick([2, 3, 4]);
        return task(
          level,
          `Die Tabelle enthält (1|${k}), (2|${k / 2}), (3|${k / 3}). Bestimme die Zuordnung und y zu x = ${x}.`,
          `Ein Hyperbelast beschreibt y = ${k} : x für positive x. Bestimme y bei x = ${x} und beurteile, ob der Graph bei x = 0 einen endlichen Wert besitzt.`,
          [
            num("y =", k / x, "", 2),
            pick(
              level === 1 ? "Zuordnung" : "Wert bei x = 0?",
              level === 1
                ? [
                    "indirekt proportional, produktgleich",
                    "direkt proportional, quotientgleich",
                    "keine Proportionalität",
                  ]
                : ["nicht definiert", "y = 0", "y = k"],
              0,
            ),
          ],
          "Prüfe die Produkte der Tabellenpaare.",
          `1 · ${k} = 2 · ${k / 2} = 3 · ${k / 3} = ${k}. Die Regel y = k : x ist bei x = 0 nicht definiert.`,
          `y = ${fmt(k / x, 2)}; indirekt proportional.`,
          { k, x },
        );
      },
    },
  ],
});

const unterscheiden = L(5, {
  id: "pr-5-zuordnungen",
  title: "7.5 Direkt, indirekt oder nicht proportional?",
  subtitle: "Quotienten, Produkte und den Sachverhalt prüfen",
  whyItMatters:
    "Ein fallender Graph allein beweist keine indirekte Proportionalität. Ein steigender Graph allein beweist keine direkte Proportionalität.",
  explanationHtml: `<p><strong>Direkt proportional:</strong> y : x ist für x ≠ 0 konstant; der Graph ist eine Gerade durch den Ursprung. <strong>Indirekt proportional:</strong> x · y ist konstant; bei positiven Größen entsteht ein Hyperbelast. Trifft beides nicht zu, ist die Zuordnung nicht proportional.</p><div class="example">3 € je Heft: y = 3x, direkt proportional. 24 € werden gleich auf x Personen verteilt: y = 24 : x, indirekt proportional. Taxipreis 4 € Grundpreis + 3 € je Kilometer: y = 4 + 3x, nicht proportional, denn bei doppelter Strecke verdoppelt sich der Gesamtpreis nicht.</div><p>Prüfe mehrere Wertepaare und die Modellannahmen. „Mehr Personen, weniger Zeit“ ist nur dann indirekt proportional, wenn die Arbeitsmenge gleich bleibt und sich die Leistung entsprechend verteilt. Ein einziges Wertepaar reicht zum Erkennen nicht.</p><div class="merke"><strong>Merke:</strong> Quotient konstant → direkt. Produkt konstant → indirekt. Sonst weder noch; prüfe den Kontext.</div>`,
  formulas: [
    {
      name: "Unterscheiden",
      html: "y : x = k → direkt; x · y = k → indirekt",
      quantities: "gleiche Regel für alle zulässigen Wertepaare",
    },
  ],
  quiz: {
    question: "Warum ist y = 4 + 3x nicht direkt proportional?",
    options: [
      "Der Grundpreis 4 verhindert den konstanten Quotienten.",
      "Weil der Graph steigt.",
      "Weil x eine Anzahl ist.",
    ],
    correctIndex: 0,
    explanation:
      "y : x = 4 : x + 3 ist nicht konstant; die Gerade geht nicht durch den Ursprung.",
  },
  lab: lab(
    "proportion-compare",
    "Drei Modelle vergleichen",
    "Wähle ein Modell und ziehe den Punkt. Vergleiche Quotient und Produkt bei verschiedenen x.",
    [
      c("mode", "Modell", ["y = 3x", "y = 24 : x", "y = 4 + 3x"], 0),
      r("x", "x", 1, 8, 2),
    ],
    [
      o("y", "y", (v) =>
        v.mode === 0 ? 3 * v.x : v.mode === 1 ? 24 / v.x : 4 + 3 * v.x,
      ),
      o(
        "quotient",
        "y : x",
        (v) =>
          (v.mode === 0 ? 3 * v.x : v.mode === 1 ? 24 / v.x : 4 + 3 * v.x) /
          v.x,
      ),
      o(
        "product",
        "x · y",
        (v) =>
          v.x *
          (v.mode === 0 ? 3 * v.x : v.mode === 1 ? 24 / v.x : 4 + 3 * v.x),
      ),
    ],
    [
      {
        id: "direkt",
        text: "Zeige beim direkten Modell x = 4 und den Quotienten 3.",
        check: (v) => v.mode === 0 && v.x === 4,
      },
      {
        id: "indirekt",
        text: "Zeige beim indirekten Modell x = 6 und das Produkt 24.",
        check: (v) => v.mode === 1 && v.x === 6,
      },
      {
        id: "weder",
        text: "Zeige beim Grundpreismodell x = 3. Es ist nicht proportional.",
        check: (v) => v.mode === 2 && v.x === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "tabelle-erkennen",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          k = rng.int(2, 5),
          x = rng.int(3, 6),
          f = (n: number) =>
            mode === 0 ? k * n : mode === 1 ? (12 * k) / n : k * n + 4;
        return task(
          level,
          `Eine Tabelle enthält (1|${fmt(f(1))}), (2|${fmt(f(2))}), (3|${fmt(f(3))}). Ordne zu: direkt, indirekt oder nicht proportional.`,
          `Eine Tabelle enthält (1|${fmt(f(1))}), (2|${fmt(f(2))}), (3|${fmt(f(3))}). Prüfe Quotienten und Produkte, benenne die Zuordnung und berechne mit der fortgesetzten Regel y bei x = ${x}.`,
          [
            pick(
              "Zuordnung",
              [
                "direkt proportional",
                "indirekt proportional",
                "nicht proportional",
              ],
              mode,
            ),
            ...(level === 2 ? [num("y =", f(x), "", 2)] : []),
          ],
          "Vergleiche y : x und x · y für alle gegebenen Paare.",
          mode === 0
            ? `Alle Quotienten sind ${k}.`
            : mode === 1
              ? `Alle Produkte sind ${12 * k}.`
              : "Weder die Quotienten noch die Produkte sind gleich; die Werte folgen einer Regel mit Grundbetrag 4.",
          `${["direkt", "indirekt", "nicht"][mode]} proportional${level === 2 ? `; y = ${fmt(f(x), 2)}` : ""}.`,
          { mode, k, x },
        );
      },
    },
    {
      id: "sachverhalt",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          x = rng.int(2, 6),
          contexts = [
            "Jedes Heft kostet 3 € ohne Grundgebühr.",
            "24 € werden gleich auf mehrere Personen verteilt.",
            "Eine Fahrt kostet 4 € Grundgebühr und 3 € je Kilometer.",
          ],
          y = mode === 0 ? 3 * x : mode === 1 ? 24 / x : 4 + 3 * x;
        return task(
          level,
          `Ordne den Sachverhalt ein: ${contexts[mode]}`,
          `${contexts[mode]} Ordne den Zusammenhang ein und berechne den zugehörigen Wert bei ${x} ${mode === 0 ? "Heften" : mode === 1 ? "Personen" : "Kilometern"}.`,
          [
            pick(
              "Zuordnung",
              [
                "direkt proportional",
                "indirekt proportional",
                "nicht proportional",
              ],
              mode,
            ),
            ...(level === 2
              ? [num(mode === 1 ? "je Person =" : "Preis =", y, "€", 2)]
              : []),
          ],
          "Prüfe Verdoppeln: verdoppelt, halbiert oder keines von beidem?",
          [
            "Doppelte Heftzahl bedeutet doppelten Preis.",
            "Doppelte Personenzahl halbiert den Anteil bei gleichem Gesamtbetrag.",
            "Der feste Grundpreis wird nicht mit der Strecke verdoppelt.",
          ][mode],
          `${["Direkt proportional", "Indirekt proportional", "Nicht proportional"][mode]}${level === 2 ? `; ${fmt(y, 2)} €` : ""}.`,
          { mode, x, y },
        );
      },
    },
  ],
});
export const STAGE_PROPORTIONEN = makeStage(
  7,
  "Proportionalitäten",
  "Prozentrechnung, Zinsen und produktgleiche Zuordnungen",
  "#ca8a04",
  "⇄",
  [7, 5],
  [prozent, rueckwaerts, zinsen, indirekt, unterscheiden],
);
