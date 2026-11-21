# BwR 7 Realschule (LehrplanPLUS Bayern)

Lernpaket für **Betriebswirtschaftslehre / Rechnungswesen (BwR)** in Jahrgangsstufe 7 an der bayerischen Realschule für beide beteiligten Wahlpflichtfächergruppen (**Zweig II** und **Zweig IIIa**; Zweig I und IIIb haben in Klasse 7 laut BayRSO Anlage 1 keinen Wirtschaftsunterricht).

- **Live:** https://academy.zam-os.org/bwr-realschule-7/
- **ZAM-Zelle:** `zam-academy:bwr-realschule-7` ([`cell.json`](cell.json), 36 Atome, 72 Lernkarten)
- **Lehrplanabdeckung:** [`coverage.json`](coverage.json) (alle 28 Kompetenzerwartungen von Zweig II und alle 20 von Zweig IIIa wortgleich abgeglichen)
- **Bestandsabgleich:** [`replaces-de-by.json`](replaces-de-by.json) (`proposal-only`, ohne Freigabe — `cell.json` deklariert weder `replaces` noch `retired_items`) und [Dokumentation](../docs/bwr-7-coverage.md)

## Inhalt und Umfang

- **Lernbereich 1 · Wirtschaftliches Handeln im privaten Haushalt** (7 Lektionen in II / 5 in IIIa): Einkommen und Ausgaben, Überschuldungsgefahr, Konsumentscheidungen, Belege, Zahlungsverkehr, Prozentrechnung, vermehrter/verminderter Grundwert (II) und Infografiken (II).
- **Lernbereich 2 · Wirtschaftliches Handeln im Unternehmen** (7 Lektionen in II / 6 in IIIa): Wirtschaftsstruktur, nachhaltige Unternehmensziele, Produktionsfaktoren, Standortwahl, Einzelunternehmung vs. GmbH, Businessplan/Handelsregister/Firma (II) und Funktionsbereiche im Fertigungsbetrieb.
- **Lernbereich 3 · Einführung in die Geschäftsbuchführung** (9 Lektionen in II und IIIa): Inventur und Inventar, Bilanz und Bilanzgleichung, vier Bilanzveränderungen, bestands- vs. erfolgswirksame Vorgänge, Aktiv-/Passivkonten (alle 14 ISB-Konten), Buchungssatz und GoB, Rückwärtsformulierung und Belegprüfung, Umsatzsteuer rechnen und buchen (`2600 VORST` / `4800 UST`).
- **Lernbereich 4 · Buchhalterische Erfassung des betrieblichen Produktionsprozesses** (6 Lektionen in II / 5 in IIIa): Produktionsprozess und Periodenerfolg, vier Werkstoffarten (`6000 AWR` bis `6030 AWB`), Angebotsvergleich mit Sofortrabatt und nichtmonetären Faktoren, Einkauf von Werkstoffen, Verkauf von Fertigerzeugnissen (`5000 UEFE`) sowie Verkaufsbelege auf Vordrucken (II).
- **Lernbereich 5 · Strukturierung der Geschäftsbuchführung** (7 Lektionen in II; in IIIa erst ab Klasse 8): Konteneröffnung aus der Eröffnungsbilanz, Grund- und Hauptbuch, Abschluss über `8020 GUV`, das Konto `3000 EK` als Nahtstelle, `8010 SBK` vs. Schlussbilanz, Bilanzvergleich sowie Inventurdifferenzen.

Die App enthält **acht veränderbare Modelle** mit erreichbaren Zielen, **24 Aufgabenfamilien** auf zwei Niveaus (mit centgenauer Buchungsprüfung nach ISB-Kontenplan LehrplanPLUS) sowie eine Formelsammlung samt Kontenübersicht.

## Entwicklung und Prüfung

```bash
npm ci
npm run dev      # http://localhost:5255/bwr-realschule-7/
npm test
npm run build    # Einzeldatei in dist/index.html
npm run package:zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

Fortschritt und eigene Texte bleiben lokal im `localStorage` des Browsers (`bwr_rs7_academy_progress_v1`). Keine externen Anfragen, Konten oder Tracker.
