# Englisch 10 · Lehrplan- und Bestandsabgleich

Stand: 25. Oktober 2026. Neues Paket unter `englisch-realschule-10/` mit
46 Kernlektionen und 92 Wiederholungsfragen. Die Pages-Veröffentlichung folgt
nach dem Merge; die Übernahme in ZAM erfolgt in einem separaten PR.

## Lehrplanbasis und Grenzen

Der [offizielle Fachlehrplan Englisch 10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/englisch)
gilt gemeinsam für die Wahlpflichtfächergruppen. Er gliedert sich in
kommunikative, interkulturelle, Text-/Medien- und methodische Kompetenzen sowie
Themengebiete. `coverage.json` führt 40 einzelne Kompetenz-/Themenzeilen mit dem Originalwortlaut
(`curriculum_text`, Leerraum vereinheitlicht), eigenen Kurzbezeichnungen sowie
Lektionsbelegen und Grenzen. Die Themenstunden sind als ungefähre Vorgaben
20/20/20/20/8/5 aufgenommen; daraus wird kein automatisch erfülltes Unterrichtsjahr.

Englisch 9 wird bei Gesprächsstrategien, bekannten Strukturen, indirekter Rede,
Wortschatz- und Wörterbucharbeit vorausgesetzt bzw. gezielt wiederholt. Indien
und Australien werden nicht als neue Länderetappen übernommen. Englisch 10
übt unter anderem `would/could/should/might/must + have + past participle` und
unterscheidet vergangene Schlussfolgerung, Rat und Bedingung. Der Anschluss-
vergleich mit FOS 11 ist ausdrücklich ein Vergleich mit einer anderen Schulart,
kein behaupteter Realschuljahrgang 11.

Natürliche Hör-/Hörsehtexte, spontane Dialoge, Aussprache, längere Lektüre,
komplexere Sprachmittlung, längere Schreibtexte, ungefähr 700 neue Wörter/Wendungen
und tatsächliche aktuelle Eigenrecherche
sind durch die App allein nicht nachgewiesen. Der Kernfortschritt zählt
bearbeitete Tätigkeiten mit eigenem Mustervergleich. Modelle enthalten keine
fertigen erfundenen Rechercheergebnisse.

## Quellen und eigene Materialien

Alle 46 Materialien und ihre Aufgaben sind gekennzeichnet. Ausgenommen vom
Fiktionslabel sind belegte landeskundliche Informationen und der als Original
gekennzeichnete Mansfield-Auszug. Originale Quellen stehen im Paket in
`src/curriculum/outline.json`; kein Drittinhalt wird automatisch geladen.

- Neuseeland: geografischer Rahmen im südwestlichen Pazifik, te reo Māori und
  Sprachrevitalisierung, erste Unterzeichnung von Te Tiriti o Waitangi 1840,
  unterschiedliche persönliche Perspektiven.
- Südafrika: geografischer Rahmen im südlichen Afrika, Mehrsprachigkeit mit
  Anerkennung der South African Sign Language 2023, erste demokratische Wahl
  1994, individuelle Stimmen statt pauschaler Länderurteile.
- Literatur: eigene vollständige Kurzgeschichte „The Spare Chair“, authentischer
  Anfang des ersten Absatzes von Mansfields „Miss Brill“, verlinkte Tolkien-Illustrationen.
  Keine kopierten fremden Bilder oder geschützten Tolkien-Textpassagen.
- Sprachquellen: British Council und Cambridge für Funktionen und Aussprache.
  Aktuelle Hörquellen sind zusätzliche Klickziele; synthetisches Vorlesen
  wird ausdrücklich von echten Varietäten und Hörsehtexten unterschieden.

## Die vier bisherigen Englisch-10-Karten

Quelle: `zam-os/zam`, Commit `cd1a71b5e8a91aa3eec601b5db06095844d024e3`,
Zelle `de-by:realschule-10-englisch-abschlusspruefung-text-production-mediation`,
Version `2026.08.1`. Eine bytegleiche Kopie mit SHA-256 steht unter
`tests/fixtures/` und ist in `replaces-de-by.json` nachgewiesen.

