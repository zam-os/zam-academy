import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB6: Lesson[] = [
  {
    id: "en-supply-demand",
    lb: 6,
    unit: "6",
    title: "Supply, demand and the economic cycle",
    intro: "How buyers and sellers find a price, and how money and work flow in a circle between households and companies.",
    paragraphs: [
      "On a market, buyers and sellers meet. **Demand** is the amount that buyers want to buy at a certain price. **Supply** is the amount that sellers want to sell at that price. When the price is high, fewer people want to buy, so the amount demanded falls. At the same time, more sellers want to sell, so the amount supplied rises. Imagine a school flea market with used comics. At 1 euro, many children would buy, but few owners would sell. At 10 euros, the opposite is true.",
      "The price at which both sides agree is the **equilibrium price**. At this price, the amount that buyers want equals the amount that sellers want. If the price is higher, there is a **surplus**: sellers have more goods than buyers want, so they lower the price. If the price is lower, there is a **shortage**: more people want to buy than there are goods, so the price rises. In the model below, move the price and watch the gap between the two lines. Then move one line, for example after a bad harvest, when sellers offer less at every price, and find the new equilibrium price.",
      "Markets are connected in the **circular flow**, also called the **economic cycle** (German: Wirtschaftskreislauf). Do not confuse it with the business cycle (Konjunktur), which describes booms and recessions. Households offer their work to companies and receive wages. With their wages, households buy goods and services, so companies receive money from sales. Companies use this money to pay wages again. The circle is a simple model: in reality, people also save, pay taxes and trade with other countries. But the model shows that households and companies depend on each other. When households spend less, companies sell less and may need fewer workers.",
      "Division of work means that people specialise in different tasks. Today, a product can move between several countries before you buy it. For example, a German bicycle maker can buy components in France and sell assembled bikes in Austria. These are EU member states. Cooperation can help firms find skills and customers. Relying on one distant supplier can also cause delays. Check the EU countries list and discuss both effects with a partner.",
    ],
    terms: [
      { term: "supply", text: "The amount of a good that sellers want to sell at a certain price (Angebot)." },
      { term: "demand", text: "The amount of a good that buyers want to buy at a certain price (Nachfrage)." },
      { term: "equilibrium price", text: "The price at which supply and demand are equal, so nothing is left over and nobody is left out (Gleichgewichtspreis)." },
      {
        term: "surplus and shortage",
        text: "Surplus: more goods are offered than wanted. Shortage: more goods are wanted than offered (Angebotsüberhang, Nachfrageüberhang).",
      },
      {
        term: "circular flow (economic cycle)",
        text: "The flow of money, goods and work between households and companies, not to be confused with the business cycle (Wirtschaftskreislauf, not Konjunktur).",
      },
    ],
    takeaway:
      "At the equilibrium price, supply and demand are equal. A higher price leads to a surplus and the price falls; a lower price leads to a shortage and the price rises. In the circular flow (economic cycle), households and companies depend on each other.",
    optional: true,
    sourceIds: ["lp", "eu"],
    quiz: {
      question: "What happens on a market when the price is lower than the equilibrium price?",
      answer: "More people want to buy than there are goods, so there is a shortage and the price tends to rise.",
      wrong: [
        "More goods are offered than buyers want, so there is a surplus and the price tends to fall.",
        "Supply and demand are equal at every price below it, so the price tends to stay the same.",
      ],
      explanation:
        "At a low price, many buyers want the goods, but sellers offer fewer. Buyers outbid each other, and the price rises. A surplus appears when the price is too high, not too low.",
    },
    workshop: {
      kind: "classify",
      title: "Surplus, shortage or equilibrium?",
      instruction: "Match each situation with the right market situation.",
      categories: ["Surplus", "Shortage", "Equilibrium"],
      entries: [
        {
          text: "A café sells hot chocolate for 6 euros. At the end of a warm day, half of the cups are still unsold.",
          target: 0,
          feedback: "More was offered than customers wanted at that price.",
        },
        {
          text: "A new game console is sold out everywhere, and many fans are on a waiting list.",
          target: 1,
          feedback: "More people want to buy than there are consoles.",
        },
        {
          text: "At the end of the market day, a farmer has sold all her apples at the price she set, and nobody asked for more.",
          target: 2,
          feedback: "The amount offered and the amount wanted were equal.",
        },
        {
          text: "Heavy rain ruins the strawberry harvest. Few berries reach the market, but many people still want them.",
          target: 1,
          feedback: "Sellers can offer less at every price, while buyers still want the same amount, so buyers compete.",
        },
        {
          text: "A shop still has 200 umbrellas in July because nobody wants them in sunny weather.",
          target: 0,
          feedback: "At this price, demand is much lower than the amount offered.",
        },
      ],
      conclusion: "Compare the amount offered with the amount wanted at the given price, and you see where the price will move.",
    },
    casework: {
      title: "The festival food truck",
      story:
        "**Hanna** runs the only noodle stand at a summer festival. She has **60 portions** of noodles ready every day and offers all of them at any price. At **6 euros**, only 30 people want a portion. At **4 euros**, 60 people want one. At **3 euros**, 90 people want one. Hanna also pays her helper Jonas a wage for the day.",
      steps: [
        {
          question: "What is the situation at a price of 6 euros?",
          options: [
            "A shortage: more people want to buy than there are portions.",
            "A surplus: Hanna offers 60 portions, but only 30 people want one.",
            "Equilibrium: all wishes of buyers and sellers fit together.",
          ],
          answer: 1,
          explanation: "At 6 euros, only half of the portions would be sold. The offered amount is higher than the wanted amount.",
        },
        {
          question: "Which price is the equilibrium price?",
          options: ["3 euros", "6 euros", "4 euros"],
          answer: 2,
          explanation: "At 4 euros, 60 people want a portion and Hanna offers 60. Both amounts are equal.",
        },
        {
          question: "At 3 euros, 90 people want a portion, but Hanna has only 60. What does the market model suggest?",
          options: [
            "Lower the price even more, so that she can sell more.",
            "Raise the price, because more people want to buy than there are portions.",
            "Do nothing, because a shortage disappears without any change of the price.",
          ],
          answer: 1,
          explanation: "With a shortage, buyers would pay more. A higher price brings the amount demanded down towards her 60 portions.",
        },
        {
          question: "Hanna pays Jonas a wage, and Jonas buys food with it. How does this fit the economic cycle?",
          options: [
            "Households pay wages to companies, which then buy goods from households.",
            "Companies pay wages to households, and households spend the money on goods.",
            "Wages are not part of the cycle; only the sales of companies to households count.",
          ],
          answer: 1,
          explanation: "Companies pay wages to households. Households spend them on goods, so the money returns to companies.",
        },
      ],
      verdict:
        "At 4 euros, supply and demand are equal, so Hanna sells all her portions. A price that is too high leaves food unsold, and a price that is too low leaves some people without a portion. Jonas’s wage returns to companies when he spends it.",
    },
    tasks: {
      1: {
        prompt:
          "Explain in your own words what happens to the price when there is a surplus, and why the market moves towards the equilibrium price.",
        hints: ["Who has too much, the buyers or the sellers?", "How do the sellers react?"],
        model:
          "A surplus means that sellers offer more goods than buyers want to buy at that price. Sellers do not want to keep goods that nobody buys, so they lower the price. At a lower price, more people want to buy, and fewer sellers want to sell. This goes on until both amounts are equal. Then the market is in equilibrium, and the price stays stable.",
        criteria: [
          "Describes a surplus correctly (more supply than demand)",
          "Explains how the sellers react (they lower the price)",
          "Names the result: supply and demand become equal",
        ],
      },
      2: {
        prompt:
          "A friend says: “If all households save more money, companies will do better, because there is more money in the bank.” Use the circular flow (economic cycle) to judge this statement.",
        hints: ["Where does the income of companies come from?", "What happens to wages if companies sell less?"],
        model:
          "I do not agree completely. In the circular flow, companies earn money when households buy goods, so less spending means fewer sales. Companies may then produce less and pay fewer wages, so households have less income, and the circle shrinks. Saving can be useful for the future, and banks lend saved money to companies, but the simple model does not show this. So the statement is too simple.",
        criteria: [
          "Explains where companies get their income (sales to households)",
          "Describes the effect of less spending on sales and wages",
          "Makes a judgement and mentions a limit of the simple model",
        ],
      },
    },
  },

  {
    id: "en-shopping", lb: 6, unit: "6", title: "Shopping online across borders",
    intro: "Compare two shops and use English to explain the difference between a return policy and a legal right.",
    paragraphs: [
      "A **consumer** is someone buying for personal use. Before you buy online, compare the full price, the seller's identity, the delivery costs and the **return policy**. An independent test explains what testers actually checked. A review can describe one buyer's experience, while a sponsored post has a reason to favour the product.",
      "Under the usual UK distance-selling rules, a consumer buying many types of goods from a business can tell the seller they want to cancel within 14 days after receiving the goods. There are exceptions, for example for personalised goods. In the United States, do not assume a general 14-day cooling-off period for ordinary online purchases. Check the retailer's policy and applicable consumer law.",
      "Imagine a club ordering identical water bottles from two shops. A cheap price may turn out higher after shipping. A store's return policy matters if the club changes its mind. If the goods are faulty, the group should describe the problem and check the separate rules on faulty goods. Find the conditions in the original source instead of translating the word return into one legal rule.",
    ],
    terms: [term("Return policy", "The seller's stated conditions for accepting something back."), term("Cooling-off period", "A period in which a consumer can cancel certain agreements under the applicable rules.")],
    takeaway: "Check the seller and the applicable rules before you order. A store policy and a right provided by law answer different questions.",
    sourceIds: ["lp", "uk", "ftc"],
    quiz: check("Which source is best for checking a shop's voluntary return policy?", "The terms published by that shop", ["A general product review by a buyer", "A price comparison for similar products"], "The shop's own terms state what it offers in addition to any applicable legal rules."),
    workshop: sort("Which source answers the question?", "Match each question with the first source you would use.", ["Retailer information", "Independent information"], [
      ["Does this dealer charge me to send a purchase back?", 0, "The retailer's published terms are relevant to its policy."],
      ["Which brand scored best in a comparable battery test?", 1, "An independent test can explain its method and compare products."],
      ["What is the delivery time for this specific order?", 0, "The shop can state its delivery arrangements."],
      ["What statutory distance-selling rule applies in the UK?", 1, "Consult official UK guidance for the legal requirements."],
    ], "Use a source that answers your particular question and check whom it is written for."),
    casework: { title: "Two offers for a club order", story: "A club can buy one bottle of the same model from Shop A for £12 plus £5 shipping or Shop B for £15 with free shipping. Both publish separate returns information, and Shop A's product video is sponsored.", steps: [
      decide("Which offer has the lower delivered price per bottle under these terms?", "Shop B at £15", "Shop A at £12", "For one bottle, Shop A costs £17 including shipping."),
      decide("Is the sponsored video an independent test?", "No, the source has a commercial connection.", "Yes, because it shows the product.", "A demonstration can give useful details but sponsorship affects its independence."),
      decide("What should the club check before ordering?", "The correct seller, return terms and rules for its purchase.", "Whether it can apply any country's return law.", "Rules depend on the transaction, the applicable law and any exceptions."),
    ], verdict: "Compare the delivered price, then check which return conditions apply. Ask about a specific purchase instead of assuming a single rule for all shops." },
    tasks: {
      1: write("Write a short message in English asking a shop about shipping charges, delivery and returns.", ["Ask one question about the full price.", "Ask how long you have to return the item."], "Hello, we are buying a water bottle for our club. Could you tell me the total price including delivery and when the order would arrive? If we change our minds after receiving it, how do we notify you and who pays the return postage? Thank you for your help.", ["Total price", "Delivery date", "Return question"]),
      2: write("Explain to a classmate why a private US listing and a UK retailer may have different return conditions.", ["Identify both sellers.", "Use the terms store policy and legal right."], "A UK business selling ordinary goods at a distance normally has statutory cancellation duties, subject to exceptions. A private listing in the US is a different type of sale and a different legal setting. I would look for the platform's rules and check current law before relying on a return option.", ["Sellers distinguished", "Applicable law acknowledged", "Reasoned source choice"]),
    },
  },
  {
    id: "en-legal-ages", lb: 6, unit: "6", title: "Young people and legal rules in England and New York",
    intro: "A legal age depends on the place and on the activity. Compare learning to drive and smoke-free places.",
    paragraphs: [
      "In Great Britain, you can normally start learning to drive a car at 17, with a provisional licence. In New York State, you can generally apply for a learner permit from age 16. A **learner permit** is permission to practise under conditions. It does not mean that you can drive on your own. Both places have more detailed rules, and other US states can set different conditions.",
      "The rules for selling tobacco and the rules for smoking are separate. As a US federal rule, retailers may not sell tobacco products to anyone under 21. Smoke-free rules regulate **where** people may smoke. England and New York State have smoke-free requirements for many enclosed public places and workplaces. Reaching the sale age does not give somebody the right to smoke in a prohibited place.",
      "When you compare rights, name the **jurisdiction**, the act and the source. In a travel discussion, one person can play the visitor and the other the local adviser. Ask a precise question, for example whether a 16-year-old can apply for a learner permit in New York. Identify any other conditions before treating an age limit as permission.",
    ],
    terms: [term("Jurisdiction", "The territory or legal system whose rules apply to the question."), term("Learner permit", "Permission to practise driving under the conditions set by the relevant authority.")],
    visual: { title: "Learning to drive a car", layout: "comparison", steps: ["Great Britain · usually from 17 with a provisional licence", "New York State · learner permit application from 16"] },
    takeaway: "Compare the same activity in clearly named jurisdictions. A minimum age and the permission it unlocks are different pieces of information.",
    sourceIds: ["lp", "uk-drive", "ny-drive", "fda", "uk-smoke", "ny-smoke"],
    quiz: check("What does a New York learner permit allow?", "Driving practice under legal conditions", ["Driving independently in all US states", "Independent driving in Great Britain"], "The permit has conditions and is different from a full licence."),
    workshop: sort("Where or how old?", "Match each question with the focus of the rule.", ["Age or permit", "Place"], [
      ["How old must a person be to apply for a New York learner permit?", 0, "This asks for a condition of learner eligibility."],
      ["May a person smoke in this enclosed public building in England?", 1, "The place and its legal category matter."],
      ["May a US retailer sell tobacco to a person who is 19?", 0, "The retailer must apply the federal minimum sale age."],
      ["Does New York's smoke-free rule cover this indoor workplace?", 1, "This asks about the kind of location covered."],
    ], "Name the activity before searching for a rule."),
    casework: { title: "Visiting a friend in New York", story: "A 16-year-old visitor compares a driving lesson at home in England with what a cousin in New York is allowed to do. The cousin also says that all adults can smoke anywhere if they want to.", steps: [
      decide("Can a New Yorker generally apply for a learner permit at 16?", "Yes, additional permit conditions still apply.", "No, the minimum age is 17 everywhere.", "The New York State rule is different from the usual minimum in Great Britain."),
      decide("Does the permit alone normally allow independent driving?", "No, practice is subject to conditions.", "Yes, any permit is a full licence.", "The word learner indicates a stage before a full licence."),
      decide("Does being an adult override smoke-free rules?", "No, place restrictions can still apply.", "Yes, age takes priority over place.", "The conditions governing a sale are separate from restrictions at a location."),
    ], verdict: "The two driving systems have different starting conditions. Smoke-free rules are about places, even when a person meets sale-age requirements." },
    tasks: {
      1: write("Explain in English one difference between learning to drive in Great Britain and New York State.", ["Name each place.", "Explain what learner permission means."], "A learner can normally start at 17 in Great Britain with a provisional licence. In New York State someone can generally apply for a learner permit at 16. In both settings the learner must follow the conditions for practice. The minimum age does not itself give permission to drive independently.", ["Names both places", "Compares ages", "Explains the learner stage"]),
      2: write("Write two precise questions about youth rules for a class partner and use an official source to answer them.", ["Choose both a place and an activity.", "State what the rule covers."], "Can a person apply for a learner permit at 16 in New York State? The New York DMV says that it is generally possible at that age, subject to conditions. Can a US retailer sell a tobacco product to a person aged 19? Federal FDA guidance gives 21 as the sale age. That rule addresses retail sale.", ["Two precise questions", "Names official sources", "Explains the scope"]),
    },
  },
  {
    id: "en-complaints", lb: 6, unit: "6", title: "Sales contracts and complaints",
    intro: "Practise explaining what was agreed, what went wrong and what you would like a seller to do.",
    paragraphs: [
      "A **sales contract** records an agreement about what is bought and the price. The seller must provide the agreed goods and the buyer pays the price. An **offer** proposes a contract, and an **acceptance** agrees to that offer. In a cross-border purchase the governing rules can differ. The transaction in this exercise uses the basic duties in German law.",
      "If goods do not match the description, state the **defect** clearly. Your message should include the order date or reference, what you expected, what you received and what you want the seller to do. Compare the appearance of a dark red bag to a broken zip. The broken zip is a concrete defect that you can describe and document.",
      "German sales law generally gives the buyer a right to ask for a repair or a replacement as the first step for faulty goods, subject to the details of the case. **Complaint** can mean a customer's message describing a problem. The word does not necessarily mean a lawsuit. When you play buyer and seller, ask a question, respond politely and agree on the next action.",
    ],
    terms: [term("Defect", "A problem that makes goods fall short of the applicable requirements."), term("Replacement", "An item supplied instead of the faulty item, in order to resolve the problem.")],
    takeaway: "A helpful complaint identifies the order, explains the problem and asks for a realistic next step in clear language.",
    sourceIds: ["lp", "bgb"],
    quiz: check("Which sentence describes a defect precisely?", "The zip separates after I close it.", ["I changed my mind about the colour.", "I am unhappy with this purchase."], "It describes an observable problem the seller can investigate."),
    workshop: sort("Build a clear complaint", "Match each sentence with its function in a message.", ["Purchase information", "Problem", "Requested action"], [
      ["I ordered the school bag on 6 May under order number A42.", 0, "The date and reference help identify the purchase."],
      ["The zip opens again as soon as I close the bag.", 1, "This states what is wrong with the product."],
      ["Could you send me a working replacement at no extra cost?", 2, "This gives the seller a concrete request."],
      ["The order confirmation describes a bag with two working zips.", 0, "The confirmation shows what the parties agreed."],
    ], "Facts and a specific request help the seller respond."),
    casework: { title: "A message to the seller", story: "Maja has ordered a school bag from a German retailer. It arrives with a broken zip. She has the order confirmation and can send a photo. She wants a replacement rather than a different colour.", steps: [
      decide("Which information identifies the purchase?", "The date or order reference", "Only the name of the colour", "The seller can locate the transaction with the order details."),
      decide("Which fact best shows the defect?", "The zip does not stay closed.", "Maja likes a different colour.", "The faulty zip concerns the working condition of the bag."),
      decide("What can she request as a first step under the usual German rules?", "Repair or replacement", "Punishment by a criminal court", "The first step is generally to ask the seller to correct the defect."),
    ], verdict: "Maja has a specific defect and evidence. Her message asks for a replacement, which is a possible first remedy under German sales law." },
    tasks: {
      1: write("Write a four-sentence message about the school bag in English and ask for the next step.", ["Start with the order reference.", "Use the word replacement politely."], "Hello, I received school bag A42 from my order on 6 May. The zip does not stay closed, so the bag cannot be used safely. I can send a photo of the problem. Could you please send a replacement and tell me how to return the faulty bag?", ["Purchase identified", "Defect described", "Remedy requested"]),
      2: write("Role-play the buyer and seller in English. Ask for missing information and agree how to handle a faulty lamp.", ["The seller needs the reference and the exact fault.", "Agree who will do what next."], "Buyer: The lamp from order A53 arrived on Tuesday and does not switch on. Could you replace it? Seller: I can check that order. Can you confirm that you used a working socket? Buyer: Yes, I tried two sockets. Seller: Thank you. I will email you a return label and arrange the replacement.", ["Both viewpoints", "Clear follow-up question", "Agreed next action"]),
    },
  },
  {
    id: "en-work-unemployment",
    lb: 6,
    unit: "6",
    title: "Work and unemployment in the EU and the USA",
    intro: "Why do people work, and what happens when there are not enough jobs? We also look at the gap between rich and poor.",
    paragraphs: [
      "People work for many reasons. Work pays for housing, food and free time, but it can also give you pride, friends and the feeling of being useful. Which job fits a person depends on three things: their **qualifications** (certificates, training, skills), their **interests** (what they enjoy doing) and their **work experience** (also called job experience), for example an internship or a part-time job. Employers look for a good match. Lena loves animals and did an internship at a vet, so she can show clearly why she fits a job at an animal clinic.",
      "Work is traded on the **labour market**: companies offer jobs, and people offer their time and skills. When some people want to work but cannot find a job, there is **unemployment**. Sometimes there are too few jobs; sometimes the jobs and the people do not match. An unemployed person wants to work, looks for a job and could start soon, but has not found one. This is a problem for the person, who has less money and often less self-confidence. It is also a problem for society, because fewer people pay taxes and contributions (Beiträge), and society pays more benefits (Leistungen).",
      "There are four typical causes. In a **recession** (Rezession), companies sell less and hire fewer people. This is cyclical unemployment, linked to the up and down of the economy (Konjunktur). **Structural change**, for example new technology, makes whole industries smaller, and workers need new skills (structural unemployment). Some work is **seasonal**: beach hotels and building sites often need fewer workers in winter. Finally, people who change jobs may be without work for a short time while they search (frictional unemployment). Some periods of unemployment last only weeks, others last for years.",
      "Unemployment differs between countries, regions and age groups. The reasons include the economy, training, labour laws and the help people receive. In the EU, citizens may look for work in any member state; in the USA, each state sets its own rules for unemployment benefits within federal guidelines, for example how long they are paid, while in Germany one federal law applies everywhere. Every country also has **rich and poor** people. Social contrasts (also called social inequality) mean big differences in income and wealth. Being poor can mean too little money for housing, food or school trips. People disagree about how much the state should reduce these contrasts.",
    ],
    terms: [
      { term: "qualification", text: "What a person has learned and can show, for example a certificate, training or skills (Qualifikation)." },
      { term: "unemployment", text: "The situation of a person who wants to work and looks for a job but cannot find one (Arbeitslosigkeit)." },
      { term: "labour market", text: "The place where companies look for workers and people offer their work (Arbeitsmarkt)." },
      { term: "structural unemployment", text: "Unemployment that arises when industries change or shrink and workers lack the new skills (strukturelle Arbeitslosigkeit)." },
      { term: "social contrast", text: "A big difference in income and wealth between rich and poor people in one society; also called social inequality (soziale Gegensätze)." },
    ],
    takeaway:
      "People choose work according to their qualifications, interests and experience. Unemployment means wanting a job but not finding one; typical causes are recession, structural change, seasonal work and job changes, and the situation differs from country to country.",
    optional: true,
    sourceIds: ["lp", "bpb", "eures"],
    quiz: {
      question: "Which person is unemployed in the economic sense?",
      answer: "Sam wants to work, looks for a job every week and could start at once, but has not found one.",
      wrong: [
        "Mia looks after her baby at home and is not looking for a job, because she wants to stay with the baby.",
        "Tom works two days a week in a shop because he wants more time for his hobbies and likes it that way.",
      ],
      explanation:
        "A person is unemployed when he or she wants to work, looks for a job and is available, but has none. Staying at home or working part-time by choice does not count.",
    },
    workshop: {
      kind: "classify",
      title: "Which kind of unemployment is it?",
      instruction: "Match each situation with the typical cause of unemployment.",
      categories: ["Cyclical (weak economy)", "Structural (industries change)", "Seasonal (time of year)", "Frictional (changing jobs)"],
      entries: [
        {
          text: "During a recession, a car parts company sells much less and lets 200 workers go.",
          target: 0,
          feedback: "Falling sales in a weak economy mean fewer jobs for a while.",
        },
        {
          text: "A factory closes because robots now do the work, and its welders do not have the skills for the new jobs.",
          target: 1,
          feedback: "Technology has changed the industry, so the old skills no longer fit.",
        },
        {
          text: "Every November a campsite by the sea closes, and its staff have no work until spring.",
          target: 2,
          feedback: "The work depends on the time of year, and it comes back each season.",
        },
        {
          text: "Aisha leaves her old job in March and starts a new one in May, so she is without work for two months.",
          target: 3,
          feedback: "A short gap between two jobs is frictional unemployment.",
        },
        {
          text: "A shop lets some of its cashiers go because customers buy less during a long economic crisis.",
          target: 0,
          feedback: "Customers spend less when the economy is weak, so the shop needs fewer people.",
        },
      ],
      conclusion: "The cause shows how long unemployment may last and which help fits best: new skills, new orders or just time.",
    },
    casework: {
      title: "The closed printing works",
      story:
        "The only large printing works in a small town has closed, because people now read most news online. **Carl** (52) worked there for 25 years as a machine operator. He has a good reference and has applied for **many jobs**, but most local companies want other skills. His niece Mia (17) wonders what this means for her own choice of a job.",
      steps: [
        {
          question: "Which kind of unemployment is Carl’s situation?",
          options: [
            "Seasonal unemployment, because printing needs fewer workers in some months.",
            "Structural unemployment, because the industry has changed and his skills no longer fit.",
            "Frictional unemployment, because Carl is only between two jobs for a short time.",
          ],
          answer: 1,
          explanation: "New habits and technology made the industry smaller. Carl’s skills do not match many open jobs (vacancies), and the problem will not go away within weeks.",
        },
        {
          question: "What would help Carl most to find work again?",
          options: [
            "Waiting for the economy to grow, because then the printing works will open again.",
            "Applying only for jobs in printing, so that all his experience counts.",
            "Retraining in a skill that companies in his region need.",
          ],
          answer: 2,
          explanation: "A growing economy does not bring back a shrinking industry. New skills open jobs in other fields.",
        },
        {
          question: "How does long unemployment affect Carl and society?",
          options: [
            "Carl has less money and may lose self-confidence; the insurance funds receive fewer contributions and pay more benefits.",
            "Carl is not affected much, because the state pays him the same income as before.",
            "Only Carl is affected, because other people do not pay for his unemployment.",
          ],
          answer: 0,
          explanation: "Benefits are lower than a normal wage, and society pays for them. Unemployment is not only a private problem.",
        },
      ],
      verdict:
        "Carl faces structural unemployment. Waiting will not bring the old jobs back; new skills will help him most. His unemployment also costs society contributions and money for benefits.",
    },
    tasks: {
      1: {
        prompt:
          "Explain what unemployment is and describe two causes with an example each. Then say why good qualifications can help a person to find a job.",
        hints: ["Which three conditions make a person unemployed?", "Choose two causes and give a short example for each."],
        model:
          "Unemployment means that a person wants to work, looks for a job and could start soon, but has not found one. One cause is a recession: companies sell less and hire fewer people. Another cause is structural change, for example when new technology makes an industry smaller and workers need new skills. Good qualifications help because employers look for skills that match their jobs, so qualified people usually find work faster.",
        criteria: [
          "Explains what unemployment is",
          "Describes two causes and gives an example for each",
          "Links qualifications to the chances of finding a job",
        ],
      },
      2: {
        prompt:
          "Some people think the state should do more to reduce the gap between rich and poor. Others think people should mainly look after themselves. Give one argument for each view and say which one convinces you more.",
        hints: ["What could the state do for people with low incomes?", "What could happen to costs and motivation if the state does a lot?"],
        model:
          "Supporters of more state help say that children from poor families have fewer chances, so schools, training and benefits create fairer starting points. Supporters of less state help say that high taxes can reduce the reward for hard work and that people should take responsibility for their lives. One possible judgement is: a mix of both. The state should secure basic needs and education, but people should still gain from their own effort, because both fairness and motivation matter.",
        criteria: [
          "Gives one argument for more state help",
          "Gives one argument for more personal responsibility",
          "Makes and justifies a judgement of their own (any reasoned judgement is fine)",
        ],
      },
    },
  },

];
