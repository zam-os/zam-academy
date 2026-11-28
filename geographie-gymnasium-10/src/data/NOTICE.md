# Karten- und Bildnachweise

## Natural Earth Vektorkarten (`src/data/maps.json`)

Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. Public domain.

- Quelle: Version 5.1.1 aus [nvkelso/natural-earth-vector](https://github.com/nvkelso/natural-earth-vector) (Tag `v5.1.1`, Ordner `geojson/`)
- Geprüfte Datei: `ne_110m_admin_0_countries.geojson`
- SHA-256: `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f`

`src/data/maps.json` wird einmalig mit `node scripts/build-map-data.mjs <pfad-zur-geojson>` erzeugt und enthält vier fest eingebettete, equirektanguläre Ausschnitte (ohne externe Kartenanfragen):

1. `world` (`-180°` bis `180°`, `-58°` bis `80°`)
2. `mena` (`-18°` bis `66°`, `10°` bis `44°`) – Nordafrika, Naher und Mittlerer Osten
3. `africa` (`-20°` bis `54°`, `-36°` bis `24°`) – Afrika inkl. Sahara, Sahel und Subsahara-Afrika
4. `latam` (`-118°` bis `-32°`, `-56°` bis `33°`) – Mittel- und Südamerika, Karibik

Hinweis: Kleinteilige Grenzverläufe dienen der schulischen Raumorientierung und stellen keine völkerrechtliche Bewertung dar. Equirektanguläre Übersichten eignen sich für Lagen und Zonenmuster, nicht zum genauen Ausmessen von Flächen in hohen Breiten.

## Eigene Diagramme, Profile und Modelle

Alle Klimadiagramme, Kausalprofile, Höhenstufendiagramme, Stadtschnitte, Wasserbilanzen, Satellitenschemata und interaktiven Labor-Grafiken in `src/figures/` und `src/labs/` wurden als Inline-SVGs eigens für diese Lernumgebung erstellt und enthalten keine externen Ressourcen.
