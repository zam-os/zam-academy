import type { Lesson } from "../model/types";
import { check, classify, tasks, timeline } from "./helpers";

export const foundations: Lesson[] = [
  {
    id: "geo-grundlagen-itc",
    lb: 9,
    optional: true,
    title: "Grundlage: ITC und Passate",
    period: "Auffrischen · kein zusätzlicher Pflicht-Lernbereich",
    intro:
      "Die alte Zelle begann mit tropischer Zirkulation. Hier kannst du die Begriffe auffrischen und die Vereinfachungen erkennen.",
    paragraphs: [
      "Die Innertropische Konvergenzzone, kurz ITC oder ITCZ, ist eine äquatornahe Zone, in der bodennahe Passatwinde zusammenströmen und feuchtwarme Luft häufig aufsteigt. Ihre mittlere Lage verschiebt sich jahreszeitlich und unterscheidet sich über Land und Meer. Sie liegt nicht ständig genau auf dem geographischen Äquator, und nicht überall fällt jeden Tag ein gleich starker Regen.",
      "Im vereinfachten Hadley-Modell steigt Luft in den Tropen auf, strömt in der Höhe polwärts, sinkt in subtropischen Breiten ab und kehrt bodennah zurück. Die Corioliskraft lenkt die bodennahe Strömung auf der Nordhalbkugel nach rechts und auf der Südhalbkugel nach links ab. Das Modell ordnet großräumige Muster; reale Strömungen, Regenzeiten und Luftdruckfelder sind komplexer.",
    ],
    takeaway: "ITC benennt eine wandernde Konvergenzzone, keine ortsfeste tägliche Regenlinie.",
    sourceIds: ["noaa-circulation"],
    quiz: check(
      "Wie heißt die äquatornahe Tiefdruck- und Konvergenzzone mit häufig aufsteigender feuchtwarmer Luft?",
      "Innertropische Konvergenzzone",
      ["Subtropischer Hochdruckgürtel", "Subpolare Tiefdruckrinne"],
      "ITC beziehungsweise ITCZ ist derselbe Begriff. Ihre Lage und Ausprägung ändern sich mit Jahreszeit und Region.",
    ),
    workshop: timeline(
      [
        [
          "Bodennahe Luft strömt im Bereich der ITC zusammen",
          "Konvergenz bezeichnet das Zusammenströmen.",
        ],
        [
          "Feuchtwarme Luft steigt auf und kühlt sich ab",
          "Bei ausreichender Feuchte können Wolken und Niederschlag entstehen.",
        ],
        [
          "Im vereinfachten Modell strömt Luft in der Höhe polwärts und sinkt subtropisch ab",
          "Die reale Zirkulation wird damit stark vereinfacht.",
        ],
        [
          "Bodennahe Rückströmung wird durch die Corioliskraft abgelenkt",
          "So werden die Passatrichtungen im Modell erklärt.",
        ],
      ],
      "Die Abfolge ist ein Erklärungsmodell gleichzeitig ablaufender Prozesse, keine Reisegarantie für jedes Luftpaket.",
    ),
    tasks: tasks(
      "Erkläre die ITC und nenne zwei Grenzen einer einfachen Zeichnung der Passatzirkulation.",
      "In der ITC konvergieren bodennahe Passate; feuchtwarme Luft steigt häufig auf. Ihre Lage verschiebt sich und ist über Kontinenten und Meeren verschieden. Eine einfache Zeichnung zeigt daher weder eine feste Äquatorlinie noch eine Garantie für täglich gleichen Regen an jedem Ort.",
      [
        "Ich erkläre Konvergenz und Aufsteigen.",
        "Ich nenne die jahreszeitliche Verlagerung.",
        "Ich begrenze die Regenaussage.",
      ],
      "Warum kannst du die genaue Regenzeit eines tropischen Ortes nicht allein aus seinem Breitengrad bestimmen?",
      "Die mittlere Lage der ITC, Land-Meer-Verteilung, Relief und regionale Strömungen wirken zusammen. Der Breitengrad liefert nur eine grobe Orientierung. Für die Regenzeit brauche ich ein lokales Klimadiagramm mit klarer Bezugsperiode und eine regionale Erklärung.",
      [
        "Ich nenne zusätzliche Klimafaktoren.",
        "Ich begrenze die Aussage des Breitengrads.",
        "Ich fordere passende lokale Daten.",
      ],
    ),
  },
  {
    id: "geo-grundlagen-regenwald",
    lb: 9,
    optional: true,
    title: "Grundlage: Regenwald und Nährstoffkreislauf",
    period: "Auffrischen · Bodenvielfalt statt Pauschalregel",
    intro:
      "Tropische Regenwälder sind artenreich und vielfältig. Auch ihre Böden und Nährstoffspeicher sind nicht überall gleich.",
    paragraphs: [
      "In feuchtwarmen Regionen kann abgestorbenes organisches Material rasch zersetzt und ein Teil der Nährstoffe wieder von Pflanzen aufgenommen werden. In vielen stark verwitterten tropischen Böden ist die kurzfristige Versorgung eng an den lebenden Wald und den Kreislauf der Streu gebunden. Daraus folgt nicht, dass in jedem Regenwald der überwiegende Teil aller Nährstoffe zwingend in derselben Speicherform liegt.",
      "Böden unterscheiden sich nach Ausgangsgestein, Alter, Relief, Überflutung und Nutzung. Rodung kann Kreisläufe unterbrechen, Bodenabtrag und Nährstoffverluste fördern; Stärke und Verlauf hängen vom Standort und der Folgenutzung ab. Eine überall unvermeidliche vollständige Unfruchtbarkeit nach genau zwei oder drei Jahren ist keine tragfähige allgemeine Regel. Waldschutz und angepasste Nutzung brauchen konkrete Standortkenntnis.",
    ],
    takeaway:
      "Erkläre Kreisläufe mit ihrem Standortbezug; eine pauschale Aussage über alle Tropenböden führt in die Irre.",
    sourceIds: ["fao-soils"],
    quiz: check(
      "Warum ist die Aussage alle Regenwaldböden sind gleich unfruchtbar ungeeignet?",
      "Tropische Böden unterscheiden sich nach Standort und Entstehung",
      [
        "In den Tropen gibt es grundsätzlich keine Böden",
        "Nährstoffe entstehen ausschließlich durch Brandrodung",
      ],
      "Ausgangsmaterial, Alter, Wasserhaushalt und Nutzung erzeugen unterschiedliche Böden und Nährstoffspeicher.",
    ),
    workshop: classify(
      "Begrenzte oder pauschale Aussage?",
      ["Fachlich eingegrenzt", "Zu pauschal"],
      [
        [
          "Rodung kann Nährstoffkreisläufe und Bodenschutz beeinträchtigen.",
          0,
          "Die Formulierung beschreibt ein Risiko, das am Standort zu prüfen ist.",
        ],
        [
          "Jeder tropische Boden ist nach genau drei Jahren endgültig tot.",
          1,
          "Eine starre allgemeine Frist und Irreversibilität sind nicht begründet.",
        ],
        [
          "Ausgangsgestein und Überflutung können Böden unterscheiden.",
          0,
          "Diese Faktoren helfen, Vielfalt zu erklären.",
        ],
      ],
      "Die korrigierten Fragen beginnen ohne übernommenen Lernstand; die früheren Reviews bleiben als alte Evidenz erhalten.",
    ),
    tasks: tasks(
      "Erkläre eine mögliche Folge von Rodung für den Nährstoffkreislauf und begrenze sie räumlich.",
      "Rodung entfernt lebende Biomasse und verändert Streuzufuhr, Aufnahme und Bodenschutz. Auf stark verwitterten, erosionsgefährdeten Standorten kann die Nährstoffversorgung dadurch beeinträchtigt werden. Die Folgen unterscheiden sich nach Boden und Nutzung; ich behaupte keine gleiche Frist für alle Regenwälder.",
      [
        "Ich verbinde Biomasse und Kreislauf.",
        "Ich nenne eine mögliche Bodenfolge.",
        "Ich vermeide eine universelle Frist.",
      ],
      "Welche Daten brauchst du, um zwei tropische Waldstandorte nach einer Rodung zu vergleichen?",
      "Ich brauche Bodenart und Ausgangsgestein, Niederschlag, Relief, frühere Vegetation, Folgenutzung und den Zeitraum seit dem Eingriff. Erst bei vergleichbaren Angaben kann ich Unterschiede der Nährstoffversorgung oder Erosion erklären. Ein einziges Bild oder das Wort tropisch genügt nicht.",
      [
        "Ich nenne mehrere Standortfaktoren.",
        "Ich berücksichtige Nutzung und Zeit.",
        "Ich begründe den Vergleichsmaßstab.",
      ],
    ),
  },
  {
    id: "geo-grundlagen-desertifikation",
    lb: 9,
    optional: true,
    title: "Grundlage: Desertifikation und Versalzung",
    period: "Auffrischen · Trockengebiete differenziert betrachten",
    intro:
      "Degradation in Trockengebieten ist kein bloßes Vorrücken einer Sandwüste. Naturbedingungen und menschliche Nutzung wirken zusammen.",
    paragraphs: [
      "Desertifikation bezeichnet Landdegradation in ariden, semiariden und trocken-subhumiden Gebieten durch verschiedene Faktoren einschließlich Klimaschwankungen und menschlicher Tätigkeiten. Überweidung, Entfernung der Vegetation oder ungeeignete Bewässerung können beitragen. Armut, Landrechte, Nutzungskonflikte und politische Bedingungen beeinflussen, welche Handlungsmöglichkeiten Menschen haben.",
      "Bewässerungswasser enthält häufig gelöste Salze. Verdunstet Wasser oder fehlt ausreichender Abtransport, können sich Salze im Wurzelraum anreichern; hoch stehendes salzhaltiges Grundwasser kann mitwirken. Angepasstes Wasser- und Bodenmanagement einschließlich geeigneter Drainage kann helfen, ist aber standortabhängig. Das ist keine Verkarstung: Karst entsteht durch Lösung bestimmter Gesteine. Auch Degradation ist nicht in jedem Fall irreversibel.",
    ],
    takeaway:
      "Desertifikation ist Landdegradation in Trockengebieten; Versalzung ist ein möglicher Prozess und kein anderer Name für Karst.",
    sourceIds: ["unccd", "fao-salinity"],
    quiz: check(
      "Wie heißt die Landdegradation in Trockengebieten, zu der etwa Überweidung und ungeeignete Bewässerung beitragen können?",
      "Desertifikation (Wüstenbildung)",
      ["Glaziale Erosion (Eisabtragung)", "Tektonische Hebung (Gebirgsbildung)"],
      "Der Begriff Desertifikation bleibt erhalten. Er meint Landdegradation durch klimatische und menschliche Faktoren, nicht bloß das natürliche Vorrücken einer Wüste.",
    ),
    workshop: classify(
      "Begriffe sauber trennen",
      ["Landdegradation", "Salzanreicherung", "Gesteinslösung"],
      [
        [
          "Vegetationsverlust und abnehmende Bodenproduktivität im Trockengebiet",
          0,
          "Das kann eine Form der Desertifikation sein.",
        ],
        [
          "Salze bleiben nach Verdunstung im Wurzelraum zurück.",
          1,
          "Das ist ein möglicher Mechanismus der Versalzung.",
        ],
        [
          "Lösliches Gestein wird durch Wasser gelöst und bildet Karstformen.",
          2,
          "Verkarstung ist ein anderer Prozess als Bodenversalzung.",
        ],
      ],
      "Eine nachhaltige Gegenmaßnahme muss Boden, Wasser, Nutzung und gesellschaftliche Bedingungen berücksichtigen.",
    ),
    tasks: tasks(
      "Erkläre Desertifikation und unterscheide sie von Bodenversalzung und Verkarstung.",
      "Desertifikation ist Landdegradation in Trockengebieten durch klimatische und menschliche Faktoren. Versalzung kann dazu beitragen, wenn Salze im Boden angereichert werden. Verkarstung bezeichnet dagegen die Lösung geeigneter Gesteine und ist kein Synonym für einen geschädigten trockenen Boden.",
      [
        "Ich definiere Desertifikation mit Raumbezug.",
        "Ich beschreibe Versalzung als möglichen Prozess.",
        "Ich unterscheide Karst fachlich.",
      ],
      "Warum ist eine neue sparsame Bewässerungsanlage allein keine garantierte Lösung für einen versalzten Standort?",
      "Neben der Wassermenge zählen Salzgehalt, Grundwasserstand, Abfuhrmöglichkeiten, Boden und Betrieb der Anlage. Ohne geeignetes Management können Salze weiter angereichert werden. Ich prüfe außerdem Kosten, Wissen und Rechte an Wasser und Land, bevor ich eine Technik als vollständige Lösung bezeichne.",
      [
        "Ich nenne Salz- und Wasserhaushalt.",
        "Ich erläutere eine technische Grenze.",
        "Ich ergänze gesellschaftliche Bedingungen.",
      ],
    ),
  },
];

