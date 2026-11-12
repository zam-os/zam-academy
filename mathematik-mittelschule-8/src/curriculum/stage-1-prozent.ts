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
import { fmt, frac } from "../exercises/format";

const LB: [number | null, number] = [1, 1];

export const STAGE_PROZENT = makeStage(
  1,
  "Prozentrechnung im Alltag & Beruf",
  "Rabatt, Skonto, Umsatzsteuer, Brutto/Netto/Tara, Kalkulation, Schaubilder und Promille sicher anwenden",
  "#2563eb",
  "🛍️",
  LB,
  [
    // 1.1 Rabatt & Preisänderung (R + M)
    makeLesson(1, 1, LB, {
      id: "pr-1-rabatt-preisaenderung",
      title: "Rabatt, Preiserhöhung & Preissenkung",
      subtitle: "Verminderter und vermehrter Grundwert im Alltag",
      tracks: BOTH,
      whyItMatters:
        "Im Ausverkauf sinken Preise um einen Rabatt, bei Lohn- oder Materialkosten steigen sie um einen Aufschlag — genau dann rechnest du mit dem neuen Prozentsatz.",
      explanationHtml: `
        <p>Bei einer <strong>Preissenkung (Rabatt)</strong> ziehst du den Prozentanteil von 100 % ab; bei einer <strong>Preiserhöhung</strong> zählst du ihn zu 100 % hinzu.</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Fahrrad kostet 400 €. Nach 15 % Rabatt bleiben 85 % übrig:<br>
          G<sub>neu</sub> = 400 € · 0,85 = <strong>340 €</strong> (oder 15 % = 60 €, 400 € − 60 € = 340 €).
        </div>
        <div class="merke">
          <strong>Merke:</strong> Rabatt/Senkung: neuer Anteil = (100 − p) %. Erhöhung: neuer Anteil = (100 + p) %. Zwei Änderungen nacheinander berechnet man <em>schrittweise</em> auf den jeweils aktuellen Wert, niemals durch einfaches Addieren der Prozentsätze!
        </div>
      `,
      formulas: [
        {
          name: "Preissenkung / Rabatt",
          html: `G<sub>neu</sub> = G · ${frac("100 − p", 100)}`,
          quantities: "G Ausgangspreis, p Senkung in %",
        },
        {
          name: "Preiserhöhung",
          html: `G<sub>neu</sub> = G · ${frac("100 + p", 100)}`,
          quantities: "G Ausgangspreis, p Erhöhung in %",
        },
      ],
      quiz: {
        question:
          "Eine Jacke für 100 € wird erst um 20 % teurer und danach wieder um 20 % reduziert. Wie hoch ist der Endpreis?",
        options: ["96 €", "100 €", "104 €"],
        correctIndex: 0,
        explanation:
          "Erst 100 € · 1,20 = 120 €, danach sinkt der neue Preis um 20 %: 120 € · 0,80 = 96 €.",
      },
      lab: lab(
        "discount-chain",
        "Preisänderungen schrittweise verfolgen",
        "Verändere Ausgangspreis und zwei aufeinanderfolgende Prozentänderungen und beobachte den neuen Gesamtwert.",
        [
          range("start", "Startpreis G", 50, 300, 100, 25, "€"),
          range("p1", "1. Änderung p₁", -50, 50, -20, 5, "%"),
          range("p2", "2. Änderung p₂", -50, 50, 10, 5, "%"),
        ],
        [
          output("mid", "Nach Schritt 1", (v) => v.start * (1 + v.p1 / 100), "€", 2),
          output(
            "end",
            "Endpreis",
            (v) => v.start * (1 + v.p1 / 100) * (1 + v.p2 / 100),
            "€",
            2,
            true,
          ),
          output(
            "netPct",
            "Gesamtänderung",
            (v) => ((1 + v.p1 / 100) * (1 + v.p2 / 100) - 1) * 100,
            "%",
            1,
          ),
        ],
        [
          {
            id: "plus20-minus20",
            text: "Zeige an G = 100 €: erst +20 %, dann −20 % ergibt 96 €.",
            check: (v, r) =>
              v.start === 100 && v.p1 === 20 && v.p2 === -20 && near(Number(r.end), 96, 0.01),
          },
          {
            id: "double-10",
            text: "Stelle zweimal hintereinander −10 % auf 200 € ein (Endpreis 162 €).",
            check: (v, r) =>
              v.start === 200 && v.p1 === -10 && v.p2 === -10 && near(Number(r.end), 162, 0.01),
          },
          {
            id: "reach-150",
            text: "Steigere G = 100 € in zwei Schritten auf genau 150 € (z. B. +25 % und +20 %).",
            check: (v, r) => v.start === 100 && near(Number(r.end), 150, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "single-discount-rise",
          make(rng, level) {
            const g = rng.pick([80, 120, 150, 200, 240, 320, 450]);
            const p = rng.pick([10, 15, 20, 25, 30]);
            const isRise = rng.int(0, 1) === 1;
            const gNew = isRise ? g * (1 + p / 100) : g * (1 - p / 100);
            return task(
              level,
              isRise
                ? `Ein Artikel kostet ${g} € und wird um ${p} % teurer. Berechne den neuen Preis.`
                : `Ein Artikel kostet ${g} € und erhält ${p} % Rabatt. Berechne den neuen Preis.`,
              isRise
                ? `Ein Handwerksbetrieb erhöht seinen Stundensatz von ${g} € wegen gestiegener Materialpreise um ${p} %. Welcher Preis steht nun auf der Rechnung?`
                : `Im Räumungsverkauf gibt es auf ein E-Skateboard zum Listenpreis von ${g} € genau ${p} % Preisnachlass. Wie viel Euro zahlst du an der Kasse?`,
              [
                numberField("Neuer Preis =", gNew, "€", 2, {
                  slips: [
                    {
                      value: (g * p) / 100,
                      hint: "Das ist nur der Änderungsbetrag — zähle ihn vom Ausgangspreis ab bzw. dazu!",
                    },
                  ],
                }),
              ],
              isRise ? "G_neu = G · (100 + p)/100" : "G_neu = G · (100 − p)/100",
              [
                `Faktor: ${isRise ? fmt(1 + p / 100, 2) : fmt(1 - p / 100, 2)}`,
                `${g} € · ${isRise ? fmt(1 + p / 100, 2) : fmt(1 - p / 100, 2)} = <strong>${fmt(gNew, 2)} €</strong>`,
              ],
              { g, p, gNew },
            );
          },
        },
        {
          id: "chained-discount-reverse",
          make(rng, level) {
            const start = rng.pick([100, 200, 300, 400, 500]);
            const p1 = rng.pick([10, 20, 25]);
            const p2 = rng.pick([10, 15, 20]);
            const end = start * (1 - p1 / 100) * (1 + p2 / 100);
            return task(
              level,
              `Ein Preis von ${start} € sinkt erst um ${p1} % und steigt danach um ${p2} %. Berechne den Endpreis.`,
              `Ein Mountainbike kostet regulär ${start} €. Im Herbst wird der Preis um ${p1} % gesenkt, im Frühjahr auf diesen neuen Preis um ${p2} % erhöht. Welchen Endpreis verlangt der Händler?`,
              [
                numberField("Endpreis =", end, "€", 2, {
                  slips: [
                    {
                      value: start * (1 + (p2 - p1) / 100),
                      hint: "Die zweite Änderung bezieht sich auf den bereits reduzierten Preis, nicht auf den Startpreis!",
                    },
                  ],
                }),
              ],
              "Beide Schritte getrennt nacheinander anwenden.",
              [
                `Nach −${p1} %: ${fmt(start * (1 - p1 / 100), 2)} €`,
                `Danach +${p2} %: <strong>${fmt(end, 2)} €</strong>`,
              ],
              { start, p1, p2, end },
            );
          },
        },
      ],
    }),

    // 1.2 Skonto & Umsatzsteuer (R + M)
    makeLesson(1, 2, LB, {
      id: "pr-2-skonto-umsatzsteuer",
      title: "Skonto & Umsatzsteuer (USt)",
      subtitle: "Rechnungsbeträge, Barzahlungsabzug und 19 % / 7 % Mehrwertsteuer",
      tracks: BOTH,
      whyItMatters:
        "Auf fast jeder Handwerker- oder Lieferantenrechnung begegnen dir 19 % (bzw. 7 %) Umsatzsteuer sowie Skonto bei schneller Bezahlung.",
      explanationHtml: `
        <p><strong>Skonto</strong> ist ein Preisnachlass (oft 2 % oder 3 %) bei sofortiger Bezahlung des Rechnungsbetrags. Die <strong>Umsatzsteuer</strong> (USt, in Deutschland regulär 19 %, ermäßigt 7 %) wird auf den Nettopreis aufgeschlagen.</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Regal kostet 200 € netto + 19 % USt = 238 € brutto.<br>
          Bei 3 % Skonto zahlt der Kunde nur 97 % von 238 €:<br>
          238 € · 0,97 = <strong>230,86 €</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Vom Netto- zum Bruttopreis rechnet man mal 1,19 (oder 1,07). Willst du umgekehrt aus dem Bruttopreis den Nettopreis berechnen, entsprichen brutto 119 % — teile durch 1,19!
        </div>
      `,
      formulas: [
        {
          name: "Bruttopreis mit USt",
          html: "Brutto = Netto · (1 + p<sub>USt</sub>/100)",
          quantities: "p_USt meistens 19 % (Faktor 1,19) oder 7 % (Faktor 1,07)",
        },
        {
          name: "Skonto abziehen",
          html: "Überweisungsbetrag = Rechnungsbetrag · (1 − p<sub>Skonto</sub>/100)",
          quantities: "p_Skonto typisch 2 % oder 3 %",
        },
      ],
      quiz: {
        question:
          "Eine Werkstattrechnung lautet auf 119 € brutto (inkl. 19 % USt). Wie hoch ist der Nettobetrag?",
        options: ["100 €", "96,39 €", "110 €"],
        correctIndex: 0,
        explanation:
          "Der Bruttopreis entspricht 119 % des Nettopreises. Netto = 119 € : 1,19 = 100 € (nicht 19 % von 119 € abziehen!).",
      },
      lab: lab(
        "discount-chain",
        "Umsatzsteuer & Skonto kombiniert",
        "Nutze Schritt 1 für die Umsatzsteuer (+7 % oder +19 %) und Schritt 2 für einen Abzug wie Skonto.",
        [
          range("start", "Nettobetrag", 50, 400, 100, 50, "€"),
          range("p1", "1. USt / Rabatt (%)", -50, 50, 15, 5, "%"),
          range("p2", "2. Skonto / Änderung (%)", -50, 50, -5, 5, "%"),
        ],
        [
          output("mid", "Nach Schritt 1", (v) => v.start * (1 + v.p1 / 100), "€", 2),
          output(
            "end",
            "Endbetrag",
            (v) => v.start * (1 + v.p1 / 100) * (1 + v.p2 / 100),
            "€",
            2,
            true,
          ),
          output(
            "netPct",
            "Gesamtveränderung",
            (v) => ((1 + v.p1 / 100) * (1 + v.p2 / 100) - 1) * 100,
            "%",
            1,
          ),
        ],
        [
          {
            id: "plus20-minus10",
            text: "Starte bei 200 € netto, +20 % Aufschlag und −10 % Skonto → 216 €.",
            check: (v, r) =>
              v.start === 200 && v.p1 === 20 && v.p2 === -10 && near(Number(r.end), 216, 0.01),
          },
          {
            id: "rebate-20-skonto-5",
            text: "Gib auf 300 € erst −20 % Rabatt und dann −5 % Skonto (228 €).",
            check: (v, r) =>
              v.start === 300 && v.p1 === -20 && v.p2 === -5 && near(Number(r.end), 228, 0.01),
          },
          {
            id: "exact-190",
            text: "Erreiche genau 190 € ausgehend von 200 € netto.",
            check: (v, r) => v.start === 200 && near(Number(r.end), 190, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "skonto-calc",
          make(rng, level) {
            const invoice = rng.pick([200, 350, 400, 600, 850, 1200]);
            const skonto = rng.pick([2, 3]);
            const pay = invoice * (1 - skonto / 100);
            return task(
              level,
              `Auf einer Rechnung über ${invoice} € werden bei schneller Zahlung ${skonto} % Skonto gewährt. Wie viel wird überwiesen?`,
              `Ein Tischlereibetrieb erhält eine Holzlieferung über ${invoice} € und begleicht sie innerhalb von 7 Tagen mit ${skonto} % Skontoabzug. Berechne den Überweisungsbetrag.`,
              [
                numberField("Überweisungsbetrag =", pay, "€", 2, {
                  slips: [
                    {
                      value: (invoice * skonto) / 100,
                      hint: "Das ist nur der Skontobetrag — ziehe ihn noch von der Rechnungssumme ab.",
                    },
                  ],
                }),
              ],
              "Überweisung = Rechnung · (100 − Skonto)/100",
              [
                `Skonto (${skonto} %): ${fmt((invoice * skonto) / 100, 2)} €`,
                `${invoice} € − ${fmt((invoice * skonto) / 100, 2)} € = <strong>${fmt(pay, 2)} €</strong>`,
              ],
              { invoice, skonto, pay },
            );
          },
        },
        {
          id: "ust-reverse-net",
          make(rng, level) {
            const net = rng.pick([100, 200, 250, 300, 400, 500]);
            const rate = rng.pick([19, 7]);
            const brutto = Number((net * (1 + rate / 100)).toFixed(2));
            return task(
              level,
              `Eine Maschine kostet brutto ${fmt(brutto, 2)} € (inkl. ${rate} % USt). Berechne den Nettopreis.`,
              `Auf dem Kassenbon einer Büromaschine steht ein Endbetrag (brutto) von ${fmt(brutto, 2)} € einschließlich ${rate} % Umsatzsteuer. Welchen Nettobetrag setzt das Geschäft ohne Steuer an?`,
              [
                numberField("Nettopreis =", net, "€", 2, {
                  slips: [
                    {
                      value: Number((brutto * (1 - rate / 100)).toFixed(2)),
                      hint: `Vorsicht: Der Bruttopreis sind ${100 + rate} %, nicht 100 %! Teile durch ${fmt(1 + rate / 100, 2)}.`,
                    },
                  ],
                }),
              ],
              `Brutto = ${100 + rate} % → Netto = Brutto : ${fmt(1 + rate / 100, 2)}`,
              [
                `1 % = ${fmt(brutto, 2)} : ${100 + rate} = ${fmt(brutto / (100 + rate), 2)} €`,
                `100 % (Netto) = <strong>${fmt(net, 2)} €</strong>`,
              ],
              { net, rate, brutto },
            );
          },
        },
      ],
    }),

    // 1.3 Brutto, Netto, Tara (R + M)
    makeLesson(1, 3, LB, {
      id: "pr-3-brutto-netto-tara",
      title: "Bruttogewicht, Nettogewicht & Tara",
      subtitle: "Gesamtgewicht, reiner Inhalt und Verpackungsgewicht unterscheiden",
      tracks: BOTH,
      whyItMatters:
        "Auf Konserven, LKW-Waagen und Versandkartons musst du reines Füllgewicht vom Gewicht der Verpackung trennen können.",
      explanationHtml: `
        <p>Bei verpackten Waren unterscheidet man drei Größen:</p>
        <div class="example">
          <strong>Beispiel:</strong> Eine volle Obstkiste wiegt zusammen (Brutto) 25 kg. Die leere Kiste (Tara) wiegt 2 kg.<br>
          Reines Obstgewicht (Netto) = 25 kg − 2 kg = <strong>23 kg</strong>.<br>
          Tara-Anteil vom Brutto = 2 : 25 = 0,08 = <strong>8 %</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>Brutto = Netto + Tara</strong> (Gesamt = Inhalt + Verpackung). Prozentsätze bei Verpackung beziehen sich meist auf das Brutto (100 %), manchmal auf das Netto — genau hinschauen!
        </div>
      `,
      formulas: [
        {
          name: "Gewichtsgleichung",
          html: "Bruttogewicht = Nettogewicht + Tara",
          quantities: "Brutto Gesamtgewicht, Netto reiner Inhalt, Tara Verpackung",
        },
        {
          name: "Tara-Anteil am Brutto",
          html: `p<sub>Tara</sub> = ${frac("Tara", "Brutto")} · 100 %`,
          quantities: "Verpackungsanteil bezogen auf das Gesamtgewicht",
        },
      ],
      quiz: {
        question: "Eine Konservendose wiegt ungeöffnet 850 g; auf dem Etikett steht Füllmenge (Netto) 800 g. Was bedeutet Tara?",
        options: [
          "Das Gewicht der leeren Blechdose (50 g)",
          "Das Gesamtgewicht mit Deckel (850 g)",
          "Das Gewicht ohne Flüssigkeit",
        ],
        correctIndex: 0,
        explanation:
          "Tara bezeichnet immer das Gewicht der Verpackung selbst: 850 g − 800 g = 50 g.",
      },
      lab: lab(
        "brutto-netto-tara",
        "Verpackung & Inhalt trennen",
        "Verändere Nettogewicht und Tara (Verpackungsanteil) und lies Gesamtgewicht sowie prozentualen Anteil ab.",
        [
          choice("mode", "Ansicht", ["Gewicht (kg)", "Preis mit USt (€)"], 0),
          range("netto", "Nettogewicht / Nettopreis", 10, 100, 40, 5),
          range("tara", "Tara / Steuerbetrag", 2, 40, 10, 2),
        ],
        [
          output("brutto", "Brutto gesamt", (v) => v.netto + v.tara, "", 1, true),
          output("taraPct", "Tara-/Steuer-Anteil am Brutto", (v) => (v.tara / (v.netto + v.tara)) * 100, "%", 1),
        ],
        [
          {
            id: "brutto-50",
            text: "Stelle in der Gewichtsansicht Netto = 45 kg und Brutto = 55 kg ein.",
            check: (v, r) => v.mode === 0 && v.netto === 45 && near(Number(r.brutto), 55, 0.01),
          },
          {
            id: "tara-20pct",
            text: "Erreiche genau 20 % Tara vom Bruttogewicht (bei Brutto = 100 kg).",
            check: (v, r) =>
              v.mode === 0 && near(Number(r.brutto), 100, 0.01) && near(Number(r.taraPct), 20, 0.01),
          },
          {
            id: "price-mode",
            text: "Wechsle in die Preisansicht mit Netto = 80 € und Brutto = 96 €.",
            check: (v, r) => v.mode === 1 && v.netto === 80 && near(Number(r.brutto), 96, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "tara-percent",
          make(rng, level) {
            const brutto = rng.pick([40, 50, 60, 80, 100]);
            const pct = rng.pick([5, 10, 15, 20]);
            const tara = (brutto * pct) / 100;
            const netto = brutto - tara;
            return task(
              level,
              `Eine Lieferung wiegt brutto ${brutto} kg; die Verpackung (Tara) beträgt ${pct} % vom Bruttogewicht. Berechne das Nettogewicht.`,
              `Ein Paket Kaffeebohnen hat ein Versandgewicht (Brutto) von ${brutto} kg. Davon entfallen ${pct} % auf die Palette und Umkartons. Wie viel Kilogramm Kaffee (Netto) befinden sich in der Lieferung?`,
              [
                numberField("Nettogewicht =", netto, "kg", 1, {
                  slips: [
                    {
                      value: tara,
                      hint: "Das ist das Gewicht der Verpackung (Tara), gesucht ist der reine Inhalt (Netto)!",
                    },
                  ],
                }),
              ],
              "Tara = Brutto · p/100 → Netto = Brutto − Tara",
              [
                `Tara = ${brutto} kg · ${fmt(pct / 100, 2)} = ${fmt(tara, 1)} kg`,
                `Netto = ${brutto} − ${fmt(tara, 1)} = <strong>${fmt(netto, 1)} kg</strong>`,
              ],
              { brutto, pct, netto },
            );
          },
        },
        {
          id: "find-tara-pct",
          make(rng, level) {
            const brutto = rng.pick([20, 25, 40, 50, 80]);
            const pct = rng.pick([8, 10, 12, 16, 20]);
            const tara = (brutto * pct) / 100;
            const netto = brutto - tara;
            return task(
              level,
              `Ein Fass wiegt gefüllt (brutto) ${brutto} kg und leer (Tara) ${fmt(tara, 1)} kg. Wie viel Prozent des Bruttogewichts ist die Tara?`,
              `Eine gefüllte Kiste Gemüse (Brutto ${brutto} kg) enthält genau ${fmt(netto, 1)} kg Gemüse (Netto). Wie groß ist der Anteil der Verpackung (Tara) am Bruttogewicht in Prozent?`,
              [numberField("Tara-Anteil =", pct, "%", 1)],
              "p_Tara = (Tara : Brutto) · 100 %",
              [
                `Tara = ${brutto} − ${fmt(netto, 1)} = ${fmt(tara, 1)} kg`,
                `(${fmt(tara, 1)} : ${brutto}) · 100 % = <strong>${fmt(pct, 1)} %</strong>`,
              ],
              { brutto, tara, netto, pct },
            );
          },
        },
      ],
    }),

    // 1.4 Wachstumsfaktor q & Verkettung (M-only)
    makeLesson(1, 4, LB, {
      id: "pr-4-wachstumsfaktor",
      title: "Wachstumsfaktor q & Verkettung",
      subtitle: "Mit Faktoren schnell rechnen und mehrfache Prozentänderungen verketten",
      tracks: ["M"],
      whyItMatters:
        "Im M-Zug verkürzt der Wachstumsfaktor q mehrstufige Preisänderungen zu einer einzigen Multiplikation — und erlaubt dir die sofortige Umkehrrechnung.",
      explanationHtml: `
        <p>Statt erst den Prozentwert zu berechnen und zu addieren/subtrahieren, multipliziert man direkt mit dem <strong>Wachstumsfaktor q</strong> (auch Abnahmefaktor):</p>
        <div class="example">
          <strong>Beispiel:</strong> Auf einen Preis von 250 € gibt es erst 10 % Aufschlag (q₁ = 1,10) und dann 20 % Rabatt (q₂ = 0,80):<br>
          Gesamtfaktor: q<sub>ges</sub> = 1,10 · 0,80 = <strong>0,88</strong> (entspricht −12 %!).<br>
          Endpreis: 250 € · 0,88 = <strong>220 €</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Erhöhung um p % → <strong>q = 1 + p/100</strong>. Senkung um p % → <strong>q = 1 − p/100</strong>. Bei mehreren Schritten werden die Faktoren <em>multipliziert</em>: G<sub>neu</sub> = G · q₁ · q₂ · …
        </div>
      `,
      formulas: [
        {
          name: "Wachstums-/Abnahmefaktor q",
          html: "q = 1 ± p/100",
          quantities: "+p % für Erhöhung, −p % für Senkung",
        },
        {
          name: "Verkettete Änderung",
          html: "G<sub>neu</sub> = G · q₁ · q₂",
          quantities: "q_ges = q₁ · q₂ gibt die gesamte prozentuale Veränderung an",
        },
      ],
      quiz: {
        question: "Welcher Gesamtfaktor q gehört zu erst +25 % Aufschlag und dann −20 % Rabatt?",
        options: ["q = 1,00 (genau Ausgangspreis)", "q = 1,05 (+5 %)", "q = 0,95 (−5 %)"],
        correctIndex: 0,
        explanation: "1,25 · 0,80 = 1,00 — der Preis landet genau wieder bei 100 %!",
      },
      lab: lab(
        "discount-chain",
        "Wachstumsfaktoren verketten",
        "Beobachte den Gesamtfaktor q = q₁ · q₂ oben rechts im Kasten.",
        [
          range("start", "Startwert G", 100, 400, 100, 50, "€"),
          range("p1", "1. Schritt (%)", -50, 50, 10, 5, "%"),
          range("p2", "2. Schritt (%)", -50, 50, 10, 5, "%"),
        ],
        [
          output("mid", "Zwischenwert", (v) => v.start * (1 + v.p1 / 100), "€", 2),
          output("end", "Endwert", (v) => v.start * (1 + v.p1 / 100) * (1 + v.p2 / 100), "€", 2, true),
          output("netPct", "Gesamtänderung", (v) => ((1 + v.p1 / 100) * (1 + v.p2 / 100) - 1) * 100, "%", 1),
        ],
        [
          {
            id: "back-to-100",
            text: "Kombiniere +25 % und −20 % so, dass der Gesamtfaktor q = 1,00 entsteht.",
            check: (v, r) => v.start === 100 && v.p1 === 25 && v.p2 === -20 && near(Number(r.end), 100, 0.01),
          },
          {
            id: "factor-132",
            text: "Erreiche mit +10 % und +20 % bei Start 100 € den Gesamtfaktor 1,32 (132 €).",
            check: (v, r) => v.start === 100 && near(Number(r.end), 132, 0.01),
          },
          {
            id: "reverse-start-200",
            text: "Zeige bei Start 200 € eine Abnahme um insgesamt 28 % (z. B. −20 % und −10 % → 144 €).",
            check: (v, r) => v.start === 200 && near(Number(r.netPct), -28, 0.1),
          },
        ],
      ),
      exercises: [
        {
          id: "chained-factor-q",
          make(rng, level) {
            const p1 = rng.pick([10, 20, 25, 30]);
            const p2 = rng.pick([-10, -20, -25]);
            const qGes = Number(((1 + p1 / 100) * (1 + p2 / 100)).toFixed(4));
            const start = rng.pick([200, 400, 500]);
            const end = Number((start * qGes).toFixed(2));
            return task(
              level,
              `Berechne den Gesamtfaktor q für erst +${p1} % und danach ${fmt(p2)} % sowie den Endwert von ${start} €.`,
              `Ein Großhändler erhöht seinen Einkaufspreis von ${start} € wegen Transportkosten um ${p1} % und gibt dann Stammkunden ${Math.abs(p2)} % Treuerabatt. Berechne Gesamtfaktor q und Endpreis.`,
              [
                numberField("Gesamtfaktor q =", qGes, "", 4),
                numberField("Endpreis =", end, "€", 2),
              ],
              "q_ges = (1 + p₁/100) · (1 + p₂/100)",
              [
                `q₁ = ${fmt(1 + p1 / 100, 2)}, q₂ = ${fmt(1 + p2 / 100, 2)} → q = <strong>${fmt(qGes, 4)}</strong>`,
                `Endpreis = ${start} € · ${fmt(qGes, 4)} = <strong>${fmt(end, 2)} €</strong>`,
              ],
              { p1, p2, qGes, end },
            );
          },
        },
        {
          id: "reverse-with-q",
          make(rng, level) {
            const orig = rng.pick([120, 150, 200, 250, 300]);
            const rabatt = rng.pick([15, 20, 25]);
            const skonto = rng.pick([2, 5]);
            const paid = Number((orig * (1 - rabatt / 100) * (1 - skonto / 100)).toFixed(2));
            return task(
              level,
              `Nach ${rabatt} % Rabatt und anschließend ${skonto} % Skonto kostet ein Gerät ${fmt(paid, 2)} €. Wie hoch war der ursprüngliche Preis?`,
              `Ein Betrieb bezahlt nach Abzug von ${rabatt} % Sonderrabatt und weiteren ${skonto} % Skonto genau ${fmt(paid, 2)} €. Berechne den ursprünglichen Listenpreis mithilfe des Faktors q.`,
              [numberField("Ursprünglicher Preis =", orig, "€", 2)],
              "Teile den Endbetrag durch das Produkt q₁ · q₂.",
              [
                `q_ges = ${fmt(1 - rabatt / 100, 2)} · ${fmt(1 - skonto / 100, 2)} = ${fmt((1 - rabatt / 100) * (1 - skonto / 100), 4)}`,
                `Listenpreis = ${fmt(paid, 2)} : ${fmt((1 - rabatt / 100) * (1 - skonto / 100), 4)} = <strong>${fmt(orig, 2)} €</strong>`,
              ],
              { orig, paid },
            );
          },
        },
      ],
    }),

    // 1.5 Verkaufspreiskalkulation (R einfach, M voll)
    makeLesson(1, 5, LB, {
      id: "pr-5-kalkulation-verkaufspreis",
      title: "Verkaufspreise kalkulieren",
      subtitle: "Vom Netto- zum Bruttopreis (R8) und volle Handelskalkulation (M8)",
      tracks: BOTH,
      whyItMatters:
        "Geschäfte können Waren nicht zum Einkaufspreis weitergeben — Miete, Löhne, Gewinn und Umsatzsteuer müssen sauber schrittweise aufgerechnet werden.",
      explanationHtml: `
        <p>Jeder neue Prozentzuschlag im Kalkulationsschema benutzt als <strong>neuen Grundwert (100 %)</strong> immer den direkt darüber stehenden Eurobetrag.</p>
        <div class="example">
          <strong>Beispiel (Kalkulation):</strong><br>
          Einkaufspreis (EK) = 100 €<br>
          + 20 % Handlungskosten = 20 € → Selbstkosten (SK) = 120 €<br>
          + 10 % Gewinn (von 120 €!) = 12 € → Nettoverkaufspreis = 132 €<br>
          + 19 % USt (von 132 €!) = 25,08 € → <strong>Bruttoverkaufspreis = 157,08 €</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> In R8 nutzt du vor allem das Schema <strong>Netto-VK + USt = Brutto-VK</strong>. Im M-Zug (M8) rechnest du zusätzlich über Einkaufspreis, Handlungskosten, Selbstkosten und Gewinn/Verlust!
        </div>
      `,
      formulas: [
        {
          name: "Einfaches USt-Schema (R8/M8)",
          html: "Brutto-VK = Netto-VK · (1 + USt/100)",
          quantities: "Umsatzsteuer immer auf den Netto-VK aufschlagen",
        },
        {
          name: "Handelskalkulation (M8)",
          html: "EK →(+HK%) SK →(+Gewinn%) Netto-VK →(+USt%) Brutto-VK",
          quantities: "Jeder Schritt bildet den Grundwert für den nächsten",
        },
      ],
      quiz: {
        question: "Worauf bezieht sich der Gewinnzuschlag in der Handelskalkulation?",
        options: [
          "Auf die Selbstkosten (100 %)",
          "Immer auf den ursprünglichen Einkaufspreis",
          "Immer auf den Bruttoverkaufspreis",
        ],
        correctIndex: 0,
        explanation:
          "Im Kalkulationsschema bezieht sich der Gewinnzuschlag auf die Selbstkosten (EK + Handlungskosten), danach die USt auf den Netto-VK.",
      },
      lab: lab(
        "kalkulation-schema",
        "Kalkulationsleiter Schritt für Schritt",
        "Stelle Einkaufspreis, Handlungskosten, Gewinn und Umsatzsteuer ein und verfolge jeden Stufenbetrag.",
        [
          range("ek", "Einkaufspreis EK", 50, 200, 150, 25, "€"),
          range("hk", "Handlungskosten", 0, 50, 20, 5, "%"),
          range("gew", "Gewinn", 0, 40, 10, 5, "%"),
          range("ust", "Umsatzsteuer", 7, 19, 19, 12, "%"),
        ],
        [
          output("selfCost", "Selbstkosten", (v) => v.ek * (1 + v.hk / 100), "€", 2),
          output(
            "netVk",
            "Netto-VK",
            (v) => v.ek * (1 + v.hk / 100) * (1 + v.gew / 100),
            "€",
            2,
          ),
          output(
            "bruttoVk",
            "Brutto-VK",
            (v) => v.ek * (1 + v.hk / 100) * (1 + v.gew / 100) * (1 + v.ust / 100),
            "€",
            2,
            true,
          ),
        ],
        [
          {
            id: "simple-ust",
            text: "Schalte HK = 0 % und Gewinn = 0 % bei EK = 100 € und 19 % USt (119 € brutto).",
            check: (v, r) =>
              v.ek === 100 && v.hk === 0 && v.gew === 0 && near(Number(r.bruttoVk), 119, 0.01),
          },
          {
            id: "full-calc-132",
            text: "Erreiche bei EK = 100 €, HK = 20 % und Gewinn = 10 % einen Netto-VK von 132 €.",
            check: (v, r) =>
              v.ek === 100 && near(Number(r.selfCost), 120, 0.01) && near(Number(r.netVk), 132, 0.01),
          },
          {
            id: "food-7pct",
            text: "Stelle den ermäßigten Steuersatz 7 % USt bei EK = 200 € ein.",
            check: (v) => v.ust === 7 && v.ek === 200,
          },
        ],
      ),
      exercises: [
        {
          id: "netto-to-brutto",
          make(rng, level) {
            const net = rng.pick([80, 120, 150, 200, 300, 400]);
            const ustRate = level === 1 ? 19 : rng.pick([19, 7]);
            const brutto = Number((net * (1 + ustRate / 100)).toFixed(2));
            return task(
              level,
              `Ein Händler setzt den Nettoverkaufspreis auf ${net} € fest. Berechne den Bruttoverkaufspreis bei ${ustRate} % USt.`,
              `Im Kalkulationsschema steht ein Nettoverkaufspreis von ${net} €. Es gilt der Umsatzsteuersatz von ${ustRate} %. Wie hoch ist der Ladenpreis (Brutto-VK)?`,
              [numberField("Brutto-VK =", brutto, "€", 2)],
              `Brutto-VK = Netto-VK · ${fmt(1 + ustRate / 100, 2)}`,
              [
                `USt (${ustRate} %) = ${fmt((net * ustRate) / 100, 2)} €`,
                `${net} € + ${fmt((net * ustRate) / 100, 2)} € = <strong>${fmt(brutto, 2)} €</strong>`,
              ],
              { net, ustRate, brutto },
            );
          },
        },
        {
          id: "ek-to-brutto-vk",
          make(rng, level) {
            const ek = rng.pick([100, 150, 200, 250]);
            const hk = rng.pick([20, 25, 30]);
            const gew = rng.pick([10, 15, 20]);
            const sk = ek * (1 + hk / 100);
            const netVk = sk * (1 + gew / 100);
            const bruttoVk = Number((netVk * 1.19).toFixed(2));
            return task(
              level,
              `Einkaufspreis ${ek} €, dazu ${hk} % Handlungskosten und ${gew} % Gewinn (Stufe 1: Berechne die Selbstkosten).`,
              `Ein Elektrohändler kauft Kopfhörer für ${ek} € (EK) ein, rechnet ${hk} % Handlungskosten und ${gew} % Gewinn auf die Selbstkosten sowie 19 % USt. Wie hoch ist der Bruttoverkaufspreis?`,
              level === 1
                ? [numberField("Selbstkosten =", sk, "€", 2)]
                : [numberField("Brutto-VK =", bruttoVk, "€", 2)],
              level === 1 ? "SK = EK · (1 + HK/100)" : "EK →(+HK%) SK →(+Gewinn%) Netto-VK →(·1,19) Brutto-VK",
              level === 1
                ? [
                    `HK (${hk} %) = ${fmt((ek * hk) / 100, 2)} € auf den Einkaufspreis`,
                    `${ek} € · ${fmt(1 + hk / 100, 2)} = <strong>${fmt(sk, 2)} €</strong>`,
                  ]
                : [
                    `SK = ${fmt(sk, 2)} € → Netto-VK = ${fmt(netVk, 2)} €`,
                    `Brutto-VK = ${fmt(netVk, 2)} · 1,19 = <strong>${fmt(bruttoVk, 2)} €</strong>`,
                  ],
              { ek, hk, gew, sk, bruttoVk },
            );
          },
        },
      ],
    }),

    // 1.6 Schaubilder kritisch bewerten & Plus-Minus/Halbkreis (R + M)
    makeLesson(1, 6, LB, {
      id: "pr-6-schaubilder-prozent",
      title: "Schaubilder & Darstellungskritik",
      subtitle: "Plus-Minus- & Halbkreisdiagramme (M8) sowie Manipulationen durchschauen",
      tracks: BOTH,
      whyItMatters:
        "In Nachrichten und Werbung tauchen Prozentangaben in Balken-, Halbkreis- oder Plus-Minus-Diagrammen auf — manche tricksen optisch mit abgeschnittenen Achsen.",
      explanationHtml: `
        <p>Neben Säulen-, Balken-, Streifen- und Kreisdiagrammen nutzt man oft <strong>Plus-Minus-Diagramme</strong> (Zunahme nach rechts/oben, Abnahme nach links/unten) sowie <strong>Halbkreisdiagramme</strong> (im M-Zug: 180° entsprechen 100 % → 1 % = 1,8°).</p>
        <div class="example">
          <strong>Beispiel:</strong> In einem Halbkreisdiagramm hat Partei/Kategorie A 40 % und B 35 %.<br>
          Winkel A = 40 · 1,8° = <strong>72°</strong>; Winkel B = 35 · 1,8° = <strong>63°</strong>; Rest (25 %) = 45°.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Im Vollkreis gilt 1 % = 3,6°, im Halbkreis <strong>1 % = 1,8°</strong>. Prüfe bei jedem Diagramm immer zuerst die Grundlinie (0-Linie) und die angegebenen Grundwerte!
        </div>
      `,
      formulas: [
        {
          name: "Winkel im Halbkreisdiagramm",
          html: "α = p · 1,8° (da 180° : 100 = 1,8°)",
          quantities: "p Prozentsatz, α Mittelpunktswinkel im Halbkreis",
        },
      ],
      quiz: {
        question: "Wie viel Grad entspricht genau 25 % in einem Halbkreisdiagramm (180°)?",
        options: ["45°", "90°", "25°"],
        correctIndex: 0,
        explanation:
          "Der Halbkreis hat 180°. Ein Viertel (25 %) von 180° ist 25 · 1,8° = 45° (90° wäre es im Vollkreis!).",
      },
      lab: lab(
        "percent-diagrams-8",
        "Plus-Minus- & Halbkreisdiagramm",
        "Schalte zwischen Plus-Minus-Diagramm und Halbkreisdiagramm um und prüfe die zugehörigen Winkel und Mittelwerte.",
        [
          choice("mode", "Diagrammtyp", ["Plus-Minus-Diagramm", "Halbkreisdiagramm (M8)"], 0),
          range("a", "Bereich A (%)", -30, 30, 15, 5, "%"),
          range("b", "Bereich B (%)", -30, 30, -10, 5, "%"),
          range("c", "Bereich C (%)", -30, 30, 20, 5, "%"),
          range("posA", "Halbkreis A (%)", 10, 70, 40, 5, "%"),
          range("posB", "Halbkreis B (%)", 10, 70, 35, 5, "%"),
        ],
        [
          output("avg", "Mittel (Plus-Minus)", (v) => (v.a + v.b + v.c) / 3, "%", 1, true),
          output("degA", "Halbkreiswinkel A", (v) => Math.min(180, (v.posA / Math.max(100, v.posA + v.posB)) * 180), "°", 1),
        ],
        [
          {
            id: "plus-minus-zero",
            text: "Bringe im Plus-Minus-Diagramm den Mittelwert auf genau 0,0 % (mit Bereich C ≠ 0).",
            check: (v, r) => v.mode === 0 && v.c !== 0 && near(Number(r.avg), 0, 0.01),
          },
          {
            id: "half-90",
            text: "Stelle im Halbkreisdiagramm Feld A auf 50 % (Winkel 90°).",
            check: (v, r) => v.mode === 1 && v.posA === 50 && v.posB <= 50 && near(Number(r.degA), 90, 0.02),
          },
          {
            id: "half-36",
            text: "Zeichne im Halbkreisdiagramm einen 36°-Sektor für Feld A (20 %).",
            check: (v, r) => v.mode === 1 && v.posA === 20 && v.posB <= 80 && near(Number(r.degA), 36, 0.02),
          },
        ],
      ),
      exercises: [
        {
          id: "semicircle-angle",
          make(rng, level) {
            const p = rng.pick([15, 20, 25, 30, 35, 40, 45]);
            const deg = p * 1.8;
            return task(
              level,
              `Für ein Halbkreisdiagramm (180° = 100 %) soll ein Anteil von ${p} % eingezeichnet werden. Berechne den Sektorwinkel.`,
              `Eine Schülerzeitung druckt die Wahlergebnisse im Halbkreisdiagramm ab. Der Favorit erhielt ${p} %. Welchen Winkel misst sein Kreisausschnitt?`,
              [
                numberField("Winkel =", deg, "°", 1, {
                  slips: [
                    {
                      value: p * 3.6,
                      hint: "3,6° je Prozent gilt im Vollkreis (360°), im Halbkreis gilt 1 % = 1,8°!",
                    },
                  ],
                }),
              ],
              "Winkel im Halbkreis = p · 1,8°",
              [
                `${p} · 1,8° = ${fmt(deg, 1)}°`,
                `<strong>${fmt(deg, 1)}°</strong>`,
              ],
              { p, deg },
            );
          },
        },
        {
          id: "critical-chart-read",
          make(rng, level) {
            const base = rng.pick([1000, 2000, 4000]);
            const p = rng.pick([12, 15, 25]);
            const drop = (base * p) / 100;
            const after = base - drop;
            return task(
              level,
              `Ein Plus-Minus-Diagramm zeigt im Februar −${p} % bei einem Vorwert von ${base} €. Berechne den neuen Wert.`,
              `Ein Säulendiagramm zeigt Umsatzveränderungen gegenüber ${base} €: Januar +10 %, Februar −${p} % gegenüber ${base} €. Welcher Betrag gehört zum Februar-Wert?`,
              [numberField("Wert Februar =", after, "€", 0)],
              "Abzug −p % vom Grundwert abziehen.",
              [
                `${p} % von ${base} € = ${fmt(drop, 0)} €`,
                `${base} € − ${fmt(drop, 0)} € = <strong>${fmt(after, 0)} €</strong>`,
              ],
              { base, p, after },
            );
          },
        },
      ],
    }),

    // 1.7 Promille (R + M)
    makeLesson(1, 7, LB, {
      id: "pr-7-promillerechnung",
      title: "Promillerechnung (‰)",
      subtitle: "Tausendstel verstehen und mit dem Grundwert sicher berechnen",
      tracks: BOTH,
      whyItMatters:
        "Versicherungsprämien, Alkoholgrenzen im Straßenverkehr, Gefälleangaben oder Wirkstoffe in Medikamenten werden in Promille angegeben.",
      explanationHtml: `
        <p><strong>Promille (‰)</strong> bedeutet „von Tausend“. Es unterscheidet sich von Prozent (%) genau um den Faktor 10:</p>
        <div class="example">
          <strong>Beispiel:</strong> Eine Hausratversicherung kostet 4 ‰ von 50 000 € Versicherungssumme im Jahr.<br>
          1 ‰ = 50 000 € : 1 000 = 50 € → 4 ‰ = 4 · 50 € = <strong>200 €</strong>.<br>
          (Als Prozent wären 4 ‰ genau 0,4 %.)
        </div>
        <div class="merke">
          <strong>Merke:</strong> p ‰ = ${frac("p", "1 000")}. Promillewert <strong>P<sub>m</sub> = G · ${frac("p", "1 000")}</strong>. Für den Wechsel zu Prozent: <strong>1 % = 10 ‰</strong>!
        </div>
      `,
      formulas: [
        {
          name: "Promillewert berechnen",
          html: `P<sub>m</sub> = G · ${frac("p", "1 000")}`,
          quantities: "G Grundwert, p Promillesatz (Tausendstel)",
        },
        {
          name: "Umrechnung Prozent ↔ Promille",
          html: "1 % = 10 ‰ · bzw. · 1 ‰ = 0,1 %",
          quantities: "Komma um eine Stelle verschieben",
        },
      ],
      quiz: {
        question: "Wie viel Prozent entsprechen genau 15 ‰?",
        options: ["1,5 %", "15 %", "0,15 %"],
        correctIndex: 0,
        explanation: "15 ‰ = 15/1 000 = 1,5/100 = 1,5 %.",
      },
      lab: lab(
        "promille-scale",
        "Promille als Tausendstel erleben",
        "Stelle Promillesatz und Grundwert ein und lies den Promillewert sowie die Umrechnung in % ab.",
        [
          range("pm", "Promillesatz p", 1, 50, 12, 1, "‰"),
          range("base", "Grundwert G", 1000, 10000, 2000, 1000),
        ],
        [
          output("val", "Promillewert Pₘ", (v) => (v.base * v.pm) / 1000, "", 2, true),
          output("pct", "Als Prozent", (v) => v.pm / 10, "%", 2),
        ],
        [
          {
            id: "half-percent",
            text: "Stelle exactement 5 ‰ (0,5 %) ein und prüfe 5 ‰ von 2 000.",
            check: (v, r) => v.pm === 5 && v.base === 2000 && near(Number(r.val), 10, 0.01),
          },
          {
            id: "val-120",
            text: "Erreiche einen Promillewert von genau 120 bei G = 5 000.",
            check: (v, r) => v.base === 5000 && near(Number(r.val), 120, 0.01),
          },
          {
            id: "three-pct",
            text: "Stelle den Promillesatz auf 3 % (= 30 ‰).",
            check: (_v, r) => near(Number(r.pct), 3, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "promille-value",
          make(rng, level) {
            const g = rng.pick([10000, 25000, 40000, 60000, 80000]);
            const pm = rng.pick([2, 3, 4, 5, 8]);
            const val = (g * pm) / 1000;
            return task(
              level,
              `Berechne ${pm} ‰ vom Grundwert ${g} €.`,
              `Eine Diebstahlversicherung verlangt pro Jahr eine Prämie von ${pm} ‰ des versicherten Warenwerts von ${g} €. Wie hoch ist der Jahresbeitrag in Euro?`,
              [
                numberField("Promillewert =", val, "€", 2, {
                  slips: [
                    {
                      value: (g * pm) / 100,
                      hint: "Du hast durch 100 statt durch 1 000 geteilt! Promille heißt von Tausend.",
                    },
                  ],
                }),
              ],
              "P_m = (G : 1 000) · p",
              [
                `1 ‰ = ${g} : 1 000 = ${fmt(g / 1000, 2)} €`,
                `${pm} ‰ = ${pm} · ${fmt(g / 1000, 2)} = <strong>${fmt(val, 2)} €</strong>`,
              ],
              { g, pm, val },
            );
          },
        },
        {
          id: "promille-to-rate",
          make(rng, level) {
            const g = rng.pick([2000, 5000, 10000]);
            const pm = rng.pick([4, 6, 8, 12, 15]);
            const val = (g * pm) / 1000;
            return task(
              level,
              `Von ${g} ml einer Lösung sind ${fmt(val, 1)} ml reiner Wirkstoff. Wie viel Promille entspricht das?`,
              `In einem Kanister mit ${g} ml Desinfektionsmittel befinden sich genau ${fmt(val, 1)} ml eines konzentrierten Wirkstoffs. Gib den Gehalt in Promille (‰) an.`,
              [numberField("Promillesatz =", pm, "‰", 1)],
              "p = (Promillewert : Grundwert) · 1 000",
              [
                `${fmt(val, 1)} : ${g} = ${fmt(val / g, 4)}`,
                `${fmt(val / g, 4)} · 1 000 = <strong>${fmt(pm, 1)} ‰</strong>`,
              ],
              { g, pm, val },
            );
          },
        },
      ],
    }),
  ],
);
