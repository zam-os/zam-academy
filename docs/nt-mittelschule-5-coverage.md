# Natur und Technik 5 Mittelschule — Lehrplanabdeckung, Quellen und Kartenzuordnung

- Paket: `nt-mittelschule-5/` (`zam-academy:nt-mittelschule-5`)
- Lehrplan: [LehrplanPLUS Bayern, Natur und Technik 5, Mittelschule](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/nt)
- Abrufdatum: `2026-11-14` (`nt-mittelschule-5/tests/fixtures/curriculum.html`, SHA-256 `456b05f9d83b5b7b79e6723ebe892bb63f65890bd807947bd29f52a0a213d9b0`)

## 1. Lehrplanprüfung

An der bayerischen Mittelschule wird **Natur und Technik** (Jahrgangsstufen 5–10, Stundentafel BayMSO Anlage 1) als gemeinsames Verbundfach über Biologie, Chemie und Physik unterrichtet; ein eigener M‑Zug beginnt erst in Jahrgangsstufe 7. Das Paket deckt deshalb alle vier Lernbereiche des Fachlehrplans Jgst. 5 ab und wird in `academy.json` über `fachverbunde` (`id: "nt"`, Pfade `biologie`, `chemie`, `physik`) einmal als `fach: "nt"` registriert.

`nt-mittelschule-5/coverage.json` enthält alle **41** Kompetenzerwartungen über die Lernbereiche 1–4 wortgleich (`node nt-mittelschule-5/scripts/check-curriculum.mjs`: `41 verbatim competence rows, 0 not found; curriculum SHA-256 matches.`), davon **29** `implemented` und **12** `supported` (alle `supported`-Zeilen nennen sowohl die App-Leistung als auch das im Unterricht verbleibende Praxisteil im Feld `evidence`):

| Lernbereich | Titel | Zeilen | Lektionen | Karten | `supported`-Zeilen (bleiben teils im Unterricht) |
| --- | --- | ---: | ---: | ---: | --- |
| LB 1 | Naturwissenschaftliches Arbeiten | 9 | 5 | 10 | `(1,1)`, `(1,2)`, `(1,4)` — echtes Laborgerät, Messen und Live-Versuchsprotokoll |
| LB 2 | Lebensgrundlage Sonne | 17 | 13 | 26 | `(2,5)`, `(2,6)`, `(2,7)`, `(2,9)`, `(2,12)` — Versuche mit Thermometer, Wärmeleitung, Hauttastversuch und Lichtbox |
| LB 3 | Mensch und Gesundheit | 10 | 9 | 18 | `(3,7)`, `(3,9)` — Bau des Wirbelsäulenmodells und Abtasten am eigenen Körper |
| LB 4 | Materie, Stoffe und Technik | 5 | 5 | 10 | `(4,3)`, `(4,4)` — reale Stoffproben und praktische Trennversuche im Labor |

Zeile `(1, 8)` („beurteilen verschiedene Maßnahmen und Verhaltensweisen zur Erhaltung der eigenen Gesundheit“) startet bei Laborsicherheit (`nt5-gefahrstoffe-und-sicherheit`) und verweist zusätzlich auf LB 3 (`nt5-gesund-im-alltag`, `nt5-haltung-und-sport`).

## 2. Geprüfte Quellenangaben (51/51)

Alle 51 Einträge in `nt-mittelschule-5/src/curriculum/outline.json` wurden am `2026-11-14` mit `User-Agent: Mozilla/5.0` abgerufen (jeweils HTTP 200), ihr realer Seitentitel (`<title>`) ausgelesen und als `label` in `outline.json` / `cell.json` hinterlegt; Links öffnen in der App nur auf ausdrücklichen Klick:

