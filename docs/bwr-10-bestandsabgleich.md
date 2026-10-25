# BwR 10 · Lehrplanabgleich und Bestandsabgleich

Stand: 25. Oktober 2026. Das neue Paket [`bwr-realschule-10/`](../bwr-realschule-10/) ergänzt die Academy um 36 Kernlektionen, zwei optionale Auffrischungen und 76 Karten (Zelle `zam-academy:bwr-realschule-10`, Version 2026.10.1).

## Lehrplan

Quelle: [LehrplanPLUS Realschule, BwR 10 (II)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/bwl-rechnungswesen/wpfg2), am 25.10.2026 direkt abgerufen (kein Wayback-Snapshot nötig). Die Adressen `…/10/bwl-rechnungswesen/wpfg3a` und `…/wpfg3` leiten auf die Startseite um; BwR 10 gibt es nur in Wahlpflichtfächergruppe II. Deshalb hat das Paket einen einzigen Lernpfad mit `track: "II"`.

| LB | Titel | Stunden | Kompetenzerwartungen | Lektionen |
| --- | --- | ---: | ---: | ---: |
| 1 | Periodenrichtige Erfolgsermittlung und Rückstellungen | 10 | 4 | 7 |
| 2 | Unternehmensabschluss und Auswertung | 17 | 3 | 8 |
| 3 | Vollkostenrechnung: Kostenarten-, Kostenstellen- und Kostenträgerrechnung | 30 | 5 | 12 |
| 4 | Teilkostenrechnung | 15 | 4 | 9 |

Alle 16 Kompetenzerwartungen stehen wörtlich in [`coverage.json`](../bwr-realschule-10/coverage.json) mit ihren Lektionen; der Test `public learning contract` prüft, dass jede Kernlektion einer Kompetenz zugeordnet ist und jede Kompetenz Lektionen ihres Lernbereichs hat. Die im Fachlehrplan genannten Inhalte sind abgedeckt: 2900 ARA, 4900 PRA, 3900 RST, 5490 PFE, 6990 PFAW; aufbereitete GUV und Bilanz; Bar- und Einzugsliquidität, Anlagendeckung I und II, Eigenkapitalrentabilität; interner und externer Vergleich; Rechnungskreise, Anders- und Zusatzkosten, Gesamt-, neutrales und Betriebsergebnis; Einzel-, Sondereinzel- und Gemeinkosten; vier Kostenstellen, einstufiger BAB, Zuschlagssätze; Kostenträgerzeitrechnung mit Bestandsveränderungen; Zuschlagskalkulation; variable und fixe Kosten, Stück- und Gesamtdeckungsbeitrag, Gewinnschwelle rechnerisch und grafisch, Preisänderungen, Ein- und Zweiproduktunternehmen, Programmplanung, Zusatzauftrag, make or buy, kurz- und langfristige Preisuntergrenze.

Nachbarjahrgänge: BwR 8, LB 4, nennt die „Verkaufskalkulation (Vorwärts- und Differenzkalkulation)“ und Skonti; die Bezeichnungen Kundenskonto und Kundenrabatt im Schema folgen dem Grundwissen der Schulen. `vk-angebotspreis` ist als Wiederholung daraus gekennzeichnet. Die Eigenkapitalentwicklung und die goldene Finanzierungsregel aus BwR 9 werden in `ua-eigenkapital` und `ua-anlagendeckung` aufgegriffen. Die zwei optionalen Auffrischungen (Vorsteuer, Prozentrechnung im Hundert) haben keine Klasse-10-Bindung.

Schulkonventionen: Kontennummern und Abkürzungen nach dem [ISB-Kontenplan LehrplanPLUS](https://www.isb.bayern.de/fileadmin/user_upload/Realschule/BwR/Kontenplaene/Kontenplan_LehrplanPLUS.pdf). Die sieben Posten der aufbereiteten Bilanz, die Zuordnung von ARA, EWB und PWB zu den Forderungen und von RST und PRA zum kurzfristigen Fremdkapital, die Kennzahlformeln mit Richtwerten und die drei Fälle der Rückstellungsauflösung wurden mit einer Grundwissen-Zusammenfassung zum LehrplanPLUS 10 einer bayerischen Realschule (Staatliche Realschule Großostheim, 2025) abgeglichen. Kennzahlformeln sind gesetzlich nicht festgelegt; das sagt die App auch den Lernenden.

## Verhältnis zur bisherigen BwR-10-Zelle

Ausgangsbestand: `de-by:realschule-10-bwr-kosten-leistungsrechnung-kalkulation-bilanzanalyse` (Version 2026.08.1, zwei Atome, vier Karten). Die bytegenaue Kopie liegt unter `bwr-realschule-10/tests/fixtures/`; SHA-256 `a42ac47333b9e922cb44280544ebf19489b9cfbccb37535053a65a6ef3daa0ea`, Git-Blob identisch auf `zam-os/zam` main (`cd1a71b5e8a91aa3eec601b5db06095844d024e3`). Beide alten Atome sind als `lb1` gebunden, obwohl Kalkulation und Deckungsbeitrag zu LB 3 und LB 4 gehören.

| Alte Karte | Inhalt | Vorschlag | Nachfolger |
| --- | --- | --- | --- |
| `01K4WAK0000000000000000J01` | Herstellkosten = FM + MGK + FL + FGK | **A**, gleicher Einzelabruf | `bwr10-vk-zuschlagskalkulation-check` |
| `01K4WAK0000000000000000J02` | Ganzes Kalkulationsschema bis Bruttoverkaufspreis plus Rechnung | **C**, mehrteilig und teils nicht lehrplankonform („11-stufiges Schema“, USt-Aufschlag); Stilllegung vorgeschlagen | keiner |
| `01K4WAK0000000000000000J03` | db = p − kv | **A**, gleiche Frage, gleiche Formel | `bwr10-tk-db-check` |
| `01K4WAK0000000000000000J04` | Kostenauflösung, db, DB, Gewinnschwelle, Zusatzauftrag und Rechnung | **C**, mehrteilig, auf vier Lektionen verteilt; Stilllegung vorgeschlagen | keiner |

Nach der Standardregel vom 22.10.2026 erscheint die Zelle zuerst **ohne** `replaces` und `retired_items`. `replaces-de-by.json` hat `status: "proposal-only"` und `approved: null`; der Katalog-Gate blockiert deshalb nichts. Erst nach ausdrücklicher Freigabe durch Thomas folgt Version 2026.10.2 mit den zwei `replaces` und den zwei `retired_items`. Diese Lücke sollte kurz bleiben: Wer in der Zwischenzeit Karten auf einer alten und ihrer neuen ID hält, lässt die spätere Installation scheitern.

## Prüfung

`bwr-realschule-10/scripts/validate-migration.mjs` (in CI registriert) läuft mit `zam-core@0.54.0` in temporären Bibliotheken:

1. Veröffentlichte Zelle: Die vier alten Karten mit acht Reviews bleiben nach zweimaliger Installation bytegleich und aktiv; die Einschreibung erzeugt 76 neue, unbewertete Karten; wiederholte Einschreibung ändert nichts.
2. Probe des Vorschlags an einer Kopie im Arbeitsspeicher: Die zwei A-Historien wandern unverändert auf ihre Nachfolger, die zwei C-Karten verlassen die aktive Wiederholung mit erhaltenen Reviews, 74 neue Karten; ein Lernender mit Karten auf alter und neuer ID lässt die Installation eine automatische Zusammenführung verweigern.
