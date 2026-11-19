# ZAM Academy — Englisch 6. Klasse Mittelschule

Eigenständige Offline-Web-App für Englisch in der **6. Klasse Mittelschule** nach dem bayerischen **LehrplanPLUS**.

## Aufbau des Pakets

- **6 Lernstufen, 36 Lektionen** (je 6 Lektionen pro Lernbereich/Stufe):
  1. `uk-usa` — UK, USA und Begegnungen (UK-Länder & wichtige Städte, 50 US-Staaten & Hauptstadt Washington, D.C., Jugendherberge, Souvenirladen & Zeitungskiosk, Wegerklärungen im Stadtplan, verbundene Aussprache & IPA)
  2. `everyday` — Alltagsleben, Zimmer und Heimatort (Alltagsroutinen & Alltagsprobleme, Wohnung & Zimmer mit gezeichneter Raum-Szene, Kleidung & Befinden, Heimatort & Wetter/Klima, Verlustanzeigen & Schilder, amerikanischer Anrufbeantworter)
  3. `school` — Schulleben, Klassenfahrt und Methoden (Arbeitsgemeinschaften mit Grafik, Klassenfahrt & Schullandheim, Schulfest mit *note-making*, Wörterbuch & Grammatikhilfen *tense/present progressive/will-future*, Cluster & Internationalismen, Lernstrategien & Analogien)
  4. `leisure` — Freizeit, Reisen, Medien und Texte (Sportveranstaltungen mit Grafik & Hörtext, Lesen/Fernsehen/digitale Kommunikation, Ferien & Reisen, Feiertage in UK & USA, Sprachmittlung Freizeitprogramm, kreative Gedichte & Steckbriefe)
  5. `words-structures` — Sprachwerkstatt I: Zahlen, Pronomen und Wortschatz (Grundzahlen bis 1000 mit interaktivem Zerleger, Ordnungszahlen bis 31 & Daten mit Explorer, *feet/teeth/clothes*, Mengenbezeichnungen *cup/box of* & *of*-Genitiv, Objektpronomen, Indefinitpronomen & *these/those*, *phrasal verbs*/Kollokationen/*Gerund*, Präpositionen & Konjunktionen)
  6. `tenses-syntax` — Sprachwerkstatt II: Steigerung, Modalverben, Zeiten und Satzbau (germanische Steigerung mit *-er*/*the ...-est* plus *good/bad* im Balken-Explorer, Modalverben *can/can't/must/have (got) to*, *present tense progressive*, *simple present* vs. *present progressive*, *will-future*, Adverbien & *SVO* mit Ort vor Zeit)
- **108 Werkstatt-Ziele** (3 pro Lektion), **72 Schreib-/Sprechaufgaben** (Level 1 + Level 2) mit Selbstkontrolle und **108 ZAM-Lernkarten** (`cell.json`, 3 pro Atom).
- **Lehrplan-Abgrenzung:** Baut auf Klasse 5 auf (UK, 0–100, `` `s ``-Genitiv, *simple present*, *simple past*) und grenzt Inhalte der **7. Klasse Mittelschule** (*present perfect simple*, *going-to-future*, *past progressive*, romanische Steigerung mit *more/most*, *should/shouldn't*, Reflexiv-/Possessiv-/Relativpronomen, *much/many*-Kontrast) ausdrücklich aus.

## Entwicklung und Prüfung

```bash
npm ci
npx tsc --noEmit
npm test
npm run check:curriculum
npm run build
npm run package:zip
```
