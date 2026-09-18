/**
 * Global app state (S2: Zustand client store).
 * Settings persist to IndexedDB (optimistic); theme lives in
 * localStorage only (S6). Route state mirrors location.pathname (S8).
 */
import { create } from 'zustand';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from './lib/db/db';
import { applyThemeToDocument, getStoredTheme, setStoredTheme } from './lib/utils/storage';
import { navigate, parsePath, routeToPath } from './lib/router';
import type { ModuleId, SettingsRow, ThemeMode } from './types';

export interface AppState {
  /** 'landing' (route /) or 'tools' (routes /tools/*, /privacy, /terms). */
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
  syncFromRoute: () => void;
  setModule: (module: ModuleId) => void;
  boot: () => Promise<void>;
  updateSettings: (patch: Partial<SettingsRow>) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setOnline: (online: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

/** Reads the initial route from the current pathname (SSR-safe). */
function initialRoute(): { view: 'landing' | 'tools'; module: ModuleId } {
  if (typeof window === 'undefined') return { view: 'landing', module: 'prayer' };
  const route = parsePath(window.location.pathname);
  if (route.view === 'landing') return { view: 'landing', module: 'prayer' };
  return { view: 'tools', module: route.module };
}

/**
 * Root Zustand store.
 */
export const useApp = create<AppState>((set, get) => ({
  ...initialRoute(),
  settings: { ...DEFAULT_SETTINGS },
  theme: 'light',
  online: true,
  sidebarOpen: false,
  settingsOpen: false,
  booted: false,

  syncFromRoute: () => {
    const route = parsePath(window.location.pathname);
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