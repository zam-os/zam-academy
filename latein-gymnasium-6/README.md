# Latein 6 (1. Fremdsprache) · Gymnasium Bayern

Ein ZAM-Academy-Lernpaket für Latein als 1. Fremdsprache in Jahrgangsstufe 6 (2. Lernjahr) am bayerischen Gymnasium, erstellt nach dem [offiziellen LehrplanPLUS-Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/latein/1-fremdsprache) (abgerufen und geprüft am 24. November 2026).

Das Paket umfasst 44 Lektionen in acht Lernbereichen, 44 interaktive dreiteilige Begriffsschaubilder (SVG), 132 Werkstattziele mit live aktualisierten SVG-Ansichten bzw. einer Topografie-Karte des antiken Italiens und des Mittelmeerraums, 88 Kurzaufgaben und 88 Übersetzungs-/Schreibaufgaben auf zwei Niveaus sowie 132 verknüpfte ZAM-Karten. Die Abdeckungsmatrix in `coverage.json` bildet alle 52 übergeordneten Kompetenzerwartungen (`L6-01`–`L6-52`) ab; die offizielle Lehrplanseite nennt keine Stundenangaben je Lernbereich.

| Lernbereich | Schwerpunkte & interaktive Werkstätten |
| --- | --- |
| Wortschatz im Kontext, Wortbildung und Sprachbrücken | Polysemie im Kontext (`agere`, `petere`, `rēs`), Wortfamilien (`scrīb-`, `dūc-`), Wortbildung (`trāns-`, `-bilis`, `ob-`), Inschriften (`D. D.`, `castra pōnere`, `fidem servāre`) und Sprachbrücken zu Englisch (2. FS) & Romanisch |
| Nomina, Demonstrativa, Zahlen bis 1000 und `īre` | Konsonantische Sonder-Adjektive (`dīves`, `pauper`, `vetus`), Demonstrativpronomina (`hic`, `ille`, `iste` mit Sprecherperspektive), `īdem` & `ipse`, Zahlen bis 1000 & `mīlia` (Subtraktionsschieber) sowie Stammwechsel von `īre` und vier Stammformen |
| Verben: Passiv, Konjunktiv Präteritum und Partizipien | Passiv am Präsensstamm (Live-Umbau Aktiv ↔ Passiv, Inf. kons. `-ī`), Passiv am Perfektstamm (`PPP + esse`), Konjunktiv Imperfekt (Infinitiv-Bauplan), Konjunktiv Plusquamperfekt Aktiv/Passiv, PPA (`-ns`/`-iēns`/`euntis`) und PPP |
| Satzlehre: Neue Kasus, Nebensätze, passiver AcI und PC | Prädikativum & doppelter Nominativ/Akkusativ, neue Genitiv-/Dativ-/Ablativfunktionen (`datīvus fīnālis/commodī`, `quālitātis`, `obiectīvus`), Irrealis, `ut`/`nē`/`ut nōn`, vielseitiges `cum`, passiver AcI (2×2-Zeitmatrix) und *participium coniunctum* (4 Auflösungen live) |
| Italien, Mittelmeer, Pompeji und Griechenlands Geist | Interaktive 4-Ebenen-Karte von Kampanien, Magna Graecia, Karthago und Griechenland, Vesuvausbruch 79 n. Chr. (Pompeji & Herkulaneum), Plinius d. J. an Tacitus (`6,16` & `6,20` mit Vorleseskript), Fresko/Mosaik/`rotfigurige Vase`, Attische Demokratie & Archimedes |
| Römische Republik, Hannibal, Gesellschaft und Werte | Frühe Republik (Zeitstrahl `509–202 v. Chr.`, `Sēcessiō plēbis`, Zwölf Tafeln, Pyrrhos), Annuität/Kollegialität/Volkstribunat & Klientelwesen, Hannibal & 2. Punischer Krieg (`sociī`, Scīpiō bei Zama), Werte & Opfer (`cōnstantia`, `concordia`, `dō ut dēs`) und Antikenbezüge |
| Griechisch-römische Mythen, Unterwelt und Ovid | Europa (Stier) & Theseus (Ariadnefaden), Daedalus & Ikarus (*Inter utrumque volā!*), Orpheus & Eurydike (`Nōlī respicere!`), Trojanischer Krieg, Irrfahrten des Odysseus (*Nēmō*, Sirenen, Penelope) sowie Ovid (*Metamorphosen*) und der Bild-Text-Vergleich (Mythen-Galerie + Vorleseskript) |
| Satzanalyse, Übersetzen, Lernplan und Präsentation | PC-Klammern & eingeschobene Nebensätze knacken, Konstruktions- vs. Wortblockmethode, Fehleranalyse (Perfekt Passiv, KNG-Bezug), Stammformen- & Prüfungsplanung sowie Team-Präsentation |

