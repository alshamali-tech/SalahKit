import { useState } from 'react';
import { TAJWEED_CONCEPTS } from '../../lib/core/tajweed-data';
import { STORAGE_KEYS } from '../../lib/core/constants';
import { getJSON, setJSON } from '../../lib/utils/storage';
import { TajweedText } from './TajweedText';
import { TajweedAudio } from './TajweedAudio';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * The guided Path (Chain of Thought): six concepts where each one's
 * answer becomes the next one's question — makharij, the noon tree,
 * ghunna, qalqalah, madd, waqf. Mastery is persisted locally.
 * Layout is pure normal flow (grid + in-flow connector) so steps can
 * never overlap or hide behind the progress header.
 * @returns The rendered learning chain.
 */
export function TajweedPath(): JSX.Element {
  const [mastered, setMastered] = useState<string[]>(() => getJSON<string[]>(STORAGE_KEYS.tajweedProgress, []));
  const firstOpen = TAJWEED_CONCEPTS.find((c) => !mastered.includes(c.id))?.id ?? TAJWEED_CONCEPTS[0].id;
  const [expanded, setExpanded] = useState<string | null>(firstOpen);

  /** Persists a mastery toggle. */
  function toggleMastered(id: string): void {
    setMastered((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      setJSON(STORAGE_KEYS.tajweedProgress, next);
      return next;
    });
  }

  const pct = Math.round((mastered.length / TAJWEED_CONCEPTS.length) * 100);

  return (
    <div className="space-y-4">
      <Card tone="raised" className="flex flex-wrap items-center gap-4">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--hover)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="26" fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 26}
            strokeDashoffset={2 * Math.PI * 26 * (1 - pct / 100)}
            transform="rotate(-90 32 32)"
            style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
          />
          <text x="32" y="37" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--fg)" className="tnum">
            {pct}%
          </text>
        </svg>
        <div className="min-w-0 flex-1 basis-52">
          <p className="text-sm font-extrabold text-[var(--fg)]">
            {mastered.length} of {TAJWEED_CONCEPTS.length} concepts mastered
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
            Follow the chain top to bottom — every concept answers the question the previous one
            leaves behind. Mastered links stay checked on this device.
          </p>
        </div>
        <Badge tone={mastered.length === TAJWEED_CONCEPTS.length ? 'success' : 'primary'}>
          {mastered.length === TAJWEED_CONCEPTS.length ? 'Chain complete' : 'In progress'}
        </Badge>
      </Card>

      <ol>
        {TAJWEED_CONCEPTS.map((concept) => {
          const isMastered = mastered.includes(concept.id);
          const isOpen = expanded === concept.id;
          const idx = TAJWEED_CONCEPTS.findIndex((c) => c.id === concept.id);
          const next = TAJWEED_CONCEPTS[idx + 1];
          const isLast = idx === TAJWEED_CONCEPTS.length - 1;
          return (
            <li key={concept.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3">
              {/* Step circle + connector, fully in flow */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={[
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold tnum transition-all duration-200',
                    isMastered
                      ? 'border-[var(--success)] bg-[var(--success)] text-white'
                      : isOpen
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-fg)] shadow-md shadow-teal-900/20'
                        : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)]',
                  ].join(' ')}
                >
                  {isMastered ? (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    concept.order
                  )}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={['my-1 w-px flex-1', isMastered ? 'bg-[var(--success)]' : 'bg-[var(--border)]'].join(' ')}
                  />
                ) : null}
              </div>

              {/* Step body */}
              <div className={['min-w-0', isLast ? '' : 'pb-3'].join(' ')}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : concept.id)}
                  aria-expanded={isOpen}
                  className={[
                    'w-full rounded-xl border bg-[var(--card)] px-4 py-3 text-left transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                    isOpen ? 'border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] shadow-md' : 'border-[var(--border)] hover:border-[var(--primary)]',
                  ].join(' ')}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-[var(--fg)]">
                      {concept.title} <span className="arabic text-base text-[var(--muted)] mr-1">{concept.arabic}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Badge tone="neutral">{concept.minutes} min</Badge>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={['text-[var(--muted)] transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}>
                        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">{concept.tagline}</span>
                </button>

                {isOpen ? (
                  <Card key={concept.id} className="mt-2 animate-[slideUp_240ms_ease-out] space-y-3">
                    <ul className="space-y-1.5">
                      {concept.points.map((point) => (
                        <li key={point.slice(0, 32)} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--fg)]">
                          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    {concept.letters ? (
                      <div className="flex flex-wrap gap-1.5">
                        {concept.letters.map((l) => (
                          <span key={l.char} title={l.name} className="arabic inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2.5 text-lg leading-none">
                            {l.char}
                            <span className="text-[10px] font-bold text-[var(--muted)]" style={{ fontFamily: 'inherit' }}>{l.name}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--field)] p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Practice — the colors show the rule at work</p>
                        {concept.audio ? (
                          <TajweedAudio
                            compact
                            surah={concept.audio.surah}
                            from={concept.audio.ayah}
                            to={concept.audio.to}
                            label={`Hear the ${concept.title} rule recited`}
                          />
                        ) : null}
                      </div>
                      <p className="arabic text-xl sm:text-2xl text-[var(--fg)] text-right">
                        <TajweedText text={concept.practice} />
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">{concept.practiceHint}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Button variant={isMastered ? 'outline' : 'primary'} size="sm" onClick={() => toggleMastered(concept.id)}>
                        {isMastered ? 'Unmark mastered' : 'Mark as mastered'}
                      </Button>
                      {next ? (
                        <Button variant="ghost" size="sm" onClick={() => setExpanded(next.id)}>
                          Next: {next.title} →
                        </Button>
                      ) : (
                        <Badge tone="success">End of the chain</Badge>
                      )}
                    </div>
                  </Card>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
