# Biologie 5 Realschule · ZAM Academy

Eigenständiger Lernkurs für **Biologie 5** an der bayerischen Realschule (LehrplanPLUS), aufgebaut aus 25 interaktiven Lektionen in vier Lernbereichen, vier Modellen und einer ZAM-Zelle (`zam-academy:biologie-realschule-5`) mit 25 Atomen und 50 Wiederholungsfragen.

## Inhalt

- **LB 1 – Prozessbezogene Kompetenzen** (`7` Lektionen): Mess- und Laborgeräte, Beobachten/Vergleichen/Bestimmen, naturwissenschaftlicher Erkenntnisweg, Lichtmikroskop-Modell, Modelle & Protokolle, Quellen/Steckbrief/Begründen, Fakten/Bewertungen/Handlungsoptionen.
- **LB 2 – Biologie, die Wissenschaft von den Lebewesen** (`4` Lektionen): Kennzeichen von Lebewesen bei Tier und Pflanze, Zellvergleichs-Modell (Tier- vs. Pflanzenzelle), Organisationsebenen von der Zelle zum Organismus.
- **LB 3 – Bau und Funktion des menschlichen Körpers** (`6` Lektionen): Torso-Modell (Organe und Organsysteme), Atmung und Herz-Kreislauf, Verdauung/Ausscheidung/Nervensystem, Skelett und Doppel-S-Form der Wirbelsäule, Arm-Hebelmodell (Gegenspielerprinzip und Gelenke), Gesunderhaltung.
- **LB 4 – Tiere und Pflanzen in der Umgebung des Menschen** (`8` Lektionen): Wild lebende Säugetiere, Domestizierung und Zucht, Körperbau und artgerechte Haltung von Nutz- und Heimtieren, Grundbauplan der Blütenpflanze, Blütenbau und Biodiversität, Wild- zu Kulturpflanze, Getreidearten und Nutzpflanzen.

## Lokal prüfen

```bash
npm ci
npx tsc --noEmit
npm test
npm run build
npm run package:zip
```

## Datenschutz und Abgrenzung

- Fortschritt und Notizen bleiben ausschließlich lokal in `localStorage` (`biologie_rs5_progress_v1`).
- Keine externen Requests zur Laufzeit; geprüfte Quellennachweise sind nur klickbare Links.
- Reales Mikroskopieren, Originalpflanzen, Schulversuche und Klassendiskussionen ergänzt der Kurs, ersetzt sie aber nicht.
