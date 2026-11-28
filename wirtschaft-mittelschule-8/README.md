# Wirtschaft und Beruf 8 Mittelschule (LehrplanPLUS Bayern)

Lernpaket für **Wirtschaft und Beruf (WiB)** in Jahrgangsstufe 8 an der bayerischen Mittelschule für beide Klassenarten (**Regelklasse R8** und **Mittlere-Reife-Klasse M8**).

- **Live:** https://academy.zam-os.org/wirtschaft-mittelschule-8/
- **ZAM-Zelle:** `zam-academy:wirtschaft-mittelschule-8` ([`cell.json`](cell.json), 31 Atome, 62 Lernkarten)
- **Lehrplanabdeckung:** [`coverage.json`](coverage.json) (alle 16 Kompetenzerwartungen der Regelklasse R8 und alle 18 der Mittlere-Reife-Klasse M8 wortgleich abgeglichen)
- **Bestandsabgleich:** [`replaces-de-by.json`](replaces-de-by.json) (`proposal-only`, kein Altbestand an Mittelschul-Zellen; `cell.json` deklariert weder `replaces` noch `retired_items`) und [Dokumentation](../docs/wirtschaft-mittelschule-8-coverage.md)

## Inhalt und Umfang

- **Lernbereich 1 · Projekt** (3 Lektionen in R8 / 4 in M8): komplexe Projektaufgaben als vollständige Handlung mit Kostenplan, Leittextmethode weitgehend selbständig mit Fachgespräch, Zeitplan mit Meilensteinen und Puffer sowie Leittextmethode selbständig mit eigenen Leitfragen und messbaren Kontrollkriterien (M8).
- **Lernbereich 2 · Berufsorientierung** (10 Lektionen in R8 / 9 in M8): Berufsberatung (§ 29 SGB III) und Informationsquellen, Berufswahlportfolio mit Fristen, Beratungsgespräch, lokaler Ausbildungsmarkt mit Mindestvergütung nach § 17 BBiG, Kompetenzprofil, Betriebspraktikum erproben und dokumentieren, Praktikumsbewerbung, Bewerbungsmappe und Vorstellungsgespräch (R8) sowie Lebensplanentwurf und Schullaufbahn (M8).
- **Lernbereich 3 · Wirtschaft** (8 Lektionen in R8 und M8): Betriebserkundung mit Beschaffung, Produktion und Absatz, ökologisches Handeln und Mensch am Arbeitsplatz, Geschäft auf einem Markt mit Zuschlagskalkulation, einfache Gewinn- und Verlustrechnung, einfacher Wirtschaftskreislauf, Zeit- und Leistungslohn, Mindestlohn und Tariflohn, gesetzliche Abgaben und Lohnabrechnung.
- **Lernbereich 4 · Recht** (3 Lektionen in R8 und M8): Bestimmungen des JArbSchG für das Betriebspraktikum (7 Std. täglich, 35 Std. wöchentlich, Pausen, 6 bis 20 Uhr, fünf Tage), Notwendigkeit der Schutzbestimmungen sowie Rechte, Pflichten und Unfallversicherung.
- **Lernbereich 5 · Technik** (4 Lektionen in R8 / 5 in M8): Fertigungsarten, Produktionsmittel und Produktivität, Erkundungsmethoden, Ergonomie, Arbeitssicherheit und Lärmschutz (80/85 dB(A)), Wandel von Arbeitsprozessen und Qualifikation sowie Vor- und Nachteile des Technikeinsatzes mit Nutzwertanalyse (M8).

Die App enthält **31 dreiteilige interaktive SVG-Schaubilder**, **9 live reagierende SVG-Labore** mit erreichbaren Zielen, **17 Rechenaufgaben-Familien** auf zwei Niveaus, **31 Fallwerkstätten** und **62 Schreibaufgaben** auf zwei Stufen.

## Entwicklung und Prüfung

```bash
npm ci
npm run dev      # http://localhost:5304/wirtschaft-mittelschule-8/
npm test
npm run build    # Einzeldatei in dist/index.html
npm run package:zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

## Datenschutz und Hinweise für Eltern und Lehrkräfte

Fortschritt und eigene Begründungstexte bleiben ausschließlich lokal im `localStorage` des Browsers (`wib_ms8_academy_progress_v1`), getrennt nach Benutzerkonto des Geräts, Browser, Profil und Herkunft; es findet keine Synchronisierung, Auswertung oder Übertragung an Dritte statt. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du ein Konto mit anderen Lernenden teilst, lösche am Ende den Lernstand und alle eigenen Texte über **„Fortschritt zurücksetzen“** in der Seitenleiste.
