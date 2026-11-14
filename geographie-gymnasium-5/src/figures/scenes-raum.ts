/** Drawn figures for Lernbereich 3 to 5: landforms, rural and urban spaces. Simplified, not to scale. */
import { arrow, label, labels, panel, person, svg } from "./draw";

const tree = (x: number, y: number, s = 1, cls = "tree") =>
  `<path class="${cls}" d="M${x} ${y}l${-10 * s} 0 ${10 * s} ${-28 * s} ${10 * s} ${28 * s}z"/><rect class="trunk" x="${x - 2 * s}" y="${y}" width="${4 * s}" height="${6 * s}"/>`;
const house = (x: number, y: number, w = 26, h = 20, cls = "house") =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/><path class="roof" d="M${x - 3} ${y}l${w / 2 + 3} ${-12}l${w / 2 + 3} 12z"/>`;

export function forces(): string {
  const left = `${panel(10, 10, 385, 290, "scene-bg")}${label(200, 36, "endogen: Kräfte aus dem Inneren", "lbl strong")}
    <path class="rock-a" d="M30 250Q90 200 150 240T270 230T380 250V290H30Z"/><path class="rock-b" d="M30 270Q90 225 150 262T270 252T380 270V290H30Z"/>
    <path class="mountain" d="M120 236L170 120L220 236Z"/><path class="volcano-cone" d="M260 232L300 140L340 232Z"/><path class="lava" d="M292 142h16l-4 30-8-6z"/><path class="ash" d="M300 130q-20-30 0-50q20 20 0 50z"/>
    ${arrow(40, 270, 100, 250, "arrow power")}${arrow(370, 272, 312, 252, "arrow power")}${label(70, 296, "Platten schieben", "lbl tiny")}${label(170, 110, "Faltung, Hebung", "lbl tiny")}${label(300, 66, "Vulkan", "lbl tiny")}`;
  const right = `${panel(405, 10, 385, 290, "scene-bg")}${label(597, 36, "exogen: Kräfte von außen", "lbl strong")}
    <path class="mountain" d="M420 280L520 90L600 200L660 150L780 280Z"/><path class="snow" d="M505 118l15-28 14 26-12-4z"/>
    <path class="crack" d="M528 140l8 14-6 10 10 12"/><circle class="rubble" cx="560" cy="210" r="6"/><circle class="rubble" cx="575" cy="228" r="5"/><circle class="rubble" cx="590" cy="246" r="4"/>
    <path class="river-line wide" d="M600 200C640 230 680 250 780 262"/><path class="fan" d="M700 270q40-16 80-10v20h-80z"/>
    ${label(560, 120, "Frost sprengt", "lbl tiny", "start")}${label(640, 222, "Fluss trägt ab", "lbl tiny", "start")}${label(740, 292, "Ablagerung", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Links endogene Kräfte: Erdplatten schieben sich zusammen, Gesteinsschichten werden gefaltet und gehoben, ein Vulkan bricht aus. Rechts exogene Kräfte: Frost sprengt Gestein, ein Fluss trägt Schutt ab und lagert ihn wieder ab.",
    `${left}${right}`,
  );
}

