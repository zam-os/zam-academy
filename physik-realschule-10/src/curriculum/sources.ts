import type { Source, Stage } from "../model/types";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/physik/wpfg1";
export const SOURCES: Source[] = [
  {
    id: "lp-i",
    label: "LehrplanPLUS Physik 10 · Zweig I",
    url: CURRICULUM_URL,
  },
  {
    id: "lp-ii",
    label: "LehrplanPLUS Physik 10 · Zweig II/III",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/physik/wpfg2-3",
  },
  {
    id: "mechanics",
    label: "OpenStax · Bewegung und Beschleunigung",
    url: "https://openstax.org/books/college-physics-2e/pages/2-5-motion-equations-for-constant-acceleration-in-one-dimension",
  },
  {
    id: "momentum",
    label: "OpenStax · Impuls und Stöße",
    url: "https://openstax.org/books/college-physics-2e/pages/8-3-conservation-of-momentum",
  },
  {
    id: "circuits",
    label: "OpenStax · Reihen- und Parallelschaltungen",
    url: "https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel",
  },
  {
    id: "induction",
    label: "OpenStax · Induktion und Lenz",
    url: "https://openstax.org/books/college-physics-2e/pages/23-2-faradays-law-of-induction-lenzs-law",
  },
  {
    id: "transformer",
    label: "OpenStax · Transformatoren und Fernübertragung",
    url: "https://openstax.org/books/college-physics-2e/pages/23-7-transformers",
  },
  {
    id: "nuclear",
    label: "OpenStax · Kernumwandlungen und Erhaltungssätze",
    url: "https://openstax.org/books/college-physics-2e/pages/31-4-nuclear-decay-and-conservation-laws",
  },
  {
    id: "decay",
    label: "OpenStax · Halbwertszeit und Aktivität",
    url: "https://openstax.org/books/college-physics-2e/pages/31-5-half-life-and-activity",
  },
  {
    id: "quarks",
    label: "CERN · Standardmodell der Teilchenphysik",
    url: "https://home.cern/science/physics/standard-model/",
  },
  {
    id: "bfs",
    label: "Bundesamt für Strahlenschutz · Grundlagenbericht",
    url: "https://doris.bfs.de/jspui/bitstream/urn%3Anbn%3Ade%3A0221-2023032136841/1/BMUV-Grundlagenbericht.pdf",
  },
  {
    id: "plants",
    label: "Umweltbundesamt · Kraftwerke und Energieträger",
    url: "https://www.umweltbundesamt.de/daten/umweltzustand-trends/energie/kraftwerke-konventionelle-erneuerbare",
  },
  {
    id: "kwk",
    label: "Umweltbundesamt · Kraft-Wärme-Kopplung",
    url: "https://www.umweltbundesamt.de/themen/klima-energie/energieversorgung/kraft-waerme-kopplung-kwk-im-energiesystem",
  },
];
export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Bewegungen messen und erklären",
    shortTitle: "Mechanik",
    icon: "↗",
  },
  {
    lb: 2,
    title: "Stromkreise, Induktion und Energieübertragung",
    shortTitle: "Elektrizitätslehre",
    icon: "∿",
  },
  {
    lb: 3,
    title: "Kerne, Zufall und Strahlung",
    shortTitle: "Atom- und Kernphysik",
    icon: "◉",
  },
  {
    lb: 4,
    title: "Energie bereitstellen und Entscheidungen begründen",
    shortTitle: "Energieversorgung",
    icon: "◈",
  },
];
