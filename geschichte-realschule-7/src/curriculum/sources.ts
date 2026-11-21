import type { Source, Stage, Term } from "../model/types";

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geschichte";

const planetWissen = (path: string) => `https://www.planet-wissen.de/${path}`;

/**
 * Every link was opened on 21 November 2026 and its page title read; the
 * label names the page as it calls itself.
 */
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "ISB · LehrplanPLUS Geschichte 7 Realschule", url: CURRICULUM_URL },
  {
    id: "pw-mittelalter",
    label: "Planet Wissen · Mittelalter: Leben im Mittelalter",
    url: planetWissen("geschichte/mittelalter/leben_im_mittelalter/index.html"),
  },
  {
    id: "klexikon-otto",
    label: "Klexikon · Otto der Große",
    url: "https://klexikon.zum.de/wiki/Otto_der_Gro%C3%9Fe",
  },
  {
    id: "pw-salier",
    label: "Planet Wissen · Mittelalter: Salier",
    url: planetWissen("geschichte/mittelalter/die_salier/index.html"),
  },
  {
    id: "pw-staufer",
    label: "Planet Wissen · Mittelalter: Die Staufer",
    url: planetWissen("geschichte/mittelalter/die_staufer/index.html"),
  },
  {
    id: "pw-ritter",
    label: "Planet Wissen · Mittelalter: Ritter",
    url: planetWissen("geschichte/mittelalter/ritter/index.html"),
  },
  {
    id: "pw-gotik",
    label: "Planet Wissen · Gotik: Mittelalter",
    url: planetWissen("geschichte/mittelalter/gotik/index.html"),
  },
  {
    id: "pw-burg",
    label: "Planet Wissen · Mittelalter: Leben auf der Burg",
    url: planetWissen("geschichte/mittelalter/leben_auf_der_burg/index.html"),
  },
  {
    id: "pw-stadtarch",
    label: "Planet Wissen · Leben im Mittelalter: Stadtarchäologie",
    url: planetWissen("geschichte/mittelalter/leben_im_mittelalter/pwiestadtarchaeologie100.html"),
  },
  {
    id: "pw-kloster",
    label: "Planet Wissen · Ordensleute: Das Kloster im Mittelalter",
    url: planetWissen(
      "kultur/religion/ordensleute/pwiedersanktgallerklosterplandieidealeklosteranlage100.html",
    ),
  },
  {
    id: "pw-pest",
    label: "Planet Wissen · Leben im Mittelalter: Der Schwarze Tod",
    url: planetWissen(
      "geschichte/mittelalter/leben_im_mittelalter/pwiederschwarzetoddiepestwuetetineuropa100.html",
    ),
  },
  {
    id: "pw-kreuzzuege",
    label: "Planet Wissen · Leben im Mittelalter: Kreuzzüge",
    url: planetWissen(
      "geschichte/mittelalter/leben_im_mittelalter/pwiediekreuzzuegekriegumdieheiligestadt100.html",
    ),
  },
  {
    id: "pw-judentum",
    label: "Planet Wissen · Religion: Judentum",
    url: planetWissen("kultur/religion/judentum/index.html"),
  },
  {
    id: "pw-islam",
    label: "Planet Wissen · Religion: Islam",
    url: planetWissen("kultur/religion/islam/index.html"),
  },
  {
    id: "pw-christentum",
    label: "Planet Wissen · Religion: Christentum",
    url: planetWissen("kultur/religion/das_christentum/index.html"),
  },
  {
    id: "hlb-kurfuersten",
    label: "Historisches Lexikon Bayerns · Kurfürsten",
    url: "https://www.historisches-lexikon-bayerns.de/Lexikon/Kurf%C3%BCrsten",
  },
  {
    id: "pw-renaissance",
    label: "Planet Wissen · Neuzeit: Renaissance",
    url: planetWissen("geschichte/neuzeit/die_renaissance_das_goldene_zeitalter/index.html"),
  },
  {
    id: "pw-buchdruck",
    label: "Planet Wissen · Neuzeit: Die Erfindung des Buchdrucks",
    url: planetWissen("geschichte/neuzeit/erfindung_buchdruck/index.html"),
  },
  {
    id: "gutenberg",
    label: "Gutenberg-Museum Mainz",
    url: "https://www.mainz.de/microsite/gutenberg-museum/",
  },
  {
    id: "pw-kolumbus",
    label: "Planet Wissen · Neuzeit: Kolumbus und die Eroberung Amerikas",
    url: planetWissen("geschichte/neuzeit/entdeckung_amerikas/index.html"),
  },
  {
    id: "pw-kolonialismus",
    label: "Planet Wissen · Neuzeit: Kolonialismus",
    url: planetWissen("geschichte/neuzeit/kolonialismus/index.html"),
  },
  {
    id: "pw-luther",
    label: "Planet Wissen · Religion: Martin Luther",
    url: planetWissen("kultur/religion/martin_luther/index.html"),
  },
  {
    id: "pw-reformation",
    label: "Planet Wissen · Martin Luther: Vom Mittelalter zur Neuzeit",
    url: planetWissen("kultur/religion/martin_luther/reformation-mittelalter-neuzeit-100.html"),
  },
  {
    id: "wikisource-95",
    label: "Wikisource · Martin Luther: 95 Thesen (1517)",
    url: "https://de.wikisource.org/wiki/95_Thesen",
  },
  {
    id: "pw-bauernkrieg",
    label: "Planet Wissen · Neuzeit: Bauernkrieg 1524–1526",
    url: planetWissen("geschichte/neuzeit/der_bauernkrieg/index.html"),
  },
  {
    id: "pw-hexen",
    label: "Planet Wissen · Neuzeit: Hexenverfolgung",
    url: planetWissen("geschichte/neuzeit/hexenverfolgung/index.html"),
  },
  {
    id: "pw-dreissigj",
    label: "Planet Wissen · Neuzeit: Dreißigjähriger Krieg",
    url: planetWissen("geschichte/neuzeit/der_dreissigjaehrige_krieg/index.html"),
  },
  {
    id: "pw-barock",
    label: "Planet Wissen · Neuzeit: Barock",
    url: planetWissen("geschichte/neuzeit/barock/index.html"),
  },
  {
    id: "pw-schloesser",
    label: "Planet Wissen · Architektur: Schlösser",
    url: planetWissen("kultur/architektur/schloesser/index.html"),
  },
  {
    id: "versailles",
    label: "Château de Versailles · Site officiel",
    url: "https://en.chateauversailles.fr/",
  },
  {
    id: "schleissheim",
    label: "Bayerische Schlösserverwaltung · Neues Schloss Schleißheim",
    url: "https://www.schloesser.bayern.de/deutsch/schloss/objekte/schl_ns.htm",
  },
  {
    id: "wuerzburg",
    label: "Bayerische Schlösserverwaltung · Residenz Würzburg",
    url: "https://www.schloesser.bayern.de/deutsch/schloss/objekte/wu_res.htm",
  },
  {
    id: "bayreuth",
    label: "Bayerische Schlösserverwaltung · Markgräfliches Opernhaus Bayreuth",
    url: "https://www.schloesser.bayern.de/deutsch/schloss/objekte/bay_oper.htm",
  },
  {
    id: "nymphenburg",
    label: "Bayerische Schlösserverwaltung · Schloss Nymphenburg",
    url: "https://www.schloesser.bayern.de/deutsch/schloss/objekte/ny_schl.htm",
  },
  {
    id: "bamberg",
    label: "Bamberger Dom",
    url: "https://www.bamberger-dom.de/",
  },
  {
    id: "denkmalschutz",
    label: "Bayerisches Denkmalschutzgesetz (BayDSchG) · Bürgerservice BAYERN.RECHT",
    url: "https://www.gesetze-bayern.de/Content/Document/BayDSchG",
  },
  {
    id: "reichstag",
    label: "Deutscher Bundestag · Architektur des Reichstagsgebäudes",
    url: "https://www.bundestag.de/besuche/architektur/reichstag",
  },
  {
    id: "limes",
    label: "Deutsche Limeskommission · UNESCO-Welterbe Limes",
    url: "https://www.deutsche-limeskommission.de/",
  },
  {
    id: "pw-hanse",
    label: "Planet Wissen · Mittelalter: Hanse",
    url: planetWissen("geschichte/mittelalter/hanse/index.html"),
  },
  {
    id: "hanse",
    label: "Städtebund DIE HANSE",
    url: "https://www.hanse.org/",
  },
  {
    id: "fugger",
    label: "Offizielle Website der Fugger",
    url: "https://www.fugger.de/",
  },
  {
    id: "bpb-global",
    label: "Bundeszentrale für politische Bildung · Globalisierung",
    url: "https://www.bpb.de/themen/globalisierung/",
  },
  {
    id: "gnm",
    label: "Germanisches Nationalmuseum Nürnberg",
    url: "https://www.gnm.de/",
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
    icon: "⌕",
    hue: 210,
  },
  {
    lb: 2,
    shortTitle: "Leben und Herrschaft im Mittelalter",
    title: "Leben und Herrschaft im Mittelalter",
    icon: "♜",
    hue: 28,
    hours: 20,
  },
  {
    lb: 3,
    shortTitle: "Wandel zur Neuzeit",
    title: "Europa im Wandel vom Mittelalter zur Neuzeit",
    icon: "✦",
    hue: 165,
    hours: 8,
  },
  {
    lb: 4,
    shortTitle: "Reformation und Konfessionen",
    title: "Reformation und Konfessionalisierung",
    icon: "📜",
    hue: 345,
    hours: 8,
  },
  {
    lb: 5,
    shortTitle: "Dreißigjähriger Krieg und Absolutismus",
    title: "Das frühneuzeitliche Europa zwischen konfessioneller Auseinandersetzung und absolutistischem Herrschaftsanspruch",
    icon: "♛",
    hue: 268,
    hours: 10,
  },
  {
    lb: 6,
    shortTitle: "Bauwerke im Längsschnitt",
    title: "Bauwerke als Ausdruck politischen und religiösen Denkens (Längsschnitt)",
    icon: "🏛",
    hue: 45,
    hours: 5,
  },
  {
    lb: 7,
    shortTitle: "Handel und Kulturtransfer",
    title: "Warenaustausch und Kulturtransfer (Längsschnitt)",
    icon: "⚓",
    hue: 192,
    hours: 5,
  },
  {
    lb: 8,
    shortTitle: "Bilingual History (optional)",
    title: "Bilingualer Sachfachunterricht (optional)",
    icon: "EN",
    hue: 135,
    optional: true,
  },
];

