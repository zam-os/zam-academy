import type { Stage } from "../model/types";

/** The four Lernbereiche of the Fachlehrplan Deutsch 9 and their look in the app. */
export const STAGES: Stage[] = [
  { lb: 1, title: "Sprechen und Zuhören", subtitle: "Zuhören, präsentieren, Gespräche führen und Szenen spielen", glyph: "🎙️" },
  { lb: 2, title: "Lesen und Medien", subtitle: "Texte erschließen, Literatur verstehen, Sachtexte und Medien beurteilen", glyph: "📖" },
  { lb: 3, title: "Schreiben", subtitle: "Bewerbungen, Zitate, Kommentare und Texte überarbeiten", glyph: "✍️" },
  { lb: 4, title: "Sprache untersuchen", subtitle: "Satzbau, Stilmittel, Sprachebenen und Rechtschreibung", glyph: "🔤" },
];

/** Where the content was read. Only sources that a lesson really used are listed on it. */
export const SOURCES: Array<{ id: string; label: string; url: string }> = [
  {
    id: "lp",
    label: "LehrplanPLUS Bayern: Fachlehrplan Deutsch, Realschule, Jahrgangsstufe 9",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/deutsch",
  },
  {
    id: "regelwerk",
    label: "Amtliches Regelwerk der deutschen Rechtschreibung, Fassung 2024 (Rat für deutsche Rechtschreibung)",
    url: "https://www.rechtschreibrat.com/DOX/RfdR_Amtliches-Regelwerk_2024.pdf",
  },
  { id: "dwds", label: "DWDS: Digitales Wörterbuch der deutschen Sprache", url: "https://www.dwds.de/" },
  { id: "duden", label: "Duden online: Nachschlagewerk zu Rechtschreibung und Grammatik", url: "https://www.duden.de/" },
  { id: "wikisource", label: "Wikisource: Volltexte gemeinfreier Werke", url: "https://de.wikisource.org/" },
  { id: "gutenberg", label: "Projekt Gutenberg: Volltexte gemeinfreier Werke", url: "https://projekt-gutenberg.org/" },
  { id: "klicksafe", label: "klicksafe: Sicher im Netz, Medienkompetenz", url: "https://www.klicksafe.de/" },
  { id: "bpb", label: "Bundeszentrale für politische Bildung", url: "https://www.bpb.de/" },
  { id: "jim", label: "JIM-Studie: Jugend, Information, Medien", url: "https://mpfs.de/studien/jim-studie/" },
  { id: "arbeitsagentur", label: "Bundesagentur für Arbeit: Bewerbung und Berufswahl", url: "https://www.arbeitsagentur.de/bildung/bewerbung" },
  { id: "youngdata", label: "youngdata: Datenschutz und Bildrechte für junge Menschen", url: "https://www.youngdata.de/" },
  {
    id: "medienanstalten",
    label: "Die Medienanstalten: Leitfaden Werbekennzeichnung bei Online-Medien",
    url: "https://www.die-medienanstalten.de/fileadmin/user_upload/die_medienanstalten/Service/Merkblaetter_Leitfaeden/Leitfaden_Werbekennzeichnung_Onlinemedien_ua.pdf",
  },
  { id: "gesetze", label: "Gesetze im Internet: Bundesrecht (KUG, UrhG, DDG)", url: "https://www.gesetze-im-internet.de/" },
  {
    id: "blm",
    label: "Bayerische Landeszentrale für neue Medien: Musikrechte im eigenen Clip",
    url: "https://www.blm.de/files/pdf2/hintergrundinformationen-zum-clip_musikrechte.pdf",
  },
  { id: "kinofenster", label: "kinofenster.de: Filmglossar", url: "https://www.kinofenster.de/lehrmaterial/glossar/" },
  {
    id: "schulzvonthun",
    label: "Schulz von Thun Institut: Das Kommunikationsquadrat",
    url: "https://www.schulz-von-thun.de/die-modelle/das-kommunikationsquadrat",
  },
  {
    id: "oldenburg",
    label: "Universität Oldenburg: Methodenkartei, Standbild",
    url: "https://methodenkartei.uni-oldenburg.de/methode/standbild/",
  },
  {
    id: "post",
    label: "Deutsche Post: Post und Schule, Themenheft Geschäftsbriefe (DIN 5008)",
    url: "https://www.deutschepost.de/dam/jcr:df2156f4-6bef-4ab8-b8a1-6354b8057b4a/dp-post-und-schule-themenheft-geschaeftsbriefe-022021.pdf",
  },
  {
    id: "fachjournalist",
    label: "Fachjournalist.de: Journalistisches Schreiben, Mischformen (Reportage)",
    url: "https://www.fachjournalist.de/PDF-Dateien/2012/05/FJ_4_2002-Journalistisches-Schreiben-3_Mischformen.pdf",
  },
  { id: "owid", label: "OWID: Neologismenwörterbuch des Leibniz-Instituts für Deutsche Sprache", url: "https://www.owid.de/artikel/407902" },
  {
    id: "passau",
    label: "Universität Passau: Merkblatt zur Schreibnorm DIN 5008 (Sekundärquelle, die Norm selbst ist kostenpflichtig)",
    url: "https://www.uni-passau.de/fileadmin/dokumente/beschaeftigte/kommunikation_marketing/webredaktion/DIN_5008.pdf",
  },
  {
    id: "isb-leistung",
    label: "ISB: Leistungserhebungen im Fach Deutsch, Handreichung für die Realschule",
    url: "https://www.isb.bayern.de/fileadmin/user_upload/Realschule/Deutsch/Handreichung_Leistungserhebung/ISB_Leistungserhebungen_im_Fach_Deutsch.pdf",
  },
  {
    id: "isb-methoden",
    label: "ISB: Ergänzende Informationen zum LehrplanPLUS, Methoden von A bis Z",
    url: "https://www.lehrplanplus.bayern.de/sixcms/media.php/71/Erg%C3%A4nzende%20Informationen_Methoden%C3%BCbersicht.pdf",
  },
  {
    id: "isb-ueberarbeiten",
    label: "ISB: Illustrierende Aufgabe Jahrgangsstufe 9, Texte überarbeiten",
    url: "https://www.lehrplanplus.bayern.de/sixcms/media.php/72/RS_D_9_LB3_Texte_%C3%BCberarbeiten.pdf",
  },
  { id: "filmportal", label: "filmportal.de: Die unendliche Geschichte (Film, 1984)", url: "https://www.filmportal.de/en/node/37981" },
  {
    id: "heine-institut",
    label: "Heine-Institut Düsseldorf in der Deutschen Digitalen Bibliothek: Die schlesischen Weber",
    url: "https://www.deutsche-digitale-bibliothek.de/item/EAEZ56P4H2AIBXD5HY4N4UXYFO5NL27P",
  },
  {
    id: "dta",
    label: "Deutsches Textarchiv: Eichendorff, Gedichte (1837)",
    url: "https://www.deutschestextarchiv.de/book/show/eichendorff_gedichte_1837",
  },
  {
    id: "storm1881",
    label: "Theodor Storm: Eine zurückgezogene Vorrede aus dem Jahre 1881 (zur Gattung Novelle)",
    url: "https://germanhistorydocs.org/de/reichsgruendung-bismarcks-deutschland-1866-1890/theodor-storm-ueber-die-gattung-novelle-1881",
  },
  {
    id: "muehlherr",
    label: "Mühlherr: Nüsse und Hasenbraten, Heyses Falkentheorie und das Dingsymbol (2019)",
    url: "https://ojs.uni-oldenburg.de/ojs/index.php/bme/article/download/66/81/314",
  },
  { id: "freytag", label: "Gustav Freytag: Die Technik des Dramas (Projekt Gutenberg)", url: "https://www.gutenberg.org/ebooks/50616" },
  {
    id: "palincsar",
    label: "Palincsar und Brown (1984): Reciprocal teaching, Cognition and Instruction 1(2)",
    url: "https://doi.org/10.1207/s1532690xci0102_1",
  },
  { id: "unwort", label: "Unwort des Jahres: Sprachkritische Aktion", url: "https://www.unwortdesjahres.net/" },
];

export const EDITORIAL_DATE = "22. Oktober 2026";
