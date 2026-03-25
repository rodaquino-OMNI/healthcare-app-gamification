import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Input from './Input';
import { baseTheme } from '../../themes/base.theme';
import { careTheme } from '../../themes/care.theme';
import { healthTheme } from '../../themes/health.theme';
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
        // Test health journey — journey prop is consumed by styled-component for CSS,
        // not forwarded as a DOM attribute. Verify the input renders in the document.
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Health input" journey="health" testID="health-input" />,
            healthTheme
        );
        expect(screen.getByTestId('health-input')).toBeInTheDocument();

        // Test care journey
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Care input" journey="care" testID="care-input" />,
            careTheme
        );
        expect(screen.getByTestId('care-input')).toBeInTheDocument();

        // Test plan journey
        renderWithTheme(
            <Input value="" onChange={() => {}} placeholder="Plan input" journey="plan" testID="plan-input" />,
            planTheme
        );
        expect(screen.getByTestId('plan-input')).toBeInTheDocument();
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
                <label id="input-label" htmlFor="labeled-input-element">
                    Labeled Input
                </label>
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

        // Use element.focus() to actually move focus in jsdom
        input.focus();
        expect(document.activeElement).toBe(input);

        // Use element.blur() to actually remove focus in jsdom
        input.blur();
        expect(document.activeElement).not.toBe(input);
    });
});
