import { cc, type DrillVariations } from "./helpers";

export const graphVariants: DrillVariations = [
  [
    [
      cc(
        "Der Graph zeigt Aula → Konzert. Wo beginnt der Link?",
        "Aula",
        ["Konzert", "Startseite"],
        "Die Ausgangsseite steht links vom Pfeil.",
        "Beginne am Pfeilschaft.",
      ),
      cc(
        "Verweise: Sporthalle → Halle 1 und Halle 1 → Hilfe. Welcher Link führt ab Halle 1 weiter?",
        "Halle 1 → Hilfe",
        ["Sporthalle → Halle 1", "Hilfe → Halle 1"],
        "Der zweite Pfeil hat Halle 1 als Ausgang.",
        "Suche einen Pfeil, der dort startet.",
      ),
    ],
    [
      cc(
        "Besucher landen auf einer Infoseite. Ihr einziger Link geht zur Startseite, von dort gibt es keinen Rückweg zur Info. Welche Kante ermöglicht den Rückweg?",
        "Startseite → Infoseite",
        ["Infoseite → Startseite", "Startseite → Startseite"],
        "Der Rückweg braucht die umgekehrte Richtung.",
        "Starte an der Stelle, von der du zurückwillst.",
      ),
      cc(
        "A führt zu B und C. B führt zu D. Von C kommst du bisher nirgendwohin. Was ergänzt einen Weg von C zu D über B?",
        "C → B",
        ["B → C", "D → C"],
        "Von C erreichst du B und folgst dem bestehenden Verweis zu D.",
        "Verknüpfe C mit dem Start des vorhandenen Weges.",
      ),
    ],
  ],
  [
    [
      cc(
        "Auf dem Verweis steht „Zum Stundenplan“. Welches Attribut ist dieser Wortlaut?",
        "Linktext",
        ["Zieladresse", "Seitentitel"],
        "Linktext ist die Aufschrift, die Lesende sehen.",
        "Beschriftung und Ziel können unterschiedlich sein.",
      ),
      cc(
        "Der Link auf der AG-Seite führt zu /termine. Was ist /termine im Objekt VERWEIS?",
        "Der Wert des Attributs Zieladresse",
        ["Der Name der Klasse", "Die Methode zum Speichern"],
        "Der Pfad ist der konkrete Wert, den dieses Objekt für das Ziel speichert.",
        "Suche nach einem konkreten Zielwert.",
      ),
    ],
    [
      cc(
        "Zwei Navigationselemente zeigen „Archiv“. Hinter einem öffnen sich Fotos, hinter dem anderen Protokolle. Was unterscheidet die beiden Objekte?",
        "Die Werte ihrer Zieladressen",
        ["Die identischen Aufschriften", "Die Klasse VERWEIS selbst"],
        "Die Zieladresse kann sich bei gleich lautenden Verweisen unterscheiden.",
        "Vergleiche, was du anklickst, mit dem, was sich öffnet.",
      ),
      cc(
        "Beim Schulwiki ändert sich /ag/musik zu /gruppen/musik. Auf der Startseite steht weiterhin „Musik-AG“. Was am Modell ändert sich?",
        "Der Wert der Zieladresse des vorhandenen Verweises",
        ["Der gesamte Knoten für die Startseite", "Der Name der Klasse VERWEIS"],
        "Du änderst ein Attribut des vorhandenen Verweisobjekts.",
        "Der Text bleibt gleich. Vergleiche die Ziele.",
      ),
    ],
  ],
];

