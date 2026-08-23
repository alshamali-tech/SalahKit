/**
 * Global app state (S2: Zustand client store).
 * Settings persist to IndexedDB (optimistic); theme lives in
 * localStorage only (S6). No server state anywhere.
 */
import { create } from 'zustand';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from './lib/db/db';
import { applyThemeToDocument, getStoredTheme, setStoredTheme } from './lib/utils/storage';
import type { ModuleId, SettingsRow, ThemeMode } from './types';

export interface AppState {
  /** Active tool module. */
  module: ModuleId;
  /** Persisted user settings (defaults until boot completes). */
  settings: SettingsRow;
  /** Active UI theme. */
  theme: ThemeMode;
  /** Live connectivity flag. */
  online: boolean;
  /** Mobile sidebar drawer state. */
  sidebarOpen: boolean;
  /** Settings dialog visibility. */
  settingsOpen: boolean;
  /** True once settings/theme finished loading. */
  booted: boolean;
  setModule: (module: ModuleId) => void;
  boot: () => Promise<void>;
  updateSettings: (patch: Partial<SettingsRow>) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setOnline: (online: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

/**
 * Root Zustand store.
 */
export const useApp = create<AppState>((set, get) => ({
  module: 'prayer',
  settings: { ...DEFAULT_SETTINGS },
  theme: 'light',
  online: true,
  sidebarOpen: false,
  settingsOpen: false,
  booted: false,

  setModule: (module) => set({ module, sidebarOpen: false }),

  boot: async () => {
    if (get().booted) return;
    let settings: SettingsRow = { ...DEFAULT_SETTINGS };
    try {
      settings = await getSettings();
    } catch {
      // IndexedDB unavailable (private mode): run on defaults in memory.
    }
    const stored = getStoredTheme();
    const prefersDark =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
    const theme: ThemeMode = stored ?? (prefersDark ? 'dark' : settings.theme);
    applyThemeToDocument(theme);
    set({ settings, theme, booted: true });
  },

  updateSettings: async (patch) => {
    set({ settings: { ...get().settings, ...patch } });
    try {
      const next = await saveSettings(patch);
      set({ settings: next });
    } catch {
      // Optimistic state already applied; persistence retried next change.
    }
  },

  setTheme: (theme) => {
    setStoredTheme(theme);
    applyThemeToDocument(theme);
    set({ theme });
  },

  setOnline: (online) => set({ online }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}));
