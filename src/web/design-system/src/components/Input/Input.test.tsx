import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Input from './Input';
import { baseTheme } from '../../themes/base.theme';
import { healthTheme } from '../../themes/health.theme';
import { careTheme } from '../../themes/care.theme';
import { planTheme } from '../../themes/plan.theme';

/**
 * Helper function to render components with a specific theme
 */
const renderWithTheme = (ui: React.ReactElement, theme = baseTheme) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Input component', () => {
    it('renders correctly with default props', () => {
        renderWithTheme(<Input value="" onChange={() => {}} placeholder="Enter text" testID="test-input" />);

        const input = screen.getByTestId('test-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Enter text');
        expect(input).toHaveAttribute('type', 'text'); // default type is text
    });

    it('handles text input correctly', () => {
        const handleChange = jest.fn();
        renderWithTheme(<Input value="" onChange={handleChange} placeholder="Enter text" testID="test-input" />);

        const input = screen.getByTestId('test-input');
        fireEvent.change(input, { target: { value: 'Hello World' } });

        expect(handleChange).toHaveBeenCalled();
        // The mock function should have been called with an event object
        expect(handleChange.mock.calls[0][0].target.value).toBe('Hello World');
    });

    it('applies disabled styling when disabled', () => {
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Disabled input" disabled testID="test-input" />
        );

        const input = screen.getByTestId('test-input');
        expect(input).toBeDisabled();
        expect(input).toHaveAttribute('disabled');
    });

    it('renders with different input types', () => {
        // Test password type
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Password" type="password" testID="password-input" />
        );
        const passwordInput = screen.getByTestId('password-input');
        expect(passwordInput).toHaveAttribute('type', 'password');

        // Test email type
        renderWithTheme(<Input value="" onChange={() => {}} placeholder="Email" type="email" testID="email-input" />);
        const emailInput = screen.getByTestId('email-input');
        expect(emailInput).toHaveAttribute('type', 'email');

        // Test number type
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Number" type="number" testID="number-input" />
        );
        const numberInput = screen.getByTestId('number-input');
        expect(numberInput).toHaveAttribute('type', 'number');
    });

    it('applies journey-specific styling', () => {
        // Test health journey
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Health input" journey="health" testID="health-input" />,
            healthTheme
        );
        const healthInput = screen.getByTestId('health-input');
        expect(healthInput).toHaveAttribute('journey', 'health');

        // Test care journey
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Care input" journey="care" testID="care-input" />,
            careTheme
        );
        const careInput = screen.getByTestId('care-input');
        expect(careInput).toHaveAttribute('journey', 'care');

        // Test plan journey
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Plan input" journey="plan" testID="plan-input" />,
            planTheme
        );
        const planInput = screen.getByTestId('plan-input');
        expect(planInput).toHaveAttribute('journey', 'plan');
    });

    it('maintains accessibility attributes', () => {
        // Test with aria-label
        renderWithTheme(
            <Input
                value=""
                onChange={() => {}}
                placeholder="Accessible input"
                aria-label="Accessible input field"
                testID="test-input"
            />
        );

        const input = screen.getByTestId('test-input');
        expect(input).toHaveAttribute('aria-label', 'Accessible input field');

        // Test with a label (via aria-labelledby)
        renderWithTheme(
            <>
                <label id="input-label">Labeled Input</label>
                <Input
                    value=""
                    onChange={() => {}}
                    placeholder="Labeled input"
                    aria-labelledby="input-label"
                    testID="labeled-input"
                />
            </>
        );

        const labeledInput = screen.getByTestId('labeled-input');
        expect(labeledInput).toHaveAttribute('aria-labelledby', 'input-label');
    });

    it('handles focus and blur events', () => {
        renderWithTheme(<Input value="" onChange={() => {}} placeholder="Focus test" testID="focus-input" />);

        const input = screen.getByTestId('focus-input');

        // Focus the input
        fireEvent.focus(input);
        // Check that the input has focus
        expect(document.activeElement).toBe(input);

        // Blur the input
        fireEvent.blur(input);
        // Check that the input no longer has focus
        expect(document.activeElement).not.toBe(input);
    });
});
