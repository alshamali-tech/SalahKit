/**
 * Full data wipe (S3: db/clear.ts).
 * Deletes the IndexedDB database and clears browser storage.
 */
import { getDb, resetDbInstance } from './db';
import { DB_NAME } from '../core/constants';

/**
 * Wipes all SalahKit data: IndexedDB database, localStorage, sessionStorage.
 * Safe to call repeatedly; resolves once deletion is confirmed.
 * @returns Resolves when the wipe completes.
 */
export async function clearAllData(): Promise<void> {
  const db = getDb();
  try {
    db.close();
  } catch {
    // Already closed - nothing to do.
  }
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('SalahKit: failed to delete database.'));
    request.onblocked = () => resolve();
  });
  resetDbInstance();
  if (typeof localStorage !== 'undefined') localStorage.clear();
  if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
}
