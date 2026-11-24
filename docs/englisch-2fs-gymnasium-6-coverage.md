# Englisch 6 Gymnasium (2. Fremdsprache): Lehrplan und Kartenbestand

Geprüft am 24. November 2026.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 6 – Englisch (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/2-fremdsprache), live abgerufen mit `curl -sL --compressed -A "Mozilla/5.0"` (HTTP 200, Titel „LehrplanPLUS - Gymnasium - 6 - Englisch - Fachlehrpläne“, Überschrift „Fachlehrplan Englisch 6 (2. Fremdsprache)“).
- **Gespeicherte Seite:** [`englisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-e6-2fs.html`](../englisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-e6-2fs.html)
- **SHA-256:** `e89029c6804747de18c4198122bba40149902bfdd80346c253c189b4f5e56024` – identisch mit dem Nachbarschnappschuss, den `englisch-gymnasium-6` am 18. November 2026 gespeichert hat.
- **Struktur:** ein gemeinsamer Fachlehrplan für alle Ausbildungsrichtungen, erstes Lernjahr Englisch am Gymnasium nach dem Englisch der Grundschule; keine Stunden pro Lernbereich angegeben. Atlas-Zelle: `englisch-2fs`, Klasse 6 ([docs/zweite-fremdsprache-atlas.md](zweite-fremdsprache-atlas.md)).
- **Matrix:** [`englisch-2fs-gymnasium-6/coverage.json`](../englisch-2fs-gymnasium-6/coverage.json) enthält alle `39` Zeilen (`E6F-01`–`E6F-39`): die 30 übergeordneten Kompetenzerwartungen der Lernbereiche 1–5 (`LB 1.1`: 11, `LB 1.2`: 8, `LB 2`: 3, `LB 3`: 5, `LB 4`: 3) und die zwei Kompetenzerwartungen sowie sieben Themenblöcke von `LB 5`. Davon sind `22` `implemented` und `17` `supported`. Die Texte wurden mit derselben Normalisierung wie [`check-curriculum.mjs`](../englisch-2fs-gymnasium-6/scripts/check-curriculum.mjs) aus der gespeicherten Seite geschnitten; das Skript findet jede `competence` wörtlich (`39 curriculum rows, 0 not found`, auch mit U+2011 in „Hör‑/Hörsehverstehens“ und „‑er“). Die `bindings` jeder Lektion leitet der Test aus der Matrix ab und vergleicht sie.

### Geprüfte Nachbarlehrpläne

- **Grundschule 3/4 Englisch (zweistündig):** [`lehrplanplus-gs34.html`](../englisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-gs34.html), SHA-256 `ebc4ab35274ac3306497f4624cc4e5505179de07718ad3000529d2cda9e71bdf` (identisch mit dem Schnappschuss in `englisch-gymnasium-5`). Der Plan der 2. Fremdsprache baut ausdrücklich darauf auf („aufbauend auf den Vorkenntnissen aus der Grundschule“); das Paket wiederholt daher Grundwortschatz (Zahlen, Uhrzeit, Familie, Kleidung) nur als Einstieg in die Gymnasialgrammatik.
- **Jahrgangsstufe 6 – 1. Fremdsprache:** [`lehrplanplus-e6.html`](../englisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-e6.html), SHA-256 `35684fbe52bba27222d0f8de828afa6ec3078356d6284e0b8914c6bcd985e0ca`. Eigener Lernpfad im dritten Lernjahr (Paket `englisch-gymnasium-6`); will-future, Steigerung, Relativsätze und present perfect gehören nicht hierher.
- **Jahrgangsstufe 7 – 2. Fremdsprache:** [`lehrplanplus-e7-2fs.html`](../englisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-e7-2fs.html), SHA-256 `e66b2c2d4a923fd266a05e26aae2aad7932d65487ec1e8601b89682567592df7`. Weitere indefinite Begleiter, Adjektive und Adverbien mit Steigerung, Reflexivpronomen, although/so that/while, Relativsätze und contact clauses, one(s), Possessivpronomen, resultatives present perfect, past progressive, will- und timetable-future, could/may/might/should mit Ersatzformen und Konditionalsatz I sowie Cornwall oder Lake District, Florida oder Rocky Mountains, Kelten, Römer und 1066 bleiben in Jahrgang 7. Ein Test (`keeps Grade 7 … targets out`) prüft das.

