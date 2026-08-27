// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Modal } from '../../src/components/ui/Modal';

/**
 * Host that recreates its onClose on every render — the exact pattern
 * that used to re-steal focus from the search input on each keystroke.
 */
function Host(): JSX.Element {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Choose your city">
      <label htmlFor="city-search">Search</label>
      <input
        id="city-search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p>{query}</p>
    </Modal>
  );
}

describe('Modal focus management', () => {
  it('focuses the autofocus input on open, not the close button', () => {
    render(<Host />);
    const input = screen.getByLabelText('Search');
    expect(input).toHaveFocus();
  });

  it('keeps the input focused while typing through parent re-renders', () => {
    render(<Host />);
    const input = screen.getByLabelText<HTMLInputElement>('Search');
    fireEvent.change(input, { target: { value: 'Istanbul' } });
    // The parent re-rendered with a brand-new onClose identity; focus
    // must stay in the field for the next keystroke.
    expect(input).toHaveFocus();
    expect(screen.getByText('Istanbul')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Istanbul is gr' } });
    expect(input).toHaveFocus();
  });

  it('still closes on Escape and on backdrop click', () => {
    render(<Host />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    render(<Host />);
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('restores focus to the opener when closed', () => {
    const onClosed = vi.fn();
    function OpenerHost(): JSX.Element {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            Open picker
          </button>
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
              onClosed();
            }}
            title="Test"
          >
            <p>Body</p>
          </Modal>
        </div>
      );
    }
    render(<OpenerHost />);
    const opener = screen.getByRole('button', { name: 'Open picker' });
    fireEvent.click(opener);
    // No autofocus inside → close button receives focus.
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClosed).toHaveBeenCalled();
    expect(opener).toHaveFocus();
  });
});
