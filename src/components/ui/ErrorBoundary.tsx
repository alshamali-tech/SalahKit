import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Application tree to protect. */
  children: ReactNode;
}

interface ErrorBoundaryState {
  /** Captured render error, when any. */
  error: Error | null;
}

/**
 * Top-level error boundary: a render crash shows a diagnostic card
 * instead of a blank page, with a one-tap recovery reload.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { error: null };

  /**
   * Captures errors from the subtree.
   * @param error - The thrown error.
   * @returns Updated state.
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  /**
   * Lifecycle hook (kept side-effect free; no reporting by design —
   * SalahKit sends nothing anywhere).
   * @param error - The thrown error.
   * @param info - React component stack info.
   */
  public componentDidCatch(error: Error, info: ErrorInfo): void {
    void error;
    void info;
  }

  /** Clears the error so the app can re-mount. */
  private reset = (): void => {
    this.setState({ error: null });
  };

  /**
   * Renders children, or the diagnostic fallback on failure.
   * @returns The protected tree or the error card.
   */
  public render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
        <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--danger)]">
            SalahKit hit a snag
          </p>
          <h1 className="mt-2 text-xl font-extrabold text-[var(--fg)]">
            Something broke while rendering.
          </h1>
          <p className="mt-2 break-words rounded-lg bg-[var(--field)] border border-[var(--border)] p-3 font-mono text-xs leading-relaxed text-[var(--muted)]">
            {this.state.error.message || 'Unknown error'}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Your data is safe in this browser. A reload almost always fixes it.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-bold text-[var(--primary-fg)] hover:brightness-110 active:scale-[0.97] transition-all"
            >
              Reload app
            </button>
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex h-11 items-center rounded-lg border border-[var(--border)] bg-[var(--field)] px-4 text-sm font-bold text-[var(--fg)] hover:border-[var(--primary)] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
