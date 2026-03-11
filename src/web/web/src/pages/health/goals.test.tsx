import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import HealthGoalsPage from './goals';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/health/goals',
        asPath: '/health/goals',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useHealthMetrics', () => ({
    useHealthMetrics: () => ({ metrics: [], goals: [], loading: false, error: null }),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/components/forms/HealthGoalForm', () => ({
    HealthGoalForm: ({ onSubmit }: { onSubmit?: () => void }) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div data-testid="health-goal-form" onClick={onSubmit}>
            Form
        </div>
    ),
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: { title: string }) => <div data-testid="journey-header">{title}</div>,
}));

describe('HealthGoalsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<HealthGoalsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<HealthGoalsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
