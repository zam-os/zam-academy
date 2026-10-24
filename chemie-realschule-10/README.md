# Chemie 10 Realschule · ZAM Academy

Chemie für die 10. Klasse der bayerischen Realschule nach LehrplanPLUS: zwei
getrennte Lernpfade, digitale Modelle und Aufgaben auf zwei Niveaus. Die App
wird unter `https://academy.zam-os.org/chemie-realschule-10/` veröffentlicht.

## Lernpfade und Umfang

40 Lektionen in acht Etappen. Zweig I hat **30 Lektionen**, Zweig II/III
**34**; 24 Lektionen werden gemeinsam genutzt. Eine erste Nutzung beginnt mit
Zweig II/III und Level 1. Der Zweig ist jederzeit im Lernpfad auswählbar.

| Etappe | Inhalt | Zweig I | Zweig II/III |
| --- | --- | --- | --- |
| 1 Wie Chemiker denken und arbeiten | Gefahrstoffe, Hypothesen und Protokolle | LB 1 | LB 1 |
| 2 Elektronenübergänge | Ionenbildung, Teilgleichungen, Salzformeln, Gitterenergie, Hydrathülle | freiwillige Wiederholung (C9 I) | LB 2: fünf Lektionen |
| 3 Säuren, Basen und Neutralisation | saure/alkalische Lösungen, Brönsted, Säurereste, pH und Verdünnung, Neutralisation, Titration, Carbonate und Metalle | LB 2: pH, Neutralisation, Titration, Carbonate | LB 3: ohne pH-Konzentration und Titration |
| 4 Herkunft organischer Verbindungen | Kohlenstoffnachweis, Fotosynthese, Energiegehalt, Rohstoffe | LB 3 | LB 4 |
| 5 Reaktionen organischer Moleküle | Addition, Substitution, Oxidationszahlen, Alkanole, Alkanone, Ester | LB 4: alle sieben | LB 5: ohne Substitution und Alkanone |
| 6 Biomoleküle | Aminosäuren, Proteine, Kohlenhydrate, Glycerin, Fette | LB 5 (Wahl 2 aus 3) | LB 6.2–6.4 (Wahlbereich) |
| 7 Kunststoffe und Silikone | Polymerisation, Polykondensation, Kunststoffklassen, Silikone, Verwertung, Ökobilanz | LB 6: alle sechs | LB 6.5: ohne Silikone und Ökobilanz |
| 8 Redoxanwendungen | Batterie/Akku, Brennstoffzelle | freiwillige Wiederholung (C9 I) | LB 6.1 (Wahlbereich) |

Die App bietet alle Wahl-Teilbereiche an; die Lehrkraft wählt zwei. Lektionen
eines anderen Zweigs stehen als freiwillige Ergänzung im aufklappbaren
Bereich. Jede Lektion hat eine Erklärung mit Beispiel, einen Merksatz,
Begriffe für die Formelsammlung, einen Schnellcheck, ein Labor mit drei
prüfbaren Aufträgen (29 Modelle, 11 Modellversuche) und mindestens zwei
Aufgabengeneratoren. Level 1 gibt Werte und Modellhilfe, Level 2 stellt eine
andere Transferaufgabe; typische Rechenfehler bekommen einen gezielten
Hinweis. Für den
Abschluss braucht es Schnellcheck, alle Laboraufträge und drei gelöste
Aufgaben auf Level 1.

Die App läuft ohne Konto und ohne Fremdanfragen. Fortschritt bleibt unter
einem eigenen Schlüssel im Browser (`chemie_rs10_academy_progress_v1`).

## Modelle und fachliche Grenzen

Die Labore sind digitale Schulmodelle. Sie sind keine Anleitung für
unbeaufsichtigte Versuche.

- Gitterenergien und Schmelztemperaturen sind gerundete Tabellenwerte; das
  Lösungslabor nutzt frei einstellbare Energiebeträge.
- Neutralisation und Titration rechnen mit einprotonigen starken Säuren und
  Laugen bei etwa 25 °C; am Äquivalenzpunkt ist die Lösung neutral.
- Die Verdünnungsreihe endet bei pH 5, weil Verdünnen nur gegen pH 7 geht.
- Das Kalorimeter rechnet ohne Wärmeverluste; Aufgaben erklären, warum
  Schulversuche kleinere Werte liefern.
- Oxidationszahlen von C-Atomen: Bindung zu O +1, H-Atom −1, C–C 0.
- Fett-Modell: höchstens ein ungesättigter Rest → bei 20 °C fest, zwei oder
  drei → flüssig. Reale Fette sind Gemische.
- Kunststoff- und Silikonlabore nutzen Modellgrenzen (100 °C, 220 °C,
  Vernetzeranteil 20 %); jeder reale Stoff hat eigene Werte.

## Die ZAM-Zelle und bestehende Lernstände

`cell.json` ist die einzige Kartenquelle: **40 Atome, 100 Karten**. Chemische
Formeln stehen als Segmente mit TeX und deutscher Sprechfassung in der Karte;
nur die beiden B-Karten behalten den alten Text unverändert. Jede
Karte zitiert ihre Lektion als
`https://academy.zam-os.org/chemie-realschule-10/#lesson=<id>` und trägt die
Lernbereichsbindung jedes Zweigs. Alle Schnellkarten haben einen binären
Schnellcheck und zwei kuratierte Distraktoren mit Begründung.

`replaces-de-by.json` ordnet alle **16 Items** der beiden alten Zellen
`de-by:realschule-10-chemie-organik-kohlenwasserstoffe` und
`de-by:realschule-10-chemie-saeuren-basen-neutralisation` zu (zam-os/zam
`87a708b4`): **5 A, 2 B, 9 C**. Das Mapping ist ein **Vorschlag**
(`"approved": null`, `"status": "proposal-only"`). Die Zelle erscheint
deshalb zunächst ohne `replaces` und `retired_items`; Thomas gibt das Mapping
frei, danach folgt eine Version mit den sieben `replaces`. Die beiden
B-Nachfolger tragen schon jetzt Frage, Antwort und Musterlösung der alten
Synthesekarten wortgleich.

`scripts/validate-migration.mjs` prüft mit `zam-core` 0.54.0: Die jetzige
Zelle lässt alle 16 alten Karten und 32 Reviews unverändert; die Probe des
Vorschlags verschiebt sieben Historien und lässt neun C-Karten aktiv; hält
eine Person alte und neue Karte, verweigert der Kernel die Zusammenführung.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5201/chemie-realschule-10/
npm test
npm run typecheck
npm run build        # dist/index.html, eine Datei
npm run package:zip  # release/ZAM-Academy-Chemie-10-offline.zip
```

Vom Repository-Hauptverzeichnis mit dem in CI installierten Kern:

```sh
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node chemie-realschule-10/scripts/validate-migration.mjs
```

## Quellen

- [LehrplanPLUS Chemie 10, Realschule, Zweig I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/chemie/wpfg1), geprüft am 24.10.2026.
- [LehrplanPLUS Chemie 10, Realschule, Zweig II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/chemie/wpfg2-3), geprüft am 24.10.2026.
- Abgleich der Kompetenzen und Karten: [`docs/chemie-10-coverage.md`](../docs/chemie-10-coverage.md), `coverage.json`.
