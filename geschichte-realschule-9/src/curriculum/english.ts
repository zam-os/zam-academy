import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Optional English-language deepening; the core path never depends on these lessons. */
export const english: Lesson[] = [
  {
    id: "g-en-empire",
    lb: 8,
    optional: true,
    language: "en",
    title: "Empire: whose story?",
    period: "Age of Imperialism",
    intro:
      "Words can reveal a viewpoint. Compare claims of imperial power with the experiences they leave out.",
    paragraphs: [
      "The British Empire connected territories through unequal relations of power, trade and military control. Economic interests and strategic routes were important, alongside national prestige and racist ideas. People in colonised societies resisted, adapted and pursued their own aims.",
      "A description of new railways alone cannot establish that imperial rule benefited everyone. Ask who made decisions, who worked, who paid and who could refuse. Vocabulary: empire – Weltreich; colonial rule – Kolonialherrschaft; resistance – Widerstand; exploitation – Ausbeutung.",
    ],
    takeaway:
      "An account of empire must examine unequal power and the perspectives of colonised people.",
    sourceIds: ["kolonien", "lehrplan"],
    quiz: check(
      "Which question helps examine an imperial claim of progress?",
      "Who controlled decisions, and who carried the costs?",
      [
        "How can the ruler's description replace all other evidence?",
        "Why should the existence of a railway prove equal rights?",
      ],
      "Infrastructure alone does not establish consent, equality or shared benefits.",
    ),
    workshop: classify(
      "Viewpoints and evidence",
      ["Imperial claim", "Question about affected people", "Unsupported conclusion"],
      [
        [
          "An official report presents new transport as evidence of progress.",
          0,
          "The report has an author, purpose and audience.",
        ],
        [
          "What happened to the land and labour of local communities?",
          1,
          "The question adds perspectives absent from the official claim.",
        ],
        [
          "A railway proves that everyone supported colonial rule.",
          2,
          "A material structure cannot demonstrate universal consent.",
        ],
      ],
      "Use several sources; explaining a claim does not mean accepting it.",
    ),
    tasks: {
      1: writing(
        "Explain why an official report about a railway is not a complete history of empire.",
        ["Consider author and purpose.", "Add the perspective of local communities."],
        "The report may highlight the aims and achievements of the colonial administration. It does not by itself show local consent or the distribution of costs. Evidence about land, labour and resistance is needed to examine unequal power.",
        ["Author and purpose", "Missing perspective", "Further evidence"],
      ),
      2: writing(
        "Evaluate the claim: Building infrastructure makes colonial rule legitimate.",
        [
          "Separate a possible benefit from political rights.",
          "State a criterion for your judgement.",
        ],
        "Infrastructure may have different effects, but it does not justify coercion or unequal rights. A judgement needs evidence about who controlled and benefited from it. Equal dignity and self-determination are criteria that an official account of progress cannot replace.",
        ["Claim examined", "Evidence required", "Criterion stated"],
      ),
    },
  },
  {
    id: "g-en-britain-1914",
    lb: 8,
    optional: true,
    language: "en",
    title: "Britain and the road to war",
    period: "1914",
    intro: "Long-term rivalry shaped decisions, but did not make a particular decision automatic.",
    paragraphs: [
      "The naval arms race increased tension between Britain and Germany. British leaders also considered the European balance of power and the security of France and Belgium. These interests shaped debate without removing political choice.",
      "Germany's invasion of neutral Belgium was central to Britain's entry into the war on 4 August 1914. A complete explanation connects this immediate crisis with longer-term concerns. Vocabulary: arms race – Wettrüsten; neutrality – Neutralität; invasion – Einmarsch; balance of power – Mächtegleichgewicht.",
    ],
    takeaway:
      "Britain's entry in August 1914 connected an immediate crisis over Belgium with longer-term strategic concerns.",
    sourceIds: ["iwm1914", "wk1"],
    quiz: check(
      "Which event was central to Britain's entry into the war in August 1914?",
      "Germany's invasion of neutral Belgium.",
      ["Germany's invasion of the Soviet Union.", "Germany's annexation of Austria."],
      "The other events belong to 1941 and 1938, not the July crisis of 1914.",
    ),
    workshop: classify(
      "Conditions and decisions",
      ["Long-term tension", "Immediate crisis", "Political decision"],
      [
        [
          "The naval arms race between Britain and Germany",
          0,
          "This tension developed before the summer crisis.",
        ],
        ["The invasion of neutral Belgium", 1, "It intensified the immediate conflict."],
        [
          "Britain declares war on Germany on 4 August 1914.",
          2,
          "A government makes a decision within a historical situation.",
        ],
      ],
      "Avoid describing alliances as a machine that made people act without choices.",
    ),
    tasks: {
      1: writing(
        "Explain Britain's entry into the war using a long-term concern and an immediate event.",
        ["Use the terms arms race and neutrality.", "Connect the examples with a reason."],
        "The naval arms race had increased mistrust and Britain was concerned about the balance of power. Germany's invasion of neutral Belgium created an immediate crisis. British leaders decided to enter the war on 4 August 1914.",
        ["Long-term concern", "Immediate event", "Decision explained"],
      ),
      2: writing(
        "Why is Britain had no choice an inadequate historical explanation?",
        ["Pressure does not eliminate agency.", "Ask about options and evidence."],
        "Strategic interests and the Belgian crisis created strong pressure, but leaders still debated and decided. A historical explanation must examine their options, aims and evidence. Calling the outcome automatic hides the role of political agency.",
        ["Conditions recognised", "Agency explained", "Evidence required"],
      ),
    },
  },
  {
    id: "g-en-allies",
    lb: 8,
    optional: true,
    language: "en",
    title: "Britain, the USA and a global war",
    period: "1939–1945",
    intro:
      "The war had different starting points and involved many societies, not just two allies.",
    paragraphs: [
      "Britain entered the war in 1939 after Germany attacked Poland. The USA entered the war in December 1941 after Japan attacked Pearl Harbor; Germany then declared war on the USA. Britain and the USA became central partners within a wider Allied coalition.",
      "The Soviet Union, China, occupied societies and people from colonial territories also played essential roles and suffered enormous losses. A narrative focused only on Britain and the USA leaves out much of the global war. Vocabulary: allies – Verbündete; coalition – Bündnis; occupation – Besatzung; surrender – Kapitulation.",
    ],
    takeaway: "Britain and the USA were important Allies within a wider global coalition and war.",
    sourceIds: ["wk2", "lehrplan"],
    quiz: check(
      "Which statement places the USA's entry into World War II correctly?",
      "The USA entered in December 1941 after the attack on Pearl Harbor.",
      [
        "The USA entered in September 1939 after the German attack on Poland.",
        "The USA entered in January 1933 after Hitler became chancellor.",
      ],
      "Britain and the USA entered the war at different times.",
    ),
    workshop: timeline(
      [
        [
          "Germany attacks Poland; Britain enters the war",
          "September 1939: The war begins in Europe.",
        ],
        ["Germany attacks the Soviet Union", "June 1941: The war in the east escalates."],
        [
          "Japan attacks Pearl Harbor; the USA enters the war",
          "December 1941: The war becomes further interconnected.",
        ],
        ["Germany surrenders", "May 1945: The European war ends; war in Asia continues."],
      ],
      "A global explanation needs multiple regions and perspectives.",
    ),
    tasks: {
      1: writing(
        "Compare Britain's and the USA's entry into the war.",
        ["Use the correct years and events.", "State one consequence."],
        "Britain entered in 1939 after Germany attacked Poland. The USA entered in December 1941 after Pearl Harbor, followed by Germany's declaration of war. Their cooperation became part of a wider Allied coalition.",
        ["Britain correctly placed", "USA correctly placed", "Wider coalition"],
      ),
      2: writing(
        "What would you add to a history of World War II that presents only Britain and the USA?",
        ["Include other regions and actors.", "Explain why those additions matter."],
        "I would include the Soviet Union, China, occupied societies and people from colonial territories. Their actions, experiences and losses are essential to understanding a global war. Adding them changes both the account of victory and the understanding of its human costs.",
        ["Other actors", "Human experiences", "Importance explained"],
      ),
    },
  },
  {
    id: "g-en-civil-rights",
    lb: 8,
    optional: true,
    language: "en",
    title: "Civil Rights: equality in practice",
    period: "USA · 1950s–1960s",
    intro:
      "Legal promises of equality did not end segregation. Activists demanded change through collective action.",
    paragraphs: [
      "The Civil Rights Movement challenged racial segregation and barriers to political participation in the USA. Boycotts, legal challenges and demonstrations involved many local organisers, not only famous leaders. Activists faced intimidation and violence.",
      "The Civil Rights Act of 1964 and the Voting Rights Act of 1965 were major achievements. They did not instantly remove discrimination or unequal living conditions. Vocabulary: segregation – rassistische Trennung; voting rights – Wahlrechte; protest – Protest; enforcement – Durchsetzung.",
    ],
    takeaway:
      "Civil rights activism connected legal equality with demands for effective protection and participation.",
    sourceIds: ["civilrights", "selma", "un"],
    quiz: check(
      "What did the Civil Rights Movement challenge?",
      "Racial segregation and barriers to equal participation.",
      [
        "Universal access to voting and equal protection already achieved.",
        "The existence of all peaceful protest and legal challenges.",
      ],
      "Legal promises needed social action and effective enforcement.",
    ),
    workshop: classify(
      "Rights and change",
      ["Problem", "Form of action", "Achievement with limits"],
      [
        [
          "Racial segregation restricts access to public places.",
          0,
          "A legal or social barrier can contradict equality.",
        ],
        [
          "Communities organise boycotts and demonstrations.",
          1,
          "Collective action challenges exclusion.",
        ],
        [
          "New laws strengthen rights, but discrimination does not disappear at once.",
          2,
          "A law and its practical implementation must be distinguished.",
        ],
      ],
      "A historical account connects local activism, institutions and continuing challenges.",
    ),
    tasks: {
      1: writing(
        "Explain the difference between a promise of equality and effective civil rights.",
        ["Use segregation as a problem.", "Explain the need for enforcement."],
        "A promise states that people should have equal rights. Segregation and barriers to voting showed that the promise was not fully realised. Activism and legislation aimed to secure participation and protection in practice, which also required enforcement.",
        ["Promise explained", "Historical barrier", "Enforcement"],
      ),
      2: writing(
        "Evaluate a history that credits one famous person with ending all discrimination in 1964.",
        [
          "Consider collective action and the date 1965.",
          "Distinguish legal change from social reality.",
        ],
        "The account overlooks local organisers, many forms of action and continued struggles. The Voting Rights Act followed in 1965. Even major legal achievements did not instantly end discrimination. An adequate explanation combines individuals, movements, laws and remaining inequalities.",
        ["Collective action", "Chronology", "Limits of legal change"],
      ),
    },
  },
];
