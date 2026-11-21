import { cc, type DrillVariations } from "./helpers";

export const planVariants: DrillVariations = [
  [
    [
      cc(
        "Welches Ziel kannst du nach der Arbeit eindeutig prüfen?",
        "Alle drei Wiki-Seiten lassen sich von Start aus öffnen.",
        ["Das Wiki kommt gut an.", "Das Team hat sich viel Mühe gegeben."],
        "Du kannst die Verweise ausprobieren und die Seiten zählen.",
        "Wähle ein beobachtbares Ergebnis.",
      ),
      cc(
        "Welcher Satz beschreibt einen Meilenstein?",
        "Nach 15 Minuten stehen die drei Seitentitel und ihre Zuständigkeiten fest.",
        ["Das Team beginnt irgendwann.", "Wir denken über ein Wiki nach."],
        "Zeitpunkt und Ergebnis sind konkret.",
        "Suche die Angabe, bei der du einen Termin und einen Nachweis hast.",
      ),
    ],
    [
      cc(
        "Nach der Hälfte der Stunde stehen die drei Texte. Verweise und Quellen fehlen. Was hat Vorrang vor zusätzlichen Bildern?",
        "Verweise einsetzen, Quellen notieren und Zeit für den Test lassen.",
        ["Das Design von Grund auf neu planen.", "Die Zahl der Seiten verdoppeln."],
        "Die offenen Aufgaben gehören zum überprüfbaren Mindestziel.",
        "Vergleiche den Stand mit dem geplanten Ergebnis.",
      ),
      cc(
        "Eine Gruppe möchte ein großes Versuchs-Wiki erstellen, bis zur Abgabe bleibt aber nur eine Stunde. Welchen Umfang sollte sie festlegen?",
        "Eine Frage, eine Versuchsseite und eine verlinkte Erklärung mit Test.",
        ["Mehrere Experimente ohne Linkprüfung.", "Ein Cover und möglichst viele leere Seiten."],
        "Ein kleiner verlinkter Aufbau lässt sich innerhalb der Frist fertigstellen.",
        "Behalte ein sinnvolles Ergebnis und eine Testphase.",
      ),
    ],
  ],
  [
    [
      cc(
        "Was braucht die Person, die die Skizze ins Wiki übernimmt?",
        "Die fertige Skizze und den vereinbarten Seitennamen",
        ["Nur den eigenen Aufgabentitel", "Die Testliste des nächsten Projekts"],
        "Datei und Seitenname vermeiden eine falsche Zuordnung.",
        "Welche Übergabe macht den nächsten Schritt möglich?",
      ),
      cc(
        "Wer hält beim Teamtest fest, welcher Link ins Leere führt?",
        "Die für den Test eingeteilte Person",
        ["Die späteren Leser des Wikis", "Immer die Person mit den meisten Textseiten"],
        "Eine klare Zuständigkeit macht die Rückmeldung verlässlich.",
        "Suche die Aufgabe, zu der die Beobachtung gehört.",
      ),
    ],
    [
      cc(
        "Zwei Schülerinnen ändern versehentlich dieselbe Seite. Wie könnt ihr die Zuständigkeiten beim nächsten Mal klären?",
        "Je Seite eine verantwortliche Person nennen und Änderungen gemeinsam abstimmen.",
        [
          "Beide ändern weiter unabhängig und speichern unter demselben Namen.",
          "Nur die Farben der Seiten aufteilen.",
        ],
        "Klare Aufgaben lassen erkennen, wer welche Fassung erstellt und übergibt.",
        "Vermeide zwei unkoordinierte Änderungen am selben Arbeitsschritt.",
      ),
      cc(
        "Jo soll den Wiki-Test durchführen und kennt das Experiment noch nicht. Was gibt das Team Jo bei der Übergabe?",
        "Den Link zum Entwurf, die erwarteten Ziele und eine Liste der zu prüfenden Angaben.",
        ["Nur den Projektnamen.", "Erst nach Ablauf der Zeit eine Beschreibung."],
        "Mit diesen Informationen kann Jo Soll und Ist vergleichen.",
        "Der Test braucht das überprüfbare erwartete Ergebnis.",
      ),
    ],
  ],
  [
    [
      cc(
        "Was könnt ihr bereits prüfen, bevor die Wiki-Seiten fertig sind?",
        "Ob im Entwurf alle geplanten Seiten und Verweise vorkommen.",
        [
          "Ob alle echten Links im Browser funktionieren.",
          "Ob alle Seiten auf anderen Geräten lesbar sind.",
        ],
        "Die Skizze erlaubt einen Planvergleich. Funktionsprüfungen brauchen fertige Seiten.",
        "Überlege, was schon vorliegt.",
      ),
      cc(
        "Ein Linktest soll durch eine Person wiederholt werden können. Was gehört in die Prüfliste?",
        "Ausgangsseite, Link und erwartetes Ziel",
        ["Nur der Name des Teams", "Nur die gewählte Schriftfarbe"],
        "Der beschriebene Klickweg lässt sich wiederholen.",
        "Beschreibe einen konkreten Testschritt.",
      ),
    ],
    [
      cc(
        "Ihr habt alle Links geprüft und ändert danach einen Seitennamen samt Adresse. Was plant ihr vor der Abgabe ein?",
        "Alle Verweise auf die umbenannte Seite erneut prüfen.",
        [
          "Die vorherigen Tests als ausreichend ansehen.",
          "Nur die Rechtschreibung des Titels noch einmal prüfen.",
        ],
        "Die Änderung kann bereits getestete Adressen ungültig machen.",
        "Suche nach den Stellen, die von der Änderung abhängen.",
      ),
      cc(
        "Kurz vor Schluss funktionieren zwei Rückwege nicht. Ein Teammitglied möchte weiter neue Inhalte einbauen. Was sollte das Team priorisieren?",
        "Die Rückwege korrigieren und sie mit dem vorhandenen Testplan prüfen.",
        [
          "Bis zur Abgabe weitere Inhalte beginnen.",
          "Die betroffenen Seiten im Plan als geprüft markieren.",
        ],
        "Funktionierende Wege gehören zum vereinbarten Ergebnis.",
        "Prüfe, was die Abgabe aktuell unbenutzbar macht.",
      ),
    ],
  ],
];

