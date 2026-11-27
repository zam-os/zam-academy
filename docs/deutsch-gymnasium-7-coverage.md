# Deutsch 7 Gymnasium: Lehrplanabdeckung und Bestandsabgleich

Das Paket deckt den gemeinsamen bayerischen [Fachlehrplan Deutsch 7 Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/deutsch) ab (abgerufen am 21. November 2026). Im Fach Deutsch gilt derselbe Fachlehrplan für alle Ausbildungsrichtungen des Gymnasiums ohne gesonderte Stundenzuweisung je Lernbereich; das Paket dokumentiert daher `hours: null`.

Die [Abdeckungsmatrix](../deutsch-gymnasium-7/coverage.json) führt alle 46 Kompetenzerwartungen in Reihenfolge des Fachlehrplans wortgetreu (nach Whitespace-Normalisierung) auf. Jede Zeile benennt zugehörige Lektionen, konkrete Evidenz sowie `implemented` (30 Zeilen) bzw. `supported` (16 Zeilen für Aktivitäten außerhalb der App). Alle 50 Lektionen sind mindestens einer Erwartung zugeordnet.

Die gespeicherte Lehrplan-HTML-Seite hat die SHA-256-Prüfsumme
`1a22edafca61a5db9a0d591e795e07a806a6fe38da45f592b6be5e2462b2230b`.
`npm run check:curriculum` prüft diese Prüfsumme, sämtliche 46 Wortlaute, die benachbarten Jahrgangsstufen 6 und 8, beide Altbestands-Fixtures sowie beide Audio-/Transkript-Paare. Alle sechs externen Nachschlage- und Quellenlinks sind mit abgerufenen Seitentiteln und SHA-256-Werten in [source-checks.json](../deutsch-gymnasium-7/source-checks.json) belegt.

| Lernbereich | Lektionen | Abgedeckte Schwerpunkte |
| --- | ---: | --- |
| Sprechen und Zuhören | 10 | Synthetische Hörbeispiele (Debatte & Schulfunk), Redeabsichten, Kurzreferat, anschauliches mündliches Schildern, folgerichtiges Berichten, Vortragszeichen, Entschuldigung & Anliegen, Rollendiskussion, szenischer Dialog & Standbild |
| Lesen und Medien | 14 | Überfliegen/Layoutsignale, Figurenkonstellation & Handlungsstruktur (`d7-strukturierungshilfen`), Balladen-Gattungstrias an Goethes *Erlkönig*, Kurzgeschichte, Entstehungszeit, lyrische Sprachmittel, Mittelalterlyrik (Walther von der Vogelweide), Jugendbuch-Rezension, Diagramm-/Umfrageauswertung, Textfunktionen, Bericht/Reportage/Feature, Print-/Online-Werbung, Suchstrategien, Jugendmedien & Netiquette |
| Schreiben | 10 | Äußere Form & Formulare, Zitieren/Paraphrasieren/indirekte Rede, Schreibplan & Mindmap, sinnliches Schildern, Textsortenwechsel, Inhaltsangabe mit TATT-Basissatz, Vorgangsbeschreibung, textbezogene Stellungnahme, lineare Argumentation im sachlichen Brief, Schreibkonferenz |
| Sprache und Rechtschreibung | 16 | Veränderbare Sprachmodelle: Bedeutungswandel, Wirkung von Sprachmitteln (`4.1.2`), Textsorten & Sprache als System, Umgebungssprachen, Lehnwörter, Konjunktiv I/II & abgestufte Modalität, Attributformen (prä-/postnominal, Partizip, Apposition), konjunktionale Verknüpfungen (konditional, konzessiv, konsekutiv, adversativ), Satzgefüge, Infinitiv-/Partizipialkommas, Zitieren & Apostroph, Groß-/Kleinschreibung, Getrennt-/Zusammenschreibung und Fehleranalyse mit Wörterbuchbezug |

Jede Lektion bietet Erklärung, Beispiel, Merksatz, Visualisierung oder Sprachmodell mit drei Erkundungszielen, Schnellprüfung mit drei Optionen, zwei Fallentscheidungen und getrennte Aufgaben auf Niveau 1 (geführt) und Niveau 2 (Transfer). Freie Entwürfe im Textfeld werden im `localStorage` unter `deutsch_gym7_progress_v1` ausschließlich lokal auf dem Gerät gespeichert (mit Hinweismarker `ⓘ Wo bleibt mein Entwurf?` direkt am Eingabefeld) und über *Fortschritt zurücksetzen* mitgelöscht; die App bewertet oder versendet keine freien Texte.

## Abgrenzung zu Jgst. 6 und 8

Die gespeicherten Vergleichssnapshots umfassen [Deutsch 6 Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/deutsch) (`fb5d31cd0cf361eb79a43257f8f53d27ecec751b26544965610dcb5ecb17502c0`) und [Deutsch 8 Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/deutsch) (`a19261fa2cae35265dbd7f9111360d6ca40664720f1b2eda63d07e292a589a92`).

