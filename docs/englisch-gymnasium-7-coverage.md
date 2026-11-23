# Englisch 7 Gymnasium: Lehrplan und Kartenbestand

Geprüft am 23. November 2026.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 7 – Englisch (1. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/englisch/1-fremdsprache), live abgerufen mit `curl -sL --compressed -A "Mozilla/5.0"` (HTTP 200).
- **Gespeicherte Seite:** [`englisch-gymnasium-7/tests/fixtures/lehrplanplus-e7.html`](../englisch-gymnasium-7/tests/fixtures/lehrplanplus-e7.html)
- **SHA-256:** `a11d68521059288f18a2edb3059aa78de16d18e26c26bee06505615c619d3ca3` (identisch mit dem Nachbarschnappschuss, den `englisch-gymnasium-6` am 18. November 2026 gespeichert hat).
- **Struktur:** ein gemeinsamer Fachlehrplan für die 1. Fremdsprache (3. Lernjahr) über alle Ausbildungsrichtungen; keine Stunden pro Lernbereich angegeben. Wie bei Englisch 6 bleibt Englisch als 2. Fremdsprache außerhalb dieses Pakets.
- **Matrix:** [`englisch-gymnasium-7/coverage.json`](../englisch-gymnasium-7/coverage.json) enthält alle `43` übergeordneten Kompetenzerwartungen und Themenblöcke (`E7-01`–`E7-43`; `LB 1.1`: 12, `LB 1.2`: 10, `LB 2`: 3, `LB 3`: 7, `LB 4`: 3, `LB 5`: 8), davon `25` `implemented` und `18` `supported`. Die Texte wurden mit derselben Normalisierung wie [`check-curriculum.mjs`](../englisch-gymnasium-7/scripts/check-curriculum.mjs) aus der gespeicherten Seite gezogen; das Skript findet jede `competence` wörtlich (`43 curriculum rows, 0 not found`). Die `bindings` jeder Lektion werden im Test aus der Matrix abgeleitet und verglichen.

### Geprüfte Nachbarlehrpläne

- **Jahrgangsstufe 6 – 1. Fremdsprache:** [`lehrplanplus-e6.html`](../englisch-gymnasium-7/tests/fixtures/lehrplanplus-e6.html), SHA-256 `35684fbe52bba27222d0f8de828afa6ec3078356d6284e0b8914c6bcd985e0ca`. Zukunftsformen, past progressive, resultatives present perfect, Steigerung der Adjektive, Relativsätze, Ersatzformen der Modalverben und Konditionalsatz I liegen in `englisch-gymnasium-6` und werden hier nur vorausgesetzt oder als Kontrast wiederholt (z. B. Typ I neben Typ II).
- **Jahrgangsstufe 7 – 2. Fremdsprache:** [`lehrplanplus-e7-2fs.html`](../englisch-gymnasium-7/tests/fixtures/lehrplanplus-e7-2fs.html), SHA-256 `e66b2c2d4a923fd266a05e26aae2aad7932d65487ec1e8601b89682567592df7`. Eigener Lernpfad; nicht Teil dieses Pakets (offene Frage an Thomas, ob ein eigenes Paket folgen soll).
- **Jahrgangsstufe 8 – 1. Fremdsprache:** [`lehrplanplus-e8.html`](../englisch-gymnasium-7/tests/fixtures/lehrplanplus-e8.html), SHA-256 `8cd6b4d9288c4850da390823734e80ae19ce56cf583df8ad832dfaf3290d022c`. Passiv, Verben mit zwei Objekten, Gerund/Infinitiv, London, politische Systeme, Kanada sowie Boston Tea Party und Declaration of Independence bleiben in Jahrgang 8 (Grenztest in `tests/content.test.ts`). Independence Day nennt die Unabhängigkeitserklärung nur als Anlass des Feiertags und verweist auf Jahrgang 8.

## Was die App umsetzt und was außerhalb bleibt

