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

`maps.json` is produced once by `scripts/build-map-data.mjs <folder>`: equirectangular sections (`world`, `northAmerica`, `northAmericaEurope`, `europe1942`, `germany1945`), Douglas–Peucker simplified to about 0.6 px, projected SVG paths only. Russia is split at 60° E so Siberia is not drawn in Europe; positive-longitude Aleutian islands and Hawaii are omitted on the continental North America section so paths do not wrap across the frame.

Simplified historical boundary overlays (frontlines/occupation areas in 1942 and the 1945 occupation zone dividers) are hand-drawn sketches defined in `scripts/build-map-data.mjs` and labelled as simplified in the app.

Small-scale borders do not imply legal recognition. The maps are for orientation, not for measuring distances. No online map service is used.
