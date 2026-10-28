# Deutsch 8 · Realschule Bayern

**40 Lektionen, 80 Fallentscheidungen, 80 Schreibaufgaben auf zwei Niveaus
und 80 ZAM-Karten** als neues Academy-Paket. Die Lern-App
verbindet verständliche Erklärungen, konkrete Materialien, Schnellchecks,
begründete Entscheidungen und eigene Texte. Sie funktioniert ohne Konto und
speichert Entwürfe und Fortschritt nur im jeweiligen Browser.

| Lernbereich | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| Sprechen und Zuhören | 6 | Mitschrift, Gespräch, Vortrag, Debatte, Interview, Szene |
| Lesen, Literatur und Medien | 12 | Lesestrategien, Bericht/Reportage, Daten, Zeitung, Quellen, Medienwirkung; Figuren, Erzähltechnik, Lyrik, Aufklärung, Goethe, Lesejournal |
| Schreiben und Argumentieren | 13 | Protokoll, Inhaltsangabe, Zitat, Untersuchung, Bildimpuls, Rollenbrief, Kurzbewerbung; Argumente, Belege, Gegengründe, Gliederung, Leserbrief, Beschwerde |
| Sprache untersuchen und reflektieren | 9 | Varietäten/Fremdwörter, Konjunktiv I/II, Satzbau, Wortarten, Satzverdichtung, Rechtschreibung, Kommas, Überarbeitung |

Grundlage ist der gemeinsame [LehrplanPLUS Deutsch 8 der Realschule
Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/deutsch),
abgeglichen am **28. Oktober 2026**. [coverage.json](coverage.json) ordnet alle
59 Erwartungen der 14 Abschnitte konkreten Lektionen und zusätzlichen
Leistungen zu. Die knappen Themenbezeichnungen sind keine amtlichen Zitate.
Die Matrix verwendet das gemeinsame Schema mit `curriculum` und `rows` sowie je Zeile
`lb`, `competence`, `lessons` und `evidence`. `section` und `position` verweisen auf die
wortgetreuen Erwartungen in `tests/fixtures/official-curriculum.json`, ohne amtliche
Unterpunktnummern zu erfinden. Der gemeinsame Fachlehrplan gilt für alle
Wahlpflichtfächergruppen und nennt keine Stundenkontingente. Die Nachbarjahrgänge 7 und
9 wurden zur Abgrenzung mitgelesen.
`guided` bezeichnet eine begrenzte geführte Übung, `preparation` eine
Vorbereitung auf zusätzliche Praxis. Keine Zuordnung behauptet einen
vollständigen Kompetenznachweis.

## Eigene Texte und Fortschritt

Level 1 übt Anwendung; Level 2 verlangt Vergleich, Transfer, Entwurf oder
begründetes Urteil. Beide Niveaus haben getrennte Entwürfe und Abschlüsse.
Eine Lektion zählt auf der gewählten Stufe als bearbeitet, wenn der
Schnellcheck und beide Fälle richtig sind und die lernende Person den eigenen
Text mit einem Muster verglichen, drei Kriterien geprüft und den Vergleich
bestätigt hat. **Eigene Texte werden nicht automatisch bewertet.**

20 Zeichen öffnen den Mustervergleich; die Länge ist kein Qualitätsmaßstab.
Ändert sich ein Entwurf, wird seine Bestätigung zurückgenommen. Erst das
Abschicken von „Entscheidungen prüfen“ ersetzt die gespeicherten
Fallentscheidungen. Noch nicht abgeschickte Änderungen bleiben flüchtig und
lassen den bisherigen Fallnachweis bestehen, auch beim Stufenwechsel oder
Verlassen der Lektion. Eine falsche Schnellcheckantwort entfernt dessen
Nachweis; sie zeigt einen neutralen Hinweis. Die Erklärung erscheint nach
einer richtigen Antwort. Bei gesperrtem Speicher
bleibt die laufende Sitzung nutzbar und zeigt einen Hinweis.

Beim Speichern werden unveränderte Felder aus dem inzwischen gespeicherten
Stand anderer Tabs übernommen. Abgeschickte Antworten und Bestätigungen
bleiben ausdrücklich erkennbar, auch wenn ihr Wert schon der alten Fassung
entsprach. Eine Bestätigung gilt nur für den tatsächlich verglichenen Text.
Unterstützt der Browser Web Locks, werden gleichzeitige Speicherzugriffe
koordiniert. Ohne diese API, etwa bei manchen Offline-Dateiansichten, bleibt
das Zusammenführen verfügbar; überlappende Schreibzugriffe sind dort nicht
transaktional geschützt. Bearbeiten zwei Tabs denselben Entwurf, gilt die
zuletzt gespeicherte Textänderung. Die Aufgabenauswahl bleibt tabbezogen.

## Quellen und zusätzliche Praxis

Die Materialien sind überwiegend eigens geschriebene, ausdrücklich erfundene
Texte und Daten. Mögliche Beispiele sind keine Studien oder tatsächlich
beobachteten Ergebnisse. Kurze Originalstellen aus Lessings *Nathan der Weise*
(III,7) und Goethes *Der Zauberlehrling* (Ausgabe 1827, entstanden 1797) sind
gekennzeichnet und belegt. *Prometheus* ist als weitere Originallektüre
verlinkt. Rechtschreibfragen beziehen das Amtliche Regelwerk 2024 ein;
Konjunktivformen und Funktionen sind mit IDS grammis abgeglichen.

