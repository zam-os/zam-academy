import type { Lesson } from "../model/types";

export const LB4A: Lesson[] = [
  {
    id: "re-ordnung",
    lb: 4,
    unit: "4.1",
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
        url: "https://www.gesetze-im-internet.de/gg/art_20.html",
      },
      {
        ref: "Art. 80 Abs. 1 GG",
        text: "Ein Gesetz kann die Regierung oder Ministerien ermächtigen, Verordnungen zu erlassen. Inhalt, Zweck und Ausmaß dieser Ermächtigung muss das Gesetz selbst festlegen.",
        url: "https://www.gesetze-im-internet.de/gg/art_80.html",
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
    id: "re-lebensalter",
    lb: 4,
    unit: "4.1",
    title: "Rechtsfähigkeit und Geschäftsfähigkeit",
    intro: "Ab wann darf man Verträge schließen? Das Recht antwortet mit dem Alter.",
    paragraphs: [
      "**Rechtsfähig** ist, wer Rechte und Pflichten haben kann. Das gilt für jeden Menschen ab der Geburt (§ 1 BGB): Auch ein Baby kann Inhaber eines Sparbuchs sein oder etwas erben. Selbst handeln kann es aber noch nicht, das tun für das Kind zunächst seine Eltern. Rechte haben und Verträge schließen sind also zwei verschiedene Dinge.",
      "Etwas anderes ist die **Geschäftsfähigkeit**: die Fähigkeit, durch eigene Willenserklärungen wirksame Verträge zu schließen. Das Gesetz schützt junge Menschen und stuft sie nach dem Alter ab. Wer unter 7 Jahre alt ist, ist **geschäftsunfähig**: Seine Willenserklärungen sind nichtig. Geschäftsunfähig kann auch ein Erwachsener sein, etwa bei einer dauerhaften krankhaften Störung der Geistestätigkeit (§ 104 BGB). Von 7 bis 17 Jahren ist man **beschränkt geschäftsfähig**: Für die meisten Verträge braucht man die Zustimmung der Eltern. Ab 18 Jahren ist man **voll geschäftsfähig**.",
      "Der Vertrag eines Minderjährigen ohne Zustimmung ist nicht von vornherein ungültig, sondern **schwebend unwirksam**: Er gilt, sobald die Eltern ihn genehmigen. Von Anfang an wirksam ist ein Geschäft in drei Fällen: wenn es nur Vorteile bringt (ein Geschenk annehmen), wenn die Eltern vorher zustimmen und wenn der Minderjährige es mit dem **Taschengeld** ganz bezahlt (§ 110 BGB). Eine Preisgrenze nennt das Gesetz nicht; entscheidend ist, dass ihm das Geld zur freien Verfügung oder für diesen Zweck überlassen wurde.",
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
    id: "re-gesetz",
    lb: 4,
    unit: "4.1",
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
        url: "https://www.gesetze-im-internet.de/bgb/__604.html",
      },
    ],
    takeaway:
      "Ein Gesetz gliedert sich in Paragrafen, Absätze, Sätze und Nummern und lässt sich so genau zitieren. Einen Rechtsfall löst man in vier Schritten: Frage klären, passende Vorschrift finden, den Fall unter den Tatbestand fassen und die Rechtsfolge als Ergebnis nennen.",
    sourceIds: ["lp", "bgb", "bmj", "juschg"],
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
    id: "re-jugendschutz",
    lb: 4,
    unit: "4.1",
    title: "Das Jugendschutzgesetz",
    intro: "Das Jugendschutzgesetz schützt Kinder und Jugendliche mit Altersgrenzen, die sich vor allem an Erwachsene richten.",
    paragraphs: [
      "Das **Jugendschutzgesetz** (JuSchG) soll junge Menschen vor Gefahren schützen, denen sie noch nicht gewachsen sind, etwa durch Alkohol, Glücksspiel oder ungeeignete Medien. Es unterscheidet **Kinder** (unter 14 Jahren) und **Jugendliche** (14 bis 17 Jahre). Es richtet sich vor allem an Erwachsene: Wirtinnen, Verkäufer und Veranstalter dürfen Verbotenes nicht erlauben oder verkaufen und müssen im Zweifel das Alter prüfen. Wer jünger wirkt, muss darum sein Alter auf Verlangen nachweisen können, zum Beispiel mit dem Ausweis.",
      "Unter 16 Jahren darf man sich in einer Gaststätte ohne Begleitung nur aufhalten, um zwischen 5 und 23 Uhr etwas zu essen oder zu trinken; Ausnahmen gibt es etwa auf Reisen. Sonst braucht man die Begleitung der Eltern (genauer: der Personensorgeberechtigten) oder einer **erziehungsbeauftragten Person**. Das ist eine Person über 18 Jahren, die laut Vereinbarung mit den Eltern Erziehungsaufgaben übernimmt oder Kinder in Ausbildung oder Jugendhilfe betreut, etwa als Lehrkraft. Ab 16 Jahren gilt die Begleitpflicht erst zwischen 24 und 5 Uhr. Öffentliche Spielhallen, Nachtbars und Nachtclubs dürfen Kinder und Jugendliche gar nicht betreten, auch nicht mit Begleitung.",
      "Bei Alkohol und Tabak sind die Grenzen gestaffelt. **Bier, Wein und Sekt**, auch gemischt mit alkoholfreien Getränken, gibt es erst ab 16 Jahren. Eine Ausnahme gilt für 14- und 15-Jährige: Mit ihren Eltern dürfen sie diese Getränke trinken, eine erziehungsbeauftragte Person genügt hier nicht. Kindern unter 14 bleibt Alkohol auch dann verboten. **Branntwein und andere Spirituosen**, auch in Alkopops, gibt es erst ab 18 Jahren. **Tabakwaren** und andere nikotinhaltige Erzeugnisse dürfen unter 18-Jährigen weder verkauft werden, noch darf ihnen das Rauchen in der Öffentlichkeit gestattet werden. Das gilt auch für E-Zigaretten und E-Shishas, selbst wenn sie kein Nikotin enthalten.",
      "Filme und Spiele tragen **Alterskennzeichen**: „ohne Altersbeschränkung“, „ab 6“, „ab 12“, „ab 16“ und „keine Jugendfreigabe“ (ab 18). Geprüft und vergeben werden sie von Selbstkontrollen der Branche, bei Filmen von der FSK, bei Spielen von der USK; rechtlich verbindlich sind sie, weil die Länder diese Entscheidungen als ihre eigenen übernehmen. Die Kennzeichen sind keine Empfehlung, sondern bindend: Eine 15-Jährige darf einen Film „ab 16“ im Kino nicht sehen, auch nicht mit Eltern. Eine Ausnahme gibt es nur bei „ab 12“: Kinder ab 6 Jahren dürfen den Film in Begleitung sehen. Im Netz soll das Gesetz auch vor Risiken wie Kontakten zu Fremden, Kaufappellen und glücksspielähnlichen Spielmechanismen schützen.",
    ],
    terms: [
      { term: "Kinder und Jugendliche", text: "Im Gesetz sind Kinder unter 14 Jahre alt, Jugendliche sind 14 bis 17 Jahre alt." },
      { term: "Erziehungsbeauftragte Person", text: "Eine Person über 18 Jahren, die mit den Eltern vereinbart hat, Erziehungsaufgaben zu übernehmen, oder die Kinder in Ausbildung oder Jugendhilfe betreut." },
      { term: "Alterskennzeichen", text: "Eine verbindliche Altersfreigabe für Filme und Spiele, etwa „ab 12“, die Kinos, Läden und Verleiher beachten müssen." },
      { term: "Selbstkontrolle", text: "Organisationen der Branche wie FSK und USK, die Filme und Spiele prüfen und mit einem Alterskennzeichen versehen." },
    ],
    law: [
      {
        ref: "§ 1 JuSchG",
        text: "Kinder sind Personen unter 14 Jahren, Jugendliche sind Personen von 14 bis 17 Jahren. Erziehungsbeauftragt ist, wer über 18 Jahre alt ist und mit der personensorgeberechtigten Person, meist den Eltern, vereinbart hat, Erziehungsaufgaben zu übernehmen, oder wer Kinder in Ausbildung oder Jugendhilfe betreut.",
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
            "Begleiten dürfen die Eltern oder eine erziehungsbeauftragte Person. Das ist eine Person über 18 Jahren. Ein 15-Jähriger oder eine 16-Jährige zählt nicht dazu.",
        },
      ],
      verdict:
        "Der Film ist für beide freigegeben, aber nur Tarik darf allein gehen. Lena braucht eine Begleitung durch ihre Eltern oder eine erziehungsbeauftragte Person über 18 Jahren, weil die Vorführung nach 20 Uhr endet.",
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
  {
    id: "ve-eigentum",
    lb: 4,
    unit: "4.2",
    title: "Besitz und Eigentum",
    intro: "Wer eine Sache hat, ist nicht immer ihr Eigentümer. Das BGB unterscheidet genau, wer sie hat und wem sie gehört.",
    paragraphs: [
      "Du leihst deiner Freundin dein Fahrrad. Wer „hat“ es jetzt, und wem gehört es? Das Recht trennt zwei Dinge. **Besitz** ist die tatsächliche Gewalt über eine Sache: Man hat sie in der Hand, im Rucksack oder in der Wohnung (§ 854 BGB). **Eigentum** ist die rechtliche Herrschaft: Es sagt, wem die Sache gehört (§ 903 BGB). Deine Freundin ist Besitzerin des Rads, du bleibst Eigentümerin. Meistens fallen beide zusammen, so wie bei deinem Handy in der Jackentasche.",
      "Beispiele zeigen den Unterschied. Bei der **Leihe** ist der Entleiher Besitzer, der Verleiher Eigentümer. Beim **Mietvertrag** ist der Mieter Besitzer, etwa des Transporters oder der Wohnung, und der Vermieter bleibt Eigentümer. (Juristisch gelten Verleiher und Vermieter als mittelbare Besitzer, § 868 BGB; hier zählt, wer die Sache tatsächlich hat.) Ein **Dieb** wird Besitzer, durch den Diebstahl aber nicht Eigentümer. Auch wer etwas **findet**, wird zunächst nur Besitzer; Eigentümer bleibt, wem die Sache bisher gehörte. Ist sie mehr als zehn Euro wert, muss der Finder den Fund melden, meist beim Fundbüro der Gemeinde, und die Sache aufbewahren.",
      "Das Eigentum gibt starke Rechte. Der Eigentümer darf mit seiner Sache grundsätzlich nach Belieben verfahren: sie benutzen, verändern, verkaufen, verschenken oder wegwerfen. Er darf auch andere von jeder Einwirkung ausschließen (§ 903 BGB). Wer eine Sache ohne Recht zum Besitz hat, muss sie dem Eigentümer auf Verlangen herausgeben (§§ 985 und 986 BGB). Grenzen setzen Gesetze und Rechte Dritter: Ein Vermieter darf dem Mieter die Wohnung nicht einfach wegnehmen, und wer ein Tier hält, muss die Tierschutzvorschriften beachten.",
      "Eigentum an beweglichen Sachen erwirbt man meist durch **Einigung und Übergabe** (§ 929 BGB), zum Beispiel beim Kauf oder bei einer Schenkung. Wer eine Sache stiehlt, wird nicht Eigentümer. Auch wer sie von einem Dieb oder Hehler kauft, wird es grundsätzlich nicht, selbst wenn er den Diebstahl nicht ahnt (§ 935 BGB). Ein Finder kann Eigentümer werden, wenn sich sechs Monate nach der Fundanzeige bei der Behörde niemand mit einem Recht an der Sache gemeldet hat (§ 973 BGB); bei Sachen bis zehn Euro beginnt die Frist mit dem Fund.",
    ],
    terms: [
      { term: "Besitz", text: "Die tatsächliche Gewalt über eine Sache: Man hat sie in der Hand oder in seinem Gewahrsam." },
      { term: "Eigentum", text: "Die rechtliche Herrschaft über eine Sache: Man darf mit ihr nach Belieben verfahren und andere ausschließen." },
      { term: "Bewegliche Sache", text: "Ein körperlicher Gegenstand, den man wegbringen kann, zum Beispiel ein Handy, ein Fahrrad oder ein Buch." },
      { term: "Herausgabeanspruch", text: "Das Recht des Eigentümers, die Sache vom Besitzer zurückzuverlangen, wenn dieser kein Recht zum Besitz hat." },
    ],
    law: [
      {
        ref: "§ 854 Abs. 1 BGB",
        text: "Den Besitz an einer Sache erwirbt, wer die tatsächliche Gewalt über sie erlangt.",
        url: "https://www.gesetze-im-internet.de/bgb/__854.html",
      },
      {
        ref: "§ 903 BGB",
        text: "Der Eigentümer darf mit seiner Sache nach Belieben verfahren und andere von jeder Einwirkung ausschließen, soweit nicht Gesetz oder Rechte Dritter entgegenstehen.",
        url: "https://www.gesetze-im-internet.de/bgb/__903.html",
      },
    ],
    takeaway:
      "Besitz ist die tatsächliche Gewalt über eine Sache, Eigentum die rechtliche Herrschaft über sie. Beides kann auseinanderfallen: Der Mieter, der Entleiher und sogar der Dieb besitzen eine Sache, ohne ihr Eigentümer zu sein.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Wie unterscheidet das Bürgerliche Gesetzbuch Besitz und Eigentum?",
      answer: "Besitz ist die tatsächliche Gewalt über eine Sache, Eigentum ist die rechtliche Herrschaft über sie.",
      wrong: [
        "Besitz ist die rechtliche Herrschaft über eine Sache, Eigentum ist die bloße tatsächliche Gewalt.",
        "Beides ist dasselbe: Wer eine Sache in der Hand hat, dem gehört sie auch.",
      ],
      explanation:
        "Besitz fragt, wer die Sache hat, Eigentum, wem sie gehört. Das fällt oft zusammen, aber nicht immer, etwa bei geliehenen oder gestohlenen Sachen.",
    },
    workshop: {
      kind: "classify",
      title: "Besitzer, Eigentümer oder beides?",
      instruction: "Ordne die Person oder Firma zu, die im Satz zuerst genannt wird. „Besitzer“ heißt hier: Sie hat die Sache tatsächlich in der Hand. „Eigentümer“ heißt: Die Sache gehört ihr.",
      categories: ["Nur Besitzer", "Nur Eigentümer", "Besitzer und Eigentümer"],
      entries: [
        {
          text: "Jule fährt am Wochenende mit dem Fahrrad, das ihr Max geliehen hat.",
          target: 0,
          feedback: "Jule hat die tatsächliche Gewalt über das Rad, es gehört ihr aber nicht.",
        },
        {
          text: "Max hat sein Fahrrad für das Wochenende an Jule verliehen.",
          target: 1,
          feedback: "Max hat das Rad nicht in der Hand, es gehört ihm aber weiterhin. Juristisch bleibt er mittelbarer Besitzer (§ 868 BGB).",
        },
        {
          text: "Ana trägt das Handy in der Tasche, das sie gekauft und bezahlt hat.",
          target: 2,
          feedback: "Sie hat das Handy bei sich, und es gehört ihr: Beides fällt zusammen.",
        },
        {
          text: "Ein Dieb versteckt ein gestohlenes Smartphone in seinem Rucksack.",
          target: 0,
          feedback: "Der Dieb hat die Sache in seiner Gewalt, Eigentümer wird er durch den Diebstahl nicht.",
        },
        {
          text: "Eine Autovermietung hat ihren Transporter für einen Tag an einen Kunden vermietet.",
          target: 1,
          feedback: "Die Firma bleibt Eigentümerin, der Mieter hat den Transporter in der Hand und ist Besitzer.",
        },
      ],
      conclusion: "Wer eine Sache hat, ist nicht zwingend ihr Eigentümer. Man muss beide Fragen getrennt stellen.",
    },
    casework: {
      title: "Das Mountainbike auf dem Flohmarkt",
      story:
        "Toms Mountainbike wird vor der Schule **gestohlen**. Wochen später kauft **Jule** auf einem Flohmarkt von einem Unbekannten ein Mountainbike für **50 Euro**. Sie weiß **nicht**, dass es gestohlen ist. Tom erkennt sein Rad an einer Gravur im Rahmen.",
      steps: [
        {
          question: "Wer ist nach dem Kauf Besitzerin des Mountainbikes?",
          options: [
            "Jule, denn sie hat jetzt die tatsächliche Gewalt über das Rad.",
            "Tom, denn das Rad gehört ihm.",
            "Der Unbekannte, denn er hatte es zuerst.",
          ],
          answer: 0,
          explanation: "Besitz bedeutet tatsächliche Gewalt, und die hat Jule. Wem das Rad gehört, ist eine andere Frage.",
        },
        {
          question: "Wer ist Eigentümer des Mountainbikes?",
          options: [
            "Jule, denn sie hat den Preis bezahlt und nichts vom Diebstahl gewusst.",
            "Niemand, denn das Rad ist nach dem Diebstahl herrenlos geworden.",
            "Tom, denn von gestohlenen Sachen erwirbt man grundsätzlich kein Eigentum.",
          ],
          answer: 2,
          explanation:
            "Das Eigentum geht durch den Diebstahl nicht verloren. Auch ein gutgläubiger Käufer kann eine gestohlene Sache nicht erwerben (§ 935 BGB). Herrenlos wird eine Sache nur, wenn der Eigentümer auf sein Eigentum verzichtet.",
        },
        {
          question: "Was kann Tom von Jule verlangen?",
          options: [
            "Nur Ersatz des Geldes; das Rad bleibt bei Jule.",
            "Die Herausgabe des Rads, denn der Eigentümer kann sie vom Besitzer ohne Recht zum Besitz verlangen.",
            "Nichts, denn Jule hat das Rad ehrlich erworben und darf es behalten.",
          ],
          answer: 1,
          explanation:
            "Das ist der Herausgabeanspruch aus § 985 BGB. Jule hat kein Recht zum Besitz, weil sie nicht Eigentümerin geworden ist, und muss das Rad zurückgeben.",
        },
      ],
      verdict:
        "Jule ist Besitzerin, Tom bleibt Eigentümer. Weil das Rad Tom gestohlen wurde, konnte Jule auch gutgläubig kein Eigentum erwerben (§ 935 BGB), und sie muss es herausgeben.",
    },
    tasks: {
      1: {
        prompt: "Erkläre den Unterschied zwischen Besitz und Eigentum und zeige ihn an dem Beispiel einer Fahrradvermietung.",
        hints: ["Wer hat das Fahrrad in der Hand, und wem gehört es?", "Was darf der Eigentümer, was der Mieter nicht ohne Weiteres darf?"],
        model:
          "Besitz ist die tatsächliche Gewalt über eine Sache, Eigentum ist die rechtliche Herrschaft. Bei einer Fahrradvermietung hat der Mieter das Rad und fährt damit, er ist also Besitzer. Eigentümer bleibt der Verleiher, ihm gehört das Rad. Nur der Eigentümer darf es verkaufen oder behalten, der Mieter muss es nach der Mietzeit zurückgeben. Beides fällt zusammen, wenn jemand sein eigenes Rad fährt.",
        criteria: [
          "Erklärt Besitz als tatsächliche Gewalt",
          "Erklärt Eigentum als rechtliche Herrschaft",
          "Wendet beide Begriffe richtig auf die Vermietung an",
        ],
      },
      2: {
        prompt:
          "Ein Freund sagt: „Das Handy, das ich im Bus gefunden habe, gehört jetzt mir.“ Beurteile mit den Begriffen Besitz und Eigentum, ob das stimmt, und sage, was er tun muss.",
        hints: ["Wer hat das Handy in der Hand, und wem gehört es?", "An wen muss er sich wenden, und wann könnte er Eigentümer werden?"],
        model:
          "Das stimmt nicht. Der Freund ist durch das Aufheben zwar Besitzer geworden, aber der Verlierer bleibt Eigentümer, denn Eigentum geht nicht durch Finden verloren. Weil ein Handy mehr als zehn Euro wert ist, muss er den Fund unverzüglich melden, zuerst dem Verlierer, falls er ihn kennt, sonst der zuständigen Stelle wie dem Fundbüro, und das Handy aufbewahren. Meldet sich sechs Monate nach der Anzeige niemand, kann er Eigentümer werden. Behält er es still für sich, handelt er unrechtmäßig und kann sich sogar strafbar machen.",
        criteria: [
          "Ordnet den Finder als Besitzer und nicht als Eigentümer ein",
          "Nennt die Pflicht zur Anzeige und zur Aufbewahrung",
          "Nennt, unter welcher Bedingung der Finder Eigentümer werden kann",
        ],
      },
    },
  },
  {
    id: "ve-kaufvertrag",
    lb: 4,
    unit: "4.2",
    title: "Wie ein Kaufvertrag entsteht",
    intro: "Ein Kaufvertrag entsteht durch Antrag und Annahme. Im Modell siehst du, wann daraus ein Vertrag wird und wann nicht.",
    paragraphs: [
      "Verträge entstehen durch **Willenserklärungen**: Äußerungen, mit denen jemand einen bestimmten rechtlichen Erfolg will, zum Beispiel „Ich kaufe das“. Für einen Kaufvertrag braucht es zwei übereinstimmende Erklärungen. Die erste ist der **Antrag**, die zweite die **Annahme**. Sagt eine Kundin: „Ich nehme das Rad für 300 Euro“, und die Händlerin antwortet: „Einverstanden“, ist der Vertrag zustande gekommen. Es kann auch umgekehrt laufen: Erst bietet die Händlerin das Rad an, dann stimmt die Kundin zu. Schweigen gilt in der Regel nicht als Annahme.",
      "Waren im Schaufenster oder im Regal sind noch kein Antrag. Sie sind eine **unverbindliche Auslage**, eine Einladung an Kunden, selbst ein Angebot abzugeben. Sonst müsste die Händlerin ihr einziges Rad an jeden verkaufen, der „Ich nehme es“ ruft. Erst die Kundin macht den Antrag, die Händlerin nimmt ihn an. Ändert jemand den Antrag bei der Antwort ab („Nur für 250 Euro“), dann lehnt er ihn ab und macht einen **neuen Antrag** (§ 150 Abs. 2 BGB). Probiere im Modell aus, bei welcher Kombination ein Vertrag entsteht.",
      "Das Privatrecht gewährt **Vertragsfreiheit**. Nach ständiger Rechtsprechung folgt sie aus dem Recht auf freie Entfaltung der Persönlichkeit (Art. 2 Abs. 1 GG) und hat drei Teile: die Abschlussfreiheit (ob und mit wem man einen Vertrag schließt), die Inhaltsfreiheit (was man vereinbart) und die Formfreiheit (ob mündlich, schriftlich oder per Handschlag). Es gibt Grenzen: Busse und Bahnen müssen Fahrgäste befördern, wenn die Beförderungsbedingungen eingehalten sind, etwa mit gültigem Fahrschein (§ 22 PBefG, bei der Eisenbahn § 10 AEG). Verträge, die gegen ein gesetzliches Verbot oder die guten Sitten verstoßen, sind in der Regel nichtig. Beim Grundstückskauf schreibt das Gesetz die notarielle Beurkundung vor.",
      "Aus dem Kaufvertrag entstehen Pflichten für beide Seiten (§ 433 BGB). Der Verkäufer muss dem Käufer die Sache übergeben und ihm das Eigentum verschaffen, und zwar frei von Mängeln. Der Käufer muss den vereinbarten **Kaufpreis zahlen** und die gekaufte Sache **abnehmen**. Beide haben also Rechte und Pflichten zugleich: Was für den einen Pflicht ist, ist für den anderen ein Recht.",
    ],
    terms: [
      { term: "Willenserklärung", text: "Eine Äußerung, mit der jemand einen rechtlichen Erfolg will, etwa einen Vertrag zu schließen." },
      { term: "Antrag und Annahme", text: "Der Antrag ist die erste, die Annahme die zustimmende zweite Willenserklärung; zusammen ergeben sie den Vertrag." },
      { term: "Vertragsfreiheit", text: "Die Freiheit, selbst zu entscheiden, ob, mit wem, mit welchem Inhalt und in welcher Form man einen Vertrag schließt." },
      { term: "Kaufvertrag", text: "Ein Vertrag, durch den der Verkäufer die Sache übergeben und das Eigentum verschaffen muss und der Käufer den Preis zu zahlen hat." },
    ],
    law: [
      {
        ref: "§ 433 BGB",
        text: "Der Verkäufer muss die Sache übergeben, das Eigentum daran verschaffen und sie frei von Mängeln liefern. Der Käufer muss den vereinbarten Kaufpreis zahlen und die Sache abnehmen.",
        url: "https://www.gesetze-im-internet.de/bgb/__433.html",
      },
      {
        ref: "§ 150 Abs. 2 BGB",
        text: "Wer einen Antrag nur mit Erweiterungen, Einschränkungen oder anderen Änderungen annimmt, lehnt ihn ab und macht zugleich einen neuen Antrag.",
        url: "https://www.gesetze-im-internet.de/bgb/__150.html",
      },
    ],
    takeaway:
      "Ein Kaufvertrag kommt durch zwei übereinstimmende Willenserklärungen zustande, Antrag und Annahme. Eine Schaufensterauslage ist noch kein Antrag, und eine Annahme mit Änderung gilt als neuer Antrag. Der Vertrag verpflichtet den Verkäufer zu Übergabe und Eigentumsverschaffung, den Käufer zu Zahlung und Abnahme.",
    sourceIds: ["lp", "bgb", "gg"],
    quiz: {
      question: "Wann kommt ein Kaufvertrag zustande?",
      answer: "In der Regel sobald zwei übereinstimmende Willenserklärungen vorliegen: ein Antrag und die passende Annahme.",
      wrong: [
        "Erst wenn der Käufer die Ware erhalten und den Kaufpreis bezahlt hat.",
        "Erst wenn beide Seiten den Vertrag schriftlich unterschrieben haben.",
      ],
      explanation:
        "Der Vertrag entsteht schon mit der Einigung. Übergabe und Zahlung sind erst die Erfüllung, und eine Schriftform ist bei den meisten Kaufverträgen nicht nötig (Formfreiheit).",
    },
    lab: "kaufvertrag",
    labGoals: ["vertrag"],
    workshop: {
      kind: "classify",
      title: "Antrag, Annahme oder nichts von beidem?",
      instruction: "Ordne jede Aussage zu.",
      categories: ["Antrag", "Annahme", "Weder noch"],
      entries: [
        {
          text: "Im Schaufenster steht ein Fahrrad mit dem Preisschild „300 Euro“.",
          target: 2,
          feedback: "Eine Auslage ist nur eine Einladung, selbst ein Angebot abzugeben.",
        },
        {
          text: "Die Kundin sagt: „Ich nehme das Fahrrad für 300 Euro.“",
          target: 0,
          feedback: "Die Kundin macht das Angebot, auf das die Händlerin antworten kann.",
        },
        {
          text: "Die Händlerin antwortet auf dieses Angebot: „Einverstanden, das Rad gehört Ihnen.“",
          target: 1,
          feedback: "Sie stimmt dem Antrag unverändert zu, damit ist der Vertrag geschlossen.",
        },
        {
          text: "Die Händlerin antwortet auf das Angebot der Kundin: „Für 300 Euro nicht, aber für 340 Euro.“",
          target: 0,
          feedback: "Eine Annahme mit Änderung gilt als Ablehnung und zugleich als neuer Antrag.",
        },
        {
          text: "Die Händlerin schweigt zu dem Angebot der Kundin und räumt weiter Regale ein.",
          target: 2,
          feedback: "Schweigen ist in der Regel keine Willenserklärung und damit keine Annahme.",
        },
      ],
      conclusion: "Ein Vertrag entsteht erst, wenn auf einen Antrag eine unveränderte Annahme folgt.",
    },
    casework: {
      title: "Die Gitarre auf dem Flohmarkt",
      story:
        "Auf dem Flohmarkt sieht **Luca** eine gebrauchte Gitarre mit einem Zettel: „60 Euro“. Er sagt zur Verkäuferin **Frau Aydin**: „Ich gebe Ihnen 45 Euro.“ Sie antwortet: „50 Euro, dann ist sie Ihre.“ Luca überlegt kurz und sagt: „Gut, 50 Euro.“ Danach packt er die Gitarre ein und zahlt.",
      steps: [
        {
          question: "Wie ist Lucas erster Satz „Ich gebe Ihnen 45 Euro“ rechtlich einzuordnen?",
          options: [
            "Als Annahme des Angebots, das auf dem Zettel steht.",
            "Als Antrag auf Abschluss eines Kaufvertrags über die Gitarre.",
            "Als bloße Frage ohne rechtliche Bedeutung.",
          ],
          answer: 1,
          explanation: "Der Zettel ist nur eine Auslage. Luca gibt deshalb den ersten Antrag ab, und zwar zu einem Preis von 45 Euro.",
        },
        {
          question: "Wie wirkt die Antwort „50 Euro, dann ist sie Ihre“?",
          options: [
            "Als Annahme, weil sich beide grundsätzlich einig sind.",
            "Gar nicht, weil sie nur über den Preis verhandelt.",
            "Als Ablehnung des ersten Antrags und neuer Antrag der Verkäuferin.",
          ],
          answer: 2,
          explanation: "Frau Aydin nimmt nicht unverändert an. Eine Annahme mit Änderung gilt als Ablehnung und zugleich als neuer Antrag (§ 150 Abs. 2 BGB).",
        },
        {
          question: "Wann ist der Kaufvertrag zustande gekommen?",
          options: [
            "Mit Lucas Satz „Gut, 50 Euro“, denn damit nimmt er den neuen Antrag an.",
            "Erst als Luca die Gitarre einpackt.",
            "Erst als Luca die 50 Euro bezahlt hat.",
          ],
          answer: 0,
          explanation: "Der Vertrag entsteht mit der Annahme, nicht erst mit Übergabe oder Zahlung. Beide sind danach nur noch zu erfüllen.",
        },
        {
          question: "Welche Pflicht hat Frau Aydin aus dem Vertrag?",
          options: [
            "Nur den Preis anzunehmen, mehr nicht.",
            "Luca ein Rückgaberecht für 14 Tage ohne Grund einzuräumen.",
            "Die Gitarre zu übergeben und Luca das Eigentum zu verschaffen.",
          ],
          answer: 2,
          explanation:
            "§ 433 Abs. 1 BGB verpflichtet den Verkäufer zu Übergabe und Eigentumsverschaffung. Ein Rückgaberecht ohne Grund (Widerruf, § 355 BGB) gibt es nur bei Verbraucherverträgen im Fernabsatz oder außerhalb von Geschäftsräumen (§ 312g BGB), nicht beim Kauf von einer Privatperson.",
        },
      ],
      verdict:
        "Der Vertrag kam mit Lucas Zusage „Gut, 50 Euro“ zustande, nicht erst bei der Zahlung. Aus ihm folgen die Pflichten aus § 433 BGB: Frau Aydin muss die Gitarre übergeben, Luca muss 50 Euro zahlen.",
    },
    tasks: {
      1: {
        prompt: "Erkläre, wie ein Kaufvertrag zustande kommt, und begründe, warum die Auslage im Schaufenster noch kein Antrag ist.",
        hints: [
          "Welche beiden Willenserklärungen braucht jeder Vertrag?",
          "Was würde passieren, wenn die Händlerin an jeden verkaufen müsste, der „Ich nehme es“ sagt?",
        ],
        model:
          "Ein Kaufvertrag entsteht durch zwei übereinstimmende Willenserklärungen: Der Antrag kommt von der einen Seite, die Annahme von der anderen. Die Auslage ist noch kein Antrag, sondern nur eine Einladung an die Kunden, selbst ein Angebot abzugeben. Wäre sie schon ein Antrag, müsste die Händlerin ihr einziges Rad mehreren Kunden verkaufen, wenn alle „Ich nehme es“ sagen. Weil sie grundsätzlich selbst entscheiden darf, an wen sie verkauft (Grenzen setzt etwa das Verbot der Benachteiligung nach dem Gleichbehandlungsgesetz), nimmt sie erst den Antrag der Kundin an.",
        criteria: [
          "Nennt Antrag und Annahme als zwei übereinstimmende Willenserklärungen",
          "Erklärt die Auslage als Einladung zum Angebot",
          "Begründet, warum das für die Händlerin sinnvoll ist",
        ],
      },
      2: {
        prompt: "Ein Mitschüler behauptet: „Ein Vertrag gilt nur, wenn man ihn schriftlich unterschrieben hat.“ Beurteile die Aussage mit Hilfe der Vertragsfreiheit.",
        hints: [
          "Welche drei Freiheiten gehören zur Vertragsfreiheit?",
          "Gibt es Verträge, bei denen das Gesetz eine bestimmte Form vorschreibt, und warum?",
        ],
        model:
          "Die Aussage stimmt nicht allgemein. Wegen der Formfreiheit kann man die meisten Verträge mündlich oder per Handschlag schließen, auch der Brötchenkauf ist ein Vertrag. Ausnahmen gibt es dort, wo das Gesetz schützen will: Ein Grundstückskauf braucht die notarielle Beurkundung, weil es um viel Geld und lange Folgen geht. Schriftlich ist trotzdem oft sinnvoll, weil man später beweisen kann, was vereinbart wurde.",
        criteria: [
          "Erklärt die Formfreiheit als Teil der Vertragsfreiheit",
          "Nennt ein Beispiel, bei dem das Gesetz eine Form verlangt",
          "Begründet, warum Schriftform trotzdem sinnvoll sein kann",
        ],
      },
    },
  },
  {
    id: "ve-erfuellung",
    lb: 4,
    unit: "4.2",
    title: "Verpflichtung und Erfüllung beim Kauf",
    intro: "Ein Kaufvertrag ändert noch nichts am Eigentum. Erst Übergabe und Einigung machen den Käufer zum Eigentümer.",
    paragraphs: [
      "Im Laden scheint beim Kauf alles gleichzeitig zu geschehen. Rechtlich sind es mehrere Schritte. Der Kaufvertrag ist das **Verpflichtungsgeschäft**: Er schafft Pflichten, ändert aber noch nichts daran, wem die Sache gehört und wer sie hat. Das Gesetz trennt streng zwischen dem Versprechen und dem Erfüllen. Bestellt Anna im Möbelhaus ein Sofa für nächsten Monat, ist der Vertrag sofort da. Das Sofa gehört aber weiter dem Möbelhaus und steht noch dort.",
      "Erfüllt wird der Vertrag durch **Erfüllungsgeschäfte**. Der Verkäufer muss dem Käufer das Eigentum verschaffen. Das geschieht nach § 929 BGB durch **Einigung und Übergabe**: Er übergibt die Sache, und beide sind sich einig, dass das Eigentum jetzt übergehen soll. Der Käufer erfüllt seine Pflicht durch **Zahlung** des Kaufpreises. Sobald jede Seite ihre Leistung erbracht hat, erlischt die Pflicht (§ 362 BGB); man sagt, sie sei **erfüllt**.",
      "Überraschend ist: Das Eigentum hängt nicht von der Zahlung ab. Erhält Samira einen gekauften Laptop und vergisst zu zahlen, wird sie trotzdem Eigentümerin, wenn nichts anderes vereinbart wurde; sie schuldet aber weiter den Kaufpreis. Umgekehrt bleibt der Verkäufer in der Regel Eigentümer, solange er die Sache nicht übergeben hat, auch wenn der Käufer schon gezahlt hat. Dann hat der Käufer nur einen Anspruch auf Übergabe und Eigentumsverschaffung. Im Modell siehst du beides: erst nur den Vertrag, dann den Eigentumsübergang.",
      "Was gilt, wenn nur der Vertrag besteht? Er bindet beide: Jede Seite kann von der anderen Erfüllung verlangen, notfalls vor Gericht. Wer seinen Teil nicht erfüllt, verletzt seine Pflicht und muss mit Folgen rechnen, etwa mit Zinsen oder Schadensersatz. Ein Käufer darf sich die Ware aber nicht einfach nehmen, und ein Verkäufer darf das Geld nicht einfach holen. Beim Brötchenkauf fallen Vertrag, Übergabe und Zahlung zeitlich zusammen, rechtlich bleiben es verschiedene Schritte.",
    ],
    terms: [
      { term: "Verpflichtungsgeschäft", text: "Das Geschäft, das Pflichten begründet, hier der Kaufvertrag; es ändert noch nichts an Besitz und Eigentum." },
      { term: "Erfüllungsgeschäft", text: "Das Geschäft, mit dem eine Pflicht erfüllt wird, zum Beispiel die Übereignung der Ware oder die Zahlung des Kaufpreises." },
      { term: "Übereignung", text: "Die Übertragung des Eigentums an einer beweglichen Sache durch Einigung und Übergabe (§ 929 BGB)." },
      { term: "Erfüllung", text: "Eine Pflicht ist erfüllt, wenn die geschuldete Leistung erbracht ist; dann erlischt sie (§ 362 BGB)." },
    ],
    law: [
      {
        ref: "§ 929 Satz 1 BGB",
        text: "Das Eigentum an einer beweglichen Sache geht über, wenn der Eigentümer sie dem Erwerber übergibt und beide sich einig sind, dass das Eigentum übergehen soll.",
        url: "https://www.gesetze-im-internet.de/bgb/__929.html",
      },
      {
        ref: "§ 362 Abs. 1 BGB",
        text: "Wird die geschuldete Leistung an den Gläubiger erbracht, erlischt das Schuldverhältnis: Die Pflicht ist erfüllt.",
        url: "https://www.gesetze-im-internet.de/bgb/__362.html",
      },
    ],
    takeaway:
      "Der Kaufvertrag ist nur das Verpflichtungsgeschäft: Er schafft Pflichten. Eigentum und Geld wechseln erst durch die Erfüllungsgeschäfte, nämlich Einigung und Übergabe sowie Zahlung. Das Eigentum geht auch ohne Zahlung über, wenn nichts anderes vereinbart ist.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Was bewirkt der Abschluss eines Kaufvertrags für das Eigentum an der Ware?",
      answer: "Noch nichts: Der Vertrag verpflichtet nur, das Eigentum geht erst durch Einigung und Übergabe über.",
      wrong: [
        "Das Eigentum geht sofort mit dem Vertragsschluss auf den Käufer über.",
        "Das Eigentum geht erst über, wenn der Käufer den Kaufpreis vollständig gezahlt hat.",
      ],
      explanation:
        "Der Vertrag schafft nur Ansprüche. Das Eigentum wechselt durch Einigung und Übergabe (§ 929 BGB). Die Zahlung ist ein eigener Schritt; sie entscheidet nur dann über das Eigentum, wenn ein Eigentumsvorbehalt vereinbart ist.",
    },
    lab: "kaufvertrag",
    labGoals: ["nur-verpflichtung", "eigentum"],
    workshop: {
      kind: "classify",
      title: "Verpflichten oder erfüllen?",
      instruction: "Ordne jeden Vorgang dem passenden Geschäft zu.",
      categories: ["Verpflichtungsgeschäft", "Erfüllungsgeschäft"],
      entries: [
        {
          text: "Nina sagt im Elektromarkt: „Ich nehme das Tablet für 250 Euro“, und der Verkäufer stimmt zu.",
          target: 0,
          feedback: "Mit der Einigung über Ware und Preis entsteht der Kaufvertrag, der Pflichten begründet.",
        },
        {
          text: "Der Verkäufer legt Nina das Tablet in die Hand, beide sind sich einig, dass es jetzt ihr gehören soll.",
          target: 1,
          feedback: "Einigung und Übergabe übertragen das Eigentum und erfüllen die Pflicht des Verkäufers.",
        },
        {
          text: "Nina überweist 250 Euro auf das Konto des Markts.",
          target: 1,
          feedback: "Die Zahlung erfüllt die Pflicht der Käuferin.",
        },
        {
          text: "Zwei Nachbarn vereinbaren, dass der eine dem anderen am Samstag seinen Rasenmäher für 80 Euro verkauft.",
          target: 0,
          feedback: "Die Vereinbarung über den späteren Kauf ist der Vertrag selbst.",
        },
        {
          text: "Am Samstag stellt der Nachbar den Rasenmäher hin und bekommt die 80 Euro in bar.",
          target: 1,
          feedback: "Übergabe und Zahlung erfüllen die Pflichten aus der früheren Vereinbarung.",
        },
      ],
      conclusion: "Der Vertrag verspricht, die Erfüllung hält das Versprechen. Beides sind getrennte Geschäfte.",
    },
    casework: {
      title: "Der Laptop von Frau Roth",
      story:
        "**Samira** kauft von ihrer Nachbarin **Frau Roth** einen gebrauchten Laptop für **200 Euro**. Sie vereinbaren die Übergabe für den nächsten **Samstag**. Es ist Mittwoch: Frau Roth hat den Laptop noch bei sich, und Samira hat noch nichts gezahlt.",
      steps: [
        {
          question: "Wem gehört der Laptop am Mittwoch?",
          options: [
            "Samira, denn der Kaufvertrag ist schon geschlossen.",
            "Frau Roth, denn bisher gibt es nur den Vertrag.",
            "Beiden je zur Hälfte, bis die Zahlung erfolgt ist.",
          ],
          answer: 1,
          explanation: "Der Kaufvertrag verpflichtet nur. Das Eigentum geht erst durch Einigung und Übergabe über.",
        },
        {
          question: "Was hat Samira am Mittwoch bereits?",
          options: [
            "Das Eigentum, aber noch nicht den Besitz.",
            "Nichts, denn ohne Übergabe bindet der Vertrag nicht.",
            "Einen Anspruch darauf, dass Frau Roth ihr den Laptop übergibt und das Eigentum verschafft.",
          ],
          answer: 2,
          explanation: "Aus dem Vertrag folgt der Anspruch aus § 433 Abs. 1 BGB. Er bindet beide Seiten schon jetzt.",
        },
        {
          question: "Was muss am Samstag geschehen, damit Samira Eigentümerin wird?",
          options: [
            "Samira muss zuerst die 200 Euro bezahlen.",
            "Beide müssen den Vertrag schriftlich bestätigen.",
            "Frau Roth übergibt den Laptop, und beide sind sich einig, dass das Eigentum übergeht.",
          ],
          answer: 2,
          explanation: "Das verlangt § 929 BGB. Die Zahlung gehört nicht zu den Voraussetzungen, sie ist ein eigener Schritt.",
        },
        {
          question: "Samira erhält den Laptop am Samstag, vergisst aber zu zahlen. Was gilt?",
          options: [
            "Sie ist Eigentümerin geworden und schuldet Frau Roth weiterhin die 200 Euro.",
            "Sie ist noch nicht Eigentümerin, weil das Eigentum erst mit der Zahlung übergeht.",
            "Der Vertrag ist erloschen, weil sie nicht gezahlt hat.",
          ],
          answer: 0,
          explanation:
            "Das Eigentum ging mit Einigung und Übergabe über. Die Kaufpreisschuld besteht weiter, und Frau Roth kann die Zahlung verlangen. Nur mit einem Eigentumsvorbehalt wäre es anders.",
        },
      ],
      verdict:
        "Bis Samstag hat Samira nur einen Anspruch aus dem Vertrag. Mit Einigung und Übergabe wird sie Eigentümerin, auch ohne Zahlung. Den Kaufpreis von 200 Euro schuldet sie weiter.",
    },
    tasks: {
      1: {
        prompt: "Erkläre den Unterschied zwischen Verpflichtungs- und Erfüllungsgeschäft am Beispiel eines Handykaufs.",
        hints: ["Was schafft der Kaufvertrag: Pflichten oder schon neues Eigentum?", "Was gehört auf Seiten des Verkäufers und des Käufers zur Erfüllung?"],
        model:
          "Beim Handykauf ist der Kaufvertrag das Verpflichtungsgeschäft: Der Verkäufer verspricht, das Handy zu übergeben und das Eigentum zu verschaffen, der Käufer verspricht, den Preis zu zahlen und das Handy abzunehmen. Noch gehört das Handy dem Verkäufer. Erfüllt wird der Vertrag, wenn der Verkäufer das Handy übergibt und beide sich einig sind, dass es jetzt dem Käufer gehört, und wenn der Käufer bezahlt. Erst danach haben beide ihre Pflichten erfüllt.",
        criteria: [
          "Beschreibt den Kaufvertrag als Verpflichtungsgeschäft mit den Pflichten beider Seiten",
          "Beschreibt die Erfüllung durch Einigung, Übergabe und Zahlung",
          "Grenzt beide Schritte klar voneinander ab",
        ],
      },
      2: {
        prompt:
          "Ein Freund bestellt im Laden Sneaker, die erst in drei Wochen eintreffen, und sagt: „Die gehören mir schon, ich habe ja den Vertrag.“ Beurteile die Aussage.",
        hints: ["Was hat der Freund bisher: Eigentum oder einen Anspruch?", "Was muss noch geschehen, damit er Eigentümer wird?"],
        model:
          "Die Aussage stimmt so nicht. Der Vertrag gibt dem Freund nur einen Anspruch darauf, dass der Laden ihm die Sneaker übergibt und das Eigentum verschafft. Bis dahin gehören sie dem Laden, und der Freund hat sie nicht einmal in der Hand. Eigentümer wird er erst, wenn ihm die Sneaker übergeben werden und beide sich über den Eigentumsübergang einig sind. Dass er fest mit den Schuhen rechnen kann, ist die Wirkung des Vertrags, aber noch kein Eigentum.",
        criteria: [
          "Beurteilt die Aussage als falsch oder ungenau und begründet das",
          "Unterscheidet den Anspruch aus dem Vertrag vom Eigentum",
          "Nennt, was für den Eigentumserwerb noch fehlt",
        ],
      },
    },
  },
  {
    id: "ve-leistungsort",
    lb: 4,
    unit: "4.2",
    title: "Leistungsort und Eigentumsvorbehalt",
    intro: "Wo muss der Verkäufer liefern, und wie schützt er sich, wenn der Käufer erst später zahlt? Dafür gibt es klare Regeln.",
    paragraphs: [
      "Der **Leistungsort** ist der Ort, an dem der Schuldner seine Pflicht erfüllen muss. Beim Kauf ist das wichtig, weil dort die Ware zu übergeben ist. Haben Verkäufer und Käufer nichts vereinbart und ergibt sich auch aus den Umständen nichts, gilt: Leistungsort ist der Wohnsitz oder die Niederlassung des Schuldners (§ 269 BGB). Der Verkäufer muss die Ware also bei sich bereithalten, der Käufer muss sie abholen. Das nennt man **Holschuld**. Bei Geld ist es anders: Wer zahlt, muss es im Zweifel auf eigene Gefahr und Kosten dem Empfänger übermitteln (§ 270 BGB). Man spricht von einer Schickschuld, denn der Leistungsort bleibt beim Zahler.",
      "Oft wird etwas anderes vereinbart. Bei einer **Bringschuld** muss der Verkäufer die Ware zum Käufer bringen; der Leistungsort liegt dann beim Käufer, etwa wenn ein Möbelhaus laut Vertrag ins Wohnzimmer liefert. Bei einer **Schickschuld** bleibt der Leistungsort beim Verkäufer, er schickt die Ware aber auf Wunsch des Käufers an einen anderen Ort, etwa per Paket. Allein weil der Verkäufer die Versandkosten trägt, wird aus einer Hol- keine Bringschuld (§ 269 Abs. 3 BGB). Die Gefahr, dass das Paket verloren geht, trägt sonst der Käufer (§ 447 BGB). Kauft aber ein Verbraucher bei einem Unternehmer, trägt in der Regel der Unternehmer dieses Risiko (§ 475 Abs. 2 BGB).",
      "Wer an einen Käufer liefert, der erst später zahlt, geht ein Risiko ein. Beim **Ratenkauf** hat der Käufer die Ware sofort, bezahlt sie aber über Monate. Wäre er schon Eigentümer, bliebe dem Verkäufer bei Zahlungsproblemen nur ein Geldanspruch. Zum Schutz kann er deshalb einen **Eigentumsvorbehalt** vereinbaren: Er bleibt Eigentümer, bis der Kaufpreis vollständig bezahlt ist (§ 449 BGB). Der Käufer hat die Ware und darf sie nutzen, wird aber erst mit der letzten Rate Eigentümer.",
      "Zahlt der Käufer nicht, darf sich der Verkäufer die Ware nicht einfach holen. Er kann sie nur herausverlangen, wenn er vorher vom Vertrag zurückgetreten ist (§ 449 Abs. 2 BGB). Bei einem Ratenkauf mit Finanzierungskosten gelten für Verbraucher zusätzliche Voraussetzungen (§ 508 BGB): etwa mindestens zwei Raten Rückstand und eine erfolglose zweiwöchige Frist. Wer auf Raten kauft, besitzt die Ware, aber sie gehört ihm noch nicht. Verkaufen oder verschenken sollte er sie vorher nicht. Im Modell siehst du das, wenn der Käufer die Ware hat, der Verkäufer aber Eigentümer bleibt.",
    ],
    terms: [
      { term: "Leistungsort", text: "Der Ort, an dem der Schuldner seine Pflicht erfüllen muss; ohne andere Abrede ist es sein Wohnsitz oder Betrieb." },
      { term: "Holschuld", text: "Der Gläubiger muss die Sache beim Schuldner abholen, der Leistungsort liegt beim Schuldner." },
      { term: "Bringschuld", text: "Der Schuldner muss die Sache zum Gläubiger bringen, der Leistungsort liegt beim Gläubiger." },
      { term: "Schickschuld", text: "Der Schuldner muss die Sache auf Verlangen an den Gläubiger versenden, der Leistungsort bleibt aber bei ihm." },
      { term: "Eigentumsvorbehalt", text: "Der Verkäufer bleibt Eigentümer, bis der Kaufpreis vollständig bezahlt ist." },
    ],
    law: [
      {
        ref: "§ 269 BGB",
        text: "Ohne andere Vereinbarung und ohne anderen Hinweis aus den Umständen ist Leistungsort der Wohnsitz oder die Niederlassung des Schuldners. Allein die Übernahme der Versandkosten macht den Zielort nicht zum Leistungsort.",
        url: "https://www.gesetze-im-internet.de/bgb/__269.html",
      },
      {
        ref: "§ 449 BGB",
        text: "Behält sich der Verkäufer das Eigentum bis zur Zahlung vor, geht es im Zweifel erst mit der vollständigen Zahlung über. Ohne Rücktritt vom Vertrag kann er die Sache nicht herausverlangen.",
        url: "https://www.gesetze-im-internet.de/bgb/__449.html",
      },
    ],
    takeaway:
      "Ohne andere Abrede liegt der Leistungsort beim Verkäufer (Holschuld). Liefert er laut Vertrag zum Käufer, ist es eine Bringschuld, versendet er die Ware auf Wunsch, eine Schickschuld. Der Eigentumsvorbehalt schützt den Verkäufer beim Kauf auf Raten, denn er bleibt Eigentümer bis zur vollständigen Zahlung.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Wo ist der Leistungsort beim Kauf, wenn Verkäufer und Käufer nichts zum Lieferort vereinbart haben?",
      answer: "Beim Verkäufer, an seinem Wohnsitz oder in seinem Betrieb; der Käufer muss die Ware abholen.",
      wrong: [
        "Beim Käufer, denn der Verkäufer muss die Ware zu ihm bringen.",
        "Beim Käufer, wenn der Verkäufer die Versandkosten übernommen hat.",
      ],
      explanation:
        "Ohne andere Abrede gilt § 269 BGB: Leistungsort ist der Sitz des Schuldners, hier des Verkäufers (Holschuld). Auch die Übernahme der Versandkosten ändert daran nichts (§ 269 Abs. 3 BGB).",
    },
    lab: "kaufvertrag",
    labGoals: ["vorbehalt"],
    workshop: {
      kind: "classify",
      title: "Hol-, Bring- oder Schickschuld?",
      instruction: "Ordne jeden Fall der passenden Schuldart zu.",
      categories: ["Holschuld", "Bringschuld", "Schickschuld"],
      entries: [
        {
          text: "Marek kauft im Sportgeschäft Fußballschuhe und nimmt sie gleich mit.",
          target: 0,
          feedback: "Der Käufer holt die Ware am Sitz des Verkäufers ab.",
        },
        {
          text: "Ein Möbelhaus liefert laut Vertrag das gekaufte Sofa mit eigenem Lkw ins Wohnzimmer der Käuferin.",
          target: 1,
          feedback: "Der Verkäufer muss die Ware zum Käufer bringen, der Leistungsort liegt dort.",
        },
        {
          text: "Eine Käuferin bestellt Kopfhörer im Internet; der Onlineshop gibt das Paket bei einem Paketdienst auf.",
          target: 2,
          feedback: "Der Verkäufer versendet die Ware auf Wunsch des Käufers, der Leistungsort bleibt bei ihm.",
        },
        {
          text: "Eine Gärtnerei sagt einem Kunden: „Die Blumenerde können Sie ab Montag in unserem Lager abholen.“",
          target: 0,
          feedback: "Abholung ist vereinbart: Der Kunde holt die Ware am Sitz der Gärtnerei ab.",
        },
        {
          text: "Ein Bäcker beliefert laut Vertrag jeden Morgen eine Kantine mit Brötchen.",
          target: 1,
          feedback: "Die Lieferung bis zur Kantine ist vertraglich vereinbart, also eine Bringschuld.",
        },
      ],
      conclusion: "Wer die Ware wohin schaffen muss, zeigt, wo der Leistungsort liegt.",
    },
    casework: {
      title: "Der Fernseher auf Raten",
      story:
        "**Emil** (19) kauft im Elektrogeschäft einen Fernseher, der bar 600 Euro kostet, auf Raten: **zwölf Raten** zu je 55 Euro, also 660 Euro insgesamt. Er nimmt den Fernseher sofort mit. Im Vertrag steht, dass die Ware bis zur vollständigen Bezahlung **Eigentum des Geschäfts** bleibt. Nach fünf Raten stellt Emil die Zahlungen ein.",
      steps: [
        {
          question: "Wer ist nach der Mitnahme Besitzer und wer Eigentümer?",
          options: [
            "Emil ist Besitzer und Eigentümer, weil er den Fernseher mitgenommen hat.",
            "Emil ist Besitzer, das Geschäft bleibt Eigentümer.",
            "Das Geschäft ist Besitzer und Eigentümer, bis alles bezahlt ist.",
          ],
          answer: 1,
          explanation: "Emil hat die tatsächliche Gewalt, also den Besitz. Wegen der Vereinbarung geht das Eigentum erst bei vollständiger Zahlung über.",
        },
        {
          question: "Wie heißt die Vereinbarung im Vertrag, und wozu dient sie?",
          options: [
            "Bringschuld: Sie legt fest, dass das Geschäft den Fernseher ins Haus liefern muss.",
            "Rücktrittsrecht: Sie erlaubt dem Käufer, den Fernseher jederzeit zurückzugeben.",
            "Eigentumsvorbehalt: Er schützt das Geschäft, das die Ware vor der vollständigen Zahlung liefert.",
          ],
          answer: 2,
          explanation:
            "Der Verkäufer liefert zuerst und wartet auf das Geld. Der Eigentumsvorbehalt sichert dieses Risiko: Zahlt Emil nicht, hat das Geschäft mehr als nur eine Geldforderung.",
        },
        {
          question: "Darf das Geschäft den Fernseher sofort bei Emil abholen, weil er nicht mehr zahlt?",
          options: [
            "Ja, denn der Fernseher gehört ihm noch, und der Eigentümer darf sich seine Sache zurückholen.",
            "Nein, es muss zuvor vom Vertrag zurücktreten; bei diesem Ratenkauf gelten dafür besondere Voraussetzungen.",
            "Nein, denn es muss warten, bis alle zwölf Raten fällig sind.",
          ],
          answer: 1,
          explanation:
            "Aufgrund des Eigentumsvorbehalts kann der Verkäufer die Sache nur herausverlangen, wenn er vom Vertrag zurückgetreten ist (§ 449 Abs. 2 BGB). Bei Emils Ratenkauf mit Finanzierungskosten darf er erst zurücktreten, wenn Emil mit mindestens zwei Raten im Rückstand ist und eine zweiwöchige Frist erfolglos blieb (§ 508 BGB). Eigenmächtig nehmen darf er den Fernseher nicht.",
        },
        {
          question: "Wem gehört der Fernseher, wenn Emil alle zwölf Raten bezahlt hat?",
          options: [
            "Weiter dem Geschäft, bis es den Eigentumsvorbehalt ausdrücklich aufhebt.",
            "Emil, denn mit der letzten Zahlung geht das Eigentum auf ihn über.",
            "Dem Geschäft und Emil je zur Hälfte.",
          ],
          answer: 1,
          explanation:
            "Der Eigentumsvorbehalt ist eine Übereignung unter der Bedingung vollständiger Zahlung. Tritt die Bedingung ein, wird Emil automatisch Eigentümer (§ 449 Abs. 1 BGB).",
        },
      ],
      verdict:
        "Emil besitzt den Fernseher, das Geschäft bleibt Eigentümer, bis die letzte Rate bezahlt ist. Nach dem Zahlungsstopp kann das Geschäft den Fernseher erst nach einem Rücktritt zurückverlangen, bei diesem Ratenkauf nur unter den strengeren Voraussetzungen des § 508 BGB. Zahlt Emil alle Raten, gehört er ihm.",
    },
    tasks: {
      1: {
        prompt: "Erkläre die Unterschiede zwischen Holschuld, Bringschuld und Schickschuld und gib zu jeder ein Beispiel aus dem Alltag.",
        hints: ["Wo muss der Verkäufer leisten, wenn nichts anderes vereinbart ist?", "Wer sorgt in den drei Fällen dafür, dass die Ware zum Käufer kommt?"],
        model:
          "Bei der Holschuld liegt der Leistungsort beim Verkäufer, und der Käufer holt die Ware ab, zum Beispiel im Baumarkt. Bei der Bringschuld muss der Verkäufer die Ware zum Käufer bringen, etwa wenn ein Möbelhaus laut Vertrag ins Haus liefert; der Leistungsort liegt dann beim Käufer. Bei der Schickschuld bleibt der Leistungsort beim Verkäufer, aber er versendet die Ware auf Wunsch des Käufers, wie beim Paket aus dem Onlineshop. Ohne Abrede gilt die Holschuld.",
        criteria: [
          "Erklärt die Holschuld mit Beispiel",
          "Erklärt Bringschuld und Schickschuld mit Beispiel und grenzt sie voneinander ab",
          "Nennt, was ohne besondere Vereinbarung gilt",
        ],
      },
      2: {
        prompt:
          "Ein Käufer, der ein Notebook auf Raten mit Eigentumsvorbehalt gekauft hat, sagt: „Ich habe es doch, also gehört es mir, und ich kann es verkaufen.“ Beurteile die Aussage und erkläre, was der Eigentumsvorbehalt dem Verkäufer und was er dem Käufer bringt.",
        hints: ["Wer ist Besitzer und wer Eigentümer, solange nicht alle Raten gezahlt sind?", "Welches Risiko deckt der Eigentumsvorbehalt für den Verkäufer ab?"],
        model:
          "Die Aussage stimmt nicht. Der Käufer hat das Notebook und ist damit Besitzer, aber wegen des Eigentumsvorbehalts bleibt der Verkäufer Eigentümer, bis die letzte Rate bezahlt ist. Der Käufer darf es nutzen, sollte es aber nicht verkaufen oder verschenken, denn er ist noch nicht Eigentümer. Der Verkäufer ist durch den Vorbehalt geschützt, falls der Käufer nicht zahlt: Er kann nach einem Rücktritt die Ware zurückverlangen. Der Käufer gewinnt dafür den Vorteil, das Gerät sofort zu nutzen und über Monate zu zahlen.",
        criteria: [
          "Beurteilt die Aussage und trennt dabei Besitz und Eigentum",
          "Erklärt den Schutz des Verkäufers durch den Vorbehalt",
          "Nennt einen Vorteil oder eine Folge für den Käufer",
        ],
      },
    },
  },
  {
    id: "ve-verzug",
    lb: 4,
    unit: "4.2",
    title: "Zahlungs- und Lieferungsverzug",
    intro: "Wer pünktlich zahlen oder liefern muss und es nicht tut, kommt unter Umständen in Verzug. Das hat Folgen für beide Seiten.",
    paragraphs: [
      "Ein Kaufvertrag verpflichtet beide Seiten, zur richtigen Zeit zu leisten. Zahlt der Käufer nicht rechtzeitig, spricht man von **Zahlungsverzug**; liefert der Verkäufer nicht rechtzeitig, von **Lieferungsverzug**. Nicht jede Verspätung ist aber gleich Verzug. Das Gesetz knüpft an drei Voraussetzungen an, die zusammen vorliegen müssen (§ 286 BGB). Verzug ist wichtig, weil er dem anderen Teil besondere Rechte gibt und weil er auch dich als Verbraucher treffen kann.",
      "Erstens muss die Leistung **fällig** sein: Der Zeitpunkt, ab dem man sie verlangen darf, ist erreicht. Zweitens braucht es meist eine **Mahnung**, also die Aufforderung, jetzt zu leisten. Sie entfällt, wenn ein fester Kalendertermin vereinbart ist („zahlbar bis 15. März“), wenn jemand die Leistung ernsthaft und endgültig verweigert oder aus besonderen Gründen. Ein Verbraucher kommt spätestens 30 Tage nach Fälligkeit und Zugang der Rechnung in Verzug, wenn die Rechnung auf diese Folge besonders hinweist. Drittens muss man die Verspätung **zu vertreten** haben: Bleibt die Lieferung aus, weil ein Unwetter alle Straßen sperrt, trifft den Verkäufer keine Schuld. Geldmangel entschuldigt dagegen grundsätzlich nicht.",
      "Gerät jemand in Verzug, hat der andere mehrere Rechte. Er kann **Verzugszinsen** auf eine Geldschuld verlangen und den **Schaden** ersetzt bekommen, den die Verspätung verursacht hat, etwa Mahnkosten oder einen Mietwagen, den man wegen der späten Lieferung braucht. Außerdem kann er dem Schuldner eine **angemessene Frist** setzen. Verstreicht sie ohne Leistung, darf er vom Vertrag **zurücktreten**, auch ohne dass Verzug vorliegt (§ 323 BGB): Beide geben dann zurück, was sie erhalten haben. Auf Wunsch kann er stattdessen Schadensersatz statt der Leistung verlangen, zum Beispiel die Mehrkosten eines Ersatzkaufs (§ 281 BGB). Nur in Ausnahmefällen, etwa bei ernsthafter und endgültiger Weigerung, ist die Frist unnötig.",
      "Ist ein Verbraucher beteiligt, beträgt der Verzugszinssatz fünf Prozentpunkte über dem **Basiszinssatz** (§ 288 Abs. 1 BGB). Der Basiszinssatz ändert sich regelmäßig, die Bundesbank gibt ihn bekannt (§ 247 BGB). Deshalb rechnet man in Aufgaben mit einem angenommenen Wert. Das Gesetz nennt den Zinssatz nur „für das Jahr“; in Aufgaben gilt als Konvention das Zinsjahr mit 360 Tagen: Forderung mal Zinssatz mal Tage, geteilt durch 360. Ein Beispiel mit angenommenen Zahlen: 600 Euro, Zinssatz 7 %, 90 Tage Verzug ergeben 600 · 7 % · 90 : 360 = 10,50 Euro. Pünktlich zu zahlen und Rechnungen und Mahnungen ernst zu nehmen, spart also Kosten und Ärger.",
    ],
    terms: [
      { term: "Fälligkeit", text: "Der Zeitpunkt, ab dem der Gläubiger eine Leistung verlangen kann." },
      { term: "Mahnung", text: "Die Aufforderung des Gläubigers an den Schuldner, die fällige Leistung jetzt zu erbringen." },
      { term: "Verzug", text: "Der Schuldner leistet trotz Fälligkeit nicht rechtzeitig und hat das zu vertreten; meist muss der Gläubiger vorher gemahnt haben." },
      { term: "Verzugszinsen", text: "Zinsen, die der Schuldner einer Geldforderung für die Dauer des Verzugs zahlen muss." },
      { term: "Rücktritt", text: "Der Gläubiger löst den Vertrag auf; beide geben zurück, was sie empfangen haben." },
    ],
    law: [
      {
        ref: "§ 286 BGB",
        text: "Ein Schuldner kommt in Verzug, wenn er eine fällige Leistung trotz Mahnung nicht erbringt. Ohne Mahnung genügt zum Beispiel ein fester Kalendertermin. Verzug setzt außerdem voraus, dass der Schuldner die Verspätung zu vertreten hat.",
        url: "https://www.gesetze-im-internet.de/bgb/__286.html",
      },
      {
        ref: "§§ 288 und 323 BGB",
        text: "Eine Geldschuld ist im Verzug zu verzinsen; ist ein Verbraucher beteiligt, liegt der Zinssatz fünf Prozentpunkte über dem Basiszinssatz. Der Gläubiger kann nach erfolgloser Fristsetzung vom Vertrag zurücktreten.",
        url: "https://www.gesetze-im-internet.de/bgb/__288.html",
      },
    ],
    takeaway:
      "Wer eine fällige Leistung trotz Mahnung oder trotz fester Terminabrede schuldhaft nicht erbringt, kommt in Verzug. Der andere Teil kann Verzugszinsen und Schadensersatz verlangen und nach erfolgloser Fristsetzung vom Vertrag zurücktreten.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Wie kann ein Käufer vom Kaufvertrag zurücktreten, wenn der Verkäufer die fällige Lieferung nicht erbringt?",
      answer: "Er setzt dem Verkäufer eine angemessene Frist; liefert dieser bis dahin nicht, kann er zurücktreten.",
      wrong: [
        "Er kann sofort zurücktreten, denn schon ein Tag Verspätung beendet jeden Kaufvertrag.",
        "Er muss warten, bis ein Gericht den Verzug des Verkäufers festgestellt hat.",
      ],
      explanation:
        "Das Gesetz verlangt vor dem Rücktritt in der Regel eine angemessene Fristsetzung (§ 323 BGB). Ein Gerichtsurteil ist nicht nötig, und eine kurze Verspätung allein genügt nicht.",
    },
    practice: "verzugszins",
    workshop: {
      kind: "timeline",
      title: "Vom Zahlungsverzug zum Rücktritt",
      instruction: "Bringe die Schritte in die richtige Reihenfolge. Ein fester Zahlungstermin wurde nicht vereinbart, und die Rechnung enthält keinen Hinweis auf die 30-Tage-Frist. Mahnung und Fristsetzung werden hier der Übersicht halber getrennt dargestellt.",
      categories: [],
      entries: [
        {
          text: "Der Kaufpreis wird fällig, aber der Käufer überweist ihn nicht.",
          target: 0,
          feedback: "Die Fälligkeit ist der Ausgangspunkt: Erst wenn man eine Leistung verlangen kann, kann man in Verzug geraten.",
        },
        {
          text: "Der Verkäufer mahnt den Käufer und fordert ihn zur Zahlung auf.",
          target: 1,
          feedback: "Ohne festen Kalendertermin und ohne die 30-Tage-Regel braucht es nach der Fälligkeit eine Mahnung.",
        },
        {
          text: "Der Käufer zahlt trotz Mahnung nicht und kommt dadurch in Verzug; es laufen Verzugszinsen.",
          target: 2,
          feedback: "Jetzt liegen Fälligkeit, Mahnung und Verschulden vor, deshalb tritt der Verzug ein.",
        },
        {
          text: "Der Verkäufer setzt dem Käufer eine angemessene Frist zur Zahlung.",
          target: 3,
          feedback: "Für den Rücktritt muss er dem Käufer noch eine letzte Gelegenheit geben; Verzug ist dafür nicht Voraussetzung (§ 323 BGB).",
        },
        {
          text: "Die Frist läuft erfolglos ab; der Verkäufer kann zurücktreten oder Schadensersatz statt der Leistung verlangen.",
          target: 4,
          feedback: "Erst nach der erfolglosen Frist stehen diese weitergehenden Rechte offen.",
        },
      ],
      conclusion: "Zwischen Fälligkeit und Rücktritt liegen Mahnung, Verzug und Fristsetzung, und jeder Schritt hat seine Voraussetzung.",
    },
    casework: {
      title: "Die Kamera kommt nicht",
      story:
        "**Paula** bestellt in einem Fachgeschäft eine Kamera für **400 Euro** und zahlt **100 Euro** an. Verkäufer **Herr Kaya** schreibt in den Vertrag: „Lieferung bis zum **10. Juli**.“ Am 12. Juli ist die Kamera nicht da, und Herr Kaya meldet sich nicht.",
      steps: [
        {
          question: "Ist Herr Kaya in Lieferungsverzug?",
          options: [
            "Nein, erst nach einer schriftlichen Mahnung, denn ohne Mahnung gibt es nie Verzug.",
            "Nein, denn Verzug gibt es nur beim Zahlen, nicht beim Liefern.",
            "Ja, denn die Lieferung war für einen festen Kalendertermin vereinbart, eine Mahnung ist dann nicht nötig.",
          ],
          answer: 2,
          explanation:
            "Bei einem Termin nach dem Kalender entfällt die Mahnung (§ 286 Abs. 2 Nr. 1 BGB). Verzug gibt es bei jeder fälligen Leistung, auch bei der Lieferung. Voraussetzung bleibt, dass Herr Kaya die Verspätung zu vertreten hat; dagegen spricht hier nichts.",
        },
        {
          question: "Was sollte Paula tun, wenn sie vom Vertrag zurücktreten möchte?",
          options: [
            "Herrn Kaya eine angemessene Frist zur Lieferung setzen.",
            "Sofort zurücktreten, denn Verzug berechtigt immer zum sofortigen Rücktritt.",
            "Die restlichen 300 Euro zahlen, um ihn zur Lieferung zu bewegen.",
          ],
          answer: 0,
          explanation: "Für den Rücktritt braucht Paula grundsätzlich eine Fristsetzung (§ 323 Abs. 1 BGB). Eine weitere Zahlung ist dafür nicht Voraussetzung.",
        },
        {
          question: "Herr Kaya liefert auch innerhalb der gesetzten Frist nicht. Welche Rechte hat Paula nun?",
          options: [
            "Sie kann nur eine weitere Frist setzen; ein Rücktritt ist nie möglich.",
            "Sie kann den Preis um die Hälfte mindern, denn Minderung gilt auch bei Verspätung.",
            "Sie kann vom Vertrag zurücktreten und, wenn ein Schaden entstanden ist, Schadensersatz verlangen.",
          ],
          answer: 2,
          explanation:
            "Nach erfolglosem Ablauf der Frist darf sie zurücktreten (§ 323 BGB). Schadensersatz kommt hinzu, wenn Herr Kaya die Verspätung zu vertreten hat. Eine Minderung kennt das Gesetz nur bei Mängeln.",
        },
        {
          question: "Paula tritt zurück. Was geschieht mit ihrer Anzahlung von 100 Euro?",
          options: [
            "Herr Kaya darf sie als Strafe behalten, weil er sich den Termin freigehalten hat.",
            "Herr Kaya muss sie zurückzahlen, denn nach dem Rücktritt wird alles zurückgegeben.",
            "Sie wird auf eine spätere Bestellung angerechnet, ob Paula das will oder nicht.",
          ],
          answer: 1,
          explanation:
            "Nach dem Rücktritt sind die empfangenen Leistungen zurückzugewähren (§ 346 Abs. 1 BGB). Eine Strafe sieht das Gesetz dafür nicht vor.",
        },
      ],
      verdict:
        "Herr Kaya ist in Lieferungsverzug. Paula kann ihm eine Frist setzen und nach deren erfolglosem Ablauf zurücktreten. Die Anzahlung von 100 Euro bekommt sie zurück, und einen Schaden, den er zu vertreten hat, muss er ersetzen.",
    },
    tasks: {
      1: {
        prompt: "Erkläre, unter welchen Voraussetzungen ein Käufer in Zahlungsverzug gerät, und nenne zwei Rechte, die der Verkäufer dann hat.",
        hints: ["Wann ist die Zahlung fällig, und wann braucht es eine Mahnung?", "Was kostet den Käufer die Verspätung zusätzlich, und was kann der Verkäufer am Ende tun?"],
        model:
          "Ein Käufer gerät in Zahlungsverzug, wenn der Kaufpreis fällig ist, er trotz Mahnung nicht zahlt und die Verspätung zu vertreten hat. Die Mahnung entfällt zum Beispiel bei einem festen Zahlungstermin im Kalender. Der Verkäufer kann dann Verzugszinsen verlangen und den Schaden ersetzt bekommen, etwa seine Mahnkosten. Setzt er außerdem eine angemessene Frist und der Käufer zahlt wieder nicht, darf er vom Vertrag zurücktreten.",
        criteria: [
          "Nennt Fälligkeit, Mahnung und Verschulden als Voraussetzungen",
          "Nennt zwei Rechte des Verkäufers",
          "Erklärt, wann ein Rücktritt möglich wird",
        ],
      },
      2: {
        prompt:
          "Ein Freund meint: „Eine Mahnung ist nur ein nettes Erinnerungsschreiben. Wenn ich später zahle, passiert nichts.“ Beurteile die Aussage und nenne zwei Regeln, die du als Verbraucher beachten würdest.",
        hints: ["Was löst eine Mahnung rechtlich aus, wenn die Zahlung fällig ist?", "Wie kannst du verhindern, dass du in Verzug gerätst?"],
        model:
          "Die Aussage ist falsch. Mit der Mahnung nach der Fälligkeit gerät der Schuldner in Verzug, wenn er nicht zahlt. Dann muss er Verzugszinsen zahlen und den Schaden ersetzen und riskiert, dass der Verkäufer nach einer Frist zurücktritt. Als Verbraucher würde ich Zahlungstermine im Kalender notieren und Rechnungen sofort lesen. Kann ich nicht zahlen, würde ich früh mit dem Verkäufer sprechen, statt Mahnungen zu ignorieren.",
        criteria: [
          "Beurteilt die Aussage und erklärt die Wirkung einer Mahnung",
          "Nennt mindestens zwei Folgen des Verzugs",
          "Formuliert zwei Handlungsregeln für Verbraucher",
        ],
      },
    },
  },
  {
    id: "ve-sachmangel",
    lb: 4,
    unit: "4.2",
    title: "Sachmängel beim Kauf",
    intro: "Die Ware ist defekt oder weicht ab: Welche Rechte hat ein Käufer, in welcher Reihenfolge, und wie lange?",
    paragraphs: [
      "Eine Sache hat einen **Sachmangel**, wenn sie bei der Übergabe (rechtlich: beim Gefahrübergang) nicht so ist, wie sie sein soll (§ 434 BGB). Maßstab ist erstens, was vereinbart wurde: die Beschaffenheit, die vorausgesetzte Verwendung und das vereinbarte Zubehör samt Anleitung. Zweitens muss die Sache üblichen Anforderungen genügen: Sie muss sich für die gewöhnliche Verwendung eignen und so beschaffen sein, wie man es bei Sachen dieser Art erwarten kann, auch nach der Werbung. Auch die Lieferung einer ganz anderen Sache ist ein Mangel. Beispiel: Ein neues Headset gibt auf dem rechten Ohr keinen Ton von sich.",
      "Bei einem Mangel stehen dem Käufer mehrere Rechte zu (§ 437 BGB), aber nicht frei wählbar. Zuerst verlangt er **Nacherfüllung**: Er darf grundsätzlich wählen, ob der Mangel beseitigt oder eine mangelfreie Sache geliefert wird, außer die gewählte Art wäre unverhältnismäßig teuer; die Kosten trägt der Verkäufer. Erst wenn das nicht klappt, kommen **Rücktritt** oder **Minderung** infrage: wenn der Verkäufer verweigert, eine gesetzte Frist ergebnislos verstreicht oder die Reparatur scheitert. Beim Kauf vom Unternehmer genügt ein gescheiterter Versuch (§ 475d BGB), sonst gilt die Reparatur nach dem erfolglosen zweiten Versuch als fehlgeschlagen (§ 440 BGB). **Schadensersatz** gibt es zusätzlich, wenn der Verkäufer den Mangel zu vertreten hat.",
      "Mängelansprüche **verjähren** bei neuen Sachen in zwei Jahren ab Ablieferung (§ 438 BGB); eine Nachbesserung kann die Frist beim Kauf vom Unternehmer einmalig um zwölf Monate verlängern (§ 475e BGB). Bei gebrauchten Sachen darf der Händler sie nur unter strengen Bedingungen auf ein Jahr verkürzen (§ 476 Abs. 2 BGB). Wichtig ist auch der Beweis: Kauft ein Verbraucher bei einem Unternehmer (**Verbrauchsgüterkauf**) und zeigt sich der Mangel innerhalb eines Jahres seit der Übergabe, wird vermutet, dass die Sache schon bei der Übergabe mangelhaft war (§ 477 BGB). Das ist die **Beweislastumkehr**: Der Händler müsste das Gegenteil beweisen. Danach muss der Käufer beweisen, dass der Mangel von Anfang an bestand.",
      "Davon zu unterscheiden ist die **Garantie**. Die gesetzliche **Gewährleistung** (das BGB nennt sie Mängelhaftung) trifft den Verkäufer, entsteht kraft Gesetzes und kostet nichts; sie darf vor einer Mängelmitteilung grundsätzlich nicht zum Nachteil des Verbrauchers ausgeschlossen werden (§ 476 BGB). Eine Garantie ist dagegen ein freiwilliges Zusatzversprechen, oft vom Hersteller („fünf Jahre auf den Motor“), und gilt zu den Bedingungen, die der Garantiegeber nennt (§ 443 BGB). Sie nimmt dir die gesetzlichen Rechte nicht weg, sondern kommt dazu. Wende dich bei Mängeln zuerst an den Verkäufer und bewahre den Kaufbeleg auf.",
    ],
    terms: [
      { term: "Sachmangel", text: "Die Sache entspricht bei der Übergabe nicht dem Vereinbarten oder dem Üblichen, etwa weil sie defekt ist oder abweicht." },
      { term: "Nacherfüllung", text: "Der Verkäufer beseitigt den Mangel oder liefert eine mangelfreie Sache, grundsätzlich nach Wahl des Käufers." },
      { term: "Gewährleistung", text: "Die gesetzliche Haftung des Verkäufers für Mängel (im BGB Mängelhaftung genannt), die ohne besondere Vereinbarung gilt." },
      { term: "Garantie", text: "Ein freiwilliges Zusatzversprechen, oft vom Hersteller, das neben die gesetzlichen Rechte tritt." },
      { term: "Beweislastumkehr", text: "Beim Verbrauchsgüterkauf wird innerhalb eines Jahres vermutet, dass der Mangel schon bei der Übergabe bestand." },
    ],
    law: [
      {
        ref: "§ 437 BGB",
        text: "Ist die Sache mangelhaft, kann der Käufer Nacherfüllung verlangen, vom Vertrag zurücktreten oder den Preis mindern und unter weiteren Voraussetzungen Schadensersatz verlangen.",
        url: "https://www.gesetze-im-internet.de/bgb/__437.html",
      },
      {
        ref: "§ 477 BGB",
        text: "Zeigt sich bei einem Verbrauchsgüterkauf innerhalb eines Jahres seit der Übergabe ein Mangel, wird vermutet, dass die Sache schon bei der Übergabe mangelhaft war. Bei lebenden Tieren gilt dafür eine Frist von sechs Monaten.",
        url: "https://www.gesetze-im-internet.de/bgb/__477.html",
      },
    ],
    takeaway:
      "Bei einem Sachmangel verlangt der Käufer zuerst Nacherfüllung; erst danach kommen Rücktritt oder Minderung und gegebenenfalls Schadensersatz in Betracht. Die Ansprüche verjähren bei neuen Sachen nach zwei Jahren, und beim Verbrauchsgüterkauf wird im ersten Jahr vermutet, dass der Mangel schon bei der Übergabe bestand.",
    sourceIds: ["lp", "bgb"],
    quiz: {
      question: "Das neue Headset eines Kunden hat einen Defekt. Was verlangt er nach dem Gesetz in der Regel zuerst vom Verkäufer?",
      answer: "Nacherfüllung: Reparatur oder Lieferung eines mangelfreien Headsets, grundsätzlich nach seiner Wahl.",
      wrong: [
        "Rücktritt: Er gibt das Headset zurück und bekommt sofort den vollen Kaufpreis.",
        "Minderung: Er behält das Headset und kürzt den Kaufpreis selbst nach Schätzung.",
      ],
      explanation:
        "Die Nacherfüllung hat Vorrang: Der Verkäufer soll den Mangel zunächst beheben dürfen. Rücktritt und Minderung sind erst möglich, wenn das fehlschlägt, verweigert wird oder eine Frist ergebnislos verstreicht.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Recht passt zum Fall?",
      instruction: "Ordne jeden Fall dem Recht des Käufers zu, das ihm am besten hilft.",
      categories: ["Nacherfüllung", "Rücktritt", "Minderung", "Schadensersatz"],
      entries: [
        {
          text: "Bei einem neuen Fahrrad ist die Gabel verbogen. Die Käuferin möchte, dass der Händler sie austauscht.",
          target: 0,
          feedback: "Sie verlangt zuerst, dass der Mangel beseitigt wird: Nacherfüllung.",
        },
        {
          text: "Der Händler hat die Waschmaschine schon zweimal erfolglos repariert; der Käufer will sie zurückgeben und sein Geld zurückhaben.",
          target: 1,
          feedback: "Die Nachbesserung ist fehlgeschlagen, daher ist der Rücktritt möglich. Beim Kauf vom Unternehmer genügt dafür schon ein gescheiterter Versuch, sonst zwei.",
        },
        {
          text: "Eine Jacke hat am Ärmel einen kleinen Farbfehler. Die Käuferin will sie behalten, aber weniger zahlen.",
          target: 2,
          feedback: "Sie behält die Sache und kürzt den Preis: Minderung.",
        },
        {
          text: "Der Händler wusste, dass das Ladekabel fehlerhaft ist, und verkaufte es trotzdem; es beschädigt eine Steckdosenleiste, die der Käufer ersetzt haben möchte.",
          target: 3,
          feedback: "Hier ist ein Schaden entstanden, den der Verkäufer zu vertreten hat: Schadensersatz.",
        },
        {
          text: "Der rechte Lautsprecher eines neuen Headsets bleibt stumm. Der Käufer möchte ein Ersatzgerät.",
          target: 0,
          feedback: "Die Lieferung einer mangelfreien Sache ist die zweite Form der Nacherfüllung.",
        },
      ],
      conclusion: "Zuerst kommt die Nacherfüllung; Rücktritt und Minderung folgen, wenn sie scheitert, und Schadensersatz tritt bei Verschulden hinzu.",
    },
    casework: {
      title: "Der Laptop mit dem schwarzen Bildschirm",
      story:
        "**Mert** kauft im März in einem Elektromarkt einen neuen Laptop für 700 Euro. Im **Dezember**, neun Monate später, bleibt der Bildschirm schwarz. Der Markt behauptet, Mert habe das Gerät falsch bedient und solle das Gegenteil beweisen. **Zwei Reparaturversuche** des Marktes scheitern.",
      steps: [
        {
          question: "Wer muss beweisen, ob der Mangel schon bei der Übergabe vorlag?",
          options: [
            "Mert, denn der Käufer muss immer beweisen, dass die Ware schon beim Kauf mangelhaft war.",
            "Niemand, denn nach sechs Monaten gilt ein Defekt nicht mehr als Mangel.",
            "Der Markt, denn bei einem Kauf vom Unternehmer wird im ersten Jahr vermutet, dass der Mangel schon bei der Übergabe bestand.",
          ],
          answer: 2,
          explanation:
            "Beim Verbrauchsgüterkauf gilt die Beweislastumkehr für ein Jahr ab Übergabe (§ 477 BGB). Die frühere Frist von sechs Monaten gilt nur noch bei lebenden Tieren.",
        },
        {
          question: "Was kann Mert vom Markt zunächst verlangen?",
          options: [
            "Rücktritt: sofort das Geld zurück.",
            "Nacherfüllung: Reparatur oder ein mangelfreies Ersatzgerät, wie er es wählt.",
            "Minderung: sofort 200 Euro Preisnachlass.",
          ],
          answer: 1,
          explanation: "Die Nacherfüllung hat Vorrang. Mert darf grundsätzlich wählen, ob repariert oder ersetzt wird; der Markt trägt die Kosten (§ 439 BGB).",
        },
        {
          question: "Zwei Reparaturversuche sind gescheitert. Was kann Mert jetzt?",
          options: [
            "Nur weiter auf Reparatur warten, denn jeder Versuch zählt als neue Chance.",
            "Gar nichts mehr, weil er der Reparatur zugestimmt hat.",
            "Vom Vertrag zurücktreten oder den Preis mindern, denn die Nachbesserung gilt als fehlgeschlagen.",
          ],
          answer: 2,
          explanation: "Beim Kauf vom Unternehmer genügt schon ein gescheiterter Reparaturversuch, damit Mert ohne weitere Frist zurücktreten oder mindern darf (§ 475d BGB). Hier sind es sogar zwei.",
        },
        {
          question: "Wie lange verjähren Merts Mängelansprüche?",
          options: [
            "Ein Jahr ab Ablieferung, so lange wie die Beweislastumkehr.",
            "Grundsätzlich zwei Jahre ab Ablieferung des Laptops.",
            "Sechs Monate ab Ablieferung, danach ist jeder Anspruch verjährt.",
          ],
          answer: 1,
          explanation: "Bei neuen Sachen verjähren Mängelansprüche in zwei Jahren ab Ablieferung (§ 438 BGB); eine Nachbesserung kann die Frist einmalig um zwölf Monate verlängern (§ 475e BGB). Die Beweislastumkehr betrifft nur den Beweis, nicht die Verjährung.",
        },
      ],
      verdict:
        "Mert muss den Mangel nicht beweisen: Im ersten Jahr wird vermutet, dass er schon bei der Übergabe bestand. Er verlangt zuerst Nacherfüllung; scheitert die Reparatur, kann er zurücktreten oder mindern. Seine Ansprüche verjähren grundsätzlich erst nach zwei Jahren ab Ablieferung.",
    },
    tasks: {
      1: {
        prompt: "Erkläre die Reihenfolge der Rechte eines Käufers bei einem Sachmangel und nenne, wann Rücktritt oder Minderung erst möglich sind.",
        hints: ["Was verlangt der Käufer zuerst, und wer wählt die Art?", "Wann gilt die Reparatur als fehlgeschlagen, und was folgt dann?"],
        model:
          "Zuerst verlangt der Käufer Nacherfüllung vom Verkäufer: Er wählt grundsätzlich, ob der Mangel beseitigt oder eine neue Sache geliefert wird, und der Verkäufer trägt die Kosten. Erst wenn der Verkäufer das verweigert, eine gesetzte Frist ergebnislos abläuft oder die Reparatur scheitert (beim Kauf vom Unternehmer schon nach einem Versuch, sonst nach dem zweiten), darf der Käufer zurücktreten oder den Preis mindern. Schadensersatz kommt hinzu, wenn der Verkäufer den Mangel zu vertreten hat.",
        criteria: [
          "Nennt die Nacherfüllung als erstes Recht",
          "Nennt Rücktritt und Minderung als nachrangig mit mindestens einer Voraussetzung",
          "Nennt den Schadensersatz als zusätzliches Recht bei Verschulden",
        ],
      },
      2: {
        prompt:
          "Ein Hersteller wirbt: „Fünf Jahre Garantie auf unseren Fernseher.“ Nach zweieinhalb Jahren fällt das Gerät aus. Erkläre den Unterschied zwischen gesetzlicher Gewährleistung und Garantie und beurteile, was der Käufer jetzt tun kann.",
        hints: [
          "Wer schuldet die Gewährleistung, wer die Garantie, und wie lange läuft die gesetzliche Frist?",
          "Was steht in den Garantiebedingungen, und an wen wendet sich der Käufer?",
        ],
        model:
          "Die gesetzliche Gewährleistung schuldet der Verkäufer von Gesetzes wegen. Bei neuen Sachen läuft sie zwei Jahre ab Ablieferung und ist hier schon abgelaufen. Die Garantie ist ein freiwilliges Zusatzversprechen des Herstellers und gilt nur zu seinen Bedingungen. Weil die Garantie fünf Jahre dauert, kann der Käufer sich jetzt an den Hersteller wenden und die Garantiebedingungen prüfen, etwa ob Reparatur oder Ersatz versprochen sind. Den Kaufbeleg und die Garantieerklärung sollte er bereithalten.",
        criteria: [
          "Erklärt die Gewährleistung als gesetzliche Pflicht des Verkäufers",
          "Erklärt die Garantie als freiwilliges Zusatzversprechen mit eigenen Bedingungen",
          "Beurteilt, an wen sich der Käufer in diesem Fall wenden kann",
        ],
      },
    },
  },
];
