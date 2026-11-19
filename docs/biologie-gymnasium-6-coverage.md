# Biologie 6 Gymnasium: curriculum check, scope and card mapping

## Curriculum source

- At the Bavarian Gymnasium, Biology in Grade 6 is taught inside **Natur und Technik**. The Fachlehrplan is `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym` (page title "LehrplanPLUS - Gymnasium - 6 - Natur und Technik (Gym) - Fachlehrpläne").
- Fetched live on 2026-11-16 with `curl -sL --compressed -A "Mozilla/5.0"`, HTTP 200. Stored as `biologie-gymnasium-6/tests/fixtures/curriculum.html`, SHA-256 `90af78646f82002c9adadeaff133b45196de5e279a79ee06c168b2b70aeccea4`. The bytes are identical to the snapshot `informatik-gymnasium-6` stored on 2026-11-15.
- NT6 has two Lernbereiche: **1 Schwerpunkt Biologie** (ca. 56 hours: 1.1 integrated, 1.2 ca. 16, 1.3 ca. 26, 1.4 ca. 8, 1.5 ca. 6) and **2 Schwerpunkt Informatik** (ca. 28 hours). This package covers Lernbereich 1; Lernbereich 2 is `informatik-gymnasium-6`.
- One Fachlehrplan for all Ausbildungsrichtungen; no lesson carries a track.

## Competences and coverage

`coverage.json` lists all 45 Kompetenzerwartungen of Lernbereich 1, extracted by script from the stored HTML (the `<li>` items after each "Kompetenzerwartungen" heading, `<dialog>` info boxes removed, whitespace normalised). Check:

```
$ node scripts/check-curriculum.mjs
45 verbatim competence rows, 0 not found; curriculum SHA-256 matches.
```

| Teilbereich | Hours | Competences | Supported | Station(s) | Lessons |
| --- | --- | ---: | ---: | --- | ---: |
| 1.1 Erkenntnisse gewinnen – kommunizieren – bewerten | integrated | 16 | 5 | 1 (and applied in all stations) | 20 |
| 1.2 Samenpflanzen als Lebewesen | ca. 16 | 9 | 1 | 2, 3 | 11 |
| 1.3 Biodiversität bei Wirbeltieren – Variabilität und Angepasstheit | ca. 26 | 13 | 0 | 4, 5, 6, 7 | 16 |
| 1.4 Verwandtschaft der Wirbeltiere und Evolution | ca. 8 | 3 | 0 | 8 | 4 |
| 1.5 Ökosystem Gewässer | ca. 6 | 4 | 2 | 9 | 4 |

37 rows are `implemented`, 8 `supported`. The supported rows and what stays in class:

- **1.1 (2)** führen vorstrukturierte einfache naturwissenschaftliche Untersuchungen zu vorgegebenen und… — Carrying out real, pre-structured investigations with seeds, yeast, thermometers and Secchi discs happens in the Fachraum and outdoors.
- **1.1 (4)** beobachten Lebewesen und ihre Lebenserscheinungen auch in der natürlichen Umgebung anhand … — Observing living animals and plants on the school grounds or at the pond with a prepared sheet stays in class.
- **1.1 (5)** verwenden ein Lichtmikroskop oder Binokular nach Anleitung, um tierische und pflanzliche P… — Using a real light microscope or binocular and drawing the specimen by hand happens in the Fachraum.
- **1.1 (6)** stellen einfache Präparate ggf. mit geeigneten Schnitttechniken selbst her und färben dies… — Cutting sections with a razor blade and staining real slides is done under supervision in class.
- **1.1 (11)** protokollieren auch mithilfe von Zeichnungen einfache Arbeitsabläufe und Ergebnisse weitge… — Writing complete protocols with hand-drawn sketches of a real experiment stays in class.
- **1.2 (4)** schließen aus selbst durchgeführten Experimenten hypothesengeleitet auf den Einfluss versc… — Running the germination experiments with real cress or beans over several days is done in class or at home.
- **1.5 (1)** führen im Freiland Untersuchungen zu verschiedenen Umweltfaktoren im aquatischen Ökosystem… — Measuring water temperature, Secchi depth and flow speed at a real pond or stream happens outdoors with adults.
- **1.5 (2)** bestimmen Lebewesen aquatischer Ökosysteme und erkunden so deren biologische Vielfalt.… — Catching and identifying real pond organisms with net, tray and key happens at the pond.

