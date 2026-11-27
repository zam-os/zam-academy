# Latein 7 (2. Fremdsprache, L2) · Gymnasium Bayern

Interaktives Trainingspaket für **Latein als 2. Fremdsprache (L2), Jahrgangsstufe 7** am bayerischen Gymnasium nach dem [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/latein/2-fremdsprache).

## Inhalt

- **40 Lektionen** in 8 Etappen (5 Lektionen je Etappe), die alle 51 Kompetenzerwartungen der Lernbereiche L7 1 bis L7 4 abdecken ([coverage.json](coverage.json)).
- **40 interaktive dreiteilige Entdeckerbilder (Inline-SVG)** — eine visuelle Strukturhilfe in jeder einzelnen Lektion, ohne externe Anfragen.
- **8 live aktualisierte interaktive SVG-Modelle**:
  1. Römischer Zahlen-Zerleger (1–1000) mit maßstäblichen Balken (`l7-interrogativa-zahlen`)
  2. Aktiv-Passiv-Umformer über alle 6 Tempora (`l7-passiv-praesens`)
  3. Zeitstrahl für AcI, Participium coniunctum und Ablativus absolutus (`l7-aci-passiv`, `l7-pc-adverbiale`)
  4. Consecutio-temporum- und Konjunktiv-Matrix (`l7-indirekte-fragen`)
  5. Pänultima-Silbenwaage für Quantitäten und Betonung (`l7-aussprache-betonung`)
  6. Offline-Karte des Imperium Romanum und Mittelmeerraums mit 3 Ebenen inkl. Cambodunum und 7 Weltwundern (`l7-mittelmeerraum`)
  7. Epochen-Zeitleiste vom 2. Punischen Krieg bis Augustus (`l7-rom-karthago`)
  8. Cursus-honorum-Stufenpyramide und Mischverfassung (`l7-politik-gesellschaft`)
- **120 Entdeckerziele** (3 je Lektion), 40 Schnellchecks, 80 Kurzaufgaben (makron-tolerant) und 80 zweistufige Aufgaben (Level 1 Anwenden / Level 2 Transfer) mit Selbsteinschätzung.
- **Kurzgrammatik & Formenübersicht** unter „Nachschlagen“.
- **120 verknüpfte ZAM-Karten** in [cell.json](cell.json) (`zam-academy:latein-gymnasium-7-l2`, 3 Karten je Lektion).

## Grenzen und Ergänzung im Unterricht

Lautes, quantitätsgerechtes Vortragen, Partner- und Gruppenarbeit, eigene Recherchen, Museumsbesuche (z. B. Archäologischer Park Cambodunum, Münchner Antikenmuseen) sowie Rückmeldungen der Lehrkraft ergänzen die App und sind in [coverage.json](coverage.json) als `supported` ausgewiesen. Lehrkraftprüfung und geprüfte Erklärvideos stehen noch aus (Version `0.0`).

## Entwicklung & Prüfung

```bash
npm ci
npm run dev          # http://localhost:5289/latein-gymnasium-7-l2/
npm test             # Lehrplan-Verbatim-Check + Vitest-Suite
npm run build        # Einzeldatei in dist/index.html
npm run package:zip  # Offline-ZIP in release/ + Integritätsprüfung
```

Vollständige Dokumentation zu Lehrplanabgleich und Bestandsprüfung: [docs/latein-gymnasium-7-l2-coverage.md](../docs/latein-gymnasium-7-l2-coverage.md).
