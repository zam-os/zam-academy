# Französisch 10 · Lehrplanabgleich und Kartenbestand

Stand: 26. Oktober 2026. Das [Academy-Paket](../franzoesisch-realschule-10/) erschien als Version `2026.10.1` einer neuen Zelle `zam-academy:franzoesisch-realschule-10`, **ohne** `replaces` und **ohne** `retired_items`. Version `2026.10.2` berichtigt nach dem ZAM-Review (zam-os/zam#460) zwei Distraktor-Begründungen und eine Musterlösung; Ids, Slugs und Lektionen bleiben gleich. Es gibt keine Zuordnung, die freigegeben werden müsste.

## Wer Französisch 10 hat

Die [Realschulordnung, Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1) führt Französisch nur in der **Wahlpflichtfächergruppe IIIa** als „Zweite Fremdsprache (Französisch)“, von Klasse 7 bis 10 (siehe [Französisch 9](franzoesisch-bestandsabgleich.md)). Klasse 10 ist das vierte Lernjahr und das Jahr der Abschlussprüfung, in der Französisch für diese Gruppe Prüfungsfach ist. Die Zelle trägt deshalb `track: "IIIa"` in ihrer Lehrplanbindung. Die Mittelschule hat kein Fach Französisch (`kein_unterricht` in `academy.json`).

## Lehrplan

Der [Fachlehrplan Französisch 10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/franzoesisch) wurde am 26. Oktober 2026 im Original gelesen (direkter Abruf, kein Archiv nötig). Er hat fünf Lernbereiche und **49 Kompetenzerwartungen**:

| Lernbereich | Erwartungen | Lektionen (Stufe) |
| --- | --- | --- |
| 1.1 Kommunikative Fertigkeiten (Hören 1, Lesen 1, Sprechen 4, Schreiben 5, Sprachmittlung 3) | 14 | 13 (Stufe 1) |
| 1.2 Sprachliche Mittel: Grammatik | 4 | 12 (Stufe 2) |
| 1.2 Sprachliche Mittel: Wortschatz | 10 | 9 (Stufe 3) |
| 1.2 Sprachliche Mittel: Aussprache und Intonation | 2 | 1 (Stufe 3) |
| 2 Interkulturelle Kompetenzen | 4 | 4 (Stufe 4) |
| 3 Text- und Medienkompetenzen | 7 | 6 (Stufe 5) |
| 4 Methodische Kompetenzen | 6 | 6 (Stufe 6) |
| 5 Themengebiete | 2 | 6 (Stufe 7) |

Die [Matrix](../franzoesisch-realschule-10/coverage.json) ordnet jede Erwartung mit ihrem Wortlaut den Lektionen zu; `tests/contract.test.ts` prüft, dass jede Erwartung mindestens eine Lektion hat und jede Lektion mindestens eine Erwartung. Einige Lektionen decken Erwartungen zweier Einheiten ab, etwa „Meinungen und Gefühle“ die Sprech-Erwartung 1.1.6 und die Wortschatz-Erwartung 1.2.1.4 (il est important de, à ta place), „Wörter erschließen“ die Wortschatz-Erwartung 1.2.1.10 und die Text-Erwartung 3.1, „Die deutsch-französische Freundschaft“ die Erwartung 2.2 und das gleichnamige Themengebiet (15 Stunden).

Die vier Grammatik-Erwartungen haben zwölf Lektionen, weil sie viel enthalten: ne … pas non plus und ne … que, ce qui und ce que, Adverbien auf -ment (1.2.2.1), conditionnel présent und Bedingung Typ II (1.2.2.2), courir, recevoir, suivre, vivre (1.2.2.3) und die Wiederholung zum Überarbeiten eigener Texte (1.2.2.4: Verben, Adjektiv, Verneinungen, Objektpronomen, Zeiten und Modi; die komplexen Sätze übt die Lektion zu den Strukturwörtern). Den Subjonctif nennt der Plan nur im Wortschatz, als feste Wendungen (il faut que tu fasses, je veux que tu viennes, il est important que tu sois); die Lektion lehrt ihn so, mit den nötigen Formen, nicht als ganzes System.

### Nachbarstufen

- **Aus Klasse 9 vorausgesetzt** ([Fachlehrplan 9](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch), Paket [Französisch 9](../franzoesisch-realschule-9/)): imparfait und passé composé, futur simple, Bedingung Typ I, qui, que, où, y und en, Imperativ mit Pronomen. Die Lektionen nennen das als Vorwissen („Du kennst aus Klasse 9 …“).
- **Nicht aufgenommen**, weil es nicht im Realschulplan steht: Bedingung Typ III (si + plus-que-parfait), das Passiv als eigenes Grammatikthema, Gérondif, lequel und dont. Das Gymnasium hat diese Themen in seinen eigenen Plänen. Das Passiv mit être kommt nur zum Verstehen vor, wie der Plan es mit „Ersatzformen“ verlangt.

## Was die App nicht prüft

Unter `outside_app` in `coverage.json` und in den betroffenen Zeilen der Matrix steht, was bei Hören, Sprechen, Aussprache, Rollenspiel und mündlicher Sprachmittlung offen bleibt: Die App spielt keinen Ton ab und nimmt keine Sprache auf. Die Lektionen üben mit Transkripten, Gesprächsbausteinen und schriftlichen Planungen und verweisen auf Hörproben in Online-Wörterbüchern. Aktuelle Themen übt die App an erfundenen Meldungen; echte Nachrichten bringt der Unterricht.

## Grenzen des Paketstandes

- **Schreibaufgaben** werden mit einem Mustertext verglichen und selbst eingeschätzt, nicht bewertet.
- **Sachaussagen** (Élysée-Vertrag 1963, Schuman-Plan 1950, DFJW 1963, Vertrag von Aachen 2019, Restos du Cœur 1985, service civique, Überseegebiete, Zahl der Französischsprechenden nach OIF, Lebensdaten von Persönlichkeiten) beschränken sich auf lange bekannte Daten. Angaben zu lebenden Sportlern und Künstlern betreffen nur Leistungen, die nicht mehr veralten (zum Beispiel Weltmeistertitel 2018, Goldmedaillen 2024). Eine Fachlehrkraft Französisch sollte die Lektionen vor der Veröffentlichung gegenlesen.
- **Angaben zur Abschlussprüfung** bleiben allgemein (Aufgabentypen, Zeiteinteilung, Hilfsmittel); die App ersetzt keine Prüfungsaufgaben des Kultusministeriums.
- **Lehrervideos** sind nicht enthalten; sie folgen in einem eigenen Schritt (Paketstandard).

## Kartenbestand in ZAM

Geprüft wurde zam-os/zam auf dem Stand `2ae38c0add98e088ea5ab74aa3b697e31d0e6128` (25. Oktober 2026): `tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`. Es gibt **keine** `de-by`-Zelle für Französisch in Klasse 10 der Realschule. Die Zellen für Französisch an der Realschule enden mit Klasse 8 (`de-by:realschule-7-…`, `de-by:realschule-8-…`); Klasse 9 ist die Academy-Zelle `zam-academy:franzoesisch-realschule-9`. Für Klasse 10 gibt es nur die Gymnasialzelle `de-by:gymnasium-10-franzoesisch-francophonie-passif-gerondif` (Version `2026.08.1`), die an `school_type: "gymnasium"` gebunden ist und andere Inhalte abfragt (Passiv, Gérondif, zusammengesetzte Relativpronomen).

Ähnlichkeit des Themas entscheidet keine Beherrschung. Die neue Zelle hat deshalb kein `replaces` und keine `retired_items`, und die Karten der Gymnasialzelle und von Französisch 9 bleiben mit ihren Reviewhistorien unverändert. Ein `replaces-de-by.json` ist nicht nötig, und der Katalogschritt in CI braucht keine Freigabe.

## Reihenfolge bis zur ZAM-Veröffentlichung

1. Academy-App, Zelle und Matrix reviewen; eine Fachlehrkraft Französisch liest die Lektionen gegen.
2. Academy mergen und die Veröffentlichung der Zelle im Katalog prüfen.
3. In einem eigenen ZAM-PR `franzoesisch-realschule-10` mit `npm run academy:sync` bündeln.
