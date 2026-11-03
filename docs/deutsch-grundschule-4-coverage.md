# Deutsch 4 · Grundschule · Lehrplanabgleich und Planung

Stand: 3. November 2026. Das neue Paket
[Tintos Wörterstadt](../deutsch-grundschule-4/) ist ein lokaler Entwurf
(`publication.json`: `local-only`) und erscheint weder im Katalog noch im
Atlas. Es ist das zweite Übertrittsfach nach
[Mathematik 4](../mathematik-grundschule-4/); Heimat- und Sachunterricht
fehlt noch.

## Quelle

[LehrplanPLUS Grundschule, Fachlehrplan Deutsch 3/4](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/deutsch),
direkt abgerufen am 3. November 2026 (SHA-256 der HTML-Seite in
`deutsch-grundschule-4/tests/fixtures/official-curriculum.json`). Die Seite
enthält 116 Kompetenzerwartungen in 17 nummerierten Abschnitten (1.1 bis
4.4); Abschnitt 4.4 ist zusätzlich in vier Unterabschnitte gegliedert
(„Phonologisches und silbisches Prinzip nutzen“, „Morphologisches …“, „Grammatisches …“, „Verbindung unterschiedlicher
Prinzipien nutzen“). Der Plan gilt gemeinsam für die Jahrgangsstufen 3 und 4,
nennt keine Stundenkontingente und keine Aufteilung auf die beiden Jahre.
Die Reihenfolge der Lektionen ist unser Vorschlag, keine amtliche Vorgabe.

Zur Abgrenzung gelesen:

- [Deutsch 1/2](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/2/deutsch):
  Nomen, Verben, Artikel mit Proben bestimmen, Personalform, Nominalkern mit
  Adjektiven, Satzschlusszeichen, Wortstamm, Umlaute und Verhärtung über ein-
  und zweisilbige Formen, ie und Doppelkonsonant im Grundwortschatz. Diese
  Inhalte greifen die Lektionen als Wiederholung auf und führen sie weiter.
- [Gymnasium Deutsch 5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/deutsch):
  lateinische Fachbegriffe, Adverb, Präposition, Konjunktion und Subjunktion,
  Modal- und Kausaladverbiale, Haupt- und Nebensatz, Kommaregeln. Das Paket
  nennt die lateinischen Namen der vier Fälle und der Zeitformen nur als
  Zusatz zu den Grundschulbegriffen und lässt die übrigen Themen aus. Die
  Komma-Regel vor aber, denn, weil und dass ist im Lerntext als Vorgriff
  gekennzeichnet („Diese Kommaregel lernst du genau erst in der 5. Klasse.
  Tinto übt sie hier schon mit dir.“); LehrplanPLUS 4.3 verlangt das
  Verknüpfen mit Bindewörtern, nicht die Kommasetzung.

## Abdeckung dieser Ausbaustufe

| Abschnitt | Erwartungen | in der App geübt | geplant | Praxis außerhalb |
| --- | ---: | ---: | ---: | ---: |
| 1 Sprechen und Zuhören (1.1–1.5) | 26 | 0 | 0 | 26 |
| 2 Lesen (2.1–2.5) | 35 | 0 | 26 | 9 |
| 3 Schreiben (3.1–3.3) | 19 | 2 | 13 | 4 |
| 4.1, 4.2 Verständigung, Sprachen | 4 | 0 | 4 | 0 |
| 4.3 Sprachliche Strukturen | 15 | 15 | 0 | 0 |
| 4.4 Richtig schreiben | 17 | 14 | 1 | 2 |
| **Summe** | **116** | **31** | **44** | **41** |

„In der App geübt“ heißt teilweise abgedeckt: geübt an vorgegebenen Wörtern
und Sätzen, nicht in eigenen Texten. Die Zeilen in
[`coverage.json`](../deutsch-grundschule-4/coverage.json) nennen Lektionen
und Grenzen je Erwartung. Die Tests prüfen, dass jede Lektion an einer
amtlichen Erwartung hängt, jede Erwartung mit Lektion den Status `partial`
trägt und alle 116 Texte wörtlich mit der Quelle übereinstimmen.

