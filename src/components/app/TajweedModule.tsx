import { useEffect, useState } from 'react';
import { RULE_ORDER, TAJWEED_RULES } from '../../lib/core/tajweed';
import { getJSON } from '../../lib/utils/storage';
import { STORAGE_KEYS } from '../../lib/core/constants';
import { TajweedText } from '../tajweed/TajweedText';
import { TajweedLegend } from '../tajweed/TajweedLegend';
import { TajweedAudio } from '../tajweed/TajweedAudio';
import { TajweedPath } from '../tajweed/TajweedPath';
import { NoonTree } from '../tajweed/NoonTree';
import { LetterMap } from '../tajweed/LetterMap';
import { TajweedLab } from '../tajweed/TajweedLab';
import { RuleCheck } from '../tajweed/RuleCheck';
import { SifaatExplorer } from '../tajweed/SifaatExplorer';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useT } from '../../lib/use-locale';

type TabId = 'path' | 'tree' | 'check' | 'map' | 'sifaat' | 'lab';

const TAB_IDS: readonly TabId[] = ['path', 'tree', 'check', 'map', 'sifaat', 'lab'];

const OPENING_LINE = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

/**
 * Tajweed module shell: opens on a live-annotated mushaf strip whose
 * focus sweeps the rules, then hosts the four learning views.
 * @returns The rendered module.
 */
export function TajweedModule(): JSX.Element {
  const { t } = useT();
  const [tab, setTab] = useState<TabId>('path');
  const [sweep, setSweep] = useState<number>(0);
  const masteredCount = getJSON<string[]>(STORAGE_KEYS.tajweedProgress, []).length;

  useEffect(() => {
    const id = window.setInterval(() => setSweep((s) => (s + 1) % (RULE_ORDER.length + 1)), 2400);
    return () => window.clearInterval(id);
  }, []);

  const focus = sweep < RULE_ORDER.length ? RULE_ORDER[sweep] : null;
  const ui = {
    tabs: TAB_IDS.map((id) => ({ id, label: t(`modulesUi.tajweed.tabs.${id}`), hint: t(`modulesUi.tajweed.hints.${id}`) })),
  };
  const activeTab = ui.tabs.find((x) => x.id === tab) ?? ui.tabs[0];

  return (
    <div className="space-y-5">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div aria-hidden="true" className="absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-[color-mix(in_srgb,var(--accent)_60%,transparent)] rounded-tl-lg" />
        <div aria-hidden="true" className="absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-[color-mix(in_srgb,var(--accent)_60%,transparent)] rounded-tr-lg" />
        <div aria-hidden="true" className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-[color-mix(in_srgb,var(--accent)_60%,transparent)] rounded-bl-lg" />
        <div aria-hidden="true" className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-[color-mix(in_srgb,var(--accent)_60%,transparent)] rounded-br-lg" />

        <div className="relative flex flex-col lg:flex-row gap-6 lg:items-center px-2 py-4">
          <div className="min-w-0 flex-1 text-center lg:text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
              {t('modulesUi.tajweed.introKicker')} · تعلّم التجويد
            </p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
              {t('modulesUi.tajweed.introTitle')} <span className="arabic text-2xl text-[var(--accent-strong)]">تَجْوِيد</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)] max-w-md mx-auto lg:mx-0">
              {t('modulesUi.tajweed.introSub')}
            </p>
            <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
              <Badge tone="primary">{masteredCount}/6 {t('modulesUi.tajweed.masteredOf')}</Badge>
              <Badge tone="neutral">{RULE_ORDER.length} {t('modulesUi.tajweed.labFound').toLowerCase()}</Badge>
            </div>
          </div>
          <div className="min-w-0 lg:w-[46%]">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-inner">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">The Basmala · light lam of Allah</span>
                <TajweedAudio compact surah={1} from={1} to={1} label={t('modulesUi.tajweed.introListen')} />
              </div>
              <p className="arabic text-xl sm:text-2xl text-[var(--fg)] text-right leading-[2.2]" aria-label="Annotated opening ayah">
                <TajweedText text={OPENING_LINE} focus={focus} />
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5">
                <span className="text-[11px] font-bold text-[var(--muted)] truncate" aria-live="polite">
                  {focus ? TAJWEED_RULES[focus].label : ''}
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  {RULE_ORDER.slice(0, 6).map((r, i) => (
                    <span
                      key={r}
                      className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                      style={{
                        background: TAJWEED_RULES[r].color,
                        transform: sweep % (RULE_ORDER.length + 1) === i ? 'scale(1.6)' : 'scale(1)',
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
            <div className="mt-2.5">
              <TajweedLegend />
            </div>
          </div>
        </div>
      </Card>

      <div className="sticky top-16 z-30 -mx-4 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] px-4 py-2 backdrop-blur-md">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Tajweed views">
          {ui.tabs.map((tb) => {
            const active = tb.id === tab;
            return (
              <button
                key={tb.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(tb.id)}
                className={[
                  'relative shrink-0 rounded-lg px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                  active ? 'bg-[color-mix(in_srgb,var(--primary)_13%,transparent)] text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]',
                ].join(' ')}
              >
                {tb.label}
                <span className={['block text-[10px] font-semibold', active ? 'text-[var(--primary)] opacity-80' : 'opacity-60'].join(' ')}>
                  {tb.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="pt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {activeTab.label} · {activeTab.hint}
      </p>

      <div key={tab} className="module-enter">
        {tab === 'path' ? (
          <TajweedPath />
        ) : tab === 'tree' ? (
          <NoonTree />
        ) : tab === 'check' ? (
          <RuleCheck />
        ) : tab === 'map' ? (
          <LetterMap />
        ) : tab === 'sifaat' ? (
          <SifaatExplorer />
        ) : (
          <TajweedLab />
        )}
      </div>
    </div>
  );
}