Zusätzlich nötig sind insbesondere:

- Tatsächliche Hörtexte, Gespräche, Interviews, Vorträge und Debatten mit
  Rückmeldung zu verbalen, nonverbalen und paraverbalen Mitteln.
- Eine eigene Inszenierung mit Überarbeitung nach Feedback sowie ein
  tatsächlicher Vergleich von Dramenauszug und entsprechender Filmszene.
- Mindestens ein geeignetes Jugendbuch als Ganzschrift mit realem Lesejournal
  und Austausch über Lektüreempfehlungen; vielfältige weitere Literatur.
- Aufklärung, Sturm und Drang und Klassik an Originaltexten im Zusammenhang
  erschließen; kurze Zitate allein erfüllen diese Literaturarbeit nicht.
- Echte Print-/Online-Zeitungen, Diagramme, aktuelle Sprachbeispiele,
  Computerspiele und eigene Recherche ergänzen die kurzen Übungsfälle.
- Ein tatsächliches Bild als Schreibimpuls: die App bietet eine Beschreibung,
  keine Bilddatei. Längere eigene Texte, Schreibgespräche und persönliche
  Fehlerkontrolle über mehrere Texte gehören ebenfalls dazu.

Die lineare Erörterung erscheint als mögliches Ordnungsmodell. Die App erklärt
weder eine feste Argumentzahl noch Sanduhr- oder Steigerungsmodell zu einer
amtlichen Pflicht für jeden Deutsch-8-Schreibauftrag.

## Zelle und bestehender Bestand

`cell.json` ist die einzige Kartenquelle: 40 Atome, je ein Schnellcheck und
ein gezielter Abruf. Jede Karte führt zu
`https://academy.zam-os.org/deutsch-realschule-8/#lesson=<id>`.
Die offiziellen Bindungen verwenden Deutsch, Jahrgang 8, Realschule und die
passenden Lernbereiche `lb1` bis `lb4`; die feinere Zuordnung steht in der
Abdeckungsmatrix. 14 weiche Voraussetzungsbeziehungen erklären Grundlagen,
ohne Lektionen zu sperren.

Die neue Zelle ergänzt die bisherige Argumentationszelle und enthält weder
`replaces` noch `retired_items`. `replaces-de-by.json` dokumentiert alle vier Altfragen
als C-Zeilen mit `status: proposal-only`, `approved: null` und `action: keep-active`.
Die Testkopie ist mit Quellrepository, Quellcommit und SHA-256 bytegenau belegt. Vier
alte Karten und ihre Lernstände bleiben
unverändert; thematische Ähnlichkeit überträgt keine Beherrschung. Der
[Bestandsabgleich](../docs/deutsch-8-bestandsabgleich.md) erläutert die Grenzen,
insbesondere die nicht übernommenen ungesicherten Beispielbelege.

`scripts/card-ids.json` hält 120 einmal mit `ulid()` vergebene IDs.
`tests/fixtures/public-contract.json` pinnt sie und alle 40 Lektionsanker.
Kartentexte stehen ausschließlich in `cell.json`; es gibt keinen Kartengenerator und
keine zweite Wiederholungsfragenliste. Die App liest den Schnellcheck aus der passenden
Tier-1-Karte und ergänzt nur Feedback und eine zusätzliche Workshop-Option. Tier 2
enthält jeweils eine Musterlösung in `sample_solution`. Bei erster Veröffentlichung
gelten die stabilen Academy-Verträge
für IDs, Slugs, Lektionsanker und Versionierung.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5212/deutsch-realschule-8/
npm test
npm run typecheck
npm run package:zip  # Build, Offline-ZIP und Artefaktprüfung
```

Die vier vorhandenen Entwicklungswerkzeuge und der Lockfile-Stand stammen aus
dem Deutsch-10-Paket. Es kommt keine weitere Abhängigkeit hinzu. Der Build
benötigt kein Nachbarpaket und erzeugt eine einzige HTML-Datei. Das ZIP enthält
sie mit Startdateien für Windows, macOS und Linux. Für die App selbst sind
keine Netzwerkressourcen erforderlich; externe Originallektüre und Recherche
brauchen eine Verbindung oder anderweitig vorliegende Originale. Alle
Quellenlinks öffnen erst auf Klick.

Mit dem in der Academy-CI gepinnten veröffentlichten `zam-core@0.54.0`:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Die Prüfung arbeitet nur in einer temporären Bibliothek: vier alte Karten mit
acht echten Ratings bleiben bei wiederholter Installation und expliziter
Erzeugung aller 80 neuen Karten identisch. Neue Karten starten ohne Reviews
oder Stabilität. Installation allein erzeugt keine persönlichen Karten.

CI, Pages, der Atlas über `academy.json` und Katalog kennen das Paket. Push, Veröffentlichung und
spätere Übernahme in ein ZAM-Release sind getrennte Schritte. Gebündelte Zellen
in `zam-os/zam` werden durch diesen Entwurf nicht verändert.
