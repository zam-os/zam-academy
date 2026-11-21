import { caseLab } from "../lab/case-lab";
import { hypertextGraph, webRequest } from "../lab/diagrams";
import type { Stage } from "../model/types";
import { cc, drills, explain, lesson } from "./helpers";

const id = "hypertext";
const module = "2.1";

const graphRule =
  "Ein Knoten steht für eine Seite. Ein gerichteter Pfeil zeigt vom Ausgangsdokument zur Zieladresse des Verweises.";
const editorRule =
  "Ein Verweis braucht ein gültiges Ziel und einen verständlichen Linktext. Prüfe das Nutzungsrecht und nenne die Quelle.";
const sourceRule =
  "Eine geeignete Quelle beantwortet deine Frage und legt offen, woher ihre Aussagen stammen.";
const webRule = "Der Client fragt beim Server ein Dokument an. Router vermitteln Daten zwischen Netzen.";

export const STAGE_HYPERTEXT: Stage = {
  id,
  module,
  stageNumber: 1,
  icon: "🗺️",
  accent: "#1d58c9",
  title: "Hypertext und Internet",
  subtitle: "Webseiten verknüpfen, Quellen prüfen und eine Anfrage durchs Netz verfolgen.",
  badgeTitle: "Webseiten und Wege",
  lehrplanLabel: "NT7 2.1 · ca. 8 Std.",
  lessons: [
    lesson(id, module, 1, {
      id: "inf7-hypertext-graph",
      title: "Hypertext als Graph",
      subtitle: "Knoten, gerichtete Kanten und die Klasse VERWEIS",
      why: "An einem Graphen erkennst du, wie Besucher durch ein Schulwiki finden.",
      html: explain(
        [
          "In einem <strong>Hypertext</strong> wählst du deinen Leseweg über Verweise. Das <strong>Hypertextdokument</strong> ist eine einzelne Seite; es kann mehrere Verweise enthalten.",
          "Die aus Klasse 6 bekannte Objektmodellierung hilft: Ein konkreter Verweis ist ein Objekt der Klasse <strong>VERWEIS</strong>. Er hat z. B. die Attribute Linktext und Zieladresse. Im gerichteten Graphen ist die Seite ein Knoten und jeder Verweis eine Kante mit Pfeilrichtung.",
          "Ein Ordnerbaum aus Klasse 6 hat eine hierarchische Ordnung. Ein Webgraph kann Querverbindungen, Rückwege und Kreise besitzen. Die Lage zweier Knoten auf dem Papier verrät nichts über ihre Verbindung.",
        ],
        "Auf der Startseite steht der Link „Bücher ausleihen“ mit Zieladresse <code>/buecherei</code>. Der Pfeil zeigt von Startseite zu Bücherei. Für den Rückweg braucht die Bücherei einen eigenen Verweis.",
        graphRule,
      ),
      rule: graphRule,
      terms: [
        ["Graph", "Knoten und Kanten", "Für einen Verweis zählt die Richtung."],
        [
          "VERWEIS",
          "Klasse mit Attribut Zieladresse",
          "Der Linktext benennt das Ziel für Leserinnen und Leser.",
        ],
      ],
      quiz: [
        "Startseite → Termine ist der einzige Pfeil. Was gilt?",
        "Von Startseite führt ein Verweis zu Termine.",
        "Von Termine führt ein Verweis zur Startseite.",
        "Beide Seiten verweisen aufeinander.",
        "Der Pfeil beginnt bei Startseite und endet bei Termine. Für einen Rückweg ist ein zweiter Pfeil nötig.",
      ],
      lab: hypertextGraph,
      exercises: drills(
        [
          cc(
            "Bei Start → Mensa klickst du auf den Link. Wo landest du?",
            "Mensa",
            ["Start", "Sekretariat"],
            "Die Pfeilspitze zeigt auf Mensa.",
            "Lies den Pfeil in seiner Richtung.",
          ),
          cc(
            "Start → Mensa, Mensa → Speiseplan. Was ergänzt du, damit der Rückweg direkt von Speiseplan zu Start führt?",
            "Speiseplan → Start",
            ["Start → Speiseplan", "Mensa → Start"],
            "Der Rückweg muss bei Speiseplan beginnen und bei Start enden.",
            "Suche zunächst die Ausgangsseite.",
          ),
        ],
        [
          cc(
            "Welches Attribut ändert das Ziel des Links „Kontakt“?",
            "Zieladresse",
            ["Linktext", "Seitentitel"],
            "Die Zieladresse steuert, wohin der Link führt.",
            "Trenne die Aufschrift vom Ziel.",
          ),
          cc(
            "Der Link „Kontakt“ öffnet fälschlich die AG-Liste. Welche Änderung behebt den Fehler und behält die Beschriftung?",
            "Die Zieladresse durch die Kontaktadresse ersetzen.",
            ["Den Linktext in „AGs“ ändern.", "Die AG-Liste in „Kontakt“ umbenennen."],
            "Der neue Zielwert lenkt dasselbe Verweisobjekt auf die richtige Seite.",
            "Frage, welches Attribut die Navigation steuert.",
          ),
        ],
        [
          cc(
            "Wie viele Verweise hat Start bei Start → Kontakt und Start → Mensa?",
            "Zwei",
            ["Einen", "Drei"],
            "Bei Start verlaufen zwei ausgehende Kanten.",
            "Zähle nur Pfeile, die bei Start beginnen.",
          ),
          cc(
            "Start → A, A → B, B → Start. Welche Eigenschaft zeigt das?",
            "Einen gerichteten Kreis",
            ["Drei Seiten ohne Verbindung", "Einen Ordnerbaum"],
            "Du erreichst nach drei Verweisen wieder den Ausgangspunkt.",
            "Folge den Pfeilen bis du nicht weiterkommst oder zum Start zurückkehrst.",
          ),
        ],
      ),
    }),
    lesson(id, module, 2, {
      id: "inf7-wiki-editor",
      title: "Ein Wiki bearbeiten",
      subtitle: "Verweise setzen, Nutzungsrechte klären und Quellen angeben",
      why: "Ein Schulwiki wird erst nutzbar, wenn Links funktionieren und übernommene Inhalte nachvollziehbar sind.",
      html: explain(
        [
          "In einem visuellen Editor (WYSIWYG, „What you see is what you get“) schreibst du im Formular oder direkt auf der Seite und siehst die Darstellung in der Vorschau. Setze zuerst einen klaren Titel und nutze als Linktext z. B. „Öffnungszeiten der Bücherei“.",
          "Prüfe bei fremden Fotos und Texten, ob und unter welchen Bedingungen du sie verwenden darfst. Eine Quellenangabe macht eine Übernahme nachvollziehbar. Sammle Name der Person oder Einrichtung, Titel, Fundstelle und bei Onlinequellen das Abrufdatum. Achte auch auf gegebenenfalls verlangte Lizenzangaben.",
          "Teste jeden Verweis aus der Perspektive eines Besuchers. Wenn du Seiten verschiebst, überprüfe die Verweisziele erneut. Im Editor unten kannst du drei Seiten beschriften, miteinander verlinken und speichern.",
        ],
        "Für eine selbst gezeichnete Karte schreibst du „Skizze: eigene Darstellung“. Für eine übernommene Abbildung prüfst du die Lizenz und notierst z. B. „Stadtbücherei, Grundriss des Lesesaals, Fundstelle im Katalog, abgerufen am 20. November 2026“ samt verlangter Lizenzangabe.",
        editorRule,
      ),
      rule: editorRule,
      terms: [
        [
          "WYSIWYG",
          "Anzeige während der Bearbeitung",
          "Vorschau und Verweisziel lassen sich direkt testen.",
        ],
        [
          "Quellenangabe",
          "Name · Titel · Fundstelle · Abrufdatum",
          "Lizenzbedingungen können weitere Angaben verlangen.",
        ],
      ],
      quiz: [
        "Ein Foto steht frei sichtbar im Netz. Was prüfst du vor der Übernahme?",
        "Die Nutzungsbedingungen und die nötige Quellenangabe.",
        "Ob ich den Dateinamen abkürzen kann.",
        "Ob ich per Rechtsklick speichern kann.",
        "Beim Herunterladen erfährst du noch nichts über die Erlaubnis zur Weiterverwendung.",
      ],
      lab: caseLab({
        kind: "wiki-review",
        title: "Drei Wiki-Seiten prüfen",
        intro:
          "Wähle die wichtigste Korrektur für jeden Fund. Setze anschließend eine eigene Seite im Editor um.",
        categories: ["Linktext verbessern", "Linkziel korrigieren", "Nutzung und Quelle prüfen"],
        cases: [
          {
            short: "„Hier“",
            text: "Der Link „Hier“ öffnet die Bücherei.",
            answer: 0,
            why: "„Bücherei“ verrät das Ziel.",
            hint: "Das gewünschte Ziel stimmt schon.",
          },
          {
            short: "Falsche Seite",
            text: "„Bücherei“ öffnet die AG-Seite.",
            answer: 1,
            why: "Die Zieladresse muss zur Bücherei führen.",
            hint: "Die Beschriftung ist bereits passend.",
          },
          {
            short: "Fremder Lageplan",
            text: "Ein Lageplan wurde aus einem Blog kopiert.",
            answer: 2,
            why: "Lizenz und Herkunft des Plans sind zu klären.",
            hint: "Es geht um fremdes Material.",
          },
        ],
        goals: [
          { text: "Erkenne den unklaren Linktext.", cases: [0] },
          { text: "Erkenne den Verweis mit falschem Ziel.", cases: [1] },
          { text: "Entscheide, was vor der Nutzung des Lageplans zu prüfen ist.", cases: [2] },
        ],
      }),
      exercises: drills(
        [
          cc(
            "Welcher Linktext hilft beim schnellen Lesen?",
            "Öffnungszeiten der Bücherei",
            ["Hier", "Weiter"],
            "Der Text verrät den erwarteten Inhalt.",
            "Stell dir den Link ohne seinen Absatz vor.",
          ),
          cc(
            "Zwei Links heißen „mehr“. Einer führt zur Mensa, einer zur Bücherei. Welche Änderung hilft?",
            "Jeden Link nach dem Inhalt seines Ziels benennen.",
            ["Beide Links in Großbuchstaben schreiben.", "Beide Linkziele zusammenlegen."],
            "Die Lesenden können beide Ziele schon vor dem Klick unterscheiden.",
            "Prüfe, ob der Link allein verständlich ist.",
          ),
        ],
        [
          cc(
            "Was gehört bei einer übernommenen Online-Grafik zur Quellenangabe?",
            "Name, Titel, Fundstelle und Abrufdatum",
            ["Nur die Bildgröße", "Nur der Name meines Wikis"],
            "So lässt sich nachvollziehen, woher die Grafik stammt.",
            "Gib einer anderen Person genug Angaben zum Wiederfinden.",
          ),
          cc(
            "Die Grafik darf mit Namens- und Lizenzangabe genutzt werden. Was gehört neben die Grafik?",
            "Quellenangabe mit Name und geforderter Lizenzangabe",
            ["Nur „im Internet gefunden“", "Nur der Dateiname"],
            "Damit lässt sich die Herkunft prüfen und die Bedingung wird erfüllt.",
            "Lies die Bedingungen der angegebenen Lizenz.",
          ),
        ],
        [
          cc(
            "Woran merkst du, ob dein Verweis funktioniert?",
            "Ich klicke ihn in der Vorschau an und prüfe die Zielseite.",
            ["Ich zähle die Buchstaben.", "Ich schaue nur auf den Linktext."],
            "Erst die Navigation prüft das gespeicherte Ziel.",
            "Teste aus Sicht eines Besuchers.",
          ),
          cc(
            "Nach dem Sortieren der Seiten führt der Weg zum AG-Plan ins Leere. Was ist der erste sinnvolle Test?",
            "Die gespeicherte Zieladresse mit dem aktuellen Speicherort vergleichen.",
            ["Den Titel des AG-Plans fett machen.", "Alle Quellen löschen."],
            "Ein verschobenes Dokument kann einen neuen Verweis benötigen.",
            "Untersuche zuerst den Weg zwischen den Seiten.",
          ),
        ],
      ),
    }),
    lesson(id, module, 3, {
      id: "inf7-quellen-pruefen",
      title: "Suchen und Quellen prüfen",
      subtitle: "Suchbegriffe verbessern und Belege vergleichen",
      why: "Mit einer klaren Suche findest du eher eine belastbare Antwort für deine Schulaufgabe.",
      html: explain(
        [
          "Beginne mit einer konkreten Frage. Verwende zwei oder drei Stichwörter, die den Ort, Zeitraum oder Gegenstand eingrenzen. Eine Suchmaschine zeigt passende Fundstellen; eine Enzyklopädie erklärt Begriffe und kann weiterführende Quellen nennen.",
          "Schau bei einer Fundstelle auf Autor oder Einrichtung, Datum, Belege und Zweck. Eine Werbeseite will verkaufen. Ein Blog kann eigene Erfahrungen beschreiben. Eine wissenschaftliche Veröffentlichung erklärt ihre Methoden und Belege. Prüfe auch dort, ob sie tatsächlich deine Frage beantwortet.",
          "Prüfe wichtige Behauptungen mit einer unabhängigen zweiten Quelle. Zwei Beiträge, die denselben ursprünglichen Beitrag abschreiben, liefern nur einen Beleg.",
        ],
        "Du suchst, wann die Bücherei in Rosenheim am Samstag öffnet. Suche „Stadtbibliothek Rosenheim Öffnungszeiten Samstag“. Vergleiche einen alten Blogbeitrag mit den aktuellen Angaben der Bibliothek.",
        sourceRule,
      ),
      rule: sourceRule,
      terms: [
        [
          "Suchmaschine",
          "Findet Fundstellen zu Stichwörtern",
          "Suchergebnisse können Werbung enthalten.",
        ],
        [
          "Unabhängiger Beleg",
          "Eigenständige Herkunft der Information",
          "Zwei Kopien zählen als derselbe Beleg.",
        ],
      ],
      quiz: [
        "Wie prüfst du eine überraschende Behauptung aus einem Blog?",
        "Ich vergleiche ihre Belege mit einer unabhängigen Quelle.",
        "Ich zähle die Likes.",
        "Ich nehme den ersten zweiten Treffer als Beweis.",
        "Ein Vergleich hilft, wenn die zweite Quelle eigene Informationen liefert und die Frage beantwortet.",
      ],
      lab: caseLab({
        kind: "source-desk",
        title: "Quellen für ein Schulreferat",
        intro: "Bestimme die Art jeder fiktiven Fundstelle und lies, wofür sie sich eignet.",
        categories: ["Werbeseite", "Blog", "Wissenschaftliche Veröffentlichung"],
        cases: [
          {
            short: "Jetzt kaufen",
            text: "Ein Fahrradshop lobt seine besten Helmlampen und bietet Rabatte an.",
            answer: 0,
            why: "Der Shop verfolgt ein Verkaufsziel.",
            hint: "Preis und Rabatt verraten den Zweck.",
          },
          {
            short: "Mein Erfahrungsbericht",
            text: "Eine Person beschreibt ihren nächtlichen Schulweg.",
            answer: 1,
            why: "Das ist eine persönliche Sicht.",
            hint: "Suche nach einer einzelnen Erfahrung.",
          },
          {
            short: "Messwerte mit Methode",
            text: "Ein Team nennt Versuchsaufbau, Stichprobe und Messdaten.",
            answer: 2,
            why: "Die Methoden und Daten sind nachvollziehbar.",
            hint: "Achte darauf, wie die Aussage untersucht wurde.",
          },
        ],
        goals: [
          { text: "Erkenne die Seite mit Verkaufsinteresse.", cases: [0] },
          { text: "Erkenne einen persönlichen Erfahrungsbericht.", cases: [1] },
          { text: "Finde die Fundstelle mit einer beschriebenen Untersuchungsmethode.", cases: [2] },
        ],
      }),
      exercises: drills(
        [
          cc(
            "Welche Suche passt zur Frage nach den Öffnungszeiten einer bestimmten Bücherei?",
            "Stadtbibliothek Rosenheim Öffnungszeiten",
            ["Was kann ich machen", "Bücher gut"],
            "Ort, Einrichtung und Information grenzen die Suche ein.",
            "Suche mit wenigen passenden Stichwörtern.",
          ),
          cc(
            "Du findest viele alte Einträge zu einem Busfahrplan. Wie grenzt du deine Suche ein?",
            "Linie, Ort und Gültigkeitsjahr ergänzen.",
            ["Nur „Bus“ eintippen.", "Nach dem hübschesten Vorschaubild suchen."],
            "Diese Merkmale unterscheiden passende aktuelle Fahrpläne.",
            "Überlege, was die unerwünschten Treffer gemeinsam haben.",
          ),
        ],
        [
          cc(
            "Welche Quelle klärt, ob der Schulausflug verschoben wurde?",
            "Die aktuelle Mitteilung der Schule",
            ["Ein Werbebanner", "Ein Blogbeitrag über den Ausflug vom Vorjahr"],
            "Die Schule kennt den Termin und hat die aktuelle Mitteilung veröffentlicht.",
            "Frage, wer die Änderung bekannt gibt.",
          ),
          cc(
            "Ein Shop verspricht doppelte Akkulaufzeit. Was ist ein geeigneter Vergleich?",
            "Ein unabhängiger Test unter ähnlichen Bedingungen",
            ["Ein zweiter Shop mit identischem Werbetext", "Die Anzahl der Sterne im Logo"],
            "Ein unabhängiger Test liefert Messdaten unter bekannten Bedingungen.",
            "Prüfe Belege und mögliche Verkaufsinteressen.",
          ),
        ],
        [
          cc(
            "Was sollte ein Sachtext für überprüfbare Aussagen nennen?",
            "Passende Belege und ihre Herkunft",
            ["Möglichst viele Emojis", "Eine sehr große Überschrift"],
            "Du musst nachvollziehen können, woher die Aussage stammt.",
            "Suche nach überprüfbarem Material.",
          ),
          cc(
            "Zwei Seiten nennen dieselbe Zahl und verlinken dieselbe Ursprungstabelle. Was folgt?",
            "Beide Berichte stützen sich auf denselben Beleg.",
            [
              "Die Zahl wurde zweimal unabhängig gemessen.",
              "Die Zahl ist falsch, weil sie zweimal vorkommt.",
            ],
            "Die Zahl darf trotzdem stimmen. Zum Gegencheck brauchst du einen eigenständigen Beleg.",
            "Verfolge beide Links bis zur ursprünglichen Herkunft.",
          ),
        ],
      ),
    }),
    lesson(id, module, 4, {
      id: "inf7-client-server",
      title: "Eine Webseite abrufen",
      subtitle: "Client, Router, Server, IP-Adresse und URL",
      why: "Du kannst erklären, was zwischen einem Klick und der angezeigten Webseite passiert.",
      html: explain(
        [
          "Das <strong>Internet</strong> verbindet viele Netze. Das <strong>World Wide Web</strong> ist einer der Dienste darin. Dein Browser ist beim Abrufen einer Seite der <strong>Client</strong>. Ein <strong>Server</strong> stellt Inhalte bereit und beantwortet Anfragen.",
          "Die URL benennt unter anderem den Dienst, den Rechnernamen und meist den Pfad eines Dokuments. Aus einem Rechnernamen kann die passende IP-Adresse ermittelt werden. Router vermitteln Daten zwischen Netzen und nutzen Ziel-IP-Adressen für die Weiterleitung.",
          "Der Client sendet eine Anfrage. Daten können auf beiden Wegen mehrere Router passieren. Die Antwort enthält das angefragte Dokument, falls es bereitsteht. Der Browser stellt es dar und kann dafür weitere Dateien anfragen.",
        ],
        "Bei <code>https://schule.example/wiki</code> bezeichnet <code>https</code> die Art des Webzugriffs, <code>schule.example</code> den Rechnernamen und <code>/wiki</code> den Pfad. Im Labor steht für den Server eine Beispiel-IP.",
        webRule,
      ),
      rule: webRule,
      terms: [
        ["URL", "Adresse einer Ressource", "Kann Dienst, Rechnernamen und Pfad enthalten."],
        [
          "IP-Adresse",
          "Adresse für die Weiterleitung im Netz",
          "Ein Router prüft, wohin er weiterleitet.",
        ],
        ["WWW", "Dienst für verlinkte Webdokumente", "Verwendet die Verbindung des Internets."],
      ],
      quiz: [
        "Wer zeigt das Dokument nach der Antwort an?",
        "Der Browser als Client",
        "Der Router",
        "Die IP-Adresse",
        "Der Browser erhält die Daten vom Server und stellt das Dokument für dich dar.",
      ],
      lab: webRequest,
      exercises: drills(
        [
          cc(
            "Welche Rolle übernimmt der Browser beim Abruf?",
            "Client",
            ["Router", "Server"],
            "Der Browser schickt die Anfrage und verarbeitet die Antwort.",
            "Wer möchte hier eine Seite haben?",
          ),
          cc(
            "Ein Gerät vermittelt die Anfrage auf dem Weg und speichert die Schulwebseite nicht. Welche Rolle hat es?",
            "Router",
            ["Client", "Webserver"],
            "Die Vermittlung zwischen Netzen gehört zum Router.",
            "Trenne das Weiterleiten vom Bereitstellen.",
          ),
        ],
        [
          cc(
            "Welcher Teil von https://schule.example/wiki ist der Pfad?",
            "/wiki",
            ["https", "schule.example"],
            "Der Pfad wählt das Dokument auf dem zuständigen Server.",
            "Suche den Teil nach dem Rechnernamen.",
          ),
          cc(
            "Eine Schule verschiebt die Seite von /wiki nach /wissen und behält den Rechnernamen. Was ändert sie an der URL?",
            "Den Pfad",
            ["Die Art des Webzugriffs", "Den Rechnernamen"],
            "Der neue Pfad führt zu einer Ressource am selben Rechnernamen.",
            "Vergleiche beide Adressbestandteile.",
          ),
        ],
        [
          cc(
            "Welche Reihenfolge passt zum Modell einer Anforderung?",
            "Client → Router → Server",
            ["Server → Client → Router", "Router → Server → Client"],
            "Der Client startet und der Router vermittelt zum Server.",
            "Beginne beim Gerät, auf dem du geklickt hast.",
          ),
          cc(
            "Anfrage erreicht Server, doch im Browser erscheint noch nichts. Welche Phase fehlt im Modell?",
            "Die Antwort vom Server muss den Client erreichen.",
            [
              "Ein Router muss die Seite neu schreiben.",
              "Der Browser muss selbst Server für diese Seite werden.",
            ],
            "Die Darstellung kann beginnen, wenn die Antwort ankommt.",
            "Unterscheide Hinweg und Rückweg.",
          ),
        ],
      ),
    }),
  ],
};
