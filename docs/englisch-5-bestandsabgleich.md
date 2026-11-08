# Englisch 5 · Lehrplan- und Bestandsabgleich

Stand: 7. November 2026. Neues Paket unter `englisch-realschule-5/` mit
43 Kernlektionen und 86 Wiederholungsfragen.

## Lehrplanbasis

Der [Fachlehrplan Englisch 5](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/englisch)
gilt gemeinsam für alle Wahlpflichtfächergruppen. Er wurde am 7. November 2026
direkt von lehrplanplus.bayern.de abgerufen (kein Wayback-Snapshot nötig).
`coverage.json` führt 36 Zeilen mit dem Originalwortlaut (`curriculum_text`):

- LB 1: Hören (2), Lesen (2), Sprechen (3), Schreiben (2), Sprachmittlung (2),
  Wortschatz (2), Grammatik (3), Aussprache (3) Kompetenzerwartungen,
- LB 2: 4, LB 3: 2, LB 4: 4 Kompetenzerwartungen,
- LB 5: zwei übergreifende Erwartungen und fünf Themengebiete mit den
  ungefähren Stunden 20 (erste Einblicke in Englisch als Weltsprache),
  45 (Alltagsleben in Großbritannien), 25 (Schule in Großbritannien),
  35 (Freizeitgestaltung), 15 (weitere Interessensgebiete, u. a. Lesen einer
  Ganzschrift).

Alle 14 Wortschatzstrukturen (`vocab-1`) und alle 19 Grammatik-Aufzählungspunkte
(`grammar-1`: 6, `grammar-2`: 7, `grammar-3`: 6; in `coverage.json` mit separat
als `"use": "receptive"` ausgewiesener Zukunftsbedeutung von Simple Present und
Present Progressive in 35 `structures`-Einträgen geführt) sind einzeln einer
oder mehreren Lektionen zugeordnet. Die zukünftige Bedeutung von Simple Present
und Present Progressive in Verbindung mit Zeitangaben ist laut Lehrplan
rezeptiv und wird entsprechend nur rezeptiv eingeführt und geprüft.

## Nachbarjahrgänge

- **Grundschule Englisch 3/4** (geprüft über die Wayback-Snapshots vom
  7. November 2025 und 25. Februar 2024 von
  `lehrplanplus.bayern.de/fachlehrplan/grundschule/3/englisch`; die Live-URL
  leitet auf die Startseite um und die archivierte Fassung trägt den ISB-Vermerk,
  der Lehrplan sei in dieser Form seit dem Schuljahr 2024/25 nicht mehr gültig):
  mündlicher Grundwortschatz, Begrüßungen, Zahlen (1–12 schriftlich als Ziffern
  sowie 15, 30, 45 bei der Uhrzeit), Farben, Tiere, Schulsachen und erste
  einfache Satzmuster (`I’m…`, `I like…`, `Have you got…?`). Diese Grundlagen
  werden in den Einstiegslektionen ausdrücklich als „Wiederholung aus der
  Grundschule“ gekennzeichnet und schriftlich sowie systematisch ausgebaut.
- **Englisch 6** (direkt abgerufen am 7. November 2026 von
  `lehrplanplus.bayern.de/fachlehrplan/realschule/6/englisch`):
  `past progressive`, `present perfect`, `will-future`, `going to-future`, die
  produktive Verwendung von `present progressive` und `simple present` mit
  Zukunftsbedeutung, Steigerung der Adjektive (`comparison of adjectives`),
  selbstständige Possessivpronomen (`mine, yours, …`) sowie `some/any` (inkl.
  Komposita) und `much/many/a lot of` gehören zu Englisch 6 und werden in
  Englisch 5 nicht vorweggenommen. Bedingungssätze (`if-clauses types 0/1`),
  Relativsätze (`defining relative clauses`) und Adverbien der Art und Weise
  (`adverbs of manner`) folgen erst in **Englisch 7**.

## Grenzen

Natürliche Hör- und Hörsehtexte mit echten Sprechern, Songs/Raps, spontane
Gespräche im Unterricht, die Bewertung der Aussprache, eine vollständige
Ganzschrift (Lektüre) und der volle Jahreswortschatz (ca. 700 Wörter und
Wendungen) sind durch die App allein nicht abgedeckt; die entsprechenden Zeilen
stehen in `coverage.json` auf `partial`. Eine fachliche Abnahme durch eine
Lehrkraft steht aus.

## Quellen und eigene Materialien

