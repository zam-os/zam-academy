import { describe, expect, it } from "vitest";
import {
	LANGUAGE_KEY,
	languageHash,
	readLanguage,
	translator,
} from "../src/i18n";
import { getLessons, getStages, optionOrder } from "../src/lessons";
import {
	complete,
	freshProgress,
	loadProgress,
	saveProgress,
} from "../src/progress";
import {
	challengeSolved,
	challenges,
	defaultNetwork,
	HOSTNAME,
	type NetworkConfig,
	type RequestKind,
	simulate,
	transferSeconds,
} from "../src/simulator";

describe("the full English lesson contract", () => {
	it("translates all 19 lessons without changing public anchors, exercise semantics or the optional scope", () => {
		const german = getLessons("de"),
			english = getLessons("en");
		expect(english).toHaveLength(19);
		expect(getStages("en")).toHaveLength(getStages("de").length);
		for (let i = 0; i < german.length; i += 1) {
			const de = german[i],
				en = english[i];
			expect(en.id).toBe(de.id);
			expect(en.stage).toBe(de.stage);
			expect(en.optional).toBe(de.optional);
			expect(en.title).not.toBe(de.title);
			expect(en.intro).not.toBe(de.intro);
			expect(en.paragraphs).toHaveLength(de.paragraphs.length);
			expect(en.paragraphs.join(" ").length).toBeGreaterThan(500);
			expect(en.example).not.toBe(de.example);
			expect(en.takeaway).not.toBe(de.takeaway);
			expect(en.quiz.question).not.toBe(de.quiz.question);
			expect(en.quiz.correct).toBe(de.quiz.correct);
			expect(en.quiz.options).toHaveLength(de.quiz.options.length);
			expect(new Set(en.quiz.options).size).toBe(en.quiz.options.length);
			expect(en.quiz.feedback).not.toBe(de.quiz.feedback);
			expect(optionOrder(en.quiz.options.length, en.id)).toEqual(
				optionOrder(de.quiz.options.length, de.id),
			);
			expect(en.activity.kind).toBe(de.activity.kind);
			expect(en.activity.prompt).not.toBe(de.activity.prompt);
			if (en.activity.kind === "lab" && de.activity.kind === "lab")
				expect(en.activity.challenge).toBe(de.activity.challenge);
			if (en.activity.kind === "number" && de.activity.kind === "number")
				expect(en.activity.answer).toBe(de.activity.answer);
			if (en.activity.kind === "choice" && de.activity.kind === "choice") {
				expect(en.activity.correct).toBe(de.activity.correct);
				expect(en.activity.options).toHaveLength(de.activity.options.length);
				expect(en.activity.feedback).not.toBe(de.activity.feedback);
			}
		}
		expect(english.filter((lesson) => !lesson.optional)).toHaveLength(18);
	});
	it("keeps TCP's limits explicit in the English refresher", () => {
		const lesson = getLessons("en").find((item) => item.id === "net-tcp-udp")!;
		expect(lesson.paragraphs.join(" ")).toContain(
			"does not guarantee a completely error-free application",
		);
		const tls = getLessons("en").find((item) => item.id === "net-https")!;
		expect(tls.paragraphs.join(" ")).toContain(
			"does not establish the operator’s honesty",
		);
	});
});

describe("language selection and progress identity", () => {
	const englishSaved = { getItem: () => "en" };
	it("gives explicit links precedence over the saved language", () => {
		expect(readLanguage("#lesson=net-dns&lang=de", englishSaved)).toBe("de");
		expect(
			readLanguage("#lesson=net-dns&lang=en", { getItem: () => "de" }),
		).toBe("en");
		expect(readLanguage("#lesson=net-dns&lang=fr", englishSaved)).toBe("de");
		expect(readLanguage("#lesson=net-dns&lang=", englishSaved)).toBe("de");
		expect(readLanguage("#lesson=net-dns", englishSaved)).toBe("en");
	});
	it("falls back to German when storage is unavailable or unknown", () => {
		expect(
			readLanguage("", {
				getItem: () => {
					throw new Error("blocked");
				},
			}),
		).toBe("de");
		expect(readLanguage("", { getItem: () => "xx" })).toBe("de");
		expect(
			readLanguage("#lang=en", {
				getItem: () => {
					throw new Error("blocked");
				},
			}),
		).toBe("en");
	});
	it("uses locale-independent lesson IDs and a separate language preference key", () => {
		expect(languageHash("net-dns", "en")).toBe("lesson=net-dns&lang=en");
		expect(LANGUAGE_KEY).toBe("zam-academy-datennetze-language-v1");
		let value: string | null = null;
		const memory = {
			getItem: () => value,
			setItem: (_key: string, next: string) => {
				value = next;
			},
		};
		const p = freshProgress();
		p.lastLesson = "net-dns";
		p.quiz.push("net-dns");
		p.activities.push("net-dns");
		p.lab.push("dns");
		p.network.dnsRecord = "203.0.113.99";
		saveProgress(memory, p);
		const restored = loadProgress(memory).progress;
		expect(complete(restored, getLessons("en")[10].id)).toBe(true);
		expect(restored.network.dnsRecord).toBe("203.0.113.99");
		expect(restored.lastLesson).toBe("net-dns");
	});
	it("has no hidden dependence on a global translator state", () => {
		const de = translator("de"),
			en = translator("en");
		expect(en("Deutsch", "English")).toBe("English");
		expect(de("Deutsch", "English")).toBe("Deutsch");
		expect(en("Deutsch", "English")).toBe("English");
	});
});

