import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { RadioButton } from './RadioButton';
import { careTheme } from '../../themes/care.theme';
import { healthTheme } from '../../themes/health.theme';
import { planTheme } from '../../themes/plan.theme';
import { colors } from '../../tokens/colors';

// Helper function to render a component with a specific theme
const renderWithTheme = (ui: React.ReactElement, theme: any) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('RadioButton component', () => {
    const defaultProps = {
        id: 'test-radio',
        name: 'test-group',
        value: 'test-value',
        label: 'Test Radio Button',
        onChange: jest.fn(),
        testID: 'radio-test-id',
    };

    it('renders correctly with label', () => {
        render(<RadioButton {...defaultProps} />);

        // Component renders a semantic <label> wrapper — no explicit role attribute
        const touchable = screen.getByTestId(defaultProps.testID);
        expect(touchable).toBeInTheDocument();

        // Check for the label text
        expect(screen.getByText('Test Radio Button')).toBeInTheDocument();

        // Check for the input element (hidden, aria-hidden for a11y)
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'radio');
    });

    it('applies correct styling when checked', () => {
        render(<RadioButton {...defaultProps} checked={true} />);

        // The hidden input should be checked (controls the value)
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        expect(input).toBeChecked();
    });

    it('applies correct styling when disabled', () => {
        render(<RadioButton {...defaultProps} disabled={true} />);

        // The hidden input should be disabled
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        expect(input).toBeDisabled();

        // The visual circle div (next sibling of hidden input) carries the cursor style
        const visualCircle = input.nextElementSibling as HTMLElement;
        expect(visualCircle).toHaveStyle('cursor: not-allowed');
    });

    it('calls onChange handler when clicked', () => {
        const mockOnChange = jest.fn();
        render(<RadioButton {...defaultProps} onChange={mockOnChange} />);

        // Clicking the input should trigger onChange
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        fireEvent.click(input);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('does not call onChange when disabled and clicked', () => {
        const mockOnChange = jest.fn();
        render(<RadioButton {...defaultProps} onChange={mockOnChange} disabled={true} />);

        // Clicking should not trigger onChange when disabled
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        fireEvent.click(input);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('applies health journey theme correctly', () => {
        renderWithTheme(<RadioButton {...defaultProps} checked={true} journey="health" />, healthTheme);

        // The visual circle <div> (next sibling of hidden input) carries background and border styles
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        const visualCircle = input.nextElementSibling as HTMLElement;

        expect(visualCircle).toHaveStyle(`background-color: ${colors.journeys.health.primary}`);
        expect(visualCircle).toHaveStyle(`border-color: ${colors.journeys.health.primary}`);
    });

    it('applies care journey theme correctly', () => {
        renderWithTheme(<RadioButton {...defaultProps} checked={true} journey="care" />, careTheme);

        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        const visualCircle = input.nextElementSibling as HTMLElement;

        expect(visualCircle).toHaveStyle(`background-color: ${colors.journeys.care.primary}`);
        expect(visualCircle).toHaveStyle(`border-color: ${colors.journeys.care.primary}`);
    });

    it('applies plan journey theme correctly', () => {
        renderWithTheme(<RadioButton {...defaultProps} checked={true} journey="plan" />, planTheme);

        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;
        const visualCircle = input.nextElementSibling as HTMLElement;

        expect(visualCircle).toHaveStyle(`background-color: ${colors.journeys.plan.primary}`);
        expect(visualCircle).toHaveStyle(`border-color: ${colors.journeys.plan.primary}`);
    });

    it('is accessible with keyboard navigation', () => {
        render(<RadioButton {...defaultProps} />);

        // The input should be focusable and have proper attributes
        const input = document.querySelector(`input#${defaultProps.id}`) as HTMLInputElement;

        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toHaveAttribute('name', defaultProps.name);
        expect(input).toHaveAttribute('id', defaultProps.id);

        input.focus();
        expect(document.activeElement).toBe(input);
    });

    it('renders with the correct test ID', () => {
        render(<RadioButton {...defaultProps} />);

        // The Touchable wrapper should have the testID
        expect(screen.getByTestId(defaultProps.testID)).toBeInTheDocument();
    });
});
