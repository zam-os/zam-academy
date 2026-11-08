# Gymnasium Bayern · Abdeckung Mathematik Jahrgangsstufe 13

Arbeitsstand: 8. November 2026. Paket [`mathematik-gymnasium-13/`](../mathematik-gymnasium-13/),
Zelle `zam-academy:mathematik-gymnasium-13` (Vorschau). Grundlage ist der
Fachlehrplan [Mathematik 13 (erhöhtes Anforderungsniveau)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/13/mathematik)
des Gymnasiums, am 8. November 2026 direkt von lehrplanplus.bayern.de gelesen
(ohne Archivfassung; SHA-256 des gelesenen HTML in
[`source.json`](../mathematik-gymnasium-13/src/curriculum/source.json)). Es ist
der einzige Fachlehrplan für Mathematik 13 am Gymnasium: Das Fach wird dort nur
mit erhöhtem Anforderungsniveau geführt, die einstündige Differenzierungsstunde
hat keinen eigenen Fachlehrplan. Eine Zweig- oder Kursauswahl gibt es nicht.

## Lernbereiche und Etappen

| Lernbereich | Stunden | Kompetenzerwartungen | Etappe und Lektionen |
| --- | --- | --- | --- |
| M13 1 Flächeninhalt und bestimmtes Integral | ca. 26 | 8 | 1: `int-1` bis `int-9` |
| M13 2 Normalverteilung | ca. 14 | 4 | 2: `nv-1` bis `nv-4` |
| M13 3 Geraden und Ebenen im Raum | ca. 24 | 6 | 3: `rg-1` bis `rg-9` |
| M13 4 Anwendungen der Differential- und Integralrechnung | ca. 20 | 4 | 4: `aw-1` bis `aw-5` |

27 Lektionen, 84 Karten. Alle 22 Kompetenzerwartungen stehen wortgleich mit
ihren Lektionen und Belegen in [`coverage.json`](../mathematik-gymnasium-13/coverage.json);
der Vertragstest prüft die Zuordnung in beide Richtungen gegen `source.json`
(26 + 14 + 24 + 20 = 84 Stunden, 8 + 4 + 6 + 4 Erwartungen). Zwei
Kompetenzerwartungen teilen sich Lektionen, weil ihr Inhalt zwei zusammenhängende
Verfahren umfasst: Die Flächen-KE inklusive der uneigentlichen Integrale liegt in
`int-6` und `int-7`, die Kugel-KE und die Anwendungs-KE in `rg-9`. `aw-4`
erfüllt die Extremwert-KE und die Anwendungs-KE zugleich.

## Abgrenzung

- **Nicht enthalten, weil nicht im Fachlehrplan M13:** der Vertiefungskurs M12
  (Komplexe Zahlen, Folgen und Reihen, Matrizen, Zahlentheorie und Kryptologie,
  Statistik), gebrochen-rationale Funktionen und ihre Asymptoten (M12), der Satz
  von Moivre-Laplace, Hypothesentests und Binomialverteilung (M12).
- **Wiederholung aus M12, ausdrücklich als Auffrischung behandelt:** Stamm- und
  Integralfunktionen, Potenz-, Produkt- und Kettenregel (`int-5`, `aw-1`).
  Vorausgesetzt werden die Differentialrechnung der Jahrgangsstufen 11/12 und
  die natürliche Exponentialfunktion.
- **Uneigentliche Integrale** sind in M13 1 ausdrücklich gefordert und liegen
  darum in einer eigenen Lektion (`int-7`), nicht nur als Randnotiz der
  Flächenberechnung.
- **Dynamische Mathematiksoftware** wird in den Kompetenzerwartungen von
  M13 1, 2 und 4 genannt; die Labore (`integralfunktion`, `graph-schluss`,
  `normalverteilung`, `verkettet`) übernehmen genau diese Rolle. Zeichnen mit
  DGS, schriftliche Ausarbeitung und Präsentation geschehen außerhalb der App.
- **Hesse'sche Normalform und Abstände** (M13 3) rechnet `rg-8` über
  Kreuzprodukt und normierte Ebenengleichung; die Sonderlagen von Ebenen
  (`rg-4`) kommen vor den Lagebeziehungen, damit die Abstände darauf aufbauen.
- **Notation:** Parameterform g: X = A + t·u und E: X = P + r·u + s·v,
  Koordinatenform n⃗·X = d, Kugel in Koordinatenform, Winkel stets der spitze
  Schnittwinkel. Negative Zahlen mit echtem Minus „−", Dezimalzahlen mit Komma.

## Was die Lektionen leisten

Jede Lektion hat Erklärung mit durchgerechnetem Beispiel und Merksatz, Formeln
für die Formelsammlung, einen Schnellcheck, ein Labor mit drei erreichbaren
Aufträgen (keiner bei den Startwerten) und mindestens zwei
Aufgabengeneratoren mit je Level 1 (geführt, mit Formelhinweis) und Level 2
(Transfer im Stil der Abiturprüfung). Ein Abschluss verlangt Schnellcheck, alle
drei Laboraufträge und je drei richtige Aufgaben auf beiden Stufen.

## Lehrervideos

Keine. Nach dem Paketstandard kommen Videos als separater Schritt und werden
dann einzeln per YouTube-oEmbed geprüft; die Lektionen tragen vorerst
`teacherVideo: undefined`. Deshalb trägt das Paket den Vorschauvermerk.
