import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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

jest.mock('design-system/gamification/QuestCard', () => ({
    QuestCard: ({ quest, progress, journey }: any) => (
        <div data-testid="quest-card" data-id={quest.id} data-journey={journey}>
            <span>{quest.title}</span>
            <span data-testid="quest-progress">{progress}</span>
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
        gray: { 10: '#f9fafb', 50: '#888', 70: '#333' },
        semantic: { success: '#22c55e' },
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

import QuestsPage from '../../../pages/achievements/quests';

describe('Quests Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<QuestsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the quests heading', () => {
        render(<QuestsPage />);
        expect(screen.getByText(/quests/i)).toBeTruthy();
    });

    it('renders quest cards', () => {
        render(<QuestsPage />);
        const questCards = screen.getAllByTestId('quest-card');
        expect(questCards.length).toBeGreaterThan(0);
    });

    it('renders status filter tabs', () => {
        render(<QuestsPage />);
        expect(screen.getByText('All')).toBeTruthy();
        expect(screen.getByText('Active')).toBeTruthy();
        expect(screen.getByText('Completed')).toBeTruthy();
    });

    it('renders journey filter buttons', () => {
        render(<QuestsPage />);
        expect(screen.getByText('All Journeys')).toBeTruthy();
        expect(screen.getByText('My Health')).toBeTruthy();
        expect(screen.getByText('Care Now')).toBeTruthy();
    });

    it('renders summary bar with counts', () => {
        render(<QuestsPage />);
        expect(screen.getByText('Active')).toBeTruthy();
        expect(screen.getByText('Completed')).toBeTruthy();
        expect(screen.getByText('Total')).toBeTruthy();
    });

    it('filters quests by active status', () => {
        render(<QuestsPage />);
        fireEvent.click(screen.getByText('Active'));
        const questCards = screen.getAllByTestId('quest-card');
        expect(questCards.length).toBeGreaterThan(0);
    });

    it('filters quests by completed status', () => {
        render(<QuestsPage />);
        fireEvent.click(screen.getByText('Completed'));
        const questCards = screen.getAllByTestId('quest-card');
        expect(questCards.length).toBeGreaterThan(0);
    });

    it('filters quests by journey', () => {
        render(<QuestsPage />);
        fireEvent.click(screen.getByText('My Health'));
        const questCards = screen.getAllByTestId('quest-card');
        questCards.forEach((card) => {
            expect(card.getAttribute('data-journey')).toBe('health');
        });
    });

    it('renders back button', () => {
        render(<QuestsPage />);
        expect(screen.getByText(/back/i)).toBeTruthy();
    });
});
