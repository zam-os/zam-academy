# UML 2.5.1 · ZAM Academy

An interactive UML 2.5.1 editor with a learning path in German and English. Live at https://academy.zam-os.org/uml/.

## What it teaches

Six stages with four lessons each (24 lessons):

1. **Use case diagram**: system boundary, actors, use cases, `«include»`, `«extend»`
2. **Class diagram**: class compartments, visibility, `«interface»`, composition, aggregation, generalization, realization
3. **Activity diagram**: start and end nodes, actions, decisions with `[guards]`, fork and join
4. **State machine**: states with `entry` / `do` / `exit`, transitions labelled `trigger [guard] / effect`
5. **Sequence diagram**: lifelines, synchronous, asynchronous and reply messages, combined fragments
6. **Component diagram**: components, provided interfaces (lollipop) and required interfaces (socket), dependencies

Each stage moves through four lesson types: a guided drawing lesson, a connections lesson, a "find the error" diagram, and a final mission. There are two levels:

- **Level 1 (guided)**: starter elements are given.
- **Level 2 (system translation)**: only the real system is described, and you model it on a blank canvas.

A deterministic checker evaluates each diagram. Its criteria stay hidden until you check. The free editor offers all 14 UML 2.5.1 diagram types, with JSON, SVG, PNG, PlantUML and Mermaid export.

## Keep it with ZAM

The ZAM cell `zam-academy:uml` ("UML 2.5.1 (ZAM Academy)") holds the review cards. Each card links to its lesson as `https://academy.zam-os.org/uml/#lesson=<lesson id>`, and this app opens that lesson. Lesson ids are pinned in `tests/uml-learning-app.test.ts`, because renaming one breaks every card that cites it.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5180/uml/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```

Diagram files imported from disk go through `sanitizeImportedDiagram` (`src/model/diagram-import.ts`) before anything renders them.
