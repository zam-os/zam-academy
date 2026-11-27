# Geschichte/Politik/Geographie 8 Mittelschule: Lehrplanabgleich und Kartenbestand

Paket: [`gpg-mittelschule-8/`](../gpg-mittelschule-8/) · 32 Lektionen (31 Regelklasse `R`, 32 M-Zug `M`) · 64 ZAM-Karten · Stand: 2026-11-27.

## Warum ein GPG-8-Paket statt eines isolierten PuG-Pakets

An der bayerischen Mittelschule (BayMSO Anlage 1, LehrplanPLUS Bayern) ist „Politik und Gesellschaft“ kein eigenständiges Unterrichtsfach, sondern integraler Teil des Fächerverbunds **Geschichte/Politik/Geographie (GPG)**. Das Academy-Register (`academy.json`) bildet diesen Verbund über `fachverbunde` (`id: "gpg"`, `school: "mittelschule"`, `grades: [5..10]`, `paths: ["geschichte", "pug", "geographie"]`) ab, und `scripts/academy-registry.test.mjs` verlangt für die Jahrgangsstufen 5–10 der Mittelschule zwingend die Registrierung über `fach: "gpg"`. Alle drei Atlaspfade (Politik und Gesellschaft, Geschichte, Geographie) öffnen daher dieselbe App.

Den gesellschaftspolitischen Schwerpunkt für *Politik und Gesellschaft* bilden die Lernbereiche 3 (*Politik und Gesellschaft*, 7 Lektionen) und 4 (*Lebenswelt*, 8 Lektionen) neben Lernbereich 1 (*Lebensraum Erde*, 7 Lektionen) und Lernbereich 2 (*Zeit und Wandel*, 10 Lektionen).

## Amtliche Lehrplangrundlage

- **Regelklasse (`R`):** [LehrplanPLUS Mittelschule GPG 8 (Regelklasse)](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/gpg/regelklasse) (abgerufen am 2026-11-27), SHA-256: `7fa439a69ac62da8e3534f788223a87129fbf6a024113c8d7c340d8183ed59ba` (`gpg-mittelschule-8/tests/fixtures/curriculum-r.html`).
- **M-Zug (`M`):** [LehrplanPLUS Mittelschule GPG 8 (Mittlere-Reife-Klasse)](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/gpg/mittlere-reife-klasse) (abgerufen am 2026-11-27), SHA-256: `a757db83d229c940fc02c6d446b85c4f3da085014daae4a8b81ae0be6faa2d33` (`gpg-mittelschule-8/tests/fixtures/curriculum-m.html`).
- Beide Fachlehrpläne weisen den vier Lernbereichen keine Stundenvorgaben zu.
- Prüfung über `node scripts/check-curriculum.mjs`: **41 wörtliche Kompetenzerwartungen (`20 R` + `21 M`), 0 not found**; beide SHA-256-Prüfsummen verifiziert.

| Lernbereich | R-Kompetenzen | M-Kompetenzen | Lektionen | Davon `supported` |
| --- | ---: | ---: | --- | --- |
| 1 Lebensraum Erde | 5 | 5 | 7 | R: 1.3 (eigener Alltag), 1.5 (häusliches Energiesparen) · M: 1.3, 1.4 (Präsentation), 1.5 |
| 2 Zeit und Wandel | 6 | 6 | 10 | R & M: 2.4 (eigene Biografie-Recherche vor Ort) |
| 3 Politik und Gesellschaft | 4 | 4 | 7 | M: 3.3 (Quellenrecherche zu Besatzungsmotiven) |
| 4 Lebenswelt | 5 | 6 | 8 (7 R&M, 1 M-only) | R & M: 4.2 (aktuelle Wahlstatistik ablesen), 4.3 (reale Erkundung vor Ort) · M: 4.6 (Kostenrecherche vor Ort) |

## Nachbarjahrgänge

- **GPG 7 (Regelklasse und M-Zug, abgerufen am 2026-11-27):** Behandelt Entwicklungs- und Schwellenländer (Asien/Afrika), Industrialisierung und Soziale Frage, Ersten Weltkrieg sowie Versailler Vertrag. Drei Lektionen knüpfen mit explizitem Wiederholungshinweis daran an (`gpg8-usa-entwicklungsstand`, `gpg8-weimar-verfassung`, `gpg8-sozialstaat-armut`).
- **GPG 9 (Regelklasse und M-Zug, abgerufen am 2026-11-27):** Behandelt EU-Institutionen, Globalisierung, globale Klimaabkommen, DDR/Planwirtschaft vs. Soziale Marktwirtschaft/Wiedervereinigung 1990 sowie Terrorismus und Migration. Diese Inhalte werden nicht vorweggenommen (`gpg8-potsdam-teilung` endet konsequent mit der Zonenentwicklung bis 1949).

## Verifizierte Quellen

