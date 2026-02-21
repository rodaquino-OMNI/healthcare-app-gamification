import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestCard } from './QuestCard';
import { ThemeProvider } from '../../themes';

// Mock styled-components theme
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
            text: '#1A1A1A',
          },
          care: {
            primary: '#FF8C42',
            secondary: '#F17C3A',
            background: '#FFF8F0',
            text: '#1A1A1A',
          },
          plan: {
            primary: '#3A86FF',
            secondary: '#2D6FD9',
            background: '#F0F8FF',
            text: '#1A1A1A',
          },
        },
        brand: {
          primary: '#00c3f7',
          secondary: '#00dbbb',
        },
        neutral: {
          white: '#FFFFFF',
          gray100: '#f8fafc',
          gray200: '#f1f5f9',
          gray600: '#64748b',
          gray700: '#4b5563',
          gray900: '#1a202c',
        },
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
      },
      typography: {
        fontSize: {
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
        },
        fontWeight: {
          regular: 400,
          medium: 500,
          semiBold: 600,
          bold: 700,
        },
        fontFamily: {
          heading: 'Plus Jakarta Sans, sans-serif',
          body: 'Plus Jakarta Sans, sans-serif',
        },
        lineHeight: {
          base: 1.5,
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '16px',
        full: '9999px',
      },
    }),
  };
});

// Mock child components to isolate QuestCard rendering
jest.mock('../AchievementBadge/AchievementBadge', () => ({
  AchievementBadge: ({ achievement, size }: any) => (
    <div
      data-testid="achievement-badge"
      data-achievement-id={achievement.id}
      data-size={size}
      data-unlocked={achievement.unlocked}
    >
      {achievement.title}
    </div>
  ),
}));

jest.mock('../../components/ProgressBar/ProgressBar', () => ({
  ProgressBar: ({ current, total, journey, ariaLabel }: any) => (
    <div
      data-testid="progress-bar"
      data-current={current}
      data-total={total}
      data-journey={journey}
      aria-label={ariaLabel}
    />
  ),
}));

jest.mock('../../primitives/Icon/Icon', () => ({
  Icon: ({ name, color }: any) => (
    <span data-testid="quest-icon" data-name={name} data-color={color} aria-hidden="true" />
  ),
}));

jest.mock('src/web/design-system/src/themes/index', () => ({
  useJourneyTheme: (journey: string) => {
    const journeyColors: Record<string, { primary: string; secondary: string }> = {
      health: { primary: '#0ACF83', secondary: '#05A66A' },
      care: { primary: '#FF8C42', secondary: '#F17C3A' },
      plan: { primary: '#3A86FF', secondary: '#2D6FD9' },
    };
    return journeyColors[journey] ?? journeyColors.health;
  },
}));

// Helper to render with theme provider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

const baseQuest = {
  id: 'quest-1',
  title: 'Daily Steps Goal',
  description: 'Walk 10,000 steps today',
  icon: 'footsteps',
  progress: 5000,
  total: 10000,
  journey: 'health' as const,
};

describe('QuestCard', () => {
  it('renders quest title and description', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    expect(screen.getByText('Daily Steps Goal')).toBeInTheDocument();
    expect(screen.getByText('Walk 10,000 steps today')).toBeInTheDocument();
  });

  it('renders progress text showing current and total', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    expect(screen.getByText('5000 of 10000 completed')).toBeInTheDocument();
  });

  it('renders the progress bar with correct props', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('data-current', '5000');
    expect(progressBar).toHaveAttribute('data-total', '10000');
    expect(progressBar).toHaveAttribute('data-journey', 'health');
  });

  it('renders the quest icon', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    const icon = screen.getByTestId('quest-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-name', 'footsteps');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render achievement badge when quest is incomplete', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    expect(screen.queryByTestId('achievement-badge')).not.toBeInTheDocument();
  });

  it('renders achievement badge when quest is completed', () => {
    const completedQuest = {
      ...baseQuest,
      progress: 10000,
      total: 10000,
    };

    renderWithTheme(<QuestCard quest={completedQuest} />);

    const badge = screen.getByTestId('achievement-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-achievement-id', 'quest-1');
    expect(badge).toHaveAttribute('data-unlocked', 'true');
    expect(badge).toHaveAttribute('data-size', 'sm');
  });

  it('calls onPress callback when the card is pressed', () => {
    const onPressMock = jest.fn();
    renderWithTheme(<QuestCard quest={baseQuest} onPress={onPressMock} />);

    // The Card wraps the content; fire click on the container
    const card = screen.getByRole('region') ?? screen.getByLabelText(/Daily Steps Goal quest/i);
    fireEvent.click(card);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies health journey theming', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    const icon = screen.getByTestId('quest-icon');
    // Health journey primary color
    expect(icon).toHaveAttribute('data-color', '#0ACF83');
  });

  it('applies care journey theming', () => {
    const careQuest = { ...baseQuest, journey: 'care' as const };
    renderWithTheme(<QuestCard quest={careQuest} />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-journey', 'care');

    const icon = screen.getByTestId('quest-icon');
    expect(icon).toHaveAttribute('data-color', '#FF8C42');
  });

  it('applies plan journey theming', () => {
    const planQuest = { ...baseQuest, journey: 'plan' as const };
    renderWithTheme(<QuestCard quest={planQuest} />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-journey', 'plan');

    const icon = screen.getByTestId('quest-icon');
    expect(icon).toHaveAttribute('data-color', '#3A86FF');
  });

  it('has correct accessibility label', () => {
    renderWithTheme(<QuestCard quest={baseQuest} />);

    const label = screen.getByLabelText(
      'Daily Steps Goal quest. Walk 10,000 steps today. Progress: 5000 of 10000.'
    );
    expect(label).toBeInTheDocument();
  });

  it('renders correctly when progress exceeds total', () => {
    const overcompletedQuest = {
      ...baseQuest,
      progress: 12000,
      total: 10000,
    };

    renderWithTheme(<QuestCard quest={overcompletedQuest} />);

    // Progress bar is capped at 100%
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-current', '12000');

    // Achievement badge should appear (progress >= total)
    expect(screen.getByTestId('achievement-badge')).toBeInTheDocument();
  });
});
