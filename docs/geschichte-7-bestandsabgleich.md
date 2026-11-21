# Geschichte 7 Realschule: Lehrplanabgleich und Bestandsabgleich

Stand 21. November 2026.

## Lehrplan

Quelle ist der Fachlehrplan Geschichte 7 Realschule auf
<https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geschichte>,
am 21.11.2026 direkt abgerufen (kein Archiv). Die Seite liegt unverändert in
[`geschichte-realschule-7/tests/fixtures/lehrplanplus-g7.html`](../geschichte-realschule-7/tests/fixtures/lehrplanplus-g7.html),
SHA-256 `012212a7a994760563235bddb3cf1d4885d114739b114901a42201b2d2c02a54`.
Der Fachlehrplan gilt für alle Wahlpflichtfächergruppen; die Zelle bindet
deshalb keinen `track`.

| Lernbereich | Stunden | Kompetenzerwartungen | Lektionen |
| --- | ---: | ---: | ---: |
| 1 Methoden und Arbeitstechniken | – | 5 | 5 |
| 2 Leben und Herrschaft im Mittelalter | ca. 20 | 10 | 12 |
| 3 Europa im Wandel vom Mittelalter zur Neuzeit | ca. 8 | 6 | 6 |
| 4 Reformation und Konfessionalisierung | ca. 8 | 5 | 4 |
| 5 Das frühneuzeitliche Europa (Dreißigjähriger Krieg, Absolutismus) | ca. 10 | 6 | 5 |
| 6 Bauwerke als Ausdruck politischen und religiösen Denkens (Längsschnitt) | ca. 5 | 4 | 3 |
| 7 Warenaustausch und Kulturtransfer (Längsschnitt) | ca. 5 | 4 | 3 |
| 8 Bilingualer Sachfachunterricht (optional) | – | 2 | 3 |

[`coverage.json`](../geschichte-realschule-7/coverage.json) ordnet alle 42
Kompetenzerwartungen wortgleich Lektionen zu (inklusive des
Originalschreibfehlers „staaliche“ in LB 7.2 auf der Lehrplanseite).
`node geschichte-realschule-7/scripts/check-curriculum.mjs` prüft das gegen die
gespeicherte Seite: „42 competences, 0 not found; page SHA-256 matches“.

Fünf Zeilen tragen `supported` statt `implemented`:
- LB 1 (Narrationen): Die App klärt Regeln historischer Narration und des
  Perspektivwechsels, eigene Comics, Rekonstruktionsbilder oder vertonte
  Hörspiele entstehen im Unterricht.
- LB 1 (Statistik, Schaubild und Karte) und LB 2 (Reisekönigtum,
  Territorialisierung): Die App zeigt Schaubilder und beschreibt Kartenarbeit,
  bildet aber keine historischen Karten ab; Lernende brauchen die jeweilige
  Geschichtskarte aus Schulbuch oder Geschichtsatlas.
- LB 1 (Medien): Die App übt Suchstrategien und Quellenkritik an digitalen
  Angeboten; die Arbeit im eigenen gedruckten Sach- oder Schulbuch findet
  außerhalb der App statt.
- LB 2 (Städtewesen): Die App bereitet Gründe, Stadtrechte, Zünfte und
  jüdisches Leben vor; ein Besuch im Stadtmuseum oder eine reale
  Stadterkundung bleibt Sache des Unterrichts.

Alle 40 Grundlegenden Daten und Begriffe der Lernbereiche 2 bis 7 stehen mit
Erklärung und Lektionsverweis im Nachschlagen; alle 9 datierten Einträge
erscheinen als Nadeln am Geschichtsfries (500–1800 n. Chr.).

Nachbarjahrgänge: [Geschichte 6 Realschule](../geschichte-realschule-6/) endet
mit den Franken und Karl dem Großen (800). Klasse 7 knüpft dort an (Mittelalter
ab Ottonen 962 bis zum Absolutismus des 17./18. Jahrhunderts; die beiden
Längsschnitte blicken auch auf Antike und Gegenwart). [Geschichte 8
Realschule](../geschichte-realschule-8/) setzt mit Aufklärung und
Französischer Revolution fort.

## Bestehende ZAM-Karten (Vorschlag, noch nicht freigegeben)