const englishTopics = [
  {
    id: "landscapes",
    title: "Reading landscapes",
    core: "geo-grosslandschaften",
    sources: ["usgs", "lfu"],
    p: [
      "Relief maps show elevation with a key, while land-use maps describe a different property. Germany's broad landscape regions range from northern lowlands to the Alps. Boundaries between them are irregular, and a low basin can occur within an upland region.",
      "Describe a place before explaining its origin. Endogenic processes include uplift, while weathering, erosion and deposition modify the surface. Vocabulary: elevation, scale, uplift, weathering, erosion, deposition. A small-scale map is useful for patterns but hides local details.",
    ],
    q: "Which process removes material from a slope?",
    a: "Erosion",
    w: ["Uplift", "Condensation"],
    prompt: "Explain how uplift and erosion can shape the same mountain.",
    model:
      "Uplift raises rocks over long periods, while weathering loosens material and erosion removes it. These processes may operate at the same time. The current shape therefore reflects both internal forces and surface processes, not just the age of the rock.",
    transfer: "Why do you need a map key before interpreting a green area?",
    response:
      "The colour may indicate low elevation rather than woodland. I first check the map type, key and scale, then describe what the symbol actually represents. A second map can provide evidence for land cover.",
  },
  {
    id: "climate",
    title: "Weather is not climate",
    core: "geo-wetter-klima",
    sources: ["dwd2024", "ipcc-greenhouse"],
    p: [
      "Weather describes atmospheric conditions at a particular time and place. Climate describes longer-term distributions and variability. A single cold week does not settle a question about a long-term warming trend. State the location, unit and reference period of every comparison.",
      "Greenhouse gases absorb and emit parts of Earth's longwave radiation. Additional human emissions change the energy balance. Mitigation addresses causes, while adaptation reduces harmful consequences. Vocabulary: average, reference period, radiation, mitigation, adaptation. These terms describe related but different ideas.",
    ],
    q: "Which example mainly describes adaptation?",
    a: "Providing shaded places during heat",
    w: ["Reducing fossil fuel use at its source", "Replacing coal with lower-emission energy"],
    prompt: "Explain why a cold day does not disprove a warming climate.",
    model:
      "A cold day describes local weather, while a climate trend refers to long-term statistics across a defined period and area. Variability continues in a warming climate. I compare suitable records instead of treating one event as a complete trend.",
    transfer: "A company says its product is climate friendly. What evidence would you ask for?",
    response:
      "I ask for absolute emissions, a reference year, a life-cycle boundary and comparable alternatives. A claim about emissions per unit may hide a larger total output. The evidence should show both the size and the limits of the claimed benefit.",
  },
  {
    id: "food",
    title: "Food security and farming choices",
    core: "geo-hunger",
    sources: ["fao-foodsecurity", "fao-hydroponik"],
    p: [
      "Food security involves availability, access, utilisation and stability. Food can be present in a market yet remain unaffordable for a household. Conflict, poverty and disrupted transport can interact with drought or soil degradation; a larger harvest alone does not remove every barrier.",
      "Hydroponics supplies plants with a nutrient solution rather than soil as the nutrient source. A suitable closed system can save water, but it also needs knowledge, investment and reliable management. Vocabulary: access, nutrients, yield, irrigation, drainage. Compare the same crop and output when evaluating resource use.",
    ],
    q: "Food is on sale but a household cannot afford it. What is the main barrier described?",
    a: "Economic access",
    w: ["Food availability", "Food utilisation"],
    prompt: "Explain why food availability and food access are different.",
    model:
      "Availability means food is physically present, while access includes people's ability to obtain it. A market may be well supplied but a low-income household can still go hungry. Stable income, safe transport and health conditions can therefore matter alongside production.",
    transfer: "Would saving water alone prove that a hydroponic system is sustainable?",
    response:
      "No single resource measure proves overall sustainability. I also examine energy, materials, cost, management and working conditions for the same output. Water savings can be valuable while other impacts or barriers remain.",
  },
  {
    id: "cities",
    title: "Cities for different people",
    core: "geo-nachhaltige-stadt",
    sources: ["un-planning", "mumbai"],
    p: [
      "Cities combine housing, work, services, education and transport. A municipal boundary does not necessarily match the built-up area or commuting region. Comparing cities requires the same definition and year; a photograph of a business district cannot represent every resident's living conditions.",
      "Compact development can shorten journeys but may increase pressure on green space or affordable housing. Relocation can improve a building while making access to work harder. Vocabulary: density, accessibility, displacement, green space. Evaluate plans from several residents' perspectives and make your criteria explicit.",
    ],
    q: "What does accessibility describe in this context?",
    a: "How easily people can reach places and services",
    w: ["Only the maximum height of a building", "Only the age of a city's oldest monument"],
    prompt: "Explain one trade-off in a compact urban development.",
    model:
      "A compact district can offer more homes and shorter routes to services. If it removes too much open space, heat and runoff may increase and places to meet may disappear. A balanced plan considers housing, mobility, green space and who can afford to stay.",
    transfer: "Why might residents disagree about a new transport link?",
    response:
      "Some may gain faster access to work, while others face noise, construction or higher housing costs. I examine the route, affected groups and alternatives, then explain how I weigh benefits and burdens rather than assuming one view represents everyone.",
  },
  {
    id: "population",
    title: "Population change is a balance",
    core: "geo-bevoelkerungsbilanz",
    sources: ["destatis", "un-population"],
    p: [
      "Population change combines births minus deaths with arrivals minus departures. A negative natural balance does not necessarily mean a falling total if net migration is positive. Always distinguish a stock from an annual flow and absolute numbers from rates or shares.",
      "Population projections depend on assumptions about fertility, life expectancy and migration. Regional trends can differ from national or global patterns. Vocabulary: birth, death, arrival, departure, net migration, scenario. An age diagram describes a structure but does not prove every cause behind it.",
    ],
    q: "What is net migration?",
    a: "Arrivals minus departures",
    w: ["Births plus every resident's age", "Deaths minus the number of houses"],
    prompt: "Explain how a population can grow despite more deaths than births.",
    model:
      "More deaths than births create a negative natural balance. If arrivals exceed departures by a larger amount, the positive migration balance more than offsets that loss. Both balances must refer to the same area and period.",
    transfer: "Why should a school planner use several population scenarios?",
    response:
      "Births and migration may differ from current assumptions, particularly in local child age groups. Several scenarios show a range of possible needs. The planner should compare new observations with the assumptions and update decisions rather than treat one number as certain.",
  },
  {
    id: "borders",
    title: "Europe, the EU and changing borders",
    core: "geo-eu-karte",
    sources: ["eu-members", "eu-enlargement"],
    p: [
      "Europe and the European Union are different concepts. At the editorial snapshot of 20 October 2026, the EU has 27 members. Candidate status does not guarantee membership or a date of accession. The Schengen area and the euro area also have their own membership rules.",
      "Globalisation connects local workplaces to international production, trade and political decisions. Changing borders can alter daily mobility without removing every state boundary. Vocabulary: member state, candidate, accession, border, supply chain. Check the date and purpose of a political map before using it.",
    ],
    q: "What does candidate status mean?",
    a: "A state is in the accession process but is not yet a member",
    w: [
      "A state automatically joined yesterday",
      "Every candidate already has an identical negotiation status",
    ],
    prompt: "Use an example to distinguish Europe from the EU.",
    model:
      "Germany is both in Europe and a member of the EU. Norway is a European state outside the EU. Membership is a political status at a stated date, whereas Europe describes a broader geographical and historical space.",
    transfer:
      "Why is a company website insufficient for a full evaluation of a global supply chain?",
    response:
      "It can document the company's own locations and claims but presents an interested perspective. I need additional evidence about working conditions, environmental impacts and local effects, using the same product and life-cycle boundary.",
  },
  {
    id: "local",
    title: "Investigating a local geographical issue",
    core: "geo-nahraumfrage",
    sources: ["lehrplan", "inkar"],
    p: [
      "Choose a real current issue in your own area, such as a planned cycle route or river restoration. Locate it on a map, state the date and ask an open geographical question. A fictional exercise is useful practice but does not replace your local investigation.",
      "Compare a specialist or official source with a news report. Record dates, purposes and limits, then distinguish observations from interpretation and judgement. Vocabulary: evidence, location, stakeholder, criterion, uncertainty. Prepare a presentation that answers your question and acknowledges missing information.",
    ],
    q: "What makes a local judgement transparent?",
    a: "Evidence, explicit criteria and a reasoned comparison",
    w: [
      "A strong opinion with no location or source",
      "Repeating an undated headline without checking it",
    ],
    prompt: "Outline a real local investigation and explain the role of two sources.",
    model:
      "I name my actual local issue, locate it and state an open question. An official or specialist source can explain the plan or data, while a news report may add affected people's perspectives. I compare their dates and limits before drawing a conclusion.",
    transfer: "What would you do if two sources appeared to disagree?",
    response:
      "I check whether they refer to the same place, date and claim. A planned benefit and a current observation may not directly contradict each other. If a real conflict remains, I identify missing evidence and seek another suitable source.",
  },
] as const;

