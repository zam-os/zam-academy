export const EDITORIAL_DATE = "25. Oktober 2026";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/bwl-rechnungswesen/wpfg2";
/** One stage per Lernbereich, each with its own accent colour (hue for the CSS tokens). */
export const STAGES = [
  {
    lb: 1,
    title: "Erfolg periodenrichtig ermitteln",
    subtitle: "Abgrenzen und Rückstellungen bilden",
    hours: 10,
    hue: 162,
  },
  {
    lb: 2,
    title: "Abschluss und Auswertung",
    subtitle: "Bilanz aufbereiten, Kennzahlen beurteilen",
    hours: 17,
    hue: 212,
  },
  {
    lb: 3,
    title: "Vollkostenrechnung",
    subtitle: "Kostenarten, Kostenstellen, Kostenträger",
    hours: 30,
    hue: 32,
  },
  {
    lb: 4,
    title: "Teilkostenrechnung",
    subtitle: "Deckungsbeitrag und kurzfristige Entscheidungen",
    hours: 15,
    hue: 286,
  },
  {
    lb: 0,
    title: "Grundlagen auffrischen",
    subtitle: "Optional: Vorsteuer und Prozentrechnung im Hundert",
    hours: 0,
    hue: 96,
  },
];
export const SOURCES = [
  { id: "lp", label: "LehrplanPLUS · BwR 10 · Wahlpflichtfächergruppe II", url: CURRICULUM_URL },
  {
    id: "lp8",
    label: "LehrplanPLUS · BwR 8 · II (Verkaufskalkulation, Wiederholung)",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/bwl-rechnungswesen/wpfg2",
  },
  {
    id: "isb",
    label: "ISB · Fachseite BwR an der Realschule",
    url: "https://www.isb.bayern.de/schularten/realschule/faecher/betriebswirtschaftslehre-rechnungswesen/",
  },
  {
    id: "konten",
    label: "ISB · Kontenplan und Abkürzungsverzeichnis (LehrplanPLUS)",
    url: "https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/Kontenplaene/Kontenplan_LehrplanPLUS.pdf",
  },
  {
    id: "hgb250",
    label: "HGB § 250 · Rechnungsabgrenzungsposten",
    url: "https://www.gesetze-im-internet.de/hgb/__250.html",
  },
  {
    id: "hgb249",
    label: "HGB § 249 · Rückstellungen",
    url: "https://www.gesetze-im-internet.de/hgb/__249.html",
  },
  {
    id: "hgb252",
    label: "HGB § 252 · Allgemeine Bewertungsgrundsätze (Periodenabgrenzung)",
    url: "https://www.gesetze-im-internet.de/hgb/__252.html",
  },
  {
    id: "hgb242",
    label: "HGB § 242 · Pflicht zur Aufstellung von Bilanz und GuV",
    url: "https://www.gesetze-im-internet.de/hgb/__242.html",
  },
];
/** The Formelsammlung: each rule names the lesson that explains it. */
export const FORMULAS: Array<{ lb: number; name: string; rule: string; lesson: string }> = [
  {
    lb: 1,
    name: "Abgrenzungsbetrag",
    rule: "Nettobetrag : Monate der Laufzeit · Monate im neuen Jahr",
    lesson: "pe-zuordnung",
  },
  { lb: 1, name: "Aktive Rechnungsabgrenzung (31.12.)", rule: "2900 ARA an Aufwandskonto", lesson: "pe-ara" },
  { lb: 1, name: "Passive Rechnungsabgrenzung (31.12.)", rule: "Ertragskonto an 4900 PRA", lesson: "pe-pra" },
  { lb: 1, name: "Bildung einer Rückstellung", rule: "6160 FRI bzw. 6770 RBK an 3900 RST (netto)", lesson: "pe-rst-bilden" },
  {
    lb: 1,
    name: "Auflösung einer Rückstellung",
    rule: "3900 RST, 2600 VORST (bei zu wenig: + 6990 PFAW) an 4400 VE (bei zu viel: + 5490 PFE)",
    lesson: "pe-rst-aufloesen",
  },
  {
    lb: 2,
    name: "Eigenkapital am Jahresende",
    rule: "Anfangskapital + Gewinn + Einlagen − Entnahmen",
    lesson: "ua-eigenkapital",
  },
  {
    lb: 2,
    name: "Forderungen (aufbereitet)",
    rule: "FO + ZWFO + VORST + ARA − EWB − PWB",
    lesson: "ua-aufbereiten",
  },
  {
    lb: 2,
    name: "Kurzfristiges Fremdkapital",
    rule: "RST + KBKV + VE + UST + VFA + VSV + PRA",
    lesson: "ua-aufbereiten",
  },
  {
    lb: 2,
    name: "Barliquidität",
    rule: "flüssige Mittel · 100 : kurzfristiges Fremdkapital",
    lesson: "ua-barliquiditaet",
  },
  {
    lb: 2,
    name: "Einzugsliquidität",
    rule: "(Forderungen + flüssige Mittel) · 100 : kurzfristiges Fremdkapital",
    lesson: "ua-einzugsliquiditaet",
  },
  { lb: 2, name: "Anlagendeckung I", rule: "Eigenkapital · 100 : Anlagevermögen", lesson: "ua-anlagendeckung" },
  {
    lb: 2,
    name: "Anlagendeckung II",
    rule: "(Eigenkapital + langfristiges Fremdkapital) · 100 : Anlagevermögen",
    lesson: "ua-anlagendeckung",
  },
  {
    lb: 2,
    name: "Eigenkapitalrentabilität",
    rule: "Gewinn · 100 : Eigenkapital am Jahresanfang",
    lesson: "ua-ekrentabilitaet",
  },
  {
    lb: 3,
    name: "Gesamtergebnis",
    rule: "neutrales Ergebnis + Betriebsergebnis (ohne kostenrechnerische Korrekturen)",
    lesson: "vk-ergebnis",
  },
  {
    lb: 3,
    name: "Kalkulatorische Abschreibung",
    rule: "Wiederbeschaffungswert : Nutzungsdauer",
    lesson: "vk-anders-zusatz",
  },
  { lb: 3, name: "MGK-Zuschlagssatz", rule: "MGK · 100 : Fertigungsmaterial", lesson: "vk-zuschlagssaetze" },
  { lb: 3, name: "FGK-Zuschlagssatz", rule: "FGK · 100 : Fertigungslöhne", lesson: "vk-zuschlagssaetze" },
  {
    lb: 3,
    name: "VwGK- und VtGK-Zuschlagssatz",
    rule: "VwGK bzw. VtGK · 100 : Herstellkosten des Umsatzes",
    lesson: "vk-zuschlagssaetze",
  },
  {
    lb: 3,
    name: "Herstellkosten des Umsatzes",
    rule: "HK der Erzeugung − Mehrbestand + Minderbestand",
    lesson: "vk-gesamtrechnung",
  },
  {
    lb: 3,
    name: "Zuschlagskalkulation",
    rule: "FM + MGK = MK; FL + FGK + SEKF = FK; MK + FK = HK; HK + VwVtGK = SK",
    lesson: "vk-zuschlagskalkulation",
  },
  {
    lb: 3,
    name: "Angebotspreis",
    rule: "SK + Gewinn = BVP; BVP · 100 : (100 − Skonto) = ZVP; ZVP · 100 : (100 − Rabatt) = LVP",
    lesson: "vk-angebotspreis",
  },
  { lb: 4, name: "Gesamtkosten", rule: "Fixkosten + variable Stückkosten · Menge", lesson: "tk-voll-teil" },
  { lb: 4, name: "Stückdeckungsbeitrag", rule: "Nettoverkaufspreis − variable Stückkosten", lesson: "tk-db" },
  {
    lb: 4,
    name: "Betriebsergebnis",
    rule: "Stückdeckungsbeitrag · Menge − Fixkosten",
    lesson: "tk-db",
  },
  {
    lb: 4,
    name: "Gewinnschwellenmenge",
    rule: "Fixkosten : Stückdeckungsbeitrag (aufrunden)",
    lesson: "tk-gewinnschwelle",
  },
  { lb: 4, name: "Kurzfristige Preisuntergrenze", rule: "variable Stückkosten", lesson: "tk-preisuntergrenze" },
  {
    lb: 4,
    name: "Langfristige Preisuntergrenze",
    rule: "variable Stückkosten + Fixkosten : Menge",
    lesson: "tk-preisuntergrenze",
  },
  {
    lb: 4,
    name: "Kritische Menge (make or buy)",
    rule: "Fixkosten : (Einstandspreis − variable Stückkosten)",
    lesson: "tk-make-or-buy",
  },
];
