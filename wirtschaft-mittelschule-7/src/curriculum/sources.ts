import type { Track } from "../model/types";

export const EDITORIAL_DATE = "23. November 2026";
export const CURRICULUM_URL_R =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/wib/regelklasse";
export const CURRICULUM_URL_M =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/wib/mittlere-reife-klasse";

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
    subtitle: "Marktprojekt, vollständige Handlung und Leittextmethode",
    tracks: ["R", "M"],
    hue: 162,
  },
  {
    lb: 2,
    title: "Arbeit",
    subtitle: "Arbeitsplatzmerkmale, Erwerbsarbeit, Ausbildung und Selbständigkeit",
    tracks: ["R", "M"],
    hue: 212,
  },
  {
    lb: 3,
    title: "Berufsorientierung",
    subtitle: "Portfolio, Berufsberatung, Tätigkeitsbereiche und Einschätzung",
    tracks: ["R", "M"],
    hue: 32,
  },
  {
    lb: 4,
    title: "Wirtschaft",
    subtitle: "Geldwert, Haushaltsplan, Markterkundung und Pausenverkauf",
    tracks: ["R", "M"],
    hue: 286,
  },
  {
    lb: 5,
    title: "Recht",
    subtitle: "Kinderarbeitsverbot, Ferienjob-Regeln und Betriebspraktikum",
    tracks: ["R", "M"],
    hue: 348,
  },
  {
    lb: 6,
    title: "Technik",
    subtitle: "Technikerkundung, Haushaltsgeräte, Ökologie und Qualifikation",
    tracks: ["R", "M"],
    hue: 125,
  },
];

export const SOURCES = [
  {
    id: "lpr",
    label: "LehrplanPLUS · Wirtschaft und Beruf R7 (Regelklasse)",
    url: CURRICULUM_URL_R,
  },
  {
    id: "lpm",
    label: "LehrplanPLUS · Wirtschaft und Beruf M7 (Mittlere-Reife-Klasse)",
    url: CURRICULUM_URL_M,
  },
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
  {
    id: "jarbschg2",
    label: "JArbSchG § 2 · Kind und Jugendlicher (Altersgrenzen)",
    url: "https://www.gesetze-im-internet.de/jarbschg/__2.html",
  },
  {
    id: "jarbschg5",
    label: "JArbSchG § 5 · Verbot der Beschäftigung von Kindern, Praktikum, Ferienarbeit",
    url: "https://www.gesetze-im-internet.de/jarbschg/__5.html",
  },
  {
    id: "jarbschg7",
    label: "JArbSchG § 7 · Nicht vollzeitschulpflichtige Kinder",
    url: "https://www.gesetze-im-internet.de/jarbschg/__7.html",
  },
  {
    id: "jarbschg8",
    label: "JArbSchG § 8 · Dauer der Arbeitszeit (8 Std./Tag, 40 Std./Woche)",
    url: "https://www.gesetze-im-internet.de/jarbschg/__8.html",
  },
  {
    id: "jarbschg11",
    label: "JArbSchG § 11 · Ruhepausen (30 Min. bzw. 60 Min.)",
    url: "https://www.gesetze-im-internet.de/jarbschg/__11.html",
  },
  {
    id: "jarbschg14",
    label: "JArbSchG § 14 · Nachtruhe (6 bis 20 Uhr)",
    url: "https://www.gesetze-im-internet.de/jarbschg/__14.html",
  },
  {
    id: "jarbschg15",
    label: "JArbSchG § 15 · Fünf-Tage-Woche",
    url: "https://www.gesetze-im-internet.de/jarbschg/__15.html",
  },
  {
    id: "jarbschg22",
    label: "JArbSchG § 22 · Gefährliche Arbeiten",
    url: "https://www.gesetze-im-internet.de/jarbschg/__22.html",
  },
  {
    id: "bbig1",
    label: "BBiG § 1 · Ziele und Begriffe der Berufsbildung",
    url: "https://www.gesetze-im-internet.de/bbig_2005/__1.html",
  },
  {
    id: "bbig4",
    label: "BBiG § 4 · Anerkannte Ausbildungsberufe",
    url: "https://www.gesetze-im-internet.de/bbig_2005/__4.html",
  },
  {
    id: "bbig71",
    label: "BBiG § 71 · Zuständige Stellen (IHK und HWK)",
    url: "https://www.gesetze-im-internet.de/bbig_2005/__71.html",
  },
  {
    id: "sgb3_29",
    label: "SGB III § 29 · Berufsberatung der Agentur für Arbeit",
    url: "https://www.gesetze-im-internet.de/sgb_3/__29.html",
  },
  {
    id: "sgb3_33",
    label: "SGB III § 33 · Berufsorientierung",
    url: "https://www.gesetze-im-internet.de/sgb_3/__33.html",
  },
  {
    id: "bgb611a",
    label: "BGB § 611a · Arbeitsvertrag (abhängige Beschäftigung)",
    url: "https://www.gesetze-im-internet.de/bgb/__611a.html",
  },
  {
    id: "hgb84",
    label: "HGB § 84 · Selbständige Tätigkeit",
    url: "https://www.gesetze-im-internet.de/hgb/__84.html",
  },
  {
    id: "pangv3",
    label: "PAngV § 3 · Gesamtpreis und Grundpreis",
    url: "https://www.gesetze-im-internet.de/pangv_2022/__3.html",
  },
  {
    id: "envkg4",
    label: "EnVKG § 4 · Energieverbrauchskennzeichnung",
    url: "https://www.gesetze-im-internet.de/envkg_2012/__4.html",
  },
  {
    id: "bibb",
    label: "BIBB · Aus- und Fortbildungsberufe suchen",
    url: "https://www.bibb.de/de/berufeinfo.php",
  },
  {
    id: "uba",
    label: "Umweltbundesamt · Elektrogeräte im Haushalt",
    url: "https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/elektrogeraete",
  },
];

