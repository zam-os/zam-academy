import { CUSTOMERS, CUSTOMERS_WITH_ORDERS, ORDERS, PRODUCTS } from "../db/dataset";
import { countNow, lastErrorIncludes, lastFailedStatementIs, lastResultEquals } from "../lab/goals";
import type { ErLabDefinition, Lesson, Localized, Stage } from "../model/types";
import { choiceTask, goal, L, mutationTask, queryTask, SHOP, sqlLab } from "./helpers";

// ─── Lektion 11: Redundanz und Anomalien ────────────────────────────────────

const ANOMALIES: Array<{ scenario: Localized; answer: number }> = [
  {
    scenario: L(
      "Kundin Anna Berg zieht um. Ihr Ort steht in fünf Zeilen der Tabelle; in einer wird die Änderung vergessen.",
      "Customer Anna Berg moves house. Her city appears in five rows of the table; in one of them the change is forgotten.",
    ),
    answer: 0,
  },
  {
    scenario: L(
      "Ein neuer Kunde hat noch nichts bestellt. Er kann nicht gespeichert werden, weil jede Zeile eine Bestellung ist.",
      "A new customer has not ordered anything yet. He cannot be stored, because every row is an order.",
    ),
    answer: 1,
  },
  {
    scenario: L(
      "Die einzige Bestellung eines Kunden wird storniert und gelöscht. Mit ihr verschwindet seine Adresse aus der Datenbank.",
      "A customer's only order is cancelled and deleted. With it his address disappears from the database.",
    ),
    answer: 2,
  },
  {
    scenario: L(
      "Dasselbe Produkt steht in der Tabelle mit zwei verschiedenen Preisen, weil nur eine der Zeilen aktualisiert wurde.",
      "The same product appears in the table with two different prices, because only one of the rows was updated.",
    ),
    answer: 0,
  },
];

const FLAT_QUERIES: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  {
    sql: "SELECT DISTINCT {vorname}, {nachname}, {ort} FROM {bestellungen_flach};",
    prompt: L("Zeige mit DISTINCT {vorname}, {nachname} und {ort} aus {bestellungen_flach} ohne Wiederholungen.", "Show with DISTINCT {vorname}, {nachname} and {ort} from {bestellungen_flach} without repeats."),
    words: L("Welche Kunden stecken in der flachen Tabelle? Zeige Vorname, Nachname und Ort, jede Person nur einmal.", "Which customers are hidden in the flat table? Show first name, last name and city, every person only once."),
  },
  {
    sql: "SELECT DISTINCT {bezeichnung} FROM {bestellungen_flach};",
    prompt: L("Zeige mit DISTINCT die {bezeichnung} aus {bestellungen_flach}, jede nur einmal.", "Show with DISTINCT the {bezeichnung} from {bestellungen_flach}, each only once."),
    words: L("Welche Produkte wurden laut der flachen Tabelle bestellt? Jedes nur einmal.", "Which products were ordered according to the flat table? Each only once."),
  },
  {
    sql: "SELECT COUNT(*) FROM {bestellungen_flach} WHERE {nachname} = 'Berg';",
    prompt: L("Zähle mit COUNT(*) die Zeilen in {bestellungen_flach}, deren {nachname} 'Berg' ist.", "Count with COUNT(*) the rows in {bestellungen_flach} whose {nachname} is 'Berg'."),
    words: L("Wie oft ist die Adresse von Anna Berg in der flachen Tabelle gespeichert?", "How many times is Anna Berg's address stored in the flat table?"),
  },
];

const REDUNDANCY_STATEMENTS = {
  right: L(
    [
      "Dieselbe Information ist mehrfach gespeichert, und jede Änderung muss überall nachgezogen werden.",
      "Redundanz führt leicht zu Inkonsistenzen, also widersprüchlichen Angaben.",
      "Aufteilen in mehrere Tabellen, die über Schlüssel verbunden sind, vermeidet Redundanz.",
    ],
    [
      "The same information is stored several times, and every change must be repeated everywhere.",
      "Redundancy easily leads to inconsistencies, that is contradictory data.",
      "Splitting into several tables connected by keys avoids redundancy.",
    ],
  ),
  wrong: L(
    [
      "Redundanz macht jede Abfrage schneller und ist deshalb erwünscht.",
      "Redundanz bedeutet, dass eine Tabelle keinen Primärschlüssel hat.",
      "Redundanz entsteht nur bei Zahlen, nie bei Text.",
    ],
    [
      "Redundancy makes every query faster and is therefore welcome.",
      "Redundancy means that a table has no primary key.",
      "Redundancy only arises with numbers, never with text.",
    ],
  ),
};

