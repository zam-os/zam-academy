# BwR 7 Realschule · Lehrplanabdeckung und Bestandsabgleich

Stand: 21. November 2026 (`version: "0.0"`, Lehrkraftprüfung und Erklärvideos noch offen).

## 1. Geltungsbereich nach BayRSO Anlage 1 und LehrplanPLUS

An der bayerischen Realschule wird in Jahrgangsstufe 7 im Bereich Wirtschaft ausschließlich das Fach **Betriebswirtschaftslehre / Rechnungswesen (BwR)** unterrichtet — und zwar nur in den Wahlpflichtfächergruppen **II** (3 Wochenstunden) und **IIIa** (2 Wochenstunden). Die Zweige I und IIIb haben in Klasse 7 keinen Wirtschaftsunterricht; dort setzt *Wirtschaft und Recht* erst in Jahrgangsstufe 9 ein ([BayRSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1)).

Beide amtlichen Fachlehrpläne wurden am 21. November 2026 direkt abgerufen, als UTF-8-HTML-Fixtures im Paket gesichert und per `SHA-256` in [`bwr-realschule-7/coverage.json`](../bwr-realschule-7/coverage.json) dokumentiert:

| Zweig | Amtliche Quelle | Abruf-SHA-256 | Lernbereiche | Stunden | Verbatim-KEs | Kernlektionen | ZAM-Karten |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **II** | [LehrplanPLUS BwR 7 (WPFG II)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/bwl-rechnungswesen/wpfg2) | `bd12fb717fe05926e9af88d7ffaefa1f4e071c37fedcfb9bba0689660087f6e8` | LB 1–5 | 84 Std. | 28 (26 `implemented`, 2 `supported`) | 36 | 72 |
| **IIIa** | [LehrplanPLUS BwR 7 (WPFG IIIa)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/bwl-rechnungswesen/wpfg3a) | `0e5e9e353baed2b6db885130494f2cf4b89300c6c329dbbae12c60e7780055b8` | LB 1–4 | 56 Std. | 20 (18 `implemented`, 2 `supported`) | 25 | 50 |

`node bwr-realschule-7/scripts/check-curriculum.mjs` prüft alle 48 Zeilen (28 Zweig II + 20 Zweig IIIa) wortgleich gegen die gesicherten Original-HTML-Dateien (`48 verbatim competence rows (28 II, 20 IIIa), 0 not found`).

## 2. Lernbereiche, Lektionen und interaktive Labore

| LB | Titel (LehrplanPLUS) | Stunden (II / IIIa) | Lektionen (II / IIIa) | Interaktive Labore |
| --- | --- | --- | --- | --- |
| **1** | Wirtschaftliches Handeln im privaten Haushalt | 19 / 15 | 7 / 5 | Haushaltsbudget-Planer (`budget`), Achsenverzerrung im Säulendiagramm (`chart`, nur II) |
| **2** | Wirtschaftliches Handeln im Unternehmen | 17 / 8 | 7 / 6 | Standortfaktoren-Bewertung mit Gewichtung (`location`) |
| **3** | Einführung in die Geschäftsbuchführung | 17 / 17 | 9 / 9 | Bilanzwaage (`balance`), Bilanzveränderungs-Simulator (`bilanzChange`), Umsatzsteuer-Rechner (`vat`) |
| **4** | Buchhalterische Erfassung des betrieblichen Produktionsprozesses | 16 / 16 | 6 / 5 | Angebotsvergleich mit Sofortrabatt (`offerCompare`) |
| **5** | Strukturierung der Geschäftsbuchführung | 15 / — | 7 / 0 | Jahresabschluss-Fluss über Erfolgskonten → GUV → EK → SBK (`closingFlow`, nur II) |

Besonderheiten zwischen Zweig II und Zweig IIIa:

