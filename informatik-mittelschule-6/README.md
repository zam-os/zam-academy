# Informatik 6 Mittelschule · ZAM Academy

Interaktives Lernpaket für das Fach **Informatik in Jahrgangsstufe 6** an der bayerischen Mittelschule (**LehrplanPLUS Bayern**, Lernbereiche 1 und 2, gemeinsamer Fachlehrplan für alle 6. Klassen).

## Inhalt und Aufbau

- **Etappe 1 · Digitaler Informationsaustausch (Inf6 LB 1):** 6 Lektionen
  1. Verfeinerte Suchstrategien (`ms6-suchstrategien`)
  2. Informationen kritisch prüfen und Medienwirkung einschätzen (`ms6-informationsqualitaet`)
  3. Urheberrecht und Lizenzmodelle (Creative Commons) (`ms6-urheberrecht-lizenzen`)
  4. Personenbezogene Daten erkennen und schützen (`ms6-personenbezogene-daten`)
  5. Sichere Passwörter und Schutz vor Schadsoftware (`ms6-passwoerter-virenschutz`)
  6. Datenverlust vermeiden: Bedeutung von Datensicherung (`ms6-datensicherung`)
- **Etappe 2 · Programmieren (Inf6 LB 2):** 6 Lektionen
  7. Abläufe zerlegen: Anweisung, Sequenz und Struktogramm (`ms6-ablaeufe-sequenz`)
  8. Bedingungen formulieren und prüfen (`ms6-bedingungen`)
  9. Verzweigung (Alternative): wenn–dann und wenn–dann–sonst (`ms6-alternative`)
  10. Bedingte Wiederholung (solange …) und Endlosschleifen (`ms6-bedingte-wiederholung`)
  11. Grundstrukturen schachteln (`ms6-schachtelung`)
  12. Programme in Entwicklungsumgebungen testen und optimieren (`ms6-testen-optimieren`)

Jede Lektion bietet eine verständliche Erklärung mit Beispiel und Merksatz, einen Schnellcheck, eine interaktive Werkstatt (u. a. Such-Filter, Quellen-Prüfer, CC-Lizenzprüfer, Passwort- und Datensicherungs-Labor sowie Figurenfelder mit synchronen Nassi-Shneiderman-Struktogrammen), zweistufige Aufgaben (Level 1 geführt, Level 2 Transfer) sowie drei verknüpfte ZAM-Abrufkarten in [`cell.json`](cell.json) (insgesamt **36 Karten**).

## Entwicklung und Prüfung

```bash
npm ci
npm run dev          # http://localhost:5264/informatik-mittelschule-6/
npx tsc --noEmit
npm test
npm run build        # Einzeldatei-Build in dist/index.html
npm run package:zip  # Offline-Paket in release/ZAM-Academy-Informatik-6-Mittelschule-offline.zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

## Datenschutz und Offline-Einsatz

Keine Konten, keine Cookies, kein Tracking, keine externen Anfragen. Der Lernstand bleibt lokal in `localStorage` unter `informatik_ms6_academy_progress_v1`. Die gebaute App läuft auch vollständig offline aus der Einzeldatei oder dem Release-ZIP.
