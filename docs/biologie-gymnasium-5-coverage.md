# Biologie 5 Gymnasium: curriculum check, scope and card mapping

## Curriculum source

- At the Bavarian Gymnasium, Biology in Grade 5 is taught inside **Natur und Technik**. LehrplanPLUS has no page `gymnasium/5/biologie` (it redirects to the home page); the Fachlehrplan is `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym` (page title "LehrplanPLUS - Gymnasium - 5 - Natur und Technik (Gym) - Fachlehrpläne").
- Fetched live on 2026-11-14 with `curl -sL --compressed -A "Mozilla/5.0"`, HTTP 200. Stored as `biologie-gymnasium-5/tests/fixtures/curriculum.html`, SHA-256 `c22960dc12b56f17929c58fdc7a1519583ae6869cb1d3ffe442067522bb58d58`.
- NT5 has two Lernbereiche of ca. 42 hours each: **1 Schwerpunkt Naturwissenschaftliches Arbeiten** (1.1 Arbeitsmethoden, 1.2 Themenbereiche und Konzepte: light, air, water, soil, matter, particle model, energy) and **2 Schwerpunkt Biologie** (2.1–2.5). This package covers Lernbereich 2 only. Lernbereich 1 is propaedeutic chemistry, physics and geography, not biology; it would be a separate package.
- One Fachlehrplan for all Ausbildungsrichtungen; no lesson carries a track.

## Competences and coverage

`coverage.json` lists all 47 Kompetenzerwartungen of Lernbereich 2, extracted from the stored HTML (the `<li>` items after each "Kompetenzerwartungen" heading, `<dialog>` info boxes removed, whitespace normalised). Check:

```
$ node scripts/check-curriculum.mjs
47 verbatim competence rows, 0 not found; curriculum SHA-256 matches.
```

| Teilbereich | Hours | Competences | Station(s) | Lessons |
| --- | ---: | ---: | --- | ---: |
| 2.1 Erkenntnisse gewinnen – kommunizieren – bewerten | integrated | 15 | 1 (and applied in all stations) | 10 |
| 2.2 Biologie - die Wissenschaft von den Lebewesen | ca. 5 | 3 | 2 | 3 |
| 2.3 Der Mensch als Lebewesen (4 sections) | ca. 26 | 21 | 3, 4, 5, 6 | 23 |
| 2.4 Samenpflanzen als Lebewesen | ca. 6 | 5 | 7 | 5 |
| 2.5 Ökosystem Grünland | ca. 5 | 3 | 8 | 3 |

30 rows are `implemented`, 17 `supported`: real microscoping and slide preparation, dissecting flowers, collecting and identifying plants outdoors, field measurements, building physical models, hand-drawn sketches, demonstrating joints on one's own body, researching food labels, changing one's own habits, and abuse prevention led by trained staff. Each supported row names in `in_class` what stays in class.

Two curriculum details shaped the content:

- One competence on the official page contains the editing marker `[/decision]` ("stellen einfache Präparate ohne Schnitte her [/decision]und färben diese ggf. an …"). It is copied verbatim so the verbatim check stays exact.
- "vereinfachter weiblicher Zyklus (keine hormonelle Regulation)": the cycle lesson and model name no hormones; a test checks that Östrogen, Progesteron, Testosteron, Plazenta, Photosynthese, Xylem and Phloem appear nowhere in learner text.

## Neighbouring grades

- **Built on**: HSU 3/4 (hypotheses and simple experiments, parts of a flowering plant) is marked as "Wiederholung aus HSU 3/4" where revisited. The grassland management lesson refers to Geographie 5 (Ländliche Räume), as the Fachlehrplan cross-references.
- **Left out, belongs to NT6 (Gymnasium)**: seeds and fruits, dispersal, germination factors, tasks of root, shoot and leaf, photosynthesis (NT6 1.2), vertebrates (NT6 1.3/1.4), file systems (NT6 2.3).
- **Left out, belongs to Biologie 8 (Gymnasium)**: hormonal regulation of the cycle, pregnancy and prenatal development, addiction in depth.
- **Other packages**: `biologie-realschule-5` and `nt-mittelschule-5` teach similar topics for their school types; this package does not change them.

## Sources

Every link a lesson shows was fetched on 2026-11-14 with `curl -sL -A "Mozilla/5.0" <url>` and its real `<title>` read; pages that answered 404 (e.g. Klexikon "Rauchen", "Bestäubung", "Stärke", "Diagramm") were dropped. Labels use the real page title, including redirects (Klexikon "Lebewesen" → "Leben", "Raps" → "Kohl", "Hasel" → "Haselnuss"). The Nummer gegen Kummer number 116 111 was read on its site. Numbers taken from sources: hearing damage from about 85 dB and the 20–30/60/100 dB examples (Klexikon · Lärm), adults have "etwas über 200 Knochen" (Klexikon · Skelett), 60 minutes of daily activity on average (WHO fact sheet).

