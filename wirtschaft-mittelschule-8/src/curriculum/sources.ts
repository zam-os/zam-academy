import type { Track } from "../model/types";

export const EDITORIAL_DATE = "28. November 2026";
export const CURRICULUM_URL_R =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/regelklasse";
export const CURRICULUM_URL_M =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/mittlere-reife-klasse";

export interface StageSpec {
  lb: number;
  title: string;
  subtitle: string;
  tracks: Track[];
  hue: number;
}

/** One stage per Lernbereich, each with its own accent colour (hue for CSS tokens). */
export const STAGES: StageSpec[] = [
  {
    lb: 1,
    title: "Projekt",
    subtitle: "Komplexe Projektaufgaben, Leittextmethode und Projektsteuerung",
    tracks: ["R", "M"],
    hue: 168,
  },
  {
    lb: 2,
    title: "Berufsorientierung",
    subtitle: "Berufsberatung, Kompetenzprofil, Betriebspraktikum und Bewerbung",
    tracks: ["R", "M"],
    hue: 30,
  },
  {
    lb: 3,
    title: "Wirtschaft",
    subtitle: "Betriebserkundung, Gewinn- und Verlustrechnung, Wirtschaftskreislauf und Lohn",
    tracks: ["R", "M"],
    hue: 282,
  },
  {
    lb: 4,
    title: "Recht",
    subtitle: "Gesetzliche Bestimmungen und Schutz im Betriebspraktikum",
    tracks: ["R", "M"],
    hue: 350,
  },
  {
    lb: 5,
    title: "Technik",
    subtitle: "Produktionsverfahren, Ergonomie, Arbeitssicherheit und Qualifikation",
    tracks: ["R", "M"],
    hue: 205,
  },
];

const gii = (path: string) => `https://www.gesetze-im-internet.de/${path}.html`;