/**
 * The Grundlegende Daten und Begriffe the plan names, under the Lernbereich
 * that names them first, each with the lesson that teaches it.
 */
export const TERMS: Term[] = [
  {
    lb: 2,
    term: "962 Kaiserkrönung Ottos des Großen",
    explanation:
      "Papst Johannes XII. krönt König Otto I. in Rom zum Kaiser; das ostfränkisch-deutsche Königtum knüpft an das römische Kaisertum an.",
    lessonId: "g7-ottonen-und-reisekoenigtum",
    year: 962,
  },
  {
    lb: 2,
    term: "um 1200 kulturelle Blüte zur Zeit der Staufer",
    explanation:
      "Unter den Stauferkaisern prägen Ritterideal, Minnesang, Burgenbau und der Übergang von der Romanik zur Gotik Kultur und Gesellschaft.",
    lessonId: "g7-staufer-ritter-architektur",
    year: 1200,
  },
  {
    lb: 2,
    term: "Grundherrschaft",
    explanation:
      "Wirtschafts- und Rechtsordnung auf dem Land: Ein Grundherr vergibt Land zur Nutzung an abhängige Bauern gegen Abgaben und Frondienste.",
    lessonId: "g7-grundherrschaft-und-staende",
  },
  {
    lb: 2,
    term: "Lehnswesen",
    explanation:
      "Politisches Treueverhältnis zwischen Lehnsherr und Vasall: Für Land oder Amt (Lehen) schuldet der Vasall dem Herrn Rat und Kriegsdienst.",
    lessonId: "g7-lehnswesen",
  },
  {
    lb: 2,
    term: "Adel",
    explanation:
      "Bevorrechtigter Geburtsstand mit Herrschaftsrechten über Grund und Leute sowie militärischen Führungsaufgaben im Mittelalter.",
    lessonId: "g7-grundherrschaft-und-staende",
  },
  {
    lb: 2,
    term: "Investiturstreit",
    explanation:
      "Machtkampf zwischen König und Papst im 11./12. Jahrhundert um das Recht, Bischöfe in ihr geistliches Amt einzusetzen (Investitur).",
    lessonId: "g7-investiturstreit",
  },
  {
    lb: 2,
    term: "Kreuzzug",
    explanation:
      "Vom Papst ausgerufener Feldzug christlicher Ritter ab 1095/1096, um Jerusalem zu erobern und die eigene Herrschaft dort zu sichern.",
    lessonId: "g7-kreuzzuege",
  },
  {
    lb: 2,
    term: "Stadtrecht",
    explanation:
      "Vom Stadtherrn verliehenes Recht, das einer Stadt Markt, eigene Gerichtsbarkeit, Befestigung und Selbstverwaltung gewährt.",
    lessonId: "g7-stadt-und-buerger",
  },
  {
    lb: 2,
    term: "Bürger",
    explanation:
      "Stadtbewohner mit Bürgerrecht, die Rechte wie Mitbestimmung und Zunftmitgliedschaft genießen, aber auch Steuern und Wachdienst leisten.",
    lessonId: "g7-stadt-und-buerger",
  },
  {
    lb: 2,
    term: "Ghetto",
    explanation:
      "Abgeschlossenes Zwangsviertel für jüdische Stadtbewohner, wie es ab der Frühen Neuzeit (Venedig 1516) eingerichtet wurde; im Mittelalter lebten Gemeinden meist in Judenvierteln oder Judengassen.",
    lessonId: "g7-juedisches-leben-mittelalter",
  },
  {
    lb: 2,
    term: "Kurfürsten",
    explanation:
      "Die sieben in der Goldenen Bulle 1356 festgelegten geistlichen und weltlichen Reichsfürsten, die den römisch-deutschen König wählen.",
    lessonId: "g7-koenig-reich-kurfuersten",
  },
  {
    lb: 2,
    term: "Stände",
    explanation:
      "Rechtlich getrennte Gruppen der mittelalterlichen Gesellschaft (Geistlichkeit, Adel sowie Bauern und Bürger) mit unterschiedlichen Pflichten.",
    lessonId: "g7-grundherrschaft-und-staende",
  },
  {
    lb: 2,
    term: "Kloster",
    explanation:
      "Gemeinschaft von Mönchen oder Nonnen nach einer Ordensregel, wichtig als Zentrum von Gebet, Bildung, Medizin und Wirtschaft.",
    lessonId: "g7-kloester",
  },
  {
    lb: 3,
    term: "1453 Eroberung Konstantinopels",
    explanation:
      "Osmanische Truppen unter Sultan Mehmed II. erobern die byzantinische Hauptstadt; ein Schlüsseldatum am Übergang vom Mittelalter zur Neuzeit.",
    lessonId: "g7-konstantinopel-1453",
    year: 1453,
  },
  {
    lb: 3,
    term: "1492 „Entdeckung“ Amerikas",
    explanation:
      "Christoph Kolumbus erreicht auf dem Westweg Amerika; für Europa beginnt die überseeische Expansion, für indigene Kulturen oft Unterdrückung.",
    lessonId: "g7-entdeckungsfahrten-1492",
    year: 1492,
  },
  {
    lb: 3,
    term: "Neuzeit",
    explanation:
      "Epoche nach dem Mittelalter seit etwa 1500, geprägt von Buchdruck, Entdeckungen, Glaubensspaltung und moderner Wissenschaft.",
    lessonId: "g7-kolonialisierung-folgen",
  },
  {
    lb: 3,
    term: "Renaissance",
    explanation:
      "„Wiedergeburt“ antiker Kunst, Sprache und Wissenschaft ab dem 14./15. Jahrhundert, verbunden mit einem neuen Blick auf den Menschen.",
    lessonId: "g7-renaissance-und-antike",
  },
  {
    lb: 4,
    term: "1517 Beginn der Reformation",
    explanation:
      "Martin Luther veröffentlicht seine 95 Thesen gegen den Ablasshandel; daraus entsteht eine Bewegung zur Erneuerung der Kirche.",
    lessonId: "g7-luther-und-1517",
    year: 1517,
  },
  {
    lb: 4,
    term: "Luther",
    explanation:
      "Martin Luther (1483–1546), Augustinermönch und Theologieprofessor in Wittenberg, dessen Kritik am Ablass die Reformation auslöste.",
    lessonId: "g7-luther-und-1517",
  },
  {
    lb: 4,
    term: "Reformation",
    explanation:
      "Bewegung des 16. Jahrhunderts zur Erneuerung der Kirche, die zur Spaltung in katholische und evangelische Konfessionen führte.",
    lessonId: "g7-luther-und-1517",
  },
  {
    lb: 5,
    term: "1618–1648 Dreißigjähriger Krieg",
    explanation:
      "Konfessioneller und machtpolitischer Großkonflikt in Mitteleuropa mit verheerenden Verwüstungen, beendet durch den Westfälischen Frieden.",
    lessonId: "g7-dreissigjaehriger-krieg",
    year: 1618,
  },
  {
    lb: 5,
    term: "17./18. Jh. Absolutismus in Europa",
    explanation:
      "Herrschaftsepoche nach dem Vorbild Frankreichs unter Ludwig XIV., in der Fürsten alle Staatsgewalt in ihrer Hand bündeln wollten.",
    lessonId: "g7-absolutismus-frankreich",
    year: 1700,
  },
  {
    lb: 5,
    term: "Westfälischer Friede",
    explanation:
      "Vertragswerk von Münster und Osnabrück (1648), das den Dreißigjährigen Krieg beendete und das europäische Staatensystem neu ordnete.",
    lessonId: "g7-westfaelischer-friede",
  },
  {
    lb: 5,
    term: "Absolutismus",
    explanation:
      "Herrschaftsform, bei der der Monarch ohne Bindung an Stände oder Parlamente Gesetze erlässt, Verwaltung lenkt und ein stehendes Heer führt.",
    lessonId: "g7-absolutismus-frankreich",
  },
  {
    lb: 5,
    term: "Hegemonie",
    explanation:
      "Vorherrschaft oder Vormachtstellung eines Staates über andere Staaten, gegen die Nachbarmächte Bündnisse („balance of power“) schmieden.",
    lessonId: "g7-hegemonie-und-balance",
  },
  {
    lb: 6,
    term: "5. Jh. v. Chr. Blütezeit Athens",
    explanation:
      "Höhepunkt der attischen Demokratie und Baukunst auf der Akropolis (Parthenon), an der sich spätere öffentliche Bauten oft orientierten.",
    lessonId: "g7-bauwerke-antike-mittelalter",
    year: -450,
  },
  {
    lb: 6,
    term: "800 Kaiserkrönung Karls des Großen",
    explanation:
      "Papst Leo III. krönt den Frankenkönig Karl in Rom zum Kaiser; Bauten wie die Aachener Pfalzkapelle zeigen diesen Herrschaftsanspruch.",
    lessonId: "g7-bauwerke-antike-mittelalter",
    year: 800,
  },
  {
    lb: 6,
    term: "Polis",
    explanation:
      "Antiker griechischer Stadtstaat, in dem Bürger über gemeinsame Angelegenheiten auf öffentlichen Plätzen und in Tempeln zusammenkamen.",
    lessonId: "g7-bauwerke-antike-mittelalter",
  },
  {
    lb: 6,
    term: "Demokratie",
    explanation:
      "Herrschaftsform, bei der die Staatsgewalt vom Volk ausgeht; transparente Parlamentsbauten wie die Reichstagskuppel drücken dies aus.",
    lessonId: "g7-bauwerke-barock-heute",
  },
  {
    lb: 6,
    term: "Monarchie",
    explanation:
      "Herrschaftsform mit einem König, Fürsten oder Kaiser an der Spitze, deren Macht sich sichtbar in Burgen, Pfalzen und Schlössern zeigt.",
    lessonId: "g7-bauwerke-antike-mittelalter",
  },
  {
    lb: 6,
    term: "König",
    explanation:
      "Gekrönter Herrscher eines Reiches; im Mittelalter reiste der König durch das Land und regierte von Pfalzen aus.",
    lessonId: "g7-bauwerke-antike-mittelalter",
  },
  {
    lb: 6,
    term: "Kaiser",
    explanation:
      "Höchster weltlicher Herrschertitel im christlichen Mittelalter, verbunden mit dem Schutzanspruch für Reich und Kirche.",
    lessonId: "g7-bauwerke-antike-mittelalter",
  },
  {
    lb: 6,
    term: "Christentum",
    explanation:
      "Weltreligion, die den Kirchenbau als Gotteshaus und geistliches Zentrum über Jahrhunderte hinweg in Romanik, Gotik und Barock prägte.",
    lessonId: "g7-bauwerke-religionen",
  },
  {
    lb: 6,
    term: "Judentum",
    explanation:
      "Älteste der drei abrahamitischen Religionen; Synagogen dienen als Orte des Gebets, des Torastudiums und der Gemeindeversammlung.",
    lessonId: "g7-bauwerke-religionen",
  },
  {
    lb: 6,
    term: "Islam",
    explanation:
      "Weltreligion mit der Moschee als Versammlungs- und Gebetsort, ausgerichtet nach Mekka und geprägt von Gebetsnische, Kuppel und Minarett.",
    lessonId: "g7-bauwerke-religionen",
  },
  {
    lb: 6,
    term: "Aristokratie",
    explanation:
      "Herrschaft einer adeligen Oberschicht, deren Macht sich auch in Palästen, Stadtresidenzen und Familienkapellen ausdrückt.",
    lessonId: "g7-bauwerke-antike-mittelalter",
  },
  {
    lb: 7,
    term: "Limes",
    explanation:
      "Befestigte und kontrollierte Grenze des Römischen Reiches zwischen Rhein und Donau, an der Handel überwacht und verzollt wurde.",
    lessonId: "g7-handel-am-limes",
  },
  {
    lb: 7,
    term: "Romanisierung",
    explanation:
      "Übernahme römischer Sprache, Bauweise, Lebensart und Güter durch die Bevölkerung in Provinzen und Grenzgebieten.",
    lessonId: "g7-handel-am-limes",
  },
  {
    lb: 7,
    term: "Provinz",
    explanation:
      "Verwaltungsbezirk im Römischen Reich außerhalb Italiens (z. B. Raetien), eng über Straßen und Handel mit Rom verbunden.",
    lessonId: "g7-handel-am-limes",
  },
  {
    lb: 7,
    term: "Mittelalter",
    explanation:
      "Epoche von etwa 500 bis 1500 n. Chr., in der Fernhandelsnetze wie die Hanse Städte über Landesgrenzen hinweg miteinander verbanden.",
    lessonId: "g7-hanse-und-fugger",
  },
];
