# Chemie 8 Realschule: Lehrplanabgleich und Kartenzuordnung

Stand 26.10.2026. Paket [`chemie-realschule-8/`](../chemie-realschule-8/).

## Quelle und Zweigstruktur in Jahrgangsstufe 8

LehrplanPLUS Realschule Chemie 8, direkt geprüft am 26.10.2026:

- Wahlpflichtfächergruppe I: https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/chemie/wpfg1
- Wahlpflichtfächergruppen II, IIIa und IIIb haben in Jahrgangsstufe 8 **keinen** Chemieunterricht (Chemie beginnt dort erst in Jahrgangsstufe 9).

`coverage.json` enthält sämtliche **51 Kompetenzerwartungen** von Chemie 8
(Zweig I) im Wortlaut mit zugeordneten Lektionen und Nachweis. Die Vitest-Suite
(`tests/curriculum-and-labs.test.ts`) sichert ab, dass jede der 51
Kompetenzerwartungen mindestens einer Lektion zugeordnet ist, keine Duplikate
auftreten, jede Lektion aus LB 2–5 exakt ihrem Lernbereich dient und jede der
32 Lektionen Kompetenzen des Fachlehrplans abdeckt.

## Lernbereiche (Zweig I)

| Lernbereich | Richtstunden | Lektionen im Paket |
| --- | --- | --- |
| LB 1 Wie Chemiker denken und arbeiten | integriert | 3 Leit-Lektionen (`ch-gefahrstoffe-sicherheit`, `ch-experiment-protokoll`, `ch-modelle-fachsprache`) + durchgängige Einbindung in LB 2–5 |
| LB 2 Stoffe und ihre Eigenschaften | 14 | 6 Lektionen |
| LB 3 Aufbau der Materie | 10 | 5 Lektionen |
| LB 4 Chemische Reaktion | 22 | 13 Lektionen |
| LB 5 Atombau und Periodensystem der Elemente | 10 | 5 Lektionen |

## Abgrenzung zu Chemie 9 und Chemie 10

- **In C8 (Zweig I) verankert:** Gefahrstoffe/GHS, Kenngrößen (Dichte ρ = m / V), Nachweisreaktionen (O₂, H₂, CO₂, H₂O), Reinstoffe/Gemische, Teilchenmodell & Phasenübergänge inkl. Sublimation/Resublimation, Trennverfahren (Filtration, Destillation, Magnetscheiden, Extraktion), Luft & Linde-Verfahren, Dalton-Atommodell, Metalle/Nichtmetalle, vier Teilchenverbände (Atomgitter, Metallgitter, Moleküle, Ionengitter), Bindigkeit & binäre Nichtmetallmoleküle mit griechischen Zahlwörtern, Ionenverhältnis & binäre Salze (inkl. Nebengruppenkationen mit römischer Ladungszahl), Gitterverschiebung & Leitfähigkeit, chemische Reaktion als Atomumgruppierung, Massenerhaltung & Reaktionsgleichungen, innere Energie Eᵢ, Aktivierungsenergie E_A, ΔEᵢ im Energiediagramm, Katalyse & Vorgänge an der Katalysatoroberfläche, Teilchenmasse in u & 10⁻²⁴ g, Avogadro-Konstante N_A, molare Masse M, Stoffmenge n, molares Gasvolumen V_m = 22,4 l/mol, Stoffumsatzberechnungen, Alkane (Methan bis Octan, Summenformeln, vollständige/unvollständige Verbrennung), Drei-Wege-Abgaskatalysator & Rußpartikelfilter, Verbrennungsdreieck/Explosion/Brandschutz, CO₂-Bilanz & Kohlenstoffkreislauf, Rutherford-Streuversuch & Kern-Hülle-Modell, Energiestufenmodell (Ionisierungsenergien & Flammenfärbung), PSE (Hauptgruppen, Perioden, Edelgasregel, Helium-Besonderheit), Kugelwolkenmodell, Isotopie & nicht ganzzahlige molare Massen.
- **Erst ab C9 / C10 (nicht vorgezogen):** Elektronenübergänge als Redox-Teilgleichungen, Oxidationszahlen, Strukturformeln/Isomerie und zwischenmolekulare Kräfte organischer Verbindungen, Reaktionsenthalpie ΔH, mehratomige Ionen/Säurereste, Säuren/Basen nach Brönsted, pH-Wert und Titration (`chemie-realschule-9`, `chemie-realschule-10`).
- **Nicht im Realschullehrplan:** s/p/d/f-Orbitalmodell, ideale Gasgleichung p · V = n · R · T, Chromatographie und Zentrifugieren als Pflichtverfahren in C8 LB 2.

