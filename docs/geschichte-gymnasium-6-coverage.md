# Curriculum Coverage & Legacy Card Inventory · Geschichte 6 Gymnasium

- **Package**: [`geschichte-gymnasium-6/`](../geschichte-gymnasium-6/) (`zam-academy:geschichte-gymnasium-6`)
- **Official curriculum**: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/geschichte
- **Checked on**: 2026-11-18
- **Fixture SHA-256 (`tests/fixtures/curriculum.html`)**: `8783baf2fb7616069c7ded0533c1f0badc05fe05f700d4dd0a01d9ae59c1cef1`
- **Verification**: `node geschichte-gymnasium-6/scripts/check-curriculum.mjs` → `40 verbatim competence rows, 0 not found; curriculum SHA-256 matches.`
- **Package version**: `0.0` (ready for review; teacher review and optional explainer videos remain separate subsequent steps per `AGENTS.md`).

## Why Geschichte 6 instead of Geographie 6 (`kein_unterricht`)

Checking the official Bavarian G9 timetable ([BayGSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayGSO-ANL_1)) and LehrplanPLUS Bayern confirms:
- **Geographie** at the Bavarian Gymnasium (G9) is taught in grades 5, 7, 10, and 11 (`2 – – 2 – – 2 2`). There is no Geographie instruction in Grade 6, and https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/geographie redirects to the portal landing page. Accordingly, [`academy.json`](../academy.json) records `geographie` grade 6 `gymnasium` under `kein_unterricht`.
- **Geschichte** starts in Grade 6 (`– 2 2 2 2 1 1`) with 7 Lernbereiche (`ca. 54 Std.`) covered across one shared curriculum for all Ausbildungsrichtungen (`tracks` not needed on individual lessons).

## Curriculum Coverage Summary (40 Verbatim Competences → 36 Lessons)

| Lernbereich | Hours | Competences | Lessons | Labs & Visualizations |
| --- | --- | --- | --- | --- |
| LB 1 · Der Mensch und seine Geschichte | ca. 6 Std. | 5 | 5 | `timelineExplorer`, `excavationStratigraphy`, 7 SVG figures |
| LB 2 · Ägypten – eine frühe Hochkultur | ca. 6 Std. | 5 | 5 | Natural-Earth Nile map + Kriterienkatalog, `nileCycle`, `pyramidCutaway`, 7 SVG figures |
| LB 3 · Die griechische Antike | ca. 10 Std. | 8 | 6 | Natural-Earth Greece map, `colonizationMap`, `persianWars`, `athensDemocracy`, 8 SVG figures |
| LB 4 · Menschen machen Geschichte (Längsschnitt) | ca. 6 Std. | 5 | 4 | Rulers' portrait Kriterienkatalog, `alexanderCampaign`, `powerComparison`, 5 SVG figures |
| LB 5 · Das Imperium Romanum | ca. 12 Std. | 8 | 7 | `romanRepublic`, `romanExpansionMap`, `romanBavariaLimes`, Natural-Earth Judea/Diaspora map, 7 SVG figures |
| LB 6 · Von der Antike zum Mittelalter | ca. 8 Std. | 5 | 5 | `mediterraneanTransformation`, Natural-Earth AD 800 Frankish map, `imperialContinuity`, 6 SVG figures |
| LB 7 · Leben in der Familie (Längsschnitt) | ca. 6 Std. | 4 | 4 | `familyLongitudinal`, 4 SVG figures |
| **Total** | **ca. 54 Std.** | **40** | **36** | **15 interactive labs, 47 SVG figures (+ Hero & Timeline), 4 Kriterienkataloge** |

### Rows marked `"supported"` (3 of 40)

