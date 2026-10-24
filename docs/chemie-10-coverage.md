# Chemie 10 Realschule: Lehrplanabgleich und Kartenzuordnung

Stand 24.10.2026. Paket [`chemie-realschule-10/`](../chemie-realschule-10/).

## Quelle

LehrplanPLUS Realschule Chemie 10, abgerufen am 24.10.2026 direkt (HTTP 200):

- Zweig I: https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/chemie/wpfg1
- Zweig II/III: https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/chemie/wpfg2-3

`coverage.json` enthält jede Kompetenzerwartung wörtlich (Zweig I: 35, Zweig
II/III: 50) mit Lektionen und Nachweis. Der Paket-Test prüft: jede Zeile hat
eine Lektion, die Lektion gehört zu diesem Zweig und (außer bei den
prozessbezogenen LB-1-Kompetenzen) zu genau diesem Lernbereich; jede Lektion
deckt in jedem ihrer Zweige eine Kompetenz ab.

## Lernbereiche

| Zweig I | Std. | Zweig II/III | Std. |
| --- | --- | --- | --- |
| LB 1 Wie Chemiker denken und arbeiten | integriert | LB 1 Wie Chemiker denken und arbeiten | integriert |
| LB 2 Donator-Akzeptor-Konzept – Protonenübergänge II | 7 | LB 2 Donator-Akzeptor-Konzept – Elektronenübergänge | 12 |
| LB 3 Herkunft organischer Verbindungen – Fotosynthese | 5 | LB 3 Donator-Akzeptor-Konzept – Protonenübergänge | 10 |
| LB 4 Grundlegende Reaktionen organischer Moleküle | 12 | LB 4 Herkunft organischer Verbindungen – Fotosynthese | 5 |
| LB 5 Biomoleküle (zwei aus 5.1 Proteine, 5.2 Kohlenhydrate, 5.3 Fette) | 12 | LB 5 Grundlegende Reaktionen organischer Moleküle | 9 |
| LB 6 Moderne Werkstoffe – Kunststoffe und Silikone | 12 | LB 6 Wahlbereich (zwei aus 6.1 Redoxanwendungen, 6.2 Proteine, 6.3 Kohlenhydrate, 6.4 Fette, 6.5 Kunststoffe) | 12 |

Die Zweige unterscheiden sich im Inhalt, nicht nur in der Tiefe:

- Nur Zweig I: pH-Wert und Oxoniumionen-Konzentration mit Verdünnungsreihe,
  Titration, Mechanismus der Addition, radikalische Substitution, sekundäre
  Alkanole zu Alkanonen, Silikone, Ökobilanz eines biogenen Kunststoffs.
- Nur Zweig II/III: Elektronenübergänge (Ionenbildung, Teilgleichungen,
  Salzformeln, Gitter- und Hydratationsenergie), saure und alkalische
  Lösungen mit Indikatoren, Brönsted, Protolysen und Säurereste,
  Redoxanwendungen (Batterie, Akku, Brennstoffzelle).
- Gemeinsam: Gefahrstoffe, Neutralisation, saure Lösungen mit Carbonaten und
  Metallen, Fotosynthese und Rohstoffe, Addition, Oxidation primärer
  Alkanole, Ester, Biomoleküle, Polymerisation, Polykondensation,
  Kunststoffklassen, Kunststoffabfall.

## Nachbarjahrgänge und andere Pakete

- Zweig I hat in C9 (I) Elektronenübergänge (LB 3), Redoxanwendungen (LB 4)
  und Indikatoren/Brönsted/Säurereste (LB 5) gelernt; `chemie-realschule-9`
  lehrt sie dort. In Chemie 10 stehen die entsprechenden II/III-Lektionen für
  Zweig I nur als freiwillige Ergänzung ohne Lehrplanbindung; ihre Karten sind
  nur an Zweig II/III gebunden, damit ein ZAM-Lernender der Gruppe I sie nicht
  doppelt erhält.
- Kohlenwasserstoffe, funktionelle Gruppen und Benennung kommen aus C9
  (beide Zweige) und werden hier vorausgesetzt („Wiederholung aus C9“).
- Stoffmenge und molare Masse kennt Zweig I aus C8 (LB 4); die Titration
  rechnet damit.
- Mesomerie, Autoprotolyse, Ionenprodukt und pH = −lg c sind Gymnasialstoff
  und werden nicht gelehrt.

## Lektionen je Lernbereich


### Zweig I

