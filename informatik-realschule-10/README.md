# Informatik 10 · Realschule Bayern

Lokaler, noch unveröffentlichter Entwurf: **36 Lektionen, 72 Karten und fünf
Werkstattbereiche**. Das Paket verbindet Erklärungen, Schnellchecks, eigene
Antworten auf zwei Niveaus und ausführbare Aufträge. Einzeln startbare
Unteraufträge ergeben zehn ausführbare Werkstattaufgaben. Dazu kommt in jeder
der 36 Lektionen eine eigene Fallwerkstatt mit Rückmeldung zu allen Entscheidungen.
Die App bietet helle und dunkle Ansicht sowie eine eigene Akzentfarbe je Modul.

Der offizielle Name des Fachs ist **Informationstechnologie**. Sein
[LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/it)
gilt modular für die Jahrgangsstufen 5–10. Nach dem
[Fachprofil](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it)
sind alle fünf hier angebotenen Module Wahlmodule. Die Schule bestimmt Auswahl
und Zeitpunkt; „Klasse 10“ beschreibt die Zielgruppe dieses Vertiefungspakets,
keine allgemeingültige offizielle Jahrgangszuordnung. Die URL mit `/7/`
bezeichnet dieselbe jahrgangsübergreifende Modulstruktur. Abgleich:
**24. Oktober 2026**; genaue Zuordnung in [coverage.json](coverage.json).

| Modul | Lektionen | Werkstatt |
| --- | ---: | --- |
| IT 2.5.2 Datennetze II | 8 | Geordnete Filterregeln und getrennte Prüfung von Verschlüsselung, Vertrauen, Hostname und Zertifikatsgültigkeit |
| IT 2.6.2 Objektorientierte Softwareentwicklung | 7 | Eigene textuelle Klassenprogramme: unabhängige Zähler, Konto mit Vorbedingungen, Bruchaddition mit neuen Ergebnisobjekten |
| IT 2.7.1 Logische Schaltungen | 7 | Eigene Funktionsterme, alle acht Eingangsbelegungen, interaktiver Gatterbaum, Volladdierer und NOR-RS-Speicher |
| IT 2.7.2 Robotik und eingebettete Systeme | 6 | Eigene Programme mit Wiederholung und Freisensor, drei Höfe, schrittweise Ablaufspur und Modellthermostat |
| IT 2.7.3 Künstliche Intelligenz | 8 | Tatsächlich aus Beispielen gelernter Entscheidungsbaum mit Merkmalauswahl, Gini-Unreinheit, Tiefengrenze und getrenntem Vergleich |

## Lernpfad und Nachweise

Die Modulauswahl filtert den Lernpfad und erhält sämtliche Texte und Programme.
Direktlinks auf eine Lektion schalten deren Modul bei Bedarf wieder zu. Die
Grundlagenangebote [Algorithmen](../algorithmen/), [SQL](../sql/),
[Datennetze I](../datennetze/) und [UML](../uml/) bleiben eigene Pakete.

Eine Lektion zählt auf dem gewählten Level als bearbeitet, wenn ihr Schnellcheck
stimmt, alle Fälle der zugehörigen Fallwerkstatt richtig zugeordnet wurden, eine eigene Erklärung mit Musterlösung verglichen und anhand aller drei
Kriterien selbst eingeschätzt wurde und gegebenenfalls ihr Werkstattauftrag
bestanden ist. **Eigene Texte werden nicht automatisch bewertet.** Eine Änderung
nimmt die betreffende Selbsteinschätzung bzw. den betreffenden Werkstattabschluss
zurück. Texte und Abschlüsse bleiben lokal im Browser; bei gesperrtem Speicher
arbeitet die App weiter und zeigt einen sichtbaren Hinweis.

Bearbeitet bedeutet keinen Nachweis vollständiger Kompetenz. Freies Zeichnen
standardisierter Diagramme, reale Robotermontage und Sensorprüfung sowie
gemeinsame Präsentation und Diskussion bleiben ergänzende Unterrichtsleistungen.
Textverarbeitung, Tabellenkalkulation, CAD und Multimedia sind weitere
IT-Modulbereiche und werden hier nicht als abgedeckt ausgewiesen.

## Grenzen der ausführbaren Modelle

- Der Filter arbeitet zustandslos nach der ersten passenden Regel und weist
  standardmäßig ab. Sieben Anschauungsfälle werden durch Gegenproben für alle
  durch die Regeln unterscheidbaren Portklassen ergänzt. Das ist kein vollständiger
  DNS- oder Netzwerkstack. Es gibt keine echten Verbindungen oder kryptografischen
  Operationen. Portfreigabe, Transportschutz und ehrliche Inhalte werden getrennt.