export const english: Lesson[] = englishTopics.map((topic) => ({
  id: `geo-en-${topic.id}`,
  lb: 8,
  optional: true,
  language: "en",
  title: topic.title,
  period: "Optional · Geography in English",
  intro: "Describe patterns, explain connections and support your judgement with evidence.",
  paragraphs: [...topic.p],
  takeaway: "Use precise geographical vocabulary and state what your evidence can and cannot show.",
  sourceIds: [...topic.sources],
  quiz: check(
    topic.q,
    topic.a,
    [...topic.w],
    `Check the definition and context. ${topic.a} is the relevant distinction in this example.`,
  ),
  workshop: classify(
    "Evidence and judgement",
    ["Supported approach", "Claim to revise"],
    [
      [
        "State the place, time and unit of a comparison.",
        0,
        "Comparable definitions make geographical evidence easier to check.",
      ],
      [
        "Assume a single picture proves the situation for everyone.",
        1,
        "One selected view does not represent every place or group.",
      ],
      [
        "Explain a limit and compare another perspective.",
        0,
        "A limitation helps readers understand the scope of the conclusion.",
      ],
    ],
    "Now use the topic vocabulary in your own response.",
  ),
  tasks: tasks(
    topic.prompt,
    topic.model,
    [
      "I use the topic vocabulary accurately.",
      "I explain a connection with an example.",
      "I state a limit or condition.",
    ],
    topic.transfer,
    topic.response,
    [
      "I address the new case.",
      "I give a reason and suitable evidence.",
      "I make the scope of my judgement clear.",
    ],
  ),
}));