| LB | Kompetenzen | Lektionen |
| --- | --- | --- |
| 1 | 5 | `ch-gefahrstoffe`, `ch-proteinstruktur`, `ch-saccharose-polysaccharide`, `ch-kunststoffklassen`, `ch-versuche-planen`, `ch-ester-eigenschaften`, `ch-rohstoffe`, `ch-kunststoffabfall`, `ch-biokunststoff-oekobilanz`, `ch-aminosaeuren`, `ch-fette` |
| 2 | 3 | `ch-neutralisation`, `ch-titration`, `ch-ph-oxonium`, `ch-carbonate-metalle` |
| 3 | 4 | `ch-kohlenstoff-nachweis`, `ch-fotosynthese`, `ch-energiegehalt`, `ch-rohstoffe` |
| 4 | 5 | `ch-addition`, `ch-substitution`, `ch-oxidationszahlen-organisch`, `ch-alkanole-oxidation`, `ch-alkanone`, `ch-estersynthese`, `ch-ester-eigenschaften` |
| 5.1 | 4 | `ch-aminosaeuren`, `ch-peptide`, `ch-proteinstruktur` |
| 5.2 | 4 | `ch-glucose-fructose`, `ch-saccharose-polysaccharide` |
| 5.3 | 3 | `ch-glycerin`, `ch-fette` |
| 6 | 7 | `ch-polymerisation`, `ch-polykondensation`, `ch-silikone`, `ch-kunststoffklassen`, `ch-biokunststoff-oekobilanz`, `ch-kunststoffabfall` |

### Zweig II/III

| LB | Kompetenzen | Lektionen |
| --- | --- | --- |
| 1 | 11 | `ch-gefahrstoffe`, `ch-versuche-planen`, `ch-kohlenstoff-nachweis`, `ch-redox-teilgleichungen`, `ch-batterie-akku`, `ch-hydratation`, `ch-ester-eigenschaften`, `ch-gitterenergie`, `ch-broensted`, `ch-salzformeln`, `ch-estersynthese`, `ch-brennstoffzelle`, `ch-kunststoffabfall` |
| 2 | 7 | `ch-ionenbildung`, `ch-redox-teilgleichungen`, `ch-gitterenergie`, `ch-salzformeln`, `ch-hydratation` |
| 3 | 7 | `ch-saure-alkalische-loesungen`, `ch-broensted`, `ch-protolyse-saeurereste`, `ch-neutralisation`, `ch-carbonate-metalle` |
| 4 | 4 | `ch-kohlenstoff-nachweis`, `ch-fotosynthese`, `ch-energiegehalt`, `ch-rohstoffe` |
| 5 | 4 | `ch-addition`, `ch-oxidationszahlen-organisch`, `ch-alkanole-oxidation`, `ch-estersynthese`, `ch-ester-eigenschaften` |
| 6.1 | 3 | `ch-batterie-akku`, `ch-brennstoffzelle` |
| 6.2 | 4 | `ch-aminosaeuren`, `ch-peptide`, `ch-proteinstruktur` |
| 6.3 | 4 | `ch-glucose-fructose`, `ch-saccharose-polysaccharide` |
| 6.4 | 3 | `ch-glycerin`, `ch-fette` |
| 6.5 | 3 | `ch-polymerisation`, `ch-polykondensation`, `ch-kunststoffklassen`, `ch-kunststoffabfall` |


## Bestehende ZAM-Karten (Vorschlag, nicht freigegeben)

Quelle: zam-os/zam, Commit `87a708b43bb380f75827b5c589ee58cc9679c744`,
`tests/fixtures/curriculum/`. Byte-genaue Kopien liegen in
`chemie-realschule-10/tests/fixtures/` mit SHA-256 in `replaces-de-by.json`.

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 5 | gleicher atomarer Abruf, ein Nachfolger bekommt `replaces` |
| B | 2 | ganze alte Synthesefrage samt Antwort und Musterlösung auf eigener Karte |
| C | 9 | kein Nachfolger in dieser Zelle; alle bleiben aktiv |