Keine Lehrervideos (`AGENTS.md` Abschnitt 4). Echte Partner- und Klassengespräche, freie Vorträge im Kursraum, eigenständige Medien- und Bibliotheksrecherchen sowie außerschulische Museumsbesuche bleiben als `supported` außerhalb der App; die App liefert Materialtexte, lokale Sprachausgabe (sofern vorhanden), Musterlösungen und Kriterien. Alle 23 Quellenlinks wurden am 24. November 2026 live abgerufen und mit ihrem `<title>` in `source-checks.json` festgehalten.

## Nutzung

Öffne `dist/index.html` oder entpacke `release/ZAM-Academy-Latein-Gymnasium-6-offline.zip` und starte die HTML-Datei lokal im Browser. Alle Quellenlinks öffnen sich nur auf Klick.

Eine Lektion zählt als abgeschlossen nach ihren drei Werkstattzielen, dem Kurzcheck, beiden Kurzaufgaben und der Selbsteinschätzung auf Stufe 1 (bei den drei Vortragslektionen zusätzlich nach lokaler Sprachausgabe oder dem Haken für Partner-Vorlesen). Stufe 2 bietet weiterführende Transfer- und Übersetzungsaufgaben. Der Abschluss dokumentiert eigene Übung, keine Leistungsbewertung.

**Hinweis für Eltern und Lehrkräfte:** Antworten, eigene Entwürfe (z. B. Übersetzungen und Bild-Text-Vergleiche) sowie Häkchen bleiben ausschließlich lokal in diesem Browser auf diesem Gerät (`localStorage`, Schlüssel `zam-academy:latein-gymnasium-6:v1`). Es findet keine Übertragung, Auswertung oder Synchronisation statt. Wenn mehrere Schülerinnen und Schüler dasselbe Benutzerkonto teilen, klicke am Ende auf „Lokalen Fortschritt zurücksetzen“ – dies löscht auch alle freien Texte. Eine kleine schaltbare Erklärung („Wo bleibt mein Text?“) steht direkt neben jedem Schreibfeld.

## Entwicklung und Prüfung

```sh
npm ci
npx tsc --noEmit
npm test
npm run build
npm run package:zip
ZAM_CORE=file:///pfad/zu/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

`npm test` prüft vor Vitest automatisch die SHA-256-Prüfsummen aller vier LehrplanPLUS-Schnappschüsse sowie alle 52 Kompetenzzeilen in `coverage.json`. Als Referenz für `zam-core` dient Version `0.54.0` aus der Repository-CI. `npm run dev` läuft auf Port `5282`.

## Lehrplanabgrenzung und Alt-Kartenbestand

Dieses Paket deckt ausschließlich **Latein als 1. Fremdsprache (L1) in Jahrgangsstufe 6** ab und setzt `latein-gymnasium-5` fort. Inhalte der Jahrgangsstufe 7 und höher – insbesondere Deponentien, `ferre`, Steigerung (`tūtissimus`), `aliquis`, Konjunktiv Präsens/Perfekt (Hortativ/Optativ/indirekte Fragesätze), Partizip Futur Aktiv (PFA), Gerundium/Gerundivum, *Ablātīvus absolūtus* sowie Alexander der Große, Caesar, Cicero, Horaz, Augustus, Delphi oder Ödipus/Antigone – sind ausgeschlossen und werden durch die Testsuite überwacht.

Eine Bestandsprüfung in `zam-os/zam` (`67e190c2b7e5282851dfdd60ce21b69ed373dfa9`) ergab keine `de-by`-Zelle für Latein 5 oder 6. Die früheste existierende Lateinzelle ist die Nachbarzelle `de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen` (`J01`–`J04`). Gemäß Thomas' Entscheidung vom 24. November 2026 verbleibt sie vollständig beim künftigen Latein-7-Paket; `replaces-de-by.json` (`status: "proposal-only"`, `approved: null`) hinterlegt daher keinen Verlaufstransfer. Siehe [`docs/latein-gymnasium-6-coverage.md`](../docs/latein-gymnasium-6-coverage.md).
