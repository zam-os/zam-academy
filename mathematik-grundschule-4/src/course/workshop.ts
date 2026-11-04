import {
	type DataChart,
	type ChanceExperiment,
	acceptsExperiment,
	validExperimentState,
	dataChartView,
	chartWorkshopView,
	experimentView,
} from "./data-model";
import {
	type Geometry,
	geometryView,
	geometryControls,
	geometryProperty,
} from "./geometry-model";
import { format } from "../math/place-value";
import { quantityText } from "./quantity";
export interface Scene {
	kind:
		| "ruler"
		| "mass"
		| "capacity"
		| "clock"
		| "coins"
		| "units"
		| "estimate"
		| "geometry"
		| "data"
		| "chance";
	geometry?: Geometry;
	chart?: DataChart;
	experiment?: ChanceExperiment;
	values: number[];
	labels?: string[];
}
export interface Workshop {
	identity: (string | number)[];
	scene: Scene;
	controls: {
		label: string;
		max: number;
		start: number;
		step?: number;
		locked?: boolean;
	}[];
	target: number[];
	property?: "rectangle" | "cube-net" | "ornament";
	// A quantity can be built with several equivalent arrangements.
	weights?: number[];
	total?: number;
}
const html = (s: string) =>
	s.replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			] ?? c,
	);
export const freshWorkshop = (m: Workshop) => m.controls.map((c) => c.start);
export function validWorkshop(raw: unknown, m: Workshop): raw is number[] {
	return (
		Array.isArray(raw) &&
		(!m.scene.experiment || validExperimentState(raw, m.scene.experiment)) &&
		raw.length === m.controls.length &&
		raw.every(
			(n, i) =>
				Number.isSafeInteger(n) &&
				n >= 0 &&
				n <= m.controls[i].max &&
				n % (m.controls[i].step ?? 1) === 0 &&
				(!m.controls[i].locked || n === m.controls[i].start),
		)
	);
}
export function acceptsWorkshop(m: Workshop, state: number[]): boolean {
	if (!validWorkshop(state, m)) return false;
	if (m.scene.experiment) return acceptsExperiment(m, state);
	const property = geometryProperty(m, state);
	if (property !== null) return property;
	const weights = m.weights;
	return weights && m.total !== undefined
		? state.reduce((sum, n, i) => sum + n * weights[i], 0) === m.total
		: state.every((n, i) => n === m.target[i]);
}
export function stepWorkshop(
	m: Workshop,
	state: number[],
	col: number,
	direction: number,
): number[] {
	if (
		!validWorkshop(state, m) ||
		!Number.isInteger(col) ||
		!m.controls[col] ||
		m.controls[col].locked ||
		![-1, 1].includes(direction)
	)
		return state;
	const result = [...state],
		c = m.controls[col];
	result[col] = Math.max(
		0,
		Math.min(c.max, result[col] + direction * (c.step ?? 1)),
	);
	return result;
}
const svg = (label: string, body: string, box = "0 0 600 170") =>
	`<div class="world-scene-scroll" tabindex="0" role="region" aria-label="Modell, bei Bedarf seitlich verschiebbar"><svg class="world-scene" viewBox="${box}" role="img" aria-label="${html(label)}">${body}</svg></div>`;
