import type { Lesson } from "../model/types";
import { check, classify, tasks } from "./helpers";

export const cities: Lesson[] = [
  {
    id: "geo-staedtenetz",
    lb: 4,
    title: "Städte auf verschiedenen Karten",
    period: "Verteilung · Maßstab · Stadtnetz",
    intro:
      "Ein Punkt auf der Weltkarte kann auf einer Stadtkarte ein riesiges Netz aus Quartieren, Wegen und Funktionen sein.",
    paragraphs: [
      "Städte sind räumlich ungleich verteilt. Küsten, Flusstäler, Rohstoffstandorte, Verkehrswege und historische Entscheidungen können zur Konzentration beitragen; kein einzelner Faktor erklärt alle Städte. Ein Stadtnetz beschreibt auch Verbindungen und Beziehungen zwischen Städten. Einwohnerzahl und Bedeutung als Verkehrsknoten oder Verwaltungszentrum sind verschiedene Merkmale.",
      "Vergleiche eine Weltkarte, eine Deutschlandkarte und eine Stadtregion: Auf jeder Ebene treten andere Muster hervor. Ein Kartensymbol kann die Gemeinde, das zusammenhängend bebaute Gebiet oder einen größeren Verflechtungsraum meinen. Prüfe Definition und Jahr, bevor du Größen vergleichst. Verwaltungslinien zeigen nicht automatisch, wo Pendelwege oder die Bebauung enden.",
    ],
    takeaway:
      "Stadtvergleiche brauchen denselben räumlichen Zuschnitt und dieselbe Datengrundlage.",
    sourceIds: ["inkar", "un-cities"],
    quiz: check(
      "Warum können zwei Angaben zur Einwohnerzahl derselben Stadt verschieden sein?",
      "Sie können unterschiedliche räumliche Abgrenzungen verwenden",
      [
        "Eine Stadt besitzt grundsätzlich keine messbare Bevölkerung",
        "Jede Grenze folgt zwingend dem letzten bebauten Haus",
      ],
      "Gemeinde, zusammenhängendes Siedlungsgebiet und Stadtregion sind verschiedene Bezugsräume.",
    ),
    workshop: classify(
      "Welche Karte passt zur Frage?",
      ["Weltkarte", "Karte der Stadtregion", "Quartierskarte"],
      [
        [
          "Wo liegen große Städtekonzentrationen auf den Kontinenten?",
          0,
          "Hier ist die globale Verteilung entscheidend.",
        ],
        [
          "Welche Umlandorte sind durch Pendelwege mit München verbunden?",
          1,
          "Der Verflechtungsraum geht über die Kernstadt hinaus.",
        ],
        [
          "Wo fehlen sichere Fußwege zu einer Haltestelle?",
          2,
          "Die kleinräumige Frage braucht detaillierte Straßen- und Wegeangaben.",
        ],
      ],
      "Ein passender Maßstab entscheidet mit darüber, welche Aussage möglich ist.",
    ),
    tasks: tasks(
      "Erkläre, warum du für die Einwohnerzahl und die Pendelverflechtung einer Stadt unterschiedliche Karten brauchst.",
      "Die Einwohnerzahl einer Gemeinde bezieht sich auf eine administrative Grenze. Pendelverflechtungen reichen häufig darüber hinaus und verbinden Kernstadt und Umland. Ich brauche deshalb den jeweiligen Zuschnitt, den Datenstand und einen Maßstab, der die untersuchten Beziehungen erkennen lässt.",
      [
        "Ich unterscheide Gemeinde und Verflechtungsraum.",
        "Ich beziehe die Fragestellung auf die Karte.",
        "Ich nenne Datum oder Definition der Daten.",
      ],
      "Eine Rangliste vergleicht europäische Gemeinden mit außereuropäischen Ballungsräumen. Wie beurteilst du sie?",
      "Die räumlichen Einheiten sind nicht direkt vergleichbar. Ein Ballungsraum kann viele Gemeinden enthalten und dadurch größer wirken. Ich suche vergleichbare Abgrenzungen und Jahre und prüfe, ob die Rangliste Bevölkerung, Wirtschaft oder eine andere Eigenschaft ordnet.",
      [
        "Ich erkenne die ungleichen Bezugsräume.",
        "Ich fordere vergleichbare Definitionen.",
        "Ich prüfe das dargestellte Merkmal.",
      ],
    ),
  },
  {
    id: "geo-stadtfunktionen",
    lb: 4,
    title: "München, Paris und Mumbai vergleichen",
    period: "Deutschland · Europa · Welt",
    intro:
      "Städte erfüllen mehrere Funktionen gleichzeitig. Ein Vergleich soll Unterschiede erklären, ohne eine Stadt auf ein Klischee zu reduzieren.",
    paragraphs: [
      "München verbindet unter anderem Verwaltung als bayerische Landeshauptstadt, Hochschulen und Forschung, Dienstleistungen und industrielle Arbeitsplätze. Paris ist französische Hauptstadt und ein bedeutender politischer, kultureller und wirtschaftlicher Knoten. Mumbai ist eine indische Hafen- und Wirtschaftsmetropole mit Finanzwirtschaft, Industrie, Dienstleistungen und kultureller Produktion. Diese Beispiele sind keine vollständigen Funktionslisten.",
      "Funktionen benötigen Raum und Infrastruktur: Wohnen, Arbeiten, Versorgung, Bildung, Freizeit und Verkehr können sich ergänzen oder um Flächen konkurrieren. In Mumbai thematisiert UN-Habitat etwa die Verbindung von Wohnungsversorgung, informellen Siedlungen und Verkehr. Das beschreibt ungleiche Lebensbedingungen, nicht die Lebensweise aller Menschen dort. Prüfe kommunale Pläne auch als interessengeleitete Zukunftsvorstellungen, nicht als schon erreichte Wirklichkeit.",
    ],
    takeaway:
      "Eine Stadt hat viele Funktionen und unterschiedliche Lebenslagen; ein Vergleich braucht konkrete Kriterien.",
    sourceIds: ["muenchen-step", "paris", "mumbai"],
    quiz: check(
      "Welche Angabe beschreibt eine Stadtfunktion?",
      "Hochschulstandort mit Bildungsangeboten",
      ["Ausschließlich der Breitengrad des Rathauses", "Nur die Farbe eines Kartensymbols"],
      "Eine Funktion beschreibt eine Aufgabe oder Leistung für Menschen und das Umland, nicht nur eine geometrische Lage.",
    ),
    workshop: classify(
      "Funktionen im Stadtalltag",
      ["Wohnen und Versorgung", "Bildung und Verwaltung", "Wirtschaft und Verkehr"],
      [
        ["Wohnquartier mit erreichbaren Läden", 0, "Wohnen braucht auch alltägliche Versorgung."],
        [
          "Universität und Landesbehörden",
          1,
          "Bildung und politische Verwaltung wirken über das Quartier hinaus.",
        ],
        [
          "Hafen und verknüpfte Logistikbetriebe",
          2,
          "Warenverkehr und Arbeitsplätze verbinden die Stadt mit weiteren Räumen.",
        ],
      ],
      "Ein Ort kann mehrere Funktionen verbinden; die Aussagen setzen jeweils einen Schwerpunkt.",
    ),
    tasks: tasks(
      "Vergleiche München mit Paris oder Mumbai anhand zweier Stadtfunktionen und einer räumlichen Herausforderung.",
      "München und Paris verbinden politische Verwaltung mit Dienstleistungen, Forschung und Kultur. Beide brauchen Wohnraum und gute Verkehrsverbindungen, doch Raumgröße und räumliche Struktur unterscheiden sich. Für eine genaue Aussage nutze ich vergleichbare Daten und kommunale beziehungsweise fachliche Quellen statt bloßer Eindrücke.",
      [
        "Ich nenne zwei Städte und Funktionen.",
        "Ich erläutere eine räumliche Herausforderung.",
        "Ich vermeide eine Verallgemeinerung über alle Menschen.",
      ],
      "Eine Werbebroschüre nennt eine Stadt modern und zeigt nur ein Finanzviertel. Was fehlt für einen geographischen Vergleich?",
      "Ein Finanzviertel zeigt nur einen Ausschnitt. Ich brauche auch Informationen zu Wohnen, Versorgung, Arbeit, Verkehr und unterschiedlichen Quartieren sowie den Zweck der Broschüre. Mit zusätzlichen Karten und Quellen prüfe ich, wer von der Entwicklung profitiert und wer Belastungen trägt.",
      [
        "Ich benenne die selektive Perspektive.",
        "Ich ergänze andere Funktionen und Räume.",
        "Ich fordere geeignete zusätzliche Quellen.",
      ],
    ),
  },
  {
    id: "geo-stadtwandel",
    lb: 4,
    title: "Wachsen, ins Umland ziehen, verdrängt werden",
    period: "Urbanisierung · Suburbanisierung · Gentrifizierung",
    intro:
      "Mehr Stadtbevölkerung, Wachstum im Umland und Aufwertung einzelner Viertel sind unterschiedliche räumliche Prozesse.",
    paragraphs: [
      "Urbanisierung beschreibt unter anderem die Zunahme städtischer Bevölkerung beziehungsweise ihres Anteils und die Ausbreitung städtischer Lebensformen. Suburbanisierung verlagert Bevölkerung oder Nutzungen aus der Kernstadt ins Umland. Im Münchner Raum hängen Siedlungsentwicklung und Pendelverkehr eng zusammen. Gentrifizierung meint die Aufwertung eines Quartiers mit sozialem Wandel; steigende Wohnkosten können einkommensschwächere Haushalte verdrängen.",
      "Am außereuropäischen Beispiel Mumbai lassen sich Zuwanderung, Wachstum und Konflikte um Wohnraum und Infrastruktur untersuchen. UN-Habitat beschreibt Sanierungs- und Umsiedlungsansätze; eine neue Wohnung kann mit längeren Wegen zu Arbeit und sozialen Netzen verbunden sein. Urbanisierung ist nicht gleichbedeutend mit informeller Siedlung, und eine Aufwertung nützt nicht automatisch allen bisherigen Bewohnerinnen und Bewohnern.",
    ],
    takeaway: "Benenne den räumlichen Prozess und prüfe seine Folgen für verschiedene Gruppen.",
    sourceIds: ["muenchen-region", "muenchen-wohnen", "mumbai", "un-cities"],
    quiz: check(
      "Wie heißt die Verlagerung von Bevölkerung oder Nutzungen aus der Kernstadt ins Umland?",
      "Suburbanisierung",
      ["Atmosphärische Konvektion", "Glaziale Sedimentation"],
      "Suburbanisierung beschreibt einen Stadt-Umland-Prozess. Sie ist von allgemeiner Urbanisierung zu unterscheiden.",
    ),
    workshop: classify(
      "Drei Prozesse unterscheiden",
      ["Urbanisierung", "Suburbanisierung", "Gentrifizierung"],
      [
        [
          "Der Anteil der Stadtbevölkerung eines Landes nimmt zu.",
          0,
          "Es geht um das Verhältnis städtischer zur gesamten Bevölkerung.",
        ],
        [
          "Haushalte ziehen aus der Kernstadt in umliegende Gemeinden.",
          1,
          "Hier verändert sich die Verteilung innerhalb der Stadtregion.",
        ],
        [
          "Aufwertung und höhere Mieten verändern die soziale Zusammensetzung eines Viertels.",
          2,
          "Die sozialen Folgen einschließlich möglicher Verdrängung gehören in die Untersuchung.",
        ],
      ],
      "Die Prozesse können gleichzeitig stattfinden, beschreiben aber verschiedene Maßstäbe und Veränderungen.",
    ),
    tasks: tasks(
      "Unterscheide Suburbanisierung und Gentrifizierung und nenne jeweils eine mögliche Folge.",
      "Suburbanisierung verlagert Nutzungen oder Bevölkerung von der Kernstadt ins Umland und kann längere Pendelwege verursachen. Gentrifizierung betrifft die Aufwertung und soziale Veränderung eines Quartiers; steigende Wohnkosten können bisherige Haushalte verdrängen. Beide Prozesse verändern die Stadtregion, aber auf unterschiedliche Weise.",
      [
        "Ich definiere beide Prozesse.",
        "Ich nenne je eine mögliche Folge.",
        "Ich unterscheide die räumlichen Ebenen.",
      ],
      "Warum kann eine neue Wohnung nach einer Umsiedlung in Mumbai trotzdem Nachteile haben?",
      "Eine bessere bauliche Ausstattung ist ein möglicher Vorteil. Liegt die Wohnung aber weit von Arbeit, Schule oder sozialen Netzen entfernt, können Zeit und Fahrtkosten steigen. Ich bewerte deshalb Wohnqualität zusammen mit Erreichbarkeit, Bezahlbarkeit und der Perspektive der Betroffenen.",
      [
        "Ich erkenne einen möglichen Vorteil an.",
        "Ich erkläre einen räumlichen Nachteil.",
        "Ich beziehe Betroffenenperspektiven ein.",
      ],
    ),
  },
  {
    id: "geo-nachhaltige-stadt",
    lb: 4,
    title: "Eine lebenswerte Stadt aushandeln",
    period: "Wohnen · Mobilität · Grünflächen",
    model: "city",
    intro:
      "Mehr Wohnungen, kurze Wege und grüne Freiräume sind berechtigte Ziele. Auf begrenzter Fläche passen sie nicht immer konfliktfrei zusammen.",
    paragraphs: [
      "Nachhaltige Stadtentwicklung verbindet ökologische Tragfähigkeit, wirtschaftliche Möglichkeiten und soziale Gerechtigkeit. Kompakte, gemischte Quartiere können Wege verkürzen und Infrastruktur besser nutzen. Ohne genügend Freiraum, bezahlbaren Wohnraum und Beteiligung kann Verdichtung aber neue Belastungen schaffen. Stadt und Umland müssen Verkehrs- und Flächenfragen gemeinsam betrachten.",
      "Im Münchner Stadtentwicklungsplan werden unter anderem Freiraum, Mobilität, Wohnen und Wirtschaft zusammengeführt. Ein Plan ist eine Zielsetzung, keine Bestätigung, dass schon alles gelungen ist. Das Quartiersmodell hier zeigt drei frei erfundene Flächenpläne mit gleichen 100 Hektar. Es berechnet nur Flächen und angenommene Wohneinheiten; es bewertet keine reale Stadt und bestimmt kein objektiv bestes Quartier.",
    ],
    takeaway:
      "Ein nachhaltiges Urteil legt Kriterien und Zielkonflikte offen und berücksichtigt betroffene Gruppen.",
    sourceIds: ["muenchen-step", "un-planning"],
    quiz: check(
      "Was gehört zu einer begründeten Entscheidung über Verdichtung?",
      "Wohnraum, Erreichbarkeit und Freiraum gemeinsam abwägen",
      ["Nur die Zahl neuer Gebäude zählen", "Alle betroffenen Gruppen grundsätzlich ausschließen"],
      "Fläche erfüllt mehrere Funktionen. Die Entscheidung muss Nutzen, Belastungen und Verteilung berücksichtigen.",
    ),
    workshop: classify(
      "Interessen sichtbar machen",
      ["Ökologisches Anliegen", "Soziales Anliegen", "Wirtschaftliches Anliegen"],
      [
        [
          "Unversiegelte Böden und vernetzte Grünräume erhalten",
          0,
          "Das betrifft unter anderem Wasserhaushalt, Lebensräume und Kühlung.",
        ],
        [
          "Bezahlbaren Wohnraum und barrierefreie Wege sichern",
          1,
          "Zugang und Teilhabe stehen im Vordergrund.",
        ],
        [
          "Investitionen und Betriebskosten langfristig tragen können",
          2,
          "Finanzierung und wirtschaftliche Tragfähigkeit müssen ebenfalls geprüft werden.",
        ],
      ],
      "Die Anliegen überschneiden sich. Ihre Zuordnung dient dem Vergleich, nicht einer starren Trennung.",
    ),
    tasks: tasks(
      "Begründe zwei Ziele für ein neues Quartier und beschreibe einen Zielkonflikt.",
      "Bezahlbarer Wohnraum und gute öffentliche Verkehrsverbindungen können Teilhabe und kurze Wege fördern. Zugleich müssen unversiegelte Flächen und Grün für Kühlung und Rückhalt erhalten bleiben. Wenn mehr Gebäude auf derselben Fläche entstehen, braucht es daher eine begründete Abwägung von Dichte, Freiraum und Infrastruktur.",
      [
        "Ich nenne zwei begründete Ziele.",
        "Ich erkläre einen Flächenkonflikt.",
        "Ich berücksichtige die Verteilung von Nutzen und Lasten.",
      ],
      "Ein Modellplan bietet mehr Wohnungen, aber weniger Grün. Welche weiteren Informationen brauchst du vor einer realen Entscheidung?",
      "Ich brauche Angaben zu Erschließung, Kosten, Wohnungsgrößen und Bezahlbarkeit, vorhandenen Grünräumen, Boden und Hitze sowie den Bedürfnissen der Betroffenen. Die Modellzahlen zeigen nur einen Ausschnitt. Ich vergleiche Alternativen und begründe, welche Kriterien ich stärker gewichte.",
      [
        "Ich benenne Grenzen des Modells.",
        "Ich fordere räumliche und soziale Daten.",
        "Ich lege meine Gewichtung offen.",
      ],
    ),
  },
];
