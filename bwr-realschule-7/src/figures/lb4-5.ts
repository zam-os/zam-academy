import {
  arrow,
  badge,
  bike,
  card,
  type ConceptFigure,
  factory,
  group,
  label,
  lines,
  pill,
  receiptDoc,
  shield,
  tAccountBox,
} from "./draw";

export const LB4_5_FIGURES: Record<string, ConceptFigure> = {
  "pp-produktionsprozess": {
    title: "Vom Werkstoffeinsatz zum Periodenerfolg",
    question: "Wie hängen Werkstoffverbrauch, Fertigung, Umsatzerlöse und Gewinn zusammen?",
    alt: "Produktionsprozess des Radwerks: links Aufwandskonten AWR bis AWB als Werkstoffeinsatz, in der Mitte Fertigung zum Jugendfahrrad, rechts Verkauf auf UEFE mit Gewinn-oder-Verlust-Rechnung.",
    caption: "In BwR 7 buchen wir Werkstoffe direkt aufwandsorientiert (AWR–AWB) und stellen sie am Periodenende den Umsatzerlösen (UEFE) gegenüber.",
    parts: [
      {
        label: "Werkstoffeinsatz (Aufwand)",
        note: "Rohstoffe (AWR), Fremdbauteile (AWF), Hilfsstoffe (AWH) und Betriebsstoffe (AWB) erfassen den Werteverzehr im Einkauf.",
      },
      {
        label: "Fertigung",
        note: "Mitarbeitende verbinden mit Maschinen und Strom die eingekauften Werkstoffe zu verkaufsfähigen Jugendrädern.",
      },
      {
        label: "Absatz & Periodenerfolg",
        note: "Verkaufte Räder erscheinen auf UEFE. Sind Erträge (UEFE) höher als die Aufwendungen, erzielt der Betrieb Reingewinn.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Einsatz · Aufwand", "heading")}${pill(30, 72, 142, 26, "AWR · Rohstoffe", "v-orange-fill", "micro")}${pill(30, 104, 142, 26, "AWF · Fremdbauteile", "v-orange-fill", "micro")}${pill(30, 136, 142, 26, "AWH / AWB · Hilfs-/Betr.", "v-coral-fill", "micro")}${lines(101, 194, "Werteverbrauch\nfür die Produktion", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Fertigung", "heading")}${factory(300, 96, 0.78)}${bike(300, 152, 0.72)}${lines(300, 198, "Radwerk Brenner\nbaut Jugendräder", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Absatz · Erfolg", "heading")}${pill(430, 74, 138, 28, "UEFE · Erträge", "v-green-fill", "micro")}${pill(430, 112, 138, 28, "Ertrag − Aufwand", "v-blue-fill", "micro")}${pill(430, 150, 138, 28, "= Gewinn / Verlust", "v-teal-fill", "micro")}${lines(499, 202, "Vergleich bestimmt\nden Periodenerfolg", "micro")}`,
      ),
  },

  "pp-werkstoffe": {
    title: "Die vier Werkstoffarten am Jugendfahrrad",
    question: "Woran unterscheidest du Rohstoff, Fremdbauteil, Hilfsstoff und Betriebsstoff?",
    alt: "Zeichnung eines Jugendfahrrads im Radwerk mit Zuordnung: Aluminiumrohre sind Rohstoffe (AWR), fertige Schaltung und Bremsen sind Fremdbauteile (AWF), Lack und Schrauben sind Hilfsstoffe (AWH), Strom für die Schweißanlage und Schmieröl sind Betriebsstoffe (AWB).",
    caption: "Tipp: AWR und AWF sind Hauptbestandteile, AWH Nebenbestandteil am Produkt; AWB steckt gar nicht im fertigen Fahrrad.",
    parts: [
      {
        label: "AWR & AWF (Hauptteil)",
        note: "Rohstoffe (AWR: Alurohre) bearbeitet das Radwerk selbst; Fremdbauteile (AWF: fertige Bremsen, Reifen, Schaltung) werden fertig zugekauft und montiert.",
      },
      {
        label: "AWH (Nebenbestandteil)",
        note: "Hilfsstoffe (AWH: Lack, Schrauben, Schweißdraht) gehen mit ins Fahrrad ein, prägen das Produkt aber wert- oder mengenmäßig nur gering.",
      },
      {
        label: "AWB (nicht im Produkt)",
        note: "Betriebsstoffe (AWB: Werkstattstrom, Schmieröl, Druckluft) halten Maschinen am Laufen und gelangen nicht ins fertige Fahrrad.",
      },
    ],
    draw: () =>
      card(14, 18, 260, 214, "v-soft-fill", 16) +
      label(144, 44, "Jugendfahrrad (Modell Radwerk)", "heading") +
      bike(144, 128, 1.55) +
      label(144, 208, "Haupt-, Neben- oder Nicht-Bestandteil?", "micro") +
      group(
        1,
        `${arrow(170, 114, 294, 54)}${card(298, 20, 288, 62)}${badge(320, 51, 1)}${lines(344, 42, "AWR (Alurohr) · bearbeiteter Hauptstoff\nAWF (Schaltung, Reifen) · fertiges Bauteil", "micro", "start")}`,
      ) +
      group(
        2,
        `${arrow(144, 134, 294, 124)}${card(298, 94, 288, 62)}${badge(320, 125, 2)}${lines(344, 116, "AWH (Lack, Schrauben, Schweißdraht)\nNebenbestandteil direkt am Rad", "micro", "start")}`,
      ) +
      group(
        3,
        `${arrow(248, 188, 294, 198)}${card(298, 168, 288, 62)}${badge(320, 199, 3)}${lines(344, 190, "AWB (Strom, Schmieröl, Reinigung)\nhält die Fertigung am Laufen (nie im Rad)", "micro", "start")}`,
      ),
  },

  "pp-angebotsvergleich": {
    title: "Angebote quantitativ und qualitativ vergleichen",
    question: "Wann lohnt ein höherer Listenpreis oder warum gewinnt doch der zweite Anbieter?",
    alt: "Drei Prüfschritte beim Werkstoffeinkauf: links rechnerischer Bezugspreis (Listenpreis netto minus Sofortrabatt), in der Mitte qualitative Kriterien (Qualität, Lieferzeit, Zuverlässigkeit), rechts Gesamturteil.",
    caption: "Erst rechnen, dann Qualität prüfen — der absolut billigste Preis nutzt wenig, wenn Bauteile zu spät oder fehlerhaft ankommen.",
    parts: [
      {
        label: "Bezugspreis (quantitativ)",
        note: "Ziehe vom Netto-Listenpreis den jeweiligen Sofortrabatt in % ab. Verglichen wird immer der Netto-Bezugspreis (da VORST durchläuft).",
      },
      {
        label: "Qualitative Kriterien",
        note: "Lieferfrist, Verarbeitungsqualität, Termintreue, Kulanz und regionale Nähe zählen besonders bei wichtigen Bauteilen.",
      },
      {
        label: "Begründete Auswahl",
        note: "Liegt ein Anbieter beim Netto-Bezugspreis vorn und erfüllt Lieferfrist sowie Qualität, begründest du deinen Zuschlag mit beiden Ebenen.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 182, 214)}${badge(36, 40, 1)}${label(112, 44, "1 · Preis (netto)", "heading")}${pill(26, 70, 158, 26, "Listenpreis netto", "v-soft-fill", "micro")}${pill(26, 102, 158, 26, "− Sofortrabatt (%)", "v-orange-fill", "micro")}${pill(26, 134, 158, 28, "= Bezugspreis netto", "v-teal-fill", "micro")}${lines(105, 194, "A vs. B auf Netto-Basis\ngenau vergleichen", "micro")}`,
      ) +
      arrow(198, 124, 216, 124) +
      group(
        2,
        `${card(218, 18, 176, 214)}${badge(240, 40, 2)}${label(312, 44, "2 · Qualität", "heading")}${pill(232, 70, 148, 28, "Materialgüte", "v-blue-fill", "micro")}${pill(232, 106, 148, 28, "Lieferzeit & Treue", "v-blue-fill", "micro")}${pill(232, 142, 148, 28, "Umwelt & Service", "v-blue-fill", "micro")}${lines(306, 194, "Verzögerung kostet oft\nmehr als kleiner Rabatt", "micro")}`,
      ) +
      arrow(396, 124, 414, 124) +
      group(
        3,
        `${card(416, 18, 170, 214)}${badge(438, 40, 3)}${label(506, 44, "3 · Zuschlag", "heading")}${shield(501, 98, 0.85, "v-green")}${pill(430, 142, 142, 28, "Preis + Qualität klar", "v-green-fill", "micro")}${lines(501, 194, "Entscheidung mit Zahlen\nund Argumenten belegen", "micro")}`,
      ),
  },

  "pp-einkauf-werkstoffe": {
    title: "Einkauf von Werkstoffen aufwandsorientiert buchen",
    question: "Warum buchen wir den geminderten Nettobetrag nach Rabatt direkt auf AWR–AWB?",
    alt: "Links Eingangsrechnung mit Sofortrabatt (gebucht wird direkt das geminderte Netto), in der Mitte Soll-Buchung auf Aufwandskonto plus 19 Prozent VORST, rechts Haben-Buchung auf VE, BK oder KA über den Bruttobetrag.",
    caption: "Sofortrabatte mindern sofort den Warenwert auf der Rechnung und bekommen in der Buchführung kein eigenes Konto.",
    parts: [
      {
        label: "Sofortrabatt direkt abziehen",
        note: "Rechne zuerst Listenpreis netto minus Sofortrabatt = geminderter Warenwert netto. Nur dieser geminderte Betrag wird gebucht.",
      },
      {
        label: "Soll: AWR–AWB + VORST",
        note: "Im Soll stehen das passende Aufwandskonto (AWR, AWF, AWH oder AWB) mit dem Nettobetrag und VORST mit 19 % darauf.",
      },
      {
        label: "Haben: VE, BK oder KA",
        note: "Im Haben steht der Bruttorechnungsbetrag: beim Zielkauf auf Verbindlichkeiten (VE), bei Sofortzahlung auf BK oder KA.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Vorrechnen", "heading")}${receiptDoc(28, 66, 146, 108, "EINGANGSRECHNUNG", [
          "Liste:     4.000,00 €",
          "− 10 % Rab.: − 400 €",
          "= Netto:   3.600,00 €",
          "+ 19 % USt:  684,00 €",
        ])}${lines(101, 200, "Rabatt sofort abziehen!", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 184, 214)}${badge(234, 40, 2)}${label(308, 45, "Sollseite", "heading")}${pill(226, 74, 156, 30, "AWR / AWF / AWH / AWB", "v-orange-fill", "micro")}${pill(226, 112, 156, 26, "Netto: 3.600,00 €", "v-soft-fill", "micro")}${pill(226, 146, 156, 28, "+ VORST 684,00 €", "v-blue-fill", "micro")}${lines(304, 198, "Aufwand + Vorsteuer\nimmer netto + 19 %", "micro")}`,
      ) +
      arrow(398, 124, 418, 124) +
      group(
        3,
        `${card(420, 18, 166, 214)}${badge(442, 40, 3)}${label(506, 45, "Habenseite", "heading")}${pill(434, 78, 138, 32, "an VE / BK / KA", "v-coral-fill", "micro")}${pill(434, 122, 138, 32, "Brutto: 4.284,00 €", "v-accent-fill", "micro")}${lines(499, 192, "auf Ziel → VE\nBank/Bar → BK / KA", "micro")}`,
      ),
  },

  "pp-verkauf-fe": {
    title: "Verkauf eigener Fertigerzeugnisse buchen",
    question: "Auf welcher Seite stehen beim Verkauf Forderungen (FO), UEFE und UST?",
    alt: "Links die geminderte Ausgangsrechnung an einen Fahrradhändler, in der Mitte die Soll-Buchung auf FO, BK oder KA über den Bruttobetrag, rechts die Haben-Buchung auf UEFE (netto) und UST (19 Prozent).",
    caption: "Beim Verkauf nimmt der Betrieb Geld oder eine Forderung (brutto) ein — Ertrag auf UEFE ist jedoch stets der Nettoerlös.",
    parts: [
      {
        label: "Ausgangsrechnung nach Rabatt",
        note: "Gewährt das Radwerk einem Händler Sofortrabatt, wird auch im Verkauf direkt vom geminderten Nettoerlös ausgegangen.",
      },
      {
        label: "Soll: FO, BK oder KA (brutto)",
        note: "Beim Verkauf auf Ziel steigt unsere Forderung (FO im Soll); zahlt der Kunde sofort, steigen BK oder KA mit dem Bruttobetrag.",
      },
      {
        label: "Haben: UEFE (netto) + UST",
        note: "Der Netto-Verkaufserlös mehrt das Ertragskonto UEFE im Haben; die 19 % Umsatzsteuer fließen ins passive Konto UST im Haben.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Ausgangsbeleg", "heading")}${receiptDoc(28, 66, 146, 108, "AUSGANGSRECHNUNG", [
          "10 Jugendräder netto",
          "− Sofortrabatt",
          "= Netto:   5.000,00 €",
          "+ 19 % USt:  950,00 €",
        ])}${lines(101, 200, "Brutto = 5.950,00 €", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Sollseite", "heading")}${pill(228, 78, 144, 32, "FO (auf Ziel) / BK / KA", "v-teal-fill", "micro")}${pill(228, 122, 144, 32, "Brutto: 5.950,00 €", "v-blue-fill", "micro")}${lines(300, 190, "Kunde schuldet oder\nzahlt den Gesamtbetrag", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Habenseite", "heading")}${pill(428, 76, 142, 30, "an UEFE  5.000,00 €", "v-green-fill", "micro")}${pill(428, 118, 142, 30, "an UST     950,00 €", "v-gold-fill", "micro")}${lines(499, 190, "Nettoerlös = Ertrag\nUST ans Finanzamt", "micro")}`,
      ),
  },

  "pp-verkaufsbeleg": {
    title: "Aufbau und Buchung einer Ausgangsrechnung",
    question: "Wie rechnest du vom Einzelpreis über den Rabatt bis zum Rechnungsbetrag?",
    alt: "Vergrößerte Ausgangsrechnung in drei Rechenschritten: Position Menge mal Einzelpreis ergibt Listenpreis, minus Sofortrabatt ergibt Warenwert netto (100 %), plus 19 % USt ergibt Rechnungsbetrag brutto für die Buchung FO an UEFE / UST.",
    caption: "Rechne Zeile für Zeile von oben nach unten; Zwischensummen im Beleg liefern sofort die Beträge für den Buchungssatz.",
    parts: [
      {
        label: "1 · Positionszeile",
        note: "Multipliziere die gelieferte Stückzahl mit dem Netto-Einzelpreis (Menge × Einzelpreis = Listenpreis netto).",
      },
      {
        label: "2 · Rabatt & Warenwert netto",
        note: "Ziehe den Sofortrabatt vom Listenpreis ab. Der verbleibende Warenwert netto (100 %) ist der Betrag für UEFE.",
      },
      {
        label: "3 · + 19 % USt = Brutto",
        note: "Berechne 19 % Umsatzsteuer auf den geminderten Warenwert netto (Betrag für UST). Netto + USt = Rechnungsbetrag brutto für FO.",
      },
    ],
    draw: () =>
      card(14, 16, 266, 218, "v-soft-fill", 16) +
      receiptDoc(32, 26, 230, 198, "RADWERK BRENNER · AUSGANGSRECHNUNG", [
        "12 × Jugendrad Alu à 250 €  3.000,00 €",
        "− 10 % Sofortrabatt          − 300,00 €",
        "= Warenwert netto (100 %)   2.700,00 €",
        "+ 19 % Umsatzsteuer            513,00 €",
        "= Rechnungsbetrag brutto    3.213,00 €",
      ]) +
      group(
        1,
        `${arrow(264, 62, 308, 52)}${card(312, 20, 274, 58)}${badge(334, 49, 1)}${lines(358, 42, "Positionswert = Menge × Einzelpreis\nZwischensumme vor Rabatt prüfen", "micro", "start")}`,
      ) +
      group(
        2,
        `${arrow(264, 114, 308, 120)}${card(312, 90, 274, 62)}${badge(334, 121, 2)}${lines(358, 112, "− Sofortrabatt = Warenwert netto\n→ dieser Wert steht im Haben auf UEFE", "micro", "start")}`,
      ) +
      group(
        3,
        `${arrow(264, 166, 308, 190)}${card(312, 164, 274, 66)}${badge(334, 197, 3)}${lines(358, 186, "+ 19 % USt (→ UST) = Brutto (→ FO)\nBuchung: FO an UEFE / UST", "micro", "start")}`,
      ),
  },

  "sg-eroeffnung": {
    title: "Bestandskonten aus der Eröffnungsbilanz eröffnen",
    question: "Wie gelangen alle Werte der Eröffnungsbilanz in die einzelnen T-Konten?",
    alt: "Links die Eröffnungsbilanz mit Aktiva und Passiva; Pfeile nach rechts übertragen die aktiven Posten (MA, Vorräte, BK) in das Soll aktiver T-Konten und die passiven Posten (EK, VE) in das Haben passiver T-Konten.",
    caption: "Eröffnungs- und Schlussbilanz sind spiegelverkehrt zu den Seiten? Nein — bei T-Konten übernimmt jedes Konto die Seite der Bilanz!",
    parts: [
      {
        label: "Eröffnungsbilanz (01.01.)",
        note: "Zu Beginn des Geschäftsjahres (bzw. Übertrag vom 31.12. des Vorjahres) stehen alle Bestände geordnet auf Aktiva und Passiva.",
      },
      {
        label: "Aktive Konten: AB im Soll",
        note: "Jeder Aktivposten (GR, MA, Vorräte, FO, BK, KA) erhält links im Soll seinen Anfangsbestand (AB).",
      },
      {
        label: "Passive Konten: AB im Haben",
        note: "Jeder Passivposten (EK, LBKV, KBKV, VE) erhält rechts im Haben seinen Anfangsbestand (AB).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 184, 214)}${badge(36, 40, 1)}${label(112, 44, "Eröffnungsbilanz", "heading")}${tAccountBox(
          26,
          62,
          160,
          132,
          "Bilanz 01.01.",
          ["MA   80.000", "Vorr. 15.000", "BK   25.000"],
          ["EK   90.000", "LBKV 20.000", "VE   10.000"],
        )}${label(106, 214, "Aktiva links · Passiva rechts", "micro")}`,
      ) +
      arrow(202, 86, 240, 68) +
      arrow(202, 160, 240, 176) +
      group(
        2,
        `${card(244, 18, 342, 100)}${badge(266, 40, 2)}${label(420, 44, "Aktive Bestandskonten: AB links (Soll)", "heading")}${tAccountBox(
          262,
          56,
          144,
          54,
          "MA",
          ["AB 80.000"],
          [],
          "v-soft-fill",
        )}${tAccountBox(424, 56, 144, 54, "BK", ["AB 25.000"], [], "v-soft-fill")}`,
      ) +
      group(
        3,
        `${card(244, 132, 342, 100)}${badge(266, 154, 3)}${label(420, 158, "Passive Bestandskonten: AB rechts (Haben)", "heading")}${tAccountBox(
          262,
          170,
          144,
          54,
          "EK",
          [],
          ["AB 90.000"],
          "v-soft-fill",
        )}${tAccountBox(424, 170, 144, 54, "VE", [], ["AB 10.000"], "v-soft-fill")}`,
      ),
  },

  "sg-grund-hauptbuch": {
    title: "Vom Beleg über das Grundbuch ins Hauptbuch",
    question: "Warum führt ein Unternehmen sowohl ein zeitliches Grundbuch als auch sachliche T-Konten?",
    alt: "Dreischritt der doppelten Buchführung: Beleg prüfen, Buchungssatz zeitlich im Grundbuch notieren, Beträge sachlich ins Soll und Haben der Hauptbuch-T-Konten übertragen.",
    caption: "Erst das Zusammenspiel sichert Übersicht: Das Grundbuch zeigt die Reihenfolge nach Datum, das Hauptbuch den aktuellen Kontostand.",
    parts: [
      {
        label: "1 · Beleg prüfen",
        note: "Rechnungen und Kontoauszüge liefern Datum, Betrag und Inhalt — nach GoB erfolgt keine Buchung ohne Beleg.",
      },
      {
        label: "2 · Grundbuch (zeitlich)",
        note: "Im Grundbuch stehen alle Geschäftsvorfälle Tag für Tag chronologisch als Buchungssätze („Soll an Haben“).",
      },
      {
        label: "3 · Hauptbuch (sachlich)",
        note: "Jeder Posten wandert aus dem Grundbuch sachlich geordnet auf das jeweilige T-Konto (Sollseite beim Sollkonto, Habenseite beim Habenkonto).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 170, 214)}${badge(36, 40, 1)}${label(100, 45, "1 · Beleg", "heading")}${receiptDoc(32, 66, 134, 106, "RECHNUNG #207", [
          "15.11. · Rohstoffe",
          "Netto:  1.000,00 €",
          "+ VORST:  190,00 €",
          "Brutto: 1.190,00 €",
        ])}${lines(99, 200, "Datum & Beträge\nprüfen und ordnen", "micro")}`,
      ) +
      arrow(186, 124, 204, 124) +
      group(
        2,
        `${card(206, 18, 186, 214)}${badge(228, 40, 2)}${label(300, 45, "2 · Grundbuch", "heading")}${receiptDoc(220, 66, 158, 106, "ZEITLICHE FOLGE", [
          "15.11. AWR   1.000 €",
          "       VORST   190 €",
          "    an VE    1.190 €",
        ])}${lines(299, 200, "chronologisch als\nBuchungssatz notiert", "micro")}`,
      ) +
      arrow(394, 124, 412, 124) +
      group(
        3,
        `${card(414, 18, 172, 214)}${badge(436, 40, 3)}${label(502, 45, "3 · Hauptbuch", "heading")}${tAccountBox(
          426,
          64,
          148,
          56,
          "AWR",
          ["1.000"],
          [],
          "v-soft-fill",
        )}${tAccountBox(426, 126, 148, 56, "VE", [], ["1.190"], "v-soft-fill")}${lines(500, 204, "Übertrag auf alle\nbetroffenen T-Konten", "micro")}`,
      ),
  },

  "sg-guv-abschluss": {
    title: "Erfolgskonten über das GuV-Konto abschließen",
    question: "Auf welcher Seite landen Aufwendungen, Erträge und der Reingewinn im GuV-Konto?",
    alt: "Links wandern die Aufwandskonten AWR bis AWB in die Soll-Seite des GUV-Kontos, rechts wandert UEFE in die Haben-Seite des GUV-Kontos; der Reingewinn gleicht als Saldo die Sollseite aus.",
    caption: "Aufwandskonten und Ertragskonten haben keinen Schlussbestand für die Bilanz — sie sammeln nur Erfolg und leeren sich über GUV.",
    parts: [
      {
        label: "Aufwand → GUV Soll",
        note: "Aufwendungen werden im Soll gesammelt und beim Abschluss über das Haben geleert: GUV an AWR / AWF / AWH / AWB.",
      },
      {
        label: "Ertrag → GUV Haben",
        note: "Umsatzerlöse (UEFE) stehen im Haben und schließen über das Soll ab: UEFE an GUV.",
      },
      {
        label: "Reingewinn / Reinverlust",
        note: "Übersteigen die Erträge im GuV-Haben die Aufwendungen im GuV-Soll, entsteht ein Reingewinn (Saldo im Soll des GUV → an EK).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 176, 214)}${badge(36, 40, 1)}${label(104, 45, "Aufwandskonten", "heading")}${pill(26, 72, 152, 28, "AWR  45.000 €", "v-orange-fill", "micro")}${pill(26, 106, 152, 28, "AWF  20.000 €", "v-orange-fill", "micro")}${pill(26, 140, 152, 28, "AWH / AWB  5.000 €", "v-coral-fill", "micro")}${lines(102, 198, "GUV an Aufwandskonten\n(Summe 70.000 €)", "micro")}`,
      ) +
      arrow(192, 108, 224, 108) +
      group(
        3,
        `${card(226, 18, 170, 214)}${badge(248, 40, 3)}${label(314, 45, "GUV-Konto", "heading")}${tAccountBox(
          236,
          64,
          150,
          118,
          "GUV",
          ["AWR 45.000", "AWF 20.000", "AWH/B 5.000", "Gewinn 20.000"],
          ["UEFE 90.000"],
          "v-soft-fill",
        )}${lines(311, 206, "Gewinn im GUV-Soll\n(Ertrag > Aufwand)", "micro")}`,
      ) +
      arrow(430, 108, 398, 108) +
      group(
        2,
        `${card(432, 18, 154, 214)}${badge(454, 40, 2)}${label(512, 45, "Ertragskonto", "heading")}${pill(444, 78, 130, 34, "UEFE 90.000 €", "v-green-fill", "micro")}${pill(444, 126, 130, 34, "UEFE an GUV", "v-teal-fill", "micro")}${lines(509, 198, "Erträge wandern ins\nGUV-Haben", "micro")}`,
      ),
  },

  "sg-eigenkapital-nahtstelle": {
    title: "Eigenkapital als Nahtstelle zwischen GuV und SBK",
    question: "Wie verbindet das Konto EK die Erfolgsrechnung (GuV) mit der Schlussbilanz (SBK)?",
    alt: "Flussdiagramm vom GUV über das T-Konto EK ins SBK: oben GUV an EK bei Reingewinn (EK wächst im Haben), Mitte EK an GUV bei Reinverlust (EK sinkt im Soll), rechts EK an SBK über den neuen Endbestand.",
    caption: "Erst das Eigenkapitalkonto übernimmt das Jahresergebnis aus GUV und liefert danach seinen neuen Endbestand ins Schlussbilanzkonto.",
    parts: [
      {
        label: "Reingewinn → EK Haben",
        note: "Ein Reingewinn mehrt das passive Konto Eigenkapital im Haben: GUV an EK.",
      },
      {
        label: "Reinverlust → EK Soll",
        note: "Ein Reinverlust mindert das passive Konto Eigenkapital im Soll: EK an GUV.",
      },
      {
        label: "Endbestand EK → SBK",
        note: "Nach Übernahme des Gewinns oder Verlusts schließt das Konto EK seinen neuen Schlussbestand ab: EK an SBK.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 100)}${badge(36, 40, 1)}${label(106, 44, "Reingewinn (+)", "heading")}${pill(26, 64, 150, 36, "GUV an EK", "v-green-fill", "small")}`,
      ) +
      group(
        2,
        `${card(14, 132, 174, 100)}${badge(36, 154, 2)}${label(106, 158, "Reinverlust (−)", "heading")}${pill(26, 178, 150, 36, "EK an GUV", "v-coral-fill", "small")}`,
      ) +
      arrow(190, 74, 218, 102) +
      arrow(190, 176, 218, 146) +
      group(
        3,
        `${tAccountBox(
          222,
          24,
          184,
          202,
          "EK (Nahtstelle)",
          ["− Verlust", "SB → SBK", "", "Summe"],
          ["AB 180.000", "+ Gewinn", "", "Summe"],
          "v-panel",
        )}${arrow(408, 124, 434, 124)}${card(436, 36, 150, 176)}${badge(458, 58, 3)}${label(516, 62, "→ SBK", "heading")}${pill(448, 86, 126, 34, "EK an SBK", "v-blue-fill", "small")}${lines(511, 152, "neues EK wandert\nin die Schlussbilanz", "micro")}`,
      ),
  },

  "sg-sbk-schlussbilanz": {
    title: "Von den Bestandskonten über das SBK zur Schlussbilanz",
    question: "Warum stehen im SBK die aktiven Schlussbestände links und die passiven rechts?",
    alt: "Links wandern aktive Bestandskonten über SBK an Aktivkonto ins SBK-Soll; rechts wandern passive Bestandskonten inklusive neuem EK über Passivkonto an SBK ins SBK-Haben; unten entsteht daraus die gegliederte Schlussbilanz.",
    caption: "Beim Abschluss der Bestandskonten tauschen Soll und Haben nur rechnerisch — im SBK stimmen die Seiten schon wieder mit der Bilanz überein.",
    parts: [
      {
        label: "Aktiva → SBK Soll",
        note: "Alle aktiven Bestandskonten (MA, Vorräte, FO, BK, KA) schließen mit ihrem Schlussbestand ins SBK-Soll ab: SBK an Aktivkonto.",
      },
      {
        label: "Passiva → SBK Haben",
        note: "Alle passiven Bestandskonten (inklusive neuem EK, LBKV, VE) schließen ins SBK-Haben ab: Passivkonto an SBK.",
      },
      {
        label: "Schlussbilanz 31.12.",
        note: "Aus dem Sammelkonto SBK wird für den Geschäftsbericht die übersichtlich gegliederte Schlussbilanz erstellt (Aktiva = Passiva).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 180, 162)}${badge(36, 40, 1)}${label(112, 44, "Aktive Konten", "heading")}${pill(26, 68, 156, 28, "MA · Vorräte · FO · BK", "v-blue-fill", "micro")}${pill(26, 104, 156, 28, "SBK an Aktivkonto", "v-teal-fill", "micro")}${label(104, 160, "→ im SBK links (Soll)", "micro")}`,
      ) +
      arrow(196, 98, 218, 98) +
      group(
        3,
        `${tAccountBox(
          220,
          18,
          162,
          162,
          "SBK 31.12.",
          ["MA   80.000", "Vorr. 12.000", "BK   48.000"],
          ["EK  105.000", "VE   35.000", ""],
          "v-panel",
        )}${card(14, 188, 572, 48, "v-soft-fill", 12)}${badge(40, 212, 3)}${label(312, 217, "Schlussbilanz = geordnete Reinschrift des SBK · Summe Aktiva = Summe Passiva", "small")}`,
      ) +
      arrow(404, 98, 384, 98) +
      group(
        2,
        `${card(406, 18, 180, 162)}${badge(428, 40, 2)}${label(504, 44, "Passive Konten", "heading")}${pill(418, 68, 156, 28, "EK (neu) · LBKV · VE", "v-green-fill", "micro")}${pill(418, 104, 156, 28, "Passivkonto an SBK", "v-orange-fill", "micro")}${label(496, 160, "→ im SBK rechts (Haben)", "micro")}`,
      ),
  },

  "sg-bilanzvergleich": {
    title: "Eröffnungs- und Schlussbilanz vergleichen",
    question: "Was verrät der Jahresvergleich über Wachstum, Erfolg und Finanzierung des Betriebs?",
    alt: "Vergleich von Eröffnungsbilanz am 01.01. und Schlussbilanz am 31.12.: links Entwicklung von Anlage- und Umlaufvermögen, in der Mitte Veränderung von Eigenkapital und Schulden, rechts Beurteilung von Eigenkapitalquote und Liquidität.",
    caption: "Steigt das Eigenkapital (ohne private Einlagen), hat das Radwerk profitabel gewirtschaftet; die Schulden zeigen, wie investiert wurde.",
    parts: [
      {
        label: "Vermögensstruktur (Aktiva)",
        note: "Neue Maschinen lassen das Anlagevermögen steigen; Vorräte, Forderungen und Bankguthaben verändern das Umlaufvermögen.",
      },
      {
        label: "Kapitalstruktur (Passiva)",
        note: "Der Vergleich des Eigenkapitals zeigt den Jahreserfolg; veränderte Darlehen und VE zeigen den Finanzierungsweg.",
      },
      {
        label: "Stabilität beurteilen",
        note: "Eine steigende Eigenkapitalquote (EK : Bilanzsumme) und ausreichend flüssige Mittel auf BK sichern die Krisenfestigkeit.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 182, 214)}${badge(36, 40, 1)}${label(112, 44, "01.01. → 31.12. Aktiva", "heading")}<rect x="44" y="88" width="44" height="82" rx="4" class="v-teal"/><rect x="114" y="68" width="44" height="102" rx="4" class="v-blue"/>${label(66, 188, "01.01.", "micro")}${label(136, 188, "31.12.", "micro")}${lines(105, 212, "AV & UV: Investition?", "micro")}`,
      ) +
      group(
        2,
        `${card(210, 18, 182, 214)}${badge(232, 40, 2)}${label(308, 44, "Kapital (EK / FK)", "heading")}<rect x="240" y="96" width="44" height="74" rx="4" class="v-green"/><rect x="310" y="72" width="44" height="98" rx="4" class="v-green"/>${label(262, 188, "EK alt", "micro")}${label(332, 188, "EK neu", "micro")}${lines(301, 212, "Δ EK zeigt Gewinn!", "micro")}`,
      ) +
      group(
        3,
        `${card(406, 18, 180, 214)}${badge(428, 40, 3)}${label(504, 44, "Auswertung", "heading")}${pill(420, 74, 152, 30, "EK-Quote = EK : Summe", "v-blue-fill", "micro")}${pill(420, 112, 152, 30, "Mehr Bank = liquider", "v-teal-fill", "micro")}${lines(496, 182, "Stabilität, Wachstum\nund Schuldenstand prüfen", "micro")}`,
      ),
  },

  "sg-inventurdifferenzen": {
    title: "Sollbestand laut Buchführung vs. Istbestand laut Inventur",
    question: "Wie unterscheidest du Fehlbestand und Mehrbestand — und wie entstehen sie?",
    alt: "Links der rechnerische Sollbestand aus der Buchführung, in der Mitte der gezählte Istbestand im Lager, rechts der Abgleich: Ist kleiner Soll bedeutet Fehlbestand (z. B. Schwund), Ist größer Soll bedeutet Mehrbestand.",
    caption: "Inventurdifferenzen zeigen Buchungsfehler oder Lagerschäden auf; Buchführung wird danach auf den realen Istbestand korrigiert.",
    parts: [
      {
        label: "Sollbestand (Buchwert)",
        note: "Anfangsbestand laut Buchführung plus dokumentierte Zugänge minus erfasste Abgänge ergeben den rechnerischen Sollbestand.",
      },
      {
        label: "Istbestand (Zählung)",
        note: "Die tatsächliche Inventur im Lager misst, zählt und wiegt am Jahresende die wirklich vorhandenen Stücke.",
      },
      {
        label: "Fehl- vs. Mehrbestand",
        note: "Ist < Soll = Fehlbestand (Schwund, Bruch, versehentlicher Doppelabgang). Ist > Soll = Mehrbestand (z. B. vergessener Zugang oder Zahlendreher).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Soll (Konto)", "heading")}${receiptDoc(34, 68, 134, 96, "BUCHBESTAND", [
          "AB + Zugänge",
          "− Abgänge",
          "= 120 St. (Soll)",
        ])}${lines(101, 198, "rechnerischer Bestand\nin der Buchführung", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Ist (Lager)", "heading")}${factory(300, 96, 0.78)}${pill(232, 138, 136, 28, "Zählung: z. B. 114 St.", "v-teal-fill", "micro")}${lines(300, 198, "tatsächlich am\nBilanzstichtag gezählt", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Abgleich", "heading")}${pill(426, 72, 146, 36, "Ist < Soll: Fehlbestand", "v-coral-fill", "micro")}${pill(426, 118, 146, 36, "Ist > Soll: Mehrbestand", "v-green-fill", "micro")}${lines(499, 192, "Ursache klären und\nBuchbestand berichtigen", "micro")}`,
      ),
  },
};