Erfundene Materialien (Dialoge, Familien-Sprachnachricht, Schul-Umfragen,
Detektivgeschichte, Muster-Lesetagebuch) sind in jeder Lektion im
`materialLabel` als erfunden gekennzeichnet; der Dialog im Schulsanitätsraum
trägt den Hinweis „keine medizinische Beratung“. Landeskundliche und
sprachliche Angaben stützen sich auf die in `src/curriculum/outline.json`
verlinkten Quellen (LehrplanPLUS Bayern, Fachprofil Moderne Fremdsprachen, UK
Office for National Statistics, Government of Ireland – `gov.ie`, GOV.UK, NHS,
Charity Commission, Historic Royal Palaces – Tower of London, Cadw Wales,
Cambridge Learner’s Dictionary, British Council LearnEnglish). Die beiden
Gedichte „Time to Rise“ und „Rain“ von Robert Louis Stevenson (1885) sind
gemeinfrei und wörtlich aus Project Gutenberg (eBook #19722) übernommen.

## Die acht bisherigen Englisch-5-Karten (freigegeben am 8. November 2026)

Quelle: `zam-os/zam`, Commit `e6a235f75fe87b9d57af38bd61011027b891492c`,
Zelle `de-by:realschule-5-englisch-grundlagen-to-be-have-got`,
Version `2026.08.1` (4 Atome, 8 Items), SHA-256
`d2c9c970eee345cbf419ec8259db0dd6bc1397b9672d516b304b00aad2c832a5`. Eine
bytegleiche Kopie liegt unter
`englisch-realschule-5/tests/fixtures/de-by-realschule-5-englisch-grundlagen-to-be-have-got-kvt.json`.

| Alte ID | Altslug | Inhalt | Vorschlag | Begründung |
| --- | --- | --- | --- | --- |
| `01K4E5B0000000000000000J01` | `de-by-rs5-eng-to-be-am-is-are-1` | Kurzform von „is not“ in „He ___ at home“ (`isn’t`) | **A** → `e5-to-be-check` (`01M6TY2GQAJTYWEH2VFNMQYSKC`), `propose-replace-after-approval` | Derselbe atomare Einzelabruf mit demselben Beispielsatz, derselben Antwort `isn’t` und denselben Auswahloptionen `["isn’t", "aren’t"]`. |
| `01K4E5B0000000000000000J02` | `de-by-rs5-eng-to-be-am-is-are-2` | Alle Präsensformen von `to be`, Verneinung, Fragesatz und 2 Übersetzungen | **C**, `keep-active` | Mehrteiliger Synthese-Abruf; `e5-to-be-recall` fragt gezielt nach Entscheidungsfragen und Kurzantworten. |
| `01K4E5B0000000000000000J03` | `de-by-rs5-eng-have-got-forms-1` | Form von `have got` bei der 3. Person Singular (`has got (he/she/it has got)`) | **A** → `e5-have-got-check` (`01M6TY2GR58T701Q60T1C597V8`), `propose-replace-after-approval` | Derselbe atomare Einzelabruf mit denselben Auswahloptionen `["has got (he/she/it has got)", "have got"]`; nur die Aufgabensprache wechselt ins Englische. |
| `01K4E5B0000000000000000J04` | `de-by-rs5-eng-have-got-forms-2` | Formen von `have got / has got`, Verneinung, Fragen und 2 Übersetzungen | **C**, `keep-active` | Mehrteiliger Synthese-Abruf mit Übersetzungssätzen; kein deckungsgleicher Einzel-Nachfolger. |
| `01K4E5B0000000000000000J05` | `de-by-rs5-eng-articles-plurals-1` | Verwendung des unbestimmten Artikels `an` statt `a` (vor gesprochenem Vokallaut: `an apple, an hour`) | **A** → `e5-articles-nouns-check` (`01M6TY2GSDCH9JCFJTR23B3T4Z`), `propose-replace-after-approval` | Derselbe atomare Einzelabruf nach der Lautregel für `an` vor gesprochenem Vokallaut gegen Pluralnomen. |
| `01K4E5B0000000000000000J06` | `de-by-rs5-eng-articles-plurals-2` | Vier Pluralregeln, unregelmäßige Plurale und 3 Artikel-Einsetzaufgaben | **C**, `keep-active` | Mehrteilige Synthese-Aufgabe; `e5-articles-nouns-recall` deckt zusätzlich den bestimmten Artikel `the` ab. |
| `01K4E5B0000000000000000J07` | `de-by-rs5-eng-imperative-lets-1` | Verneinter Imperativ im Englischen (`Don’t + base form (Don’t run!)`) | **A** → `e5-imperatives-check` (`01M6TY2HAE5SA7P9XQG2ZH2CE3`), `propose-replace-after-approval` | Derselbe atomare Einzelabruf mit demselben Beispiel „Don’t run!“ und denselben Auswahloptionen. |
| `01K4E5B0000000000000000J08` | `de-by-rs5-eng-imperative-lets-2` | Bildung des Imperativs und Übersetzung dreier konkreter Sätze | **C**, `keep-active` | Mehrteilige Übersetzungsaufgabe; `e5-imperatives-recall` fragt stattdessen systematisch nach positivem/negativem Imperativ und `Let’s`. |

Thomas hat die Zuordnung am 8. November 2026 freigegeben
(`"status": "approved"`). Ab `cell.json` `2026.11.2` trägt jeder der vier
A-Nachfolger ein `replaces` auf seine alte Karte, deren Lernverlauf damit
unverändert übergeht. Die vier C-Karten bleiben aktiv; `retired_items` gibt es
nicht. Die erste Fassung `2026.11.1` erschien ohne `replaces`.
