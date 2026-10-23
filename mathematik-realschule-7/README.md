# Mathematik 7 Realschule

LehrplanPLUS Bayern für beide Wahlpflichtfächergruppen: **42 Lektionen für Zweig I**, **31 für Zweig II/III**, insgesamt **126 ZAM-Karten**. Jeder Lernbereich hat einen eigenen Akzent und jede Lektion Erklärung, Beispiel, Merksatz, Schnellcheck, ein veränderbares Labor mit drei Aufträgen sowie mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Zweig I | Zweig II/III | Lektionen I / II/III |
| --- | --- | --- | --- |
| Potenzen | LB 1 | LB 1 | 5 / 5 |
| Parallelverschiebung | LB 2 | LB 2 | 8 / 6 |
| Dreiecke | LB 3 | – | 4 / – |
| Raumgeometrie | LB 4 | – | 3 / – |
| Ortslinien und Ortsbereiche | LB 5 | LB 3 | 8 / 6 |
| Terme, Gleichungen und Ungleichungen | LB 6 | LB 4 | 5 / 5 |
| Proportionalitäten | LB 7 | LB 5 | 5 / 5 |
| Auswertung von Daten | LB 8 | LB 6 | 4 / 4 |

Vektoraddition und allgemeine Vieleckswinkelsummen, Dreiecke, Raumgeometrie, die Tangentenkonstruktion vom äußeren Punkt und der Schwerpunkt gehören hier nur zu I. Die Zweigauswahl filtert Lernpfad, Navigation und Formelsammlung; die sichtbaren Etappen und Lektionen werden für II/III ohne Lücken nummeriert. Die öffentlichen Lektion- und Kartenkennungen bleiben dabei gleich.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Freie Konstruktionen mit Zirkel/Geodreieck und Messungen in wahren Hilfsfiguren übst du zusätzlich auf Papier oder in dynamischer Geometriesoftware; die App erläutert und überprüft die zugehörigen Bedingungen und Rechenaufgaben. Lehrervideos folgen nach dem Paketstandard in einem separaten Schritt.

## Lehrplan und Nachbarjahrgänge

Die aktuellen offiziellen Fachlehrpläne wurden am 23.10.2026 direkt gelesen: [I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/mathematik/wpfg1), [II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/mathematik/wpfg2-3). [source.json](src/curriculum/source.json) hält alle Lernbereiche mit Stunden und Kompetenzerwartungen sowie die Prüfsummen der gelesenen Seiten fest. [coverage.json](coverage.json) ordnet alle 35 Erwartungen für I und 27 für II/III konkreten Lektionen zu und benennt deren Nachweise.

M6 liefert rationale Zahlen, Rechengesetze, Spiegelungen und direkte Proportionalität als Vorwissen. M8-Inhalte wie binomische Formeln und quadratische Extremwerte werden nicht vorgezogen. Wahre räumliche Größen werden konstruiert und gemessen; der Satz des Pythagoras und Winkelfunktionen werden nicht als M7-Rechenverfahren eingeführt. Die Modellrechnung für Zeichnungen bleibt intern. Details stehen im [Lehrplanbericht](../docs/mathematik-7-coverage.md).

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json), davon zwei kurze Abrufe und eine Transferfrage mit Musterlösung. Die ursprünglichen fünf Lektionen und ihre 15 Karten behalten ihre Kennungen. Alle neuen Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) fixiert.

Vier alte Zellen enthalten 30 Karten. Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Sieben A-Zuordnungen schlagen denselben Einzelabruf als Nachfolger vor; 23 C-Zeilen bleiben aktiv, da kein vollständiger identischer Abruf erhalten ist oder das Thema zum Vorwissen gehört. Die Zuordnung ist **unfreigegeben** (`approved: null`). Die ausgelieferte Zelle enthält weder `replaces` noch `retired_items`, deshalb bleiben derzeit alle 30 alten Karten und ihre Historien aktiv.

Die Historienprüfung testet sowohl diesen unveränderten Zustand als auch eine nur im Arbeitsspeicher erzeugte spätere Fassung mit den sieben Vorschlägen. Die Simulation ersetzt keine Freigabe. Sie prüft alle FSRS-Felder, Reviewereignisse, wiederholte Installation/Einschreibung und die Ablehnung beim gleichzeitigen Besitz beider Karten. Keine persönliche Bibliothek wird geöffnet.

## Lokal starten und prüfen

Es werden die vorhandenen TypeScript-/Vite-/Vitest-Werkzeuge der Mathematik-Referenz verwendet; keine neue Bibliothek.

```bash
npm ci
npm run dev          # http://localhost:5195/
npm run typecheck
npm test
npm run build
npm run package:zip
```

Die Einzeldatei liegt in `dist/index.html`; das Offlinepaket in `release/ZAM-Academy-Mathematik-7-offline.zip`. Am Repository-Stamm:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<Datei-URL von zam-core 0.54.0/dist/index.js> node scripts/validate-cells.mjs
ZAM_CORE=<Datei-URL von zam-core 0.54.0/dist/index.js> node mathematik-realschule-7/scripts/validate-migration.mjs
```

Geprüft am 23.10.2026: 49 Pakettests, 28 Katalog-/Registrytests, Typprüfung, Build, Offline-Zip, Installation der 126 Karten und alle kuratierten Distraktoren mit zam-core 0.54.0. Die Labortests prüfen Reglergitter, alle 126 Zielzeugen, keinen freien Start und Zeigerpositionen. Je Lektion/Stufe werden 80 erzeugte Aufgaben mit Dezimalkomma und Dezimalpunkt geprüft, insgesamt 6720 Aufgaben. Zusätzlich gibt es unabhängige Gegenproben für Potenzen, Geometrie, Kreisberührung, Gleichungen/Ungleichungen, Preise/Zinsen, Produktgleichheit und Kenngrößen.

Die gebaute App wurde über die lokale Vorschau im Browser geprüft: alle 42 Lektionen mit Labor sowie Aufgaben auf beiden Stufen in Hell und Dunkel, der gefilterte II/III-Pfad, Navigation und Formelsammlung. Der [Lehrplanbericht](../docs/mathematik-7-coverage.md) beschreibt Umfang und praktische Grenzen. Das Paket ist noch nicht veröffentlicht.