export const saveVariants: DrillVariations = [
  [
    [
      cc(
        "Wann ist ein sinnvoller Zeitpunkt für einen Zwischenstand?",
        "Wenn ihr die erste verlinkte Fassung öffnen und prüfen könnt.",
        [
          "Erst nachdem ihr alle früheren Fassungen gelöscht habt.",
          "Nur bevor es eine einzige Seite gibt.",
        ],
        "Ein überprüfbarer Stand eignet sich zum späteren Vergleichen.",
        "Suche einen Zeitpunkt mit brauchbarem Ergebnis.",
      ),
      cc(
        "Welche Namen unterscheiden zwei Fassungen eindeutig?",
        "wiki-v1 und wiki-v2",
        ["wiki-neu und wiki-neu", "wiki-fertig und wiki-fertig"],
        "Die Nummer ordnet die Fassungen und hält sie auseinander.",
        "Wähle erkennbare Versionskennzeichen.",
      ),
    ],
    [
      cc(
        "Ein Link ist in der neuen Version defekt. Ihr wollt die Ursache finden und den funktionierenden Stand verfügbar halten. Was macht ihr?",
        "Beide Fassungen öffnen und die Korrektur als weitere Version sichern.",
        [
          "Die alte Fassung mit der fehlerhaften überschreiben.",
          "Die neue Fassung kopieren und beide Kopien gleich benennen.",
        ],
        "So bleibt der geprüfte Stand wiederöffnbar und der Vergleich möglich.",
        "Erhalte den bekannten guten Stand.",
      ),
      cc(
        "Zwei Teams liefern „wiki-v2“. Weil sich Inhalte unterscheiden, können andere sie nicht zuordnen. Was ergänzt ihr?",
        "Einen vereinbarten Zusatz für die Gruppe und einen Eintrag im Änderungsprotokoll.",
        [
          "Nur mehr Leerzeichen im Dateinamen.",
          "Beide Dateien am selben Ort unter demselben Namen speichern.",
        ],
        "Gruppe und Protokoll machen erkennbar, wer welche Fassung erstellt hat.",
        "Unterscheide Versionsnummer und Herkunft.",
      ),
    ],
  ],
  [
    [
      cc(
        "Ein Link „Quelle“ öffnet eine Fassung von letzter Woche. Was ist das beobachtete Ergebnis?",
        "Der Link öffnet die alte Fassung.",
        ["Die gewünschte neue Fassung soll geöffnet werden.", "Der Test findet morgen statt."],
        "Das beobachtete Ergebnis ist das, was beim Klick tatsächlich passiert.",
        "Trenne Beobachtung und Erwartung.",
      ),
      cc(
        "Wie prüfst du, ob ein korrigierter Link jetzt von der Startseite aus funktioniert?",
        "Die Startseite öffnen, denselben Link anklicken und das Ziel vergleichen.",
        ["Nur den Dateinamen der Startseite lesen.", "Den Linktext ändern und den Test überspringen."],
        "Der wiederholte Test nutzt den Weg der Leserinnen und Leser.",
        "Wiederhole die Aktion, die den Fehler sichtbar machte.",
      ),
    ],
    [
      cc(
        "Ein Link funktioniert aus der Vorschau, doch eine Mitschülerin landet beim Abruf des abgegebenen Ordners auf einer leeren Seite. Wie grenzt ihr den Fehler ein?",
        "Mit der abgegebenen Fassung denselben Klickweg nachgehen und Ziel und Dateien vergleichen.",
        [
          "Im eigenen Editor nur die Überschrift ansehen.",
          "Eine zweite Kopie mit unbekanntem Stand senden.",
        ],
        "Der Vergleich muss dieselbe Fassung und denselben Einstieg nutzen.",
        "Prüfe das Ergebnis so, wie es die andere Person geöffnet hat.",
      ),
      cc(
        "Die Startseite erreicht jede Unterseite, aber aus einer Unterseite kommt niemand zurück. Was ergänzt ihr im Testprotokoll?",
        "Je Unterseite einen Test für den Rückweg zum Start.",
        [
          "Einen zweiten Test der Überschrift auf der Startseite.",
          "Nur die Anzahl der Seiten pro Ordner.",
        ],
        "Der Rückweg braucht einen eigenen gerichteten Verweis.",
        "Prüfe auch Wege, die in der Gegenrichtung beginnen.",
      ),
    ],
  ],
  [
    [
      cc(
        "Welche Zeile dokumentiert eine Änderung nachvollziehbar?",
        "Kim, v2: Link zur Erklärung korrigiert. Von Start getestet.",
        ["v2: fertig!", "jo, schönere Seite"],
        "Name, Version, Änderung und Test sind erkennbar.",
        "Ein anderer Mensch soll den Schritt nachvollziehen können.",
      ),
      cc(
        "Ein Protokoll nennt Version, Änderung und Teststatus. Wozu dient der Teststatus?",
        "Er zeigt, was nach der Änderung geprüft wurde und ob es funktioniert.",
        ["Er legt die Farbe der Seite fest.", "Er ersetzt den Versionsnamen."],
        "Die nächste Person kann mit einem geprüften Stand weiterarbeiten.",
        "Frage, was eine prüfende Person wissen muss.",
      ),
    ],
    [
      cc(
        "Ihr habt in v3 einen Link korrigiert. Der neue Test deckt gleichzeitig eine fehlende Quelle auf. Was schreibt ihr auf?",
        "Linktest bestanden, Quellenangabe noch offen und dafür eine Zuständigkeit nennen.",
        ["Alles bestanden, weil der Link funktioniert.", "Nur die Farbe der Quelle korrigiert."],
        "Die Notiz unterscheidet erledigte und offene Arbeit.",
        "Dokumentiere beide Beobachtungen und den nächsten Schritt.",
      ),
      cc(
        "Im Protokoll steht „Schatten-Skizze aktualisiert“. Beide Fassungen zeigen verschiedene Bilder. Welche Ergänzung macht den Wechsel überprüfbar?",
        "Version, betroffene Seite, Grund der Änderung und Ergebnis des Tests nennen.",
        [
          "Nur ein Ausrufezeichen hinter „aktualisiert“ setzen.",
          "Das alte Bild aus allen Fassungen löschen.",
        ],
        "Damit kann ein Teammitglied genau die geänderte Stelle prüfen.",
        "Benenne die konkrete Änderung und die Stelle, an der sie sichtbar ist.",
      ),
    ],
  ],
];
