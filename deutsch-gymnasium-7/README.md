# Deutsch 7 Gymnasium, Bayern

50 Lektionen decken den gemeinsamen bayerischen LehrplanPLUS für das Fach Deutsch in Jahrgangsstufe 7 des Gymnasiums ab: 10 zu *Sprechen und Zuhören*, 14 zu *Lesen und Medien*, 10 zu *Schreiben* und 16 zu *Sprache und Rechtschreibung*. Jede Lektion enthält eine Erklärung, ein durchgerechnetes Beispiel, einen Merksatz, ein interaktives Schaubild oder veränderbares Sprachmodell, eine Schnellprüfung, zwei Fallentscheidungen sowie getrennte geführte Aufgaben (Niveau 1) und Transferaufgaben (Niveau 2). Die Selbstbewertung nutzt drei konkrete Prüfpunkte; freie Texte werden nicht automatisch bewertet oder versendet.

Die 16 Sprachmodelle arbeiten an konkreten Wörtern, Formen und Satzgefügen: Bedeutungswandel und Lehnwortbau, Wirkung sprachlicher Mittel (`4.1.2`), Textsortensignale und Sprache als System, Umgebungssprachen, Wortklassen und Wortbedeutung, Konjunktiv I/II und abgestufte Modalität, Attributformen (prä-/postnominal, Partizip, Apposition) sowie konditionale, konzessive, konsekutive und adversative Adverbialsätze, Satzgefüge, Infinitiv-/Partizipialkonstruktionen mit Komma, Groß- und Getrenntschreibung, Zitier- und Interpunktionsregeln, schrittweises Überarbeiten sowie Fehleranalyse mit Wörterbuchbezug. Alle 50 Schaubilder und Modelle haben drei Erkundungsziele, die zu Beginn nicht abgehakt sind.

Das Paket erscheint zur Erstveröffentlichung als Version `0.0` (`publication.json`; `0.n` zeigt an, dass die Lehrkraftprüfung der Jahrgangsstufe noch offen ist). Lektions-IDs, Karten-IDs und Slugs sind feste Vertragskennungen. Lehrkraftprüfung und Erklärvideos folgen in späteren Schritten.

Nach dem Build lässt sich [dist/index.html](dist/index.html) direkt öffnen, oder das Offline-Paket aus [release/ZAM-Academy-Deutsch-Gymnasium-7-offline.zip](release/ZAM-Academy-Deutsch-Gymnasium-7-offline.zip) entpacken und `ZAM-Academy-Deutsch-Gymnasium-7.html` starten (inklusive Starter-Skripten für Windows, macOS und Linux). Audio, Grafiken und Stile sind eingebettet; ein Konto oder Server ist nicht nötig. Lernstand und eigene Textentwürfe bleiben lokal im `localStorage` unter dem paketeigenen Schlüssel `deutsch_gym7_progress_v1`; ein Hinweismarker direkt am Entwurfsfeld (`ⓘ Wo bleibt mein Entwurf?`) erläutert die Gerätekonto-Trennung, und „Fortschritt zurücksetzen“ löscht auch die Entwürfe. Quellen öffnen sich nur per Klick.

```sh
npm ci
npm run dev                 # Port 5274
npx tsc --noEmit
npm test
npm run check:curriculum
npm run package:zip
npm run test:browser
```

Die Browserprüfung öffnet die gebaute Einzeldatei in einem temporären Headless-Chrome-Profil (`CHROME_BIN` überschreibt den Chrome-Pfad, `BROWSER_QA_DIR` das Ausgabe- und Screenshot-Verzeichnis, Standard: `zam-deutsch-gym7-browser` im System-Temp-Ordner). Sie prüft alle 50 Lektionen und beide Aufgabenniveaus im hellen und dunklen Modus, die Erkundungs- und Fallziele, sämtliche Sprachmodell-Beispiele, Tastaturbedienung, Musterlösungen, Kriterienabgleich, Reload-Persistenz, Edit-Invalidierung, Audio-Dekodierung sowie schmale und breite Viewports (320, 390, 720, 1280 px). Laufzeitfehler oder Drittanfragen lassen den Lauf scheitern.

Die [Abdeckungsmatrix](coverage.json) verzeichnet alle 46 Erwartungen des bayerischen Fachlehrplans wortgetreu. `npm run check:curriculum` prüft jeden Wortlaut gegen die gespeicherte Lehrplan-HTML-Seite sowie sämtliche Quellen-, Altbestands- und Audio-Hashes. Zeilen mit `status: "supported"` kennzeichnen Unterrichtsaktivitäten außerhalb der App (echte Diskussionen, Vorträge, Spielszenen, Nutzung von Textverarbeitungsprogrammen, selbstständige Recherche, Schreibkonferenzen sowie die Lektüre mindestens einer altersgemäßen Ganzschrift). Einzelheiten stehen im [Bestands- und Lehrplanabgleich](../docs/deutsch-gymnasium-7-coverage.md).

Die 100 ZAM-Übungskarten liegen ausschließlich in [cell.json](cell.json) (zwei pro Lektion, mit jeweils zwei geprüften Distraktoren und Ankern auf die Lektion). Der [Vorschlag für bestehende Karten](replaces-de-by.json) ist als `proposal-only` (`approved: null`) markiert und inventarisiert alle acht Karten der beiden bestehenden Grade-7-Gymnasium-Zellen: drei Kategorie-A-Vorschläge (`propose-replace-after-approval`) und fünf Kategorie-C-Zeilen (`keep-active`). Bis zu Thomas' ausdrücklicher Freigabe enthält `cell.json` weder `replaces` noch `retired_items`.

Validierung der Installation, Einschreibung und Bestandsprüfung gegen das im CI gepinnte `zam-core`:

```sh
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Alle Texte und Beispiele sind Eigenentwürfe außer den gemeinfreien Auszügen aus Walther von der Vogelweide und Johann Wolfgang von Goethe (Wikisource). Zwei Hörbeispiele (`debatte.wav` und `rundfunk.wav`) wurden lokal mit der Computerstimme *Anna* erzeugt; [src/media/provenance.json](src/media/provenance.json) protokolliert Audio- und Transkript-Hashes. [source-checks.json](source-checks.json) hält die abgerufenen Seitentitel und SHA-256-Prüfsummen aller sechs verlinkten Fach-, Nachschlage- und Medienseiten fest. Erklärvideos wurden vereinbarungsgemäß noch nicht ergänzt.