describe("English diagnostics and lab challenges", () => {
	const repairs: Record<string, Partial<NetworkConfig>> = {
		gateway: { gateway: "192.168.10.1" },
		dns: { dnsRecord: "203.0.113.20" },
		prefix: { clientPrefix: 24 },
		cable: { serverCable: true },
		return: { serverGateway: "203.0.113.1" },
		https: { certificateName: HOSTNAME },
		firewall: { blockedPort: "none" },
	};
	function expectEnglish(text: string) {
		expect(text).not.toMatch(
			/Prüfung|erreichbar|Zertifikat|Verbindung|Wähle|Namensauflösung|Netzwerk|Fehler|\bDer\b|\bDie\b|\bDas\b|\bBitte\b/,
		);
	}
	it("solves all seven English challenges using the same repairs and preserves network settings", () => {
		const en = challenges("en"),
			de = challenges("de");
		for (let i = 0; i < en.length; i += 1) {
			const task = en[i];
			expect(task.id).toBe(de[i].id);
			expect(task.config).toEqual(de[i].config);
			expect(task.title).not.toBe(de[i].title);
			expectEnglish(task.title);
			expectEnglish(task.instruction);
			const before = JSON.stringify(task.config);
			const failure = simulate(task.config, task.target, task.kind, "en");
			expect(failure.success).toBe(false);
			expectEnglish(JSON.stringify(failure));
			expect(failure.code).toBe(
				simulate(task.config, task.target, task.kind, "de").code,
			);
			expect(JSON.stringify(task.config)).toBe(before);
			const repaired = { ...task.config, ...repairs[task.id] };
			expect(
				challengeSolved(task, repaired, task.kind, task.target, "en"),
			).toBe(true);
			expect(challengeSolved(task, repaired, "dns", task.target, "en")).toBe(
				false,
			);
			expectEnglish(
				JSON.stringify(simulate(repaired, task.target, task.kind, "en")),
			);
		}
	});
	it.each([
		["clientIp", "bad"],
		["clientIp", "192.168.10.1"],
		["clientIp", "192.168.11.10"],
		["clientCable", false],
		["clientPrefix", 1],
		["gateway", "bad"],
		["routerOn", false],
		["dns", "bad"],
		["dns", "203.0.113.99"],
		["dnsRecord", "bad"],
		["serverCable", false],
		["serverIp", "bad"],
		["serverIp", "203.0.113.53"],
		["serverIp", "198.51.100.20"],
		["serverPrefix", 1],
		["serverGateway", "bad"],
		["tlsTrusted", false],
		["certificateName", "wrong.test"],
		["blockedPort", "443"],
	] as const)(
		"translates the %s=%s failure and its preceding trace",
		(key, setting) => {
			const config: NetworkConfig = { ...defaultNetwork(), [key]: setting };
			const german = simulate(config, HOSTNAME, "https", "de"),
				english = simulate(config, HOSTNAME, "https", "en");
			expect(english.success).toBe(false);
			expect(english.code).toBe(german.code);
			expect(english.summary).not.toBe(german.summary);
			expectEnglish(JSON.stringify(english));
		},
	);
	it.each(["ping", "dns", "http", "https"] as RequestKind[])(
		"returns an English %s result and layer names",
		(kind) => {
			const result = simulate(defaultNetwork(), HOSTNAME, kind, "en");
			expect(result.success).toBe(true);
			expectEnglish(JSON.stringify(result));
			expect(result.trace[0].layer).toBe("Network access");
		},
	);
	it("keeps DNS success independent of webserver errors in English too", () => {
		const result = simulate(
			{
				...defaultNetwork(),
				serverIp: "bad",
				serverCable: false,
				serverGateway: "bad",
			},
			HOSTNAME,
			"dns",
			"en",
		);
		expect(result.success).toBe(true);
		expect(result.summary).toContain("does not yet prove");
	});
	it("rejects an overflowing transfer-time calculation", () =>
		expect(transferSeconds(1e308, 1)).toBeNull());
});
