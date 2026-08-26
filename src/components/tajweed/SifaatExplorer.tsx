import { useMemo, useState } from 'react';
import { SIFAAT, SIFAAT_LETTERS, traitsOfLetter, sifahZone } from '../../lib/core/sifaat-data';
import type { Sifah } from '../../lib/core/sifaat-data';
import { Card } from '../ui/Card';

const OPPOSING_PAIRS = [
  'hams-jahr',
  'shiddah-rakhawah',
  "isti'la-istifal",
  'itbaq-infitah',
  'idhlaq-ismat',
];

/**
 * Ṣifāt al-Ḥurūf explorer. Two linked directions of lookup: pick a
 * letter to see every characteristic it carries, or pick a ṣifah to
 * see all the letters that share it. Selecting one highlights the other.
 * @returns The rendered explorer.
 */
export function SifaatExplorer(): JSX.Element {
  const [letter, setLetter] = useState<string | null>('ق');
  const [sifahId, setSifahId] = useState<string | null>(null);

  const sifah = useMemo(() => SIFAAT.find((s) => s.id === sifahId) ?? null, [sifahId]);
  const letterTraits = useMemo(() => (letter ? traitsOfLetter(letter) : []), [letter]);

  /** True when a letter is highlighted by the current selections. */
  const isLit = (l: string): boolean => {
    if (sifah) return sifah.letters.includes(l);
    if (letter) return traitsOfLetter(l).some((t) => letterTraits.includes(t)) || l === letter;
    return false;
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">The alphabet — tap a letter</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SIFAAT_LETTERS.map((l) => {
            const active = letter === l;
            const lit = isLit(l);
            return (
              <button
                key={l}
                type="button"
                onClick={() => { setLetter(l); setSifahId(null); }}
                aria-pressed={active}
                className={[
                  'arabic inline-flex h-11 w-11 items-center justify-center rounded-lg border text-xl leading-none transition-all duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] active:scale-90',
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-fg)] shadow-md scale-105'
                    : lit
                      ? 'border-[color-mix(in_srgb,var(--primary)_50%,var(--border))] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--fg)]'
                      : 'border-[var(--border)] bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]',
                ].join(' ')}
              >
                {l}
              </button>
            );
          })}
        </div>
      </Card>

      {letter ? (
        <Card key={letter} tone="raised" className="animate-[fadeIn_220ms_ease-out]">
          <div className="flex flex-wrap items-start gap-4">
            <span className="arabic inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-4xl leading-none text-[var(--primary)]">
              {letter}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-extrabold text-[var(--fg)]">
                Traits of <span className="arabic text-xl text-[var(--primary)]">{letter}</span>
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  makhraj: {sifahZone(letter)}
                </span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {letterTraits.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSifahId(t.id); }}
                    title={t.meaning}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 h-8 text-xs font-bold text-[var(--fg)] hover:-translate-y-px hover:shadow-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                  >
                    <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                    {t.name} <span className="arabic text-sm text-[var(--muted)]">{t.arabic}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                Tap any trait above to see every letter that shares it.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {sifah ? (
        <Card key={sifah.id} tone="raised" className="animate-[fadeIn_220ms_ease-out]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-extrabold text-[var(--fg)]">
              <span aria-hidden="true" className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: sifah.color }} />
              {sifah.name} <span className="arabic text-xl text-[var(--muted)]">{sifah.arabic}</span>
            </p>
            <button
              type="button"
              onClick={() => setSifahId(null)}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
            >
              clear
            </button>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{sifah.meaning}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {sifah.letters.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { setLetter(l); setSifahId(null); }}
                className="arabic inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg leading-none transition-all duration-150 hover:scale-105 active:scale-90 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                style={{ background: `color-mix(in srgb, ${sifah.color} 14%, transparent)`, color: sifah.color, border: `1px solid color-mix(in srgb, ${sifah.color} 35%, transparent)` }}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            {sifah.letters.length} letter{sifah.letters.length === 1 ? '' : 's'} · tap one to inspect it
          </p>
        </Card>
      ) : null}

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          Opposing pairs — every letter carries exactly one pole of each pair
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OPPOSING_PAIRS.map((pair) => {
            const poles = SIFAAT.filter((s) => s.pair === pair);
            return (
              <Card key={pair} hover className="p-3.5">
                <div className="space-y-2">
                  {poles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSifahId(p.id); setLetter(null); }}
                      aria-pressed={sifahId === p.id}
                      className={[
                        'w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] active:scale-[0.98]',
                        sifahId === p.id
                          ? 'border-transparent shadow-sm'
                          : 'border-[var(--border)] bg-[var(--field)] hover:border-[var(--primary)]',
                      ].join(' ')}
                      style={sifahId === p.id ? { background: `color-mix(in srgb, ${p.color} 16%, transparent)`, borderColor: p.color } : undefined}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />
                        <span className="text-sm font-bold text-[var(--fg)] truncate">{p.name}</span>
                        <span className="arabic text-sm text-[var(--muted)] shrink-0">{p.arabic}</span>
                      </span>
                      <span className="tnum text-[11px] font-extrabold text-[var(--muted)] shrink-0">{p.letters.length}</span>
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
          <Card hover className="p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Standalone traits</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIFAAT.filter((s) => s.pair === null).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSifahId(s.id); setLetter(null); }}
                  aria-pressed={sifahId === s.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--field)] px-3 h-8 text-xs font-bold text-[var(--fg)] hover:-translate-y-px hover:shadow-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
