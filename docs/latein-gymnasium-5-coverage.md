# Latein 5 Gymnasium (1. Fremdsprache): Lehrplan und Kartenbestand

Geprüft am 24. November 2026.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 5 – Latein (1. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/latein/1-fremdsprache), live abgerufen mit `curl -sL --compressed -A "Mozilla/5.0"` (HTTP 200).
- **Gespeicherte Seite:** [`latein-gymnasium-5/tests/fixtures/lehrplanplus-l5.html`](../latein-gymnasium-5/tests/fixtures/lehrplanplus-l5.html)
- **SHA-256:** `2dc5b8757ca639b5d85348f367c8e9eed3d7bdf1371eb7661155e20afcf5995b`
- **Struktur:** gemeinsamer Fachlehrplan für Latein als 1. Fremdsprache (L1) in Jahrgangsstufe 5 ohne Zweig- oder Ausbildungsrichtungsteilung; die offizielle Seite weist keine Stundenangaben je Lernbereich aus.
- **Matrix:** [`latein-gymnasium-5/coverage.json`](../latein-gymnasium-5/coverage.json) bildet alle `53` übergeordneten Kompetenzerwartungen (`L5-01`–`L5-53`; `LB 1`: 4, `LB 2.1`: 10, `LB 2.2`: 5, `LB 2.3`: 6, `LB 3`: 17, `LB 4`: 11) ab, davon `38` `implemented` und `15` `supported`. [`check-curriculum.mjs`](../latein-gymnasium-5/scripts/check-curriculum.mjs) prüft alle drei HTML-Prüfsummen und jede `competence` wörtlich gegen die gespeicherte Seite (`53 curriculum rows, 0 not found`; der offizielle Quelltext enthält in `L5-47` buchstäblich `Medien)an.` ohne Leerzeichen und wird exakt so geführt). Die `bindings` jeder Lektion werden im Vitest-Lauf mit der Matrix abgeglichen.

### Geprüfte Nachbarlehrpläne

- **Jahrgangsstufe 6 – 1. Fremdsprache:** [`lehrplanplus-l6.html`](../latein-gymnasium-5/tests/fixtures/lehrplanplus-l6.html), SHA-256 `f02af4a0a9bcf2f4ba356bf4359e7ac4420296c64718222b6203d77c0a8692b5`. Führt u. a. Passiv, Konjunktiv Imperfekt und Plusquamperfekt, Partizipien (PPP/PPA) und Participium Coniunctum, `īre`, Demonstrativpronomina (`hic`, `ille`, `iste`, `idem`, `ipse`), Numeralia bis 1000, passiven AcI sowie Pompeji/Vesuv, Römische Republik/Hannibal, Ovid und Plinius d. J. ein; diese Phänomene bleiben konsequent aus Latein 5 ausgeschlossen und werden durch Regressionstests geschützt.
- **Fachprofil Latein (Gymnasium):** [`lehrplanplus-fachprofil.html`](../latein-gymnasium-5/tests/fixtures/lehrplanplus-fachprofil.html), SHA-256 `d54bc95b0a0f83cd82cd7455847dbe83b598899a0096e273a12f9f61a49bff06`. Verortet Jgst. 5 am Beginn der Spracherwerbsphase Jgst. 5–8 (L1).

## Was die App umsetzt und was außerhalb bleibt

- **`implemented` (38 Zeilen):** Grammatik und Formenlehre (Paenultima-Betonung, Wortarten/Wortfamilien/Wortbildung, alle fünf Deklinationen inkl. i-Stämme, KNG-Kongruenz, Personal-/Reflexiv-/Relativpronomina, Numeralia 1–12, Präsens, `esse`/`posse`/`velle`, Imperfekt/Futur I/Perfekt/Plusquamperfekt/Futur II aktiv, Rektion, Kasus- und Ablativfunktionen, Satzarten/Nebensätze, aktiver AcI), Kulturthemen (Topografie Roms, Bauten, Thermen/Aquädukt/Ostia, Baukunst und Griechenlandbezug, Werte und Senat, Familie und Namen, Sklaven/Gladiatoren, Schule/Kleidung/Kalender, Religion/Olympier/Unterwelt, Herkules/Aeneas/Romulus/Königszeit) sowie Texterschließung und Fehlerprüfung. Jede Lektion besitzt ein dreiteiliges interaktives SVG-Schaubild, eine interaktive Werkstatt mit 3 Zielen und live aktualisierter SVG-Grafik (bzw. Altrom-Karte), einen Kurzcheck, zwei Kurzaufgaben sowie Aufgaben auf zwei Niveaus mit Kriterienselbstprüfung.
- **`supported` (15 Zeilen):** Offenes Urteilen im Unterrichtsgespräch (`L5-03`), eigenes mündliches Vortragen (`L5-04`, `L5-07`), laufendes Einprägen aller ca. 500 Grundwortschatzvokabeln (`L5-05`, `L5-13`), weiterführende Sprachvergleiche im Unterricht (`L5-10`, `L5-15`), Besuch außerschulischer Lernorte und Museen (`L5-31`, `L5-37`), Werte- und Quellenreflexion im Gespräch (`L5-35`, `L5-42`), spielerisch-szenische Darbietungen und reale Gruppen-/Stationenarbeit (`L5-47`, `L5-52`, `L5-53`) sowie Umgang mit dem eigenen Lehrbuch und eigener Zeitplanung (`L5-48`, `L5-50`, `L5-51`). Für die drei Vortragslektionen bietet die App lokale Sprachausgabe (`SpeechSynthesis`) und einen Partner-Vorlese-Nachweis.

