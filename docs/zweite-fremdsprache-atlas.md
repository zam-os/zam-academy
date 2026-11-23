# Zweite Fremdsprache im Atlas

Thomas am 2026-11-23 (Sitzung zu `englisch-gymnasium-7`, PR #192):
„Englisch als 2. Fremdsprache - ist ja ein ganz eigener Pfad. Vielleicht ein
eigenständiges Modul mit passendem Namen? Du kannst gerne die Zelle dafür
anlegen, dass wir es später nicht vergessen. Vermutlich gibt es auch noch
andere Fälle von 2. Fremdsprache. Dann sollten wir das gleich überall als
Zelle anlegen.“

Dieses Dokument hält fest, welche Fremdsprachen-Pfade LehrplanPLUS Bayern
kennt, welche davon der Atlas (`academy.json`, gerendert von `index.html`)
jetzt als eigene Zellen führt und was offen ist.

## Modell: `schools` pro Fach

Ein Fach in `faecher` kann ein optionales Feld `schools` tragen, eine Liste
von Schularten aus `schulen`. Fehlt es, gilt das Fach wie bisher in jeder
Schulart von `from` bis `to`. Ist es gesetzt, entstehen Zellen nur in diesen
Schularten:

- `curriculumSlot()` liefert für andere Schularten keinen Platz, also weder
  Platzhalter in der Schulsicht noch eine Klassenmarke in der Weltsicht;
- die Abdeckungsmatrix zeigt für andere Schularten keine Zeile (sonst stünde
  an der Mittelschule eine Zeile „Latein“ voller Punkte);
- Lücken innerhalb einer Schulart bleiben Sache von `kein_unterricht`.

`scripts/academy-registry.test.mjs` prüft: `schools` nennt bekannte
Schularten, jede davon hat mindestens eine Klasse des Fachs, kein Paket und
kein `kein_unterricht`-Eintrag liegt außerhalb von `schools`, und die neuen
Pfade erscheinen nur am Gymnasium in genau ihren Klassen (beide Linsen und
Matrix).

## Neue Zellen

| Fach-ID | Name | Schulart | Klassen | Glyphe |
| --- | --- | --- | --- | --- |
| `englisch-2fs` | Englisch (2. Fremdsprache) | Gymnasium | 6–9 | EN² |
| `franzoesisch-2fs` | Französisch (2. Fremdsprache) | Gymnasium | 6–9 | FR² |
| `latein` | Latein | Gymnasium | 5–13 | LA |
| `latein-2fs` | Latein (2. Fremdsprache) | Gymnasium | 6–8 | LA² |

Der Name folgt LehrplanPLUS („Fachlehrplan Englisch 6 (2. Fremdsprache)“).
Ab Klasse 10 gilt für Englisch und Französisch ein gemeinsamer Lehrplan
„1. und 2. Fremdsprache“, für Latein ab Klasse 9 „1./2. Fremdsprache“; diese
Klassen gehören zur Zelle des
Hauptfachs (`englisch`, `franzoesisch`, `latein`). `latein` umfasst daher
die 1. Fremdsprache in 5–8, den gemeinsamen Plan in 9–11 und die
Qualifikationsphase 12–13.

## Belege

Alle Seiten am 2026-11-23 live abgerufen
(`curl -sL --compressed -A "Mozilla/5.0" <url>`, Status 200). Die Liste aller
Fachlehrpläne stammt aus `https://www.lehrplanplus.bayern.de/sitemap.xml`
(1912 Fachlehrplan-Adressen, SHA-256 der abgerufenen Datei
`9f025d82b2aa16b0d9ef271a1dd313fb550e4f52b2331520f6bed77844e416c1`). Der Seitentitel ist bei allen Seiten
„LehrplanPLUS - <Schulart> - <Jgs> - <Fach> - Fachlehrpläne“; die Spalte
„Überschrift“ nennt die Überschrift der Seite, die die Variante angibt.

### In dieser Änderung als Zelle angelegt

| Schulart | Fach | Klasse | Lehrplan-URL | Überschrift |
| --- | --- | --- | --- | --- |
| Gymnasium | Englisch 2. FS | 6 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/2-fremdsprache | Fachlehrplan Englisch 6 (2. Fremdsprache) |
| Gymnasium | Englisch 2. FS | 7 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/englisch/2-fremdsprache | Fachlehrplan Englisch 7 (2. Fremdsprache) |
| Gymnasium | Englisch 2. FS | 8 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/englisch/2-fremdsprache | Fachlehrplan Englisch 8 (2. Fremdsprache) |
| Gymnasium | Englisch 2. FS | 9 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/englisch/2-fremdsprache | Fachlehrplan Englisch 9 (2. Fremdsprache) |
| Gymnasium | Englisch 1. und 2. FS | 10, 11 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/englisch/1-2-fremdsprache, …/11/englisch/1-2-fremdsprache | gemeinsamer Plan, Zelle `englisch` |
| Gymnasium | Französisch 2. FS | 6 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache | Fachlehrplan Französisch 6 (2. Fremdsprache) |
| Gymnasium | Französisch 2. FS | 7 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/2-fremdsprache | Fachlehrplan Französisch 7 (2. Fremdsprache) |
| Gymnasium | Französisch 2. FS | 8 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/franzoesisch/2fs | Fachlehrplan Französisch 8 (2. Fremdsprache) |
| Gymnasium | Französisch 2. FS | 9 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/franzoesisch/2-fremdsprache | Fachlehrplan Französisch 9 (2. Fremdsprache) |
| Gymnasium | Französisch 1. und 2. FS | 10, 11 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/franzoesisch/1-2-fremdsprache, …/11/franzoesisch/1-2-fremdsprache | gemeinsamer Plan, Zelle `franzoesisch` |
| Gymnasium | Latein 1. FS | 5–8 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/latein/1-fremdsprache (ebenso 6, 7, 8) | Fachlehrplan Latein 5 (1. Fremdsprache) usw. |
| Gymnasium | Latein 2. FS | 6–8 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/2-fremdsprache (ebenso 7, 8) | Fachlehrplan Latein 6 (2. Fremdsprache) usw. |
| Gymnasium | Latein 1./2. FS | 9–11 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/latein/1-2-fremdsprache (ebenso 10, 11) | Fachlehrplan Latein 9 (1./2. Fremdsprache) usw. |
| Gymnasium | Latein Q-Phase | 12–13 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/latein/grundlegend, …/12/latein/erhoeht, …/13/latein/grundlegend, …/13/latein/erhoeht | grundlegendes / erhöhtes Anforderungsniveau |

Stundentafel: GSO Anlage 1,
https://www.gesetze-bayern.de/Content/Document/BayGSO-ANL_1 (Titel „GSO:
Anlage 1 Stundentafeln für die Jahrgangsstufen 5 bis 11“): „Englisch ist
verpflichtend erste oder zweite Fremdsprache.“ und „Latein ist verpflichtend
erste oder zweite Fremdsprache.“ Das Fachprofil Latein
(https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/latein) nennt die
Spracherwerbsphase „Jahrgangsstufe 5–8 bei L 1, Jahrgangsstufe 6–8 bei L 2“.

