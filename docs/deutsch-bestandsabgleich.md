# Deutsch 9 · Lehrplanabgleich und Vorschlag zur Alt-Zelle

Stand: 23. Oktober 2026. **Die acht Zuordnungen unten sind ein Vorschlag und nicht freigegeben.** Das neue [Academy-Paket](../deutsch-realschule-9/) ist eine neue Zelle: Sie deklariert weder `replaces` noch `retired_items`, daher ändert ihre Veröffentlichung keine Lernhistorie. Die alte Zelle `de-by:realschule-9-deutsch-argumentation-eroerterung` bleibt in ZAM unverändert aktiv, bis die Zuordnung ausdrücklich freigegeben ist.

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

| Alte Karte | Bisheriger Abruf | Vorschlag | Begründung |
| --- | --- | --- | --- |
| `…J01` | Baustein eines Arguments, der Beispiel oder Beleg liefert | **C** | Gleiches Thema, aber andere Abrufrichtung: Die neuen Karten fragen, woraus ein Argument besteht |
| `…J02` | Dreigliedriger Aufbau erklären und eigenes Argument formulieren | **C** | Mehrteilig; die Schreibaufgaben üben das Formulieren |
| `…J03` | Sanduhr-Prinzip der dialektischen Erörterung | **C** | Nicht Stoff von Deutsch 9 (3.2.5: einfacher Kommentar) |
| `…J04` | Vollständige Struktur der dialektischen Erörterung | **C** | wie J03, mehrteilig |
| `…J05` | Alliteration | **C** | Nicht in der Stilmittelliste von 4.2.4, in der neuen Zelle nicht gefragt |
| `…J06` | Fünf Stilmittel mit Definition, Beispiel und Wirkung | **C** | Mehrteilig; die neuen Karten fragen einzeln, die Personifikation steht nicht im Plan |
| `…J07` | Kennzeichnung eines wörtlichen Zitats | **C** | Kein identischer Nachfolger: Die neuen Zitierkarten fragen Auslassung, Einbau und sinngemäßes Zitat |
| `…J08` | Wörtliches und sinngemäßes Zitat, vier Kriterien der Quellenkritik | **C** | Mehrteilig; Quellenkritik an Online-Quellen kommt nicht als eigener Abruf vor |

Bei **C** bleiben Karte und Reviews beim alten Token, und es gibt kein `replaces`. Es gibt in diesem Vorschlag keine **A**-Zeile: Keine neue Karte fragt denselben Einzelpunkt wie eine alte. Wer die alten Karten aus der aktiven Wiederholung nehmen will, nimmt ihre IDs in `retired_items` auf, die Kategorie C lässt das ausdrücklich zu. Ob alle acht, nur die nicht lehrplankonformen (J03, J04, J05) oder keine stillgelegt werden, entscheidet Thomas.

## Was bei Freigabe geschieht

1. `approved` erhält das Freigabedatum, `source` den Wortlaut und `authorization` die erlaubten `retired_items`.
2. Die Zelle erhält `retired_items` für die gewünschten Karten und die Version `2026.10.2`; `tests/contract.test.ts` prüft die Deklaration gegen die Zuordnung.
3. Ein Skript `scripts/validate-migration.mjs` wie bei den anderen Paketen prüft mit dem veröffentlichten zam-core, dass die stillgelegten Karten die aktive Wiederholung verlassen und ihre Historie behalten; der CI-Job wird ergänzt.
4. ZAM übernimmt die veröffentlichten Bytes über `academy:sync`, ergänzt das Lehrplanangebot und löst die alte Teilzelle ab.
