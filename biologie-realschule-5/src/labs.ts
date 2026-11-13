import { esc } from "./practice";

export type LabKind = "microscope" | "cellCompare" | "torso" | "armLever";
export type Specimen = "onion" | "cheek";
export type CellType = "plant" | "animal";
export type CellPart =
	| "all"
	| "zellmembran"
	| "zellplasma"
	| "zellkern"
	| "zellwand"
	| "chloroplasten"
	| "vakuole";
export type OrganSystemId =
	| "bewegung"
	| "atmung"
	| "kreislauf"
	| "verdauung"
	| "nerven"
	| "ausscheidung"
	| "fortpflanzung";

export interface LabState {
	okular: 5 | 10;
	objektiv: 4 | 10 | 40;
	focus: number;
	specimen: Specimen;
	cellType: CellType;
	part: CellPart;
	showCompare: boolean;
	system: OrganSystemId;
	showCoop: boolean;
	angle: number;
	showLabels: boolean;
}

export const freshLab = (): LabState => ({
	okular: 10,
	objektiv: 4,
	focus: 2,
	specimen: "onion",
	cellType: "plant",
	part: "all",
	showCompare: false,
	system: "bewegung",
	showCoop: false,
	angle: 120,
	showLabels: false,
});

export interface LabGoal {
	label: string;
	done: boolean;
}

/** Computes total magnification of a light microscope (okular * objektiv). */
export function totalMagnification(okular: number, objektiv: number): number {
	if (![5, 10].includes(okular) || ![4, 10, 40].includes(objektiv)) {
		throw new Error("Invalid magnification");
	}
	return okular * objektiv;
}

/** Returns focus distance and sharpness for the selected objective lens. */
export function focusSharpness(
	objektiv: 4 | 10 | 40,
	focus: number,
): { target: number; distance: number; isSharp: boolean } {
	if (!Number.isInteger(focus) || focus < 0 || focus > 10) {
		throw new Error("Invalid focus setting");
	}
	const target = objektiv === 4 ? 6 : objektiv === 10 ? 7 : 8;
	const distance = Math.abs(focus - target);
	return { target, distance, isSharp: distance === 0 };
}

export interface CellStructureInfo {
	id: Exclude<CellPart, "all">;
	name: string;
	group: "gemeinsam" | "pflanze";
	role: string;
}

const ALL_CELL_STRUCTURES: CellStructureInfo[] = [
	{
		id: "zellmembran",
		name: "Zellmembran",
		group: "gemeinsam",
		role: "Umschließt die Zelle als dünne Hülle und regelt den Stoffaustausch.",
	},
	{
		id: "zellplasma",
		name: "Zellplasma",
		group: "gemeinsam",
		role: "Füllt den Zellinnenraum aus und bettet die Zellbestandteile ein.",
	},
	{
		id: "zellkern",
		name: "Zellkern",
		group: "gemeinsam",
		role: "Steuert wichtige Lebensvorgänge der Zelle.",
	},
	{
		id: "zellwand",
		name: "Zellwand",
		group: "pflanze",
		role: "Feste äußere Hülle, die der Pflanzenzelle Halt und Form gibt.",
	},
	{
		id: "chloroplasten",
		name: "Chloroplasten",
		group: "pflanze",
		role: "Grüne Zellbestandteile, mit denen grüne Pflanzenteile mithilfe von Licht Nährstoffe bilden.",
	},
	{
		id: "vakuole",
		name: "Vakuole",
		group: "pflanze",
		role: "Großer Zellsaftraum für Wasser, Nährstoffe und Innendruck.",
	},
];

/** Returns cell structures present in the selected plant or animal cell. */
export function cellStructures(cellType: CellType): CellStructureInfo[] {
	if (cellType !== "plant" && cellType !== "animal") {
		throw new Error("Invalid cell type");
	}
	return cellType === "plant"
		? ALL_CELL_STRUCTURES
		: ALL_CELL_STRUCTURES.filter((item) => item.group === "gemeinsam");
}

export type OrganRegion =
	| "skeleton"
	| "head"
	| "spine"
	| "chest"
	| "abdomen"
	| "pelvis";

export interface OrganSystemInfo {
	id: OrganSystemId;
	name: string;
	organs: string;
	task: string;
	cooperation: string;
	regions: OrganRegion[];
}

