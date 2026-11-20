# Physik 7 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 20. November 2026. Das Paket [`physik-gymnasium-7/`](../physik-gymnasium-7/) umfasst 21 Lektionen in 3 Etappen mit 21 Atomen und 63 Karten in der Zelle `zam-academy:physik-gymnasium-7` (Version `2026.11.1`).

## Offizielle Grundlage

Am bayerischen Gymnasium gibt es in Jahrgangsstufe 7 kein eigenes Fach Physik. Physik wird als **Schwerpunkt Physik im Fach Natur und Technik** unterrichtet: Lernbereich 1 „Physik in Natur und Technik entdecken“, ca. 28 Stunden. Lernbereich 2 ist der Schwerpunkt Informatik und gehört nicht zu diesem Paket. Die Ausbildungsrichtungen beginnen erst in Jahrgangsstufe 8; es gibt einen Fachlehrplan für alle.

- **Quelle:** <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym> (Seitentitel „LehrplanPLUS - Gymnasium - 7 - Natur und Technik (Gym) - Fachlehrpläne“). Die Adresse `…/gymnasium/7/physik` leitet auf die Startseite um.
- **Abgerufen:** 20. November 2026, direkt (kein Archiv), mit Browser-User-Agent.
- **SHA-256:** `cea4bb14c000123381f6343db4856e30e82f16a7a84b887a70dd8b04b189361e`, als `curriculum_sha256` in [coverage.json](../physik-gymnasium-7/coverage.json); die Seite liegt bytegenau in `physik-gymnasium-7/tests/fixtures/curriculum.html`.

| Abschnitt | Stunden | Erwartungen | Inhalte | Lektionen | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| NT7 1.1 Ein erster Blick auf die physikalischen Spielregeln der Natur | 10 | 5 | 4 | 7 | 3 `implemented`, 2 `supported` |
| NT7 1.2 Optische Phänomene | 10 | 4 | 5 | 8 | 3 `implemented`, 1 `supported` |
| NT7 1.3 Elektrische Stromkreise | 8 | 5 | 6 | 6 | 3 `implemented`, 2 `supported` |

Alle 14 Kompetenzerwartungen und 15 Inhalte stehen wortgleich in `coverage.json`. Geprüft wurde das mit einem Skript, das jede Zeile im Text der abgerufenen Seite sucht (Leerzeichen normalisiert): **14 Zeilen, 0 nicht gefunden; 15 Inhalte, 0 nicht gefunden.** Dieselbe Prüfung läuft in `tests/curriculum.test.ts` gegen den gespeicherten Schnappschuss, zusammen mit dem SHA-256, der Anzahl je Abschnitt und der Zuordnung jeder Lektion.

## Was das Paket leistet und was im Unterricht bleibt

`supported` (5 Zeilen) heißt: Das Paket liefert Fachwissen, Modell und Übungen im Planen, Auswerten und Dokumentieren; die Tätigkeit selbst geschieht im Unterricht.

- **1.1 Modellversuch protokollieren:** Die App übt das Trennen von Beobachtung, Deutung und Vermutung; den Versuch und die Zeichnung auf Papier fertigen die Lernenden in der Klasse an.
- **1.1 Dichtebestimmung planen, durchführen, Tabellen im Internet:** Differenzmethode, Ablesegenauigkeit und Dichtebereich im Modell; Messen und Recherche im Unterricht.
- **1.2 Farben und Schatten experimentell erkunden, eigene Fotos:** Modelle und Hinweise zur Dokumentation; Experiment und Fotos im Unterricht.
- **1.3 Experimente zur magnetischen Wirkung, Versuchsprotokoll:** Modell und Protokollaufbau; Experiment im Unterricht.
- **1.3 Schaltung mit Software entwickeln und aufbauen:** UND-, ODER- und Wechselschaltung im Modell mit Schaltertabelle; Schaltungssoftware und Aufbau im Unterricht.

Das Versuchsnotizbuch hat einen Platz für jedes der sechs im Plan genannten Schülerexperimente.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Geprüft wurden NT5 Gymnasium (Schwerpunkt Naturwissenschaftliches Arbeiten) und Ph8 Gymnasium, beide am 20.11.2026 abgerufen. Als Wiederholung benannt: Lichtzerlegung und Dichte als Stoffeigenschaft aus NT5, Leiter und Isolatoren aus der Grundschule (Querverweis im Plan auf HSU 3/4). Ausgelassen, weil sie in Ph8 stehen: Stromstärke, Spannung, Widerstand, technische Stromrichtung, Kurzschluss, Reflexionsgesetz, Brechung, Linsen, Kräfte und Gewichtskraft.

