# Geographie 10 Gymnasium: Lehrplanabgleich, Quellen und Kartenabgleich

Paket: `geographie-gymnasium-10/` · 30 Lektionen · 10 Live-SVG-Labore · 16 dreiteilige Entdeckerbilder · 60 ZAM-Karten (`version: "0.0"`).

## G9-Stundentafel (`kein_unterricht` für Geographie 6, 8 und 9)

Nach der bayerischen Stundentafel (`BayGSO Anlage 1`, https://www.gesetze-bayern.de/Content/Document/BayGSO-ANL_1) und dem Fachprofil Geographie im LehrplanPLUS wird Geographie am neunjährigen bayerischen Gymnasium (G9) in den Jahrgangsstufen **5, 7, 10 und 11** (sowie in der Qualifikationsphase 12/13) als reguläres Pflichtfach unterrichtet. In den Jahrgangsstufen **6, 8 und 9** findet kein regulärer Pflichtunterricht in Geographie statt (`lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/geographie` leitet auf die Startseite weiter). Deshalb trägt `academy.json` für Geographie Gymnasium in Klassenstufe 6, 8 und 9 ausdrückliche `kein_unterricht`-Einträge (geprüft durch `scripts/academy-registry.test.mjs`), während die nächste reguläre Lehrplanstufe das Paket `geographie-gymnasium-10/` ist.

## Offizieller LehrplanPLUS (Geographie 10 Gymnasium)

Der Live-[Fachlehrplan Geographie 10 (Gymnasium)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/geographie) wurde am 28. November 2026 mit einem Browser-User-Agent direkt abgerufen (HTTP 200) und unverändert unter `geographie-gymnasium-10/tests/fixtures/curriculum.html` abgelegt (SHA-256 `30aa7ace37e61d915895c6a0ede755dd8c8ccb384dfacce6e3d8f04e5d24768d`). Der Lehrplan gilt gemeinsam für alle Ausbildungsrichtungen am bayerischen Gymnasium (kein Zweig-Filter).

| Lernbereich | Stundenansatz laut Lehrplan | Kompetenzerwartungen | Lektionen |
| --- | --- | ---: | ---: |
| 1 Geographische Arbeitstechniken | fortlaufend (im Kontext von LB 2–7) | 8 | 4 (+ Verknüpfungen in LB 2–7) |
| 2 Leben in der Einen Welt | ca. 6 Std. | 4 | 4 |
| 3 Klima- und Vegetationszonen der Tropen und ariden Subtropen | ca. 8 Std. | 4 | 5 |
| 4 Klima im Wandel | ca. 9 Std. | 3 | 4 |
| 5 Traditionsreicher Kulturraum im Spannungsfeld aktueller Geopolitik – Nordafrika, Naher und Mittlerer Osten | ca. 10 Std. | 4 | 5 |
| 6 Entwicklungsperspektiven in tropischen Räumen – Afrika südlich der Sahara | ca. 12 Std. | 5 | 4 |
| 7 Herausforderungen der Entwicklung in tropischen Räumen – Mittel- und Südamerika, Karibik | ca. 11 Std. | 7 | 4 |

`node geographie-gymnasium-10/scripts/check-curriculum.mjs` prüft alle Kompetenzerwartungen und sämtliche Einträge unter „Inhalte zu den Kompetenzen“ gegen den gespeicherten Quelltext: **35 wörtliche Kompetenzreihen, 0 nicht gefunden; 31 Inhaltspunkte, 0 nicht gefunden; SHA-256 stimmt überein.**

Sechs Kompetenzreihen tragen den Status `supported` (statt `implemented`), weil ihr voller Kompetenzaufbau eigene praktische Schülerhandlungen voraussetzt, die im Unterricht ergänzend stattfinden:

- `1.4`: Blockbilder auswerten und eigene komplexere Diagramme zeichnen – in der App anhand vorgegebener Schema- und Vergleichsdiagramme geübt (`blockbilder-und-kausalprofile`, `indikatoren-kritisch-pruefen`, `klimaszenarien-und-globale-folgen`); eigenes Zeichnen auf Papier bleibt im Unterricht.
- `1.5`: Übersichtliche Kausalprofile selbst anfertigen – in der App als geführte Profilanalyse und Werkstatt angelegt.
- `1.6`: Hypothesen anhand eigener klima- oder bodenkundlicher Experimente prüfen – durch Simulationen (`treibhauseffekt`, `sahel-desertifikation`) vorbereitet; reale Versuche verbleiben im Fachraum.
- `1.8`: Informationen aus selbstständiger Internet- und Medienrecherche auswerten – verlinkte offizielle Primärangebote unterstützen die unterrichtliche Recherche.
- `5.2`: Raumwirksamkeit aktueller Konflikte im Raum MENA an einem tagesaktuellen Beispiel erörtern – strukturelle Analyse anhand von Quellen und Karten, tagesaktuelle Berichterstattung bleibt im Unterricht.
- `7.5`: Aktuelle Satellitenbilder mithilfe digitaler Globen auswerten – Entdeckerbilder und Copernicus-Verlinkung bereiten vor; freie Navigation im externen digitalen Globus bleibt eine eigene Übung.

## Geprüfte Quellenbasis (21 Angebote)

Jede verlinkte Quelle in `geographie-gymnasium-10/src/curriculum/index.ts` (`SOURCES`) wurde einzeln mit `curl -sL --compressed -A "Mozilla/5.0"` abgerufen (HTTP 200 und realer Seitentitel geprüft). Seiten mit Status 403/406 (`ipcc.ch`, `unhcr.org/dach/de`, `naturalearthdata.com`) oder abweichenden Titeln wurden bewusst nicht aufgenommen; für Natur-Earth-Daten verweist `natural-earth` auf das offizielle GitHub-Repository `nvkelso/natural-earth-vector`, und die Vektorkarten (`world`, `mena`, `africa`, `latam`) werden direkt im Paket als Inline-SVG gerendert.

## Vorhandene ZAM-Karten (`replaces-de-by.json`)

Geprüft in `zam-os/zam` auf Commit `c92f4e383385ee487cd8b30f73b3bf3cb27b0860` (`tests/fixtures/curriculum/`). Alle drei abgelegten `de-by`-Zellen aus der älteren G8-Systematik weisen direkte inhaltliche Bezüge zu Geographie 10 (G9) auf:

- `de-by:gymnasium-8-geographie-tropen-passatzirkulation-wuesten` (4 Karten, Snapshot-SHA-256 `65187d135e5575abff5b948e6054e86b85b6833023fdd5fe0fc69969fe0279d6`)
- `de-by:gymnasium-9-geographie-disparitaeten-hdi-demographie-megastaedte` (4 Karten, Snapshot-SHA-256 `b71d50cd5e734373da70640e0686a326e5f7ed8f829cd24c02db220be6156c49`)
- `de-by:gymnasium-10-geographie-geooekozonen-klimawandel-kippelemente` (4 Karten, Snapshot-SHA-256 `032fbf04386adbbb184cf6fc268fffc61195b7e17602bfe05f995698065d08d2`)

| Alte Karte (`de-by`) | Kategorie | Vorgeschlagener Nachfolger | Kurze Begründung |
| --- | --- | --- | --- |
| `01K8G8P0000000000000000J01` | A (`propose-replace-after-approval`) | `geo10-oekosysteme-check` | Identischer Einzelabruf zu nährstoffarmen Tropenböden (Ferralsol) und kurzgeschlossenem Kreislauf |
| `01K8G8P0000000000000000J02` | C (`keep-active`) | – | Mehrteilige Synthese (Tageszeitenklima, Hadley/ITC, Stockwerkbau) ohne 1:1-Ersatz |
| `01K8G8P0000000000000000J03` | A (`propose-replace-after-approval`) | `geo10-desertifikation-check` | Identischer Einzelabruf zur Desertifikation im Sahel |
| `01K8G8P0000000000000000J04` | C (`keep-active`) | – | Kombiniert Wüstentypen, Formen, Oasen und Sahel über LB 3, LB 5 und LB 6 |
| `01K8G9P0000000000000000J01` | A (`propose-replace-after-approval`) | `geo10-indikatoren-check` | Identischer Einzelabruf zu den drei Dimensionen des HDI |
| `01K8G9P0000000000000000J02` | C (`keep-active`) | – | Mehrteilige Abfrage zu BIP/HDI/Gini, Schwellenländern und endogenen/exogenen Ansätzen |
| `01K8G9P0000000000000000J03` | C (`keep-active`) | – | Das 5-Phasen-Modell des demographischen Übergangs ist im Geo-10-Plan nicht als Einzelkompetenz ausgewiesen |
| `01K8G9P0000000000000000J04` | C (`keep-active`) | – | Kombiniert demographischen Übergang, Bevölkerungspyramiden, Push/Pull-Faktoren und Megastädte |
| `01K8GAF0000000000000000J01` | A (`propose-replace-after-approval`) | `geo10-verwundbarkeit-check` | Identischer Einzelabruf zum Nährstoffspeicher in der lebenden Biomasse des Regenwalds |
| `01K8GAF0000000000000000J02` | C (`keep-active`) | – | Bodentypenvergleich bis in boreale und polare Zonen (Schwerpunkt erst Geo 12) |
| `01K8GAF0000000000000000J03` | A (`propose-replace-after-approval`) | `geo10-szenarien-check` | Identischer Einzelabruf zur Definition eines Klimakippelements |
| `01K8GAF0000000000000000J04` | C (`keep-active`) | – | Mehrteilige Synthese über Strahlungsphysik, vier Kippelemente, Pariser Abkommen und Klimaschutz |

Zusammenfassung: **5 × Kategorie A, 0 × Kategorie B, 7 × Kategorie C** (alle C bleiben aktiv). `geographie-gymnasium-10/replaces-de-by.json` steht auf `"status": "proposal-only"` und `"approved": null`. Dementsprechend enthält `geographie-gymnasium-10/cell.json` **weder `replaces` noch `retired_items`**. Für Thomas bleibt ausdrücklich zur Entscheidung markiert, ob die beiden älteren Nachbarstufen-Zellen (G8 Klasse 8 und G8 Klasse 9, da Geographie im G9 in Klasse 8/9 entfällt) gemeinsam in diese Klasse-10-Überführung gehören und welche der vorgeschlagenen Kategorie-A-Übernahmen freigegeben werden.
