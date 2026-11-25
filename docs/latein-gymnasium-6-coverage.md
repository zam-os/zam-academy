# Latein 6 Gymnasium (1. Fremdsprache): Lehrplan und Kartenbestand

Geprüft am 24. November 2026.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 6 – Latein (1. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/1-fremdsprache), live abgerufen mit `curl -sL --compressed -A "Mozilla/5.0"` (HTTP 200).
- **Gespeicherte Seite:** [`latein-gymnasium-6/tests/fixtures/lehrplanplus-l6.html`](../latein-gymnasium-6/tests/fixtures/lehrplanplus-l6.html)
- **SHA-256 (gespeicherter LF-Snapshot):** `f02af4a0a9bcf2f4ba356bf4359e7ac4420296c64718222b6203d77c0a8692b5`
- **Struktur:** gemeinsamer Fachlehrplan für Latein als 1. Fremdsprache (L1) in Jahrgangsstufe 6 (2. Lernjahr) ohne Zweig- oder Ausbildungsrichtungsteilung; die offizielle Seite weist keine Stundenangaben je Lernbereich aus.
- **Matrix:** [`latein-gymnasium-6/coverage.json`](../latein-gymnasium-6/coverage.json) bildet alle `52` übergeordneten Kompetenzerwartungen (`L6-01`–`L6-52`; `LB 1`: 4, `LB 2.1`: 10, `LB 2.2`: 5, `LB 2.3`: 5, `LB 3`: 17, `LB 4`: 11) ab, davon `37` `implemented` und `15` `supported`. [`check-curriculum.mjs`](../latein-gymnasium-6/scripts/check-curriculum.mjs) prüft alle vier HTML-Prüfsummen (LF-Snapshots) und jede `competence` wörtlich gegen die gespeicherte Seite (`52 curriculum rows, 0 not found`) sowie die Übereinstimmung mit diesem Dokument. Die `bindings` jeder Lektion werden im Vitest-Lauf mit der Matrix abgeglichen.

### Geprüfte Nachbarlehrpläne

- **Jahrgangsstufe 5 – 1. Fremdsprache:** [`lehrplanplus-l5.html`](../latein-gymnasium-6/tests/fixtures/lehrplanplus-l5.html), SHA-256 (gespeicherter LF-Snapshot) `2dc5b8757ca639b5d85348f367c8e9eed3d7bdf1371eb7661155e20afcf5995b`. Stellt die vorausgesetzte Grundlage bereit (fünf Deklinationen, `is/sē/quī`, Aktiv-Tempora bis Futur II, `esse/posse/velle`, aktiver AcI, Topografie Roms und Königszeit).
- **Jahrgangsstufe 7 – 1. Fremdsprache:** [`lehrplanplus-l7.html`](../latein-gymnasium-6/tests/fixtures/lehrplanplus-l7.html), SHA-256 (gespeicherter LF-Snapshot) `a5a86308de1d59c1f1eb01f2ba791beb9b59ead6e3b9bb2ebfb626e3c63ce869`. Führt u. a. Deponentien, `ferre`, Steigerung (`tūtissimus`), `aliquis`, Konjunktiv Präsens/Perfekt (Hortativ/Optativ/indirekte Frage), PFA/Gerundium, *Ablātīvus absolūtus*, Alexander den Großen, Caesar, Cicero, Horaz, Augustus, `cursus honorum`, Delphi/Olympia sowie Ödipus und Antigone ein; diese Phänomene bleiben konsequent aus Latein 6 ausgeschlossen und werden durch Regressionstests geschützt.
- **Fachprofil Latein (Gymnasium):** [`lehrplanplus-fachprofil.html`](../latein-gymnasium-6/tests/fixtures/lehrplanplus-fachprofil.html), SHA-256 (gespeicherter LF-Snapshot) `d54bc95b0a0f83cd82cd7455847dbe83b598899a0096e273a12f9f61a49bff06`. Verortet Jgst. 6 in der Spracherwerbsphase Jgst. 5–8 (L1).

## Was die App umsetzt und was außerhalb bleibt

