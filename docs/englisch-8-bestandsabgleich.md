# Englisch 8 · Lehrplan- und Bestandsabgleich

Stand: 29. Oktober 2026. Neues Paket unter `englisch-realschule-8/` mit
51 Kernlektionen und 102 Wiederholungsfragen. Die Pages-Veröffentlichung folgt
nach dem Merge; die Übernahme in ZAM erfolgt in einem separaten PR.

## Lehrplanbasis

Der [Fachlehrplan Englisch 8](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/englisch)
gilt gemeinsam für alle Wahlpflichtfächergruppen. Er wurde am 29. Oktober 2026
direkt von lehrplanplus.bayern.de abgerufen (kein Wayback-Snapshot nötig).
`coverage.json` führt 44 Zeilen mit dem Originalwortlaut (`curriculum_text`):

- LB 1: Hören (2), Lesen (3), Sprechen (4), Schreiben (3), Sprachmittlung (2),
  Wortschatz (4), Grammatik (3), Aussprache (2) Kompetenzerwartungen,
- LB 2: 4, LB 3: 3, LB 4: 6 Kompetenzerwartungen,
- LB 5: zwei übergreifende Erwartungen und sechs Themengebiete mit den
  ungefähren Stunden 22 (Geschichte Nordamerikas), 35 (USA), 20 (New York und
  Metropolen), 20 (Kanada), 10 (Jugendliteratur), 5 (weitere Interessen).

Die neun Wortschatzstrukturen und elf Grammatikstrukturen sind in `structures`
einzeln einer Lektion zugeordnet. Partizipialkonstruktionen sind laut Lehrplan
rezeptiv und werden nur zum Verstehen geübt.

## Nachbarjahrgänge

- **Englisch 7** (abgerufen am selben Tag): if-clauses type 0/1/2, past perfect,
  ought to/might/mustn't/needn't, erste phrasal verbs, Wortbildung und
  Präsentationswendungen. Sie werden in E8 als „Wiederholung aus E7“
  gekennzeichnet; neu ist type 3. Großbritannien und Irland sind keine Etappe.
- **Englisch 9**: indirekte Rede, used to/be used to, so/neither/nor, Business
  English, Indien und Australien. Nichts davon wird vorweggenommen.
- Vorhandene Pakete: Englisch 9 führt Conditionals, Passiv und Relativsätze als
  freiwillige Auffrischung; Englisch 8 ist der Ort, an dem Passiv und type 3 neu
  eingeführt werden.

## Grenzen

Natürliche Hör- und Hörsehtexte, Songs, spontane Gespräche, Aussprache, eine
ganze Lektüre, echte Online-Recherche und der volle Jahreswortschatz (ca. 550
Wörter und Wendungen) sind durch die App allein nicht nachgewiesen; die
entsprechenden Zeilen stehen auf `partial`. Eine fachliche Abnahme durch eine
Lehrkraft steht aus.

## Quellen und eigene Materialien

