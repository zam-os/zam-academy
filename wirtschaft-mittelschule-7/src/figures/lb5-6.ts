import {
  arrow,
  badge,
  card,
  clockIcon,
  type ConceptFigure,
  group,
  house,
  label,
  lines,
  pill,
  sheetDoc,
  shield,
} from "./draw";

export const LB5_6_FIGURES: Record<string, ConceptFigure> = {
  "re-kinderarbeit-ferienzweck": {
    title: "Kinderarbeitsverbot, Ferienzweck und kleine Ausnahme",
    question: "Warum sind Ferien zur Erholung geschützt und was gilt unter 15 Jahren nach dem JArbSchG?",
    alt: "Drei Rechtsregeln: Kinderarbeit unter 15 verboten (§ 5 Abs. 1), Sinn von Ferien ist Erholung und Entwicklung, enge Ausnahme ab über 13 Jahren für leichte Arbeit max. 2 Std./Tag zwischen 8 und 18 Uhr (§ 5 Abs. 3).",
    caption: "§ 5 Abs. 1 & 3 JArbSchG: Unter 15 gilt grundsätzlich das Verbot; ab 13+ nur leichte Arbeiten bis 2 Std./Tag mit Einwilligung.",
    parts: [
      {
        label: "Grundverbot unter 15",
        note: "Kind ist, wer noch nicht 15 Jahre alt ist (§ 2 Abs. 1). Nach § 5 Abs. 1 JArbSchG ist Kinderarbeit grundsätzlich verboten.",
      },
      {
        label: "Sinn der Schulferien",
        note: "Ferien sichern Gesundheit, Schlaf, Bewegung und Erholung vom Schuljahr — Vollzeiterwerbsarbeit widerspricht diesem Zweck.",
      },
      {
        label: "Ausnahme ab über 13 J.",
        note: "Mit Einwilligung der Eltern erlaubt § 5 Abs. 3 leichte Tätigkeiten (z. B. Austragen) max. 2 Std./Tag, 8–18 Uhr, nie vor der Schule.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Verbot unter 15 J.", "heading", "start")}${shield(126, 96, 0.9, "v-coral")}${pill(30, 142, 192, 34, "Kinderarbeit verboten (§ 5 Abs. 1)", "v-coral-fill", "micro")}${lines(126, 204, "Gilt für alle Kinder\nunter 15 Jahren (§ 2 Abs. 1).", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Zweck der Ferien", "heading", "start")}${pill(284, 74, 192, 36, "Erholung & Gesundheit", "v-green-fill", "micro")}${pill(284, 122, 192, 36, "Kraft fürs neue Schuljahr", "v-teal-fill", "micro")}${lines(380, 192, "Schulpflichtige Jugendliche\nsollen sich im Urlaub erholen.", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Ausnahme 13+", "heading", "start")}${sheetDoc(546, 66, 176, 118, "§ 5 Abs. 3 JArbSchG", ["Alter: über 13 Jahre", "Eltern-Einwilligung nötig", "Max. 2 Std./Tag · 8–18 Uhr", "Leichte, sichere Arbeit"])}${pill(538, 198, 192, 32, "Nie vor/während der Schule!", "v-gold-fill", "micro")}`,
      )}`,
  },

  "re-ferienarbeit-regeln": {
    title: "Schutzgrenzen für Ferienjobs ab 15 Jahren",
    question: "Welche genauen Höchstgrenzen gelten bei einem Ferienjob nach § 5 Abs. 4 JArbSchG?",
    alt: "Drei Säulen des Jugendarbeitsschutzgesetzes für Ferienarbeit ab 15: Jahresumfang max. 4 Wochen (20 Arbeitstage), Arbeitszeit max. 8 Std./Tag und 40 Std./Woche von 6–20 Uhr, Ruhepausen 30 Min. bzw. 60 Min. und Verbot gefährlicher Arbeiten.",
    caption: "Ferienjob ab 15: max. 4 Wochen (20 Tage) im Jahr, max. 8 Std./Tag · 40 Std./Woche, 6–20 Uhr, 30/60 Min. Pause.",
    parts: [
      {
        label: "Alter & 4-Wochen-Limit",
        note: "Ab 15 Jahren sind während der Schulferien höchstens 4 Wochen (20 Arbeitstage in der 5-Tage-Woche) im ganzen Kalenderjahr erlaubt.",
      },
      {
        label: "Tages- & Nachtgrenzen",
        note: "Maximal 8 Std. täglich und 40 Std. wöchentlich (§ 8), nur zwischen 6 und 20 Uhr (§ 14), keine gefährlichen Arbeiten (§ 22).",
      },
      {
        label: "Ruhepausen (§ 11)",
        note: "Bei > 4,5 bis 6 Std. mind. 30 Min. Pause; bei > 6 Std. mind. 60 Min. (Beispiel: 10 Tage · 6 Std. · 13 € = 780 € + 30 Min. Pause).",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Alter & Kalenderjahr", "heading", "start")}${pill(30, 74, 192, 36, "Mindestalter: 15 Jahre", "v-teal-fill", "micro")}${pill(30, 122, 192, 36, "Max. 4 Wochen / Jahr (20 Tage)", "v-blue-fill", "micro")}${lines(126, 192, "Alle Ferienabschnitte im\nselben Jahr zählen zusammen.", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Zeit & Sicherheit", "heading", "start")}${clockIcon(380, 96, 22)}${pill(284, 130, 192, 32, "Max. 8 Std./Tag · 40 Std./Wo.", "v-gold-fill", "micro")}${pill(284, 172, 192, 32, "Nur 6–20 Uhr · 5-Tage-Woche", "v-orange-fill", "micro")}${label(380, 226, "Gefährliche Arbeiten verboten (§ 22)", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Pausen & Beispiel", "heading", "start")}${pill(538, 72, 192, 34, "> 4,5–6 Std. → mind. 30 Min.", "v-green-fill", "micro")}${pill(538, 116, 192, 34, "> 6 Std. → mind. 60 Min.", "v-green-fill", "micro")}${sheetDoc(546, 164, 176, 68, "Beispiel Gärtnerei", ["10 Tg. · 6 Std. · 13 € = 780 €", "Pause: mind. 30 Min./Tag"])}`,
      )}`,
  },

  "re-praktikum-vs-ferienjob": {
    title: "Betriebspraktikum und Ferienjob im Rechtsvergleich",
    question: "Warum gelten für das schulische Betriebspraktikum und den Ferienjob verschiedene Alters- und Entgeltregeln?",
    alt: "Vergleich von schulischem Betriebspraktikum (§ 5 Abs. 2 Nr. 2 JArbSchG: ab Klasse 7/8 auch vor 15, Lernzweck, max. 7 Std./Tag, kein Lohn, Schülerunfallschutz) und Ferienjob (§ 5 Abs. 4: ab 15, Gelderwerb, max. 8 Std./Tag, Lohn, max. 4 Wochen).",
    caption: "Rechtsunterschied: Das schulische Praktikum dient dem Lernen (auch unter 15); der Ferienjob dient dem Verdienst (ab 15).",
    parts: [
      {
        label: "Betriebspraktikum",
        note: "Schulpflichtige Veranstaltung zur Berufsorientierung (§ 5 Abs. 2 Nr. 2), auch unter 15 zulässig, bis 7 Std./Tag (§ 7 Nr. 2), unbezahlt.",
      },
      {
        label: "Ferienjob (§ 5 Abs. 4)",
        note: "Freiwillige Erwerbsarbeit in den Schulferien ab 15 Jahren, bis 8 Std./Tag (40 Std./Woche), höchstens 4 Wochen im Kalenderjahr, gegen Entgelt.",
      },
      {
        label: "Wichtige Abgrenzung",
        note: "Ein privates ‚unbezahltes Ferienpraktikum‘ darf das Kinderarbeitsverbot nicht umgehen — unter 15 bleibt nur Schulpraktikum oder § 5 Abs. 3.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Betriebspraktikum", "heading", "start")}${pill(30, 72, 192, 32, "Zweck: Berufe kennenlernen", "v-blue-fill", "micro")}${pill(30, 114, 192, 32, "Alter: auch unter 15 J. zulässig", "v-blue-fill", "micro")}${pill(30, 156, 192, 32, "Max. 7 Std./Tag · 35 Std./Wo.", "v-panel", "micro")}${pill(30, 198, 192, 32, "Kein Lohn · Schulunfallschutz", "v-teal-fill", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Ferienjob", "heading", "start")}${pill(284, 72, 192, 32, "Zweck: Geld verdienen", "v-gold-fill", "micro")}${pill(284, 114, 192, 32, "Alter: erst ab 15 Jahren", "v-gold-fill", "micro")}${pill(284, 156, 192, 32, "Max. 8 Std./Tag · 4 Wo./Jahr", "v-panel", "micro")}${pill(284, 198, 192, 32, "Vereinbarter Arbeitslohn", "v-green-fill", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Merke für Verträge", "heading", "start")}${shield(634, 96, 0.85, "v-coral")}${lines(634, 152, "Ein ‚Ferienpraktikum‘ unter 15\nohne Schulrahmen umgeht\nnicht das JArbSchG.", "micro")}`,
      )}`,
  },

  "te-technikerkundung-haushalt": {
    title: "Technikerkundung im Privathaushalt strukturieren",
    question: "Wie beobachtest und protokollierst du technische Geräte im Haushalt zuverlässig über mehrere Wochen?",
    alt: "Drei Schritte der Haushaltstechnikerkundung: 1. Beobachtungsfragen + Typenschilddaten (Watt), 2. Mehrwöchiges Protokoll, 3. Verbrauch & Standby erkennen (Filterkaffeemaschine 1.200 W = 187,20 kWh vs. TV-Set 4 W Standby = 30,78 kWh/Jahr).",
    caption: "Haushaltsprotokoll: 1.200 W Kaffeemaschine (3 Std./Wo.) verbraucht 187,20 kWh/Jahr; schon 4 W Dauer-Standby kosten 30,78 kWh.",
    parts: [
      {
        label: "Fragen & Typenschild",
        note: "Du legst Beobachtungsaufgaben fest (Nutzungszweck, Laufzeit, Ausschaltverhalten) und liest auf Typenschildern die Wattzahl ab.",
      },
      {
        label: "Mehrwöchig messen",
        note: "Über mindestens zwei bis vier Wochen dokumentiert der Haushalt aktive Laufzeiten sowie abendliches Standby-Leuchten.",
      },
      {
        label: "Verdeckten Standby finden",
        note: "TV/Konsole mit nur 4 W Dauer-Standby (148 Std./Wo.) ziehen in 52 Wochen 30,78 kWh (10,77 € bei 35 ct) ohne jeden Nutzen.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Aufgaben & Daten", "heading", "start")}${house(126, 94, 0.85)}${sheetDoc(34, 134, 184, 96, "Typenschild prüfen", ["Kaffeemaschine: 1.200 W", "TV + Konsole: 80 W / 4 W", "Beobachtungsfrage formulieren"])}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Wochenprotokoll", "heading", "start")}${sheetDoc(292, 68, 176, 122, "2–4 Wochen messen", ["Mo–Fr: echte Laufzeit", "Sa–So: Spitzen beachten", "22 Uhr: Standby-Check", "Alle Bewohner einbinden"])}${label(380, 218, "Einzeltag reicht nicht aus!", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Jahresergebnis", "heading", "start")}${label(536, 86, "Kaffee", "micro", "start")}<rect x="592" y="72" width="128" height="22" rx="4" class="v-blue"/>${label(656, 87, "187,20 kWh", "micro on-fill")}${label(536, 126, "Standby", "micro", "start")}<rect x="592" y="112" width="24" height="22" rx="4" class="v-coral"/>${label(622, 127, "30,78 kWh (4 W)", "micro", "start")}${pill(538, 174, 192, 36, "Steckerleiste spart 10,77 €/J.", "v-green-fill", "micro")}`,
      )}`,
  },

  "te-oekonomie-oekologie-haushalt": {
    title: "Ökonomie und Ökologie technischer Geräte prüfen",
    question: "Wie treffen Kaufpreis, jährliche Stromkosten und Umweltwirkungen zusammen?",
    alt: "Stromformel kWh = (W · Std.) / 1.000 links, Vergleich Ablufttrockner 2.000 W (416 kWh / 145,60 € Jahr) vs. Wäscheständer (0 kWh / 0 €) in der Mitte, EU-Energielabel (§ 4 EnVKG) und Lebensdauer rechts.",
    caption: "Trockner (2.000 W · 4 Std./Wo. = 416 kWh / 145,60 €/Jahr) vs. Wäscheständer (0 €): sparsamer Einsatz schont Geld und Umwelt.",
    parts: [
      {
        label: "Energie & Kosten",
        note: "Mit (Watt · Stunden) / 1.000 erhältst du Kilowattstunden (kWh). Mal den Strompreis (z. B. 0,35 €) ergibt die jährlichen Betriebskosten.",
      },
      {
        label: "Gerät vs. Alternative",
        note: "Ein 2.000-W-Trockner (4 Std./Wo.) braucht 416,00 kWh und 145,60 € Strom im Jahr — ein Wäscheständer braucht 0 kWh und 0,00 €.",
      },
      {
        label: "Label & Lebensdauer",
        note: "Das EU-Energielabel (§ 4 EnVKG, Klassen A–G) zeigt Verbrauch und Wasserbedarf; lange Nutzungsdauer verhindert unnötigen Elektroschrott.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Verbrauchsformel", "heading", "start")}${pill(30, 76, 192, 42, "kWh = (W · Std.) / 1.000", "v-blue-fill", "micro")}${pill(30, 132, 192, 42, "Kosten = kWh · Strompreis", "v-teal-fill", "micro")}${label(126, 204, "1 kW · 1 Std. = 1 kWh", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Trockner vs. Leine", "heading", "start")}${label(284, 86, "Trockner", "micro", "start")}<rect x="348" y="72" width="126" height="22" rx="4" class="v-coral"/>${label(411, 87, "416 kWh · 145,60 €", "micro on-fill")}${label(284, 124, "Ständer", "micro", "start")}<rect x="348" y="110" width="6" height="22" rx="2" class="v-green"/>${label(360, 125, "0 kWh · 0,00 €", "micro", "start")}${lines(380, 174, "Ökonomisch und ökologisch\nimmer einfache Alternativen prüfen.", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Label & Umwelt", "heading", "start")}<rect x="546" y="70" width="84" height="18" rx="3" class="v-green"/><rect x="546" y="92" width="108" height="18" rx="3" class="v-gold"/><rect x="546" y="114" width="136" height="18" rx="3" class="v-coral"/>${label(564, 83, "A", "micro on-fill")}${label(564, 105, "D", "micro")}${label(564, 127, "G", "micro on-fill")}${lines(634, 168, "EU-Energielabel (§ 4 EnVKG)\n+ Reparierbarkeit beachten!", "micro")}`,
      )}`,
  },

  "te-grenzen-chancen-risiken": {
    title: "Grenzen, Amortisation und Rebound-Effekt (M7)",
    question: "Wann lohnt sich der Austausch eines alten Geräts — und wo liegen die Grenzen sinnvoller Technik?",
    alt: "Amortisationsrechnung beim Kühlschrank: Altgerät 220 kWh (77 €) vs. Neugerät 100 kWh (35 €) spart 42 €/Jahr und amortisiert 168 € Mehrpreis in 4,00 Jahren; daneben Grenzen wie Elektroschrott, Datenschutz und Rebound-Effekt.",
    caption: "M7-Beispiel: 42,00 € Stromersparnis/Jahr zahlt 168,00 € Mehrpreis nach 4,00 Jahren ab — Kurzzeitgeräte selten vorzeitig tauschen.",
    parts: [
      {
        label: "Amortisation rechnen",
        note: "120 kWh weniger pro Jahr (= 42,00 € Ersparnis bei 35 ct/kWh) bezahlen 168,00 € Mehrpreis in genau 4,00 Jahren zurück.",
      },
      {
        label: "Chancen & echte Hilfe",
        note: "Dauerläufer wie Kühlgeräte oder Waschmaschinen sparen bei hoher Effizienz viel Strom, Wasser und schwere Hausarbeit.",
      },
      {
        label: "Grenzen & Risiken",
        note: "Verklebte Akkus, Datenabfluss im Smart Home, graue Herstellungsenergie und der Rebound-Effekt setzen sinnvolle Grenzen.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Amortisation (4 J.)", "heading", "start")}${label(30, 86, "Alt", "micro", "start")}<rect x="74" y="72" width="132" height="22" rx="4" class="v-coral"/>${label(140, 87, "220 kWh (77 €)", "micro on-fill")}${label(30, 120, "Neu", "micro", "start")}<rect x="74" y="106" width="60" height="22" rx="4" class="v-green"/>${label(140, 121, "100 kWh (35 €)", "micro", "start")}${pill(30, 162, 192, 38, "168 € / 42 €/J. = 4,00 Jahre", "v-green-fill", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Chancen nutzen", "heading", "start")}${pill(284, 74, 192, 38, "Dauerläufer effizient wählen", "v-teal-fill", "micro")}${pill(284, 124, 192, 38, "Schwere Routinearbeit entlasten", "v-blue-fill", "micro")}${label(380, 196, "Nutzen über viele Jahre sichern", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Grenzen & Risiken", "heading", "start")}${pill(538, 70, 192, 34, "Rebound-Effekt vermeiden", "v-orange-fill", "micro")}${pill(538, 116, 192, 34, "Elektroschrott & Verklebung", "v-coral-fill", "micro")}${pill(538, 162, 192, 34, "Datenschutz im Smart Home", "v-gold-fill", "micro")}`,
      )}`,
  },

  "te-arbeit-technik-haushaltsproduktion": {
    title: "Arbeit und Technik bei der Haushaltsproduktion",
    question: "Wie stehen eigene Arbeitszeit, Technik und Geldkosten beim Selbstmachen im Vergleich zum Kauf?",
    alt: "Kosten- und Zeitvergleich bei 6 Portionen Pizza: Eigenproduktion (5,40 € Zutaten + 0,48 € Strom = 5,88 €, 45 Min. Arbeit) gegenüber Marktkauf (19,20 €) ergibt 13,32 € Ersparnis (17,76 €/Std. Eigenarbeit).",
    caption: "Pizza-Beispiel (6 Portionen): 5,88 € Eigenkosten vs. 19,20 € Kauf spart 13,32 € (= 17,76 €/Std. eigene Arbeit).",
    parts: [
      {
        label: "Selbst machen (5,88 €)",
        note: "Zutaten (5,40 €) plus Ofenstrom (0,48 € für 2.000 W · 0,75 Std.) kosten nur 5,88 €, verlangen aber 45 Minuten eigene Arbeit.",
      },
      {
        label: "Marktkauf (19,20 €)",
        note: "6 fertige Pizzen kosten 19,20 €: Keine Vorbereitungszeit zu Hause, aber über dreimal so hohe Geldausgaben.",
      },
      {
        label: "Ersparnis je Stunde",
        note: "Die 13,32 € Bargeldersparnis in 45 Minuten entsprechen rechnerisch genau 17,76 € pro Arbeitsstunde im Haushalt.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Eigenproduktion", "heading", "start")}<rect x="34" y="88" width="54" height="26" rx="4" class="v-green"/>${label(94, 105, "5,88 € (inkl. 0,48 € Strom)", "micro", "start")}${lines(126, 150, "5,40 € Zutaten + 0,48 € Ofen\n+ 45 Min. eigene Arbeitszeit", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Fertigkauf", "heading", "start")}<rect x="288" y="88" width="176" height="26" rx="4" class="v-coral"/>${label(376, 105, "6 · 3,20 € = 19,20 €", "micro on-fill")}${lines(380, 150, "Spare Zeit am Herd — aber\ndreifache Geldausgabe!", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Arbeitswert", "heading", "start")}${pill(538, 76, 192, 38, "Ersparnis: + 13,32 €", "v-green-fill", "small")}${pill(538, 128, 192, 38, "= 17,76 € je Arbeitsstunde", "v-gold-fill", "micro")}${label(634, 198, "Technik hilft sparen (Ofen, Mixer)", "micro")}`,
      )}`,
  },

  "te-technischer-wandel-qualifikation": {
    title: "Technischer Wandel und neue Qualifikationen",
    question: "Wie verändern neue Geräte den Arbeitsablauf im Haushalt und was müssen Nutzerinnen heute können?",
    alt: "Zeitvergleich von früher (Waschbrett, hohe Muskelkraft, einfache Handhabung) über sensorgesteuerte Waschmaschine bis zu digitalen/vernetzten Geräten mit höheren Anforderungen an Programm-, Energie-, Wartungs- und Sicherheitswissen.",
    caption: "Technischer Wandel: Muskelkraft sinkt, dafür wachsen Anforderungen an Einstellung, Wartung, Energie- und Datensicherheit.",
    parts: [
      {
        label: "Früher: viel Muskelkraft",
        note: "Mechanische Werkzeuge (Waschbrett, Handmühle) erforderten hohen körperlichen Einsatz und viel Zeit bei einfacher Bedienung.",
      },
      {
        label: "Heute: Automatik & Sensorik",
        note: "Elektronische und digitale Geräte übernehmen Kraftarbeit und regeln Temperatur, Wassermenge und Zeiten automatisch.",
      },
      {
        label: "Neue Qualifikation nötig",
        note: "Nutzer brauchen Wissen über Sparprogramme, Pflegeetiketten, Siebwartung, Fehlercodes sowie Passwort- und Datenschutz.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Früher · Mechanik", "heading", "start")}${pill(30, 74, 192, 36, "Hohe Körperkraft & Zeit", "v-orange-fill", "micro")}${pill(30, 122, 192, 36, "Einfache Werkzeugtechnik", "v-panel", "micro")}${lines(126, 192, "Arbeit direkt mit den Händen\n(z. B. Waschtrog, Handbesen)", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Heute · Sensor & App", "heading", "start")}${pill(284, 74, 192, 36, "Wenig Muskelkraft nötig", "v-teal-fill", "micro")}${pill(284, 122, 192, 36, "Automatische Programme", "v-blue-fill", "micro")}${lines(380, 192, "Abläufe werden schneller\nund komplexer im Inneren.", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Neue Kompetenzen", "heading", "start")}${sheetDoc(546, 66, 176, 122, "Qualifikation heute", ["• Öko-Programme wählen", "• Wartung & Fehlercodes", "• Kosten/kWh einschätzen", "• IT- & Datenschutz prüfen"])}${label(634, 214, "Verstehen schützt vor Fehlern", "micro")}`,
      )}`,
  },
};
