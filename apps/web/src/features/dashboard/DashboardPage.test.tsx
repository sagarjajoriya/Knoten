import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DashboardPage } from './DashboardPage';

function renderDashboard(): void {
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe('DashboardPage', () => {
  it('renders the stat tiles with their values', () => {
    renderDashboard();

    expect(screen.getByText('Success rate')).toBeInTheDocument();
    expect(screen.getByText('99.2%')).toBeInTheDocument();
    expect(screen.getByText('Failing now')).toBeInTheDocument();
  });

  it('renders the trend chart with an accessible description', () => {
    renderDashboard();

    expect(
      screen.getByRole('img', { name: /daily runs over the last 14 days/i }),
    ).toBeInTheDocument();
  });

  it('renders the attention and recent-runs lists', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /needs attention/i })).toBeInTheDocument();
    expect(screen.getByText(/12 consecutive failures/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /recent runs/i })).toBeInTheDocument();
    expect(screen.getByText('Support ticket triage')).toBeInTheDocument();
  });
});
