# Politik und Gesellschaft 8 · Gymnasium Bayern (SWG)

Lernpaket für das Fach **Politik und Gesellschaft** am Sozialwissenschaftlichen Gymnasium (SWG) in Bayern, Jahrgangsstufe 8, nach dem [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/pug).

## Aufbau des Lernpfads (9 Etappen · 44 Lektionen)

Alle fünf verpflichtenden Lernbereiche (ca. 84 Stunden) sowie sämtliche wählbaren Profilbereiche der Profilstunde am SWG (ca. 28 Stunden) sind als frei zugängliche Etappen abgebildet:

1. **LB 1 · Die Jugendphase bewusst erleben und gestalten** (5 Lektionen) – Jugendstudien, Lebensphase im Generationenvergleich, Identitätsfindung & Peergroups, Jugendkulturen, Jugend & digitale Medien.
2. **LB 2 · Gesellschaftliche Grundwerte und soziale Normen reflektieren** (5 Lektionen) – Sozialisationsinstanzen, Primärgruppen & Sanktionen, gruppenförderliches vs. -schädliches Verhalten, Konfliktanalyse & gewaltfreie Regelung, Fairness, Teamfähigkeit & Toleranz.
3. **LB 3 · Vorbilder, Idole und Influencer hinterfragen** (5 Lektionen) – Wertschätzung vs. Personenkult, Vorbilder, Idole und Influencer, Medieninszenierung & parasoziale Beziehungen, Folgen von Popularität, Schutz vor übertriebener Bindung.
4. **LB 4 · Politik als Gestaltungsmittel für das Zusammenleben** (6 Lektionen) – Staat, Gewaltmonopol & Verfassung, Politikkreislauf, Mehrheit, Kompromiss & Minderheitenschutz, kommunale Mitwirkung Jugendlicher, lokales Engagement, Zusammenspiel von Gesellschaft und Staat.
5. **LB 5 · Grenzüberschreitende Zusammenarbeit vor Ort** (4 Lektionen) – Städtepartnerschaften & Austausch, Kooperation auf Augenhöhe, grenzüberschreitende Konflikte in Europa, Euregios vor Ort.
6. **Profil 6.1 · Heimat(en) verstehen und gestalten** (4 Lektionen) – sechs Dimensionen & politischer Gebrauch, Fremdbilder vs. Eigenbild, Tradition & Vereine im Wandel, Zukunft der Region.
7. **Profil 6.2 · Politisches Geschehen mitverfolgen und diskutieren** (3 Lektionen) – Medienbeobachtung & Textsorten, Seriositäts-Check, Umfrageauswertung, Präsentation & faire Debatte.
8. **Profil 6.3 · Die anderen und ich – Zusammenleben in der Gruppe** (5 Lektionen) – Sekundärgruppen & Soziogramme, Führungsstile & Normierung, Rollenkonflikte & Teamarbeit, Vorurteilsbildung & Abbau, Menschenwürde, Mobbing & Massenpsychologie.
9. **Profil 6.4/6.5 · Bewusst leben, sich gesund ernähren** (7 Lektionen) – physische, psychische & soziale Gesundheit, Ernährungsphysiologie & Pausenbrot, Essstörungen & ernährungsbedingte Krankheiten, Lebensmittelrecht & Verbraucherschutz sowie 6.5-Vertiefungen (soziale Herkunft & Vorsorge, Ernährungstrends & globale Produktion, Esskultur & Berufsfelder).

Jede der **44 Lektionen** bietet ein interaktives Entdecker-Schaubild, einen Schnellcheck mit drei Optionen, eine Zuordnungs- oder Reihenfolgewerkstatt sowie Schreibaufgaben auf zwei Stufen (*Level 1 · mit Leitfragen* und *Level 2 · Transfer*). **18 Lektionen** enthalten zusätzlich ein interaktives Labor mit live aktualisierter SVG-Grafik und drei Erkundungszielen.

## Datenschutz & Offline-Nutzung

Lernstand und eigene Textentwürfe bleiben ausschließlich lokal im Browser (`politik_gy8_academy_progress_v1`). Ein klickbarer Hinweis (`ⓘ`) direkt neben dem Textfeld und die Hinweise in `README-START.txt` erläutern die Nutzung auf geteilten Geräten; „Lokalen Fortschritt zurücksetzen“ löscht sowohl den Lernstand als auch alle gespeicherten Texte. Externe Quellenlinks öffnen nur auf Klick.

## Entwickeln und prüfen

```sh
npm ci
npm run dev          # http://localhost:5293/politik-gymnasium-8/
npm run typecheck
npm test
npm run build
npm run package:zip  # release/ZAM-Academy-Politik-8-Gymnasium-offline.zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absoluter/pfad/zu/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Die ZAM-Zelle (`cell.json`) umfasst 44 Atome und 88 Karten mit echten ULIDs, `track: "SWG"` und kuratierten Distraktoren. Das Paket startet in Version `0.0` mit Status `ready` (Lehrkraftprüfung offen). Details zur Lehrplanabdeckung und zum Altbestand stehen in [coverage.json](coverage.json) sowie in [../docs/politik-gymnasium-8-coverage.md](../docs/politik-gymnasium-8-coverage.md).
