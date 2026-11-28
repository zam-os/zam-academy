# Wirtschaft und Recht 8 Gymnasium: Lehrplanabgleich und Bestandsabgleich

## 1. Lehrplan

- **Quelle:** [LehrplanPLUS Gymnasium, Wirtschaft und Recht 8 (WWG)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/wirtschaft-und-recht), live abgerufen am 2026-11-28 mit `curl -sL --compressed -A "Mozilla/5.0" <url>` (Status 200).
- **SHA-256 der abgerufenen Seite:** `6050359549218ebd0480cf096a1206bba9deb52b49e1005895241a2ad96996d0` (`curriculum_sha256` in [`coverage.json`](../wirtschaft-recht-gymnasium-8/coverage.json)).
- **Ausbildungsrichtung:** Der Fachlehrplan heißt „Wirtschaft und Recht 8 (WWG)“. Wirtschaft und Recht wird in Jahrgangsstufe 8 nur am Wirtschaftswissenschaftlichen Gymnasium unterrichtet; `academy.json` führt Wirtschaft 7 am Gymnasium bereits als `kein_unterricht`. Alle Lektionen tragen deshalb `tracks: ["WWG"]`, alle Atome binden `track: "WWG"`.
- **Wortlautprüfung:** Ein Skript entfernt `<script>`/`<style>`, setzt Blockelemente als Zeilenumbruch, lässt Inline-Tags (Glossarlinks) weg, normalisiert Leerraum und sucht jede `competence` und jeden `content` aus `coverage.json` im Seitentext. Ergebnis: **23 Kompetenzzeilen, 0 nicht gefunden; 49 Inhaltszeilen, 0 nicht gefunden.** (Werden Inline-Tags stattdessen durch Leerzeichen ersetzt, „fehlen“ zwei Zeilen nur wegen eines Glossarlinks vor dem Satzpunkt.)

| Lernbereich | Stunden | Kompetenzerwartungen | Lektionen |
| --- | ---: | ---: | --- |
| 1.1 Entscheidungen beim Konsum | 16 | 2 | `ko-knappheit`, `ko-opportunitaetskosten`, `ko-nachhaltigkeit`, `ko-information`, `ko-entscheidungsmatrix`, `ko-werbung`, `ko-verhaltensoekonomie` |
| 1.2 Entscheidungen beim Umgang mit Geld | 12 | 4 | `ge-geldfunktionen`, `ge-geldwert`, `ge-zahlungsarten`, `ge-digital`, `ge-haushaltsplan`, `ge-ueberschuldung` |
| 2.1 Betriebliche Abläufe und Arbeitsteilung | 18 | 4 | `un-arbeitsteilung`, `un-arbeitsteilung-folgen`, `un-aufbau`, `un-ablauf`, `un-fertigungstypen`, `un-fertigungsverfahren` |
| 2.2 Marketingentscheidungen | 20 | 4 | `ma-praesentation`, `ma-marketing`, `ma-marktanalyse`, `ma-produkt`, `ma-portfolio`, `ma-preis`, `ma-distribution`, `ma-kommunikation`, `ma-konzept` |
| 3 Rechtlich verantwortliches Handeln | 18 | 5 | `re-funktionen`, `re-zivil-straf`, `re-normen`, `re-unerlaubte-handlung`, `re-straftat`, `re-internet`, `re-urheberrecht` |
| 4.1–4.4 Profilbereich am WWG (Auswahl der Klasse) | – | 4 | `pr-zeitmanagement`, `pr-grafiken`, `pr-geldgeschichte`, `pr-kredit`, `pr-fertigungsverfahren`, `pr-marketingformen`, `pr-jugendschutz`, `pr-gericht`, `pr-jugendarbeit`, `pr-projekt` |

Der Profilbereich nennt keine Stunden; die Klasse wählt daraus aus. Seine zehn Lektionen sind standardmäßig sichtbar, zählen aber nicht zu den 35 Kernlektionen (`optional_lessons`, `optional_rows`). Ihre Atome binden `topic_code: "lb4"` mit `exam_relevant: false`.

**Was die App nicht leistet (`status: "supported"`):** Die Arbeit in einem echten Tabellenkalkulationsprogramm (1.2, die App zeigt eine modellierte Tabelle mit Formeln), die Betriebserkundung (2.1, die App liefert Beobachtungsfragen), der Besuch einer Gerichtsverhandlung (4.3) und das Projekt selbst (4.4). Die Rechtsfälle sind realistische, eigens verfasste Lernbeispiele; authentische Fälle ergänzt der Unterricht.

## 2. Nachbarjahrgänge

