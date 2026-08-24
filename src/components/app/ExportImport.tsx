import { useRef } from 'react';
import { exportBackup, importBackup } from '../../lib/db/backup';
import { emitError, emitSuccess } from '../../lib/messaging';
import { Button } from '../ui/Button';

/**
 * Backup export/import control (S9): downloads the full JSON backup
 * and restores validated backups via a file picker.
 * @returns The rendered export/import buttons.
 */
export function ExportImport(): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);

  /** Serializes all tables and triggers a browser download. */
  async function handleExport(): Promise<void> {
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salahkit-backup-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      emitSuccess('Backup downloaded', 'Keep the JSON file somewhere safe.');
    } catch {
      emitError('Export failed', 'Your browser blocked the download.');
    }
  }

  /** Reads the picked file and merges it after validation. */
  async function handleImportFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      const { merged } = await importBackup(text);
      emitSuccess('Backup restored', `${merged} rows merged into your local data.`);
    } catch (err) {
      emitError('Import failed', err instanceof Error ? err.message : 'Invalid backup file.');
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => void handleExport()}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 3v9m0 0l-3.2-3.2M10 12l3.2-3.2M4 15.5h12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Export JSON
      </Button>
      <Button variant="outline" onClick={() => fileRef.current?.click()}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 12V3m0 0L6.8 6.2M10 3l3.2 3.2M4 15.5h12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Import backup
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-label="Import backup file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImportFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