export function rocks(): string {
  const box = (x: number, title: string, sample: string, text: string) =>
    `${panel(x, 20, 240, 220)}${label(x + 120, 46, title, "lbl strong")}<g transform="translate(${x + 60} 64)">${sample}</g>${labels(x + 120, 196, text, "lbl tiny")}`;
  const granite = `<path class="rock-granite" d="M0 40Q20 0 70 6T120 50Q110 100 60 104T0 40Z"/>${[[20, 40], [50, 30], [80, 60], [40, 74], [92, 34], [64, 84]].map(([x, y]) => `<circle class="speck" cx="${x}" cy="${y}" r="4"/>`).join("")}`;
  const lime = `<path class="rock-lime" d="M0 30Q30 0 80 8T120 40Q116 96 64 100T0 30Z"/>${[34, 54, 74].map((y) => `<path class="layer-line" d="M4 ${y}Q60 ${y - 8} 118 ${y}"/>`).join("")}<path class="ammonite" d="M60 56a14 14 0 1 1 -1 0m1 5a8 8 0 1 0 1 0"/>`;
  const gneiss = `<path class="rock-gneiss" d="M0 40Q24 2 76 6T120 46Q112 98 58 102T0 40Z"/>${[30, 46, 62, 78].map((y) => `<path class="band" d="M6 ${y}q30 -14 56 0t56 0"/>`).join("")}`;
  return svg(
    800,
    320,
    "Drei Gesteinsgruppen mit Beispielen: Erstarrungsgestein Granit mit Körnern, Ablagerungsgestein Kalkstein mit Schichten und einem Ammoniten, Umwandlungsgestein Gneis mit Bändern; darunter die Säureprobe, bei der Essig auf Kalkstein sprudelt",
    `${box(20, "Erstarrungsgestein", granite, "aus erstarrter Gesteinsschmelze\nBeispiele: Granit, Basalt")}${box(280, "Ablagerungsgestein", lime, "aus Schichten am Meeresgrund\nBeispiele: Kalkstein, Sandstein")}${box(540, "Umwandlungsgestein", gneiss, "durch Druck und Hitze umgeformt\nBeispiele: Gneis, Marmor")}
    <path class="rock-lime" d="M330 300q20-18 60-14t50 14z"/><path class="drop" d="M385 254q8 12 0 18q-8-6 0-18z"/>${[[372, 286], [392, 282], [404, 288], [380, 280]].map(([x, y]) => `<circle class="bubble" cx="${x}" cy="${y}" r="3"/>`).join("")}${label(460, 290, "Säureprobe: Kalkstein braust mit Essig auf", "lbl small", "start")}`,
  );
}

/** A band of rock whose top follows a wave; `amp` 0 draws a flat layer. */
function band(x: number, w: number, y: number, h: number, amp: number, cls: string): string {
  const pts = Array.from({ length: 25 }, (_, i) => {
    const px = x + (w * i) / 24;
    return [px, y - amp * Math.sin((Math.PI * 2 * i) / 24)] as const;
  });
  const top = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join("");
  const bottom = [...pts].reverse().map(([px, py]) => `L${px.toFixed(1)} ${(py + h).toFixed(1)}`).join("");
  return `<path class="${cls}" d="${top}${bottom}Z"/>`;
}

export function alpsFormation(): string {
  const layers = (x: number, y: number, w: number, amp: number) =>
    ["rock-a", "rock-b", "rock-c"].map((cls, i) => band(x, w, y + i * 16, 16, amp, cls)).join("");
  const p1 = `${panel(10, 10, 255, 270, "scene-bg")}${label(137, 36, "1 Ablagerung im Meer", "lbl strong")}<rect class="sea-fill" x="70" y="80" width="135" height="90"/>${layers(70, 170, 135, 0)}<rect class="plate-eu" x="20" y="120" width="50" height="100"/><rect class="plate-af" x="205" y="120" width="50" height="100"/>${label(45, 240, "Europa", "lbl tiny")}${label(230, 240, "Afrika", "lbl tiny")}${arrow(250, 104, 214, 104, "arrow power")}`;
  const p2 = `${panel(272, 10, 255, 270, "scene-bg")}${label(400, 36, "2 Faltung und Hebung", "lbl strong")}<rect class="plate-eu" x="282" y="150" width="50" height="100"/><rect class="plate-af" x="468" y="150" width="50" height="100"/>${layers(332, 150, 136, 36)}${arrow(512, 130, 478, 130, "arrow power")}${arrow(288, 130, 322, 130, "arrow power")}${label(400, 268, "Schichten werden gefaltet und gehoben", "lbl tiny")}`;
  const p3 = `${panel(535, 10, 255, 270, "scene-bg")}${label(662, 36, "3 Überformung", "lbl strong")}<rect class="sky" x="545" y="50" width="235" height="180"/>
    <path class="mountain" d="M545 230L590 80L628 140Q636 196 660 200Q684 196 692 140L730 70L780 128V230Z"/><path class="snow" d="M581 108l9-28 10 22zM721 96l9-26 11 22z"/>
    <path class="meadow" d="M632 186Q640 200 660 202Q680 200 688 186L700 230H620Z"/><path class="glacier" d="M640 150Q660 166 682 150L676 120Q660 128 646 120Z"/>${label(660, 112, "Gletscher", "lbl tiny")}
    ${label(662, 262, "Gletscher formen U-Täler", "lbl tiny")}`;
  return svg(
    800,
    290,
    "Entstehung der Alpen in drei Bildern: Ablagerungen im Meer zwischen Europa und Afrika, Faltung und Hebung der Schichten, Überformung durch Gletscher zu Bergen mit U-Tal",
    `${p1}${p2}${p3}`,
  );
}