| ID | Anzeige-Label (`outline.json`) | Gelesener Seitentitel (`<title>`) | HTTP | URL |
| --- | --- | --- | --- | --- |
| `lehrplan` | LehrplanPLUS Bayern · Natur und Technik 5 Mittelschule | LehrplanPLUS - Mittelschule - 5 - Natur und Technik - Fachlehrpläne | 200 | https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/nt |
| `kx-naturwissenschaft` | Klexikon · Naturwissenschaft | Naturwissenschaft – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Naturwissenschaft |
| `kx-experiment` | Klexikon · Experiment | Experiment – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Experiment |
| `kx-modell` | Klexikon · Modell | Modell – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Modell |
| `wp-ghs` | Wikipedia · Global harmonisiertes System (GHS) | Global harmonisiertes System zur Einstufung und Kennzeichnung von Chemikalien – Wikipedia | 200 | https://de.wikipedia.org/wiki/Global_harmonisiertes_System_zur_Einstufung_und_Kennzeichnung_von_Chemikalien |
| `kx-sonne` | Klexikon · Sonne | Sonne – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Sonne |
| `kx-tagnacht` | Klexikon · Tag und Nacht | Tag und Nacht – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Tag_und_Nacht |
| `kx-jahreszeiten` | Klexikon · Jahreszeiten | Jahreszeiten – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Jahreszeiten |
| `kx-energie` | Klexikon · Energie | Energie – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Energie |
| `kx-sonnenenergie` | Klexikon · Sonnenenergie | Sonnenenergie – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Sonnenenergie |
| `kx-temperatur` | Klexikon · Temperatur | Temperatur – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Temperatur |
| `kx-thermometer` | Klexikon · Thermometer | Thermometer – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Thermometer |
| `wp-waerme` | Wikipedia · Wärmeübertragung | Wärmeübertragung – Wikipedia | 200 | https://de.wikipedia.org/wiki/W%C3%A4rmetransport |
| `kx-haut` | Klexikon · Haut | Haut – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Haut |
| `gi-haut` | Gesundheitsinformation.de · Wie funktioniert die Haut? | Wie funktioniert die Haut? \| Gesundheitsinformation.de | 200 | https://www.gesundheitsinformation.de/wie-funktioniert-die-haut.html |
| `bfs-hauttypen` | Bundesamt für Strahlenschutz · Die verschiedenen Hauttypen | BfS - Die verschiedenen Hauttypen - Die verschiedenen Hauttypen | 200 | https://www.bfs.de/DE/themen/opt/uv/wirkung/hauttypen/hauttypen.html |
| `bfs-uvschutz` | Bundesamt für Strahlenschutz · Schutz vor UV-Strahlung | BfS - Schutz vor UV-Strahlung | 200 | https://www.bfs.de/DE/themen/opt/uv/schutz/schutz_node.html |
| `kx-licht` | Klexikon · Licht | Licht – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Licht |
| `wp-toterwinkel` | Wikipedia · Toter Winkel | Toter Winkel – Wikipedia | 200 | https://de.wikipedia.org/wiki/Toter_Winkel |
| `kx-regenbogen` | Klexikon · Regenbogen | Regenbogen – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Regenbogen |
| `kx-farbe` | Klexikon · Farbe | Farbe – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Farbe |
| `wp-spektrum` | Wikipedia · Spektralfarbe | Spektralfarbe – Wikipedia | 200 | https://de.wikipedia.org/wiki/Spektralfarbe |
| `kx-auge` | Klexikon · Auge | Auge – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Auge |
| `gi-auge` | Gesundheitsinformation.de · Wie funktioniert das Auge? | Wie funktioniert das Auge? \| Gesundheitsinformation.de | 200 | https://www.gesundheitsinformation.de/wie-funktioniert-das-auge.html |
| `kx-brille` | Klexikon · Brille | Brille – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Brille |
| `kx-organ` | Klexikon · Organ | Organ – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Organ |
| `kx-atmung` | Klexikon · Atmung | Atmung – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Atmung |
| `kx-kreislauf` | Klexikon · Blutkreislauf | Blutkreislauf – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Blutkreislauf |
| `kx-gehirn` | Klexikon · Gehirn | Gehirn – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Gehirn |
| `kx-gesundheit` | Klexikon · Gesundheit | Gesundheit – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Gesundheit |
| `kx-verdauung` | Klexikon · Verdauung | Verdauung – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Verdauung |
| `wp-verdauung` | Wikipedia · Verdauungstrakt | Verdauungstrakt – Wikipedia | 200 | https://de.wikipedia.org/wiki/Verdauungstrakt |
| `kx-ernaehrung` | Klexikon · Ernährung | Ernährung – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Ern%C3%A4hrung |
| `dge-regeln` | DGE · Gut essen und trinken – die DGE-Empfehlungen | Gut essen und trinken – die DGE-Empfehlungen \| DGE | 200 | https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/ |
| `kx-skelett` | Klexikon · Skelett | Skelett – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Skelett |
| `kx-wirbelsaeule` | Klexikon · Wirbelsäule | Wirbelsäule – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Wirbels%C3%A4ule |
| `kx-gelenk` | Klexikon · Gelenk | Gelenk – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Gelenk |
| `kx-muskel` | Klexikon · Muskel | Muskel – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Muskel |
| `wp-aggregat` | Wikipedia · Aggregatzustand | Aggregatzustand – Wikipedia | 200 | https://de.wikipedia.org/wiki/Aggregatzustand |
| `kx-chemie` | Klexikon · Chemie | Chemie – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Chemie |
| `kx-wasser` | Klexikon · Wasser | Wasser – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Wasser |
| `kx-fluessigkeit` | Klexikon · Flüssigkeit | Flüssigkeit – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Fl%C3%BCssigkeit |
| `kx-gas` | Klexikon · Gas | Gas – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Gas |
| `kx-zucker` | Klexikon · Zucker | Zucker – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Zucker |
| `kx-papier` | Klexikon · Papier | Papier – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Papier |
| `kx-eisen` | Klexikon · Eisen | Eisen – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Eisen |
| `kx-salz` | Klexikon · Salz | Salz – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Salz |
| `wp-trennen` | Wikipedia · Trennen (Verfahrenstechnik) | Trennen (Verfahrenstechnik) – Wikipedia | 200 | https://de.wikipedia.org/wiki/Trennverfahren_(Verfahrenstechnik) |
| `kx-abfall` | Klexikon · Abfall | Abfall – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/M%C3%BCll |
| `kx-recycling` | Klexikon · Recycling | Recycling – Klexikon – das Kinderlexikon | 200 | https://klexikon.zum.de/wiki/Recycling |
| `uba-abfall` | Umweltbundesamt · Abfall- und Kreislaufwirtschaft | Abfall- und Kreislaufwirtschaft \| Umweltbundesamt | 200 | https://www.umweltbundesamt.de/themen/abfall-ressourcen/abfallwirtschaft |

