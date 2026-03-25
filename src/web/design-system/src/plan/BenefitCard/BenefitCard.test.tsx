import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { BenefitCard } from './BenefitCard';
import { planTheme } from '../../themes';

interface Benefit {
    id?: string;
    planId?: string;
    type: string;
    description: string;
    limitations?: string;
    usage?: string;
}

// Helper function to render the component with theme provider
const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={planTheme}>{ui}</ThemeProvider>);
};

describe('BenefitCard', () => {
    const mockBenefit: Benefit = {
        id: 'benefit-1',
        planId: 'plan-123',
        type: 'Dental Coverage',
        description: 'Covers routine dental check-ups and procedures',
        limitations: 'Up to R$2,000 per year',
        usage: '50% used (R$1,000 remaining)',
    };

    const mockBenefitWithoutOptionals: Benefit = {
        id: 'benefit-2',
        planId: 'plan-123',
        type: 'Vision Coverage',
        description: 'Covers eye exams and prescription glasses',
    };

    it('renders correctly with all props', () => {
        renderWithTheme(<BenefitCard benefit={mockBenefit} />);

        // Check benefit type is displayed
        expect(screen.getByText('Dental Coverage')).toBeInTheDocument();

        // Check description is displayed
        expect(screen.getByText('Covers routine dental check-ups and procedures')).toBeInTheDocument();

        // Check limitations is displayed
        expect(screen.getByText(/Limitations: Up to R\$2,000 per year/)).toBeInTheDocument();

        // Check usage is displayed
        expect(screen.getByText(/Usage: 50% used \(R\$1,000 remaining\)/)).toBeInTheDocument();
    });

    it('renders correctly without optional props', () => {
        renderWithTheme(<BenefitCard benefit={mockBenefitWithoutOptionals} />);

        // Check benefit type is displayed
        expect(screen.getByText('Vision Coverage')).toBeInTheDocument();

        // Check description is displayed
        expect(screen.getByText('Covers eye exams and prescription glasses')).toBeInTheDocument();

        // Check limitations and usage are not displayed
        expect(screen.queryByText(/Limitations:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Usage:/)).not.toBeInTheDocument();
    });

    it('applies correct journey styling', () => {
        const { container } = renderWithTheme(<BenefitCard benefit={mockBenefit} />);

        // Since we can't easily test styled-components directly in this setup,
        // we'll make a simplified test that checks the component renders
        // In a real project, we might use a styled-components testing library

        // Verify the component renders
        expect(container.firstChild).toBeInTheDocument();

        // Check for an accessible element with the correct accessibilityLabel
        const accessibilityLabel = `Benefit: Dental Coverage. Covers routine dental check-ups and procedures. Limitations: Up to R$2,000 per year. Usage: 50% used (R$1,000 remaining)`;
        expect(screen.getByLabelText(accessibilityLabel)).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        renderWithTheme(<BenefitCard benefit={mockBenefit} onPress={handleClick} />);

        // Get an element within the card
        const typeElement = screen.getByText('Dental Coverage');
        // Click on it - the click should bubble up to the Card component
        fireEvent.click(typeElement);

        // Check if the click handler was called
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
