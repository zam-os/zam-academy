# Curriculum Coverage & Legacy Card Inventory · Geschichte 7 Gymnasium

- **Curriculum:** [LehrplanPLUS Bayern · Gymnasium · Geschichte 7](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geschichte) („Vom Mittelalter zum Absolutismus“), fetched live on 2026-11-26 with a browser User-Agent; SHA-256 `ad0bdc483f101c3af3c4cafbfad3337625ef2f12ac60c3a494f4787ab1926800`, snapshot in `geschichte-gymnasium-7/tests/fixtures/curriculum.html`.
- **Scope:** one Fachlehrplan for all Ausbildungsrichtungen, 7 Lernbereiche, ca. 56 hours. No lesson carries a track.
- **Package:** 41 lessons, 59 figures, 17 interactive models, 10 Kriterienkataloge, 82 ZAM cards (2 per lesson).

## Neighbouring grades

- **Grade 6 (`geschichte-gymnasium-6`):** the package builds on it explicitly („Wiederholung aus Jahrgangsstufe 6“) in four lessons: Ottonen (Frankenreich, 800), Limes (Raetien, Romanisierung), Dionysostheater (Polis, attische Demokratie) and Aachen (800 Kaiserkrönung). LehrplanPLUS lists Antike, Limes, Romanisierung, Provinz, Polis, Demokratie, 800 and 5. Jh. v. Chr. as *bekannte* Grundlegende Daten und Begriffe in Grade 7 LB 4 and LB 7, so they are revisited, not re-taught.
- **Grade 8:** Aufklärung, Französische Revolution, Napoleon and the 19th century stay out; the lesson tests reject these terms (`LATER_GRADE_RE`). Absolutism moved from the old Grade 8 to Grade 7 LB 6 in LehrplanPLUS and is taught here.
- **Realschule 7 (`geschichte-realschule-7`)** covers similar epochs for another school type; this package is a separate Gymnasium path with its own cell.

## Curriculum coverage (41 verbatim Kompetenzerwartungen → 41 lessons)

`node geschichte-gymnasium-7/scripts/check-curriculum.mjs` searches every `competence` in the normalised text of the fetched page: **41 rows, 0 not found; curriculum SHA-256 matches.** Querverweise and „Übergreifende Ziele“ inside the list items were stripped from the competence text. The Hanse/Fugger expectation is one row because the Fachlehrplan offers them as alternatives („… oder …“); the package teaches both.

| LB | Hours | Lessons | Rows | Interactive models |
| --- | --- | --- | --- | --- |
| 1 · König und Reich: Herrschaft im Mittelalter | ca. 7 Std. | 5 | 5 | `ottonenReich`, `investiturstreit`, `lehnswesen`, `kurfuerstenwahl` |
| 2 · Leben und Kultur im Mittelalter | ca. 10 Std. | 7 | 6 | `kathedrale`, `altstadt`, `pestKarte` |
| 3 · Neue räumliche und geistige Horizonte | ca. 11 Std. | 8 | 7 | `kreuzzugKarte`, `perspektive`, `entdeckerKarte` |
| 4 · Wirtschaft und Handel gestern und heute (Längsschnitt) | ca. 6 Std. | 5 | 6 | `hanseKarte` |
| 5 · Das konfessionelle Zeitalter | ca. 8 Std. | 7 | 7 | `reformationVerlauf`, `flugblatt`, `kriegsphasen` |
| 6 · Absolutismus und Barock | ca. 8 Std. | 5 | 6 | `versailles`, `balanceOfPower` |
| 7 · Bauwerke als Ausdruck politischen Denkens (Längsschnitt) | ca. 6 Std. | 4 | 4 | `bauwerkeVergleich` |

40 rows are `implemented`; one row is `supported`: LB 7 „analysieren Bauwerke … und präsentieren ihre Erkenntnisse, z. B. in einem mediengestützten Vortrag“ — the app prepares the analysis, the talk itself happens in class.

Lessons per row and the evidence for each row are in [`geschichte-gymnasium-7/coverage.json`](../geschichte-gymnasium-7/coverage.json).

### Lessons

