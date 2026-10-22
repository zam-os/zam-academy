import type { Lesson } from "../model/types";

export const LB4B: Lesson[] = [
  {
    id: "st-strafmonopol",
    lb: 4,
    unit: "4.3",
    title: "Das Strafmonopol des Staates",
    intro: "Warum nur der Staat strafen darf, was eine Strafe erreichen soll und warum keine Strafe ohne Gesetz gilt.",
    paragraphs: [
      "Stell dir vor, dir wird ein Fahrrad gestohlen, und du findest die Person, die es gestohlen hat. Darfst du sie selbst „bestrafen“? Nein. Im Rechtsstaat hat allein der Staat das **Strafmonopol**: Nur seine Gerichte dürfen Strafen verhängen. Der Staat ist Ordnungs- und Schutzmacht. Er sichert den Frieden, schützt Leben, Eigentum und Freiheit und setzt gemeinsame Regeln durch. Wer sich selbst Recht verschafft, übt **Selbstjustiz** aus und kann dadurch selbst eine Straftat begehen. Erlaubt ist die Abwehr eines gegenwärtigen Angriffs (Notwehr), aber keine Rache danach.",
      "Warum soll nicht jeder selbst strafen? Wer betroffen ist, urteilt selten unparteiisch. Rache schaukelt sich hoch, und jeder würde anders hart strafen. Der Staat dagegen handelt nach festen Regeln: Ein unabhängiges Gericht prüft die Beweise, die beschuldigte Person darf sich verteidigen, und gleiche Taten werden möglichst gleich behandelt. Außerdem darf der Staat nur strafen, was schon vor der Tat durch ein Gesetz mit Strafe bedroht war. Dieser Grundsatz heißt **keine Strafe ohne Gesetz**. Niemand soll für etwas bestraft werden, das beim Handeln noch nicht strafbar war.",
      "Wozu bestraft der Staat überhaupt? Vier Gedanken stehen im Vordergrund. **Vergeltung und Sühne**: Die Tat soll ausgeglichen werden, die Schuld zeigt sich in der Strafe. **Abschreckung**: Die Strafe soll die verurteilte Person und andere davon abhalten, eine Tat zu begehen. **Besserung und Wiedereingliederung**: Die verurteilte Person soll lernen, künftig ohne Straftaten zu leben. **Schutz der Allgemeinheit**: Solange jemand eingesperrt ist, kann die Person keine weiteren Taten begehen. Das Gesetz zählt diese Zwecke nicht auf; bei der Strafzumessung zählen die Schuld und die Wirkung auf das künftige Leben der Person (§ 46 StGB). Meist spielen mehrere Zwecke zugleich eine Rolle.",
      "Jeder Zweck hat Befürworter und Kritiker. Vergeltung stillt das Gerechtigkeitsempfinden, kann aber wie Rache wirken. Abschreckung soll Taten verhindern, doch ob hohe Strafen wirklich abschrecken, ist umstritten, weil viele nicht damit rechnen, erwischt zu werden. Besserung kann Rückfälle senken, kostet aber Zeit, Personal und Geld. Der Schutz der Allgemeinheit wirkt nur, solange jemand weggesperrt ist. Am Ende sollst du selbst abwägen, welcher Zweck bei welcher Tat für dich am schwersten wiegt, und das begründen.",
    ],
    terms: [
      { term: "Strafmonopol", text: "Das Recht, Strafen zu verhängen, liegt allein beim Staat und seinen Gerichten; Privatpersonen dürfen nicht selbst strafen." },
      { term: "Selbstjustiz", text: "Wer sich selbst Recht verschafft oder jemanden eigenmächtig bestraft, statt den Staat einzuschalten, übt Selbstjustiz aus." },
      { term: "Strafzweck", text: "Das Ziel, das mit einer Strafe verfolgt wird: Vergeltung, Abschreckung, Besserung oder Schutz der Allgemeinheit." },
      { term: "Keine Strafe ohne Gesetz", text: "Eine Tat darf nur bestraft werden, wenn sie schon vor der Tat durch ein Gesetz mit Strafe bedroht war." },
    ],
    law: [
      {
        ref: "Art. 92 GG",
        text: "Die rechtsprechende Gewalt ist den Richtern anvertraut: Strafen verhängen darf nur ein Gericht, nicht eine Privatperson.",
        url: "https://www.gesetze-im-internet.de/gg/art_92.html",
      },
      {
        ref: "Art. 103 Abs. 2 GG und § 1 StGB",
        text: "Eine Tat darf nur bestraft werden, wenn die Strafbarkeit schon gesetzlich bestimmt war, bevor die Tat begangen wurde.",
        url: "https://www.gesetze-im-internet.de/stgb/__1.html",
      },
    ],
    takeaway:
      "Im Rechtsstaat darf nur der Staat durch seine Gerichte strafen, und zwar nur für Taten, die schon vor der Tat mit Strafe bedroht waren. Strafen können vergelten, abschrecken, bessern und schützen; wie diese Zwecke zu gewichten sind, muss man abwägen.",
    sourceIds: ["lp", "gg", "stgb"],
    quiz: {
      question: "Warum darf im Rechtsstaat nicht jeder Geschädigte selbst eine Strafe verhängen?",
      answer: "Nur der Staat darf strafen, damit nach festen Regeln, mit fairem Verfahren und ohne Rache entschieden wird.",
      wrong: [
        "Jeder darf strafen, solange die Strafe nicht schlimmer ausfällt als die Tat, die ihr vorausgegangen ist.",
        "Nur die Polizei darf direkt vor Ort strafen, weil sie Straftaten als Erste erlebt und feststellt.",
      ],
      explanation:
        "Strafen sind schwere Eingriffe und brauchen ein faires Verfahren: Unabhängige Gerichte entscheiden nach dem Gesetz, nicht nach Wut oder Rache. Auch die Polizei bestraft nicht, sie ermittelt; ein Verwarnungsgeld bei einer Ordnungswidrigkeit ist keine Strafe.",
    },
    workshop: {
      kind: "classify",
      title: "Welcher Strafzweck steht im Vordergrund?",
      instruction: "Ordne jede Aussage dem Strafzweck zu, der in ihr am deutlichsten wird.",
      categories: ["Vergeltung und Sühne", "Abschreckung", "Besserung und Wiedereingliederung", "Schutz der Allgemeinheit"],
      entries: [
        {
          text: "Die Richterin sagt: „Wer so viel Schaden anrichtet, muss dafür einstehen. Die Strafe soll die Schuld ausgleichen.“",
          target: 0,
          feedback: "Hier geht es um den Ausgleich der Schuld, nicht um die Zukunft: Das ist der Gedanke der Vergeltung und Sühne.",
        },
        {
          text: "Die Staatsanwaltschaft fordert eine spürbare Strafe, damit auch andere es sich überlegen, bevor sie in Online-Shops falsche Angaben machen.",
          target: 1,
          feedback: "Die Strafe soll nicht nur die verurteilte Person, sondern auch andere von ähnlichen Taten abhalten: Abschreckung.",
        },
        {
          text: "Eine wegen Fahrraddiebstahls verurteilte Person erhält in der Haft eine Berufsausbildung, damit sie danach Arbeit findet und nicht rückfällig wird.",
          target: 2,
          feedback: "Die Maßnahme richtet sich auf das künftige Leben der verurteilten Person: Besserung und Wiedereingliederung.",
        },
        {
          text: "Eine Person, die mehrfach eingebrochen ist, sitzt eine Freiheitsstrafe ab. Solange sie im Gefängnis ist, kann sie keine weiteren Einbrüche begehen.",
          target: 3,
          feedback: "Die Allgemeinheit ist geschützt, solange die Person nicht frei ist: Schutz der Allgemeinheit.",
        },
        {
          text: "Die Geschädigte sagt nach dem Urteil: „Mir war wichtig, dass das Gericht klar sagt, dass mir Unrecht geschehen ist.“",
          target: 0,
          feedback: "Die Tat soll als Unrecht benannt werden und nicht folgenlos bleiben: Das gehört zum Gedanken von Vergeltung und Sühne.",
        },
        {
          text: "Ein 16-Jähriger muss nach einer Schlägerei an einem Anti-Gewalt-Training teilnehmen, um zu lernen, Streit anders zu lösen.",
          target: 2,
          feedback: "Er soll künftig ohne Gewalt auskommen: Das ist Besserung.",
        },
      ],
      conclusion: "Eine Strafe verfolgt oft mehrere Zwecke zugleich. Welcher überwiegt, hängt von Tat, Person und Sichtweise ab.",
    },
    casework: {
      title: "Rache für das Handy",
      story:
        "Selin (15) erfährt, dass Paul (16) ihr **Handy** aus der Umkleide genommen hat. Wütend will sie ihn nach dem Training abpassen und ihm eine „Lektion“ erteilen. Eine Freundin rät ihr dagegen, die Sache **anzuzeigen**.",
      steps: [
        {
          question: "Darf Selin Paul selbst „bestrafen“?",
          options: [
            "Nein. Strafen darf im Rechtsstaat nur der Staat; eigenmächtige Rache wäre Selbstjustiz.",
            "Ja, denn Paul hat durch seine Tat das Recht verloren, fair behandelt zu werden.",
            "Ja, solange ihre „Strafe“ nicht härter ausfällt als das, was Paul ihr angetan hat.",
          ],
          answer: 0,
          explanation: "Auch wer geschädigt wurde, darf nicht eigenmächtig strafen. Selbst wer eine Tat begangen hat, behält seine Rechte, und Selbstjustiz kann selbst eine Straftat sein.",
        },
        {
          question: "Was kann Selin stattdessen tun?",
          options: [
            "Anzeige erstatten; dann ermitteln Polizei und Staatsanwaltschaft, ein Gericht entscheidet über die Strafe.",
            "Pauls Namen im Klassenchat als Dieb nennen, damit ihn alle meiden und er die Folgen spürt.",
            "Nichts tun, denn ohne Zeugen kann der Staat eine Tat grundsätzlich nicht verfolgen.",
          ],
          answer: 0,
          explanation: "Der Weg führt über den Staat: Anzeige, Ermittlungen, Gericht. Das Anprangern im Chat wäre ebenfalls Selbstjustiz. Es kann selbst strafbar sein, etwa als üble Nachrede (§ 186 StGB), wenn Selin den Vorwurf nicht beweisen kann.",
        },
        {
          question:
            "Später verpflichtet ein Gericht Paul, sich bei Selin zu entschuldigen und ihr den Schaden zu ersetzen, damit er lernt, nicht mehr zu stehlen. Welcher Strafzweck steht im Vordergrund?",
          options: [
            "Besserung: Paul soll das Unrecht einsehen und künftig keine Taten mehr begehen.",
            "Vergeltung: Paul soll genauso leiden, wie Selin unter dem Diebstahl gelitten hat.",
            "Schutz der Allgemeinheit: Paul soll für längere Zeit von anderen ferngehalten werden.",
          ],
          answer: 0,
          explanation: "Die Frage nennt das Ziel selbst: Paul soll lernen, nicht mehr zu stehlen. Entschuldigung und Wiedergutmachung fördern die Einsicht, das ist Besserung. Von Vergeltung oder Wegsperren ist keine Rede.",
        },
      ],
      verdict:
        "Selin darf Paul nicht selbst bestrafen, sondern zeigt die Tat an. Der Staat prüft den Fall in einem geordneten Verfahren. Bei einem Jugendlichen steht dann die Besserung im Vordergrund.",
    },
    tasks: {
      1: {
        prompt: "Erkläre in eigenen Worten, warum im Rechtsstaat nur der Staat Strafen verhängen darf. Nenne dabei zwei Gründe.",
        hints: ["Was könnte passieren, wenn jeder Betroffene selbst bestraft?", "Welche Regeln und Rechte schützen alle Beteiligten im staatlichen Verfahren?"],
        model:
          "Wenn jeder selbst bestrafen dürfte, würden Betroffene oft aus Wut und nicht unparteiisch urteilen, und Rache könnte sich hochschaukeln. Der Staat bestraft dagegen nach festen Regeln: Ein unabhängiges Gericht prüft die Beweise, die beschuldigte Person darf sich verteidigen, und gleiche Taten werden möglichst gleich behandelt. Außerdem darf nur bestraft werden, was vorher durch ein Gesetz mit Strafe bedroht war. So sind alle vor Willkür geschützt.",
        criteria: [
          "Nennt als ersten Grund die Gefahr von Rache und parteiischen Urteilen",
          "Nennt als zweiten Grund feste Regeln, ein Verfahren und Rechte für die beschuldigte Person",
          "Erklärt, dass der Staat nur nach einem Gesetz strafen darf, das vorher galt",
        ],
      },
      2: {
        prompt:
          "Amir sagt, Strafen sollen vor allem abschrecken. Mira sagt, sie sollen vor allem bessern. Beurteile beide Sichtweisen am Beispiel eines Ladendiebstahls und entscheide begründet, welchem Zweck du bei jemandem, der zum ersten Mal stiehlt, mehr Gewicht gibst.",
        hints: ["Was spricht für Abschreckung, was dagegen?", "Welche Folgen hätte es für die Person selbst, wenn sie sich bessert?"],
        model:
          "Für Abschreckung spricht, dass andere sich eine Tat überlegen, wenn sie eine spürbare Strafe erwarten; dagegen spricht, dass viele nicht damit rechnen, erwischt zu werden. Für Besserung spricht, dass jemand, der zum ersten Mal stiehlt, oft einsichtig ist und mit Hilfe künftig nicht mehr stiehlt; dagegen, dass sie Zeit und Betreuung braucht. Mein Urteil: Bei einer ersten, kleinen Tat gebe ich der Besserung mehr Gewicht, weil eine harte Strafe die Person eher aus Ausbildung und Umfeld reißt. Bei wiederholten Taten zählt für mich auch der Schutz der Allgemeinheit stärker.",
        criteria: [
          "Nennt je ein Argument für und gegen die Abschreckung",
          "Nennt je ein Argument für und gegen die Besserung",
          "Begründet ein eigenes Urteil für den Fall, dass jemand zum ersten Mal stiehlt",
        ],
      },
    },
  },
  {
    id: "st-tatbestand",
    lb: 4,
    unit: "4.3",
    title: "Voraussetzungen der Strafbarkeit",
    intro: "Tatbestand, Rechtswidrigkeit und Schuld: die drei Stufen, auf denen jede Strafbarkeit geprüft wird.",
    paragraphs: [
      "Im Strafrecht prüft man eine Tat immer in drei Stufen. Erste Stufe: die **Tatbestandsmäßigkeit**. Das Strafgesetz beschreibt genau, was verboten ist, und die Handlung muss dazu passen. Beim Diebstahl (§ 242 StGB) nimmt jemand eine fremde bewegliche Sache weg, um sie sich zuzueignen. Bei der Sachbeschädigung (§ 303 StGB) beschädigt oder zerstört jemand eine fremde Sache. Bei der Körperverletzung (§ 223 StGB) misshandelt jemand eine andere Person körperlich oder schädigt ihre Gesundheit. Passt die Handlung nicht zur Beschreibung, endet die Prüfung.",
      "Zum Tatbestand gehört auch die innere Seite der Tat. In der Regel ist nur **Vorsatz** strafbar: Man weiß, was man tut, und will es. Wer dagegen nur unvorsichtig ist, handelt **fahrlässig**. Das ist nur strafbar, wenn das Gesetz es ausdrücklich bestimmt (§ 15 StGB). Fahrlässige Körperverletzung ist strafbar (§ 229 StGB), fahrlässige Sachbeschädigung nicht. Wer außerdem einen Umstand der Tat nicht kennt, etwa eine fremde Jacke für seine eigene hält, handelt nicht vorsätzlich (§ 16 StGB).",
      "Zweite Stufe: die **Rechtswidrigkeit**. Meist ist eine Tat, die den Tatbestand erfüllt, auch rechtswidrig. Es gibt aber **Rechtfertigungsgründe**, die sie ausnahmsweise erlauben. Der bekannteste ist die **Notwehr** (§ 32 StGB): Wer einen gegenwärtigen rechtswidrigen Angriff auf sich oder andere abwehrt, handelt nicht rechtswidrig, wenn die Abwehr erforderlich ist, also nicht mehr Gewalt einsetzt als nötig. Auch beim rechtfertigenden Notstand (§ 34 StGB) kann eine Tat erlaubt sein: Die Gefahr ist gegenwärtig und nicht anders abzuwenden, und das geschützte Interesse überwiegt wesentlich. Ist die Tat gerechtfertigt, endet die Prüfung.",
      "Dritte Stufe: die **Schuld**. Sie fragt, ob man der Person die Tat persönlich vorwerfen kann. Ohne Schuld handelt, wer noch nicht 14 Jahre alt ist (§ 19 StGB), oder wer wegen einer krankhaften seelischen Störung, einer tiefgreifenden Bewusstseinsstörung, einer Intelligenzminderung oder einer anderen schweren seelischen Störung das Unrecht nicht einsehen oder nicht danach handeln kann (§ 20 StGB). Nur wenn alle drei Stufen erfüllt sind, ist die Tat strafbar. Im Modell stellst du die Umstände selbst ein und beobachtest, auf welcher Stufe die Prüfung endet und warum.",
    ],
    terms: [
      { term: "Tatbestandsmäßigkeit", text: "Die Handlung erfüllt alle Merkmale, die ein Strafgesetz für die Tat beschreibt, auch den Vorsatz." },
      { term: "Vorsatz", text: "Wissen und Wollen, den gesetzlichen Tatbestand zu verwirklichen; Fahrlässigkeit ist nur strafbar, wenn das Gesetz es ausdrücklich sagt." },
      { term: "Rechtswidrigkeit", text: "Die Tat verstößt gegen die Rechtsordnung, weil kein Rechtfertigungsgrund wie Notwehr sie ausnahmsweise erlaubt." },
      { term: "Schuld", text: "Die persönliche Vorwerfbarkeit: Die Person konnte das Unrecht einsehen und hätte sich anders entscheiden können." },
      { term: "Schuldunfähigkeit", text: "Wegen ihres Alters unter 14 oder einer schweren seelischen Störung kann die Person nicht bestraft werden." },
    ],
    law: [
      {
        ref: "§ 32 StGB",
        text: "Wer einen gegenwärtigen rechtswidrigen Angriff auf sich oder andere abwehrt und dafür die erforderliche Verteidigung wählt, handelt nicht rechtswidrig.",
        url: "https://www.gesetze-im-internet.de/stgb/__32.html",
      },
      {
        ref: "§§ 19 und 20 StGB",
        text: "Kinder unter 14 Jahren sind schuldunfähig. Ohne Schuld handelt auch, wer wegen einer krankhaften seelischen Störung, einer tiefgreifenden Bewusstseinsstörung, einer Intelligenzminderung oder einer anderen schweren seelischen Störung das Unrecht nicht einsehen oder nicht danach handeln kann.",
        url: "https://www.gesetze-im-internet.de/stgb/__19.html",
      },
    ],
    takeaway:
      "Strafbar ist eine Tat nur, wenn sie den Tatbestand erfüllt, rechtswidrig ist und schuldhaft begangen wurde. Fehlt eine dieser Stufen, etwa wegen Notwehr oder weil die Person unter 14 ist, endet die Prüfung ohne Strafe.",
    sourceIds: ["lp", "stgb"],
    quiz: {
      question: "Ein Zwölfjähriger beschädigt absichtlich ein fremdes Fahrrad. Warum wird er nicht bestraft?",
      answer: "Er erfüllt den Tatbestand und handelt rechtswidrig, ist aber mit unter 14 Jahren schuldunfähig.",
      wrong: [
        "Er erfüllt den Tatbestand nicht, weil Sachbeschädigung nur von Erwachsenen begangen werden kann.",
        "Seine Tat ist gerechtfertigt, weil Kinder noch nicht wissen, was erlaubt und was verboten ist.",
      ],
      explanation:
        "Der Tatbestand der Sachbeschädigung gilt für jede Person, und ein Rechtfertigungsgrund liegt nicht vor. Es fehlt erst auf der dritten Stufe, der Schuld: Kinder unter 14 Jahren sind nach § 19 StGB schuldunfähig.",
    },
    lab: "strafbarkeit",
    labGoals: ["strafbar", "gerechtfertigt", "schuldunfaehig", "kein-tatbestand"],
    workshop: {
      kind: "classify",
      title: "Wo endet die Prüfung?",
      instruction: "Ordne jeden Fall der Stufe zu, auf der die Prüfung endet, oder entscheide, dass die Tat strafbar ist.",
      categories: ["Tatbestand fehlt", "Gerechtfertigt", "Ohne Schuld", "Strafbar"],
      entries: [
        {
          text: "Jule nimmt im Kaufhaus absichtlich eine Jeans mit, ohne zu bezahlen, und will sie behalten. Sie ist erwachsen und gesund.",
          target: 3,
          feedback: "Der Diebstahl ist erfüllt, es gibt keinen Rechtfertigungsgrund, und Jule ist schuldfähig.",
        },
        {
          text: "Ein Zwölfjähriger tritt absichtlich gegen einen geparkten Roller, der dabei umfällt und zerkratzt wird.",
          target: 2,
          feedback: "Tatbestand und Rechtswidrigkeit liegen vor, doch Kinder unter 14 Jahren sind schuldunfähig (§ 19 StGB).",
        },
        {
          text: "Bei großer Hitze schlägt ein Passant die Scheibe eines geparkten Autos ein, um ein darin eingeschlossenes Kleinkind zu retten. Hilfe ist nicht schnell genug zu holen.",
          target: 1,
          feedback: "Die Sachbeschädigung ist durch den rechtfertigenden Notstand erlaubt (§ 34 StGB): Die Gefahr ist nicht anders abzuwenden, und das Leben des Kindes wiegt wesentlich schwerer als die Scheibe.",
        },
        {
          text: "Tim nimmt versehentlich die Jacke eines Freundes mit, weil sie genauso aussieht wie seine eigene, und bemerkt es erst zu Hause.",
          target: 0,
          feedback: "Tim wusste nicht, dass die Jacke fremd ist, und handelte ohne Vorsatz (§ 16 StGB): Der Diebstahl ist nicht erfüllt.",
        },
        {
          text: "Kemal, volljährig und gesund, stößt bei einer Party einen Bekannten im Streit absichtlich um. Der Bekannte prellt sich dabei die Schulter.",
          target: 3,
          feedback: "Die absichtliche Körperverletzung erfüllt den Tatbestand; es gab keinen Angriff, der sie rechtfertigt, und Kemal ist schuldfähig.",
        },
      ],
      conclusion: "Die Prüfung geht der Reihe nach vor: Tatbestand, Rechtswidrigkeit, Schuld. Sobald eine Stufe fehlt, bleibt die Tat straflos.",
    },
    casework: {
      title: "Der Rucksack auf dem Schulweg",
      story:
        "Ein Fremder will der jüngeren Schwester von Anna (16) den **Rucksack entreißen**. Anna **schubst** ihn so, dass er den Rucksack loslässt. Er fällt hin und schürft sich die Hand auf. Nun wird geprüft, ob sich Anna strafbar gemacht hat.",
      steps: [
        {
          question: "Erfüllt Annas Schubser den Tatbestand der Körperverletzung (§ 223 StGB)?",
          options: [
            "Ja: Sie hat den Mann absichtlich körperlich misshandelt und seine Gesundheit geschädigt.",
            "Nein, denn dafür müsste Anna den Mann so schwer verletzt haben, dass er ins Krankenhaus muss.",
            "Nein, denn eine Minderjährige kann den Tatbestand der Körperverletzung gar nicht erfüllen.",
          ],
          answer: 0,
          explanation: "Auch eine Schürfwunde ist eine Gesundheitsschädigung; nur reine Bagatellen zählen nicht. Das Alter spielt für den Tatbestand keine Rolle, sondern erst bei der Schuld.",
        },
        {
          question: "Ist der Schubser rechtswidrig?",
          options: [
            "Nein: Anna wehrt einen gegenwärtigen rechtswidrigen Angriff auf ihre Schwester ab, das ist Notwehr.",
            "Ja, denn Gewalt ist nach dem Strafgesetzbuch immer verboten, auch wenn sie der Verteidigung dient.",
            "Ja, denn Notwehr gilt nur, wenn man selbst angegriffen wird, nicht bei Angriffen auf andere.",
          ],
          answer: 0,
          explanation: "Der Fremde greift gegenwärtig und rechtswidrig an. Notwehr schützt nach § 32 StGB auch andere, und ein Schubser ist ein erforderliches, mildes Mittel.",
        },
        {
          question: "Muss danach noch geprüft werden, ob Anna schuldfähig ist?",
          options: [
            "Nein: Wer gerechtfertigt handelt, handelt nicht rechtswidrig; die Prüfung endet ohne Strafbarkeit.",
            "Ja, denn die Schuld wird immer als dritte Stufe geprüft, auch wenn die Tat erlaubt war.",
            "Ja, denn mit 16 Jahren ist Anna noch nicht voll schuldfähig und muss deshalb geprüft werden.",
          ],
          answer: 0,
          explanation: "Ist die Tat gerechtfertigt, ist sie nicht rechtswidrig. Dann gibt es nichts mehr, wofür man Anna schuldig sprechen könnte.",
        },
      ],
      verdict:
        "Annas Schubser erfüllt zwar den Tatbestand der Körperverletzung, ist aber durch Notwehr gerechtfertigt. Anna handelt nicht rechtswidrig und ist deshalb nicht strafbar; die Schuld muss gar nicht mehr geprüft werden.",
    },
    tasks: {
      1: {
        prompt: "Erkläre, in welchen drei Stufen man die Strafbarkeit einer Tat prüft, und wende die Stufen auf einen Fahrraddiebstahl an.",
        hints: ["Was beschreibt § 242 StGB, und was muss die Handlung dafür erfüllen?", "Welche Umstände könnten die Tat rechtfertigen oder die Schuld ausschließen?"],
        model:
          "Zuerst prüft man den Tatbestand: Beim Diebstahl muss jemand vorsätzlich eine fremde bewegliche Sache wegnehmen, um sie sich zuzueignen. Danach fragt man, ob die Tat rechtswidrig ist, also ob ein Rechtfertigungsgrund wie Notwehr fehlt. Zuletzt prüft man die Schuld: Wer unter 14 Jahre alt ist oder wegen einer schweren seelischen Störung das Unrecht nicht einsehen kann, bleibt straflos. Nur wenn alle drei Stufen erfüllt sind, ist die Person, die das Fahrrad gestohlen hat, strafbar.",
        criteria: [
          "Nennt die drei Stufen in der richtigen Reihenfolge",
          "Wendet den Tatbestand des Diebstahls auf das Fahrrad an",
          "Nennt für Rechtswidrigkeit und Schuld je einen Umstand, der die Strafbarkeit ausschließen kann",
        ],
      },
      2: {
        prompt:
          "Prüfe zwei Fälle. a) Hannah (13) ritzt aus Wut absichtlich ein Herz in den Lack eines fremden Autos. b) Felix fährt aus Unachtsamkeit mit dem Fahrrad gegen ein parkendes Auto und verkratzt den Lack. Beurteile jeweils, ob eine Strafbarkeit vorliegt.",
        hints: ["Auf welcher Stufe endet die Prüfung bei Hannah?", "Handelt Felix vorsätzlich oder fahrlässig, und was sagt § 15 StGB dazu?"],
        model:
          "Fall a: Hannah erfüllt den Tatbestand der Sachbeschädigung und handelt rechtswidrig, denn ein Rechtfertigungsgrund liegt nicht vor. Mit 13 Jahren ist sie aber schuldunfähig (§ 19 StGB) und wird nicht bestraft. Fall b: Felix handelt nur fahrlässig, nicht vorsätzlich. Fahrlässige Sachbeschädigung ist im Strafgesetzbuch nicht mit Strafe bedroht (§ 15 StGB), also fehlt schon der Tatbestand und er ist nicht strafbar.",
        criteria: [
          "Prüft beide Fälle in der Reihenfolge der drei Stufen",
          "Begründet für Hannah, dass die Schuld wegen ihres Alters unter 14 fehlt",
          "Begründet für Felix, dass der Vorsatz fehlt und fahrlässige Sachbeschädigung nicht strafbar ist",
        ],
      },
    },
  },
  {
    id: "st-folgen",
    lb: 4,
    unit: "4.3",
    title: "Strafen, weitere Rechtsfolgen und ihre Wirkung",
    intro: "Welche Folgen das Strafgesetzbuch kennt, wie man sie einer Tat zuordnet und ob sie angemessen sind.",
    paragraphs: [
      "Hat jemand eine Straftat begangen, bestimmt das Gericht die Rechtsfolge. Häufig ist die **Geldstrafe**. Sie wird in **Tagessätzen** verhängt (§ 40 StGB): Die Zahl richtet sich nach der Schuld, die Höhe eines Tagessatzes nach dem Einkommen. Angenommen, jemand erhält 30 Tagessätze zu je 20 Euro, dann zahlt er 600 Euro. Schwerer wiegt die **Freiheitsstrafe**, die mindestens einen Monat dauert (§ 38 StGB). Bei bis zu einem Jahr setzt das Gericht sie zur **Bewährung** aus, wenn zu erwarten ist, dass die Person auch ohne Haft keine Straftaten mehr begeht; bis zu zwei Jahren ist das bei besonderen Umständen möglich (§ 56 StGB).",
      "Neben der Strafe sind **weitere Rechtsfolgen** möglich. Ein Fahrverbot von einem bis zu sechs Monaten ist eine Zusatzstrafe; das Gericht kann es auch bei Taten anordnen, die nichts mit dem Auto zu tun haben, wenn es auf die Person einwirken soll (§ 44 StGB). Die Entziehung der Fahrerlaubnis (§ 69 StGB) ist keine Strafe, sondern eine **Maßregel**: Sie schützt vor Fahrern, die sich durch eine Tat beim Fahren als ungeeignet gezeigt haben. Auch die **Einziehung** ist keine Strafe: Der Staat nimmt weg, was jemand durch die Tat erlangt hat (§ 73 StGB), etwa erschwindelte 500 Euro.",
      "Welche Folge zu einer Tat gehört, steht im Strafgesetzbuch. Man benennt zuerst die Straftat und liest dann ihren Strafrahmen nach. Beispiele aus dem Internet: **Betrug**, etwa mit einem erfundenen Verkaufsangebot, bis zu fünf Jahre Freiheitsstrafe oder Geldstrafe (§ 263 StGB). **Beleidigung** bis zu einem Jahr, öffentlich oder durch Verbreiten eines Inhalts bis zu zwei Jahre, oder Geldstrafe (§ 185 StGB). **Ausspähen von Daten**, etwa der unbefugte Zugang zu einem fremden Online-Konto, bis zu drei Jahre oder Geldstrafe (§ 202a StGB). Bilder, die dem Ansehen einer Person erheblich schaden, ohne Erlaubnis weitergeben: bis zu zwei Jahre oder Geldstrafe (§ 201a Abs. 2 StGB).",
      "Ob eine Folge wirkt und angemessen ist, darüber wird diskutiert. Eine Geldstrafe lässt den Alltag unberührt, manche halten sie deshalb für zu milde. Eine Freiheitsstrafe schützt die Allgemeinheit, kann aber Ausbildung, Beruf und Familie gefährden; andere halten sie deshalb für riskant. Das Gericht richtet sich nach der Schuld und beachtet auch die Wirkung auf das künftige Leben der Person (§ 46 StGB). Die Folge muss **verhältnismäßig** sein: geeignet, ihr Ziel zu erreichen, nicht härter als nötig und passend zur Schwere der Tat.",
    ],
    terms: [
      { term: "Tagessatz", text: "Eine Geldstrafe besteht aus einer Zahl von Tagessätzen; die Höhe eines Tagessatzes richtet sich nach dem Einkommen der verurteilten Person." },
      { term: "Bewährung", text: "Das Gericht verhängt eine Freiheitsstrafe, vollstreckt sie aber zunächst nicht, solange sich die verurteilte Person bewährt." },
      { term: "Weitere Rechtsfolgen", text: "Folgen neben der Strafe: das Fahrverbot als Zusatzstrafe, die Entziehung der Fahrerlaubnis als Maßregel und die Einziehung. Maßregel und Einziehung sind keine Strafen." },
      { term: "Einziehung", text: "Der Staat zieht ein, was durch die Tat erlangt wurde, oder Gegenstände, die für die Tat benutzt wurden." },
      { term: "Verhältnismäßigkeit", text: "Eine Folge ist verhältnismäßig, wenn sie ihr Ziel erreichen kann, nicht härter als nötig ist und zur Tat passt." },
    ],
    law: [
      {
        ref: "§ 40 StGB",
        text: "Eine Geldstrafe wird in Tagessätzen verhängt, mindestens fünf und, wenn das Gesetz nichts anderes sagt, höchstens 360. Die Höhe eines Tagessatzes richtet sich nach den persönlichen und wirtschaftlichen Verhältnissen, meist nach dem Nettoeinkommen.",
        url: "https://www.gesetze-im-internet.de/stgb/__40.html",
      },
      {
        ref: "§ 56 StGB",
        text: "Eine Freiheitsstrafe bis zu einem Jahr wird bei guter Zukunftsprognose zur Bewährung ausgesetzt; bis zu zwei Jahren ist das unter besonderen Umständen möglich. Ab sechs Monaten kann die Verteidigung der Rechtsordnung dagegen sprechen.",
        url: "https://www.gesetze-im-internet.de/stgb/__56.html",
      },
    ],
    takeaway:
      "Das Strafgesetzbuch kennt Geldstrafe in Tagessätzen, Freiheitsstrafe auch zur Bewährung und weitere Rechtsfolgen wie Fahrverbot oder Einziehung. Das Gericht wählt die Folge nach der Schuld und prüft, ob sie wirkt und verhältnismäßig ist.",
    sourceIds: ["lp", "stgb"],
    quiz: {
      question: "Wie wird eine Geldstrafe nach dem Strafgesetzbuch berechnet?",
      answer: "Nach Zahl und Höhe der Tagessätze: Die Zahl folgt der Schuld, die Höhe dem Einkommen.",
      wrong: [
        "Das Gericht legt eine feste Summe fest, die für alle bei derselben Tat gleich hoch ist.",
        "Nach dem Wert des Schadens: Die Strafe entspricht dem Betrag, den die Tat angerichtet hat.",
      ],
      explanation:
        "Das Gesetz verlangt Tagessätze, damit gleiche Schuld auch bei verschiedenem Einkommen ähnlich spürbar ist. Den Schaden auszugleichen ist dagegen Sache des Zivilrechts.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Straftat steckt dahinter?",
      instruction: "Ordne jeden Fall der Straftat zu, deren Strafrahmen im Strafgesetzbuch zu ihm passt.",
      categories: ["Betrug (§ 263)", "Beleidigung (§ 185)", "Ausspähen von Daten (§ 202a)", "Ansehensschädigendes Bild (§ 201a)"],
      entries: [
        {
          text: "Mara bietet im Internet eine Spielekonsole zum Verkauf an, die sie gar nicht besitzt. Mehrere Käufer überweisen Geld, doch es kommt nie eine Konsole an.",
          target: 0,
          feedback: "Die Käufer wurden durch eine falsche Behauptung getäuscht und verloren Geld: Betrug, bis zu fünf Jahre Freiheitsstrafe oder Geldstrafe.",
        },
        {
          text: "Ein Schüler beschimpft im öffentlichen Kommentarbereich eines Videos eine Mitschülerin mit üblen Schimpfwörtern.",
          target: 1,
          feedback: "Die ehrverletzende Äußerung ist eine Beleidigung; öffentlich begangen drohen bis zu zwei Jahre Freiheitsstrafe oder Geldstrafe.",
        },
        {
          text: "Jonas verschafft sich ohne Erlaubnis Zugang zum passwortgeschützten Social-Media-Konto seiner Schwester und liest ihre privaten Nachrichten.",
          target: 2,
          feedback: "Er verschafft sich unbefugt Zugang zu gesicherten Daten, die nicht für ihn bestimmt sind: bis zu drei Jahre oder Geldstrafe.",
        },
        {
          text: "Eine Jugendliche leitet ein Bild, das eine Mitschülerin in einer sehr peinlichen Lage zeigt und ihrem Ansehen erheblich schadet, ohne Erlaubnis an die ganze Stufe weiter. Beschimpft wird sie dabei nicht.",
          target: 3,
          feedback: "Das unbefugte Zugänglichmachen eines solchen Bildes ist strafbar: bis zu zwei Jahre Freiheitsstrafe oder Geldstrafe (§ 201a Abs. 2 StGB).",
        },
        {
          text: "Ein Käufer behauptet in einem Online-Shop wahrheitswidrig, sein Paket sei nie angekommen, und lässt sich den Kaufpreis erstatten.",
          target: 0,
          feedback: "Er täuscht den Shop, der daraufhin zahlt, und verschafft sich einen Vermögensvorteil: Betrug nach § 263 StGB.",
        },
      ],
      conclusion: "Wer die Tat richtig benennt, findet im Strafgesetzbuch den Strafrahmen. Welche Folge das Gericht dann wählt, hängt von Schuld und Umständen ab.",
    },
    casework: {
      title: "Das gefälschte Zeugnis",
      story:
        "Ben (26) ändert in der PDF-Datei seines Zeugnisses die Note in Mathematik von 4 auf 2 und **schickt sie mit seiner Bewerbung** an eine Firma. Die Firma bemerkt die Fälschung und zeigt ihn an. Ben hat **keine Vorstrafen**.",
      steps: [
        {
          question: "Welche Straftat kommt hier in Betracht?",
          options: [
            "Fälschung beweiserheblicher Daten (§ 269 StGB): Er verändert Daten, um im Rechtsverkehr zu täuschen.",
            "Ausspähen von Daten (§ 202a StGB): Er hat sich Zugang zu einer fremden Datei verschafft.",
            "Beleidigung (§ 185 StGB): Er hat die Schule durch die Fälschung in ihrer Ehre verletzt.",
          ],
          answer: 0,
          explanation: "Ein verändertes PDF, das wie ein echtes Zeugnis auftritt, kommt als Fälschung beweiserheblicher Daten (§ 269 StGB) in Betracht. Das Ausspähen setzt fremde, gesicherte Daten voraus.",
        },
        {
          question: "Welche Rechtsfolge sieht das Gesetz dafür vor?",
          options: [
            "Freiheitsstrafe bis zu fünf Jahren oder Geldstrafe",
            "Nur eine Geldbuße wie bei einer Ordnungswidrigkeit",
            "Ausschließlich Freiheitsstrafe von mindestens einem Jahr",
          ],
          answer: 0,
          explanation: "§ 269 StGB lässt dem Gericht die Wahl zwischen Geldstrafe und Freiheitsstrafe bis zu fünf Jahren. Eine Geldbuße gibt es nur bei Ordnungswidrigkeiten.",
        },
        {
          question: "Das Gericht verhängt eine Geldstrafe von 60 Tagessätzen. Wovon hängt die Höhe eines einzelnen Tagessatzes ab?",
          options: [
            "Von den wirtschaftlichen Verhältnissen, vor allem vom Nettoeinkommen der verurteilten Person",
            "Von der Schwere der Schuld, also davon, wie schlimm die Fälschung war",
            "Vom Wert des Schadens, den die Firma durch die Fälschung erlitten hat",
          ],
          answer: 0,
          explanation: "Die Schwere der Schuld bestimmt die Zahl der Tagessätze. Die Höhe eines Tagessatzes richtet sich nach dem Einkommen und den Lebensverhältnissen (§ 40 StGB).",
        },
        {
          question: "Ben hat keine Vorstrafen, und niemand wurde verletzt. Was spricht deshalb für eine Geldstrafe statt einer Haftstrafe?",
          options: [
            "Sie ist spürbar und trotzdem nicht härter als nötig für jemanden ohne Vorstrafen.",
            "Fälschungen müssen nach dem Gesetz immer mit Haft bestraft werden, damit andere abgeschreckt werden.",
            "Es ist kein Unrecht geschehen, weil niemand verletzt wurde und die Firma die Fälschung bemerkt hat.",
          ],
          answer: 0,
          explanation: "Verhältnismäßig ist eine Folge, die wirkt, ohne mehr zu verlangen als nötig. Haft müsste das Gericht nicht verhängen, und Unrecht geschieht auch ohne Verletzte.",
        },
      ],
      verdict:
        "Ben hat voraussichtlich beweiserhebliche Daten gefälscht (§ 269 StGB). Das Gesetz sieht Geldstrafe oder bis zu fünf Jahre Freiheitsstrafe vor. Bei jemandem ohne Vorstrafen erscheint eine Geldstrafe in Tagessätzen verhältnismäßig.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, wie eine Geldstrafe berechnet wird und warum das Gesetz Zahl und Höhe der Tagessätze getrennt behandelt. Rechne mit angenommenen 40 Tagessätzen zu je 25 Euro.",
        hints: ["Wonach richtet sich die Zahl der Tagessätze?", "Wonach richtet sich die Höhe eines Tagessatzes, und warum?"],
        model:
          "Die Zahl der Tagessätze richtet sich nach der Schwere der Schuld, die Höhe eines Tagessatzes nach dem Einkommen. Bei angenommenen 40 Tagessätzen zu je 25 Euro beträgt die Geldstrafe 1.000 Euro. Die Trennung sorgt dafür, dass dieselbe Schuld Menschen mit viel und mit wenig Einkommen ähnlich spürbar trifft. Eine feste Summe würde Wohlhabende kaum, Geringverdiener aber hart treffen.",
        criteria: [
          "Nennt, wonach sich die Zahl und wonach sich die Höhe der Tagessätze richtet",
          "Berechnet die Geldstrafe aus Zahl und Höhe (40 mal 25 Euro)",
          "Begründet, warum eine feste Summe weniger gerecht wäre",
        ],
      },
      2: {
        prompt:
          "Eine 27-Jährige hat zum ersten Mal einen Bekannten im Internet öffentlich beleidigt, und er hat Strafantrag gestellt. Die Staatsanwältin fordert drei Monate Freiheitsstrafe, die Verteidigung eine Geldstrafe. Beurteile, welche Folge verhältnismäßig ist.",
        hints: ["Wie schwer wiegt die Tat im Vergleich zum Strafrahmen von § 185 StGB?", "Welche Wirkung hätte jede Folge auf die Person, und was sagt § 47 StGB zu kurzen Freiheitsstrafen?"],
        model:
          "Das Gesetz lässt bei einer öffentlichen Beleidigung Geldstrafe oder Freiheitsstrafe bis zu zwei Jahren zu, die Tat liegt hier aber im unteren Bereich. Bei einer Ersttäterin mit geringer Schuld wirkt eine Geldstrafe spürbar und reicht, um die Tat zu ahnden und sie zur Vorsicht zu mahnen. Drei Monate Haft, selbst zur Bewährung, träfen sie härter als nötig und könnten Arbeit und Umfeld gefährden; eine Freiheitsstrafe unter sechs Monaten verhängt das Gericht ohnehin nur, wenn besondere Umstände sie unerlässlich machen (§ 47 StGB). Anders könnte ich urteilen, wenn sie die Tat wiederholt oder besonders schwer begangen hätte.",
        criteria: [
          "Ordnet die Tat im Strafrahmen von § 185 StGB ein",
          "Vergleicht die Wirkung von Geldstrafe und Freiheitsstrafe",
          "Begründet mit der Verhältnismäßigkeit, welche Folge passt",
        ],
      },
    },
  },
  {
    id: "st-verfahren",
    lb: 4,
    unit: "4.3",
    title: "Das Strafverfahren und seine Beteiligten",
    intro: "Vom Verdacht bis zum Urteil: Phasen, Beteiligte und die rechtsstaatlichen Grundsätze eines Strafverfahrens.",
    paragraphs: [
      "Ein Strafverfahren verläuft in festen Phasen. Im **Ermittlungsverfahren** erforscht die Polizei die Tat und sammelt Beweise (§ 163 StPO). Die **Staatsanwaltschaft** leitet die Ermittlungen und prüft auch, was für die beschuldigte Person spricht (§ 160 StPO). Manche Taten, etwa Beleidigung oder Sachbeschädigung, werden meist nur auf **Strafantrag** der verletzten Person verfolgt (binnen drei Monaten, § 77b StGB). Reicht der Verdacht, erhebt die Staatsanwaltschaft **Anklage**, sonst stellt sie das Verfahren ein (§ 170 StPO). Im **Zwischenverfahren** prüft das Gericht, ob ein hinreichender Tatverdacht besteht, und eröffnet das Hauptverfahren (§ 203 StPO). In der **Hauptverhandlung** werden die Beweise erhoben, und am Ende ergeht das **Urteil**.",
      "In der Hauptverhandlung hat jede Person eine Aufgabe. **Berufsrichterinnen und Berufsrichter** leiten die Verhandlung und entscheiden. Einfache Fälle entscheidet eine Strafrichterin oder ein Strafrichter allein. Bei mittelschweren Fällen urteilt das Schöffengericht: meist eine Berufsrichterin oder ein Berufsrichter gemeinsam mit zwei **Schöffen**, ehrenamtlichen Richtern mit gleichem Stimmrecht (§§ 25, 29 und 30 GVG). Die schwersten Fälle verhandelt das Landgericht. Die Staatsanwaltschaft vertritt die Anklage. Die **angeklagte Person** darf sich äußern oder schweigen. Die **Verteidigung** hilft ihr, ihre Rechte wahrzunehmen. **Zeugen** sagen aus, was sie wahrgenommen haben, **Sachverständige** liefern Fachwissen, etwa ein ärztliches Gutachten.",
      "Das Verfahren zeigt, wie ernst der Rechtsstaat es nimmt, gerecht zu strafen. Bis zum rechtskräftigen Urteil gilt die **Unschuldsvermutung** (Art. 6 Abs. 2 der Europäischen Menschenrechtskonvention): Die angeklagte Person muss ihre Unschuld nicht beweisen. Sie hat Anspruch auf **rechtliches Gehör** (Art. 103 Abs. 1 GG) und darf sich verteidigen lassen (§ 137 StPO). Die Gerichte sind **unabhängig** und nur dem Gesetz unterworfen (Art. 97 Abs. 1 GG). Die Hauptverhandlung ist grundsätzlich **öffentlich** (§ 169 GVG), damit die Allgemeinheit die Rechtsprechung kontrollieren kann.",
      "Am Ende steht das **Urteil**: Freispruch oder Verurteilung. Gegen Urteile gibt es Rechtsmittel wie Berufung oder Revision; erst ein rechtskräftiges Urteil wird vollstreckt (§ 449 StPO). Der Lehrplan empfiehlt, nach Möglichkeit eine Gerichtsverhandlung zu besuchen oder mit einer Strafrichterin oder einem Strafrichter zu sprechen. Darauf kannst du dich vorbereiten: Wer sitzt wo, wer spricht wann, und woran erkennst du die Grundsätze des Rechtsstaats? Verhandlungen gegen Jugendliche sind allerdings nicht öffentlich (§ 48 JGG), gegen Heranwachsende in der Regel schon.",
    ],
    terms: [
      { term: "Staatsanwaltschaft", text: "Die Behörde, die Ermittlungen leitet, Anklage erhebt und in der Hauptverhandlung die Anklage vertritt." },
      { term: "Schöffen", text: "Ehrenamtliche Richter, die in der Hauptverhandlung mit gleichem Stimmrecht wie Berufsrichterinnen und Berufsrichter über Schuld und Strafe mitentscheiden." },
      { term: "Unschuldsvermutung", text: "Bis zu einem rechtskräftigen Urteil gilt eine beschuldigte Person als unschuldig; das Gericht darf sie nur verurteilen, wenn es von ihrer Schuld überzeugt ist." },
      { term: "Rechtliches Gehör", text: "Jede Person hat vor Gericht das Recht, sich zu den Vorwürfen zu äußern und gehört zu werden." },
      { term: "Rechtskraft", text: "Ein Urteil ist rechtskräftig, wenn es nicht mehr mit einem Rechtsmittel angegriffen werden kann; erst dann wird es vollstreckt." },
    ],
    law: [
      {
        ref: "Art. 97 Abs. 1 und Art. 103 Abs. 1 GG",
        text: "Richter sind unabhängig und nur dem Gesetz unterworfen. Vor Gericht hat jede Person Anspruch auf rechtliches Gehör.",
        url: "https://www.gesetze-im-internet.de/gg/art_97.html",
      },
      {
        ref: "§§ 136 und 137 StPO",
        text: "Beschuldigten Personen ist bei der Vernehmung zu eröffnen, dass sie sich äußern oder schweigen dürfen und jederzeit eine Verteidigung befragen können. In jeder Lage des Verfahrens dürfen sie sich von einer Verteidigung unterstützen lassen.",
        url: "https://www.gesetze-im-internet.de/stpo/__136.html",
      },
    ],
    takeaway:
      "Ein Strafverfahren besteht aus Ermittlung, Anklage, Zwischenverfahren, Hauptverhandlung und Urteil, danach folgen Rechtsmittel; vollstreckt wird erst ein rechtskräftiges Urteil. Unschuldsvermutung, rechtliches Gehör, unabhängige Gerichte, Öffentlichkeit und Verteidigung sichern ein faires Verfahren.",
    sourceIds: ["lp", "stpo", "gg"],
    quiz: {
      question: "Was bedeutet die Unschuldsvermutung im Strafverfahren?",
      answer: "Bis zu einem rechtskräftigen Urteil gilt die Person als unschuldig und muss ihre Unschuld nicht beweisen.",
      wrong: [
        "Die beschuldigte Person muss selbst beweisen, dass sie die Tat nicht begangen hat, sonst wird sie verurteilt.",
        "Schon mit der Anklage gilt die Person als schuldig, bis ein Gericht sie ausdrücklich freispricht.",
      ],
      explanation:
        "Die Schuld muss nachgewiesen werden, nicht die Unschuld: Das Gericht darf nur verurteilen, wenn es von der Schuld überzeugt ist (§ 261 StPO). Bleiben ernsthafte Zweifel, wird die Person freigesprochen.",
    },
    workshop: {
      kind: "timeline",
      title: "Der Weg durch das Strafverfahren",
      instruction: "Bringe die Schritte eines Strafverfahrens in die richtige Reihenfolge.",
      categories: [],
      entries: [
        {
          text: "Ein Fahrrad wird gestohlen und angezeigt. Die Polizei sichert Spuren und befragt Zeugen; die Staatsanwaltschaft leitet die Ermittlungen.",
          target: 0,
          feedback: "Am Anfang steht der Verdacht: Im Ermittlungsverfahren werden Beweise gesammelt, auch solche, die entlasten.",
        },
        {
          text: "Die Staatsanwaltschaft hält den Verdacht für hinreichend und reicht beim Gericht eine Anklageschrift ein.",
          target: 1,
          feedback: "Erst nach den Ermittlungen entscheidet die Staatsanwaltschaft, ob sie anklagt oder das Verfahren einstellt.",
        },
        {
          text: "Das Gericht prüft die Anklage und beschließt, dass das Hauptverfahren eröffnet wird.",
          target: 2,
          feedback: "Im Zwischenverfahren prüft das Gericht, ob ein hinreichender Tatverdacht besteht, bevor überhaupt verhandelt wird.",
        },
        {
          text: "In der öffentlichen Hauptverhandlung wird die angeklagte Person gehört, Zeugen werden vernommen, und es folgen die Schlussvorträge; die angeklagte Person hat das letzte Wort.",
          target: 3,
          feedback: "Die Beweise werden erst in der Hauptverhandlung vor dem Gericht erhoben; das letzte Wort gehört der angeklagten Person.",
        },
        {
          text: "Das Gericht verkündet das Urteil und begründet es: Freispruch oder Verurteilung.",
          target: 4,
          feedback: "Das Urteil folgt auf die Beweisaufnahme und die Schlussvorträge.",
        },
        {
          text: "Gegen das Urteil wird Berufung eingelegt; erst wenn es am Ende rechtskräftig ist, kann die Strafe vollstreckt werden.",
          target: 5,
          feedback: "Vollstreckt wird nur ein rechtskräftiges Urteil, also nachdem Rechtsmittel ausgeschöpft sind oder nicht eingelegt wurden.",
        },
      ],
      conclusion: "Jede Phase hat ihre Aufgabe: erst klären, dann anklagen, prüfen, verhandeln, urteilen und erst am Ende vollstrecken.",
    },
    casework: {
      title: "Der Zeuge, die Verteidigung und das Gericht",
      story:
        "Gegen **Jan** (25) wird wegen Sachbeschädigung verhandelt. Die Zeugin **Carla** soll aussagen, was sie nachts gesehen hat. Jan hat noch keine Verteidigung und möchte sich zur **Anklage** lieber nicht äußern.",
      steps: [
        {
          question: "Muss Jan zur Anklage aussagen?",
          options: [
            "Nein: Er darf schweigen, und daraus darf ihm kein Nachteil entstehen.",
            "Ja, wer unschuldig ist, muss sich vor Gericht erklären, sonst hat er wohl etwas zu verbergen.",
            "Ja, sonst gilt die Tat als zugegeben, und das Gericht verurteilt ihn ohne weitere Beweise.",
          ],
          answer: 0,
          explanation: "Die angeklagte Person wird darauf hingewiesen, dass es ihr freisteht, sich zu äußern oder nicht zur Sache auszusagen. Schweigen gilt nicht als Geständnis.",
        },
        {
          question: "Darf sich Jan von einer Verteidigung unterstützen lassen?",
          options: [
            "Ja, in jeder Lage des Verfahrens, auch schon vor der Hauptverhandlung.",
            "Nur, wenn die Staatsanwaltschaft der Verteidigung vorher zustimmt.",
            "Nein, vor Gericht muss jede angeklagte Person allein für sich sprechen.",
          ],
          answer: 0,
          explanation: "Das Recht auf Verteidigung gehört zu den rechtsstaatlichen Grundsätzen (§ 137 StPO). Die Staatsanwaltschaft muss dem nicht zustimmen.",
        },
        {
          question: "Wer entscheidet am Ende über Jans Schuld?",
          options: [
            "Ein unabhängiges Gericht nach seiner freien Überzeugung aus der Hauptverhandlung.",
            "Die Staatsanwaltschaft, weil sie die Anklage erhoben und alles ermittelt hat.",
            "Carla, weil sie die Tat selbst gesehen hat und alles am besten weiß.",
          ],
          answer: 0,
          explanation: "Anklage und Urteil sind getrennt. Die Staatsanwaltschaft klagt an, Zeugen sagen aus, und über das Ergebnis entscheidet das Gericht (§ 261 StPO).",
        },
        {
          question: "Was ist Carlas Aufgabe in der Hauptverhandlung?",
          options: [
            "Sie muss erscheinen und aussagen, was sie wahrgenommen hat.",
            "Sie entscheidet gemeinsam mit den Richtern darüber, ob Jan verurteilt wird.",
            "Sie darf wegbleiben, wenn ihr die Verhandlung unangenehm ist.",
          ],
          answer: 0,
          explanation: "Zeugen sind verpflichtet, zur Verhandlung zu erscheinen und auszusagen (§ 48 StPO). Entscheiden dürfen nur Richter und Schöffen.",
        },
      ],
      verdict:
        "Jan darf schweigen und sich verteidigen lassen; über seine Schuld entscheidet ein unabhängiges Gericht nach der Hauptverhandlung. Carla muss als Zeugin erscheinen und aussagen. So bleibt das Verfahren fair.",
    },
    tasks: {
      1: {
        prompt: "Beschreibe die Phasen eines Strafverfahrens in der richtigen Reihenfolge und nenne zu jeder Phase, wer die Hauptaufgabe hat.",
        hints: ["Wer ermittelt, wer klagt an, wer entscheidet?", "Was geschieht nach dem Urteil, bevor eine Strafe vollstreckt wird?"],
        model:
          "Zuerst ermitteln Polizei und Staatsanwaltschaft, was geschehen ist (Ermittlungsverfahren). Reicht der Verdacht, erhebt die Staatsanwaltschaft Anklage, und das Gericht prüft im Zwischenverfahren, ob verhandelt wird. In der Hauptverhandlung leitet die Richterin die Beweisaufnahme, Zeugen und Sachverständige sagen aus, und das Gericht verkündet das Urteil. Nach möglichen Rechtsmitteln wird ein rechtskräftiges Urteil vollstreckt.",
        criteria: [
          "Nennt die Phasen in der richtigen Reihenfolge",
          "Ordnet Polizei, Staatsanwaltschaft und Gericht ihre Aufgaben zu",
          "Erwähnt, dass erst ein rechtskräftiges Urteil vollstreckt wird",
        ],
      },
      2: {
        prompt:
          "Ein Mitschüler sagt, wer angeklagt werde, sei doch schon fast verurteilt, und eine öffentliche Verhandlung sei überflüssig. Nimm mit Hilfe der Grundsätze der Rechtsstaatlichkeit dazu Stellung.",
        hints: ["Was bedeutet die Unschuldsvermutung für eine angeklagte Person?", "Warum sind eine öffentliche Verhandlung und unabhängige Gerichte wichtig?"],
        model:
          "Die Behauptung stimmt nicht. Nach der Unschuldsvermutung gilt eine angeklagte Person bis zum rechtskräftigen Urteil als unschuldig und muss ihre Unschuld nicht beweisen; das Gericht darf sie nur verurteilen, wenn es von ihrer Schuld überzeugt ist. Durch das rechtliche Gehör und die Verteidigung kann sie ihre Sicht darstellen. Die Öffentlichkeit der Verhandlung erlaubt es allen zu prüfen, ob fair verhandelt wird, und unabhängige Richter entscheiden nur nach dem Gesetz. Zusammen schützen diese Grundsätze vor Willkür.",
        criteria: [
          "Widerlegt die Behauptung mit der Unschuldsvermutung",
          "Nennt mindestens zwei weitere Grundsätze der Rechtsstaatlichkeit",
          "Begründet, wie diese Grundsätze vor Willkür schützen",
        ],
      },
    },
  },
  {
    id: "st-ordnungswidrigkeit",
    lb: 4,
    unit: "4.3",
    title: "Straftat oder Ordnungswidrigkeit?",
    intro: "Wann eine Handlung nur ein Bußgeld und wann eine Strafe nach sich zieht, und warum Schwarzfahren eine Straftat ist.",
    paragraphs: [
      "Falsch parken und ein Fahrrad stehlen sind beides verbotene Handlungen, doch das Gesetz behandelt sie verschieden. Eine **Ordnungswidrigkeit** ist eine rechtswidrige und vorwerfbare Handlung, für die das Gesetz eine **Geldbuße** vorsieht (§ 1 OWiG). Sie gilt als geringeres Unrecht. Eine **Straftat** bedroht das Gesetz dagegen mit Strafe, also mit Geldstrafe oder Freiheitsstrafe. Ob eine Handlung das eine oder das andere ist, bestimmt allein das Gesetz. Typische Ordnungswidrigkeiten sind Verkehrsverstöße wie Parken im Halteverbot, unzulässiger Lärm (§ 117 OWiG) oder das wilde Ablagern von Müll.",
      "Auch das Verfahren ist anders. Bei kleinen Verstößen kann die Behörde eine **Verwarnung** mit Verwarnungsgeld von 5 bis 55 Euro aussprechen, aber nur, wenn man einverstanden ist (§ 56 OWiG). Sonst folgt ein **Bußgeldbescheid** der Verwaltungsbehörde (§ 65 OWiG). Gegen ihn kann man innerhalb von zwei Wochen nach Zustellung **Einspruch** einlegen (§ 67 OWiG). Hilft die Behörde nicht ab, entscheidet am Ende das Amtsgericht (§ 68 OWiG). Wer nichts unternimmt, muss zahlen. Kinder unter 14 Jahren trifft kein Vorwurf (§ 12 OWiG), Jugendliche nur, wenn sie reif genug sind.",
      "Auch die Folgen unterscheiden sich. Auf eine Ordnungswidrigkeit folgt die Geldbuße, bei groben Verkehrsverstößen manchmal ein befristetes Fahrverbot (§ 25 StVG). Sie ist keine Strafe und führt nicht zu einer Vorstrafe. Ein Bußgeld steht nicht im **Führungszeugnis**. Dieses zeigt ausgewählte Verurteilungen aus dem Bundeszentralregister; eine einzelne Geldstrafe bis 90 Tagessätze fehlt dort, wenn sonst nichts eingetragen ist (§§ 3 und 32 BZRG). Schwerere Verkehrsverstöße werden aber im Fahreignungsregister gespeichert (§ 28 StVG). Eine Verurteilung wegen einer Straftat wird dagegen im Bundeszentralregister eingetragen und kann im Führungszeugnis erscheinen.",
      "Viele denken, Schwarzfahren sei nur eine Ordnungswidrigkeit. Das ist ein Irrtum: Wer sich in einem öffentlichen Verkehrsmittel befördern lässt und dabei von vornherein nicht zahlen will, „erschleicht“ die Beförderung. Das ist eine **Straftat** mit Geldstrafe oder Freiheitsstrafe bis zu einem Jahr (§ 265a StGB), bei geringem Fahrpreis meist nur auf Strafantrag des Verkehrsunternehmens. Wer sein gültiges Ticket nur zu Hause vergessen hat, handelt ohne diese Absicht. Auch ein Ladendiebstahl ist kein Bußgeldfall, sondern Diebstahl. Prüfe deshalb immer im Gesetz, was für eine Handlung angedroht wird: Geldbuße oder Strafe?",
    ],
    terms: [
      { term: "Ordnungswidrigkeit", text: "Eine rechtswidrige und vorwerfbare Handlung, für die das Gesetz eine Geldbuße, aber keine Strafe vorsieht." },
      { term: "Geldbuße", text: "Die Folge einer Ordnungswidrigkeit; sie ist keine Strafe und führt nicht zu einer Vorstrafe." },
      { term: "Bußgeldbescheid", text: "Die schriftliche Entscheidung der Behörde über die Geldbuße, gegen die man innerhalb von zwei Wochen nach Zustellung Einspruch einlegen kann." },
      { term: "Führungszeugnis", text: "Eine amtliche Bescheinigung über ausgewählte Eintragungen aus dem Bundeszentralregister; kleine Verurteilungen können fehlen, Bußgelder stehen dort nie." },
    ],
    law: [
      {
        ref: "§ 1 Abs. 1 OWiG",
        text: "Eine Ordnungswidrigkeit ist eine rechtswidrige und vorwerfbare Handlung, die den Tatbestand eines Gesetzes erfüllt, das eine Geldbuße zulässt.",
        url: "https://www.gesetze-im-internet.de/owig_1968/__1.html",
      },
      {
        ref: "§ 265a StGB",
        text: "Wer in der Absicht, das Entgelt nicht zu zahlen, die Beförderung durch ein Verkehrsmittel erschleicht, wird mit Geldstrafe oder Freiheitsstrafe bis zu einem Jahr bestraft. Bei geringem Entgelt wird die Tat meist nur auf Antrag verfolgt.",
        url: "https://www.gesetze-im-internet.de/stgb/__265a.html",
      },
    ],
    takeaway:
      "Eine Ordnungswidrigkeit zieht eine Geldbuße nach sich, meist durch Bußgeldbescheid einer Behörde, ohne Vorstrafe. Eine Straftat zieht eine Strafe nach sich, die ein Gericht verhängt und die im Bundeszentralregister steht. Schwarzfahren in der Absicht, nicht zu zahlen, ist eine Straftat.",
    sourceIds: ["lp", "owig", "stgb"],
    quiz: {
      question: "Was unterscheidet eine Ordnungswidrigkeit von einer Straftat?",
      answer: "Sie zieht eine Geldbuße nach sich, eine Straftat dagegen eine Strafe, die im Bundeszentralregister eingetragen wird.",
      wrong: [
        "Sie ist eine Straftat, die nicht von Gerichten, sondern nur von der Polizei verfolgt und verhängt wird.",
        "Ordnungswidrigkeiten sind alle Verkehrsverstöße; alles andere ist automatisch eine Straftat.",
      ],
      explanation:
        "Der Unterschied liegt in der Folge, die das Gesetz androht: Geldbuße oder Strafe. Es gibt auch Ordnungswidrigkeiten außerhalb des Verkehrs, etwa unzulässigen Lärm, und Straftaten im Verkehr, etwa das Fahren ohne Fahrerlaubnis.",
    },
    workshop: {
      kind: "classify",
      title: "Strafe, Bußgeld oder nichts von beidem?",
      instruction: "Ordne jeden Fall zu: Straftat, Ordnungswidrigkeit oder weder noch.",
      categories: ["Straftat", "Ordnungswidrigkeit", "Weder noch"],
      entries: [
        {
          text: "Sophie steigt in die Straßenbahn, setzt sich wie jede andere Fahrgästin hin und fährt ohne Ticket mit, weil sie nicht zahlen will.",
          target: 0,
          feedback: "Das ist Erschleichen von Leistungen (§ 265a StGB): Wer in der Absicht fährt, nicht zu zahlen, begeht eine Straftat.",
        },
        {
          text: "Jemand parkt eine Stunde lang im Halteverbot.",
          target: 1,
          feedback: "Verkehrsverstöße dieser Art sind Ordnungswidrigkeiten; die Folge ist ein Verwarnungs- oder Bußgeld.",
        },
        {
          text: "Eine Gruppe feiert nachts mit so lauter Musik im Garten, dass die ganze Nachbarschaft erheblich gestört wird.",
          target: 1,
          feedback: "Unzulässiger Lärm, der die Nachbarschaft erheblich belästigt, ist eine Ordnungswidrigkeit (§ 117 OWiG).",
        },
        {
          text: "Ein Jugendlicher nimmt ein fremdes Fahrrad, das vor der Schule steht, um es zu behalten.",
          target: 0,
          feedback: "Das ist Diebstahl (§ 242 StGB), also eine Straftat und kein Bußgeldfall.",
        },
        {
          text: "Zwei Freunde verabreden sich, doch einer kommt eine Stunde zu spät.",
          target: 2,
          feedback: "Das ist unhöflich, aber weder strafbar noch bußgeldbedroht: Kein Gesetz droht dafür eine Folge an.",
        },
        {
          text: "Jemand lässt heimlich einen alten Sessel im Wald zurück.",
          target: 1,
          feedback: "Abfälle dürfen nur an dafür zugelassenen Stellen entsorgt werden; das unerlaubte Ablagern ist eine Ordnungswidrigkeit. Bei gefährlichen Abfällen oder großen Mengen kann es eine Straftat sein (§ 326 StGB).",
        },
      ],
      conclusion: "Entscheidend ist, was das Gesetz für die Handlung androht: Strafe, Geldbuße oder nichts.",
    },
    casework: {
      title: "Gegen die Einbahnstraße",
      story:
        "Lena (16) fährt mit dem Fahrrad **in der falschen Richtung durch eine Einbahnstraße**. Ein Zusatzschild erlaubt das dort nicht, aber niemand wird behindert oder gefährdet. Eine Polizistin hält sie an und bietet ihr eine **Verwarnung** mit Verwarnungsgeld an. Lena lehnt ab. Wochen später kommt ein **Bußgeldbescheid**, den sie für unberechtigt hält.",
      steps: [
        {
          question: "Welche Art von Verstoß liegt vor?",
          options: [
            "Eine Ordnungswidrigkeit: Das Gesetz droht dafür eine Geldbuße an, keine Strafe.",
            "Eine Straftat, weil falsches Fahren Menschen gefährden kann.",
            "Weder noch, weil Fahrräder nicht unter die Verkehrsregeln fallen.",
          ],
          answer: 0,
          explanation: "Das Fahren gegen die Richtung einer Einbahnstraße ist ohne Behinderung oder Gefährdung eine Ordnungswidrigkeit mit Geldbuße (für Radfahrende nennt der Bußgeldkatalog 20 Euro). Auch Radfahrende müssen die Verkehrsregeln beachten.",
        },
        {
          question: "Hätte Lena der Verwarnung zustimmen müssen?",
          options: [
            "Nein: Eine Verwarnung mit Verwarnungsgeld ist nur wirksam, wenn man einverstanden ist.",
            "Ja, sonst begeht sie eine zusätzliche Straftat und muss mit einer Anzeige rechnen.",
            "Ja, denn Jugendliche haben bei Entscheidungen von Behörden kein Mitspracherecht.",
          ],
          answer: 0,
          explanation: "Nach § 56 OWiG wird man über das Weigerungsrecht belehrt, und ein Verwarnungsgeld gibt es nur bis 55 Euro. Lehnt man ab, folgt gegebenenfalls ein Bußgeldverfahren; eine Straftat ist die Weigerung nicht.",
        },
        {
          question: "Was kann Lena gegen den Bußgeldbescheid tun?",
          options: [
            "Innerhalb von zwei Wochen nach Zustellung Einspruch einlegen.",
            "Innerhalb eines Jahres Klage beim Verwaltungsgericht erheben.",
            "Nichts, denn Bußgeldbescheide sind immer endgültig.",
          ],
          answer: 0,
          explanation: "Der Einspruch nach § 67 OWiG muss innerhalb von zwei Wochen nach Zustellung eingelegt werden. Danach kann das Amtsgericht entscheiden.",
        },
        {
          question: "Steht die Geldbuße später in Lenas Führungszeugnis?",
          options: [
            "Nein, denn das Führungszeugnis enthält Verurteilungen, keine Bußgelder.",
            "Ja, denn jede amtliche Geldzahlung wird im Führungszeugnis eingetragen.",
            "Ja, aber nur, weil Lena noch minderjährig ist und besonders erfasst wird.",
          ],
          answer: 0,
          explanation: "Bußgelder bei Ordnungswidrigkeiten werden nicht in das Bundeszentralregister und damit nicht in das Führungszeugnis eingetragen. Das Alter ändert daran nichts.",
        },
      ],
      verdict:
        "Das Fahren gegen die Einbahnstraße ist eine Ordnungswidrigkeit. Lena durfte die Verwarnung ablehnen und kann gegen den Bußgeldbescheid innerhalb von zwei Wochen Einspruch einlegen. Ein Bußgeld steht nicht im Führungszeugnis.",
    },
    tasks: {
      1: {
        prompt: "Erkläre den Unterschied zwischen einer Straftat und einer Ordnungswidrigkeit und nenne je ein Beispiel samt Folge.",
        hints: ["Was droht das Gesetz jeweils an, und wer verfolgt die Tat?", "Was bedeutet jede Folge für das Führungszeugnis?"],
        model:
          "Eine Straftat bedroht das Gesetz mit Strafe, also Geldstrafe oder Freiheitsstrafe, zum Beispiel beim Diebstahl; die Verurteilung wird im Bundeszentralregister eingetragen. Eine Ordnungswidrigkeit bedroht es mit einer Geldbuße, zum Beispiel beim Parken im Halteverbot. Sie verfolgt in der Regel eine Verwaltungsbehörde mit einem Bußgeldbescheid, und sie führt zu keiner Vorstrafe und keinem Eintrag im Führungszeugnis.",
        criteria: [
          "Nennt Strafe und Geldbuße als unterschiedliche Folgen",
          "Nennt je ein Beispiel für Straftat und Ordnungswidrigkeit",
          "Erklärt den Unterschied beim Führungszeugnis oder bei der verfolgenden Stelle",
        ],
      },
      2: {
        prompt:
          "Auf einer Party wird es nachts sehr laut. Ein Gast beschimpft einen Nachbarn, der sich beschwert, als „Idioten“. Beurteile, was davon eine Ordnungswidrigkeit und was eine Straftat sein kann.",
        hints: ["Welche Vorschrift passt zu dem Lärm, welche zur Beschimpfung?", "Werden beide Handlungen gemeinsam oder getrennt beurteilt?"],
        model:
          "Der Lärm kann eine Ordnungswidrigkeit nach § 117 OWiG sein, wenn er die Nachbarschaft erheblich belästigt; die Folge ist eine Geldbuße. Die Beschimpfung als „Idioten“ ist dagegen eine Beleidigung (§ 185 StGB) und damit eine Straftat, für die Geldstrafe oder Freiheitsstrafe bis zu einem Jahr droht. Beide Handlungen werden getrennt beurteilt, weil sie verschiedene Handlungen mit verschiedenen Folgen sind.",
        criteria: [
          "Ordnet den Lärm als Ordnungswidrigkeit ein und nennt die Folge",
          "Ordnet die Beschimpfung als Straftat (Beleidigung) ein und nennt die Folge",
          "Begründet, dass beide Handlungen getrennt beurteilt werden",
        ],
      },
    },
  },
  {
    id: "st-zivilfolgen",
    lb: 4,
    unit: "4.3",
    title: "Zivilrechtliche Folgen einer strafbaren Handlung",
    intro: "Neben der Strafe kann Schadenersatz drohen: Wer haftet, ab welchem Alter, und wann haften die Eltern?",
    paragraphs: [
      "Wird Noras Fahrrad zerkratzt, bestraft der Staat die Tat, aber Nora bekommt davon keinen Euro. Ihren Schaden muss sie selbst geltend machen. Wer einem anderen vorsätzlich oder fahrlässig Eigentum, Körper oder Gesundheit widerrechtlich verletzt, muss den Schaden ersetzen (§ 823 BGB). **Schadenersatz** bedeutet, den Zustand herzustellen, der ohne die Tat bestünde, oder den nötigen Geldbetrag zu zahlen (§ 249 BGB). Bei einer Verletzung von Körper oder Gesundheit gibt es zusätzlich **Schmerzensgeld** für den nichtmateriellen Schaden (§ 253 Abs. 2 BGB).",
      "Strafrechtliche und zivilrechtliche Folgen sind **getrennt** und können **nebeneinander** eintreten. Die Strafe verfolgt der Staat, den Ersatz verlangt die geschädigte Person. Bleibt das Strafverfahren ohne Strafe, etwa weil die Tat nur fahrlässig war, kann trotzdem Ersatz geschuldet sein. Umgekehrt ersetzt Schadenersatz die Strafe nicht. Wer fahrlässig die Scheibe eines Nachbarn einwirft, begeht keine strafbare Sachbeschädigung, haftet aber zivilrechtlich für den Schaden.",
      "Wer haftet, hängt vom Alter ab. Unter 7 Jahren ist man für Schäden nicht verantwortlich (§ 828 BGB). Bei Unfällen mit einem Kraftfahrzeug oder einer Bahn gilt das bis unter 10 Jahren, außer das Kind hat vorsätzlich geschädigt. Sonst haftet man bis zur Volljährigkeit nur, wenn man die nötige Einsicht hatte. Ab 18 Jahren ist man voll **deliktfähig**. Das ist etwas anderes als die Strafbarkeit: Strafrechtlich schuldfähig ist man erst ab 14 (§ 19 StGB), zivilrechtlich kann man schon ab 7 haften.",
      "Auch Eltern können zahlen müssen, aber nicht automatisch. „Eltern haften für ihre Kinder“ stimmt so nicht. Nach § 832 BGB müssen Aufsichtspflichtige den Schaden ersetzen, den ein Minderjähriger einem Dritten zufügt, außer sie können nachweisen, dass sie ihrer **Aufsichtspflicht** genügt haben. Wie viel Aufsicht nötig ist, hängt von Alter und Reife des Kindes und von der Gefahr ab: Kleine Kinder brauchen engere Aufsicht als fast Volljährige. Wer sein Kind ausreichend belehrt und kontrolliert hat, haftet für einen Streich nicht.",
    ],
    terms: [
      { term: "Schadenersatz", text: "Der Ausgleich eines Schadens durch Herstellen des früheren Zustands oder durch Zahlung des nötigen Geldbetrags." },
      { term: "Schmerzensgeld", text: "Ein Geldbetrag als Ausgleich für Schmerzen und andere nichtmaterielle Schäden bei einer Verletzung von Körper oder Gesundheit." },
      { term: "Deliktfähigkeit", text: "Die Fähigkeit, für einen Schaden aus einer unerlaubten Handlung selbst einstehen zu müssen; sie hängt vom Alter und von der Einsicht ab." },
      { term: "Aufsichtspflicht", text: "Die Pflicht, Minderjährige so zu beaufsichtigen, dass sie niemanden schädigen, soweit es nach Alter und Reife nötig ist." },
    ],
    law: [
      {
        ref: "§§ 823, 249 und 253 BGB",
        text: "Wer einen anderen widerrechtlich an Eigentum, Körper oder Gesundheit verletzt, muss den Schaden ersetzen, durch Herstellen des früheren Zustands oder in Geld. Bei Verletzung von Körper oder Gesundheit gibt es auch Schmerzensgeld.",
        url: "https://www.gesetze-im-internet.de/bgb/__823.html",
      },
      {
        ref: "§§ 828 und 832 BGB",
        text: "Kinder unter sieben Jahren sind für Schäden nicht verantwortlich, bei Unfällen mit Kraftfahrzeug oder Bahn Kinder unter zehn Jahren (außer bei Vorsatz); ältere Minderjährige nur, wenn sie die nötige Einsicht hatten. Aufsichtspflichtige wie Eltern müssen den Schaden ersetzen, außer sie weisen nach, dass sie ihre Aufsichtspflicht erfüllt haben.",
        url: "https://www.gesetze-im-internet.de/bgb/__828.html",
      },
    ],
    takeaway:
      "Eine strafbare Handlung kann zwei getrennte Folgen haben: Strafe durch den Staat und Schadenersatz, bei Verletzungen auch Schmerzensgeld, an die geschädigte Person. Minderjährige haften ab 7 Jahren bei nötiger Einsicht, Eltern nicht, wenn sie ihre Aufsichtspflicht nachweislich erfüllt haben.",
    sourceIds: ["lp", "bgb", "stgb"],
    quiz: {
      question: "Was gilt, wenn ein 13-Jähriger absichtlich eine fremde Scheibe einwirft und weiß, dass das verboten ist?",
      answer: "Strafrechtlich bleibt er ohne Folge, doch zivilrechtlich kann er zum Schadenersatz verpflichtet sein.",
      wrong: [
        "Weil er nicht bestraft wird, kann die Geschädigte auch keinen Schadenersatz von ihm verlangen.",
        "Er wird bestraft, und seine Eltern müssen den Schaden in jedem Fall allein bezahlen.",
      ],
      explanation:
        "Unter 14 Jahren ist man schuldunfähig, aber zivilrechtlich haftet man ab 7 Jahren, wenn man die nötige Einsicht hat. Die Eltern zahlen nicht, wenn sie nachweisen, dass sie ihre Aufsichtspflicht erfüllt haben.",
    },
    workshop: {
      kind: "classify",
      title: "Strafe, Schadenersatz oder beides?",
      instruction: "Ordne jeden Fall zu: Welche Folgen kommen in Betracht?",
      categories: ["Nur strafrechtliche Folgen", "Nur zivilrechtliche Folgen", "Beide Folgen"],
      entries: [
        {
          text: "Beim Rückwärtsfahren übersieht eine Autofahrerin aus Unachtsamkeit den Zaun ihres Nachbarn und beschädigt ihn.",
          target: 1,
          feedback: "Fahrlässige Sachbeschädigung ist nicht strafbar, aber die Autofahrerin muss den Schaden nach § 823 BGB ersetzen.",
        },
        {
          text: "Ein Erwachsener zerkratzt aus Wut absichtlich den Lack am Auto seines Nachbarn.",
          target: 2,
          feedback: "Die absichtliche Sachbeschädigung ist strafbar, und zusätzlich schuldet er Schadenersatz für den Lack.",
        },
        {
          text: "Ein Mann versucht, ein fremdes Fahrrad zu stehlen, scheitert aber am stabilen Schloss. Weder das Fahrrad noch das Schloss wird beschädigt.",
          target: 0,
          feedback: "Der Versuch eines Diebstahls ist strafbar (§ 242 Abs. 2 StGB). Da kein Schaden entstanden ist, gibt es keinen Ersatz.",
        },
        {
          text: "Ein 13-Jähriger wirft absichtlich einen Ball gegen ein Schaufenster, sodass die Scheibe bricht. Er weiß, dass das verboten ist.",
          target: 1,
          feedback: "Mit 13 Jahren ist er schuldunfähig und wird nicht bestraft, aber er kann bei vorhandener Einsicht zum Ersatz verpflichtet sein.",
        },
        {
          text: "Eine 16-Jährige stößt ihre Mitschülerin absichtlich so, dass diese stürzt und sich das Handgelenk bricht. Sie ist reif genug, das Unrecht zu erkennen.",
          target: 2,
          feedback: "Die Körperverletzung ist strafbar, und zusätzlich kommen Schadenersatz und Schmerzensgeld in Betracht (§ 253 Abs. 2 BGB).",
        },
      ],
      conclusion: "Strafe und Schadenersatz laufen auf getrennten Wegen. Eine Folge schließt die andere nicht aus und ersetzt sie auch nicht.",
    },
    casework: {
      title: "Der Ball und das parkende Auto",
      story:
        "Hannes (16) kickt auf der Straße vor dem Haus einen Ball und trifft aus **Unachtsamkeit** die Heckscheibe eines parkenden Autos. Sie zerspringt, der Schaden beträgt **400 Euro**. Seine Eltern hatten ihm das Ballspielen an parkenden Autos **erklärt und verboten**; bisher hatte er sich immer daran gehalten.",
      steps: [
        {
          question: "Muss Hannes mit einer Strafe wegen Sachbeschädigung rechnen?",
          options: [
            "Nein: Er handelte nur fahrlässig, und fahrlässige Sachbeschädigung ist nicht strafbar.",
            "Ja, denn jede Beschädigung einer fremden Sache ist strafbar, auch wenn sie nicht gewollt war.",
            "Nein, weil Hannes mit 16 Jahren noch schuldunfähig ist und deshalb nicht bestraft wird.",
          ],
          answer: 0,
          explanation: "Das Strafgesetzbuch bedroht nur die vorsätzliche Sachbeschädigung mit Strafe. Schuldunfähig ist man nur unter 14 Jahren.",
        },
        {
          question: "Kann die Eigentümerin des Autos von Hannes Ersatz verlangen?",
          options: [
            "Ja, wenn Hannes die nötige Einsicht hatte; bei einem 16-Jährigen ist das in der Regel der Fall.",
            "Nein, denn wer nicht bestraft wird, schuldet der Geschädigten auch keinen Schadenersatz.",
            "Nein, denn Minderjährige haften nie selbst für Schäden, nur ihre Eltern tun das.",
          ],
          answer: 0,
          explanation: "Zivilrechtlich haftet man auch für fahrlässig verursachte Schäden (§ 823 BGB). Ein Minderjähriger haftet, wenn er die nötige Einsicht hat (§ 828 BGB).",
        },
        {
          question: "Müssen auch die Eltern zahlen?",
          options: [
            "Nein: Sie haben das Spiel verboten, und er hat sich daran gehalten; sie haben ihre Aufsichtspflicht erfüllt.",
            "Ja, denn Eltern haften immer und in jedem Fall für das, was ihre Kinder anrichten.",
            "Ja, denn Hannes ist noch nicht volljährig, und Eltern müssen für Minderjährige zahlen.",
          ],
          answer: 0,
          explanation: "Nach § 832 BGB sind Eltern ersatzpflichtig, außer sie können nachweisen, dass sie ihre Aufsichtspflicht erfüllt haben. Bei einem fast erwachsenen Jugendlichen genügen Belehrung und Verbot; lückenlos überwachen müssen sie ihn nicht.",
        },
        {
          question: "Was ändert sich, wenn Hannes den Ball absichtlich gegen das Auto getreten hätte?",
          options: [
            "Strafrechtlich käme eine Sachbeschädigung in Betracht, und der Ersatz bliebe geschuldet.",
            "Nichts, denn die Folgen hängen allein von der Höhe des Schadens ab, nicht vom Verhalten.",
            "Dann haften nur noch die Eltern, und Hannes selbst schuldet nichts mehr.",
          ],
          answer: 0,
          explanation: "Mit Vorsatz erfüllt Hannes den Tatbestand der Sachbeschädigung. Die zivilrechtliche Haftung besteht ohnehin und tritt neben die mögliche Strafe.",
        },
      ],
      verdict:
        "Hannes wird nicht bestraft, weil fahrlässige Sachbeschädigung straflos ist, muss den Schaden aber ersetzen. Seine Eltern haften voraussichtlich nicht, weil sie ihre Aufsichtspflicht erfüllt haben. Hätte er absichtlich gehandelt, käme zusätzlich eine Strafe in Betracht.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum nach einer Sachbeschädigung durch eine Jugendliche eine Strafe und Schadenersatz getrennt nebeneinander stehen können und wer jeweils etwas verlangt.",
        hints: ["Wer verfolgt die Straftat, und wer macht den Ersatz geltend?", "Was kann ein Kind schulden, das nicht bestraft wird?"],
        model:
          "Die Strafe verhängt der Staat, weil eine Straftat die Rechtsordnung verletzt; Staatsanwaltschaft und Gericht entscheiden darüber. Den Schadenersatz verlangt dagegen die geschädigte Person selbst nach dem Zivilrecht, um ihren Schaden ausgeglichen zu bekommen. Beide Wege sind unabhängig voneinander. Ein zwölfjähriges Kind wird nicht bestraft, kann aber trotzdem zahlen müssen, wenn es die nötige Einsicht hatte.",
        criteria: [
          "Nennt, wer die Strafe und wer den Schadenersatz verlangt",
          "Erklärt, dass beide Folgen getrennt voneinander eintreten",
          "Belegt dies mit einem Beispiel wie dem nicht bestraften, aber haftenden Kind",
        ],
      },
      2: {
        prompt:
          "Eine Mitschülerin behauptet: Unter 14 passiert einem nichts, und für alles, was Kinder anrichten, zahlen die Eltern. Beurteile beide Behauptungen.",
        hints: ["Was gilt für Zwölfjährige strafrechtlich und was zivilrechtlich?", "Wann entfällt die Haftung der Eltern nach § 832 BGB?"],
        model:
          "Beide Behauptungen stimmen nur zum Teil. Strafrechtlich bleibt ein Kind unter 14 Jahren straflos (§ 19 StGB). Zivilrechtlich kann es aber ab 7 Jahren haften, wenn es die nötige Einsicht hatte (§ 828 BGB). Die Eltern zahlen nicht automatisch: Sie haften nicht, wenn sie nachweisen, dass sie ihrer Aufsichtspflicht genügt haben (§ 832 BGB). Dann bleibt der Schaden bei einem Kind ab 7 Jahren mit Einsicht beim Kind; bei einem jüngeren Kind bleibt er meist bei der geschädigten Person.",
        criteria: [
          "Beurteilt die Aussage zur Straflosigkeit unter 14 richtig und grenzt sie vom Zivilrecht ab",
          "Beurteilt die Aussage zur Haftung der Eltern mit Hilfe der Aufsichtspflicht",
          "Nennt die Altersgrenzen 7 und 14 richtig",
        ],
      },
    },
  },
  {
    id: "st-jugend",
    lb: 4,
    unit: "4.3",
    title: "Besonderheiten des Jugendstrafrechts",
    intro: "Wer wann als Kind, Jugendlicher oder Heranwachsender gilt und warum bei jungen Menschen Erziehung vor Strafe steht.",
    paragraphs: [
      "Das Alter zur Tatzeit entscheidet über das Recht. **Kinder** unter 14 Jahren sind schuldunfähig (§ 19 StGB) und werden nicht bestraft; Jugendamt und Familiengericht können helfen. **Jugendliche** sind 14 bis 17 Jahre alt, **Heranwachsende** 18 bis 20 (§ 1 JGG). Jugendliche sind nur verantwortlich, wenn sie nach ihrer sittlichen und geistigen Entwicklung reif genug sind, das Unrecht einzusehen und danach zu handeln (§ 3 JGG). Auf Heranwachsende wendet das Gericht Jugendstrafrecht an, wenn sie in ihrer Entwicklung noch einem Jugendlichen gleichstehen oder die Tat eine **Jugendverfehlung** war (§ 105 JGG). Ab 21 gilt immer das allgemeine Strafrecht.",
      "Im Jugendstrafrecht steht der **Erziehungsgedanke** im Vordergrund: Die Rechtsfolgen sollen vor allem neue Straftaten verhindern (§ 2 JGG). Dafür gibt es drei Arten von Folgen. **Erziehungsmaßregeln** sind Weisungen, etwa ein sozialer Trainingskurs oder ein Täter-Opfer-Ausgleich. **Zuchtmittel** sind Verwarnung, Auflagen wie Schadenwiedergutmachung, Entschuldigung oder Arbeitsleistungen und Jugendarrest; sie haben nicht die Rechtswirkungen einer Strafe (§ 13 JGG). Die **Jugendstrafe**, also Freiheitsentzug, kommt nur in Betracht, wenn die anderen Mittel nicht ausreichen oder wegen der Schwere der Schuld Strafe nötig ist (§§ 5 und 17 JGG).",
      "Typische Straftaten Jugendlicher sind Ladendiebstahl (§ 242 StGB), Graffiti als Sachbeschädigung (§ 303 Abs. 2 StGB), Beleidigung und Bedrohung im Netz sowie Schwarzfahren (§ 265a StGB). Cybermobbing ist im Strafgesetzbuch kein eigener Tatbestand; je nach Fall kommen Beleidigung, üble Nachrede, Verleumdung, Bedrohung oder Nachstellung in Betracht. Bei leichten Taten und einer bereits eingeleiteten erzieherischen Maßnahme, etwa einem Ausgleich mit dem Opfer, sieht die Staatsanwaltschaft häufig von der Verfolgung ab (§ 45 JGG). Verhandlungen gegen Jugendliche sind nicht öffentlich (§ 48 JGG), gegen Heranwachsende in der Regel schon.",
      "Warum behandelt das Recht junge Menschen anders? Jugendliche sind noch in der Entwicklung, ihre Reife wächst, und Erziehung kann Rückfälle verhindern. Darum prüft das Gericht Alter und Reife, und die Jugendgerichtshilfe berichtet über Persönlichkeit und Umfeld (§ 38 JGG). Manche halten das Jugendstrafrecht für zu milde, andere verweisen auf die Wirkung der Erziehung. Im Modell stellst du Alter und Entwicklungsstand ein und beobachtest, ob ein Kind, ein Jugendlicher oder ein Heranwachsender betroffen ist und welches Recht gilt.",
    ],
    terms: [
      { term: "Erziehungsgedanke", text: "Das Jugendstrafrecht soll vor allem neue Straftaten verhindern; Folgen und Verfahren richten sich vorrangig an der Erziehung aus." },
      { term: "Erziehungsmaßregel", text: "Eine Weisung oder Hilfe zur Erziehung, die die Lebensführung des Jugendlichen regeln soll, zum Beispiel ein sozialer Trainingskurs." },
      { term: "Zuchtmittel", text: "Verwarnung (eine eindringliche Ermahnung durch das Gericht, kein Verwarnungsgeld), Auflagen oder Jugendarrest; sie bringen dem Jugendlichen sein Unrecht zu Bewusstsein, sind aber keine Strafe im engeren Sinn." },
      { term: "Jugendstrafe", text: "Freiheitsentzug von mindestens sechs Monaten und in der Regel höchstens fünf Jahren, nur wenn Erziehungsmaßregeln und Zuchtmittel nicht ausreichen oder die Schuld schwer wiegt (§§ 17 und 18 JGG)." },
      { term: "Heranwachsende", text: "Wer zur Tatzeit 18, aber noch nicht 21 Jahre alt ist; auf sie wird Jugendstrafrecht angewendet, wenn sie in der Entwicklung noch einem Jugendlichen gleichstehen oder die Tat jugendtypisch ist." },
    ],
    law: [
      {
        ref: "§ 3 JGG",
        text: "Ein Jugendlicher ist strafrechtlich verantwortlich, wenn er nach seiner sittlichen und geistigen Entwicklung reif genug ist, das Unrecht der Tat einzusehen und danach zu handeln.",
        url: "https://www.gesetze-im-internet.de/jgg/__3.html",
      },
      {
        ref: "§ 105 JGG",
        text: "Auf Heranwachsende wird Jugendstrafrecht angewendet, wenn sie nach ihrer Entwicklung noch einem Jugendlichen gleichstanden oder die Tat eine Jugendverfehlung war.",
        url: "https://www.gesetze-im-internet.de/jgg/__105.html",
      },
    ],
    takeaway:
      "Kinder unter 14 sind schuldunfähig, Jugendliche von 14 bis 17 nur bei ausreichender Reife verantwortlich, und bei Heranwachsenden entscheiden Entwicklung und Art der Tat. Im Jugendstrafrecht steht die Erziehung vor der Strafe: Erziehungsmaßregeln und Zuchtmittel gehen vor, Jugendstrafe kommt nur bei fehlender Wirkung oder schwerer Schuld.",
    sourceIds: ["lp", "jgg", "stgb"],
    quiz: {
      question: "Wie ist die strafrechtliche Verantwortung einer 16-Jährigen geregelt?",
      answer: "Sie ist verantwortlich, wenn sie nach ihrer Entwicklung reif genug ist, das Unrecht zu erkennen und danach zu handeln.",
      wrong: [
        "Sie ist wie eine Erwachsene voll verantwortlich, denn mit 14 Jahren beginnt die volle Strafbarkeit ohne Rücksicht auf die Reife.",
        "Sie ist nicht verantwortlich, denn bestraft werden können grundsätzlich nur Volljährige, also ab 18 Jahren.",
      ],
      explanation:
        "Ab 14 Jahren können Jugendliche verantwortlich sein, aber nur bei ausreichender Reife (§ 3 JGG), und es gilt das Jugendstrafrecht. Volljährigkeit ist keine Voraussetzung.",
    },
    lab: "jugendstrafrecht",
    labGoals: ["kind", "jugendlicher", "nicht-reif", "heranwachsend-jgg", "heranwachsend-stgb"],
    workshop: {
      kind: "classify",
      title: "Welche Folge im Jugendstrafrecht?",
      instruction: "Ordne jede Maßnahme der Stufe zu: Erziehungsmaßregel, Zuchtmittel oder Jugendstrafe.",
      categories: ["Erziehungsmaßregel", "Zuchtmittel", "Jugendstrafe"],
      entries: [
        {
          text: "Ein 15-Jähriger wird verpflichtet, an einem sozialen Trainingskurs teilzunehmen, um besser mit Konflikten umzugehen.",
          target: 0,
          feedback: "Weisungen wie die Teilnahme an einem sozialen Trainingskurs sind Erziehungsmaßregeln (§ 10 JGG).",
        },
        {
          text: "Eine 16-Jährige muss ihrer Mitschülerin den kaputten Kopfhörer ersetzen und sich bei ihr entschuldigen.",
          target: 1,
          feedback: "Schadenwiedergutmachung und Entschuldigung sind Auflagen und damit Zuchtmittel (§ 15 JGG). Die Weisung zum Täter-Opfer-Ausgleich ist dagegen eine Erziehungsmaßregel (§ 10 JGG).",
        },
        {
          text: "Ein Jugendlicher, der eine Straftat im Straßenverkehr begangen hat, soll an einem Verkehrsunterricht teilnehmen.",
          target: 0,
          feedback: "Die Teilnahme an einem Verkehrsunterricht ist eine Weisung, also eine Erziehungsmaßregel (§ 10 JGG).",
        },
        {
          text: "Das Gericht hält einem 15-Jährigen nach einem Ladendiebstahl eindringlich vor, dass sein Verhalten Unrecht war.",
          target: 1,
          feedback: "Die förmliche Verwarnung ist ein Zuchtmittel (§ 14 JGG).",
        },
        {
          text: "Ein 17-Jähriger wird nach mehreren früheren Maßnahmen für eine Woche in den Jugendarrest geschickt.",
          target: 1,
          feedback: "Jugendarrest ist ein Zuchtmittel und keine Jugendstrafe (§ 13 JGG); der Dauerarrest dauert mindestens eine Woche (§ 16 JGG).",
        },
        {
          text: "Ein 17-Jähriger begeht trotz früherer Maßnahmen erneut mehrere schwere Straftaten; Erziehungsmaßregeln und Zuchtmittel reichen nicht aus, er erhält zwei Jahre Jugendstrafe.",
          target: 2,
          feedback: "Jugendstrafe, also Freiheitsentzug, kommt nur in Betracht, wenn die anderen Mittel nicht reichen oder die Schuld schwer wiegt (§ 17 JGG).",
        },
      ],
      conclusion: "Die Folgen richten sich nach dem Erziehungsbedarf: Erziehungsmaßregeln und Zuchtmittel gehen vor, die Jugendstrafe kommt bei fehlender Wirkung oder schwerer Schuld.",
    },
    casework: {
      title: "Graffiti an der Schulmauer",
      story:
        "Nachts sprühen **Deniz (17)** und **Marko (13)** ein großes Graffiti an die Außenwand einer Schule. Eine Streife stellt beide. Deniz ist für sein Alter **gut entwickelt** und hat noch nie Ärger gehabt.",
      steps: [
        {
          question: "Wird Marko bestraft?",
          options: [
            "Nein: Mit 13 Jahren ist er schuldunfähig; höchstens helfen Jugendamt oder Familiengericht.",
            "Ja, aber nur nach Jugendstrafrecht, denn auch Kinder können Jugendstrafe erhalten.",
            "Ja, wie ein Erwachsener, weil das Graffiti absichtlich gesprüht wurde.",
          ],
          answer: 0,
          explanation: "Kinder unter 14 Jahren sind nach § 19 StGB schuldunfähig. Das gilt auch bei absichtlichen Taten.",
        },
        {
          question: "Welches Recht gilt für Deniz?",
          options: [
            "Jugendstrafrecht: Er ist Jugendlicher und verantwortlich, wenn er reif genug war.",
            "Erwachsenenstrafrecht, weil er mit 17 Jahren schon fast volljährig und reif ist.",
            "Keines, weil Jugendliche in Deutschland grundsätzlich nie bestraft werden.",
          ],
          answer: 0,
          explanation: "Wer 14 bis 17 Jahre alt ist, gilt als Jugendlicher. Nach § 3 JGG ist er verantwortlich, wenn er die nötige Reife hat, und es gilt das Jugendgerichtsgesetz.",
        },
        {
          question: "Welche Folge passt zum Erziehungsgedanken bei Deniz als Ersttäter am ehesten?",
          options: [
            "Eine Auflage, etwa den Schaden wiedergutzumachen oder an der Reinigung mitzuarbeiten.",
            "Eine Jugendstrafe von mindestens sechs Monaten, damit er abgeschreckt wird.",
            "Eine Geldstrafe in Tagessätzen wie bei Erwachsenen, damit er den Schaden spürt.",
          ],
          answer: 0,
          explanation: "Jugendstrafe kommt bei einer ersten, leichten Tat wie diesem Graffiti nicht in Betracht. Auflagen wie die Schadenwiedergutmachung sind typische Zuchtmittel.",
        },
        {
          question: "Was wäre, wenn Deniz 19 wäre und in seiner Entwicklung noch einem Jugendlichen gleichstünde?",
          options: [
            "Dann wird auch auf ihn Jugendstrafrecht angewendet.",
            "Dann gilt zwingend Erwachsenenstrafrecht, weil er volljährig ist.",
            "Dann wird er nicht mehr bestraft, weil er schuldunfähig ist.",
          ],
          answer: 0,
          explanation: "Bei Heranwachsenden von 18 bis 20 Jahren wendet das Gericht Jugendstrafrecht an, wenn sie in der Entwicklung noch einem Jugendlichen gleichstehen oder es eine Jugendverfehlung war (§ 105 JGG).",
        },
      ],
      verdict:
        "Marko bleibt als Kind straflos. Auf Deniz ist als Jugendlichem Jugendstrafrecht anzuwenden; als Ersttäter erhält er voraussichtlich eine erzieherische Folge wie eine Auflage. Auch bei einem Heranwachsenden mit Reifeverzögerung wäre Jugendstrafrecht anzuwenden.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, welche Rolle Alter und Reife für die Verantwortlichkeit eines 13-Jährigen, einer 16-Jährigen und eines 19-Jährigen spielen.",
        hints: ["Wo liegt die Altersgrenze der Schuldfähigkeit, und wann ist ein Jugendlicher verantwortlich?", "Wann wendet das Gericht bei Heranwachsenden Jugendstrafrecht an?"],
        model:
          "Ein 13-Jähriger ist ein Kind und nach § 19 StGB schuldunfähig, er wird nicht bestraft. Eine 16-Jährige ist Jugendliche und nur verantwortlich, wenn sie nach ihrer Entwicklung reif genug ist, das Unrecht einzusehen und danach zu handeln (§ 3 JGG). Bei einem 19-Jährigen entscheidet das Gericht nach der Persönlichkeit: Steht er in seiner Entwicklung noch einem Jugendlichen gleich oder war die Tat eine Jugendverfehlung, wird Jugendstrafrecht angewendet (§ 105 JGG), sonst das allgemeine Strafrecht.",
        criteria: [
          "Erklärt, dass Kinder unter 14 Jahren schuldunfähig sind",
          "Erklärt, dass Jugendliche nur bei ausreichender Reife verantwortlich sind",
          "Erklärt, wann bei Heranwachsenden Jugendstrafrecht gilt",
        ],
      },
      2: {
        prompt:
          "Eine Zeitung schreibt, das Jugendstrafrecht sei zu milde, wer eine Straftat begehe, solle bestraft werden wie ein Erwachsener. Beurteile die Aussage, indem du je ein Argument dafür und dagegen nennst, und ziehe ein eigenes Fazit.",
        hints: ["Welches Ziel verfolgt das Jugendstrafrecht nach § 2 JGG?", "Was spricht aus Sicht von Opfern für härtere Folgen, was für Erziehung?"],
        model:
          "Dafür spricht, dass Opfer eine deutliche Reaktion erwarten und eine Verwarnung manchmal zu folgenlos erscheint. Dagegen spricht, dass Jugendliche noch in der Entwicklung sind und Erziehung nach Ansicht der Befürworter die Gefahr neuer Straftaten oft besser senkt als Haft. Das Jugendstrafrecht ist zudem nicht folgenlos, denn es kennt Arrest und, wenn Erziehung nicht reicht oder die Schuld schwer wiegt, die Jugendstrafe. Mein Fazit: Bei leichten Taten halte ich Erziehung für sinnvoll, bei schweren oder wiederholten Taten kann auch Jugendstrafe nötig sein.",
        criteria: [
          "Nennt ein Argument für härtere Folgen",
          "Nennt ein Argument für den Vorrang der Erziehung",
          "Zieht ein eigenes, begründetes Fazit",
        ],
      },
    },
  },
];
