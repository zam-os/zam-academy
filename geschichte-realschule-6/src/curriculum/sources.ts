import type { Source, Stage, Term } from "../model/types";

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geschichte";

const planetWissen = (path: string) => `https://www.planet-wissen.de/${path}`;

/**
 * Every link was opened on 18 November 2026 and its page title read; the
 * label names the page as it calls itself.
 */
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "ISB · LehrplanPLUS Geschichte 6 Realschule", url: CURRICULUM_URL },
  {
    id: "oetzi",
    label: "Südtiroler Archäologiemuseum · Ötzi, der Mann aus dem Eis",
    url: "https://www.iceman.it/de",
  },
  {
    id: "pw-archaeologie",
    label: "Planet Wissen · Archäologie: Methoden",
    url: planetWissen("geschichte/archaeologie/methoden_der_archaeologie/index.html"),
  },
  {
    id: "archaeologie-bayern",
    label: "Archäologische Staatssammlung München",
    url: "https://www.archaeologie.bayern/",
  },
  {
    id: "manching",
    label: "kelten römer museum manching",
    url: "https://www.museum-manching.de/",
  },
  {
    id: "smaek",
    label: "Staatliches Museum Ägyptischer Kunst München (SMÄK)",
    url: "https://smaek.de/",
  },
  {
    id: "pw-pharaonen",
    label: "Planet Wissen · Antike: Pharaonen",
    url: planetWissen("geschichte/antike/pharaonen/index.html"),
  },
  {
    id: "pw-alltag-aegypten",
    label: "Planet Wissen · Pharaonen: Leben im alten Ägypten",
    url: planetWissen("geschichte/antike/pharaonen/pwiedaslebenimaltenaegypten100.html"),
  },
  {
    id: "pw-pyramiden",
    label: "Planet Wissen · Antike: Pyramidenbau",
    url: planetWissen("geschichte/antike/pyramidenbau/index.html"),
  },
  {
    id: "pw-hieroglyphen",
    label: "Planet Wissen · Antike: Hieroglyphen",
    url: planetWissen("geschichte/antike/hieroglyphen/index.html"),
  },
  {
    id: "pw-athen",
    label: "Planet Wissen · Antike: Das klassische Athen",
    url: planetWissen("geschichte/antike/das_klassische_athen/index.html"),
  },
  {
    id: "koenigsplatz",
    label: "Antike am Königsplatz · Glyptothek und Antikensammlungen München",
    url: "https://www.antike-am-koenigsplatz.mwn.de/",
  },
  {
    id: "pw-alexander",
    label: "Planet Wissen · Antike: Alexander der Große",
    url: planetWissen("geschichte/antike/alexander_der_grosse/index.html"),
  },
  {
    id: "pw-rom",
    label: "Planet Wissen · Antike: Rom",
    url: planetWissen("geschichte/antike/das_antike_rom/index.html"),
  },
  {
    id: "pw-roemerstaedte",
    label: "Planet Wissen · Antikes Rom: Römerstädte",
    url: planetWissen("geschichte/antike/das_antike_rom/pwieroemerstaedte100.html"),
  },
  {
    id: "limes",
    label: "Deutsche Limeskommission · UNESCO-Welterbe Limes",
    url: "https://www.deutsche-limeskommission.de/",
  },
  {
    id: "res-gestae",
    label: "The Latin Library · Augustus: Res Gestae (lateinischer Text)",
    url: "https://www.thelatinlibrary.com/resgestae.html",
  },
  {
    id: "plinius",
    label: "The Latin Library · Plinius, Briefe, Buch 10 (lateinischer Text)",
    url: "https://www.thelatinlibrary.com/pliny.ep10.html",
  },
  {
    id: "pw-islam",
    label: "Planet Wissen · Religion: Islam",
    url: planetWissen("kultur/religion/islam/index.html"),
  },
  {
    id: "pw-karl",
    label: "Planet Wissen · Mittelalter: Karl der Große",
    url: planetWissen("geschichte/mittelalter/karl_der_grosse/index.html"),
  },
  {
    id: "hdbg",
    label: "Haus der Bayerischen Geschichte",
    url: "https://www.hdbg.de/",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    shortTitle: "Geschichte erforschen",
    title: "Methoden und Arbeitstechniken",
    icon: "🔎",
    hue: 262,
  },
  {
    lb: 2,
    shortTitle: "Steinzeit und Kelten",
    title: "Der Mensch und seine Geschichte",
    icon: "🔥",
    hue: 18,
    hours: 8,
  },
  {
    lb: 3,
    shortTitle: "Ägypten",
    title: "Ägypten – eine frühe Hochkultur",
    icon: "🔺",
    hue: 44,
    hours: 6,
  },
  {
    lb: 4,
    shortTitle: "Griechen",
    title: "Die griechische Antike",
    icon: "🏛️",
    hue: 205,
    hours: 10,
  },
  {
    lb: 5,
    shortTitle: "Römer",
    title: "Das Imperium Romanum",
    icon: "🦅",
    hue: 352,
    hours: 12,
  },
  {
    lb: 6,
    shortTitle: "Frühmittelalter",
    title: "Von der Antike zum Frühmittelalter",
    icon: "👑",
    hue: 135,
    hours: 10,
  },
  {
    lb: 7,
    shortTitle: "Technik im Wandel",
    title: "Technik verändert das Leben der Menschen (Längsschnitt)",
    icon: "⚙️",
    hue: 178,
    hours: 5,
  },
  {
    lb: 8,
    shortTitle: "Menschen machen Geschichte",
    title: "Menschen machen Geschichte (Längsschnitt)",
    icon: "👤",
    hue: 305,
    hours: 5,
  },
];

