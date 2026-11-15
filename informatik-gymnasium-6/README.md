# Informatik 6 Gymnasium · ZAM Academy

Eigenständige Lern-App für **Natur und Technik 6 – Schwerpunkt Informatik** am bayerischen Gymnasium ([LehrplanPLUS Bayern, `NT6 2`](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym)), gebündelt mit der ZAM-Wissenszelle `zam-academy:informatik-gymnasium-6`.

- **Online (nach Merge auf GitHub Pages):** `https://academy.zam-os.org/informatik-gymnasium-6/`
- **ZAM-Zelle:** [`cell.json`](cell.json) (`zam-academy:informatik-gymnasium-6`, 12 Atome, 36 Abrufkarten)
- **Offline-Paket:** `release/ZAM-Academy-Informatik-6-offline.zip` (einzelne selbsttragende HTML-Datei ohne Fremd-Requests)

## Lernbereiche und Aufbau

Die App deckt alle drei Teilbereiche des Schwerpunkts Informatik (`NT6 2`, ca. 28 Std.) für alle Ausbildungsrichtungen ab:

| Lernbereich | Stunden (ca.) | Etappe | Lektionen | Karten |
| --- | ---: | --- | ---: | ---: |
| `NT6 2.1` Informationsdarstellung mit Grafik-, Text- und Multimediadokumenten | 18 | 1 · Informationsdarstellung und Objekte | 7 | 21 |
| `NT6 2.2` Projekt: Multimediapräsentation | 5 | 2 · Projekt: Multimediapräsentation | 2 | 6 |
| `NT6 2.3` Hierarchische Informationsstrukturen – Dateisystem | 5 | 3 · Dateisystem als hierarchische Struktur | 3 | 9 |
| **Gesamt** | **28** | **3 Etappen** | **12** | **36** |

Jede der 12 Lektionen umfasst:

1. **Erklärung, Beispiel und Merksatz** in altersgerechter Schulsprache inklusive direktem Verweis auf das passende Thema und ein Kurz-Check-Quiz.
2. **Interaktives Labor oder Werkstatt** mit **genau drei Zielen** (zum Start unerfüllt): Punktnotations-Labor, Objekt-/Klassendiagramm-Umschalter, Vektor-/Pixelgrafik-Zoomlupe, Ebenen- und Gruppenwerkstatt, Absatz-/Zeichen-Inspektor, Präsentationsmodus- und Folien-Prüfer (mit ziehbaren Reglern), Urheberrechts-Fallwerkstatt, interaktives Baumdiagramm, Dateisystem-OOP-Ansicht und Pfad-Navigator.
3. **Zweistufige Übungsaufgaben** (`Stufe 1: Angeleitet` und `Stufe 2: Transfer`, jeweils 3 richtige Aufgaben für den Lektionsabschluss).
4. **Übersicht „Fachbegriffe“** über alle 12 Lektionen sowie lokale Fortschrittsspeicherung im Browser (`localStorage`-Schlüssel `informatik_gym6_academy_progress_v1` und `informatik_gym6_theme`).

## Abgrenzung zum Präsenzunterricht

Drei praktische Kompetenzerwartungen aus dem LehrplanPLUS sind in [`coverage.json`](coverage.json) als `"status": "supported"` eingestuft:

- `NT6 2.1.6` (*nutzen situationsgerecht Grafik-, Text- und Präsentationsprogramme …*)
- `NT6 2.2.1` (*erstellen unter Einhaltung der Qualitätskriterien eine adressatengerechte Multimediapräsentation …*)
- `NT6 2.3.4` (*nutzen ein Dateisystem zur zielgerichteten Speicherung und Wiederauffindung …*)

Die App trainiert die zugehörigen Fachbegriffe, Werkzeugeinstellungen, Gestaltungsregeln, Urheberrechts- und Pfadregeln interaktiv; das eigenständige Erstellen echter Dateien und Ordner auf Schulrechnern sowie freie Vorträge bleiben im Unterricht.

## Bestehende ZAM-Karten (`replaces-de-by.json`)

[`replaces-de-by.json`](replaces-de-by.json) enthält die von Thomas am 2026-11-15 freigegebene Zuordnung (`"status": "approved"`) zu den 8 Karten von `de-by:gymnasium-6-natur-technik-informatik-vektorgrafik-texte`: 2 Kategorie-A-Übernahmen und 6 aktiv bleibende Kategorie-C-Karten. Ab Zellversion 2026.11.2 tragen die beiden Nachfolger in [`cell.json`](cell.json) je ein `replaces`; `retired_items` gibt es nicht. Weitere Details und die Rückfrage zum unbelegten Alt-Paket `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` stehen in [`docs/informatik-gymnasium-6-coverage.md`](../docs/informatik-gymnasium-6-coverage.md).

## Entwicklung und Prüfung

```bash
npm ci
npm run dev                  # Entwicklungsserver auf http://localhost:5251/informatik-gymnasium-6/
npx tsc --noEmit
npm test
npm run build
npm run package:zip
node scripts/verify-release.mjs
node scripts/check-curriculum.mjs
ZAM_CORE=file:///<pfad-zu-zam-core>/dist/index.js node scripts/validate-migration.mjs
```
