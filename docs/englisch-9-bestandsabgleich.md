# Englisch 9 · Bestandsabgleich und Academy-Paket

Stand: 24. Oktober 2026. Das Paket [Englisch 9 Realschule](../englisch-realschule-9/) ergänzt das Academy-Angebot um 36 Kernlektionen, vier freiwillige Grammatikergänzungen und 80 Karten. App und eigenständige Zelle werden beim Merge über Pages und den Academy-Katalog veröffentlicht. Die Übernahme in den gebündelten ZAM-Bestand erfolgt mit einer gesonderten Synchronisierung in zam-os/zam. Die bestehende ZAM-Teilzelle bleibt unverändert.

## Lehrplanbezug

Grundlage ist der [aktuelle offizielle Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/englisch), geprüft am 24. Oktober 2026. Die [Matrix](../englisch-realschule-9/coverage.json) verknüpft alle Kernlektionen mit den Kompetenz- und Themenbereichen. Sie unterscheidet unterstützte Übung von zusätzlich nötiger Praxis.

Der alte Dateiname Grammatik/Syntax beschreibt keine vollständige Fachabdeckung. Der neue Pfad verbindet berufliche Orientierung, Indien, Australien, digitale Medien und Literatur mit Lesen, Schreiben, Sprechen, Hören, Sprachmittlung und Methoden. Die Sprachwerkstatt berücksichtigt insbesondere indirekte Fragen und Aufforderungen, used to/be used to und so/neither/nor. Conditionals, Passiv und Relativsätze bleiben ergänzende Wiederholung/Vertiefung ohne eigene E9-Pflichtbindung.

Natürliche Hör- und Hörsehtexte, australische Varietäten, mündliche Leistung mit realen Gesprächspartnern, umfassender Jahreswortschatz und längere Lektüre bleiben zusätzlich zu üben. Die App liest zwei eigene Skripte nur mit lokalen englischen Computerstimmen vor oder bietet Partner-Vorlesen an. Aussprache und Flüssigkeit werden nicht bewertet. Aktuelle Recherche und der Originaltext-/Aufführungsvergleich sind echte Arbeitsaufträge; ihre Muster enthalten keine fertigen Ergebnisse. Die Matrix ist kein Beherrschungsnachweis und keine abgeschlossene unabhängige Fachprüfung.

## Acht alte Karten einzeln geprüft

Die bytegleiche Originaldatei liegt unter [tests/fixtures](../englisch-realschule-9/tests/fixtures/de-by-realschule-9-englisch-grammatik-syntax-kvt.json). Ihre Prüfsumme und die vollständigen alten Fragen stehen in [replaces-de-by.json](../englisch-realschule-9/replaces-de-by.json). A bezeichnet denselben Einzelabruf; C einen korrigierten oder mehrteiligen Umfang ohne sicheren Gesamtnachfolger.

| Alte Karte, Endung | Freigegebene Kategorie | Neuer Einzelabruf / Begründung |
| --- | --- | --- |
| J01 | A | `e9-conditionals-check`: derselbe Typ-III-Lückensatz, Ergebnis would have passed |
| J02 | C | Drei Typen mit Regeln und Beispielen; keine neue Einzelkarte bewahrt den gesamten alten Abruf |
| J03 | A | `e9-passive-check`: derselbe Shakespeare-Satz im simple past passive |
| J04 | C | Fehlerhafte Subjekt-/Objektregel und Vermischung von Passivumformung mit Wechsel von Tempus/Aspekt |
| J05 | A | `e9-reported-statements-check`: derselbe Tom-Satz, ausdrücklicher Backshift zu had lost |
| J06 | C | Sammelabruf über mehrere Tempora, Pronomen und Zeit-/Ortsbezüge; keine mechanische Änderung bei unverändertem Kontext |
| J07 | C | Alte Antwort beschränkt nicht-bestimmende Relativsätze unzutreffend auf who/which; whose, when und where sind ebenfalls möglich |
| J08 | C | Mehrteiliger Vergleich und teils falsche Musterlösung; neue Einzelabrufe sind kein sicherer Gesamtnachfolger |

Die Kartensprache wird korrekt als Englisch bezeichnet; die alte Datei beschriftet englische Fragen mit `de`. Das allein wird nicht als semantischer Unterschied behandelt. Die A-Zuordnungen bewahren jeweils Frageziel und Antwort. Die fünf C-Fälle verlassen mit `retired_items` die aktive Wiederholung; ihre Karten- und Reviewhistorien bleiben ohne Beherrschungsübertrag erhalten. Es wird keine Beherrschung auf mehrere Teilfragen verteilt.