const LESSON_ER_1: Lesson = {
  id: "er-1-redundanz",
  stageId: "stage-3-beziehungen",
  stepNumber: 1,
  module: "2.3.2",
  tables: [...SHOP, "bestellungen_flach"],
  requiredCorrect: 3,
  text: L(
    {
      title: "Warum eine Tabelle nicht reicht",
      subtitle: "Redundanz, Anomalien und Inkonsistenzen in einer flachen Tabelle",
      whyItMatters:
        "Alles in eine Tabelle zu schreiben wirkt einfach. Aber sobald eine Kundin umzieht, muss ihr Ort an fünf Stellen geändert werden, und eine wird vergessen. Datenbanken sind in Tabellen aufgeteilt, damit jede Information genau einmal gespeichert ist.",
      explanationHtml: `
<p>Die Tabelle <code>bestellungen_flach</code> in der Sandbox speichert zu jeder Bestellposition alles: Kunde, Ort, Produkt, Preis, Menge. Anna Bergs Name und Ort stehen dort fünfmal. Das ist <strong>Redundanz</strong>: dieselbe Information mehrfach gespeichert.</p>
<p>Redundanz verursacht drei <strong>Anomalien</strong>:</p>
<ul>
  <li><strong>Änderungsanomalie</strong>: Zieht Anna um, muss der Ort in allen fünf Zeilen geändert werden. Wird eine vergessen, enthält die Tabelle zwei Orte für dieselbe Person: eine <strong>Inkonsistenz</strong>.</li>
  <li><strong>Einfügeanomalie</strong>: Ein neuer Kunde ohne Bestellung lässt sich nicht speichern, weil jede Zeile eine Bestellposition ist.</li>
  <li><strong>Löschanomalie</strong>: Wird die einzige Bestellung eines Kunden gelöscht, verschwindet mit ihr seine Adresse.</li>
</ul>
<p>Die Lösung: Jede Art von Objekt bekommt eine eigene Tabelle (<code>kunden</code>, <code>produkte</code>, <code>bestellungen</code>, <code>positionen</code>), und die Tabellen werden über Schlüssel verbunden. Wie das geht, zeigen die nächsten Lektionen. Vorher prüfst du die flache Tabelle: <code>SELECT DISTINCT</code> zeigt, welche verschiedenen Angaben zu einer Person gespeichert sind.</p>`,
      syntax: [
        { name: "Widersprüche finden", sql: "SELECT DISTINCT nachname, ort FROM tabelle WHERE nachname = 'Berg';", note: "Mehr als eine Zeile pro Person: Inkonsistenz." },
        { name: "Einen Teil der Zeilen ändern", sql: "UPDATE tabelle SET spalte = wert WHERE bedingung;", note: "Ohne WHERE ändert UPDATE alle Zeilen." },
      ],
      quiz: {
        question: "Was ist eine Inkonsistenz?",
        options: [
          "Widersprüchliche Angaben zur selben Sache, zum Beispiel zwei Orte für eine Kundin",
          "Eine Tabelle ohne Primärschlüssel",
          "Eine Abfrage, die keine Zeilen liefert",
        ],
        correctIndex: 0,
        explanation: "Inkonsistenzen entstehen, wenn redundant gespeicherte Daten nicht überall geändert werden.",
      },
      lab: {
        title: "Sandbox: Eine flache Tabelle kippt",
        intro: "Erzeuge selbst eine Inkonsistenz in bestellungen_flach und finde sie wieder.",
        goals: {
          g1: "Zeige alle Zeilen von bestellungen_flach, deren nachname 'Berg' ist.",
          g2: "Ändere mit UPDATE in bestellungen_flach den ort für Anna Bergs Bestellung 103 auf 'Augsburg' (WHERE bestell_id = 103).",
          g3: "Zeige mit SELECT DISTINCT nachname, ort aus bestellungen_flach die widersprüchlichen Orte von 'Berg'.",
        },
      },
      celebrationMessage: "Du erkennst Redundanz und weißt, warum Daten auf Tabellen verteilt werden.",
    },
    {
      title: "Why one table is not enough",
      subtitle: "Redundancy, anomalies and inconsistencies in a flat table",
      whyItMatters:
        "Writing everything into one table looks simple. But as soon as a customer moves, her city has to change in five places, and one is forgotten. Databases are split into tables so that every piece of information is stored exactly once.",
      explanationHtml: `
<p>The table <code>orders_flat</code> in the sandbox stores everything about every order item: customer, city, product, price, quantity. Anna Berg's name and city appear five times. That is <strong>redundancy</strong>: the same information stored several times.</p>
<p>Redundancy causes three <strong>anomalies</strong>:</p>
<ul>
  <li><strong>Update anomaly</strong>: if Anna moves, the city must change in all five rows. Forget one and the table holds two cities for the same person: an <strong>inconsistency</strong>.</li>
  <li><strong>Insertion anomaly</strong>: a new customer without an order cannot be stored, because every row is an order item.</li>
  <li><strong>Deletion anomaly</strong>: deleting a customer's only order deletes his address with it.</li>
</ul>
<p>The solution: every kind of object gets its own table (<code>customers</code>, <code>products</code>, <code>orders</code>, <code>order_items</code>), and the tables are connected by keys. The next lessons show how. First, examine the flat table: <code>SELECT DISTINCT</code> shows which different values are stored for one person.</p>`,
      syntax: [
        { name: "Find contradictions", sql: "SELECT DISTINCT last_name, city FROM table WHERE last_name = 'Berg';", note: "More than one row per person: inconsistency." },
        { name: "Change some rows", sql: "UPDATE table SET column = value WHERE condition;", note: "Without WHERE, UPDATE changes every row." },
      ],
      quiz: {
        question: "What is an inconsistency?",
        options: [
          "Contradictory data about the same thing, for example two cities for one customer",
          "A table without a primary key",
          "A query that returns no rows",
        ],
        correctIndex: 0,
        explanation: "Inconsistencies arise when redundantly stored data is not changed everywhere.",
      },
      lab: {
        title: "Sandbox: a flat table tips over",
        intro: "Create an inconsistency in orders_flat yourself and find it again.",
        goals: {
          g1: "Show all rows of orders_flat whose last_name is 'Berg'.",
          g2: "Change with UPDATE in orders_flat the city for Anna Berg's order 103 to 'Augsburg' (WHERE order_id = 103).",
          g3: "Show with SELECT DISTINCT last_name, city from orders_flat the contradictory cities of 'Berg'.",
        },
      },
      celebrationMessage: "You recognise redundancy and know why data is spread over tables.",
    },
  ),
  lab: sqlLab([...SHOP, "bestellungen_flach"], "SELECT * FROM {bestellungen_flach}\nWHERE {nachname} = 'Fischer';", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT * FROM {bestellungen_flach} WHERE {nachname} = 'Berg';")),
    goal("g2", (ctx) => countNow(ctx, "SELECT COUNT(DISTINCT {ort}) FROM {bestellungen_flach} WHERE {nachname} = 'Berg';") >= 2),
    goal(
      "g3",
      (ctx) =>
        countNow(ctx, "SELECT COUNT(DISTINCT {ort}) FROM {bestellungen_flach} WHERE {nachname} = 'Berg';") >= 2 &&
        lastResultEquals(ctx, "SELECT DISTINCT {nachname}, {ort} FROM {bestellungen_flach} WHERE {nachname} = 'Berg';"),
    ),
  ]),
  exercises: [
    {
      id: "anomalie",
      make: (rng, _level, locale) => {
        const pick = rng.pick(ANOMALIES);
        return choiceTask(locale, rng, {
          prompt: L(`${pick.scenario.de} Welche Anomalie ist das?`, `${pick.scenario.en} Which anomaly is this?`),
          options: L(["Änderungsanomalie", "Einfügeanomalie", "Löschanomalie"], ["Update anomaly", "Insertion anomaly", "Deletion anomaly"]),
          correctIndex: pick.answer,
          explanation: L(
            "Ändern an mehreren Stellen, Einfügen ohne Bestellung unmöglich, Löschen reißt Daten mit: die drei Anomalien einer redundanten Tabelle.",
            "Changing in several places, inserting without an order impossible, deleting tearing data away: the three anomalies of a redundant table.",
          ),
        });
      },
    },
    {
      id: "flache-tabelle",
      make: (rng, level, locale) => {
        const pick = rng.pick(FLAT_QUERIES);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("SELECT DISTINCT <Spalten> FROM <Tabelle>;   SELECT COUNT(*) FROM <Tabelle> WHERE <Bedingung>;", "SELECT DISTINCT <columns> FROM <table>;   SELECT COUNT(*) FROM <table> WHERE <condition>;"),
          sql: pick.sql,
        });
      },
    },
    {
      id: "redundanz",
      make: (rng, _level, locale) => {
        const rightIndex = rng.int(0, 2);
        const wrong = rng.sample([0, 1, 2], 2);
        return choiceTask(locale, rng, {
          prompt: L("Welche Aussage über Redundanz stimmt?", "Which statement about redundancy is true?"),
          options: L(
            [REDUNDANCY_STATEMENTS.right.de[rightIndex], ...wrong.map((i) => REDUNDANCY_STATEMENTS.wrong.de[i])],
            [REDUNDANCY_STATEMENTS.right.en[rightIndex], ...wrong.map((i) => REDUNDANCY_STATEMENTS.wrong.en[i])],
          ),
          correctIndex: 0,
          explanation: L(
            "Redundanz heißt Mehrfachspeicherung. Sie kostet Pflegeaufwand und führt zu Widersprüchen; Tabellen mit Schlüsseln vermeiden sie.",
            "Redundancy means storing something more than once. It costs maintenance and leads to contradictions; tables with keys avoid it.",
          ),
        });
      },
    },
  ],
};

// ─── Lektion 12: Entitäten und Kardinalitäten ───────────────────────────────

const ER_LAB: ErLabDefinition = {
  kind: "er",
  pairs: [
    {
      id: "kunde-bestellung",
      left: L("Kunde", "Customer"),
      right: L("Bestellung", "Order"),
      verb: L("gibt auf", "places"),
      scenario: L(
        "Ein Kunde kann viele Bestellungen aufgeben. Jede Bestellung gehört zu genau einem Kunden.",
        "A customer can place many orders. Every order belongs to exactly one customer.",
      ),
      answer: "1:n",
      explanation: L("Viele Bestellungen je Kunde, ein Kunde je Bestellung: 1:n.", "Many orders per customer, one customer per order: 1:n."),
    },
    {
      id: "bestellung-produkt",
      left: L("Bestellung", "Order"),
      right: L("Produkt", "Product"),
      verb: L("enthält", "contains"),
      scenario: L(
        "Eine Bestellung kann mehrere Produkte enthalten, und ein Produkt kann in vielen Bestellungen vorkommen.",
        "An order can contain several products, and a product can appear in many orders.",
      ),
      answer: "n:m",
      explanation: L("Viele auf beiden Seiten: n:m. Dafür braucht es eine Zwischentabelle.", "Many on both sides: n:m. That needs a link table."),
    },
    {
      id: "kunde-konto",
      left: L("Kunde", "Customer"),
      right: L("Benutzerkonto", "User account"),
      verb: L("besitzt", "owns"),
      scenario: L(
        "Jeder Kunde hat genau ein Benutzerkonto, und jedes Benutzerkonto gehört zu genau einem Kunden.",
        "Every customer has exactly one user account, and every user account belongs to exactly one customer.",
      ),
      answer: "1:1",
      explanation: L("Eins auf jeder Seite: 1:1.", "One on each side: 1:1."),
    },
    {
      id: "kategorie-produkt",
      left: L("Kategorie", "Category"),
      right: L("Produkt", "Product"),
      verb: L("ordnet ein", "groups"),
      scenario: L(
        "Jedes Produkt gehört zu genau einer Kategorie. Eine Kategorie umfasst viele Produkte.",
        "Every product belongs to exactly one category. A category comprises many products.",
      ),
      answer: "1:n",
      explanation: L("Viele Produkte je Kategorie, eine Kategorie je Produkt: 1:n.", "Many products per category, one category per product: 1:n."),
    },
    {
      id: "schueler-kurs",
      left: L("Schüler", "Student"),
      right: L("Wahlkurs", "Elective course"),
      verb: L("besucht", "attends"),
      scenario: L(
        "Ein Schüler besucht mehrere Wahlkurse, und jeder Wahlkurs hat viele Schüler.",
        "A student attends several elective courses, and every course has many students.",
      ),
      answer: "n:m",
      explanation: L("Viele auf beiden Seiten: n:m.", "Many on both sides: n:m."),
    },
  ],
  goals: [
    { id: "g1", check: (ctx) => ctx.choices["kunde-bestellung"] === "1:n" },
    { id: "g2", check: (ctx) => ctx.choices["bestellung-produkt"] === "n:m" },
    {
      id: "g3",
      check: (ctx) =>
        ctx.choices["kunde-konto"] === "1:1" && ctx.choices["kategorie-produkt"] === "1:n" && ctx.choices["schueler-kurs"] === "n:m",
    },
  ],
};

