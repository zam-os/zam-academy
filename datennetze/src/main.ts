import "./styles.css";
import { escapeHtml } from "./html";
import {
	LANGUAGE_KEY,
	type Language,
	languageHash,
	readLanguage,
	translator,
} from "./i18n";
import {
	getLessons,
	getStages,
	type Lesson,
	optionOrder,
	protocolReferences,
	validLessonId,
} from "./lessons";
import {
	complete,
	freshProgress,
	loadProgress,
	saveProgress,
} from "./progress";
import {
	challengeSolved,
	challenges,
	defaultNetwork,
	dhcpLease,
	HOSTNAME,
	type NetworkConfig,
	type RequestKind,
	type Simulation,
	simulate,
	subnetInfo,
	transferSeconds,
} from "./simulator";

const app = document.querySelector<HTMLDivElement>("#app")!;
const storage = {
	getItem: (key: string) => window.localStorage.getItem(key),
	setItem: (key: string, value: string) =>
		window.localStorage.setItem(key, value),
};
const loaded = loadProgress(storage);
let progress = loaded.progress;
let storageAvailable = loaded.available;
let language = readLanguage(location.hash, storage);
let tr = translator(language);
let lessons = getLessons(language),
	stages = getStages(language);
let selected = validLessonId(
	new URLSearchParams(location.hash.slice(1)).get("lesson") ??
		progress.lastLesson,
);
let view: "lesson" | "lab" | "tools" = "lesson";
let quizAnswered: boolean | null = null,
	activityAnswered: boolean | null = null;
let notice:
	| ""
	| "reset"
	| "network-reset"
	| "dhcp-ok"
	| "dhcp-fail"
	| "challenge" = "";
let result: Simulation | null = null;
let challengeId = "";
let target = HOSTNAME;
let kind: RequestKind = "http";
let subnetAddress = "192.168.10.70",
	subnetPrefixDraft = "26";
let fileSizeDraft = "10",
	lineRateDraft = "100",
	efficiencyDraft = "80";
let subnetResult = subnetInfo(subnetAddress, 26),
	rateResult = transferSeconds(10, 100, 0.8);
