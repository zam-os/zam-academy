# Latein 7 Gymnasium (1. Fremdsprache): Lehrplanabgleich & Bestandsaufnahme

Geprüft am 25. November 2026 gegen den [offiziellen Fachlehrplan Latein 7 (1. Fremdsprache), Gymnasium Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/latein/1-fremdsprache). Der Fachlehrplan gilt einheitlich für alle Ausbildungsrichtungen am Gymnasium.

## Lehrplan-Nachweis

- Gesichertes HTML: [`latein-gymnasium-7-l1/tests/fixtures/lehrplanplus-l7-1fs.html`](../latein-gymnasium-7-l1/tests/fixtures/lehrplanplus-l7-1fs.html) (`sha256`: `c453fd8d4f5738091c38ae89f1c408df52e2276a536cdab5b7d0f1bb3fe6d55f`).
- Nachbarjahrgänge zur Abgrenzung:
  - Klasse 6 L1 (`lehrplanplus-l6-1fs.html`, `sha256`: `20e1890fcc32e26eefb95edc1e49abfa6a3a7b6eaadcaadaae725ace33317482`): Basis-AcI, PPP, PPA sowie Konjunktiv Imperfekt und Plusquamperfekt werden dort eingeführt und hier vorausgesetzt.
  - Klasse 8 L1 (`lehrplanplus-l8-1fs.html`, `sha256`: `512ee3430ac24e4f44f35fe25d6e50ada9d2779f40c82cea36a4efd61fde9f05`): Gerundiv, Semideponentien, Deponentien der i-/kons. Konjugation, *fieri*, Perfektopräsentien, Kaiserzeit, römisches Rechtswesen und Phaedrus bleiben konsequent ausgeschlossen.
- Verbatim-Prüfung (`node latein-gymnasium-7-l1/scripts/check-curriculum.mjs`): **50 rows, 0 not found**; alle drei HTML-SHA-256-Prüfsummen stimmen überein.

| Etappe | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| 1 · Wortschatz & Klang | 5 | Mehrdeutige Wörter im Kontext, Paenultima-Betonung, Wortfelder & Wendungen, Wortbildung, Sprachbrücken & Inschriften |
| 2 · Nomina & Pronomina | 4 | 3. Deklination (konsonantisch, i-/Mischstämme), Steigerung & Ablativ des Vergleichs, Adverbien, Interrogativ-/Indefinitpronomina |
| 3 · Verben & Nominalformen | 5 | Deponentien (a-/e-Konj.), *ferre* & Komposita, PFA & Infinitiv Futur Aktiv, nachzeitiger AcI/PC, Gerund (*-nd-*) |
| 4 · Konjunktiv & Nebensätze | 5 | Konjunktiv Präsens & Perfekt (Akt./Pass.), Hauptsatz-Konjunktive, indirekte Fragen/Begehrsätze & adversatives *cum*, *consecutio temporum* |
| 5 · Ablativus absolutus | 4 | Aufbau & Abgrenzung zum PC, PPP vs. PPA, nominaler Abl. abs., Sinnrichtungen & Übersetzungsvarianten |
| 6 · Imperium & Politik | 5 | Provinzen & Ausdehnung, sieben Weltwunder & Stätten (München/Cambodunum), *cursus honorum* & Mischverfassung, Militär & Triumphzug, späte Republik |
| 7 · Augustus, Geist & Mythos | 4 | Augusteische Zeit (*pax Augusta*, *aurea aetas*, Werte, Horaz, Germanen), Alexander & Diogenes, Delphi/Olympia/Cumae, Ödipus & Antigone |
| 8 · Text & Methode | 4 | Verstehendes Lesen & Textstruktur, Konstruktions-/Einrückmethode, begründete Stellungnahme & Rezeption, Lernstrategien & Arbeitsplanung |

## Was außerhalb der App bleibt (`status: supported`)

