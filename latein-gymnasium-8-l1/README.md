# Latein 8 Gymnasium · 1. Fremdsprache (L1)

Lernpaket für das bayerische Gymnasium, Jahrgangsstufe 8, Latein als **erste Fremdsprache (L1)** auf Grundlage des [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/1-fremdsprache) (geprüft am 27. November 2026).

## Inhalt und Aufbau

- **8 Etappen, 40 Lektionen** zu allen Lernbereichen (Texte, Wortschatz, Formenlehre, Satzlehre, Kultureller Kontext, Latein 7.5.3 – aktuell, digital, kreativ, Methodik)
- **40 interaktive Inline-SVG-Schaubilder & Labore** (u. a. Pänultima-Silbenwaage, Deponentien-/Semideponentien-/`fieri`-Baukasten, Gerundiv- und Dativus-auctoris-Labor, NcI-Umformer, Hauptsatz-/Relativsatz-Moduslabor, Kaiserzeit-/Christentum-/Europa-Zeitleiste, schematische Limes-Karte, Rechtswaage und Philosophie-Kompass)
- **120 Entdeckerziele** (3 pro Lektion), **80 Kurzaufgaben**, **80 Aufgaben auf zwei Stufen** (Level 1 Anwenden, Level 2 Transfer) mit Musterlösung und Selbsteinschätzung
- **120 verknüpfte ZAM-Karten** in [`cell.json`](cell.json) (`zam-academy:latein-gymnasium-8-l1`)

## Lokal entwickeln und prüfen

```bash
npm ci
npm run dev      # http://localhost:5295/latein-gymnasium-8-l1/
npx tsc --noEmit
npm test
npm run build        # Einzeldatei in dist/index.html
npm run package:zip  # Offline-Paket in release/
```

## Lehrplan- und Bestandsabgleich

Alle 57 Kompetenzerwartungen des Fachlehrplans sind in [`coverage.json`](coverage.json) wortgetreu gegen das gesicherte HTML geprüft (`node scripts/check-curriculum.mjs`). Die Abgrenzung zu Klasse 7 und Klasse 9 sowie der Bestandsabgleich der älteren `de-by`-Zellen in [`replaces-de-by.json`](replaces-de-by.json) (`status: "proposal-only"`, `approved: null`) sind in [`docs/latein-gymnasium-8-l1-coverage.md`](../docs/latein-gymnasium-8-l1-coverage.md) dokumentiert. Bis zur ausdrücklichen Freigabe durch Thomas bleibt `cell.json` ohne `replaces` und `retired_items`.
