import { type Language, translator } from "./i18n";
/** Pure, deterministic teaching model. It never opens a socket or requests a URL. */
export interface Subnet {
	address: string;
	prefix: number;
	network: string;
	broadcast: string;
	firstHost: string;
	lastHost: string;
	hosts: number;
}
export function ipv4ToNumber(address: string): number | null {
	if (
		typeof address !== "string" ||
		!/^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(address.trim())
	)
		return null;
	const octets = address.trim().split(".").map(Number);
	if (octets.some((octet) => octet > 255)) return null;
	return octets.reduce((result, octet) => result * 256 + octet, 0);
}
export function numberToIpv4(value: number): string {
	if (!Number.isInteger(value) || value < 0 || value > 4294967295)
		throw new Error("IPv4-Zahl außerhalb des Wertebereichs.");
	return [24, 16, 8, 0]
		.map((shift) => Math.floor(value / 2 ** shift) % 256)
		.join(".");
}
export function subnetInfo(address: string, prefix: number): Subnet | null {
	const ip = ipv4ToNumber(address);
	if (ip === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32)
		return null;
	const block = 2 ** (32 - prefix);
	const network = Math.floor(ip / block) * block;
	const broadcast = network + block - 1;
	const special = prefix >= 31;
	return {
		address: numberToIpv4(ip),
		prefix,
		network: numberToIpv4(network),
		broadcast: numberToIpv4(broadcast),
		firstHost: numberToIpv4(network + (special ? 0 : 1)),
		lastHost: numberToIpv4(broadcast - (special ? 0 : 1)),
		hosts: special ? block : block - 2,
	};
}
export function sameSubnet(a: string, b: string, prefix: number): boolean {
	const left = subnetInfo(a, prefix),
		right = subnetInfo(b, prefix);
	return left !== null && right !== null && left.network === right.network;
}
export function isHost(address: string, prefix: number): boolean {
	const subnet = subnetInfo(address, prefix);
	if (!subnet || prefix < 1 || prefix > 30) return false;
	const ip = ipv4ToNumber(address)!;
	return (
		address.trim() !== subnet.network &&
		address.trim() !== subnet.broadcast &&
		ip >= 16777216 &&
		ip < 3758096384 &&
		!address.trim().startsWith("127.") &&
		!address.trim().startsWith("169.254.")
	);
}
export function transferSeconds(
	mebibytes: number,
	megabitsPerSecond: number,
	efficiency = 1,
): number | null {
	if (
		![mebibytes, megabitsPerSecond, efficiency].every(Number.isFinite) ||
		mebibytes < 0 ||
		megabitsPerSecond <= 0 ||
		efficiency <= 0 ||
		efficiency > 1
	)
		return null;
	const seconds =
		(mebibytes * 2 ** 20 * 8) / (megabitsPerSecond * 1e6 * efficiency);
	return Number.isFinite(seconds) ? seconds : null;
}
export type RequestKind = "ping" | "dns" | "http" | "https";
export interface NetworkConfig {
	clientIp: string;
	clientPrefix: number;
	gateway: string;
	dns: string;
	serverIp: string;
	serverPrefix: number;
	serverGateway: string;
	dnsRecord: string;
	clientCable: boolean;
	uplink: boolean;
	serverCable: boolean;
	dnsCable: boolean;
	switchOn: boolean;
	routerOn: boolean;
	tlsTrusted: boolean;
	certificateName: string;
	blockedPort: "none" | "80" | "443";
}
export const HOSTNAME = "bibliothek.schule.test";
export const ROUTER_LAN = "192.168.10.1";
export const ROUTER_WAN = "203.0.113.1";
export const DNS_IP = "203.0.113.53";
export function defaultNetwork(): NetworkConfig {
	return {
		clientIp: "192.168.10.10",
		clientPrefix: 24,
		gateway: ROUTER_LAN,
		dns: DNS_IP,
		serverIp: "203.0.113.20",
		serverPrefix: 24,
		serverGateway: ROUTER_WAN,
		dnsRecord: "203.0.113.20",
		clientCable: true,
		uplink: true,
		serverCable: true,
		dnsCable: true,
		switchOn: true,
		routerOn: true,
		tlsTrusted: true,
		certificateName: HOSTNAME,
		blockedPort: "none",
	};
}
export function dhcpLease(config: NetworkConfig): NetworkConfig | null {
	if (
		!config.clientCable ||
		!config.switchOn ||
		!config.uplink ||
		!config.routerOn
	)
		return null;
	return {
		...config,
		clientIp: "192.168.10.10",
		clientPrefix: 24,
		gateway: ROUTER_LAN,
		dns: DNS_IP,
	};
}
export interface TraceStep {
	layer: string;
	title: string;
	detail: string;
	status: "ok" | "error";
}
export interface Simulation {
	success: boolean;
	code: string;
	summary: string;
	trace: TraceStep[];
}
export function simulate(
	config: NetworkConfig,
	target: string,
	kind: RequestKind,
	language: Language = "de",
): Simulation {
	const tr = translator(language);
	const trace: TraceStep[] = [];
	const ok = (layer: string, title: string, detail: string) =>
		trace.push({ layer, title, detail, status: "ok" });
	const fail = (code: string, title: string, detail: string): Simulation => {
		trace.push({
			layer: tr("Prüfung", "Check"),
			title,
			detail,
			status: "error",
		});
		return { success: false, code, summary: detail, trace };
	};
	if (!["ping", "dns", "http", "https"].includes(kind))
		return fail(
			"operation",
			tr("Unbekannter Auftrag", "Unknown operation"),
			tr(
				"Wähle Verbindungstest, DNS, HTTP oder HTTPS.",
				"Choose an IP connection test, DNS, HTTP or HTTPS.",
			),
		);
	const name = target.trim().toLowerCase();
	if (
		!name ||
		name.length > 253 ||
		!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(name)
	)
		return fail(
			"target",
			tr("Ziel prüfen", "Check the destination"),
			tr(
				"Trage einen Hostnamen oder eine IPv4-Adresse ein, ohne Schema, Pfad oder Leerzeichen.",
				"Enter a hostname or IPv4 address without a scheme, path or spaces.",
			),
		);
	if (!isHost(config.clientIp, config.clientPrefix))
		return fail(
			"client-address",
			tr("Clientadresse prüfen", "Check the client address"),
			tr(
				"Der Client braucht eine gültige IPv4-Hostadresse mit Präfix /1 bis /30. Netz-, Broadcast-, Loopback- und Link-Local-Adressen sind im Labor keine zulässigen Hostadressen.",
				"The client needs a valid IPv4 host address with a prefix from /1 to /30. Network, broadcast, loopback and link-local addresses are not supported as host addresses in this lab.",
			),
		);
	if ([ROUTER_LAN, ROUTER_WAN, DNS_IP].includes(config.clientIp.trim()))
		return fail(
			"duplicate",
			tr("Doppelte Adresse", "Duplicate address"),
			tr(
				"Jede Komponente braucht hier eine eigene Adresse. Der Client darf keine Router- oder DNS-Adresse übernehmen.",
				"Each component needs its own address here. The client must not use a router or DNS address.",
			),
		);
	if (!sameSubnet(config.clientIp, ROUTER_LAN, 24))
		return fail(
			"client-link",
			tr("Client im falschen Netz", "Client in the wrong network"),
			tr(
				"Die LAN-Schnittstelle des Routers liegt in 192.168.10.0/24. Wähle für den Client eine passende freie Hostadresse.",
				"The router’s LAN interface is in 192.168.10.0/24. Give the client a suitable unused host address.",
			),
		);
	if (!config.clientCable || !config.switchOn)
		return fail(
			"client-cable",
			tr("Lokale Verbindung fehlt", "Local link missing"),
			tr(
				"Verbinde den Client mit dem eingeschalteten Switch. Eine richtige IP-Adresse ersetzt kein Übertragungsmedium.",
				"Connect the client to the powered-on switch. A correct IP address cannot replace a transmission medium.",
			),
		);
	ok(
		tr("Netzzugang", "Network access"),
		tr("Link bereit", "Link ready"),
		tr(
			"Der Client erreicht den Switch. Ethernet-Rahmen nutzen lokale MAC-Adressen; diese bleiben im Modell fest.",
			"The client can reach the switch. Ethernet frames use local MAC addresses; these remain fixed in this model.",
		),
	);
	const route = (
		destination: string,
		endpoint: "dns" | "server" | "any",
	): Simulation | null => {
		if (!isHost(destination, 24))
			return fail(
				"destination-address",
				tr("Zieladresse prüfen", "Check the destination address"),
				tr(
					"Die ermittelte Zieladresse ist in diesem Lehrnetz keine erreichbare Hostadresse.",
					"The resolved destination is not a reachable host address in this teaching network.",
				),
			);
		if (sameSubnet(config.clientIp, destination, config.clientPrefix)) {
			// A destination in the real client LAN is local; only one outside it
			// reveals a prefix that is too broad.
			if (sameSubnet(destination, ROUTER_LAN, 24))
				return deliverLocally(destination, endpoint);
			return fail(
				"prefix",
				tr("Ziel irrtümlich lokal", "Destination incorrectly treated as local"),
				tr(
					"Mit diesem Clientpräfix hält der Client das entfernte Ziel für lokal. Er sucht es im LAN, statt das Paket an das Gateway zu senden. Nutze für dieses LAN /24.",
					"With this prefix, the client treats the remote destination as local. It looks in its LAN instead of sending the packet to the gateway. Use /24 for this LAN.",
				),
			);
		}
		if (
			!isHost(config.gateway, config.clientPrefix) ||
			!sameSubnet(config.clientIp, config.gateway, config.clientPrefix) ||
			config.gateway.trim() !== ROUTER_LAN
		)
			return fail(
				"gateway",
				tr("Gateway nicht erreichbar", "Gateway unreachable"),
				tr(
					"Für das entfernte Ziel braucht der Client die erreichbare Routeradresse 192.168.10.1 als Standardgateway.",
					"For the remote destination, the client needs the reachable router address 192.168.10.1 as its default gateway.",
				),
			);
		if (!config.uplink || !config.routerOn)
			return fail(
				"router",
				tr(
					"Weg zum anderen Netz unterbrochen",
					"Path to the other network interrupted",
				),
				tr(
					"Verbinde den Switch mit dem eingeschalteten Router. Ein Switch allein verbindet diese beiden IP-Netze nicht.",
					"Connect the switch to the powered-on router. A switch alone cannot connect these two IP networks.",
				),
			);
		if (!sameSubnet(destination, ROUTER_WAN, 24))
			return fail(
				"no-route",
				tr("Kein Weg zum Ziel", "No route to the destination"),
				tr(
					"Der Laborrouter kennt nur die Netze 192.168.10.0/24 und 203.0.113.0/24. Für diese Adresse ist kein Weg eingerichtet.",
					"The lab router knows only 192.168.10.0/24 and 203.0.113.0/24. It has no route to this address.",
				),
			);
		if (endpoint === "dns" && (!config.dnsCable || destination !== DNS_IP))
			return fail(
				"dns-route",
				tr("DNS-Server nicht erreichbar", "DNS server unreachable"),
				tr(
					"Der Namensdienst liegt im Labor bei 203.0.113.53 und muss mit dem Servernetz verbunden sein.",
					"The lab name service is at 203.0.113.53 and must be connected to the server network.",
				),
			);
		if (endpoint === "server" && !config.serverCable)
			return fail(
				"server-cable",
				tr("Webserver nicht verbunden", "Web server disconnected"),
				tr(
					"Verbinde den Webserver mit dem Servernetz; der Weg bis zum Router allein genügt nicht.",
					"Connect the web server to the server network; reaching the router alone is not enough.",
				),
			);
		ok(
			"Internet",
			endpoint === "dns"
				? tr("IP-Paket zum DNS-Server", "IP packet to the DNS server")
				: endpoint === "server"
					? tr("IP-Paket zum Webserver", "IP packet to the web server")
					: tr("IP-Paket ins Zielnetz", "IP packet to the destination network"),
			tr(
				`${destination} liegt außerhalb des Clientnetzes. Der nächste lokale Empfänger ist ${ROUTER_LAN}; der Router leitet ins Zielnetz weiter.`,
				`${destination} is outside the client network. The next local recipient is ${ROUTER_LAN}; the router forwards the packet into the destination network.`,
			),
		);
		return null;
	};
	// In the client LAN only the client itself and the router's LAN interface answer.
	const deliverLocally = (
		destination: string,
		endpoint: "dns" | "server" | "any",
	): Simulation | null => {
		if (endpoint === "any" && destination === config.clientIp.trim()) {
			ok(
				tr("Netzzugang", "Network access"),
				tr("Eigene Adresse", "Own address"),
				tr(
					`${destination} ist die Adresse des Clients selbst. Die Antwort verlässt das Gerät nicht.`,
					`${destination} is the client’s own address. The reply never leaves the device.`,
				),
			);
			return null;
		}
		if (endpoint === "any" && destination === ROUTER_LAN) {
			if (!config.uplink || !config.routerOn)
				return fail(
					"router",
					tr("Router nicht erreichbar", "Router unreachable"),
					tr(
						`Verbinde den Switch mit dem eingeschalteten Router; erst dann antwortet die LAN-Schnittstelle ${ROUTER_LAN}.`,
						`Connect the switch to the powered-on router; only then does the LAN interface ${ROUTER_LAN} reply.`,
					),
				);
			ok(
				tr("Netzzugang", "Network access"),
				tr("Lokal zugestellt", "Delivered locally"),
				tr(
					`${destination} liegt im eigenen Netz. Der Client stellt das Paket direkt über den Switch zu und braucht dafür kein Gateway.`,
					`${destination} is in the client’s own network. The client delivers the packet directly through the switch and needs no gateway for it.`,
				),
			);
			return null;
		}
		if (endpoint === "dns")
			return fail(
				"dns-route",
				tr("DNS-Server nicht erreichbar", "DNS server unreachable"),
				tr(
					`Unter ${destination} im eigenen LAN läuft im Labor kein Namensdienst. Der Labor-DNS hat die Adresse ${DNS_IP}.`,
					`No name service runs at ${destination} in the client LAN. The lab DNS server is ${DNS_IP}.`,
				),
			);
		if (endpoint === "server")
			return fail(
				"wrong-host",
				tr("Falscher Empfänger", "Wrong recipient"),
				tr(
					`An ${destination} im eigenen LAN betreibt das Modell keinen Webserver. Der Webserver steht im Servernetz 203.0.113.0/24.`,
					`The model has no web server at ${destination} in the client LAN. The web server is in the server network 203.0.113.0/24.`,
				),
			);
		return fail(
			"no-host",
			tr("Kein Gerät unter dieser Adresse", "No device at this address"),
			tr(
				`Unter ${destination} antwortet im Client-LAN kein Gerät. Dort gibt es im Labor nur den Client und den Router ${ROUTER_LAN}.`,
				`No device answers at ${destination} in the client LAN. The lab LAN contains only the client and the router ${ROUTER_LAN}.`,
			),
		);
	};
	const numeric = ipv4ToNumber(name);
	if (numeric === null && /^\d+(\.\d+){3}$/.test(name))
		return fail(
			"target-ip",
			tr("Ungültige IPv4-Adresse", "Invalid IPv4 address"),
			tr(
				"Eine IPv4-Adresse besteht aus vier Dezimalzahlen von 0 bis 255, ohne führende Nullen.",
				"An IPv4 address consists of four decimal numbers from 0 to 255, without leading zeros.",
			),
		);
	let destination = name;
	if (numeric === null || kind === "dns") {
		if (numeric !== null)
			return fail(
				"dns-name",
				tr("DNS braucht hier einen Namen", "DNS needs a name here"),
				tr(
					"Trage bibliothek.schule.test ein. Rückwärtsauflösung ist in diesem Labor nicht enthalten.",
					"Enter bibliothek.schule.test. Reverse DNS lookup is not included in this lab.",
				),
			);
		if (ipv4ToNumber(config.dns) === null)
			return fail(
				"dns-address",
				tr("DNS-Adresse ungültig", "Invalid DNS address"),
				tr(
					"Für die Namensauflösung muss eine gültige IPv4-Adresse als DNS-Server eingestellt sein.",
					"Name resolution needs a valid IPv4 address configured as the DNS server.",
				),
			);
		const error = route(config.dns.trim(), "dns");
		if (error) return error;
		ok(
			tr("Transport", "Transport"),
			tr("DNS-Anfrage", "DNS query"),
			tr(
				"Die Anfrage nutzt hier UDP, Zielport 53. DNS kann auch über TCP und verschlüsselte Transporte arbeiten; sie sind hier ausgeblendet.",
				"The query uses UDP destination port 53 here. DNS can also use TCP and encrypted transports; those are outside this model.",
			),
		);
		if (name !== HOSTNAME)
			return fail(
				"dns-name",
				tr("Name nicht vorhanden", "Name not found"),
				tr(
					`Der kleine Labor-DNS kennt nur ${HOSTNAME}. .test ist eine reservierte Testdomain.`,
					`The small lab DNS knows only ${HOSTNAME}. .test is a reserved test domain.`,
				),
			);
		if (!isHost(config.dnsRecord, 24))
			return fail(
				"dns-record",
				tr("DNS-Eintrag ungültig", "Invalid DNS record"),
				tr(
					"Der DNS-Eintrag muss eine gültige IPv4-Hostadresse liefern.",
					"The DNS record must return a valid IPv4 host address.",
				),
			);
		destination = config.dnsRecord.trim();
		ok(
			tr("Anwendung", "Application"),
			tr("DNS-Antwort", "DNS answer"),
			tr(
				`${name} → ${destination}. DNS liefert die Adresse; es transportiert nicht die Webseite.`,
				`${name} → ${destination}. DNS supplies the address; it does not carry the web page.`,
			),
		);
		if (kind === "dns")
			return {
				success: true,
				code: "dns-ok",
				summary: tr(
					`${name} wurde zu ${destination} aufgelöst. Ein erfolgreicher DNS-Test beweist noch keine erreichbare Webseite.`,
					`${name} resolved to ${destination}. A successful DNS test does not yet prove that a web page is reachable.`,
				),
				trace,
			};
	}
	// A connection test may target any device, not only the web server.
	if (kind === "ping" && destination !== config.serverIp.trim()) {
		const device =
			destination === ROUTER_LAN || destination === ROUTER_WAN
				? tr("Router", "router")
				: destination === DNS_IP
					? tr("DNS-Server", "DNS server")
					: destination === config.clientIp.trim()
						? tr("eigene Clientadresse", "the client’s own address")
						: null;
		const error = route(destination, destination === DNS_IP ? "dns" : "any");
		if (error) return error;
		if (!device)
			return fail(
				"no-host",
				tr("Kein Gerät unter dieser Adresse", "No device at this address"),
				tr(
					`Unter ${destination} antwortet im Lehrnetz kein Gerät.${numeric === null ? " Vergleiche DNS-Eintrag und tatsächliche Serveradresse." : ""}`,
					`No device answers at ${destination} in this teaching network.${numeric === null ? " Compare the DNS record with the actual server address." : ""}`,
				),
			);
		ok(
			"Internet",
			tr("Verbindungstest erfolgreich", "IP connection test successful"),
			tr(
				`ICMP-Echo und Antwort von ${destination} funktionieren im Modell. Das prüft keinen HTTP-Dienst.`,
				`ICMP echo and reply from ${destination} work in the model. This does not test an HTTP service.`,
			),
		);
		return {
			success: true,
			code: "ping-ok",
			summary: tr(
				`${destination} antwortet (${device}). Der Verbindungstest prüft nur die IP-Erreichbarkeit.`,
				`${destination} replies (${device}). The connection test checks IP reachability only.`,
			),
			trace,
		};
	}
	if (!isHost(config.serverIp, config.serverPrefix))
		return fail(
			"server-address",
			tr("Serveradresse prüfen", "Check the server address"),
			tr(
				"Der Webserver braucht eine gültige Hostadresse mit Präfix /1 bis /30.",
				"The web server needs a valid host address with a prefix from /1 to /30.",
			),
		);
	if (
		[ROUTER_LAN, ROUTER_WAN, DNS_IP].includes(config.serverIp.trim()) ||
		config.clientIp.trim() === config.serverIp.trim()
	)
		return fail(
			"duplicate",
			tr("Doppelte Adresse", "Duplicate address"),
			tr(
				"Der Webserver braucht eine eigene freie Hostadresse.",
				"The web server needs its own unused host address.",
			),
		);
	if (!sameSubnet(config.serverIp, ROUTER_WAN, 24))
		return fail(
			"server-link",
			tr("Server im falschen Netz", "Server in the wrong network"),
			tr(
				"Die Serverseite des Routers liegt in 203.0.113.0/24. Wähle für den Server eine passende freie Hostadresse.",
				"The server-facing router interface is in 203.0.113.0/24. Give the server a suitable unused host address.",
			),
		);
	const error = route(destination, "server");
	if (error) return error;
	if (destination !== config.serverIp.trim())
		return fail(
			"wrong-host",
			tr("Falscher Empfänger", "Wrong recipient"),
			tr(
				`An ${destination} betreibt das Modell keinen Webserver. Vergleiche DNS-Eintrag und tatsächliche Serveradresse.`,
				`The model has no web server at ${destination}. Compare the DNS record with the actual server address.`,
			),
		);
	if (sameSubnet(config.serverIp, config.clientIp, config.serverPrefix))
		return fail(
			"return-prefix",
			tr("Antwort sucht den falschen Weg", "Reply takes the wrong path"),
			tr(
				"Der Server hält die Clientadresse wegen seines Präfixes für lokal. Wähle hier /24, damit die Antwort über seinen Router geht.",
				"The server’s prefix makes it treat the client as local. Use /24 here so the reply goes through its router.",
			),
		);
	if (
		!isHost(config.serverGateway, config.serverPrefix) ||
		!sameSubnet(config.serverIp, config.serverGateway, config.serverPrefix) ||
		config.serverGateway.trim() !== ROUTER_WAN
	)
		return fail(
			"return-gateway",
			tr("Rückweg fehlt", "Return route missing"),
			tr(
				"Der Webserver braucht das erreichbare Standardgateway 203.0.113.1. Auch die Antwort muss den Weg zurück finden.",
				"The web server needs the reachable default gateway 203.0.113.1. The reply needs a route back too.",
			),
		);
	ok(
		"Internet",
		tr("Rückweg vorhanden", "Return route available"),
		tr(
			`Der Server antwortet über ${ROUTER_WAN}; beide Richtungen sind erreichbar.`,
			`The server replies through ${ROUTER_WAN}; both directions are reachable.`,
		),
	);
	if (kind === "ping") {
		ok(
			"Internet",
			tr("Verbindungstest erfolgreich", "IP connection test successful"),
			tr(
				"ICMP-Echo und Antwort funktionieren im Modell. Das prüft noch keinen HTTP-Dienst und kein Zertifikat.",
				"ICMP echo and reply work in the model. This has not yet tested an HTTP service or a certificate.",
			),
		);
		return {
			success: true,
			code: "ping-ok",
			summary: tr(
				"Client und Webserver können IP-Pakete in beide Richtungen austauschen.",
				"The client and web server can exchange IP packets in both directions.",
			),
			trace,
		};
	}
	const port = kind === "https" ? "443" : "80";
	if (config.blockedPort === port)
		return fail(
			"firewall",
			tr("Dienst blockiert", "Service blocked"),
			tr(
				`Eine Modell-Firewall blockiert TCP-Port ${port}. IP-Erreichbarkeit allein genügt nicht für diesen Webdienst.`,
				`A model firewall blocks TCP port ${port}. IP reachability alone is not enough for this web service.`,
			),
		);
	ok(
		tr("Transport", "Transport"),
		tr("TCP-Verbindung aufgebaut", "TCP connection established"),
		tr(
			`Client und Webserver bestätigen die Verbindung zum Zielport ${port}. TCP ordnet Daten und fordert fehlende Daten erneut an.`,
			`The client and web server acknowledge the connection to destination port ${port}. TCP orders data and retransmits missing data.`,
		),
	);
	if (kind === "https") {
		if (
			!config.tlsTrusted ||
			name !== config.certificateName.trim().toLowerCase()
		)
			return fail(
				"tls",
				tr("Zertifikat nicht vertrauenswürdig", "Certificate not trusted"),
				tr(
					"TLS prüft hier Vertrauenskette und passenden Hostnamen. Nutze den passenden Namen und ein vertrauenswürdiges Zertifikat; eine Warnung sollte nicht blind übergangen werden.",
					"TLS checks trust and a matching hostname here. Use the correct name and a trusted certificate; do not blindly ignore a warning.",
				),
			);
		ok(
			tr("Sicherung", "Protection"),
			tr("TLS schützt die Verbindung", "TLS protects the connection"),
			tr(
				"Der Name passt zum vertrauenswürdigen Zertifikat. TLS schützt Vertraulichkeit und Integrität des Transports; es garantiert keine ehrlichen Webseiteninhalte.",
				"The name matches the trusted certificate. TLS protects transport confidentiality and integrity; it does not guarantee honest web content.",
			),
		);
	}
	ok(
		tr("Anwendung", "Application"),
		tr("HTTP-Anfrage und Antwort", "HTTP request and response"),
		`GET / → 200 OK. ${kind === "https" ? tr("Die HTTP-Daten reisen im TLS-Kanal.", "HTTP data travels inside the TLS channel.") : tr("HTTP überträgt hier ohne TLS-Schutz.", "HTTP is transmitted without TLS protection here.")}`,
	);
	return {
		success: true,
		code: "web-ok",
		summary: tr(
			`Die Bibliotheksseite ist über ${kind.toUpperCase()} erreichbar. Alle Schritte sind ausschließlich simuliert.`,
			`The library page is reachable over ${kind.toUpperCase()}. Every step is simulated only.`,
		),
		trace,
	};
}
export interface LabChallenge {
	id: string;
	title: string;
	instruction: string;
	config: NetworkConfig;
	kind: RequestKind;
	target: string;
}
export function challenges(language: Language = "de"): LabChallenge[] {
	const tr = translator(language);
	const base = defaultNetwork();
	return [
		{
			id: "gateway",
			title: tr("1 · Das verschwundene Gateway", "1 · The missing gateway"),
			instruction: tr(
				"Die Clientadresse passt. Repariere das Standardgateway und lade die Bibliotheksseite per HTTP.",
				"The client address is correct. Repair the default gateway and load the library page over HTTP.",
			),
			config: { ...base, gateway: "192.168.10.254" },
			kind: "http",
			target: HOSTNAME,
		},
		{
			id: "dns",
			title: tr(
				"2 · Zahlen gehen, Namen nicht",
				"2 · Numbers work, names do not",
			),
			instruction: tr(
				"Der Verbindungstest zur Server-IP klappt. Finde und repariere den fehlerhaften DNS-Eintrag. Prüfe danach die Seite über ihren Namen.",
				"The connection test to the server IP works. Find and repair the incorrect DNS record, then test the page using its name.",
			),
			config: { ...base, dnsRecord: "203.0.113.99" },
			kind: "http",
			target: HOSTNAME,
		},
		{
			id: "prefix",
			title: tr("3 · Das zu große Netz", "3 · The oversized network"),
			instruction: tr(
				"Mit /1 hält der Client das entfernte Ziel für lokal. Wähle das zum Labor-LAN passende Präfix und teste HTTP.",
				"With /1, the client treats the remote destination as local. Choose the prefix that fits the lab LAN and test HTTP.",
			),
			config: { ...base, clientPrefix: 1 },
			kind: "http",
			target: HOSTNAME,
		},
		{
			id: "cable",
			title: tr("4 · Ein Kabel fehlt", "4 · A cable is missing"),
			instruction: tr(
				"Alle Adressen stimmen. Prüfe die Verbindungen zum Webserver und stelle die Erreichbarkeit wieder her.",
				"All addresses are correct. Check the web server connections and restore reachability.",
			),
			config: { ...base, serverCable: false },
			kind: "http",
			target: HOSTNAME,
		},
		{
			id: "return",
			title: tr("5 · Die Antwort bleibt aus", "5 · The reply never arrives"),
			instruction: tr(
				"Der Server bekommt Pakete, kann aber nicht zurück antworten. Repariere seine Rückroute und teste HTTP.",
				"The server receives packets but cannot send replies back. Repair its return route and test HTTP.",
			),
			config: { ...base, serverGateway: "203.0.113.254" },
			kind: "http",
			target: HOSTNAME,
		},
		{
			id: "https",
			title: tr(
				"6 · Sicher zur Bibliothek",
				"6 · A secure route to the library",
			),
			instruction: tr(
				"HTTP klappt, HTTPS scheitert am Zertifikat. Sorge für den passenden vertrauenswürdigen Namen und teste HTTPS.",
				"HTTP works, but HTTPS fails at the certificate. Set the correct trusted name and test HTTPS.",
			),
			config: { ...base, certificateName: "anderer.schule.test" },
			kind: "https",
			target: HOSTNAME,
		},
		{
			id: "firewall",
			title: tr(
				"7 · Verbindung ja, Webseite nein",
				"7 · Connection works, web page does not",
			),
			instruction: tr(
				"Ping erreicht den Server. Der HTTPS-Dienst wird jedoch blockiert. Finde die passende Regel und öffne die Seite über HTTPS.",
				"Ping reaches the server, but HTTPS is blocked. Find the relevant rule and open the page over HTTPS.",
			),
			config: { ...base, blockedPort: "443" },
			kind: "https",
			target: HOSTNAME,
		},
	];
}
export function challengeSolved(
	challenge: LabChallenge,
	config: NetworkConfig,
	kind: RequestKind,
	target: string,
	language: Language = "de",
): boolean {
	return (
		kind === challenge.kind &&
		target.trim().toLowerCase() === challenge.target &&
		simulate(config, target, kind, language).success
	);
}
