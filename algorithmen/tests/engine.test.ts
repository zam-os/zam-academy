import { describe, expect, it } from "vitest";
import { runProgram } from "../src/engine";

const output = (code: string) => {
	const result = runProgram(code);
	expect(result.ok, result.error?.message).toBe(true);
	return result.output;
};
describe("bounded programming sandbox", () => {
	it("runs arithmetic, sequencing and boolean expressions", () => {
		expect(
			output(
				"let x = 2 + 3 * 4; x = x + 1; print(x); print(!(x < 0) && x === 15);",
			),
		).toEqual(["15", "true"]);
	});
	it("takes the correct branch and short-circuits logical expressions", () => {
		expect(
			output(
				"if (false && missing) { print(0); } else { print(7); } print(true || missing);",
			),
		).toEqual(["7", "true"]);
	});
	it("distinguishes a zero-iteration while from do-while", () => {
		expect(
			output("while (false) { print(1); } do { print(2); } while (false);"),
		).toEqual(["2"]);
	});
	it("supports for loops, function parameters, returns and local scope", () => {
		expect(
			output(
				"function sum(n) { let s = 0; for (let i = 1; i <= n; i++) { s = s + i; } return s; } print(sum(4)); print(sum(2));",
			),
		).toEqual(["10", "3"]);
		expect(
			runProgram("function f(x) { return x; } f(1); print(x);").error?.message,
		).toContain("noch nicht definiert");
	});
	it("uses independent block bindings and retains ordinary outer assignments", () => {
		expect(
			output("let x = 1; { let x = 2; print(x); } { x = 3; } print(x);"),
		).toEqual(["2", "3"]);
	});
	it("preserves JavaScript LHS-reference evaluation before RHS side effects", () => {
		expect(
			output(
				"let i = 0; let a = [0,0,0]; function next() { i = i + 1; return i; } a[next()] = next(); print(a);",
			),
		).toEqual(["[0, 2, 0]"]);
	});
	it("rejects coercing equality rather than returning a silently different JS result", () => {
		expect(runProgram('print(1 == "1");').error?.message).toContain("===");
		expect(runProgram('print(1 != "1");').error?.message).toContain("!==");
	});
	it("refuses unsupported nested functions and parameter redeclaration", () => {
		expect(
			runProgram(
				"function outer() { function inner() { return 1; } return inner(); } outer();",
			).error?.message,
		).toContain("obersten Programmebene");
		expect(
			runProgram("function f(x) { let x = 2; return x; } print(f(1));").error
				?.message,
		).toContain("bereits definiert");
	});
	it("refuses duplicate global names and respects non-callable lexical shadows", () => {
		for (const code of [
			"function f() { return 1; } let f = 2; print(f());",
			"let f = 2; function f() { return 1; } print(f());",
			"function f() { return 1; } { let f = 2; print(f()); }",
			"function f(x) { return x(); } print(f(2));",
		])
			expect(runProgram(code).ok, code).toBe(false);
	});
	it("reports bounded-value failures at the offending source line", () => {
		const cycle = runProgram("let a = [0];\na[0] = a;");
		expect(cycle.error?.line).toBe(2);
		expect(cycle.error?.message).toContain("sich selbst");
		const input = runProgram("let a = 1;\nlet b = read();", ["x".repeat(1001)]);
		expect(input.error?.line).toBe(2);
	});

	it("rejects invalid access, math, names and syntax with a line location", () => {
		for (const code of [
			"let a = [1]; print(a[1]);",
			"print(1 / 0);",
			"print(noSuchName);",
			"let x = ;",
			"return 1;",
			"const x = 1;",
		]) {
			const r = runProgram(code);
			expect(r.ok, code).toBe(false);
			expect(r.error?.line).toBeGreaterThan(0);
		}
		expect(runProgram("let a = 1;\nprint(b);").error?.line).toBe(2);
	});
	it("limits endless loops and recursion without executing native JS", () => {
		expect(runProgram("while (true) {}").error?.message).toContain(
			"Schrittgrenze",
		);
		expect(
			runProgram("function f() { return f(); } print(f());").error?.message,
		).toContain("Funktionsaufrufe");
		expect(runProgram('eval("print(1)");').ok).toBe(false);
		expect(runProgram("window.alert(1);").ok).toBe(false);
	});
	it("bounds cyclic and exponentially shared value graphs", () => {
		const cycle = runProgram("let a = [0]; a[0] = a; print(a);");
		expect(cycle.error?.message).toContain("sich selbst");
		const shared = runProgram(
			"let a = [0]; for (let i = 0; i < 30; i++) { a = [a,a]; } print(a.length);",
		);
		expect(shared.ok).toBe(false);
		expect(shared.error?.message).toMatch(/zu groß|zu tief/);
		expect(shared.steps).toBeLessThan(300);
	});
	it("bounds source, parse depth, strings and output volume", () => {
		expect(runProgram(" ".repeat(20001)).ok).toBe(false);
		expect(
			runProgram("print(" + "(".repeat(100) + "1" + ")".repeat(100) + ");").ok,
		).toBe(false);
		expect(
			runProgram('let s = "x"; for (let i = 0; i < 12; i++) { s = s + s; }').ok,
		).toBe(false);
		expect(
			runProgram("for (let i = 0; i < 102; i++) { print(i); }", [], 3000).error
				?.message,
		).toContain("Ausgaben");
	});
	it("keeps old trace frames independent of subsequent array mutation", () => {
		const r = runProgram("let a = [1];\na[0] = 2;\nprint(a[0]);");
		expect(r.ok).toBe(true);
		expect(r.trace[0].variables.a).toEqual([1]);
		expect(r.trace.at(-1)?.variables.a).toEqual([2]);
	});
	it("handles comments, escaped text and operator-looking strings", () => {
		expect(output('/* Test */ print("+"); // hi\nprint("a\\nb");')).toEqual([
			"+",
			"a\nb",
		]);
		expect(runProgram("/* open").ok).toBe(false);
	});
});
