# Deutsch 8 · Bestandsabgleich

Stand: 28. Oktober 2026. Das neue
[Deutsch-8-Paket](../deutsch-realschule-8/) ergänzt ZAM Academy um 40 Lektionen
und 80 Karten. Dieser PR bereitet seine erste Veröffentlichung vor.

## Abdeckung

Der gemeinsame [LehrplanPLUS Deutsch 8, Realschule
Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/deutsch)
enthält 59 Kompetenzerwartungen in 14 Abschnitten. Die
[Matrix](../deutsch-realschule-8/coverage.json) ordnet jede Erwartung zu und
nennt zusätzliche Leistungen. Hörtexte, Vorträge, Interviews, Debatten,
Inszenierung und Filmvergleich, eigene Recherche, echte Bildimpulse,
Jugendbuch-Ganzschrift, Originallektüre und Schreibgespräche bleiben
praktische Aufgaben. Ein App-Abschluss bestätigt Bearbeitung und
Selbsteinschätzung, keine vollständige Kompetenz oder Prüfungsnote.

## Vorhandene Argumentationszelle

Ausgangspunkt:
`de-by:realschule-8-deutsch-begruendete-stellungnahme-eroerterung`.
Eine bytegenaue Testkopie liegt unter
`deutsch-realschule-8/tests/fixtures/de-by-deutsch-8.json`.

| Alte Karte | Geprüfter Inhalt | Verhältnis zur neuen Zelle |
| --- | --- | --- |
| `01K4D8E0000000000000000J01` | Drei Bestandteile des 3B-Schemas nennen | Neuer Schnellcheck unterscheidet Veranschaulichung und Nachweis. Kein identischer Abruf. |
| `01K4D8E0000000000000000J02` | Mehrteilige Erklärung und Wasserspenderargument | Neue Karten trennen Funktion, Belegprüfung und Anwendung. Ungesicherte Zahlen und eine angebliche Studie aus der alten Musterlösung werden nicht als Tatsachen übernommen. |
| `01K4D8E0000000000000000J03` | Steigernde Argumentfolge nennen | Neuer Gliederungscheck prüft die Orientierung am Schreibauftrag, keine feste Reihenfolge. |
| `01K4D8E0000000000000000J04` | Mehrteiliger Aufbau einer linearen Erörterung | Neue Karten prüfen begrenzte Teilhandlungen. Die alte Vermischung von Sanduhr und linearer Steigerung sowie feste Argumentzahlen sind keine übernommenen Pflichtregeln. |

`replaces-de-by.json` dokumentiert jede Altfrage mit Begründung als C-Zeile, `status:
proposal-only`, `approved: null` und `action: keep-active`. Die Quelle ist `zam-os/zam`
am Commit `b6fdcfecb6160b02e14e8914455c9a0414f8c81a`; der SHA-256 der LF-Datei steht
beim Quellpfad.

Die Altzelle wird durch diese Arbeit nicht geändert oder stillgelegt. Die
neue Zelle besitzt ausschließlich neue ULIDs, keine Ersetzungen und keine
Stilllegungen. Sie übernimmt keine Lernstände anhand von Fragen-, Slug- oder
Themenähnlichkeit. Eine spätere fachliche Revision der Altzelle wäre ein
getrennter Auftrag mit eigener Entscheidung über bestehende Lernstände.
Deutsch 9 und 10 bleiben ebenfalls unverändert.

## Prüfen der Lernstände

`deutsch-realschule-8/scripts/validate-cell.mjs` installiert die alte Zelle in
einer temporären Bibliothek, legt zu jeder alten Frage eine Karte an und
vergibt zwei echte Ratings im Format `recall`. Danach installiert es die neue
Zelle wiederholt und vergleicht sämtliche Karten- und Reviewfelder.

Die 80 neuen Karten werden anschließend explizit angelegt. Vier alte Karten
und acht Reviews müssen identisch bleiben, neue Karten mit null Reviews und
null Stabilität beginnen. Wiederholtes Installieren und Anlegen dupliziert
nichts. Jede neue Quelle muss zur passenden Lektion führen. Die CI verwendet
dafür den veröffentlichten `zam-core@0.54.0`; eine persönliche Bibliothek wird
nicht geöffnet.

