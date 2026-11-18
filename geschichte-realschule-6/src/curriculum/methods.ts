import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 1: Methoden und Arbeitstechniken, applied in every later Lernbereich. */
export const methods: Lesson[] = [
  {
    id: "g6-quellen",
    lb: 1,
    title: "Quellen und Darstellungen",
    period: "Methode · alle Epochen",
    span: [-10000, 2026],
    intro:
      "Geschichte ist vorbei. Was wir über sie wissen, stammt aus Spuren: aus Quellen. Und aus dem, was Menschen später darüber schreiben.",
    paragraphs: [
      "Eine Quelle stammt aus der Zeit, die du untersuchst: ein Brief eines Römers, eine Münze mit dem Kopf des Augustus, eine Steinaxt aus der Jungsteinzeit. Man unterscheidet Textquellen, Bildquellen und Sachquellen (Gegenstände). Eine Darstellung ist dagegen später entstanden: Dein Schulbuchtext, ein Sachbuch oder eine Dokumentation erzählen über die Vergangenheit, sie stammen aber nicht aus ihr.",
      "Am Anfang steht eine Frage, zum Beispiel: Wie lebten Kinder im alten Rom? Dann suchst du passende Quellen und Darstellungen. Bei jeder Quelle fragst du: Wer hat sie gemacht, wann, für wen und warum? Eine Grabinschrift, die ein Vater für seine Tochter setzen ließ, erzählt etwas anderes als ein Gesetz über Kinder.",
      "Quellen urteilen oft über Menschen, und sie tun das aus einer bestimmten Sicht. Caesar schrieb selbst einen Bericht über seinen Krieg in Gallien und stellte sich darin als klugen, gerechten Feldherrn dar. Von den besiegten Galliern gibt es keinen eigenen Bericht. Wenn du eine historische Persönlichkeit beurteilst, prüfst du deshalb: Wer urteilt hier, und was hatte diese Person davon?",
    ],
    takeaway:
      "Quellen stammen aus der untersuchten Zeit, Darstellungen entstehen später. Jede Quelle zeigt eine Sicht: Frage immer, wer sie wann, für wen und warum gemacht hat.",
    sourceIds: ["lehrplan", "archaeologie-bayern"],
    quiz: check(
      "Welches dieser Materialien ist eine Quelle zur Zeit des Kaisers Augustus?",
      "Eine Münze, die um Christi Geburt geprägt wurde.",
      [
        "Ein Kapitel über Augustus im Schulbuch.",
        "Eine Dokumentation über Rom von 2024.",
      ],
      [
        "Das Schulbuch ist heute entstanden und erzählt über Augustus: eine Darstellung.",
        "Auch ein heutiger Film ist eine Darstellung, keine Quelle aus der Zeit des Augustus.",
      ],
      "Die Münze stammt aus der Zeit selbst. Sie ist eine Sachquelle, die auch zeigt, wie Augustus gesehen werden wollte.",
    ),
    workshop: classify(
      "Quelle oder Darstellung?",
      ["Quelle aus der Zeit", "Spätere Darstellung"],
      [
        [
          "Eine Steinaxt, die in einem jungsteinzeitlichen Dorf ausgegraben wurde.",
          0,
          "Die Axt wurde damals hergestellt und benutzt: eine Sachquelle.",
        ],
        [
          "Ein Bericht, den Caesar selbst über seinen Krieg in Gallien schrieb.",
          0,
          "Der Text stammt aus der Zeit und vom Handelnden selbst: eine Textquelle mit seiner Sicht.",
        ],
        [
          "Ein Rekonstruktionsbild eines Römerkastells im Museum.",
          1,
          "Das Bild wurde heute nach Funden gezeichnet. Es stellt das Kastell dar.",
        ],
        [
          "Eine Wandmalerei aus einem Haus in Pompeji.",
          0,
          "Sie wurde in der Römerzeit gemalt: eine Bildquelle.",
        ],
        [
          "Der Text deines Geschichtsbuchs über Ägypten.",
          1,
          "Heutige Fachleute haben ihn aus vielen Quellen erarbeitet: eine Darstellung.",
        ],
      ],
      "Entscheidend ist die Entstehungszeit: Was aus der Zeit stammt, ist eine Quelle. Was später darüber erzählt, ist eine Darstellung.",
    ),
    tasks: {
      1: writing(
        "Caesar beschreibt sich in seinem Bericht über den Gallischen Krieg als gerechten Feldherrn. Erkläre, warum du diesem Urteil nicht einfach glauben solltest.",
        ["Wer hat den Bericht geschrieben?", "Wessen Sicht fehlt?"],
        "Caesar hat den Bericht selbst geschrieben. Er wollte in Rom gut dastehen und hatte deshalb einen Grund, sich gerecht und klug darzustellen. Die besiegten Gallier kommen nicht selbst zu Wort. Ich brauche weitere Quellen, zum Beispiel Funde aus gallischen Siedlungen oder Berichte anderer Römer.",
        ["Verfasser und Absicht genannt", "Fehlende Sicht erkannt", "Weitere Quellen vorgeschlagen"],
      ),
      2: writing(
        "Du möchtest wissen, wie Kinder im alten Rom spielten. Formuliere die Frage genau und nenne je ein Beispiel für eine Quelle und eine Darstellung, die dir helfen.",
        ["Welche Funde oder Texte könnten Kinder betreffen?", "Wo findest du eine Darstellung dazu?"],
        "Meine Frage lautet: Womit spielten Kinder im alten Rom? Als Quelle helfen mir Spielzeugfunde, zum Beispiel Puppen aus Knochen oder Ton und kleine Tierknöchel als Spielsteine, die in römischen Gräbern oder Häusern gefunden wurden. Als Darstellung nutze ich ein Kapitel im Sachbuch oder einen Museumstext, der die Funde erklärt. Die Quelle zeigt, was es gab; die Darstellung ordnet es ein.",
        ["Genaue Frage formuliert", "Passende Quelle genannt", "Passende Darstellung genannt"],
      ),
    },
  },
  {
    id: "g6-zeitleiste",
    lb: 1,
    title: "Zeit messen: vor und nach Christi Geburt",
    period: "Methode · Zeitrechnung",
    span: [-3000, 800],
    intro:
      "Ägypten, Athen, Rom, Karl der Große: Wer Ereignisse auf einer Zeitleiste ordnet, sieht, was gleichzeitig, früher oder viel später geschah.",
    paragraphs: [
      "Wir zählen die Jahre ab Christi Geburt. Was davor lag, bekommt den Zusatz „v. Chr.“ (vor Christus), danach „n. Chr.“ (nach Christus). Vor Christi Geburt zählt man rückwärts: 3000 v. Chr. liegt weiter zurück als 753 v. Chr. Ein Jahr 0 gibt es nicht; auf das Jahr 1 v. Chr. folgt direkt das Jahr 1 n. Chr.",
      "Ein Jahrhundert umfasst hundert Jahre. Das 1. Jahrhundert n. Chr. reicht von 1 bis 100, das 5. Jahrhundert v. Chr. von 500 bis 401 v. Chr. Die Zahl des Jahrhunderts ist also um eins größer als die Hunderterstelle: 753 v. Chr. liegt im 8. Jahrhundert v. Chr. Beispielrechnung: Von 753 v. Chr. bis 14 n. Chr. vergingen 753 + 14 − 1 = 766 Jahre, weil das Jahr 0 fehlt.",
      "Auf einer Zeitleiste stehen die Jahre in gleichen Abständen: Jeder Zentimeter bedeutet dieselbe Zeitspanne. Ein Geschichtsfries zeigt zusätzlich farbige Bänder für ganze Epochen, etwa die Antike von etwa 800 v. Chr. bis um 500 n. Chr. und danach das Mittelalter. Die Altsteinzeit ist so lang, dass sie auf einer solchen Leiste weit über den Rand hinausragen würde. Der farbige Streifen oben in jeder Lektion zeigt dir, wo ihr Thema liegt.",
    ],
    takeaway:
      "Vor Christi Geburt zählt man rückwärts, ein Jahr 0 gibt es nicht. 753 v. Chr. liegt im 8. Jahrhundert v. Chr.; die Zeitleiste zeigt Abstände maßstabsgerecht.",
    sourceIds: ["lehrplan"],
    quiz: check(
      "In welchem Jahrhundert liegt das Jahr 753 v. Chr.?",
      "Im 8. Jahrhundert v. Chr.",
      ["Im 7. Jahrhundert v. Chr.", "Im 75. Jahrhundert v. Chr."],
      [
        "Das 7. Jahrhundert v. Chr. reicht von 700 bis 601 v. Chr.; 753 liegt davor.",
        "Ein Jahrhundert hat hundert Jahre, nicht zehn. Teile durch hundert und zähle eins dazu.",
      ],
      "Das 8. Jahrhundert v. Chr. reicht von 800 bis 701 v. Chr. Die Hunderterstelle 7 plus eins ergibt das 8. Jahrhundert.",
    ),
    workshop: timeline(
      [
        [
          "um 3300 v. Chr.: Ötzi stirbt in den Alpen.",
          "Ötzi lebte in der späten Jungsteinzeit, der Kupferzeit.",
        ],
        [
          "um 3000 v. Chr.: In Ägypten entsteht eine Hochkultur.",
          "Kurz nach Ötzis Tod wird Ägypten unter einem König vereinigt.",
        ],
        [
          "753 v. Chr.: Nach der Sage wird Rom gegründet.",
          "Das Datum stammt aus späteren römischen Berechnungen.",
        ],
        [
          "um 450 v. Chr.: Athen erlebt seine Blütezeit.",
          "Das 5. Jahrhundert v. Chr. reicht von 500 bis 401 v. Chr.",
        ],
        [
          "27 v. Chr.: Augustus wird erster römischer Kaiser.",
          "Seine Herrschaft reicht über Christi Geburt hinaus bis 14 n. Chr.",
        ],
        [
          "800 n. Chr.: Karl der Große wird Kaiser.",
          "Damit liegt die Kaiserkrönung schon im Frühmittelalter.",
        ],
      ],
      "Je größer die Zahl vor „v. Chr.“, desto weiter liegt das Ereignis zurück. Nach Christi Geburt wachsen die Zahlen wieder.",
    ),
    tasks: {
      1: writing(
        "Ordne 3000 v. Chr., 800 n. Chr. und 753 v. Chr. zeitlich und erkläre, wie du vorgegangen bist.",
        ["Was bedeutet eine große Zahl vor „v. Chr.“?", "Wo steht Christi Geburt auf der Zeitleiste?"],
        "Die richtige Reihenfolge ist 3000 v. Chr., 753 v. Chr., 800 n. Chr. Vor Christi Geburt zählt man rückwärts, deshalb liegt 3000 v. Chr. weiter zurück als 753 v. Chr. Alle Jahre mit „n. Chr.“ liegen nach Christi Geburt und damit später als jedes Jahr vor Christus.",
        ["Richtige Reihenfolge", "Rückwärtszählen erklärt", "Christi Geburt als Grenze genannt"],
      ),
      2: writing(
        "Eine Mitschülerin rechnet: Von 500 v. Chr. bis 500 n. Chr. sind genau 1000 Jahre vergangen. Prüfe ihre Rechnung.",
        ["Gibt es ein Jahr 0?", "Zähle an einem kleinen Beispiel, etwa von 1 v. Chr. bis 1 n. Chr."],
        "Die Rechnung stimmt nicht ganz. Von 1 v. Chr. bis 1 n. Chr. vergeht nur ein Jahr, weil es kein Jahr 0 gibt. Deshalb muss man beim Rechnen über Christi Geburt hinweg ein Jahr abziehen: 500 + 500 − 1 = 999 Jahre. Für einen groben Überblick reicht „etwa 1000 Jahre“.",
        ["Fehlendes Jahr 0 erkannt", "Richtiges Ergebnis berechnet", "Rechenweg nachvollziehbar"],
      ),
    },
  },
  {
    id: "g6-karten",
    lb: 1,
    title: "Geschichtskarten und Schaubilder lesen",
    period: "Methode · Karten und Schaubilder",
    span: [-334, -323],
    intro:
      "Eine Geschichtskarte zeigt auf einen Blick, wo etwas geschah und wie sich Grenzen veränderten. Dafür musst du ihre Zeichen lesen können.",
    paragraphs: [
      "Eine Geschichtskarte ist heute gezeichnet worden; sie ist also eine Darstellung. Sie zeigt einen Raum zu einer bestimmten Zeit, etwa „Der Zug Alexanders des Großen 334 bis 323 v. Chr.“. Gehe mit festen Fragen vor: Was ist das Thema? Welchen Zeitraum zeigt sie? Welchen Raum? Was bedeuten Farben, Pfeile und Zeichen in der Legende? Wie groß sind die Entfernungen laut Maßstab? Erst danach formulierst du die Aussage der Karte.",
      "Auf der Karte zum Alexanderzug zeigt ein roter Pfeil den Weg des Heeres von Makedonien über Ägypten bis an den Indus. Kleine Punkte markieren Städte, die Alexander gründete. Der Maßstab verrät: Der Weg war mehrere Tausend Kilometer lang. Eine Aussage könnte lauten: Alexander eroberte in elf Jahren ein Reich von Griechenland bis Indien.",
      "Ein Schaubild stellt Zusammenhänge mit Kästen und Pfeilen dar, zum Beispiel den Aufbau einer Gesellschaft als Pyramide oder die Ämter der römischen Republik. Lies es von oben nach unten und achte darauf, was die Pfeile bedeuten: wählt, ernennt, kontrolliert. Ein Schaubild vereinfacht stark. Es zeigt das Prinzip, nicht jede Ausnahme.",
    ],
    takeaway:
      "Karten und Schaubilder sind Darstellungen. Lies Thema, Zeit, Raum, Legende und Maßstab, bevor du ihre Aussage formulierst.",
    sourceIds: ["lehrplan", "pw-alexander"],
    quiz: check(
      "Wo erfährst du, was die Farben und Pfeile einer Geschichtskarte bedeuten?",
      "In der Legende der Karte.",
      ["Im Maßstab der Karte.", "Im Titel der Karte."],
      [
        "Der Maßstab zeigt Entfernungen, nicht die Bedeutung der Zeichen.",
        "Der Titel nennt Thema und Zeit, aber nicht jedes Zeichen.",
      ],
      "Die Legende erklärt alle Farben, Linien und Symbole. Ohne sie bleibt eine Karte stumm.",
    ),
    workshop: classify(
      "Eine Karte Schritt für Schritt lesen",
      ["Thema und Zeit", "Legende", "Maßstab", "Aussage"],
      [
        [
          "Überschrift: „Der Zug Alexanders des Großen 334 bis 323 v. Chr.“",
          0,
          "Der Titel nennt Thema und Zeitraum der Karte.",
        ],
        [
          "Ein roter Pfeil bedeutet: Weg des Heeres.",
          1,
          "Die Legende erklärt, was ein Zeichen bedeutet.",
        ],
        [
          "Eine Leiste zeigt: ein Zentimeter entspricht 300 Kilometern.",
          2,
          "Mit dem Maßstab schätzt du Entfernungen.",
        ],
        [
          "Das Reich Alexanders reichte von Griechenland bis an den Indus.",
          3,
          "Das ist eine Aussage, die du aus Pfeilen, Farben und Raum gewinnst.",
        ],
        [
          "Kleine Punkte stehen für von Alexander gegründete Städte.",
          1,
          "Auch Punkte und Symbole erklärt die Legende.",
        ],
      ],
      "Wer zuerst Thema, Legende und Maßstab klärt, kann die Aussage einer Karte sicher formulieren.",
      "Beschriebene Geschichtskarte: Ein roter Pfeil führt von Makedonien nach Kleinasien, nach Ägypten, weiter nach Babylon und bis an den Indus und zurück nach Babylon. Unten rechts steht eine Maßstabsleiste, oben die Überschrift.",
      "Für diese Übung beschriebene Karte · keine historische Originalquelle",
    ),
    tasks: {
      1: writing(
        "Nenne vier Fragen, die du einer Geschichtskarte immer stellst, und erkläre bei einer, warum sie wichtig ist.",
        ["Denke an Titel, Legende und Maßstab.", "Was passiert, wenn du die Legende nicht liest?"],
        "Ich frage: Was ist das Thema? Welchen Zeitraum zeigt die Karte? Was bedeuten die Zeichen in der Legende? Wie groß sind die Entfernungen laut Maßstab? Die Legende ist besonders wichtig, denn ohne sie weiß ich nicht, ob ein Pfeil einen Kriegszug, einen Handelsweg oder eine Wanderung zeigt.",
        ["Vier Fragen genannt", "Eine Frage begründet", "Fachbegriffe richtig verwendet"],
      ),
      2: writing(
        "Eine Karte zeigt das Römische Reich im Jahr 117 n. Chr. in Rot. Ein Mitschüler sagt: „So groß war Rom immer.“ Was entgegnest du?",
        ["Was sagt das Jahr im Titel?", "Wie könnte eine Karte zu anderen Zeiten aussehen?"],
        "Die Karte zeigt nur das Jahr 117 n. Chr., als das Reich besonders groß war. Rom begann als kleine Stadt und eroberte erst nach und nach Italien und die Gebiete rund ums Mittelmeer. Später gingen Gebiete wieder verloren. Um die Entwicklung zu sehen, brauche ich mehrere Karten zu verschiedenen Zeitpunkten.",
        ["Zeitpunkt der Karte beachtet", "Veränderung des Reiches erklärt", "Weitere Karten vorgeschlagen"],
      ),
    },
  },
  {
    id: "g6-archaeologie",
    lb: 1,
    title: "Archäologie: vom Fund zur Geschichte",
    period: "Methode · Archäologie am Beispiel Ötzi",
    span: [-3300, -3300],
    intro:
      "1991 fanden Wanderer in den Ötztaler Alpen einen Toten im Eis. Er war rund 5300 Jahre alt. Wie erfahren Forschende, wer er war?",
    paragraphs: [
      "Archäologinnen und Archäologen erforschen die Vergangenheit über Dinge, die im Boden oder im Eis erhalten blieben. Sie graben vorsichtig aus, messen und fotografieren jede Fundstelle und schreiben genau auf, was wo lag. Das nennt man den Befund. Erst danach untersuchen sie die Funde im Labor, etwa mit Röntgenbildern oder der Radiokarbonmethode, die das Alter von Knochen, Holz oder Pflanzenresten bestimmt.",
      "Beim Mann aus dem Eis, genannt Ötzi, ergab das: Er lebte um 3300 v. Chr. in der späten Jungsteinzeit. Er trug Kleidung aus Fell und Leder, Schuhe mit Heu als Wärmepolster und hatte ein Kupferbeil, einen Feuersteindolch, einen Bogen und einen Köcher mit Pfeilen dabei. Auf einem Röntgenbild entdeckte man 2001 eine Pfeilspitze in seiner linken Schulter. In seinem Magen fand man Reste von Steinbockfleisch und Getreide.",
      "Aus Befunden werden Aussagen: Die Pfeilspitze lässt darauf schließen, dass Ötzi getötet wurde. Das wertvolle Kupferbeil deutet an, dass er eine angesehene Stellung hatte. Solche Deutungen sind gut begründet, bleiben aber Vermutungen. Warum er starb und wer ihn tötete, wissen wir nicht. Gute Forschung trennt deshalb sauber: Was wurde gefunden? Was folgt daraus wahrscheinlich? Was bleibt offen?",
    ],
    takeaway:
      "Archäologie arbeitet in Schritten: Funde sichern und dokumentieren, untersuchen, deuten. Eine Deutung muss am Befund begründet sein und bleibt offen für neue Erkenntnisse.",
    sourceIds: ["oetzi", "pw-archaeologie", "archaeologie-bayern"],
    quiz: check(
      "Was zeigt die Pfeilspitze in Ötzis Schulter am sichersten?",
      "Dass er von einem Pfeil getroffen wurde.",
      ["Dass er ein gefürchteter Krieger war.", "Dass ein Nachbardorf ihn angriff."],
      [
        "Ein Treffer sagt nichts darüber, ob er selbst kämpfte oder gefürchtet war.",
        "Wer schoss, verrät die Pfeilspitze nicht; das bleibt eine Vermutung.",
      ],
      "Der Befund belegt den Treffer. Alles Weitere, wer schoss und warum, ist Deutung und bleibt offen.",
    ),
    diagram: {
      kind: "steps",
      title: "Vom Fund zur Aussage",
      steps: [
        { label: "Finden und sichern", note: "vorsichtig freilegen, nichts verschieben" },
        { label: "Dokumentieren", note: "messen, fotografieren, Fundlage aufschreiben" },
        { label: "Untersuchen", note: "Labor: Alter, Material, Röntgen" },
        { label: "Deuten", note: "begründete Vermutungen über das Leben damals" },
        { label: "Darstellen", note: "Museum, Rekonstruktion, Bericht" },
      ],
      repeats: false,
      caption:
        "Jeder Schritt baut auf dem vorigen auf. Wer einen Fund verschiebt, bevor er dokumentiert ist, zerstört Wissen.",
    },
    workshop: classify(
      "Befund, Deutung oder offene Frage?",
      ["Befund", "Begründete Deutung", "Offene Frage"],
      [
        [
          "In der linken Schulter steckt eine Feuerstein-Pfeilspitze.",
          0,
          "Das ist auf dem Röntgenbild sichtbar: ein Befund.",
        ],
        [
          "Ötzi trug ein Beil mit einer Klinge aus Kupfer.",
          0,
          "Das Beil wurde gefunden und untersucht: ein Befund.",
        ],
        [
          "Das seltene Kupferbeil spricht für eine angesehene Stellung.",
          1,
          "Das ist eine Schlussfolgerung aus dem Fund, gut begründet, aber nicht sicher.",
        ],
        [
          "Wer hat den tödlichen Pfeil abgeschossen?",
          2,
          "Dafür gibt es bisher keinen Beleg.",
        ],
        [
          "Reste von Steinbockfleisch und Getreide lagen in seinem Magen.",
          0,
          "Die Laboruntersuchung hat sie nachgewiesen: ein Befund.",
        ],
        [
          "Er kannte Getreide, also kam er aus einer Gegend mit Ackerbau.",
          1,
          "Eine Deutung, die zum Befund passt.",
        ],
      ],
      "Erst kommt der Befund, dann die begründete Deutung. Was kein Fund belegt, bleibt eine offene Frage.",
    ),
    tasks: {
      1: writing(
        "Erkläre an Ötzis Kupferbeil den Unterschied zwischen Befund und Deutung.",
        ["Was wurde tatsächlich gefunden?", "Welche Vermutung leiten Forschende daraus ab?"],
        "Der Befund ist das Beil selbst: ein Holzstiel mit einer Klinge aus Kupfer, das neben Ötzi im Eis lag. Die Deutung lautet: Weil Kupfer damals selten und wertvoll war, hatte Ötzi vermutlich eine angesehene Stellung. Der Befund ist sicher, die Deutung ist gut begründet, könnte aber durch neue Funde verändert werden.",
        ["Befund beschrieben", "Deutung abgeleitet", "Unsicherheit der Deutung genannt"],
      ),
      2: writing(
        "Ein Bauer findet beim Pflügen alte Tonscherben und nimmt sie mit nach Hause. Erkläre, warum Archäologen darüber nicht glücklich sind.",
        ["Was geht verloren, wenn ein Fund bewegt wird?", "Welcher Schritt der Archäologie fehlt?"],
        "Die Scherben allein sagen wenig. Wichtig ist auch, wo und wie sie lagen, in welcher Erdschicht und neben welchen anderen Dingen. Diese Fundlage muss dokumentiert werden, bevor man etwas bewegt. Nimmt der Bauer sie mit, geht dieses Wissen verloren. Besser wäre es, die Fundstelle zu melden, in Bayern beim Landesamt für Denkmalpflege.",
        ["Bedeutung der Fundlage erklärt", "Fehlende Dokumentation genannt", "Besseres Vorgehen vorgeschlagen"],
      ),
    },
  },
  {
    id: "g6-informieren",
    lb: 1,
    title: "Schulbuch, Sachbuch und Film nutzen",
    period: "Methode · Informationen finden",
    span: [-3000, 2026],
    intro:
      "Du sollst herausfinden, wie die Pyramiden gebaut wurden. Wo suchst du, und welcher Information traust du?",
    paragraphs: [
      "Dein Geschichtsbuch hat einen festen Aufbau. Das Inhaltsverzeichnis zeigt die Kapitel, das Register am Ende führt zu Stichwörtern, ein Lexikon erklärt Fachbegriffe. In jedem Kapitel gibt es den Autorentext, also die Darstellung, und Materialien wie Bilder, Karten und Quellentexte, oft mit M1, M2 und so weiter nummeriert. Für eine Frage suchst du zuerst das passende Stichwort im Register.",
      "Sachbücher und Dokumentationen für dein Alter erklären oft anschaulich und mit Bildern. Prüfe trotzdem: Wer hat sie gemacht? Nennen sie, woher ihr Wissen stammt, etwa aus Ausgrabungen? Ein Museum oder eine öffentlich-rechtliche Sendung ist meist verlässlicher als ein Video ohne Absender.",
      "Ein historischer Spielfilm will unterhalten. Er hält sich bei Kulissen und Kleidung manchmal an Funde, erfindet aber Figuren, Gespräche und spannende Wendungen. Auch Comics über Römer und Gallier mischen echte Dinge wie Legionen und Lager mit Erfundenem. Für eine Antwort auf deine Frage brauchst du deshalb eine Darstellung, die ihr Wissen belegt.",
    ],
    takeaway:
      "Suche gezielt mit Register und Inhaltsverzeichnis. Prüfe bei Sachbuch, Film oder Video, wer es gemacht hat und woher das Wissen stammt; Spielfilme erfinden vieles.",
    sourceIds: ["lehrplan", "pw-pyramiden", "smaek"],
    quiz: check(
      "Wo findest du in deinem Schulbuch am schnellsten, auf welchen Seiten „Pharao“ vorkommt?",
      "Im Register am Ende des Buches.",
      ["Im Autorentext des ersten Kapitels.", "In der Bildunterschrift eines Fotos."],
      [
        "Den Autorentext müsstest du ganz lesen, um das Wort zu finden.",
        "Eine Bildunterschrift nennt nur das eine Bild, nicht alle Seiten.",
      ],
      "Das Register listet Stichwörter mit Seitenzahlen auf. So findest du alle Stellen schnell.",
    ),
    workshop: classify(
      "Was zeigt der Film, und was ist erfunden?",
      ["Durch Funde belegt", "Für den Film erfunden"],
      [
        [
          "Die Arbeiter ziehen Steinblöcke auf Holzschlitten.",
          0,
          "Darstellungen und Funde zeigen solche Schlitten für schwere Lasten.",
        ],
        [
          "Der Vorarbeiter heißt Amun-Hotep und hat Streit mit seinem Bruder.",
          1,
          "Name und Familienstreit sind für die Spannung erfunden.",
        ],
        [
          "Neben der Baustelle gibt es ein Dorf mit Bäckereien für die Arbeiter.",
          0,
          "Ausgrabungen bei Gizeh fanden eine Arbeitersiedlung mit Bäckereien.",
        ],
        [
          "Der Pharao besucht jeden Abend die Baustelle und lobt einzelne Arbeiter.",
          1,
          "Dafür gibt es keinen Beleg; die Szene dient der Handlung.",
        ],
      ],
      "Ein Spielfilm kann Wissen veranschaulichen. Was belegt ist, musst du aber in einer Darstellung mit Quellenangaben prüfen.",
      "Beschriebener Spielfilm: Eine Szene zeigt den Bau der Cheops-Pyramide. Ein Vorarbeiter treibt seine Leute an, Ochsen und Männer ziehen Blöcke, abends kommt der Pharao vorbei.",
      "Für diese Übung beschriebene Filmszene · keine historische Originalquelle",
    ),
    tasks: {
      1: writing(
        "Beschreibe, wie du in deinem Schulbuch Informationen zur Frage „Wie wurden die Pyramiden gebaut?“ findest.",
        ["Mit welchem Teil des Buches beginnst du?", "Wie unterscheidest du Autorentext und Material?"],
        "Ich schaue im Register unter „Pyramide“ nach und schlage die angegebenen Seiten auf. Dort lese ich zuerst den Autorentext, der den Bau erklärt. Dann sehe ich mir die Materialien an, zum Beispiel ein Rekonstruktionsbild der Baustelle oder einen Quellentext. Unbekannte Begriffe schlage ich im Lexikon des Buches nach.",
        ["Register oder Inhaltsverzeichnis genutzt", "Autorentext und Material unterschieden", "Vorgehen in sinnvoller Reihenfolge"],
      ),
      2: writing(
        "Du findest im Internet ein Video: „Die Pyramiden wurden von Außerirdischen gebaut!“ Wie prüfst du, ob du dem Video trauen kannst?",
        ["Wer hat das Video gemacht?", "Was sagen Museen und Fachleute dazu?"],
        "Ich prüfe, wer das Video veröffentlicht hat und ob es Belege nennt, zum Beispiel Ausgrabungen. Dann vergleiche ich mit verlässlichen Darstellungen, etwa eines Museums wie dem Staatlichen Museum Ägyptischer Kunst in München oder einer Wissensseite. Dort steht, dass Funde wie die Arbeitersiedlung und Werkzeuge zeigen, wie Menschen die Pyramiden bauten. Ohne Belege traue ich dem Video nicht.",
        ["Absender geprüft", "Mit verlässlicher Darstellung verglichen", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-erzaehlen",
    lb: 1,
    title: "Geschichte erzählen: Comic, Bild und Rollenspiel",
    period: "Methode · historische Erzählung",
    span: [-5500, 800],
    intro:
      "Ein Rekonstruktionsbild, ein Comic oder ein Dialog machen Geschichte lebendig. Gut sind sie, wenn sie zu den Quellen passen.",
    paragraphs: [
      "Wer Geschichte erzählt, verbindet einzelne Belege zu einer zusammenhängenden Geschichte. Das tust du, wenn du einen Comic über einen Tag in einem Steinzeitdorf zeichnest, einen Dialog zwischen zwei Athenern schreibst oder ein Rollenspiel in einer römischen Familie spielst. Solche Erzählungen dürfen Lücken füllen, aber sie müssen zu dem passen, was wir aus Quellen wissen.",
      "Ein Rekonstruktionsbild eines jungsteinzeitlichen Dorfes zeigt Langhäuser. Belegt sind sie durch Verfärbungen im Boden, wo einst die Holzpfosten standen. Die spielenden Kinder auf dem Bild sind erfunden, passen aber in die Zeit. Ein Bauer mit einem eisernen Pflug wäre dagegen ein Fehler: Eisen nutzte man in Mitteleuropa erst Jahrtausende später. So einen Fehler, der etwas in eine falsche Zeit versetzt, nennt man Anachronismus.",
      "Für deine eigene Erzählung gilt: Sammle zuerst Belege aus Quellen und Darstellungen. Entscheide dann, was du hinzuerfindest, und achte darauf, dass es in Ort und Zeit passt. Am Ende kannst du kennzeichnen, was belegt und was ausgedacht ist. So bleibt deine Geschichte spannend und ehrlich.",
    ],
    takeaway:
      "Eine historische Erzählung verbindet Belege. Erfundenes muss in Zeit und Ort passen; ein Anachronismus versetzt etwas in die falsche Zeit.",
    sourceIds: ["lehrplan", "archaeologie-bayern"],
    quiz: check(
      "Was ist ein Anachronismus in einem Bild über die Jungsteinzeit?",
      "Ein Bauer, der mit einem Eisenpflug arbeitet.",
      ["Kinder, die vor einem Langhaus spielen.", "Ein Hund, der neben den Häusern liegt."],
      [
        "Spielende Kinder sind erfunden, passen aber in die Zeit.",
        "Hunde lebten schon in der Steinzeit bei den Menschen.",
      ],
      "Eisen wurde erst lange nach der Jungsteinzeit verarbeitet. Ein Eisenpflug versetzt also etwas in die falsche Zeit.",
    ),
    workshop: classify(
      "Ein Rekonstruktionsbild prüfen",
      ["Durch Funde belegt", "Erfunden, aber passend", "Passt nicht in die Zeit"],
      [
        [
          "Langhäuser aus Holz, Lehm und Schilf",
          0,
          "Pfostenlöcher im Boden zeigen Größe und Form der Häuser.",
        ],
        [
          "Eine Frau mahlt Getreide auf einem Mahlstein.",
          0,
          "Mahlsteine und Getreidereste wurden in Siedlungen gefunden.",
        ],
        [
          "Zwei Kinder spielen Fangen zwischen den Häusern.",
          1,
          "Dafür gibt es keinen Fund, aber es ist gut vorstellbar.",
        ],
        [
          "Ein Mann trägt einen Helm aus Eisen.",
          2,
          "Eisen wurde in der Jungsteinzeit noch nicht verarbeitet: ein Anachronismus.",
        ],
        [
          "Ein Junge liest vor dem Haus in einem Buch.",
          2,
          "In Mitteleuropa gab es in der Jungsteinzeit noch keine Schrift und keine Bücher.",
        ],
      ],
      "Ein gutes Rekonstruktionsbild füllt Lücken mit passenden Ideen und vermeidet Dinge aus späteren Zeiten.",
      "Beschriebenes Rekonstruktionsbild eines Dorfes um 5000 v. Chr.: drei Langhäuser, Felder mit Getreide, Rinder auf einer Weide, Menschen bei der Arbeit.",
      "Für diese Übung beschriebenes Bild · keine historische Originalquelle",
    ),
    tasks: {
      1: writing(
        "Du zeichnest einen Comic über einen Tag bei Jägern und Sammlern der Altsteinzeit. Nenne zwei Dinge, die du zeigen kannst, und eines, das du vermeiden musst.",
        ["Was weißt du über Werkzeuge und Wohnen in der Altsteinzeit?", "Was kam erst später?"],
        "Ich kann zeigen, wie die Gruppe mit Speeren jagt und wie sie am Feuer vor einem Zelt aus Fellen sitzt, denn beides ist durch Funde belegt. Vermeiden muss ich zum Beispiel Getreidefelder oder feste Häuser, weil Ackerbau und Sesshaftigkeit erst in der Jungsteinzeit begannen. Sonst entstünde ein Anachronismus.",
        ["Zwei passende Inhalte", "Ein Anachronismus vermieden", "Begründung mit Wissen"],
      ),
      2: writing(
        "Schreibe drei bis vier Sätze eines Dialogs zwischen zwei Kindern in einem Römerkastell in Bayern. Kennzeichne danach, was belegt und was erfunden ist.",
        ["Was wurde in Kastellen gefunden?", "Welche Gefühle und Namen darfst du erfinden?"],
        "Marcus: „Heute kommt ein Händler mit Wein über die Straße aus Italien.“ Lucia: „Und Vater muss wieder Wache am Limes stehen.“ Belegt sind römische Straßen, der Weinhandel und der Wachdienst am Limes. Erfunden sind die Namen und das Gespräch selbst; sie passen aber zu Kindern von Soldaten, die in Dörfern neben den Kastellen lebten.",
        ["Dialog passt zu Ort und Zeit", "Belegtes gekennzeichnet", "Erfundenes gekennzeichnet"],
      ),
    },
  },
];
