# Latein 6 (2. Fremdsprache) · Gymnasium Bayern

Ein Lernpaket der ZAM Academy für **Latein als zweite Fremdsprache** in Jahrgangsstufe 6 am bayerischen Gymnasium unter [https://academy.zam-os.org/latein-gymnasium-6-l2/](https://academy.zam-os.org/latein-gymnasium-6-l2/), erstellt nach dem [amtlichen LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/2-fremdsprache) (geprüft am 25. November 2026).

Das Paket umfasst 40 Lektionen in acht Etappen, 120 interaktive Werkstattziele mit Live-SVG-Schaubildern und Sprachlaboren, 80 Kurzaufgaben, 80 zweistufige Übersetzungs- und Transferaufgaben sowie 120 verknüpfte ZAM-Karten. `coverage.json` weist alle 57 Kompetenzerwartungen wortgetreu gegen die gespeicherte Lehrplanseite nach.

## Schwerpunkte & Visualisierungen

- **Salve! Lautung, Wortschatz & Brücken**: Pänultima-Betonungs-Explorer, Sachfelder & Wortfamilien, mehrdeutige Wörter, Wortbildungs-Baukasten, europäische Sprachbrücken und Abkürzungen.
- **Nomina, Kasus & Zahlen**: Interaktiver Deklinations-Baukasten (1.–3. Deklination inklusive i-Stämmen), KNG-Kongruenz, Pronomina (`suus`/`sē` vs. `eius`), Kardinalia/Ordinalia 1–12 mit römischem Zahlen-Schieber.
- **Verben & alle 6 Aktiv-Tempora**: Interaktiver Verb- und Tempus-Baukasten (Präsens, Imperfekt, 6 Perfektarten, Plusquamperfekt, Futur I/II) sowie Sonderverben (`esse`, `posse`, `velle`, `nōlle`, `mālle`, `īre`).
- **Satzbau, AcI & Methodik**: Satzglieder, Kasusfunktionen, Ablative, Adverbial- und Relativsätze, aktiver AcI (Gleich- und Vorzeitigkeit im interaktiven Zeitverhältnis-Labor), Konstruktionsmethode und Fehleranalyse.
- **Rom, Geschichte & Mythos**: Interaktive Topografie-Skizzen für Rom und Italien/Kampanien, Zeitleiste von Aeneas über 753/509 v. Chr. bis 79 n. Chr. (Pompeji, Plinius d. J.), frühe Republik, Alltag, Religion, interaktive Olympier-Tafel, Unterwelt, Trojanischer Krieg, Odysseus, Herakles und Aeneas.

## Nutzung & Offline-Paket

Öffne `dist/index.html` oder entpacke `release/ZAM-Academy-Latein-Gymnasium-6-L2-offline.zip` mit den Startskripten für Windows, macOS und Linux. Alle Lektionen laufen lokal ohne Server und ohne externe Netzanfragen; Fortschritte bleiben unter `latein_gym6_l2_academy_progress_v1` im Browser.

## Entwicklung und Prüfung

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

Für einen lokalen Entwicklungsserver nutzt `npm run dev` Port `5255`.

## Zelle & Abgrenzung zu Klasse 7

Alle 120 Lernkarten liegen ausschließlich in `cell.json`; die 160 ULIDs (40 Atome + 120 Items) sind in `tests/fixtures/public-contract.json` festgeschrieben. Passiv, Partizipien (PPA/PPP, PC, Ablativus absolutus), Konjunktiv sowie die 4./5. Deklination gehören in Latein 7 (L2) und bleiben hier außen vor.

Die Altbestand-Inventur in `replaces-de-by.json` liegt als `proposal-only` (`approved: null`) vor; `cell.json` enthält keine `replaces`- oder `retired_items`-Einträge. Siehe [Abdeckungs- und Bestandsdokumentation](../docs/latein-gymnasium-6-l2-coverage.md).
