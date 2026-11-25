import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 4: Die griechische Antike. */
export const greece: Lesson[] = [
  {
    id: "g6-polis",
    lb: 4,
    title: "Berge, Meer und Poleis",
    period: "Griechenland · etwa 800 bis 338 v. Chr.",
    span: [-800, -338],
    intro:
      "Griechenland bestand in der Antike aus Hunderten kleiner Staaten. Ein Blick auf die Karte zeigt, warum.",
    paragraphs: [
      "Griechenland ist ein Land der Berge, Buchten und Inseln. Hohe Gebirge trennen kleine, fruchtbare Ebenen voneinander, und Tausende Inseln liegen in der Ägäis. Über Land kam man nur mühsam von Tal zu Tal, über das Meer dagegen leicht von Küste zu Küste. Deshalb entwickelten sich in vielen Ebenen und auf Inseln eigene Gemeinschaften, die selbst über sich bestimmten.",
      "Eine solche Gemeinschaft hieß Polis, in der Mehrzahl Poleis. Eine Polis war ein Stadtstaat: eine Stadt mit ihrem Umland, eigenen Gesetzen, eigenen Münzen und einem eigenen Heer. Auf dem Burgberg, der Akropolis, standen die Tempel der Schutzgötter; auf dem Marktplatz, der Agora, wurde gehandelt und beraten. Bürger waren nur die freien Männer der Polis. Die größten Poleis waren Athen und Sparta, die meisten aber hatten nur wenige Tausend Einwohner.",
      "Obwohl die Poleis oft gegeneinander Krieg führten, fühlten sich die Griechen als ein Volk, die Hellenen. Sie sprachen Griechisch, verehrten dieselben Götter wie Zeus und Athene, nutzten dasselbe Alphabet und trafen sich bei gemeinsamen Festen wie den Spielen in Olympia. Mit den Griechen beginnt die Epoche der Antike, die bis zum Ende des Weströmischen Reiches um 500 n. Chr. reicht.",
    ],
    takeaway:
      "Gebirge trennten Griechenland in viele kleine Landschaften, das Meer verband sie. So entstanden Hunderte unabhängige Stadtstaaten, die Poleis.",
    sourceIds: ["pw-athen", "lehrplan"],
    quiz: check(
      "Warum entstanden in Griechenland viele kleine Stadtstaaten statt eines großen Reiches?",
      "Gebirge und Meer trennten die Siedlungsgebiete voneinander.",
      ["Ein Gesetz der Götter verbot einen gemeinsamen König.", "Die Ägypter teilten das Land unter sich auf."],
      [
        "Ein solches Gesetz gab es nicht; die Landschaft erklärt die Trennung.",
        "Griechenland wurde nicht von Ägypten aufgeteilt.",
      ],
      "Die Landschaft begünstigte selbstständige Gemeinschaften. Jede Ebene und jede Insel entwickelte ihre eigene Polis.",
    ),
    workshop: classify(
      "Eine Karte Griechenlands auswerten",
      ["Beobachtung auf der Karte", "Folgerung für die Poleis"],
      [
        [
          "Braune Flächen für Gebirge bedecken den größten Teil des Festlands.",
          0,
          "Das ist direkt aus Farbe und Legende ablesbar.",
        ],
        [
          "Grüne Ebenen liegen vereinzelt zwischen den Bergen und an den Küsten.",
          0,
          "Auch das zeigt die Karte unmittelbar.",
        ],
        [
          "Jede Ebene konnte eine eigene Gemeinschaft ernähren und verteidigen.",
          1,
          "Das schließt du aus der Lage der Ebenen.",
        ],
        [
          "In der Ägäis liegen sehr viele Inseln dicht beieinander.",
          0,
          "Die vielen Inseln sind auf der Karte zu sehen.",
        ],
        [
          "Kontakte liefen eher über das Meer als über die Gebirge.",
          1,
          "Eine Folgerung aus der Verteilung von Land und Meer.",
        ],
      ],
      "Erst ablesen, dann folgern: Die Landschaft erklärt, warum Griechenland in viele Poleis zerfiel und trotzdem über das Meer verbunden war.",
      "Beschriebene Geschichtskarte „Griechenland um 500 v. Chr.“: Gebirge in Braun, Ebenen in Grün, das Meer in Blau, die wichtigsten Poleis als rote Punkte, zum Beispiel Athen, Sparta, Korinth und Theben.",
      "Für diese Übung beschriebene Karte · keine historische Originalquelle",
    ),
    tasks: {
      1: writing(
        "Erkläre den Begriff Polis und nenne drei Merkmale.",
        ["Was gehörte zu einer Polis außer der Stadt?", "Woran erkennt man, dass sie selbstständig war?"],
        "Eine Polis war ein griechischer Stadtstaat, also eine Stadt mit ihrem Umland. Sie hatte eigene Gesetze, eigene Münzen und ein eigenes Heer und entschied selbst über Krieg und Frieden. Typisch waren die Akropolis mit den Tempeln und die Agora als Markt- und Versammlungsplatz.",
        ["Begriff erklärt", "Drei Merkmale genannt", "Akropolis oder Agora verwendet"],
      ),
      2: writing(
        "Die Griechen lebten in vielen Poleis und fühlten sich trotzdem als ein Volk. Erkläre diesen Widerspruch.",
        ["Was trennte die Poleis?", "Was hatten alle Griechen gemeinsam?"],
        "Politisch waren die Poleis getrennt: Jede hatte eigene Gesetze und ein eigenes Heer, und oft führten sie Krieg gegeneinander. Kulturell verband sie aber viel: dieselbe Sprache, dieselben Götter, dasselbe Alphabet und gemeinsame Feste wie die Olympischen Spiele. Deshalb nannten sich alle Griechen Hellenen, obwohl es keinen gemeinsamen Staat gab.",
        ["Politische Trennung erklärt", "Kulturelle Gemeinsamkeiten genannt", "Widerspruch aufgelöst"],
      ),
    },
  },
  {
    id: "g6-kolonisation",
    lb: 4,
    title: "Griechen wandern aus: die Kolonisation",
    period: "Griechische Kolonisation · etwa 750 bis 550 v. Chr.",
    span: [-750, -550],
    intro:
      "Marseille, Neapel, Istanbul: Diese Städte haben griechische Siedler gegründet. Warum verließen Menschen damals ihre Heimat?",
    paragraphs: [
      "Zwischen etwa 750 und 550 v. Chr. verließen viele Griechen ihre Polis und gründeten neue Städte rund um das Mittelmeer und das Schwarze Meer. Gründe gab es mehrere: Die Bevölkerung wuchs, aber fruchtbares Land war knapp. Manche hofften auf Handel und Reichtum, andere mussten nach Streit ihre Heimat verlassen. Oft fragte man vor der Abfahrt das Orakel in Delphi um Rat.",
      "Eine Gruppe zog mit einem Anführer los und gründete eine Tochterstadt, die bald selbstständig wurde. So entstanden Syrakus auf Sizilien, Neapolis, das heutige Neapel („neue Stadt“), Massalia, das heutige Marseille, und Byzantion, das spätere Istanbul. Die Siedler brachten Sprache, Götter, Bauweise und Waren mit und trieben Handel mit der alten Heimat. Für die Menschen, die dort schon lebten, bedeutete die Ankunft oft Austausch, manchmal aber auch Verdrängung und Krieg.",
      "Auch heute verlassen Menschen ihre Heimat, etwa wegen Arbeit, Krieg, Armut oder um bei ihrer Familie zu leben. Vielleicht kennst du das aus deiner Familie oder deiner Klasse. Vieles ist ähnlich: Die Hoffnung auf ein besseres Leben, der Abschied, das Mitnehmen von Sprache und Bräuchen. Vieles ist anders: Heute ziehen meist einzelne Menschen oder Familien in bestehende Staaten mit Gesetzen, Grenzen und Rechten. Die griechischen Siedler gründeten dagegen eigene Städte.",
    ],
    takeaway:
      "Landmangel, Handel und Streit führten zur griechischen Kolonisation. Die Gründe ähneln heutiger Migration, die Bedingungen unterscheiden sich stark.",
    sourceIds: ["pw-athen", "lehrplan"],
    quiz: check(
      "Was war ein häufiger Grund für die griechische Kolonisation?",
      "Fruchtbares Land war in der Heimat knapp geworden.",
      ["Die Römer hatten Griechenland erobert.", "Ein Erdbeben hatte alle Poleis zerstört."],
      [
        "Rom eroberte Griechenland erst Jahrhunderte später.",
        "Ein einzelnes Erdbeben erklärt nicht zweihundert Jahre Auswanderung.",
      ],
      "Bevölkerungswachstum bei wenig Ackerland zwang viele, neues Land zu suchen. Handel und Streit kamen hinzu.",
    ),
    diagram: {
      kind: "compare",
      title: "Damals und heute",
      columns: ["Griechische Kolonisation", "Migration heute"],
      rows: [
        { aspect: "Gründe", values: ["Landmangel, Handel, Streit", "Arbeit, Krieg, Armut, Familie"] },
        { aspect: "Wer zieht?", values: ["Gruppen mit einem Anführer", "meist Einzelne oder Familien"] },
        { aspect: "Ziel", values: ["eigene neue Stadt gründen", "in einem bestehenden Staat leben"] },
        { aspect: "Regeln", values: ["kaum Regeln, oft Gewalt gegen Einheimische", "Gesetze, Grenzen und Rechte wie Asyl"] },
      ],
      caption:
        "Vergleichen heißt: Gemeinsamkeiten und Unterschiede benennen, ohne Damals und Heute gleichzusetzen.",
    },
    workshop: classify(
      "Damals, heute oder beides?",
      ["Nur bei der griechischen Kolonisation", "Nur bei Migration heute", "Damals und heute"],
      [
        [
          "Menschen hoffen in einer neuen Heimat auf ein besseres Leben.",
          2,
          "Diese Hoffnung verbindet Auswanderer aller Zeiten.",
        ],
        [
          "Vor der Abfahrt wird das Orakel von Delphi befragt.",
          0,
          "Das Orakel gehört zur griechischen Religion der Antike.",
        ],
        [
          "Wer ankommt, kann in einem Asylverfahren Schutz beantragen.",
          1,
          "Asylrecht gibt es erst in modernen Staaten.",
        ],
        [
          "Die Ausgewanderten nehmen Sprache, Bräuche und Rezepte mit.",
          2,
          "Kultur reist damals wie heute mit.",
        ],
        [
          "Eine Gruppe gründet an einer fremden Küste eine eigene Stadt.",
          0,
          "So entstanden griechische Tochterstädte wie Massalia.",
        ],
      ],
      "Gleiche Gründe, andere Bedingungen: Das ist das Ergebnis des Vergleichs.",
    ),
    tasks: {
      1: writing(
        "Nenne zwei Gründe für die griechische Kolonisation und eine Stadt, die damals gegründet wurde.",
        ["Was fehlte in der Heimat?", "Welche heutige Stadt geht auf griechische Siedler zurück?"],
        "Viele Griechen wanderten aus, weil die Bevölkerung wuchs und fruchtbares Land knapp war. Andere suchten neue Handelsmöglichkeiten oder mussten nach Streit ihre Polis verlassen. Eine damals gegründete Stadt ist Massalia, das heutige Marseille in Frankreich.",
        ["Zwei Gründe genannt", "Passende Stadt genannt", "Richtige Zuordnung"],
      ),
      2: writing(
        "Vergleiche die griechische Kolonisation mit Migration heute: Nenne eine Gemeinsamkeit und zwei Unterschiede.",
        ["Was suchen Auswanderer damals wie heute?", "Wohin ziehen sie, und welche Regeln gelten?"],
        "Gemeinsam ist, dass Menschen ihre Heimat verlassen, weil sie sich anderswo ein besseres Leben erhoffen. Ein Unterschied: Die Griechen zogen in Gruppen los und gründeten eigene Städte, heute ziehen meist Einzelne oder Familien in bestehende Staaten. Ein zweiter Unterschied: Heute gelten Gesetze und Rechte wie das Asylrecht, damals gab es kaum Regeln, und Einheimische wurden manchmal verdrängt.",
        ["Gemeinsamkeit genannt", "Zwei Unterschiede genannt", "Sachlich und respektvoll formuliert"],
      ),
    },
  },
  {
    id: "g6-kultur-griechen",
    lb: 4,
    title: "Olympia, Theater und griechische Spuren heute",
    period: "Griechische Kultur · ab 776 v. Chr.",
    span: [-776, -400],
    intro:
      "Olympische Spiele, Theater, Demokratie, Mathematik: Viele Wörter und Ideen, die du täglich nutzt, kommen aus dem alten Griechenland.",
    paragraphs: [
      "Seit 776 v. Chr., so überlieferten es die Griechen, fanden in Olympia alle vier Jahre Wettkämpfe zu Ehren des Gottes Zeus statt. Während der Spiele sollte ein Frieden gelten, damit Sportler und Zuschauer sicher anreisen konnten. Es gab Laufwettbewerbe, Ringen, Faustkampf, Wagenrennen und den Fünfkampf. Teilnehmen durften nur freie griechische Männer; verheiratete Frauen durften nicht einmal zuschauen. Die Sieger erhielten einen Kranz aus Olivenzweigen und wurden in ihrer Polis gefeiert.",
      "In Athen entstand bei Festen für den Gott Dionysos das Theater. In großen Freilichttheatern am Hang sahen Tausende Zuschauer Tragödien, die ernste Fragen von Schuld und Schicksal stellten, und Komödien, die über Politiker spotteten. Alle Rollen spielten Männer mit Masken, dazu sang ein Chor. Das Theater von Epidauros fasste über 10 000 Menschen und ist für seine Akustik berühmt.",
      "Die griechische Kultur hat Europa geprägt, und ihre Spuren findest du in deiner Umgebung. Wörter wie Theater, Szene, Demokratie, Politik, Mathematik und Alphabet stammen aus dem Griechischen. Die Olympischen Spiele wurden 1896 in Athen neu belebt. In München ließ König Ludwig I. am Königsplatz Gebäude mit griechischen Säulen errichten, in denen heute antike Kunst ausgestellt ist.",
    ],
    takeaway:
      "Olympische Spiele und Theater waren religiöse Feste der Griechen. Wörter, Spiele und Bauten zeigen bis heute, wie die griechische Antike Europa geprägt hat.",
    sourceIds: ["koenigsplatz", "pw-athen"],
    quiz: check(
      "Zu Ehren welches Gottes fanden die Spiele in Olympia statt?",
      "Zu Ehren des Göttervaters Zeus.",
      ["Zu Ehren des Weingottes Dionysos.", "Zu Ehren des Meeresgottes Poseidon."],
      [
        "Dionysos ehrte man mit Theaterfesten in Athen.",
        "Poseidon hatte eigene Heiligtümer, Olympia gehörte Zeus.",
      ],
      "In Olympia stand ein großer Tempel des Zeus. Die Spiele waren Sport und Gottesdienst zugleich.",
    ),
    workshop: classify(
      "Griechische Spuren in deinem Leben",
      ["Wort", "Bauwerk", "Fest und Brauch"],
      [
        [
          "„Demokratie“ heißt übersetzt „Herrschaft des Volkes“.",
          0,
          "Ein griechisches Wort für eine griechische Idee.",
        ],
        [
          "Die Glyptothek in München hat eine Säulenhalle wie ein griechischer Tempel.",
          1,
          "Ludwig I. ließ im 19. Jahrhundert nach griechischem Vorbild bauen.",
        ],
        [
          "Alle vier Jahre finden die Olympischen Sommerspiele statt.",
          2,
          "Der Vier-Jahres-Rhythmus stammt aus Olympia.",
        ],
        [
          "„Alphabet“ setzt sich aus Alpha und Beta zusammen.",
          0,
          "So heißen die ersten beiden griechischen Buchstaben.",
        ],
        [
          "Vor den Spielen wird in Olympia eine Fackel entzündet.",
          2,
          "Ein moderner Brauch, der an den antiken Ort erinnert.",
        ],
        [
          "Viele Theaterbauten haben ihre Sitzreihen halbrund angeordnet.",
          1,
          "Die Form geht auf die griechischen Freilichttheater zurück.",
        ],
      ],
      "Griechische Spuren stecken in Sprache, Bauten und Bräuchen. Wer sie erkennt, kann sie in ihre Zeit einordnen.",
    ),
    tasks: {
      1: writing(
        "Beschreibe die Olympischen Spiele der Antike: Wann, wo, wer und wofür?",
        ["Wer durfte teilnehmen, wer nicht?", "Was bekamen die Sieger?"],
        "Die Spiele fanden seit 776 v. Chr. alle vier Jahre in Olympia statt, zu Ehren des Gottes Zeus. Teilnehmen durften nur freie griechische Männer; Frauen, Sklaven und Nichtgriechen waren ausgeschlossen. Es gab Laufen, Ringen, Faustkampf, Wagenrennen und Fünfkampf. Die Sieger bekamen einen Olivenkranz und viel Ruhm in ihrer Heimat.",
        ["Zeit und Ort genannt", "Teilnehmer und Ausschluss genannt", "Religiöser Zweck erklärt"],
      ),
      2: writing(
        "Vergleiche die antiken mit den heutigen Olympischen Spielen: eine Gemeinsamkeit, zwei Unterschiede.",
        ["Was ist gleich geblieben?", "Wer darf heute teilnehmen, und welche Rolle spielt Religion?"],
        "Gemeinsam ist der Rhythmus von vier Jahren und der Wettkampf um Sieg und Ruhm. Ein Unterschied ist, dass heute Frauen und Männer aus allen Ländern teilnehmen, damals nur freie griechische Männer. Ein zweiter Unterschied: Die antiken Spiele waren ein Fest für Zeus, die heutigen sind ein weltweites Sportereignis ohne religiösen Zweck.",
        ["Gemeinsamkeit genannt", "Zwei Unterschiede genannt", "Richtige Fakten verwendet"],
      ),
    },
  },
  {
    id: "g6-kunst-griechen",
    lb: 4,
    title: "Tempel und Statuen untersuchen",
    period: "Griechische Kunst · 7. bis 5. Jahrhundert v. Chr.",
    span: [-650, -400],
    intro:
      "Weiße Säulen, glatte Marmorfiguren: So stellen sich viele die Griechen vor. Doch Tempel und Statuen waren einst farbig bemalt.",
    paragraphs: [
      "Ein griechischer Tempel war das Haus einer Gottheit. Im Inneren stand ihr Standbild; Opfer und Feste fanden draußen am Altar statt. Der berühmteste Tempel ist der Parthenon auf der Akropolis in Athen, gebaut von 447 bis 432 v. Chr. für die Göttin Athene. An den Säulen erkennst du drei Bauweisen: Dorische Säulen sind schlicht und haben ein flaches, kissenförmiges Kapitell, ionische tragen Schnecken, korinthische Blätter des Akanthus.",
      "Griechische Bildhauer stellten Götter und Menschen in idealer Gestalt dar. Frühe Statuen stehen steif, die Arme eng am Körper. Im 5. Jahrhundert v. Chr. lernten die Künstler, den Körper natürlich zu zeigen: Das Gewicht ruht auf einem Standbein, das andere Bein ist locker gebeugt. Diese Haltung nennt man Kontrapost. Forschungen zeigen, dass viele Statuen und Tempel bunt bemalt waren; die Farbe ist meist verblasst.",
      "Untersuche ein Kunstwerk mit festen Kriterien: Was ist dargestellt, wann und wo entstand es? Aus welchem Material besteht es? Wie ist es gestaltet, etwa Haltung, Größe und Proportionen? Wozu diente es? Daraus ziehst du Schlüsse über die Kultur: Ein prächtiger Marmortempel zeigt den Reichtum und Stolz einer Polis, ideale Körper zeigen, welches Bild vom Menschen die Griechen hatten.",
    ],
    takeaway:
      "Griechische Tempel waren Häuser der Götter, erkennbar an dorischen, ionischen oder korinthischen Säulen. Statuen zeigten ideale Körper, ab dem 5. Jahrhundert v. Chr. im Kontrapost.",
    sourceIds: ["koenigsplatz", "pw-athen"],
    quiz: check(
      "Woran erkennst du eine ionische Säule?",
      "An den Schnecken an ihrem oberen Ende.",
      ["An den Akanthusblättern am Kapitell.", "An einem flachen, schlichten Kissen oben."],
      [
        "Akanthusblätter gehören zur korinthischen Säule.",
        "Ein schlichtes, kissenförmiges Kapitell ist dorisch.",
      ],
      "Das ionische Kapitell trägt seitlich eingerollte Schnecken, die Voluten.",
    ),
    workshop: classify(
      "Säulenordnungen erkennen",
      ["Dorisch", "Ionisch", "Korinthisch"],
      [
        [
          "Kapitell wie ein flaches Kissen, die Säule steht ohne Fuß auf dem Boden.",
          0,
          "Die dorische Säule ist die schlichteste.",
        ],
        [
          "Seitlich eingerollte Schnecken am Kapitell.",
          1,
          "Die Schnecken heißen Voluten.",
        ],
        [
          "Kapitell aus mehreren Reihen gezackter Blätter.",
          2,
          "Das sind Blätter der Akanthuspflanze.",
        ],
        [
          "Schlank, mit einem eigenen Fuß und schneckenförmigem Kapitell.",
          1,
          "Fuß und Schnecken sprechen für ionisch.",
        ],
        [
          "Die Säulen des Parthenon, kräftig und ohne Fuß.",
          0,
          "Der Parthenon ist ein dorischer Tempel.",
        ],
        [
          "Die prächtigste Form, die besonders die Römer gern verwendeten.",
          2,
          "Korinthische Säulen sind die reichsten an Schmuck.",
        ],
      ],
      "Die drei Säulenordnungen helfen, Bauten zu beschreiben und einzuordnen, auch Gebäude in deiner Stadt.",
    ),
    tasks: {
      1: writing(
        "Untersuche den Parthenon mit drei Kriterien: Was, wann und wozu? Ziehe einen Schluss über Athen.",
        ["Wem war der Tempel geweiht?", "Was zeigt ein so prächtiger Bau über die Polis?"],
        "Der Parthenon ist ein dorischer Marmortempel auf der Akropolis von Athen. Er wurde von 447 bis 432 v. Chr. gebaut und war der Göttin Athene geweiht, der Schutzgöttin der Stadt. Der aufwendige Bau zeigt, dass Athen damals reich und mächtig war und seine Göttin besonders ehren wollte.",
        ["Drei Kriterien angewendet", "Richtige Angaben", "Schluss über Athen gezogen"],
      ),
      2: writing(
        "In einem Museum siehst du eine bunt bemalte Kopie einer griechischen Statue. Ein Besucher meint: „Das ist doch falsch, griechische Statuen sind weiß.“ Was antwortest du?",
        ["Was haben Forschungen an den Statuen entdeckt?", "Warum sehen die Originale heute weiß aus?"],
        "Viele griechische Statuen waren ursprünglich bunt bemalt. Forschende haben mit besonderem Licht und Lupen Farbreste gefunden. Die Farbe ist im Lauf der Jahrtausende verblasst oder abgewaschen worden, deshalb sehen die Originale heute weiß aus. Die bunte Kopie zeigt also, wie die Statue wahrscheinlich einmal aussah.",
        ["Bemalung erklärt", "Forschungsbefund genannt", "Grund für das heutige Aussehen genannt"],
      ),
    },
  },
  {
    id: "g6-verfassungen",
    lb: 4,
    title: "Wer herrscht? Athens Weg zur Demokratie",
    period: "Athen · von Solon 594 v. Chr. bis Kleisthenes 508/507 v. Chr.",
    span: [-594, -507],
    intro:
      "Ein König, ein paar Adlige, ein Tyrann oder das Volk: Athen hat viele Arten zu herrschen ausprobiert.",
    paragraphs: [
      "Die Verfassung eines Staates legt fest, wer herrscht und wer mitbestimmt. Die Griechen unterschieden: In der Monarchie herrscht ein Einzelner, der König. In der Aristokratie herrschen wenige reiche Adelsfamilien, die sich für die Besten hielten. Eine Tyrannis ist die Herrschaft eines Einzelnen, der die Macht ohne Recht an sich gerissen hat. In der Demokratie herrscht das Volk.",
      "Auch Athen wurde nach einer frühen Königszeit von Adligen regiert. Um 600 v. Chr. gerieten viele Bauern in Schulden und wurden als Schuldsklaven verkauft. Der Politiker Solon schaffte 594 v. Chr. die Schuldsklaverei ab und erließ Schulden. Er teilte die Bürger nach ihrem Vermögen in vier Klassen ein: Je reicher, desto mehr Ämter standen einem offen. Alle Bürger durften aber an der Volksversammlung teilnehmen.",
      "Später herrschte in Athen der Tyrann Peisistratos und nach ihm seine Söhne. Nach ihrem Sturz ordnete Kleisthenes 508/507 v. Chr. die Bürgerschaft neu. Er mischte die Bürger aus verschiedenen Gegenden, damit die Adelsfamilien ihre Macht verloren. Ein Rat der 500, ausgelost unter den Bürgern, bereitete die Beschlüsse der Volksversammlung vor. Mit dem Scherbengericht konnten die Bürger einen Mann, der zu mächtig schien, für zehn Jahre verbannen. Damit waren die Grundlagen der Demokratie gelegt.",
    ],
    takeaway:
      "Monarchie: einer herrscht; Aristokratie: wenige Adlige; Tyrannis: einer mit geraubter Macht; Demokratie: das Volk. Solon und Kleisthenes legten in Athen die Grundlagen der Demokratie.",
    sourceIds: ["pw-athen", "lehrplan"],
    quiz: check(
      "Was bedeutet Aristokratie?",
      "Die Herrschaft weniger adliger Familien.",
      ["Die Herrschaft aller Bürger einer Stadt.", "Die Herrschaft eines gewählten Königs."],
      [
        "Wenn alle Bürger entscheiden, spricht man von Demokratie.",
        "Herrscht ein Einzelner, ist das eine Monarchie.",
      ],
      "„Aristos“ heißt der Beste. Die Adligen hielten sich für die Besten und beanspruchten die Herrschaft.",
    ),
    diagram: {
      kind: "steps",
      title: "Athens Weg zur Demokratie",
      steps: [
        { label: "Königtum", note: "in der Frühzeit herrscht ein König" },
        { label: "Adelsherrschaft", note: "wenige Familien regieren, Bauern verschulden sich" },
        { label: "Solon 594 v. Chr.", note: "keine Schuldsklaverei, Rechte nach Vermögen" },
        { label: "Tyrannis", note: "Peisistratos und seine Söhne herrschen allein" },
        { label: "Kleisthenes 508/507 v. Chr.", note: "Rat der 500, Scherbengericht" },
      ],
      repeats: false,
      caption:
        "Die Demokratie entstand nicht auf einmal. Jeder Schritt gab mehr Bürgern mehr Mitsprache.",
    },
    workshop: classify(
      "Welche Herrschaftsform ist das?",
      ["Monarchie", "Aristokratie", "Tyrannis", "Demokratie"],
      [
        [
          "Ein König herrscht und vererbt die Krone an seinen Sohn.",
          0,
          "Herrschaft eines Einzelnen mit Erbrecht.",
        ],
        [
          "Die Häupter der reichsten Familien besetzen alle Ämter.",
          1,
          "Wenige Adlige herrschen.",
        ],
        [
          "Ein Adliger reißt mit seinen Anhängern die Macht an sich.",
          2,
          "Einzelherrschaft ohne rechtmäßigen Anspruch.",
        ],
        [
          "Alle Bürger stimmen in der Volksversammlung über ein Gesetz ab.",
          3,
          "Das Volk der Bürger entscheidet.",
        ],
        [
          "Ein ausgeloster Rat bereitet die Abstimmungen der Bürger vor.",
          3,
          "Das Los gab jedem Bürger die gleiche Chance.",
        ],
      ],
      "Die Fragen „Wer herrscht?“ und „Wie kam er an die Macht?“ ordnen jede Verfassung.",
    ),
    tasks: {
      1: writing(
        "Erkläre die Reformen Solons und warum sie für die einfachen Bauern wichtig waren.",
        ["Was geschah mit verschuldeten Bauern vor Solon?", "Was änderte Solon?"],
        "Vor Solon konnten Bauern, die ihre Schulden nicht bezahlten, als Schuldsklaven verkauft werden. Solon erließ 594 v. Chr. Schulden und verbot die Schuldsklaverei. Außerdem durften alle Bürger an der Volksversammlung teilnehmen. Für die Bauern bedeutete das Schutz vor Sklaverei und erstmals ein wenig Mitsprache, auch wenn die Reichen noch mehr Rechte hatten.",
        ["Lage vor Solon beschrieben", "Reformen genannt", "Bedeutung für Bauern erklärt"],
      ),
      2: writing(
        "Warum mischte Kleisthenes die Bürger aus verschiedenen Gegenden? Erkläre die Absicht.",
        ["Worauf stützten sich die Adelsfamilien?", "Was geschieht, wenn Nachbarn nicht mehr gemeinsam abstimmen?"],
        "Die Adelsfamilien hatten ihre Macht in ihren Heimatgegenden, wo viele Bürger von ihnen abhängig waren und für sie stimmten. Kleisthenes teilte die Bürger neu ein und mischte Menschen aus der Stadt, der Küste und dem Binnenland. So konnte kein Adliger mehr eine ganze Gruppe kontrollieren. Die Macht verschob sich von den Familien zur gesamten Bürgerschaft.",
        ["Macht des Adels erklärt", "Mischung beschrieben", "Ziel benannt"],
      ),
    },
  },
  {
    id: "g6-perserkriege",
    lb: 4,
    title: "Die Perserkriege stärken die Demokratie",
    period: "Perserkriege · 490 bis 479 v. Chr.",
    span: [-500, -462],
    intro:
      "Das riesige Perserreich griff Griechenland an. Dass Athen siegte, veränderte auch, wer in der Stadt mitreden durfte.",
    paragraphs: [
      "Das Perserreich reichte vom Indus bis an die Küste Kleinasiens. Als sich griechische Städte dort um 500 v. Chr. gegen die Perser erhoben, half ihnen Athen. Daraufhin schickte der persische König ein Heer. 490 v. Chr. besiegten die Athener es bei Marathon mit ihren Hopliten, schwer bewaffneten Fußsoldaten. Hoplit konnte nur werden, wer sich Helm, Panzer und Schild selbst leisten konnte.",
      "Zehn Jahre später kamen die Perser mit einem noch größeren Heer und einer Flotte. Der Athener Themistokles hatte durchgesetzt, dass mit dem Silber aus den Bergwerken von Laurion eine große Flotte gebaut wurde. In der Seeschlacht bei Salamis 480 v. Chr. besiegten die Griechen die persische Flotte, 479 v. Chr. auch das Landheer. Auf den Kriegsschiffen, den Trieren, ruderten jeweils rund 170 Männer, und viele von ihnen waren arme Bürger, die sich keine Rüstung leisten konnten.",
      "Die armen Ruderer hatten Athen gerettet. Sie wurden selbstbewusster und forderten mehr Mitsprache. In den folgenden Jahrzehnten wurde der alte Adelsrat entmachtet, und die Volksversammlung erhielt mehr Gewicht. Athen gründete mit vielen Poleis einen Seebund gegen Persien und wurde zur führenden Seemacht. Ohne die Perserkriege wäre die athenische Demokratie wohl nicht so weit ausgebaut worden.",
    ],
    takeaway:
      "Bei Marathon 490 und Salamis 480 v. Chr. siegte Athen über die Perser. Weil arme Bürger als Ruderer die Flotte stellten, wuchs ihr Anspruch auf Mitsprache: Die Demokratie wurde ausgebaut.",
    sourceIds: ["pw-athen", "lehrplan"],
    quiz: check(
      "Warum gewannen die armen Bürger Athens nach den Perserkriegen an Einfluss?",
      "Sie hatten als Ruderer der Flotte den Sieg erkämpft.",
      ["Sie hatten den Perserkönig selbst gefangen genommen.", "Sie hatten das Silber für die Rüstungen gespendet."],
      [
        "Der Perserkönig wurde nicht gefangen; er zog sich zurück.",
        "Das Silber stammte aus den staatlichen Bergwerken von Laurion, nicht von armen Bürgern.",
      ],
      "Wer im Krieg sein Leben für die Polis einsetzt, fordert auch Mitsprache. Die Ruderer waren für Athens Seemacht unverzichtbar.",
    ),
    workshop: timeline(
      [
        [
          "um 500 v. Chr.: Griechische Städte in Kleinasien erheben sich gegen Persien.",
          "Athen unterstützt den Aufstand und zieht den Zorn des Perserkönigs auf sich.",
        ],
        [
          "490 v. Chr.: Die Hopliten Athens siegen bei Marathon.",
          "Der erste persische Angriff scheitert an Land.",
        ],
        [
          "483 v. Chr.: Athen baut mit dem Silber von Laurion eine Flotte.",
          "Themistokles setzt den Flottenbau durch.",
        ],
        [
          "480 v. Chr.: Die griechische Flotte siegt bei Salamis.",
          "Die Ruderer, meist arme Bürger, entscheiden die Schlacht.",
        ],
        [
          "478/477 v. Chr.: Athen gründet mit vielen Poleis einen Seebund.",
          "Athen wird zur führenden Seemacht.",
        ],
        [
          "462 v. Chr.: Der alte Adelsrat verliert seine Macht.",
          "Volksversammlung und Gerichte der Bürger werden gestärkt.",
        ],
      ],
      "Krieg, Flotte und Mitsprache hängen zusammen: Je wichtiger die armen Ruderer wurden, desto mehr Rechte bekamen sie.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Zusammenhang zwischen der Seeschlacht bei Salamis und dem Ausbau der Demokratie in Athen.",
        ["Wer ruderte auf den Kriegsschiffen?", "Was forderten diese Menschen nach dem Sieg?"],
        "Bei Salamis siegte 480 v. Chr. die Flotte. Auf den Schiffen ruderten viele arme Bürger, die sich keine Rüstung leisten konnten und vorher wenig Einfluss hatten. Weil sie Athen gerettet hatten, wurden sie selbstbewusster und forderten mehr Mitsprache. In den folgenden Jahrzehnten wurde die Volksversammlung gestärkt und die Demokratie ausgebaut.",
        ["Sieg bei Salamis genannt", "Rolle der armen Ruderer erklärt", "Folge für die Demokratie gezogen"],
      ),
      2: writing(
        "Vergleiche, wer bei Marathon und wer bei Salamis kämpfte, und erkläre, warum das für die Politik Athens wichtig war.",
        ["Was brauchte ein Hoplit?", "Wer konnte rudern?"],
        "Bei Marathon kämpften die Hopliten, also Bürger, die sich Helm, Panzer und Schild leisten konnten, meist wohlhabende Bauern. Bei Salamis kämpfte die Flotte, auf der vor allem arme Bürger ruderten. Damit hatten erstmals auch die Armen einen entscheidenden Beitrag geleistet. Daraus leiteten sie ihren Anspruch ab, in der Volksversammlung gleichberechtigt mitzuentscheiden.",
        ["Hopliten richtig beschrieben", "Ruderer richtig beschrieben", "Politische Folge erklärt"],
      ),
    },
  },
  {
    id: "g6-perikles",
    lb: 4,
    title: "Athens Blütezeit: Demokratie unter Perikles",
    period: "5. Jh. v. Chr. Blütezeit Athens",
    span: [-461, -429],
    intro:
      "Auf der Pnyx stimmten Tausende Bürger direkt über Krieg und Frieden ab. War Athen eine Demokratie, wie wir sie heute kennen?",
    paragraphs: [
      "Nach den Perserkriegen erlebte Athen seine Blütezeit. Der Politiker Perikles wurde von 443 bis 429 v. Chr. jedes Jahr zum Strategen, also zum Heerführer, gewählt und prägte die Stadt. Mit Geld aus dem Seebund ließ er auf der Akropolis prächtige Bauten wie den Parthenon errichten. Damit auch arme Bürger Ämter übernehmen konnten, führte er Tagegelder ein: Wer als Richter arbeitete, bekam einen Lohn; später wurden weitere Ämter bezahlt.",
      "Die Volksversammlung tagte etwa vierzigmal im Jahr auf dem Hügel Pnyx. Jeder Bürger durfte reden und abstimmen, über Gesetze, Steuern, Krieg und Frieden. Die meisten Ämter und die Richter wurden ausgelost, nur die Strategen gewählt. Bürger war allerdings nur ein erwachsener Mann, dessen Eltern beide Athener waren. Frauen, Fremde, die in Athen wohnten, die Metöken, und die vielen Sklaven durften nicht mitbestimmen. Sie bildeten die große Mehrheit der Bewohner.",
      "Heute leben wir in einer Demokratie, in der alle erwachsenen Staatsbürgerinnen und Staatsbürger wählen dürfen, in Deutschland Frauen seit 1918. Wir wählen Abgeordnete, die für uns entscheiden; man spricht von einer repräsentativen Demokratie. Grundrechte gelten für alle Menschen, auch für Fremde. In Bayern können Bürger zusätzlich durch Volksentscheide direkt abstimmen. Gemessen daran war Athens Demokratie unvollständig; für ihre Zeit war sie aber eine mutige neue Idee.",
    ],
    takeaway:
      "Unter Perikles entschieden die männlichen Bürger Athens direkt in der Volksversammlung, Ämter wurden ausgelost und bezahlt. Frauen, Metöken und Sklaven blieben ausgeschlossen.",
    sourceIds: ["pw-athen", "lehrplan"],
    quiz: check(
      "Wer durfte in der Volksversammlung Athens abstimmen?",
      "Erwachsene Männer mit athenischem Bürgerrecht.",
      ["Alle Erwachsenen, die in Athen wohnten.", "Nur die Strategen und Mitglieder des Rates."],
      [
        "Frauen, Metöken und Sklaven wohnten in Athen, durften aber nicht abstimmen.",
        "Abstimmen durften alle Bürger, nicht nur die Amtsträger.",
      ],
      "Nur ein Teil der Bewohner hatte das Bürgerrecht. Diese Männer entschieden aber direkt und gemeinsam.",
    ),
    diagram: {
      kind: "compare",
      title: "Demokratie in Athen und heute",
      columns: ["Athen unter Perikles", "Deutschland heute"],
      rows: [
        { aspect: "Wer stimmt ab?", values: ["erwachsene männliche Bürger", "alle Staatsbürgerinnen und Staatsbürger ab 18"] },
        { aspect: "Wie?", values: ["direkt in der Volksversammlung", "meist über gewählte Abgeordnete"] },
        { aspect: "Ämter", values: ["meist ausgelost, mit Tagegeld", "gewählt oder ernannt, mit Gehalt"] },
        { aspect: "Ausgeschlossen", values: ["Frauen, Metöken, Sklaven", "Kinder und Jugendliche bis zum Wahlalter"] },
        { aspect: "Rechte aller Menschen", values: ["keine Grundrechte für Fremde und Sklaven", "Grundrechte gelten für alle"] },
      ],
      caption:
        "Beurteilen heißt: mit Maßstäben von heute vergleichen und zugleich die damalige Zeit berücksichtigen.",
    },
    workshop: classify(
      "Athen, heute oder beides?",
      ["Nur im antiken Athen", "Nur heute", "In Athen und heute"],
      [
        [
          "Ämter werden unter den Bürgern ausgelost.",
          0,
          "Das Los sollte jedem Bürger die gleiche Chance geben.",
        ],
        [
          "Frauen dürfen wählen und gewählt werden.",
          1,
          "In Deutschland seit 1918, in Athen nie.",
        ],
        [
          "Die Mehrheit der Abstimmenden entscheidet.",
          2,
          "Das Mehrheitsprinzip gilt damals wie heute.",
        ],
        [
          "Sklaven gehören zur Bevölkerung, haben aber keine Rechte.",
          0,
          "Sklaverei ist heute verboten.",
        ],
        [
          "Gewählte Abgeordnete beschließen die Gesetze im Parlament.",
          1,
          "Das ist die repräsentative Demokratie.",
        ],
      ],
      "Athen erfand die Idee der Volksherrschaft. Wer genau zum Volk gehört, wurde seitdem immer weiter gefasst.",
    ),
    tasks: {
      1: writing(
        "Beschreibe, wie die Demokratie in Athen unter Perikles funktionierte. Nenne drei Einrichtungen oder Regeln.",
        ["Wo stimmten die Bürger ab?", "Wie wurden Ämter vergeben und bezahlt?"],
        "In Athen stimmten die Bürger direkt in der Volksversammlung auf der Pnyx über Gesetze, Krieg und Frieden ab. Die meisten Ämter und die Richter wurden unter den Bürgern ausgelost, nur die Strategen gewählt. Perikles führte Tagegelder ein, damit auch arme Bürger Ämter übernehmen konnten. Mitbestimmen durften aber nur erwachsene Männer mit Bürgerrecht.",
        ["Volksversammlung erklärt", "Losverfahren oder Tagegeld erklärt", "Einschränkung genannt"],
      ),
      2: writing(
        "War Athen eine Demokratie? Beurteile mit Blick auf heutige Vorstellungen und auf die damalige Zeit.",
        ["Wer war ausgeschlossen, wer durfte mitentscheiden?", "Wie herrschte man damals anderswo?"],
        "Aus heutiger Sicht war Athen keine vollständige Demokratie, denn Frauen, Metöken und Sklaven, also die Mehrheit, durften nicht mitbestimmen, und Grundrechte für alle gab es nicht. Für ihre Zeit war Athen aber außergewöhnlich: Anderswo herrschten Könige oder Adlige, in Athen entschieden die Bürger selbst und konnten durch Tagegelder auch als Arme Ämter übernehmen. Ich halte Athen deshalb für eine frühe, eingeschränkte Demokratie.",
        ["Heutige Maßstäbe angewendet", "Damalige Zeit berücksichtigt", "Eigenes abgewogenes Urteil"],
      ),
    },
  },
];