| Label | URL |
| --- | --- |
| LehrplanPLUS Bayern · Natur und Technik 5 Gymnasium | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym |
| Klexikon · Naturwissenschaft | https://klexikon.zum.de/wiki/Naturwissenschaft |
| Klexikon · Experiment | https://klexikon.zum.de/wiki/Experiment |
| Klexikon · Modell | https://klexikon.zum.de/wiki/Modell |
| Klexikon · Mikroskop | https://klexikon.zum.de/wiki/Mikroskop |
| Wikipedia · Lichtmikroskop | https://de.wikipedia.org/wiki/Lichtmikroskop |
| Klexikon · Lupe | https://klexikon.zum.de/wiki/Lupe |
| Klexikon · Thermometer | https://klexikon.zum.de/wiki/Thermometer |
| Klexikon · Waage | https://klexikon.zum.de/wiki/Waage |
| Wikipedia · Iodprobe | https://de.wikipedia.org/wiki/Iod-St%C3%A4rke-Reaktion |
| Wikipedia · Kalkwasser | https://de.wikipedia.org/wiki/Kalkwasser |
| Klexikon · Fett | https://klexikon.zum.de/wiki/Fett |
| Wikipedia · Francesco Redi | https://de.wikipedia.org/wiki/Francesco_Redi |
| Wikipedia · Spontanzeugung | https://de.wikipedia.org/wiki/Spontanzeugung |
| Wikipedia · William Harvey | https://de.wikipedia.org/wiki/William_Harvey |
| Wikipedia · Robert Hooke | https://de.wikipedia.org/wiki/Robert_Hooke |
| Klexikon · Biologie | https://klexikon.zum.de/wiki/Biologie |
| Klexikon · Leben | https://klexikon.zum.de/wiki/Lebewesen |
| Klexikon · Zelle | https://klexikon.zum.de/wiki/Zelle |
| Wikipedia · Zelle (Biologie) | https://de.wikipedia.org/wiki/Zelle_(Biologie) |
| Wikipedia · Gewebe (Biologie) | https://de.wikipedia.org/wiki/Gewebe_(Biologie) |
| Klexikon · Organ | https://klexikon.zum.de/wiki/Sinnesorgan |
| Wikipedia · Sinnesorgan | https://de.wikipedia.org/wiki/Sinnesorgan |
| Klexikon · Auge | https://klexikon.zum.de/wiki/Auge |
| Klexikon · Ohr | https://klexikon.zum.de/wiki/Ohr |
| Klexikon · Haut | https://klexikon.zum.de/wiki/Haut |
| Klexikon · Nerv | https://klexikon.zum.de/wiki/Nerv |
| Klexikon · Gehirn | https://klexikon.zum.de/wiki/Gehirn |
| Wikipedia · Reiz-Reaktions-Modell | https://de.wikipedia.org/wiki/Reiz-Reaktions-Schema |
| Wikipedia · Reaktionszeit | https://de.wikipedia.org/wiki/Reaktionszeit |
| Klexikon · Alkohol | https://klexikon.zum.de/wiki/Alkohol |
| Klexikon · Lärm | https://klexikon.zum.de/wiki/L%C3%A4rm |
| Gesundheitsinformation.de · Wie funktioniert das Ohr? | https://www.gesundheitsinformation.de/wie-funktioniert-das-ohr.html |
| Gesundheitsinformation.de · Wie funktioniert das Auge? | https://www.gesundheitsinformation.de/wie-funktioniert-das-auge.html |
| Bundesamt für Strahlenschutz · Schutz vor UV-Strahlung | https://www.bfs.de/DE/themen/opt/uv/schutz/schutz_node.html |
| Klexikon · Sonnenbrand | https://klexikon.zum.de/wiki/Sonnenbrand |
| Klexikon · Skelett | https://klexikon.zum.de/wiki/Skelett |
| Klexikon · Knochen | https://klexikon.zum.de/wiki/Knochen |
| Klexikon · Wirbelsäule | https://klexikon.zum.de/wiki/Wirbels%C3%A4ule |
| Klexikon · Gelenk | https://klexikon.zum.de/wiki/Gelenk |
| Wikipedia · Gelenk | https://de.wikipedia.org/wiki/Gelenk |
| Klexikon · Muskel | https://klexikon.zum.de/wiki/Muskel |
| Klexikon · Energie | https://klexikon.zum.de/wiki/Energie |
| Wikipedia · Zellatmung | https://de.wikipedia.org/wiki/Zellatmung |
| Klexikon · Sauerstoff | https://klexikon.zum.de/wiki/Sauerstoff |
| Klexikon · Zucker | https://klexikon.zum.de/wiki/Zucker |
| Klexikon · Ernährung | https://klexikon.zum.de/wiki/Ern%C3%A4hrung |
| Klexikon · Kohlenhydrate | https://klexikon.zum.de/wiki/Kohlenhydrate |
| Klexikon · Eiweiß | https://klexikon.zum.de/wiki/Eiwei%C3%9F |
| Klexikon · Vitamin | https://klexikon.zum.de/wiki/Vitamin |
| DGE · Gut essen und trinken – die DGE-Empfehlungen | https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/ |
| DGE · DGE-Ernährungskreis | https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-ernaehrungskreis/ |
| Bundeszentrum für Ernährung · Die Ernährungspyramide | https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide |
| Klexikon · Verdauung | https://klexikon.zum.de/wiki/Verdauung |
| Gesundheitsinformation.de · Wie funktioniert der Darm? | https://www.gesundheitsinformation.de/wie-funktioniert-der-darm.html |
| Gesundheitsinformation.de · Wie funktioniert der Magen? | https://www.gesundheitsinformation.de/wie-funktioniert-der-magen.html |
| Wikipedia · Oberflächenvergrößerung | https://de.wikipedia.org/wiki/Oberfl%C3%A4chenvergr%C3%B6%C3%9Ferung |
| Wikipedia · Darmzotte | https://de.wikipedia.org/wiki/Darmzotte |
| Wikipedia · Lungenbläschen | https://de.wikipedia.org/wiki/Lungenbl%C3%A4schen |
| Klexikon · Atmung | https://klexikon.zum.de/wiki/Atmung |
| Klexikon · Lunge | https://klexikon.zum.de/wiki/Lunge |
| Gesundheitsinformation.de · Wie funktioniert die Lunge? | https://www.gesundheitsinformation.de/wie-funktioniert-die-lunge.html |
| Klexikon · Blutkreislauf | https://klexikon.zum.de/wiki/Blutkreislauf |
| Klexikon · Herz | https://klexikon.zum.de/wiki/Herz |
| Klexikon · Blut | https://klexikon.zum.de/wiki/Blut |
| Gesundheitsinformation.de · Wie funktioniert das Herz? | https://www.gesundheitsinformation.de/wie-funktioniert-das-herz.html |
| WHO · Physical activity (englisch) | https://www.who.int/news-room/fact-sheets/detail/physical-activity |
| Klexikon · Zigarette | https://klexikon.zum.de/wiki/Zigarette |
| Klexikon · Sucht | https://klexikon.zum.de/wiki/Sucht |
| rauchfrei-info.de (BIÖG) | https://www.rauchfrei-info.de/ |
| Klexikon · Pubertät | https://klexikon.zum.de/wiki/Pubert%C3%A4t |
| Klexikon · Menstruation | https://klexikon.zum.de/wiki/Menstruation |
| Klexikon · Sexualität | https://klexikon.zum.de/wiki/Sexualit%C3%A4t |
| Klexikon · Schwangerschaft | https://klexikon.zum.de/wiki/Schwangerschaft |
| Loveline (BIÖG) · Liebe, Körper, Sexualität | https://www.loveline.de/ |
| Trau dich! · Initiative zur Prävention sexuellen Kindesmissbrauchs | https://www.trau-dich.de/ |
| Nummer gegen Kummer · Beratung für Kinder und Jugendliche | https://www.nummergegenkummer.de/ |
| Klexikon · Blüte | https://klexikon.zum.de/wiki/Bl%C3%BCte |
| Wikipedia · Blütendiagramm | https://de.wikipedia.org/wiki/Bl%C3%BCtendiagramm |
| Wikipedia · Bestäubung | https://de.wikipedia.org/wiki/Best%C3%A4ubung |
| Wikipedia · Anemophilie (Windbestäubung) | https://de.wikipedia.org/wiki/Windbest%C3%A4ubung |
| Klexikon · Bienen | https://klexikon.zum.de/wiki/Biene |
| Klexikon · Kirsche | https://klexikon.zum.de/wiki/Kirsche |
| Klexikon · Haselnuss | https://klexikon.zum.de/wiki/Hasel |
| Klexikon · Gras | https://klexikon.zum.de/wiki/Gr%C3%A4ser |
| Wikipedia · Kreuzblütler | https://de.wikipedia.org/wiki/Kreuzbl%C3%BCtengew%C3%A4chse |
| Wikipedia · Lippenblütler | https://de.wikipedia.org/wiki/Lippenbl%C3%BCtler |
| Klexikon · Kohl | https://klexikon.zum.de/wiki/Raps |
| Klexikon · Salbei | https://klexikon.zum.de/wiki/Salbei |
| Wikipedia · Bestimmungsschlüssel | https://de.wikipedia.org/wiki/Bestimmungsschl%C3%BCssel |
| Klexikon · Löwenzahn | https://klexikon.zum.de/wiki/L%C3%B6wenzahn |
| Wikipedia · Wiesensalbei | https://de.wikipedia.org/wiki/Wiesen-Salbei |
| Wikipedia · Wiesenklee | https://de.wikipedia.org/wiki/Rot-Klee |
| Wikipedia · Scharfer Hahnenfuß | https://de.wikipedia.org/wiki/Scharfer_Hahnenfu%C3%9F |
| Wikipedia · Spitzwegerich | https://de.wikipedia.org/wiki/Spitzwegerich |
| Wikipedia · Magerwiesen-Margerite | https://de.wikipedia.org/wiki/Wiesen-Margerite |
| Klexikon · Wiese | https://klexikon.zum.de/wiki/Wiese |
| Klexikon · Ökosystem | https://klexikon.zum.de/wiki/%C3%96kosystem |
| Wikipedia · Grünland | https://de.wikipedia.org/wiki/Gr%C3%BCnland |
| Klexikon · Artenvielfalt | https://klexikon.zum.de/wiki/Artenvielfalt |
| Klexikon · Landwirtschaft | https://klexikon.zum.de/wiki/Landwirtschaft |
| LfL Bayern · Kulturlandschaft & Biodiversität | https://www.lfl.bayern.de/iab/kulturlandschaft/ |
| LfL Bayern · Grünland, Feldfutter, Grassamen | https://www.lfl.bayern.de/ipz/gruenland/ |

