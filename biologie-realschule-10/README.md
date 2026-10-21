# Biologie 10 · Realschule Bayern

Ein gemeinsamer Lernpfad für alle Wahlpflichtfächergruppen nach dem [LehrplanPLUS Biologie 10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/biologie), abgeglichen am **21. Oktober 2026**. Die [Abdeckungsmatrix](coverage.json) ordnet Lernangebote den Kompetenzen und Inhalten zu.

## Umfang

| Angebot | Lektionen | Inhalt |
| --- | ---: | --- |
| Lernbereich 1 | 5 | Beobachten, Untersuchungen planen, Modelle und Wissenschaftsgeschichte, Quellen und Darstellungen, begründete Urteile |
| Lernbereich 2 · ca. 20 Std. | 18 | Genetik: DNA, Karyogramm, Proteinbiosynthese, Teilungen, Mendel, Stammbäume, Mutationen, Krankheiten, PCR, Gentechnik, Stammzellen und Züchtung |
| Lernbereich 3 · ca. 8 Std. | 7 | Ökosysteme, Stoffkreislauf und Energiefluss, Stoffeinträge, lokale Veränderungen, Artenvielfalt, Schutz und Ökobilanz |
| Lernbereich 4 · ca. 8 Std. | 7 | Entwicklung und Vorsorge, Pränataldiagnostik, Einflüsse, Elternschaft, biologische/ethische/rechtliche Perspektiven, IVF/PID, Beziehungen und Erziehung |
| Ergänzendes Vorwissen Klasse 7 | 4 | Nervensystem, Reflexe und Synapsen |
| Ergänzendes Vorwissen Klasse 8 | 5 | Evolution, Homologie, Fossilien und menschliche Stammesgeschichte |

Die **37 Kernlektionen** bilden den Fortschrittszähler. Die neun Auffrischungen sind in der App standardmäßig ausgeblendet und können separat zugeschaltet werden; direkte Kartenlinks öffnen sie ebenfalls. Sie tragen **keine offizielle Lehrplanbindung** dieser Zelle. Die App erklärt ihre Herkunft aus Biologie 7 bzw. 8 und beansprucht keine vollständige Abdeckung dieser Jahrgänge.

Biologie ist in der regulären bayerischen Realschul-Stundentafel in Klasse 9 in keiner Wahlpflichtfächergruppe vorgesehen ([RSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1)). Die falsch bezeichneten Altzellen sind deshalb keine Vorlage für einen erfundenen Biologie-9-Lehrplan. Näheres im [Bestandsabgleich](../docs/biologie-bestandsabgleich.md).

## Üben und untersuchen

Jede Lektion verbindet einen eigens verfassten Erklärungstext, einen Schnellcheck, eine Zuordnungs- oder Ablaufwerkstatt und zwei unterschiedliche Schreibaufgaben. **Level 1** bietet Leitfragen und einen Kriterienvergleich; **Level 2** verlangt Transfer. Eigene Texte werden nicht automatisch als richtig beurteilt. Eine Selbsteinschätzung braucht einen Text und alle drei Kriterien; bei Überarbeitung wird sie zurückgenommen.

Sechs digitale Modelle erklären Basenpaarung, Chromosomenzählung, mono-/dihybride Kreuzungen, den Standardcode, einen Stoffkreislauf mit Speicher und Rückkopplung sowie die Unterscheidung von Trefferquote und Aussage eines positiven Tests. Zahlen und Schwellen des Ökosystem- und Screeningmodells sind ausdrücklich **erfundene Lernparameter**, keine Messwerte oder Angaben zu realen Gewässern bzw. Untersuchungen. Die Grenzen stehen unmittelbar beim jeweiligen Modell.

Ein lokaler **Ökosystembogen** begleitet Frage, Belege, historisch-heutigen Vergleich, Urteil und Präsentation. Er verlangt zwei verschiedene öffentliche Quellenadressen und passende Datierungen, ruft sie aber nicht ab. Inhalt, Vergleichbarkeit und Unabhängigkeit werden von Lernenden und Unterricht geprüft. Es werden keine persönlichen Familien-, Gesundheits- oder Schwangerschaftsdaten verlangt.