/**
 * The Grundlegende Daten und Begriffe the plan names, under the Lernbereich
 * that names them first, each with the lesson that teaches it. The plan
 * names "753 v. Chr. mythische Gründung Roms" only in Lernbereich 7, so it
 * stands there; the Rom lesson of Lernbereich 5 teaches it.
 */
export const TERMS: Term[] = [
  {
    lb: 2,
    term: "Quelle",
    explanation:
      "Alles, was aus der Vergangenheit erhalten ist und über sie Auskunft gibt: Texte, Bilder, Gegenstände und mündliche Berichte.",
    lessonId: "g6-zeit-und-quellen",
  },
  {
    lb: 2,
    term: "Altsteinzeit",
    explanation:
      "Längste Epoche der Menschheit, vor über zwei Millionen Jahren bis etwa 10 000 v. Chr.: Menschen leben als Jäger und Sammler und ziehen umher.",
    lessonId: "g6-altsteinzeit",
  },
  {
    lb: 2,
    term: "Jungsteinzeit",
    explanation:
      "Epoche, in der Menschen sesshaft werden, Ackerbau und Viehzucht betreiben; im Vorderen Orient ab etwa 10 000 v. Chr., in Bayern ab etwa 5500 v. Chr.",
    lessonId: "g6-jungsteinzeit",
  },
  {
    lb: 3,
    term: "um 3000 v. Chr. Hochkultur in Ägypten",
    explanation:
      "Ober- und Unterägypten werden unter einem König vereinigt; Schrift, Verwaltung und Monumentalbauten entstehen am Nil.",
    lessonId: "g6-hochkultur",
    year: -3000,
  },
  {
    lb: 3,
    term: "Pharao",
    explanation:
      "Titel des ägyptischen Königs. Er galt als Sohn des Sonnengottes Re und als Garant der göttlichen Ordnung.",
    lessonId: "g6-pharao",
  },
  {
    lb: 3,
    term: "Pyramide",
    explanation:
      "Grabbau ägyptischer Könige des Alten Reiches mit quadratischem Grundriss; die größte ist die Cheops-Pyramide in Gizeh.",
    lessonId: "g6-pyramiden",
  },
  {
    lb: 4,
    term: "5. Jh. v. Chr. Blütezeit Athens",
    explanation:
      "Nach den Perserkriegen wird Athen zur führenden Seemacht; unter Perikles entstehen die Bauten der Akropolis und die Demokratie wird ausgebaut.",
    lessonId: "g6-perikles",
    year: -450,
  },
  {
    lb: 4,
    term: "Antike",
    explanation:
      "Epoche der Griechen und Römer im Mittelmeerraum, etwa von 800 v. Chr. bis um 500 n. Chr.",
    lessonId: "g6-polis",
  },
  {
    lb: 4,
    term: "Migration",
    explanation:
      "Dauerhafte Verlagerung des Wohnorts von Menschen, zum Beispiel bei der griechischen Kolonisation oder heute aus Arbeits- oder Fluchtgründen.",
    lessonId: "g6-kolonisation",
  },
  {
    lb: 4,
    term: "Polis",
    explanation:
      "Griechischer Stadtstaat: eine Stadt mit ihrem Umland, eigenen Gesetzen, Göttern und einer Bürgerschaft, die über sich selbst entscheidet.",
    lessonId: "g6-polis",
  },
  {
    lb: 4,
    term: "Verfassung",
    explanation:
      "Grundordnung eines Staates: Sie legt fest, wer herrscht, wer mitbestimmt und nach welchen Regeln entschieden wird.",
    lessonId: "g6-verfassungen",
  },
  {
    lb: 4,
    term: "Monarchie",
    explanation:
      "Herrschaft eines Einzelnen, meist eines Königs, die oft vererbt wird; Beispiele sind der Pharao in Ägypten und die frühen Könige Roms.",
    lessonId: "g6-verfassungen",
  },
  {
    lb: 4,
    term: "Aristokratie",
    explanation:
      "Herrschaft der „Besten“, in der Antike meist einer kleinen Gruppe reicher, adliger Familien.",
    lessonId: "g6-verfassungen",
  },
  {
    lb: 4,
    term: "Demokratie",
    explanation:
      "Herrschaft des Volkes. In Athen entschieden die männlichen Bürger direkt in der Volksversammlung; Frauen, Fremde und Sklaven waren ausgeschlossen.",
    lessonId: "g6-perikles",
  },
  {
    lb: 7,
    term: "753 v. Chr. mythische Gründung Roms",
    explanation:
      "Nach der Sage gründete Romulus die Stadt Rom im Jahr 753 v. Chr.; das Datum stammt aus späteren römischen Berechnungen, nicht aus Funden.",
    lessonId: "g6-rom-anfaenge",
    year: -753,
  },
  {
    lb: 5,
    term: "1. Jh. v. Chr. Übergang von der Republik zur Kaiserzeit",
    explanation:
      "Bürgerkriege zerstören die Republik; Caesar wird Diktator, Augustus begründet 27 v. Chr. die Herrschaft eines Kaisers, das Prinzipat.",
    lessonId: "g6-caesar-augustus",
    year: -50,
  },
  {
    lb: 5,
    term: "um Christi Geburt Zeitalter des Augustus",
    explanation:
      "Augustus herrscht von 27 v. Chr. bis 14 n. Chr.; nach den Bürgerkriegen folgt eine lange Friedenszeit, die Pax Augusta.",
    lessonId: "g6-caesar-augustus",
    year: 1,
  },
  {
    lb: 5,
    term: "Senat",
    explanation:
      "Rat der erfahrenen ehemaligen Amtsträger in Rom; in der Republik das mächtigste Gremium, das Außenpolitik und Finanzen lenkte.",
    lessonId: "g6-republik",
  },
  {
    lb: 5,
    term: "Republik",
    explanation:
      "Staatsform ohne König (lateinisch res publica, „öffentliche Sache“); in Rom von 509 v. Chr. bis zum Ende der Bürgerkriege.",
    lessonId: "g6-republik",
  },
  {
    lb: 5,
    term: "Diktator",
    explanation:
      "In der römischen Republik ein Amtsträger mit ganzer Macht für einen Notfall, höchstens sechs Monate lang; Caesar ließ sich 44 v. Chr. zum Diktator auf Lebenszeit machen.",
    lessonId: "g6-republik",
  },
  {
    lb: 5,
    term: "Caesar",
    explanation:
      "Gaius Julius Caesar, Feldherr und Politiker (100 bis 44 v. Chr.); sein Name wurde zum Titel der Herrscher und lebt im Wort „Kaiser“ fort.",
    lessonId: "g6-caesar-augustus",
  },
  {
    lb: 5,
    term: "Limes",
    explanation:
      "Befestigte Grenze des Römischen Reiches; der Obergermanisch-Raetische Limes verläuft auch durch Bayern und ist UNESCO-Welterbe.",
    lessonId: "g6-provinzen",
  },
  {
    lb: 5,
    term: "Judentum",
    explanation:
      "Älteste der drei großen Religionen, die an einen einzigen Gott glauben; Grundlage sind die Tora und die Geschichte des Volkes Israel.",
    lessonId: "g6-juden",
  },
  {
    lb: 5,
    term: "Christentum",
    explanation:
      "Religion, die sich auf Jesus Christus beruft; zuerst verfolgt, wurde es 380 n. Chr. Staatsreligion im Römischen Reich.",
    lessonId: "g6-christentum",
  },
  {
    lb: 5,
    term: "Romanisierung",
    explanation:
      "Übernahme römischer Sprache, Lebensweise, Bauweise und Rechtsordnung durch die Bewohner der Provinzen.",
    lessonId: "g6-provinzen",
  },
  {
    lb: 5,
    term: "Provinz",
    explanation:
      "Von Rom erobertes und verwaltetes Gebiet außerhalb Italiens mit einem römischen Statthalter, zum Beispiel Raetien mit der Hauptstadt Augsburg.",
    lessonId: "g6-provinzen",
  },
  {
    lb: 6,
    term: "um 500 Reichsbildung der Franken",
    explanation:
      "Der Merowinger Chlodwig vereint die fränkischen Gruppen, erobert das restliche römische Gallien und lässt sich katholisch taufen.",
    lessonId: "g6-franken",
    year: 500,
  },
  {
    lb: 6,
    term: "800 Kaiserkrönung Karls des Großen",
    explanation:
      "Papst Leo III. krönt den Frankenkönig Karl am 25. Dezember 800 in Rom zum Kaiser.",
    lessonId: "g6-karl",
    year: 800,
  },
  {
    lb: 6,
    term: "Islam",
    explanation:
      "Religion, die sich auf den Propheten Mohammed (um 570 bis 632) und den Koran beruft; sie breitete sich nach seinem Tod rasch aus.",
    lessonId: "g6-islam",
  },
  {
    lb: 6,
    term: "Mittelalter",
    explanation:
      "Epoche zwischen Antike und Neuzeit, etwa von 500 bis 1500 n. Chr.",
    lessonId: "g6-untergang-roms",
  },
  {
    lb: 6,
    term: "König",
    explanation:
      "Herrscher über ein Volk oder Reich; bei den Franken stützte er sich auf seine Gefolgsleute und die Kirche.",
    lessonId: "g6-franken",
  },
  {
    lb: 6,
    term: "Kaiser",
    explanation:
      "Herrscher, der über Könige gestellt ist; der Titel geht auf die römischen Kaiser zurück und wurde 800 mit Karl im Westen erneuert.",
    lessonId: "g6-karl",
  },
  {
    lb: 6,
    term: "Karl der Große",
    explanation:
      "Frankenkönig ab 768 und Kaiser ab 800; er herrschte über ein Großreich von der Nordsee bis Mittelitalien und starb 814.",
    lessonId: "g6-karl",
  },
];
