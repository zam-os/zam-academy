# Englisch 6 Mittelschule — Lehrplanprüfung und Bestandsabgleich

- **Lehrplanquelle (6. Klasse):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/englisch>
  - Snapshot gespeichert in [`englisch-mittelschule-6/tests/fixtures/curriculum.html`](../englisch-mittelschule-6/tests/fixtures/curriculum.html)
  - SHA-256: `7035724bed5101631795092ec348a197e8b95d2c6565a8fd378934444985c09a`
  - Geprüft am: `2026-11-19`
- **Aufbauquelle (5. Klasse):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/englisch>
  - Snapshot gespeichert in [`englisch-mittelschule-6/tests/fixtures/curriculum-e5.html`](../englisch-mittelschule-6/tests/fixtures/curriculum-e5.html)
  - SHA-256: `41e6691545b91a1e4bd9b3216b2089cd1b3024f1ebeb6ece054f445fc81c7c18`
  - Geprüft am: `2026-11-19`
- **Abgrenzung (7. Klasse Regelklasse):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/englisch/regelklasse>
  - Snapshot gespeichert in [`englisch-mittelschule-6/tests/fixtures/curriculum-e7r.html`](../englisch-mittelschule-6/tests/fixtures/curriculum-e7r.html)
  - SHA-256: `1d4c7dbcd50fe2389536c4ca558bab6618755d02427c086c8d5ff622291beab1`
  - Geprüft am: `2026-11-19`

## 1. Abdeckung der Kompetenzerwartungen

Die Matrix [`englisch-mittelschule-6/coverage.json`](../englisch-mittelschule-6/coverage.json) prüft **65 wörtliche Zeilen** aus dem Fachlehrplan Englisch 6 Mittelschule (`E6 1.1` Hör- und Hörsehverstehen, Leseverstehen, Sprechen, Schreiben, Sprachmittlung; `E6 1.2` Wortschatzumfang ca. 400 Wörter und Wendungen, alle 13 aufgezählten Wortschatz-/Strukturpunkte, die drei grammatikalischen Fachbegriffe `tense`, `present progressive`, `will-future`, alle drei Grammatikbereiche sowie Aussprache und Intonation mit IPA; `E6 2` Interkulturelle Kompetenzen; `E6 3` Text- und Medienkompetenzen; `E6 4` Methodische Kompetenzen; `E6 5` Themengebiete inkl. beider übergreifender Kompetenzerwartungen und aller neun Inhaltsbereiche).

`node englisch-mittelschule-6/scripts/check-curriculum.mjs` bestätigt: **65 Zeilen geprüft, 0 nicht gefunden; 36/36 Lektionen abgedeckt**.

- **Als `"implemented"` markiert (54 Zeilen):** Alle Lese-, Schreib-, Sprachmittlungs-, Wortschatz-, Fachbegriffs-, Grammatik-, IPA-, Text-, Methoden- und interkulturellen Wissens- sowie Themengebiets-Zeilen, die direkt in der Web-App geübt und geprüft werden (inkl. UK-Städtekarte, USA-50-Staaten-Karte, Stadtplan, gezeichneter Zimmerszene, zwei Balkendiagrammen, Zahlenzerleger 0–1000, Ordnungszahlen- & Datums-Explorer 1st–31st sowie Steigerungs-Balkenexplorer).
- **Als `"supported"` markiert (11 Zeilen):** Alle drei Hör- und Hörsehverstehens-Zeilen, alle drei Sprech-Zeilen, der Jahresaufbau des Wortschatzumfangs (~400 Wörter/Wendungen), flüssiges Verbinden und Intonation beim lauten Sprechen (`There's ̮an ̮old ̮castle …`), sozial angemessenes Verhalten in realen Begegnungssituationen, spontane reale Situationsbewältigung sowie tagesaktuelle Themen. Hierfür stellt die App fünf britisch (`en-GB`) und amerikanisch (`en-US`) markierte Hörskripte (lokale Browser-Sprachausgabe/Partner-Kontrollkästchen), Dialogbausteine, Stichwort- und Notizhilfen bereit; echte Audio-/Videoaufnahmen, spontane Partnergespräche und Lehrkraftfeedback bleiben eigene Unterrichtspraxis.

## 2. Fachliche Abgrenzung zu Klasse 5 und Klasse 7 Mittelschule

- **Aufbau auf Englisch 5 Mittelschule:** Bekannte Grundlagen aus Klasse 5 werden ausdrücklich aufgegriffen und erweitert — insbesondere Großbritannien & Hauptstädte (erweitert um wichtige Städte wie Glasgow, Manchester, Liverpool, Birmingham sowie USA), Zahlen 0–100 (erweitert auf 0–1000), `` `s ``-Genitiv (ergänzt durch den `of`-Genitiv bei Sachen), `this/that` (ergänzt durch `these/those`), Subjektpronomen (ergänzt durch Objektpronomen), Gerund nach Vorlieben (`I'm good at …`), `simple present` und `simple past` (kontrastiert mit `present progressive` und `will-future`) sowie `SVO` (erweitert um `Ort vor Zeit` und Häufigkeitsadverbien).
- **Abgrenzung zu Englisch 7 Mittelschule (strikte Ausschlüsse):** Folgende Inhalte gehören laut LehrplanPLUS erst in **Jahrgangsstufe 7** und werden in `englisch-mittelschule-6` bewusst **nicht** vermittelt oder vorausgesetzt:
  - `present perfect simple` (`ever`, `never`, `already`)
  - `going-to-future`
  - `past progressive` (`was`/`were` + `-ing`)
  - romanische Steigerung mit `more` / `most` und Steigerung von `little` (E6 beschränkt sich strikt auf germanische Steigerung regelmäßiger Adjektive mit `-er` / `the …-est` plus `good` / `bad`)
  - Modalverb `should` / `shouldn't` (E6 beschränkt sich auf `can/can't`, `must`, `have (got) to`)
  - Possessivpronomen (`mine`, `yours`, …), Reflexivpronomen (`myself`, `yourself`, …), Relativpronomen (`who`, `which`, `that`), `propword one`, `much`/`many`-Kontrast, unzählbare Substantive wie `information`/`news` sowie Zahlen > 1000 / Ordnungszahlen > 31.

## 3. Bestandsabgleich (`zam-os/zam`)

Geprüft wurde [`zam-os/zam`](https://github.com/zam-os/zam) (`tests/fixtures/legacy/` und `src/kernel/library/bundled-cells.ts`) am Commit `1ff016cfd7a0765c5338eb4248d0c14f3b92261c` (`2026-11-19`):

- Es existieren **keine** `de-by:mittelschule-*`-Bestandszellen.
- Die thematisch benachbarten Sechstklass-Zellen anderer Schularten (`de-by:realschule-6-englisch-grammatik-grundlagen` und `de-by:gymnasium-6-englisch-past-tenses-present-perfect-adjectives`) wurden bereits im Realschul- bzw. Gymnasiumspaket (`englisch-realschule-6`, #162; `englisch-gymnasium-6`, #154) inventarisiert und ersetzt.
- Daher enthält [`englisch-mittelschule-6/replaces-de-by.json`](../englisch-mittelschule-6/replaces-de-by.json) `"status": "proposal-only"`, `"approved": null`, `"sources": []` und `"rows": []`, und [`englisch-mittelschule-6/cell.json`](../englisch-mittelschule-6/cell.json) deklariert keine `replaces` oder `retired_items`.
