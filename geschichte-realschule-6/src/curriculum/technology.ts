import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 7: Technik verändert das Leben der Menschen (Längsschnitt). */
export const technology: Lesson[] = [
  {
    id: "g6-ueberleben",
    lb: 7,
    title: "Überlebenstechniken der Vorgeschichte",
    period: "Längsschnitt · Altsteinzeit und Jungsteinzeit",
    span: [-40000, -2200],
    intro:
      "Ohne Fell und Krallen in der Eiszeit überleben? Menschen gelang das mit Erfindungen, die du heute kaum noch bemerkst.",
    paragraphs: [
      "Das Feuer war eine der wichtigsten Errungenschaften. Es spendete Wärme und Licht, hielt wilde Tiere fern und machte Fleisch und Pflanzen durch Kochen leichter verdaulich. Menschen lernten, Glut zu bewahren und später selbst Feuer zu machen: mit Feuerstein, Schwefelkies und Zunder. Ötzi trug dafür einen Zunderschwamm bei sich, einen Baumpilz, der Funken fängt. Ein wärmendes Feuer erlaubte es, auch in kalten Gegenden zu leben.",
      "Kleidung aus Fellen und Leder schützte vor Kälte. Mit Nadeln aus Knochen nähten Menschen der späten Altsteinzeit passgenaue Kleidung. Werkzeug und Waffen wurden immer besser: vom Faustkeil über hölzerne Speere, wie sie in Schöningen in Niedersachsen gefunden wurden, bis zu Speerschleuder, Pfeil und Bogen. Mit ihnen konnten Jäger aus größerer Entfernung und sicherer jagen, oft gemeinsam in Treibjagden.",
      "In der Jungsteinzeit kamen neue Techniken hinzu: Langhäuser aus Holz und Lehm, geschliffene Steinbeile zum Roden, Sicheln, Mahlsteine, Töpfern, Spinnen und Weben. Gegen Ende der Jungsteinzeit lernten Menschen, Kupfer zu verarbeiten. Jede dieser Techniken machte das Überleben sicherer und schuf Zeit für anderes, etwa für Kunst. Die Grundlagen von Kleidung, Hausbau und Werkzeug nutzen wir bis heute.",
    ],
    takeaway:
      "Feuer, Kleidung, Behausungen und immer bessere Werkzeuge und Waffen sicherten in der Vorgeschichte das Überleben und schufen die Grundlagen menschlicher Kultur.",
    sourceIds: ["oetzi", "archaeologie-bayern"],
    quiz: check(
      "Welchen Vorteil brachten Pfeil und Bogen gegenüber dem Faustkeil bei der Jagd?",
      "Man konnte Tiere aus größerer Entfernung treffen.",
      ["Man konnte mit ihnen auch Feuer entfachen.", "Man brauchte für die Jagd keine Gruppe mehr."],
      [
        "Feuer machte man mit Feuerstein, Schwefelkies und Zunder, nicht mit dem Bogen.",
        "Auch mit Pfeil und Bogen jagten Menschen oft gemeinsam.",
      ],
      "Fernwaffen machten die Jagd sicherer und erfolgreicher, weil man dem Tier nicht mehr nahe kommen musste.",
    ),
    workshop: classify(
      "Welche Überlebenstechnik ist das?",
      ["Feuer", "Kleidung", "Behausung", "Jagd und Werkzeug"],
      [
        [
          "Ein Baumpilz wird als Zunder mitgetragen.",
          0,
          "Zunder fängt Funken und hilft beim Feuermachen.",
        ],
        [
          "Eine Knochennadel mit Öhr",
          1,
          "Mit ihr wurden Felle zu Kleidung vernäht.",
        ],
        [
          "Ein Langhaus aus Holzpfosten, Lehmwänden und Schilfdach",
          2,
          "Typisch für die sesshaften Bauern der Jungsteinzeit.",
        ],
        [
          "Eine Speerschleuder aus Rentiergeweih",
          3,
          "Sie verlängerte den Arm und warf Speere weiter.",
        ],
        [
          "Ein Zelt aus Fellen über einem Gerüst aus Stangen",
          2,
          "Eine Behausung, die man bei der Wanderung mitnehmen konnte.",
        ],
        [
          "Schuhe aus Leder, mit Heu gefüttert",
          1,
          "So trug sie Ötzi in den Bergen.",
        ],
      ],
      "Jede Technik löste ein Problem des Überlebens. Zusammen machten sie es möglich, auch in kalten Gegenden zu leben.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei Beispielen, wie Feuer das Leben der Menschen in der Vorgeschichte veränderte.",
        ["Wofür brauchten Menschen Wärme und Licht?", "Was änderte sich beim Essen?"],
        "Feuer spendete Wärme, sodass Menschen auch in der kalten Eiszeit überleben und in kälteren Gegenden wohnen konnten. Außerdem konnten sie Fleisch und Pflanzen kochen oder braten, wodurch die Nahrung leichter verdaulich wurde. Das Feuer hielt zudem wilde Tiere fern und gab Licht in Höhlen und Zelten.",
        ["Zwei Beispiele genannt", "Veränderung erklärt", "Bezug zum Überleben"],
      ),
      2: writing(
        "Welche Überlebenstechnik der Vorgeschichte hältst du für die wichtigste? Begründe und vergleiche mit einer anderen.",
        ["Was wäre ohne diese Technik nicht möglich gewesen?", "Warum ist eine andere weniger grundlegend?"],
        "Ich halte das Feuer für die wichtigste Technik. Ohne Feuer hätten Menschen in der Eiszeit kaum überleben können, denn es gab Wärme, Licht, Schutz und gekochte Nahrung. Pfeil und Bogen waren auch sehr nützlich, aber die Menschen jagten schon vorher erfolgreich mit Speeren. Das Feuer veränderte dagegen fast alle Bereiche des Lebens.",
        ["Klare Entscheidung", "Begründung mit Folgen", "Vergleich mit anderer Technik"],
      ),
    },
  },
  {
    id: "g6-technik-aegypten",
    lb: 7,
    title: "Wasser lenken: Technik im alten Ägypten",
    period: "Längsschnitt · ab 3000 v. Chr. Hochkultur in Ägypten",
    span: [-3000, -1300],
    intro:
      "Ein Balken, ein Eimer und ein Gegengewicht: Mit einfachen Mitteln holten die Ägypter Wasser auf ihre Felder. Ihre Technik stärkte auch die Macht des Pharaos.",
    paragraphs: [
      "Die Ägypter teilten ihre Felder mit Erdwällen in große Becken. Bei der Nilschwemme füllten sich die Becken, das Wasser blieb einige Wochen stehen, und der Schlamm setzte sich ab. Kanäle leiteten Wasser auch auf entfernte Felder. Nach der Flut maßen Feldmesser mit Seilen die Felder neu aus, weil das Wasser die Grenzen verwischt hatte. Spätestens im Neuen Reich nutzten die Ägypter den Schaduf, einen Schöpfbalken mit Gegengewicht, um Wasser aus Fluss und Kanälen auf höher gelegene Felder zu heben.",
      "Mit Nilometern maßen Beamte die Höhe der Flut. Daraus schätzten sie die kommende Ernte und legten die Abgaben fest. Schreiber notierten alles auf Papyrus. Der Kalender mit 365 Tagen half, die Arbeiten im Jahr zu planen. Für die Pyramiden entwickelten die Ägypter Rampen, Schlitten und genaue Vermessung.",
      "Diese Techniken waren eine Weichenstellung. Bewässerung brachte Überschüsse, mit denen der Staat Handwerker, Beamte, Priester und Soldaten versorgen konnte. Wer Wasser, Vorräte und Aufzeichnungen kontrollierte, hatte Macht über die Menschen. So stärkte die Technik zugleich den Alltag der Bauern und die Herrschaft des Pharaos und seiner Beamten.",
    ],
    takeaway:
      "Beckenbewässerung, Kanäle, Schaduf, Nilometer und Schrift machten den Nil nutzbar. Die Technik schuf Überschüsse und stärkte die Herrschaft des Pharaos.",
    sourceIds: ["pw-alltag-aegypten", "smaek"],
    quiz: check(
      "Wozu diente das Nilometer?",
      "Es maß die Höhe der Nilflut.",
      ["Es zeigte die Tiefe des Wassers für Schiffe an.", "Es pumpte Wasser auf die Felder."],
      [
        "Für die Schifffahrt war es nicht gedacht; es ging um Ernte und Abgaben.",
        "Wasser hob man mit dem Schaduf; das Nilometer maß nur.",
      ],
      "Aus der Flut ließ sich die Ernte schätzen. Danach legten die Beamten die Abgaben fest.",
    ),
    diagram: {
      kind: "steps",
      title: "So arbeitet der Schaduf",
      steps: [
        { label: "Senken", note: "den Eimer am langen Ende ins Wasser ziehen" },
        { label: "Füllen", note: "der Eimer läuft voll" },
        { label: "Heben", note: "das Gegengewicht am kurzen Ende hebt den Eimer" },
        { label: "Schwenken und ausgießen", note: "Wasser in den Kanal zum Feld leeren" },
      ],
      repeats: true,
      caption: "Ein Hebel mit Gegengewicht spart Kraft. Ein Arbeiter konnte so den ganzen Tag Wasser heben.",
    },
    workshop: classify(
      "Technik im Dienst von Alltag und Herrschaft",
      ["Wasser nutzen", "Messen und Planen", "Bauen und Bewegen"],
      [
        [
          "Erdwälle teilen die Felder in Becken, die sich bei der Flut füllen.",
          0,
          "Beckenbewässerung hielt Wasser und Schlamm auf den Feldern.",
        ],
        [
          "Eine Treppe mit Markierungen zeigt den Wasserstand an.",
          1,
          "Das Nilometer diente der Planung von Ernte und Abgaben.",
        ],
        [
          "Schwere Steinblöcke gleiten auf Holzschlitten über eine Rampe.",
          2,
          "So bewegten die Ägypter Lasten für Pyramiden und Tempel.",
        ],
        [
          "Ein Schöpfbalken hebt Eimer um Eimer auf das Feld.",
          0,
          "Der Schaduf nutzt die Hebelwirkung.",
        ],
        [
          "Feldmesser spannen Seile, um Grenzen nach der Flut neu festzulegen.",
          1,
          "Vermessung verlangte Rechnen und Geometrie.",
        ],
      ],
      "Technik und Verwaltung gehörten zusammen: Erst Messen, Planen und Aufschreiben machten die Bewässerung wirksam.",
    ),
    tasks: {
      1: writing(
        "Beschreibe, wie die Ägypter das Nilwasser auf ihre Felder brachten. Nenne zwei Techniken.",
        ["Was geschah bei der Flut mit den Feldern?", "Wie kam Wasser auf höhere Felder?"],
        "Die Ägypter teilten ihre Felder mit Erdwällen in Becken, die sich bei der Nilschwemme füllten; dort setzte sich der fruchtbare Schlamm ab. Kanäle leiteten Wasser zu weiter entfernten Feldern. Mit dem Schaduf, einem Schöpfbalken mit Gegengewicht, hoben sie Wasser auf höher gelegene Felder.",
        ["Zwei Techniken genannt", "Funktion erklärt", "Bezug zur Nilschwemme"],
      ),
      2: writing(
        "Erkläre, warum die Bewässerungstechnik auch die Macht des Pharaos stärkte.",
        ["Was entstand durch bessere Ernten?", "Wer kontrollierte Wasser, Vorräte und Aufzeichnungen?"],
        "Bessere Bewässerung brachte mehr Ernte, als die Bauern selbst brauchten. Diesen Überschuss zogen Beamte als Abgaben ein und versorgten damit Handwerker, Priester, Soldaten und Bauarbeiter. Weil der Pharao und seine Beamten Wasserbau, Vorräte und Aufzeichnungen kontrollierten, hingen die Menschen von ihnen ab. So stärkte die Technik den Staat und die Herrschaft des Pharaos.",
        ["Überschuss erklärt", "Kontrolle durch Beamte beschrieben", "Zusammenhang zur Herrschaft"],
      ),
    },
  },
  {
    id: "g6-technik-antike",
    lb: 7,
    title: "Straßen, Bögen und Beton: Technik bei Griechen und Römern",
    period: "Längsschnitt · Griechen und Römer",
    span: [-480, 300],
    intro:
      "Viele Römerstraßen und Brücken stehen noch heute. Ihre Technik half Rom beim Herrschen, und sie veränderte die Umwelt.",
    paragraphs: [
      "Die Griechen bauten schnelle Kriegsschiffe, die Trieren, mit drei Reihen von Ruderern übereinander. Der Gelehrte Archimedes beschrieb, wie man mit Hebeln und Flaschenzügen schwere Lasten bewegt, und auf ihn geht die archimedische Schraube zum Wasserheben zurück. Bei Belagerungen setzten Griechen und Römer Wurfmaschinen ein.",
      "Die Römer waren Meister des Bauens. Mit dem Rundbogen, der von einem Schlussstein zusammengehalten wird, überspannten sie Flüsse und Täler. Aus Kalk, Sand, Wasser und Steinen mischten sie einen Beton, mit dem sie Kuppeln wie die des Pantheon in Rom gossen. Aquädukte führten Wasser mit leichtem Gefälle über viele Kilometer in die Städte. Ihre Straßen bauten sie in mehreren Schichten und möglichst gerade; Meilensteine zeigten die Entfernungen. Zehntausende Kilometer Straßen verbanden das Reich.",
      "Diese Technik war eine Weichenstellung: Auf den Straßen marschierten Legionen schnell an die Grenzen, Händler brachten Waren, Boten Befehle, und später verbreitete sich auf ihnen auch das Christentum. Doch Technik hatte Folgen für die Umwelt. Für Häuser, Schiffe, Thermen und das Schmelzen von Metallen wurden ganze Wälder abgeholzt, Böden wurden abgetragen. Beim Gewinnen von Blei und Silber gelangte so viel Blei in die Luft, dass Forscher es heute noch im Eis Grönlands nachweisen.",
    ],
    takeaway:
      "Rundbogen, Beton, Aquädukte und Straßen machten Rom stark: Sie dienten Herrschaft, Handel und Alltag. Abholzung und Bleiverschmutzung zeigen die Umweltfolgen antiker Technik.",
    sourceIds: ["pw-roemerstaedte", "pw-rom", "limes"],
    quiz: check(
      "Warum waren die Römerstraßen für die Herrschaft über das Reich so wichtig?",
      "Legionen und Befehle erreichten schnell die Provinzen.",
      ["Auf ihnen durften nur Kaiser und Senatoren fahren.", "Sie hielten Feinde wie eine Mauer fern."],
      [
        "Die Straßen nutzten auch Händler, Boten und Reisende.",
        "Straßen verbinden; abwehren sollten Grenzanlagen wie der Limes.",
      ],
      "Wer schnell Truppen und Nachrichten bewegen kann, kann ein großes Reich zusammenhalten.",
    ),
    diagram: {
      kind: "layers",
      title: "Querschnitt einer Römerstraße",
      layers: [
        { label: "Pflaster", note: "große, glatte Steinplatten, leicht gewölbt, damit Regen abläuft" },
        { label: "Feiner Kies mit Mörtel", note: "ebene, feste Schicht unter dem Pflaster" },
        { label: "Schotter und Kies", note: "lässt Wasser versickern" },
        { label: "Große Steine", note: "tragfähiges Fundament in einer ausgehobenen Grube" },
      ],
      caption: "So beschreiben es Fachbücher als Idealform. Viele Straßen in den Provinzen hatten statt Pflaster eine Kiesdecke.",
    },
    workshop: classify(
      "Wozu diente die Technik, und was kostete sie?",
      ["Nutzen für die Herrschaft", "Nutzen für den Alltag", "Folge für die Umwelt"],
      [
        [
          "Legionen marschieren auf gepflasterten Straßen schnell an die Grenze.",
          0,
          "Straßen sicherten die Kontrolle über die Provinzen.",
        ],
        [
          "Aquädukte bringen frisches Wasser zu Brunnen und Thermen.",
          1,
          "Sauberes Wasser verbesserte das Leben in den Städten.",
        ],
        [
          "Für die Heizung der Thermen werden große Mengen Holz verbrannt.",
          2,
          "Der Holzbedarf trug zur Abholzung bei.",
        ],
        [
          "Kastelle am Limes sind über Straßen mit dem Hinterland verbunden.",
          0,
          "So konnten Truppen schnell verlegt werden.",
        ],
        [
          "Beim Schmelzen von Silbererz gelangt Blei in die Luft.",
          2,
          "Spuren davon finden sich bis heute im Eis Grönlands.",
        ],
        [
          "Händler bringen Wein und Öl aus Italien in die Provinzen.",
          1,
          "Straßen förderten den Handel und veränderten den Speiseplan.",
        ],
      ],
      "Technik wirkt doppelt: Sie erleichtert Leben und Herrschen und verändert zugleich die Umwelt.",
    ),
    tasks: {
      1: writing(
        "Erkläre an den Römerstraßen, warum Technik eine Weichenstellung für die Geschichte sein kann.",
        ["Wer nutzte die Straßen?", "Was wäre ohne sie anders gewesen?"],
        "Die Römerstraßen verbanden das riesige Reich. Legionen konnten schnell an die Grenzen marschieren, Boten brachten Befehle, und Händler transportierten Waren. Später verbreitete sich auf den Straßen auch das Christentum. Ohne dieses Netz hätte Rom die Provinzen kaum so lange beherrschen können. Eine technische Leistung veränderte also den Verlauf der Geschichte.",
        ["Nutzer genannt", "Folge für die Herrschaft erklärt", "Begriff Weichenstellung angewendet"],
      ),
      2: writing(
        "Beurteile die römische Technik mit Blick auf Nutzen und Umweltfolgen.",
        ["Welche Vorteile brachte sie den Menschen?", "Welche Schäden entstanden?"],
        "Die römische Technik brachte großen Nutzen: Aquädukte lieferten sauberes Wasser, Straßen förderten Handel und Herrschaft, Beton und Bögen ermöglichten große Bauten. Zugleich schadete sie der Umwelt, denn für Thermen, Schiffe und Metallschmelzen wurden viele Wälder abgeholzt, und Blei verschmutzte die Luft. Ich halte die Technik für eine große Leistung, deren Folgen die Römer aber kaum bedachten.",
        ["Nutzen genannt", "Umweltfolgen genannt", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g6-technik-heute",
    lb: 7,
    title: "Technik heute: Wer gewinnt, wer bestimmt?",
    period: "Längsschnitt · Gegenwart, Stand November 2026",
    span: [2000, 2026],
    intro:
      "Smartphone, Navigation, Künstliche Intelligenz: Technik verändert auch heute den Alltag. Die Fragen, die du an die Römer gestellt hast, helfen dir jetzt weiter.",
    paragraphs: [
      "Du hast gesehen, wie Feuer, Bewässerung oder Straßen das Leben veränderten. Heute verändern andere Techniken den Alltag: Mit dem Smartphone erreichst du Freunde jederzeit, Satellitennavigation zeigt dir den Weg, Programme mit Künstlicher Intelligenz schreiben Texte oder erkennen Bilder. Welche Entwicklungen gerade wichtig sind, kannst du in aktuellen Nachrichten verfolgen; diese Lektion gibt dir Fragen, mit denen du sie untersuchst. Sie hat den Stand November 2026.",
      "Stelle drei Fragen. Erstens: Wie verändert die Technik den Alltag? Sie spart Zeit und verbindet Menschen, kann aber auch ablenken und abhängig machen. Zweitens: Wer bestimmt über sie, und wer gewinnt Macht? Im alten Ägypten kontrollierten Schreiber die Aufzeichnungen, heute sammeln Unternehmen und Staaten Daten. Das kann helfen, etwa bei Warnungen vor Unwettern, aber auch zur Überwachung genutzt werden. Drittens: Welche Folgen hat sie für die Umwelt? Geräte brauchen Rohstoffe und Strom.",
      "Mit diesen Fragen kannst du Techniken aus verschiedenen Zeiten vergleichen, ohne sie gleichzusetzen. Wie bei den Römerstraßen gilt: Eine Technik ist selten nur gut oder nur schlecht. Entscheidend ist, wer sie wofür einsetzt und wer die Regeln dafür macht. In einer Demokratie können Bürgerinnen und Bürger darüber mitreden.",
    ],
    takeaway:
      "Auch heutige Technik verändert Alltag, Macht und Umwelt. Frage immer: Was erleichtert sie? Wer bestimmt über sie? Welche Folgen hat sie?",
    sourceIds: ["lehrplan"],
    quiz: check(
      "Welche Frage hilft dir, die Macht hinter einer Technik zu untersuchen?",
      "Wer bestimmt über die Technik und ihre Daten?",
      ["Wie viel kostet das neueste Gerät im Laden?", "In welcher Farbe gibt es das Gerät?"],
      [
        "Der Preis sagt wenig darüber, wer über die Technik bestimmt.",
        "Die Farbe ist für Macht und Herrschaft unwichtig.",
      ],
      "Wie bei den Schreibern im alten Ägypten gilt: Wer Aufzeichnungen und Daten kontrolliert, hat Macht.",
    ),
    workshop: classify(
      "Drei Fragen an die Technik von heute",
      ["Verändert den Alltag", "Verändert Macht und Herrschaft", "Folge für die Umwelt"],
      [
        [
          "Eine App zeigt dir, wann dein Bus kommt.",
          0,
          "Die Technik erleichtert die Planung im Alltag.",
        ],
        [
          "Ein Unternehmen speichert, wo sich Millionen Nutzer aufhalten.",
          1,
          "Wer viele Daten besitzt, gewinnt Einfluss.",
        ],
        [
          "Für Akkus werden Metalle in Bergwerken abgebaut.",
          2,
          "Rohstoffabbau verändert Landschaften.",
        ],
        [
          "Ein Staat nutzt Kameras mit Gesichtserkennung auf Plätzen.",
          1,
          "Überwachung kann Macht über Menschen verstärken.",
        ],
        [
          "Rechenzentren brauchen große Mengen Strom und Kühlwasser.",
          2,
          "Auch digitale Technik verbraucht Ressourcen.",
        ],
        [
          "Familien telefonieren per Video mit Verwandten in anderen Ländern.",
          0,
          "Technik verbindet Menschen über große Entfernungen.",
        ],
      ],
      "Dieselben Fragen passen auf Feuer, Bewässerung, Römerstraßen und Smartphones: So vergleichst du Technik über die Zeiten.",
    ),
    tasks: {
      1: writing(
        "Wähle eine heutige Technik und untersuche sie mit den drei Fragen: Alltag, Macht, Umwelt.",
        ["Was erleichtert sie, was erschwert sie?", "Wer bestimmt darüber, und was verbraucht sie?"],
        "Ich untersuche das Smartphone. Im Alltag erleichtert es vieles: Ich kann Freunde erreichen, Wege finden und lernen; es kann aber auch ablenken. Macht haben die Unternehmen, die Apps anbieten und dabei Daten sammeln, und Staaten, die Regeln dafür machen. Für die Umwelt bedeutet es den Abbau von Rohstoffen für Akkus und Stromverbrauch.",
        ["Alltag untersucht", "Macht untersucht", "Umwelt untersucht"],
      ),
      2: writing(
        "Vergleiche die Römerstraßen mit dem Internet: Welche Gemeinsamkeit siehst du, und wo endet der Vergleich?",
        ["Was verbanden die Straßen, was verbindet das Internet?", "Was ist heute grundlegend anders?"],
        "Beide sind Netze, die ein großes Gebiet verbinden: Auf den Römerstraßen reisten Soldaten, Händler und Nachrichten, im Internet reisen Daten und Nachrichten in Sekunden um die Welt. Beide verschaffen denen Macht, die sie kontrollieren. Der Vergleich endet aber, weil das Internet nicht einem einzigen Herrscher gehört und Menschen in Demokratien über seine Regeln mitbestimmen können. Außerdem ist es viel schneller und weltweit.",
        ["Gemeinsamkeit genannt", "Grenze des Vergleichs genannt", "Begründet formuliert"],
      ),
    },
  },
];