export const ORGAN_SYSTEMS: Record<OrganSystemId, OrganSystemInfo> = {
	bewegung: {
		id: "bewegung",
		name: "Bewegungs- und Stützapparat",
		organs: "Knochen, Gelenke, Muskeln, Sehnen, Bänder",
		task: "Stützt den Körper, schützt innere Organe und ermöglicht Bewegungen.",
		cooperation:
			"Das Nervensystem sendet Bewegungssignale an die Muskeln; das Herz-Kreislauf-System liefert Sauerstoff und Nährstoffe.",
		regions: ["skeleton"],
	},
	atmung: {
		id: "atmung",
		name: "Atmungssystem",
		organs: "Nase, Rachen, Kehlkopf, Luftröhre, Bronchien, Lunge",
		task: "Nimmt Sauerstoff aus der Atemluft auf und gibt Kohlenstoffdioxid ab.",
		cooperation:
			"Der aufgenommene Sauerstoff gelangt in der Lunge ins Blut und wird vom Herz-Kreislauf-System weitertransportiert.",
		regions: ["chest"],
	},
	kreislauf: {
		id: "kreislauf",
		name: "Herz-Kreislauf-System",
		organs: "Herz und Blutgefäße",
		task: "Pumpt Blut durch den Körper und transportiert Sauerstoff sowie Nährstoffe.",
		cooperation:
			"Verbindet Lunge, Verdauungstrakt, Nieren und Muskeln als gemeinsames Transportnetz.",
		regions: ["chest"],
	},
	verdauung: {
		id: "verdauung",
		name: "Verdauungssystem",
		organs: "Mund, Speiseröhre, Magen, Dünndarm, Dickdarm",
		task: "Zerkleinert Nahrung, zerlegt sie in verwertbare Bestandteile und nimmt Nährstoffe auf.",
		cooperation:
			"Die aufgenommenen Nährstoffe gelangen über das Blut zu Muskeln, Gehirn und allen Organen.",
		regions: ["abdomen"],
	},
	nerven: {
		id: "nerven",
		name: "Nervensystem",
		organs: "Gehirn, Rückenmark und Nerven",
		task: "Nimmt Reize auf, verarbeitet Informationen und steuert Reaktionen des Körpers.",
		cooperation:
			"Koordiniert Bewegungen, Atmung und Reaktionen auf die Umwelt mit allen anderen Organsystemen.",
		regions: ["head", "spine"],
	},
	ausscheidung: {
		id: "ausscheidung",
		name: "Ausscheidungssystem",
		organs: "Nieren, Harnleiter, Harnblase",
		task: "Filtert überschüssige und nicht mehr benötigte Stoffe aus dem Blut und scheidet Harn aus.",
		cooperation:
			"Arbeitet eng mit dem Blutkreislauf zusammen, um den Wasser- und Stoffhaushalt im Gleichgewicht zu halten.",
		regions: ["abdomen", "pelvis"],
	},
	fortpflanzung: {
		id: "fortpflanzung",
		name: "Fortpflanzungssystem",
		organs: "Keimdrüsen und zugehörige innere Geschlechtsorgane",
		task: "Bildet Keimzellen und ermöglicht die Entstehung von Nachkommen.",
		cooperation:
			"Wird vom Gehirn über Botenstoffe gesteuert und vom Herz-Kreislauf-System versorgt.",
		regions: ["pelvis"],
	},
};

/** Computes antagonistic biceps and triceps state from elbow angle (40–170°). */
export function armState(angle: number): {
	angle: number;
	pose: "gebeugt" | "mittel" | "gestreckt";
	biceps: string;
	triceps: string;
} {
	if (!Number.isInteger(angle) || angle < 40 || angle > 170) {
		throw new Error("Invalid elbow angle");
	}
	if (angle <= 80) {
		return {
			angle,
			pose: "gebeugt",
			biceps: "spannt an (zieht den Unterarm hoch)",
			triceps: "entspannt (wird passiv gedehnt)",
		};
	}
	if (angle >= 150) {
		return {
			angle,
			pose: "gestreckt",
			biceps: "entspannt (wird passiv gedehnt)",
			triceps: "spannt an (zieht den Unterarm gerade)",
		};
	}
	return {
		angle,
		pose: "mittel",
		biceps: "leicht gespannt (hält die Beugeposition)",
		triceps: "weitgehend locker",
	};
}

