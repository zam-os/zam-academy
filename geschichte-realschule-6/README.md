# Geschichte 6 · Realschule Bayern

Ein Paket der ZAM Academy nach dem
[Fachlehrplan Geschichte 6 Realschule](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geschichte),
geprüft am 18. November 2026. Ein gemeinsamer Lernpfad für alle
Wahlpflichtfächergruppen.

42 Lektionen führen von Methoden und der Steinzeit über Ägypten, Griechen und
Römer bis zu den Franken und Karl dem Großen; zwei Längsschnitte behandeln
Technik und Persönlichkeiten. Jede Lektion hat eine Erklärung mit Merksatz,
einen Schnellcheck mit erklärten Fehlantworten, eine Werkstatt (Zuordnen mit
farbigen Kategorien oder Zeitleiste) und zwei Schreibaufgaben: Level 1 mit
Leitfragen, Level 2 als Transfer. Eigene Texte werden nicht automatisch
bewertet; Lernende vergleichen sie mit einer möglichen Antwort und drei
Kriterien.

| Lernbereich | Lektionen | Inhalt |
| --- | ---: | --- |
| 1 · Geschichte erforschen | 6 | Quellen und Darstellungen, Zeitrechnung, Karten und Schaubilder, Archäologie am Beispiel Ötzi, Schulbuch und Film, historisches Erzählen |
| 2 · Steinzeit und Kelten | 4 | Zeit und Quellenarten, Altsteinzeit, Jungsteinzeit, Kelten in Süddeutschland |
| 3 · Ägypten | 4 | Nil, Pharao und Monarchie, Pyramiden mit Kriterienkatalog, Merkmale der Hochkultur |
| 4 · Griechen | 7 | Poleis, Kolonisation und Migration, Olympia und Theater, Tempel und Statuen, Verfassungen, Perserkriege, Perikles |
| 5 · Römer | 9 | Aufstieg, Republik, Caesar und Augustus, Großstadt Rom, Familie, Provinz Raetien und Limes, Juden, Christentum, Erbe Roms |
| 6 · Frühmittelalter | 5 | Ende Westroms, Wanderungen und Dreiteilung, Islam, Franken, Karl der Große |
| 7 · Technik im Wandel | 4 | Überlebenstechniken, Bewässerung in Ägypten, Bauen bei Griechen und Römern, Technik heute |
| 8 · Menschen machen Geschichte | 3 | Hatschepsut, Alexander der Große, Augustus und Karl |

Sichtbar gemacht wird die Zeit: Jede Lektion zeigt einen maßstabsgerechten
Zeitstreifen von 3000 v. Chr. bis 1000 n. Chr., der Lernpfad und das
Nachschlagen einen Geschichtsfries aller Lektionen mit den Grundlegenden
Daten, eine gelöste Zeitleisten-Werkstatt ihre Ereignisse auf der Leiste.
21 Lektionen zeichnen ein Schaubild (Gesellschaftspyramide, Kreislauf des
Nils, Querschnitt einer Römerstraße, Vergleiche damals und heute). Jeder
Lernbereich hat eine eigene Farbe.

## Umfang und Belege

[`coverage.json`](coverage.json) ordnet alle 44 Kompetenzerwartungen wortgleich
zu; `node scripts/check-curriculum.mjs` prüft sie gegen die gespeicherte
Lehrplanseite. Was im Unterricht stattfindet (Exkursionen, Rollenspiele,
Comics, Originalbilder und echte Karten, das eigene Schulbuch), bereitet die
App vor; Karten und Bilder sind in den Übungen beschrieben, nicht abgebildet.
Erklärungen und Übungssätze sind eigens verfasste Darstellungen. Zwei kurze
Originalquellen (Augustus, Res Gestae 34; Plinius, Briefe 10, 96) stehen in
einer für die App geschriebenen Übersetzung mit Link zum lateinischen Text.

Fortschritt, Farbschema und eigene Texte bleiben in diesem Browser
(`localStorage`). Keine Konten, kein Tracking, keine externen Schriften oder
Anfragen; Quellenlinks öffnen erst auf Klick.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5258/geschichte-realschule-6/
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///<zam-core>/dist/index.js node scripts/validate-migration.mjs
```

`npm run package:zip` erzeugt `release/ZAM-Academy-Geschichte-6-offline.zip`
mit einer HTML-Datei, die ohne Server und Internet läuft, und Startdateien für
Windows, macOS und Linux.

## ZAM-Zelle

`cell.json` ist die einzige Kartenliste: 42 Atome, eines pro Lektion, mit je
drei Karten (Schnellcheck, Merkkarte, Begründung). Jede Karte verweist auf
`https://academy.zam-os.org/geschichte-realschule-6/#lesson=<id>`. Lektions-,
Atom- und Kartenkennungen sind in `tests/fixtures/public-contract.json`
festgeschrieben.

Für die ältere Zelle `de-by:realschule-6-geschichte-urgeschichte-antike` (acht
Karten) gilt die von Thomas am 18.11.2026 freigegebene Zuordnung 4 A / 0 B / 4 C
in [`replaces-de-by.json`](replaces-de-by.json): Vier Lernhistorien gehen über
`replaces` auf ihre Nachfolger über, die vier C-Karten bleiben aktiv
(keine `retired_items`). `scripts/validate-migration.mjs` prüft das in
Wegwerf-Bibliotheken. Siehe
[Bestandsabgleich](../docs/geschichte-6-bestandsabgleich.md).
