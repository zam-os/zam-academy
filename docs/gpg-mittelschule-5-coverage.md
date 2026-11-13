# Geschichte/Politik/Geographie 5 Mittelschule: curriculum check and card inventory

Package: [`gpg-mittelschule-5`](../gpg-mittelschule-5/) · 34 lessons · 68 cards · checked 2026-11-13.

## Why one GPG package and not "Geschichte 5"

The request was a history package for Grade 5 of the Mittelschule. At the Bavarian Mittelschule, history is not a subject of its own: it is part of Geschichte/Politik/Geographie (GPG), with one Fachlehrplan per grade. The Academy registry models this as the `gpg` Fachverbund (grades 5–10) and requires a Mittelschule package for these grades to be registered once with `fach: "gpg"`; the Geschichte, Politik und Gesellschaft and Geographie paths then all open the same app. A history-only package could not satisfy the coverage rule ("every competence has a lesson") and would be wrong for learners who reach it through the Geographie path. The package therefore covers the whole GPG 5 Fachlehrplan; its history parts are Lernbereich 2 (Zeit und Wandel, 10 lessons) and the historical part of Lernbereich 3 (Egypt and Athens, 5 lessons).

Registering the first real GPG package changed one shared test: `scripts/academy-registry.test.mjs` assumed that every GPG grade is still a planned placeholder. It now expects the package node for a grade that has a registered GPG package and the placeholder otherwise.

## Official source

- [LehrplanPLUS Mittelschule GPG 5](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/gpg), page title "LehrplanPLUS - Mittelschule - 5 - Geschichte/Politik/Geographie - Fachlehrpläne", fetched live on 2026-11-13 with a browser User-Agent. SHA-256 of the saved HTML: `94d64a9c5eec3f6d4589f87123605ffbb5e75f72c54b652d1a82896d3c4cc60d` (stored byte-exact in `gpg-mittelschule-5/tests/fixtures/curriculum.html`).
- The Fachlehrplan has four Lernbereiche and allocates no hours to them. Grade 5 has no M-Zug; there are no tracks.
- `node scripts/check-curriculum.mjs` in the package: "15 verbatim competence rows, 0 not found; curriculum SHA-256 matches."

| LB | Kompetenzerwartungen | Lessons | Status |
| --- | ---: | --- | --- |
| 1 Lebensraum Erde | 5 | sonnensystem, erde-entstehung, kontinente, globus-karte, klimazonen, karten-lesen, deutschland, bayern, bayern-kueste, energie, umwelt-alltag | 4 implemented, 1 supported (own environmental behaviour) |
| 2 Zeit und Wandel | 4 | zeitleiste, altsteinzeit, jungsteinzeit, jaeger-bauern, nil, nil-leistungen, nil-heute, rom-reich, limes, roemer-spuren | 4 implemented |
| 3 Politik und Gesellschaft | 2 | aegypten-alltag, pyramide, volksversammlung, demokratie, griechen-erbe | 2 implemented |
| 4 Lebenswelt | 4 | konflikte, streit-loesen, regeln, klassensprecher, klassenrat, familienformen, familienwandel, inklusion | 2 implemented, 2 supported (democratic behaviour in a real election and class council; respectful cooperation with people with disabilities) |

Each row of `coverage.json` names its lessons, the evidence in the app and what stays outside it.

## Neighbouring grades

- **HSU 3/4 (Grundschule)** covers time division, maps with legend and scale, Bavaria on the map, energy, waste and living together (see [hsu-4-curriculum-and-concept.md](hsu-4-curriculum-and-concept.md)). Seven lessons build on it and say so in a "Wiederholung aus HSU 3/4" note: zeitleiste, karten-lesen, bayern, energie, umwelt-alltag, konflikte, regeln.
- **GPG 6 Mittelschule** ([page](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/gpg), fetched 2026-11-13, SHA-256 `05af1bb7eee315cbed839b766828a705e10cd8d3bc2bc54dc82feeb55f62360c`) continues with Germany and Europe including Turkey and the Middle Ages. The package does not anticipate these; the Germany lesson stays at the overview the GPG 5 expectation asks for.
- Realschule and Gymnasium teach the same periods in Geschichte 6 with more depth (Hochkulturen, Rome in detail); the Mittelschule text stays at the simpler level of the GPG 5 expectations ("vereinfacht", "unter Anleitung").