/** Evaluates the three discovery goals for each interactive lab. */
export function labGoals(kind: LabKind, state: LabState): LabGoal[] {
	if (kind === "microscope") {
		const mag = totalMagnification(state.okular, state.objektiv);
		const sharp = focusSharpness(state.objektiv, state.focus).isSharp;
		return [
			{
				label: "Übersicht scharf einstellen (40-fach, Fokus 6)",
				done: mag === 40 && sharp,
			},
			{
				label: "400-fache Gesamtvergrößerung scharf einstellen",
				done: mag === 400 && sharp,
			},
			{
				label: "Tierische Zelle (Mundschleimhaut) scharf betrachten",
				done: state.specimen === "cheek" && sharp,
			},
		];
	}
	if (kind === "cellCompare") {
		return [
			{
				label: "Tierzelle im Vergleich ansehen",
				done: state.cellType === "animal",
			},
			{
				label:
					"Einen reinen Pflanzen-Bestandteil (Zellwand, Chloroplasten oder Vakuole) auswählen",
				done: ["zellwand", "chloroplasten", "vakuole"].includes(state.part),
			},
			{
				label: "Gemeinsamkeiten und Unterschiede einblenden",
				done: state.showCompare,
			},
		];
	}
	if (kind === "torso") {
		return [
			{
				label:
					"Ein Versorgungssystem (Atmung, Herz-Kreislauf oder Verdauung) erkunden",
				done: ["atmung", "kreislauf", "verdauung"].includes(state.system),
			},
			{
				label: "Das Steuerungssystem (Nervensystem) auswählen",
				done: state.system === "nerven",
			},
			{
				label: "Die Zusammenarbeit der Organsysteme einblenden",
				done: state.showCoop,
			},
		];
	}
	return [
		{
			label: "Den Arm deutlich beugen (Winkel ≤ 70°)",
			done: state.angle <= 70,
		},
		{
			label: "Den Arm weit strecken (Winkel ≥ 160°)",
			done: state.angle >= 160,
		},
		{
			label: "Sehnen, Gelenk und Zugrichtung einblenden",
			done: state.showLabels,
		},
	];
}

function renderGoals(goals: LabGoal[]): string {
	return `<ul class="lab-goals" aria-label="Entdeckerziele">${goals
		.map(
			(g) =>
				`<li class="${g.done ? "goal-done" : ""}"><span aria-hidden="true">${g.done ? "✓" : "○"}</span><span>${esc(g.label)}</span></li>`,
		)
		.join("")}</ul>`;
}

