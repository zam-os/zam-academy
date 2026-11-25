import { cc, type DrillVariations } from "./helpers";

export const channelVariants: DrillVariations = [
  [
    [
      cc(
        "Die AG möchte in fünf Minuten intern einen Treffpunkt festlegen. Welcher freigegebene Kanal passt?",
        "Der geschlossene AG-Chat",
        ["Das öffentliche Schulprofil", "Eine offene Kommentarseite"],
        "Die Beteiligten können schnell untereinander antworten.",
        "Reichweite und Antwortzeit zählen.",
      ),
      cc(
        "Das Sommerkonzert ist öffentlich. Ein genehmigtes Plakat enthält Datum und Ort. Wo erreicht es auch Menschen außerhalb der Schule?",
        "Im öffentlichen Schulkanal",
        ["In einer privaten Nachricht an eine Person", "Im Chat einer kleinen Arbeitsgruppe"],
        "Der öffentliche Kanal richtet sich auch an Außenstehende.",
        "Wer soll die Nachricht sehen?",
      ),
    ],
    [
      cc(
        "Im Klassenchat soll ein Prüfungsergebnis besprochen werden, das nur eine Person betrifft. Wie ändert ihr den Kanal?",
        "Für die Einzelrückfrage den freigegebenen direkten Schulkanal verwenden.",
        [
          "Das Ergebnis ohne Name an die Klasse senden, obwohl alle wissen, um wen es geht.",
          "Den Klassenchat auf eine öffentliche Seite verlegen.",
        ],
        "Der direkte Kanal passt zum vorgesehenen Empfängerkreis.",
        "Begrenze die Reichweite auf die Beteiligten.",
      ),
      cc(
        "Das Bühnenbild-Team sucht Freiwillige aus allen Klassen, möchte aber Zusagen mit Namen vertraulich sammeln. Welche Kombination passt?",
        "Öffentliche Einladung über die Schule, Zusagen über einen freigegebenen direkten Kanal.",
        [
          "Einladung und vollständige Liste öffentlich posten.",
          "Alles in einem Chat nur für das Bühnenbild-Team lassen.",
        ],
        "Die Einladung darf breit sein. Persönliche Zusagen erhalten nur die Zuständigen.",
        "Einladung und Antwort haben verschiedene Empfänger.",
      ),
    ],
  ],
  [
    [
      cc(
        "Ein Post meldet ohne Datum einen Schulausfall. Was prüfst du zuerst?",
        "Datum, Absender und eine aktuelle offizielle Nachricht",
        ["Anzahl der Weiterleitungen", "Farbe der Überschrift"],
        "Ein aktueller Hinweis der Schule klärt Anlass und Datum.",
        "Suche nach einem überprüfbaren Ursprung.",
      ),
      cc(
        "Zwei Klassenchats teilen dieselbe Bildschirmaufnahme. Haben sie damit zwei unabhängige Belege?",
        "Nein, beide teilen dasselbe Material.",
        ["Ja, es sind zwei verschiedene Chats.", "Ja, wenn beide Gruppen den Beitrag kommentieren."],
        "Die Zahl der Chats sagt nichts über die Herkunft.",
        "Frage, ob die Aussagen eigenständig erhoben wurden.",
      ),
    ],
    [
      cc(
        "Du hast einen falschen Termin in der AG-Gruppe weitergeleitet. Die Schule bestätigt den richtigen Termin. Wie korrigierst du die Nachricht?",
        "In derselben Gruppe die Korrektur mit Verweis auf die aktuelle Schulinfo posten.",
        [
          "Den richtigen Termin nur privat einem Freund mitteilen.",
          "Den ersten Post erneut öffnen und auf Kommentare hoffen.",
        ],
        "Die Korrektur erreicht die Betroffenen und lässt sich nachprüfen.",
        "Nutze den Kanal, in dem die falsche Angabe angekommen ist.",
      ),
      cc(
        "Ein virales Bild trägt angeblich die Aufschrift „heute“. Der gleiche Ausschnitt erscheint in einem älteren Artikel. Wie gehst du vor?",
        "Die Herkunft und das Ereignisdatum klären, bevor du es weiterleitest.",
        ["Auf die neue Bildunterschrift vertrauen.", "Das ältere Datum aus dem Vergleich entfernen."],
        "Das Bild kann aus einem anderen Ereignis stammen.",
        "Trenne das Datum des Uploads vom Datum der Aufnahme.",
      ),
    ],
  ],
  [
    [
      cc(
        "Unter einem Gruppenfoto steht eine wiederholte Beleidigung. Welche erste Reaktion schützt die Person?",
        "Den Beitrag nicht teilen und eine Vertrauensperson einbeziehen.",
        ["Den Kommentar als Witz bewerten.", "Das Foto in eine andere Gruppe senden."],
        "Hilfe kann die Verbreitung und die Belastung begrenzen.",
        "Leite die Bloßstellung nicht weiter.",
      ),
      cc(
        "Ein Streit im Chat wird durch knappe Antworten schärfer. Was hilft vor dem nächsten Senden?",
        "Text noch einmal lesen und sachlich formulieren.",
        ["Alles in Großbuchstaben schreiben.", "Mehr Leute markieren, um Druck zu machen."],
        "Eine klare, respektvolle Nachricht kann Missverständnisse verringern.",
        "Lies die Nachricht aus Sicht der Empfänger.",
      ),
    ],
    [
      cc(
        "Eine Gruppe verwendet wiederholt bearbeitete Bilder eines Mitschülers zum Bloßstellen. Du möchtest Belege sichern. Was passt?",
        "Mit einer Vertrauensperson klären, wie sie den Vorfall sehen kann, ohne die Bilder erneut zu verbreiten.",
        [
          "Für mehr Aufmerksamkeit ein öffentliches Album erstellen.",
          "Die Bilder in alle Klassengruppen kopieren.",
        ],
        "Eine gezielte Weitergabe an Hilfeleistende dient einem anderen Zweck als eine öffentliche Kopie.",
        "Biete Unterstützung an und halte den Empfängerkreis klein.",
      ),
      cc(
        "Ein ernster Konflikt zieht im Chat immer weitere Leute an. Was begrenzt Schaden und ermöglicht Klärung?",
        "Das Weiterleiten unterlassen und mit einer Vertrauensperson ein passendes Gespräch anstoßen.",
        [
          "Die Beleidigungen öffentlich zuordnen und eine Abstimmung beginnen.",
          "Eine neue Gruppe nur für Screenshots gründen.",
        ],
        "Gezielte Hilfe erlaubt Klärung ohne zusätzliche Öffentlichkeit.",
        "Wähle Unterstützung und einen kleineren Empfängerkreis.",
      ),
    ],
  ],
];