- **Voraussetzungen aus Jgst. 6**: Wortarten, Satzglieder, Aktiv/Passiv (Vorgangs- und Zustandspassiv), Tempora sowie Grundformen von Adverbial- und Relativsätzen baut das Paket als bekannt voraus und festigt sie punktuell.
- **Schwerpunkte in Jgst. 7**: Mittelalterlyrik/Balladen, lineare Argumentation und sachlicher Brief, Konjunktiv I/II in der indirekten Rede sowie Graduierung von Modalität, konditionale/konzessive/konsekutive/adversative Gefüge, erweiterte Attribute (Partizipialkonstruktionen, Appositionen) und Kommasetzung bei Infinitiv-/Partizipialgruppen sowie nachgestellten genaueren Bestimmungen.
- **Ausgeschlossene Jgst.-8-Inhalte**: Dialektische Erörterung (Sanduhr/Ping-Pong), Leserbrief, Kommunikationsmodell, Varietätenanalyse (Dialekt vs. Jugendsprache im Systemvergleich) und Fiktionalitätssignale verbleiben in Klasse 8.

## Aktivitäten außerhalb der App

Die lokal mit der Computerstimme *Anna* erzeugten Übungsaufnahmen (`debatte.wav`, `rundfunk.wav`) dienen als modellierte Hörimpulse und ersetzen keine authentischen Hörfunk-/Gesprächssituationen. Reale Klassendiskussionen, freie Kurzvorträge, szenisches Spiel, Arbeit am Textverarbeitungsprogramm, eigenständige Bibliotheks-/Webrecherche, Schreibkonferenzen sowie die vollständige Lektüre mindestens einer altersgemäßen Ganzschrift bleiben Aufgaben des Unterrichts (`status: "supported"`).

Das Paket startet gemäß `publication.json` mit `"status": "ready"` und `"version": "0.0"` (Lehrkraftprüfung und Erklärvideos noch offen; keine Erklärvideos bei Erstveröffentlichung).

## Bestandsabgleich bestehender ZAM-Karten (`approved`)

Die [freigegebene Zuordnung](../deutsch-gymnasium-7/replaces-de-by.json) (`status: "approved"`, `approved: "2026-11-22"`) inventarisiert alle acht Karten aus beiden bestehenden Grade-7-Gymnasium-Zellen in `zam-os/zam` (Commit `d83ea3b2f93609b7ed25432c1cb37774dc59c537`):

- `de-by:gymnasium-7-deutsch-konjunktiv-indirekte-rede-passiv-syntax` (`01K4D7G0000000000000000J01`–`J04`, SHA-256 `d00483db8b14e221103c95e61fe98ac3a0a96089c16872daa9bf3bd07686fd2b`)
- `de-by:gymnasium-7-deutsch-texte-inhaltsangabe-ballade-interpretation` (`01K4D7T0000000000000000J01`–`J04`, SHA-256 `92cd2f75ace32acc2b0744d3d2fcb464d055afa8893e6194ad57ca873eac2d07`)

Drei Kategorie-A-Übernahmen (von Thomas am 2026-11-22 freigegeben, mit `replaces` in `cell.json`):
- `01K4D7G0000000000000000J01` → `d7-indikativ-konjunktiv-rede-check` (Konjunktiv I als Standardmodus für distanzierte indirekte Rede).
- `01K4D7T0000000000000000J01` → `d7-inhaltsangabe-check` (die vier Pflichtbestandteile des Basissatzes: Titel, Autor, Textsorte, Thema).
- `01K4D7T0000000000000000J03` → `d7-gattungen-ballade-check` (Ballade als Verbindung aus Epik, Lyrik und Dramatik).

Fünf Kategorie-C-Einträge (`keep-active`):
- `01K4D7G0000000000000000J02` (bündelt K-I-Endungen, Ersatzregel-Kaskade, K-II und Umformung in einer Frage),
- `01K4D7G0000000000000000J03` (Zustandspassiv gehört laut `D6 4.2.3` in Klasse 6 und wird dort bereits als `keep-active` geführt),
- `01K4D7G0000000000000000J04` (Sammelabruf aus Aktiv/Passiv über fünf Zeitformen plus Infinitivkomma; ebenfalls in `deutsch-gymnasium-6` als `keep-active` inventarisiert),
- `01K4D7T0000000000000000J02` (gesamte Aufbaustruktur der Inhaltsangabe samt Modell in einer Frage),
- `01K4D7T0000000000000000J04` (Sammelabruf aus Gattungstrias, Balladenuntertypen über Goethe/Schiller/Fontane und Interpretationsdreischritt).

**Hinweis zur Überschneidung mit Klasse 6**: `deutsch-gymnasium-6` führt die vier Karten `01K4D7G0000000000000000J01`–`J04` nur informatorisch als Kategorie C (`keep-active`), weil Konjunktiv I/II in Klasse 7 liegt. Durch die Freigabe übernimmt `deutsch-gymnasium-7` `01K4D7G0000000000000000J01` via `replaces`; `cell.json` deklariert keine `retired_items`.

## Verifikation

Aus `deutsch-gymnasium-7`:

```sh
npm ci && npx tsc --noEmit && npm test && npm run check:curriculum && npm run build && npm run package:zip && npm run test:browser
```

Aus dem Wurzelverzeichnis (mit `ZAM_CORE` auf das im CI gepinnte `zam-core`):

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/package-version.test.mjs scripts/changed-apps.test.mjs
node scripts/package-version.mjs check origin/main
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node deutsch-gymnasium-7/scripts/validate-cell.mjs
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node deutsch-gymnasium-7/scripts/validate-migration.mjs
```
