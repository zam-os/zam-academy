# Datennetze und Internet / Networks and the Internet · ZAM Academy

Ein Netzwerk selbst konfigurieren, eine Webanfrage verfolgen und Verbindungsfehler eingrenzen: **18 Kernlektionen**, eine gekennzeichnete HTTPS-Ergänzung, **38 ZAM-Karten** und **sieben Laboraufträge**.

Die App richtet sich nach **LehrplanPLUS Realschule Bayern, IT 2.5.1 Datennetze I** (ca. 14 Unterrichtsstunden). Informationstechnologie ist jahrgangsübergreifend modular aufgebaut; die URL mit `/9/` bedeutet keine feste Zuordnung zur 9. Klasse oder zu Zweig I. Die [Abdeckungsmatrix](coverage.json) ordnet die Kompetenzen und Inhalte zu und nennt Grenzen.

## Lernen und ausprobieren

- **Lernpfad:** Komponenten und Medien wählen, Topologien und Durchsatz verstehen, IP und MAC unterscheiden, Subnetze, Gateway, DHCP und DNS anwenden, Ethernet, TCP/UDP, HTTP und SMTP einordnen.
- **Netzwerklabor:** Client und Webserver in zwei festen Netzen konfigurieren; Verbindungen herstellen oder unterbrechen; DNS-, Ping-, HTTP- und HTTPS-Tests vergleichen. Ein Protokollband zeigt den Ablauf und die erste Fehlerstelle.
- **Adress- und Datenratenwerkzeug:** IPv4-Subnetze bis zu den Sonderfällen /31 und /32 berechnen sowie Dateigröße, Datenrate und Nutzanteil in eine Modellzeit übersetzen.
- **Fortschritt:** Kurzprüfung und Anwendung gemeinsam zählen eine Lektion als bearbeitet. Die sieben Laboraufträge prüfen die tatsächliche Konfiguration und den geforderten Dienst. Sichtbare Antwortoptionen werden reproduzierbar gemischt.

Die sieben Aufträge behandeln Gateway, DNS-Eintrag, Clientpräfix, Kabelverbindung, Serverrückroute, Zertifikatsnamen und einen gesperrten Webport. Die HTTPS-Lektion ist eine Ergänzung; sie beansprucht **keine vollständige Abdeckung von IT 2.5.2 Datennetze II**.

## Deutsch und Englisch

Alle 19 Lektionen, Aufgaben und Rückmeldungen sowie Laboraufträge, Protokollspuren, Werkzeuge und Dialoge sind über **DE / EN** vollständig umschaltbar. Damit eignet sich das Modul auch als englischer Auffrischungskurs für Kollegen. Sprache, Lektion und Lernstand verwenden dieselben stabilen IDs; beim Wechsel bleiben eingegebene Netzwerkeinstellungen, ausgewählter Laborauftrag und noch nicht abgeschickte Werkzeugwerte erhalten.

