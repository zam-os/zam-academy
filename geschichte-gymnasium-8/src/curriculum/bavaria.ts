import { classify, lesson, timeline } from "./helpers";

export const bavaria = [
  lesson(3, {
    id: "bayern-karten", title: "Wie Bayerns Staatsgebiet wuchs und schrumpfte", period: "8. Jahrhundert bis nach 1945", sourceIds: ["territory", "postwar", "curriculum"],
    intro: "Vergleiche mehrere Zeitstände und verorte Franken, Schwaben, Altbayern und die Pfalz.",
    paragraphs: [
      "Ein Längsschnitt verfolgt ein Thema über mehrere Epochen. Im frühen Mittelalter lag der Kern des bayerischen Herzogtums im Südosten des heutigen Bayern und reichte über heutige Grenzen hinaus. Karl der Große setzte Tassilo III. 788 ab und wurde 800 zum Kaiser gekrönt. Das Herzogtum wandelte sich unter neuen Herrschaftsverhältnissen.",
      "Im 17. und 18. Jahrhundert lagen auf dem Gebiet des heutigen Bayern verschiedene Territorien, darunter geistliche Gebiete und freie Reichsstädte. Der Dreißigjährige Krieg von 1618 bis 1648 und seine Friedensordnung veränderten Macht und Stellung der Fürsten. Bayerns Herrscher behielten die im Krieg erlangte Kurwürde.",
      "Um 1800 kamen durch Säkularisation und territoriale Neuordnung Teile Frankens und Schwabens hinzu. Bayern wurde 1806 Königreich. Nach dem Wiener Kongress erhielt Bayern 1816 die linksrheinische Pfalz. Sie ging nach 1945 im neuen Land Rheinland-Pfalz auf.",
    ],
    takeaway: "Heutige Landesgrenzen sind das Ergebnis vieler Veränderungen. Lege für einen Kartenvergleich dieselbe Region und zwei feste Zeitpunkte fest.",
    check: ["Was zeigt der Vergleich der Kartenstände?", "Die Pfalz gehörte zeitweise zu Bayern, obwohl sie vom Hauptgebiet getrennt lag.", ["Franken gehörte seit dem frühen Mittelalter vollständig zu Bayern.", "Die heutigen Landesgrenzen bestanden schon beim Wiener Kongress."], "Bayern erhielt die linksrheinische Pfalz 1816. Nach dem Zweiten Weltkrieg lag sie in Rheinland-Pfalz."],
    workshop: timeline([
      ["Tassilo III. verliert seine Herrschaft.", "788: Das Herzogtum gerät unmittelbar unter fränkische Herrschaft."],
      ["Der Dreißigjährige Krieg endet.", "1648: Der Westfälische Friede bestätigt Bayerns Kurwürde."],
      ["Bayern wird Königreich.", "1806: Bayern verändert sich im Umfeld der napoleonischen Neuordnung."],
      ["Die linksrheinische Pfalz kommt zu Bayern.", "1816: Bayern erhält ein vom Hauptgebiet getrenntes Territorium."],
      ["Die Pfalz wird Teil von Rheinland-Pfalz.", "1946: Nach dem Krieg entsteht Rheinland-Pfalz."],
    ], "Grenzen ändern sich durch Kriege, durch politische Verträge und durch Neuordnungen."),
    guided: ["Vergleiche die Lage der Pfalz auf der Übersicht für 1816 und nach 1945. Formuliere, was sich änderte.", ["Wo liegt die Pfalz im Verhältnis zum Rhein?", "Welche Zugehörigkeit zeigt jeder Zeitstand?"], "Die Pfalz liegt westlich des Rheins, räumlich getrennt vom bayerischen Hauptgebiet. 1816 gehörte sie zu Bayern. Nach 1945 wurde sie Teil von Rheinland-Pfalz.", ["Räumliche Lage", "Beide Zeitstände", "Veränderung beschrieben"]],
    transfer: ["Suche im Geschichtsatlas die Region, in der du wohnst, für zwei Zeitstände. Beschreibe dieselbe Region zu beiden Zeiten. Nutze Bamberg als Beispiel, wenn du gerade keinen Atlas hast.", ["Wie lauten Titel und Zeitstand der Karten?", "Welche Farbe oder Grenze erklärt die Legende?"], "Bamberg gehörte im späten 18. Jahrhundert zum geistlichen Hochstift Bamberg. Nach der Neuordnung um 1800 lag es in Bayern. Im Atlas prüfe ich die Legende, weil ein Stadtsymbol allein keine politische Zugehörigkeit bezeichnet.", ["Zwei Zeitstände", "Zugehörigkeiten zugeordnet", "Kartenbeleg erklärt"]],
  }),
  lesson(3, {
    id: "bayern-wappen", title: "Welche Geschichten erzählt das Bayernwappen?", period: "Historische Regionen · Gegenwart", sourceIds: ["coat", "curriculum"],
    intro: "Lies die Wappenfelder und entwirf eine Ergänzung für ein Bild vom heutigen Bayern.",
    paragraphs: [
      "Das große bayerische Staatswappen bündelt verschiedene historische Zeichen. Der goldene Löwe erinnert an die Pfalz und heute vor allem an die Oberpfalz. Der fränkische Rechen steht für Franken, der blaue Panther für Altbayern und die drei schwarzen Löwen für Schwaben. Im Herzschild stehen die weiß-blauen Rauten.",
      "Die historischen Regionen erzählen nur einen Teil der Bevölkerungsgeschichte. Nach dem Zweiten Weltkrieg kamen viele Flüchtlinge und Heimatvertriebene nach Bayern. Spätaussiedler und weitere Zuwanderer brachten zu verschiedenen Zeiten eigene Erfahrungen und Traditionen mit.",
      "Beispiel: Der fränkische Rechen hilft, eine historische Zugehörigkeit zu erklären. Wie Menschen einer Stadt sich heute selbst beschreiben, erfährst du aus Gesprächen, Geschichten oder anderen Belegen. Beides kann in einem Entwurf Platz haben.",
    ],
    takeaway: "Wappen verdichten Geschichte zu Symbolen. Identität entsteht auch durch persönliche Erfahrungen, Beziehungen und verschiedene Traditionen.",
    check: ["Welche Frage beantwortet das Wappen direkt?", "Welche historischen Regionen durch bestimmte Zeichen vertreten sind.", ["Wie viele Menschen heute in Bayern zugewandert sind.", "Welche Tradition jede bayerische Familie pflegt."], "Ein Wappen verwendet Symbole. Eine Statistik oder ein Gespräch beantwortet andere Fragen."],
    workshop: classify("Wappen und Lebensgeschichten lesen", ["Historisches Wappenzeichen", "Spätere Bevölkerungsgeschichte", "Persönliche Perspektive"], [
      ["Der fränkische Rechen verweist auf Franken.", 0, "Das rot-weiße Zeichen macht einen historischen Landesteil sichtbar."],
      ["Heimatvertriebene bauen nach 1945 in Bayern ein neues Leben auf.", 1, "Diese Erfahrung gehört zur Geschichte der Bevölkerung."],
      ["Eine Schülerin fühlt sich mit mehreren Orten und Traditionen verbunden.", 2, "Zugehörigkeit kann mehrere Ebenen haben und wird individuell erlebt."],
      ["Die drei schwarzen Löwen stehen für Schwaben.", 0, "Es ist ein historisches Zeichen, dessen Bedeutung die amtliche Beschreibung erklärt."],
    ], "Mehrere historische Zeichen können nebeneinanderstehen. Für heutige Zugehörigkeiten braucht es weitere Stimmen."),
    guided: ["Beurteile mit zwei Beispielen, was das Staatswappen über Bayern zeigt und welche Erfahrungen darin schwer erkennbar sind.", ["Wähle ein Wappenzeichen.", "Denke an eine Bevölkerungsgruppe nach 1945."], "Der fränkische Rechen macht eine historische Region sichtbar. Die Erfahrungen vieler Heimatvertriebener nach 1945 lassen sich an diesem Wappenfeld nicht ablesen. Das Wappen eignet sich daher zur Erklärung historischer Regionen, aber nur begrenzt zur Beschreibung der heutigen Bevölkerung.", ["Wappenzeichen eingeordnet", "Spätere Erfahrung genannt", "Reichweite beurteilt"]],
    transfer: ["Entwirf für eine Klassenpräsentation ein zusätzliches Zeichen für eine heutige Form von Zugehörigkeit. Begründe, warum es neben den historischen Zeichen stehen könnte.", ["Welche Erfahrung fehlt in deinem Beispiel?", "Warum kann ein Symbol nie für alle stehen?"], "Ein Symbol aus zwei verbundenen Wegen könnte zeigen, dass Menschen mehrere Heimatorte haben können. Es würde die historischen Zeichen um Erfahrungen von Zuwanderung und neuen Verbindungen ergänzen. Andere Menschen könnten ihre Zugehörigkeit mit einem anderen Bild ausdrücken.", ["Konkreter Entwurf", "Zusammenhang mit Zugehörigkeit", "Grenzen reflektiert"]],
  }),
  lesson(3, {
    id: "bayern-denkmaeler", title: "Was Gebäude über Bayern erzählen", period: "Mittelalter bis 19. Jahrhundert", sourceIds: ["monuments", "territory", "curriculum"],
    intro: "Vergleiche eine gewachsene Altstadt mit einem absichtlich gesetzten Denkmal.",
    paragraphs: [
      "Regensburg zeigt in seiner Altstadt Spuren von Handel, Stadtentwicklung und mittelalterlichem Leben. Die Walhalla bei Donaustauf ließ Ludwig I. im 19. Jahrhundert als Erinnerungsbau errichten. Ihre Form erinnert an einen antiken Tempel, obwohl das Bauwerk viel jünger ist.",
      "An einem Bauwerk kannst du Material, Lage, Form und Veränderungen beobachten. Wer es in Auftrag gab und welche Absicht dahinterstand, klärst du mithilfe weiterer Quellen. Bei der Walhalla erklärt der Auftrag, warum die Tempelform an bedeutende Personen erinnern sollte.",
      "Denkmalschutz erhält Baudenkmäler und ihre Aussagekraft. Eigentümer, Öffentlichkeit und Denkmalpflege müssen abwägen, wie Nutzung, Zugänglichkeit und Schutz zusammengehen. Für ein Beispiel aus deinem Ort kannst du die Bayerische Denkmalliste mit eigenen Beobachtungen vergleichen.",
    ],
    takeaway: "Trenne sichtbare Merkmale, historische Deutung und heutiges Urteil über den Schutz.",
    check: ["Was kannst du aus der Tempelform der Walhalla ableiten?", "Der Bau greift eine ältere Form als Gestaltungsmittel auf.", ["Der Bau stammt aus dem antiken Griechenland.", "Alle Besucher deuteten das Bauwerk gleich."], "Die Form weist auf ein Vorbild. Bauzeit und Wirkung müssen durch weitere Belege geklärt werden."],
    workshop: classify("Beobachtung, Deutung und Urteil trennen", ["Beobachtung", "Historische Deutung", "Urteil zum Schutz"], [
      ["Am Bau stehen Säulen vor einer dreieckigen Giebelfläche.", 0, "Das ist ein sichtbares Merkmal."],
      ["Die Tempelform sollte dem Gedenken einen feierlichen Rahmen geben.", 1, "Eine Absicht wird mit der Form und dem Auftrag begründet."],
      ["Eine neue Rampe sollte den Zugang erleichtern und vorhandene Bauteile schonen.", 2, "Hier werden Nutzung und Erhaltung gegeneinander abgewogen."],
    ], "Eine gute Deutung kehrt zu einem beobachtbaren Merkmal oder einem belegten Kontext zurück."),
    guided: ["Vergleiche Regensburg und die Walhalla. Erkläre, welche Frage du jeweils an das Denkmal stellen könntest.", ["Was ist über lange Zeit gewachsen?", "Welcher Auftrag erklärt die Form der Walhalla?"], "In Regensburg frage ich, wo Handel und Stadtentwicklung Spuren hinterließen. Bei der Walhalla frage ich, warum Ludwig I. eine antike Tempelform für einen Erinnerungsbau wählte. Das eine Beispiel beleuchtet gewachsene Stadtgeschichte, das andere eine geplante Erinnerung.", ["Beide Beispiele", "Je eine historische Frage", "Unterschied erklärt"]],
    transfer: ["Bereite eine kurze Vorstellung über ein Bauwerk in deiner Nähe vor. Nutze die Denkmalliste oder erkläre am Beispiel Walhalla, welche Angaben du nachprüfen würdest.", ["Welche Merkmale kannst du beschreiben?", "Was würdest du über Bauzeit, Nutzung und Veränderungen belegen?"], "Für die Walhalla würde ich Säulen und Lage beobachten und Bauzeit sowie Auftrag in der Denkmalliste oder bei der Schlösserverwaltung prüfen. In einer Vorstellung würde ich erst das sichtbare Merkmal zeigen und dann den historischen Zweck erklären. So ist die Deutung nachvollziehbar.", ["Beobachtung geplant", "Zwei Angaben zur Recherche", "Präsentation mit Beleg vorbereitet"]],
  }),
];
