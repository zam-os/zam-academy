# Physik 11 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 10. November 2026. Das Paket umfasst 34 Lektionen in 4 Etappen mit 34 Atomen und 102 Karten.

## Offizielle Grundlage

Der [Fachlehrplan Physik 11](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/physik) („Das physikalische Weltbild im Wandel“) wurde am 10.11.2026 direkt abgerufen, keine Archivfassung; der SHA-256 der Seite steht als `curriculum_sha256` in [coverage.json](../physik-gymnasium-11/coverage.json). Es gibt einen Fachlehrplan für alle Ausbildungsrichtungen. Lernbereich 4 (Profilbereich, 27 Stunden) gilt nur für das NTG.

| Lernbereich | Stunden | Erwartungen | Für | Lektionen |
| --- | --- | --- | --- | --- |
| 1 Kreisbewegung | 13 | 4 | alle | 6 |
| 2 Schwingungen und Wellen | 21 | 6 | alle | 10 |
| 3.1 Astronomische Weltbilder | 6 | 2 | alle | 3 |
| 3.2 Einblick in die spezielle Relativitätstheorie | 7 | 3 | alle | 4 |
| 3.3 Energieversorgung | 7 | 2 | alle | 3 |
| 4.1 Die Methode der kleinen Schritte | 9 | 4 | NTG | 3 |
| 4.2 Photovoltaik in Anwendungen | 6 | 3 | NTG | 2 |
| 4.3 Außerunterrichtliche Aktivität | 4 | 7 | NTG | 1 |
| 4.4 Vertiefung anhand ausgewählter weiterer Inhalte | 8 | 3 | NTG | 2 |

Die 34 Kompetenzerwartungen stehen wortgleich in `coverage.json`. Geprüft wurde das beim Bau mit einem Skript, das jede Zeile im Text der abgerufenen Seite sucht (Ergebnis: 34 Zeilen, 0 nicht gefunden). Die Tests in `tests/curriculum.test.ts` prüfen die Anzahl je Abschnitt, mindestens eine Lektion je Zeile, dass jede Lektion in einer Zeile vorkommt und dass eine Erwartung für alle nie nur von einer NTG-Lektion bedient wird.

## Was das Paket leistet und was im Unterricht bleibt

Der Plan verlangt in dieser Jahrgangsstufe viel, was eine App nicht ersetzen kann: drei Schülerexperimente, eigenständige Recherche, arbeitsteilige Gruppenarbeit, Präsentationen, ein Planspiel und eine außerunterrichtliche Aktivität. `coverage.json` trennt deshalb zwei Status:

- `implemented` (19 Zeilen): Erklärung, Modell oder Werkstatt und Aufgaben decken die Erwartung ab.
- `supported` (15 Zeilen): Das Paket liefert Fachwissen, ein Modell und Übungen im Planen, Auswerten und Begründen; die Tätigkeit selbst (messen, recherchieren, präsentieren, teilnehmen) geschieht im Unterricht. Das Versuchsnotizbuch hält die Schülerexperimente fest.

Lernbereich 4.3 hat sieben Erwartungen, von denen die Aktivität mindestens zwei entwickeln soll. Eine einzige Lektion (`nt-aktivitaet`) gibt dafür die Werkzeuge: Inhalt, Argumentationsmuster und Interessenlage trennen, eine Bewertung prüfen, eine Stellungnahme aufbauen.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Geprüft wurden die Fachlehrpläne Ph9 und Ph10 Gymnasium (abgerufen am 10.11.2026). Vorausgesetzt und als Wiederholung benannt werden aus Ph9 das Photonenmodell, der Wirkungsgrad und E = P · t, aus Ph10 die Bewegungsfunktionen und Newtons Gesetze. Elektrisches und magnetisches Feld, Induktionsgesetz und Schwingkreis stehen nicht in Ph11 und fehlen deshalb.

**Qualitativ bleibt qualitativ.** Der Plan verlangt die Deutung des Doppelspalts „qualitativ“. Das Modell zeigt den Streifenabstand zum Vergleich der Farben; Rechenaufgaben gibt es dort nur zu c = λ · f. Zum Wirkungsgrad verlangt der Plan „qualitative Schlussfolgerungen“; eine Carnot-Formel kommt nicht vor. Die relativistische Geschwindigkeitsaddition steht nicht im Plan: Das Modell `frames` zeigt ihre Ergebnisse, nennt aber keine Formel.

**Über den Wortlaut hinaus, klein gehalten.** T = 2π · √(m / D) für das Federpendel (der Plan nennt Diagramme und charakteristische Größen, im Profilbereich die Abhängigkeiten der Schwingungsdauer), die Standardabweichung neben der halben Spannweite, die Hubble-Beziehung als Zahlenbeispiel zur Expansion und das zweite Kepler’sche Gesetz mit Exzentrizität im Modell.

