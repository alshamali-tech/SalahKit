// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuranReader } from '../../src/components/app/QuranReader';

describe('QuranReader module', () => {
  it('opens on Al-Fatihah with its seven ayahs', () => {
    render(<QuranReader />);
    expect(screen.getByText(/Al-Fatihah/)).toBeInTheDocument();
    expect(screen.getByText('7 ayahs')).toBeInTheDocument();
  });

  it('navigates to the next surah and back', () => {
    render(<QuranReader />);
    fireEvent.click(screen.getByRole('button', { name: 'Next surah →' }));
    expect(screen.getByText(/Al-Asr/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '← Previous surah' }));
    expect(screen.getByText(/“The Opening”/)).toBeInTheDocument();
  });

  it('switches translation language and direction', () => {
    render(<QuranReader />);
    fireEvent.click(screen.getByRole('button', { name: 'اردو' }));
    const rtl = document.querySelector('p[dir="rtl"]');
    expect(rtl).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Français' }));
    expect(document.querySelector('p[dir="rtl"]')).toBeNull();
  });

  it('disables previous navigation on the first surah', () => {
    render(<QuranReader />);
    const prev = screen.getByRole('button', { name: '← Previous surah' });
    expect(prev).toBeDisabled();
  });
});
