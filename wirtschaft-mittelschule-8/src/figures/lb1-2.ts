import {
  arrow,
  checkLine,
  coins,
  type ConceptFigure,
  factory,
  label,
  lines,
  miniBar,
  person,
  pill,
  sheetDoc,
  stall,
  triptych,
} from "./draw";

/** Full-width pill inside a panel. */
const P = (x0: number, y: number, text: string, cls = "v-pill", h = 30): string =>
  pill(x0 + 16, y, 192, h, text, cls, "micro");
/** Centered multi-line note inside a panel. */
const N = (x0: number, y: number, text: string): string => lines(x0 + 112, y, text, "micro");
const down = (x0: number, y: number): string => arrow(x0 + 112, y, x0 + 112, y + 14);

export const LB1_2_FIGURES: Record<string, ConceptFigure> = {
  "pr-komplexe-aufgabe": {
    title: "Vom Auftrag zur Auswertung: 40 Handyhalter",
    question: "Wie wird aus einem Basarauftrag ein geplantes, gefertigtes und ausgewertetes Produkt?",
    alt: "Drei Felder: Initiative und Planung mit 78,00 € Gesamtkosten, Durchführung und Präsentation am Basar, Reflexion mit 82,00 € Überschuss.",
    caption: "Beispiel 8b: 40 · 1,20 € + 30,00 € = 78,00 € Kosten, 160,00 € Einnahmen, 82,00 € Überschuss.",
    parts: [
      { label: "Initiative & Planung", note: "Auftrag klären, Arbeitspakete verteilen, Material und Kosten planen: 40 · 1,20 € + 30,00 € = 78,00 €, also 1,95 € je Stück." },
      { label: "Durchführung & Präsentation", note: "Sägen, Schleifen, Lackieren in drei Gruppen; danach Verkauf und Präsentation mit Fotos und Abrechnung." },
      { label: "Reflexion", note: "Soll und Ist vergleichen: 160,00 € Einnahmen minus 78,00 € Kosten ergeben 82,00 € Überschuss; das Lackieren dauerte einen Tag länger." },
    ],
    draw: () =>
      triptych([
        ["Plan vorab", (x) => `${P(x, 62, "1 · Initiative: Basarauftrag", "v-teal-fill")}${down(x, 94)}${P(x, 110, "2 · Planung: Pakete & Kosten", "v-blue-fill")}${sheetDoc(x + 24, 150, 176, 90, "Kostenplan", ["40 · 1,20 € = 48,00 €", "Feste Kosten 30,00 €", "Summe 78,00 €"])}`],
        ["Umsetzen", (x) => `${factory(x + 70, 92, 0.8)}${stall(x + 160, 96, 0.8)}${P(x, 134, "3 · Durchführung: 3 Gruppen", "v-gold-fill")}${down(x, 166)}${P(x, 182, "4 · Präsentation: Fotos & Kasse", "v-orange-fill")}`],
        ["5 · Reflexion", (x) => `${label(x + 20, 82, "Kosten", "micro", "start")}${miniBar(x + 86, 70, 80, 78, 160, "v-coral", "78 €")}${label(x + 20, 110, "Einnahmen", "micro", "start")}${miniBar(x + 86, 98, 80, 160, 160, "v-green", "160 €")}${P(x, 130, "Überschuss 82,00 €", "v-green-fill")}${N(x, 190, "Lackieren dauerte\neinen Tag länger:\nfrüher beginnen.")}`],
      ]),
  },

  "pr-leittext-weitgehend": {
    title: "Sechs Schritte, ein Fachgespräch",
    question: "Wer macht was, wenn das Team die Leittextmethode weitgehend selbständig anwendet?",
    alt: "Drei Felder: Informieren und Planen durch das Team, Entscheiden im Fachgespräch mit der Lehrkraft (Schilfrohr 4,80 € statt Bambus 6,40 €), Ausführen, Kontrollieren und Bewerten.",
    caption: "Beispiel Insektenhotel: Das Team arbeitet die Leitfragen ab, die Lehrkraft berät beim Entscheiden.",
    parts: [
      { label: "Informieren & Planen", note: "Das Team beantwortet die Leitfragen zu Material, Maßen und Sicherheit und erstellt einen Arbeitsplan mit 6 Werkstattstunden." },
      { label: "Entscheiden", note: "Im Fachgespräch prüft die Lehrkraft den Plan; das Team wählt Schilfrohr für 4,80 € statt Bambus für 6,40 €." },
      { label: "Ausführen, Kontrollieren, Bewerten", note: "Bauen nach Plan, Kontrollbogen für Maße und Befestigung, dann Selbst- und Fremdbewertung vergleichen." },
    ],
    draw: () =>
      triptych([
        ["Team arbeitet", (x) => `${sheetDoc(x + 24, 60, 176, 100, "1 · Informieren", ["Welche Röhrchen?", "Welche Maße?", "Welche Regeln?"])}${P(x, 176, "2 · Planen: 6 Werkstattstunden", "v-blue-fill")}`],
        ["3 · Entscheiden", (x) => `${person(x + 70, 100, "v-teal")}${person(x + 154, 100, "v-orange")}${label(x + 70, 122, "Team", "micro")}${label(x + 154, 122, "Lehrkraft", "micro")}${P(x, 138, "Bambus 6,40 €", "v-soft-fill", 26)}${P(x, 170, "Schilfrohr 4,80 € ✓", "v-green-fill", 26)}${N(x, 222, "Fachgespräch vor\ndem Ausführen")}`],
        ["Umsetzen & prüfen", (x) => `${P(x, 62, "4 · Ausführen", "v-gold-fill")}${down(x, 94)}${P(x, 110, "5 · Kontrollieren: Kontrollbogen", "v-teal-fill")}${down(x, 142)}${P(x, 158, "6 · Bewerten: selbst & fremd", "v-purple-fill")}${N(x, 214, "Lehrkraft berät,\nTeam handelt.")}`],
      ]),
  },

  "pr-projektsteuerung": {
    title: "Zeitplan mit Puffer und Meilensteinen",
    question: "Reicht die Zeit bis zum Basar, wenn noch etwas schiefgeht?",
    alt: "Drei Felder: Arbeitspakete 6, 14 und 4 Stunden, 20 % Puffer ergeben 28,8 Stunden; mit 4 Projektstunden pro Woche 8 Wochen; Soll-Ist-Vergleich an Meilensteinen.",
    caption: "24 Std. Arbeit + 20 % Puffer = 28,8 Std.; 28,8 : 4 = 7,2, also 8 Wochen bis zum Basar.",
    parts: [
      { label: "Arbeitspakete", note: "Planung 6 Std., Durchführung 14 Std., Präsentation und Reflexion 4 Std. ergeben 24 Std. Arbeitszeit." },
      { label: "Puffer & Wochen", note: "20 % Puffer sind 4,8 Std.; 28,8 Std. bei 4 Projektstunden pro Woche brauchen 7,2, also 8 Wochen; bei 2 Stunden wären es 15 Wochen." },
      { label: "Meilensteine", note: "An jedem Meilenstein vergleicht das Team Soll und Ist und steuert nach, etwa durch Umverteilen von Aufgaben." },
    ],
    draw: () =>
      triptych([
        ["Arbeitspakete", (x) => `${label(x + 20, 80, "Planung", "micro", "start")}${miniBar(x + 102, 68, 70, 6, 14, "v-teal", "6 Std.")}${label(x + 20, 108, "Durchführung", "micro", "start")}${miniBar(x + 102, 96, 70, 14, 14, "v-blue", "14 Std.")}${label(x + 20, 136, "Abschluss", "micro", "start")}${miniBar(x + 102, 124, 70, 4, 14, "v-orange", "4 Std.")}${P(x, 160, "Summe: 24 Std.", "v-soft-fill")}${N(x, 214, "Jedes Paket hat\neine Zuständigkeit.")}`],
        ["Puffer & Wochen", (x) => `${P(x, 62, "+ 20 % Puffer = 4,8 Std.", "v-gold-fill")}${down(x, 94)}${P(x, 110, "Gesamt 28,8 Std.", "v-blue-fill")}${checkLine(x + 18, 172, "4 Std./Woche: 8 Wochen", true)}${checkLine(x + 18, 200, "2 Std./Woche: 15 Wochen", false)}${N(x, 232, "Basar in 8 Wochen")}`],
        ["Meilensteine", (x) => `<line x1="${x + 30}" y1="90" x2="${x + 196}" y2="90" class="v-outline-thick"/>${[0, 1, 2].map((i) => `<polygon points="${x + 50 + i * 60},78 ${x + 62 + i * 60},90 ${x + 50 + i * 60},102 ${x + 38 + i * 60},90" class="${i < 2 ? "v-green" : "v-gold"}"/>`).join("")}${label(x + 50, 120, "Material", "micro")}${label(x + 110, 120, "Prototyp", "micro")}${label(x + 170, 120, "Basar", "micro")}${P(x, 140, "Soll-Ist-Vergleich", "v-teal-fill")}${N(x, 196, "Rückstand?\nAufgaben umverteilen\noder Zusatzstunde.")}`],
      ]),
  },

  "pr-leittext-selbstaendig": {
    title: "Den eigenen Leittext schreiben (M8)",
    question: "Wie steuert ein Team ein Projekt ganz selbst und prüft es messbar?",
    alt: "Drei Felder: eigene Leitfragen zum Smoothie-Stand, messbare Kontrollkriterien wie 0,3 l mit höchstens 10 ml Abweichung, Bewertung auf einer Skala von 1 bis 4.",
    caption: "Beispiel Smoothie-Stand: eigene Leitfragen, messbare Kriterien, Selbst- und Fremdbewertung.",
    parts: [
      { label: "Eigene Leitfragen", note: "Das Team schreibt selbst Fragen wie: Welche Hygieneregeln gelten? Wie viel Obst brauchen wir für 80 Becher?" },
      { label: "Messbare Kriterien", note: "Kontrollbogen mit Wert und Toleranz: 0,3 l ± 10 ml, Preisschild aus 2 m lesbar, Kühlbox höchstens 7 °C." },
      { label: "Bewerten", note: "Jedes Mitglied bewertet Ergebnis und Zusammenarbeit von 1 bis 4; große Abweichungen werden besprochen." },
    ],
    draw: () =>
      triptych([
        ["Leitfragen", (x) => `${sheetDoc(x + 24, 60, 176, 118, "Unser Leittext", ["Welche Hygieneregeln?", "Obst für 80 Becher?", "Welcher Preis?", "Wer macht was?"])}${N(x, 210, "Keine fremden Vorgaben:\nDas Team fragt selbst.")}`],
        ["Kontrollbogen", (x) => `${checkLine(x + 18, 84, "0,3 l ± 10 ml", true)}${checkLine(x + 18, 114, "Schild aus 2 m lesbar", true)}${checkLine(x + 18, 144, "Kühlbox ≤ 7 °C", true)}${checkLine(x + 18, 174, "„schön ordentlich“", false)}${N(x, 214, "Messbar: Wert\nund Toleranz")}`],
        ["Bewerten", (x) => `${label(x + 20, 82, "Selbst", "micro", "start")}${miniBar(x + 80, 70, 90, 4, 4, "v-teal", "4")}${label(x + 20, 110, "Team", "micro", "start")}${miniBar(x + 80, 98, 90, 2, 4, "v-orange", "2")}${P(x, 132, "Abweichung besprechen", "v-gold-fill")}${N(x, 190, "Folgerung festhalten:\nAufgabenliste\nmit Namen.")}`],
      ]),
  },

  "bo-berufsberatung-angebote": {
    title: "Vier Wege zu Berufsinformationen",
    question: "Welche Quelle beantwortet welche Frage zur Berufswahl?",
    alt: "Drei Felder: Berufsberatung und BIZ nach § 29 SGB III, Online-Portale BERUFENET, meinBERUF und Check-U, Kammern und Ausbildungsmessen.",
    caption: "Beispiel Can: BERUFENET für Tätigkeiten, Messe für Eindrücke, Handwerkskammer für Betriebe, Berufsberatung für die Entscheidung.",
    parts: [
      { label: "Berufsberatung & BIZ", note: "Die Agentur für Arbeit berät persönlich zu Berufswahl, Ausbildung und Schulwegen (§ 29 SGB III); im BIZ gibt es Infomaterial." },
      { label: "Online-Portale", note: "BERUFENET mit Steckbriefen, meinBERUF für den Einstieg, Check-U als Test zu Interessen und Stärken." },
      { label: "Kammern & Messen", note: "IHK und Handwerkskammer kennen Ausbildungsbetriebe; auf Messen fragst du Auszubildende direkt." },
    ],
    draw: () =>
      triptych([
        ["Beratung", (x) => `${person(x + 70, 100, "v-blue")}${person(x + 150, 100, "v-orange")}${label(x + 70, 122, "du", "micro")}${label(x + 150, 122, "Beraterin", "micro")}${P(x, 140, "§ 29 SGB III: Berufsberatung", "v-blue-fill")}${P(x, 180, "BIZ: Infomaterial", "v-soft-fill")}`],
        ["Online", (x) => `${P(x, 62, "BERUFENET: Steckbriefe", "v-teal-fill")}${P(x, 102, "meinBERUF: Einstieg", "v-gold-fill")}${P(x, 142, "Check-U: Interessentest", "v-purple-fill")}${N(x, 204, "neutral und für jeden\nanerkannten Beruf")}`],
        ["Kammern & Messen", (x) => `${factory(x + 66, 96, 0.75)}${stall(x + 158, 98, 0.8)}${P(x, 136, "IHK · HWK: Ausbildungsbetriebe", "v-orange-fill")}${P(x, 176, "Messe: Azubis fragen", "v-green-fill")}`],
      ]),
  },

  "bo-berufswahlprozess-verwalten": {
    title: "Das Portfolio als Steuerzentrale",
    question: "Wie hältst du deinen Berufswahlprozess geordnet, aktuell und überprüfbar?",
    alt: "Drei Felder: Portfolio mit fünf Registern, Fahrplan mit Fristen (Bewerbungsschluss in 10 Wochen, 3 Wochen Bearbeitung, Start in spätestens 7 Wochen), regelmäßiger Abgleich des Berufswunsches.",
    caption: "Lara: 10 Wochen bis zur Frist − 3 Wochen Bearbeitung = Start in spätestens 7 Wochen.",
    parts: [
      { label: "Dokumentieren", note: "Fünf Register: Ich, Berufe, Praktika, Bewerbung, Termine. Neue Ergebnisse kommen sofort hinein." },
      { label: "Verwalten", note: "Ein Fahrplan mit Fristen: Bewerbungsschluss in 10 Wochen, 3 Wochen Arbeit, also Start in spätestens 7 Wochen." },
      { label: "Überprüfen", note: "Nach jeder Erfahrung fragt Lara, ob der Berufswunsch noch passt; geprüfte Wünsche werden markiert, nicht gelöscht." },
    ],
    draw: () =>
      triptych([
        ["Dokumentieren", (x) => `${["Ich", "Berufe", "Praktika", "Bewerbung", "Termine"].map((r, i) => `<rect x="${x + 30 + i * 6}" y="${66 + i * 30}" width="150" height="26" rx="6" class="${["v-teal-fill", "v-blue-fill", "v-orange-fill", "v-purple-fill", "v-gold-fill"][i]}"/>${label(x + 105 + i * 6, 83 + i * 30, r, "micro")}`).join("")}`],
        ["Verwalten", (x) => `<line x1="${x + 24}" y1="110" x2="${x + 200}" y2="110" class="v-outline-thick"/>${label(x + 24, 96, "heute", "micro", "start")}<circle cx="${x + 147}" cy="110" r="7" class="v-gold"/>${label(x + 147, 136, "Start: Woche 7", "micro")}<circle cx="${x + 200}" cy="110" r="7" class="v-coral"/>${label(x + 196, 96, "Frist: 10", "micro", "end")}${P(x, 158, "10 − 3 = 7 Wochen", "v-blue-fill")}${N(x, 214, "Fristen stehen im\nBerufswahlfahrplan.")}`],
        ["Überprüfen", (x) => `${P(x, 62, "Praktikum Kita", "v-soft-fill", 26)}${checkLine(x + 18, 118, "Arbeit mit Kindern", true)}${checkLine(x + 18, 146, "Lautstärke", false)}${down(x, 158)}${P(x, 176, "Wunsch passt noch?", "v-green-fill")}${N(x, 230, "Ergebnis eintragen")}`],
      ]),
  },

  "bo-beratungsgespraech": {
    title: "Ein Beratungsgespräch in drei Teilen",
    question: "Was tust du vor, während und nach dem Termin bei der Berufsberatung?",
    alt: "Drei Felder: Vorbereiten mit drei Fragen und Portfolio, Gespräch aktiv führen und notieren, Nachbereiten mit zwei nächsten Schritten.",
    caption: "Beispiel Mia: drei Fragen, zwei vorgeschlagene Berufe, zwei nächste Schritte im Fahrplan.",
    parts: [
      { label: "Vorbereiten", note: "Interessen, Stärken, Noten notieren, drei konkrete Fragen aufschreiben und das Portfolio mitnehmen." },
      { label: "Gespräch führen", note: "Offen erzählen, Fragen stellen, nachfragen und mitschreiben; am Ende nächste Schritte vereinbaren." },
      { label: "Nachbereiten", note: "Ergebnisse mit Datum ins Portfolio eintragen und die vereinbarten Aufgaben erledigen." },
    ],
    draw: () =>
      triptych([
        ["Vorbereiten", (x) => `${sheetDoc(x + 24, 60, 176, 110, "Meine Fragen", ["1. Gestaltung + Technik?", "2. Reicht mein Abschluss?", "3. Betriebe in der Region?"])}${P(x, 186, "Portfolio einpacken", "v-teal-fill")}`],
        ["Gespräch", (x) => `${person(x + 70, 100, "v-blue")}${person(x + 154, 100, "v-orange")}${label(x + 70, 122, "Mia", "micro")}${label(x + 154, 122, "Beraterin", "micro")}${P(x, 140, "fragen · nachfragen · notieren", "v-blue-fill")}${N(x, 196, "Vorschläge:\nMediengestalter/in,\nProduktdesigner/in")}`],
        ["Nachbereiten", (x) => `${checkLine(x + 18, 86, "Steckbriefe lesen", true)}${checkLine(x + 18, 116, "Praktikum anfragen", true)}${P(x, 140, "Eintrag im Fahrplan", "v-gold-fill")}${N(x, 200, "Die Entscheidung\nbleibt bei dir.")}`],
      ]),
  },

  "bo-stellenmarkt-recherche": {
    title: "Ausbildungsangebote finden und vergleichen",
    question: "Wo findest du Ausbildungsplätze in deiner Region, und worauf achtest du beim Lesen?",
    alt: "Drei Felder: Medien wie Jobsuche der BA, IHK-Lehrstellenbörse und Lehrstellenradar; Vergleichstabelle mit Schulabschluss, Vergütung und Frist; Mindestvergütung nach § 17 BBiG mit 700 €, 826 € und 945 €.",
    caption: "Rechenbeispiel mit angenommenen 700 € im 1. Jahr: 2. Jahr 826 €, 3. Jahr 945 € (§ 17 BBiG).",
    parts: [
      { label: "Medien", note: "Jobsuche der BA, IHK-Lehrstellenbörse, Lehrstellenradar der Handwerkskammern, Betriebsseiten, Zeitungen und Messen." },
      { label: "Vergleichen", note: "Beruf, Ort, Schulabschluss, Vergütung und Frist in einer Tabelle; manche Angebote verlangen den mittleren Schulabschluss." },
      { label: "Mindestvergütung", note: "Nach § 17 BBiG liegt sie im 2. Jahr 18 % und im 3. Jahr 35 % über dem 1. Jahr: 700 € → 826 € → 945 €." },
    ],
    draw: () =>
      triptych([
        ["Suchen", (x) => `${P(x, 62, "Jobsuche der BA", "v-blue-fill")}${P(x, 100, "IHK-Lehrstellenbörse", "v-teal-fill")}${P(x, 138, "Lehrstellenradar (HWK)", "v-orange-fill")}${P(x, 176, "Betriebsseiten · Messen", "v-soft-fill")}`],
        ["Vergleichen", (x) => `${sheetDoc(x + 16, 60, 192, 132, "Lagerlogistik", ["A: 1.050 € · mittlerer Abschl.", "B: 980 € · Mittelschule", "Entfernung · Frist", "Beginn · Dauer"])}${N(x, 216, "Abschluss und Frist\nzuerst prüfen")}`],
        ["§ 17 BBiG", (x) => `${label(x + 20, 82, "1. Jahr", "micro", "start")}${miniBar(x + 72, 70, 90, 700, 945, "v-teal", "700 €")}${label(x + 20, 110, "2. Jahr", "micro", "start")}${miniBar(x + 72, 98, 90, 826, 945, "v-blue", "826 €")}${label(x + 20, 138, "3. Jahr", "micro", "start")}${miniBar(x + 72, 126, 90, 945, 945, "v-purple", "945 €")}${N(x, 180, "+18 % · +35 %\nauf das 1. Jahr\n(angenommener Betrag)")}`],
      ]),
  },

  "bo-kompetenzprofil": {
    title: "Kompetenzprofil trifft Anforderungsprofil",
    question: "Wie findest du heraus, welches Berufsbild zu deinen Stärken und Interessen passt?",
    alt: "Drei Felder: vier Kompetenzarten, Profilvergleich von Niklas mit Kfz-Mechatroniker/in (Abstand 1, 95 % Passung) und Kaufmann/-frau im Einzelhandel (Abstand 7, 65 %), Lücken erkennen.",
    caption: "Niklas (5, 3, 5, 4) gegen Kfz-Mechatroniker/in (6, 3, 5, 4): 1 Punkt Abstand, 95 % Passung.",
    parts: [
      { label: "Kompetenzarten", note: "Fachliche, methodische, soziale und persönliche Stärken plus Interessen und Neigungen bilden dein Kompetenzprofil." },
      { label: "Profilvergleich", note: "Punkt für Punkt vergleichen: Abstand 1 bedeutet 95 % Passung, Abstand 7 nur 65 %." },
      { label: "Zuordnen", note: "Passende Berufsbilder genauer prüfen, Lücken gezielt schließen oder verwandte Berufe suchen." },
    ],
    draw: () =>
      triptych([
        ["Mein Profil", (x) => `${P(x, 62, "fachlich: Mathe 2", "v-blue-fill", 26)}${P(x, 94, "methodisch: genau", "v-teal-fill", 26)}${P(x, 126, "sozial: teamfähig", "v-orange-fill", 26)}${P(x, 158, "persönlich: zuverlässig", "v-purple-fill", 26)}${N(x, 214, "plus Interessen\nund Neigungen")}`],
        ["Vergleich", (x) => `${["Technik 5 | 6", "Kommunikation 3 | 3", "Sorgfalt 5 | 5", "Rechnen 4 | 4"].map((r, i) => label(x + 24, 80 + i * 24, r, "micro", "start")).join("")}${P(x, 176, "Abstand 1 → 95 %", "v-green-fill")}${N(x, 230, "Niklas | Kfz-Mechatroniker/in")}`],
        ["Zuordnen", (x) => `${label(x + 20, 82, "Kfz", "micro", "start")}${miniBar(x + 70, 70, 100, 95, 100, "v-green", "95 %")}${label(x + 20, 110, "Einzelh.", "micro", "start")}${miniBar(x + 70, 98, 100, 65, 100, "v-gold", "65 %")}${P(x, 132, "Praktikum im Kfz-Betrieb", "v-teal-fill")}${N(x, 192, "Ein Modell ersetzt\nkeine Entscheidung.")}`],
      ]),
  },

  "bo-praktikum-erproben": {
    title: "Das Betriebspraktikum als Praxistest",
    question: "Was erprobst du im Praktikum, und wie hältst du fest, ob der Beruf zu dir passt?",
    alt: "Drei Felder: Regelklasse zwei, M-Zug ein mindestens einwöchiges Praktikum; Tätigkeiten unter Anleitung in der Zahnarztpraxis; Tagebuch mit Tätigkeit, Beobachtung und Einschätzung.",
    caption: "Leonie: Zahnarztpraxis und Gärtnerei im Vergleich; der Beruf mit Menschen und Gesundheit bleibt ihr Wunsch.",
    parts: [
      { label: "Praktika in Klasse 8", note: "Regelklasse: zwei jeweils mindestens einwöchige Praktika; M-Zug: ein mindestens einwöchiges Praktikum." },
      { label: "Erproben", note: "Unter Anleitung echte Tätigkeiten ausführen und den Berufswunsch an Arbeitszeit, Belastung und Umgangston prüfen." },
      { label: "Festhalten", note: "Tagebuch mit Tätigkeiten, Beobachtungen und persönlicher Einschätzung; Fotos nur mit Erlaubnis." },
    ],
    draw: () =>
      triptych([
        ["Klasse 8", (x) => `${P(x, 66, "R8: 2 Praktika · je ≥ 1 Woche", "v-blue-fill")}${P(x, 108, "M8: 1 Praktikum · ≥ 1 Woche", "v-teal-fill")}${factory(x + 112, 186, 0.9)}`],
        ["Erproben", (x) => `${person(x + 70, 100, "v-orange")}${person(x + 150, 100, "v-blue")}${label(x + 70, 122, "Leonie", "micro")}${label(x + 150, 122, "Anleitung", "micro")}${checkLine(x + 18, 156, "Patienten begleiten", true)}${checkLine(x + 18, 184, "Instrumente desinfizieren", true)}${checkLine(x + 18, 212, "langes Stehen", false)}`],
        ["Tagebuch", (x) => `${sheetDoc(x + 24, 60, 176, 120, "Dienstag", ["Tätigkeit: Instrumente", "Beobachtung: Termine", "Einschätzung: gefällt mir", "Fotos nur mit Erlaubnis"])}${P(x, 194, "Wunsch geprüft", "v-green-fill")}`],
      ]),
  },

  "bo-praktikum-dokumentieren": {
    title: "Vor, während und nach dem Praktikum",
    question: "Wie bereitest du ein Praktikum vor, und was machst du danach mit deinen Erfahrungen?",
    alt: "Drei Felder: inhaltliche und organisatorische Vorbereitung (Weg 35 Minuten, vier Fragen), tägliche Dokumentation, Präsentation mit fünf Folien und Folgerung für den Berufswahlprozess.",
    caption: "Ben: Weg getestet, vier Fragen notiert, fünf Folien präsentiert, Folgerung ins Portfolio.",
    parts: [
      { label: "Vorbereiten", note: "Inhaltlich: Beruf und Betrieb kennenlernen, Fragen notieren. Organisatorisch: Weg, Zeit, Kleidung, Ansprechpartner, Krankmeldung." },
      { label: "Dokumentieren", note: "Jeden Tag einen Tagesbericht mit Tätigkeiten und Beobachtungen schreiben." },
      { label: "Nachbereiten", note: "Bericht oder Mappe erstellen, präsentieren und eine Folgerung für den eigenen Berufswahlprozess ziehen." },
    ],
    draw: () =>
      triptych([
        ["Vorbereiten", (x) => `${P(x, 62, "inhaltlich: 4 Fragen", "v-teal-fill")}${P(x, 100, "Weg: 35 Min. getestet", "v-blue-fill")}${P(x, 138, "Kleidung · Ansprechpartner", "v-soft-fill")}${P(x, 176, "Krankheit: Betrieb + Schule", "v-coral-fill")}`],
        ["Dokumentieren", (x) => `${[0, 1, 2, 3, 4].map((i) => `<rect x="${x + 28 + i * 34}" y="70" width="28" height="36" rx="4" class="v-paper"/>${label(x + 42 + i * 34, 92, ["Mo", "Di", "Mi", "Do", "Fr"][i], "micro")}`).join("")}${P(x, 124, "Tagesberichte", "v-gold-fill")}${N(x, 184, "Tätigkeiten und\nBeobachtungen\njeden Abend")}`],
        ["Nachbereiten", (x) => `${sheetDoc(x + 24, 60, 176, 120, "5 Folien", ["Betrieb", "Tätigkeiten", "Arbeitsablauf", "Gefallen / schwer", "Fazit"])}${P(x, 194, "Folgerung ins Portfolio", "v-green-fill")}`],
      ]),
  },

  "bo-bewerbung-praktikum": {
    title: "Die vollständige Praktikumsbewerbung",
    question: "Wie baust du Anschreiben und Lebenslauf für einen Praktikumsplatz auf?",
    alt: "Drei Felder: vorher anrufen und Ansprechpartnerin erfragen, Aufbau des Anschreibens von Absender bis Anlagen, Lebenslauf und Checkliste vor dem Absenden.",
    caption: "Aylin: Anruf in der Apotheke, Anschreiben an Frau Berger, Checkliste, freundliches Nachhaken nach einer Woche.",
    parts: [
      { label: "Vorab klären", note: "Kurz anrufen: Nimmt der Betrieb Praktikanten, wer ist zuständig, bis wann soll die Bewerbung kommen?" },
      { label: "Anschreiben", note: "Absender, Empfänger, Datum, Betreff, Anrede, Einleitung, Hauptteil mit Interesse und Stärken, Schluss, Gruß, Unterschrift, Anlagen." },
      { label: "Lebenslauf & Check", note: "Tabellarischer Lebenslauf; vor dem Absenden Rechtschreibung, Namen, Datum und Anlagen prüfen." },
    ],
    draw: () =>
      triptych([
        ["Vorab", (x) => `${person(x + 70, 104, "v-orange")}${person(x + 154, 104, "v-teal")}${label(x + 112, 80, "Telefon", "micro")}${P(x, 130, "Ansprechpartnerin: Frau Berger", "v-blue-fill")}${P(x, 170, "Zeitraum: 9. bis 13. März", "v-soft-fill")}`],
        ["Anschreiben", (x) => `${sheetDoc(x + 16, 58, 192, 186, "Aufbau", ["Absender · Empfänger", "Ort, Datum", "Betreff", "Anrede", "Einleitung · Hauptteil", "Schluss · Gruß", "Unterschrift · Anlagen"])}`],
        ["Lebenslauf & Check", (x) => `${sheetDoc(x + 24, 60, 176, 96, "Lebenslauf", ["Persönliche Daten", "Schule · Praktika", "Kenntnisse"])}${checkLine(x + 18, 182, "Rechtschreibung", true)}${checkLine(x + 18, 210, "Anlagen vollständig", true)}`],
      ]),
  },

  "bo-bewerbungsmappe-ausbildung": {
    title: "Bewerbungsmappe für den Ausbildungsplatz (R8)",
    question: "Was gehört in eine vollständige Bewerbung, und wie verschickst du sie online?",
    alt: "Drei Felder: Reihenfolge Anschreiben, Deckblatt optional, Lebenslauf, Zeugnisse und Nachweise; Online-Bewerbung als eine PDF-Datei mit klarem Namen; seriöse E-Mail-Adresse und Probe-Mail.",
    caption: "Jonas: Bewerbung_Anlagenmechaniker_Jonas_Weber.pdf, seriöse Adresse, Probe-Mail an sich selbst.",
    parts: [
      { label: "Inhalt", note: "Anschreiben, optional Deckblatt, Lebenslauf, letzte zwei Zeugnisse, Praktikumsbescheinigungen und weitere Nachweise; ein Foto ist freiwillig." },
      { label: "Online", note: "Alle Teile in einer PDF-Datei mit eindeutigem Namen, kurzer Begleittext und klarer Betreff." },
      { label: "Prüfen", note: "Seriöse E-Mail-Adresse, Unterlagen von einer anderen Person prüfen lassen, Probe-Mail an sich selbst schicken." },
    ],
    draw: () =>
      triptych([
        ["Inhalt", (x) => `${["Anschreiben", "Deckblatt (optional)", "Lebenslauf", "Zeugnisse", "Nachweise"].map((r, i) => P(x, 60 + i * 34, r, ["v-blue-fill", "v-soft-fill", "v-teal-fill", "v-orange-fill", "v-gold-fill"][i], 28)).join("")}`],
        ["Online", (x) => `<rect x="${x + 70}" y="66" width="84" height="104" rx="8" class="v-paper"/><rect x="${x + 70}" y="66" width="84" height="22" rx="8" class="v-coral"/>${label(x + 112, 81, "PDF", "micro")}${lines(x + 112, 110, "1 Datei\nalle Teile", "micro")}${N(x, 196, "Bewerbung_Anlagen-\nmechaniker_Jonas_Weber")}`],
        ["Prüfen", (x) => `${checkLine(x + 18, 86, "Adresse mit Vor- und Nachname", true)}${checkLine(x + 18, 114, "Betreff mit Beruf und Beginn", true)}${checkLine(x + 18, 142, "Lehrkraft hat gelesen", true)}${checkLine(x + 18, 170, "Spaß-Adresse", false)}${P(x, 194, "Probe-Mail an mich", "v-green-fill")}`],
      ]),
  },

  "bo-vorstellungsgespraech": {
    title: "Vorstellungsgespräch: Vorbereitung und Wirkung (R8)",
    question: "Wie bereitest du dich vor, und wie wirkst du durch Kleidung, Gestik, Mimik und Sprache?",
    alt: "Drei Felder: inhaltliche und organisatorische Vorbereitung mit zehn Minuten Puffer, vier Merkmale der persönlichen Wirkung, Rollenspiel mit Beobachtungsbogen.",
    caption: "Rollenspiel: Elif legt im zweiten Durchgang den Kugelschreiber weg und wirkt ruhiger.",
    parts: [
      { label: "Vorbereiten", note: "Betrieb recherchieren, Antworten auf typische Fragen und eigene Fragen notieren, Weg planen und 10 Minuten Puffer einrechnen." },
      { label: "Wirkung", note: "Kleidung passend zum Beruf, offene Gestik, freundliche Mimik mit Blickkontakt und eine klare, höfliche Sprache." },
      { label: "Rollenspiel", note: "Beobachter notieren Kleidung, Gestik, Mimik, Sprache und Inhalt; im zweiten Durchgang wird gezielt verbessert." },
    ],
    draw: () =>
      triptych([
        ["Vorbereiten", (x) => `${P(x, 62, "Betrieb recherchieren", "v-teal-fill")}${P(x, 100, "Antworten · eigene Fragen", "v-blue-fill")}${P(x, 138, "Weg + 10 Min. Puffer", "v-gold-fill")}${P(x, 176, "Unterlagen mitnehmen", "v-soft-fill")}`],
        ["Wirkung", (x) => `${person(x + 112, 104, "v-purple")}${label(x + 40, 76, "Kleidung", "micro")}${label(x + 184, 76, "Gestik", "micro")}${label(x + 40, 136, "Mimik", "micro")}${label(x + 184, 136, "Sprache", "micro")}${N(x, 182, "Blickkontakt, offene\nHaltung, ganze Sätze")}`],
        ["Rollenspiel", (x) => `${checkLine(x + 18, 86, "Inhalt vorbereitet", true)}${checkLine(x + 18, 114, "Blickkontakt", true)}${checkLine(x + 18, 142, "spielt mit Stift", false)}${down(x, 154)}${P(x, 172, "2. Durchgang: Stift weg", "v-green-fill")}`],
      ]),
  },

  "bo-lebensplan-schullaufbahn": {
    title: "Lebensplan, Schullaufbahn und Plan B (M8)",
    question: "Wie verbindest du Lebensziele, Noten und Schullaufbahn zu einem realistischen Plan?",
    alt: "Drei Felder: Lebensplanentwurf mit Beruf, Wohnen, Freizeit und Geld; Leistungsvermögen prüfen (Mathematik 2, Deutsch 4) mit Blick auf den mittleren Schulabschluss; Alternativen wie verwandte Berufe.",
    caption: "Sophie: Bauzeichnerin als Ziel, Deutsch gezielt üben, Technische Systemplanerin als Alternative.",
    parts: [
      { label: "Lebensplan", note: "Beruf, Wohnen, Familie, Freizeit und Geld in zehn Jahren; der Vergleich mit anderen zeigt die eigenen Prioritäten." },
      { label: "Leistung & Schulweg", note: "Noten ehrlich prüfen: Passen sie zum mittleren Schulabschluss und zum Wunschberuf? Wenn nötig, die Planung anpassen." },
      { label: "Alternativen", note: "Ein verwandter Beruf oder ein anderer Weg zum Ziel, etwa Ausbildung mit späterer Weiterbildung." },
    ],
    draw: () =>
      triptych([
        ["Lebensplan", (x) => `${P(x, 62, "Beruf: Bauzeichnerin", "v-blue-fill", 28)}${P(x, 96, "Wohnen: eigene Wohnung", "v-teal-fill", 28)}${P(x, 130, "Freizeit: Volleyball", "v-orange-fill", 28)}${P(x, 164, "Geld: sparen", "v-gold-fill", 28)}${N(x, 216, "Vergleich mit Lina:\nFachoberschule")}`],
        ["Leistung prüfen", (x) => `${label(x + 20, 82, "Mathe", "micro", "start")}${miniBar(x + 72, 70, 90, 5, 6, "v-green", "Note 2")}${label(x + 20, 110, "Deutsch", "micro", "start")}${miniBar(x + 72, 98, 90, 3, 6, "v-coral", "Note 4")}${P(x, 132, "Ziel: mittlerer Abschluss", "v-purple-fill")}${N(x, 192, "Plan: zweimal pro\nWoche Deutsch üben")}`],
        ["Alternativen", (x) => `${P(x, 66, "A: Bauzeichnerin", "v-blue-fill")}${down(x, 98)}${P(x, 114, "B: Technische Systemplanerin", "v-teal-fill")}${down(x, 146)}${P(x, 162, "C: Ausbildung + Technikerin", "v-soft-fill")}${coins(x + 112, 222, 0.6)}`],
      ]),
  },
};