| LB | Lesson id | Title |
| --- | --- | --- |
| 1 | `gg7-ostfranken-ottonen` | Vom Ostfrankenreich zum Reich der Ottonen |
| 1 | `gg7-otto-962-rechtfertigung` | 962: Wie Otto der Große seine Herrschaft rechtfertigte |
| 1 | `gg7-reichskirche-investiturstreit` | Reichskirche und Investiturstreit: Wer setzt die Bischöfe ein? |
| 1 | `gg7-reisekoenigtum-lehnswesen` | Reisekönigtum und Lehnswesen: Herrschen ohne Hauptstadt |
| 1 | `gg7-wahlkoenigtum-kurfuersten` | Wahlkönigtum, Kurfürsten und Territorien |
| 2 | `gg7-staende-grundherrschaft` | Stände und Grundherrschaft: Wer betet, wer kämpft, wer arbeitet? |
| 2 | `gg7-kloster` | Klöster: Gebet, Arbeit und Wissen |
| 2 | `gg7-staufer-hoefische-kultur` | Um 1200: Staufer, Ritter und höfische Kultur |
| 2 | `gg7-romanik-gotik` | Romanik und Gotik: Kirchen als steinerne Botschaft |
| 2 | `gg7-stadt-mittelalter` | Die Stadt im Mittelalter: Markt, Rat und Bürger |
| 2 | `gg7-juedisches-leben` | Jüdisches Leben in der mittelalterlichen Stadt |
| 2 | `gg7-pest-bedrohungen` | Der Schwarze Tod: Wie die Menschen der Pest begegneten |
| 3 | `gg7-kreuzzuege` | Die Kreuzzüge: Aufbruch nach Jerusalem |
| 3 | `gg7-kreuzzuege-quellen` | Zwei Seiten eines Krieges: christliche und muslimische Quellen |
| 3 | `gg7-kulturkontakt-weltbild` | Kulturkontakt: Wie sich das Weltbild der Europäer weitete |
| 3 | `gg7-konstantinopel-1453` | 1453: Fall oder Eroberung Konstantinopels? |
| 3 | `gg7-renaissance-humanismus` | Renaissance und Humanismus: Der Mensch im Mittelpunkt |
| 3 | `gg7-buchdruck` | Gutenbergs Buchdruck: Eine Medienrevolution |
| 3 | `gg7-entdeckungsfahrten` | 1492 und die Entdeckungsfahrten |
| 3 | `gg7-kolonialisierung` | Kolonialisierung und die Europäisierung der Welt |
| 4 | `gg7-limes-handel` | Handel und Kulturkontakt am Limes |
| 4 | `gg7-china-europa` | Weltmacht China zur Zeit des europäischen Mittelalters |
| 4 | `gg7-hanse` | Die Hanse: Ein Handelsnetz im Norden |
| 4 | `gg7-fugger` | Die Fugger: Frühkapitalismus aus Augsburg |
| 4 | `gg7-welthandel-heute` | Welthandel und Kulturkontakt heute |
| 5 | `gg7-umbruch-hexenverfolgung` | Umbruch und Krisen im 16. Jahrhundert – auch die Hexenverfolgung |
| 5 | `gg7-luther-reformation` | 1517: Martin Luther und der Beginn der Reformation |
| 5 | `gg7-flugblaetter-medienwandel` | Flugblätter: Bilderkampf und Medienwandel |
| 5 | `gg7-bauernkrieg` | Der Bauernkrieg 1525: Freiheit mit der Bibel begründet |
| 5 | `gg7-karl-v-spaltung` | Karl V. und die konfessionelle Spaltung des Reiches |
| 5 | `gg7-dreissigjaehriger-krieg` | 1618–1648: Der Dreißigjährige Krieg |
| 5 | `gg7-westfaelischer-friede` | Verwüstetes Land und der Westfälische Friede 1648 |
| 6 | `gg7-ludwig-xiv-staat` | Ludwig XIV.: Ein König ordnet Staat, Wirtschaft und Heer neu |
| 6 | `gg7-versailles` | Versailles: Ein Schloss als Abbild der Macht |
| 6 | `gg7-absolutismus-leitbild` | Absolutismus als Leitbild – und seine Problematik |
| 6 | `gg7-barock-bayern` | Versailles in Bayern: Schleißheim, Kempten und das französische Vorbild |
| 6 | `gg7-hegemonie-balance` | Hegemonie und „balance of power“ |
| 7 | `gg7-dionysostheater` | Das Dionysostheater: Bauen für die Bürger der Polis |
| 7 | `gg7-kaiserpfalz-aachen` | Die Kaiserpfalz Aachen: Thron zwischen Himmel und Volk |
| 7 | `gg7-wuerzburger-residenz` | Die Würzburger Residenz: Barocke Pracht eines Fürstbischofs |
| 7 | `gg7-reichstag-vergleich` | Die Reichstagskuppel: Das Volk steht über den Abgeordneten |

## Sources quoted in lessons

Three lessons show short source excerpts. All are medieval or early modern texts rendered freshly into simplified German for the app and labelled „gekürzt und vereinfacht ins Deutsche übertragen für diese App“; none copies a modern published translation:

- Widukind von Corvey, Sachsengeschichte II,1 (Krönung Ottos I. 936),
- Ibn al-Athir, Die vollständige Geschichte (Eroberung Jerusalems 1099),
- Jakob Fugger an Karl V. (April 1523).

The broadsheet in the `flugblatt` model is a strongly simplified drawing modelled on the *Passional Christi und Antichristi* (1521), labelled as such. No current statistics are given from memory; the Welthandel lesson sends learners to the Statistisches Bundesamt.

## Legacy ZAM card mapping (proposal, not approved)