## Veröffentlichung

App, Zelle und Offline-ZIP werden gemeinsam geprüft. Die CI- und Pages-Listen enthalten
den neuen App-Namen; `academy.json` registriert Fach, Jahrgang, Schulart sowie 40
Lektionen und 80 Karten. Der Atlas nutzt diese Registrierung; sein Quelltext wird nicht
kopiert oder ersetzt.
Der Katalog entdeckt die Zelle und bildet den Hash der publizierten Bytes.
Der PR veröffentlicht noch nichts; nach einem späteren Merge führt der vorhandene
Pages-Workflow die Veröffentlichung aus. Eine spätere Übernahme in ZAM erfolgt
über den üblichen Academy-Sync nach Veröffentlichung.

## Lehrplanbelege

`deutsch-realschule-8/tests/fixtures/official-curriculum.json` hält alle 59
am 28.10.2026 gelesenen Kompetenzerwartungen in ihrer Reihenfolge wortgetreu
fest. `coverage.json` folgt dem gemeinsamen Schema und nennt zu jeder Zeile
konkrete Lektionen, Übungsnachweis und zusätzliche Leistungen. Ein Vergleich
mit D7 markiert bekannte Satzstrukturen als Wiederholung. D9 vertieft unter
anderem Gesellschaftskritik und eine Ganzschrift des 19./beginnenden
20. Jahrhunderts; das wird im neuen Paket nicht als Deutsch-8-Pflicht ausgegeben.

## Prüfstand des PRs

Die ausgeführten Befehle und ihre Ergebnisse stehen in der PR-Beschreibung.
Tests prüfen die Zuordnung zu allen 59 Erwartungen, unveränderte IDs und
Anker, erreichbare Fallentscheidungen, getrennte Schreibentwürfe und
Abschlüsse pro Niveau, fehlerhaften Browserspeicher und Direktlinks. Der
Lernstandscheck vergleicht außerdem den Hash der bytegenauen Altzellenkopie.

Die Browserprüfung des ursprünglichen Entwurfs vom 27.10.2026 umfasste alle
40 Lektionen auf beiden Niveaus sowie einen vollständigen Übungsablauf mit
Neuladen und anschließender Textänderung. Für den PR wurden die gebaute
HTML-Ausgabe und die angepassten Ansichten erneut geprüft. Die zusätzlichen
Unterrichtsleistungen gehören nicht zur technischen Prüfung.

Am 28.10.2026 besteht die PR-Fassung mit folgenden Nachweisen:

- Im Paket: `npm ci --offline --no-audit --no-fund`, `npm run typecheck`,
  `npm test` (87 Tests) und `npm run package:zip` einschließlich Build und
  Prüfung der drei Starter sowie der bytegleichen Einzeldatei.
- Im Repository: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`
  (38 Tests), `ZAM_CORE=… node scripts/validate-cells.mjs` (33 Zellen),
  `ZAM_CORE=… node deutsch-realschule-8/scripts/validate-cell.mjs` und
  `node scripts/build-catalog.mjs /private/tmp/deutsch8-pr-catalog.json`.
  `ZAM_CORE` verweist auf den separat installierten `zam-core@0.54.0`.
- Die gebaute HTML-Ausgabe wurde über die lokale Build-Vorschau geöffnet:
  40 Lektionen × zwei Aufgabenstufen × zwei Farbschemata mit Kontrolle von
  Erklärung, Merksatz, Schnellcheck, Fällen und dem jeweils richtigen
  Schreibauftrag. Lernpfad und Literaturansicht wurden zusätzlich visuell
  geprüft, ebenso die Quellenansicht und der Academy-Rücklink.
- Der vollständige Mustervergleich besteht nach Neuladen fort. Textänderung
  entfernt den Abschluss. Aus `#level=1` und `?level=1` bleibt ein auf dem
  Lernpfad gewähltes Level 2 auch nach Neuladen erhalten.
- Die unabhängige Zweitprüfung fand einen Fehler bei diesem Stufenwechsel
  und drei alleinstehende Karten mit fehlendem Textkontext. Beide Punkte
  wurden behoben, erneut geprüft und von der Zweitprüfung bestätigt.

