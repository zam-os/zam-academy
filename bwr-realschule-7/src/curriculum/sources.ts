import type { Track } from "../model/types";

export const EDITORIAL_DATE = "21. November 2026";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/bwl-rechnungswesen/wpfg2";
export const CURRICULUM_URL_IIIA =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/bwl-rechnungswesen/wpfg3a";

export interface StageSpec {
  lb: number;
  title: string;
  subtitle: string;
  hours: Record<Track, number>;
  tracks: Track[];
  hue: number;
}

/** One stage per Lernbereich, each with its own accent colour (hue for the CSS tokens). */
export const STAGES: StageSpec[] = [
  {
    lb: 1,
    title: "Wirtschaftliches Handeln im privaten Haushalt",
    subtitle: "Einnahmen, Konsum, Belege, Zahlungsverkehr, Prozentrechnung",
    hours: { II: 19, IIIa: 15 },
    tracks: ["II", "IIIa"],
    hue: 162,
  },
  {
    lb: 2,
    title: "Wirtschaftliches Handeln im Unternehmen",
    subtitle: "Wirtschaftsbereiche, Ziele, Gründung, Standort und Rechtsformen",
    hours: { II: 17, IIIa: 8 },
    tracks: ["II", "IIIa"],
    hue: 212,
  },
  {
    lb: 3,
    title: "Einführung in die Geschäftsbuchführung",
    subtitle: "Inventar, Bilanz, Bestandskonten, Buchungssatz und Umsatzsteuer",
    hours: { II: 17, IIIa: 17 },
    tracks: ["II", "IIIa"],
    hue: 32,
  },
  {
    lb: 4,
    title: "Buchhalterische Erfassung des betrieblichen Produktionsprozesses",
    subtitle: "Produktionsprozess, Werkstoffe, Angebotsvergleich und Absatz",
    hours: { II: 16, IIIa: 16 },
    tracks: ["II", "IIIa"],
    hue: 286,
  },
  {
    lb: 5,
    title: "Strukturierung der Geschäftsbuchführung",
    subtitle: "Eröffnung, Hauptbuch, GUV, Eigenkapital, SBK und Inventurdifferenz",
    hours: { II: 15, IIIa: 0 },
    tracks: ["II"],
    hue: 348,
  },
];

