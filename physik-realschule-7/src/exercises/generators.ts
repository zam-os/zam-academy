import type { CalculationKind, ExerciseTask, Level } from "../model/types";
import type { Rng } from "./rng";
import { fmt } from "./format";

export function makeExercise(
	kind: CalculationKind,
	rng: Rng,
	level: Level,
): ExerciseTask {
	const a = rng.int(2, 12),
		b = rng.int(2, 8),
		c = rng.int(1, 5);
	const task = (
		prompt: string,
		answer: number,
		unit: string,
		formulaHint: string,
		solution: string,
	): ExerciseTask => ({
		prompt,
		answer,
		unit,
		formulaHint,
		digits: 3,
		tolerance: 0,
		solutionHtml: solution,
	});
	switch (kind) {
		case "length":
			return level === 1
				? task(
						`Ein Körper ist ${a * 10 + b} mm lang. Gib seine Länge in cm an.`,
						(a * 10 + b) / 10,
						"cm",
						"10 mm = 1 cm",
						`${a * 10 + b} mm / 10 = ${fmt((a * 10 + b) / 10)} cm.`,
					)
				: task(
						`Ein Lineal hat keine brauchbare Nullmarke. Ein Körper beginnt bei ${a} cm und endet bei ${fmt(a + b + c / 10)} cm. Wie lang ist er in mm?`,
						(b + c / 10) * 10,
						"mm",
						"Länge = Endmarke − Anfangsmarke; danach in mm umrechnen.",
						`(${fmt(a + b + c / 10)} − ${a}) cm = ${fmt(b + c / 10)} cm = ${b * 10 + c} mm.`,
					);
		case "speed":
			return level === 1
				? task(
						`Ein Wagen fährt gleichförmig ${a * b} m in ${b} s. Wie groß ist seine Geschwindigkeit in m/s?`,
						a,
						"m/s",
						"v = s / t",
						`v = ${a * b} m / ${b} s = ${a} m/s.`,
					)
				: task(
						`Ein Fahrrad fährt gleichförmig mit ${fmt(a * 3.6)} km/h. Wie viele Sekunden braucht es für ${a * b * 10} m?`,
						b * 10,
						"s",
						"Geschwindigkeit zuerst in m/s; dann t = s / v.",
						`${fmt(a * 3.6)} km/h / 3,6 = ${a} m/s. t = ${a * b * 10} m / ${a} m/s = ${b * 10} s.`,
					);
		case "spring":
			return level === 1
				? task(
						`Eine Feder hat D = ${b} N/cm. Im geprüften Hooke-Bereich wird sie um ${c} cm gedehnt. Wie groß ist die Zugkraft?`,
						b * c,
						"N",
						"F = D · Δl",
						`F = ${b} N/cm · ${c} cm = ${b * c} N.`,
					)
				: task(
						`Eine Feder ist unbelastet ${a} cm lang. Bei ${b * c} N ist sie im geprüften proportionalen Bereich ${a + c} cm lang. Wie groß ist D?`,
						b,
						"N/cm",
						"Zuerst die Dehnung bestimmen; D = F / Δl.",
						`Δl = (${a + c} − ${a}) cm = ${c} cm. D = ${b * c} N / ${c} cm = ${b} N/cm.`,
					);
		case "weight":
			return level === 1
				? task(
						`Ein Körper hat die Masse ${a * 100} g. Rechne mit g = 10 N/kg. Wie groß ist seine Gewichtskraft?`,
						a,
						"N",
						"Masse in kg umrechnen, dann F_G = m · g.",
						`m = ${fmt(a / 10)} kg. F_G = ${fmt(a / 10)} kg · 10 N/kg = ${a} N.`,
					)
				: task(
						`Ein Körper hat auf dem Mond bei g = 1,6 N/kg die Gewichtskraft ${fmt(a * 1.6)} N. Wie groß ist seine Masse?`,
						a,
						"kg",
						"m = F_G / g",
						`m = ${fmt(a * 1.6)} N / 1,6 N/kg = ${a} kg. Die Masse hängt nicht vom Ort ab.`,
					);
		case "volume":
			return level === 1
				? task(
						`Ein vollständig untergetauchter wasserfester Körper lässt die Anzeige von ${a * 10} ml auf ${a * 10 + b * c} ml steigen. Wie groß ist sein Volumen?`,
						b * c,
						"cm³",
						"Volumen = Endanzeige − Anfangsanzeige; 1 ml = 1 cm³.",
						`V = (${a * 10 + b * c} − ${a * 10}) ml = ${b * c} ml = ${b * c} cm³.`,
					)
				: task(
						`Ein quaderförmiger Körper ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Wie groß ist sein Volumen in Litern?`,
						(a * b * c) / 1000,
						"l",
						"V = Länge · Breite · Höhe; 1 l = 1 000 cm³.",
						`V = ${a} · ${b} · ${c} cm³ = ${a * b * c} cm³ = ${fmt((a * b * c) / 1000, 3)} l.`,
					);
		case "density":
			return level === 1
				? task(
						`Ein homogener Körper hat ${a * b * c} g Masse und ${b * c} cm³ Volumen. Wie groß ist seine Dichte?`,
						a,
						"g/cm³",
						"ρ = m / V",
						`ρ = ${a * b * c} g / ${b * c} cm³ = ${a} g/cm³.`,
					)
				: c % 2
					? task(
							`Ein homogener Baustoff hat die Dichte ${fmt(b / 2)} g/cm³. Für ein Modell sind ${a * 10} cm³ vorgesehen. Welche Masse in g hat das Material?`,
							(a * 10 * b) / 2,
							"g",
							"m = ρ · V",
							`m = ${fmt(b / 2)} g/cm³ · ${a * 10} cm³ = ${a * 5 * b} g.`,
						)
					: task(
							`Ein homogener Körper hat die Masse ${a * b} g und die Dichte ${b} g/cm³. Welches Volumen in cm³ hat er?`,
							a,
							"cm³",
							"V = m / ρ",
							`V = ${a * b} g / ${b} g/cm³ = ${a} cm³.`,
						);
	}
}
