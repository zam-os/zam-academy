# Physik 8 Realschule · ZAM Academy

Physik für die 8. Klasse der bayerischen Realschule (LehrplanPLUS) als interaktives Labor mit Lernpfad. Live unter https://academy.zam-os.org/physik-realschule-8/ nach dem Merge. Nur Deutsch, wie der Lehrplan, dem die App folgt.

## Was die App vermittelt

Sieben Etappen folgen den Lernbereichen von LehrplanPLUS Physik 8. Jede Lektion nennt, welche Wahlpflichtfächergruppe sie braucht (Zweig I, Zweig II/III oder beide); der Lernpfad lässt sich nach dem eigenen Zweig filtern. Die beiden Zweige lernen in Klasse 8 überwiegend **verschiedene** Lernbereiche:

| Etappe | Lektionen | Zweig |
| --- | --- | --- |
| 1. **Mechanik** (LB 1 II/III): Messen, gleichförmige Bewegung, Kraft und Wechselwirkung, Hooke, Masse und Gewichtskraft, Teilchenmodell, Dichte, Reibung | 9 | II/III |
| 2. **Optik** (LB 2 II/III): Lichtausbreitung, Schatten, Finsternisse, Reflexion, Brechung, Totalreflexion, Linsen, Abbildung, Auge und Geräte | 9 | II/III |
| 3. **Mechanik und Energie** (LB 1 I): schiefe Ebene, Hebel, Flaschenzug (Wahl), Arbeit, Leistung, Energieformen, Energieerhaltung, Wirkungsgrad | 8 | I |
| 4. **Wärmelehre** (LB 2 I): innere Energie, Temperatur, Aggregatzustandsänderungen, Ausdehnung, Anomalie des Wassers, Wärmeleitung, Konvektion und Strahlung | 7 | I |
| 5. **Magnetismus und Elektrizitätslehre** (LB 3): Magnete und Magnetfelder (II/III); Ladung, elektrisches Feld, Elektrostatik, Strom und Stromkreis, Gefahren (beide); Stromstärke messen sowie Strom in Flüssigkeiten und Gasen (I) | 10 | beide |
| 6. **Wahlbereich Akustik** (LB 4.2 I) | 2 | I, Wahl |
| 7. **Wahlbereich Astronomie** (LB 4.1 I) | 2 | I, Wahl |

Zweig II/III hat 26 Lektionen, Zweig I 22 Kernlektionen. Flaschenzug (der Lehrplan verlangt „entweder Flaschenzug oder Hebel“) sowie die beiden Wahlbereiche zählen nicht in den Fortschrittsnenner; sie lassen sich trotzdem lernen und erscheinen mit der Marke „Wahl“.

Jede der 47 Lektionen hat dieselbe Form:

- eine kurze Erklärung mit den Formeln der Lektion (einfaches HTML, kein LaTeX),
- einen **Schnellcheck** (eine Multiple-Choice-Frage),
- ein **Labor**: eine eigene SVG-Simulation mit Reglern und Anzeigen und drei **Laboraufträgen**, die eine deterministische Prüfung als erreicht markiert (47 verschiedene Laborbilder),
- **Aufgaben**: zufällig erzeugte Rechenaufgaben mit toleranter Prüfung (Dezimalkomma, Einheit neben dem Feld) und Lösungsweg. Level 1 zeigt Formel und Werte, Level 2 ist eine Transferaufgabe in Worten.

Eine Lektion ist abgeschlossen, wenn der Schnellcheck stimmt, alle drei Laboraufträge erreicht sind und drei Level-1-Aufgaben gelöst wurden. Drei Level-2-Aufgaben bringen das 🦅 Transfer-Abzeichen. Mit gewähltem Zweig zählen Fortschritt, Abzeichen und die Etappenfeier nur die Kernlektionen dieses Zweigs. Der Fortschritt bleibt in `localStorage`.

## Erklärvideos der Lehrkraft

Diese Fassung enthält **noch keine Lehrervideos**. Sie sind vorbereitet und werden von einem anderen Agenten nachgetragen: Eine Lektion bekommt ihr Video, indem im Lektionsobjekt (`src/curriculum/stage-*.ts`) das optionale Feld `teacherVideo` gesetzt wird:

```ts
teacherVideo: {
  title: "Titel des Videos",
  url: "https://…",
  author: "Name",   // optional, erscheint als „Erklärvideo von …“
},
```

Ohne `teacherVideo` zeigt die Lektion keinen Videokasten; der Typ steht in `src/model/types.ts`. Videos ändern weder Lektions-IDs noch `cell.json`.

## Mit ZAM behalten

