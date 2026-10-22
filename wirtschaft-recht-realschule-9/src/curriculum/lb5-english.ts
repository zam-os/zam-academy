import type { Lesson } from "../model/types";

export const LB5: Lesson[] = [
  {
    id: "en-work-unemployment",
    lb: 5,
    unit: "1.1",
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
  {
    id: "en-job-application",
    lb: 5,
    unit: "1.2",
    title: "Applying for a job in English",
    intro: "How to read a job advertisement, write a letter of application and a CV, and do well in a job interview in English.",
    paragraphs: [
      "Many applications start with a **job advertisement**. It tells you who the company is, what the job involves and what the company wants. Look for the **requirements** (for example “good communication skills”) and the **duties** (what you will do every day). “Essential” means you must have it; “an advantage” means it is nice to have. Compare the list with your own qualifications, interests and experience. If you meet all the essential requirements and some of the advantages, it is worth applying. Note the deadline and the contact person.",
      "Two main documents make up your application. The **letter of application** (cover letter) explains why you fit the job. Its order is: your address, the date, the company’s address, the greeting, a subject line, the text, the closing and your signature. Open with the job and the source: “I am writing to apply for the position of sales assistant advertised on your website.” Then give two or three reasons and close politely: “I look forward to hearing from you.” Write “Dear Ms Walker,” and end with “Yours sincerely”; without a name, write “Dear Sir or Madam,” and end with “Yours faithfully”. (American English: “Sincerely”.)",
      "The **CV** lists contact details, education, work experience, skills and interests, newest item first. A British or US CV usually has no photo and no date of birth. At a **job interview**, the company wants to get to know you. Typical questions are “Tell me about yourself”, “Why do you want this job?” and “What are your strengths?” Give short, honest and specific answers. Do not just say “I am hard-working”; give an example, such as “During my internship I organised the stock list on my own.” Be on time and ask one question at the end, for example “What would my first week look like?”",
      "Many young people want to work abroad, for example as an **au pair**. An au pair lives with a host family, helps with the children and the housework, gets a room, meals and some pocket money, and learns the language. Inside the EU, citizens may work in any member state, and the EU job portal EURES helps with job offers. Outside the EU, the rules differ by country, and you usually need a visa or a work permit. Norway, Iceland, Liechtenstein and Switzerland are exceptions, because they have free-movement agreements with the EU. Check the age rules and the written agreement with the host family before you go.",
    ],
    terms: [
      { term: "job advertisement", text: "A text in which a company describes a job and the skills it wants (Stellenanzeige)." },
      { term: "letter of application", text: "A letter that explains why you are the right person for a job; it is also called a cover letter (Bewerbungsschreiben)." },
      { term: "CV (curriculum vitae)", text: "A list of your education, work experience and skills; in the USA the short version is usually called a résumé (Lebenslauf)." },
      { term: "job interview", text: "A meeting in which a company asks you questions to decide whether you fit the job (Vorstellungsgespräch)." },
      { term: "au pair", text: "A young person who lives with a host family abroad, helps with the children and learns the language (Au-pair)." },
    ],
    takeaway:
      "An application has clear steps: read the job advertisement, write a letter of application and a CV that match it, and prepare short, honest and specific answers for the job interview. Working abroad needs extra checks, such as a visa or a work permit in most countries outside the EU.",
    optional: true,
    sourceIds: ["lp", "eures"],
    quiz: {
      question: "What should a good letter of application do?",
      answer: "It names the job and shows with two or three examples why your skills fit what the company asks for.",
      wrong: [
        "It tells your whole life story in detail, so that the company knows everything about you from the start.",
        "It repeats the job advertisement word for word, so that the company sees its own text again and agrees.",
      ],
      explanation:
        "The letter links your experience to the requirements in the advertisement. A full life story is too long, and copying the advertisement tells the company nothing about you.",
    },
    workshop: {
      kind: "timeline",
      title: "The steps of an application",
      instruction: "Put the steps of an application in the right order, from the first to the last.",
      categories: [],
      entries: [
        {
          text: "Read the job advertisement and check which requirements you meet.",
          target: 0,
          feedback: "First you must know what the company wants.",
        },
        {
          text: "Write your letter of application and your CV so that they fit the job.",
          target: 1,
          feedback: "Your documents use the words and requirements of the advertisement.",
        },
        {
          text: "Send the application before the deadline, with a polite email or letter.",
          target: 2,
          feedback: "A late application may be ignored, so you send it on time.",
        },
        {
          text: "Get an invitation to an interview and prepare answers to typical questions.",
          target: 3,
          feedback: "The invitation comes after the company has read your documents.",
        },
        {
          text: "Go to the job interview, be on time and give specific examples.",
          target: 4,
          feedback: "The interview is the personal meeting, so it comes after the preparation.",
        },
        {
          text: "Receive the answer from the company and accept or decline a job offer politely.",
          target: 5,
          feedback: "The decision is made last, after both sides have met.",
        },
      ],
      conclusion: "Each step builds on the one before: preparation makes the documents better, and good documents lead to the interview.",
    },
    casework: {
      title: "The Saturday job",
      story:
        "**Elif** (16) sees this advertisement: “Sales assistant wanted for Saturdays. Essential: friendly, reliable, good English. An advantage: first experience with customers.” Elif has never had a paid job, but she served customers at the **school snack bar** for two years. She speaks English well.",
      steps: [
        {
          question: "How should Elif read the words “essential” and “an advantage”?",
          options: [
            "Both words mean the same: she must meet every point, or she should not apply.",
            "Essential means it would be nice to have, and an advantage means she must have it.",
            "Essential means she must meet it; an advantage means it helps but is not compulsory.",
          ],
          answer: 2,
          explanation: "Essential points are the minimum. Elif meets them, and the snack bar gives her an advantage as well.",
        },
        {
          question: "Under which heading from the lesson does Elif put the snack bar in her CV?",
          options: [
            "Under work experience, with dates and a short description of her tasks.",
            "Nowhere, because it was not a paid job and does not count.",
            "Under interests only, because she did it in her free time.",
          ],
          answer: 0,
          explanation: "Work experience can also be unpaid. The dates and tasks show that she is reliable and good with customers.",
        },
        {
          question: "Which sentence is the best opening of her letter?",
          options: [
            "Hello! My name is Elif, I am 16 years old and I live with my parents.",
            "I need money for a new phone, so I am interested in your Saturday job.",
            "I am writing to apply for the position of sales assistant advertised in your shop window.",
          ],
          answer: 2,
          explanation: "A good opening names the job and the source. The other openings say nothing about why she fits.",
        },
        {
          question: "At the interview, the manager asks: “Why should we hire you?” Which answer is best?",
          options: [
            "I am very hard-working and I always do my best at everything.",
            "I need money, and your shop is close to my home, so it is easy for me.",
            "I am friendly and reliable. For two years I served customers at our snack bar, and I never missed a shift.",
          ],
          answer: 2,
          explanation: "The best answer names strengths and proves them with a real example. The other answers are general or speak only about Elif’s own needs.",
        },
      ],
      verdict:
        "Elif meets the essential points and has a useful example. A clear letter, a CV with her snack bar work and a specific interview answer make her application strong, even without a paid job.",
    },
    tasks: {
      1: {
        prompt:
          "Explain what a letter of application and a CV are, and say how they are different. Give one typical phrase or section for each.",
        hints: ["What is the purpose of the letter, and what does a CV list?", "Remember the opening sentence of a letter and the headings of a CV."],
        model:
          "A letter of application explains why you are the right person for one job. A CV is a list of your education, work experience, skills and interests; its basic facts stay the same, but you adapt it to each job. In the letter you write full sentences, for example “I am writing to apply for the position of cashier.” In the CV you use short items under headings such as Education and Work experience. So the letter is personal and fits one company, while the CV gives the facts.",
        criteria: [
          "Explains the purpose of the letter of application",
          "Explains what a CV contains",
          "Names the difference and gives a typical phrase or heading",
        ],
      },
      2: {
        prompt:
          "A friend (18) wants to work as an au pair in another country next year. Explain what your friend should check before leaving and why this is different inside and outside the EU.",
        hints: ["Which papers do EU citizens need in other EU countries, and which do other countries ask for?", "Think about the host family, the agreement and the language."],
        model:
          "My friend should first check the rules for a visa and a work permit. Inside the EU, citizens may work in any member state, so usually no work permit is needed; outside the EU, a visa is often required, and the rules differ by country (Norway, Iceland, Liechtenstein and Switzerland are exceptions). She should also read the agreement with the host family: working hours, free time, pocket money and her own room. Finally, a video call with the family shows whether they fit. These checks prevent problems abroad.",
        criteria: [
          "Names what to check before leaving, such as the visa and the agreement",
          "Explains the difference between EU and non-EU countries",
          "Gives a reason why these checks matter",
        ],
      },
    },
  },
  {
    id: "en-supply-demand",
    lb: 5,
    unit: "2.1",
    title: "Supply, demand and the economic cycle",
    intro: "How buyers and sellers find a price, and how money and work flow in a circle between households and companies.",
    paragraphs: [
      "On a market, buyers and sellers meet. **Demand** is the amount that buyers want to buy at a certain price. **Supply** is the amount that sellers want to sell at that price. When the price is high, fewer people want to buy, so the amount demanded falls. At the same time, more sellers want to sell, so the amount supplied rises. Imagine a school flea market with used comics. At 1 euro, many children would buy, but few owners would sell. At 10 euros, the opposite is true.",
      "The price at which both sides agree is the **equilibrium price**. At this price, the amount that buyers want equals the amount that sellers want. If the price is higher, there is a **surplus**: sellers have more goods than buyers want, so they lower the price. If the price is lower, there is a **shortage**: more people want to buy than there are goods, so the price rises. In the model below, move the price and watch the gap between the two lines. Then move one line, for example after a bad harvest, when sellers offer less at every price, and find the new equilibrium price.",
      "In real life, a seller has to **set a price**, also called “fixing a price”. Nobody knows the equilibrium price exactly, so sellers look at their costs, at the prices of other sellers and at how many customers they expect. A baker who asks 5 euros for a loaf and sells nothing will lower the price. A baker whose bread is sold out by 9 a.m. may raise it. The market sends signals, and a price that is too high or too low is corrected step by step.",
      "Markets are connected in the **circular flow**, also called the **economic cycle** (German: Wirtschaftskreislauf). Do not confuse it with the business cycle (Konjunktur), which describes booms and recessions. Households offer their work to companies and receive wages. With their wages, households buy goods and services, so companies receive money from sales. Companies use this money to pay wages again. The circle is a simple model: in reality, people also save, pay taxes and trade with other countries. But the model shows that households and companies depend on each other. When households spend less, companies sell less and may need fewer workers.",
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
    sourceIds: ["lp"],
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
    lab: "markt",
    labGoals: ["ueberschuss", "knappheit", "gleichgewicht"],
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
    id: "en-social-systems",
    lb: 5,
    unit: "2.2",
    title: "Social systems in Germany and the USA",
    intro: "How countries protect people against big life risks, how Germany and the USA do this differently, and why age matters.",
    paragraphs: [
      "Some risks are too big for one person: a serious illness, an accident or a long time without a job. **Social insurance** answers this with **solidarity**. Many people pay **contributions** (Beiträge) into a common fund, and those who face a problem receive **benefits** (Leistungen) from it. Nobody knows in advance who will need it, so everyone is protected. In Germany, employees are generally insured by law. In health insurance, for example, people with a high income pay higher contributions than people with a low income, but all insured people get the same medical care.",
      "The German system has five branches. **Health insurance** pays for medical care. **Pension insurance** pays an income in old age or when people cannot work. **Unemployment insurance** supports people who lose their job. **Long-term care insurance** helps people who need daily care. **Accident insurance** covers accidents at work and on the way to and from work, and work-related illnesses; pupils are insured at school too. Employees and employers usually share the contributions. Accident insurance is paid by employers alone.",
      "The USA has a different mix. The federal programme Social Security pays retirement, disability and survivors’ benefits; payroll taxes on workers and employers pay for it. Medicare is a public health insurance programme, mainly for people aged 65 and older. Medicaid, run by the states with federal money, helps some people with low incomes. Many others have health insurance through their employer or buy it privately. Unemployment insurance is run by each state under federal guidelines, so the rules differ from state to state. A compulsory system gives security, but everyone pays. More private choice gives freedom, but people carry more responsibility themselves. People judge this differently.",
      "A system also depends on the age structure of a country, often drawn as an age pyramid. In Germany, people live longer than in the past, and fewer children are born than in the 1960s. The pension insurance works on the pay-as-you-go principle: the contributions of today’s workers pay today’s pensions. If fewer workers pay for more pensioners, who also receive pensions for more years, financing gets harder. Possible answers are higher contributions, a later retirement age, lower pensions, higher grants from the federal budget or more private saving. Each answer costs someone something, and people disagree about the best mix.",
    ],
    terms: [
      { term: "social insurance", text: "A system in which many people pay contributions to protect each other against risks such as illness or old age (Sozialversicherung)." },
      { term: "solidarity", text: "The idea that the many help the few who are in need, because everyone may need help one day (Solidarprinzip)." },
      { term: "pay-as-you-go system", text: "A system in which today’s contributions pay today’s benefits, as in German pension insurance (Umlageverfahren)." },
      { term: "age structure", text: "The share of young, middle-aged and old people in a population (Altersstruktur)." },
      {
        term: "life expectancy",
        text: "The average number of years that a newborn child is expected to live; in Germany in 2025 it was 83.6 years for women and 79.1 years for men (Lebenserwartung).",
      },
    ],
    law: [
      {
        ref: "§ 1 SGB V",
        text: "Health insurance is a community of solidarity. Its task is to keep insured people healthy, to restore their health or to improve it; the insured people share the responsibility for their own health.",
        url: "https://www.gesetze-im-internet.de/sgb_5/__1.html",
      },
      {
        ref: "§ 153 SGB VI",
        text: "In pension insurance, the spending of one calendar year is paid for by the income of the same calendar year, in particular contributions and grants from the federal government, and if needed by money from a reserve. This is the pay-as-you-go system.",
        url: "https://www.gesetze-im-internet.de/sgb_6/__153.html",
      },
    ],
    takeaway:
      "Social insurance protects people from big risks through solidarity. Germany has five branches, while the USA mixes federal programmes, state rules and private offers. Ageing populations make pay-as-you-go financing harder.",
    optional: true,
    sourceIds: ["lp", "bpb", "destatis", "sgb3", "sgb5", "sgb6", "sgb7", "sgb11"],
    quiz: {
      question: "What is the main idea of social insurance?",
      answer: "Many insured people pay contributions together, and those who face a risk such as illness receive help from the common fund.",
      wrong: [
        "Every insured person saves in a personal account and later gets back exactly what was paid into it.",
        "The state pays benefits only to people who are poor, and all other people must carry their risks alone.",
      ],
      explanation:
        "The fund is shared: those who are hit by a risk are helped by all. It is not a personal savings account, and it is not only for poor people.",
    },
    workshop: {
      kind: "classify",
      title: "Which insurance covers the risk?",
      instruction: "Match each situation with the branch of social insurance that is meant for it.",
      categories: ["Health insurance", "Pension insurance", "Unemployment insurance", "Long-term care insurance"],
      entries: [
        {
          text: "Selin has a high fever, goes to a doctor and gets a prescription.",
          target: 0,
          feedback: "Medical treatment is the task of health insurance.",
        },
        {
          text: "After 45 years of work, Mr Brandt retires and wants a regular monthly income.",
          target: 1,
          feedback: "Pension insurance pays an income in old age.",
        },
        {
          text: "Dana’s company closes, so she loses her job and starts to look for a new one.",
          target: 2,
          feedback: "Unemployment insurance supports people who lose their job.",
        },
        {
          text: "Mrs Lund, 82, can no longer wash or dress herself and needs help every day.",
          target: 3,
          feedback: "Needing daily help over a long time is the risk of long-term care insurance.",
        },
        {
          text: "Ahmed needs an operation on his knee after a football match with his club.",
          target: 0,
          feedback: "A sports injury in free time is treated and paid by health insurance.",
        },
      ],
      conclusion: "Each branch covers its own risk: illness, old age, job loss and the need for care.",
    },
    casework: {
      title: "The ladder accident",
      story:
        "**Marek** (34) works in a warehouse. One morning he falls from a ladder at work and breaks his arm. In the evening he visits his grandmother, who is 85 and needs help with washing and cooking every day. A friend of the family, **Ruth**, lives in the USA and is 70.",
      steps: [
        {
          question: "Which branch of social insurance mainly covers Marek’s accident at work?",
          options: [
            "Unemployment insurance, because Marek cannot work for some weeks.",
            "Accident insurance, which covers accidents at work.",
            "Long-term care insurance, because he needs help in daily life for a while.",
          ],
          answer: 1,
          explanation: "Accident insurance covers accidents at work. Marek still has his job, and long-term care insurance is for a long need for help.",
        },
        {
          question: "Who pays the contributions to accident insurance?",
          options: [
            "Employees and employers, half each.",
            "The employees alone.",
            "The employers alone.",
          ],
          answer: 2,
          explanation: "Employers pay for accident insurance. In the other branches, employees and employers usually share the contributions.",
        },
        {
          question: "Which insurance helps Marek’s grandmother, who needs daily help from a care service?",
          options: [
            "Pension insurance, because she is already retired.",
            "Long-term care insurance, which covers the risk of needing daily care.",
            "Health insurance, because needing help is the same as being ill.",
          ],
          answer: 1,
          explanation: "Needing help every day is its own risk, so there is long-term care insurance. Pension insurance pays income, and health insurance pays for medical treatment.",
        },
        {
          question: "Which US programme most likely helps Ruth, aged 70, with her health costs?",
          options: [
            "Medicare, a public health insurance programme mainly for people aged 65 and older.",
            "Social Security, a system of retirement payments from the federal government.",
            "Unemployment insurance, which each state runs under federal guidelines.",
          ],
          answer: 0,
          explanation: "Medicare is the public health insurance programme for older people. Social Security pays retirement money, and unemployment insurance is for people without a job.",
        },
      ],
      verdict:
        "Accident insurance covers Marek, and employers pay for it. Long-term care insurance helps his grandmother. In the USA, Medicare is the programme that helps Ruth with her health costs. Different countries cover similar risks in different ways.",
    },
    tasks: {
      1: {
        prompt:
          "Explain the idea of social insurance and name three of the five branches in Germany with the risk each one covers.",
        hints: ["Who pays in, and who receives help?", "Which risk belongs to which branch?"],
        model:
          "In social insurance, many people pay contributions into a common fund, and those who face a risk receive help from it. This is the principle of solidarity. In Germany, health insurance pays for medical care, pension insurance pays an income in old age, and unemployment insurance supports people who lose their job. There are also long-term care insurance and accident insurance. Most employees must join, and employees and employers usually share the contributions.",
        criteria: [
          "Explains solidarity: many pay in, and those in need receive help",
          "Names three branches of German social insurance",
          "Matches each branch with the risk it covers",
        ],
      },
      2: {
        prompt:
          "In Germany there are fewer workers for each pensioner. Explain why this makes the pension insurance harder to finance. Discuss two possible solutions and say which one you find more convincing.",
        hints: ["Who pays today’s pensions in a pay-as-you-go system?", "Who has to pay more or give something up in each solution?"],
        model:
          "In a pay-as-you-go system, today’s workers pay today’s pensions. If fewer workers pay for more pensioners, who also live longer, each worker must pay more or pensions must grow more slowly. Higher contributions lower the income of workers and raise costs for companies. A later retirement age keeps more people paying in, but some jobs are hard to do at an older age. One possible judgement is: a mix, including private saving, is convincing, because it shares the burden between several groups.",
        criteria: [
          "Explains why fewer workers per pensioner cause a problem",
          "Discusses two solutions and a disadvantage of each",
          "Gives a personal judgement and justifies it (any reasoned judgement is fine)",
        ],
      },
    },
  },
];
