import { RULE_ORDER, RULE_CATEGORIES, TAJWEED_RULES } from '../../lib/core/tajweed';
import type { TajweedRuleId, RuleCategory } from '../../lib/core/tajweed';

export interface TajweedLegendProps {
  /** Per-rule counts; shown as badges when provided. */
  counts?: Record<string, number>;
  /** Currently focused rule (dims the others in paired text). */
  focus?: TajweedRuleId | null;
  /** Click handler; omit for a static legend. */
  onFocus?: (id: TajweedRuleId | null) => void;
  /** Only show rules present in counts (used by the Lab). */
  onlyCounted?: boolean;
  /** Group chips under category headings (default when many rules). */
  grouped?: boolean;
}

/**
 * The rule legend — colored chips that double as focus filters (Tree of
 * Thoughts: pick a branch, see only it). When grouped, chips cluster
 * under their category so the full rule set stays scannable.
 * @param props - counts/focus/onFocus/onlyCounted/grouped.
 * @returns The rendered legend.
 */
export function TajweedLegend({
  counts,
  focus = null,
  onFocus,
  onlyCounted = false,
  grouped = true,
}: TajweedLegendProps): JSX.Element {
  const ids = onlyCounted && counts
    ? RULE_ORDER.filter((id) => (counts[id] ?? 0) > 0)
    : RULE_ORDER;

  const renderChip = (id: TajweedRuleId): JSX.Element => {
    const rule = TAJWEED_RULES[id];
    const active = focus === id;
    const count = counts?.[id];
    const inner = (
      <>
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: rule.color, boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${rule.color} 30%, transparent)` : undefined }}
        />
        <span className="truncate">{rule.label}</span>
        {count !== undefined ? (
          <span className="tnum rounded bg-[var(--hover)] px-1 text-[10px] font-extrabold">{count}</span>
        ) : null}
      </>
    );
    const classes = [
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 h-7 text-[11px] font-bold transition-all duration-150 min-w-0',
      active ? 'border-transparent text-white shadow-sm' : 'border-[var(--border)] bg-[var(--card)] text-[var(--fg)]',
      onFocus ? 'cursor-pointer hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]' : 'cursor-default',
    ].join(' ');
    const style = active ? { background: rule.color } : undefined;
    return onFocus ? (
      <button key={id} type="button" onClick={() => onFocus(active ? null : id)} aria-pressed={active} title={rule.desc} className={classes} style={style}>
        {inner}
      </button>
    ) : (
      <span key={id} className={classes} title={rule.desc}>
        {inner}
      </span>
    );
  };

  if (!grouped) return <div className="flex flex-wrap gap-1.5">{ids.map(renderChip)}</div>;

  const order: RuleCategory[] = ['noon', 'meem', 'ghunna', 'qalqalah', 'lam', 'ra', 'madd', 'waqf'];
  return (
    <div className="space-y-2.5">
      {order.map((cat) => {
        const catIds = ids.filter((id) => TAJWEED_RULES[id].category === cat);
        if (catIds.length === 0) return null;
        return (
          <div key={cat} className="flex flex-wrap items-center gap-1.5">
            <span className="w-24 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
              {RULE_CATEGORIES[cat]}
            </span>
            {catIds.map(renderChip)}
          </div>
        );
      })}
    </div>
  );
}