## Was die App umsetzt und was außerhalb bleibt

- **`implemented` (22 Zeilen):** Leseverstehen, Schreiben und Rechtschreibung, schriftliche Sprachmittlung, Wortschatz mit allen genannten Feldern und fehlerträchtigen Wendungen, classroom phrases und Bildbeschreibung, alle drei Grammatik-Kompetenzen mit jedem Unterpunkt, Orientierungswissen UK/USA, soziale Formeln, Informationsentnahme und Texte zu Bildvorlagen, Lese- und Hörstrategien mit Wortbildung (un-, re-, -er), die beiden Kompetenzerwartungen von LB 5 und sechs der sieben Themenblöcke. Jede Lektion hat Erklärung mit Merke-Kasten, eine interaktive Werkstatt mit drei Zielen (keines zu Beginn erreicht, jedes per Test erreichbar), Schnellcheck, zwei Kurzaufgaben und Aufgaben auf zwei Stufen mit Selbsteinschätzung.
- **`supported` (17 Zeilen):** Hör- und Hörsehverstehen mit echten Aufnahmen (`E6F-01`, `E6F-02`), lautes Lesen (`E6F-04`), Sprechen, Gespräche und Erzählen (`E6F-05`–`E6F-07`), spontanes mündliches Mitteln (`E6F-10`), individueller Wortschatz (`E6F-13`), Aussprache und Lautschrift mit Hörbeispielen (`E6F-18`, `E6F-19`), Haltung gegenüber anderen Kulturen (`E6F-21`), Hörseh- und Lesetexte wie Speisekarten, Rezepte und Lektüren (`E6F-23`), kreativer Umgang und szenisches Spiel (`E6F-26`), Filmsequenzen (`E6F-27`), Lernorganisation und Lehrwerknutzung (`E6F-28`, `E6F-30`) und aktuelle Anlässe (`E6F-37`). Die App bereitet vor (lokale Hörskripte mit Computerstimme oder Partner-Vorlesemodus, Redemittel, Musterlösungen), bewertet aber kein Sprechen und nimmt nichts auf.

## Geprüfte Quellen

Alle Quellen in [`englisch-2fs-gymnasium-6/source-checks.json`](../englisch-2fs-gymnasium-6/source-checks.json) wurden am 24. November 2026 mit `curl -sL --compressed -A "Mozilla/5.0" <url> | grep -o "<title[^>]*>[^<]*"` abgerufen; alle 26 Wikipedia-Seiten antworteten mit HTTP 200 und dem eingetragenen Titel. Die Zahlen und Fakten der Lektionen wurden im Text dieser Seiten gesucht und gefunden: St David's Day am 1. März, St Patrick's Day am 17. März (Feiertag in Irland und Nordirland), Guy Fawkes Night mit den Ereignissen des 5. November 1605, Boxing Day am 26. Dezember; Hauptstädte Edinburgh, Cardiff und Belfast und der EU-Austritt des UK 2020; Big Ben als „Great Bell“ im Elizabeth Tower, die Kronjuwelen im Tower of London, die Klappbrücke Tower Bridge, Buckingham Palace als „official residence“ des Monarchen mit Changing of the Guard, das London Eye am South Bank; 48 zusammenhängende Staaten, Alaska an der Grenze zu Kanada (Yukon, British Columbia), Kanada als zweitgrößtes Land mit Englisch und Französisch und der Hauptstadt Ottawa; Washington, D.C. als Bezirk außerhalb jedes Bundesstaats, das White House als Wohn- und Arbeitssitz des Präsidenten, die National Mall vom Lincoln Memorial über das Washington Monument zum Capitol, die Statue of Liberty als Geschenk Frankreichs (eingeweiht am 28. Oktober 1886), die Eröffnung des Empire State Building 1931; „Twinkle, Twinkle, Little Star“ von Jane Taylor, veröffentlicht 1806; Year 7 in England für Kinder von 11 bis 12 Jahren. Dass die Museen der National Mall kostenlos seien, stand nicht auf der Seite; die Lektion sagt es deshalb nicht. Telefonnummern im Übungsmaterial stammen aus den Ofcom-Bereichen für Film und Fernsehen (0161 496 0xxx, 07700 900xxx).

