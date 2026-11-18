# Englisch 6 Gymnasium: Lehrplan und Kartenbestand

Geprüft am 18. November 2026.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 6 – Englisch (1. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/1-fremdsprache)
- **Gespeicherte Seite:** [`englisch-gymnasium-6/tests/fixtures/lehrplanplus-e6.html`](../englisch-gymnasium-6/tests/fixtures/lehrplanplus-e6.html)
- **SHA-256:** `35684fbe52bba27222d0f8de828afa6ec3078356d6284e0b8914c6bcd985e0ca` (identisch mit dem in `englisch-gymnasium-5` geprüften Schnappschuss)
- **Struktur:** Gemeinsamer Fachlehrplan für die 1. Fremdsprache (2. Lernjahr) über alle Ausbildungsrichtungen; die Seite weist keine Stunden pro Lernbereich aus.
- **Matrix:** [`englisch-gymnasium-6/coverage.json`](../englisch-gymnasium-6/coverage.json) umfasst alle `40` übergeordneten Kompetenzerwartungen und Themenblöcke (`E6-01`–`E6-40`), davon `21` `implemented` und `19` `supported` (`LB 1.1`: 11, `LB 1.2`: 9, `LB 2`: 3, `LB 3`: 6, `LB 4`: 3, `LB 5`: 8). Mit normalisiertem Leerraum findet [`check-curriculum.mjs`](../englisch-gymnasium-6/scripts/check-curriculum.mjs) jede `competence` wörtlich in der gespeicherten HTML-Seite (`40 curriculum rows, 0 not found`).

### Geprüfte Nachbarlehrpläne

- **Jahrgangsstufe 5 (`gymnasium/5/englisch`):** Schnappschuss [`lehrplanplus-e5.html`](../englisch-gymnasium-6/tests/fixtures/lehrplanplus-e5.html), SHA-256 `84765a9f386addc392d6910d9426d58e50fed80f7e0b7248b70c3a0e9f9ba6e6`. Baustoffe wie *to be*, *have got*, *simple present*, *present progressive*, *simple past*, *can/must/needn't/mustn't*, *much/many*, *some/any* und UK-/Nordamerika-Grundlagen liegen in `englisch-gymnasium-5` und werden in Jahrgang 6 nur vorausgesetzt bzw. kontrastiv aufgegriffen (z. B. `past-progressive` vs. `simple past`, `present perfect` vs. `simple past`).
- **Jahrgangsstufe 6 – 2. Fremdsprache (`gymnasium/6/englisch/2-fremdsprache`):** Schnappschuss [`lehrplanplus-e6-2fs.html`](../englisch-gymnasium-6/tests/fixtures/lehrplanplus-e6-2fs.html), SHA-256 `e89029c6804747de18c4198122bba40149902bfdd80346c253c189b4f5e56024`. Eigener Einstiegstrack auf Jahrgang-5-Basis (plus *going-to-future* und *question tags*); bleibt außerhalb dieses Pakets (Umfangsbeschluss mit Thomas: nur 1. Fremdsprache).
- **Jahrgangsstufe 7 – 1. Fremdsprache (`gymnasium/7/englisch/1-fremdsprache`):** Schnappschuss [`lehrplanplus-e7.html`](../englisch-gymnasium-6/tests/fixtures/lehrplanplus-e7.html), SHA-256 `a11d68521059288f18a2edb3059aa78de16d18e26c26bee06505615c619d3ca3`. Themen wie *past perfect simple*, *present perfect progressive*, `-ly`-Adverbien (Bildung/Steigerung/Stellung und Kontrast Adjektiv/Adverb), Reflexiv-/Reziprok-/Possessivpronomen, *one(s)*, Conditional II/III, 1066, Henry VIII, Elizabeth I, Mayflower, Wales und Desert South-West bleiben strikt in Jahrgang 7 (durch Regressions- und Grenztests in `tests/review-regressions.test.ts` abgesichert).

## Was die App umsetzt und was außerhalb bleibt

