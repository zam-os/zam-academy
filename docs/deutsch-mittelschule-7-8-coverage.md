# Lehrplanabgleich & Bestandsprüfung: Deutsch Mittelschule 7 und 8 (Bayern)

Stand: 2026-11-12  
Schulart: Mittelschule Bayern, Regelklasse (`R`) und Mittlere-Reife-Zug (`M`)  
Lehrplanbezug: [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/)

---

## 1. Deutsch 7 Mittelschule (`deutsch-mittelschule-7`)

### Abgerufene Lehrplanfassungen

| Zweig | Amtliche URL | SHA-256 (`tests/fixtures/`) |
| --- | --- | --- |
| Regelklasse (`R`) | `https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/deutsch/regelklasse` | `ca4bd05e334a7f02cb5058ed271097d9e7c2231e685b98874c0de05491709224` (`curriculum-r.html`) |
| Mittlere-Reife-Zug (`M`) | `https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/deutsch/mittlere-reife-klasse` | `b681bdce260c413ddfb8a2ee2b2750782dd5f3880c6537e6e475976b99accd57` (`curriculum-m.html`) |

### Umfang und Zweigabgrenzung

- **37 Lektionen**, **74 ZAM-Karten**, alle als Textwerkstätten mit Materialteil, zwei Fallentscheidungen, Regelkern, Kurzcheck, Aufgaben auf Niveau 1 (geführt) und Niveau 2 (Transfer) sowie Nachschlagewerk.
- **35 gemeinsame Kernlektionen (`R`, `M`)** + **1 reine R-Lektion** (`zeitungsannonce-geschaeftsbrief`: Zeitungsannonce und formeller Geschäftsbrief) + **1 reine M-Lektion** (`fachgespraech-mediation`: Fachgespräch, Moderation und Mediation) = **36 Lektionen pro Zweig**.
- Verteilte Lernbereiche (ohne amtliche Stundenangaben im Fachlehrplan):
  - `1` Sprechen und Zuhören (`sprechen`)
  - `2` Lesen – mit Texten und weiteren Medien umgehen (`lesen`)
  - `3` Schreiben (`schreiben`)
  - `4` Sprachgebrauch und Sprache untersuchen und reflektieren (`sprache`)
- Wo M-Zug-Kompetenzen vertiefte Begriffe fordern (z. B. *Textsortenwissen gezielt nutzen*, *Mediation*, *Hypotaxe/Parataxe*, *Konjunktiv-Ausblick*), binden die Atom-Curricula die M-Track-Zuordnung und Lektionstexte bzw. Niveau-2-Aufgaben nehmen den erweiterten Anspruch auf.

### Verifizierte Matrix (`deutsch-mittelschule-7/coverage.json`)

Geprüft mit `node scripts/check-curriculum.mjs`: **142 wörtliche Kompetenzerwartungen (`71 R` + `71 M`), 0 not found**.

| Zweig | `implemented` | `supported` | Gesamt |
| --- | ---: | ---: | ---: |
| `R` (Regelklasse) | 46 | 25 | 71 |
| `M` (M-Zug) | 46 | 25 | 71 |
| **Gesamt** | **92** | **50** | **142** |

**Als `supported` ausgewiesene Unterrichtsbereiche:** echtes akustisches Zuhören und freie Klassen- bzw. Mediationsgespräche, gestaltendes Sprechen und szenisches Spiel vor Publikum, Ganzschrift-Lektüre (*Jugendbuch*), Bibliotheks- und Internetrecherche im Alltag, reale Schreibkonferenzen sowie digitale Formatierungs- und Schreibwerkzeuge. Für jeden dieser Punkte stellt die App strukturierte Vorlagen, Checklisten und Transkript-Übungen bereit; die echte Sprech-, Hör- und Buchpraxis bleibt im Unterricht.

---

## 2. Deutsch 8 Mittelschule (`deutsch-mittelschule-8`)

### Abgerufene Lehrplanfassungen

