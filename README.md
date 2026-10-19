# ZAM Academy

Hands-on training apps that build understanding before [ZAM](https://github.com/zam-os/zam) keeps it with spaced repetition. Each app is served at `https://academy.zam-os.org/<app>/`. A ZAM cell holds the cards for an app, and every card links back to the lesson it is about.

| App | Folder | Live | ZAM cell |
| --- | --- | --- | --- |
| UML 2.5.1 | [`uml/`](uml/) | https://academy.zam-os.org/uml/ | `zam-academy:uml` |

## How an app and its ZAM cell fit together

- **The app teaches; the cell keeps.** Cards live only in the ZAM cell (in `zam-os/zam`). An app ships no card list or card export of its own.
- **Cards cite lessons** as `https://academy.zam-os.org/<app>/#lesson=<lesson id>`. The fragment keeps one app = one library topic in ZAM.
- **Lesson ids are a public contract.** Renaming or removing a lesson breaks every card that cites it, so change the cell in the same step. Each app has a test that pins its lesson ids.
- **Getting the cell into ZAM:** the learner asks their agent in ZAM to enrol in the cell. The app explains this in its "Keep it in ZAM" dialog.

## Develop

Each app is its own Vite package:

```bash
cd uml
npm ci
npm run dev      # http://localhost:5180/uml/
npm test
npm run build    # single-file build in dist/index.html
npm run package:zip   # offline zip in release/
```

CI (`.github/workflows/ci.yml`) tests and builds every app on each pull request and uploads the offline zip as an artifact. Pages (`.github/workflows/pages.yml`) publishes `index.html` plus every app's build on each push to `main`.

## Privacy

No accounts, cookies, trackers or third-party requests. Learner progress stays in the browser's `localStorage`.

## License

Apache-2.0, like ZAM.
