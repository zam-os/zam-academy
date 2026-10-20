import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const dictatorship: Lesson[] = [
  {
    id: "g-30-januar",
    lb: 4,
    title: "30. Januar 1933: Ernennung und Folgen",
    period: "1933",
    intro:
      "Ein Regierungsamt wurde zum Ausgangspunkt für die Zerstörung der demokratischen Ordnung.",
    paragraphs: [
      "Reichspräsident Paul von Hindenburg ernannte Adolf Hitler am 30. Januar 1933 zum Reichskanzler. Konservative Politiker unterstützten diese Lösung und unterschätzten die Nationalsozialisten. Die Ernennung war keine direkte Wahl Hitlers durch die Bevölkerung.",
      "Die NS-Führung verband staatliche Macht mit Einschüchterung und Gewalt gegen Gegner. Der häufig verwendete Ausdruck Machtergreifung kann eine alleinige Aktion der NSDAP suggerieren. Untersuche deshalb sowohl Machtübertragung durch Eliten als auch den anschließenden gewaltsamen Machtausbau.",
    ],
    takeaway:
      "Hitler wurde am 30. Januar 1933 von Hindenburg ernannt; die Diktatur wurde danach in mehreren Schritten ausgebaut.",
    sourceIds: ["ns", "gesetz"],
    quiz: check(
      "An welchem Datum ernannte Hindenburg Hitler zum Reichskanzler?",
      "30. Januar 1933",
      ["9. November 1938", "20. Juli 1944"],
      "Der 30. Januar ist das Datum der Ernennung, nicht der Abschluss aller Schritte zur Diktatur.",
    ),
    workshop: classify(
      "Was erklärt die Ernennung?",
      ["Belegtes Geschehen", "Unzutreffende Verkürzung"],
      [
        [
          "Hindenburg ernannte Hitler zum Reichskanzler.",
          0,
          "Der Reichspräsident traf die Entscheidung.",
        ],
        [
          "Die Bevölkerung wählte Hitler unmittelbar zum Reichskanzler.",
          1,
          "Der Kanzler wurde nicht direkt gewählt.",
        ],
        [
          "Konservative Unterstützer eröffneten der NSDAP den Zugang zur Regierungsmacht.",
          0,
          "Ihre Rolle gehört zur Erklärung des Machtantritts.",
        ],
      ],
      "Begriffe beeinflussen, welche Akteure und Verantwortlichkeiten sichtbar werden.",
    ),
    tasks: {
      1: writing(
        "Unterscheide Hitlers Ernennung von einer direkten Wahl und vom weiteren Aufbau der Diktatur.",
        ["Wer ernannte ihn?", "Was geschah erst anschließend?"],
        "Hindenburg ernannte Hitler am 30. Januar 1933 zum Kanzler. Das war keine direkte Wahl zum Regierungschef. Danach zerstörten die Nationalsozialisten durch Terror, Grundrechtseinschränkungen und Entmachtung von Institutionen die demokratische Ordnung.",
        ["Datum und Akteur", "Keine direkte Wahl", "Weiterer Machtausbau"],
      ),
      2: writing(
        "Welche Grenze hat der Begriff Machtergreifung für eine Erklärung des 30. Januar 1933?",
        ["Weitere Akteure sichtbar machen.", "Ernennung und gewaltsamen Ausbau unterscheiden."],
        "Er kann den Eindruck erwecken, die NSDAP habe allein und auf einmal die gesamte Macht übernommen. Tatsächlich eröffneten Hindenburg und konservative Unterstützer den Zugang zur Regierung. Die anschließende Diktatur entstand durch weitere Entscheidungen und Gewalt. Eine genaue Darstellung benennt beides.",
        ["Begriff geprüft", "Weitere Akteure", "Stufen unterschieden"],
      ),
    },
  },
  {
    id: "g-demokratie-zerstoerung",
    lb: 4,
    title: "Grundrechte, Parlament und Verbände ausschalten",
    period: "Februar–Juli 1933",
    intro: "Diktatur entstand durch das Zusammenwirken von Verordnungen, Gesetzen und Terror.",
    paragraphs: [
      "Die Reichstagsbrandverordnung vom 28. Februar 1933 setzte zentrale Grundrechte außer Kraft und erleichterte die Verfolgung politischer Gegner. Das am 23. März beschlossene und am 24. März veröffentlichte Ermächtigungsgesetz erlaubte der Regierung, auch verfassungsabweichende Gesetze ohne die bisherige parlamentarische Kontrolle zu erlassen. Die Abstimmung fand unter Verfolgung und massiver Einschüchterung statt.",
      "Im Zuge der Gleichschaltung verloren Länder und gesellschaftliche Organisationen ihre Selbständigkeit. Gewerkschaften wurden zerschlagen, andere Parteien verboten oder zur Auflösung gedrängt. Gesetzesformen machten die Ausschaltung demokratischer Kontrolle nicht demokratisch legitim. Terror und scheinbare Normalität gehörten zusammen.",
    ],
    takeaway:
      "Reichstagsbrandverordnung, Ermächtigungsgesetz, Gleichschaltung und Terror zerstörten gemeinsam die Demokratie.",
    sourceIds: ["gesetz", "ns", "dachau"],
    quiz: check(
      "Welche Wirkung hatte das Ermächtigungsgesetz 1933?",
      "Die Regierung konnte ohne parlamentarische Zustimmung Gesetze erlassen.",
      [
        "Der Reichstag konnte die Regierung nur noch einstimmig kontrollieren.",
        "Die Länder erhielten ein Vetorecht gegen jedes Gesetz der Regierung.",
      ],
      "Auch verfassungsabweichende Gesetze wurden möglich; demokratische Kontrolle wurde ausgeschaltet.",
    ),
    workshop: timeline(
      [
        ["Hitler wird Reichskanzler", "30. Januar 1933: Zugang zur staatlichen Regierungsmacht."],
        [
          "Reichstagsbrandverordnung",
          "28. Februar 1933: Wesentliche Grundrechte werden außer Kraft gesetzt.",
        ],
        [
          "Beschluss des Ermächtigungsgesetzes",
          "23. März 1933: Abstimmung unter Terror; Veröffentlichung am 24. März.",
        ],
        [
          "Zerschlagung freier Gewerkschaften",
          "2. Mai 1933: Organisierte Gegenmacht wird beseitigt.",
        ],
      ],
      "Die einzelnen Schritte ergänzten sich: Rechte, Kontrolle und unabhängige Organisationen wurden angegriffen.",
    ),
    tasks: {
      1: writing(
        "Erkläre drei Schritte der Zerstörung der Demokratie und ihre unterschiedlichen Wirkungen.",
        ["Grundrechte, Gesetzgebung und Organisationen.", "Terror als Rahmen beachten."],
        "Die Reichstagsbrandverordnung hob zentrale Grundrechte auf. Das Ermächtigungsgesetz ermöglichte Regierungsgesetze ohne die bisherige parlamentarische Kontrolle. Die Gleichschaltung beseitigte selbständige Institutionen und Verbände. Verfolgung und Terror erzwangen oder erleichterten diese Schritte.",
        ["Drei Schritte", "Wirkungen unterschieden", "Terror berücksichtigt"],
      ),
      2: writing(
        "Beurteile: Ein von einem Parlament beschlossenes Gesetz ist immer demokratisch legitim.",
        ["Freiheit der Abstimmung und Inhalt prüfen.", "Das Beispiel März 1933 nutzen."],
        "Eine Abstimmung allein genügt nicht. 1933 waren Abgeordnete verfolgt, ausgeschlossen oder eingeschüchtert; das Gesetz entmachtete zudem demokratische Kontrolle. Für demokratische Legitimität sind freie Verfahren, Grundrechte und wirksame Machtbegrenzung entscheidend.",
        ["Verfahren geprüft", "Historischer Beleg", "Kriterien benannt"],
      ),
    },
  },
  {
    id: "g-ns-ideologie",
    lb: 4,
    title: "Eine menschenverachtende Ideologie",
    period: "NS-Weltanschauung",
    intro:
      "Die nationalsozialistische Weltanschauung erklärte Ungleichheit und Gewalt zum Programm.",
    paragraphs: [
      "Die Nationalsozialisten vertraten rassistische Vorstellungen und radikalen Antisemitismus. Sie erfanden eine angeblich natürliche Rangordnung von Menschen. Diese pseudowissenschaftlichen Behauptungen waren falsch und dienten der Ausgrenzung, Entrechtung und späteren Ermordung.",
      "Das Führerprinzip verlangte Gehorsam statt demokratischer Mitbestimmung. Die sogenannte Volksgemeinschaft versprach Zugehörigkeit nur für die als zugehörig Definierten und schloss andere aus. Die Lebensraumideologie zielte auf Eroberung, Vertreibung und Vernichtung vor allem im östlichen Europa. Ideologie und konkrete Politik müssen zusammen untersucht werden.",
    ],
    takeaway:
      "Rassismus, Antisemitismus, Führerprinzip und Expansionspolitik waren miteinander verbundene Bestandteile der NS-Ideologie.",
    sourceIds: ["ns", "shoah", "wk2"],
    quiz: check(
      "Was verdeckt der NS-Begriff Volksgemeinschaft?",
      "Die systematische Ausgrenzung und Verfolgung angeblich Nichtzugehöriger.",
      [
        "Die gleiche politische Mitbestimmung aller im Staat lebenden Menschen.",
        "Den Schutz unterschiedlicher Parteien durch eine gemeinsame Verfassung.",
      ],
      "Das Zugehörigkeitsversprechen war untrennbar mit rassistischer und politischer Ausgrenzung verbunden.",
    ),
    workshop: classify(
      "Ideologie und politische Wirkung",
      ["Rassistische Ausgrenzung", "Ablehnung demokratischer Kontrolle", "Expansion und Krieg"],
      [
        [
          "Menschen werden nach erfundenen Abstammungskategorien entrechtet.",
          0,
          "Die Kategorien waren rassistische Konstruktionen, keine menschlichen Wertunterschiede.",
        ],
        [
          "Unbedingter Gehorsam gegenüber einem Führer wird verlangt.",
          1,
          "Das widerspricht Mitbestimmung und Machtkontrolle.",
        ],
        [
          "Eroberungen im Osten werden mit angeblichem Raumbedarf begründet.",
          2,
          "Die Ideologie diente der Rechtfertigung von Gewalt und Ausbeutung.",
        ],
      ],
      "NS-Begriffe werden hier kritisch erklärt, nicht als zutreffende Beschreibungen übernommen.",
    ),
    tasks: {
      1: writing(
        "Verbinde zwei Bestandteile der NS-Ideologie mit ihren Folgen für Menschen.",
        ["Ausgrenzung und fehlende Machtkontrolle.", "Täterbehauptungen als solche kennzeichnen."],
        "Rassistischer Antisemitismus erklärte jüdische Menschen zum Feindbild und bereitete Entrechtung und Verfolgung vor. Das Führerprinzip lehnte demokratische Kontrolle ab und verlangte Gehorsam. Beides beruhte auf menschenverachtenden politischen Vorstellungen, nicht auf berechtigten Wertunterschieden.",
        ["Zwei Bestandteile", "Konkrete Folgen", "Kritische Kennzeichnung"],
      ),
      2: writing(
        "Warum darf eine Erklärung der NS-Ideologie das Zugehörigkeitsversprechen nicht von der Ausgrenzung trennen?",
        ["Wer wurde einbezogen, wer ausgeschlossen?", "Reale Folgen beachten."],
        "Das Versprechen einer Volksgemeinschaft definierte Zugehörigkeit gerade durch Ausschluss. Für die Verfolgten bedeutete es Entrechtung und Gewalt, während es Zustimmung anderer mobilisieren konnte. Eine Erklärung, die nur Zusammenhalt beschreibt, übernimmt die Selbstinszenierung der Täter und verschweigt ihre Folgen.",
        ["Zugehörigkeit und Ausschluss", "Betroffenenperspektive", "Selbstinszenierung geprüft"],
      ),
    },
  },
  {
    id: "g-entrechtung",
    lb: 4,
    title: "Von Ausgrenzung zu offener Gewalt",
    period: "1933–1938",
    intro:
      "Gesetze und alltägliches Handeln veränderten die Lebensmöglichkeiten jüdischer Menschen.",
    paragraphs: [
      "Boykotte, Berufsverbote und Verfolgung schränkten jüdisches Leben seit 1933 immer stärker ein. Die Nürnberger Gesetze von 1935 entzogen jüdischen Menschen volle staatsbürgerliche Rechte und verboten unter rassistischen Kriterien bestimmte Ehen und Beziehungen. Der Staat machte Ungleichheit zum Gesetz.",
      "Bei den Novemberpogromen am 9./10. November 1938 wurden Synagogen zerstört, Menschen ermordet, misshandelt und massenhaft in Konzentrationslager verschleppt. Täter, Mitwirkende, Zuschauende und Helfende hatten unterschiedliche Handlungsmöglichkeiten. Jüdische Menschen waren nicht nur Opfer; ihre Biografien umfassen auch Leben, Selbstbehauptung und Versuche, Sicherheit zu finden.",
    ],
    takeaway:
      "Die Nürnberger Gesetze 1935 und Novemberpogrome 1938 markieren Schritte der systematischen Verfolgung.",
    sourceIds: ["shoah", "ns"],
    quiz: check(
      "Welche Gesetze von 1935 entzogen jüdischen Menschen volle staatsbürgerliche Rechte und untersagten bestimmte Eheschließungen?",
      "Die Nürnberger Gesetze von 1935.",
      ["Das Ermächtigungsgesetz von 1933.", "Die Weimarer Verfassung von 1919."],
      "Die Nürnberger Gesetze verankerten rassistische Ausgrenzung im Recht.",
    ),
    workshop: timeline(
      [
        [
          "Beginn staatlicher Boykotte und Berufsverbote",
          "1933: Verfolgung setzt mit der NS-Herrschaft ein.",
        ],
        [
          "Nürnberger Gesetze",
          "1935: Rassistische Entrechtung wird weiter gesetzlich festgeschrieben.",
        ],
        ["Novemberpogrome", "9./10. November 1938: Offene Gewalt und massenhafte Verschleppung."],
      ],
      "Die Eskalation bestand aus konkreten Entscheidungen und Handlungen, nicht aus einem anonymen Automatismus.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Zusammenhang zwischen gesetzlichen Regelungen und alltäglicher Verfolgung.",
        ["Rechte beeinflussen Arbeit und Familie.", "Ein konkretes Datum verwenden."],
        "Die Nürnberger Gesetze von 1935 verankerten ungleiche Rechte nach rassistischen Kriterien. Berufsverbote, Ausschluss und gesellschaftliche Mitwirkung beschränkten den Alltag. Die Novemberpogrome 1938 zeigten die weitere Eskalation offener Gewalt.",
        ["Gesetz und Alltag verbunden", "Datum korrekt", "Eskalation erklärt"],
      ),
      2: writing(
        "Warum ist eine Biografie für das Verständnis der Verfolgung wichtig, und was muss zusätzlich untersucht werden?",
        [
          "Menschen nicht auf ihre Verfolgung reduzieren.",
          "Individuelles Leben und staatliche Strukturen verbinden.",
        ],
        "Eine Biografie macht ein individuelles Leben, Entscheidungen und erlittene Folgen sichtbar. Sie verhindert, Menschen nur als Zahl oder Opfer zu betrachten. Zusätzlich brauche ich Kenntnisse über Gesetze, Täter und gesellschaftliche Strukturen; ein Lebenslauf steht nicht für alle Erfahrungen.",
        ["Eigenständiges Leben gewürdigt", "Strukturen ergänzt", "Reichweite begrenzt"],
      ),
    },
  },
  {
    id: "g-ns-alltag-bayern",
    lb: 4,
    title: "Herrschaft im Alltag und in Bayern",
    period: "1933–1939",
    intro: "Zustimmung, Anpassung, Ausgrenzung und Terror waren Bestandteile derselben Herrschaft.",
    paragraphs: [
      "Propaganda und Organisationen sollten die Bevölkerung binden. Versprechen von Ordnung, außenpolitischen Erfolgen und wirtschaftlicher Besserung konnten Zustimmung fördern. Aufrüstung und staatliche Eingriffe trugen zur Beschäftigung bei; Ausgrenzung, Kriegsvorbereitung und fehlende Rechte gehörten zu dieser Politik.",
      "Bayern war ein wichtiger Raum der NS-Herrschaft: München als Parteizentrum, Nürnberg als Ort der Reichsparteitage und rassistischen Gesetze, Dachau als frühes Konzentrationslager. Am 22. März 1933 kamen erste Häftlinge nach Dachau. Lokale Spuren müssen konkret recherchiert werden; die App ersetzt keinen Gedenkstättenbesuch.",
    ],
    takeaway:
      "Zustimmung und Terror schließen sich als Herrschaftsmittel nicht aus; Bayern zeigt beides an konkreten Orten.",
    sourceIds: ["ns", "dachau", "lehrplan"],
    quiz: check(
      "Welche Aussage ordnet Dachau richtig ein?",
      "Dort entstand 1933 ein frühes Konzentrationslager.",
      [
        "Dort trat 1919 die Weimarer Verfassung in Kraft.",
        "Dort wurde 1942 die Wannsee-Konferenz abgehalten.",
      ],
      "Dachau zeigt, dass Verfolgung und Terror von Beginn der NS-Herrschaft an bestanden.",
    ),
    workshop: classify(
      "Was zeigt welcher Ort?",
      ["München", "Nürnberg", "Dachau"],
      [
        [
          "Ein zentrales Parteizentrum der NSDAP",
          0,
          "München war ein zentraler Ort der Parteigeschichte.",
        ],
        [
          "Reichsparteitage und Namensort der rassistischen Gesetze von 1935",
          1,
          "Hier werden Inszenierung und Entrechtung sichtbar.",
        ],
        [
          "Erste Häftlingstransporte in ein Konzentrationslager am 22. März 1933",
          2,
          "Terror gegen politische Gegner begann früh.",
        ],
      ],
      "Für jeden Ort müssen historische Funktion und heutige Erinnerung auseinandergehalten werden.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei bayerischen Orten unterschiedliche Seiten der NS-Herrschaft.",
        ["Inszenierung und Terror unterscheiden.", "Orte und Funktionen korrekt verbinden."],
        "Nürnberg zeigt mit den Reichsparteitagen die öffentliche Inszenierung und mit den Gesetzen von 1935 die rassistische Entrechtung. Dachau steht als frühes Konzentrationslager für Terror. Beide Seiten waren Teil derselben Herrschaft.",
        ["Zwei Orte", "Funktionen korrekt", "Zusammenhang"],
      ),
      2: writing(
        "Prüfe ein Urteil, das Beschäftigungszuwachs im NS-Staat von Verfolgung und Kriegsvorbereitung getrennt bewertet.",
        ["Politische Zwecke und Kosten prüfen.", "Zustimmung erklärt noch keine Rechtfertigung."],
        "Beschäftigungszuwachs konnte Zustimmung fördern, war aber mit Aufrüstung, staatlicher Lenkung und Ausgrenzung verbunden. Eine Gesamtbewertung muss Rechte, Verfolgung und Kriegsvorbereitung einbeziehen. Erklärungen für Zustimmung rechtfertigen die Herrschaft nicht.",
        ["Zustimmung erklärt", "Zusammenhänge", "Kriterium Menschenrechte"],
      ),
    },
  },
  {
    id: "g-ns-aussenpolitik",
    lb: 4,
    title: "Außenpolitik auf dem Weg zum Krieg",
    period: "1933–1939",
    intro: "Öffentliche Friedensbehauptungen standen neben Aufrüstung und aggressiver Expansion.",
    paragraphs: [
      "Die NS-Regierung wollte die Nachkriegsordnung revidieren und verfolgte darüber hinaus rassistisch begründete Eroberungsziele. Aufrüstung, der Einmarsch ins entmilitarisierte Rheinland und die Annexion Österreichs veränderten die Machtverhältnisse.",
      "Im Münchner Abkommen 1938 stimmten Großbritannien, Frankreich und Italien der Abtretung des Sudetenlands an Deutschland zu, ohne gleichberechtigte Beteiligung der Tschechoslowakei. Appeasement sollte Krieg verhindern. Die Besetzung weiterer tschechischer Gebiete 1939 zeigte, dass Hitlers Ziele über die behauptete Zusammenführung deutschsprachiger Gebiete hinausgingen.",
    ],
    takeaway:
      "Revision, Aufrüstung und rassistische Expansion führten über Zugeständnisse hinaus zur weiteren Aggression.",
    sourceIds: ["ns", "wk2", "lehrplan"],
    quiz: check(
      "Was regelte das Münchner Abkommen 1938?",
      "Die Abtretung des Sudetenlands an Deutschland.",
      [
        "Die Rückgabe aller deutschen Kolonien nach dem Weltkrieg.",
        "Die gemeinsame deutsche und sowjetische Besetzung Polens.",
      ],
      "Die Tschechoslowakei wurde nicht gleichberechtigt an der Entscheidung beteiligt.",
    ),
    workshop: timeline(
      [
        [
          "Einmarsch ins entmilitarisierte Rheinland",
          "1936: Ein weiterer Bruch der Nachkriegsordnung.",
        ],
        ["Annexion Österreichs", "März 1938: Erweiterung des deutschen Herrschaftsgebiets."],
        ["Münchner Abkommen", "September 1938: Abtretung des Sudetenlands."],
        [
          "Besetzung weiterer tschechischer Gebiete",
          "März 1939: Die Expansion geht über die bisherigen Behauptungen hinaus.",
        ],
      ],
      "Beurteile Appeasement aus damaligen Handlungsmöglichkeiten und tatsächlichen Folgen; das spätere Ergebnis allein erklärt die damalige Entscheidung nicht.",
    ),
    tasks: {
      1: writing(
        "Warum ist die Besetzung weiterer tschechischer Gebiete 1939 für die Beurteilung der NS-Außenpolitik wichtig?",
        [
          "Mit der vorherigen Begründung vergleichen.",
          "Expansion als übergeordnetes Ziel erklären.",
        ],
        "Die Besetzung ging über den behaupteten Schutz deutschsprachiger Bevölkerung hinaus. Sie zeigte, dass territoriale Zugeständnisse die Expansionsziele nicht begrenzten. Die Außenpolitik muss daher im Zusammenhang mit Aufrüstung und Eroberungsabsichten gesehen werden.",
        ["Ereignis korrekt", "Widerspruch erklärt", "Expansionsziel"],
      ),
      2: writing(
        "Formuliere ein abgewogenes historisches Urteil über Appeasement 1938.",
        [
          "Absicht, damalige Lage und Folgen trennen.",
          "Die ausgeschlossene tschechoslowakische Perspektive beachten.",
        ],
        "Die britische und französische Politik wollte einen neuen Krieg vermeiden. Die Zugeständnisse erfolgten jedoch auf Kosten der Tschechoslowakei und stoppten die Aggression nicht. Ein Urteil muss Friedensabsicht, damalige Möglichkeiten, ausgeschlossene Perspektiven und die Folgen zusammen betrachten.",
        ["Absicht erklärt", "Betroffene Perspektive", "Folgen und Abwägung"],
      ),
    },
  },
];
