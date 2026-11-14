# ZAM Academy — Englisch 5. Klasse Mittelschule

Eigenständige Offline-Web-App für Englisch in der **5. Klasse Mittelschule** nach dem bayerischen **LehrplanPLUS**.

## Aufbau des Pakets

- **6 Lernstufen, 36 Lektionen** (je 6 Lektionen pro Lernbereich/Stufe):
  1. `world` — Großbritannien und Weltsprache Englisch (UK/Irland-Karte, Klassensprache, Begrüßung, Wörterbuch-Fachbegriffe, Laute/IPA)
  2. `everyday` — Alltagsleben, Familie und Einkaufen (Hörnachricht Familie, Wohn-/Haustierszene mit Präpositionen, Tagesablauf & Mahlzeiten, Grundzahlen bis 100 mit interaktivem Zerleger, Einkauf mit `much/many/a lot of`, `some/any/no/this/that`)
  3. `school` — Schulleben und Lernstrategien (Britischer Schultag, Stundenplan & interaktive Uhr, Schulweg-Grafik, Steckbrief & Rechtschreibung, Wordwebs & Lernkarten, Suchendes Lesen)
  4. `leisure` — Freizeit, Hobbys, Feste und Schreiben (Hobbys & Gerund nach `like/dislike`, Wünsche & Konjunktionen `and/but/because`, britische Feste, Einladungen & Einkaufslisten, Sprachmittlung, Rätsel & Reime)
  5. `grammar1` — Sprachwerkstatt I: Nomen, Begleiter und Pronomen (`a/an/the` & regelmäßiger Plural, `men/women/children/food/fruit`, Subjektpronomen, Possessivbegleiter & `` `s ``-Genitiv, `to be`, `have got`)
  6. `grammar2` — Sprachwerkstatt II: Zeiten, Fragen und Satzbau (`simple present` Aussagen & `don't/doesn't/Do/Does`, W-Fragen `who/what/where/when/how/why`, Imperativ, `simple past` mit `was/were/-ed`, unregelmäßigen Verben, `did/didn't` und `SVO`)
- **108 Werkstatt-Ziele** (3 pro Lektion), **72 Schreib-/Sprechaufgaben** (Level 1 + Level 2) mit Selbstkontrolle und **108 ZAM-Lernkarten** (`cell.json`, 3 pro Atom).
- **Lehrplan-Abgrenzung zur 6. Klasse Mittelschule:** `present progressive`, `will-future`, `of-Genitiv`, Objektpronomen, Modalverben-Grammatik (`can/must`), Adjektivsteigerung und das Themenfeld `USA` sind ausdrücklich ausgeklammert und gehören erst zu Jahrgangsstufe 6.

## Entwicklung und Prüfung

```bash
npm ci
npx tsc --noEmit
npm test
npm run check:curriculum
npm run build
npm run package:zip
```