const CARDINALITY_SCENARIOS: Array<{ scenario: Localized; answer: number }> = [
  { scenario: L("Eine Klasse hat viele Schüler; jeder Schüler ist in genau einer Klasse.", "A class has many students; every student is in exactly one class."), answer: 1 },
  { scenario: L("Ein Buch kann von vielen Autoren geschrieben sein; ein Autor schreibt viele Bücher.", "A book can be written by many authors; an author writes many books."), answer: 2 },
  { scenario: L("Jedes Land hat genau eine Hauptstadt; jede Hauptstadt gehört zu genau einem Land.", "Every country has exactly one capital; every capital belongs to exactly one country."), answer: 0 },
  { scenario: L("Ein Lehrer unterrichtet mehrere Klassen; eine Klasse wird von mehreren Lehrern unterrichtet.", "A teacher teaches several classes; a class is taught by several teachers."), answer: 2 },
  { scenario: L("Ein Verlag veröffentlicht viele Bücher; jedes Buch erscheint bei genau einem Verlag.", "A publisher publishes many books; every book appears with exactly one publisher."), answer: 1 },
  { scenario: L("Jede Person hat genau einen Personalausweis; jeder Ausweis gehört zu genau einer Person.", "Every person has exactly one identity card; every card belongs to exactly one person."), answer: 0 },
  { scenario: L("Eine Abteilung hat viele Mitarbeiter; jeder Mitarbeiter gehört zu genau einer Abteilung.", "A department has many employees; every employee belongs to exactly one department."), answer: 1 },
  { scenario: L("Ein Film hat viele Schauspieler; ein Schauspieler spielt in vielen Filmen.", "A film has many actors; an actor plays in many films."), answer: 2 },
];

const ER_TERMS: Array<{ item: Localized; answer: number }> = [
  { item: L("„Kunde“ in einem Modell für einen Onlineshop", "“Customer” in a model of an online shop"), answer: 0 },
  { item: L("„nachname“ eines Kunden", "“last_name” of a customer"), answer: 1 },
  { item: L("„bestellt“ zwischen Kunde und Produkt", "“orders” between customer and product"), answer: 2 },
  { item: L("„Produkt“ in einem Modell für einen Onlineshop", "“Product” in a model of an online shop"), answer: 0 },
  { item: L("„preis“ eines Produkts", "“price” of a product"), answer: 1 },
  { item: L("„unterrichtet“ zwischen Lehrer und Klasse", "“teaches” between teacher and class"), answer: 2 },
];

const ER_READINGS: Array<{ diagram: Localized; question: Localized; options: Localized<string[]>; answer: number }> = [
  {
    diagram: L("Kunde —1— gibt auf —n— Bestellung", "Customer —1— places —n— Order"),
    question: L("Was bedeutet das n an der Bestellung?", "What does the n at Order mean?"),
    options: L(
      ["Ein Kunde kann viele Bestellungen aufgeben", "Eine Bestellung kann vielen Kunden gehören", "Es gibt genau n Kunden"],
      ["A customer can place many orders", "An order can belong to many customers", "There are exactly n customers"],
    ),
    answer: 0,
  },
  {
    diagram: L("Schüler —n— besucht —m— Kurs", "Student —n— attends —m— Course"),
    question: L("Was sagt das Modell aus?", "What does the model say?"),
    options: L(
      ["Ein Schüler besucht mehrere Kurse, und ein Kurs hat mehrere Schüler", "Jeder Schüler besucht genau einen Kurs", "Ein Kurs hat genau einen Schüler"],
      ["A student attends several courses, and a course has several students", "Every student attends exactly one course", "A course has exactly one student"],
    ),
    answer: 0,
  },
  {
    diagram: L("Mitarbeiter —1— leitet —1— Abteilung", "Employee —1— heads —1— Department"),
    question: L("Was sagt das Modell aus?", "What does the model say?"),
    options: L(
      ["Jede Abteilung hat genau eine Leitung, und niemand leitet zwei Abteilungen", "Eine Abteilung hat viele Leiter", "Ein Mitarbeiter leitet alle Abteilungen"],
      ["Every department has exactly one head, and nobody heads two departments", "A department has many heads", "One employee heads all departments"],
    ),
    answer: 0,
  },
];

