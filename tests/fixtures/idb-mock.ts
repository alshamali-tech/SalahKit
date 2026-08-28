/**
 * IndexedDB mock for tests (Blueprint: tests/fixtures/idb-mock.ts).
 * Importing this module installs fake-indexeddb globals and exposes a
 * helper to wipe every SalahKit table between tests.
 */
import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { DB_NAME } from '../../src/lib/core/constants';
import { getDb, resetDbInstance } from '../../src/lib/db/db';

/**
 * Deletes the SalahKit database so each test starts from a clean slate.
 * Closes the live Dexie handle and resets the singleton, matching the
 * pattern used across the repository tests.
 */
export async function wipeTestDb(): Promise<void> {
  getDb().close();
  await Dexie.delete(DB_NAME);
  resetDbInstance();
}
