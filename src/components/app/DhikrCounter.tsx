import { useEffect, useMemo, useRef, useState } from 'react';
import { TASBIH_TARGETS } from '../../lib/core/constants';
import { addTasbih, sumTasbihToday } from '../../lib/db/db';
import { emitToast } from '../../lib/messaging';
import { formatNumber } from '../../lib/utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

interface DhikrType {
  id: string;
  label: string;
  arabic: string;
}

const DHIKR_TYPES: readonly DhikrType[] = [
  { id: 'subhanallah', label: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ' },
  { id: 'alhamdulillah', label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ' },
  { id: 'allahu-akbar', label: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ' },
  { id: 'istighfar', label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ' },
  { id: 'tahlil', label: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
  { id: 'salawat', label: 'Salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ' },
];

const RING_RADIUS = 86;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Dhikr/tasbih counter: tap-to-count with progress ring, targets,
 * undo (in-memory snapshot per S6) and IndexedDB persistence.
 * @returns The rendered module.
 */
export function DhikrCounter(): JSX.Element {
  const [dhikrId, setDhikrId] = useState(DHIKR_TYPES[0].id);
  const [target, setTarget] = useState<number>(33);
  const [count, setCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const undoStack = useRef<number[]>([]);
  const [pulse, setPulse] = useState(0);

  const dhikr = useMemo(
    () => DHIKR_TYPES.find((d) => d.id === dhikrId) ?? DHIKR_TYPES[0],
    [dhikrId]
  );

  useEffect(() => {
    void sumTasbihToday().then(setTodayTotal);
  }, []);

  useEffect(() => {
    setCount(0);
    undoStack.current = [];
  }, [dhikrId, target]);

  /** Registers one count; persists and celebrates at the target. */
  function tap(): void {
    const nextCount = count + 1;
    undoStack.current = [...undoStack.current.slice(-49), count];
    setPulse((p) => p + 1);
    if (nextCount >= target) {
      setCount(0);
      setTodayTotal((t) => t + target);
      void addTasbih(dhikrId, target);
      emitToast({
        title: `${dhikr.label} × ${target} complete`,
        body: 'Recorded to your local tasbih log.',
        tone: 'success',
      });
      return;
    }
    setCount(nextCount);
  }

  /** Restores the previous count from the in-memory snapshot. */
  function undo(): void {
    const previous = undoStack.current.pop();
    if (previous !== undefined) setCount(previous);
  }

  const progress = Math.min(1, count / target);
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
      <Card className="flex flex-col items-center py-10 relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <p className="relative arabic text-3xl text-[var(--fg)]">{dhikr.arabic}</p>
        <p className="relative mt-1 text-sm font-semibold text-[var(--primary)]">{dhikr.label}</p>

        <button
          key={pulse}
          type="button"
          onClick={tap}
          aria-label={`Count ${dhikr.label}: ${count} of ${target}`}
          className="relative mt-8 inline-flex h-52 w-52 items-center justify-center rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] active:scale-95 transition-transform duration-100 animate-[fadeIn_120ms_ease-out]"
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={RING_RADIUS} fill="var(--field)" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 200ms ease-out' }}
            />
          </svg>
          <span className="relative">
            <span className="block text-6xl font-extrabold tnum text-[var(--fg)]">{count}</span>
            <span className="block text-center text-xs font-bold uppercase tracking-widest text-[var(--muted)] mt-1">
              of {target}
            </span>
          </span>
        </button>

        <div className="relative mt-8 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={undoStack.current.length === 0}>
            Undo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </Card>

      <div className="space-y-4 min-w-0">
        <Card tone="raised">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Today’s dhikr</p>
          <p className="mt-1 text-4xl font-extrabold tnum text-[var(--fg)]">{formatNumber(todayTotal)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">Stored privately in this browser only.</p>
        </Card>
        <Card>
          <Select
            label="Dhikr phrase"
            id="dhikr-type"
            value={dhikrId}
            onChange={(e) => setDhikrId(e.target.value)}
            options={DHIKR_TYPES.map((d) => ({ value: d.id, label: d.label }))}
          />
          <div className="mt-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              Target per round
            </span>
            <div className="flex gap-2">
              {TASBIH_TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={target === t}
                  onClick={() => setTarget(t)}
                  className={[
                    'h-10 flex-1 rounded-lg text-sm font-bold tnum transition-all duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                    target === t
                      ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                      : 'bg-[var(--field)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone="success">Private</Badge>
            <span className="text-xs text-[var(--muted)]">No account, no cloud — your counts never leave this device.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
