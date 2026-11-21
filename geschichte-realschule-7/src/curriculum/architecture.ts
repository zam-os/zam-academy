import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 6: Bauwerke als Ausdruck politischen und religiösen Denkens (Längsschnitt). */
export const architecture: Lesson[] = [
  {
    id: "g7-bauwerke-antike-mittelalter",
    lb: 6,
    title: "Bauwerke von Antike und Mittelalter als Herrschaftsspiegel",
    period: "Längsschnitt · 5. Jh. v. Chr. bis 1400 n. Chr.",
    span: [-450, 1400],
    intro:
      "Ob ein griechischer Tempel in Athen oder die Pfalzkapelle Karls des Großen in Aachen: Bauwerke machen sichtbar, wer in einer Gesellschaft herrscht und wofür ein Gemeinwesen steht.",
    paragraphs: [
      "Gebäude in unserer Umgebung sind mehr als Stein und Holz – sie verraten das politische und gesellschaftliche Selbstverständnis ihrer Bauherren. Zur Blütezeit Athens im 5. Jahrhundert v. Chr. entstand auf der Akropolis der Parthenon-Tempel: Die gesamte Bürgerschaft der Polis beschloss in der Demokratie den Bau auf einem öffentlichen Berg für alle Bürger sichtbar – nicht als Privatpalast eines einzelnen Königs, sondern als Zeichen gemeinsamer Verantwortung und Macht der Stadt.",
      "Ganz anders stellten Herrscher des Mittelalters ihre Ordnung dar. Als Karl der Große vor seiner Kaiserkrönung im Jahr 800 in Aachen seine Königspfalz mit der achteckigen Pfalzkapelle errichten ließ, knüpfte der König und spätere Kaiser bewusst an das antike Rom und christliche Kirchenbauten an. Die Thronempore über dem Altarraum zeigte sichtbar: Der Herrscher steht zwischen Gott und den Untertanen in einer von Adel und Aristokratie getragenen Monarchie.",
      "Auch mittelalterliche Klöster, Rathäuser und Stadtpaläste der Aristokratie verdeutlichen diese gesellschaftliche Ordnung. Während eine wehrhafte Burg die Macht eines adligen Grundherrn über das Umland markierte, drückten später prächtige gotische Rathäuser und Bürgerhäuser das wachsende Selbstbewusstsein der Stadtgemeinden aus. Wer Bauwerke anhand von Fotos, Grundrissen und Skizzen vergleicht, liest somit politische Geschichte direkt aus dem Stadtbild ab.",
    ],
    takeaway:
      "Vom demokratischen Tempel der griechischen Polis bis zur Kaiserpfalz von 800 und zur mittelalterlichen Burg spiegeln Bauwerke das Herrschaftsverständnis ihrer Epoche wider.",
    sourceIds: ["lehrplan", "pw-gotik", "pw-burg", "bamberg"],
    quiz: check(
      "Was drückt der Vergleich zwischen einem Tempel der Athener Polis im 5. Jh. v. Chr. und der Aachener Pfalz um 800 aus?",
      "Der Tempel stand für eine Bürgergemeinde in der Demokratie, die Pfalz für christliches Kaisertum und Monarchie.",
      [
        "Beide Bauwerke dienten als geheime Festungen für adelige Ritterfamilien und ihre Privatheere.",
        "Der Parthenon war ein barockes Schloss für einen absolutistischen Monarchen der Antike.",
      ],
      [
        "Weder die klassische Akropolis noch die Aachener Königspfalz waren private Ritterburgen im hochmittelalterlichen Sinn.",
        "Der Barock entstand erst im 17./18. Jahrhundert, und das klassische Athen war eine Demokratie ohne absolutistischen König.",
      ],
      "Bauherren, Lage, Grundriss und Nutzung eines historischen Gebäudes geben unmittelbar Auskunft über die jeweilige Staats- und Gesellschaftsform.",
    ),
    diagram: {
      kind: "compare",
      title: "Architektur und Herrschaftsform im Längsschnitt",
      columns: ["Antike · Athen (5. Jh. v. Chr.)", "Mittelalter · Reich (ab 800 n. Chr.)"],
      rows: [
        {
          aspect: "Staatsform",
          values: ["Polis mit Demokratie der Vollbürger", "Monarchie mit König, Kaiser, Aristokratie und Kirche"],
        },
        {
          aspect: "Typisches Bauwerk",
          values: ["griechischer Tempel (Parthenon) und Agora", "Kaiserpfalz (Aachen), Burg, Dom und Kloster"],
        },
        {
          aspect: "Sichtbare Botschaft",
          values: ["gemeinschaftlicher Stolz der Bürgerschaft", "gottgegebene Rangordnung zwischen Herrscher und Ständen"],
        },
      ],
      caption:
        "Ein Vergleich anhand von Plänen, Gemälden und Fotografien zeigt, wie eng Architektur und politische Ordnung verknüpft sind.",
    },
    workshop: classify(
      "Bauwerke ihrer Epoche und Herrschaftsform zuordnen",
      ["Antike (5. Jh. v. Chr.)", "Mittelalter (ca. 800–1450)", "Methodischer Vergleich"],
      [
        [
          "Die Volksversammlung der Polis Athen stimmt über den Neubau von Tempeln auf der Akropolis ab.",
          0,
          "In der antiken Demokratie beschlossen Bürger gemeinsam über öffentliche Heiligtümer.",
        ],
        [
          "In der Aachener Pfalzkapelle blickt der Thron Karls des Großen von oben auf den Altarraum.",
          1,
          "Die Architektur um 800 stellt den christlichen Kaiser direkt in die göttliche Ordnung.",
        ],
        [
          "Mächtige Wehrtürme einer Burg überragen die Bauernhütten eines Dorfes auf einem Bergsporn.",
          1,
          "Burgen verkörperten im Mittelalter adlige Schutzherrschaft und Überlegenheit der Aristokratie.",
        ],
        [
          "Ein stolzes gotisches Rathaus am Marktplatz zeigt den Bürgern und dem Bischof die Selbstverwaltung der Stadt.",
          1,
          "Städte drückten im Spätmittelalter ihren eigenen politischen Anspruch in Rathäusern aus.",
        ],
        [
          "Du vergleichst Grundriss, Standort, Auftraggeber und Zugangsmöglichkeiten zweier öffentlicher Gebäude.",
          2,
          "Mit festen Analysekriterien erschließt du Fotografien, Skizzen und Baupläne systematisch.",
        ],
      ],
      "Wer Auftraggeber, Grundriss und Lage eines Gebäudes prüft, erkennt die politische Ordnung hinter den Mauern.",
    ),
    tasks: {
      1: writing(
        "Erkläre am Beispiel eines griechischen Tempels aus dem 5. Jh. v. Chr. und einer mittelalterlichen Pfalz oder Burg, was Bauwerke über ihre Bauherren verraten.",
        [
          "Verwende Begriffe wie Polis, Demokratie, Monarchie oder Kaiser.",
          "Nenne jeweils ein konkretes Merkmal der Gestaltung oder Lage.",
        ],
        "Der Parthenon-Tempel in der griechischen Polis Athen aus dem 5. Jh. v. Chr. wurde von der Demokratie der Bürger beschlossen und stand sichtbar für das ganze Gemeinwesen. Eine mittelalterliche Königspfalz wie Aachen um 800 oder eine Burg spiegelte dagegen die Monarchie und Aristokratie wider: Thronempore, dicke Mauern und erhöhte Lage zeigten den Vorrang von König, Kaiser und Adel über die übrigen Stände.",
        [
          "Antiken Tempel und Demokratie verbunden",
          "Mittelalterlichen Bau und Monarchie/Adel erklärt",
          "Konkretes Baumerkmal genannt",
        ],
      ),
      2: writing(
        "Vergleiche das Rathaus deiner Stadt oder ein öffentliches Gebäude von heute mit einer mittelalterlichen Burg oder einem Palast im Hinblick auf Offenheit und Herrschaftsverständnis.",
        [
          "Achte auf Mauern, Zugänge, Glasflächen und wer das Gebäude betreten darf.",
          "Erkläre den Unterschied zwischen Untertanen und gleichberechtigten Bürgern.",
        ],
        "Eine mittelalterliche Burg oder ein Adelspalast grenzte sich durch Gräben, dicke Mauern und bewachte Tore von den Dorfbewohnern ab, weil wenige Adlige herrschten. Ein heutiges Rathaus oder Landtagsgebäude besitzt dagegen offene Eingänge, große Glasfenster und öffentliche Sitzungssäle für Besucher. Darin zeigt sich, dass politische Macht heute demokratisch kontrolliert wird und für alle Bürger transparent sein soll.",
        [
          "Abgrenzung historischer Bauten beschrieben",
          "Offenheit heutiger öffentlicher Bauten erklärt",
          "Zusammenhang mit dem Herrschaftsverständnis hergestellt",
        ],
      ),
    },
  },
  {
    id: "g7-bauwerke-religionen",
    lb: 6,
    title: "Kirche, Synagoge und Moschee: Gebaute Religion",
    period: "Längsschnitt · Christentum, Judentum, Islam",
    span: [700, 2026],
    intro:
      "Drei Weltreligionen prägen das Bild vieler Städte bis heute. Wie unterscheiden sich eine christliche Kirche, eine jüdische Synagoge und eine islamische Moschee – und was verbindet sie?",
    paragraphs: [
      "Religiöse Bauwerke verraten nicht nur über Baumeister, sondern vor allem über Glauben und Gemeindeleben. Im Christentum ist eine Kirche ein geweihter Raum rund um den Altar, der meist nach Osten ausgerichtet ist, weil dort die Sonne als Zeichen für Christus aufgeht. In Romanik, Gotik oder Barock prägten Glockentürme, Kreuzgrundriss und Bilder oder Statuen aus der Bibel das Erscheinungsbild.",
      "Im Judentum ist die Synagoge ein Haus der Versammlung, des Gebets und des gemeinsamen Lernens der heiligen Schriften. Im Mittelpunkt steht der Toraschrein an der Wand Richtung Jerusalem, davor das Lesepult (Bima) und das ewige Licht. Anders als in vielen Kirchen gibt es keine figürlichen Darstellungen Gottes; im Mittelalter lagen Synagogen oft versteckt in jüdischen Vierteln, damit sie weniger auffielen oder geschützt blieben.",
      "Im Islam richtet sich eine Moschee in ihrer Gebetshalle durch die Gebetsnische (Mihrab) genau nach Mekka aus. Eine weite Kuppel, ein Brunnen für die rituelle Waschung vor dem Gebet sowie schlanke Minarette für den Gebetsruf sind typische Kennzeichen. Auch hier verzichten Künstler aus religiöser Achtung auf Abbilder Gottes und verzieren Wände stattdessen mit kunstvollen geometrischen Mustern und arabischer Schrift.",
    ],
    takeaway:
      "Kirche, Synagoge und Moschee zeigen gemeinsame Anliegen als Versammlungsorte des Gebets und unterscheiden sich durch Raumaufbau, Ausrichtung und Umgang mit Bildern.",
    sourceIds: ["lehrplan", "pw-christentum", "pw-judentum", "pw-islam"],
    quiz: check(
      "Welche Gemeinsamkeit verbindet die Architektur der meisten traditionellen Synagogen und Moscheen im Unterschied zu vielen christlichen Kirchen?",
      "Der Verzicht auf figürliche Gottesdarstellungen und die Ausrichtung auf eine bestimmte heilige Stadt.",
      [
        "Beide Bauwerke werden grundsätzlich ohne Dach unter freiem Himmel errichtet.",
        "In beiden Gebäuden stehen ein steinerner Hochaltar und drei hohe Glockentürme in der Mitte.",
      ],
      [
        "Sowohl Synagogen als auch Moscheen besitzen geschlossene, oft kunstvoll gestaltete Gebetssäle.",
        "Hochaltar und Glockenturm sind typische Merkmale christlicher Kirchen, nicht von Synagogen oder Moscheen.",
      ],
      "Judentum und Islam bewahren das strenge Bilderverbot für Gott und richten den Gebetsraum auf Jerusalem beziehungsweise Mekka aus.",
    ),
    workshop: classify(
      "Merkmale christlicher, jüdischer und islamischer Sakralbauten",
      ["Christliche Kirche", "Jüdische Synagoge", "Islamische Moschee"],
      [
        [
          "Altarraum, meist im Osten, Kreuzgrundriss und häufig Darstellungen biblischer Szenen.",
          0,
          "Altäre, Glockentürme und figürliche Kunst prägen zahlreiche christliche Kirchen.",
        ],
        [
          "Toraschrein an der nach Jerusalem zeigenden Wand und ein Lesepult in der Mitte.",
          1,
          "In der Synagoge stehen das Vorlesen aus der Torarolle und das Gemeindegespräch im Mittelpunkt.",
        ],
        [
          "Gebetsnische (Mihrab) Richtung Mekka, Teppichboden ohne Bänke und kunstvolle Kalligraphie.",
          2,
          "Gläubige beten in der Moschee in geordneten Reihen gemeinsam in Richtung Mekka.",
        ],
        [
          "Im Mittelalter wurden Versammlungsräume manchmal unauffällig zwischen Häusern gebaut, da christliche Nachbarn Anstoß nahmen.",
          1,
          "Synagogen spiegelten oft auch die gefährdete rechtliche Stellung jüdischer Minderheiten wider.",
        ],
        [
          "Ein Minarett und ein Waschbrunnen im Hof gehören zu vielen historischen Bauten dieser Religion.",
          2,
          "Vor dem Gebet reinigen sich Muslime am Brunnen; vom Minarett erschallte traditionell der Gebetsruf.",
        ],
      ],
      "Der kriteriengeleitete Vergleich schärft den Respekt für religiöse Traditionen und macht historische Stadtbilder verständlicher.",
    ),
    tasks: {
      1: writing(
        "Vergleiche anhand zweier Kriterien (Ausrichtung des Raums und Ausstattung mit Bildern) eine christliche Kirche mit einer Synagoge oder einer Moschee.",
        [
          "Nenne zuerst ein gemeinsames Ziel aller drei Bauwerke.",
          "Stelle dann Ausstattung und Ausrichtung klar gegenüber.",
        ],
        "Alle drei Bauwerke dienen als Versammlungs- und Gebetsorte einer Glaubensgemeinschaft. Eine christliche Kirche richtet den Altarraum meist nach Osten aus und schmückt Wände oder Altäre oft mit Bildern und Figuren. Eine Synagoge besitzt dagegen einen Toraschrein Richtung Jerusalem und eine Moschee eine Gebetsnische Richtung Mekka – beide verzichten auf bildliche Darstellungen Gottes.",
        [
          "Gemeinsame Funktion benannt",
          "Raumausrichtung korrekt verglichen",
          "Unterschied beim Umgang mit Bildern erklärt",
        ],
      ),
      2: writing(
        "Erkläre, warum man allein am Aussehen und an der Lage einer mittelalterlichen Synagoge oder einer heutigen Moschee in Deutschland ablesen kann, wie die jeweilige Gesellschaft mit religiösen Minderheiten umgeht.",
        [
          "Vergleiche versteckte Hinterhof-Synagogen im Mittelalter mit heute öffentlich sichtbaren Bauten.",
          "Beziehe die Religionsfreiheit mit ein.",
        ],
        "Im Mittelalter durften Synagogen mancherorts nicht höher oder prächtiger als umliegende Häuser oder gar Kirchen sein, was ihre unsichere Rechtsstellung spiegelte. Wenn heute Kirchen, Synagogen und Moscheen sichtbar und geschützt nebeneinander stehen, drückt das den Verfassungsgrundsatz der Religionsfreiheit und Gleichberechtigung aus – auch wenn Debatten um neue Bauten zeigen, wie wichtig gegenseitiger Respekt bleibt.",
        [
          "Zusammenhang von Lage/Gestalt und Minderheitenstatus erklärt",
          "Historischen Wandel bis heute gezeigt",
          "Rolle der Religionsfreiheit gewürdigt",
        ],
      ),
    },
  },
  {
    id: "g7-bauwerke-barock-heute",
    lb: 6,
    title: "Vom Barockschloss zum Reichstag: Funktion und Denkmalschutz",
    period: "Längsschnitt · 17./18. Jh. bis heute",
    span: [1650, 2026],
    intro:
      "Wo früher Kurfürsten residierten, spazieren heute Besucher durch Museen – und der historische Berliner Reichstag trägt heute eine gläserne Kuppel. Warum schützen und pflegen wir alte Bauwerke?",
    paragraphs: [
      "Im 17. und 18. Jahrhundert bauten absolutistische Fürsten in Europa Schlösser wie Schleißheim, die Würzburger Residenz oder das Markgräfliche Opernhaus in Bayreuth als Bühnen ihrer Alleinherrschaft. Niemand sollte dort die Macht des Fürsten infrage stellen. Heute erfüllen diese Schlösser eine ganz andere Funktion: Sie sind öffentliche Museen, Konzertsäle oder Parks, in denen jeder Mensch Geschichte erleben kann.",
      "Ein besonders sprechendes Beispiel für Funktionswandel und moderne Staatsarchitektur ist das Reichstagsgebäude in Berlin. Im späten 19. Jahrhundert (1884–1894) für das Parlament des Kaiserreichs erbaut, verlor es beim Reichstagsbrand 1933 seinen Plenarsaal und wurde im Zweiten Weltkrieg 1945 schwer zur Ruine zerstört. Im Kalten Krieg stand es direkt an der Berliner Mauer, wurde in den 1960er-Jahren teilwiederhergestellt und für Ausstellungen genutzt, während der Bundestag in Bonn tagte; nach der Wiedervereinigung wurde es bis 1999 mit einer begehbaren Glaskuppel zum Sitz des Deutschen Bundestages umgebaut. Bürgerinnen und Bürger blicken dort heute von oben den gewählten Abgeordneten bei der Arbeit zu.",
      "Damit solche Baudenkmäler der Antike, des Mittelalters und der Neuzeit nicht zerfallen oder abgerissen werden, gibt es den Denkmalschutz. Gesetzliche Regeln und öffentliche Mittel sichern Originalsubstanz vor Verfall und gedankenlosem Umbau. Denkmalschutz bewahrt Bauwerke als unersetzliche Geschichtsbücher aus Stein für künftige Generationen und ermöglicht nachhaltiges Weiterbauen im Bestand.",
    ],
    takeaway:
      "Historische Bauwerke verändern ihre Nutzung über die Zeit – vom Barockschloss zum Museum, vom alten Reichstag zum demokratischen Parlamentssitz; Denkmalschutz bewahrt sie als Zeugnisse der Geschichte.",
    sourceIds: ["lehrplan", "denkmalschutz", "reichstag", "schleissheim", "wuerzburg", "bayreuth"],
    quiz: check(
      "Welche politische Idee verkörpert die moderne begehbare Glaskuppel auf dem Berliner Reichstagsgebäude?",
      "Transparenz und Kontrolle der Volksvertretung durch die Bürgerinnen und Bürger in einer Demokratie.",
      [
        "Die uneingeschränkte Alleinherrschaft eines Monarchen über abgeschlossene Ministerien.",
        "Den Rückzug des Parlaments hinter dicke, fensterlose Burgmauern ohne Öffentlichkeit.",
      ],
      [
        "Alleinherrschaft drückten absolutistische Schlösser durch abgeschirmte Thronsäle und Ehrenhöfe aus, nicht durch offene Glaskuppeln.",
        "Die Glaskuppel öffnet den Blick gerade gezielt für die Öffentlichkeit, statt das Parlament abzuschotten.",
      ],
      "Dass Besucher über dem Plenarsaal gehen können, macht symbolisch sichtbar, dass in der Demokratie alle Staatsgewalt vom Volk ausgeht.",
    ),
    workshop: classify(
      "Ursprüngliche Funktion, heutige Nutzung und Denkmalschutz",
      ["Ursprüngliche Funktion", "Heutige Nutzung", "Sinn des Denkmalschutzes"],
      [
        [
          "In der Würzburger Residenz empfängt der Fürstbischof Gesandte und feiert prunkvolle Hoffeste.",
          0,
          "Im 18. Jahrhundert diente der Barockbau der politischen Repräsentation eines Monarchen.",
        ],
        [
          "Besucherinnen und Besucher besichtigen Schloss Schleißheim und lernen etwas über den Alltag am Hof.",
          1,
          "Öffentliche Museen machen frühere Herrschaftsorte für alle zugänglich.",
        ],
        [
          "Restauratoren sichern bröckelnden Sandstein und bewahren originale Stuckdecken statt sie durch Beton zu ersetzen.",
          2,
          "Denkmalschutz erhält echte historische Substanz und Handwerkskunst für zukünftige Generationen.",
        ],
        [
          "Im Markgräflichen Opernhaus in Bayreuth sitzen heute keine Hofadligen auf Befehl, sondern Musikgäste aus aller Welt.",
          1,
          "Das UNESCO-Welterbe verbindet historische Form mit lebendiger Kultur in der Gegenwart.",
        ],
        [
          "Alte Gebäude bleiben im Stadtbild erhalten, sodass Menschen ihre eigene Geschichte vor Ort wahrnehmen können.",
          2,
          "Gebaute Geschichte stärkt Erinnerung, kulturelle Bildung und nachhaltige Nutzung alter Gebäude.",
        ],
      ],
      "Denkmalschutz bedeutet nicht Museum ohne Leben, sondern bewussten Umgang mit Zeugnissen aller Epochen.",
    ),
    tasks: {
      1: writing(
        "Vergleiche am Beispiel eines Barockschlosses (z. B. Schleißheim oder Würzburger Residenz) oder einer mittelalterlichen Burg die ursprüngliche Funktion mit der heutigen Nutzung.",
        [
          "Beschreibe, wer das Gebäude früher nutzen durfte und wozu es diente.",
          "Erkläre, wie Menschen das Bauwerk heute erleben.",
        ],
        "Schloss Schleißheim entstand im 17./18. Jahrhundert als barocke Sommerresidenz, um den Machtanspruch des bayerischen Kurfürsten zu zeigen und nur ausgewählten Hofgästen Zutritt zu bieten. Heute steht die gesamte Schloss- und Gartenanlage als Museum der Öffentlichkeit offen. Aus einem Ort fürstlicher Alleinherrschaft wurde ein Lern- und Erholungsort für alle Bürgerinnen und Bürger.",
        [
          "Konkretes historisches Gebäude benannt",
          "Ursprüngliche Funktion im Absolutismus/Mittelalter erklärt",
          "Heutige öffentliche Nutzung beschrieben",
        ],
      ),
      2: writing(
        "Erörtere, warum der Denkmalschutz auch dann sinnvoll ist, wenn alte Gebäude teuer saniert werden müssen und moderne Neubauten praktischer scheinen.",
        [
          "Nenne Gründe für Bildung, Erinnerung an verschiedene Epochen und Umweltschutz/Nachhaltigkeit.",
          "Berücksichtige auch das Gegenargument hoher Kosten.",
        ],
        "Sanierungen historischer Bauten kosten oft viel Geld und verlangen behutsame Kompromisse bei moderner Technik. Dennoch ist Denkmalschutz unverzichtbar: Alte Bauwerke sind unwiederbringliche Quellen aus Stein, die Demokratie, Religion oder frühere Machtverhältnisse direkt vor unserer Haustür erlebbar machen. Zudem schont das Erhalten und Weiter­nutzen bestehender Gebäude Ressourcen und bewahrt den eigenen Charakter eines Ortes.",
        [
          "Kostenproblem als Gegenargument berücksichtigt",
          "Historischer Wert als sichtbare Quelle erklärt",
          "Nachhaltigkeit oder lokale Identität als Grund ergänzt",
        ],
      ),
    },
  },
];
