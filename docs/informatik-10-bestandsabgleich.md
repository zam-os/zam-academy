# Informatik 10 · Bestandsabgleich

Stand: 24. Oktober 2026. Das neue Paket liegt unter
[`informatik-realschule-10/`](../informatik-realschule-10/): 36 Lektionen,
72 Karten, fünf wählbare IT-Vertiefungen. Noch nicht veröffentlicht oder in
ZAM synchronisiert.

## Fachliche Zuordnung

Das [ISB-Fachprofil Informationstechnologie](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it)
und der [jahrgangsübergreifende LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/it)
weisen die Module des Aufbauunterrichts aus. Ein allgemeiner verbindlicher
„Informatik-10-Lehrplan“ lässt sich daraus nicht ableiten. Die fünf gewählten
Module 2.5.2, 2.6.2, 2.7.1, 2.7.2 und 2.7.3 sind Wahlmodule. Das Paket eignet
sich als Vertiefung für Klasse 10; die Schule legt fest, was davon wann im
Unterricht eingesetzt wird. Die [Abdeckungsmatrix](../informatik-realschule-10/coverage.json)
führt alle 19 Kompetenzerwartungen dieser fünf Module mit ihren digitalen
Übungen und zusätzlichen praktischen Aufgaben auf.

## Vorhandene Pakete behalten ihren Auftrag

| Paket | Bisheriger Auftrag | Verhältnis zum neuen Angebot |
| --- | --- | --- |
| Algorithmen | IT 2.6.1, textuelle Grundbausteine und Debugging | Grundlage für eigene Klassenmethoden; kein Nachfolger und keine Kopie der bestehenden Karten |
| Datennetze | IT 2.5.1 und zusätzliche HTTPS-Lektion | Infrastrukturgrundlagen; die neue 2.5.2-Vertiefung behandelt Kommunikationsurteile, Datenschutz sowie Filter und Verbindungsprüfung |
| SQL | IT 2.3.1 / 2.3.2 | Weiterhin eigene Datenbankwerkstatt; wird vom neuen Lernpfad verlinkt |
| UML | Freie Modellierung und Diagramme | Ergänzendes Zeichenwerkzeug für standardisierte Modelle; keine pauschale Deckung des neuen Softwaremoduls allein durch den Link |
| Ehemalige kombinierte IT-9-Zelle | Bereits ausdrücklich auf Algorithmen und Datennetze verteilt | Das am 21.10.2026 genehmigte [bestehende Mapping](it-bestandsabgleich.md) wird weder erweitert noch erneut angewendet |

Im geprüften Bestand gibt es keine eigene aktive bayerische IT-10-Altzelle,
deren Karten dieses neue Paket ablöst. Thematische Überschneidung zu HTTPS,
Klassen oder Algorithmen rechtfertigt keine automatische Lernstandsübertragung.
Die neue Zelle enthält deshalb weder `replaces` noch `retired_items` und benötigt
keine Freigabe eines historischen Mappings. Keine Freigabe anderer Pakete wird
hierfür übernommen oder behauptet.

## Prüfbarer Umgang mit Lernständen

`informatik-realschule-10/scripts/validate-cell.mjs` verwendet nur temporäre
Bibliotheken. Mit dem veröffentlichten `zam-core@0.54.0` geprüft:

- Vier bestehende IT-Karten mit insgesamt acht echten Ratings bleiben bei
  wiederholter Installation des neuen Pakets in sämtlichen Karten- und
  Reviewfeldern unverändert.
- Das Installieren der neuen Zelle erzeugt keine persönlichen Karten.
- Die ausdrückliche Kartenerzeugung fügt 72 neue Karten ohne Wiederholungen
  oder Stabilität hinzu; erneutes Installieren und Erzeugen dupliziert nichts.
- Jede der 72 neuen Quellen führt zur vorgesehenen Lektion derselben App.

