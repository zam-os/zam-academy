# Deutsch 9 · Lehrplanabgleich und Zuordnung der Alt-Zelle

Stand: 23. Oktober 2026. Das [Academy-Paket](../deutsch-realschule-9/) wurde als Zelle `2026.10.1` ohne `replaces` und `retired_items` veröffentlicht. Seit Version `2026.10.2` deklariert die Zelle die acht `retired_items` der C-Zeilen und kein `replaces`, genau wie unten dokumentiert. **Thomas hat die Zuordnung am 23. Oktober 2026 freigegeben und alle acht Karten zur Stilllegung bestätigt** (`approved` in `replaces-de-by.json`, sein Wortlaut in `source`). Die alte Zelle `de-by:realschule-9-deutsch-argumentation-eroerterung` wird danach in ZAM nicht mehr gebündelt; Karten und Reviewhistorien bleiben erhalten.

## Lehrplan

Deutsch 9 hat in der Realschule **einen gemeinsamen Fachlehrplan** für alle Wahlpflichtfächergruppen ([LehrplanPLUS Realschule Deutsch 9](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/deutsch)) mit vier Lernbereichen: 1 Sprechen und Zuhören, 2 Lesen – mit Texten und weiteren Medien umgehen, 3 Schreiben, 4 Sprachgebrauch und Sprache untersuchen und reflektieren. Der Plan nennt keine Stundenzahlen. Er enthält 51 Kompetenzerwartungen; die [Matrix](../deutsch-realschule-9/coverage.json) ordnet jede mit ihrem Wortlaut den Lektionen zu. Die Zelle trägt deshalb keine Wahlpflichtfächergruppe in ihrer Lehrplanbindung.

Der Lehrplantext wurde aus einem Schnappschuss des Internet Archive vom 13. Februar 2026 gelesen, weil die Originalseite von der Arbeitsumgebung aus nicht erreichbar war; die Pläne der Klassen 8 und 10 dienten zum Abgleich der Nachbarjahrgänge (Schnappschüsse vom 9. Juni 2026 und 27. Juni 2024). Prüfende sollten den Text mit der Live-Seite vergleichen.

Das Paket hat 53 Lektionen und 159 Karten, drei je Lektion. Vier Kompetenzerwartungen brauchen je zwei Lektionen (2.2.1 Novelle und Drama, 2.4.2 Filmsprache und eigene Filmsequenz, 4.2.4 Stilmittel und Stilarten, 4.3.3 Zeichensetzung und Gliederungen). Was die App nicht prüfen kann (Sprechen, Spielen, Ganzschriften lesen, Medien produzieren), steht in `coverage.json` unter `outside_app`; die Lektionen bereiten es vor und werten es schriftlich aus.

## Zur Rechtschreibung

Das Amtliche Regelwerk wurde zum 1. Juli 2024 neu gefasst. Eine Regeländerung betrifft die Zeichensetzung: Infinitivgruppen („erweiterter Infinitiv mit zu“) werden verbindlich durch Komma abgetrennt (Seite des Rats für deutsche Rechtschreibung, Regelwerk § 73). Die Lektionen und alle Prüfaufgaben folgen dieser Fassung; Aufgaben stehen nur dort, wo die Regel genau eine Lösung lässt.

## Bekannte Prüfpunkte

Diese Stellen sind fachlich vertretbar, aber Auslegung oder Konvention, und ein Fachprüfer sollte sie ansehen:

- **Vier-Seiten-Modell in Klasse 9** (`de-kommunikation-konflikte`): Der Plan der Klasse 9 sagt nur „ein Kommunikationsmodell“, der Plan der Klasse 10 nennt das Nachrichtenquadrat ausdrücklich. Die Lektion nutzt es als Beispielmodell mit Brücke zu Klasse 8 („Information, Gefühle, Appell“ plus Beziehung).
- **Konventionen sind als solche gekennzeichnet:** Aufbau von Debatte und Präsentation, Zitierformen (`vgl.`, Zeilenangaben), Portfolio-Aufbau, Korrekturzeichen (die ISB-Handreichung verwendet „Z“ für den Zeitfehler, manche Lehrkräfte für die Zeichensetzung).
- **Epochengrenzen** (Vormärz, Realismus, Naturalismus, Romantik) sind „etwa“-Angaben; Handbücher weichen ab.
- **Offene Auslegung:** Der Lehrplan sagt in 3.2.5 „offene und geschlossene Formen“ des Argumentierens und gibt keine Definition; die Lektion legt sich nicht fest.
- **Quellen, die nur im Internet Archive lesbar waren:** die ISB-Handreichungen und -Lernaufgaben zu Korrekturzeichen, Fragelawine und Textwanderung. Die Seiten lehnen die Arbeitsumgebung ab (403).

