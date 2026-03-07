import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/hooks/useGamification', () => ({
    useGameProfile: () => ({
        data: {
            gameProfile: {
                level: 5,
                xp: 2500,
                achievements: [
                    {
                        id: 'a1',
                        title: 'First Steps',
                        journey: 'health',
                        description: 'Complete your profile',
                        icon: 'star',
                        completed: true,
                        progress: 1,
                        total: 1,
                    },
                    {
                        id: 'a2',
                        title: 'Care Champion',
                        journey: 'care',
                        description: 'Schedule 3 appointments',
                        icon: 'calendar',
                        completed: false,
                        progress: 2,
                        total: 3,
                    },
                ],
                quests: [
                    { id: 'q1', completed: false },
                    { id: 'q2', completed: true },
                ],
            },
        },
        loading: false,
        error: null,
    }),
}));

jest.mock('design-system/components/Card/Card', () => ({
    Card: ({ children, ...props }: any) => (
        <div data-testid="card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('design-system/gamification/AchievementBadge', () => ({
    AchievementBadge: ({ achievement, size, showProgress }: any) => (
        <div data-testid="achievement-badge" data-id={achievement.id} data-size={size}>
            {achievement.title}
        </div>
    ),
}));

jest.mock('design-system/gamification/LevelIndicator', () => ({
    LevelIndicator: ({ level, currentXp, nextLevelXp }: any) => (
        <div data-testid="level-indicator" data-level={level} />
    ),
}));

jest.mock('design-system/gamification/XPCounter', () => ({
    XPCounter: ({ value, size }: any) => (
        <div data-testid="xp-counter" data-value={value} data-size={size}>
            {value} XP
        </div>
    ),
}));

jest.mock('design-system/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('design-system/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        gray: { 50: '#888' },
        semantic: { error: '#ef4444' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' },
}));

import AchievementsPage from '../../../pages/achievements/index';

describe('Achievements Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<AchievementsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the achievements heading', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/achievements/i)).toBeTruthy();
    });

    it('renders level indicator', () => {
        render(<AchievementsPage />);
        expect(screen.getByTestId('level-indicator')).toBeTruthy();
    });

    it('renders XP counter', () => {
        render(<AchievementsPage />);
        expect(screen.getByTestId('xp-counter')).toBeTruthy();
    });

    it('renders level text', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/level 5/i)).toBeTruthy();
    });

    it('renders quick links for leaderboard', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/leaderboard/i)).toBeTruthy();
    });

    it('renders quick links for quests', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/quests/i)).toBeTruthy();
    });

    it('renders quick links for rewards', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/rewards/i)).toBeTruthy();
    });

    it('renders achievement badges', () => {
        render(<AchievementsPage />);
        const badges = screen.getAllByTestId('achievement-badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('shows active quest count', () => {
        render(<AchievementsPage />);
        expect(screen.getByText(/1 active quests/i)).toBeTruthy();
    });
});