export const editorVariants: DrillVariations = [
  [
    [
      cc(
        "Eine Wiki-Seite führt zu den geöffneten Hallenzeiten. Welche Aufschrift ist am klarsten?",
        "Öffnungszeiten der Sporthalle",
        ["Weitere Informationen", "Anklicken"],
        "Die Aufschrift kündigt den konkreten Inhalt an.",
        "Der Linktext muss ohne Umgebung verständlich bleiben.",
      ),
      cc(
        "Ein Link mit der Aufschrift „Lageplan“ öffnet einen Plan der Schule. Was ist hier gut gelöst?",
        "Die Aufschrift beschreibt das Ziel.",
        ["Der Link verrät die Anzahl der Besucher.", "Die Aufschrift enthält die technische Adresse."],
        "Lesende wissen, was sie nach dem Klick erwartet.",
        "Vergleiche Aufschrift und Inhalt der Zielseite.",
      ),
    ],
    [
      cc(
        "Ein Bildschirmleseprogramm liest fünf Links namens „Details“ untereinander vor. Wie reparierst du die Navigation?",
        "Die Links nach ihren jeweiligen Inhalten benennen.",
        ["Überall „Details hier“ einsetzen.", "Die Links farblich voneinander unterscheiden."],
        "Die einzelnen Namen geben auch ohne ihren Absatz einen eindeutigen Hinweis.",
        "Verlasse dich für die Unterscheidung auf hörbaren Text.",
      ),
      cc(
        "Im Wiki steht „Eintrittspreise“, aber die Seite enthält künftig nur Öffnungszeiten. Wie bleibt der Link verständlich, wenn er dieselbe Seite öffnen soll?",
        "Die Aufschrift „Öffnungszeiten“ einsetzen.",
        [
          "Eine zweite Aufschrift „Hier“ ergänzen.",
          "Die Zieladresse wechseln und die alte Aufschrift behalten.",
        ],
        "Die neue Aufschrift beschreibt genau den Inhalt, den das Ziel noch bietet.",
        "Halte das Ziel fest und überarbeite die Aufschrift.",
      ),
    ],
  ],
  [
    [
      cc(
        "Eine Mitschülerin hat eine Illustration gezeichnet. Du willst sie ins Wiki aufnehmen. Was fragst du?",
        "Ob sie die Nutzung erlaubt und wie sie genannt werden möchte.",
        [
          "Ob sie die Datei kleiner machen kann.",
          "Ob das Wiki die Illustration technisch anzeigen kann.",
        ],
        "Urheberin, Nutzungszweck und Quellenangabe gehören zur Klärung.",
        "Trenne Erlaubnis von der technischen Möglichkeit.",
      ),
      cc(
        "Aus einem Buch übernimmst du eine erlaubte Abbildung. Welche Angaben helfen beim Wiederfinden?",
        "Name, Buchtitel und Seitenzahl",
        ["Schriftart, Papier und Farbton", "Nur die Jahreszeit, in der du das Buch gelesen hast"],
        "Titel und Seite benennen die Fundstelle, der Name die Urheberschaft.",
        "Beschreibe für jemanden den Weg zum Original.",
      ),
    ],
    [
      cc(
        "Eine Karte steht online mit der Lizenzbedingung „nur unverändert“. Was passt zu einem Wiki-Entwurf, der einen Ausschnitt zeigen sollte?",
        "Die Karte unverändert und mit den geforderten Angaben verwenden oder eine andere Karte wählen.",
        [
          "Ausschneiden und nur den Namen daneben schreiben.",
          "Die Karte mit eigenem Namen weitergeben.",
        ],
        "Ein Ausschnitt verändert die Vorlage. Die Nutzung muss zur genannten Bedingung passen.",
        "Prüfe, ob der geplante Zuschnitt erlaubt ist.",
      ),
      cc(
        "Eine Quelle nennt Autorin, Titel und Lizenz, aber euer Team hat nur „aus dem Netz“ notiert. Was ergänzt ihr vor der Abgabe?",
        "Die vorgeschriebenen Angaben und eine genaue Fundstelle.",
        ["Ein weiteres Bild ohne Herkunft.", "Nur den Namen des Teams."],
        "Die Lesenden können das Original finden und die Bedingungen prüfen.",
        "Die Präzision der Angabe entscheidet über Nachprüfbarkeit.",
      ),
    ],
  ],
];

export const searchVariants: DrillVariations = [
  [
    [
      cc(
        "Du suchst die Anmeldefrist für die Robotik-AG deiner Schule. Welche Suchbegriffe sind gezielt?",
        "Schulname Robotik-AG Anmeldefrist",
        ["Roboter cool", "Termine weltweit"],
        "Einrichtung, Angebot und gesuchte Angabe schränken die Treffer ein.",
        "Nenne drei Begriffe aus der Frage.",
      ),
      cc(
        "Deine Suchergebnisse für „Bühne“ sind zu allgemein. Du willst die Seite zum Schultheater finden. Was ergänzt du?",
        "Den Schulnamen und „Schultheater“.",
        ["Weitere beliebige Abkürzungen.", "Nur ein Ausrufezeichen."],
        "Die zusätzlichen Begriffe kennzeichnen genau das gesuchte Angebot.",
        "Nenne die Einrichtung und den Anlass.",
      ),
    ],
    [
      cc(
        "Du findest oft eine gleichnamige Schule in einer anderen Stadt. Welche Änderung verbessert die Recherche nach eurem Speiseplan?",
        "Den Ortsnamen zu Schulname und Speiseplan ergänzen.",
        ["Nur „Speiseplan“ suchen.", "Die Suchmaschine wechseln und die Begriffe gleich lassen."],
        "Der Ortsname unterscheidet die beiden Schulen.",
        "Sorge dafür, dass der Suchtext den Unterschied enthält.",
      ),
      cc(
        "Du suchst einen Erklärtext zu Halbschatten. Die Treffer verkaufen vor allem Lampen. Wie steuerst du die Suche um?",
        "„Halbschatten Lichtausbreitung Schulphysik“ suchen.",
        ["„Lampe bestellen“ hinzufügen.", "Nur „schönes Licht“ eintippen."],
        "Fachbegriff und Thema lenken die Suche zu Erklärungen.",
        "Beschreibe das Phänomen, das du verstehen willst.",
      ),
    ],
  ],
  [
    [
      cc(
        "Welche Fundstelle hilft für die Frage nach der geltenden Büchereiordnung am meisten?",
        "Die aktuelle Ordnung der Bücherei",
        ["Ein privater Eintrag aus dem Vorjahr", "Ein Buchhändler mit Leseempfehlungen"],
        "Die zuständige Einrichtung hält die aktuelle Regelung fest.",
        "Wer legt die Ordnung fest?",
      ),
      cc(
        "Eine Quelle nennt Versuchsaufbau, Messwerte und Unsicherheiten. Was kannst du besser prüfen?",
        "Wie das Ergebnis entstanden ist.",
        ["Ob der Link schnell lädt.", "Wie hoch die Seite in der Suche steht."],
        "Methoden und Daten machen eine Untersuchung nachvollziehbar.",
        "Suche nach nachvollziehbaren Untersuchungsschritten.",
      ),
    ],
    [
      cc(
        "Ein Museumsposter und eine Zeitung widersprechen sich beim Ausstellungstermin. Welche Angabe nutzt du für einen Klassenbesuch?",
        "Die aktuelle Terminseite des Museums prüfen.",
        ["Die frühere der beiden Angaben nehmen.", "Die größere Überschrift als Beleg wählen."],
        "Die veranstaltende Einrichtung kann Änderungen aktuell bekannt geben.",
        "Gehe zur zuständigen Quelle und prüfe das Datum.",
      ),
      cc(
        "Eine Fahrradmarke verkündet „bester Helm“. Ein unabhängiger Test prüft Sichtbarkeit und Haltbarkeit. Welche Frage klärt, ob der Test den Werbespruch wirklich stützt?",
        "Welche Eigenschaften wurden in beiden Aussagen verglichen?",
        ["Haben beide Texte gleich viele Bilder?", "Ist die Testseite länger als die Shopseite?"],
        "Ein Vergleich ist nur aussagekräftig, wenn dieselben Eigenschaften geprüft werden.",
        "Prüfe, was „bester“ in beiden Quellen bedeutet.",
      ),
    ],
  ],
];

