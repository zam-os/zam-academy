# Latein 8 Gymnasium (1. Fremdsprache): Lehrplanabgleich & Bestandsaufnahme

Geprüft am 27. November 2026 gegen den [offiziellen Fachlehrplan Latein 8 (1. Fremdsprache), Gymnasium Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/1-fremdsprache). Der Fachlehrplan gilt einheitlich für alle Ausbildungsrichtungen am Gymnasium.

## Lehrplan-Nachweis

- Gesichertes HTML: [`latein-gymnasium-8-l1/tests/fixtures/lehrplanplus-l8-1fs.html`](../latein-gymnasium-8-l1/tests/fixtures/lehrplanplus-l8-1fs.html) (`sha256`: `512ee3430ac24e4f44f35fe25d6e50ada9d2779f40c82cea36a4efd61fde9f05`).
- Nachbarjahrgänge zur Abgrenzung:
  - Klasse 7 L1 (`lehrplanplus-l7-1fs.html`, `sha256`: `c453fd8d4f5738091c38ae89f1c408df52e2276a536cdab5b7d0f1bb3fe6d55f`): 3. Deklination, Steigerung, Deponentien der a-/e-Konjugation, *ferre*, PFA, Gerundium, Hauptsatz-Konjunktive (Hortativ, Jussiv, Optativ, Prohibitiv), *consecutio temporum* und *ablativus absolutus* werden dort eingeführt und in Klasse 8 vorausgesetzt.
  - Klasse 9 (`lehrplanplus-l9.html`, `sha256`: `b52fbc9790e6c20655e774738d60f0700d4d44a024072053f1c455a1b718cf47`): Original- und Übergangslektüre (Nepos, Caesar *De bello Gallico*, Sueton, Martial / elegisches Distichon, Metrik, *oratio obliqua* und historisches Präsens) bleiben konsequent ausgeschlossen.
- Hinweis zur amtlichen Bezeichnung: In `lehrplanplus-l8-1fs.html` trägt Lernbereich 4 wortwörtlich die Überschrift „Lernbereich 4: Latein 7.5.3 – aktuell, digital, kreativ“; dieses Originalzitat wurde unverändert aus der offiziellen Vorlage übernommen.
- Verbatim-Prüfung (`node latein-gymnasium-8-l1/scripts/check-curriculum.mjs`): **57 rows, 0 not found**; alle drei HTML-SHA-256-Prüfsummen stimmen überein.

| Etappe | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| 1 · Wortschatz, Wortbildung & Inschriften | 5 | Aufbauwortschatz & Pänultima-Betonung, Wortfelder & Wendungen, Wortbildung (Prä-/Suffixe), Sprachbrücken in Europa, Inschriften & Kürzel |
| 2 · Pronomina & besondere Verben | 5 | *quīdam*/*quisque*/verneinte Indefinita, verallgemeinernde Relativa & Korrelativa, *i*- & kons. Deponentien, Semideponentien & Perfektopräsentien, *fierī* |
| 3 · Gerundiv & Dativ des Urhebers | 5 | Gerundium vs. Gerundiv, attributives Gerundiv, prädikatives Gerundiv mit *esse*, *datīvus auctōris* & Genitiv des geteilten Ganzen (*genetīvus partītīvus*), komplexe Gerundivübersetzung |
| 4 · NcI, Konjunktiv & Relativsätze | 5 | NcI (Aufbau & Triggerverben), NcI-Übersetzungsstrategien, Deliberativ & Potentialis (Abgrenzung zu Kl. 7), konjunktivische Relativsätze (final/kausal/konsekutiv/konzessiv), verschränkte Relativsätze & *quod*-Sätze |
| 5 · Kaiserzeit, Limes, Christentum & Europa | 5 | Prinzipat, Hochkaiserzeit & Spätantike, Limes & Germanen (Obergermanisch-Raetischer & Donaulimes), Rom & die Christen, *interpretātiō Rōmāna*, Europas Latein |
| 6 · Römisches Recht & Werte | 5 | Grundzüge des römischen Rechtswesens, lateinische Rechtssprüche heute, *iūstitia* & *hūmānitās*, Rechtsfallstudie, antike Rechtstradition in Europa |
| 7 · Philosophie, Weltbilder & Phaedrus | 5 | Vorsokratiker (*archē*/*logos*), Sokrates & Selbstprüfung, Epikureer & Stoa (*ataraxía*/*apatheia*), Cicero & Seneca, Phaedrus-Fabeln (ohne Kl.-9-Metrik) |
| 8 · Latein aktuell, digital, kreativ & Methodik | 5 | Satzanalyse & Einrückmethode, Übersetzungen selbst prüfen, digitale Recherche & Quellenkritik, kreative & digitale Rezeption, Selbstorganisation & Teamarbeit |

## Was außerhalb der App bleibt (`status: supported`)

