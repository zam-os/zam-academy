# Wirtschaft und Beruf 7 Mittelschule (LehrplanPLUS Bayern)

Lernpaket für **Wirtschaft und Beruf (WiB)** in Jahrgangsstufe 7 an der bayerischen Mittelschule für beide Klassenarten (**Regelklasse R7** und **Mittlere-Reife-Klasse M7**).

- **Live:** https://academy.zam-os.org/wirtschaft-mittelschule-7/
- **ZAM-Zelle:** `zam-academy:wirtschaft-mittelschule-7` ([`cell.json`](cell.json), 30 Atome, 60 Lernkarten)
- **Lehrplanabdeckung:** [`coverage.json`](coverage.json) (alle 15 Kompetenzerwartungen der Regelklasse R7 und alle 15 der Mittlere-Reife-Klasse M7 wortgleich abgeglichen)
- **Bestandsabgleich:** [`replaces-de-by.json`](replaces-de-by.json) (`proposal-only`, ohne Altbestand an Mittelschul-Zellen — `cell.json` deklariert weder `replaces` noch `retired_items`) und [Dokumentation](../docs/wirtschaft-mittelschule-7-coverage.md)

## Inhalt und Umfang

- **Lernbereich 1 · Projekt** (3 Lektionen in R7 / 4 in M7): Marktprojekt nach den fünf Phasen der vollständigen Handlung, Leittextmethode Schritt für Schritt, Kostendeckung und Überschuss im Marktprojekt sowie weitgehend selbständige Projektsteuerung (M7).
- **Lernbereich 2 · Arbeit** (5 Lektionen in R7 / 6 in M7): Sechs Arbeitsplatzmerkmale, betriebliche Zugangserkundung mit Schwerpunkt duale Ausbildung, Kategorien von Erwerbsarbeit, eigene Ordnungssystematiken für Berufe, abhängige Beschäftigung vs. Selbständigkeit sowie Unternehmer-Planspiel (M7).
- **Lernbereich 3 · Berufsorientierung** (4 Lektionen in R7 / 5 in M7): Berufswahlportfolio, Berufsberatung (§ 29 SGB III) und Kammern/Innungen (§ 71 BBiG), Profil- und Anforderungsabgleich, Selbst- und Fremdeinschätzung sowie Sichtweisen auf Arbeit und Ausbildungsbudget (M7).
- **Lernbereich 4 · Wirtschaft** (6 Lektionen in R7 / 7 in M7): Geldwert in Arbeitszeit, Einkommenshöhe und Lebensstandard (M7), Vier-Wochen-Einnahmen-Ausgaben-Plan, Markterkundung (Regalzonen und Grundpreis), Angebot und Nachfrage, Pausenverkauf und einfache Kassenübersicht.
- **Lernbereich 5 · Recht** (3 Lektionen in R7 und M7): Kinderarbeitsverbot (§ 5 Abs. 1 JArbSchG) und Ferienzweck, Ferienjob-Grenzen ab 15 Jahren (4 Wochen/Jahr, 8 Std./Tag, 40 Std./Woche, 6–20 Uhr, Ruhepausen nach § 11) sowie rechtlicher Unterschied zwischen Betriebspraktikum und Ferienjob.
- **Lernbereich 6 · Technik** (4 Lektionen in R7 / 5 in M7): Technikerkundung im Haushalt, ökonomische und ökologische Folgen (kWh, Standby, Energielabel), Grenzen, Amortisation und Rebound-Effekt (M7), Arbeit und Technik bei der Haushaltsproduktion sowie technischer Wandel und Qualifikation.

Die App enthält **30 dreiteilige interaktive SVG-Schaubilder**, **9 live reagierende SVG-Labore** mit erreichbaren Zielen, **18 Rechenaufgaben-Familien** auf zwei Niveaus, **30 Fallwerkstätten** sowie **60 Schreibaufgaben** auf zwei Stufen.

## Entwicklung und Prüfung

```bash
npm ci
npm run dev      # http://localhost:5278/wirtschaft-mittelschule-7/
npm test
npm run build    # Einzeldatei in dist/index.html
npm run package:zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

## Datenschutz und Hinweise für Eltern und Lehrkräfte

Fortschritt und eigene Begründungstexte bleiben ausschließlich lokal im `localStorage` des Browsers (`wib_ms7_academy_progress_v1`), getrennt nach Benutzerkonto des Geräts, Browser, Profil und Herkunft; es findet keine Synchronisierung, Auswertung oder Übertragung an Dritte statt. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du ein Konto mit anderen Lernenden teilst, lösche am Ende den Lernstand und alle eigenen Texte über **„Fortschritt zurücksetzen“** in der Seitenleiste.
