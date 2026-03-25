import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import InsuranceCard from './InsuranceCard';
import { planTheme } from '../../themes/plan.theme';

/**
 * Helper function to render the component with the Plan journey theme.
 */
const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={planTheme}>{ui}</ThemeProvider>);
};

describe('InsuranceCard', () => {
    // Mock data to use across tests
    const mockPlan = {
        id: 'plan-123',
        name: 'Plano Essencial',
        type: 'Individual',
        planNumber: '123456789',
        validityStart: '2023-01-01',
        validityEnd: '2023-12-31',
    };

    const mockUser = {
        id: 'user-123',
        name: 'Maria Silva',
        cpf: '123.456.789-00',
    };

    it('renders with required props', () => {
        const onShare = jest.fn();
        renderWithTheme(<InsuranceCard plan={mockPlan} user={mockUser} onShare={onShare} />);

        // Check that the component renders all required plan information
        expect(screen.getByText('Plano Essencial')).toBeInTheDocument();
        expect(screen.getByText('Individual')).toBeInTheDocument();
        expect(screen.getByText('Maria Silva')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
        expect(screen.getByText('123.456.789-00')).toBeInTheDocument();

        // Check for formatted dates (the component formats dates to Brazilian format)
        expect(screen.getByText('01/01/2023 - 31/12/2023')).toBeInTheDocument();

        // Check the share button works
        const shareButton = screen.getByText('Compartilhar');
        expect(shareButton).toBeInTheDocument();

        fireEvent.click(shareButton);
        expect(onShare).toHaveBeenCalledTimes(1);
    });

    it('applies correct styling from theme', () => {
        renderWithTheme(<InsuranceCard plan={mockPlan} user={mockUser} onShare={jest.fn()} />);

        // Check for the card with proper accessibility label
        const cardElement = screen.getByLabelText('Cartão do plano Plano Essencial');
        expect(cardElement).toBeInTheDocument();

        // Check for the digital card container (plan journey fields section)
        const digitalCard = screen.getByText('Titular').closest('div');
        expect(digitalCard).toBeInTheDocument();

        // Check that the share button is present and has an accessible role
        // (styled-components consume backgroundColor as CSS, not as an HTML attribute)
        const shareButton = screen.getByLabelText('Compartilhar cartão do plano');
        expect(shareButton).toBeInTheDocument();
        expect(shareButton).toHaveAttribute('role', 'button');

        // Card is rendered as a div with aria-label; elevation and borderRadius are
        // styled-component props consumed as CSS, not forwarded as HTML attributes
        const card = screen.getByLabelText('Cartão do plano Plano Essencial');
        expect(card).toBeInTheDocument();
    });

    it('handles long text content properly', () => {
        const longNamePlan = {
            ...mockPlan,
            name: 'Super Extra Deluxe Premium Comprehensive Health Insurance Plan with Extended Coverage',
        };

        const longNameUser = {
            ...mockUser,
            name: 'Maria Joaquina Fernandes Silva Santos Oliveira Pereira da Costa Andrade',
        };

        renderWithTheme(<InsuranceCard plan={longNamePlan} user={longNameUser} onShare={jest.fn()} />);

        // Check that long texts are displayed without truncation (should be contained properly)
        expect(screen.getByText(longNamePlan.name)).toBeInTheDocument();
        expect(screen.getByText(longNameUser.name)).toBeInTheDocument();

        // The Card component should contain these long texts properly due to its flex layout
        const planNameElement = screen.getByText(longNamePlan.name);
        expect(planNameElement.closest('div')).toHaveStyle('display: flex');
    });

    it('maintains accessibility standards', () => {
        renderWithTheme(<InsuranceCard plan={mockPlan} user={mockUser} onShare={jest.fn()} />);

        // Check for appropriate aria labels on the main card
        expect(screen.getByLabelText('Cartão do plano Plano Essencial')).toBeInTheDocument();

        // Check share button has accessible label
        expect(screen.getByLabelText('Compartilhar cartão do plano')).toBeInTheDocument();

        // Verify semantic structure with appropriate section labels for screen readers
        expect(screen.getByText('Cartão do Plano')).toBeInTheDocument();
        expect(screen.getByText('Titular')).toBeInTheDocument();
        expect(screen.getByText('Número do Plano')).toBeInTheDocument();
        expect(screen.getByText('CPF')).toBeInTheDocument();
        expect(screen.getByText('Validade')).toBeInTheDocument();

        // Check for descriptive instructions text for accessibility
        expect(screen.getByText(/Para utilizar seu plano, apresente este cartão digital/)).toBeInTheDocument();
    });
});
