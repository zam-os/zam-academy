# Französisch 9 · Lehrplanabgleich und Zuordnung der Alt-Zelle

Stand: 24. Oktober 2026. Das [Academy-Paket](../franzoesisch-realschule-9/) erscheint ab Version `2026.10.2` mit vier `retired_items` und **ohne** `replaces`. Die Zuordnung der vier alten Karten (alle C) hat Thomas am 24. Oktober 2026 ausdrücklich freigegeben. Die alte Zelle `de-by:realschule-9-franzoesisch-imparfait-futur-objektpronomen` wird danach in ZAM nicht mehr gebündelt; ihre Karten und Reviewhistorien bleiben erhalten.

## Wer Französisch 9 hat

Die [Realschulordnung, Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1) führt Französisch nur in der **Wahlpflichtfächergruppe IIIa** als „Zweite Fremdsprache (Französisch)“, mit vier Wochenstunden in Klasse 7, drei in Klasse 8 und je vier in Klasse 9 und 10. In den Gruppen I, II und IIIb gibt es kein Französisch. Klasse 9 ist damit das dritte Lernjahr. Die Zelle trägt deshalb `track: "IIIa"` in ihrer Lehrplanbindung. Die Mittelschule hat nach der Stundentafel ([MSO, Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayMSO-ANL_1)) kein Fach Französisch.

## Lehrplan

Der [Fachlehrplan Französisch 9](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch) wurde am 24. Oktober 2026 im Original gelesen. Er hat fünf Lernbereiche: 1 Kommunikative Kompetenzen (1.1 Fertigkeiten, 1.2 sprachliche Mittel mit Wortschatz, Grammatik und Aussprache), 2 Interkulturelle Kompetenzen, 3 Text- und Medienkompetenzen, 4 Methodische Kompetenzen, 5 Themengebiete. Er enthält **51 Kompetenzerwartungen**; die [Matrix](../franzoesisch-realschule-9/coverage.json) ordnet jede mit ihrem Wortlaut den Lektionen zu. Die Themengebiete nennen Stunden (zum Beispiel Freundschaft 20, Medien 15, Schulleben 20, Berufsleben 20, Paris 15, Nachbarländer 10) und „aktuelle Themen“.

Das Paket hat 56 Lektionen in sieben Stufen und 168 Karten, drei je Lektion. Der Lernpfad ordnet Lernbereich 1.2 als Grammatik (21 Lektionen) und danach Wortschatz und Aussprache (10 Lektionen). Einige Lektionen decken Erwartungen zweier Einheiten ab (zum Beispiel „Konnektoren“ die Wortschatz-Erwartung 1.2.1.7 und die Schreib-Erwartung 1.1.8).

## Was die App nicht prüft

Unter `outside_app` in `coverage.json` und in den betroffenen Zeilen der Matrix steht, was bei Hören, Sprechen und Aussprache offen bleibt: Die App spielt keinen Ton ab und nimmt keine Sprache auf. Die Lektionen üben mit Transkripten, Dialogvorlagen und schriftlichen Planungen und verweisen auf Hörproben in Online-Wörterbüchern. Aktuelle Themen verlangen eine eigene Recherche (die Lektion übt Methode und Einordnung an einem erfundenen Beispiel), Austausch und Praktikum bleiben Erfahrungen außerhalb der App.

## Grenzen des Paketstandes

- **Schreibaufgaben** werden mit einem Mustertext verglichen und selbst eingeschätzt, nicht bewertet.
- **Kulturelle Aussagen** (Schulsystem, Paris, Belgien, Gepflogenheiten) sind als „typisch“ formuliert und beruhen auf der Stundentafel, dem Lehrplan und allgemein bekanntem Wissen; Prüfende sollten sie vor der Veröffentlichung mit einer Fachlehrkraft Französisch abgleichen.
- **Grammatik jenseits des Plans** (Konditional, Subjonctif, `lequel`, `dont`, Pronomen-Kombinationen) kommt nicht vor. Wo eine Form im Lehrplan der Klasse 10 steht (zum Beispiel `ce que` und `ce qui`), nutzt die Lektion zur indirekten Frage sie nur in dieser einen Funktion.
- **Lehrervideos** sind nicht enthalten; sie folgen in einem eigenen Schritt (Paketstandard).

## Die vier alten Karten

Die Teilzelle (Version `2026.08.1`) hat zwei Atome und vier Karten: Imparfait (Bildung, Verwendung gegenüber dem passé composé) und Objektpronomen (direkt, indirekt, Stellung). Sie bindet ihre Atome an Klasse 9, Gruppe IIIa und den Lernbereich 1. Das passt zur neuen Zelle. Die Zuordnung (`replaces-de-by.json`, vier Zeilen mit Grund) hält fest:

| Alte Karte | Entscheidung | Grund |
| --- | --- | --- |
| J01 Stamm des imparfait | C, stillgelegt | Die neuen Karten fragen die Bildung samt Ausnahme `être` und einzelne Formen, kein sicher gleicher Einzelabruf. |
| J02 Bildung, Gebrauch und passé composé in einer Antwort | C, stillgelegt | Die neue Zelle trennt das in drei Lektionen mit eigenen Karten; keine hat den Gesamtumfang. |
| J03 Stellung der Objektpronomen | C, stillgelegt | Objektpronomen sind Vorwissen aus Klasse 7 und 8 und nicht Teil des Plans der Klasse 9; die neue Zelle hat nur eine Karte zur Stellung von `y` und `en`. |
| J04 direkte und indirekte Objektpronomen | C, stillgelegt | Die Unterscheidung steht im Plan der Klasse 8; kein Nachfolger. |

Der Plan der Klasse 8 nennt „les pronoms objets directs (le, la, les) + position“ und „les pronoms objets indirects (lui, leur) + position“, der Plan der Klasse 7 „les pronoms objets directs dans la phrase affirmative et négative“. Damit sind die Objektpronomen Vorwissen. Persönliche Karten und Reviewhistorien bleiben in jedem Fall erhalten; stillgelegt heißt, dass die Karten nicht mehr in aktive Wiederholungen kommen. Die Objektpronomen (J03, J04) sind Vorwissen aus Klasse 7 und 8; das Paket Französisch 9 übt sie nicht mehr, ein Paket Französisch 8 würde sie abdecken.

## Reihenfolge bis zur nächsten ZAM-Veröffentlichung

1. Academy-App, Zelle, Matrix und diese Zuordnung reviewen; eine Fachlehrkraft Französisch liest die Lektionen gegen.
2. Academy mergen und die Veröffentlichung der Zelle im Katalog prüfen.
3. In einem eigenen ZAM-PR gezielt `franzoesisch-realschule-9` synchronisieren (Version 2026.10.2) und die alte Zelle aus dem Bundle nehmen. Weil kein `replaces` deklariert wird, ändert sich an den Karten der neuen Zelle nichts; die vier alten Karten verlassen die aktiven Wiederholungen.
