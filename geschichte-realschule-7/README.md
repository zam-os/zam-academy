# Geschichte 7 · Realschule Bayern

Ein Paket der ZAM Academy nach dem
[Fachlehrplan Geschichte 7 Realschule](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geschichte),
geprüft am 21. November 2026. Ein gemeinsamer Lernpfad für alle
Wahlpflichtfächergruppen.

38 Kernlektionen (Lernbereiche 1 bis 7) und drei optionale englischsprachige
Vertiefungen (Lernbereich 8) führen von Methoden über Leben und Herrschaft im
Mittelalter, Renaissance, Entdeckungen und Buchdruck sowie Reformation bis zum
Dreißigjährigen Krieg und Absolutismus; zwei Längsschnitte vergleichen
Bauwerke und Handelsnetze von der Antike bis in die Gegenwart. Jede Lektion
bietet eine Erklärung mit Merksatz, einen Schnellcheck mit erklärten
Fehlantworten, eine Werkstatt (Klassifikation mit farbigen Kategorien oder
Zeitleiste) und zwei Schreibaufgaben: Level 1 mit Leitfragen, Level 2 als
Transfer. Eigene Texte werden nicht automatisch bewertet; Lernende vergleichen
sie mit einer möglichen Antwort und drei Kriterien.

| Lernbereich | Lektionen | Inhalt |
| --- | ---: | --- |
| 1 · Geschichte erforschen | 5 | Flugblätter und Historienbilder, Perspektivität, Karten und Diagramme, Romanik/Gotik/Barock, Recherche |
| 2 · Leben und Herrschaft im Mittelalter | 12 | Glaube und Herrschaft, 962 Otto I. und Reisekönigtum, Grundherrschaft und Stände, Lehnswesen, Klöster, Investiturstreit, Goldene Bulle 1356, Staufer um 1200, Städte und Zünfte, jüdisches Leben, Pest, Kreuzzüge |
| 3 · Wandel zur Neuzeit | 6 | Renaissance und Antike, Leonardo und Galilei, Gutenbergs Buchdruck, 1453 Konstantinopel, 1492 Entdeckungsfahrten, Kolonialisierung und Epochengrenze |
| 4 · Reformation und Konfessionen | 4 | 1517 Luther und 95 Thesen, Reichstag 1521 und Bauernkrieg 1525, Konfessionalisierung und 1555, Hexenverfolgung |
| 5 · Dreißigjähriger Krieg und Absolutismus | 5 | 1618–1648 und Bayern, Westfälischer Friede 1648, Frankreich unter Ludwig XIV., Barock in Bayern, Hegemonie und „balance of power“ |
| 6 · Bauwerke im Längsschnitt | 3 | Tempel/Pfalz/Burg, Kirche/Synagoge/Moschee, Barockschloss bis Reichstag und Denkmalschutz |
| 7 · Handel und Kulturtransfer | 3 | Handel und Romanisierung am Limes, Hanse und Fugger, Globalisierung heute |
| 8 · Bilingual History (optional) | 3 | Village & Town, Monks & Knights, Renaissance/Print/1492 |

Sichtbar gemacht wird die Zeit: Jede Lektion zeigt einen maßstabsgerechten
Zeitstreifen von 500 bis 1800 n. Chr. (eingerahmt von Antike links und heute
rechts), Lernpfad und Nachschlagen einen Geschichtsfries aller Kernlektionen
der Lernbereiche 2 bis 7 mit den Grundlegenden Daten des Lehrplans, eine
gelöste Zeitleisten-Werkstatt ihre Ereignisse auf der Leiste. 23 Lektionen
zeichnen ein Schaubild (Stände- und Stadtpyramiden, Schichtmodelle,
Kreisläufe und Vergleiche). Jeder Lernbereich hat eine eigene Akzentfarbe.

## Umfang und Belege

[`coverage.json`](coverage.json) ordnet alle 42 Kompetenzerwartungen wortgleich
zu; `node scripts/check-curriculum.mjs` prüft sie gegen die gespeicherte
Lehrplanseite. Was im Unterricht stattfindet (Comics, Hörspiele,
Stadterkundungen und Museumsbesuche, Arbeit mit echten Geschichtskarten aus
Schulbuch oder Geschichtsatlas sowie eigene Recherchen in gedruckten Büchern),
bereitet die App vor und kennzeichnet diese Zeilen als `supported`.
Erklärungen und Übungssätze sind eigens verfasste Darstellungen; ein kurzer
Originalauszug aus Martin Luthers 95 Thesen (These 27 und 36, 1517) ist
gekennzeichnet und verlinkt.

Fortschritt, Farbschema und eigene Texte bleiben in diesem Browser
(`localStorage`, getrennt nach Benutzerkonto, Browser und Profil; bei
gemeinsam genutztem Konto am Ende über „Lokalen Fortschritt zurücksetzen“
löschen). Keine Konten, kein Tracking, keine externen Schriften oder Anfragen;
Quellenlinks öffnen erst auf Klick.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5271/geschichte-realschule-7/
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
```

`npm run package:zip` erzeugt `release/ZAM-Academy-Geschichte-7-offline.zip`
mit einer HTML-Datei, die ohne Server und Internet läuft, und Startdateien für
Windows, macOS und Linux.

## ZAM-Zelle und Mapping-Vorschlag

`cell.json` ist die einzige Kartenliste: 41 Atome, eines pro Lektion, mit je
drei Karten (`-check`, `-merken`, `-begruenden`, insgesamt 123 Karten). Jede
Karte verweist auf
`https://academy.zam-os.org/geschichte-realschule-7/#lesson=<id>`. Lektions-,
Atom- und Kartenkennungen sind in `tests/fixtures/public-contract.json`
festgeschrieben.

Für die ältere Zelle `de-by:realschule-7-geschichte-mittelalter-fruehe-neuzeit`
(acht Karten) enthält [`replaces-de-by.json`](replaces-de-by.json) einen
unfreigegebenen Vorschlag (`"status": "proposal-only"`, `"approved": null`):
vier A-Karten (`J01`, `J03`, `J05`, `J07`) zur späteren Übernahme nach
ausdrücklicher Freigabe durch Thomas und vier C-Karten (`J02`, `J04`, `J06`,
`J08`), die aktiv bleiben. `cell.json` erklärt daher in dieser Fassung noch
weder `replaces` noch `retired_items`. Siehe
[Bestandsabgleich](../docs/geschichte-7-bestandsabgleich.md).
