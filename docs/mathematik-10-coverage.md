# Realschule Bayern · Abdeckung Mathematik Klasse 10

Arbeitsstand: 22. Oktober 2026. Paket [`mathematik-realschule-10/`](../mathematik-realschule-10/), Zelle `zam-academy:mathematik-realschule-10`. Grundlage sind die Fachlehrpläne Mathematik 10 der Realschule für [Zweig I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg1) und [Zweig II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg2-3). lehrplanplus.bayern.de blockt einige Netze mit 403; geprüft wurde deshalb an den Webarchiv-Schnappschüssen vom [2. Dezember 2024 (I)](https://web.archive.org/web/20241202133144/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg1) und vom [8. August 2025 (II/III)](https://web.archive.org/web/20250808165154/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg2-3).

## Lernbereiche, Zweige und Etappen

| Lernbereich | Zweig I | Zweig II/III | Etappe und Lektionen |
| --- | --- | --- | --- |
| Trigonometrie | LB 1, ca. 42 Std. (mit Skalarprodukt) | LB 1, ca. 21 Std. | 1 Einheitskreis: `tr-1` bis `tr-6` (II/III: `tr-1` bis `tr-4`) · 2 Dreieck und Raum: `dr-1` bis `dr-5` (II/III: `dr-1` bis `dr-4`) · Skalarprodukt in Etappe 3: `vk-1` bis `vk-3` (nur I) |
| Abbildungen | LB 2, ca. 30 Std. | – | 3 Vektoren und Abbildungen: `ab-1` bis `ab-5`; Funktionsgraphen abbilden als `ab-6` in Etappe 5 |
| Potenzen und Potenzfunktionen | LB 3, ca. 16 Std. | – | 4: `pt-1` bis `pt-5` |
| Exponentialfunktionen, Logarithmen (I: und Logarithmusfunktionen) | LB 4, ca. 22 Std. | LB 3, ca. 10 Std. | 5: `el-1` bis `el-6` (II/III: `el-1` bis `el-3`) |
| Raumgeometrie | – (M9 LB 5) | LB 2, ca. 20 Std. | 6: `rg-1` bis `rg-5` |
| Quadratische Funktionen und Gleichungen | – (M9 LB 7) | LB 4, ca. 35 Std. | 7: `qf-1` bis `qf-6` |
| Daten und Zufall | LB 5, ca. 10 Std. | LB 5, ca. 10 Std. | 8: `dz-1` bis `dz-3` |

Zweig I sieht 34 Lektionen, Zweig II/III 25, „alle Lektionen“ 45. Alle 46 Kompetenzerwartungen beider Zweige stehen wörtlich mit ihren Lektionen und Belegen in [`coverage.json`](../mathematik-realschule-10/coverage.json); der App-Test prüft die Zuordnung in beide Richtungen und dass jede Lektion ihren Lernbereich im `lehrplan`-Text nennt.

## Abgrenzung

- **Nicht enthalten, weil nicht im Realschul-Lehrplan:** Bogenmaß, bedingte Wahrscheinlichkeit, Vierfeldertafel, stochastische Unabhängigkeit, Erwartungswert, Sinusfunktionen mit Parametern a, b, c, d. Der erste Entwurf dieses PRs enthielt einige davon.
- **Wiederholung früherer Jahrgänge, ausdrücklich markiert:** `vk-1` (Verbindungsvektor, Betrag aus M8/M9 I) als Grundlage des Skalarprodukts, `ab-4` (Determinante aus M8 I) als Werkzeug für Flächen bei Abbildungen und in der Abschlussprüfung.
- **Zweig II/III:** Raumgeometrie und quadratische Funktionen kommen dort erst in Klasse 10 und bekommen eigene Lektionen; Zweig I lernt sie in Mathe 9 (`rg-*`, `qf-*` nur Zweig I). Drei-Punkte-Parabeln (Gleichungssysteme mit drei Unbekannten) entfallen, weil II/III nur Systeme mit zwei Unbekannten kennt. Extremwerte bei Körpern laufen über Wertetabelle und Graph, ohne Ableitung.
- **Daten und Zufall:** Mathe 9 behandelt Baumdiagramm und Pfadregeln bereits (unter „M9 LB 8“, siehe [#28](https://github.com/zam-os/zam-academy/issues/28)). Mathe 10 vertieft auf Klasse-10-Niveau: drei und mehr Stufen, ohne Zurücklegen, Ereignisse aus mehreren Pfaden, „Wie oft mindestens“ mit dem Logarithmus aus `el-3`.
- **Notation** nach der ISB-Merkhilfe: ⊙ für das Skalarprodukt, ⊕ für die Verschiebung, die Spiegelmatrix mit 2α.

## Lehrervideos

42 der 45 Lektionen verlinken ein deutsches Erklärvideo (Daniel Jung, Lehrerschmidt, MathemaTrick, „Lernen - Leicht gemacht“ mit Realschul-Bayern-Bezug u. a.). Für jedes wurden Titel und Kanal am 22.10.2026 per YouTube-oEmbed abgefragt und mit dem Thema abgeglichen; die Liste steht zentral in `src/curriculum/teacher-videos.ts`, die Tests pinnen sie. Ohne Video sind noch `tr-6-additionstheoreme` (die gefundenen Erklärungen rechnen im Bogenmaß), `pt-4-parameter` und `rg-5-extremwerte` (die gefundenen Videos nutzen Ableitungen). Sie bleiben für einen späteren Erweiterungslauf offen.

## Bestandsabgleich der ZAM-Zellen

zam-os/zam bündelt zwei Zellen mit zusammen 16 Karten: `de-by:realschule-10-mathematik-ebene-vektorgeometrie` (8) und `de-by:realschule-10-mathematik-exponential-logarithmus` (8). Die alte Vektorgeometrie-Zelle mischt Stoff aus M8/M9 (Betrag, Determinante, 90°-Drehung) mit M10 (Skalarprodukt, Drehmatrix); alle 16 Fragen werden in der neuen App gelehrt.

| Altkarte | Thema | Kategorie | Nachfolger |
| --- | --- | --- | --- |
| Vektor J01 | Betrag von (3 \| 4) | A | `m10-betrag-vektor` (`vk-1`) |
| Vektor J02 | Verbindungsvektor, Gegenvektor, Länge | B | `m10-verbindungsvektor-beispiel` (`vk-1`) |
| Vektor J03 | Orthogonalitätsbedingung | A | `m10-orthogonal-bedingung` (`vk-2`) |
| Vektor J04 | Skalarprodukt, Lage und Winkel | B | `m10-skalarprodukt-beispiel` (`vk-2`) |
| Vektor J05 | Formel der zweireihigen Determinante | A | `m10-determinante-formel` (`ab-4`) |
| Vektor J06 | Dreiecksfläche mit der Determinante | B | `m10-dreiecksflaeche-beispiel` (`ab-4`) |
| Vektor J07 | Drehung um 90° | A | `m10-drehung-90` (`ab-3`) |
| Vektor J08 | Drehmatrix und Drehung um 60° | B | `m10-drehmatrix-beispiel` (`ab-3`) |
| Exp./Log. J01 | Asymptote von 2 · 3ˣ − 4 | A | `m10-asymptote-exponentialfunktion` (`el-5`) |
| Exp./Log. J02 | Parameter von a · bˣ + c | B | `m10-exponentialfunktion-parameter` (`el-5`) |
| Exp./Log. J03 | lg 1000 und log₂ 32 | A | `m10-log-exakte-werte` (`el-3`) |
| Exp./Log. J04 | Logarithmensätze und Basiswechsel | B | `m10-logarithmensaetze-basiswechsel` (`el-4`) |
| Exp./Log. J05 | 5ˣ = 125 und 3ˣ = 20 | A | `m10-exponentialgleichung-exakt` (`el-3`) |
| Exp./Log. J06 | 4 · 2^(3x − 1) − 12 = 20 | A | `m10-exponentialgleichung-schrittweise` (`el-4`) |
| Exp./Log. J07 | Halbwertszeit 8 Tage, nach 24 Tagen | A | `m10-halbwertszeit-achtel` (`el-2`) |
| Exp./Log. J08 | Bakterienkultur, Bestand und Verdopplungszeit | B | `m10-bakterien-verdopplungszeit` (`el-2`) |

**A** heißt gleicher Einzelabruf mit genau einem Nachfolger. **B** heißt: Die alte mehrteilige Frage bleibt mit ihrer ganzen Antwort und Musterlösung auf genau einer eigenen Karte; die neuen Einzelkarten der Lektion beginnen ohne Beherrschung. C-Zeilen gibt es nicht. Die Begründung jeder Zeile steht in [`replaces-de-by.json`](../mathematik-realschule-10/replaces-de-by.json), die alten Zellen liegen als Byte-Schnappschüsse in `tests/fixtures/` (zam-os/zam `370d622`).

**Status: am 22.10.2026 von Thomas freigegeben** („Freigabe erteilt“, in diesem Claude-Code-Chat nach der Überarbeitung von #23). Eine frühere Angabe `approved: 2026-10-22` ohne Beleg aus dem ersten Entwurf war keine Freigabe und wurde vorher entfernt. `scripts/validate-migration.mjs` prüft mit zam-core 0.54.0: 16 Historien und 32 Review-Ereignisse wandern unverändert, die alten Karten verlassen die aktiven Wiederholungen, wiederholte Installationen ändern nichts, und wer schon Karten auf beiden IDs hält, bekommt kein automatisches Zusammenlegen. Bei Atomen mit zwei übernommenen Historien legt ZAM die übrigen neuen Karten nacheinander an, je eine pro Einschreibung.
