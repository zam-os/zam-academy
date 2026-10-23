import type { Lesson } from "../model/types";

/** Lernbereich 3, erster Teil: Schreibfertigkeiten, Zitate und Schreibformen (3.1). */
export const LB3A: Lesson[] = [
  {
    id: "de-bewerbung",
    lb: 3,
    unit: "3.1",
    covers: ["3.1.1"],
    title: "Bewerbung, Lebenslauf und Brief richtig gestalten",
    intro:
      "Bewerbung, Lebenslauf und sachlicher Brief folgen einem festen Aufbau. Wer ihn kennt, zeigt Sorgfalt und wird ernst genommen.",
    paragraphs: [
      "Eine Bewerbung besteht meist aus dem **Anschreiben**, dem Lebenslauf und den Anlagen, zum Beispiel den letzten Zeugnissen. Wer sie liest, hat oft wenig Zeit und achtet zuerst auf die Form: Sind alle Bausteine da, stehen sie am richtigen Platz, sieht alles gepflegt aus? Für Briefe gibt es eine Norm, die DIN 5008 („Schreib- und Gestaltungsregeln für die Text- und Informationsverarbeitung“). Sie ist eine Orientierung und kein Gesetz, und Maße musst du nicht auswendig kennen. Von oben nach unten stehen im Anschreiben: dein Absender, die Anschrift der Firma, das Datum, die Betreffzeile, die Anrede, der Text, die Grußformel mit Unterschrift und am Ende, falls du etwas beilegst, der Hinweis auf die Anlagen. Wo genau das Datum steht, ist nicht überall gleich: im Muster der Bundesagentur für Arbeit rechtsbündig unter den Adressen, in anderen Vorlagen neben dem Adressfeld. Es steht aber vor der Betreffzeile.",
      "Die **Betreffzeile** nennt knapp, worum es geht, zum Beispiel „Bewerbung um einen Praktikumsplatz“. Die Anrede nennt, wenn du den Namen herausfinden kannst, die Ansprechperson, zum Beispiel „Sehr geehrter Herr Brunner“. Dahinter steht üblicherweise ein Komma, und du schreibst klein weiter, außer das erste Wort wird ohnehin großgeschrieben, etwa „Ihre“ oder ein Nomen. In der Einleitung sagst du, warum du dich gerade bei dieser Firma bewirbst; die Bundesagentur für Arbeit rät davon ab, mit „Hiermit bewerbe ich mich …“ zu beginnen. Im Hauptteil belegst du mit Beispielen, was du mitbringst, etwa ein Praktikum oder ein Hobby. Der Schluss bittet um ein Gespräch. Die **Grußformel** „Mit freundlichen Grüßen“ steht meist ohne Satzzeichen, darunter folgen deine Unterschrift und dein Name.",
      "Der **Lebenslauf** ist tabellarisch: Links stehen Überschriften und Zeiträume, rechts knappe Angaben statt ganzer Sätze. Die Bundesagentur für Arbeit nennt als Abschnitte persönliche Daten, praktische Erfahrung (zum Beispiel Praktika), Schulbildung, Fähigkeiten, Hobbys sowie Ort und Datum; eine Unterschrift ist nicht unbedingt nötig. Außerdem empfiehlt die Bundesagentur, mit der jüngsten Station zu beginnen und Schritt für Schritt zurückzugehen; verlangt eine Firma oder deine Lehrkraft etwas anderes, gilt deren Vorgabe. Jede Station hat Start- und Enddatum (Monat und Jahr genügen), eine laufende beginnt mit „seit …“. Ein bis zwei Seiten reichen, die E-Mail-Adresse sollte seriös klingen, und ein Foto ist keine Pflicht mehr. Ein **sachlicher Brief**, etwa eine Anfrage an einen Verein, hat denselben Rahmen wie das Anschreiben. Nur der Text richtet sich nach dem Anliegen: Du nennst den Anlass, sagst klar, was du möchtest, und bittest um eine Antwort. Überall gilt: sachlich und höflich schreiben, in Standardsprache und ohne Umgangssprache.",
      "Ein Textverarbeitungsprogramm nimmt dir viel Arbeit ab, wenn du seine Layoutmöglichkeiten gezielt nutzt. Wähle eine gut lesbare Schriftart in normaler Größe (das Muster der Bundesagentur verwendet 11 Punkt) und nimm in Anschreiben und Lebenslauf dieselbe. Richte das Datum wie im Muster der Bundesagentur rechtsbündig aus und gliedere den Text in Absätze, statt jeden Satz in eine neue Zeile zu setzen. Für den Lebenslauf eignet sich eine Tabelle, weil die Zeiträume dann genau untereinander stehen. Prüfe in der Seitenvorschau, ob alles auf die vorgesehenen Seiten passt. Die Rechtschreibprüfung findet viele Fehler, aber nicht alle: Ergibt ein Tippfehler zufällig ein anderes Wort, markiert sie ihn nicht. Lies deshalb am Ende selbst noch einmal.",
    ],
    terms: [
      {
        term: "Anschreiben",
        text: "Der Brief, mit dem du dich bewirbst: Er begründet in ganzen Sätzen, warum du zur Stelle passt.",
      },
      {
        term: "Betreffzeile",
        text: "Die Zeile über der Anrede, die knapp nennt, worum es im Brief geht.",
      },
      {
        term: "Grußformel",
        text: "Der höfliche Briefschluss vor der Unterschrift, zum Beispiel „Mit freundlichen Grüßen“.",
      },
      {
        term: "Tabellarischer Lebenslauf",
        text: "Eine Übersicht über deinen Werdegang in Tabellenform, mit Zeiträumen links und kurzen Angaben rechts.",
      },
      {
        term: "Anlagen",
        text: "Unterlagen, die du der Bewerbung beilegst, zum Beispiel Kopien der letzten Zeugnisse.",
      },
    ],
    examples: [
      {
        title: "Ein Anschreiben für ein Ferienpraktikum (eigens verfasst)",
        text: "Lena Hartmann, Birkenweg 7, 12345 Musterstadt\nFahrradwerkstatt Brunner\nHerrn Tobias Brunner\nMühlgasse 3\n12345 Musterstadt\n12.11.2026\nBewerbung um einen Praktikumsplatz in den Sommerferien\nSehr geehrter Herr Brunner,\nin Ihrer Werkstatt habe ich als Kind oft zugesehen, wenn mein Onkel sein Rad reparieren ließ. Seitdem bastle ich selbst gern an Fahrrädern und möchte erfahren, wie ein Fachbetrieb arbeitet.\nIch besuche die neunte Klasse der Beispiel-Realschule und habe in Physik im letzten Zeugnis eine Zwei. Zu Hause habe ich schon Bremsbeläge und einen Schlauch an meinem Rad gewechselt. Dabei habe ich gemerkt, wie wichtig genaues Arbeiten ist.\nÜber eine Einladung zu einem Gespräch freue ich mich sehr.\nMit freundlichen Grüßen\nLena Hartmann\nAnlagen: Lebenslauf, letztes Zeugnis",
        analysis:
          "Der Brief enthält alle Bausteine von oben nach unten: Absender, Anschrift, Datum, **Betreffzeile**, **Anrede**, Text, **Grußformel** und **Anlagen**. Die Einleitung nennt einen persönlichen Grund, der Hauptteil belegt mit zwei Beispielen, was Lena mitbringt, der Schluss bittet um ein Gespräch. Nach der Anrede mit Komma beginnt der Text klein, und die Grußformel steht ohne Satzzeichen.",
      },
    ],
    takeaway:
      "Ein Anschreiben hat feste Bausteine: Absender, Anschrift, Datum, Betreffzeile, Anrede, Text, Grußformel, Unterschrift und Anlagen. Der Lebenslauf ist eine Tabelle, und die Bundesagentur empfiehlt die jüngste Station zuerst. Beide schreibst du sachlich und höflich und gestaltest sie einheitlich.",
    sourceIds: ["lp", "arbeitsagentur", "regelwerk", "post"],
    quiz: {
      question: "Wie unterscheiden sich Anschreiben und Lebenslauf einer Bewerbung?",
      answer:
        "Das Anschreiben begründet in ganzen Sätzen, warum du passt; der Lebenslauf zeigt deinen Werdegang als kurze Tabelle.",
      wrong: [
        "Das Anschreiben wiederholt den Lebenslauf Station für Station; der Lebenslauf fasst in Sätzen zusammen, warum du dich bewirbst.",
        "Beide bestehen aus ganzen Sätzen und stehen zusammen auf einer einzigen Seite, damit nichts verloren geht.",
      ],
      explanation:
        "Im Anschreiben begründest du, warum du zur Stelle passt, und belegst es mit Beispielen. Der tabellarische Lebenslauf listet Stationen mit Zeiträumen in Stichpunkten auf. Wiederholt das Anschreiben nur den Lebenslauf, erfährt die Firma nichts Neues.",
    },
    workshop: {
      kind: "timeline",
      title: "Das Anschreiben von oben nach unten",
      instruction:
        "Bringe die Bausteine eines Anschreibens in die Reihenfolge, in der sie von oben nach unten auf der Seite stehen. Mit den Pfeilen verschiebst du einen Baustein.",
      categories: [],
      entries: [
        {
          text: "Dein Absender und die Anschrift der Firma stehen ganz oben auf der Seite.",
          target: 0,
          feedback: "Ein Brief beginnt damit, wer schreibt und an wen er geht.",
        },
        {
          text: "Das Datum nennt den Tag, an dem du den Brief schreibst, zum Beispiel 12.11.2026.",
          target: 1,
          feedback:
            "Das Datum steht oberhalb der Betreffzeile: im Muster der Bundesagentur rechtsbündig unter den Adressen, in anderen Vorlagen neben dem Adressfeld.",
        },
        {
          text: "Die Betreffzeile nennt knapp, worum du dich bewirbst.",
          target: 2,
          feedback: "Wer den Brief öffnet, weiß durch die Betreffzeile sofort, worum es geht.",
        },
        {
          text: "Die Anrede spricht die Ansprechperson an, danach steht ein Komma.",
          target: 3,
          feedback: "Die Anrede leitet den eigentlichen Text ein und steht deshalb direkt davor.",
        },
        {
          text: "Der Text führt von der Einleitung über den Hauptteil zum Schluss mit der Bitte um ein Gespräch.",
          target: 4,
          feedback: "Der Haupttext ist der längste Teil und steht zwischen Anrede und Grußformel.",
        },
        {
          text: "Grußformel, Unterschrift, Name und der Hinweis auf die Anlagen beenden den Brief.",
          target: 5,
          feedback: "Der Briefschluss steht ganz unten, die Anlagen werden zuletzt genannt.",
        },
      ],
      conclusion:
        "Von oben nach unten: Absender und Anschrift, Datum, Betreffzeile, Anrede, Text und Briefschluss mit Anlagen. Wer die Reihenfolge kennt, vergisst keinen Baustein.",
    },
    casework: {
      title: "Ein Lebenslauf als Fließtext",
      story:
        "Tim Berger schickt der Gärtnerei Grünhof seinen Lebenslauf als Fließtext: **„Von 2018 bis 2022 war ich in der Grundschule, seit 2022 bin ich in der Realschule. Im Mai 2026 habe ich ein Praktikum in einer Gärtnerei gemacht. Meine E-Mail-Adresse ist partymaus@beispielmail.de.“** Seine Lehrerin bittet ihn, den Lebenslauf zu überarbeiten.",
      steps: [
        {
          question: "Welche Form passt besser zu einem Lebenslauf als der Fließtext?",
          options: [
            "Eine Tabelle mit Zeiträumen links und kurzen Angaben rechts",
            "Ein Brief an die Firma mit Anrede und ganzen Sätzen",
            "Eine Liste aus Stichwörtern ohne Überschriften und Zeiträume",
          ],
          answer: 0,
          explanation:
            "Ein tabellarischer Lebenslauf lässt sich in Sekunden überblicken: Zeiträume links, knappe Angaben rechts. Ganze Sätze gehören ins Anschreiben.",
        },
        {
          question: "Welche Reihenfolge der Stationen empfiehlt die Bundesagentur für Arbeit für den Lebenslauf?",
          options: [
            "Die jüngste Station steht zuerst, zum Beispiel erst die Realschule, dann die Grundschule.",
            "Die älteste Station steht zuerst, zum Beispiel erst die Grundschule, dann die Realschule.",
            "Die Reihenfolge ist egal, solange alle Stationen genannt werden.",
          ],
          answer: 0,
          explanation:
            "Die Bundesagentur für Arbeit empfiehlt, mit der Station zu beginnen, die am kürzesten zurückliegt, und dann Schritt für Schritt zurückzugehen. So steht das Aktuellste oben. Verlangt eine Firma oder deine Lehrkraft etwas anderes, gilt deren Vorgabe.",
        },
        {
          question: "Was stimmt an der E-Mail-Adresse nicht?",
          options: [
            "Sie klingt nach Spitzname und Freizeit; eine seriöse Adresse enthält zum Beispiel Vor- und Nachname.",
            "Sie ist zu lang für einen Lebenslauf und passt nicht in die Tabelle.",
            "E-Mail-Adressen gehören nicht in einen Lebenslauf, nur in das Anschreiben.",
          ],
          answer: 0,
          explanation:
            "Die Kontaktdaten gehören in den Lebenslauf, und die Adresse sollte seriös wirken. Spitznamen können einen schlechten ersten Eindruck machen.",
        },
        {
          question: "Welche Aussage zum Bewerbungsfoto stimmt?",
          options: [
            "Es ist keine Pflicht mehr; wer eines beilegt, wählt ein ordentliches Bewerbungsfoto.",
            "Es ist gesetzlich vorgeschrieben, sonst wird die Bewerbung abgelehnt.",
            "Es ist grundsätzlich verboten, ein Foto beizulegen.",
          ],
          answer: 0,
          explanation:
            "Ein Foto ist freiwillig. Wer eines beilegt, nimmt nach dem Rat der Bundesagentur für Arbeit ein professionelles Bewerbungsfoto, kein Pass- oder Urlaubsbild und kein Selfie.",
        },
      ],
      verdict:
        "Tims Lebenslauf wird zur Tabelle: Zeiträume links, kurze Angaben rechts, die jüngste Station zuerst und eine seriöse E-Mail-Adresse. Ein Foto ist freiwillig.",
    },
    tasks: {
      1: {
        prompt:
          "Du bewirbst dich bei der erfundenen Gärtnerei Lindenhof, Frau Sabine Kroll, um ein Ferienpraktikum. Schreibe die Betreffzeile, die Anrede, zwei Sätze für die Einleitung und den Schlusssatz mit Grußformel.",
        hints: [
          "Die Betreffzeile nennt knapp, worum du dich bewirbst. Die Einleitung gibt einen persönlichen Grund an und beginnt nicht mit „Hiermit bewerbe ich mich“.",
          "Nach der Anrede mit Komma beginnt der Text klein. Der Schluss bittet um ein Gespräch, und die Grußformel steht meist ohne Satzzeichen.",
        ],
        model:
          "Betreffzeile: Bewerbung um ein Ferienpraktikum in Ihrer Gärtnerei. Anrede: Sehr geehrte Frau Kroll, Einleitung: seit zwei Jahren pflege ich mit meiner Oma einen Gemüsegarten und möchte wissen, wie ein Betrieb Pflanzen in großen Mengen zieht. Deshalb bewerbe ich mich bei Ihnen um ein Praktikum in den Sommerferien. Schluss: Über eine Einladung zu einem Gespräch freue ich mich sehr. Grußformel: Mit freundlichen Grüßen",
        criteria: [
          "Die Betreffzeile nennt, worum du dich bewirbst, und die Anrede nennt die Ansprechperson mit Komma.",
          "Die Einleitung begründet persönlich, warum du dich bei dieser Firma bewirbst.",
          "Der Schluss bittet um ein Gespräch, danach folgt die Grußformel.",
        ],
      },
      2: {
        prompt:
          "Deine Klasse möchte die erfundene Stadtbücherei Musterstadt besuchen. Schreibe an die Leiterin, Frau Karin Seidel, einen sachlichen Brief mit allen Bausteinen von Absender bis Grußformel, in dem du für 25 Schülerinnen und Schüler um eine Führung in der ersten Dezemberhälfte bittest.",
        hints: [
          "Beginne mit Absender, Anschrift, Datum und Betreffzeile. In den Text gehören der Anlass, dein Anliegen mit Datum und Personenzahl und die Bitte um Antwort.",
          "Schreibe sachlich und höflich in der „Sie“-Form, ohne Umgangssprache, und beende den Brief mit Grußformel und Namen.",
        ],
        model:
          "Absender: Jonas Keller, Klasse 9b der Beispiel-Realschule, Schulweg 4, 12345 Musterstadt. Anschrift: Stadtbücherei Musterstadt, Frau Karin Seidel, Marktplatz 1, 12345 Musterstadt. Datum: 12.11.2026. Betreffzeile: Anfrage zu einer Führung für die Klasse 9b. Anrede: Sehr geehrte Frau Seidel, Text: im Deutschunterricht lernen wir, wie man in Bibliotheken recherchiert. Deshalb würden wir Ihre Bücherei gern kennenlernen. Wir bitten Sie um eine Führung für 25 Schülerinnen und Schüler in der ersten Dezemberhälfte, am liebsten vormittags. Bitte teilen Sie uns mit, ob und an welchem Tag das möglich ist. Grußformel und Name: Mit freundlichen Grüßen Jonas Keller",
        criteria: [
          "Der Brief enthält Absender, Anschrift, Datum, Betreffzeile, Anrede und Grußformel in der üblichen Reihenfolge.",
          "Der Text nennt Anlass und Anliegen klar (wer, was, wann) und bittet um eine Antwort.",
          "Die Sprache ist sachlich und höflich, mit „Sie“ und ohne Umgangssprache.",
        ],
      },
    },
  },
  {
    id: "de-schaubild-erstellen",
    lb: 3,
    unit: "3.1",
    covers: ["3.1.2"],
    title: "Informationen im Schaubild anschaulich darstellen",
    intro:
      "Ein Schaubild zeigt Zahlen auf einen Blick. Du wählst die passende Diagrammart und beschriftest sie vollständig.",
    paragraphs: [
      "In einer Präsentation sind viele Zahlen schwer zu behalten. Ein **Schaubild** zeigt sie so, dass dein Publikum die Aussage sofort erkennt. Schaubilder hast du in Klasse 8 ausgewertet, jetzt erstellst du selbst eines. Überlege dazu zuerst, was die Zuhörenden danach wissen sollen: die **Kernaussage**. Ein Beispiel mit angenommenen Zahlen: In der Klasse 9a kommen 12 Schülerinnen und Schüler mit dem Rad, 9 mit dem Bus, 4 zu Fuß und 2 mit dem Auto zur Schule. Die Kernaussage lautet: „Das Rad ist das häufigste Verkehrsmittel.“ Pro Schaubild genügt eine Kernaussage. Wer mehrere Aussagen in ein Bild packt, macht es unübersichtlich, und die Aussage geht unter.",
      "Die Kernaussage bestimmt die Diagrammart. Ein **Säulendiagramm** (senkrechte Säulen) oder **Balkendiagramm** (waagerechte Balken) vergleicht Werte verschiedener Gruppen, etwa die Verkehrsmittel der Klasse. Balken eignen sich besonders, wenn die Beschriftungen lang sind. Ein **Kreisdiagramm** zeigt Anteile an einem Ganzen, die zusammen 100 % ergeben; es bleibt übersichtlich, wenn es nur wenige Teile hat. Ein **Liniendiagramm** zeigt eine Entwicklung über die Zeit, zum Beispiel die Temperatur im Lauf eines Tages. Für zwei oder drei Zeitpunkte genügen auch Säulen. Frage dich also: Vergleiche ich Gruppen, zeige ich Anteile oder eine Entwicklung?",
      "Damit das Schaubild ohne deine Erklärung verständlich ist, braucht es feste Angaben. Der **Titel** sagt, was gezeigt wird, wo und wann, zum Beispiel „So kommt die Klasse 9a zur Schule“. Die **Achsenbeschriftung** nennt, was auf jeder Achse steht, und die Einheit: „Anzahl der Schülerinnen und Schüler“ oder „Temperatur in °C“. Eine Legende brauchst du nur, wenn Farben oder Linien etwas bedeuten. Unter dem Schaubild steht die **Quelle**, also woher die Zahlen stammen, zum Beispiel „Umfrage in der Klasse 9a“. Sind die Zahlen erfunden, schreibst du „angenommene Werte“ dazu. Bei Säulen und Balken beginnt die Achse mit den Werten bei null; sonst wirken kleine Unterschiede viel größer, als sie sind.",
      "Gut ist ein Schaubild, wenn nichts Überflüssiges darin steht. Lass dreidimensionale Effekte, Schattierungen und Farben weg, die nichts bedeuten, und beschränke dich auf die Zahlen, die zur Kernaussage gehören. Mit einem Tabellenkalkulationsprogramm geht es schnell: Du trägst die Zahlen in eine Tabelle ein, markierst sie und wählst eine Diagrammart. Das Programm schlägt oft eine vor, aber du entscheidest, ob sie zur Kernaussage passt. Titel, Achsenbeschriftungen und Quelle ergänzt du meist selbst. Prüfe am Ende, ob man Schrift und Zahlen auch aus der letzten Reihe lesen kann; wenn nicht, wähle eine größere Schrift.",
    ],
    terms: [
      {
        term: "Kernaussage",
        text: "Der eine Gedanke, den dein Publikum nach einem Blick auf das Schaubild behalten soll.",
      },
      {
        term: "Säulen- und Balkendiagramm",
        text: "Diagramme mit senkrechten Säulen oder waagerechten Balken, die Werte verschiedener Gruppen vergleichen.",
      },
      {
        term: "Kreisdiagramm",
        text: "Ein Kreis, dessen Teile Anteile an einem Ganzen zeigen, die zusammen 100 % ergeben.",
      },
      {
        term: "Liniendiagramm",
        text: "Ein Diagramm, dessen Linie zeigt, wie sich ein Wert über die Zeit verändert.",
      },
      {
        term: "Achsenbeschriftung",
        text: "Die Angabe an jeder Achse, was sie zeigt, einschließlich der Einheit, zum Beispiel „Temperatur in °C“.",
      },
      {
        term: "Quellenangabe",
        text: "Der Hinweis unter dem Schaubild, woher die Zahlen stammen, damit man sie nachprüfen kann.",
      },
    ],
    examples: [
      {
        title: "Ein geplantes Schaubild in Worten (eigens verfasst, Werte angenommen)",
        text: "Kernaussage: Das Rad ist das häufigste Verkehrsmittel der Klasse 9a auf dem Schulweg.\nWerte (angenommen): Rad 12, Bus 9, zu Fuß 4, Auto 2\nDiagrammart: Säulendiagramm, weil Gruppen verglichen werden\nTitel: So kommt die Klasse 9a zur Schule\nWaagerechte Achse: Verkehrsmittel\nSenkrechte Achse: Anzahl der Schülerinnen und Schüler (Beginn bei 0)\nQuelle: Umfrage in der Klasse 9a (angenommene Werte)",
        analysis:
          "Die **Kernaussage** steht am Anfang und bestimmt alles Weitere. Weil vier Gruppen verglichen werden, passt ein Säulendiagramm. Der **Titel** nennt Thema und Gruppe, die senkrechte Achse hat eine Einheit und beginnt bei null, und die **Quelle** weist die Zahlen als angenommen aus.",
      },
    ],
    takeaway:
      "Erst die Kernaussage, dann die Diagrammart: Säulen oder Balken vergleichen Gruppen, der Kreis zeigt Anteile an einem Ganzen, die Linie eine Entwicklung über die Zeit. Dazu gehören Titel, Achsenbeschriftung mit Einheit und Quelle; Überflüssiges lässt du weg.",
    sourceIds: ["lp"],
    quiz: {
      question: "Wofür eignet sich ein Liniendiagramm am besten?",
      answer: "Für eine Entwicklung über die Zeit, zum Beispiel die Temperatur im Verlauf eines Tages.",
      wrong: [
        "Für Anteile an einem Ganzen, die zusammen 100 % ergeben, zum Beispiel Umfrageergebnisse.",
        "Für den Vergleich weniger Gruppen ohne Zeitbezug, zum Beispiel die Verkehrsmittel einer Klasse.",
      ],
      explanation:
        "Die Linie verbindet Werte, die zeitlich aufeinanderfolgen, und macht so den Verlauf sichtbar. Anteile an einem Ganzen zeigt das Kreisdiagramm, Gruppen ohne Zeitbezug vergleichen Säulen oder Balken.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Diagrammart passt?",
      instruction:
        "Du bekommst sechs Aufgaben für Schaubilder. Ordne jeder Aufgabe die Diagrammart zu, die zur Aussage am besten passt.",
      categories: ["Säulen- oder Balkendiagramm", "Kreisdiagramm", "Liniendiagramm"],
      entries: [
        {
          text: "Du vergleichst die monatlichen Taschengeldbeträge von sechs Jugendlichen miteinander.",
          target: 0,
          feedback: "Einzelne Personen werden miteinander verglichen; das gelingt mit Säulen oder Balken am besten.",
        },
        {
          text: "Du zeigst, welchen Anteil Rad, Bus, Fuß und Auto am Schulweg einer Klasse haben, zusammen 100 %.",
          target: 1,
          feedback: "Die Teile ergeben ein Ganzes (100 %); dafür ist das Kreisdiagramm gemacht.",
        },
        {
          text: "Du zeigst, wie sich die Temperatur an einem Sommertag von 6 bis 18 Uhr Stunde für Stunde verändert (13 Messwerte).",
          target: 2,
          feedback: "Viele Zeitpunkte nacheinander ergeben einen Verlauf, den eine Linie am deutlichsten zeigt.",
        },
        {
          text: "Du vergleichst, wie viele Bücher die vier neunten Klassen im letzten Schuljahr ausgeliehen haben.",
          target: 0,
          feedback: "Vier Klassen werden miteinander verglichen, ohne dass es um einen Anteil am Ganzen geht.",
        },
        {
          text: "Du zeigst, welchen Teil des Ganzen jedes Lieblingsfach einer Klasse ausmacht: 40 % Sport, 35 % Kunst, 25 % Musik.",
          target: 1,
          feedback: "Die drei Anteile ergeben zusammen 100 % und bilden ein Ganzes.",
        },
        {
          text: "Du zeigst, wie sich die Zahl der Besucher einer Eisdiele Tag für Tag im Lauf des Sommers entwickelt (90 Messwerte).",
          target: 2,
          feedback: "Sehr viele Zeitpunkte nacheinander ergeben einen Verlauf, den eine Linie gut zeigt.",
        },
      ],
      conclusion:
        "Gruppen vergleichst du mit Säulen oder Balken, Anteile an einem Ganzen zeigst du im Kreis, und eine Entwicklung über die Zeit zeigst du als Linie.",
    },
    casework: {
      title: "Ein Schaubild verbessern",
      story:
        "Merve zeigt in ihrem Referat ein Schaubild: **Ein Kreisdiagramm mit dem Titel „Umfrage“ zeigt, wie viel Taschengeld sechs Freunde im Monat bekommen (angenommen: 10, 15, 20, 25, 30 und 40). Jedes Stück hat eine andere Farbe und einen 3D-Rand. Eine Einheit und eine Quelle fehlen.** Ihre Lehrerin bittet sie, das Schaubild zu verbessern.",
      steps: [
        {
          question: "Merves Kernaussage lautet: Die Beträge der sechs Freunde unterscheiden sich stark. Welche Diagrammart passt besser?",
          options: [
            "Ein Säulen- oder Balkendiagramm, weil Personen miteinander verglichen werden",
            "Ein Liniendiagramm, weil die Freunde nacheinander genannt werden",
            "Keine andere, denn das Kreisdiagramm zeigt jeden Betrag am deutlichsten",
          ],
          answer: 0,
          explanation:
            "Die Beträge bilden kein sinnvolles Ganzes, sondern sollen verglichen werden. Dafür taugen Säulen oder Balken. Eine Linie setzt eine zeitliche Reihenfolge voraus.",
        },
        {
          question: "Was leistet ein guter Titel?",
          options: [
            "Er sagt, was gezeigt wird, zum Beispiel „Monatliches Taschengeld von sechs Freunden“.",
            "Er ist so kurz wie möglich, ein Wort wie „Umfrage“ genügt.",
            "Er bleibt leer, weil die Zahlen für sich sprechen.",
          ],
          answer: 0,
          explanation:
            "Der Titel macht das Schaubild ohne zusätzliche Erklärung verständlich: Er nennt Thema, Gruppe und, wenn nötig, Ort und Zeit.",
        },
        {
          question: "Was muss außerdem an oder unter das Schaubild?",
          options: [
            "Die Einheit (Euro pro Monat) an der Achse und die Quelle mit dem Hinweis „angenommene Werte“",
            "Nur eine Legende, denn Einheit und Quelle sind selbstverständlich",
            "Nur die Quelle, denn die Einheit ergibt sich aus den Zahlen von selbst",
          ],
          answer: 0,
          explanation:
            "Zahlen ohne Einheit sind nicht eindeutig: Es könnten auch Euro pro Woche sein. Die Quelle zeigt, woher die Werte stammen, und der Hinweis macht klar, dass sie erfunden sind.",
        },
        {
          question: "Was lässt Merve am besten weg?",
          options: [
            "Den 3D-Rand und Farben, die nichts bedeuten",
            "Die Zahlenangaben, weil sie Platz brauchen",
            "Den Titel, weil das Bild für sich spricht",
          ],
          answer: 0,
          explanation:
            "Dreidimensionale Effekte und bedeutungslose Farben lenken von der Aussage ab. Titel und Zahlen helfen dagegen beim Lesen.",
        },
      ],
      verdict:
        "Aus Merves Schaubild wird ein Säulen- oder Balkendiagramm mit aussagekräftigem Titel, der Einheit „Euro pro Monat“, einer Quelle samt Hinweis auf die angenommenen Werte und ohne überflüssige Effekte.",
    },
    tasks: {
      1: {
        prompt:
          "Plane in Worten ein Schaubild. Angenommene Werte: In der Klasse 9c bringen 11 Schülerinnen und Schüler ein Pausenbrot mit, 8 kaufen in der Kantine, 5 beim Bäcker und 3 essen nichts. Schreibe die Kernaussage, die Diagrammart mit Begründung, den Titel, die Beschriftung beider Achsen mit Einheit und die Quelle.",
        hints: [
          "Frage dich, ob du Gruppen vergleichst, Anteile zeigst oder eine Entwicklung. Die Kernaussage soll ein ganzer Satz sein.",
          "Die Quelle nennt, woher die Zahlen kommen. Da die Werte erfunden sind, gehört „angenommene Werte“ dazu.",
        ],
        model:
          "Kernaussage: Am häufigsten bringen die Schülerinnen und Schüler der Klasse 9c ein Pausenbrot von zu Hause mit. Diagrammart: Balkendiagramm, weil ich vier Gruppen miteinander vergleiche. Titel: So holen sich die Schülerinnen und Schüler der Klasse 9c ihr Pausenessen. Waagerechte Achse: Anzahl der Schülerinnen und Schüler, beginnend bei 0. Senkrechte Achse: Art des Pausenessens (Pausenbrot, Kantine, Bäcker, nichts). Quelle: Umfrage in der Klasse 9c (angenommene Werte).",
        criteria: [
          "Nennt eine Kernaussage in einem ganzen Satz.",
          "Wählt eine passende Diagrammart und begründet die Wahl.",
          "Gibt Titel, beide Achsen mit Einheit und die Quelle an.",
        ],
      },
      2: {
        prompt:
          "Für ein Referat über Mediennutzung hast du (angenommen) die durchschnittliche tägliche Handyzeit deiner Klasse: Mai 2,5 Stunden, Juni 2,8, Juli 3,5, August 3,9, September 3,1, Oktober 2,7. Plane das Schaubild und schreibe zwei Sätze, die du dem Publikum dazu sagst: einen zur Kernaussage und einen, der eine Zahl aus dem Schaubild nennt.",
        hints: [
          "Hier ändern sich die Werte über mehrere Monate. Überlege, welche Diagrammart eine Entwicklung am besten zeigt.",
          "Die Sätze für das Publikum beschreiben, was man sieht, und nennen eine genaue Zahl mit Einheit.",
        ],
        model:
          "Kernaussage: Die tägliche Handyzeit der Klasse stieg bis August an und sank danach wieder. Diagrammart: Liniendiagramm, weil es eine Entwicklung über sechs Monate zeigt. Titel: Durchschnittliche tägliche Handyzeit der Klasse 9c von Mai bis Oktober. Waagerechte Achse: Monat. Senkrechte Achse: Stunden pro Tag, von 0 bis 4. Quelle: Befragung der Klasse 9c (angenommene Werte). Für das Publikum: Wie ihr seht, steigt die Handyzeit von Mai bis August. Im August liegt sie mit 3,9 Stunden am Tag am höchsten.",
        criteria: [
          "Die Diagrammart passt zu Zahlen über mehrere Monate und ist begründet.",
          "Das Schaubild hat Titel, beschriftete Achsen mit Einheit und eine Quelle.",
          "Die zwei Sätze für das Publikum nennen die Kernaussage und eine genaue Zahl mit Einheit.",
        ],
      },
    },
  },
  {
    id: "de-portfolio-tagebuch",
    lb: 3,
    unit: "3.1",
    covers: ["3.1.3"],
    title: "Projekttagebuch und Portfolio führen",
    intro:
      "Ein Projekttagebuch hält fest, wie du arbeitest. Ein Portfolio sammelt ausgewählte Ergebnisse und zeigt, was du gelernt hast.",
    paragraphs: [
      "Wer ein Projekt durchführt, vergisst schnell, was wann und warum geschehen ist. Deshalb dokumentierst du Arbeitsprozesse und Ergebnisse. Das **Projekttagebuch** begleitet das Projekt: In kurzen, datierten Einträgen hältst du fest, was du getan hast. Das **Portfolio** entsteht am Ende oder in Etappen: Du sammelst die wichtigsten Ergebnisse, ordnest sie und erklärst, warum du sie ausgewählt hast. Beide Formen folgen meist festen Bausteinen, damit andere sie schnell verstehen. Eine einheitliche Norm gibt es dafür nicht. Macht deine Lehrkraft eigene Vorgaben, zum Beispiel zum Umfang oder zur Reihenfolge, gelten diese zuerst.",
      "Ein Eintrag im Projekttagebuch hat meist dieselben Bausteine. Das **Datum** ordnet ihn zeitlich ein. Das **Ziel** sagt, was du in diesem Arbeitsschritt erreichen wolltest. Unter **Schritte** beschreibst du knapp, was du getan hast, und unter **Ergebnis**, was dabei entstanden ist. Bei **Probleme** nennst du ehrlich, was nicht geklappt hat und woran es lag. Die **Reflexion** zieht eine Folgerung: Was lerne ich daraus, was mache ich nächstes Mal anders? Als **Beleg** fügst du ein Foto, eine Skizze, Messwerte oder einen Link bei. Schreibe konkret („Eine Wand ist 3 mm zu kurz“) statt allgemein („Es lief ganz gut“) und berichte über Erledigtes in der Vergangenheit.",
      "Ein Portfolio ist mehr als ein Ordner mit Blättern. Häufig verwendet wird dieser Aufbau, sofern deine Lehrkraft nichts anderes vorgibt: ein **Deckblatt** mit Titel, Namen, Klasse und Datum, danach das **Inhaltsverzeichnis**, das alle Teile mit Seitenzahlen nennt. Es folgen eine kurze Einleitung (Worum geht es, was war das Ziel?), die ausgewählten Arbeitsergebnisse jeweils mit einer kurzen Begründung der Auswahl und eine abschließende Reflexion: Was habe ich gelernt, was würde ich anders machen? Quellen, Fotos und Rohmaterial kommen in einen Anhang. Die Gliederung muss nachvollziehbar sein, zum Beispiel nach dem Verlauf des Projekts in Planung, Durchführung und Auswertung.",
      "Auch hier hilft dir das Textverarbeitungsprogramm. Formatiere alle Überschriften gleich, nummeriere die Seiten und erstelle das Inhaltsverzeichnis, wenn dein Programm das kann, automatisch aus den Überschriften, damit es immer zum Text passt. Verwende für Aufzählungen einheitliche Zeichen. Gib bei übernommenen Texten, Bildern und Zahlen die Quelle an. Ein Portfolio überzeugt, wenn man darin deinen Weg erkennt: Es zeigt nicht nur das fertige Ergebnis, sondern auch die Entscheidungen, Umwege und Erkenntnisse dahinter.",
    ],
    terms: [
      {
        term: "Projekttagebuch",
        text: "Eine fortlaufende Sammlung kurzer, datierter Einträge, die festhält, wie ein Projekt Schritt für Schritt verläuft.",
      },
      {
        term: "Portfolio",
        text: "Eine geordnete Sammlung ausgewählter Arbeiten mit Begründung der Auswahl und Rückblick auf das eigene Lernen.",
      },
      {
        term: "Reflexion",
        text: "Das Nachdenken über das eigene Vorgehen, das zu einer Folgerung für das nächste Mal führt.",
      },
      {
        term: "Beleg",
        text: "Ein Foto, eine Skizze oder ein anderer Nachweis, der ein Ergebnis überprüfbar macht.",
      },
      {
        term: "Inhaltsverzeichnis",
        text: "Die Übersicht am Anfang, die alle Teile eines Portfolios mit Seitenzahlen nennt.",
      },
    ],
    examples: [
      {
        title: "Ein Eintrag im Projekttagebuch (eigens verfasst)",
        text: "Projekt Vogelhaus, Eintrag 3\nDatum: 18.11.2026\nZiel: Die vier Seitenwände zusägen.\nSchritte: Maße von der Skizze auf die Bretter übertragen, vier Teile gesägt, Kanten geschliffen.\nErgebnis: Drei Wände passen, eine Wand muss neu gesägt werden.\nProbleme: Eine Wand ist 3 mm zu kurz, weil ich beim Sägen von der Linie abgekommen bin.\nReflexion: Nächstes Mal zeichne ich die Linie dicker an, säge langsamer und prüfe nach jedem Schnitt das Maß.\nBeleg: Foto der vier Wände, Skizze mit Maßen",
        analysis:
          "Der Eintrag ist datiert und hat ein **Ziel**, das man am Ende prüfen kann. Die **Schritte** sind knapp, das **Ergebnis** ist ehrlich, und das **Problem** wird mit einer Ursache genannt. Die **Reflexion** zieht eine Folgerung für das nächste Mal, und der **Beleg** macht das Ergebnis nachprüfbar.",
      },
    ],
    takeaway:
      "Ein Projekttagebuch hält in datierten Einträgen Ziel, Schritte, Ergebnis, Probleme, Reflexion und Belege fest. Ein Portfolio hat Deckblatt, Inhaltsverzeichnis, Einleitung, ausgewählte Arbeiten mit Begründung und Reflexion. Beide sind konkret, geordnet und einheitlich gestaltet.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welche Zeile aus einem Projekttagebuch enthält eine echte Reflexion?",
      answer: "Beim nächsten Mal plane ich mehr Zeit zum Kleben ein, weil der Leim diesmal nicht gehalten hat.",
      wrong: [
        "Heute habe ich die vier Bretter verleimt und mit Zwingen fixiert, damit sie trocknen können.",
        "Alles hat gut geklappt, und ich bin mit meiner Arbeit und dem Ergebnis ziemlich zufrieden.",
      ],
      explanation:
        "Eine Reflexion zieht aus dem Geschehenen eine Folgerung für das weitere Vorgehen. Die zweite Zeile nennt nur einen Arbeitsschritt, die dritte bleibt allgemein und sagt nicht, was du künftig anders machst.",
    },
    workshop: {
      kind: "mark",
      title: "Die Bausteine eines Eintrags finden",
      instruction:
        "Wähle oben einen Baustein und klicke im Eintrag die Stelle an, die ihn zeigt. Nicht jeder Satz gehört zu einem dieser vier Bausteine.",
      labels: ["Ziel", "Problem", "Reflexion", "Beleg"],
      text: [
        { t: "Eintrag vom 25.11.2026: " },
        {
          t: "Ich wollte die Interviewfragen für unseren Podcast fertigstellen",
          label: 0,
          feedback:
            "Das Ziel sagt, was du in diesem Arbeitsschritt erreichen wolltest, und lässt sich am Ende überprüfen.",
        },
        { t: ". " },
        { t: "Zuerst habe ich zehn Fragen gesammelt und nach Themen sortiert. " },
        { t: "Am Ende standen sieben Fragen auf der Liste. " },
        { t: "Jonas hat währenddessen das Intro geschrieben. " },
        {
          t: "Leider war das Mikrofon defekt, sodass ich die Probeaufnahme abbrechen musste",
          label: 1,
          feedback:
            "Ein Problem beschreibt ehrlich, was nicht geklappt hat, und nennt den Grund dafür.",
        },
        { t: ". " },
        {
          t: "Nächstes Mal prüfe ich die Technik schon am Vortag, damit ich nicht wieder Zeit verliere",
          label: 2,
          feedback:
            "Die Reflexion zieht eine Folgerung: Sie sagt, was du beim nächsten Mal anders machst.",
        },
        { t: ". " },
        {
          t: "Ein Foto der Fragenliste liegt im Ordner „Belege“",
          label: 3,
          feedback:
            "Ein Beleg macht das Ergebnis nachprüfbar, hier durch ein Foto und seinen Ablageort.",
        },
        { t: "." },
      ],
      conclusion:
        "Ziel, Problem, Reflexion und Beleg geben dem Eintrag Gewicht. Die Schritte und das Ergebnis dazwischen beschreiben, was passiert ist, und bleiben ohne eigenen Baustein.",
    },
    casework: {
      title: "Aus einer Sammlung wird ein Portfolio",
      story:
        "Leon hat im Fach Biologie ein Projekt zum Schulgarten durchgeführt und gibt diese Sammlung ab: **Seite 1: Fotos der Beete. Seite 2: Wetterdaten. Seite 3: Bericht über das Pflanzen. Seite 4: Pflanzenliste.** Es gibt kein Deckblatt, kein Inhaltsverzeichnis und keine Begründung, warum er gerade diese Seiten ausgewählt hat. Seine Lehrerin bittet ihn, das Portfolio zu überarbeiten.",
      steps: [
        {
          question: "Welcher Baustein steht in einem Portfolio meist ganz vorn?",
          options: [
            "Ein Deckblatt mit Titel, Namen, Klasse und Datum",
            "Die Pflanzenliste, weil sie das Wichtigste ist",
            "Eine Reflexion über das nächste Projekt",
          ],
          answer: 0,
          explanation:
            "Das Deckblatt zeigt auf einen Blick, was das Portfolio ist und von wem es stammt. Danach folgt das Inhaltsverzeichnis.",
        },
        {
          question: "Wozu dient das Inhaltsverzeichnis?",
          options: [
            "Es nennt alle Teile mit Seitenzahlen, damit man schnell findet, was man sucht.",
            "Es fasst das Projekt in drei Sätzen zusammen.",
            "Es ersetzt die Überschriften im Text.",
          ],
          answer: 0,
          explanation:
            "Das Inhaltsverzeichnis ist die Landkarte des Portfolios. Überschriften im Text braucht es trotzdem, damit man sich auf den Seiten zurechtfindet.",
        },
        {
          question: "Was fehlt noch, damit aus der Sammlung ein Portfolio wird?",
          options: [
            "Eine kurze Begründung der Auswahl und eine Reflexion über das eigene Lernen",
            "Mehr Fotos, denn Bilder zählen mehr als Text",
            "Eine Kopie aller Arbeitsblätter des Schuljahres",
          ],
          answer: 0,
          explanation:
            "Ein Portfolio zeigt nicht alles, sondern eine begründete Auswahl, und es blickt auf das eigene Lernen zurück. Das unterscheidet es von einer bloßen Sammlung.",
        },
        {
          question: "Welche Ordnung der Beiträge ist nachvollziehbar?",
          options: [
            "Nach dem Verlauf des Projekts, etwa Planung, Pflanzen, Pflege und Auswertung",
            "In der Reihenfolge, in der die Dateien zufällig im Ordner liegen",
            "Nach der Länge der Beiträge, die kürzesten zuerst",
          ],
          answer: 0,
          explanation:
            "Eine Ordnung nach dem Projektverlauf kannst du erklären, und andere können ihr folgen. Eine zufällige oder rein äußerliche Reihenfolge sagt nichts über das Projekt.",
        },
      ],
      verdict:
        "Leons Sammlung wird zum Portfolio, wenn sie ein Deckblatt und ein Inhaltsverzeichnis bekommt, nach dem Projektverlauf geordnet ist und jede Auswahl begründet und reflektiert wird.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen Eintrag für ein Projekttagebuch zu einer Arbeit aus dieser Woche, zum Beispiel zu einem Referat, einem Rezept oder dem Üben eines Instruments. Nutze alle Bausteine: Datum, Ziel, Schritte, Ergebnis, Probleme, Reflexion und Beleg.",
        hints: [
          "Formuliere das Ziel so, dass man am Ende prüfen kann, ob du es erreicht hast.",
          "Die Reflexion beginnt mit einer Folgerung, zum Beispiel „Nächstes Mal …“, und sagt, was du anders machst.",
        ],
        model:
          "Datum: 12.11.2026. Ziel: Ich wollte die Gliederung für mein Referat über Plastikmüll fertigstellen. Schritte: Ich habe meine Notizen gelesen, vier Punkte ausgewählt und sie in eine Reihenfolge gebracht. Ergebnis: Die Gliederung besteht aus Einleitung, drei Hauptpunkten und Schluss. Probleme: Ich war unsicher, ob der vierte Punkt noch zum Thema gehört, und habe ihn am Ende gestrichen. Reflexion: Beim nächsten Mal frage ich früher nach, bevor ich Zeit in einen Punkt stecke. Beleg: Foto meiner Gliederung auf Karteikarten.",
        criteria: [
          "Der Eintrag enthält Datum, Ziel, Schritte und Ergebnis.",
          "Er nennt ein konkretes Problem mit einer Ursache.",
          "Die Reflexion zieht eine Folgerung für das nächste Mal, und ein Beleg ist genannt.",
        ],
      },
      2: {
        prompt:
          "Du erstellst das Portfolio zu einem Projekt deiner Wahl, zum Beispiel einem Stand beim Schulfest. Schreibe das Inhaltsverzeichnis mit mindestens sechs Teilen und Seitenzahlen und darunter einen Satz, mit dem du die Auswahl eines Beitrags begründest.",
        hints: [
          "Denke an Deckblatt, Inhaltsverzeichnis, Einleitung, die Arbeitsergebnisse, die Reflexion und den Anhang.",
          "Die Begründung nennt, warum gerade dieser Beitrag zeigt, was du geleistet oder gelernt hast.",
        ],
        model:
          "Inhaltsverzeichnis: Deckblatt (S. 1), Inhaltsverzeichnis (S. 2), Einleitung: Ziel des Projekts (S. 3), Planung: Aufgabenverteilung (S. 4), Durchführung: Aufbau und Verkauf (S. 6), Probleme und Lösungen (S. 8), Reflexion (S. 9), Anhang: Fotos und Einkaufsliste (S. 10). Begründung: Ich habe den Einkaufsplan ausgewählt, weil er zeigt, wie ich mit dem Budget gerechnet habe, und weil er mir half, später Fehler zu finden.",
        criteria: [
          "Das Inhaltsverzeichnis hat mindestens sechs Teile mit Seitenzahlen und beginnt mit Deckblatt und Inhaltsverzeichnis.",
          "Die Teile folgen einer nachvollziehbaren Ordnung und enthalten eine Reflexion.",
          "Die Begründung nennt, warum der gewählte Beitrag zeigt, was du geleistet oder gelernt hast.",
        ],
      },
    },
  },
  {
    id: "de-zitieren",
    lb: 3,
    unit: "3.1",
    covers: ["3.1.4"],
    title: "Zitieren und Quellen angeben",
    intro:
      "Ein Zitat belegt deine Aussage. Du setzt es genau, baust es in deinen Satz ein und gibst immer die Quelle an.",
    paragraphs: [
      "Wenn du etwas behauptest, brauchst du einen Beleg. Bei Texten ist das ein **Zitat**: eine Stelle aus der Vorlage, die deine Beobachtung oder Schlussfolgerung stützt. Lies den Text deshalb zuerst gründlich und markiere Stellen, die zu deiner Aussage passen. Wähle die kürzeste Stelle, die den Gedanken trägt, denn ein langes Zitat versteckt deine eigene Aussage. In Klasse 8 hast du gelernt, Aussagen mit indirekter Rede und Paraphrase wiederzugeben und Zitate einzufügen. Jetzt baust du das sicher und mit Quellenangabe in eigene Texte ein.",
      "Ein **wörtliches Zitat** gibst du genau so wieder, wie es in der Vorlage steht, und setzt es in Anführungszeichen: „zu laut“. Direkt dahinter folgt in Klammern die **Quellenangabe**, bei Texten mit Zeilenzählung zum Beispiel (Z. 4) oder (Z. 4–6), bei Büchern und Artikeln Verfasser und Seite, etwa (Hartmann, S. 14). Diese Schreibweisen sind Schulkonvention und keine Regel der Rechtschreibung; frag im Zweifel nach, welche Form deine Lehrkraft verlangt. Lässt du etwas weg, ersetzt du die Stelle durch drei Punkte in eckigen Klammern: […]. Fügst du ein Wort hinzu, damit der Satz passt, setzt du es ebenfalls in eckige Klammern. Kommt im Zitat selbst schon ein Zitat vor, steht es in der Regel in halben Anführungszeichen: ‚…‘. Wie Anführungszeichen, Auslassungen und Zitate im Zitat gesetzt werden, regelt das Amtliche Regelwerk.",
      "Ein **sinngemäßes Zitat** gibt die Aussage mit eigenen Worten wieder, also ohne Anführungszeichen, meist in indirekter Rede mit Konjunktiv I: Die Autorin meint, die Stadt sei zu laut (vgl. Z. 4). „vgl.“ heißt „vergleiche“ und zeigt, dass du die Stelle nicht wörtlich übernimmst; auch das ist eine übliche Schulkonvention. Ein wörtliches Zitat baust du so in deinen Satz ein, dass der Satz grammatisch stimmt: Die Autorin findet die Stadt „zu laut“ (Z. 4). Die Quellenangabe in Klammern gehört zum Satz, deshalb steht der Punkt dahinter. Folgt ein Begleitsatz nach dem Zitat, steht nach dem schließenden Anführungszeichen ein Komma, und der Punkt im Zitat entfällt: „Die Stadt ist zu laut“, schreibt die Autorin (Z. 4).",
      "Ein Zitat ersetzt nie deine eigenen Gedanken. Baue einen Absatz in drei Schritten auf: Zuerst steht deine Behauptung, dann das Zitat mit Quellenangabe als Beleg, danach eine Erklärung in eigenen Worten, was das Zitat zeigt („Das zeigt, dass …“). Fehlt die Quellenangabe, wirkt der fremde Gedanke wie dein eigener; das ist unehrlich und kann als Plagiat gelten. Prüfe am Ende, ob jedes Zitat genau mit der Vorlage übereinstimmt, ob die Anführungszeichen paarweise stehen und ob die Quelle angegeben ist.",
    ],
    terms: [
      {
        term: "Wörtliches Zitat",
        text: "Eine Stelle, die genau so übernommen wird, wie sie in der Vorlage steht, und in Anführungszeichen steht.",
      },
      {
        term: "Sinngemäßes Zitat",
        text: "Die Aussage der Vorlage mit eigenen Worten wiedergegeben, ohne Anführungszeichen und mit Quellenangabe.",
      },
      {
        term: "Quellenangabe",
        text: "Der Hinweis in Klammern hinter dem Zitat, wo die Stelle steht, zum Beispiel (Z. 4) oder (Hartmann, S. 14).",
      },
      {
        term: "Auslassung und Ergänzung",
        text: "Weggelassenes steht als […] in eckigen Klammern, selbst Hinzugefügtes steht ebenfalls in eckigen Klammern.",
      },
      {
        term: "Beleg",
        text: "Eine Textstelle, die eine Behauptung stützt und nachprüfbar macht, woher sie stammt.",
      },
    ],
    examples: [
      {
        title: "Ein Textauszug und drei Zitierweisen (eigens verfasst)",
        text: "Z. 1: Seit dem Sommer gibt es an der Beispiel-Realschule eine Kleiderbörse.\nZ. 2: Jeden Mittwoch tauschen Schülerinnen und Schüler dort Jacken, Hosen und Schuhe.\nZ. 3: Die Börse ist nach Angaben der Schulleiterin schnell zu einem Treffpunkt geworden.",
        analysis:
          "Wörtlich und eingebaut: Die Schülerinnen und Schüler tauschen dort „Jacken, Hosen und Schuhe“ (Z. 2). Wörtlich mit Begleitsatz danach: „Seit dem Sommer gibt es an der Beispiel-Realschule eine Kleiderbörse“, heißt es zu Beginn (Z. 1). Sinngemäß: Nach Angabe der Schulleiterin sei die Börse schnell zum Treffpunkt geworden (vgl. Z. 3). **Anführungszeichen** zeigen die wörtliche Übernahme, die **Quellenangabe** steht vor dem Punkt, und beim sinngemäßen Zitat fehlen die Anführungszeichen.",
      },
    ],
    takeaway:
      "Ein wörtliches Zitat steht in Anführungszeichen und stimmt genau mit dem Original überein; Auslassungen markierst du mit […]. Ein sinngemäßes Zitat gibst du mit eigenen Worten wieder. Immer folgt die Quellenangabe, und das Zitat belegt deine Aussage, statt sie zu ersetzen.",
    sourceIds: ["lp", "regelwerk"],
    quiz: {
      question:
        "In der Vorlage steht in Zeile 4: „Die Stadt ist viel zu laut.“ Welcher Satz baut die Stelle richtig als wörtliches Zitat ein?",
      answer: "Die Autorin findet die Stadt „viel zu laut“ (Z. 4).",
      wrong: [
        "Die Autorin findet die Stadt viel zu laut (Z. 4).",
        "Die Autorin findet die Stadt „viel zu laut“. (Z. 4)",
      ],
      explanation:
        "Ein wörtliches Zitat steht in Anführungszeichen und bekommt eine Quellenangabe; der Satzschlusspunkt folgt nach der Klammer. Im zweiten Satz fehlen die Anführungszeichen, deshalb ist er kein wörtliches Zitat. Im dritten steht der Punkt vor der Quellenangabe.",
    },
    workshop: {
      kind: "mark",
      title: "Zitate und Quellenangaben im Absatz finden",
      instruction:
        "Hier siehst du einen Absatz aus der Erörterung einer Schülerin (eigens verfasst). Wähle oben eine Art und klicke dann die Stelle an. Eigene Gedanken der Schülerin bleiben unmarkiert.",
      labels: ["Wörtliches Zitat", "Sinngemäßes Zitat", "Quellenangabe"],
      text: [
        { t: "Meiner Meinung nach macht die neue Fahrradstraße den Schulweg sicherer. " },
        { t: "Auf der Straße ist es " },
        {
          t: "„deutlich ruhiger als vorher“",
          label: 0,
          feedback:
            "Diese Stelle steht in Anführungszeichen und stimmt mit dem Original überein: ein wörtliches Zitat, das in den eigenen Satz eingebaut ist.",
        },
        {
          t: " (Z. 4)",
          label: 2,
          feedback:
            "Die Klammer mit der Zeilenangabe nennt, wo die Stelle steht. Der Satzschlusspunkt folgt erst danach.",
        },
        { t: ". " },
        {
          t: "Außerdem sei der Autoverkehr im Wohngebiet nach Angabe des Stadtrats zurückgegangen",
          label: 1,
          feedback:
            "Hier steht kein Wortlaut des Originals und es fehlen Anführungszeichen: Die Aussage ist mit eigenen Worten wiedergegeben.",
        },
        {
          t: " (vgl. Z. 7)",
          label: 2,
          feedback:
            "Auch die sinngemäße Wiedergabe braucht eine Quellenangabe; „vgl.“ heißt „vergleiche“.",
        },
        { t: ". " },
        { t: "Das merke ich selbst, denn ich fahre dort jeden Morgen zur Schule. " },
        { t: "Das zeigt, dass sich der Umbau für uns gelohnt hat." },
      ],
      conclusion:
        "Anführungszeichen kennzeichnen das wörtliche Zitat, die sinngemäße Wiedergabe steht ohne sie, und beide brauchen eine Quellenangabe. Die eigenen Gedanken der Schülerin rahmen die Belege ein.",
    },
    casework: {
      title: "Jonas belegt seine Aussage",
      story:
        "Jonas soll in einem Text belegen, dass der Schulgarten der Mensa nützt. In dem Zeitungstext (erfunden) steht in Zeile 5: **„Der Schulgarten liefert im Herbst Kürbisse und Kartoffeln für die Mensa.“** Jonas schreibt in seinen Entwurf: **Der Schulgarten liefert im Herbst Kürbisse und Kartoffeln für die Mensa. Das ist gut.**",
      steps: [
        {
          question: "Was fehlt Jonas’ erstem Satz, damit klar ist, dass er wörtlich aus der Vorlage stammt?",
          options: [
            "Anführungszeichen um die übernommene Stelle und die Quellenangabe (Z. 5)",
            "Nur ein Doppelpunkt vor dem Satz",
            "Ein Ausrufezeichen am Ende, damit der Satz hervorsticht",
          ],
          answer: 0,
          explanation:
            "Ohne Anführungszeichen und Quellenangabe wirkt der Satz wie Jonas’ eigener Gedanke. Erst beides macht ihn als Zitat erkennbar.",
        },
        {
          question: "Jonas will nur „Kürbisse und Kartoffeln für die Mensa“ zitieren. Wie baut er das Teilzitat richtig in einen eigenen Satz ein?",
          options: [
            "Der Schulgarten bringt im Herbst „Kürbisse und Kartoffeln für die Mensa“ (Z. 5).",
            "Der Schulgarten bringt im Herbst Kürbisse und Kartoffeln für die Mensa (Z. 5).",
            "Der Schulgarten bringt im Herbst „Kürbisse und Kartoffeln für die Mensa.“ (Z. 5)",
          ],
          answer: 0,
          explanation:
            "Das Teilzitat steht in Anführungszeichen, die Quellenangabe folgt direkt, und der Punkt gehört zum eigenen Satz und steht nach der Klammer. Im zweiten Satz fehlen die Anführungszeichen, im dritten steht der Punkt an der falschen Stelle.",
        },
        {
          question: "Jonas zitiert den ganzen Satz, will aber „im Herbst“ weglassen. Wie zeigt er das?",
          options: [
            "Er setzt […] an die Stelle der Auslassung.",
            "Er lässt die Wörter ohne Kennzeichnung weg, denn das fällt nicht auf.",
            "Er setzt einen Gedankenstrich an die Stelle der Auslassung.",
          ],
          answer: 0,
          explanation:
            "Auslassungen in einem Zitat kennzeichnest du mit drei Punkten in eckigen Klammern. So sieht jeder, dass du gekürzt hast.",
        },
        {
          question: "Was fehlt Jonas’ Absatz noch, damit das Zitat ein Beleg und kein Ersatz für eigene Gedanken ist?",
          options: [
            "Eine eigene Erklärung, was das Zitat zeigt, zum Beispiel „Das zeigt, dass …“",
            "Ein zweites Zitat mit demselben Inhalt",
            "Nichts, denn ein Zitat erklärt sich selbst",
          ],
          answer: 0,
          explanation:
            "Das Zitat belegt, aber es erklärt nicht. Erst deine Erklärung zeigt, was die Stelle für deine Aussage bedeutet.",
        },
      ],
      verdict:
        "Jonas setzt die übernommene Stelle in Anführungszeichen, gibt (Z. 5) an, kennzeichnet Weggelassenes mit […] und erklärt in eigenen Worten, was das Zitat belegt.",
    },
    practice: {
      kind: "choose",
      title: "Zitate richtig zeichensetzen: drei Sätze pro Runde",
      instruction:
        "Wähle in jedem Satz die richtige Zeichensetzung für die Lücke. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "„Der Pausenhof ist zu klein",
            options: ["“,", ".“", "“."],
            answer: 0,
            after: " sagt Lena.",
            feedback:
              "Folgt der Begleitsatz nach dem Zitat, steht nach dem schließenden Anführungszeichen ein Komma, und der Punkt im Zitat entfällt.",
          },
          {
            before: "Lena sagt",
            options: [": „", ", „", "; „"],
            answer: 0,
            after: "Wir brauchen mehr Platz.“",
            feedback:
              "Steht der Begleitsatz vor dem Zitat, folgt ein Doppelpunkt, danach beginnt das Zitat mit dem öffnenden Anführungszeichen.",
          },
          {
            before: "„Kommst du morgen",
            options: ["?“,", "“,", "?“"],
            answer: 0,
            after: " fragt Aylin.",
            feedback:
              "Das Fragezeichen gehört zum Zitat und bleibt stehen. Nach dem schließenden Anführungszeichen folgt trotzdem das Komma vor dem Begleitsatz.",
          },
          {
            before: "Der Bericht nennt den Schulweg „gefährlich",
            options: ["“ (Z. 2).", ".“ (Z. 2)", "“. (Z. 2)"],
            answer: 0,
            after: "",
            feedback:
              "Das Zitat ist in den eigenen Satz eingebaut. Die Quellenangabe steht direkt nach dem Anführungszeichen, der Satzschlusspunkt folgt erst danach.",
          },
          {
            before: "„Ich komme sofort",
            options: ["!“,", "“,", "!“"],
            answer: 0,
            after: " ruft Jonas.",
            feedback:
              "Das Ausrufezeichen gehört zum Zitat und bleibt stehen; danach folgt das Komma vor dem Begleitsatz.",
          },
          {
            before: "Der Trainer fragt",
            options: [": „", ", „", "; „"],
            answer: 0,
            after: "Wer kommt morgen zum Training?“",
            feedback:
              "Steht der Begleitsatz vor dem Zitat, folgt ein Doppelpunkt. Das Fragezeichen bleibt im Zitat, vor dem schließenden Anführungszeichen.",
          },
          {
            before: "Der Autor nennt den Weg zur Schule „viel zu lang",
            options: ["“.", ".“", "“,"],
            answer: 0,
            after: "",
            feedback:
              "Das Zitat ist ein Teil des eigenen Satzes. Der Satzschlusspunkt gehört zum eigenen Satz und steht deshalb nach dem schließenden Anführungszeichen.",
          },
          {
            before: "„Ich werde",
            options: ["“, versichert Lena, „", "“ versichert Lena „", "“, versichert Lena „"],
            answer: 0,
            after: "bald wiederkommen.“",
            feedback:
              "Ein eingeschobener Begleitsatz wird links und rechts durch Kommas abgetrennt, danach geht das Zitat mit einem neuen Anführungszeichen weiter.",
          },
        ],
        2: [
          {
            before: "„Am Abend warten viele Fahrgäste an der Haltestelle vor dem Bahnhof auf den letzten Bus",
            options: ["“,", ".“,", "“"],
            answer: 0,
            after: " schreibt die Autorin über die Lage am Bahnhof (Z. 6).",
            feedback:
              "Folgt ein Begleitsatz, steht nach dem schließenden Anführungszeichen ein Komma, und der Punkt im Zitat entfällt. Die Quellenangabe schließt den ganzen Satz ab.",
          },
          {
            before: "„Wer trägt die Kosten",
            options: ["“, fragt die Autorin, „", "“ fragt die Autorin „", "?“, fragt die Autorin, „"],
            answer: 0,
            after: "für den neuen Radweg im Wohngebiet am Stadtrand?“",
            feedback:
              "Der eingeschobene Begleitsatz steht zwischen zwei Kommas. Das Fragezeichen folgt erst am Ende des Zitats, weil die Frage erst dort endet.",
          },
          {
            before: "„Die Pausenbibliothek ",
            options: ["[…]", "(…)", "…"],
            answer: 0,
            after: " ist in der großen Pause ein beliebter Treffpunkt“, hält der Bericht über die Aktion der Klasse 8b fest (Z. 2).",
            feedback:
              "Wer in einem Zitat Wörter auslässt, setzt an die Stelle drei Punkte in eckigen Klammern. So steht es im Amtlichen Regelwerk.",
          },
          {
            before: "Nach Meinung der Autorin ist der neue Radweg im Wohngebiet für alle Schülerinnen und Schüler „längst überfällig",
            options: ["“ (Z. 5).", ".“ (Z. 5)", "“. (Z. 5)"],
            answer: 0,
            after: "",
            feedback:
              "Das Teilzitat gehört zum eigenen Satz. Die Quellenangabe folgt direkt nach dem Anführungszeichen, und der Punkt des eigenen Satzes steht ganz am Ende.",
          },
          {
            before: "Bei der Eröffnung des neuen Radwegs fragt die Reporterin den anwesenden Stadtrat",
            options: [": „", ", „", "; „"],
            answer: 0,
            after: "Wann wird auch die Hauptstraße vor dem Bahnhof umgebaut?“",
            feedback:
              "Steht der Begleitsatz vor dem Zitat, folgt ein Doppelpunkt. Das Fragezeichen gehört zum Zitat und steht vor dem schließenden Anführungszeichen.",
          },
          {
            before: "Die Lehrerin erklärt: „Im Text steht das Wort ",
            options: ["‚Fahrradstraße‘", "„Fahrradstraße“", "“Fahrradstraße”"],
            answer: 0,
            after: " ohne Erklärung, deshalb solltet ihr es im Wörterbuch nachschlagen.“",
            feedback:
              "Steht innerhalb einer Anführung eine weitere Anführung, steht sie nach dem Amtlichen Regelwerk in der Regel in halben Anführungszeichen.",
          },
          {
            before: "„Räumt bitte sofort euren Müll vom Schulhof weg",
            options: ["!“,", "“,", "!“"],
            answer: 0,
            after: " ruft der Hausmeister den Schülerinnen und Schülern zu.",
            feedback:
              "Das Ausrufezeichen gehört zum Zitat und bleibt stehen; nach dem schließenden Anführungszeichen folgt das Komma vor dem Begleitsatz.",
          },
          {
            before: "Der Autor des Artikels beschreibt die Stimmung in der Schule nach dem Umbau als „sehr gut",
            options: ["“ (Z. 12).", ".“ (Z. 12)", "“. (Z. 12)"],
            answer: 0,
            after: "",
            feedback:
              "Das Zitat ist in den eigenen Satz eingebaut. Die Quellenangabe folgt unmittelbar auf das Anführungszeichen, danach steht der Satzschlusspunkt.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Lies den erfundenen Text. Z. 1: Im Jugendzentrum ist das Tischtennisturnier seit Jahren beliebt. Z. 2: Im letzten Jahr nahmen 48 Jugendliche teil. Z. 3: Die Leiterin hält das Turnier für die beste Gelegenheit, neue Leute kennenzulernen. Schreibe zwei Sätze: Im ersten baust du ein kurzes wörtliches Zitat aus Zeile 2 ein, im zweiten gibst du Zeile 3 sinngemäß wieder. Gib jeweils die Quelle an.",
        hints: [
          "Setze nur den Teil in Anführungszeichen, den du genau übernimmst, und baue ihn so ein, dass dein Satz grammatisch stimmt.",
          "Für das sinngemäße Zitat verwendest du eigene Wörter und keine Anführungszeichen. Die Quellenangabe steht jeweils vor dem Punkt.",
        ],
        model:
          "Das Turnier ist beliebt, denn im letzten Jahr nahmen laut Vorlage „48 Jugendliche“ teil (Z. 2). Die Leiterin meint, man lerne bei dem Turnier am besten neue Leute kennen (vgl. Z. 3). Beide Stellen stützen meine Aussage, dass das Turnier ein wichtiger Treffpunkt ist.",
        criteria: [
          "Das wörtliche Zitat steht in Anführungszeichen und ist genau aus der Vorlage übernommen.",
          "Der zweite Satz gibt Zeile 3 mit eigenen Worten wieder, ohne Anführungszeichen.",
          "Beide Sätze nennen die Quelle mit Zeilenangabe in Klammern, und der Punkt steht danach.",
        ],
      },
      2: {
        prompt:
          "Lies den erfundenen Text. Z. 1: Seit dem Frühjahr gibt es auf dem Schulhof eine Pausenbibliothek. Z. 2: Die Pausenbibliothek, die von der Klasse 8b aufgebaut wurde, ist in der großen Pause ein beliebter Treffpunkt. Z. 3: Besonders gefragt sind Comics und Krimis. Z. 4: Die Bibliothekarin berichtet, dass kaum ein Buch länger als eine Woche im Regal stehe. Schreibe einen Absatz von vier bis fünf Sätzen, der die Behauptung „Die Bibliothek auf dem Schulhof wird gut genutzt“ stützt. Zitiere Zeile 2 wörtlich und lasse den Nebensatz mit […] aus, gib Zeile 4 sinngemäß wieder und erkläre am Ende, was die Belege zeigen.",
        hints: [
          "Beginne mit deiner Behauptung. Bei der Auslassung ersetzt du den ganzen Nebensatz durch […].",
          "Gib für beide Belege die Zeile an. Der letzte Satz erklärt in eigenen Worten, was die Belege für deine Behauptung bedeuten.",
        ],
        model:
          "Die Bibliothek auf dem Schulhof wird gut genutzt. „Die Pausenbibliothek […] ist in der großen Pause ein beliebter Treffpunkt“, heißt es in der Vorlage (Z. 2). Außerdem gibt die Bibliothekarin an, fast jedes Buch bleibe höchstens eine Woche im Regal (vgl. Z. 4). Das zeigt, dass die Schülerinnen und Schüler die Bücher regelmäßig ausleihen und die Pausenbibliothek ein fester Teil des Schulalltags geworden ist.",
        criteria: [
          "Das wörtliche Zitat stimmt mit Zeile 2 überein, steht in Anführungszeichen und kennzeichnet die Auslassung mit […].",
          "Zeile 4 ist mit eigenen Worten wiedergegeben und hat eine Quellenangabe.",
          "Der Absatz beginnt mit einer Behauptung und endet mit einer eigenen Erklärung der Belege.",
        ],
      },
    },
  },
  {
    id: "de-schreibformen",
    lb: 3,
    unit: "3.1",
    covers: ["3.1.5"],
    title: "Schreibformen anwenden und kombinieren",
    intro:
      "Jeder Text hat einen Zweck. Er entscheidet, ob du erzählst, informierst, argumentierst oder mehrere Formen verbindest.",
    paragraphs: [
      "Bevor du schreibst, klärst du zwei Dinge: Was will ich erreichen, und wer liest den Text? Das Ziel ist die **Schreibabsicht**, die Leserschaft der **Adressat**. Aus beidem ergibt sich die Grundform. Wer **erzählt**, will unterhalten und ein Geschehen anschaulich machen. Wer **informiert**, will sachlich Wissen vermitteln. Wer **argumentiert**, will überzeugen, indem eine Behauptung begründet wird. Diese drei Grundformen kennst du aus Klasse 8; in Klasse 9 wählst du sie selbstständig und verbindest sie, wenn ein Text mehr als einen Zweck hat.",
      "Jede Grundform hat typische Merkmale. Beim **Erzählen** schreibst du meist im Präteritum, baust Spannung bis zu einem Höhepunkt auf und machst das Geschehen mit treffenden Verben, wörtlicher Rede und Gefühlen anschaulich. Beim **Informieren** bleibst du sachlich und genau: Du beantwortest die W-Fragen (Wer? Was? Wann? Wo?), ordnest die Angaben übersichtlich, lässt Wertungen weg und schreibst meist über Allgemeines im Präsens und über Vergangenes im Präteritum. Beim **Argumentieren** stellst du eine Behauptung auf, begründest sie, stützt sie mit einem Beispiel und verknüpfst die Gedanken mit Wörtern wie „weil“, „denn“, „deshalb“ oder „zwar … aber“. Am Ende steht ein Fazit oder ein Appell.",
      "Viele Texte verbinden Formen, wobei meist eine die Hauptform ist. Ein **Kommentar** informiert zuerst knapp über den Anlass und argumentiert dann: Er nimmt Stellung und begründet. Eine **Reportage** verbindet sachliche Information mit anschaulicher Schilderung einzelner Szenen. Ein **Bewerbungsschreiben** informiert über dich und argumentiert, warum du passt. Die Nebenformen dienen der Hauptform: Die kurze Information in einem Kommentar liefert nur die Grundlage für die Meinung. Achte beim Verbinden auf die Zeitform: Erzählst du im Präteritum, steht Vorzeitiges im Plusquamperfekt.",
      "Adressat und Format bestimmen Sprache und Aufbau. In der Schülerzeitung schreibst du verständlich und lebendig, in einem Brief an die Schulleitung sachlich und höflich in Standardsprache. Ein Bericht braucht keine Spannung, eine Erzählung keine Quellenangabe. Frage dich vor dem Schreiben: Welche Form passt zu meiner Absicht? Wen spreche ich an, und was erwarten die Leserinnen und Leser? Prüfe nach dem Schreiben: Passt die Zeitform zum Inhalt, und wechselt sie nur mit Grund? Ist der Aufbau erkennbar? Passt die Sprache zum Adressaten?",
    ],
    terms: [
      {
        term: "Schreibabsicht",
        text: "Das, was ein Text bei den Lesenden erreichen soll: unterhalten, informieren oder überzeugen.",
      },
      {
        term: "Adressat",
        text: "Die Person oder Gruppe, für die ein Text geschrieben wird und nach der du Sprache und Aufbau richtest.",
      },
      {
        term: "Erzählen",
        text: "Ein Geschehen anschaulich darstellen, meist im Präteritum und mit Spannung, Gefühlen und wörtlicher Rede.",
      },
      {
        term: "Informieren",
        text: "Sachlich und genau Wissen vermitteln, übersichtlich geordnet und ohne eigene Wertung.",
      },
      {
        term: "Argumentieren",
        text: "Eine Behauptung mit Gründen und Beispielen stützen, um andere zu überzeugen.",
      },
    ],
    examples: [
      {
        title: "Ein Text mit zwei Schreibformen (eigens verfasst)",
        text: "Seit Montag ist die große Pause an der Beispiel-Realschule zehn Minuten länger. Die Schulleitung hat das beschlossen, weil sich viele Schülerinnen und Schüler über zu wenig Zeit zum Essen beklagt haben. Ich halte die Änderung für richtig. Wer in Ruhe isst und sich bewegt, kann sich danach besser konzentrieren. Außerdem bleibt es auf den Gängen ruhiger. Zwar fällt dadurch Unterrichtszeit weg, doch diese zehn Minuten sind gut angelegt.",
        analysis:
          "Die ersten beiden Sätze **informieren**: Sie nennen sachlich, was sich ändert und warum, ohne Wertung. Ab „Ich halte …“ **argumentiert** der Text: Die Behauptung steht zuerst, zwei Gründe folgen, und „Zwar … doch“ greift einen Einwand auf. Die Information ist hier nur die Grundlage für die Meinung.",
      },
    ],
    takeaway:
      "Schreibabsicht und Adressat bestimmen die Form: Erzählen unterhält, Informieren vermittelt sachlich Wissen, Argumentieren überzeugt mit Begründungen. Viele Texte kombinieren Formen, meist mit einer Hauptform, der die anderen dienen.",
    sourceIds: ["lp", "fachjournalist"],
    quiz: {
      question:
        "Ein Kommentar zu einem Schulprojekt beginnt mit zwei Sätzen, die sachlich erklären, worum es geht, und nimmt dann Stellung. Welche Formen verbindet er?",
      answer: "Informieren und Argumentieren: Die Information liefert die Grundlage für die Stellungnahme.",
      wrong: [
        "Erzählen und Informieren: Erst wird ein Geschehen erzählt, dann werden Fakten genannt.",
        "Erzählen und Argumentieren: Erst wird spannend erzählt, danach wird überzeugt.",
      ],
      explanation:
        "Die ersten Sätze beantworten sachlich, worum es geht: Das ist Informieren. Danach folgt eine begründete Stellungnahme: Das ist Argumentieren. Spannung und Geschehen wie beim Erzählen gibt es hier nicht.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Schreibform steckt im Satz?",
      instruction:
        "Lies jeden Satz und ordne ihn der Schreibform zu, die er zeigt. Achte auf Zeitform, Sprache und Zweck.",
      categories: ["Erzählen", "Informieren", "Argumentieren"],
      entries: [
        {
          text: "Als Mia den Klassenraum betrat, spürte sie sofort, dass etwas nicht stimmte: Alle starrten schweigend auf ihren leeren Platz.",
          target: 0,
          feedback: "Präteritum, Gefühle und ein Moment der Spannung: So wird ein Geschehen erzählt.",
        },
        {
          text: "Das Schulorchester probt jeden Dienstag von 15 bis 16.30 Uhr in der Aula und freut sich über neue Mitspielerinnen und Mitspieler.",
          target: 1,
          feedback: "Der Satz nennt sachlich Wann, Wo und Was im Präsens, ohne Wertung.",
        },
        {
          text: "Eine längere Mittagspause ist sinnvoll, weil man dann in Ruhe essen und sich erholen kann.",
          target: 2,
          feedback: "Eine Behauptung wird mit „weil“ begründet: Das ist Argumentieren.",
        },
        {
          text: "Plötzlich krachte es hinter Jonas, und sein Herz schlug ihm bis zum Hals.",
          target: 0,
          feedback: "Ein plötzliches Ereignis und ein Gefühl im Präteritum erzählen eine Geschichte.",
        },
        {
          text: "Die Pausenbibliothek ist seit dem Frühjahr geöffnet; dort können Bücher bis zu zwei Wochen ausgeliehen werden.",
          target: 1,
          feedback: "Der Satz gibt Fakten wieder und bleibt neutral: Das ist Informieren.",
        },
        {
          text: "Zwar kostet der Ausflug Geld, aber er lohnt sich trotzdem, weil die Klasse dort Neues erlebt und zusammenwächst.",
          target: 2,
          feedback: "Mit „zwar … aber“ und „weil“ wird abgewogen und begründet: Das ist Argumentieren.",
        },
      ],
      conclusion:
        "Erzählen erkennst du an Geschehen, Gefühlen und Spannung, Informieren an sachlichen Fakten ohne Wertung, Argumentieren an Behauptung und Begründung.",
    },
    casework: {
      title: "Ein Bericht mit Meinung",
      story:
        "In der Schülerzeitung steht (erfunden): **Am Samstag fand der Spendenlauf der Beispiel-Realschule statt. 230 Schülerinnen und Schüler liefen zusammen 1150 Kilometer, und die Sponsoren zahlen für jeden Kilometer einen festen Betrag. Der Lauf sollte jedes Jahr stattfinden, denn er bringt Geld für einen guten Zweck und stärkt das Gemeinschaftsgefühl.**",
      steps: [
        {
          question: "Welche Grundform bestimmt die ersten beiden Sätze?",
          options: [
            "Informieren: Sie nennen sachlich Ereignis, Zahlen und Regelung.",
            "Erzählen: Sie schildern spannend ein persönliches Erlebnis.",
            "Argumentieren: Sie begründen eine Forderung.",
          ],
          answer: 0,
          explanation:
            "Die Sätze beantworten Wer, Was und Wann und nennen Zahlen. Es gibt keine Gefühle, keine Spannung und keine Wertung.",
        },
        {
          question: "Woran erkennst du, dass der dritte Satz argumentiert?",
          options: [
            "Er stellt mit „sollte jedes Jahr stattfinden“ eine Forderung auf und begründet sie mit „denn“.",
            "Er enthält viele Zahlen und nennt Ort und Zeit.",
            "Er verwendet wörtliche Rede und beschreibt Gefühle.",
          ],
          answer: 0,
          explanation:
            "Eine Behauptung oder Forderung mit einer Begründung ist das Kennzeichen des Argumentierens. Zahlen, Ort und Zeit gehören zum Informieren.",
        },
        {
          question: "Welche Rolle hat die Information am Anfang für die Stellungnahme?",
          options: [
            "Sie liefert die Grundlage, auf der die Meinung aufbaut.",
            "Sie soll die Leserschaft vor allem unterhalten.",
            "Sie ersetzt die Begründung der Meinung.",
          ],
          answer: 0,
          explanation:
            "Wer Stellung nimmt, muss zuerst klären, worum es geht. Die Begründung folgt trotzdem eigens im dritten Satz.",
        },
        {
          question: "Der Text steht in der Schülerzeitung. Welche Sprache passt zu den Lesenden?",
          options: [
            "Verständliche Standardsprache, sachlich und lebendig",
            "Fachsprache mit vielen Fremdwörtern, damit der Text gelehrt wirkt",
            "Umgangssprache mit Jugendslang und Abkürzungen",
          ],
          answer: 0,
          explanation:
            "Eine Schülerzeitung soll alle Leserinnen und Leser erreichen. Standardsprache ist verständlich und angemessen; zu viel Fachsprache oder Slang schließt Leute aus.",
        },
      ],
      verdict:
        "Der Text verbindet Informieren und Argumentieren: Erst wird der Spendenlauf sachlich dargestellt, dann folgt eine begründete Forderung. Die Sprache passt zur Schülerzeitung.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe zum selben Anlass, dem ersten Schulhofkonzert in der großen Pause (erfunden), drei kurze Texte von je zwei bis drei Sätzen: einen erzählenden Ausschnitt, eine sachliche Information für die Schülerzeitung und eine argumentierende Aussage, ob es das Konzert öfter geben soll.",
        hints: [
          "Beim Erzählen helfen Präteritum, Gefühle und ein Moment der Spannung; beim Informieren nennst du Wann, Wo und Was ohne Wertung.",
          "Beim Argumentieren beginnst du mit einer Behauptung und begründest sie mit „weil“ oder „denn“.",
        ],
        model:
          "Erzählen: Als die ersten Töne über den Schulhof schwebten, blieb Mia stehen. Ihr Herz klopfte, denn ihre Freundin stand zum ersten Mal vor allen auf der Bühne. Informieren: Am kommenden Mittwoch findet in der großen Pause das erste Schulhofkonzert statt. Es treten drei Bands der Klassen 8 bis 10 auf, der Eintritt ist frei. Argumentieren: Das Konzert sollte es öfter geben, weil es die Schulgemeinschaft stärkt. Außerdem bekommen junge Musikerinnen und Musiker einen Auftritt vor Publikum.",
        criteria: [
          "Der erzählende Text steht im Präteritum und lässt Handlung und Gefühle erkennen.",
          "Der informierende Text bleibt sachlich und nennt Wann, Wo und Was.",
          "Der argumentierende Text enthält eine Behauptung mit Begründung.",
        ],
      },
      2: {
        prompt:
          "Der Schülerrat plant, den Parkplatz hinter der Schule in einen überdachten Fahrradstellplatz umzubauen (erfunden). Schreibe für die Schülerzeitung einen Text von sechs bis acht Sätzen, der zuerst über den Plan informiert und dann begründet Stellung nimmt. Erkläre danach in zwei Sätzen, welche Teile welche Schreibform zeigen und wie du die Leserschaft berücksichtigt hast.",
        hints: [
          "Der Informationsteil beantwortet die W-Fragen und bleibt ohne Wertung. Ab der Stellungnahme brauchst du Behauptung, Begründung und Beispiel.",
          "Denke an die Leserschaft: Schülerinnen und Schüler, die den Plan nicht kennen und in verständlicher Standardsprache angesprochen werden.",
        ],
        model:
          "Der Schülerrat möchte den Parkplatz hinter der Schule in einen überdachten Fahrradstellplatz umbauen. Dort sollen im nächsten Schuljahr Plätze für 80 Fahrräder entstehen, und der Umbau soll in den Sommerferien stattfinden. Ich finde den Plan gut. Wer sein Rad trocken und sicher abstellen kann, fährt eher mit dem Rad zur Schule, und das entlastet die Straße vor dem Eingang. Zwar fallen einige Parkplätze für Lehrkräfte weg, doch der Weg zur Schule wird für viele Schülerinnen und Schüler sicherer. Deshalb sollte die Schule den Plan unterstützen. Die ersten zwei Sätze informieren sachlich über den Plan, danach argumentiere ich mit Behauptung, Begründung und Einwand. Die Sprache bleibt verständlich und sachlich, damit alle Leserinnen und Leser der Schülerzeitung folgen können.",
        criteria: [
          "Der Text informiert zuerst sachlich und beantwortet die W-Fragen zum Plan.",
          "Er nimmt danach mit Behauptung und Begründung Stellung.",
          "Die Erklärung nennt, welche Teile welche Schreibform zeigen, und geht auf die Leserschaft ein.",
        ],
      },
    },
  },
];