| Zweig | Amtliche URL | SHA-256 (`tests/fixtures/`) |
| --- | --- | --- |
| Regelklasse (`R`) | `https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/deutsch/regelklasse` | `692db7ea77cdc31a1da39f77001fcd073be505e3ee9143a1f72f75d8d95ea2a1` (`curriculum-r.html`) |
| Mittlere-Reife-Zug (`M`) | `https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/deutsch/mittlere-reife-klasse` | `46d24327341db9054e2d42223a1049513e10bd7475a04aa7623909de62ace338` (`curriculum-m.html`) |

### Umfang und Zweigabgrenzung

- **37 Lektionen**, **74 ZAM-Karten** mit identischer Werkstatt-Architektur auf zwei Niveaustufen und integriertem Nachschlagewerk.
- **35 gemeinsame Kernlektionen (`R`, `M`)** + **1 reine R-Lektion** (`lernverhalten-und-lernplanung`: eigenes Lernverhalten, Lernplan, Lernstrategien und Bewerbungs-Zeitplan nach R 3.4) + **1 reine M-Lektion** (`bildsprache-metapher-symbolik`: Metapher, Vergleich und Symbolik als stilistische Bildsprache nach M 2.3/4.3) = **36 Lektionen pro Zweig**.
- Schwerpunkte der Jahrgangsstufe 8 sind berufsbezogene Kommunikation (Vorstellungsgespräch, Praktikumsbericht, Bewerbungsanschreiben, Lebenslauf), Gesprächsleitung/Debatte, Protokollieren, Sachtexte & journalistische Textsorten, Konjunktiv I/II inkl. indirekter Rede, Satzgefüge mit Finaladverbiale und Attributen sowie erweiterte Groß-/Klein-, Getrennt-/Zusammen- und Fremdwort-Rechtschreibung.

### Verifizierte Matrix (`deutsch-mittelschule-8/coverage.json`)

Geprüft mit `node scripts/check-curriculum.mjs`: **144 wörtliche Kompetenzerwartungen (`73 R` + `71 M`), 0 not found**.

| Zweig | `implemented` | `supported` | Gesamt |
| --- | ---: | ---: | ---: |
| `R` (Regelklasse) | 56 | 17 | 73 |
| `M` (M-Zug) | 53 | 18 | 71 |
| **Gesamt** | **109** | **35** | **144** |

**Als `supported` ausgewiesene Unterrichtsbereiche:** akustisches Hörverstehen zu längeren Hörspielen/Reportagen, reale Feedback- und Debattenrunden, rollenspielerische Vorstellungsgespräche, Lesen einer Ganzschrift, echte Bibliotheks-/Archivrecherche, handlungsorientierter Umgang mit Print-/Digitalmedien und eigenständige Schreibwerkzeuge.

---

## 3. Bestandsprüfung alter ZAM-Karten (`replaces-de-by.json`)

- Geprüfter Bestand in `zam-os/zam` (`e6a235f`, `tests/fixtures/curriculum/` und `src/kernel/library/bundled-cells.ts`): Für Deutsch an der bayerischen Mittelschule (Jahrgangsstufen 5–10) sind **keine** bestehenden `de-by:…`-Zellen vorhanden.
- Realschul-Bestände (`deutsch-realschule-*`) bleiben unangetastet.
- Beide Pakete führen daher in `replaces-de-by.json`:
  - `"status": "proposal-only"`
  - `"approved": null`
  - `"sources": []`, `"rows": []`
- Weder `deutsch-mittelschule-7/cell.json` noch `deutsch-mittelschule-8/cell.json` deklariert `replaces` oder `retired_items`.

---

## 4. Bewusste Einschränkungen und Ergänzungen

- **Keine Erklärvideos:** Wie in `AGENTS.md` §4 festgelegt, enthalten neue Pakete keine `teacherVideo`-Links; diese werden nach separater Prüfung ergänzt.
- **Keine freien Textkorrekturen:** Die App vergleicht eigene Antworten mithilfe von Kriterien-Checklisten und ausgebauten Musterlösungen; individuelle Sprachberatung bleibt Aufgabe der Lehrkraft.
- **Kein Fremdzugriff:** Fortschritt bleibt lokal im Browser (`localStorage`: `deutsch_ms7_progress_v1` bzw. `deutsch_ms8_progress_v1`), keine Drittanfragen.