## Die acht alten Karten

Die Teilzelle (Version `2026.08.1`) hat vier Atome und acht Karten zu Argumentation, Erörterung, Stilmitteln und Zitieren. Sie bindet ihre Atome an die Lernbereiche 2 („Texte schreiben“) und 3 („Lesen – mit Texten und Medien umgehen“) und an die Zweige I und II/III. Das ist vertauscht: Im Plan ist Lernbereich 2 das Lesen und 3 das Schreiben, und der Plan kennt keine Zweige. Die neue Zelle bindet an Klasse 9 und die vier Lernbereiche des Plans, ohne Zweig.

Die vollständigen Alttexte stehen im SHA-256-geprüften [Snapshot](../deutsch-realschule-9/tests/fixtures/de-by-realschule-9-deutsch-argumentation-eroerterung-kvt.json). `replaces-de-by.json` nennt ID, vollständige Altfrage, Kategorie und Begründung je Karte. Ähnlichkeit allein entscheidet keine Zuordnung.

| Alte Karte | Bisheriger Abruf | Zuordnung | Begründung |
| --- | --- | --- | --- |
| `…J01` | Baustein eines Arguments, der Beispiel oder Beleg liefert | **C** | Gleiches Thema, aber andere Abrufrichtung: Die neuen Karten fragen, woraus ein Argument besteht |
| `…J02` | Dreigliedriger Aufbau erklären und eigenes Argument formulieren | **C** | Mehrteilig; die Schreibaufgaben üben das Formulieren |
| `…J03` | Sanduhr-Prinzip der dialektischen Erörterung | **C** | Nicht Stoff von Deutsch 9 (3.2.5: einfacher Kommentar) |
| `…J04` | Vollständige Struktur der dialektischen Erörterung | **C** | wie J03, mehrteilig |
| `…J05` | Alliteration | **C** | Nicht in der Stilmittelliste von 4.2.4, in der neuen Zelle nicht gefragt |
| `…J06` | Fünf Stilmittel mit Definition, Beispiel und Wirkung | **C** | Mehrteilig; die neuen Karten fragen einzeln, die Personifikation steht nicht im Plan |
| `…J07` | Kennzeichnung eines wörtlichen Zitats | **C** | Kein identischer Nachfolger: Die neuen Zitierkarten fragen Auslassung, Einbau und sinngemäßes Zitat |
| `…J08` | Wörtliches und sinngemäßes Zitat, vier Kriterien der Quellenkritik | **C** | Mehrteilig; Quellenkritik an Online-Quellen kommt nicht als eigener Abruf vor |

Bei **C** bleiben Karte und Reviews beim alten Token, und es gibt kein `replaces`. Es gibt keine **A**-Zeile: Keine neue Karte fragt denselben Einzelpunkt wie eine alte. Alle acht IDs stehen in `retired_items`, damit die alten Karten aus der aktiven Wiederholung verschwinden; Thomas hat auf die Rückfrage, ob alle acht, nur die nicht lehrplankonformen (J03, J04, J05) oder keine stillgelegt werden, „Alle acht“ gewählt. Die fünf Karten J01, J02, J06, J07 und J08 fragen ihre Inhalte in der neuen Zelle feiner oder anders; ihre Historie bleibt am alten Token erhalten.

## Was geprüft ist

1. `tests/contract.test.ts` prüft, dass die Zelle genau die dokumentierten `retired_items` und kein `replaces` deklariert und `approved` ein Datum mit Thomas' Wortlaut oder `null` ist, nie ein Flag.
2. `scripts/validate-migration.mjs` läuft mit dem in der CI festgelegten zam-core in Wegwerf-Bibliotheken: Die acht alten Karten und ihre 16 Reviewereignisse bleiben unverändert, die alten Tokens sind `deprecated` und kommen nie in die Wiederholung zurück, ein wiederholter Install und die Einschreibung der 159 neuen Karten ändern nichts an ihnen, und ein Upgrade von `2026.10.1` ohne alte Zelle ändert keine Karte.
3. Freigabe: `approved` trägt das Datum, `source` den Wortlaut und `authorization` die erlaubten `retired_items`. Damit besteht der Katalogschritt der CI (`scripts/mapping-approval.mjs` prüft zusätzlich, dass die Zelle genau die dokumentierten Zeilen deklariert).
4. ZAM übernimmt die veröffentlichten Bytes über `academy:sync`, löst die alte Teilzelle ab und bündelt den Alt-Snapshot nur noch als Testfixture.
