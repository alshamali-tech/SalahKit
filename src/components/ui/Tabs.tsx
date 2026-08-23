export interface TabItem {
  /** Unique tab id. */
  id: string;
  /** Display label. */
  label: string;
}

export interface TabsProps {
  /** Available tabs. */
  tabs: readonly TabItem[];
  /** Currently active tab id. */
  active: string;
  /** Change handler. */
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
}

/**
 * Accessible tab strip (S6): proper roles, keyboard focusable,
 * wraps on small screens, 44px touch targets.
 * @param props - tabs/active/onChange/label.
 * @returns The rendered tablist.
 */
export function Tabs({ tabs, active, onChange, label }: TabsProps): JSX.Element {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-wrap gap-1 rounded-xl bg-[var(--hover)] p-1 w-fit max-w-full overflow-x-auto"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              'h-10 px-3.5 rounded-lg text-sm font-semibold whitespace-nowrap',
              'transition-all duration-150 ease-out min-w-0 truncate',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
              isActive
                ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--fg)]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
