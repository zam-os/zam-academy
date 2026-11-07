# Englisch 5 Realschule Bayern · ZAM Academy

**43 Kernlektionen, je drei Kurzaufgaben pro Lektion und 86 ZAM-Karten**. Gemeinsamer Lernpfad für alle Schülerinnen und Schüler der 5. Jahrgangsstufe nach dem [LehrplanPLUS Englisch 5](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/englisch), geprüft am 7. November 2026. Die App baut auf der Englisch-8/10-Shell mit eigenem Fortschrittsspeicher auf.

| Etappe | Lektionen | Schwerpunkt |
| --- | ---: | --- |
| Englisch als Weltsprache & UK | 5 | Britische Inseln, UK und Republik Irland, Landesteile und Hauptstädte, Englisch im Alltag, Classroom Phrases (Hören), Wörterbuch |
| Alltagsleben in Großbritannien | 8 | Höflichkeitsformeln, Familie und Wohnformen (Hören), Haustiere und Gartenbild (Szene), Feste im Jahreslauf, Einkaufen (how much/many), Kleidung (this/that/these/those), Gesundheit (should, Sprachmittlung), verantwortungsbewusster Konsum (Grafik) |
| Schule in Großbritannien | 5 | Schulalltag und Uniform, Räume und Präpositionen, Stundenplan und Zahlen/Uhrzeiten (Sprachmittlung), Schulweg mit Grafik und Wegbeschreibung (Sprachmittlung), Lernmethoden |
| Freizeit, Reisen & Medien | 6 | Hobbys und Sport (Gerund, Chunks), Charity & Community, Mediennutzung, Sehenswürdigkeiten im UK (Sprachmittlung), Feriendialog (Hören), Urlaubspostkarte |
| Sprachwerkstatt: Wortschatz & Grammatik | 15 | to be, have got, Artikel und Plural, ’s/of-Genitiv und Possessivbegleiter, Personal- und Fragepronomen, Simple Present, Present Progressive, Kontrast der Gegenwartszeiten, Simple Past (was/were & -ed), Simple Past (unregelmäßig & did/didn’t), Modalverben (can/could/may/must), Fragen und Kurzantworten, Imperativ und Let’s, Satzbau und Linking Words, Aussprache und IPA |
| Geschichten, Gedichte & Lesetagebuch | 4 | Detektivgeschichte und Kontext-Erschließung, Lesetagebuch zur Ganzschrift, zwei gemeinfreie Originalgedichte von Robert Louis Stevenson, Schreibwerkstatt |

Die Etappen sind der didaktische Lernpfad, keine neue Nummerierung des Lehrplans. [coverage.json](coverage.json) ordnet 36 Kompetenz- und Themenzeilen mit dem Originalwortlaut des ISB den fünf Lernbereichen zu, ordnet jede der 33 genannten Wortschatz- und Grammatikstrukturen einzeln einer Lektion zu und führt die Themenstunden 20/45/25/35/15 auf. Der [Bestandsabgleich](../docs/englisch-5-bestandsabgleich.md) erläutert die Abgrenzung zur Grundschule (Jgst. 3/4) und zu Englisch 6 sowie den Vorschlag für die acht vorhandenen ZAM-Karten.

Jede Lektion enthält zwei erklärende Absätze mit Beispielen, einen Merksatz, Material, Schnellcheck, drei Kurzantworten und eigene Sprachaufgaben auf zwei Stufen. Level 1 zeigt die Kriterien als Hilfe, Level 2 verlangt Übertragung. Die Lernenden schreiben oder sprechen selbst und vergleichen anschließend mit einem möglichen Muster; freie Texte werden nicht automatisch bewertet. Eine Lektion zählt als geübt nach richtigem Schnellcheck, drei richtigen Kurzantworten und gespeichertem Mustervergleich auf Level 1, bei den Hörlektionen zusätzlich nach einer Zuhörübung.

## Hören, Sprechen und Grenzen

