import type { LabKind } from "../model/types";
import { fmtDe, LABS, type LabState } from "../lab-model";
import { esc } from "../workshop";

const text = (x: number, y: number, value: string, cls = "diagram-label") =>
	`<text x="${x}" y="${y}" text-anchor="middle" class="${cls}">${esc(value)}</text>`;
const box = (x: number, y: number, w: number, h: number, cls = "diagram-box") =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" class="${cls}"/>`;
const arrow = (x: number, y: number, end: number, endY = y) => {
	const a = Math.atan2(endY - y, end - x);
	return `<g class="diagram-arrow"><path d="M${x},${y}L${end},${endY}"/><polygon points="${end},${endY} ${end - 9 * Math.cos(a - 0.5)},${endY - 9 * Math.sin(a - 0.5)} ${end - 9 * Math.cos(a + 0.5)},${endY - 9 * Math.sin(a + 0.5)}"/></g>`;
};
const atom = (x: number, y: number, e: "H" | "O", r = 19) =>
	`<circle cx="${x}" cy="${y}" r="${r}" class="atom-${e}"/>${text(x, y + 6, e, "atom-label")}`;
function molecule(x: number, y: number, formula = "water", scale = 1): string {
	const body =
		formula === "water"
			? atom(0, 0, "O") + atom(-27, 24, "H", 15) + atom(27, 24, "H", 15)
			: atom(-16, 0, formula === "hydrogen" ? "H" : "O") +
				atom(16, 0, formula === "hydrogen" ? "H" : "O");
	return `<g transform="translate(${x},${y}) scale(${scale})">${body}</g>`;
}
const tree = (x: number, y: number) =>
	`<path d="M${x},${y}v62" class="tree-trunk"/><circle cx="${x}" cy="${y - 9}" r="35" class="leaf"/><circle cx="${x - 28}" cy="${y + 9}" r="24" class="leaf"/><circle cx="${x + 28}" cy="${y + 9}" r="24" class="leaf"/>`;