- **`implemented` (37 Zeilen):** Kontextwortschatz, Wortfamilien, Wortbildung und Sprachbrücken zu Englisch (2. FS)/Romanisch; 3. Deklination (`dīves`, `pauper`, `vetus`), Demonstrativa (`hic`, `ille`, `iste`, `īdem`, `ipse`), Zahlen bis 1000 & `mīlia`, `īre` & Stammformen; Passiv in allen sechs Tempora und Infinitive Passiv, Konjunktiv Imperfekt und Plusquamperfekt (Aktiv/Passiv), PPA & PPP; Prädikativum, doppelter Nominativ/Akkusativ, neue Kasusfunktionen (`datīvus fīnālis/commodī`, `quālitātis`, `obiectīvus`), Irrealis, `ut`/`nē`/`ut nōn`, `cum`, passiver AcI und *participium coniunctum*; Kulturthemen (Kampanien/Magna Graecia/Mittelmeer, Vesuvausbruch 79 n. Chr., Plinius d. J., Pompeji-Kunst & Athen, Attische Demokratie & Archimedes, frühe Republik & Ständekämpfe, Verfassungsorgane & Klientelwesen, Hannibal & 2. Punischer Krieg, Werte `cōnstantia`/`concordia` & Opferprinzip `dō ut dēs`, Antikenbezüge, Europa, Theseus, Daedalus/Ikarus, Orpheus/Eurydike, Troja, Odysseus und Ovids *Metamorphosen* mit Bild-Text-Vergleich); sowie Satzanalyse, Übersetzungstechniken und Fehlerprüfung. Jede der 44 Lektionen besitzt ein dreiteiliges interaktives SVG-Schaubild, eine Entdeckerwerkstatt mit 3 Zielen und live aktualisierter SVG-Grafik (bzw. Italien-/Mittelmeerkarte), einen Kurzcheck, zwei Kurzaufgaben sowie zweistufige Aufgaben mit Kriterienselbstprüfung.
- **`supported` (15 Zeilen):** begründende Stellungnahme im Unterrichtsgespräch (`L6-03`), eigenes betontes und verständiges Vorlesen lateinischer Texte (`L6-04`), laufendes Einprägen des Grundwortschatzes auf ca. 900 Wörter und Arbeit im individuellen Wortschatzheft (`L6-05`, `L6-07`), gezielter Besuch von Museen und Begegnung mit Originalfunden oder Medienrecherchen (`L6-14`, `L6-27`, `L6-37`), eigenständiges Erschließen, Reflektieren und Anfertigen von Bild-Text-Vergleichen im Plenum (`L6-40`, `L6-41`), individuelles Weiterüben außerhalb der App, selbständiges Benutzen des Lehrbuchs/Wörterbuchs, eigenes Zeitmanagement und teamorientierte Präsentationsformen im Klassenraum (`L6-46`, `L6-47`, `L6-49`, `L6-50`, `L6-51`, `L6-52`). Für die drei Vortragslektionen bietet die App lokale Sprachausgabe (`SpeechSynthesis`) und einen Partner-Vorlese-Nachweis.

## Geprüfte Quellen

Alle 23 Quellen in [`latein-gymnasium-6/source-checks.json`](../latein-gymnasium-6/source-checks.json) wurden am 24. November 2026 live per `curl -sL --compressed -A "Mozilla/5.0"` abgerufen; jede antwortete mit HTTP 200 und dem gespeicherten `<title>`:

