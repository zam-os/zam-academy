# ZAM Academy

Hands-on training apps that build understanding before [ZAM](https://github.com/zam-os/zam) keeps it with spaced repetition. Each app is served at `https://academy.zam-os.org/<app>/`. A ZAM cell holds the cards for an app, and every card links back to the lesson it is about.

| App | Folder | Live | ZAM cell |
| --- | --- | --- | --- |
| UML 2.5.1 | [`uml/`](uml/) | https://academy.zam-os.org/uml/ | `zam-academy:uml` |
| Physik 9 Realschule (LehrplanPLUS Bayern) | [`physik-realschule-9/`](physik-realschule-9/) | https://academy.zam-os.org/physik-realschule-9/ | `zam-academy:physik-realschule-9` |
| Relationale Datenbanken und SQL (DE/EN, LehrplanPLUS IT 2.3.1/2.3.2) | [`sql/`](sql/) | https://academy.zam-os.org/sql/ | `zam-academy:sql` |
| Mathematik 9 Realschule (LehrplanPLUS Bayern) | [`mathematik-realschule-9/`](mathematik-realschule-9/) | https://academy.zam-os.org/mathematik-realschule-9/ | `zam-academy:mathematik-realschule-9` |
| Chemie 9 Realschule (LehrplanPLUS Bayern, Zweig I und II/III) | [`chemie-realschule-9/`](chemie-realschule-9/) | https://academy.zam-os.org/chemie-realschule-9/ | `zam-academy:chemie-realschule-9` |
| Geschichte 9 Realschule (LehrplanPLUS Bayern, gemeinsamer Lernpfad) | [`geschichte-realschule-9/`](geschichte-realschule-9/) | https://academy.zam-os.org/geschichte-realschule-9/ | `zam-academy:geschichte-realschule-9` |
| Geographie 9 Realschule (LehrplanPLUS Bayern, gemeinsamer Lernpfad) | [`geographie-realschule-9/`](geographie-realschule-9/) | https://academy.zam-os.org/geographie-realschule-9/ | `zam-academy:geographie-realschule-9` |
| Biologie 10 Realschule (LehrplanPLUS Bayern, gemeinsamer Lernpfad) | [`biologie-realschule-10/`](biologie-realschule-10/) | https://academy.zam-os.org/biologie-realschule-10/ | `zam-academy:biologie-realschule-10` |
| Physik 10 Realschule (LehrplanPLUS Bayern, Zweig I und II/III) | [`physik-realschule-10/`](physik-realschule-10/) | https://academy.zam-os.org/physik-realschule-10/ | `zam-academy:physik-realschule-10` |
| Algorithmen und Programmieren (DE/EN, LehrplanPLUS IT 2.6.1, jahrgangsübergreifend) | [`algorithmen/`](algorithmen/) | https://academy.zam-os.org/algorithmen/ | `zam-academy:algorithmen` |
| Datennetze und Internet (DE/EN, LehrplanPLUS IT 2.5.1, HTTPS als Ergänzung) | [`datennetze/`](datennetze/) | https://academy.zam-os.org/datennetze/ | `zam-academy:datennetze` |
| BwR 9 Realschule (LehrplanPLUS Bayern, Zweig II) | [`bwr-realschule-9/`](bwr-realschule-9/) | https://academy.zam-os.org/bwr-realschule-9/ | `zam-academy:bwr-realschule-9` |
| Wirtschaft und Recht 9 Realschule (LehrplanPLUS Bayern, WPFG I und III) | [`wirtschaft-recht-realschule-9/`](wirtschaft-recht-realschule-9/) | https://academy.zam-os.org/wirtschaft-recht-realschule-9/ | `zam-academy:wirtschaft-recht-realschule-9` |

## How an app and its ZAM cell fit together

The rules come from [ADR 2026-10-19](https://github.com/zam-os/zam/blob/main/docs/adr/2026-10-19-zam-academy-cells.md) in zam-os/zam.

- **The app teaches; the cell keeps.** The cards of a topic live only in `<app>/cell.json`, a KVT tile. An app ships no card list or card export of its own, and app and cell change in the same PR.
- **Cards cite lessons** as `https://academy.zam-os.org/<app>/#lesson=<lesson id>`. The fragment keeps one app = one library topic in ZAM.
- **Lesson ids are a public contract.** Each app's test pins its lesson ids and checks that every card cites an existing lesson.
- **CI installs every cell** into a throw-away library with the published `zam-core` (`scripts/validate-cells.mjs`).
- **History changes require approval.** The catalog builder refuses cells with `replaces` or `retired_items` unless their `replaces-de-by.json` records a valid approval date and documents exactly those changes: every A/B row is replaced by its one named `academy_slug`, a C row is never replaced (it may be retired), and no undocumented `replaces` or `retired_items` exist. CI tests this safeguard; Pages checks it before building or uploading the site. An unapproved proposal therefore blocks publication.
- **Pages publishes** each app, its `cell.json`, and `/catalog.json` (`scripts/build-catalog.mjs`), with the SHA-256 of every cell. ZAM reads the catalog only on a learner's action. ZAM releases bundle a copy of each cell.
- **A cell is released at its first publication,** in the catalog or in a ZAM release. From then on, its item ids, slugs and cited lessons stay stable; changes use `replaces` and raise the version.

## Develop

Each app is its own Vite package:

```bash
cd uml                 # or: cd physik-realschule-9 (dev server on :5181), cd sql (:5182), cd mathematik-realschule-9 (:5183)
# Chemie 9: cd chemie-realschule-9 (dev server on :5184)
# Geschichte 9: cd geschichte-realschule-9 (dev server on :5185)
# Geographie 9: cd geographie-realschule-9 (dev server on :5186)
# Biologie 10: cd biologie-realschule-10 (dev server on :5187)
# Physik 10: cd physik-realschule-10 (dev server on :5188)
# Algorithmen: cd algorithmen (dev server on :5189)
# Datennetze: cd datennetze (dev server on :5190)
# BwR 9: cd bwr-realschule-9 (dev server on :5191)
# Wirtschaft und Recht 9: cd wirtschaft-recht-realschule-9 (dev server on :5192)
npm ci
npm run dev      # http://localhost:5180/uml/
npm test
npm run build    # single-file build in dist/index.html
npm run package:zip   # offline zip in release/
```

CI (`.github/workflows/ci.yml`) tests and builds every app on each pull request and uploads the offline zip as an artifact. Pages (`.github/workflows/pages.yml`) publishes `index.html` plus every app's build on each push to `main`.

The [grade-9 coverage inventory](docs/realschule-9-coverage.md) distinguishes migrated packages, partial legacy material and still-open curriculum work.

The [IT migration inventory](docs/it-bestandsabgleich.md) documents the split of the old algorithms/network cell. The eight explicit card mappings were approved on 2026-10-21; both apps are published and synchronized into ZAM together. Validate the split in disposable libraries with `ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-it-migration.mjs`.

## The atlas landing page

`index.html` renders a zoomable knowledge atlas (Schulsicht and Weltwissen) from `academy.json`. Fields without a package are shown grey and unselectable. Search and coverage navigation also expand and focus the destination in the list view. App links return to `https://academy.zam-os.org/`, including when an app is opened from an offline zip.

To register a new package, add an entry to `pakete` in `academy.json` (app folder, Fach, grade, school, lesson and card counts); `node --test scripts/academy-registry.test.mjs` keeps it in sync with the app cells. UML groups several lessons per atom, so its curriculum test checks the registry's lesson count against the app's actual lessons. School types and subject start grades in the registry are a planning scaffold and can be edited freely.

## Privacy

No accounts, cookies, trackers or third-party requests. Learner progress stays in the browser's `localStorage`.

## License

Apache-2.0, like ZAM.
