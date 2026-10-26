# Biologie 8 · Realschule Bayern

Lokaler Academy-Entwurf nach dem gemeinsamen [LehrplanPLUS Biologie 8](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/biologie), geprüft am **26. Oktober 2026**. Der Kurs und seine Zelle gehören zusammen: **30 Lektionen, 60 Fallentscheidungen, 60 eigene Aufgaben auf zwei Stufen und 60 ZAM-Karten**.

| Lernbereich | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| Biologisch untersuchen | 4 | Fragen, kontrollierte Vergleiche, Mikroskopie, Modelle und Quellen |
| Pilze, Bakterien und Viren | 6 | Zellaufbau, Lebensweisen, Vermehrung, Gärung und Destruenten |
| Schutz und Abwehr | 8 | Barrieren, Blut, angeborene und spezifische Abwehr, Immunisierung, Allergien, Antibiotika, HIV |
| Menschliche Entwicklung | 5 | Identität, Grenzen, Zyklus, Befruchtung, Schwangerschaft, Geburt und Verhütung |
| Evolution | 7 | Variation, Selektion, Artbildung, Fossilien, Homologie, Stammbäume und menschliche Evolution |

## Verstehen, ausprobieren und selbst antworten

Jede Lektion enthält eigene Erklärungen, ein gekennzeichnetes Material, einen Schnellcheck, zwei Fallentscheidungen und je eine Aufgabe für Anwendung und Transfer. Eigene Antworten werden **nicht automatisch benotet**: Erst schreiben, das Muster öffnen, anhand dreier Kriterien vergleichen und die Selbsteinschätzung bestätigen. Bei einer Änderung wird dieser Vergleich zurückgenommen. Die Mindestlänge öffnet nur den Vergleich und ist kein Qualitätsmaßstab. Ein Abschluss setzt Schnellcheck, beide richtigen Entscheidungen und den bestätigten Vergleich auf der ausgewählten Stufe voraus.

Vier digitale Modelle ergänzen die Lektionen:

- Wachstum mit Verdopplung und einer ausdrücklich frei gewählten Begrenzung.
- Fiktive Verläufe bei Erstkontakt, erneutem Kontakt und zugeführten Antikörpern.
- Selektion vorhandener erblicher Varianten bei wechselndem Modelluntergrund.
- Hormonell gesteuerte Zyklusstationen ohne feste Tage und persönliche Daten.

Die Modellzahlen sind keine Messdaten oder individuellen Vorhersagen. Das Selektionsmodell enthält weder neue Mutation noch Zufallsdrift; die Begrenzung des Wachstums ist keine Kulturanleitung. Modellbetätigung allein zählt nicht als fachlicher Nachweis.

**Quellen & Praxis → Aufgaben und Lösungen drucken** erstellt Unterlagen mit beiden Aufgabenstufen und einem getrennten Lösungsteil. Private Entwürfe werden nicht gedruckt. Die Druckansicht ist auch aus dem Offline-Paket nutzbar.

## Lehrplan und zusätzliche Praxis

[coverage.json](coverage.json) ordnet die **46 Kompetenzerwartungen** in der Reihenfolge ihrer Abschnitte zu. `position` ist eine eigene Zählung, keine amtliche Nummerierung; `competence` enthält eigene Kurzfassungen mit Rückverweis auf den offiziellen Abschnitt. `guided` bedeutet geführte Teilübung, `preparation` Vorbereitung einer zusätzlichen Leistung. Keine Zuordnung behauptet vollständige Beherrschung.

Echtes Mikroskopieren, Präparate herstellen, kontrollierte Experimente, eigene Quellenvergleiche, Präsentationen und ethische Diskussionen brauchen zusätzliche Durchführung und Unterrichtsfeedback. Texte über Fossilien und Anatomie bereiten den Vergleich konkreter Originalabbildungen und Befunde vor. Persönliche Familien-, Gesundheits- oder Sexualdaten werden nicht abgefragt. Der Kurs verlangt keine bestimmte persönliche Wertentscheidung.

## Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **30 Atome und 60 Abrufe**. Kartenfragen und Antworten liegen ausschließlich in der Zelle; die Tests prüfen ihren Bezug zu den kanonischen Lektionsdaten. Jede Karte zitiert `https://academy.zam-os.org/biologie-realschule-8/#lesson=<id>`. Alle Bindungen gehören zu Biologie 8 Realschule; der Lernpfad gilt für alle Wahlpflichtfächergruppen.

Die Zelle enthält weder `replaces` noch `retired_items`. Die zwei älteren Biologie-8-Pakete und die optionalen Evolutionseinheiten in Biologie 10 werden nicht umgeschrieben. Der [Bestandsabgleich](../docs/biologie-8-bestandsabgleich.md) dokumentiert Themenüberschneidungen und Grenzen. Es werden keine Lernstände aus Textähnlichkeit abgeleitet. Der zeilenweise Vorschlag in `replaces-de-by.json` ist nicht freigegeben (1 A, 0 B, 15 C) und verändert in dieser Version keine Historie.

90 einmal mit `ulid()` vergebene IDs liegen in `scripts/card-ids.json`; eine unabhängige Fixture pinnt IDs und Lektionsanker. Die Item-IDs bleiben bei redaktionellen Änderungen erhalten; neue Fragen werden direkt in der Zelle gepflegt. Ab der ersten Veröffentlichung gelten die stabilen Academy-Verträge.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5207/biologie-realschule-8/
npm test
npm run typecheck
npm run package:zip
```

Die vier Entwicklungswerkzeuge samt Lockfile stammen aus dem bestehenden Deutsch-10-Paket; es wird keine zusätzliche Abhängigkeit eingeführt. Die App verwendet lokale Schriften und lädt zur Laufzeit keine Drittressourcen. Fortschritt und Entwürfe bleiben im Browser. Bei blockiertem Speicher erscheint ein Hinweis; die laufende Sitzung funktioniert weiter.

Mit dem in der Academy-CI gepinnten veröffentlichten Kern:

```sh
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Die Prüfung verwendet ausschließlich temporäre Bibliotheken. 16 vorhandene Karten mit 32 echten Review-Ereignissen bleiben unverändert. Installation allein erzeugt keine persönlichen Karten; ausdrückliche Aufnahme erzeugt 60 frische Karten ohne Reviews oder Stabilität. Wiederholte Installation und Aufnahme sind idempotent.

Der Build besteht aus einer HTML-Datei. Das Offline-ZIP enthält die Datei sowie Startdateien für Windows, macOS und Linux. Der Artefaktcheck vergleicht die HTML-Bytes und prüft die Shellsyntax; die Startdateien wurden nicht auf allen drei Betriebssystemen ausgeführt. CI, Pages, Startseite und Katalog sind vorbereitet. Veröffentlichung und spätere Synchronisierung ins ZAM-Repository sind gesonderte Schritte.