export const webVariants: DrillVariations = [
  [
    [
      cc(
        "Ein Rechner stellt den Stundenplan auf Anfrage bereit. Welche Rolle hat er?",
        "Server",
        ["Client", "Router"],
        "Der Server stellt das angeforderte Dokument bereit.",
        "Wer antwortet mit dem Dokument?",
      ),
      cc(
        "Ein Browser bekommt ein Dokument vom Server und stellt es dar. Welche Rolle übernimmt der Browser?",
        "Client",
        ["Router", "Server"],
        "Der Client ist der anfragende und darstellende Teil.",
        "Unterscheide Browser und Rechner, der antwortet.",
      ),
    ],
    [
      cc(
        "Zwei Tablets zeigen denselben Stundenplan. Welches Modell erklärt das?",
        "Beide Clients fragen beim gleichen Server an.",
        ["Das zweite Tablet muss zum Router werden.", "Die beiden Clients ersetzen den Server."],
        "Ein Server kann dieselbe Ressource für mehrere Clients bereitstellen.",
        "Die Rolle hängt davon ab, wer anfragt und wer antwortet.",
      ),
      cc(
        "Der Router vermittelt eine Anfrage, aber auf dem Zielrechner läuft kein Webdienst. Welche Rolle fehlt für die Antwort?",
        "Der Webserver",
        ["Der anfragende Client", "Der Vermittlungsrechner"],
        "Ohne Webserver beantwortet kein Dienst die Anfrage nach dem Dokument.",
        "Wer müsste das Dokument bereitstellen?",
      ),
    ],
  ],
  [
    [
      cc(
        "Welcher Teil von https://museum.example/plan ist der Rechnername?",
        "museum.example",
        ["https", "/plan"],
        "Der Rechnername steht zwischen der Art des Zugriffs und dem Pfad.",
        "Lies nach https:// bis zum nächsten Schrägstrich.",
      ),
      cc(
        "Welche Angabe verwendet der Router im Modell vor allem, wenn er Daten weiterleitet?",
        "Die Ziel-IP-Adresse",
        ["Die Überschrift des Dokuments", "Den beschrifteten Linktext"],
        "Die Ziel-IP ist eine Adresse für die Weiterleitung im Netz.",
        "Ein Weiterleiter arbeitet mit Adressen.",
      ),
    ],
    [
      cc(
        "Beim Wechsel von info.example zu schule.example bleibt /termine gleich. Was ändert sich an der URL?",
        "Der Rechnername",
        ["Die Zugriffsart", "Der Pfad"],
        "Das Dokument wird über einen anderen Rechnernamen erreicht.",
        "Vergleiche die Angabe vor dem ersten Pfad-Schrägstrich.",
      ),
      cc(
        "Der Browser hat dieselbe Rechneradresse ermittelt. Statt /mensaplan soll er /kontakt anfragen. Welche Angabe muss sich ändern?",
        "Der Pfad in der URL",
        ["Die IP des Routers", "Die Rolle des Clients"],
        "Der Pfad bestimmt, welches Dokument auf dem Rechner angefordert wird.",
        "Trenne das Ziel im Netz von der Auswahl des Dokuments.",
      ),
    ],
  ],
];
