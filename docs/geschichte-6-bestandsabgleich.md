# Geschichte 6 Realschule: Lehrplanabgleich und Bestandsabgleich

Stand 18. November 2026.

## Lehrplan

Quelle ist der Fachlehrplan Geschichte 6 Realschule auf
<https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geschichte>,
am 18.11.2026 direkt abgerufen (kein Archiv). Die Seite liegt unverändert in
[`geschichte-realschule-6/tests/fixtures/lehrplanplus-g6.html`](../geschichte-realschule-6/tests/fixtures/lehrplanplus-g6.html),
SHA-256 `6aae8c305838f0274cc77ebec5588f66a67a383feffb4383ead5daf02c9f2605`.
Der Fachlehrplan gilt für alle Wahlpflichtfächergruppen; die Zelle bindet
deshalb keinen `track`.

| Lernbereich | Stunden | Kompetenzerwartungen | Lektionen |
| --- | ---: | ---: | ---: |
| 1 Methoden und Arbeitstechniken | – | 5 | 6 |
| 2 Der Mensch und seine Geschichte | ca. 8 | 4 | 4 |
| 3 Ägypten – eine frühe Hochkultur | ca. 6 | 5 | 4 |
| 4 Die griechische Antike | ca. 10 | 7 | 7 |
| 5 Das Imperium Romanum | ca. 12 | 9 | 9 |
| 6 Von der Antike zum Frühmittelalter | ca. 10 | 6 | 5 |
| 7 Technik verändert das Leben der Menschen (Längsschnitt) | ca. 5 | 4 | 4 |
| 8 Menschen machen Geschichte (Längsschnitt) | ca. 5 | 4 | 3 |

[`coverage.json`](../geschichte-realschule-6/coverage.json) ordnet alle 44
Kompetenzerwartungen wortgleich Lektionen zu.
`node geschichte-realschule-6/scripts/check-curriculum.mjs` prüft das gegen die
gespeicherte Seite: „44 competences, 0 not found; page SHA-256 matches“.
Zwei Zeilen tragen `supported` statt `implemented`, weil ihr Kern im Unterricht
stattfindet: eigene Comics, Rekonstruktionsbilder und Rollenspiele (LB 1,
Narration) und die Arbeit mit dem eigenen Schulbuch und echten Filmen (LB 1,
Medien). Karten und Bilder sind in den Übungen beschrieben, nicht abgebildet;
die betroffenen Zeilen sagen das in `evidence`.

Alle 33 Grundlegenden Daten und Begriffe stehen mit Erklärung und Lektion im
Nachschlagen. „753 v. Chr. mythische Gründung Roms“ nennt der Lehrplan nur in
Lernbereich 7; gelehrt wird es in der Rom-Lektion von Lernbereich 5.

Nachbarjahrgänge: Geschichte 5 gibt es an der Realschule nicht; Geschichte 7
(Mittelalter, Frühe Neuzeit) schließt an Karl den Großen an. Das Paket endet
deshalb mit der Kaiserkrönung 800 und lässt Lehnswesen, Städte und
Grundherrschaft für Klasse 7.

## Bestehende ZAM-Karten

Geprüft gegen zam-os/zam, Commit `e517a1ef709e0e6ee5f968c342affeb5b14cef35`.
Die Zelle `de-by:realschule-6-geschichte-urgeschichte-antike`, Version
`2026.08.1`, liegt bytegenau in
[`tests/fixtures/de-by-realschule-6-geschichte-urgeschichte-antike-kvt.json`](../geschichte-realschule-6/tests/fixtures/de-by-realschule-6-geschichte-urgeschichte-antike-kvt.json)
(SHA-256 `9a5938aef9c8dbb3e9b8e52544004fcdaa981438194b770157bb97ae360d156f`).
Sie hat vier Atome mit acht Karten.

| Alte Karte | Inhalt | Vorschlag | Nachfolger |
| --- | --- | --- | --- |
| J01 | Was bezeichnet die neolithische Revolution? | **A** | `g6-jungsteinzeit-check` |
| J02 | Vergleich Alt- und Jungsteinzeit mit vielen Einzelheiten | **C**, aktiv lassen | – |
| J03 | Warum nannte Herodot Ägypten „Geschenk des Nils“? | **A** | `g6-nil-check` |
| J04 | Sechs Merkmale der Hochkultur Ägypten | **C**, aktiv lassen | – |
| J05 | Wer durfte in der Volksversammlung Athens abstimmen? | **A** | `g6-perikles-check` |
| J06 | Polis, Einrichtungen der attischen Demokratie, Vergleich mit heute | **C**, aktiv lassen | – |
| J07 | Wer wurde 27 v. Chr. erster römischer Kaiser? | **A** | `g6-caesar-augustus-merken` |
| J08 | Republik, Prinzipat und Limes in Bayern | **C**, aktiv lassen | – |

Die vier A-Karten fragen dasselbe ab wie je eine neue Karte. Die vier
Tier-2-Karten verlangen lange Synthesen, die das neue Paket auf mehrere Karten
verteilt; eine Lernhistorie darf nicht auf mehrere Karten verteilt werden,
deshalb C. J08 nennt Augsburg außerdem unter den Kastellen am Limes; die neue
Lektion führt Augsburg als Hauptstadt der Provinz Raetien.

Die Datei [`replaces-de-by.json`](../geschichte-realschule-6/replaces-de-by.json)
ist ein Vorschlag (`"status": "proposal-only"`, `"approved": null`). Die Zelle
erklärt weder `replaces` noch `retired_items`; alle acht alten Karten bleiben
aktiv. `scripts/validate-cell.mjs` installiert die alte und die neue Zelle in
einer Wegwerf-Bibliothek, legt 16 Reviews auf die alten Karten an und prüft:
126 neue Karten, alte Karten und Reviews unverändert, Installation und Aufnahme
wiederholbar.

**Fragen an Thomas:**

1. Gibst du die Zuordnung 4 A / 0 B / 4 C frei? Dann folgt eine Version mit
   `replaces` an den vier Nachfolgern.
2. Sollen die vier C-Karten aktiv bleiben oder mit `retired_items` aus den
   aktiven Wiederholungen genommen werden?
3. Das Paket Geschichte/Politik/Geographie 5 der Mittelschule nennt dieselbe
   alte Zelle und hat sie bewusst nicht zugeordnet
   ([`docs/gpg-mittelschule-5-coverage.md`](gpg-mittelschule-5-coverage.md)).
   Gehört sie damit zu diesem Realschulpaket? Die Zellen
   `de-by:gymnasium-6-geschichte-…` bleiben beim Gymnasium.

## Quellen

Alle Links wurden am 18.11.2026 geöffnet und ihr Seitentitel gelesen
(`curl -sL -A "Mozilla/5.0" <url> | grep -o "<title[^>]*>[^<]*"`). Zwei kurze
Originalquellen stehen in einer für die App geschriebenen Übersetzung, jeweils
mit Link zum lateinischen Wortlaut: Augustus, Res Gestae 34, und Plinius,
Briefe 10, 96, 3. Lehrervideos fügt ein späterer Schritt hinzu.
