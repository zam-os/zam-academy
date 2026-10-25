# Deutsch 10 · Bestandsabgleich

Stand: 25. Oktober 2026. Das neue Paket
[`deutsch-realschule-10/`](../deutsch-realschule-10/) ergänzt die Academy um
30 Lektionen und 60 Karten. Es ist lokal erstellt und noch unveröffentlicht.

## Fachliche Zuordnung

Der [gemeinsame Fachlehrplan Deutsch 10, Realschule Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/deutsch)
enthält 48 Kompetenzerwartungen in 14 Abschnitten. Die
[Abdeckungsmatrix](../deutsch-realschule-10/coverage.json) führt für jede eine
eigene Kurzfassung, zugehörige Lektionen und zusätzliche Leistungen auf.
Die 48 Zeilen enthalten eigene Kurzfassungen im aktuellen Schema mit `lb`,
`competence`, `lessons` und `evidence`; sie sind kein amtlicher Wortlaut.
Die App übt konkrete Teilhandlungen und bereitet auf umfangreichere Leistungen
vor. Insbesondere mündliche Praxis, Aufführung, Ganzschrift, historische
politische Gedichtvergleiche, echte Filmanalyse und eigenes längerfristiges
Schreiben sind kein automatisch erbrachter Teil des App-Fortschritts.

## Verhältnis zur bisherigen Deutsch-10-Zelle

Geprüfter Ausgangsbestand:
`de-by:realschule-10-deutsch-dialektische-eroerterung-textanalyse-stilmittel`.
Eine unveränderte Testkopie liegt unter
`deutsch-realschule-10/tests/fixtures/de-by-deutsch-10.json`.

| Alte Frage | Inhalt | Verhältnis zur neuen Zelle |
| --- | --- | --- |
| `01K4DAE0000000000000000J01` | Erste Seite im klassischen Sanduhrmodell | Die neue Gliederungsfrage prüft ein aspektbezogenes Modell. Kein gleicher Abruf. |
| `01K4DAE0000000000000000J02` | Mehrteiliger Abruf zu Blockmodell, Reißverschluss und Schluss | Neue Karten fragen einzelne Begründungs- und Ordnungsfragen. Kein identischer Gesamtabruf. |
| `01K4DAE0000000000000000J03` | Rhetorische Frage benennen | Die neue Analysekarte prüft den Zusammenhang von Befund, Beleg und Funktion. Keine identische Benennungsfrage. |
| `01K4DAE0000000000000000J04` | Sechs Stilmittel samt Beispielen, Wirkungen und Analyseverfahren | Im neuen Paket auf konkrete Textarbeit verteilt; kein einzelner gleicher Nachfolger. |

Die alte Zelle bleibt bestehen. Die neue Zelle besitzt ausschließlich neue
ULIDs, keine Ersetzungen und keine Stilllegungen. Thematische Nähe rechtfertigt
keine Übertragung von Beherrschung. Es wird keine frühere Mappingfreigabe eines
anderen Pakets übernommen und keine neue benötigt, solange diese Zelle keine
Geschichte verändert. `replaces-de-by.json` erfasst die vier C-Zeilen mit
`approved: null` und `status: proposal-only`; Quellcommit und SHA-256 sichern
die bytegenaue Altzellenkopie. Auch der Deutsch-9-Bestand wird hier nicht verändert.

## Prüfbarer Umgang mit Lernständen

`deutsch-realschule-10/scripts/validate-cell.mjs` installiert die Altzelle in
einer temporären Bibliothek, erzeugt je alter Frage eine Karte und zwei echte
Ratings. Nach Installation der neuen Zelle werden alle Karten- und Reviewfelder
mit dem vorherigen Stand verglichen. Die Installation wird wiederholt.

Anschließend werden die 60 neuen Karten ausdrücklich erzeugt. Die vier alten
Karten und acht Reviews bleiben unverändert; die neuen Karten starten mit null
Wiederholungen und null Stabilität. Wiederholtes Installieren und Erzeugen
dupliziert nichts. Alle neuen Quellen zeigen auf die vorgesehene Lektion.
Die Prüfung läuft mit dem veröffentlichten `zam-core@0.54.0` und wird in CI
registriert. Eine persönliche Bibliothek wird nicht geöffnet oder verändert.

