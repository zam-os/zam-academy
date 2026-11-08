# Mathematik 13 Gymnasium · Bestandsabgleich (freigegeben)

Stand: 8. November 2026. **Thomas hat die Zuordnung freigegeben** – im
OpenCode-Chat am 8. November 2026: „Freigabe für den Bestandsabgleich erteilt -
Du darfst nach den Fixes als admin mergen". Seine Worte, das Datum und der Ort
stehen in `replaces-de-by.json` (`"approved": "2026-11-08"`, `"status":
"approved"`). Der Weg dorthin war der im Paketstandard vorgesehene Vorschlag
ohne Freigabe (Entscheidung vom 22.10.2026); die fünf A-Übernahmen sind mit der
Freigabe aktiv, die sieben C-Karten bleiben mit ihren Historien aktiv, eine
Stilllegung gibt es nicht.

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

## Die zwölf Zuordnungen (5 A / 0 B / 7 C) – freigegeben

Vollständige Altfragen und Begründungen stehen in `replaces-de-by.json`; die
A-Zeilen zeigen auf Nachfolger der neuen Zelle, die C-Zeilen bleiben aktiv.

| Alte Karte | Bisheriger Abruf | Vorschlag | Nachfolger und Begründung |
| --- | --- | --- | --- |
| `…J01` (gebrochen-rational) | Wann schiefe Asymptote bei f = Z/N? | **C: bleibt aktiv** | Asymptoten gebrochen-rationaler Funktionen sind Stoff von M11 (LB 2); M13 LB 1 rechnet uneigentliche Integrale ohne diese Klassifikation. Kein Einzelnachfolger. |
| `…J02` (gebrochen-rational) | Gesamtanalyse: Definitionslücken, Asymptoten, Kurvendiskussion | **C: bleibt aktiv** | Mehrteilig, M11-Stoff (Kurvendiskussion mit Differentialrechnung bis M12 LB 4); eine Historie wird nie auf Teilkarten verteilt. |
| `…J03` (gebrochen-rational) | Für welche p konvergiert ∫₁^∞ 1/xᵖ? | **A: übernommen (freigegeben)** | `g13-konvergenz-1-hoch-p`: gleicher Einzelabruf (p > 1), der Nachfolger nennt zusätzlich den Grenzwert 1 : (p − 1). |
| `…J04` (gebrochen-rational) | Ortskurven, Kurvenscharen, partielle Integration, uneigentliche Integrale | **C: bleibt aktiv** | Mehrteilig und zu großen Teilen jenseits des Fachlehrplans; nur die Konvergenzfrage steckt in `int-7`. |
| `…J01` (Geometrie) | Schnittwinkel Gerade/Ebene: sin β = \|u⃗·n⃗\| / (\|u⃗\|·\|n⃗\|) | **A: übernommen (freigegeben)** | `g13-schnittwinkel-gerade-ebene`: gleicher Einzelabruf, gefordert in M13 LB 3 (Schnittwinkel berechnen). |
| `…J02` (Geometrie) | HNF-Normierung, Punkt-Ebene-Abstand, Lotfußpunkt | **C: bleibt aktiv** | Mehrteilig; `rg-8-abstaende` hat eigene Karten zu jedem Teil, ohne eine Historie zu teilen. |
| `…J03` (Geometrie) | Schnittkreisradius ρ = √(r² − d²) | **A: übernommen (freigegeben)** | `g13-schnittkreisradius`: gleicher Einzelabruf, gefordert in M13 LB 3 (Lage von Kugeln und Ebenen). |
| `…J04` (Geometrie) | Kugelgleichung, Abstand, Lage, Schnittkreis | **C: bleibt aktiv** | Mehrteilige Kugelgesamtanalyse; `rg-9-kugeln` verteilt das auf Gleichung, Lage und quadratische Ergänzung. |
| `…J01` (Stochastik) | P(X = x₀) = 0 bei stetigen Zufallsgrößen | **A: übernommen (freigegeben)** | `g13-stetig-punkt-null`: gleicher Einzelabruf. |
| `…J02` (Stochastik) | Dichtekriterien: Nichtnegativität, Normierung, Wahrscheinlichkeiten | **C: bleibt aktiv** | Mehrteilig; verteilt auf `nv-1-zufallsgroessen` und `nv-3-dichte-verteilung`. |
| `…J03` (Stochastik) | Standardisierung z = (x − μ) : σ | **A: übernommen (freigegeben)** | `g13-standardisierung`: gleicher Einzelabruf. |
| `…J04` (Stochastik) | Normalverteilung, Sigma-Regeln, Satz von Moivre-Laplace | **C: bleibt aktiv** | Mehrteilig und mit Moivre-Laplace über den Fachlehrplan hinaus; die Sigma-Regeln stecken in `nv-4-sigma-regeln`. |

Für jede A-Zeile trägt genau ein Nachfolger `replaces` auf die alte Karte;
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
lokale Datenbanken. Der Lauf installiert die Altschüsse, vergibt je zwei
Reviewereignisse auf alle 12 alten Karten und installiert dann die Zelle: die
**fünf A-Historien wandern unverändert** auf ihre Nachfolger (FSRS-Felder und
24 Reviewereignisse unverändert), die **sieben C-Karten bleiben aktiv**, die
fünf alten Tokens treten aus der aktiven Wiederholung aus. Erst bei
ausdrücklicher Aufnahme entstehen die 79 frischen Karten, wiederholte
Installation und Aufnahme sind idempotent. Für **jede** der fünf Zeilen prüft
ein eigener Wegwerf-Datenbanklauf, dass eine Lernende mit Karten auf Alt- und
Nachfolger-ID den automatischen Merge zurückweist und beide Historien
unverändert bleiben. Die Vertragstests in `tests/contract.test.ts` halten
Freigabedatum, Thomas' Worte und die exakt fünf `replaces` fest.
