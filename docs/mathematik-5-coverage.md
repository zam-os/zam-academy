# Mathematik 5 Realschule: Lehrplan, Umfang und Nachweise

Stand: 6. November 2026. Das Paket umfasst 52 Lektionen in 6 Etappen mit 52 Atomen und 156 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M5](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/mathematik) wurde am 06.11.2026 direkt abgerufen, keine Archivfassung. Er gilt für alle Schülerinnen und Schüler; Wahlpflichtfächergruppen beginnen erst in Jahrgangsstufe 7. [source.json](../mathematik-realschule-5/src/curriculum/source.json) speichert Stunden, alle Kompetenzerwartungen wortgleich und die HTML-Prüfsumme. [coverage.json](../mathematik-realschule-5/coverage.json) ordnet jede der 38 Erwartungen mit konkreter Evidenz zu.

| Inhalt | LB | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| Natürliche Zahlen (1.1 bis 1.4) | 1 | 50 | 12 | 18 |
| Ganze Zahlen | 2 | 20 | 5 | 6 |
| Geometrische Grundvorstellungen und Grundbegriffe | 3 | 30 | 6 | 12 |
| Größen | 4 | 20 | 6 | 7 |
| Umfang und Flächeninhalt ebener Figuren | 5 | 15 | 6 | 6 |
| Auswertung von Daten | 6 | 5 | 3 | 3 |

Die Vertragstests prüfen die wortgleichen 38 Erwartungen, mindestens eine Lektion je Zeile, dass jede Lektion in mindestens einer Zeile vorkommt und dass sie zum Lernbereich der Zeile gehört. Die in der Evidenz genannten Labore und Generatoren müssen in den Lektionen existieren.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** [M3/4](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik) und [M6](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/mathematik) wurden am selben Tag gelesen. Aus M3/4 kommen der Zahlenraum bis zur Million, die schriftlichen Verfahren (dort Divisoren bis 10, hier auch größer), Größen und einfache Kombinatorik. Das Paket `mathematik-grundschule-4` deckt diese Vorstufe ab. Aus M6 wird nichts vorgezogen: Rechnen mit Brüchen und Dezimalzahlen, Flächenformeln für Dreieck, Parallelogramm, Trapez und Drachenviereck, Oberfläche, Volumen, Terme und Gleichungen mit Variablen, Prozente und der Begriff „direkt proportional“ bleiben dort.

**Grenzfälle.** Kommaschreibweise und die Alltagsbrüche ½, ¼ und ¾ kommen nur als Schreibweisen für Größen vor. Der Dreisatz arbeitet ohne Proportionalitätsbegriffe. Flächen von Vielecken entstehen nur aus Rechtecken. Formeln wie U = 2 · (a + b) sind vom Lehrplan verlangt; das Rückwärtsrechnen geschieht über die Umkehrung, nicht über Äquivalenzumformungen.

**Natürliche Zahlen.** ℕ beginnt bei 1, mit der Null heißt die Menge ℕ₀. Exponent 0 kommt nicht vor, er gehört zu M7. Der Exponent 1 ist möglich und wird benannt.

**Mehrere Namen.** Der Paketstandard verlangt keine eigene Festlegung, darum gelten die umfassenden Definitionen: Gleichschenklig heißt mindestens zwei gleiche Seiten, Trapez mindestens ein Paar paralleler Seiten. Ein gleichseitiges Dreieck ist also auch gleichschenklig, ein Parallelogramm auch ein Trapez. Damit das keine richtige Antwort falsch macht, fragen die Aufgaben nach dem genauesten Namen, und die Karten nennen als falsche Antworten nur Namen, die wirklich nicht passen.

**Geometrie.** Das Labor `cube-net` berechnet Gegenflächen über ein simuliertes Abrollen und erkennt so auch, welche Muster keinen Würfel ergeben; die Regeln im Text (kein 2-mal-2-Block, keine Reihe aus fünf) schließen Muster aus, sie beweisen aber nicht, dass ein Muster passt. Die Formelzeile der Lektion nennt deshalb auch die Anzahl von 11 Würfelnetzen.

**Praktische Grenzen.** Zeichnen mit Lineal und Zirkel, Messen mit dem Geodreieck, Falten und Spannen am Geobrett kann die App nicht ersetzen. Die Labore stellen die Figuren digital her, und die Lektionen beschreiben das Vorgehen auf Papier. Tests können nicht prüfen, ob jemand sauber zeichnet.

**Offene Punkte.** Eine Lehrkraft hat die Inhalte noch nicht geprüft. Lehrervideos fehlen und folgen als eigener Schritt.

## Alte Karten und Historien

