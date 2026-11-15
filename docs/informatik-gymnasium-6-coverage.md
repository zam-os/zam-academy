# Informatik 6 Gymnasium · Lehrplanabgleich und Bestandsabgleich

Stand: 15. November 2026. Paket: [`informatik-gymnasium-6/`](../informatik-gymnasium-6/), 12 Lektionen in 3 Etappen, 36 Abrufkarten in der Zelle `zam-academy:informatik-gymnasium-6` (Version `2026.11.1`).

## Lehrplanbasis (LehrplanPLUS Bayern)

Am bayerischen Gymnasium wird Informatik in Jahrgangsstufe 6 als Schwerpunkt im Fach **Natur und Technik** (`NT6 2 Schwerpunkt Informatik`, ca. 28 Stunden, gemeinsam für alle Ausbildungsrichtungen) unterrichtet:

- **Quelle:** <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym>
- **Geprüft am:** 15. November 2026 (live abgerufen)
- **Archivierter HTML-Snapshot:** [`informatik-gymnasium-6/tests/fixtures/curriculum.html`](../informatik-gymnasium-6/tests/fixtures/curriculum.html)
- **SHA-256:** `90af78646f82002c9adadeaff133b45196de5e279a79ee06c168b2b70aeccea4`

Alle 14 Kompetenzerwartungen und 18 Inhaltsspiegelstriche aus `NT6 2.1`, `NT6 2.2` und `NT6 2.3` sind wortgetreu in [`informatik-gymnasium-6/coverage.json`](../informatik-gymnasium-6/coverage.json) erfasst. Die Prüfung mit `node scripts/check-curriculum.mjs` findet **32 Zeilen, 0 fehlend** (`checked 14 competences + 18 content bullets = 32 rows across 12 lessons, 0 missing`).

| Teilbereich | Std. (ca.) | Kompetenzen | Inhalte | Lektionen | Status in der App |
| --- | ---: | ---: | ---: | ---: | --- |
| `NT6 2.1` Informationsdarstellung mit Grafik-, Text- und Multimediadokumenten | 18 | 6 | 9 | 7 | 5 `implemented`, 1 `supported` (`2.1.6`) |
| `NT6 2.2` Projekt: Multimediapräsentation | 5 | 4 | 5 | 2 | 3 `implemented`, 1 `supported` (`2.2.1`) |
| `NT6 2.3` Hierarchische Informationsstrukturen – Dateisystem | 5 | 4 | 4 | 3 | 3 `implemented`, 1 `supported` (`2.3.4`) |

### Was im Präsenzunterricht bleibt (`status: "supported"`)

- **`NT6 2.1.6`:** Grundfunktionen (Speichern, Öffnen, Schließen, Kopieren, Einfügen, Formatieren, Ebenen/Gruppierung) werden in Werkstätten modelliert; das Arbeiten an echten Dokumentdateien in der Schulsoftware bleibt im Unterricht.
- **`NT6 2.2.1`:** Das Erstellen einer eigenen Multimediapräsentation und das freie Vortragen vor einer Gruppe erfolgen im Projektunterricht; die App bereitet Kriterien (Textanteil, Schriftgröße, Kontrast, Animationen), Zeitplanung sowie Urheberrecht/Quellen vor.
- **`NT6 2.3.4`:** Das Anlegen und Aufräumen echter Ordner- und Dateihierarchien im Dateimanager erfolgt am Schulrechner; die App trainiert die dahinterliegende Baumstruktur, die OOP-Modellierung (`ORDNER` mit rekursiver Enthält-Beziehung, `DATEI`) sowie absolute und relative Pfade.

## Bestehende ZAM-Karten (`replaces-de-by.json`)

In `zam-os/zam` (Stand `source_commit`: `60cd6c90e820f014a4feb17c6c1ba6734895ae2f`) gehört die bestehende Zelle **`de-by:gymnasium-6-natur-technik-informatik-vektorgrafik-texte`** (8 Karten: `01K4YT6J000000000000000J01` bis `J08`) unmittelbar zu Informatik 6 Gymnasium. Eine bytegenaue Kopie liegt unter [`informatik-gymnasium-6/tests/fixtures/de-by-gymnasium-6-natur-technik-informatik-vektorgrafik-texte.json`](../informatik-gymnasium-6/tests/fixtures/de-by-gymnasium-6-natur-technik-informatik-vektorgrafik-texte.json) (SHA-256 `fde44ed318c3b620c824db95510d4709fc2c83feee3b2e1e47a87d58fbffdb23`).