`geschichte-gymnasium-7/replaces-de-by.json` has `"status": "proposal-only"` and `"approved": null`. The cell declares **no** `replaces` and **no** `retired_items`, so it needs no approval to publish (Thomas's default of 2026-10-22).

Source: `de-by:gymnasium-7-geschichte-mittelalter-frankenreich-staedte-kreuzzuege-reformation` (version 2026.08.1) from zam-os/zam commit `4aeaa8e3455937f8a53cd57e686ff98d602a0561`, byte-exact snapshot `tests/fixtures/de-by-gymnasium-7-geschichte-mittelalter-frankenreich-staedte-kreuzzuege-reformation-kvt.json`, SHA-256 `c7671e30d5731c2bce71d3420758c9c550425fb3f927fdc12c832a9ce609351a` (checked by `check-curriculum.mjs`).

| Old item | Old card (short) | Cat. | Proposed action | Successor |
| --- | --- | --- | --- | --- |
| `01K4H7M0000000000000000J01` | An welchem historischen Weihnachtstag wurde der Frankenkönig Karl der Große in Rom von Pap… | A | `propose-replace-after-approval` | `gg7-kaiserpfalz-aachen-check` |
| `01K4H7M0000000000000000J02` | Analysiere die Herrschaftsstrukturen des europäischen Mittelalters: 1. Das Frankenreich & … | C | `keep-active` | – |
| `01K4H7M0000000000000000J03` | Welche bahnbrechende Erfindung von Johannes Gutenberg um das Jahr 1450 ermöglichte die exp… | A | `propose-replace-after-approval` | `gg7-buchdruck-check` |
| `01K4H7M0000000000000000J04` | Analysiere den Übergang vom Hochmittelalter zur Frühen Neuzeit in 4 Dimensionen: 1. Die mi… | C | `keep-active` | – |

**Summary for Thomas: 2 A, 0 B, 2 C (kept active).** Reasons per row are in the JSON file.

### Questions for Thomas

1. **J01 (Kaiserkrönung 800):** the Grade 6 package left this item untouched (your decision of 2026-11-19). Grade 7 LB 7 lists „800 Kaiserkrönung Karls des Großen“ as a Grundlegendes Datum, so `gg7-kaiserpfalz-aachen-check` is proposed as its A successor. Do you agree that Grade 7 takes it over?
2. **J02 and J04** are multi-part syntheses whose parts are spread over many new cards; they stay active as C. As for Grade 6, you may prefer to remove the old cell from ZAM's bundled cells in the follow-up `academy:sync` instead of retiring items.
3. **Neighbouring Grade 8 cell** `de-by:gymnasium-8-geschichte-absolutismus-franzoesische-revolution-1848`: its item J02 combines Absolutismus (now Grade 7 LB 6) with the Aufklärung (Grade 8); J01 (Montesquieu) is Grade 8. No row is proposed here. Should Grade 7 take any of it over, or should it stay with a future Grade 8 package?

## Verified sources (203 URLs, checked 2026-11-26)

Every link was fetched once with `curl -sL -A "Mozilla/5.0 …"` and its real `<title>` read; the label in the app is that title. Fifteen first-choice URLs did not exist or redirected to a different article and were replaced before use (for example `Kolumbianischer_Austausch` instead of `Kolumbischer_Austausch`); two (Bamberg witch trials, Große Hungersnot) were dropped because no matching article was found. `digi.ub.uni-heidelberg.de` answers scripts and headless Chrome with a bot check, so `curl` cannot prove its title. On 2026-11-26 the page https://digi.ub.uni-heidelberg.de/diglit/cpg848 was opened in the in-app browser of the Claude desktop app; `document.title` read „Heidelberg, Universitätsbibliothek Heidelberg, Cod. Pal. germ. 848 Große Heidelberger Liederhandschrift (Codex Manesse) (Zürich, ca. 1300 bis ca. 1340)“, and the page text names the 2023 inscription in the UNESCO Memory of the World register. Teacher videos are not part of this initial version (AGENTS.md §4).

| Id | Label | URL |
| --- | --- | --- |
| `lehrplan` | LehrplanPLUS Bayern · Geschichte 7 Gymnasium | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geschichte |
| `wiki-ostfrankenreich` | Wikipedia · Ostfrankenreich | https://de.wikipedia.org/wiki/Ostfrankenreich |
| `wiki-ottonen` | Wikipedia · Liudolfinger | https://de.wikipedia.org/wiki/Ottonen |
| `wiki-heinrich-i` | Wikipedia · Heinrich I. (Ostfrankenreich) | https://de.wikipedia.org/wiki/Heinrich_I._(Ostfrankenreich) |
| `wiki-lechfeld` | Wikipedia · Schlacht auf dem Lechfeld | https://de.wikipedia.org/wiki/Schlacht_auf_dem_Lechfeld |
| `wiki-vertrag-verdun` | Wikipedia · Vertrag von Verdun | https://de.wikipedia.org/wiki/Vertrag_von_Verdun |
| `wiki-otto-i` | Wikipedia · Otto I. (HRR) | https://de.wikipedia.org/wiki/Otto_I._(HRR) |
| `klexikon-otto-i` | Klexikon · Otto der Große | https://klexikon.zum.de/wiki/Otto_der_Gro%C3%9Fe |
| `wiki-widukind` | Wikipedia · Widukind von Corvey | https://de.wikipedia.org/wiki/Widukind_von_Corvey |
| `wiki-salbung` | Wikipedia · Salbung | https://de.wikipedia.org/wiki/Salbung |
| `wiki-investiturstreit` | Wikipedia · Investiturstreit | https://de.wikipedia.org/wiki/Investiturstreit |
| `wiki-reichskirche` | Wikipedia · Reichskirche | https://de.wikipedia.org/wiki/Reichskirche |
| `wiki-canossa` | Wikipedia · Gang nach Canossa | https://de.wikipedia.org/wiki/Gang_nach_Canossa |
| `wiki-wormser-konkordat` | Wikipedia · Wormser Konkordat | https://de.wikipedia.org/wiki/Wormser_Konkordat |
| `wiki-heinrich-iv` | Wikipedia · Heinrich IV. (HRR) | https://de.wikipedia.org/wiki/Heinrich_IV._(HRR) |
| `wiki-lehnswesen` | Wikipedia · Lehnswesen | https://de.wikipedia.org/wiki/Lehnswesen |
| `klexikon-lehnswesen` | Klexikon · Feudalismus | https://klexikon.zum.de/wiki/Lehnswesen |
| `wiki-reisekoenigtum` | Wikipedia · Reisekönigtum | https://de.wikipedia.org/wiki/Reisek%C3%B6nigtum |
| `wiki-pfalz` | Wikipedia · Königspfalz | https://de.wikipedia.org/wiki/K%C3%B6nigspfalz |
| `wiki-kaiserpfalz-goslar` | Wikipedia · Kaiserpfalz Goslar | https://de.wikipedia.org/wiki/Kaiserpfalz_Goslar |
| `wiki-kurfuerst` | Wikipedia · Kurfürst | https://de.wikipedia.org/wiki/Kurf%C3%BCrst |
| `wiki-goldene-bulle` | Wikipedia · Goldene Bulle | https://de.wikipedia.org/wiki/Goldene_Bulle |
| `wiki-hrr` | Wikipedia · Heiliges Römisches Reich | https://de.wikipedia.org/wiki/Heiliges_R%C3%B6misches_Reich |
| `klexikon-hrr` | Klexikon · Heiliges Römisches Reich | https://klexikon.zum.de/wiki/Heiliges_R%C3%B6misches_Reich |
| `wiki-landesherrschaft` | Wikipedia · Landesherr | https://de.wikipedia.org/wiki/Landesherrschaft |
| `wiki-grundherrschaft` | Wikipedia · Grundherrschaft | https://de.wikipedia.org/wiki/Grundherrschaft |
| `wiki-staendeordnung` | Wikipedia · Stand (Gesellschaft) | https://de.wikipedia.org/wiki/St%C3%A4ndeordnung |
| `wiki-dreifelderwirtschaft` | Wikipedia · Dreifelderwirtschaft | https://de.wikipedia.org/wiki/Dreifelderwirtschaft |
| `klexikon-mittelalter` | Klexikon · Mittelalter | https://klexikon.zum.de/wiki/Mittelalter |
| `wiki-kloster` | Wikipedia · Kloster | https://de.wikipedia.org/wiki/Kloster |
| `klexikon-kloster` | Klexikon · Kloster | https://klexikon.zum.de/wiki/Kloster |
| `wiki-benediktsregel` | Wikipedia · Regula Benedicti | https://de.wikipedia.org/wiki/Regula_Benedicti |
| `wiki-st-galler-klosterplan` | Wikipedia · St. Galler Klosterplan | https://de.wikipedia.org/wiki/St._Galler_Klosterplan |
| `wiki-hildegard` | Wikipedia · Hildegard von Bingen | https://de.wikipedia.org/wiki/Hildegard_von_Bingen |
| `wiki-staufer` | Wikipedia · Staufer | https://de.wikipedia.org/wiki/Staufer |
| `wiki-barbarossa` | Wikipedia · Friedrich I. (HRR) | https://de.wikipedia.org/wiki/Friedrich_I._(HRR) |
| `wiki-codex-manesse` | Wikipedia · Codex Manesse | https://de.wikipedia.org/wiki/Codex_Manesse |
| `ub-heidelberg-manesse` | Universitätsbibliothek Heidelberg · Codex Manesse (Cod. Pal. germ. 848) | https://digi.ub.uni-heidelberg.de/diglit/cpg848 |
| `klexikon-ritter` | Klexikon · Ritter | https://klexikon.zum.de/wiki/Ritter |
| `wiki-minnesang` | Wikipedia · Minnesang | https://de.wikipedia.org/wiki/Minnesang |
| `wiki-romanik` | Wikipedia · Romanik | https://de.wikipedia.org/wiki/Romanik |
| `wiki-gotik` | Wikipedia · Gotik | https://de.wikipedia.org/wiki/Gotik |
| `klexikon-gotik` | Klexikon · Gotik | https://klexikon.zum.de/wiki/Gotik |
| `wiki-speyerer-dom` | Wikipedia · Speyerer Dom | https://de.wikipedia.org/wiki/Speyerer_Dom |
| `wiki-koelner-dom` | Wikipedia · Kölner Dom | https://de.wikipedia.org/wiki/K%C3%B6lner_Dom |
| `wiki-mittelalterliche-stadt` | Wikipedia · Stadt | https://de.wikipedia.org/wiki/Stadt |
| `klexikon-stadt` | Klexikon · Stadt | https://klexikon.zum.de/wiki/Stadt |
| `wiki-stadtrecht` | Wikipedia · Stadtrecht | https://de.wikipedia.org/wiki/Stadtrecht |
| `wiki-reichsstadt` | Wikipedia · Freie und Reichsstädte | https://de.wikipedia.org/wiki/Reichsstadt |
| `wiki-zunft` | Wikipedia · Zunft | https://de.wikipedia.org/wiki/Zunft |
| `wiki-schum` | Wikipedia · SchUM-Städte | https://de.wikipedia.org/wiki/SchUM-St%C3%A4dte |
| `wiki-ghetto` | Wikipedia · Ghetto | https://de.wikipedia.org/wiki/Ghetto |
| `wiki-judengasse-frankfurt` | Wikipedia · Frankfurter Judengasse | https://de.wikipedia.org/wiki/Frankfurter_Judengasse |
| `klexikon-judentum` | Klexikon · Judentum | https://klexikon.zum.de/wiki/Judentum |
| `wiki-pestpogrome` | Wikipedia · Judenverfolgungen zur Zeit des Schwarzen Todes | https://de.wikipedia.org/wiki/Pestpogrome |
| `wiki-schwarzer-tod` | Wikipedia · Schwarzer Tod | https://de.wikipedia.org/wiki/Schwarzer_Tod |
| `klexikon-pest` | Klexikon · Pest | https://klexikon.zum.de/wiki/Pest |
| `wiki-geissler` | Wikipedia · Flagellanten | https://de.wikipedia.org/wiki/Flagellanten |
| `wiki-quarantaene` | Wikipedia · Quarantäne | https://de.wikipedia.org/wiki/Quarant%C3%A4ne |
| `wiki-kreuzzuege` | Wikipedia · Kreuzzug | https://de.wikipedia.org/wiki/Kreuzzug |
| `klexikon-kreuzzug` | Klexikon · Kreuzzug | https://klexikon.zum.de/wiki/Kreuzzug |
| `wiki-erster-kreuzzug` | Wikipedia · Erster Kreuzzug | https://de.wikipedia.org/wiki/Erster_Kreuzzug |
| `wiki-urban-ii` | Wikipedia · Urban II. | https://de.wikipedia.org/wiki/Urban_II. |
| `wiki-saladin` | Wikipedia · Saladin | https://de.wikipedia.org/wiki/Saladin |
| `wiki-eroberung-jerusalem-1099` | Wikipedia · Belagerung von Jerusalem (1099) | https://de.wikipedia.org/wiki/Eroberung_von_Jerusalem_(1099) |
| `wiki-fulcher` | Wikipedia · Fulcher von Chartres | https://de.wikipedia.org/wiki/Fulcher_von_Chartres |
| `wiki-ibn-al-athir` | Wikipedia · Ibn al-Athīr | https://de.wikipedia.org/wiki/Ibn_al-Athir |
| `wiki-usama-ibn-munqidh` | Wikipedia · Usama ibn Munqidh | https://de.wikipedia.org/wiki/Usama_ibn_Munqidh |
| `wiki-uebersetzerschule-toledo` | Wikipedia · Übersetzerschule von Toledo | https://de.wikipedia.org/wiki/%C3%9Cbersetzerschule_von_Toledo |
| `wiki-avicenna` | Wikipedia · Avicenna | https://de.wikipedia.org/wiki/Avicenna |
| `wiki-fibonacci` | Wikipedia · Leonardo Fibonacci | https://de.wikipedia.org/wiki/Leonardo_Fibonacci |
| `wiki-marco-polo` | Wikipedia · Marco Polo | https://de.wikipedia.org/wiki/Marco_Polo |
| `klexikon-marco-polo` | Klexikon · Marco Polo | https://klexikon.zum.de/wiki/Marco_Polo |
| `wiki-eroberung-konstantinopel` | Wikipedia · Eroberung von Konstantinopel (1453) | https://de.wikipedia.org/wiki/Eroberung_von_Konstantinopel_(1453) |
| `wiki-mehmed-ii` | Wikipedia · Mehmed II. | https://de.wikipedia.org/wiki/Mehmed_II. |
| `wiki-hagia-sophia` | Wikipedia · Hagia Sophia | https://de.wikipedia.org/wiki/Hagia_Sophia |
| `wiki-byzantinisches-reich` | Wikipedia · Byzantinisches Reich | https://de.wikipedia.org/wiki/Byzantinisches_Reich |
| `wiki-renaissance` | Wikipedia · Renaissance | https://de.wikipedia.org/wiki/Renaissance |
| `klexikon-renaissance` | Klexikon · Renaissance | https://klexikon.zum.de/wiki/Renaissance |
| `wiki-humanismus` | Wikipedia · Humanismus | https://de.wikipedia.org/wiki/Humanismus |
| `wiki-zentralperspektive` | Wikipedia · Perspektive | https://de.wikipedia.org/wiki/Perspektive |
| `wiki-leonardo` | Wikipedia · Leonardo da Vinci | https://de.wikipedia.org/wiki/Leonardo_da_Vinci |
| `wiki-behaim-globus` | Wikipedia · Behaim-Globus | https://de.wikipedia.org/wiki/Behaim-Globus |
| `wiki-buchdruck` | Wikipedia · Buchdruck | https://de.wikipedia.org/wiki/Buchdruck |
| `klexikon-buchdruck` | Klexikon · Buchdruck | https://klexikon.zum.de/wiki/Buchdruck |
| `wiki-gutenberg` | Wikipedia · Johannes Gutenberg | https://de.wikipedia.org/wiki/Johannes_Gutenberg |
| `wiki-gutenberg-bibel` | Wikipedia · Gutenberg-Bibel | https://de.wikipedia.org/wiki/Gutenberg-Bibel |
| `gutenberg-museum` | Gutenberg-Museum Mainz | https://www.gutenberg-museum.de/ |
| `wiki-zeitalter-entdeckungen` | Wikipedia · Zeitalter der Entdeckungen | https://de.wikipedia.org/wiki/Zeitalter_der_Entdeckungen |
| `klexikon-kolumbus` | Klexikon · Christoph Kolumbus | https://klexikon.zum.de/wiki/Christoph_Kolumbus |
| `wiki-kolumbus` | Wikipedia · Christoph Kolumbus | https://de.wikipedia.org/wiki/Christoph_Kolumbus |
| `wiki-vasco-da-gama` | Wikipedia · Vasco da Gama | https://de.wikipedia.org/wiki/Vasco_da_Gama |
| `wiki-magellan` | Wikipedia · Ferdinand Magellan | https://de.wikipedia.org/wiki/Ferdinand_Magellan |
| `wiki-karavelle` | Wikipedia · Karavelle | https://de.wikipedia.org/wiki/Karavelle |
| `wiki-kolonialismus` | Wikipedia · Kolonialismus | https://de.wikipedia.org/wiki/Kolonialismus |
| `wiki-kolumbianischer-austausch` | Wikipedia · Columbian Exchange | https://de.wikipedia.org/wiki/Kolumbianischer_Austausch |
| `wiki-cortes` | Wikipedia · Hernán Cortés | https://de.wikipedia.org/wiki/Hern%C3%A1n_Cort%C3%A9s |
| `wiki-las-casas` | Wikipedia · Bartolomé de Las Casas | https://de.wikipedia.org/wiki/Bartolom%C3%A9_de_las_Casas |
| `wiki-atlantischer-sklavenhandel` | Wikipedia · Atlantischer Sklavenhandel | https://de.wikipedia.org/wiki/Atlantischer_Sklavenhandel |
| `klexikon-kolonie` | Klexikon · Kolonie | https://klexikon.zum.de/wiki/Kolonie |
| `wiki-limes` | Wikipedia · Obergermanisch-Raetischer Limes | https://de.wikipedia.org/wiki/Obergermanisch-Raetischer_Limes |
| `klexikon-limes` | Klexikon · Limes | https://klexikon.zum.de/wiki/Limes |
| `wiki-limestor-dalkingen` | Wikipedia · Limestor Dalkingen | https://de.wikipedia.org/wiki/Limestor_Dalkingen |
| `wiki-romanisierung` | Wikipedia · Romanisierung | https://de.wikipedia.org/wiki/Romanisierung |
| `wiki-lehnwort` | Wikipedia · Lehnwort | https://de.wikipedia.org/wiki/Lehnwort |
| `wiki-song-dynastie` | Wikipedia · Song-Dynastie | https://de.wikipedia.org/wiki/Song-Dynastie |
| `wiki-zheng-he` | Wikipedia · Zheng He | https://de.wikipedia.org/wiki/Zheng_He |
| `wiki-bi-sheng` | Wikipedia · Bi Sheng | https://de.wikipedia.org/wiki/Bi_Sheng |
| `klexikon-china` | Klexikon · China | https://klexikon.zum.de/wiki/China |
| `wiki-hangzhou` | Wikipedia · Hangzhou | https://de.wikipedia.org/wiki/Hangzhou |
| `wiki-hanse` | Wikipedia · Hanse | https://de.wikipedia.org/wiki/Hanse |
| `klexikon-hanse` | Klexikon · Hanse | https://klexikon.zum.de/wiki/Hanse |
| `wiki-kogge` | Wikipedia · Kogge | https://de.wikipedia.org/wiki/Kogge |
| `wiki-stalhof` | Wikipedia · Stalhof | https://de.wikipedia.org/wiki/Stalhof |
| `hansemuseum` | Europäisches Hansemuseum Lübeck | https://www.hansemuseum.eu/ |
| `wiki-fugger` | Wikipedia · Fugger | https://de.wikipedia.org/wiki/Fugger |
| `wiki-jakob-fugger` | Wikipedia · Jakob Fugger | https://de.wikipedia.org/wiki/Jakob_Fugger |
| `wiki-fuggerei` | Wikipedia · Fuggerei | https://de.wikipedia.org/wiki/Fuggerei |
| `wiki-fruehkapitalismus` | Wikipedia · Frühkapitalismus | https://de.wikipedia.org/wiki/Fr%C3%BChkapitalismus |
| `fugger-de` | Offizielle Website der Fugger | https://www.fugger.de/ |
| `destatis-aussenhandel` | Statistisches Bundesamt · Aktuelle Daten zum deutschen Außenhandel | https://www.destatis.de/DE/Themen/Wirtschaft/Aussenhandel/_inhalt.html |
| `wiki-globalisierung` | Wikipedia · Globalisierung | https://de.wikipedia.org/wiki/Globalisierung |
| `klexikon-globalisierung` | Klexikon · Globalisierung | https://klexikon.zum.de/wiki/Globalisierung |
| `wiki-fairer-handel` | Wikipedia · Fairer Handel | https://de.wikipedia.org/wiki/Fairer_Handel |
| `wiki-containerschiff` | Wikipedia · Containerschiff | https://de.wikipedia.org/wiki/Containerschiff |
| `wiki-hexenverfolgung` | Wikipedia · Hexenverfolgung | https://de.wikipedia.org/wiki/Hexenverfolgung |
| `klexikon-hexe` | Klexikon · Hexe | https://klexikon.zum.de/wiki/Hexe |
| `wiki-kleine-eiszeit` | Wikipedia · Kleine Eiszeit | https://de.wikipedia.org/wiki/Kleine_Eiszeit |
| `wiki-friedrich-spee` | Wikipedia · Friedrich Spee | https://de.wikipedia.org/wiki/Friedrich_Spee |
| `wiki-reformation` | Wikipedia · Reformation | https://de.wikipedia.org/wiki/Reformation |
| `klexikon-reformation` | Klexikon · Reformation | https://klexikon.zum.de/wiki/Reformation |
| `wiki-luther` | Wikipedia · Martin Luther | https://de.wikipedia.org/wiki/Martin_Luther |
| `klexikon-luther` | Klexikon · Martin Luther | https://klexikon.zum.de/wiki/Martin_Luther |
| `wiki-95-thesen` | Wikipedia · 95 Thesen | https://de.wikipedia.org/wiki/95_Thesen |
| `wiki-reichstag-worms-1521` | Wikipedia · Reichstag zu Worms (1521) | https://de.wikipedia.org/wiki/Reichstag_zu_Worms_(1521) |
| `wiki-flugblatt` | Wikipedia · Flugblatt | https://de.wikipedia.org/wiki/Flugblatt |
| `wiki-flugschrift` | Wikipedia · Flugschrift | https://de.wikipedia.org/wiki/Flugschrift |
| `wiki-cranach` | Wikipedia · Lucas Cranach der Ältere | https://de.wikipedia.org/wiki/Lucas_Cranach_der_%C3%84ltere |
| `wiki-relation-zeitung` | Wikipedia · Relation aller Fürnemmen und gedenckwürdigen Historien | https://de.wikipedia.org/wiki/Relation_aller_F%C3%BCrnemmen_und_gedenckw%C3%BCrdigen_Historien |
| `klexikon-zeitung` | Klexikon · Zeitung | https://klexikon.zum.de/wiki/Zeitung |
| `wiki-bauernkrieg` | Wikipedia · Deutscher Bauernkrieg | https://de.wikipedia.org/wiki/Deutscher_Bauernkrieg |
| `klexikon-bauernkrieg` | Klexikon · Bauernkriege | https://klexikon.zum.de/wiki/Bauernkrieg |
| `wiki-zwoelf-artikel` | Wikipedia · Zwölf Artikel | https://de.wikipedia.org/wiki/Zw%C3%B6lf_Artikel |
| `wiki-thomas-muentzer` | Wikipedia · Thomas Müntzer | https://de.wikipedia.org/wiki/Thomas_M%C3%BCntzer |
| `wiki-schlacht-frankenhausen` | Wikipedia · Schlacht bei Frankenhausen | https://de.wikipedia.org/wiki/Schlacht_bei_Frankenhausen |
| `wiki-karl-v` | Wikipedia · Karl V. (HRR) | https://de.wikipedia.org/wiki/Karl_V._(HRR) |
| `klexikon-karl-v` | Klexikon · Karl der Fünfte | https://klexikon.zum.de/wiki/Karl_der_F%C3%BCnfte |
| `wiki-augsburger-religionsfriede` | Wikipedia · Augsburger Reichs- und Religionsfrieden | https://de.wikipedia.org/wiki/Augsburger_Reichs-_und_Religionsfrieden |
| `wiki-schmalkaldischer-krieg` | Wikipedia · Schmalkaldischer Krieg | https://de.wikipedia.org/wiki/Schmalkaldischer_Krieg |
| `wiki-dreissigjaehriger-krieg` | Wikipedia · Dreißigjähriger Krieg | https://de.wikipedia.org/wiki/Drei%C3%9Figj%C3%A4hriger_Krieg |
| `klexikon-dreissigjaehriger-krieg` | Klexikon · Dreißigjähriger Krieg | https://klexikon.zum.de/wiki/Drei%C3%9Figj%C3%A4hriger_Krieg |
| `wiki-prager-fenstersturz` | Wikipedia · Prager Fenstersturz | https://de.wikipedia.org/wiki/Prager_Fenstersturz |
| `wiki-wallenstein` | Wikipedia · Albrecht von Wallenstein | https://de.wikipedia.org/wiki/Albrecht_von_Wallenstein |
| `wiki-gustav-adolf` | Wikipedia · Gustav II. Adolf | https://de.wikipedia.org/wiki/Gustav_II._Adolf |
| `wiki-maximilian-i-bayern` | Wikipedia · Maximilian I. (Bayern) | https://de.wikipedia.org/wiki/Maximilian_I._(Bayern) |
| `wiki-westfaelischer-friede` | Wikipedia · Westfälischer Friede | https://de.wikipedia.org/wiki/Westf%C3%A4lischer_Friede |
| `wiki-rathaus-muenster` | Wikipedia · Rathaus Münster | https://de.wikipedia.org/wiki/Historisches_Rathaus_M%C3%BCnster |
| `wiki-simplicissimus` | Wikipedia · Der abenteuerliche Simplicissimus | https://de.wikipedia.org/wiki/Der_abenteuerliche_Simplicissimus |
| `wiki-magdeburger-hochzeit` | Wikipedia · Magdeburger Hochzeit | https://de.wikipedia.org/wiki/Magdeburger_Hochzeit |
| `wiki-absolutismus` | Wikipedia · Absolutismus | https://de.wikipedia.org/wiki/Absolutismus |
| `klexikon-absolutismus` | Klexikon · Absolutismus | https://klexikon.zum.de/wiki/Absolutismus |
| `wiki-ludwig-xiv` | Wikipedia · Ludwig XIV. | https://de.wikipedia.org/wiki/Ludwig_XIV. |
| `wiki-merkantilismus` | Wikipedia · Merkantilismus | https://de.wikipedia.org/wiki/Merkantilismus |
| `wiki-colbert` | Wikipedia · Jean-Baptiste Colbert | https://de.wikipedia.org/wiki/Jean-Baptiste_Colbert |
| `wiki-stehendes-heer` | Wikipedia · Stehendes Heer | https://de.wikipedia.org/wiki/Stehendes_Heer |
| `wiki-versailles` | Wikipedia · Schloss Versailles | https://de.wikipedia.org/wiki/Schloss_Versailles |
| `klexikon-versailles` | Klexikon · Schloss Versailles | https://klexikon.zum.de/wiki/Schloss_Versailles |
| `wiki-spiegelsaal` | Wikipedia · Spiegelsaal von Versailles | https://de.wikipedia.org/wiki/Spiegelsaal_von_Versailles |
| `wiki-le-notre` | Wikipedia · André Le Nôtre | https://de.wikipedia.org/wiki/Andr%C3%A9_Le_N%C3%B4tre |
| `wiki-barock` | Wikipedia · Barock | https://de.wikipedia.org/wiki/Barock |
| `wiki-gottesgnadentum` | Wikipedia · Gottesgnadentum | https://de.wikipedia.org/wiki/Gottesgnadentum |
| `wiki-edikt-fontainebleau` | Wikipedia · Edikt von Fontainebleau | https://de.wikipedia.org/wiki/Edikt_von_Fontainebleau |
| `wiki-hugenotten` | Wikipedia · Hugenotten | https://de.wikipedia.org/wiki/Hugenotten |
| `wiki-generalstaende` | Wikipedia · Generalstände | https://de.wikipedia.org/wiki/Generalst%C3%A4nde |
| `wiki-monarchie` | Wikipedia · Monarchie | https://de.wikipedia.org/wiki/Monarchie |
| `wiki-schleissheim` | Wikipedia · Schlossanlage Schleißheim | https://de.wikipedia.org/wiki/Neues_Schloss_Schlei%C3%9Fheim |
| `schloesser-schleissheim` | Bayerische Schlösserverwaltung · Schlossanlage Schleißheim | https://www.schloesser-schleissheim.de/ |
| `wiki-max-emanuel` | Wikipedia · Maximilian II. Emanuel (Bayern) | https://de.wikipedia.org/wiki/Maximilian_II._Emanuel_(Bayern) |
| `wiki-residenz-kempten` | Wikipedia · Fürstäbtliche Residenz | https://de.wikipedia.org/wiki/Residenz_Kempten |
| `wiki-nymphenburg` | Wikipedia · Schloss Nymphenburg | https://de.wikipedia.org/wiki/Schloss_Nymphenburg |
| `wiki-hegemonie` | Wikipedia · Hegemonie | https://de.wikipedia.org/wiki/Hegemonie |
| `wiki-gleichgewicht-maechte` | Wikipedia · Mächtegleichgewicht | https://de.wikipedia.org/wiki/Gleichgewicht_der_Kr%C3%A4fte |
| `wiki-spanischer-erbfolgekrieg` | Wikipedia · Spanischer Erbfolgekrieg | https://de.wikipedia.org/wiki/Spanischer_Erbfolgekrieg |
| `wiki-pfaelzischer-erbfolgekrieg` | Wikipedia · Pfälzischer Erbfolgekrieg | https://de.wikipedia.org/wiki/Pf%C3%A4lzischer_Erbfolgekrieg |
| `wiki-frieden-utrecht` | Wikipedia · Friede von Utrecht | https://de.wikipedia.org/wiki/Frieden_von_Utrecht |
| `wiki-dionysostheater` | Wikipedia · Dionysostheater | https://de.wikipedia.org/wiki/Dionysostheater |
| `wiki-theater-griechische-antike` | Wikipedia · Theater der griechischen Antike | https://de.wikipedia.org/wiki/Theater_der_griechischen_Antike |
| `wiki-dionysien` | Wikipedia · Dionysien | https://de.wikipedia.org/wiki/Dionysien |
| `wiki-attische-demokratie` | Wikipedia · Attische Demokratie | https://de.wikipedia.org/wiki/Attische_Demokratie |
| `wiki-aachener-dom` | Wikipedia · Aachener Dom | https://de.wikipedia.org/wiki/Aachener_Dom |
| `wiki-aachener-rathaus` | Wikipedia · Aachener Rathaus | https://de.wikipedia.org/wiki/Aachener_Rathaus |
| `wiki-karlsthron` | Wikipedia · Aachener Königsthron | https://de.wikipedia.org/wiki/Karlsthron |
| `aachener-dom-site` | Aachener Dom · UNESCO-Welterbe | https://www.aachenerdom.de/ |
| `klexikon-karl-der-grosse` | Klexikon · Karl der Große | https://klexikon.zum.de/wiki/Karl_der_Gro%C3%9Fe |
| `wiki-wuerzburger-residenz` | Wikipedia · Würzburger Residenz | https://de.wikipedia.org/wiki/W%C3%BCrzburger_Residenz |
| `residenz-wuerzburg` | Bayerische Schlösserverwaltung · Residenz Würzburg | https://www.residenz-wuerzburg.de/ |
| `wiki-tiepolo` | Wikipedia · Giovanni Battista Tiepolo | https://de.wikipedia.org/wiki/Giovanni_Battista_Tiepolo |
| `wiki-balthasar-neumann` | Wikipedia · Balthasar Neumann | https://de.wikipedia.org/wiki/Balthasar_Neumann |
| `wiki-aristokratie` | Wikipedia · Aristokratie | https://de.wikipedia.org/wiki/Aristokratie |
| `bundestag-kuppel` | Deutscher Bundestag · Die Kuppel | https://www.bundestag.de/besuche/architektur/reichstag/kuppel |
| `wiki-reichstagsgebaeude` | Wikipedia · Reichstagsgebäude | https://de.wikipedia.org/wiki/Reichstagsgeb%C3%A4ude |
| `wiki-bundeskanzleramt` | Wikipedia · Bundeskanzleramt (Berlin) | https://de.wikipedia.org/wiki/Bundeskanzleramt_(Berlin) |
| `klexikon-bundestag` | Klexikon · Bundestag | https://klexikon.zum.de/wiki/Bundestag |
