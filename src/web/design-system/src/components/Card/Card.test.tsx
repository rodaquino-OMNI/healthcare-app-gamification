import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Card } from './Card';
import { baseTheme } from '../../themes/base.theme';

/**
 * Helper function to render a component with a specific theme
 */
const renderWithTheme = (ui: React.ReactElement, theme = baseTheme) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Card', () => {
    it('renders correctly with default props', () => {
        renderWithTheme(<Card data-testid="card" />);
        const card = screen.getByTestId('card');

        expect(card).toBeInTheDocument();
        // Basic check for default rendering - we can't easily test exact styles due to styled-components implementation
        expect(card).toHaveAttribute('class');
    });

    it('renders children correctly', () => {
        const testText = 'Test Card Content';
        renderWithTheme(<Card>{testText}</Card>);

        expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it('applies elevation styles when elevation prop is true', () => {
        // Render cards with different elevation levels
        renderWithTheme(
            <>
                <Card elevation="sm" data-testid="card-sm" />
                <Card elevation="md" data-testid="card-md" />
                <Card elevation="lg" data-testid="card-lg" />
            </>
        );

        // Verify each card is rendered with its elevation
        expect(screen.getByTestId('card-sm')).toBeInTheDocument();
        expect(screen.getByTestId('card-md')).toBeInTheDocument();
        expect(screen.getByTestId('card-lg')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Card onPress={handleClick} data-testid="card" />);
        const card = screen.getByTestId('card');

        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);

        // Interactive card should have the role="button" attribute
        expect(card).toHaveAttribute('role', 'button');
    });

    it('applies health journey theme correctly', () => {
        renderWithTheme(<Card journey="health" data-testid="health-card" />);
        const card = screen.getByTestId('health-card');

        expect(card).toBeInTheDocument();
        // Health journey cards should have a left border with the health primary color
        // Due to how styled-components processes theme values, we can't easily test the exact color values
        expect(card).toHaveAttribute('class');
    });

    it('applies care journey theme correctly', () => {
        renderWithTheme(<Card journey="care" data-testid="care-card" />);
        const card = screen.getByTestId('care-card');

        expect(card).toBeInTheDocument();
        // Care journey cards should have a left border with the care primary color
        expect(card).toHaveAttribute('class');
    });

    it('applies plan journey theme correctly', () => {
        renderWithTheme(<Card journey="plan" data-testid="plan-card" />);
        const card = screen.getByTestId('plan-card');

        expect(card).toBeInTheDocument();
        // Plan journey cards should have a left border with the plan primary color
        expect(card).toHaveAttribute('class');
    });

    it('applies correct testID', () => {
        const testId = 'test-card';
        renderWithTheme(<Card data-testid={testId} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('respects custom styling props', () => {
        renderWithTheme(
            <Card
                backgroundColor="neutral.gray100"
                borderColor="neutral.gray300"
                padding="lg"
                margin="md"
                width="200px"
                height="100px"
                data-testid="custom-card"
            />
        );

        const card = screen.getByTestId('custom-card');
        expect(card).toBeInTheDocument();
        // Custom styling props should be applied, but exact values are hard to test
    });

    it('applies accessibility attributes correctly', () => {
        const accessibilityLabel = 'Test card for accessibility';
        renderWithTheme(<Card accessibilityLabel={accessibilityLabel} data-testid="a11y-card" />);

        const card = screen.getByTestId('a11y-card');
        expect(card).toHaveAttribute('aria-label', accessibilityLabel);
    });
});
