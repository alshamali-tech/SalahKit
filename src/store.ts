/**
 * Global app state (S2: Zustand client store).
 * Settings persist to IndexedDB (optimistic); theme lives in
 * localStorage only (S6). Route state mirrors location.hash (S8).
 */
import { create } from 'zustand';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from './lib/db/db';
import { applyThemeToDocument, getStoredTheme, setStoredTheme } from './lib/utils/storage';
import { navigate, parseHash, routeToPath } from './lib/router';
import type { ModuleId, SettingsRow, ThemeMode } from './types';

export interface AppState {
  /** 'landing' (route /) or 'tools' (routes /tools, /privacy, /terms). */
  view: 'landing' | 'tools';
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
  syncFromHash: () => void;
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
  view: typeof window !== 'undefined' ? parseHash(window.location.hash).view : 'landing',
  module:
    typeof window !== 'undefined'
      ? (parseHash(window.location.hash) as { module?: ModuleId }).module ?? 'prayer'
      : 'prayer',
  settings: { ...DEFAULT_SETTINGS },
  theme: 'light',
  online: true,
  sidebarOpen: false,
  settingsOpen: false,
  booted: false,

  syncFromHash: () => {
    const route = parseHash(window.location.hash);
    if (route.view === 'landing') {
      set({ view: 'landing' });
      return;
    }
    set({ view: 'tools', module: route.module, sidebarOpen: false });
  },

  setModule: (module) => {
    const current = get();
    if (current.view === 'tools' && current.module === module) return;
    set({ module, view: 'tools', sidebarOpen: false });
    navigate(routeToPath({ view: 'tools', module }));
  },

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