Die Dateiansicht `file://` ist in der verfügbaren Browseroberfläche gesperrt.
Die Browserprüfung verwendet deshalb ausschließlich die gebaute HTML-Datei
über die lokale Vorschau. Windows-, macOS- und Linux-Starter wurden nicht
auf allen Zielbetriebssystemen praktisch ausgeführt. Das ZIP-Prüfskript
prüft ihre Inhalte und die Shellsyntax, keine Betriebssystemintegration.

## Review-Korrekturen vom 28.10.2026

- Falsche Schnellcheck-Antworten zeigen einen neutralen Hinweis; die
  Erklärung mit der Zielform erscheint erst nach der richtigen Wahl.
- Drei Mustertexte wurden korrigiert: Zitatintegration ohne unpassenden
  Konjunktiv, unveränderte Lage des Schuhs im Bildimpuls und eine klare
  Erklärung von Wunsch und höflicher Bitte.
- Nicht abgeschickte Falländerungen überschreiben den letzten geprüften
  Stand nicht mehr. Erst das Abschicken ersetzt die beiden Entscheidungen.
- Jeder Tab gleicht seine Änderungen mit dem neuesten gespeicherten Stand
  ab. Ausdrückliche Quiz-, Fall- und Vergleichsentscheidungen werden auch
  dann berücksichtigt, wenn ihr Wert dem alten Stand entspricht. Eine
  Bestätigung wird nicht auf einen fremd geänderten Text übertragen.
- Der vollständige Lesen/Zusammenführen/Schreiben-Schritt läuft mit Web Locks
  unter einer gemeinsamen Sperre. Ohne verfügbare Sperr-API bleibt der
  Zusammenführungsweg nutzbar, schützt aber nicht atomar vor wirklich
  überlappenden Zugriffen. Gleichzeitige Änderungen am selben Text folgen
  weiterhin der zuletzt gespeicherten Fassung.
- Die tatsächlich installierte Altzelle wird aus denselben gehashten Bytes
  gelesen. Datei, ID, Version sowie sämtliche Mapping-Zeilen werden gegen
  diese Quelle geprüft. Die Vitest-Prüfung sichert dieselben Identitäten.
- Live-Link und Zweigbezeichnung in der README und ein doppeltes „und“ in
  der Offline-Anleitung wurden korrigiert.

Die Tests führen jetzt auch die tatsächlichen Seiten-Handler in einer kleinen
DOM-/Ereignis-Fixture ohne zusätzliche Abhängigkeit aus. Sie prüfen unter
anderem alte Level-Parameter, lösungsfreie Fehlerrückmeldung, nicht
abgeschickte Fälle sowie neuere Entwürfe und explizite Antworten anderer Tabs.
Die Speicherprüfung umfasst parallele Sperranfragen, die Warteschlange
A1/B1/A2, bereits quittierte doppelte Speicherungen und Fehlversuche mit
anschließendem erneuten Speichern. Jeder Speicheraufruf hält seinen eigenen
Stand fest; neuere lokale Aktionen bleiben bis zu ihrer Speicherung erhalten.

Die gebaute Review-Fassung wurde auf Port 5280 zusätzlich geprüft: beide
Tabs behielten ihre Entwürfe und Bestätigungen nach fremdem Speichern und
Neuladen; ein nicht abgeschickter Fall-Fehlklick überstand den Stufenwechsel
mit beiden zuvor geprüften Antworten. Alle drei korrigierten Mustertexte
wurden in der App geöffnet. Auch Lernpfad-Häkchen, Stufenzähler und
Weiterüben-Ziel werden nach dem asynchronen Zusammenführen aktualisiert;
ein Handler-Test mit verzögerter Sperre und die gebaute App prüfen dies.
Die unabhängige Nachprüfung meldet keine verbleibenden Findings.

Als separate Folgearbeit bleibt der Rückport des Stufenwechsel-Fixes und
des Schutzes vor veralteten Tab-Ständen nach Deutsch 10, Geographie 8 und
Biologie 8. Diese anderen Pakete werden in diesem PR nicht verändert.
