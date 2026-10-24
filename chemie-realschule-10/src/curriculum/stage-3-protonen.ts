import { ACIDS, indicatorColor } from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { acidReaction, CARBONATE_ACIDS, CARBONATE_REACTANTS, makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "protonen";
export const STAGE_PROTONEN: Stage = {
  id,
  stageNumber: 3,
  title: "Säuren, Basen und Neutralisation",
  subtitle: "Protonenübergänge im Labor und im Haushalt",
  icon: "🧪",
  accent: "#e11d48",
  badgeTitle: "Protonenprofi",
  lehrplanLabel: "C10 LB 2 (I) · C10 LB 3 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-saure-alkalische-loesungen",
      title: "Saure und alkalische Lösungen",
      subtitle: "Alltag, Indikatoren und pH-Skala",
      bindings: { II_III: 3 },
      why: "Ob Essig, Seife oder Rohrreiniger: Indikator und pH-Wert sagen, womit du es zu tun hast.",
      html: "<p>Saure Lösungen wie Essig oder Zitronensaft schmecken sauer, leiten den Strom und greifen unedle Metalle und Kalk an. Alkalische Lösungen wie Seifenlauge, Ammoniaklösung oder Rohrreiniger fühlen sich seifig an, weil sie Hautfette angreifen. Konzentrierte saure und alkalische Lösungen sind ätzend: Schutzbrille und Handschuhe sind Pflicht, und man kostet im Labor nie.</p><p><strong>Indikatoren</strong> sind Farbstoffe, die ihre Farbe abhängig von der Lösung ändern. Der <strong>pH-Wert</strong> ordnet wässrige Lösungen auf einer Skala von etwa 0 bis 14 ein: Bei etwa 25 °C ist pH < 7 sauer, pH = 7 neutral, pH > 7 alkalisch. Je weiter der Wert von 7 entfernt ist, desto stärker sauer oder alkalisch ist die Lösung. Bromthymolblau ist sauer gelb, neutral grün, alkalisch blau; Phenolphthalein ist sauer und neutral farblos, alkalisch pink.</p><div class=\"example\"><strong>Beispiel:</strong> Universalindikator färbt Speiseessig rot-orange (pH ≈ 3) und Seifenlösung blau (pH ≈ 9–10).</div>",
      rule: "Bei etwa 25 °C: pH < 7 sauer · pH = 7 neutral · pH > 7 alkalisch",
      terms: [
        ["Bromthymolblau", "gelb (sauer) · grün (neutral) · blau (alkalisch)", ""],
        ["Phenolphthalein", "farblos (sauer, neutral) · pink (alkalisch)", ""],
      ],
      quiz: [
        "Eine Lösung färbt Bromthymolblau blau. Wie ist sie?",
        "Alkalisch",
        "Sauer",
        "Bromthymolblau ist in alkalischen Lösungen blau, in sauren gelb.",
      ],
      lab: makeLab("indikator"),
      exercises: [
        {
          id: "ph-indikator",
          make(rng, level) {
            const ph = rng.pick([1, 2, 3, 4, 5, 9, 10, 11, 12, 13]);
            const kind = ph < 7 ? "sauer" : "alkalisch";
            if (level === 1)
              return {
                prompt: `Eine Lösung hat bei 25 °C den pH-Wert ${ph}. Wie ist sie einzuordnen?`,
                given: ["Vergleiche mit 7."],
                formulaHint: "pH < 7 sauer · pH = 7 neutral · pH > 7 alkalisch",
                fields: [choiceField(rng, "Lösung", kind, ["neutral", kind === "sauer" ? "alkalisch" : "sauer"])],
                steps: ["Der Neutralwert bei 25 °C ist 7.", `${ph} ${ph < 7 ? "<" : ">"} 7`, `<strong>${kind}</strong>`],
              };
            const color = indicatorColor(1, ph);
            return {
              prompt: `Du gibst Bromthymolblau zu einer Lösung mit pH ${ph}. Welche Farbe erwartest du, und wie ist die Lösung?`,
              given: [],
              formulaHint: "Bromthymolblau: gelb · grün · blau",
              fields: [
                choiceField(rng, "Farbe", color, ["grün", color === "gelb" ? "blau" : "gelb"]),
                choiceField(rng, "Lösung", kind, ["neutral", kind === "sauer" ? "alkalisch" : "sauer"]),
              ],
              steps: [`pH ${ph} ist ${kind}.`, "Bromthymolblau ist sauer gelb, alkalisch blau.", `<strong>${color}, ${kind}</strong>`],
            };
          },
        },
        cases(
          "alltag",
          [
            cc("Welche Lösung des Alltags ist alkalisch?", "Rohrreiniger", ["Speiseessig", "Zitronensaft"], "Rohrreiniger enthält Natriumhydroxid; seine Lösung ist stark alkalisch.", "Welche Lösung fühlt sich seifig an?"),
            cc("Woran erkennt man saure Lösungen im Haushalt gefahrlos?", "Mit einem Indikator, z. B. Rotkohlsaft oder Indikatorpapier.", ["Durch Probieren.", "Am Geruch, denn alle sauren Lösungen riechen."], "Indikatoren zeigen die Eigenschaft ohne Gefährdung.", "Kosten ist im Labor verboten."),
          ],
          [
            cc("Warum ist Rohrreiniger gefährlicher als Seifenlösung, obwohl beide alkalisch sind?", "Er ist viel stärker alkalisch (pH ≈ 13–14) und ätzt Haut und Augen.", ["Weil Seifenlösung sauer ist.", "Weil alkalische Lösungen nie gefährlich sind."], "Je weiter der pH-Wert von 7 entfernt ist, desto stärker die Wirkung.", "Vergleiche die pH-Werte."),
            cc("Ein Entkalker trägt das Piktogramm Ätzwirkung. Was ist er vermutlich?", "Eine konzentrierte saure Lösung.", ["Eine neutrale Salzlösung.", "Reines Wasser mit Duftstoff."], "Kalk wird von sauren Lösungen angegriffen; konzentriert sind sie ätzend.", "Was löst Kalk?"),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-broensted",
      title: "Säure und Base nach Brönsted",
      subtitle: "Protonenübergänge bei HCl und NH₃",
      bindings: { II_III: 3 },
      why: "Aus Leitfähigkeit und Indikatorfarbe lässt sich ableiten, was zwischen den Teilchen passiert.",
      html: "<p>Leitet man Chlorwasserstoff in Wasser, leitet die Lösung den Strom und färbt Universalindikator rot. In Heptan gelöst zeigt Chlorwasserstoff beides nicht. Also müssen erst mit Wasser Ionen entstehen: Ein HCl-Molekül gibt ein Proton H⁺ an ein Wassermolekül ab. Es entstehen ein Oxoniumion H₃O⁺ und ein Chloridion Cl⁻. Ammoniak bildet mit Wasser eine alkalische Lösung: Ein NH₃-Molekül nimmt mit seinem freien Elektronenpaar ein Proton von einem Wassermolekül auf; es entstehen ein Ammoniumion NH₄⁺ und ein Hydroxidion OH⁻.</p><p>Nach <strong>Brönsted</strong> ist eine <strong>Säure</strong> ein Teilchen, das Protonen abgibt (Protonendonator); eine <strong>Base</strong> ist ein Teilchen, das Protonen aufnimmt (Protonenakzeptor). Säure und Base sind also Teilchen. Die Mischungen, die man im Glas hat, heißen <strong>saure</strong> oder <strong>alkalische Lösungen</strong>. Im Alltag sagt man ‚Salzsäure‘ für die saure Lösung; fachlich ist HCl die Säure und Salzsäure die saure Lösung. Wasser ist mal Akzeptor, mal Donator.</p><div class=\"example\"><strong>Beispiel:</strong> HCl + H₂O → H₃O⁺ + Cl⁻ (HCl Säure, H₂O Base); NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (H₂O Säure, NH₃ Base).</div>",
      rule: "Säure = Protonendonator · Base = Protonenakzeptor · saure/alkalische Lösung = Stoffgemisch",
      terms: [
        ["Oxoniumion", "H₃O⁺: verursacht saure Eigenschaften", ""],
        ["Hydroxidion", "OH⁻: verursacht alkalische Eigenschaften", ""],
      ],
      quiz: [
        "Welches Teilchen ist bei der Reaktion von Ammoniak mit Wasser die Brönsted-Säure?",
        "Das Wassermolekül.",
        "Das Ammoniakmolekül.",
        "Wasser gibt ein Proton an NH₃ ab; NH₃ ist der Protonenakzeptor.",
      ],
      lab: makeLab("proton"),
      exercises: [
        cases(
          "rollen",
          [
            cc("HCl + H₂O → H₃O⁺ + Cl⁻: Welches Teilchen ist die Base?", "H₂O", ["HCl", "Cl⁻"], "Wasser nimmt das Proton auf und wird zum Oxoniumion.", "Wer nimmt das Proton auf?"),
            cc("Welches Ion entsteht, wenn ein NH₃-Molekül ein Proton aufnimmt?", "Ammoniumion NH₄⁺", ["Ammoniakion NH₃⁻", "Hydroxidion OH⁻ aus dem NH₃"], "NH₃ + H⁺ → NH₄⁺.", "Ladung und Formel addieren."),
            cc("Welches Ion verursacht die saure Wirkung von Salzsäure?", "Das Oxoniumion H₃O⁺.", ["Das Chloridion Cl⁻.", "Das Hydroxidion OH⁻."], "H₃O⁺ entsteht durch Protonenübertragung auf Wasser.", "Welches Ion entsteht aus Wasser?"),
          ],
          [
            cc("Chlorwasserstoff in Heptan leitet nicht, in Wasser schon. Was folgt?", "Ionen entstehen erst durch Protonenübergang auf Wassermoleküle.", ["HCl besteht schon vor dem Lösen aus Ionen.", "Heptan zerstört Ionen."], "Ohne Protonenakzeptor kein Protonenübergang, keine Ionen.", "Wer nimmt in Heptan das Proton auf?"),
            cc("Warum kann Wasser als Säure und als Base reagieren?", "Es kann je nach Partner ein Proton abgeben oder aufnehmen.", ["Es enthält Säure- und Basenmoleküle.", "Es ist immer neutral und reagiert nie."], "Gegenüber NH₃ ist H₂O Donator, gegenüber HCl Akzeptor.", "Vergleiche beide Reaktionen."),
          ],
        ),
        cases(
          "fachsprache",
          [
            cc("Welche Aussage ist fachsprachlich exakt?", "Salzsäure ist eine saure Lösung; HCl-Moleküle sind Säuren.", ["Salzsäure ist ein einzelnes Säureteilchen.", "Säure und saure Lösung bedeuten dasselbe."], "Teilchenebene (Säure) und Stoffebene (saure Lösung) werden getrennt.", "Teilchen oder Stoffgemisch?"),
            cc("Ist „Natronlauge ist eine Base“ fachlich exakt?", "Nein: Natronlauge ist eine alkalische Lösung; die Base ist das OH⁻-Ion.", ["Ja, jede Lauge ist ein Basenteilchen.", "Nein, Natronlauge ist sauer."], "Base bezeichnet ein Teilchen, Lauge das Gemisch.", "Stoffebene oder Teilchenebene?"),
          ],
          [
            cc("Ein Werbetext sagt: „Unser Shampoo ist säurefrei.“ Wie beurteilst du das fachlich?", "Ungenau: Gemeint ist wohl ‚nicht sauer‘; über Säureteilchen sagt der pH-Wert allein nichts.", ["Exakt: das Shampoo hat pH 0.", "Exakt: Säuren kommen in Shampoo nie vor."], "Alltagssprache vermischt Teilchen- und Stoffebene.", "Was genau wird behauptet?"),
            cc("Die Lösung von Ammoniak leitet den Strom. Welche Erklärung ist richtig?", "Durch Protonenübergang entstehen NH₄⁺- und OH⁻-Ionen.", ["Ammoniakmoleküle leiten selbst.", "Wasser leitet immer gut."], "Leitfähigkeit setzt bewegliche Ionen voraus.", "Welche Ionen entstehen?"),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-protolyse-saeurereste",
      title: "Protolysen und Säurerestionen",
      subtitle: "Anorganische und organische Säuren",
      bindings: { II_III: 3 },
      why: "Säurerestionen geben den Salzen ihren Namen: Chlorid, Sulfat, Acetat.",
      html: "<p>Eine <strong>Protolyse</strong> ist eine Reaktion mit Protonenübergang. Bei anorganischen Säuren genügt die Summenformel: HNO₃ + H₂O → H₃O⁺ + NO₃⁻. Was nach der Protonenabgabe übrig bleibt, ist das <strong>Säurerestion</strong>. Mehrprotonige Säuren geben ihre Protonen schrittweise ab: Schwefelsäure H₂SO₄ bildet erst Hydrogensulfat HSO₄⁻, dann Sulfat SO₄²⁻; Phosphorsäure H₃PO₄ bildet Dihydrogenphosphat, Hydrogenphosphat und Phosphat.</p><p>Bei organischen Säuren zeigt die Strukturformel, woher das Proton kommt: aus der <strong>Carboxygruppe</strong> –COOH. Ethansäure (Essigsäure) CH₃–COOH gibt das H-Atom der OH-Gruppe ab; es entsteht das Ethanoation (Acetation) CH₃–COO⁻. Die H-Atome der CH₃-Gruppe werden nicht abgegeben. Jedes abgegebene Proton senkt die Ladung des Restes um eins.</p><div class=\"example\"><strong>Beispiel:</strong> H₂SO₄ + H₂O → H₃O⁺ + HSO₄⁻ und HSO₄⁻ + H₂O → H₃O⁺ + SO₄²⁻.</div>",
      rule: "Säure − H⁺ → Säurerestion (Ladung um 1 niedriger) · organische Säuren: Proton aus –COOH",
      terms: [
        ["Säurerestionen", "Cl⁻ Chlorid · NO₃⁻ Nitrat · SO₄²⁻ Sulfat · HCO₃⁻ Hydrogencarbonat · CO₃²⁻ Carbonat · PO₄³⁻ Phosphat · CH₃COO⁻ Acetat", ""],
      ],
      quiz: [
        "Welches H-Atom gibt ein Ethansäuremolekül bei der Protolyse ab?",
        "Das H-Atom der Carboxygruppe.",
        "Ein H-Atom der CH₃-Gruppe.",
        "Nur die O–H-Bindung der Carboxygruppe ist so polar, dass das Proton abgegeben wird.",
      ],
      lab: makeLab("saeurerest"),
      exercises: [
        {
          id: "saeurerest-name",
          make(rng, level) {
            const acid = rng.pick(ACIDS);
            const step = rng.int(1, acid.steps.length);
            const [formula, name] = acid.steps[step - 1];
            const charge = step;
            const others = ACIDS.flatMap((a) => a.steps.map((s) => s[1])).filter((n) => n !== name);
            if (level === 1)
              return {
                prompt: `${acid.name} ${acid.formula} gibt ${step} Proton${step > 1 ? "en" : ""} ab. Wie heißt das entstehende Säurerestion?`,
                given: [`entstehendes Ion: ${formula}`],
                formulaHint: "Je abgegebenem H⁺ sinkt die Ladung um eins.",
                fields: [choiceField(rng, "Name", name, rng.shuffle(others).slice(0, 2))],
                steps: [`${acid.formula} gibt ${step} H⁺ ab.`, `Es bleibt ${formula}.`, `<strong>${name}</strong>`],
              };
            return {
              prompt: `Welche Ladungszahl hat das Säurerestion, das entsteht, wenn ${acid.name} ${acid.formula} ${step} Proton${step > 1 ? "en" : ""} abgibt? Gib den Betrag an.`,
              given: [],
              formulaHint: "Neutrales Molekül − n · H⁺ → Ladung n−",
              fields: [numberField("Ladung (Betrag)", charge)],
              steps: [`Das Säuremolekül ist neutral.`, `${step} positive Protonen verlassen es: Ladung ${step}−.`, `<strong>${formula}: ${charge}</strong>`],
            };
          },
        },
        cases(
          "protolyse",
          [
            cc("Welche Gleichung beschreibt die Protolyse von Salpetersäure?", "HNO₃ + H₂O → H₃O⁺ + NO₃⁻", ["HNO₃ + H₂O → H₂NO₃⁺ + OH⁻", "HNO₃ → H + NO₃"], "HNO₃ gibt ein Proton an Wasser ab.", "Wer ist Donator?"),
            cc("Welches Teilchen entsteht bei der ersten Protolysestufe von Kohlensäure?", "Hydrogencarbonation HCO₃⁻", ["Carbonation CO₃²⁻", "Hydroxidion OH⁻"], "Mehrprotonige Säuren geben Protonen schrittweise ab.", "Erster Schritt: ein Proton."),
          ],
          [
            cc("Warum ist Ethansäure trotz vier H-Atomen eine einprotonige Säure?", "Nur das H-Atom der Carboxygruppe wird als Proton abgegeben.", ["Weil drei H-Atome beim Lösen verdampfen.", "Weil Ethansäure eine Base ist."], "C–H-Bindungen sind kaum polar; das Proton kommt aus der O–H-Bindung.", "Schau auf die Strukturformel."),
            cc("Natriumhydrogensulfat und Natriumsulfat: Welches Anion trägt noch ein abgebbares Proton?", "HSO₄⁻ im Natriumhydrogensulfat.", ["SO₄²⁻ im Natriumsulfat.", "Beide gleich viele."], "Hydrogensulfat ist die erste Protolysestufe der Schwefelsäure.", "‚Hydrogen‘ im Namen."),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-ph-oxonium",
      title: "pH-Wert und Oxoniumionen",
      subtitle: "Verdünnungsreihe einer Salzsäure",
      bindings: { I: 2 },
      lehrplan: "C10 LB 2 (I); Wiederholung aus C9 (I): Indikatoren, Brönsted",
      why: "Ein pH-Schritt bedeutet zehnmal mehr oder weniger Oxoniumionen.",
      html: "<p>Der pH-Wert hängt von der Konzentration der Oxoniumionen c(H₃O⁺) ab. Je mehr Oxoniumionen eine Lösung enthält, desto kleiner ist der pH-Wert. Die Skala ist so gebaut, dass eine Erhöhung des pH-Werts um 1 bedeutet: Die Oxoniumionen-Konzentration ist auf ein Zehntel gesunken. In alkalischen Lösungen ist c(H₃O⁺) sehr klein und c(OH⁻) groß; mit steigendem pH nimmt die Hydroxidionen-Konzentration zu.</p><p>In einer <strong>Verdünnungsreihe</strong> verdünnt man eine stark saure Lösung immer wieder im Verhältnis 1 : 10 mit Wasser. Salzsäure mit c(H₃O⁺) = 0,1 mol/l hat pH 1; nach einem Verdünnungsschritt pH 2, nach zwei pH 3. Verdünnen nähert den pH-Wert 7 an, macht eine saure Lösung aber nie alkalisch. Ein niedriger pH-Wert bedeutet ein höheres Gefährdungspotenzial: Konzentrierte Lösungen ätzen, stark verdünnte reizen kaum noch.</p><div class=\"example\"><strong>Beispiel:</strong> Von pH 2 auf pH 5 sinkt c(H₃O⁺) um den Faktor 10 · 10 · 10 = 1000.</div>",
      rule: "pH + 1 ⇔ c(H₃O⁺) : 10 · Verdünnen 1 : 10 → pH steigt um 1 (bis höchstens 7)",
      terms: [["c(H₃O⁺) bei pH n", "10⁻ⁿ mol/l", "pH 3 → 0,001 mol/l"]],
      quiz: [
        "Eine Lösung mit pH 2 wird 1 : 100 mit Wasser verdünnt. Welcher pH-Wert ergibt sich?",
        "pH 4",
        "pH 200",
        "1 : 100 sind zwei Verdünnungsschritte 1 : 10: der pH steigt um 2.",
      ],
      lab: makeLab("verduennung"),
      exercises: [
        {
          id: "faktor",
          make(rng, level) {
            const from = rng.int(1, 3);
            const delta = rng.int(1, 3);
            const factor = 10 ** delta;
            if (level === 1)
              return {
                prompt: `Der pH-Wert einer sauren Lösung steigt durch Verdünnen von ${from} auf ${from + delta}. Um welchen Faktor sinkt c(H₃O⁺)?`,
                given: [`Differenz: ${delta} pH-Einheit${delta > 1 ? "en" : ""}`],
                formulaHint: "Jede pH-Einheit: Faktor 10",
                fields: [withSlips(numberField("Faktor", factor), [10 * delta, "Jede pH-Einheit bedeutet „mal 10“, nicht „plus 10“: Multipliziere die Zehnen."], [delta, "Das ist die pH-Differenz. Gefragt ist der Faktor der Konzentration."])],
                steps: ["Eine pH-Einheit entspricht dem Faktor 10.", `${delta} Einheiten: 10${delta > 1 ? ["", "", "²", "³"][delta] : ""}`, `<strong>${fmt(factor, 0)}</strong>`],
              };
            const volume = rng.pick([10, 20, 50]);
            const final = volume * factor;
            return {
              prompt: `${volume} ml Salzsäure mit pH ${from} werden mit Wasser auf ${fmt(final, 0)} ml aufgefüllt. Welchen pH-Wert hat die verdünnte Lösung?`,
              given: [],
              formulaHint: "Verdünnungsfaktor → Zahl der Zehnerschritte",
              fields: [withSlips(numberField("pH", from + delta), [Math.max(0, from - delta), "Verdünnen macht eine saure Lösung weniger sauer: Der pH-Wert steigt."], [from + factor, "Zähle die Zehnerschritte des Verdünnungsfaktors, nicht den Faktor selbst."])],
              steps: [`Verdünnung ${volume} ml → ${fmt(final, 0)} ml: Faktor ${fmt(factor, 0)}.`, `Das sind ${delta} Schritte zu je 1 : 10.`, `<strong>pH ${from + delta}</strong>`],
            };
          },
        },
        cases(
          "gefaehrdung",
          [
            cc("Welche Lösung enthält mehr Oxoniumionen: pH 2 oder pH 4?", "pH 2, und zwar hundertmal mehr.", ["pH 4, doppelt so viele.", "Beide gleich viele."], "Kleinerer pH bedeutet höhere c(H₃O⁺), Faktor 10 je Einheit.", "Richtung und Faktor."),
            cc("Kann man eine saure Lösung durch Verdünnen mit Wasser alkalisch machen?", "Nein, der pH-Wert nähert sich nur 7.", ["Ja, ab dem zehnten Verdünnungsschritt.", "Ja, Wasser ist alkalisch."], "Wasser fügt keine Hydroxidionen im Überschuss hinzu.", "Was liefert Wasser?"),
          ],
          [
            cc("Warum gießt man beim Verdünnen konzentrierter Säuren die Säure ins Wasser und nicht umgekehrt?", "Es wird viel Wärme frei; so wird die Säure schnell verteilt und spritzt nicht.", ["Damit der pH-Wert sinkt.", "Weil Wasser schwerer ist als Säure."], "Erst das Wasser, dann die Säure, sonst geschieht das Ungeheure.", "Gefahr durch Wärme."),
            cc("Eine Lösung mit pH 13 wird 1 : 10 mit Wasser verdünnt. Was passiert?", "Der pH sinkt auf 12; c(OH⁻) sinkt auf ein Zehntel.", ["Der pH steigt auf 14.", "Der pH bleibt 13."], "Bei alkalischen Lösungen nähert Verdünnen den pH ebenfalls 7.", "Richtung 7."),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-neutralisation",
      title: "Neutralisation",
      subtitle: "Oxonium und Hydroxid werden zu Wasser",
      bindings: { I: 2, II_III: 3 },
      why: "Saure und alkalische Lösungen heben ihre Wirkung gegenseitig auf; dabei entsteht ein Salz.",
      html: "<p>Gibt man zu Salzsäure Natronlauge, steigt die Temperatur und der Indikator wechselt die Farbe. Auf Teilchenebene geben die Oxoniumionen Protonen an die Hydroxidionen ab: H₃O⁺ + OH⁻ → 2 H₂O. Das ist eine Protonenübertragung: H₃O⁺ ist Säure, OH⁻ ist Base. Diese Reaktion heißt <strong>Neutralisation</strong>; sie ist exotherm.</p><p>Die übrigen Ionen, hier Na⁺ und Cl⁻, nehmen nicht teil. Dampft man die neutrale Lösung ein, bleibt das Salz Natriumchlorid zurück. Neutral wird die Lösung genau dann, wenn gleich viele Oxonium- wie Hydroxidionen zusammenkommen. Bei gleicher Konzentration braucht man also gleiche Volumina einprotoniger saurer und alkalischer Lösung. Neutralisation nutzt man z. B. bei Sodbrennen oder zum Entsorgen von Säureresten.</p><div class=\"example\"><strong>Beispiel:</strong> 20 ml Salzsäure (0,1 mol/l) enthalten 2 mmol H₃O⁺. Sie werden von 20 ml Natronlauge (0,1 mol/l) mit 2 mmol OH⁻ neutralisiert.</div>",
      rule: "H₃O⁺ + OH⁻ → 2 H₂O · saure Lösung + alkalische Lösung → Salzlösung + Wasser",
      terms: [["Neutralisation", "H₃O⁺ + OH⁻ → 2 H₂O", "exotherm"]],
      quiz: [
        "Welche Teilchen reagieren bei der Neutralisation von Salzsäure mit Natronlauge?",
        "Oxoniumionen und Hydroxidionen.",
        "Natriumionen und Chloridionen.",
        "Na⁺ und Cl⁻ bleiben gelöst; H₃O⁺ und OH⁻ bilden Wasser.",
      ],
      lab: makeLab("neutralisation"),
      exercises: [
        {
          id: "volumen-neutral",
          make(rng, level) {
            const acidV = rng.pick([10, 20, 25, 50]);
            const acidC = rng.pick([0.1, 0.2, 0.5]);
            const baseC = rng.pick([0.1, 0.2, 0.5].filter((c) => c !== acidC));
            if (level === 1) {
              const baseV = round((acidV * acidC) / baseC, 1);
              return {
                prompt: `${acidV} ml Salzsäure mit c = ${fmt(acidC, 1)} mol/l sollen mit Natronlauge (c = ${fmt(baseC, 1)} mol/l) neutralisiert werden. Wie viel Natronlauge brauchst du?`,
                given: ["n(H₃O⁺) = n(OH⁻)", "n = c · V"],
                formulaHint: "c(Säure) · V(Säure) = c(Lauge) · V(Lauge)",
                fields: [withSlips(numberField("V(Natronlauge)", baseV, "ml", 1), [round((acidV * baseC) / acidC, 1), "Die Konzentrationen sind vertauscht: n(H₃O⁺) = c(Säure) · V(Säure), dann durch c(Lauge) teilen."])],
                steps: [
                  `n(H₃O⁺) = ${fmt(acidC, 1)} mol/l · ${acidV} ml = ${fmt(acidC * acidV, 1)} mmol`,
                  `V = ${fmt(acidC * acidV, 1)} mmol : ${fmt(baseC, 1)} mol/l`,
                  `<strong>${fmt(baseV, 1)} ml</strong>`,
                ],
              };
            }
            // Level 2 switches to Schwefelsäure: each molecule gives two
            // protons, so the learner needs the extra factor 2.
            const protons = 2 * acidC * acidV;
            const baseV = round(protons / baseC, 1);
            return {
              prompt: `Im Chemieraum stehen ${acidV} ml verdünnte Schwefelsäure (H₂SO₄, ${fmt(acidC, 1)} mol/l). Zum Neutralisieren gibt es nur Natronlauge mit ${fmt(baseC, 1)} mol/l. Berechne das nötige Volumen.`,
              given: [],
              formulaHint: "Ein H₂SO₄-Molekül gibt zwei Protonen ab: n(OH⁻) = 2 · n(H₂SO₄)",
              fields: [withSlips(numberField("V(Natronlauge)", baseV, "ml", 1), [round(protons / 2 / baseC, 1), "Ein H₂SO₄-Molekül gibt zwei Protonen ab: Du brauchst doppelt so viel OH⁻."])],
              steps: [
                `n(H₂SO₄) = ${fmt(acidC, 1)} mol/l · ${acidV} ml = ${fmt(acidC * acidV, 1)} mmol → n(H₃O⁺) = 2 · ${fmt(acidC * acidV, 1)} mmol = ${fmt(protons, 1)} mmol`,
                `V = ${fmt(protons, 1)} mmol : ${fmt(baseC, 1)} mol/l`,
                `<strong>${fmt(baseV, 1)} ml</strong>`,
              ],
            };
          },
        },
        cases(
          "neutralisation-fall",
          [
            cc("Welches Salz entsteht bei der Neutralisation von Salzsäure mit Kalilauge?", "Kaliumchlorid", ["Natriumchlorid", "Kaliumhydroxid"], "K⁺ aus der Kalilauge und Cl⁻ aus der Salzsäure bleiben zurück.", "Welche Ionen nehmen nicht teil?"),
            cc("Wie ändert sich die Temperatur bei der Neutralisation?", "Sie steigt: Die Reaktion ist exotherm.", ["Sie sinkt: Die Reaktion ist endotherm.", "Sie bleibt immer gleich."], "Bei der Bildung von Wasser aus H₃O⁺ und OH⁻ wird Energie frei.", "Thermometer im Versuch."),
          ],
          [
            cc("Bei Sodbrennen nimmt man ein Mittel mit Magnesiumhydroxid. Was passiert im Magen?", "Hydroxidionen neutralisieren einen Teil der Oxoniumionen der Magensäure.", ["Magnesium verdrängt die Salzsäure ohne Reaktion.", "Der Magen wird stark alkalisch."], "Neutralisation senkt die Oxoniumionen-Konzentration.", "Welche Ionen liefert das Mittel?"),
            cc("10 ml Salzsäure und 10 ml Natronlauge werden gemischt; die Lösung ist danach alkalisch. Was folgt?", "Die Natronlauge war höher konzentriert als die Salzsäure.", ["Die Salzsäure war höher konzentriert.", "Neutralisation findet bei gleichen Volumina nie statt."], "Bei gleichem Volumen entscheidet die Konzentration über die Stoffmengen.", "Wer war im Überschuss?"),
          ],
        ),
      ],
    }),
    lesson(id, 6, {
      id: "ch-titration",
      title: "Titration",
      subtitle: "Konzentration einer sauren Lösung bestimmen",
      bindings: { I: 2 },
      why: "Mit einer Titration bestimmt man, wie viel Säure in einer Probe steckt, z. B. im Essig.",
      html: "<p>Bei einer <strong>Titration</strong> legt man ein genau abgemessenes Volumen der Probelösung (z. B. Salzsäure) mit einer Pipette in einen Erlenmeyerkolben und gibt einige Tropfen Indikator dazu. Aus einer <strong>Bürette</strong> tropft man unter Rühren eine alkalische Maßlösung bekannter Konzentration (z. B. Natronlauge, c = 0,1 mol/l) zu, bis der Indikator gerade umschlägt. Am Ende liest man das verbrauchte Volumen an der Bürette ab.</p><p>Am <strong>Äquivalenzpunkt</strong> sind gleich viele Hydroxidionen zugegeben worden, wie Oxoniumionen vorlagen: n(H₃O⁺) = n(OH⁻), also c(Säure) · V(Säure) = c(Lauge) · V(Lauge). Daraus berechnet man die unbekannte Konzentration (Stoffmenge n = c · V, Wiederholung aus C8). Mit der molaren Masse folgt die Masse der Säure pro Liter. Bei starken Säuren und Laugen springt der pH-Wert am Äquivalenzpunkt steil; Bromthymolblau wechselt dort nach Grün.</p><div class=\"example\"><strong>Beispiel:</strong> 10 ml Salzsäure verbrauchen 12 ml Natronlauge (0,1 mol/l): c(HCl) = 0,1 mol/l · 12 ml : 10 ml = 0,12 mol/l.</div>",
      rule: "Äquivalenzpunkt: c(Säure) · V(Säure) = c(Lauge) · V(Lauge)",
      terms: [
        ["Titration", "c(Säure) = c(Lauge) · V(Lauge) : V(Säure)", "für einprotonige Säuren"],
        ["Massenkonzentration", "β = c · M", "M(CH₃COOH) = 60 g/mol"],
      ],
      quiz: [
        "Woran erkennt man bei der Titration mit Bromthymolblau den Äquivalenzpunkt?",
        "Die Lösung schlägt von Gelb nach Grün um.",
        "Die Lösung beginnt zu sieden.",
        "Am Äquivalenzpunkt ist die Lösung neutral; Bromthymolblau ist dort grün.",
      ],
      lab: makeLab("titration"),
      exercises: [
        {
          id: "konzentration",
          make(rng, level) {
            const sampleV = rng.pick([10, 20, 25]);
            const baseC = 0.1;
            const baseV = rng.stepped(5, 25, 0.5);
            const c = (baseC * baseV) / sampleV;
            if (level === 1)
              return {
                prompt: `${sampleV} ml Salzsäure verbrauchen bis zum Umschlag ${fmt(baseV, 1)} ml Natronlauge mit c = 0,1 mol/l. Berechne c(HCl).`,
                given: [`V(Säure) = ${sampleV} ml`, `V(Lauge) = ${fmt(baseV, 1)} ml`, "c(Lauge) = 0,1 mol/l"],
                formulaHint: "c(Säure) = c(Lauge) · V(Lauge) : V(Säure)",
                fields: [{ ...withSlips(numberField("c(HCl)", round(c, 4), "mol/l", 4), [round((baseC * sampleV) / baseV, 4), "Die Volumina sind vertauscht: c(Säure) = c(Lauge) · V(Lauge) : V(Säure)."]), tolerance: 0.01 }],
                steps: [
                  `n(OH⁻) = 0,1 mol/l · ${fmt(baseV, 1)} ml = ${fmt(baseC * baseV, 2)} mmol`,
                  `c(HCl) = ${fmt(baseC * baseV, 2)} mmol : ${sampleV} ml`,
                  `<strong>${fmt(c, 4)} mol/l</strong>`,
                ],
              };
            const beta = c * 60;
            return {
              prompt: `Verdünnter Essig wird titriert: ${sampleV} ml verbrauchen ${fmt(baseV, 1)} ml Natronlauge (c = 0,1 mol/l). Wie viel Gramm Essigsäure (M = 60 g/mol) enthält ein Liter dieses verdünnten Essigs?`,
              given: [],
              formulaHint: "Erst c(Essigsäure), dann β = c · M",
              fields: [{ ...withSlips(numberField("β(Essigsäure)", round(beta, 2), "g/l", 2), [round(c, 4), "Das ist die Stoffmengenkonzentration in mol/l. Multipliziere noch mit M = 60 g/mol."]), tolerance: 0.01 }],
              steps: [
                `c = 0,1 mol/l · ${fmt(baseV, 1)} ml : ${sampleV} ml = ${fmt(c, 4)} mol/l`,
                `β = ${fmt(c, 4)} mol/l · 60 g/mol`,
                `<strong>${fmt(beta, 2)} g/l</strong>`,
              ],
            };
          },
        },
        cases(
          "titration-praxis",
          [
            cc("In welchem Gerät befindet sich die Maßlösung bekannter Konzentration?", "In der Bürette.", ["Im Erlenmeyerkolben.", "Im Messzylinder unter dem Kolben."], "Die Bürette erlaubt, das zugegebene Volumen genau abzulesen.", "Woraus wird getropft?"),
            cc("Warum gibt man kurz vor dem Umschlag nur noch einzelne Tropfen zu?", "Am Äquivalenzpunkt ändert schon ein Tropfen den pH-Wert stark.", ["Damit die Lösung nicht zu warm wird.", "Weil der Indikator sonst verdunstet."], "Der pH-Sprung ist steil; sonst übertitriert man.", "pH-Kurve am Äquivalenzpunkt."),
          ],
          [
            cc("Eine Gruppe hat übertitriert: Die Lösung ist tiefblau. Wie wirkt sich das auf das Ergebnis aus?", "Die berechnete Konzentration der Säure ist zu groß.", ["Die berechnete Konzentration ist zu klein.", "Das Ergebnis bleibt richtig."], "Zu viel abgelesenes Laugenvolumen ergibt eine zu große Stoffmenge.", "V(Lauge) steht im Zähler."),
            cc("Warum verwendet man für die Probe eine Vollpipette statt eines Bechers mit Skala?", "Das Probevolumen geht genau in die Rechnung ein.", ["Weil Becher mit Säure reagieren.", "Weil Pipetten den Indikator enthalten."], "Ungenaue Volumina ergeben ungenaue Konzentrationen.", "Was steht im Nenner?"),
          ],
        ),
      ],
    }),
    lesson(id, 7, {
      id: "ch-carbonate-metalle",
      title: "Saure Lösungen, Kalk und Metalle",
      subtitle: "Entkalken, Gasentwicklung und Salznamen",
      bindings: { I: 2, II_III: 3 },
      why: "Entkalker, saurer Regen und rostende Geräte: Saure Lösungen reagieren mit Carbonaten und unedlen Metallen.",
      html: "<p>Saure Lösungen reagieren mit <strong>Carbonaten</strong> wie Kalk (Calciumcarbonat) unter Aufschäumen: Es entsteht Kohlenstoffdioxid, das Kalkwasser trübt. Deshalb entfernen Essig- oder Citronensäurelösungen Kalkbeläge, und saurer Regen greift Kalkstein und Marmor an. Mit <strong>unedlen Metallen</strong> wie Magnesium, Zink oder Eisen entsteht Wasserstoff (Knallgasprobe); edle Metalle wie Kupfer reagieren nicht. Deshalb gehören Entkalker nicht in Geräte mit Bauteilen aus unedlen Metallen, ohne die Herstellerangaben zu beachten.</p><p>In beiden Fällen entsteht ein Salz: Das Metallkation kommt vom Carbonat oder Metall, das Anion ist das Säurerestion. Salzsäure liefert Chloride, Schwefelsäure Sulfate, Essigsäure Acetate. Die Reaktion mit Metallen ist zugleich eine Redoxreaktion: Das Metall gibt Elektronen ab, Oxoniumionen nehmen sie auf.</p><div class=\"example\"><strong>Beispiel:</strong> CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂ (Calciumchlorid). Mg + 2 HCl → MgCl₂ + H₂ (Magnesiumchlorid).</div>",
      rule: "Carbonat + saure Lösung → Salz + Wasser + CO₂ · unedles Metall + saure Lösung → Salz + H₂",
      terms: [
        ["CO₂-Nachweis", "Kalkwasser wird trüb", ""],
        ["H₂-Nachweis", "Knallgasprobe: pfeifendes Geräusch", ""],
      ],
      quiz: [
        "Welches Gas entsteht, wenn Zink mit Salzsäure reagiert?",
        "Wasserstoff",
        "Kohlenstoffdioxid",
        "Zink ist ein unedles Metall; es reduziert Oxoniumionen zu Wasserstoff.",
      ],
      lab: makeLab("carbonat"),
      exercises: [
        {
          id: "salz-und-gas",
          make(rng, level) {
            const acid = rng.int(0, 2);
            const reactant = rng.int(0, 3);
            const result = acidReaction(acid, reactant);
            if (level === 1) {
              const otherSalts = [0, 1, 2].filter((a) => a !== acid).map((a) => acidReaction(a, reactant).salt);
              return {
                prompt: `${CARBONATE_REACTANTS[reactant]} reagiert mit ${CARBONATE_ACIDS[acid]}. Wie heißt das entstehende Salz?`,
                given: ["Kation aus dem Feststoff, Anion aus der Säure"],
                formulaHint: "Salzsäure → Chlorid · Schwefelsäure → Sulfat · Essigsäure → Acetat",
                fields: [choiceField(rng, "Salz", result.salt, otherSalts)],
                steps: ["Das Metallion stammt vom Feststoff.", "Das Säurerestion gibt den zweiten Namensteil.", `<strong>${result.salt}</strong>`],
              };
            }
            return {
              prompt: `Ein Gerät wird mit ${CARBONATE_ACIDS[acid]} behandelt; dabei kommt sie mit ${CARBONATE_REACTANTS[reactant]} in Kontakt. Welches Gas entsteht, und wie weist du es nach?`,
              given: [],
              formulaHint: "Carbonat → CO₂ · unedles Metall → H₂",
              fields: [
                choiceField(rng, "Gas", result.gas, [result.gas === "Wasserstoff" ? "Kohlenstoffdioxid" : "Wasserstoff", "Sauerstoff"]),
                choiceField(rng, "Nachweis", result.test, [result.test === "Kalkwasser wird trüb" ? "Knallgasprobe positiv" : "Kalkwasser wird trüb", "Glimmspanprobe positiv"]),
              ],
              steps: [`${CARBONATE_REACTANTS[reactant]} ist ${reactant < 2 ? "ein Carbonat" : "ein unedles Metall"}.`, result.equation, `<strong>${result.gas}: ${result.test}</strong>`],
            };
          },
        },
        cases(
          "haushalt-umwelt",
          [
            cc("Warum schäumt Essig auf einer verkalkten Armatur?", "Die Säure reagiert mit Calciumcarbonat; Kohlenstoffdioxid entweicht.", ["Essig verdampft auf dem Metall.", "Der Kalk gibt Sauerstoff ab."], "Carbonat + saure Lösung → Salz + Wasser + CO₂.", "Welches Gas entsteht aus Carbonaten?"),
            cc("Welches Metall reagiert nicht mit verdünnter Salzsäure?", "Kupfer", ["Magnesium", "Zink"], "Kupfer ist edler als Wasserstoff.", "Edel oder unedel?"),
          ],
          [
            cc("Saurer Regen trifft auf eine Marmorstatue. Was geschieht langfristig?", "Calciumcarbonat reagiert zu löslichen Salzen; der Stein wird abgetragen.", ["Der Marmor wird härter.", "Es bildet sich eine schützende Kupferschicht."], "Marmor besteht aus Calciumcarbonat.", "Carbonat + saure Lösung."),
            cc("Warum steht auf manchen Entkalkern ‚nicht für verzinkte Oberflächen‘?", "Zink ist unedel und würde von der sauren Lösung unter Wasserstoffbildung angegriffen.", ["Zink würde Kalk bilden.", "Zink macht den Entkalker alkalisch."], "Unedle Metalle reagieren mit sauren Lösungen.", "Welches Metall ist betroffen?"),
          ],
        ),
      ],
    }),
  ],
};