Alle verlinkten Seiten wurden am 2026-11-27 einmalig mit `curl -sL -A "Mozilla/5.0"` abgerufen und ihre realen Seitentitel bestätigt (u. a. `lehrplanplus.bayern.de`, `klexikon.zum.de`, `bpb.de`, `hanisauland.de`, `hdg.de/lemo`, `gesetze-im-internet.de`, `bundestag.de`, `bundeswahlleiterin.de`, `statistik.bayern.de`, `tafel.de`, `deutsche-rentenversicherung.de`, `destatis.de`, `umweltbundesamt.de`, `oekolandbau.de`, `lfl.bayern.de`, `museen.nuernberg.de`, `gdw-berlin.de`). Seiten mit 404/Fehlerseiten (z. B. alte LeMO- oder HanisauLand-Unterpfade) wurden aussortiert. Keine Tagesstatistiken aus dem Gedächtnis; stattdessen verlinken die Lektionen auf die amtlichen Datenportale.

## Karten, Entdecker-Grafiken und Labore

- **Karten (`gpg-mittelschule-8/src/data/maps.json`, 232 KB):** Einmalig aus gemeinfreiem Natural Earth v5.1.1 mittels `scripts/build-map-data.mjs` erzeugt (`world`, `northAmerica`, `northAmericaEurope`, `europe1942`, `germany1945`; Quellen-Hashes in `src/data/NOTICE.md`). Historische Überlagerungen (Machtbereich Ende 1942 und Besatzungszonen 1945–1949) sind vereinfachte Skizzen und in der App ausdrücklich als solche beschriftet.
- **33 Inline-SVGs (`src/figures/`):** Jede Lektion besitzt mindestens ein eigenes barrierefreies SVG, überwiegend mit anklickbaren und per Tastatur fokussierbaren Teilgruppen (`data-part`) und Erklärungsleiste. Alle vier Lernbereiche besitzen konsistente SVG-Icons (`src/figures/icons.ts`) und eigene Akzentfarben (`[data-lb="1".."4"]`) in Hell- und Dunkelmodus.
- **6 interaktive Live-SVG-Labore (`src/labs.ts`):** `energiemix` (`gpg8-energietraeger`), `haushalt-energie` (`gpg8-energie-alltag`), `gesetzgebung` (`gpg8-gesetzgebung`), `wahlbeteiligung` (`gpg8-wahlbeteiligung`), `generationenvertrag` (`gpg8-generationenvertrag`), `oekolandbau-kosten` (`gpg8-oekolandbau-kosten`, M-Zug). Jedes Labor bietet maßstäbliche SVG-Balken/Waagen/Flussdiagramme und drei erreichbare Ziele (keines beim Start erfüllt).

## Bestehende ZAM-Karten (`replaces-de-by.json`)

Geprüft gegen den ZAM-Bestand (`zam-os/zam`, Commit `b7fdfcc4e30d21bbbd97fb2025952ff7f4e296ac`): Es gibt keine `de-by-mittelschule-*`-Zellen in `tests/fixtures/curriculum/` oder `src/kernel/library/bundled-cells.ts`. Überschneidende Themen in Realschul- und Gymnasialzellen (z. B. Weimar/NS, Nachkriegszeit, Nordamerika, Politik 10) bleiben bei ihrer jeweiligen Schulart aktiv. Daher bleibt `replaces-de-by.json` leer (`"status": "proposal-only"`, `"approved": null`), und `cell.json` deklariert weder `replaces` noch `retired_items`.

## Verifikation

- `cd gpg-mittelschule-8 && npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip && node scripts/check-curriculum.mjs`: **224 Vitest-Tests bestanden** (3 Dateien: 148 Paket-Tests, 64 Feedback-Tests, 12 Progress-Merge-Tests), Single-File-Build `dist/index.html` (`563.31 kB`), Offline-ZIP `release/ZAM-Academy-GPG-8-offline.zip` verifiziert, **41 wörtliche Kompetenzerwartungen (`20 R` + `21 M`), 0 not found** und verifizierte SHA-256-Prüfsummen.
- Chrome Headless DOM-Sweep (`--dump-dom`, `#lesson=<id>&level=1|2`): alle **64 Lektionsansichten** geprüft (`0 failures`, kein `NaN`/`undefined`).
- Chrome Headless Screenshots (`--window-size`, Hell- und Dunkelmodus via `--force-dark-mode`): Lernpfad, Nachschlagen, Nordamerika-/Europa-/Besatzungszonen-Karten, interaktive Entdecker-SVGs sowie alle sechs Live-SVG-Labore visuell in Hell und Dunkel geprüft.
- Root- und `zam-core`-Prüfung (`zam-core@0.54.0`): `gpg-mittelschule-8/scripts/validate-cell.mjs` (32 Atome / 64 Karten idempotent installiert und verifiziert), `scripts/validate-cells.mjs` (alle 78 Zellen ohne Distraktor-Warnungen), `scripts/build-catalog.mjs` (78 Zellen), Root-Tests (`build-catalog`, `academy-registry`, `package-version`, `changed-apps`) sowie `node scripts/package-version.mjs check main`.

## Offene Punkte vor Freigabe

- **Lehrkraft-Videos (`AGENTS.md` § 4):** Gemäß Regel für neue Pakete wurden zunächst keine externen Video-Links hinterlegt; ein separater Schritt wählt und prüft passende deutschsprachige Erklärvideos via YouTube-oEmbed.
- **Mapping-Freigabe (`replaces-de-by.json`):** `"approved"` steht auf `null` (Vorschlag ohne Übertragung schulartfremder Bestände; Entscheidung bei Thomas).