In accordance with `AGENTS.md` §1, activities that cannot occur strictly inside an offline browser app are marked `"supported"` in [`coverage.json`](../geschichte-gymnasium-6/coverage.json) with their classroom component documented in `in_class`:
1. **LB 1.2** (`gg6-quellen-und-darstellung`): Comparing elements of a history textbook (*Quellen* vs. *Darstellungstext*) — the app demonstrates a model double page (`geschichtsbuchAufbau`) and trains six source-vs-account examples, while working with the learner's own printed school textbook stays in class.
2. **LB 5.5** (`gg6-provinzen-bayern-limes`): Investigating Roman life in Bavaria via films or real museum/site excursions — the app provides interactive Bavarian site/Limes maps (`romanBavariaLimes`) and archaeological evidence (Castra Regina, Augsburg, Weißenburg, Passau, Via Claudia Augusta), while museum visits and films remain classroom/excursion work.
3. **LB 7.2** (`gg6-familie-laengsschnitt` / family tasks): Optional personal family/living-environment project work (`"Fakultative Erweiterung"`) is scaffolded as a structured self-check task while personal interviews and family albums remain outside the app.

## Legacy ZAM Card Mapping (`approved`: 2026-11-19)

`zam-os/zam` (commit `e517a1ef709e0e6ee5f968c342affeb5b14cef35`) holds two Grade 6 history cells with 16 legacy items (`tests/fixtures/` holds byte-exact LF snapshots):
- `de-by:gymnasium-6-geschichte-urgeschichte-aegypten-griechenland` (version `2026.08.1`, SHA-256 `5fe08fa9da2ce5dbb2626d34d98f7c83619ec4edee5b5d2a9b7897b539821cb5`, 8 items)
- `de-by:gymnasium-6-geschichte-rom-imperium-limes-bayern` (version `2026.08.1`, SHA-256 `755dfa41a6069f30246e005b8a8187c5c2dad9cfa3b40911709ab528ea990f40`, 8 items)

[`replaces-de-by.json`](../geschichte-gymnasium-6/replaces-de-by.json) records Thomas's explicit confirmation on **2026-11-19** (following his initial go-ahead on **2026-11-18**; `"status": "approved"`, `"approved": "2026-11-19"`), verified in disposable `zam-core` libraries by [`scripts/validate-migration.mjs`](../geschichte-gymnasium-6/scripts/validate-migration.mjs):
- **Category A (`8` items)**: Single tier-1 successor (`gg6-*-check`) declares `replaces`, preserving learner FSRS history on identical atomic retrieval.
- **Category B (`0` items)**
- **Category C (`8` items, `keep-active`)**: Multi-part comparison or synthesis prompts split across multiple lessons or exceeding the shared core scope; stay active without history transfer.

| Legacy Cell (`de-by:gymnasium-6-geschichte-*`) | Legacy ID (`de_by_id`) | Cat. | Action | Successor Slug | Reason |
| --- | --- | --- | --- | --- | --- |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J01` | A | `replace` | `gg6-jungsteinzeit-wandel-check` | Same atomic retrieval: what the Neolithic Revolution means (transition to sedentary life, farming and livestock). The successor quick check asks this exact question. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J02` | C | `keep-active` | — | Multi-part comparison across Paleolithic and Neolithic economy, housing, tools, art and social consequences; split across `gg6-altsteinzeit` and `gg6-jungsteinzeit-wandel`. One history must not be spread over several cards. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J03` | A | `replace` | `gg6-niljahr-bewaesserung-check` | Same atomic retrieval: why Herodotus called Egypt a gift of the Nile (annual flood depositing fertile silt). The successor quick check asks this exact question. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J04` | C | `keep-active` | — | Five-part synthesis prompt covering Nile irrigation, divine kingship, society pyramid, hieroglyphs/astronomy and mummification/Gizeh; spread across all five LB 2 lessons. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J05` | A | `replace` | `gg6-griechenland-polis-check` | Same atomic retrieval: the Greek term for independent city-states with acropolis, agora and surrounding land (Polis). The successor quick check asks this exact question. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J06` | C | `keep-active` | — | Multi-part comparison of pan-Hellenic ties (Olympia, Delphi, Homer) with Sparta (military oligarchy, agoge, helots) and Athens; goes into Sparta details beyond the shared path and spreads over LB 3. |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J07` | A | `replace` | `gg6-weg-zur-demokratie-solon-check` | Same atomic retrieval: the Athenian procedure of writing a politician's name on a pottery shard to banish him for ten years (Scherbengericht / Ostrakismos). |
| `urgeschichte-aegypten-griechenland` | `01K4YH6A000000000000000J08` | C | `keep-active` | — | Four-step constitutional history plus four institutions and exclusions of Athenian democracy; split across `gg6-weg-zur-demokratie-solon`, `gg6-perserkriege-demokratie` and `gg6-attische-demokratie-perikles`. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J01` | A | `replace` | `gg6-roemische-republik-check` | Same atomic retrieval: the Latin veto right used by Roman tribunes of the plebs to stop Senate or magistrate decisions. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J02` | C | `keep-active` | — | Three-part synthesis covering Conflict of the Orders, constitutional principles, Cursus honorum and Senate; split across `gg6-roemische-republik`, its workshop and tasks. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J03` | A | `replace` | `gg6-caesar-augustus-prinzipat-check` | Same atomic retrieval: the title Augustus conferred on Octavian in 27 BC marking the start of the Roman Principate. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J04` | C | `keep-active` | — | Four-part synthesis covering agrarian/military crisis, Caesar, Augustan Principate and Pax Romana; spread across `gg6-expansion-weltreich` and `gg6-caesar-augustus-prinzipat`. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J05` | A | `replace` | `gg6-provinzen-bayern-limes-check` | Same atomic retrieval: the Roman legionary camp founded in 179 AD at the Danube/Regen confluence that became Regensburg (Castra Regina). |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J06` | C | `keep-active` | — | Four-part synthesis on Alpine campaign, Raetia/Noricum, Limes, Castra Regina and Romanisation; split across `gg6-provinzen-bayern-limes` figures, lab and cards. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J07` | A | `replace` | `gg6-voelkerwanderung-zerfall-check` | Same atomic retrieval: the year 476 AD when Odoacer deposed the last Western Roman emperor Romulus Augustulus. |
| `rom-imperium-limes-bayern` | `01K4YH6R000000000000000J08` | C | `keep-active` | — | Four-part synthesis mixing Late Antiquity (313/380), 395 division, Migrations, 476 fall of West Rome and Roman legacy; spread across LB 5 (`gg6-christen-staatsreligion`) and LB 6. |

