/** Online Physics keeps its canonical Academy route. The offline bundle uses the same app locally. */
export function physicsLink(location: Pick<Location, "hostname" | "protocol">): string {
  return location.protocol === "https:" && location.hostname === "academy.zam-os.org"
    ? "../physik-gymnasium-7/"
    : "./physik/index.html";
}

export function subjectOverview(completed: number, total: number, physicsUrl: string): string {
  return `
    <section class="subject-overview">
      <div class="subject-heading">
        <p>Gymnasium Bayern · 7. Klasse</p>
        <h2>Natur und Technik</h2>
        <p>Wähle einen Schwerpunkt.</p>
      </div>
      <div class="subject-grid">
        <article class="subject-card subject-physics">
          <svg viewBox="0 0 600 225" role="img" aria-label="Zwei Lichtstrahlen treffen auf ein Hindernis und begrenzen seinen Schatten.">
            <path d="M 73 112 L 548 46 L 548 179 Z" fill="currentColor" opacity=".22"/>
            <path d="M 73 112 L 548 46 M 73 112 L 548 179" fill="none" stroke="currentColor" stroke-width="3"/>
            <path d="M 305 80 L 548 46 L 548 179 L 305 145 Z" fill="#20223d"/>
            <path d="M 548 31 V 194" stroke="#fff0d0" stroke-width="4" stroke-linecap="round"/>
            <circle cx="73" cy="112" r="27" fill="currentColor"/>
            <rect x="292" y="80" width="13" height="65" rx="4" fill="#e2e6ff"/>
            <g fill="#fff0d0" font-size="16" font-family="system-ui, sans-serif" text-anchor="middle">
              <text x="73" y="165">Lichtquelle</text><text x="299" y="179">Hindernis</text><text x="463" y="118">Schatten</text>
            </g>
          </svg>
          <div class="subject-card-body">
            <p>NT7 · Lernbereich 1</p>
            <h3>Physik</h3>
            <p>Untersuche Magnete und Dichte, verändere Licht und Schatten und erkunde elektrische Schaltungen.</p>
            <div class="subject-card-footer"><a class="btn btn-primary" href="${physicsUrl}">Physik öffnen →</a><span>21 Lektionen</span></div>
          </div>
        </article>
        <article class="subject-card subject-informatics">
          <svg viewBox="0 0 600 225" role="img" aria-label="Ein Wiki-Graph führt von Start zu Versuche, von Versuche zu Erklärung und von Erklärung zurück zu Start.">
            <defs><marker id="overview-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 12 6 L 0 12 z" fill="currentColor"/></marker></defs>
            <g fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#overview-arrow)">
              <path d="M 244 72 L 165 130"/><path d="M 199 156 H 397"/><path d="M 433 128 L 356 71"/>
            </g>
            <g fill="#244c72" stroke="currentColor" stroke-width="2">
              <rect x="246" y="31" width="108" height="44" rx="12"/><rect x="66" y="134" width="129" height="44" rx="12"/><rect x="405" y="134" width="129" height="44" rx="12"/>
            </g>
            <g fill="#effdff" font-size="17" font-family="system-ui, sans-serif" text-anchor="middle">
              <text x="300" y="59">Start</text><text x="130" y="161">Versuche</text><text x="469" y="161">Erklärung</text>
            </g>
          </svg>
          <div class="subject-card-body">
            <p>NT7 · Lernbereich 2</p>
            <h3>Informatik</h3>
            <p>Baue ein Wiki, verfolge eine Webanfrage und programmiere einen Roboter mit Bedingungen und Schleifen.</p>
            <div class="subject-card-footer"><button class="btn btn-primary" type="button" data-open-informatics>Informatik öffnen →</button><span>${completed ? `${completed} von ` : ""}${total} Lektionen</span></div>
          </div>
        </article>
      </div>
    </section>`;
}
