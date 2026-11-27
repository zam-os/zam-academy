# Latein 6 Gymnasium (2. Fremdsprache): Lehrplanabgleich & Bestandsdokumentation

Geprüft am 25. November 2026 gegen den amtlichen [LehrplanPLUS Bayern, Gymnasium, Latein 6 (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/2-fremdsprache). Der Fachlehrplan gilt einheitlich für die zweite Fremdsprache Latein am bayerischen Gymnasium ohne separate Zweigpläne.

## Lehrplannachweis

- `latein-gymnasium-6-l2/tests/fixtures/lehrplanplus-l6-l2.html` bewahrt den abgerufenen LehrplanPLUS-HTML-Snapshot (`sha256: 1fa166cb0a2085841b23d4273b9962a46097a231ce3e9a1094a20db4de9d339e`).
- `latein-gymnasium-6-l2/tests/fixtures/lehrplanplus-l7-l2.html` bewahrt den Snapshot der Nachbarstufe 7 L2 als Grenzprüfung (`sha256: 6756c0f47dcba1ca85c23f77471a4e572daa45364fb9af859e94e9675a3ea0ce`).
- `node scripts/check-curriculum.mjs` prüft beide Hashes sowie alle **57 wortgetreuen Kompetenzerwartungen** (`L6-01` bis `L6-57`) nach Whitespace-Normalisierung: **57 rows, 0 not found**. Die ISB-Seite nennt keine Stundenzahlen pro Lernbereich.
- `latein-gymnasium-6-l2/source-checks.json` dokumentiert URL, Prüfdatum, gelesenen `<title>` und SHA-256 für die Lehrplanseite sowie beide Kulturquellen (`pompeiisites.org`, `antike-am-koenigsplatz.mwn.de`).

## Abgrenzung zu Jahrgangsstufe 7 (L2)

Latein 7 (2. Fremdsprache) führt Passivformen (inkl. Passiv-AcI), Partizipien (PPA/PPP, *Participium Coniunctum*, *Ablativus Absolutus*), Konjunktiv samt *consecutio temporum*, 4. (u-) und 5. (e-)Deklination, die Demonstrativpronomina *hic, ille, iste, idem, ipse* sowie *ferre* ein. Alle diese Inhalte bleiben aus den Lernzielen und Übungsmaterialien von `latein-gymnasium-6-l2` ausgeschlossen.

## Etappen & interaktive SVG-Visualisierungen

| Etappe | Lektionen | Schwerpunkte & SVG-Labore |
| --- | ---: | --- |
| 1 · Salve! Lautung, Wortschatz & Brücken | 5 | Pänultima-Silben-Explorer, Sachfelder & Wortfamilien, Kontextweichen, Wortbildungs-Baukasten, Sprachbrücken |
| 2 · Nomina, Kasus & Zahlen | 5 | Live-Deklinations-Baukasten (1.–3. Dekl. inkl. i-Stämmen), KNG-Klammer, Pronomina, Römischer Zahlen-Schieber (1–12) |
| 3 · Verben & alle 6 Aktiv-Tempora | 5 | Live-Verb- & Tempus-Baukasten (Präsens, Imperfekt, 6 Perfektarten, Plusquamperfekt, Futur I/II, Sonderverben) |
| 4 · Satzbau, Kasusfunktionen & Nebensätze | 5 | Satzglieder, Kasusfunktionen, Ablative & Präpositionen, Adverbialsätze, Relativsatz & relativer Satzanschluss |
| 5 · AcI & Übersetzungsmethodik | 5 | Live-AcI-Transformationsbrücke (Gleich-/Vorzeitigkeit aktiv), Konstruktionsmethode, Fehleranalyse, Lernorganisation |
| 6 · Rom, Italien & Pompeji | 5 | Interaktive Rom- und Italien-Karten (Ebenen-Schalter), Vesuv 79 n. Chr. & Plinius d. J., Kunst & Rezeption |
| 7 · Geschichte, Politik & Alltag in Rom | 5 | Interaktive Zeitleiste (Aeneas, 753–509 v. Chr., frühe Republik), Organe & Ständekämpfe, *pietas*/*tria nomina*, Sklaven, Schule & Kalender |
| 8 · Religion, Götter & Antike Mythen | 5 | Kult (*do ut des*, Auspizien), interaktive Olympier-Tafel, Unterwelt, Troja & Odysseus, Herakles & Aeneas |

## Was außerhalb der App bleibt (`status: supported`)

Erwartungen, die echte Mündlichkeit, Partnerinteraktion, Museumsbetrachtung oder langfristige Selbstorganisation voraussetzen (`L6-03`, `L6-04`, `L6-05`, `L6-07`, `L6-29`, `L6-38`, `L6-51`–`L6-54`, `L6-56`, `L6-57`), sind ehrlich als `supported` eingestuft. Lautes Lesen, eigene Vokabelkartei von ca. 450 Wörtern und Lehrkraftfeedback bleiben Unterrichtsbestandteil.

## Altbestand-Inventur (`replaces-de-by.json`)

Geprüft in `zam-os/zam` (Stand Commit `67e190c2b7e5282851dfdd60ce21b69ed373dfa9`, `tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`):

- Es existiert keine `de-by:gymnasium-6-latein-*`-Zelle.
- Die nächstliegende Alt-Zelle ist `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` (4 Karten):
  - `01K4T7A0000000000000000J01` (*Subjektsakkusativ im AcI*): deckt sich inhaltlich mit `l6-aci-grundbau-check` (Kandidat für Kategorie A, falls Thomas ihn nach Klasse 6 übernimmt).
  - `01K4T7A0000000000000000J02` (*AcI-Synthese*): verteilt sich auf `l6-aci-grundbau` und `l6-aci-zeitverhaeltnisse` → Kategorie C (`keep-active`).
  - `01K4T7A0000000000000000J03` und `01K4T7A0000000000000000J04` (*Participium Coniunctum*): klar Jahrgangsstufe 7 (`L7 2.2/2.3`).
- Bis zu Thomas’ Entscheidung bleibt `replaces-de-by.json` im Status `proposal-only` (`"approved": null`, `"rows": []`), und `cell.json` enthält weder `replaces` noch `retired_items`.