### Neighbouring-grade note & legacy cell retirement

The Grade 7 legacy cell `de-by:gymnasium-7-geschichte-mittelalter-frankenreich-staedte-kreuzzuege-reformation` includes item `01K4H7M0000000000000000J01` asking about Charlemagne's imperial coronation on Christmas Day 800, which under current G9 LehrplanPLUS Bayern is taught in **Grade 6 LB 6** (covered here in `gg6-karl-der-grosse-kaisertum`), while item `01K4H7M0000000000000000J02` mixes Charlemagne with Grade 7 topics (*Lehnswesen* and *Investiturstreit*). Per Thomas's explicit decision on **2026-11-19**, the Grade 7 cell stays untouched (`01K4H7M0000000000000000J01` is not pulled into this mapping), and both legacy Grade 6 cells (`de-by:gymnasium-6-geschichte-urgeschichte-aegypten-griechenland` and `de-by:gymnasium-6-geschichte-rom-imperium-limes-bayern`) are to be retired from `zam-os/zam`'s `src/kernel/library/bundled-cells.ts` to `tests/fixtures/legacy/` in the follow-up `academy:sync` PR so new learners only receive `zam-academy:geschichte-gymnasium-6`.

## Verified Sources (104 URLs, checked 2026-11-18/19)

Every external source URL in [`src/curriculum/outline.json`](../geschichte-gymnasium-6/src/curriculum/outline.json) was fetched live (`curl -sL -A "Mozilla/5.0"`) and verified against HTTP 200 and its `<title>`:

