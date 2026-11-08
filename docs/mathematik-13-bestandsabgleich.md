# Mathematik 13 Gymnasium · Bestandsabgleich (Vorschlag ohne Freigabe)

Stand: 8. November 2026. **Keine Freigabe vorhanden.** `replaces-de-by.json`
trägt `"approved": null` und `"status": "proposal-only"`; die Zelle erscheint
ohne `replaces` und ohne `retired_items`, wie es der Paketstandard für neue
Zellen verlangt (Entscheidung vom 22.10.2026). Erst Thomas' ausdrückliche
Freigabe – dokumentiert mit Datum, seinen Worten und Ort in `replaces-de-by.json`
– darf die hier vorgeschlagenen Übernahmen aktivieren. Bis dahin bleiben alle
alten Karten mit ihren Historien unverändert aktiv.

## Ausgangsbestand

zam-os/zam bündelt drei Zellen zu Mathematik 13 des Gymnasiums mit zusammen
12 Karten (vier pro Zelle, je zwei kurze Abrufe und zwei mehrteilige
Gesamtaufgaben):

| Alte Zelle | Inhalt | Karten |
| --- | --- | --- |
| `de-by:gymnasium-13-mathematik-gebrochen-rationale-funktionen-asymptoten-uneigentliche-integrale` | Polstellen und Asymptoten gebrochen-rationaler Funktionen, Kurvenscharen, uneigentliche Integrale | 4 |
| `de-by:gymnasium-13-mathematik-geometrie-abstaende-hesse-kugeln-schnittwinkel` | Hesse'sche Normalform, Abstände im Raum, Schnittwinkel, Kugel-Ebene | 4 |
| `de-by:gymnasium-13-mathematik-stochastik-stetige-zufallsgroessen-normalverteilung-sigma-regeln` | Stetige Zufallsgrößen, Dichtefunktionen, Normalverteilung, Sigma-Regeln | 4 |

Bytegleiche Schnappschüsse liegen in
[`tests/fixtures/`](../mathematik-gymnasium-13/tests/fixtures/), je mit
SHA-256, Herkunftscommit `e6a235f7` aus `zam-os/zam` und Versionsnummer in
`replaces-de-by.json`. `validate-migration.mjs` prüft die Hashes vor jedem
Lauf; die Snapshots dürfen sich nicht mitbewegen.

## Die zwölf Zuordnungen (5 A / 0 B / 7 C)

Vollständige Altfragen und Begründungen stehen in `replaces-de-by.json`; die
A-Zeilen zeigen auf Nachfolger der neuen Zelle, die C-Zeilen bleiben aktiv.

