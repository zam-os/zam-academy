import type { Locale } from "./i18n";
export interface LocalizedText {
	de: string;
	en: string;
}
export const TRACE_ACTIONS = {
	condition: { de: "Bedingung geprüft", en: "Condition checked" },
	while: { de: "while: Bedingung wahr", en: "while: condition true" },
	do: { de: "do: Körper ausführen", en: "do: execute body" },
	for: { de: "for: Bedingung wahr", en: "for: condition true" },
	stored: { de: "Wert gespeichert", en: "Value stored" },
	function: { de: "Funktion angelegt", en: "Function defined" },
	statement: { de: "Anweisung beendet", en: "Statement completed" },
};
export type TraceAction = keyof typeof TRACE_ACTIONS;
/** Every evaluated node costs a step; this lets a loop over a full 100-element array finish. */
export const STEP_LIMIT = 10000;

/** Small, deliberately bounded JavaScript subset. No dynamic JavaScript execution. */
export type Value = number | string | boolean | null | Value[];
interface Token {
	text: string;
	line: number;
	kind: "number" | "string" | "id" | "symbol" | "eof";
}
type Expr =
	| { kind: "literal"; value: Value; line: number }
	| { kind: "name"; name: string; line: number }
	| { kind: "array"; values: Expr[]; line: number }
	| { kind: "unary"; op: string; value: Expr; line: number }
	| { kind: "binary"; op: string; left: Expr; right: Expr; line: number }
	| { kind: "call"; name: string; args: Expr[]; line: number }
	| { kind: "index"; target: Expr; index: Expr; line: number }
	| { kind: "length"; target: Expr; line: number };
type Stmt =
	| { kind: "block"; body: Stmt[]; line: number }
	| { kind: "declare"; name: string; value: Expr; line: number }
	| { kind: "assign"; target: Expr; value: Expr; line: number }
	| { kind: "expression"; value: Expr; line: number }
	| { kind: "if"; condition: Expr; yes: Stmt; no?: Stmt; line: number }
	| { kind: "while"; condition: Expr; body: Stmt; line: number }
	| { kind: "do"; condition: Expr; body: Stmt; line: number }
	| {
			kind: "for";
			start: Stmt;
			condition: Expr;
			update: Stmt;
			body: Stmt;
			line: number;
	  }
	| {
			kind: "function";
			name: string;
			params: string[];
			body: Stmt;
			line: number;
	  }
	| { kind: "return"; value: Expr; line: number };