export function glacialSeries(): string {
  const ground = "M0 120L60 40L110 90L150 30L200 110L230 150Q300 200 360 150Q380 120 410 118Q440 116 460 150L800 160V300H0Z";
  const top = `${panel(10, 10, 780, 150, "scene-bg")}${label(400, 32, "Eiszeit vor etwa 20 000 Jahren", "lbl strong")}<g transform="translate(10 10) scale(0.975 0.48)"><rect class="sky" width="800" height="300"/><path class="profile" d="${ground}"/><path class="glacier" d="M0 120L60 40L110 80L150 30L200 100L230 140Q300 190 380 128L410 120V114L230 110Z"/><path class="gravel" d="M460 150L800 160V180L460 170Z"/></g>${arrow(520, 120, 640, 124)}${label(580, 112, "Schmelzwasser", "lbl tiny")}`;
  const bottom = `${panel(10, 170, 780, 170, "scene-bg")}${label(400, 194, "heute: die glaziale Serie", "lbl strong")}<g transform="translate(10 172) scale(0.975 0.5)"><rect class="sky" width="800" height="300"/><path class="profile" d="${ground}"/><path class="lake-fill" d="M260 178Q300 200 350 168L250 168Z"/><path class="gravel" d="M460 150L800 160V180L460 170Z"/><path class="city-block" d="M600 140h40v18h-40zM650 136h30v22h-30z"/></g>
    ${label(90, 322, "Alpen", "lbl small")}${label(300, 322, "Zungenbecken mit See", "lbl small")}${label(430, 300, "Endmoräne", "lbl small")}${label(650, 322, "Schotterebene", "lbl small")}`;
  return svg(
    800,
    350,
    "Oben in der Eiszeit: Ein Gletscher fließt aus den Alpen ins Vorland, vor ihm fließen Schmelzwasser. Unten heute: Zungenbecken mit See, Endmoräne als Hügel und Schotterebene mit Stadt. Höhen überhöht.",
    `${top}${bottom}`,
  );
}

export function naturalHazards(): string {
  const p = (x: number, title: string, body: string, note: string) => `${panel(x, 10, 255, 300, "scene-bg")}${label(x + 127, 36, title, "lbl strong")}${body}${labels(x + 127, 268, note, "lbl tiny")}`;
  const avalanche = `<rect class="sky" x="20" y="50" width="235" height="180"/><path class="mountain" d="M20 230L150 60L255 230Z"/><path class="snow" d="M130 86l20-26 20 28-12 30-18-8z"/><path class="avalanche" d="M150 120q20 30 30 70l30 30h-50q-10-50-10-100z"/>${[60, 80, 100].map((x, i) => tree(x, 220 - i * 22, 0.8)).join("")}<path class="fence" d="M178 100h20M180 110h20M182 120h20"/>${house(210, 212, 22, 16)}`;
  const flood = `<rect class="sky" x="282" y="50" width="235" height="180"/><path class="meadow" d="M282 170H517V230H282Z"/><path class="sea-fill" d="M282 186H517V230H282Z"/><path class="dike" d="M282 186l20-24h30l20 24z"/><path class="flood" d="M380 176h137v10h-137z"/>${house(420, 152, 26, 22)}<rect class="basin" x="460" y="120" width="50" height="22" rx="6"/>${label(486, 114, "Rückhaltebecken", "lbl tiny")}`;
  const surge = `<rect class="sky" x="545" y="50" width="235" height="180"/><path class="sea-fill" d="M545 150H660V230H545Z"/><path class="wave" d="M550 150q12-12 24 0t24 0 24 0 24 0"/><path class="dike" d="M640 230L680 130H710L760 200H780V230Z"/>${house(735, 182, 22, 18)}${arrow(560, 110, 620, 128, "arrow power")}${label(590, 100, "Sturm", "lbl tiny")}`;
  return svg(
    800,
    320,
    "Drei Naturgefahren mit Schutz: Lawine an einem steilen Hang mit Schutzwald und Verbauung, Hochwasser an einem Fluss mit Deich und Rückhaltebecken, Sturmflut an der Küste mit hohem Deich",
    `${p(10, "Lawine", avalanche, "Schutzwald, Lawinenverbauung,\nWarndienst")}${p(272, "Hochwasser", flood, "Deich, Rückhaltebecken,\nAuen, Warndienst")}${p(535, "Sturmflut", surge, "hoher Deich,\nSturmflutwarnung")}`,
  );
}

