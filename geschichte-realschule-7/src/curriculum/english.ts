import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 8: Bilingualer Sachfachunterricht (optional). */
export const english: Lesson[] = [
  {
    id: "g7-en-village-and-town",
    lb: 8,
    optional: true,
    language: "en",
    title: "Life in the Medieval Village and Town",
    period: "Optional English · Middle Ages",
    span: [950, 1450],
    intro:
      "Most people in medieval England and Germany lived in villages under a lord, while growing towns offered new freedom, trade and guilds.",
    paragraphs: [
      "In both England and Germany, medieval society in the countryside was built on two closely connected systems. Under the feudal system (Lehnswesen), kings granted land to noble lords (vassals) in return for loyalty and military service. In the villages below, the manorial system (Grundherrschaft) tied unfree peasants (serfs) to a lord’s manor: they farmed strips of land, gave part of their harvest to the lord and worked his fields without pay in return for basic protection.",
      "From the eleventh century onwards, towns grew rapidly along rivers, crossroads and castles. In Germany, many free imperial cities (Reichsstädte) governed themselves directly under the emperor, while English towns received royal charters (Stadtrechte) from the king. Behind protective walls, merchants and craftsmen formed guilds (Zünfte) to control prices, quality and training. Runaway serfs who lived undisturbed in a town for a year and a day could become free citizens – expressed in the German saying “Stadtluft macht frei”.",
      "Comparing English and German terms sharpens our historical judgement. Both countries share words like manor and Grundherrschaft, yet differences matter: English kings built a stronger central monarchy early on, whereas German territories grew more independent under regional princes. Useful vocabulary: feudal system = Lehnswesen; manorial system = Grundherrschaft; serf = Hörige/r; guild = Zunft; royal charter = königliches Stadtrecht.",
    ],
    takeaway:
      "The feudal and manorial systems structured rural life in England and Germany, while towns and guilds offered markets, self-government and new liberties.",
    sourceIds: ["lehrplan", "pw-mittelalter", "pw-stadtarch"],
    quiz: check(
      "What is the key difference between the feudal system and the manorial system in medieval Europe?",
      "The feudal system linked kings and nobles, while the manorial system organised peasants and landlords.",
      [
        "The feudal system existed only in cities, whereas the manorial system was used on ocean ships.",
        "The manorial system gave every peasant a seat in the royal parliament with noble lords.",
      ],
      [
        "Cities were organised around town charters, markets and guilds, not rural feudal vassalage.",
        "Unfree serfs on manors had no political seat in a parliament and owed labour and dues to their lord.",
      ],
      "Keeping political loyalty among nobles separate from rural farming duties prevents confusion when comparing England and Germany.",
    ),
    workshop: classify(
      "Village manor or medieval town?",
      ["Village & Manorial System", "Town & Guilds", "England vs. Germany Comparison"],
      [
        [
          "Serfs owe unpaid labour days on the lord’s fields in exchange for protection and a small plot.",
          0,
          "Labour services and harvest dues defined rural life under Grundherrschaft.",
        ],
        [
          "A bakers’ guild sets the price and weight of bread and trains apprentices for several years.",
          1,
          "Guilds regulated quality, prices and training inside town walls.",
        ],
        [
          "If a runaway peasant lives in a town for a year and a day without claim, he gains personal freedom.",
          1,
          "Both German and English towns offered new legal freedom compared with rural serfdom.",
        ],
        [
          "While English kings held tighter control over royal towns, German regional princes ruled many fragmented lands.",
          2,
          "Comparing political power explains why terms never translate identically.",
        ],
        [
          "Vassals swear loyalty to a king or duke and promise knights for military campaigns.",
          0,
          "The feudal bond connected the king and noble landlords above the village.",
        ],
      ],
      "Bilingual comparison shows shared medieval structures across Europe alongside clear political differences.",
    ),
    tasks: {
      1: writing(
        "Explain in English how life in a medieval village differed from life in a medieval town, using at least three historical terms.",
        [
          "Mention serfs/manorial system and citizens/guilds.",
          "Include “Stadtluft macht frei” or town rights.",
        ],
        "In a medieval village, most people were unfree serfs under the manorial system who owed harvest dues and unpaid labour to their lord. In a town, by contrast, citizens enjoyed self-government, held markets and worked as merchants or craftsmen inside strict guilds. A runaway peasant who lived in a town for a year and a day became free from his rural lord.",
        [
          "Village life explained",
          "Town life and guilds described",
          "Three historical terms used accurately",
        ],
      ),
      2: writing(
        "Compare one similarity and one difference between medieval towns in England and Germany.",
        [
          "Look at town rights (charter / Stadtrecht) and royal power.",
          "Write three to four clear sentences in English.",
        ],
        "Both English and German towns relied on markets, protective walls and craft guilds that regulated quality and prices. However, English towns received charters within a stronger central kingdom, whereas many German free imperial cities stood under a weak emperor alongside powerful regional princes. Comparing both languages shows how different political traditions shape urban history.",
        [
          "Clear similarity stated",
          "Political difference between England and Germany explained",
          "Accurate bilingual perspective shown",
        ],
      ),
    },
  },
  {
    id: "g7-en-monks-and-knights",
    lb: 8,
    optional: true,
    language: "en",
    title: "Monks, Monasteries, Knights and Castles",
    period: "Optional English · Middle Ages",
    span: [900, 1300],
    intro:
      "Monasteries and castles stood side by side in the medieval landscape – one built for prayer, learning and care, the other for defence, nobility and rule.",
    paragraphs: [
      "Monks and nuns lived in monasteries (Klöster) following strict rules such as St Benedict’s motto “ora et labora” – pray and work. Beyond daily services in the abbey church, monasteries served as centres of European culture: monks copied ancient and Christian manuscripts in the scriptorium, taught Latin in monastery schools, grew medicinal herbs and sheltered travellers and the sick. Because few laypeople could read, abbots and bishops also advised kings and kept official records.",
      "Knights (Ritter) and castles (Burgen), on the other hand, stood for the warrior nobility. Early medieval castles began as wooden towers on artificial hills, later becoming stone strongholds that guarded valleys, trade routes and manors. Around 1200, under the Staufer emperors in Germany and the Plantagenets in England, knighthood developed a courtly code of honour (chivalry): bravery, loyalty, good manners and protection of the weak – celebrated in songs and tournaments.",
      "Looking critically in both languages reveals the gap between ideal and reality. Stories of courtly knights hide the high cost of armour and the suffering caused to peasants during noble feuds, while even rich monasteries acted as strict landlords over rural serfs. Vocabulary: monastery = Kloster; scriptorium = Schreibstube; knight = Ritter; chivalry = Ritterlichkeit; castle = Burg.",
    ],
    takeaway:
      "Monasteries preserved literacy, medicine and prayer, while castles and chivalry expressed noble military power and courtly ideals.",
    sourceIds: ["lehrplan", "pw-kloster", "pw-ritter", "pw-burg"],
    quiz: check(
      "Why were medieval monasteries vital for kings and the wider society beyond religious prayer?",
      "They preserved books, trained scribes, ran schools and offered medical care and shelter.",
      [
        "They elected seven noble knights each winter to command the royal navy at sea.",
        "They replaced all town markets and banned farmers from growing grain in Europe.",
      ],
      [
        "Monks were prohibited from bearing weapons and did not command fleets; seven Kurfürsten later elected the German king.",
        "Monasteries actually ran model farms and mills that supplied food and worked alongside markets.",
      ],
      "Because literacy was rare outside the Church, monastic scriptoria and schools carried knowledge and administration.",
    ),
    workshop: classify(
      "Monastery or castle?",
      ["Monks & Monasteries", "Knights & Castles", "Ideal vs. Reality"],
      [
        [
          "Brothers spend quiet hours copying Latin manuscripts and tending a herb garden for sick guests.",
          0,
          "Scriptoria and infirmaries made abbeys centres of learning and care.",
        ],
        [
          "Stone keeps, arrow slits and a drawbridge protect a hill overlooking a river crossing.",
          1,
          "Castles combined a noble residence with military control over roads and peasants.",
        ],
        [
          "Poets sing of noble knights defending helpless people, yet real feuds often burned villages.",
          2,
          "Courtly songs expressed ideals that nobles frequently broke in warfare.",
        ],
        [
          "Young noble pages practise riding, heraldry and courtly manners before becoming full warriors.",
          1,
          "Training for knighthood combined combat skills with courtly etiquette around 1200.",
        ],
        [
          "While monks vowed personal poverty, wealthy abbeys collected harvest dues from dependent peasants.",
          2,
          "Large monasteries were both spiritual houses and powerful feudal landlords.",
        ],
      ],
      "Comparing ideal stories with everyday sources helps us see both monasteries and castles realistically.",
    ),
    tasks: {
      1: writing(
        "Describe in English two functions of a medieval monastery and two functions of a medieval castle.",
        [
          "Think of scriptorium/care for monasteries and defence/rule for castles.",
          "Use clear historical nouns like abbot, manuscript, stronghold or chivalry.",
        ],
        "A medieval monastery served first as a religious community following daily prayer rules, and second as a centre of education, book copying and care for sick people and travellers. A castle served first as a fortified stronghold controlling valleys and roads, and second as the residence of a noble lord and his knights.",
        [
          "Two monastery functions named",
          "Two castle functions named",
          "Clear, accurate English vocabulary",
        ],
      ),
      2: writing(
        "Explain why modern adventure films about castles and knights often give a one-sided picture of the Middle Ages.",
        [
          "Compare film scenes of heroic tournaments with real living conditions and noble feuds.",
          "Show why sources matter more than films.",
        ],
        "Adventure films usually focus on glorious tournaments, shining armour and romantic ideals of chivalry. In reality, medieval castles were cold, damp and dark, only wealthy nobles could afford heavy armour, and local feuds often destroyed peasant harvests. Studying real sources rather than modern films gives a far more balanced view.",
        [
          "Film exaggeration identified",
          "Real living conditions or warfare explained",
          "Importance of historical sources stated",
        ],
      ),
    },
  },
  {
    id: "g7-en-new-horizons",
    lb: 8,
    optional: true,
    language: "en",
    title: "New Ways of Thinking: Renaissance, Print and 1492",
    period: "Optional English · Early Modern Period",
    span: [1450, 1550],
    intro:
      "Around 1500, rediscovered ancient learning, Gutenberg’s printing press and oceanic voyages transformed Europe’s view of the world – with contrasting effects across the globe.",
    paragraphs: [
      "The Renaissance (Wiedergeburt) encouraged scholars and artists to study Greek and Roman texts and observe nature directly. Thinkers such as Leonardo da Vinci sketched human anatomy and machines from real observation, while Galileo Galilei later used his telescope to confirm that Earth orbits the Sun. At the same time, Johannes Gutenberg’s printing press (Buchdruck) with movable metal type turned slow hand-copied knowledge into affordable books and pamphlets that crossed borders within weeks.",
      "These new ways of thinking also fuelled oceanic voyages of exploration. Improved ships like the caravel, along with the magnetic compass, helped Portuguese and Spanish sailors look for sea routes to Asian spices without paying Mediterranean middlemen. When Christopher Columbus reached the Caribbean in 1492 sailing west for Spain, he mistakenly believed he had reached India – giving rise to the misnomer “Indians” and connecting Europe with the Americas.",
      "Examining 1492 in both English and German shows why wording reflects perspective. Europeans often spoke of “the discovery of America”, whereas indigenous peoples had lived there for millennia in rich civilisations and suffered conquest, forced labour and deadly Old World diseases. Useful vocabulary: printing press = Buchdruck; movable type = bewegliche Lettern; voyage of exploration = Entdeckungsfahrt; indigenous peoples = Ureinwohner.",
    ],
    takeaway:
      "Renaissance science, printing and voyages around 1492 widened European horizons, while European expansion brought devastating consequences for indigenous peoples.",
    sourceIds: ["lehrplan", "pw-renaissance", "pw-buchdruck", "pw-kolumbus"],
    quiz: check(
      "Why do modern historians often put the phrase “discovery” of America in 1492 in quotation marks?",
      "Indigenous civilisations already lived there, so it was only new from a European viewpoint.",
      [
        "Because Columbus never left Portugal and only drew maps in his private library.",
        "Because European settlers arrived peacefully and never altered local languages or cultures.",
      ],
      [
        "Columbus sailed across the Atlantic under the Spanish crown in 1492 and reached Caribbean islands.",
        "Spanish and later European conquest brought devastating violence, forced labour and infectious diseases.",
      ],
      "Language itself carries perspective: placing “discovery” in quotation marks reminds us to include non-European viewpoints.",
    ),
    workshop: classify(
      "New ways of thinking and multiple perspectives",
      ["Renaissance & Print", "Voyages & Consequences", "Perspective Check"],
      [
        [
          "Movable metal letters allow printers to produce hundreds of copies quickly at lower cost.",
          0,
          "Gutenberg’s press accelerated the spread of Renaissance and Reformation ideas.",
        ],
        [
          "European ships seek direct sea routes for pepper, cinnamon and silk around Africa or across the Atlantic.",
          1,
          "Economic competition and navigational tools drove overseas expeditions.",
        ],
        [
          "For Aztec and Inca societies, European arrival brought conquest, silver mining and European diseases.",
          1,
          "Expansion reshaped the Americas through dramatic population loss and colonial rule.",
        ],
        [
          "Asking how an Indigenous witness experienced 1492 balances a purely European celebration.",
          2,
          "Multiperspectivity prevents treating one group’s viewpoint as the whole story.",
        ],
        [
          "Translating “Entdeckung” as “discovery” still invites the question: new for whom?",
          2,
          "Comparing English and German terms exposes hidden eurocentric assumptions.",
        ],
      ],
      "Critical historical thinking connects technical change, global consequences and careful word choice in every language.",
    ),
    tasks: {
      1: writing(
        "Explain in English how Gutenberg’s printing press and new navigation tools changed Europe around 1500.",
        [
          "Describe one effect of printing on books and ideas.",
          "Describe one effect of compass/caravel on sea routes.",
        ],
        "Gutenberg’s printing press with movable metal type made books much cheaper and spread Renaissance learning and debates rapidly across Europe. At the same time, improved ships such as caravels and tools like the compass allowed sailors to cross open oceans. Together, faster communication and global sea travel marked the transition towards the early modern world.",
        [
          "Impact of printing explained",
          "Impact of ships or navigation explained",
          "Clear historical vocabulary used",
        ],
      ),
      2: writing(
        "Discuss in English why the year 1492 should be told from both European and Indigenous perspectives.",
        [
          "Contrast European motives/gains with Indigenous losses.",
          "Explain why one single viewpoint distorts history.",
        ],
        "From a European viewpoint, 1492 opened new trade networks, wealth and geographical knowledge across the Atlantic. For Indigenous peoples in the Americas, however, European arrival brought violent conquest, forced labour and devastating diseases that killed millions. Telling both perspectives together shows the full human cost alongside global change.",
        [
          "European perspective described",
          "Indigenous perspective described",
          "Need for balanced narrative justified",
        ],
      ),
    },
  },
];
