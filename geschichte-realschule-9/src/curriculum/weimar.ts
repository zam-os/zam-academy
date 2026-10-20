import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const weimar: Lesson[] = [
  {
    id: "g-weimar-verfassung",
    lb: 3,
    title: "Eine demokratische Verfassung",
    period: "1919–1933",
    intro:
      "Die Weimarer Republik eröffnete politische Teilhabe. Ihre Verfassung enthielt zugleich Spannungen.",
    paragraphs: [
      "Die Weimarer Verfassung verband Grundrechte, eine gewählte Volksvertretung und eine parlamentarisch verantwortliche Regierung. Frauen und Männer konnten wählen. Der direkt gewählte Reichspräsident hatte daneben erhebliche Befugnisse: Er ernannte den Reichskanzler, konnte den Reichstag auflösen und unter Bedingungen Notverordnungen erlassen.",
      "Artikel 48 war kein automatischer Abschalter der Demokratie. Der Reichstag konnte die Aufhebung einer Notverordnung verlangen. In den Krisen ab 1930 wurden Notverordnungen und Reichstagsauflösungen jedoch zum Mittel, parlamentarische Mehrheiten zu umgehen. Für das Scheitern zählen auch politische Entscheidungen und fehlende Unterstützung für die Demokratie.",
    ],
    takeaway:
      "Demokratische Teilhabe und starke Präsidentenrechte bestanden nebeneinander; ihr Gebrauch war politisch entscheidend.",
    sourceIds: ["demokratie", "weimar"],
    quiz: check(
      "Welche Verbindung kennzeichnet die Weimarer Verfassung?",
      "Parlamentarische Demokratie mit einem starken Reichspräsidenten.",
      [
        "Absolute Monarchie mit einem nur beratenden Reichstag.",
        "Einparteienherrschaft ohne allgemeines Wahlrecht.",
      ],
      "Die Verfassung eröffnete Teilhabe, enthielt aber auch starke präsidentielle Befugnisse.",
    ),
    workshop: classify(
      "Demokratie und Machtbegrenzung",
      ["Demokratische Beteiligung", "Präsidentielle Befugnis", "Politische Nutzung ab 1930"],
      [
        [
          "Frauen und Männer wählen den Reichstag.",
          0,
          "Allgemeine Wahlen bilden eine demokratische Grundlage.",
        ],
        [
          "Der Reichspräsident kann den Reichstag auflösen.",
          1,
          "Das gab ihm Einfluss auf die parlamentarische Ordnung.",
        ],
        [
          "Regieren mit Notverordnungen ersetzt zunehmend parlamentarische Mehrheiten.",
          2,
          "Eine konkrete Praxis schwächte die Volksvertretung.",
        ],
      ],
      "Verfassungstext, institutionelle Kontrolle und tatsächliche politische Praxis unterscheiden.",
    ),
    tasks: {
      1: writing(
        "Nenne eine Stärke und ein Risiko der Weimarer Verfassungsordnung und erkläre beide.",
        [
          "Wahlrecht und Grundrechte berücksichtigen.",
          "Präsidentenrechte im Krisenkontext betrachten.",
        ],
        "Das allgemeine Wahlrecht ermöglichte breite politische Beteiligung. Die starken Rechte des Reichspräsidenten konnten dagegen in Krisen zur Umgehung parlamentarischer Mehrheiten genutzt werden. Das Ergebnis war nicht allein durch den Verfassungstext vorgegeben.",
        ["Stärke erklärt", "Risiko erklärt", "Keine Zwangsläufigkeit"],
      ),
      2: writing(
        "Beurteile: Eine demokratische Verfassung reicht allein aus, um eine Demokratie dauerhaft zu sichern.",
        ["Institutionen und Verhalten gehören zusammen.", "Ein Beispiel aus Weimar heranziehen."],
        "Eine Verfassung schafft Rechte und Verfahren. Sie braucht aber politische Akteure und gesellschaftliche Unterstützung, die diese beachten und verteidigen. Weimar zeigt, wie Notverordnungen, Gewalt und antidemokratische Entscheidungen demokratische Verfahren schwächen können.",
        ["Verfassungsfunktion", "Politische Praxis", "Historischer Beleg"],
      ),
    },
  },
  {
    id: "g-krisenjahr-1923",
    lb: 3,
    title: "1923: Krisen der jungen Republik",
    period: "1923",
    intro: "Besetzung, Geldentwertung und Putschversuche trafen die Republik gleichzeitig.",
    paragraphs: [
      "Die Ruhrbesetzung und der von der Regierung unterstützte passive Widerstand verschärften Finanzprobleme. Bereits bestehende Inflation steigerte sich 1923 zur Hyperinflation: Geld verlor in kurzer Zeit massiv an Kaufkraft. Menschen mit Geldersparnissen erlitten große Verluste; Auswirkungen unterschieden sich nach Einkommen und Vermögen.",
      "Politische Gewalt und Putschversuche bedrohten die Ordnung, etwa der Hitler-Ludendorff-Putsch in München im November. Der Abbruch des passiven Widerstands und die Währungsstabilisierung mit der Rentenmark halfen aus der akuten Krise. Die Republik überstand das Jahr; ihr Ende war noch nicht entschieden.",
    ],
    takeaway:
      "1923 verbanden sich wirtschaftliche und politische Krisen, die Republik konnte sich danach stabilisieren.",
    sourceIds: ["weimar", "demokratie"],
    quiz: check(
      "Welche Entwicklung gehört zum Krisenjahr 1923?",
      "Hyperinflation und Hitler-Ludendorff-Putsch.",
      [
        "Weltwirtschaftskrise und Ernennung Hitlers zum Kanzler.",
        "Weimarer Verfassung und Novemberrevolution.",
      ],
      "Die Weltwirtschaftskrise begann 1929, Hitlers Ernennung folgte 1933.",
    ),
    workshop: classify(
      "Krisen auseinanderhalten",
      ["1923", "1929 und folgende Jahre"],
      [
        [
          "Extrem schnelle Geldentwertung vernichtet Ersparnisse.",
          0,
          "Das kennzeichnet die Hyperinflation.",
        ],
        [
          "Ein Putschversuch in München scheitert.",
          0,
          "Der Hitler-Ludendorff-Putsch fand im November 1923 statt.",
        ],
        [
          "Eine Weltwirtschaftskrise führt zu massivem Einbruch und Arbeitslosigkeit.",
          1,
          "Diese Krise darf nicht mit der Hyperinflation gleichgesetzt werden.",
        ],
      ],
      "Inflation bezeichnet Preissteigerungen; die Weltwirtschaftskrise war eine andere Krisenkonstellation.",
    ),
    tasks: {
      1: writing(
        "Unterscheide die Krise 1923 von der Weltwirtschaftskrise ab 1929.",
        [
          "Kaufkraft und Arbeitslosigkeit zuordnen.",
          "Keine durchgehende Krise ohne Zwischenphase annehmen.",
        ],
        "1923 verlor Geld durch Hyperinflation extrem an Kaufkraft; gleichzeitig bedrohten Putschversuche die Republik. Ab 1929 brach die Wirtschaft in einer internationalen Krise ein und Arbeitslosigkeit stieg stark. Dazwischen lag eine Phase relativer Stabilisierung.",
        ["1923 korrekt", "1929 korrekt", "Zwischenphase"],
      ),
      2: writing(
        "Was widerspricht der Behauptung, nach 1923 sei der Untergang der Republik bereits unausweichlich gewesen?",
        [
          "Stabilisierung und politische Möglichkeiten beachten.",
          "Den Ausgang nicht rückwärts als sicher darstellen.",
        ],
        "Die Währung wurde stabilisiert und die Republik überstand Putschversuche. In den folgenden Jahren gab es wirtschaftliche Erholung und kulturellen Aufbruch. Diese Entwicklung zeigt Handlungsmöglichkeiten; die späteren Krisen und Entscheidungen müssen zusätzlich erklärt werden.",
        ["Stabilisierung belegt", "Möglichkeiten benannt", "Spätere Faktoren nötig"],
      ),
    },
  },
  {
    id: "g-zwanziger",
    lb: 3,
    title: "Wie golden waren die Zwanziger?",
    period: "1924–1929",
    intro:
      "Kultureller Aufbruch in der Großstadt bedeutete nicht für alle Menschen denselben Alltag.",
    paragraphs: [
      "In den Jahren relativer Stabilisierung gab es kulturellen und technischen Aufbruch: Film, Rundfunk, moderne Kunst und neue Lebensentwürfe wurden sichtbar. Das Frauenwahlrecht war ein demokratischer Fortschritt. Rechtliche und soziale Gleichberechtigung war damit jedoch nicht vollständig erreicht.",
      "Großstädtische Modernität stand neben anderen Erfahrungen im ländlichen Bayern. Einkommen, Beruf, Geschlecht und Wohnort prägten Chancen. Auch die wirtschaftliche Erholung blieb verwundbar, unter anderem durch die Abhängigkeit von ausländischen Krediten. Goldene Zwanziger ist deshalb eine einzuordnende Bezeichnung, kein Gesamturteil über alle Lebenslagen.",
    ],
    takeaway:
      "Kultureller Aufbruch und relative Stabilität waren ungleich verteilt und wirtschaftlich verletzlich.",
    sourceIds: ["weimar", "lehrplan"],
    quiz: check(
      "Warum muss der Ausdruck Goldene Zwanziger eingegrenzt werden?",
      "Lebenschancen und Alltag unterschieden sich stark nach Ort und Gruppe.",
      [
        "Alle Menschen lebten ausschließlich in modernen Großstädten.",
        "Das Frauenwahlrecht beseitigte sofort jede soziale Ungleichheit.",
      ],
      "Ein kulturelles Schlagwort beschreibt keine einheitliche Lebenslage.",
    ),
    workshop: classify(
      "Befund oder Verallgemeinerung?",
      ["Belegbarer Teilaspekt", "Zu pauschales Urteil"],
      [
        ["Film und Rundfunk gewannen an Bedeutung.", 0, "Das beschreibt einen kulturellen Wandel."],
        [
          "Alle Frauen waren nun wirtschaftlich und sozial gleichgestellt.",
          1,
          "Wahlrecht allein beseitigte weitere Ungleichheiten nicht.",
        ],
        [
          "Ländlicher Alltag und großstädtische Kultur konnten sich unterscheiden.",
          0,
          "Ein Vergleich muss konkrete Orte und Gruppen benennen.",
        ],
      ],
      "Vergleiche nicht nur Bilder der Großstadt, sondern auch lokale Überlieferungen.",
    ),
    tasks: {
      1: writing(
        "Warum können zwei Menschen die Zwanzigerjahre sehr unterschiedlich erlebt haben?",
        ["Stadt und Land vergleichen.", "Beruf, Einkommen oder Geschlecht hinzunehmen."],
        "Eine gut verdienende Person in einer Großstadt konnte neue Kulturangebote nutzen. Ein landwirtschaftlicher Haushalt konnte unter anderen wirtschaftlichen Bedingungen leben. Wohnort, Einkommen und Geschlecht beeinflussten die Möglichkeiten; konkrete Erfahrungen brauchen Quellen.",
        ["Zwei Lebenslagen", "Erklärung der Unterschiede", "Quellenbedarf"],
      ),
      2: writing(
        "Formuliere ein begründetes Urteil über die Bezeichnung Goldene Zwanziger.",
        ["Chancen anerkennen, Grenzen belegen.", "Zeitraum und Gruppen nennen."],
        "Für den kulturellen Aufbruch und die relative Stabilisierung ab 1924 ist der Ausdruck anschaulich. Als Urteil über alle Menschen ist er zu pauschal: Modernität war ungleich verteilt und die Wirtschaft blieb verletzlich. Deshalb verwende ich ihn mit zeitlicher und sozialer Einschränkung.",
        ["Chancen", "Grenzen", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g-weltwirtschaftskrise",
    lb: 3,
    title: "1929: Eine internationale Krise",
    period: "ab 1929",
    intro: "Ein Finanzschock traf auf eine verflochtene und verwundbare Wirtschaft.",
    paragraphs: [
      "Der New Yorker Börsenkrach im Oktober 1929 war ein markanter Einschnitt der Weltwirtschaftskrise. Internationale Kredit- und Handelsbeziehungen verbreiteten die Krise. In Deutschland verstärkten Kreditabzug, Produktionsrückgang und Firmenzusammenbrüche die Not.",
      "Die Arbeitslosigkeit stieg massiv. Viele Menschen verloren Vertrauen in politische Lösungen, und antidemokratische Parteien gewannen Zulauf. Soziale Not erklärt jedoch weder jede einzelne Wahlentscheidung noch Hitlers spätere Ernennung allein. Politische Strategien, Institutionen und Entscheidungen müssen hinzukommen.",
    ],
    takeaway:
      "Die Weltwirtschaftskrise ab 1929 verschärfte soziale Not und politische Konflikte; sie erklärt das Ende Weimars nicht allein.",
    sourceIds: ["weimar", "demokratie"],
    quiz: check(
      "Welcher weltwirtschaftliche Einschnitt ab 1929 beendete die relative Stabilisierung und führte zu Massenarbeitslosigkeit in Deutschland?",
      "Die Weltwirtschaftskrise (Börsencrash 1929)",
      ["Die Hyperinflation (Geldentwertung 1923)", "Die Währungsstabilisierung (Rentenmark 1923)"],
      "Die Weltwirtschaftskrise ab 1929 verschärfte Firmenkrisen und Arbeitslosigkeit. Hyperinflation und Rentenmark gehören dagegen zum Jahr 1923.",
    ),
    workshop: classify(
      "Eine Erklärung braucht mehrere Ebenen",
      ["Wirtschaftlicher Vorgang", "Soziale Folge", "Politische Reaktion"],
      [
        [
          "Auslandskredite werden zurückgezogen und Produktion sinkt.",
          0,
          "Kreditabhängigkeit verbreitet die Krise.",
        ],
        [
          "Menschen verlieren Arbeit und Einkommen.",
          1,
          "Das verändert den Alltag und die Zukunftsaussichten.",
        ],
        [
          "Antidemokratische Parteien nutzen die Not für ihre Agitation.",
          2,
          "Politische Akteure handeln und deuten die Krise.",
        ],
      ],
      "Diese Ebenen hängen zusammen, sind aber keine zwangsläufige Einbahnstraße.",
    ),
    tasks: {
      1: writing(
        "Erkläre eine Wirkungskette von internationalen Krediten zur sozialen Not in Deutschland.",
        [
          "Kreditabzug und Firmen berücksichtigen.",
          "Keine einzelne Ursache für jede Folge behaupten.",
        ],
        "Wenn Kredite zurückgezogen werden, geraten darauf angewiesene Betriebe unter Druck. Produktion und Beschäftigung können sinken. Arbeitslosigkeit und Einkommensverluste verstärken die soziale Not; weitere Faktoren wirkten gleichzeitig.",
        ["Kreditbezug", "Wirtschaftliche Verbindung", "Soziale Folge"],
      ),
      2: writing(
        "Beurteile die Aussage: Die Wirtschaftskrise machte alle Arbeitslosen zu Nationalsozialisten.",
        [
          "Ein Gruppenbefund sagt nichts über jede Person.",
          "Politische Alternativen und Entscheidungen beachten.",
        ],
        "Die Krise begünstigte politische Radikalisierung, aber Wahlentscheidungen waren verschieden. Aus Arbeitslosigkeit folgt keine automatische Parteibindung. Eine Erklärung untersucht Gruppen, Regionen und politische Angebote und unterscheidet soziale Bedingungen von individuellen Entscheidungen.",
        ["Krise eingeordnet", "Verallgemeinerung zurückgewiesen", "Weitere Faktoren"],
      ),
    },
  },
  {
    id: "g-weimar-scheitern",
    lb: 3,
    title: "Wie die Demokratie geschwächt wurde",
    period: "1930–1933",
    intro: "Wirtschaftliche Not, Gewalt und Entscheidungen mächtiger Akteure wirkten zusammen.",
    paragraphs: [
      "Ab 1930 regierten Präsidialkabinette zunehmend ohne stabile Reichstagsmehrheit mit Hilfe des Reichspräsidenten und von Notverordnungen. Antidemokratische Parteien bekämpften die Republik; Straßen- und Einschüchterungsgewalt erschwerten demokratische Auseinandersetzung.",
      "Konservative Eliten glaubten, Hitler politisch einrahmen und für ihre Ziele nutzen zu können. Hindenburg ernannte ihn am 30. Januar 1933 zum Reichskanzler. Er wurde damit nicht durch eine direkte Volkswahl zum Regierungschef gewählt. Krisen, institutionelle Möglichkeiten und konkrete Entscheidungen gehören in die Erklärung.",
    ],
    takeaway:
      "Weimars Scheitern entstand aus mehreren Bedingungen und politischen Entscheidungen, nicht aus einem unvermeidlichen Schicksal.",
    sourceIds: ["weimar", "demokratie", "ns"],
    quiz: check(
      "Was kennzeichnet die Präsidialkabinette ab 1930?",
      "Regieren mit präsidentieller Unterstützung statt stabiler Parlamentsmehrheit.",
      [
        "Regieren ausschließlich mit einer dauerhaften Zweidrittelmehrheit im Reichstag.",
        "Regieren ohne Reichspräsidenten und ohne Notverordnungen.",
      ],
      "Der parlamentarische Einfluss wurde durch die politische Praxis geschwächt.",
    ),
    workshop: timeline(
      [
        [
          "Weltwirtschaftskrise beginnt",
          "1929: Die Krise verschärft soziale und politische Konflikte.",
        ],
        [
          "Präsidialkabinette prägen das Regieren",
          "Ab 1930: Stabile parlamentarische Mehrheiten werden zunehmend umgangen.",
        ],
        [
          "Hitler wird zum Reichskanzler ernannt",
          "30. Januar 1933: Hindenburg trifft die Ernennungsentscheidung.",
        ],
        [
          "Grundrechte und Parlament werden ausgeschaltet",
          "1933: Verordnung, Gesetzgebung und Terror zerstören die Demokratie.",
        ],
      ],
      "Das Wissen um den Ausgang darf die Untersuchung damaliger Handlungsmöglichkeiten nicht ersetzen.",
    ),
    tasks: {
      1: writing(
        "Erkläre das Ende Weimars mit mindestens drei miteinander verbundenen Faktoren.",
        [
          "Krise, Gegner und politische Entscheidungen.",
          "Nicht nur Verfassung oder Arbeitslosigkeit nennen.",
        ],
        "Die Weltwirtschaftskrise verschärfte soziale Not. Antidemokratische Kräfte nutzten sie und setzten auch Gewalt ein. Präsidialregieren schwächte das Parlament, und konservative Eliten unterstützten schließlich Hitlers Ernennung. Diese Faktoren wirkten zusammen.",
        ["Mindestens drei Faktoren", "Verbindungen", "Entscheidungen benannt"],
      ),
      2: writing(
        "Welche historisch begründete Frage an den Schutz heutiger Demokratie lässt sich aus Weimar ableiten?",
        [
          "Vergleiche konkrete Mechanismen, keine Gleichsetzungen.",
          "Nenne auch Grenzen des Vergleichs.",
        ],
        "Weimar wirft die Frage auf, wie Grundrechte, parlamentarische Kontrolle und demokratisches Engagement gegen Aushöhlung geschützt werden. Ein Vergleich sollte konkrete Mechanismen prüfen. Unterschiedliche Verfassungen und heutige Rahmenbedingungen verbieten eine einfache Gleichsetzung.",
        ["Historischer Mechanismus", "Begründete Gegenwartsfrage", "Vergleichsgrenze"],
      ),
    },
  },
];