export const privacyVariants: DrillVariations = [
  [
    [
      cc(
        "Welche Angabe im AG-Bericht kann eine Person direkt erkennbar machen?",
        "Ein Foto mit gut erkennbarem Gesicht",
        ["Die Zahl der Fotostative", "Die Größe des AG-Raums"],
        "Ein sichtbares Gesicht kann eine konkrete Person identifizierbar machen.",
        "Frage, wem sich die Angabe zuordnen lässt.",
      ),
      cc(
        "Die Schule bittet um eine Teilnehmerzahl für die Raumplanung. Welches Ergebnis reicht?",
        "Die Anzahl der Teilnehmenden",
        ["Namen und private Handynummern aller Teilnehmenden", "Ein öffentliches Gruppenfoto"],
        "Für die benötigten Plätze genügt die Zahl.",
        "Welche Angabe ist für den Zweck erforderlich?",
      ),
    ],
    [
      cc(
        "Für die Jahrgangsseite sollen Fotos einer Aufführung erscheinen. Eine Mitwirkende möchte kein öffentliches Bild von sich. Was passt zum gemeinsamen Ziel?",
        "Ein freigegebenes Bühnenbild oder eine Aufnahme wählen, auf der sie nicht erkennbar ist.",
        [
          "Dasselbe erkennbare Foto nur ohne Namensliste posten.",
          "Das Foto teilen und den Widerspruch später prüfen.",
        ],
        "Ihr könnt von der Aufführung berichten, ohne ihr erkennbares Bild zu veröffentlichen.",
        "Trenne das Ziel des Berichts vom geplanten Bild.",
      ),
      cc(
        "Eine gedruckte Klassenliste soll einer fremden AG zur Materialplanung dienen. Sie braucht nur die Gruppengrößen. Was gebt ihr weiter?",
        "Die Gruppen und ihre Größen ohne die Namensliste.",
        ["Die Namen und zusätzlich die Adressen.", "Das ganze Dokument mit allen privaten Angaben."],
        "Die Planung funktioniert mit Summen.",
        "Leite vom Zweck den kleinsten passenden Datensatz ab.",
      ),
    ],
  ],
  [
    [
      cc(
        "Welche Schutzfunktion prüft Dateien auf verdächtige Programme?",
        "Ein Virenschutz",
        ["Eine Firewall", "Eine Bildschirmzeitbegrenzung"],
        "Der Virenschutz kontrolliert Dateien und Programme auf Hinweise für Schaden.",
        "Unterscheide Dateiprüfung und Netzwerkfilter.",
      ),
      cc(
        "Eine Nachricht mit Anhang kommt angeblich von einer bekannten AG. Die Adresse ist neu. Was tust du zuerst?",
        "Über den bisherigen AG-Kontakt nachfragen.",
        [
          "Den Anhang als Test an eine Freundin schicken.",
          "Den Anhang öffnen, um den Absender zu prüfen.",
        ],
        "Der bekannte Kontakt erlaubt eine unabhängige Prüfung.",
        "Benutze einen Weg, den du bereits kennst.",
      ),
    ],
    [
      cc(
        "Eine angeblich kostenlose Lernprobe verlangt Zahlungsdaten und erwähnt im Kleingedruckten eine Folgegebühr. Wie gehst du vor?",
        "Preis, Laufzeit und Kündigung klären, bevor du Daten eingibst.",
        [
          "Die Kosten später anhand der ersten Abbuchung prüfen.",
          "Nur schauen, ob die Seite ein schönes Schlosssymbol zeigt.",
        ],
        "Eine verschlüsselte Seite kann trotzdem kostenpflichtige Bedingungen haben.",
        "Technischer Schutz und Vertragsbedingungen sind verschiedene Fragen.",
      ),
      cc(
        "Ein Programm behauptet, deine Bilder schneller zu sortieren. Eine vertraute Quelle kennt den Anbieter nicht. Welche Abwägung passt?",
        "Ich prüfe die Herkunft und nutze gegebenenfalls eine freigegebene Alternative.",
        [
          "Ich starte es, weil der Dateiname freundlich klingt.",
          "Ich schalte Warnungen aus, um es schneller zu testen.",
        ],
        "Ein plausibler Zweck allein sagt nichts über die tatsächlichen Aktionen eines Programms.",
        "Prüfe Herkunft und Berechtigungen.",
      ),
    ],
  ],
  [
    [
      cc(
        "Welche Zugangskombination bietet zusätzlichen Schutz, wenn ein Passwort bekannt wird?",
        "Eigenes Passwort und zweiter Faktor",
        ["Dasselbe Passwort an zwei Stellen", "Ein öffentlich notiertes Ersatzpasswort"],
        "Der zweite Faktor dient als weitere Prüfung bei der Anmeldung.",
        "Überlege, was nach Kenntnis des Passworts noch fehlt.",
      ),
      cc(
        "Dein Tablet meldet ein Update für das Betriebssystem. Wozu kann das Sicherheitsupdate dienen?",
        "Es kann bekannte Sicherheitslücken schließen.",
        ["Es gibt dem Browser ein neues Passwort.", "Es ersetzt alle Freigaben für Fotos."],
        "Updates können Fehler beheben, bevor diese weiter ausgenutzt werden.",
        "Das Update ändert die Software auf dem Gerät.",
      ),
    ],
    [
      cc(
        "Ein zweifelhaftes Profil kennt deinen Namen und fordert einen Anmeldecode. Wie prüfst du die Aufforderung?",
        "Über den vertrauten Dienst oder einen bekannten offiziellen Kontakt nachfragen.",
        ["Den Code senden, weil der Name stimmt.", "Den Code in der Klasse zur Prüfung posten."],
        "Ein Name allein beweist keine Identität. Der Code kann einen Zugang bestätigen.",
        "Nutze einen Kontaktweg, der vom Profil unabhängig ist.",
      ),
      cc(
        "Du hast eine verdächtige Passwortanfrage erhalten und den Link geöffnet, aber keine Daten eingegeben. Wie gehst du mit der Aufforderung um?",
        "Die Seite schließen und den Dienst über den üblichen Einstieg aufrufen.",
        ["Zum Test ein bekanntes Passwort eingeben.", "Den Link als sicheren Zugang speichern."],
        "Der übliche Einstieg umgeht die zweifelhafte Anfrage.",
        "Verwende den bekannten Weg, nicht den zurückgesendeten Link.",
      ),
    ],
  ],
];
