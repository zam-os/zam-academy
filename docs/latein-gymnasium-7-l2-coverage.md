# Latein 7 (2. Fremdsprache, L2) Gymnasium Bayern — Lehrplanabgleich & Bestandsprüfung

## 1. Lehrplanbezug und Nachbarjahrgänge

- **Aktueller Fachlehrplan (Jgst. 7, L2):** `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/latein/2-fremdsprache`
  - Geprüft am: `2026-11-26`
  - SHA-256 (`tests/fixtures/lehrplanplus-l7.html`): `6756c0f47dcba1ca85c23f77471a4e572daa45364fb9af859e94e9675a3ea0ce`
  - Verbatim-Prüfung (`node latein-gymnasium-7-l2/scripts/check-curriculum.mjs`): **51 Kompetenzerwartungen** über L7 LB 1 (4), LB 2.1 (9), LB 2.2 (5), LB 2.3 (5), LB 3 (16) und LB 4 (12); **0 nicht gefunden**.
- **Vorheriger Jahrgang (Jgst. 6, L2):** `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/2-fremdsprache`
  - SHA-256 (`tests/fixtures/lehrplanplus-l6.html`): `1fa166cb0a2085841b23d4273b9962a46097a231ce3e9a1094a20db4de9d339e`
  - Vorwissen, auf dem das Paket ausdrücklich aufbaut: 1.–3. Deklination, alle Indikative Aktiv, AcI aktiv, Gründungsmythos Roms, Königszeit, frühe Republik, Olympier und Grundvorstellungen der Unterwelt.
- **Nachfolgender Jahrgang (Jgst. 8, L2):** `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/2-fremdsprache`
  - SHA-256 (`tests/fixtures/lehrplanplus-l8.html`): `3615ef0c5f5e873d61a710a4d7a70b186fce3125a56b9d844ed99c8720878419`
  - Bewusst ausgegrenzt (erst L8): Steigerung von Adjektiven und Adverbien, Indefinitpronomina (`aliquis`, `quidam`, `quisque`), PFA, Deponentien, Gerund/Gerundiv, NcI, Hauptsatzkonjunktive außer Irrealis (Hortativ, Jussiv, Optativ, Prohibitiv, Deliberativ, Potentialis) sowie Kaiserzeit, Christentum, Phaedrus und römisches Rechtswesen.

## 2. Aufbau des Pakets (40 Lektionen · 8 Etappen · 120 ZAM-Karten)

| Etappe | Thema | Lektionen | ZAM-Karten | Interaktive Live-SVG-Modelle |
| --- | --- | --- | --- | --- |
| 1 `nomina` | Deklinationen, Pronomina & Zahlen | 5 | 15 | Römischer Zahlen-Zerleger (1–1000) |
| 2 `passiv` | Passiv, `ferre` & Satzfunktionen | 5 | 15 | Aktiv-Passiv-Umformer (6 Tempora) · Zeitstrahl (AcI) |
| 3 `partizip` | Partizipien: PC & Ablativus absolutus | 5 | 15 | Zeitstrahl (AcI / PC / Abl. abs.) |
| 4 `konjunktiv` | Konjunktiv, Nebensätze & Zeitenfolge | 5 | 15 | Consecutio-temporum-Matrix (2×2 Aktiv/Passiv) |
| 5 `wortschatz` | Wortschatz, Wortbildung & Sprachbrücken | 5 | 15 | Pänultima-Silbenwaage |
| 6 `imperium` | Mittelmeerraum, Provinzen & Antike Welt | 5 | 15 | Offline-Karte Imperium Romanum (3 Ebenen) |
| 7 `respublica` | Republik, Augustus, Politik & Werte | 5 | 15 | Epochen-Zeitleiste · Cursus-honorum-Pyramide |
| 8 `mythos` | Mythen, Unterwelt & Textmethodik | 5 | 15 | Dreiteilige Entdeckerbilder in allen Lektionen |

Jede der 40 Lektionen enthält zudem ein eigenes **dreiteiliges interaktives Inline-SVG-Entdeckerbild** (`src/diagrams.ts`).

### Ehrliche Grenzen (`supported` in `coverage.json`)

Folgende Kompetenzerwartungen bereitet die App gezielt vor, ohne Präsenzunterricht zu ersetzen (`status: "supported"`):
- Verständiges, quantitätsgerechtes lautes Vortragen und Aussprache (`L7-04`, `L7-07`)
- Kumulativer Aufbau des lehrwerkabhängigen ca. 900-Wörter-Grundwortschatzes (`L7-05`)
- Reale Spurensuche an Inschriften, archäologischen Stätten (Cambodunum) und Originalen in Antikenmuseen (München) sowie Original-Bildvergleiche (`L7-13`, `L7-27`, `L7-37`)
- Partner-/Gruppenarbeit, kreative Projekte/Rollenspiele, individuelle Lern- und Arbeitsorganisation sowie direkte Rückmeldung durch Lehrkräfte (`L7-42`, `L7-45` bis `L7-51`)

