import type { Stage } from "../model/types";

export const EDITORIAL_DATE = "22. Oktober 2026";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/wirtschaft-und-recht/wpfg1-3";

/** Four Lernbereiche of the Fachlehrplan WR 9 (I/III) and the optional bilingual one. */
export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Berufliche Orientierung",
    subtitle: "Arbeit verstehen, Beruf wählen, Ausbildung klären",
    hours: 12,
    glyph: "💼",
  },
  {
    lb: 2,
    title: "Wirtschaften in der Sozialen Marktwirtschaft",
    subtitle: "Markt, Preis, Kreislauf und soziale Sicherung",
    hours: 11,
    glyph: "📈",
  },
  {
    lb: 3,
    title: "Verbraucherschutz",
    subtitle: "Informieren, anlegen, bezahlen und klug entscheiden",
    hours: 12,
    glyph: "🛒",
  },
  {
    lb: 4,
    title: "Grundzüge des Rechts",
    subtitle: "Rechtsordnung, Kaufvertrag und Strafrecht an Fällen",
    hours: 21,
    glyph: "⚖️",
  },
  {
    lb: 5,
    title: "Business English",
    subtitle: "Optional: Beruf und Markt auf Englisch",
    hours: 0,
    glyph: "🌍",
  },
];

/** `ref` is the label shown in a lesson; every `url` is a stable public landing page. */
export const SOURCES = [
  { id: "lp", label: "LehrplanPLUS · Wirtschaft und Recht 9 (I/III)", url: CURRICULUM_URL },
  { id: "gg", label: "Grundgesetz (GG)", url: "https://www.gesetze-im-internet.de/gg/" },
  { id: "bgb", label: "Bürgerliches Gesetzbuch (BGB)", url: "https://www.gesetze-im-internet.de/bgb/" },
  {
    id: "bbig",
    label: "Berufsbildungsgesetz (BBiG)",
    url: "https://www.gesetze-im-internet.de/bbig_2005/",
  },
  {
    id: "jarbschg",
    label: "Jugendarbeitsschutzgesetz (JArbSchG)",
    url: "https://www.gesetze-im-internet.de/jarbschg/",
  },
  { id: "juschg", label: "Jugendschutzgesetz (JuSchG)", url: "https://www.gesetze-im-internet.de/juschg/" },
  { id: "stgb", label: "Strafgesetzbuch (StGB)", url: "https://www.gesetze-im-internet.de/stgb/" },
  { id: "jgg", label: "Jugendgerichtsgesetz (JGG)", url: "https://www.gesetze-im-internet.de/jgg/" },
  { id: "owig", label: "Gesetz über Ordnungswidrigkeiten (OWiG)", url: "https://www.gesetze-im-internet.de/owig_1968/" },
  { id: "stpo", label: "Strafprozessordnung (StPO)", url: "https://www.gesetze-im-internet.de/stpo/" },
  { id: "sgb2", label: "SGB II · Grundsicherung für Arbeitsuchende", url: "https://www.gesetze-im-internet.de/sgb_2/" },
  { id: "sgb3", label: "SGB III · Arbeitsförderung", url: "https://www.gesetze-im-internet.de/sgb_3/" },
  { id: "sgb5", label: "SGB V · Gesetzliche Krankenversicherung", url: "https://www.gesetze-im-internet.de/sgb_5/" },
  { id: "sgb6", label: "SGB VI · Gesetzliche Rentenversicherung", url: "https://www.gesetze-im-internet.de/sgb_6/" },
  { id: "sgb7", label: "SGB VII · Gesetzliche Unfallversicherung", url: "https://www.gesetze-im-internet.de/sgb_7/" },
  { id: "sgb11", label: "SGB XI · Soziale Pflegeversicherung", url: "https://www.gesetze-im-internet.de/sgb_11/" },
  { id: "sgb12", label: "SGB XII · Sozialhilfe", url: "https://www.gesetze-im-internet.de/sgb_12/" },
  { id: "gwb", label: "Gesetz gegen Wettbewerbsbeschränkungen (GWB)", url: "https://www.gesetze-im-internet.de/gwb/" },
  { id: "stabg", label: "Stabilitätsgesetz (StabG)", url: "https://www.gesetze-im-internet.de/stabg/" },
  { id: "pangv", label: "Preisangabenverordnung (PAngV)", url: "https://www.gesetze-im-internet.de/pangv_2022/" },
  { id: "ba", label: "Bundesagentur für Arbeit", url: "https://www.arbeitsagentur.de/" },
  { id: "berufenet", label: "BERUFENET der Bundesagentur für Arbeit", url: "https://berufenet.arbeitsagentur.de/" },
  { id: "eures", label: "EURES · Arbeiten in Europa", url: "https://eures.europa.eu/" },
  { id: "destatis", label: "Statistisches Bundesamt (Destatis)", url: "https://www.destatis.de/" },
  { id: "bpb", label: "Bundeszentrale für politische Bildung", url: "https://www.bpb.de/" },
  { id: "bundesbank", label: "Deutsche Bundesbank · Verbraucher", url: "https://www.bundesbank.de/" },
  { id: "bafin", label: "BaFin · Verbraucher", url: "https://www.bafin.de/" },
  { id: "vz", label: "Verbraucherzentralen", url: "https://www.verbraucherzentrale.de/" },
  { id: "test", label: "Stiftung Warentest", url: "https://www.test.de/" },
  { id: "evz", label: "Europäisches Verbraucherzentrum Deutschland", url: "https://www.evz.de/" },
  { id: "fair", label: "Fairtrade Deutschland", url: "https://www.fairtrade-deutschland.de/" },
  { id: "bfdi", label: "Bundesbeauftragte für den Datenschutz", url: "https://www.bfdi.bund.de/" },
  { id: "bmj", label: "Bundesministerium der Justiz", url: "https://www.bmj.de/" },
  { id: "uba", label: "Umweltbundesamt (Blauer Engel)", url: "https://www.umweltbundesamt.de/" },
  { id: "siegelklarheit", label: "Siegelklarheit der Bundesregierung", url: "https://www.siegelklarheit.de/" },
  { id: "sperrnotruf", label: "Sperr-Notruf 116 116", url: "https://www.sperr-notruf.de/" },
];