const LESSON_ER_2: Lesson = {
  id: "er-2-kardinalitaet",
  stageId: "stage-3-beziehungen",
  stepNumber: 2,
  module: "2.3.2",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Entitäten, Beziehungen, Kardinalitäten",
      subtitle: "Das Entity-Relationship-Modell: 1:1, 1:n und n:m",
      whyItMatters:
        "Bevor du Tabellen anlegst, klärst du, welche Dinge es gibt und wie sie zusammenhängen. Wer die Kardinalität falsch bestimmt, baut eine Datenbank, in der eine Bestellung nur ein Produkt enthalten kann.",
      explanationHtml: `
<p>Das <strong>Entity-Relationship-Modell</strong> (ER-Modell) beschreibt einen Datenbestand, bevor es Tabellen gibt:</p>
<ul>
  <li>Eine <strong>Entität</strong> ist ein Objekttyp, über den etwas gespeichert wird: Kunde, Produkt, Bestellung. Im Diagramm ein Rechteck.</li>
  <li>Ein <strong>Attribut</strong> ist eine Eigenschaft einer Entität: nachname, preis.</li>
  <li>Eine <strong>Beziehung</strong> verbindet zwei Entitäten, benannt mit einem Verb: Kunde <em>gibt auf</em> Bestellung. Im Diagramm eine Raute.</li>
</ul>
<p>Die <strong>Kardinalität</strong> sagt, wie viele Objekte der einen Seite zu einem Objekt der anderen gehören können. Du bestimmst sie mit zwei Fragen: Wie viele B gehören zu einem A? Wie viele A zu einem B?</p>
<ul>
  <li><strong>1:1</strong>: Jeder Kunde hat genau ein Benutzerkonto, jedes Konto genau einen Kunden.</li>
  <li><strong>1:n</strong>: Ein Kunde gibt viele Bestellungen auf, jede Bestellung gehört zu einem Kunden.</li>
  <li><strong>n:m</strong>: Eine Bestellung enthält viele Produkte, ein Produkt steckt in vielen Bestellungen.</li>
</ul>
<p>Im Diagramm stehen die Kardinalitäten an den Linien: Kunde —1— gibt auf —n— Bestellung. Die Kardinalität entscheidet in der nächsten Lektion, wo der Fremdschlüssel landet.</p>`,
      syntax: [
        { name: "Kardinalität bestimmen", sql: "Wie viele B je A?  Wie viele A je B?", note: "1:1, 1:n oder n:m" },
      ],
      quiz: {
        question: "Kunde gibt Bestellungen auf: Welche Kardinalität hat die Beziehung?",
        options: ["1:n, denn ein Kunde kann viele Bestellungen haben, eine Bestellung aber nur einen Kunden", "n:m, denn es gibt viele Kunden und viele Bestellungen", "1:1, denn jede Bestellung hat genau einen Kunden"],
        correctIndex: 0,
        explanation: "Entscheidend ist je ein Objekt: ein Kunde, viele Bestellungen; eine Bestellung, ein Kunde.",
      },
      lab: {
        title: "Modell-Werkstatt: Kardinalitäten setzen",
        intro: "Lies jedes Szenario und wähle die Kardinalität. Das Diagramm passt sich an.",
        goals: {
          g1: "Bestimme die Kardinalität von Kunde und Bestellung richtig.",
          g2: "Bestimme die Kardinalität von Bestellung und Produkt richtig.",
          g3: "Bestimme die übrigen drei Beziehungen richtig.",
        },
      },
      celebrationMessage: "Du beschreibst einen Datenbestand als Entitäten mit Beziehungen und Kardinalitäten.",
    },
    {
      title: "Entities, relationships, cardinalities",
      subtitle: "The entity-relationship model: 1:1, 1:n and n:m",
      whyItMatters:
        "Before you create tables you clarify which things exist and how they relate. Get the cardinality wrong and you build a database in which an order can hold only one product.",
      explanationHtml: `
<p>The <strong>entity-relationship model</strong> (ER model) describes a data set before there are tables:</p>
<ul>
  <li>An <strong>entity</strong> is a type of object something is stored about: customer, product, order. A rectangle in the diagram.</li>
  <li>An <strong>attribute</strong> is a property of an entity: last_name, price.</li>
  <li>A <strong>relationship</strong> connects two entities and is named with a verb: customer <em>places</em> order. A diamond in the diagram.</li>
</ul>
<p>The <strong>cardinality</strong> says how many objects of one side can belong to one object of the other. You determine it with two questions: how many B per A? How many A per B?</p>
<ul>
  <li><strong>1:1</strong>: every customer has exactly one user account, every account exactly one customer.</li>
  <li><strong>1:n</strong>: a customer places many orders, every order belongs to one customer.</li>
  <li><strong>n:m</strong>: an order contains many products, a product sits in many orders.</li>
</ul>
<p>In the diagram the cardinalities sit on the lines: Customer —1— places —n— Order. In the next lesson the cardinality decides where the foreign key goes.</p>`,
      syntax: [
        { name: "Determine the cardinality", sql: "How many B per A?  How many A per B?", note: "1:1, 1:n or n:m" },
      ],
      quiz: {
        question: "Customer places orders: which cardinality does the relationship have?",
        options: ["1:n, because a customer can have many orders, but an order only one customer", "n:m, because there are many customers and many orders", "1:1, because every order has exactly one customer"],
        correctIndex: 0,
        explanation: "What counts is one object at a time: one customer, many orders; one order, one customer.",
      },
      lab: {
        title: "Model workshop: set cardinalities",
        intro: "Read every scenario and pick the cardinality. The diagram follows.",
        goals: {
          g1: "Determine the cardinality of customer and order correctly.",
          g2: "Determine the cardinality of order and product correctly.",
          g3: "Determine the remaining three relationships correctly.",
        },
      },
      celebrationMessage: "You describe a data set as entities with relationships and cardinalities.",
    },
  ),
  lab: ER_LAB,
  exercises: [
    {
      id: "kardinalitaet",
      make: (rng, _level, locale) => {
        const pick = rng.pick(CARDINALITY_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: L(`${pick.scenario.de} Welche Kardinalität hat die Beziehung?`, `${pick.scenario.en} Which cardinality does the relationship have?`),
          options: L(["1:1", "1:n", "n:m"], ["1:1", "1:n", "n:m"]),
          correctIndex: pick.answer,
          explanation: L(
            "Zwei Fragen: Wie viele B je A? Wie viele A je B? Eins und eins: 1:1. Eins und viele: 1:n. Viele und viele: n:m.",
            "Two questions: how many B per A? How many A per B? One and one: 1:1. One and many: 1:n. Many and many: n:m.",
          ),
        });
      },
    },
    {
      id: "er-begriff",
      make: (rng, _level, locale) => {
        const pick = rng.pick(ER_TERMS);
        return choiceTask(locale, rng, {
          prompt: L(`Was ist ${pick.item.de} im ER-Modell?`, `What is ${pick.item.en} in the ER model?`),
          options: L(["eine Entität", "ein Attribut", "eine Beziehung"], ["an entity", "an attribute", "a relationship"]),
          correctIndex: pick.answer,
          explanation: L(
            "Entität: ein Objekttyp (Rechteck). Attribut: eine Eigenschaft. Beziehung: ein Verb zwischen zwei Entitäten (Raute).",
            "Entity: a type of object (rectangle). Attribute: a property. Relationship: a verb between two entities (diamond).",
          ),
        });
      },
    },
    {
      id: "diagramm-lesen",
      make: (rng, _level, locale) => {
        const pick = rng.pick(ER_READINGS);
        return choiceTask(locale, rng, {
          prompt: L(`ER-Diagramm: ${pick.diagram.de}. ${pick.question.de}`, `ER diagram: ${pick.diagram.en}. ${pick.question.en}`),
          options: pick.options,
          correctIndex: pick.answer,
          explanation: L(
            "Die Zahl oder der Buchstabe an einer Entität sagt, wie viele davon zu einem Objekt der anderen Seite gehören können.",
            "The number or letter at an entity says how many of it can belong to one object of the other side.",
          ),
        });
      },
    },
  ],
};

// ─── Lektion 13: Abbildungsregeln und Fremdschlüssel ────────────────────────

const FK_SCENARIOS: Array<{ scenario: Localized; options: Localized<string[]>; answer: number }> = [
  {
    scenario: L("Klasse und Schüler (1:n): Eine Klasse hat viele Schüler.", "Class and student (1:n): a class has many students."),
    options: L(
      ["In der Tabelle schueler als klasse_id (n-Seite)", "In der Tabelle klasse als schueler_id", "In einer neuen Zwischentabelle"],
      ["In the table students as class_id (n side)", "In the table classes as student_id", "In a new link table"],
    ),
    answer: 0,
  },
  {
    scenario: L("Kunde und Bestellung (1:n): Ein Kunde gibt viele Bestellungen auf.", "Customer and order (1:n): a customer places many orders."),
    options: L(
      ["In der Tabelle bestellungen als kunden_id (n-Seite)", "In der Tabelle kunden als bestell_id", "In einer neuen Zwischentabelle"],
      ["In the table orders as customer_id (n side)", "In the table customers as order_id", "In a new link table"],
    ),
    answer: 0,
  },
  {
    scenario: L("Schüler und Wahlkurs (n:m): Ein Schüler besucht mehrere Kurse, ein Kurs hat viele Schüler.", "Student and elective course (n:m): a student attends several courses, a course has many students."),
    options: L(
      ["In einer neuen Zwischentabelle teilnahmen mit schueler_id und kurs_id", "In der Tabelle schueler als kurs_id", "In der Tabelle kurse als schueler_id"],
      ["In a new link table enrolments with student_id and course_id", "In the table students as course_id", "In the table courses as student_id"],
    ),
    answer: 0,
  },
  {
    scenario: L("Bestellung und Produkt (n:m): Eine Bestellung enthält viele Produkte, ein Produkt steckt in vielen Bestellungen.", "Order and product (n:m): an order contains many products, a product sits in many orders."),
    options: L(
      ["In einer Zwischentabelle positionen mit bestell_id und produkt_id", "In der Tabelle produkte als bestell_id", "In der Tabelle bestellungen als produkt_id"],
      ["In a link table order_items with order_id and product_id", "In the table products as order_id", "In the table orders as product_id"],
    ),
    answer: 0,
  },
  {
    scenario: L("Kategorie und Produkt (1:n): Eine Kategorie umfasst viele Produkte.", "Category and product (1:n): a category comprises many products."),
    options: L(
      ["In der Tabelle produkte als kategorie_id (n-Seite)", "In der Tabelle kategorien als produkt_id", "In einer neuen Zwischentabelle"],
      ["In the table products as category_id (n side)", "In the table categories as product_id", "In a new link table"],
    ),
    answer: 0,
  },
];

const ORDER_DATES = ["2026-10-20", "2026-10-21", "2026-10-22"];