Erfundene Materialien sind in jeder Lektion gekennzeichnet. Belegte Fakten
stammen aus den in `src/curriculum/outline.json` verlinkten Seiten, die am
29. Oktober 2026 im Browser geöffnet wurden, u. a.: Indian Affairs (575
anerkannte Tribes), NPS Jamestown (1607, 1619), Plimoth Patuxet (Mayflower 1620,
Wampanoag), National Archives (Emancipation Proclamation 1863, 13th Amendment
1865, Rosa Parks am 1. Dezember 1955, Civil Rights Act 1964), NPS Underground
Railroad (Ziele Kanada und Mexiko, Tubman-Zitat von 1896), NPS Ellis Island
(1892–1924, über 12 Millionen), NPS Freiheitsstatue (1886), NOAA
(Hurrikansaison 1. Juni bis 30. November), Regierung von Kanada (1867, zehn
Provinzen und drei Territorien, zwei Amtssprachen, First Nations/Inuit/Métis,
Zensus 2021, Grenze von fast 9.000 km, NORAD), Autorenmuseen zu Stowe (1852),
Twain (1835–1910, Tom Sawyer 1876) und Thurber (1894–1961, Walter Mitty).
Einige Allgemeinangaben (z. B. Brooklyn Bridge 1883, New Amsterdam/1664,
Stadtgrößen von Los Angeles und Chicago) sind Grundwissen ohne eigene
verlinkte Quelle. Der Twain-Auszug ist gemeinfrei und wörtlich aus Project
Gutenberg (eBook #74) übernommen.

## Die vier bisherigen Englisch-8-Karten

Quelle: `zam-os/zam`, Commit `717ba45adf1f531da0bf662393a4b5379961f21f`,
Zelle `de-by:realschule-8-englisch-grammar-conditional-reported-speech`,
Version `2026.08.1`, SHA-256
`cfcdd1843d21ac280b80552d6917cd5eae5f0a2d67d164909c52d69f5d0fbb5a`. Eine
bytegleiche Kopie liegt unter `englisch-realschule-8/tests/fixtures/`.

| Alte ID-Endung | Inhalt | Vorschlag | Begründung |
| --- | --- | --- | --- |
| J01 | Hauptsatz type 3: „If you had asked me, I … [help] you“ | **A** → `e8-if-type3-check` | Derselbe Einzelabruf mit demselben Beispiel, derselben Antwort „would have helped“ und derselben Auswahl gegen „would help“; nur die Aufgabensprache wechselt. |
| J02 | Vergleich aller drei if-Typen, would-Regel, zwei Übersetzungen | C, keep-active | Mehrteiliger Gesamtabruf; die neuen Karten teilen ihn auf, kein Nachfolger enthält ihn ganz. |
| J03 | Backshift in der indirekten Rede | C, keep-active | Indirekte Rede ist laut LehrplanPLUS E9-Stoff; das E8-Paket hat keinen Nachfolger. |
| J04 | Drei Regeln der indirekten Rede mit Umformungen | C, keep-active | Mehrteilig und E9-Stoff; kein Nachfolger. |

`status: proposal-only`, `approved: null`. Die ausgelieferte Zelle `2026.10.1`
deklariert weder `replaces` noch `retired_items`; alle vier Altkarten bleiben
aktiv. **Thomas wird gebeten, die Zuordnung 1 A / 0 B / 3 C freizugeben oder zu
ändern.** Erst danach folgt eine Version mit `replaces` für J01. Bis dahin gilt:
Wer in der Zwischenzeit sowohl J01 als auch `e8-if-type3-check` übt, bringt
zam-core dazu, die Installation der späteren Version abzulehnen; die Lücke
sollte deshalb kurz bleiben. Ob J03/J04 zu einer Englisch-9-Karte passen, wäre
ein eigener Vorschlag im Englisch-9-Paket.

## Prüfnachweise

Am 29. Oktober 2026 lokal ermittelt:

- `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`
  in `englisch-realschule-8/`: 209 Tests in fünf Dateien grün; ZIP mit
  bytegleicher HTML-Datei, drei Startern und Anleitung.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  38 Tests grün; `node scripts/build-catalog.mjs` schreibt 34 Zellen.
- `ZAM_CORE=<zam-core@0.54.0> node scripts/validate-cells.mjs`: alle Zellen
  installiert, Exit 0; Englisch 8 mit 102 Items.
- `ZAM_CORE=<zam-core@0.54.0> node englisch-realschule-8/scripts/validate-cell.mjs`:
  ausgelieferte Zelle lässt vier Altkarten und acht Reviews unverändert und
  aktiv, neue Karten ohne Lernstand, Installation idempotent; die Probe der
  A-Zuordnung (Erstinstallation und Upgrade) überträgt genau eine Historie mit
  zwei Reviews unverändert, die drei C-Karten bleiben aktiv; eine Kollision
  wird abgewiesen, beide Historien bleiben erhalten.
- Browser (Vite Preview der gebauten App): 204 Lektionsansichten
  (51 × zwei Stufen × hell/dunkel) mit Titel, Material, drei Quizoptionen,
  drei Kurzantwortfeldern, Aufgabe, Entwurfsfeld und Quellen; alle 51
  Lektionen haben auf beiden Stufen verschiedene Aufträge. `e8-if-type3`
  durchgespielt (falscher und richtiger Schnellcheck, Kurzantworten,
  Mustervergleich erst mit allen drei Kriterien, Fortschritt nach Neuladen
  erhalten), Partnerbestätigung in `e8-subway-listening`, Nachschlagen und
  ZAM-Dialog geöffnet. Headless-Chrome-Screenshots von Lernpfad, Grafik,
  Stadtszene, Hörlektion und Twain-Auszug in hell und dunkel kontrolliert; die
  Beschriftungen der Stadtszene wurden danach entzerrt.