Reales Mikroskopieren, eigene kontrollierte Experimente und die gemeinsame Präsentation bzw. Diskussion bleiben Unterrichtsaufgaben. Ein digitaler Abschluss bescheinigt keine praktische Fertigkeit oder vollständige fachliche Beherrschung.

## ZAM-Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **46 Atome, 93 Karten**. 74 Karten gehören zu Kernlektionen, 18 zum ergänzenden Vorwissen und eine Karte erhält einen vollständigen früheren DNA-Gesamtabruf. Die Aufnahme der **ganzen Zelle** umfasst auch die Zusatzkarten; die Schalter filtern den Lernpfad in der App. Jeder Kartenlink führt zu `https://academy.zam-os.org/biologie-realschule-10/#lesson=<id>`.

Die drei alten Zellen liegen bytegleich mit SHA-256-Prüfsummen unter `tests/fixtures/`. [replaces-de-by.json](replaces-de-by.json) ordnet **jede der 26 alten Karten** ausdrücklich zu:

| Kategorie | Anzahl | Umgang |
| --- | ---: | --- |
| A | 10 | Sicher gleicher einzelner Abruf mit genau einem erklärten `replaces`-Nachfolger |
| B | 1 | Vollständiger DNA-Gesamtabruf; Frage, Kurzantwort und Musterlösung bleiben wortgleich auf einer eigenen Karte |
| C | 15 | Fachlich korrigierter oder unsicherer Umfang ohne Beherrschungsübertrag; alte Karten und sämtliche Reviews bleiben erhalten, `retired_items` nimmt die alten Texte aus aktiven Wiederholungen |

**Thomas hat dieses konkrete Mapping am 21. Oktober 2026 freigegeben** (`approved` in der Mappingdatei). Freigaben anderer Fächer gelten nicht für Biologie. Zeilenweise Begründungen und genaue Vorgänger stehen in der Mappingdatei.

Der Migrationstest erzeugt in ausschließlich temporären Bibliotheken für alle 26 Altfragen echte Karten mit je zwei Ratings. Er vergleicht sämtliche Kartenfelder und alle **52 Review-Ereignisse**, prüft die elf vollständigen Umzüge und 15 unveränderten stillgelegten Historien, wiederholte Installation sowie die Ablehnung einer automatischen Zusammenführung zweier vorhandener Karten. Installieren allein erzeugt keine neuen Karten. Die anschließende ausdrückliche Aufnahme ergänzt 82 frische Karten ohne gelernte Stabilität und lässt die elf übernommenen sowie 15 stillgelegten Historien unverändert; erneute Aufnahme erzeugt keine Duplikate.

## Entwickeln und prüfen

```sh
npm ci
npm run dev             # Port 5187
npm test
npm run build
npm run package:zip
```

Die Werkzeuge entsprechen den vorhandenen Academy-Apps; es werden keine zusätzlichen Abhängigkeiten eingeführt. Zellinstallation und Migration werden außerdem mit dem in der CI fest gepinnten veröffentlichten ZAM-Kern geprüft:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-migration.mjs
```

Die CI testet alle Apps und den Katalog. Pages veröffentlicht nach dem freigegebenen Merge die App, `cell.json` und den Katalog. Erst danach wird das Paket in einem eigenen ZAM-PR synchronisiert und werden die drei alten aktiven Zellen abgelöst. Die unabhängige Fixture `public-contract.json` schützt IDs, Slugs und Lektionenanker ab der ersten Veröffentlichung.

Alle Erklärungstexte und Übungsfälle sind eigens verfasst; die Quellen dienen zum fachlichen Prüfen und Weiterlernen. Fremde Bilder oder Textpassagen werden nicht eingebunden. Fortschritt und Texte bleiben im jeweiligen Browser; bei gesperrtem Speicher bleibt die App für die Sitzung nutzbar.