**Rechnen nur bei der Dichte.** Der Plan verlangt Berechnungen nur zu Dichte und Masse. Schattengrößen zeigt das Modell als Wert, ohne Rechenaufgaben und ohne Strahlensatz (Mathematik 9).

**Zahlenwerte.** Dichten nach der Tabelle in OpenStax College Physics 2e, Abschnitt 11.2 (gerundet: Aluminium und Granit 2,7, Eisen 7,8, Messing 8,4, Kupfer 8,8, Silber 10,5, Blei 11,3, Gold 19,3 g/cm³); Titan 4,5 und CFK 1,5 g/cm³ nach den Wikipedia-Artikeln. Erkennungsweiten bei Dunkelheit nach ADAC (dunkel etwa 25 m, Reflektoren bis 140 m, Anhalteweg aus 50 km/h etwa 28 m) und Stadt Zürich (hell etwa 40 m). Laserhinweise nach dem Bundesamt für Strahlenschutz. Sonnenhöhe mittags in München: 90° − 48,1° ± 23,4°, also etwa 65° und 18°. Modellwerte (Kraftstärke der Magnete, gehaltene Büroklammern und Nägel, übertragene Elektronen) sind in der App als solche gekennzeichnet; die Finsternis-Schwellen sind schematisch.

**Magnetisieren.** Die Lektion sagt ausdrücklich, dass am Ende jedes Strichs der zum streichenden Pol ungleichnamige Pol entsteht; die Zeichnung zeigt einen streichenden Südpol und rechts den entstehenden Nordpol.

**Bindung in ZAM.** Wie bei `biologie-gymnasium-6` und `informatik-gymnasium-6` binden die Atome an `subject: "nt_gym"`, `grade: 7`, `topic_code` `lb1.1`, `lb1.2`, `lb1.3`, ohne Track. `exam_relevant` ist `false`, weil die Jahrgangsstufe 7 nicht Gegenstand einer Abschlussprüfung ist.

## Quellen

Alle Links in `src/curriculum/sources.ts` wurden am 20.11.2026 mit `curl` geöffnet und ihre Seitentitel gelesen (Wikipedia, Klexikon, OpenStax, ADAC, Stadt Zürich, Bundesamt für Strahlenschutz). Seiten, die 404 lieferten (Klexikon „Schatten“, „Dichte“, „Finsternis“, eine ältere ADAC-Adresse), sind nicht verlinkt. LEIFIphysik ist nicht verlinkt.

## Bestandsabgleich der alten Karten

Abgeglichen wurden die beiden `de-by`-Zellen „Physik 7 Gymnasium“ in zam-os/zam (Commit `bae34e7dfe7d01838e448a65f15871c3549ae3fc`) mit 8 Karten, bytegleich unter `physik-gymnasium-7/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../physik-gymnasium-7/replaces-de-by.json):

- `de-by:gymnasium-7-physik-mechanik-kraefte-masse-dichte-druck` (`01K4P7M0000000000000000J01` bis `J04`): Kraft und Newton, Hookesches Gesetz, Masse und Gewichtskraft, Dichte und Druck.
- `de-by:gymnasium-7-physik-optik-lichtbrechung-totalreflexion-linsen` (`01K4P7X0000000000000000J01` bis `J04`): Brechung, Totalreflexion, Sammellinsen.

Beide folgen dem Lehrplan des achtjährigen Gymnasiums. Im LehrplanPLUS liegen Kräfte und Optik mit Brechung in Ph8. Nur die Dichte steht in NT7, und sie ist in der alten Karte `J04` Teil einer mehrteiligen Synthese mit Gewichtskraft und Druck; eine Teilübernahme würde eine Lernhistorie auf mehrere Karten verteilen.

| Kategorie | Anzahl | Vorschlag |
| --- | ---: | --- |
| A | 0 | – |
| B | 0 | – |
| C | 8 | keep-active: Karten bleiben in den Wiederholungen |

Die Datei hat `"status": "proposal-only"` und `"approved": null`; die Zelle deklariert weder `replaces` noch `retired_items`. Sie braucht deshalb keine Freigabe für die Veröffentlichung.

**Nachbarzellen.** Geprüft wurden außerdem `de-by:gymnasium-8-physik-mechanik-energie-arbeit-leistung-maschinen` und `de-by:gymnasium-9-physik-elektrizitaetslehre-schaltungen-energie-leistung`. Keine ihrer Karten fragt NT7-Wissen ab (Ohmsches Gesetz, Kirchhoff, Energie, Hebel); sie sind nicht in diese Zuordnung aufgenommen. Offene Frage an Thomas: Sollen die Ph8-Themen der alten Gymnasium-7-Zellen (Kräfte, Brechung) später einem Paket Physik 8 Gymnasium zugeordnet werden, statt hier aktiv zu bleiben?
