import { useMemo } from 'react';
import { analyzeTajweed, TAJWEED_RULES } from '../../lib/core/tajweed';
import { RULE_EXAMPLES } from '../../lib/core/tajweed-examples';
import { TajweedText } from './TajweedText';
import { TajweedAudio } from './TajweedAudio';
import { Card } from '../ui/Card';

/**
 * Real Examples — the verification ledger. Every rule is paired with a
 * genuine Quran ayah and the reciter's reasoning, and the card shows
 * live proof that the engine detects exactly that rule in that text.
 * @returns The rendered verification list.
 */
export function RuleCheck(): JSX.Element {
  const verdicts = useMemo(
    () =>
      RULE_EXAMPLES.map((ex) => {
        const found = analyzeTajweed(ex.ayah).some((s) => s.rule === ex.rule);
        return { ex, found };
      }),
    []
  );
  const passed = verdicts.filter((v) => v.found).length;

  return (
    <div className="space-y-4">
      <Card tone="raised" className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[var(--fg)]">
            Every rule, checked against a real ayah
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)] max-w-xl">
            Each card below is a genuine verse a reciter would use to teach that rule — with the
            reason it applies. The engine re-analyzes the verse live and must find the rule,
            so what you read is exactly what gets colored.
          </p>
        </div>
        <p className="text-lg font-extrabold tnum text-[var(--success)] shrink-0">
          {passed}/{verdicts.length} verified
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {verdicts.map(({ ex, found }) => {
          const rule = TAJWEED_RULES[ex.rule];
          return (
            <Card key={`${ex.rule}-${ex.ayahNum}`} hover className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--fg)]">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: rule.color }} />
                  {ex.label}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    role="status"
                    aria-label={found ? 'Engine verified' : 'Engine mismatch'}
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide',
                      found
                        ? 'bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]'
                        : 'bg-[color-mix(in_srgb,var(--danger)_14%,transparent)] text-[var(--danger)]',
                    ].join(' ')}
                  >
                    {found ? '✓ engine agrees' : '✗ mismatch'}
                  </span>
                  <TajweedAudio compact surah={ex.surah} from={ex.ayahNum} label={`Hear ${ex.label} recited`} />
                </span>
              </div>

              <p className="arabic mt-3 text-lg sm:text-xl lg:text-[1.35rem] leading-[2.15] text-[var(--fg)] text-right">
                <TajweedText text={ex.ayah} focus={ex.rule} />
              </p>

              <p className="mt-3 border-t border-[var(--border)] pt-2.5 text-xs leading-relaxed text-[var(--muted)] flex-1">
                <span className="font-extrabold text-[var(--fg)]">Why here: </span>
                {ex.why}
              </p>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Surah {ex.surah} · ayah {ex.ayahNum} — focus dimmed to this rule only
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
