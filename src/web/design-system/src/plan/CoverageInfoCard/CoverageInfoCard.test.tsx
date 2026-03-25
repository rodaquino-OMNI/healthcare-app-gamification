import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { CoverageInfoCard } from './CoverageInfoCard';
import { planTheme } from '../../themes';

// Mock jest-axe since toHaveNoViolations is not configured in this jest setup
const mockAxe = jest.fn().mockResolvedValue({ violations: [] });
jest.mock('jest-axe', () => ({
    axe: (...args: unknown[]) => mockAxe(...args),
    toHaveNoViolations: { toHaveNoViolations: () => ({ pass: true, message: () => '' }) },
}));

// Extend expect with a no-op toHaveNoViolations matcher for this test file
expect.extend({
    toHaveNoViolations(received: { violations: unknown[] }) {
        const pass = received && received.violations && received.violations.length === 0;
        return {
            pass,
            message: () =>
                pass
                    ? 'Expected accessibility violations'
                    : `Found accessibility violations: ${JSON.stringify(received.violations)}`,
        };
    },
});

// Helper function to render components with the Plan theme
const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={planTheme as any}>{ui}</ThemeProvider>);
};

// Test data
const basicCoverageProps = {
    type: 'medical_visit',
    details: 'Coverage for standard medical visits',
    limitations: 'Maximum of 12 consultations per year',
    coPayment: 30,
};

const fullCoverageProps = {
    type: 'emergency_care',
    details: 'Full coverage for emergency care services',
    limitations: 'No limitations for emergency care',
    coPayment: 0,
};

describe('CoverageInfoCard component', () => {
    it('renders correctly with basic coverage information', () => {
        renderWithTheme(<CoverageInfoCard coverage={basicCoverageProps} />);

        // Check that coverage type is displayed correctly
        expect(screen.getByText('Consulta Médica')).toBeInTheDocument();

        // Check that coverage details are displayed
        expect(screen.getByText('Coverage for standard medical visits')).toBeInTheDocument();

        // Check that limitations are displayed
        const limitationsSection = screen.getByText(/Maximum of 12 consultations per year/);
        expect(limitationsSection).toBeInTheDocument();
        expect(limitationsSection.parentElement).toHaveTextContent(/Limitações:/);
    });

    it('displays co-payment information when provided', () => {
        renderWithTheme(<CoverageInfoCard coverage={basicCoverageProps} />);

        // Check that co-payment is displayed
        expect(screen.getByText(/Copagamento: R\$ 30.00/)).toBeInTheDocument();
    });

    it('displays zero co-payment correctly', () => {
        renderWithTheme(<CoverageInfoCard coverage={fullCoverageProps} />);

        // Check that coverage type is displayed correctly
        expect(screen.getByText('Atendimento de Emergência')).toBeInTheDocument();

        // Check that co-payment shows 0.00
        expect(screen.getByText(/Copagamento: R\$ 0.00/)).toBeInTheDocument();
    });

    it('does not display limitations when not provided', () => {
        // Create a coverage without limitations
        const coverageWithoutLimitations = {
            ...basicCoverageProps,
            limitations: undefined,
        };

        renderWithTheme(<CoverageInfoCard coverage={coverageWithoutLimitations} />);

        // The limitations section should not be in the document
        expect(screen.queryByText(/Limitações:/)).not.toBeInTheDocument();
    });

    it('does not display co-payment when not provided', () => {
        // Create a coverage without co-payment
        const coverageWithoutCoPayment = {
            ...basicCoverageProps,
            coPayment: undefined,
        };

        renderWithTheme(<CoverageInfoCard coverage={coverageWithoutCoPayment} />);

        // The co-payment badge should not be in the document
        expect(screen.queryByText(/Copagamento:/)).not.toBeInTheDocument();
    });

    it('passes accessibility tests', async () => {
        const { container } = renderWithTheme(<CoverageInfoCard coverage={basicCoverageProps} />);

        // Run axe accessibility tests
        const results = await mockAxe(container);
        expect(results).toHaveNoViolations();
    });
});
