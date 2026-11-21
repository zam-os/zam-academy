# Politics and Society 7 Mittelschule coverage

The package covers learning area 3 (Politik und Gesellschaft) of the Bavarian Grade 7 GPG curriculum for both tracks: the [Regelklasse R7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/gpg/regelklasse) and the [Mittlere-Reife-Klasse M7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/gpg/mittlere-reife-klasse), both fetched live on 20 November 2026. The official pages give no hours for the learning area. [The coverage matrix](../politik-mittelschule-7/coverage.json) records all four expectations per track verbatim and links each to lessons. Learning areas 1, 2 and 4 of Grade 7 GPG are outside this package, as in the [Grade 6 package](politik-mittelschule-6-coverage.md).

| Expectation (R7 / M7) | Lessons | M7 difference |
| --- | --- | --- |
| Living and working conditions of workers' families and approaches to the social question | `fabrik`, `wohnen`, `zusammenschluss`, `kirche-unternehmer`, `sozialgesetze` | M7 also compares with today's social security system: `sozialstaat` |
| Development of a German city at the end of the 19th century, transition from agrarian to industrial society | `agrar-industrie`, `stadtwachstum`, `stadtviertel` | M7 adds consequences such as new occupations: `neue-berufe` |
| Causes of the First World War and the war-guilt question including current research | `kriegsursachen`, `julikrise`, `kriegsschuld` | identical wording |
| Military, territorial and economic terms of the Treaty of Versailles and the resulting discontent | `versailles`, `unzufriedenheit` | M7 "stellen selbständig … dar … zu diskutieren"; the Level 2 tasks ask for that |

All eight rows are `implemented`. Activities that need a class (a museum visit, a debate, discussing a current conflict, local research) are named in each row's `additional` field and on the learning path; the app does not claim them. For the Regelklasse the two M7 lessons are listed in `optional_lessons` and shown as optional extensions that do not count towards completion.

Neighbouring content: GPG 7 learning area 2 treats industrialisation, imperialism, the assassination in Sarajevo and the course of the war. This package refers to it in two `review` notes and does not repeat the course of the war. The Weimar Republic belongs to Grade 8.

## Source checks

`node scripts/check-curriculum.mjs` checks the SHA-256 of both stored curriculum pages and finds every quoted expectation in them: 8 rows, 0 not found. Each of the 28 sources a lesson shows was fetched once on 20 or 21 November 2026 and its page title read:

