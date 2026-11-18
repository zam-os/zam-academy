// Small helpers for movement. Every one of them does nothing when the child
// chose the calm view or the device asks for reduced motion; then the app
// shows each result at once, with the same content.

export const MOTION_KEY = "deutsch_gs4_motion";

export function deviceCalm(): boolean {
	return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function calm(): boolean {
	return document.documentElement.dataset.motion === "calm" || deviceCalm();
}

/** Restart a CSS animation class on an element. */
export function replay(element: Element | null | undefined, className: string): void {
	if (!element || calm()) return;
	element.classList.remove(className);
	// Reading the layout restarts the animation when the class comes back.
	void (element as HTMLElement).offsetWidth;
	element.classList.add(className);
}

/** Where the keyed elements stand now, to animate them to their new places. */
export function positions(root: ParentNode, selector: string, key: string): Map<string, DOMRect> {
	const map = new Map<string, DOMRect>();
	if (calm()) return map;
	root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
		const id = el.dataset[key];
		if (id !== undefined) map.set(id, el.getBoundingClientRect());
	});
	return map;
}

/** FLIP: start each moved element at its old place and let it glide to the new one. */
export function glide(root: ParentNode, selector: string, key: string, before: Map<string, DOMRect>): void {
	if (!before.size || calm()) return;
	root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
		const old = before.get(el.dataset[key] ?? "");
		if (!old) return;
		const now = el.getBoundingClientRect();
		const dx = old.left - now.left;
		const dy = old.top - now.top;
		if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
		el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
			duration: 380,
			easing: "cubic-bezier(.2,.9,.3,1.2)",
		});
	});
}

/** Let an element fly in from where something else stood (a word into a basket). */
export function flyFrom(from: DOMRect, element: Element | null | undefined): void {
	if (!element || calm()) return;
	const to = element.getBoundingClientRect();
	element.animate(
		[{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(1.25)` }, { transform: "none" }],
		{ duration: 520, easing: "cubic-bezier(.2,.8,.3,1.15)" },
	);
}

let typing = 0;

/**
 * Tinto writes a text into `target` letter by letter, in at most about two
 * seconds. The full text is already in the page for screen readers.
 */
export function typewrite(target: HTMLElement, text: string): void {
	window.clearInterval(typing);
	const letters = [...text];
	if (calm()) {
		target.textContent = text;
		return;
	}
	const per = Math.max(1, Math.ceil(letters.length / 70));
	let shown = 0;
	target.textContent = "";
	target.classList.add("writing");
	typing = window.setInterval(() => {
		shown = Math.min(letters.length, shown + per);
		target.textContent = letters.slice(0, shown).join("");
		if (shown >= letters.length) {
			window.clearInterval(typing);
			target.classList.remove("writing");
		}
	}, 30);
}

export function scrollIntoViewGently(element: Element | null): void {
	element?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "nearest" });
}