**Lernbereich 4.4** ist eine Vorschlagsliste. Umgesetzt sind „Physik auf dem Jahrmarkt“ und „Computermodellierung physikalischer Systeme“. Nicht umgesetzt sind Akustik und vertiefende Betrachtungen zum Licht. Die Erwartung zu Gesundheitsrisiken ist am Jahrmarkt umgesetzt; Risiken digitaler Technologien haben keine Lektion.

**Ausbildungsrichtungen.** Die App unterscheidet „NTG“ und die übrigen Ausbildungsrichtungen (Auswahl im Lernpfad, Voreinstellung: ohne Profilbereich). In der Zelle tragen nur die Atome des Lernbereichs 4 `track: "NTG"`; die übrigen sind ohne Track an Physik 11 Gymnasium gebunden. `exam_relevant` ist `false`, weil die Jahrgangsstufe 11 nicht Gegenstand der Abiturprüfung ist.

**Zahlenwerte.** Reibungszahlen, Luftwiderstandsbeiwerte, Punkte der Nutzwertanalyse, Strompreise und die Einspeisevergütung in den Modellen sind frei gewählte Beispielwerte und in der App so gekennzeichnet. Aktuelle Anteile der Energieträger nennt das Paket bewusst nicht; es verlinkt Umweltbundesamt und Fraunhofer ISE.

## Quellen

Alle Links in `src/curriculum/sources.ts` wurden am 10.11.2026 mit `curl` abgerufen und ihre Seitentitel geprüft (OpenStax College Physics 2e und Astronomy 2e, Umweltbundesamt, Fraunhofer ISE, Deutscher Wetterdienst, LeMO des Deutschen Historischen Museums). LEIFIphysik beantwortet automatische Abrufe mit 403 und ist deshalb nicht verlinkt. Die OpenStax-Quellen sind englisch.

## Bestandsabgleich der alten Karten

Abgeglichen wurden fünf `de-by`-Zellen in zam-os/zam (Commit `ea825d1c1147fcc5f37de5817c2d6a7c05e2f7ed`) mit 20 Karten, bytegleich unter `physik-gymnasium-11/tests/fixtures/` mit SHA-256 (`shasum -a 256`) in [replaces-de-by.json](../physik-gymnasium-11/replaces-de-by.json):

- drei Zellen „Physik 11 Gymnasium“ (elektrisches Feld, Induktion und Schwingkreis, Magnetfeld). Sie folgen dem Plan des achtjährigen Gymnasiums; im LehrplanPLUS liegen diese Themen in der Qualifikationsphase.
- zwei Zellen „Physik 10 Gymnasium“ (Kreisbewegung und Gravitation, Wellenlehre). Ihre Themen stehen im LehrplanPLUS in Ph11 und nicht in Ph10.

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 3 | Gleicher Einzelabruf, ein Nachfolger: `01K8GA60000000000000000J01` → `ph11-zentripetalkraft-richtung`, `01K8GA60000000000000000J03` → `ph11-kepler-3`, `01K8GA40000000000000000J01` → `ph11-destruktive-interferenz` |
| B | 0 | Keine mehrteilige Karte wird ganz übernommen |
| C | 17 | 12 Karten außerhalb von Ph11, 4 mehrteilige Synthesekarten, 1 Karte zum Doppler-Effekt; alle bleiben aktiv |

**Das ist ein Vorschlag ohne Freigabe.** `replaces-de-by.json` hat `"status": "proposal-only"` und `"approved": null`; die Zelle enthält weder `replaces` noch `retired_items`, und ein Migrationstest ist deshalb nicht nötig. Zwei Fragen an Thomas:

1. Sollen die drei A-Zuordnungen gelten?
2. Mathematik 11 Gymnasium hat Jahrgangsstufe-10-Zellen bewusst dem künftigen Paket der Jahrgangsstufe 10 überlassen. Hier sind die beiden Physik-10-Zellen aufgenommen, weil ein Paket Physik 10 Gymnasium nach LehrplanPLUS zu Kreisbewegung und Wellen keine Lektion haben wird. Falls sie dort abgeglichen werden sollen, entfallen diese acht Zeilen hier.

## Nachweise

Im Paket, am 10.11.2026:

```bash
npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip
```

Am Repository-Stamm mit zam-core 0.54.0 in einem Ordner außerhalb des Repositorys:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<file URL> node scripts/validate-cells.mjs
```

Die gebaute `dist/index.html` wurde mit Chrome im Headless-Modus geöffnet: Lernpfad, Formelsammlung und einzelne Lektionen als Bildschirmfoto im hellen und dunklen Schema; alle 34 Lektionen auf beiden Stufen über das gerenderte DOM (Titel, Schnellcheck, Modell, Werkstatt, Aufgabentext, keine `NaN`). Die Ergebnisse stehen in der Beschreibung des Pull Requests.

## Offen

- Kein Lehrer und keine Lehrerin hat die Inhalte geprüft.
- Lehrervideos fehlen (eigener Schritt).
- Freigabe der Kartenzuordnung.
- Lernbereich 4.4: Akustik, Licht in der Datenübertragung und Risiken digitaler Technologien ohne Lektion.
