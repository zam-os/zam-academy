import { describe, expect, it } from "vitest";
import {
	challengeSolved,
	challenges,
	DNS_IP,
	defaultNetwork,
	dhcpLease,
	HOSTNAME,
	ipv4ToNumber,
	isHost,
	type NetworkConfig,
	numberToIpv4,
	sameSubnet,
	simulate,
	subnetInfo,
	transferSeconds,
} from "../src/simulator";

describe("IPv4 and subnet calculation", () => {
	it.each([
		"",
		"192.168.1",
		"1.2.3.4.5",
		"256.1.2.3",
		"1.2.-1.4",
		"1.2.3.4x",
		"01.2.3.4",
		"1e2.2.3.4",
		"1.2.3.4/24",
		"1..2.3",
	])('refuses ambiguous or invalid address "%s"', (address) =>
		expect(ipv4ToNumber(address)).toBeNull(),
	);
	it.each(["0.0.0.0", "192.168.10.10", "255.255.255.255", "128.0.0.0"])(
		"preserves all 32 bits of %s",
		(address) => expect(numberToIpv4(ipv4ToNumber(address)!)).toBe(address),
	);
	it("computes /26 boundaries across the host octet", () => {
		expect(subnetInfo("192.168.10.70", 26)).toEqual({
			address: "192.168.10.70",
			prefix: 26,
			network: "192.168.10.64",
			broadcast: "192.168.10.127",
			firstHost: "192.168.10.65",
			lastHost: "192.168.10.126",
			hosts: 62,
		});
	});
	it("handles /0 without signed bitwise overflow", () =>
		expect(subnetInfo("203.0.113.20", 0)).toMatchObject({
			network: "0.0.0.0",
			broadcast: "255.255.255.255",
			hosts: 4294967294,
		}));
	it("explicitly distinguishes point-to-point and single-host ranges", () => {
		expect(subnetInfo("192.0.2.4", 31)).toMatchObject({
			firstHost: "192.0.2.4",
			lastHost: "192.0.2.5",
			hosts: 2,
		});
		expect(subnetInfo("192.0.2.4", 32)).toMatchObject({
			firstHost: "192.0.2.4",
			lastHost: "192.0.2.4",
			hosts: 1,
		});
		expect(isHost("192.0.2.4", 31)).toBe(false);
	});
	it.each([-1, 33, 24.5, Number.NaN, Number.POSITIVE_INFINITY])(
		"refuses invalid prefix %s",
		(prefix) => expect(subnetInfo("192.168.10.2", prefix)).toBeNull(),
	);
	it("uses prefix bits rather than always comparing the first three octets", () => {
		expect(sameSubnet("10.3.3.4", "10.3.200.4", 16)).toBe(true);
		expect(sameSubnet("192.168.10.63", "192.168.10.64", 26)).toBe(false);
		expect(sameSubnet("bad", "192.168.10.64", 24)).toBe(false);
	});
	it.each([
		"192.168.10.0",
		"192.168.10.255",
		"127.0.0.1",
		"224.0.0.1",
		"0.1.2.3",
		"169.254.4.2",
	])("rejects non-host or unsupported lab address %s", (address) =>
		expect(isHost(address, 24)).toBe(false),
	);
});