function microscopeOutput(state: LabState): string {
	const mag = totalMagnification(state.okular, state.objektiv);
	const { distance, isSharp } = focusSharpness(state.objektiv, state.focus);
	const scale = mag === 20 ? 0.8 : mag === 40 ? 1 : mag === 50 ? 1.15 : mag === 100 ? 1.35 : mag === 200 ? 1.7 : 2.1;
	const blurAttr = distance > 0 ? `style="filter:blur(${Math.min(6, distance * 1.4).toFixed(1)}px)"` : "";
	const specimenName =
		state.specimen === "onion"
			? "Zwiebelhaut (Pflanzenzellen)"
			: "Mundschleimhaut (Tierzellen)";
	const cellsSvg =
		state.specimen === "onion"
			? `<g transform="translate(320 120) scale(${scale}) translate(-120 -60)">
          <rect x="20" y="15" width="95" height="45" fill="none" stroke="var(--accent)" stroke-width="3"/>
          <rect x="115" y="15" width="95" height="45" fill="none" stroke="var(--accent)" stroke-width="3"/>
          <rect x="20" y="60" width="95" height="45" fill="none" stroke="var(--accent)" stroke-width="3"/>
          <rect x="115" y="60" width="95" height="45" fill="none" stroke="var(--accent)" stroke-width="3"/>
          <circle cx="55" cy="36" r="7" fill="var(--gold)"/>
          <circle cx="155" cy="40" r="7" fill="var(--gold)"/>
          <circle cx="80" cy="84" r="7" fill="var(--gold)"/>
          <circle cx="170" cy="80" r="7" fill="var(--gold)"/>
        </g>`
			: `<g transform="translate(320 120) scale(${scale}) translate(-100 -55)">
          <ellipse cx="62" cy="48" rx="34" ry="22" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.5"/>
          <circle cx="62" cy="48" r="7" fill="var(--gold)"/>
          <ellipse cx="140" cy="64" rx="32" ry="24" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.5"/>
          <circle cx="142" cy="62" r="7" fill="var(--gold)"/>
        </g>`;

	return `${renderGoals(labGoals("microscope", state))}
    <svg class="bio-chart" viewBox="0 0 640 240" role="img" aria-label="Blick durch das Lichtmikroskop: ${esc(specimenName)} bei ${mag}-facher Vergrößerung">
      <defs><clipPath id="microscope-lens"><circle cx="320" cy="120" r="102"/></clipPath></defs>
      <circle cx="320" cy="120" r="105" fill="var(--surface)" stroke="var(--line)" stroke-width="4"/>
      <g clip-path="url(#microscope-lens)" ${blurAttr}>${cellsSvg}</g>
      <text x="16" y="28">${mag}-fach (${state.okular} · ${state.objektiv})</text>
      <text x="16" y="224">${isSharp ? "Bild scharf eingestellt" : "Unscharf · Fokus anpassen"}</text>
    </svg>
    <div class="table-scroll"><table><caption>Einstellung am Mikroskop</caption>
      <tbody>
        <tr><th scope="row">Präparat</th><td>${esc(specimenName)}</td></tr>
        <tr><th scope="row">Okular · Objektiv</th><td>${state.okular} · ${state.objektiv} = ${mag}-fach</td></tr>
        <tr><th scope="row">Schärfe</th><td>${isSharp ? "Scharf (Zellkern sichtbar)" : "Noch unscharf — Grob- oder Feintrieb verstellen"}</td></tr>
      </tbody>
    </table></div>
    <p class="small">Schematische Ansicht. Beim echten Mikroskopieren beginnst du immer mit der kleinsten Objektivvergrößerung.</p>`;
}

function cellCompareOutput(state: LabState): string {
	const list = cellStructures(state.cellType);
	const highlight = (id: CellPart) =>
		state.part === id ? "var(--gold)" : "var(--accent)";
	const strokeW = (id: CellPart) => (state.part === id ? "4.5" : "2.5");
	const svg =
		state.cellType === "plant"
			? `<svg class="bio-chart" viewBox="0 0 640 240" role="img" aria-label="Schema einer Pflanzenzelle">
          <rect x="200" y="25" width="370" height="190" rx="18" fill="var(--surface)" stroke="${highlight("zellwand")}" stroke-width="${strokeW("zellwand")}"/>
          <rect x="214" y="39" width="342" height="162" rx="12" fill="var(--accent-soft)" stroke="${highlight("zellmembran")}" stroke-width="${strokeW("zellmembran")}"/>
          <rect x="305" y="65" width="185" height="105" rx="28" fill="var(--bg)" stroke="${highlight("vakuole")}" stroke-width="${strokeW("vakuole")}"/>
          <circle cx="258" cy="95" r="24" fill="var(--surface)" stroke="${highlight("zellkern")}" stroke-width="${strokeW("zellkern")}"/>
          <ellipse cx="255" cy="160" rx="18" ry="10" fill="var(--surface)" stroke="${highlight("chloroplasten")}" stroke-width="${strokeW("chloroplasten")}"/>
          <ellipse cx="520" cy="95" rx="16" ry="9" fill="var(--surface)" stroke="${highlight("chloroplasten")}" stroke-width="${strokeW("chloroplasten")}"/>
          <ellipse cx="516" cy="158" rx="18" ry="10" fill="var(--surface)" stroke="${highlight("chloroplasten")}" stroke-width="${strokeW("chloroplasten")}"/>
          <text x="16" y="30">Pflanzenzelle</text>
          <text x="16" y="48">(mit Zellwand)</text>
          <text x="258" y="99" text-anchor="middle">Zellkern</text>
          <text x="397" y="122" text-anchor="middle">Vakuole</text>
        </svg>`
			: `<svg class="bio-chart" viewBox="0 0 640 240" role="img" aria-label="Schema einer Tierzelle">
          <ellipse cx="370" cy="120" rx="165" ry="88" fill="var(--accent-soft)" stroke="${highlight("zellmembran")}" stroke-width="${strokeW("zellmembran")}"/>
          <circle cx="355" cy="118" r="28" fill="var(--surface)" stroke="${highlight("zellkern")}" stroke-width="${strokeW("zellkern")}"/>
          <text x="16" y="30">Tierzelle</text>
          <text x="16" y="48">(ohne Zellwand)</text>
          <text x="355" y="122" text-anchor="middle">Zellkern</text>
          <text x="455" y="150" text-anchor="middle">Zellplasma</text>
        </svg>`;
	const selected =
		state.part === "all"
			? null
			: ALL_CELL_STRUCTURES.find((item) => item.id === state.part);
	return `${renderGoals(labGoals("cellCompare", state))}${svg}
    ${selected ? `<div class="lab-summary"><h3>${esc(selected.name)}</h3><p>${esc(selected.role)}${state.cellType === "animal" && selected.group === "pflanze" ? " Kommt in Tierzellen nicht vor." : ""}</p></div>` : ""}
    <div class="table-scroll"><table><caption>Bestandteile der ${state.cellType === "plant" ? "Pflanzenzelle" : "Tierzelle"}</caption>
      <thead><tr><th>Bestandteil</th>${state.showCompare ? "<th>Gruppe</th>" : ""}<th>Aufgabe</th></tr></thead>
      <tbody>${list
				.map(
					(s) =>
						`<tr><th scope="row">${esc(s.name)}</th>${state.showCompare ? `<td>${s.group === "gemeinsam" ? "Tier- und Pflanzenzelle" : "Nur Pflanzenzelle"}</td>` : ""}<td>${esc(s.role)}</td></tr>`,
				)
				.join("")}</tbody>
    </table></div>`;
}