const LESSON_ER_3: Lesson = {
  id: "er-3-fremdschluessel",
  stageId: "stage-3-beziehungen",
  stepNumber: 3,
  module: "2.3.2",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Vom Modell zur Tabelle: Fremdschlüssel",
      subtitle: "Abbildungsregeln für 1:n und n:m, referenzielle Integrität",
      whyItMatters:
        "Der Fremdschlüssel ist die Stelle, an der Tabellen zusammenhängen. Verweist er ins Leere, gehört eine Bestellung niemandem. Das DBMS verhindert genau das, wenn du ihn deklarierst.",
      explanationHtml: `
<p>Drei <strong>Abbildungsregeln</strong> machen aus einem ER-Modell Tabellen:</p>
<ul>
  <li>Jede <strong>Entität</strong> wird eine Tabelle, jedes <strong>Attribut</strong> eine Spalte, der Schlüssel der Entität wird Primärschlüssel.</li>
  <li><strong>1:n</strong>: Der Primärschlüssel der 1-Seite wird als <strong>Fremdschlüssel</strong> (Foreign Key) in die Tabelle der n-Seite aufgenommen. <code>bestellungen.kunden_id</code> verweist auf <code>kunden.kunden_id</code>.</li>
  <li><strong>n:m</strong>: Es entsteht eine <strong>Zwischentabelle</strong> (Beziehungstabelle) mit zwei Fremdschlüsseln. <code>positionen</code> verbindet <code>bestellungen</code> und <code>produkte</code> und trägt die Menge als eigenes Attribut.</li>
</ul>
<p>Ein Fremdschlüssel wird mit <code>REFERENCES</code> deklariert:</p>
<pre class="sql"><code>CREATE TABLE bestellungen (
  bestell_id INTEGER PRIMARY KEY,
  kunden_id INTEGER NOT NULL REFERENCES kunden (kunden_id),
  bestelldatum TEXT NOT NULL
);</code></pre>
<p><strong>Referenzielle Integrität</strong>: Jeder Fremdschlüsselwert muss auf einen vorhandenen Primärschlüssel zeigen. Das DBMS lehnt eine Bestellung für einen Kunden ab, den es nicht gibt, und es lehnt ab, einen Kunden zu löschen, auf den noch Bestellungen verweisen. Die Fehlermeldung lautet <code>FOREIGN KEY constraint failed</code>.</p>`,
      syntax: [
        { name: "Fremdschlüssel deklarieren", sql: "spalte INTEGER REFERENCES tabelle (primaerschluessel)", note: "In CREATE TABLE der n-Seite." },
        { name: "1:n abbilden", sql: "Primärschlüssel der 1-Seite → Fremdschlüssel in der n-Tabelle", note: "bestellungen.kunden_id" },
        { name: "n:m abbilden", sql: "Zwischentabelle mit zwei Fremdschlüsseln", note: "positionen (bestell_id, produkt_id, menge)" },
      ],
      quiz: {
        question: "Wie wird eine n:m-Beziehung in Tabellen umgesetzt?",
        options: [
          "Mit einer Zwischentabelle, die die Primärschlüssel beider Seiten als Fremdschlüssel enthält",
          "Der Primärschlüssel der einen Seite wandert als Fremdschlüssel in die andere Tabelle",
          "Beide Tabellen werden zu einer zusammengelegt",
        ],
        correctIndex: 0,
        explanation: "Viele zu viele passt in keine der beiden Tabellen; die Zwischentabelle löst die Beziehung in zwei 1:n auf.",
      },
      lab: {
        title: "Sandbox: Referenzielle Integrität",
        intro: "Fremdschlüssel sind aktiv. Versuche, sie zu verletzen, und sieh, wie das DBMS reagiert.",
        goals: {
          g1: "Versuche, eine Bestellung für die kunden_id 99 anzulegen, die es nicht gibt, und löse so einen Fremdschlüssel-Fehler aus.",
          g2: "Lege die Bestellung 115 für Kunde 4 (David Maier) mit bestelldatum '2026-10-20' an.",
          g3: "Versuche, Kunde 1 mit DELETE zu löschen, und lies die Fehlermeldung: Bestellungen verweisen auf ihn.",
        },
      },
      celebrationMessage: "Du setzt Beziehungen mit Fremdschlüsseln um und weißt, was referenzielle Integrität schützt.",
    },
    {
      title: "From model to table: foreign keys",
      subtitle: "Mapping rules for 1:n and n:m, referential integrity",
      whyItMatters:
        "The foreign key is where tables connect. If it points into the void, an order belongs to nobody. The DBMS prevents exactly that once you declare it.",
      explanationHtml: `
<p>Three <strong>mapping rules</strong> turn an ER model into tables:</p>
<ul>
  <li>Every <strong>entity</strong> becomes a table, every <strong>attribute</strong> a column, the entity's key becomes the primary key.</li>
  <li><strong>1:n</strong>: the primary key of the 1 side is added to the table of the n side as a <strong>foreign key</strong>. <code>orders.customer_id</code> refers to <code>customers.customer_id</code>.</li>
  <li><strong>n:m</strong>: a <strong>link table</strong> (relationship table) with two foreign keys is created. <code>order_items</code> connects <code>orders</code> and <code>products</code> and carries the quantity as its own attribute.</li>
</ul>
<p>A foreign key is declared with <code>REFERENCES</code>:</p>
<pre class="sql"><code>CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers (customer_id),
  order_date TEXT NOT NULL
);</code></pre>
<p><strong>Referential integrity</strong>: every foreign key value must point to an existing primary key. The DBMS refuses an order for a customer who does not exist, and it refuses to delete a customer that orders still refer to. The error message reads <code>FOREIGN KEY constraint failed</code>.</p>`,
      syntax: [
        { name: "Declare a foreign key", sql: "column INTEGER REFERENCES table (primary_key)", note: "In CREATE TABLE of the n side." },
        { name: "Map 1:n", sql: "primary key of the 1 side → foreign key in the n table", note: "orders.customer_id" },
        { name: "Map n:m", sql: "link table with two foreign keys", note: "order_items (order_id, product_id, quantity)" },
      ],
      quiz: {
        question: "How is an n:m relationship implemented in tables?",
        options: [
          "With a link table that holds the primary keys of both sides as foreign keys",
          "The primary key of one side moves into the other table as a foreign key",
          "Both tables are merged into one",
        ],
        correctIndex: 0,
        explanation: "Many to many fits into neither table; the link table resolves the relationship into two 1:n.",
      },
      lab: {
        title: "Sandbox: referential integrity",
        intro: "Foreign keys are active. Try to violate them and watch the DBMS react.",
        goals: {
          g1: "Try to create an order for the customer_id 99, which does not exist, and trigger a foreign key error.",
          g2: "Create the order 115 for customer 4 (David Maier) with order_date '2026-10-20'.",
          g3: "Try to delete customer 1 with DELETE and read the error message: orders still refer to him.",
        },
      },
      celebrationMessage: "You implement relationships with foreign keys and know what referential integrity protects.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT * FROM {bestellungen}\nWHERE {kunden_id} = 1;", [
    goal("g1", (ctx) => lastErrorIncludes(ctx, "FOREIGN KEY constraint failed") && lastFailedStatementIs(ctx, "INSERT")),
    goal(
      "g2",
      (ctx) =>
        countNow(ctx, "SELECT COUNT(*) FROM {bestellungen} WHERE {bestell_id} = 115 AND {kunden_id} = 4 AND {bestelldatum} = '2026-10-20';") === 1,
    ),
    goal("g3", (ctx) => lastErrorIncludes(ctx, "FOREIGN KEY constraint failed") && lastFailedStatementIs(ctx, "DELETE")),
  ]),
  exercises: [
    {
      id: "wo-fremdschluessel",
      make: (rng, _level, locale) => {
        const pick = rng.pick(FK_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: L(`${pick.scenario.de} Wo landet der Fremdschlüssel?`, `${pick.scenario.en} Where does the foreign key go?`),
          options: pick.options,
          correctIndex: pick.answer,
          explanation: L(
            "1:n: Fremdschlüssel in die Tabelle der n-Seite. n:m: eine Zwischentabelle mit zwei Fremdschlüsseln.",
            "1:n: foreign key into the table of the n side. n:m: a link table with two foreign keys.",
          ),
        });
      },
    },
    {
      id: "bestellung-anlegen",
      make: (rng, level, locale) => {
        const customer = rng.pick(CUSTOMERS);
        const date = rng.pick(ORDER_DATES);
        return mutationTask(locale, level, {
          prompt: L(
            `Füge in {bestellungen} eine Bestellung ein: {bestell_id} 115, {kunden_id} ${customer.id}, {bestelldatum} '${date}', {status} {offen}.`,
            `Insert an order into {bestellungen}: {bestell_id} 115, {kunden_id} ${customer.id}, {bestelldatum} '${date}', {status} {offen}.`,
          ),
          prompt2: L(
            `${customer.vorname} ${customer.nachname} bestellt am ${date} erneut. Lege die Bestellung mit der Nummer 115 und dem Status {offen} an. Die Kundennummer findest du in {kunden}.`,
            `${customer.vorname} ${customer.nachname} orders again on ${date}. Create the order with the number 115 and the status {offen}. You find the customer number in {kunden}.`,
          ),
          hint: L("INSERT INTO <Tabelle> (<Spalten>) VALUES (<Werte>); der Fremdschlüssel ist die Kundennummer.", "INSERT INTO <table> (<columns>) VALUES (<values>); the foreign key is the customer number."),
          sql: `INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}, {status})\nVALUES (115, ${customer.id}, '${date}', '{offen}');`,
          verifyTables: ["{bestellungen}"],
          meta: { customer: customer.id, date },
        });
      },
    },
    {
      id: "position-anlegen",
      make: (rng, level, locale) => {
        const product = rng.pick(PRODUCTS);
        const order = rng.pick(ORDERS.filter((o) => o.status === "offen"));
        const quantity = rng.int(1, 3);
        return mutationTask(locale, level, {
          prompt: L(
            `Füge in {positionen} ein: {position_id} 27, {bestell_id} ${order.id}, {produkt_id} ${product.id}, {menge} ${quantity}.`,
            `Insert into {positionen}: {position_id} 27, {bestell_id} ${order.id}, {produkt_id} ${product.id}, {menge} ${quantity}.`,
          ),
          prompt2: L(
            `Zur offenen Bestellung ${order.id} kommt das Produkt {${product.name}} dazu, ${quantity} Stück. Lege die Position mit der Nummer 27 an; die Produktnummer findest du in {produkte}.`,
            `The product {${product.name}} is added to the open order ${order.id}, ${quantity} piece(s). Create the item with the number 27; you find the product number in {produkte}.`,
          ),
          hint: L("INSERT INTO <Zwischentabelle> (<Schlüssel>, <Fremdschlüssel 1>, <Fremdschlüssel 2>, <Attribut>) VALUES (…);", "INSERT INTO <link table> (<key>, <foreign key 1>, <foreign key 2>, <attribute>) VALUES (…);"),
          sql: `INSERT INTO {positionen} ({position_id}, {bestell_id}, {produkt_id}, {menge})\nVALUES (27, ${order.id}, ${product.id}, ${quantity});`,
          verifyTables: ["{positionen}"],
          meta: { order: order.id, product: product.id, quantity },
        });
      },
    },
  ],
};

