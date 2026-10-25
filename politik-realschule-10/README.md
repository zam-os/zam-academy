# Politik und Gesellschaft 10 · Realschule Bayern

Lokaler, unveröffentlichter Entwurf mit **32 Lektionen, 64 Fallentscheidungen,
64 eigenen Aufgaben auf zwei Niveaus und 64 ZAM-Karten**. Ein gemeinsamer
Lernpfad für alle Wahlpflichtfächergruppen nach dem
[LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/pug).

| Lernbereich | Lektionen | Schwerpunkt |
| --- | ---: | --- |
| 1 Methoden und Arbeitstechniken | 6 | Verfassungsarbeit, Medienkritik, Quellen, Karikatur, Debatte und Erkundung |
| 2 Politische Mitwirkungsmöglichkeiten | 8 | Parteien, Medien, Volksgesetzgebung, Verbände, Wahlen, EU und Globalisierung |
| 3 Politische Strukturen | 10 | Grundrechte, Abwägung, Rechts- und Sozialstaat, parlamentarisches System, Organe, Gesetzgebung, Föderalismus, Bayern und wehrhafte Demokratie |
| 4 Politische, gesellschaftliche und wirtschaftliche Handlungsfelder | 8 | BIP, Konjunktur, Fiskalpolitik, Leitzins, politische Urteile, Soziale Marktwirtschaft, Lebensqualität und Frieden |

Abgleich: **25. Oktober 2026**. [coverage.json](coverage.json) ordnet alle
27 Kompetenzerwartungen (9 / 7 / 6 / 5) den Lektionen zu und benennt pro
Erwartung ergänzende Praxis. Kurzfassungen sind eigene Zusammenfassungen;
`rows[].position` zählt innerhalb eines Lernbereichs und ist kein amtlicher Untercode.
`guided` bezeichnet begrenzte Übung, `preparation` die Vorbereitung zusätzlicher
Leistungen. Die Zahl der zugeordneten Erwartungen ist kein vollständiger
Kompetenznachweis. Methoden werden auch in den Sachbereichen angewandt.

Der Direktabruf des Lehrplans zeigte teilweise einen Wartungshinweis; der
Fachlehrplan war über den aktuellen Suchindex abrufbar. Regeln wurden zusätzlich
mit den verlinkten Primärquellen geprüft. Das Paket enthält keine aktuellen
Amtsinhabernamen, Parteiempfehlungen oder behaupteten Live-Wirtschaftsdaten.

## Lernen und eigenes Urteil

Jede Lektion bietet Erklärung, eigenes fiktives Material, Schnellcheck,
zwei Fallentscheidungen und je eine eigene Aufgabe pro Niveau mit
Vergleichsantwort und drei Kriterien. Level 1 übt Anwendung, Level 2 vertieft
Vergleich, Urteil oder eigenständige Recherche.

Als bearbeitet zählt eine Lektion auf dem gewählten Niveau nach richtigem
Schnellcheck, zwei richtigen Fällen und bestätigtem Mustervergleich der eigenen
Antwort. Eine Mindestlänge von 20 Zeichen öffnet lediglich den Vergleich.
**Die App bewertet keine politischen Meinungen und benotet eigene Texte nicht.**
Muster sind mögliche Lösungen. Gute begründete Urteile dürfen anders ausfallen.

Entwürfe und Fortschritt werden getrennt von anderen Apps lokal im Browser
gehalten. Beide Niveaus haben eigene Entwürfe und Abschlüsse. Änderungen am
Entwurf entfernen dessen Selbsteinschätzung; veränderte Fallantworten und
falsche Schnellchecks entfernen den betreffenden Nachweis. Bei gesperrtem
Speicher bleibt der Besuch nutzbar und zeigt einen Hinweis.

## Werkstätten und Originaldarstellung

- Eine eigene lokale SVG-Karikatur stellt ein Beteiligungsversprechen einer
  Sitzungsleitung einer bereits abgelaufenen Redezeit gegenüber. Titel und
  Beschreibung machen sie auch ohne Bild zugänglich. Sie ist kein historisches
  Original und kein Beleg über einen tatsächlichen politischen Vorgang.
- Die Budgetwerkstatt verteilt höchstens 100 Punkte auf Bus, Grün und Kultur.
  Drei erfundene Ratsgruppen mit 40, 35 und 25 Sitzen stimmen nach offengelegten
  Mindestwerten geschlossen zu. Zwei verschiedene Kompromisse sind erreichbar;
  alle Mindestforderungen zusammen übersteigen das Budget. Es gibt keine
  automatisch beste politische Lösung, keine Enthaltungen, Pflichtausgaben
  oder wirkliche Verhandlung. Eine Budgetüberschreitung erzeugt keine Mehrheit.
