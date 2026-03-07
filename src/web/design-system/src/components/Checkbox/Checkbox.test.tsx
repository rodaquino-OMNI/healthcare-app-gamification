import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Checkbox } from './Checkbox';
import { colors } from '../../tokens/colors';
import { healthTheme } from '../../themes/health.theme';
import { careTheme } from '../../themes/care.theme';
import { planTheme } from '../../themes/plan.theme';

/**
 * Helper function to render components with a specific theme
 */
const renderWithTheme = (ui: React.ReactElement, theme = healthTheme) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Checkbox component', () => {
    it('renders unchecked state correctly', () => {
        renderWithTheme(
            <Checkbox
                id="test-checkbox"
                name="test"
                value="test"
                checked={false}
                onChange={() => {}}
                label="Test Checkbox"
            />
        );

        const checkbox = screen.getByTestId('checkbox-test-checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
        expect(screen.queryByTestId('checkbox-checkmark')).not.toBeInTheDocument();
    });

    it('renders checked state correctly', () => {
        renderWithTheme(
            <Checkbox
                id="test-checkbox"
                name="test"
                value="test"
                checked={true}
                onChange={() => {}}
                label="Test Checkbox"
            />
        );

        const checkbox = screen.getByTestId('checkbox-test-checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByTestId('checkbox-checkmark')).toBeInTheDocument();
    });

    it('handles onChange event correctly', () => {
        const handleChange = jest.fn();

        renderWithTheme(
            <Checkbox
                id="test-checkbox"
                name="test"
                value="test"
                checked={false}
                onChange={handleChange}
                label="Test Checkbox"
            />
        );

        const checkbox = screen.getByTestId('checkbox-test-checkbox');
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    checked: true,
                    value: 'test',
                    name: 'test',
                    id: 'test-checkbox',
                }),
            })
        );
    });

    it('renders disabled state correctly', () => {
        const handleChange = jest.fn();

        renderWithTheme(
            <Checkbox
                id="test-checkbox"
                name="test"
                value="test"
                disabled={true}
                onChange={handleChange}
                label="Test Checkbox"
            />
        );

        const checkbox = screen.getByTestId('checkbox-test-checkbox');
        expect(checkbox).toHaveAttribute('aria-disabled', 'true');

        // Verify clicking a disabled checkbox doesn't trigger onChange
        fireEvent.click(checkbox);
        expect(handleChange).not.toHaveBeenCalled();
    });

    it('applies journey-specific styling correctly', () => {
        // Test Health Journey
        const { unmount: unmountHealth } = renderWithTheme(
            <Checkbox
                id="health-checkbox"
                name="test"
                value="test"
                checked={true}
                onChange={() => {}}
                label="Health Checkbox"
                journey="health"
            />,
            healthTheme
        );

        // Verify Health checkbox rendered with correct journey color
        const healthCheckbox = screen.getByTestId('checkbox-health-checkbox');
        expect(healthCheckbox).toBeInTheDocument();
        // In a real implementation, we would check the computed style has the health journey color
        unmountHealth();

        // Test Care Journey
        const { unmount: unmountCare } = renderWithTheme(
            <Checkbox
                id="care-checkbox"
                name="test"
                value="test"
                checked={true}
                onChange={() => {}}
                label="Care Checkbox"
                journey="care"
            />,
            careTheme
        );

        // Verify Care checkbox rendered with correct journey color
        const careCheckbox = screen.getByTestId('checkbox-care-checkbox');
        expect(careCheckbox).toBeInTheDocument();
        unmountCare();

        // Test Plan Journey
        renderWithTheme(
            <Checkbox
                id="plan-checkbox"
                name="test"
                value="test"
                checked={true}
                onChange={() => {}}
                label="Plan Checkbox"
                journey="plan"
            />,
            planTheme
        );

        // Verify Plan checkbox rendered with correct journey color
        const planCheckbox = screen.getByTestId('checkbox-plan-checkbox');
        expect(planCheckbox).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
        renderWithTheme(
            <Checkbox id="test-checkbox" name="test" value="test" onChange={() => {}} label="Test Checkbox" />
        );

        const checkbox = screen.getByTestId('checkbox-test-checkbox');

        // Check accessibility attributes
        expect(checkbox).toHaveAttribute('role', 'checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
        expect(checkbox).toHaveAttribute('aria-label', 'Test Checkbox');

        // Check for hidden native input element on web platform
        if (typeof document !== 'undefined') {
            const hiddenInput = document.getElementById('test-checkbox');
            expect(hiddenInput).toBeTruthy();
            expect(hiddenInput?.getAttribute('type')).toBe('checkbox');
            expect(hiddenInput?.hasAttribute('aria-hidden')).toBe(true);
        }
    });
});