function torsoOutput(state: LabState): string {
	const info = ORGAN_SYSTEMS[state.system];
	const regionHighlight = (region: OrganRegion) =>
		info.regions.includes(region) ? "var(--accent)" : "var(--line)";
	const fillFor = (region: OrganRegion) =>
		info.regions.includes(region) ? "var(--accent-soft)" : "var(--surface)";
	return `${renderGoals(labGoals("torso", state))}
    <svg class="bio-chart" viewBox="0 0 640 240" role="img" aria-label="Schematischer Torso: ${esc(info.name)}">
      <circle cx="320" cy="36" r="22" fill="${fillFor("head")}" stroke="${regionHighlight("head")}" stroke-width="2.5"/>
      <line x1="302" y1="50" x2="254" y2="68" stroke="${regionHighlight("spine")}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="246" y="68" width="16" height="122" rx="6" fill="${fillFor("spine")}" stroke="${regionHighlight("spine")}" stroke-width="2.5"/>
      <rect x="274" y="66" width="92" height="135" rx="22" fill="${fillFor("skeleton")}" stroke="${regionHighlight("skeleton")}" stroke-width="2.5"/>
      <rect x="284" y="74" width="72" height="46" rx="12" fill="${fillFor("chest")}" stroke="${regionHighlight("chest")}" stroke-width="2.5"/>
      <rect x="284" y="126" width="72" height="40" rx="10" fill="${fillFor("abdomen")}" stroke="${regionHighlight("abdomen")}" stroke-width="2.5"/>
      <rect x="288" y="170" width="64" height="24" rx="8" fill="${fillFor("pelvis")}" stroke="${regionHighlight("pelvis")}" stroke-width="2.5"/>
      <text x="20" y="34">${esc(info.name)}</text>
      <text x="236" y="133" text-anchor="end">Wirbelkanal</text>
      <text x="320" y="102" text-anchor="middle">Brustraum</text>
      <text x="320" y="151" text-anchor="middle">Bauchraum</text>
      <text x="320" y="186" text-anchor="middle">Becken</text>
    </svg>
    <div class="lab-summary">
      <h3>${esc(info.name)}</h3>
      <p><strong>Wichtige Organe:</strong> ${esc(info.organs)}</p>
      <p><strong>Aufgabe:</strong> ${esc(info.task)}</p>
      ${state.showCoop ? `<p><strong>Arbeitsteilung:</strong> ${esc(info.cooperation)}</p>` : ""}
    </div>`;
}