## 3. Bestandsabgleich mit bestehenden ZAM-Karten (`replaces-de-by.json`)

Geprüft in `zam-os/zam` (`main`, Commit `4aeaa8e3455937f8a53cd57e686ff98d602a0561`) am `2026-11-26`:

### A. Direkte Klasse-7-Bestandszelle (`proposal-only`, `approved: null`)

- **Zelle:** `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen`
- **Byte-exakter Snapshot:** `latein-gymnasium-7-l2/tests/fixtures/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json` (SHA-256: `55eae4d0e1a12849f4bd74a46374391c2b6e7fb544c0f26bbb34018b1b2f365f`)
- **Erstveröffentlichung ohne `replaces`/`retired_items`:** Gemäß Thomas’ Vorgabe vom 2026-10-22 erscheint `cell.json` zunächst ohne Verlaufsübertragung; alle 4 Alt-Karten bleiben aktiv, bis Thomas den Vorschlag ausdrücklich freigibt.

| Alt-ID | Tier | Inhalt (Alt-Karte) | Vorschlag | Vorgeschlagener Nachfolger | Begründung |
| --- | --- | --- | --- | --- | --- |
| `01K4T7A0000000000000000J01` | Tier 1 | AcI-Subjektsakkusativ → Subjekt im Nominativ im dass-Satz | **A** (`propose-replace-after-approval`) | `l7-aci-passiv-check` | Gleiche atomare Abrufleistung |
| `01K4T7A0000000000000000J02` | Tier 2 | Mehrteilige AcI-Synthese (Kopfverben, 3 Schritte, Aktiv-Zeitverhältnisse) | **C** (`keep-active`) | — | Zusammengesetzte Mehrteilkarte (AcI aktiv startet in L2 schon in Jgst. 6); wird nicht auf mehrere atomare Karten aufgeteilt |
| `01K4T7A0000000000000000J03` | Tier 1 | Bedeutung des PPP (vorzeitig und Passiv) | **A** (`propose-replace-after-approval`) | `l7-ppp-formen-check` | Gleiche atomare Abrufleistung |
| `01K4T7A0000000000000000J04` | Tier 2 | Mehrteilige PC-Synthese (PPP, PPA, KNG, 4 Übersetzungsmethoden) | **C** (`keep-active`) | — | Auf vier spezialisierte Lektionen/atomare Karten aufgeteilt; keine Verlaufsübertragung |

### B. Nachbarzelle aus Klasse 8 (offene Abgrenzungsfrage an Thomas)

- **Zelle:** `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` (4 Items: `01K8G8K0000000000000000J01`–`J04`, SHA-256: `6874a4d44dfe2bc0f5ad80b53ea2d851c2baad4a44fcba698f70542799eb3684`)
- **Befund:** Nach dem LehrplanPLUS Bayern für Latein als 2. Fremdsprache (L2) liegen der **Ablativus absolutus** (`J01`, `J02`) sowie **Irrealis und Consecutio temporum** (Teil von `J04`) bereits in **Klasse 7** (`L7 2.3`), während **Hortativ, Jussiv und Optativ** (`J03`, Teil von `J04`) erst in **Klasse 8** (`L8 2.3`) folgen.
- **Handhabung:** Diese Nachbarzelle wurde bewusst **nicht** in das Mapping von Klasse 7 aufgenommen, damit keine Karte doppelt zugeordnet wird. Frage an Thomas: Soll `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` vollständig bei einem künftigen Klasse-8-Paket verbleiben, oder sollen die Ablativus-absolutus-Karten (`J01`/`J02`) in ein späteres freigegebenes Mapping von Klasse 7 aufgenommen werden?

## 4. Verifizierte Quellen (`source-checks.json`)

Alle 5 externen Links wurden am `2026-11-26` abgerufen und ihre Seitentitel sowie SHA-256-Prüfsummen in `latein-gymnasium-7-l2/source-checks.json` festgehalten (LehrplanPLUS L7 L2, LehrplanPLUS Fachprofil Latein, Staatliche Antikensammlungen & Glyptothek München, Archäologische Staatssammlung München, Archäologischer Park Cambodunum Kempten). Erklärvideos sind gemäß `AGENTS.md` Abschnitt 4 noch nicht enthalten.
