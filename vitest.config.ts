/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

/**
 * Vitest unit + integration setup (S3, S12).
 * Core layer tests run in a node environment (pure TS); component
 * integration tests opt into jsdom via per-file environment comments.
 * Coverage targets: core 95%, db 95%, validator 95%, components 80%.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/core/**', 'src/lib/db/**', 'src/lib/utils/**'],
      thresholds: {
        'src/lib/core/**': { lines: 95, functions: 95, branches: 90, statements: 95 },
        'src/lib/db/**': { lines: 95, functions: 95, branches: 90, statements: 95 },
      },
    },
  },
});