Die Prüfung wird in CI mit demselben gepinnten veröffentlichten Kern ausgeführt
wie die übrigen Academy-Zellprüfungen. Die eigentliche Aufnahme bleibt eine
Handlung der lernenden Person in ZAM. Die App-Modulauswahl filtert lediglich
den Lernpfad; eine Aufnahme der ganzen Zelle umfasst alle 72 Karten.

## Veröffentlichung

App und Zelle werden zusammen geprüft. Der Katalog entdeckt die neue Zelle
automatisch, CI und Pages enthalten sie in ihren App-Listen. Nach einer
ausdrücklich beauftragten Veröffentlichung kann ein ZAM-Release sie über
`npm run academy:sync` übernehmen. Keine gebündelte Zelle wird hier von Hand
bearbeitet oder vorzeitig ersetzt.

## Prüfung des PR-Standes nach den Reviews

Am 24.10.2026 den PR-Zweig auf Basis von `origin/main` (`a20c297`) geprüft:

- Im Paket: `npm ci --offline`, `npm run typecheck`, `npm test`,
  `npm run build`, `npm run package:zip`. Die 121 Tests in vier Dateien bestehen;
  darunter erreichbare, anfänglich offene Ziele für alle 36 Fallwerkstätten,
  die ausführbaren Modelle, Direktlinks und die lokale Fortschrittsspeicherung.
- Am Repo-Root: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`
  besteht mit 30 Tests. `node scripts/build-catalog.mjs <temporäre Ausgabe>`
  erstellt den Katalog.
- Mit `ZAM_CORE` auf den veröffentlichten `zam-core@0.54.0`:
  `node scripts/validate-cells.mjs` installiert alle 21 Zellen erfolgreich;
  `node informatik-realschule-10/scripts/validate-cell.mjs` prüft die oben
  beschriebenen unveränderten Bestandskarten und die neue Zelle.
- Der gebaute Einzeldatei-Lernpfad wurde über `npm run preview -- --host 127.0.0.1 --port 5200`
  im Browser geprüft: 36 Lektionen auf beiden Niveaus in heller und dunkler
  Ansicht (144 Ansichten), Lernpfad, Quellen und alle zehn ausführbaren
  Werkstätten in beiden Ansichten. DOM-Abgleich und Sichtprüfung der Aufnahmen
  zeigen die passenden Aufgaben und keinen horizontalen Überlauf bei 1280 px
  Fensterbreite. Erfolgreiche Fallzuordnung, Selbsteinschätzung, Wiederöffnen
  und Rücknahme nach Änderung wurden zusätzlich durchgespielt.
- Das Paket wurde zusätzlich ohne andere Academy-Pakete in einen temporären
  Ordner kopiert: `npm ci --offline`, `npm test` und `npm run build` bestehen
  dort ebenfalls. Die Pakettests benötigen keinen vollständigen Repo-Checkout.
- Eine unabhängige Agentenprüfung hat zu Regressionstests für zu breite
  Firewall-Freigaben, Navigation aus Query-Direktlinks, ungelöste Startzustände
  und aufeinanderfolgende Kontoabbuchungen geführt. Eine unklare Zuordnung
  von Objektbezeichnungen wurde ebenfalls berichtigt.

Der Browsercheck verwendet den unveränderten Produktionsbuild über lokales HTTP.
`file://` und die betriebssystemspezifischen ZIP-Starter wurden nicht im Browser
bzw. auf ihren Zielsystemen ausgeführt. Die ZIP-Prüfung vergleicht stattdessen
HTML-Bytes und fehlende externe Laufzeitressourcen. Reale Robotik, freie
standardisierte Diagramme und die in der Abdeckungsmatrix genannten zusätzlichen
Unterrichtsleistungen bleiben außerhalb dieser digitalen Nachweise.

## Bearbeitung beider Reviews vom 24.10.2026

