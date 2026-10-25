# Geschichte 10 · Realschule Bayern

Ein gemeinsamer Lernpfad für alle Wahlpflichtfächergruppen nach [LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/geschichte), abgeglichen am 25. Oktober 2026. 49 Kernlektionen und vier optionale englische Vertiefungen führen von der Nachkriegszeit über Teilung, Kalten Krieg und Einheit bis zu den Konflikten der Gegenwart, Migration und Geschichtskultur.

## Lernen und Fortschritt

Jede Lektion hat eine Erklärung mit Merksatz, einen Schnellcheck mit gezielten Hinweisen zu jeder falschen Antwort, eine Werkstatt (Zeitleiste oder Zuordnung, in fünf Lektionen mit echten, belegten Zahlen) und zwei unterschiedliche Schreibaufgaben. Level 1 bietet Leitfragen, Level 2 verlangt einen Transfer. Eigene Antworten werden **nicht automatisch bewertet**: Erst nach einem eigenen Text öffnet sich eine mögliche Antwort mit drei Vergleichskriterien, die Lernenden schätzen sich selbst ein.

Ein Kernabschluss verlangt einen richtigen Schnellcheck, eine gelöste Werkstatt und die Selbsteinschätzung zu Level 1. Fortschritt und eigene Texte bleiben ausschließlich in diesem Browser (`geschichte_rs10_academy_progress_v1`); es gibt keine Konten, Tracker, externen Schriften oder automatischen Netzabrufe. Jeder Lernbereich hat eine eigene Akzentfarbe. Unter „Nachschlagen“ stehen alle Merksätze und die 41 Grundlegenden Daten und Begriffe des Lehrplans mit der Lektion, die sie erklärt.

Die Übungen verwenden eigens verfasste Darstellungstexte. Originalquellen sind gekennzeichnet: die Präambel der Bayerischen Verfassung (Normtext) und Zahlen aus dem Lebendigen Museum Online. Zeitzeugengespräche, Filmanalysen, eigene Recherchen und die Prüfung aktueller Nachrichten werden vorbereitet und ausgewertet, **finden aber außerhalb der App statt**. Angaben zur Gegenwart haben den Stand Oktober 2026.

## Lehrplanabgleich

| Lernbereich | Lektionen | Behandlung |
| --- | ---: | --- |
| 1 · Methoden | 6 | Karikaturen; Fotos und politische Lieder; Narrationen vergleichen; Schaubilder aus Karten und Statistiken; Zeitzeugen; Spiel- und Dokumentarfilme |
| 2 · Nachkriegszeit (ca. 7 Std.) | 5 | Potsdam und Entnazifizierung, Alltag und Nürnberger Prozesse, Flucht und Vertreibung mit Integration in Bayern, Bayerische Verfassung 1946, Gründung beider Staaten 1949 |
| 3 · Teilung (ca. 9 Std.) | 11 | SED-Diktatur und Planwirtschaft, 17. Juni 1953, Stasi und Zivilcourage, Mauerbau, Ära Adenauer, NS-Vergangenheit, „Gastarbeiter“, 1968 und RAF, sozial-liberale Reformen, jüdisches Leben, deutsche Frage und Grundlagenvertrag |
| 4 · Kalter Krieg und Einheit (ca. 11 Std.) | 11 | Blockbildung, Kuba-Krise, Vietnamkrieg, Entkolonialisierung am Beispiel Algerien, Entspannung, Umbruch im Ostblock, friedliche Revolution, Weg zur Einheit, innere Einheit, Rolle Deutschlands, europäische Integration |
| 5 · Gegenwart (ca. 11 Std.) | 8 | Weltordnung nach 1990, UNO, Jugoslawienkriege, Nahostkonflikt in zwei Lektionen, 11. September und Terrorismus, Globalisierung, aktueller Konflikt am Beispiel Ukraine |
| 6 · Migration (Längsschnitt, ca. 5 Std.) | 4 | Migration durch die Epochen, Auswanderung, Einwanderung und Integration, Deutschland als Einwanderungsland |
| 7 · Geschichtskultur (Längsschnitt, ca. 5 Std.) | 4 | Alexander in Rom und Denkmäler des 19. Jahrhunderts, Instrumentalisierung in NS-Staat und DDR, Geschichte als Unterhaltung, Gedenktage und Welterbe |
| 8 · Bilingual, optional | 4 | Britain and the USA in post-war Germany, Berlin airlift and crisis, decolonisation in India, Cold War crises and the space race |

Alle 41 Kompetenzerwartungen stehen wörtlich mit ihren Lektionen in [`coverage.json`](coverage.json); der Test prüft, dass jede Kompetenz eine Lektion und jede Lektion eine Kompetenz hat. Die Stundenansätze sind Orientierungswerte des Lehrplans, keine behauptete Bearbeitungsdauer der App. Details stehen in [docs/geschichte-10-bestandsabgleich.md](../docs/geschichte-10-bestandsabgleich.md).

## Zelle und bestehende Lernstände

Die einzige Kartenquelle ist [`cell.json`](cell.json): 53 Atome, 159 Karten. Je Lektion fragt eine Karte den Schnellcheck, eine ein Datum oder einen Grundbegriff, und eine Begründungskarte die Level-1-Aufgabe mit Musterlösung. Die Schnellkarten haben je zwei kuratierte Ablenker mit Begründung; sie bestehen die Auswahlprüfungen von zam-core. Die englischen Karten tragen `language: en`. Jede Karte verlinkt `https://academy.zam-os.org/geschichte-realschule-10/#lesson=…`; `tests/fixtures/public-contract.json` pinnt IDs und Slugs.

ZAM bündelt bisher die Teilzelle `de-by:realschule-10-geschichte-kalter-krieg-teilung-wiedervereinigung` (zwei Atome, vier Karten). Ihr bytegleicher Stand liegt als Testfixture mit SHA-256 und Quell-Commit vor. Das [Mapping](replaces-de-by.json) ist ein **Vorschlag** (`"status": "proposal-only"`, `"approved": null`): 2 A (Kuba-Krise, Datum der Grenzöffnung), 0 B, 2 C (zwei vierteilige Gesamtfragen mit wertenden oder ungenauen Musterlösungen und falscher Lernbereichsbindung). Die Zelle `2026.10.1` erscheint deshalb ohne `replaces` und `retired_items`; die Zuordnung wird erst nach Thomas' Freigabe in einer neuen Version deklariert.

## Entwickeln und prüfen

```sh
npm ci
npm run dev            # http://localhost:5202/geschichte-realschule-10/
npm run typecheck
npm test
npm run build          # dist/index.html: eine offlinefähige Datei
npm run package:zip    # release/ZAM-Academy-Geschichte-10-offline.zip
```

Im Repo-Wurzelverzeichnis, mit dem in CI festgelegten `zam-core`:

```sh
ZAM_CORE=file:///pfad/zu/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///pfad/zu/node_modules/zam-core/dist/index.js node geschichte-realschule-10/scripts/validate-migration.mjs
```

Der Migrationstest nutzt nur Wegwerf-Bibliotheken: Die vier alten Karten und ihre Reviews bleiben bei der Installation der neuen Zelle unverändert und aktiv; eine Simulation des Vorschlags verschiebt genau zwei Historien, legt zwei Karten still, bleibt bei wiederholter Installation stabil und lehnt eine Zusammenführung ab, wenn jemand Karten auf alter und neuer ID hält.
