# Mathematik 6 Realschule

LehrplanPLUS Bayern, ein Fachlehrplan für alle Wahlpflichtfächergruppen: **47 Lektionen** in **6 Etappen** und **141 ZAM-Karten**. Jede Etappe hat einen eigenen Akzent, und jede Lektion hat Erklärung, Beispiel, Merksatz, Schnellcheck, ein veränderbares Labor mit drei Aufträgen sowie mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| 1 Rationale Zahlen | ca. 68 | 10 | 19 |
| 2 Achsenspiegelung und Symmetrie | ca. 13 | 5 | 6 |
| 3 Flächeninhalt ebener Figuren | ca. 18 | 4 | 6 |
| 4 Raumgeometrie | ca. 14 | 2 | 4 |
| 5 Terme und Gleichungen | ca. 15 | 7 | 7 |
| 6 Direkte Proportionalität | ca. 12 | 4 | 5 |

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Der Fortschritt bleibt lokal im Browser. Die Konstruktionen mit Zirkel und Lineal zeigt die App Schritt für Schritt; ausgeführt werden sie auf Papier, und die App bewertet sie nicht. Erklärvideos enthält das Paket noch nicht, sie folgen in einem eigenen Schritt.

## Lehrplan und Nachbarjahrgänge

Der Fachlehrplan wurde am 06.11.2026 direkt gelesen: [Mathematik 6](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/mathematik). Die Adressen `/wpfg1` und `/wpfg2-3` führen in Klasse 6 zur Startseite der Website, es gibt also nur einen Plan. [source.json](src/curriculum/source.json) hält alle Lernbereiche mit Stunden, Kompetenzerwartungen und Prüfsumme der gelesenen Seite fest. [coverage.json](coverage.json) ordnet alle 32 Erwartungen konkreten Lektionen zu und nennt die Nachweise.

M5 liefert ganze Zahlen, Rechengesetze, ggT und kgV, Größen, Dreisatz, Rechteckfläche sowie Netze und Schrägbilder. Aus M7 werden der veränderte Grundwert, das Lösen von a · x + b = c durch Äquivalenzumformung und die indirekte Proportionalität nicht vorgezogen. Solche Gleichungen werden in M6 nur durch Probieren und Rückwärtsrechnen gelöst, wie es der Lehrplan vorsieht. Details stehen im [Lehrplanbericht](../docs/mathematik-6-coverage.md).

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei kurze Abrufe und eine Transferfrage mit Musterlösung. Alle Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) fixiert.

Zwei alte Zellen enthalten 16 Karten. Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Sechs A-Zeilen schlagen denselben Einzelabruf als Nachfolger vor, zehn C-Zeilen bleiben aktiv. Die Zuordnung ist **unfreigegeben** (`approved: null`). Die ausgelieferte Zelle enthält weder `replaces` noch `retired_items`, deshalb bleiben alle 16 alten Karten und ihre Historien unverändert aktiv.

## Lokal starten und prüfen

Es werden die vorhandenen TypeScript-, Vite- und Vitest-Werkzeuge der Mathematik-Referenz verwendet, keine neue Bibliothek.

```bash
npm ci
npm run dev          # http://localhost:5219/
npm run typecheck
npm test
npm run build
npm run package:zip
```

Die Einzeldatei liegt in `dist/index.html`, das Offlinepaket in `release/ZAM-Academy-Mathematik-6-offline.zip`. Am Repository-Stamm:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<Datei-URL von zam-core/dist/index.js> node scripts/validate-cells.mjs
ZAM_CORE=<Datei-URL von zam-core/dist/index.js> node mathematik-realschule-6/scripts/validate-migration.mjs
```

Geprüft am 07.11.2026 nach dem Review von PR 92: 47 Pakettests, 51 Katalog- und Registrytests, Typprüfung, Build, Offline-Zip, Installation der 141 Karten und alle kuratierten Distraktoren mit zam-core 0.54.0. Die Labortests prüfen Reglergitter, alle 141 Zielzeugen, keinen freien Start und Zeigerpositionen. Je Lektion und Stufe werden 80 erzeugte Aufgaben mit Dezimalkomma und Dezimalpunkt geprüft, also 7520 Aufgaben. Dazu kommen unabhängige Gegenproben für Bruchrechnung, Dezimalentwicklung, Runden, Flächen, Volumen, Gleichungen, Prozent, Spiegelung und Symmetrieachsen.

Im Browser geprüft wurden alle 47 Lektionen auf beiden Stufen (Labor, Aufgabe, Hilfe, kein freier Auftrag, kein Überlauf), die Zeichnungen aller Labore in Start- und Auftragsstellung, Schnellcheck, Laboraufträge, Aufgabenprüfung mit Hinweisen und Speicherung, Ziehen eines Griffs, die Formelsammlung und das dunkle Farbschema. Die App stellt keine Anfrage an Dritte.
