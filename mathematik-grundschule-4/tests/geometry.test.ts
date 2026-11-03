import { describe, expect, it } from "vitest";
import {
	shapeTask,
	shapeLab,
	shapeFamily,
	shapeExit,
} from "../src/course/geometry";
import {
	hexominoes,
	isCubeNet,
	isRectangle,
	mirrorCells,
	rectangleCorners,
	transformPoly,
	polyKey,
	geometryView,
} from "../src/course/geometry-model";
import {
	acceptsWorkshop,
	freshWorkshop,
	validWorkshop,
	stepWorkshop,
} from "../src/course/workshop";
import {
	activeForestTask,
	forestKey,
	freshForest,
	recordForest,
	validForest,
} from "../src/course/progress";
import { correctForest } from "../src/course/tasks";
import { SHAPE_IDS } from "../src/course/worlds";
const need = <T>(v: T | null | undefined): T => {
	if (v == null) throw new Error("Missing geometry");
	return v;
};
describe("geometric properties", () => {
	it("classifies35 free hexominoes as11 cube nets, invariant under eight plane symmetries", () => {
		// Independent reference: CMU21-110 Homework2 (2010), Problem2;
		// https://www.math.cmu.edu/~bkell/21110-2010s/homework-2-sol.pdf
		const all = hexominoes();
		expect(all).toHaveLength(35);
		expect(new Set(all.map(polyKey)).size).toBe(35);
		let nets = 0;
		for (const p of all) {
			let first: boolean | undefined;
			for (let turn = 0; turn < 8; turn++) {
				const cells = Array(64).fill(0);
				for (const [x, y] of transformPoly(p, turn))
					cells[(y + 1) * 8 + x + 1] = 1;
				const accepted = isCubeNet(cells, 8);
				if (first === undefined) first = accepted;
				else expect(accepted).toBe(first);
			}
			if (first) nets++;
		}
		expect(nets).toBe(11);
		expect(isCubeNet([1, 1, 1, 1, 1, 1], 6)).toBe(false);
		expect(isCubeNet([1, 1, 1, 1, 1, 1], 3)).toBe(false);
		expect(isCubeNet([1, 1, 1, 0, 0, 0, 1, 1, 1], 3)).toBe(false);
	});
	it("checks rectangles and reflection as geometric properties rather than point order", () => {
		const a = rectangleCorners(5, 5, 1, 0, 3, 4);
		expect(isRectangle(a, 5)).toBe(true);
		const bad = [...a];
		bad[1] = 0;
		bad[2] = 1;
		expect(isRectangle(bad, 5)).toBe(false);
		for (const axis of ["vertical", "horizontal"] as const)
			for (let i = 0; i < 25; i++) {
				const source = Array(25).fill(0);
				source[i] = 1;
				const reflected = mirrorCells(source, 5, 5, axis);
				expect(mirrorCells(reflected, 5, 5, axis)).toEqual(source);
				const target = reflected.findIndex(Boolean),
					x = i % 5,
					y = Math.floor(i / 5);
				expect(target).toBe(
					axis === "vertical" ? y * 5 + 4 - x : (4 - y) * 5 + x,
				);
			}
	});
});
describe("Shape Bay activities", () => {
	it("has three reachable relevant goals, locked givens, and accepts alternative valid constructions", () => {
		for (const id of SHAPE_IDS)
			for (let i = 0; i < 3; i++) {
				const task = shapeLab(id, i);
				expect(task.goal).toBe(i + 1);
				if (!task.model) {
					expect(correctForest(task, null)).toBe(false);
					expect(correctForest(task, task.answer)).toBe(true);
					continue;
				}
				const m = task.model;
				let state = freshWorkshop(m);
				expect(correctForest(task, state)).toBe(false);
				for (let col = 0; col < m.target.length; col++)
					for (let n = 0; n < 10 && state[col] !== m.target[col]; n++)
						state = stepWorkshop(
							m,
							state,
							col,
							Math.sign(m.target[col] - state[col]),
						);
				expect(acceptsWorkshop(m, state), `${id} goal${i}`).toBe(true);
				expect(validWorkshop([...state, 0], m)).toBe(false);
				const locked = m.controls.findIndex((c) => c.locked);
				if (locked >= 0) {
					const forged = [...state];
					forged[locked] = 0;
					expect(validWorkshop(forged, m)).toBe(false);
				}
			}
		const rect = need(shapeLab("figuren-zeichnen", 1).model);
		expect(acceptsWorkshop(rect, rectangleCorners(5, 5, 0, 0, 1, 1))).toBe(
			true,
		);
		const net = need(shapeLab("koerper-netze", 1).model);
		const alternative = Array(25).fill(0);
		for (const [x, y] of [
			[1, 0],
			[0, 1],
			[1, 1],
			[2, 1],
			[3, 1],
			[1, 2],
		])
			alternative[y * 5 + x] = 1;
		expect(acceptsWorkshop(net, alternative)).toBe(true);
		const ornament = need(shapeLab("parkette-ornamente", 2).model);
		expect(
			acceptsWorkshop(ornament, [1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3]),
		).toBe(true);
		expect(acceptsWorkshop(ornament, Array(12).fill(1))).toBe(false);
	});
	it("checks seeded routes, hidden cubes, scaling, tiling and quantity calculations independently", () => {
		for (const id of SHAPE_IDS)
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 160; seed++)
					for (let index = 0; index < 3; index++) {
						const t = shapeTask(id, level, seed * 7919, index);
						if (t.model) {
							expect(correctForest(t, t.answer)).toBe(true);
							expect(t.model.property).toBeDefined();
							continue;
						}
						const b = need(t.investigation),
							a = t.answer as number[],
							d = b.identity,
							g = t.scene?.geometry;
						expect(a.every(Number.isSafeInteger)).toBe(true);
						expect(correctForest(t, a)).toBe(true);
						expect(
							correctForest(
								t,
								a.map((n, i) => (i === 0 ? n + 1 : n)),
							),
						).toBe(false);
						if (d[0] === "map") {
							const [x, y, dx, dy, unit] = d.slice(1, 6).map(Number);
							expect(
								x + dx >= 0 && x + dx < 5 && y + dy >= 0 && y + dy < 5,
							).toBe(true);
							expect(a.slice(0, 2)).toEqual(
								index === 1
									? [
											Math.abs(dx) + Math.abs(dy),
											(Math.abs(dx) + Math.abs(dy)) * unit,
										]
									: index === 2
										? [x + 1, y + 1]
										: [x + dx + 1, y + dy + 1],
							);
						}
						if (d[0] === "building") {
							const cells = d.slice(1, -3).map(Number),
								columns = Number(d[d.length - 3]);
							if (index === 0)
								expect(a.slice(0, 2)).toEqual([
									cells.reduce((s, n) => s + n, 0),
									cells.length,
								]);
							if (index === 1)
								for (let x = 0; x < columns; x++)
									expect(a[x]).toBe(Math.max(cells[x], cells[x + columns]));
							if (index === 2 && level === 2)
								expect(a[0] + a[1]).toBe(cells.reduce((s, n) => s + n, 0));
						}
						if (d[0] === "drawing")
							expect(a.slice(0, 2)).toEqual(
								index === 0
									? [Number(d[2]), Number(d[3])]
									: index === 1
										? [4, 2 * Number(d[2]) + 2 * Number(d[3])]
										: [Number(d[4]), 2 * Number(d[4])],
							);
						if (d[0] === "scale") {
							const factor = Number(d[3]),
								ratio = d[4] === "reduce" ? 1 / factor : factor;
							expect(a[0]).toBe(level === 2 ? factor : Number(d[1]) * ratio);
							expect(a[1]).toBe(Number(d[2]) * ratio);
						}
						if (d[0] === "surface")
							expect(a[0]).toBe(need(g).cells.reduce((s, n) => s + n, 0));
						if (d[0] === "volume") {
							expect(a[0]).toBe(Number(d[1]) * Number(d[2]));
							expect(a[1]).toBe(Number(d[1]) * Number(d[2]) * Number(d[3]));
						}
						expect(geometryView(need(g))).not.toContain("NaN");
					}
	});
	it("resamples encountered exit families without changing the active task after submission", () => {
		for (const id of SHAPE_IDS) {
			const p = freshForest(id);
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.solved = { 1: 3, 2: 3 };
			p.stage = "exit";
			const task = need(activeForestTask(p));
			p.stage = "practice-1";
			recordForest(p, task, task.answer);
			p.stage = "exit";
			const next = need(activeForestTask(p));
			expect(shapeFamily(next)).not.toEqual(shapeFamily(task));
			const key = forestKey(p);
			recordForest(p, next, next.answer);
			expect(forestKey(p)).toBe(key);
			expect(activeForestTask(p)).toEqual(next);
			expect(validForest(p)).toBe(true);
			for (let i = 0; i < 3; i++) expect(shapeExit(id, 0, i).goal).toBe(i + 1);
		}
	});
});