export class ProgramError extends Error {
	constructor(
		public readonly localized: LocalizedText,
		public line = 1,
	) {
		super(localized.de);
		this.name = "ProgramError";
	}
}
export interface Frame {
	line: number;
	action: string;
	actionKey: TraceAction;
	variables: Record<string, Value>;
	output: string[];
}
export interface RunResult {
	ok: boolean;
	output: string[];
	trace: Frame[];
	error?: { message: string; line: number; messages: LocalizedText };
	steps: number;
}
function lex(source: string): Token[] {
	if (source.length > 20000)
		throw new ProgramError({
			de: "Dein Programm ist zu lang (höchstens 20.000 Zeichen).",
			en: "Your program is too long (at most 20,000 characters).",
		});
	const tokens: Token[] = [];
	let i = 0,
		line = 1;
	while (i < source.length) {
		const c = source[i];
		if (/\s/.test(c)) {
			if (c === "\n") line++;
			i++;
			continue;
		}
		if (source.startsWith("//", i)) {
			while (i < source.length && source[i] !== "\n") i++;
			continue;
		}
		if (source.startsWith("/*", i)) {
			const start = line;
			i += 2;
			while (i < source.length && !source.startsWith("*/", i)) {
				if (source[i] === "\n") line++;
				i++;
			}
			if (i === source.length)
				throw new ProgramError(
					{
						de: "Der Kommentar braucht am Ende */.",
						en: "Close the comment with */.",
					},
					start,
				);
			i += 2;
			continue;
		}
		const number = source.slice(i).match(/^\d+(?:\.\d+)?/);
		if (number) {
			tokens.push({ text: number[0], line, kind: "number" });
			i += number[0].length;
			continue;
		}
		const id = source.slice(i).match(/^[A-Za-z_][A-Za-z_0-9]*/);
		if (id) {
			tokens.push({ text: id[0], line, kind: "id" });
			i += id[0].length;
			continue;
		}
		if (c === '"' || c === "'") {
			const start = line;
			const quote = c;
			let text = "";
			i++;
			while (i < source.length && source[i] !== quote) {
				if (source[i] === "\n")
					throw new ProgramError(
						{
							de: "Schließe den Text in derselben Zeile.",
							en: "Close the string on the same line.",
						},
						start,
					);
				if (source[i] === "\\") {
					i++;
					const escapes: Record<string, string> = {
						n: "\n",
						t: "\t",
						'"': '"',
						"'": "'",
						"\\": "\\",
					};
					if (!(source[i] in escapes))
						throw new ProgramError(
							{
								de: "Diese Escape-Sequenz wird hier nicht unterstützt.",
								en: "This escape sequence is not supported here.",
							},
							start,
						);
					text += escapes[source[i++]];
				} else text += source[i++];
			}
			if (source[i] !== quote)
				throw new ProgramError(
					{
						de: "Der Text braucht ein schließendes Anführungszeichen.",
						en: "The string needs a closing quotation mark.",
					},
					start,
				);
			i++;
			tokens.push({ text, line: start, kind: "string" });
			continue;
		}
		const op = [
			"===",
			"!==",
			"<=",
			">=",
			"==",
			"!=",
			"&&",
			"||",
			"++",
			"--",
		].find((x) => source.startsWith(x, i));
		if (op) {
			tokens.push({ text: op, line, kind: "symbol" });
			i += op.length;
			continue;
		}
		if ("{}()[];,+-*/%<>=!.".includes(c)) {
			tokens.push({ text: c, line, kind: "symbol" });
			i++;
			continue;
		}
		throw new ProgramError(
			{
				de: `Das Zeichen „${c}“ gehört nicht zur Lernsprache.`,
				en: `The character “${c}” is not part of the learning language.`,
			},
			line,
		);
	}
	tokens.push({ text: "", line, kind: "eof" });
	return tokens;
}
/** How a token is named in a diagnostic; the end of input is localized. */
const shown = (token: Token): LocalizedText =>
	token.kind === "eof"
		? { de: "Programmende", en: "end of program" }
		: { de: token.text, en: token.text };