function armLeverOutput(state: LabState): string {
	const info = armState(state.angle);
	const rad = ((180 - state.angle) * Math.PI) / 180;
	const elbowX = 240;
	const elbowY = 155;
	const handX = Math.round(elbowX + Math.cos(rad) * 165);
	const handY = Math.round(elbowY - Math.sin(rad) * 165);
	const bicepsThick = state.angle <= 80 ? 15 : state.angle >= 150 ? 7 : 11;
	const tricepsThick = state.angle >= 150 ? 14 : state.angle <= 80 ? 7 : 10;
	return `${renderGoals(labGoals("armLever", state))}
    <svg class="bio-chart" viewBox="0 0 640 240" role="img" aria-label="Armmodell bei ${state.angle} Grad Ellbogenwinkel">
      <line x1="115" y1="65" x2="${elbowX}" y2="${elbowY}" stroke="var(--muted)" stroke-width="10" stroke-linecap="round"/>
      <line x1="${elbowX}" y1="${elbowY}" x2="${handX}" y2="${handY}" stroke="var(--muted)" stroke-width="8" stroke-linecap="round"/>
      <path d="M135 55 Q185 88 ${elbowX + 20} ${elbowY - 12}" fill="none" stroke="var(--accent)" stroke-width="${bicepsThick}" stroke-linecap="round"/>
      <path d="M120 82 Q165 130 ${elbowX - 10} ${elbowY + 14}" fill="none" stroke="var(--gold)" stroke-width="${tricepsThick}" stroke-linecap="round"/>
      <circle cx="${elbowX}" cy="${elbowY}" r="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.5"/>
      <text x="20" y="30">Winkel: ${state.angle}° (${info.pose})</text>
      <text x="155" y="45">Bizeps (Beuger)</text>
      <text x="105" y="165">Trizeps (Strecker)</text>
      ${state.showLabels ? `<text x="${elbowX + 18}" y="${elbowY + 26}">Gelenkkapsel &amp; Knorpel</text><text x="380" y="30">Sehne überträgt Muskelzug auf Knochen</text>` : ""}
    </svg>
    <div class="table-scroll"><table><caption>Gegenspielerprinzip im Arm</caption>
      <tbody>
        <tr><th scope="row">Bizeps (Beuger)</th><td>${esc(info.biceps)}</td></tr>
        <tr><th scope="row">Trizeps (Strecker)</th><td>${esc(info.triceps)}</td></tr>
        <tr><th scope="row">Grundregel</th><td>Muskeln können nur aktiv ziehen (sich verkürzen), nie aktiv drücken.</td></tr>
      </tbody>
    </table></div>`;
}

function output(kind: LabKind, state: LabState): string {
	if (kind === "microscope") return microscopeOutput(state);
	if (kind === "cellCompare") return cellCompareOutput(state);
	if (kind === "torso") return torsoOutput(state);
	return armLeverOutput(state);
}

const TITLES: Record<LabKind, string> = {
	microscope: "Lichtmikroskop ausprobieren",
	cellCompare: "Pflanzen- und Tierzelle vergleichen",
	torso: "Organsysteme am Torso erkunden",
	armLever: "Beuger und Strecker testen",
};