Englischer Direktlink: [DNS lesson](https://academy.zam-os.org/datennetze/#lesson=net-dns&lang=en). Ein explizites `lang=en` oder `lang=de` hat Vorrang vor der gespeicherten Sprachwahl; unbekannte Sprachwerte fallen auf Deutsch zurück. Ohne Sprachparameter gilt die lokal gespeicherte Wahl. Das gilt auch für die Offline-HTML-Datei, etwa `ZAM-Academy-Datennetze.html#lesson=net-dns&lang=en`.

Die **38 ZAM-Karten bleiben derzeit deutsch**, wie in den vorhandenen zweisprachigen SQL- und UML-Angeboten. Beide Sprachfassungen erklären dieselben Inhalte, ändern keine Kartenidentitäten und übertragen keine Lernstände durch die Übersetzung. Die Lern-App ist unabhängig von der Sprache der ZAM-Karten nutzbar.

## Entwicklung

```sh
npm ci
npm run dev           # http://localhost:5190/datennetze/
npm test
npm run typecheck
npm run build
npm run package:zip
```

Die Produktion besteht aus einer einzigen HTML-Datei. Das Offline-Paket `release/ZAM-Academy-Datennetze-offline.zip` enthält die App und Startdateien für Windows, macOS und Linux. Nach dem Entpacken kann die HTML-Datei direkt im Browser geöffnet werden.

Es werden ausschließlich bereits im Academy-Repository verwendete Entwicklungsabhängigkeiten eingesetzt. Das Labor benötigt keine weitere Laufzeitbibliothek.

## ZAM-Zelle und Altbestand

`cell.json` ist die einzige Kartenquelle. Jede Karte verlinkt auf `https://academy.zam-os.org/datennetze/#lesson=<stabile-id>`. Lektion-IDs, Karten-IDs und Slugs werden ab der ersten Veröffentlichung als stabil behandelt.

Die vorbereitete Zuordnung zur alten Zelle `de-by:realschule-9-informatik-algorithmen-strukturen` steht in `replaces-de-by.json`. Datennetze besitzt die zwei bisherigen Netzwerkabrufe; Algorithmen besitzt die anderen sechs. Die sichere DNS-Einzelabfrage kann ihre Historie übernehmen. Die alte Netzwerk-Synthesefrage enthält eine unzulässige TCP-Fehlerfreiheitsgarantie und wird ohne Übertrag des Beherrschungsstands korrigiert. Karten und Review-Ereignisse bleiben erhalten. Die genaue Zuordnung und Veröffentlichung werden gemeinsam im Academy-Änderungssatz vorbereitet; ein noch ausstehendes Freigabedatum darf nicht durch ein Datum ersetzt werden, bevor Thomas die konkrete Zuordnung freigibt.

## Verifikation und Grenzen

Die Tests prüfen Subnetzgrenzen einschließlich /0 und /31, ungültige Adressen, echte Ende-zu-Ende-Fehler, DNS unabhängig vom Webserver, Rückrouten, Port- und TLS-Fehler, erfolgreiche gezielte Reparaturen, semantischen Auftragsabschluss, Zellen- und Quellenverknüpfung, Antwortreihenfolge und robustes Speichern. Der veröffentlichte ZAM-Kern validiert die Zelle zusätzlich im gemeinsamen Repository-Check.

Das Labor ist ein ausdrücklich vereinfachtes Modell: feste Router-Schnittstellen, keine echten Anfragen, kein NAT, keine freie Routingtabelle und keine echte Kryptografie. SMTP und Medienwahl werden durch Fallaufgaben erschlossen; reale Verkabelung und Unterrichtspraxis werden dadurch nicht ersetzt.

## Quellen

Fachliche Grundlage: [LehrplanPLUS IT](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it), geprüft am 21. Oktober 2026. Technische Primärquellen stehen in `coverage.json`, darunter die IETF-Spezifikationen für DNS, DHCP, TCP, HTTP und TLS. Die Erläuterungen und Übungsfälle sind eigenständig verfasst.

## Datenschutz

Keine Konten, Tracker, Cookies oder Drittanfragen. Fortschritt und Laborzustand bleiben im lokalen Speicher dieses Browsers. Bei gesperrtem Speicher ist Üben weiterhin möglich; eine Meldung weist auf die fehlende dauerhafte Speicherung hin. Externe Quellen öffnen nur nach einem Klick.

## English quick start

Choose **EN** in the header for the complete English learning path, all seven network challenges, diagnostic traces and calculators. Open the built HTML file directly to work offline. A direct link such as `#lesson=net-dns&lang=en` chooses English explicitly. Switching languages preserves your lesson, answers in progress, network settings and tool values.

The course covers the modular Bavarian Realschule IT 2.5.1 curriculum (Networks I), with a clearly marked HTTPS extension. It is also suitable as a professional refresher. It does not claim full coverage of IT 2.5.2. The simulator uses fixed teaching networks and performs no real network operations. Current ZAM retention cards remain in German.
