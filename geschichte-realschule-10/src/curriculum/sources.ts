import type { Source, Stage, Term } from "../model/types";

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/geschichte";

const lemo = (path: string) => `https://www.hdg.de/lemo/kapitel/${path}.html`;

export const SOURCES: Source[] = [
  { id: "lehrplan", label: "ISB · LehrplanPLUS Geschichte 10 Realschule", url: CURRICULUM_URL },
  // Lebendiges Museum Online (Stiftung Haus der Geschichte und DHM)
  {
    id: "lemo-potsdam",
    label: "LeMO · Potsdamer Konferenz",
    url: lemo("nachkriegsjahre/befreiung-und-besatzung/potsdamer-konferenz"),
  },
  {
    id: "lemo-besatzung",
    label: "LeMO · Alliierte Besatzung",
    url: lemo("nachkriegsjahre/befreiung-und-besatzung/alliierte-besatzung"),
  },
  {
    id: "lemo-entnazifizierung",
    label: "LeMO · Entnazifizierung",
    url: lemo("nachkriegsjahre/entnazifizierung-und-antifaschismus/entnazifizierung"),
  },
  {
    id: "lemo-nuernberg",
    label: "LeMO · Nürnberger Prozesse",
    url: lemo("nachkriegsjahre/entnazifizierung-und-antifaschismus/nuernberger-prozesse"),
  },
  {
    id: "lemo-truemmer",
    label: "LeMO · Leben in Trümmern",
    url: lemo("nachkriegsjahre/alltag/leben-in-truemmern"),
  },
  {
    id: "lemo-ueberleben",
    label: "LeMO · Überlebensmittel",
    url: lemo("nachkriegsjahre/alltag/ueberlebensmittel"),
  },
  {
    id: "lemo-vertreibung",
    label: "LeMO · Flucht und Vertreibung",
    url: lemo("nachkriegsjahre/alltag/flucht-und-vertreibung"),
  },
  {
    id: "lemo-laender",
    label: "LeMO · Neugründung der Länder",
    url: lemo("nachkriegsjahre/neuanfaenge/laender"),
  },
  {
    id: "lemo-grundgesetz",
    label: "LeMO · Parlamentarischer Rat und Grundgesetz",
    url: lemo(
      "nachkriegsjahre/doppelte-staatsgruendung/entstehung-der-bundesrepublik-parlamentarischer-rat-und-grundgesetz",
    ),
  },
  {
    id: "lemo-ddr-gruendung",
    label: "LeMO · Verfassung der DDR und Führungsrolle der SED",
    url: lemo(
      "nachkriegsjahre/doppelte-staatsgruendung/entstehung-der-ddr-verfassung-und-fuehrungsrolle-der-sed",
    ),
  },
  {
    id: "lemo-blockade",
    label: "LeMO · Berlin-Blockade 1948",
    url: lemo("nachkriegsjahre/doppelte-staatsgruendung/berlin-blockade-1948"),
  },
  {
    id: "lemo-marshall",
    label: "LeMO · Marshall-Plan und Währungsreform",
    url: lemo("nachkriegsjahre/doppelte-staatsgruendung/marshall-plan-und-waehrungsreform"),
  },
  {
    id: "lemo-dp",
    label: "LeMO · Displaced Persons",
    url: lemo("nachkriegsjahre/befreiung-und-besatzung/displaced-persons"),
  },
  {
    id: "lemo-planwirtschaft",
    label: "LeMO · Sozialistische Zentralplanwirtschaft",
    url: lemo(
      "geteiltes-deutschland-gruenderjahre/wirtschaft-und-gesellschaft-im-osten/sozialistische-zentralplanwirtschaft",
    ),
  },
  {
    id: "lemo-mangel",
    label: "LeMO · Mangelwirtschaft in der DDR",
    url: lemo("geteiltes-deutschland-krisenmanagement/niedergang-der-ddr/mangelwirtschaft"),
  },
  {
    id: "lemo-17juni",
    label: "LeMO · 17. Juni 1953: Volksaufstand",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-osten/17-juni-1953-volksaufstand"),
  },
  {
    id: "lemo-mfs",
    label: "LeMO · Aufbau des Ministeriums für Staatssicherheit",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-osten/aufbau-des-mfs"),
  },
  {
    id: "lemo-opposition",
    label: "LeMO · Opposition und Bürgerbewegung in der DDR",
    url: lemo("geteiltes-deutschland-krisenmanagement/niedergang-der-ddr/opposition-und-buergerbewegung"),
  },
  {
    id: "lemo-mauerbau",
    label: "LeMO · Mauerbau",
    url: lemo("geteiltes-deutschland-gruenderjahre/mauerbau"),
  },
  {
    id: "lemo-flucht",
    label: "LeMO · Flucht und Notaufnahme",
    url: lemo("geteiltes-deutschland-gruenderjahre/mauerbau/flucht-und-notaufnahme"),
  },
  {
    id: "lemo-deutsche-frage",
    label: "LeMO · Die deutsche Frage",
    url: lemo("geteiltes-deutschland-gruenderjahre/deutsche-frage"),
  },
  {
    id: "lemo-westen",
    label: "LeMO · Weg nach Westen",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-westen"),
  },
  {
    id: "lemo-adenauer",
    label: "LeMO · Konrad Adenauer",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-westen/adenauer"),
  },
  {
    id: "lemo-vergangenheit",
    label: "LeMO · Vergangenheitsbewältigung",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-westen/vergangenheitsbewaeltigung"),
  },
  {
    id: "lemo-marktwirtschaft",
    label: "LeMO · Soziale Marktwirtschaft",
    url: lemo(
      "geteiltes-deutschland-gruenderjahre/wirtschaft-und-gesellschaft-im-westen/soziale-marktwirtschaft",
    ),
  },
  {
    id: "lemo-wirtschaftswunder",
    label: "LeMO · Wirtschaftswunder",
    url: lemo("geteiltes-deutschland-gruenderjahre/wirtschaft-und-gesellschaft-im-westen/wirtschaftswunder"),
  },
  {
    id: "lemo-gastarbeiter",
    label: "LeMO · Gastarbeiter",
    url: lemo("geteiltes-deutschland-modernisierung/bundesrepublik-im-wandel/gastarbeiter"),
  },
  {
    id: "lemo-apo",
    label: "LeMO · Studentenbewegung und APO",
    url: lemo("geteiltes-deutschland-modernisierung/bundesrepublik-im-wandel/studentenbewegung-und-apo"),
  },
  {
    id: "lemo-raf",
    label: "LeMO · Linksterrorismus: Rote Armee Fraktion",
    url: lemo("geteiltes-deutschland-krisenmanagement/linksterrorismus-rote-armee-fraktion"),
  },
  {
    id: "lemo-reformen",
    label: "LeMO · Sozialliberale Reformen",
    url: lemo("geteiltes-deutschland-modernisierung/bundesrepublik-im-wandel/sozialliberale-reformen"),
  },
  {
    id: "lemo-ostpolitik",
    label: "LeMO · Neue Ostpolitik",
    url: lemo("geteiltes-deutschland-modernisierung/neue-ostpolitik"),
  },
  {
    id: "lemo-grundlagenvertrag",
    label: "LeMO · Grundlagenvertrag",
    url: lemo("geteiltes-deutschland-modernisierung/neue-ostpolitik/grundlagenvertrag"),
  },
  {
    id: "lemo-kalter-krieg",
    label: "LeMO · Kalter Krieg",
    url: lemo("geteiltes-deutschland-gruenderjahre/kalter-krieg"),
  },
  {
    id: "lemo-allianzen",
    label: "LeMO · Militärallianzen",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-westen/militaerallianzen"),
  },
  {
    id: "lemo-warschau",
    label: "LeMO · Beitritt zum Warschauer Pakt",
    url: lemo("geteiltes-deutschland-gruenderjahre/weg-nach-osten/beitritt-zum-warschauer-pakt"),
  },
  {
    id: "lemo-kuba",
    label: "LeMO · Kuba-Krise",
    url: lemo("geteiltes-deutschland-gruenderjahre/kalter-krieg/kuba-krise"),
  },
  {
    id: "lemo-vietnam",
    label: "LeMO · Vietnam-Krieg",
    url: lemo("geteiltes-deutschland-modernisierung/internationale-entwicklungen/vietnam-krieg"),
  },
  {
    id: "lemo-ksze",
    label: "LeMO · KSZE",
    url: lemo("geteiltes-deutschland-krisenmanagement/konfrontation-und-annaeherung/ksze"),
  },
  {
    id: "lemo-wettruesten",
    label: "LeMO · Wettrüsten",
    url: lemo("geteiltes-deutschland-krisenmanagement/konfrontation-und-annaeherung/wettruesten"),
  },
  {
    id: "lemo-elysee",
    label: "LeMO · Deutsch-französische Aussöhnung",
    url: lemo("geteiltes-deutschland-modernisierung/bundesrepublik-im-wandel/deutsch-franzoesische-aussoehnung"),
  },
  {
    id: "lemo-glasnost",
    label: "LeMO · Glasnost und Perestroika",
    url: lemo("deutsche-einheit/wandel-im-osten/glasnost-und-perestroika"),
  },
  {
    id: "lemo-massenflucht",
    label: "LeMO · Massenflucht 1989",
    url: lemo("deutsche-einheit/wandel-im-osten/massenflucht"),
  },
  {
    id: "lemo-montagsdemo",
    label: "LeMO · Montagsdemonstrationen",
    url: lemo("deutsche-einheit/friedliche-revolution/montagsdemonstrationen"),
  },
  {
    id: "lemo-mauerfall",
    label: "LeMO · Fall der Mauer",
    url: lemo("deutsche-einheit/friedliche-revolution/fall-der-mauer"),
  },
  {
    id: "lemo-wwsu",
    label: "LeMO · Wirtschafts-, Währungs- und Sozialunion",
    url: lemo("deutsche-einheit/weg-zur-einheit/wirtschafts-waehrungs-und-sozialunion"),
  },
  {
    id: "lemo-einigungsvertrag",
    label: "LeMO · Einigungsvertrag",
    url: lemo("deutsche-einheit/weg-zur-einheit/einigungsvertrag"),
  },
  {
    id: "lemo-2plus4",
    label: "LeMO · Zwei-plus-Vier-Vertrag",
    url: lemo("deutsche-einheit/weg-zur-einheit/zwei-plus-vier-vertrag"),
  },
  {
    id: "lemo-treuhand",
    label: "LeMO · Treuhandanstalt",
    url: lemo("deutsche-einheit/baustelle-deutsche-einheit/treuhand"),
  },
  {
    id: "lemo-ost-west",
    label: "LeMO · Ost-West-Wahrnehmungen",
    url: lemo("deutsche-einheit/eine-nation-zwei-gesellschaften/ost-west-wahrnehmungen"),
  },
  {
    id: "lemo-aufarbeitung",
    label: "LeMO · Aufarbeitung der DDR-Vergangenheit",
    url: lemo("deutsche-einheit/aufarbeitung-des-sed-staates-und-rechtsextremismus/aufarbeitung-der-ddr-vergangenheit"),
  },
  {
    id: "lemo-auslandseinsaetze",
    label: "LeMO · Auslandseinsätze der Bundeswehr",
    url: lemo("globalisierung/debatten-und-reformen/auslandseinsaetze"),
  },
  {
    id: "lemo-kosovo",
    label: "LeMO · Kosovo-Krieg",
    url: lemo("deutsche-einheit/deutschland-in-europa-und-der-welt/kosovo-krieg"),
  },
  {
    id: "lemo-eu",
    label: "LeMO · Europäische Union",
    url: lemo("deutsche-einheit/deutschland-in-europa-und-der-welt/europaeische-union"),
  },
  {
    id: "lemo-eu-erweiterung",
    label: "LeMO · EU-Erweiterungen",
    url: lemo("deutsche-einheit/deutschland-in-europa-und-der-welt/eu-erweiterungen"),
  },
  {
    id: "lemo-911",
    label: "LeMO · 11. September 2001",
    url: lemo("globalisierung/internationale-herausforderungen/11-september-2001"),
  },
  {
    id: "lemo-afghanistan",
    label: "LeMO · Afghanistan-Einsatz",
    url: lemo("globalisierung/internationale-herausforderungen/afghanistan-einsatz"),
  },
  {
    id: "lemo-sicherheitsgesetze",
    label: "LeMO · Sicherheitsgesetze",
    url: lemo("globalisierung/debatten-und-reformen/sicherheitsgesetze"),
  },
  {
    id: "lemo-rechtsextremismus",
    label: "LeMO · Rechtspopulismus und Rechtsextremismus",
    url: lemo("globalisierung/internationale-herausforderungen/rechtspopulismus-und-rechtsextremismus"),
  },
  {
    id: "lemo-welthandel",
    label: "LeMO · Welthandel",
    url: lemo("deutsche-einheit/deutschland-in-europa-und-der-welt/welthandel"),
  },
  {
    id: "lemo-finanzkrise",
    label: "LeMO · Banken- und Wirtschaftskrise",
    url: lemo("globalisierung/internationale-herausforderungen/banken-und-wirtschaftskrise"),
  },
  {
    id: "lemo-einwanderungsland",
    label: "LeMO · Einwanderungsland Deutschland",
    url: lemo("deutsche-einheit/baustelle-deutsche-einheit/einwanderungsland-deutschland"),
  },
  {
    id: "lemo-zuwanderer",
    label: "LeMO · Zuwanderer und Geflüchtete",
    url: lemo("globalisierung/internationale-herausforderungen/zuwanderer-und-gefluechtete"),
  },
  { id: "lemo-ns", label: "LeMO · NS-Regime", url: "https://www.dhm.de/lemo/kapitel/ns-regime" },
  // Normtexte
  {
    id: "bayverf",
    label: "Bayerisches Staatsministerium der Justiz · Verfassung des Freistaates Bayern",
    url: "https://www.gesetze-bayern.de/Content/Document/BayVerf/true",
  },
  {
    id: "gg",
    label: "Bundesministerium der Justiz · Grundgesetz",
    url: "https://www.gesetze-im-internet.de/gg/",
  },
  {
    id: "gg-art23",
    label: "Bundesministerium der Justiz · Grundgesetz Artikel 23 (heutige Fassung)",
    url: "https://www.gesetze-im-internet.de/gg/art_23.html",
  },
  {
    id: "un-charta",
    label: "Regionales Informationszentrum der Vereinten Nationen · Charta der Vereinten Nationen",
    url: "https://unric.org/de/charta/",
  },
  // Bundeszentrale für politische Bildung und weitere Einrichtungen
  {
    id: "bpb-teilung",
    label: "Bundeszentrale für politische Bildung · Deutsche Teilung",
    url: "https://www.bpb.de/themen/deutsche-teilung/",
  },
  {
    id: "bpb-einheit",
    label: "Bundeszentrale für politische Bildung · Deutsche Einheit",
    url: "https://www.bpb.de/themen/deutsche-einheit/",
  },
  {
    id: "bpb-stasi",
    label: "Bundeszentrale für politische Bildung · Stasi",
    url: "https://www.bpb.de/themen/deutsche-teilung/stasi/",
  },
  {
    id: "stasi-archiv",
    label: "Bundesarchiv · Stasi-Unterlagen-Archiv",
    url: "https://www.stasi-unterlagen-archiv.de/stasi/",
  },
  {
    id: "mauer-stiftung",
    label: "Stiftung Berliner Mauer · Gedenkstätte Berliner Mauer",
    url: "https://www.stiftung-berliner-mauer.de/de/gedenkstaette-berliner-mauer",
  },
  {
    id: "bpb-raf",
    label: "Bundeszentrale für politische Bildung · Geschichte der RAF",
    url: "https://www.bpb.de/themen/linksextremismus/geschichte-der-raf/",
  },
  {
    id: "nobel-brandt",
    label: "Nobelpreis-Stiftung · Friedensnobelpreis 1971 für Willy Brandt",
    url: "https://www.nobelprize.org/prizes/peace/1971/brandt/facts/",
  },
  {
    id: "bpb-juedisch",
    label: "Bundeszentrale für politische Bildung · Jüdisches Leben",
    url: "https://www.bpb.de/themen/zeit-kulturgeschichte/juedisches-leben/",
  },
  {
    id: "zentralrat",
    label: "Zentralrat der Juden in Deutschland · Geschichte",
    url: "https://www.zentralratderjuden.de/geschichte/",
  },
  {
    id: "ghdi-vertriebene",
    label: "German History in Documents and Images · Vertriebene in Bayern (1949)",
    url: "https://germanhistorydocs.org/de/die-besatzungszeit-und-die-entstehung-zweier-staaten-1945-1961/ghdi:image-2576",
  },
  {
    id: "hdbg-zeitzeugen",
    label: "Haus der Bayerischen Geschichte · Zeitzeugen",
    url: "https://www.hdbg.de/zeitzeugen/",
  },
  {
    id: "zeitzeugen-portal",
    label: "Stiftung Haus der Geschichte · Zeitzeugenportal",
    url: "https://www.zeitzeugen-portal.de/",
  },
  {
    id: "kinofenster",
    label: "Bundeszentrale für politische Bildung · kinofenster.de (Filmbildung)",
    url: "https://www.kinofenster.de/",
  },
  {
    id: "domid",
    label: "DOMiD · Dokumentationszentrum und Museum über die Migration in Deutschland",
    url: "https://domid.org/",
  },
  {
    id: "dah",
    label: "Deutsches Auswandererhaus Bremerhaven",
    url: "https://dah-bremerhaven.de/",
  },
  {
    id: "hugenotten",
    label: "Deutsche Hugenotten-Gesellschaft",
    url: "https://www.hugenotten.de/",
  },
  {
    id: "bpb-migration",
    label: "Bundeszentrale für politische Bildung · Migration und Integration",
    url: "https://www.bpb.de/themen/migration-integration/",
  },
  {
    id: "unhcr",
    label: "UNHCR · Global Trends: Forced Displacement in 2024",
    url: "https://www.unhcr.org/publications/global-trends-2024",
  },
  {
    id: "eu-geschichte",
    label: "Europäische Union · Geschichte der EU",
    url: "https://european-union.europa.eu/principles-countries-history/history-eu_de",
  },
  {
    id: "bpb-europa",
    label: "Bundeszentrale für politische Bildung · Europa",
    url: "https://www.bpb.de/themen/europa/",
  },
  {
    id: "bpb-algerien",
    label: "Bundeszentrale für politische Bildung · Vor 60 Jahren: Ende des Algerienkrieges",
    url: "https://www.bpb.de/kurz-knapp/taegliche-dosis-politik/506322/vor-60-jahren-ende-des-algerienkrieges/",
  },
  {
    id: "bpb-china",
    label: "Bundeszentrale für politische Bildung · China",
    url: "https://www.bpb.de/themen/asien/china/",
  },
  {
    id: "bpb-russland",
    label: "Bundeszentrale für politische Bildung · Russland",
    url: "https://www.bpb.de/themen/europa/russland/",
  },
  {
    id: "bpb-ukraine",
    label: "Bundeszentrale für politische Bildung · Krieg in der Ukraine",
    url: "https://www.bpb.de/themen/europa/krieg-in-der-ukraine/",
  },
  {
    id: "bpb-kriege",
    label: "Bundeszentrale für politische Bildung · Dossier Innerstaatliche Konflikte",
    url: "https://www.bpb.de/themen/kriege-konflikte/dossier-kriege-konflikte/",
  },
  {
    id: "bpb-israel",
    label: "Bundeszentrale für politische Bildung · Israel",
    url: "https://www.bpb.de/themen/naher-mittlerer-osten/israel/",
  },
  {
    id: "un-peacekeeping",
    label: "United Nations · Peacekeeping",
    url: "https://www.un.org/en/peacekeeping",
  },
  {
    id: "icty",
    label: "Internationaler Strafgerichtshof für das ehemalige Jugoslawien · About",
    url: "https://www.icty.org/en/about",
  },
  {
    id: "bpb-erinnerung",
    label: "Bundeszentrale für politische Bildung · Geschichte und Erinnerung",
    url: "https://www.bpb.de/themen/zeit-kulturgeschichte/geschichte-und-erinnerung/",
  },
  {
    id: "walhalla",
    label: "Bayerische Schlösserverwaltung · Walhalla",
    url: "https://www.walhalla-regensburg.de/",
  },
  {
    id: "unesco",
    label: "Deutsche UNESCO-Kommission · Welterbe in Deutschland",
    url: "https://www.unesco.de/kultur-und-natur/welterbe/welterbe-deutschland",
  },
  // English deepening
  {
    id: "us-kennan",
    label: "U.S. Office of the Historian · Kennan and Containment",
    url: "https://history.state.gov/milestones/1945-1952/kennan",
  },
  {
    id: "us-truman",
    label: "U.S. Office of the Historian · The Truman Doctrine",
    url: "https://history.state.gov/milestones/1945-1952/truman-doctrine",
  },
  {
    id: "us-marshall",
    label: "U.S. Office of the Historian · Marshall Plan",
    url: "https://history.state.gov/milestones/1945-1952/marshall-plan",
  },
  {
    id: "us-airlift",
    label: "U.S. Office of the Historian · The Berlin Airlift",
    url: "https://history.state.gov/milestones/1945-1952/berlin-airlift",
  },
  {
    id: "us-cuba",
    label: "U.S. Office of the Historian · The Cuban Missile Crisis",
    url: "https://history.state.gov/milestones/1961-1968/cuban-missile-crisis",
  },
  {
    id: "us-vietnam",
    label: "U.S. Office of the Historian · Ending the Vietnam War",
    url: "https://history.state.gov/milestones/1969-1976/ending-vietnam",
  },
  {
    id: "nasa-apollo",
    label: "NASA · Apollo 11 Mission Overview",
    url: "https://www.nasa.gov/history/apollo-11-mission-overview/",
  },
  {
    id: "partition-archive",
    label: "1947 Partition Archive · Oral histories of Partition",
    url: "https://www.1947partitionarchive.org/",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    shortTitle: "Geschichte untersuchen",
    title: "Methoden und Arbeitstechniken",
    icon: "🔎",
    hue: 205,
  },
  {
    lb: 2,
    shortTitle: "Neubeginn nach 1945",
    title: "Nachkriegszeit und politischer Neubeginn in Deutschland",
    icon: "🧱",
    hue: 32,
    hours: 7,
  },
  {
    lb: 3,
    shortTitle: "Zwei deutsche Staaten",
    title: "Die Teilung Deutschlands",
    icon: "🚧",
    hue: 355,
    hours: 9,
  },
  {
    lb: 4,
    shortTitle: "Kalter Krieg & Einheit",
    title: "Kalter Krieg, Entspannung und Neuorientierung in Europa und der Welt",
    icon: "🌐",
    hue: 240,
    hours: 11,
  },
  {
    lb: 5,
    shortTitle: "Welt der Gegenwart",
    title: "Herausforderungen und Chancen globaler Entwicklungen der Gegenwart",
    icon: "🧭",
    hue: 178,
    hours: 11,
  },
  {
    lb: 6,
    shortTitle: "Migration",
    title: "Migration in der Geschichte (Längsschnitt)",
    icon: "🧳",
    hue: 128,
    hours: 5,
  },
  {
    lb: 7,
    shortTitle: "Geschichtskultur",
    title: "Geschichtskultur – wie wir mit Geschichte umgehen (Längsschnitt)",
    icon: "🏛️",
    hue: 290,
    hours: 5,
  },
  {
    lb: 8,
    shortTitle: "History in English",
    title: "Bilingualer Sachfachunterricht (optional)",
    icon: "💬",
    hue: 15,
    optional: true,
  },
];

