/**
 * Compact didactic inline SVGs (`concept-figure`) shown inside lesson
 * explanations. Every colour comes from CSS variables so light and dark
 * themes render with high contrast, and all labels use German decimal
 * commas and real minus signs (−).
 */

function fig(
  caption: string,
  body: string,
  height = 176,
): string {
  return `<figure class="concept-figure"><svg viewBox="0 0 520 ${height}" role="img" aria-label="${caption.replace(/"/g, "&quot;")}" preserveAspectRatio="xMidYMid meet">${body}</svg><figcaption>${caption}</figcaption></figure>`;
}

function miniAxes(
  ox: number,
  oy: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  xLab = "x",
  yLab = "y",
): string {
  return (
    `<line x1="${x0}" y1="${oy}" x2="${x1}" y2="${oy}" class="lab-axis"/>` +
    `<polygon points="${x1},${oy} ${x1 - 7},${oy - 3.5} ${x1 - 7},${oy + 3.5}" class="lab-axis lab-arrowhead"/>` +
    `<line x1="${ox}" y1="${y1}" x2="${ox}" y2="${y0}" class="lab-axis"/>` +
    `<polygon points="${ox},${y0} ${ox - 3.5},${y0 + 7} ${ox + 3.5},${y0 + 7}" class="lab-axis lab-arrowhead"/>` +
    `<text x="${x1 - 2}" y="${oy - 6}" class="lab-text-axis" text-anchor="end">${xLab}</text>` +
    `<text x="${ox + 7}" y="${y0 + 10}" class="lab-text-axis">${yLab}</text>`
  );
}

function box(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub = "",
  cls = "lab-cell",
): string {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls}"/>` +
    `<text x="${x + w / 2}" y="${y + (sub ? h / 2 - 4 : h / 2 + 5)}" class="lab-text" text-anchor="middle">${title}</text>` +
    (sub
      ? `<text x="${x + w / 2}" y="${y + h / 2 + 15}" class="lab-text-small" text-anchor="middle">${sub}</text>`
      : "")
  );
}

