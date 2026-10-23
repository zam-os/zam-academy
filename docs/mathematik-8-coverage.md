# Realschule Bayern · Abdeckung Mathematik Klasse 8

Arbeitsstand: 23. Oktober 2026. Paket [`mathematik-realschule-8/`](../mathematik-realschule-8/), Zelle `zam-academy:mathematik-realschule-8`. Grundlage sind die Fachlehrpläne Mathematik 8 der Realschule für [Zweig I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg1) und [Zweig II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg2-3). lehrplanplus.bayern.de blockt einige Netze mit 403; geprüft wurde deshalb an den Webarchiv-Schnappschüssen vom [13. April 2024 (I)](https://web.archive.org/web/20240413214556/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg1) und vom [18. April 2026 (II/III)](https://web.archive.org/web/20260418170947/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg2-3), für die Abgrenzung zusätzlich an den Fachlehrplänen Mathematik 5, 6, 7 und 9.

## Lernbereiche, Zweige und Etappen

| Lernbereich | Zweig I | Zweig II/III | Etappe und Lektionen |
| --- | --- | --- | --- |
| Dreiecke | – (M7 LB 3) | LB 1, mit Vierecken ca. 16 Std. | 1: `dv-1` bis `dv-3` |
| Vierecke | LB 1, ca. 12 Std. | LB 1 | 1: `dv-4` bis `dv-6` |
| Drehung | LB 2, ca. 6 Std. | – | 2: `dr-1` bis `dr-3` |
| Raumgeometrie | LB 3, ca. 13 Std. (Symmetrie, Axialschnitte, Koordinaten) | LB 2, ca. 7 Std. (Schrägbilder, wahre Größe) | 3: `rg-1` bis `rg-4` (I), `rg-5` und `rg-6` (II/III) |
| Terme und Gleichungen (I: und Ungleichungen) | LB 4, ca. 40 Std. | LB 3, ca. 40 Std. | 4: `tg-1` bis `tg-9` (`tg-9` Ungleichungen nur I) |
| Bruchterme und Bruchgleichungen | LB 5, ca. 7 Std. | LB 4, ca. 5 Std. | 5: `br-1` bis `br-3` |
| Funktionen | LB 6, ca. 26 Std. | LB 5, ca. 8 Std. | 6: `fu-1` bis `fu-10` (II/III: `fu-1` bis `fu-5`) |
| Daten und Zufall | LB 7, ca. 8 Std. | LB 6, ca. 8 Std. | 7: `dz-1` bis `dz-4` |

Zweig I sieht 36 Lektionen, Zweig II/III 28, „alle Lektionen“ 41. Alle 42 Kompetenzerwartungen beider Zweige (23 in Zweig I, 19 in Zweig II/III) stehen wörtlich mit ihren Lektionen und Belegen in [`coverage.json`](../mathematik-realschule-8/coverage.json); der App-Test prüft die Zuordnung in beide Richtungen, dass jede Lektion ihren Lernbereich im `lehrplan`-Text nennt und dass jede Lektion genau die Zweige trägt, die der Lehrplan vorsieht.

## Abgrenzung

- **Zweig I und Zweig II/III unterscheiden sich im Inhalt, nicht nur in der Tiefe.** Zweig I hatte Dreiecke (Existenz, Konstruktion, Kongruenz) sowie Schrägbilder und wahre Größe schon in M7; diese Lektionen tragen nur Zweig II/III. Drehung, Körpersymmetrie, Axialschnitte, das räumliche Koordinatensystem und Ungleichungen sind in M8 nur Zweig I. Zweig II/III lernt in M8 nur Ursprungsgeraden y = mx und die Orthogonalität m₁ · m₂ = −1; y = mx + t folgt dort in M9 (LB 5). Die gemeinsamen Funktionen-Lektionen `fu-1` bis `fu-5` kommen deshalb ohne den Parameter t aus (ein Test prüft die Aufgabentexte).
- **Klasse 8 rechnet in ℚ.** Die reellen Zahlen, Quadratwurzeln, der Satz des Pythagoras, Sinus, Kosinus und Tangens kommen in M9. Kein Lösungswert braucht sie; wo eine schräge Länge nötig ist (wahre Größe, Raumdiagonalen), nennt die Aufgabe einen gemessenen Wert. Ein Test verbietet ℝ in allen Lektionstexten und Karten.
- **Extremwerte ohne Parabel:** M8 verlangt den Extremwert quadratischer Terme rechnerisch (quadratische Ergänzung). Die Labore zeigen Wertetabellen als Punkte, die Wörter Parabel und Scheitelpunkt (M9 I, M10 II/III) kommen nicht vor.
- **Daten und Zufall ohne Wahrscheinlichkeit:** Ergebnisraum Ω, Laplace-Wahrscheinlichkeit und das empirische Gesetz der großen Zahlen sind M9. Klasse 8 zählt Ergebnisse, beschreibt Ereignisse und vergleicht relative Häufigkeiten.
- **Wiederholung früherer Jahrgänge, ausdrücklich markiert:** die Flächenformeln für Trapez, Drachenviereck und Raute (M6) in `dv-6`, die Potenzgesetze (M7) in `tg-1`, die Determinante (M7) in `fu-10`, einfache Ungleichungen ax + b ⋚ c (M7) in zwei Level-1-Varianten von `tg-9`.
- **Konventionen:** Winkelnamen gegen den Uhrzeigersinn (∢CBA ist der Innenwinkel bei B im Viereck ABCD), Punkte P(2 | −1), Intervalle wie ]−∞; 4], Mengendifferenz mit ∖, Maßstäbe als „1 : 1000“. Das räumliche Koordinatensystem zeichnet die x-Achse wie eine Tiefenkante (ω = 45°, q = ½), die y-Achse nach rechts, die z-Achse nach oben. Manche Schulbücher zeichnen die x-Einheit stattdessen als Kästchendiagonale (½ · √2); das ist eine offene Frage für die Durchsicht.