/**
 * The Grundlegende Daten und Begriffe the plan names for LB 2 to 7, each with
 * the lesson that teaches it. LB 6 and 7 repeat terms from earlier grades.
 */
export const TERMS: Term[] = [
  {
    lb: 2,
    term: "Konferenz von Potsdam",
    explanation:
      "Juli/August 1945: USA, Sowjetunion und Großbritannien legen Besatzung, Entnazifizierung, Entmilitarisierung, Demokratisierung und Dezentralisierung fest.",
    lessonId: "g10-potsdam",
  },
  {
    lb: 2,
    term: "Entnazifizierung",
    explanation:
      "Maßnahmen der Siegermächte, NS-Organisationen aufzulösen und Belastete aus Ämtern zu entfernen, zu bestrafen oder einzustufen.",
    lessonId: "g10-potsdam",
  },
  {
    lb: 2,
    term: "Flucht und Vertreibung",
    explanation:
      "Etwa zwölf Millionen Deutsche flohen ab 1944/45 oder wurden aus Ost-, Mittel- und Südosteuropa vertrieben; rund 1,9 Millionen lebten 1949 in Bayern.",
    lessonId: "g10-flucht-vertreibung",
  },
  {
    lb: 2,
    term: "1946 Verfassung des Freistaats Bayern",
    explanation:
      "Am 1. Dezember 1946 per Volksentscheid angenommen; sie ist älter als das Grundgesetz und gilt bis heute.",
    lessonId: "g10-verfassung-bayern",
  },
  {
    lb: 2,
    term: "Grundgesetz",
    explanation:
      "Verfassung der Bundesrepublik, vom Parlamentarischen Rat erarbeitet und am 23. Mai 1949 verkündet; seit 1990 Verfassung des vereinten Deutschland.",
    lessonId: "g10-zwei-staaten",
  },
  {
    lb: 2,
    term: "1949 Gründung der beiden deutschen Staaten",
    explanation:
      "23. Mai 1949 Bundesrepublik Deutschland (Grundgesetz), 7. Oktober 1949 Deutsche Demokratische Republik.",
    lessonId: "g10-zwei-staaten",
  },
  {
    lb: 3,
    term: "Planwirtschaft",
    explanation:
      "Der Staat legt in Plänen fest, was produziert wird und was es kostet; in der DDR unter Führung der SED.",
    lessonId: "g10-sed-diktatur",
  },
  {
    lb: 3,
    term: "17. Juni 1953 Aufstand gegen das DDR-Regime",
    explanation:
      "Streiks und Demonstrationen in über 700 Orten der DDR, von sowjetischen Truppen niedergeschlagen.",
    lessonId: "g10-17-juni-1953",
  },
  {
    lb: 3,
    term: "„Staatssicherheit“",
    explanation:
      "Ministerium für Staatssicherheit (MfS, „Stasi“): Geheimpolizei und Nachrichtendienst der SED, „Schild und Schwert der Partei“.",
    lessonId: "g10-stasi",
  },
  {
    lb: 3,
    term: "Mauerbau",
    explanation:
      "Ab 13. August 1961 riegelt die DDR West-Berlin ab; die Mauer stoppt die Fluchtbewegung über Berlin.",
    lessonId: "g10-mauerbau",
  },
  {
    lb: 3,
    term: "Adenauer",
    explanation:
      "Konrad Adenauer (CDU), erster Bundeskanzler 1949–1963, steht für Westintegration und Aussöhnung mit Frankreich.",
    lessonId: "g10-aera-adenauer",
  },
  {
    lb: 3,
    term: "Westintegration",
    explanation:
      "Einbindung der Bundesrepublik in westliche Bündnisse und Gemeinschaften, etwa NATO 1955 und EWG 1957.",
    lessonId: "g10-aera-adenauer",
  },
  {
    lb: 3,
    term: "Soziale Marktwirtschaft",
    explanation:
      "Wirtschaftsordnung der Bundesrepublik: freier Wettbewerb mit sozialem Ausgleich; verbunden mit Ludwig Erhard.",
    lessonId: "g10-aera-adenauer",
  },
  {
    lb: 3,
    term: "„Gastarbeiter“",
    explanation:
      "Zeitgenössischer Begriff für angeworbene Arbeitskräfte, ab 1955 durch Anwerbeabkommen; Anwerbestopp 1973.",
    lessonId: "g10-gastarbeiter",
  },
  {
    lb: 3,
    term: "1968er-Bewegung",
    explanation:
      "Protestbewegung vor allem von Studierenden gegen Vietnamkrieg, Notstandsgesetze und verschwiegene NS-Vergangenheit.",
    lessonId: "g10-1968",
  },
  {
    lb: 3,
    term: "Reformen der sozial-liberalen Koalition",
    explanation:
      "SPD-FDP-Regierungen ab 1969: u. a. Wahlalter 18, BAföG, Reform von Ehe- und Familienrecht, Neue Ostpolitik.",
    lessonId: "g10-sozialliberale-reformen",
  },
  {
    lb: 3,
    term: "deutsche Frage",
    explanation:
      "Die offene Frage nach Einheit, Grenzen und Status Deutschlands zwischen 1945 und 1990.",
    lessonId: "g10-deutsche-frage",
  },
  {
    lb: 3,
    term: "1972 Grundlagenvertrag",
    explanation:
      "Vertrag zwischen Bundesrepublik und DDR: gutnachbarliche Beziehungen und Ständige Vertretungen, ohne die DDR als Ausland anzuerkennen.",
    lessonId: "g10-deutsche-frage",
  },
  {
    lb: 4,
    term: "Kalter Krieg",
    explanation:
      "Konflikt zwischen den von USA und Sowjetunion geführten Blöcken ab etwa 1947 bis 1990/91, ohne direkten Krieg der Supermächte.",
    lessonId: "g10-blockbildung",
  },
  {
    lb: 4,
    term: "NATO",
    explanation:
      "Westliches Verteidigungsbündnis seit 1949; die Bundesrepublik trat 1955 bei.",
    lessonId: "g10-blockbildung",
  },
  {
    lb: 4,
    term: "1961/62 Kuba-Krise",
    explanation:
      "Oktober 1962: sowjetische Raketen auf Kuba bringen die Welt an den Rand eines Atomkriegs; 1961 war der Invasionsversuch in der Schweinebucht gescheitert.",
    lessonId: "g10-kuba-krise",
  },
  {
    lb: 4,
    term: "Entkolonialisierung",
    explanation:
      "Prozess, in dem Kolonien vor allem zwischen 1945 und 1975 unabhängige Staaten wurden, friedlich oder durch Krieg.",
    lessonId: "g10-entkolonialisierung",
  },
  {
    lb: 4,
    term: "1963 deutsch-französischer Freundschaftsvertrag",
    explanation:
      "Élysée-Vertrag vom 22. Januar 1963 zwischen Adenauer und de Gaulle: regelmäßige Konsultationen und Jugendaustausch.",
    lessonId: "g10-europa",
  },
  {
    lb: 4,
    term: "ab 1989/90 Umbruch im Ostblock",
    explanation:
      "Reformen in der Sowjetunion und friedliche Revolutionen beenden die kommunistischen Diktaturen in Mittel- und Osteuropa.",
    lessonId: "g10-umbruch-ostblock",
  },
  {
    lb: 4,
    term: "9. November 1989 Öffnung der innerdeutschen Grenze",
    explanation:
      "Nach Massenprotesten und Fluchtwelle öffnet die DDR in der Nacht die Grenzübergänge in Berlin; der „Mauerfall“.",
    lessonId: "g10-friedliche-revolution",
  },
  {
    lb: 4,
    term: "3. Oktober 1990 „Tag der Deutschen Einheit“",
    explanation:
      "Die DDR tritt der Bundesrepublik bei; seither Nationalfeiertag.",
    lessonId: "g10-weg-zur-einheit",
  },
  {
    lb: 4,
    term: "Europäische Integration",
    explanation:
      "Schrittweiser Zusammenschluss europäischer Staaten, von der Montanunion 1951 über die EWG 1957 bis zur Europäischen Union.",
    lessonId: "g10-europa",
  },
  {
    lb: 4,
    term: "1992 Vertrag von Maastricht",
    explanation:
      "Gründungsvertrag der Europäischen Union, unterzeichnet am 7. Februar 1992; legt die Währungsunion fest.",
    lessonId: "g10-europa",
  },
  {
    lb: 4,
    term: "Ost-Erweiterung der EU",
    explanation:
      "2004 treten zehn Staaten bei, darunter acht aus Mittel- und Osteuropa; 2007 folgen Bulgarien und Rumänien.",
    lessonId: "g10-europa",
  },
  {
    lb: 5,
    term: "UNO",
    explanation:
      "Vereinte Nationen, 1945 gegründet zur Sicherung des Weltfriedens; Sicherheitsrat mit fünf ständigen Mitgliedern mit Vetorecht.",
    lessonId: "g10-uno",
  },
  {
    lb: 5,
    term: "Globalisierung",
    explanation:
      "Zunehmende weltweite Verflechtung von Wirtschaft, Kommunikation, Politik und Kultur.",
    lessonId: "g10-globalisierung",
  },
  {
    lb: 5,
    term: "Nahostkonflikt",
    explanation:
      "Konflikt um Land, Staatlichkeit und Sicherheit zwischen Israel und Palästinensern sowie arabischen Staaten, seit der Staatsgründung Israels 1948 mit Kriegen und Friedensversuchen.",
    lessonId: "g10-nahost-wurzeln",
  },
  {
    lb: 5,
    term: "11. September 2001 Anschlag auf das World Trade Center in New York",
    explanation:
      "Terroristen der al-Qaida entführen vier Flugzeuge; fast 3000 Menschen sterben. Die USA beginnen den „Krieg gegen den Terror“.",
    lessonId: "g10-terror-9-11",
  },
  {
    lb: 5,
    term: "Terrorismus",
    explanation:
      "Gewalt gegen Menschen und Sachen, die durch Schrecken politische Ziele durchsetzen will.",
    lessonId: "g10-terror-9-11",
  },
  {
    lb: 6,
    term: "Migration",
    explanation:
      "Dauerhafte Verlegung des Lebensmittelpunkts über eine Grenze, freiwillig oder erzwungen.",
    lessonId: "g10-migration-epochen",
  },
  {
    lb: 6,
    term: "Stadtrecht",
    explanation:
      "Wiederholung aus Klasse 7: Rechte einer mittelalterlichen Stadt; Siedler im Osten erhielten oft deutsches Stadtrecht.",
    lessonId: "g10-auswanderung",
  },
  {
    lb: 6,
    term: "Soziale Frage",
    explanation:
      "Wiederholung aus Klasse 8: Not der Arbeiterschaft in der Industrialisierung, ein Motiv vieler Auswanderer.",
    lessonId: "g10-auswanderung",
  },
  {
    lb: 6,
    term: "Absolutismus",
    explanation:
      "Wiederholung aus Klasse 7: Herrschaft eines Fürsten ohne Mitwirkung von Ständen; Brandenburg holte 1685 Hugenotten ins Land.",
    lessonId: "g10-einwanderung",
  },
  {
    lb: 6,
    term: "Judentum",
    explanation:
      "Wiederholung aus Klasse 6 und 7: Jüdische Gemeinden erlebten seit dem Mittelalter Ansiedlung, Vertreibung und Auswanderung.",
    lessonId: "g10-migration-epochen",
  },
  {
    lb: 7,
    term: "9. November 1938 Novemberpogrome",
    explanation:
      "Wiederholung aus Klasse 9: organisierte Gewalt gegen Jüdinnen und Juden; heute ein zentraler Gedenktag.",
    lessonId: "g10-gedenkkultur",
  },
  {
    lb: 7,
    term: "Demokratie und Diktatur",
    explanation:
      "Diktaturen nutzen Geschichte zur Rechtfertigung ihrer Herrschaft; in Demokratien wird Geschichte öffentlich gestritten.",
    lessonId: "g10-instrumentalisierung",
  },
];