/** Every link was fetched on 28 November 2026 and its page title read (see docs). */
export const SOURCES = [
  { id: "lpr", label: "LehrplanPLUS · Wirtschaft und Beruf R8 (Regelklasse)", url: CURRICULUM_URL_R },
  { id: "lpm", label: "LehrplanPLUS · Wirtschaft und Beruf M8 (Mittlere-Reife-Klasse)", url: CURRICULUM_URL_M },
  {
    id: "profil",
    label: "LehrplanPLUS · Fachprofil Wirtschaft und Beruf an der Mittelschule",
    url: "https://www.lehrplanplus.bayern.de/fachprofil/mittelschule/wib",
  },
  {
    id: "mso",
    label: "BayMSO Anlage 1 · Stundentafel für die Mittelschule",
    url: "https://www.gesetze-bayern.de/Content/Document/BayMSO-ANL_1",
  },
  { id: "meinberuf", label: "meinBERUF · Bundesagentur für Arbeit", url: "https://www.arbeitsagentur.de/bildung" },
  { id: "berufenet", label: "BERUFENET · Bundesagentur für Arbeit", url: "https://web.arbeitsagentur.de/berufenet/" },
  {
    id: "checku",
    label: "Check-U · Berufsorientierungstest der Bundesagentur für Arbeit",
    url: "https://www.arbeitsagentur.de/bildung/welche-ausbildung-welches-studium-passt",
  },
  { id: "jobsuche", label: "Jobsuche der Bundesagentur für Arbeit", url: "https://www.arbeitsagentur.de/jobsuche/" },
  { id: "ihklehrstellen", label: "IHK-Lehrstellenbörse", url: "https://www.ihk-lehrstellenboerse.de/" },
  { id: "lehrstellenradar", label: "Lehrstellenradar der Handwerkskammern", url: "https://www.lehrstellen-radar.de/" },
  { id: "bibb", label: "Bundesinstitut für Berufsbildung (BIBB)", url: "https://www.bibb.de/" },
  { id: "sgb3_29", label: "SGB III § 29 · Berufsberatung", url: gii("sgb_3/__29") },
  { id: "bbig17", label: "BBiG § 17 · Vergütungsanspruch und Mindestvergütung", url: gii("bbig_2005/__17") },
  { id: "agg1", label: "AGG § 1 · Ziel des Gesetzes (Schutz vor Benachteiligung)", url: gii("agg/__1") },
  { id: "jarbschg2", label: "JArbSchG § 2 · Kind, Jugendlicher", url: gii("jarbschg/__2") },
  {
    id: "jarbschg5",
    label: "JArbSchG § 5 · Verbot der Beschäftigung von Kindern, Betriebspraktikum",
    url: gii("jarbschg/__5"),
  },
  { id: "jarbschg7", label: "JArbSchG § 7 · Höchstens 7 Std. täglich und 35 Std. wöchentlich", url: gii("jarbschg/__7") },
  { id: "jarbschg11", label: "JArbSchG § 11 · Ruhepausen", url: gii("jarbschg/__11") },
  { id: "jarbschg12", label: "JArbSchG § 12 · Schichtzeit", url: gii("jarbschg/__12") },
  { id: "jarbschg14", label: "JArbSchG § 14 · Nachtruhe (6 bis 20 Uhr)", url: gii("jarbschg/__14") },
  { id: "jarbschg15", label: "JArbSchG § 15 · Fünf-Tage-Woche", url: gii("jarbschg/__15") },
  { id: "jarbschg16", label: "JArbSchG § 16 · Samstagsruhe", url: gii("jarbschg/__16") },
  { id: "jarbschg17", label: "JArbSchG § 17 · Sonntagsruhe", url: gii("jarbschg/__17") },
  { id: "jarbschg22", label: "JArbSchG § 22 · Gefährliche Arbeiten", url: gii("jarbschg/__22") },
  { id: "jarbschg23", label: "JArbSchG § 23 · Akkordarbeit, tempoabhängige Arbeiten", url: gii("jarbschg/__23") },
  { id: "jarbschg29", label: "JArbSchG § 29 · Unterweisung über Gefahren", url: gii("jarbschg/__29") },
  { id: "milog1", label: "MiLoG § 1 · Mindestlohn", url: gii("milog/__1") },
  { id: "milog22", label: "MiLoG § 22 · Persönlicher Anwendungsbereich (Praktika, Jugendliche)", url: gii("milog/__22") },
  {
    id: "bmasmindestlohn",
    label: "BMAS · Mindestlohn: Höhe, Anspruch und aktuelle Regelungen",
    url: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html",
  },
  { id: "tvg1", label: "TVG § 1 · Inhalt und Form des Tarifvertrags", url: gii("tvg/__1") },
  { id: "gg9", label: "Art. 9 GG · Vereinigungs- und Koalitionsfreiheit", url: gii("gg/art_9") },
  { id: "dgbjugend", label: "DGB-Jugend (Gewerkschaftsjugend)", url: "https://jugend.dgb.de/" },
  { id: "arbeitgeber", label: "Die Arbeitgeber (BDA, Arbeitgeberverbände)", url: "https://www.arbeitgeber.de/" },
  { id: "estg38", label: "EStG § 38 · Erhebung der Lohnsteuer", url: gii("estg/__38") },
  { id: "solzg3", label: "SolzG 1995 § 3 · Bemessungsgrundlage und Freigrenze", url: gii("solzg_1995/__3") },
  { id: "sgb5_241", label: "SGB V § 241 · Allgemeiner Beitragssatz der Krankenversicherung (14,6 %)", url: gii("sgb_5/__241") },
  { id: "sgb5_249", label: "SGB V § 249 · Tragung der Beiträge je zur Hälfte", url: gii("sgb_5/__249") },
  { id: "sgb3_341", label: "SGB III § 341 · Beitragssatz der Arbeitslosenversicherung (2,6 %)", url: gii("sgb_3/__341") },
  { id: "sgb6_168", label: "SGB VI § 168 · Beitragstragung in der Rentenversicherung", url: gii("sgb_6/__168") },
  { id: "sgb7_150", label: "SGB VII § 150 · Beitragspflichtige (Unfallversicherung: Arbeitgeber)", url: gii("sgb_7/__150") },
  { id: "sgb7_2", label: "SGB VII § 2 · Versicherung kraft Gesetzes (Abs. 1 Nr. 8: Schüler)", url: gii("sgb_7/__2") },
  { id: "ifsg43", label: "IfSG § 43 · Belehrung bei Tätigkeiten mit Lebensmitteln", url: gii("ifsg/__43") },
  { id: "arbschg3", label: "ArbSchG § 3 · Grundpflichten des Arbeitgebers", url: gii("arbschg/__3") },
  { id: "arbschg4", label: "ArbSchG § 4 · Allgemeine Grundsätze (Gefahren an der Quelle bekämpfen)", url: gii("arbschg/__4") },
  { id: "arbschg5", label: "ArbSchG § 5 · Beurteilung der Arbeitsbedingungen", url: gii("arbschg/__5") },
  { id: "arbschg15", label: "ArbSchG § 15 · Pflichten der Beschäftigten", url: gii("arbschg/__15") },
  { id: "laerm6", label: "LärmVibrationsArbSchV § 6 · Auslösewerte bei Lärm (80 und 85 dB(A))", url: gii("l_rmvibrationsarbschv/__6") },
  { id: "laerm8", label: "LärmVibrationsArbSchV § 8 · Gehörschutz", url: gii("l_rmvibrationsarbschv/__8") },
  { id: "arbstaettv", label: "Arbeitsstättenverordnung · Anhang (Anforderungen an Arbeitsstätten)", url: gii("arbst_ttv_2004/anhang") },
];