it("pins an exit seed through the2,000-attempt retention boundary", () => {
	const p = freshForest("figuren-zeichnen");
	p.seed = 0;
	p.stage = "exit";
	p.labGoals = [0, 1, 2];
	p.quiz = true;
	p.solved = { 1: 3, 2: 3 };
	const original = need(activeForestTask(p));
	recordForest(p, original, original.answer);
	const held = p.attempts[0];
	p.attempts = Array.from({ length: 2000 }, (_, i) => ({
		...held,
		key: `held/${i}`,
		signature: i === 0 ? held.signature : JSON.stringify(["unrelated", i]),
		taskSeed: undefined,
	}));
	const selected = need(activeForestTask(p));
	expect(shapeFamily(selected)).not.toEqual(shapeFamily(original));
	expect(validForest(p)).toBe(true);
	recordForest(p, selected, selected.answer);
	expect(p.attempts).toHaveLength(2000);
	expect(activeForestTask(p)).toEqual(selected);
	expect(validForest(p)).toBe(true);
});
it("uses identical net options for valid/invalid figures and requires net/ornament construction in transfer", () => {
	const options = new Set<string>(),
		answers = new Set<number>();
	for (let seed = 0; seed < 100; seed++) {
		const t = shapeTask("koerper-netze", 2, seed, 0),
			f = need(t.investigation).fields[0];
		options.add(JSON.stringify(f.choices));
		answers.add(f.value);
		expect(shapeTask("koerper-netze", 2, seed, 1).model?.property).toBe(
			"cube-net",
		);
		expect(shapeTask("parkette-ornamente", 2, seed, 2).model?.property).toBe(
			"ornament",
		);
	}
	expect(options.size).toBe(1);
	expect([...answers].sort()).toEqual([1, 2]);
});
it("keeps every projected cube polygon inside the SVG including5-row buildings", () => {
	const markup = geometryView({
		kind: "volume",
		columns: 5,
		rows: 5,
		cells: Array(25).fill(5),
	});
	const b = need(markup.match(/viewBox="([^"]+)"/))[1]
		.split(" ")
		.map(Number);
	for (const group of markup.matchAll(/points="([^"]+)"/g))
		for (const pair of group[1].split(" ")) {
			const [x, y] = pair.split(",").map(Number);
			expect(x).toBeGreaterThanOrEqual(b[0]);
			expect(x).toBeLessThanOrEqual(b[0] + b[2]);
			expect(y).toBeGreaterThanOrEqual(b[1]);
			expect(y).toBeLessThanOrEqual(b[1] + b[3]);
		}
});
