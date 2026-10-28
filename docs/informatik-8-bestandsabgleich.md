# Informatik 8 · Lehrplanabgleich und Bestandsabgleich

Stand: 27. Oktober 2026. Paket: [`informatik-realschule-8/`](../informatik-realschule-8/),
40 Lektionen, 87 Karten, Zelle `zam-academy:informatik-realschule-8` Version 2026.10.3
mit der freigegebenen Kartenzuordnung und Bindungen an die Jahrgangsstufen 6, 7 und 8.

## Welcher Lehrplan gilt für „Informatik 8“?

Das Fach heißt an der bayerischen Realschule **Informationstechnologie** und hat
einen modularen, jahrgangsübergreifenden Fachlehrplan (Jgst. 5–10). Geprüft am
27.10.2026 direkt auf LehrplanPLUS (HTTP 200, kein Archivumweg nötig):

- [Fachlehrplan IT](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/it):
  „Aufgrund des modularen Aufbaus des Fachlehrplans in Informationstechnologie
  ist eine jahrgangsstufenweise Zuordnung der Module nicht möglich.“
- [Fachprofil IT](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it), Abschnitt 3:
  Der **Anfangsunterricht** aus neun Modulen zu je 14 Stunden ist für alle
  Schülerinnen und Schüler verbindlich, kann in Jgst. 5, 6 oder 7 beginnen und
  ist **spätestens mit Ende der Jahrgangsstufe 8 abgeschlossen** (Kompetenzniveau I).
  Der Aufbauunterricht (2.x) richtet sich nach den Wahlpflichtfächergruppen.

Daraus folgt der Zuschnitt: Informatik 8 = **Lernbereich 1 Anfangsunterricht,
Module 1.1–1.9**, gemeinsam für alle Wahlpflichtfächergruppen (kein Zweig-Filter,
in ZAM-Curricula ohne `track`). Welche Module eine Schule in welcher Klasse
unterrichtet, legt sie selbst fest. Der Aufbauunterricht liegt in anderen Paketen
(Algorithmen 2.6.1, Datennetze 2.5.1, SQL 2.3, Informatik 10 mit fünf Wahlmodulen)
und wird hier nicht wiederholt; Lektion 1.2 bereitet `algorithmen` vor.

### Bindung an die Jahrgangsstufen 6, 7 und 8 (ab 2026.10.3)

