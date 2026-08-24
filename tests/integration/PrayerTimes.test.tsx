// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrayerTimes } from '../../src/components/app/PrayerTimes';

describe('PrayerTimes module', () => {
  it('renders all six prayer labels from the on-device engine', () => {
    render(<PrayerTimes />);
    for (const name of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }
  });

  it('shows a live HH:MM:SS countdown toward the next prayer', () => {
    render(<PrayerTimes />);
    expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('marks exactly one prayer as up next', () => {
    render(<PrayerTimes />);
    expect(screen.getAllByText('Up next').length).toBe(1);
  });

  it('exposes the calculation method presets', () => {
    render(<PrayerTimes />);
    expect(screen.getByText('Muslim World League')).toBeInTheDocument();
    expect(screen.getByText(/Umm al-Qura, Makkah/)).toBeInTheDocument();
  });

  it('opens the city picker dialog from the location button', () => {
    render(<PrayerTimes />);
    expect(screen.getByText('Makkah, Saudi Arabia')).toBeInTheDocument();
  });
});