const precedence: Record<string, number> = {
	"||": 1,
	"&&": 2,
	"===": 3,
	"!==": 3,
	"==": 3,
	"!=": 3,
	"<": 4,
	">": 4,
	"<=": 4,
	">=": 4,
	"+": 5,
	"-": 5,
	"*": 6,
	"/": 6,
	"%": 6,
};
class Parser {
	private i = 0;
	private depth = 0;
	constructor(private tokens: Token[]) {}
	private current() {
		return this.tokens[this.i];
	}
	private match(text: string) {
		if (this.current().text === text && this.current().kind !== "string") {
			this.i++;
			return true;
		}
		return false;
	}
	private need(text: string) {
		if (!this.match(text)) {
			const found = shown(this.current());
			throw new ProgramError(
				{
					de: `Hier fehlt „${text}“ (gefunden: ${found.de}).`,
					en: `“${text}” is missing here (found: ${found.en}).`,
				},
				this.current().line,
			);
		}
	}
	private name() {
		const t = this.current();
		if (
			t.kind !== "id" ||
			[
				"true",
				"false",
				"null",
				"let",
				"const",
				"function",
				"return",
				"while",
				"for",
				"if",
				"else",
				"do",
			].includes(t.text)
		)
			throw new ProgramError(
				{
					de: "Hier wird ein Variablen- oder Funktionsname erwartet.",
					en: "A variable or function name is expected here.",
				},
				t.line,
			);
		this.i++;
		return t.text;
	}
	parse(): Stmt[] {
		const body: Stmt[] = [];
		while (this.current().kind !== "eof") body.push(this.statement());
		return body;
	}
	private statement(): Stmt {
		if (++this.depth > 70)
			throw new ProgramError(
				{
					de: "Zu viele ineinander verschachtelte Anweisungen.",
					en: "Too many nested statements.",
				},
				this.current().line,
			);
		try {
			return this.readStatement();
		} finally {
			this.depth--;
		}
	}
	private readStatement(): Stmt {
		const line = this.current().line;
		if (this.match("{")) {
			const body: Stmt[] = [];
			while (!this.match("}")) {
				if (this.current().kind === "eof") this.need("}");
				body.push(this.statement());
			}
			return { kind: "block", body, line };
		}
		if (this.match("if")) {
			this.need("(");
			const condition = this.expression();
			this.need(")");
			const yes = this.statement();
			const no = this.match("else") ? this.statement() : undefined;
			return { kind: "if", condition, yes, no, line };
		}
		if (this.match("while")) {
			this.need("(");
			const condition = this.expression();
			this.need(")");
			return { kind: "while", condition, body: this.statement(), line };
		}
		if (this.match("do")) {
			const body = this.statement();
			this.need("while");
			this.need("(");
			const condition = this.expression();
			this.need(")");
			this.need(";");
			return { kind: "do", condition, body, line };
		}
		if (this.match("for")) {
			this.need("(");
			const start = this.simple();
			this.need(";");
			const condition = this.expression();
			this.need(";");
			const update = this.simple();
			this.need(")");
			return {
				kind: "for",
				start,
				condition,
				update,
				body: this.statement(),
				line,
			};
		}
		if (this.match("function")) {
			const name = this.name();
			this.need("(");
			const params: string[] = [];
			if (!this.match(")")) {
				do {
					params.push(this.name());
				} while (this.match(","));
				this.need(")");
			}
			if (new Set(params).size !== params.length)
				throw new ProgramError(
					{
						de: "Jeder Parameter braucht einen eigenen Namen.",
						en: "Each parameter needs its own name.",
					},
					line,
				);
			const body = this.statement();
			if (body.kind !== "block")
				throw new ProgramError(
					{
						de: "Eine Funktion braucht einen Block in geschweiften Klammern.",
						en: "A function needs a block in curly brackets.",
					},
					line,
				);
			return { kind: "function", name, params, body, line };
		}
		if (this.match("return")) {
			const value = this.expression();
			this.need(";");
			return { kind: "return", value, line };
		}
		const result = this.simple();
		this.need(";");
		return result;
	}
	private simple(): Stmt {
		const line = this.current().line;
		if (this.match("const"))
			throw new ProgramError(
				{
					de: "Die Lernsprache verwendet let für Variablen.",
					en: "The learning language uses let for variables.",
				},
				line,
			);
		if (this.match("let")) {
			const name = this.name();
			this.need("=");
			return { kind: "declare", name, value: this.expression(), line };
		}
		const target = this.expression();
		if (this.match("=")) {
			if (target.kind !== "name" && target.kind !== "index")
				throw new ProgramError(
					{
						de: "Nur Variablen oder Feldeinträge können einen Wert erhalten.",
						en: "Only variables or array elements can be assigned a value.",
					},
					line,
				);
			return { kind: "assign", target, value: this.expression(), line };
		}
		if (this.match("++") || this.match("--")) {
			const op = this.tokens[this.i - 1].text === "++" ? "+" : "-";
			if (target.kind !== "name")
				throw new ProgramError(
					{
						de: "++ und -- funktionieren hier nur mit Variablen.",
						en: "++ and -- work only with variables here.",
					},
					line,
				);
			return {
				kind: "assign",
				target,
				value: {
					kind: "binary",
					left: target,
					right: { kind: "literal", value: 1, line },
					op,
					line,
				},
				line,
			};
		}
		return { kind: "expression", value: target, line };
	}
	private expression(min = 0): Expr {
		if (++this.depth > 70)
			throw new ProgramError(
				{
					de: "Dieser Ausdruck ist zu tief verschachtelt.",
					en: "This expression is nested too deeply.",
				},
				this.current().line,
			);
		try {
			let left = this.primary();
			while (
				(precedence[this.current().text] ?? -1) >= min &&
				this.current().kind !== "string"
			) {
				const op = this.current();
				this.i++;
				left = {
					kind: "binary",
					left,
					op: op.text,
					right: this.expression(precedence[op.text] + 1),
					line: op.line,
				};
			}
			return left;
		} finally {
			this.depth--;
		}
	}
	private primary(): Expr {
		const token = this.current();
		this.i++;
		let result: Expr;
		if (token.kind === "number")
			result = { kind: "literal", value: Number(token.text), line: token.line };
		else if (token.kind === "string")
			result = { kind: "literal", value: token.text, line: token.line };
		else if (["true", "false", "null"].includes(token.text))
			result = {
				kind: "literal",
				value: token.text === "null" ? null : token.text === "true",
				line: token.line,
			};
		else if (["-", "+", "!"].includes(token.text))
			result = {
				kind: "unary",
				op: token.text,
				value: this.expression(7),
				line: token.line,
			};
		else if (token.text === "(") {
			result = this.expression();
			this.need(")");
		} else if (token.text === "[") {
			const values: Expr[] = [];
			if (!this.match("]")) {
				do {
					values.push(this.expression());
				} while (this.match(","));
				this.need("]");
			}
			result = { kind: "array", values, line: token.line };
		} else if (token.kind === "id")
			result = { kind: "name", name: token.text, line: token.line };
		else {
			const found = shown(token);
			throw new ProgramError(
				{
					de: `Hier fehlt ein Wert oder Ausdruck (gefunden: ${found.de}).`,
					en: `A value or expression is missing here (found: ${found.en}).`,
				},
				token.line,
			);
		}
		for (;;) {
			if (this.match("(")) {
				if (result.kind !== "name")
					throw new ProgramError(
						{
							de: "Rufe eine Funktion über ihren Namen auf.",
							en: "Call a function using its name.",
						},
						token.line,
					);
				const args: Expr[] = [];
				if (!this.match(")")) {
					do {
						args.push(this.expression());
					} while (this.match(","));
					this.need(")");
				}
				result = { kind: "call", name: result.name, args, line: token.line };
			} else if (this.match("[")) {
				const index = this.expression();
				this.need("]");
				result = { kind: "index", target: result, index, line: token.line };
			} else if (this.match(".")) {
				this.need("length");
				result = { kind: "length", target: result, line: token.line };
			} else break;
		}
		return result;
	}
}
interface Scope {
	values: Map<string, Value>;
	parent?: Scope;
}
interface Fn {
	statement: Extract<Stmt, { kind: "function" }>;
	scope: Scope;
}
class Returned {
	constructor(public value: Value) {}
}
function clone(
	value: Value,
	budget = { nodes: 0 },
	ancestors = new Set<Value[]>(),
	depth = 0,
	line = 1,
): Value {
	if (++budget.nodes > 1000 || depth > 10)
		throw new ProgramError(
			{
				de: "Dieser Wert ist zu groß oder zu tief verschachtelt (höchstens 1.000 Wertknoten, Tiefe 10).",
				en: "This value is too large or too deeply nested (at most 1,000 expanded value nodes, depth 10).",
			},
			line,
		);
	if (Array.isArray(value)) {
		if (ancestors.has(value))
			throw new ProgramError(
				{
					de: "Ein Feld darf in der Lernsprache nicht direkt oder indirekt sich selbst enthalten.",
					en: "An array cannot contain itself, directly or indirectly, in the learning language.",
				},
				line,
			);
		if (value.length > 100)
			throw new ProgramError(
				{
					de: "Ein Feld darf höchstens 100 Einträge haben.",
					en: "An array may contain at most 100 elements.",
				},
				line,
			);
		ancestors.add(value);
		const result = value.map((entry) =>
			clone(entry, budget, ancestors, depth + 1, line),
		);
		ancestors.delete(value);
		return result;
	}
	if (typeof value === "number" && !Number.isFinite(value))
		throw new ProgramError(
			{
				de: "Ein Zahlenwert muss endlich sein.",
				en: "A numeric value must be finite.",
			},
			line,
		);
	if (typeof value === "string" && value.length > 1000)
		throw new ProgramError(
			{
				de: "Dieser Text wird zu lang (höchstens 1.000 Zeichen).",
				en: "This string is too long (at most 1,000 characters).",
			},
			line,
		);
	if (value !== null && !["number", "string", "boolean"].includes(typeof value))
		throw new ProgramError(
			{
				de: "Dieser Werttyp gehört nicht zur Lernsprache.",
				en: "This value type is not part of the learning language.",
			},
			line,
		);
	return value;
}
export function formatValue(value: Value, line = 1): string {
	const checked = clone(value, undefined, undefined, 0, line);
	const format = (v: Value): string =>
		Array.isArray(v) ? `[${v.map(format).join(", ")}]` : String(v);
	const text = format(checked);
	if (text.length > 4000)
		throw new ProgramError(
			{
				de: "Die Ausgabe dieses Wertes wird zu lang.",
				en: "The output of this value is too long.",
			},
			line,
		);
	return text;
}
export function runProgram(
	source: string,
	inputs: Value[] = [],
	limit = STEP_LIMIT,
	locale: Locale = "de",
): RunResult {
	const trace: Frame[] = [],
		output: string[] = [];
	let steps = 0,
		inputAt = 0,
		calls = 0,
		tracedNodes = 0;
	const functions = new Map<string, Fn>();
	const global: Scope = { values: new Map() };
	const tick = (line: number) => {
		if (++steps > Math.min(STEP_LIMIT, Math.max(10, limit)))
			throw new ProgramError(
				{
					de: "Schrittgrenze erreicht. Prüfe besonders die Schleifenbedingung und den Zähler.",
					en: "Step limit reached. Check the loop condition and its counter in particular.",
				},
				line,
			);
	};
	const locate = (scope: Scope, name: string, line: number): Scope => {
		if (scope.values.has(name)) return scope;
		if (scope.parent) return locate(scope.parent, name, line);
		throw new ProgramError(
			{
				de: `„${name}“ ist noch nicht definiert. Lege die Variable mit let an.`,
				en: `“${name}” has not been defined yet. Declare the variable with let.`,
			},
			line,
		);
	};
	const frame = (scope: Scope, line: number, actionKey: TraceAction) => {
		if (trace.length >= 250 || tracedNodes === Number.POSITIVE_INFINITY) return;
		const budget = { nodes: 0 };
		const variables: Record<string, Value> = Object.create(null);
		const capture = (s: Scope) => {
			if (s.parent) capture(s.parent);
			for (const [k, v] of s.values)
				variables[k] = clone(v, budget, undefined, 0, line);
		};
		capture(scope);
		// Like the 250-state cap, a full trace stops recording; the program still runs.
		if (tracedNodes + budget.nodes > 30000) {
			tracedNodes = Number.POSITIVE_INFINITY;
			return;
		}
		tracedNodes += budget.nodes;
		trace.push({
			line,
			action: TRACE_ACTIONS[actionKey][locale],
			actionKey,
			variables,
			output: [...output],
		});
	};
	const numeric = (value: Value, line: number): number => {
		if (typeof value !== "number" || !Number.isFinite(value))
			throw new ProgramError(
				{
					de: "Hier wird eine endliche Zahl erwartet.",
					en: "A finite number is expected here.",
				},
				line,
			);
		return value;
	};
	const bounded = (value: Value, line: number): Value => {
		if (typeof value === "number" && !Number.isFinite(value))
			throw new ProgramError(
				{
					de: "Dieses Ergebnis ist keine endliche Zahl (z. B. Division durch null).",
					en: "This result is not a finite number (for example, division by zero).",
				},
				line,
			);
		if (typeof value === "string" && value.length > 1000)
			throw new ProgramError(
				{ de: "Dieser Text wird zu lang.", en: "This string is too long." },
				line,
			);
		return value;
	};
	const evaluate = (expr: Expr, scope: Scope): Value => {
		tick(expr.line);
		switch (expr.kind) {
			case "literal":
				return bounded(expr.value, expr.line);
			case "name":
				return locate(scope, expr.name, expr.line).values.get(expr.name)!;
			case "array": {
				if (expr.values.length > 100)
					throw new ProgramError(
						{
							de: "Ein Feld darf hier höchstens 100 Einträge haben.",
							en: "An array may contain at most 100 elements here.",
						},
						expr.line,
					);
				const value = expr.values.map((v) => evaluate(v, scope));
				clone(value, undefined, undefined, 0, expr.line);
				return value;
			}
			case "index": {
				const target = evaluate(expr.target, scope),
					index = evaluate(expr.index, scope);
				if (
					!Array.isArray(target) ||
					typeof index !== "number" ||
					!Number.isInteger(index) ||
					index < 0 ||
					index >= target.length
				)
					throw new ProgramError(
						{
							de: "Der Feldindex liegt außerhalb des Feldes. Der erste Index ist 0.",
							en: "The array index is out of bounds. The first index is 0.",
						},
						expr.line,
					);
				return target[index];
			}
			case "length": {
				const value = evaluate(expr.target, scope);
				if (!Array.isArray(value) && typeof value !== "string")
					throw new ProgramError(
						{
							de: "length gibt es hier nur für Text und Felder.",
							en: "length is available only for strings and arrays here.",
						},
						expr.line,
					);
				return value.length;
			}
			case "unary": {
				const v = evaluate(expr.value, scope);
				return expr.op === "!"
					? !v
					: expr.op === "-"
						? -numeric(v, expr.line)
						: numeric(v, expr.line);
			}
			case "binary": {
				if (["==", "!="].includes(expr.op))
					throw new ProgramError(
						{
							de: "Nutze in der Lernsprache === oder !== für einen Vergleich ohne Typumwandlung.",
							en: "Use === or !== in the learning language to compare without type conversion.",
						},
						expr.line,
					);
				const left = evaluate(expr.left, scope);
				if (expr.op === "&&") return left ? evaluate(expr.right, scope) : left;
				if (expr.op === "||") return left ? left : evaluate(expr.right, scope);
				const right = evaluate(expr.right, scope);
				if (["==", "==="].includes(expr.op)) return left === right;
				if (["!=", "!=="].includes(expr.op)) return left !== right;
				if (
					expr.op === "+" &&
					(typeof left === "string" || typeof right === "string")
				) {
					if (Array.isArray(left) || Array.isArray(right))
						throw new ProgramError(
							{
								de: "Felder werden hier nicht automatisch in Text umgewandelt.",
								en: "Arrays are not automatically converted to text here.",
							},
							expr.line,
						);
					return bounded(
						formatValue(left, expr.line) + formatValue(right, expr.line),
						expr.line,
					);
				}
				const a = numeric(left, expr.line),
					b = numeric(right, expr.line);
				switch (expr.op) {
					case "+":
						return bounded(a + b, expr.line);
					case "-":
						return bounded(a - b, expr.line);
					case "*":
						return bounded(a * b, expr.line);
					case "/":
						return bounded(a / b, expr.line);
					case "%":
						return bounded(a % b, expr.line);
					case "<":
						return a < b;
					case ">":
						return a > b;
					case "<=":
						return a <= b;
					case ">=":
						return a >= b;
				}
				throw new ProgramError(
					{ de: "Unbekannter Operator.", en: "Unknown operator." },
					expr.line,
				);
			}
			case "call": {
				for (
					let checked: Scope | undefined = scope;
					checked;
					checked = checked.parent
				) {
					if (checked.values.has(expr.name))
						throw new ProgramError(
							{
								de: `„${expr.name}“ bezeichnet hier einen Wert, keine aufrufbare Funktion. Verwende unterschiedliche Namen.`,
								en: `“${expr.name}” refers to a value here, not a callable function. Use different names.`,
							},
							expr.line,
						);
				}
				const args = expr.args.map((a) => evaluate(a, scope));
				if (expr.name === "read") {
					if (args.length)
						throw new ProgramError(
							{
								de: "read() erwartet keine Argumente.",
								en: "read() takes no arguments.",
							},
							expr.line,
						);
					if (inputAt >= inputs.length)
						throw new ProgramError(
							{
								de: "Es gibt keine weitere Eingabe für read().",
								en: "No further input is available for read().",
							},
							expr.line,
						);
					return clone(inputs[inputAt++], undefined, undefined, 0, expr.line);
				}
				if (expr.name === "print") {
					if (args.length !== 1)
						throw new ProgramError(
							{
								de: "print() erwartet genau einen Wert.",
								en: "print() expects exactly one value.",
							},
							expr.line,
						);
					if (output.length >= 100)
						throw new ProgramError(
							{
								de: "Zu viele Ausgaben (höchstens 100).",
								en: "Too many outputs (at most 100).",
							},
							expr.line,
						);
					output.push(formatValue(args[0], expr.line));
					return null;
				}
				const fn = functions.get(expr.name);
				if (!fn)
					throw new ProgramError(
						{
							de: `Die Funktion „${expr.name}“ wurde nicht definiert.`,
							en: `The function “${expr.name}” has not been defined.`,
						},
						expr.line,
					);
				if (args.length !== fn.statement.params.length)
					throw new ProgramError(
						{
							de: `„${expr.name}“ erwartet ${fn.statement.params.length} Argumente.`,
							en: `“${expr.name}” expects ${fn.statement.params.length} arguments.`,
						},
						expr.line,
					);
				if (++calls > 20)
					throw new ProgramError(
						{
							de: "Zu viele verschachtelte Funktionsaufrufe. Prüfe den Abbruch einer Rekursion.",
							en: "Too many nested function calls. Check the stopping condition of any recursion.",
						},
						expr.line,
					);
				const local: Scope = {
					values: new Map(
						fn.statement.params.map((name, i) => [name, args[i]]),
					),
					parent: fn.scope,
				};
				try {
					if (fn.statement.body.kind === "block")
						for (const s of fn.statement.body.body) execute(s, local);
				} catch (error) {
					if (error instanceof Returned) return error.value;
					throw error;
				} finally {
					calls--;
				}
				return null;
			}
		}
	};
	const execute = (statement: Stmt, scope: Scope): void => {
		tick(statement.line);
		switch (statement.kind) {
			case "block": {
				const local: Scope = { values: new Map(), parent: scope };
				for (const s of statement.body) execute(s, local);
				return;
			}
			case "declare": {
				if (scope === global && functions.has(statement.name))
					throw new ProgramError(
						{
							de: "Dieser Name gehört schon zu einer Funktion. Wähle einen anderen Variablennamen.",
							en: "This name already belongs to a function. Choose another variable name.",
						},
						statement.line,
					);
				if (scope.values.has(statement.name))
					throw new ProgramError(
						{
							de: `„${statement.name}“ ist in diesem Block bereits definiert.`,
							en: `“${statement.name}” is already defined in this block.`,
						},
						statement.line,
					);
				if (
					["print", "read", "__proto__", "constructor", "prototype"].includes(
						statement.name,
					)
				)
					throw new ProgramError(
						{ de: "Dieser Name ist reserviert.", en: "This name is reserved." },
						statement.line,
					);
				scope.values.set(statement.name, evaluate(statement.value, scope));
				break;
			}
			case "assign": {
				if (statement.target.kind === "name") {
					const targetScope = locate(
						scope,
						statement.target.name,
						statement.line,
					);
					const value = evaluate(statement.value, scope);
					targetScope.values.set(statement.target.name, value);
				} else if (statement.target.kind === "index") {
					const arr = evaluate(statement.target.target, scope),
						index = evaluate(statement.target.index, scope);
					if (
						!Array.isArray(arr) ||
						typeof index !== "number" ||
						!Number.isInteger(index) ||
						index < 0 ||
						index >= arr.length
					)
						throw new ProgramError(
							{
								de: "Der Feldindex liegt außerhalb des Feldes.",
								en: "The array index is out of bounds.",
							},
							statement.line,
						);
					const value = evaluate(statement.value, scope);
					arr[index] = value;
					clone(arr, undefined, undefined, 0, statement.line);
				}
				break;
			}
			case "expression":
				evaluate(statement.value, scope);
				break;
			case "if": {
				const chosen = evaluate(statement.condition, scope)
					? statement.yes
					: statement.no;
				frame(scope, statement.line, "condition");
				if (chosen) execute(chosen, scope);
				return;
			}
			case "while":
				while (evaluate(statement.condition, scope)) {
					frame(scope, statement.line, "while");
					execute(statement.body, scope);
				}
				break;
			case "do":
				do {
					frame(scope, statement.line, "do");
					execute(statement.body, scope);
				} while (evaluate(statement.condition, scope));
				break;
			case "for": {
				const local: Scope = { values: new Map(), parent: scope };
				execute(statement.start, local);
				while (evaluate(statement.condition, local)) {
					frame(local, statement.line, "for");
					execute(statement.body, local);
					execute(statement.update, local);
				}
				break;
			}
			case "function":
				if (scope !== global)
					throw new ProgramError(
						{
							de: "Definiere Funktionen in dieser Werkstatt nur auf der obersten Programmebene.",
							en: "Define functions only at the top level of the program in this workshop.",
						},
						statement.line,
					);
				if (
					functions.has(statement.name) ||
					global.values.has(statement.name) ||
					["print", "read"].includes(statement.name)
				)
					throw new ProgramError(
						{
							de: "Dieser Funktionsname ist schon belegt.",
							en: "This function name is already taken.",
						},
						statement.line,
					);
				functions.set(statement.name, { statement, scope });
				break;
			case "return":
				if (calls === 0)
					throw new ProgramError(
						{
							de: "return steht nur im Körper einer Funktion.",
							en: "return is allowed only inside a function body.",
						},
						statement.line,
					);
				throw new Returned(evaluate(statement.value, scope));
		}
		frame(
			scope,
			statement.line,
			statement.kind === "declare" || statement.kind === "assign"
				? "stored"
				: statement.kind === "function"
					? "function"
					: "statement",
		);
	};
	try {
		const program = new Parser(lex(source)).parse();
		for (const stmt of program) execute(stmt, global);
		return { ok: true, output, trace, steps };
	} catch (error) {
		const e =
			error instanceof ProgramError
				? error
				: new ProgramError({
						de: "Dieses Programm überschreitet die Grenzen der Lernsprache.",
						en: "This program exceeds the limits of the learning language.",
					});
		return {
			ok: false,
			output,
			trace,
			steps,
			error: {
				message: e.localized[locale],
				line: e.line,
				messages: e.localized,
			},
		};
	}
}
