import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { LevelIndicator } from './LevelIndicator';

// Mock styled-components
jest.mock('styled-components', () => {
  const originalModule = jest.requireActual('styled-components');
  
  return {
    ...originalModule,
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => ({
      colors: {
        journeys: {
          health: { 
            primary: '#0ACF83', 
            secondary: '#05A66A',
            background: '#F0FFF4',
            text: '#1A1A1A'
          },
          care: { 
            primary: '#FF8C42', 
            secondary: '#F17C3A',
            background: '#FFF8F0',
            text: '#1A1A1A'
          },
          plan: { 
            primary: '#3A86FF', 
            secondary: '#2D6FD9',
            background: '#F0F8FF',
            text: '#1A1A1A'
          }
        },
        neutral: { 
          gray700: '#616161',
          white: '#FFFFFF'
        }
      },
      spacing: { 
        xs: '4px', 
        sm: '8px', 
        md: '16px', 
        lg: '24px'
      },
      typography: {
        fontSize: { 
          sm: '14px', 
          lg: '18px', 
          xl: '20px'
        },
        fontWeight: { 
          bold: 700
        },
        lineHeight: {
          base: 1.5
        }
      },
      borderRadius: {
        md: '8px'
      }
    })
  };
});

// Mock child components
jest.mock('../XPCounter/XPCounter', () => ({
  XPCounter: ({ currentXP, nextLevelXP, journey }: any) => (
    <div data-testid="xp-counter" data-current-xp={currentXP} data-next-level-xp={nextLevelXP} data-journey={journey}>
      XP Counter
    </div>
  )
}));

jest.mock('../AchievementBadge/AchievementBadge', () => ({
  AchievementBadge: ({ achievement, size }: any) => (
    <div data-testid="achievement-badge" data-achievement-id={achievement.id} data-size={size}>
      {achievement.title}
    </div>
  )
}));

describe('LevelIndicator', () => {
  it('renders the LevelIndicator component with correct level and XP', () => {
    render(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="health" 
      />
    );
    
    // Check level display
    expect(screen.getByText(/Nível 5/i)).toBeInTheDocument();
    expect(screen.getByText(/- Aventureiro/i)).toBeInTheDocument();
    
    // Check XP Counter is rendered with correct props
    const xpCounter = screen.getByTestId('xp-counter');
    expect(xpCounter).toBeInTheDocument();
    expect(xpCounter).toHaveAttribute('data-current-xp', '500');
    expect(xpCounter).toHaveAttribute('data-next-level-xp', '1000');
    expect(xpCounter).toHaveAttribute('data-journey', 'health');
  });

  it('applies journey-specific styling to the LevelIndicator component', () => {
    // Health journey
    const { rerender } = render(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="health" 
      />
    );
    
    let xpCounter = screen.getByTestId('xp-counter');
    expect(xpCounter).toHaveAttribute('data-journey', 'health');
    
    // Care journey
    rerender(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="care" 
      />
    );
    
    xpCounter = screen.getByTestId('xp-counter');
    expect(xpCounter).toHaveAttribute('data-journey', 'care');
    
    // Plan journey
    rerender(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="plan" 
      />
    );
    
    xpCounter = screen.getByTestId('xp-counter');
    expect(xpCounter).toHaveAttribute('data-journey', 'plan');
  });

  it('renders with a recent achievement when provided', () => {
    const recentAchievement = {
      id: 'test-achievement',
      title: 'Test Achievement',
      description: 'This is a test achievement',
      icon: 'trophy',
      progress: 1,
      total: 1,
      unlocked: true,
      journey: 'health'
    };
    
    render(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="health" 
        recentAchievement={recentAchievement} 
      />
    );
    
    // Check achievement badge is rendered
    const achievementBadge = screen.getByTestId('achievement-badge');
    expect(achievementBadge).toBeInTheDocument();
    expect(achievementBadge).toHaveAttribute('data-achievement-id', 'test-achievement');
    
    // Check achievement text is displayed
    expect(screen.getByText(/Nova conquista:/i)).toBeInTheDocument();
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
  });

  it('does not render achievement section when no recent achievement is provided', () => {
    render(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="health" 
      />
    );
    
    // Check achievement badge is not rendered
    expect(screen.queryByTestId('achievement-badge')).not.toBeInTheDocument();
    expect(screen.queryByText(/Nova conquista:/i)).not.toBeInTheDocument();
  });

  it('provides appropriate accessibility attributes', () => {
    render(
      <LevelIndicator 
        level={5} 
        currentXp={500} 
        nextLevelXp={1000} 
        journey="health" 
      />
    );
    
    const container = screen.getByLabelText(/Nível 5 - Aventureiro. 500 XP atual. 500 XP para o próximo nível./i);
    expect(container).toBeInTheDocument();
  });
});