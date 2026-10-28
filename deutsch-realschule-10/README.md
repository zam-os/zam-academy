# Deutsch 10 · Realschule Bayern

Veröffentlichtes Lernpaket: **30 Lektionen, 60 Fallentscheidungen,
60 eigene Aufgaben auf zwei Niveaus und 60 ZAM-Karten**. Die App verbindet
Erklärungen und konkrete Materialien mit Schnellchecks, begründeten
Fallentscheidungen und eigenen Texten. Helle und dunkle Ansicht, Direktlinks
und lokale Speicherung gehören dazu.

| Lernbereich | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| Sprechen und Zuhören | 5 | Zuhören, Kommunikationsmodelle, Vortrag, Diskussion und Protokoll, Gespräch, Szene |
| Lesen, Literatur und Medien | 10 | Lesestrategien, Journalistik, Daten und Quellen, Filmvergleich, Parabel, Roman, Satire, Lyrik |
| Schreiben und Argumentieren | 10 | Argumente, Gegenpositionen, Gliederung, Material, Leserbrief, Exzerpt, Zitate, Analyse, produktives Schreiben, Überarbeitung |
| Sprache untersuchen und reflektieren | 5 | Fachsprache und Varietäten, Sprachwandel, Mehrsprachigkeit, Kohärenz, Rechtschreibung |

Grundlage ist der gemeinsame [LehrplanPLUS Deutsch 10 der Realschule Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/deutsch),
abgeglichen am **25. Oktober 2026**. [coverage.json](coverage.json) ordnet die
48 Kompetenzerwartungen der 14 Abschnitte den Lektionen zu. Die Kurzfassungen
sind eigene Zusammenfassungen. `position` zählt innerhalb eines Abschnitts
und ist keine offizielle Unterpunktnummer. Das Schema verwendet `curriculum` und pro Zeile `lb`, `competence`, `lessons`, `evidence`. `guided` bezeichnet eine begrenzte
geführte Übung; `preparation` nur die Vorbereitung einer zusätzlichen Leistung.
Keine Zeile behauptet einen vollständigen Kompetenznachweis.

## Eigene Texte und Fortschritt

Level 1 übt die Anwendung. Level 2 verlangt Vergleich, Transfer, Entwurf oder
ein begründetes Urteil. Beide Niveaus haben eigene Entwürfe und
Selbsteinschätzungen. Schnellcheck und Fallentscheidungen sind gemeinsam.

Eine Lektion zählt auf dem ausgewählten Niveau als bearbeitet, wenn der
Schnellcheck stimmt, beide Fälle richtig entschieden wurden und die lernende
Person ihre eigene Antwort nach Öffnen des Musters anhand aller drei Kriterien
eingeschätzt und bestätigt hat. **Eigene Texte werden nicht automatisch
bewertet.** Die Mindestlänge von 20 Zeichen öffnet nur den Vergleich und ist
kein Qualitätsmaßstab. Eine Textänderung entfernt den dazugehörigen Abschluss.
Eine falsche Schnellcheckantwort entfernt dessen Nachweis.

Geprüfte Fallentscheidungen, Entwürfe und Abschlüsse bleiben in diesem Browser.
Nicht eingereichte Falländerungen sind flüchtig. Bei gesperrtem Speicher zeigt
die App einen sichtbaren Hinweis und funktioniert für den laufenden Besuch.
Ein anderes Gerät oder Browserprofil besitzt einen eigenen Fortschritt.

## Zusätzlich in der Praxis

Die App enthält überwiegend eigens geschriebene, als erfunden gekennzeichnete
Materialien. Aus Jakob van Hoddis' *Weltende* (1911) werden zwei Originalverse
mit Quelle verwendet. Thomas Manns *Buddenbrooks* (1901) wird als Originallektüre
eines Literaturnobelpreisträgers verlinkt; Auszeichnung und Werkjahr wurden mit
der Nobel-Stiftung abgeglichen. Originallektüre und Quellen öffnen erst auf Klick.

Die App bereitet insbesondere folgende Leistungen vor, ersetzt sie aber nicht:

- Tatsächliches Zuhören, Vortragen, Diskutieren und Gesprächsführen mit
  Rückmeldung zu verbalen, nonverbalen und paraverbalen Mitteln.
- Gemeinsam inszenieren, eine tatsächliche Aufführung bewerten und die
  Darstellung nach Kritik überarbeiten.
- Eine geeignete Ganzschrift des 20. oder 21. Jahrhunderts lesen, weitere
  Leseerfahrungen dokumentieren sowie Originalstellen eines Nobelpreisträgers
  und tatsächliche Gegenwartsliteratur untersuchen.
- Zwei historische politische Gedichte oder Liedtexte im Kontext vergleichen.
  Die eigenen politischen Miniaturen sind keine historischen Dokumente.
- Einen tatsächlichen Film mit dem Original vergleichen, selbst recherchieren,
  längere Texte schreiben und Lehrkraftfeedback einholen.
