/**
 * In-app messaging bus (S3: lib/messaging.ts).
 * A tiny typed pub/sub used by the UI for toasts and banners.
 * Pure TypeScript - no framework imports.
 */
import { uuid } from './utils/uuid';

/** Visual tone of a toast message. */
export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

/** A toast message as rendered by the UI host. */
export interface ToastMessage {
  /** Unique id for dismissal. */
  id: string;
  /** Short headline. */
  title: string;
  /** Optional supporting line. */
  body?: string;
  /** Semantic tone. */
  tone: ToastTone;
  /** Auto-dismiss delay in ms. */
  durationMs: number;
}

/** Payload accepted by emitToast (id/duration filled with defaults). */
export type ToastInput = Omit<ToastMessage, 'id' | 'durationMs'> & {
  durationMs?: number;
};

type ToastListener = (toast: ToastMessage) => void;

const listeners = new Set<ToastListener>();

/** Default auto-dismiss delay. */
export const DEFAULT_TOAST_DURATION_MS = 5000;

/**
 * Subscribes to toast emissions.
 * @param listener - Called with each emitted toast.
 * @returns Unsubscribe function.
 */
export function onToast(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Emits a toast to all subscribers.
 * @param input - Toast content; id and duration default when omitted.
 * @returns The fully-formed toast message.
 */
export function emitToast(input: ToastInput): ToastMessage {
  const toast: ToastMessage = {
    id: uuid(),
    title: input.title,
    body: input.body,
    tone: input.tone,
    durationMs: input.durationMs ?? DEFAULT_TOAST_DURATION_MS,
  };
  listeners.forEach((listener) => listener(toast));
  return toast;
}

/**
 * Convenience success toast.
 * @param title - Headline.
 * @param body - Optional detail line.
 * @returns The emitted toast.
 */
export function emitSuccess(title: string, body?: string): ToastMessage {
  return emitToast({ title, body, tone: 'success' });
}

/**
 * Convenience error toast.
 * @param title - Headline.
 * @param body - Optional detail line.
 * @returns The emitted toast.
 */
export function emitError(title: string, body?: string): ToastMessage {
  return emitToast({ title, body, tone: 'danger', durationMs: 7000 });
}