| Alte ID-Endung | Verhältnis zum neuen Paket | Folge |
| --- | --- | --- |
| J01 | Alte Frage unterstellt verbindliche Comment-Grundstruktur; neue Aufgaben sind auftrags-/adressatenbezogen. | C, keep-active |
| J02 | Mehrteilige Frage mit pauschalem Kurzformenverbot; neues Paket erklärt Register nach Kontext. | C, keep-active |
| J03 | Thematisch verwandte Sprachmittlung, aber kein bestätigter gleicher Einzelabruf. | C, keep-active |
| J04 | Breiter Gesamtabruf aus vier Regeln; neue Einzelkarten erhalten ihn nicht vollständig. | C, keep-active |

`status: proposal-only`, `approved: null`. Es werden weder Ersetzungen noch
Stilllegungen erklärt. Keine Freigabe aus Englisch 9 oder einem anderen Paket
wird übernommen. Thematische Nähe darf keine Beherrschung übertragen.

Die Installation wird in einer temporären Bibliothek mit dem von CI gepinnten
`zam-core@0.54.0` geprüft: vier alte Karten, jeweils zwei echte Ratings,
vollständiger Vergleich aller Karten- und Reviewfelder; danach 92 neue Karten
mit null Wiederholungen und null Stabilität. Wiederholte Installation und
Aufnahme müssen idempotent bleiben. Persönliche Bibliotheken sind unberührt.

## Prüfnachweise

Die folgenden Ergebnisse wurden am 25. Oktober 2026 vor dem Push lokal
ermittelt. GitHub-CI und Reviews sind separat am PR nachvollziehbar.

- `npm ci`: 47 Pakete installiert; dieselben vier Entwicklungswerkzeuge wie
  in Englisch 9, keine zusätzliche Abhängigkeit.
- `npm run typecheck`: erfolgreich, einschließlich aller TypeScript-Tests.
- `npm test`: **189 Tests in fünf Dateien grün**. Darunter alle 46 Lektionen
  mit beiden Produktionsaufgaben, kanonische Kurzantworten und gezielte
  Varianten mit falschen Gegenbeispielen, Text-/Kartenvertrag, getrennte
  Entwürfe, Mehrtab-Zusammenführung, Reset und blockierter Speicher.
- `biome check src tests/*.ts scripts/*.mjs vite.config.ts` mit dem vorhandenen
  Biome aus ZAM: sauber. Der bytegenaue Altbestand wird nicht neu formatiert.
- `npm run package:zip`: Typprüfung, Produktionsbuild, ZIP und
  `scripts/verify-release.mjs` erfolgreich. Die HTML-Datei im ZIP stimmt
  bytegenau mit `dist/index.html` überein; keine externen Skripte oder
  Stylesheets. Alle drei Starter und die Anleitung liegen bei,
  Shell-Syntaxprüfung erfolgreich. Windows/macOS/Linux-Starter sind auf ihren
  Zielsystemen noch nicht praktisch abgenommen.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  **30 Tests grün**, einschließlich App-/Zellzählungen und Atlasregistry.
- `ZAM_CORE=<Datei-URL von zam-core@0.54.0/dist/index.js> node scripts/validate-cells.mjs`:
  sämtliche Academy-Zellen einschließlich Englisch 10 erfolgreich in
  Wegwerfbibliotheken installiert; kuratierte Distraktoren geprüft.
- Derselbe `ZAM_CORE` mit `node englisch-realschule-10/scripts/validate-cell.mjs`:
  **46 Atome / 92 neue Karten**; vier alte Karten und acht echte Reviews
  feldweise unverändert, neue Karten ohne alten Lernstand; erneute Installation
  und Kartenaufnahme idempotent.
- Browserprüfung der gebauten App über Vite Preview: **184 Lektionsansichten**
  (46 × zwei Stufen × hell/dunkel), jeweils Titel, Material-/Aufgabenansicht,
  drei Kurzantwortfelder und Quellen vorhanden. Beide Stufen haben verschiedene
  Aufträge. Lernpfad, zwölf Nachschlagelektionen und ZAM-Dialog geöffnet.
  Diagrammwerte und zugängliche Beschreibungen stimmen mit den Materialdaten
  überein. Repräsentative helle/dunkle Ansichten visuell kontrolliert.
- `e10-choices` im Browser durchgespielt: falscher Schnellcheck gibt einen
  Hinweis, richtige Variante löst ihn; `to consult` und `by Friday` akzeptiert;
  eigener Text, Kriterienvergleich und Fortschritt gespeichert; nach Neuladen
  erhalten. Level 2 besitzt einen eigenen leeren Entwurf und einen anderen
  Auftrag.
