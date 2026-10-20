import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const methods: Lesson[] = [
  {
    id: "g-quellen-pruefen",
    lb: 1,
    title: "Wer spricht – und wozu?",
    period: "Quellenwerkstatt",
    intro:
      "Eine Quelle erzählt nie alles. Du prüfst, wer etwas für wen und mit welcher Absicht festgehalten hat.",
    paragraphs: [
      "Ein Brief aus dem Jahr 1914 ist eine Quelle aus der untersuchten Zeit. Ein heutiges Schulbuchkapitel darüber ist eine Darstellung. Beide können nützlich sein, beantworten aber unterschiedliche Fragen.",
      "Prüfe Urheber, Entstehungszeit, Adressaten, Quellenart und Situation. Unterscheide danach Inhalt und Absicht. Ein privater Brief kann beschönigen; eine amtliche Statistik kann wichtige Gruppen auslassen. Nähe zum Ereignis allein garantiert keine Wahrheit.",
    ],
    takeaway:
      "Urheber, Zeit, Adressaten und Absicht prüfen; Aussagen mit weiteren Belegen vergleichen.",
    sourceIds: ["lehrplan", "wk1"],
    quiz: check(
      "Welches Material ist eine zeitgenössische Quelle zum Ersten Weltkrieg?",
      "Ein Feldpostbrief aus dem Jahr 1916.",
      ["Ein Schulbuchkapitel aus dem Jahr 2020.", "Ein historischer Roman aus dem Jahr 2010."],
      "Der Brief entstand während des untersuchten Geschehens. Auch er bleibt eine begrenzte Perspektive.",
    ),
    workshop: classify(
      "Quelle oder Darstellung?",
      ["Quelle aus der untersuchten Zeit", "Spätere Darstellung"],
      [
        [
          "Eine Lebensmittelkarte aus dem Jahr 1917",
          0,
          "Ein zeitgenössischer Gegenstand kann Versorgung und Rationierung belegen.",
        ],
        [
          "Ein heutiger Museumsfilm über den Krieg",
          1,
          "Der Film ordnet nachträglich ein; er kann historische Quellen enthalten.",
        ],
        [
          "Das Tagebuch einer Schülerin, geschrieben im November 1918",
          0,
          "Es zeigt ihre Wahrnehmung, aber nicht die Erlebnisse aller Menschen.",
        ],
      ],
      "Die Einordnung hängt von der Frage ab: Ein heutiger Film wäre eine Quelle zur heutigen Erinnerungskultur.",
    ),
    tasks: {
      1: writing(
        "Ein Soldat schreibt 1916 seiner Familie, es gehe ihm gut. Belegt das einen ungefährlichen Frontalltag? Begründe.",
        ["Wer sollte den Brief lesen?", "Welche andere Quelle könnte helfen?"],
        "Der Brief belegt zunächst, was der Soldat seiner Familie mitteilen wollte. Er könnte sie beruhigen oder unter Zensur geschrieben haben. Für den Frontalltag vergleiche ich ihn etwa mit weiteren Briefen, Tagebüchern und militärischen Unterlagen.",
        ["Adressaten benannt", "Grenze des Belegs erklärt", "Weiteren Beleg vorgeschlagen"],
      ),
      2: writing(
        "Du findest einen undatierten Screenshot eines angeblichen Kriegsbriefs. Entwirf drei Prüfschritte, bevor du ihn verwendest.",
        ["Herkunft und Original suchen.", "Zeit, Kontext und unabhängige Belege prüfen."],
        "Ich suche das Original oder einen Archivnachweis und prüfe Urheber und Datum. Dann untersuche ich, ob der Ausschnitt vollständig und korrekt übertragen ist. Schließlich gleiche ich seine Aussagen mit unabhängigen Quellen ab und kennzeichne verbleibende Unsicherheit.",
        ["Herkunft geprüft", "Kontext berücksichtigt", "Unsicherheit ausgewiesen"],
      ),
    },
  },
  {
    id: "g-propaganda",
    lb: 1,
    title: "Propaganda erkennen",
    period: "Medien kritisch lesen",
    intro:
      "Eine Botschaft kann Gefühle auslösen und gleichzeitig wichtige Informationen verschweigen.",
    paragraphs: [
      "Propaganda will Wahrnehmung und Verhalten gezielt beeinflussen. Dazu kann sie auswählen, übertreiben, Feindbilder erzeugen oder einen scheinbaren Gegensatz zwischen einer geschlossenen eigenen Gruppe und angeblichen Gegnern aufbauen.",
      "Beschreibe zuerst, was zu sehen oder zu lesen ist. Untersuche dann Gestaltung, Absender und gewünschte Wirkung. Die Absicht des Urhebers ist noch kein Beleg dafür, dass alle Menschen die Botschaft glaubten.",
    ],
    takeaway: "Zwischen Gestaltung, beabsichtigter Wirkung und belegter Wirkung unterscheiden.",
    sourceIds: ["lehrplan", "wk1", "ns"],
    quiz: check(
      "Was lässt sich aus einem Propagandaplakat allein sicher untersuchen?",
      "Die vom Absender beabsichtigte Botschaft.",
      [
        "Die tatsächliche Meinung aller Betrachtenden.",
        "Die vollständige Lage der gesamten Bevölkerung.",
      ],
      "Für die tatsächliche Wirkung brauchst du weitere Belege, etwa Reaktionen oder Tagebücher.",
    ),
    workshop: classify(
      "Behauptung und Wirkung trennen",
      ["Am Material beobachtbar", "Beabsichtigte Wirkung", "So nicht belegt"],
      [
        [
          "Der Übungstext spricht alle mit einem gemeinsamen Wir an.",
          0,
          "Das lässt sich am Wortlaut erkennen.",
        ],
        [
          "Der Absender möchte Zusammenhalt und Zustimmung erzeugen.",
          1,
          "Die Aufforderung deutet auf eine Absicht; sie beweist keinen Erfolg.",
        ],
        ["Alle Leserinnen und Leser waren überzeugt.", 2, "Dazu fehlen Rezeptionsquellen."],
      ],
      "Ein Quellenurteil benennt seine Belege und seine Grenzen.",
      "Eine erfundene Werbebotschaft für eine historische Medienübung verwendet ein gemeinsames Wir und fordert bedingungslose Zustimmung. Zahlen, Gegenargumente und Folgen fehlen.",
    ),
    tasks: {
      1: writing(
        "Erkläre an dem Übungstext zwei Mittel der Beeinflussung und eine Grenze deiner Aussage.",
        ["Achte auf Wir und die fehlenden Informationen.", "Unterscheide Absicht und Erfolg."],
        "Das gemeinsame Wir spricht das Bedürfnis nach Zugehörigkeit an. Die fehlenden Gegenargumente lassen die Forderung alternativlos erscheinen. Daraus erschließe ich die beabsichtigte Beeinflussung, kann aber nicht sagen, wie viele Menschen zustimmten.",
        ["Zwei Mittel erläutert", "Beleg am Text genannt", "Wirkungsgrenze benannt"],
      ),
      2: writing(
        "Eine Darstellung behauptet: Ein häufig gezeigtes Plakat beweist die Zustimmung der ganzen Bevölkerung. Prüfe diese Schlussfolgerung.",
        ["Verbreitung ist nicht Zustimmung.", "Suche Belege für unterschiedliche Reaktionen."],
        "Häufige Verbreitung zeigt zunächst die Verbreitungsmacht des Absenders. Zustimmung, Gleichgültigkeit, Ablehnung und Angst sind verschiedene mögliche Reaktionen. Um diese zu untersuchen, brauche ich weitere Quellen und muss ihre jeweilige Reichweite prüfen.",
        ["Schlussfehler erklärt", "Mehrere Reaktionen erwogen", "Weitere Quellen verlangt"],
      ),
    },
  },
  {
    id: "g-zeit-und-daten",
    lb: 1,
    title: "Daten und Zusammenhänge",
    period: "1914–1945",
    intro:
      "Eine Zeitleiste ordnet Ereignisse. Eine historische Erklärung zeigt zusätzlich, wie sie zusammenhängen.",
    paragraphs: [
      "1914–1918 steht für den Ersten Weltkrieg, 1919–1933 für die Weimarer Republik und 1939–1945 für den Zweiten Weltkrieg. Der 30. Januar 1933 markiert Hitlers Ernennung zum Reichskanzler, nicht die Vollendung aller Schritte zur Diktatur an einem einzigen Tag.",
      "Ein Diagramm braucht Titel, Zeitraum, Einheit, Herkunft und Vergleichsmaßstab. Steigen zwei Werte gleichzeitig, ist damit noch keine eindeutige Ursache bewiesen. Beschreibe den Befund und prüfe zusätzliche Erklärungen.",
    ],
    takeaway: "Zeitliche Abfolge ordnet; eine Ursache muss zusätzlich mit Belegen erklärt werden.",
    sourceIds: ["lehrplan", "weimar", "wk2"],
    quiz: check(
      "Was folgt aus zwei gleichzeitig steigenden Werten allein?",
      "Ein Zusammenhang ist zu prüfen, nicht schon bewiesen.",
      [
        "Der zuerst gezeigte Wert verursacht immer den zweiten.",
        "Die zeitliche Nähe beweist eine einzige Ursache.",
      ],
      "Korrelation allein ist keine kausale Erklärung.",
    ),
    workshop: timeline(
      [
        [
          "Beginn des Ersten Weltkriegs",
          "1914: Der europäische Konflikt weitet sich zum Weltkrieg aus.",
        ],
        ["Weimarer Verfassung", "1919: Die parlamentarische Demokratie erhält eine Verfassung."],
        [
          "Hitlers Ernennung zum Reichskanzler",
          "30. Januar 1933: Danach wird die Demokratie schrittweise zerstört.",
        ],
        [
          "Ende des Zweiten Weltkriegs in Europa",
          "Mai 1945: Die deutsche Kapitulation beendet den Krieg in Europa.",
        ],
      ],
      "Die Reihenfolge ersetzt keine Erklärung für Krieg, Demokratie oder Diktatur.",
    ),
    tasks: {
      1: writing(
        "Arbeitslosigkeit und NSDAP-Stimmen steigen in einer Grafik. Welche Aussage ist möglich, welche weitere Prüfung nötig?",
        [
          "Beschreibe zunächst beide Entwicklungen.",
          "Untersuche Entscheidungen und weitere Einflussfaktoren.",
        ],
        "Die Grafik kann einen zeitlichen Zusammenhang zeigen. Sie beweist nicht, dass jede arbeitslose Person NSDAP wählte. Ich prüfe Quelle, Maßstab, regionale Unterschiede sowie politische Kampagnen und Entscheidungen anderer Akteure.",
        ["Befund beschrieben", "Keine Einzelpersonen abgeleitet", "Zusätzliche Prüfung genannt"],
      ),
      2: writing(
        "Erkläre, warum ein Ereignis auf einer Zeitleiste kein zwangsläufiges Ende einer Entwicklung sein muss.",
        [
          "Welche Handlungsspielräume gab es?",
          "Unterscheide Rückblick und damalige Möglichkeiten.",
        ],
        "Im Rückblick kennen wir das Ergebnis, damalige Menschen aber nicht. Politische Akteure trafen Entscheidungen zwischen verschiedenen Möglichkeiten. Eine Erklärung muss Bedingungen und Entscheidungen belegen, statt eine zwangsläufige Kette aus später bekannten Daten zu bilden.",
        ["Rückblick unterschieden", "Handlungsspielräume benannt", "Belege eingefordert"],
      ),
    },
  },
  {
    id: "g-geschichte-vor-ort",
    lb: 1,
    title: "Geschichte vor deiner Haustür",
    period: "Rechercheprojekt",
    intro:
      "Ein Denkmal oder ein Archivstück verbindet den eigenen Ort mit einer größeren Geschichte.",
    paragraphs: [
      "Formuliere eine kleine Frage: An wen erinnert ein Denkmal? Wann wurde es aufgestellt und später verändert? Eine Inschrift zeigt auch die Sicht ihrer Entstehungszeit. Namen und Leerstellen müssen untersucht werden.",
      "Notiere Fundort, Urheber, Datum und verlässliche Nachweise. Unterscheide Original, spätere Beschreibung und deine eigene Deutung. Stelle einen Bezug zu einem Lernbereich her. Eine lokale Recherche oder ein Gedenkstättenbesuch findet außerhalb dieser App statt; die Werkstatt hilft bei Vorbereitung und Auswertung.",
    ],
    takeaway:
      "Eine Ortsgeschichte wird durch eine prüfbare Frage, Quellenbelege und historischen Kontext tragfähig.",
    sourceIds: ["lehrplan", "dachau"],
    quiz: check(
      "Welcher erste Schritt macht eine lokale Recherche prüfbar?",
      "Eine konkrete Frage und Herkunftsnachweise festhalten.",
      [
        "Nur die erste gefundene Internetseite abschreiben.",
        "Eine Vermutung ohne Quellen als Ergebnis darstellen.",
      ],
      "So können andere nachvollziehen, worauf deine Darstellung beruht.",
    ),
    workshop: classify(
      "Was gehört wohin?",
      ["Dokumentierter Befund", "Offene Forschungsfrage", "Unbelegte Behauptung"],
      [
        [
          "Eine Tafel trägt die Jahreszahl 1925; ein Foto dokumentiert sie.",
          0,
          "Jahreszahl und Nachweis sind überprüfbar, ihre Bedeutung bleibt zu klären.",
        ],
        [
          "Wessen Namen fehlen auf der Tafel und warum?",
          1,
          "Dafür lassen sich weitere Archivquellen suchen.",
        ],
        [
          "Alle Menschen am Ort fanden die Tafel gut.",
          2,
          "Eine allgemeine Zustimmung ist durch die Tafel nicht belegt.",
        ],
      ],
      "Nutze ein Stadtarchiv, ein Museum oder einen pädagogisch begleiteten Gedenkort. Erfasse keine privaten Angaben lebender Personen für diese Übung.",
    ),
    tasks: {
      1: writing(
        "Plane eine Recherche zu einem Denkmal: Frage, zwei Quellenarten und historischer Zusammenhang.",
        ["Wer errichtete es und wann?", "Vergleiche Inschrift und Archivmaterial."],
        "Ich frage, wen ein Denkmal für den Ersten Weltkrieg erinnert. Ich dokumentiere Inschrift und Aufstellungsdatum und suche einen zeitgenössischen Zeitungsbericht im Archiv. Beides ordne ich in Kriegserfahrung und Erinnerung der Weimarer Zeit ein; unbekannte Motive bleiben offene Fragen.",
        ["Konkrete Frage", "Zwei Quellenarten", "Zusammenhang und Grenze"],
      ),
      2: writing(
        "Eine Gemeinde will eine belastete Straßenbenennung erläutern. Skizziere, wie eine begründete Empfehlung entstehen kann.",
        ["Benennungsgeschichte belegen.", "Kriterien und betroffene Perspektiven offenlegen."],
        "Ich prüfe Benennungsdatum, damalige Begründung und die belegte Tätigkeit der geehrten Person. Dann beziehe ich unterschiedliche Perspektiven ein. Ich bewerte Benennung und mögliche Erläuterung anhand offener Kriterien wie Menschenrechten und historischer Genauigkeit und trenne Tatsachen von meiner Empfehlung.",
        ["Historische Belege", "Perspektiven und Kriterien", "Befund und Urteil getrennt"],
      ),
    },
  },
];