## 3. Kartenzuordnung (`nt-mittelschule-5/replaces-de-by.json`)

- Stand in `nt-mittelschule-5/replaces-de-by.json`: `"status": "proposal-only"`, `"approved": null`, `"rows": []`, `"sources": []`; `nt-mittelschule-5/cell.json` deklariert weder `replaces` noch `retired_items`.
- **Bestandsprüfung `zam-os/zam` (Commit `b7fdfcc4e30d21bbbd97fb2025952ff7f4e296ac`, `src/kernel/library/bundled-cells.ts` und `tests/fixtures/curriculum/`):**
  Es gibt **keine** `de-by:mittelschule-*`-Altzelle (Mittelschul-Zellen in `zam` stammen bereits aus `zam-academy:deutsch-mittelschule-*` und `zam-academy:mathematik-mittelschule-*`).
- **Abgrenzung zu realen themenverwandten `de-by`-Zellen anderer Schularten (`AGENTS.md` § 6: keine Doppelzuordnung):**
  - **Bereits durch andere Schularten zugeordnet (`approved`, bleiben dort):**
    - `de-by:realschule-5-natur-technik-mikroskop-experiment-dateien` → freigegeben an `biologie-realschule-5` (`2026-11-13`, [docs/biologie-5-bestandsabgleich.md](biologie-5-bestandsabgleich.md)): `NuT J01` (Hypothese → `b5-erkenntnisweg-check`) und `NuT J03` (Mikroskop → `b5-mikroskop-check`) per Kategorie A übertragen; `J02, J04–J08` Kategorie C aktiv.
    - `de-by:realschule-5-biologie-mensch-skelett-bewegung-organe` → freigegeben an `biologie-realschule-5` (`2026-11-13`): `Mensch J01` (Wirbelsäule → `b5-skelett-wirbelsaeule-check`) und `Mensch J03` (Trizeps/Bizeps → `b5-muskeln-gelenke-check`) per Kategorie A übertragen; `J02, J04–J08` Kategorie C aktiv (auch in `biologie-realschule-6/replaces-de-by.json` als Quelle dokumentiert).
    - `de-by:realschule-8-chemie-stoffe-stoffgemische-trennung` → freigegeben an `chemie-realschule-8` (`2026-10-26`).
  - **Bereits anderweitig vorgeschlagen (`proposal-only`):**
    - `de-by:realschule-8-biologie-ernaehrung-verdauung` → vorgeschlagen in `biologie-realschule-8/replaces-de-by.json`.
  - **Derzeit unbeanspruchte Zellen anderer Schularten mit thematischen Berührungspunkten (bleiben aktiv):**
    - `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` (`J01–J02` naturwissenschaftliches Experiment / Erkenntnisweg, `J03–J04` Zelle/Mikroskop, `J05–J08` OOP/Dateisystem — von `biologie-realschule-5` explizit als „andere Schulart“ ausgeschlossen).
    - `de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie` (`J01–J04` Bandscheiben/Skelett/Sehnen/Gelenke, `J05–J08` Sexualbiologie — ebenfalls von `biologie-realschule-5` als „andere Schulart“ ausgeschlossen).
    - Fachverwandte höhere Jahrgänge anderer Schularten (z. B. `de-by:realschule-7-physik-waermelehre-temperatur-ausdehnung`, `de-by:gymnasium-7-physik-optik-lichtbrechung-totalreflexion-linsen`, `de-by:gymnasium-8-biologie-verdauung-stoffwechsel-blutkreislauf-herz`, `de-by:gymnasium-8-physik-waermelehre-thermodynamik-energieumwandlung`).
- **Offene Frage an Thomas (Entscheidung vor einer späteren Übernahme):**
  1. Sollen die noch unbeanspruchten `de-by:gymnasium-5-*`-Zellen (`de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop`, `de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie`) weiter vollständig dem Gymnasium vorbehalten bleiben (wie bei `biologie-realschule-5`), oder soll davon etwas auf `nt-mittelschule-5` gemappt werden?
  2. Bestätigung, dass die bereits an `biologie-realschule-5` vergebenen `de-by:realschule-5-*`-Karten dort bleiben und in `nt-mittelschule-5` nicht doppelt beansprucht werden.
