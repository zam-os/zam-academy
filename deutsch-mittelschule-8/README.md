# Deutsch Mittelschule 8 · ZAM Academy

Interaktive Lern- und Schreibwerkstatt für die 8. Jahrgangsstufe der bayerischen Mittelschule (**Regelklasse und M-Zug**) nach dem LehrplanPLUS Bayern.

## Inhalt

- **37 Lektionen** in vier Lernbereichen (`Sprechen und Zuhören`, `Lesen – mit Texten und weiteren Medien umgehen`, `Schreiben`, `Sprachgebrauch und Sprache untersuchen und reflektieren`)
- **Klassenzug-Filter** direkt auf dem Lernpfad (`Alle R & M`, `Regelklasse R` = 36 Lektionen, `M-Zug M` = 36 Lektionen)
- Jede Lektion verbindet Erklärungen am Material, eine Fallwerkstatt, einen Schnellcheck sowie geführte Schreib- und Transferaufgaben auf zwei Stufen (`Level 1 · Anwenden` und `Level 2 · Transfer`) mit Selbstüberprüfung gegen eine Musterlösung
- **74 ZAM-Wiederholungskarten** in `cell.json` mit Verweis auf jede Lektion (`#lesson=<id>`)

## Entwicklung & Prüfung

```bash
npm ci
npx tsc --noEmit
npm test
node scripts/check-curriculum.mjs
npm run build
npm run package:zip
```