Dreizehn Zeilen der Abdeckungsmatrix sind ehrlich als `supported` markiert:
- **L7-04, L7-07**: Lautes, quantitätsgerechtes Vortragen und direkte Aussprachekorrektur erfordern das Unterrichtsgespräch bzw. Lernpartner.
- **L7-05**: Das Paket trainiert exemplarische Kern- und Kulturvokabeln im Kontext; der Aufbau des vollständigen 1200-Wörter-Grundwortschatzes erfordert das eigene Lehrwerk.
- **L7-27, L7-36**: Schematische Schaubilder und Links zu den Münchner Antikenmuseen am Königsplatz und dem Archäologischen Park Cambodunum bereiten den Originalvergleich vor; echte Museums- und Ausgrabungsbesuche finden außerhalb der App statt.
- **L7-41, L7-44, L7-45–L7-50**: Selbstkontrolle, Strukturskizzen und Entwürfe schulen die Methodik; reale Partnerarbeit, Gruppenprojekte, Schaukästen, Unterrichtsgespräche und eigene langfristige Zeitorganisation bleiben Klassenraum- und Eigenarbeit.

## Bestandsabgleich (`replaces-de-by.json`)

Geprüft am `zam-os/zam`-Stand `4aeaa8e3455937f8a53cd57e686ff98d602a0561` (`tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`):

| Altzelle | Alte ID | Kategorie | Vorschlag / Ziel-Slug | Begründung |
| --- | --- | --- | --- | --- |
| `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` | `01K4T7A0000000000000000J01` | C | `keep-active` | Basis-AcI (Subjektsakkusativ) gehört in L1 zu Klasse 6 bzw. zu Latein L2 in Klasse 7. |
| `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` | `01K4T7A0000000000000000J02` | C | `keep-active` | Kompositkarte zu Basis-AcI (L6-L1 / L7-L2). |
| `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` | `01K4T7A0000000000000000J03` | C | `keep-active` | PPP (vorzeitig-passiv) ist Stoff der Klasse 6 (L1) bzw. Klasse 7 (L2). |
| `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` | `01K4T7A0000000000000000J04` | C | `keep-active` | Kompositkarte zu PPP/PPA-PC und dessen vier Übersetzungsvarianten (L6-L1 / L7-L2). |
| `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` | `01K8G8K0000000000000000J01` | A | `propose-replace-after-approval` → `l7-abl-abs-ppp-ppa-check` | Identisches Einzelwissen (Zeitverhältnis des Abl. abs. mit PPP = Vorzeitigkeit), im L1-Lehrplan Klasse 7. |
| `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` | `01K8G8K0000000000000000J02` | C | `keep-active` | Kompositkarte über gesamten Abl. abs., fünf Übersetzungswege und Beispielsatz. |
| `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` | `01K8G8K0000000000000000J03` | A | `propose-replace-after-approval` → `l7-konjunktiv-hauptsatz-check` | Identisches Einzelwissen (1. Pl. Konj. Präs. im Hauptsatz = Hortativ). |
| `de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio` | `01K8G8K0000000000000000J04` | C | `keep-active` | Kompositkarte inklusive Irrealis (L1 Klasse 6) und gesamter *consecutio temporum*. |

(`de-by:gymnasium-9-latein-gerundium-gerundivum-caesar-originallektuere` liegt inhaltlich vollständig in Klasse 8/9 und wurde nicht einbezogen.)

### Offene Frage an Thomas (Nachbarjahrgangs-Zelle)

`replaces-de-by.json` steht auf `"status": "proposal-only"` mit `"approved": null`; `cell.json` enthält keinerlei `replaces` oder `retired_items`. Zu entscheiden bleibt:
> Soll die ältere Klasse-8-Zelle (`de-by:gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio`) für die zwei A-Karten (`J01`, `J03`) diesem L7-L1-Paket zugeordnet werden, oder soll sie geschlossen bei Klasse 8 (bzw. Latein L2) verbleiben?

## Geprüfte Quellen (`source-checks.json`)

Alle vier angezeigten Quellen wurden am 25. November 2026 per `User-Agent: Mozilla/5.0` abgerufen und ihre tatsächlichen Seitentitel und SHA-256-Summen protokolliert:
1. `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/latein/1-fremdsprache` (`LehrplanPLUS - Gymnasium - 7 - Latein - Fachlehrpläne`)
2. `https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/latein` (`LehrplanPLUS - Gymnasium - Latein - Fachprofile`)
3. `https://www.antike-am-koenigsplatz.mwn.de/` (`Antike am Königsplatz`)
4. `https://www.apc-kempten.de/` (`Home | ARCHÄOLOGISCHER PARK CAMBODUNUM -`)
