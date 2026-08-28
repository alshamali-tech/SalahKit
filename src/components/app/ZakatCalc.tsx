import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../lib/use-locale';
import { computeZakat, monthlyEquivalent } from '../../lib/core/zakat';
import { parseNumber } from '../../lib/core/validator';
import { addZakatRecord, deleteZakatRecord, listZakatRecords } from '../../lib/db/db';
import { emitToast } from '../../lib/messaging';
import { formatCurrency, formatShortDate } from '../../lib/utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { ZakatRecordRow } from '../../types';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'PKR', 'INR', 'BDT', 'TRY', 'IDR', 'NGN', 'ZAR'] as const;

interface FormState {
  goldGrams: string;
  silverGrams: string;
  cash: string;
  investments: string;
  otherAssets: string;
  debts: string;
  goldPrice: string;
  silverPrice: string;
}

const INITIAL_FORM: FormState = {
  goldGrams: '0',
  silverGrams: '0',
  cash: '0',
  investments: '0',
  otherAssets: '0',
  debts: '0',
  goldPrice: '65',
  silverPrice: '0.85',
};

/**
 * Zakat calculator: live 2.5% computation against the silver nisab,
 * with locally persisted calculation records.
 * @returns The rendered module.
 */
export function ZakatCalc(): JSX.Element {
  const { t } = useT();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [currency, setCurrency] = useState<string>('USD');
  const [records, setRecords] = useState<ZakatRecordRow[]>([]);
  const lastDeleted = useRef<ZakatRecordRow | null>(null);

  useEffect(() => {
    void listZakatRecords().then((rows) => setRecords(rows.slice(0, 6)));
  }, []);

  const result = useMemo(
    () =>
      computeZakat({
        goldGrams: parseNumber(form.goldGrams, 0),
        silverGrams: parseNumber(form.silverGrams, 0),
        cash: parseNumber(form.cash, 0),
        investments: parseNumber(form.investments, 0),
        otherAssets: parseNumber(form.otherAssets, 0),
        debts: parseNumber(form.debts, 0),
        goldPricePerGram: parseNumber(form.goldPrice, 0),
        silverPricePerGram: parseNumber(form.silverPrice, 0),
      }),
    [form]
  );

  /** Updates one numeric field. */
  function setField(key: keyof FormState, value: string): void {
    setForm((f) => ({ ...f, [key]: value }));
  }

  /** Persists the current computation as a dated record. */
  async function save(): Promise<void> {
    await addZakatRecord({
      goldG: parseNumber(form.goldGrams, 0),
      silverG: parseNumber(form.silverGrams, 0),
      cash: parseNumber(form.cash, 0),
      investments: parseNumber(form.investments, 0),
      debts: parseNumber(form.debts, 0),
      zakatDue: result.zakatDue,
    });
    const rows = await listZakatRecords();
    setRecords(rows.slice(0, 6));
    emitToast({ title: 'Zakat record saved', body: 'Stored privately on this device.', tone: 'success' });
  }

  /** Deletes a record, keeping it in memory for one-step undo. */
  async function remove(record: ZakatRecordRow): Promise<void> {
    lastDeleted.current = record;
    await deleteZakatRecord(record.id);
    setRecords((rows) => rows.filter((r) => r.id !== record.id));
    emitToast({ title: 'Record deleted', body: 'Use undo to restore it.', tone: 'info' });
  }

  /** Restores the most recently deleted record. */
  async function undoDelete(): Promise<void> {
    const record = lastDeleted.current;
    if (!record) return;
    lastDeleted.current = null;
    await addZakatRecord({
      goldG: record.goldG,
      silverG: record.silverG,
      cash: record.cash,
      investments: record.investments,
      debts: record.debts,
      zakatDue: record.zakatDue,
    });
    setRecords(await (await listZakatRecords()).slice(0, 6));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-[var(--fg)]">{t('modulesUi.zakat.wealth')}</h3>
          <Select
            label="Currency"
            id="zakat-currency"
            className="w-32"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label={t('modulesUi.zakat.gold')} id="z-gold" inputMode="decimal" suffix="g" value={form.goldGrams} onChange={(e) => setField('goldGrams', e.target.value)} />
          <Input label={t('modulesUi.zakat.silver')} id="z-silver" inputMode="decimal" suffix="g" value={form.silverGrams} onChange={(e) => setField('silverGrams', e.target.value)} />
          <Input label={t('modulesUi.zakat.goldPrice')} id="z-gold-price" inputMode="decimal" suffix={currency} value={form.goldPrice} onChange={(e) => setField('goldPrice', e.target.value)} />
          <Input label={t('modulesUi.zakat.silverPrice')} id="z-silver-price" inputMode="decimal" suffix={currency} value={form.silverPrice} onChange={(e) => setField('silverPrice', e.target.value)} />
          <Input label={t('modulesUi.zakat.cash')} id="z-cash" inputMode="decimal" suffix={currency} value={form.cash} onChange={(e) => setField('cash', e.target.value)} />
          <Input label={t('modulesUi.zakat.investments')} id="z-investments" inputMode="decimal" suffix={currency} value={form.investments} onChange={(e) => setField('investments', e.target.value)} />
          <Input label={t('modulesUi.zakat.otherAssets')} id="z-other" inputMode="decimal" suffix={currency} value={form.otherAssets} onChange={(e) => setField('otherAssets', e.target.value)} />
          <Input label={t('modulesUi.zakat.debts')} id="z-debts" inputMode="decimal" suffix={currency} value={form.debts} onChange={(e) => setField('debts', e.target.value)} />
        </div>
      </Card>

      <div className="space-y-4 min-w-0">
        <Card tone="raised">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Zakat due (2.5%)</p>
            {result.nisabMet ? <Badge tone="accent">{t('modulesUi.zakat.nisabMet')}</Badge> : <Badge tone="neutral">{t('modulesUi.zakat.belowNisab')}</Badge>}
          </div>
          <p className="mt-2 text-4xl font-extrabold tnum text-[var(--fg)]">
            {formatCurrency(result.zakatDue, currency)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            ≈ {formatCurrency(monthlyEquivalent(result.zakatDue), currency)} / month if spread out
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Total assets</dt><dd className="font-semibold tnum">{formatCurrency(result.totalAssets, currency)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Net of debts</dt><dd className="font-semibold tnum">{formatCurrency(result.netAssets, currency)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Silver nisab (612.36 g)</dt><dd className="font-semibold tnum">{formatCurrency(result.silverNisabValue, currency)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Gold nisab (87.48 g)</dt><dd className="font-semibold tnum">{formatCurrency(result.goldNisabValue, currency)}</dd></div>
          </dl>
          <Button full className="mt-4" onClick={() => void save()}>Save record</Button>
        </Card>

        {records.length > 0 ? (
          <Card>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-[var(--fg)]">Saved calculations</h3>
              <Button variant="ghost" size="sm" onClick={() => void undoDelete()} disabled={!lastDeleted.current}>
                Undo delete
              </Button>
            </div>
            <ul className="space-y-1.5">
              {records.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-[var(--field)] border border-[var(--border)] px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tnum truncate">{formatCurrency(r.zakatDue, currency)}</p>
                    <p className="text-xs text-[var(--muted)]">{formatShortDate(new Date(`${r.dateISO}T12:00:00`))}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(r)}
                    aria-label="Delete Zakat record"
                    className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] hover:text-[var(--danger)] focus-visible:outline-2 focus-visible:outline-[var(--danger)] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 6h12M8 6V4h4v2m-7 0l1 10h8l1-10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