## Bestandsabgleich der ZAM-Zellen

zam-os/zam bündelt drei Zellen mit zusammen 24 Karten: `de-by:realschule-8-mathematik-ebene-geometrie-vierecke` (8), `de-by:realschule-8-mathematik-lineare-funktionen` (8) und `de-by:realschule-8-mathematik-terme-gleichungen` (8). Die Byte-Schnappschüsse liegen in `tests/fixtures/` (zam-os/zam `3ff6ee1`, SHA-256 in [`replaces-de-by.json`](../mathematik-realschule-8/replaces-de-by.json)).

MAPPING_TABLE

**A** heißt gleicher Einzelabruf mit genau einem Nachfolger. **B** heißt: Die alte mehrteilige Frage bleibt mit ihrer ganzen Antwort und einer Musterlösung auf genau einer eigenen Karte; die neuen Einzelkarten der Lektion beginnen ohne Beherrschung. **C** heißt: kein Nachfolger in diesem Paket, die alte Karte bleibt aktiv. Vier C-Karten fragen Strahlensätze und zentrische Streckung (M9), zwei die direkte und indirekte Proportionalität (M6/M7). Die alte Karte zum Haus der Vierecke (Vierecke J02) hat eine unvollständige Antwort (Drachenviereck und gleichschenkliges Trapez fehlen in der Hierarchie, die Symmetrieachsen des Rechtecks fehlen); sie ist als C vorgeschlagen. Die Lektion `dv-4` hat mit `m8-haus-der-vierecke` trotzdem eine eigene Karte mit derselben Frage und vollständiger Antwort, sodass Thomas sie auch als B mit korrigierter Antwort freigeben kann, wie bei Mathematik 10 geschehen. Sieben Nachfolger (Funktionen J01/J02 in `fu-6`, J03/J04 in `fu-7`, J06 in `fu-8`, Terme J07/J08 in `tg-9`) liegen in Lektionen nur für Zweig I, obwohl die alten Zellen beiden Zweigen zugeordnet waren; das steht in der Begründung der Zeilen.

**Status: Vorschlag, nicht freigegeben** (`"approved": null`, `"status": "proposal-only"`). Die erste Veröffentlichung der Zelle enthält deshalb weder `replaces` noch `retired_items` (AGENTS.md, Abschnitt 6). `scripts/validate-migration.mjs` prüft mit zam-core 0.54.0, dass die ausgelieferte Zelle keine Historie verändert und alle 24 alten Karten aktiv bleiben, und probt die 9 A- und 8 B-Zeilen an einer Kopie im Speicher: 17 Historien und ihre Review-Ereignisse wandern unverändert, die alten Karten verlassen die aktiven Wiederholungen, wiederholte Installationen ändern nichts, und wer schon Karten auf beiden IDs hält, bekommt kein automatisches Zusammenlegen. Nach Thomas' Freigabe folgt eine neue Version der Zelle mit genau diesen `replaces`; erst danach sollte ZAM die Zelle bündeln.