- **Davor:** Am Gymnasium gibt es vor Jahrgangsstufe 8 kein Fach Wirtschaft und Recht. Die Lektionen setzen deshalb nichts voraus und verweisen innerhalb des Pakets zurück (etwa Opportunitätskosten der Zeit im Zeitmanagement).
- **Danach:** Der [Fachlehrplan WR 9](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/wirtschaft-und-recht) (am selben Tag abgerufen) lehrt in LB 1 „Recht als Handlungsrahmen“ die Stufen der Geschäftsfähigkeit, die Handlungsmöglichkeiten des beschränkt Geschäftsfähigen und den Kaufvertrag, in LB 2 Geschäftsmodell und Jahresabschluss. Diese Themen bleiben hier bewusst draußen; das Paket lehrt Deliktsfähigkeit und Strafmündigkeit, nicht Geschäftsfähigkeit.
- **Realschule:** `wirtschaft-recht-realschule-8` (Zweig II) folgt einem anderen Fachlehrplan und hat seinen eigenen, genehmigten Bestandsabgleich. Beide Pakete teilen sich keine Karten.

## 3. Rechtsquellen

Alle Paragrafen, die Lektionen, Labore und Karten nennen, wurden am 2026-11-28 auf gesetze-im-internet.de gelesen, darunter § 823, § 828, § 832 BGB; § 19, § 185, § 186, § 242, § 303 StGB; § 1, § 3, § 5, § 9, § 13, § 16, § 18, § 48, § 105 JGG; § 5, § 9, § 10, § 11 JuSchG; § 2, § 5, § 8, § 11, § 14, § 15, § 19 JArbSchG; § 2, § 15, § 51, § 53, § 60a, § 64, § 97 UrhG; § 22, § 23, § 33 KunstUrhG; § 278 ZPO; § 23 GVG (Amtsgericht bis 10.000 €). Jeder gezeigte Quellenlink wurde einmal abgerufen und sein Seitentitel gelesen (die Bundesbank-Seiten lieferten beim Abruf mit Browser-User-Agent ihre Titel, etwa „Geldpolitik | Deutsche Bundesbank“). Nach dem Review ergänzt: § 2 KindArbSchV (Liste der leichten Tätigkeiten für Kinder ab 13 und vollzeitschulpflichtige Jugendliche).

## 4. Bestandsabgleich: `replaces-de-by.json`

- **Geprüftes Repository:** `zam-os/zam`, Commit `c92f4e383385ee487cd8b30f73b3bf3cb27b0860`.
- **Einzige betroffene Zelle:** `de-by:gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz` (Version 2026.08.1, 4 Karten, in `src/kernel/library/bundled-cells.ts` gebündelt). Byte-genauer Snapshot: [`tests/fixtures/de-by-gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz-kvt.json`](../wirtschaft-recht-gymnasium-8/tests/fixtures/de-by-gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz-kvt.json), SHA-256 `fd5ff0b3a092c8c1c68b8ae0e7e43d00759101672147e9b798dfb0c3854e6f5d`.
- Kein anderes Academy-Paket mappt diese Zelle (`politik-gymnasium-8` und `wirtschaft-mittelschule-7` erwähnen sie nur als unberührt).

| Alte Karte | Inhalt | Kategorie | Vorschlag |
| --- | --- | --- | --- |
| `…J01` | Nachfrageüberhang lässt den Preis steigen | C | `keep-active`: Marktmechanismus ist weder in WR 8 (WWG) noch in WR 9 Kompetenz |
| `…J02` | Wirtschaftskreislauf, Marktmodell, Preisfunktionen (Synthese) | C | `keep-active`: mehrteilig, Themen außerhalb von WR 8 |
| `…J03` | Kaufvertrag eines beschränkt Geschäftsfähigen ist schwebend unwirksam | C | `keep-active`: Geschäftsfähigkeit gehört zu WR 9 LB 1 |
| `…J04` | Geld, Inflation, Geschäftsfähigkeit, Kaufvertrag, Verbraucherrechte (Synthese) | C | `propose-retire-after-approval`: mischt WR 8 und WR 9, die Geldteile verteilen sich auf zwei neue Atome; die Musterlösung behauptet, § 110 BGB gelte nur bei Barzahlung |

**Zusammenfassung zur Genehmigung:** 0 A, 0 B, 4 C (3 `keep-active`, 1 Stilllegung vorgeschlagen). Bis Thomas entscheidet, gilt `"status": "proposal-only"`, `"approved": null`, und `cell.json` deklariert weder `replaces` noch `retired_items`. Weil keine Karte ersetzt wird, braucht das Paket kein `validate-migration.mjs`; ein Lernender mit Karten aus beiden Zellen bekommt keinen Konflikt.

**Offene Fragen an Thomas:**

1. Soll `…J04` stillgelegt werden (Fehler zu § 110 BGB, Inhalte verteilt) oder aktiv bleiben?
2. Sollen `…J01`–`…J03` aktiv bleiben, bis ein späteres Paket (WR 9 für die Geschäftsfähigkeit, ein höherer Jahrgang für den Marktmechanismus) sie übernimmt?

## 5. Prüfungen

- Im Paket: `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`.
- Zelle: `ZAM_CORE=<zam-core 0.54.0> node scripts/validate-cells.mjs` installiert die Zelle (45 Atome, 109 Karten) und prüft die kuratierten Distraktoren.
- Browser: Headless Chrome hat jede Lektion auf beiden Niveaus gerendert (90 Seiten, Lektionstitel, Niveau, Abschnitte und Labore vorhanden, kein `NaN`/`undefined`); Lernlandkarte und Labore wurden in hellem und dunklem Schema angesehen.