Die Zelle 2026.10.2 band jedes Atom nur an Jgst. 8. Mit der ZAM-Integration
(zam-os/zam#466) verlassen die drei alten Zellen für Jgst. 6, 7 und 8 das Bündel,
und Lernende der Jgst. 6 und 7 bekämen keinen Anfangsunterricht mehr angeboten.
Weil der Fachlehrplan die Module keiner Jahrgangsstufe zuordnet, trägt seit
Version 2026.10.3 jedes Atom dieselbe Modulbindung (`it-1.x`, ohne `track`,
`exam_relevant: false`) für Jgst. 6, 7 und 8. Geprüft am 27.10.2026:
`https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/{6,7}/it` antworten
mit HTTP 200 und liefern denselben Fachlehrplan („Realschule - 5, 6, 7, 8, 9, 10 -
Informationstechnologie“, Module 1.1–1.9, derselbe Satz zur fehlenden
Jahrgangszuordnung). ZAMs LehrplanPLUS-Manifest kennt `realschule|6|it` und
`realschule|7|it` bereits. Ids, Slugs, Karten, `replaces` und `retired_items`
bleiben unverändert. Jgst. 5, in der eine Schule laut Fachprofil ebenfalls
beginnen kann, ist nicht gebunden; die alten Zellen deckten sie auch nicht ab.

| Modul | Std. | Kompetenzerwartungen | Lektionen |
| --- | ---: | ---: | ---: |
| 1.1 Texterfassung | 14 | 4 | 4 |
| 1.2 Einführung in die Programmierung | 14 | 3 | 5 |
| 1.3 Einführung in die Textverarbeitung | 14 | 3 | 4 |
| 1.4 Informationsaustausch | 14 | 5 | 6 |
| 1.5 Einführung in die Bildbearbeitung | 14 | 4 | 4 |
| 1.6 Einführung in die Tabellenkalkulation | 14 | 4 | 5 |
| 1.7 Informationsbeschaffung und -präsentation | 14 | 4 | 4 |
| 1.8 Grundlagen elektronischer Datenverarbeitung | 14 | 4 | 4 |
| 1.9 Digitale Medien | 14 | 4 | 4 |

Alle 35 Kompetenzerwartungen stehen im Wortlaut in
[`coverage.json`](../informatik-realschule-8/coverage.json), jede mit Lektionen und
Nachweis; der Test `lessons-and-labs.test.ts` prüft, dass jede Kompetenz eine
Lektion des richtigen Moduls hat und jede Lektion eine Kompetenz. Was die App
nur vorbereitet (Blindschreiben mit 80 Anschlägen/Minute, eigene Programme,
Dokumente, Bilder, Tabellen, Präsentation und Vortrag), steht dort unter
`outside_app`.

## Bestehende ZAM-Karten

In zam-os/zam (`main` bei `b6fdcfe`) gibt es drei gebündelte Realschul-Zellen
zum Thema, zusammen 24 Karten. Sie ordnen ihre Inhalte festen Jahrgangsstufen
und „Lernbereichen“ zu, die es im modularen IT-Lehrplan so nicht gibt:

- `de-by:realschule-6-informatik-textverarbeitung-praesentation` (8 Karten)
- `de-by:realschule-7-informatik-informationsdarstellung-dateisystem` (8 Karten)
- `de-by:realschule-8-informatik-objektorientierung-vektorgrafik` (8 Karten)

Byte-genaue Kopien mit SHA-256 liegen in `informatik-realschule-8/tests/fixtures/`
und in `replaces-de-by.json` (`source_commit` b6fdcfecb6160b02e14e8914455c9a0414f8c81a).

### Freigegebene Zuordnung: 10 A · 1 B · 13 C

**Freigegeben von Thomas am 27.10.2026** in der Claude-Code-Session zu
zam-os/zam-academy#62: „Freigabe erteilt - und danach weiter mit ZAM-Integration“,
auf Rückfrage ausdrücklich bestätigt mit der Auswahl „Mapping + 13 C stilllegen“.
Der ursprüngliche Bauauftrag war noch keine Freigabe; der erste Stand des PRs
enthielt deshalb weder `replaces` noch `retired_items`.

`replaces-de-by.json` hat jetzt `"status": "approved"` und `"approved": "2026-10-27"`.
Die Zelle 2026.10.2 deklariert genau elf `replaces` (die A/B-Nachfolger) und
dreizehn `retired_items` (die C-Karten). Die Zelle wird erstmals mit dieser
Version veröffentlicht, es gibt also keine Zwischenzeit, in der jemand Karten auf
einer alten und ihrer neuen ID sammeln kann.

| Altkarte | Alte Frage | Kat. | Nachfolger | Begründung |
| --- | --- | --- | --- | --- |
| `J01` RS 6 | Welches der folgenden Formatattribute ist ein reines ABSATZFORMAT (wirkt auf den gesamt… | **A** | `it8-textobjekte-absatzattribut` | Gleicher Einzelabruf: Welches Attribut gilt für den ganzen Absatz? Antwort Zeilenabstand (Ausrichtung als weiteres Absatzattribut in der Lektion). |
| `J02` RS 6 | Unterscheide Zeichenformatierung (Attribute einzelner Buchstaben: Schriftart/Font, Schr… | **C** | – | Mehrteiliger Sammelabruf zu Zeichen- und Absatzformaten samt Formatvorlagen und Inhaltsverzeichnis; Formatvorlagen gehören nicht zum Anfangsunterricht 1.1–1.9. Keine Karte mit gleichem Gesamtumfang. |
| `J03` RS 6 | Welche Textumfluss-Einstellung (Zeilenumbruch) muss für ein Bild gewählt werden, damit… | **A** | `it8-layout-objekte-quadratisch` | Gleicher Einzelabruf: Textumbruch, bei dem der Text ein Bild rechteckig umfließt, Antwort Quadratisch. |
| `J04` RS 6 | Analysiere die verschiedenen Textumbruch-Arten für Grafiken in Textdokumenten: 1. 'Mit… | **C** | – | Sammelabruf zu fünf Textumbrucharten und Skalieren mit Umschalttaste; die neue Lektion behandelt Umbruch und Eckanfasser in getrennten Karten, kein gleicher Gesamtumfang. |
| `J05` RS 6 | Wofür steht die Gestaltungsregel des KISS-Prinzips bei der Erstellung von Präsentations… | **C** | – | Die Altkarte erklärt KISS als „Keep It Simple and Smart“; diese Auflösung ist nicht gesichert. Die neue Lektion lehrt die Gestaltungsregeln ohne das Akronym. |
| `J06` RS 6 | Formuliere die fünf Grundregeln für gelungene Präsentationsfolien (1. KISS-Prinzip & St… | **C** | – | Mehrteiliger Abruf von fünf Folienregeln (u. a. starre 7x7-Regel, Titel 32–40 pt) und Folienmaster; die neue Zelle fragt Folienmaster und Gestaltungsregeln getrennt und mit anderen Faustregeln. |
| `J07` RS 6 | Mit welchem Zeichen muss jede Formel oder Funktionsberechnung in einer Tabellenkalkulat… | **A** | `it8-formeln-bezuege-gleichheitszeichen` | Gleicher Einzelabruf: Womit beginnt jede Formel? Antwort Gleichheitszeichen. |
| `J08` RS 6 | Beschreibe die Struktur eines Tabellenblatts (Spalten mit Buchstaben A, B, C...; Zeilen… | **C** | – | Sammelabruf zu Tabellenstruktur, drei Datentypen und drei Funktionen; in der neuen Zelle auf Bereich, Datentypen und MITTELWERT aufgeteilt. |
| `J01` RS 7 | Was unterscheidet 'Information' von reinen 'Daten' in der Informatik? | **A** | `it8-kommunikationsmodell-daten-information` | Gleicher Einzelabruf: Unterschied Daten und Information, Antwort Information = Daten + Deutung im Zusammenhang. |
| `J02` RS 7 | Erkläre das informatische Dreigestirn aus Zeichen/Signal, Daten und Information anhand… | **C** | – | Mehrteiliger Abruf zu Zeichen/Daten/Information, Codierung sowie Syntax und Semantik; Syntax/Semantik ist kein Inhalt von 1.4, kein gleicher Gesamtumfang. |
| `J03` RS 7 | Welchen Dezimalwert besitzt die Binärzahl 1011_2? | **A** | `it8-dualsystem-1011` | Gleiche Aufgabe: Dezimalwert der Dualzahl 1011, Antwort 11. |
| `J04` RS 7 | Erkläre das Prinzip eines Stellenwertsystems am Vergleich von Dezimalsystem (Basis 10:… | **B** | `it8-dualsystem-stellenwert-umrechnung` | Ganzer alter Abruf (Stellenwertsysteme, 110101 → 53, 43 → 101011) mit Antwort und Musterlösung unverändert auf einer eigenen Nachfolgekarte; Inhalt von IT 1.4 (Stellenwertsysteme). |
| `J05` RS 7 | Wie viele verschiedene Zustände bzw. Zeichen können mit genau 1 Byte (8 Bit = 2^8) codi… | **A** | `it8-codierung-byte-256` | Gleicher Einzelabruf: Zeichen mit genau einem Byte, Antwort 256. |
| `J06` RS 7 | Definiere die Dateneinheiten Bit, Byte, KiB/KB, MiB/MB, GiB/GB, vergleiche den historis… | **C** | – | Sammelabruf zu Binärpräfixen (KiB/MiB/GiB), ASCII gegen UTF-8 und Bitmuster von A; UTF-8-Bytelängen gehen über den Anfangsunterricht hinaus, kein gleicher Gesamtumfang. |
| `J07` RS 7 | Womit beginnt ein 'absoluter Pfad' in einem hierarchischen Dateisystem immer? | **A** | `it8-betriebssystem-dateien-absoluter-pfad` | Gleicher Einzelabruf: Womit beginnt ein absoluter Pfad? Antwort Wurzelverzeichnis. |
| `J08` RS 7 | Modelliere ein hierarchisches Dateisystem als Baumstruktur (Wurzel, Ordner/Knoten, Date… | **C** | – | Sammelabruf zu Baumstruktur, relativen Pfaden mit . und .. und Dateiendungen; relative Pfade sind kein Inhalt von 1.8, keine gleiche Karte. |
| `J01` RS 8 | Wie wird in der Informatik die Gesamtheit aller aktuellen Attributwerte eines Objekts z… | **A** | `it8-textobjekte-zustand` | Gleicher Einzelabruf: Gesamtheit aller Attributwerte eines Objekts, Antwort Zustand; in 1.3 an den Objekten der Textverarbeitung gelehrt. |
| `J02` RS 8 | Erkläre die Grundbegriffe der objektorientierten Modellierung: Objekt (konkreter Gegens… | **C** | – | Mehrteiliger Erklärabruf zur objektorientierten Modellierung ohne Musterlösung; die neue Zelle fragt Objekte, Attribute und Punktnotation an Textobjekten, nicht an einem Grafikkreis. |
| `J03` RS 8 | Was beschreibt eine Methode im objektorientierten Paradigma? | **C** | – | Methoden im objektorientierten Paradigma gehören zu IT 2.6.2 (Aufbauunterricht), nicht zum Anfangsunterricht dieses Pakets. |
| `J04` RS 8 | Definiere den Begriff Klasse als 'Bauplan' (Schablone) für gleichartige Objekte, erläut… | **C** | – | Klassen, Methodenaufrufe und UML-Klassendiagramm gehören zu IT 2.6.2 (Aufbauunterricht), nicht zum Anfangsunterricht dieses Pakets. |
| `J05` RS 8 | Welcher entscheidende Vorteil zeichnet Vektorgrafiken (z. B. SVG) gegenüber pixelbasier… | **A** | `it8-pixel-vektor-skalierbar` | Gleicher Einzelabruf: Vorteil der Vektorgrafik beim Vergrößern, Antwort verlustfreie Skalierung ohne Treppeneffekt. |
| `J06` RS 8 | Vergleiche Vektorgrafiken (SVG, EPS) und Rastergrafiken (BMP, PNG, JPEG) systematisch h… | **C** | – | Systematischer Mehrfachvergleich nach vier Kriterien ohne Musterlösung; die neue Tier-2-Karte vergleicht Aufbau und Einsatz, nicht denselben Gesamtumfang. |
| `J07` RS 8 | Welche Farbe entsteht bei der additiven Farbmischung (RGB-Modell) durch die maximale Üb… | **A** | `it8-bildgroesse-formate-rgb-weiss` | Gleicher Einzelabruf: RGB (255, 255, 255) ergibt Weiß. |
| `J08` RS 8 | Unterscheide das additive Farbmodell (RGB: Bildschirme, Lichtfarben) vom subtraktiven F… | **C** | – | Kombinierter Abruf zu RGB/CMYK und einer Speicherberechnung 4000 × 3000 ohne Musterlösung; die neue Karte rechnet ein anderes Beispiel, kein gleicher Gesamtumfang. |

Wer dennoch Karten auf einer alten ID und ihrem Nachfolger hält (etwa aus einer
lokalen Installation des ersten PR-Stands), bei dem verweigert zam-core die
automatische Zusammenführung (geprüft, siehe unten).

## Nachweise

Alle Befehle am 27.10.2026 im Worktree auf Basis von `main` (`9db4f95`):

- Im Paket: `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`
  bestehen; `npm test` meldet 92 bestandene Tests in drei Dateien (Lehrplanbindung,
  alle 40 Werkstätten mit erreichbaren, anfangs offenen Zielen und sauberem SVG,
  alle 80 Generatoren auf beiden Niveaus mit 40 Seeds, Fortschritt, Zelle und
  Mapping). `node scripts/verify-release.mjs` prüft das Offline-ZIP.
- Am Repo-Root: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`
  → 38 bestanden; `node scripts/build-catalog.mjs <temp>` schreibt den Katalog mit 32 Zellen.
- Mit zam-core 0.54.0 (in CI gepinnt): `node scripts/validate-cells.mjs` installiert
  alle 32 Zellen, die kuratierten Ablenker der neuen Zelle bestehen
  `checkCandidate`/`checkShownSet`. `node informatik-realschule-8/scripts/validate-migration.mjs` (Stand 2026.10.3):
  Über drei Altzellen mit 24 bewerteten Karten installiert, wandern 11 Verläufe
  mit unverändertem FSRS-Zustand und allen Bewertungen zu ihren Nachfolgern,
  alle 24 alten IDs verlassen die aktiven Wiederholungen, die 48 Bewertungen
  bleiben erhalten; die Aufnahme legt 76 neue Karten an, Installation und Aufnahme
  sind wiederholbar; Karten auf alter und neuer ID zugleich führen zur Verweigerung
  der automatischen Zusammenführung. Das Upgrade einer Bibliothek von 2026.10.2 auf
  2026.10.3 lässt alle 100 Karten (87 aktiv, 13 stillgelegt) und 48 Bewertungen
  unverändert und legt keine Karte an.
- Browser: Das gebaute `dist/index.html` wurde mit headless Chrome über `file://`
  für alle 40 Lektionen auf beiden Niveaus gerendert (80 DOM-Abzüge: Titel,
  Erklärung mit Beispiel und Merke, Schnellcheck, Werkstatt-SVG mit Aufträgen,
  Aufgabe des gewählten Niveaus, kein NaN/undefined). Sichtgeprüft per Screenshot:
  Lernpfad hell und dunkel, Lektionen Dualsystem, Grundfunktionen,
  Formeln kopieren (hell) sowie Handlungsvorschriften, Pixel/Vektor und
  Foliengestaltung (dunkel). Die Ansicht „Fachbegriffe“ und Klickabläufe
  (Schnellcheck beantworten, Werkstattauftrag erfüllen) sind nicht im Browser
  durchgespielt; die Logik dazu deckt die Testsuite ab.

Lehrervideos enthält das Paket bewusst nicht (Entscheidung vom 22.10.2026, AGENTS.md §4).