| # | ID | Label | URL | Status | Verified HTML Title |
| --- | --- | --- | --- | --- | --- |
| 1 | `lehrplan` | LehrplanPLUS Bayern · Geschichte 6 Gymnasium | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/geschichte | HTTP 200 | LehrplanPLUS - Gymnasium - 6 - Geschichte - Fachlehrpläne |
| 2 | `klexikon-geschichte` | Klexikon · Geschichte | https://klexikon.zum.de/wiki/Geschichte | HTTP 200 | Geschichte – Klexikon – das Kinderlexikon |
| 3 | `wiki-geschichte` | Wikipedia · Geschichte | https://de.wikipedia.org/wiki/Geschichte | HTTP 200 | Geschichte – Wikipedia |
| 4 | `wiki-zeitrechnung` | Wikipedia · Christliche Zeitrechnung | https://de.wikipedia.org/wiki/Christliche_Zeitrechnung | HTTP 200 | Christliche Zeitrechnung – Wikipedia |
| 5 | `wiki-quelle` | Wikipedia · Quelle (Geschichtswissenschaft) | https://de.wikipedia.org/wiki/Quelle_(Geschichtswissenschaft) | HTTP 200 | Quelle (Geschichtswissenschaft) – Wikipedia |
| 6 | `klexikon-quelle` | Klexikon · Quelle | https://klexikon.zum.de/wiki/Quelle | HTTP 200 | Quelle – Klexikon – das Kinderlexikon |
| 7 | `wiki-ueberlieferung` | Wikipedia · Tradition (Geschichtswissenschaft) | https://de.wikipedia.org/wiki/Tradition_(Geschichtswissenschaft) | HTTP 200 | Tradition (Geschichtswissenschaft) – Wikipedia |
| 8 | `wiki-archaeologie` | Wikipedia · Archäologie | https://de.wikipedia.org/wiki/Arch%C3%A4ologie | HTTP 200 | Archäologie – Wikipedia |
| 9 | `klexikon-archaeologie` | Klexikon · Archäologie | https://klexikon.zum.de/wiki/Arch%C3%A4ologie | HTTP 200 | Archäologie – Klexikon – das Kinderlexikon |
| 10 | `wiki-stratigraphie` | Wikipedia · Stratigraphie (Archäologie) | https://de.wikipedia.org/wiki/Stratigraphie_(Arch%C3%A4ologie) | HTTP 200 | Stratigraphie (Archäologie) – Wikipedia |
| 11 | `wiki-altsteinzeit` | Wikipedia · Altsteinzeit | https://de.wikipedia.org/wiki/Altsteinzeit | HTTP 200 | Altsteinzeit – Wikipedia |
| 12 | `klexikon-steinzeit` | Klexikon · Steinzeit | https://klexikon.zum.de/wiki/Steinzeit | HTTP 200 | Steinzeit – Klexikon – das Kinderlexikon |
| 13 | `wiki-feuer` | Wikipedia · Feuer | https://de.wikipedia.org/wiki/Feuer | HTTP 200 | Feuer – Wikipedia |
| 14 | `wiki-faustkeil` | Wikipedia · Faustkeil | https://de.wikipedia.org/wiki/Faustkeil | HTTP 200 | Faustkeil – Wikipedia |
| 15 | `wiki-jungsteinzeit` | Wikipedia · Jungsteinzeit | https://de.wikipedia.org/wiki/Jungsteinzeit | HTTP 200 | Jungsteinzeit – Wikipedia |
| 16 | `wiki-neolithische-rev` | Wikipedia · Neolithische Revolution | https://de.wikipedia.org/wiki/Neolithische_Revolution | HTTP 200 | Neolithische Revolution – Wikipedia |
| 17 | `wiki-hochkultur` | Wikipedia · Hochkultur (Geschichtswissenschaft) | https://de.wikipedia.org/wiki/Hochkultur_(Geschichtswissenschaft) | HTTP 200 | Hochkultur (Geschichtswissenschaft) – Wikipedia |
| 18 | `klexikon-aegypten` | Klexikon · Altes Ägypten | https://klexikon.zum.de/wiki/Altes_%C3%84gypten | HTTP 200 | Altes Ägypten – Klexikon – das Kinderlexikon |
| 19 | `wiki-altes-aegypten` | Wikipedia · Altes Ägypten | https://de.wikipedia.org/wiki/Altes_%C3%84gypten | HTTP 200 | Altes Ägypten – Wikipedia |
| 20 | `wiki-nil` | Wikipedia · Nil | https://de.wikipedia.org/wiki/Nil | HTTP 200 | Nil – Wikipedia |
| 21 | `klexikon-nil` | Klexikon · Nil | https://klexikon.zum.de/wiki/Nil | HTTP 200 | Nil – Klexikon – das Kinderlexikon |
| 22 | `wiki-hieroglyphen` | Wikipedia · Ägyptische Hieroglyphen | https://de.wikipedia.org/wiki/%C3%84gyptische_Hieroglyphen | HTTP 200 | Ägyptische Hieroglyphen – Wikipedia |
| 23 | `klexikon-hieroglyphen` | Klexikon · Hieroglyphen | https://klexikon.zum.de/wiki/Hieroglyphen | HTTP 200 | Hieroglyphen – Klexikon – das Kinderlexikon |
| 24 | `wiki-gizeh` | Wikipedia · Pyramiden von Gizeh | https://de.wikipedia.org/wiki/Pyramiden_von_Gizeh | HTTP 200 | Pyramiden von Gizeh – Wikipedia |
| 25 | `klexikon-pyramide` | Klexikon · Pyramide | https://klexikon.zum.de/wiki/Pyramide | HTTP 200 | Pyramide – Klexikon – das Kinderlexikon |
| 26 | `wiki-totengericht` | Wikipedia · Totengericht | https://de.wikipedia.org/wiki/Totengericht | HTTP 200 | Totengericht – Wikipedia |
| 27 | `wiki-pharao` | Wikipedia · Pharao | https://de.wikipedia.org/wiki/Pharao | HTTP 200 | Pharao – Wikipedia |
| 28 | `klexikon-pharao` | Klexikon · Pharao | https://klexikon.zum.de/wiki/Pharao | HTTP 200 | Pharao – Klexikon – das Kinderlexikon |
| 29 | `wiki-monarchie` | Wikipedia · Monarchie | https://de.wikipedia.org/wiki/Monarchie | HTTP 200 | Monarchie – Wikipedia |
| 30 | `bpb-monarchie` | bpb · Monarchie | https://www.bpb.de/kurz-knapp/lexika/politiklexikon/17865/monarchie/ | HTTP 200 | Monarchie \| bpb.de |
| 31 | `wiki-griechenland-antike` | Wikipedia · Antikes Griechenland | https://de.wikipedia.org/wiki/Antikes_Griechenland | HTTP 200 | Antikes Griechenland – Wikipedia |
| 32 | `klexikon-griechenland` | Klexikon · Altes Griechenland | https://klexikon.zum.de/wiki/Altes_Griechenland | HTTP 200 | Altes Griechenland – Klexikon – das Kinderlexikon |
| 33 | `wiki-polis` | Wikipedia · Polis | https://de.wikipedia.org/wiki/Polis | HTTP 200 | Polis – Wikipedia |
| 34 | `wiki-kolonisation` | Wikipedia · Griechische Kolonisation | https://de.wikipedia.org/wiki/Griechische_Kolonisation | HTTP 200 | Griechische Kolonisation – Wikipedia |
| 35 | `wiki-migration` | Wikipedia · Migration | https://de.wikipedia.org/wiki/Migration | HTTP 200 | Migration – Wikipedia |
| 36 | `klexikon-migration` | Klexikon · Migration | https://klexikon.zum.de/wiki/Migration | HTTP 200 | Migration – Klexikon – das Kinderlexikon |
| 37 | `wiki-olympia` | Wikipedia · Olympische Spiele der Antike | https://de.wikipedia.org/wiki/Olympische_Spiele_der_Antike | HTTP 200 | Olympische Spiele der Antike – Wikipedia |
| 38 | `klexikon-olympia` | Klexikon · Olympische Spiele | https://klexikon.zum.de/wiki/Olympische_Spiele | HTTP 200 | Olympische Spiele – Klexikon – das Kinderlexikon |
| 39 | `wiki-theater-antike` | Wikipedia · Theater der griechischen Antike | https://de.wikipedia.org/wiki/Theater_der_griechischen_Antike | HTTP 200 | Theater der griechischen Antike – Wikipedia |
| 40 | `wiki-solon` | Wikipedia · Solon | https://de.wikipedia.org/wiki/Solon | HTTP 200 | Solon – Wikipedia |
| 41 | `wiki-kleisthenes` | Wikipedia · Kleisthenes von Athen | https://de.wikipedia.org/wiki/Kleisthenes_von_Athen | HTTP 200 | Kleisthenes von Athen – Wikipedia |
| 42 | `wiki-scherbengericht` | Wikipedia · Scherbengericht | https://de.wikipedia.org/wiki/Scherbengericht | HTTP 200 | Scherbengericht – Wikipedia |
| 43 | `wiki-ostrakon` | Wikipedia · Ostrakon | https://de.wikipedia.org/wiki/Ostrakon | HTTP 200 | Ostrakon – Wikipedia |
| 44 | `wiki-perserkriege` | Wikipedia · Perserkriege | https://de.wikipedia.org/wiki/Perserkriege | HTTP 200 | Perserkriege – Wikipedia |
| 45 | `wiki-triere` | Wikipedia · Triere | https://de.wikipedia.org/wiki/Triere | HTTP 200 | Triere – Wikipedia |
| 46 | `wiki-attische-demokratie` | Wikipedia · Attische Demokratie | https://de.wikipedia.org/wiki/Attische_Demokratie | HTTP 200 | Attische Demokratie – Wikipedia |
| 47 | `wiki-perikles` | Wikipedia · Perikles | https://de.wikipedia.org/wiki/Perikles | HTTP 200 | Perikles – Wikipedia |
| 48 | `klexikon-demokratie` | Klexikon · Demokratie | https://klexikon.zum.de/wiki/Demokratie | HTTP 200 | Demokratie – Klexikon – das Kinderlexikon |
| 49 | `bpb-demokratie` | bpb · Demokratie | https://www.bpb.de/kurz-knapp/lexika/politiklexikon/17321/demokratie/ | HTTP 200 | Demokratie \| bpb.de |
| 50 | `wiki-hatschepsut` | Wikipedia · Hatschepsut | https://de.wikipedia.org/wiki/Hatschepsut | HTTP 200 | Hatschepsut – Wikipedia |
| 51 | `wiki-themistokles` | Wikipedia · Themistokles | https://de.wikipedia.org/wiki/Themistokles | HTTP 200 | Themistokles – Wikipedia |
| 52 | `wiki-alexander` | Wikipedia · Alexander der Große | https://de.wikipedia.org/wiki/Alexander_der_Gro%C3%9Fe | HTTP 200 | Alexander der Große – Wikipedia |
| 53 | `klexikon-alexander` | Klexikon · Alexander der Große | https://klexikon.zum.de/wiki/Alexander_der_Gro%C3%9Fe | HTTP 200 | Alexander der Große – Klexikon – das Kinderlexikon |
| 54 | `wiki-hellenismus` | Wikipedia · Hellenismus | https://de.wikipedia.org/wiki/Hellenismus | HTTP 200 | Hellenismus – Wikipedia |
| 55 | `wiki-rom` | Wikipedia · Rom | https://de.wikipedia.org/wiki/Gr%C3%BCndung_Roms | HTTP 200 | Rom – Wikipedia |
| 56 | `wiki-romulus-remus` | Wikipedia · Romulus und Remus | https://de.wikipedia.org/wiki/Romulus_und_Remus | HTTP 200 | Romulus und Remus – Wikipedia |
| 57 | `wiki-roemische-republik` | Wikipedia · Römische Republik | https://de.wikipedia.org/wiki/R%C3%B6mische_Republik | HTTP 200 | Römische Republik – Wikipedia |
| 58 | `wiki-senat` | Wikipedia · Römischer Senat | https://de.wikipedia.org/wiki/R%C3%B6mischer_Senat | HTTP 200 | Römischer Senat – Wikipedia |
| 59 | `wiki-cursus-honorum` | Wikipedia · Cursus honorum | https://de.wikipedia.org/wiki/Cursus_honorum | HTTP 200 | Cursus honorum – Wikipedia |
| 60 | `wiki-volkstribun` | Wikipedia · Volkstribun | https://de.wikipedia.org/wiki/Volkstribun | HTTP 200 | Volkstribun – Wikipedia |
| 61 | `wiki-roemisches-reich` | Wikipedia · Römisches Reich | https://de.wikipedia.org/wiki/R%C3%B6misches_Reich | HTTP 200 | Römisches Reich – Wikipedia |
| 62 | `klexikon-roemer` | Klexikon · Altes Rom | https://klexikon.zum.de/wiki/Altes_Rom | HTTP 200 | Römisches Reich – Klexikon – das Kinderlexikon |
| 63 | `wiki-punische-kriege` | Wikipedia · Punische Kriege | https://de.wikipedia.org/wiki/Punische_Kriege | HTTP 200 | Punische Kriege – Wikipedia |
| 64 | `wiki-caesar` | Wikipedia · Gaius Iulius Caesar | https://de.wikipedia.org/wiki/Gaius_Iulius_Caesar | HTTP 200 | Gaius Iulius Caesar – Wikipedia |
| 65 | `wiki-augustus` | Wikipedia · Augustus | https://de.wikipedia.org/wiki/Augustus | HTTP 200 | Augustus – Wikipedia |
| 66 | `wiki-prinzipat` | Wikipedia · Prinzipat | https://de.wikipedia.org/wiki/Prinzipat | HTTP 200 | Prinzipat – Wikipedia |
| 67 | `wiki-raetia` | Wikipedia · Raetia | https://de.wikipedia.org/wiki/Raetia | HTTP 200 | Raetia – Wikipedia |
| 68 | `wiki-noricum` | Wikipedia · Noricum | https://de.wikipedia.org/wiki/Noricum | HTTP 200 | Noricum – Wikipedia |
| 69 | `wiki-limes` | Wikipedia · Obergermanisch-Raetischer Limes | https://de.wikipedia.org/wiki/Obergermanisch-Raetischer_Limes | HTTP 200 | Obergermanisch-Raetischer Limes – Wikipedia |
| 70 | `wiki-romanisierung` | Wikipedia · Romanisierung | https://de.wikipedia.org/wiki/Romanisierung | HTTP 200 | Romanisierung – Wikipedia |
| 71 | `wiki-castra-regina` | Wikipedia · Castra Regina | https://de.wikipedia.org/wiki/Castra_Regina | HTTP 200 | Castra Regina – Wikipedia |
| 72 | `wiki-augusta-vindelicum` | Wikipedia · Augusta Vindelicum | https://de.wikipedia.org/wiki/Augusta_Vindelicum | HTTP 200 | Augusta Vindelicum – Wikipedia |
| 73 | `wiki-via-claudia` | Wikipedia · Via Claudia Augusta | https://de.wikipedia.org/wiki/Via_Claudia_Augusta | HTTP 200 | Via Claudia Augusta – Wikipedia |
| 74 | `archaeologie-bayern` | Archäologische Staatssammlung München | https://www.archaeologie.bayern/ | HTTP 200 | Archäologische Staatssammlung |
| 75 | `wiki-diaspora` | Wikipedia · Jüdische Diaspora | https://de.wikipedia.org/wiki/J%C3%BCdische_Diaspora | HTTP 200 | Jüdische Diaspora – Wikipedia |
| 76 | `wiki-juedischer-krieg` | Wikipedia · Jüdischer Krieg | https://de.wikipedia.org/wiki/J%C3%BCdischer_Krieg | HTTP 200 | Jüdischer Krieg – Wikipedia |
| 77 | `klexikon-judentum` | Klexikon · Judentum | https://klexikon.zum.de/wiki/Judentum | HTTP 200 | Judentum – Klexikon – das Kinderlexikon |
| 78 | `wiki-judentum` | Wikipedia · Judentum | https://de.wikipedia.org/wiki/Judentum | HTTP 200 | Judentum – Wikipedia |
| 79 | `wiki-christentum-rom` | Wikipedia · Urchristentum | https://de.wikipedia.org/wiki/Urchristentum | HTTP 200 | Urchristentum – Wikipedia |
| 80 | `wiki-konstantin` | Wikipedia · Konstantin der Große | https://de.wikipedia.org/wiki/Konstantin_der_Gro%C3%9Fe | HTTP 200 | Konstantin der Große – Wikipedia |
| 81 | `wiki-mailand` | Wikipedia · Mailänder Vereinbarung | https://de.wikipedia.org/wiki/Mail%C3%A4nder_Vereinbarung | HTTP 200 | Mailänder Vereinbarung – Wikipedia |
| 82 | `klexikon-christentum` | Klexikon · Christentum | https://klexikon.zum.de/wiki/Christentum | HTTP 200 | Christentum – Klexikon – das Kinderlexikon |
| 83 | `wiki-christentum` | Wikipedia · Christentum | https://de.wikipedia.org/wiki/Christentum | HTTP 200 | Christentum – Wikipedia |
| 84 | `wiki-voelkerwanderung` | Wikipedia · Völkerwanderung | https://de.wikipedia.org/wiki/V%C3%B6lkerwanderung | HTTP 200 | Völkerwanderung – Wikipedia |
| 85 | `wiki-spaetantike` | Wikipedia · Spätantike | https://de.wikipedia.org/wiki/Sp%C3%A4tantike | HTTP 200 | Spätantike – Wikipedia |
| 86 | `wiki-byzanz` | Wikipedia · Byzantinisches Reich | https://de.wikipedia.org/wiki/Byzantinisches_Reich | HTTP 200 | Byzantinisches Reich – Wikipedia |
| 87 | `wiki-islam` | Wikipedia · Islam | https://de.wikipedia.org/wiki/Islam | HTTP 200 | Islam – Wikipedia |
| 88 | `klexikon-islam` | Klexikon · Islam | https://klexikon.zum.de/wiki/Islam | HTTP 200 | Islam – Klexikon – das Kinderlexikon |
| 89 | `wiki-frankenreich` | Wikipedia · Frankenreich | https://de.wikipedia.org/wiki/Frankenreich | HTTP 200 | Fränkisches Reich – Wikipedia |
| 90 | `wiki-karl-der-grosse` | Wikipedia · Karl der Große | https://de.wikipedia.org/wiki/Karl_der_Gro%C3%9Fe | HTTP 200 | Karl der Große – Wikipedia |
| 91 | `klexikon-karl` | Klexikon · Karl der Große | https://klexikon.zum.de/wiki/Karl_der_Gro%C3%9Fe | HTTP 200 | Karl der Große – Klexikon – das Kinderlexikon |
| 92 | `wiki-karolinger` | Wikipedia · Karolinger | https://de.wikipedia.org/wiki/Karolinger | HTTP 200 | Karolinger – Wikipedia |
| 93 | `wiki-kaiser` | Wikipedia · Kaiser | https://de.wikipedia.org/wiki/Kaiser | HTTP 200 | Kaiser – Wikipedia |
| 94 | `wiki-mittelalter` | Wikipedia · Mittelalter | https://de.wikipedia.org/wiki/Mittelalter | HTTP 200 | Mittelalter – Wikipedia |
| 95 | `klexikon-mittelalter` | Klexikon · Mittelalter | https://klexikon.zum.de/wiki/Mittelalter | HTTP 200 | Mittelalter – Klexikon – das Kinderlexikon |
| 96 | `wiki-zeitalter` | Wikipedia · Zeitalter | https://de.wikipedia.org/wiki/Epoche_(Geschichte) | HTTP 200 | Zeitalter – Wikipedia |
| 97 | `wiki-oikos` | Wikipedia · Oikos | https://de.wikipedia.org/wiki/Oikos | HTTP 200 | Oikos – Wikipedia |
| 98 | `wiki-familia` | Wikipedia · Familia | https://de.wikipedia.org/wiki/Familia | HTTP 200 | Familia – Wikipedia |
| 99 | `wiki-pater-familias` | Wikipedia · Pater familias | https://de.wikipedia.org/wiki/Pater_familias | HTTP 200 | Pater familias – Wikipedia |
| 100 | `wiki-familie` | Wikipedia · Familie | https://de.wikipedia.org/wiki/Familie | HTTP 200 | Familie – Wikipedia |
| 101 | `klexikon-verwandtschaft` | Klexikon · Verwandtschaft | https://klexikon.zum.de/wiki/Familie | HTTP 200 | Verwandtschaft – Klexikon – das Kinderlexikon |
| 102 | `wiki-geschlechterrolle` | Wikipedia · Geschlechterrolle | https://de.wikipedia.org/wiki/Geschlechterrolle | HTTP 200 | Geschlechterrolle – Wikipedia |
| 103 | `wiki-panathenaeische-amphore` | Wikipedia · Panathenäische Preisamphoren | https://de.wikipedia.org/wiki/Panathen%C3%A4ische_Preisamphore | HTTP 200 | Panathenäische Preisamphoren – Wikipedia |
| 104 | `wiki-totentempel-hatschepsut` | Wikipedia · Totentempel der Hatschepsut | https://de.wikipedia.org/wiki/Totentempel_der_Hatschepsut | HTTP 200 | Totentempel der Hatschepsut – Wikipedia |