/** Nachschlagewerk: Jede Regel nennt die Lektion ihres Lernbereichs. */
export const FORMULAS: Array<{ lb: number; name: string; rule: string; lesson: string }> = [
  {
    lb: 1,
    name: "Vollständige Handlung (5 Phasen)",
    rule: "Projektinitiative → Projektplanung → Projektdurchführung → Projektpräsentation → Projektreflexion",
    lesson: "pr-vollstaendige-handlung",
  },
  {
    lb: 1,
    name: "Leittextmethode (6 Schritte)",
    rule: "Informieren → Planen → Entscheiden → Ausführen → Kontrollieren → Bewerten",
    lesson: "pr-leittextmethode",
  },
  {
    lb: 1,
    name: "Projekt-Mindestabsatz (Kostendeckung)",
    rule: "Mindeststückzahl = Fixkosten / (Verkaufspreis − variable Stückkosten)",
    lesson: "pr-marktprojekt-umsetzen",
  },
  {
    lb: 1,
    name: "Eigenständige Leittext-Prüfung (M7)",
    rule: "Eigene Leitfragen formulieren, Messkriterien festlegen und Abweichungen direkt nachsteuern",
    lesson: "pr-leittext-selbstaendig",
  },
  {
    lb: 2,
    name: "Sechs Arbeitsplatzmerkmale",
    rule: "Arbeitsaufgabe · Arbeitsmittel · Arbeitsort · Arbeitszeit · Arbeitsdauer · Arbeitsbedingungen",
    lesson: "ar-arbeitsplatzmerkmale",
  },
  {
    lb: 2,
    name: "Duale Berufsausbildung",
    rule: "Lernort Betrieb (Praxis nach Ausbildungsordnung) + Lernort Berufsschule (Theorie & Allgemeinbildung)",
    lesson: "ar-zugangserkundung-ausbildung",
  },
  {
    lb: 2,
    name: "Abhängig vs. selbständig",
    rule: "Abhängig Beschäftigte sind weisungsgebunden (§ 611a BGB); Selbständige tragen unternehmerisches Risiko (§ 84 HGB)",
    lesson: "ar-abhaengig-selbstaendig",
  },
  {
    lb: 2,
    name: "Planspiel-Betriebsergebnis (M7)",
    rule: "Gewinn/Verlust = Umsatz − Materialkosten − laufende Fixkosten",
    lesson: "ar-planspiel-selbstaendigkeit",
  },
  {
    lb: 3,
    name: "Berufswahlportfolio",
    rule: "Geordnete Sammlung zu Interessen, Fähigkeiten, Zugangserkundungen und schulischen Schritten",
    lesson: "bo-berufswahlportfolio",
  },
  {
    lb: 3,
    name: "Berufsberatung & Kammern",
    rule: "Agentur für Arbeit (neutral, kostenlos); IHK (Industrie/Handel) und HWK (Handwerk) als zuständige Stellen",
    lesson: "bo-berufsberatung-kammern",
  },
  {
    lb: 3,
    name: "Gewichteter Profilabgleich",
    rule: "Gesamtpunkte = ∑ (Merkmalspunkt · Gewicht % / 100), Abgleich mit Selbst- und Fremdeinschätzung",
    lesson: "bo-taetigkeitsbereiche-anforderungen",
  },
  {
    lb: 3,
    name: "Ausbildungsbudget (M7)",
    rule: "Frei verfügbar = Auszubildenden-Vergütung − Fahrtkosten − Arbeitsmittel − feste Rücklage",
    lesson: "bo-finanzielle-aspekte-sichtweisen",
  },
  {
    lb: 4,
    name: "Arbeitszeit-Äquivalent",
    rule: "Benötigte Arbeitszeit (Std.) = Preis des Gutes / Nettostundenlohn",
    lesson: "wi-geldwert-arbeitszeit",
  },
  {
    lb: 4,
    name: "Grundbedarfsquote (M7)",
    rule: "Grundbedarfsquote (%) = (Ausgaben für Grundbedarf / Nettoeinkommen) · 100",
    lesson: "wi-einkommen-lebensstandard",
  },
  {
    lb: 4,
    name: "Mehrwöchige Geldübersicht",
    rule: "Überschuss = ∑ Einnahmen − (feste Ausgaben + veränderliche Ausgaben)",
    lesson: "wi-einnahmen-ausgaben-planen",
  },
  {
    lb: 4,
    name: "Grundpreis (Marktvergleich)",
    rule: "Grundpreis (€/kg oder €/l) = Verkaufspreis / Füllmenge",
    lesson: "wi-markterkundung",
  },
  {
    lb: 4,
    name: "Angebot und Nachfrage",
    rule: "Nachfrageüberhang zieht Preise nach oben; Angebotsüberhang drückt Preise nach unten",
    lesson: "wi-angebot-und-nachfrage",
  },
  {
    lb: 4,
    name: "Pausenverkauf-Überschuss",
    rule: "Überschuss = (verkaufte Stück · Verkaufspreis) − (Einkaufsmenge · Stückkosten + Standkosten)",
    lesson: "wi-einnahmen-ausgaben-projekt",
  },
  {
    lb: 5,
    name: "Kinderarbeit & leichte Tätigkeit",
    rule: "Unter 15 Jahren verboten (§ 5 Abs. 1 JArbSchG); ab über 13 Jahren leichte Arbeit max. 2 Std./Tag (8–18 Uhr)",
    lesson: "re-kinderarbeit-ferienzweck",
  },
  {
    lb: 5,
    name: "Ferienjob ab 15 Jahren (§ 5 Abs. 4)",
    rule: "Höchstens 4 Wochen (20 Arbeitstage) im Kalenderjahr, max. 8 Std./Tag, 40 Std./Woche, 6–20 Uhr, 5-Tage-Woche",
    lesson: "re-ferienarbeit-regeln",
  },
  {
    lb: 5,
    name: "Ruhepausen (§ 11 JArbSchG)",
    rule: "Mindestens 30 Min. bei > 4,5 bis 6 Std. Arbeitszeit; mindestens 60 Min. bei > 6 Std. Arbeitszeit",
    lesson: "re-ferienarbeit-regeln",
  },
  {
    lb: 5,
    name: "Betriebspraktikum vs. Ferienjob",
    rule: "Betriebspraktikum (§ 5 Abs. 2 Nr. 2): Lernzweck, auch vor 15 J., kein Lohn; Ferienjob (§ 5 Abs. 4): ab 15 J., Entgelt",
    lesson: "re-praktikum-vs-ferienjob",
  },
  {
    lb: 6,
    name: "Elektrische Arbeit (Stromverbrauch)",
    rule: "Energie (kWh) = (Leistung in Watt · Laufzeit in Stunden) / 1.000",
    lesson: "te-oekonomie-oekologie-haushalt",
  },
  {
    lb: 6,
    name: "Stromkosten im Zeitraum",
    rule: "Stromkosten (€) = Energie (kWh) · Strompreis (€/kWh)",
    lesson: "te-oekonomie-oekologie-haushalt",
  },
  {
    lb: 6,
    name: "Amortisationsdauer (M7)",
    rule: "Amortisation (Jahre) = Mehrpreis beim Kauf / jährliche Betriebskostenersparnis",
    lesson: "te-grenzen-chancen-risiken",
  },
  {
    lb: 6,
    name: "Haushaltsproduktion (Aufwandsvergleich)",
    rule: "Gesamtkosten Eigenherstellung = Zutaten + Energiekosten + zeitlicher Arbeitsaufwand",
    lesson: "te-arbeit-technik-haushaltsproduktion",
  },
];
