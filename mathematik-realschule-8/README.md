# Mathematik 8 Realschule Bayern · ZAM Academy

Lokaler, noch unveröffentlichter Paketentwurf vom 22. Oktober 2026: **33 Lektionen, 33 Labore und 99 ZAM-Karten**. Der Lernpfad trennt Wahlpflichtfächergruppe I (**28 Lektionen**) von II/III (**23 Lektionen**). Als Grundlage dienen die aktuellen offiziellen Fachlehrpläne für [M8 I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg1) und [M8 II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg2-3).

## Lernangebot

| Etappe | Inhalte | I | II/III |
| --- | --- | --- | --- |
| Dreiecke und Vierecke | Existenz, Konstruktion, Kongruenz; Viereckfamilien, Konstruktion und Flächen | 2 Lektionen · LB 1 | 5 Lektionen · LB 1 |
| Drehung | Kongruenzabbildung, Punktspiegelung, Drehsymmetrie, Vektordrehung | 3 · LB 2 | — |
| Raumgeometrie | I: Körpersymmetrie, Axialschnitte, Raumkoordinaten; II/III: Schrägbilder und wahre Größe | 3 · LB 3 | 2 · LB 2 |
| Terme und Gleichungen | Summenterme, höhere Potenzen, binomische Formeln, Faktorisieren, Extremwerte, lineare Gleichungen und Sachaufgaben; Ungleichungen nur I | 7 · LB 4 | 6 · LB 3 |
| Bruchterme und Bruchgleichungen | Definitionsmenge, ursprüngliche Nennerausschlüsse, Verhältnisgleichungen, Formeln umstellen | 3 · LB 5 | 3 · LB 4 |
| Funktionen | Eindeutigkeit, Darstellungen und Mengen, Ursprungsgeraden, Orthogonalität; Achsenabschnitt, Zwei-Punkte-Form und Determinanten nur I | 7 · LB 6 | 4 · LB 5 |
| Daten und Zufall | Ergebnis/Ereignis, Baumdiagramm, Vierfeldertafel, absolute/relative Häufigkeiten und Simulationen | 3 · LB 7 | 3 · LB 6 |

Die [Lehrplanmatrix](coverage.json) ordnet alle **23 Kompetenzerwartungen von I und 19 von II/III** konkreten Lernangeboten zu. Konstruktionen auf Papier, freies Arbeiten mit Geometriesoftware, Messen mit Zirkel und Geodreieck, eigene Begründungen und eine echte Würfelserie bleiben zusätzlich zu üben. Die App bewertet diese Leistungen nicht. Die Matrix ist kein Nachweis individueller Beherrschung; eine unabhängige didaktische Fachprüfung steht noch aus.

Jede Lektion enthält Erklärung, Formeln, Schnellcheck, veränderliches SVG-Labor mit zwei überprüfbaren Aufträgen und zufällig erzeugte Aufgaben. Level 1 bietet eine Verfahrenshilfe, Level 2 verlangt Transfer. Nach richtigem Schnellcheck, beiden Laboraufträgen und drei Aufgaben auf Level 1 gilt die App-Lektion als abgeschlossen; drei weitere Transferaufgaben bringen das Bonusabzeichen. Diese Zählung beschreibt die App-Teilhandlungen.

Zweigauswahl, Navigation, Formelsammlung und Fortschritt berücksichtigen den gewählten Lernpfad. Fortschritt bleibt lokal im Browser; die App braucht weder Konto noch Internet und lädt keine Drittinhalte nach. Externe Quellen öffnen nur nach einem Klick.

## Videos später ergänzen

Die Videosuche ist ausdrücklich zurückgestellt. [video-tasks.json](video-tasks.json) enthält für jede der 33 stabilen Lektionskennungen einen offenen Rechercheauftrag. Alle `teacherVideo`-Felder fehlen bislang. Ein späterer Agent kann nach Prüfung eines echten Direktlinks Titel, Urheber und URL an der jeweiligen Lektion ergänzen. Die Texte, Labore, Aufgaben und Karten funktionieren vollständig ohne Video.

