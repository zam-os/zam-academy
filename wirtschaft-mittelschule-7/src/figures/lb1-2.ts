import {
  arrow,
  badge,
  card,
  coins,
  type ConceptFigure,
  factory,
  group,
  label,
  lines,
  person,
  pill,
  sheetDoc,
  shield,
  stall,
} from "./draw";

export const LB1_2_FIGURES: Record<string, ConceptFigure> = {
  "pr-vollstaendige-handlung": {
    title: "Die fünf Phasen einer vollständigen Handlung",
    question: "Wie wird aus einer ersten Idee ein erfolgreicher und geprüfter Pausenmarkt?",
    alt: "Dreiteiliges Ablaufbild: Start mit Initiative und Planung, Umsetzung und Präsentation in der Mitte, Reflexion des Ist-Überschusses 42,00 € gegen Plan 36,00 € rechts.",
    caption: "Beispiel Pausen-Treff 7a: erst planen (48,00 € Budget), dann umsetzen und mit 42,00 € Überschuss auswerten.",
    parts: [
      {
        label: "Idee & Plan vorab",
        note: "Phase 1 (Initiative) klärt die Produktidee ‚Obstbecher‘; Phase 2 (Planung) legt 60 Becher, Rollen und 48,00 € Kostenlimit fest.",
      },
      {
        label: "Umsetzen & Zeigen",
        note: "Phase 3 (Durchführung) bereitet und verkauft die Becher; Phase 4 (Präsentation) zeigt Einnahmen und Ablauf für andere sichtbar.",
      },
      {
        label: "Soll-Ist-Reflexion",
        note: "Phase 5 vergleicht den Plan-Überschuss (36,00 €) mit dem echten Ergebnis (42,00 €) und sammelt Verbesserungen fürs nächste Mal.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Vor dem Start", "heading", "start")}${pill(30, 62, 192, 34, "1. Initiative: Obstbecher", "v-teal-fill", "micro")}${arrow(126, 98, 126, 114)}${pill(30, 116, 192, 34, "2. Planung: 60 Stk · 48,00 €", "v-blue-fill", "micro")}${lines(126, 178, "Rollen, Einkaufsliste\nund Zeitplan stehen fest.", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Aktion & Bühne", "heading", "start")}${stall(380, 96, 0.9)}${pill(284, 134, 192, 30, "3. Durchführung: Pausenverkauf", "v-gold-fill", "micro")}${arrow(380, 166, 380, 180)}${pill(284, 182, 192, 30, "4. Präsentation: Plakat & Bilanz", "v-orange-fill", "micro")}${label(380, 232, "Ergebnisse sichtbar teilen", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "5. Reflexion", "heading", "start")}${label(540, 86, "Plan", "micro", "start")}<rect x="596" y="72" width="90" height="20" rx="4" class="v-blue"/>${label(692, 86, "36 €", "micro", "start")}${label(540, 120, "Ist", "micro", "start")}<rect x="596" y="106" width="105" height="20" rx="4" class="v-green"/>${label(706, 120, "42 €", "micro", "start")}${pill(538, 154, 192, 34, "Lernen fürs nächste Projekt", "v-green-fill", "micro")}${lines(634, 214, "Engpässe und Erfolge\nwerden schriftlich gesichert.", "micro")}`,
      )}`,
  },

  "pr-leittextmethode": {
    title: "Die sechs Schritte der Leittextmethode",
    question: "Wie steuert dein Team Arbeitsschritte geordnet von der Leitfrage bis zur Bewertung?",
    alt: "Sechs Schritte in drei Zweiergruppen: Informieren und Planen, Entscheiden und Ausführen, Kontrollieren (90,00 € Kasse) und Bewerten.",
    caption: "Beispiel Marktstand-Planung: Erst informieren und entscheiden (1,80 € Preis), dann Kasse und Hygiene prüfen.",
    parts: [
      {
        label: "Informieren & Planen",
        note: "Schritt 1 erschließt Fakten mithilfe der Leitfragen; Schritt 2 ordnet Arbeitspakete, Materialien und Zeitfenster.",
      },
      {
        label: "Entscheiden & Ausführen",
        note: "Schritt 3 wählt das beste Angebot (z. B. Verkaufspreis 1,80 €); Schritt 4 setzt den Standplan praktisch um.",
      },
      {
        label: "Kontrollieren & Bewerten",
        note: "Schritt 5 prüft Checkliste und Kassenbestand (90,00 €) gegen Vorgaben; Schritt 6 bewertet Teamarbeit und Ergebnis.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Vorbereiten", "heading", "start")}${sheetDoc(38, 62, 176, 108, "1. Informieren", ["Leitfragen klären", "Preise vergleichen", "Regeln nachlesen"])}${pill(30, 190, 192, 34, "2. Planen: Aufgaben & Zeit", "v-blue-fill", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Handeln", "heading", "start")}${pill(284, 72, 192, 38, "3. Entscheiden: Preis 1,80 €", "v-gold-fill", "micro")}${arrow(380, 114, 380, 132)}${pill(284, 136, 192, 38, "4. Ausführen: Stand aufbauen", "v-teal-fill", "micro")}${lines(380, 206, "Team arbeitet selbständig\nnach vereinbartem Plan.", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Prüfen", "heading", "start")}${sheetDoc(546, 62, 176, 108, "5. Kontrollieren", ["Schilder & Hygiene ✓", "Kasse: 90,00 € ✓", "50 Becher verkauft ✓"])}${pill(538, 190, 192, 34, "6. Bewerten im Teamgespräch", "v-green-fill", "micro")}`,
      )}`,
  },

  "pr-marktprojekt-umsetzen": {
    title: "Fixkosten, Stückkosten und Kostendeckung",
    question: "Ab welcher Stückzahl bezahlt der Verkauf alle Kosten und schafft Überschuss?",
    alt: "Drei Teile: Fixkosten 24,00 € plus Stückkosten 0,80 € links, Stückbeitrag 0,80 € und Mindestabsatz 30 Stück in der Mitte, Gesamtbalken 70 Becher (112,00 € Einnahmen vs. 80,00 € Kosten = 32,00 € Überschuss) rechts.",
    caption: "Beispiel Gesunder Pausensnack: 24,00 € fix + 0,80 € je Becher gegen 1,60 € Preis ergibt 32,00 € Überschuss bei 70 Stück.",
    parts: [
      {
        label: "Fix- & Stückkosten",
        note: "24,00 € Fixkosten (Plakate, Servietten) bleiben konstant; 0,80 € Einkauf pro Becher steigen mit der verkauften Menge.",
      },
      {
        label: "Mindestabsatz (30 Stk.)",
        note: "Pro Becher bleiben 1,60 € − 0,80 € = 0,80 € Stückbeitrag. Nach 30 Bechern (24,00 € / 0,80 €) sind die Fixkosten gedeckt.",
      },
      {
        label: "Ergebnis bei 70 Bechern",
        note: "112,00 € Einnahmen minus 80,00 € Gesamtkosten (24 € fix + 56 € variabel) ergeben genau 32,00 € Projektüberschuss.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Kostenstruktur", "heading", "start")}${pill(30, 72, 192, 36, "Fixkosten: 24,00 € einmalig", "v-orange-fill", "micro")}${pill(30, 122, 192, 36, "Stückkosten: 0,80 € je Becher", "v-coral-fill", "micro")}${lines(126, 194, "Verkaufspreis: 1,60 €\nje Obstbecher", "small")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Stückbeitrag", "heading", "start")}${card(294, 70, 172, 74, "v-soft-fill", 10)}${lines(380, 96, "1,60 € − 0,80 €\n= 0,80 € Beitrag/Stück", "small")}${arrow(380, 148, 380, 170)}${pill(284, 172, 192, 38, "24,00 € / 0,80 € = 30 Stück", "v-gold-fill", "micro")}${label(380, 232, "Kostendeckung ab Becher 30", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Bei 70 Bechern", "heading", "start")}${label(536, 86, "Erlös", "micro", "start")}<rect x="588" y="72" width="140" height="22" rx="4" class="v-green"/>${label(658, 87, "112,00 €", "micro on-fill")}${label(536, 126, "Kosten", "micro", "start")}<rect x="588" y="112" width="30" height="22" rx="3" class="v-orange"/><rect x="618" y="112" width="70" height="22" rx="3" class="v-coral"/><rect x="688" y="112" width="40" height="22" rx="3" class="v-teal-fill"/>${label(638, 152, "24 € fix + 56 € var.", "micro")}${pill(538, 176, 192, 38, "Überschuss: + 32,00 €", "v-green-fill", "small")}`,
      )}`,
  },

  "pr-leittext-selbstaendig": {
    title: "Selbständige Projektsteuerung im M-Zug",
    question: "Wie steuert sich ein Team selbst, sobald Zwischenziele aus dem Ruder laufen?",
    alt: "Drei Steuerungsbausteine für M7: Eigene Prüffragen setzen, Soll-Ist-Vergleich (180 Min. Plan vs. 210 Min. Ist), sofortiges Umsteuern im Team.",
    caption: "Beispiel Schulheft-Tauschbörse: Eigene Zielgrößen festlegen und bei Zeitverzug gezielt nachbessern.",
    parts: [
      {
        label: "Eigene Leitfragen",
        note: "Das Team entwickelt selbst Messgrößen für Zeitlimit (180 Min.), Kostenobergrenze und Heftqualität.",
      },
      {
        label: "Zwischenkontrolle",
        note: "Bereits während Schritt 4 zeigt der Abgleich: 140 Min. sind für Sortieren verbraucht, Gesamtbudget von 180 Min. droht auf 210 Min. zu steigen.",
      },
      {
        label: "Eigenständig nachsteuern",
        note: "Statt abzuwarten verteilt die Gruppe Aufgaben um, nutzt vorbereitete Schilder und rettet Qualität sowie Termin.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Eigene Ziele", "heading", "start")}${sheetDoc(38, 64, 176, 122, "Team-Leittext (M7)", ["Zeitlimit: 180 Min.", "Standkosten ≤ 15 €", "Qualität: sauber prüfen", "Mindestens 40 Hefte"])}${label(126, 214, "Vor dem Start selbst gesetzt", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Zwischenstand", "heading", "start")}${label(284, 92, "Plan", "micro", "start")}<rect x="336" y="78" width="108" height="22" rx="4" class="v-blue"/>${label(450, 93, "180 Min.", "micro", "start")}${label(284, 132, "Progn.", "micro", "start")}<rect x="336" y="118" width="126" height="22" rx="4" class="v-coral"/>${label(466, 133, "210'", "micro", "start")}${pill(284, 174, 192, 34, "Abweichung: + 30 Min.", "v-coral-fill", "micro")}${label(380, 230, "Früh bemerkt beim Sortieren", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Umsteuern", "heading", "start")}${pill(538, 72, 192, 34, "Aufgaben neu verteilen", "v-teal-fill", "micro")}${pill(538, 118, 192, 34, "Fertige Schilder nutzen", "v-teal-fill", "micro")}${pill(538, 174, 192, 38, "Zielzeit 180 Min. gehalten ✓", "v-green-fill", "micro")}`,
      )}`,
  },

  "ar-arbeitsplatzmerkmale": {
    title: "Die sechs Arbeitsplatzmerkmale",
    question: "Nach welchen sechs Kriterien untersuchst du jeden betrieblichen Arbeitsplatz sachlich?",
    alt: "Drei Bereiche der Arbeitsplatzanalyse am Beispiel Zweiradmechatronik: Was und Womit (Aufgabe & Mittel), Wo und Wann (Ort, Zeit & Dauer), Wie belastend (Bedingungen mit Punktzahl 5,10).",
    caption: "Werkstatt-Beispiel: Bremsen prüfen mit Drehmomentschlüssel, 7:30–16:15 Uhr (8 Std. + 45 Min. Pause), gewichtete Bewertung 5,10 Punkte.",
    parts: [
      {
        label: "Aufgabe & Mittel",
        note: "1. Arbeitsaufgabe (z. B. Bremsen prüfen) und 2. Arbeitsmittel (Hebebühne, Drehmomentschlüssel) klären Tätigkeit und Werkzeug.",
      },
      {
        label: "Ort, Zeit & Dauer",
        note: "3. Arbeitsort (Werkhalle), 4. Arbeitszeit (Lage: 7:30–16:15 Uhr) und 5. Arbeitsdauer (8 Std. + 45 Min. Pause) zeigen den Rahmen.",
      },
      {
        label: "Arbeitsbedingungen",
        note: "6. Licht/Lärm (5 Pkt.), Ergonomie (6 Pkt.), Arbeitsmittel (5 Pkt.) und Pausen (4 Pkt.) ergeben gewichtet 5,10 von 6,00 Punkten.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Tätigkeit & Gerät", "heading", "start")}${pill(30, 74, 192, 36, "1. Aufgabe: Bremsen prüfen", "v-blue-fill", "micro")}${pill(30, 124, 192, 36, "2. Mittel: Hebebühne & Tool", "v-teal-fill", "micro")}${lines(126, 198, "Was genau wird gemacht\nund womit arbeitet man?", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Rahmendaten", "heading", "start")}${pill(284, 68, 192, 32, "3. Ort: helle Werkhalle", "v-panel", "micro")}${pill(284, 112, 192, 32, "4. Zeit: 7:30–16:15 Uhr", "v-gold-fill", "micro")}${pill(284, 156, 192, 32, "5. Dauer: 8 Std. + 45 Min.", "v-orange-fill", "micro")}${label(380, 218, "Wann? und Wie lange? trennen", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "6. Bedingungen", "heading", "start")}${sheetDoc(544, 64, 180, 116, "Gewichtete Bewertung", ["Licht/Lärm (25 %): 5 Pkt.", "Ergonomie (30 %): 6 Pkt.", "Mittel (25 %): 5 Pkt.", "Pausen (20 %): 4 Pkt."])}${pill(538, 194, 192, 36, "Gesamt: 5,10 / 6,00 Punkte", "v-green-fill", "small")}`,
      )}`,
  },

  "ar-zugangserkundung-ausbildung": {
    title: "Duale Berufsausbildung im Überblick",
    question: "Wie greifen Betrieb, Berufsschule und Kammer bei einer betrieblichen Ausbildung zusammen?",
    alt: "Duale Ausbildung am Beispiel Schreinerei: Lernort Betrieb (3–4 Tage Praxis) und Lernort Berufsschule (1–2 Tage Theorie), dazu Vergütung 820/900/980 € und Kammerprüfung.",
    caption: "Zugangserkundung Schreinerei: zwei Lernorte (Betrieb & Berufsschule), stufenweise Vergütung und Kammerabschluss.",
    parts: [
      {
        label: "Lernort Betrieb",
        note: "An drei bis vier Tagen pro Woche lernst du direkt an Werkstücken, Maschinen und im Kundenkontakt nach Ausbildungsordnung (§ 4 BBiG).",
      },
      {
        label: "Lernort Berufsschule",
        note: "Ein bis zwei Tage pro Woche (oder im Block) vertiefen Fachtheorie, Werkstoffkunde, Rechnen und Allgemeinbildung.",
      },
      {
        label: "Vergütung & Prüfung",
        note: "Azubis erhalten monatlich Vergütung (z. B. 820 € / 900 € / 980 € im 1.–3. Lehrjahr) und legen die Prüfung vor IHK oder HWK ab.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Lernort Betrieb", "heading", "start")}${factory(126, 98, 0.95)}${pill(30, 148, 192, 34, "3–4 Tage/Woche Praxis", "v-blue-fill", "micro")}${lines(126, 208, "Ausbilderin zeigt Ablauf,\nWerkzeuge und Sicherheit.", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Berufsschule", "heading", "start")}${sheetDoc(296, 66, 168, 92, "Lernort Schule", ["1–2 Tage/Woche", "Fachtheorie & Zeichnen", "Deutsch, WiB, Sozialkunde"])}${pill(284, 178, 192, 36, "Zwei Lernorte (§ 2 BBiG)", "v-teal-fill", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Lohn & Abschluss", "heading", "start")}${label(538, 86, "1. J.", "micro", "start")}<rect x="580" y="72" width="98" height="20" rx="4" class="v-green"/>${label(684, 86, "820 €", "micro", "start")}${label(538, 114, "2. J.", "micro", "start")}<rect x="580" y="100" width="108" height="20" rx="4" class="v-green"/>${label(694, 114, "900 €", "micro", "start")}${label(538, 142, "3. J.", "micro", "start")}<rect x="580" y="128" width="118" height="20" rx="4" class="v-green"/>${label(702, 142, "980 €", "micro", "start")}${pill(538, 178, 192, 36, "Prüfung durch HWK / IHK", "v-gold-fill", "micro")}`,
      )}`,
  },

  "ar-kategorien-erwerbsarbeit": {
    title: "Kategorien von Erwerbsarbeit",
    question: "Wie unterscheidest du körperliche und geistige sowie gelernte und angelernte Arbeit?",
    alt: "Kategorien der Erwerbsarbeit am Krankenhausbeispiel (40 Beschäftigte): 28 gelernte Fachkräfte (70 %) gegenüber 12 angelernten Kräften (30 %), verbunden mit körperlichen und geistigen Anforderungen.",
    caption: "Krankenhaus-Beispiel (40 Beschäftigte): 28 gelernte Fachkräfte (70 %) und 12 angelernte Kräfte (30 %).",
    parts: [
      {
        label: "Körperlich vs. geistig",
        note: "Körperliche Arbeit setzt Muskelkraft ein (z. B. Umlagern), geistige Arbeit Denken und Planen (z. B. Dokumentation) — meist kombiniert.",
      },
      {
        label: "Gelernt vs. angelernt",
        note: "Gelernte Kräfte besitzen eine mehrjährige Berufsausbildung; angelernte starten nach kurzer Einarbeitung (z. B. Transportdienst).",
      },
      {
        label: "Anteile im Betrieb",
        note: "Im Beispielbetrieb arbeiten 28 von 40 Beschäftigten gelernt (70 %) und 12 angelernt (30 %).",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Beanspruchung", "heading", "start")}${pill(30, 74, 192, 36, "Körperliche Arbeit", "v-orange-fill", "micro")}${pill(30, 122, 192, 36, "Geistige Arbeit", "v-blue-fill", "micro")}${lines(126, 192, "Pflege kombiniert beide:\nHeben + Dokumentation.", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Qualifikation", "heading", "start")}${pill(284, 74, 192, 40, "Gelernt: 2–3,5 J. Ausbildung", "v-green-fill", "micro")}${pill(284, 128, 192, 40, "Angelernt: kurze Einweisung", "v-gold-fill", "micro")}${lines(380, 198, "Abschlussprüfung erhöht\nAufgabenbreite und Lohn.", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "40 Beschäftigte", "heading", "start")}<rect x="546" y="88" width="126" height="32" rx="4" class="v-green"/><rect x="672" y="88" width="54" height="32" rx="4" class="v-gold"/>${label(609, 108, "28 (70 %)", "micro on-fill")}${label(699, 108, "12", "micro")}${label(634, 146, "28 gelernt (70 %) · 12 angelernt (30 %)", "micro")}${pill(538, 178, 192, 34, "Qualifikation sichert Chancen", "v-teal-fill", "micro")}`,
      )}`,
  },

  "ar-ordnungssystematiken-berufe": {
    title: "Berufe nach klaren Kriterien ordnen",
    question: "Wie bringen selbst gewählte Ordnungssystematiken Klarheit in die Berufsvielfalt?",
    alt: "Sechs Berufe nach zwei Ordnungssystematiken: links nach Arbeitsort (2 im Freien = 33,33 %, 4 drinnen = 66,67 %), in der Mitte nach Arbeitsmittel (Maschinen vs. Menschen/Büro), rechts als Filter für die eigene Berufswahl.",
    caption: "Sechs erkundete Berufe: nach Arbeitsort geordnet (33,33 % draußen / 66,67 % drinnen) und weiter nach Tätigkeit differenziert.",
    parts: [
      {
        label: "Kriterium 1: Arbeitsort",
        note: "Von 6 Berufen arbeiten Gärtnerin und Dachdecker überwiegend im Freien (2 = 33,33 %), vier drinnen (66,67 %).",
      },
      {
        label: "Kriterium 2: Arbeitsweise",
        note: "In geschlossenen Räumen unterscheiden sich viel Maschinenarbeit (Mechaniker) und Beratung/Büro (Bürokauffrau, Erzieherin).",
      },
      {
        label: "Systematik kombinieren",
        note: "Wer zwei oder drei eigene Kriterien kombiniert, engt tausende Berufe schnell auf wenige Favoriten ein.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Nach Arbeitsort", "heading", "start")}<rect x="34" y="76" width="60" height="24" rx="4" class="v-green"/><rect x="94" y="76" width="120" height="24" rx="4" class="v-blue"/>${label(64, 92, "33 %", "micro on-fill")}${label(154, 92, "67 %", "micro on-fill")}${pill(30, 118, 192, 34, "Im Freien: Gärtner, Dachdecker", "v-green-fill", "micro")}${pill(30, 164, 192, 40, "Drinnen: Ind.-Mech., Büro,\nMechatronik, Erzieherin", "v-blue-fill", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Nach Arbeitsweise", "heading", "start")}${pill(284, 72, 192, 44, "Viel Maschinenarbeit:\nIndustriemech., Mechatronik", "v-orange-fill", "micro")}${pill(284, 130, 192, 44, "Menschen & Büro:\nErzieherin, Bürokauffrau", "v-teal-fill", "micro")}${label(380, 206, "Trennscharf innerhalb ‚drinnen‘", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Deine Auswahl", "heading", "start")}${sheetDoc(546, 68, 176, 110, "Eigener Berufefilter", ["1. Ort: Drinnen oder draußen?", "2. Kontakt: Technik / Mensch?", "3. Ausbildung: 2–3,5 Jahre"])}${pill(538, 194, 192, 34, "Treffer im Portfolio sichern", "v-gold-fill", "micro")}`,
      )}`,
  },

  "ar-abhaengig-selbstaendig": {
    title: "Abhängige Beschäftigung vs. Selbständigkeit",
    question: "Was unterscheidet eine angestellte Bäckerin rechtlich und wirtschaftlich von der selbständigen Bäckermeisterin?",
    alt: "Vergleich von abhängiger Beschäftigung (§ 611a BGB: fester Lohn, Weisung, bezahlter Urlaub) und Selbständigkeit (§ 84 HGB: Freiheit, Gewinnchance, eigenes Verlustrisiko) mit Risiko-Schutz-Abwägung rechts.",
    caption: "Weisung & Planbarkeit (§ 611a BGB) stehen gegen Gestaltungsfreiheit & Risiko (§ 84 HGB).",
    parts: [
      {
        label: "Abhängig (§ 611a BGB)",
        note: "Die Bäckereigesellin erhält festen Lohn, bezahlten Urlaub und Krankenfortzahlung, ist aber an Dienstplan und Weisungen gebunden.",
      },
      {
        label: "Selbständig (§ 84 HGB)",
        note: "Die Bäckermeisterin bestimmt Sortiment, Preise und Arbeitszeit frei, trägt aber volles Risiko bei Defekten oder Ausfällen.",
      },
      {
        label: "Sicherheit vs. Freiheit",
        note: "Wer Sicherheit und planbare Arbeitszeiten sucht, wählt oft eine Anstellung; wer gestalten will und Risiko trägt, wählt Selbständigkeit.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Abhängige Arbeit", "heading", "start")}${person(126, 94, "v-blue")}${pill(30, 114, 192, 30, "Fester Lohn · § 611a BGB", "v-blue-fill", "micro")}${pill(30, 154, 192, 30, "Bezahlter Urlaub & Schutz", "v-green-fill", "micro")}${pill(30, 194, 192, 30, "Weisung durch Betrieb", "v-panel", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Selbständigkeit", "heading", "start")}${person(380, 94, "v-orange")}${pill(284, 114, 192, 30, "Freie Entscheidung · § 84 HGB", "v-orange-fill", "micro")}${pill(284, 154, 192, 30, "Gewinn behalten", "v-gold-fill", "micro")}${pill(284, 194, 192, 30, "Volles Verlustrisiko tragen", "v-coral-fill", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Abwägung", "heading", "start")}${shield(634, 96, 0.85, "v-teal")}${lines(634, 154, "Kein Weg ist pauschal besser:\nPlanbare Absicherung\nvs. volle eigene Verantwortung.", "micro")}${pill(538, 202, 192, 30, "Vorsorge zählt für beide", "v-teal-fill", "micro")}`,
      )}`,
  },

  "ar-planspiel-selbstaendigkeit": {
    title: "Planspiel: Vom Umsatz zum echten Ergebnis",
    question: "Warum darf ein Selbständiger seinen Stundenumsatz nicht als persönliches Gehalt betrachten?",
    alt: "Maßstäbliches Balkenbild zum Planspiel Mobile Fahrrad-Wartung: 6.000,00 € Umsatz (100 Std. à 60 €) minus 1.500,00 € Material (25 %) minus 1.800,00 € Fixkosten ergibt 2.700,00 € Ergebnis vor Steuern (45 %).",
    caption: "Planspiel-Beispiel (6.000 € Umsatz): 25 % Material + 1.800 € Fixkosten abziehen → 2.700 € Ergebnis vor Steuern.",
    parts: [
      {
        label: "Monatsumsatz 6.000 €",
        note: "100 verrechenbare Auftragsstunden zu je 60,00 € ergeben 6.000,00 € Umsatz — unbezahlte Büro- und Fahrzeit fällt zusätzlich an.",
      },
      {
        label: "Material & Fixkosten",
        note: "Zuerst gehen 25 % Material (1.500,00 €) sowie 1.800,00 € feste Monatskosten (Werkstatt, Transporter, Versicherung) ab.",
      },
      {
        label: "Ergebnis 2.700 €",
        note: "Es bleiben 2.700,00 € vor Steuern (45 % Marge) — erst daraus zahlt die Unternehmerin Krankenversicherung, Altersvorsorge und Steuer.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Umsatz 100 %", "heading", "start")}${coins(126, 98, 1.0)}${pill(30, 138, 192, 34, "100 Std. · 60,00 € = 6.000 €", "v-blue-fill", "micro")}${lines(126, 200, "Achtung: Fahrten und Büro\nzahlt kein Kunde extra.", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Kostenabzüge", "heading", "start")}<rect x="288" y="80" width="184" height="24" rx="4" class="v-blue"/>${label(380, 96, "6.000 € (100 %)", "micro on-fill")}<rect x="288" y="114" width="46" height="24" rx="4" class="v-orange"/><rect x="334" y="114" width="55" height="24" rx="4" class="v-coral"/><rect x="389" y="114" width="83" height="24" rx="4" class="v-green"/>${label(311, 130, "25%", "micro on-fill")}${label(361, 130, "30%", "micro on-fill")}${label(430, 130, "45%", "micro on-fill")}${lines(380, 166, "Material: 1.500 € (25 %)\nFixkosten: 1.800 € (30 %)", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Ergebnis", "heading", "start")}${pill(538, 76, 192, 42, "Vor Steuern: 2.700,00 €", "v-green-fill", "small")}${lines(634, 148, "Davon selbst zu zahlen:\n• Einkommensteuer\n• Krankenversicherung\n• Altersvorsorge & Rücklage", "micro")}`,
      )}`,
  },
};