- **LB 1:** `hh-prozent-aenderung` (vermehrter/verminderter Grundwert) und `hh-infografiken` gehören im BwR-7-Lehrplan ausschließlich zu Zweig II.
- **LB 2:** `un-gruendung-firma` (Gründungsformalitäten, Businessplan, Handelsregister, Firma) ist in Zweig II explizit verankert; Zweig IIIa behandelt ausgewählte Gründungsaspekte (Produktionsfaktoren, Standort, Rechtsformen).
- **LB 4:** `pp-verkaufsbeleg` (Verkaufsbelege auf Vordrucken vervollständigen) steht nur in Zweig II; der Absatz von Fertigerzeugnissen (`pp-verkauf-fe`) gilt für beide Zweige.
- **LB 5:** Konteneröffnung, Grund-/Hauptbuch, GuV-Abschluss (`8020 GUV`), Eigenkapital-Nahtstelle (`3000 EK`), `8010 SBK`, Bilanzvergleich und Inventurdifferenzen folgen im Lehrplan für Zweig II in Klasse 7, in Zweig IIIa erst in Klasse 8.

## 3. Fachliche Konventionen und Abgrenzung zu BwR 8 und WuR

- **ISB-Kontenplan LehrplanPLUS:** Die App verwendet ausschließlich den amtlichen [ISB-Kontenplan und Abkürzungsverzeichnis (LehrplanPLUS)](https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/Kontenplaene/Kontenplan_LehrplanPLUS.pdf): `4400 VE` (nicht *VLL*), aufwandsorientierte Werkstoffbuchung (`6000 AWR`, `6010 AWF`, `6020 AWH`, `6030 AWB`), `5000 UEFE`, `2600 VORST`, `4800 UST`, `8010 SBK` und `8020 GUV`. Ein Konto *8000 EBK* existiert im LehrplanPLUS-Kontenplan nicht; in LB 5 werden Anfangsbestände direkt aus der Eröffnungsbilanz in die Bestandskonten übernommen.
- **Bewusst ausgesparte Themen höherer Klassen / anderer Fächer:** Ökonomisches Prinzip (Minimal-/Maximalprinzip) und Bedürfnishierarchien (Wirtschaft und Recht bzw. veraltete Lehrpläne), Skonto, Bezugskosten (`6001 BZKR`), USt-Zahllast-Verrechnung, Abschreibungen und Privatkonto sind **nicht** Gegenstand von BwR 7.

### Im Unterricht vor Ort ergänzte Kompetenzen (`status: "supported"`)

Vier Zeilen (je zwei in II und IIIa) in LB 2 erfordern echte Betriebserkundung und regionale Einordnung im Klassenverband und sind deshalb als `supported` statt `implemented` markiert:

- `un-wirtschaftsstruktur` (II und IIIa): Wirtschaftssektoren, Branchen und Größenklassen werden am Beispiel erläutert und geübt; die konkrete Einordnung realer Betriebe aus der eigenen Region bleibt Unterrichtsarbeit.
- `un-funktionsbereiche` (II und IIIa): Kernfunktionen (Beschaffung, Produktion, Absatz) sowie Leitung und Verwaltung werden am Modellunternehmen *Radwerk Brenner GmbH* systematisiert; eine reale Betriebserkundung ergänzt die App.

## 4. Bestandsabgleich vorhandener ZAM-Karten (`proposal-only`)

Die Datei [`bwr-realschule-7/replaces-de-by.json`](../bwr-realschule-7/replaces-de-by.json) hat ausdrücklich `"status": "proposal-only"` und `"approved": null`. **`bwr-realschule-7/cell.json` deklariert vor einer ausdrücklichen Freigabe durch Thomas weder `replaces` noch `retired_items`.**