Die ZAM-Zelle `zam-academy:physik-realschule-8` („Physik 8 Realschule (ZAM Academy)“) ist `cell.json` in diesem Ordner und enthält die **152 Wiederholungskarten** (111 Schnellkarten, 41 Syntheseaufgaben) zu den 47 Lektionen. Jede Karte verweist als `https://academy.zam-os.org/physik-realschule-8/#lesson=<Lektions-ID>` auf ihre Lektion, und die App öffnet diese Lektion. `tests/physik-realschule-8.test.ts` pinnt die Lektions-IDs und prüft, dass jede Karte eine vorhandene Lektion zitiert, denn eine Umbenennung bricht jede zitierende Karte.

Jede Karte fragt einen Punkt. `concept` ist die nackte Antwort, gegen die ZAM prüft; der Rechenweg steht in `sample_solution`. Formeln sind Math-Segmente mit gesprochenem Text. Die zwei kuratierten Distraktoren jeder Karte prüft die CI mit `checkCandidate` und `checkShownSet` aus zam-core (`scripts/validate-cells.mjs`). Die Atome tragen die Lehrplanbindung (Realschule, Jahrgangsstufe 8, Zweig, Lernbereich), sodass ZAM die Zelle an der passenden Lehrplanstelle anbieten kann.

### Vorhandene Lernstände

Zwei ältere ZAM-Zellen decken Teile der Physik 8 ab (`de-by:realschule-8-physik-elektrik-grundlagen` und `…-mechanik-kraft-bewegung`, zusammen 16 Karten). `replaces-de-by.json` schlägt die Übernahme Zeile für Zeile vor: **4 A** (gleicher Einzelabruf, genau ein `replaces`), **10 C** (mehrteilig oder fachlich zu pauschal; die Historie bleibt erhalten, die Karte verlässt die aktive Wiederholung, neue Fragen beginnen unbewertet) und **2 C ohne Nachfolger** (Stoff der Jahrgangsstufe 9, bleiben unverändert).

**Die Übernahme ist freigegeben:** Thomas hat das Mapping am 23. Oktober 2026 ausdrücklich freigegeben (`approved` und `source` in `replaces-de-by.json`). Ab Version 2026.10.4 deklariert die Zelle genau diese Zeilen (`replaces` an den vier A-Nachfolgern, `retired_items` für die zehn ausscheidenden C-Karten); die zwei Karten der Jahrgangsstufe 9 bleiben unverändert aktiv. Die Versionen 2026.10.1 bis 2026.10.3 enthielten noch keine Deklaration. Der Katalogbau (`scripts/build-catalog.mjs`) lässt `replaces` und `retired_items` nur mit diesem Datum zu. Siehe [die Matrix](../docs/physik-8-coverage.md#lernstandsübernahme).

`scripts/validate-migration.mjs` prüft in temporären Bibliotheken mit dem gepinnten zam-core: die Fixture-Prüfsummen, 4 verschobene und 10 ausgeschiedene Historien, 32 erhaltene Review-Ereignisse mit unveränderten FSRS-Feldern, 148 unbewertete neue Karten, wiederholte Installation, das Zurückweisen eines Konflikts zweier bestehender Historien und das Upgrade von der vor der Freigabe veröffentlichten Version 2026.10.3. Er öffnet keine persönliche Bibliothek.

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5196/physik-realschule-8/
npm test
npm run typecheck
npm run build        # Single-File-Build in dist/index.html
npm run package:zip  # Offline-Zip (Windows/macOS/Linux-Starter) in release/
```

Vom Repository-Stamm: `ZAM_CORE=<file-URL des gepinnten zam-core> node physik-realschule-8/scripts/validate-migration.mjs`.

Lektionsinhalte stehen in `src/curriculum/stage-*.ts`, die Laborzeichnungen in `src/lab/visuals-*.ts`, die Physik dahinter in `src/lab/physics.ts`, die Aufgaben in `src/exercises/`. Eine neue Lektion braucht: einen Eintrag in der Etappendatei (ID, Erklärung, Quiz, Labor, zwei Aufgabengeneratoren), ihre Laborzeichnung, einen Zielzeugen in `tests/witnesses.ts`, Karten in `cell.json` und eine Zeile in `coverage.json`.

## Quellen

Lehrplanabgleich: 23. Oktober 2026 gegen die Live-Fassung beider Fachlehrpläne. `coverage.json` führt jede Kompetenzerwartung wörtlich, je Zweig, mit den Lektionen, die sie abdecken, und den Stunden je Lernbereich; `tests/physik-realschule-8.test.ts` prüft, dass jede Kompetenz eine Lektion ihres Zweigs hat und jede Lektion eine Kompetenz.

- [LehrplanPLUS Realschule, Physik 8, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/physik/wpfg1)
- [LehrplanPLUS Realschule, Physik 8, Wahlpflichtfächergruppen II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/physik/wpfg2-3)

Alle Texte, Zeichnungen und Übungswerte sind eigens verfasst; es werden keine externen Grafiken, Datensätze oder Laufzeitanfragen eingebunden.
