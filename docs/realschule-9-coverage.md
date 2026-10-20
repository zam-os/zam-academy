# Realschule Bayern · Abdeckung Klasse 9

Arbeitsstand: 20. Oktober 2026. Ziel: bis Ende dieser Woche die Inhalte der **9. Klasse** möglichst breit und fachlich belastbar am Lehrplan ausrichten. Diese Liste trennt vorhandene Pakete von tatsächlichem Lehrplanabgleich. Ein vorhandenes Teilpaket ist kein Beleg, dass alle Kompetenzen eines Fachs erfasst sind.

Bestandsbasis: ZAM 0.56.0, Commit `5a334c0c9050cf3590a036e7b451481462966d0e`; Academy-Hauptstand `8a7be89` einschließlich Geschichte; Geographie in diesem Branch. Der [Jahrgangsstufenüberblick des ISB](https://www.lehrplanplus.bayern.de/jahrgangsstufenprofil/realschule/9) ist der fachliche Einstieg. Einträge des ZAM-Lehrplanangebots allein belegen noch keine fertigen Lerninhalte.

## Stand und Prioritäten

| Fach / Angebot | Vorhanden | Nächster Abgleich / nächste Arbeit |
| --- | --- | --- |
| Physik | Academy, 21 Lektionen / 70 Karten; in ZAM gebündelt | Bestehende Zweigabdeckung bei Erweiterungen erhalten |
| Mathematik | Academy, 29 Lektionen / 108 Karten; in ZAM gebündelt | Bestehende Zweigabdeckung bei Erweiterungen erhalten |
| Chemie | Academy, 35 Lektionen / 77 Karten; Zweig I und II/III, ZAM 0.56.0 | Vorhandenen veröffentlichten Stand erhalten |
| Informationstechnologie / Informatik | Academy UML und SQL; zusätzlich alte Algorithmenzelle in ZAM | Bereits bearbeiteter Bestand; vollständigen jahrgangs- und modulabhängigen Umfang gegen das schulische IT-Angebot prüfen, nicht nur SQL/UML zählen |
| **Geschichte** | Academy gemergt: 35 Kernlektionen + 4 englische Vertiefungen / 78 Karten; vorher nur 4 Atome / 8 Karten zu Weimar/NS | Mapping am 20.10.2026 freigegeben; eigener ZAM-Folgeschritt noch offen |
| **Geographie** | Dieser Branch: 35 Kernlektionen, 7 englische Vertiefungen, 3 ergänzende Grundlagen / 91 Karten; vorher nur 4 Atome / 8 Karten | Alle sieben Pflichtbereiche mit [Abdeckungsmatrix](../geographie-realschule-9/coverage.json); Mapping-Freigabe (3 A / 1 B / 4 C) ausstehend, Academy zuerst, ZAM nach Merge |
| **Biologie** | Alte Teilzellen Genetik und Nervensystem/Sinne, 9 Atome / 18 Karten | Tatsächliche Klasse-9-Bereiche und Zweigunterschiede prüfen; fehlende Bereiche ergänzen, Inhalte ggf. korrekt neu zuordnen |
| **Deutsch** | Nur Teilzelle Argumentation/Erörterung, 4 Atome / 8 Karten | Lesen/Literatur, Schreiben, Sprechen/Zuhören, Sprache und Medien am Lehrplan abgleichen |
| **Englisch** | Nur Teilzelle Grammatik/Syntax, 4 Atome / 8 Karten | Sprachliche Mittel mit Lesen, Hören, Schreiben, Sprechen, Mediation und Themen verbinden; nicht Grammatik mit Fachabdeckung gleichsetzen |
| Französisch | Teilzelle Imparfait/Futur/Objektpronomen, 2 Atome / 4 Karten | Gewählten sprachlichen Zweig und kommunikative Kompetenzen ergänzen |
| BWR | Teilzelle Anlagenkauf/Abschreibung/Umsatzsteuer, 2 Atome / 4 Karten | Zweigangebot und gesamten Klasse-9-Umfang prüfen |
| Wirtschaft und Recht | Teilzelle Markt/Verträge, 4 Atome / 8 Karten | Aktuelle Fachbezeichnung, Klasse-9-Angebot und genaue Lehrplanzuordnung prüfen; nicht allein aus dem Altdateinamen ableiten |
| Ethik und Religionsangebote | Kein eigenes Academy-Paket im geprüften Bestand | Jeweiligen tatsächlich gewählten Lehrplan getrennt erfassen; keine austauschbaren Sammelkarten |
| Kunst, Musik, Sport, Werken, Textiles Gestalten, Ernährung und Gesundheit | Kein eigenes Academy-Paket im geprüften Bestand | Wissensanteile und fachpraktische Leistungen unterscheiden; praktische Kompetenzen nicht als durch Karten erledigt ausweisen |
| Sozialwesen/Soziallehre und weitere Wahlangebote wie Spanisch | Kein eigenes Academy-Paket im geprüften Bestand | Relevanz für Jahrgang und Schulangebot zuerst anhand des offiziellen Lehrplans prüfen |

Priorität nach dem aktuellen Geographie-Paket: Biologie → Deutsch/Englisch → Zweigfächer → weitere Pflicht- und Wahlangebote. Diese Reihenfolge bündelt zusammenhängende Lücken; sie ist kein Versprechen bereits abgeschlossener Fachreviews oder zukünftiger automatischer Veröffentlichungen.

## Geographie in diesem Branch

Der [aktuelle Geo9-Lehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/geographie) umfasst Landschaft/Naturrisiken, Klima/Klimawandel, Landwirtschaft/Ernährung/Boden, städtische Räume, Bevölkerung, Grenzen/Globalisierung sowie eine aktuelle Frage im Nahraum. Eine Unterrichts- oder Rechercheaufgabe zum eigenen Nahraum muss als solche erhalten bleiben; ein statischer Beispielsfall ersetzt kein aktuelles lokales Ereignis. Das optionale Bilingualangebot ergänzt diese Bereiche.

## Abschlussmaßstab je Paket

1. Lernbereiche und Kompetenzen mit aktuellem offiziellen Lehrplan abgleichen; Zweige und optionale Angebote sichtbar machen.
2. Verständnisaufgaben und Quellen liefern; fehlende außerschulische oder praktische Anteile offen benennen.
3. Jede alte Karte explizit zuordnen: sicher gleicher Abruf, vollständiger alter Gesamtumfang oder korrigierter/unsicherer Umfang ohne Beherrschungsübertrag.
4. Mit veröffentlichtem ZAM Kern vollständige Karten- und Reviewhistorien, Wiederholbarkeit und Kollisionsschutz prüfen.
5. Academy prüfen und veröffentlichen. Anschließend in ZAM synchronisieren, alte aktive Zellen ablösen und Lehrplanangebot/Tests ergänzen.

Eine Gesamtaussage „Klasse 9 vollständig abgedeckt“ ist erst nach diesem Abgleich pro tatsächlich angebotenem Fach sinnvoll. Bis dahin bleibt der Status fach- und bereichsbezogen.
