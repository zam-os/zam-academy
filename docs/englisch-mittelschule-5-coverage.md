# Englisch 5 Mittelschule — Lehrplanprüfung und Bestandsabgleich

- **Lehrplanquelle (5. Klasse):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/englisch>
  - Snapshot gespeichert in [`englisch-mittelschule-5/tests/fixtures/curriculum.html`](../englisch-mittelschule-5/tests/fixtures/curriculum.html)
  - SHA-256: `41e6691545b91a1e4bd9b3216b2089cd1b3024f1ebeb6ece054f445fc81c7c18`
  - Geprüft am: `2026-11-14`
- **Abgrenzung (6. Klasse):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/englisch>
  - Snapshot gespeichert in [`englisch-mittelschule-5/tests/fixtures/curriculum-e6.html`](../englisch-mittelschule-5/tests/fixtures/curriculum-e6.html)
  - SHA-256: `7035724bed5101631795092ec348a197e8b95d2c6565a8fd378934444985c09a`

## 1. Abdeckung der Kompetenzerwartungen

Die Matrix [`englisch-mittelschule-5/coverage.json`](../englisch-mittelschule-5/coverage.json) prüft **69 wörtliche Zeilen** aus dem Fachlehrplan Englisch 5 Mittelschule (`E5 1.1` Hör-/Hörsehverstehen, Leseverstehen, Sprechen, Schreiben, Sprachmittlung; `E5 1.2` Wortschatzumfang ~550 Wörter, alle 14 aufgezählten Wortschatz-/Struktureinzelpunkte, 10 grammatikalische Fachbegriffe, Grammatik, Aussprache und Intonation mit IPA; `E5 2` Interkulturelle Kompetenzen; `E5 3` Text- und Medienkompetenzen; `E5 4` Methodische Kompetenzen; `E5 5` Themengebiete inkl. beider übergreifender Kompetenzerwartungen).

`node englisch-mittelschule-5/scripts/check-curriculum.mjs` bestätigt: **69 Zeilen geprüft, 0 nicht gefunden; alle 36 Lektionen abgedeckt**.

- **Als `"implemented"` markiert (58 Zeilen):** Alle Grammatik-, Wortschatz-, Schreib-, Lese-, Sprachmittlungs-, Textbaustein-, Methoden- und Sachthemen-Zeilen, die direkt in der Web-App geübt und überprüft werden können (inkl. interaktiver UK/Irland-Karte, Zahlenschieber 0–100, Viertelstunden-Uhr, Garten-/Haustierszene, Schulweg-Grafik und `SVO`/`simple present`/`simple past`).
- **Als `"supported"` markiert (11 Zeilen):** Hörsehverstehen mit echter Mimik/Gestik und Umgebungsgeräuschen, spontane Gesprächsführung mit Partnern, reale Situationsbewältigung über den Unterricht hinaus, Vortrag vor der Klasse, tatsächliche Aussprachekorrektur, gelebte Begegnungssituationen, Jahreswortschatz-Aufbau sowie tagesaktuelle Themen. Die App liefert hierfür Vorlese-Skripte (lokale Browser-Sprachausgabe/Partner-Kontrollkästchen), Sprechanlässe und Muster; die echte mündliche Praxis bleibt im Unterricht.

## 2. Fachliche Abgrenzung zu Englisch 6 Mittelschule

Folgende Inhalte gehören laut LehrplanPLUS erst in **Jahrgangsstufe 6** und werden in `englisch-mittelschule-5` bewusst **nicht** vermittelt oder vorausgesetzt:

- `present tense progressive`
- `will-future`
- `of-Genitiv` (Klasse 5 nutzt ausschließlich den `` `s ``-Genitiv)
- Personalpronomen als Objekt (`me, him, her, us, them`)
- Modalverben (`can/can't`, `must`, `have (got) to`)
- Steigerung der Adjektive (`-er`/`-est`)
- `USA` als landeskundlicher Schwerpunkt (Klasse 5 behandelt Großbritannien + Weltsprache Englisch)

## 3. Bestandsabgleich (`zam-os/zam`)

Geprüft wurde [`zam-os/zam`](https://github.com/zam-os/zam) (`tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`) am Commit `2057e1c35a5e768eb0c59cb74c3700c0101f67a2` (`2026-11-14`):

- Es existieren **keine** `de-by:mittelschule-*`-Bestandszellen.
- `de-by:realschule-5-englisch-grundlagen-to-be-have-got` ist bereits im Realschulpaket [`englisch-realschule-5`](../englisch-realschule-5/) inventarisiert.
- `de-by:gymnasium-5-englisch-starter-grammar-tenses` (`2026.08.1`, 4 Atome, 8 Karten) trägt ausdrücklich das Schulart-Tag **Gymnasium 5**. Wie bei anderen Schulart-Bestandszellen bleibt diese Zelle unberührt für eine künftige Gymnasium-5-Lernreihe; `englisch-mittelschule-5/replaces-de-by.json` führt daher `"status": "proposal-only"`, `"approved": null`, `"rows": []` und `"sources": []`.
- **Offene Bestätigungsfrage für Thomas im PR:** Soll `de-by:gymnasium-5-englisch-starter-grammar-tenses` wie dokumentiert vollständig bei Gymnasium 5 verbleiben?