export const SOURCES = [
  { id: "lp2", label: "LehrplanPLUS · BwR 7 · Wahlpflichtfächergruppe II", url: CURRICULUM_URL },
  { id: "lp3a", label: "LehrplanPLUS · BwR 7 · Wahlpflichtfächergruppe IIIa", url: CURRICULUM_URL_IIIA },
  {
    id: "isb",
    label: "ISB · Fachseite Betriebswirtschaftslehre/Rechnungswesen an der Realschule",
    url: "https://www.isb.bayern.de/schularten/realschule/faecher/betriebswirtschaftslehre-rechnungswesen/",
  },
  {
    id: "konten7",
    label: "ISB · Kontenlisten für BwR 7 (LehrplanPLUS)",
    url: "https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/Kontenplaene/kontenlisten_bwr_7_lehrplanplus_2016.pdf",
  },
  {
    id: "handreichung",
    label: "ISB · Handreichung Leistungskorrektur BwR (Kontonummern ab Jgst. 8)",
    url: "https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/HR_Leistungskorrektur/ISB_RS_BwR_Handreichung_2025-06.pdf",
  },
  {
    id: "konten",
    label: "ISB · Kontenplan und Abkürzungsverzeichnis (IKR ab Jgst. 8, LehrplanPLUS)",
    url: "https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/Kontenplaene/Kontenplan_LehrplanPLUS.pdf",
  },
  {
    id: "rso",
    label: "BayRSO Anlage 1 · Stundentafel für die Realschule",
    url: "https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1",
  },
  { id: "hgb17", label: "HGB § 17 · Firma des Kaufmanns", url: "https://www.gesetze-im-internet.de/hgb/__17.html" },
  { id: "hgb18", label: "HGB § 18 · Unterscheidungskraft und Irreführungsverbot", url: "https://www.gesetze-im-internet.de/hgb/__18.html" },
  { id: "hgb19", label: "HGB § 19 · Rechtsformzusätze", url: "https://www.gesetze-im-internet.de/hgb/__19.html" },
  { id: "hgb238", label: "HGB § 238 · Buchführungspflicht", url: "https://www.gesetze-im-internet.de/hgb/__238.html" },
  { id: "hgb239", label: "HGB § 239 · Führung der Handelsbücher (GoB)", url: "https://www.gesetze-im-internet.de/hgb/__239.html" },
  { id: "hgb240", label: "HGB § 240 · Inventar", url: "https://www.gesetze-im-internet.de/hgb/__240.html" },
  { id: "hgb242", label: "HGB § 242 · Pflicht zur Aufstellung von Bilanz und GuV", url: "https://www.gesetze-im-internet.de/hgb/__242.html" },
  { id: "gmbhg5", label: "GmbHG § 5 · Stammkapital der GmbH", url: "https://www.gesetze-im-internet.de/gmbhg/__5.html" },
  { id: "gmbhg13", label: "GmbHG § 13 · Juristische Person und beschränkte Haftung", url: "https://www.gesetze-im-internet.de/gmbhg/__13.html" },
  { id: "ustg12", label: "UStG § 12 · Steuersätze (19 % und 7 %)", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html" },
  { id: "ustg14", label: "UStG § 14 · Ausstellung von Rechnungen", url: "https://www.gesetze-im-internet.de/ustg_1980/__14.html" },
];

/** The Formelsammlung: each rule names the lesson that explains it. */
export const FORMULAS: Array<{ lb: number; name: string; rule: string; lesson: string }> = [
  { lb: 1, name: "Haushaltssaldo", rule: "Einnahmen − (feste Ausgaben + veränderliche Ausgaben)", lesson: "hh-einkommen-budget" },
  { lb: 1, name: "Prozentwert (P)", rule: "Grundwert · Prozentsatz : 100", lesson: "hh-prozent-grundlagen" },
  { lb: 1, name: "Prozentsatz (p)", rule: "Prozentwert · 100 : Grundwert", lesson: "hh-prozent-grundlagen" },
  { lb: 1, name: "Grundwert (G)", rule: "Prozentwert · 100 : Prozentsatz", lesson: "hh-prozent-grundlagen" },
  { lb: 1, name: "Vermehrter Grundwert", rule: "Grundwert · (100 + p) : 100", lesson: "hh-prozent-aenderung" },
  { lb: 1, name: "Verminderter Grundwert", rule: "Grundwert · (100 − p) : 100", lesson: "hh-prozent-aenderung" },
  { lb: 2, name: "Gewichtete Standortnote", rule: "Summe aus (Punktzahl · Gewicht) : 100", lesson: "un-standort" },
  { lb: 2, name: "Stammkapital einer GmbH", rule: "mindestens 25.000 Euro (beschränkte Haftung)", lesson: "un-rechtsformen" },
  { lb: 3, name: "Reinvermögen (Eigenkapital)", rule: "Summe des Vermögens − Summe der Schulden", lesson: "gb-inventur-inventar" },
  { lb: 3, name: "Bilanzgleichung", rule: "Summe Aktiva = Summe Passiva (Anlage- + Umlaufvermögen = Eigen- + Fremdkapital)", lesson: "gb-bilanz" },
  { lb: 3, name: "Aktivkonto", rule: "Anfangsbestand und Zugänge im Soll (links), Abgänge und Schlussbestand im Haben (rechts)", lesson: "gb-bestandskonten" },
  { lb: 3, name: "Passivkonto", rule: "Anfangsbestand und Zugänge im Haben (rechts), Abgänge und Schlussbestand im Soll (links)", lesson: "gb-bestandskonten" },
  { lb: 3, name: "Grundregel Buchungssatz", rule: "Sollkonto(en) und Betrag an Habenkonto(en) und Betrag", lesson: "gb-buchungssatz" },
  { lb: 3, name: "Umsatzsteuer aus Netto", rule: "Steuerbetrag = Netto · Steuersatz : 100; Brutto = Netto + Steuer", lesson: "gb-umsatzsteuer-rechnen" },
  { lb: 3, name: "Netto aus Brutto (19 %)", rule: "Netto = Brutto · 100 : 119; bei 7 %: Brutto · 100 : 107", lesson: "gb-umsatzsteuer-rechnen" },
  { lb: 3, name: "Einkauf eines Anlageguts mit Vorsteuer", rule: "Anlagekonto (netto) und VORST im Soll an VE oder BK (brutto)", lesson: "gb-umsatzsteuer-buchen" },
  { lb: 4, name: "Periodenerfolg", rule: "Summe der Erträge − Summe der Aufwendungen (Ergebnis > 0: Gewinn, < 0: Verlust)", lesson: "pp-produktionsprozess" },
  { lb: 4, name: "Angebotspreis mit Sofortrabatt", rule: "Listenpreis netto − Sofortrabatt = Bezugspreis netto; danach + 19 % Umsatzsteuer", lesson: "pp-angebotsvergleich" },
  { lb: 4, name: "Werkstoffeinkauf (aufwandsorientiert)", rule: "AWR / AWF / AWH / AWB (netto) und VORST an VE oder BK (brutto)", lesson: "pp-einkauf-werkstoffe" },
  { lb: 4, name: "Verkauf von Fertigerzeugnissen", rule: "FO oder BK (brutto) an UEFE (netto) und UST", lesson: "pp-verkauf-fe" },
  { lb: 5, name: "Abschluss der Erfolgskonten", rule: "GUV an Aufwandskonto; Ertragskonto an GUV", lesson: "sg-guv-abschluss" },
  { lb: 5, name: "Abschluss GUV auf EK", rule: "Gewinn: GUV an EK; Verlust: EK an GUV", lesson: "sg-eigenkapital-nahtstelle" },
  { lb: 5, name: "Abschluss der Bestandskonten", rule: "Aktiv: SBK an Aktivkonto; Passiv: Passivkonto an SBK", lesson: "sg-sbk-schlussbilanz" },
  { lb: 5, name: "Inventurdifferenz", rule: "Abweichung = Istbestand − Sollbestand (negativ: Fehlbestand / Schwund)", lesson: "sg-inventurdifferenzen" },
];