export const FORMULAS: Array<{ lb: number; name: string; rule: string; lesson: string }> = [
  {
    lb: 1,
    name: "Vollständige Handlung (5 Phasen)",
    rule: "Projektinitiative → Projektplanung → Projektdurchführung → Projektpräsentation → Projektreflexion",
    lesson: "pr-komplexe-aufgabe",
  },
  {
    lb: 1,
    name: "Kosten je Stück im Projekt",
    rule: "Kosten je Stück = (Stückzahl · Material je Stück + feste Kosten) : Stückzahl",
    lesson: "pr-komplexe-aufgabe",
  },
  {
    lb: 1,
    name: "Leittextmethode (6 Schritte)",
    rule: "Informieren → Planen → Entscheiden (Fachgespräch) → Ausführen → Kontrollieren → Bewerten",
    lesson: "pr-leittext-weitgehend",
  },
  {
    lb: 1,
    name: "Projektzeit mit Puffer",
    rule: "Gesamtzeit = Arbeitszeit · (1 + Puffer in % : 100); Wochen = Gesamtzeit : Projektstunden pro Woche (aufrunden)",
    lesson: "pr-projektsteuerung",
  },
  {
    lb: 1,
    name: "Messbares Kontrollkriterium (M8)",
    rule: "Sollwert + erlaubte Abweichung, zum Beispiel 0,3 l ± 10 ml",
    lesson: "pr-leittext-selbstaendig",
  },
  {
    lb: 2,
    name: "Informationsquellen zur Berufswahl",
    rule: "Berufsberatung und BIZ · BERUFENET und meinBERUF · Check-U · Kammern (IHK, HWK) · Ausbildungsmessen",
    lesson: "bo-berufsberatung-angebote",
  },
  {
    lb: 2,
    name: "Spätester Start",
    rule: "Spätester Start = Zeit bis zur Frist − benötigte Bearbeitungszeit",
    lesson: "bo-berufswahlprozess-verwalten",
  },
  {
    lb: 2,
    name: "Mindestvergütung (§ 17 BBiG)",
    rule: "2. Jahr = 1. Jahr · 1,18 · 3. Jahr = 1. Jahr · 1,35 · 4. Jahr = 1. Jahr · 1,40 (auf volle Euro gerundet)",
    lesson: "bo-stellenmarkt-recherche",
  },
  {
    lb: 2,
    name: "Profilpassung im Modell",
    rule: "Abstand = Summe der Punktabweichungen; Passung = 100 % − Abstand : 20 · 100 %",
    lesson: "bo-kompetenzprofil",
  },
  {
    lb: 2,
    name: "Anschreiben",
    rule: "Absender · Empfänger · Ort, Datum · Betreff · Anrede · Einleitung · Hauptteil · Schluss · Gruß · Unterschrift · Anlagen",
    lesson: "bo-bewerbung-praktikum",
  },
  {
    lb: 2,
    name: "Bewerbungsmappe (R8)",
    rule: "Anschreiben · (Deckblatt) · Lebenslauf · Zeugnisse · Praktikums- und weitere Nachweise; online als eine PDF-Datei",
    lesson: "bo-bewerbungsmappe-ausbildung",
  },
  {
    lb: 2,
    name: "Persönliche Wirkung (R8)",
    rule: "Kleidung · Gestik · Mimik · Sprache",
    lesson: "bo-vorstellungsgespraech",
  },
  {
    lb: 2,
    name: "Lebensplanentwurf (M8)",
    rule: "Ziel · Leistungsvermögen prüfen · Schullaufbahn anpassen · Alternative (Plan B)",
    lesson: "bo-lebensplan-schullaufbahn",
  },
  {
    lb: 3,
    name: "Bezugspreis",
    rule: "Bezugspreis = Listenpreis − Rabatt + Bezugskosten",
    lesson: "wi-betriebserkundung-grundfunktionen",
  },
  {
    lb: 3,
    name: "Verkaufspreis mit Zuschlag",
    rule: "Verkaufspreis = Kosten je Stück · (1 + Zuschlag in % : 100)",
    lesson: "wi-geschaeft-planen",
  },
  {
    lb: 3,
    name: "Gewinn- und Verlustrechnung",
    rule: "Ergebnis = Erträge − Aufwendungen (positiv: Gewinn, negativ: Verlust)",
    lesson: "wi-gewinn-verlust",
  },
  {
    lb: 3,
    name: "Einfacher Wirtschaftskreislauf",
    rule: "Einkommen = Konsumausgaben + Ersparnis; Güterstrom und Geldstrom laufen gegeneinander",
    lesson: "wi-wirtschaftskreislauf",
  },
  {
    lb: 3,
    name: "Akkordlohn (Minutenakkord)",
    rule: "Akkordlohn = Stückzahl · Vorgabezeit je Stück · Minutenfaktor (Akkordrichtsatz : 60)",
    lesson: "wi-entlohnungsformen",
  },
  {
    lb: 3,
    name: "Mindestlohn prüfen",
    rule: "Stundenlohn = Bruttolohn : Arbeitsstunden; seit 1. Januar 2026 mindestens 13,90 € je Stunde",
    lesson: "wi-mindestlohn-tariflohn",
  },
  {
    lb: 3,
    name: "Vom Brutto zum Netto",
    rule: "Netto = Brutto − Lohnsteuer − Kirchensteuer − Solidaritätszuschlag − Arbeitnehmeranteil Sozialversicherung",
    lesson: "wi-lohnabrechnung",
  },
  {
    lb: 4,
    name: "Arbeitszeit im Betriebspraktikum",
    rule: "Höchstens 7 Std. täglich, 35 Std. wöchentlich, 6 bis 20 Uhr, fünf Tage (§§ 5, 7, 14, 15 JArbSchG)",
    lesson: "re-praktikum-bestimmungen",
  },
  {
    lb: 4,
    name: "Ruhepausen (§ 11 JArbSchG)",
    rule: "Mehr als 4,5 bis 6 Std. Arbeit: 30 Min.; mehr als 6 Std.: 60 Min.; Pause mindestens 15 Min. am Stück",
    lesson: "re-praktikum-bestimmungen",
  },
  {
    lb: 4,
    name: "Schutz im Praktikum",
    rule: "Keine gefährlichen Arbeiten (§ 22), kein Akkord (§ 23), Unterweisung vor Beginn (§ 29 JArbSchG)",
    lesson: "re-schutzbestimmungen-notwendigkeit",
  },
  {
    lb: 4,
    name: "Versicherungsschutz",
    rule: "Schulpraktikum = Schulveranstaltung: gesetzlich unfallversichert (§ 2 Abs. 1 Nr. 8 SGB VII), kein Mindestlohn (§ 22 MiLoG)",
    lesson: "re-praktikum-pflichten-versicherung",
  },
  {
    lb: 5,
    name: "Arbeitsproduktivität",
    rule: "Produktivität = Menge : Arbeitsstunden; Steigerung = (neu − alt) : alt · 100 %",
    lesson: "te-produktionsverfahren",
  },
  {
    lb: 5,
    name: "Erkundungsmethoden",
    rule: "Befragen (Leitfaden) · Beobachten (Beobachtungsbogen) · Protokollieren (Datum, Stichpunkte, Skizze)",
    lesson: "te-erkundungsmethoden",
  },
  {
    lb: 5,
    name: "Lärm-Auslösewerte",
    rule: "Ab 80 dB(A) Gehörschutz bereitstellen, ab 85 dB(A) Gehörschutz tragen (§§ 6, 8 LärmVibrationsArbSchV)",
    lesson: "te-ergonomie-arbeitssicherheit",
  },
  {
    lb: 5,
    name: "Rangfolge der Schutzmaßnahmen",
    rule: "Technisch → organisatorisch → persönlich (§ 4 Nr. 2 und Nr. 5 ArbSchG)",
    lesson: "te-ergonomie-arbeitssicherheit",
  },
  {
    lb: 5,
    name: "Nutzwertanalyse (M8)",
    rule: "Nutzwert = Summe aus Punkte · Gewicht; Kostengleichheit ab Abschreibung pro Jahr : Ersparnis je Stück",
    lesson: "te-vor-nachteile-abwaegen",
  },
];
