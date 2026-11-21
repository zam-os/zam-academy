import { cc, type DrillVariations } from "./helpers";

export const sequenceVariants: DrillVariations = [
  [
    [
      cc(
        "Welcher Befehl gibt auch die Schrittweite an?",
        "Gehe drei Felder nach oben.",
        ["Gehe nach oben, bis es passt.", "Gehe ein bisschen nach oben."],
        "Richtung und Anzahl sind festgelegt.",
        "Jede Ausführung soll denselben Weg ergeben.",
      ),
      cc(
        "Welcher Satz beschreibt einen eindeutigen Schritt für einen Ausgaberoboter?",
        "Lege eine Marke in Fach 2.",
        ["Lege etwas zur Seite.", "Räume Fach 2 ein wenig auf."],
        "Handlung, Gegenstand und Ziel stehen fest.",
        "Achte darauf, dass nichts geraten werden muss.",
      ),
    ],
    [
      cc(
        "Der Befehl „Ziel markieren“ soll ein Feld direkt rechts vom Roboter kennzeichnen. Er steht noch am Start. Welche Übersetzung setzt das um?",
        "Gehe ein Feld nach rechts, markiere das aktuelle Feld.",
        [
          "Markiere das aktuelle Feld, gehe ein Feld nach rechts.",
          "Gehe nach rechts, solange du kannst, und markiere.",
        ],
        "Der Markierbefehl wirkt auf das Feld, auf dem der Roboter gerade steht.",
        "Bringe ihn zuerst auf das gemeinte Feld.",
      ),
      cc(
        "Ein Auftrag lautet „mach die Ausleihe fertig“. Welche Umsetzung lässt sich ohne Raten ausführen?",
        "Scanne das Buch, scanne den Ausweis, zeige die Bestätigung.",
        [
          "Erledige alles in der üblichen Reihenfolge.",
          "Zeige die Bestätigung irgendwann beim Scannen.",
        ],
        "Die Schritte benennen Eingaben, Ablauf und Ergebnis.",
        "Wähle einen Ablauf mit eindeutigen Befehlen.",
      ),
    ],
  ],
  [
    [
      cc(
        "Die Druckdatei kann erst nach dem Gestalten gespeichert werden. Was steht zuerst?",
        "Die Datei gestalten",
        ["Die fertige Datei speichern", "Den Ausdruck abholen"],
        "Das Speichern braucht die zuvor erstellte Fassung.",
        "Suche nach der Voraussetzung.",
      ),
      cc(
        "Für die automatische Tür kommt erst „Chip lesen“, dann „Tür öffnen“. Warum?",
        "Das Öffnen braucht eine bekannte Zutrittsberechtigung.",
        [
          "Beide Befehle müssen gleichzeitig laufen.",
          "Der Chip kann erst nach der Öffnung erkannt werden.",
        ],
        "Der erste Schritt liefert die Information für den zweiten.",
        "Frage, welche Information schon vorliegen muss.",
      ),
    ],
    [
      cc(
        "Ein Getränk darf erst ausgegeben werden, wenn der Becher im Fach steht. Welche Folge verhindert Verschütten?",
        "Becher bereitstellen, Getränk eingießen, Fach freigeben.",
        [
          "Getränk eingießen, Becher bereitstellen, Fach freigeben.",
          "Fach freigeben, Getränk eingießen, Becher bereitstellen.",
        ],
        "Der Becher muss beim Eingießen bereits im Fach stehen.",
        "Verfolge den Zustand des Fachs Schritt für Schritt.",
      ),
      cc(
        "Ein Spiel soll erst die Spielsteine aufstellen, dann den ersten Zug erlauben und danach die Zugnummer anzeigen. Welcher Schritt lässt sich ohne Regeländerung vorziehen?",
        "Keiner, die Schritte haben diese Reihenfolge.",
        ["Die Zugnummer vor dem Aufstellen anzeigen.", "Den Zug vor dem Aufstellen erlauben."],
        "Jede Aufgabe setzt das Ergebnis des vorherigen Schritts voraus.",
        "Prüfe die Bedeutung eines Zugs auf einem unbestückten Brett.",
      ),
    ],
  ],
];

