import type { Lesson } from "../model/types";

/**
 * Stufe 2, zweiter Teil: Grammatik für Wünsche, Ratschläge und nicht erfüllbare Bedingungen
 * (Kompetenzerwartung 1.2.2.2) und die neuen unregelmäßigen Verben courir, recevoir, suivre und vivre
 * (Kompetenzerwartung 1.2.2.3).
 */
export const S2B: Lesson[] = [
  {
    id: "fr-conditionnel-formes",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.2"],
    title: "Der conditionnel présent: Formen",
    intro:
      "Der conditionnel nimmt den Stamm des futur simple und die Endungen des imparfait: je parlerais, je serais, j’aurais.",
    paragraphs: [
      "Den **conditionnel présent** (die Möglichkeitsform, deutsch meist „würde“ oder „hätte, wäre, könnte“) bildest du aus zwei Bausteinen, die du schon kennst: dem **Stamm des futur simple** und den **Endungen des imparfait** -ais, -ais, -ait, -ions, -iez, -aient. Parler: je parlerais, tu parlerais, il parlerait, nous parlerions, vous parleriez, ils parleraient. Finir: je finirais. Bei Verben auf -re fällt das e weg: vendre → je vendrais, prendre → je prendrais.",
      "Die **unregelmäßigen Stämme** sind dieselben wie im futur: être → je serais, avoir → j’aurais, aller → j’irais, faire → je ferais, venir → je viendrais, pouvoir → je pourrais, vouloir → je voudrais, devoir → je devrais, savoir → je saurais, voir → je verrais, envoyer → j’enverrais, falloir → il faudrait. Auch die Schreibänderungen bleiben: acheter → j’achèterais, appeler → j’appellerais.",
      "Achte auf den Unterschied zum futur simple. Je parlerai (Futur) und je parlerais (conditionnel) klingen fast gleich; in der Schrift entscheidet das s. Bei nous und vous hörst du den Unterschied: nous parlerons / nous parlerions, vous parlerez / vous parleriez. Prüfe deshalb immer, ob eine Zukunft (werde) oder eine Möglichkeit (würde) gemeint ist.",
      "Typische Fehler: der Infinitiv mit den Präsensendungen (« je parlere »), der Stamm des imparfait (« je parlais » statt je parlerais) oder ein falscher Stamm bei unregelmäßigen Verben (« j’allerais », « je pouverais »). Merke dir die unregelmäßigen Stämme als Gruppe: ser-, aur-, ir-, fer-, viendr-, pourr-, voudr-, devr-, saur-, verr-.",
    ],
    terms: [
      { term: "conditionnel présent", text: "Die Möglichkeitsform: Stamm des futur simple + Endungen des imparfait. Deutsch meist mit „würde“." },
      { term: "Stamm des futur", text: "Meist der Infinitiv (parler-, finir-), bei -re ohne e (vendr-); unregelmäßig bei être (ser-), avoir (aur-), aller (ir-) und anderen." },
      { term: "Endungen des imparfait", text: "-ais, -ais, -ait, -ions, -iez, -aient. Im conditionnel hängen sie am Stamm des futur." },
    ],
    takeaway:
      "Conditionnel = Stamm des futur + -ais, -ais, -ait, -ions, -iez, -aient. Unregelmäßige Stämme wie im futur: ser-, aur-, ir-, fer-, viendr-, pourr-, voudr-, devr-, saur-, verr-, il faudrait. Je parlerai (werde) ≠ je parlerais (würde).",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie lautet der conditionnel von aller für nous?",
      answer: "nous irions",
      wrong: ["nous allerions", "nous irons"],
      explanation:
        "Aller hat den unregelmäßigen Stamm ir-, dazu die imparfait-Endung -ions: nous irions. Nous irons ist das futur simple.",
    },
    workshop: {
      kind: "choose",
      title: "Den conditionnel bilden",
      instruction: "Bilde den conditionnel: Stamm des futur plus Endung des imparfait. Achte auf unregelmäßige Stämme und auf den Unterschied zum futur.",
      items: [
        { before: "Si j’avais le temps, je ", options: ["ferais", "ferai", "faisais"], answer: 0, after: " du sport tous les jours.", feedback: "Stamm fer- + -ais: je ferais. Je ferai ist futur, je faisais imparfait." },
        { before: "Tu ", options: ["pourrais", "pouverais", "pourras"], answer: 0, after: " m’aider avec mes devoirs?", feedback: "Pouvoir hat den Stamm pourr-: tu pourrais." },
        { before: "Nous ", options: ["serions", "serons", "étions"], answer: 0, after: " contents de vous voir.", feedback: "Être hat den Stamm ser-, dazu -ions: nous serions." },
        { before: "Elle ", options: ["viendrait", "venirait", "viendra"], answer: 0, after: " volontiers avec nous.", feedback: "Venir hat den Stamm viendr-: elle viendrait." },
        { before: "Ils ", options: ["prendraient", "prenderaient", "prenaient"], answer: 0, after: " le train s’il n’y avait pas de grève.", feedback: "Bei -re fällt das e weg: prendr- + -aient." },
        { before: "Il ", options: ["faudrait", "fallerait", "faudra"], answer: 0, after: " partir plus tôt.", feedback: "Falloir hat den Stamm faudr-: il faudrait." },
      ],
      conclusion: "Stamm des futur, Endung des imparfait: So entsteht jede Form. Die unregelmäßigen Stämme kennst du schon vom futur.",
    },
    casework: {
      title: "Wünsche für die Klassenfahrt",
      story:
        "Die Klasse sammelt Wünsche: « Moi, j’irais à Marseille. Nous verrions la mer et nous mangerions une bouillabaisse. Les profs préféreraient Strasbourg, parce que ce serait moins cher. »",
      steps: [
        {
          question: "Wie ist « j’irais » gebildet?",
          options: ["Stamm ir- von aller + -ais.", "Stamm all- von aller + -ais.", "Stamm ir- + Futurendung -ai."],
          answer: 0,
          explanation: "Aller hat im futur und conditionnel den Stamm ir-, dazu die imparfait-Endung -ais.",
        },
        {
          question: "Welcher Infinitiv steckt in « nous verrions »?",
          options: ["voir", "venir", "vouloir"],
          answer: 0,
          explanation: "Voir hat den Stamm verr-: nous verrions. Venir wäre viendr-, vouloir voudr-.",
        },
        {
          question: "Warum steht « ce serait » und nicht « ce sera »?",
          options: ["Es ist eine Möglichkeit, keine sichere Zukunft.", "Weil ce immer den conditionnel verlangt.", "Weil être kein regelmäßiges futur simple bildet."],
          answer: 0,
          explanation: "Die Fahrt ist noch nicht entschieden: Es wäre billiger. Ce sera hieße „es wird sein“.",
        },
      ],
      verdict:
        "Alle Wünsche stehen im conditionnel: unregelmäßige Stämme wie ir-, verr- und ser- mit den Endungen des imparfait.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde den conditionnel: 1. je (avoir) 2. vous (faire) 3. elles (vouloir) 4. tu (finir)",
        hints: ["Nimm den Stamm des futur.", "Hänge die Endung des imparfait an."],
        model:
          "1. j’aurais (Stamm aur-) 2. vous feriez (Stamm fer-) 3. elles voudraient (Stamm voudr-) 4. tu finirais (Stamm finir-). Alle Endungen kommen aus dem imparfait: -ais, -iez, -aient. Die Stämme sind dieselben wie im futur simple.",
        criteria: ["Die Stämme sind richtig.", "Die Endungen passen zum Subjekt.", "Keine Form ist mit dem futur verwechselt."],
      },
      2: {
        prompt:
          "Schreibe sechs Sätze im conditionnel darüber, was du mit einem freien Jahr nach der Schule machen würdest. Verwende mindestens vier verschiedene unregelmäßige Stämme und zwei verschiedene Personen.",
        hints: ["Unregelmäßig sind zum Beispiel aller, faire, être, avoir, pouvoir, voir.", "Beginne zum Beispiel mit Avec une année libre, …"],
        model:
          "Avec une année libre, j’irais d’abord au Canada. Je ferais du bénévolat dans un parc national. Mon meilleur ami viendrait avec moi, et nous pourrions voyager ensemble. Nous verrions des ours et des baleines. Ce serait une expérience incroyable. À la fin, j’aurais sûrement envie de rester!",
        criteria: ["Alle Verben stehen im conditionnel.", "Mindestens vier unregelmäßige Stämme sind richtig verwendet.", "Es kommen mindestens zwei Personen vor."],
      },
    },
    practice: {
      kind: "choose",
      title: "Conditionnel: Übungsrunde",
      instruction: "Wähle die richtige Form des conditionnel. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je ", options: ["voudrais", "voudrai"], answer: 0, after: " un café, s’il vous plaît.", feedback: "Ein höflicher Wunsch im conditionnel: je voudrais mit -ais." },
          { before: "Tu ", options: ["aurais", "avais"], answer: 0, after: " le temps demain?", feedback: "Avoir hat den Stamm aur-: tu aurais." },
          { before: "Il ", options: ["serait", "était"], answer: 0, after: " content de venir.", feedback: "Être hat den Stamm ser-: il serait." },
          { before: "Nous ", options: ["parlerions", "parlerons"], answer: 0, after: " plus lentement pour toi.", feedback: "Conditionnel mit -ions: nous parlerions. Parlerons ist futur." },
          { before: "Vous ", options: ["devriez", "devrez"], answer: 0, after: " vous reposer un peu.", feedback: "Ein Rat im conditionnel: vous devriez mit -iez." },
          { before: "Elles ", options: ["iraient", "alleraient"], answer: 0, after: " volontiers au cinéma.", feedback: "Aller hat den Stamm ir-: elles iraient." },
          { before: "Je ", options: ["saurais", "savrais"], answer: 0, after: " répondre à cette question.", feedback: "Savoir hat den Stamm saur-: je saurais." },
          { before: "On ", options: ["prendrait", "prenderait"], answer: 0, after: " le bus à huit heures.", feedback: "Bei prendre fällt das e weg: on prendrait." },
        ],
        2: [
          { before: "Avec un peu plus d’argent, mes parents ", options: ["achèteraient", "achèteront", "achetaient"], answer: 0, after: " une petite maison au bord de la mer en Bretagne.", feedback: "Ein Wunsch im conditionnel mit dem Stamm achèter- und -aient." },
          { before: "À ta place, je ", options: ["verrais", "voirais", "verrai"], answer: 0, after: " d’abord le médecin avant de reprendre l’entraînement de foot.", feedback: "Voir hat den Stamm verr-; ein Rat steht im conditionnel: je verrais." },
          { before: "Est-ce que vous ", options: ["pourriez", "pourrez", "pouviez"], answer: 0, after: " m’envoyer les informations sur le stage par mail, s’il vous plaît?", feedback: "Eine höfliche Bitte im conditionnel: vous pourriez." },
          { before: "Sans le soutien de ses amis, Léa ne ", options: ["ferait", "fera", "faisait"], answer: 0, after: " jamais ce voyage toute seule en Afrique.", feedback: "Eine gedachte Möglichkeit: faire hat den Stamm fer-, also elle ferait." },
          { before: "Dans un monde idéal, tout le monde ", options: ["aurait", "aura", "avait"], answer: 0, after: " accès à l’eau potable et à une bonne école.", feedback: "Eine Vorstellung, keine sichere Zukunft: avoir mit Stamm aur-, il aurait." },
          { before: "Si le train n’était pas en retard, nous ", options: ["serions", "serons", "étions"], answer: 0, after: " déjà arrivés à la gare de Lyon depuis une heure.", feedback: "Die Folge einer nicht erfüllten Bedingung: nous serions." },
          { before: "Mon frère dit qu’il ", options: ["viendrait", "venirait", "viendra"], answer: 0, after: " avec nous seulement s’il pouvait rentrer avant minuit.", feedback: "Venir hat den Stamm viendr-, und die Bedingung ist nicht sicher: il viendrait." },
          { before: "Pour réussir l’examen, il ", options: ["faudrait", "faudra", "fallait"], answer: 0, after: " réviser un peu chaque jour au lieu de tout faire la veille.", feedback: "Ein Rat im conditionnel: il faudrait mit dem Stamm faudr-." },
        ],
      },
    },
  },
  {
    id: "fr-conditionnel-emploi",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.2"],
    title: "Der conditionnel: Wünsche, Bitten und Ratschläge",
    intro:
      "Mit dem conditionnel klingst du höflich, äußerst Wünsche, gibst Ratschläge und bewertest vorsichtig.",
    paragraphs: [
      "Der conditionnel hat im Alltag vier wichtige Aufgaben. Erstens **Wünsche**: « Je voudrais devenir infirmière. », « J’aimerais bien voyager au Québec. », « Ça me plairait de travailler avec des enfants. » Im Unterschied zu je veux klingt je voudrais weniger fordernd.",
      "Zweitens **höfliche Bitten und Fragen**: « Pourriez-vous m’aider? », « Est-ce que vous auriez un plan de la ville? », « Je voudrais un renseignement, s’il vous plaît. » In Geschäften, im Hotel und in formellen Briefen ist das der übliche Ton. Je veux wirkt dort unhöflich.",
      "Drittens **Ratschläge**: « Tu devrais parler à tes parents. » (du solltest), « Il faudrait réserver à l’avance. » (man müsste), « À ta place, je chercherais un autre stage. » (an deiner Stelle würde ich). Viertens **vorsichtige Wertungen und Gefühle**: « Ce serait dommage de rater ce concert. », « Ce serait génial! », « Je serais triste si tu partais. »",
      "Typische Fehler: die Bitte im Präsens (« Vous pouvez me donner … » ist umgangssprachlich in Ordnung, aber in einem Brief zu direkt), devoir im Präsens für einen Rat (« Tu dois » ist ein Befehl, « tu devrais » ein Rat) oder das futur statt des conditionnel (« Je voudrai un café » mit fehlendem s).",
    ],
    terms: [
      { term: "Wunsch", text: "Je voudrais, j’aimerais, ça me plairait: Wünsche klingen im conditionnel weicher als mit je veux." },
      { term: "höfliche Bitte", text: "Pourriez-vous …?, Est-ce que vous auriez …?: üblich im Geschäft, im Hotel und im formellen Brief." },
      { term: "Ratschlag", text: "Tu devrais (du solltest), il faudrait (man müsste), à ta place, je … (an deiner Stelle würde ich)." },
    ],
    takeaway:
      "Conditionnel für Wünsche (je voudrais, j’aimerais), höfliche Bitten (pourriez-vous, auriez-vous), Ratschläge (tu devrais, il faudrait, à ta place) und vorsichtige Wertungen (ce serait dommage). Tu dois befiehlt, tu devrais rät.",
    sourceIds: ["lp", "lingolia", "lepointdufle"],
    quiz: {
      question: "Was ist der Unterschied zwischen « Tu dois partir » und « Tu devrais partir »?",
      answer: "Das Erste befiehlt, das Zweite rät.",
      wrong: ["Das Erste rät, das Zweite befiehlt.", "Beide bedeuten genau dasselbe."],
      explanation:
        "Devoir im Präsens drückt eine Pflicht aus (du musst). Im conditionnel wird daraus ein Rat (du solltest).",
    },
    workshop: {
      kind: "classify",
      title: "Wozu dient der conditionnel hier?",
      instruction: "Ordne jeden Satz der Aufgabe des conditionnel zu: Wunsch, höfliche Bitte oder Ratschlag.",
      categories: ["Wunsch", "höfliche Bitte", "Ratschlag"],
      entries: [
        { text: "Plus tard, j’aimerais bien travailler dans le tourisme.", target: 0, feedback: "J’aimerais bien drückt einen Wunsch für die Zukunft aus." },
        { text: "Pourriez-vous me dire où se trouve l’office de tourisme?", target: 1, feedback: "Pourriez-vous leitet eine höfliche Bitte an eine fremde Person ein." },
        { text: "Tu devrais mettre une veste, il fait froid ce soir.", target: 2, feedback: "Tu devrais ist ein Rat: du solltest." },
        { text: "Est-ce que vous auriez une chambre pour deux personnes?", target: 1, feedback: "Auriez-vous ist eine höfliche Anfrage im Hotel." },
        { text: "À ta place, je demanderais un stage dans cette entreprise.", target: 2, feedback: "À ta place, je … gibt einen Rat." },
        { text: "Ça me plairait beaucoup de passer un an à l’étranger.", target: 0, feedback: "Ça me plairait drückt einen Wunsch aus." },
      ],
      conclusion: "Derselbe Modus, drei Aufgaben: Wünsche weich machen, Bitten höflich machen und Ratschläge geben.",
    },
    casework: {
      title: "Eine Anfrage an ein Jugendhotel",
      story:
        "Für eure Klassenfahrt schreibst du an eine Auberge de jeunesse in Lyon. Dein Entwurf: « Bonjour, je veux 25 lits pour mai. Vous devez nous envoyer les prix. Nous voulons aussi un repas le soir. »",
      steps: [
        {
          question: "Wie formulierst du « je veux 25 lits » höflich?",
          options: ["Nous voudrions réserver 25 lits.", "Nous voulons absolument 25 lits.", "Donnez-nous 25 lits, s’il vous plaît."],
          answer: 0,
          explanation: "Nous voudrions ist die höfliche Form des Wunsches. Die anderen bleiben fordernd.",
        },
        {
          question: "Wie bittest du höflich um die Preise?",
          options: ["Pourriez-vous nous envoyer vos prix?", "Vous devrez nous envoyer vos prix.", "Envoyez vos prix tout de suite!"],
          answer: 0,
          explanation: "Pourriez-vous ist eine höfliche Bitte. Vous devrez ist futur und klingt wie eine Pflicht.",
        },
        {
          question: "Wie fragst du nach dem Abendessen?",
          options: ["Serait-il possible de dîner sur place?", "Nous voulons aussi un repas chaud le soir, bien sûr.", "Le dîner est obligatoire pour nous, c’est clair."],
          answer: 0,
          explanation: "Serait-il possible fragt vorsichtig und höflich, ob etwas geht.",
        },
      ],
      verdict:
        "Mit nous voudrions, pourriez-vous und serait-il possible wird aus einem fordernden Entwurf eine höfliche Anfrage.",
    },
    tasks: {
      1: {
        prompt:
          "Formuliere höflich mit dem conditionnel: 1. Je veux un billet pour Paris. 2. Vous pouvez répéter? 3. Tu dois dormir plus. (als Rat)",
        hints: ["Je veux wird zu je voudrais.", "Für den Rat brauchst du devoir im conditionnel."],
        model:
          "1. Je voudrais un billet pour Paris, s’il vous plaît. 2. Pourriez-vous répéter, s’il vous plaît? 3. Tu devrais dormir plus. Auch möglich: À ta place, je dormirais plus.",
        criteria: ["Alle drei Sätze stehen im conditionnel.", "Die Bitten sind höflich.", "Satz 3 ist ein Rat, kein Befehl."],
      },
      2: {
        prompt:
          "Deine französische Brieffreundin weiß nicht, ob sie nach der Schule eine Lehre machen oder weiter zur Schule gehen soll. Schreibe ihr sechs bis acht Sätze: ein Wunsch für sie, zwei Ratschläge, eine vorsichtige Wertung und eine höfliche Frage.",
        hints: ["Für den Wunsch passt je te souhaite de + Infinitiv.", "Für Ratschläge: tu devrais, il faudrait, à ta place."],
        model:
          "Chère Inès, je comprends que ce choix soit difficile. Je te souhaite surtout de trouver un métier qui te plaît. À ta place, je ferais d’abord un stage dans une entreprise. Tu devrais aussi parler avec ta conseillère d’orientation. Ce serait dommage de choisir trop vite. Il faudrait peut-être faire une liste des avantages et des inconvénients. Est-ce que tu pourrais me dire ce que tes parents en pensent? Bises, Lena",
        criteria: ["Zwei Ratschläge stehen richtig im conditionnel.", "Eine vorsichtige Wertung und eine höfliche Frage sind enthalten.", "Der Brief ist freundlich und zusammenhängend."],
      },
    },
  },
  {
    id: "fr-si-irreel",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.2"],
    title: "Nicht erfüllbare Bedingungen: si + imparfait, conditionnel",
    intro:
      "Wenn eine Bedingung nur gedacht ist, steht nach si das imparfait und im Hauptsatz der conditionnel.",
    paragraphs: [
      "Du kennst aus Klasse 9 die **erfüllbare Bedingung** (Typ I): si + Präsens, im Hauptsatz futur, Präsens oder Imperativ. « S’il fait beau demain, nous irons à la plage. » Die Bedingung kann eintreten. Bei der **nicht erfüllbaren** oder unwahrscheinlichen Bedingung (Typ II) stellst du dir etwas nur vor: « Si j’avais un million, je ferais le tour du monde. » (Ich habe keine Million.)",
      "Die Regel für Typ II: **si + imparfait, conditionnel présent**. « Si j’étais toi, je dirais la vérité. », « Si nous habitions à Paris, nous irions plus souvent au musée. », « Elle serait plus détendue si elle dormait plus. » Der Hauptsatz kann auch vorne stehen; dann fällt das Komma meist weg. Vor il und ils wird si zu s’ (s’il, s’ils), vor elle bleibt es si.",
      "Merksatz: **Nach si steht nie der conditionnel**. « Si j’aurais du temps » ist falsch. Viele merken sich: Les si n’aiment pas les -rais. Im Deutschen steht in beiden Teilen „würde“ oder „hätte“ („Wenn ich Zeit hätte, würde ich …“), im Französischen nur im Hauptsatz.",
      "Typ I oder Typ II? Entscheide nach dem, was du meinst: Ist die Bedingung realistisch, nimmst du Typ I (« Si j’ai mon bac, je ferai des études. »); ist sie gedacht oder unwahrscheinlich, Typ II (« Si j’étais ministre, je changerais l’école. »). Mit Typ II kannst du auch Ratschläge geben: « Si j’étais toi, je … »",
    ],
    terms: [
      { term: "Bedingung Typ II", text: "Eine gedachte, nicht erfüllbare oder unwahrscheinliche Bedingung: si + imparfait, conditionnel présent." },
      { term: "Bedingung Typ I", text: "Eine erfüllbare Bedingung: si + Präsens, futur simple, Präsens oder Imperativ." },
      { term: "si j’étais toi", text: "Wenn ich du wäre: eine Bedingung Typ II, mit der man oft Ratschläge gibt." },
    ],
    takeaway:
      "Gedachte Bedingung (Typ II): si + imparfait, Hauptsatz im conditionnel (Si j’avais le temps, je viendrais). Nach si nie der conditionnel. Realistische Bedingung (Typ I): si + présent, futur.",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Wenn ich reich wäre, würde ich ein Haus kaufen“?",
      answer: "Si j’étais riche, j’achèterais une maison.",
      wrong: ["Si je serais riche, j’achèterais une maison.", "Si j’étais riche, j’achèterai une maison."],
      explanation:
        "Typ II: nach si das imparfait (j’étais), im Hauptsatz der conditionnel (j’achèterais). Nach si steht nie der conditionnel, und j’achèterai ist futur.",
    },
    workshop: {
      kind: "choose",
      title: "Die gedachte Bedingung bilden",
      instruction: "Nach si steht das imparfait, im Hauptsatz der conditionnel. Prüfe bei jeder Lücke, in welchem Satzteil sie steht.",
      items: [
        { before: "Si j’", options: ["avais", "aurais", "ai"], answer: 0, after: " plus de temps, j’apprendrais l’espagnol.", feedback: "Die Lücke steht nach si: imparfait j’avais." },
        { before: "Si nous habitions à la mer, nous ", options: ["ferions", "faisions", "ferons"], answer: 0, after: " du surf tous les week-ends.", feedback: "Die Lücke steht im Hauptsatz: conditionnel nous ferions." },
        { before: "Elle serait moins fatiguée si elle ", options: ["se couchait", "se coucherait", "se couche"], answer: 0, after: " plus tôt.", feedback: "Die Lücke steht im si-Satz, auch wenn er hinten steht: imparfait." },
        { before: "", options: ["S’il", "Si il", "Si’l"], answer: 0, after: " pleuvait, nous resterions à la maison.", feedback: "Vor il wird si zu s’ verkürzt: s’il." },
        { before: "Si j’étais toi, je ", options: ["dirais", "disais", "dirai"], answer: 0, after: " la vérité à mes parents.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel je dirais." },
        { before: "Si tu ", options: ["pouvais", "pourrais", "peux"], answer: 0, after: " choisir, quel métier choisirais-tu?", feedback: "Nach si das imparfait: tu pouvais." },
      ],
      conclusion: "Nach si das imparfait, im Hauptsatz der conditionnel, ganz gleich, welcher Teil zuerst steht.",
    },
    casework: {
      title: "Was wäre, wenn …?",
      story:
        "In einem Forum fragt jemand: « Si vous pouviez changer une chose dans votre ville, ce serait quoi? » Mehdi antwortet: « S’il y avait plus de pistes cyclables, je prendrais le vélo tous les jours. Si mon collège était plus près, je dormirais plus longtemps! »",
      steps: [
        {
          question: "Warum steht « s’il y avait » im imparfait?",
          options: ["Es ist der si-Satz einer gedachten Bedingung.", "Es beschreibt eine Gewohnheit von früher in der Stadt.", "Weil il y a immer im imparfait steht."],
          answer: 0,
          explanation: "Die Radwege gibt es nicht: gedachte Bedingung, also imparfait nach si.",
        },
        {
          question: "Welche Form steht in Mehdis Hauptsätzen?",
          options: ["Der conditionnel présent.", "Das futur simple der Verben.", "Das imparfait wie im si-Satz."],
          answer: 0,
          explanation: "Je prendrais und je dormirais sind conditionnel: die Folge einer gedachten Bedingung.",
        },
        {
          question: "Wie würde der erste Satz als realistische Bedingung lauten?",
          options: ["S’il y a plus de pistes cyclables, je prendrai le vélo.", "S’il y aurait plus de pistes, je prendrais le vélo.", "S’il y avait plus de pistes, je prendrai le vélo."],
          answer: 0,
          explanation: "Typ I: si + Präsens, Hauptsatz im futur. Die anderen mischen die Formen falsch.",
        },
      ],
      verdict:
        "Mehdi stellt sich Veränderungen vor: si + imparfait, conditionnel. Als realistischer Plan würde er Typ I mit Präsens und futur verwenden.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde zu einer gedachten Bedingung: 1. avoir une voiture / aller à la mer 2. parler chinois / travailler en Chine 3. être en vacances / dormir jusqu’à midi",
        hints: ["Si + imparfait im ersten Teil.", "Conditionnel im zweiten Teil."],
        model:
          "1. Si j’avais une voiture, j’irais à la mer. 2. Si je parlais chinois, je travaillerais en Chine. 3. Si j’étais en vacances, je dormirais jusqu’à midi. In jedem si-Satz steht das imparfait, in jedem Hauptsatz der conditionnel.",
        criteria: ["Im si-Satz steht das imparfait.", "Im Hauptsatz steht der conditionnel.", "Die Stämme (ir-, ser-) sind richtig."],
      },
      2: {
        prompt:
          "Antworte in sechs bis acht Sätzen auf die Forumsfrage « Si tu étais maire de ta ville pendant un an, qu’est-ce que tu ferais? ». Verwende mindestens vier Bedingungen Typ II und begründe deine Ideen.",
        hints: ["Wechsle die Reihenfolge: mal der si-Satz vorne, mal hinten.", "Begründe mit parce que oder car."],
        model:
          "Si j’étais maire, je construirais d’abord un grand skatepark, parce que les jeunes n’ont pas assez d’endroits pour se retrouver. Les bus seraient gratuits si la ville avait assez d’argent. S’il y avait moins de voitures au centre, l’air serait plus propre. Je planterais aussi des arbres dans chaque rue. Si les habitants voulaient, nous organiserions une fête de quartier chaque été. Ce serait une année géniale!",
        criteria: ["Mindestens vier Bedingungen Typ II sind richtig gebildet.", "Nach si steht nie der conditionnel.", "Die Ideen sind begründet."],
      },
    },
    practice: {
      kind: "choose",
      title: "Si-Sätze Typ II: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "Si j’", options: ["étais", "serais"], answer: 0, after: " riche, je voyagerais.", feedback: "Nach si steht das imparfait: j’étais." },
          { before: "Si tu venais, je ", options: ["serais", "étais"], answer: 0, after: " content.", feedback: "Im Hauptsatz steht der conditionnel: je serais." },
          { before: "Si nous ", options: ["avions", "aurions"], answer: 0, after: " un chien, nous sortirions plus.", feedback: "Nach si steht das imparfait: nous avions." },
          { before: "Il ", options: ["viendrait", "venait"], answer: 0, after: " s’il avait le temps.", feedback: "Der Hauptsatz braucht den conditionnel: il viendrait." },
          { before: "", options: ["S’ils", "Si ils"], answer: 0, after: " pouvaient, ils resteraient.", feedback: "Vor ils wird si zu s’ verkürzt: s’ils." },
          { before: "Si elle ", options: ["parlait", "parlerait"], answer: 0, after: " français, elle irait à Lyon.", feedback: "Nach si steht das imparfait: elle parlait." },
          { before: "Si j’étais toi, j’", options: ["irais", "allais"], answer: 0, after: " chez le médecin.", feedback: "Ein Rat im Hauptsatz: conditionnel j’irais." },
          { before: "Vous ", options: ["pourriez", "pouviez"], answer: 0, after: " venir si vous vouliez.", feedback: "Der Hauptsatz braucht den conditionnel: vous pourriez." },
        ],
        2: [
          { before: "Si les transports en commun ", options: ["étaient", "seraient", "sont"], answer: 0, after: " gratuits dans notre région, beaucoup plus de gens laisseraient leur voiture.", feedback: "Gedachte Bedingung: nach si das imparfait, les transports étaient." },
          { before: "Si je parlais mieux anglais, je ", options: ["pourrais", "pouvais", "pourrai"], answer: 0, after: " faire un stage dans une grande entreprise internationale à Londres.", feedback: "Folge einer gedachten Bedingung im Hauptsatz: conditionnel je pourrais." },
          { before: "Mes grands-parents seraient très heureux si nous leur ", options: ["rendions", "rendrions", "rendons"], answer: 0, after: " visite plus souvent pendant les vacances.", feedback: "Der si-Satz steht hinten, braucht aber trotzdem das imparfait: nous rendions." },
          { before: "", options: ["S’il", "Si il", "S’ils"], answer: 0, after: " neigeait cette nuit, toutes les écoles de la région seraient fermées demain matin.", feedback: "Vor il wird si zu s’; das Verb neigeait steht im Singular: s’il." },
          { before: "Si tu étais à ma place, qu’est-ce que tu ", options: ["ferais", "faisais", "feras"], answer: 0, after: " pour convaincre tes parents de te laisser partir?", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel tu ferais." },
          { before: "Si on ", options: ["recyclait", "recyclerait", "recycle"], answer: 0, after: " vraiment tous nos déchets, il y aurait beaucoup moins de pollution dans la mer.", feedback: "Nach si steht das imparfait: on recyclait." },
          { before: "Ma sœur ", options: ["accepterait", "acceptait", "acceptera"], answer: 0, after: " ce travail à Paris si le salaire était un peu plus élevé.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel elle accepterait." },
          { before: "Si le musée n’était pas fermé le mardi, nous ", options: ["le visiterions", "le visitions", "le visiterons"], answer: 0, after: " aujourd’hui avec toute la classe au lieu d’aller au parc.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel nous le visiterions." },
        ],
      },
    },
  },
  {
    id: "fr-courir-recevoir",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.3"],
    title: "Die unregelmäßigen Verben courir und recevoir",
    intro:
      "Courir (laufen) hat im futur zwei r, recevoir (bekommen) wechselt den Stamm und braucht ein ç vor o und u.",
    paragraphs: [
      "**Courir** heißt laufen, rennen. Präsens: je cours, tu cours, il court, nous courons, vous courez, ils courent. Passé composé mit avoir: j’ai couru. Imparfait: je courais. Futur und conditionnel haben **zwei r**: je courrai, je courrais. Wie courir gehen parcourir (durchlaufen, durchqueren) und secourir (helfen, retten). Typische Wendungen: courir un marathon, courir un risque (ein Risiko eingehen).",
      "**Recevoir** heißt bekommen, erhalten, empfangen. Präsens: je reçois, tu reçois, il reçoit, nous recevons, vous recevez, ils reçoivent. Vor o und u steht **ç**, damit das c weich bleibt: je reçois, j’ai reçu. Vor e und i steht c: nous recevons. Das Verb hat also zwei Stämme: reçoi- (je, tu, il, ils reçoiv-) und recev- (nous, vous).",
      "Weitere Formen von recevoir: imparfait je recevais, futur je recevrai, conditionnel je recevrais. Wie recevoir gehen apercevoir (bemerken: j’aperçois) und décevoir (enttäuschen: Ce film m’a déçu.). Im Alltag brauchst du recevoir oft: recevoir une lettre, un message, une réponse, un cadeau, recevoir des amis (Gäste empfangen).",
      "Typische Fehler: « je courre » im Präsens (richtig je cours), « je courirai » im Futur (richtig je courrai), « je recois » ohne Cédille, « ils recevent » (richtig ils reçoivent) und « j’ai recevu » (richtig j’ai reçu). Bei recevoir hörst du das Partizip reçu oft in E-Mails: « J’ai bien reçu votre message. »",
    ],
    terms: [
      { term: "courir", text: "Laufen, rennen. je cours, nous courons, ils courent; j’ai couru; futur je courrai mit zwei r." },
      { term: "recevoir", text: "Bekommen, empfangen. je reçois, nous recevons, ils reçoivent; j’ai reçu; futur je recevrai." },
      { term: "Cédille", text: "Das Häkchen unter dem c (ç). Es macht das c vor a, o und u weich: je reçois, j’ai reçu." },
    ],
    takeaway:
      "Courir: je cours, nous courons, ils courent, j’ai couru, je courrai (zwei r). Recevoir: je reçois, nous recevons, ils reçoivent, j’ai reçu, je recevrai. Vor o und u steht ç. Ebenso: parcourir, apercevoir, décevoir.",
    sourceIds: ["lp", "larousse", "lingolia"],
    quiz: {
      question: "Wie lautet das passé composé von recevoir für je?",
      answer: "j’ai reçu",
      wrong: ["j’ai recevu", "j’ai recu"],
      explanation:
        "Das Partizip von recevoir ist reçu, mit ç vor u. Recevu gibt es nicht, und ohne Cédille würde man das c wie k sprechen.",
    },
    workshop: {
      kind: "choose",
      title: "Formen von courir und recevoir",
      instruction: "Wähle die richtige Form. Achte auf die Cédille, den Stammwechsel bei recevoir und die zwei r im futur von courir.",
      items: [
        { before: "Chaque matin, je ", options: ["cours", "courre", "coure"], answer: 0, after: " trente minutes dans le parc.", feedback: "Präsens für je: je cours, ohne e am Ende." },
        { before: "Mes cousins ", options: ["reçoivent", "recevent", "reçoient"], answer: 0, after: " beaucoup de cadeaux à Noël.", feedback: "Für ils ändert sich der Stamm: ils reçoivent." },
        { before: "Nous ", options: ["recevons", "reçevons", "reçoivons"], answer: 0, after: " nos correspondants français la semaine prochaine.", feedback: "Bei nous steht recev- ohne Cédille, weil ein e folgt." },
        { before: "L’année prochaine, je ", options: ["courrai", "courirai", "courerai"], answer: 0, after: " le marathon de Paris.", feedback: "Das futur von courir hat zwei r: je courrai." },
        { before: "Hier, j’ai ", options: ["reçu", "recu", "recevu"], answer: 0, after: " une réponse de l’entreprise.", feedback: "Partizip reçu, mit Cédille vor u." },
        { before: "Le voleur a ", options: ["couru", "couri", "courru"], answer: 0, after: " très vite vers la sortie.", feedback: "Das Partizip von courir ist couru." },
      ],
      conclusion: "Courir: cours, courons, couru, courrai. Recevoir: reçois, recevons, reçoivent, reçu, recevrai. Die Cédille steht vor o und u.",
    },
    casework: {
      title: "Eine E-Mail nach dem Stadtlauf",
      story:
        "Tom schreibt: « Bonjour Madame, j’ai bien reçu votre mail. Dimanche, j’ai couru les 10 kilomètres en 52 minutes. L’année prochaine, je courrai avec mon père. Nous recevons des amis ce week-end, mais je viendrai à l’entraînement lundi. »",
      steps: [
        {
          question: "Warum steht « reçu » mit ç?",
          options: ["Vor u muss das c weich bleiben.", "Weil das Verb im Präsens steht.", "Weil recevoir sonst männlich wäre."],
          answer: 0,
          explanation: "Ohne Cédille würde man recu wie „reku“ sprechen. Vor a, o und u braucht das weiche c ein ç.",
        },
        {
          question: "Welche Zeit ist « je courrai »?",
          options: ["Futur simple mit zwei r.", "Imparfait mit Doppel-r.", "Präsens mit langem r."],
          answer: 0,
          explanation: "L’année prochaine zeigt die Zukunft. Courir hat im futur zwei r: je courrai.",
        },
        {
          question: "Was bedeutet hier « nous recevons des amis »?",
          options: ["Wir haben Freunde zu Gast.", "Wir bekommen Post von Freunden.", "Wir laufen mit Freunden."],
          answer: 0,
          explanation: "Recevoir des amis heißt Gäste empfangen, Freunde einladen.",
        },
      ],
      verdict:
        "Reçu mit Cédille, courrai mit zwei r und recevoir im Sinn von Gäste empfangen: Toms E-Mail ist korrekt.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die richtige Form ein: 1. Elle (courir, Präsens) vite. 2. Vous (recevoir, Präsens) mon message? 3. J’ (recevoir, passé composé) une lettre. 4. Nous (courir, futur) ensemble.",
        hints: ["Bei recevoir: ç vor o und u.", "Bei courir: zwei r im futur."],
        model:
          "1. Elle court vite. 2. Vous recevez mon message? 3. J’ai reçu une lettre. 4. Nous courrons ensemble. Bei 2 steht kein ç, weil ein e folgt; bei 4 schreibt man zwei r.",
        criteria: ["Alle Formen sind richtig.", "Die Cédille steht nur vor o und u.", "Das futur von courir hat zwei r."],
      },
      2: {
        prompt:
          "Schreibe eine kurze E-Mail (sechs bis acht Sätze) an eine französische Sportgruppe: Du hast ihre Einladung zu einem Spendenlauf bekommen. Verwende courir und recevoir in mindestens vier verschiedenen Formen (Präsens, passé composé, futur).",
        hints: ["Beginne mit J’ai bien reçu …", "Sag, wie oft du läufst und was du am Lauftag machen wirst."],
        model:
          "Bonjour à tous, j’ai bien reçu votre invitation pour la course solidaire du 15 juin. Je cours trois fois par semaine avec mon club, alors je participerai avec plaisir. L’année dernière, j’ai couru 8 kilomètres pour une association contre la faim. Cette fois, je courrai 10 kilomètres. Est-ce que les coureurs reçoivent un t-shirt? Mes parents recevront des amis ce jour-là, mais ils viendront nous encourager. À bientôt!",
        criteria: ["Courir und recevoir kommen in mindestens vier verschiedenen Formen vor.", "Alle Formen sind richtig geschrieben.", "Die E-Mail passt zur Situation."],
      },
    },
    practice: {
      kind: "choose",
      title: "courir und recevoir: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Tu ", options: ["cours", "courres"], answer: 0, after: " très vite!", feedback: "Präsens von courir für tu: tu cours." },
          { before: "Ils ", options: ["courent", "courrent"], answer: 0, after: " dans la forêt.", feedback: "Präsens für ils: ils courent, mit einem r." },
          { before: "Je ", options: ["reçois", "recois"], answer: 0, after: " un message.", feedback: "Vor o steht die Cédille: je reçois." },
          { before: "Vous ", options: ["recevez", "reçevez"], answer: 0, after: " des amis ce soir?", feedback: "Vor e steht kein ç: vous recevez." },
          { before: "Elle a ", options: ["reçu", "recevu"], answer: 0, after: " un cadeau.", feedback: "Das Partizip von recevoir ist reçu." },
          { before: "Nous avons ", options: ["couru", "couri"], answer: 0, after: " jusqu’à la gare.", feedback: "Das Partizip von courir ist couru." },
          { before: "Demain, je ", options: ["courrai", "courirai"], answer: 0, after: " avec toi.", feedback: "Das futur von courir hat zwei r: je courrai." },
          { before: "Il ", options: ["reçoit", "recevoit"], answer: 0, after: " une bonne note.", feedback: "Präsens für il: il reçoit, mit ç vor o." },
        ],
        2: [
          { before: "Après le cours de sport, les élèves ", options: ["courent", "courrent", "cours"], answer: 0, after: " vers la cantine parce qu’ils ont très faim.", feedback: "Präsens für ils: ils courent, mit einem r." },
          { before: "Est-ce que tu as bien ", options: ["reçu", "recu", "recevu"], answer: 0, after: " les photos que je t’ai envoyées hier soir?", feedback: "Das Partizip von recevoir ist reçu, mit Cédille." },
          { before: "Quand j’étais petit, je ", options: ["courais", "courrais", "courirais"], answer: 0, after: " toujours après le chat de mes grands-parents.", feedback: "Eine Gewohnheit: imparfait je courais, mit einem r." },
          { before: "Si tu t’entraînais plus, tu ", options: ["courrais", "courais", "courirais"], answer: 0, after: " plus vite que tous les autres de ton club.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel tu courrais, mit zwei r." },
          { before: "Les gagnants du concours ", options: ["recevront", "reçevront", "recevoiront"], answer: 0, after: " un bon d’achat de cinquante euros et un diplôme.", feedback: "Futur von recevoir: Stamm recevr-, ils recevront, ohne ç vor e." },
          { before: "Chaque année, notre collège ", options: ["reçoit", "recoit", "recevoit"], answer: 0, after: " un groupe d’élèves de notre ville partenaire en Bourgogne.", feedback: "Präsens für il: il reçoit, mit Cédille vor o." },
          { before: "Les pompiers ont ", options: ["secouru", "secourri", "secouri"], answer: 0, after: " une famille dont la maison était en feu pendant la nuit.", feedback: "Secourir geht wie courir: Partizip secouru." },
          { before: "Ce film m’a vraiment ", options: ["déçu", "décevu", "decu"], answer: 0, after: ": la fin était trop prévisible et les acteurs peu convaincants.", feedback: "Décevoir geht wie recevoir: Partizip déçu, mit Cédille." },
        ],
      },
    },
  },
  {
    id: "fr-suivre-vivre",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.3"],
    title: "Die unregelmäßigen Verben suivre und vivre",
    intro:
      "Suivre (folgen) und vivre (leben) werden ähnlich konjugiert. Achtung: je suis kann zu être oder zu suivre gehören.",
    paragraphs: [
      "**Suivre** heißt folgen, aber auch einen Kurs besuchen oder eine Ausbildung machen. Präsens: je suis, tu suis, il suit, nous suivons, vous suivez, ils suivent. Passé composé: j’ai suivi. Futur: je suivrai. Wendungen: suivre un cours, suivre une formation (eine Ausbildung machen), suivre l’actualité (die Nachrichten verfolgen), suivre quelqu’un sur les réseaux sociaux. Wie suivre geht poursuivre (fortsetzen, verfolgen).",
      "Achtung: **je suis** ist die Form von être und von suivre. Der Zusammenhang entscheidet: « Je suis fatigué » (être), « Je suis un cours de cuisine » (suivre, mit Objekt), « Suivez-moi! » (folgen Sie mir). Wenn nach je suis ein Nomen als Objekt steht, ist es meist suivre.",
      "**Vivre** heißt leben. Präsens: je vis, tu vis, il vit, nous vivons, vous vivez, ils vivent. Passé composé: j’ai **vécu** (unregelmäßiges Partizip). Imparfait: je vivais. Futur: je vivrai. Wie vivre geht survivre (überleben). Vivre und habiter: habiter heißt wohnen (an einem Ort), vivre heißt leben, auch im weiten Sinn: « Elle vit seule. », « On ne vit qu’une fois. », « J’ai vécu deux ans au Sénégal. »",
      "Typische Fehler: « j’ai vivé » statt j’ai vécu, « ils suivont » statt ils suivent, « il vive » statt il vit (vive ist eine andere Form, die du in Vive la France! kennst) und die Verwechslung von je suis (être) und je suis (suivre). Die Formen von suivre und vivre im Singular klingen gleich: je suis, tu suis, il suit [sɥi]; je vis, tu vis, il vit [vi].",
    ],
    terms: [
      { term: "suivre", text: "Folgen; einen Kurs besuchen. je suis, nous suivons, ils suivent; j’ai suivi; futur je suivrai." },
      { term: "vivre", text: "Leben. je vis, nous vivons, ils vivent; j’ai vécu; futur je vivrai." },
      { term: "suivre une formation", text: "Eine Ausbildung machen oder einen Lehrgang besuchen." },
      { term: "vivre und habiter", text: "Habiter heißt an einem Ort wohnen, vivre heißt leben, auch im weiten Sinn: vivre seul, vivre à l’étranger." },
    ],
    takeaway:
      "Suivre: je suis, nous suivons, ils suivent, j’ai suivi, je suivrai. Vivre: je vis, nous vivons, ils vivent, j’ai vécu, je vivrai. Je suis gehört zu être oder suivre: Steht ein Objekt dahinter, ist es suivre.",
    sourceIds: ["lp", "larousse", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Ich habe zwei Jahre in Kanada gelebt“?",
      answer: "J’ai vécu deux ans au Canada.",
      wrong: ["J’ai vivé deux ans au Canada.", "Je suis vécu deux ans au Canada."],
      explanation:
        "Das Partizip von vivre ist unregelmäßig: vécu, und das passé composé wird mit avoir gebildet.",
    },
    workshop: {
      kind: "choose",
      title: "Formen von suivre und vivre",
      instruction: "Wähle die richtige Form. Entscheide bei je suis, ob être oder suivre gemeint ist.",
      items: [
        { before: "Mes grands-parents ", options: ["vivent", "vivont", "vient"], answer: 0, after: " à la campagne depuis trente ans.", feedback: "Präsens von vivre für ils: ils vivent." },
        { before: "Ma sœur ", options: ["suit", "suive", "suivit"], answer: 0, after: " une formation de coiffeuse à Munich.", feedback: "Präsens für elle: elle suit. Suivre une formation heißt eine Ausbildung machen." },
        { before: "Mon oncle a ", options: ["vécu", "vivé", "vivu"], answer: 0, after: " cinq ans au Québec.", feedback: "Das Partizip von vivre ist unregelmäßig: vécu." },
        { before: "Nous ", options: ["suivons", "suisons", "suivrons"], answer: 0, after: " le guide dans le musée.", feedback: "Präsens für nous: nous suivons. Suivrons wäre futur." },
        { before: "Plus tard, je ", options: ["vivrai", "vivrerai", "vivais"], answer: 0, after: " peut-être à l’étranger.", feedback: "Plus tard verlangt das futur: Stamm vivr-, je vivrai." },
        { before: "Vous avez ", options: ["suivi", "suivu", "suit"], answer: 0, after: " les informations hier soir?", feedback: "Das Partizip von suivre ist suivi." },
      ],
      conclusion: "Suivre: suit, suivons, suivi, suivrai. Vivre: vit, vivent, vécu, vivrai. Die Partizipien suivi und vécu muss man sich merken.",
    },
    casework: {
      title: "Ein Steckbrief in der Schülerzeitung",
      story:
        "« Notre nouvelle assistante de français s’appelle Awa. Elle a vécu à Dakar jusqu’à l’âge de dix-huit ans. Maintenant, elle vit à Ratisbonne et elle suit des cours à l’université. Elle nous a dit: “Je suis très heureuse ici!” »",
      steps: [
        {
          question: "Zu welchem Infinitiv gehört « vécu »?",
          options: ["vivre", "voir", "venir"],
          answer: 0,
          explanation: "Vécu ist das unregelmäßige Partizip von vivre.",
        },
        {
          question: "Was bedeutet « elle suit des cours »?",
          options: ["Sie besucht Kurse.", "Sie gibt Kurse.", "Sie ist in Kursen."],
          answer: 0,
          explanation: "Suivre des cours heißt Kurse besuchen. Suit ist die Form von suivre für elle.",
        },
        {
          question: "Welches Verb steckt in « Je suis très heureuse »?",
          options: ["être, weil ein Adjektiv folgt.", "suivre, weil je suis dasteht.", "vivre, weil es um ihr Leben geht."],
          answer: 0,
          explanation: "Nach je suis folgt ein Adjektiv (heureuse), kein Objekt: Es ist être.",
        },
      ],
      verdict:
        "Vécu und vit gehören zu vivre, suit zu suivre, und je suis heureuse zu être: Der Zusammenhang entscheidet.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die richtige Form ein: 1. Tu (suivre, Präsens) un cours de guitare? 2. Ils (vivre, Präsens) à Lyon. 3. Elle (vivre, passé composé) en Afrique. 4. Je (suivre, futur) une formation.",
        hints: ["Achte auf die unregelmäßigen Partizipien.", "Im futur ist der Stamm der Infinitiv ohne e: suivr-, vivr-."],
        model:
          "1. Tu suis un cours de guitare? 2. Ils vivent à Lyon. 3. Elle a vécu en Afrique. 4. Je suivrai une formation. Vécu ist das unregelmäßige Partizip von vivre; im futur hängst du die Endung an den Stamm suivr-, also an den Infinitiv ohne e.",
        criteria: ["Alle Formen sind richtig.", "Das Partizip vécu ist richtig.", "Das futur ist richtig gebildet."],
      },
      2: {
        prompt:
          "Stell dir eine Person vor, die in mehreren Ländern gelebt hat. Schreibe einen kurzen Steckbrief (sechs bis acht Sätze) mit vivre und suivre in mindestens fünf verschiedenen Formen und Zeiten.",
        hints: ["Erzähle, wo sie gelebt hat (passé composé), wo sie jetzt lebt (Präsens) und was sie vorhat (futur).", "Nutze suivre une formation, suivre des cours oder suivre l’actualité."],
        model:
          "Karim a quarante ans. Il a vécu dix ans au Maroc, puis il a suivi une formation de cuisinier en France. Aujourd’hui, il vit à Berlin avec sa famille. Ses enfants suivent des cours dans une école franco-allemande. Le soir, Karim suit l’actualité marocaine sur Internet. Il dit: « On ne vit qu’une fois! » L’année prochaine, il vivra peut-être au Canada, parce qu’on lui a proposé un travail à Montréal.",
        criteria: ["Vivre und suivre kommen in mindestens fünf Formen vor.", "Die Zeiten passen zur Lebensgeschichte.", "Die Formen sind richtig."],
      },
    },
    practice: {
      kind: "choose",
      title: "suivre und vivre: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je ", options: ["vis", "vive"], answer: 0, after: " à Munich.", feedback: "Präsens von vivre für je: je vis." },
          { before: "Il ", options: ["suit", "suive"], answer: 0, after: " un cours d’anglais.", feedback: "Präsens von suivre für il: il suit." },
          { before: "Nous ", options: ["vivons", "vivrons"], answer: 0, after: " ensemble maintenant.", feedback: "Präsens für nous: nous vivons. Vivrons wäre futur." },
          { before: "Ils ", options: ["suivent", "suivont"], answer: 0, after: " le chemin.", feedback: "Präsens von suivre für ils: ils suivent." },
          { before: "J’ai ", options: ["vécu", "vivé"], answer: 0, after: " à Lyon.", feedback: "Das Partizip von vivre ist vécu." },
          { before: "Tu as ", options: ["suivi", "suivu"], answer: 0, after: " le match?", feedback: "Das Partizip von suivre ist suivi." },
          { before: "", options: ["Suivez", "Suisez"], answer: 0, after: "-moi, s’il vous plaît.", feedback: "Imperativ von suivre für vous: suivez." },
          { before: "Elle ", options: ["vit", "vive"], answer: 0, after: " seule.", feedback: "Präsens für elle: elle vit. Vive ist eine andere Form." },
        ],
        2: [
          { before: "Depuis septembre, ma cousine ", options: ["suit", "suive", "est"], answer: 0, after: " une formation de mécatronicienne dans une entreprise près de Nuremberg.", feedback: "Präsens für elle mit Objekt: elle suit une formation." },
          { before: "Avant de s’installer en Bavière, ses parents ont ", options: ["vécu", "vivé", "vit"], answer: 0, after: " plusieurs années en Côte d’Ivoire et au Sénégal.", feedback: "Passé composé von vivre: ont vécu." },
          { before: "Si nous habitions au bord de la mer, nous ", options: ["vivrions", "vivions", "vivrons"], answer: 0, after: " plus simplement, sans voiture et sans stress.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel nous vivrions." },
          { before: "Beaucoup de jeunes ", options: ["suivent", "suivont", "suivrent"], answer: 0, after: " l’actualité uniquement sur les réseaux sociaux, et pas dans les journaux.", feedback: "Präsens von suivre für ils: ils suivent." },
          { before: "Quand j’étais petite, nous ", options: ["vivions", "vivrions", "vécions"], answer: 0, after: " dans un petit appartement au cinquième étage, sans ascenseur.", feedback: "Ein Zustand in der Vergangenheit: imparfait nous vivions." },
          { before: "Après son bac pro, mon frère ", options: ["poursuivra", "poursuira", "poursuivera"], answer: 0, after: " ses études dans une école d’ingénieurs à Lyon.", feedback: "Poursuivre geht wie suivre; futur mit dem Stamm poursuivr-." },
          { before: "Pendant la tempête, les habitants de l’île ont ", options: ["survécu", "survivé", "survivu"], answer: 0, after: " grâce à l’aide rapide des secours venus du continent.", feedback: "Survivre geht wie vivre: Partizip survécu." },
          { before: "Est-ce que vous ", options: ["suivez", "suisez", "suivrez"], answer: 0, after: " déjà votre youtubeur préféré depuis longtemps ou vous l’avez découvert récemment?", feedback: "Präsens für vous: vous suivez. Suivrez wäre futur." },
        ],
      },
    },
  },
];
