# Tintos Wörterstadt · Deutsch 4 · Grundschule Bayern

**Vorschau.** 26 Lektionen, 78 ZAM-Karten. Kinder der 4. Klasse üben
hier „Sprache untersuchen“ und „Richtig schreiben“ aus dem
[LehrplanPLUS Deutsch 3/4](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/deutsch)
(Abgleich am 3. und 4. November 2026). Begleiter ist Tinto, ein kleiner Tintenfisch,
der mit acht Armen schreibt. Eine Grundschullehrkraft hat die Inhalte noch
nicht fachlich freigegeben; `publication.json` steht deshalb auf `preview`.
App und Karten sind veröffentlicht, ihre IDs gelten ab jetzt als Vertrag.

| Ort in der Wörterstadt | Lektionen | Werkstätten |
| --- | ---: | --- |
| 🔧 Wörterwerkstatt (4.3, Teile von 4.4) | 9 | Nomen markieren, Fall-Maschine, Steigerungs-Treppe, Verb-Rad, Zeitmaschine, Bausteinschere, Familientreffen, Wortkupplung, Zauberwörter |
| 🚂 Satzbahnhof (4.3) | 7 | Signal-Stellwerk, Sprechblasen, Satzzug (Umstellprobe), Bahnsteig-Kontrolle, Paketstation, Fahrplan, Satz-Kupplung |
| 🔍 Detektivbüro (4.4) | 7 | Silbenschere, Lausch-Lupe, Dehn-Werkstatt, Verlängerungs-Koffer, Kompass, Kronen-Jagd, Fehlerdetektiv |
| 💎 Wörterschatz (4.4, Grundwortschatz 3/4 des ISB) | 3 | Schatzkarte, Gestern-Maschine, Merkwort-Sortierer |

## Aufbau einer Lektion

1. **Verstehen:** kurze Erklärung in Kindersprache, Beispiel, Merksatz und
   Fachbegriffe (auch gesammelt im Merkheft).
2. **Schnellcheck:** drei Antworten. Frage und richtige Antwort stammen aus
   der ersten Karte in `cell.json`, die Lektion ergänzt nur eine weitere
   falsche Antwort und die Erklärung.
3. **Werkstatt:** ein Spiel mit genau drei Zielen. Am Start ist keines
   erreicht; die Tests beweisen, dass jedes erreichbar ist.
4. **Üben:** generierte Aufgaben auf zwei Stufen. Stufe 1 zeigt sofort einen
   Tipp. Stufe 2 („Probe-Training“) fragt ohne Tipp und verlangt öfter
   eigenes Schreiben, Umformen oder Begründen. Je Stufe zählen drei richtige
   Aufgaben. Nach einem Fehlversuch hilft ein Tipp, nach zwei kann das Kind
   die Lösung ansehen; diese Aufgabe zählt dann nicht.

Jeder der vier Schritte bringt einen Stern. Mit vier Sternen klebt Tinto
einen Sticker ins Stickerheft. Es gibt keine Strafen, keine Serien, keinen
Zeitdruck und keine Ranglisten. Eingaben werden ohne Autokorrektur und mit
genauer Groß- und Kleinschreibung geprüft; Leerzeichen und die Art der
Anführungszeichen spielen keine Rolle.

## Fortschritt und Datenschutz

Kein Konto, keine Anfragen an fremde Server. Sterne, Werkstattziele und
gelöste Aufgaben liegen nur im `localStorage` dieses Browsers
(`deutsch_gs4_progress_v1`). Alle Werte wachsen nur; mehrere Tabs werden durch
Vereinigung und Maximum zusammengeführt. Ein Zurücksetzen beginnt eine neue
Epoche, die auch ein älterer offener Tab übernimmt. Ist der Speicher
gesperrt, bleibt die Sitzung nutzbar und zeigt einen Hinweis.

## Lehrplan und Grenzen

[`coverage.json`](coverage.json) führt alle 116 Kompetenzerwartungen der
17 Abschnitte wörtlich (Quelle:
[`tests/fixtures/official-curriculum.json`](tests/fixtures/official-curriculum.json)).
32 sind in dieser Ausbaustufe teilweise geübt, 43 für spätere Ausbaustufen
geplant und 41 brauchen Praxis außerhalb der App (Sprechen, Vorlesen,
Handschrift, Abschreiben, Bibliothek). Noch nicht enthalten: Lesen und
Textverständnis, eigene Texte und Sprechen. Der verbindliche Grundwortschatz
3/4 des ISB steht vollständig in der Station „Wörterschatz“. Siehe
[Abgleich und Planung](../docs/deutsch-grundschule-4-coverage.md).

Die Wörter der Station „Wörterschatz“ stammen vom ISB München und fallen nicht
unter die Lizenz dieses Pakets: Eine kommerzielle Nutzung ist nicht gestattet,
das ISB ist stets als Quelle zu nennen (siehe Abgleich und Planung).

Lehrervideos enthält das Paket bewusst nicht; sie folgen in einem eigenen
geprüften Schritt.

## ZAM-Zelle

`cell.json` (`zam-academy:deutsch-grundschule-4`): ein Atom je Lektion, je
zwei Schnellkarten (`fast_check`) und eine Transferkarte mit Musterlösung.
ULIDs, Slugs und Lektions-IDs sind in
`tests/fixtures/public-contract.json` festgehalten. ZAM enthält bisher keine
`de-by`-Karten für Deutsch in der Grundschule (geprüft in zam-os/zam,
Commit `88c5de2`), es gibt also keine Kartenübernahme und kein
`replaces-de-by.json`. Wie bei Mathematik 4 bindet die Zelle nur an die
eigenen Stationen, nicht breit an LehrplanPLUS.

## Entwickeln und prüfen

```bash
npm ci
npm run dev          # http://localhost:5217/deutsch-grundschule-4/
npx tsc --noEmit
npm test
npm run build
npm run package:zip  # baut und prüft das Offline-ZIP
```

Zellprüfung mit der in CI fest eingestellten zam-core-Version:

```bash
ZAM_CORE=<file URL of zam-core's dist/index.js> node deutsch-grundschule-4/scripts/validate-cell.mjs
```
