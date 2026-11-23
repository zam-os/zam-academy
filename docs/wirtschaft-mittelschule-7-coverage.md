# Wirtschaft und Beruf 7 Mittelschule · Lehrplanabdeckung und Bestandsabgleich

Stand: 23. November 2026 (`version: "0.0"`, Lehrkraftprüfung und Erklärvideos noch offen).

## 1. Amtliche Lehrplanquellen und Wortlautprüfung

Das Paket deckt beide Züge von **Wirtschaft und Beruf (WiB) 7** an der bayerischen Mittelschule gemäß [BayMSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayMSO-ANL_1) und LehrplanPLUS Bayern vollständig ab (`25` Lektionen in der Regelklasse **R7**, `30` Lektionen in der Mittlere-Reife-Klasse **M7**).

Beide amtlichen Fachlehrpläne wurden direkt abgerufen, als LF-normalisierte HTML-Fixtures im Paket gesichert und mit [`wirtschaft-mittelschule-7/scripts/check-curriculum.mjs`](../wirtschaft-mittelschule-7/scripts/check-curriculum.mjs) gegen die `30` Wortlautzeilen in [`wirtschaft-mittelschule-7/coverage.json`](../wirtschaft-mittelschule-7/coverage.json) geprüft (`30 verbatim competence rows (15 R, 15 M), 0 not found`):

| Zug | Amtliche Quelle | Abruf-SHA-256 | Verbatim-KEs | Lektionen | ZAM-Karten |
| --- | --- | --- | --- | --- | --- |
| **Regelklasse (R7)** | [LehrplanPLUS WiB 7 (R7)](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/wib/regelklasse) | `513f6f186502057a9eb5b6358f3437dbb984157650a8f876f61c1cb98a61e713` | `15` (`8 implemented`, `7 supported`) | `25` | `50` |
| **Mittlere-Reife-Klasse (M7)** | [LehrplanPLUS WiB 7 (M7)](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/wib/mittlere-reife-klasse) | `e84bed5862a3ed4d5c473970dace9b02ed50b66a662bb022e04e292284281300` | `15` (`8 implemented`, `7 supported`) | `30` | `60` |

## 2. Lernbereiche, M7-Vertiefungen und interaktive Labore

| LB | Lernbereich (LehrplanPLUS WiB 7) | Lektionen (R7 / M7) | M7-spezifische Lektion | Interaktive SVG-Labore |
| --- | --- | --- | --- | --- |
| **1** | Projekt | `3` / `4` | `pr-leittext-selbstaendig` (Leitfragen & Prüfkriterien selbständig entwickeln) | `projectPlan` (Marktprojekt-Deckungsbeitrag & Budget) |
| **2** | Arbeit | `5` / `6` | `ar-planspiel-selbstaendigkeit` (Planspiel Unternehmerrolle) | `workplaceCheck` (Arbeitsplatz-Prüfstand), `selfEmployedSim` (Planspiel, M7) |
| **3** | Berufsorientierung | `4` / `5` | `bo-finanzielle-aspekte-sichtweisen` (Azubi-Budget & Sichtweisen) | `careerMatch` (Gewichteter Tätigkeitsabgleich) |
| **4** | Wirtschaft | `6` / `7` | `wi-einkommen-lebensstandard` (Einkommensspanne & Lebensstandard) | `householdBudget` (4-Wochen-Haushaltsplan), `marketMechanism` (Angebot & Nachfrage), `schoolSale` (Pausenverkauf) |
| **5** | Recht | `3` / `3` | — (identischer Pflichtumfang in R7 und M7) | `holidayJobCheck` (JArbSchG-Ferienjob-Rechtsprüfer) |
| **6** | Technik | `4` / `5` | `te-grenzen-chancen-risiken` (Grenzen, Chancen und Risiken von Haushaltstechnik) | `applianceCheck` (Haushaltsgeräte-Prüfstand mit Standby-Bilanz) |

## 3. Unterrichtsbegleitende Kompetenzen (`status: "supported"`) und Nachbarklassen

Sieben Kompetenzzeilen je Zug erfordern reale Erkundungen, schulische Verkaufsprojekte oder längerfristige Alltagsbeobachtungen im Unterricht und bleiben deshalb als `supported` markiert:

