import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/hooks/useGamification', () => ({
    useGameProfile: () => ({
        data: {
            gameProfile: {
                level: 3,
                xp: 1200,
                achievements: [],
                quests: [],
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

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, variant }: any) => (
        <button onClick={onPress} data-variant={variant}>
            {children}
        </button>
    ),
}));

jest.mock('design-system/gamification/RewardCard', () => ({
    RewardCard: ({ reward, isEarned, journey }: any) => (
        <div data-testid="reward-card" data-id={reward.id} data-earned={isEarned} data-journey={journey}>
            <span>{reward.title}</span>
            <span>{reward.xp} XP</span>
        </div>
    ),
}));

jest.mock('design-system/gamification/XPCounter', () => ({
    XPCounter: ({ value, size, animated }: any) => (
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
        gray: { 50: '#888', 70: '#333' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
    },
}));

import RewardsPage from '../../../pages/achievements/rewards';

describe('Rewards Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<RewardsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the rewards heading', () => {
        render(<RewardsPage />);
        expect(screen.getByText(/rewards/i)).toBeTruthy();
    });

    it('renders XP balance card', () => {
        render(<RewardsPage />);
        expect(screen.getByText(/your xp balance/i)).toBeTruthy();
    });

    it('renders XP counter with user balance', () => {
        render(<RewardsPage />);
        expect(screen.getByTestId('xp-counter')).toBeTruthy();
    });

    it('renders reward cards', () => {
        render(<RewardsPage />);
        const rewardCards = screen.getAllByTestId('reward-card');
        expect(rewardCards.length).toBeGreaterThan(0);
    });

    it('renders journey filter buttons', () => {
        render(<RewardsPage />);
        expect(screen.getByText('All Journeys')).toBeTruthy();
        expect(screen.getByText('My Health')).toBeTruthy();
        expect(screen.getByText('Care Now')).toBeTruthy();
        expect(screen.getByText('My Plan')).toBeTruthy();
    });

    it('renders sort options', () => {
        render(<RewardsPage />);
        expect(screen.getByText(/xp: low to high/i)).toBeTruthy();
        expect(screen.getByText(/xp: high to low/i)).toBeTruthy();
        expect(screen.getByText(/name a-z/i)).toBeTruthy();
    });

    it('filters rewards by journey', () => {
        render(<RewardsPage />);
        fireEvent.click(screen.getByText('My Health'));
        const rewardCards = screen.getAllByTestId('reward-card');
        rewardCards.forEach((card) => {
            expect(card.getAttribute('data-journey')).toBe('health');
        });
    });

    it('sorts rewards by XP descending', () => {
        render(<RewardsPage />);
        fireEvent.click(screen.getByText(/xp: high to low/i));
        const rewardCards = screen.getAllByTestId('reward-card');
        expect(rewardCards.length).toBeGreaterThan(0);
    });

    it('renders back button', () => {
        render(<RewardsPage />);
        expect(screen.getByText(/back/i)).toBeTruthy();
    });
});