## Card mapping (proposal, not approved)

`zam-os/zam` at commit `85d871e370414d42557b229cd3149e2e4ae142b3` holds three Gymnasium Grade 5 cells that no package has claimed: `biologie-realschule-5` excluded them as another school type (`docs/biologie-5-bestandsabgleich.md`), `nt-mittelschule-5` left them active. This package claims them and maps all 24 items in `replaces-de-by.json` (`status: "proposal-only"`, `approved: null`). Snapshots are byte-exact (LF) in `biologie-gymnasium-5/tests/fixtures/`:

| Cell | Version | SHA-256 |
| --- | --- | --- |
| `de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie` | 2026.08.1 | `5cacb9bd044644821d5c0275bc5d5b2e846bf2ce6f9d49a3aeaff688d5b8ffc9` |
| `de-by:gymnasium-5-biologie-pflanzen-bluetenbau-samen` | 2026.08.1 | `d3f1a0ea4abbe60fa9b0978a0bc6f554d0e75b5e7068609ed4a2ddf5e46bb52d` |
| `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` | 2026.08.1 | `58bbf9d30d0283acc6c8a94604a25890ae7214e231871a0789550cc7bfdca02a` |

Summary: **4 A, 0 B, 20 C** (19 keep active, 1 proposed retirement).

