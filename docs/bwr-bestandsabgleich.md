# BwR 9 · Bestandsabgleich und freigegebene Lernstandsübernahme

Stand: 21. Oktober 2026. **Alle vier Zuordnungen (2 A / 2 C) sind von Thomas ausdrücklich freigegeben.** Seine Freigabe im Codex-Chat umfasst die Veröffentlichung des BwR-Pakets und die anschließende Integration in ZAM. Der vollständige Wortlaut und das Datum stehen in `replaces-de-by.json`.

## Fachliche Zuordnung

BwR wird in Jahrgang 9 ausschließlich in Wahlpflichtfächergruppe II angeboten. IIIa hat BwR in 7 und 8; in 9 folgt Wirtschaft und Recht. Maßgeblich sind der [Fachlehrplan BwR 9 II](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/bwl-rechnungswesen/wpfg2) und die [aktuelle ISB-Fachseite](https://www.isb.bayern.de/schularten/realschule/faecher/betriebswirtschaftslehre-rechnungswesen/).

Die vorhandene Teilzelle `de-by:realschule-9-bwr-anlagenkauf-abschreibung-umsatzsteuer`, Version `2026.08.1`, hat zwei Atome und vier Karten. Das erste Atom ist eine Umsatzsteuergrundlage, kein vollständiger Lernbereich von BwR 9. Das zweite behandelt nur einen Teil des Anlagenbereichs. Es gibt darin keine vollständige Abdeckung von Unternehmensführung, Finanzierung, Kapitalanlage oder Forderungsbewertung.

Das neue [Academy-Paket](../bwr-realschule-9/) hat 44 Kernlektionen und zwei optionale Grundlagenauffrischungen. Seine [Matrix](../bwr-realschule-9/coverage.json) ordnet alle 28 Kompetenzerwartungen der fünf Lernbereiche den Unterrichtsinhalten und Aufgaben zu. 88 Karten sind dem tatsächlichen Klasse-9-Lehrplan zugeordnet; vier Grundlagenkarten haben keine Pflichtstoffbindung. Die Praxismaßnahme, aktuelle Originalrecherche, Präsentation und längere Geschäftsgänge bleiben eigenständige Leistungen.

## Die vier konkreten Zuordnungen

Die vollständigen unveränderten Alttexte stehen im SHA-256-geprüften [Snapshot](../bwr-realschule-9/tests/fixtures/de-by-realschule-9-bwr-anlagenkauf-abschreibung-umsatzsteuer-kvt.json). `replaces-de-by.json` nennt ID, vollständige Altfrage, Kategorie, Zielslug und Begründung für jede Karte. Ähnlichkeit allein entscheidet keine Zuordnung.

| Alte Karte | Bisheriger Abruf | Freigegebene Zuordnung | Nachfolger und Begründung |
| --- | --- | --- | --- |
| `01K4W9A0000000000000000J01` | Welche Kontennatur hat 2600 Vorsteuer? | **A: übernehmen** | `bwr9-gr-vorsteuer-check`: identischer Einzelabruf, aktives Bestandskonto/Forderung an das Finanzamt. Die Lektion bleibt eine optionale Auffrischung. |
| `01K4W9A0000000000000000J02` | Umsatzsteuersystem erklären, Einkauf und Verkauf buchen, Zahllast/Überhang abrechnen | **C: ohne Übertrag neu beginnen** | Mehrere eigenständige neue Abrufe. Voraussetzungen des Vorsteuerabzugs werden ausdrücklich ergänzt; der aktuelle Kontenplan verwendet 4400 VE, der Alttext VLL. Kein einzelner Nachfolger deckt denselben Gesamtabruf. |
| `01K4W9A0000000000000000J03` | Jährliche lineare AfA einer Maschine für netto 60.000 Euro und fünf Jahre Nutzungsdauer? | **A: übernehmen** | `bwr9-an-linear-check`: unveränderte Zahlen und unveränderter einzelner Rechenschritt, 12.000 Euro pro Jahr. |
| `01K4W9A0000000000000000J04` | Ursachen, AfA-Formeln, Restbuchwert, Buchung und LKW-Plan für 80.000 Euro/vier Jahre | **C: ohne Übertrag neu beginnen** | Der Gesamtabruf wird in einzelne fachlich getrennte Fragen aufgelöst. Kein Verteilen einer vermeintlichen Teilbeherrschung auf die neuen Karten. |

Für A steht jeweils ein einzelnes `replaces` im freigegebenen Nachfolger. Die beiden C-IDs stehen in `retired_items`, ohne `replaces`. Alte Tokens werden nicht gelöscht. A-Karte und Reviewereignisse werden mit derselben Identität und unveränderten FSRS-Feldern auf genau den benannten Nachfolger umgebunden. C-Karten und Reviews bleiben beim alten Token; dieser wird aus der aktiven Wiederholung genommen. Neue Karten erhalten keine behauptete Beherrschung.

## Prüfung ohne persönliche Bibliothek

`bwr-realschule-9/scripts/validate-migration.mjs` verwendet die gepinnte veröffentlichte Kernversion 0.54.0 und ausschließlich wegwerfbare lokale Datenbanken. Der Test prüft:

1. Installation des unveränderten Altbestands, vier persönliche Karten und je zwei echte Ratingereignisse.
2. Vor der Migration sind die beiden C-Karten tatsächlich in einer fälligen Warteschlange; nach der Migration sind sie daraus entfernt.
3. Alle vier Karten-IDs, acht Review-IDs und vollständigen FSRS-/Reviewfelder bleiben erhalten; nur bei den beiden A-Zuordnungen ändert sich die Tokenbindung.
4. Installation allein nimmt keine neuen Karten auf. Bei ausdrücklicher Aufnahme entstehen 90 unbewertete neue Karten; zwei Karten werden wiederverwendet. Zusammen mit den zwei bewahrten ausgeschiedenen Historien existieren danach 94 persönliche Karten.
5. Wiederholte Installation und Aufnahme ändern weder Terminierung noch Ereignisse und erzeugen keine Duplikate.
6. Zwei bereits bewertete Historien auf Alt- und Nachfolgerkarte führen zu einem zurückgewiesenen automatischen Merge, beide bleiben unverändert.

Die App-Tests prüfen außerdem öffentlichen Vertrag, korrekte Zweigbindungen, 30 Rechenfamilien mit Varianten beider Niveaus, vollständige ausgeglichene Buchungen, Centgenauigkeit, Rechenmodelle und das Ausbleiben von Fortschritt nach bloßer Lösungsanzeige.

## Freigabe und Integration

`approved` hält das ausdrücklich freigegebene Datum `2026-10-21` fest. Die vorhandene Katalogprüfung verweigert weiterhin die Veröffentlichung von Zellen mit ungeprüften `replaces` oder `retired_items`; diese Sperre wurde nicht abgeschwächt.

Die beauftragte Veröffentlichung erfolgt über Academy-CI und Pages. ZAM übernimmt die veröffentlichten Bytes anschließend ausschließlich über `academy:sync`, ergänzt das Lehrplanangebot für Zweig II und entfernt die alte Teilzelle aus dem aktiven Angebot. Der unveränderte Altbestand bleibt als Migrationsfixture in `tests/fixtures/legacy/` erhalten. Die Integrationsprüfungen erhalten Karten und Reviews, kontrollieren Wiederholbarkeit und verweigern einen automatischen Merge konkurrierender Historien.
