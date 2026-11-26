# Politik und Gesellschaft 8 Gymnasium (SWG) – Lehrplan- und Bestandsabgleich

## 1. Amtliche Lehrplangrundlage

- **Quelle:** `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/pug` (*Politik und Gesellschaft 8 (SWG)*, Gymnasium Bayern)
- **Abgerufen am:** 2026-11-26
- **Unveränderter HTML-Snapshot:** [`politik-gymnasium-8/tests/fixtures/curriculum.html`](../politik-gymnasium-8/tests/fixtures/curriculum.html)
- **SHA-256 des Snapshots:** `f38e22bf2a21285265ac9a5c4c2e519d4166239387f3ec177c6641093c218697`
- **Verifikation:** `node politik-gymnasium-8/scripts/check-curriculum.mjs` prüft den SHA-256 des Snapshots und sucht alle **66 Kompetenzerwartungen** wortwörtlich (`66 verbatim competence rows, 0 not found`).

## 2. Aufbau und Abdeckung (44 Lektionen · 66 Kompetenzerwartungen)

| Bereich | Stunden | Lektionen | Kompetenzerwartungen | Abdeckung (`implemented` / `supported`) |
| --- | --- | --- | --- | --- |
| LB 1 · Die Jugendphase bewusst erleben und gestalten | ca. 18 Std. | 5 | 6 | 2 `implemented`, 4 `supported` (eigene Befragungen/Projekt im Unterricht) |
| LB 2 · Gesellschaftliche Grundwerte und soziale Normen | ca. 18 Std. | 5 | 6 | 6 `implemented` |
| LB 3 · Vorbilder, Idole und Influencer hinterfragen | ca. 16 Std. | 5 | 6 | 6 `implemented` |
| LB 4 · Politik als Gestaltungsmittel für das Zusammenleben | ca. 20 Std. | 6 | 7 | 3 `implemented`, 4 `supported` (aktuelle Recherche, Erkundung vor Ort, Präsentation) |
| LB 5 · Grenzüberschreitende Zusammenarbeit vor Ort | ca. 12 Std. | 4 | 4 | 1 `implemented`, 3 `supported` (lokale Recherche, Projekt vor Ort, Klassenpräsentation) |
| Profil 6.1 · Heimat(en) verstehen und gestalten | ca. 14 Std. | 4 | 6 | 4 `implemented`, 2 `supported` (lokale Brauchtumsrecherche, Politikerbefragung) |
| Profil 6.2 · Politisches Geschehen mitverfolgen | ca. 14 Std. | 3 | 4 | 1 `implemented`, 3 `supported` (mehrwöchige Medienbeobachtung, freie Rede, Klassendebatte) |
| Profil 6.3 · Die anderen und ich – soziale Gruppe | ca. 14 Std. | 5 | 8 | 6 `implemented`, 2 `supported` (physisches Rollenspiel & Gruppenarbeitsphasen) |
| Profil 6.4 · Bewusst leben, sich gesund ernähren | ca. 14 Std. | 4 (mitgenutzt) | 6 | 4 `implemented`, 2 `supported` (Kontakte zu Beratungseinrichtungen & Betrieben) |
| Profil 6.5 · Bewusst leben, sich gesund ernähren (lang) | ca. 28 Std. | 7 (4 + 3) | 13 | 5 `implemented`, 8 `supported` (Küche/Speisenzubereitung, Pausenaktion, Mahlzeit, Berufserkundung) |

In der Profilstunde am SWG wählt die Klasse entweder zwei 14-Stunden-Bereiche (aus 6.1–6.4) oder den 28-Stunden-Bereich 6.5. In der App stehen alle Profilbereiche frei zur Auswahl. Alle Zeilen in [`politik-gymnasium-8/coverage.json`](../politik-gymnasium-8/coverage.json) unterscheiden ehrlich zwischen innerhalb der App geleisteter Übung (`implemented`) und Aufgaben, deren reale Erhebung, Erkundung oder Debatte in der Schule stattfindet (`supported`).

## 3. Abgrenzung zu Nachbarjahrgängen

- **Jahrgangsstufe 9 (PuG 9 SWG):** Themen wie UN-Kinderrechtskonvention, gesetzlicher Jugendschutz (Altersgrenzen, FSK, USK) und die vertieften Strukturprinzipien des Grundgesetzes (Demokratie, Bundesstaat, Rechtsstaat, Sozialstaat) gehören erst in Jahrgangsstufe 9 und sind gezielt ausgeklammert (durch `LATER_GRADE_RE` in den Tests abgesichert).

## 4. Verifizierte Quellenbasis

Alle in `outline.json` und `cell.json` verlinkten Quellen wurden am 2026-11-26 direkt per HTTPS abgerufen und anhand von HTTP-Status 200 und `<title>` geprüft (LehrplanPLUS Bayern, bpb Politiklexikon & Soziale Situation, Shell Jugendstudie 2024, Grundgesetz Art. 1/5/28, Bayerische Verfassung, Bayerische Gemeindeordnung, DGE-Empfehlungen & Ernährungskreis, Verbraucherzentrale, Destatis Gesundheit, Klexikon und geprüfte deutschsprachige Wikipedia-Artikel zu den Fachbegriffen).

## 5. Altbestandsabgleich (`replaces-de-by.json`)

- **Geprüftes Repository:** `zam-os/zam`, Commit `c92f4e383385ee487cd8b30f73b3bf3cb27b0860` (`tests/fixtures/curriculum/`, `tests/fixtures/legacy/`, `src/kernel/library/bundled-cells.ts`).
- **Befund:** In `zam-os/zam` existiert **keine** `de-by`-Zelle für Politik und Gesellschaft bzw. Sozialkunde am Gymnasium (insbesondere nicht für Jahrgangsstufe 8). Die vorhandene Zelle `de-by:gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz` gehört zum Fach *Wirtschaft und Recht 8* und bleibt vollständig unberührt.
- **Ergebnis:** `politik-gymnasium-8/replaces-de-by.json` hat `"status": "proposal-only"`, `"approved": null`, `"sources": []`, `"rows": []`. `cell.json` deklariert weder `replaces` noch `retired_items`.