export const CONCEPT_DIAGRAMS = {
  ft1: fig(
    "Drei Darstellungen derselben Zuordnung K(x) = 8 + 0,30 · x",
    `<rect x="16" y="22" width="146" height="128" rx="8" class="lab-cell"/>` +
      `<text x="89" y="50" class="lab-text" text-anchor="middle">Wertetabelle</text>` +
      `<line x1="30" y1="60" x2="148" y2="60" class="lab-axis"/>` +
      `<text x="89" y="82" class="lab-text-small" text-anchor="middle">x = 10 → 11 €</text>` +
      `<text x="89" y="106" class="lab-text-small" text-anchor="middle">x = 20 → 14 €</text>` +
      `<text x="89" y="130" class="lab-text-small" text-anchor="middle">x = 30 → 17 €</text>` +
      `<path d="M168 86 H196" class="lab-side-a"/><polygon points="198,86 190,82 190,90" class="lab-point-a"/>` +
      box(204, 46, 128, 80, "Term", "K(x) = 8 + 0,3x", "lab-panel") +
      `<path d="M338 86 H366" class="lab-side-a"/><polygon points="368,86 360,82 360,90" class="lab-point-a"/>` +
      `<rect x="372" y="22" width="132" height="128" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(392, 130, 382, 492, 34, 142, "x", "K") +
      `<line x1="392" y1="112" x2="484" y2="52" class="lab-curve"/>` +
      `<circle cx="422" cy="92" r="3.5" class="lab-point-a"/>` +
      `<circle cx="452" cy="72" r="3.5" class="lab-point-a"/>` +
      `<text x="438" y="145" class="lab-text-small" text-anchor="middle">Graph</text>`,
  ),
  ft2: fig(
    "Senkrechtentest: links eindeutig (Funktion), rechts zwei y-Werte (keine Funktion)",
    `<rect x="18" y="14" width="224" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(64, 132, 32, 224, 24, 148) +
      `<path d="M40 120 Q112 36 206 54" class="lab-curve-ok"/>` +
      `<line x1="130" y1="26" x2="130" y2="146" class="lab-dashed"/>` +
      `<circle cx="130" cy="64" r="4.5" class="lab-point-ok"/>` +
      `<text x="130" y="154" class="lab-text-ok" text-anchor="middle">1 Schnittpunkt → Funktion</text>` +
      `<rect x="278" y="14" width="224" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(324, 132, 292, 484, 24, 148) +
      `<ellipse cx="398" cy="84" rx="52" ry="38" class="lab-curve-2"/>` +
      `<line x1="390" y1="26" x2="390" y2="146" class="lab-asymptote"/>` +
      `<circle cx="390" cy="47" r="4.5" class="lab-point-bad"/>` +
      `<circle cx="390" cy="121" r="4.5" class="lab-point-bad"/>` +
      `<text x="390" y="154" class="lab-text-bad" text-anchor="middle">2 Werte → keine Funktion</text>`,
  ),
  ft3: fig(
    "Fachbegriffe am Zuordnungspfeil f(x) = x²: jedes x aus D erhält genau ein y in W",
    box(20, 26, 134, 122, "Definitionsmenge D", "x ∈ {1; 2; 3; 4}", "lab-fill-a lab-cell") +
      `<path d="M162 87 H212" class="lab-side-a"/><polygon points="216,87 207,82 207,92" class="lab-point-a"/>` +
      box(222, 48, 108, 78, "Term f(x)", "f(x) = x²", "lab-panel") +
      `<path d="M338 87 H368" class="lab-side-ok"/><polygon points="372,87 363,82 363,92" class="lab-point-ok"/>` +
      box(378, 26, 124, 122, "Wertemenge W", "y ∈ {1; 4; 9; 16}", "lab-fill-ok lab-cell") +
      `<text x="87" y="128" class="lab-text-small" text-anchor="middle">Argumente x</text>` +
      `<text x="440" y="128" class="lab-text-small" text-anchor="middle">Funktionswerte y</text>`,
  ),
  ft4: fig(
    "Punktprobe und Achsenschnittpunkte für f(x) = 2x − 4",
    `<rect x="24" y="14" width="280" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(96, 94, 38, 290, 22, 154) +
      `<line x1="56" y1="150" x2="220" y2="28" class="lab-curve"/>` +
      `<circle cx="96" cy="120" r="4.5" class="lab-point-b"/>` +
      `<text x="104" y="135" class="lab-text-b">Sy(0 | −4)</text>` +
      `<circle cx="150" cy="94" r="4.5" class="lab-point-ok"/>` +
      `<text x="156" y="110" class="lab-text-ok">Sx(2 | 0)</text>` +
      `<circle cx="178" cy="60" r="4.5" class="lab-point-a"/>` +
      `<text x="184" y="56" class="lab-text-a">P(3 | 2) ∈ G</text>` +
      `<circle cx="123" cy="74" r="4.5" class="lab-point-bad"/>` +
      `<text x="129" y="70" class="lab-text-bad">Q(1 | 1) ∉ G</text>` +
      box(322, 26, 178, 124, "Punktprobe f(x)", "P(3 | 2): f(3) = 2 ✓", "lab-panel") +
      `<text x="411" y="122" class="lab-text-bad" text-anchor="middle">Q(1 | 1): f(1) = −2 ≠ 1 ✗</text>`,
  ),
  ft5: fig(
    "Veränderung des Funktionswerts Δy bei Schritt Δx = +2",
    `<rect x="20" y="14" width="226" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(56, 134, 32, 232, 26, 146) +
      `<line x1="60" y1="126" x2="210" y2="42" class="lab-curve-ok"/>` +
      `<polyline points="94,107 166,107 166,67" class="lab-dashed"/>` +
      `<text x="130" y="122" class="lab-text-small" text-anchor="middle">Δx = +2</text>` +
      `<text x="172" y="91" class="lab-text-ok">Δy = +4</text>` +
      `<text x="130" y="32" class="lab-text-ok" text-anchor="middle">steigend</text>` +
      `<rect x="274" y="14" width="226" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(310, 134, 286, 486, 26, 146) +
      `<line x1="316" y1="42" x2="466" y2="126" class="lab-curve-2"/>` +
      `<polyline points="350,61 422,61 422,101" class="lab-dashed"/>` +
      `<text x="386" y="54" class="lab-text-small" text-anchor="middle">Δx = +2</text>` +
      `<text x="428" y="85" class="lab-text-bad">Δy = −4</text>` +
      `<text x="386" y="32" class="lab-text-bad" text-anchor="middle">fallend</text>`,
  ),
  lf1: fig(
    "Parameter m (Steigung) und t (y-Achsenabschnitt) bei y = 1,5x + 1",
    `<rect x="20" y="14" width="280" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(100, 126, 36, 284, 22, 152) +
      `<line x1="56" y1="146" x2="256" y2="46" class="lab-curve"/>` +
      `<circle cx="100" cy="124" r="4.5" class="lab-point-b"/>` +
      `<text x="58" y="118" class="lab-text-b">t = 1</text>` +
      `<polyline points="100,124 180,124 180,84" class="lab-side-ok"/>` +
      `<text x="140" y="140" class="lab-text-small" text-anchor="middle">Δx = 2</text>` +
      `<text x="186" y="108" class="lab-text-ok">Δy = 3</text>` +
      box(316, 26, 184, 124, "Gerade y = m·x + t", "m = Δy / Δx = 3 / 2 = 1,5", "lab-panel") +
      `<text x="408" y="124" class="lab-text-b" text-anchor="middle">Sy(0 | 1) → t = 1</text>`,
  ),
  lf2: fig(
    "Ablesen aus dem Graphen: Sy(0 | 3) und Steigungsdreieck für y = −0,5x + 3",
    `<rect x="20" y="14" width="290" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(90, 126, 36, 294, 22, 152) +
      `<line x1="50" y1="42" x2="274" y2="114" class="lab-curve"/>` +
      `<circle cx="90" cy="55" r="4.5" class="lab-point-b"/>` +
      `<text x="98" y="48" class="lab-text-b">Sy(0 | 3)</text>` +
      `<polyline points="90,55 190,55 190,87" class="lab-side-ok"/>` +
      `<text x="140" y="48" class="lab-text-small" text-anchor="middle">+2 nach rechts</text>` +
      `<text x="196" y="75" class="lab-text-bad">−1 nach unten</text>` +
      box(326, 26, 174, 124, "Abgelesen", "t = 3 und m = −1 / 2 = −0,5", "lab-panel") +
      `<text x="413" y="124" class="lab-text-a" text-anchor="middle">y = −0,5x + 3</text>`,
  ),
  lf3: fig(
    "Gerade aus zwei Punkten P(1 | 2) und Q(4 | 8) rechnerisch bestimmen",
    `<rect x="20" y="14" width="246" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(64, 134, 34, 250, 22, 152) +
      `<line x1="50" y1="145" x2="210" y2="29" class="lab-curve"/>` +
      `<circle cx="98" cy="110" r="4.5" class="lab-point-a"/>` +
      `<text x="62" y="106" class="lab-text-a">P(1|2)</text>` +
      `<circle cx="182" cy="49" r="4.5" class="lab-point-b"/>` +
      `<text x="190" y="48" class="lab-text-b">Q(4|8)</text>` +
      `<polyline points="98,110 182,110 182,49" class="lab-dashed"/>` +
      box(282, 22, 220, 132, "1. m = (8 − 2) : (4 − 1) = 2", "2. 2 = 2 · 1 + t ⇒ t = 0", "lab-panel") +
      `<text x="392" y="128" class="lab-text-ok" text-anchor="middle">Ergebnis: y = 2x</text>`,
  ),
  lf4: fig(
    "Nullstelle von f(x) = 2x − 6: f(x₀) = 0 liefert N(3 | 0)",
    `<rect x="20" y="14" width="286" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(84, 96, 36, 290, 22, 152) +
      `<line x1="60" y1="148" x2="236" y2="34" class="lab-curve"/>` +
      `<circle cx="140" cy="96" r="5" class="lab-point-ok"/>` +
      `<text x="148" y="114" class="lab-text-ok">N(3 | 0)</text>` +
      `<text x="96" y="142" class="lab-text-bad">y &lt; 0</text>` +
      `<text x="200" y="54" class="lab-text-ok">y &gt; 0</text>` +
      box(320, 28, 180, 120, "Ansatz f(x) = 0", "2x − 6 = 0  | +6; :2", "lab-panel") +
      `<text x="410" y="124" class="lab-text-ok" text-anchor="middle">x₀ = 3 → N(3 | 0)</text>`,
  ),
  lf5: fig(
    "Schnittpunkt S(2 | 3) von g: y = x + 1 und h: y = −0,5x + 4",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(84, 130, 36, 280, 22, 152) +
      `<line x1="48" y1="138" x2="244" y2="38" class="lab-curve"/>` +
      `<line x1="56" y1="44" x2="258" y2="128" class="lab-curve-2"/>` +
      `<circle cx="146" cy="88" r="5" class="lab-point-ok"/>` +
      `<text x="154" y="82" class="lab-text-ok">S(2 | 3)</text>` +
      `<text x="220" y="38" class="lab-text-a">g</text>` +
      `<text x="242" y="114" class="lab-text-b">h</text>` +
      box(312, 26, 188, 124, "Gleichsetzen g(x) = h(x)", "x + 1 = −0,5x + 4 ⇒ x = 2", "lab-panel") +
      `<text x="406" y="124" class="lab-text-ok" text-anchor="middle">y = 2 + 1 = 3 → S(2 | 3)</text>`,
  ),
  lf6: fig(
    "Tarifvergleich: Tarif A (10 + 0,5x) trifft Tarif B (20 + 0,25x) bei x = 40",
    `<rect x="20" y="14" width="286" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(56, 136, 36, 290, 22, 152, "min", "€") +
      `<line x1="56" y1="116" x2="262" y2="36" class="lab-curve"/>` +
      `<line x1="56" y1="96" x2="262" y2="56" class="lab-curve-2"/>` +
      `<circle cx="160" cy="76" r="4.5" class="lab-point-ok"/>` +
      `<text x="160" y="64" class="lab-text-ok" text-anchor="middle">40 min | 30 €</text>` +
      `<text x="234" y="34" class="lab-text-a">A</text>` +
      `<text x="246" y="72" class="lab-text-b">B</text>` +
      box(320, 26, 180, 124, "Sachdeutung", "Unter 40 min: A günstiger", "lab-panel") +
      `<text x="410" y="124" class="lab-text-b" text-anchor="middle">Über 40 min: B günstiger</text>`,
  ),
  lf7: fig(
    "Lineare Ungleichung −2x + 4 < 10: Umdrehen des Zeichens beim Teilen durch −2",
    `<rect x="20" y="16" width="480" height="58" rx="8" class="lab-panel"/>` +
      `<text x="260" y="42" class="lab-text" text-anchor="middle">−2x + 4 &lt; 10   | −4  ⇒  −2x &lt; 6   | : (−2)  ⇒  x &gt; −3</text>` +
      `<text x="260" y="64" class="lab-text-ok" text-anchor="middle">Lösungsintervall: L = ]−3; ∞[</text>` +
      `<line x1="55" y1="120" x2="455" y2="120" class="lab-axis"/>` +
      `<line x1="160" y1="120" x2="462" y2="120" class="lab-side-ok"/>` +
      `<polygon points="468,120 456,115 456,125" class="lab-ok-stroke lab-fill-ok"/>` +
      `<circle cx="160" cy="120" r="6" class="lab-open"/>` +
      `<text x="160" y="144" class="lab-text-tick" text-anchor="middle">−3</text>` +
      `<text x="280" y="144" class="lab-text-tick" text-anchor="middle">0</text>` +
      `<text x="400" y="144" class="lab-text-tick" text-anchor="middle">3</text>`,
  ),
  lf8: fig(
    "Direkte Proportionalität y = 2,5 · x (Ursprungsgerade) vs. y = 2x + 2",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(64, 134, 34, 280, 22, 152) +
      `<line x1="64" y1="134" x2="242" y2="34" class="lab-curve-ok"/>` +
      `<line x1="64" y1="104" x2="242" y2="54" class="lab-dashed"/>` +
      `<circle cx="64" cy="134" r="4.5" class="lab-point-ok"/>` +
      `<text x="172" y="64" class="lab-text-ok">y = 2,5x</text>` +
      `<text x="190" y="96" class="lab-text-muted">y = 2x + 2</text>` +
      box(312, 26, 188, 124, "Quotientengleichheit", "y / x = a = 2,5 konstant", "lab-panel") +
      `<text x="406" y="124" class="lab-text-ok" text-anchor="middle">verläuft durch (0 | 0)</text>`,
  ),
  gr1: fig(
    "Definitionslücke bei f(x) = 4/(x − 2) + 1: Nenner x − 2 = 0 bei x = 2",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(84, 108, 34, 280, 22, 154) +
      `<line x1="156" y1="22" x2="156" y2="154" class="lab-asymptote"/>` +
      `<path d="M40 100 Q138 104 148 152" class="lab-curve"/>` +
      `<path d="M164 24 Q174 78 272 82" class="lab-curve"/>` +
      `<text x="164" y="148" class="lab-text-bad">x = 2 (Lücke)</text>` +
      box(312, 26, 188, 124, "Nenner ≠ 0", "x − 2 = 0 ⇒ x = 2", "lab-panel") +
      `<text x="406" y="124" class="lab-text-bad" text-anchor="middle">D = ℚ \\ {2}</text>`,
  ),
  gr2: fig(
    "Verschiebung von 1/x zu f(x) = 2/(x − 2) + 1: Asymptoten x = 2 und y = 1",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(88, 114, 34, 280, 22, 154) +
      `<line x1="156" y1="22" x2="156" y2="154" class="lab-asymptote"/>` +
      `<line x1="34" y1="84" x2="280" y2="84" class="lab-asymptote"/>` +
      `<path d="M40 94 Q136 98 148 150" class="lab-curve-c"/>` +
      `<path d="M164 24 Q176 74 274 78" class="lab-curve-c"/>` +
      `<text x="162" y="148" class="lab-text-bad">x = −b = 2</text>` +
      `<text x="40" y="76" class="lab-text-bad">y = c = 1</text>` +
      box(312, 24, 188, 128, "Parameterwirkung", "b verschiebt links/rechts", "lab-panel") +
      `<text x="406" y="114" class="lab-text-small" text-anchor="middle">c verschiebt hoch/runter</text>` +
      `<text x="406" y="134" class="lab-text-c" text-anchor="middle">Schnittpunkt (2 | 1)</text>`,
  ),
  gr3: fig(
    "Achsenschnittpunkte der Hyperbel f(x) = 6/(x + 2) − 1: Sy(0 | 2) und N(4 | 0)",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(116, 102, 34, 280, 22, 154) +
      `<line x1="76" y1="22" x2="76" y2="154" class="lab-asymptote"/>` +
      `<line x1="34" y1="122" x2="280" y2="122" class="lab-asymptote"/>` +
      `<path d="M84 26 Q110 88 268 116" class="lab-curve"/>` +
      `<circle cx="116" cy="70" r="4.5" class="lab-point-b"/>` +
      `<text x="124" y="64" class="lab-text-b">Sy(0 | 2)</text>` +
      `<circle cx="196" cy="102" r="4.5" class="lab-point-ok"/>` +
      `<text x="196" y="92" class="lab-text-ok">N(4 | 0)</text>` +
      box(312, 26, 188, 124, "Rechnung", "f(0) = 6/2 − 1 = 2 → Sy(0|2)", "lab-panel") +
      `<text x="406" y="124" class="lab-text-ok" text-anchor="middle">6/(x+2) = 1 ⇒ x = 4</text>`,
  ),
  gr4: fig(
    "Vom Graphen zum Term: Asymptotenkreuz (1 | −2) + Testpunkt P(3 | 0) → a = 4",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(96, 86, 34, 280, 22, 154) +
      `<line x1="132" y1="22" x2="132" y2="154" class="lab-asymptote"/>` +
      `<line x1="34" y1="118" x2="280" y2="118" class="lab-asymptote"/>` +
      `<path d="M140 26 Q162 88 272 110" class="lab-curve"/>` +
      `<circle cx="132" cy="118" r="4" class="lab-point-bad"/>` +
      `<circle cx="204" cy="86" r="4.5" class="lab-point-ok"/>` +
      `<text x="208" y="76" class="lab-text-ok">P(3 | 0)</text>` +
      box(312, 24, 188, 128, "1. b = −1, c = −2", "2. 0 = a/(3−1) − 2 ⇒ a = 4", "lab-panel") +
      `<text x="406" y="130" class="lab-text-c" text-anchor="middle">f(x) = 4/(x − 1) − 2</text>`,
  ),
  gr5: fig(
    "Indirekte Proportionalität y = 12 / x: Produkt x · y = 12 bleibt immer gleich",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(56, 140, 34, 280, 22, 154) +
      `<rect x="56" y="56" width="52" height="84" class="lab-fill-a"/>` +
      `<rect x="56" y="98" width="104" height="42" class="lab-fill-b"/>` +
      `<path d="M74 26 Q106 106 266 130" class="lab-curve"/>` +
      `<circle cx="108" cy="56" r="4" class="lab-point-a"/>` +
      `<circle cx="160" cy="98" r="4" class="lab-point-b"/>` +
      `<text x="115" y="52" class="lab-text-a">(2|6)</text>` +
      `<text x="167" y="95" class="lab-text-b">(4|3)</text>` +
      box(312, 26, 188, 124, "Produktgleichheit", "2 · 6 = 4 · 3 = 12", "lab-panel") +
      `<text x="406" y="124" class="lab-text-small" text-anchor="middle">Verdoppelt sich x, halbiert sich y</text>`,
  ),
  bt1: fig(
    "Erst faktorisieren, dann kürzen: gemeinsamer Faktor (x + 2) fällt weg",
    box(16, 36, 144, 102, "2x + 4", "x² − 4", "lab-cell") +
      `<line x1="36" y1="86" x2="140" y2="86" class="lab-side-a"/>` +
      `<text x="176" y="91" class="lab-text-big" text-anchor="middle">=</text>` +
      box(192, 36, 174, 102, "2 · (x + 2)", "(x − 2)(x + 2)", "lab-fill-a lab-cell") +
      `<line x1="208" y1="86" x2="350" y2="86" class="lab-side-a"/>` +
      `<text x="382" y="91" class="lab-text-big" text-anchor="middle">=</text>` +
      box(398, 36, 106, 102, "2", "x − 2", "lab-fill-ok lab-cell") +
      `<line x1="416" y1="86" x2="486" y2="86" class="lab-side-ok"/>` +
      `<text x="260" y="162" class="lab-text-small" text-anchor="middle">Definitionsmenge vor dem Kürzen: D = ℚ \\ {−2; 2}</text>`,
  ),
  bt2: fig(
    "Auf den Hauptnenner (x − 1)(x + 1) erweitern, dann Zähler addieren",
    box(16, 26, 144, 96, "3 / (x − 1)", "· (x + 1)", "lab-cell") +
      `<text x="174" y="78" class="lab-text-big" text-anchor="middle">+</text>` +
      box(188, 26, 144, 96, "2 / (x + 1)", "· (x − 1)", "lab-cell") +
      `<text x="346" y="78" class="lab-text-big" text-anchor="middle">=</text>` +
      box(360, 26, 144, 96, "5x + 1", "(x − 1)(x + 1)", "lab-fill-ok lab-cell") +
      `<line x1="378" y1="74" x2="486" y2="74" class="lab-side-ok"/>` +
      `<text x="260" y="152" class="lab-text-small" text-anchor="middle">3(x + 1) + 2(x − 1) = 3x + 3 + 2x − 2 = 5x + 1</text>`,
  ),
  bt3: fig(
    "Dividieren = mit dem Kehrwert multiplizieren, dann über Kreuz kürzen",
    box(16, 28, 152, 92, "4x : 2x", "(x+2) : (x²−4)", "lab-cell") +
      `<text x="184" y="78" class="lab-text-big" text-anchor="middle">⇒</text>` +
      box(200, 28, 184, 92, "4x · (x−2)(x+2)", "(x + 2) · 2x", "lab-panel") +
      `<text x="398" y="78" class="lab-text-big" text-anchor="middle">=</text>` +
      box(412, 28, 92, 92, "2(x − 2)", "gekürzt", "lab-fill-ok lab-cell") +
      `<text x="260" y="150" class="lab-text-small" text-anchor="middle">Ausgeschlossen: alle Nullstellen der Nenner und des Divisors.</text>`,
  ),
  bt4: fig(
    "Permanenzprinzip bei Basis 2: jeder Schritt nach links teilt durch 2",
    [
      { e: "2³", v: "8", x: 20 },
      { e: "2²", v: "4", x: 90 },
      { e: "2¹", v: "2", x: 160 },
      { e: "2⁰", v: "1", x: 230 },
      { e: "2⁻¹", v: "1/2", x: 300 },
      { e: "2⁻²", v: "1/4", x: 370 },
      { e: "2⁻³", v: "1/8", x: 440 },
    ]
      .map((c, i) =>
        box(c.x, 38, 60, 82, c.e, c.v, i >= 4 ? "lab-fill-b lab-cell" : i === 3 ? "lab-fill-ok lab-cell" : "lab-cell"),
      )
      .join(""),
    158,
  ),
  bt5: fig(
    "Bruchgleichung 6/(x − 1) = 4/(x + 1): mit Hauptnenner multiplizieren und Probe",
    box(16, 26, 146, 94, "1. D bestimmen", "D = ℚ \\ {−1; 1}", "lab-cell") +
      `<text x="175" y="78" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(188, 26, 164, 94, "2. · (x − 1)(x + 1)", "6(x + 1) = 4(x − 1)", "lab-panel") +
      `<text x="365" y="78" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(378, 26, 126, 94, "3. x = −5 ∈ D", "L = {−5}", "lab-fill-ok lab-cell") +
      `<text x="260" y="150" class="lab-text-bad lab-text-small" text-anchor="middle">Achtung: Liegt ein x in der Lücke, entfällt es als Scheinlösung!</text>`,
  ),
  bt6: fig(
    "Bruchgleichung 4/(x − 1) = x − 1 als Schnittproblem zweier Funktionsgraphen",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(108, 92, 34, 280, 22, 154) +
      `<line x1="142" y1="22" x2="142" y2="154" class="lab-asymptote"/>` +
      `<path d="M40 100 Q124 106 134 150" class="lab-curve"/>` +
      `<path d="M150 24 Q162 78 272 84" class="lab-curve"/>` +
      `<line x1="56" y1="142" x2="246" y2="34" class="lab-curve-2"/>` +
      `<circle cx="74" cy="112" r="4.5" class="lab-point-ok"/>` +
      `<circle cx="210" cy="60" r="4.5" class="lab-point-ok"/>` +
      `<text x="58" y="132" class="lab-text-ok">S₁(−1|−2)</text>` +
      `<text x="216" y="54" class="lab-text-ok">S₂(3|2)</text>` +
      box(312, 26, 188, 124, "Zwei Schnittpunkte", "x₁ = −1 und x₂ = 3", "lab-panel") +
      `<text x="406" y="124" class="lab-text-ok" text-anchor="middle">L = {−1; 3}</text>`,
  ),
  bt7: fig(
    "Formeln aus der Physik umstellen am Beispiel R = U / I (Ohmsches Gesetz)",
    box(16, 36, 134, 96, "Ausgangsformel", "R = U / I", "lab-cell") +
      `<text x="166" y="88" class="lab-text-big" text-anchor="middle">⇔</text>` +
      box(182, 36, 146, 96, "Nach U aufgelöst", "U = R · I", "lab-panel") +
      `<text x="344" y="88" class="lab-text-big" text-anchor="middle">⇔</text>` +
      box(360, 36, 144, 96, "Nach I aufgelöst", "I = U / R", "lab-fill-ok lab-cell") +
      `<text x="260" y="156" class="lab-text-small" text-anchor="middle">Erst den Nenner I heraufmultiplizieren, dann durch R teilen (I ≠ 0, R ≠ 0).</text>`,
  ),
  la1: fig(
    "Ergebnismenge Ω = {1; 2; 3; 4; 5; 6}, Ereignis E = {2; 4; 6} und Gegenereignis Ē",
    `<rect x="24" y="18" width="472" height="136" rx="14" class="lab-cell"/>` +
      `<text x="40" y="40" class="lab-text-small">Ergebnismenge Ω (Würfel)</text>` +
      `<rect x="40" y="50" width="212" height="88" rx="10" class="lab-fill-a lab-side-a"/>` +
      `<text x="146" y="72" class="lab-text-a" text-anchor="middle">Ereignis E (gerade)</text>` +
      `<text x="146" y="106" class="lab-text-big" text-anchor="middle">{2; 4; 6}</text>` +
      `<rect x="272" y="50" width="208" height="88" rx="10" class="lab-fill-b lab-side-b"/>` +
      `<text x="376" y="72" class="lab-text-b" text-anchor="middle">Gegenereignis Ē (ungerade)</text>` +
      `<text x="376" y="106" class="lab-text-big" text-anchor="middle">{1; 3; 5}</text>`,
  ),
  la2: fig(
    "Gesetz der großen Zahlen: Relative Häufigkeit hn stabilisiert sich nahe p = 0,5",
    `<rect x="22" y="16" width="476" height="142" rx="8" class="lab-plot-bg lab-cell"/>` +
      `<line x1="56" y1="84" x2="478" y2="84" class="lab-asymptote"/>` +
      `<text x="48" y="88" class="lab-text-bad" text-anchor="end">0,5</text>` +
      `<polyline points="60,34 90,126 125,52 165,108 210,70 260,96 315,78 370,88 430,83 472,85" class="lab-curve"/>` +
      `<text x="112" y="146" class="lab-text-tick" text-anchor="middle">n = 20</text>` +
      `<text x="260" y="146" class="lab-text-tick" text-anchor="middle">n = 200</text>` +
      `<text x="430" y="146" class="lab-text-tick" text-anchor="middle">n = 1000</text>`,
  ),
  la3: fig(
    "Tabellenkalkulation: Relativer Zellbezug B2 wandert mit, absoluter $B$5 bleibt fest",
    `<rect x="30" y="18" width="460" height="32" rx="6" class="lab-panel"/>` +
      `<text x="44" y="39" class="lab-text-a">C2  fx  = B2 / $B$5</text>` +
      `<rect x="30" y="58" width="110" height="28" class="lab-cell-sum"/><text x="85" y="77" class="lab-text-small" text-anchor="middle">A (Ergebnis)</text>` +
      `<rect x="140" y="58" width="140" height="28" class="lab-cell-sum"/><text x="210" y="77" class="lab-text-small" text-anchor="middle">B (Anzahl)</text>` +
      `<rect x="280" y="58" width="210" height="28" class="lab-cell-sum"/><text x="385" y="77" class="lab-text-small" text-anchor="middle">C (Rel. Häufigkeit)</text>` +
      `<rect x="30" y="86" width="110" height="30" class="lab-cell"/><text x="85" y="106" class="lab-text-small" text-anchor="middle">Treffer (Z2)</text>` +
      `<rect x="140" y="86" width="140" height="30" class="lab-cell"/><text x="210" y="106" class="lab-text-a" text-anchor="middle">48</text>` +
      `<rect x="280" y="86" width="210" height="30" class="lab-fill-ok lab-cell"/><text x="385" y="106" class="lab-text-ok" text-anchor="middle">= B2 / $B$5 → 0,48</text>` +
      `<rect x="30" y="116" width="110" height="30" class="lab-cell"/><text x="85" y="136" class="lab-text-small" text-anchor="middle">Summe ($B$5)</text>` +
      `<rect x="140" y="116" width="140" height="30" class="lab-fill-b lab-cell"/><text x="210" y="136" class="lab-text-b" text-anchor="middle">100</text>` +
      `<rect x="280" y="116" width="210" height="30" class="lab-cell"/><text x="385" y="136" class="lab-text-small" text-anchor="middle">$ verhindert Zeilenwechsel</text>`,
  ),
  la4: fig(
    "Laplace (alle Ergebnisse gleich wahrscheinlich) vs. Nicht-Laplace",
    `<rect x="20" y="14" width="226" height="148" rx="8" class="lab-cell"/>` +
      `<circle cx="133" cy="82" r="46" class="lab-fill-ok lab-side-ok"/>` +
      `<line x1="87" y1="82" x2="179" y2="82" class="lab-side-ok"/>` +
      `<line x1="133" y1="36" x2="133" y2="128" class="lab-side-ok"/>` +
      `<text x="111" y="68" class="lab-text-small" text-anchor="middle">90°</text>` +
      `<text x="155" y="68" class="lab-text-small" text-anchor="middle">90°</text>` +
      `<text x="133" y="150" class="lab-text-ok" text-anchor="middle">4 · 90° → Laplace (je 1/4)</text>` +
      `<rect x="274" y="14" width="226" height="148" rx="8" class="lab-cell"/>` +
      `<circle cx="387" cy="82" r="46" class="lab-fill-b lab-side-b"/>` +
      `<line x1="341" y1="82" x2="433" y2="82" class="lab-side-b"/>` +
      `<line x1="387" y1="82" x2="387" y2="128" class="lab-side-b"/>` +
      `<text x="387" y="66" class="lab-text-b" text-anchor="middle">180°</text>` +
      `<text x="366" y="106" class="lab-text-small" text-anchor="middle">90°</text>` +
      `<text x="408" y="106" class="lab-text-small" text-anchor="middle">90°</text>` +
      `<text x="387" y="150" class="lab-text-bad" text-anchor="middle">Ungleich groß → kein Laplace</text>`,
  ),
  la5: fig(
    "Laplace-Formel P(E) = |E| / |Ω| und Gegenereignis P(Ē) = 1 − P(E)",
    `<rect x="20" y="18" width="214" height="138" rx="10" class="lab-cell"/>` +
      [0, 1, 2].map((i) => `<circle cx="${58 + i * 34}" cy="64" r="12" class="lab-ball-red"/>`).join("") +
      [0, 1].map((i) => `<circle cx="${160 + i * 34}" cy="64" r="12" class="lab-ball-blue"/>`).join("") +
      [0, 1, 2, 3, 4].map((i) => `<circle cx="${52 + i * 36}" cy="108" r="12" class="lab-fill-ok lab-side-ok"/>`).join("") +
      `<text x="127" y="144" class="lab-text-small" text-anchor="middle">3 rot, 2 blau, 5 grün (|Ω| = 10)</text>` +
      box(252, 22, 248, 130, "P(rot) = 3 / 10 = 0,30", "P(nicht rot) = 1 − 0,30 = 0,70", "lab-panel") +
      `<text x="376" y="130" class="lab-text-ok" text-anchor="middle">Summe: 0,30 + 0,70 = 1</text>`,
  ),
  la6: fig(
    "Baumdiagramm und Zählprinzip: 2 Stufen × 3 Stufen = 6 gleichwahrscheinliche Pfade",
    `<circle cx="48" cy="88" r="6" class="lab-point-a"/>` +
      `<line x1="54" y1="88" x2="178" y2="46" class="lab-side-a"/>` +
      `<line x1="54" y1="88" x2="178" y2="130" class="lab-side-b"/>` +
      `<text x="184" y="50" class="lab-text-a">K</text>` +
      `<text x="184" y="134" class="lab-text-b">Z</text>` +
      [24, 46, 68].map((y, i) => `<line x1="200" y1="46" x2="306" y2="${y}" class="lab-axis"/><text x="314" y="${y + 4}" class="lab-text-small">(K; ${i + 1})</text>`).join("") +
      [108, 130, 152].map((y, i) => `<line x1="200" y1="130" x2="306" y2="${y}" class="lab-axis"/><text x="314" y="${y + 4}" class="lab-text-small">(Z; ${i + 1})</text>`).join("") +
      box(376, 36, 128, 104, "|Ω| = 2 · 3 = 6", "je Pfad: 1 / 6", "lab-panel"),
  ),
  lg1: fig(
    "Zwei Bedingungen im Text liefern zwei lineare Gleichungen mit zwei Unbekannten",
    box(16, 20, 224, 58, "Satz 1: 2 Erw. + 3 Kinder = 29 €", "I: 2x + 3y = 29", "lab-fill-a lab-cell") +
      box(16, 94, 224, 58, "Satz 2: 1 Erw. + 2 Kinder = 17 €", "II: x + 2y = 17", "lab-fill-b lab-cell") +
      `<path d="M250 86 H290" class="lab-side-ok"/><polygon points="294,86 285,81 285,91" class="lab-point-ok"/>` +
      box(300, 34, 202, 104, "Variablen festlegen", "x = Preis Erw. (7 €)", "lab-panel") +
      `<text x="401" y="122" class="lab-text-ok" text-anchor="middle">y = Preis Kind (5 €)</text>`,
  ),
  lg2: fig(
    "Graphisches Lösen: beide Gleichungen nach y auflösen und Schnittpunkt S(2 | 3) ablesen",
    `<rect x="20" y="14" width="276" height="150" rx="8" class="lab-plot-bg lab-cell"/>` +
      miniAxes(84, 132, 34, 280, 22, 152) +
      `<line x1="48" y1="138" x2="244" y2="38" class="lab-curve"/>` +
      `<line x1="88" y1="24" x2="216" y2="148" class="lab-curve-2"/>` +
      `<circle cx="146" cy="88" r="5" class="lab-point-ok"/>` +
      `<text x="154" y="84" class="lab-text-ok">S(2 | 3)</text>` +
      box(312, 24, 188, 128, "I: y = x + 1", "II: y = −2x + 7", "lab-panel") +
      `<text x="406" y="128" class="lab-text-ok" text-anchor="middle">L = {(2 | 3)}</text>`,
  ),
  lg3: fig(
    "Einsetzungsverfahren: x = 5 − y in die andere Gleichung einsetzen",
    box(16, 24, 146, 114, "I: x = 5 − y", "aufgelöst nach x", "lab-fill-a lab-cell") +
      `<text x="175" y="84" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(188, 24, 174, 114, "II: 2(5 − y) − y = 4", "10 − 3y = 4 ⇒ y = 2", "lab-panel") +
      `<text x="375" y="84" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(388, 24, 116, 114, "x = 5 − 2 = 3", "L = {(3 | 2)}", "lab-fill-ok lab-cell"),
  ),
  lg4: fig(
    "Additionsverfahren: entgegengesetzte Koeffizienten (+y und −y) heben sich auf",
    box(18, 24, 184, 112, "I:  2x + y = 7", "II:  x − y = 2", "lab-panel") +
      `<text x="218" y="84" class="lab-text-big" text-anchor="middle">I+II</text>` +
      box(238, 24, 136, 112, "3x + 0 = 9", "x = 3", "lab-fill-a lab-cell") +
      `<text x="386" y="84" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(400, 24, 104, 112, "3 − y = 2", "y = 1", "lab-fill-ok lab-cell"),
  ),
  lg5: fig(
    "Drei Lösungsfälle eines 2×2-Systems: eindeutig, unlösbar oder unendlich viele",
    `<rect x="16" y="14" width="152" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      `<line x1="34" y1="120" x2="150" y2="44" class="lab-curve"/>` +
      `<line x1="34" y1="48" x2="150" y2="118" class="lab-curve-2"/>` +
      `<circle cx="92" cy="82" r="4.5" class="lab-point-ok"/>` +
      `<text x="92" y="148" class="lab-text-ok" text-anchor="middle">1 Lösung (S)</text>` +
      `<rect x="184" y="14" width="152" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      `<line x1="202" y1="112" x2="318" y2="46" class="lab-curve"/>` +
      `<line x1="202" y1="132" x2="318" y2="66" class="lab-curve-2"/>` +
      `<text x="260" y="148" class="lab-text-bad" text-anchor="middle">0 Lösungen (L = ∅)</text>` +
      `<rect x="352" y="14" width="152" height="148" rx="8" class="lab-plot-bg lab-cell"/>` +
      `<line x1="370" y1="118" x2="486" y2="48" class="lab-curve"/>` +
      `<line x1="370" y1="118" x2="486" y2="48" class="lab-curve-dashed"/>` +
      `<text x="428" y="148" class="lab-text-a" text-anchor="middle">∞ viele (identisch)</text>`,
  ),
  kz1: fig(
    "Abrollen eines Kreises (d = 2 cm): der Umfang U ist stets π-mal so lang wie d",
    `<circle cx="88" cy="76" r="34" class="lab-fill-a lab-side-a"/>` +
      `<line x1="54" y1="76" x2="122" y2="76" class="lab-side-b"/>` +
      `<text x="88" y="68" class="lab-text-b" text-anchor="middle">d = 2 cm</text>` +
      `<line x1="88" y1="110" x2="366" y2="110" class="lab-side-ok"/>` +
      `<circle cx="88" cy="110" r="3.5" class="lab-point-ok"/>` +
      `<circle cx="366" cy="110" r="3.5" class="lab-point-ok"/>` +
      `<text x="227" y="132" class="lab-text-ok" text-anchor="middle">U = π · d ≈ 3,14 · 2 cm ≈ 6,28 cm</text>` +
      `<text x="260" y="156" class="lab-text-small" text-anchor="middle">Für jeden Kreis gilt: U / d = π ≈ 3,14</text>`,
  ),
  kz2: fig(
    "Kreisfläche A = π · r²: Umlegen in ein fast rechteckiges Streifenmuster (πr mal r)",
    `<circle cx="96" cy="78" r="46" class="lab-fill-a lab-side-a"/>` +
      `<line x1="96" y1="78" x2="142" y2="78" class="lab-side-b"/>` +
      `<text x="119" y="70" class="lab-text-b" text-anchor="middle">r</text>` +
      `<text x="174" y="84" class="lab-text-big" text-anchor="middle">≈</text>` +
      `<rect x="206" y="42" width="160" height="72" class="lab-fill-ok lab-side-ok"/>` +
      `<text x="286" y="34" class="lab-text-ok" text-anchor="middle">halber Umfang: π · r</text>` +
      `<text x="374" y="82" class="lab-text-b">r</text>` +
      box(398, 40, 108, 76, "A = π · r²", "2r → 4 · A", "lab-panel") +
      `<text x="260" y="152" class="lab-text-small" text-anchor="middle">Nicht linear: Verdoppelt man r, vervierfacht sich A.</text>`,
  ),
  kz3: fig(
    "Kreissektor (r = 4 cm, α = 90°) und Kreisring (R = 5 cm, r = 3 cm)",
    `<path d="M126 112 L174 112 A48 48 0 0 0 126 64 Z" class="lab-fill-a lab-side-a"/>` +
      `<circle cx="126" cy="112" r="48" class="lab-dashed"/>` +
      `<text x="144" y="102" class="lab-text-a">90°</text>` +
      `<text x="126" y="42" class="lab-text-small" text-anchor="middle">b = 2πr · α/360°</text>` +
      `<circle cx="330" cy="90" r="52" class="lab-fill-b lab-side-b"/>` +
      `<circle cx="330" cy="90" r="28" class="lab-plot-bg lab-side-a"/>` +
      `<text x="330" y="158" class="lab-text-b" text-anchor="middle">A_Ring = π · (R² − r²) = 16π</text>`,
  ),
  kz4: fig(
    "Schrägbild und Netz des geraden Kreiszylinders: zwei Grundkreise + Mantelrechteck (2πr · h)",
    `<ellipse cx="86" cy="48" rx="34" ry="11" class="lab-fill-ok lab-side-ok"/>` +
      `<line x1="52" y1="48" x2="52" y2="112" class="lab-side-ok"/>` +
      `<line x1="120" y1="48" x2="120" y2="112" class="lab-side-ok"/>` +
      `<path d="M52 112 A34 11 0 0 0 120 112" class="lab-side-ok"/>` +
      `<path d="M52 112 A34 11 0 0 1 120 112" class="lab-dashed"/>` +
      `<text x="86" y="144" class="lab-text-ok" text-anchor="middle">Schrägbild</text>` +
      `<circle cx="240" cy="36" r="22" class="lab-net"/>` +
      `<rect x="190" y="64" width="160" height="58" class="lab-net"/>` +
      `<circle cx="240" cy="148" r="22" class="lab-net"/>` +
      `<text x="270" y="98" class="lab-text-a" text-anchor="middle">Mantel M = 2πr · h</text>` +
      box(372, 42, 132, 92, "O = 2·G + M", "2πr² + 2πr·h", "lab-panel"),
  ),
  kz5: fig(
    "Zylinder als Grenzfall gerader Prismen: V = G · h gilt für alle Querschnitte",
    `<polygon points="56,120 116,120 132,102 72,102" class="lab-fill-a lab-side-a"/>` +
      `<polygon points="56,52 116,52 132,34 72,34" class="lab-fill-a lab-side-a"/>` +
      `<line x1="56" y1="52" x2="56" y2="120" class="lab-side-a"/>` +
      `<line x1="116" y1="52" x2="116" y2="120" class="lab-side-a"/>` +
      `<line x1="132" y1="34" x2="132" y2="102" class="lab-side-a"/>` +
      `<text x="94" y="148" class="lab-text-a" text-anchor="middle">Prisma: G · h</text>` +
      `<text x="166" y="84" class="lab-text-big" text-anchor="middle">→</text>` +
      `<ellipse cx="238" cy="48" rx="34" ry="11" class="lab-fill-ok lab-side-ok"/>` +
      `<line x1="204" y1="48" x2="204" y2="116" class="lab-side-ok"/>` +
      `<line x1="272" y1="48" x2="272" y2="116" class="lab-side-ok"/>` +
      `<path d="M204 116 A34 11 0 0 0 272 116" class="lab-side-ok"/>` +
      `<text x="238" y="148" class="lab-text-ok" text-anchor="middle">Zylinder: πr² · h</text>` +
      box(306, 40, 194, 88, "Vieleck-Ecken n → ∞", "G_n → πr², V = πr² · h", "lab-panel"),
  ),
  kz6: fig(
    "Modellieren mit Körpern: zerlegen in bekannte Grundkörper, Maße prüfen, dokumentieren",
    box(16, 26, 134, 108, "1. Skizze & Annahme", "Quader + Zylinder", "lab-cell") +
      `<text x="164" y="84" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(178, 26, 166, 108, "2. Einheiten angleichen", "V_ges = V₁ + V₂", "lab-panel") +
      `<text x="358" y="84" class="lab-text-big" text-anchor="middle">➔</text>` +
      box(372, 26, 132, 108, "3. Plausibel?", "Runden & Satz", "lab-fill-ok lab-cell") +
      `<text x="260" y="158" class="lab-text-small" text-anchor="middle">Bei Oberflächen gilt: Verdeckte Klebeflächen zählen nicht mit!</text>`,
  ),
} as const;