Sechzehn Zeilen der Abdeckungsmatrix sind als `supported` markiert:
- **L8-04, L8-07**: Lautes, quantitätsgerechtes Vortragen langer Sätze und direktes Aussprache-Feedback erfordern das Unterrichtsgespräch bzw. die eigene Sprechpraxis.
- **L8-05**: Das Paket trainiert exemplarische Aufbau-, Pronominal- und Kulturvokabeln im Satzzusammenhang; der vollständige Grund- und Aufbauwortschatz (ca. 1500 Wörter) bleibt Aufgabe des Lehrwerks und kontinuierlicher Wortschatzarbeit.
- **L8-42, L8-43, L8-44, L8-45, L8-46**: Museums-Links (Limesmuseum Aalen, Museum Quintana Künzing, Römerkastell Saalburg, bpb-Rechtslexikon) und Arbeitsimpulse bereiten Recherchen, Exkursionen, Museumsbesuche, Kurzreferate und Bewertungen außerunterrichtlicher Zeugnisse vor; reale Recherche und Präsentation finden im Unterricht bzw. an den Stätten statt.
- **L8-50–L8-57**: Mustervergleich, Selbsteinschätzung, Zeitplan-Entwürfe und Visualisierungswerkzeuge üben methodisches Vorgehen ein; das Nachschlagen im gedruckten Schulwörterbuch, kooperative Fehleranalyse mit Mitschülern, reale Wochenplanarbeit, Gruppenprojekte und szenische Gestaltungen bleiben Unterrichts- und Eigenarbeit.

## Bestandsabgleich (`replaces-de-by.json`)

Geprüft am `zam-os/zam`-Stand `c92f4e383385ee487cd8b30f73b3bf3cb27b0860` (`tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`):

| Altzelle | Alte ID | Kategorie | Vorgeschlagene Aktion & Nachfolger-Slug | Begründung |
| --- | --- | --- | --- | --- |
| `de-by:gymnasium-9-latein-gerundium-gerundivum-caesar-originallektuere` | `01K8G9K0000000000000000J01` | A | `propose-replace-after-approval` → `l8-gerundiv-praedikativ-check` | Identische atomare Tier-1-Abfrage zur Bedeutung von `Carthago delenda est` („Karthago muss zerstört werden“), im LehrplanPLUS bereits in Jgst. 8 (L8 2.2/2.3). |
| `de-by:gymnasium-9-latein-gerundium-gerundivum-caesar-originallektuere` | `01K8G9K0000000000000000J02` | C | `keep-active` | Mehrteilige Tier-2-Kompositkarte über Gerundium, attributives/prädikatives Gerundiv und *dativus auctoris* zusammen; kein einzelner Nachfolger ersetzt die Gesamtkarte. |
| `de-by:gymnasium-9-latein-gerundium-gerundivum-caesar-originallektuere` | `01K8G9K0000000000000000J03` | C | `keep-active` | Erzähltechnik der 3. Person in Caesars *De bello Gallico* gehört in Klasse 9 (L9 1.2). |
| `de-by:gymnasium-9-latein-gerundium-gerundivum-caesar-originallektuere` | `01K8G9K0000000000000000J04` | C | `keep-active` | Kompositkarte zu Caesars *Commentarii* gehört zu Jgst. 9 und bleibt dort unverändert aktiv. |

### Abgrenzung zu `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio`

Die ältere Zelle `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` (`01K8G8K0000000000000000J01`–`J04`, `sha256` `6874a4d44dfe2bc0f5ad80b53ea2d851c2baad4a44fcba698f70542799eb3684`) behandelt Ablativus absolutus, Hortativ und *consecutio temporum*. Nach dem geltenden LehrplanPLUS für Latein L1 liegen diese Inhalte in **Klasse 7** und wurden am 26. November 2026 in [`latein-gymnasium-7-l1`](../latein-gymnasium-7-l1/replaces-de-by.json) (PR #206) vollständig geprüft und durch Thomas freigegeben (`J01`, `J03` ersetzt; `J02`, `J04` aktiv belassen). `latein-gymnasium-8-l1` beansprucht daher keine Karte aus dieser Zelle, damit jede Altkarte eindeutig genau einem Paket zugeordnet bleibt.

[`latein-gymnasium-8-l1/replaces-de-by.json`](../latein-gymnasium-8-l1/replaces-de-by.json) hat den Status **`proposal-only`** (`"approved": null`); `cell.json` liefert bis zur ausdrücklichen Freigabe durch Thomas für `01K8G9K0000000000000000J01` weder `replaces` noch `retired_items`.

## Geprüfte Quellen (`source-checks.json`)

Alle sechs angezeigten externen Quellen wurden am 27. November 2026 live abgerufen und ihre Seitentitel und SHA-256-Summen protokolliert:
1. `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/1-fremdsprache` (`LehrplanPLUS - Gymnasium - 8 - Latein - Fachlehrpläne`, `sha256` `512ee3430ac24e4f44f35fe25d6e50ada9d2779f40c82cea36a4efd61fde9f05`)
2. `https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/latein` (`LehrplanPLUS - Gymnasium - Latein - Fachprofile`, `sha256` `8ea9e3282adc9e886c45502aa9ff2f53dc72fc198062fdfac73b962be48bfcf5`)
3. `https://www.limesmuseum.de/` (`Limesmuseum Aalen`, `sha256` `25e671122561d372d46319d564ec09051cea8a912acda00242141f64fa0372d1`)
4. `https://www.museum-quintana.de/` (`Römermuseum am UNESCO-Welterbe Donaulimes bei Passau - Museum Quintana Künzing`, `sha256` `0017dc8ff82e6b4de48ad9726e2d88abc7ac4fad43c4344e369e442f9f472ece`)
5. `https://www.saalburgmuseum.de/` (`Römerkastell Saalburg`, `sha256` `4822999425c65770cedc5cb599e048ffce19b440163dd5df5cfd98fa55ad7036`)
6. `https://www.bpb.de/kurz-knapp/lexika/recht-a-z/` (`Das Rechtslexikon | bpb.de`, `sha256` `fa123edf1fe3d5991b70fa894b5966fd53ae60dbc0c191ecea60fa77df3342ca`)
