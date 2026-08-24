import { useEffect, useRef } from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { FAQ } from './FAQ';
import { Comparison } from './Comparison';
import { DonationFooter } from '../donation/DonationFooter';

/**
 * IntersectionObserver reveal: fades sections up as they enter view.
 * Honors prefers-reduced-motion by skipping entirely.
 * @returns Ref to attach to a section wrapper.
 */
function useReveal<T extends HTMLElement>(): React.RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.remove('opacity-0');
      return;
    }
    el.classList.add('opacity-0', 'translate-y-4');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
            el.classList.remove('opacity-0', 'translate-y-4');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * Landing page composition (S8 '/'): hero, features mosaic,
 * comparison, FAQ and the support band.
 * @returns The rendered landing page body.
 */
export function Landing(): JSX.Element {
  const featuresRef = useReveal<HTMLDivElement>();
  const compareRef = useReveal<HTMLDivElement>();
  const faqRef = useReveal<HTMLDivElement>();

  return (
    <div className="min-w-0">
      <Hero />

      <div className="mx-auto max-w-7xl px-4">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--primary)_40%,var(--border))] to-transparent"
        />
      </div>

      <div ref={featuresRef}>
        <Features />
      </div>
      <div ref={compareRef}>
        <Comparison />
      </div>
      <div ref={faqRef}>
        <FAQ />
      </div>
      <DonationFooter />
    </div>
  );
}