- **`implemented` (25 Zeilen):** Grammatik (alle Unterpunkte der drei Grammatik-Kompetenzen), Wortschatz und Funktionswortschatz, Wünsche/Vorlieben, Verknüpfung und Kompensation, Lesen und Lesestrategien, Schreiben, schriftliche Sprachmittlung, Textgestaltung und kritischer Medienumgang, Wortbildung (`-able`, `-ity`), alle Themengebiete außer den aktuellen Anlässen. Jede Lektion hat Erklärung mit Merke-Kasten, eine interaktive Werkstatt mit drei Zielen (keines zu Beginn erreicht, jedes per Test erreichbar), Schnellcheck, zwei Kurzaufgaben und Aufgaben auf zwei Stufen mit Selbsteinschätzung.
- **`supported` (18 Zeilen):** Hör- und Hörsehverstehen mit echten Aufnahmen (`E7-01`, `E7-02`), Vorlesen (`E7-05`), freies Sprechen, Gespräche und Präsentieren (`E7-06`–`E7-08`), spontanes Dolmetschen (`E7-11`), individueller Wortschatz (`E7-14`), Aussprache und Lautschrift mit Hörbeispielen (`E7-21`, `E7-22`), Haltung gegenüber anderen Lebensweisen (`E7-24`), authentische Lektüren und Filmsequenzen (`E7-26`, `E7-31`), spontane Reaktion und szenisches Gestalten (`E7-28`, `E7-30`), Lernorganisation und Recherche (`E7-33`, `E7-35`), aktuelle Anlässe (`E7-42`). Die App bereitet vor (Skripte mit lokaler Sprachausgabe und Partner-Vorlesemodus, Redemittel, Musterlösungen), bewertet aber kein Sprechen und nimmt nichts auf.

## Geprüfte Quellen

Alle Quellen in [`englisch-gymnasium-7/source-checks.json`](../englisch-gymnasium-7/source-checks.json) wurden am 23. November 2026 mit `curl -sL --compressed -A "Mozilla/5.0" <url> | grep -o "<title[^>]*>[^<]*"` abgerufen; alle antworteten mit HTTP 200 und dem erwarteten Titel. Zahlen in den Lektionen wurden gegen den Text der Wikipedia-Seiten geprüft: Schlacht bei Hastings am 14. Oktober 1066 und Krönung an Weihnachten 1066, Act of Supremacy 1534, Elizabeth I 1558–1603, Armada 1588, Mayflower im September 1620 mit 102 Passagieren, Snowdon 1085 m, Grand Canyon 446 km lang und bis 1857 m tief, Conwy Castle 1283–1287 mit acht Türmen, Thanksgiving am vierten Donnerstag im November, Columbus Day am zweiten Montag im Oktober (der Feiertagsrechner der App wird gegen die Daten 2025–2028 der Wikipedia-Seite getestet), Antelope Canyon nur mit Führung.

| Seite | Abgerufener `<title>` |
| --- | --- |
| Thanksgiving | Thanksgiving (United States) - Wikipedia |
| Independence Day | Independence Day (United States) - Wikipedia |
| Columbus Day | Columbus Day - Wikipedia |
| US-Schulsystem | Education in the United States - Wikipedia |
| US-Sport | Sports in the United States - Wikipedia |
| Online-Sicherheit | Homepage - UK Safer Internet Centre |
| Online-Sicherheit | Childnet — Online safety for young people |
| Online-Sicherheit (deutsch) | klicksafe.de: Die EU-Initiative für mehr Sicherheit im Netz |
| Nachrichten für Jugendliche | Home - CBBC Newsround |
| Wales, Cardiff, Snowdon, Walisisch | Wales / Cardiff / Snowdon / Welsh language - Wikipedia |
| Burgen Edwards I. | Castles and Town Walls of King Edward in Gwynedd - Wikipedia |
| Südwesten der USA | Southwestern United States / Grand Canyon / Monument Valley / Navajo Nation - Wikipedia |
| 1066 | Norman Conquest / Battle of Hastings / Bayeux Tapestry - Wikipedia |
| Lehnwörter | Influence of French on English - Wikipedia |
| Henry VIII, Reformation | Henry VIII / English Reformation - Wikipedia |
| Elizabeth I, Armada | Elizabeth I / Spanish Armada - Wikipedia |
| Mayflower, Neuengland | Mayflower / Mayflower Compact / Plymouth Colony / New England - Wikipedia |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4).