let calculatedEfficiency = "80";
const activityDrafts: Record<string, string> = {};
const e = escapeHtml;
function save() {
	progress.lastLesson = selected;
	storageAvailable = saveProgress(storage, progress);
}
function addUnique(array: string[], value: string) {
	if (!array.includes(value)) array.push(value);
}
function current(): Lesson {
	return lessons.find((lesson) => lesson.id === selected)!;
}
function tasks() {
	return challenges(language);
}
function core() {
	return lessons.filter((lesson) => !lesson.optional);
}
function locale() {
	return language === "en" ? "en-GB" : "de-DE";
}
function syncHash() {
	history.replaceState(null, "", `#${languageHash(selected, language)}`);
}
function navigate(id: string) {
	selected = validLessonId(id);
	view = "lesson";
	quizAnswered = null;
	activityAnswered = null;
	notice = "";
	syncHash();
	save();
	render(true);
}
function switchView(next: typeof view) {
	captureInputs();
	view = next;
	notice = "";
	render(true);
}
function switchLanguage(next: Language, updateHash = true) {
	captureInputs();
	language = next;
	tr = translator(language);
	lessons = getLessons(language);
	stages = getStages(language);
	if (result) result = simulate(progress.network, target, kind, language);
	try {
		storage.setItem(LANGUAGE_KEY, language);
	} catch {
		/* Locale is still usable for this session. */
	}
	if (updateHash) syncHash();
	render();
}
function choiceButtons(options: string[], action: string, seed: string) {
	return optionOrder(options.length, seed)
		.map(
			(index) =>
				`<button class="answer" data-action="${action}" data-index="${index}"><span class="answer-dot" aria-hidden="true"></span>${e(options[index])}</button>`,
		)
		.join("");
}
function noticeText() {
	if (notice === "reset")
		return tr(
			"Dein Fortschritt wurde zurückgesetzt.",
			"Your progress has been reset.",
		);
	if (notice === "network-reset")
		return tr(
			"Das funktionierende Grundnetz ist geladen. Du kannst jetzt frei experimentieren.",
			"The working base network is loaded. You can now experiment freely.",
		);
	if (notice === "dhcp-ok")
		return tr(
			"DHCP-Lease bezogen: 192.168.10.10/24 mit Gateway und DNS-Server. Die übrige Verbindung wird separat getestet.",
			"DHCP lease obtained: 192.168.10.10/24 with a gateway and DNS server. Test the rest of the connection separately.",
		);
	if (notice === "dhcp-fail")
		return tr(
			"DHCP erreicht den Client nicht. Prüfe Clientkabel, Switch, Uplink und Router.",
			"DHCP cannot reach the client. Check the client cable, switch, uplink and router.",
		);
	if (notice === "challenge")
		return tr(
			`✓ Laborauftrag geschafft: ${tasks().find((task) => task.id === challengeId)?.title ?? ""}. Du kannst im Lernpfad weiterarbeiten.`,
			`✓ Lab challenge completed: ${tasks().find((task) => task.id === challengeId)?.title ?? ""}. Continue in the learning path whenever you are ready.`,
		);
	return "";
}
function header() {
	const done = core().filter((lesson) => complete(progress, lesson.id)).length;
	return `<header class="topbar"><a class="brand" href="#${languageHash("net-netzwerk", language)}" aria-label="${tr("ZAM Academy Datennetze, Start", "ZAM Academy Networks, home")}"><span class="brand-mark" aria-hidden="true">Z</span><span>ZAM <b>ACADEMY</b></span></a><span class="top-label">${tr("INFORMATIONSTECHNOLOGIE · 2.5.1", "INFORMATION TECHNOLOGY · 2.5.1")}</span><div class="language-switch" role="group" aria-label="${tr("Sprache", "Language")}"><button data-language="de" lang="de" aria-pressed="${language === "de"}">DE</button><button data-language="en" lang="en" aria-pressed="${language === "en"}">EN</button></div><button class="text-button" data-action="reset">${tr("Fortschritt zurücksetzen", "Reset progress")}</button></header>
  <div class="hero"><div><p class="eyebrow">${tr("VERBINDEN. VERSTEHEN. AUSPROBIEREN.", "CONNECT. UNDERSTAND. EXPERIMENT.")}</p><h1>${tr("Wie kommt die Seite<br>auf deinen Bildschirm?", "How does a web page<br>reach your screen?")}</h1><p class="hero-copy">${tr('Baue ein Netzwerk, verfolge Daten und finde heraus,<br class="desktop-break"> warum eine Verbindung manchmal stehen bleibt.', 'Build a network, follow the data and discover<br class="desktop-break"> why a connection sometimes gets stuck.')}</p><div class="hero-badges"><span>${tr("18 Kernlektionen", "18 core lessons")}</span><span>${tr("7 Laboraufträge", "7 lab challenges")}</span><span>${tr("Offline nutzbar", "Works offline")}</span></div></div><div class="hero-art" aria-label="${tr("Netzwerk aus Client, Router und Server", "A network of client, router and server")}"><div class="art-route"><span class="art-node">CLIENT<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="36" height="25" rx="4"/><path d="M16 41h16M24 33v8"/></svg></span><span class="route-dots">·····</span><span class="art-node router">ROUTER<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="23" width="36" height="17" rx="5"/><path d="M12 23V8M36 23V8M14 32h1M23 32h1"/></svg></span><span class="route-dots">·····</span><span class="art-node">SERVER<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="5" width="28" height="38" rx="4"/><path d="M10 18h28M10 30h28M17 11h1M17 24h1M17 36h1"/></svg></span></div><p>${tr("Eine Anfrage. Viele gute Verbindungen.", "One request. Many useful connections.")}</p></div></div>
  <nav class="view-tabs" aria-label="${tr("Arbeitsbereich", "Workspace")}"><button data-view="lesson" class="${view === "lesson" ? "active" : ""}" aria-current="${view === "lesson" ? "page" : "false"}">${tr("Lernpfad", "Learning path")} <span>${done}/${core().length}</span></button><button data-view="lab" class="${view === "lab" ? "active" : ""}" aria-current="${view === "lab" ? "page" : "false"}">${tr("Netzwerklabor", "Network lab")} <span>${progress.lab.length}/7</span></button><button data-view="tools" class="${view === "tools" ? "active" : ""}" aria-current="${view === "tools" ? "page" : "false"}">${tr("Adress- &amp; Datenratenwerkzeug", "Address &amp; transfer tools")}</button></nav>`;
}
function lessonView() {
	const lesson = current(),
		index = lessons.indexOf(lesson),
		activity = lesson.activity;
	const quizFeedback =
		quizAnswered === null
			? ""
			: `${quizAnswered ? tr("✓ Richtig. ", "✓ Correct. ") : tr("Noch nicht. ", "Not quite. ")}${lesson.quiz.feedback}`;
	const activityFeedback =
		activityAnswered === null || activity.kind === "lab"
			? ""
			: `${activityAnswered ? tr("✓ Richtig. ", "✓ Correct. ") : tr("Noch nicht. ", "Not quite. ")}${activity.feedback}`;
	return `<div class="learning-layout"><aside class="sidebar"><div class="sidebar-heading"><p class="eyebrow">${tr("DEIN LERNPFAD", "YOUR LEARNING PATH")}</p><span>${core().filter((l) => complete(progress, l.id)).length} ${tr("von", "of")} 18</span></div>${stages
		.map(
			(title, n) =>
				`<section class="stage"><h2><span>0${n + 1}</span>${e(title)}</h2>${lessons
					.filter((l) => l.stage === n + 1)
					.map(
						(l) =>
							`<button class="lesson-link ${selected === l.id ? "selected" : ""}" data-lesson="${l.id}" ${selected === l.id ? 'aria-current="step"' : ""}><span class="lesson-status ${complete(progress, l.id) ? "done" : ""}" aria-hidden="true">${complete(progress, l.id) ? "✓" : ""}</span><span>${e(l.title)}${l.optional ? `<small>${tr("HTTPS-Ergänzung", "HTTPS extension")}</small>` : ""}</span></button>`,
					)
					.join("")}</section>`,
		)
		.join(
			"",
		)}<div class="sidebar-note">${tr("Dein Fortschritt bleibt in diesem Browser.", "Your progress stays in this browser.")} ${storageAvailable ? tr("Kein Konto nötig.", "No account needed.") : tr("Speichern ist hier gesperrt; du kannst weiterüben.", "Storage is blocked here; you can keep practising.")}</div></aside>
  <main class="lesson-panel" id="main-content" tabindex="-1"><div class="lesson-topline"><span class="section-label">${tr("ETAPPE", "STAGE")} ${lesson.stage} · ${e(stages[lesson.stage - 1])}</span><span class="lesson-count">${String(index + 1).padStart(2, "0")} / 19</span></div>${lesson.optional ? `<p class="extension-tag">${tr("HTTPS-Ergänzung · kein vollständiger Kurs Datennetze II", "HTTPS extension · not a complete Datennetze II course")}</p>` : ""}<h2 class="lesson-title">${e(lesson.title)}</h2><p class="lesson-intro">${e(lesson.intro)}</p><div class="reading">${lesson.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}</div><div class="example"><span class="eyebrow">${tr("EIN BEISPIEL", "AN EXAMPLE")}</span><p>${e(lesson.example)}</p></div><div class="takeaway"><span aria-hidden="true">↳</span><p>${e(lesson.takeaway)}</p></div><details class="references"><summary>${tr("Quellen und Vertiefung", "Sources and further reading")}</summary><a href="https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it" target="_blank" rel="noopener noreferrer">${tr("LehrplanPLUS · Informationstechnologie", "LehrplanPLUS · Information Technology (German)")} ↗</a>${(protocolReferences[lesson.id] ?? []).map((source) => `<a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(language === "en" ? source.label.replace("(englisch)", "(English)") : source.label)} ↗</a>`).join("")}<p>${tr("Redaktionsstand: 21. Oktober 2026. Erklärungen und Übungsfälle sind eigenständig verfasst.", "Content reviewed: 21 October 2026. Explanations and exercises are independently written.")}</p></details>
  <section class="practice"><div class="section-top"><span class="eyebrow">${tr("01 · KURZ PRÜFEN", "01 · QUICK CHECK")}</span>${progress.quiz.includes(lesson.id) ? `<span class="success-tag">${tr("Geschafft", "Completed")}</span>` : ""}</div><h3>${e(lesson.quiz.question)}</h3><div class="answers">${choiceButtons(lesson.quiz.options, "quiz", lesson.id)}</div><p class="feedback" role="status">${e(quizFeedback)}</p></section>
  <section class="practice"><div class="section-top"><span class="eyebrow">${tr("02 · SELBST ANWENDEN", "02 · PUT IT INTO PRACTICE")}</span>${progress.activities.includes(lesson.id) ? `<span class="success-tag">${tr("Geschafft", "Completed")}</span>` : ""}</div><h3>${e(activity.prompt)}</h3>${activity.kind === "choice" ? `<div class="answers">${choiceButtons(activity.options, "activity-choice", `${lesson.id}-activity`)}</div>` : activity.kind === "number" ? `<form data-form="activity-number" class="number-form"><label>${tr("Dein Ergebnis", "Your answer")} <span class="input-unit"><input id="activity-answer" value="${e(activityDrafts[lesson.id] ?? "")}" type="text" inputmode="decimal" autocomplete="off" required aria-label="${tr("Dein Ergebnis in", "Your answer in")} ${e(activity.unit)}"><span>${e(activity.unit)}</span></span></label><button class="primary" type="submit">${tr("Ergebnis prüfen", "Check answer")}</button></form>` : `<div class="lab-callout"><p>${tr("Der Auftrag öffnet eine absichtlich fehlerhafte Konfiguration. Ein erfolgreicher Test mit dem geforderten Dienst zählt als Lösung.", "The challenge opens a deliberately faulty configuration. A successful test using the requested service completes it.")}</p><button class="primary" data-action="start-lesson-lab" data-challenge="${e(activity.challenge)}">${tr("Auftrag im Labor starten", "Start the lab challenge")} <span aria-hidden="true">↗</span></button></div>`}<p class="feedback" role="status">${e(activityFeedback)}</p></section>
  <div class="lesson-footer"><button class="secondary" data-action="previous" ${index === 0 ? "disabled" : ""}>← ${tr("Zurück", "Previous")}</button><span>${complete(progress, lesson.id) ? tr("✓ Lektion bearbeitet", "✓ Lesson completed") : tr("Kurzprüfung und Anwendung bearbeiten", "Complete the check and the practice")}</span><button class="primary" data-action="next" ${index === lessons.length - 1 ? "disabled" : ""}>${tr("Weiter", "Next")} →</button></div></main></div>`;
}
function textField(key: keyof NetworkConfig, label: string, hint?: string) {
	return `<label>${e(label)}<input data-config="${key}" value="${e(progress.network[key])}" autocomplete="off" spellcheck="false" ${key.includes("Prefix") ? 'type="number" min="1" max="30"' : 'type="text"'}>${hint ? `<small>${e(hint)}</small>` : ""}</label>`;
}
function checkField(key: keyof NetworkConfig, label: string) {
	return `<label class="check-field"><input type="checkbox" data-config="${key}" ${progress.network[key] ? "checked" : ""}><span>${e(label)}</span></label>`;
}
function topology() {
	const c = progress.network;
	const line = (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		good: boolean,
	) =>
		`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${good ? "wire" : "wire broken"}"/>`;
	return `<div class="topology-wrap"><svg class="topology" viewBox="0 0 820 225" role="img" aria-label="${tr("Client über Switch und Router zum Server und DNS. Durchgezogene Linien sind verbunden; gestrichelte rote Linien sind unterbrochen.", "Client through switch and router to the server and DNS. Solid lines are connected; dashed red lines are disconnected.")}"><rect class="network-zone" x="12" y="18" width="360" height="185" rx="18"/><rect class="network-zone remote" x="450" y="18" width="355" height="185" rx="18"/><text class="zone-label" x="32" y="44">CLIENT-LAN · 192.168.10.0/24</text><text class="zone-label" x="475" y="44">${tr("SERVERNETZ", "SERVER NETWORK")} · 203.0.113.0/24</text>${line(102, 115, 245, 115, c.clientCable && c.switchOn)}${line(280, 115, 410, 115, c.uplink && c.routerOn && c.switchOn)}${line(437, 105, 650, 86, c.serverCable && c.routerOn)}${line(437, 129, 650, 161, c.dnsCable && c.routerOn)}<g class="diagram-node"><rect x="42" y="79" width="120" height="66" rx="10"/><text x="102" y="104">Client</text><text class="mono-label" x="102" y="126">${e(c.clientIp)}</text></g><g class="diagram-node"><rect x="218" y="86" width="88" height="58" rx="10"/><text x="262" y="120">Switch ${c.switchOn ? "" : tr("AUS", "OFF")}</text></g><g class="diagram-node router-node"><rect x="362" y="77" width="112" height="80" rx="14"/><text x="418" y="108">Router</text><text class="mono-label" x="418" y="129">${c.routerOn ? ".1 ↔ .1" : tr("AUS", "OFF")}</text></g><g class="diagram-node"><rect x="633" y="58" width="145" height="58" rx="10"/><text x="706" y="82">${tr("Webserver", "Web server")}</text><text class="mono-label" x="706" y="102">${e(c.serverIp)}</text></g><g class="diagram-node"><rect x="633" y="135" width="145" height="58" rx="10"/><text x="706" y="158">DNS</text><text class="mono-label" x="706" y="178">203.0.113.53</text></g></svg></div>`;
}
function labView() {
	const task = tasks().find((item) => item.id === challengeId);
	return `<main id="main-content" tabindex="-1" class="lab-main"><div class="page-heading"><div><p class="eyebrow">${tr("DEIN EIGENES LEHRNETZ", "YOUR OWN TEACHING NETWORK")}</p><h2>${tr("Eine Verbindung, Schritt für Schritt.", "A connection, step by step.")}</h2><p>${tr("Alles bleibt in dieser Simulation. Es werden keine echten Anfragen gesendet.", "Everything stays in this simulation. No real network requests are sent.")}</p></div><button class="secondary" data-action="network-reset">${tr("Funktionierendes Netz laden", "Load working network")}</button></div><section class="challenge-bar"><div><label for="challenge-select">${tr("Laborauftrag", "Lab challenge")}</label><select id="challenge-select"><option value="">${tr("Freies Labor", "Free lab")}</option>${tasks()
		.map(
			(t) =>
				`<option value="${t.id}" ${t.id === challengeId ? "selected" : ""}>${e(t.title)}${progress.lab.includes(t.id) ? tr(" · geschafft", " · completed") : ""}</option>`,
		)
		.join(
			"",
		)}</select></div><p>${task ? e(task.instruction) : tr("Verändere Einstellungen und vergleiche: Welcher Test schlägt an welcher Stelle fehl?", "Change settings and compare: which test fails, and at which step?")}</p><button class="secondary" data-action="load-challenge" ${task ? "" : "disabled"}>${tr("Auftrag neu laden", "Reload challenge")}</button></section>${topology()}<p class="topology-caption">${tr("Die beiden Router-Schnittstellen sind fest: LAN 192.168.10.1/24 · Servernetz 203.0.113.1/24. MAC-Adressen bleiben im Modell fest.", "The router interfaces are fixed: LAN 192.168.10.1/24 · server network 203.0.113.1/24. MAC addresses remain fixed in the model.")}</p>
  <div class="config-grid"><section class="config-card"><div class="section-top"><h3>01 · Client</h3><button class="small-button" data-action="dhcp">${tr("DHCP beziehen", "Obtain DHCP lease")}</button></div>${textField("clientIp", tr("IPv4-Adresse", "IPv4 address"))}${textField("clientPrefix", tr("Präfix", "Prefix"), tr("Für dieses LAN: /24", "For this LAN: /24"))}${textField("gateway", tr("Standardgateway", "Default gateway"))}${textField("dns", tr("DNS-Server", "DNS server"))}</section><section class="config-card"><h3>02 · ${tr("Webserver &amp; DNS", "Web server &amp; DNS")}</h3>${textField("serverIp", tr("Server-IP", "Server IP"))}${textField("serverPrefix", tr("Serverpräfix", "Server prefix"))}${textField("serverGateway", tr("Server-Standardgateway", "Server default gateway"))}${textField("dnsRecord", tr("A-Eintrag: bibliothek.schule.test", "A record: bibliothek.schule.test"))}</section><section class="config-card"><h3>03 · ${tr("Verbindungen", "Connections")}</h3>${checkField("clientCable", tr("Client → Switch verbunden", "Client → switch connected"))}${checkField("uplink", tr("Switch → Router verbunden", "Switch → router connected"))}${checkField("serverCable", tr("Webserver verbunden", "Web server connected"))}${checkField("dnsCable", tr("DNS-Server verbunden", "DNS server connected"))}${checkField("switchOn", tr("Switch eingeschaltet", "Switch powered on"))}${checkField("routerOn", tr("Router eingeschaltet", "Router powered on"))}<p class="small-copy">${tr("Ein Switch verbindet lokal. Der Router verbindet hier die zwei IP-Netze.", "A switch connects locally. The router connects the two IP networks here.")}</p></section><section class="config-card"><h3>04 · ${tr("HTTPS-Ergänzung", "HTTPS extension")}</h3>${textField("certificateName", tr("Zertifikat gilt für den Namen", "Certificate hostname"))}${checkField("tlsTrusted", tr("Zertifikat vertrauenswürdig", "Certificate trusted"))}<label>${tr("Modell-Firewall", "Model firewall")}<select data-config="blockedPort"><option value="none" ${progress.network.blockedPort === "none" ? "selected" : ""}>${tr("Keine Sperre", "No block")}</option><option value="80" ${progress.network.blockedPort === "80" ? "selected" : ""}>${tr("TCP-Port 80 blockieren", "Block TCP port 80")}</option><option value="443" ${progress.network.blockedPort === "443" ? "selected" : ""}>${tr("TCP-Port 443 blockieren", "Block TCP port 443")}</option></select></label><p class="small-copy">${tr("Vereinfachte Zertifikatsprüfung, keine echte Kryptografie. Datennetze II bleibt ein eigener Bereich.", "Simplified certificate checking, not real cryptography. Datennetze II remains a separate area.")}</p></section></div>
  <section class="test-panel"><div class="section-top"><div><p class="eyebrow">${tr("VERBINDUNG PRÜFEN", "TEST THE CONNECTION")}</p><h3>${tr("Was passiert unterwegs?", "What happens along the way?")}</h3></div></div><form data-form="network" class="request-form"><label>${tr("Zielname oder Ziel-IP", "Destination name or IP")}<input id="target" value="${e(target)}" autocomplete="off" spellcheck="false" required></label><label>Test<select id="request-kind"><option value="ping" ${kind === "ping" ? "selected" : ""}>${tr("IP-Verbindung (Ping)", "IP connection (Ping)")}</option><option value="dns" ${kind === "dns" ? "selected" : ""}>${tr("Nur DNS", "DNS only")}</option><option value="http" ${kind === "http" ? "selected" : ""}>${tr("Webseite über HTTP", "Web page over HTTP")}</option><option value="https" ${kind === "https" ? "selected" : ""}>${tr("Webseite über HTTPS", "Web page over HTTPS")}</option></select></label><button class="primary" type="submit">${tr("Verbindung testen", "Test connection")} →</button></form><div class="result" aria-live="polite">${result ? `<div class="result-summary ${result.success ? "success" : "failure"}"><strong>${result.success ? tr("✓ Test erfolgreich", "✓ Test successful") : tr("Hier bleibt die Verbindung stehen", "The connection stops here")}</strong><p>${e(result.summary)}</p></div><ol class="trace">${result.trace.map((step, n) => `<li class="${step.status}"><span class="trace-number">${step.status === "error" ? "!" : n + 1}</span><div><small>${e(step.layer)}</small><strong>${e(step.title)}</strong><p>${e(step.detail)}</p></div></li>`).join("")}</ol>` : `<p class="empty-state">${tr("Starte einen Test. Der Ablauf zeigt dir die erste Stelle, an der das Modell stoppt.", "Run a test. The trace shows the first step at which the model stops.")}</p>`}</div></section><div class="model-limits"><h3>${tr("Was dieses Modell zeigt", "What this model shows")}</h3><p>${tr("Zwei feste IPv4-Netze, lokale Verbindungen, Namensauflösung, Hin- und Rückroute sowie ausgewählte Webdienste. Der DNS-Server besitzt im Modell eine passende feste Konfiguration. Keine echten Pakete, kein NAT, keine Zeitmessung, keine vollständige Routingtabelle, kein IPv6 und keine echte Zertifikatsprüfung.", "Two fixed IPv4 networks, local links, name resolution, outward and return routes, and selected web services. The model’s DNS server has a suitable fixed configuration. No real packets, NAT, timing measurements, full routing table, IPv6 or real certificate validation.")}</p></div></main>`;
}
function toolsView() {
	const subnet = subnetResult,
		seconds = rateResult;
	return `<main id="main-content" tabindex="-1" class="tools-main"><div class="page-heading"><div><p class="eyebrow">${tr("SELBST NACHRECHNEN", "CALCULATE AND EXPLORE")}</p><h2>${tr("Adressen bekommen eine Grenze.", "Give addresses a boundary.")}</h2><p>${tr("Verändere Werte und erkläre anschließend, warum sich das Ergebnis ändert.", "Change the values, then explain why the result changes.")}</p></div></div><div class="tools-grid"><section class="tool-card"><span class="tool-icon" aria-hidden="true">/</span><h3>${tr("Welches Subnetz ist das?", "Which subnet is this?")}</h3><form data-form="subnet"><label>${tr("IPv4-Adresse", "IPv4 address")}<input id="subnet-address" value="${e(subnetAddress)}" spellcheck="false" autocomplete="off"></label><label>${tr("Präfix", "Prefix")} /<input id="subnet-prefix" value="${e(subnetPrefixDraft)}" type="number" min="0" max="32"></label><button class="primary" type="submit">${tr("Subnetz berechnen", "Calculate subnet")}</button></form><div class="tool-result" aria-live="polite">${subnet ? `<dl><div><dt>${tr("Netzadresse", "Network address")}</dt><dd>${subnet.network}/${subnet.prefix}</dd></div><div><dt>${subnet.prefix >= 31 ? tr("Letzte Adresse", "Last address") : "Broadcast"}</dt><dd>${subnet.broadcast}</dd></div><div><dt>${subnet.prefix >= 31 ? tr("Adressbereich", "Address range") : tr("Übliche Hostadressen", "Ordinary host addresses")}</dt><dd>${subnet.firstHost} – ${subnet.lastHost}</dd></div><div><dt>${subnet.prefix >= 31 ? tr("Adressen im Sonderfall", "Addresses in this special case") : "Hosts"}</dt><dd>${subnet.hosts.toLocaleString(locale())}</dd></div></dl>` : `<p class="error-text">${tr("Bitte vier Oktette von 0 bis 255 und ein ganzzahliges Präfix /0 bis /32 eingeben.", "Enter four octets from 0 to 255 and a whole-number prefix from /0 to /32.")}</p>`}</div><p class="small-copy">${tr("Bei /31 gilt hier die Punkt-zu-Punkt-Konvention mit zwei Adressen, bei /32 eine Einzeladresse. Im Netzwerklabor verwenden wir übliche Hostnetze /1 bis /30.", "Here, /31 uses the point-to-point convention with two addresses; /32 is one address. The network lab uses ordinary host networks from /1 to /30.")}</p></section><section class="tool-card"><span class="tool-icon" aria-hidden="true">↗</span><h3>${tr("Wie lange dauert die Übertragung?", "How long does the transfer take?")}</h3><form data-form="rate"><label>${tr("Dateigröße in MiB", "File size in MiB")}<input id="file-size" type="number" value="${e(fileSizeDraft)}" min="0" step="any"></label><label>${tr("Datenrate in Mbit/s", "Data rate in Mbit/s")}<input id="line-rate" type="number" value="${e(lineRateDraft)}" min="0.001" step="any"></label><label>${tr("Nutzanteil in %", "Usable rate in %")}<input id="efficiency" type="number" value="${e(efficiencyDraft)}" min="0.001" max="100" step="any"></label><button class="primary" type="submit">${tr("Zeit berechnen", "Calculate time")}</button></form><div class="tool-result time-result" aria-live="polite">${seconds !== null ? `<strong>${seconds.toLocaleString(locale(), { maximumFractionDigits: 3 })}<span> ${tr("Sekunden", "seconds")}</span></strong><p>${tr(`Modellzeit bei ${e(calculatedEfficiency)} % nutzbarer Datenrate`, `Model time at ${e(calculatedEfficiency)}% usable data rate`)}</p>` : `<p class="error-text">${tr("Bitte endliche positive Datenrate und Nutzanteil bis 100 % eingeben; die Dateigröße darf null sein.", "Enter a finite positive rate and a usable percentage up to 100%; file size may be zero.")}</p>`}</div><p class="small-copy">${tr("1 MiB = 1.048.576 Byte · 1 Byte = 8 Bit · 1 Mbit/s = 1.000.000 Bit/s. Der Nutzanteil ist eine frei gewählte Vereinfachung, keine Messung.", "1 MiB = 1,048,576 bytes · 1 byte = 8 bits · 1 Mbit/s = 1,000,000 bits/s. The usable percentage is a chosen simplification, not a measurement.")}</p></section></div><div class="example"><p>${tr("Zum Ausprobieren: Halbiere beim gleichen Dateiumfang die Datenrate. Verdoppelt sich die Zeit? Ändere beim Subnetz /24 zu /26. Wie viele Adressen bleiben pro Block?", "Try this: halve the data rate without changing the file size. Does the time double? Change the subnet from /24 to /26. How many addresses remain in each block?")}</p></div></main>`;
}
function render(focus = false) {
	document.documentElement.lang = language;
	document.title = tr("Datennetze · ZAM Academy", "Networks · ZAM Academy");
	app.innerHTML = `<a class="skip-link" href="#main-content">${tr("Zum Inhalt", "Skip to content")}</a>${header()}<div class="shell">${!storageAvailable ? `<div class="storage-warning" role="status">${tr("Dieser Browser erlaubt kein dauerhaftes Speichern. Du kannst weiterüben; beim Schließen kann der Fortschritt verloren gehen.", "This browser does not allow persistent storage. You can keep practising, but progress may be lost when you close it.")}</div>` : ""}${notice ? `<p class="notice" role="status">${e(noticeText())}</p>` : ""}${view === "lesson" ? lessonView() : view === "lab" ? labView() : toolsView()}</div><footer class="site-footer"><span>ZAM Academy · ${tr("Datennetze und Internet", "Networks and the Internet")}</span><p>${tr("LehrplanPLUS IT 2.5.1 · modular über Jahrgangsstufen 5–10, mit HTTPS-Ergänzung.<br>Für dein schulisches Modulangebot und praktische Arbeit im Unterricht.", "LehrplanPLUS IT 2.5.1 · modular across grades 5–10, with an HTTPS extension.<br>For school modules, hands-on practice and professional refreshers.")}</p><div><a href="https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it" target="_blank" rel="noopener noreferrer">${tr("Lehrplan öffnen", "Open curriculum (German)")} ↗</a><button data-action="zam" class="text-button">${tr("Mit ZAM behalten", "Remember with ZAM")} ↗</button></div></footer><dialog id="reset-dialog"><h2>${tr("Fortschritt zurücksetzen?", "Reset your progress?")}</h2><p>${tr("Die bearbeiteten Lektionen, Laboraufträge und gespeicherten Einstellungen dieser App werden in diesem Browser zurückgesetzt.", "Completed lessons, lab challenges and saved settings for this app will be reset in this browser.")}</p><div class="dialog-actions"><button class="secondary" data-action="cancel-reset">${tr("Abbrechen", "Cancel")}</button><button class="primary" data-action="confirm-reset">${tr("Zurücksetzen", "Reset")}</button></div></dialog><dialog id="zam-dialog"><h2>${tr("Verstanden? Mit ZAM behalten.", "Understood it? Remember it with ZAM.")}</h2><p>${tr("Öffne in ZAM die Lern-Karten und wähle „Importieren → Aus der ZAM Academy“. Suche nach „Datennetze und Internet“ und nimm die Zelle auf, sobald sie veröffentlicht ist.", "In ZAM, open the learning cards and choose Import → From ZAM Academy. Look for “Datennetze und Internet” and enrol once it is published. The current ZAM cards are in German.")}</p><p>${tr("Jede Karte führt zurück in die passende Lektion. Die App benötigt keine Anmeldung; Lernkarten und Wiederholungen verwaltet ZAM.", "Each card links back to its lesson. This app needs no account; ZAM manages the cards and spaced repetition.")}</p><button class="primary" data-action="close-zam">${tr("Verstanden", "Got it")}</button></dialog>`;
	if (focus)
		document
			.querySelector<HTMLElement>("#main-content")
			?.focus({ preventScroll: true });
}
function clearTrace() {
	const output = document.querySelector(".result");
	if (output)
		output.innerHTML = `<p class="empty-state">${tr("Einstellungen geändert. Starte einen neuen Test.", "Settings changed. Run a new test.")}</p>`;
	document.querySelector(".notice")?.remove();
}
function setChallenge(id: string) {
	challengeId = id;
	const task = tasks().find((item) => item.id === id);
	if (task) {
		progress.network = { ...task.config };
		target = task.target;
		kind = task.kind;
	}
	result = null;
	save();
}
function updateConfig(
	element: HTMLInputElement | HTMLSelectElement,
	invalidate = true,
) {
	const key = element.dataset.config as keyof NetworkConfig | undefined;
	if (!key || !(key in progress.network)) return false;
	const old = progress.network[key];
	const value =
		element instanceof HTMLInputElement && element.type === "checkbox"
			? element.checked
			: typeof old === "number"
				? element.value.trim()
					? Number(element.value)
					: Number.NaN
				: element.value;
	(progress.network as unknown as Record<string, unknown>)[key] = value;
	if (invalidate) {
		result = null;
		notice = "";
		clearTrace();
	}
	save();
	const diagram = document.querySelector(".topology-wrap");
	if (diagram) diagram.outerHTML = topology();
	return true;
}
function captureInputs() {
	document
		.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-config]")
		.forEach((element) => {
			updateConfig(element, false);
		});
	const read = (id: string, previous: string) =>
		document.querySelector<HTMLInputElement | HTMLSelectElement>(id)?.value ??
		previous;
	target = read("#target", target);
	kind = read("#request-kind", kind) as RequestKind;
	subnetAddress = read("#subnet-address", subnetAddress);
	subnetPrefixDraft = read("#subnet-prefix", subnetPrefixDraft);
	fileSizeDraft = read("#file-size", fileSizeDraft);
	lineRateDraft = read("#line-rate", lineRateDraft);
	efficiencyDraft = read("#efficiency", efficiencyDraft);
	activityDrafts[selected] = read(
		"#activity-answer",
		activityDrafts[selected] ?? "",
	);
}
app.addEventListener("click", (event) => {
	const button = (event.target as HTMLElement).closest<HTMLElement>(
		"button, a.brand",
	);
	if (!button) return;
	const action = button.dataset.action;
	if (button.dataset.language) {
		switchLanguage(button.dataset.language as Language);
		return;
	}
	if (button.matches("a.brand")) {
		event.preventDefault();
		navigate(lessons[0].id);
		return;
	}
	if (button.dataset.lesson) {
		navigate(button.dataset.lesson);
		return;
	}
	if (button.dataset.view) {
		switchView(button.dataset.view as typeof view);
		return;
	}
	if (action === "quiz") {
		quizAnswered = Number(button.dataset.index) === current().quiz.correct;
		if (quizAnswered) addUnique(progress.quiz, selected);
		save();
		render();
	}
	if (action === "activity-choice") {
		const activity = current().activity;
		if (activity.kind !== "choice") return;
		activityAnswered = Number(button.dataset.index) === activity.correct;
		if (activityAnswered) addUnique(progress.activities, selected);
		save();
		render();
	}
	if (action === "start-lesson-lab") {
		setChallenge(button.dataset.challenge!);
		view = "lab";
		render(true);
	}
	if (action === "previous" || action === "next") {
		const index = lessons.indexOf(current()) + (action === "next" ? 1 : -1);
		if (lessons[index]) navigate(lessons[index].id);
	}
	if (action === "network-reset") {
		progress.network = defaultNetwork();
		challengeId = "";
		result = null;
		notice = "network-reset";
		save();
		render();
	}
	if (action === "load-challenge") {
		setChallenge(challengeId);
		render();
	}
	if (action === "dhcp") {
		captureInputs();
		const config = dhcpLease(progress.network);
		if (config) {
			progress.network = config;
			result = null;
			notice = "dhcp-ok";
			save();
		} else notice = "dhcp-fail";
		render();
	}
	if (action === "reset")
		document.querySelector<HTMLDialogElement>("#reset-dialog")!.showModal();
	if (action === "cancel-reset")
		document.querySelector<HTMLDialogElement>("#reset-dialog")!.close();
	if (action === "confirm-reset") {
		progress = freshProgress();
		selected = lessons[0].id;
		result = null;
		challengeId = "";
		quizAnswered = null;
		activityAnswered = null;
		view = "lesson";
		syncHash();
		notice = "reset";
		save();
		render(true);
	}
	if (action === "zam")
		document.querySelector<HTMLDialogElement>("#zam-dialog")!.showModal();
	if (action === "close-zam")
		document.querySelector<HTMLDialogElement>("#zam-dialog")!.close();
});
app.addEventListener("input", (event) => {
	const element = event.target as HTMLInputElement | HTMLSelectElement;
	updateConfig(element);
	if (element.id === "activity-answer")
		activityDrafts[selected] = element.value;
});
app.addEventListener("change", (event) => {
	const element = event.target as HTMLInputElement | HTMLSelectElement;
	if (element.id === "challenge-select") {
		setChallenge(element.value);
		render();
		return;
	}
	if (element.id === "request-kind") {
		kind = element.value as RequestKind;
		result = null;
		clearTrace();
		return;
	}
	if (element.id === "target") {
		target = element.value;
		result = null;
		clearTrace();
		return;
	}
	if (
		updateConfig(element) &&
		((element instanceof HTMLInputElement && element.type === "checkbox") ||
			element.tagName === "SELECT")
	)
		render();
});
app.addEventListener("submit", (event) => {
	event.preventDefault();
	const form = event.target as HTMLFormElement;
	if (form.dataset.form === "network") {
		captureInputs();
		result = simulate(progress.network, target, kind, language);
		const task = tasks().find((item) => item.id === challengeId);
		if (
			task &&
			challengeSolved(task, progress.network, kind, target, language)
		) {
			addUnique(progress.lab, task.id);
			for (const lesson of lessons)
				if (
					lesson.activity.kind === "lab" &&
					lesson.activity.challenge === task.id
				)
					addUnique(progress.activities, lesson.id);
			notice = "challenge";
			save();
		} else notice = "";
		render();
	}
	if (form.dataset.form === "activity-number") {
		const activity = current().activity;
		if (activity.kind !== "number") return;
		const draft =
			document.querySelector<HTMLInputElement>("#activity-answer")!.value;
		activityDrafts[selected] = draft;
		const raw = draft.trim().replace(",", ".");
		const value = raw === "" ? Number.NaN : Number(raw);
		activityAnswered =
			Number.isFinite(value) && Math.abs(value - activity.answer) <= 0.005;
		if (activityAnswered) addUnique(progress.activities, selected);
		save();
		render();
	}
	if (form.dataset.form === "subnet") {
		captureInputs();
		subnetResult = subnetInfo(
			subnetAddress.trim(),
			subnetPrefixDraft.trim() ? Number(subnetPrefixDraft) : Number.NaN,
		);
		render();
	}
	if (form.dataset.form === "rate") {
		captureInputs();
		const numeric = (value: string) =>
			value.trim() ? Number(value) : Number.NaN;
		rateResult = transferSeconds(
			numeric(fileSizeDraft),
			numeric(lineRateDraft),
			numeric(efficiencyDraft) / 100,
		);
		calculatedEfficiency = efficiencyDraft;
		render();
	}
});
window.addEventListener("hashchange", () => {
	const params = new URLSearchParams(location.hash.slice(1));
	const id = params.get("lesson");
	if (!id) return;
	const next = readLanguage(location.hash, storage);
	if (next !== language) switchLanguage(next, false);
	if (lessons.some((lesson) => lesson.id === id) && id !== selected) {
		selected = id;
		view = "lesson";
		quizAnswered = null;
		activityAnswered = null;
		save();
		render(true);
	}
});
render();
