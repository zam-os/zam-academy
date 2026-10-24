# Englisch 9 · Bestandsabgleich und lokaler Entwurf

Stand: 24. Oktober 2026. Das Paket [Englisch 9 Realschule](../englisch-realschule-9/) ergänzt das Academy-Angebot lokal um 36 Kernlektionen, vier freiwillige Grammatikergänzungen und 80 Karten. Es ist noch nicht veröffentlicht oder in ZAM synchronisiert. Die bestehende ZAM-Teilzelle bleibt unverändert.

## Lehrplanbezug

Grundlage ist der [aktuelle offizielle Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/englisch), geprüft am 24. Oktober 2026. Die [Matrix](../englisch-realschule-9/coverage.json) verknüpft alle Kernlektionen mit den Kompetenz- und Themenbereichen. Sie unterscheidet unterstützte Übung von zusätzlich nötiger Praxis.

Der alte Dateiname Grammatik/Syntax beschreibt keine vollständige Fachabdeckung. Der neue Pfad verbindet berufliche Orientierung, Indien, Australien, digitale Medien und Literatur mit Lesen, Schreiben, Sprechen, Hören, Sprachmittlung und Methoden. Die Sprachwerkstatt berücksichtigt insbesondere indirekte Fragen und Aufforderungen, used to/be used to und so/neither/nor. Conditionals, Passiv und Relativsätze bleiben ergänzende Wiederholung/Vertiefung ohne eigene E9-Pflichtbindung.

Natürliche Hör- und Hörsehtexte, australische Varietäten, mündliche Leistung mit realen Gesprächspartnern, umfassender Jahreswortschatz und längere Lektüre bleiben zusätzlich zu üben. Die App liest zwei eigene Skripte nur mit lokalen englischen Computerstimmen vor oder bietet Partner-Vorlesen an. Aussprache und Flüssigkeit werden nicht bewertet. Aktuelle Recherche und der Originaltext-/Aufführungsvergleich sind echte Arbeitsaufträge; ihre Muster enthalten keine fertigen Ergebnisse. Die Matrix ist kein Beherrschungsnachweis und keine abgeschlossene unabhängige Fachprüfung.

## Acht alte Karten einzeln geprüft

Die bytegleiche Originaldatei liegt unter [tests/fixtures](../englisch-realschule-9/tests/fixtures/de-by-realschule-9-englisch-grammatik-syntax-kvt.json). Ihre Prüfsumme und die vollständigen alten Fragen stehen in [replaces-de-by.json](../englisch-realschule-9/replaces-de-by.json). A bezeichnet denselben Einzelabruf; C einen korrigierten oder mehrteiligen Umfang ohne sicheren Gesamtnachfolger.

| Alte Karte, Endung | Vorschlag | Neuer Einzelabruf / Begründung |
| --- | --- | --- |
| J01 | A | `e9-conditionals-check`: derselbe Typ-III-Lückensatz, Ergebnis would have passed |
| J02 | C | Drei Typen mit Regeln und Beispielen; keine neue Einzelkarte bewahrt den gesamten alten Abruf |
| J03 | A | `e9-passive-check`: derselbe Shakespeare-Satz im simple past passive |
| J04 | C | Fehlerhafte Subjekt-/Objektregel und Vermischung von Passivumformung mit Wechsel von Tempus/Aspekt |
| J05 | A | `e9-reported-statements-check`: derselbe Tom-Satz, ausdrücklicher Backshift zu had lost |
| J06 | C | Sammelabruf über mehrere Tempora, Pronomen und Zeit-/Ortsbezüge; keine mechanische Änderung bei unverändertem Kontext |
| J07 | C | Alte Antwort beschränkt nicht-bestimmende Relativsätze unzutreffend auf who/which; whose, when und where sind ebenfalls möglich |
| J08 | C | Mehrteiliger Vergleich und teils falsche Musterlösung; neue Einzelabrufe sind kein sicherer Gesamtnachfolger |

Die Kartensprache wird korrekt als Englisch bezeichnet; die alte Datei beschriftet englische Fragen mit `de`. Das allein wird nicht als semantischer Unterschied behandelt. Die A-Vorschläge bewahren jeweils Frageziel und Antwort. C-Fälle bleiben aktiv und erhalten in diesem Entwurf weder Übertragung noch Ablösung. Es wird keine Beherrschung auf mehrere Teilfragen verteilt.

**Die konkrete Zuordnung ist nicht freigegeben.** `approved: null`, keine `replaces`, keine `retired_items`. Es wurde keine persönliche Bibliothek geöffnet oder verändert. Eine spätere freigegebene Änderung muss die konkrete Zuordnung übernehmen und Version sowie Integrationsstand gemeinsam aktualisieren.

## Prüfung

- `npm --prefix englisch-realschule-9 test`: 142 Pakettests prüfen Inhalte, Kurzaufgaben, Lektionslinks, offizielle Bindungen, getrennten Kernfortschritt, Speicherung, erneuten Mustervergleich, lokale Stimmen und den unveränderten Altbestand.
- Typecheck, Vite-Build und Offline-ZIP laufen mit den vorhandenen Academy-Werkzeugen.
- `scripts/validate-migration.mjs` prüft den unveränderten Entwurf und eine ausschließlich im Speicher erzeugte A-Probe gegen veröffentlichtes zam-core 0.54.0 in Wegwerfbibliotheken: acht vollständige Kartenstände und 16 Reviewereignisse, frische unbewertete Karten, Wiederholbarkeit und Kollisionsschutz.
- Academy-Katalogtests und die Installation aller Academy-Zellen bleiben grün.

Die gebaute Fassung (`npm run build`, anschließend `npm run preview -- --host 127.0.0.1 --port 5198`) wurde im Browser geprüft: alle 40 Lektionsanker jeweils auf Level 1 und 2 in hellem und dunklem Farbschema (160 aufgerufene Ansichten mit Erklärung, Kurzaufgaben und eigener Antwort), Lernpfad und Referenzansicht. Eine vollständig durchgespielte Lektion prüft zusätzlich Schnellcheck, drei Kurzantworten, eigenen Text, Mustervergleich und erhaltenen Fortschritt nach Neuladen. Diese Prüfung bestätigt Darstellung und Bedienbarkeit, keine fachliche Vollständigkeit oder Sprechleistung. Die Veröffentlichung folgt einem späteren Merge. Die Freigabe der konkreten Altzuordnungen und die ZAM-Synchronisierung bleiben getrennte weitere Schritte.

Die 41 Kompetenz-/Themenzeilen in `coverage.json` verwenden redaktionelle Kurzfassungen mit Quellenverweis, keine vollständige Abschrift des amtlichen Wortlauts. Die Nachbarjahrgänge E8 und E10 wurden am 24. Oktober 2026 gegengeprüft. Eine unabhängige fachliche Zweitprüfung bleibt vor dem Merge offen.