- Die lange Einzeläußerung des ursprünglichen Vorlesewegs hing im Browser.
  Der neue Weg liest kurze Abschnitte nacheinander und bricht bei fehlender
  Rückmeldung nach 30 Sekunden je Abschnitt zum Partnerweg ab. Sechs eigene
  Wiedergabetests beweisen vollständigen Text, Abschluss erst nach dem letzten
  Abschnitt, keine Fortschrittsvergabe bei Abbruch, Fehler oder Timeout und
  keine Wirkung verspäteter Ereignisse. Im Browser wurden eine lokale englische
  Stimme, Stop, der tatsächliche 30-Sekunden-Fallback ohne Hörfortschritt und
  der getrennte Partnerstatus geprüft. Alle drei Transkripte starten
  geschlossen und lassen sich öffnen. Ein vollständiges reales synthetisches
  Vorlesen war auf diesem Browser nicht nachweisbar; die Computerstimme ist
  daher optional, der zugängliche Vorlesetext bleibt der funktionierende
  Ersatzweg. Keine Remote-Stimme/Mikrofonaufnahme.
- Eine vom Paket getrennte Kopie außerhalb des Repositories besteht
  `npm ci --offline`, Typprüfung, Tests, Build und ZIP-Prüfung. Sie braucht
  keine Nachbarpakete.
- Unabhängige zweite Agentenprüfung: alle 92 Karten, Materialien,
  Sprachregeln, Kurzaufgaben, Quellen, 40 Lehrplanzeilen, Identitäten und
  Altbestandsvorschlag gelesen. Antwortvarianten ergänzt und die Grenzen
  längerer Schreibtexte/komplexerer Sprachmittlung präzisiert. Eine fachliche
  Abnahme durch eine Lehrkraft und echte Gesprächs-/Aussprachebewertung bleiben
  zusätzliche Leistungen.


## Korrekturen nach dem PR-Review

Die Rückmeldungen zu Paar-Nomen, Wortbildung und der Frage nach einer
Aussprachevorliebe sind grammatisch bereinigt. Die SASL-Lücke fragt nach dem
Namen der Sprache; die Stuhlfrage bezieht sich ausdrücklich auf die Aussage
des Erzählers. Level 1 zeigt alle drei später abgefragten Kriterien.

Der Mansfield-Text ist als Anfang des ersten Absatzes gekennzeichnet;
Kurzantwortfeedback und Beschreibung behaupten keinen vollständigen Absatz.
Das Himmelszitat übernimmt den Artikel „the“ aus dem Original.

Die Recherchezeile `media-5` und der Text-/Medienbereich sind `partial`:
Die App bereitet die Quellenarbeit vor, die selbständige Recherche erfolgt
mit echten Suchdiensten, Enzyklopädien oder Printmedien außerhalb der App.
Grammatik, Wortschatz sowie allgemeine Aussprache-/Überarbeitungstexte
zählen nicht mehr als eigene Themenarbeit in LB 5;
Bereiche, Zeilen, Lektions- und Zellbindungen sind entsprechend abgeglichen.
Die Energiepräsentation bleibt ein tatsächlicher Themenbeleg.

Die beiden im Review wegen Bot-Schutz/Serverfehlern offenen Quellen wurden
am 25. Oktober 2026 auch im Browser geöffnet: NZHistory zeigte die Angaben
zu 1975/1987, das Waitangi Tribunal die erste Unterzeichnung am 6. Februar
1840 und die weiteren Signaturen. Der NZHistory-Sicherheitsdienst leitete
ohne Eingabe selbständig zum Artikel weiter.

`fast_check.correct_index` bleibt entsprechend dem ausdrücklichen
Academy-Vertrag auf 0; die App verteilt die richtige Position über
`quizOptions`. Aufgabensprache ist Englisch, Sprachmittlung EN–DE enthält
erwartungsgemäß deutsche Antworten.


Nach den Korrekturen sind Typprüfung, alle 189 Pakettests, 30 Registertests,
Zellinstallation und Altbestandsschutz erneut erfolgreich durchgelaufen;
das Offline-ZIP wurde neu gebaut und geprüft. Die sieben textlich geänderten
Lektionen wurden auf beiden Stufen in hell/dunkel gezielt kontrolliert
(28 Ansichten ohne fehlende Felder oder Aufgaben); die drei korrigierten
Rückmeldungen und der vollständige Kriterienhinweis wurden im Browser
angezeigt. Die unabhängige zweite Agentenprüfung meldet keine offenen Befunde.