### Geprüft, nicht angelegt (offene Fragen)

| Schulart | Fach | Klassen | Lehrplan-URL | Warum offen |
| --- | --- | --- | --- | --- |
| Realschule | Französisch (2. FS, Wahlpflichtfächergruppe IIIa) | 7–10 | https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/franzoesisch (ebenso 8–10) | Ist schon die Zelle `franzoesisch` mit vier Paketen; an der Realschule gibt es nur diesen einen Französisch-Pfad. RSO Anlage 1 (https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1): „Zweite Fremdsprache (Französisch) - - 4 3 4 4“ in IIIa. |
| Realschule | Spanisch | 7–10 | https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/spanisch (ebenso 8, 9, 10; Titel „LehrplanPLUS - Realschule - 7 - Spanisch - Fachlehrpläne“) | Fachlehrplan existiert, die Stundentafel der RSO nennt als zweite Fremdsprache aber nur Französisch. In welcher Form Spanisch unterrichtet wird, war nicht zu belegen. |
| FOS / BOS | Französisch, Spanisch (Grundkurs, Aufbaukurs, fortgeführt, AHR), Italienisch, Russisch, Latein (AHR) | 12–13 | z. B. https://www.lehrplanplus.bayern.de/fachlehrplan/fos/12/spanisch/spanisch_ahr („Fachlehrplan Spanisch 12 (AHR)“), …/fos/12/latein („Fachlehrplan Latein 12 (AHR)“), …/fos/12/franzoesisch/franzoesisch_ahr; dieselben Pläne unter `bos/` | Die zweite Fremdsprache für die allgemeine Hochschulreife. Französisch hat schon FOS/BOS-Zellen über `franzoesisch` (Klassen 11–13, obwohl die Pläne erst in 12 beginnen); die übrigen Sprachen fehlen. |
| Gymnasium | 3. Fremdsprache: Französisch, Spanisch, Italienisch, Russisch, Chinesisch; Griechisch | 8–11 | z. B. https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/spanisch/3-fremdsprache, …/8/chi/3-fremdsprache, …/8/griechisch | Keine 2. Fremdsprache; nicht Teil von Thomas' Auftrag. |
| Gymnasium | spätbeginnende Fremdsprache: Französisch, Spanisch, Italienisch, Russisch, Polnisch, Türkisch, Tschechisch | 11 (12–13 grundlegend) | z. B. https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/spanisch/spaet-fremdsprache, …/11/pln/spaet-fremdsprache, …/11/tr/spaet-fremdsprache, …/11/tsh/spaet-fremdsprache | Keine 2. Fremdsprache; nicht Teil von Thomas' Auftrag. |
| Mittelschule | – | – | Sitemap: nur Englisch (Regel- und M-Klasse) | Keine 2. Fremdsprache. |

## Bestehende Pakete mit beiden Pfaden

`franzoesisch-gymnasium-6` und `franzoesisch-gymnasium-7` enthalten je einen
Lernpfad für die 1. und einen für die 2. Fremdsprache. Sie bleiben in dieser
Änderung unverändert in der Zelle `franzoesisch`; die Zellen
„Französisch (2. Fremdsprache)“ Klasse 6 und 7 stehen vorerst als
„noch nicht verfügbar“ da. Ob die Pakete in beiden Zellen erscheinen sollen,
entscheidet Thomas (Frage im PR).
