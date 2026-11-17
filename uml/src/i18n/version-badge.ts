// Version badge of the zam-home-link in German and English.

/**
 * The version badge inside the `zam-home-link` of index.html is German (the
 * package standard writes it with scripts/package-version.mjs). In English
 * mode it shows the same version and teacher-review status in English.
 */
export function englishVersionBadge(
	german: string,
): { text: string; title: string } | null {
	const version = /Version\s(\d+)\.(\d+)/.exec(german);
	if (!version) return null;
	const major = Number(version[1]);
	const [label, title] =
		major === 0
			? ["teacher review open", "Not yet reviewed by a teacher"]
			: major === 1
				? ["reviewed by a teacher", "Reviewed by a teacher"]
				: ["new package generation", "New package generation"];
	return {
		text: `· Version ${version[1]}.${version[2]} · ${label.replaceAll(" ", " ")}`,
		title,
	};
}

/** Switches the badge between its German original and English. */
export function localizeVersionBadge(english: boolean): void {
	const badge = document.querySelector<HTMLElement>(".zam-version");
	if (!badge) return;
	badge.dataset.de ??= badge.textContent ?? "";
	badge.dataset.deTitle ??= badge.title;
	const en = english ? englishVersionBadge(badge.dataset.de) : null;
	badge.textContent = en?.text ?? badge.dataset.de;
	badge.title = en?.title ?? badge.dataset.deTitle;
}
