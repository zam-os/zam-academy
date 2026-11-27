Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. Public domain.

Version 5.1.1 from https://github.com/nvkelso/natural-earth-vector (tag v5.1.1, folder `geojson/`), checked SHA-256:

| File | SHA-256 |
| --- | --- |
| ne_110m_admin_0_countries.geojson | 6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f |
| ne_50m_admin_0_countries.geojson | 3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb |
| ne_10m_admin_1_states_provinces.geojson | 22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5 |
| ne_10m_rivers_lake_centerlines.geojson | bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a |
| ne_10m_rivers_europe.geojson | 90712202ac46985812e90840df9acd5101599a9c649868d5bc55ee96c2fedd4c |
| ne_10m_lakes.geojson | 2d036f53dedec578001c5c30c2959ee7d4eebc1306900fa4367c49929ec8f2d9 |

`maps.json` is produced once by `scripts/build-map-data.mjs <folder>`: six equirectangular sections (world, Germany, Bavaria, Egypt, Mediterranean, southern Germany), Douglas–Peucker simplified to about 0.6 px, projected SVG paths only. Russia is split at 60° E so that the part east of the Urals is drawn as Asia, as German school atlases do, and French Guiana (part of France's shape) is drawn with South America.

Three layers are not Natural Earth data but simplified hand-drawn sketches defined in the script: the Roman Empire at its greatest extent around 117 AD (client kingdoms omitted), the line of the Upper Germanic-Raetian Limes from Rheinbrohl to Eining, and the course of the Lech (Füssen–Schongau–Landsberg–Augsburg–Danube), which Natural Earth does not contain. The app labels the Roman layers as simplified.

Small-scale borders do not imply legal recognition. The maps are for orientation, not for measuring distances. No online map service is used.