| Lektion | Erwartungen |
| --- | --- |
| `nomen-artikel` | 4.3.6, 4.4.12 |
| `vier-faelle` | 4.3.6, 4.3.13 |
| `adjektive-steigern` | 4.3.6, 4.4.13 |
| `verben-personalform` | 4.3.6 |
| `zeitformen` | 4.3.5, 4.3.6 |
| `wortbausteine` | 4.3.1, 4.3.2, 4.4.11 |
| `wortfamilien` | 4.3.3, 4.4.10 |
| `zusammengesetzte-nomen` | 4.3.4, 4.4.15, 4.4.17 |
| `wortfelder` | 4.3.7 |
| `satzarten` | 4.3.9 |
| `woertliche-rede` | 4.3.8, 4.3.14 (nur wörtliche Rede) |
| `satzglieder-umstellprobe` | 4.3.11, 4.3.15 |
| `subjekt-praedikat` | 4.3.12, 4.3.15 |
| `objekte` | 4.3.12, 4.3.13 |
| `orts-zeitangaben` | 4.3.11, 4.3.12 |
| `saetze-verbinden` | 4.3.10 |
| `silbentrennung` | 4.4.8 |
| `kurze-selbstlaute` | 4.4.2, 4.4.9 |
| `lange-selbstlaute` | 4.4.7, 4.4.9 |
| `verlaengern` | 4.4.2, 4.4.16 |
| `ableiten` | 4.4.10, 4.4.16 |
| `grossschreibung` | 4.4.11, 4.4.12, 4.4.14 |
| `woerterbuch-fehlerdetektiv` | 3.2.11, 3.3.3, 4.4.3, 4.4.6, 4.4.14 |

## Offene Lücken und nächste Ausbaustufen

1. **Grundwortschatz 3/4 (4.4.1).** Der verbindliche Wortschatz ist nicht
   eingebunden. Er wäre die naheliegende nächste Übung, etwa als
   Lernwörter-Training mit ZAM-Wiederholung.
2. **Lesewerkstatt (2.1, 2.3, 2.4).** Sachtexte und Geschichten erschließen,
   Informationen aus Tabellen entnehmen, Figuren und Handlung beschreiben.
   Braucht eigene, kindgerechte Texte.
3. **Schreibwerkstatt (3.2, 3.3, 4.3.14).** Erzählen (Einleitung, Höhepunkt,
   Schluss), Berichten (W-Fragen, Präteritum), Beschreiben und Begründen,
   jeweils mit Mustervergleich und Kriterien. Eigene Texte bewertet die App
   nicht automatisch.
4. **4.1 und 4.2:** Wirkung sprachlicher Mittel, Mündlichkeit und
   Schriftlichkeit, Sprachen im Umfeld.
5. **Fachliche Freigabe** durch eine Grundschullehrkraft vor jeder
   Veröffentlichung, danach die Registrierung der Grundschule im Atlas
   gemeinsam mit Mathematik 4.

Sprechen und Zuhören, Vorlesen, Handschrift, Abschreiben und
Bibliotheksbesuche bleiben bewusst Praxis außerhalb der App.

## Bestehende ZAM-Karten

zam-os/zam enthält keine `de-by`-Zelle für Deutsch in der Grundschule
(Baum von `main` bei Commit `88c5de2` am 3. November 2026 durchsucht). Die
neue Zelle ersetzt deshalb nichts, zieht nichts zurück und braucht keine
Zuordnungsfreigabe.

## Prüfung

Befehle und Ergebnisse stehen im Pull Request. Kurz: `npm test` im Paket
(80 Tests, darunter je Lektion 80 generierte Aufgaben pro Stufe und ein
Zeugenpfad für jedes Werkstattziel), `npm run package:zip` mit
Offline-Prüfung, `scripts/validate-cells.mjs` und
`deutsch-grundschule-4/scripts/validate-cell.mjs` mit zam-core 0.54.0 sowie
ein Durchgang im Browser (alle Werkstatt-Arten, eine vollständig gelöste
Lektion bis zum Sticker, Merkheft, Elternseite, dunkles Farbschema,
Handybreite).
