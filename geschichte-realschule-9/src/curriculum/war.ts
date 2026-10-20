import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const war: Lesson[] = [
  {
    id: "g-kriegsbeginn-1939",
    lb: 5,
    title: "1939: Der Krieg beginnt in Europa",
    period: "1. September 1939",
    intro:
      "Der deutsche Überfall auf Polen eröffnete einen Eroberungskrieg und traf die Bevölkerung von Anfang an.",
    paragraphs: [
      "Am 1. September 1939 überfiel Deutschland Polen. Damit begann der Zweite Weltkrieg in Europa. Großbritannien und Frankreich erklärten Deutschland den Krieg. Der deutsch-sowjetische Nichtangriffspakt und sein geheimes Zusatzprotokoll hatten zuvor Interessensphären in Osteuropa abgesteckt; am 17. September marschierte die Sowjetunion von Osten in Polen ein.",
      "Der deutsche Angriff war kein berechtigter Verteidigungskrieg. Besatzung, Entrechtung und Gewalt betrafen die polnische Bevölkerung. Die rassistischen Eroberungsziele der NS-Führung gehören zur Erklärung. Für den Zweiten Weltkrieg weltweit ist zusätzlich der Krieg in Asien zu berücksichtigen, der bereits vorher begonnen hatte.",
    ],
    takeaway:
      "Mit dem deutschen Überfall auf Polen am 1. September 1939 begann der Zweite Weltkrieg in Europa.",
    sourceIds: ["wk2", "lehrplan"],
    quiz: check(
      "Mit welchem Ereignis am 1. September 1939 begann der Zweite Weltkrieg in Europa?",
      "Mit dem deutschen Überfall auf Polen.",
      [
        "Mit dem japanischen Angriff auf Pearl Harbor.",
        "Mit dem deutschen Überfall auf die Sowjetunion.",
      ],
      "Pearl Harbor und der Überfall auf die Sowjetunion gehören zu 1941.",
    ),
    workshop: timeline(
      [
        ["Münchner Abkommen", "September 1938: Zugeständnisse stoppen die Expansion nicht."],
        [
          "Deutsch-sowjetischer Nichtangriffspakt",
          "August 1939: Im geheimen Zusatzprotokoll werden Interessensphären vereinbart.",
        ],
        ["Deutscher Überfall auf Polen", "1. September 1939: Kriegsbeginn in Europa."],
        [
          "Sowjetischer Einmarsch in Ostpolen",
          "17. September 1939: Polen wird auch von Osten angegriffen.",
        ],
      ],
      "Die Abfolge zeigt politische Vorbereitung und Verantwortung, keinen zufälligen Zusammenstoß.",
    ),
    tasks: {
      1: writing(
        "Ordne den 1. September 1939 ein und erkläre, warum die Formulierung Krieg in Europa präzise ist.",
        [
          "Angreifer und angegriffenes Land benennen.",
          "Nicht alle Kriegsschauplätze begannen am selben Tag.",
        ],
        "Deutschland überfiel am 1. September 1939 Polen und begann damit den Zweiten Weltkrieg in Europa. Der Krieg in Asien hatte bereits früher begonnen. Die räumliche Eingrenzung verhindert, europäische Daten ungeprüft für die gesamte Welt zu übernehmen.",
        ["Datum", "Verantwortung", "Räumliche Präzision"],
      ),
      2: writing(
        "Warum ist ein Nichtangriffspakt kein ausreichender Beleg für friedliche Absichten? Nutze das Beispiel 1939.",
        ["Öffentlichen Text und weitere Absprachen trennen.", "Handlungen nach dem Pakt prüfen."],
        "Ein Vertragstitel beweist die Absicht nicht. Im geheimen Zusatzprotokoll wurden Interessensphären vereinbart; kurz darauf griff Deutschland Polen an und die Sowjetunion marschierte in Ostpolen ein. Begründete Urteile berücksichtigen Absprachen, Kontext und Handlungen.",
        ["Titel nicht gleich Absicht", "Belege", "Kontexturteil"],
      ),
    },
  },
  {
    id: "g-vernichtungskrieg",
    lb: 5,
    title: "Eroberung und Vernichtungskrieg",
    period: "1939–1945 · besonders ab 1941",
    intro:
      "Die NS-Kriegführung verband militärische Eroberung mit rassistischer Gewalt und Ausbeutung.",
    paragraphs: [
      "Mit dem Überfall auf die Sowjetunion am 22. Juni 1941 eskalierte der Krieg im Osten zum systematischen Vernichtungskrieg. Rassistische Ziele, Hungerpolitik, Zwangsarbeit und Massenmord richteten sich auch gegen Zivilbevölkerung und Kriegsgefangene. SS und Polizei waren beteiligt, ebenso Teile der Wehrmacht und weiterer Behörden.",
      "Militärische Abläufe allein erklären diesen Krieg nicht. Die NS-Ideologie und konkrete Befehle gehören ebenso dazu wie Verantwortung der Handelnden. Die Ausweitung des Kriegs im Pazifik und der Kriegseintritt der USA 1941 machten seinen globalen Charakter besonders deutlich.",
    ],
    takeaway:
      "Der Vernichtungskrieg zielte über militärische Niederlage hinaus auf rassistische Unterwerfung, Ausbeutung und Ermordung.",
    sourceIds: ["wk2", "shoah"],
    quiz: check(
      "Was unterscheidet einen Vernichtungskrieg von einer rein militärischen Zielbeschreibung?",
      "Gezielte rassistische Gewalt gegen Bevölkerung und Kriegsgefangene.",
      [
        "Der ausschließlich beabsichtigte Rückzug aller kämpfenden Truppen.",
        "Der alleinige Schutz ziviler Versorgung vor militärischer Nutzung.",
      ],
      "Eroberung, rassistische Ideologie und Massenverbrechen waren miteinander verbunden.",
    ),
    workshop: classify(
      "Welche Erklärungsebene?",
      ["Militärischer Vorgang", "Ideologisches Ziel", "Verbrechen an Menschen"],
      [
        [
          "Eine Armee überschreitet die Grenze der Sowjetunion.",
          0,
          "Die Bewegung ist zunächst militärisch zu beschreiben.",
        ],
        [
          "Die NS-Führung plant rassistisch begründete Unterwerfung und Landnahme.",
          1,
          "Das erklärt Ziele über militärische Operationen hinaus.",
        ],
        [
          "Menschen werden ausgehungert, verschleppt und ermordet.",
          2,
          "Verbrechen dürfen nicht hinter neutraler Operationssprache verschwinden.",
        ],
      ],
      "Die Ebenen sind zu verbinden; Befehle entheben Handelnde nicht ihrer Verantwortung.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Zusammenhang von NS-Ideologie und Kriegführung im Osten.",
        [
          "Eroberungsziele und rassistische Vorstellungen verbinden.",
          "Folgen für Menschen benennen.",
        ],
        "Die Lebensraumideologie verband Eroberung mit rassistischer Unterwerfung. Daraus folgten nicht nur Kämpfe, sondern systematische Ausbeutung, Hungerpolitik und Massenmord. Der Begriff Vernichtungskrieg benennt diesen verbrecherischen Charakter.",
        ["Ideologie", "Verbindung", "Konkrete Folgen"],
      ),
      2: writing(
        "Prüfe eine Darstellung, die nur Frontpfeile zeigt und Verbrechen ausschließlich der SS zuschreibt.",
        [
          "Welche weiteren Akteure und Erfahrungen fehlen?",
          "Pauschale Kollektivbehauptungen trotzdem vermeiden.",
        ],
        "Die Darstellung lässt Besatzungserfahrungen und rassistische Kriegsziele aus. Neben SS und Polizei waren auch Teile der Wehrmacht und zivile Stellen an Verbrechen beteiligt. Verantwortung muss konkret belegt werden, statt sie pauschal auszulagern oder jedem Menschen dieselbe Rolle zuzuschreiben.",
        ["Auslassungen", "Mehrere Akteure", "Konkrete Verantwortung"],
      ),
    },
  },
  {
    id: "g-holocaust",
    lb: 5,
    title: "Holocaust, Shoah und weitere NS-Verbrechen",
    period: "1933–1945",
    intro:
      "Begriffe müssen genau sein, damit Opfergruppen und die Verantwortung der Täter sichtbar bleiben.",
    paragraphs: [
      "Holocaust beziehungsweise Shoah bezeichnet hier die systematische Verfolgung und Ermordung der europäischen Jüdinnen und Juden durch das NS-Regime, seine Verbündeten und Helfer. Etwa sechs Millionen jüdische Menschen wurden ermordet. Der Massenmord entwickelte sich aus einer eskalierenden Verfolgung; Massenerschießungen hatten bereits vor 1942 begonnen.",
      "Auf der Wannsee-Konferenz am 20. Januar 1942 koordinierten Vertreter von SS, Partei und Behörden die Beteiligung am bereits begonnenen Völkermord. Dort wurde der Holocaust nicht erstmals beschlossen. Konzentrationslager dienten Haft, Terror und Zwangsarbeit; Vernichtungslager waren auf Massenmord ausgerichtet. Funktionen konnten sich wie in Auschwitz-Birkenau überschneiden.",
      "Das Regime verfolgte und ermordete außerdem unter anderem Sinti und Roma, Menschen mit Behinderungen, politische Gegner und weitere Gruppen. Diese Verbrechen müssen ebenfalls benannt werden. Zahlen und Kategorien ersetzen keine Biografien und individuellen Erfahrungen.",
    ],
    takeaway:
      "Die Wannsee-Konferenz koordinierte 1942 den bereits begonnenen Völkermord; sie war nicht sein Beginn.",
    sourceIds: ["shoah", "wannsee", "dachau"],
    quiz: check(
      "Welche Rolle hatte die Wannsee-Konferenz am 20. Januar 1942?",
      "Sie koordinierte Behörden beim bereits begonnenen Völkermord.",
      [
        "Sie beschloss erstmals den bis dahin noch nicht begonnenen Völkermord.",
        "Sie beendete die bereits begonnenen Deportationen und Massenmorde.",
      ],
      "Vor der Konferenz hatten Täter bereits Hunderttausende jüdische Menschen ermordet.",
    ),
    workshop: classify(
      "Begriffe und Funktionen",
      ["Holocaust / Shoah", "Konzentrationslager", "Vernichtungslager"],
      [
        [
          "Bezeichnung für den Völkermord an den europäischen Jüdinnen und Juden",
          0,
          "Die Begriffswahl macht diesen Völkermord konkret sichtbar.",
        ],
        [
          "Haft, Terror und Zwangsarbeit, etwa im KZ Dachau",
          1,
          "Auch hier starben und wurden sehr viele Menschen ermordet.",
        ],
        [
          "Gezielt für die massenhafte Ermordung eingerichtete Lager",
          2,
          "Einige Lagerkomplexe vereinten mehrere Funktionen.",
        ],
      ],
      "Funktionsunterschiede bedeuten keine Rangordnung des Leidens; alle Opfer verdienen genaue Erinnerung.",
    ),
    tasks: {
      1: writing(
        "Erkläre Rolle und Grenze der Wannsee-Konferenz für das Verständnis des Holocaust.",
        ["Koordination und Beginn auseinanderhalten.", "Bereits laufende Morde berücksichtigen."],
        "Am 20. Januar 1942 koordinierten Behördenvertreter die Beteiligung am Völkermord an den europäischen jüdischen Menschen. Der Massenmord hatte bereits begonnen. Die Konferenz zeigt behördliche Mitwirkung und Verantwortung, war aber weder der erste Beschluss noch der Beginn des Holocaust.",
        ["Datum und Funktion", "Kein Beginn behauptet", "Verantwortung benannt"],
      ),
      2: writing(
        "Warum sind sowohl präzise Begriffe als auch individuelle Biografien für das Lernen über NS-Verbrechen nötig?",
        [
          "Unterschiedliche Verfolgungsziele benennen.",
          "Menschen nicht auf Kategorien reduzieren.",
        ],
        "Begriffe unterscheiden den Holocaust an jüdischen Menschen von weiteren NS-Verbrechen, etwa dem Völkermord an Sinti und Roma. Biografien machen individuelle Leben und Erfahrungen sichtbar. Zusammen verhindern sie sowohl sachliche Vermischung als auch eine Darstellung, die Menschen nur als Zahlen behandelt.",
        ["Begriffspräzision", "Weitere Opfergruppen", "Biografischer Zugang"],
      ),
    },
  },
  {
    id: "g-widerstand",
    lb: 5,
    title: "Widerstand: Möglichkeiten und Grenzen",
    period: "1933–1945",
    intro:
      "Menschen widersetzten sich aus unterschiedlichen Motiven und unter lebensgefährlichen Bedingungen.",
    paragraphs: [
      "Georg Elser versuchte am 8. November 1939 mit einem Attentat in München Hitler zu töten und Krieg zu verhindern. Die Weiße Rose verbreitete 1942/43 Flugblätter; Hans und Sophie Scholl sowie weitere Mitglieder wurden ermordet. Am 20. Juli 1944 scheiterte ein Attentat mit Umsturzversuch aus militärischen und zivilen Widerstandskreisen.",
      "Widerstand umfasste unterschiedliche Ziele, Mittel und politische Vorstellungen. Nicht jede abweichende Haltung war schon ein Umsturzversuch. Terror und Überwachung begrenzten Handlungsmöglichkeiten. Mut lässt sich würdigen, ohne alle Beteiligten zu idealisieren oder den Erfolg zum einzigen Maßstab zu machen.",
    ],
    takeaway:
      "Widerstand hatte verschiedene Formen und Ziele; seine Möglichkeiten waren durch Terror und Überwachung begrenzt.",
    sourceIds: ["lehrplan", "ns", "wk2"],
    quiz: check(
      "Welches Datum steht für den Attentats- und Umsturzversuch aus militärischen und zivilen Widerstandskreisen?",
      "20. Juli 1944",
      ["9. November 1938", "30. Januar 1933"],
      "Der 20. Juli ist von Elsers Attentat 1939 und den Aktionen der Weißen Rose 1942/43 zu unterscheiden.",
    ),
    workshop: classify(
      "Formen des Widerstands",
      ["Georg Elser", "Weiße Rose", "20. Juli 1944"],
      [
        [
          "Ein einzelner Handwerker plant 1939 ein Bombenattentat in München.",
          0,
          "Elser handelte aus eigener Initiative gegen Hitler und den Krieg.",
        ],
        [
          "Eine Gruppe verbreitet 1942/43 Flugblätter gegen die Diktatur.",
          1,
          "Die Weiße Rose versuchte, andere zum Widerstand zu bewegen.",
        ],
        [
          "Ein Attentat soll 1944 mit einem politischen Umsturz verbunden werden.",
          2,
          "Verschiedene militärische und zivile Akteure waren beteiligt.",
        ],
      ],
      "Vergleiche Ziele, Mittel, Risiken und Grenzen; das Scheitern macht Widerstand nicht bedeutungslos.",
    ),
    tasks: {
      1: writing(
        "Vergleiche zwei Widerstandsbeispiele nach Mitteln, Ziel und Risiko.",
        ["Etwa Elser und Weiße Rose.", "Unterschiede und Gemeinsamkeiten erklären."],
        "Elser versuchte Hitler durch ein Attentat zu töten, die Weiße Rose verbreitete Flugblätter gegen die Diktatur. Beide wollten die NS-Herrschaft bekämpfen, nutzten jedoch verschiedene Mittel. Terror und Verfolgung machten ihr Handeln lebensgefährlich.",
        ["Zwei Beispiele", "Mittel und Ziele", "Risiko und Grenze"],
      ),
      2: writing(
        "Beurteile die Aussage: Gescheiterter Widerstand ist historisch bedeutungslos.",
        ["Wirkung ist mehr als sofortiger Erfolg.", "Keine unkritische Heldenbeschreibung."],
        "Widerstand kann Handlungsmöglichkeiten und moralische Entscheidungen unter Terror zeigen, auch wenn er die Herrschaft nicht beendete. Seine Bedeutung lässt sich an Zielen, Risiken und späterer Erinnerung beurteilen. Dabei bleiben unterschiedliche Motive und politische Vorstellungen kritisch zu prüfen.",
        ["Kriterium erweitert", "Historische Bedingungen", "Differenziertes Urteil"],
      ),
    },
  },
  {
    id: "g-kriegsende",
    lb: 5,
    title: "1945: Kriegsende in Europa und Asien",
    period: "Mai–September 1945",
    intro:
      "Das Ende des Krieges bedeutete Befreiung von der NS-Herrschaft und zugleich sehr unterschiedliche Erfahrungen.",
    paragraphs: [
      "Die bedingungslose deutsche Kapitulation trat am 8. Mai 1945 in Kraft; in der sowjetischen Erinnerung wird der 9. Mai begangen. Sie beendete den Krieg in Europa. Für Überlebende der Verfolgung bedeutete das Ende der NS-Herrschaft Befreiung, aber Leid und Verlust waren nicht vorbei.",
      "In Asien ging der Krieg weiter. Die amerikanischen Atombomben auf Hiroshima und Nagasaki und der sowjetische Kriegseintritt gegen Japan gehörten zu seiner Endphase. Japan unterzeichnete am 2. September 1945 die Kapitulation. Flucht, Vertreibung, Zerstörung und die Verantwortung für deutsche Verbrechen gehören zur Nachgeschichte; unterschiedliche Erfahrungen dürfen nicht gegeneinander aufgerechnet werden.",
    ],
    takeaway:
      "Mai 1945 endete der Krieg in Europa; im September 1945 folgte die formelle japanische Kapitulation.",
    sourceIds: ["wk2", "lehrplan"],
    quiz: check(
      "Welche Aussage unterscheidet die Kriegsenden 1945 richtig?",
      "Europa: Mai; formelle japanische Kapitulation: September.",
      [
        "Europa: September; formelle japanische Kapitulation: Mai.",
        "Europa und Asien: beide mit derselben Kapitulation im Januar.",
      ],
      "Der 8./9. Mai bezeichnet das Kriegsende in Europa, nicht das Ende aller Kriegsschauplätze.",
    ),
    workshop: timeline(
      [
        [
          "Deutsche Kapitulation beendet den Krieg in Europa",
          "Mai 1945: Ende der NS-Herrschaft und des europäischen Kriegs.",
        ],
        [
          "Atombomben auf Hiroshima und Nagasaki; sowjetischer Kriegseintritt gegen Japan",
          "August 1945: Mehrere Entwicklungen prägen die Endphase in Asien.",
        ],
        ["Formelle japanische Kapitulation", "2. September 1945: Unterzeichnung der Kapitulation."],
      ],
      "Ein Datum erhält seine Bedeutung erst durch räumliche und menschliche Perspektiven.",
    ),
    tasks: {
      1: writing(
        "Erkläre zwei Gründe, weshalb die Aussage Der ganze Krieg endete am 8. Mai zu ungenau ist.",
        ["Europa und Asien unterscheiden.", "Das Ende der Kämpfe ist nicht das Ende aller Folgen."],
        "Der 8. Mai bezeichnet die deutsche Kapitulation und das Ende des Krieges in Europa. In Asien dauerte der Krieg bis in den Spätsommer. Außerdem endeten Verfolgungsfolgen, Verlust und Zerstörung nicht automatisch mit einer Kapitulation.",
        ["Europa eingegrenzt", "Asien ergänzt", "Nachwirkungen"],
      ),
      2: writing(
        "Wie können unterschiedliche Erinnerungen an 1945 berücksichtigt werden, ohne deutsche Verantwortung zu relativieren?",
        [
          "Befreiung und individuelle Erfahrungen verbinden.",
          "Ursachen und Verantwortungen präzise benennen.",
        ],
        "Das Ende der NS-Herrschaft war Befreiung von einer verbrecherischen Diktatur. Menschen erlebten es zugleich als Überleben, Verlust, Flucht oder Zusammenbruch. Diese Erfahrungen lassen sich darstellen, während die deutsche Verantwortung für Krieg und NS-Verbrechen ausdrücklich benannt bleibt.",
        ["Befreiung eingeordnet", "Erfahrungsvielfalt", "Verantwortung gewahrt"],
      ),
    },
  },
  {
    id: "g-erinnerung",
    lb: 5,
    title: "Erinnern und Verantwortung übernehmen",
    period: "damals und heute",
    intro: "Persönliche Schuld und heutige Verantwortung sind unterschiedliche Fragen.",
    paragraphs: [
      "Schuld an konkreten Taten muss einzelnen Handelnden anhand ihrer Handlungen zugerechnet werden. Später Geborene tragen keine persönliche Schuld für Taten vor ihrer Geburt. Verantwortung umfasst heute, Wissen zu bewahren, Opfer zu würdigen und Antisemitismus, Rassismus und Menschenrechtsverletzungen entgegenzutreten.",
      "Gedenkstätten, Archive, Biografien und öffentliche Debatten gestalten Erinnerung. Ihre Form und Entstehung können selbst historisch untersucht werden. Ein Besuch einer Gedenkstätte braucht Vorbereitung und Nachgespräch; diese digitale Lektion bietet dazu Fragen, ersetzt den außerschulischen Lernort jedoch nicht.",
    ],
    takeaway:
      "Keine vererbte persönliche Schuld; Verantwortung für genaue Erinnerung und den Schutz von Menschenrechten.",
    sourceIds: ["lehrplan", "dachau", "wannsee"],
    quiz: check(
      "Wie unterscheiden sich persönliche Schuld und heutige Verantwortung?",
      "Schuld betrifft eigene Taten; Verantwortung umfasst auch Erinnerung und Handeln heute.",
      [
        "Schuld wird vererbt; heutiges Handeln verändert daran grundsätzlich nichts.",
        "Verantwortung endet mit dem Tod aller Menschen, die die Zeit erlebt haben.",
      ],
      "Historische Genauigkeit und gesellschaftliche Verantwortung bleiben Aufgaben nachfolgender Generationen.",
    ),
    workshop: classify(
      "Befund, Schuld oder Verantwortung?",
      ["Historischer Befund", "Individuell zu prüfende Schuld", "Heutige Verantwortung"],
      [
        [
          "Eine Gedenkstätte wurde erst nach dem Krieg eingerichtet.",
          0,
          "Ihre Entstehungsgeschichte ist untersuchbar.",
        ],
        [
          "Eine Person war an einem konkret belegten Verbrechen beteiligt.",
          1,
          "Handlungen und Verantwortung der Person müssen belegt werden.",
        ],
        [
          "Eine Schulklasse prüft Erinnerungsformen und widerspricht antisemitischen Behauptungen.",
          2,
          "Das betrifft Wissen und Handeln in der Gegenwart.",
        ],
      ],
      "Nimm zum Lernort Fragen zu Biografien, Tätern, Belegen und heutigen Erinnerungsentscheidungen mit.",
    ),
    tasks: {
      1: writing(
        "Bereite zwei Fragen für einen Gedenkstättenbesuch vor und erläutere ihren Nutzen.",
        [
          "Eine Biografie und eine Erinnerungsentscheidung.",
          "Keine bloße Suche nach spektakulären Details.",
        ],
        "Ich frage, welche Biografie ein ausgestelltes Dokument erschließt und welche Grenzen der Überlieferung bestehen. Außerdem frage ich, wann und von wem die Gedenkstätte gestaltet wurde. So verbinde ich individuelles Leben, Quellenprüfung und Geschichte der Erinnerung.",
        ["Zwei konkrete Fragen", "Quellenbezug", "Erinnerungsbezug"],
      ),
      2: writing(
        "Begründe, weshalb Erinnerung weder vererbte Schuld noch eine rein abgeschlossene Vergangenheit meint.",
        ["Eigene Taten und späteres Handeln trennen.", "Einen heutigen Bezug konkret machen."],
        "Persönliche Schuld betrifft eigene Handlungen. Später Geborene sind dafür nicht persönlich schuldig, können aber Verantwortung für genaue Information, Gedenken und Widerspruch gegen Antisemitismus übernehmen. Erinnerung verbindet historische Belege mit Entscheidungen der Gegenwart.",
        ["Schuld unterschieden", "Verantwortung begründet", "Konkretes Handeln"],
      ),
    },
  },
];