export function sceneView(scene: Scene): string {
	if (scene.chart) return dataChartView(scene.chart);
	if (scene.geometry) return geometryView(scene.geometry);
	const v = scene.values;
	if (scene.kind === "ruler") {
		const [start, end] = v;
		return svg(
			`Modell-Lineal in Millimetern; Band von ${start} mm bis ${end} mm. Die Bildschirmgröße entspricht keiner echten Länge.`,
			`<path d="M30 110H570" stroke="currentColor" stroke-width="2"/>${Array.from({ length: 121 }, (_, i) => `<path d="M${30 + i * 4.5} 110v${i % 10 === 0 ? 22 : i % 5 === 0 ? 14 : 7}" stroke="currentColor"/>${i % 10 === 0 ? `<text x="${30 + i * 4.5}" y="155" text-anchor="middle">${i / 10}</text>` : ""}`).join("")}<text x="565" y="30">cm</text><path d="M${30 + start * 4.5} 95V55H${30 + end * 4.5}V95" fill="none" stroke="var(--world-accent, var(--action))" stroke-width="7"/><text x="30" y="30">10 kleine Abschnitte = 1 cm</text>`,
		);
	}
	if (scene.kind === "clock") {
		const total = v[0] % 1440,
			minute = total % 60,
			hour = (total / 60) % 12;
		const hand = (value: number, length: number, width: number) => {
			const a = (value * Math.PI) / 30;
			return `<path d="M85 85L${85 + Math.sin(a) * length} ${85 - Math.cos(a) * length}" stroke="currentColor" stroke-width="${width}" stroke-linecap="round"/>`;
		};
		return svg(
			`Analoguhr: langer Zeiger bei ${minute} Minuten, kurzer Zeiger ${minute ? `zwischen ${Math.floor(hour) || 12} und ${(Math.floor(hour) + 1) % 12 || 12}` : `bei ${Math.floor(hour) || 12}`}. ${total >= 720 ? "Nachmittag oder Abend" : "Vormittag oder Nacht"}; der Tagesabschnitt steht in der Aufgabe.`,
			`<circle cx="85" cy="85" r="70" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>${Array.from(
				{ length: 12 },
				(_, i) => {
					const a = (i * Math.PI) / 6;
					return `<text x="${85 + Math.sin(a) * 55}" y="${91 - Math.cos(a) * 55}" text-anchor="middle">${i || 12}</text>`;
				},
			).join(
				"",
			)}${hand(hour * 5, 35, 5)}${hand(minute, 52, 3)}<circle cx="85" cy="85" r="5" fill="currentColor"/><text x="190" y="70">1 Stunde = 60 Minuten</text><text x="190" y="105">1 Minute = 60 Sekunden</text><text x="190" y="140">1 Tag = 24 Stunden</text>`,
		);
	}
	if (scene.kind === "capacity") {
		const amount = v[0],
			max = v[1] ?? 2000;
		return svg(
			`Messbecher mit Skala in ml; jeder markierte Abstand entspricht ${max / 8} ml.`,
			`<path d="M50 20V145H190V20" fill="none" stroke="currentColor" stroke-width="3"/><path d="M53 ${145 - (Math.min(amount, max) / max) * 120}H187V142H53Z" fill="var(--world-accent,var(--purple))" opacity=".4"/>${Array.from({ length: 9 }, (_, i) => `<path d="M170 ${145 - i * 15}h20" stroke="currentColor"/><text x="205" y="${150 - i * 15}">${format((i * max) / 8)} ml</text>`).join("")}<text x="350" y="65">Auf Augenhöhe lesen.</text><text x="350" y="105">1 l = 1 000 ml</text>`,
		);
	}
	if (scene.kind === "mass") {
		const sum = v[0];
		return svg(
			`Waagenmodell. Angezeigte Masse ${format(sum)} g.`,
			`<path d="M160 40V145M80 145H240M50 55H270M65 55L35 110H95ZM255 55L225 110H285Z" fill="none" stroke="currentColor" stroke-width="3"/><text x="325" y="75">${format(sum)} g</text><text x="325" y="115">1 kg = 1 000 g</text>`,
		);
	}
	if (scene.kind === "coins") {
		return `<div class="quantity-readout"><span aria-hidden="true">◉</span><strong>${quantityText(v[0], { scale: 100 })} €</strong><small>1 € = 100 ct · Spielgeld, kein Kauf</small></div>`;
	}
	if (scene.kind === "units") {
		const [large, small, factor] = v;
		return `<div class="unit-model"><strong>${large} ${html(scene.labels?.[0] ?? "große Einheiten")} + ${small} ${html(scene.labels?.[1] ?? "kleine Einheiten")}</strong><div class="unit-parts">${Array.from({ length: Math.min(large, 10) }, () => `<span>${format(factor)}</span>`).join("")}<span>+ ${small}</span></div><p>Eine große Einheit enthält ${format(factor)} kleine Einheiten.</p></div>`;
	}
	return `<div class="unit-model"><p>Ein Vergleichsstück: ${format(v[1])} ${html(scene.labels?.[0] ?? "cm")}</p><div class="estimate-parts">${Array.from({ length: Math.min(v[0], 20) }, () => '<span aria-hidden="true">↔</span>').join("")}</div><p>Anzahl gleich langer Vergleichsstücke: ${v[0]} · Modell, keine echte Messung am Bildschirm</p></div>`;
}
export function workshopView(
	m: Workshop,
	raw: number[] | null | undefined,
	solved: boolean,
): string {
	const state = raw && validWorkshop(raw, m) ? raw : freshWorkshop(m);
	if (m.scene.chart) return chartWorkshopView(m, state, solved);
	if (m.scene.experiment) return experimentView(m, state, solved);
	const weights = m.weights;
	const total = weights ? state.reduce((s, n, i) => s + n * weights[i], 0) : 0;
	const scene = {
		...m.scene,
		...(m.scene.geometry
			? { geometry: { ...m.scene.geometry, cells: state } }
			: {}),
		values:
			m.scene.kind === "ruler"
				? [m.scene.values[0], m.scene.values[0] + state[0] * 10 + state[1]]
				: m.scene.kind === "clock"
					? [state[0] * 60 + state[1]]
					: m.scene.kind === "units"
						? [state[0], state[1], m.scene.values[0]]
						: m.scene.kind === "estimate"
							? [state[0], m.scene.values[0]]
							: m.scene.kind === "capacity"
								? [total, m.scene.values[0] ?? 2000]
								: [total],
	};
	return `<div class="world-workshop">${sceneView(scene)}${m.scene.kind === "clock" ? `<p>Deine Uhr: ${quantityText(state[0] * 60 + state[1], { clock: true })}</p>` : ""}${m.scene.geometry ? geometryControls(m, state, solved) : `<div class="model-controls">${m.controls.map((c, i) => `<div class="model-control"><strong>${html(c.label)}</strong><div><button data-action="forest-model" data-col="${i}" data-value="-1" aria-label="${html(c.label)} verringern" ${solved || state[i] === 0 ? "disabled" : ""}>−</button><output aria-live="polite">${state[i]}</output><button data-action="forest-model" data-col="${i}" data-value="1" aria-label="${html(c.label)} erhöhen" ${solved || state[i] === c.max ? "disabled" : ""}>+</button></div></div>`).join("")}</div>`}${solved ? "" : '<button class="text-button" data-action="forest-model-reset">Modell zurücksetzen</button>'}<p class="fine-print">Die Werkstatt ist angeleitet. Eine Messung mit echten Gegenständen kann die App nicht beobachten.</p></div>`;
}
