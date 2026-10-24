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

## Prüfung vor dem PR

Am 24.10.2026 auf `origin/main` (`a20c297`) geprüft:

- Im Paket: `npm ci --offline`, `npm run typecheck`, `npm test`,
  `npm run build`, `npm run package:zip`. Die 114 Tests in vier Dateien bestehen;
  darunter erreichbare, anfänglich offene Ziele für alle 36 Fallwerkstätten,
  die ausführbaren Modelle, Direktlinks und die lokale Fortschrittsspeicherung.
- Am Repo-Root: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`
  besteht mit 30 Tests. `node scripts/build-catalog.mjs <temporäre Ausgabe>`
  erstellt den Katalog.
- Mit `ZAM_CORE` auf den veröffentlichten `zam-core@0.54.0`:
  `node scripts/validate-cells.mjs` installiert alle 21 Zellen erfolgreich;
  `node informatik-realschule-10/scripts/validate-cell.mjs` prüft die oben
  beschriebenen unveränderten Bestandskarten und die neue Zelle.
- Der gebaute Einzeldatei-Lernpfad wurde über `npm run preview -- --host 127.0.0.1 --port 5196`
  im Browser geprüft: 36 Lektionen auf beiden Niveaus in heller und dunkler
  Ansicht (144 Ansichten), Lernpfad, Quellen und alle zehn ausführbaren
  Werkstätten in beiden Ansichten. DOM-Abgleich und Sichtprüfung der Aufnahmen
  zeigen die passenden Aufgaben und keinen horizontalen Überlauf bei 886 px
  Fensterbreite. Erfolgreiche Fallzuordnung, Selbsteinschätzung, Wiederöffnen
  und Rücknahme nach Änderung wurden zusätzlich durchgespielt.
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
