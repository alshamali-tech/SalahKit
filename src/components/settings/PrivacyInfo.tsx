import { navigate } from '../../lib/router';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const FACTS: readonly string[] = [
  'No account, no cookies, no analytics — there is nothing to collect.',
  'All data lives in your browser’s IndexedDB; only the theme preference uses localStorage.',
  'The only optional network call is the keyless, free AlAdhan API for Hijri refinement.',
  'Export, import or wipe everything below, anytime, with one tap.',
];

/**
 * Settings privacy summary card (S9), linking to the full policy.
 * @returns The rendered card.
 */
export function PrivacyInfo(): JSX.Element {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-extrabold text-[var(--fg)]">Your privacy, in one breath</h3>
        <div className="flex gap-1.5">
          <Badge tone="success">Zero data collected</Badge>
          <Badge tone="primary">Offline-first</Badge>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {FACTS.map((fact) => (
          <li key={fact.slice(0, 32)} className="flex items-start gap-2 text-sm text-[var(--muted)] leading-relaxed">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="var(--success)" strokeWidth="2.2" className="mt-0.5 shrink-0" aria-hidden="true">
              <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {fact}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/privacy')}>
          Read the full Privacy Policy
        </Button>
      </div>
    </Card>
  );
}
