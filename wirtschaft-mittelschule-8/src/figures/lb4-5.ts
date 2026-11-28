import {
  arrow,
  checkLine,
  clockIcon,
  type ConceptFigure,
  factory,
  gear,
  label,
  lines,
  miniBar,
  person,
  pill,
  sheetDoc,
  shield,
  triptych,
} from "./draw";

const P = (x0: number, y: number, text: string, cls = "v-pill", h = 30): string =>
  pill(x0 + 16, y, 192, h, text, cls, "micro");
const N = (x0: number, y: number, text: string): string => lines(x0 + 112, y, text, "micro");
const down = (x0: number, y: number): string => arrow(x0 + 112, y, x0 + 112, y + 14);

export const LB4_5_FIGURES: Record<string, ConceptFigure> = {
  "re-praktikum-bestimmungen": {
    title: "Arbeitszeit im Betriebspraktikum",
    question: "Welche Grenzen setzt das Jugendarbeitsschutzgesetz für dein Praktikum?",
    alt: "Drei Felder: Ausnahme vom Beschäftigungsverbot nach § 5 Abs. 2 Nr. 2 JArbSchG; Grenzen 7 Stunden täglich, 35 wöchentlich, Pausen nach § 11, 6 bis 20 Uhr, fünf Tage; Tims Plan 8 bis 16 Uhr mit 60 Minuten Pause.",
    caption: "Tim: 8 bis 16 Uhr minus 60 Min. Pause = 7 Std.; Montag bis Freitag = 35 Std.: zulässig.",
    parts: [
      { label: "Ausnahme", note: "Kinder unter 15 und vollzeitschulpflichtige Jugendliche dürfen grundsätzlich nicht arbeiten; das Betriebspraktikum ist ausdrücklich erlaubt (§ 5 Abs. 2 Nr. 2 JArbSchG)." },
      { label: "Grenzen", note: "Höchstens 7 Std. am Tag und 35 Std. in der Woche, 30 bzw. 60 Min. Pause, 6 bis 20 Uhr, fünf Tage, Schichtzeit bis 10 Std." },
      { label: "Plan prüfen", note: "8 bis 16 Uhr mit 60 Min. Pause: 7 Std. täglich, 35 Std. wöchentlich; der Entwurf mit 8,5 Std. und 30 Min. Pause war unzulässig." },
    ],
    draw: () =>
      triptych([
        ["Ausnahme", (x) => `${shield(x + 112, 96, 1.1, "v-coral")}${P(x, 140, "§ 5 Abs. 1: Beschäftigungsverbot", "v-soft-fill", 28)}${P(x, 176, "§ 5 Abs. 2 Nr. 2: Praktikum ✓", "v-green-fill", 28)}`],
        ["Grenzen", (x) => `${clockIcon(x + 112, 88, 22)}${P(x, 120, "7 Std./Tag · 35 Std./Woche", "v-gold-fill", 26)}${P(x, 150, "Pause 30 bzw. 60 Min. (§ 11)", "v-teal-fill", 26)}${P(x, 180, "6 bis 20 Uhr (§ 14)", "v-blue-fill", 26)}${P(x, 210, "5 Tage (§ 15) · Sa/So frei", "v-purple-fill", 26)}`],
        ["Tims Plan", (x) => `${checkLine(x + 18, 86, "8 bis 16 Uhr, 60 Min. Pause", true)}${checkLine(x + 18, 114, "7 Std. · Mo bis Fr = 35 Std.", true)}${checkLine(x + 18, 150, "Entwurf: 8,5 Std., 30 Min.", false)}${N(x, 192, "Keine gefährlichen Arbeiten\n(§ 22), Unterweisung\nvor Beginn (§ 29)")}`],
      ]),
  },

  "re-schutzbestimmungen-notwendigkeit": {
    title: "Warum Schutzbestimmungen notwendig sind",
    question: "Welchen Zweck haben die Regeln, die dich im Praktikum schützen?",
    alt: "Drei Felder: Gesundheit und Entwicklung (Lärm, Gefahrstoffe, Lasten), Schutz vor Unfällen wegen fehlender Erfahrung (§ 22), Erholung und Schulerfolg durch Zeitgrenzen; Selins Bewertung.",
    caption: "Selin darf nicht an die Kreissäge, lernt aber beim Schleifen und Zuschauen trotzdem viel.",
    parts: [
      { label: "Gesundheit", note: "Kein schädlicher Lärm, keine Gefahrstoffe, keine Arbeit über der eigenen Leistungsfähigkeit (§ 22 Abs. 1)." },
      { label: "Unfallschutz", note: "Mangelnde Erfahrung lässt Gefahren zu spät erkennen; deshalb keine gefährlichen Maschinen, dafür Unterweisung (§ 29)." },
      { label: "Bewerten", note: "Die Regeln schränken ein, schützen aber Gesundheit, Erholung und Schulerfolg, ohne das Lernen zu verhindern." },
    ],
    draw: () =>
      triptych([
        ["Gesundheit", (x) => `${person(x + 112, 100, "v-teal")}${P(x, 130, "kein schädlicher Lärm", "v-soft-fill", 26)}${P(x, 160, "keine Gefahrstoffe", "v-soft-fill", 26)}${P(x, 190, "keine Überlastung", "v-soft-fill", 26)}`],
        ["Unfallschutz", (x) => `${gear(x + 112, 96, 20, "v-coral")}${P(x, 134, "Kreissäge: nicht für Selin", "v-coral-fill")}${P(x, 172, "Unterweisung vor Beginn", "v-teal-fill")}${N(x, 230, "§§ 22 und 29 JArbSchG")}`],
        ["Bewerten", (x) => `${label(x + 20, 82, "Einschränkung", "micro", "start")}${miniBar(x + 100, 70, 70, 2, 6, "v-gold", "klein")}${label(x + 20, 110, "Schutz", "micro", "start")}${miniBar(x + 100, 98, 70, 6, 6, "v-green", "groß")}${P(x, 132, "Lernen bleibt möglich", "v-green-fill")}${N(x, 190, "schleifen, zuschauen,\nFachleute fragen")}`],
      ]),
  },

  "re-praktikum-pflichten-versicherung": {
    title: "Rechte, Pflichten und Versicherung",
    question: "Was musst du im Praktikum tun, was steht dir zu, und wer hilft bei einem Unfall?",
    alt: "Drei Felder: Pflichten wie Pünktlichkeit, Verschwiegenheit und Schutzausrüstung; Rechte wie Unterweisung und Pausen, kein Mindestlohn (§ 22 MiLoG); gesetzliche Unfallversicherung (§ 2 Abs. 1 Nr. 8 SGB VII).",
    caption: "Jana: kleine Schnittwunde, Eintrag ins Verbandbuch, Lehrkraft informiert; Ali: Belehrung nach § 43 IfSG vor der Großküche.",
    parts: [
      { label: "Pflichten", note: "Pünktlich sein, Anweisungen befolgen, Schutzausrüstung tragen (§ 15 ArbSchG), schweigen über Betriebsgeheimnisse und Daten, Krankmeldung an Betrieb und Schule." },
      { label: "Rechte", note: "Unterweisung über Gefahren (§ 29 JArbSchG), Pausen und Ansprechperson; kein gesetzlicher Mindestlohn, weil Pflichtpraktikum (§ 22 MiLoG)." },
      { label: "Versicherung", note: "Als Schulveranstaltung ist das Praktikum gesetzlich unfallversichert (§ 2 Abs. 1 Nr. 8 SGB VII); Unfälle der Schule melden." },
    ],
    draw: () =>
      triptych([
        ["Pflichten", (x) => `${P(x, 62, "pünktlich · Anweisungen", "v-blue-fill", 28)}${P(x, 96, "Schutzausrüstung tragen", "v-orange-fill", 28)}${P(x, 130, "Verschwiegenheit", "v-purple-fill", 28)}${P(x, 164, "krank: Betrieb + Schule", "v-coral-fill", 28)}`],
        ["Rechte", (x) => `${checkLine(x + 18, 86, "Unterweisung (§ 29)", true)}${checkLine(x + 18, 114, "Pausen · Ansprechperson", true)}${checkLine(x + 18, 142, "Mindestlohn", false)}${N(x, 184, "Pflichtpraktikum: kein\ngesetzlicher Mindestlohn\n(§ 22 MiLoG)")}`],
        ["Versicherung", (x) => `${shield(x + 112, 96, 1.1, "v-green")}${P(x, 140, "§ 2 Abs. 1 Nr. 8 SGB VII", "v-green-fill")}${sheetDoc(x + 24, 180, 176, 60, "Unfall", ["Verbandbuch · Lehrkraft"])}`],
      ]),
  },

  "te-produktionsverfahren": {
    title: "Fertigungsarten und Produktionsmittel",
    question: "Wie hängen Stückzahl, Organisation und Produktionsmittel zusammen?",
    alt: "Drei Felder: Einzel-, Serien- und Massenfertigung; Produktionsmittel vom Werkzeug bis zum Roboter; Produktivität 2 Teile je Arbeitsstunde von Hand gegen 8 mit CNC-Fräse (plus 300 %).",
    caption: "48 Teile : 24 Arbeitsstunden = 2; 64 Teile : 8 Arbeitsstunden = 8; Steigerung (8 − 2) : 2 · 100 % = 300 %.",
    parts: [
      { label: "Fertigungsarten", note: "Einzelfertigung für ein Stück nach Kundenwunsch, Serienfertigung für eine begrenzte Menge, Massenfertigung für sehr große Mengen." },
      { label: "Produktionsmittel", note: "Werkzeug, Maschine, programmgesteuerte CNC-Maschine und Industrieroboter; dazu Werkstatt- oder Fließfertigung." },
      { label: "Produktivität", note: "Von Hand 2 Teile je Arbeitsstunde, mit CNC-Fräse 8: Die Arbeitsproduktivität steigt um 300 %." },
    ],
    draw: () =>
      triptych([
        ["Stückzahl", (x) => `${P(x, 62, "Einzel: Einbauschrank", "v-teal-fill")}${P(x, 102, "Serie: 120 Stühle", "v-blue-fill")}${P(x, 142, "Masse: Schrauben", "v-purple-fill")}${N(x, 202, "Werkstatt- oder\nFließfertigung")}`],
        ["Mittel", (x) => `${P(x, 62, "Werkzeug: Hobel", "v-soft-fill", 26)}${down(x, 90)}${P(x, 106, "Maschine: Kreissäge", "v-soft-fill", 26)}${down(x, 134)}${P(x, 150, "CNC-Fräse", "v-gold-fill", 26)}${down(x, 178)}${P(x, 194, "Industrieroboter", "v-orange-fill", 26)}`],
        ["Produktivität", (x) => `${label(x + 20, 82, "Hand", "micro", "start")}${miniBar(x + 64, 70, 100, 2, 8, "v-coral", "2 je Std.")}${label(x + 20, 110, "CNC", "micro", "start")}${miniBar(x + 64, 98, 100, 8, 8, "v-green", "8 je Std.")}${P(x, 132, "+ 300 %", "v-green-fill")}${gear(x + 112, 206, 18, "v-blue")}`],
      ]),
  },

  "te-erkundungsmethoden": {
    title: "Befragen, Beobachten, Protokollieren",
    question: "Wie sammelst du bei einer Erkundung verlässliche Informationen über technische Verfahren?",
    alt: "Drei Felder: Befragen mit Leitfaden aus offenen und geschlossenen Fragen, Beobachten am Laserschneider (90 Sekunden je Teil, 40 Teile pro Stunde, Schutzbrille), Protokollieren mit Datum, Stichpunkten und Skizze.",
    caption: "Laserschneiden: 3.600 s : 90 s = 40 Teile pro Stunde.",
    parts: [
      { label: "Befragen", note: "Leitfaden mit offenen Fragen für ausführliche Antworten und geschlossenen Fragen für genaue Zahlen." },
      { label: "Beobachten", note: "Mit Beobachtungsbogen gezielt hinsehen: 90 Sekunden je Teil, also 40 Teile pro Stunde; Schutzbrille und geschlossene Kabine." },
      { label: "Protokollieren", note: "Datum, Ort, Gesprächspartner, Stichpunkte und Skizze; Fotos nur mit Erlaubnis des Betriebs." },
    ],
    draw: () =>
      triptych([
        ["Befragen", (x) => `${person(x + 70, 100, "v-teal")}${person(x + 154, 100, "v-orange")}${label(x + 154, 122, "Meisterin", "micro")}${P(x, 140, "offen: Wie funktioniert …?", "v-teal-fill", 28)}${P(x, 176, "geschlossen: Wie viele …?", "v-blue-fill", 28)}`],
        ["Beobachten", (x) => `${factory(x + 112, 96, 0.85)}${P(x, 134, "90 s je Teil → 40 pro Std.", "v-gold-fill")}${checkLine(x + 18, 196, "Schutzbrille", true)}${checkLine(x + 18, 224, "geschlossene Kabine", true)}`],
        ["Protokollieren", (x) => `${sheetDoc(x + 24, 60, 176, 132, "Protokoll", ["Datum · Betrieb", "Gesprächspartnerin", "Stichpunkte", "Skizze des Ablaufs"])}${N(x, 216, "Fotos nur mit Erlaubnis")}`],
      ]),
  },

  "te-ergonomie-arbeitssicherheit": {
    title: "Lärm an der Kreissäge: Maßnahmen in der richtigen Reihenfolge",
    question: "Wie schützt ein Betrieb seine Beschäftigten wirksam vor Gefahren durch Technik?",
    alt: "Drei Felder: Ergonomie mit höhenverstellbarer Werkbank und Hebehilfe; Lärm 95 dB(A), mit Haube 85 dB(A), mit Gehörschutz 65 dB(A) am Ohr (vereinfacht); Rangfolge technisch, organisatorisch, persönlich nach § 4 ArbSchG.",
    caption: "Auslösewerte nach § 6 LärmVibrationsArbSchV: 80 und 85 dB(A); Gefahren zuerst an der Quelle bekämpfen (§ 4 ArbSchG).",
    parts: [
      { label: "Ergonomie", note: "Den Arbeitsplatz an den Menschen anpassen: höhenverstellbare Werkbank, gute Beleuchtung, Hebehilfen." },
      { label: "Lärmschutz", note: "95 dB(A) an der Säge; Haube senkt auf 85 dB(A) (oberer Auslösewert, Tragepflicht); Gehörschutz mit 20 dB ergibt vereinfacht 65 dB(A) am Ohr." },
      { label: "Rangfolge", note: "Technisch vor organisatorisch vor persönlich; individuelle Schutzmaßnahmen sind nachrangig (§ 4 Nr. 5 ArbSchG)." },
    ],
    draw: () =>
      triptych([
        ["Ergonomie", (x) => `${person(x + 112, 96, "v-blue")}<rect x="${x + 60}" y="110" width="104" height="10" rx="3" class="v-gold"/><line x1="${x + 74}" y1="120" x2="${x + 74}" y2="160" class="v-outline-thick"/><line x1="${x + 150}" y1="120" x2="${x + 150}" y2="160" class="v-outline-thick"/>${P(x, 174, "höhenverstellbar · Hebehilfe", "v-green-fill")}`],
        ["Lärm", (x) => `${label(x + 20, 82, "Säge", "micro", "start")}${miniBar(x + 70, 70, 90, 95, 100, "v-coral", "95 dB(A)")}${label(x + 20, 110, "+ Haube", "micro", "start")}${miniBar(x + 70, 98, 90, 85, 100, "v-gold", "85 dB(A)")}${label(x + 20, 138, "am Ohr", "micro", "start")}${miniBar(x + 70, 126, 90, 65, 100, "v-green", "65 dB(A)")}${N(x, 174, "ab 80: bereitstellen\nab 85: tragen\n(vereinfachtes Modell)")}`],
        ["Rangfolge", (x) => `${P(x, 62, "1 · technisch: Haube", "v-teal-fill")}${down(x, 94)}${P(x, 110, "2 · organisatorisch: Wechsel", "v-blue-fill")}${down(x, 142)}${P(x, 158, "3 · persönlich: Gehörschutz", "v-orange-fill")}${N(x, 216, "§ 4 Nr. 2 und Nr. 5\nArbSchG")}`],
      ]),
  },

  "te-qualifikation-arbeitsprozess": {
    title: "Technik verändert Arbeit und Anforderungen",
    question: "Was ändert sich für Beschäftigte, wenn neue Technik in den Betrieb kommt?",
    alt: "Drei Felder: Arbeitsprozess im Lager früher mit Papierliste, heute mit Handscanner; neue Qualifikationen wie Software, Programmieren und Fehlersuche; Wirkungen auf die Gesundheit wie Hebehilfe und Bildschirmarbeit.",
    caption: "Vom Herstellen zum Einrichten, Überwachen und Programmieren: Weiterbildung wird zur Daueraufgabe.",
    parts: [
      { label: "Arbeitsprozess", note: "Früher Papierliste und Bestände von Hand, heute Handscanner, sofortige Buchung und kürzeste Wege." },
      { label: "Qualifikation", note: "Neu gefragt: Software bedienen, Maschinen programmieren, Fehlermeldungen verstehen, sich weiterbilden." },
      { label: "Gesundheit", note: "Technik entlastet (Hebehilfe, kein schweres Sägen), bringt aber neue Belastungen wie Bildschirmarbeit und Takt." },
    ],
    draw: () =>
      triptych([
        ["Arbeitsprozess", (x) => `${sheetDoc(x + 24, 60, 80, 74, "früher", ["Liste", "von Hand"])}${arrow(x + 108, 96, x + 126, 96)}<rect x="${x + 134}" y="66" width="62" height="62" rx="8" class="v-blue-fill"/>${label(x + 165, 101, "Scanner", "micro")}${P(x, 152, "Buchung sofort, kurze Wege", "v-teal-fill")}${N(x, 212, "Herstellen →\nEinrichten · Überwachen")}`],
        ["Qualifikation", (x) => `${P(x, 62, "Software bedienen", "v-gold-fill", 28)}${P(x, 96, "CNC programmieren (CAD)", "v-purple-fill", 28)}${P(x, 130, "Fehler finden", "v-orange-fill", 28)}${P(x, 164, "Weiterbildung", "v-green-fill", 28)}`],
        ["Gesundheit", (x) => `${checkLine(x + 18, 86, "Hebehilfe entlastet", true)}${checkLine(x + 18, 114, "kein schweres Sägen", true)}${checkLine(x + 18, 142, "Bildschirmarbeit", false)}${checkLine(x + 18, 170, "hoher Takt", false)}${gear(x + 112, 214, 16, "v-blue")}`],
      ]),
  },

  "te-vor-nachteile-abwaegen": {
    title: "Schweißroboter: abwägen mit Zahlen und Gründen (M8)",
    question: "Lohnt sich Technik an diesem Arbeitsplatz, und für wen?",
    alt: "Drei Felder: Pro und Contra des Schweißroboters; Nutzwertanalyse mit Gewichten 30, 30, 20, 20 % (Roboter 3,5, Handarbeit 3,2); Kostengleichheit bei 15.000 € : 2,40 € = 6.250 Teilen.",
    caption: "Nutzwert Roboter 3,5 gegen Handarbeit 3,2; Kosten: ab 6.250 Teilen im Jahr ist der Roboter günstiger.",
    parts: [
      { label: "Pro & Contra", note: "Pro: weniger Rauch und Hitze, gleichmäßige Qualität, mehr Stück. Contra: Investition, weniger Helferstellen, Abhängigkeit, Monotonie." },
      { label: "Nutzwertanalyse", note: "Gewichte Kosten 30 %, Gesundheit 30 %, Qualität 20 %, Arbeitsplätze 20 %: Roboter 3,5, Handarbeit 3,2." },
      { label: "Kosten", note: "120.000 € über 8 Jahre = 15.000 € pro Jahr; bei 2,40 € Ersparnis je Teil lohnt sich der Roboter ab 6.250 Teilen." },
    ],
    draw: () =>
      triptych([
        ["Pro & Contra", (x) => `${checkLine(x + 18, 82, "weniger Rauch und Hitze", true)}${checkLine(x + 18, 108, "gleiche Qualität", true)}${checkLine(x + 18, 134, "weniger Helferstellen", false)}${checkLine(x + 18, 160, "Ausfall stoppt Fertigung", false)}${checkLine(x + 18, 186, "eintönige Überwachung", false)}${N(x, 222, "aus Sicht der\nBeschäftigten")}`],
        ["Nutzwert", (x) => `${label(x + 20, 82, "Roboter", "micro", "start")}${miniBar(x + 76, 70, 90, 3.5, 5, "v-green", "3,5")}${label(x + 20, 110, "Hand", "micro", "start")}${miniBar(x + 76, 98, 90, 3.2, 5, "v-gold", "3,2")}${N(x, 146, "Gewichte: Kosten 30 %,\nGesundheit 30 %,\nQualität 20 %,\nArbeitsplätze 20 %")}`],
        ["Kosten", (x) => `${P(x, 62, "120.000 € : 8 Jahre", "v-soft-fill", 28)}${down(x, 92)}${P(x, 108, "15.000 € pro Jahr", "v-purple-fill", 28)}${down(x, 138)}${P(x, 154, "Ersparnis 2,40 € je Teil", "v-gold-fill", 28)}${P(x, 194, "ab 6.250 Teilen günstiger", "v-green-fill")}`],
      ]),
  },
};
