# Englisch 8 Realschule Bayern · ZAM Academy

**51 Kernlektionen, 153 Kurzaufgaben und 102 ZAM-Karten**. Gemeinsamer Lernpfad für I, II, IIIa und IIIb nach dem [LehrplanPLUS Englisch 8](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/englisch), geprüft am 29. Oktober 2026. Die App baut auf der Englisch-10-Shell mit eigenem Fortschrittsspeicher auf.

| Etappe | Lektionen | Schwerpunkt |
| --- | ---: | --- |
| Schlaglichter der Geschichte | 5 | Erste Völker, Jamestown und Plymouth, Sklaverei bis 1865, Rosa Parks, Underground Railroad (Sprachmittlung EN–DE) |
| USA | 11 | Staaten, Wetterextreme mit Grafik, soziale Spannbreite, Ellis Island, Wasserspar-Webseite, Werbespot, Silicon Valley und Anleitung, Reiseformular, Hotel, Arzt (Sprachmittlung), Online-Bewertung |
| New York und andere Metropolen | 4 | New Amsterdam, U-Bahn-Durchsagen, Bildbeschreibung einer Stadtszene, Chicago und Los Angeles |
| Canada | 5 | Provinzen und Amtssprachen, Radiosendung, E-Mail aus Nunavut, Nachbar USA, Austauschschüler (Sprachmittlung) |
| Sprachwerkstatt | 17 | Reflexiv-, reziproke und emphatische Pronomen, zwei Objekte, Fragen, Passiv und persönliches Passiv, if-clauses 0–3, Partizipialkonstruktionen (rezeptiv), Modalersatzformen, -ing/-ed-Adjektive, Verbmuster, phrasal verbs, AE/BE, Wortbildung, linking words |
| Amerikanische Jugendliteratur | 4 | Originalauszug aus „Tom Sawyer“, eigene Kurzgeschichte, Stowe/Twain/Thurber, Lesetagebuch und Adaption |
| Eigene Projekte | 5 | Präsentation, Online-Recherche, Wörterbuch und Betonung, Wortschatz/Fehlerprotokoll/Feedback, eigenes Mini-Projekt |

Die Etappen sind der didaktische Lernpfad, keine neue Nummerierung des Lehrplans. [coverage.json](coverage.json) ordnet 44 Kompetenz- und Themenzeilen mit dem Originalwortlaut des ISB den fünf Lernbereichen zu, ordnet jede der 20 genannten Grammatik- und Wortschatzstrukturen einzeln einer Lektion zu und führt die Themenstunden 22/35/20/20/10/5 auf. Der [Bestandsabgleich](../docs/englisch-8-bestandsabgleich.md) erläutert die Abgrenzung zu Englisch 7 und 9 und die vier vorhandenen ZAM-Karten.

Jede Lektion enthält zwei erklärende Absätze mit Beispielen, einen Merksatz, Material, Schnellcheck, drei Kurzantworten und eigene Sprachaufgaben auf zwei Stufen. Level 1 zeigt die Kriterien als Hilfe, Level 2 verlangt Übertragung. Die Lernenden schreiben oder sprechen selbst und vergleichen anschließend mit einem möglichen Muster; freie Texte werden nicht automatisch bewertet. Eine Lektion zählt als geübt nach richtigem Schnellcheck, drei richtigen Kurzantworten und gespeichertem Mustervergleich auf Level 1, bei den Hörlektionen zusätzlich nach einer Zuhörübung.

## Hören, Sprechen und Grenzen

Drei eigens verfasste Skripte (Werbespot und Durchsage, U-Bahn, kanadische Radiosendung) enthalten Korrekturen, Zögern und beschriebene Geräusche. Sie können von einer **installierten lokalen englischen Computerstimme** oder von einem Partner vorgelesen werden; Remote-Stimmen sind ausgeschlossen, das Transkript bleibt zunächst zugeklappt. Die Computerstimme ersetzt keine natürlichen Varietäten, Songs, Musikvideos oder echte Radiosendungen. Es gibt keine Mikrofonaufnahme; Aussprache und Flüssigkeit werden nicht bewertet.

Der Jahreswortschatz von ca. 550 Wörtern und Wendungen, eine ganze Lektüre, echte Online-Recherche und spontane Gespräche bleiben zusätzliche Lernarbeit. Projektmuster sind Arbeitsgerüste ohne vorgetäuschte Rechercheergebnisse. Eine fachliche Abnahme durch eine Lehrkraft steht aus.

## Material und Quellen

Personen, Dialoge, Firmen, Grafikwerte und das Reiseformular sind als erfunden gekennzeichnet; das Reiseformular ist ausdrücklich kein amtliches Formular, das Arzt-Rollenspiel keine medizinische Beratung. Die Stadtszene ist ein selbst gezeichnetes SVG-Bild mit Beschriftungen, die auch im Text stehen. Landeskundliche Angaben stützen sich auf verlinkte Quellen (National Park Service, National Archives, Indian Affairs, NOAA, USAGov, Plimoth Patuxet, Regierung von Kanada, Autorenmuseen). Der Auszug aus Mark Twains „The Adventures of Tom Sawyer“ (1876) ist gemeinfrei und wörtlich aus Project Gutenberg übernommen. Quellen öffnen erst auf Klick. Lehrervideos sind nach dem Academy-Standard nicht enthalten.

## Lokale Daten und ZAM

Texte und Fortschritt bleiben in `localStorage` dieses Browsers (`englisch_rs8_academy_progress_v1`, Theme `englisch_rs8_theme`). Mehrere Tabs führen abgeschlossene Schritte zusammen; ein geänderter Entwurf verliert seine alte Selbsteinschätzung. Keine Konten, Cookies oder Analyse-Dienste.

`cell.json` ist die einzige Kartenquelle; die App liest Schnellcheck-Frage und Antwort daraus. Die 153 einmal erzeugten ULIDs und 51 Lektionsanker stehen ohne Kartentext in `tests/fixtures/public-contract.json`. Alle 102 Karten haben die Sprache `en` (die Sprachmittlungskarte EN–DE hat eine deutsche Antwort), verlinken ihre Lektion und binden Etappe und Lernbereich für Jahrgangsstufe 8 mit `exam_relevant: false`.

Die vier alten Englisch-8-Karten bleiben aktiv. `replaces-de-by.json` ist **proposal-only**, `approved: null`: 1 A (`J01` → `e8-if-type3-check`, derselbe Einzelabruf), 3 C (keep-active). Die Zelle enthält kein `replaces` und keine `retired_items`; eine Übertragung braucht Thomas' ausdrückliche Freigabe.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5214/englisch-realschule-8/
npm run typecheck
npm test
npm run package:zip  # Build, Offline-ZIP und Artefaktprüfung
ZAM_CORE=<Datei-URL von zam-core@0.54.0/dist/index.js> node scripts/validate-cell.mjs
```

Dieselben vier Entwicklungswerkzeuge wie in Englisch 9 und 10: TypeScript, Vite, Singlefile und Vitest. `scripts/validate-cell.mjs` prüft in Wegwerfbibliotheken, dass die ausgelieferte Zelle keine alte Historie verändert, probt die vorgeschlagene A-Zuordnung an einer Kopie im Speicher und zeigt, dass ein Lernender mit Karten auf beiden IDs keine automatische Zusammenführung bekommt.
