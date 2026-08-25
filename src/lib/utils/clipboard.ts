/**
 * Clipboard helper (clipboard.ts). navigator.clipboard only exists in
 * secure contexts; the legacy execCommand path keeps copy working in
 * plain-HTTP previews and embedded iframes.
 */

/**
 * Copies text using the modern API when available, falling back to a
 * hidden textarea + execCommand for older or non-secure contexts.
 * @param text - Text to place on the clipboard.
 * @returns True when the copy succeeded.
 */
export async function copyText(text: string): Promise<boolean> {
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard?.writeText === 'function' &&
    typeof window !== 'undefined' &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or transient failure — try the legacy path.
    }
  }
  return legacyCopy(text);
}

/**
 * Legacy copy via a temporary, invisible, focused textarea.
 * @param text - Text to copy.
 * @returns True when execCommand reported success.
 */
function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.left = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