Geprüft gegen `zam-os/zam`, Commit `bae34e7dfe7d01838e448a65f15871c3549ae3fc`.
Die Zelle `de-by:realschule-7-geschichte-mittelalter-fruehe-neuzeit`, Version
`2026.08.1`, liegt bytegenau in
[`tests/fixtures/de-by-realschule-7-geschichte-mittelalter-fruehe-neuzeit-kvt.json`](../geschichte-realschule-7/tests/fixtures/de-by-realschule-7-geschichte-mittelalter-fruehe-neuzeit-kvt.json)
(SHA-256 `83bd564c4efea040d9a48d21d348b84e8e4f2e5c626968f853f125850ffece67`).
Sie hat vier Atome mit acht Karten.

| Alte Karte | Inhalt | Vorschlag | Vorgeschlagener Nachfolger |
| --- | --- | --- | --- |
| J01 | Stand über 90 % im mittelalterlichen Ständemodell (Bauern/Nährstand) | **A** | `g7-grundherrschaft-und-staende-check` |
| J02 | Mehrteilige Synthese: Lehnswesen, Grundherrschaft und Drei-Stände-Lehre | **C**, aktiv lassen | – |
| J03 | Rechtsgrundsatz „Stadtluft macht frei (nach Jahr und Tag)“ | **A** | `g7-stadt-und-buerger-check` |
| J04 | Mehrteilige Synthese: Stadtrecht, Sozialstruktur (inkl. Juden) und Zünfte | **C**, aktiv lassen | – |
| J05 | Anzahl der Kurfürsten nach der Goldenen Bulle 1356 (7 Kurfürsten) | **A** | `g7-koenig-reich-kurfuersten-check` |
| J06 | Mehrteilige Synthese: Wahlmonarchie, alle 7 Kurfürsten, Wirkungen 1356 | **C**, aktiv lassen | – |
| J07 | Auslöser der Reformation 1517 durch Martin Luther (95 Thesen / Ablass) | **A** | `g7-luther-und-1517-check` |
| J08 | Mehrteilige Synthese: Renaissance, Buchdruck, Luther-Soli, 1521/1525/1555 | **C**, aktiv lassen | – |

Begründung:
- Die vier Tier-1-Karten (`J01`, `J03`, `J05`, `J07`) fragen jeweils genau
  denselben einzelnen Sachverhalt ab wie die neuen `-check`-Karten; ein
  späteres `replaces` überträgt diese Lernhistorien verlustfrei.
- Die vier Tier-2-Karten (`J02`, `J04`, `J06`, `J08`) verlangen komplexe
  mehrteilige Gesamtdarstellungen über Themen, die das Paket auf eigene
  Lektionen aufteilt (etwa Lehnswesen getrennt von Grundherrschaft,
  Stadtstruktur getrennt von jüdischem Leben, Buchdruck getrennt von
  Reformation und Religionsfrieden). Eine Lernhistorie darf nicht auf mehrere
  Karten aufgeteilt werden, daher Vorschlag **C** (`keep-active`).

Status: [`replaces-de-by.json`](../geschichte-realschule-7/replaces-de-by.json)
trägt `"status": "proposal-only"` und `"approved": null`. `cell.json`
(`2026.11.1`, 41 Atome, 123 Karten) deklariert vorerst keine `replaces` und
keine `retired_items`. Die alten Zellen der Nachbarjahrgänge und Schularten
(`de-by:realschule-6-geschichte-urgeschichte-antike`,
`de-by:realschule-8-geschichte-aufklaerung-revolution-kaiserreich`,
`de-by:gymnasium-7-geschichte-mittelalter-frankenreich-staedte-kreuzzuege-reformation`)
bleiben unberührt bei ihren jeweiligen Paketen.

## Quellen

Alle 44 Links wurden am 21.11.2026 geöffnet und ihr Seitentitel gelesen
(`curl -sL -A "Mozilla/5.0" <url>`). Ein kurzer Originalauszug aus Martin
Luthers 95 Thesen (These 27 und 36, 1517) steht sprachlich leicht geglättet
in `g7-luther-und-1517` mit Link zur Textausgabe auf Wikisource. Lehrervideos
fügt ein späterer Schritt hinzu.
