/**
 * Per-module icon. Most modules draw a stroked SVG path on a 20x20
 * grid; the Arabic Foundations module instead shows the first two
 * letters of the alphabet (alef, ba) as living glyphs.
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
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <text x="2" y="9.5" fontSize="9" fontWeight="700" fill="currentColor" style={{ fontFamily: ARABIC_STACK }}>أ</text>
        <text x="10" y="17.5" fontSize="9" fontWeight="700" fill="currentColor" style={{ fontFamily: ARABIC_STACK }}>ب</text>
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
