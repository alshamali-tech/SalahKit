// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QuranReader } from '../../src/components/app/QuranReader';

describe('QuranReader module (full mushaf)', () => {
  it('opens on Al-Fatihah with its metadata', () => {
    render(<QuranReader />);
    expect(screen.getByText(/Al-Fatihah/)).toBeInTheDocument();
    expect(screen.getByText('7 ayahs')).toBeInTheDocument();
  });

  it('lists all 114 surahs in the picker', () => {
    render(<QuranReader />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(114);
    expect(screen.getByPlaceholderText('Search 114 surahs…')).toBeInTheDocument();
  });

  it('navigates to the next surah and back', async () => {
    render(<QuranReader />);
    fireEvent.click(screen.getByRole('button', { name: 'Next surah →' }));
    await waitFor(() => expect(screen.getByText(/Al-Baqarah/)).toBeInTheDocument());
    expect(screen.getByText('286 ayahs')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '← Previous surah' }));
    await waitFor(() => expect(screen.getByText(/“The Opening”/)).toBeInTheDocument());
  });

  it('falls back to the bundled text when the network is unavailable', async () => {
    render(<QuranReader />);
    await waitFor(() => expect(screen.getByText(/The Opening/)).toBeInTheDocument());
    // jsdom has no working fetch: the local Al-Fatihah copy must render.
    expect(screen.getAllByText(/All praise is due to Allah/).length).toBeGreaterThan(0);
  });

  it('switches translation language and direction', async () => {
    render(<QuranReader />);
    await waitFor(() => expect(screen.getAllByText(/All praise is due to Allah/).length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole('button', { name: 'اردو' }));
    expect(document.querySelector('p[dir="rtl"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Français' }));
    expect(document.querySelector('p[dir="rtl"]')).toBeNull();
  });

  it('disables previous navigation on the first surah', () => {
    render(<QuranReader />);
    expect(screen.getByRole('button', { name: '← Previous surah' })).toBeDisabled();
  });
});
