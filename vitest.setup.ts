/**
 * Vitest global setup (Blueprint S3).
 * Polyfills IndexedDB in the Node test environment and wires Testing
 * Library matchers so unit + integration tests share one foundation.
 */
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