describe("the network's end-to-end behavior", () => {
	it("builds an ordered HTTP journey through DNS, route, TCP and application", () => {
		const result = simulate(defaultNetwork(), HOSTNAME, "http");
		expect(result.success).toBe(true);
		const titles = result.trace.map((step) => step.title);
		expect(titles.indexOf("DNS-Antwort")).toBeLessThan(
			titles.indexOf("TCP-Verbindung aufgebaut"),
		);
		expect(titles.at(-1)).toBe("HTTP-Anfrage und Antwort");
		expect(
			result.trace.find((step) => step.title === "TCP-Verbindung aufgebaut")
				?.detail,
		).toContain("80");
	});
	it("checks TLS only after TCP and before HTTP", () => {
		const result = simulate(defaultNetwork(), HOSTNAME, "https");
		expect(result.success).toBe(true);
		const titles = result.trace.map((step) => step.title);
		expect(titles.indexOf("TCP-Verbindung aufgebaut")).toBeLessThan(
			titles.indexOf("TLS schützt die Verbindung"),
		);
		expect(titles.indexOf("TLS schützt die Verbindung")).toBeLessThan(
			titles.indexOf("HTTP-Anfrage und Antwort"),
		);
	});
	it.each([
		["clientIp", "192.168.10.0", "client-address"],
		["clientIp", "192.168.10.300", "client-address"],
		["clientIp", "192.168.10.1", "duplicate"],
		["clientIp", "192.168.11.10", "client-link"],
		["clientCable", false, "client-cable"],
		["switchOn", false, "client-cable"],
		["gateway", "192.168.10.254", "gateway"],
		["gateway", "192.168.11.1", "gateway"],
		["routerOn", false, "router"],
		["uplink", false, "router"],
		["dns", "bad", "dns-address"],
		["dns", "203.0.113.99", "dns-route"],
		["dnsCable", false, "dns-route"],
		["dnsRecord", "203.0.113.99", "wrong-host"],
		["serverCable", false, "server-cable"],
		["serverGateway", "203.0.113.254", "return-gateway"],
		["serverIp", "bad", "server-address"],
		["serverIp", "203.0.113.53", "duplicate"],
		["serverIp", "198.51.100.20", "server-link"],
		["blockedPort", "80", "firewall"],
	] as const)(
		"stops at the relevant failure for %s = %s",
		(key, value, code) => {
			const config: NetworkConfig = { ...defaultNetwork(), [key]: value };
			const result = simulate(config, HOSTNAME, "http");
			expect(result.success).toBe(false);
			expect(result.code).toBe(code);
			expect(result.trace.at(-1)?.status).toBe("error");
			expect(
				result.trace.some((step) => step.title === "HTTP-Anfrage und Antwort"),
			).toBe(false);
		},
	);
	it("explains an excessively broad client prefix", () =>
		expect(
			simulate({ ...defaultNetwork(), clientPrefix: 1 }, HOSTNAME, "http").code,
		).toBe("prefix"));
	it("checks the server prefix for its return route", () =>
		expect(
			simulate({ ...defaultNetwork(), serverPrefix: 1 }, HOSTNAME, "http").code,
		).toBe("return-prefix"));
	it.each(["http", "ping"] as const)("direct IP %s needs no DNS", (kind) =>
		expect(
			simulate(
				{ ...defaultNetwork(), dns: "bad", dnsCable: false },
				"203.0.113.20",
				kind,
			).success,
		).toBe(true),
	);
	it("keeps DNS independent of an invalid, disconnected webserver", () => {
		const result = simulate(
			{
				...defaultNetwork(),
				serverIp: "bad",
				serverPrefix: -1,
				serverCable: false,
				serverGateway: "bad",
			},
			HOSTNAME,
			"dns",
		);
		expect(result.success).toBe(true);
		expect(result.code).toBe("dns-ok");
		expect(
			result.trace.some((step) => step.title === "TCP-Verbindung aufgebaut"),
		).toBe(false);
	});
	it("a valid DNS answer may point to a wrong webserver", () =>
		expect(
			simulate(
				{ ...defaultNetwork(), dnsRecord: "203.0.113.99" },
				HOSTNAME,
				"dns",
			).success,
		).toBe(true));
	it("a blocked web port does not make ping fail", () =>
		expect(
			simulate(
				{ ...defaultNetwork(), blockedPort: "80" },
				"203.0.113.20",
				"ping",
			).success,
		).toBe(true));
	it("refuses malformed or unknown targets without attempting any external resolution", () => {
		expect(simulate(defaultNetwork(), "https://example.com", "http").code).toBe(
			"target",
		);
		expect(simulate(defaultNetwork(), "1.2.3.999", "http").code).toBe(
			"target-ip",
		);
		expect(simulate(defaultNetwork(), "other.example.test", "http").code).toBe(
			"dns-name",
		);
		expect(simulate(defaultNetwork(), "", "http").code).toBe("target");
	});
	it("does not mistake a functioning HTTP page for successful TLS", () => {
		const config = { ...defaultNetwork(), tlsTrusted: false };
		expect(simulate(config, HOSTNAME, "http").success).toBe(true);
		expect(simulate(config, HOSTNAME, "https").code).toBe("tls");
	});
	it("requires the requested hostname in the certificate", () => {
		expect(
			simulate(
				{ ...defaultNetwork(), certificateName: "other.schule.test" },
				HOSTNAME,
				"https",
			).code,
		).toBe("tls");
		expect(simulate(defaultNetwork(), "203.0.113.20", "https").code).toBe(
			"tls",
		);
	});
	it("DHCP fixes the client settings only when the local service can be reached", () => {
		expect(
			dhcpLease({
				...defaultNetwork(),
				gateway: "bad",
				dns: "bad",
				clientIp: "bad",
			}),
		).toMatchObject({
			clientIp: "192.168.10.10",
			clientPrefix: 24,
			gateway: "192.168.10.1",
			dns: DNS_IP,
		});
		expect(dhcpLease({ ...defaultNetwork(), clientCable: false })).toBeNull();
		expect(dhcpLease({ ...defaultNetwork(), routerOn: false })).toBeNull();
	});
	it("every guided challenge starts broken and can be solved by its intended repair", () => {
		const repairs: Record<string, Partial<NetworkConfig>> = {
			gateway: { gateway: "192.168.10.1" },
			dns: { dnsRecord: "203.0.113.20" },
			prefix: { clientPrefix: 24 },
			cable: { serverCable: true },
			return: { serverGateway: "203.0.113.1" },
			https: { certificateName: HOSTNAME },
			firewall: { blockedPort: "none" },
		};
		for (const task of challenges()) {
			expect(
				challengeSolved(task, task.config, task.kind, task.target),
				task.id,
			).toBe(false);
			const repaired = { ...task.config, ...repairs[task.id] };
			expect(
				challengeSolved(task, repaired, task.kind, task.target),
				task.id,
			).toBe(true);
			expect(
				challengeSolved(task, repaired, "dns", task.target),
				"DNS does not fulfil a web challenge",
			).toBe(false);
			expect(
				challengeSolved(task, repaired, task.kind, "203.0.113.20"),
				"IP does not fulfil a named web challenge",
			).toBe(false);
		}
	});
});

describe("rate calculations", () => {
	it("converts MiB to bits and uses decimal Mbit/s", () => {
		expect(transferSeconds(10, 100)).toBeCloseTo(0.8388608, 8);
		expect(transferSeconds(10, 100, 0.8)).toBeCloseTo(1.048576, 6);
		expect(transferSeconds(0, 100)).toBe(0);
	});
	it.each([
		[10, 0, 1],
		[-10, 100, 1],
		[10, 100, 0],
		[10, 100, 2],
		[Number.NaN, 100, 1],
		[10, Number.POSITIVE_INFINITY, 1],
		[Number.MAX_VALUE, 100, 1],
		[10, Number.MIN_VALUE, 1],
	])("refuses invalid or overflowing values %s, %s, %s", (size, rate, ratio) =>
		expect(transferSeconds(size, rate, ratio)).toBeNull(),
	);
});