export const branchVariants: DrillVariations = [
  [
    [
      cc(
        "WENN das Fach leer ist, DANN piepen. Im Fach liegt etwas. Was macht dieser Block?",
        "Er gibt keinen Ton aus.",
        ["Er piept einmal.", "Er entfernt den Gegenstand."],
        "Leer ist falsch, also wird der Dann-Zweig übersprungen.",
        "Prüfe den Inhalt vor der Aktion.",
      ),
      cc(
        "WENN Licht aus, DANN einschalten. Das Licht ist aus. Was geschieht?",
        "Das Licht wird eingeschaltet.",
        ["Es bleibt aus.", "Es blinkt und wird wieder ausgeschaltet."],
        "Die Bedingung beim Test ist wahr.",
        "Wahr führt zum Dann-Block.",
      ),
    ],
    [
      cc(
        "Eine Ampel soll nur beim Tastendruck eine Anforderung speichern. Wie sieht die kleinste passende Verzweigung aus?",
        "WENN die Taste gedrückt ist, DANN die Anforderung speichern.",
        [
          "Bei jedem Prüfen eine Anforderung speichern.",
          "WENN die Taste frei ist, DANN eine Anforderung speichern.",
        ],
        "Der Ruhefall benötigt keine Aktion.",
        "Nur ein Ereignis soll den Zustand verändern.",
      ),
      cc(
        "Die Bücherei meldet fristgerechte Rückgaben nur dann ausdrücklich, wenn noch keine Verspätung vorliegt. Bei Verspätung bleibt die Anzeige unverändert. Welche Lösung setzt das um?",
        "WENN fristgerecht, DANN Bestätigung anzeigen.",
        ["WENN verspätet, DANN Bestätigung anzeigen.", "Eine Bestätigung nach jeder Prüfung anzeigen."],
        "Die Aktion gehört genau zu dem Fall, für den eine Meldung gewünscht ist.",
        "Der andere Fall soll keine Anzeige auslösen.",
      ),
    ],
  ],
  [
    [
      cc(
        "WENN das Fenster offen ist, DANN „lüften“ anzeigen, SONST „zu“ anzeigen. Das Fenster ist offen. Was erscheint?",
        "lüften",
        ["zu", "beides"],
        "Bei wahr läuft der Dann-Zweig.",
        "Setze den gegebenen Zustand in die Bedingung ein.",
      ),
      cc(
        "WENN Karte erkannt, DANN grün, SONST rot. Die Karte wird nicht erkannt. Welche Farbe erscheint?",
        "Rot",
        ["Grün", "Grün und Rot"],
        "Die Bedingung ist falsch und nur der Sonst-Zweig läuft.",
        "Wähle genau einen Zweig.",
      ),
    ],
    [
      cc(
        "Ein Transportwagen soll bei leerer Kiste zur Abholung fahren und bei voller Kiste zum Lager. Welche Lösung erreicht genau einen Ort?",
        "WENN die Kiste leer ist, DANN zur Abholung, SONST zum Lager.",
        [
          "WENN die Kiste leer ist, DANN zur Abholung. Danach immer zum Lager.",
          "Immer zur Abholung und zum Lager fahren.",
        ],
        "Beide Startzustände erhalten genau ein Ziel.",
        "Prüfe auch den Fall einer vollen Kiste.",
      ),
      cc(
        "WENN Ticket gültig, DANN „Einlass“, SONST „Klärung“. Eine Testperson mit gültigem Ticket sieht beide Texte. Welcher Fehler erklärt das?",
        "„Klärung“ steht hinter der Verzweigung und wird immer ausgeführt.",
        [
          "„Klärung“ steht korrekt nur im Sonst-Zweig.",
          "Die Bedingung wird wahr, wenn das Ticket gültig ist.",
        ],
        "Mit korrektem Sonst-Zweig kann nur ein Text erscheinen.",
        "Suche eine Aktion, die unabhängig vom gewählten Zweig läuft.",
      ),
    ],
  ],
];

