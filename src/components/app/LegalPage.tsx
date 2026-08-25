import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalContent {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const PRIVACY: LegalContent = {
  title: 'Privacy Policy',
  updated: 'January 2026',
  intro:
    'The short version: SalahKit collects nothing. No account, no cookies, no analytics, no advertising identifiers, no third-party trackers. Your data never leaves your device unless you export it yourself.',
  sections: [
    {
      heading: '1. Data we collect: none',
      body: [
        'SalahKit has no server-side component. There is no user database, no telemetry pipeline and no crash reporting service. We literally cannot see you, your location, your prayer log or anything else.',
      ],
    },
    {
      heading: '2. Where your data lives',
      body: [
        'Settings, prayer logs, tasbih counts and Zakat records are stored in your browser’s IndexedDB (the salahkit-db database). Theme and feature-flag preferences live in localStorage.',
        'You control it completely: export a JSON backup, import it elsewhere, or clear everything from Settings at any time.',
      ],
    },
    {
      heading: '3. Cookies & tracking',
      body: [
        'We set no cookies and use no tracking pixels, fingerprinting or analytics of any kind. Donations are handled entirely by external providers (Ko-fi, Buy Me a Coffee, PayPal) on their own sites; we never see payment details.',
      ],
    },
    {
      heading: '4. Optional external data',
      body: [
        'When you are online, SalahKit may call free, keyless public APIs: AlAdhan (aladhan.com) to refine Hijri dates, AlQuran Cloud (alquran.cloud) to stream Quran text you open, and NOAA Geomag (ngdc.noaa.gov) for local magnetic declination in the smart Qibla compass. Requests contain only the date or coordinates you selected — never any personal identifier. Responses are cached locally (Quran text permanently) and every feature degrades gracefully to the built-in offline equivalents.',
      ],
    },
    {
      heading: '5. Subprocessors',
      body: [
        'The only third parties involved are the static hosting provider (e.g. Vercel or Cloudflare Pages) that serves the app files, and your browser. Hosting providers see standard anonymous server logs (IP, user agent) as part of serving any website.',
      ],
    },
    {
      heading: '6. Children',
      body: ['The app collects no data from anyone, children included.'],
    },
    {
      heading: '7. Changes',
      body: [
        'If this policy ever changes, the new version will be posted here with an updated date. Since we hold no contact data, we cannot notify you personally — checking this page is the only notice mechanism.',
      ],
    },
  ],
};

const TERMS: LegalContent = {
  title: 'Terms of Service',
  updated: 'January 2026',
  intro:
    'SalahKit is a free, open toolkit for everyday Islamic practice. These terms keep things clear and fair. By using the app you agree to them.',
  sections: [
    {
      heading: '1. Free, as-is, no warranty',
      body: [
        'The app is provided at zero cost, "as is" and "as available", without warranties of any kind. Prayer times are computed with published astronomical methods and the Hijri calendar with the civil tabular algorithm; always verify critical timings (fasting start, prayer in congregation) with your local mosque or authority.',
      ],
    },
    {
      heading: '2. No account required',
      body: [
        'There is no sign-up, no licence key and no age gate. All functionality is available immediately and works offline.',
      ],
    },
    {
      heading: '3. Donations',
      body: [
        'Donations are entirely voluntary, processed by external providers, non-refundable and confer no obligation or premium entitlement. SalahKit has no paywall and never will lock existing features.',
        'A future optional supporter tier may be added via LemonSqueezy; it will only ever add extras, never restrict current tools.',
      ],
    },
    {
      heading: '4. Content & attribution',
      body: [
        'Quran text is public domain; translations are condensed public-domain meanings. Prayer calculations use open mathematical methods. Optional calendar data is attributed to the free AlAdhan API and used under its terms.',
        'SalahKit is an independent product. References to other products appear only as factual comparisons in marketing metadata, never as endorsement or affiliation.',
      ],
    },
    {
      heading: '5. Acceptable use',
      body: [
        'Do not attempt to disrupt the service, scrape it at scale, or misrepresent it as your own product. Linking and sharing are encouraged.',
      ],
    },
    {
      heading: '6. Liability & governing law',
      body: [
        'To the maximum extent permitted by law, our liability is limited to the amount you paid for the service: zero. These terms are governed by the laws of your jurisdiction of residence.',
      ],
    },
  ],
};

export interface LegalPageProps {
  /** Which document to render. */
  kind: 'privacy' | 'terms';
}

/**
 * Static legal pages (S14): privacy policy and terms of service.
 * @param props - kind: 'privacy' | 'terms'.
 * @returns The rendered legal document.
 */
export function LegalPage({ kind }: LegalPageProps): JSX.Element {
  const doc = kind === 'privacy' ? PRIVACY : TERMS;
  return (
    <div className="max-w-3xl space-y-4">
      <Card tone="raised">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-extrabold text-[var(--fg)]">{doc.title}</h2>
          <Badge tone="neutral">Updated {doc.updated}</Badge>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{doc.intro}</p>
      </Card>
      {doc.sections.map((section) => (
        <Card key={section.heading} hover>
          <h3 className="text-sm font-bold text-[var(--primary)]">{section.heading}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-2 text-sm leading-relaxed text-[var(--fg)] opacity-90">
              {paragraph}
            </p>
          ))}
        </Card>
      ))}
    </div>
  );
}
