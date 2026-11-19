# Politics and Society 6 Mittelschule coverage

The package covers learning area 3 of the [Bavarian Grade 6 GPG curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/gpg/regelklasse), checked on 19 November 2026. The Grade 6 Regelklasse curriculum applies. The M-Zug begins in Grade 7. The official page gives no hours for the individual learning area. [The coverage matrix](../politik-mittelschule-6/coverage.json) records both expectations verbatim and connects each to concrete lesson evidence. The remaining Grade 6 GPG learning areas are outside this package.

| Official expectation in summary | Evidence in the package |
| --- | --- |
| Compare life and power in castles and monasteries | Learners interpret features of a castle, classify monastery activities, compare a duke and an abbot, and distinguish religious authority from rights over land and courts. The education lesson compares access to learning at court, in a workshop and in a scriptorium. |
| Describe the estate hierarchy and assess individual freedoms today | Learners interpret the three-estate model and its limits, compare town and country livelihoods, and explain the difference between a legal right and a practical barrier to using it. |

[Grade 5 GPG](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/gpg) introduces social hierarchy via ancient Egypt. The estates lesson reuses the skill of reading a model and introduces a different historical hierarchy. The [Grade 7 Regelklasse curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/gpg/regelklasse) addresses industrialisation, the social question and the First World War in learning area 3.

## Source checks

The official page was fetched over HTTPS on the check date. The copy in the test fixtures is pinned with SHA-256. `node scripts/check-curriculum.mjs` verifies the hash and both quoted expectations.

| Source opened | Page title read | Use |
| --- | --- | --- |
| [Bavarian Palace Administration](https://www.burg-burghausen.de/deutsch/burg/entsteh.htm) | Bayerische Schlösserverwaltung \| Burg Burghausen \| Entstehungsgeschichte | Gate, living quarters and Burghausen's role as a ducal residence |
| [Haus der Bayerischen Geschichte](https://hdbg.eu/kloster/index.php/detail/geschichte?id=KS0405) | Haus der Bayerischen Geschichte - Klöster in Bayern | Tegernsee's landholdings, scribes and book production |
| [Historisches Lexikon Bayerns](https://www.historisches-lexikon-bayerns.de/Lexikon/Hofmark) | Hofmark – Historisches Lexikon Bayerns | Examples of judicial and manorial rights held by religious institutions |
| [Deutsches Historisches Museum](https://www.dhm.de/bildung/ida/mittelalter/stand/) | Ist mein Leben vorbestimmt? - Die Ständegesellschaft des Mittelalters | Estate model, rights and social dependencies |
| [Schloss Braunfels](https://www.museum.de/audioguide/411/29/DE) | Zünfte | Guild rules, entry and training |
| [Gesetze im Internet](https://www.gesetze-im-internet.de/gg/BJNR000010949.html) | GG - Grundgesetz für die Bundesrepublik Deutschland | Equality before the law, religious freedom and occupational freedom, articles 3, 4 and 12 |

## Illustration

[The home illustration](../politik-mittelschule-6/src/assets/burg-und-kloster.jpg) was generated with the built-in ImageGen tool using the following prompt.

> Historical scene, 3:2 landscape editorial illustration for a German grade-six history learning package. Show an imagined late-medieval Bavarian river valley seen from a slightly raised viewpoint. On the left, a credible small fortified stone castle on a wooded ridge, with a square keep, curtain wall and gate; down in the valley on the right, a distinct modest abbey with a Romanesque church, pitched roofs and a quadrangular cloister beside fields. A dirt path and a narrow stream connect the landscape visually. Both complexes must be easily distinguishable even at 400 pixels wide, with a clear sky line and no objects cut off. Rich moss greens, soft slate blue and warm terracotta, restrained warm late-summer light, believable stone textures, friendly hand-painted gouache texture for 11–12-year-olds. This is a fictional composite, not a reconstruction of named sites. No fantasy, fairy-tale towers, weapons, battles, modern objects, text, labels, frame, logos or watermark.

## Existing cards and integration

The bundled and legacy fixture inventories in [zam-os/zam at 1ff016c](https://github.com/zam-os/zam/tree/1ff016cfd7a0765c5338eb4248d0c14f3b92261c/tests/fixtures) contain no `de-by` cell for GPG in Mittelschule. Medieval history cells for Grade 7 Realschule and Gymnasium are outside the mapping. The mapping stays empty and the cell declares no transfers or retirements.

The Academy atlas registers the package under GPG and shows the learning-area scope in its title and description. The cell binds to `gpg`, Grade 6, `lb3`. When integrating it into the ZAM bundle, check that curriculum import still offers the other Grade 6 GPG learning areas.