| Alte Karte | Bisheriger Abruf | Vorschlag | Nachfolger und Begründung |
| --- | --- | --- | --- |
| `…J01` (gebrochen-rational) | Wann schiefe Asymptote bei f = Z/N? | **C: bleibt aktiv** | Asymptoten gebrochen-rationaler Funktionen sind M12-Stoff; M13 LB 1 rechnet uneigentliche Integrale ohne diese Klassifikation. Kein Einzelnachfolger. |
| `…J02` (gebrochen-rational) | Gesamtanalyse: Definitionslücken, Asymptoten, Kurvendiskussion | **C: bleibt aktiv** | Mehrteilig und M12; eine Historie wird nie auf Teilkarten verteilt. |
| `…J03` (gebrochen-rational) | Für welche p konvergiert ∫₁^∞ 1/xᵖ? | **A: übernehmen** | `g13-konvergenz-1-hoch-p`: gleicher Einzelabruf (p > 1), der Nachfolger nennt zusätzlich den Grenzwert 1 : (p − 1). |
| `…J04` (gebrochen-rational) | Ortskurven, Kurvenscharen, partielle Integration, uneigentliche Integrale | **C: bleibt aktiv** | Mehrteilig und zu großen Teilen jenseits des Fachlehrplans; nur die Konvergenzfrage steckt in `int-7`. |
| `…J01` (Geometrie) | Schnittwinkel Gerade/Ebene: sin β = \|u⃗·n⃗\| / (\|u⃗\|·\|n⃗\|) | **A: übernehmen** | `g13-schnittwinkel-gerade-ebene`: gleicher Einzelabruf, gefordert in M13 LB 3 (Schnittwinkel berechnen). |
| `…J02` (Geometrie) | HNF-Normierung, Punkt-Ebene-Abstand, Lotfußpunkt | **C: bleibt aktiv** | Mehrteilig; `rg-8-abstaende` hat eigene Karten zu jedem Teil, ohne eine Historie zu teilen. |
| `…J03` (Geometrie) | Schnittkreisradius ρ = √(r² − d²) | **A: übernehmen** | `g13-schnittkreisradius`: gleicher Einzelabruf, gefordert in M13 LB 3 (Lage von Kugeln und Ebenen). |
| `…J04` (Geometrie) | Kugelgleichung, Abstand, Lage, Schnittkreis | **C: bleibt aktiv** | Mehrteilige Kugelgesamtanalyse; `rg-9-kugeln` verteilt das auf Gleichung, Lage und quadratische Ergänzung. |
| `…J01` (Stochastik) | P(X = x₀) = 0 bei stetigen Zufallsgrößen | **A: übernehmen** | `g13-stetig-punkt-null`: gleicher Einzelabruf. |
| `…J02` (Stochastik) | Dichtekriterien: Nichtnegativität, Normierung, Wahrscheinlichkeiten | **C: bleibt aktiv** | Mehrteilig; verteilt auf `nv-1-zufallsgroessen` und `nv-3-dichte-verteilung`. |
| `…J03` (Stochastik) | Standardisierung z = (x − μ) : σ | **A: übernehmen** | `g13-standardisierung`: gleicher Einzelabruf. |
| `…J04` (Stochastik) | Normalverteilung, Sigma-Regeln, Satz von Moivre-Laplace | **C: bleibt aktiv** | Mehrteilig und mit Moivre-Laplace über den Fachlehrplan hinaus; die Sigma-Regeln stecken in `nv-4-sigma-regeln`. |

Für jede A-Zeile wird genau ein Nachfolger nach der Freigabe `replaces` tragen;
die drei Nachfolger `g13-schnittwinkel-gerade-ebene`, `g13-schnittkreisradius`
und `g13-standardisierung` sind zusätzlich zu den Lektionskarten angelegt,
weil ihre Einzelabrufe fachlich zu M13 LB 2/3 gehören und vorher keine eigene
Karte hatten. B-Zeilen gibt es keine: Keine der alten mehrteiligen
Gesamtaufgaben passt vollständig in eine Lektion von M13. C-Karten werden
weder ersetzt noch stillgelegt; persönliche Karten und Reviewhistorien bleiben
unverändert.

## Prüfung ohne persönliche Bibliothek

`mathematik-gymnasium-13/scripts/validate-migration.mjs` verwendet die in CI
gepinnte veröffentlichte Kernversion (0.54.0) und ausschließlich wegwerfbare
lokale Datenbanken. Der Lauf zeigt zuerst, dass die **veröffentlichte Zelle**
nichts verändert (alle 12 alten Karten aktiv, FSRS-Felder und 24
Reviewereignisse unverändert, keine Übernahme erklärt, 84 frische Karten erst
bei ausdrücklicher Aufnahme, Wiederholung idempotent) und probiert danach den
**Vorschlag** nur in weiteren Wegwerf-Datenbanken: fünf Historien wandern
unverändert auf ihre Nachfolger, sieben alte Karten bleiben aktiv, wiederholte
Installation bleibt stabil, und eine Lernende mit Karten auf Alt- und
Nachfolger-ID weist den automatischen Merge zurück, beide Historien bleiben
unverändert. Der Zell-Test in `tests/contract.test.ts` verlangt zusätzlich,
dass die öffentliche Zelle keine `replaces` und keine `retired_items` trägt.