| Source | Page title read | Used for |
| --- | --- | --- |
| [LeMO Sozialgesetzgebung](https://www.dhm.de/lemo/kapitel/kaiserreich/innenpolitik/sozialgesetze) | LeMO Zeitstrahl - Kaiserreich - Innenpolitik - Sozialgesetzgebung | 12–14 hours, contributions, pension at 70 |
| [FES Chronik, 8. Mai 1891](https://library.fes.de/fulltext/bibliothek/chronik/band1/e235e481.html) | 8. Mai 1891 | Gewerbeordnung 1891: Sunday rest, no factory work under 13, eleven hours for women workers only (LeMO states the eleven hours without restricting them to women) |
| [LeMO Arbeiterfrage und Streikbewegung](https://www.dhm.de/lemo/kapitel/kaiserreich/innenpolitik/arbeiterfrage-und-streikbewegung) | … Arbeiterfrage und Streikbewegung | 1889 miners' strike, demands |
| [LeMO Arbeiterbewegung](https://www.dhm.de/lemo/kapitel/kaiserreich/innenpolitik/arbeiterbewegung) | … Arbeiterbewegung | ADAV 1863, SDAP 1869, Gotha 1875, SPD 1890, Christian unions |
| [LeMO Sozialistengesetz](https://www.dhm.de/lemo/kapitel/kaiserreich/innenpolitik/sozialistengesetz) | … Sozialistengesetz | 1878 ban |
| [Kolping Deutschland](https://www.kolping.de/verband/adolph-kolping/) | Adolph Kolping - Verband - Kolping | Cologne journeymen's association 1849 |
| [LeMO Wichern](https://www.dhm.de/lemo/biografie/johann-hinrich-wichern) | LeMO Biografie - Johann Hinrich Wichern | Rauhes Haus, Innere Mission |
| [LeMO Krupp](https://www.dhm.de/lemo/biografie/alfred-krupp) | LeMO Biografie - Alfred Krupp | sickness fund, housing, shops, union ban |
| [DRV Historie](https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Historie/historie_node.html) | Historie \| Deutsche Rentenversicherung | 1889, unemployment insurance 1927 |
| [bpb Junges Politik-Lexikon](https://www.bpb.de/kurz-knapp/lexika/das-junge-politik-lexikon/321149/sozialversicherung/) | Sozialversicherung \| bpb.de | five branches, contributions |
| [bpb Sozialversicherungssystem](https://www.bpb.de/themen/politisches-system/24-deutschland/40478/das-deutsche-sozialversicherungssystem/) | Das deutsche Sozialversicherungssystem \| 24 x Deutschland \| bpb.de | solidarity principle, 1995 |
| [BMG Pflegeversicherung](https://www.bundesgesundheitsministerium.de/service/begriffe-von-a-z/p/pflegeversicherung) | Pflegeversicherung \| BMG | 1 January 1995 |
| [LeMO Industrie und Wirtschaft](https://www.dhm.de/lemo/kapitel/kaiserreich/industrie) | … Kaiserreich - Industrie und Wirtschaft | sector shares 1871/1907 |
| [LeMO Landwirtschaft](https://www.dhm.de/lemo/kapitel/kaiserreich/industrie-und-wirtschaft/landwirtschaft) | … Landwirtschaft | threshing machines, migration |
| [LeMO Urbanisierung](https://www.dhm.de/lemo/kapitel/kaiserreich/alltagsleben/urbanisierung-im-deutschen-reich) | … Urbanisierung im Deutschen Reich | 41→65 million, 8→48 cities, Berlin |
| [LeMO Mietskaserne](https://www.dhm.de/lemo/kapitel/kaiserreich/alltagsleben/mietskaserne) | … Mietskaserne | tenement layout |
| [LeMO Neue Industrien](https://www.dhm.de/lemo/kapitel/kaiserreich/industrie/neue) | … Neue Industrien | Siemens, AEG, 600 chemists at Bayer |
| [LeMO Warenhäuser](https://www.dhm.de/lemo/kapitel/kaiserreich/alltagsleben/warenhaeuser) | … Warenhäuser | sales staff as employees |
| [LeMO Bismarcks Bündnissystem](https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/bismarcks-buendnissystem) | … Bismarcks Bündnissystem | Zweibund 1879 as mutual aid against a Russian attack |
| [LeMO Weg in den Krieg](https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/weg-in-den-krieg) | … Weg in den Krieg | arms race, army 1913 |
| [LeMO Flottenbau](https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/flottenbau) | … Flottenbau | naval race |
| [LeMO Kolonialpolitik](https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/kolonialpolitik) | … Kolonialpolitik | colonial associations |
| [LeMO Juli-Krise 1914](https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/juli-krise-1914) | … Juli-Krise 1914 | dates of the July Crisis |
| [LeMO Kriegserklärungen](https://www.dhm.de/lemo/kapitel/erster-weltkrieg/kriegsverlauf/kriegserklaerungen) | … Kriegserklärungen | blocs, Italy 1915 |
| [bpb, Annika Mombauer](https://www.bpb.de/shop/zeitschriften/apuz/182558/julikrise-und-kriegsschuld-thesen-und-stand-der-forschung/) | Julikrise und Kriegsschuld – Thesen und Stand der Forschung \| Erster Weltkrieg \| bpb.de | Article 231, Fischer, Clark, Krumeich |
| [LeMO Versailler Vertrag](https://www.dhm.de/lemo/kapitel/weimarer-republik/aussenpolitik/versailles) | … Versailler Vertrag | treaty terms, plebiscites (including the areas that stayed German) |
| [LeMO Reparationen](https://www.dhm.de/lemo/kapitel/weimarer-republik/aussenpolitik/reparationen) | … Reparationen | total fixed in London in May 1921: 132 billion marks (the LeMO overview of Weimar foreign policy says 132 billion gold marks) |
| [LeMO Dolchstoßlegende](https://www.dhm.de/lemo/kapitel/weimarer-republik/innenpolitik/dolchstosslegende) | … Dolchstoßlegende | the legend and why it was false |

The war-guilt lesson presents positions as summaries, not quotations, and does not settle the debate. It follows the bpb overview: Fischer argued for main, not sole, German responsibility; Clark stresses the part of all great powers; critics such as Krumeich still see the greatest responsibility in Berlin.

All drawings are schematic and say so in their captions. The model town "Neustadt am Fluss" and the people in the workshops are invented. The Versailles diagram is not a map: its boxes only point in the approximate direction of each territory. No external images, maps or embeds are used, and no teacher videos are linked yet (a later step adds them).

## Existing cards and integration

The current `zam-os/zam` fixtures at [`bae34e7`](https://github.com/zam-os/zam/tree/bae34e7dfe7d01838e448a65f15871c3549ae3fc/tests/fixtures) contain no `de-by` cell for Mittelschule GPG. Overlapping topics exist only in cells of other school types: `de-by:realschule-8-geschichte-aufklaerung-revolution-kaiserreich` (Industrial Revolution), `de-by:realschule-9-geschichte-weimar-ns` (Versailles and the stab-in-the-back legend as burdens of Weimar) and `de-by:gymnasium-9-geschichte-weimarer-republik-nationalsozialismus-shoah`. They stay with the packages of their school types. The mapping is therefore empty and proposal-only, and the cell declares no `replaces` or `retired_items`. Whether any of those cells belongs here is a question for Thomas.

The atlas registers the package under GPG for Grade 7 with both tracks. Each atom binds to `gpg`, Grade 7, `lb3`, once per track it serves (`R`, `M`); the two M7 lessons bind only to `M`.