| Quelle | Abgerufener `<title>` |
| --- | --- |
| LehrplanPLUS Latein 6 (L1) | `LehrplanPLUS - Gymnasium - 6 - Latein - Fachlehrpläne` |
| LehrplanPLUS Latein 5 (L1) | `LehrplanPLUS - Gymnasium - 5 - Latein - Fachlehrpläne` |
| LehrplanPLUS Latein 7 (L1) | `LehrplanPLUS - Gymnasium - 7 - Latein - Fachlehrpläne` |
| LehrplanPLUS Fachprofil Latein | `LehrplanPLUS - Gymnasium - Latein - Fachprofile` |
| Münchener Antikensammlungen | `Antike am Königsplatz` |
| Pompeji | `Pompeji – Wikipedia` |
| Herculaneum | `Herculaneum – Wikipedia` |
| Vesuv | `Vesuv – Wikipedia` |
| Magna Graecia | `Magna Graecia – Wikipedia` |
| Plinius der Jüngere | `Plinius der Jüngere – Wikipedia` |
| Römische Republik | `Römische Republik – Wikipedia` |
| Ständekämpfe | `Ständekämpfe – Wikipedia` |
| Zweiter Punischer Krieg | `Zweiter Punischer Krieg – Wikipedia` |
| Hannibal | `Hannibal – Wikipedia` |
| Attische Demokratie | `Attische Demokratie – Wikipedia` |
| Archimedes | `Archimedes – Wikipedia` |
| Ovid | `Ovid – Wikipedia` |
| Europa (Mythologie) | `Europa (Tochter des Agenor) – Wikipedia` |
| Theseus | `Theseus – Wikipedia` |
| Daidalos | `Daidalos – Wikipedia` |
| Orpheus | `Orpheus – Wikipedia` |
| Trojanischer Krieg | `Trojanischer Krieg – Wikipedia` |
| Odyssee | `Odyssee – Wikipedia` |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4). Alle Texte, Entwürfe (`#draft`) und Lernstände bleiben ausschließlich lokal im Browser (`localStorage`, Schlüssel `zam-academy:latein-gymnasium-6:v1`); direkt neben dem Schreibfeld erläutert „ⓘ Wo bleibt mein Text?“ geteilte Gerätekonten, und „Lokalen Fortschritt zurücksetzen“ löscht alle Texte mit.

## ZAM-Zelle und Bestandsabgleich (`replaces-de-by.json`)

- **Zelle:** [`latein-gymnasium-6/cell.json`](../latein-gymnasium-6/cell.json), `zam-academy:latein-gymnasium-6`, Version `2026.11.1`, Paketstatus `ready`, Version `0.0` (`Lehrkraftprüfung offen`): `44` Atome (eines pro Lektion) und `132` Lernkarten (`44` Tier-1-Karten mit binärem `fast_check`, `88` Tier-2-Karten mit `sample_solution`), festgeschrieben mit echten ULIDs in `tests/fixtures/public-contract.json`.
- **Alt-Kartenbestand:** Geprüft gegen `zam-os/zam` Commit `67e190c2b7e5282851dfdd60ce21b69ed373dfa9` (`tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`). Für Latein am Gymnasium existieren keine `de-by`-Zellen für Jahrgangsstufe 5 oder 6.
- **Nachbarzelle (Jgst. 7):** Die früheste existierende Latein-Zelle ist [`de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen`](https://github.com/zam-os/zam/blob/67e190c2b7e5282851dfdd60ce21b69ed373dfa9/tests/fixtures/curriculum/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json) (`4` Karten `J01`–`J04`). In [`latein-gymnasium-6/replaces-de-by.json`](../latein-gymnasium-6/replaces-de-by.json) (`"status": "proposal-only"`, `"approved": null`, `"rows": []`) wird keine Verlaufsübertragung vorgeschlagen (`cell.json` enthält weder `replaces` noch `retired_items`).
  - `J01` und `J02` fragen den aktiven AcI ab (wird in L1 ab Jgst. 5 eingeführt, in L2 ab Jgst. 6/7 behandelt und in Jgst. 7 zusammen mit komplexeren Infinitiv-/Partizipkonstruktionen wiederholt; `J02` bündelt mehrere Phänomene).
  - `J03` und `J04` fragen das *Participium Coniunctum* (PPP und PPA) ab, das in L1 in Klasse 6 (`L6 2.2/2.3`) und in L2 erst in Klasse 7 eingeführt wird.
  - **Entscheidung (24. November 2026) & Rückfrage im PR:** Gemäß Thomas' Vorgabe bei `latein-gymnasium-5` (*„Für mich ist es in Ordnung, wenn die Karten im Latein-7-Paket verbleiben. Es wird dort ja wahrscheinlich wiederholt. Falls jemand also nicht bei Klasse 5 anfängt, fehlen ihm sonst ein paar Fragen, oder?“*) verbleibt auch die gesamte Nachbarzelle inkl. `J03`–`J04` beim künftigen Latein-7-Paket, damit spätere Einsteiger (L2 ab Klasse 6 und Wiederholer in Klasse 7) alle Abrufe im Latein-7-Kontext behalten. Im PR zu `latein-gymnasium-6` wird dies explizit für `J03`–`J04` zur Bestätigung gestellt.
