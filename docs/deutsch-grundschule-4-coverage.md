# Deutsch 4 · Grundschule · Lehrplanabgleich und Planung

Stand: 4. November 2026. Das neue Paket
[Tintos Wörterstadt](../deutsch-grundschule-4/) ist eine öffentliche Vorschau
(`publication.json`: `preview`) und steht im Katalog und im Atlas. Die anderen Übertrittsfächer sind
[Mathematik 4](../mathematik-grundschule-4/) und
[Heimat- und Sachunterricht 4](../hsu-grundschule-4/).

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
| 4.4 Richtig schreiben | 17 | 15 | 0 | 2 |
| **Summe** | **116** | **32** | **43** | **41** |

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
| `grundwortschatz-regeln` | 4.4.1 |
| `grundwortschatz-formen` | 4.4.1 |
| `grundwortschatz-merkwoerter` | 4.4.1 |

## Grundwortschatz 3/4

Quelle ist das Servicematerial
[Grundwortschatz für die Jahrgangsstufen 3 und 4](https://www.lehrplanplus.bayern.de/serviceinformation/l43316)
des ISB München, gelesen am 4. November 2026 (SHA-256 des PDF in
`deutsch-grundschule-4/tests/fixtures/official-grundwortschatz.json`). Laut
[Nutzungsbedingungen](https://www.lehrplanplus.bayern.de/seite/nutzungsbedingungen)
sind nicht-kommerzielle Vervielfältigung und Bearbeitung für schulische Zwecke
erlaubt, eine kommerzielle Nutzung ist nicht gestattet und das ISB ist stets als
Quelle zu nennen. Die Bedingungen nennen als Beispiel Auszüge in eigenen
Arbeitsblättern und äußern sich nicht ausdrücklich dazu, eine ganze Liste in einem
öffentlichen digitalen Angebot bereitzustellen. Das Angebot richtet sich laut
einer Fußnote an Lehrkräfte; vor einer Nutzung durch Schülerinnen und Schüler ist
zu prüfen, ob sie zulässig ist. Die App nennt das ISB in jeder Wortliste und in
der Quellenliste für Eltern. Die Liste fällt nicht unter die Apache-2.0-Lizenz des
Repositorys. Thomas stuft die Academy und ZAM als nicht-kommerziell ein
(Entscheidung vom 4. November 2026). Das ISB wurde nicht schriftlich gefragt.

Die Station „Wörterschatz“ folgt der Ordnung des ISB nach
Rechtschreibprinzipien: Regeln (phonologisch und silbisch), Formen
(morphologisch und grammatisch) und Merkwörter. Ein Test vergleicht jede Gruppe
wortgetreu mit der Fixture. Weitere Tests belegen, dass die Aufgaben jedes Wort
mit einer schwierigen Stelle abfragen können. Das heißt nicht, dass jedes Kind
jedes Wort übt: Die Aufgaben folgen einer festen Zufallsreihe, und nach drei
richtigen Aufgaben je Stufe gilt eine Lektion als abgeschlossen. Einen Fortschritt
je Wort gibt es nicht. Die vollständige Liste steht in den Lektionen zum Üben mit
der Hand bereit.

Die Falschschreibungen und Übungssätze sind eigene Vorschläge, nicht Teil des
ISB-Materials; die Lehrkraft sollte sie mitprüfen. Geübt wird am Bildschirm. Das
Schreiben mit der Hand, das Abschreiben und Diktate bleiben außerhalb der App.

## Offene Lücken und nächste Ausbaustufen

1. **Lesewerkstatt (2.1, 2.3, 2.4).** Sachtexte und Geschichten erschließen,
   Informationen aus Tabellen entnehmen, Figuren und Handlung beschreiben.
   Braucht eigene, kindgerechte Texte.
2. **Schreibwerkstatt (3.2, 3.3, 4.3.14).** Erzählen (Einleitung, Höhepunkt,
   Schluss), Berichten (W-Fragen, Präteritum), Beschreiben und Begründen,
   jeweils mit Mustervergleich und Kriterien. Eigene Texte bewertet die App
   nicht automatisch.
3. **4.1 und 4.2:** Wirkung sprachlicher Mittel, Mündlichkeit und
   Schriftlichkeit, Sprachen im Umfeld.
4. **Fachliche Freigabe** durch eine Grundschullehrkraft und Lehrvideos. Bis
   dahin bleibt das Paket eine Vorschau.

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
