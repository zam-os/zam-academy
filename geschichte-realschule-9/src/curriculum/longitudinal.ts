import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const longitudinal: Lesson[] = [
  {
    id: "g-bildung-laengsschnitt",
    lb: 6,
    title: "Wer durfte lernen – und wozu?",
    period: "Antike · Mittelalter · Kaiserreich",
    intro:
      "Bildungsideale verändern sich. Der Zugang zu Bildung war in vielen Epochen ungleich verteilt.",
    paragraphs: [
      "Im antiken Athen waren politische Bürgerrechte auf einen Teil der Bevölkerung beschränkt; Mädchen, versklavte Menschen und Zugewanderte hatten andere Möglichkeiten als männliche Bürger. Im Mittelalter waren Klöster wichtige Orte schriftlicher Bildung, aber nicht die einzigen; auch städtische und andere Bildungswege entwickelten sich.",
      "Im Deutschen Kaiserreich gab es ein ausgebautes Schulwesen, das zugleich soziale und geschlechtsspezifische Unterschiede sowie obrigkeitsstaatliche Leitbilder widerspiegelte. Ein Längsschnitt vergleicht Zugang, Ziele und Autorität. Er behauptet nicht, jede Schule einer Epoche sei gleich gewesen oder Geschichte sei ein geradliniger Fortschritt.",
    ],
    takeaway:
      "Bildung historisch nach Zugang, Leitbildern und Machtverhältnissen vergleichen, ohne ganze Epochen gleichzusetzen.",
    sourceIds: ["lehrplan", "wandervogel"],
    quiz: check(
      "Welche Kriterien ermöglichen einen historischen Vergleich von Bildung?",
      "Zugang, Erziehungsziele und Formen von Autorität.",
      [
        "Nur die Länge des Schulwegs ohne jeden gesellschaftlichen Zusammenhang.",
        "Nur heutige Noten ohne Prüfung der damaligen Lebensbedingungen.",
      ],
      "Vergleichskriterien machen Unterschiede und Gemeinsamkeiten nachvollziehbar.",
    ),
    workshop: classify(
      "Vergleichskriterien erkennen",
      ["Zugang", "Erziehungsziel", "Autorität"],
      [
        [
          "Wer durfte eine bestimmte Schule besuchen?",
          0,
          "Hier werden Ausschlüsse und Möglichkeiten sichtbar.",
        ],
        [
          "Welche Art von Mensch sollte die Erziehung hervorbringen?",
          1,
          "Das betrifft Leitbilder und gesellschaftliche Erwartungen.",
        ],
        [
          "Wer bestimmte Regeln und konnte ihnen widersprechen?",
          2,
          "Das fragt nach Macht und Handlungsspielraum.",
        ],
      ],
      "Nutze die Kriterien auch für deine heutige Schule; sie liefert nicht automatisch den Maßstab für jede historische Situation.",
    ),
    tasks: {
      1: writing(
        "Vergleiche zwei der behandelten Epochen anhand eines gemeinsamen Kriteriums.",
        ["Etwa Zugang zu Bildung.", "Keine einheitliche Erfahrung aller Menschen behaupten."],
        "Beim Zugang unterscheiden sich die Beispiele: Im antiken Athen begrenzten Status und Geschlecht die Möglichkeiten, während klösterliche Bildung im Mittelalter an bestimmte Institutionen gebunden war. Beide Fälle zeigen ungleichen Zugang, aber verschiedene Strukturen; sie beschreiben nicht alle Bildungswege einer Epoche.",
        ["Gemeinsames Kriterium", "Zwei Beispiele", "Grenze des Vergleichs"],
      ),
      2: writing(
        "Prüfe die Behauptung, Bildungsgeschichte sei eine ununterbrochene Entwicklung von Unfreiheit zu Freiheit.",
        [
          "Fortschritte und Rückschritte bedenken.",
          "Reichweite und unterschiedliche Gruppen beachten.",
        ],
        "Bildungsmöglichkeiten erweiterten sich in manchen Bereichen, konnten aber auch eingeschränkt oder politisch vereinnahmt werden. Verschiedene Gruppen profitierten unterschiedlich. Deshalb untersuche ich konkrete Rechte, Institutionen und Epochen, statt einen geradlinigen Fortschritt vorauszusetzen.",
        ["Keine lineare Erzählung", "Gruppenunterschiede", "Konkrete Prüfung"],
      ),
    },
  },
  {
    id: "g-jugend-im-ns",
    lb: 6,
    title: "Jugend zwischen Vereinnahmung und Eigensinn",
    period: "1933–1945",
    intro:
      "Schule und Jugendorganisationen sollten junge Menschen auf die NS-Herrschaft ausrichten.",
    paragraphs: [
      "Unterricht und Erziehung wurden politisch und rassistisch geprägt. Hitler-Jugend und Bund Deutscher Mädel verbanden Freizeitangebote und Gemeinschaftserlebnisse mit ideologischer Schulung und geschlechtsspezifischen Rollen. Konkurrierende Organisationen wurden ausgeschaltet; Zwang nahm zu.",
      "Erfahrungen waren verschieden: Zustimmung, Anpassung, Ausgrenzung und eigenständiges Verhalten kamen vor. Nicht jede Abweichung war politischer Widerstand. Verfolgte Jugendliche hatten andere Handlungsmöglichkeiten als einbezogene. Für ein Urteil müssen Zugehörigkeitsversprechen, Zwang und die Perspektive der Ausgeschlossenen zusammen betrachtet werden.",
    ],
    takeaway:
      "NS-Jugenderziehung verband Freizeit, Ideologie und zunehmenden Zwang; Erfahrungen waren nicht einheitlich.",
    sourceIds: ["hj", "ns", "lehrplan"],
    quiz: check(
      "Wozu dienten HJ und BDM im NS-Staat?",
      "Zur politischen Vereinnahmung und Erziehung im Sinne der NS-Ideologie.",
      [
        "Zum Schutz frei gewählter Jugendverbände vor staatlichem Einfluss.",
        "Zur Sicherung gleicher Beteiligung aller Jugendlichen unabhängig von Herkunft.",
      ],
      "Freizeitangebote waren mit ideologischer Schulung, Rollenbildern und Ausgrenzung verbunden.",
    ),
    workshop: classify(
      "Erfahrungen unterscheiden",
      ["Anziehung", "Zwang und Kontrolle", "Ausgrenzung"],
      [
        [
          "Gemeinsame Fahrten können Zugehörigkeit vermitteln.",
          0,
          "Attraktive Angebote konnten die Bindung stärken.",
        ],
        ["Unabhängige Organisationen werden verboten.", 1, "Alternative Räume wurden beseitigt."],
        [
          "Jugendliche werden nach rassistischen Kriterien ausgeschlossen.",
          2,
          "Die behauptete Gemeinschaft galt nicht für alle.",
        ],
      ],
      "Freizeitangebot und Herrschaftszweck dürfen nicht getrennt bewertet werden.",
    ),
    tasks: {
      1: writing(
        "Warum ist es unzureichend, HJ oder BDM nur als Freizeitangebote zu beschreiben?",
        ["Ideologie und Rolle des Staates.", "Ausgeschlossene Jugendliche berücksichtigen."],
        "Fahrten und Gemeinschaft sollten Jugendliche an die NS-Herrschaft binden. Politische Schulung, Rollenbilder und zunehmender Zwang gehörten dazu. Verfolgte Jugendliche wurden ausgeschlossen. Die Freizeitaktivität war deshalb Teil eines Herrschaftssystems.",
        ["Anziehung", "Politischer Zweck", "Zwang und Ausgrenzung"],
      ),
      2: writing(
        "Ein Rückblick beschreibt eine glückliche Jugend im NS-Staat. Wie kann man ihn respektvoll und kritisch untersuchen?",
        [
          "Individuelle Erinnerung anerkennen.",
          "Was bleibt unsichtbar und was ist zusätzlich belegt?",
        ],
        "Der Rückblick kann eine persönliche Erfahrung wiedergeben. Ich prüfe Zeitpunkt, damalige Position und spätere Erinnerung. Ergänzende Quellen zu Zwang und Verfolgung zeigen, was dieser Blick nicht erfasst. Eine positive Einzelerinnerung ist kein Gesamturteil über die Herrschaft.",
        ["Erinnerung eingeordnet", "Quellenkritik", "Ausgeschlossene Perspektiven"],
      ),
    },
  },
  {
    id: "g-jugendkulturen",
    lb: 6,
    title: "Jugend gestaltet eigene Räume",
    period: "um 1900 bis heute",
    intro:
      "Musik, Kleidung und gemeinsame Aktivitäten können Selbstbestimmung ausdrücken – aber auch neue Grenzen schaffen.",
    paragraphs: [
      "Die Wandervogelbewegung suchte um 1900 Naturerfahrung und eigene Formen des Zusammenseins abseits des Erwachsenenalltags. Unterschiedliche Strömungen gehörten dazu, darunter auch nationalistische und ausschließende. Eigenständige Jugendkultur bedeutet deshalb nicht automatisch demokratische Offenheit.",
      "Spätere Beispiele wie Rock ’n’ Roll, Hippies oder Punk verbanden Musik und Stil mit Abgrenzung, teils auch politischen Forderungen. Nicht alle Jugendlichen teilten dieselben Werte. Vergleiche Leitbilder, Geschlechterrollen, Zugehörigkeit und Umgang mit Autorität, statt nur äußere Merkmale zu sammeln.",
    ],
    takeaway:
      "Jugendkulturen nach Selbstbestimmung, Leitbildern und Ausschlüssen vergleichen; Stil allein beweist keine politische Haltung.",
    sourceIds: ["wandervogel", "lehrplan"],
    quiz: check(
      "Was lässt sich aus Kleidung oder Musikgeschmack allein nicht sicher ableiten?",
      "Eine einheitliche politische Haltung aller Angehörigen einer Jugendkultur.",
      [
        "Dass Stil als Ausdruck von Zugehörigkeit verwendet werden kann.",
        "Dass Musik und Kleidung zur Abgrenzung beitragen können.",
      ],
      "Stil kann ein Hinweis sein; konkrete Haltungen brauchen weitere Belege.",
    ),
    workshop: classify(
      "Beobachtung und Deutung",
      ["Äußeres Merkmal", "Zu prüfendes Leitbild", "Unbelegte Verallgemeinerung"],
      [
        ["Eine Gruppe verwendet bestimmte Musik und Kleidung.", 0, "Das kann beobachtet werden."],
        [
          "Ein Programm fordert mehr Selbstbestimmung für Jugendliche.",
          1,
          "Anspruch und tatsächliche Praxis sind zu vergleichen.",
        ],
        [
          "Alle Mitglieder lehnen jede Form von Ausgrenzung ab.",
          2,
          "Das folgt nicht automatisch aus jugendlicher Gegenkultur.",
        ],
      ],
      "Gegenkultur ist kein Gütesiegel; historische Gruppen müssen differenziert untersucht werden.",
    ),
    tasks: {
      1: writing(
        "Nenne zwei sinnvolle Kriterien, um Wandervogel und eine spätere Jugendkultur zu vergleichen.",
        ["Selbstbestimmung und Zugehörigkeit.", "Ergebnisse nicht schon aus dem Namen ableiten."],
        "Ich vergleiche, welche Freiräume Jugendliche beanspruchten und wer dazugehören durfte. Dafür prüfe ich Programme und Erfahrungen. Gemeinsame Abgrenzung von Erwachsenen bedeutet noch nicht gleiche Werte oder gleiche Offenheit.",
        ["Zwei Kriterien", "Quellen genannt", "Keine Gleichsetzung"],
      ),
      2: writing(
        "Beurteile: Jede jugendliche Gegenkultur ist automatisch ein Beitrag zu Demokratie und Gleichberechtigung.",
        ["Anspruch, Praxis und Ausschlüsse prüfen.", "Historisches Beispiel heranziehen."],
        "Gegenkultur kann Selbstbestimmung fördern, aber ebenso nationalistische, rassistische oder geschlechtliche Ausschlüsse enthalten. Unterschiedliche Wandervogelströmungen zeigen, warum Eigenständigkeit allein kein Demokratiebeleg ist. Ich beurteile konkrete Regeln, Werte und Erfahrungen.",
        ["Möglichkeiten", "Gegenbeispiel", "Begründete Kriterien"],
      ),
    },
  },
  {
    id: "g-menschenrechte-entwicklung",
    lb: 7,
    title: "Rechte: Anspruch und Wirklichkeit",
    period: "Antike bis 1789 und darüber hinaus",
    intro:
      "Die Idee gleicher Rechte entstand nicht in einem Schritt und wurde oft nur für einen Teil der Menschen verwirklicht.",
    paragraphs: [
      "In Antike und Mittelalter war der rechtliche Status stark ungleich: Sklaverei, Hörigkeit und ständische Rechte begrenzten Freiheit. Menschenrechte formulieren demgegenüber einen Anspruch auf Rechte jedes Menschen, unabhängig von Herkunft oder sozialem Stand.",
      "Die amerikanische Unabhängigkeitserklärung 1776 und die französische Menschenrechtserklärung 1789 sind wichtige Bezugspunkte. Ihre Gleichheitsansprüche standen im Widerspruch zu Ausschlüssen, etwa von versklavten Menschen und Frauen. Historisch zu urteilen heißt, sowohl den neuen Anspruch als auch diese Grenzen zu untersuchen.",
    ],
    takeaway:
      "Menschenrechte beanspruchen Geltung für alle; ihre historische Erklärung muss Anspruch und tatsächliche Ausschlüsse unterscheiden.",
    sourceIds: ["lehrplan", "un", "gg"],
    quiz: check(
      "Was unterscheidet den Anspruch der Menschenrechte von ständischen Vorrechten?",
      "Rechte sollen jedem Menschen zukommen, nicht nur einem bestimmten Stand.",
      [
        "Rechte sollen ausschließlich den Angehörigen eines erblichen Standes zukommen.",
        "Rechte sollen nur aufgrund von Eigentum und politischem Einfluss entstehen.",
      ],
      "Historische Wirklichkeit blieb häufig hinter dem universellen Anspruch zurück.",
    ),
    workshop: timeline(
      [
        [
          "Rechtliche Ungleichheit durch Sklaverei und ständische Bindungen",
          "Antike und Mittelalter: unterschiedliche Rechte je nach Status; kein einheitlicher Zustand aller Gesellschaften.",
        ],
        [
          "Amerikanische Unabhängigkeitserklärung",
          "1776: Ein bedeutender Gleichheitsanspruch steht neben fortbestehenden Ausschlüssen.",
        ],
        [
          "Französische Menschenrechtserklärung",
          "1789: Freiheit und Gleichheit werden programmatisch erklärt.",
        ],
        [
          "Allgemeine Erklärung der Menschenrechte",
          "1948: Die Vereinten Nationen formulieren einen weltweiten Maßstab.",
        ],
      ],
      "Die Zeitfolge ist keine Geschichte automatisch wachsender Gleichheit.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Unterschied zwischen einem universellen Rechtsanspruch und seiner historischen Verwirklichung.",
        ["1776 oder 1789 als Beispiel.", "Eine ausgeschlossene Gruppe benennen."],
        "Ein universeller Anspruch richtet sich auf alle Menschen. In der historischen Umsetzung blieben beispielsweise Frauen oder versklavte Menschen ausgeschlossen. Die Erklärungen von 1776 und 1789 sind deshalb wichtige Bezugspunkte, aber kein Beweis bereits erreichter Gleichheit.",
        ["Anspruch erklärt", "Beispiel", "Ausschluss benannt"],
      ),
      2: writing(
        "Beurteile, warum eine Menschenrechtsgeschichte weder nur Fortschritte feiern noch nur Widersprüche aufzählen sollte.",
        [
          "Ansprüche ermöglichten Kritik.",
          "Erkämpfte Veränderungen und fortbestehende Ausschlüsse verbinden.",
        ],
        "Neue Rechtsansprüche boten Maßstäbe, mit denen Ausgeschlossene Gleichberechtigung fordern konnten. Gleichzeitig verdeckt eine reine Fortschrittserzählung fortbestehende Ungleichheit. Eine Erklärung untersucht beides sowie die Menschen und Bewegungen, die Rechte einforderten.",
        ["Bedeutung des Anspruchs", "Widersprüche", "Handelnde Menschen"],
      ),
    },
  },
  {
    id: "g-menschenrechte-schutz",
    lb: 7,
    title: "1948, Grundgesetz und europäischer Schutz",
    period: "seit 1948",
    intro:
      "Aus Erklärungen entstehen Maßstäbe. Wirksamer Schutz braucht außerdem Institutionen und Handeln.",
    paragraphs: [
      "Die Vereinten Nationen verabschiedeten am 10. Dezember 1948 die Allgemeine Erklärung der Menschenrechte. Sie formuliert einen weltweiten Maßstab. Die Erklärung ist nicht selbst ein Weltgericht und kein völkerrechtlicher Vertrag. Weitere Verträge und Institutionen sollen den Schutz stärken.",
      "Das Grundgesetz von 1949 bindet den Staat an Menschenwürde und Grundrechte. Die Europäische Menschenrechtskonvention wurde 1950 im Europarat zur Unterzeichnung aufgelegt und trat 1953 in Kraft. Ihr Schutzsystem umfasst den Europäischen Gerichtshof für Menschenrechte. Der Europarat ist von der Europäischen Union zu unterscheiden; Durchsetzung bleibt trotz Institutionen eine praktische Aufgabe.",
    ],
    takeaway:
      "Menschenrechtserklärung, Grundgesetz und EMRK unterscheiden sich in Reichweite und rechtlichem Schutzmechanismus.",
    sourceIds: ["un", "gg", "emrk"],
    quiz: check(
      "Zu welchem institutionellen Rahmen gehört die Europäische Menschenrechtskonvention?",
      "Zum Europarat und seinem Menschenrechtsschutz.",
      [
        "Ausschließlich zur Europäischen Union und ihrer Handelspolitik.",
        "Zur Generalversammlung der Vereinten Nationen als Weltgericht.",
      ],
      "Europarat, EU und Vereinte Nationen sind unterschiedliche Organisationen.",
    ),
    workshop: classify(
      "Dokumente zuordnen",
      ["Allgemeine Erklärung 1948", "Grundgesetz 1949", "EMRK 1950"],
      [
        [
          "Weltweiter Maßstab, von der UN-Generalversammlung verabschiedet",
          0,
          "Eine Erklärung ist nicht selbst ein Weltgericht.",
        ],
        [
          "Menschenwürde und Grundrechte binden die deutsche Staatsgewalt.",
          1,
          "Das ist eine Verfassungsordnung mit rechtlichem Schutz.",
        ],
        [
          "Konvention des Europarats mit einem europäischen Gerichtshof",
          2,
          "Unterzeichnung 1950, Inkrafttreten 1953.",
        ],
      ],
      "Historische Orientierung ist keine Beratung für einen individuellen Rechtsfall.",
    ),
    tasks: {
      1: writing(
        "Unterscheide die Menschenrechtserklärung von einem konkreten Schutzmechanismus.",
        ["Maßstab und Durchsetzung.", "Grundgesetz oder EMRK nutzen."],
        "Die Erklärung von 1948 formuliert einen weltweiten Maßstab für Menschenrechte. Ein Schutzmechanismus braucht rechtliche Verpflichtungen und Institutionen. Das Grundgesetz bindet deutsche Staatsgewalt; die EMRK verknüpft Vertragspflichten mit einem europäischen Gerichtshof.",
        ["Erklärung eingeordnet", "Mechanismus erklärt", "Beispiel korrekt"],
      ),
      2: writing(
        "Warum beweist ein unterzeichnetes Menschenrechtsdokument noch nicht, dass es keine Verletzungen gibt?",
        ["Norm und Praxis unterscheiden.", "Kontrolle und politische Bedingungen beachten."],
        "Ein Dokument legt Ansprüche oder Verpflichtungen fest. Für ihre Umsetzung braucht es unabhängige Kontrolle, Zugang zum Recht und tatsächliche Befolgung. Verletzungen können trotz formeller Anerkennung bestehen; man muss konkrete Praxis und Durchsetzung prüfen.",
        ["Norm und Praxis", "Institutionelle Bedingungen", "Begründete Grenze"],
      ),
    },
  },
  {
    id: "g-menschenrechte-urteilen",
    lb: 7,
    title: "Menschenrechte als Maßstab anwenden",
    period: "historischer Vergleich und Gegenwart",
    intro:
      "Ein begründetes Urteil fragt nach Menschen, Eingriffen, Belegen und Schutz – ohne verschiedene Situationen gleichzusetzen.",
    paragraphs: [
      "Untersuche einen Fall in Schritten: Was ist belegt? Wer ist betroffen? Welche Rechte und Machtverhältnisse spielen eine Rolle? Welche Perspektiven fehlen? Unterscheide eine historische Erklärung der Motive von einer Rechtfertigung des Eingriffs.",
      "Nicht jede Einschränkung eines Rechts ist in jedem Kontext gleich zu beurteilen; Schutzmechanismen und Grenzen müssen genau geprüft werden. Die staatliche Entmenschlichung im NS-Staat darf nicht durch ungenaue Alltagsvergleiche verharmlost werden. Gegenwartsbeispiele brauchen aktuelle, verlässliche Quellen. Die Übung hier verwendet einen ausdrücklich erfundenen Fall.",
    ],
    takeaway:
      "Menschenrechtsurteile brauchen belegte Tatsachen, betroffene Perspektiven und offengelegte Kriterien.",
    sourceIds: ["lehrplan", "gg", "emrk"],
    quiz: check(
      "Was trägt ein begründetes menschenrechtliches Urteil?",
      "Belege, betroffene Perspektiven und nachvollziehbare Kriterien.",
      [
        "Nur die Absicht der mächtigsten beteiligten Person.",
        "Nur ein historischer Vergleich ohne Prüfung der Unterschiede.",
      ],
      "Ein Urteil ist mehr als Zustimmung oder Ablehnung; seine Begründung muss überprüfbar sein.",
    ),
    workshop: classify(
      "Einen Fall untersuchen",
      ["Befund", "Betroffene Perspektive", "Bewertungskriterium"],
      [
        [
          "Laut Fallbeschreibung darf eine Gruppe die öffentliche Bibliothek nicht nutzen.",
          0,
          "Zuerst ist festzuhalten, was der Fall tatsächlich sagt.",
        ],
        [
          "Die ausgeschlossenen Jugendlichen verlieren einen Zugang zu Information.",
          1,
          "Eine Auswirkung muss aus Sicht Betroffener betrachtet werden.",
        ],
        [
          "Gleicher Zugang und Schutz vor willkürlicher Ausgrenzung",
          2,
          "Das sind Kriterien, keine bloßen Tatsachenbehauptungen.",
        ],
      ],
      "Für diese vereinfachte Übung folgt eine begründete Bewertung, keine verbindliche rechtliche Einzelfallentscheidung.",
      "Erfundener Gegenwartsfall: Eine öffentliche Bibliothek schließt eine Gruppe Jugendlicher allein wegen ihrer zugeschriebenen Herkunft aus. Ein sachlicher Grund wird nicht genannt.",
    ),
    tasks: {
      1: writing(
        "Bewerte den erfundenen Bibliotheksfall mit einem Beleg, einer betroffenen Perspektive und einem Kriterium.",
        ["Was steht wirklich im Fall?", "Willkürliche Ausgrenzung prüfen."],
        "Die Fallbeschreibung nennt einen Ausschluss allein nach zugeschriebener Herkunft. Betroffene verlieren Zugang zu Information und werden abgewertet. Gemessen an gleichem Zugang und dem Schutz vor willkürlicher Ausgrenzung ist das problematisch. Für einen realen Fall wären weitere Tatsachen und die Rechtslage zu prüfen.",
        ["Fallbeleg", "Betroffene Perspektive", "Kriterium und Grenze"],
      ),
      2: writing(
        "Welche Bedingungen muss ein Vergleich zwischen historischer Entrechtung und einer heutigen Ausgrenzung erfüllen?",
        [
          "Mechanismen vergleichen, Unterschiede offenhalten.",
          "Keine Gleichsetzung allein wegen eines ähnlichen Wortes.",
        ],
        "Er braucht belegte Tatsachen auf beiden Seiten und gemeinsame, offengelegte Kriterien. Ausmaß, staatliche Macht, Gewalt, Rechtslage und Handlungsmöglichkeiten müssen unterschieden werden. Ein Vergleich kann Fragen schärfen, darf NS-Verbrechen aber nicht durch eine vorschnelle Gleichsetzung verharmlosen.",
        ["Beide Seiten belegt", "Unterschiede", "Verantwortlicher Vergleich"],
      ),
    },
  },
];
