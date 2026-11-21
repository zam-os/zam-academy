import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 2: Der Mensch und seine Geschichte. */
export const prehistory: Lesson[] = [
  {
    id: "g6-zeit-und-quellen",
    lb: 2,
    title: "Ich habe eine Geschichte: Zeit und Quellen",
    period: "Vergangenheit · Gegenwart · Zukunft",
    span: [-10000, 2026],
    intro:
      "Dein Babyfoto, die Erzählungen deiner Großeltern, dein Zeugnis: Auch du hast eine Geschichte, und sie hinterlässt Spuren.",
    paragraphs: [
      "Menschen ordnen ihr Leben in drei Zeiten: Vergangenheit, Gegenwart und Zukunft. Was du gestern erlebt hast, ist Vergangenheit; was du heute tust, Gegenwart; was du planst, Zukunft. Wer seine Vergangenheit kennt, versteht besser, wer er heute ist, und kann die Zukunft besser planen. Das gilt für dich, für deine Familie und für ganze Völker.",
      "Woher wissen wir etwas über die Vergangenheit? Aus Quellen. Es gibt schriftliche Quellen wie Briefe und Urkunden, mündliche Quellen wie Erzählungen von Zeitzeugen, bildliche Quellen wie Fotos und Gemälde und gegenständliche Quellen, die man auch Sachquellen nennt, etwa Werkzeuge, Münzen oder Gebäude.",
      "Manche Quellen sind Überreste: Sie sind einfach übrig geblieben, ohne dass jemand an die Nachwelt dachte, zum Beispiel ein Kochtopf, Abfall oder eine Rechnung. Andere sind Überlieferung: Sie wurden mit Absicht für spätere Menschen gemacht, etwa eine Inschrift auf einem Denkmal oder eine Chronik. Aus Zeiten ohne Schrift kennen wir fast nur Überreste aus dem Boden. Deshalb ist die Archäologie für die Vorgeschichte so wichtig.",
    ],
    takeaway:
      "Quellen sind schriftlich, mündlich, bildlich oder gegenständlich. Überreste blieben zufällig erhalten, Überlieferung wurde absichtlich für die Nachwelt geschaffen.",
    sourceIds: ["lehrplan", "archaeologie-bayern"],
    quiz: check(
      "Welche Quelle ist ein Überrest und keine absichtliche Überlieferung?",
      "Eine zerbrochene Schüssel aus einer Abfallgrube.",
      ["Eine Inschrift an einem Siegerdenkmal.", "Eine Chronik über die Taten eines Königs."],
      [
        "Ein Siegerdenkmal wurde gebaut, damit sich spätere Menschen erinnern: Überlieferung.",
        "Eine Chronik schreibt man bewusst für die Nachwelt: Überlieferung.",
      ],
      "Niemand wollte mit der kaputten Schüssel etwas überliefern. Gerade solche Überreste zeigen den Alltag oft unverfälscht.",
    ),
    diagram: {
      kind: "compare",
      title: "Überreste und Überlieferung",
      columns: ["Überrest", "Überlieferung"],
      rows: [
        { aspect: "Entstehung", values: ["blieb zufällig erhalten", "für die Nachwelt gemacht"] },
        { aspect: "Beispiele", values: ["Werkzeug, Abfall, Rechnung", "Denkmal, Inschrift, Chronik"] },
        { aspect: "Stärke", values: ["zeigt den Alltag ungeschönt", "zeigt, wie man erinnert werden wollte"] },
        { aspect: "Vorsicht", values: ["sagt wenig über Gedanken", "stellt Ereignisse oft geschönt dar"] },
      ],
      caption:
        "Beide Arten von Quellen sind wertvoll. Wer sie unterscheidet, fragt richtig nach ihrer Aussagekraft.",
    },
    workshop: classify(
      "Welche Art von Quelle ist das?",
      ["Schriftlich", "Mündlich", "Bildlich", "Gegenständlich"],
      [
        [
          "Deine Geburtsurkunde vom Standesamt",
          0,
          "Eine Urkunde ist ein geschriebenes Dokument.",
        ],
        [
          "Deine Oma erzählt, wie sie als Kind zur Schule ging.",
          1,
          "Eine Erzählung einer Zeitzeugin ist eine mündliche Quelle.",
        ],
        [
          "Ein Foto von deiner Einschulung",
          2,
          "Fotos sind Bildquellen.",
        ],
        [
          "Ein römischer Ziegel mit dem Abdruck einer Hundepfote",
          3,
          "Ein Gegenstand ist eine Sachquelle, hier zugleich ein zufälliger Überrest.",
        ],
        [
          "Ein Brief, den dein Uropa aus dem Urlaub schrieb",
          0,
          "Ein Brief ist eine schriftliche Quelle.",
        ],
      ],
      "Jede Art von Quelle verrät etwas anderes. Für deine eigene Geschichte kannst du alle vier nutzen.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Quellen zu deiner eigenen Geschichte und ordne jede einer Quellenart zu.",
        ["Was liegt bei euch zu Hause in Schubladen und Alben?", "Wer kann dir von früher erzählen?"],
        "Mein Babyfoto ist eine bildliche Quelle. Mein Zeugnis aus der Grundschule ist eine schriftliche Quelle. Mein erstes Kuscheltier ist eine gegenständliche Quelle, ein Überrest aus meiner Kindheit. Außerdem kann mir meine Mutter mündlich erzählen, wie ich laufen gelernt habe.",
        ["Drei passende Quellen", "Quellenarten richtig zugeordnet", "Bezug zur eigenen Geschichte"],
      ),
      2: writing(
        "Warum wissen wir über die Altsteinzeit fast nur etwas durch Archäologie? Erkläre und nenne ein Beispiel für einen Überrest.",
        ["Gab es damals Schrift?", "Was bleibt im Boden über Jahrtausende erhalten?"],
        "In der Altsteinzeit gab es noch keine Schrift, also auch keine Briefe oder Chroniken. Die Menschen hinterließen nur Dinge, die im Boden erhalten blieben, zum Beispiel Faustkeile aus Feuerstein, Tierknochen mit Schnittspuren oder Reste von Feuerstellen. Archäologen graben diese Überreste aus und deuten sie. Ohne sie wüssten wir fast nichts über diese lange Zeit.",
        ["Fehlende Schrift genannt", "Passender Überrest genannt", "Rolle der Archäologie erklärt"],
      ),
    },
  },
  {
    id: "g6-altsteinzeit",
    lb: 2,
    title: "Jäger und Sammler der Altsteinzeit",
    period: "Altsteinzeit · bis etwa 10 000 v. Chr.",
    span: [-40000, -10000],
    intro:
      "Mehr als zwei Millionen Jahre lang lebten Menschen ohne Häuser, Felder und Haustiere. Wie haben sie überlebt?",
    paragraphs: [
      "Die Altsteinzeit ist die längste Epoche der Menschheitsgeschichte. Sie begann vor über zwei Millionen Jahren und endete in Mitteleuropa vor etwa 12 000 Jahren, also um 10 000 v. Chr. In dieser Zeit lebten Menschen als Jäger und Sammler. Lange herrschte Eiszeit: Große Teile Europas waren kalt, Gletscher reichten bis ins heutige Alpenvorland.",
      "Die Menschen zogen in kleinen Gruppen den Tierherden nach, etwa Rentieren, Wildpferden und Mammuts. Sie jagten mit Speeren und später mit Pfeil und Bogen, sammelten Beeren, Nüsse, Wurzeln und Pilze und fischten. Ihre Werkzeuge stellten sie aus Stein, Holz, Knochen und Geweih her; das bekannteste ist der Faustkeil aus Feuerstein. Sie wohnten in Zelten aus Fellen oder unter Felsdächern und an Höhleneingängen. Das Feuer spendete Wärme, Licht und Schutz und machte Fleisch leichter verdaulich.",
      "Aus der späten Altsteinzeit stammen erstaunliche Kunstwerke: Höhlenmalereien von Tieren in Frankreich und Spanien und kleine Figuren aus Mammutelfenbein von der Schwäbischen Alb, die rund 40 000 Jahre alt sind. Auch in Höhlen im Altmühltal fanden Archäologen Werkzeuge aus dieser Zeit. Weil es keine Schrift gab, wissen wir nicht, was die Bilder bedeuteten. Vielleicht hatten sie mit Glauben, Jagd oder Erinnerung zu tun.",
    ],
    takeaway:
      "In der Altsteinzeit lebten die Menschen als umherziehende Jäger und Sammler mit Werkzeugen aus Stein, Knochen und Holz. Feuer und Kleidung aus Fellen sicherten das Überleben.",
    sourceIds: ["archaeologie-bayern", "pw-archaeologie"],
    quiz: check(
      "Warum zogen die Menschen der Altsteinzeit immer wieder weiter?",
      "Sie folgten den Tierherden durch das Jahr.",
      ["Sie suchten neue Felder für ihr Getreide.", "Sie flohen vor den Steuern ihrer Könige."],
      [
        "Ackerbau begann erst in der Jungsteinzeit.",
        "Könige und Steuern gab es in der Altsteinzeit nicht.",
      ],
      "Jäger und Sammler lebten von dem, was die Natur bot. Wenn Herden wanderten oder Pflanzen abgeerntet waren, zogen sie weiter.",
    ),
    workshop: classify(
      "Was verraten die Funde?",
      ["Ernährung", "Werkzeug und Technik", "Kunst und Glaube"],
      [
        [
          "Rentierknochen mit Schnittspuren an einem Lagerplatz",
          0,
          "Die Schnittspuren zeigen: Die Tiere wurden zerlegt und gegessen.",
        ],
        [
          "Ein Faustkeil aus Feuerstein mit scharfer Kante",
          1,
          "Mit ihm konnte man schneiden, schaben und hacken.",
        ],
        [
          "Eine kleine Tierfigur aus Mammutelfenbein",
          2,
          "Sie hatte keinen erkennbaren praktischen Zweck: ein Hinweis auf Kunst oder Glauben.",
        ],
        [
          "Eine Knochennadel mit Öhr",
          1,
          "Mit ihr nähten Menschen Kleidung aus Fellen zusammen.",
        ],
        [
          "Verkohlte Haselnussschalen an einer Feuerstelle",
          0,
          "Gesammelte Nüsse gehörten zur Nahrung.",
        ],
        [
          "Mit Farbe gemalte Pferde an einer Höhlenwand",
          2,
          "Die Bilder zeigen, dass Menschen gestalteten und vielleicht Bedeutungen ausdrückten.",
        ],
      ],
      "Schon wenige Funde erzählen viel: wovon Menschen lebten, wie geschickt sie waren und dass sie Kunst schufen.",
    ),
    tasks: {
      1: writing(
        "Beschreibe den Alltag einer Gruppe von Jägern und Sammlern in der Altsteinzeit. Gehe auf Nahrung, Wohnen und Werkzeuge ein.",
        ["Wovon lebten sie, und warum zogen sie umher?", "Woraus bestanden Werkzeuge und Zelte?"],
        "Die Gruppe lebte von der Jagd auf Rentiere, Pferde oder Mammuts und sammelte Beeren, Nüsse und Wurzeln. Weil die Herden wanderten, zog sie mit und wohnte in Zelten aus Fellen oder an Höhleneingängen. Ihre Werkzeuge stellte sie aus Feuerstein, Knochen, Holz und Geweih her, zum Beispiel Faustkeile, Speere und Nadeln. Das Feuer wärmte und schützte die Gruppe.",
        ["Nahrung beschrieben", "Wohnen und Umherziehen erklärt", "Werkzeuge genannt"],
      ),
      2: writing(
        "Höhlenmalereien zeigen fast nur Tiere. Was kannst du daraus über die Menschen schließen, und was bleibt unsicher?",
        ["Welche Rolle spielten Tiere im Leben der Menschen?", "Warum wissen wir nicht, was die Bilder bedeuteten?"],
        "Die Tiere waren für die Menschen sehr wichtig, denn sie lieferten Nahrung, Felle und Knochen für Werkzeuge. Die Bilder zeigen außerdem, dass die Menschen genau beobachteten und geschickte Künstler waren. Unsicher bleibt, warum sie malten: für einen Jagdzauber, für Feste oder zur Erinnerung. Weil es keine Schrift gab, kann uns das niemand erklären.",
        ["Bedeutung der Tiere erkannt", "Begründeter Schluss gezogen", "Unsicherheit benannt"],
      ),
    },
  },
  {
    id: "g6-jungsteinzeit",
    lb: 2,
    title: "Die Bauern der Jungsteinzeit",
    period: "Jungsteinzeit · in Bayern ab etwa 5500 v. Chr.",
    span: [-5500, -2200],
    intro:
      "Vor etwa 12 000 Jahren begannen Menschen, Getreide zu säen und Tiere zu halten. Diese Veränderung prägt unser Leben bis heute.",
    paragraphs: [
      "Nach der Eiszeit wurde es wärmer. Im Vorderen Orient, im sogenannten Fruchtbaren Halbmond, begannen Menschen um 10 000 v. Chr., wilde Getreidearten wie Einkorn, Emmer und Gerste gezielt anzubauen. Sie zähmten Schafe, Ziegen, Rinder und Schweine. Von dort verbreitete sich die neue Lebensweise langsam nach Europa und erreichte das heutige Bayern um 5500 v. Chr.",
      "Wer Felder bestellt, muss bleiben, bis geerntet ist. Die Menschen wurden sesshaft und bauten Dörfer mit großen Langhäusern aus Holz, Lehm und Schilf, in denen Familie, Vorräte und manchmal das Vieh Platz hatten. Neue Techniken entstanden: Gefäße aus gebranntem Ton schützten Vorräte vor Nässe und Mäusen, geschliffene Steinbeile fällten Bäume, aus Flachs und Wolle wurden Fäden gesponnen und Stoffe gewebt.",
      "Weil dieser Wandel das Leben so grundlegend veränderte, spricht man von der neolithischen Revolution, auch wenn er Jahrtausende dauerte. Ackerbau ernährte mehr Menschen, die Dörfer wuchsen. Nicht alle mussten nun Nahrung beschaffen: Manche wurden besonders geschickte Töpfer oder Werkzeugmacher. Mit Vorräten, Vieh und Land entstand Besitz, und um Besitz konnte gestritten werden. Missernten wurden zu einer neuen Gefahr.",
    ],
    takeaway:
      "In der Jungsteinzeit wurden die Menschen sesshaft und lebten von Ackerbau und Viehzucht. Diese neolithische Revolution brachte Dörfer, Vorräte, Besitz und neue Berufe.",
    sourceIds: ["archaeologie-bayern", "lehrplan"],
    quiz: check(
      "Was bezeichnet der Begriff „neolithische Revolution“?",
      "Den Übergang zu Sesshaftigkeit, Ackerbau und Viehzucht.",
      ["Die erste Nutzung des Feuers durch Menschen.", "Einen Aufstand von Bauern gegen ihren König."],
      [
        "Feuer nutzten schon die Menschen der Altsteinzeit.",
        "Revolution meint hier eine grundlegende Veränderung der Lebensweise, keinen Aufstand.",
      ],
      "„Neolithisch“ heißt jungsteinzeitlich. Die Revolution war eine tiefgreifende Veränderung, die über Jahrtausende verlief.",
    ),
    diagram: {
      kind: "compare",
      title: "Zwei Lebensweisen im Vergleich",
      columns: ["Altsteinzeit", "Jungsteinzeit"],
      rows: [
        { aspect: "Nahrung", values: ["jagen, sammeln, fischen", "Ackerbau und Viehzucht"] },
        { aspect: "Wohnen", values: ["umherziehen, Zelte und Höhleneingänge", "sesshaft in Dörfern mit Langhäusern"] },
        { aspect: "Werkzeuge", values: ["geschlagene Steine, Knochen, Holz", "geschliffene Steinbeile, Sicheln, Mahlsteine"] },
        { aspect: "Neue Techniken", values: ["Feuer, Nähen mit Knochennadeln", "Töpfern, Spinnen und Weben"] },
        { aspect: "Besitz", values: ["wenig, was man tragen konnte", "Häuser, Felder, Vieh, Vorräte"] },
      ],
      caption:
        "Die Jungsteinzeit brachte mehr Sicherheit durch Vorräte, aber auch neue Abhängigkeit von Ernte und Wetter.",
    },
    workshop: classify(
      "Altsteinzeit oder Jungsteinzeit?",
      ["Altsteinzeit", "Jungsteinzeit"],
      [
        [
          "Eine Gruppe zieht im Herbst den Rentierherden nach.",
          0,
          "Umherziehen mit den Herden ist typisch für Jäger und Sammler.",
        ],
        [
          "In einem Tongefäß wird Getreide für den Winter aufbewahrt.",
          1,
          "Gebrannte Gefäße und Vorräte gehören zur sesshaften Lebensweise.",
        ],
        [
          "Ein Mann schlägt einen Faustkeil aus einer Feuersteinknolle.",
          0,
          "Geschlagene Steinwerkzeuge prägen die Altsteinzeit.",
        ],
        [
          "Eine Frau webt am Webstuhl einen Stoff aus Flachs.",
          1,
          "Spinnen und Weben kamen mit der Jungsteinzeit auf.",
        ],
        [
          "Kinder hüten Ziegen auf einer Weide neben dem Dorf.",
          1,
          "Haustiere und Dörfer gab es erst mit der Sesshaftigkeit.",
        ],
      ],
      "Die Frage „umherziehen oder bleiben?“ hilft fast immer bei der Zuordnung.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum Ackerbau die Menschen sesshaft machte.",
        ["Wie lange dauert es vom Säen bis zur Ernte?", "Was musste man mit der Ernte tun?"],
        "Wer Getreide sät, muss viele Monate auf die Ernte warten und das Feld in dieser Zeit pflegen und schützen. Danach müssen die Vorräte gelagert werden, bis die nächste Ernte kommt. Deshalb blieben die Menschen an einem Ort, bauten feste Häuser und legten Dörfer an.",
        ["Zeit bis zur Ernte genannt", "Vorratshaltung erklärt", "Folge Sesshaftigkeit genannt"],
      ),
      2: writing(
        "War die neolithische Revolution für die Menschen nur ein Fortschritt? Wäge einen Vorteil und einen Nachteil ab.",
        ["Was wurde sicherer?", "Welche neuen Probleme entstanden?"],
        "Ein Vorteil war, dass Ackerbau und Vorräte mehr Menschen ernähren konnten und man nicht mehr ständig umherziehen musste. Ein Nachteil war die neue Abhängigkeit von Wetter und Ernte: Eine Missernte konnte Hunger bedeuten. Außerdem entstand Besitz, um den gestritten wurde. Insgesamt war es ein großer Fortschritt, aber mit neuen Risiken.",
        ["Vorteil genannt", "Nachteil genannt", "Abwägendes Urteil"],
      ),
    },
  },
  {
    id: "g6-kelten",
    lb: 2,
    title: "Die Kelten in Süddeutschland",
    period: "Eisenzeit · etwa 800 v. Chr. bis Christi Geburt",
    span: [-800, -15],
    intro:
      "Vor den Römern lebten in Bayern die Kelten. Sie bauten Städte, prägten Münzen und schmiedeten Eisen. Ihre Spuren findest du bis heute.",
    paragraphs: [
      "Die Kelten waren kein einheitliches Volk mit einem Staat, sondern viele Stämme mit ähnlicher Sprache, Kunst und Religion. Ab etwa 800 v. Chr. lebten sie in weiten Teilen Europas, von Frankreich über Süddeutschland bis nach Böhmen. Sie waren geschickte Handwerker: Sie verarbeiteten Eisen zu Werkzeugen und Waffen, stellten Glasarmreifen her und töpferten auf der Drehscheibe. Mit den Griechen und Etruskern im Süden trieben sie Handel, zum Beispiel mit Wein.",
      "Bei Manching nahe Ingolstadt lag eine der größten keltischen Städte nördlich der Alpen, ein Oppidum. Eine rund sieben Kilometer lange Mauer aus Holz, Erde und Stein umgab Wohnhäuser, Werkstätten und Speicher. Dort wurden Münzen geprägt, darunter goldene „Regenbogenschüsselchen“. Um die Mitte des 1. Jahrhunderts v. Chr. wurde Manching aufgegeben; 15 v. Chr. eroberten die Römer das Alpenvorland.",
      "Die Kelten schrieben selbst kaum etwas auf. Vieles wissen wir aus Ausgrabungen, manches aus Berichten griechischer und römischer Autoren, die die Kelten als fremd und oft als wild beschrieben. Spuren der Kelten gibt es bis heute: Grabhügel und Wälle in Bayern, Fundstücke in Museen, vermutlich keltische Flussnamen wie die Isar und keltische Sprachen, die in Irland, Schottland, Wales und der Bretagne noch gesprochen werden.",
    ],
    takeaway:
      "Die Kelten lebten vor den Römern in Süddeutschland. Ihr Oppidum Manching, Funde, Namen und Sprachen zeigen ihre Bedeutung für Europa.",
    sourceIds: ["manching", "archaeologie-bayern"],
    quiz: check(
      "Warum wissen wir über die Kelten vor allem aus Ausgrabungen?",
      "Sie haben selbst kaum etwas aufgeschrieben.",
      ["Alle römischen Berichte über sie sind verloren.", "Sie haben ihre Städte vor dem Abzug zerstört."],
      [
        "Römische Berichte gibt es, zum Beispiel von Caesar; sie zeigen aber eine fremde Sicht.",
        "Manche Orte wurden aufgegeben, doch das erklärt nicht, warum es kaum keltische Texte gibt.",
      ],
      "Ohne eigene Schriftquellen sind Funde der wichtigste Zugang. Berichte von Griechen und Römern zeigen die Kelten nur von außen.",
    ),
    workshop: classify(
      "Spuren der Kelten",
      ["Archäologischer Fund", "Spur in Sprache und Namen", "Bericht von außen"],
      [
        [
          "Goldmünzen aus dem Oppidum Manching",
          0,
          "Münzen wurden ausgegraben: eine Sachquelle.",
        ],
        [
          "Der Flussname Isar geht vermutlich auf ein keltisches Wort zurück.",
          1,
          "Namen können Jahrtausende überdauern.",
        ],
        [
          "Ein römischer Feldherr beschreibt die Gallier als tapfer, aber unbeständig.",
          2,
          "Das ist die Sicht eines Fremden, der gegen sie Krieg führte.",
        ],
        [
          "In Wales wird bis heute eine keltische Sprache gesprochen.",
          1,
          "Walisisch gehört zu den keltischen Sprachen.",
        ],
        [
          "Reste einer Mauer aus Holz, Erde und Stein um eine Siedlung",
          0,
          "Die Mauer wurde ausgegraben und vermessen.",
        ],
      ],
      "Erst Funde, Namen und fremde Berichte zusammen ergeben ein Bild der Kelten. Jede Spur hat ihre eigene Aussagekraft.",
    ),
    tasks: {
      1: writing(
        "Beschreibe das Oppidum Manching mit drei Merkmalen und erkläre, warum es für die Geschichte Bayerns wichtig ist.",
        ["Wie war die Stadt geschützt, und was geschah dort?", "Was zeigt sie über die Kelten?"],
        "Manching war eine große keltische Stadt bei Ingolstadt. Eine etwa sieben Kilometer lange Mauer schützte Häuser, Werkstätten und Speicher, und es wurden sogar Münzen geprägt. Das Oppidum zeigt, dass in Bayern schon vor den Römern Menschen in einer Stadt mit Handwerk und Handel lebten.",
        ["Drei Merkmale genannt", "Bedeutung für Bayern erklärt", "Fachbegriff Oppidum verwendet"],
      ),
      2: writing(
        "Griechische und römische Autoren beschrieben die Kelten oft als wild und kriegslustig. Wie gehst du mit diesem Urteil um?",
        ["Wer urteilt hier über wen?", "Welche anderen Belege könntest du heranziehen?"],
        "Das Urteil stammt von Griechen und Römern, also von Fremden, die die Kelten oft als Gegner erlebten und ihre eigene Lebensweise für überlegen hielten. Ich prüfe das Urteil deshalb mit Funden, zum Beispiel aus Manching: Dort zeigen Werkstätten, Münzen und eine große Stadtmauer eine geordnete Gesellschaft mit Handwerk und Handel. Das Urteil ist also einseitig.",
        ["Perspektive des Autors erkannt", "Gegenbelege genannt", "Begründetes Urteil"],
      ),
    },
  },
];