export function renderLab(kind: LabKind, state: LabState): string {
	let controls = "";
	if (kind === "microscope") {
		controls = `<label>Präparat<select data-lab="specimen">
        <option value="onion" ${state.specimen === "onion" ? "selected" : ""}>Zwiebelhaut (Pflanzenzelle)</option>
        <option value="cheek" ${state.specimen === "cheek" ? "selected" : ""}>Mundschleimhaut (Tierzelle)</option>
      </select></label>
      <label>Okular<select data-lab="okular">
        <option value="5" ${state.okular === 5 ? "selected" : ""}>5-fach</option>
        <option value="10" ${state.okular === 10 ? "selected" : ""}>10-fach</option>
      </select></label>
      <label>Objektiv<select data-lab="objektiv">
        <option value="4" ${state.objektiv === 4 ? "selected" : ""}>4-fach (Übersicht)</option>
        <option value="10" ${state.objektiv === 10 ? "selected" : ""}>10-fach (mittel)</option>
        <option value="40" ${state.objektiv === 40 ? "selected" : ""}>40-fach (stark)</option>
      </select></label>
      <label>Fokus (Grob-/Feintrieb): <output data-value="focus">${state.focus}</output>
        <input type="range" aria-label="Fokus einstellen" data-lab="focus" min="0" max="10" step="1" value="${state.focus}">
      </label>`;
	} else if (kind === "cellCompare") {
		controls = `<label>Zelltyp<select data-lab="cellType">
        <option value="plant" ${state.cellType === "plant" ? "selected" : ""}>Pflanzenzelle</option>
        <option value="animal" ${state.cellType === "animal" ? "selected" : ""}>Tierzelle</option>
      </select></label>
      <label>Bestandteil<select data-lab="part">
        <option value="all" ${state.part === "all" ? "selected" : ""}>Alle Bestandteile</option>
        ${ALL_CELL_STRUCTURES.map(
					(item) =>
						`<option value="${item.id}" ${state.part === item.id ? "selected" : ""}>${esc(item.name)}</option>`,
				).join("")}
      </select></label>
      <label class="lab-check"><input type="checkbox" data-lab="showCompare" ${state.showCompare ? "checked" : ""}><span>Gemeinsamkeiten und Unterschiede anzeigen</span></label>`;
	} else if (kind === "torso") {
		controls = `<label>Organsystem<select data-lab="system">
        ${Object.values(ORGAN_SYSTEMS)
					.map(
						(sys) =>
							`<option value="${sys.id}" ${state.system === sys.id ? "selected" : ""}>${esc(sys.name)}</option>`,
					)
					.join("")}
      </select></label>
      <label class="lab-check"><input type="checkbox" data-lab="showCoop" ${state.showCoop ? "checked" : ""}><span>Zusammenarbeit der Organsysteme zeigen</span></label>`;
	} else {
		controls = `<label>Ellbogenwinkel: <output data-value="angle">${state.angle}°</output>
        <input type="range" aria-label="Ellbogenwinkel in Grad" data-lab="angle" min="40" max="170" step="10" value="${state.angle}">
      </label>
      <label class="lab-check"><input type="checkbox" data-lab="showLabels" ${state.showLabels ? "checked" : ""}><span>Sehnen und Gelenkhinweise einblenden</span></label>`;
	}

	return `<section class="panel lab" id="lab"><div class="eyebrow">Ausprobieren</div><h2>${TITLES[kind]}</h2><p>Erreiche die drei Entdeckerziele und beschreibe, was du beobachtest.</p><div class="lab-controls">${controls}</div><div data-lab-output>${output(kind, state)}</div></section>`;
}

export function mountLab(
	host: HTMLElement,
	kind: LabKind,
	state: LabState,
): void {
	host
		.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-lab]")
		.forEach((control) => {
			control.addEventListener("input", () => {
				const key = control.dataset.lab;
				if (key === "okular")
					state.okular = Number(control.value) === 5 ? 5 : 10;
				if (key === "objektiv") {
					const val = Number(control.value);
					state.objektiv = val === 40 ? 40 : val === 10 ? 10 : 4;
				}
				if (key === "focus" || key === "angle")
					state[key] = Number(control.value);
				if (key === "specimen") state.specimen = control.value as Specimen;
				if (key === "cellType") state.cellType = control.value as CellType;
				if (key === "part") state.part = control.value as CellPart;
				if (key === "system") state.system = control.value as OrganSystemId;
				if (
					(key === "showCompare" ||
						key === "showCoop" ||
						key === "showLabels") &&
					control instanceof HTMLInputElement
				) {
					state[key] = control.checked;
				}
				host.querySelector<HTMLElement>("[data-lab-output]")!.innerHTML =
					output(kind, state);
				host
					.querySelectorAll<HTMLOutputElement>("[data-value]")
					.forEach((o) => {
						o.value =
							o.dataset.value === "angle"
								? `${state.angle}°`
								: String(state.focus);
					});
				// Controls remain mounted, so range input keeps keyboard focus.
			});
		});
}
