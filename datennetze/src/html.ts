/** Render learner-controlled values as text, including inside quoted attributes. */
export function escapeHtml(value: unknown): string {
	return String(value).replace(
		/[&<>"']/g,
		(char) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				char
			]!,
	);
}
