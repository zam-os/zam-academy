# Englisch 5 Gymnasium: Lehrplan und Kartenbestand

Geprüft am 14. November 2026.

## Lehrplan

- Jahrgangsstufe 5: <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/englisch>
- Gespeicherte Seite: `englisch-gymnasium-5/tests/fixtures/lehrplanplus-e5.html`
- SHA-256: `84765a9f386addc392d6910d9426d58e50fed80f7e0b7248b70c3a0e9f9ba6e6`
- Ein gemeinsamer Fachlehrplan, keine Ausbildungsrichtung.
- Die Seite nennt keine Stunden pro Lernbereich.
- `coverage.json` enthält 38 Zeilen. Nach dem Entfernen von Tags und dem Vereinheitlichen von Leerraum kommt jede `competence` wörtlich in der gespeicherten Seite vor. Grammatik-Unterpunkte bleiben im jeweiligen Elternsatz. Themenblöcke sind eigene Zeilen.

Nachbar Jahrgangsstufe 6, erste Fremdsprache: <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/1-fremdsprache>

- SHA-256: `35684fbe52bba27222d0f8de828afa6ec3078356d6284e0b8914c6bcd985e0ca`
- Neu dort und deshalb hier nicht Lernziel: present perfect simple, past tense progressive, going-to-future, will-future, timetable future, question tags, Adjektivsteigerung, defining relative clauses, could, may, might, should, Konditionalsatz I.

Grundschule Englisch 3/4, zweistündig: <https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/3/englisch/zweistuendig>

- SHA-256: `ebc4ab35274ac3306497f4624cc4e5505179de07718ad3000529d2cda9e71bdf`
- Elementarer Wortschatz und einfache Strukturen, keine Jahrgang-5-Zeitenliste.
- Der Querverweis der Jahrgang-5-Seite auf `grundschule/3/englisch/gueltig_bis_2324` leitete am selben Tag auf die Startseite von LehrplanPLUS um.

## Was die App übernimmt und was im Unterricht bleibt

Übernommen mit Erklärung, Werkstatt, Kurzcheck und zwei Aufgabenstufen: Wortschatzfelder der Jahrgangsstufe, die aufgeführte Grammatik bis zum simple past, Schreiben von Postkarte und E-Mail, schriftliche Sprachmittlung konkreter Angaben, Orientierung zu UK, Great Britain, Irland, London, USA und Kanada.

Als Vorbereitung markiert, nicht als volle Kompetenz: natürliches Hören und Hörsehen, Filme, lautes Lesen mit Rückmeldung, spontanes Sprechen, mündliches Dolmetschen, Aussprachefeedback, ein dauerhaftes eigenes Vokabelheft, aktuelle Anlässe. Dafür nennt die App keine erfundenen Statistiken. Wer einen aktuellen Anlass bearbeitet, öffnet eine Quelle und übernimmt nur eine sichtbare Angabe.

## Geographie

Die Lernskizzen sind nicht maßstäblich. Die Formulierungen in den Lektionen folgen diesen am 14. November 2026 geöffneten Seiten:

| Seite | Titel |
| --- | --- |
| United Kingdom | United Kingdom - Wikipedia |
| Great Britain | Great Britain - Wikipedia |
| Republic of Ireland | Republic of Ireland - Wikipedia |
| London | London - Wikipedia |
| Tower of London | Tower of London - Wikipedia |
| Buckingham Palace | Buckingham Palace - Wikipedia |
| Big Ben | Big Ben - Wikipedia |
| United States | United States - Wikipedia |
| Washington, D.C. | Washington, D.C. - Wikipedia |
| New York City | New York City - Wikipedia |
| Canada | Canada - Wikipedia |
| White House | White House - Wikipedia |
| Statue of Liberty | Statue Of Liberty National Monument (U.S. National Park Service) |

Keine Einwohnerzahlen. Big Ben ist in der genutzten Seite der Spitzname der großen Glocke und umgangssprachlich des Uhrturms.

## Alter Kartenbestand

Quelle: `zam-os/zam`, Commit `e6a235f75fe87b9d57af38bd61011027b891492c`.

Schnappschuss: `tests/fixtures/de-by-gymnasium-5-englisch-starter-grammar-tenses-kvt.json`

SHA-256: `994353ab9caec6963454c5b971e18d948bff19b6b55b2a559696be0171fec55a`

Zelle `de-by:gymnasium-5-englisch-starter-grammar-tenses`, acht Karten.

| Kategorie | Anzahl | Aktion im Vorschlag |
| --- | --- | --- |
| A | 4 | `propose-replace-after-approval` |
| B | 0 | — |
| C | 4 | `keep-active` |

Die vier A-Karten sind die binären Abrufe zu `Yes, I have.`, `Does`, `be + -ing` und `S-V-O`. Die vier C-Karten sind mehrteilige Sammelabrufe. `approved` ist `null`. `cell.json` erklärt weder `replaces` noch `retired_items`.

Die Nachbarzelle `de-by:gymnasium-6-englisch-past-tenses-present-perfect-adjectives` enthält simple past und much/many zusammen mit present perfect, past progressive und der Adjektivsteigerung. Der aktuelle Lehrplan führt simple past und much/many schon in Jahrgang 5 ein. Ob diese Zelle in die Zuordnung von Englisch 5 gehört, entscheidet Thomas. Bis dahin hat sie hier keine Zeile und bleibt bei Jahrgang 6.

Keine Lehrervideos.
