import type { Source, Stage, Track } from "../model/types";
/** One Fachlehrplan for every Ausbildungsrichtung; Lernbereich 4 applies to the NTG only. */
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/physik";
export const curriculumUrl = (_track: Track): string => CURRICULUM_URL;
export const trackLabel = (track: Track): string =>
  track === "NTG" ? "NTG" : "SG, WSG, HG, MuG";
const OPENSTAX = "https://openstax.org/books/college-physics-2e/pages/";
const ASTRONOMY = "https://openstax.org/books/astronomy-2e/pages/";
export const SOURCES: Source[] = [
  {
    id: "lp",
    label: "LehrplanPLUS Physik 11 · Gymnasium",
    url: CURRICULUM_URL,
  },
  {
    id: "rotation",
    label: "OpenStax · Drehwinkel und Winkelgeschwindigkeit",
    url: `${OPENSTAX}6-1-rotation-angle-and-angular-velocity`,
  },
  {
    id: "centripetal",
    label: "OpenStax · Zentripetalbeschleunigung und Zentripetalkraft",
    url: `${OPENSTAX}6-3-centripetal-force`,
  },
  {
    id: "fictitious",
    label: "OpenStax · Scheinkräfte in beschleunigten Bezugssystemen",
    url: `${OPENSTAX}6-4-fictitious-forces-and-non-inertial-frames-the-coriolis-force`,
  },
  {
    id: "gravitation",
    label: "OpenStax · Newtons Gravitationsgesetz",
    url: `${OPENSTAX}6-5-newtons-universal-law-of-gravitation`,
  },
  {
    id: "satellites",
    label: "OpenStax · Satelliten und Kepler’sche Gesetze",
    url: `${OPENSTAX}6-6-satellites-and-keplers-laws-an-argument-for-simplicity`,
  },
  {
    id: "uncertainty",
    label: "OpenStax · Genauigkeit und Messunsicherheit",
    url: `${OPENSTAX}1-3-accuracy-precision-and-significant-figures`,
  },
  {
    id: "harmonic",
    label: "OpenStax · Harmonische Schwingung",
    url: `${OPENSTAX}16-3-simple-harmonic-motion-a-special-periodic-motion`,
  },
  {
    id: "pendulum",
    label: "OpenStax · Fadenpendel",
    url: `${OPENSTAX}16-4-the-simple-pendulum`,
  },
  {
    id: "waves",
    label: "OpenStax · Wellen",
    url: `${OPENSTAX}16-9-waves`,
  },
  {
    id: "superposition",
    label: "OpenStax · Superposition, Interferenz und stehende Wellen",
    url: `${OPENSTAX}16-10-superposition-and-interference`,
  },
  {
    id: "huygens",
    label: "OpenStax · Huygens’sches Prinzip und Beugung",
    url: `${OPENSTAX}27-2-huygenss-principle-diffraction`,
  },
  {
    id: "doubleslit",
    label: "OpenStax · Doppelspaltexperiment von Young",
    url: `${OPENSTAX}27-3-youngs-double-slit-experiment`,
  },
  {
    id: "photon",
    label: "OpenStax · Photonenenergie und Spektrum",
    url: `${OPENSTAX}29-3-photon-energies-and-the-electromagnetic-spectrum`,
  },
  {
    id: "astro-history",
    label: "OpenStax Astronomy · Entstehung der modernen Astronomie",
    url: `${ASTRONOMY}2-4-the-birth-of-modern-astronomy`,
  },
  {
    id: "kepler",
    label: "OpenStax Astronomy · Gesetze der Planetenbewegung",
    url: `${ASTRONOMY}3-1-the-laws-of-planetary-motion`,
  },
  {
    id: "expansion",
    label: "OpenStax Astronomy · Das expandierende Universum",
    url: `${ASTRONOMY}26-5-the-expanding-universe`,
  },
  {
    id: "postulates",
    label: "OpenStax · Einsteins Postulate",
    url: `${OPENSTAX}28-1-einsteins-postulates`,
  },
  {
    id: "dilation",
    label: "OpenStax · Gleichzeitigkeit und Zeitdilatation",
    url: `${OPENSTAX}28-2-simultaneity-and-time-dilation`,
  },
  {
    id: "contraction",
    label: "OpenStax · Längenkontraktion",
    url: `${OPENSTAX}28-3-length-contraction`,
  },
  {
    id: "lemo",
    label: "Deutsches Historisches Museum · Wissenschaft im NS-Regime",
    url: "https://www.dhm.de/lemo/kapitel/ns-regime/wissenschaft-und-forschung.html",
  },
  {
    id: "heat-engines",
    label: "OpenStax · Zweiter Hauptsatz und Wirkungsgrad",
    url: `${OPENSTAX}15-3-introduction-to-the-second-law-of-thermodynamics-heat-engines-and-their-efficiency`,
  },
  {
    id: "uba-energy",
    label: "Umweltbundesamt · Primärenergieverbrauch",
    url: "https://www.umweltbundesamt.de/daten/energie/primaerenergieverbrauch",
  },
  {
    id: "uba-renewable",
    label: "Umweltbundesamt · Erneuerbare Energien in Zahlen",
    url: "https://www.umweltbundesamt.de/themen/klima-energie/erneuerbare-energien/erneuerbare-energien-in-zahlen",
  },
  {
    id: "uba-saving",
    label: "Umweltbundesamt · Energiesparen",
    url: "https://www.umweltbundesamt.de/themen/klima-energie/energiesparen",
  },
  {
    id: "energy-charts",
    label: "Fraunhofer ISE · Energy-Charts (Stromerzeugung)",
    url: "https://www.energy-charts.info/",
  },
  {
    id: "pv-facts",
    label: "Fraunhofer ISE · Aktuelle Fakten zur Photovoltaik",
    url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html",
  },
  {
    id: "drag",
    label: "OpenStax · Luftwiderstand und Endgeschwindigkeit",
    url: `${OPENSTAX}5-2-drag-forces`,
  },
  {
    id: "dwd",
    label: "Deutscher Wetterdienst · Numerische Wettervorhersage",
    url: "https://www.dwd.de/DE/forschung/wettervorhersage/num_modellierung/numerischemodellierung_node.html",
  },
];
export const STAGES: Stage[] = [
  {
    lb: 1,
    title: "Kreisbahnen beschreiben, Kräfte erkennen, Satelliten berechnen",
    shortTitle: "Kreisbewegung",
    icon: "◯",
  },
  {
    lb: 2,
    title: "Vom Pendel über die Welle zum Licht",
    shortTitle: "Schwingungen und Wellen",
    icon: "∿",
  },
  {
    lb: 3,
    title: "Weltbilder, Relativität und Energieversorgung selbst erarbeiten",
    shortTitle: "Eigenverantwortliche Arbeit an physikalischen Themen",
    icon: "✦",
  },
  {
    lb: 4,
    title: "Simulieren, Photovoltaik untersuchen, Stellung nehmen",
    shortTitle: "Profilbereich am NTG",
    icon: "⚙",
  },
];
