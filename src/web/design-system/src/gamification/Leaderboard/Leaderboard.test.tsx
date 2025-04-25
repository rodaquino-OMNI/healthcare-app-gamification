import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Leaderboard } from './Leaderboard';
import { Card } from '../../components/Card/Card';
import { colors } from '../../tokens';

describe('Leaderboard', () => {
  it('renders correctly with data', () => {
    const leaderboardData = [
      {
        userId: 'user1',
        username: 'JohnDoe',
        score: 1200,
        rank: 1,
        isCurrentUser: true
      },
      {
        userId: 'user2',
        username: 'JaneSmith',
        score: 1000,
        rank: 2,
        isCurrentUser: false
      },
      {
        userId: 'user3',
        username: 'BobJohnson',
        score: 800,
        rank: 3,
        isCurrentUser: false
      }
    ];

    render(<Leaderboard leaderboardData={leaderboardData} journey="health" />);

    // Verify the leaderboard header is present
    expect(screen.getByText('Classificação')).toBeInTheDocument();

    // Verify all users are displayed
    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('JaneSmith')).toBeInTheDocument();
    expect(screen.getByText('BobJohnson')).toBeInTheDocument();

    // Verify scores are displayed correctly
    expect(screen.getByText('1200 XP')).toBeInTheDocument();
    expect(screen.getByText('1000 XP')).toBeInTheDocument();
    expect(screen.getByText('800 XP')).toBeInTheDocument();

    // Verify ranks are displayed correctly
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Verify list items and accessibility
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveAttribute('aria-label', 'Rank 1, JohnDoe, Score 1200');
  });

  it('renders correctly with empty data', () => {
    render(<Leaderboard leaderboardData={[]} journey="health" />);
    
    // Header should still be present
    expect(screen.getByText('Classificação')).toBeInTheDocument();
    
    // No list items should be rendered
    const list = screen.getByRole('list', { name: 'Leaderboard rankings' });
    expect(list.children.length).toBe(0);
  });

  it('applies journey-specific styling', () => {
    const leaderboardData = [
      {
        userId: 'user1',
        username: 'JohnDoe',
        score: 1200,
        rank: 1,
        isCurrentUser: true
      }
    ];

    // We need to mock the Card component to test journey prop passing
    jest.mock('../../components/Card/Card', () => {
      return {
        Card: jest.fn(({ children, journey }) => (
          <div data-testid="mock-card" data-journey={journey}>{children}</div>
        ))
      };
    });

    // Test with health journey styling
    render(<Leaderboard leaderboardData={leaderboardData} journey="health" />);
    
    // Check that the current user item has the correct background color
    const currentUserItem = screen.getByText('JohnDoe').closest('li');
    expect(currentUserItem).toHaveStyle(`background-color: ${colors.journeys.health.background}`);
    
    // Test with care journey styling
    const { rerender } = render(
      <Leaderboard leaderboardData={leaderboardData} journey="health" />
    );
    
    rerender(<Leaderboard leaderboardData={leaderboardData} journey="care" />);
    expect(screen.getByText('JohnDoe').closest('li')).toHaveStyle(
      `background-color: ${colors.journeys.care.background}`
    );
    
    // Test with plan journey styling
    rerender(<Leaderboard leaderboardData={leaderboardData} journey="plan" />);
    expect(screen.getByText('JohnDoe').closest('li')).toHaveStyle(
      `background-color: ${colors.journeys.plan.background}`
    );
  });
});