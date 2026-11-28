import type { Source, Stage } from "../model/types";

export const CURRICULUM_URL = "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/geschichte";

export const STAGES: Stage[] = [
  { lb: 1, title: "Aufklärung, Französische Revolution und Napoleon", shortTitle: "Aufklärung und Revolution", icon: "✦", hours: 10 },
  { lb: 2, title: "Einigkeit und Freiheit? Deutschland zwischen Restauration und Revolution", shortTitle: "Einigkeit und Freiheit?", icon: "⚑", hours: 9 },
  { lb: 3, title: "Bayern – Identität, Staatsgebiet und kulturelles Erbe (Längsschnitt)", shortTitle: "Bayern im Längsschnitt", icon: "◆", hours: 6 },
  { lb: 4, title: "Industrialisierung und Soziale Frage", shortTitle: "Industrialisierung und Soziale Frage", icon: "⚙", hours: 9 },
  { lb: 5, title: "Das Deutsche Kaiserreich", shortTitle: "Das Deutsche Kaiserreich", icon: "◫", hours: 9 },
  { lb: 6, title: "Imperialismus und Erster Weltkrieg", shortTitle: "Imperialismus und Erster Weltkrieg", icon: "◉", hours: 13 },
];

function source(id: string, label: string, url: string): Source {
  return { id, label, url };
}

export const SOURCES = [
  source("curriculum", "ISB · LehrplanPLUS Geschichte 8 Gymnasium", CURRICULUM_URL),
  source("rights", "Élysée · Erklärung der Menschen- und Bürgerrechte (Englisch)", "https://www.elysee.fr/en/french-presidency/the-declaration-of-the-rights-of-man-and-of-the-citizen"),
  source("constitution", "Élysée · Französische Verfassung von 1791", "https://www.elysee.fr/la-presidence/la-constitution-du-3-septembre-1791"),
  source("napoleon", "Louvre · Napoleon krönt sich selbst (Zeichnung)", "https://collections.louvre.fr/ark:/53355/cl020016898"),
  source("territory", "Haus der Bayerischen Geschichte · Karten zur territorialen Entwicklung Bayerns (PDF)", "https://archiv.hdbg.de/napoleon/pdf/Die_territoriale_Entwicklung_Bayerns.pdf"),
  source("montgelas", "Historisches Lexikon Bayerns · Konstitution des Königreichs Bayern", "https://www.historisches-lexikon-bayerns.de/Lexikon/Konstitution_des_K%C3%B6nigreichs_Bayern_%281808%29"),
  source("vienna", "DHM · Deutsche Bundesakte von 1815", "https://www.dhm.de/lemo/kapitel/vormaerz-und-revolution/wiener-kongress/bundesakte"),
  source("weavers", "Heinrich Heine · Die schlesischen Weber", "https://de.wikisource.org/wiki/Die_schlesischen_Weber"),
  source("landbote", "Georg Büchner und Friedrich Ludwig Weidig · Der Hessische Landbote", "https://de.wikisource.org/wiki/Der_Hessische_Landbote"),
  source("hambach", "Stiftung Hambacher Schloss · Hambacher Fest", "https://hambacher-schloss.de/entdecken/hambacher-fest/"),
  source("paulskirche", "Deutscher Bundestag · Revolution und Frankfurter Nationalversammlung", "https://www.bundestag.de/parlament/geschichte/parlamentarismus/1848/1848-199600"),
  source("postwar", "Historisches Lexikon Bayerns · Pfalz im 19. und 20. Jahrhundert", "https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_44564"),
  source("coat", "Bayerisches Innenministerium · Staatssymbole", "https://www.stmi.bayern.de/staat-und-verfassung/staatssymbole/"),
  source("monuments", "Bayerisches Landesamt für Denkmalpflege · Bayerischer Denkmal-Atlas", "https://www.blfd.bayern.de/denkmal-atlas/index.html"),
  source("bavarian-industry", "Historisches Lexikon Bayerns · Industrialisierung", "https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_44512"),
  source("industry", "DHM · Industrie und Wirtschaft im Kaiserreich", "https://www.dhm.de/lemo/kapitel/kaiserreich/industrie"),
  source("occupations", "Deutsches Historisches Institut Washington · Statistik zu Erwerbstätigen (Englisch)", "https://germanhistorydocs.org/en/wilhelmine-germany-and-the-first-world-war-1890-1918/ghdi:document-633"),
  source("unification", "DHM · Reichsgründung 1871", "https://www.dhm.de/lemo/kapitel/kaiserreich/reich/reichsgruendung"),
  source("painting", "Deutsches Historisches Institut Washington · Friedrichsruher Fassung der Kaiserproklamation", "https://germanhistorydocs.org/de/reichsgruendung-bismarcks-deutschland-1866-1890/anton-von-werner-die-proklamierung-des-deutschen-kaiserreiches-18-januar-1871-friedrichsruher-fassung-1885"),
  source("painting-copy", "Wikimedia Commons · Gemeinfreie Reproduktion des Gemäldes", "https://commons.wikimedia.org/wiki/File:A_v_Werner_-_Kaiserproklamation_am_18_Januar_1871_(3._Fassung_1885).jpg"),
  source("kaiserreich", "DHM · Das Deutsche Kaiserreich", "https://www.dhm.de/lemo/kapitel/kaiserreich"),
  source("reichstag", "Deutscher Bundestag · Parlamentarismus im Kaiserreich", "https://www.bundestag.de/parlament/geschichte/parlamentarismus/kaiserreich"),
  source("social-laws", "DHM · Sozialgesetzgebung", "https://www.dhm.de/lemo/kapitel/kaiserreich/innenpolitik/sozialgesetze"),
  source("society", "DHM · Alltagsleben im Kaiserreich", "https://www.dhm.de/lemo/kapitel/kaiserreich/alltagsleben"),
  source("colonial", "DHM · Deutsche Kolonialpolitik", "https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/kolonialpolitik"),
  source("genocide", "DHM · Der Kolonialkrieg gegen die Herero", "https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/herero-krieg-1904"),
  source("war", "DHM · Der Erste Weltkrieg", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg"),
  source("july", "DHM · Juli-Krise 1914", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/juli-krise-1914"),
  source("trenches", "DHM · Stellungskrieg", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/stellungskrieg"),
  source("homefront", "DHM · Alltagsleben im Ersten Weltkrieg", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/alltagsleben"),
  source("fieldpost", "DHM · Feldpost", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/feldpost"),
  source("america", "US Office of the Historian · Kriegseintritt der USA (Englisch)", "https://history.state.gov/milestones/1914-1920/wwi"),
  source("russia", "DHM · Russische Revolution", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/russische-revolution"),
  source("versailles", "DHM · Versailler Vertrag", "https://www.dhm.de/lemo/kapitel/weimarer-republik/aussenpolitik/versailles"),
  source("casualties", "DHM · Tod und Verwundung", "https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/tod-und-verwundung"),
  source("paris", "US Office of the Historian · Pariser Friedenskonferenz (Englisch)", "https://history.state.gov/milestones/1914-1920/paris-peace"),
];

export const sourceUrl = (id: string) => SOURCES.find((entry) => entry.id === id)!.url;
