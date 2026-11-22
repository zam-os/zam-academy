import {
  arrow,
  badge,
  card,
  type ConceptFigure,
  factory,
  group,
  label,
  lines,
  pill,
  receiptDoc,
  scaleBeam,
  shield,
  tAccountBox,
} from "./draw";

export const LB3_FIGURES: Record<string, ConceptFigure> = {
  "gb-inventur-inventar": {
    title: "Von der Inventur zum dreiteiligen Inventar",
    question: "Wie wird aus dem Zählen im Lager das gegliederte Bestandsverzeichnis?",
    alt: "Links Inventur (körperlich zählen und per Beleg prüfen), in der Mitte Vermögen nach steigender Liquidität und Schulden nach Fälligkeit im Inventar, rechts das Reinvermögen als Eigenkapital.",
    caption: "Inventur ist die Tätigkeit (Zählen, Messen, Wiegen, Buchinventur); das Inventar ist das schriftliche Verzeichnis mit Einzelwerten.",
    parts: [
      {
        label: "1 · Inventur (Tätigkeit)",
        note: "Einmal im Jahr werden alle Bestände im Radwerk körperlich gezählt (Werkstoffe, Maschinen) oder per Kontoauszug belegt (BK, FO, VE).",
      },
      {
        label: "2 · Vermögen & Schulden",
        note: "Im Inventar stehen oben A. Vermögen (AV + UV nach steigender Flüssigkeit) und darunter B. Schulden (LBKV, KBKV, VE nach Fälligkeit).",
      },
      {
        label: "3 · Reinvermögen (EK)",
        note: "Teil C zieht von der Summe des Vermögens die Schulden ab: Vermögen − Schulden = Reinvermögen (Eigenkapital).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Inventur", "heading")}${factory(101, 96, 0.78)}${pill(30, 134, 142, 24, "Körperlich · Zählen", "v-blue-fill", "micro")}${pill(30, 164, 142, 24, "Buchinventur · Belege", "v-teal-fill", "micro")}${lines(101, 206, "Aufnahme zum Stichtag", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 184, 214)}${badge(234, 40, 2)}${label(308, 45, "Inventar A + B", "heading")}${receiptDoc(228, 62, 152, 122, "INVENTAR-AUSZUG", [
          "A. Vermögen: MA, BK …",
          "   Summe      210.000 €",
          "B. Schulden: LBKV, VE",
          "   Summe       90.000 €",
        ])}${lines(304, 204, "Einzelposten mit Menge,\nEinzel- & Gesamtwert", "micro")}`,
      ) +
      arrow(398, 124, 418, 124) +
      group(
        3,
        `${card(420, 18, 166, 214)}${badge(442, 40, 3)}${label(506, 45, "Teil C · EK", "heading")}${pill(436, 74, 134, 28, "Vermögen  210.000 €", "v-blue-fill", "micro")}${pill(436, 110, 134, 28, "− Schulden 90.000 €", "v-coral-fill", "micro")}${pill(436, 150, 134, 30, "= EK      120.000 €", "v-green-fill", "small")}${lines(503, 202, "Reinvermögen = Basis\nfür die Bilanz", "micro")}`,
      ),
  },

  "gb-bilanz": {
    title: "Aufbau der Bilanz und Bilanzwaage",
    question: "Warum stehen in jeder Bilanz Aktiva und Passiva mit derselben Summe?",
    alt: "Eine Waage mit der linken Seite Aktiva (Mittelverwendung: Anlagevermögen und Umlaufvermögen) und der rechten Seite Passiva (Mittelherkunft: Eigenkapital und Fremdkapital) im genauen Gleichgewicht.",
    caption: "Die Bilanz fasst das Inventar als Kontenübersicht zusammen — ohne Mengen, nur noch in Euro auf einem Stichtag.",
    parts: [
      {
        label: "Aktiva (Mittelverwendung)",
        note: "Links zeigt die Bilanz, wofür das Kapital verwendet wurde: langfristiges Anlagevermögen (AV) und kurzfristiges Umlaufvermögen (UV).",
      },
      {
        label: "Passiva (Mittelherkunft)",
        note: "Rechts steht, woher das Kapital stammt: Eigenkapital (EK der Inhaber) und Fremdkapital (Darlehen LBKV, KBKV, VE).",
      },
      {
        label: "Bilanzgleichung",
        note: "Dasselbe Vermögen wird von zwei Seiten betrachtet — daher ist Summe Aktiva stets gleich Summe Passiva (EK = Vermögen − FK).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 186, 154)}${badge(36, 40, 1)}${label(112, 45, "Aktiva (links)", "heading")}${pill(30, 66, 154, 30, "AV · GR, MA, FP, BGA", "v-blue-fill", "micro")}${pill(30, 102, 154, 30, "UV · Vorräte, FO, BK", "v-teal-fill", "micro")}${label(107, 156, "Mittelverwendung", "small")}`,
      ) +
      group(
        2,
        `${card(400, 18, 186, 154)}${badge(422, 40, 2)}${label(498, 45, "Passiva (rechts)", "heading")}${pill(416, 66, 154, 30, "EK · Eigenkapital", "v-green-fill", "micro")}${pill(416, 102, 154, 30, "FK · LBKV, KBKV, VE", "v-orange-fill", "micro")}${label(493, 156, "Mittelherkunft", "small")}`,
      ) +
      group(
        3,
        `${card(212, 18, 176, 154)}${badge(234, 40, 3)}${label(302, 45, "Waage", "heading")}${scaleBeam(300, 74, 100)}${pill(14, 184, 572, 44, "Bilanzsumme Aktiva (AV + UV)  =  Bilanzsumme Passiva (EK + FK)", "v-accent-fill", "small")}`,
      ),
  },

  "gb-bilanzveraenderungen": {
    title: "Die vier Bilanzveränderungen",
    question: "Wann bleibt die Bilanzsumme gleich, wann wächst sie und wann schrumpft sie?",
    alt: "Drei Vergleichsfelder: links Tausch nur auf einer Seite (Aktivtausch oder Passivtausch, Summe konstant), in der Mitte Aktiv-Passiv-Mehrung (+/+ verlängert Bilanz), rechts Aktiv-Passiv-Minderung (−/− verkürzt Bilanz).",
    caption: "Jeder bestandsverändernde Geschäftsfall berührt mindestens zwei Bilanzposten — das Gleichgewicht bleibt immer erhalten.",
    parts: [
      {
        label: "Aktiv- & Passivtausch",
        note: "Verändern sich nur zwei Aktivposten (z. B. MA + / BK −) oder nur zwei Passivposten (LBKV + / VE −), bleibt die Bilanzsumme unverändert.",
      },
      {
        label: "Aktiv-Passiv-Mehrung",
        note: "Steigen ein Aktiv- und ein Passivposten gleichzeitig (z. B. Maschinenkauf auf Ziel: MA + und VE +), wächst die Bilanzsumme.",
      },
      {
        label: "Aktiv-Passiv-Minderung",
        note: "Sinken ein Aktiv- und ein Passivposten gleichzeitig (z. B. Überweisung einer Lieferantenrechnung: VE − und BK −), schrumpft die Bilanzsumme.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 180, 214)}${badge(36, 40, 1)}${label(112, 44, "Tausch (Summe =)", "heading")}${pill(28, 70, 152, 32, "Aktivtausch: +AV / −UV", "v-blue-fill", "micro")}${pill(28, 110, 152, 32, "Passivtausch: +FK / −FK", "v-teal-fill", "micro")}${pill(42, 156, 124, 26, "Bilanzsumme ==", "v-soft-fill", "micro")}${lines(104, 206, "Umschichtung auf\nnur einer Bilanzseite", "micro")}`,
      ) +
      group(
        2,
        `${card(210, 18, 180, 214)}${badge(232, 40, 2)}${label(308, 44, "Verlängerung (+/+)", "heading")}<rect x="242" y="72" width="48" height="72" rx="5" class="v-blue"/><rect x="310" y="72" width="48" height="72" rx="5" class="v-green"/>${label(266, 112, "+ A", "small on-fill")}${label(334, 112, "+ P", "small on-fill")}${pill(226, 156, 148, 26, "Bilanzsumme steigt", "v-green-fill", "micro")}${lines(300, 206, "z. B. MA-Kauf auf Ziel\n(MA + und VE +)", "micro")}`,
      ) +
      group(
        3,
        `${card(406, 18, 180, 214)}${badge(428, 40, 3)}${label(504, 44, "Verkürzung (−/−)", "heading")}<rect x="438" y="96" width="48" height="48" rx="5" class="v-orange"/><rect x="506" y="96" width="48" height="48" rx="5" class="v-coral"/>${label(462, 124, "− A", "small on-fill")}${label(530, 124, "− P", "small on-fill")}${pill(422, 156, 148, 26, "Bilanzsumme sinkt", "v-coral-fill", "micro")}${lines(496, 206, "z. B. VE per BK zahlen\n(BK − und VE −)", "micro")}`,
      ),
  },

  "gb-bestand-vs-erfolg": {
    title: "Bestandsverändernd oder erfolgswirksam?",
    question: "Welcher Vorgang lässt das Eigenkapital unberührt und welcher verändert es?",
    alt: "Drei Wirkungsrichtungen auf das Eigenkapital: links Bestandsumschichtung lässt EK gleich, in der Mitte Aufwand (z. B. AWR, AWB) mindert EK, rechts Ertrag (UEFE) mehrt EK.",
    caption: "Erfolg entsteht erst durch Werteverzehr (Aufwand) und Wertzuwachs (Ertrag) — nicht durch reine Kassen- oder Bankzahlung.",
    parts: [
      {
        label: "Bestandsvorgang (EK =)",
        note: "Wenn du ein Gerät per Bank bezahlst (MA an BK) oder eine Rechnung begleichst (VE an BK), verschieben sich nur Bestände — das EK bleibt gleich.",
      },
      {
        label: "Aufwand (EK sinkt)",
        note: "Verbrauchte Werkstoffe (AWR, AWF, AWH, AWB wie Werkstattstrom) verzehren Werte und mindern am Jahresende das Eigenkapital.",
      },
      {
        label: "Ertrag (EK steigt)",
        note: "Verkäufe eigener Jugendfahrräder (UEFE) schaffen neuen Wertzuwachs und erhöhen am Ende als Reingewinn das Eigenkapital.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Erfolgsneutral", "heading")}${pill(30, 74, 142, 30, "MA an BK · VE an BK", "v-blue-fill", "micro")}${pill(40, 120, 122, 34, "EK bleibt gleich", "v-soft-fill", "small")}${lines(101, 184, "Vermögens- und\nSchuldentausch\nändert keinen Erfolg", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Aufwand (− EK)", "heading")}${pill(228, 74, 144, 30, "AWR · AWF · AWH · AWB", "v-coral-fill", "micro")}${pill(238, 120, 124, 34, "EK sinkt ↓", "v-orange-fill", "small")}${lines(300, 184, "Werkstoffeinsatz &\nWerkstattstrom\nmindern Gewinn", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Ertrag (+ EK)", "heading")}${pill(428, 74, 142, 30, "UEFE · Verkauf Räder", "v-green-fill", "micro")}${pill(438, 120, 122, 34, "EK steigt ↑", "v-teal-fill", "small")}${lines(499, 184, "Erträge > Aufwendungen\n= Reingewinn", "micro")}`,
      ),
  },

  "gb-bestandskonten": {
    title: "Aktive und passive Bestandskonten (T-Konten)",
    question: "Auf welcher Kontoseite stehen Anfangsbestand, Mehrungen, Minderungen und Schlussbestand?",
    alt: "Links ein aktives T-Konto (AB und Zugänge im Soll, Abgänge und Schlussbestand im Haben), rechts ein passives T-Konto (AB und Zugänge im Haben, Abgänge und Schlussbestand im Soll), darunter die Abschlussregel über beide Seiten.",
    caption: "Aktive Konten stehen in der Bilanz links → ihr Anfangsbestand startet auch im T-Konto links (Soll). Passive Konten spiegeln das.",
    parts: [
      {
        label: "Aktives Konto (Soll +)",
        note: "Aktive Bestandskonten (GR, MA, Vorräte, FO, BK, KA) buchen Anfangsbestand und Zugänge im Soll (links), Abgänge und Schlussbestand im Haben (rechts).",
      },
      {
        label: "Passives Konto (Haben +)",
        note: "Passive Bestandskonten (EK, LBKV, KBKV, VE) buchen Anfangsbestand und Zugänge im Haben (rechts), Abgänge und Schlussbestand im Soll (links).",
      },
      {
        label: "Abschluss & SB",
        note: "Die wertmäßig größere Kontoseite bestimmt die Kontosumme. Der Schlussbestand (SB) füllt die kleinere Seite auf dieselbe Summe auf.",
      },
    ],
    draw: () =>
      group(
        1,
        `${badge(34, 26, 1)}${label(148, 30, "Aktives Konto (z. B. BK, MA)", "heading")}${tAccountBox(
          16,
          44,
          264,
          126,
          "BK",
          ["AB (links)", "+ Zugänge", "", "Summe"],
          ["− Abgänge", "SB (Ausgleich)", "", "Summe"],
          "v-panel",
        )}`,
      ) +
      group(
        2,
        `${badge(334, 26, 2)}${label(450, 30, "Passives Konto (z. B. VE, EK)", "heading")}${tAccountBox(
          318,
          44,
          266,
          126,
          "VE",
          ["− Abgänge", "SB (Ausgleich)", "", "Summe"],
          ["AB (rechts)", "+ Zugänge", "", "Summe"],
          "v-panel",
        )}`,
      ) +
      group(
        3,
        `${card(16, 182, 568, 52, "v-soft-fill", 12)}${badge(42, 208, 3)}${label(312, 213, "Schlussbestand = Größere Seite − kleinere Seite → gleicht beide Seiten aus", "small")}`,
      ),
  },

  "gb-buchungssatz": {
    title: "In vier Schritten zum Buchungssatz",
    question: "Wie leitest du aus jedem Beleg fehlerfrei „Soll an Haben“ ab?",
    alt: "Drei Stationen zum Buchungssatz: zuerst Beleg prüfen (GoB), dann zwei Konten, Art und Soll/Haben bestimmen, rechts die fertige Form Sollkonto Betrag an Habenkonto Betrag.",
    caption: "Das Wort „an“ trennt immer die Sollseite (links/zuerst) von der Habenseite (rechts/danach); Soll- und Habensumme müssen gleich sein.",
    parts: [
      {
        label: "1 · Beleg prüfen (GoB)",
        note: "„Keine Buchung ohne Beleg!“ Lies zuerst aus Rechnung oder Kontoauszug heraus, was passiert ist und welcher Betrag gilt.",
      },
      {
        label: "2 · Konten & Seite",
        note: "Bestimme beide betroffenen Konten, ob sie aktiv oder passiv sind und ob sie zu- (+) oder abnehmen (−). Daraus folgen Soll und Haben.",
      },
      {
        label: "3 · Soll an Haben",
        note: "Schreibe zuerst das Sollkonto mit Betrag, dann „an“ und das Habenkonto mit gleichem Betrag (z. B. MA 12.000,00 € an BK 12.000,00 €).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 170, 214)}${badge(36, 40, 1)}${label(100, 45, "Beleg (GoB)", "heading")}${receiptDoc(34, 64, 130, 108, "BELEG-CHECK", [
          "Rechnung / Auszug",
          "• Maschine gekauft",
          "• per Bank bezahlt",
          "• 12.000,00 €",
        ])}${lines(99, 200, "Keine Buchung\nohne Beleg", "micro")}`,
      ) +
      arrow(186, 124, 204, 124) +
      group(
        2,
        `${card(206, 18, 186, 214)}${badge(228, 40, 2)}${label(300, 45, "Kontenanalyse", "heading")}${pill(222, 68, 154, 34, "MA (aktiv) + → Soll", "v-blue-fill", "micro")}${pill(222, 112, 154, 34, "BK (aktiv) − → Haben", "v-orange-fill", "micro")}${lines(299, 182, "Mehrung im Soll?\nMinderung im Haben?", "micro")}`,
      ) +
      arrow(394, 124, 412, 124) +
      group(
        3,
        `${card(414, 18, 172, 214)}${badge(436, 40, 3)}${label(502, 45, "Buchungssatz", "heading")}${pill(428, 70, 144, 30, "Soll: MA 12.000 €", "v-teal-fill", "micro")}${label(500, 118, "an", "heading")}${pill(428, 128, 144, 30, "Haben: BK 12.000 €", "v-coral-fill", "micro")}${lines(500, 192, "Σ Soll = Σ Haben\nimmer ausgeglichen!", "micro")}`,
      ),
  },

  "gb-geschaeftsvorfaelle": {
    title: "Buchungssatz lesen und Beleg zuordnen",
    question: "Wie erkennst du am fertigen Buchungssatz rückwärts den realen Geschäftsfall?",
    alt: "Links wird das Sollkonto VE entschlüsselt (Schulden sinken), in der Mitte das Habenkonto BK (Bankguthaben sinkt), rechts entsteht der Geschäftsfall Banküberweisung einer Lieferantenrechnung samt Kontoauszug.",
    caption: "Lies zuerst die Konten (z. B. VE und BK), dann ob sie aktiv oder passiv sind — schon zeigt die Soll-/Haben-Stellung, was steigt oder sinkt.",
    parts: [
      {
        label: "Soll-Seite deuten",
        note: "Steht das Passivkonto VE im Soll, nehmen Verbindlichkeiten ab — das Unternehmen bezahlt eine offene Lieferantenrechnung.",
      },
      {
        label: "Haben-Seite deuten",
        note: "Steht das Aktivkonto BK im Haben, fließt Geld vom Bankkonto ab — bezahlt wurde also per Überweisung (nicht bar über KA).",
      },
      {
        label: "Geschäftsfall & Beleg",
        note: "Aus „VE 2.400 € an BK 2.400 €“ folgt der Geschäftsfall „Begleichung einer Eingangsrechnung durch Banküberweisung“ (Beleg: Kontoauszug).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Soll lesen", "heading")}${pill(30, 74, 142, 32, "Soll: VE 2.400 €", "v-blue-fill", "micro")}${pill(30, 116, 142, 28, "Passivkonto im Soll", "v-soft-fill", "micro")}${lines(101, 176, "→ Verbindlichkeit (−)\nwird beglichen", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Haben lesen", "heading")}${pill(228, 74, 144, 32, "Haben: BK 2.400 €", "v-coral-fill", "micro")}${pill(228, 116, 144, 28, "Aktivkonto im Haben", "v-soft-fill", "micro")}${lines(300, 176, "→ Bankguthaben (−)\nÜberweisung fließt ab", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Geschäftsfall", "heading")}${receiptDoc(428, 66, 142, 92, "KONTOAUSZUG", [
          "Überweisung an Lieferer",
          "Rechnung #104",
          "− 2.400,00 €",
        ])}${lines(499, 192, "Wir begleichen eine\nLiefererrechnung per Bank", "micro")}`,
      ),
  },

  "gb-umsatzsteuer-rechnen": {
    title: "Netto, Umsatzsteuer und Brutto berechnen",
    question: "Warum ist der Nettobetrag immer 100 % — auch beim Rückrechnen aus Brutto?",
    alt: "Aufbau eines Preises als gestapelter Balken: 100 % Warenwert netto (z. B. 500 €) plus 19 % Umsatzsteuer (95 €) ergeben zusammen 119 % Bruttorechnungsbetrag (595 €).",
    caption: "Achtung Häufiger Fehler: 19 % von 595 € wäre falsch gerechnet — Brutto sind bereits 119 %, daher Netto = Brutto : 1,19.",
    parts: [
      {
        label: "Warenwert netto (100 %)",
        note: "Der reine Warenwert ohne Steuer bildet die 100-%-Basis für alle Umsatzsteuerberechnungen in Unternehmen.",
      },
      {
        label: "Steuer: 19 % oder 7 %",
        note: "Regelsteuersatz ist 19 % (Fahrräder, Werkstoffe, Maschinen); ermäßigt mit 7 % sind vor allem Grundnahrungsmittel und Bücher.",
      },
      {
        label: "Brutto = 119 % / 107 %",
        note: "Netto + Steuer = Brutto (z. B. 500 € + 95 € = 595 €). Umgekehrt teilst du Brutto durch 1,19 (oder 1,07), um Netto zu erhalten.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Netto = 100 %", "heading")}<rect x="34" y="76" width="134" height="72" rx="8" class="v-blue"/>${label(101, 108, "Warenwert", "small on-fill")}${label(101, 130, "500,00 € (100 %)", "micro on-fill")}${lines(101, 182, "Basis ohne Steuer\nfür Aufwands-/Erlöskonto", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Steuersatz", "heading")}${pill(232, 74, 136, 32, "19 % · Regelsteuersatz", "v-gold-fill", "micro")}${pill(232, 114, 136, 32, "7 % · Bücher, Essen", "v-teal-fill", "micro")}${lines(300, 182, "USt = Netto · 0,19\n(hier 95,00 €)", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Brutto = 119 %", "heading")}<rect x="432" y="72" width="134" height="44" rx="6" class="v-blue"/><rect x="432" y="118" width="134" height="24" rx="6" class="v-gold"/>${label(499, 98, "100 % = 500 €", "micro on-fill")}${label(499, 134, "+ 19 % = 95 €", "micro")}${pill(428, 152, 142, 26, "Brutto = 595,00 €", "v-accent-fill", "micro")}${lines(499, 200, "Netto = Brutto : 1,19", "micro")}`,
      ),
  },

  "gb-umsatzsteuer-buchen": {
    title: "Vorsteuer (VORST) und Umsatzsteuer (UST) buchen",
    question: "Warum bucht das Radwerk beim Einkauf VORST im Soll und beim Verkauf UST im Haben?",
    alt: "Links Einkauf einer Büromaschine: BM und VORST im Soll an VE oder BK; in der Mitte Verkauf: FO oder BK an UEFE und UST im Haben; rechts Bedeutung als durchlaufender Posten gegenüber dem Finanzamt.",
    caption: "VORST ist ein aktives Bestandskonto (Forderung an das Finanzamt); UST ist ein passives Bestandskonto (Schuld an das Finanzamt).",
    parts: [
      {
        label: "Einkauf → VORST (Soll)",
        note: "Bezahlt das Radwerk beim Einkauf Vorsteuer, entsteht eine Forderung an das Finanzamt: aktives Konto VORST steht mit Netto-BM im Soll.",
      },
      {
        label: "Verkauf → UST (Haben)",
        note: "Nimmt das Radwerk beim Verkauf Umsatzsteuer ein, schuldet es diese dem Finanzamt: passives Konto UST steht mit UEFE im Haben.",
      },
      {
        label: "Durchlaufender Posten",
        note: "Weder VORST noch UST gehören zu Aufwand oder Ertrag — die Steuerbelastung trägt am Ende der Endverbraucher.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 186, 214)}${badge(36, 40, 1)}${label(112, 44, "Einkauf → VORST", "heading")}${pill(26, 72, 162, 26, "Soll: BM + VORST", "v-blue-fill", "micro")}${pill(26, 106, 162, 26, "Haben: VE / BK / KA", "v-soft-fill", "micro")}${pill(26, 144, 162, 26, "VORST = aktiv (+ Soll)", "v-teal-fill", "micro")}${lines(107, 198, "Forderung an das\nFinanzamt (erfolgsneutral)", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 186, 214)}${badge(234, 40, 2)}${label(310, 44, "Verkauf → UST", "heading")}${pill(224, 72, 162, 26, "Soll: FO / BK / KA", "v-soft-fill", "micro")}${pill(224, 106, 162, 26, "Haben: UEFE + UST", "v-orange-fill", "micro")}${pill(224, 144, 162, 26, "UST = passiv (+ Haben)", "v-coral-fill", "micro")}${lines(305, 198, "Verbindlichkeit ans\nFinanzamt (erfolgsneutral)", "micro")}`,
      ) +
      group(
        3,
        `${card(410, 18, 176, 214)}${badge(432, 40, 3)}${label(506, 44, "Finanzamt", "heading")}${shield(498, 98, 0.88, "v-teal")}${pill(424, 140, 148, 28, "Durchlaufender Posten", "v-soft-fill", "micro")}${lines(498, 198, "Endverbraucher trägt\ndie Steuer allein", "micro")}`,
      ),
  },
};