export function uplands(): string {
  const left = `${panel(10, 10, 385, 290, "scene-bg")}${label(200, 36, "Bruchschollengebirge", "lbl strong")}
    <path class="rock-a" d="M30 120L140 100L150 260H30Z"/><path class="rock-b" d="M150 170L250 170L240 260H150Z"/><path class="rock-a" d="M250 100L370 120V260H240Z"/>
    <line class="fault" x1="140" y1="90" x2="150" y2="270"/><line class="fault" x1="250" y1="90" x2="240" y2="270"/>
    ${arrow(90, 160, 90, 120, "arrow power")}${arrow(200, 190, 200, 230, "arrow power")}${arrow(310, 160, 310, 120, "arrow power")}
    ${label(85, 86, "Horst", "lbl small strong")}${label(200, 160, "Graben", "lbl small strong")}${label(310, 86, "Horst", "lbl small strong")}
    ${labels(200, 284, "z. B. Vogesen · Oberrheingraben · Schwarzwald", "lbl tiny")}`;
  // Layers dip gently to the right; hard layers cap the two steps.
  const L = (c: number, x: number) => c + 0.1 * (x - 415);
  const bandBetween = (c1: number, c2: number, cls: string) =>
    `<path class="${cls}" d="M415 ${L(c1, 415)}L780 ${L(c1, 780)}L780 ${L(c2, 780)}L415 ${L(c2, 415)}Z"/>`;
  const right = `${panel(405, 10, 385, 290, "scene-bg")}${label(597, 36, "Schichtstufenland", "lbl strong")}<rect class="sky" x="415" y="50" width="365" height="220"/>
    <clipPath id="clip-cuesta"><path d="M415 245L470 245L490 222.5L560 229.5L585 167L780 186.5V270H415Z"/></clipPath>
    <g clip-path="url(#clip-cuesta)"><rect class="rock-soft" x="415" y="100" width="365" height="170"/>${bandBetween(150, 170, "rock-hard")}${bandBetween(170, 215, "rock-soft")}${bandBetween(215, 232, "rock-hard")}${bandBetween(232, 300, "rock-soft")}</g>
    <path class="surface-line" d="M415 245L470 245L490 222.5L560 229.5L585 167L780 186.5"/>
    ${label(560, 150, "Stufe (steiler Anstieg)", "lbl tiny strong")}${label(690, 209, "harte Schicht: Kalkstein", "lbl tiny")}${label(690, 236, "weiche Schicht: Ton", "lbl tiny")}${label(470, 214, "Stufe", "lbl tiny")}
    ${labels(597, 284, "z. B. Fränkische Alb", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Links ein Bruchschollengebirge: Die Erdkruste ist in Schollen zerbrochen, zwei Horste wurden gehoben, ein Graben sank ab. Rechts ein Schichtstufenland: Schräg liegende harte Schichten bilden Stufen, weiche Schichten werden abgetragen.",
    `${left}${right}`,
  );
}

export function nationalPark(): string {
  return svg(
    800,
    320,
    "Schema eines Nationalparks: in der Mitte die Naturzone ohne Eingriffe mit Totholz und jungem Wald, außen ein Randbereich, in dem gegen den Borkenkäfer eingegriffen wird, und ein Besucherbereich mit Wegen und Infozentrum",
    `<rect class="sky" width="800" height="320" rx="12"/><ellipse class="zone-edge" cx="330" cy="170" rx="300" ry="140"/><ellipse class="zone-core" cx="330" cy="170" rx="200" ry="90"/>
    ${[200, 240, 300, 360, 420, 460].map((x, i) => tree(x, 180 + (i % 2) * 20, 1.1, "tree-dark")).join("")}<path class="deadwood" d="M260 230l60-12M350 238l50 8"/>${[280, 330, 390].map((x) => tree(x, 240, 0.6, "tree")).join("")}
    ${label(330, 110, "Naturzone: Natur Natur sein lassen", "lbl small strong")}${label(330, 270, "Totholz bleibt liegen, junger Wald wächst", "lbl tiny")}
    ${[70, 590].map((x) => tree(x, 190, 1, "tree-dark")).join("")}${label(330, 48, "Randbereich: Schutz der Nachbarwälder vor dem Borkenkäfer", "lbl tiny")}
    <path class="trail" d="M30 300C120 260 160 300 230 270"/>${house(660, 230, 60, 34, "visitor")}${label(690, 290, "Infozentrum", "lbl tiny")}
    ${panel(650, 30, 140, 150)}${label(720, 56, "Besucher", "lbl small strong")}${labels(720, 80, "auf Wegen bleiben\nHund an die Leine\nkein Feuer\nMüll mitnehmen", "lbl tiny", "middle", 22)}`,
  );
}

export function coastForms(): string {
  const north = `${panel(10, 10, 385, 300, "scene-bg")}${label(200, 36, "Nordseeküste", "lbl strong")}
    <rect class="sea-fill" x="20" y="50" width="365" height="120"/><path class="mudflat" d="M20 150Q120 130 200 150T385 145V230H20Z"/>
    <path class="island" d="M60 90q40-14 90 0q-40 12-90 0zM190 82q50-12 100 0q-50 14-100 0zM320 92q30-10 60 0q-30 10-60 0z"/>
    <path class="priel" d="M100 150q20 30 0 60M250 152q-20 30 10 70"/><path class="dike" d="M20 230H385V250H20Z"/><path class="marsh" d="M20 250H385V300H20Z"/>
    ${label(200, 70, "Inseln", "lbl tiny")}${label(150, 196, "Watt mit Prielen", "lbl tiny")}${label(200, 245, "Deich", "lbl tiny")}${label(200, 286, "Marsch", "lbl tiny")}`;
  const baltic = `${panel(405, 10, 385, 300, "scene-bg")}${label(597, 36, "Ostseeküste", "lbl strong")}
    <rect class="land-fill" x="415" y="50" width="365" height="250"/><path class="sea-fill" d="M415 50H780V110Q700 100 640 120T560 110Q520 100 470 120T415 115Z"/>
    <path class="sea-fill" d="M470 115Q480 180 470 240Q490 240 488 180Q486 140 490 112Z"/>${label(500, 260, "Förde", "lbl tiny")}
    <path class="sea-fill" d="M600 118Q590 160 620 170Q660 190 640 210Q600 220 620 240Q680 240 690 200Q700 160 680 130Z"/>${label(650, 262, "Bodden", "lbl tiny")}
    <path class="cliff" d="M720 110L760 100V150L720 156Z"/>${label(750, 172, "Kliff", "lbl tiny")}<path class="spit" d="M640 120q30 6 50 -10"/>${label(668, 98, "Haken", "lbl tiny")}`;
  return svg(
    800,
    320,
    "Links die Nordseeküste mit Inseln, Watt, Prielen, Deich und Marsch. Rechts die Ostseeküste mit einer Förde, einem verzweigten Bodden, einem Kliff und einem Haken. Schematisch, nicht maßstäblich.",
    `${north}${baltic}`,
  );
}

export function villageChange(): string {
  const then = `${panel(10, 10, 385, 290, "scene-bg")}${label(200, 36, "früher", "lbl strong")}<rect class="sky" x="20" y="50" width="365" height="160"/><path class="meadow" d="M20 210H385V290H20Z"/>
    ${[40, 110, 180, 250, 320].map((x) => house(x, 186, 40, 24, "farm")).join("")}<rect class="church" x="190" y="120" width="20" height="66"/><path class="roof" d="M186 120l14-30 14 30z"/>
    <ellipse class="cow" cx="90" cy="250" rx="16" ry="8"/><ellipse class="cow" cx="140" cy="262" rx="16" ry="8"/>${person(250, 270, 1, "cloth-c", "out")}<path class="plough" d="M262 262h24l6 8"/>
    ${label(200, 290, "viele kleine Höfe, Arbeit mit der Hand und mit Pferden", "lbl tiny")}`;
  const now = `${panel(405, 10, 385, 290, "scene-bg")}${label(597, 36, "heute", "lbl strong")}<rect class="sky" x="415" y="50" width="365" height="160"/><path class="field-a" d="M415 210H780V290H415Z"/>
    <rect class="hall" x="430" y="150" width="110" height="60"/><path class="solar" d="M428 150l55-26 59 26z"/>${house(560, 186, 34, 24)}${house(604, 186, 34, 24)}${house(648, 186, 34, 24)}
    <rect class="church" x="700" y="120" width="20" height="90"/><path class="roof" d="M696 120l14-30 14 30z"/><rect class="tractor" x="470" y="240" width="54" height="24" rx="4"/><circle class="wheel" cx="482" cy="266" r="10"/><circle class="wheel" cx="514" cy="268" r="7"/>
    ${arrow(640, 240, 770, 240)}${label(705, 232, "zur Arbeit in die Stadt", "lbl tiny")}${label(597, 290, "wenige große Höfe, Maschinen, Neubaugebiet, Solarstrom", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Ein Dorf früher und heute: früher viele kleine Bauernhöfe mit Kühen und Handarbeit, heute ein großer Hof mit Solardach und Traktor, ein Neubaugebiet und Menschen, die zur Arbeit in die Stadt pendeln",
    `${then}${now}`,
  );
}

export function soil(): string {
  const left = `${panel(10, 10, 380, 300, "scene-bg")}${label(200, 36, "Bodenprofil", "lbl strong")}
    ${[0, 1, 2, 3].map((i) => `<path class="grass-blade" d="M${80 + i * 50} 70l4-16 4 16"/>`).join("")}<rect class="soil-top" x="60" y="70" width="200" height="60"/><rect class="soil-mid" x="60" y="130" width="200" height="80"/><rect class="soil-rock" x="60" y="210" width="200" height="80"/>
    <path class="worm" d="M120 100q10-8 20 0t20 0"/>${[[90, 230], [150, 250], [210, 236]].map(([x, y]) => `<rect class="stone" x="${x}" y="${y}" width="24" height="16" rx="5"/>`).join("")}
    ${label(270, 104, "Oberboden mit Humus", "lbl tiny", "start")}${label(270, 174, "Unterboden", "lbl tiny", "start")}${label(270, 254, "Ausgangsgestein", "lbl tiny", "start")}`;
  const right = `${panel(400, 10, 390, 300, "scene-bg")}${label(595, 36, "Schlämmprobe", "lbl strong")}
    <path class="jar" d="M470 70h100v210q0 12-12 12h-76q-12 0-12-12z"/><rect class="water" x="472" y="90" width="96" height="100"/><rect class="clay" x="472" y="190" width="96" height="26"/><rect class="silt" x="472" y="216" width="96" height="30"/><rect class="sand" x="472" y="246" width="96" height="34"/>
    <path class="humus-bit" d="M490 96h12M520 94h10M548 98h12"/>
    ${label(580, 98, "Humus schwimmt", "lbl tiny", "start")}${label(580, 207, "Ton (ganz fein)", "lbl tiny", "start")}${label(580, 235, "Schluff", "lbl tiny", "start")}${label(580, 268, "Sand (sinkt zuerst)", "lbl tiny", "start")}
    ${labels(680, 120, "Fingerprobe:\nSand knirscht,\nTon lässt sich\nzur Rolle formen", "lbl tiny", "middle")}`;
  return svg(
    800,
    320,
    "Links ein Bodenprofil mit Oberboden und Humus, Unterboden und Ausgangsgestein, einem Regenwurm und Steinen. Rechts eine Schlämmprobe im Glas: unten Sand, darüber Schluff und Ton, oben schwimmt Humus.",
    `${left}${right}`,
  );
}

export function organicConventional(): string {
  const left = `${panel(10, 10, 385, 290, "scene-bg")}${label(200, 36, "konventionell", "lbl strong")}<rect class="sky" x="20" y="50" width="365" height="110"/><path class="field-a" d="M20 160H385V280H20Z"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line class="furrow" x1="${30 + i * 45}" y1="280" x2="${60 + i * 45}" y2="160"/>`).join("")}
    <rect class="tractor" x="150" y="140" width="60" height="26" rx="4"/><path class="spray" d="M120 170h120M130 170v14M160 170v14M190 170v14M220 170v14"/>
    <rect class="hall" x="290" y="96" width="80" height="54"/><rect class="sack" x="40" y="120" width="30" height="36" rx="4"/>${label(55, 112, "Mineraldünger", "lbl tiny")}
    ${labels(200, 220, "+ hohe Erträge, günstige Preise\n− Dünger im Grundwasser, weniger Insekten", "lbl tiny on-field")}`;
  const right = `${panel(405, 10, 385, 290, "scene-bg")}${label(597, 36, "ökologisch", "lbl strong")}<rect class="sky" x="415" y="50" width="365" height="110"/>
    <path class="field-a" d="M415 160H535V280H415Z"/><path class="meadow" d="M535 160H655V280H535Z"/><path class="field-b" d="M655 160H780V280H655Z"/>${[440, 470, 500].map((x) => tree(x, 160, 0.7)).join("")}
    <path class="manure" d="M690 150q20-30 50 0z"/>${label(715, 138, "Mist", "lbl tiny")}${[560, 590, 620].map((x) => `<ellipse class="hen" cx="${x}" cy="200" rx="10" ry="7"/>`).join("")}${label(595, 180, "Hühner mit Auslauf", "lbl tiny")}
    ${labels(597, 236, "+ schont Boden, Wasser, Arten\n− weniger Ertrag, höhere Preise", "lbl tiny on-field")}`;
  return svg(
    800,
    310,
    "Links konventionelle Landwirtschaft: großes Feld, Traktor mit Spritze, Stall und Mineraldünger. Rechts ökologische Landwirtschaft: wechselnde Feldfrüchte, Hecke, Mist als Dünger und Hühner mit Auslauf. Darunter jeweils Vor- und Nachteile.",
    `${left}${right}`,
  );
}

export function cityGrowth(): string {
  return svg(
    800,
    340,
    "Wachstum einer Stadt in Ringen: in der Mitte die mittelalterliche Altstadt mit Mauer, Markt und Kirche an einer Brücke über den Fluss, darum Viertel des 19. Jahrhunderts mit Bahnhof und Fabrik, außen Wohnsiedlungen des 20. Jahrhunderts und Neubaugebiete im Umland",
    `<rect class="sky" width="800" height="340" rx="12"/><ellipse class="ring-3" cx="330" cy="170" rx="300" ry="150"/><ellipse class="ring-2" cx="330" cy="170" rx="200" ry="105"/><ellipse class="ring-1" cx="330" cy="170" rx="95" ry="58"/>
    <path class="river-line wide" d="M0 230C150 200 250 230 330 170S520 110 800 120"/><rect class="bridge" x="318" y="160" width="26" height="10"/>
    <ellipse class="wall-ring" cx="330" cy="170" rx="70" ry="42"/><rect class="market" x="300" y="150" width="30" height="18"/><rect class="church" x="342" y="138" width="12" height="28"/><path class="roof" d="M339 138l9-14 9 14z"/>
    <rect class="station" x="440" y="210" width="40" height="16" rx="3"/><path class="rail" d="M470 226L800 300"/><rect class="factory" x="190" y="200" width="44" height="30"/><rect class="chimney" x="222" y="180" width="8" height="20"/>
    ${[100, 140, 520, 560, 600].map((x, i) => house(x, i % 2 ? 80 : 270, 22, 16)).join("")}${[690, 720, 750].map((x) => house(x, 230, 18, 14)).join("")}
    ${label(330, 190, "Altstadt", "lbl small strong")}${label(330, 95, "19. Jahrhundert", "lbl tiny")}${label(330, 40, "20. Jahrhundert", "lbl tiny")}${label(720, 280, "Umland", "lbl tiny")}${label(460, 244, "Bahnhof", "lbl tiny")}${label(212, 244, "Fabrik", "lbl tiny")}${label(331, 214, "Mauer → heute Ringstraße", "lbl tiny")}`,
  );
}

export function cityModel(): string {
  const legend: Array<[string, string]> = [["use-city", "Innenstadt"], ["use-wohnen", "Wohngebiet"], ["use-gewerbe", "Gewerbe und Industrie"], ["use-gruen", "Park und Sport"]];
  return svg(
    800,
    320,
    "Schema einer Stadt mit funktionaler Gliederung: Innenstadt in der Mitte, Wohngebiete ringsum, Gewerbe- und Industriegebiete am Rand an Autobahn und Bahnlinie, Parks und Sportflächen als grüne Flächen; rechts die Legende",
    `<rect class="paper" width="560" height="320" rx="12"/><path class="use-wohnen" d="M60 60H500V260H60Z"/><path class="use-city" d="M220 120H340V200H220Z"/>
    <path class="use-gewerbe" d="M420 200H540V300H420Z"/><path class="use-gewerbe" d="M20 20H120V90H20Z"/><path class="use-gruen" d="M120 180H200V250H120Z"/><path class="use-gruen" d="M360 60H440V110H360Z"/>
    <path class="road wide-road" d="M0 300L560 230"/><path class="rail" d="M0 40L560 120"/><path class="road" d="M280 0V320M0 160H560"/>
    ${label(280, 166, "City", "lbl small strong")}${label(480, 290, "Autobahn", "lbl tiny")}${label(60, 30, "Bahnlinie", "lbl tiny")}
    ${panel(580, 20, 210, 200)}${label(685, 46, "Legende", "lbl strong")}${legend.map(([cls, text], i) => `<rect class="${cls}" x="600" y="${64 + i * 36}" width="28" height="22" rx="4"/>${label(638, 80 + i * 36, text, "lbl small", "start")}`).join("")}`,
  );
}

export function suburbs(): string {
  return svg(
    800,
    300,
    "Suburbanisierung: Familien und Betriebe ziehen von der Kernstadt ins Umland, dort entstehen Neubaugebiete und ein Einkaufszentrum auf der grünen Wiese, und morgens pendeln viele mit Auto und S-Bahn zurück in die Stadt",
    `<rect class="sky" width="800" height="300" rx="12"/><path class="meadow" d="M0 200H800V300H0Z"/>
    ${[40, 80, 120, 160].map((x, i) => `<rect class="tower" x="${x}" y="${100 - (i % 2) * 30}" width="34" height="${100 + (i % 2) * 30}"/>`).join("")}${label(110, 226, "Kernstadt", "lbl small strong")}
    ${arrow(220, 120, 420, 120, "arrow power")}${label(320, 108, "Umzug ins Umland", "lbl small")}
    ${[440, 480, 520, 560].map((x) => house(x, 178, 30, 22)).join("")}${[600, 640].map((x) => tree(x, 200)).join("")}${label(500, 226, "Neubaugebiet", "lbl small")}
    <rect class="mall" x="670" y="150" width="110" height="50"/>${label(725, 180, "Einkaufszentrum", "lbl tiny on-dark")}${[680, 710, 740].map((x) => `<rect class="car" x="${x}" y="206" width="20" height="10" rx="3"/>`).join("")}
    <path class="road wide-road" d="M0 260H800"/>${[300, 340, 380].map((x) => `<rect class="car" x="${x}" y="252" width="24" height="12" rx="3"/>`).join("")}${arrow(420, 280, 240, 280)}${label(330, 296, "morgens: Pendler in die Stadt", "lbl tiny")}`,
  );
}

export function streetRedesign(): string {
  const before = `${panel(10, 10, 385, 290, "scene-bg")}${label(200, 36, "vorher", "lbl strong")}<rect class="sky" x="20" y="50" width="365" height="140"/><rect class="tower" x="20" y="60" width="40" height="130"/><rect class="tower" x="345" y="70" width="40" height="120"/>
    <rect class="sidewalk" x="60" y="190" width="30" height="90"/><rect class="parking" x="90" y="190" width="40" height="90"/><rect class="asphalt" x="130" y="190" width="145" height="90"/><rect class="parking" x="275" y="190" width="40" height="90"/><rect class="sidewalk" x="315" y="190" width="30" height="90"/>
    ${[100, 285].map((x) => `<rect class="car" x="${x}" y="210" width="20" height="40" rx="5"/>`).join("")}<rect class="car" x="170" y="226" width="22" height="42" rx="5"/>${label(200, 296, "Autos, Parkplätze, kein Schatten", "lbl tiny")}`;
  const after = `${panel(405, 10, 385, 290, "scene-bg")}${label(597, 36, "nachher", "lbl strong")}<rect class="sky" x="415" y="50" width="365" height="140"/><rect class="tower" x="415" y="60" width="40" height="130"/><rect class="green-roof" x="415" y="56" width="40" height="8"/><rect class="tower" x="740" y="70" width="40" height="120"/>
    <rect class="sidewalk" x="455" y="190" width="40" height="90"/><rect class="bikelane" x="495" y="190" width="40" height="90"/><rect class="asphalt" x="535" y="190" width="90" height="90"/><rect class="bikelane" x="625" y="190" width="40" height="90"/><rect class="sidewalk" x="665" y="190" width="75" height="90"/>
    ${[475, 700].map((x) => `<circle class="crown" cx="${x}" cy="150" r="28"/><rect class="trunk" x="${x - 4}" y="170" width="8" height="24"/>`).join("")}<rect class="bench" x="690" y="230" width="34" height="8"/>
    <path class="bike" d="M505 230a8 8 0 1 0 1 0M525 230a8 8 0 1 0 1 0M506 230l10-10 10 10"/><rect class="bus" x="550" y="214" width="60" height="30" rx="5"/>${label(597, 296, "Radwege, Bäume, Bank, Bus", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Querschnitt einer Straße vorher und nachher: vorher Fahrspuren und Parkstreifen ohne Bäume, nachher Radwege, Bäume, eine Bank, ein begrüntes Dach und ein Bus",
    `${before}${after}`,
  );
}
