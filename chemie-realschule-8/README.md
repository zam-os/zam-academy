# Chemie 8 Realschule · ZAM Academy

Chemie für die 8. Klasse der bayerischen Realschule nach LehrplanPLUS
(Wahlpflichtfächergruppe I, da Chemie in den Zweigen II/IIIa/IIIb erst in
Jahrgangsstufe 9 einsetzt): fünf Etappen, 32 Lektionen, digitale Labormodelle
und Aufgaben auf zwei Niveaus. Die App wird unter
`https://academy.zam-os.org/chemie-realschule-8/` veröffentlicht.

## Lernpfad und Umfang

**32 Lektionen** in fünf Etappen für **Zweig I** (Chemie als Profilfach ab
Jahrgangsstufe 8). Eine erste Nutzung beginnt in Etappe 1 auf Level 1.

| Etappe | Inhalt | LehrplanPLUS (Zweig I) |
| --- | --- | --- |
| 1 Wie Chemiker denken und arbeiten | Gefahrstoffe & GHS, Experiment & Versuchsprotokoll, Modelle & Fachsprache | LB 1 (integriert in alle LBs) |
| 2 Stoffe und ihre Eigenschaften | Sinne & Kenngrößen (Dichte), Nachweisreaktionen, Reinstoffe & Gemische, Teilchenmodell & Phasenübergänge, Trennverfahren, Luft & Linde-Verfahren | LB 2 (6 Lektionen) |
| 3 Aufbau der Materie | Dalton & Elementklassen, Teilchenverbände, Bindigkeit & binäre Nichtmetallmoleküle, Ionenverhältnis & binäre Salze, Teilchenverband & Stoffeigenschaften | LB 3 (5 Lektionen) |
| 4 Chemische Reaktionen, Energie und Stoffumsatz | Merkmale & Umgruppierung, Elemente & Verbindungen, Wasser (Analyse & Synthese), Massenerhaltung & Reaktionsgleichungen, innere Energie & Energiediagramm, Katalyse & Katalysatoroberfläche, Teilchenmasse & molare Masse, Stoffmenge & molares Volumen, Stoffumsatzberechnung, Alkane & Verbrennungsprodukte, Abgaskatalysator & Partikelfilter, Verbrennungsdreieck & Brandschutz, CO₂-Bilanz & Kohlenstoffkreislauf | LB 4 (13 Lektionen) |
| 5 Atombau, Periodensystem und Kugelwolkenmodell | Rutherford & Kern-Hülle-Modell, Energiestufen & Flammenfärbung, PSE & Edelgasregel, Kugelwolkenmodell, Isotopie & nicht ganzzahlige molare Massen | LB 5 (5 Lektionen) |

Jede Lektion bietet eine Erklärung mit konkretem Beispiel, einen Merksatz,
Begriffe für die Formelsammlung, einen Schnellcheck, ein interaktives SVG-Labor
mit mindestens drei prüfbaren Laboraufträgen (26 parametrische Modelle, davon
10 mit direkt ziehbaren Griffen, sowie 6 Hypothese-Beobachtung-Modellversuche)
und zwei Aufgabengeneratoren. Level 1 stellt geführte Aufgaben mit gegebenen
Größen und Formelhilfe; Level 2 stellt eigenständige Transferaufgaben. Typische
Rechenfehler erhalten gezielte Hinweise. Für den Lektionsabschluss sind
Schnellcheck, alle Laboraufträge und drei gelöste Aufgaben auf Level 1 nötig.

Die App läuft vollständig lokal ohne Benutzerkonto und ohne Fremdanfragen. Der
Lernstand wird unter `chemie_rs8_academy_progress_v1` im Browser gespeichert.

## Modelle und fachliche Grenzen

Die Labore sind digitale Schulmodelle und keine Anleitung für unbeaufsichtigte
Experimente.

