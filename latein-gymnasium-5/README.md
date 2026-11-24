# Latein 5 (1. Fremdsprache) · Gymnasium Bayern

Ein ZAM-Academy-Lernpaket für Latein als 1. Fremdsprache in Jahrgangsstufe 5 am bayerischen Gymnasium, erstellt nach dem [offiziellen LehrplanPLUS-Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/latein/1-fremdsprache) (abgerufen und geprüft am 24. November 2026).

Das Paket umfasst 44 Lektionen in acht Lernbereichen, 44 interaktive dreiteilige Begriffsschaubilder (SVG), 132 Werkstattziele mit live aktualisierten SVG-Ansichten bzw. einer Topografie-Karte des antiken Roms, 88 Kurzaufgaben und 88 Übersetzungs-/Schreibaufgaben auf zwei Niveaus sowie 132 verknüpfte ZAM-Karten. Die Abdeckungsmatrix in `coverage.json` bildet alle 53 übergeordneten Kompetenzerwartungen (`L5-01`–`L5-53`) ab; die offizielle Lehrplanseite nennt keine Stundenangaben je Lernbereich.

| Lernbereich | Schwerpunkte & interaktive Werkstätten |
| --- | --- |
| Salve, Roma! Klang, Wortschatz und Europa | Aussprache und Paenultima-Regel (Silbenwaage + lokale Vorlesefunktion), Grundwortschatz, Wortarten und Wortfelder, Wortbildung, Sentenzen (S.P.Q.R.), Lehnwörter und romanische Sprachen |
| Nomina in Form: Deklinationen, Pronomina und Zahlen | a- und o-Deklination, 3. Deklination inkl. i-Stämme (Deklinations-Baukasten), u- und e-Deklination, Adjektive und KNG-Kongruenz, Personal-/Reflexiv-/Relativpronomina, Numeralia I–XII (Zifferntafel) |
| Verben in Aktion: Konjugationen und alle Aktiv-Tempora | Präsenskonjugationen und Imperativ I, esse/posse/velle/nōlle/mālle/nōlī, Imperfekt und Futur I, sechs Perfektbildungsarten, Plusquamperfekt und Futur II, Aspekt Hintergrund vs. Haupthandlung |
| Satzbau und Kasus: Vom Einzelwort zum ganzen Satz | Abfrageschema, Rektion und Wortstellung, Genitiv/Dativ/Akkusativ-Funktionen, Ablativ (īnstrūmentī, causae, sēparātiōnis, temporis), Satzarten und Nebensätze, aktiver AcI (Live-Zeitstufenschieber) |
| Urbs Roma: Topografie, Bauten und Caput Mundi | Sieben Hügel und Forum Romanum (interaktive SVG-Karte von Altrom und Ostia), Kolosseum und Circus, Thermen und Aquädukte, Caput Mundi und Kunst, Graecia capta |
| Alltag in Rom: Senat, Familie, Schule und Kalender | Senat und Werte (pietās, virtūs, fidēs), familia und tria nōmina, Sklaven und Gladiatoren, Schule und Kleidung, römischer Kalender (Monatsstreifen mit Kalenden, Nonen, Iden) |
| Götter, Helden und Roms Gründung | Religion und Auspizien (dō ut dēs), zwölf Olympier (Göttertafel), Unterwelt (Charon, Cerberus), Herkules und Aeneas, Romulus und die Könige bei Vergil & Livius (Zeitstrahl) |
| Texte knacken: Übersetzen, Prüfen und Klug Lernen | Vorerschließung, Fehlerprüfung am Übersetzungsentwurf, gegliederter Vortrag und Stellungnahme (Vorleseskript), Vokabelkartei und 5-Tage-Plan, Standbild und Stationenlernen |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4). Echte Partnergespräche, freie Vorträge im Klassenverband, aktuelle Sachrecherchen und Museumsbesuche bleiben als `supported` außerhalb der App; die App liefert Materialtexte, Sprachausgabe (sofern lokal vorhanden), Musterlösungen und Bewertungskriterien. Alle Quellenlinks wurden am 24. November 2026 live abgerufen und mit ihrem `<title>` in `source-checks.json` festgehalten.

## Nutzung

Öffne `dist/index.html` oder entpacke `release/ZAM-Academy-Latein-Gymnasium-5-offline.zip` und starte die HTML-Datei lokal im Browser. Alle Quellenlinks öffnen sich nur auf Klick.

Eine Lektion zählt als abgeschlossen nach ihren drei Werkstattzielen, dem Kurzcheck, beiden Kurzaufgaben und der Selbsteinschätzung auf Stufe 1 (bei den drei Vortragslektionen zusätzlich nach lokaler Sprachausgabe oder dem Haken für Partner-Vorlesen). Stufe 2 bietet weiterführende Transfer- und Übersetzungsaufgaben. Der Abschluss dokumentiert eigene Übung, keine Leistungsbewertung.

**Hinweis für Eltern und Lehrkräfte:** Antworten, eigene Entwürfe (z. B. Übersetzungen und Stellungnahmen) sowie Häkchen bleiben ausschließlich lokal in diesem Browser auf diesem Gerät (`localStorage`, Schlüssel `zam-academy:latein-gymnasium-5:v1`). Es findet keine Übertragung, Auswertung oder Synchronisation statt. Wenn mehrere Schülerinnen und Schüler dasselbe Benutzerkonto teilen, klicke am Ende auf „Lokalen Fortschritt zurücksetzen“ – dies löscht auch alle freien Texte. Eine kleine schaltbare Erklärung („Wo bleibt mein Text?“) steht direkt neben jedem Schreibfeld.

## Entwicklung und Prüfung

```sh
npm ci
npx tsc --noEmit
npm test
npm run build
npm run package:zip
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

`npm test` prüft vor Vitest automatisch die SHA-256-Prüfsummen aller drei LehrplanPLUS-Schnappschüsse sowie alle 53 Kompetenzzeilen in `coverage.json`. Als Referenz für `zam-core` dient Version `0.54.0` aus der Repository-CI. `npm run dev` läuft auf Port `5280`.

## Lehrplanabgrenzung und Alt-Kartenbestand

Dieses Paket deckt ausschließlich **Latein als 1. Fremdsprache (L1) in Jahrgangsstufe 5** ab. Inhalte der Jahrgangsstufe 6 – insbesondere Passiv, Konjunktiv Imperfekt und Plusquamperfekt, Partizipien (PPP/PPA) und Participium Coniunctum, `īre`, Demonstrativpronomina (`hic`, `ille`, `iste`, `idem`, `ipse`), Numeralia bis 1000, passiver AcI sowie Pompeji/Vesuv, Römische Republik/Hannibal, Ovid und Plinius – sind ausgeschlossen und werden durch die Testsuite überwacht.

Eine Bestandsprüfung in `zam-os/zam` (`67e190c2b7e5282851dfdd60ce21b69ed373dfa9`) ergab keine `de-by`-Zelle für Latein 5 oder 6. Die früheste existierende Lateinzelle ist die Nachbarzelle `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` (`J01`–`J04`). In `replaces-de-by.json` (`status: "proposal-only"`, `approved: null`) ist kein automatischer Verlaufstransfer hinterlegt; die Abgrenzungsfrage für die Nachbarzelle wird in [`docs/latein-gymnasium-5-coverage.md`](../docs/latein-gymnasium-5-coverage.md) festgehalten.