| Altes Item | Kat. | Nachfolger | Begründung |
| --- | --- | --- | --- |
| `J01` organik-kohlenwasserstoffe: Wie lautet die allgemeine Summenformel der unverzweigten Alkane (gesät… | C | — | Allgemeine Summenformel der Alkane. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. |
| `J02` organik-kohlenwasserstoffe: Nenne die ersten sechs Glieder der homologen Reihe der Alkane (Methan … | C | — | Homologe Reihe und Verbrennung von Propan. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. |
| `J03` organik-kohlenwasserstoffe: Wie bezeichnet man Moleküle mit identischer Summenformel, aber untersc… | C | — | Konstitutionsisomerie. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. |
| `J04` organik-kohlenwasserstoffe: Zeichne und benenne die beiden Strukturisomere von Butan (C4H10: n-But… | C | — | Butan-Isomere und Van-der-Waals-Kräfte. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. |
| `J05` organik-kohlenwasserstoffe: Welche funktionelle Gruppe ist charakteristisch für die Stoffklasse de… | C | — | Hydroxygruppe der Alkohole. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. |
| `J06` organik-kohlenwasserstoffe: Erkläre, warum Ethanol (C2H5OH, Siedepunkt 78 °C) bei Raumtemperatur f… | C | — | Siedetemperatur und Löslichkeit von Ethanol. Gehört zu Chemie 9 (LehrplanPLUS C9, Kohlenwasserstoffe und funktionelle Gruppen, beide Zweige; Lektionen ch-kohlenwasserstoffe/ch-funktionelle-gruppen der Zelle zam-academy:chemie-realschule-9). Chemie 10 lehrt das nicht neu, deshalb kein Nachfolger in dieser Zelle; die Karte bleibt aktiv. Verwandt: die C10-Karte zu Ester-Siedetemperaturen nutzt dasselbe Argument (Wasserstoffbrücken), fragt aber etwas anderes ab. |
| `J07` organik-kohlenwasserstoffe: Welche Produkte entstehen bei der säurekatalysierten Veresterung einer… | A | `c10-ester-produkte` | Gleicher atomarer Abruf: Produkte der Veresterung (Ester und Wasser). Die neue Karte sagt ‚Alkansäure‘ und ‚Alkanol‘ wie der LehrplanPLUS; die Abrufanforderung bleibt gleich. |
| `J08` organik-kohlenwasserstoffe: Beschreibe den sauren Charakter der Carboxylgruppe (-COOH) am Beispiel… | C | — | Zweiteilige Synthese: Protolyse der Essigsäure mit Mesomeriestabilisierung des Acetations (nicht im LehrplanPLUS Realschule) und Estersynthese. Ein B-Nachfolger würde die Mesomerie in die Realschulzelle tragen; die beiden Teile fragen getrennte Karten ab. Fachlich nicht falsch, deshalb keine Stilllegung vorgeschlagen. |
| `J01` saeuren-basen-neutralisation: Wie wird eine Säure nach der Brönstedschen Definition charakterisiert? | A | `c10-broensted-saeure` | Gleicher atomarer Abruf: Säure nach Brönsted = Protonendonator. Hinweis: Die Nachfolgelektion ist in C10 nur an Zweig II/III gebunden (Zweig I lernt Brönsted in C9); die Historie zieht trotzdem unverändert um. |
| `J02` saeuren-basen-neutralisation: Definiere Säuren und Basen nach Johannes Nicolaus Brönsted, erkläre de… | C | — | Ampholyt und korrespondierende Säure-Base-Paare stehen nicht im LehrplanPLUS Chemie 10 Realschule; die Synthese verlangt mehr als die C10-Karten. Inhalt fachlich richtig, Karte bleibt aktiv. |
| `J03` saeuren-basen-neutralisation: Um welchen Faktor ändert sich die Konzentration der Oxonium-Ionen c(H3… | A | `c10-ph-faktor` | Gleicher atomarer Abruf mit denselben Zahlen (pH 3 → 5, Faktor 100). Nachfolgelektion ch-ph-oxonium ist an Zweig I LB 2 gebunden. |
| `J04` saeuren-basen-neutralisation: Erkläre die Autoprotolyse des reinen Wassers, formuliere das Ionenprod… | C | — | Autoprotolyse, Ionenprodukt K_w und pH = −lg c(H₃O⁺) sind Gymnasialstoff, nicht LehrplanPLUS Realschule 10. Inhalt fachlich richtig, kein Nachfolger in dieser Zelle; Karte bleibt aktiv. |
| `J05` saeuren-basen-neutralisation: Welche Ionenreaktion stellt das chemische Wesen jeder Neutralisation i… | A | `c10-neutralisation-ionen` | Gleicher atomarer Abruf: H₃O⁺ + OH⁻ → 2 H₂O als Teilchenreaktion jeder Neutralisation. |
| `J06` saeuren-basen-neutralisation: Formuliere die vollständige Stoff- und Ionenreaktionsgleichung für die… | B | `c10-neutralisation-legacy-synthese` | Die ganze mehrteilige Frage (Stoff- und Ionengleichungen HCl/NaOH und H₂SO₄/KOH, Bromthymolblau am Äquivalenzpunkt) bleibt mit Antwort und Musterlösung wortgleich auf einer eigenen Karte; der Inhalt liegt im LehrplanPLUS C10 (Neutralisation, Indikatoren). |
| `J07` saeuren-basen-neutralisation: Welche fundamentale Stoffmengenbeziehung gilt am Äquivalenzpunkt bei d… | A | `c10-titration-aequivalenz` | Gleicher atomarer Abruf: c(Säure) · V(Säure) = c(Lauge) · V(Lauge) am Äquivalenzpunkt; die neue Karte schreibt die Formel als gesprochenes Mathematiksegment. |
| `J08` saeuren-basen-neutralisation: Beschreibe den Versuchsaufbau einer Säure-Base-Titration (Bürette mit … | B | `c10-titration-legacy-synthese` | Die ganze Synthese (Versuchsaufbau der Titration und Berechnung c(HCl) = 0,075 mol/l) bleibt mit Antwort und Musterlösung wortgleich auf einer eigenen Karte; Titration ist C10 Zweig I LB 2, die Stoffmenge kennt Zweig I aus C8. |


Gemäß Paketstandard erscheint die Zelle zuerst ohne `replaces` und
`retired_items` (Version 2026.10.1). Nach Thomas' Freigabe trägt eine neue
Version die sieben `replaces` (A und B); `approved` erhält dann das Datum.
`scripts/validate-migration.mjs` probt den Vorschlag bereits in Wegwerf-
Bibliotheken.
