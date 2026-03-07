import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
    Card: ({ children, ...props }: any) => (
        <div data-testid="card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, onPress, accessibilityLabel, disabled }: any) => (
        <button onClick={onPress} aria-label={accessibilityLabel} disabled={disabled} data-testid="button">
            {children}
        </button>
    ),
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children, status }: any) => (
        <span data-testid="badge" data-status={status}>
            {children}
        </span>
    ),
}));

jest.mock('src/web/design-system/src/components/ProgressBar/ProgressBar', () => ({
    ProgressBar: ({ current, total, ariaLabel }: any) => (
        <div role="progressbar" aria-label={ariaLabel} aria-valuenow={current} aria-valuemax={total} />
    ),
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        journeys: { care: { text: '#1e3a5f', primary: '#2e7cf6' } },
        gray: { 50: '#888' },
        semantic: { warning: '#f59e0b' },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
    },
}));

jest.mock('src/web/shared/constants/routes', () => ({
    WEB_CARE_ROUTES: {
        SYMPTOM_RECOMMENDATION: '/care/symptom-checker/recommendation',
    },
}));

import SymptomResultPage from '../../../pages/care/symptom-checker/result';

describe('Symptom Checker Result Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<SymptomResultPage />);
        expect(container).toBeTruthy();
    });

    it('renders the assessment results heading', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/assessment results/i)).toBeTruthy();
    });

    it('renders the disclaimer text', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/not a medical diagnosis/i)).toBeTruthy();
    });

    it('renders condition cards', () => {
        render(<SymptomResultPage />);
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders Upper Respiratory Infection condition', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/upper respiratory infection/i)).toBeTruthy();
    });

    it('renders Seasonal Allergies condition', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/seasonal allergies/i)).toBeTruthy();
    });

    it('renders progress bars for probability', () => {
        render(<SymptomResultPage />);
        const progressBars = screen.getAllByRole('progressbar');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('renders back button', () => {
        render(<SymptomResultPage />);
        expect(screen.getByRole('button', { name: /go back/i })).toBeTruthy();
    });

    it('renders view recommendations button', () => {
        render(<SymptomResultPage />);
        expect(screen.getByRole('button', { name: /view recommendations/i })).toBeTruthy();
    });
});
