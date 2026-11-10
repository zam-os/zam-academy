import type { Source, Stage } from "../model/types";

export const CURRICULUM_URL =
  "https://www.isb.bayern.de/fileadmin/user_upload/Gymnasium/Einfuehrungsklasse/biologie.pdf";
export const CHECKED = "2026-11-10";

export const SOURCES: Source[] = [
  {
    id: "isb",
    label: "ISB · Umsetzungshinweise Biologie für die Einführungsklasse",
    url: CURRICULUM_URL,
  },
  {
    id: "b10",
    label: "LehrplanPLUS · Biologie 10 Gymnasium",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/biologie",
  },
  {
    id: "antibiotika",
    label: "BIÖG · Wie wirken Antibiotika?",
    url: "https://www.infektionsschutz.de/infektionen/behandlungsmoeglichkeiten/antibiotika/",
  },
  {
    id: "atemwege",
    label: "BIÖG · Übertragung bei Atemwegsinfektionen",
    url: "https://www.infektionsschutz.de/infektionen/krankheitsbilder/atemwegsinfektionen/",
  },
  {
    id: "hiv",
    label: "BIÖG · HIV: Übertragung und Schutz",
    url: "https://www.liebesleben.de/fuer-alle/hiv-aids/",
  },
  {
    id: "rki",
    label: "RKI · Gemeinschaftsschutz durch Impfungen",
    url: "https://www.rki.de/DE/Themen/Infektionskrankheiten/Impfen/Impfthemen-A-Z/G/Gemeinschaftsschutz.html",
  },
  {
    id: "dge",
    label: "DGE · Ernährungskreis für gesunde Erwachsene",
    url: "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-ernaehrungskreis/",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Erkenntnisse gewinnen, bewerten und kommunizieren",
    shortTitle: "Forschen und begründen",
    icon: "↗",
  },
  {
    lb: 2,
    title: "Zytologische Grundlagen des Lebens",
    shortTitle: "Zellen und Gewebe",
    icon: "◉",
    hours: 5,
  },
  {
    lb: 3,
    title: "Ökosystem Mensch",
    shortTitle: "Mikrobiom und Immunabwehr",
    icon: "✦",
    hours: 8,
  },
  {
    lb: 4,
    title: "Stoff- und Energieumwandlung im Menschen",
    shortTitle: "Stoffwechsel und Energie",
    icon: "⇄",
    hours: 20,
  },
  { lb: 5, title: "Grundlagen der Genetik", shortTitle: "Genetik", icon: "⌁", hours: 15 },
  {
    lb: 6,
    title: "Grundlagen der Verhaltensbiologie",
    shortTitle: "Reize und Verhalten",
    icon: "◎",
    hours: 6,
  },
];
