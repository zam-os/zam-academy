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

const P = (x0: number, y: number, text: string, cls = "v-pill", h = 30): string =>
  pill(x0 + 16, y, 192, h, text, cls, "micro");
const N = (x0: number, y: number, text: string): string => lines(x0 + 112, y, text, "micro");
const down = (x0: number, y: number): string => arrow(x0 + 112, y, x0 + 112, y + 14);

export const LB3_FIGURES: Record<string, ConceptFigure> = {
  "wi-betriebserkundung-grundfunktionen": {
    title: "Beschaffung, Produktion, Absatz in der Bäckerei",
    question: "Wie hängen die drei Grundfunktionen eines Betriebs als Geschäftsprozess zusammen?",
    alt: "Drei Felder: Beschaffung mit Angebotsvergleich (Mühle A 21,40 €, Mühle B 20,00 €), Produktion ab 3 Uhr, Absatz über Laden, Filialen und Kantine.",
    caption: "Mühle A: 21,00 € − 2,10 € + 2,50 € = 21,40 €; Mühle B: 20,00 € frei Haus, also günstiger.",
    parts: [
      { label: "Beschaffung", note: "Angebote vergleichen: Listenpreis minus Rabatt plus Lieferkosten ergibt den Bezugspreis; Mühle B ist mit 20,00 € günstiger." },
      { label: "Produktion", note: "Aus Mehl, Wasser und Zutaten entstehen ab 3 Uhr Brot und Semmeln." },
      { label: "Absatz", note: "Verkauf im Laden, in zwei Filialen und Lieferung an eine Kantine; Werbung und Preise gehören dazu." },
    ],
    draw: () =>
      triptych([
        ["Beschaffung", (x) => `${sheetDoc(x + 16, 58, 192, 96, "Angebotsvergleich", ["A: 21,00 − 10 % + 2,50", "= 21,40 € je Sack", "B: 20,00 € frei Haus"])}${P(x, 168, "Mühle B ist günstiger ✓", "v-green-fill")}${N(x, 226, "einkaufen · lagern")}`],
        ["Produktion", (x) => `${factory(x + 112, 100, 1)}${P(x, 142, "ab 3 Uhr: kneten und backen", "v-gold-fill")}${N(x, 200, "Einsatzgüter werden\nzu Produkten")}`],
        ["Absatz", (x) => `${stall(x + 112, 94, 1)}${P(x, 132, "Laden · 2 Filialen", "v-orange-fill", 28)}${P(x, 166, "Lieferung an Kantine", "v-blue-fill", 28)}${N(x, 222, "Werbung · Preise")}`],
      ]),
  },

  "wi-betriebliche-kriterien": {
    title: "Betriebe beurteilen: Umwelt und Mensch",
    question: "Woran erkennst du ökologisches Handeln und gute Bedingungen für die Beschäftigten?",
    alt: "Drei Felder: ökologisches Handeln mit LED-Umstellung (3.400 kWh und 850,00 € Ersparnis pro Jahr), Mensch am Arbeitsplatz mit Absauganlage und höhenverstellbaren Werkbänken, begründetes Urteil mit Stärken und Schwächen.",
    caption: "(58 W − 24 W) · 40 · 2.500 h = 3.400 kWh; bei 0,25 € je kWh 850,00 € im Jahr.",
    parts: [
      { label: "Ökologisches Handeln", note: "Heizen mit Holzresten und 40 LED-Leuchten statt Röhren: 3.400 kWh und 850,00 € Ersparnis im Jahr." },
      { label: "Mensch am Arbeitsplatz", note: "Absauganlage, höhenverstellbare Werkbänke, Gehörschutz; Schwäche: seltene Weiterbildung." },
      { label: "Urteil", note: "Vorher Kriterien festlegen, Belege sammeln, Stärken und Schwächen nennen und begründet urteilen." },
    ],
    draw: () =>
      triptych([
        ["Ökologie", (x) => `${label(x + 20, 82, "Röhre", "micro", "start")}${miniBar(x + 66, 70, 100, 58, 58, "v-coral", "58 W")}${label(x + 20, 110, "LED", "micro", "start")}${miniBar(x + 66, 98, 100, 24, 58, "v-green", "24 W")}${P(x, 130, "3.400 kWh · 850,00 € pro Jahr", "v-green-fill")}${N(x, 192, "Holzreste heizen\ndie Werkstatt")}`],
        ["Mensch", (x) => `${person(x + 112, 100, "v-blue")}${checkLine(x + 18, 146, "Absauganlage", true)}${checkLine(x + 18, 174, "verstellbare Werkbänke", true)}${checkLine(x + 18, 202, "Weiterbildung selten", false)}`],
        ["Urteil", (x) => `${P(x, 66, "Ökologie: vorbildlich", "v-green-fill")}${P(x, 106, "Arbeitsschutz: gut", "v-teal-fill")}${P(x, 146, "Weiterbildung: ausbaufähig", "v-gold-fill")}${N(x, 206, "Kriterien · Belege ·\nbegründetes Urteil")}`],
      ]),
  },

  "wi-geschaeft-planen": {
    title: "Der Waffelstand als Geschäft",
    question: "Welche Schritte braucht ein Klassengeschäft auf einem Markt?",
    alt: "Drei Felder: Nachfrage und Konkurrenz klären, Verkaufspreis kalkulieren (0,40 € Kosten plus 150 % Zuschlag gleich 1,00 €, Kuchen der Konkurrenz 1,50 €), Organisation mit Schichtplan, 30,00 € Wechselgeld und Kassenliste.",
    caption: "0,40 € + 150 % = 1,00 € je Waffel; die Konkurrenz verlangt 1,50 € für Kuchen.",
    parts: [
      { label: "Markt klären", note: "Umfrage zur Nachfrage, Zielgruppe bestimmen, Angebote und Preise der Konkurrenz ansehen." },
      { label: "Preis kalkulieren", note: "Kosten je Stück plus Zuschlag: 0,40 € + 0,60 € = 1,00 €; Vergleich mit dem Marktpreis von 1,50 € für Kuchen." },
      { label: "Organisieren", note: "Schichtplan, 30,00 € Wechselgeld, Kassenliste, Hygiene, Werbung und Genehmigung der Schulleitung." },
    ],
    draw: () =>
      triptych([
        ["Markt klären", (x) => `${person(x + 60, 96, "v-teal")}${person(x + 112, 96, "v-orange")}${person(x + 164, 96, "v-blue")}${P(x, 124, "Umfrage: Waffeln gefragt", "v-teal-fill")}${P(x, 164, "Konkurrenz: Kuchen 1,50 €", "v-soft-fill")}`],
        ["Kalkulieren", (x) => `${P(x, 62, "Kosten 0,40 €", "v-blue-fill")}${down(x, 94)}${P(x, 110, "+ 150 % Zuschlag = 0,60 €", "v-gold-fill")}${down(x, 142)}${P(x, 158, "Verkaufspreis 1,00 €", "v-green-fill")}${N(x, 216, "günstiger als\nder Kuchen")}`],
        ["Organisieren", (x) => `${stall(x + 112, 88, 0.9)}${checkLine(x + 18, 140, "3 Schichten", true)}${checkLine(x + 18, 168, "30,00 € Wechselgeld", true)}${checkLine(x + 18, 196, "Kassenliste · Plakat", true)}${checkLine(x + 18, 224, "Genehmigung", true)}`],
      ]),
  },

  "wi-gewinn-verlust": {
    title: "Die einfache Gewinn- und Verlustrechnung",
    question: "Hat sich der Punschstand gelohnt?",
    alt: "Drei Felder: Aufwendungen (Wareneinsatz 144,00 €, Standmiete 40,00 €, Werbung 20,00 €), Erträge (Umsatzerlöse 240,00 €), Ergebnis 36,00 € Gewinn in Kontenform.",
    caption: "120 Becher · 2,00 € = 240,00 € Erträge; 204,00 € Aufwendungen; 36,00 € Gewinn.",
    parts: [
      { label: "Aufwendungen", note: "Wareneinsatz 120 · 1,20 € = 144,00 €, Standmiete 40,00 €, Werbung 20,00 €: zusammen 204,00 €." },
      { label: "Erträge", note: "Umsatzerlöse aus dem Verkauf: 120 Becher · 2,00 € = 240,00 €." },
      { label: "Ergebnis", note: "240,00 € − 204,00 € = 36,00 € Gewinn; er steht als Ausgleich auf der Aufwandsseite." },
    ],
    draw: () =>
      triptych([
        ["Aufwendungen", (x) => `${label(x + 20, 82, "Ware", "micro", "start")}${miniBar(x + 80, 70, 90, 144, 240, "v-orange", "144 €")}${label(x + 20, 110, "Miete", "micro", "start")}${miniBar(x + 80, 98, 90, 40, 240, "v-coral", "40 €")}${label(x + 20, 138, "Werbung", "micro", "start")}${miniBar(x + 80, 126, 90, 20, 240, "v-purple", "20 €")}${P(x, 160, "Summe 204,00 €", "v-soft-fill")}`],
        ["Erträge", (x) => `${coins(x + 112, 96, 1.1)}${P(x, 134, "Umsatzerlöse 240,00 €", "v-green-fill")}${N(x, 192, "120 Becher\nzu je 2,00 €")}`],
        ["GuV-Konto", (x) => `<line x1="${x + 112}" y1="64" x2="${x + 112}" y2="200" class="v-outline-thick"/><line x1="${x + 24}" y1="76" x2="${x + 200}" y2="76" class="v-outline-thick"/>${label(x + 68, 70, "Aufwand", "micro")}${label(x + 156, 70, "Ertrag", "micro")}${lines(x + 68, 100, "Ware 144\nMiete 40\nWerbung 20\nGewinn 36", "micro")}${lines(x + 156, 100, "Umsatz 240", "micro")}${label(x + 68, 214, "240", "micro")}${label(x + 156, 214, "240", "micro")}`],
      ]),
  },

  "wi-wirtschaftskreislauf": {
    title: "Haushalte und Unternehmen im Kreislauf",
    question: "Was fließt zwischen Haushalten und Unternehmen, und wo bist du selbst beteiligt?",
    alt: "Drei Felder: Güterstrom mit Arbeitsleistung und Gütern, Geldstrom mit Einkommen 90.000 € und Konsumausgaben 81.000 € bei 10 % Sparen, eigenes Handeln mit Ferienjob, Einkauf und Sparkonto.",
    caption: "40 · 2.250 € = 90.000 € Einkommen; 10 % gespart, 81.000 € fließen als Konsumausgaben zurück.",
    parts: [
      { label: "Güterstrom", note: "Haushalte geben Arbeitsleistung an Unternehmen, Unternehmen liefern Güter und Dienstleistungen an Haushalte." },
      { label: "Geldstrom", note: "Unternehmen zahlen Einkommen (90.000 €), Haushalte geben Konsumausgaben aus (81.000 €), 9.000 € werden gespart." },
      { label: "Dein Handeln", note: "Ferienjob: du bietest Arbeitskraft an; Einkauf: dein Geld wird Einnahme eines Unternehmens; Sparen: die Bank kann es verleihen." },
    ],
    draw: () =>
      triptych([
        ["Güterstrom", (x) => `${P(x, 66, "Haushalte", "v-blue-fill")}${arrow(x + 80, 100, x + 80, 152)}${arrow(x + 144, 152, x + 144, 100)}${label(x + 76, 130, "Arbeit", "micro", "end")}${label(x + 148, 130, "Güter", "micro", "start")}${P(x, 160, "Unternehmen", "v-orange-fill")}`],
        ["Geldstrom", (x) => `${P(x, 66, "Haushalte", "v-blue-fill")}${arrow(x + 80, 152, x + 80, 100)}${arrow(x + 144, 100, x + 144, 152)}${label(x + 76, 130, "90.000 €", "micro", "end")}${label(x + 148, 130, "81.000 €", "micro", "start")}${P(x, 160, "Unternehmen", "v-orange-fill")}${N(x, 216, "Einkommen ↑ · Konsum ↓\n9.000 € gespart")}`],
        ["Dein Handeln", (x) => `${P(x, 62, "Ferienjob: Arbeitskraft", "v-teal-fill")}${P(x, 102, "Schuhe für 80,00 €", "v-gold-fill")}${P(x, 142, "Sparkonto → Kredit", "v-purple-fill")}${coins(x + 112, 210, 0.8)}`],
      ]),
  },

  "wi-entlohnungsformen": {
    title: "Zeitlohn, Akkord, Prämie und Provision",
    question: "Wird die Zeit oder die Leistung bezahlt, und was bedeutet das für die Beschäftigten?",
    alt: "Drei Felder: Zeitlohn 8 · 18,00 € = 144,00 €; Akkord mit 112 Stück · 5 Min. · 0,30 € = 168,00 € und 116,67 % Leistungsgrad; Prämie und Provision (2.200 € + 2 % von 30.000 € = 2.800 €).",
    caption: "Akkord: 14 Stück je Stunde statt 12 bringen 168,00 € statt 144,00 € Zeitlohn; Akkord ist für Jugendliche verboten (§ 23 JArbSchG).",
    parts: [
      { label: "Zeitlohn", note: "Bezahlt wird die Zeit: 8 Std. · 18,00 € = 144,00 €; planbar, aber ohne direkten Leistungsanreiz." },
      { label: "Akkordlohn", note: "Vorgabezeit 5 Min. je Stück, Minutenfaktor 0,30 €: 112 Stück bringen 168,00 €; Leistungsgrad 116,67 %." },
      { label: "Prämie & Provision", note: "Grundlohn plus Prämie für Qualität oder Ersparnis; Provision als Prozentsatz vom Umsatz: 2.200 € + 600 € = 2.800 €." },
    ],
    draw: () =>
      triptych([
        ["Zeitlohn", (x) => `<circle cx="${x + 112}" cy="96" r="26" class="v-paper"/><line x1="${x + 112}" y1="96" x2="${x + 112}" y2="78" class="v-outline-thick"/><line x1="${x + 112}" y1="96" x2="${x + 126}" y2="96" class="v-accent-stroke"/>${P(x, 136, "8 Std. · 18,00 € = 144,00 €", "v-blue-fill")}${N(x, 196, "planbar,\nkeine Hetze")}`],
        ["Akkordlohn", (x) => `${P(x, 62, "Vorgabe: 5 Min. je Stück", "v-soft-fill", 26)}${P(x, 94, "Minutenfaktor: 0,30 €", "v-soft-fill", 26)}${P(x, 130, "112 Stück → 168,00 €", "v-green-fill")}${N(x, 190, "Leistungsgrad 116,67 %\nfür Jugendliche verboten\n(§ 23 JArbSchG)")}`],
        ["Prämie & Provision", (x) => `${P(x, 66, "Grundlohn + Qualitätsprämie", "v-teal-fill")}${P(x, 106, "Fixum 2.200 €", "v-purple-fill", 28)}${P(x, 138, "+ 2 % von 30.000 € = 600 €", "v-gold-fill", 28)}${P(x, 174, "= 2.800 €", "v-green-fill")}`],
      ]),
  },

  "wi-mindestlohn-tariflohn": {
    title: "Mindestlohn, Tariflohn und Ausnahmen",
    question: "Wie viel muss mindestens gezahlt werden, und wer handelt höhere Löhne aus?",
    alt: "Drei Felder: gesetzlicher Mindestlohn 13,90 € seit 1. Januar 2026 mit Prüfung 2.150,00 € : 160 = 13,44 €; Tariflohn durch Gewerkschaft und Arbeitgeberverband; Ausnahmen nach § 22 MiLoG.",
    caption: "Herrn Yilmaz stehen bei 160 Stunden mindestens 2.224,00 € zu statt 2.150,00 €.",
    parts: [
      { label: "Mindestlohn", note: "Seit 1. Januar 2026 13,90 € brutto je Stunde (§ 1 MiLoG); 2.150,00 € : 160 Std. = 13,44 € sind zu wenig." },
      { label: "Tariflohn", note: "Gewerkschaft und Arbeitgeberverband handeln Tarifverträge aus (§ 1 TVG, Art. 9 Abs. 3 GG); Tariflöhne liegen meist darüber." },
      { label: "Ausnahmen", note: "Nicht erfasst: Jugendliche unter 18 ohne Berufsabschluss, Pflichtpraktika, Auszubildende mit Mindestvergütung (§ 22 MiLoG)." },
    ],
    draw: () =>
      triptych([
        ["Mindestlohn", (x) => `${P(x, 62, "13,90 € je Stunde (seit 2026)", "v-purple-fill")}${label(x + 20, 120, "gezahlt", "micro", "start")}${miniBar(x + 72, 108, 90, 13.44, 13.9, "v-coral", "13,44 €")}${label(x + 20, 148, "Pflicht", "micro", "start")}${miniBar(x + 72, 136, 90, 13.9, 13.9, "v-green", "13,90 €")}${N(x, 190, "160 Std.: mindestens\n2.224,00 € brutto")}`],
        ["Tariflohn", (x) => `${person(x + 66, 100, "v-coral")}${person(x + 158, 100, "v-blue")}${label(x + 66, 122, "Gewerkschaft", "micro")}${label(x + 158, 122, "Arbeitgeber", "micro")}${P(x, 140, "Tarifvertrag (§ 1 TVG)", "v-gold-fill")}${N(x, 196, "Modell: 16,20 € je Std.\n= 2.592,00 € bei 160 Std.")}`],
        ["Ausnahmen", (x) => `${checkLine(x + 18, 86, "unter 18 ohne Abschluss", false)}${checkLine(x + 18, 116, "Schulpraktikum", false)}${checkLine(x + 18, 146, "Azubis: § 17 BBiG", false)}${checkLine(x + 18, 176, "Aushilfe, 34 Jahre", true)}${N(x, 216, "✓ = Mindestlohn gilt\n(§ 22 MiLoG)")}`],
      ]),
  },

  "wi-lohnabrechnung": {
    title: "Vom Brutto zum Netto",
    question: "Welche gesetzlichen Abgaben gehen vom Lohn ab, und was prüfst du auf der Abrechnung?",
    alt: "Drei Felder: Brutto 160 · 15,00 € = 2.400,00 €; Abzüge Lohnsteuer 190,00 €, Kirchensteuer 15,20 €, Sozialversicherung 504,00 € im Modell; Netto 1.690,80 € und Prüfpunkte.",
    caption: "2.400,00 € − 190,00 € − 15,20 € − 504,00 € = 1.690,80 € (Modellwerte; aktuelle Sätze recherchieren).",
    parts: [
      { label: "Brutto", note: "Stunden mal Stundenlohn plus Zuschläge: 160 · 15,00 € = 2.400,00 €." },
      { label: "Abzüge", note: "Lohnsteuer laut Tabelle, Kirchensteuer nur für Mitglieder, Solidaritätszuschlag erst über einer Freigrenze, Arbeitnehmeranteil zu Renten-, Kranken-, Pflege- und Arbeitslosenversicherung." },
      { label: "Netto & prüfen", note: "1.690,80 € Netto; Stunden, Lohnsatz, Steuerklasse und Kirchenzugehörigkeit mit eigenen Unterlagen vergleichen." },
    ],
    draw: () =>
      triptych([
        ["Brutto", (x) => `${sheetDoc(x + 24, 60, 176, 96, "Abrechnung März", ["160 Std. · 15,00 €", "Steuerklasse I", "Krankenkasse"])}${P(x, 170, "Brutto 2.400,00 €", "v-blue-fill")}`],
        ["Abzüge", (x) => `${label(x + 20, 82, "LSt", "micro", "start")}${miniBar(x + 60, 70, 100, 190, 504, "v-coral", "190,00 €")}${label(x + 20, 110, "KiSt", "micro", "start")}${miniBar(x + 60, 98, 100, 15.2, 504, "v-coral", "15,20 €")}${label(x + 20, 138, "SV", "micro", "start")}${miniBar(x + 60, 126, 100, 504, 504, "v-orange", "504,00 €")}${N(x, 176, "Soli 0,00 € (Freigrenze)\nUnfallversicherung zahlt\nder Arbeitgeber allein")}`],
        ["Netto & prüfen", (x) => `${P(x, 62, "Netto 1.690,80 €", "v-green-fill")}${checkLine(x + 18, 120, "Stunden laut Nachweis", true)}${checkLine(x + 18, 148, "Lohnsatz laut Vertrag", true)}${checkLine(x + 18, 176, "Steuerklasse · Kirche", true)}${N(x, 214, "Fehler? Personal-\nabteilung ansprechen")}`],
      ]),
  },
};
