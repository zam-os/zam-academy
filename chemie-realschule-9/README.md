# Chemie 9 Realschule · ZAM Academy

Chemie für die 9. Klasse der bayerischen Realschule nach LehrplanPLUS: zwei
getrennte Lernpfade, digitale Modelle und Aufgaben auf zwei Niveaus. Die App
wird unter `https://academy.zam-os.org/chemie-realschule-9/` veröffentlicht.

## Lernpfade und Umfang

35 Lektionen in sieben Etappen. Jeder Zweig hat **22 Lektionen**; neun
Lektionen werden gemeinsam genutzt. Eine erste Nutzung beginnt mit Zweig
II/III und Level 1. Der Zweig ist jederzeit im Lernpfad auswählbar.

| Etappe | Inhalt | Zweig I | Zweig II/III |
| --- | --- | --- | --- |
| 1 Sicher forschen und Stoffe unterscheiden | Beobachtung/Deutung, Kenngrößen, Teilchenmodell, Trennung, Nachweise | LB 1: sicher arbeiten | LB 1–2: alle fünf Lektionen |
| 2 Teilchenverbände und Reaktionen | Dalton und Modellgrenzen, Gitter/Moleküle, Reaktionsgleichungen, Energie/Katalyse, Stoffmenge | freiwillige Wiederholung | LB 3–4: vier Lektionen |
| 3 Atombau und Periodensystem | Rutherford, Isotope/Ionen, Energiestufen, PSE, Kugelwolken | freiwillige Wiederholung | LB 5: fünf Lektionen |
| 4 Bindungen und Stoffeigenschaften | Ionen, Metallbindung, Lewis, Raumbau, Polarität, Wechselwirkungen, Kohlenwasserstoffe und funktionelle Gruppen | LB 2–3, dazu Organik-Vertiefung mit Alkinen, Alkanonen und Benennung | LB 3 und 6, ohne die I-Vertiefung |
| 5 Elektronenübergänge | Oxidation/Reduktion, Oxidationszahlen und Molekülionen, Teilgleichungen, Gitter- und Hydratationsenergie | LB 3: vier Lektionen | freiwillige Ergänzung |
| 6 Redoxreaktionen im Alltag | Batterie/Akku, Elektrolyse/Galvanisieren, Korrosion/Opferanode, Brennstoffzelle | LB 4: vier Lektionen | freiwillige Ergänzung |
| 7 Säuren, Basen und Protonenübergänge | pH/Indikatoren, Brönsted, Säurereste/Carbonsäuren, Oxide mit Wasser | LB 5: vier Lektionen | freiwillige Ergänzung |

Navigation, „Weiter“, Fortschritt und Etappenabschluss zählen nur den
gewählten Lernpfad. Freiwillige Lektionen stehen in einem aufklappbaren
Bereich. Ein Kartenlink darf eine solche Lektion direkt öffnen; sie wird
als Ergänzung gekennzeichnet und ändert den gewählten Zweig nicht.

Jede Lektion hat eine kurze Erklärung, einen Merksatz, einen Schnellcheck,
ein Modelllabor mit prüfbaren Aufträgen und wechselnde Aufgaben. Level 1
bietet Modellhilfe und Zwischenschritte; Level 2 lässt diese Vorgabe weg.
Aufgaben prüfen Zahlen und/oder Entscheidungen, nicht nur eine bestimmte
Schreibweise. Dezimalkomma und Brüche werden akzeptiert. Eine aufgedeckte
Lösung zählt nicht als selbst gelöste Aufgabe. Für den Abschluss braucht es
Schnellcheck, alle Laboraufträge und drei gelöste Aufgaben auf Level 1;
drei weitere auf Level 2 ergeben das Transferabzeichen.

Die App läuft ohne Konto und ohne Fremdanfragen. Fortschritt bleibt unter
einem eigenen Schlüssel im Browser. Dieser App-Fortschritt und der
ZAM-Kartenlernstand sind getrennte Dinge.

## Modelle und fachliche Grenzen

Die Labore sind digitale Schulmodelle. Sie bieten keine Anleitung für
unbeaufsichtigte chemische Versuche und ersetzen keine praktischen
Unterrichtsexperimente. Beobachtungen und Teilchendeutungen sind getrennt.

- Das Energiestufenbild verwendet die Grundzustände der ersten 20 neutralen
  Atome. `2, 8, 8, 2` ist keine allgemeine Füllregel; `2n²` ist die maximale
  Schalenkapazität im Bohr-Modell. Helium wird als Ausnahme zur
  Hauptgruppen-/Valenzelektronenregel behandelt.
- Rutherfords Bahnbild und Energiediagramme sind qualitative Skizzen.
  Katalyse verändert die Startbarriere, nicht die Reaktionsenergiebilanz.
- Polarität hängt von Bindung und Raumbau ab. Es gibt keine universelle
  EN-Grenzzahl für alle Bindungstypen und keine von Molekülgröße und
  Kontaktfläche unabhängige Stärkerangfolge zwischenmolekularer Kräfte.
- Die Kohlenwasserstoffformeln setzen offene Ketten mit höchstens einer
  Mehrfachbindung voraus. Alkine und Alkanone gehören zur I-Vertiefung.
