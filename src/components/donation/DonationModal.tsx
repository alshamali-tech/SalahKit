import { DONATION_LINKS, DONATION_TAGLINE } from '../../lib/donation';
import { Modal } from '../ui/Modal';

export interface DonationModalProps {
  /** Controls visibility. */
  open: boolean;
  /** Close handler. */
  onClose: () => void;
}

/**
 * Support dialog (S9/S11): the three external destinations with halal
 * framing. Links only — SalahKit never processes payments.
 * @param props - open/onClose.
 * @returns The rendered dialog.
 */
export function DonationModal({ open, onClose }: DonationModalProps): JSX.Element {
  const primary = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];
  const secondary = DONATION_LINKS.filter((l) => !l.primary);

  return (
    <Modal open={open} onClose={onClose} title="Support SalahKit">
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        {DONATION_TAGLINE} SalahKit is an <em className="text-[var(--fg)] not-italic font-semibold">independent project</em>,
        built and maintained by its developer. If it helps your salah, your dhikr or your zakat, a tip helps keep it running.
      </p>

      <a
        href={primary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-bold text-[#3b2305] shadow-lg shadow-amber-900/20 hover:brightness-105 active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span className="inline-flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 2C9 4 9 6 12 8c-3 2-5 1-6-1M4 10h9a3 3 0 0 1 0 6H7a3 3 0 0 1-3-3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Donate on {primary.label}
        </span>
        <span aria-hidden="true">↗</span>
      </a>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {secondary.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--field)] text-sm font-bold text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        Donations are voluntary, non-refundable and processed entirely by the provider — SalahKit
        never sees payment details. Nothing is locked behind them, and there is no obligation. Jazakumullahu khairan.
      </p>
    </Modal>
  );
}