export const countVariants: DrillVariations = [
  [
    [
      cc(
        "Wiederhole sechsmal „zeige Blau“. Wie oft erreicht das Programm den Block?",
        "Sechsmal",
        ["Fünfmal", "Einmal"],
        "Die Zahl im Schleifenkopf gibt die Durchläufe an.",
        "Zähle Durchläufe, nicht Farben.",
      ),
      cc(
        "Wiederhole dreimal „hebe eine Marke auf“. Wie viele Marken hebst du auf?",
        "Drei",
        ["Eine", "Neun"],
        "Pro Durchlauf gehst du genau eine Marke an.",
        "Ein ganzer Durchlauf hebt eine Marke auf.",
      ),
    ],
    [
      cc(
        "Für das Schulfest sollen sechs gleiche Runden mit denselben zwei Signalen abgespielt werden. Wie bereitest du die Änderung auf acht Runden vor?",
        "Eine Zählschleife um beide Signale legen und die Anzahl später anpassen.",
        [
          "Jedes Signal getrennt sechsmal wiederholen.",
          "Alle Signale einzeln aufschreiben und ihre Reihenfolge später erraten.",
        ],
        "Der Schleifenblock hält die Reihenfolge der Signale pro Runde fest.",
        "Gruppiere genau die Anweisungen, die zu einer Runde gehören.",
      ),
      cc(
        "Ein Archiv erzeugt genau drei Kopien jedes bereits ausgewählten Blatts. Welche Struktur passt zur Anzahl der Kopien eines Blatts?",
        "Dreimal den Kopierbefehl für das aktuelle Blatt ausführen.",
        [
          "Kopieren, solange noch irgendein Blatt da ist.",
          "Einmal kopieren und danach nur die Anzeige wiederholen.",
        ],
        "Die Anzahl ist für dieses Blatt vor Beginn festgelegt.",
        "Wähle einen Block, dessen Ende durch eine Zahl bestimmt ist.",
      ),
    ],
  ],
  [
    [
      cc(
        "Wiederhole dreimal [kurz, lang]. Welche Signale hörst du?",
        "kurz, lang, kurz, lang, kurz, lang",
        ["kurz, kurz, kurz, lang, lang, lang", "kurz, lang, lang"],
        "Jeder Durchlauf führt erst kurz und dann lang aus.",
        "Schreibe den ganzen Block dreimal ab.",
      ),
      cc(
        "Wiederhole zweimal [öffnen, schließen], danach ein Ton. Wann kommt der Ton?",
        "Einmal nach beiden Durchläufen",
        ["Nach jedem Öffnen", "Vor dem ersten Schließen"],
        "Der Ton steht hinter dem gesamten Schleifenblock.",
        "Lies, wo die Klammer endet.",
      ),
    ],
    [
      cc(
        "Zwei Schritte und ein Ton bilden eine Runde. Es sind vier Runden geplant. Wie muss der Ton platziert werden?",
        "Nach den zwei Schritten innerhalb des Schleifenblocks.",
        ["Nach Ende der Schleife.", "Vor dem Beginn aller Runden."],
        "Innerhalb läuft er je Runde einmal, insgesamt viermal.",
        "Überlege, welche Handlung in jeder Runde vorkommt.",
      ),
      cc(
        "Im Protokoll steht erst viermal „öffnen“ und danach viermal „schließen“. Geplant waren vier vollständige Wechsel. Was änderst du?",
        "Öffnen und Schließen gemeinsam in dieselbe Schleife setzen.",
        [
          "Die beiden getrennten Schleifen vertauschen.",
          "Beide Anweisungen einmal außerhalb der Wiederholungen setzen.",
        ],
        "Ein gemeinsamer Block wiederholt jedes Paar als Einheit.",
        "Die gewünschte Reihenfolge ist öffnen, schließen, öffnen, schließen.",
      ),
    ],
  ],
];

