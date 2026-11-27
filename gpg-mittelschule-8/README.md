# Geschichte/Politik/Geographie 8 Mittelschule · ZAM Academy

Interaktive Lern-App für das Fach **Geschichte/Politik/Geographie (GPG)** in Jahrgangsstufe 8 an der bayerischen Mittelschule (**Regelklasse `R` und M-Zug `M`**) nach dem offiziellen LehrplanPLUS Bayern.

An der Mittelschule ist Politik und Gesellschaft gemeinsam mit Geschichte und Geographie im Fachverbund GPG verankert; im Atlas der ZAM Academy öffnen alle drei Pfade (`Geschichte`, `Politik und Gesellschaft`, `Geographie`) dieses Paket.

## Inhalt

- **32 Lektionen** in vier Lernbereichen (`31` für Regelklasse, `32` für M-Zug):
  1. **Lebensraum Erde** (7 Lektionen): Nordamerika (Topographie, Europa-Vergleich für den M-Zug, Klima & Naturgefahren), USA im Strukturvergleich, Jugendalltag Stadt vs. Land, fossile und erneuerbare Energien, europäisches Verbundnetz, privates Energiesparen.
  2. **Zeit und Wandel** (10 Lektionen): Weimarer Republik & Verfassung 1919, Weltwirtschaftskrise & Radikalisierung, Machtübertragung 1933, Zweiter Weltkrieg & Wendepunkte bis 8. Mai 1945, Verfolgung & Holocaust, Flucht & Vertreibung, Nachkriegsalltag, Nürnberger Prozesse, Kriegsfolgen bis heute.
  3. **Politik und Gesellschaft** (7 Lektionen): Grund- und Menschenrechte / Minderheitenschutz, NS-Propaganda vs. Pressefreiheit (Art. 5 GG), Widerstand im Nationalsozialismus, Zivilcourage heute, Potsdamer Konferenz & Besatzungszonen, Verfassungsorgane, Gesetzgebungsprozess (Legitimität, Effizienz, Allgemeinwohl).
  4. **Lebenswelt** (8 Lektionen): Politische Teilhabe (Wahlen, Parteien, Bürgerinitiativen), Wahlbeteiligung & Erstwählende, Sozialstaat & neue Armut, gemeinnützige Einrichtungen (Tafeln), Generationenvertrag & Demographie, Drei-Säulen-Altersvorsorge, ökologischer vs. konventioneller Landbau sowie Produktionskosten regionaler Bio-Erzeugung (nur M-Zug).
- **33 Inline-SVG-Schaubilder und Offline-Karten** (Natural Earth v5.1.1, projiziert in `src/data/maps.json`), überwiegend mit anklickbaren und per Tastatur bedienbaren Entdecker-Bereichen.
- **6 interaktive Rechen- und Ablauf-Labore** mit live aktualisierten maßstäblichen SVG-Grafiken (`energiemix`, `haushalt-energie`, `gesetzgebung`, `wahlbeteiligung`, `generationenvertrag`, `oekolandbau-kosten`).
- **Zwei Aufgabenstufen** je Lektion (`Level 1 · mit Leitfragen` und `Level 2 · Transfer`) mit Selbsteinschätzung und lokalem Speicher (`gpg_ms8_academy_progress_v1`).
- **64 verknüpfte ZAM-Karten** in [`cell.json`](cell.json) (2 Karten je Lektion, keine automatische Übertragung älterer Bestände in [`replaces-de-by.json`](replaces-de-by.json)).

## Skripte

```bash
npm ci
npx tsc --noEmit
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
```

Für den lokalen Entwicklungsserver: `npm run dev` (Standardport `5255`).
