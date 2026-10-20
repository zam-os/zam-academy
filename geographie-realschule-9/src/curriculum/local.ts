import type { Lesson } from "../model/types";
import { check, classify, tasks } from "./helpers";

export const local: Lesson[] = [
  {
    id: "geo-nahraumfrage",
    lb: 7,
    title: "Ein aktuelles Ereignis vor deiner Haustür",
    period: "Eigenes Nahraumprojekt · Frage und Verortung",
    projectStep: "question",
    intro:
      "Suche ein reales aktuelles Thema in deiner Gemeinde oder Region: etwa einen neuen Radweg, einen Flussumbau oder eine veränderte Flächennutzung.",
    paragraphs: [
      "Der Lernbereich verlangt die Untersuchung einer aktuellen geographischen Fragestellung im eigenen Nahraum. Wähle ein tatsächlich laufendes oder jüngst berichtetes Ereignis und notiere Datum und Ort. Formuliere eine offene Frage, die räumliche Zusammenhänge enthält: Wer nutzt welche Fläche, was verändert sich und wer ist betroffen? Ein bloßes Ja oder Nein ohne Begründung reicht nicht.",
      "Verorte das Thema auf einer passenden Karte und beschreibe Lage und Beziehungen zu Gewässern, Siedlungen oder Verkehrswegen. Trage im Recherchebogen nur einen öffentlichen Orts- oder Gebietsnamen ein, keine Privatadresse und keine personenbezogenen Angaben. Die App speichert deine Notizen lokal; sie sucht keine Quellen für dich und prüft nicht, ob dein gewähltes Ereignis tatsächlich stattgefunden hat.",
    ],
    takeaway:
      "Eine gute Nahraumfrage verbindet ein reales aktuelles Ereignis, einen klaren Raum und eine untersuchbare Beziehung.",
    sourceIds: ["lehrplan", "bayern-atlas", "inkar"],
    quiz: check(
      "Welche Frage eignet sich besonders für eine geographische Nahraumuntersuchung?",
      "Wie verändert der geplante Radweg die Erreichbarkeit im Ort?",
      [
        "Welche Farbe gefällt mir ganz ohne Bezug zum Ort?",
        "Ist jede Veränderung überall grundsätzlich gleich?",
      ],
      "Die erste Frage verbindet ein konkretes Ereignis mit räumlichen Beziehungen und lässt sich mit Karten und Quellen untersuchen.",
    ),
    workshop: classify(
      "Was gehört zum Untersuchungsstart?",
      ["Geeignet", "Überarbeiten"],
      [
        [
          "Ein öffentliches Vorhaben mit Ort, Datum und offener Frage",
          0,
          "Das schafft einen überprüfbaren Ausgangspunkt.",
        ],
        [
          "Eine erfundene Geschichte als angeblich reales Ereignis",
          1,
          "Ein Übungsfall ersetzt keine aktuelle Nahraumuntersuchung.",
        ],
        [
          "Eine Karte mit Legende, Maßstab und markiertem Untersuchungsgebiet",
          0,
          "Die Verortung braucht eine verständliche Kartengrundlage.",
        ],
      ],
      "Der Recherchebogen ist ein Arbeitsauftrag für dein echtes Thema, keine automatisch bestätigte Tatsachenprüfung.",
    ),
    tasks: tasks(
      "Formuliere zu deinem realen Nahraumthema eine räumliche Frage und erkläre ihre Untersuchung.",
      "Eine mögliche Struktur lautet: Wie verändert das öffentlich beschriebene Vorhaben die Erreichbarkeit oder Nutzung eines Gebiets? Ich nenne meinen tatsächlichen Ort, das Ereignis mit Datum und geeignete Karten. Dieses Muster muss ich mit meinem eigenen aktuellen Fall ausfüllen; es ist noch keine erledigte Recherche.",
      [
        "Ich verwende meinen tatsächlichen aktuellen Fall.",
        "Ich formuliere eine räumliche offene Frage.",
        "Ich nenne einen passenden Kartenbezug.",
      ],
      "Dein Thema ist schon mehrere Monate alt, wird aber weiter öffentlich beraten. Wie begründest du seine Aktualität?",
      "Ich erläutere, welcher Teil des Vorhabens gerade offen oder neu entschieden ist, und belege das mit einer datierten aktuellen Quelle. Alter allein entscheidet nicht über Aktualität; ein laufender Prozess kann weiterhin relevant sein. Ich grenze meinen Untersuchungszeitpunkt klar ab.",
      [
        "Ich benenne den aktuellen Anlass.",
        "Ich nenne eine datierte Quelle.",
        "Ich begrenze Zeitraum und Untersuchungsfrage.",
      ],
    ),
  },
  {
    id: "geo-nahraumbelege",
    lb: 7,
    title: "Karte, Fachquelle und Nachricht zusammenlesen",
    period: "Eigenes Nahraumprojekt · Belege und Perspektiven",
    projectStep: "evidence",
    intro:
      "Zwei Links sind noch keine Untersuchung. Entscheidend ist, was die Quellen belegen, wie aktuell sie sind und aus welcher Perspektive sie sprechen.",
    paragraphs: [
      "Suche für dein tatsächliches Thema mindestens eine fachliche oder amtliche Quelle und eine journalistische beziehungsweise massenmediale Darstellung. Notiere jeweils URL und Veröffentlichungsdatum. Unterscheide das Datum des Ereignisses vom Datum des Berichts. Zwei Seiten, die denselben Text übernehmen, sind nicht automatisch zwei unabhängige Belege.",
      "Halte fest, was die Karte zeigt und wie die Quellen deine Frage beantworten. Prüfe Urheber, Absicht, räumlichen Zuschnitt und Datenbasis. Benenne mindestens einen Unterschied der Perspektiven oder eine offene Frage. Vermeide es, ein Foto ohne Ort und Datum als Beweis für die gesamte Region zu verwenden. Die formale Vollständigkeit des Recherchebogens ist kein automatischer Quellen- oder Faktencheck.",
    ],
    takeaway: "Ein Beleg braucht Herkunft, Datum, konkrete Aussage und eine benannte Grenze.",
    sourceIds: ["lehrplan", "bayern-atlas", "inkar"],
    quiz: check(
      "Warum sind zwei identische übernommene Meldungen keine zwei unabhängigen Belege?",
      "Beide können auf derselben ursprünglichen Quelle beruhen",
      [
        "Jede Veröffentlichung ist automatisch eine eigene Messung",
        "Ein gleicher Text beweist grundsätzlich mehr räumliche Genauigkeit",
      ],
      "Die Herkunftskette muss geprüft werden. Wiederholung ersetzt keine unabhängige Beobachtung oder zusätzliche Perspektive.",
    ),
    workshop: classify(
      "Was ist belegt?",
      ["Geeigneter Beleg mit Grenze", "So noch nicht ausreichend"],
      [
        [
          "Eine datierte Fachkarte zeigt den betroffenen Raum und ihre Legende.",
          0,
          "Sie ermöglicht räumliche Aussagen innerhalb ihres Maßstabs und Datenstands.",
        ],
        [
          "Ein undatiertes Bild ohne Ortsangabe soll alle Folgen beweisen.",
          1,
          "Ort, Zeitpunkt und Repräsentativität fehlen.",
        ],
        [
          "Ein Artikel benennt Betroffene, während der amtliche Plan das Vorhaben beschreibt.",
          0,
          "Die Perspektiven können sich ergänzen; Aussagen müssen einzeln geprüft werden.",
        ],
      ],
      "Fachquelle und Nachricht können unterschiedliche Fragen beantworten; keine Quelle ist für alles gleich geeignet.",
    ),
    tasks: tasks(
      "Vergleiche die beiden Quellen deines Nahraumprojekts mit einer Gemeinsamkeit und einer Grenze.",
      "Ich benenne die tatsächlichen Quellen mit Datum und ordne ihre Urheber ein. Dann zeige ich, welche konkrete Aussage beide stützen und worin Perspektive, Raum oder Datenbasis abweichen. Wenn ein Beleg nur eine Planung beschreibt, behandle ich die geplante Wirkung noch nicht als gemessenen Erfolg.",
      [
        "Ich beziehe mich auf meine beiden realen Quellen.",
        "Ich nenne eine belegte Gemeinsamkeit.",
        "Ich erkläre eine Perspektive oder Aussagegrenze.",
      ],
      "Eine amtliche Planung und ein Zeitungsbericht widersprechen sich scheinbar. Wie klärst du den Unterschied?",
      "Ich prüfe, ob beide denselben Zeitpunkt, Raum und Gegenstand meinen. Eine Planung kann ein Ziel nennen, während der Bericht eine aktuelle Belastung beschreibt. Ich trenne Absicht, Beobachtung und Bewertung und suche bei einem echten Widerspruch weitere fachliche Belege.",
      [
        "Ich vergleiche Raum, Zeit und Gegenstand.",
        "Ich trenne Ziel und beobachtete Wirkung.",
        "Ich nenne einen nächsten Prüfungsschritt.",
      ],
    ),
  },
  {
    id: "geo-nahraumurteil",
    lb: 7,
    title: "Dein Ergebnis zeigen und begründet urteilen",
    period: "Eigenes Nahraumprojekt · Präsentation und Bewertung",
    projectStep: "judgment",
    intro:
      "Ein gutes Ergebnis beantwortet deine Ausgangsfrage mit Belegen und macht sichtbar, wo deine Untersuchung an Grenzen stößt.",
    paragraphs: [
      "Ordne dein Ergebnis in eine kurze Präsentation: Frage und Ort, Karte mit Quellenangabe, wichtigste Belege, verschiedene Perspektiven und dein Urteil. Unterscheide gesicherte Beobachtungen, begründete Deutungen und eigene Wertungen. Benenne auch Unsicherheit oder fehlende Daten. Beurteile mögliche Handlungen anhand offengelegter ökologischer, wirtschaftlicher oder sozialer Kriterien.",
      "Eine Präsentation kann im Unterricht, als Poster oder als kurzer Vortrag erfolgen. Die App begleitet Planung und Selbsteinschätzung, bestätigt aber keine tatsächliche Durchführung vor Ort oder in der Klasse. Der Nahraum-Lernbereich ist fachlich erst mit einer realen Untersuchung und ihrer Besprechung erfüllt. Lass Quellenwahl, Ergebnis und Präsentation möglichst von einer Lehrkraft oder Lerngruppe gegenlesen.",
    ],
    takeaway:
      "Ein nachvollziehbares Urteil verbindet Beleg, Maßstab und Schlussfolgerung; Unsicherheiten gehören dazu.",
    sourceIds: ["lehrplan", "muenchen-step"],
    quiz: check(
      "Was macht ein geographisches Urteil nachvollziehbar?",
      "Belege, offengelegte Kriterien und eine begründete Abwägung",
      [
        "Nur ein starkes Adjektiv ohne Quelle",
        "Die Behauptung, jede andere Perspektive sei bedeutungslos",
      ],
      "Andere können das Urteil prüfen, wenn Tatsachen, Maßstäbe und Gewichtung erkennbar sind.",
    ),
    workshop: classify(
      "Ergebnis sauber darstellen",
      ["Beobachtung", "Bewertung", "Offene Frage"],
      [
        [
          "Der veröffentlichte Plan zeigt den Verlauf des neuen Wegs.",
          0,
          "Das ist eine Aussage über einen benannten Beleg, nicht über seine spätere Wirkung.",
        ],
        [
          "Ich gewichte sichere Schulwege besonders hoch.",
          1,
          "Hier wird ein Bewertungsmaßstab offengelegt.",
        ],
        [
          "Wie verändern sich Verkehrsmengen nach der Umsetzung?",
          2,
          "Dafür werden weitere Daten nach der Umsetzung benötigt.",
        ],
      ],
      "Beobachtungen, Bewertungen und offene Fragen dürfen in derselben Präsentation stehen, müssen aber unterscheidbar bleiben.",
    ),
    tasks: tasks(
      "Formuliere zu deinem Nahraumprojekt ein begründetes Urteil mit einem Beleg und einer Grenze.",
      "Ich beantworte meine tatsächliche Frage anhand der gesammelten Quellen und benenne meinen wichtigsten Maßstab. Ich wäge einen Vorteil gegen eine Belastung ab und erläutere, warum ich zu meinem Urteil komme. Fehlende Messungen oder noch offene Entscheidungen nenne ich ausdrücklich; ein Textmuster ersetzt diese eigene Arbeit nicht.",
      [
        "Ich nutze einen konkreten Beleg meines Projekts.",
        "Ich lege Maßstab und Abwägung offen.",
        "Ich benenne eine Grenze oder offene Frage.",
      ],
      "Wie präsentierst du einen Fall, bei dem zwei Gruppen berechtigte, aber widersprüchliche Interessen haben?",
      "Ich stelle beide Interessen und ihre räumlichen Folgen fair mit Belegen dar. Anschließend erkläre ich meine Kriterien und ihre Gewichtung, prüfe Alternativen und begründe mein Urteil. Ich kennzeichne Unsicherheiten und bespreche, welche zusätzlichen Daten oder Beteiligungsformen hilfreich wären.",
      [
        "Ich stelle mindestens zwei Perspektiven dar.",
        "Ich erkläre meine Gewichtung und eine Alternative.",
        "Ich nenne Unsicherheit oder einen nächsten Schritt.",
      ],
    ),
  },
];
