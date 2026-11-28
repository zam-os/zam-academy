# Physik 8 Gymnasium · ZAM Academy

A German-language learning package based on Bavarian LehrplanPLUS Grade 8 Physics. It contains 20 lessons, including the two required NTG profile lessons and one elective NTG research project. GitHub Pages publishes the [Academy package](https://academy.zam-os.org/physik-gymnasium-8/) after merge. Version 0.0 awaits teacher review.

| Section | Lessons | Examples of adjustable models |
| --- | ---: | --- |
| Ph8 1 · Elektrischer Strom | 4 | Open and closed circuit, lamp and resistor curves, circuits with up to three resistors |
| Ph8 2 · Optik | 5 | Reflection and virtual images, refraction, converging lens, corrective glasses, total internal reflection |
| Ph8 3.1 · Dynamik zweidimensionaler Bewegungen | 4 | Stroboscopic sequences, velocity and change vectors, force and acceleration |
| Ph8 3.2 · Kräfte und ihre Wirkungen | 4 | Weight on Earth and Moon, equilibrium, components on an incline, spring extension |
| Ph8 4.1 · NTG profile | 2 | Solar module orientation and shading, sources under load |
| Ph8 4.2 · NTG elective | 1 | Video-analysis research project using a moving ball |

Every lesson includes a worked example, a quick check, a workshop, an adjustable diagram with two observable goals, and written practice at two levels. Twelve lessons also generate numerical exercises at both levels. A local notebook records the six common experiments and two NTG investigations. The app provides model data and preparation. Learners do their physical measurements, sketches, independent searches and presentations in class. Lesson and notebook progress stay in the browser.

Completing a lesson requires the model goals, the quick check, the workshop and a self-assessed answer at each level. Calculation lessons also require three independently solved exercises at each level.

The ZIP includes a self-contained HTML app and start files for macOS, Windows and Linux. The Academy catalogue exposes the 60-card ZAM cell after publication. See the [coverage and legacy-card notes](../docs/physik-gymnasium-8-coverage.md) for scope and evidence.

## For parents and teachers

Progress, written answers and experiment notes stay in local browser storage. Device accounts, browsers, profiles and website origins have separate storage. If pupils share a browser profile, use **Lokalen Fortschritt zurücksetzen** in the learning path at the end of each session to clear both progress and texts. Learners compare their own written answers with the examples and rubric.

## Run locally

```sh
npm ci
npm run dev         # http://localhost:5305/physik-gymnasium-8/
npm run typecheck
npm test
npm run package:zip # release/ZAM-Academy-Physik-8-Gymnasium-offline.zip
```