## ZAM-Karten und Altbestand

`cell.json` ist die einzige Kartenquelle der App. Jede der 99 Fragen fragt einen einzelnen Punkt ab und verlinkt ihre Lektion als `https://academy.zam-os.org/mathematik-realschule-8/#lesson=<id>`. Formeln und Formelalternativen sind Card-Text-Segmente mit LaTeX und Sprechtext. Die Zellkennung lautet `zam-academy:mathematik-realschule-8`.

Die drei bisherigen Klasse-8-Teilzellen enthalten zusammen 24 Karten. [replaces-de-by.json](replaces-de-by.json) dokumentiert jede davon als **Vorschlag**: neun A-Zuordnungen für gleiche Einzelabrufe und 15 C-Fälle ohne sicheren Gesamtnachfolger. Mehrteilige Abrufe werden nicht auf neue Teilfragen verteilt. Auch alte Inhalte außerhalb des geprüften M8-Pflichtumfangs werden nicht stillschweigend umgedeutet. Die ursprünglichen Fixtures liegen bytegleich mit Prüfsummen unter `tests/fixtures/`.

**Es gibt keine Freigabe einer Übertragung oder Ablösung.** Der Entwurf enthält deshalb weder `replaces` noch `retired_items`; `approved` bleibt `null`. Der [Bestandsabgleich](../docs/mathematik-8-coverage.md) beschreibt den Stand. Veröffentlichung, Freigabe der konkreten Zuordnungen und Übernahme ins ZAM-Repository sind weitere Schritte; hier wurde nichts veröffentlicht oder in persönliche Bibliotheken aufgenommen.

Der Migrationstest prüft den unveränderten Entwurf und eine ausschließlich im Speicher gebaute Probe der neun A-Zuordnungen in temporären Bibliotheken. Er erhält 24 Kartenstände und 48 Reviewereignisse einschließlich aller FSRS-Felder. Er prüft außerdem frische unbewertete Karten und die Ablehnung eines automatischen Zusammenführens zweier bestehender Historien. Bei bereits belegten Atomen nimmt `zam-core` 0.54 zusätzliche Geschwisterkarten schrittweise auf; die Probe berücksichtigt beide Aufnahmen, bevor sie Wiederholbarkeit ohne weitere Änderung prüft. C-Karten bleiben in diesem Vorschlag aktiv und unverändert.

## Entwickeln und prüfen

Wie Mathematik 9 verwendet das Paket ausschließlich die bereits vorhandenen Academy-Werkzeuge TypeScript, Vite, Singlefile und Vitest; es führt keine neue Bibliothek ein.

```sh
npm ci
npm run dev          # http://localhost:5193/mathematik-realschule-8/
npm run typecheck
npm test
npm run build        # eigenständige dist/index.html
npm run package:zip  # Offline-Paket mit Startdateien für Windows, macOS und Linux
npm run cell:generate
ZAM_CORE=<Datei-URL des veröffentlichten zam-core/dist/index.js> node scripts/validate-migration.mjs
```

`src/curriculum/outline.json` hält Lektionskennungen, Zweigbindungen und Voraussetzungen; die sieben Etappendateien enthalten die Inhalte. `scripts/card-content.mjs` enthält die Kartenentwürfe, `scripts/card-ids.json` ihre mit `ulid()` erzeugten, erhaltenen Identitäten. Der Generator erzeugt daraus `cell.json` reproduzierbar. Nach einer Inhaltsänderung `cell:generate` ausführen und die Zelle mit dem veröffentlichten Kern prüfen. Sobald veröffentlicht, bleiben Lektionskennungen, Karten-IDs und Slugs stabil.

Die 114 Tests prüfen unter anderem erreichbare Laborziele, Randkonfigurationen aller Zeichnungen, 100 reproduzierbare Aufgaben je Generator und Level, mathematische Identitäten durch Einsetzen, Definitionsausschlüsse, Simulationszustand, Zweigbindung und alle Kartenlinks. Eine Browserprobe prüft Zweigauswahl, Schnellcheck, Eingaben und Laboraufträge zusätzlich.