| Old item | Old question (short) | Category | Proposed action |
| --- | --- | --- | --- |
| skelett J01 | function of the intervertebral discs | A | replace by `bg5-skelett-check` |
| pflanzen J03 | which organs form the pollen | A | replace by `bg5-bluete-check` |
| pflanzen J05 | how the male nucleus reaches the egg (pollen tube) | A | replace by `bg5-bestaeubung-befruchtung-check` |
| nt J03 | three structures only plant cells have | A | replace by `bg5-zellen-check` |
| pflanzen J04 | four flower whorls, composite | C | propose retirement (covered by smaller cards in `bg5-bluete`) |
| skelett J02, J04; nt J02, J04; pflanzen J06 | composite prompts | C | keep active (one history cannot be split) |
| skelett J03, nt J01 | tendons; reproducibility and control | C | keep active (taught, but no card with the same retrieval) |
| skelett J05–J08 | hormones, placenta, prenatal development | C | keep active (Biologie 8) |
| pflanzen J01, J02, J07, J08 | xylem/phloem, plant organs, germination, seed | C | keep active (NT6) |
| nt J05–J08 | object-oriented modelling, file systems | C | keep active (not NT5 Lernbereich 2) |

`cell.json` ships without `replaces` and `retired_items`, so the catalog gate needs no approval for the first publication. Questions for Thomas:

1. Do you approve the 4 A transfers and the proposed retirement of pflanzen J04?
2. Should these three Gymnasium 5 cells belong to this package at all, or should the NT cell (which also covers NT5 Lernbereich 1 and old Informatik content) wait for an NT5 Lernbereich 1 package?
