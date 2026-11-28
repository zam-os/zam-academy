import type { Stage } from "../model/types";

export const EDITORIAL_DATE = "28. November 2026";
export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/wirtschaft-und-recht";
/**
 * The Profilbereich am WWG: each class chooses some of its areas, so its
 * lessons are shown by default but do not count as core lessons.
 */
export const OPTIONAL_LB = 4;

export const STAGES: Stage[] = [
  { lb: 1, title: "Ökonomisches Handeln im privaten Haushalt", subtitle: "Konsum entscheiden, mit Geld planen und Schulden vermeiden", hours: 28, glyph: "🛒" },
  { lb: 2, title: "Ökonomisches Handeln im Unternehmen", subtitle: "Arbeit teilen, Abläufe organisieren und Produkte vermarkten", hours: 38, glyph: "🏭" },
  { lb: 3, title: "Rechtlich verantwortliches Handeln", subtitle: "Recht verstehen, Fälle prüfen und im Netz sicher handeln", hours: 18, glyph: "⚖️" },
  { lb: 4, title: "Profilbereich am WWG", subtitle: "Vertiefungen und Projekt, ausgewählt von deiner Klasse", hours: 0, glyph: "🎯" },
];

export const SOURCES = [
  { id: "lp", label: "LehrplanPLUS · Wirtschaft und Recht 8 (WWG)", url: CURRICULUM_URL },
  { id: "gg", label: "Grundgesetz", url: "https://www.gesetze-im-internet.de/gg/" },
  { id: "bgb", label: "Bürgerliches Gesetzbuch", url: "https://www.gesetze-im-internet.de/bgb/" },
  { id: "stgb", label: "Strafgesetzbuch", url: "https://www.gesetze-im-internet.de/stgb/" },
  { id: "jgg", label: "Jugendgerichtsgesetz", url: "https://www.gesetze-im-internet.de/jgg/" },
  { id: "stpo", label: "Strafprozessordnung", url: "https://www.gesetze-im-internet.de/stpo/" },
  { id: "zpo", label: "Zivilprozessordnung", url: "https://www.gesetze-im-internet.de/zpo/" },
  { id: "urhg", label: "Urheberrechtsgesetz", url: "https://www.gesetze-im-internet.de/urhg/" },
  { id: "kug", label: "Kunsturhebergesetz · Recht am eigenen Bild", url: "https://www.gesetze-im-internet.de/kunsturhg/" },
  { id: "juschg", label: "Jugendschutzgesetz", url: "https://www.gesetze-im-internet.de/juschg/" },
  { id: "jarbschg", label: "Jugendarbeitsschutzgesetz", url: "https://www.gesetze-im-internet.de/jarbschg/" },
  { id: "kindarbschv", label: "Kinderarbeitsschutzverordnung", url: "https://www.gesetze-im-internet.de/kindarbschv/" },
  { id: "bmas-jarbschg", label: "BMAS · Jugendarbeitsschutzgesetz", url: "https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/jugendarbeitsschutzgesetz.html" },
  { id: "pangv", label: "Preisangabenverordnung", url: "https://www.gesetze-im-internet.de/pangv_2022/" },
  { id: "uwg", label: "Gesetz gegen den unlauteren Wettbewerb", url: "https://www.gesetze-im-internet.de/uwg_2004/" },
  { id: "bfdi", label: "Bundesbeauftragte für den Datenschutz und die Informationsfreiheit", url: "https://www.bfdi.bund.de/DE/Home/home_node.html" },
  { id: "klicksafe", label: "klicksafe · Sicherheit im Netz", url: "https://www.klicksafe.de/" },
  { id: "bsi-phishing", label: "BSI · Passwortdiebstahl durch Phishing", url: "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Cyber-Sicherheitslage/Methoden-der-Cyber-Kriminalitaet/Spam-Phishing-Co/Passwortdiebstahl-durch-Phishing/passwortdiebstahl-durch-phishing_node.html" },
  { id: "vz", label: "Verbraucherzentralen", url: "https://www.verbraucherzentrale.de/" },
  { id: "vz-schulden", label: "Verbraucherzentrale · Kredit, Schulden, Insolvenz", url: "https://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredit-schulden-insolvenz" },
  { id: "schuldnerberatung", label: "meine-schulden.de · Schuldnerberatung", url: "https://www.meine-schulden.de/" },
  { id: "test", label: "Stiftung Warentest", url: "https://www.test.de/" },
  { id: "siegelklarheit", label: "Siegelklarheit", url: "https://www.siegelklarheit.de/" },
  { id: "uba", label: "Umweltbundesamt", url: "https://www.umweltbundesamt.de/" },
  { id: "bbk-geldpolitik", label: "Deutsche Bundesbank · Geldpolitik", url: "https://www.bundesbank.de/de/aufgaben/geldpolitik" },
  { id: "bbk-zahlungsverkehr", label: "Deutsche Bundesbank · Unbarer Zahlungsverkehr", url: "https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr" },
  { id: "bbk-bargeld", label: "Deutsche Bundesbank · Bargeld", url: "https://www.bundesbank.de/de/aufgaben/bargeld" },
  { id: "bbk-geldmuseum", label: "Deutsche Bundesbank · Geldmuseum", url: "https://www.bundesbank.de/de/bundesbank/geldmuseum" },
  { id: "ezb", label: "Europäische Zentralbank · Two per cent inflation target", url: "https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.de.html" },
  { id: "destatis-vpi", label: "Statistisches Bundesamt · Verbraucherpreisindex und Inflationsrate", url: "https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html" },
  { id: "bpb", label: "Bundeszentrale für politische Bildung", url: "https://www.bpb.de/" },
  { id: "cc", label: "Creative Commons · Lizenzen", url: "https://creativecommons.org/licenses/?lang=de" },
  { id: "usk", label: "USK · Unterhaltungssoftware Selbstkontrolle", url: "https://www.usk.de/" },
  { id: "fsk", label: "FSK · Freiwillige Selbstkontrolle der Filmwirtschaft", url: "https://www.fsk.de/" },
];