[`informatik-gymnasium-6/replaces-de-by.json`](../informatik-gymnasium-6/replaces-de-by.json) ist gemäß Entscheidungsregel als **unfreigegebener Entwurf** (`"status": "proposal-only"`, `"approved": null`) angelegt; [`informatik-gymnasium-6/cell.json`](../informatik-gymnasium-6/cell.json) enthält deshalb noch **keine** `replaces`- und **keine** `retired_items`-Einträge.

### Vorgeschlagene Zuordnung zu `de-by:gymnasium-6-natur-technik-informatik-vektorgrafik-texte` (2 A · 0 B · 6 C)

| Alt-ID (kurz) | Alt-Thema | Kat. | Vorgeschlagene Aktion | Vorgeschlagener Ziel-Slug / Begründung |
| --- | --- | :---: | --- | --- |
| `…J01` | Verlustfreie Skalierung von Vektor- vs. Pixelgrafik | **A** | `propose-replace-after-approval` | `inf6-vektor-pixelgrafik-skalierung` – deckungsgleicher Tier-1-Abruf zu Objekten vs. festem Pixelraster. |
| `…J02` | Vektor vs. Pixel + 24-Bit-Speicherrechnung (6 MB) | **C** | `keep-active` | Verknüpft eine komplexe Tier-2-Bündelfrage mit 24-Bit-TrueColor-Rechnung über `NT6 2.1` hinaus; nicht automatisch ersetzen. |
| `…J03` | Additives RGB-Farbmodell (`255, 255, 255` = Weiß) | **C** | `keep-active` | RGB-Werte sind in `NT6 2.1` (LehrplanPLUS) nicht vorgegeben; Lernhistorie bleibt separat aktiv. |
| `…J04` | RGB vs. CMYK mit 24-Bit-Farbtiefe | **C** | `keep-active` | Weiterführender Farbmodell-Vergleich außerhalb von `NT6 2.1`; Lernhistorie bleibt aktiv. |
| `…J05` | Attribute Zeilenabstand/Ausrichtung → Klasse `ABSATZ` | **A** | `propose-replace-after-approval` | `inf6-textdokumente-absatz` – identische atomare Zuordnung der Absatzattribute. |
| `…J06` | 4-Ebenen-Textmodell mit `ABSCHNITT` | **C** | `keep-active` | `NT6 2.1` nennt ausdrücklich nur `TEXTDOKUMENT`, `ABSATZ` und `ZEICHEN` (ohne `ABSCHNITT`). |
| `…J07` | Rolle der Masterfolie (Folienmaster) | **C** | `keep-active` | Prüft gezielt das Werkzeug Masterfolie, das `NT6 2.1/2.2` nicht verpflichtend festlegt. |
| `…J08` | Präsentationshierarchie inkl. Masterfolie & 6×6-Regel | **C** | `keep-active` | Verbindet Masterfolie, Übergänge und starre 6×6-Regel statt der offenen Kriterien aus `NT6 2.2`. |

## Abgrenzung zu Nachbar-Jahrgangsstufen (und Rückfrage an Thomas)

- **`de-by:gymnasium-7-informatik-objektorientierung-hypertext-datenstrukturen` (`J01–J04`):** Gehört zu Jahrgangsstufe 7 (UML-Klassendiagramme mit Attribut- und Methodenabschnitten, Hypertext/HTML-DOM-Baum, relative Web-Pfade). Dieses Paket lässt diese Zelle vollständig unberührt.
- **`de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` (`J01–J08`) — Abgleich mit #136 und Rückfrage für den PR:**
  Diese ältere gemischte Klasse-5-Zelle wurde inzwischen in [`biologie-gymnasium-5/replaces-de-by.json`](../biologie-gymnasium-5/replaces-de-by.json) (#136, freigegeben am 14. November 2026) vollständig aufgeführt (`J03` ersetzt, `J01–J02` und `J04` als Kategorie C `keep-active`), während die alten Informatik-Karten **`J05–J08`** (OOP: Klasse/Objekt/Zustand/Methode/Punktnotation sowie hierarchische Dateisysteme mit `.` und `..`, absoluten und relativen Pfaden) dort mit ausdrücklichem Hinweis auf `NT6` / `NT6 2.3` ebenfalls als Kategorie C (`keep-active`) belassen wurden.
  Damit keine Karte doppelt von zwei Paketen beansprucht wird, bleibt `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` hier **unangetastet**. **Frage an Thomas:** Sollen die vier in #136 aktiv belassenen Informatik-Karten `J05–J08` aus `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` dauerhaft dort auf `keep-active` bleiben, oder soll ein eigener Folgeschritt einzelne davon später über `informatik-gymnasium-6` ersetzen bzw. aus dem aktiven Bestand nehmen?
