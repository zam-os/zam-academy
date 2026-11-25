Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. Public domain.

`countries.json` is the copy used by `geographie-realschule-6`: Natural Earth
Admin 0 countries at 1:110 million, version 5.1.1
([original dataset](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_110m_admin_0_countries.geojson),
SHA-256 `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f`).
Only names, codes and geometry are retained. Boundaries follow the dated
small-scale dataset; very small states such as Singapore or the Maldives are
shown as points.

`src/figures/maps.ts` projects each region equirectangularly and shortens the
longitudes by the cosine of the central latitude. The maps are for orientation;
they are not suitable for measuring distances. Rivers, mountain lines, ocean
trenches, reefs, places and labels are approximate Academy overlays.

The epicentre of the Banda Sea earthquake of 21 November 2026 follows the
[GFZ GEOFON event page](https://geofon.gfz.de/eqinfo/event.php?id=gfz2026wusf)
(7.62° S, 127.39° E), retrieved on 25 November 2026.