- Elektrodennamen sind über Oxidation/Reduktion definiert; ihre Vorzeichen
  wechseln zwischen galvanischem und elektrolytischem Betrieb. Reale
  Elektrolyseprodukte hängen auch von Elektroden und Lösung ab.
- Die pH-Einteilung mit neutralem Wert sieben setzt etwa 25 °C voraus.
  Kohlensäurebildung wird als Gleichgewicht beschrieben. Neutralisation
  und quantitative Säure/Base-Rechnung werden nicht als Klasse-9-Pflicht
  vorgezogen.

## Die ZAM-Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **35 Atome, 77 Karten**. Jede
Karte und jedes Atom verlinken eine feste Lektion als
`https://academy.zam-os.org/chemie-realschule-9/#lesson=<id>`. Die Atome
tragen eine Academy-Bindung sowie die tatsächliche Lehrplanposition jedes
Zweigs. Atombau wird nicht mehr fälschlich an Chemie 9 Zweig I gebunden.
Formeln stehen in strukturierten Mathematiksegmenten mit gesprochener
Fassung; neue atomare Karten besitzen Schnellchecks und zwei kuratierte
Distraktoren. Fünf alte Synthesefragen bleiben als vollständige Abrufe
erhalten und erhalten keine künstlichen Antwortoptionen.

`replaces-de-by.json` ordnet alle **16 Items** der beiden bisherigen Zellen
`de-by:realschule-9-chemie-atombau-pse` und
`de-by:realschule-9-chemie-chemische-bindung` ausdrücklich zu:

- **7 A:** Derselbe einzelne Abruf erhält eine Nachfolgekarte mit genau
  einer `replaces`-Deklaration.
- **5 B:** Die gesamte alte mehrteilige Frage **und** Antwort bleiben
  unverändert in einer eigenen Synthesekarte erhalten. Ihr Lernstand geht
  ausschließlich dorthin; die neuen Einzelkarten erhalten keine anteilig
  abgeleitete Beherrschung.
- **4 C:** Die beiden uneingeschränkten Hauptgruppenregeln, die starren
  EN-Grenzen und die universelle Kräftestärkerangfolge benötigen fachliche
  Korrektur. Sie haben **keine** `replaces`-Deklaration. Die ursprünglichen
  Karten und ihre Review-Evidenz bleiben auf den alten IDs; die korrigierten
  neuen Fragen beginnen frisch. Zugehörige neue Slugs sind zur Nachprüfung
  angegeben und bewirken selbst keine Migration.

Die Quellkopien in `tests/fixtures/` sind ausschließlich Testdaten mit
aufgezeichnetem Quellcommit und SHA-256, keine zweite Kartenquelle der App.
Das Mapping dokumentiert die im Auftrag implementierte Zuordnung; es
behauptet keine zusätzliche Einzelabnahme durch den Eigentümer.

`scripts/validate-migration.mjs` prüft mit dem veröffentlichten `zam-core`
0.54.0 die vollständigen Kartenzeilen und Review-Ereignisse vor/nach der
Übernahme: zwölf Historien wechseln nur ihre Token-ID, vier bleiben
unverändert, Wiederholung ist idempotent. Hält eine Person alte und neue
Karte bereits gleichzeitig, verweigert der Kernel die automatische
Zusammenführung und erhält beide Historien.

Nach der ersten Veröffentlichung bleiben Item-IDs, Slugs und zitierte
Lektions-IDs stabil; Änderungen erhöhen die Zellversion.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5184/chemie-realschule-9/
npm test
npm run typecheck
npm run build        # dist/index.html, eine Datei
npm run package:zip  # release/ZAM-Academy-Chemie-9-offline.zip
```

Vom Repository-Hauptverzeichnis mit dem in CI installierten Kern:

```sh
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node chemie-realschule-9/scripts/validate-migration.mjs
node scripts/build-catalog.mjs /tmp/academy-catalog.json
```

CI und Pages enthalten das Paket. Nach Übernahme in `main` veröffentlicht
der Pages-Workflow App, `cell.json` und Katalogeintrag gemeinsam.

**Anschluss im ZAM-Release:** Erst nach der Academy-Veröffentlichung
`npm run academy:sync` im ZAM-Repo ausführen. Wie bei Physik und SQL die
beiden bisherigen Chemie-Zellen aus dem aktiven Bundle nehmen, ihre
Testkopien für die Migration behalten und den Curriculum-Positionstest
auf die Academy-Zelle umstellen. Gebündelte Academy-Kopien werden nicht
von Hand bearbeitet. Dieses Paket verändert keine persönliche Bibliothek
und veröffentlicht selbst nichts.

## Quellen

- [LehrplanPLUS Chemie 9, Realschule, Zweig I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/chemie/wpfg1), geprüft am 20.10.2026.
- [LehrplanPLUS Chemie 9, Realschule, Zweig II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/chemie/wpfg2-3), geprüft am 20.10.2026.
- [ZAM ADR 2026-10-19: Academy-Apps und Lernzellen](https://github.com/zam-os/zam/blob/main/docs/adr/2026-10-19-zam-academy-cells.md).
- [ZAM ADR 2026-08-14: Identität und explizite Nachfolger](https://github.com/zam-os/zam/blob/main/docs/adr/2026-08-14-central-learning-atoms-and-identity.md), Entscheidungen 8–10.