Berücksichtigt sind die beiden ausführlichen PR-Kommentare
[erste Fachprüfung](https://github.com/zam-os/zam-academy/pull/42#issuecomment-6386109236)
und [späteres Gemini-Review](https://github.com/zam-os/zam-academy/pull/42#issuecomment-6386312615)
sowie die drei Inline-Befunde. Die Korrekturen erfolgen vor der ersten
Veröffentlichung; sämtliche 108 IDs und 36 Lektionsanker bleiben erhalten.

| Befund | Korrektur und Nachweis |
| --- | --- |
| Sensorziel mit festem Weg lösbar | Alle Höfe müssen erreicht werden und mindestens ein blockierter Sensorwert muss den Bewegungsweg beeinflussen. Ein begrenzter Gegenlauf mit stets freiem Sensor prüft diese Wirkung. Feste Route und identische Zweige scheitern im Test und Browser; eine reaktive Lösung besteht. |
| Mehrdeutiger RS-Fall | Die Werkstatt fragt nach Setzen, Rücksetzen, Halten und verbotenem Eingang. Setzen bei Q = 1 lässt den Wert gleich; das wird ausdrücklich erklärt. Regression gegen `rsLatch` und gelöste Browserzuordnung. |
| Falsche KI-Vergleichszahl | Der Transferauftrag nennt nun den reproduzierbaren Vergleich: Tiefe 4 mit 12/12 und 5/6, Tiefe 1 mit 11/12 und 6/6. Test berechnet die Werte mit dem Trainer und prüft den Aufgabentext. Zelle neu erzeugt. |
| Türsensor-Widerspruch | Start A = 1 und geschlossene Tür B = 0 erlauben den Motor. Test prüft den deutschen Term für geschlossene und offene Tür; Karte und Lektion sind synchron. |
| Offizielle Modulnamen und Kompetenzen | Modulnamen in App, Zelle und Abdeckung stimmen mit dem aktuellen Fachlehrplan überein. Die 19 `competence`-Texte sind der amtliche Wortlaut nach dem dortigen Satzanfang; nur Leerzeichen wurden vereinheitlicht. Eigene Kurzfassungen und Nachweise stehen in getrennten Feldern. Direkter LehrplanPLUS-Abgleich am 24.10.2026. |
| Zustandsloser Filter und Rückverkehr | Achte Anschauungsprobe für ein mögliches Rückpaket ergänzt. Die App benennt, dass alle Eingänge einschließlich möglicher Antworten gesperrt sind und die Übungsregel allein keinen nutzbaren Webzugang herstellt. TLS-Eigenschaften werden getrennt geprüft. |
| Deutsche Fachsprache und Ausgaben | UND, ODER, NICHT in Erklärungen, Karten und Gatterbaum; Parser akzeptiert deutsche und bestehende englische Eingaben. Objekttests verwenden `fmt()` mit Komma und echtem Minus; Hofname korrigiert. |
| Schnellchecks und Niveaus | 36 eigene Erklärungen begründen die Antwort und typische Verwechslungen. Ungeeignete Distraktoren wurden ersetzt. Alle 36 Levelpaare fachlich gelesen: Level 2 verlangt je nach Thema Transfer, Gegenprobe, Vertragsentwurf oder begründetes Urteil; Tests prüfen zusätzlich unterschiedliche Musterlösungen und Beurteilungskriterien. Das ersetzt keine menschliche Didaktikprüfung. |
| Test- und Formatierungshinweise | Logiktests nutzen unabhängig aufgelöste Wertetabellen; tatsächliche Netzwerk-Startregeln werden geprüft. Der Import des Nachbarpakets entfällt. Portliste sortiert; Registrierungsformat bereinigt. Zweifache `npm run cell:generate` ergibt bytegleiches `cell.json`. |

Die erneute unabhängige Agentenprüfung der Korrekturen fand keine weiteren
materiellen Fehler. Die neue Browserprüfung verwendet Port 5200; die Erstprüfung
lief auf dem damaligen temporären Vorschauport 5196. Der Inhaltsgenerator bleibt
die Schreibstelle für die projizierten Karten; `cell.json` wird anschließend
nicht von Hand umformatiert. Der Academy-Rücklink folgt unverändert dem Muster
der übrigen Pakete und öffnet im selben Tab.
