import { esc } from "./practice";
import type { ExplorerDiagram } from "./types";

function wrapSvgText(text: string, maxChars: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length <= maxChars || !current) {
			current = candidate;
		} else {
			lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);
	return lines.slice(0, 3);
}

/**
 * Renders an interactive three-part SVG explorer diagram for every lesson.
 * Clicking or focusing any part highlights its SVG group and updates the
 * explanatory caption below.
 */
export function renderExplorerDiagram(diagram: ExplorerDiagram): string {
	const xs = [16, 252, 488];
	const cardW = 216;
	const cardH = 136;
	const yBase =
		diagram.layout === "hierarchy" ? [38, 24, 10] : [26, 26, 26];

	const connectors =
		diagram.layout === "flow"
			? `<g class="diagram-connectors" aria-hidden="true">
					<line x1="234" y1="94" x2="249" y2="94"/>
					<polygon points="249,94 242,89 242,99"/>
					<line x1="470" y1="94" x2="485" y2="94"/>
					<polygon points="485,94 478,89 478,99"/>
				</g>`
			: diagram.layout === "contrast"
				? `<g class="diagram-connectors" aria-hidden="true">
						<line x1="242" y1="36" x2="242" y2="152" stroke-dasharray="4 4"/>
						<line x1="478" y1="36" x2="478" y2="152" stroke-dasharray="4 4"/>
					</g>`
				: diagram.layout === "hierarchy"
					? `<g class="diagram-connectors" aria-hidden="true">
							<path d="M232 106 L250 92" />
							<path d="M468 92 L486 78" />
						</g>`
					: "";

	const cards = diagram.parts
		.map((part, index) => {
			const x = xs[index];
			const y = yBase[index];
			const cx = x + cardW / 2;
			const titleLines = wrapSvgText(part.title, 22);
			const formulaLines = wrapSvgText(part.formula, 24);
			return `<g class="diagram-node" data-diagram-node="${index}" data-active="${index === 0 ? "true" : "false"}" role="button" tabindex="0" aria-label="${esc(part.tag)}: ${esc(part.title)}">
				<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="12" class="diagram-card"/>
				<rect x="${x + 12}" y="${y + 12}" width="${cardW - 24}" height="22" rx="6" class="diagram-pill"/>
				<text x="${cx}" y="${y + 27}" text-anchor="middle" class="diagram-tag">${esc(part.tag)}</text>
				<text x="${cx}" y="${y + 56}" text-anchor="middle" class="diagram-title">${titleLines
					.map(
						(line, li) =>
							`<tspan x="${cx}" dy="${li === 0 ? 0 : 17}">${esc(line)}</tspan>`,
					)
					.join("")}</text>
				<text x="${cx}" y="${y + 100}" text-anchor="middle" class="diagram-formula">${formulaLines
					.map(
						(line, li) =>
							`<tspan x="${cx}" dy="${li === 0 ? 0 : 15}">${esc(line)}</tspan>`,
					)
					.join("")}</text>
			</g>`;
		})
		.join("");

	return `<figure class="explorer-diagram" data-explorer>
		<div class="explorer-header">
			<div>
				<h3>${esc(diagram.title)}</h3>
				<p class="small">${esc(diagram.subtitle)}</p>
			</div>
			<div class="explorer-tabs" role="group" aria-label="Teilgruppe im Schaubild wählen">
				${diagram.parts
					.map(
						(part, index) =>
							`<button type="button" class="chip-button" data-diagram-btn="${index}" aria-pressed="${index === 0 ? "true" : "false"}">${index + 1} · ${esc(part.tag)}</button>`,
					)
					.join("")}
			</div>
		</div>
		<svg viewBox="0 0 720 186" role="img" aria-label="${esc(diagram.title)}: ${esc(diagram.parts.map((p) => p.title).join(", "))}">
			${connectors}
			${cards}
		</svg>
		<figcaption class="explorer-note" data-diagram-note aria-live="polite">
			<strong>${esc(diagram.parts[0].tag)} — ${esc(diagram.parts[0].title)}:</strong> ${esc(diagram.parts[0].note)}
		</figcaption>
	</figure>`;
}

export function bindExplorerDiagram(
	diagram: ExplorerDiagram,
	container: HTMLElement,
): void {
	const root = container.querySelector<HTMLElement>("[data-explorer]");
	if (!root) return;
	const select = (index: number) => {
		const safe = Math.max(0, Math.min(diagram.parts.length - 1, index));
		root.querySelectorAll<SVGElement>("[data-diagram-node]").forEach((node, i) => {
			node.dataset.active = String(i === safe);
		});
		root
			.querySelectorAll<HTMLButtonElement>("[data-diagram-btn]")
			.forEach((btn, i) => {
				btn.setAttribute("aria-pressed", String(i === safe));
			});
		const part = diagram.parts[safe];
		const note = root.querySelector<HTMLElement>("[data-diagram-note]");
		if (note) {
			note.innerHTML = `<strong>${esc(part.tag)} — ${esc(part.title)}:</strong> ${esc(part.note)}`;
		}
	};
	root.querySelectorAll<HTMLButtonElement>("[data-diagram-btn]").forEach((btn, i) => {
		btn.addEventListener("click", () => select(i));
	});
	root.querySelectorAll<SVGElement>("[data-diagram-node]").forEach((node, i) => {
		node.addEventListener("click", () => select(i));
		node.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				select(i);
			}
		});
	});
}