**Die konkrete Zuordnung ist freigegeben.** Thomas schrieb am 24. Oktober 2026 in diesem Codex-Chat zu PR #38 nach den Reviews: „Freigabe erteile ich“. `replaces-de-by.json` hält Datum, Wortlaut und Ort der Freigabe fest (`approved: 2026-10-24`, `status: approved`). Die Zelle `2026.10.2` deklariert genau drei `replaces` und fünf `retired_items` gemäß der Tabelle. Es wurde keine persönliche Bibliothek geöffnet oder verändert. Die Synchronisierung in den gebündelten ZAM-Bestand folgt der Academy-Veröffentlichung als eigener Schritt.

## Prüfung

- `npm --prefix englisch-realschule-9 test`: 163 Pakettests prüfen Inhalte, Kurzaufgaben, Lektionslinks, offizielle Bindungen, getrennten Kernfortschritt, Speicherung, erneuten Mustervergleich, zusammengeführte Fortschritte mehrerer Tabs, getrennte Hörnachweise, verzögert geladene lokale Stimmen und den unveränderten Altbestand.
- Typecheck, Vite-Build und Offline-ZIP laufen mit den vorhandenen Academy-Werkzeugen.
- `scripts/validate-migration.mjs` prüft die tatsächliche freigegebene Zelle gegen veröffentlichtes zam-core 0.54.0 in Wegwerfbibliotheken: Erstinstallation, Upgrade einer vorherigen Fassung ohne Zuordnung, acht vollständige Kartenstände und 16 Reviewereignisse, frische unbewertete Karten, Wiederholbarkeit und Kollisionsschutz. Tokenstatus und `buildReviewQueue` belegen vor/nach der Installation: drei A-Karten wechseln zum Nachfolger, fünf C-Karten verlassen aktive Wiederholungen, alle acht Kartenstände und 16 Reviewereignisse bleiben erhalten. Eine Vergleichsprobe der vorherigen Fassung lässt alle acht Altkarten aktiv.
- Academy-Katalogtests und die Installation aller Academy-Zellen bleiben grün.

Die gebaute Fassung (`npm run build`, anschließend `npm run preview -- --host 127.0.0.1 --port 5198`) wurde im Browser geprüft: alle 40 Lektionsanker jeweils auf Level 1 und 2 in hellem und dunklem Farbschema (160 aufgerufene Ansichten mit Erklärung, Kurzaufgaben und eigener Antwort), Lernpfad und Referenzansicht. Eine vollständig durchgespielte Lektion prüft zusätzlich Schnellcheck, drei Kurzantworten, eigenen Text, Mustervergleich und erhaltenen Fortschritt nach Neuladen. Nach den Review-Korrekturen erneut geprüft: alle 160 Ansichten, Hinweise ohne Lösung nach Fehlversuchen, Entwurfsabgleich zwischen zwei Tabs, Verwerfen des alten Mustervergleichs nach einer Textänderung im anderen Tab, die ZAM-Aufnahmeanfrage sowie eine vollständig vorgelesene lokale Computerstimme, deren Hörnachweis nach Partnerhäkchen an/aus und Neuladen erhalten bleibt. Diese Prüfung bestätigt Darstellung und Bedienbarkeit, keine fachliche Vollständigkeit oder Sprechleistung. Die Veröffentlichung folgt einem späteren Merge. Die Altzuordnung wurde anschließend am 24. Oktober 2026 freigegeben und in der Zelle hinterlegt. Nach dieser Änderung wurden die drei betroffenen Lektionslinks auf beiden Stufen und der aktualisierte ZAM-Dialog erneut in der gebauten Fassung geprüft; Karteninhalte, IDs, Slugs und Lektionsanker sind unverändert. Die ZAM-Synchronisierung bleibt ein weiterer Schritt.

Die 41 Kompetenz-/Themenzeilen in `coverage.json` verwenden redaktionelle Kurzfassungen mit Quellenverweis, keine vollständige Abschrift des amtlichen Wortlauts. Die Nachbarjahrgänge E8 und E10 wurden am 24. Oktober 2026 gegengeprüft. Eine unabhängige didaktische Fachprüfung bleibt offen; die zwei PR-Reviews prüfen Paketstandard, Technik und Lehrplanzuordnung. Die eigene kurze Übungsgeschichte ersetzt keine bearbeitete englischsprachige Ganzschrift oder die weitere Autorenauswahl.