Zwei bytegleich gesicherte Zellen aus ZAM `f57e6740854a2f91f985b59b9e101b388186d3bc` enthalten 16 alte Items. [replaces-de-by.json](../mathematik-realschule-5/replaces-de-by.json) dokumentiert jedes Item mit Grund. Die Zuordnung ist ein Vorschlag (`approved: null`, `status: proposal-only`). Die Zelle erscheint zunächst ohne `replaces` und `retired_items`.

| Kategorie | Anzahl | Bedeutung dieses Entwurfs |
| --- | --- | --- |
| A | 8 | gleicher Einzelabruf als vorgeschlagener Nachfolger |
| B | 0 | keine alte Mehrfachfrage bleibt auf einem eigenen Nachfolger erhalten |
| C | 8 | mehrteilige Karten bleiben als `keep-active` vorgeschlagen |

Die A-Vorschläge betreffen Strecke, stumpfer Winkel, 1 m = 1.000 mm, Umrechnungszahl 100 bei Flächen, Abrunden, Kommutativgesetz, Basis und Exponent sowie die Reihenfolge der Rechenarten. Die Karte zum Abrunden fragt nun genauer nach der Ziffer rechts neben der Rundungsstelle; die alte Karte sprach von der Ziffer an der Rundungsstelle, meinte aber dieselbe Regel.

`validate-migration.mjs` verwendet nur Wegwerfdatenbanken. Die tatsächliche Zelle bewahrt 16 vollständige FSRS-Stände und 32 Reviewereignisse, lässt alle alten Karten aktiv und legt 156 neue Karten unberührt an. Eine nur im Arbeitsspeicher erzeugte spätere Fassung verschiebt die acht vorgeschlagenen Historien unverändert, lässt die acht C-Karten aktiv und bricht ab, wenn eine lernende Person Karten auf altem und neuem Eintrag zugleich hält.

**Vor dem Bündeln in ZAM schließen:** Solange die Zuordnung offen ist, kann eine lernende Person Karten auf einer alten Kennung und ihrem Nachfolger halten. Dann lehnt zam-core die Installation der späteren Fassung ab. Die Freigabe der Zuordnung sollte deshalb vor `npm run academy:sync` in zam-os/zam erfolgen.

## Verifikation

Im Paket und am Stamm laufen die Befehle der Definition of Done aus [AGENTS.md](../AGENTS.md). Die Ergebnisse stehen in der Pull-Request-Beschreibung.

Die Labortests verwenden die Reglergitter der Mathematik-Referenz, alle 156 Zielzeugen (drei je Lektion) und Zeigerpositionen. Je Lektion und Stufe werden 80 erzeugte Aufgaben mit Dezimalkomma und Dezimalpunkt geprüft, insgesamt 8.320 Aufgaben. Unabhängige Gegenproben gibt es für römische Zahlen, Dualzahlen, Runden, schriftliche Verfahren, Teilbarkeitsregeln gegen die Division, Primfaktoren, ggT und kgV, Dreiecke, Vierecke, Körper über den eulerschen Polyedersatz, Würfelnetze und Einheiten. Eigene Tests prüfen plausible Werte, zum Beispiel mögliche Dreiecke und einen größten Dreieckswinkel von mindestens 60°. Regressionstests halten die Befunde aus dem Review von PR 91 fest: exakte Antworten auch bei sehr großen Zahlen, ein Punkt in Ganzzahlfeldern nur als Tausenderpunkt („16.000“ ist nie 16), Hinweise nur beim genau getippten Fehler, plausible Werte, Rechenweg bei Zeitspannen, ganze Zentimeter beim Zeichnen im Maßstab, Einzahl und Mehrzahl in allen Aufgabentexten, und keine Generatoren mit immer gleicher Antwort.

Browserprüfung der gebauten Einzeldatei über die lokale Vorschau: Jede der 52 Lektionen wurde in Hell und Dunkel auf beiden Stufen geöffnet, also 208 Ansichten, und auf Labor, Aufgabentext und Ausgaben wie `NaN` oder `undefined` geprüft; es gab keine Konsolenfehler. Alle Laborzeichnungen wurden als Übersicht angesehen, hell im Start- und in einem Zielzustand, dunkel in einem Zielzustand. Ein Griff wurde mit echtem Ziehen bewegt, eine Lektion vollständig abgeschlossen, Lernpfad und Formelsammlung geöffnet. Bei 375 Pixel Breite scrollt weder eine Lektion noch der Lernpfad noch die Formelsammlung waagrecht. Das Durchlesen einer Beispielaufgabe je Generator und Stufe hat Fehler aufgedeckt, die die Tests nicht fanden, etwa ein Dreieck mit größtem Winkel 30° und einen 40-€-Schein. Diese Fälle sind korrigiert und nun getestet.
