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

Alle 14 Wortschatzstrukturen (`vocab-1`) und alle 19 Grammatikstrukturen
(`grammar-1`, `grammar-2`, `grammar-3`) sind in `structures` einzeln einer
oder mehreren Lektionen zugeordnet. Die zukünftige Bedeutung von Simple Present
und Present Progressive in Verbindung mit Zeitangaben ist laut Lehrplan
rezeptiv und wird entsprechend eingeführt.

## Nachbarjahrgänge

- **Grundschule Englisch 3/4** (geprüft über den Wayback-Snapshot vom
  19. Februar 2025 von `lehrplanplus.bayern.de/fachlehrplan/grundschule/3/englisch`):
  mündlicher Grundwortschatz, Begrüßungen, Zahlen bis 20, Farben, Tiere,
  Schulsachen und erste einfache Satzmuster (`I’m…`, `I like…`, `Have you got…?`).
  Diese Grundlagen werden in den Einstiegslektionen ausdrücklich als
  „Wiederholung aus der Grundschule“ gekennzeichnet und schriftlich sowie
  systematisch ausgebaut.
- **Englisch 6** (direkt abgerufen am 7. November 2026 von
  `lehrplanplus.bayern.de/fachlehrplan/realschule/6/englisch`):
  `past progressive`, `present perfect`, `will-future`, `going to-future`,
  `if-clauses type 1`, Steigerung der Adjektive (`comparison of adjectives`),
  Relativsätze (`relative clauses`), Adverbien der Art und Weise (`adverbs of
  manner`) sowie `some/any` und `much/many/a lot of` in Aussagen gehören zu
  Englisch 6 und werden in Englisch 5 nicht vorweggenommen.

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
verlinkten Quellen (LehrplanPLUS Bayern, Office for National Statistics,
Ordnance Survey, GOV.UK, NHS, Department for Education, VisitBritain, Royal
Museums Greenwich, Historic Royal Palaces – Tower of London, British Council,
Cambridge Dictionary). Die beiden Gedichte „Time to Rise“ und „Rain“ von Robert
Louis Stevenson (1885) sind gemeinfrei und wörtlich aus Project Gutenberg
(eBook #136) übernommen.

## Die acht bisherigen Englisch-5-Karten (`proposal-only`)

Quelle: `zam-os/zam`, Commit `717ba45adf1f531da0bf662393a4b5379961f21f`,
Zelle `de-by:realschule-5-englisch-grundlagen-to-be-have-got`,
Version `2026.08.1`, SHA-256
`d2c9c970eee345cbf419ec8259db0dd6bc1397b9672d516b304b00aad2c832a5`. Eine
bytegleiche Kopie liegt unter
`englisch-realschule-5/tests/fixtures/de-by-realschule-5-englisch-grundlagen-to-be-have-got-kvt.json`.

| Alte ID-Endung | Inhalt | Vorschlag | Begründung |
| --- | --- | --- | --- |
| J01 | Kurzform von „is not“ in „He ___ at home“ (`isn't`) | **A** → `e5-to-be-check`, propose-replace-after-approval | Derselbe atomare Einzelabruf mit demselben Beispielsatz, derselben Antwort `isn't` und denselben Auswahloptionen `["isn't", "aren't"]`. |
| J02 | Alle Präsensformen von `to be`, Verneinung und Fragesatz | C, keep-active | Mehrteiliger Synthese-Abruf; `e5-to-be-recall` fragt gezielt nach Entscheidungsfragen und Kurzantworten. |
| J03 | Form von `have got` bei der 3. Person Singular (`has got (he/she/it has got)`) | **A** → `e5-have-got-check`, propose-replace-after-approval | Derselbe atomare Einzelabruf mit denselben Auswahloptionen `["has got (he/she/it has got)", "have got"]`; nur die Aufgabensprache wechselt ins Englische. |
| J04 | Formen von `have got / has got`, Verneinung und Fragen + 3 Übersetzungen | C, keep-active | Mehrteiliger Synthese-Abruf mit drei festen Übersetzungssätzen; kein deckungsgleicher Einzel-Nachfolger. |
| J05 | Verwendung des unbestimmten Artikels `an` statt `a` (vor gesprochenem Vokallaut: `an apple, an hour`) | **A** → `e5-articles-nouns-check`, propose-replace-after-approval | Derselbe atomare Einzelabruf nach der Lautregel für `an` vor gesprochenem Vokallaut gegen Pluralnomen. |
| J06 | Regeln zu `a/an`, regelmäßiger Plural und vier unregelmäßige Pluralformen | C, keep-active | Mehrteilige Synthese-Aufgabe; `e5-articles-nouns-recall` deckt zusätzlich den bestimmten Artikel `the` ab. |
| J07 | Verneinter Imperativ im Englischen (`Don't + base form (Don't run!)`) | **A** → `e5-imperatives-check`, propose-replace-after-approval | Derselbe atomare Einzelabruf mit demselben Beispiel „Don't run!“ und denselben Auswahloptionen. |
| J08 | Bildung des Imperativs und Übersetzung dreier konkreter Sätze | C, keep-active | Mehrteilige Übersetzungsaufgabe; `e5-imperatives-recall` fragt stattdessen systematisch nach positivem/negativem Imperativ und `Let’s`. |

Gemäß `AGENTS.md` (Hard Rule 1 und Abschnitt 6) steht `replaces-de-by.json`
auf `"approved": null` und `"status": "proposal-only"`. Die veröffentlichte
Zelle `cell.json` (`2026.11.1`) enthält weder `replaces` noch `retired_items`,
sodass alle acht Altkarten und ihre Lernverläufe unverändert aktiv bleiben, bis
Thomas die Zuordnung ausdrücklich freigibt.