## ZAM-Zelle und Alt-Kartenbestand

- **Zelle:** [`englisch-gymnasium-7/cell.json`](../englisch-gymnasium-7/cell.json), `zam-academy:englisch-gymnasium-7`, Version `2026.11.1`: `44` Atome (eines pro Lektion) und `132` Karten (`44` Tier-1-Karten mit binärem `fast_check`, `88` Tier-2-Karten mit `sample_solution`). Die IDs sind echte ULIDs; Atome und Karten sind in `tests/fixtures/public-contract.json` festgeschrieben.
- **Vorschlag ohne Freigabe:** [`englisch-gymnasium-7/replaces-de-by.json`](../englisch-gymnasium-7/replaces-de-by.json) hat `"status": "proposal-only"` und `"approved": null`. Die Zelle deklariert weder `replaces` noch `retired_items`; ein `validate-migration.mjs` gibt es deshalb nicht.
- **Inventar:** Quelle `zam-os/zam`, Commit `67e190c2b7e5282851dfdd60ce21b69ed373dfa9`, Schnappschuss [`de-by-gymnasium-7-englisch-grammar-present-perfect-modals-conditionals-kvt.json`](../englisch-gymnasium-7/tests/fixtures/de-by-gymnasium-7-englisch-grammar-present-perfect-modals-conditionals-kvt.json) (SHA-256 der LF-Bytes `2859bd22297ca7c746bc65dcf6344cb3ba3022fd021f611124bf73f694f12bae`, Zellversion `2026.08.1`, `4` Karten `J01`–`J04`).

| Kategorie | Anzahl | Karten | Vorgeschlagene Aktion |
| --- | --- | --- | --- |
| A | 1 | `J01` (Wann simple past statt present perfect?) → `e7-since-for-check` | `propose-replace-after-approval` |
| B | 0 | — | — |
| C | 3 | `J02` (Sammelabruf present perfect/simple past, since/for, Übersetzungen), `J03` (`had to`), `J04` (Sammelabruf Ersatzformen + Typ I + Typ II) | `keep-active` |

### Fragen an Thomas

1. **Freigabe der Zuordnung** oben (1 A, 3 C keep-active).
2. **`J03` (`had to`)** gehört nach LehrplanPLUS zu Englisch 6. Den gleichen Abruf hat `e6-substitutes-check` in `englisch-gymnasium-6`. Soll die Historie dorthin wandern? Das wäre ein eigener PR an Englisch 6.
3. **`J01`** ist inhaltlich auch nah an `e6-past-or-perfect-check` (Englisch 6). Vorgeschlagen ist der Nachfolger in Englisch 7, weil die alte Zelle Jahrgang 7 gehört und die neue Karte denselben Abruf wörtlich stellt.
4. **Nachbarzelle `de-by:gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa`** (gleicher Commit) wurde gelesen, aber nicht übernommen: `J01` (indirekte Rede mit Zeitverschiebung), `J03`/`J04` (US-Geschichte bis zur Bürgerrechtsbewegung) gehören zu Jahrgang 8 oder höher, `J02` bündelt past perfect (Jahrgang 7) mit Passiv und indirekter Rede (Jahrgang 8). Sie bleiben einem späteren Paket Englisch 8 überlassen.
5. **Englisch 7 als 2. Fremdsprache:** Soll ein eigenes Paket folgen?
