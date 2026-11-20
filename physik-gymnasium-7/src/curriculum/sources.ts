import type { Source, Stage } from "../model/types";
/**
 * Natur und Technik 7 at the Gymnasium: Lernbereich 1 "Physik in Natur und
 * Technik entdecken" is the Schwerpunkt Physik. Lernbereich 2 (Schwerpunkt
 * Informatik) is not part of this package.
 */
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym";
/** Every link was opened on 2026-11-20 and its page title read. */
export const SOURCES_CHECKED = "20. November 2026";
const WIKI = "https://de.wikipedia.org/wiki/";
export const SOURCES: Source[] = [
  { id: "lp", label: "LehrplanPLUS · Natur und Technik 7 Gymnasium", url: CURRICULUM_URL },
  { id: "jahreszeit", label: "Wikipedia · Jahreszeit", url: `${WIKI}Jahreszeit` },
  { id: "magnet-kinder", label: "Klexikon · Magnet", url: "https://klexikon.zum.de/wiki/Magnet" },
  { id: "dauermagnet", label: "Wikipedia · Dauermagnet", url: `${WIKI}Permanentmagnet` },
  { id: "elementarmagnet", label: "Wikipedia · Elementarmagnet", url: `${WIKI}Elementarmagnet` },
  { id: "erdmagnetfeld", label: "Wikipedia · Erdmagnetfeld", url: `${WIKI}Erdmagnetfeld` },
  { id: "kompass", label: "Klexikon · Kompass", url: "https://klexikon.zum.de/wiki/Kompass" },
  { id: "dichte", label: "Wikipedia · Dichte", url: `${WIKI}Dichte` },
  {
    id: "dichtetabelle",
    label: "OpenStax · Dichte mit Tabelle (englisch)",
    url: "https://openstax.org/books/college-physics-2e/pages/11-2-density",
  },
  { id: "messzylinder", label: "Wikipedia · Messzylinder", url: `${WIKI}Messzylinder` },
  {
    id: "cfk",
    label: "Wikipedia · Kohlenstofffaserverstärkter Kunststoff",
    url: `${WIKI}Kohlenstofffaserverst%C3%A4rkter_Kunststoff`,
  },
  { id: "fahrradrahmen", label: "Wikipedia · Fahrradrahmen", url: `${WIKI}Fahrradrahmen` },
  { id: "licht", label: "Klexikon · Licht", url: "https://klexikon.zum.de/wiki/Licht" },
  { id: "koerperfarbe", label: "Wikipedia · Körperfarbe", url: `${WIKI}K%C3%B6rperfarbe` },
  { id: "farbmischung", label: "Wikipedia · Additive Farbmischung", url: `${WIKI}Additive_Farbmischung` },
  { id: "schatten", label: "Wikipedia · Schatten", url: `${WIKI}Schatten` },
  { id: "mond", label: "Klexikon · Mond", url: "https://klexikon.zum.de/wiki/Mond" },
  { id: "mondphase", label: "Wikipedia · Mondphase", url: `${WIKI}Mondphase` },
  { id: "sofi", label: "Klexikon · Sonnenfinsternis", url: "https://klexikon.zum.de/wiki/Sonnenfinsternis" },
  { id: "mofi", label: "Klexikon · Mondfinsternis", url: "https://klexikon.zum.de/wiki/Mondfinsternis" },
  {
    id: "adac",
    label: "ADAC · Sichtbarkeit von Kindern im Straßenverkehr",
    url: "https://www.adac.de/verkehr/verkehrssicherheit/kindersicherheit/schulweg/sichtbarkeit-strassenverkehr/",
  },
  {
    id: "zuerich",
    label: "Stadt Zürich · Sichtbarkeit im Strassenverkehr",
    url: "https://www.stadt-zuerich.ch/de/mobilitaet/verkehrssicherheit/sichere-mobilitaet/sichtbarkeit.html",
  },
  {
    id: "laserpointer",
    label: "Bundesamt für Strahlenschutz · Laserpointer",
    url: "https://www.bfs.de/DE/themen/opt/anwendung-alltag-technik/laser/laserpointer/laserpointer.html",
  },
  { id: "atom", label: "Klexikon · Atome und Moleküle", url: "https://klexikon.zum.de/wiki/Atom" },
  { id: "rutherford", label: "Wikipedia · Rutherfordsches Atommodell", url: `${WIKI}Rutherfordsches_Atommodell` },
  { id: "reibung", label: "Wikipedia · Reibungselektrizität", url: `${WIKI}Reibungselektrizit%C3%A4t` },
  { id: "elektrizitaet", label: "Klexikon · Elektrizität", url: "https://klexikon.zum.de/wiki/Elektrizit%C3%A4t" },
  { id: "strom", label: "Wikipedia · Elektrischer Strom", url: `${WIKI}Elektrischer_Strom` },
  { id: "gluehlampe", label: "Wikipedia · Glühlampe", url: `${WIKI}Gl%C3%BChlampe` },
  { id: "oersted", label: "Wikipedia · Hans Christian Ørsted", url: `${WIKI}Hans_Christian_%C3%98rsted` },
  { id: "elektromagnet", label: "Wikipedia · Elektromagnet", url: `${WIKI}Elektromagnet` },
  { id: "wechselschaltung", label: "Wikipedia · Wechselschaltung", url: `${WIKI}Wechselschaltung` },
  { id: "schaltzeichen", label: "Wikipedia · Schaltzeichen", url: `${WIKI}Schaltzeichen` },
];
/** The three sections of NT7 Lernbereich 1, each a stage with its own accent. */
export const STAGES: Stage[] = [
  {
    lb: 1,
    section: "1.1",
    title: "Ein erster Blick auf die physikalischen Spielregeln der Natur",
    shortTitle: "Magnete und Dichte",
    hours: 10,
  },
  { lb: 2, section: "1.2", title: "Optische Phänomene", shortTitle: "Licht und Schatten", hours: 10 },
  { lb: 3, section: "1.3", title: "Elektrische Stromkreise", shortTitle: "Ladung und Strom", hours: 8 },
];
