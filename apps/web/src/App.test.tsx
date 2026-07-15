import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/App';

describe('App', () => {
  it('renders the application shell with primary navigation', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /workflows/i })).toBeInTheDocument();
  });

  it('marks the active navigation destination as current', () => {
    window.history.pushState({}, '', '/w/acme');
    render(<App />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'page');
  });
});
