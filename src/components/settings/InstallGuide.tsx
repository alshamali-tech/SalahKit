import { useMemo } from 'react';
import { isStandalone } from '../../lib/utils/capabilities';
import { useT } from '../../lib/use-locale';
import { Modal } from '../ui/Modal';

export interface InstallGuideProps {
  /** Controls visibility. */
  open: boolean;
  /** Close handler. */
  onClose: () => void;
}

type Platform = 'ios' | 'android' | 'desktop';

/** Detects the rough platform from the user agent (best-effort only). */
function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

/**
 * Install guide modal (P6): installed home-screen apps escape the
 * browser's ~7-day data-expiry pressure and run fully offline, so this
 * is the single most impactful thing a user can do for data survival.
 * @param props - open/onClose.
 * @returns The rendered step-by-step guide.
 */
export function InstallGuide({ open, onClose }: InstallGuideProps): JSX.Element {
  const { t } = useT();
  const platform = useMemo(detectPlatform, []);
  const installed = useMemo(isStandalone, []);

  const steps: { title: string; items: string[] } =
    platform === 'ios'
      ? { title: t('install.iosTitle'), items: [t('install.ios1'), t('install.ios2'), t('install.ios3')] }
      : platform === 'android'
        ? { title: t('install.androidTitle'), items: [t('install.android1'), t('install.android2')] }
        : { title: t('install.desktopTitle'), items: [t('install.desktop1')] };

  return (
    <Modal open={open} onClose={onClose} title={t('install.title')}>
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        {installed ? t('install.installed') : t('install.sub')}
      </p>
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--field)] p-4">
        <p className="text-sm font-extrabold text-[var(--fg)]">{steps.title}</p>
        <ol className="mt-3 space-y-2.5">
          {steps.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-extrabold text-[var(--primary-fg)] tnum">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-[var(--fg)]">{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
        iOS Safari: Share → Add to Home Screen · Android Chrome: ⋮ → Install app
      </p>
    </Modal>
  );
}
