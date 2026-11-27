import type { Stage } from "../model/types";

export const EDITORIAL_DATE = "27. November 2026";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/wirtschaft-und-recht/wpfg2";
export const OPTIONAL_LB = 6;

export const STAGES: Stage[] = [
  { lb: 1, title: "Wirtschaften auf dem Gütermarkt", subtitle: "Knappheit, Preise, Wettbewerb und Welthandel", hours: 8, glyph: "📈" },
  { lb: 2, title: "Verbraucherschutz", subtitle: "Angebote, Werbung und Onlinekäufe prüfen", hours: 10, glyph: "🛒" },
  { lb: 3, title: "Jugendliche und das Recht", subtitle: "Rechtsquellen, Altersgrenzen und Jugendschutz", hours: 10, glyph: "🛡️" },
  { lb: 4, title: "Privatrechtliche Regelungen", subtitle: "Eigentum, Kaufverträge und Verbraucherrechte", hours: 18, glyph: "⚖️" },
  { lb: 5, title: "Berufliche Orientierung", subtitle: "Berufe erkunden und ein Praktikum vorbereiten", hours: 10, glyph: "🧭" },
  { lb: 6, title: "Business English", subtitle: "Wirtschaft und Recht auf Englisch erkunden", hours: 0, glyph: "🌍" },
];

export const SOURCES = [
  { id: "lp", label: "LehrplanPLUS · Wirtschaft und Recht 8 (II)", url: CURRICULUM_URL },
  { id: "gg", label: "Grundgesetz", url: "https://www.gesetze-im-internet.de/gg/BJNR000010949.html" },
  { id: "bgb", label: "Bürgerliches Gesetzbuch", url: "https://www.gesetze-im-internet.de/bgb/" },
  { id: "bverf", label: "Bayerische Verfassung", url: "https://www.gesetze-bayern.de/Content/Document/BayVerf" },
  { id: "bayeug", label: "Bayerisches Gesetz über das Erziehungs- und Unterrichtswesen", url: "https://www.gesetze-bayern.de/Content/Document/BayEUG" },
  { id: "rso", label: "Realschulordnung", url: "https://www.gesetze-bayern.de/Content/Document/BayRSO" },
  { id: "schlichtung", label: "Bayerisches Schlichtungsgesetz", url: "https://www.gesetze-bayern.de/Content/Document/BaySchlG" },
  { id: "zpo", label: "Zivilprozessordnung", url: "https://www.gesetze-im-internet.de/zpo/BJNR005330950.html" },
  { id: "urhg", label: "Urheberrechtsgesetz", url: "https://www.gesetze-im-internet.de/urhg/BJNR012730965.html" },
  { id: "bbig", label: "Berufsbildungsgesetz", url: "https://www.gesetze-im-internet.de/bbig_2005/" },
  { id: "jarbschg", label: "Jugendarbeitsschutzgesetz", url: "https://www.gesetze-im-internet.de/jarbschg/" },
  { id: "juschg", label: "Jugendschutzgesetz", url: "https://www.gesetze-im-internet.de/juschg/BJNR273000002.html" },
  { id: "jgg", label: "Jugendgerichtsgesetz", url: "https://www.gesetze-im-internet.de/jgg/BJNR007510953.html" },
  { id: "stgb", label: "Strafgesetzbuch", url: "https://www.gesetze-im-internet.de/stgb/" },
  { id: "sgb3", label: "SGB III · Arbeitsförderung", url: "https://www.gesetze-im-internet.de/sgb_3/" },
  { id: "pangv", label: "Preisangabenverordnung", url: "https://www.gesetze-im-internet.de/pangv_2022/" },
  { id: "ba", label: "Berufsberatung der Bundesagentur für Arbeit", url: "https://web.arbeitsagentur.de/bildung/noch-planlos/erfahrungsbericht-berufsberatung-wie-laeuft-das-ab" },
  { id: "berufenet", label: "BERUFENET", url: "https://web.arbeitsagentur.de/berufenet/" },
  { id: "eures", label: "EURES · Arbeiten in Europa", url: "https://eures.europa.eu/index_de" },
  { id: "destatis", label: "Statistisches Bundesamt · Außenhandel", url: "https://www.destatis.de/DE/Themen/Wirtschaft/Aussenhandel/_inhalt.html" },
  { id: "bpb", label: "Bundeszentrale für politische Bildung", url: "https://www.bpb.de/" },
  { id: "vz", label: "Verbraucherzentralen", url: "https://www.verbraucherzentrale.de/" },
  { id: "test", label: "Stiftung Warentest", url: "https://www.test.de/" },
  { id: "evz", label: "Europäisches Verbraucherzentrum Deutschland", url: "https://www.evz.de/" },
  { id: "fair", label: "Fairtrade Deutschland", url: "https://www.fairtrade-deutschland.de/" },
  { id: "bfdi", label: "Bundesbeauftragte für den Datenschutz und die Informationsfreiheit", url: "https://www.bfdi.bund.de/DE/Home/home_node.html" },
  { id: "uba", label: "Umweltbundesamt", url: "https://www.umweltbundesamt.de/" },
  { id: "siegelklarheit", label: "Siegelklarheit", url: "https://www.siegelklarheit.de/" },
  { id: "sperrnotruf", label: "Sperr-Notruf 116 116", url: "https://www.sperr-notruf.de/" },
  { id: "eu", label: "European Union · EU countries", url: "https://european-union.europa.eu/principles-countries-history/eu-countries_en" },
  { id: "uk", label: "GOV.UK · Online and distance selling", url: "https://www.gov.uk/online-and-distance-selling-for-businesses" },
  { id: "us-cooling-off", label: "U.S. Cooling-Off Rule · 16 CFR Part 429", url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-429" },
  { id: "uk-drive", label: "GOV.UK · Driving lessons and learning to drive", url: "https://www.gov.uk/driving-lessons-learning-to-drive" },
  { id: "ny-drive", label: "New York DMV · Learner permit", url: "https://dmv.ny.gov/new-york-state-drivers-manual-and-practice-tests/chapter-1-driver-licenses" },
  { id: "us-tobacco-sale", label: "United States Code · Minimum age for retail tobacco sales", url: "https://uscode.house.gov/us/usc/t21/s387f/" },
  { id: "uk-smoke", label: "UK legislation · Smoking in enclosed public places in England", url: "https://www.legislation.gov.uk/ukpga/2006/28/part/1/chapter/1" },
  { id: "ny-smoke", label: "New York State Department of Health · Clean Indoor Air Act", url: "https://www.health.ny.gov/prevention/tobacco_control/clean_indoor_air_act/" },
];