// ─── Lektion 14: JOIN über zwei Tabellen ────────────────────────────────────

const JOIN_ORDER_FILTERS: Array<{ where: string; words: Localized }> = [
  { where: "WHERE b.{status} = '{offen}'", words: L("aller offenen Bestellungen", "of all open orders") },
  { where: "WHERE b.{status} = '{geliefert}'", words: L("aller gelieferten Bestellungen", "of all delivered orders") },
  { where: "WHERE b.{status} = '{versendet}'", words: L("aller versendeten Bestellungen", "of all shipped orders") },
  { where: "WHERE b.{bestelldatum} >= '2026-10-01'", words: L("aller Bestellungen seit dem 1. Oktober 2026", "of all orders since 1 October 2026") },
];

const LESSON_JOIN_1: Lesson = {
  id: "join-1-zwei-tabellen",
  stageId: "stage-3-beziehungen",
  stepNumber: 4,
  module: "2.3.2",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Zwei Tabellen verknüpfen: JOIN",
      subtitle: "JOIN … ON verbindet Zeilen über Fremdschlüssel und Primärschlüssel; Spalten qualifizieren, Tabellen abkürzen",
      whyItMatters:
        "In bestellungen steht nur eine Kundennummer. Der Name steht in kunden. Erst der JOIN zeigt, wer was bestellt hat, und zwar ohne die Daten doppelt zu speichern.",
      explanationHtml: `
<p>Ein <code>JOIN</code> (Verbund) setzt Zeilen zweier Tabellen zusammen, wenn die <code>ON</code>-Bedingung erfüllt ist. Fast immer verbindet sie Fremdschlüssel und Primärschlüssel:</p>
<pre class="sql"><code>SELECT bestellungen.bestell_id, bestellungen.bestelldatum, kunden.nachname
FROM bestellungen
JOIN kunden ON bestellungen.kunden_id = kunden.kunden_id;</code></pre>
<p>Kommt ein Spaltenname in beiden Tabellen vor (wie <code>kunden_id</code>), musst du ihn mit dem Tabellennamen <strong>qualifizieren</strong>. Kürzer wird es mit <strong>Tabellen-Aliasen</strong>:</p>
<pre class="sql"><code>SELECT b.bestell_id, b.bestelldatum, k.vorname, k.nachname
FROM bestellungen b
JOIN kunden k ON b.kunden_id = k.kunden_id
WHERE b.status = 'offen';</code></pre>
<p>Dieser <code>INNER JOIN</code> (das Wort INNER darf man weglassen) liefert nur Zeilen, die in beiden Tabellen einen Partner haben: Kunden ohne Bestellung erscheinen nicht. Die Klauseln bleiben in ihrer Reihenfolge: <code>SELECT … FROM … JOIN … ON … WHERE … ORDER BY …</code>.</p>`,
      syntax: [
        { name: "Zwei Tabellen verbinden", sql: "SELECT … FROM tabelle1 t1 JOIN tabelle2 t2 ON t1.fremdschluessel = t2.primaerschluessel;", note: "t1, t2 sind Aliase." },
        { name: "Spalte qualifizieren", sql: "tabelle.spalte   oder   alias.spalte", note: "Pflicht bei gleichnamigen Spalten." },
      ],
      quiz: {
        question: "Was steht in der ON-Bedingung eines JOIN zwischen bestellungen und kunden?",
        options: [
          "bestellungen.kunden_id = kunden.kunden_id, also Fremdschlüssel gleich Primärschlüssel",
          "bestellungen.bestell_id = kunden.kunden_id",
          "kunden.nachname = bestellungen.status",
        ],
        correctIndex: 0,
        explanation: "Der Fremdschlüssel der n-Seite trifft den Primärschlüssel der 1-Seite.",
      },
      lab: {
        title: "Sandbox: Tabellen verbinden",
        intro: "Schreib JOINs mit ON-Bedingung und Aliasen.",
        goals: {
          g1: "Zeige zu jeder Bestellung bestell_id, bestelldatum und den nachname des Kunden.",
          g2: "Zeige vorname, nachname und bestelldatum aller Bestellungen mit Status offen.",
          g3: "Zeige zu jeder Position die bezeichnung des Produkts und die menge.",
        },
      },
      celebrationMessage: "Du verbindest Tabellen über Schlüssel und holst zusammengehörige Daten in einer Abfrage.",
    },
    {
      title: "Joining two tables: JOIN",
      subtitle: "JOIN … ON connects rows via foreign key and primary key; qualifying columns, table aliases",
      whyItMatters:
        "The orders table holds only a customer number. The name sits in customers. Only the JOIN shows who ordered what, without storing the data twice.",
      explanationHtml: `
<p>A <code>JOIN</code> combines rows of two tables when the <code>ON</code> condition holds. It almost always connects foreign key and primary key:</p>
<pre class="sql"><code>SELECT orders.order_id, orders.order_date, customers.last_name
FROM orders
JOIN customers ON orders.customer_id = customers.customer_id;</code></pre>
<p>When a column name exists in both tables (like <code>customer_id</code>) you must <strong>qualify</strong> it with the table name. <strong>Table aliases</strong> make it shorter:</p>
<pre class="sql"><code>SELECT o.order_id, o.order_date, c.first_name, c.last_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'open';</code></pre>
<p>This <code>INNER JOIN</code> (the word INNER may be left out) returns only rows that have a partner in both tables: customers without an order do not appear. The clauses keep their order: <code>SELECT … FROM … JOIN … ON … WHERE … ORDER BY …</code>.</p>`,
      syntax: [
        { name: "Join two tables", sql: "SELECT … FROM table1 t1 JOIN table2 t2 ON t1.foreign_key = t2.primary_key;", note: "t1, t2 are aliases." },
        { name: "Qualify a column", sql: "table.column   or   alias.column", note: "Required for columns with the same name." },
      ],
      quiz: {
        question: "What goes into the ON condition of a JOIN between orders and customers?",
        options: [
          "orders.customer_id = customers.customer_id, that is foreign key equals primary key",
          "orders.order_id = customers.customer_id",
          "customers.last_name = orders.status",
        ],
        correctIndex: 0,
        explanation: "The foreign key of the n side meets the primary key of the 1 side.",
      },
      lab: {
        title: "Sandbox: connect tables",
        intro: "Write JOINs with an ON condition and aliases.",
        goals: {
          g1: "Show for every order order_id, order_date and the last_name of the customer.",
          g2: "Show first_name, last_name and order_date of all orders with status open.",
          g3: "Show for every order item the name of the product and the quantity.",
        },
      },
      celebrationMessage: "You connect tables via keys and fetch related data in one query.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT b.{bestell_id}, k.{ort}\nFROM {bestellungen} b\nJOIN {kunden} k ON b.{kunden_id} = k.{kunden_id};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT b.{bestell_id}, b.{bestelldatum}, k.{nachname} FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT k.{vorname}, k.{nachname}, b.{bestelldatum} FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} WHERE b.{status} = '{offen}';")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT p.{bezeichnung}, pos.{menge} FROM {positionen} pos JOIN {produkte} p ON pos.{produkt_id} = p.{produkt_id};")),
  ]),
  exercises: [
    {
      id: "bestellung-kunde",
      make: (rng, level, locale) => {
        const pick = rng.pick(JOIN_ORDER_FILTERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {bestellungen} (Alias b) mit {kunden} (Alias k) über {kunden_id} und zeige b.{bestell_id}, k.{vorname}, k.{nachname} für die Zeilen mit ${pick.where}.`,
            `Join {bestellungen} (alias b) with {kunden} (alias k) via {kunden_id} and show b.{bestell_id}, k.{vorname}, k.{nachname} for the rows with ${pick.where}.`,
          ),
          prompt2: L(
            `Zeige Bestellnummer, Vorname und Nachname ${pick.words.de}.`,
            `Show order number, first name and last name ${pick.words.en}.`,
          ),
          hint: L("SELECT … FROM <Tabelle1> t1 JOIN <Tabelle2> t2 ON t1.<FK> = t2.<PK> WHERE …;", "SELECT … FROM <table1> t1 JOIN <table2> t2 ON t1.<FK> = t2.<PK> WHERE …;"),
          sql: `SELECT b.{bestell_id}, k.{vorname}, k.{nachname} FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} ${pick.where};`,
          meta: { where: pick.where },
        });
      },
    },
    {
      id: "position-produkt",
      make: (rng, level, locale) => {
        const order = rng.pick(ORDERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {positionen} mit {produkte} über {produkt_id} und zeige {bezeichnung}, {preis} und {menge} für die Zeilen mit {bestell_id} ${order.id}.`,
            `Join {positionen} with {produkte} via {produkt_id} and show {bezeichnung}, {preis} and {menge} for the rows with {bestell_id} ${order.id}.`,
          ),
          prompt2: L(
            `Was enthält die Bestellung ${order.id}? Zeige Produktname, Preis und Menge jeder Position.`,
            `What does order ${order.id} contain? Show product name, price and quantity of every item.`,
          ),
          hint: L("SELECT … FROM <Zwischentabelle> pos JOIN <Tabelle> p ON pos.<FK> = p.<PK> WHERE pos.<Spalte> = <Zahl>;", "SELECT … FROM <link table> i JOIN <table> p ON i.<FK> = p.<PK> WHERE i.<column> = <number>;"),
          sql: `SELECT p.{bezeichnung}, p.{preis}, pos.{menge} FROM {positionen} pos JOIN {produkte} p ON pos.{produkt_id} = p.{produkt_id} WHERE pos.{bestell_id} = ${order.id};`,
          meta: { order: order.id },
        });
      },
    },
    {
      id: "kunde-bestellungen",
      make: (rng, level, locale) => {
        const customer = rng.pick(CUSTOMERS_WITH_ORDERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {bestellungen} mit {kunden} über {kunden_id} und zeige {bestell_id}, {bestelldatum} und {status} für die Zeilen mit {nachname} '${customer.nachname}'.`,
            `Join {bestellungen} with {kunden} via {kunden_id} and show {bestell_id}, {bestelldatum} and {status} for the rows with {nachname} '${customer.nachname}'.`,
          ),
          prompt2: L(
            `${customer.vorname} ${customer.nachname} fragt nach allen eigenen Bestellungen. Zeige Nummer, Datum und Status; suche über den Nachnamen.`,
            `${customer.vorname} ${customer.nachname} asks for all their orders. Show number, date and status; search by the last name.`,
          ),
          hint: L("SELECT … FROM <Tabelle1> b JOIN <Tabelle2> k ON b.<FK> = k.<PK> WHERE k.<Spalte> = 'Text';", "SELECT … FROM <table1> o JOIN <table2> c ON o.<FK> = c.<PK> WHERE c.<column> = 'text';"),
          sql: `SELECT b.{bestell_id}, b.{bestelldatum}, b.{status} FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} WHERE k.{nachname} = '${customer.nachname}';`,
          meta: { customer: customer.nachname },
        });
      },
    },
  ],
};

// ─── Lektion 15: Drei Tabellen ──────────────────────────────────────────────

const THREE_FILTERS: Array<{ where: string; words: Localized }> = [
  { where: "WHERE b.{status} = '{offen}'", words: L("aller offenen Bestellungen", "of all open orders") },
  { where: "WHERE b.{status} = '{geliefert}'", words: L("aller gelieferten Bestellungen", "of all delivered orders") },
  { where: "WHERE p.{kategorie} = '{Schule}'", words: L("aller bestellten Schulartikel", "of all ordered school items") },
  { where: "WHERE p.{kategorie} = '{Elektronik}'", words: L("aller bestellten Elektronikartikel", "of all ordered electronics items") },
];

const LESSON_JOIN_2: Lesson = {
  id: "join-2-drei-tabellen",
  stageId: "stage-3-beziehungen",
  stepNumber: 5,
  module: "2.3.2",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Über die Zwischentabelle: drei und mehr Tabellen",
      subtitle: "Eine n:m-Beziehung abfragen: Selektion, Projektion und Join zusammen",
      whyItMatters:
        "„Welche Produkte hat Anna Berg bestellt?“ führt von kunden über bestellungen und positionen bis zu produkte. Vier Tabellen, eine Abfrage: Das ist die Stärke des relationalen Modells.",
      explanationHtml: `
<p>Jede <code>JOIN</code>-Klausel bringt eine weitere Tabelle ins Spiel; jede <code>ON</code>-Bedingung verbindet einen Fremdschlüssel mit seinem Primärschlüssel. Die Zwischentabelle <code>positionen</code> löst die n:m-Beziehung zwischen Bestellungen und Produkten auf:</p>
<pre class="sql"><code>SELECT b.bestelldatum, p.bezeichnung, pos.menge
FROM bestellungen b
JOIN positionen pos ON pos.bestell_id = b.bestell_id
JOIN produkte p ON p.produkt_id = pos.produkt_id;</code></pre>
<p>Mit einer vierten Tabelle kommt der Kunde dazu. <code>WHERE</code> wählt die Zeilen aus (Selektion), die <code>SELECT</code>-Liste die Spalten (Projektion), der Join verbindet (Verbund):</p>
<pre class="sql"><code>SELECT DISTINCT p.bezeichnung
FROM kunden k
JOIN bestellungen b ON b.kunden_id = k.kunden_id
JOIN positionen pos ON pos.bestell_id = b.bestell_id
JOIN produkte p ON p.produkt_id = pos.produkt_id
WHERE k.nachname = 'Berg';</code></pre>
<p>Tipp: Geh den Weg im Schema-Browser von Tabelle zu Tabelle und schreib für jeden Schritt einen JOIN.</p>`,
      syntax: [
        { name: "Kette von Joins", sql: "FROM a JOIN b ON b.a_id = a.a_id JOIN c ON c.b_id = b.b_id", note: "Ein JOIN je Verbindung." },
        { name: "Betrag einer Bestellung", sql: "SELECT SUM(p.preis * pos.menge) FROM positionen pos JOIN produkte p ON … WHERE pos.bestell_id = 101;", note: "Aggregat über den Join." },
      ],
      quiz: {
        question: "Warum braucht die Frage „Welche Produkte hat Anna Berg bestellt?“ die Tabelle positionen?",
        options: [
          "Weil positionen die n:m-Beziehung zwischen Bestellungen und Produkten herstellt; ohne sie gibt es keinen Weg von bestellungen zu produkte",
          "Weil in positionen die Kundennamen stehen",
          "Weil produkte keinen Primärschlüssel hat",
        ],
        correctIndex: 0,
        explanation: "bestellungen kennt keine Produkte und produkte keine Bestellungen; die Zwischentabelle verbindet beide.",
      },
      lab: {
        title: "Sandbox: Drei und vier Tabellen",
        intro: "Folge den Fremdschlüsseln im Schema-Browser.",
        goals: {
          g1: "Zeige für jede Position bestelldatum, bezeichnung und menge (bestellungen, positionen, produkte).",
          g2: "Zeige für jede Position den nachname des Kunden und die bezeichnung des Produkts (vier Tabellen).",
          g3: "Welche Produkte (bezeichnung, jede nur einmal) hat die Kundin mit nachname 'Berg' bestellt?",
        },
      },
      celebrationMessage: "Du fragst Beziehungen über mehrere Tabellen hinweg ab.",
    },
    {
      title: "Through the link table: three tables and more",
      subtitle: "Querying an n:m relationship: selection, projection and join together",
      whyItMatters:
        "“Which products did Anna Berg order?” leads from customers through orders and order_items to products. Four tables, one query: that is the strength of the relational model.",
      explanationHtml: `
<p>Every <code>JOIN</code> clause brings in another table; every <code>ON</code> condition connects a foreign key with its primary key. The link table <code>order_items</code> resolves the n:m relationship between orders and products:</p>
<pre class="sql"><code>SELECT o.order_date, p.name, i.quantity
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id;</code></pre>
<p>A fourth table adds the customer. <code>WHERE</code> chooses the rows (selection), the <code>SELECT</code> list the columns (projection), the join connects:</p>
<pre class="sql"><code>SELECT DISTINCT p.name
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
WHERE c.last_name = 'Berg';</code></pre>
<p>Tip: walk the path in the schema browser from table to table and write one JOIN per step.</p>`,
      syntax: [
        { name: "Chain of joins", sql: "FROM a JOIN b ON b.a_id = a.a_id JOIN c ON c.b_id = b.b_id", note: "One JOIN per connection." },
        { name: "Total of an order", sql: "SELECT SUM(p.price * i.quantity) FROM order_items i JOIN products p ON … WHERE i.order_id = 101;", note: "Aggregate over the join." },
      ],
      quiz: {
        question: "Why does the question “Which products did Anna Berg order?” need the table order_items?",
        options: [
          "Because order_items establishes the n:m relationship between orders and products; without it there is no path from orders to products",
          "Because order_items holds the customer names",
          "Because products has no primary key",
        ],
        correctIndex: 0,
        explanation: "orders knows no products and products knows no orders; the link table connects both.",
      },
      lab: {
        title: "Sandbox: three and four tables",
        intro: "Follow the foreign keys in the schema browser.",
        goals: {
          g1: "Show for every order item order_date, name and quantity (orders, order_items, products).",
          g2: "Show for every order item the last_name of the customer and the name of the product (four tables).",
          g3: "Which products (name, each only once) did the customer with last_name 'Berg' order?",
        },
      },
      celebrationMessage: "You query relationships across several tables.",
    },
  ),
  lab: sqlLab(
    SHOP,
    "SELECT b.{bestell_id}, p.{bezeichnung}\nFROM {bestellungen} b\nJOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id}\nJOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id};",
    [
      goal("g1", (ctx) => lastResultEquals(ctx, "SELECT b.{bestelldatum}, p.{bezeichnung}, pos.{menge} FROM {bestellungen} b JOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id};")),
      goal("g2", (ctx) => lastResultEquals(ctx, "SELECT k.{nachname}, p.{bezeichnung} FROM {kunden} k JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} JOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id};")),
      goal("g3", (ctx) => lastResultEquals(ctx, "SELECT DISTINCT p.{bezeichnung} FROM {kunden} k JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} JOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} WHERE k.{nachname} = 'Berg';")),
    ],
  ),
  exercises: [
    {
      id: "produkte-eines-kunden",
      make: (rng, level, locale) => {
        const customer = rng.pick(CUSTOMERS_WITH_ORDERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {kunden}, {bestellungen}, {positionen} und {produkte} und zeige mit DISTINCT die {bezeichnung} aller Produkte für den {nachname} '${customer.nachname}'.`,
            `Join {kunden}, {bestellungen}, {positionen} and {produkte} and show with DISTINCT the {bezeichnung} of all products for the {nachname} '${customer.nachname}'.`,
          ),
          prompt2: L(
            `Welche Produkte hat ${customer.vorname} ${customer.nachname} jemals bestellt? Jedes Produkt nur einmal; suche über den Nachnamen.`,
            `Which products has ${customer.vorname} ${customer.nachname} ever ordered? Each product only once; search by the last name.`,
          ),
          hint: L("SELECT DISTINCT … FROM k JOIN b ON … JOIN pos ON … JOIN p ON … WHERE k.<Spalte> = 'Text';", "SELECT DISTINCT … FROM c JOIN o ON … JOIN i ON … JOIN p ON … WHERE c.<column> = 'text';"),
          sql: `SELECT DISTINCT p.{bezeichnung} FROM {kunden} k JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} JOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} WHERE k.{nachname} = '${customer.nachname}';`,
          meta: { customer: customer.nachname },
        });
      },
    },
    {
      id: "positionen-mit-kunde",
      make: (rng, level, locale) => {
        const pick = rng.pick(THREE_FILTERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {kunden} (k), {bestellungen} (b), {positionen} (pos) und {produkte} (p) und zeige k.{nachname}, p.{bezeichnung}, pos.{menge} für die Zeilen mit ${pick.where}.`,
            `Join {kunden} (c), {bestellungen} (b), {positionen} (pos) and {produkte} (p) and show k.{nachname}, p.{bezeichnung}, pos.{menge} for the rows with ${pick.where}.`,
          ),
          prompt2: L(
            `Zeige Nachname des Kunden, Produktname und Menge jeder Position ${pick.words.de}.`,
            `Show the customer's last name, product name and quantity of every item ${pick.words.en}.`,
          ),
          hint: L("Vier Tabellen, drei JOINs, dann WHERE.", "Four tables, three JOINs, then WHERE."),
          sql: `SELECT k.{nachname}, p.{bezeichnung}, pos.{menge} FROM {kunden} k JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} JOIN {positionen} pos ON pos.{bestell_id} = b.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} ${pick.where};`,
          meta: { where: pick.where },
        });
      },
    },
    {
      id: "bestellwert",
      make: (rng, level, locale) => {
        const order = rng.pick(ORDERS);
        return queryTask(locale, level, {
          prompt: L(
            `Verbinde {positionen} mit {produkte} und berechne SUM({preis} * {menge}) für die Zeilen mit {bestell_id} ${order.id}.`,
            `Join {positionen} with {produkte} and compute SUM({preis} * {menge}) for the rows with {bestell_id} ${order.id}.`,
          ),
          prompt2: L(
            `Wie hoch ist der Gesamtbetrag der Bestellung ${order.id}? Preis mal Menge über alle Positionen summiert, eine Zahl.`,
            `What is the total amount of order ${order.id}? Price times quantity summed over all items, one number.`,
          ),
          hint: L("SELECT SUM(p.<Preis> * pos.<Menge>) FROM <Zwischentabelle> pos JOIN <Tabelle> p ON … WHERE pos.<Spalte> = <Zahl>;", "SELECT SUM(p.<price> * i.<quantity>) FROM <link table> i JOIN <table> p ON … WHERE i.<column> = <number>;"),
          sql: `SELECT SUM(p.{preis} * pos.{menge}) FROM {positionen} pos JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} WHERE pos.{bestell_id} = ${order.id};`,
          meta: { order: order.id },
        });
      },
    },
  ],
};

export const STAGE_BEZIEHUNGEN: Stage = {
  id: "stage-3-beziehungen",
  stageNumber: 3,
  icon: "🔗",
  accent: "#b45309",
  text: L(
    {
      title: "Mehrere Tabellen",
      subtitle: "Redundanz, ER-Modell, Fremdschlüssel, JOIN über zwei und mehr Tabellen",
      badgeTitle: "Datenmodelliererin / Datenmodellierer",
      moduleLabel: "IT 2.3.2 Datenbanksysteme II",
    },
    {
      title: "Several tables",
      subtitle: "Redundancy, ER model, foreign keys, JOIN across two tables and more",
      badgeTitle: "Data modeller",
      moduleLabel: "IT 2.3.2 Database systems II",
    },
  ),
  lessons: [LESSON_ER_1, LESSON_ER_2, LESSON_ER_3, LESSON_JOIN_1, LESSON_JOIN_2],
};