- **LB 1 (`pr-vollstaendige-handlung`, `pr-leittextmethode`, `pr-marktprojekt-umsetzen`, `pr-leittext-selbstaendig`):** Phasensystematik, Leittextschritte und Pausenmarkt-Kalkulation werden interaktiv geübt; die reale Gruppenarbeit am Marktprojekt und die Präsentation erfolgen in der Klasse.
- **LB 2 (`ar-arbeitsplatzmerkmale`, `ar-zugangserkundung-ausbildung`):** Arbeitsplatzmerkmale, Prüfstand und Ausbildungsordnung werden digital trainiert; der tatsächliche Betriebsbesuch und die Befragung vor Ort bleiben Unterrichtspraxis.
- **LB 3 (`bo-berufswahlportfolio`):** Portfolio-Aufbau und Nachweisprüfung trainiert die App; das fortlaufende Führen des realen Berufswahlordners übernimmt der Lernende im Unterricht.
- **LB 4 (`wi-einnahmen-ausgaben-planen`, `wi-markterkundung`, `wi-angebot-und-nachfrage`, `wi-pausenverkauf-handeln`, `wi-einnahmen-ausgaben-projekt`):** Vier-Wochen-Planung, Markterkundungsaspekte, Preisbildung und Pausenverkauf werden im Modell und Zahlenbeispiel eingeübt; das persönliche reale Geldtagebuch, der reale Marktbesuch und der Pausenverkauf in der Schule ergänzen die App.
- **LB 6 (`te-technikerkundung-haushalt`):** Beobachtungsaufgaben und Geräteprotokoll-Auswertung werden trainiert; das mehrwöchige Protokollieren echter Haushaltsgeräte findet zu Hause statt.

**Abgrenzung zu Nachbarklassen:**
- **WiB 6 ([LehrplanPLUS WiB 6](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/wib/regelklasse)):** Führt Arbeitsplatzmerkmale und erste Projektarbeit ein (`M7`/`R7` vertiefen diese auf die Arbeitswelt-/Berufsausbildungs-Zugangserkundung, vollständige Leittextmethode, mehrwöchiges Geldtagebuch, Markt-Pausenverkauf, JArbSchG-Ferienarbeit und ökonomisch-ökologische Haushaltstechnik).
- **WiB 8 ([R8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/regelklasse) · [M8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/mittlere-reife-klasse)):** Vertieft Betriebspraktikum, Berufsausbildungsvertrag, Konsumkredite/Verschuldung, Kaufvertrag/Gewährleistung sowie Globalisierung — bewusst noch nicht in Klasse 7 vorgezogen.

**Datenschutz bei freien Lernertexten (`AGENTS.md` Hard Rule 7):** Freie Entwürfe der Schreibaufgaben bleiben lokal im `localStorage` (`wib_ms7_academy_progress_v1`). Neben dem Eingabefeld erklärt ein aufklappbarer Hinweis die lokale Speicherung, und „Fortschritt zurücksetzen“ löscht Lernstand und Entwürfe gemeinsam.

## 4. Bestandsabgleich vorhandener ZAM-Karten (`replaces-de-by.json`)

[`wirtschaft-mittelschule-7/replaces-de-by.json`](../wirtschaft-mittelschule-7/replaces-de-by.json) ist als `"status": "proposal-only"`, `"approved": null` mit leeren `sources` und `rows` geführt. Im Bestand von `zam-os/zam` (Stand `7897672c2caa8435c89bf39eac41e1efc75521c2`) existiert keine `de-by:mittelschule-*`-Zelle für Wirtschaft und Beruf (`0` Alt-Karten); die vorhandenen Wirtschaft-/BwR-Zellen gehören zur Realschule (`de-by:realschule-7-bwr-*`, `de-by:realschule-8-wirtschaft-recht-konsum-geld-jugend`, `de-by:realschule-8-bwr-*`, `de-by:realschule-9-*`, `de-by:realschule-10-*`) sowie zum Gymnasium (`de-by:gymnasium-8/9/10/11/12/13-wirtschaft-recht-*`) und verbleiben bei ihrer jeweiligen Schulart. **Offene Frage an Thomas (`AGENTS.md` § 6):** Bestätigst du, dass auch thematisch benachbarte Realschul-/Gymnasial-Zellen anderer Schularten wie `de-by:realschule-8-wirtschaft-recht-konsum-geld-jugend` oder `de-by:gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz` bei ihrer Schulart bleiben und nicht in `wirtschaft-mittelschule-7` gemappt werden? Bis dahin deklariert [`wirtschaft-mittelschule-7/cell.json`](../wirtschaft-mittelschule-7/cell.json) `30` neue Atome und `60` neue Lernkarten ohne `replaces` oder `retired_items`.
