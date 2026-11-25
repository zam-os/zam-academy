# Englisch 6 Realschule (LehrplanPLUS Bayern)

Offline-fähiges Lernpaket für **Englisch 6 Realschule Bayern** in der ZAM Academy.

## Umfang

- **8 Etappen, 42 Lektionen** zu allen Themengebieten und Kompetenzbereichen des gemeinsamen Fachlehrplans (`realschule/6/englisch`, alle Wahlpflichtfächergruppen):
  1. **First stops in the USA** (5 Lektionen): 50 Bundesstaaten, Metropolen, Wetter/Klima mit °F/°C-Umrechner, Jugendalltag Stadt/Land, Umweltbewusstsein, Bräuche.
  2. **London: Life in a metropolis** (3 Lektionen): Vielfalt, soziale/wirtschaftliche Lebensbedingungen, Wegbeschreibungen (`along`, `across`, `through`, `by`, `above`), Fahrkartenkauf.
  3. **Regions of Britain: Scotland & beyond** (3 Lektionen): Schottland (Highlands/Lowlands), Wales/Nordengland/Cornwall, schriftliche Sprachmittlung einer Reise-Webseite.
  4. **Music, sports, travel & charity** (4 Lektionen): Meinungen äußern, US-Sportarten (`soccer` vs. `football`), Verabredungen & Charity, mündliche Alltagssprachmittlung.
  5. **Media & digital communication** (3 Lektionen): Nutzung/Chancen/Risiken mit Beispielumfrage, Chats vs. höfliche E-Mails (`before`, `after`, `next`, `then`, `so`), gelenkte Online-Recherche.
  6. **Grammar I: Pronouns & comparisons** (4 Lektionen): `some`/`any`/`something`/`anybody`, `mine`/`yours`/`hers`/`ours`/`theirs`, Adjektivsteigerung inkl. `as … as`, `much`/`many`/`a lot of`/`lots of`.
  7. **Grammar II: Past, present perfect & future** (7 Lektionen): Simple Past (Wiederholung), Past Progressive mit Zeitstrahl, Simple vs. Progressive (Gegenwart & Vergangenheit), Present Perfect Simple (Form + frische Handlung/Gegenwartsergebnis), `will`-Future und `going-to`-Future (ohne Kontrast).
  8. **Words, texts & strategies** (13 Lektionen): Wortbildung (`un-`, `-ful`, `-less`, `-y`, `-ing`), Kollokationen/Phrasal Verbs, `verb + to-infinitive / -ing`, Classroom Phrases & Fachbegriffe, Lautung & schwache/starke Satzbetonung, Hörverstehen, Lesetechniken (`skimming`, `scanning`, `gist`, `detail`), Textsorten, Ganzschrift (extensives Lesen), Bildergeschichte & Schreiben, kreativer Vortrag & `short talk`, Wortfelder/Wortfamilien sowie eigene Interessensgebiete.
- **126 interaktive Entdeckerziele** (3 je Lektion), schematische Lernskizzen (USA, London, Großbritannien-Regionen, Stadtweg, Bildergeschichte, Beispielumfrage) und Explorer (Wetter °F/°C, Adjektivvergleich, Past-Zeitstrahl).
- **4 lokale Hör- und Ausspracheskripte** über optional verfügbare lokale Browserstimmen (`en-GB` / `en-US`) mit Partner-Vorlese-Nachweis als gleichwertiger Alternative.
- **126 ZAM-Wiederholungskarten** in `cell.json` (3 pro Lektion; 126 eigene ULIDs, `source_link` zu `#lesson=<id>`).

## Befehle im Paket

```bash
npm ci
npm run typecheck
npm test              # check-curriculum.mjs (42 verbatim Zeilen + 3 SHA-256) + vitest
npm run build         # Einzeldatei dist/index.html
npm run package:zip   # release/ZAM-Academy-Englisch-Realschule-6-offline.zip + verify-release
```

## Validierung mit zam-core und Chrome

```bash
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

Siehe auch [docs/englisch-realschule-6-coverage.md](../docs/englisch-realschule-6-coverage.md) für die vollständige Lehrplan- und Bestandsdokumentation.

The [approved mapping](replaces-de-by.json) transfers 5 matching review histories. The 11 keep-active cards retain their histories on their existing IDs.
