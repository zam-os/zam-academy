import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB3: Lesson[] = [
  {
    id: "re-ordnung",
    lb: 3,
    unit: "3",
    title: "Warum es Recht und Gesetze gibt",
    intro: "Ohne Regeln würde sich der Stärkere durchsetzen. Das Recht ordnet das Zusammenleben und schützt dabei die Schwächeren.",
    paragraphs: [
      "Stell dir ein Fußballspiel ohne Regeln vor: Jeder dürfte foulen, die Spielzeit wäre offen, und Streit wäre sicher. Im Alltag ist es nicht anders, in der Klasse wie auf der Straße. Regeln sagen, was man tun muss (**Gebote**, zum Beispiel bei Rot anhalten) und was man nicht tun darf (**Verbote**, zum Beispiel fremde Sachen wegnehmen). Das Recht erfüllt damit zwei Aufgaben. Die **Ordnungsfunktion** sorgt dafür, dass Menschen miteinander auskommen und wissen, was sie voneinander erwarten können. Die **Schutzfunktion** bewahrt Leben, Gesundheit und Eigentum vor Übergriffen und schützt besonders die Schwächeren.",
      "Wo ein Recht ist, steht meist eine Pflicht auf der anderen Seite. Wer im Laden ein Handy kauft, hat das **Recht**, es zu bekommen; die Verkäuferin hat die **Pflicht**, es zu übergeben. Umgekehrt muss der Käufer zahlen. Regeln gibt es auch in Familie, Verein und Klasse. Rechtsregeln unterscheiden sich von Anstandsregeln und Hausordnungen dadurch, dass der Staat sie notfalls mit Zwang durchsetzt, durch Gerichte und Polizei. Alle geltenden Rechtsregeln zusammen bilden die **Rechtsordnung**. Weil sie für alle gilt, muss niemand sein Recht mit der Faust suchen.",
      "Rechtsregeln haben verschiedene Quellen, die man wie Stufen ordnen kann. Im deutschen Recht steht oben das **Grundgesetz**, die Verfassung mit den Grundrechten (in vielen Bereichen geht dem deutschen Recht das Recht der EU vor). An das Grundgesetz sind alle anderen Regeln gebunden. Darunter stehen **Gesetze**, die ein Parlament beschließt, zum Beispiel das Bürgerliche Gesetzbuch. **Verordnungen** erlässt eine Regierung oder ein Ministerium auf der Grundlage eines Gesetzes, um Einzelheiten zu regeln, etwa die Straßenverkehrs-Ordnung. **Satzungen** geben sich Gemeinden oder Vereine für ihren eigenen Bereich; die einer Gemeinde binden alle Einwohner, die eines Vereins seine Mitglieder. Widerspricht eine niedrigere Regel einer höheren, gilt die höhere.",
      "Das Recht teilt man grob in zwei Bereiche. Im **Privatrecht** begegnen sich Menschen und Unternehmen als Gleichberechtigte, etwa beim Kauf- oder Mietvertrag; wichtigste Grundlage ist das Bürgerliche Gesetzbuch. Im **öffentlichen Recht** tritt der Staat den Menschen mit Hoheitsgewalt gegenüber, zum Beispiel im Strafrecht, im Steuerrecht und im Schulrecht. Die Schulpflicht gilt deshalb, weil der Staat sie vorgibt, nicht weil man sie vereinbart hätte. Beide Bereiche zusammen machen das Zusammenleben berechenbar.",
    ],
    terms: [
      { term: "Rechtsordnung", text: "Alle geltenden Rechtsregeln zusammen, die der Staat notfalls mit Zwang durchsetzt." },
      { term: "Ordnungsfunktion", text: "Das Recht regelt das Zusammenleben und schafft Klarheit, was man voneinander erwarten darf." },
      { term: "Schutzfunktion", text: "Das Recht schützt Leben, Gesundheit und Eigentum, besonders von Schwächeren." },
      { term: "Privatrecht", text: "Regeln für Beziehungen zwischen Gleichberechtigten, etwa Kauf- und Mietverträge." },
      { term: "Öffentliches Recht", text: "Regeln für das Verhältnis zwischen Staat und Bürgern, etwa Strafrecht und Steuerrecht." },
    ],
    law: [
      {
        ref: "Art. 20 Abs. 3 GG",
        text: "Die Gesetzgebung ist an die verfassungsmäßige Ordnung gebunden, die vollziehende Gewalt (Regierung und Verwaltung) und die Rechtsprechung müssen sich an Gesetz und Recht halten. Damit steht auch der Staat nicht über dem Recht.",
      },
      {
        ref: "Art. 80 Abs. 1 GG",
        text: "Ein Gesetz kann die Regierung oder Ministerien ermächtigen, Verordnungen zu erlassen. Inhalt, Zweck und Ausmaß dieser Ermächtigung muss das Gesetz selbst festlegen.",
      },
    ],
    takeaway:
      "Das Recht ordnet das Zusammenleben und schützt die Schwächeren. Es besteht aus Regeln verschiedener Stufen, vom Grundgesetz über Gesetze bis zu Verordnungen und Satzungen, und der Staat setzt es notfalls mit Zwang durch.",
    sourceIds: ["lp", "gg"],
    quiz: {
      question: "Wodurch unterscheidet sich eine Rechtsregel von einer bloßen Anstandsregel?",
      answer: "Der Staat kann eine Rechtsregel notfalls mit Zwang durchsetzen, zum Beispiel durch Gerichte.",
      wrong: [
        "Eine Rechtsregel gilt nur dann, wenn alle Betroffenen ihr zuvor einzeln zugestimmt haben.",
        "Eine Rechtsregel verbietet nur das, was auch die meisten für moralisch schlecht halten.",
      ],
      explanation:
        "Das Besondere des Rechts ist die staatliche Durchsetzung: Wer eine Rechtsregel verletzt, muss mit Folgen rechnen, auch gegen seinen Willen. Die Zustimmung jedes Einzelnen ist nicht nötig, und Recht und Moral decken sich nur zum Teil.",
    },
    workshop: {
      kind: "classify",
      title: "Aus welcher Rechtsquelle stammt die Regel?",
      instruction: "Ordne jede Regel der Rechtsquelle zu, aus der sie stammt.",
      categories: ["Grundgesetz", "Gesetz", "Verordnung", "Satzung"],
      entries: [
        {
          text: "Die Würde des Menschen ist unantastbar, und alle staatliche Gewalt muss sie achten und schützen.",
          target: 0,
          feedback: "Das ist die Grundaussage des Grundgesetzes, an die alle anderen Regeln gebunden sind.",
        },
        {
          text: "Das Parlament beschließt Regeln zum Kauf, zur Miete und zu anderen Verträgen; sie stehen im Bürgerlichen Gesetzbuch.",
          target: 1,
          feedback: "Das Bürgerliche Gesetzbuch ist ein vom Parlament beschlossenes Gesetz.",
        },
        {
          text: "Das Verkehrsministerium legt auf der Grundlage eines Gesetzes die Einzelheiten zu Vorfahrt und Geschwindigkeit fest.",
          target: 2,
          feedback: "Eine Verordnung regelt Einzelheiten und beruht auf der Ermächtigung durch ein Gesetz.",
        },
        {
          text: "Eine Stadt legt fest, welche Gebühren sie für die Nutzung ihres Friedhofs verlangt.",
          target: 3,
          feedback: "Gemeinden regeln ihre eigenen Angelegenheiten durch Satzungen.",
        },
        {
          text: "Ein Sportverein beschließt, wer Mitglied werden kann und wie der Vorstand gewählt wird.",
          target: 3,
          feedback: "Vereine geben sich mit ihrer Satzung ihre eigene Ordnung.",
        },
      ],
      conclusion: "Je höher die Quelle steht, desto mehr binden ihre Regeln alle anderen.",
    },
    casework: {
      title: "Streit um das Skateboard",
      story:
        "Der volljährige **Tim** kauft von **Ayla** ein gebrauchtes Skateboard für **40 Euro**, nimmt es mit und **zahlt nicht**. Auf dem Heimweg fährt er mit dem Fahrrad **bei Rot** über eine Ampel, und eine Polizistin hält ihn an.",
      steps: [
        {
          question: "Welchem Rechtsbereich gehört der Streit um die 40 Euro an?",
          options: [
            "Dem Privatrecht: Tim und Ayla stehen sich als Gleichberechtigte aus einem Kaufvertrag gegenüber.",
            "Dem öffentlichen Recht: Es geht um Geld, und Geld regelt immer der Staat.",
            "Keinem: Unter Bekannten gilt kein Recht, sondern nur Anstand.",
          ],
          answer: 0,
          explanation: "Zwei gleichberechtigte Personen haben einen Vertrag geschlossen. Das ist Privatrecht; der Staat greift erst ein, wenn einer sein Recht einklagt.",
        },
        {
          question: "Wie ist die Fahrt über die rote Ampel einzuordnen?",
          options: [
            "Öffentliches Recht: Der Staat gibt die Verkehrsregeln vor und setzt sie durch.",
            "Privatrecht: Tim und die Polizistin haben einen Vertrag geschlossen.",
            "Gar nicht, denn Radfahren ist keine Rechtsfrage.",
          ],
          answer: 0,
          explanation: "Die Verkehrsregeln gibt der Staat einseitig vor, Tim muss sie einhalten. Das ist das Verhältnis zwischen Staat und Bürger, also öffentliches Recht.",
        },
        {
          question: "Welche Pflicht hat Tim gegenüber Ayla?",
          options: [
            "Er muss die 40 Euro zahlen, denn Aylas Recht ist seine Pflicht.",
            "Er hat keine Pflicht, weil nichts schriftlich vereinbart wurde.",
            "Er muss nur zahlen, wenn die Polizei es von ihm verlangt.",
          ],
          answer: 0,
          explanation: "Das Recht des einen ist die Pflicht des anderen. Ein Kaufvertrag braucht in der Regel keine Schriftform, er ist auch mündlich wirksam.",
        },
        {
          question: "Was kann Ayla tun, wenn Tim dauerhaft nicht zahlt?",
          options: [
            "Sie kann ihr Recht vor Gericht geltend machen; der Staat setzt es notfalls durch.",
            "Sie darf sich das Geld selbst holen, notfalls mit Gewalt.",
            "Nichts, denn Rechte lassen sich gegen den Willen anderer nie durchsetzen.",
          ],
          answer: 0,
          explanation: "Der Staat hat die Durchsetzung übernommen, damit nicht der Stärkere gewinnt. Selbsthilfe ist nur in engen Ausnahmefällen erlaubt, etwa wenn staatliche Hilfe zu spät käme (§ 229 BGB).",
        },
      ],
      verdict:
        "Der Streit um den Kaufpreis gehört ins Privatrecht, die rote Ampel ins öffentliche Recht. Aylas Recht ist Tims Pflicht, und notfalls setzt der Staat es durch.",
    },
    tasks: {
      1: {
        prompt:
          "Formuliere zwei Verhaltensregeln aus deinem Umfeld, eine als Gebot und eine als Verbot, und erkläre, welche Aufgabe des Rechts sie erfüllen: Ordnung, Schutz oder beides.",
        hints: ["Welche Regel gilt in deiner Klasse, im Verein oder zu Hause, und was verlangt sie?", "Welchen Streit verhindert sie, oder wen schützt sie?"],
        model:
          "Als Gebot gilt in meiner Klasse: Wer etwas sagen will, meldet sich. Das ordnet den Unterricht, denn sonst redet jeder durcheinander und niemand versteht etwas. Als Verbot gilt: Niemand darf Mitschülern Sachen wegnehmen. Das schützt das Eigentum und bewahrt vor Streit. Übertragen auf die Gesellschaft heißt das: Ordnungsregeln wie die Verkehrsregeln und Schutzregeln wie das Diebstahlverbot machen das Zusammenleben berechenbar.",
        criteria: [
          "Formuliert ein Gebot und ein Verbot als konkrete Regeln",
          "Ordnet jede Regel der Ordnungs- oder der Schutzfunktion zu",
          "Überträgt den Gedanken auf das Zusammenleben in der Gesellschaft",
        ],
      },
      2: {
        prompt:
          "Beurteile die Aussage „Wenn alle vernünftig wären, bräuchte man keine Gesetze.“ Begründe dein Urteil mit der Ordnungs- und der Schutzfunktion des Rechts.",
        hints: [
          "Auch vernünftige Menschen haben unterschiedliche Interessen. Wie wird ein Streit dann entschieden?",
          "Wer schützt Menschen, die sich nicht selbst wehren können?",
        ],
        model:
          "Die Aussage trifft nur zum Teil zu. Selbst vernünftige Menschen sind sich nicht immer einig, zum Beispiel darüber, wer bei einem Unfall im Recht ist. Gesetze schaffen dann Klarheit und entscheiden den Streit nach festen Regeln: Das ist die Ordnungsfunktion. Dazu kommt die Schutzfunktion: Kinder, Kranke oder Käufer sind nicht in jeder Lage gleich stark, und das Recht schützt sie davor, dass sich der Stärkere durchsetzt, auch wenn andere es nicht freiwillig tun. Mein Urteil: Vernunft hilft viel, ersetzt das Recht aber nicht.",
        criteria: [
          "Bezieht Stellung zur Aussage",
          "Begründet mit der Ordnungsfunktion (Klarheit, Streitentscheidung)",
          "Begründet mit der Schutzfunktion oder der staatlichen Durchsetzung",
        ],
      },
    },
  },

  {
    id: "re-rechtsquellen", lb: 3, unit: "3", title: "Rechtsquellen und Rechtsgebiete",
    intro: "Finde vom Grundgesetz bis zur Schulordnung die passende Regel für deinen Fall.",
    paragraphs: [
      "Das **Grundgesetz** bestimmt zum Beispiel Grundrechte und die Aufgaben von Bund und Ländern. Einfache Gesetze müssen zur jeweils geltenden Verfassung passen. Bayern hat mit der **Bayerischen Verfassung** eine eigene Landesverfassung. Gültiges Bundesrecht hat bei einem Widerspruch Vorrang vor Landesrecht (Art. 31 GG). Das heißt nicht, dass der Bund beliebige Schulregeln erlassen darf. Er muss für eine Regel zuständig sein.",
      "Im bayerischen Schulbereich stehen unter der Landesverfassung das **BayEUG** als Gesetz und die **Realschulordnung** als Rechtsverordnung. Eine Verordnung braucht eine gesetzliche Grundlage. Eine **Satzung** wird etwa von einer Gemeinde auf gesetzlicher Grundlage für ihren Aufgabenbereich erlassen. Eine Hausordnung setzt für den Schulalltag Regeln im Rahmen des höherrangigen Rechts. Ihre konkrete Rechtsform hängt davon ab, wer sie erlässt.",
      "**Öffentliches Recht** gilt zum Beispiel, wenn eine Behörde hoheitlich eine Anordnung erlässt. Das Strafrecht gehört ebenfalls dazu. Das **Privatrecht** regelt etwa Kaufverträge zwischen rechtlich gleichgeordneten Beteiligten. Auch eine Stadt kann privatrechtlich handeln, etwa wenn sie Stühle kauft. Frage deshalb, in welcher Rolle die Beteiligten handeln.",
    ],
    terms: [term("Rechtsquelle", "Stelle, aus der sich eine verbindliche Regel ergibt, zum Beispiel ein Gesetz."), term("Rechtsverordnung", "Regelung, die eine dazu gesetzlich ermächtigte Stelle erlässt.")],
    visual: { title: "Rechtsgrundlagen für den bayerischen Schulalltag", steps: ["Bayerische Verfassung", "Gesetz · BayEUG", "Rechtsverordnung · Realschulordnung", "Regel vor Ort · Hausordnung"] },
    takeaway: "Prüfe zuerst das Rechtsgebiet und danach die passende Norm. Eine örtliche Regel muss die höherrangigen Vorschriften beachten.",
    sourceIds: ["lp", "gg", "bverf", "bayeug", "rso", "bgb"],
    quiz: check("Wo suchst du zuerst nach den Pflichten aus einem gewöhnlichen Kaufvertrag?", "Im Bürgerlichen Gesetzbuch", ["In der Realschulordnung", "In der Bayerischen Verfassung"], "Das BGB enthält die privatrechtlichen Pflichten aus Kaufverträgen."),
    workshop: sort("Wer handelt in welcher Rolle?", "Ordne jedem Fall sein Rechtsgebiet zu.", ["Privatrecht", "Öffentliches Recht"], [
      ["Eine Stadt bestellt neue Stühle beim Möbelhandel.", 0, "Die Stadt schließt einen Kaufvertrag wie andere Käufer auch."],
      ["Eine Behörde erlässt einen Bescheid über eine Gebühr.", 1, "Die Behörde nutzt ihre Befugnis, eine Gebühr festzusetzen."],
      ["Ein Vermieter verlangt die vereinbarte Wohnungsmiete.", 0, "Die Forderung beruht auf dem Mietvertrag."],
      ["Die Staatsanwaltschaft verfolgt einen möglichen Diebstahl.", 1, "Strafverfolgung gehört zum öffentlichen Recht."],
    ], "Entscheidend sind die Handlung und ihre Rechtsgrundlage."),
    casework: { title: "Eine neue Schulregel", story: "Eine Schule möchte einen Ablauf aus der Realschulordnung durch eine entgegenstehende Hausregel ändern. Der Elternbeirat fragt, welche Vorschrift für die Schule verbindlich ist.", steps: [
      decide("Was ist die Realschulordnung?", "Eine Rechtsverordnung", "Ein privater Kaufvertrag", "Die Verordnung regelt schulische Angelegenheiten aufgrund gesetzlicher Ermächtigung."),
      decide("Welche Regel hat im Konflikt Vorrang?", "Die Realschulordnung", "Die Hausregel", "Eine Regel der Schule muss höherrangiges Recht beachten."),
      decide("Was sollte die Schule prüfen?", "Ob die Verordnung bei der Umsetzung Spielraum lässt", "Ob eine Abstimmung die Verordnung aufheben kann", "Eine Schule kann zulässigen Spielraum nutzen, bleibt aber an die Verordnung gebunden."),
    ], verdict: "Die Schule kann eine Hausregel im zulässigen Rahmen gestalten. Ein Konflikt wird anhand der höherrangigen Vorschrift gelöst." },
    tasks: {
      1: write("Ordne Bayerische Verfassung, BayEUG und Realschulordnung und erkläre den Rang der Hausordnung.", ["Beginne mit der Landesverfassung.", "Welche Grundlage braucht eine Verordnung?"], "Die Bayerische Verfassung bildet den Rahmen des Landesrechts. Das BayEUG regelt als Landesgesetz den Schulbereich. Die Realschulordnung konkretisiert Regeln als Verordnung. Eine Hausordnung kann den Alltag vor Ort regeln, soweit höherrangige Vorschriften Raum dafür lassen.", ["Verfassung und Gesetz", "Rang der Verordnung", "Folge für Hausregeln"]),
      2: write("Die Stadt verkauft ein Fahrrad und verlangt am selben Tag eine Verwaltungsgebühr. Ordne die Fälle ein.", ["Wie entsteht die Zahlungspflicht jeweils?", "Nenne eine passende Rechtsquelle."], "Beim Fahrrad entsteht die Zahlungspflicht durch den Kaufvertrag. Die Stadt handelt wie eine private Verkäuferin, und die Pflichten stehen im BGB. Die Verwaltungsgebühr kann die Behörde aufgrund einer öffentlichen Gebührenregel durch Bescheid festsetzen. Dafür prüfe ich die einschlägige öffentlich-rechtliche Gebührenregel.", ["Kauf richtig zugeordnet", "Gebühr richtig zugeordnet", "Beide Rollen erklärt"]),
    },
  },
  {
    id: "re-verantwortung", lb: 3, unit: "3", title: "Deliktfähigkeit und Strafmündigkeit",
    intro: "Ein kaputtes Fenster wirft zwei Fragen auf. Wer muss den Schaden ersetzen und wer kann bestraft werden?",
    paragraphs: [
      "Die **Deliktfähigkeit** betrifft die zivilrechtliche Verantwortung für verursachte Schäden. Kinder unter sieben sind nach § 828 BGB dafür grundsätzlich nicht verantwortlich. Bei bestimmten Verkehrsunfällen gilt ein zusätzlicher Schutz bis zum zehnten Geburtstag, außer bei Vorsatz. Bei anderen Minderjährigen kommt es auf die nötige Einsicht an. Für einen Anspruch sind auch Schaden, Ursache und die weiteren Voraussetzungen der Haftung zu prüfen.",
      "Die **Strafmündigkeit** betrifft die Verantwortung im Strafrecht. Kinder unter 14 Jahren sind strafrechtlich schuldunfähig (§ 19 StGB). Bei 14- bis 17-Jährigen ist nach § 3 JGG zusätzlich zu prüfen, ob sie nach ihrer Entwicklung das Unrecht einsehen und nach dieser Einsicht handeln konnten. Eine Straftat setzt weitere Merkmale voraus.",
      "Beispiel: Ein 13-Jähriger wirft absichtlich einen Stein durch eine Fensterscheibe und versteht die Folgen. Seine Strafmündigkeit scheitert am Alter. Für einen möglichen Schadensersatz ist seine Einsicht dagegen relevant. Ob die Eltern selbst haften, ist eine andere Frage, etwa ob sie eine erforderliche Aufsicht verletzt haben (§ 832 BGB).",
    ],
    terms: [term("Deliktfähigkeit", "Fähigkeit, für eine unerlaubte Handlung zivilrechtlich verantwortlich zu sein."), term("Strafmündigkeit", "Altersbezogene Voraussetzung für strafrechtliche Verantwortlichkeit.")],
    visual: { title: "Ein Verhalten, zwei Prüfungen", layout: "comparison", steps: ["Schadensersatz · Einsicht prüfen · § 828 BGB", "Strafe · Alter und Reife prüfen · § 19 StGB und § 3 JGG"] },
    takeaway: "Prüfe Schadensersatz und eine mögliche Strafe getrennt. Für beide gelten unterschiedliche Altersgrenzen und Voraussetzungen.",
    sourceIds: ["lp", "bgb", "stgb", "jgg"],
    law: [{ ref: "§ 828 BGB und § 19 StGB", text: "Zivilrechtliche Einsicht und strafrechtliche Altersgrenze sind unterschiedliche Maßstäbe." }],
    quiz: check("Welche Frage betrifft die Deliktfähigkeit?", "Kommt Schadensersatz wegen eines verursachten Schadens in Betracht?", ["Konnte das Kind einen wirksamen Vertrag schließen?", "Kann eine Jugendstrafe verhängt werden?"], "Die Deliktfähigkeit gehört zur Prüfung der zivilrechtlichen Haftung."),
    workshop: sort("Welche Norm hilft?", "Ordne jede Fragestellung dem passenden Prüfgebiet zu.", ["Schadensersatz", "Strafrecht"], [
      ["Ein Nachbar verlangt Ersatz für sein beschädigtes Fenster.", 0, "Der Nachbar macht einen zivilrechtlichen Anspruch geltend."],
      ["Die Polizei klärt einen möglichen Diebstahl strafrechtlich auf.", 1, "Strafrechtlich geht es um den Vorwurf einer Straftat."],
      ["Eine Familie prüft, ob die Einsicht ihres Kindes nach § 828 BGB ausreicht.", 0, "§ 828 BGB regelt die Verantwortlichkeit für Schäden."],
      ["Ein Jugendgericht prüft die Reife der 15-jährigen Beschuldigten.", 1, "Im Jugendstrafrecht ist die Verantwortungsreife erheblich."],
    ], "Beide Fragen können nach demselben Ereignis auftreten."),
    casework: { title: "Die zerbrochene Scheibe", story: "Ein 13-Jähriger wirft absichtlich einen Stein durch Nachbars Scheibe. Er weiß, dass die Scheibe zerbricht und der Nachbar dadurch Geld für eine neue Scheibe ausgeben muss.", steps: [
      decide("Ist er strafmündig?", "Nein, er ist noch keine 14 Jahre alt.", "Ja, denn er hat absichtlich gehandelt.", "Unter 14 schließt § 19 StGB die strafrechtliche Schuld aus."),
      decide("Kann seine Einsicht für die Haftung eine Rolle spielen?", "Ja, für die Deliktfähigkeit nach § 828 BGB.", "Nein, weil er unter 14 ist.", "Die Strafmündigkeitsgrenze entscheidet nicht über die zivilrechtliche Haftung."),
      decide("Haften seine Eltern allein wegen ihrer Elternrolle?", "Nein, eine eigene Haftungsgrundlage ist zu prüfen.", "Ja, Eltern ersetzen immer jeden Schaden ihrer Kinder.", "Eine mögliche Verletzung der Aufsichtspflicht ist gesondert zu untersuchen."),
    ], verdict: "Eine strafrechtliche Schuld ist wegen des Alters ausgeschlossen. Ein Anspruch auf Schadensersatz kann gesondert bestehen." },
    tasks: {
      1: write("Erkläre am 13-Jährigen, weshalb Schadensersatz und Strafmündigkeit zu unterschiedlichen Ergebnissen führen können.", ["Welche Grenze nennt § 19 StGB?", "Was verstand das Kind im Fall?"], "Der Junge liegt unter der Altersgrenze von 14 Jahren. Darum ist er strafrechtlich schuldunfähig. Zivilrechtlich ist zu prüfen, ob er die nötige Einsicht hatte und die Voraussetzungen der Haftung erfüllt sind. Im Beispiel versteht er, dass sein absichtlicher Wurf einen Schaden verursacht.", ["Strafrechtliche Grenze", "Zivilrechtliche Einsicht", "Bezug zur Scheibe"]),
      2: write("Eine 15-Jährige beschädigt absichtlich eine Bank. Vergleiche die Fragen des Geschädigten mit denen des Jugendgerichts.", ["Denke an § 828 BGB und § 3 JGG.", "Kann das Alter allein alle Fragen beantworten?"], "Der Geschädigte prüft, ob die Jugendliche für den Schaden verantwortlich ist und wie hoch der Ersatz sein kann. Das Gericht prüft neben den Voraussetzungen einer Straftat, ob sie reif genug war, das Unrecht einzusehen und danach zu handeln. Das Alter eröffnet beide Prüfungen, entscheidet ihr Ergebnis aber nicht allein.", ["Zivilrechtlicher Anspruch", "Strafrechtliche Reife", "Beide Prüfungen getrennt"]),
    },
  },
  {
    id: "re-gesetz",
    lb: 3,
    unit: "3",
    title: "Gesetze lesen und einen Rechtsfall lösen",
    intro: "Gesetze sehen schwierig aus, folgen aber festen Regeln. Wer sie kennt, kann eine Vorschrift finden, lesen und auf einen Fall anwenden.",
    paragraphs: [
      "Ein Gesetz ist in **Paragrafen** gegliedert, die mit dem Zeichen § beginnen und eine Überschrift tragen. Das Grundgesetz nennt seine Abschnitte stattdessen **Artikel**, zum Beispiel Art. 20 Abs. 3 GG. Ein Paragraf besteht oft aus mehreren **Absätzen**, die in Klammern nummeriert sind, zum Beispiel (1) und (2). Ein Absatz besteht aus **Sätzen**, manchmal gibt es Aufzählungen mit **Nummern** und Buchstaben. So lässt sich jede Stelle genau benennen. „§ 433 Abs. 1 Satz 1 BGB“ heißt: Paragraf 433, Absatz 1, erster Satz, im Bürgerlichen Gesetzbuch. Die Abkürzung des Gesetzes steht am Ende.",
      "Die meisten Vorschriften folgen dem Muster „Wenn …, dann …“. Der **Tatbestand** nennt die Voraussetzungen, die erfüllt sein müssen. Die **Rechtsfolge** sagt, was dann gilt. Ein Beispiel ist § 604 Abs. 1 BGB, hier sinngemäß: Wer eine Sache geliehen hat und die vereinbarte Zeit ist abgelaufen (Tatbestand), muss die Sache zurückgeben (Rechtsfolge). Sophie hat Lukas ihr Buch für zwei Wochen geliehen. Nach zwei Wochen muss er es zurückgeben, denn beide Merkmale liegen vor.",
      "Einen einfachen Rechtsfall löst man in vier Schritten. Erstens klärt man die **Frage**: Wer will von wem was? Zweitens sucht man die **Vorschrift**, die diese Frage beantwortet. Drittens prüft man, ob der Fall zu jedem Merkmal des Tatbestands passt; Juristen nennen das **subsumieren**. Viertens formuliert man das **Ergebnis** mit der Rechtsfolge. Entscheidend ist, nicht nach Gefühl zu urteilen, sondern jede Aussage mit einem Merkmal der Vorschrift zu begründen.",
      "Gesetze findest du kostenlos auf der Seite gesetze-im-internet.de, die das Bundesministerium der Justiz mit dem Bundesamt für Justiz betreibt. Dort stehen die aktuellen, aber nichtamtlichen Fassungen; die amtliche Fassung steht im Bundesgesetzblatt. Mit der Abkürzung des Gesetzes und der Paragrafennummer kommst du direkt zur Vorschrift. Manche Gesetze erklären ihre Fachwörter selbst, meist in den ersten Paragrafen: Was „Kinder“ im Jugendschutzgesetz sind, steht gleich in § 1. Lies deshalb zuerst die Begriffsbestimmungen, bevor du eine Vorschrift auf einen Fall anwendest. Gesetze ändern sich, achte darum auf die aktuelle Fassung.",
    ],
    terms: [
      { term: "Paragraf", text: "Der nummerierte Abschnitt eines Gesetzes, geschrieben mit dem Zeichen §; er kann in Absätze und Sätze gegliedert sein." },
      { term: "Tatbestand", text: "Die Voraussetzungen, die erfüllt sein müssen, damit eine Rechtsvorschrift angewendet werden kann." },
      { term: "Rechtsfolge", text: "Das, was nach der Vorschrift gilt, wenn der Tatbestand erfüllt ist." },
      { term: "Subsumieren", text: "Prüfen, ob ein Fall zu jedem Merkmal des Tatbestands passt, und ihn dann unter die Vorschrift fassen." },
    ],
    law: [
      {
        ref: "§ 433 Abs. 1 Satz 1 BGB",
        text: "Wer als Verkäufer einen Kaufvertrag schließt, muss dem Käufer die Sache übergeben und ihm das Eigentum daran verschaffen. Das Beispiel zeigt, wie man eine Stelle genau zitiert.",
        url: "https://www.gesetze-im-internet.de/bgb/__433.html",
      },
      {
        ref: "§ 604 Abs. 1 BGB",
        text: "Wer eine Sache geliehen hat, muss sie zurückgeben, wenn die vereinbarte Leihzeit abgelaufen ist.",
      },
    ],
    takeaway:
      "Ein Gesetz gliedert sich in Paragrafen, Absätze, Sätze und Nummern und lässt sich so genau zitieren. Einen Rechtsfall löst man in vier Schritten: Frage klären, passende Vorschrift finden, den Fall unter den Tatbestand fassen und die Rechtsfolge als Ergebnis nennen.",
    sourceIds: ["lp", "bgb", "juschg"],
    quiz: {
      question: "Was ist der Tatbestand einer Rechtsvorschrift?",
      answer: "Die Voraussetzungen, die erfüllt sein müssen, damit die Vorschrift auf einen Fall passt.",
      wrong: [
        "Die Folge, die eintritt, sobald die Vorschrift auf einen Fall passt.",
        "Die Überschrift des Paragrafen, die das Thema der Vorschrift nennt.",
      ],
      explanation:
        "Der Tatbestand ist das Wenn der Vorschrift, die Rechtsfolge das Dann. Die Überschrift hilft beim Finden, enthält aber nicht die Voraussetzungen.",
    },
    workshop: {
      kind: "timeline",
      title: "Einen Rechtsfall in vier Schritten lösen",
      instruction: "Bringe die Schritte in die richtige Reihenfolge.",
      categories: [],
      entries: [
        {
          text: "Die Frage klären: Wer will von wem was, und worum geht es in dem Fall?",
          target: 0,
          feedback: "Zuerst muss klar sein, was überhaupt gefragt ist; sonst findet man keine passende Vorschrift.",
        },
        {
          text: "Die passende Vorschrift suchen, die diese Frage beantwortet, zum Beispiel im Gesetz nachschlagen.",
          target: 1,
          feedback: "Erst wenn die Frage feststeht, kann man die Vorschrift dazu auswählen.",
        },
        {
          text: "Prüfen, ob der Fall zu jedem Merkmal des Tatbestands passt, also subsumieren.",
          target: 2,
          feedback: "Jetzt wird der Fall Schritt für Schritt an den Voraussetzungen der Vorschrift gemessen.",
        },
        {
          text: "Das Ergebnis mit der Rechtsfolge nennen und kurz begründen.",
          target: 3,
          feedback: "Am Ende steht die Antwort auf die Frage vom Anfang, gestützt auf die geprüften Merkmale.",
        },
      ],
      conclusion: "Wer die Reihenfolge einhält, urteilt nicht nach Gefühl, sondern nach der Vorschrift.",
    },
    casework: {
      title: "Das Fahrrad vom Nachbarn",
      story:
        "**Nele** kauft von ihrem Nachbarn **Marcel** ein gebrauchtes Fahrrad für **80 Euro**. Beide sind volljährig und haben sich geeinigt. Nele nimmt das Rad gleich mit, will später aber nicht zahlen, weil sie es „doch nicht mehr braucht“. Marcel fragt, ob er das Geld verlangen kann.",
      steps: [
        {
          question: "Was ist die Frage, die der Fall stellt?",
          options: [
            "Kann Marcel von Nele die 80 Euro verlangen?",
            "Ist Marcel verpflichtet, das Rad zurückzunehmen?",
            "Hat Nele das Rad zu teuer bezahlt?",
          ],
          answer: 0,
          explanation: "Marcel will von Nele Geld. Die Frage nennt also, wer von wem was verlangt: Marcel von Nele die Zahlung.",
        },
        {
          question: "Welche Vorschrift passt zu dieser Frage?",
          options: [
            "§ 604 Abs. 1 BGB: Wer etwas geliehen hat, muss es zurückgeben.",
            "§ 433 Abs. 2 BGB: Der Käufer muss den vereinbarten Kaufpreis zahlen.",
            "§ 1 BGB: Die Rechtsfähigkeit beginnt mit der Vollendung der Geburt.",
          ],
          answer: 1,
          explanation:
            "Es geht um einen Kauf und die Zahlung des Preises. Die Leihe passt nicht, denn Nele hat das Rad gekauft, nicht geliehen. § 1 BGB regelt etwas ganz anderes.",
        },
        {
          question: "Passt der Fall zum Tatbestand von § 433 Abs. 2 BGB?",
          options: [
            "Nein, denn sie hat den Vertrag nicht schriftlich geschlossen.",
            "Nein, denn Nele nutzt das Rad nicht mehr.",
            "Ja: Es gibt einen Kaufvertrag mit vereinbartem Preis, und Nele ist die Käuferin.",
          ],
          answer: 2,
          explanation: "Der Tatbestand verlangt nur einen Kaufvertrag und einen vereinbarten Kaufpreis. Eine bestimmte Form oder spätere Nutzung verlangt die Vorschrift nicht.",
        },
        {
          question: "Wie lautet das Ergebnis des Falls?",
          options: [
            "Nele darf das Rad behalten, ohne zu zahlen, weil sie es nicht braucht.",
            "Nele muss Marcel die 80 Euro zahlen; er kann das Geld verlangen.",
            "Marcel kann nur das Rad zurückverlangen, nicht das Geld.",
          ],
          answer: 1,
          explanation: "Die Rechtsfolge von § 433 Abs. 2 BGB ist die Pflicht zur Zahlung. Marcel hat also einen Anspruch auf die 80 Euro.",
        },
      ],
      verdict:
        "Marcel kann die 80 Euro verlangen. Das ergibt sich aus der Vorschrift: Kaufvertrag und vereinbarter Preis (Tatbestand) führen zur Pflicht, den Kaufpreis zu zahlen (Rechtsfolge).",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, wie man „§ 433 Abs. 1 Satz 1 BGB“ liest, und benenne an dieser Vorschrift Tatbestand und Rechtsfolge. Sinngemäß lautet sie: Wer als Verkäufer einen Kaufvertrag schließt, muss dem Käufer die Sache übergeben und das Eigentum verschaffen.",
        hints: ["Wofür stehen das Zeichen §, die Abkürzung Abs. und das Wort Satz?", "Welche Voraussetzung nennt die Vorschrift, und was folgt daraus?"],
        model:
          "„§ 433 Abs. 1 Satz 1 BGB“ bedeutet: Paragraf 433 des Bürgerlichen Gesetzbuchs, erster Absatz, erster Satz. So findet jeder dieselbe Stelle. Der Tatbestand lautet: Jemand ist Verkäufer in einem Kaufvertrag. Die Rechtsfolge: Er muss dem Käufer die Sache übergeben und ihm das Eigentum verschaffen. Wer also ein Fahrrad verkauft hat, muss es ausliefern und darf es nicht einfach behalten.",
        criteria: [
          "Erklärt, was Paragraf, Absatz und Satz in der Angabe bedeuten",
          "Nennt den Tatbestand der Vorschrift",
          "Nennt die Rechtsfolge der Vorschrift",
        ],
      },
      2: {
        prompt:
          "Löse diesen Fall in vier Schritten: Am Tag vor ihrem 14. Geburtstag fragt Hanna, ob sie im Sinne des Jugendschutzgesetzes schon Jugendliche ist. § 1 Abs. 1 JuSchG besagt sinngemäß: Kinder sind Personen, die noch nicht 14 Jahre alt sind; Jugendliche sind Personen, die 14, aber noch nicht 18 Jahre alt sind.",
        hints: ["Welche Frage stellt Hanna, und welche Vorschrift gehört dazu?", "Erfüllt Hanna am Tag vor dem Geburtstag das Merkmal „14 Jahre alt“?"],
        model:
          "Die Frage lautet: Ist Hanna Jugendliche im Sinne des Gesetzes? Die passende Vorschrift ist § 1 Abs. 1 JuSchG, der Kinder und Jugendliche unterscheidet. Jugendliche sind Personen ab 14 Jahren. Hanna ist einen Tag vor ihrem Geburtstag noch 13, erfüllt dieses Merkmal also nicht, wohl aber das Merkmal „noch nicht 14 Jahre alt“. Ergebnis: Hanna ist noch ein Kind. Erst mit dem 14. Geburtstag gilt sie als Jugendliche.",
        criteria: [
          "Stellt die Frage und nennt die passende Vorschrift",
          "Prüft die Altersmerkmale nacheinander am Fall",
          "Nennt ein klares Ergebnis mit Begründung",
        ],
      },
    },
  },

  {
    id: "re-lebensalter",
    lb: 3,
    unit: "3",
    title: "Rechtsfähigkeit und Geschäftsfähigkeit",
    intro: "Ab wann darf man Verträge schließen? Das Recht antwortet mit dem Alter.",
    paragraphs: [
      "**Rechtsfähig** ist, wer Rechte und Pflichten haben kann. Das gilt für jeden Menschen ab der Geburt (§ 1 BGB): Auch ein Baby kann Inhaber eines Sparbuchs sein oder etwas erben. Selbst handeln kann es aber noch nicht, das tun für das Kind zunächst seine Eltern. Rechte haben und Verträge schließen sind also zwei verschiedene Dinge.",
      "Etwas anderes ist die **Geschäftsfähigkeit**: die Fähigkeit, durch eigene Willenserklärungen wirksame Verträge zu schließen. Das Gesetz schützt junge Menschen und stuft sie nach dem Alter ab. Wer unter 7 Jahre alt ist, ist **geschäftsunfähig**: Seine Willenserklärungen sind nichtig. Geschäftsunfähig kann auch ein Erwachsener sein, etwa bei einer dauerhaften krankhaften Störung der Geistestätigkeit (§ 104 BGB). Von 7 bis 17 Jahren ist man **beschränkt geschäftsfähig**: Für die meisten Verträge braucht man die Zustimmung der Eltern. Ab 18 Jahren ist man in der Regel **voll geschäftsfähig**.",
      "Braucht eine beschränkt geschäftsfähige Person die Zustimmung und fehlt sie, ist ihr Vertrag zunächst **schwebend unwirksam**. Er wird mit der Genehmigung der Eltern wirksam. Keine Zustimmung braucht ein Geschäft, das der Person nur einen rechtlichen Vorteil bringt, etwa ein Geschenk ohne Verpflichtungen. Nach § 110 BGB kann ein Kauf auch durch vollständige Zahlung mit dafür überlassenen Mitteln wirksam werden. Eine Preisgrenze nennt das Gesetz nicht; entscheidend ist, dass ihm das Geld zur freien Verfügung oder für diesen Zweck überlassen wurde.",
    ],
    terms: [
      { term: "Rechtsfähigkeit", text: "Die Fähigkeit, Rechte und Pflichten zu haben. Sie beginnt mit der Geburt." },
      { term: "Geschäftsfähigkeit", text: "Die Fähigkeit, durch eigene Erklärungen wirksame Verträge zu schließen. Sie wächst mit dem Alter." },
      { term: "Schwebend unwirksam", text: "Ein Vertrag, der erst gilt, wenn die Eltern ihn genehmigen." },
      { term: "Taschengeldparagraf", text: "Ein Vertrag ist wirksam, wenn der Minderjährige ihn ganz mit Geld bezahlt, das ihm zur freien Verfügung oder für diesen Zweck überlassen wurde." },
    ],
    law: [
      {
        ref: "§ 1 BGB",
        text: "Die Rechtsfähigkeit des Menschen beginnt mit der Vollendung der Geburt.",
        url: "https://www.gesetze-im-internet.de/bgb/__1.html",
      },
      {
        ref: "§§ 104 bis 108 und § 110 BGB",
        text: "Sie regeln, wer geschäftsunfähig oder beschränkt geschäftsfähig ist, wann die Zustimmung der Eltern nötig ist (vorher als **Einwilligung**, nachher als **Genehmigung**) und den **Taschengeldparagrafen**.",
        url: "https://www.gesetze-im-internet.de/bgb/__104.html",
      },
    ],
    takeaway:
      "Rechtsfähig ist jeder Mensch ab der Geburt, geschäftsfähig nur stufenweise: unter 7 Jahren geschäftsunfähig, von 7 bis 17 beschränkt geschäftsfähig und ab 18 voll geschäftsfähig.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Wie ist die Geschäftsfähigkeit einer 15-Jährigen einzuordnen?",
      answer: "Sie ist beschränkt geschäftsfähig: Für die meisten Verträge braucht sie die Zustimmung ihrer Eltern.",
      wrong: [
        "Sie ist voll geschäftsfähig, weil sie älter als 14 ist.",
        "Sie ist geschäftsunfähig, weil sie noch nicht volljährig ist.",
      ],
      explanation: "Zwischen 7 und 17 Jahren ist man beschränkt geschäftsfähig (§ 106 BGB). Aus Altersgründen geschäftsunfähig ist man nur unter 7 Jahren (§ 104 Nr. 1 BGB).",
    },
    lab: "geschaeftsfaehigkeit",
    workshop: {
      kind: "classify",
      title: "Wirksam, nichtig oder schwebend?",
      instruction: "Ordne jeden Fall zu. Beachte das Alter und die Zustimmung der Eltern.",
      categories: ["nichtig", "wirksam", "schwebend unwirksam"],
      entries: [
        {
          text: "Ein Sechsjähriger kauft allein ein Handy auf Raten.",
          target: 0,
          feedback: "Unter 7 Jahren ist man geschäftsunfähig; die Willenserklärung ist nichtig.",
        },
        {
          text: "Eine 13-Jährige kauft von ihrem Taschengeld ein Eis und bezahlt sofort.",
          target: 1,
          feedback: "Taschengeldparagraf: Sie bezahlt sofort mit Geld zur freien Verfügung.",
        },
        {
          text: "Ein 16-Jähriger bestellt ohne Wissen seiner Eltern ein Fahrrad für 900 Euro auf Raten.",
          target: 2,
          feedback: "Ohne Zustimmung der Eltern hängt der Vertrag in der Schwebe, bis sie genehmigen.",
        },
        {
          text: "Ein 12-Jähriger nimmt ein Buch an, das ihm seine Tante schenkt.",
          target: 1,
          feedback: "Ein Geschenk bringt nur einen Vorteil. Dafür braucht man keine Zustimmung.",
        },
        {
          text: "Ein 16-Jähriger schließt mit vorheriger Zustimmung seiner Eltern einen Handyvertrag über zwölf Monate.",
          target: 1,
          feedback: "Die Einwilligung vorher macht den Vertrag von Anfang an wirksam.",
        },
      ],
      conclusion: "Entscheidend sind Alter, Art des Geschäfts und die Zustimmung der Eltern.",
    },
    casework: {
      title: "Das Smartphone-Abo",
      story:
        "Jonas (15) schließt im Elektromarkt allein einen Vertrag über 24 Monate für ein Smartphone mit **40 Euro im Monat** ab. Seine Eltern wissen nichts davon. Der Verkäufer hat nicht nach dem Alter gefragt.",
      steps: [
        {
          question: "Welche Geschäftsfähigkeit hat Jonas?",
          options: ["Beschränkt geschäftsfähig", "Geschäftsunfähig", "Voll geschäftsfähig"],
          answer: 0,
          explanation: "Jonas ist 15 und damit zwischen 7 und 17 Jahren alt.",
        },
        {
          question: "Ist der Vertrag sofort wirksam?",
          options: [
            "Nein, er ist schwebend unwirksam, bis die Eltern zustimmen.",
            "Ja, weil Jonas selbst unterschrieben hat.",
            "Nein, er ist von Anfang an nichtig und kann nie wirksam werden.",
          ],
          answer: 0,
          explanation: "Ein Vertrag über Raten ist kein reiner Vorteil und nicht mit Taschengeld bezahlt. Ohne Zustimmung schwebt er.",
        },
        {
          question: "Was können Jonas’ Eltern tun?",
          options: [
            "Den Vertrag genehmigen oder die Genehmigung verweigern.",
            "Nur den Verkäufer anzeigen.",
            "Nichts, weil Jonas für seine Verträge selbst haftet.",
          ],
          answer: 0,
          explanation: "Die Eltern entscheiden als gesetzliche Vertreter. Genehmigen sie, gilt der Vertrag rückwirkend; verweigern sie, ist er unwirksam.",
        },
      ],
      verdict:
        "Der Vertrag hängt in der Schwebe. Genehmigen die Eltern, gilt er von Anfang an; verweigern sie, ist er unwirksam, und bereits Erhaltenes wird zurückgegeben.",
    },
    tasks: {
      1: {
        prompt: "Erkläre den Unterschied zwischen Rechtsfähigkeit und Geschäftsfähigkeit und gib zu jedem Begriff ein Beispiel.",
        hints: ["Wer ist rechtsfähig, und ab wann?", "Wovon hängt die Geschäftsfähigkeit ab?"],
        model:
          "Rechtsfähig ist jeder Mensch ab der Geburt: Er kann Rechte und Pflichten haben, zum Beispiel ein Baby, das ein Haus erbt. Geschäftsfähig ist, wer selbst wirksame Verträge schließen kann. Das hängt vom Alter ab: Ein Sechsjähriger kann keinen wirksamen Kaufvertrag schließen, eine Volljährige schon.",
        criteria: [
          "Rechtsfähigkeit richtig erklärt und mit Beispiel belegt",
          "Geschäftsfähigkeit richtig erklärt und mit Beispiel belegt",
          "Beide Begriffe klar voneinander abgegrenzt",
        ],
      },
      2: {
        prompt:
          "Begründe, warum das Gesetz Minderjährige schützt und trotzdem den Taschengeldparagrafen zulässt. Beurteile, ob 14-Jährige dadurch zu streng oder zu wenig geschützt sind.",
        hints: ["Wovor sollen Minderjährige geschützt werden?", "Was wäre im Alltag ohne Ausnahme für Taschengeld nötig?"],
        model:
          "Minderjährige können Folgen von Verträgen oft nicht überblicken, etwa Ratenzahlungen. Deshalb sollen Eltern zustimmen. Ohne den Taschengeldparagrafen müssten Eltern aber jeden Eiskauf genehmigen; das wäre unpraktisch. Er erlaubt Geschäfte, die man mit eigenem Geld ganz bezahlt, und schützt vor Schulden, weil Ratenkäufe nicht darunter fallen. Der Schutz ist deshalb ausgewogen: streng bei Schulden, großzügig im Alltag.",
        criteria: [
          "Den Schutzzweck für Minderjährige nennt",
          "Den Nutzen der Ausnahme für den Alltag erklärt",
          "Ein eigenes, begründetes Urteil zu streng oder zu wenig geschützt abgibt",
        ],
      },
    },
  },

  {
    id: "re-jugendschutz",
    lb: 3,
    unit: "3",
    title: "Das Jugendschutzgesetz",
    intro: "Das Jugendschutzgesetz schützt Kinder und Jugendliche mit Altersgrenzen, die sich vor allem an Erwachsene richten.",
    paragraphs: [
      "Das **Jugendschutzgesetz** (JuSchG) soll junge Menschen vor Gefahren schützen, denen sie noch nicht gewachsen sind, etwa durch Alkohol, Glücksspiel oder ungeeignete Medien. Es unterscheidet **Kinder** (unter 14 Jahren) und **Jugendliche** (14 bis 17 Jahre). Es richtet sich vor allem an Erwachsene: Wirtinnen, Verkäufer und Veranstalter dürfen Verbotenes nicht erlauben oder verkaufen und müssen im Zweifel das Alter prüfen. Wer jünger wirkt, muss darum sein Alter auf Verlangen nachweisen können, zum Beispiel mit dem Ausweis.",
      "Unter 16 Jahren darf man sich in einer Gaststätte ohne Begleitung nur aufhalten, um zwischen 5 und 23 Uhr etwas zu essen oder zu trinken; Ausnahmen gibt es etwa auf Reisen. Sonst braucht man die Begleitung der Eltern (genauer: der Personensorgeberechtigten) oder einer **erziehungsbeauftragten Person**. Das ist eine Person ab 18 Jahren, die laut Vereinbarung mit den Eltern Erziehungsaufgaben übernimmt oder Kinder in Ausbildung oder Jugendhilfe betreut, etwa als Lehrkraft. Ab 16 Jahren gilt die Begleitpflicht erst zwischen 24 und 5 Uhr. Öffentliche Spielhallen, Nachtbars und Nachtclubs dürfen Kinder und Jugendliche gar nicht betreten, auch nicht mit Begleitung.",
      "Bei Alkohol und Tabak sind die Grenzen gestaffelt. **Bier, Wein und Sekt**, auch gemischt mit alkoholfreien Getränken, gibt es erst ab 16 Jahren. Eine Ausnahme gilt für 14- und 15-Jährige: Mit ihren Eltern dürfen sie diese Getränke trinken, eine erziehungsbeauftragte Person genügt hier nicht. Kindern unter 14 bleibt Alkohol auch dann verboten. **Branntwein und andere Spirituosen**, auch in Alkopops, gibt es erst ab 18 Jahren. **Tabakwaren** und andere nikotinhaltige Erzeugnisse dürfen unter 18-Jährigen weder verkauft werden, noch darf ihnen das Rauchen in der Öffentlichkeit gestattet werden. Das gilt auch für E-Zigaretten und E-Shishas, selbst wenn sie kein Nikotin enthalten.",
      "Filme und Spiele tragen **Alterskennzeichen**: „ohne Altersbeschränkung“, „ab 6“, „ab 12“, „ab 16“ und „keine Jugendfreigabe“ (ab 18). Geprüft und vergeben werden sie von Selbstkontrollen der Branche, bei Filmen von der FSK, bei Spielen von der USK; rechtlich verbindlich sind sie, weil die Länder diese Entscheidungen als ihre eigenen übernehmen. Die Kennzeichen sind keine Empfehlung, sondern bindend: Eine 15-Jährige darf einen Film „ab 16“ im Kino nicht sehen, auch nicht mit Eltern. Eine Ausnahme gibt es nur bei „ab 12“: Kinder ab 6 Jahren dürfen den Film in Begleitung sehen. Im Netz soll das Gesetz auch vor Risiken wie Kontakten zu Fremden, Kaufappellen und glücksspielähnlichen Spielmechanismen schützen.",
    ],
    terms: [
      { term: "Kinder und Jugendliche", text: "Im Gesetz sind Kinder unter 14 Jahre alt, Jugendliche sind 14 bis 17 Jahre alt." },
      { term: "Erziehungsbeauftragte Person", text: "Eine Person ab 18 Jahren, die mit den Eltern vereinbart hat, Erziehungsaufgaben zu übernehmen, oder die Kinder in Ausbildung oder Jugendhilfe betreut." },
      { term: "Alterskennzeichen", text: "Eine verbindliche Altersfreigabe für Filme und Spiele, etwa „ab 12“, die Kinos, Läden und Verleiher beachten müssen." },
      { term: "Selbstkontrolle", text: "Organisationen der Branche wie FSK und USK, die Filme und Spiele prüfen und mit einem Alterskennzeichen versehen." },
    ],
    law: [
      {
        ref: "§ 1 JuSchG",
        text: "Kinder sind Personen unter 14 Jahren, Jugendliche sind Personen von 14 bis 17 Jahren. Erziehungsbeauftragt ist, wer mindestens 18 Jahre alt ist und mit der personensorgeberechtigten Person, meist den Eltern, vereinbart hat, Erziehungsaufgaben zu übernehmen, oder wer Kinder in Ausbildung oder Jugendhilfe betreut.",
        url: "https://www.gesetze-im-internet.de/juschg/__1.html",
      },
      {
        ref: "§§ 9 und 10 JuSchG",
        text: "Bier, Wein und Schaumwein (zum Beispiel Sekt) dürfen unter 16-Jährigen nicht abgegeben werden; 14- und 15-Jährige dürfen sie in Begleitung der Personensorgeberechtigten trinken. Andere alkoholische Getränke gibt es erst ab 18, ebenso Tabakwaren und E-Zigaretten, auch nikotinfreie.",
        url: "https://www.gesetze-im-internet.de/juschg/__9.html",
      },
    ],
    takeaway:
      "Das Jugendschutzgesetz schützt nach Altersstufen: Kinder sind unter 14, Jugendliche 14 bis 17 Jahre alt. Es verpflichtet vor allem Erwachsene, Altersgrenzen für Gaststätten, Spielhallen, Alkohol, Tabak sowie Filme und Spiele einzuhalten.",
    sourceIds: ["lp", "juschg"],
    quiz: {
      question: "Eine 15-Jährige möchte im Kino einen Film mit dem Kennzeichen „Freigegeben ab sechzehn Jahren“ sehen. Was gilt?",
      answer: "Sie darf den Film nicht sehen, denn die Altersfreigabe ist bindend, auch wenn ihre Eltern dabei sind.",
      wrong: [
        "Sie darf den Film sehen, wenn ihre Eltern sie im Kino begleiten und zustimmen.",
        "Sie darf den Film sehen, denn das Kennzeichen ist nur eine Empfehlung der Filmwirtschaft.",
      ],
      explanation:
        "Die Kennzeichen sind keine Empfehlung, sondern vorgeschrieben (§ 11 JuSchG). Bei der Altersfreigabe hilft eine Begleitung nur in einem Fall: Kinder ab sechs Jahren dürfen mit Begleitung Filme „ab 12“ sehen. Ein Film „ab 16“ bleibt für eine 15-Jährige gesperrt.",
    },
    workshop: {
      kind: "classify",
      title: "Allein, nur mit Begleitung oder verboten?",
      instruction: "Ordne jede Situation ein. Beachte Alter, Uhrzeit und Ort.",
      categories: ["Allein erlaubt", "Nur mit Begleitung", "Nicht erlaubt"],
      entries: [
        {
          text: "Eine 15-Jährige trinkt um 18 Uhr allein in einem Café einen Kakao.",
          target: 0,
          feedback: "Unter 16 darf man zwischen 5 und 23 Uhr allein in einer Gaststätte etwas essen oder trinken.",
        },
        {
          text: "Ein 15-Jähriger möchte um 23.30 Uhr noch in einer Gaststätte bleiben, in der seine Freunde feiern.",
          target: 1,
          feedback: "Nach 23 Uhr dürfen unter 16-Jährige nur mit Eltern oder einer erziehungsbeauftragten Person bleiben.",
        },
        {
          text: "Ein 17-Jähriger betritt eine öffentliche Spielhalle.",
          target: 2,
          feedback: "Spielhallen sind für alle unter 18 tabu, eine Begleitung ändert daran nichts.",
        },
        {
          text: "Ein 16-Jähriger kauft an der Kasse eine Flasche Bier.",
          target: 0,
          feedback: "Bier, Wein und Sekt gibt es ab 16 Jahren.",
        },
        {
          text: "Ein 16-Jähriger kauft eine Packung Zigaretten.",
          target: 2,
          feedback: "Tabakwaren gibt es erst ab 18 Jahren, auch mit Erlaubnis der Eltern.",
        },
        {
          text: "Ein Zehnjähriger möchte mit seiner Mutter im Kino einen Film „ab 12“ sehen.",
          target: 1,
          feedback: "Kinder ab sechs Jahren dürfen Filme „ab 12“ nur in Begleitung der Eltern oder einer erziehungsbeauftragten Person sehen.",
        },
      ],
      conclusion: "Altersgrenzen hängen von Ort, Uhrzeit und Art des Angebots ab. Eine Begleitung hilft nur dort, wo das Gesetz sie ausdrücklich zulässt.",
    },
    casework: {
      title: "Kinoabend zu zweit",
      story:
        "**Lena** (13) und **Tarik** (15) wollen am Samstag zusammen ins Kino. Der Film ist mit **„Freigegeben ab zwölf Jahren“** gekennzeichnet. Die Vorstellung beginnt um **19.45 Uhr** und endet um **21.30 Uhr**. Ihre Eltern wissen Bescheid, kommen aber nicht mit.",
      steps: [
        {
          question: "Ist der Film nach der Altersfreigabe für die beiden freigegeben?",
          options: [
            "Ja, beide sind mindestens zwölf Jahre alt, der Film ist für sie freigegeben.",
            "Nur für Tarik, denn Lena ist ein Kind, und Kinder dürfen keine Filme „ab 12“ sehen.",
            "Nur mit Eltern, denn jede Freigabe „ab 12“ verlangt eine Begleitung.",
          ],
          answer: 0,
          explanation:
            "Das Kennzeichen „ab zwölf“ nennt ein Mindestalter. Lena mit 13 und Tarik mit 15 liegen darüber, gleichgültig, ob man Kind oder Jugendlicher ist.",
        },
        {
          question: "Was gilt für Tarik (15) wegen der Uhrzeit?",
          options: [
            "Er braucht Begleitung, denn unter 16 gilt abends immer eine Begleitpflicht.",
            "Er darf allein, denn ab 14 gelten für Kinoabende keine Zeitgrenzen mehr.",
            "Er darf allein, denn die Vorführung endet nicht nach 22 Uhr.",
          ],
          answer: 2,
          explanation: "Jugendliche unter 16 brauchen nur dann Begleitung, wenn die Vorführung nach 22 Uhr endet. Hier endet sie um 21.30 Uhr.",
        },
        {
          question: "Was gilt für Lena (13) wegen der Uhrzeit?",
          options: [
            "Sie darf allein, denn mit 13 gilt dieselbe Grenze wie für Tarik.",
            "Sie braucht Begleitung, denn für Kinder gilt die Grenze von 20 Uhr.",
            "Sie darf allein, denn der Film ist für sie freigegeben.",
          ],
          answer: 1,
          explanation: "Kinder ab sechs Jahren brauchen Begleitung, wenn die Vorführung nach 20 Uhr endet. Sie endet um 21.30 Uhr, die Freigabe allein genügt nicht.",
        },
        {
          question: "Wer kann Lena begleiten?",
          options: [
            "Tarik, denn er ist Jugendlicher und damit schon verantwortlich genug.",
            "Ihre 16-jährige Schwester, wenn die Eltern es erlauben.",
            "Ihre Eltern oder eine über 18 Jahre alte Person, mit der die Eltern das vereinbart haben.",
          ],
          answer: 2,
          explanation:
            "Begleiten dürfen die Eltern oder eine erziehungsbeauftragte Person. Das ist eine Person ab 18 Jahren. Ein 15-Jähriger oder eine 16-Jährige zählt nicht dazu.",
        },
      ],
      verdict:
        "Der Film ist für beide freigegeben, aber nur Tarik darf allein gehen. Lena braucht eine Begleitung durch ihre Eltern oder eine erziehungsbeauftragte Person ab 18 Jahren, weil die Vorführung nach 20 Uhr endet.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, was ein Alterskennzeichen wie „Freigegeben ab sechzehn Jahren“ bedeutet, wer sich daran halten muss und warum es mehrere Stufen gibt.",
        hints: ["Ist das Kennzeichen eine Empfehlung oder eine Vorschrift?", "Wer darf Kindern und Jugendlichen den Zutritt oder Verkauf nicht erlauben?"],
        model:
          "Das Kennzeichen sagt, ab welchem Alter ein Film oder Spiel freigegeben ist. Es ist keine Empfehlung, sondern eine Vorschrift: Kinos, Händler und Verleiher dürfen jüngeren Kindern und Jugendlichen den Zugang oder Verkauf nicht erlauben und müssen im Zweifel das Alter prüfen. Es gibt mehrere Stufen, weil junge Menschen Inhalte unterschiedlich verarbeiten: Was ein 15-Jähriger gut einordnet, kann ein Achtjähriger noch nicht. Deshalb wächst die Freigabe mit dem Alter.",
        criteria: [
          "Erklärt das Kennzeichen als verbindliche Altersfreigabe",
          "Nennt, wer sich daran halten muss (Kino, Handel, Veranstalter)",
          "Begründet die Altersstufen mit dem Entwicklungsstand junger Menschen",
        ],
      },
      2: {
        prompt:
          "Ein Mitschüler sagt: „Mit 16 bin ich reif genug, dann sollten auch Zigaretten und Spielhallen für mich erlaubt sein.“ Beurteile die Aussage: Nenne ein Argument dafür und eines dagegen und begründe dein eigenes Urteil.",
        hints: [
          "Was spricht dafür, jungen Menschen mehr zuzutrauen?",
          "Warum sind die Folgen von Tabak und Glücksspiel besonders schwer rückgängig zu machen?",
        ],
        model:
          "Dafür spricht, dass viele 16-Jährige verantwortungsvoll sind und bei manchen Dingen, etwa Bier oder Wein, schon mehr dürfen. Dagegen spricht, dass Tabak und Glücksspiel schnell abhängig machen und die Folgen für Gesundheit und Geld lange anhalten. Junge Menschen schätzen solche Risiken oft schlechter ein als Erwachsene. Ich würde die Grenze von 18 Jahren deshalb beibehalten, weil der Schutz vor Sucht für mich schwerer wiegt als der Wunsch nach früherer Freiheit. Wer anders urteilt, müsste erklären, wie sonst vor Sucht geschützt wird.",
        criteria: [
          "Nennt ein Argument für mehr Freiheit mit 16",
          "Nennt ein Argument für die Altersgrenze, zum Beispiel den Schutz vor Risiken",
          "Begründet ein eigenes Urteil",
        ],
      },
    },
  },

];
