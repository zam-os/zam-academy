# Physik 10 Realschule · ZAM Academy

Physik für die 10. Klasse Realschule Bayern nach LehrplanPLUS, mit eigener Zweigauswahl: **34 Kernlektionen für I**, **25 für II/III**, insgesamt 35 unterschiedliche Kernlektionen. Eine weitere, ausdrücklich optionale Lektion erklärt den Effektivwert einer Sinusspannung. Veröffentlichung nach Merge unter https://academy.zam-os.org/physik-realschule-10/.

## Lernen

Vier Lernbereiche verbinden fachliche Erklärungen, Schnellchecks, Zuordnungs- oder Reihenfolgewerkstätten und eigene Begründungen:

1. **Mechanik:** Zeit-Ort-Diagramme, mittlere und momentane Geschwindigkeit, Beschleunigung, freier Fall, resultierende Kraft, kinetische Energie und Anhalteweg; in I zusätzlich Impuls und zentrale elastische, teilelastische und vollständig inelastische Stöße.
2. **Elektrizitätslehre:** Reihe und parallel, Induktion, Lenz und Wirbelströme, Generatorbauformen, Transformator, Wirkungsgrad und Fernleitung; in I zusätzlich reale Messgeräte, Messbereichserweiterung und UVW-Regel für Elektronen.
3. **Atom- und Kernphysik:** Entdeckung, Kernmodell, Strahlungsarten, Nachweise, Kernumwandlungen, Halbwertszeit und Nutzen/Risiken; in I zusätzlich Quarks, Zerfallsgesetz und Aktivität, Massendefekt, Spaltung/Fusion/Kettenreaktion und Dosisgrößen.
4. **Energieversorgung:** Umwandlungsketten, Energieträger, KWK und GuD, Speicher, Transport und datierte Quellenurteile; in II/III zusätzlich Wärmekraftmaschinen, Otto-/Dieselprinzip und Turbinen.

Zehn veränderbare Modelle machen Bewegung, Stoß, Schaltung, Induktion, Generator, Transformator, Zerfall, Kernumwandlung, Kraftwerksbilanz und Speicherung vergleichbar. Jede Ansicht benennt ihre Annahmen. Die kontinuierliche Zerfallskurve und ein reproduzierbarer diskreter Zufallsdurchlauf bleiben unterscheidbar; eine überschrittene Speicherleistungsgrenze liefert keine erfundene Laufzeit.

23 Arten von Rechenaufgaben erzeugen wiederholbare Varianten. Level 1 bietet eine aufklappbare Formelhilfe, Level 2 eine neue Anwendung oder umgekehrte Fragestellung. Der Prüfer akzeptiert Dezimalkomma, Dezimalpunkt, typografisches Minus und passend gerundete Ergebnisse. Pro Rechenlektion werden drei Aufgaben in Level 1 selbst gelöst. Eine zuvor geöffnete Lösung zählt nicht als gelöst; sie verbraucht den gespeicherten Versuch vor der Anzeige, sodass auch ein Neuladen eine neue Aufgabe erhält. Derselbe Versuch kann den Zähler nur einmal erhöhen.

Eine Lektion zählt erst nach Schnellcheck, Werkstatt und eigener anhand von drei Kriterien eingeschätzter Begründung als abgeschlossen; gegebenenfalls auch nach allen benannten Modellvergleichen und drei Rechenaufgaben. Die Begründung wird **nicht automatisch bewertet**. Level 2 ist zusätzliche Vertiefung. Zweigwechsel bewahrt alle Einträge; nur die Kernlektionen des ausgewählten Zweigs zählen zum Fortschritt. Die Zusatzlektion erhöht dessen Nenner nicht. Ein Kartenlink öffnet auch eine Lektion eines anderen Zweigs oder eine Zusatzlektion. Dabei bleiben der gewählte Zweig, der Fortschrittsnenner und der Zusatzfilter erhalten; die Lektion zeigt einen entsprechenden Hinweis.

## Echte Experimente und Quellenarbeit

