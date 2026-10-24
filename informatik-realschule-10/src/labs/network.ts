export type Direction = "in" | "out";
export interface Packet {
  direction: Direction;
  protocol: "TCP" | "UDP";
  port: number;
  label: string;
}
export interface Rule {
  direction: Direction | "any";
  protocol: "TCP" | "UDP" | "any";
  port: number | "any";
  action: "allow" | "deny";
}
export interface Decision {
  allowed: boolean;
  rule: number | null;
}

/** Ordered, stateless packet filter. Return traffic is a separate packet in this model. */
export function filterPacket(
  packet: Packet,
  rules: readonly Rule[],
  fallback: "allow" | "deny" = "deny",
): Decision {
  if (!Number.isInteger(packet.port) || packet.port < 1 || packet.port > 65535)
    throw new Error("Port muss zwischen 1 und 65535 liegen.");
  const index = rules.findIndex(
    (rule) =>
      (rule.direction === "any" || rule.direction === packet.direction) &&
      (rule.protocol === "any" || rule.protocol === packet.protocol) &&
      (rule.port === "any" || rule.port === packet.port),
  );
  return {
    allowed:
      index === -1 ? fallback === "allow" : rules[index].action === "allow",
    rule: index === -1 ? null : index + 1,
  };
}

export interface NetworkCase extends Packet {
  expected: boolean;
}
export const NETWORK_CASES: NetworkCase[] = [
  {
    label: "Browser zum Webserver",
    direction: "out",
    protocol: "TCP",
    port: 443,
    expected: true,
  },
  {
    label: "Client zum DNS-Server",
    direction: "out",
    protocol: "UDP",
    port: 53,
    expected: true,
  },
  {
    label: "Unverschlüsselter Webaufruf",
    direction: "out",
    protocol: "TCP",
    port: 80,
    expected: false,
  },
  {
    label: "Unangeforderter Zugriff von außen",
    direction: "in",
    protocol: "TCP",
    port: 443,
    expected: false,
  },
  {
    label: "Fernzugriff von außen",
    direction: "in",
    protocol: "TCP",
    port: 22,
    expected: false,
  },
  {
    label: "Ungewollter weiterer Dienst",
    direction: "out",
    protocol: "UDP",
    port: 9000,
    expected: false,
  },
  {
    label: "DNS über TCP ist hier nicht freigegeben",
    direction: "out",
    protocol: "TCP",
    port: 53,
    expected: false,
  },
];

export interface TlsSettings {
  encrypted: boolean;
  trusted: boolean;
  matchesHost: boolean;
  expired: boolean;
}
export function tlsResult(settings: TlsSettings): {
  secure: boolean;
  message: string;
} {
  if (!settings.encrypted)
    return {
      secure: false,
      message:
        "Die Verbindung ist unverschlüsselt. Eine Portfreigabe schützt den Inhalt nicht.",
    };
  if (!settings.trusted)
    return {
      secure: false,
      message:
        "Die Zertifikatskette ist nicht vertrauenswürdig. Die Gegenstelle ist so nicht bestätigt.",
    };
  if (!settings.matchesHost)
    return {
      secure: false,
      message: "Der Name im Zertifikat passt nicht zur aufgerufenen Adresse.",
    };
  if (settings.expired)
    return {
      secure: false,
      message:
        "Das Zertifikat ist abgelaufen. Die Vertrauensprüfung schlägt fehl.",
    };
  return {
    secure: true,
    message:
      "Im Modell sind Verschlüsselung und Serverprüfung erfolgreich. Das bestätigt weder ehrliche Inhalte noch einen sicheren Shop.",
  };
}

export function checkNetwork(
  rules: Rule[],
  settings: TlsSettings,
): {
  passed: boolean;
  results: Array<NetworkCase & Decision & { correct: boolean }>;
  tls: ReturnType<typeof tlsResult>;
} {
  // Rules compare only equality or “any”. All explicit rule ports and one
  // remaining port represent every possible outcome, for both directions and
  // transports. This checks the policy rather than only the visible examples.
  const ports = new Set([53, 80, 443]);
  for (const rule of rules)
    if (typeof rule.port === "number") ports.add(rule.port);
  for (let port = 1; port <= 65535; port++) {
    if (!ports.has(port)) {
      ports.add(port);
      break;
    }
  }
  const cases = [...NETWORK_CASES];
  for (const direction of ["in", "out"] as const)
    for (const protocol of ["TCP", "UDP"] as const)
      for (const port of ports)
        if (
          !cases.some(
            (packet) =>
              packet.direction === direction &&
              packet.protocol === protocol &&
              packet.port === port,
          )
        )
          cases.push({
            direction,
            protocol,
            port,
            label: `Gegenprobe: ${direction === "out" ? "ausgehend" : "eingehend"} ${protocol} ${port}`,
            expected:
              direction === "out" &&
              ((protocol === "TCP" && port === 443) ||
                (protocol === "UDP" && port === 53)),
          });
  const results = cases.map((packet) => {
    const decision = filterPacket(packet, rules);
    return {
      ...packet,
      ...decision,
      correct: decision.allowed === packet.expected,
    };
  });
  const tls = tlsResult(settings);
  return {
    passed: results.every((result) => result.correct) && tls.secure,
    results,
    tls,
  };
}