- Persönliche Grammatik- und Rechtschreibschwerpunkte über mehrere eigene Texte
  verfolgen. Die Beispielsätze decken nicht alle Strukturen der Klasse 9 ab.

Die Einheit zur Erörterung erläutert Ordnungsmodelle. Sie erklärt das
Sanduhrmodell nicht zu einer amtlichen Pflicht für jede Abschlussprüfung.
Die App enthält keine übernommenen oder als amtlich ausgegebenen Prüfungsaufgaben.

## Zelle und bestehende Lernstände

`cell.json` ist die Kartenquelle: 30 Atome und 60 gezielte Wiederholungsfragen.
Jede Karte zitiert `https://academy.zam-os.org/deutsch-realschule-10/#lesson=<id>`.
Zehn weiche Voraussetzungsbeziehungen verlinken Grundlagen; sie blockieren
keine Lektion. Die offiziellen Bindungen verwenden Deutsch, Jahrgang 10,
Realschule und die zugehörigen Lernbereiche; die feinere Zuordnung steht in
der Abdeckungsmatrix.

Die neue Zelle **ergänzt** den Bestand. Sie enthält weder `replaces` noch
`retired_items`. Die vier alten Deutsch-10-Fragen bleiben unverändert.
Der [Bestandsabgleich](../docs/deutsch-10-bestandsabgleich.md) dokumentiert die
Abgrenzung. Es werden keine Lernstände anhand von Ähnlichkeit übertragen.

`scripts/card-ids.json` hält 90 einmal mit `ulid()` vergebene IDs.
`tests/fixtures/public-contract.json` pinnt diese und die 30 Lektionsanker.
Karteninhalte stehen ausschließlich in `cell.json`; der Lernpfad enthält keine
separate Wiederholungsfragenliste und keinen Kartengenerator. Tier 2 führt
seine Musterantwort als `sample_solution`, Tier 1 einen binären Schnellcheck.
Nach der ersten Veröffentlichung gelten stabile IDs, Slugs und Lektionsanker.

`replaces-de-by.json` dokumentiert vier C-Zeilen als `proposal-only`, mit
`approved: null`. Die bytegenaue Altzellenkopie ist mit Quellcommit und SHA-256
belegt. Ohne ausdrückliche spätere Freigabe findet keine Stilllegung oder
Übertragung statt.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5202/deutsch-realschule-10/
npm test
npm run typecheck
npm run package:zip  # Build, ZIP und Prüfung des Offline-Artefakts
```

Die vier bereits in der Academy verwendeten Entwicklungswerkzeuge und ihr
Lockfile-Stand stammen aus dem vorhandenen Biologie-10-Paket. Es wird keine
weitere Abhängigkeit eingeführt. Ein sauberer Checkout benötigt kein Nachbarpaket
für Tests oder Build.

Der Build erzeugt eine einzige HTML-Datei. Das ZIP enthält sie zusammen mit
Startdateien für Windows, macOS und Linux. Die App selbst braucht zur Laufzeit
keine Netzwerkressourcen. Quellen, die ergänzende externe Originallektüre und
externe Recherche brauchen eine Verbindung oder ein anderweitig vorliegendes
Original. Die Starter wurden hier nicht auf allen Zielsystemen ausgeführt; das Prüfskript kontrolliert Inhalt, HTML-Bytes und Shellsyntax.

Mit dem in der Academy-CI gepinnten veröffentlichten `zam-core@0.54.0`:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Die Prüfung nutzt ausschließlich eine temporäre Bibliothek. Vier alte Karten
mit acht echten Ratings bleiben bei wiederholter Installation und expliziter
Erzeugung aller 60 neuen Karten unverändert. Installation allein erzeugt keine
persönlichen Karten; neue Karten beginnen ohne Reviews oder Stabilität.

CI, Pages, der Atlas in `academy.json` und Katalog kennen das Paket. Veröffentlichung
und spätere Übernahme in ein ZAM-Release sind gesonderte Schritte. Gebündelte
Zellen in `zam-os/zam` werden hier nicht verändert.

## Fortschritt in mehreren Tabs

Die Stufenwahl bereinigt alte `?level`- und `#level`-Parameter; die gewählte
Stufe bleibt nach Neuladen erhalten. Beim Speichern werden nur ausdrückliche
lokale Änderungen in den neuesten Stand anderer Tabs übernommen. Bestätigungen
gelten für den tatsächlich verglichenen Text. Mit Web Locks ist der gesamte
Lesen-/Zusammenführen-/Schreiben-Schritt koordiniert. Ohne verfügbare Sperr-API
bleibt das Zusammenführen nutzbar, schützt aber nicht atomar vor überlappenden
Zugriffen. Ändern zwei Tabs denselben Text, gilt die zuletzt gespeicherte
Textänderung. Noch nicht abgeschickte Falländerungen ersetzen die letzte
geprüfte Fassung erst mit „Entscheidungen prüfen“.
