# Physik 7 Gymnasium · ZAM Academy

Physik für die 7. Klasse am Gymnasium in Bayern nach LehrplanPLUS. In der Jahrgangsstufe 7 gibt es am Gymnasium noch kein eigenes Fach Physik: Sie ist der **Schwerpunkt Physik von Natur und Technik 7** (Lernbereich 1 „Physik in Natur und Technik entdecken“, ca. 28 Stunden). Der Schwerpunkt Informatik (Lernbereich 2) gehört nicht zu diesem Paket. Veröffentlichung nach Merge unter https://academy.zam-os.org/physik-gymnasium-7/.

## Lernen

Jeder Abschnitt des Fachlehrplans ist eine Etappe mit eigener Akzentfarbe:

1. **NT7 1.1 · Magnete und Dichte** (7 Lektionen): Beobachten, beschreiben, deuten am Modellversuch; Dauermagnete; Elementarmagnete; Orientierung mit Kompass und Erdmagnetfeld; Dichte; Dichtebestimmung mit dem Messzylinder; Werkstoffe nach ihrer Dichte bewerten.
2. **NT7 1.2 · Licht und Schatten** (8): Lichtquellen und Sehvorgang; Farben durch Reflexion und Absorption; farbige Schatten erkunden; geradlinige Ausbreitung; Kern-, Halb- und Übergangsschatten; Mondphasen; Sonnen- und Mondfinsternis; Sehen und gesehen werden.
3. **NT7 1.3 · Ladung und Strom** (6): Ladung und Kern-Hülle-Modell; Reibungselektrizität; Strom als bewegte Ladungen; Wärme- und Leuchtwirkung; magnetische Wirkung des Stroms; UND-, ODER- und Wechselschaltung.

Jede Lektion hat eine Erklärung mit Beispiel und Merksatz, Fachbegriffe zum Nachschlagen, einen Schnellcheck, eine Werkstatt (zuordnen oder ordnen) und zwei Schreibaufgaben mit Vergleichsantwort und drei Kriterien zur Selbsteinschätzung (Level 1 mit Leitfragen, Level 2 als Transfer). 20 Lektionen haben ein Modelllabor mit Zeichnung, Reglern und benannten Vergleichssituationen; die Lektion zur Wärme- und Leuchtwirkung hat statt eines Modells eine feste Abbildung, die zum Erdmagnetfeld zusätzlich zum Modell eine. Die drei Dichte-Lektionen haben Rechenaufgaben auf zwei Stufen; der Prüfer akzeptiert Dezimalkomma und Dezimalpunkt und erkennt typische Fehler (Faktor 1000, vertauschte Division).

Eine Lektion ist abgeschlossen nach Schnellcheck, Werkstatt und selbst eingeschätzter Antwort in Level 1, dazu allen Modellvergleichen und gegebenenfalls drei selbst gelösten Rechenaufgaben. Texte werden **nicht automatisch bewertet**.

## Zeichnungen und Farben

- Eine Akzentfarbe je Abschnitt (`[data-lb]` in `src/styles.css`): Beere für Magnete und Dichte, Bernstein für Licht, Blau für Strom.
- Eine Farbe je Art von Größe, in allen Zeichnungen gleich und in der Legende benannt: Nordpol und positive Ladung rot, Südpol grün, Elektronen und negative Ladung blau, Länge und Volumen petrol, Kraft orange, Licht gold, Winkel violett, Körper und Masse magenta. Farbiges Licht und Körperfarben erscheinen in ihrer echten Farbe.
- Bewegung startet nie von selbst: Im geschlossenen Stromkreis und in der eingeschalteten Schaltung zeigt „Bewegung zeigen“ die wandernden Elektronen.

`tests/visual.test.ts` prüft Textalternativen, Legenden, endliche Koordinaten und einen Kontrast von mindestens 4,5 : 1 für Textfarben in beiden Farbschemata.

## Echte Experimente

Der Fachlehrplan nennt sechs Schülerexperimente (Permanentmagnet, Dichtebestimmung, Farben beleuchteter Gegenstände, Schattenbilder, magnetische Wirkung des Stroms, Schaltungen im Alltag). **Modelle ersetzen sie nicht.** Das lokale Versuchsnotizbuch hat für jedes einen Platz mit Frage, Aufbau, Beobachtungen und Ergebnis; „selbst durchgeführt“ ist eine eigene Angabe. Fotos, Skizzen auf Papier, Internetrecherche und der Aufbau mit Schaltungssoftware gehören in den Unterricht; [coverage.json](coverage.json) kennzeichnet solche Kompetenzen mit `supported`.

Keine Konten, keine Telemetrie, keine externen Laufzeitanfragen. Fortschritt, Texte und Notizen bleiben in `localStorage` (`physik_gym7_academy_progress_v1`). Fachquellen sind einfache Links. Lehrervideos folgen als eigener Schritt.

## ZAM und vorhandene Karten

`cell.json` ist der einzige Ort der **63 Karten**: ein Atom je Lektion mit zwei schnellen Karten und einer Synthesekarte, gebunden an `nt_gym`, Jahrgangsstufe 7, `lb1.1` bis `lb1.3`. Jede Karte verweist auf `#lesson=<id>`; die Tests pinnen alle 21 Anker.

`replaces-de-by.json` ist ein **Vorschlag** (`proposal-only`, nicht freigegeben) für die 8 Karten der beiden Altzellen `de-by:gymnasium-7-physik-…`: alle C, aktiv lassen. Die Zelle deklariert kein `replaces` und kein `retired_items`. Die Schnappschüsse liegen bytegenau in `tests/fixtures/`.

Näheres: [docs/physik-gymnasium-7-coverage.md](../docs/physik-gymnasium-7-coverage.md).

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5265/physik-gymnasium-7/
npm test
npm run typecheck
npm run build
npm run package:zip  # Single-file-App und Offline-Launcher in release/
```

Keine zusätzliche Abhängigkeit gegenüber `physik-gymnasium-11`, dessen Shell dieses Paket übernimmt.
