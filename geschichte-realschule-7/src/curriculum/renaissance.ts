import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 3: Europa im Wandel vom Mittelalter zur Neuzeit. */
export const renaissance: Lesson[] = [
  {
    id: "g7-renaissance-und-antike",
    lb: 3,
    title: "Renaissance: Wiedergeburt der Antike",
    period: "Wandel zur Neuzeit · 14. bis 16. Jahrhundert",
    span: [1350, 1560],
    intro:
      "In den oberitalienischen Städten entdeckten Gelehrte und Künstler alte römische und griechische Werke neu – und schufen aus dieser Begegnung etwas völlig Neues.",
    paragraphs: [
      "Der französische Begriff „Renaissance“ bedeutet Wiedergeburt und meint das bewusste Wiederaufleben von Kunst, Sprache, Baukunst und Wissenschaft der griechisch-römischen Antike. In wohlhabenden Handelsstädten wie Florenz und Venedig gruben Gelehrte vergessene Handschriften aus Klosterbibliotheken wieder aus, lasen römische Autoren im Original und studierten antike Ruinen.",
      "Diese Bewegung des Humanismus begnügte sich nicht damit, Altes bloß nachzumachen. Baumeister berechneten Säulen, Kuppeln und Zentralperspektive nach antiken Proportionsregeln neu, Bildhauer studierten die Anatomie des menschlichen Körpers genau. Aus der bewussten Rückbesinnung auf antike Vorbilder wuchs der Mut, auch bestehende Ordnungen des Mittelalters kritisch zu prüfen.",
      "Die Rezeption der Antike zeigt bis heute, warum die Beschäftigung mit Vergangenem für die Gegenwart fruchtbar ist: Frühere Fragen nach Demokratie, Recht, Baukunst und menschlicher Vernunft liefern Denkanstöße, an denen jede Epoche eigene Antworten messen kann. Neues entsteht fast nie aus dem Nichts, sondern oft im lebendigen Gespräch mit der Geschichte.",
    ],
    takeaway:
      "In der Renaissance ermöglichte der Rückgriff auf die Antike in Kunst, Architektur und Wissenschaft tiefgreifenden Fortschritt und neuen Wandel.",
    sourceIds: ["lehrplan", "pw-renaissance", "gnm"],
    quiz: check(
      "Warum bezeichnet man den geistigen Umbruch ab dem 14./15. Jahrhundert als „Renaissance“?",
      "Weil Kunst und Wissenschaft bewusst an die griechisch-römische Antike anknüpften.",
      [
        "Weil Städte im Mittelalter alle antiken Bauwerke aus Stein abreißen ließen.",
        "Weil Kaufleute damals den Buchhandel und alle Universitäten in Europa schlossen.",
      ],
      [
        "Antike Ruinen und Statuen wurden im Gegenteil vermessen, gesammelt und als Vorbilder studiert.",
        "Humanisten gründeten neue Schulen und nutzten Universitäten sowie Druckereien für neue Texte.",
      ],
      "„Renaissance“ (Wiedergeburt) meint die Wiederentdeckung antiker Ideen, Formen und Quellentexte als Sprungbrett für Neues.",
    ),
    diagram: {
      kind: "compare",
      title: "Antike Vorbilder als Motor der Renaissance",
      columns: ["Was man in der Antike fand", "Was die Renaissance daraus machte"],
      rows: [
        {
          aspect: "Architektur",
          values: ["Säulen, Rundbögen, Kuppeln des alten Rom", "harmonische Paläste und Kuppeln wie in Florenz"],
        },
        {
          aspect: "Sprachen & Texte",
          values: ["lateinische, griechische und hebräische Handschriften", "kritisches Prüfen von Originaltexten („Zu den Quellen!“)"],
        },
        {
          aspect: "Malerei & Skulptur",
          values: ["naturgetreue antike Statuen", "Zentralperspektive, Licht-Schatten und genaue Anatomie"],
        },
      ],
      caption:
        "Humanisten kopierten die Antike nicht blind, sondern nutzten ihre Maßstäbe, um eigene Fragen neu zu stellen.",
    },
    workshop: classify(
      "Wie die Renaissance Vergangenes aufgriff",
      ["Antikes Vorbild", "Erneuerung in der Renaissance"],
      [
        [
          "In Rom stehen gewaltige antike Tempelkuppeln und Säulenordnungen.",
          0,
          "Die erhaltenen Monumente der Antike dienten Künstlern als Anschauungsmaterial.",
        ],
        [
          "Künstler in Florenz entwickeln die mathematische Zentralperspektive für räumliche Gemälde.",
          1,
          "Optik und Geometrie machten Gemälde realistischer als jemals zuvor.",
        ],
        [
          "Gelehrte prüfen mittelalterliche Übersetzungen anhand griechischer Originaltexte auf Fehler.",
          1,
          "Textkritik nach dem Motto „ad fontes“ (zu den Quellen) veränderte Wissenschaft und Kirche.",
        ],
        [
          "Römische Schriftsteller wie Cicero diskutierten Bürgerpflichten und vernünftiges Argumentieren.",
          0,
          "Antike Philosophie lieferte Ideen für städtische Selbstverwaltung und Bildung.",
        ],
        [
          "Kaufleute und Fürsten stiften Gemälde, Bibliotheken und Kunstsammlungen zur Förderung von Talenten.",
          1,
          "Städte wie Florenz und Augsburg wurden zu Brennpunkten des Humanismus.",
        ],
      ],
      "Wer sich ernsthaft mit der Vergangenheit auseinandersetzt, gewinnt Maßstäbe für die eigene Gegenwart.",
    ),
    tasks: {
      1: writing(
        "Erkläre, was Humanismus und Renaissance mit der Antike verband und wie daraus Fortschritt entstand.",
        [
          "Übersetze das Wort Renaissance und nenne zwei Bereiche, in denen antike Vorbilder genutzt wurden.",
          "Zeige an einem Beispiel, was darüber hinaus neu entstand.",
        ],
        "Renaissance heißt „Wiedergeburt“ und beschreibt die Rückbesinnung auf die Kunst, Literatur und Wissenschaft der griechischen und römischen Antike. Gelehrte und Künstler sammelten alte Handschriften und vermaßen antike Bauten. Daraus entwickelten sie neue Leistungen wie die Zentralperspektive in der Malerei, kritische Quellenprüfung und genauere Naturbeobachtung.",
        [
          "Begriff Renaissance erklärt",
          "Antikenbezug in zwei Bereichen genannt",
          "Eigenen Fortschritt über Nachahmung hinaus benannt",
        ],
      ),
      2: writing(
        "Begründe am Beispiel der Renaissance, warum das Studium von Vergangenheit für unsere heutige Gegenwart wertvoll sein kann.",
        [
          "Nenne ein Beispiel, wie vergangene Erfahrungen heutige Ideen anstoßen.",
          "Erkläre, warum man Vergangenes dennoch kritisch prüfen muss.",
        ],
        "Die Renaissance zeigt, dass Rückblick auf frühere Kulturen eingefahrene Gewohnheiten aufbrechen kann, weil man Alternativen entdeckt. Auch heute helfen historische Vorbilder und Irrtümer dabei, Fragen von Rechtsstaat, Wissenschaft oder Baukunst besser einzuschätzen. Zugleich prüft man Überliefertes heute wie damals kritisch, statt es unbesehen zu übernehmen.",
        [
          "Bedeutung der Vergangenheit als Denkanstoß erklärt",
          "Bezug zur Gegenwart hergestellt",
          "Kritische Prüfung betont",
        ],
      ),
    },
  },
  {
    id: "g7-menschenbild-und-wissenschaft",
    lb: 3,
    title: "Neues Menschen- und Weltbild: Leonardo und Galilei",
    period: "Wandel zur Neuzeit · 15. bis 17. Jahrhundert",
    span: [1452, 1642],
    intro:
      "Im Mittelalter blickte man vor allem auf Gottes Jenseits und die überlieferte Bibelauslegung. In der Renaissance rückte der Mensch als Entdecker ins Zentrum – bis hin zu den Sternen.",
    paragraphs: [
      "Mit dem Humanismus wandelte sich das Menschenbild tiefgreifend. Statt den einzelnen Menschen nur als sündiges Wesen innerhalb seines Geburtsstandes zu sehen, betonten Gelehrte seine Vernunft, Kreativität und Selbstverantwortung. Künstler unterzeichneten nun selbstbewusst ihre Werke und malten lebensnahe Porträts einzelner Persönlichkeiten.",
      "Ein berühmtes Beispiel für diesen Forschergeist ist Leonardo da Vinci (1452–1519). Als Maler, Bildhauer, Anatom, Ingenieur und Erfinder glaubte er nichts ungeprüft, sondern beobachtete Wasserwirbel, Vogelflug, Muskeln und Zahnräder bis ins kleinste Detail und hielt alles in tausenden Skizzen fest. Erfahrung, Zeichnung und Experiment traten neben die alten Bücher.",
      "Auch das Weltbild geriet in Bewegung. Lange galt das geozentrische Modell, nach dem die Erde fest im Mittelpunkt des Alls steht. Nikolaus Kopernikus berechnete jedoch das heliozentrische System mit der Sonne im Zentrum, und Galileo Galilei (1564–1642) bestätigte es durch eigene Fernrohrbeobachtungen der Jupitermonde und Venusphasen. Obwohl die kirchliche Inquisition ihn 1633 zum Widerruf zwang, prägt diese Methode – Beobachten, Messen, Rechnen – bis heute unsere moderne Wissenschaft.",
    ],
    takeaway:
      "Das Menschen- und Weltbild der Renaissance stellte Vernunft, eigene Beobachtung und Experiment ins Zentrum – die Grundlage moderner Naturwissenschaft.",
    sourceIds: ["lehrplan", "pw-renaissance"],
    quiz: check(
      "Welche Arbeitsweise verband Forscher der Renaissance und frühen Neuzeit wie Leonardo da Vinci und Galileo Galilei mit unserer heutigen Wissenschaft?",
      "Eigene Beobachtung, Experimente und mathematische Berechnung statt ungeprüfter Übernahme alter Lehren.",
      [
        "Das Verbot, Fernrohre oder Skizzenbücher in Städten und Universitäten zu verwenden.",
        "Die Rückkehr zu der Annahme, alle Krankheiten entstünden allein durch schlechte Luft.",
      ],
      [
        "Gerade Galilei baute und verbesserte Fernrohre, um Jupitermonde selbst zu beobachten.",
        "Leonardo da Vinci sezierte Körper und skizzierte Organe genau, um alte Medizinbücher durch eigene Anschauung zu prüfen.",
      ],
      "Messen, genaues Beobachten und Überprüfen durch Experimente bilden bis heute den Kern naturwissenschaftlicher Erkenntnis.",
    ),
    workshop: classify(
      "Mittelalterliche Sicht oder neues Welt- und Menschenbild?",
      ["Überliefertes Welt- und Menschenbild", "Neues Menschen- und Weltbild (ab Renaissance)"],
      [
        [
          "Die Erde ruht unbeweglich in der Mitte der Schöpfung, und alle Gestirne kreisen um sie.",
          0,
          "Das geozentrische Weltbild galt über ein Jahrtausend als unumstößlich.",
        ],
        [
          "Ein Forscher richtet ein selbst geschliffenes Fernrohr auf die Jupitermonde und notiert ihre Bahnen.",
          1,
          "Galileo Galilei prüfte Behauptungen durch eigene Beobachtungen und Messungen.",
        ],
        [
          "Ein Künstler zeichnet Muskeln und Sehnen nach eigenen Untersuchungen statt nach alten Vorlagen.",
          1,
          "Leonardo da Vinci setzte unmittelbare Naturbeobachtung über bloße Autorität.",
        ],
        [
          "Gelehrte deuten Naturvorgänge vor allem über überlieferte Schriften, ohne selbst nachzumessen.",
          0,
          "Vor der Naturforschung der Neuzeit zählte die Autorität alter Texte oft mehr als eigene Versuche.",
        ],
        [
          "Begabung, Bildung und eigenes Können bestimmen den Ruhm eines Meisters stärker als seine adlige Herkunft.",
          1,
          "Das neue Menschenbild betonte die Würde und Schaffenskraft des einzelnen Individuums.",
        ],
      ],
      "In den Skizzen Leonardos und den Berechnungen Galileis zeigen sich bereits wesentliche Züge unseres heutigen Denkens.",
    ),
    tasks: {
      1: writing(
        "Erkläre am Beispiel von Leonardo da Vinci und Galileo Galilei, was sich am Menschen- und Weltbild seit der Renaissance veränderte.",
        [
          "Beschreibe, wie Leonardo forschte und malte.",
          "Erkläre den Wechsel vom geozentrischen zum heliozentrischen Weltbild bei Galilei.",
        ],
        "Leonardo da Vinci verließ sich nicht nur auf alte Bücher, sondern erforschte Körper, Naturkräfte und Maschinen durch genaue eigene Beobachtung und Zeichnung. Das zeigte ein neues Vertrauen in die Fähigkeiten des einzelnen Menschen. Galileo Galilei beobachtete mit dem Fernrohr den Himmel und stützte das heliozentrische Weltbild, nach dem sich die Erde um die Sonne bewegt – durch Beobachten und Rechnen entstand moderne Wissenschaft.",
        [
          "Beispiel Leonardo mit Naturbeobachtung erklärt",
          "Beispiel Galilei mit heliozentrischem Weltbild erklärt",
          "Bedeutung für das moderne Denken gezeigt",
        ],
      ),
      2: writing(
        "Galileo Galilei musste 1633 vor einem Kirchengericht seine Lehre widerrufen, dass die Erde sich um die Sonne dreht. Begründe, warum sich seine Methode langfristig dennoch durchsetzte.",
        [
          "Überlege, was wiederholbare Beobachtungen durch ein Fernrohr und den Buchdruck von Meinungen unterscheidet.",
          "Beziehe den heutigen Umgang mit wissenschaftlichen Ergebnissen mit ein.",
        ],
        "Ein erzwungener Widerruf konnte das, was jeder Beobachter durch ein gutes Fernrohr selbst am Himmel nachprüfen konnte, nicht ungeschehen machen. Da Forschungsergebnisse durch den Buchdruck europaweit verbreitet wurden, wiederholten andere Gelehrte die Messungen und bestätigten sie. Wissenschaftliche Erkenntnis setzt sich langfristig durch Belege und Nachprüfbarkeit durch, nicht durch Machtworte.",
        [
          "Rolle von Nachprüfbarkeit und Messung erklärt",
          "Verbreitung über den Buchdruck erwähnt",
          "Unterschied zwischen Machtanspruch und Beleg begründet",
        ],
      ),
    },
  },
  {
    id: "g7-buchdruck",
    lb: 3,
    title: "Gutenbergs Buchdruck und die digitale Revolution",
    period: "Medienrevolution · ab ca. 1450 bis heute",
    span: [1450, 2026],
    intro:
      "Bis um 1450 dauerte das Abschreiben einer einzigen Bibel Monate. Mit beweglichen Metalllettern beschleunigte Johannes Gutenberg die Verbreitung von Wissen dramatisch – ähnlich wie heute das Internet.",
    paragraphs: [
      "Vor der Mitte des 15. Jahrhunderts waren Bücher seltene Kostbarkeiten. In klösterlichen Schreibstuben kopierten Schreiber Seite für Seite von Hand auf teures Pergament, sodass selbst Universitäten oft nur wenige Dutzend Bände besaßen. Wissen verbreitete sich langsam und blieb meist Gelehrten und Klerikern vorbehalten.",
      "Um 1450 entwickelte Johannes Gutenberg in Mainz ein entscheidendes Gesamtsystem: bewegliche, gegossene Metalllettern für jeden einzelnen Buchstaben, eine geeignete ölige Druckerschwärze und eine mechanische Druckerpresse nach dem Vorbild von Weinpressen. Zusammen mit günstigerem Papier ließen sich Seiten nun beliebig oft setzen, drucken und neu ordnen. Binnen weniger Jahrzehnte entstanden in hunderten europäischen Städten Druckereien; statt weniger Handschriften erschienen Millionen Bücher, Flugblätter und Nachrichten.",
      "Diese Medienrevolution veränderte Politik, Kirche, Bildung und Sprache tiefgreifend. Ideen der Renaissance und später der Reformation erreichten in Tagen statt Jahren tausende Menschen, Lesen lernen wurde wichtiger, und eine einheitlichere deutsche Schriftsprache setzte sich allmählich durch. Der Vergleich mit der digitalen Revolution am Beginn des 21. Jahrhunderts liegt nahe: Internet und Smartphones machen Wissen sekundenschnell weltweit zugänglich, fordern uns aber wie einst die Flugschriftenflut dazu heraus, verlässliche Informationen von Falschmeldungen zu trennen.",
    ],
    takeaway:
      "Gutenbergs Buchdruck mit beweglichen Metalllettern machte Wissen um 1450 erstmals massenhaft verfügbar und ähnelt in seiner Wirkung der digitalen Revolution heute.",
    sourceIds: ["lehrplan", "pw-buchdruck", "gutenberg"],
    quiz: check(
      "Worin lag das entscheidende Neue an Johannes Gutenbergs Druckverfahren um 1450?",
      "Bewegliche, gegossene Metalllettern ließen sich immer wieder zu neuen Texten zusammensetzen.",
      [
        "Er erfand erstmals in Europa das handgeschriebene Buch auf dünnem Pergament.",
        "Er ließ fertige Holztafeln unveränderbar für jeweils nur ein einziges Gebetbuch schnitzen.",
      ],
      [
        "Handgeschriebene Bücher auf Pergament gab es schon viele Jahrhunderte vor Gutenberg.",
        "Unbewegliche Holztafeldrucke waren in Asien und Europa bereits früher bekannt, aber zu starr für schnelle Massenauflagen langer Bücher.",
      ],
      "Gießinstrument, bewegliche Bleilettern, Druckfarbe und Spindelpresse ermöglichten schnellen Druck in hohen Auflagen.",
    ),
    diagram: {
      kind: "steps",
      title: "Wie eine Medienrevolution die Gesellschaft verändert",
      steps: [
        { label: "1 · Technik & Kosten", note: "bewegliche Lettern und Papier senken Preis und Zeit pro Buch stark" },
        { label: "2 · Schnelle Verbreitung", note: "Flugblätter, Bibelübersetzungen und Lehrbücher erreichen viele Städte" },
        { label: "3 · Wandel der Gesellschaft", note: "mehr Menschen lernen lesen, Debatten um Glauben und Wissen wachsen" },
      ],
      repeats: false,
      caption:
        "Vom Buchdruck um 1450 bis zum Internet im 21. Jahrhundert verändert schnellere Verbreitung stets, wer mitsprechen kann.",
    },
    workshop: classify(
      "Buchdruck um 1500 und digitale Revolution heute",
      ["Buchdruck um 1450–1550", "Digitale Revolution im 21. Jh.", "Gemeinsame Herausforderung beider Zeiten"],
      [
        [
          "Flugblätter in hoher Auflage verbreiten innerhalb weniger Wochen Luthers Thesen im ganzen Reich.",
          0,
          "Gedruckte Flugblätter machten politische und religiöse Streitfragen erstmals zum Massenthema.",
        ],
        [
          "Informationen, Bilder und Videos erreichen über Glasfaser und Smartphones jeden Kontinent in Sekunden.",
          1,
          "Digitale Netze übertragen Inhalte nahezu ohne Zeitverlust und Druckkosten.",
        ],
        [
          "Flugschriften und Netzbeiträge verbreiten neben Wissen auch Gerüchte, Spott und Falschbehauptungen.",
          2,
          "In beiden Medienrevolutionen muss jeder Einzelne lernen, Quellen kritisch zu prüfen.",
        ],
        [
          "Gegossene Einzelbuchstaben aus Metall werden im Winkelhaken zu einer Druckseite zusammengesetzt.",
          0,
          "Bewegliche Lettern waren der technische Kern von Gutenbergs Werkstatt.",
        ],
        [
          "Jede Nutzerin und jeder Nutzer kann ohne eigene Druckerei weltweit selbst Texte veröffentlichen.",
          1,
          "Anders als im 16. Jahrhundert braucht man heute für eine Veröffentlichung keine Druckgenehmigung oder Werkstatt mehr.",
        ],
      ],
      "Der historische Blick zeigt: Neue Medien bringen Freiheit und Streit zugleich – Medienkompetenz bleibt unverzichtbar.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie Gutenbergs Erfindung um 1450 funktionierte und welche drei gesellschaftlichen Folgen der Buchdruck hatte.",
        [
          "Nenne das Prinzip der beweglichen Metalllettern und Druckerpresse.",
          "Denke an Buchpreise, Lesefähigkeit und Verbreitung neuer Ideen.",
        ],
        "Johannes Gutenberg nutzte wiederverwendbare, gegossene Metalllettern, die schnell zu Seiten zusammengesetzt und mit einer Druckerpresse vervielfältigt wurden. Dadurch sanken die Preise für Bücher stark, viel mehr Menschen lernten lesen, und neue Ideen der Renaissance und Reformation verbreiteten sich rasant in ganz Europa.",
        [
          "Technisches Prinzip korrekt beschrieben",
          "Drei gesellschaftliche Folgen genannt",
          "Zusammenhang zwischen Technik und Wissen erklärt",
        ],
      ),
      2: writing(
        "Vergleiche die Folgen des Buchdrucks mit den Chancen und Risiken der digitalen Revolution am Beginn des 21. Jahrhunderts.",
        [
          "Nenne mindestens eine deutliche Gemeinsamkeit und einen wichtigen Unterschied.",
          "Beurteile, welche Fähigkeit heute besonders nötig bleibt.",
        ],
        "Beide Revolutionen senkten die Hürden für Zugang zu Wissen enorm und lösten stürmische gesellschaftliche Debatten aus. Während der Buchdruck jedoch an Werkstätten, Papier und Obrigkeit gebunden war und Tage oder Wochen brauchte, verbreitet das Internet Beiträge in Sekunden von jedem Smartphone aus. Heute wie damals gilt als entscheidende Aufgabe, verlässliche Quellen von Gerüchten zu unterscheiden.",
        [
          "Gemeinsamkeit in Wissenszugang und Debatten gezeigt",
          "Unterschied bei Tempo oder Zugang genannt",
          "Notwendigkeit kritischer Quellenprüfung begründet",
        ],
      ),
    },
  },
  {
    id: "g7-konstantinopel-1453",
    lb: 3,
    title: "1453: Die Eroberung Konstantinopels",
    period: "Wandel zur Neuzeit · 15. Jahrhundert",
    span: [1450, 1460],
    intro:
      "Am 29. Mai 1453 fiel das christliche Oströmische Reich an den osmanischen Sultan Mehmed II. Ein und derselbe Tag gilt den einen als Katastrophe, den anderen als glanzvoller Neuanfang.",
    paragraphs: [
      "Fast tausend Jahre länger als Westrom hatte das Oströmische oder Byzantinische Reich um seine Hauptstadt Konstantinopel am Bosporus fortbestanden. Doch im 15. Jahrhundert schrumpfte das einst riesige Reich auf die Stadt selbst und kleine Gebiete, während das islamische Osmanische Reich von Kleinasien und dem Balkan her immer mächtiger heranwuchs.",
      "Im Frühjahr 1453 belagerte der junge osmanische Sultan Mehmed II. Konstantinopel mit einem großen Heer, einer Flotte und gewaltigen Kanonen, die schließlich Breschen in die berühmten Theodosianischen Mauern schossen. Nach hartem Kampf fiel die Stadt am 29. Mai 1453; der letzte byzantinische Kaiser Konstantin XI. kam bei der Verteidigung ums Leben. Mehmed II. erhob die Stadt zur neuen Hauptstadt des Osmanischen Reiches und wandelte die Hauptkirche Hagia Sophia in eine Moschee um.",
      "Die Beurteilung des Jahres 1453 hängt stark von der eigenen Perspektive ab. Für christliche Zeitgenossen in Europa war der Fall der Stadt ein Schock; viele griechische Gelehrte flohen nach Italien und brachten dort wertvolle antike Handschriften in die Renaissance ein. Zugleich kontrollierten die Osmanen nun wichtige Land- und Seehandelswege nach Asien, was Westeuropa zusätzlich anspornte, direkte Seewege nach Indien zu suchen. Für das Osmanische Reich begann mit dem neuen Zentrum am Bosporus dagegen eine Epoche politischer und kultureller Blüte.",
    ],
    takeaway:
      "1453 eroberte das Osmanische Reich Konstantinopel; je nach Perspektive bedeutete das den Untergang Ostroms, einen Impuls für Renaissance und Seefahrt oder den Aufstieg einer neuen Weltmacht.",
    sourceIds: ["lehrplan", "pw-renaissance", "pw-islam"],
    quiz: check(
      "Warum wird das Jahr 1453 in der Geschichtsschreibung kontrovers bewertet?",
      "Für das Byzantinische Reich war es das Ende, für das Osmanische Reich ein glanzvoller Aufstieg.",
      [
        "Weil bis heute nicht geklärt ist, ob Konstantinopel jemals eine Hauptstadt besessen hat.",
        "Weil Christen und Osmanen sich bereits 1454 friedlich über eine gemeinsame Krönung einigten.",
      ],
      [
        "Konstantinopel war seit Kaiser Konstantin über tausend Jahre hinweg eindeutig das Zentrum Ostroms.",
        "Der Kampf um Südosteuropa und das Mittelmeer setzte sich nach 1453 noch über zwei Jahrhunderte fort.",
      ],
      "Dasselbe Datum erscheint je nach Standort als Untergang, Wissensschub für Italien oder Großmachtaufstieg.",
    ),
    workshop: classify(
      "Wie 1453 aus verschiedenen Perspektiven beurteilt wird",
      ["Byzantinische / westeuropäische Sicht", "Osmanische Sicht", "Langfristige Folge für Europa"],
      [
        [
          "Mit dem Tod Kaiser Konstantins XI. geht das über tausendjährige christliche Ostrom unter.",
          0,
          "Für Byzanz und viele europäische Fürsten war der Verlust ein schwerer Schock.",
        ],
        [
          "Sultan Mehmed II. sichert den Bosporus und macht die Stadt zum glänzenden Zentrum seines Weltreichs.",
          1,
          "In der osmanischen Überlieferung heißt Mehmed II. „der Eroberer“ (Fatih).",
        ],
        [
          "Griechische Gelehrte retten antike Bücher nach Italien und beflügeln dort den Humanismus.",
          2,
          "Die Flucht von Gelehrten verstärkte das Interesse an griechischer Sprache und Antike in Westeuropa.",
        ],
        [
          "Westeuropäische Kaufleute zahlen hohe Zölle im östlichen Mittelmeer und suchen neue Seewege nach Asien.",
          2,
          "Der Wunsch, Zwischenhändler zu umgehen, beschleunigte portugiesische und spanische Entdeckungsfahrten.",
        ],
        [
          "Unter osmanischer Herrschaft wird die zerstörte Stadt wieder besiedelt und prächtig ausgebaut.",
          1,
          "Konstantinopel – später oft Istanbul genannt – wuchs schnell wieder zu einer der größten Städte der Erde.",
        ],
      ],
      "Historische Ereignisse tragen kein festes Etikett: Ihre Bewertung hängt davon ab, aus wessen Sicht man fragt.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wer 1453 Konstantinopel eroberte und warum dieses Ereignis für zwei verschiedene Gruppen ganz unterschiedlich bewertet wird.",
        [
          "Nenne Osmanisches Reich, Sultan Mehmed II. und Ostrom.",
          "Stelle die Sicht in Westeuropa/Byzanz der osmanischen Sicht gegenüber.",
        ],
        "Am 29. Mai 1453 eroberte der osmanische Sultan Mehmed II. Konstantinopel und beendete das Byzantinische Reich. Für byzantinische und viele westeuropäische Christen war dies eine schmerzliche Niederlage und der Verlust eines Bollwerks. Aus osmanischer Sicht dagegen begann mit dem Ausbau der Stadt zur neuen Reichshauptstadt eine Zeit großer Stärke und kultureller Blüte.",
        [
          "Ereignis und Beteiligte richtig benannt",
          "Byzantinisch-europäische Sicht erklärt",
          "Osmanische Sicht erklärt",
        ],
      ),
      2: writing(
        "Beurteile die These: „Nach 1453 riss jeder Kontakt zwischen dem christlichen Europa und dem Osmanischen Reich ab.“",
        [
          "Denke sowohl an Kriege als auch an Gesandtschaften, Handel, Flucht von Gelehrten und Suche nach neuen Seewegen.",
          "Fälle ein differenziertes Urteil.",
        ],
        "Diese These stimmt nicht vollständig. Zwar kam es in den folgenden Jahrhunderten immer wieder zu schweren Kriegen zwischen dem Osmanischen Reich und europäischen Mächten, etwa bis vor Wien. Zugleich bestanden aber enge Handelsbeziehungen über Venedig und das Mittelmeer fort, und aus dem Kontrollwechsel am Bosporus entstanden sowohl neue Kontakte als auch der Antrieb für Westeuropa, Seewege um Afrika und nach Westen zu suchen.",
        [
          "Konflikte und Kriege berücksichtigt",
          "Weiterbestehenden Handel und Austausch belegt",
          "Folge für Entdeckungsfahrten genannt",
        ],
      ),
    },
  },
  {
    id: "g7-entdeckungsfahrten-1492",
    lb: 3,
    title: "1492: Motive und Verlauf der Entdeckungsfahrten",
    period: "Wandel zur Neuzeit · 15. und 16. Jahrhundert",
    span: [1487, 1522],
    intro:
      "Ende des 15. Jahrhunderts stachen portugiesische und spanische Schiffe ins Unbekannte auf – angetrieben von Gewürzpreisen, Glaubenseifer, Ruhmsucht und neuen Schiffstypen.",
    paragraphs: [
      "Seidenstoffe, Pfeffer, Nelken und Zimt aus Indien und Südostasien waren in Europa begehrt und extrem teuer, weil arabische, osmanische und venezianische Zwischenhändler entlang langer Land- und Seerouten verdienten. Portugal und Spanien am Westrand Europas wollten diesen Zwischenhandel umgehen und selbst den Seeweg zu den „Gewürzinseln“ finden. Hinzu kamen der Wunsch nach Gold, der Eifer, das Christentum zu verbreiten, sowie Neugier und der Wille der Seefahrer zu persönlichem Aufstieg.",
      "Möglich wurden die Ozeanfahrten durch technische und wissenschaftliche Fortschritte. Die Karavelle besaß dreieckige Lateinsegel neben Rahsegeln und war wendiger als frühere Schiffe; Magnetkompass, Jakobsstab und Astrolabium halfen auf offener See bei der Orientierung. Außerdem wussten gebildete Seefahrer längst, dass die Erde eine Kugel ist – umstritten war nur ihr genauer Umfang.",
      "Während Portugal unter Bartolomeu Dias 1487/88 und Vasco da Gama 1498 den Ostweg um die Südspitze Afrikas nach Indien erschloss, wagte Christoph Kolumbus im Auftrag der spanischen Krone 1492 die Fahrt nach Westen. Weil er die Erde für viel kleiner hielt, glaubte er, in Asien gelandet zu sein, als er im Oktober 1492 eine Insel der Karibik erreichte – und nannte die Bewohner irrtümlich „Indianer“. Erst 1519 bis 1522 bewies die Expedition von Ferdinand Magellan (vollendet von Juan Sebastián Elcano) mit der ersten Weltumsegelung endgültig die Lage Amerikas zwischen zwei Ozeanen.",
    ],
    takeaway:
      "Gewinnstreben, Missionswille, Neugier und neue Navigationstechnik trieben die Entdeckungsfahrten an; 1492 erreichte Kolumbus auf der Suche nach Indien Amerika.",
    sourceIds: ["lehrplan", "pw-kolumbus"],
    quiz: check(
      "Warum nannte Christoph Kolumbus die Ureinwohner der Karibik im Jahr 1492 irrtümlich „Indianer“?",
      "Er glaubte wegen eines falsch berechneten Erdumfangs, auf dem Westweg Indien erreicht zu haben.",
      [
        "Weil er bereits wusste, dass zwischen Europa und Asien ein großer amerikanischer Doppelkontinent liegt.",
        "Weil ein spanischer König ihm vor der Abfahrt verboten hatte, einen anderen Namen aufzuschreiben.",
      ],
      [
        "Kolumbus verstand bis zu seinem Tod nicht, dass er einen bis dahin in Europa unbekannten Erdteil erreicht hatte.",
        "Die Benennung entstand aus seinem geographischen Irrtum über die Breite der Ozeane, nicht durch ein Verbot.",
      ],
      "Kolumbus unterschätzte die Entfernung nach Westen massiv und hielt die Karibikinseln für vorgelagerte Inseln Asiens.",
    ),
    workshop: timeline(
      [
        [
          "1487/88 n. Chr.: Bartolomeu Dias umsegelt für Portugal erstmals das Kap der Guten Hoffnung.",
          "Damit öffnet sich der Seeweg um die Südspitze Afrikas in den Indischen Ozean.",
        ],
        [
          "1492 n. Chr.: Christoph Kolumbus erreicht auf dem Westweg im Dienst Spaniens die Karibik.",
          "Die Fahrt markiert für Europa den Beginn der überseeischen Eroberung Amerikas.",
        ],
        [
          "1498 n. Chr.: Vasco da Gama landet an der Südwestküste Indiens und sichert den direkten Gewürzhandel.",
          "Portugal gewinnt einen direkten Seeweg ohne Zwischenhändler im Mittelmeer.",
        ],
        [
          "1519–1522 n. Chr.: Magellans Flotte gelingt unter Elcano die erste dokumentierte Weltumsegelung.",
          "Die Reise beweist praktisch die Kugelgestalt der Erde und die gewaltige Weite des Pazifiks.",
        ],
      ],
      "Innerhalb von nur 35 Jahren verbanden europäische Schiffe erstmals alle großen Weltmeere – mit tiefgreifenden Folgen.",
    ),
    tasks: {
      1: writing(
        "Nenne je zwei Motive und zwei technische Voraussetzungen, die die europäischen Entdeckungsfahrten um 1500 möglich machten.",
        [
          "Überlege, warum man einen neuen Weg nach Asien suchte (Gold, Gewürze, Mission).",
          "Nenne Schiffstyp und Navigationshilfen.",
        ],
        "Wichtige Motive waren das Streben nach direktem, günstigerem Gewürzhandel ohne Zwischenhändler, die Suche nach Gold, Machtzuwachs der Kronen sowie der Wunsch, das Christentum zu verbreiten. Technisch ermöglichten wendige Karavellen mit kombinierten Segeln sowie verbesserte Navigationsgeräte wie Kompass und Jakobsstab das Befahren der offenen Ozeane.",
        [
          "Zwei historische Motive genannt",
          "Zwei technische Voraussetzungen erklärt",
          "Zusammenhang von Ziel und Mittel deutlich gemacht",
        ],
      ),
      2: writing(
        "Beurteile die Aussage: „Kolumbus fuhr 1492 los, um zu beweisen, dass die Erde eine Kugel ist.“",
        [
          "Prüfe anhand der Erdkunde der damaligen Gelehrten, was wirklich umstritten war.",
          "Nenne den eigentlichen Irrtum von Kolumbus und seinen Auftraggebern.",
        ],
        "Diese verbreitete Behauptung ist falsch. Unter gebildeten Europäern und Seefahrern war die Kugelgestalt der Erde seit der Antike bekannt. Streitpunkt war allein, wie groß der Erdumfang sei und ob Vorräte für die Westfahrt bis Asien reichten. Kolumbus rechnete mit einem viel zu kleinen Erdumfang und traf deshalb unerwartet auf Amerika.",
        [
          "Kugelgestalt als bekannt vorausgesetzt",
          "Wahren Streitpunkt (Erdumfang und Vorräte) genannt",
          "Eigenen Irrtum des Kolumbus präzise benannt",
        ],
      ),
    },
  },
  {
    id: "g7-kolonialisierung-folgen",
    lb: 3,
    title: "Kolonialisierung und Epochengrenze zur Neuzeit",
    period: "Wandel zur Neuzeit · 16. Jahrhundert bis heute",
    span: [1492, 1600],
    intro:
      "Was in Europa als Aufbruch in die Neuzeit gefeiert wurde, brachte für Reiche in Amerika Unterdrückung, Krankheiten und Zwang. Zugleich verändert sich hier der Blick auf den Begriff Epochengrenze.",
    paragraphs: [
      "Den Seefahrern folgten bald Eroberer (Konquistadoren) wie Hernán Cortés im Reich der Azteken und Francisco Pizarro im Inkareich. Mit Feuerwaffen, Pferden, geschickter Ausnutzung innerer Feindschaften und eingeschleppten Krankheiten wie Pocken und Masern, gegen die die Ureinwohner keine Abwehrkräfte hatten, zerschlugen kleine Truppen riesige Kulturen. Millionen indigene Menschen starben an Gewalt, Zwangsarbeit in Silberminen und Seuchen.",
      "Die entstehenden europäischen Kolonialreiche veränderten Wirtschaft und Alltag auf beiden Seiten des Atlantiks dauerhaft. Nach Europa kamen Kartoffeln, Mais, Tomaten, Kakao und große Mengen Silber; nach Amerika gelangten Pferde, Rinder, Weizen, europäische Sprachen und das Christentum. Da viele Ureinwohner starben, verschleppten europäische Händler über Jahrhunderte Millionen Afrikaner gewaltsam als Sklaven auf amerikanische Plantagen. Viele heutige globale Ungleichheiten, Sprachräume und Konflikte reichen bis in diese Kolonialzeit zurück.",
      "Historikerinnen und Historiker diskutieren darum, wann das Mittelalter endete und die Neuzeit begann. Genannt werden etwa um 1450 (Buchdruck), 1453 (Eroberung Konstantinopels), 1492 („Entdeckung“ Amerikas) oder 1517 (Beginn der Reformation). Eine solche Epochengrenze ist kein abrupter Schnitt über Nacht, sondern ein Hilfsmittel: Je nachdem, ob man nach Medien, Weltpolitik, Kolonialismus oder Religion fragt, rückt ein anderes Jahr in den Vordergrund.",
    ],
    takeaway:
      "Die Kolonialisierung zerstörte indigene Kulturen, löste globalen Austausch samt Sklavenhandel aus und zeigt, warum die Epochengrenze zur Neuzeit je nach Blickwinkel anders gesetzt wird.",
    sourceIds: ["lehrplan", "pw-kolonialismus", "pw-kolumbus"],
    quiz: check(
      "Warum setzen Historiker die Epochengrenze zwischen Mittelalter und Neuzeit nicht für die ganze Welt auf ein einziges Datum fest?",
      "Weil je nach Fragestellung Buchdruck, 1453, 1492 oder 1517 unterschiedliche Umbrüche betonen.",
      [
        "Weil alle alten Urkunden aus der Zeit um 1500 verbrannt sind und Jahreszahlen geschätzt werden.",
        "Weil Menschen am 1. Januar 1500 überall auf der Erde gleichzeitig das Mittelalter für beendet erklärten.",
      ],
      [
        "Aus der Zeit um 1500 sind dank des Buchdrucks und zahlreicher Archive sehr genaue Daten überliefert.",
        "Niemand im Alltag spürte an einem Stichtag den Übergang; Epochenbegriffe sind nachträgliche Ordnungshilfen.",
      ],
      "Epochengrenzen sind Werkzeuge der Geschichtswissenschaft, um tiefgreifende Veränderungen übersichtlich zu gliedern.",
    ),
    diagram: {
      kind: "compare",
      title: "Kandidaten für die Epochengrenze um 1500",
      columns: ["Datum & Ereignis", "Welcher Wandel wird betont?"],
      rows: [
        {
          aspect: "um 1450 · Buchdruck",
          values: ["Medienrevolution durch Gutenberg", "schneller Zugang zu Wissen, Kritik und Bildung"],
        },
        {
          aspect: "1453 · Konstantinopel",
          values: ["Ende Ostroms, Aufstieg des Osmanischen Reiches", "Machtverschiebung im Mittelmeerraum und Impuls für Italien"],
        },
        {
          aspect: "1492 · Amerika",
          values: ["Beginn europäischer Weltreiche und globaler Vernetzung", "Wandel der Weltwirtschaft und Gewalt gegen Ureinwohner"],
        },
      ],
      caption:
        "Zusätzlich nennen viele für Deutschland 1517 (Beginn der Reformation). Alle vier Daten beschreiben Seiten eines längeren Umbruchs.",
    },
    workshop: classify(
      "Folgen der europäischen Kolonialisierung",
      ["Folgen für indigene Kulturen & Afrika", "Wirtschaftlich-kulturelle Folgen bis heute"],
      [
        [
          "Eingeschleppte Krankheiten und Zwangsarbeit in Minen kosten Millionen Ureinwohner das Leben.",
          0,
          "Der demographische Einbruch zerstörte ganze Gesellschaften und Traditionen.",
        ],
        [
          "Kartoffel, Mais, Tomate und Kakao verbreiten sich weltweit und prägen unsere heutige Ernährung.",
          1,
          "Der transatlantische Güteraustausch veränderte Landwirtschaft und Esskultur dauerhaft.",
        ],
        [
          "Europäische Sklavenhändler verschleppen Millionen Afrikaner zur Plantagenarbeit nach Amerika.",
          0,
          "Der Dreieckshandel hinterließ tiefe Wunden in Afrika und Rassismus in den Kolonien.",
        ],
        [
          "Spanisch, Portugiesisch und Englisch sind bis heute Hauptsprachen ganzer Kontinente.",
          1,
          "Sprache, Recht und Religion in Amerika spiegeln die damalige Kolonialherrschaft.",
        ],
        [
          "Rohstoffexport und ungleiche Handelsbedingungen belasten ehemals kolonisierte Regionen teilweise bis heute.",
          1,
          "Heutige Konfrontationen und Kooperationen haben oft koloniale Wurzeln.",
        ],
      ],
      "Die Folgen von 1492 endeten nicht im 16. Jahrhundert – sie wirken in Wirtschaft, Sprache und weltweiten Beziehungen fort.",
    ),
    tasks: {
      1: writing(
        "Beschreibe, welche Folgen die europäische Kolonialisierung für die ursprünglich in Mittel- und Südamerika lebenden Kulturen hatte.",
        [
          "Nenne militärische Eroberung, eingeschleppte Krankheiten und Zwangsarbeit.",
          "Erwähne auch kulturelle oder religiöse Veränderungen.",
        ],
        "Für die indigenen Völker Amerikas bedeutete die Kolonialisierung meist den gewaltsamen Verlust ihrer Selbstständigkeit. Durch Kriege, brutale Ausbeutung in Silberminen und auf Plantagen sowie vor allem eingeschleppte Krankheiten wie die Pocken starb ein Großteil der Bevölkerung. Zudem wurden eigene Tempel, Schriften und Traditionen oft zerstört und durch europäische Sprache und Religion ersetzt.",
        [
          "Gewalt und Ausbeutung beschrieben",
          "Eingeschleppte Krankheiten als Hauptursache genannt",
          "Kulturelle Folgen berücksichtigt",
        ],
      ),
      2: writing(
        "Diskutiere: Ist das Jahr 1453 oder das Jahr 1492 das treffendere Datum für den Beginn der Neuzeit?",
        [
          "Begründe kurz, wofür jeweils 1453 und 1492 stehen.",
          "Formuliere ein eigenes abwägendes Urteil.",
        ],
        "Für 1453 spricht, dass mit Konstantinopel das antike oströmische Reich endete, das Osmanische Reich zur Großmacht wurde und griechische Gelehrte die Renaissance in Italien beflügelten. Für 1492 spricht jedoch, dass nun erstmals alle Kontinente dauerhaft verflochten wurden und ein weltweiter Handel samt Kolonialismus entstand. Da Epochen langsam übergehen, markiert 1492 den stärkeren weltgeschichtlichen Einschnitt, während 1453 eher Europa und den Mittelmeerraum betrifft.",
        [
          "Bedeutung von 1453 erklärt",
          "Bedeutung von 1492 erklärt",
          "Beide gegeneinander abgewogen",
        ],
      ),
    },
  },
];
