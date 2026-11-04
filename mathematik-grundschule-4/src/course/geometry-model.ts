import { escapeHtml as html } from "../html";
import type { Workshop } from "./workshop";
export interface Geometry {
	kind:
		| "map"
		| "building"
		| "points"
		| "net"
		| "mirror"
		| "scale"
		| "tiles"
		| "surface"
		| "volume"
		| "cuboid-net"
		| "rectangle"
		| "circle";
	columns: number;
	rows: number;
	cells: number[];
	source?: number[];
	dimensions?: number[];
	labels?: string[];
	axis?: "vertical" | "horizontal";
}
export const cellIndex = (x: number, y: number, columns: number) =>
	y * columns + x;
export function mirrorCells(
	cells: number[],
	columns: number,
	rows: number,
	axis: "vertical" | "horizontal",
): number[] {
	const result = Array(cells.length).fill(0);
	for (let y = 0; y < rows; y++)
		for (let x = 0; x < columns; x++)
			result[
				cellIndex(
					axis === "vertical" ? columns - 1 - x : x,
					axis === "horizontal" ? rows - 1 - y : y,
					columns,
				)
			] = cells[cellIndex(x, y, columns)];
	return result;
}
export function rectangleCorners(
	columns: number,
	rows: number,
	x: number,
	y: number,
	w: number,
	h: number,
): number[] {
	const result = Array(columns * rows).fill(0);
	for (const [a, b] of [
		[x, y],
		[x + w, y],
		[x + w, y + h],
		[x, y + h],
	])
		if (a >= 0 && a < columns && b >= 0 && b < rows)
			result[cellIndex(a, b, columns)] = 1;
	return result;
}
export function isRectangle(cells: number[], columns: number): boolean {
	const points = cells.flatMap((n, i) =>
		n ? [[i % columns, Math.floor(i / columns)]] : [],
	);
	if (points.length !== 4) return false;
	const xs = new Set(points.map((p) => p[0])),
		ys = new Set(points.map((p) => p[1]));
	return (
		xs.size === 2 &&
		ys.size === 2 &&
		[...xs].every((x) =>
			[...ys].every((y) => points.some((p) => p[0] === x && p[1] === y)),
		)
	);
}
type Vec = [number, number, number];
const neg = ([x, y, z]: Vec): Vec => [-x, -y, -z];
// Fold adjacent unit faces by a right angle. Overlap, inconsistent cycles and
// disconnected components fail. Six distinct normals close exactly one cube.
export function isCubeNet(cells: number[], columns: number): boolean {
	const indices = cells.flatMap((n, i) => (n ? [i] : []));
	if (indices.length !== 6) return false;
	const placed = new Map<number, [Vec, Vec, Vec]>();
	placed.set(indices[0], [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
	]);
	const queue = [indices[0]];
	for (let cursor = 0; cursor < queue.length; cursor++) {
		const i = queue[cursor],
			basis = placed.get(i);
		if (!basis) return false;
		const [u, v, n] = basis;
		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		]) {
			const x = (i % columns) + dx,
				y = Math.floor(i / columns) + dy,
				j = y * columns + x;
			if (x < 0 || x >= columns || y < 0 || j >= cells.length || !cells[j])
				continue;
			const next: [Vec, Vec, Vec] =
				dx === 1
					? [neg(n), v, u]
					: dx === -1
						? [n, v, neg(u)]
						: dy === 1
							? [u, neg(n), v]
							: [u, n, neg(v)];
			const previous = placed.get(j);
			if (previous) {
				if (JSON.stringify(previous) !== JSON.stringify(next)) return false;
			} else {
				placed.set(j, next);
				queue.push(j);
			}
		}
	}
	return (
		placed.size === 6 &&
		new Set([...placed.values()].map((a) => a[2].join(","))).size === 6
	);
}
export function frontHeights(cells: number[], columns: number): number[] {
	return Array.from({ length: columns }, (_, x) =>
		Math.max(...cells.filter((_, i) => i % columns === x)),
	);
}
export function geometryProperty(m: Workshop, state: number[]): boolean | null {
	if (!m.property) return null;
	const g = m.scene.geometry;
	if (!g) return false;
	if (m.property === "rectangle") return isRectangle(state, g.columns);
	if (m.property === "cube-net") return isCubeNet(state, g.columns);
	if (m.property === "ornament") {
		const period = g.dimensions?.[0] ?? 2;
		return (
			state.length >= period * 2 &&
			state.every((n, i) => n > 0 && n === state[i % period]) &&
			new Set(state.slice(0, period)).size > 1
		);
	}
	return false;
}
export function geometryView(g: Geometry, state = g.cells): string {
	const { columns, rows } = g;
	if (g.kind === "rectangle" || g.kind === "circle") {
		const [w, h] = g.dimensions ?? [4, 3],
			scale = Math.min(240 / w, 145 / (h ?? w)),
			right = 35 + w * scale,
			bottom = 35 + (h ?? w) * scale;
		return g.kind === "circle"
			? `<svg class="cube-building" viewBox="0 0 300 220" role="img" aria-label="Kreisskizze: unveränderter Abstand Mitte–Rand ${w} mm. Die Bildschirmgröße ist kein echtes Maß."><circle cx="120" cy="110" r="80" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="120" cy="110" r="3" fill="currentColor"/><path d="M120 110H200" stroke="var(--world-accent)" stroke-width="3"/><text x="140" y="100">${w} mm</text></svg>`
			: `<svg class="cube-building" viewBox="0 0 340 220" role="img" aria-label="Rechteckskizze mit Seiten ${w} cm und ${h} cm. Vier rechte Winkel; Bildschirmgröße nicht als echtes Maß verwenden."><rect x="35" y="35" width="${w * scale}" height="${h * scale}" fill="var(--soft)" stroke="currentColor" stroke-width="2"/><path d="M35 47H47V35" fill="none" stroke="currentColor"/><text x="${(right + 35) / 2}" y="24" text-anchor="middle">${w} cm</text><text x="${right + 10}" y="${(bottom + 35) / 2}">${h} cm</text></svg>`;
	}

	if (g.kind === "cuboid-net") {
		const [l, w, h] = g.dimensions ?? [3, 2, 4],
			dl = 100,
			dw = 70,
			dh = 125,
			widths = [dl, dw, dl, dw],
			actual = [l, w, l, w];
		let x = 20;
		const faces = widths
			.map((a, i) => {
				const part = `<rect x="${x}" y="${dw + 20}" width="${a}" height="${dh}"/><text x="${x + a / 2}" y="${dw + 20 + dh / 2}" text-anchor="middle" fill="var(--ink)" stroke="none">${actual[i]} × ${h}</text>`;
				x += a;
				return part;
			})
			.join("");
		return `<div class="world-scene-scroll" tabindex="0" role="region" aria-label="Quadernetzskizze, bei Bedarf seitlich verschiebbar"><svg class="world-scene" viewBox="0 0 380 305" role="img" aria-label="Nicht maßstabsgetreue Netzskizze eines Quaders mit Kantenlängen ${l}, ${w} und ${h} Einheiten. Vier Seitenflächen in einer Reihe; oben und unten je eine Fläche mit Seiten ${l} und ${w}." style="font-size:18px"><g fill="var(--soft)" stroke="currentColor">${faces}<rect x="20" y="20" width="${dl}" height="${dw}"/><rect x="20" y="${dw + dh + 20}" width="${dl}" height="${dw}"/></g><g fill="var(--ink)"><text x="${20 + dl / 2}" y="${20 + dw / 2}" text-anchor="middle">${l} × ${w}</text><text x="${20 + dl / 2}" y="${20 + dw + dh + dw / 2}" text-anchor="middle">${l} × ${w}</text></g></svg></div><p class="fine-print">Formskizze, nicht maßstabsgetreu. Du kannst sie seitlich verschieben. Für eine echte Faltvorlage zeichnest du die angegebenen Längen mit einem Lineal auf Papier.</p>`;
	}

	if (g.kind === "building" || g.kind === "volume") {
		const max = Math.max(1, ...state),
			p = (x: number, y: number, z: number) => [
				140 + (x - y) * 30,
				20 + (x + y) * 15 + (max - z) * 30,
			];
		const poly = (points: number[][], color: string) =>
			`<polygon points="${points.map((a) => a.join(",")).join(" ")}" fill="${color}" stroke="var(--ink)" stroke-width="1"/>`;
		const cubes = state
			.map((n, i) => ({ n, x: i % columns, y: Math.floor(i / columns) }))
			.sort((a, b) => a.x + a.y - b.x - b.y)
			.map(({ n, x, y }) =>
				Array.from({ length: n }, (_, z) => {
					const a = p(x, y, z + 1),
						b = p(x + 1, y, z + 1),
						c = p(x + 1, y + 1, z + 1),
						d = p(x, y + 1, z + 1);
					return (
						poly(
							[b, c, p(x + 1, y + 1, z), p(x + 1, y, z)],
							"var(--cube-side)",
						) +
						poly(
							[c, d, p(x, y + 1, z), p(x + 1, y + 1, z)],
							"var(--world-accent)",
						) +
						poly([a, b, c, d], "var(--cube-top)")
					);
				}).join(""),
			)
			.join("");
		return `<svg class="cube-building" viewBox="-30 0 360 ${50 + (columns + rows) * 15 + max * 30}" role="img" aria-label="Würfelgebäude. Bauplan von hinten nach vorne: ${state.map((n, i) => `${i % columns === 0 ? "neue Reihe, " : ""}${n}`).join(", ")}. Jeder belegte Platz ist lückenlos von unten gefüllt.">${cubes}</svg><p class="fine-print">Vorne ist unten im Bauplan. Eine Zahl gibt die Höhe des Stapels an; 0 bedeutet leer. Verdeckte Würfel zählen mit.</p><div class="static-grid" style="--grid-columns:${columns}" aria-label="Bauplan, hintere Reihe zuerst">${state.map((n, i) => `<span><small>${(i % columns) + 1}/${Math.floor(i / columns) + 1}</small>${n}</span>`).join("")}</div>`;
	}
	const symbols = ["·", "●", "▲", "■"];
	const source = g.source ?? [];
	const cells = Array.from(
		{ length: columns * rows },
		(_, i) =>
			`<span class="static-cell ${state[i] ? "filled" : ""} ${source[i] ? "source-cell" : ""}" aria-label="Spalte ${(i % columns) + 1}, Zeile ${Math.floor(i / columns) + 1}: ${g.kind === "tiles" ? ["leer", "Kreis", "Dreieck", "Quadrat"][state[i] || source[i] || 0] : state[i] || source[i] ? "markiert" : "leer"}">${g.kind === "tiles" ? symbols[state[i] || source[i] || 0] : state[i] || source[i] ? "●" : "·"}</span>`,
	).join("");
	const axis =
		g.kind === "mirror"
			? `<div class="mirror-axis ${g.axis ?? "vertical"}" aria-hidden="true"></div>`
			: "";
	let lines = "";
	if (
		(g.kind === "points" || g.kind === "scale") &&
		state.filter(Boolean).length === 4
	) {
		const points = state.flatMap((n, i) =>
				n ? [[(i % columns) + 0.5, Math.floor(i / columns) + 0.5]] : [],
			),
			center = [
				points.reduce((s, p) => s + p[0], 0) / 4,
				points.reduce((s, p) => s + p[1], 0) / 4,
			];
		points.sort(
			(a, b) =>
				Math.atan2(a[1] - center[1], a[0] - center[0]) -
				Math.atan2(b[1] - center[1], b[0] - center[0]),
		);
		lines = `<svg class="geometry-lines" viewBox="0 0 ${columns} ${rows}" aria-hidden="true"><polygon points="${points.map((p) => p.join(",")).join(" ")}" fill="none" stroke="var(--world-accent)" stroke-width=".05"/></svg>`;
	}
	return `<div class="geometry-scroll" tabindex="0" role="region" aria-label="Gitternetz, Spalten von links, Zeilen von oben; bei Bedarf seitlich verschiebbar"><div class="geometry-grid" style="--grid-columns:${columns}">${cells}${axis}${lines}</div></div>${g.kind === "map" ? "<p>Norden ↑ · Osten → · Süden ↓ · Westen ←</p>" : ""}${g.labels?.map((s) => `<p>${html(s)}</p>`).join("") ?? ""}`;
}
export function geometryControls(
	m: Workshop,
	state: number[],
	solved: boolean,
): string {
	const g = m.scene.geometry;
	if (!g) return "";
	return `<div class="geometry-scroll" tabindex="0" role="region" aria-label="Dein ${g.kind === "building" || g.kind === "volume" ? "Bauplan" : "Arbeitsgitter"}; Spalten von links, Zeilen von oben"><div class="geometry-grid controls-grid" style="--grid-columns:${g.columns}">${state.map((n, i) => `<button data-action="forest-model-set" data-col="${i}" data-value="${(n + 1) % (m.controls[i].max + 1)}" aria-label="${html(m.controls[i].label)}: ${g.kind === "tiles" ? ["leer", "Kreis", "Dreieck", "Quadrat"][n] : n}. Weiterwechseln" aria-pressed="${n > 0}" ${solved || m.controls[i].locked ? "disabled" : ""}><small>${(i % g.columns) + 1}/${Math.floor(i / g.columns) + 1}</small>${g.kind === "tiles" ? ["·", "●", "▲", "■"][n] : g.kind === "building" || g.kind === "volume" ? n : n ? "●" : "·"}</button>`).join("")}</div></div><p class="fine-print">Tippe ein Feld oder nutze Tab und Eingabetaste. ${g.kind === "building" || g.kind === "volume" ? "Ein Klick erhöht den Stapel; nach der größten Höhe beginnt er wieder bei 0." : g.kind === "tiles" ? "Jeder Klick wechselt die Form, danach wird das Feld wieder leer." : "Ein weiterer Klick nimmt die Markierung zurück."} Blasse feste Felder bleiben erhalten.</p>`;
}
export type Polyomino = [number, number][];
export function normalisePoly(points: Polyomino): Polyomino {
	const minX = Math.min(...points.map((p) => p[0])),
		minY = Math.min(...points.map((p) => p[1]));
	return points
		.map(([x, y]): [number, number] => [x - minX, y - minY])
		.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
export function transformPoly(points: Polyomino, turn: number): Polyomino {
	return normalisePoly(
		points.map(([x, y]): [number, number] => {
			if (turn >= 4) x = -x;
			for (let i = 0; i < turn % 4; i++) [x, y] = [-y, x];
			return [x, y];
		}),
	);
}
export const polyKey = (points: Polyomino) =>
	Array.from({ length: 8 }, (_, i) =>
		JSON.stringify(transformPoly(points, i)),
	).sort()[0];
export function hexominoes(): Polyomino[] {
	let shapes = new Map<string, Polyomino>([["[[0,0]]", [[0, 0]]]]);
	for (let size = 2; size <= 6; size++) {
		const next = new Map<string, Polyomino>();
		for (const p of shapes.values())
			for (const [x, y] of p)
				for (const [dx, dy] of [
					[1, 0],
					[-1, 0],
					[0, 1],
					[0, -1],
				]) {
					if (p.some((a) => a[0] === x + dx && a[1] === y + dy)) continue;
					const grown = normalisePoly([...p, [x + dx, y + dy]]);
					next.set(polyKey(grown), grown);
				}
		shapes = next;
	}
	return [...shapes.values()];
}
export function geometryMistake(m: Workshop, state: number[]): string {
	const g = m.scene.geometry;
	if (!g) return "Prüfe deine Darstellung.";
	const count = state.filter(Boolean).length;
	if (g.kind === "net")
		return count !== 6
			? `Du hast ${count} Quadrate markiert. Ein Würfelnetz braucht genau sechs verbundene Quadrate.`
			: "Sechs Quadrate sind da. Prüfe jetzt durch Falten, ob alle sechs auf verschiedene Seiten kommen. Kanten müssen zusammenpassen; Flächen dürfen nicht übereinander liegen.";
	if (m.property === "rectangle")
		return count !== 4
			? "Markiere genau vier verschiedene Eckpunkte."
			: "Vier Punkte allein genügen nicht. Prüfe, ob zwei verschiedene Spalten und zwei verschiedene Zeilen die vier Ecken mit rechten Winkeln bilden.";
	if (m.property === "ornament")
		return state.some((n) => n === 0)
			? "Jede Fliese braucht eine Markierung. Fülle die drei ganzen Wiederholungseinheiten."
			: new Set(state.slice(0, g.dimensions?.[0] ?? g.columns)).size < 2
				? "Verwende mindestens zwei verschiedene Markierungen in deiner ganzen Einheit."
				: "Die erste vollständige Einheit ist dein Grundmuster. Wiederhole alle Markierungen in derselben Reihenfolge.";
	const first = state.findIndex((n, i) => n !== m.target[i]),
		place = `Spalte ${(first % g.columns) + 1}, Zeile ${Math.floor(first / g.columns) + 1}`;
	if (g.kind === "mirror")
		return `Prüfe ${place}: Spiegelpunkte liegen genau gegenüber, gleich weit von der Achse entfernt.`;
	if (g.kind === "building" || g.kind === "volume")
		return `Prüfe ${place}. Die Bauplanzahl ist die Höhe eines lückenlosen Stapels. 0 bedeutet leer.`;
	if (g.kind === "scale")
		return "Zähle Feldabstände, nicht Punkte. Breite und Höhe bekommen denselben Faktor; die linke obere Ecke bleibt fest.";
	if (g.kind === "surface")
		return `Prüfe ${place}: Bedecke jedes Feld der Figur genau einmal. Außerhalb bleiben die Felder leer.`;
	return `Prüfe ${place} und die angegebene Regel noch einmal.`;
}