## Lektionen je Lernbereich

| LB | Kompetenzen | Zugeordnete Lektionen |
| --- | --- | --- |
| 1 | 13 | `ch-gefahrstoffe-sicherheit`, `ch-experiment-protokoll`, `ch-modelle-fachsprache` sowie fachintegriert in LB 2–5 |
| 2 | 7 | `ch-sinne-kenngroessen`, `ch-nachweisreaktionen`, `ch-reinstoffe-gemische`, `ch-teilchenmodell-phasen`, `ch-trennverfahren`, `ch-luft-linde` |
| 3 | 8 | `ch-dalton-elementklassen`, `ch-teilchenverbaende`, `ch-bindigkeit-molekuele`, `ch-ionenverhaeltnis-salze`, `ch-verband-eigenschaften` |
| 4 | 16 | `ch-merkmale-umgruppierung`, `ch-elemente-verbindungen`, `ch-wasser-analyse-synthese`, `ch-massenerhaltung-gleichungen`, `ch-innere-energie-diagramm`, `ch-katalyse-oberflaeche`, `ch-teilchenmasse-molare-masse`, `ch-stoffmenge-molvolumen`, `ch-stoffumsatz-rechnen`, `ch-alkane-verbrennung`, `ch-abgaskatalysator-partikelfilter`, `ch-verbrennung-explosion-brandschutz`, `ch-co2-bilanz-kohlenstoffkreislauf` |
| 5 | 7 | `ch-rutherford-kern-huelle`, `ch-energiestufen-flammen`, `ch-pse-edelgasregel-ionen`, `ch-kugelwolkenmodell`, `ch-isotopie-molare-masse` |

## Bestehende ZAM-Karten (freigegebene Zuordnung ab `2026.10.2`)

Quelle: `zam-os/zam`, Commit `cd1a71b5e8a91aa3eec601b5db06095844d024e3`,
`tests/fixtures/curriculum/`. Byte-genaue Kopien liegen in
`chemie-realschule-8/tests/fixtures/` mit SHA-256-Prüfsummen in
[`replaces-de-by.json`](../chemie-realschule-8/replaces-de-by.json).

**Status:** `"approved"`, `"approved": "2026-10-26"` (ausdrückliche Freigabe
durch Thomas nach Merge von `zam-os/zam-academy#59`). Version `2026.10.2` der
[`cell.json`](../chemie-realschule-8/cell.json) deklariert genau **acht
`replaces`** und **acht `retired_items`**; sämtliche 98 ULIDs, Slugs,
Lektionsanker und Kartentexte aus `2026.10.1` sind unverändert.

| Kategorie | Anzahl | Wirkung in `2026.10.2` |
| --- | --- | --- |
| A | 8 | gleicher atomarer Einzelabruf; Nachfolgekarte trägt `replaces`, Karte und Reviewhistorie ziehen um |
| B | 0 | keine mehrteilige Altkarte wird als Sammelaufgabe fortgeführt |
| C | 8 | mehrteilige Sammelaufgaben bzw. Vorgriffe (Chromatographie/Zentrifugieren, ΔH, fehlerhafte Zweig-II/III-Bindung in C8); per `retired_items` stillgelegt, Historie bleibt am alten Token erhalten |