export const whileVariants: DrillVariations = [
  [
    [
      cc(
        "SOLANGE der Korb leer ist: lege einen Ball hinein. Beim Start liegt darin schon ein Ball. Wie oft läuft der Block?",
        "Keinmal",
        ["Einmal", "Immer wieder"],
        "Die Prüfung „leer“ ist bereits beim Start falsch.",
        "Prüfe vor einer Handlung.",
      ),
      cc(
        "SOLANGE der Kartenstapel Karten enthält: nimm die oberste Karte weg. Eine Karte liegt da. Wie viele Durchläufe gibt es?",
        "Einen",
        ["Keinen", "Zwei"],
        "Nach dem Entfernen ist der Stapel leer.",
        "Die erste Prüfung und das Entfernen sind verschiedene Schritte.",
      ),
    ],
    [
      cc(
        "Ein Gerät scannt so lange, wie Blätter im Einzug liegen. Der Einzug ist beim Start leer. Was muss die Steuerung tun?",
        "Die Schleife ohne Scan überspringen.",
        ["Mindestens einen Scan auslösen.", "Die Blätterzahl beim Start ignorieren."],
        "Die Prüfung vor dem ersten Durchlauf ist sofort falsch.",
        "Überlege, ob bei leerem Einzug ein Blatt gescannt werden kann.",
      ),
      cc(
        "Im Schultheater zählen Helfer Karten vom Stapel, bis der Stapel leer ist. Die Anfangszahl ändert sich pro Vorstellung. Welche Steuerung bleibt passend?",
        "Solange noch Karten auf dem Stapel liegen, eine Karte zählen und ablegen.",
        ["Immer zehn Karten zählen.", "Solange der Stapel leer ist, eine Karte zählen."],
        "Die tatsächliche Anzahl steuert, wann die Arbeit endet.",
        "Wähle eine Prüfung, die bei jedem neuen Stapel funktioniert.",
      ),
    ],
  ],
  [
    [
      cc(
        "Ein Automat sortiert weiter, solange im Fach noch Aufträge liegen. Wann hört er auf?",
        "Sobald das Fach keine Aufträge mehr enthält.",
        ["Nach genau einem Auftrag.", "Sobald das Fach wieder voll ist."],
        "Ohne Aufträge ist die angegebene Bedingung falsch.",
        "Formuliere das Gegenteil der Durchlaufbedingung.",
      ),
      cc(
        "Eine Bahn fährt weiter, solange das Ziel noch fehlt. Was kann die Bedingung falsch machen?",
        "Die Bahn erreicht das Ziel.",
        ["Der Programmname wird geändert.", "Die Bahn meldet bei jedem Schritt ihre Startzeit."],
        "Das Erreichen des Ziels beendet die Wiederholung.",
        "Achte auf den Zustand, den die Prüfung abfragt.",
      ),
    ],
    [
      cc(
        "Ein Aufräumprogramm soll Dateien nacheinander verschieben, bis der Eingangsordner leer ist. Welcher Block bringt das Programm seinem Ende näher?",
        "Jeweils eine Datei aus dem Eingangsordner verschieben.",
        [
          "Jeweils den Namen der nächsten Datei anzeigen.",
          "Die Dateien im Eingangsordner nur neu sortieren.",
        ],
        "Mit jedem Verschieben sinkt die Zahl der Dateien im Eingangsordner.",
        "Der Block muss ändern, was die Schleife prüft.",
      ),
      cc(
        "Ein Programm dreht sich, solange rechts keine Markierung liegt. Die Umgebung enthält auf keiner Seite eine Markierung. Welche Folge hat das ohne zusätzlichen Stopp?",
        "Es dreht weiter, weil die Bedingung wahr bleibt.",
        ["Es beendet sich nach einer festen Umdrehung.", "Es startet keinen Durchlauf."],
        "Keine Drehung kann die fehlende Markierung erzeugen.",
        "Prüfe nach einer ganzen Umdrehung dieselbe Bedingung.",
      ),
    ],
  ],
];
