import type { Source, Stage } from "../model/types";

export const EDITORIAL_DATE = "2026-10-20";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/geographie";
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "ISB · LehrplanPLUS Geographie 9 Realschule", url: CURRICULUM_URL },
  {
    id: "lfu",
    label: "LfU Bayern · Geologie Bayerns",
    url: "https://www.lfu.bayern.de/geologie/geologie_bayerns/index.htm",
  },
  {
    id: "lfu-eis",
    label: "LfU Bayern · Hydrogeologischer Großraum Alpenvorland",
    url: "https://www.lfu.bayern.de/geologie/hydrogeologie_karten_daten/hydrogeologische_raumgliederung/grossraum/doc/grossraum_alpenvorland.pdf",
  },
  {
    id: "usgs",
    label: "USGS · This Dynamic Earth: Understanding plate motions",
    url: "https://pubs.usgs.gov/gip/dynamic/understanding.html",
  },
  {
    id: "naturalearth",
    label: "Natural Earth · vereinfachte Länderumrisse 1:110 Mio., Public Domain",
    url: "https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/",
  },
  {
    id: "boden",
    label: "Umweltbundesamt · Wie Landwirtschaft Boden und Bodenleben schützen kann",
    url: "https://www.umweltbundesamt.de/umweltatlas/umwelt-landwirtschaft/wirtschaftliches-handeln/ressourcenschutz/wie-kann-die-landwirtschaft-den-boden-das",
  },
  {
    id: "dwd2024",
    label: "DWD · Klimastatusbericht 2024 (historischer Jahreswert)",
    url: "https://www.dwd.de/DE/leistungen/klimastatusbericht/publikationen/ksb_2024.pdf?__blob=publicationFile&v=5",
  },
  {
    id: "dwd-klima",
    label: "DWD · Klima und Wetter: Klimareport Deutschland",
    url: "https://www.dwd.de/DE/leistungen/klimareports/download_report_auflage-4.pdf?__blob=publicationFile&v=2",
  },
  {
    id: "dwd-lagen",
    label: "DWD · Großwetterlagen und Wetterregime",
    url: "https://www.dwd.de/DE/wetter/thema_des_tages/2021/5/12.html",
  },
  {
    id: "ipcc-greenhouse",
    label: "IPCC · What is the greenhouse effect?",
    url: "https://www.ipcc.ch/site/assets/uploads/2018/03/ar4-wg1-chapter1.pdf",
  },
  {
    id: "ipcc-ar6",
    label: "IPCC · Sechster Sachstandsbericht, Synthese 2023",
    url: "https://www.ipcc.ch/report/ar6/syr/",
  },
  {
    id: "hochwasser",
    label: "Umweltbundesamt · Fragen und Antworten zum Hochwasser",
    url: "https://www.umweltbundesamt.de/themen/fragen-antworten-thema-hochwasser",
  },
  {
    id: "bbk",
    label: "Bundesamt für Bevölkerungsschutz · Warnung in Deutschland",
    url: "https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warnung-in-Deutschland/warnung-in-deutschland_node.html",
  },
  {
    id: "uba-klima",
    label: "Umweltbundesamt · Klimaschutz und Energiepolitik",
    url: "https://www.umweltbundesamt.de/themen/klima-energie/klimaschutz-energiepolitik-in-deutschland",
  },
  {
    id: "uba-ozon",
    label: "Umweltbundesamt · Ozonbelastung und bodennahe Bildung",
    url: "https://www.umweltbundesamt.de/daten/umweltzustand-trends/luft/ozon-belastung",
  },
  {
    id: "wmo-ozon",
    label: "WMO · The Ozone Layer",
    url: "https://public.wmo.int/themes/ozone-layer",
  },
  {
    id: "uba-landwirtschaft",
    label: "Umweltbundesamt · Landwirtschaft umweltfreundlich gestalten",
    url: "https://www.umweltbundesamt.de/themen/landwirtschaft/landwirtschaft-umweltfreundlich-gestalten",
  },
  {
    id: "uba-bio",
    label: "Umweltbundesamt · Ökolandbau",
    url: "https://www.umweltbundesamt.de/themen/landwirtschaft/landwirtschaft-umweltfreundlich-gestalten/oekolandbau",
  },
  {
    id: "uba-ernaehrung",
    label: "Umweltbundesamt · Ernährung und Umwelt",
    url: "https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/essen-trinken",
  },
  {
    id: "eu-gap",
    label: "EU-Kommission · Die Gemeinsame Agrarpolitik im Überblick",
    url: "https://agriculture.ec.europa.eu/common-agricultural-policy/cap-overview/cap-glance_de",
  },
  {
    id: "fao-sustain",
    label: "FAO · Sustainability in food and agriculture",
    url: "https://www.fao.org/sustainability",
  },
  {
    id: "fao-foodsecurity",
    label: "FAO · An Introduction to the Basic Concepts of Food Security",
    url: "https://www.fao.org/docrep/013/al936e/al936e00.pdf",
  },
  {
    id: "wfp-hunger",
    label: "World Food Programme · Ending hunger",
    url: "https://www.wfp.org/ending-hunger",
  },
  {
    id: "fao-hydroponik",
    label: "FAO · Hydroponics fundamentals, pros and cons (2024)",
    url: "https://www.fao.org/plant-production-protection/news-and-events/news/news-detail/growing-without-soil--hydroponics-fundamentals--pros-and-cons/",
  },
  {
    id: "fao-grenada",
    label: "FAO · Hydroponik-Fallbeispiel Grenada (2026)",
    url: "https://www.fao.org/newsroom/story/no-soil-no-problem/en",
  },
  {
    id: "inkar",
    label: "BBSR · INKAR: regionalstatistische Daten und Karten",
    url: "https://www.bbsr.bund.de/BBSR/DE/forschung/raumbeobachtung/aktuelles/inkar/inkar.html",
  },
  {
    id: "un-cities",
    label: "UN-Habitat · World Cities Report 2024",
    url: "https://unhabitat.org/wcr/",
  },
  {
    id: "muenchen-step",
    label: "Stadt München · Stadtentwicklungsplan (Ziele und Karten)",
    url: "https://stadt.muenchen.de/infos/stadtentwicklungsplan-2040.html",
  },
  {
    id: "muenchen-region",
    label: "Stadt München · Kompakt, urban, grün (historische Stadt-Umland-Entwicklung)",
    url: "https://stadt.muenchen.de/dam/jcr%3Af3659a62-22a3-4e04-a15a-b2cd44a8decf/Muenchen_kompakt_urban_gruen_kl.pdf",
  },
  {
    id: "muenchen-wohnen",
    label: "Stadt München · Wohnungsmarktbeobachtung und Verdrängungsstudie",
    url: "https://stadt.muenchen.de/infos/wohnungsmarktbeobachtung-muenchen.html",
  },
  {
    id: "paris",
    label: "Stadt Paris · Plan local d’urbanisme, räumliche Funktionen",
    url: "https://cdn.paris.fr/paris/2020/02/26/8c69e1ba1ff36ecf904c337617eb1868.pdf",
  },
  {
    id: "mumbai",
    label: "UN-Habitat · The State of Asian and Pacific Cities 2015 (historisches Fallbeispiel)",
    url: "https://unhabitat.org/sites/default/files/download-manager-files/TheStateOfAsianAndPacificCities2015.pdf",
  },
  {
    id: "un-planning",
    label: "UN-Habitat · Urban Planning for City Leaders",
    url: "https://unhabitat.org/sites/default/files/download-manager-files/Urban%20Planning%20for%20City%20Leaders.pdf",
  },
  {
    id: "destatis",
    label: "Destatis · Bevölkerungsentwicklung, 16. Vorausberechnung 2025–2070",
    url: "https://www.destatis.de/DE/Themen/Querschnitt/Demografischer-Wandel/Aspekte/demografie-bevoelkerungsentwicklung.html",
  },
  {
    id: "bayern-projektion",
    label: "Statistik Bayern · Regionalisierte Bevölkerungsvorausberechnung (2026)",
    url: "https://www.statistik.bayern.de/presse/mitteilungen/2026/pm101/index.html",
  },
  {
    id: "un-population",
    label: "UN DESA · World Population Prospects",
    url: "https://population.un.org/wpp/",
  },
  {
    id: "destatis-migration",
    label: "Destatis · Wanderungen",
    url: "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Wanderungen/_inhalt.html",
  },
  {
    id: "iom",
    label: "IOM · Glossary on Migration (2019)",
    url: "https://publications.iom.int/books/international-migration-law-ndeg34-glossary-migration",
  },
  {
    id: "unhcr",
    label: "UNHCR · Refugees and migrants: definitions",
    url: "https://www.unhcr.org/about-unhcr/who-we-protect/refugees",
  },
  {
    id: "japan",
    label: "Cabinet Office Japan · Annual Report on the Ageing Society 2025 (English)",
    url: "https://www8.cao.go.jp/kourei/english/annualreport/2025/pdf/2025.pdf",
  },
  {
    id: "familie",
    label: "Familienportal des Bundes · Familie und Beruf",
    url: "https://familienportal.de/familienportal/lebenslagen/ausbildung-beruf/vereinbarkeit-familie-und-beruf",
  },
  {
    id: "eu-members",
    label: "Europäische Union · Länderprofile und 27 Mitgliedstaaten",
    url: "https://european-union.europa.eu/principles-countries-history/eu-countries_de",
  },
  {
    id: "eu-enlargement",
    label: "Rat der EU · EU enlargement (Statusprüfung 20. Oktober 2026)",
    url: "https://www.consilium.europa.eu/en/topics/eu-enlargement/",
  },
  {
    id: "eu-history",
    label: "Europäische Union · Erweiterung und historische Beitritte",
    url: "https://european-union.europa.eu/principles-countries-history/eu-enlargement_en",
  },
  {
    id: "eu-schengen",
    label: "Rat der EU · Schengen area",
    url: "https://www.consilium.europa.eu/en/policies/schengen-area/",
  },
  {
    id: "airbus",
    label: "Airbus · Standorte in Deutschland (Unternehmensperspektive)",
    url: "https://www.airbus.com/en/careers/life-at-airbus/working-here/working-at-airbus-in-germany",
  },
  {
    id: "footprint",
    label: "Global Footprint Network · Ecological Footprint: Methode und Grenzen",
    url: "https://www.footprintnetwork.org/our-work/ecological-footprint/",
  },
  {
    id: "einheit",
    label: "DHM · Deutsche Einheit 1990",
    url: "https://www.dhm.de/archiv/ausstellungen/wiedervereinigung/beitrittsbeschluss_und_einigungsvertrag.html",
  },
  {
    id: "kaschmir",
    label: "UN · Historischer Hintergrund Indien/Pakistan und Kaschmir",
    url: "https://police.un.org/sites/default/files/past/unipombackgr.html",
  },
  {
    id: "partition",
    label: "UK National Archives · Indian Independence: Quellen von 1947",
    url: "https://www.nationalarchives.gov.uk/education/teaching-resources/indian-independence-part-one/",
  },
  {
    id: "bayern-atlas",
    label: "Bayerische Vermessungsverwaltung · BayernAtlas",
    url: "https://geoportal.bayern.de/bayernatlas/",
  },
  {
    id: "noaa-circulation",
    label: "NOAA · Global atmospheric circulations",
    url: "https://www.noaa.gov/jetstream/global/global-atmospheric-circulations",
  },
  {
    id: "fao-soils",
    label: "FAO · Status of the World's Soil Resources (2015)",
    url: "https://www.fao.org/fileadmin/user_upload/newsroom/docs/FAO-world_soils-report-COMPLETE.pdf",
  },
  {
    id: "unccd",
    label: "UNCCD · Article 1: Desertification and land degradation",
    url: "https://www.unccd.int/article-1-use-terms",
  },
  {
    id: "fao-salinity",
    label: "FAO · Salty soils: salinization, irrigation and drainage",
    url: "https://www.fao.org/4/r4082e/r4082e08.htm",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Landschaft und Naturrisiken",
    shortTitle: "Landschaft & Naturrisiken",
    icon: "⛰️",
    hours: 9,
  },
  {
    lb: 2,
    title: "Klima und Klimawandel",
    shortTitle: "Klima & Klimawandel",
    icon: "☀️",
    hours: 10,
  },
  {
    lb: 3,
    title: "Landwirtschaft, Ernährung und Boden",
    shortTitle: "Landwirtschaft & Ernährung",
    icon: "🌱",
    hours: 10,
  },
  {
    lb: 4,
    title: "Städtische Siedlungs- und Lebensräume",
    shortTitle: "Stadt & Lebensräume",
    icon: "🏙️",
    hours: 8,
  },
  {
    lb: 5,
    title: "Bevölkerung und Bevölkerungspolitik",
    shortTitle: "Bevölkerung & Wandel",
    icon: "👥",
    hours: 10,
  },
  {
    lb: 6,
    title: "Grenzen im Wandel",
    shortTitle: "Grenzen & Verflechtungen",
    icon: "🌍",
    hours: 5,
  },
  {
    lb: 7,
    title: "Aktuelle geographische Fragestellung im Nahraum",
    shortTitle: "Dein Nahraumprojekt",
    icon: "📍",
    hours: 4,
  },
  {
    lb: 8,
    title: "Bilingualer Sachfachunterricht (optional)",
    shortTitle: "Geography in English",
    icon: "💬",
    optional: true,
  },
  {
    lb: 9,
    title: "Grundlagen auffrischen (ergänzend, kein Lehrplan-Lernbereich)",
    shortTitle: "Grundlagen auffrischen",
    icon: "🧭",
    optional: true,
  },
];
