import { DONATION_LINKS, DONATION_TAGLINE } from '../../lib/donation';

/**
 * Landing support strip (S11): halal framing, external links only,
 * no guilt language.
 * @returns The rendered donation footer band.
 */
export function DonationFooter(): JSX.Element {
  const primary = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];
  const secondary = DONATION_LINKS.filter((l) => !l.primary);

  return (
    <section aria-label="Support SalahKit" className="mx-auto max-w-7xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--card))] px-6 py-8 sm:px-10">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Sadaqah jariyah</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--fg)] sm:text-3xl">
              Free forever — by choice, not by ads.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {DONATION_TAGLINE} Contributions are voluntary, handled by external providers, and
              never unlock anything — because nothing is locked.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-bold text-[#3b2305] shadow-lg shadow-amber-900/20 hover:brightness-105 active:scale-[0.97] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 2C9 4 9 6 12 8c-3 2-5 1-6-1M4 10h9a3 3 0 0 1 0 6H7a3 3 0 0 1-3-3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Support on {primary.label}
            </a>
            {secondary.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-bold text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)] active:scale-[0.97] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
