# Englisch 7 Realschule (LehrplanPLUS Bayern)

Offline-fähiges Lernpaket für **Englisch 7 Realschule Bayern** in der ZAM Academy. Paketversion `0.0`: Die Durchsicht durch eine Lehrkraft der Jahrgangsstufe steht noch aus.

## Umfang

- **9 Etappen, 45 Lektionen** zu allen Themengebieten und Kompetenzbereichen des gemeinsamen Fachlehrplans (`realschule/7/englisch`, alle Wahlpflichtfächergruppen):
  1. **Highlights of British & Irish history** (5 Lektionen): Kelten, Römer und Hadrianswall, Angelsachsen und Wikinger, Normannen 1066, Große Hungersnot und irische Auswanderung in die USA.
  2. **Ireland: Part of Europe** (6 Lektionen): Republik Irland und Nordirland, Sprache, Gaelic games und Musik, Wirtschaft in der EU, Politik und Good Friday Agreement, Touristeninformation in Dublin mit detaillierten Wegbeschreibungen, schriftliche Sprachmittlung einer Broschüre.
  3. **Youth culture** (4 Lektionen): Musik, Film und Theater mit Gefühlen und Meinungen, Sport und Mode, Interview hören, short talk mit Stichwortkarte.
  4. **School life** (2 Lektionen): state, private, „public“ und boarding schools in England und den USA, Vielfalt im Klassenzimmer.
  5. **Life in the USA** (4 Lektionen): Familie und Zuhause, Feste und Esskultur, Einkaufen mit sales tax, Unterhaltungsindustrie und Sport.
  6. **Teen literature** (3 Lektionen): Treasure Island, Sherlock Holmes (mit Past Perfect), Roald Dahl und J. K. Rowling mit Hörbuch, Graphic Novel, Film und Tagebucheintrag.
  7. **Grammar I: Describing more exactly** (5 Lektionen): defining relative clauses (who, which, that, whose, where), contact clauses, adverbs of manner, question tags mit Intonation.
  8. **Grammar II: Time, duty & conditions** (7 Lektionen): Simple Past vs. Present Perfect, Present Perfect Progressive mit since/for, Past Perfect, must/have to/mustn't/needn't, ought to/might, if-clauses Typ 0/1 und Typ 2.
  9. **Words, sounds & strategies** (9 Lektionen): Umschreiben und propword one, Verben mit zwei Objekten, Kollokationen und Wendungen, phrasal verbs und Verb + to-infinitive/-ing, Wortbildung, Wörterbuch und Fachbegriffe, stumme Buchstaben und Intonation, Briefe, E-Mails und Formulare, Fehlerprotokoll und Wortfelder, mündliche Sprachmittlung.
- **135 Entdeckerziele** (3 je Lektion) mit Lernskizzen und Explorern: Zeitstrahl Kelten bis Normannen, Karte Römisches Britannien, Auswanderungsrouten, Irland-Karte, Dublin-Wegeskizze, since/for- und Past-Perfect-Zeitstrahl, if-Regler, sales-tax-Rechner, erfundene Beispielgrafiken, Schulvergleich, Intonationspfeile, Brief-Aufbau und Wortfamilie.
- **4 lokale Hörskripte** (Touristeninformation, Interview, Hörspiel, Gedicht) über eine bereits installierte englische Browserstimme oder einen Partner, der vorliest.
- **135 ZAM-Wiederholungskarten** in `cell.json` (3 pro Lektion, eigene ULIDs, `source_link` zu `#lesson=<id>`).

Eigene Texte und Notizen bleiben im `localStorage` dieses Browsers (`englisch_real7_academy_progress_v1`), das Farbschema unter `englisch_real7_theme`. Die App liest, bewertet und sendet diese Texte nicht. Der Browser trennt den Speicher nach Benutzerkonto, Browser und Profil; neben jedem Textfeld erklärt das ein kleines „ⓘ Wo bleibt mein Text?“. Hinweis für Eltern und Lehrkräfte: Teilen sich mehrere Kinder ein Benutzerkonto, sollte am Ende „Lokalen Fortschritt zurücksetzen“ gewählt werden; das löscht Fortschritt und Texte (AGENTS.md, Regel 7).

## Befehle im Paket

```bash
npm ci
npm run typecheck
npm test              # check-curriculum.mjs (63 wörtliche Zeilen + 3 SHA-256) + vitest
npm run build         # Einzeldatei dist/index.html
npm run package:zip   # release/ZAM-Academy-Englisch-Realschule-7-offline.zip + verify-release
```

## Validierung mit zam-core und Chrome

```bash
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
node scripts/verify-browser.mjs
```

Siehe [docs/englisch-realschule-7-coverage.md](../docs/englisch-realschule-7-coverage.md) für Lehrplanabgleich, Abgrenzung zu Klasse 6 und 8 und den Kartenbestand.

Den [Bestandsabgleich](replaces-de-by.json) hat Thomas am 21.11.2026 freigegeben („Approve both“): Zwei alte Karten (`…E7T…J01`, `…E6G…J05`) übertragen ihre Lernhistorie auf `e7-past-vs-perfect-check` und `e7-must-have-to-check`, die übrigen 14 bleiben aktiv. `scripts/validate-migration.mjs` prüft die Übertragung.
