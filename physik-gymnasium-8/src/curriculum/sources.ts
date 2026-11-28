import type { Source, Stage, Track } from "../model/types";

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/physik";
export const curriculumUrl = (_track: Track): string => CURRICULUM_URL;
export const trackLabel = (track: Track): string =>
  track === "NTG" ? "NTG" : "Alle außer NTG";

export const SOURCES: Source[] = [
  { id: "lp", label: "LehrplanPLUS Bayern · Physik 8", url: CURRICULUM_URL },
  {
    id: "nt7",
    label: "LehrplanPLUS · Natur und Technik 7",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym",
  },
  {
    id: "safety",
    label: "ELEKTRO+ · Sicherheit der Elektroinstallation",
    url: "https://www.elektro-plus.com/aal/sicherheit",
  },
  {
    id: "myopia",
    label: "AAD · Kurzsichtigkeit und Fokus vor der Netzhaut",
    url: "https://augeninfo.de/offen/pressetext_aad.php?meldung=161",
  },
  {
    id: "hyperopia",
    label: "BVA · Weitsichtigkeit und Korrektur",
    url: "https://www.augeninfo.de/offen/Weitsichtigkeit-Hyperopie",
  },
  {
    id: "solar",
    label: "Fraunhofer ISE · Verschattung und Verschaltung",
    url: "https://www.ise.fraunhofer.de/de/forschungsprojekte/shirkan.html",
  },
  {
    id: "measurement",
    label: "LehrplanPLUS · Messunsicherheiten",
    url: "https://www.lehrplanplus.bayern.de/serviceinformation/l446470",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    shortTitle: "Elektrischer Strom",
    title: "Kennlinien lesen und Stromkreise vergleichen",
    icon: "ϟ",
  },
  {
    lb: 2,
    shortTitle: "Optik",
    title: "Lichtstrahlen verfolgen und Bilder konstruieren",
    icon: "◇",
  },
  {
    lb: 3,
    shortTitle: "Mechanik",
    title: "Bewegung messen und Kräfte als Pfeile darstellen",
    icon: "↗",
  },
  {
    lb: 4,
    shortTitle: "Profilbereich am NTG",
    title: "Solarzellen untersuchen und ein Experiment auswerten",
    icon: "☀",
  },
];
