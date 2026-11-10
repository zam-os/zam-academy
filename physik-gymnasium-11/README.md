# Physik 11 Gymnasium · ZAM Academy

Physik für die 11. Klasse am Gymnasium in Bayern nach LehrplanPLUS („Das physikalische Weltbild im Wandel“). **26 Lektionen für alle Ausbildungsrichtungen** (Lernbereiche 1 bis 3) und **8 weitere für den Profilbereich des NTG** (Lernbereich 4), zusammen 34. Veröffentlichung nach Merge unter https://academy.zam-os.org/physik-gymnasium-11/.

## Lernen

Jeder Lernbereich ist eine Etappe mit eigener Akzentfarbe:

1. **Kreisbewegung** (6 Lektionen): Winkel- und Bahngeschwindigkeit, Zentripetalkraft und ihre Abgrenzung von der Zentrifugalkraft, das Schülerexperiment zur Zentripetalkraft, Kurvenfahrt, Gravitationsgesetz, Satelliten.
2. **Schwingungen und Wellen** (10): Diagramme lesen, Federpendel, das Schülerexperiment zum Fadenpendel, Messunsicherheit, mechanische Wellen, Beugung und Superposition, Zweistrahlinterferenz, stehende Wellen, Doppelspalt, Photonen- und Wellenmodell.
3. **Eigenverantwortliche Arbeit an physikalischen Themen** (10): astronomische Weltbilder und Kepler’sche Gesetze, modernes Weltbild, Einsteins Postulate, Zeitdilatation, Längenkontraktion, „Deutsche Physik“, Energieentwertung, Nutzwertanalyse zur Energieversorgung, Energiesparen.
4. **Profilbereich am NTG** (8): Methode der kleinen Schritte, Fall mit Luftwiderstand, simulierte Schwingung, Kennlinie und MPP der Solarzelle, Photovoltaikanlagen, Auswerten von Vorträgen und Stellungnahme, dazu aus der Vorschlagsliste 4.4 Jahrmarkt sowie Modelle und Chaos.

Jede Lektion hat eine Erklärung mit Merksatz und Formeln, einen Schnellcheck, eine Werkstatt (zuordnen oder ordnen) und zwei Schreibaufgaben mit Vergleichslösung und drei Kriterien zur Selbsteinschätzung. 30 Lektionen haben ein veränderbares Modell mit benannten Vergleichssituationen und Schiebereglern; jede Ansicht nennt ihre Annahmen. 26 Lektionen haben Rechenaufgaben auf zwei Stufen: Level 1 geführt mit Formelhilfe, Level 2 als Transfer (Einheit umrechnen, Formel umstellen, zwei Schritte verbinden). Der Prüfer akzeptiert Dezimalkomma, Dezimalpunkt und das typografische Minus.

Eine Lektion zählt als abgeschlossen nach Schnellcheck, Werkstatt und selbst eingeschätzter Begründung in Level 1, dazu gegebenenfalls allen Modellvergleichen und drei selbst gelösten Rechenaufgaben. Die Begründung wird **nicht automatisch bewertet**. Der Wechsel der Ausbildungsrichtung bewahrt alle Einträge.

## Echte Experimente und eigenverantwortliches Arbeiten

Der Fachlehrplan nennt zwei Schülerexperimente für alle (Zentripetalkraft, Fadenpendel) und eines im Profilbereich (Solarzelle). **Simulationen ersetzen sie nicht.** Das lokale Versuchsnotizbuch hat dafür je einen Eintrag mit Frage, Aufbau, Messdaten und Auswertung; „selbst durchgeführt“ ist eine eigene Angabe. Recherche, Gruppenarbeit, Präsentation, Planspiel und die außerunterrichtliche Aktivität (4.3) finden im Unterricht statt. [coverage.json](coverage.json) kennzeichnet solche Kompetenzen mit `supported`.

Es gibt keine Konten, keine Telemetrie und keine externen Laufzeitanfragen. Fortschritt, Texte und Notizen bleiben in `localStorage`. Fachquellen sind einfache Links. Lehrervideos enthält das Paket nicht; sie folgen als eigener Schritt.

## ZAM und vorhandene Karten

`cell.json` ist der einzige Ort der **102 Karten**: ein Atom je Lektion mit zwei schnellen Karten und einer Synthesekarte (bei den Kepler’schen Gesetzen drei schnelle). Jede Karte verweist auf `#lesson=<id>`; die Tests pinnen alle 34 Anker. Die Atome der Lernbereiche 1 bis 3 sind ohne Track an Physik 11 Gymnasium gebunden, die des Lernbereichs 4 mit `track: "NTG"`.

`replaces-de-by.json` ist ein **Vorschlag ohne Freigabe** (`"approved": null`): 20 Altkarten aus fünf `de-by`-Zellen, davon 3 A, 0 B, 17 C. Die Zelle enthält weder `replaces` noch `retired_items`; alle Altkarten bleiben aktiv, bis Thomas ausdrücklich entscheidet. Die Schnappschüsse der Altzellen liegen bytegenau in `tests/fixtures/`.

Näheres: [docs/physik-gymnasium-11-coverage.md](../docs/physik-gymnasium-11-coverage.md).

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5226/physik-gymnasium-11/
npm test
npm run typecheck
npm run build
npm run package:zip  # Single-file-App und Offline-Launcher in release/
```

Die gemeinsame CI prüft zusätzlich alle Zellen und den Katalog. Keine zusätzliche Abhängigkeit gegenüber `physik-realschule-10`, dessen Shell dieses Paket übernimmt.

## Quellen

Lehrplanabgleich und Quellenprüfung: 10. November 2026. Ausgangspunkt ist der [Fachlehrplan Physik 11](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/physik). Die Quellenliste steht in `src/curriculum/sources.ts` und in der App unter „Formelsammlung“. Alle Texte, Zahlenbeispiele und Modellwerte sind eigens verfasst.
