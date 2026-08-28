import { useT } from '../../lib/use-locale';
import { AboutPanel } from './AboutPanel';

/**
 * Standalone About page (S8 /about): mission, source attribution and
 * license, rendered full-size outside the settings dialog.
 * @returns The rendered page.
 */
export function AboutPage(): JSX.Element {
  const { t } = useT();
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
          {t('about.title')}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t('app.tagline')}</p>
      </div>
      <AboutPanel />
    </div>
  );
}