- **`implemented` (21 Zeilen):** Alle Grammatik-, Wortschatz-, Textsorten- und Landeskundebereiche des Fachlehrplans 6 (1. FS) mit Verstehenstext, `Merke`-Kasten, interaktiver 3-Ziele-Werkstatt (inklusive interaktivem Zeitstrahl, Adjektiv-Steigerungsregler, interaktivem Stadtplan für Wegbeschreibungen, interaktivem Parkszene für die Bildbeschreibung sowie UK- und US-Karten), Schnellcheck, Kurzaufgaben (`practice`) und zweistufigen Aufgaben (`Level 1` Anwenden / `Level 2` Transfer mit Rubrik-Selbstkontrolle). Kleiner Ausblick über den E6-Kern hinaus (`AGENTS.md` §1): In `e6-past-or-perfect` ergänzt der Kontrast zum *simple past* das resultative *present perfect* um einen ausdrücklich markierten Ausblick auf Jahrgang 7 (*ever*/*never* für Lebenserfahrungen bis heute).
- **`supported` (19 Zeilen):** Hörverstehen und Hörsehverstehen mit echten Stimmen bzw. Filmausschnitten (`E6-01`, `E6-02`, `E6-29`), freies und spontanes Sprechen im Dialog (`E6-05`, `E6-06`), sinndarstellendes Vorlesen und eigene Aussprachebewertung (`E6-04`, `E6-19`, `E6-20`), ein zweiminütiger Kurzvortrag (`E6-07`), spontanes mündliches Dolmetschen (`E6-10`), persönliche Hobbylisten/Fehlerprotokolle außerhalb der App (`E6-13`, `E6-30`), aktive *classroom phrases* in Live-Unterrichtssituationen (`E6-14`, während Funktionswortschatz zur Bildbeschreibung und grammatikalische Fachbegriffe in der App geübt werden), interkultureller Austausch (`E6-22`), ganze Lektüren (`E6-24`, `E6-28`), Nachschlagen in externen Wörterbüchern (`E6-31`, `E6-32`) sowie Recherche aktueller Ereignisse (`E6-39`). Die App erfindet keine Live-Statistiken; Hörtexte nutzen optional lokale Browser-Sprachausgabe plus Partner-Vorlesemodus (`listening.ts`).

## Geprüfte Quellen (Landeskunde & Gedicht)

Alle 19 Einträge in [`englisch-gymnasium-6/source-checks.json`](../englisch-gymnasium-6/source-checks.json) wurden am 18. November 2026 live per `curl -sL --compressed -A "Mozilla/5.0"` abgerufen (4 LehrplanPLUS-Seiten mit SHA-256 + 15 Wikipedia-Seiten). `Place_names_in_England` lieferte HTTP 404 und wurde durch `Toponymy_of_England` (HTTP 200) ersetzt.

| Seite | Abgerufener `<title>` |
| --- | --- |
| Cornwall | Cornwall - Wikipedia |
| Lake District | Lake District - Wikipedia |
| Hadrian's Wall | Hadrian's Wall - Wikipedia |
| Bath | Bath, Somerset - Wikipedia |
| Roman Britain | Roman Britain - Wikipedia |
| Roman roads | Roman roads in Britannia - Wikipedia |
| Place names in England | Toponymy of England - Wikipedia |
| Notting Hill Carnival | Notting Hill Carnival - Wikipedia |
| Shrove Tuesday | Shrove Tuesday - Wikipedia |
| Florida | Florida - Wikipedia |
| Rocky Mountains | Rocky Mountains - Wikipedia |
| New England | New England - Wikipedia |
| Midwest | Midwestern United States - Wikipedia |
| Regions of the United States | List of regions of the United States - Wikipedia |
| Wordsworth: *Daffodils* (public domain) | I Wandered Lonely as a Cloud - Wikipedia |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4).

## ZAM-Zelle und Alt-Kartenbestand

- **Zelle:** [`englisch-gymnasium-6/cell.json`](../englisch-gymnasium-6/cell.json) umfasst `40` Atome (eines pro Lektion) und `120` Karten (`40` Tier-1-Karten mit binärem `fast_check` + `80` Tier-2-Karten mit `sample_solution`).
- **Freigegebenes Mapping:** Thomas hat die Zuordnung am 18. November 2026 ausdrücklich freigegeben (`"status": "approved"`, `"approved": "2026-11-18"`, Wortlaut „Mapping-Freigabe erteilt“). Die drei Kategorie-A-Nachfolger in [`englisch-gymnasium-6/cell.json`](../englisch-gymnasium-6/cell.json) tragen jeweils `replaces` auf ihre alte Karte; `retired_items` gibt es nicht.
- **Inventar ([`englisch-gymnasium-6/replaces-de-by.json`](../englisch-gymnasium-6/replaces-de-by.json)):** Quelle ist `zam-os/zam`, Commit `e517a1ef709e0e6ee5f968c342affeb5b14cef35`, Schnappschuss [`de-by-gymnasium-6-englisch-past-tenses-present-perfect-adjectives-kvt.json`](../englisch-gymnasium-6/tests/fixtures/de-by-gymnasium-6-englisch-past-tenses-present-perfect-adjectives-kvt.json) (`SHA-256`: `bc6e93f93d8c66e9b1e4c82357ee6fe448c5597cdd50b3800801505fd3c7429d`, Zellversion `2026.08.1`, `8` Karten `J01`–`J08`):

| Kategorie | Anzahl | Karten | Aktion |
| --- | --- | --- | --- |
| A | 3 | `J03` → `e6-past-progressive-check`, `J05` → `e6-present-perfect-check`, `J07` → `e6-adjectives-check` | `replace` |
| B | 0 | — | — |
| C | 5 | `J01`, `J02` (Jahrgang-5-Simple-Past), `J04`, `J06`, `J08` (mehrteilige Sammelabrufe) | `keep-active` |

### Nachbarzelle Jahrgang 7

- **`de-by:gymnasium-7-englisch-grammar-present-perfect-modals-conditionals`:** `J03` (*had to* als Past-Ersatzform von *must*) und die erste Hälfte von `J04` (Modal-Ersatzformen *be able to / have to / be allowed to* plus *Conditional Type 1*) gehören nach LehrplanPLUS Bayern bereits in Jahrgang 6 (1. FS), während `J01`/`J02` (*since/for*-Fokus) und die zweite Hälfte von `J04` (*Conditional Type 2*) in Jahrgang 7 bleiben. Bis zu einer Entscheidung von Thomas bleibt diese Zelle unberührt bei Jahrgang 7. (`de-by:realschule-6-englisch-grammatik-grundlagen` betrifft die Realschule.)
