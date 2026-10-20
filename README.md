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

## How an app and its ZAM cell fit together

The rules come from [ADR 2026-10-19](https://github.com/zam-os/zam/blob/main/docs/adr/2026-10-19-zam-academy-cells.md) in zam-os/zam.

- **The app teaches; the cell keeps.** The cards of a topic live only in `<app>/cell.json`, a KVT tile. An app ships no card list or card export of its own, and app and cell change in the same PR.
- **Cards cite lessons** as `https://academy.zam-os.org/<app>/#lesson=<lesson id>`. The fragment keeps one app = one library topic in ZAM.
- **Lesson ids are a public contract.** Each app's test pins its lesson ids and checks that every card cites an existing lesson.
- **CI installs every cell** into a throw-away library with the published `zam-core` (`scripts/validate-cells.mjs`).
- **Pages publishes** each app, its `cell.json`, and `/catalog.json` (`scripts/build-catalog.mjs`), with the SHA-256 of every cell. ZAM reads the catalog only on a learner's action. ZAM releases bundle a copy of each cell.
- **A cell is released at its first publication,** in the catalog or in a ZAM release. From then on, its item ids, slugs and cited lessons stay stable; changes use `replaces` and raise the version.

## Develop

Each app is its own Vite package:

```bash
cd uml                 # or: cd physik-realschule-9 (dev server on :5181), cd sql (:5182), cd mathematik-realschule-9 (:5183)
# Chemie 9: cd chemie-realschule-9 (dev server on :5184)
# Geschichte 9: cd geschichte-realschule-9 (dev server on :5185)
# Geographie 9: cd geographie-realschule-9 (dev server on :5186)
npm ci
npm run dev      # http://localhost:5180/uml/
npm test
npm run build    # single-file build in dist/index.html
npm run package:zip   # offline zip in release/
```

CI (`.github/workflows/ci.yml`) tests and builds every app on each pull request and uploads the offline zip as an artifact. Pages (`.github/workflows/pages.yml`) publishes `index.html` plus every app's build on each push to `main`.

The [grade-9 coverage inventory](docs/realschule-9-coverage.md) distinguishes migrated packages, partial legacy material and still-open curriculum work.

## Privacy

No accounts, cookies, trackers or third-party requests. Learner progress stays in the browser's `localStorage`.

## License

Apache-2.0, like ZAM.
