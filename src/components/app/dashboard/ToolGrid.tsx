import { navigate } from '../../../lib/router';
import { useT } from '../../../lib/use-locale';
import type { ModuleId } from '../../../types';
import { Badge } from '../../ui/Badge';

interface Tool {
  module: ModuleId;
  /** Inline SVG path (20x20, stroke). */
  icon: string;
}

const TOOLS: readonly Tool[] = [
  { module: 'prayer', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v4l2.6 2.6' },
  { module: 'qibla', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM13.2 6.8l-1.9 4.5-4.5 1.9 1.9-4.5z' },
  { module: 'quran', icon: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12' },
  { module: 'tajweed', icon: 'M4 4h12v12H4zM7 7.4c1 1 2.5 1 3 0M11.5 7.4c.5 1 2 1 3 0M7.5 11h5M8.5 13.4h3' },
  { module: 'arabic', icon: 'M4 14c2-1 3-4 3-8M4 8c1.5 0 3 .5 4 1.5M11 14V6M11 6c1.5-1 3-1 4 .5 1 1.5.5 3.5-1 4.5l3 3' },
  { module: 'hijri', icon: 'M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5zM3 8h14M7 2.5V5M13 2.5V5M6.5 11.5h2v2h-2z' },
  { module: 'dhikr', icon: 'M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4zM10 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z' },
  { module: 'zakat', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v8M7.7 8h3.6a1.6 1.6 0 0 1 0 3.2H8.7a1.6 1.6 0 0 0 0 3.2h3.6' },
  { module: 'duas', icon: 'M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z' },
  { module: 'names', icon: 'M10 2.3l2.3 4.7 5.1.8-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.8z' },
  { module: 'hadith', icon: 'M3.5 3.5h13v13h-13zM6.5 7h7M6.5 10h7M6.5 13h4.5' },
  { module: 'hifz', icon: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12M7 9l2 2 4-4.6' },
  { module: 'tracker', icon: 'M3.5 5.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2zM6.8 10.4l2.2 2.2 4.4-5' },
];

/**
 * The 13-tool launcher grid for the dashboard hub.
 * @returns The rendered grid.
 */
export function ToolGrid(): JSX.Element {
  const { t } = useT();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {TOOLS.map((tool) => (
        <button
          key={tool.module}
          type="button"
          onClick={() => navigate(`/tools/${tool.module}`)}
          className="group flex flex-col items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] transition-transform duration-200 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={tool.icon} />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold text-[var(--fg)]">
              {t(`modules.${tool.module}`)}
            </span>
          </span>
        </button>
      ))}
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--border)] p-4">
        <Badge tone="success">{t('badges.freeForever')}</Badge>
      </div>
    </div>
  );
}