## Sources shown in the lessons

Every link was opened once with `curl -sL -A "Mozilla/5.0"` and its real page title read on 2026-11-13; pages that answered 404 or a generic error were not used (several bpb, Planet Wissen, DLR, ESA and UNESCO paths). Used: LehrplanPLUS; Klexikon (Sonnensystem, Erde, Kontinent, Meer, Globus, Landkarte, Klima, Deutschland, Bayern, Alpen, Watt (Natur), Gezeiten, Energie, Abfall, Steinzeit, Nil, Altes Ägypten, Pharao, Hieroglyphen, Pyramide, Römisches Reich, Limes, Augsburg, Regensburg, Altes Griechenland, Athen, Demokratie, Olympische Spiele, Wahl, Ehe, Behinderung); HanisauLand of the bpb (Bundesländer, Nachhaltigkeit, Demokratie, Konflikt, Gewalt, Mediation, Kompromiss, Familie, Inklusion); Kinderzeitmaschine (Vorgeschichte, Altsteinzeit, Jungsteinzeit, Frühe und hohe Kaiserzeit, Was ist Demokratie?); BayernAtlas; Nationalpark Berchtesgaden; Weltnaturerbe Wattenmeer; Umweltbundesamt (UBA-Umwelttipps); LfU Bayern (Abfall); Archäologische Staatssammlung; SMÄK; Deutsche Limeskommission; Deutsche UNESCO-Kommission (Welterbestätten); Via Claudia Augusta; BayEUG Art. 62 on gesetze-bayern.de; Destatis (Haushalte und Familien); Aktion Mensch (Inklusion); Natural Earth on GitHub.

BayEUG Art. 62 Abs. 3 was read for the class-representative lesson: "Ab Jahrgangsstufe 5 wählt jede Klasse aus ihrer Mitte eine Klassensprecherin oder einen Klassensprecher und seine Stellvertreterin oder seinen Stellvertreter." The lesson does not state a majority rule, because that is set by the school regulations.

## Maps and drawings

Maps are prepared once from public-domain Natural Earth v5.1.1 data (file hashes in `gpg-mittelschule-5/src/data/NOTICE.md`) and stored as projected SVG paths (213 KB). Natural Earth files all of Russia under Europe; the script splits it at 60° E so Siberia is drawn as Asia. The Roman Empire around 117 AD and the Limes line are simplified hand-drawn sketches clipped to the land and labelled as such. Drawn scenes (Stone Age, Nile year, Assuan dam, society pyramid, Pnyx, conflict stairs, …) are labelled as simplified where that matters. Every lesson shows at least one figure; each Lernbereich has its own accent colour in light and both dark selectors.

## Existing ZAM cards

Inventory in zam-os/zam at `b7fdfcc4e30d21bbbd97fb2025952ff7f4e296ac`: `tests/fixtures/curriculum/` contains no `de-by-mittelschule-*` cell, and `src/kernel/library/bundled-cells.ts` bundles none for GPG. `replaces-de-by.json` is therefore empty, `status: proposal-only`, `approved: null`; the cell declares no `replaces` and no `retired_items`, and no review history moves.

Cells of other school types cover overlapping topics and stay active: `de-by:realschule-6-geschichte-urgeschichte-antike`, `de-by:gymnasium-6-geschichte-urgeschichte-aegypten-griechenland`, `de-by:gymnasium-6-geschichte-rom-imperium-limes-bayern` and `de-by:realschule-5-geographie-erde-gradnetz-orientierung`. **Question for Thomas:** should any of these move to this Mittelschule cell, or stay with their own school type? Until then nothing is mapped.

## Verification

In `gpg-mittelschule-5`: `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`, `node scripts/check-curriculum.mjs`, and `ZAM_CORE=<zam-core 0.54.0> node scripts/validate-cell.mjs` ("ok: 34 atoms / 68 cards installed and verified idempotently."). At the root: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/changed-apps.test.mjs`, `ZAM_CORE=… node scripts/validate-cells.mjs`, `node scripts/build-catalog.mjs`. The PR description records the results.