- Dichten, Schmelz- und Siedetemperaturen sind gerundete Tabellenwerte bei
  Normdruck (1013 hPa); Iod und Trockeneis werden im offenen Gefäß als direkt
  sublimierend modelliert.
- Das Linde-Labor modelliert die fraktionierte Destillation flüssiger Luft über
  die Siedepunkte von N₂ (−196 °C), Ar (−186 °C) und O₂ (−183 °C).
- Binäre Salze werden in Jahrgangsstufe 8 gemäß LehrplanPLUS aus einatomigen
  Hauptgruppen- und Übergangsmetallionen aufgebaut; mehratomige Ionen und
  Reaktionsenthalpie ΔH folgen ab Jahrgangsstufe 9/10.
- Energetische Betrachtungen verwenden lehrplankonform die Änderung der inneren
  Energie ΔEᵢ = Eᵢ(Produkte) − Eᵢ(Edukte) und die Aktivierungsenergie E_A.
- Gasvolumina im Stoffmengen- und Stoffumsatzlabor beziehen sich auf
  Normbedingungen (0 °C, 1013 hPa) mit V_m = 22,4 l/mol.
- Das Kugelwolkenmodell und die PSE-Übersicht decken die Elemente Z = 1 bis 20
  ab (Helium steht in Hauptgruppe VIII, besitzt aber 2 Außenelektronen).

## Die ZAM-Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **32 Atome, 66 Karten**. Alle **98
ULIDs** wurden einmalig mit `ulid()` erzeugt und sind zusammen mit den 32
Lektionsankern in `tests/fixtures/public-contract.json` festgeschrieben.
Chemische Formeln und Größengleichungen sind als Segmente mit TeX und deutscher
Sprechfassung hinterlegt; Felder tragen entweder Klartext oder Segmente, nie
beides zugleich. Jede Karte verweist auf ihre Lektion unter
`https://academy.zam-os.org/chemie-realschule-8/#lesson=<id>` und trägt die
Lehrplanbindung für Jahrgangsstufe 8 (`track: "I"`).

`replaces-de-by.json` dokumentiert die am **26.10.2026 von Thomas ausdrücklich
freigegebene Kartenzuordnung** (`"status": "approved"`, `"approved":
"2026-10-26"`) für alle **16 Items** der beiden Altzellen
`de-by:realschule-8-chemie-stoffe-stoffgemische-trennung` und
`de-by:realschule-8-chemie-chemische-reaktion-oxidation` (zam-os/zam
`cd1a71b5`): **8 A, 0 B, 8 C**. Version `2026.10.2` von `cell.json` deklariert
genau diese **acht `replaces`** und **acht `retired_items`**.

`scripts/validate-migration.mjs` prüft mit `zam-core` 0.54.0 in
Wegwerf-Datenbanken die Übernahme der 8 atomaren Historien samt FSRS-Feldern,
die Stilllegung der 8 mehrteiligen Sammelaufgaben unter vollständigem Erhalt
aller 32 Reviews, das Anlegen von 58 frischen Karten bei Einschreibung, die
Idempotenz bei wiederholter Installation/Einschreibung sowie den
Kollisionsschutz gegen Lernende, die bereits Version `2026.10.1` eingeschrieben
und Karten auf beiden IDs bewertet haben.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5209/chemie-realschule-8/
npm test
npm run typecheck
npm run build        # dist/index.html, eine Datei
npm run package:zip  # release/ZAM-Academy-Chemie-8-offline.zip
```

Vom Repository-Hauptverzeichnis mit installiertem `zam-core`:

```sh
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node chemie-realschule-8/scripts/validate-migration.mjs
```

## Quellen

- [LehrplanPLUS Chemie 8, Realschule, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/chemie/wpfg1), geprüft am 26.10.2026.
- Abgleich der Kompetenzen und Karten: [`docs/chemie-8-coverage.md`](../docs/chemie-8-coverage.md), `coverage.json`.
