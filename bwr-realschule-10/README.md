# BwR 10 Realschule · ZAM Academy

Ein eigener Lernpfad für Betriebswirtschaftslehre/Rechnungswesen, **10. Klasse Realschule Bayern, Wahlpflichtfächergruppe II**: 36 Kernlektionen, zwei optionale Auffrischungen und 76 ZAM-Karten. Grundlage ist der am 25. Oktober 2026 abgerufene [LehrplanPLUS BwR 10 (II)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/bwl-rechnungswesen/wpfg2). Einen Fachlehrplan BwR 10 für die Zweige I oder III gibt es nicht.

## Lernbereiche

| Lernbereich (Stunden) | Lektionen | Inhalt |
| --- | ---: | --- |
| 1 Periodenrichtige Erfolgsermittlung und Rückstellungen (10) | 7 | Ausgabe/Aufwand, Einnahme/Ertrag, monatsgenaue Zuordnung, 2900 ARA, 4900 PRA, Auflösung, 3900 RST bilden und auflösen (5490 PFE, 6990 PFAW) |
| 2 Unternehmensabschluss und Auswertung (17) | 8 | Abschlussreihenfolge, Eigenkapitalentwicklung, aufbereitete Bilanz mit sieben Posten, Bar- und Einzugsliquidität, Anlagendeckung I und II, Eigenkapitalrentabilität, Zeit- und Branchenvergleich |
| 3 Vollkostenrechnung (30) | 12 | Rechnungskreise, Aufwand/Kosten, neutrales Ergebnis und Betriebsergebnis, Anders- und Zusatzkosten, Kostenarten, Kostenstellen und Schlüssel, einstufiger BAB, Zuschlagssätze, Kostenträgerzeitrechnung mit Bestandsveränderungen, Zuschlagskalkulation, Angebotspreis (Wiederholung BwR 8), Wirtschaftlichkeitskontrolle |
| 4 Teilkostenrechnung (15) | 9 | fixe und variable Kosten, Deckungsbeitrag, Gewinnschwelle, Preisänderungen, Zweiproduktunternehmen, Programmplanung, Zusatzauftrag, Preisuntergrenzen, make or buy |
| Auffrischung, kein Pflichtstoff der Klasse 10 | 2 | Netto, Vorsteuer, Brutto; Prozentrechnung im Hundert |

Die [Abdeckungsmatrix](coverage.json) führt alle 16 Kompetenzerwartungen wörtlich auf und ordnet sie Lektionen und Nachweisarten zu. Jede Lektion hat eine Erklärung mit Rechenbeispiel, einen Merksatz, einen Schnellcheck, eine Fallwerkstatt und eine eigene Begründung auf zwei Niveaus. 34 Lektionen haben Rechen- oder Buchungsaufgaben aus 34 Aufgabenfamilien; Niveau 1 ist geführt, Niveau 2 eine Transferaufgabe im Stil der Abschlussprüfung. Sieben veränderbare Modelle (Zeitleiste der Abgrenzung, Rückstellungsauflösung, aufbereitete Bilanz mit Kennzahlen, BAB, Kalkulationsschema, Gewinnschwellendiagramm, make or buy) haben je ein Ziel, das zu Beginn nicht erreicht ist. Eine Formelsammlung verlinkt jede Regel mit ihrer Lektion.

Eine Lektion zählt nach richtigem Schnellcheck, gelöster Fallwerkstatt und eigener, an drei Kriterien eingeschätzter Begründung auf Niveau 1; in Rechenlektionen zusätzlich nach drei selbst gelösten Aufgaben auf Niveau 1. Modellziele und Niveau 2 sind freiwillig. Die eigene Begründung wird **nicht automatisch fachlich bewertet**. Eine vorher geöffnete Lösung zählt nicht als eigene Lösung.

Der Prüfer akzeptiert Dezimalkomma, Dezimalpunkt und Tausenderpunkte, verlangt aber auf Cent beziehungsweise zwei Dezimalstellen gerundete Ergebnisse. Gewinnschwellenmengen werden auf ganze Stück aufgerundet. Buchungen müssen vollständig sein: richtige Konten, Soll/Haben und Centbeträge, in freier Reihenfolge.

## Schulmodell

Kontennummern und Abkürzungen folgen dem ISB-Kontenplan LehrplanPLUS. Annahmen stehen an den Fällen: monatsgenaue Abgrenzung ab dem Ersten des Beginnmonats, Abgrenzung nur des Nettobetrags, Rückstellungen netto und im kurzfristigen Fremdkapital, 19 Prozent Umsatzsteuer, Kennzahlen nach den im Unterricht üblichen Formeln (gesetzlich nicht festgelegt), Eigenkapitalrentabilität auf das Eigenkapital am Jahresanfang. In der Kalkulation wird jeder Schritt auf Cent gerundet; Skonto und Rabatt werden im Hundert gerechnet. Alle Firmen, Texte und Werte sind eigens verfasst.

Keine Anmeldung, Telemetrie, KI-Aufrufe oder Laufzeitanfragen. Externe Quellen öffnen nur auf Klick. Fortschritt und Texte bleiben im Browser (`localStorage`); bei gesperrtem Speicher erscheint ein Hinweis. Die gebaute Ein-Datei-App läuft auch aus dem Offline-ZIP.

## Karten und bisherige Lernstände

Die 76 Karten stehen ausschließlich in `cell.json`, je zwei pro Lektion. Ist die Frage oder die Antwort einer Karte eine Formel, steht sie als Segmente mit gesprochener Fassung (`question_segments`, `concept_segments`). Die zwei Optionen von `fast_check` und die `sample_solution` sind im KVT-Format reine Textfelder; dort stehen Formeln als Text mit „·“, „:“ und „−“. Jede Karte verlinkt `https://academy.zam-os.org/bwr-realschule-10/#lesson=<id>`. Lektions-, Atom- und Karten-IDs sind in `tests/fixtures/public-contract.json` gepinnt.

ZAM enthält bereits die Zelle `de-by:realschule-10-bwr-kosten-leistungsrechnung-kalkulation-bilanzanalyse` mit vier Karten. Die erste Veröffentlichung dieser Zelle verändert **keine** Lernhistorie: kein `replaces`, keine `retired_items`. `replaces-de-by.json` ist ein Vorschlag (`proposal-only`, `approved: null`): zwei gleiche Einzelabrufe (A) und zwei mehrteilige Abrufe (C), die nach einer Freigabe durch Thomas stillgelegt würden. Der [Bestandsabgleich](../docs/bwr-10-bestandsabgleich.md) begründet jede Zeile.

`scripts/validate-migration.mjs` prüft mit dem in der CI gepinnten `zam-core` in temporären Bibliotheken, dass die veröffentlichte Zelle alle alten Karten und Reviews unverändert und aktiv lässt, und probt den Vorschlag an einer Kopie im Arbeitsspeicher.

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5205/bwr-realschule-10/
npm test
npm run typecheck
npm run build
npm run package:zip
```

Vom Repository-Stamm: `ZAM_CORE=<file-URL des gepinnten zam-core> node bwr-realschule-10/scripts/validate-migration.mjs`. Es werden nur die bestehenden TypeScript-, Vite-, Singlefile- und Vitest-Abhängigkeiten verwendet.
