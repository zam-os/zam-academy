# Informatik 8 · Realschule Bayern

**40 Lektionen in neun Etappen, 87 ZAM-Karten.** Das Paket deckt den
IT-Anfangsunterricht (Lernbereich 1, Module 1.1–1.9) des
[LehrplanPLUS Informationstechnologie](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/it)
ab. Laut [Fachprofil](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it)
ist dieser Anfangsunterricht für **alle Wahlpflichtfächergruppen** verbindlich,
beginnt je nach Schule in Jahrgangsstufe 5, 6 oder 7 und ist **spätestens mit
Ende der Jahrgangsstufe 8 abgeschlossen** (Kompetenzniveau I). Deshalb gibt es
einen gemeinsamen Lernpfad ohne Zweig-Filter. Welche Module eine Schule in
welcher Klasse unterrichtet, entscheidet sie selbst. Lehrplan geprüft am
27.10.2026; Zuordnung aller 35 Kompetenzerwartungen in [coverage.json](coverage.json).

| Etappe | Modul | Lektionen | Werkstätten |
| --- | --- | ---: | --- |
| 1 Texterfassung | IT 1.1 | 4 | Griffwege, Fehleranalyse, Überschrift formatieren, Arbeitsplatz einstellen |
| 2 Einführung in die Programmierung | IT 1.2 | 5 | Rasenroboter, Ereignisse, Kassenprogramm, Lüftersteuerung, Schleifenroboter |
| 3 Einführung in die Textverarbeitung | IT 1.3 | 4 | Schreibtempo, DIN 5008, Textobjekte, Layout |
| 4 Informationsaustausch | IT 1.4 | 6 | Kommunikationsmodell, Bitschalter, ASCII/Morse, Digitalisierung, Gefahren, Datenschutzfälle |
| 5 Einführung in die Bildbearbeitung | IT 1.5 | 4 | Zoom Pixel/Vektor, Bildgröße, Vektorhaus, Diagramm-Manipulation |
| 6 Einführung in die Tabellenkalkulation | IT 1.6 | 5 | Datentypen, Formel kopieren, Funktionen, Datenfluss MwSt, Diagrammwahl |
| 7 Informationsbeschaffung und -präsentation | IT 1.7 | 4 | Suchanfrage, CC-Lizenzen, Foliengestaltung, Vortragsverhalten |
| 8 Grundlagen elektronischer Datenverarbeitung | IT 1.8 | 4 | EVA-Bauteile, Ordnerbaum, Softwarelizenzen, Passwortstärke |
| 9 Digitale Medien | IT 1.9 | 4 | Werkzeugwahl, Netiquette, Geräte-Check, Datenspuren |

Jede Lektion hat eine Erklärung mit Beispiel und Merksatz, Fachbegriffe, einen
Schnellcheck mit drei Antworten, eine Werkstatt mit drei Aufträgen (keiner zu
Beginn erfüllt) und zwei Aufgabengeneratoren auf zwei Niveaus: Level 1 mit
Hilfe, Level 2 als Transferaufgabe. Eine Lektion ist abgeschlossen, wenn der
Schnellcheck stimmt, alle Werkstattaufträge erfüllt und drei Aufgaben auf
Level 1 gelöst sind; drei Level-2-Aufgaben ergeben das Transferabzeichen.
Fortschritt und Hell/Dunkel-Einstellung bleiben in `localStorage`.

## Grenzen

Die App bereitet die Arbeit am echten Gerät vor, ersetzt sie aber nicht:
Blindschreiben und die Abschrift mit 80 Anschlägen pro Minute, eigene Programme
in einer Entwicklungsumgebung, eigene Dokumente, Bilder, Tabellen und
Präsentationen sowie Recherche und Vortrag vor der Gruppe gehören in den
Unterricht. Rechtliche Hinweise (Urheberrecht, Recht am eigenen Bild, DSGVO,
Lizenzen) sind vereinfachte Schulmodelle, keine Rechtsberatung. Die
Passwort-Werkstatt rechnet mit angenommenen 10¹⁰ Versuchen pro Sekunde.

Der Aufbauunterricht (2.x) liegt in eigenen Paketen:
[Algorithmen](../algorithmen/) (2.6.1), [Datennetze](../datennetze/) (2.5.1),
[SQL](../sql/) (2.3) und [Informatik 10](../informatik-realschule-10/).

## ZAM-Zelle und Bestandskarten

`cell.json` (`zam-academy:informatik-realschule-8`, Version 2026.10.2) hat ein
Atom je Lektion und zitiert jede Lektion als `#lesson=<id>`. ZAM enthält drei
ältere Zellen zum Thema (`de-by:realschule-6/7/8-informatik-…`, 24 Karten).
[`replaces-de-by.json`](replaces-de-by.json) ordnet jede alte Karte einer
Kategorie zu (10 A, 1 B, 13 C); Thomas hat die Zuordnung am 27.10.2026
freigegeben. Die elf A/B-Nachfolger übernehmen per `replaces` den Lernverlauf,
die 13 C-Karten gehen per `retired_items` aus den aktiven Wiederholungen, ihre
Historie bleibt erhalten. Begründung in
[docs/informatik-8-bestandsabgleich.md](../docs/informatik-8-bestandsabgleich.md).

## Entwickeln

```bash
npm ci
npm run dev        # http://localhost:5211/informatik-realschule-8/
npm test
npm run build      # Einzeldatei in dist/index.html
npm run package:zip
```

Zellprüfung mit dem in CI gepinnten zam-core:

```bash
ZAM_CORE=<file URL von zam-core/dist/index.js> node scripts/validate-migration.mjs
```