Curriculum details that shaped the content:

- The competence on Stoff- und Energiemanagement carries the editing marker `[/decision]` twice with an unopened bracket on the official page; it is copied verbatim so the verbatim check stays exact.
- "modellieren stark vereinfacht … auf Teilchenebene": photosynthesis is shown as building blocks (C, O, H) that are rearranged, 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ drawn without chemical formulas in learner text; a test checks the balance. Chloroplast details, ATP and mitochondria (Biologie 11) are left out and tested.
- "stark vereinfachter Mechanismus … Phototropismus": tip perceives light, a growth substance reaches the shaded side, cells there elongate more. The hormone name auxin is not used.
- The Lehrplan writes "Photosynthese"; a test rejects "Fotosynthese" in learner text.

## Neighbouring grades

- **Built on**: NT5 (Gymnasium) is marked "Wiederholung aus NT5" where revisited: phases of the Erkenntnisweg, microscope handling, flower, pollination and fertilisation, ground plan of the seed plant, cellular respiration in humans, sense organs and the human stimulus-response chain (`biologie-gymnasium-5`).
- **Left out, later grades**: photosynthesis and respiration at the level of organelles and ATP (Biologie 11), evidence for evolution such as transitional fossils (Biologie 10), hormones of plant growth.
- **Other packages**: `informatik-gymnasium-6` covers NT6 Lernbereich 2; `biologie-realschule-6` and `nt-mittelschule-6` teach related topics for their school types and are unchanged.

## Existing ZAM cards (`replaces-de-by.json`)

`zam-os/zam` (commit `7a08d329919cf6888ba3ba937c3c70451c8e8990`) holds two cells named after Gymnasium Grade 6 biology. Byte-exact copies with SHA-256:

- `de-by:gymnasium-6-biologie-fische-amphibien-reptilien-evolution` (2026.08.1): `tests/fixtures/de-by-gymnasium-6-biologie-fische-amphibien-reptilien-evolution-kvt.json`, SHA-256 `7ffad13f1d571e1d2a8ee2e1b040f58108a4a61ed1feec652d1c6a9365d4ab0c`
- `de-by:gymnasium-6-biologie-saeugetiere-voegel-leichtbau-flug` (2026.08.1): `tests/fixtures/de-by-gymnasium-6-biologie-saeugetiere-voegel-leichtbau-flug-kvt.json`, SHA-256 `ab9a7b01f5e7d27c40caeeb53d6a9e906aa0d9764866ea00ae15bd68e8b59805`

Thomas approved 3 same-retrieval transfers on 2026-11-19. The published mapping uses `replaces` for those transfers. The 13 keep-active cards retain their review histories on their existing IDs. The attached migration check covers repeated installs and conflicting histories.