/** Drawings are schematics, with model limits and an equivalent prose explanation. */
export function drawScene(kind: LabKind, s: LabState): string {
	const m = s.mode;
	let b = "";
	if (kind === "inquiry") {
		b =
			m === "plot" || m === "infer"
				? `<path d="M80,30V205H535" class="chart-axis"/>${[
						[20, 120],
						[40, 75],
						[60, 40],
					]
						.map(
							([t, v]) =>
								`<circle cx="${80 + t * 6}" cy="${205 - v * 1.2}" r="7" class="chart-dot"/>${text(80 + t * 6, 228, String(t))}${text(110 + t * 6, 190 - v * 1.2, `${v} s`, "diagram-small")}`,
						)
						.join(
							"",
						)}${text(300, 255, "Temperatur in °C →", "diagram-small")}${text(100, 20, "Zeit in s", "diagram-small")}`
				: [20, 40, 60]
						.map(
							(t, i) =>
								`${box(30 + i * 200, 60, 140, 135)}${text(100 + i * 200, 103, `${t} °C`)}${text(100 + i * 200, 150, `${[120, 75, 40][i]} s`)}`,
						)
						.join("");
		b += text(
			300,
			285,
			"Erfundene Messreihe · gleiche Wasser- und Salzmenge",
			"diagram-small",
		);
	} else if (kind === "safety") {
		b =
			m === "stop"
				? `<path d="M260,35H340L395,90V170L340,225H260L205,170V90Z" class="stop-sign"/>${text(300, 140, "STOPP", "stop-label")}${text(300, 270, "Arbeit unterbrechen · Lehrkraft informieren")}`
				: m === "prepare"
					? `<path d="M175,105h250v80H175Z" class="goggles"/><ellipse cx="235" cy="145" rx="48" ry="30" class="glass"/><ellipse cx="365" cy="145" rx="48" ry="30" class="glass"/>${text(300, 245, "Schutzbrille · fester Stand · Unterweisung")}`
					: `<path d="M160,30L250,120L160,210L70,120Z M440,30L530,120L440,210L350,120Z" fill="white" stroke="#c52e3c" stroke-width="7"/><path d="M145,171C93,133 162,101 155,70C203,104 218,133 181,169C194,145 174,131 166,120C168,146 146,146 145,171Z" fill="#161616"/><text x="440" y="158" text-anchor="middle" font-size="100" fill="#161616">!</text>${text(160, 250, "entzündbar")}${text(440, 250, "z. B. reizend")}`;
	} else if (kind === "waterUse") {
		b = `<path d="M20,150Q90,130 160,150T300,150T440,150T580,150V220H20Z" class="water-fill"/>`;
		b +=
			m === "drink"
				? `<path d="M250,45h100l-10,150h-80Z" class="glass"/>${text(300, 265, "Lebensmittel: Qualität prüfen")}`
				: m === "carry"
					? `<path d="M175,125h230l-40,55H215Z" class="boat"/>${box(255, 75, 90, 50)}${text(300, 265, "Transport: Stoffe und Verkehrswege")}`
					: `<ellipse cx="260" cy="180" rx="55" ry="23" class="fish"/><path d="M308,180l40,-25v50Z" class="fish"/><circle cx="228" cy="175" r="4" class="eye"/>${tree(465, 80)}${text(300, 265, "Lebensraum: Wasser, Pflanzen und Tiere")}`;
	} else if (kind === "properties") {
		b = `<path d="M230,45v130a45,45 0 1 0 50,0V45a25,25 0 0 0 -50,0Z" class="glass"/><path d="M255,${m === "boil" ? 80 : m === "compare" ? 168 : 190}V205" stroke="var(--chem-red)" stroke-width="18"/><circle cx="255" cy="210" r="23" fill="var(--chem-red)"/>${text(430, 95, m === "boil" ? "100 °C" : m === "compare" ? "20 °C" : "0 °C")}${text(430, 135, m === "boil" ? "Sieden" : m === "compare" ? "flüssig" : "Schmelzen")}${text(300, 275, "Reines Wasser · normaler Luftdruck", "diagram-small")}`;
	} else if (kind === "solutions") {
		const d = m === "salt" || m === "sugar";
		b =
			box(90, 35, 420, 180) +
			`<path d="M100,110h400v96H100Z" class="water-fill"/>` +
			Array.from(
				{ length: 15 },
				(_, i) =>
					`<circle cx="${d ? 125 + ((i * 71) % 350) : 230 + (i % 5) * 26}" cy="${d ? 120 + ((i * 29) % 75) : 175 + Math.floor(i / 5) * 12}" r="6" class="solute-${m === "salt" ? "salt" : m === "sugar" ? "sugar" : "sand"}"/>`,
			).join("") +
			text(
				300,
				260,
				m === "salt"
					? "klar · gelöst · leitet deutlich besser"
					: m === "sugar"
						? "klar · gelöst · leitet kaum"
						: "Sandkörner: absetzbar und filtrierbar",
				"diagram-small",
			);
	} else if (kind === "tension") {
		b = `<path d="M25,160H575V240H25Z" class="water-fill"/><path d="M25,160H210Q250,${m === "soap" ? 195 : 172} 290,160H575" class="surface-line ${m === "soap" ? "weak" : ""}"/>`;
		b +=
			m === "drop" || !m
				? `<path d="M300,30C290,60 245,80 245,115a55,55 0 0 0 110,0C355,80 310,60 300,30Z" class="drop"/>`
				: `<ellipse cx="300" cy="${m === "soap" ? 195 : 110}" rx="35" ry="10" class="insect"/>${[0, 1, 2].map((i) => `<path d="M${285 + i * 15},${m === "soap" ? 195 : 110}l-65,${m === "soap" ? 10 : 50} M${285 + i * 15},${m === "soap" ? 195 : 110}l65,${m === "soap" ? 10 : 50}" class="insect-leg"/>`).join("")}`;
		b += text(
			300,
			280,
			m === "soap"
				? "Spülmittel: Oberflächenspannung verringert"
				: "Grenzfläche · keine feste Haut",
			"diagram-small",
		);
	} else if (kind === "particles") {
		const gas = m === "gas",
			solid = m === "solid";
		b =
			box(22, 20, 556, 190) +
			Array.from({ length: 12 }, (_, i) => {
				const x = gas
						? 55 + ((i * 97) % 480)
						: 174 + (i % 4) * (solid ? 61 : 51) + (solid ? 0 : (i % 3) * 5),
					y = gas
						? 48 + ((i * 71) % 140)
						: 70 + Math.floor(i / 4) * (solid ? 52 : 45);
				return (
					molecule(x, y, "water", 0.45) +
					(solid ? "" : arrow(x + 20, y - 15, x + 34, y - (gas ? 32 : 20)))
				);
			}).join("") +
			text(
				300,
				250,
				m === "transition"
					? `${fmtDe(s.temperature)} °C: zwei Zustände können gleichzeitig vorliegen`
					: `${solid ? "Eis: feste Plätze" : gas ? "Dampf: große Abstände" : "Wasser: Plätze wechseln"} · ${fmtDe(s.temperature)} °C`,
				"diagram-small",
			);
	} else if (kind === "anomaly") {
		b = ["4 °C", "0 °C · flüssig", "Eis"]
			.map(
				(v, i) =>
					`${box(55 + i * 190, 220 - [118, 132, 165][i], 110, [118, 132, 165][i], i === 2 ? "ice-fill" : "water-box")}${text(110 + i * 190, 250, v, "diagram-small")}`,
			)
			.join("");
		const i = ["four", "zero", "ice"].indexOf(m);
		if (i >= 0)
			b += `<path d="M${110 + i * 190},30v25" class="highlight-line"/>`;
		b += text(
			300,
			285,
			"Gleiche Masse · Volumenunterschiede überzeichnet",
			"diagram-small",
		);
	} else if (kind === "molecules") {
		b =
			molecule(300, 110, m || "water", 1.7) +
			text(
				300,
				220,
				m === "hydrogen"
					? "H₂ · 2 H-Atome · Element"
					: m === "oxygen"
						? "O₂ · 2 O-Atome · Element"
						: "H₂O · 2 H-Atome + 1 O-Atom · Verbindung",
			) +
			text(300, 275, "H: Wasserstoffatom · O: Sauerstoffatom", "diagram-small");
	} else if (kind === "electrolysis") {
		b =
			text(145, 35, "Vorher: 2 Wassermoleküle") +
			molecule(90, 100, "water", 0.8) +
			molecule(200, 100, "water", 0.8) +
			arrow(267, 110, 335) +
			text(300, 205, "elektrische Energie", "diagram-small");
		b +=
			m === "after"
				? molecule(400, 85, "hydrogen", 0.7) +
					molecule(500, 85, "hydrogen", 0.7) +
					molecule(450, 150, "oxygen", 0.7) +
					text(450, 35, "2 H₂ und 1 O₂", "diagram-small")
				: m === "rearrange"
					? [370, 420, 470, 520].map((x) => atom(x, 80, "H", 15)).join("") +
						atom(420, 150, "O") +
						atom(480, 150, "O")
					: box(360, 50, 200, 145) + text(460, 120, "Schritt wählen");
		b +=
			text(
				300,
				245,
				"Auf beiden Seiten: 4 H-Atome und 2 O-Atome",
				"diagram-small",
			) +
			text(
				300,
				280,
				"Gasvolumen Wasserstoff : Sauerstoff = 2 : 1",
				"diagram-small",
			);
	} else if (kind === "gases") {
		b =
			m === "unknown" || !m
				? box(170, 40, 260, 160) +
					text(300, 135, "?", "diagram-big") +
					text(300, 260, "Farblos allein ist kein Nachweis")
				: molecule(180, 110, m, 1.4) +
					box(315, 60, 245, 120) +
					text(
						435,
						110,
						m === "hydrogen" ? "Knallgasprobe" : "Glimmspanprobe",
					) +
					text(435, 145, m === "hydrogen" ? "Geräusch" : "Span flammt auf") +
					text(
						300,
						255,
						m === "hydrogen"
							? "brennbar"
							: "fördert Verbrennung · selbst nicht brennbar",
					);
	} else if (kind === "hydro") {
		b = `<path d="M30,40h150v95H30Z" class="water-fill"/><path d="M170,100l155,95h80" fill="none" stroke="var(--chem-water)" stroke-width="18"/><circle cx="330" cy="195" r="33" class="turbine"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M330,195l30,0" transform="rotate(${i * 60},330,195)" class="turbine-blade"/>`).join("")}${box(435, 160, 130, 70)}${arrow(370, 195, 430)}${text(500, 202, "Generator")}${text(100, 25, "Lageenergie", "diagram-small")}${text(270, 110, "Bewegung", "diagram-small")}${text(330, 260, "Turbine", "diagram-small")}${text(500, 260, "elektrisch", "diagram-small")}`;
		const x =
			m === "height"
				? 100
				: m === "turbine"
					? 330
					: m === "generator"
						? 500
						: -100;
		b += `<circle cx="${x}" cy="${x === 100 ? 87 : 195}" r="48" class="selection-ring"/>`;
	} else if (kind === "foodweb") {
		b =
			box(15, 35, 135, 45) +
			text(82, 64, "Pflanzenteile", "diagram-small") +
			box(215, 15, 130, 40) +
			text(280, 42, "Raupe", "diagram-small") +
			box(215, 95, 130, 40) +
			text(280, 122, "Blattlaus", "diagram-small") +
			box(420, 55, 100, 45) +
			text(470, 84, "Meise", "diagram-small") +
			text(550, 150, "Sperber", "diagram-small") +
			arrow(150, 50, 210, 35) +
			arrow(150, 70, 210, 110) +
			arrow(345, 35, 415, 70) +
			arrow(345, 115, 415, 90) +
			arrow(490, 102, 550, 130) +
			box(250, 205, 130, 45) +
			text(315, 234, "Zersetzer", "diagram-small") +
			text(95, 235, "Mineralstoffe", "diagram-small") +
			arrow(250, 226, 165) +
			arrow(90, 205, 80, 85) +
			text(485, 205, "Reste aller Gruppen", "diagram-small") +
			arrow(455, 215, 385, 225);
		b += text(
			300,
			285,
			m === "decomposer"
				? "Stoffe kehren zurück · Energie fließt hindurch"
				: "Nahrungspfeil: vom Futter zum Fresser",
			"diagram-small",
		);
	} else if (kind === "photosynthesis") {
		b =
			tree(300, 130) +
			text(90, 70, "Kohlenstoffdioxid", "diagram-small") +
			text(90, 215, "Wasser", "diagram-small") +
			text(490, 95, "Sauerstoff", "diagram-small") +
			text(490, 210, "Traubenzucker", "diagram-small") +
			arrow(165, 75, 255, 110) +
			arrow(150, 210, 270, 170) +
			arrow(355, 115, 435, 95) +
			arrow(350, 160, 430, 200) +
			`<circle cx="300" cy="30" r="23" class="sun-fill"/>${text(300, 36, "Licht", "atom-label")}${arrow(300, 58, 300, 82)}` +
			text(
				300,
				280,
				m === "light"
					? "Licht liefert Energie · kein Ausgangsstoff"
					: m === "products"
						? "Produkte: Traubenzucker und Sauerstoff"
						: "Ausgangsstoffe: Wasser und Kohlenstoffdioxid",
				"diagram-small",
			);
	} else if (kind === "soilLife") {
		if (m === "worm" || !m)
			b = `<path d="M110,150C180,50 260,230 350,130S460,80 495,140" class="worm"/>${text(300, 265, "Regenwurm · Ringelwurm · keine Beine")}`;
		else {
			const n = m === "mite" ? 4 : 7;
			b =
				`<ellipse cx="300" cy="135" rx="${m === "mite" ? 65 : 95}" ry="45" class="soil-animal"/>` +
				Array.from(
					{ length: n },
					(_, i) =>
						`<path d="M${245 + (i * 110) / (n - 1)},110l-18,-45 M${245 + (i * 110) / (n - 1)},160l18,45" class="insect-leg"/>`,
				).join("") +
				text(
					300,
					265,
					m === "mite"
						? "Erwachsene Milbe · Spinnentier · 8 Beine"
						: "Erwachsene Assel · Krebstier · 14 Beine",
				);
		}
	} else if (kind === "soil") {
		b = ["Streu", "belebter Oberboden", "verwitterter Unterboden", "Gestein"]
			.map(
				(v, i) =>
					`<rect x="40" y="${20 + i * 57}" width="260" height="57" class="soil-layer layer-${i}"/>${text(455, 55 + i * 57, v, "diagram-small")}`,
			)
			.join("");
		if (m === "water")
			b += [100, 160, 220].map((x) => arrow(x, 35, x, 172)).join("");
		if (m === "protect")
			b += `<path d="M40,20H300" stroke="var(--chem-green)" stroke-width="10"/>`;
		b += text(
			300,
			285,
			m === "water"
				? "Wasserspeicher · begrenzte Filterwirkung"
				: m === "protect"
					? "Bedeckung erhalten · Schadstoffe vermeiden"
					: "Ein vereinfachtes Bodenprofil",
			"diagram-small",
		);
	}
	return `<svg class="chem-diagram" viewBox="0 0 600 300" role="img" aria-label="${esc(`${LABS[kind].title}: ${LABS[kind].choices.find((c) => c.id === m)?.label || "Übersicht"}. Die Erklärung unter dem Bild beschreibt das Modell.`)}" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
}