Der Lehrplan fordert insgesamt mindestens drei Schülerexperimente, darunter mindestens eines in Mechanik und eines in Elektrizitätslehre. **Simulationen erfüllen das nicht.** Das lokale Versuchsnotizbuch hat drei frei auf diese beiden Bereiche verteilbare Einträge mit Frage, Aufbau, Messdaten und Auswertung. „Selbst durchgeführt“ ist eine eigene Angabe; die App prüft nur, ob Felder ausgefüllt sind, und bestätigt keine Durchführung oder Qualität. Geräte und Versuchsanleitung gehören in den Unterricht. Eigene Quellenrecherche und Präsentationen werden ebenfalls nicht durch ein App-Abzeichen ersetzt.

Die [Abdeckungsmatrix](../docs/physik-10-coverage.md) nennt die Lektionen zu den Kompetenzen beider Zweige. Alle Texte und Übungswerte sind eigens verfasst; keine externen Grafiken oder Datensätze werden eingebunden. Fachquellen stehen neben den Lektionen und öffnen ausschließlich auf Klick. Es gibt keine Konten, Telemetrie, KI-Aufrufe oder externen Laufzeitanfragen. Fortschritt, Begründungen und Versuchsnotizen bleiben in `localStorage`; bei gesperrtem Speicher funktioniert die App im Arbeitsspeicher mit einer sichtbaren Hinweismeldung.

## ZAM und vorhandene Lernstände

`cell.json` ist der einzige Ort der **72 Wiederholungskarten**: 70 zu den Kernlektionen, zwei zum optionalen Effektivwert. Jede Karte verweist auf `#lesson=<id>`; die Tests pinnen alle 36 öffentlichen Anker. Formeln stehen in strukturierten Math-Segmenten mit gesprochenem Text. Kernatome besitzen die passende Lehrplanbindung für Jahrgang 10, Lernbereich und Zweig; die Zusatzlektion besitzt keine Pflichtstoffbindung. Der Zweigfilter wirkt auf die App, nicht auf die Aufnahme der gesamten Zelle in ZAM.

`replaces-de-by.json` dokumentiert die **am 21. Oktober 2026 ausdrücklich von Thomas freigegebene Lernstandsübernahme** für die beiden bisherigen Physik-10-Zellen: sieben gleiche Einzelabrufe haben genau einen Nachfolger, neun geteilte oder fachlich korrigierte Gesamtfragen übertragen keinen Lernstand. Die entsprechenden `replaces` und `retired_items` stehen in der Zelle. Der Katalogbau prüft ein gültiges Freigabedatum bei jeder Zelle mit `replaces` oder `retired_items` und blockiert sonst. CI und der vorgezogene Pages-Schritt rufen diese Prüfung auf; die Physik-10-Freigabe ist in `approved` festgehalten. [Die Matrix erläutert jede Altfrage](../docs/physik-10-coverage.md#lernstandsübernahme).

Der Migrationstest verwendet ausschließlich temporäre Bibliotheken mit dem in CI gepinnten veröffentlichten `zam-core`. Er prüft alle 16 Altkarten und 32 Review-Ereignisse, unveränderte FSRS-Felder, neun erhaltene ausgeschiedene Historien, 65 unbewertete neue Karten, wiederholte Installation/Aufnahme sowie das Zurückweisen eines Konflikts zweier bereits vorhandener Historien. Er öffnet keine persönliche Bibliothek.

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5188/physik-realschule-10/
npm test
npm run typecheck
npm run build
npm run package:zip  # Single-file-App und Offline-Launcher in release/
```

Vom Repository-Stamm: `ZAM_CORE=<file-URL des gepinnten zam-core> node physik-realschule-10/scripts/validate-migration.mjs`. Die gemeinsame CI prüft zusätzlich alle Zellen und den Katalog. Dieselben vorhandenen Entwicklungsabhängigkeiten wie in den bisherigen Academy-Apps; keine zusätzliche Bibliothek.

## Quellen

Lehrplanabgleich und Quellenprüfung: 21. Oktober 2026. Die vollständige Quellenliste mit Links steht in `src/curriculum/sources.ts` und in der App unter „Nachschlagen“. Ausgangspunkt sind [LehrplanPLUS I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/physik/wpfg1) und [II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/physik/wpfg2-3), ergänzt durch OpenStax College Physics 2e, CERN, den BfS-Grundlagenbericht sowie das Umweltbundesamt.