Drei eigens verfasste Skripte (Klassenzimmer-Dialog, Sprachnachricht einer Familie aus Leeds, Schulhof-Gespräch nach den Ferien) enthalten Gesprächsmerkmale und beschriebene Hintergrundgeräusche. Sie können von einer **installierten lokalen englischen Computerstimme** oder von einem Partner vorgelesen werden; Remote-Stimmen sind ausgeschlossen, das Transkript bleibt zunächst zugeklappt. Die Computerstimme ersetzt keine natürlichen Sprecher, Songs, Raps oder Filme. Es gibt keine Mikrofonaufnahme; Aussprache und Flüssigkeit werden nicht bewertet.

Der Jahreswortschatz von ca. 700 Wörtern und Wendungen, eine vollständige Ganzschrift (Lektüre) und spontane Gespräche im Klassenzimmer bleiben zusätzliche Lernarbeit. Eine fachliche Abnahme durch eine Lehrkraft steht aus.

## Material und Quellen

Personen, Dialoge, Umfragewerte und Geschichten sind als erfunden gekennzeichnet; der Dialog im Schulsanitätsraum ist ausdrücklich keine medizinische Beratung. Die Gartenszene ist ein selbst gezeichnetes SVG-Bild mit Beschriftungen, die auch im Text stehen. Landeskundliche und sprachliche Angaben stützen sich auf die in `src/curriculum/outline.json` verlinkten Quellen (LehrplanPLUS Bayern, Fachprofil Moderne Fremdsprachen, UK Office for National Statistics, Government of Ireland – `gov.ie`, GOV.UK, NHS, Charity Commission, Historic Royal Palaces – Tower of London, Cadw Wales, Cambridge Learner’s Dictionary, British Council LearnEnglish). Die beiden Gedichte „Time to Rise“ und „Rain“ aus Robert Louis Stevensons „A Child’s Garden of Verses“ (1885) sind gemeinfrei und wörtlich aus Project Gutenberg (eBook #19722) übernommen. Quellen öffnen erst auf Klick. Lehrervideos sind nach dem Academy-Standard nicht enthalten.

## Lokale Daten und ZAM

Texte und Fortschritt bleiben in `localStorage` dieses Browsers (`englisch_rs5_academy_progress_v1`, Theme `englisch_rs5_theme`). Mehrere Tabs führen abgeschlossene Schritte zusammen; ein geänderter Entwurf verliert seine alte Selbsteinschätzung. Keine Konten, Cookies oder Analyse-Dienste.

`cell.json` ist die einzige Kartenquelle; die App liest Schnellcheck-Frage und Antwort daraus. Die 129 einmal erzeugten ULIDs und 43 Lektionsanker stehen ohne Kartentext in `tests/fixtures/public-contract.json`. Alle 86 Karten haben die Sprache `en`, verlinken ihre Lektion und binden Etappe und Lernbereich für Jahrgangsstufe 5 mit `exam_relevant: false`.

**Die Zuordnung der acht alten Englisch-5-Karten ist ein unbestätigter Vorschlag (`proposal-only`, `approved: null`).** `cell.json` enthält in `2026.11.1` weder `replaces` noch `retired_items`, sodass alle acht bisherigen Karten aus `de-by:realschule-5-englisch-grundlagen-to-be-have-got` samt Lernverlauf unangetastet aktiv bleiben, bis Thomas über den Vorschlag (4 A / 0 B / 4 C) in `replaces-de-by.json` entscheidet.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5222/englisch-realschule-5/
npm run typecheck
npm test
npm run package:zip  # Build, Offline-ZIP und Artefaktprüfung
ZAM_CORE=<Datei-URL von zam-core@0.54.0/dist/index.js> node scripts/validate-migration.mjs
```

Dieselben vier Entwicklungswerkzeuge wie in Englisch 8, 9 und 10: TypeScript, Vite, Singlefile und Vitest. `scripts/validate-migration.mjs` prüft in Wegwerfbibliotheken sowohl die veröffentlichte Zelle ohne `replaces` (alle 8 Altkarten und 16 Reviews unverändert) als auch die Vorschlagssimulation für die vier A-Karten und die Kollisionssicherung.
