# Relationale Datenbanken und SQL · ZAM Academy

Relational databases and SQL as a learning path with a real SQL sandbox (SQLite as WebAssembly, in the browser), in German and English. Live at https://academy.zam-os.org/sql/. It follows modules 2.3.1 "Datenbanksysteme I" and 2.3.2 "Datenbanksysteme II" of LehrplanPLUS Informationstechnologie (Realschule Bayern) and adds what developers need beyond them.

## What it teaches

Four stages, 18 lessons. Each lesson says which module it belongs to, and the learner can scope the path: module 2.3.1 only (10 lessons), with 2.3.2 (16) or everything (18).

1. **Datenbank und Tabelle** (IT 2.3.1): database system, record and field, data types and `CREATE TABLE`, primary key
2. **Abfragen mit SQL** (IT 2.3.1): `WHERE`, `AND`/`OR`/`BETWEEN`/`IN`, `LIKE`, `ORDER BY` and `LIMIT`, calculated columns and `||`, `COUNT`/`SUM`/`AVG`/`MIN`/`MAX`
3. **Mehrere Tabellen** (IT 2.3.2): redundancy and anomalies, ER model and cardinalities, mapping rules and foreign keys, `JOIN` across two tables, three and four tables through the link table
4. **Berichte und Datenpflege**: `GROUP BY` and `HAVING`, `LEFT JOIN` and `NULL` (developer extras), `UPDATE`/`DELETE` and integrity rules as form validation (IT 2.3.2)

Every lesson has the same shape:

- a short explanation with the lesson's SQL (plain HTML, no Markdown),
- a **Schnellcheck** (one quick multiple-choice question; options are shuffled per lesson),
- a **Sandbox**: a SQLite database of a small online shop (`kunden`, `produkte`, `bestellungen`, `positionen`, in English `customers`, `products`, `orders`, `order_items`) with a schema browser, an editor and three **Sandbox-Aufträge** that a deterministic check marks as reached from the result set, the database state or the error the learner ran into. Lesson 12 has an ER workshop instead, where the learner sets cardinalities.
- **Aufgaben**: generated tasks checked by their effect, never by their wording: a query by its result set (columns matched by name where possible, row order only when the task asks for a sorting), a change by the tables it leaves behind, a `CREATE TABLE` by column names, type affinities and primary key. Level 1 names tables, columns and the statement shape; Level 2 is a transfer task in words.

A lesson is complete when the quick check is right, every sandbox goal is reached and three Level-1 tasks are solved. Three Level-2 tasks earn the 🦅 transfer badge. Progress stays in `localStorage`. The whole sample database is rebuilt for every check, so nothing the learner does can break a task.

## Two languages, one schema

The German identifiers are the keys in code (`src/db/dataset.ts`); `ident`, `val` and `q` give the English twin, so the same lesson runs against `kunden.nachname` or `customers.last_name`, and stored values such as categories and statuses are translated too. Lesson texts live side by side as `{ de, en }` in `src/curriculum/stage-*.ts`; the UI strings in `src/i18n/translations.ts`. `?lang=en` or `#lesson=<id>&lang=en` opens the app in English.

## Keep it with ZAM

The ZAM cell `zam-academy:sql` ("Relationale Datenbanken und SQL (ZAM Academy)") is `cell.json` in this folder and holds the review cards, in German like the UML cell. Each card links to its lesson as `https://academy.zam-os.org/sql/#lesson=<lesson id>`, and this app opens that lesson. `tests/sql-academy.test.ts` pins the lesson ids and checks that every card in `cell.json` cites an existing one, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer that ZAM grades against; a worked example sits in `sample_solution`, which zam-core keeps for authors and never installs. The two curated distractors of every card are checked in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`).

The cell's atoms also carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, Zweig I and II, Informationstechnologie), so ZAM can offer the cell to a learner at that curriculum position. It replaces the cell `de-by:realschule-9-informatik-datenbanken-sql` that zam-os/zam used to bundle: `replaces-de-by.json` is the mapping of its 8 items (**A**: an existing card asks the same fact and carries `replaces`; **B**: a new card carries the fact; **C**: no successor), one de-by item per card (ADR 2026-08-14 Decision 9).

## Develop

```bash
npm ci
npm run dev          # http://localhost:5182/sql/
npm test
npm run build        # single-file build in dist/index.html (SQLite WebAssembly inlined)
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```

Lesson content lives in `src/curriculum/stage-*.ts`; the sample database in `src/db/dataset.ts`, the engine around sql.js in `src/db/engine.ts`, the task checker in `src/exercises/checker.ts`, the sandbox goal helpers in `src/lab/goals.ts`. Adding a lesson means: a new entry in its stage file (id, texts in both languages, a lab with goals, three exercise generators), a witness per goal in the test, and cards in `cell.json`.

## Sources

- [LehrplanPLUS Realschule, Informationstechnologie, Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it) (modules 2.3.1 Datenbanksysteme I and 2.3.2 Datenbanksysteme II)
- [LehrplanPLUS Realschule, Informationstechnologie, Fachprofil](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it)
- [SQLite documentation](https://www.sqlite.org/lang.html) (the dialect the sandbox runs)