| Altes Item | Zelle | Kat. | Nachfolger / Wirkung | Kurzbegründung |
| --- | --- | --- | --- | --- |
| `01K4C8S...J01` | stoffe-stoffgemische-trennung | A | `c8-reinstoffe-gemische-suspension` | Gleicher Einzelabruf: Feststoffpartikel in Flüssigkeit = Suspension. |
| `01K4C8S...J02` | stoffe-stoffgemische-trennung | C | `retired_items` | Sechsteilige Stoffsystematik-Sammelaufgabe; aufgeteilt auf `ch-reinstoffe-gemische` und `ch-elemente-verbindungen`. |
| `01K4C8S...J03` | stoffe-stoffgemische-trennung | A | `c8-sinne-kenngroessen-dichte` | Gleicher Einzelabruf: Definition der Dichte ρ = m / V. |
| `01K4C8S...J04` | stoffe-stoffgemische-trennung | C | `retired_items` | Mehrteilige Sammelaufgabe aus Kenngrößenbegriff, Rechnung (135 g / 50 cm³) und Metallbestimmung. |
| `01K4C8S...J05` | stoffe-stoffgemische-trennung | A | `c8-trennverfahren-destillation` | Gleicher Einzelabruf: Destillation nutzt unterschiedliche Siedetemperaturen. |
| `01K4C8S...J06` | stoffe-stoffgemische-trennung | C | `retired_items` | Fünf Trennverfahren inkl. Chromatographie/Zentrifugieren (nicht C8 LB 2) plus Dreistoff-Trennplan. |
| `01K4C8S...J07` | stoffe-stoffgemische-trennung | A | `c8-teilchenmodell-phasen-sublimation` | Gleicher Einzelabruf: Phasenübergang fest → gasförmig = Sublimation. |
| `01K4C8S...J08` | stoffe-stoffgemische-trennung | C | `retired_items` | Gesamtabruf über alle drei Aggregatzustände, sechs Phasenübergänge und Diffusion auf einer Karte. |
| `01K4C8R...J01` | chemische-reaktion-oxidation | A | `c8-merkmale-umgruppierung-unterschied` | Gleicher Einzelabruf: chemische Reaktion vs. physikalischer Vorgang. |
| `01K4C8R...J02` | chemische-reaktion-oxidation | C | `retired_items` | Mehrteilige Synthese (drei Kriterien + Vergleich Wachsschmelzen vs. Kerzenverbrennung). |
| `01K4C8R...J03` | chemische-reaktion-oxidation | A | `c8-katalyse-oberflaeche-wirkung` | Gleicher Einzelabruf: Wirkung eines Katalysators (senkt E_A, unverändert nach Reaktion). |
| `01K4C8R...J04` | chemische-reaktion-oxidation | C | `retired_items` | Mehrteiliger Zeichenauftrag inkl. Vorgriff auf Reaktionsenthalpie ΔH statt ΔEᵢ. |
| `01K4C8R...J05` | chemische-reaktion-oxidation | A | `c8-verbrennung-explosion-brandschutz-dreieck` | Gleicher Einzelabruf: drei Bedingungen des Verbrennungsdreiecks. |
| `01K4C8R...J06` | chemische-reaktion-oxidation | C | `retired_items` | Sammelaufgabe aus Oxidationsbegriff, Verbrennungsdreieck und drei Löschprinzipien. |
| `01K4C8R...J07` | chemische-reaktion-oxidation | A | `c8-massenerhaltung-gleichungen-lavoisier` | Gleicher Einzelabruf: Gesetz von der Erhaltung der Masse im geschlossenen System. |
| `01K4C8R...J08` | chemische-reaktion-oxidation | C | `retired_items` | Mehrteilige Sammelaufgabe (Teilchendeutung, Eisenwolle-Paradoxon, zwei Reaktionsgleichungen). |
