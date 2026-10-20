import type { Lesson } from "../model/types";
import { check, classify, tasks, timeline } from "./helpers";

export const landscapes: Lesson[] = [
  {
    id: "geo-grosslandschaften",
    lb: 1,
    title: "Deutschland von der Küste bis zu den Alpen",
    period: "Karten lesen · räumliche Orientierung",
    model: "landscapes",
    intro:
      "Vier Großlandschaften helfen, Deutschlands Relief zu ordnen. Ihre Grenzen sind keine waagerechten Linien auf der Karte.",
    paragraphs: [
      "Von Norden nach Süden unterscheidet man Norddeutsches Tiefland, Mittelgebirgsschwelle, Alpenvorland und Alpen. Das Tiefland hat neben Ebenen auch eiszeitliche Hügel; Mittelgebirge wie Harz und Bayerischer Wald sind keine einheitliche Gebirgskette. Das Alpenvorland liegt zwischen Donaugebiet und Alpen und trägt unter anderem eiszeitliche Ablagerungen.",
      "Lies zuerst Titel, Legende, Maßstab und Nordrichtung einer Karte. Höhenfarben zeigen Höhenstufen, nicht automatisch die Vegetation. Verorte anschließend einen Ort mit Breiten- und Längengrad. Vergleiche eine Deutschlandkarte mit einer Bayernkarte: Bei größerem Maßstab werden mehr Einzelheiten sichtbar, der Ausschnitt wird kleiner.",
      "Die Karte hier zeigt einen vereinfachten Staatsumriss und ausgewählte Orientierungspunkte. Sie ist keine Reliefkarte und zeichnet keine Grenzen der Großlandschaften ein. Nutze zusätzlich einen Atlas mit Höhenstufen, um etwa Erfurt am Rand des Thüringer Beckens und Oberstdorf in den Allgäuer Alpen einzuordnen.",
    ],
    takeaway:
      "Einordnen heißt: Lage beschreiben, Kartenzeichen lesen und mit einer passenden zweiten Karte prüfen.",
    sourceIds: ["lehrplan", "lfu", "naturalearth"],
    quiz: check(
      "Welche Großlandschaft liegt zwischen den Alpen und der Mittelgebirgsschwelle?",
      "Das Alpenvorland",
      ["Das Küstentiefland", "Der Mittelgebirgsraum"],
      "Das Alpenvorland schließt nördlich an die Alpen an. Die Großlandschaften haben unregelmäßige Übergänge.",
    ),
    workshop: classify(
      "Orte und Relief zuordnen",
      ["Tiefland", "Mittelgebirgsraum", "Alpenvorland", "Alpen"],
      [
        ["Hamburg und die untere Elbe", 0, "Hamburg liegt im Norddeutschen Tiefland."],
        [
          "Erfurt und der Thüringer Raum",
          1,
          "Das Thüringer Becken gehört zum Mittelgebirgsraum, auch wenn der Ort selbst nicht auf einem Gipfel liegt.",
        ],
        ["München nördlich der Alpen", 2, "München liegt auf der Schotterebene im Alpenvorland."],
        ["Oberstdorf im Allgäu", 3, "Oberstdorf liegt im Bereich der Allgäuer Alpen."],
      ],
      "Staatsgrenze, Höhenstufe und Großlandschaft sind verschiedene Karteninformationen.",
    ),
    tasks: tasks(
      "Beschreibe eine Reise von Hamburg über Erfurt und München nach Oberstdorf mit den vier Großlandschaften.",
      "Die Reise beginnt im Norddeutschen Tiefland und führt durch den Mittelgebirgsraum. München liegt im Alpenvorland, Oberstdorf in den Alpen. Die Höhen nehmen dabei nicht an jeder Stelle gleichmäßig zu; Becken und Täler unterbrechen das Relief.",
      [
        "Ich ordne alle vier Orte räumlich ein.",
        "Ich verwende die vier Großlandschaften richtig.",
        "Ich verwechsle Großlandschaft und Ortshöhe nicht.",
      ],
      "Ein Kartenausschnitt zeigt München grün und einen Wald braun. Warum kannst du daraus ohne Legende keine Vegetation ableiten?",
      "Farben haben ihre Bedeutung durch die Legende. Auf einer Höhenschichtenkarte kann Braun für höhere Lagen und Grün für tiefe Lagen stehen, auf einer Nutzungskarte dagegen für andere Eigenschaften. Ich prüfe Kartenart, Legende und Maßstab, bevor ich eine Aussage ableite.",
      [
        "Ich erkläre die Funktion der Legende.",
        "Ich unterscheide Relief und Landnutzung.",
        "Ich nenne eine weitere nötige Kartenangabe.",
      ],
    ),
  },
  {
    id: "geo-plattentektonik",
    lb: 1,
    title: "Warum Gebirge entstehen",
    period: "Endogene Kräfte · globaler Blick",
    intro:
      "Gebirge, Erdbeben und viele Vulkane folgen räumlichen Mustern. Die Bewegung von Lithosphärenplatten erklärt einen großen Teil davon.",
    paragraphs: [
      "Die feste äußere Erdhülle ist in Platten gegliedert. An divergierenden Grenzen bewegen sie sich auseinander; Magma kann aufsteigen und neue ozeanische Kruste bilden. An konvergierenden Grenzen taucht häufig eine ozeanische Platte ab. Beim Zusammenstoß kontinentaler Bereiche werden Gesteine gestaucht, gefaltet und gehoben. Seitliches Vorbeigleiten kann ebenfalls Erdbeben auslösen.",
      "Die Alpen entstanden über viele Millionen Jahre durch die Annäherung von Afrika beziehungsweise der Adriatischen Platte an Europa und die Schließung von Meeresräumen. Die Anden stehen mit der Subduktion der Nazca-Platte unter Südamerika in Verbindung. Nicht jeder Vulkan liegt an einer Plattengrenze; Hawaii ist ein Gegenbeispiel. Ein einzelner Berg beweist daher noch keine bestimmte Grenzart.",
    ],
    takeaway:
      "Plattenbewegungen sind endogene Vorgänge; die Landschaftsform entsteht im Zusammenspiel mit Abtragung.",
    sourceIds: ["lfu", "usgs"],
    quiz: check(
      "Welcher Vorgang gehört zu den endogenen Kräften?",
      "Hebung durch Plattenkollision",
      ["Abtragung durch Flusswasser", "Zerbrechen durch Frostwechsel"],
      "Endogene Kräfte kommen aus dem Erdinneren. Wasser und Frost verändern die Oberfläche von außen.",
    ),
    workshop: classify(
      "Plattengrenzen vergleichen",
      ["Auseinander", "Aufeinander zu", "Aneinander vorbei"],
      [
        [
          "Neuer Meeresboden am Mittelatlantischen Rücken",
          0,
          "Auseinanderdriften schafft Raum für aufsteigendes Magma.",
        ],
        [
          "Subduktion vor der Westküste Südamerikas",
          1,
          "Die ozeanische Nazca-Platte taucht unter Südamerika ab.",
        ],
        [
          "Seitliche Verschiebung an der San-Andreas-Verwerfung",
          2,
          "Die Platten gleiten seitlich aneinander vorbei.",
        ],
      ],
      "Grenztypen erklären unterschiedliche Prozesse, keine genauen Termine für Erdbeben.",
    ),
    tasks: tasks(
      "Vergleiche die Gebirgsbildung von Alpen und Anden.",
      "Beide Gebirge hängen mit konvergierenden Platten zusammen. Bei den Alpen spielt die Kollision kontinentaler Bereiche nach der Schließung von Meeresräumen eine zentrale Rolle. Bei den Anden taucht ozeanische Lithosphäre unter Südamerika ab; damit ist dort auch Vulkanismus verbunden.",
      [
        "Ich nenne die gemeinsame Plattenannäherung.",
        "Ich unterscheide Kollision und Subduktion.",
        "Ich ordne beide Gebirge räumlich zu.",
      ],
      "Auf einer Weltkarte häufen sich Erdbeben am Pazifikrand. Wie prüfst du eine Erklärung durch Plattenbewegungen?",
      "Ich lege eine Karte der Plattengrenzen daneben und vergleiche die Muster. Eine Häufung entlang von Grenzen stützt den Zusammenhang. Ich unterscheide die Grenzarten und beachte Ausnahmen sowie Erdbeben im Platteninneren; aus der Karte folgt keine Vorhersage eines einzelnen Bebens.",
      [
        "Ich vergleiche zwei räumliche Muster.",
        "Ich unterscheide Grenzarten und Ausnahmen.",
        "Ich begrenze die Aussagekraft der Karte.",
      ],
    ),
  },
  {
    id: "geo-erdgeschichte",
    lb: 1,
    title: "Landschaften haben ein langes Gedächtnis",
    period: "Erdzeitalter · Deutschland und Bayern",
    intro:
      "Ein Mittelgebirge, die jungen Alpen und eine eiszeitliche Moräne erzählen Geschichten auf unterschiedlichen Zeitskalen.",
    paragraphs: [
      "Im Erdaltertum entstanden bei der variszischen Gebirgsbildung große Gebirge. Ihre abgetragenen und später erneut gehobenen Reste prägen Teile der heutigen Mittelgebirge. Im Erdmittelalter lagerten sich in Meeren unter anderem Kalk- und Sandsteine ab; diese Gesteine können heute weit über dem Meer liegen.",
      "Die Alpenbildung gehört überwiegend in die Erdneuzeit, begann in ihren Vorstufen aber schon früher und dauert in veränderter Form an. Im Quartär überformten wiederholte Kaltzeiten das Relief: In Norddeutschland kam Eis aus Skandinavien, im Alpenvorland flossen Gletscher aus den Alpen. Moränen sind Ablagerungen von Gletschern; Schotterflächen wurden auch durch Schmelzwasser geschaffen. Nicht ganz Deutschland war gleichzeitig vom Eis bedeckt.",
    ],
    takeaway:
      "Das Alter eines Gesteins ist nicht automatisch das Alter der heutigen Oberflächenform.",
    sourceIds: ["lfu", "lfu-eis"],
    quiz: check(
      "Welcher Vorgang formte Teile des Alpenvorlands im Quartär?",
      "Gletscher und ihr Schmelzwasser",
      ["Die erstmalige Entstehung der Erde", "Der Beginn der variszischen Faltung"],
      "Quartäre Gletscher überprägten eine schon vorhandene Landschaft und hinterließen unter anderem Moränen.",
    ),
    workshop: timeline(
      [
        [
          "Variszische Gebirgsbildung im Erdaltertum",
          "Die variszische Gebirgsbildung liegt weit vor den quartären Kaltzeiten.",
        ],
        [
          "Meeresablagerungen des Erdmittelalters",
          "Spätere Sedimente können alte Gebirgsreste überdecken.",
        ],
        [
          "Hauptphasen der Alpenbildung in der Erdneuzeit",
          "Die Alpen entstanden in einem langen Prozess, nicht an einem einzelnen Tag.",
        ],
        [
          "Quartäre Gletscher überformen Norddeutschland und Alpenvorland",
          "Die jungen Eiszeitformen überprägen ältere Gesteine und Strukturen.",
        ],
      ],
      "Diese grobe Reihenfolge vereinfacht lange, teils überlappende Prozesse. Erdneuzeit umfasst auch das Quartär.",
    ),
    tasks: tasks(
      "Erkläre, warum man auf einem hohen Berg Meeresfossilien finden kann.",
      "Sedimente wurden zunächst in einem Meer abgelagert und können Fossilien enthalten. Spätere tektonische Hebung und Faltung brachten sie in größere Höhe. Abtragung legte die Schichten frei. Fossilien belegen damit die Entstehungsumgebung des Gesteins, nicht die heutige Höhenlage des damaligen Meeres.",
      [
        "Ich beginne mit der Meeresablagerung.",
        "Ich erkläre spätere Hebung und Freilegung.",
        "Ich unterscheide Gesteinsalter und heutige Form.",
      ],
      "Zwei Orte liegen auf gleichem altem Gestein, aber einer in einer glazial geformten Senke. Warum ist ihre Landschaft dennoch verschieden?",
      "Das Ausgangsgestein allein legt das Relief nicht fest. Gletscher, Schmelzwasser, Hebung und spätere Flusserosion können gleich alte Gesteine unterschiedlich überformen. Ich prüfe deshalb sowohl geologische Karten als auch Spuren jüngerer Oberflächenprozesse.",
      [
        "Ich trenne Material und Form.",
        "Ich nenne einen jüngeren formenden Prozess.",
        "Ich schlage einen geeigneten Kartenvergleich vor.",
      ],
    ),
  },
  {
    id: "geo-abtragung",
    lb: 1,
    title: "Vom Fels zum Flusssediment",
    period: "Exogene Prozesse · Ursache und Wirkung",
    intro:
      "Wasser, Eis, Wind und Schwerkraft verändern das Relief. Verwitterung, Erosion und Ablagerung sind dabei verschiedene Schritte.",
    paragraphs: [
      "Verwitterung zerkleinert oder verändert Gestein an Ort und Stelle, zum Beispiel durch Frostsprengung oder chemische Lösung. Erosion trägt Material ab. Transport verlagert es, Sedimentation lagert es wieder ab. Ein Fluss kann an einer Stelle erodieren und wenige Meter weiter Material ablagern; Gefälle, Abfluss und Korngröße wirken zusammen.",
      "Gletscher schleifen und transportieren Material, Wind kann ungeschützte feine Bodenpartikel ausblasen. Pflanzenwurzeln und Bodenbedeckung können den Abtrag vermindern, steile unbewachsene Hänge sind häufig anfälliger. Bei einem Starkregen reichen daher die Niederschlagsdaten allein nicht aus: Boden, Hangneigung, Vorfeuchte und Nutzung sind ebenfalls wichtig.",
    ],
    takeaway:
      "Verwitterung erzeugt loses Material; Erosion entfernt es. Beides ist nicht dasselbe.",
    sourceIds: ["lfu", "boden"],
    quiz: check(
      "Was ist mit Erosion gemeint?",
      "Abtragung von Boden oder Gestein",
      ["Entstehung neuer Kruste im Erdinneren", "Abkühlung der Luft ohne Materialbewegung"],
      "Erosion entfernt Material. Eine spätere Ablagerung wird Sedimentation genannt.",
    ),
    workshop: timeline(
      [
        [
          "Frostwechsel lockert ein Gesteinsstück",
          "Die Verwitterung verändert das Gestein zunächst am Ort.",
        ],
        ["Wasser nimmt das gelockerte Material auf", "Nun beginnt die Abtragung."],
        [
          "Der Fluss transportiert die Teilchen talwärts",
          "Der Transport verbindet Abtragungs- und Ablagerungsort.",
        ],
        [
          "Bei geringerer Transportkraft lagert sich Material ab",
          "Sedimentation erfolgt abhängig von Strömung und Korngröße.",
        ],
      ],
      "Die Übung zeigt einen möglichen Weg. In der Natur können Teilchen mehrfach abgelagert und wieder aufgenommen werden.",
    ),
    tasks: tasks(
      "Unterscheide Verwitterung, Erosion und Sedimentation an einem Flussbeispiel.",
      "Frost kann ein Gestein am Hang zerlegen: Das ist Verwitterung. Abfließendes Wasser nimmt Teilchen auf und trägt sie ab: Das ist Erosion mit anschließendem Transport. Wo die Strömung nicht mehr ausreicht, lagern sich Teilchen ab: Das ist Sedimentation.",
      [
        "Ich unterscheide die drei Begriffe.",
        "Ich verbinde sie durch einen Transportweg.",
        "Ich nenne die veränderte Transportkraft.",
      ],
      "Warum ist nach demselben Regen nicht auf jedem Acker gleich viel Boden verloren?",
      "Bodenart, Hangneigung, Vorfeuchte und Bodenbedeckung verändern Versickerung und Abfluss. Ein bedeckter, wenig geneigter Boden kann besser geschützt sein als ein offener steiler Hang. Für den Vergleich brauche ich örtliche Angaben und darf die Unterschiede nicht allein dem Wetter zuschreiben.",
      [
        "Ich nenne mindestens zwei Standortfaktoren.",
        "Ich erkläre ihren Einfluss auf den Abtrag.",
        "Ich benenne fehlende örtliche Daten.",
      ],
    ),
  },
  {
    id: "geo-eingriffe",
    lb: 1,
    title: "Wenn Menschen Flüsse und Landschaften umbauen",
    period: "Versiegelung · Tagebau · Renaturierung",
    model: "runoff",
    intro:
      "Ein Flussausbau oder eine neue Siedlung löst ein Problem und kann zugleich neue Folgen an anderer Stelle schaffen.",
    paragraphs: [
      "Begradigung und Eindeichung können örtliche Nutzflächen schützen und Schifffahrt erleichtern. Gehen Überschwemmungsflächen verloren und fließt Wasser schneller ab, können sich Risiken flussabwärts verlagern. Entsiegelung, Rückhalteräume und naturnähere Auen sollen Wasser länger in der Landschaft halten; ihre Wirkung hängt von Einzugsgebiet und Ereignis ab.",
      "Tagebau entfernt Böden und Gestein, verändert Relief und kann den Grundwasserhaushalt beeinflussen. Rekultivierung schafft wieder nutzbare Flächen, etwa Wald oder Landwirtschaft; Renaturierung zielt stärker auf natürliche Prozesse und Lebensräume. Ein rekultivierter Tagebau ist dadurch nicht automatisch der ursprüngliche Naturraum. Vergleiche Nutzen, räumliche Folgen und langfristigen Pflegebedarf.",
      "Das Abflussmodell ist ein durchschaubares Rechenbeispiel mit erfundenen Abflussbeiwerten. Es zeigt, wie versiegelte Fläche und Vorfeuchte bei gleichem Regen den schnellen Abfluss verändern können. Es berechnet keine Hochwasserhöhe und ersetzt keine Gefahrenkarte.",
    ],
    takeaway:
      "Eine lokale Schutzmaßnahme muss auch an ihren Folgen für Nachbarorte und Ökosysteme gemessen werden.",
    sourceIds: ["hochwasser", "lfu", "boden"],
    quiz: check(
      "Welche Maßnahme kann natürlichen Wasserrückhalt unterstützen?",
      "Auen als Überschwemmungsraum erhalten",
      ["Jede Freifläche lückenlos asphaltieren", "Jeden Fluss ohne Rückhalteflächen verkürzen"],
      "Auen können Wasser zeitweise aufnehmen. Ein vollständiger Schutz vor jedem Hochwasser folgt daraus nicht.",
    ),
    workshop: classify(
      "Ziel und Eingriff unterscheiden",
      [
        "Schnellen Abfluss fördern",
        "Wasser zurückhalten",
        "Folgen eines Rohstoffabbaus bearbeiten",
      ],
      [
        [
          "Parkplatz ohne versickerungsfähige Oberfläche",
          0,
          "Auf einer dichten Oberfläche versickert wenig Wasser.",
        ],
        [
          "Eine abgetrennte Aue wieder an den Fluss anschließen",
          1,
          "Die Aue kann zeitweise Wasser aufnehmen.",
        ],
        [
          "Einen Tagebaustandort mit Bodenaufbau wieder bepflanzen",
          2,
          "Das ist ein Beispiel für Rekultivierung.",
        ],
      ],
      "Maßnahmen brauchen einen Standortvergleich; ein gutes Schlagwort allein belegt ihre Wirkung nicht.",
    ),
    tasks: tasks(
      "Erkläre zwei mögliche Folgen einer Flussbegradigung und eine Alternative.",
      "Ein kürzerer Flusslauf kann Wasser schneller weiterleiten und örtliche Nutzungen erleichtern. Fehlende Auen verringern aber mögliche Rückhalteräume und können die Belastung flussabwärts erhöhen. Wo es räumlich möglich ist, können wieder angeschlossene Auen ergänzend Wasser zurückhalten; ihre konkrete Wirkung muss geprüft werden.",
      [
        "Ich nenne Nutzen und mögliche Folgewirkung.",
        "Ich berücksichtige flussabwärts gelegene Orte.",
        "Ich begründe eine Alternative mit ihrer Grenze.",
      ],
      "Eine Gemeinde bezeichnet ihren begrünten Tagebau als vollständig wiederhergestellte Natur. Wie prüfst du diese Aussage?",
      "Ich vergleiche Bodenaufbau, Wasserhaushalt, Arten und natürliche Prozesse mit einem geeigneten Referenzraum. Neue Vegetation belegt eine Nachnutzung, aber nicht die vollständige Wiederherstellung des früheren Systems. Ich frage nach Pflege, Zeitraum und messbaren Zielen statt nur ein grünes Foto zu bewerten.",
      [
        "Ich unterscheide Begrünung und Wiederherstellung.",
        "Ich nenne zwei prüfbare Umweltmerkmale.",
        "Ich berücksichtige Zeit und Pflegebedarf.",
      ],
    ),
  },
];
