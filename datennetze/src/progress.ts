import { lessons, validLessonId } from "./lessons";
import { defaultNetwork, type NetworkConfig } from "./simulator";
export interface Progress {
	version: 1;
	quiz: string[];
	activities: string[];
	lab: string[];
	lastLesson: string;
	network: NetworkConfig;
}
export const STORAGE_KEY = "zam-academy-datennetze-v1";
export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}
export function freshProgress(): Progress {
	return {
		version: 1,
		quiz: [],
		activities: [],
		lab: [],
		lastLesson: lessons[0].id,
		network: defaultNetwork(),
	};
}
export function loadProgress(storage: StorageLike): {
	progress: Progress;
	available: boolean;
} {
	try {
		const raw = storage.getItem(STORAGE_KEY);
		if (!raw) return { progress: freshProgress(), available: true };
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
			return { progress: freshProgress(), available: true };
		const value = parsed as Record<string, unknown>,
			result = freshProgress();
		if (value.version !== 1) return { progress: result, available: true };
		const known = new Set(lessons.map((lesson) => lesson.id));
		for (const key of ["quiz", "activities"] as const)
			result[key] = Array.isArray(value[key])
				? [
						...new Set(
							value[key].filter(
								(id): id is string => typeof id === "string" && known.has(id),
							),
						),
					]
				: [];
		result.lab = Array.isArray(value.lab)
			? [
					...new Set(
						value.lab.filter(
							(id): id is string =>
								typeof id === "string" &&
								[
									"gateway",
									"dns",
									"prefix",
									"cable",
									"return",
									"https",
									"firewall",
								].includes(id),
						),
					),
				]
			: [];
		result.lastLesson = validLessonId(
			typeof value.lastLesson === "string" ? value.lastLesson : null,
		);
		if (
			value.network &&
			typeof value.network === "object" &&
			!Array.isArray(value.network)
		) {
			const saved = value.network as Record<string, unknown>;
			for (const key of Object.keys(result.network) as Array<
				keyof NetworkConfig
			>) {
				const candidate = saved[key];
				if (
					typeof candidate === typeof result.network[key] &&
					(typeof candidate !== "number" || Number.isFinite(candidate)) &&
					(typeof candidate !== "string" || candidate.length <= 253)
				)
					(result.network as unknown as Record<string, unknown>)[key] =
						candidate;
			}
			if (!["none", "80", "443"].includes(result.network.blockedPort))
				result.network.blockedPort = "none";
		}
		return { progress: result, available: true };
	} catch {
		return { progress: freshProgress(), available: false };
	}
}
export function saveProgress(
	storage: StorageLike,
	progress: Progress,
): boolean {
	try {
		storage.setItem(STORAGE_KEY, JSON.stringify(progress));
		return true;
	} catch {
		return false;
	}
}
export function complete(progress: Progress, id: string): boolean {
	return progress.quiz.includes(id) && progress.activities.includes(id);
}
