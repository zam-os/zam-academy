import type { Lesson } from "../model/types";
import { check, classify, tasks } from "./helpers";

export const population: Lesson[] = [
  {
    id: "geo-altersdiagramme",
    lb: 5,
    title: "Altersaufbau lesen statt Formen raten",
    period: "Bevölkerungsdiagramme · Deutschland und Welt",
    model: "population",
    intro:
      "Ein Altersdiagramm macht Jahrgänge sichtbar. Seine Form ist ein Ausgangspunkt für Fragen, keine vollständige Erklärung einer Gesellschaft.",
    paragraphs: [
      "Lies zuerst Land oder Raum, Datum, Altersgruppen und Einheit. Ein Diagramm kann absolute Zahlen oder Anteile zeigen; unterschiedlich große Bevölkerungen lassen sich mit Prozentwerten leichter im Aufbau vergleichen. Breite junge Jahrgänge können auf viele Geburten hinweisen, Einbuchtungen aber verschiedene Ursachen haben. Für eine Erklärung braucht man zeitliche Daten zu Geburten, Sterbefällen und Wanderungen.",
      "Deutschland hat einen vergleichsweise hohen Anteil älterer Menschen. In anderen Weltregionen können jüngere Jahrgänge stärker besetzt sein; auch dort unterscheiden sich Staaten und Regionen. Die drei Profile im Modell sind ausdrücklich erfundene Zahlen für jeweils 1.000 Personen in drei breiten Altersgruppen. Sie sind keine echten Bevölkerungspyramiden und ersetzen keine detaillierten Alters- und Geschlechtsdaten.",
    ],
    takeaway: "Beschreibe zunächst den Aufbau und prüfe dann mögliche Ursachen mit weiteren Daten.",
    sourceIds: ["destatis", "un-population"],
    quiz: check(
      "Was musst du vor dem Vergleich zweier Altersdiagramme prüfen?",
      "Bezugsraum, Jahr und Einheit der Werte",
      ["Nur die dekorative Farbe des Hintergrunds", "Ausschließlich die längste Beschriftung"],
      "Absolute Zahlen und Anteile können unterschiedliche Größen zeigen. Raum und Datenstand müssen vergleichbar sein.",
    ),
    workshop: classify(
      "Beschreiben oder erklären?",
      ["Beschreibung", "Hypothese, die weitere Belege braucht"],
      [
        [
          "Die Gruppe ab 65 Jahren hat einen höheren Anteil als die unter 20 Jahren.",
          0,
          "Das lässt sich an geeigneten Werten direkt ablesen.",
        ],
        [
          "Eine Einbuchtung ist ausschließlich durch einen bestimmten Krieg verursacht.",
          1,
          "Die Zuordnung braucht zeitliche und historische Belege.",
        ],
        [
          "Das Diagramm verwendet Prozent statt absoluter Zahlen.",
          0,
          "Die Einheit ist eine beobachtbare Eigenschaft der Darstellung.",
        ],
      ],
      "Eine plausible Erklärung wird nicht allein durch eine ähnliche Diagrammform bewiesen.",
    ),
    tasks: tasks(
      "Beschreibe zwei Merkmale eines Altersdiagramms und erkläre, welche Zusatzdaten du für die Ursachen brauchst.",
      "Ich beschreibe zum Beispiel den Anteil junger und älterer Menschen sowie auffällige Unterschiede zwischen Jahrgängen. Dazu nenne ich Raum, Jahr und Einheit. Um Ursachen zu erklären, prüfe ich Geburten, Sterbefälle und Wanderungen über die Zeit; aus der Form allein folgt keine eindeutige Geschichte.",
      [
        "Ich beschreibe statt sofort zu bewerten.",
        "Ich nenne Raum, Zeit und Einheit.",
        "Ich fordere zusätzliche Ursachenbelege.",
      ],
      "Ein Land hat doppelt so viele ältere Menschen wie ein anderes. Ist seine Bevölkerung zwangsläufig stärker gealtert?",
      "Nicht unbedingt: Auch die Gesamtbevölkerung kann viel größer sein. Für den Altersaufbau vergleiche ich Anteile in denselben Altersgruppen und Jahren. Absolute Zahlen bleiben für den tatsächlichen Bedarf an Angeboten wichtig, beantworten aber eine andere Frage.",
      [
        "Ich unterscheide Anzahl und Anteil.",
        "Ich verwende gleiche Altersgrenzen.",
        "Ich erkläre den unterschiedlichen Nutzen beider Angaben.",
      ],
    ),
  },
  {
    id: "geo-bevoelkerungsbilanz",
    lb: 5,
    title: "Wie sich eine Bevölkerung verändert",
    period: "Geburten · Sterbefälle · Wanderung",
    model: "balance",
    intro:
      "Eine Bevölkerungszahl verändert sich durch zwei Salden. Ein Geburtendefizit bedeutet deshalb nicht automatisch eine schrumpfende Gesamtbevölkerung.",
    paragraphs: [
      "Die natürliche Bilanz ist Geburten minus Sterbefälle. Die Wanderungsbilanz ist Zuzüge minus Fortzüge. Addiert man beide zum Anfangsbestand, erhält man den Endbestand eines abgegrenzten Raums im betrachteten Zeitraum; statistische Korrekturen werden in realen Daten gegebenenfalls zusätzlich ausgewiesen. Binnenwanderung verändert regionale Zahlen, aber nicht unmittelbar die Weltbevölkerung.",
      "Im Rechenmodell beginnt ein fiktiver Ort mit 1.000 Menschen. Alle vier Bewegungsgrößen sind Personen pro Jahr. Du kannst zeigen, wie ein negativer natürlicher Saldo durch einen positiven Wanderungssaldo ausgeglichen wird. Das Modell erklärt keine individuellen Motive und bildet den Altersaufbau nicht ab. Eine Rate je 1.000 Einwohner wäre eine andere Einheit als die hier verwendete absolute Zahl.",
    ],
    takeaway: "Endbestand = Anfangsbestand + Geburten − Sterbefälle + Zuzüge − Fortzüge.",
    sourceIds: ["destatis", "un-population"],
    quiz: check(
      "Ein Ort hat 10 Geburten, 15 Sterbefälle, 30 Zuzüge und 20 Fortzüge. Wie verändert sich die Zahl?",
      "Sie steigt um fünf Personen",
      ["Sie sinkt um fünfzehn Personen", "Sie bleibt wegen der Sterbefälle unverändert"],
      "Die natürliche Bilanz ist −5, die Wanderungsbilanz +10. Zusammen ergibt das +5 Personen.",
    ),
    workshop: classify(
      "Welche Bilanz ist betroffen?",
      ["Natürliche Bilanz", "Wanderungsbilanz", "Nicht aus diesen Daten ableitbar"],
      [
        [
          "Geburten und Sterbefälle im Kalenderjahr",
          0,
          "Ihre Differenz ergibt den natürlichen Saldo.",
        ],
        [
          "Menschen ziehen über die Grenze des betrachteten Raums.",
          1,
          "Zuzüge und Fortzüge bilden den Wanderungssaldo.",
        ],
        [
          "Alle Zugezogenen bleiben dauerhaft und sind gleich alt.",
          2,
          "Bestandsbewegungen allein enthalten diese Informationen nicht.",
        ],
      ],
      "Die räumliche Grenze entscheidet, ob ein Umzug als Wanderung erfasst wird.",
    ),
    tasks: tasks(
      "Berechne und erläutere die Veränderung bei 1.000 Anfangsbevölkerung, 10 Geburten, 15 Sterbefällen, 30 Zu- und 20 Fortzügen.",
      "Die natürliche Bilanz beträgt 10 minus 15, also −5. Die Wanderungsbilanz beträgt 30 minus 20, also +10. Insgesamt steigt die Bevölkerung um 5 auf 1.005 Menschen. Der positive Wanderungssaldo gleicht das Geburtendefizit mehr als aus.",
      [
        "Ich rechne beide Salden richtig.",
        "Ich leite den Endbestand ab.",
        "Ich gebe Personen und Zeitraum an.",
      ],
      "Warum darf man Wanderungsgewinne aller Weltregionen nicht unabhängig addieren und daraus Weltwachstum berechnen?",
      "Eine Person, die zwischen Weltregionen umzieht, wird in einer Region als Zuzug und in der anderen als Fortzug erfasst. Für die Welt insgesamt heben sich solche grenzüberschreitenden Bewegungen auf. Weltbevölkerungswachstum hängt in der Bilanz von Geburten und Sterbefällen ab.",
      [
        "Ich beziehe mich auf den betrachteten Raum.",
        "Ich erkläre die Gegenbuchung einer Wanderung.",
        "Ich benenne die globale natürliche Bilanz.",
      ],
    ),
  },
  {
    id: "geo-szenarien",
    lb: 5,
    title: "Bayern, Deutschland und die Welt vorausdenken",
    period: "Szenarien · regionale Unterschiede · Unsicherheit",
    intro:
      "Eine Bevölkerungsvorausberechnung sagt, was unter bestimmten Annahmen eintreten würde. Sie ist keine sichere Vorhersage.",
    paragraphs: [
      "Geburtenhäufigkeit, Lebenserwartung und Wanderung bestimmen gemeinsam langfristige Entwicklungen. Die 16. koordinierte Bevölkerungsvorausberechnung von Destatis behandelt 2025 bis 2070 mit mehreren Annahmenkombinationen. Ein mittlerer Verlauf ist kein Gewissheitswert; ändern sich Annahmen, ändern sich Ergebnisse. Bei weltweiten Vergleichen sind zusätzlich Datenqualität und sehr unterschiedliche Altersstrukturen zu beachten.",
      "Auch innerhalb Bayerns entwickeln sich Regionen verschieden: Arbeitsplätze, Hochschulen, Wohnkosten und Erreichbarkeit beeinflussen Wanderungen, während Altersstrukturen die natürliche Bilanz mitprägen. Landeswerte verdecken lokale Unterschiede. Vergleiche deshalb den gleichen Datenstand und passende Regionalgrenzen. Ein Szenario kann Schulen, Wohnraum und Pflegeplanung unterstützen, muss aber regelmäßig an neuen Daten geprüft werden.",
    ],
    takeaway:
      "Szenarien sind Wenn-dann-Aussagen; eine gute Darstellung nennt Annahmen und räumliche Unterschiede.",
    sourceIds: ["destatis", "bayern-projektion", "un-population"],
    quiz: check(
      "Wie ist eine Bevölkerungsvorausberechnung zu lesen?",
      "Als Entwicklung unter ausdrücklich genannten Annahmen",
      [
        "Als unveränderliche Zahl unabhängig von Wanderungen",
        "Als Beweis, dass jede Gemeinde gleich wachsen wird",
      ],
      "Annahmen über Geburten, Lebenserwartung und Wanderung wirken auf das Ergebnis; Regionen können sich unterschiedlich entwickeln.",
    ),
    workshop: classify(
      "Szenario oder Gewissheitsbehauptung?",
      ["Angemessene Aussage", "Unzulässige Verallgemeinerung"],
      [
        [
          "Unter dieser Wanderungsannahme ergibt sich dieser Verlauf.",
          0,
          "Annahme und Ergebnis werden verknüpft.",
        ],
        [
          "Ein bayerischer Landeswert gilt unverändert für jede Gemeinde.",
          1,
          "Regionale Altersstruktur und Wanderung können stark abweichen.",
        ],
        [
          "Die Planung sollte mehrere Verläufe und neue Daten berücksichtigen.",
          0,
          "Das behandelt Unsicherheit als Teil der Entscheidung.",
        ],
      ],
      "Mehrere Verläufe sind kein Fehler, sondern machen den Einfluss von Annahmen sichtbar.",
    ),
    tasks: tasks(
      "Erkläre, weshalb eine Gemeinde bei der Schulplanung mehrere Bevölkerungsszenarien nutzen sollte.",
      "Geburten und Zu- oder Fortzüge können sich anders entwickeln als angenommen. Für Schulen sind besonders die künftigen Kinderjahrgänge und lokale Wohnbauvorhaben wichtig. Mehrere Szenarien zeigen mögliche Bedarfe; die Gemeinde kann ihre Planung mit neuen Daten überprüfen und anpassen.",
      [
        "Ich nenne veränderliche Annahmen.",
        "Ich verbinde sie mit der lokalen Altersgruppe.",
        "Ich erläutere den Nutzen mehrerer Verläufe.",
      ],
      "Eine Weltprojektion und eine bayerische Regionalprojektion scheinen sich zu widersprechen. Wie gehst du vor?",
      "Ich prüfe zunächst Zeiträume, räumliche Ebenen und Annahmen. Eine wachsende Weltbevölkerung schließt eine schrumpfende Einzelregion nicht aus. Danach vergleiche ich Altersstruktur und Wanderung, statt einen globalen Trend als Regel für jede Gemeinde zu behandeln.",
      [
        "Ich vergleiche Definitionen und Zeiträume.",
        "Ich unterscheide globale und regionale Ebenen.",
        "Ich prüfe Altersstruktur und Wanderung.",
      ],
    ),
  },
  {
    id: "geo-migration",
    lb: 5,
    title: "Migration erklären, Darstellungen prüfen",
    period: "Formen · Motive · Folgen",
    intro:
      "Menschen wechseln ihren Wohnort aus vielen Gründen. Kategorien helfen beim Ordnen, ersetzen aber keine Sicht auf die einzelnen Lebenslagen.",
    paragraphs: [
      "Binnenmigration erfolgt innerhalb eines Landes, internationale Migration über Staatsgrenzen. Wanderungen können etwa mit Arbeit, Ausbildung, Familie, Verfolgung, Krieg oder veränderten Umweltbedingungen zusammenhängen. Freiwillige und erzwungene Entscheidungen lassen sich in der Wirklichkeit nicht immer scharf trennen. Ein Motiv erklärt nicht automatisch einen bestimmten rechtlichen Status.",
      "Zuwanderung und Abwanderung verändern Herkunfts- und Zielräume: Arbeitskräfte, Altersstruktur, Rücküberweisungen, Wohnraumbedarf und familiäre Netze können betroffen sein. Folgen sind nach Gruppe, Ort und Zeitraum verschieden. Prüfe bei Mediengrafiken Bestand oder jährlichen Fluss, Zu- oder Nettowanderung, Bezugsjahr und Datenquelle. Menschen allein als Kosten oder Arbeitskräfte darzustellen verengt die Perspektive.",
    ],
    takeaway:
      "Eine fachliche Analyse unterscheidet Kategorien und Datenbegriffe und berücksichtigt die Perspektiven der Betroffenen.",
    sourceIds: ["iom", "destatis-migration", "unhcr"],
    quiz: check(
      "Was unterscheidet Nettowanderung von Zuwanderung?",
      "Nettowanderung zieht Fortzüge von Zuzügen ab",
      [
        "Nettowanderung zählt ausschließlich Geburten",
        "Zuwanderung und Nettowanderung sind immer gleich",
      ],
      "Der Saldo kann deutlich kleiner sein als die Zahl der Zuzüge und kann auch negativ werden.",
    ),
    workshop: classify(
      "Daten und Perspektiven",
      ["Binnenwanderung", "Internationale Wanderung", "Begrifflich unzureichende Angabe"],
      [
        [
          "Ein Haushalt zieht von Nürnberg nach München.",
          0,
          "Der Wohnortwechsel bleibt innerhalb Deutschlands.",
        ],
        [
          "Eine Person verlegt ihren Wohnort von einem Staat in einen anderen.",
          1,
          "Eine Staatsgrenze wird überschritten.",
        ],
        [
          "Eine Grafik nennt nur viele Menschen ohne Jahr und Bezugsraum.",
          2,
          "Ohne Definition lässt sich die Aussage nicht belastbar vergleichen.",
        ],
      ],
      "Eine räumliche Kategorie sagt noch nichts Vollständiges über Motive, Dauer oder Rechte aus.",
    ),
    tasks: tasks(
      "Beschreibe je eine mögliche Folge von Migration im Herkunfts- und Zielraum und begrenze deine Aussage.",
      "Im Herkunftsraum können Rücküberweisungen Einkommen stützen, zugleich können Arbeitskräfte oder Familienmitglieder fehlen. Im Zielraum können Beschäftigung und kulturelle Beziehungen wachsen, während Wohnraum und Angebote angepasst werden müssen. Die Folgen hängen von Personen, Bedingungen und Zeitraum ab und sind nicht überall gleich.",
      [
        "Ich betrachte Herkunft und Ziel.",
        "Ich erläutere unterschiedliche mögliche Folgen.",
        "Ich vermeide eine Aussage über alle Menschen.",
      ],
      "Zwei Nachrichten nennen unterschiedliche Migrationszahlen. Welche vier Fragen klärst du zuerst?",
      "Ich prüfe Bezugsraum und Jahr sowie die Frage, ob ein Bestand oder jährlicher Fluss gemeint ist. Außerdem unterscheide ich Zuzüge, Fortzüge und Nettowanderung und prüfe die Datenquelle. Erst bei gleichen Definitionen kann ich die Werte sinnvoll vergleichen.",
      [
        "Ich prüfe Raum und Zeit.",
        "Ich unterscheide Bestand, Fluss und Saldo.",
        "Ich beziehe Definition und Quelle ein.",
      ],
    ),
  },
  {
    id: "geo-bevoelkerungspolitik",
    lb: 5,
    title: "Mit dem demographischen Wandel umgehen",
    period: "Deutschland und Japan · Politik bewerten",
    intro:
      "Bevölkerungspolitik berührt Familien, Arbeit, Pflege und Teilhabe. Maßnahmen müssen auch an Freiheit und Gerechtigkeit gemessen werden.",
    paragraphs: [
      "Deutschland diskutiert unter anderem die Vereinbarkeit von Familie und Beruf, Bildung, Zuwanderung, längere Erwerbsbeteiligung und eine altersgerechte Infrastruktur. Eine Maßnahme wirkt nicht mechanisch auf eine Bevölkerungszahl: Bezahlbarer Wohnraum, verlässliche Betreuung und persönliche Lebensentwürfe greifen ineinander. Politische Ziele und nachgewiesene Wirkungen sind zu unterscheiden.",
      "Japan hat ebenfalls einen hohen Anteil älterer Menschen. Der englische Regierungsbericht zur alternden Gesellschaft 2025 beschreibt unter anderem Beschäftigung, Gesundheit, soziale Beteiligung, Lernen und Wohnumfeld. Vergleiche Ziele und Bedingungen mit Deutschland, ohne die Gesellschaften gleichzusetzen. Eine Bewertung berücksichtigt Selbstbestimmung, Teilhabe, Verteilung und langfristige Tragfähigkeit statt Menschen nur als statistische Ressource zu betrachten.",
    ],
    takeaway:
      "Eine Maßnahme ist nicht schon durch ein demographisches Ziel gerechtfertigt; Rechte, Wirkung und Verteilung gehören zur Prüfung.",
    sourceIds: ["japan", "destatis", "familie"],
    quiz: check(
      "Welcher Maßstab gehört zur Bewertung bevölkerungspolitischer Maßnahmen?",
      "Selbstbestimmung, Teilhabe und belegbare Wirkung",
      [
        "Ausschließlich eine möglichst hohe Bevölkerungszahl",
        "Der Verzicht auf jede Betroffenenperspektive",
      ],
      "Ein statistisches Ziel allein rechtfertigt keine Maßnahme. Rechte und gesellschaftliche Folgen sind zentrale Kriterien.",
    ),
    workshop: classify(
      "Ziel und Wirkung unterscheiden",
      ["Politisches Ziel", "Möglicher Wirkungsnachweis", "Unbelegte Garantie"],
      [
        [
          "Betreuung soll die Vereinbarkeit von Familie und Beruf verbessern.",
          0,
          "Die Formulierung nennt eine Absicht.",
        ],
        [
          "Vergleichbare Daten zeigen, wer Angebote nutzt und wie sich Teilhabe verändert.",
          1,
          "Geeignete Daten können Wirkungen prüfen, mit Grenzen der Ursachenzuordnung.",
        ],
        [
          "Eine einzelne Zahlung verdoppelt in jedem Land sicher die Geburtenzahl.",
          2,
          "Eine solche mechanische Garantie berücksichtigt keine Lebensbedingungen.",
        ],
      ],
      "Ein Vergleich zwischen Staaten braucht Kontext und darf aus einem zeitlichen Zusammentreffen keine sichere Ursache ableiten.",
    ),
    tasks: tasks(
      "Vergleiche eine Herausforderung alternder Gesellschaften in Deutschland und Japan und bewerte eine mögliche Reaktion.",
      "In beiden Ländern können steigende Anteile älterer Menschen Angebote für Gesundheit, Wohnen und Teilhabe verändern. Altersgerechte, erreichbare Infrastruktur kann Selbstständigkeit fördern. Ich prüfe Finanzierung, Zugang und unterschiedliche regionale Bedingungen; die gemeinsame Herausforderung macht die Länder nicht in allen Punkten gleich.",
      [
        "Ich nenne eine gemeinsame Herausforderung.",
        "Ich erkläre eine passende Reaktion.",
        "Ich bewerte Zugang und Rahmenbedingungen.",
      ],
      "Eine Regierung will nur die Geburtenzahl als Erfolgsmaß ihrer Familienpolitik verwenden. Welchen Maßstab ergänzt du?",
      "Ich ergänze die tatsächliche Selbstbestimmung, Vereinbarkeit, Armutsrisiken und die Verteilung von Sorgearbeit. Die Geburtenzahl hängt von vielen Faktoren ab und zeigt allein weder Lebensqualität noch einen eindeutigen Politikeffekt. Eine gute Prüfung bezieht die Perspektiven der betroffenen Menschen ein.",
      [
        "Ich ergänze Rechte oder Lebensbedingungen.",
        "Ich begrenze die Aussage einer Einzelzahl.",
        "Ich beziehe Betroffenenperspektiven ein.",
      ],
    ),
  },
];
