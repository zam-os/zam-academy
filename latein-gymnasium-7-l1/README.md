# Latein 7 Gymnasium · 1. Fremdsprache (L1)

Lernpaket für das bayerische Gymnasium, Jahrgangsstufe 7, Latein als **erste Fremdsprache (L1)** auf Grundlage des [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/latein/1-fremdsprache) (geprüft am 25. November 2026).

## Inhalt und Aufbau

- **8 Etappen, 36 Lektionen** zu allen Lernbereichen (Texte, Wortschatz, Formenlehre, Satzlehre, Kultureller Kontext, Methodik)
- **36 interaktive Inline-SVG-Schaubilder & Labore** (u. a. Konjunktiv-Baukasten, `consecutio temporum`-Zeitstrahl, Ablativus-absolutus-Klammer-Labor, schematische Mittelmeer-Karte, *cursus honorum* und Epochenstrahl)
- **108 Entdeckerziele** (3 pro Lektion), **72 Kurzaufgaben**, **72 Aufgaben auf zwei Stufen** (Level 1 Anwenden, Level 2 Transfer) mit Musterlösung und Selbsteinschätzung
- **108 verknüpfte ZAM-Karten** in [`cell.json`](cell.json) (`zam-academy:latein-gymnasium-7-l1`)

## Lokal entwickeln und prüfen

```bash
npm ci
npm run dev      # http://localhost:5285/latein-gymnasium-7-l1/
npx tsc --noEmit
npm test
npm run build        # Einzeldatei in dist/index.html
npm run package:zip  # Offline-Paket in release/
```

## Lehrplan- und Bestandsabgleich

Alle 50 Kompetenzerwartungen des Fachlehrplans sind in [`coverage.json`](coverage.json) wortgetreu gegen das gesicherte HTML geprüft (`node scripts/check-curriculum.mjs`). Die Abgrenzung zu Klasse 6 und Klasse 8 sowie der vollständige Bestandsabgleich der älteren `de-by`-Zellen in [`replaces-de-by.json`](replaces-de-by.json) (`proposal-only`, `approved: null`) sind in [`docs/latein-gymnasium-7-l1-coverage.md`](../docs/latein-gymnasium-7-l1-coverage.md) dokumentiert.