Vollständige Bestandsaufnahme aller 10 Karten aus beiden vorhandenen `de-by`-Zellen der Jahrgangsstufe 7 (aus [`zam-os/zam`](https://github.com/zam-os/zam), Commit `7897672c2caa8435c89bf39eac41e1efc75521c2`):

- [`de-by-realschule-7-bwr-unternehmen-inventur-bilanz-kvt.json`](../bwr-realschule-7/tests/fixtures/de-by-realschule-7-bwr-unternehmen-inventur-bilanz-kvt.json) (`SHA-256`: `d053c3a46cfe2efb2351ad6990f4bfaa3748afb8f97d74b0c8a2dad197de9631`, 6 Karten)
- [`de-by-realschule-7-bwr-bestandskonten-buchungssatz-eroeffnung-kvt.json`](../bwr-realschule-7/tests/fixtures/de-by-realschule-7-bwr-bestandskonten-buchungssatz-eroeffnung-kvt.json) (`SHA-256`: `6b47ebfeff5ba515a8495ef4009e4b0d180145b2f6bbc334eb05308cef147fbb`, 4 Karten)

| Kategorie | Anzahl | Vorgeschlagene Aktion | IDs |
| --- | --- | --- | --- |
| **A** | 4 | `propose-replace-after-approval` | `…B0…J03` → `bwr7-gb-bilanz-check`, `…B0…J05` → `bwr7-gb-bilanzveraenderungen-check`, `…K0…J01` → `bwr7-gb-bestandskonten-check`, `…K0…J03` → `bwr7-gb-buchungssatz-check` |
| **B** | 0 | — | Keine mehrteilige Altfrage mit vollständig identischem Abrufumfang |
| **C (behalten)** | 2 | `keep-active` | `01K4W7B0000000000000000J01`, `01K4W7B0000000000000000J02` (Ökonomisches Prinzip / Bedürfnisse; nicht im BwR-7-LehrplanPLUS) |
| **C (stilllegen)** | 4 | `propose-retire-after-approval` | `…B0…J04` (nutzt *VLL* + mehrteilig), `…B0…J06` (Rohstoffkauf als Bestandsmehrung auf *VLL* ohne Vorsteuer + mehrteilig), `…K0…J02` (nutzt nicht existierendes *EBK* + mehrteilig über LB 3/5), `…K0…J04` (nutzt *Per … an …*, *R*, *VLL* ohne USt + mehrteilig) |

### Einzelüberblick aller 10 Alt-Karten

| Alt-ID | Altfrage (Kurzfassung) | Kategorie | Vorgeschlagene Aktion | Ziel-Slug / Begründung |
| --- | --- | --- | --- | --- |
| `01K4W7B0000000000000000J01` | Ausprägung des Ökonomischen Prinzips (1.000 Fahrräder mit geringstem Mitteleinsatz) | C | `keep-active` | Nicht im BwR-7-LehrplanPLUS enthalten; bestehender Lernstand bleibt aktiv. |
| `01K4W7B0000000000000000J02` | Knappheit, Bedürfnisse, Güterarten, Minimal-/Maximalprinzip | C | `keep-active` | Mehrteilige Synthese ohne Verankerung im BwR-7-LehrplanPLUS; bleibt aktiv. |
| `01K4W7B0000000000000000J03` | Fundamentale Bilanzgleichung (Eigenkapital / Reinvermögen) | A | `propose-replace-after-approval` | `bwr7-gb-bilanz-check`: identischer Einzelabruf (`Eigenkapital = Vermögen − Schulden`). |
| `01K4W7B0000000000000000J04` | Weg von Inventur über Inventar zur Bilanz inkl. Zahlenbeispiel | C | `propose-retire-after-approval` | Mehrteiliger Gesamtabruf; Alttext nutzt *VLL* statt `4400 VE`. |
| `01K4W7B0000000000000000J05` | Lieferwagen (35.000 Euro) per Banküberweisung | A | `propose-replace-after-approval` | `bwr7-gb-bilanzveraenderungen-check`: identischer Einzelabruf am selben Beispiel (Aktivtausch). |
| `01K4W7B0000000000000000J06` | Vergleich der vier Bilanzveränderungen + vier Geschäftsfälle | C | `propose-retire-after-approval` | Mehrteilig; Alttext bucht Rohstoffe auf *VLL* ohne Vorsteuer statt aufwandsorientiert (`6000 AWR` + `2600 VORST` an `4400 VE`). |
| `01K4W7K0000000000000000J01` | Kontoseite von AB und Zugängen beim Aktivkonto | A | `propose-replace-after-approval` | `bwr7-gb-bestandskonten-check`: identischer Einzelabruf (Soll-Seite links). |
| `01K4W7K0000000000000000J02` | Doppik: Aktiv-/Passivkonten, EBK und SBK | C | `propose-retire-after-approval` | Mehrteilige Synthese über LB 3 und LB 5 (nur II); verwendet *EBK* (nicht im ISB-Kontenplan) und *VLL*. |
| `01K4W7K0000000000000000J03` | Universelle Grundregel jedes Buchungssatzes | A | `propose-replace-after-approval` | `bwr7-gb-buchungssatz-check`: identischer Einzelabruf („Soll an Haben“). |
| `01K4W7K0000000000000000J04` | 4-stufiger Buchungsweg („Per … an …“) + drei Geschäftsfälle | C | `propose-retire-after-approval` | Mehrteilig; veraltete Notation „Per … an …“, BGA/Rohstoffe ohne USt, *R*/*VLL* statt `6000 AWR` + `2600 VORST` an `4400 VE`. |

### Geprüfte Nachbarklassen (`de-by:realschule-8-*`)

- **`de-by:realschule-8-bwr-erfolgskonten-guv-werkstoffe-rabatte`** (4 Karten: `J01`/`J02` zu Erfolgskonten/GUV, `J03`/`J04` zu Werkstoffeinkauf, `6001 BZKR`, Rabatten und Skonto): Diese Zelle mischt Grundlagen, die im LehrplanPLUS bereits in BwR 7 stehen (Aufwandsorientierte Werkstoffbuchung, Sofortrabatt, in Zweig II auch GUV), mit reinem BwR-8-Stoff (Löhne, Miete, Bezugskosten `6001 BZKR`, Skonto; GUV in Zweig IIIa). Sie bleibt hier bewusst **unberührt**. **Offene Frage an Thomas:** Soll `bwr-realschule-7` bei der späteren Migrationsfreigabe auch `01K4W8B0000000000000000J01` / `J03` aus dieser Klasse-8-Zelle übernehmen, oder verbleibt die gesamte Zelle beim künftigen Paket `bwr-realschule-8`?
- **`de-by:realschule-8-wirtschaft-recht-konsum-geld-jugend`**: Gehört zu Wirtschaft und Recht 8 (Zweig II) und bleibt unberührt.

## 5. Nachweise und Prüfstand

Im Paket (`bwr-realschule-7/`):
- `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip && node scripts/check-curriculum.mjs && node scripts/verify-release.mjs`
- `ZAM_CORE=<zam-core 0.54.0> node bwr-realschule-7/scripts/validate-cell.mjs`

Im Repository-Stamm:
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/package-version.test.mjs`
- `node scripts/package-version.mjs check main`
- `ZAM_CORE=<zam-core 0.54.0> node scripts/validate-cells.mjs`
- `node scripts/build-catalog.mjs <ziel>`

## 6. Offene Punkte

1. Fachliche Durchsicht und Abnahme durch eine BwR-Lehrkraft der 7. Realschulklasse (danach Freigabe der Hauptversion 1 durch Thomas).
2. Auswahl und Prüfung passender deutscher Erklärvideos nach `AGENTS.md` Abschnitt 4 (im ersten Paket bewusst ausgelassen).
3. Ausdrückliche Entscheidung und Freigabe von `replaces-de-by.json` (4 A / 6 C, inkl. Klärung der BwR-8-Nachbarkarten `J01`/`J03`) durch Thomas vor der Bündelung in ZAM.
