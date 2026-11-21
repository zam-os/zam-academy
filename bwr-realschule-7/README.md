# BwR 7 Realschule (LehrplanPLUS Bayern)

Lernpaket für **Betriebswirtschaftslehre / Rechnungswesen (BwR)** in Jahrgangsstufe 7 an der bayerischen Realschule für beide beteiligten Wahlpflichtfächergruppen (**Zweig II** und **Zweig IIIa**; Zweig I und IIIb haben in Klasse 7 laut BayRSO Anlage 1 keinen Wirtschaftsunterricht).

- **Live:** https://academy.zam-os.org/bwr-realschule-7/
- **ZAM-Zelle:** `zam-academy:bwr-realschule-7` ([`cell.json`](cell.json), 36 Atome, 72 Lernkarten)
- **Lehrplanabdeckung:** [`coverage.json`](coverage.json) (alle 28 Kompetenzerwartungen von Zweig II und alle 20 von Zweig IIIa wortgleich abgeglichen)
- **Bestandsabgleich:** [`replaces-de-by.json`](replaces-de-by.json) (`proposal-only`, ohne Freigabe — `cell.json` deklariert weder `replaces` noch `retired_items`) und [Dokumentation](../docs/bwr-7-coverage.md)

## Inhalt und Umfang

- **Lernbereich 1 · Wirtschaftliches Handeln im privaten Haushalt** (7 Lektionen in II / 5 in IIIa): Einkommen und Ausgaben, Überschuldungsgefahr, Konsumentscheidungen, Belege, Zahlungsverkehr, Prozentrechnung, vermehrter/verminderter Grundwert (II) und Infografiken (II).
- **Lernbereich 2 · Wirtschaftliches Handeln im Unternehmen** (7 Lektionen in II / 6 in IIIa): Wirtschaftsstruktur, nachhaltige Unternehmensziele, Produktionsfaktoren, Standortwahl, Einzelunternehmung vs. GmbH, Businessplan/Handelsregister/Firma (II) und Funktionsbereiche im Fertigungsbetrieb.
- **Lernbereich 3 · Einführung in die Geschäftsbuchführung** (9 Lektionen in II und IIIa): Inventur und Inventar, Bilanz und Bilanzgleichung, vier Bilanzveränderungen, bestands- vs. erfolgswirksame Vorgänge, Aktiv-/Passivkonten nach der ISB-Kontenliste für BwR 7 (alle Kontokürzel inkl. `Vorräte`), Buchungssatz und GoB, Rückwärtsformulierung und Belegprüfung, Umsatzsteuer rechnen und buchen (`VORST` / `UST`).
- **Lernbereich 4 · Buchhalterische Erfassung des betrieblichen Produktionsprozesses** (6 Lektionen in II / 5 in IIIa): Produktionsprozess und Periodenerfolg, vier Werkstoffarten (`AWR` bis `AWB`), Angebotsvergleich mit Sofortrabatt und nichtmonetären Faktoren, Einkauf von Werkstoffen, Verkauf von Fertigerzeugnissen (`UEFE`) sowie ausfüllbare Verkaufsbelege auf Vordrucken (II).
- **Lernbereich 5 · Strukturierung der Geschäftsbuchführung** (7 Lektionen in II; in IIIa erst ab Klasse 8): Konteneröffnung aus der Eröffnungsbilanz, Grund- und Hauptbuch, Abschluss über `GUV`, das Konto `EK` als Nahtstelle, `SBK` vs. Schlussbilanz, Bilanzvergleich sowie Inventurdifferenzen.

Die App enthält **acht veränderbare Modelle** mit erreichbaren Zielen, **24 Aufgabenfamilien** auf zwei Niveaus (mit centgenauer Buchungsprüfung nach der amtlichen ISB-Kontenliste für BwR 7; vierstellige IKR-Kontonummern folgen laut ISB-Handreichung ab Jahrgangsstufe 8) sowie eine nach Zweig gefilterte Formelsammlung samt Kontenübersicht.

## Entwicklung und Prüfung

```bash
npm ci
npm run dev      # http://localhost:5272/bwr-realschule-7/
npm test
npm run build    # Einzeldatei in dist/index.html
npm run package:zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

## Datenschutz und Hinweise für Eltern und Lehrkräfte

Fortschritt und eigene Begründungstexte bleiben ausschließlich lokal im `localStorage` des Browsers (`bwr_rs7_academy_progress_v1`), getrennt nach Benutzerkonto des Geräts, Browser, Profil und Herkunft; es findet keine Synchronisierung, Auswertung oder Übertragung an Dritte statt. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du ein Konto mit anderen Lernenden teilst, lösche am Ende den Lernstand und alle eigenen Texte über **„Fortschritt zurücksetzen“** in der Seitenleiste.