- Der eigene Klasseninterpreter führt ausschließlich seinen geparsten
  JavaScript-Ausschnitt aus. Kein `eval`, `Function`, DOM- oder Netzwerkzugriff
  aus Lerncode. Eine Klasse mit Konstruktor, Methoden, Parametern,
  `this`-Attributen, Zahlen, booleschen Bedingungen, `if/else`, `return` und `new`
  für die eigene Klasse; keine vollständige Sprache oder IDE. Attributzugänge
  sind öffentlich. Grenzen: 12.000 Zeichen, 2.000 Rechenschritte, 60 neue Objekte.
- Schaltungen verwenden ideale Bits. Der Gatterbaum ist kein vollständiger
  normgerechter Schaltplan. Der NOR-RS-Zustand 11 ist ausdrücklich ungültig;
  nach gleichzeitigem Loslassen bleibt der Zustand unbestimmt, bis eindeutig
  gesetzt oder gelöscht wird. Reale Spannungen und Laufzeiten fehlen.
- Der Rasterroboter hat einen idealen Freisensor. Ein Zielkontakt beendet den
  Lauf automatisch. Die Rechtsdrehstrategie löst die drei Übungshöfe, nicht
  beliebige Labyrinthe. Grenzen: 6.000 Zeichen, acht Blockebenen, 1.500
  Anweisungen und 300 Bewegungen. Der Thermostat ist ein diskreter
  Zweipunktregler ohne Wärmephysik.
- Alle KI-Beispiele sind erfunden. Der Trainingsalgorithmus sieht ausschließlich
  ausgewählte Trainingsbeispiele. Die sechs disjunkten Vergleichsfälle werden
  erst danach ausgewertet. Ihre wiederholte Verwendung zur Modellwahl macht
  sie zu Validierungsdaten; ein unabhängiger Abschlusstest braucht frische Daten.
  Die kleine Aufgabe ist weder Einsatzfreigabe noch vollständige Fairnessprüfung.

## ZAM-Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **36 Atome und 72 Karten**, mit 33
ausdrücklichen harten Voraussetzungen zwischen den Atomen. Jede Karte zitiert
`https://academy.zam-os.org/informatik-realschule-10/#lesson=<id>`.
Die ganze Zelle umfasst nach der Aufnahme alle fünf Module unabhängig vom
App-Filter. Die offizielle Lehrplanbindung verwendet `subject: it` und genaue
Modulcodes, ohne erfundene Jahrgangs-, Zweig- oder Prüfungsbindung.

Das Paket enthält **keine** `replaces` oder `retired_items`. Es löst keine
bestehende IT-Zelle ab und überträgt keine Beherrschung. Der
[Bestandsabgleich](../docs/informatik-10-bestandsabgleich.md) dokumentiert die
Abgrenzung. `scripts/card-ids.json` hält die einmal mit `ulid()` vergebenen IDs;
`tests/fixtures/public-contract.json` pinnt sie gemeinsam mit den Lektionen.
`npm run cell:generate` aktualisiert den Inhalt unter Beibehaltung dieser IDs.
Nach erster Veröffentlichung sind weitere Änderungen nach den Academy-Regeln
zu versionieren und materiell zu klassifizieren.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5200/informatik-realschule-10/
npm test
npm run typecheck
npm run build
npm run package:zip
```

Die Werkzeugabhängigkeiten und der Lockfile-Stand entsprechen dem vorhandenen
Biologie-10-Paket; es gibt keine zusätzliche Abhängigkeit. Der Produktionsbuild
ist eine einzige HTML-Datei. Das ZIP enthält diese Datei sowie Starter für
Windows, macOS und Linux. Quellen und Verweise auf andere Apps brauchen erst
beim Anklicken eine Verbindung.

Mit dem veröffentlichten, in der Academy-CI gepinnten `zam-core@0.54.0`:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Diese Prüfung verwendet ausschließlich temporäre Bibliotheken. Sie installiert
die vier vorhandenen IT-Pakete, erzeugt je eine Karte mit zwei echten Ratings,
installiert das neue Paket wiederholt und vergleicht alle Kartenfelder sowie
alle acht Reviews. Installation allein erzeugt keine persönliche neue Karte.
Die ausdrückliche Erzeugung der 72 neuen Karten startet ohne Wiederholungen
oder Stabilität; Wiederholung erzeugt keine Duplikate. Die bestehenden vier
Lernstände bleiben bytegleich.

CI und Pages kennen das Paket. Veröffentlichung und anschließende Übernahme in
ein ZAM-Release sind gesonderte Schritte; dieses lokale Paket verändert keine
persönliche Bibliothek und keine gebündelten Dateien in `zam-os/zam`.
