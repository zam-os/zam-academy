# Rückport von Stufenwahl und Fortschrittsspeicherung

Folgearbeit zu [Academy-PR #64](https://github.com/zam-os/zam-academy/pull/64),
umgesetzt für Deutsch 10, Biologie 8 und Geographie 8.

## Fehler und Verhalten

Ein Einstieg mit `?level=1` oder `#level=1` konnte nach einer Wahl von Level 2
auf dem Lernpfad beim Neuladen wieder Level 1 erzwingen. Die Stufenwahl führt
nun durch `navigate()` und bereinigt die alten Parameter. Andere Parameter
wie `from=zam` bleiben erhalten.

Zuvor überschrieb jeder Tab den gesamten gespeicherten Fortschritt mit seinem
eigenen Stand. Jetzt führt jeder Speicheraufruf ausschließlich ausdrücklich
veränderte Quizantworten, Fallentscheidungen, Entwürfe und Bestätigungen mit
dem neuesten gespeicherten Stand zusammen. Eine Antwort zählt auch dann als
neue Entscheidung, wenn sie dem früheren Stand dieses Tabs entspricht.
Bestätigungen gelten nur für den Text, der tatsächlich verglichen wurde.

Jeder Aufruf hält einen unveränderlichen Stand und Aktionsrevisionen fest.
Ältere oder bereits quittierte Aufrufe können neuere Eingaben nicht übernehmen
und später versehentlich verdrängen. Bei verfügbarer Web-Locks-API läuft der
gesamte Lesen-/Zusammenführen-/Schreiben-Schritt unter einer gemeinsamen Sperre.
Ohne nutzbare Sperr-API bleibt die Zusammenführung verfügbar, schützt aber
nicht atomar vor überlappenden Zugriffen. Bei Änderungen desselben Texts gilt
die zuletzt gespeicherte Textänderung.

Nicht abgeschickte Falländerungen lassen die zuletzt geprüfte Fassung
bestehen. Erst „Entscheidungen prüfen“ ersetzt sie. Nach asynchronem
Zusammenführen werden auch Lernpfad-Häkchen, Stufenzähler und Weiterüben-Ziel
aktualisiert. Bei fremd geändertem Entwurf wird die sichtbare Textfassung
aktualisiert und ein veralteter Mustervergleich geschlossen.

Geographie 8 führt zusätzlich die Felder des gemeinsamen Recherchehefts
zusammen. Eine Änderung an Ort, Frage oder Quelle verdrängt kein anderes
Projektfeld. Die geöffnete Projektansicht übernimmt die zusammengeführten Werte.

Die Karten, IDs, Zellen, Mapping-Entscheidungen und Abhängigkeiten wurden
nicht verändert. Die bisherige Schnellcheck-Erklärung der drei Pakete ist
nicht Teil dieses Rückports.

## Nachweise

In jedem der drei Pakete ausgeführt:

- `npm ci --offline --no-audit --no-fund`
- `npm run typecheck`
- `npm test`: Deutsch 10 **72**, Biologie 8 **68**, Geographie 8 **74** Tests
- `npm run package:zip`: Build, eigenständige HTML-Datei, bytegleicher
  ZIP-Inhalt, drei Starter und Shellsyntax erfolgreich

Die neuen Tests führen die tatsächlichen `main.ts`-Handler in einer kleinen
DOM-/Ereignis-Fixture ohne neue Abhängigkeit aus. Sie laden die bereinigte
Route mit dem gespeicherten Stand erneut, prüfen ungesendete Falländerungen,
Textbestätigungen und einen verzögerten Merge bis zum nächsten Übungsziel.
Speichertests prüfen unter anderem parallele Tabs, A1/B1/A2 in der
Sperrwarteschlange, doppelt quittierte Aufrufe, Reset und Fehler mit erneutem
Speichern. Geographie prüft Projektfelder zusätzlich in Speicher- und
Handler-Tests.

Im Repository ausgeführt:

- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  **38 Tests** bestanden.
- `ZAM_CORE=file:///private/tmp/deutsch8-pr-core/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs`:
  alle **33 Zellen** mit dem in CI gepinnten `zam-core@0.54.0` geprüft.
- Biome auf den geänderten TypeScript-Dateien: formatiert; keine Fehler,
  bestehende Hinweise zu Non-null-Assertions in Biologie unverändert.
- `git diff --check`: erfolgreich.

Die gebauten HTML-Dateien wurden über lokale Vorschauen auf den Ports
5281/5282/5283 geprüft. Alle drei Pakete behalten Level 2 nach Neuladen bei
beiden alten Einstiegsformen. Je zwei echte Tabs behalten ihre getrennten
Entwürfe und Bestätigungen nach gegenseitigem Speichern und Neuladen.
Geprüfte Fälle überstehen einen nicht abgeschickten Fehlklick und den
Stufenwechsel. Im Geographie-Rechercheheft wurden Ort in Tab A und Frage in
Tab B eingegeben; beide Felder sind in der sichtbaren Form und nach Neuladen
vorhanden. Die Browserprüfung beschränkt sich auf die betroffenen Abläufe;
sie ist keine erneute fachliche Prüfung aller unveränderten Lektionen.

Eine unabhängige zweite Agentprüfung hat alle drei Test- und Typecheck-Läufe
wiederholt und Speicherrevisionen, Projektfelder, Navigation, Bestätigung,
Reset sowie Fehler/Retry ohne weitere Findings geprüft.
