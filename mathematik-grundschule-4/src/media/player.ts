import register from "../../media-register.json";

export const mediaReady = String(register.status) === "approved";
export const chapters = register.chapters;
const captionUrls = new WeakMap<HTMLElement, string>();

export function teacherPanel(): string {
	return `<details class="teacher-panel"><summary><span aria-hidden="true">▶</span> So geht’s: Erklärung und Lehrervideo</summary>
    <div class="teacher-content"><p class="eyebrow">Schritt für Schritt verstehen</p><h3>Jede Stelle hat ihren Wert</h3>
    ${mediaReady ? '<div id="teacher-player"></div><button data-action="video">Lehrervideo laden</button>' : '<div class="video-pending"><span aria-hidden="true">🎬</span><div><strong>Das Lehrervideo kommt noch.</strong><p>Mit den Bildern und Erklärungen kannst du schon loslegen.</p></div></div>'}
    <div class="explanation-grid"><section><h4>Zahlen bauen</h4><div class="example-table" aria-label="3 Hunderter, 0 Zehner, 6 Einer"><span>H<b>3</b></span><span>Z<b>0</b></span><span>E<b>6</b></span></div><p>Drei Hunderter, kein Zehner und sechs Einer ergeben <strong>306</strong>. Die Null hält den Platz der Zehner frei.</p></section>
    <section><h4>Der Platz zählt</h4><p>Die 6 in <strong>306</strong> bedeutet 6 Einer. Die 6 in <strong>360</strong> bedeutet 6 Zehner, also 60. Dieselbe Ziffer hat an einer anderen Stelle einen anderen Wert.</p></section>
    <section><h4>Bündeln</h4><div class="exchange-picture" aria-label="10 Einer werden zu einem Zehner"><span>10 Einer</span><b aria-hidden="true">⇄</b><span>1 Zehner</span></div><p>Zehn Einer sind genauso viel wie ein Zehner. Du kannst in beide Richtungen tauschen.</p></section>
    <section><h4>Entbündeln</h4><div class="exchange-picture" aria-label="1 Hunderter wird zu 10 Zehnern"><span>1 Hunderter</span><b aria-hidden="true">⇄</b><span>10 Zehner</span></div><p>In 142 kannst du den Hunderter gegen zehn Zehner tauschen. Dann liegen 14 Zehner und 2 Einer da. Es bleibt <strong>142</strong>.</p></section></div>
    <p class="teacher-note">Erprobungsfassung: Die fachliche Freigabe durch eine Grundschullehrkraft und die Aufnahme stehen noch aus.</p></div></details>`;
}

/** Media bytes are attached only after the learner requests playback. */
export function loadTeacherPlayer(host: HTMLElement): void {
	const media = register as unknown as {
		video: { path: string } | null;
		captions: { path: string; text: string } | null;
		poster: { path: string } | null;
		transcript: { path: string; text: string } | null;
	};
	if (
		!mediaReady ||
		!media.video ||
		!media.captions ||
		!media.transcript ||
		!media.captions.text ||
		!media.transcript.text
	)
		return;
	const safePath = (path: string) =>
		/^media\/[a-z0-9-]+\.(mp4|vtt|webp)$/.test(path);
	if (!safePath(media.video.path) || !safePath(media.captions.path)) return;
	const video = document.createElement("video");
	video.controls = true;
	video.preload = "none";
	video.setAttribute("aria-label", "Lehrervideo: Milos Stellenwert-Werkstatt");
	video.src = `./${media.video.path}`;
	if (media.poster && safePath(media.poster.path))
		video.poster = `./${media.poster.path}`;
	const track = document.createElement("track");
	track.kind = "captions";
	track.srclang = "de";
	track.label = "Deutsch";
	track.default = true;
	const captionsUrl = URL.createObjectURL(
		new Blob([media.captions.text], { type: "text/vtt" }),
	);
	const previousUrl = captionUrls.get(host);
	if (previousUrl) URL.revokeObjectURL(previousUrl);
	captionUrls.set(host, captionsUrl);
	track.src = captionsUrl;
	video.append(track);
	// A blob avoids file-origin restrictions on local caption files in the ZIP.
	// Keep the URL alive during media resource selection; documents release it on unload.
	const status = document.createElement("p");
	status.setAttribute("role", "status");
	video.addEventListener("error", () => {
		status.textContent =
			"Das Video lässt sich gerade nicht abspielen. Die Erklärung darunter bleibt für dich da. Du kannst es erneut laden.";
	});
	const buttons = document.createElement("div");
	buttons.className = "chapter-buttons";
	for (const chapter of chapters) {
		const button = document.createElement("button");
		button.textContent = chapter.title;
		button.addEventListener("click", () => {
			if (video.readyState >= 1) video.currentTime = chapter.start;
			else {
				video.addEventListener(
					"loadedmetadata",
					() => {
						video.currentTime = chapter.start;
					},
					{ once: true },
				);
				video.load();
			}
			video.focus();
		});
		buttons.append(button);
	}
	const transcript = document.createElement("details");
	const summary = document.createElement("summary");
	summary.textContent = "Wortlaut des Lehrervideos";
	const text = document.createElement("p");
	text.textContent = media.transcript.text;
	text.style.whiteSpace = "pre-wrap";
	transcript.append(summary, text);
	host.replaceChildren(video, buttons, status, transcript);
}