| Seite | Abgerufener `<title>` |
| --- | --- |
| Englisch als Weltsprache | English language - Wikipedia |
| Schule in England | Year 7 - Wikipedia; School uniforms in England - Wikipedia |
| Feste | Guy Fawkes Night / Boxing Day / Saint David's Day / Saint Patrick's Day - Wikipedia |
| Britische Inseln | British Isles - Wikipedia; United Kingdom - Wikipedia |
| London | Big Ben / London Eye / Tower of London / Tower Bridge / Buckingham Palace - Wikipedia |
| Nordamerika | Contiguous United States / Alaska / Hawaii / Canada - Wikipedia |
| Washington und New York | Washington, D.C. / White House / National Mall / Statue of Liberty / Empire State Building / Central Park - Wikipedia |
| Lautschrift | International Phonetic Alphabet - Wikipedia |
| Kinderreim | Twinkle, Twinkle, Little Star - Wikipedia |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4).

## ZAM-Zelle und Alt-Kartenbestand

- **Zelle:** [`englisch-2fs-gymnasium-6/cell.json`](../englisch-2fs-gymnasium-6/cell.json), `zam-academy:englisch-2fs-gymnasium-6`, Version `2026.11.1`: `43` Atome (eines pro Lektion) und `129` Karten (`43` Tier-1-Karten mit binärem `fast_check`, `86` Tier-2-Karten mit `sample_solution`). Die IDs sind echte ULIDs, einmal gezogen; Atome und Karten sind in `tests/fixtures/public-contract.json` festgeschrieben. Voraussetzungen zeigen nur auf frühere Lektionen des Lernpfads (Test).
- **Lehrplanbindung:** `provider: lehrplanplus-bayern`, `school_type: gymnasium`, `grade: 6`, `subject: englisch-2fs`, `topic_code: lb1.1` … `lb5`, ohne `track`. Der Fachname folgt der Atlas-Zelle `englisch-2fs`, damit die Karten nicht mit Englisch 6 als 1. Fremdsprache (`subject: englisch`) zusammenfallen. Die `domain` bleibt `englisch/<Etappe>`, damit der ZAM-Atlas die Englisch-Farbe verwendet.
- **Inventar:** In `zam-os/zam` (Commit `67e190c2b7e5282851dfdd60ce21b69ed373dfa9`, `main` am 24. November 2026) gibt es keine `de-by`-Zelle für Englisch als 2. Fremdsprache. Die Gymnasium-Englischzellen der Nachbarjahre sind bereits zugeordnet: `de-by:gymnasium-5-englisch-starter-grammar-tenses` durch `englisch-gymnasium-5`, `de-by:gymnasium-6-englisch-past-tenses-present-perfect-adjectives` durch `englisch-gymnasium-6`, `de-by:gymnasium-7-englisch-grammar-present-perfect-modals-conditionals` durch `englisch-gymnasium-7`. Damit keine Karte von zwei Paketen zugeordnet wird, übernimmt dieses Paket keine davon. Die Zelle hat deshalb kein `replaces-de-by.json`, keine `replaces`, keine `retired_items` und braucht keine Freigabe.

## Entscheidungen

- **Fachname in der Lehrplanbindung: `subject: englisch-2fs`.** Thomas am 2026-11-24 in der Claude-Code-Sitzung zu diesem Paket (PR #195), auf die Frage, ob die Karten an `englisch-2fs` binden sollen: „Yes, englisch-2fs“. ZAM kennt den Fachnamen `englisch-2fs` in seinen Lernpositionen noch nicht; bis ZAM ihn kennt, erscheinen die Karten nicht in einer Englisch-6-Position für die 1. Fremdsprache – was gewollt ist –, aber auch noch nicht in einer eigenen Position für die 2. Fremdsprache. Das ergänzt ZAM, wenn es die Zelle bündelt.

## Offene Fragen an Thomas

1. **Starter-Karten aus Jahrgang 5:** Die Karten von `de-by:gymnasium-5-englisch-starter-grammar-tenses` (to be, have got, simple present, simple past) passen inhaltlich auch zu diesem ersten Lernjahr. Sie sind schon `englisch-gymnasium-5` zugeordnet und bleiben dort.
