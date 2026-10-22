# Wirtschaft und Recht 9 · Bestandsabgleich und Vorschlag zur Lernstandsübernahme

Stand: 22. Oktober 2026. Die Zelle in Version `2026.10.2` deklariert die drei `replaces` der A-Zeilen und die fünf `retired_items` der C-Zeilen, genau wie unten dokumentiert. **Die Zuordnung ist noch nicht freigegeben:** `approved` in `replaces-de-by.json` ist `null`, und nur Thomas gibt sie frei. Bis dahin lehnt die Katalogsperre (`scripts/mapping-approval.mjs`) die Veröffentlichung ab, die erste Fassung `2026.10.1` bleibt unverändert veröffentlicht, und die alte Zelle `de-by:realschule-9-wirtschaft-recht-markt-vertraege` bleibt in ZAM aktiv.

## Fachliche Zuordnung

Wirtschaft und Recht 9 gilt in Bayern für die Wahlpflichtfächergruppen **I und III**; Gruppe II lernt in Klasse 9 BwR. Der [Fachlehrplan WR 9 (I/III)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/wirtschaft-und-recht/wpfg1-3) hat vier Lernbereiche (Berufliche Orientierung, Wirtschaftliches Handeln in der Sozialen Marktwirtschaft, Verbraucherschutz, Grundzüge des Rechts) und einen optionalen bilingualen Lernbereich. Der Lehrplantext wurde aus einem Schnappschuss des Internet Archive vom 9. Juni 2026 gelesen, weil die Originalseite von der Arbeitsumgebung aus nicht erreichbar war. Prüfende sollten ihn mit der Live-Seite vergleichen.

Die vorhandene Teilzelle (Version `2026.08.1`) hat vier Atome und acht Karten. Sie bindet ihre Atome an die Gruppen „II und III“ und an Lernbereiche mit den Titeln „Rechtliches Handeln des Verbrauchers“ und Ähnlichem. Das passt nicht zum aktuellen Lehrplan: Gruppe II hat in Klasse 9 kein Wirtschaft und Recht, und die Lernbereichstitel gibt es dort nicht. Die neue Zelle bindet ihre Atome an Klasse 9, Gruppen **I und III** und die vier Lernbereiche des Lehrplans (`lb1` bis `lb4`). Die vier optionalen englischen Lektionen tragen keine Lehrplanbindung.

Das neue Paket hat 46 Kernlektionen und 4 optionale englische Lektionen mit 150 Karten. Die [Matrix](../wirtschaft-recht-realschule-9/coverage.json) ordnet alle 37 Kompetenzerwartungen der vier Lernbereiche den Lektionen zu. Die praxisorientierte Maßnahme (Experteninterview, Gerichtsbesuch) bleibt eine eigenständige Leistung.

## Die acht Zuordnungen

Die vollständigen unveränderten Alttexte stehen im SHA-256-geprüften [Snapshot](../wirtschaft-recht-realschule-9/tests/fixtures/de-by-realschule-9-wirtschaft-recht-markt-vertraege-kvt.json). `replaces-de-by.json` nennt ID, vollständige Altfrage, Kategorie, Zielslug und Begründung je Karte. Ähnlichkeit allein entscheidet keine Zuordnung.

| Alte Karte | Bisheriger Abruf | Vorschlag | Nachfolger und Begründung |
| --- | --- | --- | --- |
| `…J01` | Stufe der Geschäftsfähigkeit eines 15-Jährigen? | **A: übernehmen** | `wr9-re-lebensalter-check`: dieselbe Stufe, dieselbe Altersgrenze, einzelner Abruf |
| `…J02` | Drei Stufen der Geschäftsfähigkeit und Taschengeldparagraf | **C: ohne Übertrag neu beginnen** | Mehrteiliger Abruf; die neuen Karten fragen die Punkte einzeln |
| `…J03` | Ist die Auslage im Schaufenster ein Antrag? | **A: übernehmen** | `wr9-ve-kaufvertrag-extra`: dieselbe Rechtsfrage am Fahrrad im Schaufenster |
| `…J04` | Vertragsschluss und Hauptpflichten nach § 433 BGB | **C** | Mehrteiliger Abruf; getrennte neue Karten |
| `…J05` | Marktpreis, wenn das Angebot stark steigt | **A: übernehmen** | `wr9-wh-verschiebung-check`: dieselbe Richtung (Preis sinkt) als Gleichgewichtspreis |
| `…J06` | Diagramm skizzieren, Gleichgewicht definieren, Überhänge | **C** | Mehrteiliger Abruf; getrennte neue Karten |
| `…J07` | Sektor zwischen Sparern und Investoren (Banken) | **C** | Erweiterter Kreislauf: nicht Stoff von WR 9 (dort einfacher Kreislauf) |
| `…J08` | Erweiterter Wirtschaftskreislauf mit fünf Sektoren | **C** | wie J07 |

Bei **A** erhält der Nachfolger genau ein `replaces`: Karte und Reviewereignisse werden mit derselben Identität und unveränderten FSRS-Feldern auf den benannten Nachfolger umgebunden. Bei **C** bleiben Karte und Reviews beim alten Token, und die ID steht in `retired_items`, damit der alte Token aus der aktiven Wiederholung genommen wird. Neue Karten erhalten keine behauptete Beherrschung. Wer eine C-Karte hielt, wiederholt ihre Fakten auf den neuen Einzelkarten.

Bei **J07** und **J08** ist die Entscheidung keine reine Lernstandsfrage: Der erweiterte Kreislauf gehört vermutlich in ein späteres Schuljahr. Wer die Karten behalten möchte, kann sie als C unangetastet lassen, ohne sie zu stilllegen; die Katalogsperre erlaubt C-Zeilen ohne `retired_items` ausdrücklich.

## Was geprüft ist und was noch fehlt

1. `tests/contract.test.ts` prüft, dass die Zelle genau die dokumentierten `replaces` und `retired_items` deklariert und `approved` ein Datum mit Thomas' Wortlaut oder `null` ist, nie ein Flag.
2. `scripts/validate-migration.mjs` läuft mit dem in der CI festgelegten zam-core in Wegwerf-Bibliotheken: Karten- und Review-IDs und FSRS-Felder der drei A-Karten bleiben unverändert und hängen am Nachfolger, die fünf C-Karten verlassen die aktive Wiederholung und behalten ihre Historie, ein wiederholter Install ändert nichts, und wer auf Alt- und Nachfolgerkarte schon Reviews hat, bekommt den Merge zurückgewiesen. Der Upgrade von `2026.10.1` ohne alte Zelle ändert keine Karte. Die CI führt das Skript aus.
3. **Offen:** Thomas gibt die Zuordnung frei. Danach erhält `approved` das Datum, `source` seinen Wortlaut und `authorization` die erlaubten `replaces` und `retired_items`; erst dann besteht der Katalogschritt der CI und der PR lässt sich mergen.
4. Danach übernimmt ZAM die veröffentlichten Bytes über `academy:sync`, ergänzt das Lehrplanangebot für Klasse 9 und löst die alte Teilzelle ab. Bis dahin steht der ZAM-Entwurf auf Draft, denn ein Lernender mit Karten auf alter und neuer ID würde den späteren Install ablehnen lassen.
