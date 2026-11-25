import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 1: Methoden und Arbeitstechniken. */
export const methods: Lesson[] = [
  {
    id: "g7-quellen-und-bilder",
    lb: 1,
    title: "Flugblatt oder Historienbild? Quellen kritisch prüfen",
    period: "Methode · Mittelalter bis Frühe Neuzeit",
    span: [962, 1750],
    intro:
      "Nicht jedes alte Bild und nicht jeder alte Text berichtet aus der eigenen Zeit. Erst die Frage nach Urheber, Entstehungszeit und Absicht trennt eine Quelle von späteren Deutungen.",
    paragraphs: [
      "Historikerinnen und Historiker unterscheiden streng zwischen zeitgenössischen Quellen und später entstandenen Darstellungen. Eine Bild- oder Sachquelle entsteht unmittelbar in der untersuchten Zeit, etwa ein Flugblatt aus den Jahren um 1520, ein mittelalterliches Siegel oder eine Rüstung im Stadtmuseum. Solche Zeugnisse zeigen, was Menschen damals dachten, glaubten oder bezwecken wollten.",
      "Ein Historienbild oder ein modernes Rekonstruktionsbild entsteht dagegen erst Jahrzehnte oder Jahrhunderte später. Im 19. Jahrhundert malten Künstler zum Beispiel prunkvolle Szenen von Königskrönungen, Rittern oder Martin Luther, obwohl sie nicht dabei waren. Sie übertrugen oft Wünsche und Vorstellungen ihrer eigenen Gegenwart in die Vergangenheit. Auch eine digitale 3D-Rekonstruktion einer Burg hilft beim Verstehen, ist aber eine nachträgliche Deutung auf Basis von Befunden.",
      "Darum stellst du bei jeder Quelle vorbereitete quellenkritische Fragen: Wer hat den Text verfasst oder das Bild gezeichnet? Wann und für wen ist das Stück entstanden? Welche Absicht verfolgte der Urheber, etwa Lob für einen Herrscher oder Spott über religiöse Gegner? Ein Flugblatt der Reformationszeit will zum Beispiel überzeugen und übertreiben; es bildet keine neutrale Wirklichkeit ab.",
    ],
    takeaway:
      "Zeitgenössische Bild- und Sachquellen zeigen Sichtweisen aus der untersuchten Epoche selbst; spätere Historienbilder und Rekonstruktionen deuten sie aus dem Rückblick.",
    sourceIds: ["lehrplan", "gnm", "pw-reformation"],
    quiz: check(
      "Woran erkennst du, dass ein Gemälde ein später entstandenes Geschichtsbild ist?",
      "Es wurde erst Jahrhunderte nach dem dargestellten Ereignis gemalt.",
      [
        "Es zeigt eine Szene mit Rittern, Kronen oder kirchlichen Bauwerken.",
        "Es wird heute in einer historischen Ausstellung oder im Museum gezeigt.",
      ],
      [
        "Auch mittelalterliche Handschriften und Siegel zeigen Ritter oder Kronen; das Motiv allein verrät die Entstehungszeit nicht.",
        "Im Museum liegen sowohl zeitgenössische Sachquellen als auch spätere Historienbilder.",
      ],
      "Entscheidend ist der Abstand zwischen Ereignis und Entstehungszeit des Bildes sowie die Absicht seines Urhebers.",
    ),
    diagram: {
      kind: "compare",
      title: "Quelle aus der Zeit oder späteres Geschichtsbild?",
      columns: ["Zeitgenössische Quelle", "Späteres Geschichtsbild"],
      rows: [
        {
          aspect: "Entstehungszeit",
          values: ["direkt in der untersuchten Epoche", "erst Jahrzehnte oder Jahrhunderte später"],
        },
        {
          aspect: "Beispiele",
          values: ["Flugblatt von 1521, Urkunde, Stadtsiegel", "Historienbild von 1870, Film, 3D-Modell"],
        },
        {
          aspect: "Aussagewert",
          values: ["zeigt zeitgenössische Sicht und Absicht", "spiegelt Vorstellungen der Entstehungszeit"],
        },
      ],
      caption:
        "Erst das Datum der Entstehung und die Rolle des Urhebers entscheiden, wofür ein Zeugnis als Beleg taugt.",
    },
    workshop: classify(
      "Quelle aus der Epoche oder spätere Deutung?",
      ["Zeitgenössische Quelle", "Späteres Geschichtsbild / Rekonstruktion", "Quellenkritische Frage"],
      [
        [
          "Ein Holzschnitt-Flugblatt von 1521 spottet über den Ablasshandel.",
          0,
          "Das Flugblatt entstand mitten in den Auseinandersetzungen der Reformation.",
        ],
        [
          "Ein Ölgemälde von 1882 zeigt Martin Luther vor Kaiser Karl V. in Worms.",
          1,
          "Zwischen 1521 und 1882 liegen über 360 Jahre; das Bild zeigt die Sicht des 19. Jahrhunderts.",
        ],
        [
          "Ein eiserner Stadtschlüssel aus dem 14. Jahrhundert liegt in der Museumsvitrine.",
          0,
          "Der Schlüssel ist eine originale Sachquelle aus der Zeit des mittelalterlichen Stadtrechts.",
        ],
        [
          "Eine Zeichnung im Schulbuch zeigt, wie eine Burg im Jahr 1200 wohl aussah.",
          1,
          "Eine Rekonstruktionszeichnung verbindet Grabungsbefunde mit begründeten Annahmen.",
        ],
        [
          "Welcher Auftraggeber hat den Text bestellt und wen sollte er überzeugen?",
          2,
          "Die Frage nach Urheber, Adressaten und Absicht deckt Einseitigkeiten auf.",
        ],
      ],
      "Quellenkritik prüft zuerst Zeit, Urheber und Ziel eines Zeugnisses, bevor man ihm Informationen entnimmt.",
      "In einer Ausstellung hängen zwei Bilder zum Bauernkrieg 1525 nebeneinander: ein grober Holzschnitt auf einem Flugblatt von 1525 und ein großes Ölgemälde aus dem Jahr 1895.",
    ),
    tasks: {
      1: writing(
        "Erkläre am Beispiel eines Flugblatts von 1521 und eines Gemäldes von 1882 den Unterschied zwischen Quelle und Geschichtsbild.",
        [
          "Vergleiche die Entstehungszeit beider Stücke mit dem Ereignis.",
          "Nenne mindestens zwei Fragen, die du an den Urheber des Flugblatts stellst.",
        ],
        "Das Flugblatt von 1521 ist eine zeitgenössische Bild- und Textquelle, weil es direkt in der Reformationszeit entstand. Man fragt, wer es drucken ließ, für wen es gedacht war und ob es übertreibt. Das Gemälde von 1882 ist dagegen ein späteres Geschichtsbild, das Vorstellungen des 19. Jahrhunderts in die Vergangenheit überträgt.",
        [
          "Zeitgenössische Quelle korrekt bestimmt",
          "Späteres Geschichtsbild begründet",
          "Quellenkritische Fragen an den Autor gestellt",
        ],
      ),
      2: writing(
        "Beurteile, warum eine Rekonstruktionszeichnung trotz fehlender Zeitzeugenschaft im Geschichtsunterricht sinnvoll bleibt.",
        [
          "Trenne zwischen belegten Befunden und ergänzten Details.",
          "Erkläre, wie man die Zeichnung als Lernhilfe kritisch nutzt.",
        ],
        "Eine Rekonstruktionszeichnung macht lückenhafte Überreste wie Grundmauern oder Scherben anschaulich und erleichtert das räumliche Vorstellen. Sie darf aber nicht als Foto der Vergangenheit gelesen werden, weil Dachformen, Farben oder Alltagsszenen oft ergänzt sind. Deshalb muss stets erkennbar bleiben, welche Teile durch Quellen belegt und welche vermutet sind.",
        [
          "Nutzen für die Anschauung genannt",
          "Unterschied zu Originalquellen benannt",
          "Kritischen Umgang gefordert",
        ],
      ),
    },
  },
  {
    id: "g7-perspektiven-erzaehlen",
    lb: 1,
    title: "Mehr als ein Blickwinkel: Historisches Erzählen",
    period: "Methode · Perspektivität und Narration",
    span: [1096, 1550],
    intro:
      "Wer Geschichte erzählt, wählt aus und nimmt eine Perspektive ein. Viele Darstellungen schauen nur aus christlich-europäischer Sicht – andere Stimmen fehlen dann.",
    paragraphs: [
      "Lange Zeit berichteten europäische Schulbücher die Ereignisse des Mittelalters und der Frühen Neuzeit fast nur aus Sicht christlicher Könige, Päpste oder Eroberer. So erscheint ein Kreuzzug leicht als mutiger Zug für den Glauben oder das Jahr 1492 schlicht als „Entdeckung“ Amerikas. Eine solche Erzählung nennt man christlich-eurozentrisch, weil sie Europa und das Christentum ins Zentrum setzt.",
      "Jedes historische Ereignis betrifft jedoch mehrere Gruppen gleichzeitig. In einer mittelalterlichen Stadt erlebten jüdische Familien Schutzbriefe, Abgaben und Ausgrenzung ganz anders als christliche Zunftbürger. Bei den Kreuzzügen sahen muslimische Chronisten die Kreuzfahrer als fremde Eindringlinge; 1453 trauerten byzantinische Christen um Konstantinopel, während Osmanen den Triumph ihres Sultans feierten. In Amerika bedeutete die Ankunft europäischer Schiffe für indigene Völker und später verschleppte Afrikaner Zerstörung und Zwangsarbeit.",
      "Eine tragfähige historische Narration verbindet geprüfte Fakten zu einer verständlichen Geschichte – zum Beispiel in einem Erzähltext, einem Comic oder einem Hörspielskript –, blendet aber fremde Perspektiven nicht aus. Wenn du Figuren einer anderen Kultur oder Religion sprechen lässt, darfst du keine modernen Wünsche erfinden, sondern stützt dich auf bekannte Lebensbedingungen und Quellen.",
    ],
    takeaway:
      "Historische Narrationen verknüpfen belegte Fakten aus mehreren Perspektiven und vermeiden eine rein christlich-eurozentrische Sicht.",
    sourceIds: ["lehrplan", "pw-kreuzzuege", "pw-kolonialismus"],
    quiz: check(
      "Was zeichnet eine gelungene historische Narration mit Perspektivwechsel aus?",
      "Sie stützt die Sicht verschiedener Gruppen auf historische Belege statt auf Klischees.",
      [
        "Sie erfindet beliebige Figuren ohne Rücksicht auf die Lebenswelt der damaligen Zeit.",
        "Sie übernimmt allein das Urteil der siegreichen Herrscher oder Entdecker.",
      ],
      [
        "Auch kreative Formen wie Comics oder Hörspielskripte bleiben an überprüfbare historische Fakten gebunden.",
        "Die Sicht nur einer Gruppe verengt das Bild und verschweigt Betroffene auf der Gegenseite.",
      ],
      "Gutes historisches Erzählen verknüpft belegte Tatsachen mit unterschiedlichen, quellennahen Blickwinkeln.",
    ),
    diagram: {
      kind: "steps",
      title: "Vom Ereignis zur multiperspektivischen Narration",
      steps: [
        { label: "1 · Fakten sichern", note: "Ort, Zeit und Beteiligte aus Quellen klären" },
        { label: "2 · Blickwinkel weiten", note: "Betroffene außerhalb Europas oder der Mehrheit suchen" },
        { label: "3 · Erzählung formen", note: "Spannungsbogen, Figuren oder Dialog sachgerecht bauen" },
      ],
      repeats: false,
      caption:
        "Kreativität in Comic oder Hörspiel braucht zuerst ein verlässliches Grundgerüst aus Quellen und Fakten.",
    },
    workshop: classify(
      "Welche Perspektive spricht hier?",
      ["Christlich-europäische Sicht", "Weitere zeitgenössische Perspektive", "Guter Narrationsgrundsatz"],
      [
        [
          "„Wir brachten der Neuen Welt endlich den wahren Glauben und sichere Häfen.“",
          0,
          "Diese Haltung spiegelt die Rechtfertigung europäischer Eroberer im 16. Jahrhundert.",
        ],
        [
          "„Fremde Schiffe nahmen unser Land und unsere Goldvorräte mit Gewalt in Besitz.“",
          1,
          "Diese Sicht beschreibt die Erfahrung mittel- und südamerikanischer Ureinwohner.",
        ],
        [
          "„Als jüdischer Kaufmann brauche ich einen Schutzbrief, darf aber nicht in jede Gasse ziehen.“",
          1,
          "Jüdische Bewohner erlebten mittelalterliche Städte zwischen Schutz und Ausgrenzung.",
        ],
        [
          "„Wir nennen im Hörspiel die historische Gruppe, das Jahr und stützen Gefühle auf Quellen.“",
          2,
          "So bleibt eine kreative Darstellung historisch überprüfbar.",
        ],
        [
          "„Die Franken überfielen unsere Küstenstädte überraschend und plünderten die Märkte.“",
          1,
          "Muslimische Chronisten nannten westliche Kreuzfahrer meist Franken.",
        ],
      ],
      "Erst der Vergleich mehrerer Blickwinkel zeigt, dass ein und dasselbe Ereignis sehr verschieden erlebt wurde.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum der Begriff „Entdeckung“ Amerikas 1492 für eine multiperspektivische Erzählung in Anführungszeichen steht.",
        [
          "Überlege, aus wessen Sicht Amerika 1492 „neu“ war.",
          "Nenne eine Bevölkerungsgruppe, deren Perspektive dabei oft übersehen wird.",
        ],
        "Der Begriff „Entdeckung“ beschreibt 1492 nur aus europäischer Sicht, weil Europäer diesen Erdteil zuvor nicht kannten. Für die süd- und mittelamerikanischen Ureinwohner lebten dort jedoch bereits seit Jahrtausenden eigene Hochkulturen. Die Anführungszeichen erinnern daran, diese Sicht der Indigenen und später versklavten Afrikaner einzubeziehen.",
        [
          "Eurozentrische Sicht erklärt",
          "Perspektive der Ureinwohner genannt",
          "Bedeutung der Anführungszeichen begründet",
        ],
      ),
      2: writing(
        "Entwirf die Kurzszenen-Idee für ein Hörspiel über ein Zusammentreffen um 1500, das zwei verschiedene Perspektiven sachgerecht verbindet.",
        [
          "Wähle ein konkretes Ereignis (z. B. Kreuzzug, Konstantinopel 1453, Handel in Augsburg).",
          "Zeige an zwei Figuren unterschiedliche Interessen, ohne heutige Begriffe unterzuschieben.",
        ],
        "In einem Hörspiel zu Konstantinopel 1453 sprechen ein griechischer Stadtbewohner und ein osmanischer Handwerker kurz nach der Eroberung. Der Grieche trauert um den Verlust des byzantinischen Kaiserreichs und die Umwandlung der Hagia Sophia. Der Osmane betont den Aufstieg seines Reiches zum sicheren Handelszentrum zwischen Asien und Europa.",
        [
          "Konkretes Ereignis und Jahr benannt",
          "Zwei echte Perspektiven gegenübergestellt",
          "Sachliche Begründung ohne Klischees",
        ],
      ),
    },
  },
  {
    id: "g7-karten-und-daten",
    lb: 1,
    title: "Karten, Diagramme und Schaubilder lesen",
    period: "Methode · Statistik, Grafik und Geschichtskarte",
    span: [950, 1780],
    intro:
      "Eine Zahlentabelle zur Stadtbevölkerung oder eine Karte der Seewege sagt oft mehr als viele Sätze – wenn du Legende, Maßstab und Aufbau genau entschlüsselst.",
    paragraphs: [
      "Statistiken und Diagramme fassen Mengen übersichtlich zusammen, etwa wie viele Menschen in einer mittelalterlichen Stadt als Patrizier, Handwerker oder Tagelöhner lebten oder wie stark die Bevölkerung in einer Region während des Dreißigjährigen Krieges sank. Beim Auswerten liest du zuerst Titel, Achsen, Einheiten und Zeitangaben ab, bevor du größte und kleinste Werte vergleichst.",
      "Schaubilder zeigen dagegen Beziehungen und Rangordnungen auf einen Blick. Eine Pyramide macht sichtbar, wer oben wenig zahlreich, aber mächtig war und wer unten die breite Mehrheit bildete, etwa beim Gesellschaftsaufbau der Stände oder der Lehnspyramide. Pfeile zwischen Kästen erklären Pflichten und Gegenleistungen, zum Beispiel Schutz gegen Treue und Abgaben.",
      "Geschichtskarten bilden keine Landschaft von heute ab, sondern Räume in einer bestimmten Zeit, etwa Herrschaftsgebiete, territoriale Veränderungen nach 1648 oder Entdeckungsfahrten um 1500. Jede Karte braucht den Blick auf Titel, Jahreszahl, Legende und Pfeilfarben. Erst zusammen mit deinem Wissen aus dem Text erklären Karten und Grafiken, warum sich Macht oder Handel verlagerten.",
    ],
    takeaway:
      "Diagramme, Schaubilder und Geschichtskarten erschließt du Schritt für Schritt über Titel, Zeitangabe, Einheiten, Legende und Beziehungen.",
    sourceIds: ["lehrplan", "pw-mittelalter", "pw-kolumbus"],
    quiz: check(
      "Was prüfst du bei einer Geschichtskarte zuerst, bevor du Grenzen oder Pfeile deutest?",
      "Titel, dargestelltes Jahr und die Legende mit Farben und Symbolen.",
      [
        "Welche Stadt in der Mitte der Karte am größten gedruckt ist.",
        "Ob die heutige deutsche Bundesgrenze bereits eingezeichnet wurde.",
      ],
      [
        "Schriftgrößen ohne Blick in die Legende können täuschen; erst die Legende erklärt Städtezeichen und Linien.",
        "Alte Karten zeigen gerade historische Territorien, nicht die modernen Grenzen von heute.",
      ],
      "Ohne Titel, Zeitangabe und Legende lassen sich Flächenfarben, Grenzen und Reisewege auf einer Geschichtskarte nicht zuverlässig deuten.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Beispiel eines Schaubilds: Bevölkerung in einer spätmittelalterlichen Großstadt",
      layers: [
        { label: "Patrizier und Ratsfamilien (ca. 2–5 %)", note: "Fernhändler, Grundbesitzer, politische Führung" },
        { label: "Wohlhabende Kaufleute und Meister (ca. 15–20 %)", note: "Vollbürger mit Hausbesitz und Zunftamt" },
        { label: "Einfache Handwerker und Krämer (ca. 35–40 %)", note: "kleine Werkstätten, begrenzte Rücklagen" },
        { label: "Gesellen, Mägde, Tagelöhner und Arme (ca. 40–45 %)", note: "ohne eigenes Bürgerrecht, krisenanfällig" },
      ],
      caption:
        "Richtwerte für größere Reichsstädte um 1450: Nach oben nimmt der politische Einfluss zu, nach unten die Bevölkerungszahl.",
    },
    workshop: classify(
      "Welches Werkzeug passt wozu?",
      ["Statistik / Diagramm", "Schaubild", "Geschichtskarte"],
      [
        [
          "Wie viel Prozent der Stadtbewohner besaßen im Jahr 1450 kein eigenes Haus?",
          0,
          "Prozentanteile und Mengenvergleiche liest du aus Tabellen oder Diagrammen.",
        ],
        [
          "Welche Pflichten verbanden König, Kronvasallen und Untervasallen miteinander?",
          1,
          "Machtbeziehungen und gegenseitige Pflichten zeigt ein Schaubild mit Pfeilen und Ebenen.",
        ],
        [
          "Welche Route segelte Vasco da Gama 1497/98 um die Südspitze Afrikas nach Indien?",
          2,
          "Seewege, Entfernungen und Räume im Wandel liegen auf einer Geschichtskarte.",
        ],
        [
          "Welche Gebiete verlor oder gewann ein Fürstentum durch den Westfälischen Frieden 1648?",
          2,
          "Territoriale Veränderungen zwischen zwei Zeitpunkten stellt eine Geschichtskarte dar.",
        ],
        [
          "In welchen Jahrzehnten stiegen die Getreidepreise nach Missernten besonders stark an?",
          0,
          "Zeitliche Entwicklungen von Zahlenwerten lassen sich als Kurven- oder Säulendiagramm zeigen.",
        ],
      ],
      "Jedes grafische Mittel beantwortet andere historische Fragen: Mengen im Diagramm, Strukturen im Schaubild, Räume in der Karte.",
    ),
    tasks: {
      1: writing(
        "Beschreibe am Schaubild der Stadtbevölkerung, wie sich Anteil an der Bevölkerung und politische Macht zueinander verhalten.",
        [
          "Vergleiche die oberste Schicht der Patrizier mit der untersten Gruppe.",
          "Begründe, warum eine Pyramide diese Verteilung gut zeigt.",
        ],
        "Die Patrizier bildeten nur etwa zwei bis fünf Prozent der Stadtbevölkerung, bestimmten aber den Stadtrat. Dagegen machten Gesellen, Dienstboten und Tagelöhner rund 40 bis 45 Prozent aus, besaßen aber meist kein volles Bürgerrecht. Eine Pyramide zeigt dieses Ungleichgewicht sofort über die schmale Spitze und die breite Basis.",
        [
          "Anteile korrekt aus dem Schaubild entnommen",
          "Machtverteilung verglichen",
          "Darstellungsform Pyramide erklärt",
        ],
      ),
      2: writing(
        "Erkläre, welche drei Arbeitsschritte du anwendest, wenn du im Schulbuch eine Geschichtskarte zu den Entdeckungsfahrten vervollständigen sollst.",
        [
          "Denke an Legende, Zeitangabe und die Unterscheidung von Routen und Gebieten.",
          "Beschreibe, wie Fehler bei der Beschriftung vermieden werden.",
        ],
        "Zuerst lese ich Titel und Jahreszahl der Karte, um den Zeitraum exakt einzugrenzen, etwa die Fahrten um 1492 bis 1522. Danach prüfe ich in der Legende die Farben und Linienarten für spanische und portugiesische Seewege. Erst im dritten Schritt trage ich fehlende Routen, Start- und Zielhäfen mit klarer Beschriftung in die Legende ein.",
        [
          "Titel und Zeitangabe genannt",
          "Legende und Zeichensystem geprüft",
          "Geordnetes Ergänzen der Karte beschrieben",
        ],
      ),
    },
  },
  {
    id: "g7-baustile-erkennen",
    lb: 1,
    title: "Romanik, Gotik und Barock an Bauwerken erkennen",
    period: "Methode · Bauwerke lesen",
    span: [1000, 1760],
    intro:
      "Kirchen, Dome und Schlösser erzählen ohne ein einziges geschriebenes Wort, was Bauherren glaubten und wie sie ihre Macht zeigen wollten.",
    paragraphs: [
      "Romanische Bauwerke entstanden vor allem vom 11. bis ins frühe 13. Jahrhundert. Typisch sind massive, dicke Steinmauern, kleine rundbogige Fenster, wuchtige Türme und runde Tonnen- oder Kreuzgewölbe im Inneren. Eine romanische Kirche wirkt ruhig, fest und wehrhaft wie eine „Burg Gottes“ – passend zu einer unsicheren Zeit, in der Schutz und Ordnung wichtig waren.",
      "Ab dem 12. Jahrhundert breitete sich von Frankreich ausgehend die Gotik aus. Spitzbögen, Kreuzrippengewölbe und Strebebögen an der Außenseite leiten das Gewicht des Daches gezielt ab, sodass die Wände dünner werden konnten. Hohe, lichtdurchflutete Fenster aus buntem Glas und steil aufragende Türme lenken den Blick himmelwärts in das „himmlische Licht“.",
      "Im 17. und 18. Jahrhundert prägte der Barock Kirchen und Fürstenschlösser. Statt gerader Strenge begegnen dir geschwungene Formen, prachtvolle Deckenfresken, viel Gold, Stuck, Spiegel und großzügige Treppenhäuser. Barockbauten sollten Besucher durch überwältigende Pracht beeindrucken und die Würde Gottes oder die Allmacht eines absolutistischen Fürsten vor Augen führen.",
    ],
    takeaway:
      "Romanik steht für dicke Mauern und Rundbögen, Gotik für Spitzbögen, Höhe und Licht, Barock für Pracht, Bewegung und Repräsentation.",
    sourceIds: ["lehrplan", "pw-gotik", "pw-barock", "bamberg"],
    quiz: check(
      "Welche drei Merkmale helfen dir sofort, eine gotische Kirche von einer romanischen zu unterscheiden?",
      "Spitzbögen, dünne Wände mit Strebepfeilern außen und hohe Buntglasfenster.",
      [
        "Dicke Steinmauern, kleine Rundbogenfenster und gedrungene Kreuzgewölbe.",
        "Geschwungene Fassaden, goldener Stuck und leuchtende Deckenfresken.",
      ],
      [
        "Dicke Mauern und kleine Rundbögen sind Kennzeichen der Romanik, nicht der Gotik.",
        "Geschwungene Formen, viel Gold und Deckenfresken gehören zum Barock.",
      ],
      "Die gotische Skelettbauweise verlagert das Gewicht auf Rippen und Strebepfeiler und öffnet so große Wandflächen für hohe Spitzbogenfenster.",
    ),
    diagram: {
      kind: "compare",
      title: "Drei Baustile auf einen Blick",
      columns: ["Romanik & Gotik (Mittelalter)", "Barock (17./18. Jahrhundert)"],
      rows: [
        {
          aspect: "Bogenform & Wand",
          values: ["Romanik: Rundbogen, dicke Wand · Gotik: Spitzbogen, viel Glas", "geschwungene Bögen, gegliederte Prunkfassaden"],
        },
        {
          aspect: "Raumwirkung",
          values: ["Romanik: fest und ruhig · Gotik: hoch und lichtdurchflutet", "theatralisch, weit, voller Farben, Gold und Licht"],
        },
        {
          aspect: "Funktion & Botschaft",
          values: ["Schutz Gottes bzw. Blick zum Himmel", "Überwältigung durch Pracht und fürstliche Repräsentation"],
        },
      ],
      caption:
        "An vielen Kirchen in Bayern – wie dem Bamberger Dom oder später umgestalteten Klosterkirchen – liegen mehrere Epochen übereinander.",
    },
    workshop: classify(
      "Welcher Baustil zeigt sich an diesem Merkmal?",
      ["Romanik", "Gotik", "Barock"],
      [
        [
          "Kleine, tief eingeschnittene Fenster mit Halbkreisbogen in einer dicken Bruchsteinmauer.",
          0,
          "Rundbögen und wuchtige Mauern kennzeichnen die Romanik.",
        ],
        [
          "Außen stehende Strebebögen fangen den Seitendruck eines sehr hohen Mittelschiffs ab.",
          1,
          "Das Strebewerk ermöglicht die gewaltige Höhe der Gotik.",
        ],
        [
          "Ein gewölbtes Deckenfresko öffnet optisch den Himmel voller gemalter Wolken und Figuren.",
          2,
          "Illusionsmalerei und bewegte Pracht sind typisch für den Barock.",
        ],
        [
          "Schlanke Spitzbogenfenster mit farbigem Maßwerk tauchen den Chorraum in buntes Licht.",
          1,
          "Spitzbogen und Lichtführung gehören zur Gotik.",
        ],
        [
          "Eine breite, symmetrische Schlossanlage öffnet sich zu einem geometrisch angelegten Park.",
          2,
          "Symmetrie und Gartenachse prägen barocke Residenzen.",
        ],
      ],
      "Wer Bogenform, Licht und Schmuck genau beschreibt, ordnet Bauwerke sicher seiner Epoche zu.",
    ),
    tasks: {
      1: writing(
        "Beschreibe, wie sich der Kirchenbau von der Romanik zur Gotik verändert hat und welche technische Erfindung diese Veränderung möglich machte.",
        [
          "Vergleiche Mauerdicke, Fenstergröße und Bogenform.",
          "Erkläre die Rolle von Spitzbogen und Strebewerk.",
        ],
        "Während romanische Kirchen auf dicken, geschlossenen Mauern und kleinen Rundbögen ruhen, streben gotische Kirchen hoch nach oben. Durch Spitzbögen, Kreuzrippengewölbe und äußere Strebepfeiler wurde das Gewicht des Daches gezielt abgeleitet. Dadurch konnten große Spitzbogenfenster viel farbiges Licht in den Innenraum lassen.",
        [
          "Merkmale der Romanik genannt",
          "Merkmale der Gotik genannt",
          "Statischen Grund durch Strebewerk erklärt",
        ],
      ),
      2: writing(
        "In vielen bayerischen Altstädten stehen romanische Kerne, gotische Türme und barocke Altäre im selben Bauwerk. Erkläre, wie du diese Mischung bei einem Stadtrundgang untersuchst.",
        [
          "Unterscheide Außenbau, Grundriss und Innenausstattung nach Entstehungszeit.",
          "Begründe, warum Gebäude später oft umgebaut wurden.",
        ],
        "Bei einem Besuch prüfe ich Bauabschnitte getrennt: Am Turmunterbau erkenne ich oft dicke romanische Rundbögen, am höheren Chor spitzbogige Maßwerkfenster der Gotik. Im Inneren wurden viele Kirchen im 17. oder 18. Jahrhundert barock umgestaltet, weil damalige Bischöfe oder Äbte ihren Glauben mit neuer Pracht ausdrücken wollten.",
        [
          "Bauabschnitte sauber getrennt",
          "Stilmerkmale richtig zugeordnet",
          "Historischen Grund für Umbauten genannt",
        ],
      ),
    },
  },
  {
    id: "g7-medien-recherchieren",
    lb: 1,
    title: "In Buch und Internet gezielt recherchieren",
    period: "Methode · Medienkompetenz",
    span: [1450, 2026],
    intro:
      "Im Internet und in Büchern findest du zu fast jedem Thema der Geschichte Informationen – aber nicht jeder Treffer ist zuverlässig oder passt zu deiner Frage.",
    paragraphs: [
      "Eine gute Recherche beginnt nicht mit dem ersten Klick, sondern mit einer genauen Suchfrage. Statt nur „Mittelalter“ einzugeben, suchst du gezielt nach Stichwörtern wie „Goldene Bulle 1356 Kurfürsten“ oder schaust im gedruckten Geschichtsbuch und im Sachlexikon über Inhaltsverzeichnis und Register nach. Gedruckte Nachschlagewerke sind meist von Fachleuten geprüft und knapp geordnet.",
      "Bei digitalen Angeboten musst du selbst prüfen, wem du vertraust. Seriöse Seiten wie Museen, Archive, Universitäten, die Bundeszentrale für politische Bildung, das Historische Lexikon Bayerns oder geprüfte Wissensportale nennen ihre Autoren, das Datum und die Quellen ihrer Angaben. Ungeprüfte Blogs, Foren oder anonyme Video-Clips vermischen dagegen oft Fakten, Gerüchte und Unterhaltung.",
      "Deshalb vergleichst du bei wichtigen Daten oder Urteilen mindestens zwei unabhängige, fachlich seriöse Quellen. Notiere dir sofort, woher eine Information stammt, wann die Seite zuletzt aktualisiert wurde und ob sie eine zeitgenössische Quelle zitiert oder nur eine moderne Zusammenfassung liefert.",
    ],
    takeaway:
      "Gedruckte Sachbücher und seriöse digitale Angebote erschließt du mit klaren Suchfragen, prüfst Urheber und Datum und belegst deine Funde.",
    sourceIds: ["lehrplan", "gnm", "hdbg"],
    quiz: check(
      "Woran erkennst du bei einer Internetrecherche eine fachlich seriöse Seite zur Geschichte?",
      "Sie stammt von einem Museum, Lexikon oder Archiv, nennt Autoren, Datum und Belege.",
      [
        "Sie steht in der Suchmaschine auf dem allerersten Platz und hat viele bunte Bilder.",
        "Sie beantwortet die Frage in einem kurzen Satz ohne jeden Hinweis auf Quellen.",
      ],
      [
        "Trefferreihenfolge und Bildschmuck zeigen oft Werbung oder Popularität, nicht historische Genauigkeit.",
        "Ohne Angabe von Urheber, Datum oder Belegen lässt sich eine Behauptung nicht prüfen.",
      ],
      "Impressum, fachlicher Herausgeber, Entstehungsdatum und Quellenverweise sind verlässliche Prüfmerkmale.",
    ),
    workshop: classify(
      "Suchstrategie und Quellenprüfung",
      ["Geeignet und verlässlich", "Ungeeignet oder zu ungenau"],
      [
        [
          "Du schlägst im Register des Geschichtsbuchs unter „Investiturstreit“ nach.",
          0,
          "Register und Inhaltsverzeichnis führen schnell zu geprüften Grundinformationen.",
        ],
        [
          "Du tippst nur das Wort „Burg“ ein und übernimmst den ersten Fan-Blog über Ritterfilme.",
          1,
          "Ein zu breites Stichwort und ein ungeprüfter Blog vermischen Filmfantasie mit Geschichte.",
        ],
        [
          "Du prüfst auf der Website des Germanischen Nationalmuseums ein Objekt aus dem 16. Jahrhundert.",
          0,
          "Museen und Facharchive liefern datierte und wissenschaftlich beschriebene Belege.",
        ],
        [
          "Du übernimmst ein Zitat von Martin Luther aus einem Post ohne Jahreszahl und Fundstelle.",
          1,
          "Zitate ohne Fundstelle sind oft verkürzt, falsch übersetzt oder frei erfunden.",
        ],
        [
          "Du suchst nach „Dreißigjähriger Krieg Bayern Folgen“ und vergleichst zwei Lexikonartikel.",
          0,
          "Präzise Suchbegriffe und Gegenprüfung sichern belastbare Antworten.",
        ],
      ],
      "Gute Recherche verbindet genaue Stichwörter mit bewusster Auswahl gedruckter und digitaler Fachangebote.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Prüfmerkmale, mit denen du bei einer Hausaufgabe über den Buchdruck eine seriöse Webseite von einer unsicheren Seite unterscheidest.",
        [
          "Achte auf Herausgeber, Autorennamen und Quellenangaben.",
          "Überlege, welche Einrichtungen verlässliche historische Informationen bieten.",
        ],
        "Erstens prüfe ich das Impressum, ob ein Museum wie das Gutenberg-Museum, ein Lexikon oder eine Forschungseinrichtung dahintersteht. Zweitens schaue ich nach Autor, Aktualisierungsdatum und Literatur- oder Quellenverweisen. Drittens vergleiche ich wichtige Jahreszahlen wie etwa 1450 mit meinem Geschichtsbuch.",
        [
          "Herausgeber/Impressum geprüft",
          "Autoren, Datum oder Belege genannt",
          "Gegenprüfung mit Buch oder zweiter Quelle",
        ],
      ),
      2: writing(
        "Vergleiche die Arbeit mit einem gedruckten Lexikon oder Sachbuch mit der Suche im Internet und begründe, warum sich beide ergänzen.",
        [
          "Nenne je eine Stärke von Print- und Digitalmedien.",
          "Beziehe auch die Kontrolle auf Fehler oder Werbung mit ein.",
        ],
        "Gedruckte Sachbücher und Geschichtsbücher sind redaktionell geprüft, kompakt gegliedert und frei von laufender Werbung. Digitale Archive und Museumsdatenbanken bieten dagegen aktuelle Forschungsergebnisse, hochauflösende Objektfotos und schnelle Stichwortsuchen. Wer beide verbindet, kombiniert sichere Grundlagen mit tiefen Einblicken.",
        [
          "Stärke gedruckter Medien erklärt",
          "Stärke digitaler Fachangebote erklärt",
          "Sinnvolle Verbindung beider begründet",
        ],
      ),
    },
  },
];
