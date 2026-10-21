import type { Source, Stage } from "../model/types";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/biologie";
export const SOURCES: Source[] = [
  {
    id: "lp",
    label: "ISB · LehrplanPLUS Biologie 10 Realschule · geprüft 21.10.2026",
    url: CURRICULUM_URL,
  },
  {
    id: "lp7",
    label: "ISB · Biologie 7 · Organsysteme und Nervensystem (Vorwissen)",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/biologie",
  },
  {
    id: "lp8",
    label: "ISB · Biologie 8 · Evolution (Vorwissen)",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/biologie",
  },
  {
    id: "dna",
    label: "NHGRI · DNA: Struktur und Replikation",
    url: "https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet",
  },
  {
    id: "chromosomes",
    label: "NHGRI · Chromosomen",
    url: "https://www.genome.gov/about-genomics/fact-sheets/Chromosomes-Fact-Sheet",
  },
  {
    id: "genetics",
    label: "NIH / MedlinePlus Genetics · Genetik verstehen",
    url: "https://medlineplus.gov/genetics/understanding/",
  },
  {
    id: "inheritance",
    label: "NIH / MedlinePlus Genetics · Erbgänge und ihre Grenzen",
    url: "https://www.medlineplus.gov/genetics/understanding/inheritance/inheritancepatterns/",
  },
  {
    id: "cf",
    label: "NIH / MedlinePlus Genetics · Mukoviszidose",
    url: "https://medlineplus.gov/genetics/condition/cystic-fibrosis/",
  },
  {
    id: "bfn",
    label: "BfN · Biologische Vielfalt und Ökosystemleistungen",
    url: "https://www.bfn.de/bpbv-oekosystemleistungen",
  },
  {
    id: "moor",
    label: "BfN · Moore: Kohlenstoff, Wasser und Ökosystemleistungen",
    url: "https://www.bfn.de/oekosystemleistungen-0",
  },
  {
    id: "vorsorge",
    label: "BIÖG / familienplanung.de · Schwangerschaftsvorsorge",
    url: "https://www.familienplanung.de/schwangerschaft/schwangerschaftsvorsorge-und-begleitung/vorsorge-zur-sicherheit/",
  },
  {
    id: "praenatal",
    label: "BIÖG / familienplanung.de · Pränataldiagnostik",
    url: "https://www.familienplanung.de/schwangerschaft/praenataldiagnostik/",
  },
  {
    id: "recht",
    label: "Bundesrecht · StGB § 218a, aktuelle Fassung",
    url: "https://www.gesetze-im-internet.de/stgb/__218a.html",
  },
  {
    id: "pid",
    label: "Bundesrecht · Embryonenschutzgesetz § 3a: PID",
    url: "https://www.gesetze-im-internet.de/eschg/__3a.html",
  },
  {
    id: "ivf",
    label: "BIÖG / familienplanung.de · In-vitro-Fertilisation · Stand 07.01.2026",
    url: "https://www.familienplanung.de/kinderwunsch/kinderwunschbehandlung-ist-das-was-fuer-mich/in-vitro-fertilisation/",
  },
  {
    id: "familie",
    label: "BIÖG / familienplanung.de · Informationen und Beratung",
    url: "https://www.familienplanung.de/",
  },
  {
    id: "bipedie",
    label: "Smithsonian · Belege zum aufrechten Gang",
    url: "https://humanorigins.si.edu/human-characteristics/walking-upright",
  },
  {
    id: "fossilien",
    label: "Natural History Museum · Archaeopteryx und Mosaikmerkmale",
    url: "https://www.nhm.ac.uk/discover/dino-directory/archaeopteryx.html",
  },
];
export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Prozessbezogene Kompetenzen",
    shortTitle: "Biologisch untersuchen und urteilen",
    icon: "⌕",
  },
  { lb: 2, title: "Genetik", shortTitle: "Erbinformation verstehen", icon: "🧬", hours: 20 },
  {
    lb: 3,
    title: "Lokale und globale Auswirkungen auf Ökosysteme durch Eingriffe des Menschen",
    shortTitle: "Ökosysteme untersuchen und schützen",
    icon: "🌿",
    hours: 8,
  },
  {
    lb: 4,
    title: "Verantwortungsvolle Elternschaft",
    shortTitle: "Entwicklung, Beziehung und Verantwortung",
    icon: "◎",
    hours: 8,
  },
  {
    lb: 5,
    title: "Vorwissen aus Biologie 7",
    shortTitle: "Nervensystem auffrischen",
    icon: "↝",
    optional: true,
  },
  {
    lb: 6,
    title: "Vorwissen aus Biologie 8",
    shortTitle: "Evolution auffrischen",
    icon: "⤴",
    optional: true,
  },
];