- Das Einproduktmodell trennt Preis- und Mengenänderung gegenüber 100 Einheiten
  zu 10 Euro. Die Balken teilen dieselbe Skala und zeigen die numerischen Werte.
  Es ist keine vollständige BIP-Rechnung und keine Prognose. Ungültige Eingaben
  werden abgefangen. Werkstatteinstellungen sind beim erneuten Öffnen der
  Lektion zurückgesetzt und gehören nicht zum Abschlussnachweis.

## Zusätzliche Praxis

Aktuelle journalistische Formen einschließlich Rundfunk, Quellenvergleiche,
reale Karikaturen und Satire, gemeinsame Debatten und szenische Rollenspiele,
eine tatsächliche politische Erkundung sowie eigene Präsentation bleiben
zusätzliche Leistungen. Aktuelle EU-Entscheidungen, Produktionsbedingungen,
Wirtschaftsindikatoren und deutsche Außenpolitik erfordern echte datierte
Recherche. Fiktive Muster beantworten diese Aufgaben nicht stellvertretend.

Beim Bundestagswahlrecht berücksichtigt die App die seit 2025 geltende
Zweitstimmendeckung für Parteibewerber. Sie berechnet keine Sitzverteilung,
Sperrklauseln oder deren Ausnahmen. Die Volksgesetzgebung in Bayern wird von
kommunalen Bürgerbegehren getrennt. Konkrete Rechtsfälle und geltende Regeln
müssen anhand aktueller amtlicher Quellen geprüft werden.

## Zelle und vorhandene Lernstände

[cell.json](cell.json) enthält 32 Atome und 64 Wiederholungsfragen. Jede Karte
verlinkt die passende Lektion unter
`https://academy.zam-os.org/politik-realschule-10/#lesson=<id>`.
Die Lehrplanbindungen verwenden `pug`, Realschule, Jahrgang 10 und `lb1` bis
`lb4`. Weiche Voraussetzungen blockieren keine Lektion. IDs wurden einmal mit `ulid()` vergeben und sind in der unabhängigen
Fixture `tests/fixtures/public-contract.json` festgehalten. Kartenwortlaut,
Schnellcheck und Musterlösung stehen ausschließlich in `cell.json`. Die App
liest daraus ihre passenden Lernchecks und Merksätze. Es gibt keinen zweiten
Kartenkatalog oder Textgenerator.

Der [Bestandsabgleich](../docs/politik-10-bestandsabgleich.md) fand kein
vorhandenes PuG-10-Paket im geprüften ZAM-/Academy-Bestand. Die neue Zelle
enthält weder `replaces` noch `retired_items`. Überschneidende Themen in
Geographie, Geschichte oder Wirtschaft begründen keine Übernahme persönlicher
Beherrschung. Veröffentlichung stabilisiert IDs, Slugs und Lektionsanker.

## Entwicklung und Prüfung

```sh
npm ci
npm run dev          # http://localhost:5206/politik-realschule-10/
npm test
npm run typecheck
npm run package:zip
```

Die vier Entwicklungswerkzeuge und deren Lockfile werden unverändert aus dem
vorhandenen Academy-Werkzeugbestand übernommen; keine neue Bibliothek.
Der Build liefert eine selbständige HTML-Datei. Das Offline-ZIP enthält
Starter für Windows, macOS und Linux sowie eine Startanleitung. Die Prüfung
vergleicht HTML-Bytes und kontrolliert Starter sowie Shellsyntax; native
Starter werden nicht auf allen Zielsystemen ausgeführt.

Mit dem veröffentlichten und in CI gepinnten `zam-core@0.54.0`:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Diese zusätzliche Integration nutzt nur eine temporäre Bibliothek und die
bestehende Geo9-Zelle im Nachbarordner: Zwei persönliche Karten mit vier
Bewertungen bleiben unverändert, während die neue Zelle installiert und
anschließend explizit mit 64 frischen Karten aufgenommen wird. Wiederholte
Installation und Aufnahme sind idempotent. Installation allein erzeugt keine
persönlichen Karten. Unit-Tests und Build brauchen kein Nachbarpaket.

CI, Pages und die Academy-Registrierung kennen das neue Paket; der Katalog entdeckt
es über seine Zelle. Veröffentlichung und die spätere Übernahme in ein
ZAM-Release bleiben gesonderte Schritte. Keine gebündelte Zelle in `zam` wurde
hier geändert. Ohne Konten, Telemetrie, Hintergrundabrufe oder externe Fonts;
Quellen öffnen erst auf Klick. Die App sendet keine politischen Beiträge.
