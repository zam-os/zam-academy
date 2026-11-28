# Geographie 10 Gymnasium (Bayern)

Interaktives Lernpaket für **Geographie in der 10. Jahrgangsstufe am bayerischen Gymnasium (LehrplanPLUS, G9)** in ZAM Academy.

> **Hinweis zur Jahrgangsstufe 8:** Nach der bayerischen Stundentafel (`BayGSO Anlage 1`) und dem Fachprofil Geographie wird Geographie im G9 in den Jahrgangsstufen 5, 7, 10 und 11 unterrichtet (kein Pflichtunterricht in Jahrgangsstufe 6, 8 und 9). Ältere `de-by`-Zellen aus G8-Stufen 8 und 9 behandeln Themen, die heute in Jahrgangsstufe 10 liegen (`replaces-de-by.json`, Entwurf zur Prüfung durch Thomas).

## Inhalt und Aufbau

- **7 Lernbereiche · 30 Lektionen** entlang aller Kompetenzerwartungen des LehrplanPLUS Bayern (`coverage.json`: 35 Kompetenzreihen, 31 Inhaltsangaben)
- **10 interaktive Live-SVG-Labore** (`kartenebenen`, `klimadiagramm`, `hdi-rechner`, `passatzirkulation`, `naehrstoffkreislauf`, `treibhauseffekt`, `klimaszenarien`, `oasenwasser`, `sahel-desertifikation`, `hoehenstufen`) mit je drei erreichbaren Zielen
- **16 dreiteilige Entdeckerbilder** (klick- und tastaturbedienbare SVG-Gruppen) sowie **4 Natural-Earth-Vektorkarten** (Welt, MENA, Subsahara-Afrika, Lateinamerika)
- **30 Werkstätten** (Zeitleisten und Zuordnungen), **60 Schnellchecks** (Level 1 & Level 2) und **60 Schreibaufgaben** mit Selbsteinschätzung
- **60 ZAM-Karten** (`cell.json`, `zam-academy:geographie-gymnasium-10`, Version `2026.11.1`) mit direktem Rücksprung zur jeweiligen Lektion
- **Reine lokale Speicherung:** Lernstand und eigene Texte bleiben ausschließlich lokal im Browser (`localStorage`, Schlüssel `geo_gym10_academy_progress_v1`, Thema `geo_gym10_theme`); es gibt keine Drittanbieter-Anfragen.

## Befehle

```bash
npm ci
npx tsc --noEmit
npm test
npm run dev          # http://localhost:5299/geographie-gymnasium-10/
npm run build        # erzeugt dist/index.html als Einzeldatei
npm run package:zip  # erzeugt release/ZAM-Academy-Geographie-Gymnasium-10-offline.zip
```

Vor dem Öffnen einer PR außerdem im Paketordner prüfen:

```bash
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```
