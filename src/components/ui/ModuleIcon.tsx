/**
 * Per-module icon. Most modules draw a stroked SVG path on a 20x20
 * grid; the Arabic Foundations module instead shows the letter alef
 * (ا) as a living glyph — the first letter of the Arabic alphabet.
 */
export interface ModuleIconProps {
  /** Module id; 'arabic' gets the letter treatment. */
  module: string;
  /** SVG path data for non-Arabic modules. */
  d: string;
  /** Render size in px. */
  size?: number;
}

/**
 * Renders a module icon.
 * @param props - module, path data and size.
 * @returns An inline SVG.
 */
const ARABIC_STACK =
  '"Amiri Quran", "Scheherazade New", "Amiri", "Traditional Arabic", "Geeza Pro", serif';

export function ModuleIcon({ module, d, size = 20 }: ModuleIconProps): JSX.Element {
  if (module === 'arabic') {
    // A single alef (ا): tall vertical stroke with a small foot, drawn
    // as a path so it renders identically on every platform/font.
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 2.6v13.2c0 .8-.5 1.4-1.3 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="13.4" cy="4.4" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