| Old id (short) | Old question (shortened) | Cat. | Proposed action | Successor / reason |
| --- | --- | :---: | --- | --- |
| Fische `…J01` | Warum fließen in den Kiemenlamellen der Knochenfische das Atemwasser und das Blu… | **C** | `keep-active` | Countercurrent exchange in the gill lamellae with an oxygen yield figure goes beyond NT6 1.3, which only asks for oxygen uptake from water and air (bg6-atmungsorgane). No successor retrieves it; the history stays active. |
| Fische `…J02` | Erkläre die anatomischen Anpassungen der Knochenfische an das Leben im Wasser: 1… | **C** | `keep-active` | Four-part prompt on gills with countercurrent, swim bladder, lateral line and external fertilisation. The package splits these ideas over bg6-atmungsorgane, bg6-schwimmen, bg6-sinnesleistungen and bg6-fortpflanzung-wasser-land; one history must not be spread over several cards. |
| Fische `…J03` | Welche Gliedmaßen wachsen bei der Kaulquappe während der Metamorphose als erste … | **A** | `replace` | `bg6-metamorphose-check` – Same atomic retrieval: which legs grow first during the metamorphosis of the tadpole (the hind legs). The successor asks exactly this as a tier-1 quick check. |
| Fische `…J04` | Erkläre das 'Doppelleben' der Amphibien (altgriech. amphi-bios = beidseitiges Le… | **C** | `keep-active` | Multi-part prompt on the six phases of metamorphosis, lung and skin breathing and torpor. bg6-metamorphose, bg6-atmungsorgane and bg6-ueberwintern cover the parts separately; no single successor keeps the whole prompt. |
| Fische `…J05` | Amniotic egg | **C** | `keep-active` | The new item also requires internal fertilisation and covers birds. |
| Fische `…J06` | Erkläre die 4 anatomischen Schlüsselerfindungen, mit denen die Reptilien (Kriech… | **C** | `keep-active` | Four-part prompt on horny scales, chambered lung, internal fertilisation and the amniote egg with allantois and comparison of slow worm and grass snake; beyond NT6 in detail and spread over several lessons. |
| Fische `…J07` | Welches berühmte fossile Brückentier (Mosaikform) beweist mit Merkmalen von Rept… | **C** | `keep-active` | Archaeopteryx as a transitional fossil is not part of NT6 1.4; evidence for evolution belongs to Biologie 10 (Gymnasium). The history stays active. |
| Fische `…J08` | Erstelle eine vergleichende Synopse aller 5 Wirbeltierklassen (Fische, Amphibien… | **C** | `keep-active` | Synopsis of all five classes including heart and circulation and the water-to-land transition via lobe-finned fish and Ichthyostega; bg6-wirbeltierklassen covers four of the criteria, the rest goes beyond NT6. |
| Säuger/Vögel `…J01` | Welche 3 anatomisch-physiologischen Schlüsselmerkmale definieren eindeutig die W… | **A** | `replace` | `bg6-wirbeltierklassen-check` – Same atomic retrieval: the defining features of mammals (hair, constant body temperature, suckling the young with milk). The successor quick check asks exactly this. |
| Säuger/Vögel `…J02` | Erkläre die evolutiven Erfolgsmerkmale der Säugetiere: 1. Gleichwarmheit / Endot… | **C** | `keep-active` | Multi-part prompt on endothermy, diaphragm, heterodont dentition, placenta and three foot postures. bg6-koerpertemperatur, bg6-gebisse and bg6-laufen-graben-klettern cover parts; placenta and diaphragm belong to later grades. |
| Säuger/Vögel `…J03` | Welche Zähne bilden beim Fleischfressergebiss der Raubtiere (z. B. Wolf, Katze) … | **C** | `keep-active` | Asks which teeth form the carnassials (upper P4 and lower M1). bg6-gebisse asks for their function, not their tooth position; different retrieval. |
| Säuger/Vögel `…J04` | Vergleiche die 3 hochspezialisierten Gebiss- und Schädelformen der Säugetiere: 1… | **C** | `keep-active` | Three dentition types including rodents with links to rumen and caecum; bg6-gebisse covers predator and grazer only, so no single successor keeps the whole prompt. |
| Säuger/Vögel `…J05` | Wie nennt man die mit feinen Hakenstrahlen (Mikro-Klettverschluss) vernetzten Ho… | **C** | `keep-active` | Asks for the terms Hakenstrahlen and Bogenstrahlen of the feather vane. bg6-fliegen describes the interlocking barbs without these terms; different retrieval. |
| Säuger/Vögel `…J06` | Erkläre die bionischen Leichtbauanpassungen des Vogelkörpers an das Fliegen: 1. … | **C** | `keep-active` | Multi-part prompt on pneumatised bones, synsacrum, keel, feather structure and air sacs. bg6-fliegen-recall asks for the main flight adaptations in a shorter form; the old whole answer is not kept on one card. |
| Säuger/Vögel `…J07` | Welche Flugart nutzen Greifvögel und Störche, um in aufsteigenden warmen Luftstr… | **A** | `replace` | `bg6-fliegen-check` – Same atomic retrieval: the flight type of buzzards and storks rising in warm updrafts without wingbeats (Segelflug). The successor quick check asks exactly this. |
| Säuger/Vögel `…J08` | Erkläre die Entstehung des dynamischen Auftriebs am gewölbten Vogelflügel nach d… | **C** | `keep-active` | Multi-part prompt on lift after Bernoulli, four flight types, the structure of the bird egg and altricial versus precocial young; spread over bg6-fliegen and bg6-nesthocker-nestfluechter and partly beyond NT6. |

### Legacy scope

The three approved replacements preserve the same retrieval. The amniotic-egg question and the twelve other C cards keep their existing IDs and learning history. The Grade 5 biology fixtures stay under the Grade 5 package's mapping.

## Sources

Every link a lesson shows was fetched on 2026-11-16 by a script that requested each URL with a browser User-Agent, required HTTP 200 and compared the real `<title>` with the label (`153 checked, 0 mismatched` apart from the Lehrplan label, which names the page in short form). Klexikon answers 404 for missing articles but still prints a matching title; 16 such candidates (e.g. Kresse, Klette, Bionik, Mimose, Stockente, Vogelzug, Schilf, Seerose) were dropped or replaced by Wikipedia pages. Labels use the real title, including redirects (Wikipedia "Phototropismus" → "Pflanzenbewegung", "Poikilothermie" → "Wechselwarmes Tier", "Nahrungsnetz" → "Nahrungskette").

| Label | URL |
| --- | --- |
| LehrplanPLUS Bayern · Natur und Technik 6 Gymnasium | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym |
| Klexikon · Experiment | https://klexikon.zum.de/wiki/Experiment |
| Wikipedia · Hypothese | https://de.wikipedia.org/wiki/Hypothese |
| Wikipedia · Abhängige und unabhängige Variable | https://de.wikipedia.org/wiki/Abh%C3%A4ngige_und_unabh%C3%A4ngige_Variable |
| Wikipedia · Versuchskontrolle | https://de.wikipedia.org/wiki/Kontrollexperiment |
| Wikipedia · Fehler | https://de.wikipedia.org/wiki/Messfehler |
| Klexikon · Wissenschaft | https://klexikon.zum.de/wiki/Wissenschaft |
| Klexikon · Vögel | https://klexikon.zum.de/wiki/V%C3%B6gel |
| Klexikon · Mikroskop | https://klexikon.zum.de/wiki/Mikroskop |
| Wikipedia · Stereomikroskop | https://de.wikipedia.org/wiki/Stereomikroskop |
| Klexikon · Lupe | https://klexikon.zum.de/wiki/Lupe |
| Wikipedia · Wasserpest | https://de.wikipedia.org/wiki/Wasserpest |
| Klexikon · Modell | https://klexikon.zum.de/wiki/Modell |
| Wikipedia · Modell | https://de.wikipedia.org/wiki/Modell |
| Klexikon · Ahorne | https://klexikon.zum.de/wiki/Ahorn |
| Wikipedia · Säulendiagramm | https://de.wikipedia.org/wiki/S%C3%A4ulendiagramm |
| Wikipedia · Liniendiagramm | https://de.wikipedia.org/wiki/Liniendiagramm |
| Klexikon · Quelle | https://klexikon.zum.de/wiki/Quelle |
| Wikipedia · Anthropomorphismus | https://de.wikipedia.org/wiki/Anthropomorphismus |
| Klexikon · Wolf | https://klexikon.zum.de/wiki/Wolf |
| Klexikon · Samen | https://klexikon.zum.de/wiki/Samen |
| Klexikon · Frucht | https://klexikon.zum.de/wiki/Frucht |
| Wikipedia · Gartenbohne | https://de.wikipedia.org/wiki/Gartenbohne |
| Wikipedia · Diaspore | https://de.wikipedia.org/wiki/Diaspore |
| Klexikon · Löwenzahn | https://klexikon.zum.de/wiki/L%C3%B6wenzahn |
| Wikipedia · Große Klette | https://de.wikipedia.org/wiki/Gro%C3%9Fe_Klette |
| Wikipedia · Bionik | https://de.wikipedia.org/wiki/Bionik |
| Wikipedia · Klettverschluss | https://de.wikipedia.org/wiki/Klettverschluss |
| Wikipedia · Lotoseffekt | https://de.wikipedia.org/wiki/Lotoseffekt |
| Wikipedia · Ausläufer | https://de.wikipedia.org/wiki/Ausl%C3%A4ufer |
| Klexikon · Erdbeeren | https://klexikon.zum.de/wiki/Erdbeere |
| Wikipedia · Gartenerdbeere | https://de.wikipedia.org/wiki/Gartenerdbeere |
| Klexikon · Kartoffel | https://klexikon.zum.de/wiki/Kartoffel |
| Wikipedia · Keimung | https://de.wikipedia.org/wiki/Keimung |
| Klexikon · Bohne | https://klexikon.zum.de/wiki/Bohne |
| Klexikon · Wurzel | https://klexikon.zum.de/wiki/Wurzel |
| Klexikon · Blatt | https://klexikon.zum.de/wiki/Blatt |
| Wikipedia · Sonnenblume | https://de.wikipedia.org/wiki/Sonnenblume |
| Klexikon · Pflanzen | https://klexikon.zum.de/wiki/Pflanze |
| Klexikon · Photosynthese | https://klexikon.zum.de/wiki/Photosynthese |
| Wikipedia · Photosynthese | https://de.wikipedia.org/wiki/Photosynthese |
| Klexikon · Zucker | https://klexikon.zum.de/wiki/Zucker |
| Wikipedia · Zellatmung | https://de.wikipedia.org/wiki/Zellatmung |
| Klexikon · Sauerstoff | https://klexikon.zum.de/wiki/Sauerstoff |
| Klexikon · Energie | https://klexikon.zum.de/wiki/Energie |
| Wikipedia · Nachwachsender Rohstoff | https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff |
| Wikipedia · Fossile Energie | https://de.wikipedia.org/wiki/Fossile_Energie |
| Klexikon · Kohle | https://klexikon.zum.de/wiki/Kohle |
| Klexikon · Erdöl | https://klexikon.zum.de/wiki/Erd%C3%B6l |
| Wikipedia · Biomasse | https://de.wikipedia.org/wiki/Biomasse |
| Wikipedia · Pflanzenbewegung | https://de.wikipedia.org/wiki/Phototropismus |
| Wikipedia · Mimose | https://de.wikipedia.org/wiki/Mimosa_pudica |
| Wikipedia · Gewöhnlicher Löwenzahn | https://de.wikipedia.org/wiki/Gew%C3%B6hnlicher_L%C3%B6wenzahn |
| Klexikon · Fische | https://klexikon.zum.de/wiki/Fische |
| Wikipedia · Schwimmblase | https://de.wikipedia.org/wiki/Schwimmblase |
| Wikipedia · Stromlinienform | https://de.wikipedia.org/wiki/Stromlinienform |
| Klexikon · Forelle | https://klexikon.zum.de/wiki/Forelle |
| Klexikon · Feder | https://klexikon.zum.de/wiki/Feder |
| Wikipedia · Vogelflug | https://de.wikipedia.org/wiki/Vogelflug |
| Wikipedia · Sohlengänger | https://de.wikipedia.org/wiki/Sohleng%C3%A4nger |
| Wikipedia · Zehengänger | https://de.wikipedia.org/wiki/Zeheng%C3%A4nger |
| Wikipedia · Spitzengänger | https://de.wikipedia.org/wiki/Zehenspitzeng%C3%A4nger |
| Klexikon · Maulwürfe | https://klexikon.zum.de/wiki/Maulwurf |
| Klexikon · Eichhörnchen | https://klexikon.zum.de/wiki/Eichh%C3%B6rnchen |
| Klexikon · Pinguine | https://klexikon.zum.de/wiki/Pinguine |
| Klexikon · Gepard | https://klexikon.zum.de/wiki/Gepard |
| Klexikon · Flugzeug | https://klexikon.zum.de/wiki/Flugzeug |
| Klexikon · Schiff | https://klexikon.zum.de/wiki/Schiff |
| Wikipedia · Gebiss | https://de.wikipedia.org/wiki/Gebiss |
| Klexikon · Hunde | https://klexikon.zum.de/wiki/Hund |
| Klexikon · Rinder | https://klexikon.zum.de/wiki/Rind |
| Wikipedia · Wiederkäuer | https://de.wikipedia.org/wiki/Wiederk%C3%A4uer |
| Wikipedia · Stockente | https://de.wikipedia.org/wiki/Stockente |
| Wikipedia · Graureiher | https://de.wikipedia.org/wiki/Graureiher |
| Wikipedia · Wechselwarmes Tier | https://de.wikipedia.org/wiki/Poikilothermie |
| Wikipedia · Gleichwarmes Tier | https://de.wikipedia.org/wiki/Homoiothermie |
| Klexikon · Eidechsen | https://klexikon.zum.de/wiki/Eidechsen |
| Wikipedia · Zauneidechse | https://de.wikipedia.org/wiki/Zauneidechse |
| Klexikon · Winterschlaf | https://klexikon.zum.de/wiki/Winterschlaf |
| Wikipedia · Winterruhe | https://de.wikipedia.org/wiki/Winterruhe |
| Wikipedia · Kältestarre | https://de.wikipedia.org/wiki/K%C3%A4ltestarre |
| Klexikon · Igel | https://klexikon.zum.de/wiki/Igel |
| Wikipedia · Vogelzug | https://de.wikipedia.org/wiki/Vogelzug |
| Wikipedia · Kieme | https://de.wikipedia.org/wiki/Kieme |
| Wikipedia · Hautatmung | https://de.wikipedia.org/wiki/Hautatmung |
| Wikipedia · Lunge | https://de.wikipedia.org/wiki/Lunge |
| Klexikon · Amphibien | https://klexikon.zum.de/wiki/Amphibien |
| Klexikon · Wirbeltiere | https://klexikon.zum.de/wiki/Wirbeltiere |
| Wikipedia · Amnion | https://de.wikipedia.org/wiki/Amnion |
| Klexikon · Reptilien | https://klexikon.zum.de/wiki/Reptilien |
| Klexikon · Ei | https://klexikon.zum.de/wiki/Ei |
| Wikipedia · Metamorphose (Zoologie) | https://de.wikipedia.org/wiki/Metamorphose_(Zoologie) |
| Wikipedia · Grasfrosch | https://de.wikipedia.org/wiki/Grasfrosch |
| Klexikon · Frösche | https://klexikon.zum.de/wiki/Frosch |
| Wikipedia · Nesthocker | https://de.wikipedia.org/wiki/Nesthocker |
| Wikipedia · Nestflüchter | https://de.wikipedia.org/wiki/Nestfl%C3%BCchter |
| Klexikon · Hühner | https://klexikon.zum.de/wiki/Huhn |
| Wikipedia · Elternaufwand | https://de.wikipedia.org/wiki/Elternaufwand |
| Wikipedia · Brutpflege | https://de.wikipedia.org/wiki/Brutpflege |
| Wikipedia · Atlantischer Kabeljau | https://de.wikipedia.org/wiki/Kabeljau |
| Wikipedia · Dreistachliger Stichling | https://de.wikipedia.org/wiki/Dreistachliger_Stichling |
| Wikipedia · Balz | https://de.wikipedia.org/wiki/Balz |
| Wikipedia · Echoortung (Tiere) | https://de.wikipedia.org/wiki/Echoortung_(Tiere) |
| Klexikon · Fledermäuse | https://klexikon.zum.de/wiki/Flederm%C3%A4use |
| Wikipedia · Seitenlinienorgan | https://de.wikipedia.org/wiki/Seitenlinienorgan |
| Wikipedia · Grubenorgan und Labialgruben | https://de.wikipedia.org/wiki/Grubenorgan |
| Klexikon · Schlangen | https://klexikon.zum.de/wiki/Schlangen |
| Klexikon · Eulen | https://klexikon.zum.de/wiki/Eulen |
| Wikipedia · Wirbeltiere | https://de.wikipedia.org/wiki/Wirbeltiere |
| Wikipedia · Bestimmungsschlüssel | https://de.wikipedia.org/wiki/Bestimmungsschl%C3%BCssel |
| Wikipedia · Blindschleiche | https://de.wikipedia.org/wiki/Blindschleiche |
| Klexikon · Wale | https://klexikon.zum.de/wiki/Wale |
| Klexikon · Evolution | https://klexikon.zum.de/wiki/Evolution |
| Wikipedia · Selektion (Evolution) | https://de.wikipedia.org/wiki/Selektion_(Evolution) |
| Klexikon · Charles Darwin | https://klexikon.zum.de/wiki/Charles_Darwin |
| Klexikon · Zucht | https://klexikon.zum.de/wiki/Z%C3%BCchtung |
| Wikipedia · Zucht | https://de.wikipedia.org/wiki/Zuchtwahl |
| Wikipedia · Qualzucht | https://de.wikipedia.org/wiki/Qualzucht |
| Wikipedia · Haushund | https://de.wikipedia.org/wiki/Haushund |
| Wikipedia · Hausrind | https://de.wikipedia.org/wiki/Hausrind |
| Gesetze im Internet · § 2 TierSchG | https://www.gesetze-im-internet.de/tierschg/__2.html |
| Klexikon · Haustiere | https://klexikon.zum.de/wiki/Haustier |
| Wikipedia · Nutztier | https://de.wikipedia.org/wiki/Nutztier |
| Klexikon · Kaninchen | https://klexikon.zum.de/wiki/Kaninchen |
| Klexikon · Meerschweinchen | https://klexikon.zum.de/wiki/Meerschweinchen |
| Klexikon · Wellensittich | https://klexikon.zum.de/wiki/Wellensittich |
| Wikipedia · Eierkennzeichnung | https://de.wikipedia.org/wiki/Eierkennzeichnung |
| Wikipedia · Sichttiefe | https://de.wikipedia.org/wiki/Sichttiefe |
| Wikipedia · Secchi-Scheibe | https://de.wikipedia.org/wiki/Secchi-Scheibe |
| Wikipedia · Strömungsgeschwindigkeit | https://de.wikipedia.org/wiki/Flie%C3%9Fgeschwindigkeit |
| Wikipedia · Abiotische Umweltfaktoren | https://de.wikipedia.org/wiki/Abiotischer_Faktor |
| Klexikon · Bach | https://klexikon.zum.de/wiki/Bach |
| Klexikon · Teich | https://klexikon.zum.de/wiki/Teich |
| Klexikon · Plankton | https://klexikon.zum.de/wiki/Plankton |
| Klexikon · Hecht | https://klexikon.zum.de/wiki/Hecht |
| Klexikon · Libellen | https://klexikon.zum.de/wiki/Libellen |
| Wikipedia · Rotauge | https://de.wikipedia.org/wiki/Rotauge |
| Wikipedia · Große Teichmuschel | https://de.wikipedia.org/wiki/Teichmuschel |
| Wikipedia · Eisvogel | https://de.wikipedia.org/wiki/Eisvogel |
| Klexikon · Ökosystem | https://klexikon.zum.de/wiki/%C3%96kosystem |
| Klexikon · Nahrungskette | https://klexikon.zum.de/wiki/Nahrungskette |
| Wikipedia · Nahrungskette | https://de.wikipedia.org/wiki/Nahrungsnetz |
| Wikipedia · Produzent (Ökologie) | https://de.wikipedia.org/wiki/Produzent_(%C3%96kologie) |
| Wikipedia · Konsument (Ökologie) | https://de.wikipedia.org/wiki/Konsument_(%C3%96kologie) |
| Wikipedia · Destruent | https://de.wikipedia.org/wiki/Destruent |
| Wikipedia · Wasserflöhe | https://de.wikipedia.org/wiki/Wasserfl%C3%B6he |
| Wikipedia · Eutrophierung | https://de.wikipedia.org/wiki/Eutrophierung |
| Klexikon · Dünger | https://klexikon.zum.de/wiki/D%C3%BCnger |
| Klexikon · Kläranlage | https://klexikon.zum.de/wiki/Kl%C3%A4ranlage |
| Wikipedia · Fischtreppe | https://de.wikipedia.org/wiki/Fischtreppe |
| Klexikon · Artenvielfalt | https://klexikon.zum.de/wiki/Artenvielfalt |
| LfU Bayern · Wasser | https://www.lfu.bayern.de/wasser/index.htm |
| Umweltbundesamt · Flüsse | https://www.umweltbundesamt.de/themen/wasser/fluesse |
