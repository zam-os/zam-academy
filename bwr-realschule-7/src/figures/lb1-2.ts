import {
  arrow,
  badge,
  bike,
  card,
  coins,
  type ConceptFigure,
  factory,
  group,
  house,
  label,
  lines,
  person,
  pill,
  receiptDoc,
  shield,
} from "./draw";

export const LB1_2_FIGURES: Record<string, ConceptFigure> = {
  "hh-einkommen-budget": {
    title: "Monatsbudget der Familie Weber",
    question: "Wie bleibt am Monatsende ein Sparpolster statt einer Lücke?",
    alt: "Drei Schritte der Budgetplanung aus dem Lektionsbeispiel von Familie Weber: links 3.400,00 € Einnahmen (3.150 € Gehälter + 250 € Kindergeld), in der Mitte 2.100,00 € feste und 1.050,00 € veränderliche Ausgaben (zusammen 3.150,00 €), rechts 250,00 € monatlicher Überschuss als Sparpolster.",
    caption:
      "Zahlen aus dem Lektionsbeispiel der Familie Weber (3.400 € Einnahmen − 3.150 € Ausgaben = 250 € Überschuss); im Labor unten erprobst du ein weiteres Monatsmodell mit 3.600 € Einkommen und 10 % Sparziel.",
    parts: [
      {
        label: "Einnahmen",
        note: "Lohn, Gehalt, Kindergeld oder Taschengeld bilden die Obergrenze des monatlichen Haushaltsbudgets.",
      },
      {
        label: "Ausgaben prüfen",
        note: "Feste Ausgaben (Miete, Strom, Verträge) binden langfristig; veränderliche Ausgaben und Wünsche steuerst du im Alltag.",
      },
      {
        label: "Saldo & Rücklage",
        note: "Einnahmen minus Ausgaben ergibt den Saldo. Ein positiver Überschuss bildet das Sparpolster und schützt vor Überschuldung.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Einnahmen", "heading")}${coins(101, 102, 1.15)}<rect x="34" y="152" width="134" height="22" rx="6" class="v-green"/>${label(101, 167, "3.400,00 €", "micro on-fill")}${lines(101, 196, "Gehalt · Kindergeld\nmonatlicher Zufluss", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Ausgaben", "heading")}${house(266, 98, 0.72)}${pill(302, 74, 72, 24, "Fest 2.100 €", "v-coral-fill", "micro")}${pill(302, 106, 72, 24, "Var. 1.050 €", "v-orange-fill", "micro")}<rect x="232" y="152" width="89" height="22" rx="5" class="v-coral"/><rect x="323" y="152" width="45" height="22" rx="5" class="v-orange"/>${lines(300, 196, "Miete, Strom, Einkauf\nund Zusatzwünsche", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Saldo & Ziel", "heading")}${shield(499, 98, 0.9, "v-teal")}${pill(430, 148, 138, 28, "+ 250,00 € Rücklage", "v-teal-fill", "micro")}${lines(499, 196, "Rücklage hält Luft\nfür Notfälle frei", "micro")}`,
      ),
  },

  "hh-konsum": {
    title: "Vor dem Kauf: Einflüsse und Prüfkriterien",
    question: "Woran erkennst du, ob ein Kauf zu deinem Budget und Bedarf passt?",
    alt: "Links Kaufimpulse wie Werbung und Trends, in der Mitte drei Prüffragen zu Bedarf, Budget und Qualität, rechts eine bewusste Kaufentscheidung.",
    caption: "Zwischen Kaufwunsch und Kasse hilft eine kurze Pause mit klaren Prüffragen gegen spontane Fehlkäufe.",
    parts: [
      {
        label: "Kaufimpulse",
        note: "Rabatt-Timer, Influencer-Werbung und Gruppendruck wecken Wünsche, ohne dass sofort ein echter Bedarf dahintersteht.",
      },
      {
        label: "Drei Prüffragen",
        note: "Brauche ich es wirklich? Passt der Preis in meinen Monatsplan? Sind Qualität, Folgekosten und Umweltwirkung stimmig?",
      },
      {
        label: "Kluge Wahl",
        note: "Nach dem Vergleich kaufst du gezielt — oder verzichtest bewusst und sparst das Geld für ein wichtigeres Ziel.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Kaufimpulse", "heading")}${pill(32, 74, 138, 28, "„Nur heute −30 %!“", "v-coral-fill", "micro")}${pill(32, 112, 138, 28, "Werbung & Vorbilder", "v-orange-fill", "micro")}${pill(32, 150, 138, 28, "Alle haben es schon", "v-purple-fill", "micro")}${lines(101, 200, "äußere Reize drängen\nzum Spontankauf", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Prüffilter", "heading")}${pill(228, 74, 144, 28, "1. Echter Bedarf?", "v-blue-fill", "micro")}${pill(228, 112, 144, 28, "2. Budget reicht?", "v-blue-fill", "micro")}${pill(228, 150, 144, 28, "3. Haltbar & fair?", "v-blue-fill", "micro")}${lines(300, 200, "eine Nacht warten\nund Angebote prüfen", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Entscheidung", "heading")}${shield(462, 106, 0.85, "v-green")}${bike(522, 108, 0.72)}${pill(432, 150, 134, 28, "Geplant · statt Impuls", "v-green-fill", "micro")}${lines(499, 200, "Geld bleibt für\ndas echte Ziel frei", "micro")}`,
      ),
  },

  "hh-belege": {
    title: "Kassenbon und Quittung systematisch prüfen",
    question: "Welche Angaben kontrollierst du zuerst, damit Fehler nicht unbemerkt bleiben?",
    alt: "Vergrößerter Kassenbon mit drei Prüfbereichen: oben Händler und Datum, in der Mitte Artikel, Mengen, Preise und 7 oder 19 Prozent Steuer, unten Summe, bezahlter Betrag und Rückgeld.",
    caption: "Belege zeigen dir Preise, Steuersätze und Zahlbetrag — und sichern Umtausch oder Garantie.",
    parts: [
      {
        label: "Kopf & Datum",
        note: "Name und Anschrift des Geschäfts sowie Kaufdatum belegen, wann und wo du gekauft hast (wichtig für Umtausch und Gewährleistung).",
      },
      {
        label: "Positionen & USt",
        note: "Stimmen Stückzahl und Einzelpreis? Lebensmittel tragen meist 7 % USt, Sportartikel und Technik 19 % USt.",
      },
      {
        label: "Summe & Rückgeld",
        note: "Addiere die Posten und vergleiche den bezahlten Betrag minus Gesamtsumme mit dem ausgehändigten Rückgeld.",
      },
    ],
    draw: () =>
      card(16, 16, 260, 218, "v-soft-fill", 16) +
      receiptDoc(38, 28, 216, 194, "RADSPORT & HOBBY · KASSENBON", [
        "21.11.2026 · 14:32 · Bon #418",
        "2 × Trinkflasche à 6,50 €   13,00 €",
        "1 × Müsliriegel (7 %)        2,00 €",
        "Summe brutto (19 % / 7 %)   15,00 €",
        "Gegeben bar:                20,00 €",
        "Rückgeld:                    5,00 €",
      ]) +
      group(
        1,
        `${arrow(260, 62, 304, 52)}${card(310, 22, 274, 58)}${badge(332, 51, 1)}${lines(356, 45, "Aussteller, Ort und Kaufdatum\nbelegen den Garantieanspruch", "micro", "start")}`,
      ) +
      group(
        2,
        `${arrow(260, 114, 304, 122)}${card(310, 92, 274, 62)}${badge(332, 123, 2)}${lines(356, 114, "Menge × Einzelpreis prüfen\nund Steuersatz (7 % / 19 %) beachten", "micro", "start")}`,
      ) +
      group(
        3,
        `${arrow(260, 174, 304, 194)}${card(310, 166, 274, 62)}${badge(332, 197, 3)}${lines(356, 188, "Summe − Gegeben = Rückgeld\nBon für Umtausch aufbewahren", "micro", "start")}`,
      ),
  },

  "hh-zahlungsverkehr": {
    title: "Vier Zahlungswege im Alltag",
    question: "Wann überweist du aktiv selbst und wann bucht der Empfänger per Lastschrift ab?",
    alt: "Drei Gruppen des Zahlungsverkehrs: Barzahlung und Girocard vor Ort, aktive Überweisung vom Konto über IBAN, sowie SEPA-Lastschrift mit 8 Wochen oder 13 Monaten Rückgaberecht.",
    caption: "Je nach Situation unterscheiden sich Kostenüberblick, Tempo und Schutz bei Fehlabbuchungen.",
    parts: [
      {
        label: "Bar & Karte",
        note: "Bargeld macht Beträge sofort greifbar; Girocard (Debit) bucht direkt vom Girokonto ab. Kreditkarten bündeln meist monatlich.",
      },
      {
        label: "Überweisung",
        note: "Du stößt die Zahlung selbst aktiv per IBAN an — ideal für Rechnungen und Überweisungen ohne automatischen Einzug.",
      },
      {
        label: "SEPA-Lastschrift",
        note: "Mit einem Mandat darf der Anbieter fällige Beträge einziehen. Autorisierte Abbuchungen kannst du 8 Wochen, unberechtigte 13 Monate zurückholen.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Bar & Karte", "heading")}${coins(101, 90, 0.9)}<rect x="44" y="122" width="114" height="44" rx="7" class="v-blue"/><rect x="54" y="132" width="18" height="12" rx="2" class="v-gold"/>${label(116, 152, "PIN / NFC", "micro on-fill")}${lines(101, 194, "Sofort im Laden\ndirekt spürbar", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Überweisung", "heading")}${pill(234, 72, 132, 30, "Konto · Zahler", "v-teal-fill", "micro")}${arrow(300, 106, 300, 134)}${pill(234, 138, 132, 30, "IBAN · Empfänger", "v-blue-fill", "micro")}${lines(300, 194, "du löst aktiv aus\nvolle Terminkontrolle", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Lastschrift", "heading")}${shield(499, 98, 0.85, "v-green")}${pill(430, 140, 138, 28, "Mandat · Einzug", "v-orange-fill", "micro")}${lines(499, 194, "Rückgabe: 8 Wochen\nohne Mandat: 13 Mon.", "micro")}`,
      ),
  },

  "hh-prozent-grundlagen": {
    title: "Grundwert G, Prozentsatz p und Prozentwert P",
    question: "Wie hängen das Ganze (100 %), der Anteil in % und der Eurobetrag zusammen?",
    alt: "Ein Balken zeigt den Grundwert G als 100 Prozent (2.500 €), darunter den herausgegriffenen Anteil p (12 Prozent), der rechts über die Formel P gleich G mal p durch 100 zu 300 € wird.",
    caption: "Ordne jede Zahl zuerst eindeutig G, p oder P zu, bevor du rechnest.",
    parts: [
      {
        label: "Grundwert G (100 %)",
        note: "Der Grundwert G steht immer für das Ganze (100 %), auf das sich die Prozentangabe bezieht.",
      },
      {
        label: "Prozentsatz p %",
        note: "Der Prozentsatz p gibt den Anteil von Hundert an, zum Beispiel 12 % Sparquote vom Nettoeinkommen.",
      },
      {
        label: "Prozentwert P (€)",
        note: "Der Prozentwert P ist der gesuchte Teilbetrag in Euro: P = G · p : 100 (hier 2.500 € · 12 : 100 = 300 €).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 360, 102)}${badge(36, 40, 1)}${label(198, 45, "Grundwert G = 100 % (das Ganze)", "heading")}<rect x="34" y="66" width="320" height="32" rx="7" class="v-blue"/>${label(194, 87, "2.500,00 € Haushaltseinkommen = 100 %", "small on-fill")}`,
      ) +
      group(
        2,
        `${card(14, 132, 360, 100)}${badge(36, 154, 2)}${label(198, 159, "Prozentsatz p = Anteil von 100", "heading")}<rect x="34" y="180" width="320" height="32" rx="7" class="v-soft-fill"/><rect x="34" y="180" width="38.4" height="32" rx="5" class="v-teal"/>${label(80, 201, "12 % (= 300 €)", "small", "start")}${label(270, 201, "restliche 88 %", "micro")}`,
      ) +
      arrow(378, 86, 406, 106) +
      arrow(378, 174, 406, 146) +
      group(
        3,
        `${card(410, 18, 176, 214)}${badge(432, 40, 3)}${label(498, 45, "Prozentwert P", "heading")}${pill(430, 68, 136, 30, "P = G · p : 100", "v-accent-fill", "small")}${pill(430, 110, 136, 30, "p = P · 100 : G", "v-teal-fill", "micro")}${pill(430, 150, 136, 30, "G = P · 100 : p", "v-gold-fill", "micro")}${label(498, 208, "Ergebnis: 300,00 €", "small")}`,
      ),
  },

  "hh-prozent-aenderung": {
    title: "Verminderter und vermehrter Grundwert",
    question: "Warum sinkt oder steigt die Prozentzahl gegenüber dem ursprünglichen Grundwert G?",
    alt: "Links der alte Grundwert G mit 100 Prozent (400 €), oben rechts Abzug von 15 Prozent Rabatt auf 85 Prozent (340 €), unten rechts Aufschlag von 19 Prozent Umsatzsteuer auf 119 Prozent (476 €).",
    caption: "Statt zwei Rechenschritten rechnest du oft direkt mit dem neuen Prozentsatz (100 % − p % oder 100 % + p %).",
    parts: [
      {
        label: "Grundwert G (100 %)",
        note: "Der Ausgangswert vor Rabatt oder Aufschlag bildet immer die 100-%-Basis (hier 400,00 € für ein Jugendfahrrad).",
      },
      {
        label: "Vermindert (− p %)",
        note: "Bei 15 % Preisnachlass bezahlst du nur 100 % − 15 % = 85 % vom Grundwert: 400 € · 0,85 = 340,00 €.",
      },
      {
        label: "Vermehrt (+ p %)",
        note: "Bei 19 % Umsatzsteuer steigt der Betrag auf 100 % + 19 % = 119 % vom Netto-Grundwert: 400 € · 1,19 = 476,00 €.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 54, 174, 144)}${badge(36, 76, 1)}${label(101, 81, "Ausgangswert G", "heading")}${bike(101, 122, 0.72)}${pill(34, 154, 134, 28, "100 % = 400,00 €", "v-blue-fill", "small")}`,
      ) +
      arrow(192, 102, 232, 74) +
      arrow(192, 150, 232, 180) +
      group(
        2,
        `${card(236, 18, 350, 100)}${badge(258, 40, 2)}${label(414, 44, "Verminderter Grundwert (z. B. 15 % Rabatt)", "heading")}<rect x="258" y="62" width="260" height="24" rx="5" class="v-teal"/><rect x="518" y="62" width="46" height="24" rx="5" class="v-coral"/>${label(388, 79, "85 % zahlen = 340,00 €", "micro on-fill")}${label(410, 106, "100 % − 15 % = 85 %  (· 0,85)", "micro")}`,
      ) +
      group(
        3,
        `${card(236, 132, 350, 100)}${badge(258, 154, 3)}${label(414, 158, "Vermehrter Grundwert (z. B. + 19 % USt)", "heading")}<rect x="258" y="176" width="257" height="24" rx="5" class="v-blue"/><rect x="515" y="176" width="49" height="24" rx="5" class="v-gold"/>${label(386, 193, "100 % = 400 €", "micro on-fill")}${label(539.5, 193, "+19 %", "micro")}${label(410, 220, "100 % + 19 % = 119 %  (= 476,00 €)", "micro")}`,
      ),
  },

  "hh-infografiken": {
    title: "Infografiken auf Manipulation prüfen",
    question: "Wie täuscht eine abgeschnittene y-Achse bei exakt denselben Zahlen?",
    alt: "Vergleich zweier Säulendiagramme für 40 Stück im März und 50 Stück im April: links bei Achsenstart 0 wirkt April leicht höher, in der Mitte bei Achsenstart 36 wirkt April über dreimal so groß, rechts stehen vier Prüffragen.",
    caption: "Im Modell sind die Stückzahlen identisch (40 und 50) — nur der Achsenstart verändert den optischen Eindruck.",
    parts: [
      {
        label: "Achsenstart 0 (ehrlich)",
        note: "Beginnt die senkrechte Achse bei 0, entspricht die Balkenhöhe genau dem wahren Verhältnis 50 : 40 = 1,25 : 1.",
      },
      {
        label: "Abgeschnittene Achse",
        note: "Startet die Achse erst bei 36, schrumpft März optisch auf 4 Einheiten und April misst 14 — ein künstliches Verhältnis von 3,5 : 1.",
      },
      {
        label: "Vier Prüffragen",
        note: "Kontrolliere immer: Startet die Achse bei 0? Stimmen Quelle, Zeitraum und Stichprobengröße? Verzerrt 3D-Optik die Flächen?",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 180, 214)}${badge(36, 40, 1)}${label(112, 44, "Achse ab 0", "heading")}<line x1="48" y1="68" x2="48" y2="178" class="v-outline"/><line x1="48" y1="178" x2="174" y2="178" class="v-outline"/>${label(42, 180, "0", "micro", "end")}${label(42, 78, "50", "micro", "end")}<rect x="68" y="106" width="34" height="72" rx="3" class="v-teal"/><rect x="120" y="88" width="34" height="90" rx="3" class="v-blue"/>${label(85, 194, "40", "micro")}${label(137, 194, "50", "micro")}${label(104, 216, "echt 1,25 : 1", "small")}`,
      ) +
      group(
        2,
        `${card(208, 18, 184, 214)}${badge(230, 40, 2)}${label(308, 44, "Ab 36 (verzerrt)", "heading")}<line x1="242" y1="68" x2="242" y2="178" class="v-outline"/><line x1="242" y1="178" x2="368" y2="178" class="v-outline"/>${label(236, 180, "36", "micro", "end")}${label(236, 78, "50", "micro", "end")}<rect x="262" y="152" width="34" height="26" rx="3" class="v-orange"/><rect x="314" y="88" width="34" height="90" rx="3" class="v-coral"/>${label(279, 194, "40", "micro")}${label(331, 194, "50", "micro")}${label(300, 216, "optisch 3,50 : 1!", "small")}`,
      ) +
      group(
        3,
        `${card(406, 18, 180, 214)}${badge(428, 40, 3)}${label(504, 44, "Checkliste", "heading")}${pill(422, 68, 148, 28, "✓ Startwert bei 0?", "v-soft-fill", "micro")}${pill(422, 104, 148, 28, "✓ Gleicher Maßstab?", "v-soft-fill", "micro")}${pill(422, 140, 148, 28, "✓ Klare Quelle/Jahr?", "v-soft-fill", "micro")}${pill(422, 176, 148, 28, "✓ Keine 3D-Tricks?", "v-soft-fill", "micro")}`,
      ),
  },

  "un-wirtschaftsstruktur": {
    title: "Drei Wirtschaftsbereiche und Unternehmensgrößen",
    question: "Wie arbeiten Urproduktion, Fertigung und Dienstleistungen bis zum fertigen Rad zusammen?",
    alt: "Dreistufige Wertschöpfung: Sektor 1 Urproduktion gewinnt Bauxit für Aluminium, Sektor 2 Fertigungsbetrieb Radwerk Brenner baut das Jugendrad, Sektor 3 Fahrradhandel und Werkstatt verkaufen an Familien.",
    caption: "Das Radwerk Brenner gehört als Industriebetrieb zum sekundären Sektor und arbeitet mit Vorlieferern und Händlern zusammen.",
    parts: [
      {
        label: "Primärer Sektor",
        note: "Land-, Forst-, Fischereiwirtschaft und Bergbau gewinnen natürliche Rohstoffe (z. B. Holz oder Erze für Aluminium).",
      },
      {
        label: "Sekundärer Sektor",
        note: "Handwerk und Industrie verarbeiten Rohstoffe weiter — hier fertigt das mittelständische Radwerk Brenner Jugendfahrräder.",
      },
      {
        label: "Tertiärer Sektor",
        note: "Handel, Transport, Banken und IT erbringen Dienstleistungen und bringen das fertige Rad bis zur Familie Weber.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Primär · Roh", "heading")}<polygon points="48,142 88,82 118,118 136,96 160,142" class="v-teal"/><polygon points="88,82 78,98 98,98" class="v-paper"/>${lines(101, 172, "Urproduktion\nErze, Land & Forst", "micro")}${pill(36, 198, 130, 22, "KMU · Großbetrieb", "v-soft-fill", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Sekundär · Bau", "heading")}${factory(300, 108, 0.92)}${lines(300, 172, "Verarbeitung\nz. B. Radwerk Brenner", "micro")}${pill(234, 198, 132, 22, "Industrie & Handwerk", "v-blue-fill", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Tertiär · Dienst", "heading")}${bike(499, 104, 0.85)}${lines(499, 172, "Handel, Logistik\nBank & Beratung", "micro")}${pill(434, 198, 130, 22, "Weg zur Familie", "v-green-fill", "micro")}`,
      ),
  },

  "un-ziele-nachhaltigkeit": {
    title: "Ökonomische, ökologische und soziale Ziele",
    question: "Wie verbindet das Radwerk wirtschaftlichen Erfolg mit Umwelt und Belegschaft?",
    alt: "Dreieck der Unternehmensziele: oben ökonomische Ziele wie Gewinn und Qualität, links ökologische Ziele wie Solarstrom und langlebige Rahmen, rechts soziale Ziele wie Ausbildung und sichere Arbeitsplätze.",
    caption: "Nachhaltiges Wirtschaften wägt Zielkonflikte ab — zwischen billigstem Einkauf, Umweltschutz und guten Arbeitsbedingungen.",
    parts: [
      {
        label: "Ökonomische Ziele",
        note: "Ein Unternehmen muss zahlungsfähig bleiben, Gewinn erzielen und verlässliche Qualität zu wettbewerbsfähigen Preisen liefern.",
      },
      {
        label: "Ökologische Ziele",
        note: "Solarenergie auf der Halle, schadstoffarmer Lack, kurze Transportwege und recycelbare Rahmen schonen Ressourcen.",
      },
      {
        label: "Soziale Ziele",
        note: "Sichere Arbeitsplätze, faire Löhne und Ausbildungsplätze stärken Motivation und Zusammenhalt im Betrieb.",
      },
    ],
    draw: () =>
      `<polygon points="300,56 120,204 480,204" class="v-triangle"/>` +
      group(
        1,
        `${card(192, 16, 216, 74)}${badge(214, 38, 1)}${label(310, 42, "Ökonomisch", "heading")}${lines(300, 66, "Gewinn · Zahlungsfähigkeit · Qualität", "micro")}`,
      ) +
      group(
        2,
        `${card(20, 148, 250, 84)}${badge(42, 170, 2)}${label(150, 174, "Ökologisch", "heading")}${lines(145, 198, "Solarstrom · weniger Abfall\nlanglebige Werkstoffe", "micro")}`,
      ) +
      group(
        3,
        `${card(330, 148, 250, 84)}${badge(352, 170, 3)}${label(460, 174, "Sozial", "heading")}${lines(455, 198, "Arbeitssicherheit · faire Löhne\nAusbildungsplätze vor Ort", "micro")}`,
      ),
  },

  "un-produktionsfaktoren": {
    title: "Die vier betrieblichen Produktionsfaktoren",
    question: "Wie wirken ausführende Arbeit, dispositiver Faktor, Betriebsmittel und Werkstoffe zusammen?",
    alt: "Vier betriebliche Produktionsfaktoren im Radwerk Brenner: links die beiden menschlichen Faktoren (1. ausführende Arbeit in der Werkstatt und 2. dispositiver Faktor der Geschäftsleitung für Planung, Organisation und Kontrolle), in der Mitte 3. Betriebsmittel zum mehrjährigen Gebrauch (Halle, Schweißanlage, Fuhrpark), rechts 4. Werkstoffe zum Verbrauch (Alurohre, Schaltung, Lack, Strom).",
    caption:
      "Der Lehrplan unterscheidet vier Produktionsfaktoren: ausführende Arbeit, dispositiver Faktor (Geschäftsleitung/Planung), Betriebsmittel (Gebrauch) und Werkstoffe (Verbrauch).",
    parts: [
      {
        label: "Arbeit & dispositiver Faktor",
        note: "Ausführende Arbeit (Schweißen, Montage, Verkauf) und der dispositive Faktor (Geschäftsführung: Planen, Organisieren, Entscheiden) bilden zusammen die beiden menschlichen Produktionsfaktoren.",
      },
      {
        label: "Betriebsmittel (Gebrauch)",
        note: "Werkhalle, Schweißroboter, Werkzeuge und Lieferwagen ermöglichen die Herstellung und bleiben über Jahre im Betrieb.",
      },
      {
        label: "Werkstoffe (Verbrauch)",
        note: "Alurohre (Rohstoff), Bremsen (Fremdbauteile), Lack (Hilfsstoff) und Strom (Betriebsstoff) werden bei jedem Rad verbraucht.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(112, 45, "Arbeit & Leitung", "heading")}${person(78, 96, "v-blue")}${person(124, 96, "v-teal")}${pill(24, 112, 154, 28, "1. Ausführende Arbeit", "v-blue-fill", "micro")}${pill(24, 146, 154, 28, "2. Dispositiver Faktor", "v-teal-fill", "micro")}${lines(101, 196, "Montage & Verkauf (1)\nLeitung & Planung (2)", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "3. Betriebsmittel", "heading")}${factory(300, 102, 0.88)}${pill(232, 142, 136, 26, "Gebrauch · längerfristig", "v-blue-fill", "micro")}${lines(300, 194, "Halle, Maschinen,\nFuhrpark, Büromöbel", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "4. Werkstoffe", "heading")}${bike(499, 100, 0.78)}${pill(428, 142, 142, 26, "Verbrauch · je Stück", "v-orange-fill", "micro")}${lines(499, 194, "Alurohr, Schaltung,\nLack & Schweißstrom", "micro")}`,
      ),
  },

  "un-standort": {
    title: "Standortfaktoren und Nutzwertanalyse",
    question: "Wie hilft eine gewichtete Punktetabelle bei einer nachvollziehbaren Standortwahl?",
    alt: "Links Standort A Gewerbepark mit guten Verkehrs- und Platzwerten, in der Mitte Standort B Innenstadtrand mit hoher Laufkundschaft, rechts die gewichtete Nutzwertrechnung.",
    caption:
      "Die Prozentgewichte (Summe 100 %) verbinden harte und weiche Standortfaktoren auf einer Punkteskala von 1 (sehr schlecht) bis 6 (sehr gut).",
    parts: [
      {
        label: "Standort A (Gewerbepark)",
        note: "Punktet bei Lkw-Zufahrt, Erweiterungsfläche und niedriger Miete — ideal für ein produzierendes Radwerk.",
      },
      {
        label: "Standort B (Innenstadt)",
        note: "Liegt stark bei Laufkundschaft, hat aber hohe Mieten und kaum Platz für Anlieferung und Lager.",
      },
      {
        label: "Gewichtete Gesamtpunkte",
        note: "Jeder Faktor erhält ein Prozentgewicht (zusammen 100 %) und Punkte von 1 (sehr schlecht) bis 6 (sehr gut). Die höchste gewichtete Punktsumme gewinnt.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Gewerbepark A", "heading")}${factory(101, 100, 0.86)}${pill(32, 144, 138, 24, "Verkehr · Fläche: 6", "v-teal-fill", "micro")}${lines(101, 194, "niedrige Miete · Platz\nfür Lkw & Lager", "micro")}`,
      ) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Innenstadt B", "heading")}${house(300, 100, 0.88)}${pill(232, 144, 136, 24, "Laufkundschaft: 6", "v-orange-fill", "micro")}${lines(300, 194, "hohe Miete · wenig\nPlatz für Fertigung", "micro")}`,
      ) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Punktwert (1–6)", "heading")}${pill(430, 74, 138, 28, "Σ Gewichte = 100 %", "v-soft-fill", "micro")}<rect x="432" y="114" width="134" height="22" rx="4" class="v-teal"/>${label(499, 129, "A: z. B. 5,10 Pkt.", "micro on-fill")}<rect x="432" y="144" width="90" height="22" rx="4" class="v-orange"/>${label(477, 159, "B: 3,20 Pkt.", "micro on-fill")}${lines(499, 194, "1 = sehr schlecht · 6 = sehr gut\nhöchste Punktsumme gewinnt", "micro")}`,
      ),
  },

  "un-rechtsformen": {
    title: "Einzelunternehmung und GmbH im Vergleich",
    question: "Worin unterscheiden sich Mindestkapital, Leitung und Haftung?",
    alt: "Links Einzelunternehmung mit einer Inhaberin, alleiniger Leitung und unbeschränkter Haftung bis ins Privatvermögen, in der Mitte GmbH mit mindestens 25.000 € Stammkapital, Geschäftsführung und HRB-Eintrag, rechts Vergleich der Haftungsgrenze.",
    caption: "Mehr Sicherheit durch beschränkte Haftung kostet bei der GmbH ein höheres Mindestkapital und mehr Gründungsaufwand.",
    parts: [
      {
        label: "Einzelunternehmung",
        note: "Eine Person gründet ohne gesetzliches Mindestkapital, entscheidet allein — haftet aber unbeschränkt mit Geschäfts- und Privatvermögen.",
      },
      {
        label: "GmbH",
        note: "Ein oder mehrere Gesellschafter bringen mindestens 25.000 € Stammkapital ein; ein oder mehrere Geschäftsführer vertreten die Gesellschaft.",
      },
      {
        label: "Haftungsvergleich",
        note: "Bei der GmbH schützt die Haftungsbeschränkung in der Regel das private Vermögen der Gesellschafter (Ausnahmen bei Pflichtverletzung).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 180, 214)}${badge(36, 40, 1)}${label(112, 44, "Einzelunternehmung", "heading")}${person(104, 98, "v-coral")}${pill(30, 124, 148, 26, "Kein Mindestkapital", "v-soft-fill", "micro")}${pill(30, 158, 148, 26, "Alleinige Leitung", "v-coral-fill", "micro")}${lines(104, 206, "volle Haftung mit\ndem Privatvermögen", "micro")}`,
      ) +
      group(
        2,
        `${card(210, 18, 180, 214)}${badge(232, 40, 2)}${label(308, 44, "GmbH", "heading")}${person(282, 98, "v-blue")}${person(318, 98, "v-teal")}${pill(226, 124, 148, 26, "Stammkap. ≥ 25.000 €", "v-gold-fill", "micro")}${pill(226, 158, 148, 26, "Geschäftsführer/-in", "v-blue-fill", "micro")}${lines(300, 206, "Notarieller Vertrag\nEintragung ins HRB", "micro")}`,
      ) +
      group(
        3,
        `${card(406, 18, 180, 214)}${badge(428, 40, 3)}${label(504, 44, "Haftung", "heading")}${shield(496, 102, 1.0, "v-teal")}${pill(422, 152, 148, 28, "GmbH: auf Vermögen", "v-teal-fill", "micro")}${lines(496, 206, "Privatvermögen der\nGesellschafter geschützt", "micro")}`,
      ),
  },

  "un-gruendung-firma": {
    title: "Gründungsschritte und Handelsregister",
    question: "Welchen Weg geht Lena Brenner von der Idee bis zur eingetragenen Firma?",
    alt: "Drei Gründungsschritte: erstens Businessplan und Finanzierung prüfen, zweitens Gewerbeamt, Finanzamt und IHK einbinden, drittens Firma Lena Brenner e. K. im Handelsregister eintragen.",
    caption: "„Firma“ bedeutet im Recht nicht das Gebäude, sondern den eingetragenen Namen des kaufmännischen Betriebs.",
    parts: [
      {
        label: "1. Businessplan",
        note: "Geschäftsidee, Zielgruppe, Standort, Kostenplan und Kapitalbedarf prüfen — erst rechnen, dann investieren.",
      },
      {
        label: "2. Anmeldungen",
        note: "Gewerbeanmeldung bei der Gemeinde, steuerliche Erfassung beim Finanzamt und Mitgliedschaft bei IHK oder Handwerkskammer.",
      },
      {
        label: "3. Firma & Register",
        note: "Der Firmenname (z. B. „Lena Brenner e. K.“) muss eindeutig sein und wird ins öffentliche Handelsregister eingetragen.",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 214)}${badge(36, 40, 1)}${label(101, 45, "Businessplan", "heading")}${receiptDoc(38, 66, 126, 98, "GRÜNDUNGSPLAN", ["• Idee & Markt", "• Standortwahl", "• Kapitalbedarf"])}${lines(101, 194, "Tragfähigkeit vor\ndem Start prüfen", "micro")}`,
      ) +
      arrow(190, 124, 210, 124) +
      group(
        2,
        `${card(212, 18, 176, 214)}${badge(234, 40, 2)}${label(300, 45, "Behörden", "heading")}${pill(232, 74, 136, 28, "Gewerbeamt", "v-blue-fill", "micro")}${pill(232, 110, 136, 28, "Finanzamt (USt-ID)", "v-teal-fill", "micro")}${pill(232, 146, 136, 28, "IHK / HWK", "v-gold-fill", "micro")}${lines(300, 198, "Pflichtschritte vor\nAufnahme des Betriebs", "micro")}`,
      ) +
      arrow(390, 124, 410, 124) +
      group(
        3,
        `${card(412, 18, 174, 214)}${badge(434, 40, 3)}${label(499, 45, "Handelsregister", "heading")}${shield(499, 98, 0.85, "v-blue")}${pill(424, 140, 150, 28, "„Lena Brenner e. K.“", "v-accent-fill", "micro")}${lines(499, 194, "HRA (e. K.) · HRB (GmbH)\nVertrauen im Rechtsverkehr", "micro")}`,
      ),
  },

  "un-funktionsbereiche": {
    title: "Wertschöpfungskette im Radwerk Brenner",
    question: "Wie greifen Beschaffung, Fertigung, Absatz und Verwaltung täglich ineinander?",
    alt: "Vier zusammenhängende Bereiche im Betrieb: Beschaffung kauft Werkstoffe auf Vorräte, Fertigung montiert das Jugendfahrrad, Absatz verkauft mit Rechnung und die Verwaltung bucht alle Belege.",
    caption: "Kein Bereich arbeitet für sich allein: Stockt der Einkauf oder fehlt die Rechnung, merkt es der ganze Betrieb.",
    parts: [
      {
        label: "Beschaffung & Lager",
        note: "Angebote einholen, Rohstoffe und Bauteile termingerecht bestellen, im Wareneingang prüfen und als Vorräte lagern.",
      },
      {
        label: "Fertigung",
        note: "Aus Alurohren, Bremsen, Lack und Strom entstehen in mehreren Arbeitsschritten geprüfte Jugendräder.",
      },
      {
        label: "Absatz & Verwaltung",
        note: "Kunden beraten, verkaufen und ausliefern (Absatz); Buchführung, Zahlungsverkehr und Personal steuern das Ganze (Verwaltung).",
      },
    ],
    draw: () =>
      group(
        1,
        `${card(14, 18, 174, 186)}${badge(36, 40, 1)}${label(101, 45, "Beschaffung", "heading")}${pill(32, 74, 138, 28, "Angebote prüfen", "v-orange-fill", "micro")}${pill(32, 110, 138, 28, "Einkauf & Lager", "v-soft-fill", "micro")}${lines(101, 162, "Werkstoffe rechtzeitig\nin richtiger Menge", "micro")}`,
      ) +
      arrow(190, 110, 210, 110) +
      group(
        2,
        `${card(212, 18, 176, 186)}${badge(234, 40, 2)}${label(300, 45, "Fertigung", "heading")}${bike(300, 102, 0.9)}${lines(300, 162, "Schweißen, Lackieren\nund Endmontage", "micro")}`,
      ) +
      arrow(390, 110, 410, 110) +
      group(
        3,
        `${card(412, 18, 174, 186)}${badge(434, 40, 3)}${label(499, 45, "Absatz", "heading")}${receiptDoc(444, 68, 110, 74, "RECHNUNG", ["Jugendrad", "19 % USt"])}${lines(499, 164, "Verkauf an Händler\nund Versand", "micro")}`,
      ) +
      pill(14, 210, 572, 26, "Verwaltung · Buchführung, Zahlungsverkehr & Controlling verbinden alle Bereiche", "v-teal-fill", "micro"),
  },
};
