import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Optional English-language deepening; the core path never depends on these lessons. */
export const english: Lesson[] = [
  {
    id: "g10-en-postwar",
    lb: 8,
    optional: true,
    language: "en",
    title: "Britain, the USA and post-war Germany",
    period: "1945–1949",
    intro:
      "The Western Allies shaped the new West German state. Their aims changed from punishment to partnership.",
    paragraphs: [
      "At the Potsdam Conference in July and August 1945, the USA, the Soviet Union and Britain agreed on occupation zones, denazification and reparations. Britain was represented first by Winston Churchill and then by Clement Attlee, who won the British election during the conference. The British zone lay in the north-west and included the industrial Ruhr; the American zone included Bavaria.",
      "Soon the Western Allies feared that poverty and hunger would help communism spread. The American diplomat George F. Kennan argued for containment: Soviet expansion should be stopped by firm and patient pressure. In 1947 the American and British zones were joined as the Bizone. The Marshall Plan (European Recovery Program) provided about 13 billion dollars of aid to Western Europe from 1948. Its aims were economic recovery and political stability, and it also tied Western Europe more closely to the USA.",
      "Vocabulary: occupation zone – Besatzungszone; denazification – Entnazifizierung; reparations – Reparationen; containment – Eindämmung; aid – Hilfe; recovery – Wiederaufbau, Erholung. Compare British and American sources with German ones: the same aid could be described as generosity, self-interest or both.",
    ],
    takeaway:
      "Britain and the USA moved from occupation and punishment towards containment and recovery; the Marshall Plan linked aid with Western interests.",
    sourceIds: ["us-kennan", "us-marshall", "lemo-potsdam"],
    quiz: check(
      "What did the policy of containment aim to do?",
      "Stop the further spread of Soviet communism.",
      [
        "Return Germany to its borders of 1914.",
        "Remove all American troops from Europe.",
      ],
      [
        "The Allies never planned to restore Germany's 1914 borders.",
        "Containment kept American troops in Europe.",
      ],
      "Kennan's idea shaped the Truman Doctrine and the Marshall Plan.",
    ),
    workshop: classify(
      "Motives behind Western policy",
      ["Security", "Economy", "Democracy"],
      [
        ["Keep Soviet influence out of Western Europe.", 0, "Containment was a security strategy."],
        ["Rebuild trade so that European countries can buy American goods.", 1, "Recovery also served American economic interests."],
        ["Allow licensed newspapers and political parties.", 2, "Democratic life was to grow again."],
        ["Join the British and American zones to make the economy work better.", 1, "The Bizone was an economic step with political effects."],
      ],
      "Aid can have several motives at once. Explaining a motive is not the same as judging the policy.",
    ),
    tasks: {
      1: writing(
        "Explain why the Western Allies changed their policy towards Germany after 1945.",
        ["Fear of communism.", "Economic recovery of Europe."],
        "At first the Allies wanted to punish Germany and prevent another war. As the conflict with the Soviet Union grew, they feared that hunger and poverty would make communism attractive. They therefore supported recovery through the Bizone and the Marshall Plan and saw West Germany as a future partner.",
        ["First aims", "Reason for change", "New policy"],
      ),
      2: writing(
        "Evaluate the statement: The Marshall Plan was pure generosity.",
        ["Humanitarian and political motives.", "Effects on Europe."],
        "The Marshall Plan helped millions of people and supported Europe's recovery. It also served American interests: it stabilised allies, opened markets and contained Soviet influence. The Soviet Union rejected it for its sphere. It was therefore generous and strategic at the same time, not pure generosity.",
        ["Generous side", "Strategic side", "Balanced judgement"],
      ),
    },
  },
  {
    id: "g10-en-airlift",
    lb: 8,
    optional: true,
    language: "en",
    title: "Berlin: blockade, airlift and crisis",
    period: "1948–1963",
    intro:
      "Berlin became the front line of the Cold War. Twice it stood at the centre of a crisis between East and West.",
    paragraphs: [
      "After the currency reform in the Western zones, the Soviet Union blocked all land and water routes to West Berlin from 24 June 1948. The Western Allies decided not to give up the city. In the Berlin Airlift, American and British planes flew food, coal and medicine into West Berlin for almost eleven months, delivering about 2.3 million tons of supplies. Berliners called the planes „Rosinenbomber“ because pilots dropped sweets for children. The blockade ended on 12 May 1949.",
      "In 1958 the Soviet leader Nikita Khrushchev demanded that the Western powers leave Berlin. They refused. When East Germany built the Wall in August 1961, the West protested but did not use force, as its rights in West Berlin were not touched. In October 1961, American and Soviet tanks faced each other at Checkpoint Charlie. In June 1963 President Kennedy visited the city and declared his solidarity in German: „Ich bin ein Berliner.“",
      "Vocabulary: blockade – Blockade; airlift – Luftbrücke; supplies – Versorgungsgüter; sector – Sektor; checkpoint – Grenzübergang; solidarity – Solidarität. The airlift changed how many West Berliners saw the Americans and British: former enemies became protectors.",
    ],
    takeaway:
      "The Berlin Airlift of 1948/49 and the Berlin crisis of 1958 to 1961 made Berlin a symbol of the Cold War and of Western commitment to West Berlin.",
    sourceIds: ["us-airlift", "lemo-blockade", "lemo-mauerbau"],
    quiz: check(
      "How did the Western Allies respond to the Berlin Blockade?",
      "They supplied West Berlin by air for almost eleven months.",
      [
        "They sent tanks to break through the Soviet zone.",
        "They handed West Berlin over to the Soviet Union.",
      ],
      [
        "A military breakthrough was considered too dangerous; the airlift avoided open war.",
        "The Western Allies stayed in West Berlin until 1994.",
      ],
      "The airlift showed that the West would defend West Berlin without starting a war.",
    ),
    workshop: timeline(
      [
        ["Currency reform in the Western zones (June 1948)", "The Soviet Union reacts with a blockade."],
        ["The blockade and the airlift begin (24 June 1948)", "Planes supply West Berlin."],
        ["The blockade ends (12 May 1949)", "The airlift has succeeded."],
        ["Khrushchev's Berlin ultimatum (1958)", "A new Berlin crisis begins."],
        ["The building of the Wall (13 August 1961)", "The border in Berlin is closed."],
        ["Kennedy's speech in Berlin (June 1963)", "The USA shows its solidarity."],
      ],
      "Each crisis tested whether the West would stay in Berlin. Each time, it stayed but avoided war.",
    ),
    tasks: {
      1: writing(
        "Explain why the Berlin Airlift changed how many West Berliners saw the Western Allies.",
        ["Who had they been in 1945?", "What did the airlift mean for daily life?"],
        "In 1945 the Americans and British had been enemies and occupiers. During the blockade their planes brought food and coal and kept the city alive. Many West Berliners now saw them as protectors and partners, a view that strengthened ties with the West.",
        ["Situation in 1945", "Effect of the airlift", "Change of view"],
      ),
      2: writing(
        "Compare the Western reaction to the blockade in 1948 and to the Wall in 1961.",
        ["What was threatened each time?", "Action and limits."],
        "In 1948 the blockade threatened the survival of West Berlin, so the Western Allies acted with the airlift. In 1961 the Wall closed the border but did not touch Western rights in West Berlin, so the West protested without using force. Both times the West defended its position in the city while avoiding war.",
        ["1948", "1961", "Comparison"],
      ),
    },
  },
  {
    id: "g10-en-india",
    lb: 8,
    optional: true,
    language: "en",
    title: "Decolonisation: India and Partition",
    period: "1919–1948 and today",
    intro:
      "India won its independence from Britain in 1947. Independence came together with Partition, one of the largest migrations in history.",
    paragraphs: [
      "The Indian National Congress demanded self-rule. Mahatma Gandhi led mass campaigns of non-violent resistance, such as the Salt March of 1930 and the Quit India movement of 1942. The Muslim League under Muhammad Ali Jinnah feared domination by the Hindu majority and demanded a separate state, Pakistan. After the Second World War, Britain was weakened and decided to leave.",
      "On 14 and 15 August 1947, Pakistan and India became independent. The new border divided the provinces of Punjab and Bengal. Millions of Hindus, Sikhs and Muslims fled across it, often in fear of violence; estimates speak of 10 to 20 million people displaced and hundreds of thousands, perhaps up to two million, killed. In January 1948 Gandhi was murdered by a Hindu nationalist.",
      "The consequences are still visible: India and Pakistan have fought several wars, above all over Kashmir, and both have nuclear weapons. Families remember Partition differently in India, Pakistan, Bangladesh and Britain; oral history projects collect their stories. Vocabulary: independence – Unabhängigkeit; partition – Teilung; non-violent resistance – gewaltfreier Widerstand; displaced – vertrieben; communal violence – Gewalt zwischen Religionsgruppen.",
    ],
    takeaway:
      "India's independence in 1947 ended British rule but came with Partition, mass flight and violence whose consequences still shape South Asia.",
    sourceIds: ["partition-archive", "lehrplan"],
    quiz: check(
      "What happened during the Partition of India in 1947?",
      "Millions of people fled across the new border between India and Pakistan.",
      [
        "Britain divided India among several European colonial powers.",
        "India and Pakistan agreed to form one peaceful federal state.",
      ],
      [
        "Britain gave up its rule; no other European power took over.",
        "Two separate states were created, not a federation.",
      ],
      "Partition was accompanied by mass migration and violence between religious communities.",
    ),
    workshop: timeline(
      [
        ["Salt March led by Gandhi (1930)", "Non-violent protest against British rule."],
        ["Quit India movement (1942)", "Congress demands that Britain leave India."],
        ["Independence of Pakistan and India (August 1947)", "British rule ends with Partition."],
        ["Gandhi is murdered (January 1948)", "The leader of non-violence is killed."],
      ],
      "Independence was won largely through political pressure, but Partition turned it into a time of great suffering.",
    ),
    tasks: {
      1: writing(
        "Explain why British India was divided into two states.",
        ["Demands of the Muslim League.", "Britain's position after 1945."],
        "The Muslim League feared that Muslims would be dominated by the Hindu majority in an independent India and demanded its own state, Pakistan. Britain was weakened by the war and wanted to leave quickly. No agreement on a united state was reached, so the country was divided in 1947.",
        ["Muslim League", "British position", "Result"],
      ),
      2: writing(
        "Evaluate the statement: Decolonisation in India was a peaceful process.",
        ["Gandhi's non-violence.", "Violence during Partition."],
        "The struggle for independence used mainly non-violent methods, and Britain left without a long colonial war. But Partition caused mass flight and killings on a huge scale, and the conflict over Kashmir continues today. The process was therefore peaceful in its methods of resistance but not in its consequences.",
        ["Peaceful aspects", "Violent aspects", "Balanced judgement"],
      ),
    },
  },
  {
    id: "g10-en-cold-war",
    lb: 8,
    optional: true,
    language: "en",
    title: "Cold War: missiles, jungle war and the race to the Moon",
    period: "1957–1975",
    intro:
      "The Cold War was fought with threats, with proxy wars and in space. Three examples show its different faces.",
    paragraphs: [
      "In October 1962 the discovery of Soviet missiles in Cuba brought the world close to nuclear war. President Kennedy ordered a naval quarantine; secret talks led to a compromise in which the Soviet Union withdrew its missiles and the USA promised not to invade Cuba. Afterwards a direct hotline between Washington and Moscow was set up.",
      "In Vietnam the USA fought against the communist North and the Viet Cong. More than 500,000 American soldiers were stationed there at the peak. The war killed millions of Vietnamese and over 58,000 Americans, and protests spread across the USA and the world. The Americans withdrew in 1973, and in 1975 the North conquered the South.",
      "In space the superpowers competed for prestige. The Soviet Union launched the first satellite, Sputnik, in 1957 and sent the first man, Yuri Gagarin, into space in 1961. Kennedy announced the goal of a Moon landing, and on 20 July 1969 Neil Armstrong and Buzz Aldrin of Apollo 11 walked on the Moon. Vocabulary: missile – Rakete; quarantine – Seeblockade; proxy war – Stellvertreterkrieg; arms race – Wettrüsten; space race – Wettlauf ins All.",
    ],
    takeaway:
      "The Cold War appeared as a nuclear crisis in Cuba, a proxy war in Vietnam and a race for prestige in space.",
    sourceIds: ["us-cuba", "us-vietnam", "nasa-apollo"],
    quiz: check(
      "Why did the USA and the Soviet Union compete in space?",
      "Success in space showed technological and political strength.",
      [
        "They had agreed to share all space research.",
        "They wanted to move their populations to the Moon.",
      ],
      [
        "Cooperation came later, for example in 1975; in the 1960s they competed.",
        "Space flight was about prestige and military technology, not settlement.",
      ],
      "Each success was presented as proof that one's own system was superior.",
    ),
    workshop: classify(
      "Faces of the Cold War",
      ["Nuclear crisis", "Proxy war", "Competition for prestige"],
      [
        ["Soviet missiles are discovered in Cuba.", 0, "The superpowers faced each other directly."],
        ["The USA sends combat troops to South Vietnam.", 1, "The superpowers supported opposing sides."],
        ["Yuri Gagarin becomes the first man in space.", 2, "The Soviet Union celebrated a symbolic victory."],
        ["Apollo 11 lands on the Moon.", 2, "The USA reached Kennedy's goal."],
        ["China and the Soviet Union supply North Vietnam with weapons.", 1, "Support for allies instead of direct war."],
      ],
      "The Cold War was more than a military conflict; it was a competition between two systems in many areas.",
    ),
    tasks: {
      1: writing(
        "Explain what the term proxy war means, using Vietnam as an example.",
        ["Who fought, who supported?", "Why no direct war?"],
        "In a proxy war, great powers do not fight each other directly but support opposing sides. In Vietnam the USA fought alongside South Vietnam, while the Soviet Union and China supplied the North. A direct war between the superpowers was avoided because of the danger of nuclear war.",
        ["Definition", "Example", "Reason"],
      ),
      2: writing(
        "Assess which of the three examples shows best what the Cold War was about.",
        ["Compare Cuba, Vietnam and space.", "Give a criterion for your choice."],
        "The Cuban Missile Crisis shows the danger of nuclear war, Vietnam shows the human cost of proxy wars, and the space race shows the competition between two systems. I think the space race shows best what the Cold War was about, because it was a contest over which system was better, without direct fighting. The other two show its dangers and costs.",
        ["Comparison", "Criterion", "Justified choice"],
      ),
    },
  },
];