## Geprüfte Quellen

Alle 17 Quellen in [`latein-gymnasium-5/source-checks.json`](../latein-gymnasium-5/source-checks.json) wurden am 24. November 2026 live per `curl -sL --compressed -A "Mozilla/5.0"` abgerufen; jede antwortete mit HTTP 200 und dem gespeicherten `<title>`:

| Quelle | Abgerufener `<title>` |
| --- | --- |
| LehrplanPLUS Latein 5 (L1) | `LehrplanPLUS - Gymnasium - 5 - Latein - Fachlehrpläne` |
| LehrplanPLUS Latein 6 (L1) | `LehrplanPLUS - Gymnasium - 6 - Latein - Fachlehrpläne` |
| LehrplanPLUS Fachprofil Latein | `LehrplanPLUS - Gymnasium - Latein - Fachprofile` |
| Münchener Antikensammlungen | `Antike am Königsplatz` |
| Forum Romanum | `Forum Romanum – Wikipedia` |
| Kolosseum | `Kolosseum – Wikipedia` |
| Circus Maximus | `Circus Maximus – Wikipedia` |
| Konstantinsbogen | `Konstantinsbogen – Wikipedia` |
| Ostia Antica | `Ostia Antica – Wikipedia` |
| Römischer Kalender | `Römischer Kalender – Wikipedia` |
| Römische Religion | `Römische Religion – Wikipedia` |
| Zwölf Olympische Götter | `Zwölf Olympische Götter – Wikipedia` |
| Herakles | `Herakles – Wikipedia` |
| Aeneas | `Aeneas – Wikipedia` |
| Romulus und Remus | `Romulus und Remus – Wikipedia` |
| Vergil | `Vergil – Wikipedia` |
| Titus Livius | `Titus Livius – Wikipedia` |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4). Alle Texte, Entwürfe (`#draft`) und Lernstände bleiben ausschließlich lokal im Browser (`localStorage`, Schlüssel `zam-academy:latein-gymnasium-5:v1`); direkt neben dem Schreibfeld erläutert „ⓘ Wo bleibt mein Text?“ geteilte Gerätekonten, und „Lokalen Fortschritt zurücksetzen“ löscht alle Texte mit.

## ZAM-Zelle und Bestandsabgleich (`replaces-de-by.json`)

- **Zelle:** [`latein-gymnasium-5/cell.json`](../latein-gymnasium-5/cell.json), `zam-academy:latein-gymnasium-5`, Version `2026.11.1`, Paketstatus `ready`, Version `0.0` (`Lehrkraftprüfung offen`): `44` Atome (eines pro Lektion) und `132` Lernkarten (`44` Tier-1-Karten mit binärem `fast_check`, `88` Tier-2-Karten mit `sample_solution`), festgeschrieben mit echten ULIDs in `tests/fixtures/public-contract.json`.
- **Alt-Kartenbestand:** Geprüft gegen `zam-os/zam` Commit `67e190c2b7e5282851dfdd60ce21b69ed373dfa9` (`tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`). Für Latein am Gymnasium existieren keine `de-by`-Zellen für Jahrgangsstufe 5 oder 6.
- **Nachbarzelle (Jgst. 7):** Die früheste existierende Latein-Zelle ist [`de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen`](https://github.com/zam-os/zam/blob/67e190c2b7e5282851dfdd60ce21b69ed373dfa9/tests/fixtures/curriculum/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json) (`4` Karten `J01`–`J04`). In [`latein-gymnasium-5/replaces-de-by.json`](../latein-gymnasium-5/replaces-de-by.json) (`"status": "proposal-only"`, `"approved": null`, `"rows": []`) wird keine Verlaufsübertragung vorgeschlagen (`cell.json` enthält weder `replaces` noch `retired_items`).
  - `J01` und `J02` fragen den aktiven AcI ab (wird in L1 ab Jgst. 5 eingeführt, in L2 aber erst später behandelt und in Jgst. 7 zusammen mit komplexeren Infinitiv-/Partizipkonstruktionen wiederholt; `J02` bündelt mehrere Phänomene).
  - `J03` und `J04` betreffen das Participium Coniunctum (frühestens Jgst. 6).
  - **Entscheidung von Thomas (24. November 2026):** `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` (`J01`–`J04`) verbleibt vollständig beim künftigen Latein-7-Paket (Wortlaut: *„Für mich ist es in Ordnung, wenn die Karten im Latein-7-Paket verbleiben. Es wird dort ja wahrscheinlich wiederholt. Falls jemand also nicht bei Klasse 5 anfängt, fehlen ihm sonst ein paar Fragen, oder?“*). So bleiben Lernenden, die erst in Klasse 6 (L2) oder Klasse 7 mit ZAM einsteigen, die Abrufe im Latein-7-Zusammenhang erhalten.