## Veröffentlichung

App, Zelle und Offline-ZIP werden gemeinsam geprüft. CI und Pages sind um den
neuen App-Namen ergänzt; der Atlas registriert 30 Lektionen und 60 Karten, die README nennt den neuen Port 5202.
Der Katalog entdeckt die neue Zelle automatisch. App und Zelle werden nach dem Merge gemeinsam über Pages veröffentlicht.
Erst danach kann ein gesondertes
ZAM-Release das Paket über `npm run academy:sync` bündeln.

## Prüfung des lokalen Standes

Am 25.10.2026 geprüft:

- 47 Pakettests, TypeScript-Prüfung und Produktionsbuild bestehen. Biome meldet
  für die neuen Quellen und Tests weder Fehler noch Warnungen.
- Eine getrennte Kopie ohne Nachbarpakete besteht mit `npm ci --offline`,
  denselben Tests, Build, ZIP-Erstellung und Artefaktprüfung.
- Die 90 IDs und 30 Lektionsanker sind unabhängig im öffentlichen Vertrag
  gepinnt. Karteninhalte werden ausschließlich in `cell.json` gepflegt.
- Der veröffentlichte `zam-core@0.54.0` installiert alle 23 im PR-Checkout
  vorhandenen Academy-Zellen. Die besondere Deutsch-Prüfung bestätigt die
  unveränderten vier Altbestandskarten und acht Reviews.
- Alle 30 vorhandenen Katalog- und Registrierungstests bestehen; der lokale Katalog enthält
  die neue Zelle mit ihrem Hash. `git diff --check` ist sauber.
- Im Browser wurden alle 30 Lektionen auf beiden Niveaus in heller und dunkler
  Ansicht geöffnet (120 Ansichten) und die
  drei Übungsschritte sowie die jeweils gewählte Stufe abgeglichen. Eine Lektion
  wurde einschließlich Fallentscheidungen und Selbsteinschätzung durchgespielt.
  Entwurf und Abschluss bleiben nach Neuladen erhalten; eine Textänderung nimmt
  den Abschluss zurück. Helle und dunkle Ansicht wurden visuell geprüft.
- Das ZIP enthält bytegleich den gebauten Einzeldatei-Lernpfad, alle drei
  Starter und die Anleitung. Die HTML-Datei lädt keine externen Skripte oder
  Stylesheets. Die Shellsyntax der macOS- und Linux-Starter wurde geprüft.

Die Browserprüfung lief über lokales HTTP. `file://`, die Starter auf allen
Zielbetriebssystemen und die zusätzlichen Unterrichtsleistungen wurden hier
nicht praktisch geprüft. Die Prüfung und der Build ersetzen keine fachliche
und didaktische Abnahme durch eine Lehrkraft.


Ausgeführte Prüfkommandos im PR-Checkout:

```sh
cd deutsch-realschule-10
npm ci --offline --no-audit --no-fund
npm run typecheck
npm test
npm run package:zip
cd ..
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
node scripts/build-catalog.mjs /private/tmp/zam-deutsch10-pr-catalog.json
ZAM_CORE=file:///private/tmp/zam-core/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///private/tmp/zam-core/node_modules/zam-core/dist/index.js node deutsch-realschule-10/scripts/validate-cell.mjs
git diff --check
```

Der referenzierte Scratch-Kern meldet in seinem `package.json` exakt Version
`0.54.0`, entsprechend der CI. Die Paketprüfung wird außerdem in einer Kopie
mit ausschließlich dem neuen Paket ausgeführt; sie braucht keinen Nachbarordner.
Die aktuelle Lehrplanmatrix enthält 48 Kurzfassungen. Sach- und Beziehungsebene,
modellgestützte Kommunikationsanalyse sowie zielorientierte Gesprächsführung
und wechselnde Diskussionsrollen sind in 1.1 und 1.3 jeweils gesondert erfasst.
