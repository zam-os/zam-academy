import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 3: Ägypten – eine frühe Hochkultur. */
export const egypt: Lesson[] = [
  {
    id: "g6-nil",
    lb: 3,
    title: "Der Nil: Lebensader Ägyptens",
    period: "Altes Ägypten · ab etwa 3000 v. Chr.",
    span: [-3000, -30],
    intro:
      "Links und rechts Wüste, in der Mitte ein schmaler grüner Streifen: Ohne den Nil gäbe es kein altes Ägypten.",
    paragraphs: [
      "Ägypten liegt im Nordosten Afrikas. Es regnet dort fast nie, rechts und links des Nils erstreckt sich Wüste. Die Ägypter nannten ihr Land Kemet, „das schwarze Land“, nach dem dunklen, fruchtbaren Boden am Fluss. Die Wüste hieß Deschret, „das rote Land“. Der griechische Geschichtsschreiber Herodot nannte Ägypten später ein „Geschenk des Nils“.",
      "Jedes Jahr ab etwa Juli schwoll der Nil an, weil in den Bergen Äthiopiens heftige Regenfälle niedergingen. Das Wasser überflutete die Felder bis etwa Oktober und hinterließ fruchtbaren Schlamm. Die Ägypter teilten das Jahr in drei Jahreszeiten: Achet, die Zeit der Überschwemmung, Peret, die Zeit der Aussaat und des Wachstums, und Schemu, die Zeit der Ernte. Mit Nilometern, Treppen mit Markierungen am Ufer, maßen sie, wie hoch das Wasser stieg. Daraus schätzten sie die Ernte und die Abgaben.",
      "Kam zu wenig Wasser, drohten Hunger und Not; kam zu viel, zerstörte es Dörfer. Damit alle Felder Wasser bekamen, mussten Dämme, Kanäle und Speicher gebaut und gepflegt werden. Das gelang nur, wenn viele Menschen zusammenarbeiteten und jemand die Arbeit plante. Der Nil war außerdem die wichtigste Verkehrsstraße: Boote trieben mit der Strömung nach Norden und segelten mit dem Wind nach Süden. Weil der Nil von Süden nach Norden fließt, liegt Oberägypten im Süden und Unterägypten mit dem Delta im Norden.",
    ],
    takeaway:
      "Die jährliche Nilschwemme brachte Wasser und fruchtbaren Schlamm. Bewässerung, Vorräte und Verkehr am Nil verlangten Planung und Zusammenarbeit.",
    sourceIds: ["pw-alltag-aegypten", "smaek"],
    quiz: check(
      "Warum nannte Herodot Ägypten ein „Geschenk des Nils“?",
      "Die Nilschwemme brachte Wasser und fruchtbaren Schlamm.",
      ["Der Nil spülte Gold aus den Bergen ins Land.", "Der Nil schützte das Land vor allen Feinden."],
      [
        "Gold kam aus Bergwerken in der Wüste, nicht mit der Flut.",
        "Die Flut war ein Naturereignis für die Landwirtschaft, kein Schutz vor Feinden.",
      ],
      "Ohne Regen hing jede Ernte vom Nil ab. Der Schlamm düngte die Felder Jahr für Jahr neu.",
    ),
    diagram: {
      kind: "steps",
      title: "Das Jahr am Nil",
      steps: [
        { label: "Achet", note: "Überschwemmung, etwa Juli bis Oktober" },
        { label: "Peret", note: "Aussaat und Wachstum im fruchtbaren Schlamm" },
        { label: "Schemu", note: "Ernte und Trockenzeit, Abgaben an den Staat" },
      ],
      repeats: true,
      caption:
        "Der Kreislauf wiederholte sich jedes Jahr. Nach ihm richteten sich Arbeit, Kalender und Abgaben.",
    },
    workshop: classify(
      "Was geschieht in welcher Jahreszeit?",
      ["Achet: Überschwemmung", "Peret: Aussaat und Wachstum", "Schemu: Ernte"],
      [
        [
          "Die Felder stehen unter Wasser; viele Bauern arbeiten auf Großbaustellen.",
          0,
          "Während der Flut ruhte die Feldarbeit, die Arbeitskraft wurde anders genutzt.",
        ],
        [
          "Bauern streuen Saatgut in den feuchten Schlamm und treiben Schafe darüber.",
          1,
          "Die Tiere drückten die Körner in den weichen Boden.",
        ],
        [
          "Schreiber zählen die Getreidesäcke und notieren die Abgaben.",
          2,
          "Nach der Ernte wurde gemessen, wie viel an den Staat ging.",
        ],
        [
          "Kanäle leiten Wasser zu den Feldern, die das Getreide zum Wachsen brauchen.",
          1,
          "Auch nach der Flut wurde gezielt bewässert.",
        ],
        [
          "Mit Sicheln wird das reife Getreide geschnitten.",
          2,
          "Die Ernte fiel in die trockene Jahreszeit.",
        ],
      ],
      "Der Rhythmus des Nils bestimmte, wann gearbeitet, gesät, geerntet und abgerechnet wurde.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum ohne den Nil im alten Ägypten keine Hochkultur entstanden wäre.",
        ["Wie sieht das Land neben dem Fluss aus?", "Was brachte die jährliche Flut?"],
        "Ägypten ist größtenteils Wüste, und es regnet kaum. Nur am Nil können Menschen Felder anlegen, weil der Fluss jedes Jahr über die Ufer tritt und fruchtbaren Schlamm hinterlässt. Ohne den Nil hätte es dort keine Landwirtschaft, keine Vorräte und keine Hochkultur gegeben. Deshalb verdankt Ägypten sein Leben dem Fluss.",
        ["Wüste und fehlender Regen genannt", "Wirkung der Nilschwemme erklärt", "Folge für das Land gezogen"],
      ),
      2: writing(
        "Erkläre, wie der Nil dazu beitrug, dass in Ägypten ein starker Staat mit Beamten entstand.",
        ["Was musste gemeinsam gebaut und gepflegt werden?", "Wer plante, verteilte und zählte?"],
        "Damit alle Felder genug Wasser bekamen, mussten Dämme und Kanäle gebaut und Vorräte für schlechte Jahre angelegt werden. Das schaffte kein Dorf allein. Jemand musste Arbeiter einteilen, die Höhe der Flut messen, Ernten schätzen und Abgaben einziehen. Diese Aufgaben übernahmen der Pharao und seine Beamten und Schreiber. So förderte der Nil einen gut organisierten Staat.",
        ["Gemeinsame Aufgaben genannt", "Rolle von Beamten erklärt", "Zusammenhang Fluss und Staat hergestellt"],
      ),
    },
  },
  {
    id: "g6-pharao",
    lb: 3,
    title: "Der Pharao: Herrscher und Gott",
    period: "Altes Ägypten · etwa 3000 bis 30 v. Chr.",
    span: [-3000, -30],
    intro:
      "Der Pharao befahl über Land, Heer und Tempel. Die Ägypter sahen in ihm mehr als einen Menschen.",
    paragraphs: [
      "Pharao bedeutet ursprünglich „großes Haus“ und meinte den Palast; später wurde es zum Titel des Königs. Der Pharao galt als Sohn des Sonnengottes Re und als irdische Gestalt des Gottes Horus. Seine wichtigste Aufgabe war es, die Maat zu bewahren, die göttliche Ordnung aus Gerechtigkeit, Wahrheit und Frieden. Dafür brachte er den Göttern Opfer, führte das Heer, sprach Recht und ließ Tempel bauen.",
      "Der Pharao herrschte allein und auf Lebenszeit, meist folgte ihm ein Sohn. Eine solche Herrschaft eines Einzelnen nennt man Monarchie. Herrscherfamilien, die nacheinander regierten, heißen Dynastien. Weil der Pharao nicht alles selbst erledigen konnte, half ihm ein großer Beamtenapparat: An der Spitze stand der Wesir, darunter Beamte, Priester und Schreiber, die Abgaben zählten, Vorräte verwalteten und Befehle aufschrieben.",
      "Den meisten Ägyptern erschien diese Ordnung richtig, weil sie göttlich begründet war. Niemand durfte den Pharao wählen, abwählen oder öffentlich kritisieren. Aus heutiger Sicht fehlen Mitbestimmung und Schutz vor Willkür; in Deutschland geht alle Staatsgewalt vom Volk aus. Wer heute urteilt, sollte trotzdem beachten: Die Ordnung brachte Ägypten über lange Zeiträume Stabilität, und die Menschen kannten keine andere.",
    ],
    takeaway:
      "Der Pharao war Alleinherrscher und galt als Sohn des Sonnengottes. Diese göttlich begründete Monarchie ließ keine Mitbestimmung zu.",
    sourceIds: ["pw-pharaonen", "smaek"],
    quiz: check(
      "Womit begründete der Pharao seine Herrschaft?",
      "Er galt als Sohn des Sonnengottes Re.",
      ["Er wurde jedes Jahr von den Bauern gewählt.", "Er hatte die meisten Pyramiden geerbt."],
      [
        "Wahlen gab es im alten Ägypten nicht; der Pharao herrschte auf Lebenszeit.",
        "Pyramiden waren Gräber, keine Grundlage der Herrschaft.",
      ],
      "Die göttliche Herkunft machte den Pharao unangreifbar. Seine Aufgabe war es, die Maat zu sichern.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Die Gesellschaft im alten Ägypten",
      layers: [
        { label: "Pharao", note: "Gottkönig, oberster Herr über Land, Heer und Tempel" },
        { label: "Wesir, hohe Beamte und Priester", note: "verwalten das Reich und die Tempel" },
        { label: "Schreiber", note: "zählen, rechnen, schreiben Befehle und Abgaben auf" },
        { label: "Handwerker und Händler", note: "Steinmetze, Töpfer, Bootsbauer, Kaufleute" },
        { label: "Bauern", note: "die große Mehrheit, liefern Abgaben, arbeiten auf Baustellen" },
      ],
      caption:
        "Ein Schaubild vereinfacht: Es gab auch Sklaven, meist Kriegsgefangene, und Aufstieg war etwa für Schreiber möglich.",
    },
    workshop: classify(
      "Monarchie, Gottkönigtum oder heutiges Urteil?",
      ["Merkmal jeder Monarchie", "Besonderheit des Pharaos", "Urteil aus heutiger Sicht"],
      [
        [
          "Ein Einzelner herrscht auf Lebenszeit.",
          0,
          "Das gilt für jede Monarchie, auch für Könige in Europa.",
        ],
        [
          "Die Herrschaft wird meist an einen Sohn vererbt.",
          0,
          "Erbfolge ist typisch für Monarchien.",
        ],
        [
          "Der Herrscher gilt als Sohn des Sonnengottes Re.",
          1,
          "Die göttliche Abstammung ist die ägyptische Besonderheit.",
        ],
        [
          "Der Herrscher sichert die Maat, die Ordnung der Welt.",
          1,
          "Diese religiöse Aufgabe gehört zum ägyptischen Bild vom Pharao.",
        ],
        [
          "Es ist ungerecht, dass niemand den Herrscher abwählen kann.",
          2,
          "Das ist ein Werturteil mit unseren heutigen Maßstäben.",
        ],
      ],
      "Erst beschreiben, dann einordnen, dann urteilen: So vermeidest du, Vergangenes nur mit heutigen Augen zu sehen.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Merkmale einer Monarchie am Beispiel des Pharaos.",
        ["Wie viele herrschen, und wie lange?", "Wie kommt der Nachfolger an die Macht?"],
        "In einer Monarchie herrscht ein Einzelner, in Ägypten der Pharao. Er regiert auf Lebenszeit und wird nicht gewählt. Seine Herrschaft wird meist innerhalb der Familie vererbt, sodass Dynastien entstehen. Beim Pharao kommt hinzu, dass seine Macht als göttlich galt.",
        ["Alleinherrschaft genannt", "Lebenszeit oder Erbfolge genannt", "Bezug zum Pharao"],
      ),
      2: writing(
        "Beurteile die göttliche Herrschaft des Pharaos aus deiner heutigen Sicht. Berücksichtige auch die Sicht der Menschen damals.",
        ["Was fehlt aus heutiger Sicht?", "Warum hielten viele Ägypter die Ordnung für richtig?"],
        "Aus heutiger Sicht finde ich die Herrschaft des Pharaos ungerecht, weil die Menschen nicht mitbestimmen und den Herrscher weder wählen noch kritisieren durften. Die Ägypter sahen das anders: Für sie war der Pharao göttlich und sicherte die Ordnung, von der Ernte und Frieden abhingen. Ich verstehe deshalb, warum die Ordnung lange hielt, würde aber heute nicht so leben wollen.",
        ["Heutige Werte begründet", "Sicht der Zeitgenossen berücksichtigt", "Eigenes Urteil formuliert"],
      ),
    },
  },
  {
    id: "g6-pyramiden",
    lb: 3,
    title: "Pyramiden und Totenkult untersuchen",
    period: "Altes Reich · etwa 2700 bis 2200 v. Chr.",
    span: [-2650, -2500],
    intro:
      "Die Cheops-Pyramide war über 3800 Jahre lang das höchste Bauwerk der Welt. Was verrät ein solcher Bau über die Menschen, die ihn errichteten?",
    paragraphs: [
      "Die ersten Pharaonen ließen sich in flachen Grabbauten bestatten. Um 2650 v. Chr. baute der Baumeister Imhotep für König Djoser eine Stufenpyramide in Sakkara. Etwa hundert Jahre später entstand in Gizeh die Pyramide des Cheops: ursprünglich rund 146 Meter hoch, aus über zwei Millionen Steinblöcken. Gebaut haben sie keine Sklavenheere, sondern ausgebildete Handwerker und viele Bauern, die vor allem während der Überschwemmung arbeiteten. Sie wohnten in einer Arbeitersiedlung und wurden mit Brot, Bier und Fleisch versorgt.",
      "Die Ägypter glaubten an ein Leben nach dem Tod. Damit die Seele zurückkehren konnte, sollte der Körper erhalten bleiben. Deshalb wurden Tote mumifiziert, also getrocknet, gesalbt und in Leinenbinden gewickelt. Ins Grab kamen Speisen, Möbel, Schmuck und Figuren für das Jenseits. Im Totengericht, so glaubten sie, wurde das Herz des Verstorbenen gegen die Feder der Maat gewogen.",
      "Ein Bauwerk kannst du mit einem kleinen Kriterienkatalog untersuchen: Was ist es, wo und wann wurde es gebaut? Wie groß ist es, aus welchem Material? Welcher Aufwand war nötig? Wozu diente es? Welche Bilder und Inschriften trägt es? Aus den Antworten ziehst du Schlüsse: Die gewaltige Größe zeigt die Macht des Pharaos, die Planung eine leistungsfähige Verwaltung, der Zweck den Glauben an das Jenseits und die genaue Ausrichtung das Wissen der Baumeister.",
    ],
    takeaway:
      "Pyramiden waren Königsgräber. Ihre Größe, Planung und Ausstattung zeigen die Macht des Pharaos, eine starke Verwaltung und den Glauben an ein Leben nach dem Tod.",
    sourceIds: ["pw-pyramiden", "smaek", "pw-pharaonen"],
    quiz: check(
      "Wer baute nach heutigem Wissen die großen Pyramiden?",
      "Handwerker und Bauern, die versorgt wurden.",
      ["Kriegsgefangene, die man in Ketten hielt.", "Wenige Priester mit geheimer Technik."],
      [
        "Funde wie die Arbeitersiedlung und Gräber der Arbeiter widerlegen die Vorstellung vom Sklavenheer.",
        "Für den Bau brauchte man Tausende Menschen; Werkzeuge und Rampenreste zeigen bekannte Technik.",
      ],
      "Ausgrabungen bei Gizeh fanden Unterkünfte, Bäckereien und Gräber der Arbeiter. Sie wurden versorgt und teils sogar geehrt.",
    ),
    workshop: classify(
      "Vom Bauwerk zur Aussage",
      ["Gesellschaft und Herrschaft", "Religion", "Kultur und Wissen"],
      [
        [
          "Tausende Arbeiter mussten jahrzehntelang eingeteilt und versorgt werden.",
          0,
          "Das zeigt eine starke Verwaltung im Dienst des Pharaos.",
        ],
        [
          "Die Grabkammer enthielt Speisen, Möbel und Schmuck für das Jenseits.",
          1,
          "Grabbeigaben belegen den Glauben an ein Leben nach dem Tod.",
        ],
        [
          "Die Seiten der Cheops-Pyramide sind fast genau nach den Himmelsrichtungen ausgerichtet.",
          2,
          "Das verlangte Wissen über Sterne und Vermessung.",
        ],
        [
          "Nur der König erhielt ein so gewaltiges Grab.",
          0,
          "Die Größe zeigt die herausgehobene Stellung des Pharaos.",
        ],
        [
          "Der Körper des Königs wurde mumifiziert.",
          1,
          "Die Mumifizierung sollte den Körper für die Seele erhalten.",
        ],
        [
          "Die Steinblöcke wurden passgenau behauen und aufgeschichtet.",
          2,
          "Das zeigt hohes handwerkliches Können.",
        ],
      ],
      "Ein Bauwerk ist eine Sachquelle. Mit festen Kriterien gewinnst du daraus Aussagen über Herrschaft, Glauben und Wissen.",
    ),
    tasks: {
      1: writing(
        "Untersuche die Cheops-Pyramide mit drei Kriterien: Größe, Zweck und Aufwand. Ziehe zu jedem einen Schluss.",
        ["Wie hoch war sie, und wozu diente sie?", "Wie viele Menschen arbeiteten daran?"],
        "Die Pyramide war ursprünglich rund 146 Meter hoch; das zeigt die gewaltige Macht des Pharaos Cheops. Sie diente als Grab, was den Glauben an ein Leben nach dem Tod belegt. Für den Bau mussten Tausende Arbeiter über viele Jahre versorgt und eingeteilt werden; das beweist eine gut organisierte Verwaltung.",
        ["Drei Kriterien angewendet", "Je ein Schluss gezogen", "Sachlich richtige Angaben"],
      ),
      2: writing(
        "In einem Film heißt es: „Die Pyramiden wurden von Sklaven unter Peitschenhieben gebaut.“ Nimm Stellung mit Hilfe der Funde.",
        ["Was wurde in der Nähe der Pyramiden ausgegraben?", "Wie wurden die Arbeiter versorgt?"],
        "Die Aussage stimmt nach heutigem Wissen nicht. Bei Gizeh fanden Archäologen eine Arbeitersiedlung mit Bäckereien und Gräber von Arbeitern, die mit Beigaben bestattet wurden. Gebaut haben Handwerker und Bauern, die vor allem während der Nilschwemme arbeiteten und mit Brot, Bier und Fleisch versorgt wurden. Die Arbeit war hart, aber sie war Dienst für den Pharao, keine Sklaverei.",
        ["Aussage geprüft", "Funde als Beleg genannt", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-hochkultur",
    lb: 3,
    title: "Was ist eine Hochkultur?",
    period: "Um 3000 v. Chr. Hochkultur in Ägypten",
    span: [-3100, -2900],
    intro:
      "Als Ötzi in den Alpen starb, entstand in Ägypten ein Staat mit Schrift, Beamten und Tempeln. Was macht eine solche Hochkultur aus?",
    paragraphs: [
      "Um 3000 v. Chr. wurden Ober- und Unterägypten unter einem König vereinigt. In derselben Zeit entwickelten die Ägypter die Hieroglyphen, eine Schrift aus Bild- und Lautzeichen. Schreiber schrieben auf Papyrus, das aus dem Mark einer Sumpfpflanze hergestellt wurde. Ägypten war damit eine der ersten Hochkulturen der Welt.",
      "Fachleute nennen einige Merkmale einer Hochkultur: einen Staat mit Herrscher und Verwaltung, eine Schrift, Arbeitsteilung mit verschiedenen Berufen und Schichten, Städte und große Bauwerke, eine Religion mit Tempeln und Priestern sowie Wissen, etwa über Rechnen, Vermessung und Kalender. Der ägyptische Kalender hatte 365 Tage und richtete sich nach dem Stern Sirius, der kurz vor der Nilschwemme am Morgenhimmel erschien.",
      "Diese Merkmale kannst du auf andere Kulturen übertragen. Auch in Mesopotamien zwischen Euphrat und Tigris entstanden um diese Zeit Städte wie Uruk, eine Keilschrift auf Tontafeln und Tempeltürme. Ordne die Leistungen in ihre Zeit ein: In Mitteleuropa lebten die Menschen damals noch in Dörfern ohne Schrift, wie Ötzi. Hochkultur bedeutet dabei nicht, dass die Menschen klüger waren; sie lebten in größeren, anders organisierten Gemeinschaften.",
    ],
    takeaway:
      "Merkmale einer Hochkultur sind Staat und Verwaltung, Schrift, Arbeitsteilung, Städte und Großbauten, Religion mit Tempeln und Wissen. Ägypten erfüllte sie ab etwa 3000 v. Chr.",
    sourceIds: ["pw-hieroglyphen", "smaek", "lehrplan"],
    quiz: check(
      "Welches Merkmal fehlte den Dörfern der Jungsteinzeit in Mitteleuropa, als Ägypten zur Hochkultur wurde?",
      "Eine Schrift, mit der Abgaben notiert wurden.",
      ["Häuser, in denen Menschen dauerhaft wohnten.", "Felder, auf denen Getreide angebaut wurde."],
      [
        "Feste Häuser gab es in Mitteleuropa schon seit der Jungsteinzeit.",
        "Ackerbau betrieben auch die Bauern in Mitteleuropa schon seit Jahrtausenden.",
      ],
      "Schrift, Staat und Verwaltung unterschieden Ägypten von den Dörfern Mitteleuropas. Sesshaftigkeit und Ackerbau gab es dort längst.",
    ),
    workshop: classify(
      "Mesopotamien mit den Merkmalen prüfen",
      ["Herrschaft und Verwaltung", "Schrift und Wissen", "Religion", "Gesellschaft und Arbeitsteilung"],
      [
        [
          "Ein König herrscht über die Stadt Uruk und lässt Abgaben eintreiben.",
          0,
          "Herrscher und Abgaben zeigen einen organisierten Staat.",
        ],
        [
          "Schreiber drücken Zeichen mit einem Griffel in Tontafeln.",
          1,
          "Die Keilschrift ist eine der ältesten Schriften der Welt.",
        ],
        [
          "Auf einem hohen Stufenturm steht ein Tempel für den Stadtgott.",
          2,
          "Tempelbauten und Priester gehören zum Merkmal Religion.",
        ],
        [
          "Töpfer, Weber, Händler und Bauern üben verschiedene Berufe aus.",
          3,
          "Arbeitsteilung entsteht, wenn nicht alle Nahrung erzeugen müssen.",
        ],
        [
          "Gelehrte teilen den Tag und das Jahr nach Beobachtungen des Himmels ein.",
          1,
          "Auch Rechnen und Sternkunde zählen zum Wissen einer Hochkultur.",
        ],
      ],
      "Die Merkmale passen auch auf Mesopotamien. Mit ihnen kannst du weitere frühe Kulturen vergleichen, etwa am Indus oder in China.",
    ),
    tasks: {
      1: writing(
        "Begründe mit drei Merkmalen, dass Ägypten um 3000 v. Chr. eine Hochkultur war.",
        ["Denke an Schrift, Herrscher und Bauwerke.", "Gib zu jedem Merkmal ein ägyptisches Beispiel."],
        "Ägypten hatte einen Staat mit einem Herrscher, dem Pharao, und Beamten, die Abgaben verwalteten. Es gab eine Schrift, die Hieroglyphen, die Schreiber auf Papyrus schrieben. Außerdem entstanden große Bauwerke wie Tempel und später Pyramiden. Damit erfüllte Ägypten wichtige Merkmale einer Hochkultur.",
        ["Drei Merkmale genannt", "Ägyptische Beispiele zugeordnet", "Fachbegriffe richtig verwendet"],
      ),
      2: writing(
        "Ein Mitschüler sagt: „Die Ägypter waren klüger als die Menschen in Bayern damals.“ Nimm Stellung.",
        ["Wie lebten die Menschen in Mitteleuropa um 3000 v. Chr.?", "Was unterscheidet eine Hochkultur wirklich?"],
        "Die Aussage ist nicht haltbar. Um 3000 v. Chr. lebten die Menschen in Mitteleuropa in Dörfern ohne Schrift; Ötzi zeigt aber, dass sie Kupfer verarbeiteten und sehr geschickt waren. Ägypten unterschied sich durch die Lebensform: einen großen Staat mit Verwaltung, Schrift und Arbeitsteilung, den der Nil begünstigte. Hochkultur beschreibt die Organisation einer Gesellschaft, nicht die Klugheit einzelner Menschen.",
        ["Aussage zurückgewiesen", "Lebensweise in Mitteleuropa berücksichtigt", "Begriff Hochkultur richtig erklärt"],
      ),
    },
  },
];
